-- ============================================================================
-- Certificates — Phase 1: issuance + verification (schema layer).
-- Apply by hand in Supabase (Claude Code does not auto-apply).
--
-- A certificate is an ISSUED credential: one row per (user, course), created
-- only when the student has demonstrably completed the course. Competency is
-- SNAPSHOTTED at issue time (never null) so the credential reflects what was
-- actually demonstrated and survives later edits to questions/program tags —
-- consistent with the canon rule that competency is captured at insert and
-- never backfilled.
--
-- Grounded in the existing model (no invented tables):
--   courses -> chapters -> quizzes(quiz_type='chapter_end')
--   completion signal: user_progress.passed on every chapter_end quiz
--   demonstrated competency: quiz_attempt_answers.competency (snapshot on the
--     student's PASSED attempts for the course)
--   declared competency / credential name: program_certifications
--   admin gate: public.aos_is_admin()
--   holder display name: profiles.full_name
--
-- Scope: table + RLS + issuance fn + public verify fn + admin stats fn.
-- No frontend, no write-path auto-issuance trigger (issuance is an explicit
-- call — wired in the next step), no PII exposure.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1) Issued-certificates table (one per user+course).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id)    ON DELETE CASCADE,
  course_id         uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  -- snapshots taken at issue time (immutable record of the credential as earned)
  credential_name   text NOT NULL,
  competencies      text[] NOT NULL,            -- demonstrated/declared slugs; never empty
  overall_score     int,                        -- avg of passed chapter_end attempt scores
  holder_name       text,                       -- profiles.full_name at issue (display only)
  -- public, unguessable handle used by /verify/:code
  verification_code text NOT NULL UNIQUE,
  status            text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued','revoked')),
  issued_at         timestamptz NOT NULL DEFAULT now(),
  revoked_at        timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id),
  -- canon: a credential can never be issued without a competency snapshot
  CONSTRAINT certificates_competencies_not_empty CHECK (array_length(competencies, 1) >= 1)
);

CREATE INDEX IF NOT EXISTS idx_certificates_user    ON public.certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course  ON public.certificates (course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code    ON public.certificates (verification_code);


-- ----------------------------------------------------------------------------
-- 2) RLS — owner reads own, admin reads all. No client write path: rows are
--    created ONLY by the SECURITY DEFINER issuance function below, and public
--    verification goes through verify_certificate() (not a table SELECT).
-- ----------------------------------------------------------------------------
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own certificates"  ON public.certificates;
DROP POLICY IF EXISTS "Admins read certificates"     ON public.certificates;
CREATE POLICY "Users read own certificates" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read certificates" ON public.certificates
  FOR SELECT USING (public.aos_is_admin());


