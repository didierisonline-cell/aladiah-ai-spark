-- =============================================================================
-- Publish: AI Project Manager & Delivery Leader (pm-v1)
-- Retire:  Project Management Professional Certification
-- Apply LAST — after all structure, content, quiz, and sim migrations.
-- =============================================================================

-- 1) Retire old PM course
UPDATE public.courses
SET is_published  = false,
    launch_status = 'internal',
    updated_at    = now()
WHERE title = 'Project Management Professional Certification';

-- 2) Publish new 18-module PM course
UPDATE public.courses
SET is_published  = true,
    launch_status = 'production',
    updated_at    = now()
WHERE title             = 'AI Project Manager & Delivery Leader'
  AND curriculum_version = 'pm-v1';

-- =============================================================================
-- Verify
-- =============================================================================
SELECT title,
       is_published,
       launch_status,
       curriculum_version
FROM public.courses
WHERE title IN (
  'AI Project Manager & Delivery Leader',
  'Project Management Professional Certification'
)
ORDER BY is_published DESC;
-- Expected:
--   AI Project Manager & Delivery Leader  | true  | production | pm-v1
--   Project Management Professional Cert… | false | internal   | …
