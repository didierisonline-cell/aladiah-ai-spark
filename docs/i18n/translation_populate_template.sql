-- ============================================================================
-- Aladiah — Populate course/chapter/video translations  (REVIEW → APPLY BY HAND)
-- Canon: delivered as a reviewable block; a human applies it in Supabase.
-- Always follow an UPDATE with the verification SELECT at the bottom.
-- ============================================================================

-- STEP 1 — Export the English source text that needs translating.
--   Hand this output to the translator (human or AI) to produce ES/FR/PT/DE/AR/ZH/HI.
SELECT id, title, description
FROM public.courses
WHERE is_published
  AND (coalesce(translations->'es'->>'title','')='' OR coalesce(translations->'es'->>'description','')='')
ORDER BY title;

-- STEP 2 — Paste-ready UPDATE TEMPLATE (one statement per course).
--   jsonb_set merges a language without destroying existing languages.
--   Replace <UUID> and the translated strings. Titles may stay English (rule 7);
--   descriptions MUST be translated. Repeat the ||-merge for each language.
UPDATE public.courses
SET translations = coalesce(translations,'{}'::jsonb)
  || jsonb_build_object('es', jsonb_build_object('title','<ES title>','description','<ES description>'))
  || jsonb_build_object('fr', jsonb_build_object('title','<FR title>','description','<FR description>'))
  || jsonb_build_object('pt', jsonb_build_object('title','<PT title>','description','<PT description>'))
  || jsonb_build_object('de', jsonb_build_object('title','<DE title>','description','<DE description>'))
  || jsonb_build_object('ar', jsonb_build_object('title','<AR title>','description','<AR description>'))
  || jsonb_build_object('zh', jsonb_build_object('title','<ZH title>','description','<ZH description>'))
  || jsonb_build_object('hi', jsonb_build_object('title','<HI title>','description','<HI description>'))
WHERE id = '<UUID>';

-- STEP 3 — VERIFICATION SELECT (run after the UPDATE; "ran" ≠ "correct").
SELECT id, left(title,40) AS course,
  jsonb_object_keys_count(translations) AS langs_present,
  (translations->'es'->>'description') IS NOT NULL AS es_ok,
  (translations->'zh'->>'description') IS NOT NULL AS zh_ok,
  (translations->'ar'->>'description') IS NOT NULL AS ar_ok
FROM public.courses WHERE id = '<UUID>';
-- (jsonb_object_keys_count: SELECT count(*) FROM jsonb_object_keys(translations); inline if no helper.)

-- ALTERNATIVE (scale) — the repo ships supabase/functions/translate-content.
--   Batch-translate published courses' title/description into the 8 launch langs and
--   write them into courses.translations. Review its output before relying on it.
