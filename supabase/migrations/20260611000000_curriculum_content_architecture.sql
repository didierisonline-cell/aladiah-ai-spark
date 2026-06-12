-- =============================================================================
-- Curriculum Content Architecture v1.1 — Curriculum Intelligence edition.
-- First-class assets: simulations, portfolios, interview prep, AI-mentor prompts,
-- capstones, certifications. Designed ONCE to support all 28 programs + future
-- programs: quality scoring, launch readiness, employer alignment, AI-assisted
-- generation at scale. Builds on courses (programs) · chapters (modules) ·
-- videos (lessons) · quizzes.
--
-- ⚠️ Apply BY HAND in the Supabase SQL editor. Run the verification SELECT after.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Common asset intelligence columns (every asset table carries these):
--   lifecycle: status · completion_pct · version · is_published · created/updated
--   scoring:   readiness_score · quality_score
--   provenance:ai_generated · ai_reviewed · human_reviewed · author · approved_by/at · last_reviewed_at
--   metadata:  estimated_completion_minutes · difficulty_level · competency_tags ·
--              learning_objectives · industry_alignment

CREATE TABLE IF NOT EXISTS public.program_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  title text NOT NULL,
  order_index int DEFAULT 0,
  -- common lifecycle / scoring / provenance / metadata
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  completion_pct int NOT NULL DEFAULT 0,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  quality_score int NOT NULL DEFAULT 0,
  ai_generated boolean NOT NULL DEFAULT false,
  ai_reviewed boolean NOT NULL DEFAULT false,
  human_reviewed boolean NOT NULL DEFAULT false,
  author text,
  approved_by text,
  approved_at timestamptz,
  last_reviewed_at timestamptz,
  estimated_completion_minutes int,
  difficulty_level text,
  competency_tags text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  industry_alignment text[] DEFAULT '{}',
  -- simulation-specific
  level text DEFAULT 'beginner',
  scenario_type text,
  industry text,
  complexity text,
  role text,
  scenario jsonb DEFAULT '{}'::jsonb,
  expected_deliverables text[] DEFAULT '{}',
  grading_rubric jsonb DEFAULT '{}'::jsonb,
  scoring jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  title text NOT NULL,
  order_index int DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  completion_pct int NOT NULL DEFAULT 0,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  quality_score int NOT NULL DEFAULT 0,
  ai_generated boolean NOT NULL DEFAULT false,
  ai_reviewed boolean NOT NULL DEFAULT false,
  human_reviewed boolean NOT NULL DEFAULT false,
  author text,
  approved_by text,
  approved_at timestamptz,
  last_reviewed_at timestamptz,
  estimated_completion_minutes int,
  difficulty_level text,
  competency_tags text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  industry_alignment text[] DEFAULT '{}',
  -- portfolio-specific
  deliverable text,
  portfolio_category text,
  employer_value_score int DEFAULT 0,
  interview_relevance_score int DEFAULT 0,
  rubric jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_interview_prep (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  title text NOT NULL,
  order_index int DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  completion_pct int NOT NULL DEFAULT 0,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  quality_score int NOT NULL DEFAULT 0,
  ai_generated boolean NOT NULL DEFAULT false,
  ai_reviewed boolean NOT NULL DEFAULT false,
  human_reviewed boolean NOT NULL DEFAULT false,
  author text,
  approved_by text,
  approved_at timestamptz,
  last_reviewed_at timestamptz,
  estimated_completion_minutes int,
  difficulty_level text,
  competency_tags text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  industry_alignment text[] DEFAULT '{}',
  -- interview-specific
  kind text DEFAULT 'behavioral',
  company_type text,
  interview_stage text,
  questions jsonb DEFAULT '[]'::jsonb,
  expected_answers jsonb DEFAULT '[]'::jsonb,
  evaluation_criteria jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_ai_mentor_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  title text NOT NULL,
  order_index int DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  completion_pct int NOT NULL DEFAULT 0,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  quality_score int NOT NULL DEFAULT 0,
  ai_generated boolean NOT NULL DEFAULT false,
  ai_reviewed boolean NOT NULL DEFAULT false,
  human_reviewed boolean NOT NULL DEFAULT false,
  author text,
  approved_by text,
  approved_at timestamptz,
  last_reviewed_at timestamptz,
  estimated_completion_minutes int,
  difficulty_level text,
  competency_tags text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  industry_alignment text[] DEFAULT '{}',
  -- mentor-specific
  prompt text,
  activity text,
  mentor_persona text,
  coaching_type text,
  competency_area text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_capstones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  completion_pct int NOT NULL DEFAULT 0,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  quality_score int NOT NULL DEFAULT 0,
  ai_generated boolean NOT NULL DEFAULT false,
  ai_reviewed boolean NOT NULL DEFAULT false,
  human_reviewed boolean NOT NULL DEFAULT false,
  author text,
  approved_by text,
  approved_at timestamptz,
  last_reviewed_at timestamptz,
  estimated_completion_minutes int,
  difficulty_level text,
  competency_tags text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  industry_alignment text[] DEFAULT '{}',
  -- capstone-specific
  brief text,
  project_type text,
  business_domain text,
  estimated_hours int,
  rubric jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  credential_name text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  completion_pct int NOT NULL DEFAULT 0,
  version int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false,
  readiness_score int NOT NULL DEFAULT 0,
  quality_score int NOT NULL DEFAULT 0,
  ai_generated boolean NOT NULL DEFAULT false,
  ai_reviewed boolean NOT NULL DEFAULT false,
  human_reviewed boolean NOT NULL DEFAULT false,
  author text,
  approved_by text,
  approved_at timestamptz,
  last_reviewed_at timestamptz,
  estimated_completion_minutes int,
  difficulty_level text,
  competency_tags text[] DEFAULT '{}',
  learning_objectives text[] DEFAULT '{}',
  industry_alignment text[] DEFAULT '{}',
  -- certification-specific
  exam_blueprint jsonb DEFAULT '{}'::jsonb,
  passing_score int DEFAULT 85,
  exam_duration int,
  credential_level text,
  completion_logic jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS + triggers + indexes for all six
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

-- Authoritative readiness VIEW (published counts; security_invoker enforces RLS)
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
  WHERE c.is_published = true OR COALESCE(c.is_flagship, false) = true
), scored AS (
  SELECT b.*, round(100 * (
    0.12 * least(modules / 18.0, 1) + 0.18 * least(lessons / 162.0, 1) +
    0.12 * least(quizzes / 18.0, 1) + 0.18 * least(simulations / 54.0, 1) +
    0.12 * least(portfolios / 18.0, 1) + 0.08 * least(interview_prep / 18.0, 1) +
    0.05 * least(ai_mentor_prompts / 18.0, 1) + 0.08 * least(capstones / 1.0, 1) +
    0.07 * least(certifications / 1.0, 1)
  ))::int AS readiness_score FROM base b
)
SELECT s.*,
  (s.readiness_score >= 90
   AND lessons > 0 AND quizzes > 0 AND simulations > 0 AND portfolios > 0
   AND interview_prep > 0 AND ai_mentor_prompts > 0 AND capstones > 0 AND certifications > 0) AS launch_ready
FROM scored s;

-- VERIFICATION (Content Completion Matrix):
-- SELECT program, modules, lessons, quizzes, simulations, portfolios, interview_prep,
--        ai_mentor_prompts, capstones, certifications, readiness_score, launch_ready
-- FROM public.program_content_readiness ORDER BY readiness_score DESC;
