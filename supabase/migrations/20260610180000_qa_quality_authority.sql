-- =============================================================================
-- Aladiah World-Class QA Agent — Academic Quality & Employability Authority
-- =============================================================================
-- Agent #5. The FINAL AUTHORITY before founder review: no artifact may enter the
-- Founder Approval Queue (status 'pending_approval') unless it passes QA review.
--
-- New artifact lifecycle (product_artifacts.status is free-text, so no enum change):
--   draft  ──self quality gate──►  qa_review  ──QA authority──►  pending_approval
--                                       │
--                                       └── fails QA ──► qa_rejected
--
-- Tables:
--   qa_reviews             — one review per artifact: engine scores, benchmark
--                            alignment, the six validations, findings, verdict.
--   qa_market_intelligence — Market Intelligence Engine data (role demand, salary,
--                            AI demand) used to validate market/salary relevance.
--
-- The 13 QA engines and the 12 benchmark authorities (Scrum.org, PMI, SAFe,
-- ICAgile, Google, Microsoft, AWS, Meta, Coursera, LinkedIn Learning, Harvard
-- Online, MIT Open Learning) live in code (qa/engines.ts, qa/benchmarks.ts).
--
-- Admin-scoped via public.aos_is_admin(). Idempotent; apply by hand.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;

-- -----------------------------------------------------------------------------
-- qa_reviews
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.qa_reviews (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id      UUID REFERENCES public.product_artifacts(id) ON DELETE CASCADE,
  artifact_type    TEXT,
  engine           TEXT,
  overall_score    INTEGER,                              -- 0-100
  verdict          TEXT NOT NULL DEFAULT 'fail',           -- pass | conditional | fail
  passed           BOOLEAN NOT NULL DEFAULT false,
  engine_scores    JSONB NOT NULL DEFAULT '{}'::jsonb,    -- per QA engine
  benchmark_scores JSONB NOT NULL DEFAULT '{}'::jsonb,    -- per benchmark authority
  validations      JSONB NOT NULL DEFAULT '{}'::jsonb,    -- the six validations
  findings         JSONB NOT NULL DEFAULT '[]'::jsonb,    -- [{severity, area, note}]
  reviewer_agent   TEXT DEFAULT 'qa-authority',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_qa_reviews_artifact ON public.qa_reviews (artifact_id);
CREATE INDEX IF NOT EXISTS idx_qa_reviews_verdict  ON public.qa_reviews (verdict);
CREATE INDEX IF NOT EXISTS idx_qa_reviews_created  ON public.qa_reviews (created_at DESC);

-- -----------------------------------------------------------------------------
-- qa_market_intelligence (Market Intelligence Engine)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.qa_market_intelligence (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role           TEXT NOT NULL,
  region         TEXT NOT NULL DEFAULT 'global',
  demand_score   INTEGER DEFAULT 0,                       -- 0-100
  salary_min     NUMERIC,
  salary_median  NUMERIC,
  salary_max     NUMERIC,
  currency       TEXT DEFAULT 'USD',
  ai_demand      INTEGER DEFAULT 0,                        -- 0-100 (AI-skill demand for the role)
  trend          TEXT DEFAULT 'stable',                    -- rising | stable | declining
  source         TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_qa_market_role ON public.qa_market_intelligence (role, region);

-- -----------------------------------------------------------------------------
-- RLS — admin-scoped (SELECT / INSERT / UPDATE; no DELETE)
-- -----------------------------------------------------------------------------
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['qa_reviews','qa_market_intelligence'] LOOP
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
-- Seed market intelligence (curated; the Market Intelligence Engine refreshes it).
-- -----------------------------------------------------------------------------
INSERT INTO public.qa_market_intelligence (role, region, demand_score, salary_min, salary_median, salary_max, ai_demand, trend, source) VALUES
  ('Scrum Master',       'global', 82, 75000, 105000, 140000, 70, 'rising',  'curated'),
  ('Agile Coach',        'global', 74, 95000, 130000, 175000, 68, 'rising',  'curated'),
  ('Project Manager',    'global', 80, 70000, 100000, 140000, 65, 'stable',  'curated'),
  ('Product Owner',      'global', 78, 80000, 115000, 155000, 72, 'rising',  'curated'),
  ('Release Train Engineer', 'global', 70, 110000, 140000, 180000, 66, 'stable', 'curated')
ON CONFLICT (role, region) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Register the QA Authority agent
-- -----------------------------------------------------------------------------
INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'qa-authority',
  'World-Class QA Agent',
  'Academic Quality & Employability Authority — final gate before founder review',
  'Reviews every Product Builder artifact across 13 quality engines, benchmarks against 12 world-class authorities, and validates GitHub portfolios, interview readiness, market demand, salary relevance, AI readiness, and employer alignment. No artifact reaches the Founder Approval Queue without passing QA.',
  'active',
  15,
  'daily',
  '{"read":true,"write":true,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'qa\_%' ESCAPE '\' ORDER BY 1;  -- EXPECT 2
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname LIKE 'qa\_%' ESCAPE '\' AND relkind='r';  -- true
-- SELECT role, demand_score, salary_median FROM public.qa_market_intelligence ORDER BY role;  -- EXPECT 5
-- SELECT slug FROM public.aos_agents WHERE slug='qa-authority';  -- 1
-- =============================================================================
