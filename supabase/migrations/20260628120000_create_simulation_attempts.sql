-- =============================================================================
-- simulation_attempts — persists SimEngine results for history + analytics
-- Apply AFTER: existing schema migrations
-- =============================================================================

CREATE TABLE public.simulation_attempts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Simulation identity (from src/data/simulations.ts)
  sim_id        TEXT        NOT NULL,   -- e.g. "ai-cloud-engineer-m1-s1"
  program_key   TEXT        NOT NULL,   -- e.g. "ai-cloud-engineer"
  module_num    INT         NOT NULL,
  sim_index     INT         NOT NULL,
  sim_title     TEXT        NOT NULL,
  sim_type      TEXT        NOT NULL,
  difficulty    TEXT        NOT NULL,
  xp_available  INT         NOT NULL,

  -- Result (from ScoreResult in SimEngine.tsx)
  score         INT         NOT NULL CHECK (score BETWEEN 0 AND 100),
  xp_earned     INT         NOT NULL CHECK (xp_earned >= 0),
  verdict       TEXT        NOT NULL,
  strengths     JSONB       NOT NULL DEFAULT '[]',
  improvements  JSONB       NOT NULL DEFAULT '[]',
  key_decisions JSONB       NOT NULL DEFAULT '[]',

  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup: history for a user, best score per sim
CREATE INDEX simulation_attempts_user_id_idx ON public.simulation_attempts (user_id);
CREATE INDEX simulation_attempts_user_sim_idx ON public.simulation_attempts (user_id, sim_id);

-- RLS: students read and write only their own rows
ALTER TABLE public.simulation_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sim_attempts_select_own"
  ON public.simulation_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "sim_attempts_insert_own"
  ON public.simulation_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- VERIFY (run immediately after applying)
-- Expected: table exists, RLS on, 2 policies
-- =============================================================================
SELECT table_name, row_security
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'simulation_attempts';

SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'simulation_attempts';
