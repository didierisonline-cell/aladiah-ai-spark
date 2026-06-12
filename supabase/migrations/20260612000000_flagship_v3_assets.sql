-- =============================================================================
-- Flagship v3 asset types — extends the curriculum content architecture with:
--   program_executive_simulations   (Modules 6,8,10,13,15,18)
--   program_ai_copilot_challenges    (all 18 modules)
--   program_employer_validation      (employer validation checkpoints)
--   program_labs                     (hands-on labs — required for launch)
-- Same intelligence column set as the v1.1 asset tables. The Enterprise
-- Transformation Capstone reuses public.program_capstones (seeded by the app).
-- Apply BY HAND in the Supabase SQL editor (after the v1.1 + published_at migs).
-- Requires public.aos_is_admin().
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.program_executive_simulations (
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
  author text, approved_by text, approved_at timestamptz, published_at timestamptz, last_reviewed_at timestamptz,
  estimated_completion_minutes int, difficulty_level text,
  competency_tags text[] DEFAULT '{}', learning_objectives text[] DEFAULT '{}', industry_alignment text[] DEFAULT '{}',
  -- executive-specific
  crisis_type text,
  exec_stakeholders text[] DEFAULT '{}',
  board_presentation boolean DEFAULT false,
  scenario jsonb DEFAULT '{}'::jsonb,
  grading_rubric jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_ai_copilot_challenges (
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
  author text, approved_by text, approved_at timestamptz, published_at timestamptz, last_reviewed_at timestamptz,
  estimated_completion_minutes int, difficulty_level text,
  competency_tags text[] DEFAULT '{}', learning_objectives text[] DEFAULT '{}', industry_alignment text[] DEFAULT '{}',
  -- copilot-specific
  ai_tool text,
  challenge text,
  expected_output text,
  evaluation_criteria jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_employer_validation (
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
  author text, approved_by text, approved_at timestamptz, published_at timestamptz, last_reviewed_at timestamptz,
  estimated_completion_minutes int, difficulty_level text,
  competency_tags text[] DEFAULT '{}', learning_objectives text[] DEFAULT '{}', industry_alignment text[] DEFAULT '{}',
  -- employer-validation-specific
  employer text,
  checkpoint text,
  validation_criteria jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_labs (
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
  author text, approved_by text, approved_at timestamptz, published_at timestamptz, last_reviewed_at timestamptz,
  estimated_completion_minutes int, difficulty_level text,
  competency_tags text[] DEFAULT '{}', learning_objectives text[] DEFAULT '{}', industry_alignment text[] DEFAULT '{}',
  -- lab-specific
  tool text,
  task text,
  deliverable text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS + triggers + indexes for the four new tables
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'program_executive_simulations','program_ai_copilot_challenges',
    'program_employer_validation','program_labs'
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
