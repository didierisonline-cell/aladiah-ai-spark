-- =============================================================================
-- Aladiah Operations & Platform Authority — domain schema
-- =============================================================================
-- Agent #10. Guardian of platform reliability, student experience, revenue
-- protection, and operational excellence. READ-ONLY: it monitors and reports
-- findings; it never fixes, publishes, or modifies anything. Founder approval is
-- required for any corrective action.
--
--   ops_status    — component health (platform/infra/AI/payment)
--   ops_findings  — issues found, with a severity model (critical/high/medium/low)
--   ops_reports   — daily operations reports
--
-- Admin-scoped via public.aos_is_admin(). Idempotent; apply by hand.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;

CREATE TABLE IF NOT EXISTS public.ops_status (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component   TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'platform',           -- platform | infrastructure | ai_service | payment
  status      TEXT NOT NULL DEFAULT 'unknown',            -- operational | degraded | down | unknown
  latency_ms  INTEGER,
  detail      TEXT,
  checked_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ops_status_component ON public.ops_status (component);

CREATE TABLE IF NOT EXISTS public.ops_findings (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engine         TEXT NOT NULL,
  severity       TEXT NOT NULL DEFAULT 'low',              -- critical | high | medium | low
  area           TEXT,
  title          TEXT NOT NULL,
  detail         TEXT,
  recommendation TEXT,
  status         TEXT NOT NULL DEFAULT 'open',             -- open | acknowledged | resolved | dismissed
  metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ops_findings_severity ON public.ops_findings (severity);
CREATE INDEX IF NOT EXISTS idx_ops_findings_status   ON public.ops_findings (status);

CREATE TABLE IF NOT EXISTS public.ops_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date     DATE NOT NULL DEFAULT current_date,
  platform_status TEXT NOT NULL DEFAULT 'operational',
  summary         TEXT,
  critical_count  INTEGER DEFAULT 0,
  sections        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ops_reports_date ON public.ops_reports (report_date);

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['ops_status','ops_findings','ops_reports'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins read %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Admins read %1$s" ON public.%1$I FOR SELECT USING (public.aos_is_admin());', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins insert %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Admins insert %1$s" ON public.%1$I FOR INSERT WITH CHECK (public.aos_is_admin());', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins update %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Admins update %1$s" ON public.%1$I FOR UPDATE USING (public.aos_is_admin());', t);
  END LOOP;
END $$;

-- Seed baseline component status rows (the agent refreshes them each audit).
INSERT INTO public.ops_status (component, category, status, detail) VALUES
  ('Homepage', 'platform', 'operational', 'Structural check'),
  ('Student Portal', 'platform', 'operational', 'Structural check'),
  ('Courses', 'platform', 'operational', 'Structural check'),
  ('Checkout', 'platform', 'operational', 'Structural check'),
  ('Login', 'platform', 'operational', 'Structural check'),
  ('Supabase', 'infrastructure', 'unknown', 'Live probe Phase 2'),
  ('Database', 'infrastructure', 'unknown', 'Live probe Phase 2'),
  ('Authentication', 'infrastructure', 'unknown', 'Live probe Phase 2'),
  ('Vercel', 'infrastructure', 'unknown', 'Live probe Phase 2'),
  ('Email Service', 'infrastructure', 'unknown', 'Live probe Phase 2'),
  ('Claude', 'ai_service', 'unknown', 'Live probe Phase 2'),
  ('OpenAI', 'ai_service', 'unknown', 'Live probe Phase 2'),
  ('ElevenLabs', 'ai_service', 'unknown', 'Live probe Phase 2')
ON CONFLICT (component) DO NOTHING;

INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'operations-platform',
  'Operations & Platform Authority',
  'Guardian of platform reliability, student experience, and revenue protection',
  'Monitors the platform, infrastructure, AI services, courses, simulations, and payments; runs functional/integrity/audit engines; reports findings by severity and a daily operations report. Read-only — reports findings only; founder approval required for corrective actions.',
  'active',
  88,
  'daily',
  '{"read":true,"write":false,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- VERIFY: SELECT slug FROM public.aos_agents WHERE slug='operations-platform';
