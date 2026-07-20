-- =============================================================================
-- GOLD STANDARD GATE — all five flagships in one read-only query.
-- Companion to docs/standards/GOLD_STANDARD.md.
--
-- Run in: Supabase SQL Editor → paste → Run. One row per program.
-- PASS requires every column check to hold:
--   modules  = 18  (cyber = 19, ratified exception)
--   lessons  = modules × 5
--   full_transcripts = lessons   ·   thin = 0   (>= 1200 chars)
--   quizzes  = modules           ·   min_questions >= 10
--   null_competency = 0  ·  dup_titles = 0  ·  dup_transcripts = 0
--
-- Freeze rule: when all five rows read PASS and the per-program Founder QA
-- walkthroughs are green, the flagships are FROZEN (bug fixes + student
-- feedback only).
-- =============================================================================

WITH flags(cv, expected_modules) AS (
  VALUES ('v3.0', 18), ('pm-v1', 18), ('ba-v1', 18), ('da-v1', 18), ('cyber-v1', 19)
),
c AS (
  SELECT f.cv, f.expected_modules, co.id AS course_id, co.title
  FROM flags f JOIN public.courses co ON co.curriculum_version = f.cv
),
m AS (
  SELECT c.cv, ch.id AS chapter_id
  FROM c JOIN public.chapters ch ON ch.course_id = c.course_id
),
v AS (
  SELECT m.cv, vd.id, lower(coalesce(vd.translations->'en'->>'title', vd.title)) AS ltitle,
         coalesce(vd.translations->'en'->>'transcript','') AS tr
  FROM m JOIN public.videos vd ON vd.chapter_id = m.chapter_id
),
q AS (
  SELECT m.cv, qz.id AS quiz_id
  FROM m JOIN public.quizzes qz ON qz.chapter_id = m.chapter_id AND qz.quiz_type = 'chapter_end'
),
qq AS (
  SELECT q.cv, x.quiz_id, x.competency, x.status
  FROM q JOIN public.quiz_questions x ON x.quiz_id = q.quiz_id
),
per AS (
  SELECT
    c.cv,
    c.expected_modules,
    (SELECT count(*) FROM m WHERE m.cv = c.cv) AS modules,
    (SELECT count(*) FROM v WHERE v.cv = c.cv) AS lessons,
    (SELECT count(*) FROM v WHERE v.cv = c.cv AND length(v.tr) >= 1200) AS full_transcripts,
    (SELECT count(*) FROM v WHERE v.cv = c.cv AND length(v.tr) BETWEEN 1 AND 1199) AS thin,
    (SELECT count(*) FROM v WHERE v.cv = c.cv AND length(v.tr) = 0) AS missing_transcripts,
    (SELECT count(*) FROM q WHERE q.cv = c.cv) AS quizzes,
    coalesce((SELECT min(cnt) FROM (
        SELECT count(*) AS cnt FROM qq WHERE qq.cv = c.cv AND qq.status = 'approved' GROUP BY qq.quiz_id
      ) s), 0) AS min_questions,
    (SELECT count(*) FROM qq WHERE qq.cv = c.cv AND qq.competency IS NULL) AS null_competency,
    (SELECT count(*) FROM (
        SELECT 1 FROM v WHERE v.cv = c.cv GROUP BY v.ltitle HAVING count(*) > 1
      ) d) AS dup_titles,
    (SELECT count(*) FROM (
        SELECT 1 FROM v WHERE v.cv = c.cv AND v.tr <> '' GROUP BY md5(v.tr) HAVING count(*) > 1
      ) d2) AS dup_transcripts
  FROM c
)
SELECT
  cv AS program,
  modules || '/' || expected_modules            AS modules,
  lessons || '/' || expected_modules * 5        AS lessons,
  full_transcripts || ' full · ' || thin || ' thin · ' || missing_transcripts || ' missing' AS transcripts,
  quizzes || ' quizzes · min ' || min_questions || ' Q'                                     AS assessment,
  null_competency  AS null_comp,
  dup_titles       AS dup_titles,
  dup_transcripts  AS dup_scripts,
  CASE WHEN modules = expected_modules
        AND lessons = expected_modules * 5
        AND full_transcripts = lessons
        AND quizzes = expected_modules
        AND min_questions >= 10
        AND null_competency = 0
        AND dup_titles = 0
        AND dup_transcripts = 0
       THEN '✅ GOLD' ELSE '❌ CHECK' END AS verdict
FROM per
ORDER BY program;
