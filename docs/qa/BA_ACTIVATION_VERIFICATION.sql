-- =============================================================================
-- BA ACTIVATION GATE — verification SELECT (READ-ONLY, safe to run)
-- Program: AI Business Analyst (curriculum_version = 'ba-v1')
-- Run in: Supabase SQL Editor → paste → Run. Send Claude the output table.
--
-- PASS CRITERIA (all four rows must say PASS):
--   modules_total        = 18   (15 core + 3 agile/EA modules)
--   lessons_total        = 90   (18 × 5)
--   lessons_with_transcript = 90  and thin_transcripts = 0  (>= 1200 chars)
--   chapter_end_quizzes  = 18   each with >= 10 approved questions
--   questions_null_competency = 0
--   duplicate lesson titles = 0, duplicate transcripts = 0  (Gold Standard)
--
-- Per LAUNCH_DECISION_PRINCIPLE: this output IS the evidence that flips
-- BA from PREVIEW to ACTIVE. No green output → no activation.
-- =============================================================================

WITH ba AS (
  SELECT id FROM public.courses
  WHERE curriculum_version = 'ba-v1'
),
mods AS (
  SELECT c.id, c.order_index FROM public.chapters c JOIN ba ON c.course_id = ba.id
),
lessons AS (
  SELECT v.id, v.chapter_id,
         length(coalesce(v.translations->'en'->>'transcript','')) AS tlen
  FROM public.videos v JOIN mods m ON v.chapter_id = m.id
),
quizzes AS (
  SELECT q.id, q.chapter_id FROM public.quizzes q
  JOIN mods m ON q.chapter_id = m.id
  WHERE q.quiz_type = 'chapter_end'
),
questions AS (
  SELECT qq.quiz_id, qq.competency, qq.status
  FROM public.quiz_questions qq JOIN quizzes z ON qq.quiz_id = z.id
)
SELECT 'modules' AS gate,
       count(*)::text AS value,
       CASE WHEN count(*) = 18 THEN 'PASS' ELSE 'FAIL — expected 18' END AS verdict
FROM mods
UNION ALL
SELECT 'lessons',
       count(*)::text,
       CASE WHEN count(*) = 90 THEN 'PASS' ELSE 'FAIL — expected 90' END
FROM lessons
UNION ALL
SELECT 'transcripts (filled / thin<1200)',
       count(*) FILTER (WHERE tlen > 0)::text || ' / ' || count(*) FILTER (WHERE tlen BETWEEN 1 AND 1199)::text,
       CASE WHEN count(*) FILTER (WHERE tlen >= 1200) = 90 THEN 'PASS' ELSE 'FAIL — every lesson needs a full transcript' END
FROM lessons
UNION ALL
SELECT 'chapter_end quizzes',
       count(*)::text,
       CASE WHEN count(*) >= 18 THEN 'PASS' ELSE 'FAIL — expected 18' END
FROM quizzes
UNION ALL
SELECT 'approved questions (total / min per quiz)',
       (SELECT count(*) FROM questions WHERE status = 'approved')::text || ' / ' ||
       coalesce((SELECT min(c) FROM (SELECT count(*) AS c FROM questions WHERE status='approved' GROUP BY quiz_id) s), 0)::text,
       CASE WHEN coalesce((SELECT min(c) FROM (SELECT count(*) AS c FROM questions WHERE status='approved' GROUP BY quiz_id) s), 0) >= 10
            THEN 'PASS' ELSE 'FAIL — every module exam needs >= 10 approved questions' END
UNION ALL
SELECT 'questions with NULL competency',
       count(*)::text,
       CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL — competency must be populated at insert' END
FROM questions WHERE competency IS NULL
UNION ALL
SELECT 'duplicate lesson titles',
       count(*)::text,
       CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL — no duplicate lessons allowed (Gold Standard)' END
FROM (
  SELECT lower(coalesce(v.translations->'en'->>'title', v.title)) AS t
  FROM public.videos v JOIN mods m ON v.chapter_id = m.id
  GROUP BY 1 HAVING count(*) > 1
) d
UNION ALL
SELECT 'duplicate transcripts',
       count(*)::text,
       CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL — no duplicated content allowed (Gold Standard)' END
FROM (
  SELECT md5(v.translations->'en'->>'transcript') AS h
  FROM public.videos v JOIN mods m ON v.chapter_id = m.id
  WHERE v.translations->'en'->>'transcript' IS NOT NULL
  GROUP BY 1 HAVING count(*) > 1
) d2;

-- Optional drill-down if any gate fails: per-module detail
-- SELECT m.order_index,
--        count(DISTINCT v.id) AS lessons,
--        count(DISTINCT v.id) FILTER (WHERE length(coalesce(v.translations->'en'->>'transcript','')) >= 1200) AS full_transcripts,
--        count(DISTINCT qq.id) FILTER (WHERE qq.status='approved') AS approved_questions
-- FROM public.chapters m
-- JOIN public.courses co ON co.id = m.course_id AND co.curriculum_version='ba-v1'
-- LEFT JOIN public.videos v ON v.chapter_id = m.id
-- LEFT JOIN public.quizzes q ON q.chapter_id = m.id AND q.quiz_type='chapter_end'
-- LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
-- GROUP BY m.order_index ORDER BY m.order_index;
