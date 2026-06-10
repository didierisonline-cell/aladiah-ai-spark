-- =============================================================================
-- Aladiah Agent Operating System (AOS) — core infrastructure
-- =============================================================================
-- The permanent operating system for the Aladiah AI Workforce. Every future
-- agent plugs into THESE tables instead of inventing its own. Six tables cover
-- the eight subsystems:
--
--   1. Agent Registry          -> aos_agents          (incl. Permissions + Health columns)
--   2. Agent Memory            -> aos_agent_memory
--   3. Agent Task Manager      -> aos_tasks            (dependencies, priority)
--   4. Agent Orchestrator      -> aos_runs             (run outcomes / retries)
--   5. Agent Execution Logs    -> aos_execution_logs   (every action, per run)
--   6. Agent Permissions       -> aos_agents.permissions (jsonb) + service enforcement
--   7. Agent Health Monitoring -> aos_agents health columns + aos_runs aggregation
--   8. Agent Communication     -> aos_messages         (agent <-> agent + CEO)
--
-- Relationship to the CEO agent (migration 20260610120000): those agent_* tables
-- remain the CEO agent's DOMAIN OUTPUT store (its daily reports). The aos_* tables
-- are the shared INFRASTRUCTURE layer the CEO agent (and all future agents) run on.
--
-- AUTH: admin-scoped via public.user_roles, enforced with the SECURITY DEFINER
-- helper public.aos_is_admin(). Services run client-side under the admin session,
-- so admins get SELECT/INSERT/UPDATE (never DELETE — the workforce never deletes
-- its own audit trail). Future service-role / cron callers bypass RLS.
--
-- DELIVERY: reviewable file. Apply by hand in Supabase, then run the verification
-- SELECTs at the bottom. Written idempotently — safe to re-run.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Admin predicate (shared by every AOS policy)
-- -----------------------------------------------------------------------------
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


-- =============================================================================
-- 1 / 6 / 7) aos_agents — Registry + Permissions + Health
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.aos_agents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  TEXT NOT NULL UNIQUE,
  name                  TEXT NOT NULL,
  role                  TEXT,
  description           TEXT,
  status                TEXT NOT NULL DEFAULT 'active',   -- active | paused | disabled | error
  priority              INTEGER NOT NULL DEFAULT 100,     -- lower = runs first
  cadence               TEXT DEFAULT 'manual',            -- manual | hourly | daily | weekly
  schedule_cron         TEXT,
  system_prompt         TEXT,
  -- Permissions framework (read/write/publish/admin/human_approval_required):
  permissions           JSONB NOT NULL DEFAULT
    '{"read":true,"write":true,"publish":false,"admin":false,"human_approval_required":true}'::jsonb,
  config                JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Scheduling:
  last_run_at           TIMESTAMPTZ,
  next_run_at           TIMESTAMPTZ,
  -- Health monitoring:
  last_success_at       TIMESTAMPTZ,
  last_error_at         TIMESTAMPTZ,
  last_error            TEXT,
  run_count             INTEGER NOT NULL DEFAULT 0,
  error_count           INTEGER NOT NULL DEFAULT 0,
  consecutive_failures  INTEGER NOT NULL DEFAULT 0,
  performance_score     NUMERIC NOT NULL DEFAULT 100,     -- 0-100
  avg_duration_ms       NUMERIC,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_aos_agents_status   ON public.aos_agents (status);
CREATE INDEX IF NOT EXISTS idx_aos_agents_next_run ON public.aos_agents (next_run_at);
CREATE INDEX IF NOT EXISTS idx_aos_agents_priority ON public.aos_agents (priority);


