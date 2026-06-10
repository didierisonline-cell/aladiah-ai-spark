-- =============================================================================
-- Aladiah AI Workforce — Agent #1: CEO Chief of Staff
-- =============================================================================
-- Creates the four tables the CEO Chief of Staff Agent reads/writes:
--   1) agent_reports            — one stored daily command report (JSONB sections)
--   2) agent_tasks              — internal tasks the agent spins up from a report
--   3) business_metrics_daily   — daily KPI snapshot the agent reads
--   4) agent_recommendations    — CEO recommendations (with founder-approval gate)
--
-- Column definitions are taken VERBATIM from the CEO Chief of Staff blueprint v1.
-- This file ADDS (per the repo canon) what the blueprint omitted: idempotent
-- guards, admin-scoped Row Level Security, indexes, and verification SELECTs.
--
-- AUTH MODEL: v1 runs CLIENT-SIDE via src/services/agents/ceoChiefOfStaffAgent.ts
-- using the logged-in admin's session (anon key + JWT). RLS therefore grants the
-- admin role SELECT/INSERT/UPDATE on the agent_* tables (NOT delete — the agent
-- "never deletes data"). Cross-user/service-role access bypasses RLS the same way
-- admin-analytics does. Admin is determined via public.user_roles (role='admin').
--
-- DELIVERY: reviewable file. Per the working rules, a human applies this in the
-- Supabase SQL editor and then runs the verification SELECTs at the bottom.
-- Written idempotently (IF NOT EXISTS / DROP POLICY IF EXISTS) so it is safe to
-- re-run and safe against partial prior application.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1) agent_reports — the stored daily command report
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agent_reports (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date          DATE NOT NULL DEFAULT current_date,
  agent_name           TEXT NOT NULL,
  report_type          TEXT NOT NULL,
  summary              TEXT,
  revenue_summary      JSONB,
  student_summary      JSONB,
  product_summary      JSONB,
  platform_summary     JSONB,
  marketing_summary    JSONB,
  sales_summary        JSONB,
  risks                JSONB,
  recommended_actions  JSONB,
  urgency_level        TEXT DEFAULT 'normal',
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- One canonical report per agent per day (re-runs upsert on this key).
CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_reports_agent_date
  ON public.agent_reports (agent_name, report_date);

CREATE INDEX IF NOT EXISTS idx_agent_reports_report_date
  ON public.agent_reports (report_date DESC);


-- -----------------------------------------------------------------------------
-- 2) agent_tasks — internal tasks generated from a report
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agent_tasks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT,
  assigned_agent   TEXT,
  status           TEXT DEFAULT 'pending',
  priority         TEXT DEFAULT 'medium',
  category         TEXT,
  due_date         DATE,
  source_report_id UUID REFERENCES public.agent_reports(id) ON DELETE SET NULL,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_tasks_status   ON public.agent_tasks (status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_priority ON public.agent_tasks (priority);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_source   ON public.agent_tasks (source_report_id);


-- -----------------------------------------------------------------------------
-- 3) business_metrics_daily — daily KPI snapshot the agent reads
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_metrics_daily (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date              DATE NOT NULL DEFAULT current_date,
  new_signups              INTEGER DEFAULT 0,
  paid_students            INTEGER DEFAULT 0,
  active_students          INTEGER DEFAULT 0,
  inactive_students        INTEGER DEFAULT 0,
  new_leads                INTEGER DEFAULT 0,
  hot_leads                INTEGER DEFAULT 0,
  mrr                      NUMERIC DEFAULT 0,
  revenue_today            NUMERIC DEFAULT 0,
  failed_payments          INTEGER DEFAULT 0,
  cancelled_subscriptions  INTEGER DEFAULT 0,
  website_visitors         INTEGER DEFAULT 0,
  posts_published          INTEGER DEFAULT 0,
  support_tickets_open     INTEGER DEFAULT 0,
  created_at               TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- One metrics row per day.
CREATE UNIQUE INDEX IF NOT EXISTS idx_business_metrics_daily_date
  ON public.business_metrics_daily (metric_date);


-- -----------------------------------------------------------------------------
-- 4) agent_recommendations — CEO recommendations with founder-approval gate
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agent_recommendations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id           UUID REFERENCES public.agent_reports(id) ON DELETE CASCADE,
  recommendation      TEXT NOT NULL,
  reason              TEXT,
  impact_level        TEXT,
  effort_level        TEXT,
  status              TEXT DEFAULT 'pending',
  approved_by_founder BOOLEAN DEFAULT false,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_recommendations_report ON public.agent_recommendations (report_id);
