-- =============================================================================
-- Chief Growth Officer (CGO) Agent — DB schema
-- Tables: cgo_growth_campaigns, cgo_growth_assets, cgo_hook_bank, cgo_growth_briefs
-- RLS: admin-only read/write (same pattern as other agent tables).
-- Apply BY HAND in the Supabase SQL editor.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- cgo_growth_campaigns — parent campaign records
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.cgo_growth_campaigns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  objective       text,
  status          text NOT NULL DEFAULT 'active',   -- active | paused | completed
  theme           text,
  launch_date     date,
  summary         text,
  created_by_agent text,
  metadata        jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cgo_growth_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cgo_campaigns_admin_all" ON public.cgo_growth_campaigns
  FOR ALL
  TO authenticated
  USING (public.aos_is_admin())
  WITH CHECK (public.aos_is_admin());

-- ---------------------------------------------------------------------------
-- cgo_growth_assets — every generated growth asset
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.cgo_growth_assets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug      text NOT NULL DEFAULT 'chief-growth-officer',
  sub_agent       text NOT NULL,
  channel         text NOT NULL,  -- linkedin | instagram | tiktok | youtube_shorts | youtube_longform | email | community | lead_magnet | webinar | seo_blog
  content_type    text NOT NULL,
  audience        text NOT NULL,  -- career_changers | working_professionals | africa_cameroon | dominican_republic | employers
  flywheel_stage  text NOT NULL,  -- attention | trust | community | transformation | employment | success_stories | authority
  risk_tier       text NOT NULL DEFAULT 'low',  -- low | medium | high
  title           text NOT NULL,
  hook            text,
  body            text,
  cta             text,
  proof_source    text,
  kpi_target      text,
  score           integer,        -- 0-100 quality score; >=85 ships
  hashtags        text[]  NOT NULL DEFAULT '{}',
  -- Content Excellence Gate scores (stored for founder review transparency)
  kane_score      integer,
  hormozi_score   integer,
  trust_score     integer,
  transformation_score integer,
  employment_score integer,
  excellence_gate text,  -- publish | revise | reject
  status          text NOT NULL DEFAULT 'pending_approval',  -- pending_approval | needs_revision | approved | rejected | scheduled | published
  campaign_id     uuid REFERENCES public.cgo_growth_campaigns(id) ON DELETE SET NULL,
  created_by_agent text,
  approved_by     text,
  approved_at     timestamptz,
  scheduled_for   timestamptz,
  metadata        jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cgo_assets_channel    ON public.cgo_growth_assets(channel);
CREATE INDEX IF NOT EXISTS idx_cgo_assets_status     ON public.cgo_growth_assets(status);
CREATE INDEX IF NOT EXISTS idx_cgo_assets_flywheel   ON public.cgo_growth_assets(flywheel_stage);
CREATE INDEX IF NOT EXISTS idx_cgo_assets_campaign   ON public.cgo_growth_assets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_cgo_assets_created    ON public.cgo_growth_assets(created_at DESC);

ALTER TABLE public.cgo_growth_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cgo_assets_admin_all" ON public.cgo_growth_assets
  FOR ALL
  TO authenticated
  USING (public.aos_is_admin())
  WITH CHECK (public.aos_is_admin());

-- ---------------------------------------------------------------------------
-- cgo_hook_bank — tested hooks across 9 buckets
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.cgo_hook_bank (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug      text NOT NULL DEFAULT 'chief-growth-officer',
  hook            text NOT NULL,
  bucket          text NOT NULL,  -- contrarian_belief | costly_mistake | surprising_proof | identity_aspiration | identity_threat | speed_to_outcome | myth_busting | behind_the_build | transformation_story
  audience        text NOT NULL,
  channel         text NOT NULL,
  emotional_trigger text,
  shareability    integer,  -- 1-10
  controversy     integer,  -- 1-10
  trust           integer,  -- 1-10
  -- performance (filled in after testing)
  impressions     integer,
  engagement_rate numeric(5,2),
  ctr             numeric(5,2),
  scale_signal    boolean,  -- true = scale, false = kill
  tested_at       timestamptz,
  metadata        jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cgo_hooks_bucket  ON public.cgo_hook_bank(bucket);
CREATE INDEX IF NOT EXISTS idx_cgo_hooks_channel ON public.cgo_hook_bank(channel);
CREATE INDEX IF NOT EXISTS idx_cgo_hooks_scale   ON public.cgo_hook_bank(scale_signal);

ALTER TABLE public.cgo_hook_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cgo_hooks_admin_all" ON public.cgo_hook_bank
  FOR ALL
  TO authenticated
  USING (public.aos_is_admin())
  WITH CHECK (public.aos_is_admin());

-- ---------------------------------------------------------------------------
-- cgo_growth_briefs — daily CGO operating brief
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.cgo_growth_briefs (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug           text NOT NULL DEFAULT 'chief-growth-officer',
  date                 date NOT NULL,
  launch_day_relative  text,   -- T-4, T-3, ..., Launch, T+1, ...
  overall_status       text NOT NULL DEFAULT 'green',  -- green | yellow | red
  created_count        integer NOT NULL DEFAULT 0,
  flywheel_coverage    jsonb NOT NULL DEFAULT '{}',
  platform_coverage    jsonb NOT NULL DEFAULT '{}',
  top_priorities       text[] NOT NULL DEFAULT '{}',
  approval_queue       text[] NOT NULL DEFAULT '{}',
  risks                text[] NOT NULL DEFAULT '{}',
  recommendation       text,
  created_by_agent     text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cgo_briefs_date ON public.cgo_growth_briefs(date);

ALTER TABLE public.cgo_growth_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cgo_briefs_admin_all" ON public.cgo_growth_briefs
  FOR ALL
  TO authenticated
  USING (public.aos_is_admin())
  WITH CHECK (public.aos_is_admin());

-- ---------------------------------------------------------------------------
-- updated_at triggers (mirrors pattern used on other agent tables)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'cgo_campaigns_updated_at') THEN
    CREATE TRIGGER cgo_campaigns_updated_at
      BEFORE UPDATE ON public.cgo_growth_campaigns
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'cgo_assets_updated_at') THEN
    CREATE TRIGGER cgo_assets_updated_at
      BEFORE UPDATE ON public.cgo_growth_assets
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;
