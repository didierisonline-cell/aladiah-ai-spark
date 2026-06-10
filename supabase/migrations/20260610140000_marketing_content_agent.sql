-- =============================================================================
-- Aladiah Marketing Content Agent — domain schema
-- =============================================================================
-- The Marketing Content Agent is a first-class AOS citizen: its registry row,
-- runs, logs, memory, tasks, and messages all live in the aos_* tables
-- (migration 20260610130000). THIS migration adds only its DOMAIN OUTPUT:
--
--   marketing_campaigns        — campaign groupings
--   marketing_content_calendar — daily/weekly/monthly content plans
--   marketing_content          — every generated asset (the approval queue lives
--                                here: status = 'pending_approval')
--   marketing_approvals        — founder approve/reject/edit decision audit
--
-- APPROVAL RULE: nothing publishes automatically. Generated assets land at
-- status 'pending_approval'; the founder approves/rejects/edits before anything
-- can move toward 'published'. Enforced by the AOS permissions framework
-- (publish capability is false + human_approval_required true for this agent).
--
-- AUTH: admin-scoped via public.aos_is_admin() (defined in the AOS migration;
-- re-declared here CREATE OR REPLACE so this file is self-sufficient).
--
-- DELIVERY: reviewable file. Apply by hand after the AOS migration, then run the
-- verification SELECTs. Idempotent — safe to re-run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  );
$$;


-- -----------------------------------------------------------------------------
-- marketing_campaigns
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  objective        TEXT,
  goal             TEXT,
  theme            TEXT,
  status           TEXT NOT NULL DEFAULT 'planning',   -- planning | active | paused | completed
  channels         TEXT[] NOT NULL DEFAULT '{}',
  start_date       DATE,
  end_date         DATE,
  summary          TEXT,
  created_by_agent TEXT DEFAULT 'marketing-content',
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON public.marketing_campaigns (status);


-- -----------------------------------------------------------------------------
-- marketing_content_calendar
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketing_content_calendar (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope            TEXT NOT NULL,                       -- daily | weekly | monthly
  period_start     DATE NOT NULL DEFAULT current_date,
  period_end       DATE,
  theme            TEXT,
  status           TEXT NOT NULL DEFAULT 'draft',        -- draft | active | archived
  plan             JSONB NOT NULL DEFAULT '[]'::jsonb,   -- array of {date, platform, content_type, title, status, content_id}
  created_by_agent TEXT DEFAULT 'marketing-content',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_marketing_calendar_scope ON public.marketing_content_calendar (scope);
CREATE INDEX IF NOT EXISTS idx_marketing_calendar_start ON public.marketing_content_calendar (period_start DESC);


-- -----------------------------------------------------------------------------
-- marketing_content  (every generated asset; the approval queue lives here)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketing_content (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug       TEXT NOT NULL DEFAULT 'marketing-content',
  platform         TEXT NOT NULL,                        -- linkedin | facebook | instagram | blog | email | youtube | webinar | lead_magnet
  content_type     TEXT NOT NULL,                        -- e.g. thought_leadership, carousel, blog_pillar, newsletter, yt_script, yt_short, lead_magnet_checklist ...
  title            TEXT,
  hook             TEXT,
  body             TEXT,
  cta              TEXT,
  hashtags         TEXT[] NOT NULL DEFAULT '{}',
  theme            TEXT,
  audience         TEXT,
  status           TEXT NOT NULL DEFAULT 'pending_approval', -- draft | queued | pending_approval | approved | rejected | scheduled | published
  campaign_id      UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  calendar_id      UUID REFERENCES public.marketing_content_calendar(id) ON DELETE SET NULL,
  source_idea      TEXT,
  repurposed_from  UUID REFERENCES public.marketing_content(id) ON DELETE SET NULL,
  performance      JSONB NOT NULL DEFAULT '{}'::jsonb,   -- {impressions, clicks, likes, comments, leads, ...}
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  scheduled_for    TIMESTAMPTZ,
  created_by_agent TEXT DEFAULT 'marketing-content',
  approved_by      UUID,
  approved_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_marketing_content_status   ON public.marketing_content (status);
CREATE INDEX IF NOT EXISTS idx_marketing_content_platform ON public.marketing_content (platform);
CREATE INDEX IF NOT EXISTS idx_marketing_content_campaign ON public.marketing_content (campaign_id);
CREATE INDEX IF NOT EXISTS idx_marketing_content_created  ON public.marketing_content (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_content_theme    ON public.marketing_content (theme);


-- -----------------------------------------------------------------------------
-- marketing_approvals (decision audit: approve / reject / edit)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketing_approvals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id  UUID NOT NULL REFERENCES public.marketing_content(id) ON DELETE CASCADE,
  decision    TEXT NOT NULL,                             -- approved | rejected | edited
  notes       TEXT,
  decided_by  UUID,
  decided_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_marketing_approvals_content ON public.marketing_approvals (content_id);


-- =============================================================================
-- Row Level Security — admin-scoped (SELECT / INSERT / UPDATE; no DELETE)
-- =============================================================================
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'marketing_campaigns','marketing_content_calendar','marketing_content','marketing_approvals'
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
-- Seed: register the Marketing Content Agent in the AOS registry
-- =============================================================================
INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'marketing-content',
  'Marketing Content Agent',
  'AI marketing department — creates awareness, authority, leads, enrollments',
  'Generates high-quality marketing assets across LinkedIn, Facebook, Instagram, blog, email, YouTube, webinars, and lead magnets. Everything enters an approval queue; nothing publishes automatically.',
  'active',
  30,
  'daily',
  '{"read":true,"write":true,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;


-- =============================================================================
-- VERIFICATION (run AFTER applying; read-only)
-- =============================================================================
-- (a) Four marketing tables exist.  EXPECT 4 rows.
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema='public' AND table_name LIKE 'marketing\_%' ESCAPE '\' ORDER BY table_name;

-- (b) RLS enabled on all four.
-- SELECT relname, relrowsecurity FROM pg_class
-- WHERE relname LIKE 'marketing\_%' ESCAPE '\' AND relkind='r' ORDER BY relname;

-- (c) Policies: 3 per table = 12, none DELETE.
-- SELECT tablename, cmd, count(*) FROM pg_policies
-- WHERE schemaname='public' AND tablename LIKE 'marketing\_%' ESCAPE '\'
-- GROUP BY tablename, cmd ORDER BY tablename, cmd;

-- (d) Marketing agent registered.  EXPECT 1 row.
-- SELECT slug, name, status, priority, permissions FROM public.aos_agents WHERE slug='marketing-content';
-- =============================================================================
