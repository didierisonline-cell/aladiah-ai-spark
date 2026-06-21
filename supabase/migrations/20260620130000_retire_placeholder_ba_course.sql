-- ============================================================================
-- Retire the placeholder "AI Business Analyst" course from student visibility.
-- Apply by hand in Supabase (Claude Code does not auto-apply).
--
-- Why: the `seed-ai-business-analyst` course is a TEMPLATED PROTOTYPE — its 70
-- lesson bodies are machine-sliced from the module description (Module-1 lessons
-- 1.2–1.6 are byte-identical) and every lesson's quiz is the same 2 boilerplate
-- questions. It must not be student-visible. Student course lists filter
-- is_published = true, so unpublishing hides it while preserving the row as an
-- internal prototype. The launch-grade BA curriculum is authored separately
-- (docs/curriculum/business-analyst-v1/00_AUTHORING_BLUEPRINT.md).
--
-- This is reversible (set is_published = true to restore).
-- ============================================================================

UPDATE public.courses
   SET is_published = false
 WHERE title = 'AI Business Analyst';

-- VERIFICATION (run after; expect is_published = false, or 0 rows if not seeded):
--   SELECT id, title, is_published FROM public.courses WHERE title = 'AI Business Analyst';
--
-- Confirm it no longer appears to students (mirrors PortalCourses.tsx filter):
--   SELECT count(*) FROM public.courses WHERE is_published = true AND title = 'AI Business Analyst';  -- expect 0
--
-- ROLLBACK (restore visibility):
--   UPDATE public.courses SET is_published = true WHERE title = 'AI Business Analyst';