-- =============================================================================
-- 2) aos_agent_memory — short-term / long-term, importance, searchable
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.aos_agent_memory (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug       TEXT NOT NULL,
  memory_type      TEXT NOT NULL DEFAULT 'short_term',  -- short_term | long_term | episodic
  content          TEXT NOT NULL,
  summary          TEXT,
  importance       NUMERIC NOT NULL DEFAULT 0.5,         -- 0.0 - 1.0
  tags             TEXT[] NOT NULL DEFAULT '{}',
  source           TEXT,                                  -- run id / task id / message id
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Reserved for Phase 2 semantic search (pgvector). Kept JSONB so this migration
  -- needs no extension; swap to `vector` once pgvector is enabled.
  embedding        JSONB,
  expires_at       TIMESTAMPTZ,                           -- short-term TTL
  access_count     INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_aos_memory_agent      ON public.aos_agent_memory (agent_slug);
CREATE INDEX IF NOT EXISTS idx_aos_memory_type       ON public.aos_agent_memory (memory_type);
CREATE INDEX IF NOT EXISTS idx_aos_memory_importance ON public.aos_agent_memory (importance DESC);
CREATE INDEX IF NOT EXISTS idx_aos_memory_tags       ON public.aos_agent_memory USING GIN (tags);
-- Full-text search support for the v1 recall() (no extension required).
CREATE INDEX IF NOT EXISTS idx_aos_memory_fts
  ON public.aos_agent_memory USING GIN (to_tsvector('english', coalesce(content, '') || ' ' || coalesce(summary, '')));


-- =============================================================================
-- 3) aos_tasks — Task Manager (dependencies, priority, assignment)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.aos_tasks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  description       TEXT,
  created_by_agent  TEXT,                                 -- slug or 'human'
  assigned_agent    TEXT,                                 -- slug, null = unassigned pool
  status            TEXT NOT NULL DEFAULT 'pending',       -- pending | ready | in_progress | blocked | completed | failed | cancelled
  priority          TEXT NOT NULL DEFAULT 'medium',        -- low | medium | high | critical
  depends_on        UUID[] NOT NULL DEFAULT '{}',          -- task dependencies
  payload           JSONB NOT NULL DEFAULT '{}'::jsonb,
  result            JSONB,
  due_at            TIMESTAMPTZ,
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  source_report_id  UUID,                                  -- optional link to agent_reports
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_aos_tasks_status   ON public.aos_tasks (status);
CREATE INDEX IF NOT EXISTS idx_aos_tasks_assigned ON public.aos_tasks (assigned_agent);
CREATE INDEX IF NOT EXISTS idx_aos_tasks_priority ON public.aos_tasks (priority);


-- =============================================================================
-- 4) aos_runs — Orchestrator run records (outcomes + retries)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.aos_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug      TEXT NOT NULL,
  trigger_source  TEXT DEFAULT 'manual',                  -- manual | cron | orchestrator | message
  status          TEXT NOT NULL DEFAULT 'running',         -- running | success | error | retrying | timeout
  attempt         INTEGER NOT NULL DEFAULT 1,
  max_attempts    INTEGER NOT NULL DEFAULT 1,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at     TIMESTAMPTZ,
  duration_ms     INTEGER,
  error           TEXT,
  output          JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_aos_runs_agent  ON public.aos_runs (agent_slug);
CREATE INDEX IF NOT EXISTS idx_aos_runs_status ON public.aos_runs (status);
CREATE INDEX IF NOT EXISTS idx_aos_runs_started ON public.aos_runs (started_at DESC);


-- =============================================================================
-- 5) aos_execution_logs — every action performed by every agent
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.aos_execution_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id      UUID REFERENCES public.aos_runs(id) ON DELETE CASCADE,
  agent_slug  TEXT NOT NULL,
  action      TEXT NOT NULL,
  level       TEXT NOT NULL DEFAULT 'info',               -- debug | info | warn | error
  result      TEXT,                                        -- success | error | skipped
  message     TEXT,
  detail      JSONB NOT NULL DEFAULT '{}'::jsonb,
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_aos_logs_run     ON public.aos_execution_logs (run_id);
CREATE INDEX IF NOT EXISTS idx_aos_logs_agent   ON public.aos_execution_logs (agent_slug);
CREATE INDEX IF NOT EXISTS idx_aos_logs_created ON public.aos_execution_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_aos_logs_level   ON public.aos_execution_logs (level);


