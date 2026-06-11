-- =============================================================================
-- Flagship course intelligence — separates the live production course from the
-- authoritative master curriculum AND adds program-level launch intelligence
-- (versioning, launch status/score, target market + salary band, owner).
--   is_flagship = true → measured by founder dashboards, NOT shown to students
--   (student portal keeps filtering is_published = true only).
-- Apply BY HAND in the Supabase SQL editor.
-- =============================================================================
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_flagship boolean NOT NULL DEFAULT false;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS flagship_version text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS curriculum_version text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS launch_status text NOT NULL DEFAULT 'draft'
  CHECK (launch_status IN ('draft','internal','beta','launch_ready','production'));
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS launch_score int NOT NULL DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS target_market text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS target_salary_low int;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS target_salary_high int;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS owner text;

CREATE INDEX IF NOT EXISTS idx_courses_flagship ON public.courses(is_flagship) WHERE is_flagship = true;

-- VERIFICATION:
-- SELECT title, is_flagship, flagship_version, curriculum_version, launch_status,
--        launch_score, target_market, target_salary_low, target_salary_high, owner
-- FROM public.courses WHERE is_flagship = true;
