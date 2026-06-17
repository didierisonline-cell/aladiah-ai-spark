-- ============================================================================
-- Aladiah — Multilingual DB Translation Coverage Audit  (READ-ONLY)
-- Run in Supabase SQL editor. No writes. Verifies actual translation rows.
--
-- SCHEMA REALITY (verified from migrations):
--   Student content translations live ONLY in JSONB columns:
--     courses.translations, chapters.translations, videos.translations
--     format: {"es":{"title":"…","description":"…"}, "fr":{…}, …}
--   EN = base columns (title, description). There are NO *_translations tables.
--   Launch languages audited: es, fr, pt, de, ar, zh, hi  (en = base = always present)
-- ============================================================================

-- A helper expression: a language is "complete" for a row when BOTH title and
-- description exist and are non-empty in translations->lang.
--   (translations->'es'->>'title') IS NOT NULL AND length(trim(...)) > 0

-- ── 1. PER-ROW REPORT (courses): EN ✅ / ES ❌ … ────────────────────────────
SELECT
  c.id,
  left(c.title, 40)                                            AS course,
  '✅'                                                          AS en,
  CASE WHEN coalesce(c.translations->'es'->>'title','')<>'' AND coalesce(c.translations->'es'->>'description','')<>'' THEN '✅' ELSE '❌' END AS es,
  CASE WHEN coalesce(c.translations->'fr'->>'title','')<>'' AND coalesce(c.translations->'fr'->>'description','')<>'' THEN '✅' ELSE '❌' END AS fr,
  CASE WHEN coalesce(c.translations->'pt'->>'title','')<>'' AND coalesce(c.translations->'pt'->>'description','')<>'' THEN '✅' ELSE '❌' END AS pt,
  CASE WHEN coalesce(c.translations->'de'->>'title','')<>'' AND coalesce(c.translations->'de'->>'description','')<>'' THEN '✅' ELSE '❌' END AS de,
  CASE WHEN coalesce(c.translations->'ar'->>'title','')<>'' AND coalesce(c.translations->'ar'->>'description','')<>'' THEN '✅' ELSE '❌' END AS ar,
  CASE WHEN coalesce(c.translations->'zh'->>'title','')<>'' AND coalesce(c.translations->'zh'->>'description','')<>'' THEN '✅' ELSE '❌' END AS zh,
  CASE WHEN coalesce(c.translations->'hi'->>'title','')<>'' AND coalesce(c.translations->'hi'->>'description','')<>'' THEN '✅' ELSE '❌' END AS hi
FROM public.courses c
WHERE c.is_published = true
ORDER BY c.title;

-- ── 2. COVERAGE % PER LANGUAGE (courses) ────────────────────────────────────
WITH base AS (SELECT count(*)::numeric n FROM public.courses WHERE is_published)
SELECT 'courses' AS table_name, lang,
       round(100.0 * complete / nullif((SELECT n FROM base),0), 1) AS coverage_pct,
       complete || '/' || (SELECT n FROM base) AS rows_complete
FROM (
  SELECT unnest(ARRAY['es','fr','pt','de','ar','zh','hi']) AS lang,
         unnest(ARRAY[
           count(*) FILTER (WHERE coalesce(translations->'es'->>'title','')<>'' AND coalesce(translations->'es'->>'description','')<>''),
           count(*) FILTER (WHERE coalesce(translations->'fr'->>'title','')<>'' AND coalesce(translations->'fr'->>'description','')<>''),
           count(*) FILTER (WHERE coalesce(translations->'pt'->>'title','')<>'' AND coalesce(translations->'pt'->>'description','')<>''),
           count(*) FILTER (WHERE coalesce(translations->'de'->>'title','')<>'' AND coalesce(translations->'de'->>'description','')<>''),
           count(*) FILTER (WHERE coalesce(translations->'ar'->>'title','')<>'' AND coalesce(translations->'ar'->>'description','')<>''),
           count(*) FILTER (WHERE coalesce(translations->'zh'->>'title','')<>'' AND coalesce(translations->'zh'->>'description','')<>''),
           count(*) FILTER (WHERE coalesce(translations->'hi'->>'title','')<>'' AND coalesce(translations->'hi'->>'description','')<>'')
         ]) AS complete
  FROM public.courses WHERE is_published
) s ORDER BY lang;

-- ── 3. MISSING TRANSLATION ROWS (courses missing a given language) ──────────
--    Returns one row per (course, language) gap. Swap 'es' for any language.
SELECT c.id, c.title, 'es' AS missing_lang
FROM public.courses c
WHERE c.is_published
  AND (coalesce(c.translations->'es'->>'title','')='' OR coalesce(c.translations->'es'->>'description','')='')
ORDER BY c.title;

-- ── 4. ORPHANED / NON-LAUNCH LANGUAGE KEYS (translations for langs we don't ship) ─
SELECT c.id, c.title, k AS orphan_lang_key
FROM public.courses c, jsonb_object_keys(c.translations) k
WHERE k NOT IN ('es','fr','pt','de','ar','zh','hi')
ORDER BY c.title;

-- ── 5. ENGLISH-FALLBACK RECORDS (no translations at all → renders English) ──
SELECT c.id, c.title,
       (c.translations IS NULL OR c.translations = '{}'::jsonb) AS empty_translations
FROM public.courses c
WHERE c.is_published AND (c.translations IS NULL OR c.translations = '{}'::jsonb)
ORDER BY c.title;

-- ── 6 & 7. Repeat blocks 1–5 for chapters and videos (same JSONB shape) ─────
--    e.g.  FROM public.chapters c   /   FROM public.videos c
--    (chapters/videos have no is_published filter; drop that WHERE clause.)
