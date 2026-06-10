-- =============================================================================
-- Aladiah Analytics & Executive Intelligence Authority — domain schema
-- =============================================================================
-- Agent #9. The Executive Intelligence Layer and source of truth for the whole
-- ecosystem. READ-ONLY: it analyzes data from every other agent's tables and the
-- product DB; it never modifies production data. Primary KPI: the Career
-- Transformation Impact Score (CTIS) — the master company KPI.
--
--   analytics_reports — CEO briefs (CTIS + intelligence sections + forecasts +
--                       risks + recommendations + priority actions)
--   analytics_metrics — metric snapshots (time-series for trends/forecasting)
--
-- Admin-scoped via public.aos_is_admin(). Idempotent; apply by hand.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;

CREATE TABLE IF NOT EXISTS public.analytics_reports (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type      TEXT NOT NULL DEFAULT 'ceo_brief',
  report_date      DATE NOT NULL DEFAULT current_date,
  ctis             INTEGER DEFAULT 0,                     -- Career Transformation Impact Score (master KPI)
  summary          TEXT,
  sections         JSONB NOT NULL DEFAULT '{}'::jsonb,    -- revenue/students/employability/curriculum/marketing
  forecasts        JSONB NOT NULL DEFAULT '{}'::jsonb,
  risks            JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations  JSONB NOT NULL DEFAULT '[]'::jsonb,
  priority_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_reports_key ON public.analytics_reports (report_type, report_date);
CREATE INDEX IF NOT EXISTS idx_analytics_reports_date ON public.analytics_reports (report_date DESC);

CREATE TABLE IF NOT EXISTS public.analytics_metrics (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key  TEXT NOT NULL,
  value       NUMERIC NOT NULL DEFAULT 0,
  dimension   TEXT,
  period      TEXT NOT NULL DEFAULT 'snapshot',
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_key ON public.analytics_metrics (metric_key, captured_at DESC);

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['analytics_reports','analytics_metrics'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins read %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Admins read %1$s" ON public.%1$I FOR SELECT USING (public.aos_is_admin());', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins insert %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Admins insert %1$s" ON public.%1$I FOR INSERT WITH CHECK (public.aos_is_admin());', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins update %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Admins update %1$s" ON public.%1$I FOR UPDATE USING (public.aos_is_admin());', t);
  END LOOP;
END $$;

INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'analytics-intelligence',
  'Analytics & Executive Intelligence Authority',
  'Executive intelligence layer; source of truth for the whole ecosystem',
  'Analyzes data from every agent and the product DB to produce revenue, student, employability, curriculum, and marketing intelligence, forecasts, and a daily CEO brief. Primary KPI: Career Transformation Impact Score (CTIS). READ-ONLY — never modifies production data; recommendations only.',
  'active',
  85,
  'daily',
  '{"read":true,"write":false,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- VERIFY: SELECT slug FROM public.aos_agents WHERE slug='analytics-intelligence';