CREATE INDEX IF NOT EXISTS idx_agent_recommendations_status ON public.agent_recommendations (status);


-- =============================================================================
-- Row Level Security — admin-scoped via public.user_roles (role = 'admin')
-- =============================================================================
-- Pattern mirrors admin-analytics: the only humans who touch the AI Workforce
-- tables are admins. Service-role callers (future cron) bypass RLS entirely.
-- SELECT / INSERT / UPDATE are granted; DELETE is intentionally NOT granted, so
-- RLS blocks deletes ("never delete data").
-- =============================================================================

ALTER TABLE public.agent_reports          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_recommendations  ENABLE ROW LEVEL SECURITY;

-- agent_reports
DROP POLICY IF EXISTS "Admins read agent_reports"   ON public.agent_reports;
CREATE POLICY "Admins read agent_reports"   ON public.agent_reports FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
DROP POLICY IF EXISTS "Admins insert agent_reports" ON public.agent_reports;
CREATE POLICY "Admins insert agent_reports" ON public.agent_reports FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
DROP POLICY IF EXISTS "Admins update agent_reports" ON public.agent_reports;
CREATE POLICY "Admins update agent_reports" ON public.agent_reports FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

-- agent_tasks
DROP POLICY IF EXISTS "Admins read agent_tasks"   ON public.agent_tasks;
CREATE POLICY "Admins read agent_tasks"   ON public.agent_tasks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
DROP POLICY IF EXISTS "Admins insert agent_tasks" ON public.agent_tasks;
CREATE POLICY "Admins insert agent_tasks" ON public.agent_tasks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
DROP POLICY IF EXISTS "Admins update agent_tasks" ON public.agent_tasks;
CREATE POLICY "Admins update agent_tasks" ON public.agent_tasks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

-- business_metrics_daily
DROP POLICY IF EXISTS "Admins read business_metrics_daily"   ON public.business_metrics_daily;
CREATE POLICY "Admins read business_metrics_daily"   ON public.business_metrics_daily FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
DROP POLICY IF EXISTS "Admins insert business_metrics_daily" ON public.business_metrics_daily;
CREATE POLICY "Admins insert business_metrics_daily" ON public.business_metrics_daily FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
DROP POLICY IF EXISTS "Admins update business_metrics_daily" ON public.business_metrics_daily;
CREATE POLICY "Admins update business_metrics_daily" ON public.business_metrics_daily FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

-- agent_recommendations
DROP POLICY IF EXISTS "Admins read agent_recommendations"   ON public.agent_recommendations;
CREATE POLICY "Admins read agent_recommendations"   ON public.agent_recommendations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
DROP POLICY IF EXISTS "Admins insert agent_recommendations" ON public.agent_recommendations;
CREATE POLICY "Admins insert agent_recommendations" ON public.agent_recommendations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
DROP POLICY IF EXISTS "Admins update agent_recommendations" ON public.agent_recommendations;
CREATE POLICY "Admins update agent_recommendations" ON public.agent_recommendations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));


-- =============================================================================
-- Seed registry note (optional): record the agent in business_metrics_daily?  No.
-- No seed rows are inserted — the agent populates these tables at runtime.
-- =============================================================================


-- =============================================================================
-- VERIFICATION (run AFTER applying; read-only, mutates nothing)
-- =============================================================================

-- (a) All four tables exist.
--     EXPECT 4 rows.
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_name IN ('agent_reports','agent_tasks','business_metrics_daily','agent_recommendations')
-- ORDER BY table_name;

-- (b) RLS is enabled on all four.
--     EXPECT relrowsecurity = true for each.
-- SELECT relname, relrowsecurity FROM pg_class
-- WHERE oid IN (
--   'public.agent_reports'::regclass,
--   'public.agent_tasks'::regclass,
--   'public.business_metrics_daily'::regclass,
--   'public.agent_recommendations'::regclass
-- ) ORDER BY relname;

-- (c) Policies present (SELECT/INSERT/UPDATE per table; NO delete).
--     EXPECT 12 rows total (3 per table), none with cmd = 'DELETE'.
-- SELECT tablename, policyname, cmd FROM pg_policies
-- WHERE schemaname = 'public'
--   AND tablename IN ('agent_reports','agent_tasks','business_metrics_daily','agent_recommendations')
-- ORDER BY tablename, cmd;

-- (d) Key indexes present.
-- SELECT indexname FROM pg_indexes
-- WHERE schemaname = 'public'
--   AND tablename IN ('agent_reports','agent_tasks','business_metrics_daily','agent_recommendations')
-- ORDER BY indexname;
-- =============================================================================
