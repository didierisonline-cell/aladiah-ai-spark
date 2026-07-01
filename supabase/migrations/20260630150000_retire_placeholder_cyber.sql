-- Retire the legacy "Cybersecurity Professional Certification" placeholder.
-- The course has been superseded by "AI Cybersecurity, Governance & Enterprise
-- Compliance" (curriculum_version = 'cyber-v1'), published 2026-06-30.
-- Setting is_published = false hides it from the student portal while
-- preserving the row. Reversible: SET is_published = true to restore.

UPDATE public.courses
SET is_published = false
WHERE title = 'Cybersecurity Professional Certification';

-- VERIFICATION (expect is_published = false):
-- SELECT id, title, is_published, curriculum_version
-- FROM public.courses
-- WHERE title = 'Cybersecurity Professional Certification';
