-- =============================================================================
-- Publish Scrum v2 flagship so students can see it in the portal course catalog.
--
-- Root cause: PortalCourses.tsx filters is_published = true (student-safe), but
-- the canonical Scrum v2 row only had is_flagship = true, making it visible to
-- founders via listManagedCourses() but invisible to enrolled students.
--
-- This migration sets both flags on the one canonical course:
--   id:    f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14
--   title: AI Scrum Master Professional Certification v2
-- =============================================================================

BEGIN;

UPDATE courses
SET
  is_published = true,
  is_flagship  = true
WHERE id = 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';

-- Verify exactly 1 row was updated and the flags are now correct.
-- Expected: 1 row, is_published=true, is_flagship=true
SELECT id, title, is_published, is_flagship
FROM   courses
WHERE  id = 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';

COMMIT;
