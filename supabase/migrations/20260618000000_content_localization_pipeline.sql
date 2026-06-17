-- ============================================================================
-- Content Localization Pipeline — Phase 2 schema  (REVIEW → APPLY BY HAND)
-- Canon: Claude Code does not auto-apply SQL. Review, then run in Supabase.
-- Always follow writes with the verification SELECTs at the bottom.
--
-- Goal: every student-facing content string is a translatable ROW (not code),
-- with per-language status, auto-enqueued translation jobs, missing-translation
-- alerts, and English fallback ONLY for the founder role.
-- ============================================================================

-- 8 launch languages (single source of truth for triggers/checks)
CREATE TABLE IF NOT EXISTS public.i18n_languages (
  code text PRIMARY KEY,            -- en, es, fr, pt, de, ar, zh, hi
  name text NOT NULL,
  rtl  boolean NOT NULL DEFAULT false,
  is_launch boolean NOT NULL DEFAULT true
);
INSERT INTO public.i18n_languages(code,name,rtl) VALUES
 ('en','English',false),('es','Spanish',false),('fr','French',false),
 ('pt','Portuguese',false),('de','German',false),('ar','Arabic',true),
 ('zh','Chinese',false),('hi','Hindi',false)
ON CONFLICT (code) DO NOTHING;

-- ── Canonical translatable store ────────────────────────────────────────────
-- One row per (entity, field, language). EN rows are the SOURCE OF TRUTH.
CREATE TABLE IF NOT EXISTS public.content_i18n (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  text NOT NULL,   -- simulation|certification|career_path|mentor_template|resource|portfolio_project|interview|capstone|course|chapter|video
  entity_id    text NOT NULL,   -- source id/slug
  field        text NOT NULL,   -- title|description|scenario|role_context|success_criteria|...
  lang         text NOT NULL REFERENCES public.i18n_languages(code),
  value        text NOT NULL,
  status       text NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','machine','in_review','published','stale')),
  source_hash  text,            -- hash of EN source when translated (staleness detection)
  translated_by text,           -- human | mt:<model> | import
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entity_type, entity_id, field, lang)
);
CREATE INDEX IF NOT EXISTS content_i18n_lookup ON public.content_i18n (entity_type, entity_id, lang, status);

-- ── Translation job queue ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.translation_jobs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  text NOT NULL,
  entity_id    text NOT NULL,
  field        text NOT NULL,
  target_lang  text NOT NULL REFERENCES public.i18n_languages(code),
  source_text  text NOT NULL,
  source_hash  text NOT NULL,
  status       text NOT NULL DEFAULT 'queued'
                 CHECK (status IN ('queued','running','done','failed','needs_review')),
  priority     int  NOT NULL DEFAULT 100,
  attempts     int  NOT NULL DEFAULT 0,
  error        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (entity_type, entity_id, field, target_lang, source_hash)
);
CREATE INDEX IF NOT EXISTS translation_jobs_open ON public.translation_jobs (status, priority) WHERE status IN ('queued','running');

-- ── Auto-enqueue: when an EN source row is written, queue the 7 target langs ──
CREATE OR REPLACE FUNCTION public.enqueue_translation_jobs() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.lang = 'en' THEN
    INSERT INTO public.translation_jobs(entity_type, entity_id, field, target_lang, source_text, source_hash)
    SELECT NEW.entity_type, NEW.entity_id, NEW.field, l.code, NEW.value, md5(NEW.value)
    FROM public.i18n_languages l
    WHERE l.is_launch AND l.code <> 'en'
    ON CONFLICT (entity_type, entity_id, field, target_lang, source_hash) DO NOTHING;
    -- mark existing target translations stale if the EN source changed
    UPDATE public.content_i18n c SET status='stale'
    WHERE c.entity_type=NEW.entity_type AND c.entity_id=NEW.entity_id AND c.field=NEW.field
      AND c.lang<>'en' AND c.source_hash IS DISTINCT FROM md5(NEW.value) AND c.status='published';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_enqueue_translation ON public.content_i18n;
CREATE TRIGGER trg_enqueue_translation AFTER INSERT OR UPDATE OF value ON public.content_i18n
  FOR EACH ROW EXECUTE FUNCTION public.enqueue_translation_jobs();

-- ── Read RPC: student gets target-lang ONLY (no EN fallback); founder gets EN fallback ──
CREATE OR REPLACE FUNCTION public.get_content(p_type text, p_id text, p_field text, p_lang text)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v text; is_founder boolean;
BEGIN
  SELECT value INTO v FROM public.content_i18n
   WHERE entity_type=p_type AND entity_id=p_id AND field=p_field AND lang=p_lang AND status='published' LIMIT 1;
  IF v IS NOT NULL THEN RETURN v; END IF;
  -- founder-only English fallback (students get NULL → UI shows localized placeholder)
  SELECT public.is_founder(auth.uid()) INTO is_founder;   -- assumes existing is_founder() helper
  IF coalesce(is_founder,false) THEN
    SELECT value INTO v FROM public.content_i18n
     WHERE entity_type=p_type AND entity_id=p_id AND field=p_field AND lang='en' AND status='published' LIMIT 1;
  END IF;
  RETURN v;  -- NULL for students when target translation absent
END $$;

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE public.content_i18n   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_jobs ENABLE ROW LEVEL SECURITY;
-- students: only PUBLISHED rows (any launch lang); never draft/stale/en-fallback via direct select
CREATE POLICY content_student_read ON public.content_i18n FOR SELECT
  USING (status='published');
-- founders: full read/write (assumes is_founder())
CREATE POLICY content_founder_all ON public.content_i18n FOR ALL
  USING (public.is_founder(auth.uid())) WITH CHECK (public.is_founder(auth.uid()));
CREATE POLICY jobs_founder_all ON public.translation_jobs FOR ALL
  USING (public.is_founder(auth.uid())) WITH CHECK (public.is_founder(auth.uid()));

-- ── Coverage / alert views ───────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_translation_coverage AS
SELECT entity_type, l.code AS lang,
       count(*) FILTER (WHERE c.status='published') AS published,
       (SELECT count(*) FROM public.content_i18n e WHERE e.entity_type=src.entity_type AND e.lang='en' AND e.status='published') AS source_total
FROM (SELECT DISTINCT entity_type FROM public.content_i18n) src
CROSS JOIN public.i18n_languages l
LEFT JOIN public.content_i18n c
  ON c.entity_type=src.entity_type AND c.lang=l.code
WHERE l.is_launch
GROUP BY entity_type, l.code, src.entity_type;

CREATE OR REPLACE VIEW public.v_missing_translations AS  -- ALERT source
SELECT s.entity_type, s.entity_id, s.field, l.code AS missing_lang
FROM public.content_i18n s
CROSS JOIN public.i18n_languages l
LEFT JOIN public.content_i18n t
  ON t.entity_type=s.entity_type AND t.entity_id=s.entity_id AND t.field=s.field AND t.lang=l.code AND t.status='published'
WHERE s.lang='en' AND s.status='published' AND l.is_launch AND l.code<>'en' AND t.id IS NULL;

-- ── VERIFICATION (run after apply; "ran" ≠ "correct") ────────────────────────
-- SELECT * FROM public.i18n_languages;                       -- expect 8 rows
-- SELECT * FROM public.v_translation_coverage ORDER BY entity_type, lang;
-- SELECT count(*) FROM public.v_missing_translations;        -- alert backlog
-- SELECT status, count(*) FROM public.translation_jobs GROUP BY status;
