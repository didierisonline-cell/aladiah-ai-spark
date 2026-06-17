-- ============================================================================
-- Aladiah Global Content Localization Factory — Phase 3  (REVIEW → APPLY BY HAND)
-- Extends the Phase-2 pipeline (content_i18n, translation_jobs) with:
--   • language tiering so NEW languages inherit the pipeline with ZERO code change
--   • terminology glossary (protected + preferred terms) for consistency QA
--   • translation_qa scores (technical / cultural / terminology)
--   • founder dashboard aggregate view + missing-asset alerting
-- Canon: not auto-applied; run in Supabase, then run the verification SELECTs.
-- ============================================================================

-- ── 1. Language tiering — the extensibility mechanism ───────────────────────
-- Adding Basaa/Bamiléké/Hausa/Igbo = ONE INSERT. The enqueue trigger + coverage
-- views already iterate i18n_languages WHERE pipeline_enabled, so a new row is
-- automatically translated, scored, and dashboarded with no engineering.
ALTER TABLE public.i18n_languages
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'launch'      -- launch | expansion
    CHECK (tier IN ('launch','expansion')),
  ADD COLUMN IF NOT EXISTS region text,                            -- e.g. 'Africa'
  ADD COLUMN IF NOT EXISTS pipeline_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS deploy_blocking boolean NOT NULL DEFAULT true; -- launch langs block CI

UPDATE public.i18n_languages SET tier='launch', deploy_blocking=true
  WHERE code IN ('en','es','fr','pt','de','ar','zh','hi');

-- Pre-register African expansion languages (translated by the SAME pipeline,
-- but NOT deploy-blocking until promoted to tier='launch').
INSERT INTO public.i18n_languages(code,name,rtl,tier,region,pipeline_enabled,deploy_blocking) VALUES
 ('bas','Basaa',false,'expansion','Africa',true,false),
 ('bam','Bamiléké',false,'expansion','Africa',true,false),
 ('ha','Hausa',false,'expansion','Africa',true,false),
 ('ig','Igbo',false,'expansion','Africa',true,false)
ON CONFLICT (code) DO NOTHING;

-- Generalize the Phase-2 enqueue trigger to use pipeline_enabled (not is_launch)
CREATE OR REPLACE FUNCTION public.enqueue_translation_jobs() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.lang = 'en' THEN
    INSERT INTO public.translation_jobs(entity_type, entity_id, field, target_lang, source_text, source_hash)
    SELECT NEW.entity_type, NEW.entity_id, NEW.field, l.code, NEW.value, md5(NEW.value)
    FROM public.i18n_languages l
    WHERE l.pipeline_enabled AND l.code <> 'en'
    ON CONFLICT (entity_type, entity_id, field, target_lang, source_hash) DO NOTHING;
    UPDATE public.content_i18n c SET status='stale'
    WHERE c.entity_type=NEW.entity_type AND c.entity_id=NEW.entity_id AND c.field=NEW.field
      AND c.lang<>'en' AND c.source_hash IS DISTINCT FROM md5(NEW.value) AND c.status='published';
  END IF;
  RETURN NEW;
END $$;

-- ── 2. Terminology glossary (protected + preferred terms) ───────────────────
CREATE TABLE IF NOT EXISTS public.i18n_glossary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,                 -- source term, e.g. 'Talent Score™'
  protected boolean NOT NULL DEFAULT false,   -- never translate (brand/tech)
  lang text REFERENCES public.i18n_languages(code), -- preferred rendering per lang (NULL = applies to all)
  preferred text,                     -- approved translation when not protected
  notes text,
  UNIQUE (term, lang)
);
INSERT INTO public.i18n_glossary(term, protected) VALUES
 ('Aladiah Academy',true),('Prof. Didier',true),('Talent Score™',true),('All-Access Pass™',true),
 ('Scrum',true),('AI',true),('GitHub',true),('AWS',true),('Google Cloud',true),('Microsoft',true),
 ('PMI',true),('Scrum.org',true),('Stripe',true),('ElevenLabs',true),('LinkedIn',true)
ON CONFLICT (term, lang) DO NOTHING;

-- ── 3. Translation QA scores ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.translation_qa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_i18n_id uuid NOT NULL REFERENCES public.content_i18n(id) ON DELETE CASCADE,
  technical_accuracy   int CHECK (technical_accuracy   BETWEEN 0 AND 100),
  cultural_appropriateness int CHECK (cultural_appropriateness BETWEEN 0 AND 100),
  terminology_consistency  int CHECK (terminology_consistency  BETWEEN 0 AND 100),
  overall int GENERATED ALWAYS AS (
    (coalesce(technical_accuracy,0)+coalesce(cultural_appropriateness,0)+coalesce(terminology_consistency,0))/3
  ) STORED,
  method text,                         -- mt-self-eval | human | back-translation
  reviewer text,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_i18n_id)
);

-- A translation may only be published when QA overall >= 85 (gate enforced in app/CI).
CREATE OR REPLACE VIEW public.v_publishable AS
SELECT c.id, c.entity_type, c.entity_id, c.field, c.lang, q.overall
FROM public.content_i18n c JOIN public.translation_qa q ON q.content_i18n_id=c.id
WHERE c.status='in_review' AND q.overall >= 85;

-- ── 4. Founder dashboard aggregate ──────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_factory_dashboard AS
WITH src AS (
  SELECT entity_type, count(*) AS source_assets
  FROM public.content_i18n WHERE lang='en' AND status='published' GROUP BY entity_type
)
SELECT l.code AS lang, l.name, l.tier, l.deploy_blocking,
       coalesce(sum(s.source_assets),0) AS source_assets,
       count(c.*) FILTER (WHERE c.status='published') AS published,
       count(c.*) FILTER (WHERE c.status IN ('draft','machine','in_review','stale')) AS in_progress,
       round(avg(q.overall)) AS avg_quality,
       round(100.0 * count(c.*) FILTER (WHERE c.status='published')
             / nullif(sum(s.source_assets),0), 1) AS coverage_pct
FROM public.i18n_languages l
LEFT JOIN src s ON true
LEFT JOIN public.content_i18n c ON c.lang=l.code
LEFT JOIN public.translation_qa q ON q.content_i18n_id=c.id
WHERE l.pipeline_enabled AND l.code<>'en'
GROUP BY l.code, l.name, l.tier, l.deploy_blocking
ORDER BY l.tier, l.code;

-- ── 5. Deploy-readiness gate (CI reads this) ────────────────────────────────
-- Returns rows = blocking languages NOT at 100% published coverage. Empty = OK to deploy.
CREATE OR REPLACE VIEW public.v_deploy_blockers AS
SELECT * FROM public.v_factory_dashboard
WHERE deploy_blocking AND coalesce(coverage_pct,0) < 100;

-- ── VERIFICATION ─────────────────────────────────────────────────────────────
-- SELECT code,tier,deploy_blocking FROM public.i18n_languages ORDER BY tier,code; -- 8 launch + 4 expansion
-- SELECT * FROM public.v_factory_dashboard;
-- SELECT * FROM public.v_deploy_blockers;     -- empty ⇒ launch langs fully covered
