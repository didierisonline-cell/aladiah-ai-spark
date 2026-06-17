-- ============================================================================
-- PROOF QUERY — does courses.translations actually contain ES/FR/PT (etc.)?
-- Run in Supabase SQL editor (READ-ONLY). One row per published course.
-- ============================================================================
SELECT
  id AS course_id,
  title AS course_title,
  jsonb_object_keys_to_array(translations) AS translation_keys_present,
  (coalesce(translations->'es'->>'title','')        <> '') AS es_title,
  (coalesce(translations->'es'->>'description','')   <> '') AS es_description,
  (coalesce(translations->'fr'->>'title','')        <> '') AS fr_title,
  (coalesce(translations->'fr'->>'description','')   <> '') AS fr_description,
  (coalesce(translations->'pt'->>'title','')        <> '') AS pt_title,
  (coalesce(translations->'pt'->>'description','')   <> '') AS pt_description,
  (coalesce(translations->'de'->>'title','')        <> '') AS de_title,
  (coalesce(translations->'ar'->>'title','')        <> '') AS ar_title,
  (coalesce(translations->'zh'->>'title','')        <> '') AS zh_title,
  (coalesce(translations->'hi'->>'title','')        <> '') AS hi_title
FROM public.courses
WHERE is_published = true
ORDER BY title;
-- Note: jsonb_object_keys_to_array → replace with: (SELECT array_agg(k) FROM jsonb_object_keys(translations) k)
-- if you don't have that helper. Inline version:
-- SELECT id, title,
--   (SELECT array_agg(k) FROM jsonb_object_keys(translations) k) AS translation_keys_present, ...

-- Coverage roll-up (ES/FR/PT/DE/AR/ZH/HI complete = title AND description present):
SELECT
  count(*) AS total_published,
  count(*) FILTER (WHERE coalesce(translations->'es'->>'title','')<>'' AND coalesce(translations->'es'->>'description','')<>'') AS es_complete,
  count(*) FILTER (WHERE coalesce(translations->'fr'->>'title','')<>'' AND coalesce(translations->'fr'->>'description','')<>'') AS fr_complete,
  count(*) FILTER (WHERE coalesce(translations->'pt'->>'title','')<>'' AND coalesce(translations->'pt'->>'description','')<>'') AS pt_complete
FROM public.courses WHERE is_published;
