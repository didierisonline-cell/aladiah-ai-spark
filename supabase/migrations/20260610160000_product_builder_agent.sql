-- =============================================================================
-- Aladiah Product Builder Agent — domain schema
-- =============================================================================
-- Agent #4 of the AI Workforce, and the foundation for the future Curriculum,
-- Simulation Factory, and QA agents. Cross-cutting state (registry, runs, logs,
-- memory, tasks, messages) lives in the aos_* tables. This migration adds the
-- product DOMAIN OUTPUT:
--
--   product_artifacts       — generated modules/quizzes/simulations/labs/projects/
--                             learning-paths (DRAFTS — never the live curriculum)
--   product_gaps            — curriculum gap analysis (competency coverage etc.)
--   product_recommendations — course improvements / new programs / learning paths
--   product_approvals       — approve / reject / edit decision audit
--
-- CANON COMPLIANCE (see /docs/standards):
--  * The agent reads live curriculum tables (courses, chapters, videos, quizzes,
--    quiz_questions) READ-ONLY for gap analysis. It writes ONLY product_* tables.
--  * Generated artifacts are DRAFTS at status 'pending_approval'. Nothing is
--    published directly. Promotion of an approved artifact into the live
--    curriculum is a SEPARATE, HUMAN-GATED step (Claude Code never auto-applies
--    SQL or live-DB writes — NORTH_STAR working rules).
--  * Every generated quiz question carries exactly ONE Axis-1 competency slug
--    from COMPETENCY_TAXONOMY.md (competency populated at insert time, never
--    null), and option text never embeds A)/B)/C)/D) prefixes (CLAUDE.md).
--
-- AUTH: admin-scoped via public.aos_is_admin() (re-declared CREATE OR REPLACE so
-- this file is self-sufficient). DELIVERY: reviewable file, applied by hand.
-- Idempotent.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin');
$$;


-- -----------------------------------------------------------------------------
-- product_artifacts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_artifacts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug       TEXT NOT NULL DEFAULT 'product-builder',
  artifact_type    TEXT NOT NULL,                       -- module | quiz | simulation | lab | project | learning_path
  title            TEXT NOT NULL,
  summary          TEXT,
  program          TEXT,                                 -- e.g. scrum (matches COMPETENCY_TAXONOMY program key)
  course_ref       TEXT,
  module_ref       TEXT,
  competencies     TEXT[] NOT NULL DEFAULT '{}',          -- Axis-1 slugs (e.g. scrum:roles)
  payload          JSONB NOT NULL DEFAULT '{}'::jsonb,     -- the actual generated content
  quality_score    INTEGER,
  status           TEXT NOT NULL DEFAULT 'pending_approval', -- draft | pending_approval | approved | rejected | published
  source           TEXT,                                  -- gap id / task id / run id
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  approved_by      UUID,
  approved_at      TIMESTAMPTZ,
  created_by_agent TEXT DEFAULT 'product-builder',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_artifacts_status  ON public.product_artifacts (status);
CREATE INDEX IF NOT EXISTS idx_product_artifacts_type    ON public.product_artifacts (artifact_type);
CREATE INDEX IF NOT EXISTS idx_product_artifacts_program ON public.product_artifacts (program);


-- -----------------------------------------------------------------------------
-- product_gaps
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_gaps (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program             TEXT,
  competency          TEXT,                              -- Axis-1 slug or area
  gap_type            TEXT NOT NULL,                      -- missing_module | weak_coverage | no_assessment | no_simulation | outdated
  severity            TEXT NOT NULL DEFAULT 'medium',      -- low | medium | high | critical
  description         TEXT,
  recommendation      TEXT,
  status              TEXT NOT NULL DEFAULT 'open',        -- open | addressed | dismissed
  related_artifact_id UUID REFERENCES public.product_artifacts(id) ON DELETE SET NULL,
  created_by_agent    TEXT DEFAULT 'product-builder',
  metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_gaps_status  ON public.product_gaps (status);
CREATE INDEX IF NOT EXISTS idx_product_gaps_program ON public.product_gaps (program);


-- -----------------------------------------------------------------------------
-- product_recommendations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_recommendations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rec_type         TEXT NOT NULL,                        -- course_improvement | new_program | learning_path | outcome_improvement
  title            TEXT NOT NULL,
  rationale        TEXT,
  priority         TEXT NOT NULL DEFAULT 'medium',         -- low | medium | high
  program          TEXT,
  status           TEXT NOT NULL DEFAULT 'pending',        -- pending | accepted | delegated | done | dismissed
  payload          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_agent TEXT DEFAULT 'product-builder',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_recs_status ON public.product_recommendations (status);


-- -----------------------------------------------------------------------------
-- product_approvals (decision audit)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_approvals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID NOT NULL REFERENCES public.product_artifacts(id) ON DELETE CASCADE,
  decision    TEXT NOT NULL,                             -- approved | rejected | edited
  notes       TEXT,
  decided_by  UUID,
  decided_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_approvals_artifact ON public.product_approvals (artifact_id);


-- =============================================================================
-- Row Level Security — admin-scoped (SELECT / INSERT / UPDATE; no DELETE)
-- =============================================================================
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'product_artifacts','product_gaps','product_recommendations','product_approvals'
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
-- Seed: register the Product Builder Agent in the AOS registry
-- =============================================================================
INSERT INTO public.aos_agents (slug, name, role, description, status, priority, cadence, permissions)
VALUES (
  'product-builder',
  'Product Builder Agent',
  'Product development department — modules, quizzes, simulations, labs, learning paths',
  'Continuously improves Aladiah: generates curriculum artifacts (drafts), detects competency/curriculum gaps, and recommends improvements + new programs. Reads live curriculum read-only; writes only product_* drafts; everything enters an approval workflow. Foundation for the Curriculum, Simulation Factory, and QA agents.',
  'active',
  20,
  'weekly',
  '{"read":true,"write":true,"publish":false,"admin":false,"human_approval_required":true}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;


-- =============================================================================
-- VERIFICATION (run AFTER applying; read-only)
-- =============================================================================
-- (a) Four product tables exist.
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema='public' AND table_name LIKE 'product\_%' ESCAPE '\' ORDER BY table_name;
-- (b) RLS enabled on all four.
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname LIKE 'product\_%' ESCAPE '\' AND relkind='r' ORDER BY relname;
-- (c) Policies: 3 per table = 12, none DELETE.
-- SELECT tablename, cmd, count(*) FROM pg_policies WHERE schemaname='public' AND tablename LIKE 'product\_%' ESCAPE '\' GROUP BY tablename, cmd ORDER BY tablename, cmd;
-- (d) Product agent registered.
-- SELECT slug, name, status, priority FROM public.aos_agents WHERE slug='product-builder';
-- =============================================================================
