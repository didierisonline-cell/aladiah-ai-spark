-- =============================================================================
-- Aladiah Admissions Authority Agent — domain schema
-- =============================================================================
-- Agent #6. Converts QUALIFIED prospects into successful students, optimizing for
-- enrollment QUALITY (fit, completion probability, certification success,
-- employment, salary) — not enrollment volume. Cross-cutting state lives in the
-- aos_* tables. Domain output:
--
--   admissions_prospects        — the prospect record + all engine scores
--   admissions_recommendations  — program/action recommendations (approval-gated)
--   admissions_followups        — DRAFTED outreach (never auto-sent; founder-gated)
--
-- APPROVAL RULES (enforced by the AOS permissions framework: publish=false,
-- human_approval_required=true): the agent qualifies, matches, recommends,
-- projects, predicts, and DRAFTS outreach — but never sends messages, charges
-- payments, or enrolls/modifies student records without founder approval.
--
-- Admin-scoped via public.aos_is_admin(). Idempotent; apply by hand.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;

-- -----------------------------------------------------------------------------
-- admissions_prospects
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admissions_prospects (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT,
  email                   TEXT,
  source                  TEXT,
  region                  TEXT,
  target_role             TEXT,
  current_role            TEXT,
  background              TEXT,                          -- e.g. non_tech | developer | manager | student
  budget_band             TEXT DEFAULT 'unknown',         -- low | mid | high | unknown
  timeline                TEXT DEFAULT 'exploring',        -- now | 3m | 6m | exploring
  commitment_hours        INTEGER DEFAULT 0,               -- hours/week the prospect can commit
  motivation              INTEGER DEFAULT 3,               -- 1-5
  webinar_attended        BOOLEAN DEFAULT false,
  -- engine scores
  qualification_score     INTEGER,
  fit_score               INTEGER,
  completion_probability  INTEGER,
  employability_score     INTEGER,
  financial_score         INTEGER,
  matched_program         TEXT,
  recommended_program     TEXT,
  financial_readiness     TEXT,                            -- ready | needs_plan | not_ready | unknown
  status                  TEXT NOT NULL DEFAULT 'new',     -- new | qualified | nurturing | enrolled | disqualified
  objections              JSONB NOT NULL DEFAULT '[]'::jsonb,
  employability_projection JSONB NOT NULL DEFAULT '{}'::jsonb,
  success_prediction      JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata                JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_adm_prospects_status ON public.admissions_prospects (status);
CREATE INDEX IF NOT EXISTS idx_adm_prospects_created ON public.admissions_prospects (created_at DESC);

-- -----------------------------------------------------------------------------
-- admissions_recommendations (approval-gated)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admissions_recommendations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id         UUID REFERENCES public.admissions_prospects(id) ON DELETE CASCADE,
  rec_type            TEXT NOT NULL,                       -- program | enroll | nurture | disqualify | action
  title               TEXT NOT NULL,
  rationale           TEXT,
  priority            TEXT NOT NULL DEFAULT 'medium',
  status              TEXT NOT NULL DEFAULT 'pending',      -- pending | approved | actioned | dismissed
  approved_by_founder BOOLEAN NOT NULL DEFAULT false,
  payload             JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_adm_recs_prospect ON public.admissions_recommendations (prospect_id);
CREATE INDEX IF NOT EXISTS idx_adm_recs_status   ON public.admissions_recommendations (status);

-- -----------------------------------------------------------------------------
-- admissions_followups (drafted outreach — never auto-sent)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admissions_followups (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id       UUID REFERENCES public.admissions_prospects(id) ON DELETE CASCADE,
  step_no           INTEGER NOT NULL DEFAULT 1,
  channel           TEXT NOT NULL DEFAULT 'email',          -- email | call | dm
  subject           TEXT,
  message           TEXT,
  scheduled_for     TIMESTAMPTZ,
  status            TEXT NOT NULL DEFAULT 'drafted',         -- drafted | approved | sent | skipped
  requires_approval BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_adm_followups_prospect ON public.admissions_followups (prospect_id);
CREATE INDEX IF NOT EXISTS idx_adm_followups_status   ON public.admissions_followups (status);

-- -----------------------------------------------------------------------------
-- RLS — admin-scoped (SELECT / INSERT / UPDATE; no DELETE)
-- -----------------------------------------------------------------------------
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['admissions_prospects','admissions_recommendations','admissions_followups'] LOOP
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
-- Seed a few SAMPLE prospects so the engines have something to process.
-- (Clearly marked source='seed-sample' — replace with real intake.)
-- -----------------------------------------------------------------------------
INSERT INTO public.admissions_prospects (name, email, source, region, target_role, current_role, background, budget_band, timeline, commitment_hours, motivation, webinar_attended, status)
VALUES
  ('Sample — Aisha N.',  'aisha.sample@example.com',  'seed-sample', 'Nigeria',            'Scrum Master',    'Business Analyst', 'manager',   'mid',  'now',       10, 5, true,  'new'),
  ('Sample — Carlos D.', 'carlos.sample@example.com', 'seed-sample', 'Dominican Republic', 'Scrum Master',    'Developer',        'developer', 'low',  '3m',         6, 4, false, 'new'),
  ('Sample — Grace M.',  'grace.sample@example.com',  'seed-sample', 'Kenya',              'Project Manager', 'Teacher',          'non_tech',  'low',  'exploring',  4, 3, false, 'new')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- Register the Admissions Authority agent
-- -----------------------------------------------------------------------------
INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'admissions-authority',
  'Admissions Authority Agent',
  'Converts qualified prospects into successful students; optimizes enrollment quality',
  'Qualifies leads, matches careers, recommends programs, assesses financial readiness, resolves objections, projects employability, and predicts student success — optimizing for fit, completion, certification, employment, and salary growth (not volume). Drafts outreach but never sends, charges, or enrolls without founder approval.',
  'active',
  28,
  'daily',
  '{"read":true,"write":true,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'admissions\_%' ESCAPE '\' ORDER BY 1;  -- 3
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname LIKE 'admissions\_%' ESCAPE '\' AND relkind='r';  -- true
-- SELECT name, status FROM public.admissions_prospects ORDER BY created_at;  -- 3 samples
-- SELECT slug FROM public.aos_agents WHERE slug='admissions-authority';  -- 1
-- =============================================================================
