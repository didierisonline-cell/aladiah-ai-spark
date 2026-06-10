-- =============================================================================
-- Aladiah SEO Strategy Agent — domain schema
-- =============================================================================
-- Agent #3 of the AI Workforce. Like the other agents, all cross-cutting state
-- (registry, runs, logs, memory, tasks, messages) lives in the aos_* tables.
-- This migration adds only its DOMAIN OUTPUT:
--
--   seo_keywords         — keyword research / opportunities / rankings
--   seo_clusters         — topic clusters (pillar + supporting + internal links)
--   seo_competitors      — competitor tracking
--   seo_audits           — on-page SEO audits
--   seo_recommendations  — prioritized recommendations + marketing delegations
--
-- The SEO agent does NOT create marketing content. It creates aos_tasks assigned
-- to the marketing-content agent (Task Manager) and tracks the link in
-- seo_recommendations.delegated_task_id.
--
-- AUTH: admin-scoped via public.aos_is_admin() (defined in the AOS migration;
-- re-declared CREATE OR REPLACE so this file is self-sufficient).
-- DELIVERY: reviewable file. Apply by hand after the AOS migration. Idempotent.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;


-- -----------------------------------------------------------------------------
-- seo_keywords
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_keywords (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword        TEXT NOT NULL,
  category       TEXT,                                 -- program area (scrum, pm, ai-careers, ...)
  cluster        TEXT,                                 -- topic cluster name
  intent         TEXT,                                 -- informational | commercial | transactional | navigational
  search_volume  INTEGER DEFAULT 0,
  difficulty     INTEGER DEFAULT 0,                    -- 0-100
  priority       TEXT NOT NULL DEFAULT 'medium',        -- low | medium | high
  current_rank   INTEGER,
  target_rank    INTEGER DEFAULT 3,
  status         TEXT NOT NULL DEFAULT 'opportunity',   -- opportunity | targeted | ranking | won | dropped
  notes          TEXT,
  metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_keywords_keyword ON public.seo_keywords (keyword);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_status   ON public.seo_keywords (status);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_category ON public.seo_keywords (category);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_priority ON public.seo_keywords (priority);


-- -----------------------------------------------------------------------------
-- seo_clusters
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_clusters (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  pillar_keyword   TEXT,
  category         TEXT,
  description      TEXT,
  pillar_status    TEXT NOT NULL DEFAULT 'planned',     -- planned | requested | published
  supporting_topics JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{topic, keyword, status}]
  internal_links   JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{from, to, anchor}]
  status           TEXT NOT NULL DEFAULT 'active',
  created_by_agent TEXT DEFAULT 'seo-strategy',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_clusters_name ON public.seo_clusters (name);


-- -----------------------------------------------------------------------------
-- seo_competitors
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_competitors (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  domain           TEXT,
  focus_areas      TEXT[] NOT NULL DEFAULT '{}',
  strengths        TEXT[] NOT NULL DEFAULT '{}',
  tracked_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes            TEXT,
  last_reviewed    TIMESTAMPTZ,
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_competitors_name ON public.seo_competitors (name);


-- -----------------------------------------------------------------------------
-- seo_audits
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_audits (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path        TEXT NOT NULL,
  title            TEXT,
  score            INTEGER,                             -- 0-100
  issues           JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{type, severity, detail}]
  recommendations  TEXT,
  status           TEXT NOT NULL DEFAULT 'open',         -- open | resolved
  created_by_agent TEXT DEFAULT 'seo-strategy',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_seo_audits_status ON public.seo_audits (status);


-- -----------------------------------------------------------------------------
-- seo_recommendations (incl. marketing delegations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_recommendations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  rec_type          TEXT NOT NULL,                       -- keyword | cluster | landing_page | internal_link | audit | content_request
  priority          TEXT NOT NULL DEFAULT 'medium',       -- low | medium | high
  rationale         TEXT,
  target_keyword    TEXT,
  cluster           TEXT,
  status            TEXT NOT NULL DEFAULT 'pending',       -- pending | delegated | done | dismissed
  delegated_task_id UUID,                                 -- aos_tasks.id of the marketing request
  created_by_agent  TEXT DEFAULT 'seo-strategy',
  metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_seo_recs_status   ON public.seo_recommendations (status);
CREATE INDEX IF NOT EXISTS idx_seo_recs_priority ON public.seo_recommendations (priority);


-- =============================================================================
-- Row Level Security — admin-scoped (SELECT / INSERT / UPDATE; no DELETE)
-- =============================================================================
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'seo_keywords','seo_clusters','seo_competitors','seo_audits','seo_recommendations'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins read %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Admins read %1$s" ON public.%1$I FOR SELECT USING (public.aos_is_admin());', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins insert %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Admins insert %1$s" ON public.%1$I FOR INSERT WITH CHECK (public.aos_is_admin());', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins update %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Admins update %1$s" ON public.%1$I FOR UPDATE USING (public.aos_is_admin());', t);
  END LOOP;
END $$;


-- =============================================================================
-- Seed: register the SEO Strategy Agent in the AOS registry
-- =============================================================================
INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'seo-strategy',
  'SEO Strategy Agent',
  'Owns organic discovery — keywords, clusters, competitors, audits',
  'Determines what content/keywords/landing pages/clusters/links Aladiah needs and delegates content creation to the Marketing Content Agent via the Task Manager. Does not create content itself.',
  'active',
  25,
  'daily',
  '{"read":true,"write":true,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;


-- =============================================================================
-- VERIFICATION (run AFTER applying; read-only)
-- =============================================================================
-- (a) Five seo tables exist.
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema='public' AND table_name LIKE 'seo\_%' ESCAPE '\' ORDER BY table_name;
-- (b) RLS enabled on all five.
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname LIKE 'seo\_%' ESCAPE '\' AND relkind='r' ORDER BY relname;
-- (c) Policies: 3 per table = 15, none DELETE.
-- SELECT tablename, cmd, count(*) FROM pg_policies WHERE schemaname='public' AND tablename LIKE 'seo\_%' ESCAPE '\' GROUP BY tablename, cmd ORDER BY tablename, cmd;
-- (d) SEO agent registered.
-- SELECT slug, name, status, priority FROM public.aos_agents WHERE slug='seo-strategy';
-- =============================================================================
