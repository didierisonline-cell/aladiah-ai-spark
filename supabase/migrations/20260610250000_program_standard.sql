-- =============================================================================
-- Aladiah Program Standard v1.0 — extends curriculum_audits with the scoring model
-- =============================================================================
-- Phase 2A. The Program Standard is the canonical structure every Aladiah program
-- must follow (10 architectures + scoring model + Curriculum Excellence Score +
-- world-class thresholds). This migration is ADDITIVE — it stores the standard
-- evaluation alongside the curriculum audit. No new agent, no production writes.
--
--   curriculum_audits += ces, dimension_scores, world_class, standard_version
--
-- Admin-scoped (RLS already on curriculum_audits). Idempotent; apply by hand.
-- =============================================================================

ALTER TABLE public.curriculum_audits ADD COLUMN IF NOT EXISTS ces              INTEGER DEFAULT 0;       -- Curriculum Excellence Score (0-100) vs the standard
ALTER TABLE public.curriculum_audits ADD COLUMN IF NOT EXISTS dimension_scores JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.curriculum_audits ADD COLUMN IF NOT EXISTS world_class      BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.curriculum_audits ADD COLUMN IF NOT EXISTS standard_version TEXT NOT NULL DEFAULT 'v1.0';

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema='public' AND table_name='curriculum_audits'
--   AND column_name IN ('ces','dimension_scores','world_class','standard_version') ORDER BY 1;  -- EXPECT 4
-- =============================================================================
