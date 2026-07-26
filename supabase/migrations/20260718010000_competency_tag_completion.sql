-- =============================================================================
-- GOLD STANDARD — competency tag completion (the last 84 untagged questions)
--
-- Live-DB diagnosis (2026-07-18, read-only) found exactly three gaps:
--   Scrum M12 "Coaching & Team Dynamics"  — 30 questions, competency NULL
--   Scrum M17 "AI for the Scrum Master"   — 40 questions, competency NULL
--   Cyber M18 "Enterprise Capstone"       — 14 questions, competency NULL
--
-- Tags assigned from the ratified taxonomy (docs/standards/COMPETENCY_TAXONOMY.md):
--   M12 → scrum:team-dynamics       (exact match)
--   M17 → scrum:ai-augmentation     (NEW slug — ratified with this change)
--   M18 → cyber:security-leadership (capstone = full-engagement leadership)
--
-- NOTE: this updates QUESTION rows only. Past attempt rows keep their
-- snapshotted values (never backfilled — CLAUDE.md rule). Future attempts
-- snapshot the corrected competency.
--
-- REVIEWABLE SQL — apply by hand in Supabase SQL Editor. Idempotent
-- (only touches rows where competency IS NULL). Verify with the SELECT below.
-- =============================================================================

-- Scrum M12 → scrum:team-dynamics
UPDATE public.quiz_questions qq
SET competency = 'scrum:team-dynamics'
FROM public.quizzes z
JOIN public.chapters ch ON ch.id = z.chapter_id
JOIN public.courses co ON co.id = ch.course_id
WHERE qq.quiz_id = z.id AND z.quiz_type = 'chapter_end'
  AND co.curriculum_version = 'v3.0' AND ch.order_index = 12
  AND qq.competency IS NULL;

-- Scrum M17 → scrum:ai-augmentation
UPDATE public.quiz_questions qq
SET competency = 'scrum:ai-augmentation'
FROM public.quizzes z
JOIN public.chapters ch ON ch.id = z.chapter_id
JOIN public.courses co ON co.id = ch.course_id
WHERE qq.quiz_id = z.id AND z.quiz_type = 'chapter_end'
  AND co.curriculum_version = 'v3.0' AND ch.order_index = 17
  AND qq.competency IS NULL;

-- Cyber M18 → cyber:security-leadership
UPDATE public.quiz_questions qq
SET competency = 'cyber:security-leadership'
FROM public.quizzes z
JOIN public.chapters ch ON ch.id = z.chapter_id
JOIN public.courses co ON co.id = ch.course_id
WHERE qq.quiz_id = z.id AND z.quiz_type = 'chapter_end'
  AND co.curriculum_version = 'cyber-v1' AND ch.order_index = 18
  AND qq.competency IS NULL;

-- ── Verification (must return zero rows) ─────────────────────────────────────
SELECT co.curriculum_version, ch.order_index, count(*) AS still_null
FROM public.quiz_questions qq
JOIN public.quizzes z ON z.id = qq.quiz_id AND z.quiz_type = 'chapter_end'
JOIN public.chapters ch ON ch.id = z.chapter_id
JOIN public.courses co ON co.id = ch.course_id
WHERE co.curriculum_version IN ('v3.0','pm-v1','ba-v1','da-v1','cyber-v1')
  AND qq.competency IS NULL
GROUP BY 1, 2;
