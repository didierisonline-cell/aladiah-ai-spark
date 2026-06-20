-- ============================================================================
-- BA Simulation 1 — "Aurora Retail: The Returns Problem" — data model.
-- Apply by hand in Supabase (Claude Code does not auto-apply). Mirrors the
-- scrum_simulations / simulation_messages / simulation_scores pattern, adding a
-- findings table (the Evidence Board: each finding links to its source for
-- traceability). Owner-scoped RLS; rows created only by the owner.
--
-- Architecture: docs/curriculum/business-analyst-v1/simulations/
--   01_DISCOVERY_ENGAGEMENT_BLUEPRINT.md (§7 data model).
-- The interactive engine (ba-simulation edge function + page screens) is built
-- in later increments; this schema is the foundation.
-- ============================================================================

-- 1) Simulation instance per user ------------------------------------------
CREATE TABLE IF NOT EXISTS public.ba_simulations (
  id           uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id  text NOT NULL DEFAULT 'aurora-returns',
  phase        text NOT NULL DEFAULT 'plan',     -- plan|interview|synthesize|model|opportunities|prioritize|compliance|recommendation
  status       text NOT NULL DEFAULT 'active',   -- active|completed|abandoned
  score        int,
  grade        text,
  started_at   timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ba_simulations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own ba sims"   ON public.ba_simulations;
DROP POLICY IF EXISTS "Users create own ba sims" ON public.ba_simulations;
DROP POLICY IF EXISTS "Users update own ba sims" ON public.ba_simulations;
CREATE POLICY "Users view own ba sims"   ON public.ba_simulations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own ba sims" ON public.ba_simulations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own ba sims" ON public.ba_simulations FOR UPDATE USING (auth.uid() = user_id);

-- 2) Interview / chat messages ---------------------------------------------
CREATE TABLE IF NOT EXISTS public.ba_simulation_messages (
  id            uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id uuid NOT NULL REFERENCES public.ba_simulations(id) ON DELETE CASCADE,
  phase         text NOT NULL,
  role          text NOT NULL,        -- 'user' | 'persona' | 'system'
  speaker       text,                 -- persona name, e.g. 'Diane Okafor'
  content       text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ba_simulation_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own ba sim messages"   ON public.ba_simulation_messages;
DROP POLICY IF EXISTS "Users create own ba sim messages" ON public.ba_simulation_messages;
CREATE POLICY "Users view own ba sim messages" ON public.ba_simulation_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.ba_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()));
CREATE POLICY "Users create own ba sim messages" ON public.ba_simulation_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.ba_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()));

-- 3) Evidence Board findings (source-linked for traceability) ---------------
CREATE TABLE IF NOT EXISTS public.ba_simulation_findings (
  id            uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id uuid NOT NULL REFERENCES public.ba_simulations(id) ON DELETE CASCADE,
  text          text NOT NULL,
  source        text,                 -- where the finding came from (traceability)
  opportunity   text,                 -- clustered opportunity, if any
  priority      text,                 -- value/effort rank, if set
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ba_simulation_findings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own ba sim findings"   ON public.ba_simulation_findings;
DROP POLICY IF EXISTS "Users manage own ba sim findings" ON public.ba_simulation_findings;
CREATE POLICY "Users view own ba sim findings" ON public.ba_simulation_findings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.ba_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()));
CREATE POLICY "Users manage own ba sim findings" ON public.ba_simulation_findings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.ba_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()))
  WITH CHECK (
  EXISTS (SELECT 1 FROM public.ba_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()));

-- 4) Per-dimension scores (skills report) -----------------------------------
CREATE TABLE IF NOT EXISTS public.ba_simulation_scores (
  id            uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id uuid NOT NULL REFERENCES public.ba_simulations(id) ON DELETE CASCADE,
  dimension     text NOT NULL,        -- elicitation|stakeholders|synthesis|current_state|prioritization|compliance|recommendation
  score         int  NOT NULL DEFAULT 0,
  feedback      text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (simulation_id, dimension)
);

ALTER TABLE public.ba_simulation_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own ba sim scores"   ON public.ba_simulation_scores;
DROP POLICY IF EXISTS "Users create own ba sim scores" ON public.ba_simulation_scores;
CREATE POLICY "Users view own ba sim scores" ON public.ba_simulation_scores FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.ba_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()));
CREATE POLICY "Users create own ba sim scores" ON public.ba_simulation_scores FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.ba_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_ba_sim_user      ON public.ba_simulations (user_id);
CREATE INDEX IF NOT EXISTS idx_ba_sim_msg_sim   ON public.ba_simulation_messages (simulation_id);
CREATE INDEX IF NOT EXISTS idx_ba_sim_find_sim  ON public.ba_simulation_findings (simulation_id);

-- ============================================================================
-- VERIFICATION (run AFTER applying; read-only)
--   SELECT tablename FROM pg_tables WHERE schemaname='public'
--     AND tablename LIKE 'ba_simulation%';                    -- 4 rows
--   SELECT relrowsecurity FROM pg_class
--     WHERE oid='public.ba_simulations'::regclass;            -- true
--   SELECT tablename, count(*) FROM pg_policies
--     WHERE schemaname='public' AND tablename LIKE 'ba_simulation%'
--     GROUP BY tablename;                                     -- policies per table
-- ROLLBACK:
--   DROP TABLE IF EXISTS public.ba_simulation_scores, public.ba_simulation_findings,
--     public.ba_simulation_messages, public.ba_simulations CASCADE;
-- ============================================================================
