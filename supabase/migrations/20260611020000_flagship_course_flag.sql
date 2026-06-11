-- =============================================================================
-- Flagship course flag — complete separation between the live production course
-- and the authoritative master curriculum.
--   is_flagship = true  → measured by founder dashboards, NOT shown to students
--   (student portal keeps filtering is_published = true only).
-- Apply BY HAND in the Supabase SQL editor.
-- =============================================================================
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_flagship boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_courses_flagship ON public.courses(is_flagship) WHERE is_flagship = true;

-- VERIFICATION:
-- SELECT title, is_published, is_flagship FROM public.courses WHERE is_flagship = true;
