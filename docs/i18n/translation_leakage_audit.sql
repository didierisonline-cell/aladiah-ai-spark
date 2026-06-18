-- ============================================================================
-- Aladiah — Translation LEAKAGE audit  (READ-ONLY, run in Supabase SQL editor)
-- ============================================================================
-- Companion to translation_coverage_audit.sql. Coverage answers "is a language
-- slot present?"; this answers "is the WRONG language sitting in a slot?" — the
-- bug behind "Chinese page shows French course title" and "DE/FR show Spanish".
--
-- No writes. Heuristic (SQL can't do true language ID): flags rows where a slot
-- is missing, equals the English/base value (untranslated), or — for the base
-- columns — is clearly not English (so EN itself leaks another language, e.g. the
-- Scrum course whose base title is French). Pair with the code-level catalog in
-- src/lib/programCatalog.ts, which already renders the correct localized title
-- for any catalog program regardless of the stored DB value.
-- ============================================================================

\set langs '''es'',''fr'',''pt'',''de'',''ar'',''zh'',''hi'''

-- ── 1) COURSES: per-language slot status (missing / untranslated / present) ───
WITH langs(l) AS (VALUES ('es'),('fr'),('pt'),('de'),('ar'),('zh'),('hi'))
SELECT
  c.id,
  c.title                                   AS base_title_en,
  l.l                                       AS lang,
  (c.translations -> l.l ->> 'title')       AS slot_title,
  CASE
    WHEN (c.translations -> l.l ->> 'title') IS NULL OR btrim(c.translations -> l.l ->> 'title') = '' THEN 'MISSING'
    WHEN btrim(c.translations -> l.l ->> 'title') = btrim(c.title)                                     THEN 'UNTRANSLATED (== English base)'
    ELSE 'present'
  END                                       AS title_status,
  CASE
    WHEN (c.translations -> l.l ->> 'description') IS NULL OR btrim(c.translations -> l.l ->> 'description') = '' THEN 'MISSING'
    WHEN btrim(c.translations -> l.l ->> 'description') = btrim(c.description)                          THEN 'UNTRANSLATED (== English base)'
    ELSE 'present'
  END                                       AS description_status
FROM courses c
CROSS JOIN langs l
WHERE c.is_published
ORDER BY c.title, l.l;

-- ── 2) BASE-COLUMN LEAKAGE: published courses whose EN base title is suspicious
--      (contains accented/non-English tokens that indicate FR/ES/PT left in EN).
--      The Scrum flagship surfaces here while its DB base is the French cert name.
SELECT id, title AS base_title_en, description AS base_description_en
FROM courses
WHERE is_published
  AND (
       title ILIKE '%Certification Professionnelle%'   -- FR
    OR title ILIKE '%avec IA%'                          -- FR
    OR title ILIKE '%con IA%'                           -- ES
    OR title ILIKE '%Empresarial%'                      -- ES/PT
    OR title ~ '[áéíóúñçàèùâêîôûü’]'                    -- accented => not EN
  )
ORDER BY title;

-- ── 3) CHAPTERS coverage roll-up (missing title/description per language) ─────
WITH langs(l) AS (VALUES ('es'),('fr'),('pt'),('de'),('ar'),('zh'),('hi'))
SELECT
  ch.course_id,
  l.l AS lang,
  count(*) FILTER (WHERE (ch.translations -> l.l ->> 'title')       IS NULL OR btrim(ch.translations -> l.l ->> 'title') = '')       AS chapters_missing_title,
  count(*) FILTER (WHERE (ch.translations -> l.l ->> 'description') IS NULL OR btrim(ch.translations -> l.l ->> 'description') = '') AS chapters_missing_desc,
  count(*) AS chapters_total
FROM chapters ch
CROSS JOIN langs l
GROUP BY ch.course_id, l.l
ORDER BY ch.course_id, l.l;

-- ── 4) VIDEOS (lesson body + transcript) coverage roll-up per language ────────
WITH langs(l) AS (VALUES ('es'),('fr'),('pt'),('de'),('ar'),('zh'),('hi'))
SELECT
  l.l AS lang,
  count(*) FILTER (WHERE (v.translations -> l.l ->> 'title')       IS NULL OR btrim(v.translations -> l.l ->> 'title') = '')       AS videos_missing_title,
  count(*) FILTER (WHERE (v.translations -> l.l ->> 'description') IS NULL OR btrim(v.translations -> l.l ->> 'description') = '') AS videos_missing_body,
  count(*) FILTER (WHERE (v.translations -> l.l ->> 'transcript')  IS NULL OR btrim(v.translations -> l.l ->> 'transcript') = '')  AS videos_missing_transcript,
  count(*) AS videos_total
FROM videos v
CROSS JOIN langs l
GROUP BY l.l
ORDER BY l.l;

-- ── 5) QUIZ QUESTIONS: does the translations column exist & is it populated? ──
--      (quiz_questions.translations was added by 20260619020000; harmless if absent.)
WITH langs(l) AS (VALUES ('es'),('fr'),('pt'),('de'),('ar'),('zh'),('hi'))
SELECT
  l.l AS lang,
  count(*) FILTER (WHERE (q.translations -> l.l ->> 'question_text') IS NULL OR btrim(q.translations -> l.l ->> 'question_text') = '') AS questions_missing_text,
  count(*) AS questions_total
FROM quiz_questions q
CROSS JOIN langs l
GROUP BY l.l
ORDER BY l.l;