-- ----------------------------------------------------------------------------
-- 3) Issuance. Verifies completion, snapshots competency (never null), and
--    writes one row. Idempotent per (user, course). SECURITY DEFINER so it can
--    read progress/competency across tables under controlled logic.
--
--    p_course_id   course to certify
--    p_target_user defaults to the caller; an admin may issue for another user
--    p_force       admin-only override of the completion gate (manual issuance)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.issue_certificate(
  p_course_id   uuid,
  p_target_user uuid    DEFAULT NULL,
  p_force       boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user        uuid := COALESCE(p_target_user, auth.uid());
  v_is_admin    boolean := public.aos_is_admin();
  v_total       int;
  v_passed      int;
  v_competency  text[];
  v_credential  text;
  v_holder      text;
  v_score       int;
  v_code        text;
  v_existing    public.certificates%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'issue_certificate: no user in context';
  END IF;
  -- only an admin may issue on behalf of another user, or force-issue
  IF (p_target_user IS NOT NULL AND p_target_user <> auth.uid() AND NOT v_is_admin) THEN
    RAISE EXCEPTION 'issue_certificate: not authorized to issue for another user';
  END IF;
  IF (p_force AND NOT v_is_admin) THEN
    RAISE EXCEPTION 'issue_certificate: force issuance is admin-only';
  END IF;

  -- already issued? return it (idempotent)
  SELECT * INTO v_existing FROM public.certificates
   WHERE user_id = v_user AND course_id = p_course_id;
  IF FOUND THEN
    RETURN jsonb_build_object(
      'status', 'already_issued',
      'certificate_id', v_existing.id,
      'verification_code', v_existing.verification_code);
  END IF;

  -- completion gate: every chapter_end quiz in the course must be passed
  SELECT count(*) INTO v_total
    FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
   WHERE c.course_id = p_course_id AND q.quiz_type = 'chapter_end';

  SELECT count(DISTINCT up.quiz_id) INTO v_passed
    FROM public.user_progress up
    JOIN public.quizzes q ON q.id = up.quiz_id
    JOIN public.chapters c ON c.id = q.chapter_id
   WHERE c.course_id = p_course_id AND q.quiz_type = 'chapter_end'
     AND up.user_id = v_user AND up.passed IS TRUE;

  IF NOT p_force THEN
    IF v_total = 0 THEN
      RAISE EXCEPTION 'issue_certificate: course has no chapter_end quizzes to complete';
    END IF;
    IF v_passed < v_total THEN
      RAISE EXCEPTION 'issue_certificate: not eligible (passed % of % chapter quizzes)', v_passed, v_total;
    END IF;
  END IF;

  -- competency snapshot: prefer DEMONSTRATED (from the student's passed attempts),
  -- fall back to the program's DECLARED tags. Never issue without competency.
  SELECT ARRAY(
    SELECT DISTINCT a.competency
      FROM public.quiz_attempt_answers a
      JOIN public.quiz_attempts qa ON qa.id = a.attempt_id
      JOIN public.quizzes q       ON q.id  = qa.quiz_id
      JOIN public.chapters c      ON c.id  = q.chapter_id
     WHERE c.course_id = p_course_id
       AND qa.user_id = v_user AND qa.passed IS TRUE
       AND a.competency IS NOT NULL AND a.competency <> ''
     ORDER BY a.competency
  ) INTO v_competency;

  IF v_competency IS NULL OR array_length(v_competency, 1) IS NULL THEN
    SELECT pc.competency_tags INTO v_competency
      FROM public.program_certifications pc
     WHERE pc.course_id = p_course_id
     ORDER BY pc.is_published DESC, pc.version DESC
     LIMIT 1;
  END IF;

  IF v_competency IS NULL OR array_length(v_competency, 1) IS NULL THEN
    RAISE EXCEPTION 'issue_certificate: refusing to issue a competency-less certificate (no demonstrated or declared competency for course %)', p_course_id;
  END IF;

  -- credential name snapshot (program credential, else course title)
  SELECT pc.credential_name INTO v_credential
    FROM public.program_certifications pc
   WHERE pc.course_id = p_course_id
   ORDER BY pc.is_published DESC, pc.version DESC
   LIMIT 1;
  IF v_credential IS NULL THEN
    SELECT title || ' — Certificate of Completion' INTO v_credential
      FROM public.courses WHERE id = p_course_id;
  END IF;

  -- overall score snapshot (avg of the student's passed chapter_end attempts)
  SELECT round(avg(qa.score))::int INTO v_score
    FROM public.quiz_attempts qa
    JOIN public.quizzes q  ON q.id = qa.quiz_id
    JOIN public.chapters c ON c.id = q.chapter_id
   WHERE c.course_id = p_course_id AND q.quiz_type = 'chapter_end'
     AND qa.user_id = v_user AND qa.passed IS TRUE;

  SELECT full_name INTO v_holder FROM public.profiles WHERE user_id = v_user;

  -- unique, human-friendly public code: ALA-XXXX-XXXX (avoids ambiguous chars)
  LOOP
    v_code := 'ALA-' ||
      upper(substr(translate(encode(gen_random_bytes(6), 'base64'), '+/=OoIl01', 'AB23456789'), 1, 4)) || '-' ||
      upper(substr(translate(encode(gen_random_bytes(6), 'base64'), '+/=OoIl01', 'AB23456789'), 1, 4));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE verification_code = v_code);
  END LOOP;

  INSERT INTO public.certificates (
    user_id, course_id, credential_name, competencies, overall_score,
    holder_name, verification_code
  ) VALUES (
    v_user, p_course_id, v_credential, v_competency, v_score,
    v_holder, v_code
  )
  ON CONFLICT (user_id, course_id) DO NOTHING
  RETURNING * INTO v_existing;

  IF NOT FOUND THEN
    -- lost a race; return the row that won
    SELECT * INTO v_existing FROM public.certificates
     WHERE user_id = v_user AND course_id = p_course_id;
    RETURN jsonb_build_object('status', 'already_issued',
      'certificate_id', v_existing.id, 'verification_code', v_existing.verification_code);
  END IF;

  RETURN jsonb_build_object('status', 'issued',
    'certificate_id', v_existing.id, 'verification_code', v_existing.verification_code);
END;
$$;

REVOKE ALL ON FUNCTION public.issue_certificate(uuid, uuid, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.issue_certificate(uuid, uuid, boolean) TO authenticated;


-- ----------------------------------------------------------------------------
-- 4) Public verification. Given a code, confirms authenticity and returns
--    display-only fields (holder name is the point of a public credential).
--    No user_id, email, or scores leak. Revoked / unknown codes => valid:false.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verify_certificate(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.certificates%ROWTYPE;
BEGIN
  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RETURN jsonb_build_object('valid', false);
  END IF;

  SELECT * INTO r FROM public.certificates
   WHERE verification_code = upper(trim(p_code));

  IF NOT FOUND OR r.status <> 'issued' THEN
    RETURN jsonb_build_object('valid', false);
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'holder_name',      r.holder_name,
    'credential_name',  r.credential_name,
    'competencies',     to_jsonb(r.competencies),
    'issued_at',        r.issued_at,
    'verification_code', r.verification_code,
    'course_title',     (SELECT title FROM public.courses WHERE id = r.course_id)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;


-- ----------------------------------------------------------------------------
-- 5) Admin-only aggregate (counts only — no PII), for the founder dashboard.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.founder_certificate_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.aos_is_admin() THEN
    RAISE EXCEPTION 'founder_certificate_stats: admin only';
  END IF;

  SELECT jsonb_build_object(
    'total_issued',  (SELECT count(*) FROM public.certificates WHERE status = 'issued'),
    'total_revoked', (SELECT count(*) FROM public.certificates WHERE status = 'revoked'),
    'by_course', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'course_id', course_id,
               'credential_name', credential_name,
               'n', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (
        SELECT course_id, max(credential_name) AS credential_name, count(*) AS n
          FROM public.certificates WHERE status = 'issued'
         GROUP BY course_id) s)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.founder_certificate_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_certificate_stats() TO authenticated;


-- ============================================================================
-- VERIFICATION (run AFTER applying; read-only)
-- ============================================================================
-- (a) Table + competency-not-empty constraint exist:
--   SELECT column_name, data_type, is_nullable FROM information_schema.columns
--   WHERE table_schema='public' AND table_name='certificates' ORDER BY column_name;
--
-- (b) RLS on + two read policies:
--   SELECT relrowsecurity FROM pg_class WHERE oid='public.certificates'::regclass;  -- true
--   SELECT policyname, cmd FROM pg_policies
--   WHERE schemaname='public' AND tablename='certificates' ORDER BY policyname;
--
-- (c) Functions exist with expected grants:
--   SELECT proname FROM pg_proc WHERE proname IN
--   ('issue_certificate','verify_certificate','founder_certificate_stats');
--
-- (d) Smoke (as an admin, against a real completed user+course):
--   SELECT public.issue_certificate('<course_uuid>');                 -- {status:issued, code...}
--   SELECT public.verify_certificate('<code from above>');            -- {valid:true, ...}
--   SELECT public.verify_certificate('ALA-XXXX-YYYY');                -- {valid:false}
--   SELECT public.founder_certificate_stats();                        -- counts jsonb
--
-- ROLLBACK:
--   DROP FUNCTION IF EXISTS public.founder_certificate_stats();
--   DROP FUNCTION IF EXISTS public.verify_certificate(text);
--   DROP FUNCTION IF EXISTS public.issue_certificate(uuid, uuid, boolean);
--   DROP TABLE IF EXISTS public.certificates;
-- ============================================================================
