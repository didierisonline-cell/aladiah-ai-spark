-- =============================================================================
-- Aladiah Placement & Employer Relations Authority — domain schema
-- =============================================================================
-- Agent #8. The bridge between Aladiah Academy and Aladiah Management. It
-- receives placement-ready students (from the Student Success Agent), runs the
-- employer/recruiter/talent-marketplace/placement pipeline, forecasts workforce
-- demand, and feeds demand + salary intelligence back to the Academy agents.
--
--   placement_employers   — employer/recruiter/client relationships
--   placement_candidates  — placement-ready students + their scores
--   placement_jobs        — job pipeline / open requisitions
--   placement_matches     — candidate↔job pipeline (matched→interview→offer→placed)
--   placement_actions     — GATED actions: contract | candidate_submission |
--                           employer_outreach (nothing leaves without approval)
--   placement_demand      — workforce demand forecasting + feedback signals
--
-- APPROVAL RULES (AOS permissions: publish=false, human_approval_required=true):
-- NO contract is sent, NO candidate is submitted, and NO employer communication
-- happens without founder approval. The agent drafts these as placement_actions.
--
-- Primary KPI: Student Placement Rate. Admin-scoped via public.aos_is_admin().
-- Idempotent; apply by hand.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;

CREATE TABLE IF NOT EXISTS public.placement_employers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  industry            TEXT,
  region              TEXT,
  relationship_status TEXT NOT NULL DEFAULT 'prospect',     -- prospect | engaged | client | recruiter | inactive
  demand_roles        TEXT[] NOT NULL DEFAULT '{}',
  open_reqs           INTEGER DEFAULT 0,
  satisfaction        INTEGER,                              -- 0-100
  contact_name        TEXT,
  contact_email       TEXT,
  notes               TEXT,
  metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pl_employers_name ON public.placement_employers (name);
CREATE INDEX IF NOT EXISTS idx_pl_employers_status ON public.placement_employers (relationship_status);

CREATE TABLE IF NOT EXISTS public.placement_candidates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             TEXT NOT NULL,
  name                TEXT,
  program             TEXT,
  target_role         TEXT,
  employability_score INTEGER DEFAULT 0,
  portfolio_score     INTEGER DEFAULT 0,
  interview_readiness INTEGER DEFAULT 0,
  competency_mastery  INTEGER DEFAULT 0,
  cts                 INTEGER DEFAULT 0,
  status              TEXT NOT NULL DEFAULT 'received',      -- received | matched | submitted | interviewing | offer | placed | declined
  source_success_id   UUID,
  metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pl_candidates_user ON public.placement_candidates (user_id);
CREATE INDEX IF NOT EXISTS idx_pl_candidates_status ON public.placement_candidates (status);

CREATE TABLE IF NOT EXISTS public.placement_jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id   UUID REFERENCES public.placement_employers(id) ON DELETE SET NULL,
  role          TEXT NOT NULL,
  region        TEXT,
  salary_min    NUMERIC,
  salary_median NUMERIC,
  salary_max    NUMERIC,
  status        TEXT NOT NULL DEFAULT 'open',                -- open | filled | closed
  demand        INTEGER DEFAULT 0,
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pl_jobs_status ON public.placement_jobs (status);

CREATE TABLE IF NOT EXISTS public.placement_matches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id  UUID REFERENCES public.placement_candidates(id) ON DELETE CASCADE,
  job_id        UUID REFERENCES public.placement_jobs(id) ON DELETE SET NULL,
  employer_id   UUID,
  match_score   INTEGER DEFAULT 0,
  stage         TEXT NOT NULL DEFAULT 'matched',             -- matched | submitted | interview | offer | placed | rejected
  interview_date TIMESTAMPTZ,
  offer_amount  NUMERIC,
  placed_at     TIMESTAMPTZ,
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pl_matches_stage ON public.placement_matches (stage);
CREATE INDEX IF NOT EXISTS idx_pl_matches_candidate ON public.placement_matches (candidate_id);

CREATE TABLE IF NOT EXISTS public.placement_actions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type         TEXT NOT NULL,                         -- contract | candidate_submission | employer_outreach
  candidate_id        UUID,
  employer_id         UUID,
  match_id            UUID,
  title               TEXT NOT NULL,
  body                TEXT,
  status              TEXT NOT NULL DEFAULT 'pending',        -- pending | approved | sent | dismissed
  approved_by_founder BOOLEAN NOT NULL DEFAULT false,
  payload             JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pl_actions_status ON public.placement_actions (status);
CREATE INDEX IF NOT EXISTS idx_pl_actions_type   ON public.placement_actions (action_type);

CREATE TABLE IF NOT EXISTS public.placement_demand (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role          TEXT NOT NULL,
  region        TEXT NOT NULL DEFAULT 'global',
  demand_score  INTEGER DEFAULT 0,
  salary_min    NUMERIC,
  salary_median NUMERIC,
  salary_max    NUMERIC,
  skill_gaps    TEXT[] NOT NULL DEFAULT '{}',
  trend         TEXT DEFAULT 'stable',
  period        TEXT NOT NULL DEFAULT 'current',
  source        TEXT,
  fed_back      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pl_demand_key ON public.placement_demand (role, region, period);

-- -----------------------------------------------------------------------------
-- RLS — admin-scoped (SELECT / INSERT / UPDATE; no DELETE)
-- -----------------------------------------------------------------------------
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'placement_employers','placement_candidates','placement_jobs','placement_matches','placement_actions','placement_demand'
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

-- -----------------------------------------------------------------------------
-- Seed sample employers + jobs + demand (clearly source='seed-sample').
-- -----------------------------------------------------------------------------
INSERT INTO public.placement_employers (name, industry, region, relationship_status, demand_roles, open_reqs, satisfaction)
VALUES
  ('Sample — NovaBank',     'Financial Services', 'Nigeria',            'client',  ARRAY['Scrum Master','Product Owner'], 3, 82),
  ('Sample — Caribe Tech',  'Software',           'Dominican Republic', 'engaged', ARRAY['Scrum Master'],                 2, NULL),
  ('Sample — Savannah Health','Healthcare',       'Kenya',              'prospect',ARRAY['Project Manager'],              1, NULL)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.placement_demand (role, region, demand_score, salary_min, salary_median, salary_max, skill_gaps, trend, source)
VALUES
  ('Scrum Master',    'global', 82, 75000, 105000, 140000, ARRAY['stakeholder-engagement','delivery-metrics'], 'rising', 'curated'),
  ('Project Manager', 'global', 80, 70000, 100000, 140000, ARRAY['agile-delivery'],                            'stable', 'curated')
ON CONFLICT (role, region, period) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Register the Placement & Employer Relations Authority agent
-- -----------------------------------------------------------------------------
INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'placement-authority',
  'Placement & Employer Relations Authority',
  'Bridge between Aladiah Academy and Aladiah Management; places students',
  'Receives placement-ready students, runs employer relations + the talent marketplace + the placement pipeline, forecasts workforce demand, and feeds demand + salary intelligence back to the Academy agents. Primary KPI: Student Placement Rate. No contracts, candidate submissions, or employer communications without founder approval.',
  'active',
  26,
  'daily',
  '{"read":true,"write":true,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'placement\_%' ESCAPE '\' ORDER BY 1;  -- 6
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname LIKE 'placement\_%' ESCAPE '\' AND relkind='r';  -- true
-- SELECT slug FROM public.aos_agents WHERE slug='placement-authority';  -- 1
-- =============================================================================
