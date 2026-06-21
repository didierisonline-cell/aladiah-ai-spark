-- =============================================================================
-- Completion engine: capstone submission + certificate issuance + eligibility gate.
-- Hybrid completion bar (founder-ratified 2026-06-21): a student completes a
-- program by PASSING every chapter_end module exam AND having an APPROVED capstone
-- submission -> certificate is issued. Program-agnostic: works for any course with
-- chapter_end exams + a capstone submission (BA first; reused by every program).
--
-- Canon: competency is SNAPSHOTTED at issue time (never NULL). Reviewable SQL,
-- applied by hand. No live writes from Claude Code.
-- =============================================================================

-- 1) Per-student capstone submission (mirrors student_labs ownership pattern) ---
CREATE TABLE IF NOT EXISTS public.capstone_submissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id    uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  artifacts    jsonb NOT NULL DEFAULT '[]'::jsonb,   -- [{label, url|text}] (P1..P8 + deck)
  narrative    text,
  status       text NOT NULL DEFAULT 'submitted'
                 CHECK (status IN ('draft','submitted','approved','revisions_requested')),
  reviewer_score int,
  reviewed_by  text,
  reviewed_at  timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
ALTER TABLE public.capstone_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "students manage own capstone" ON public.capstone_submissions;
CREATE POLICY "students manage own capstone" ON public.capstone_submissions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "admins review capstones" ON public.capstone_submissions;
CREATE POLICY "admins review capstones" ON public.capstone_submissions
  FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 2) Per-student issued certificate (insert only via issuance fn) --------------
CREATE TABLE IF NOT EXISTS public.course_certificates (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id           uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  credential_name     text NOT NULL,
  certificate_number  text NOT NULL UNIQUE,
  competency_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb,  -- demonstrated slugs, never NULL
  exam_summary        jsonb NOT NULL DEFAULT '{}'::jsonb,  -- {exams_total, exams_passed}
  capstone_submission_id uuid REFERENCES public.capstone_submissions(id) ON DELETE SET NULL,
  issued_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "students view own certificates" ON public.course_certificates;
CREATE POLICY "students view own certificates" ON public.course_certificates
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admins view all certificates" ON public.course_certificates;
CREATE POLICY "admins view all certificates" ON public.course_certificates
  FOR SELECT USING (public.is_admin(auth.uid()));

-- 3) Completion status for the current user (drives the portal progress UI) ----
CREATE OR REPLACE FUNCTION public.course_completion_status(p_course uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  exams_total int;
  exams_passed int;
  cap_status text;
  has_cert boolean;
BEGIN
  IF uid IS NULL THEN RETURN jsonb_build_object('error','not authenticated'); END IF;

  SELECT count(*) INTO exams_total
  FROM public.quizzes q JOIN public.chapters ch ON ch.id = q.chapter_id
  WHERE ch.course_id = p_course AND q.quiz_type = 'chapter_end';

  SELECT count(DISTINCT up.quiz_id) INTO exams_passed
  FROM public.user_progress up
  JOIN public.quizzes q ON q.id = up.quiz_id AND q.quiz_type = 'chapter_end'
  JOIN public.chapters ch ON ch.id = q.chapter_id
  WHERE ch.course_id = p_course AND up.user_id = uid AND up.passed = true;

  SELECT status INTO cap_status FROM public.capstone_submissions
   WHERE user_id = uid AND course_id = p_course;

  SELECT EXISTS(SELECT 1 FROM public.course_certificates
                 WHERE user_id = uid AND course_id = p_course) INTO has_cert;

  RETURN jsonb_build_object(
    'exams_total', exams_total,
    'exams_passed', exams_passed,
    'exams_complete', (exams_total > 0 AND exams_passed >= exams_total),
    'capstone_status', COALESCE(cap_status, 'none'),
    'capstone_approved', (cap_status = 'approved'),
    'certificate_issued', has_cert,
    'eligible', (exams_total > 0 AND exams_passed >= exams_total AND cap_status = 'approved' AND NOT has_cert)
  );
END;
$$;

-- 4) Issue the certificate (idempotent; snapshots competency at issue) ---------
CREATE OR REPLACE FUNCTION public.issue_course_certificate(p_course uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  st jsonb;
  existing uuid;
  cap_id uuid;
  cred text;
  comps jsonb;
  cert_no text;
  new_id uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT id INTO existing FROM public.course_certificates WHERE user_id = uid AND course_id = p_course;
  IF existing IS NOT NULL THEN RETURN existing; END IF;   -- idempotent

  st := public.course_completion_status(p_course);
  IF NOT (st->>'eligible')::boolean THEN
    RAISE EXCEPTION 'not eligible: %', st::text;
  END IF;

  SELECT id INTO cap_id FROM public.capstone_submissions
   WHERE user_id = uid AND course_id = p_course AND status = 'approved';

  SELECT COALESCE(NULLIF(title,''), 'Aladiah Program') INTO cred FROM public.courses WHERE id = p_course;

  -- competency snapshot = distinct slugs the course actually assesses (never NULL)
  SELECT COALESCE(jsonb_agg(DISTINCT qq.competency), '[]'::jsonb) INTO comps
  FROM public.quiz_questions qq
  JOIN public.quizzes q ON q.id = qq.quiz_id AND q.quiz_type = 'chapter_end'
  JOIN public.chapters ch ON ch.id = q.chapter_id
  WHERE ch.course_id = p_course AND qq.competency IS NOT NULL AND qq.competency <> '';

  cert_no := 'ALA-' || to_char(now(),'YYYY') || '-' ||
             upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));

  INSERT INTO public.course_certificates
    (user_id, course_id, credential_name, certificate_number, competency_snapshot,
     exam_summary, capstone_submission_id)
  VALUES (uid, p_course, cred, cert_no, comps,
     jsonb_build_object('exams_total', st->'exams_total', 'exams_passed', st->'exams_passed'),
     cap_id)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.course_completion_status(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.issue_course_certificate(uuid) TO authenticated;

-- =============================================================================
-- VERIFICATION (after apply):
--   SELECT public.course_completion_status('<ba_course_id>');   -- as a student
--   -- expect exams_total=14; after passing all + approved capstone, eligible=true
--   SELECT public.issue_course_certificate('<ba_course_id>');   -- returns cert id
--   SELECT certificate_number, competency_snapshot, exam_summary
--     FROM public.course_certificates WHERE user_id = auth.uid();
-- Structure check:
--   SELECT table_name FROM information_schema.tables
--    WHERE table_name IN ('capstone_submissions','course_certificates');  -- 2 rows
-- =============================================================================
