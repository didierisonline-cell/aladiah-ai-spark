-- =============================================================================
-- Aladiah Career Transformation Architecture — Product Builder expansion
-- =============================================================================
-- Reframes the Product Builder from a course factory into a CAREER TRANSFORMATION
-- factory of ten engines (see CAREER_TRANSFORMATION_ARCHITECTURE.md). This
-- migration is ADDITIVE:
--   * product_artifacts += engine, target_outcomes[], outcome_signals (which
--     engine produced an artifact and which of the six transformation outcomes
--     it advances)
--   * product_outcomes — the Student Outcome Engine's data model: the six
--     transformation KPIs (employment, promotion, salary_growth,
--     leadership_readiness, ai_readiness, competency_mastery) tracked vs target.
--
-- Outcome VALUES are honest (seeded at 0 — no fabricated metrics); TARGETS are
-- goals. Nothing here writes to the live curriculum. Admin-scoped via
-- public.aos_is_admin(). Idempotent; apply by hand.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;

-- -----------------------------------------------------------------------------
-- product_artifacts: engine + transformation-outcome columns
-- -----------------------------------------------------------------------------
ALTER TABLE public.product_artifacts ADD COLUMN IF NOT EXISTS engine          TEXT;
ALTER TABLE public.product_artifacts ADD COLUMN IF NOT EXISTS target_outcomes TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.product_artifacts ADD COLUMN IF NOT EXISTS outcome_signals JSONB NOT NULL DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_product_artifacts_engine ON public.product_artifacts (engine);


-- -----------------------------------------------------------------------------
-- product_outcomes: the six transformation KPIs (Student Outcome Engine)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_outcomes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric      TEXT NOT NULL,                            -- employment | promotion | salary_growth | leadership_readiness | ai_readiness | competency_mastery
  program     TEXT,
  period      TEXT NOT NULL DEFAULT 'all_time',
  value       NUMERIC NOT NULL DEFAULT 0,
  target      NUMERIC,
  unit        TEXT DEFAULT '%',
  source      TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_outcomes_key ON public.product_outcomes (metric, program, period);

ALTER TABLE public.product_outcomes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read product_outcomes" ON public.product_outcomes;
CREATE POLICY "Admins read product_outcomes" ON public.product_outcomes FOR SELECT USING (public.aos_is_admin());
DROP POLICY IF EXISTS "Admins insert product_outcomes" ON public.product_outcomes;
CREATE POLICY "Admins insert product_outcomes" ON public.product_outcomes FOR INSERT WITH CHECK (public.aos_is_admin());
DROP POLICY IF EXISTS "Admins update product_outcomes" ON public.product_outcomes;
CREATE POLICY "Admins update product_outcomes" ON public.product_outcomes FOR UPDATE USING (public.aos_is_admin());


-- -----------------------------------------------------------------------------
-- Seed the six transformation KPIs for the Scrum program (value 0 = honest;
-- target = goal). The Student Outcome Engine updates `value` as real data lands.
-- -----------------------------------------------------------------------------
INSERT INTO public.product_outcomes (metric, program, period, value, target, unit, notes) VALUES
  ('employment',           'scrum', 'all_time', 0, 70, '%', 'Job-placement rate of learners pursuing employment.'),
  ('promotion',            'scrum', 'all_time', 0, 30, '%', 'Promotion rate within 12 months.'),
  ('salary_growth',        'scrum', 'all_time', 0, 25, '%', 'Average salary increase post-transformation.'),
  ('leadership_readiness', 'scrum', 'all_time', 0, 75, '%', 'Avg leadership-readiness score from simulations.'),
  ('ai_readiness',         'scrum', 'all_time', 0, 80, '%', 'Avg AI-readiness score.'),
  ('competency_mastery',   'scrum', 'all_time', 0, 85, '%', 'Avg competency-mastery across the program.')
ON CONFLICT (metric, program, period) DO NOTHING;


-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema='public' AND table_name='product_artifacts'
--   AND column_name IN ('engine','target_outcomes','outcome_signals') ORDER BY column_name;  -- EXPECT 3
-- SELECT metric, value, target FROM public.product_outcomes WHERE program='scrum' ORDER BY metric;  -- EXPECT 6
-- SELECT relrowsecurity FROM pg_class WHERE oid='public.product_outcomes'::regclass;  -- EXPECT true
-- =============================================================================