-- =============================================================================
-- 8) aos_messages — Communication Layer (agent <-> agent, CEO <-> workforce)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.aos_messages (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent         TEXT NOT NULL,                        -- slug or 'human'
  to_agent           TEXT NOT NULL,                        -- slug or 'broadcast'
  message_type       TEXT NOT NULL DEFAULT 'message',      -- message | task_request | report | alert | response
  subject            TEXT,
  body               TEXT,
  payload            JSONB NOT NULL DEFAULT '{}'::jsonb,
  status             TEXT NOT NULL DEFAULT 'unread',        -- unread | read | processed | archived
  related_task_id    UUID,
  related_report_id  UUID,
  requires_response  BOOLEAN NOT NULL DEFAULT false,
  in_reply_to        UUID,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at            TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_aos_messages_to      ON public.aos_messages (to_agent);
CREATE INDEX IF NOT EXISTS idx_aos_messages_status  ON public.aos_messages (status);
CREATE INDEX IF NOT EXISTS idx_aos_messages_created ON public.aos_messages (created_at DESC);


-- =============================================================================
-- Row Level Security — admin-scoped (SELECT / INSERT / UPDATE; no DELETE)
-- =============================================================================
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'aos_agents','aos_agent_memory','aos_tasks','aos_runs','aos_execution_logs','aos_messages'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);

    EXECUTE format('DROP POLICY IF EXISTS "Admins read %1$s" ON public.%1$I;', t);
    EXECUTE format(
      'CREATE POLICY "Admins read %1$s" ON public.%1$I FOR SELECT USING (public.aos_is_admin());', t);

    EXECUTE format('DROP POLICY IF EXISTS "Admins insert %1$s" ON public.%1$I;', t);
    EXECUTE format(
      'CREATE POLICY "Admins insert %1$s" ON public.%1$I FOR INSERT WITH CHECK (public.aos_is_admin());', t);

    EXECUTE format('DROP POLICY IF EXISTS "Admins update %1$s" ON public.%1$I;', t);
    EXECUTE format(
      'CREATE POLICY "Admins update %1$s" ON public.%1$I FOR UPDATE USING (public.aos_is_admin());', t);
  END LOOP;
END $$;


-- =============================================================================
-- Seed: register the CEO Chief of Staff Agent as the first agent in the registry
-- =============================================================================
INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'ceo-chief-of-staff',
  'CEO Chief of Staff Agent',
  'Executive operating assistant for the founder',
  'Monitors Aladiah daily, summarizes performance, surfaces risks, and recommends CEO actions. Agent #1 of the AI Workforce.',
  'active',
  10,
  'daily',
  '{"read":true,"write":true,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;


-- =============================================================================
-- VERIFICATION (run AFTER applying; read-only)
-- =============================================================================

-- (a) Six AOS tables exist.  EXPECT 6 rows.
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema='public' AND table_name LIKE 'aos\_%' ESCAPE '\' ORDER BY table_name;

-- (b) RLS enabled on all six.  EXPECT relrowsecurity = true for each.
-- SELECT relname, relrowsecurity FROM pg_class
-- WHERE relname LIKE 'aos\_%' ESCAPE '\' AND relkind='r' ORDER BY relname;

-- (c) Policies present (3 per table = 18; none DELETE).
-- SELECT tablename, cmd, count(*) FROM pg_policies
-- WHERE schemaname='public' AND tablename LIKE 'aos\_%' ESCAPE '\'
-- GROUP BY tablename, cmd ORDER BY tablename, cmd;

-- (d) Admin predicate exists.
-- SELECT proname FROM pg_proc WHERE proname = 'aos_is_admin';

-- (e) CEO agent seeded.  EXPECT 1 row.
-- SELECT slug, name, status, priority FROM public.aos_agents WHERE slug='ceo-chief-of-staff';
-- =============================================================================
