-- =============================================================================
-- Aladiah Student Success & Employability Authority — domain schema
-- =============================================================================
-- Agent #7. Transforms students into employable professionals and future leaders.
-- It READS student data (profiles, user_progress, quiz_attempts, student_analytics,
-- subscriptions) READ-ONLY to compute per-student readiness, and writes ONLY its
-- own success_* tables. Primary KPI: Career Transformation Score (CTS).
--
--   success_students       — per-student success profile + all readiness scores + CTS
--   success_interventions  — drafted interventions (approval-gated; never auto-acted)
--
-- APPROVAL RULES (AOS permissions: publish=false, human_approval_required=true):
-- the agent detects, scores, and DRAFTS interventions, but NEVER modifies student
-- records, sends messages, or acts without founder approval.
--
-- Admin-scoped via public.aos_is_admin(). Idempotent; apply by hand.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;

-- -----------------------------------------------------------------------------
-- success_students
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.success_students (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  TEXT NOT NULL,
  name                     TEXT,
  program                  TEXT,
  -- readiness dimensions (0-100)
  competency_mastery       INTEGER DEFAULT 0,
  completion               INTEGER DEFAULT 0,
  certification_readiness  INTEGER DEFAULT 0,
  simulation_mastery       INTEGER DEFAULT 0,
  portfolio_readiness      INTEGER DEFAULT 0,
  interview_readiness      INTEGER DEFAULT 0,
  resume_score             INTEGER DEFAULT 0,
  linkedin_score           INTEGER DEFAULT 0,
  employability_score      INTEGER DEFAULT 0,
  ai_readiness             INTEGER DEFAULT 0,
  promotion_readiness      INTEGER DEFAULT 0,
  salary_projection        JSONB NOT NULL DEFAULT '{}'::jsonb,
  career_transformation_score INTEGER DEFAULT 0,           -- PRIMARY KPI
  risk_level               TEXT NOT NULL DEFAULT 'low',     -- low | medium | high
  risk_factors             JSONB NOT NULL DEFAULT '[]'::jsonb,
  status                   TEXT NOT NULL DEFAULT 'active',   -- active | at_risk | thriving | placement_ready
  last_active              TIMESTAMPTZ,
  estimated                JSONB NOT NULL DEFAULT '[]'::jsonb, -- which dimensions are estimated (honesty ledger)
  metadata                 JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_success_students_user ON public.success_students (user_id);
CREATE INDEX IF NOT EXISTS idx_success_students_risk ON public.success_students (risk_level);
CREATE INDEX IF NOT EXISTS idx_success_students_cts  ON public.success_students (career_transformation_score DESC);

-- -----------------------------------------------------------------------------
-- success_interventions (approval-gated)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.success_interventions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id          UUID REFERENCES public.success_students(id) ON DELETE CASCADE,
  intervention_type   TEXT NOT NULL,                       -- nudge | coaching | remediation | outreach | placement | escalation
  title               TEXT NOT NULL,
  rationale           TEXT,
  priority            TEXT NOT NULL DEFAULT 'medium',
  status              TEXT NOT NULL DEFAULT 'pending',      -- pending | approved | actioned | dismissed
  approved_by_founder BOOLEAN NOT NULL DEFAULT false,
  payload             JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_success_interv_student ON public.success_interventions (student_id);
CREATE INDEX IF NOT EXISTS idx_success_interv_status  ON public.success_interventions (status);

-- -----------------------------------------------------------------------------
-- RLS — admin-scoped (SELECT / INSERT / UPDATE; no DELETE)
-- -----------------------------------------------------------------------------
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['success_students','success_interventions'] LOOP
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
-- Register the Student Success & Employability Authority agent
-- -----------------------------------------------------------------------------
INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'student-success',
  'Student Success & Employability Authority',
  'Transforms students into employable professionals and future leaders',
  'Owns competency mastery, risk detection, gap analysis, certification/simulation/portfolio/interview readiness, resume + LinkedIn authority, employability scoring, salary projection, promotion readiness, AI readiness, and career transformation. Computes the Career Transformation Score per student. Reads student data read-only; drafts interventions; never modifies student records without founder approval.',
  'active',
  22,
  'daily',
  '{"read":true,"write":true,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'success\_%' ESCAPE '\' ORDER BY 1;  -- 2
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname LIKE 'success\_%' ESCAPE '\' AND relkind='r';  -- true
-- SELECT slug FROM public.aos_agents WHERE slug='student-success';  -- 1
-- =============================================================================
