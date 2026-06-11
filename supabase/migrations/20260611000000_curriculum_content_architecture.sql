-- =============================================================================
-- Curriculum Content Architecture v1.0
-- Makes simulations, portfolios, interview prep, AI-mentor prompts, capstones,
-- and certifications FIRST-CLASS Supabase entities so launch readiness is
-- traceable to authored content (no code-only assumptions).
--
-- Builds on existing: courses (programs) · chapters (modules) · videos (lessons)
-- · quizzes. Adds 6 content tables + a readiness VIEW.
--
-- ⚠️ Apply BY HAND in the Supabase SQL editor. Claude Code does not auto-apply.
--    Run the verification SELECT at the bottom afterwards.
-- =============================================================================

-- Shared updated_at trigger -------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Each asset carries the common lifecycle columns the founder requires:
--   status · completion_pct · author · version · created/updated · is_published · readiness_score
-- Module-level assets reference chapter_id; program-level (capstone/cert) leave it null.

CREATE TABLE IF NOT EXISTS public.program_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  title text NOT NULL,
  level text DEFAULT 'beginner',            -- beginner | intermediate | advanced
  scenario jsonb DEFAULT '{}'::jsonb,
  scoring jsonb DEFAULT '{}'::jsonb,
  order_index int DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',     -- draft|in_review|approved|published|archived
  completion_pct int NOT NULL DEFAULT 0,
  author text,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  title text NOT NULL,
  deliverable text,
  rubric jsonb DEFAULT '{}'::jsonb,
  order_index int DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  completion_pct int NOT NULL DEFAULT 0,
  author text,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_interview_prep (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  title text NOT NULL,
  kind text DEFAULT 'behavioral',           -- behavioral | scenario | leadership
  questions jsonb DEFAULT '[]'::jsonb,
  order_index int DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  completion_pct int NOT NULL DEFAULT 0,
  author text,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_ai_mentor_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  title text NOT NULL,
  prompt text,
  activity text,
  order_index int DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  completion_pct int NOT NULL DEFAULT 0,
  author text,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_capstones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  brief text,
  rubric jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  completion_pct int NOT NULL DEFAULT 0,
  author text,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  credential_name text NOT NULL,
  exam_blueprint jsonb DEFAULT '{}'::jsonb,
  passing_score int DEFAULT 85,
  completion_logic jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  completion_pct int NOT NULL DEFAULT 0,
  author text,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS + triggers + indexes for all six (admin write via aos_is_admin; published readable)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'program_simulations','program_portfolios','program_interview_prep',
    'program_ai_mentor_prompts','program_capstones','program_certifications'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "admin manage %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "admin manage %1$s" ON public.%1$I FOR ALL USING (public.aos_is_admin()) WITH CHECK (public.aos_is_admin());', t);
    EXECUTE format('DROP POLICY IF EXISTS "read published %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "read published %1$s" ON public.%1$I FOR SELECT USING (is_published = true);', t);
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%1$s_updated ON public.%1$I;', t);
    EXECUTE format('CREATE TRIGGER trg_%1$s_updated BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%1$s_course ON public.%1$I(course_id);', t);
  END LOOP;
END $$;

-- =============================================================================
-- Authoritative readiness VIEW — every score traceable to authored rows.
-- Counts PUBLISHED assets (launch readiness = what is actually shippable).
-- security_invoker so RLS of the querying user (founder/admin) is enforced.
-- =============================================================================
CREATE OR REPLACE VIEW public.program_content_readiness
WITH (security_invoker = true) AS
WITH base AS (
  SELECT c.id AS course_id, c.title AS program,
    (SELECT count(*) FROM public.chapters ch WHERE ch.course_id = c.id) AS modules,
    (SELECT count(*) FROM public.videos v JOIN public.chapters ch ON ch.id = v.chapter_id WHERE ch.course_id = c.id) AS lessons,
    (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id = q.chapter_id WHERE ch.course_id = c.id AND q.quiz_type = 'chapter_end') AS quizzes,
    (SELECT count(*) FROM public.program_simulations s WHERE s.course_id = c.id AND s.is_published) AS simulations,
    (SELECT count(*) FROM public.program_portfolios p WHERE p.course_id = c.id AND p.is_published) AS portfolios,
    (SELECT count(*) FROM public.program_interview_prep i WHERE i.course_id = c.id AND i.is_published) AS interview_prep,
    (SELECT count(*) FROM public.program_ai_mentor_prompts m WHERE m.course_id = c.id AND m.is_published) AS ai_mentor_prompts,
    (SELECT count(*) FROM public.program_capstones cap WHERE cap.course_id = c.id AND cap.is_published) AS capstones,
    (SELECT count(*) FROM public.program_certifications cert WHERE cert.course_id = c.id AND cert.is_published) AS certifications
  FROM public.courses c
  WHERE c.is_published = true
)
SELECT b.*,
  round(100 * (
    0.12 * least(modules / 18.0, 1) +
    0.18 * least(lessons / 162.0, 1) +
    0.12 * least(quizzes / 18.0, 1) +
    0.18 * least(simulations / 54.0, 1) +
    0.12 * least(portfolios / 18.0, 1) +
    0.08 * least(interview_prep / 18.0, 1) +
    0.05 * least(ai_mentor_prompts / 18.0, 1) +
    0.08 * least(capstones / 1.0, 1) +
    0.07 * least(certifications / 1.0, 1)
  ))::int AS readiness_score,
  (round(100 * (
    0.12 * least(modules / 18.0, 1) + 0.18 * least(lessons / 162.0, 1) +
    0.12 * least(quizzes / 18.0, 1) + 0.18 * least(simulations / 54.0, 1) +
    0.12 * least(portfolios / 18.0, 1) + 0.08 * least(interview_prep / 18.0, 1) +
    0.05 * least(ai_mentor_prompts / 18.0, 1) + 0.08 * least(capstones / 1.0, 1) +
    0.07 * least(certifications / 1.0, 1)
  ))::int >= 90) AS launch_ready
FROM base b;

-- =============================================================================
-- VERIFICATION (run after apply) — the live Content Completion Matrix:
-- SELECT program, modules, lessons, quizzes, simulations, portfolios,
--        interview_prep, ai_mentor_prompts, capstones, certifications,
--        readiness_score, launch_ready
-- FROM public.program_content_readiness
-- ORDER BY readiness_score DESC;
-- =============================================================================
