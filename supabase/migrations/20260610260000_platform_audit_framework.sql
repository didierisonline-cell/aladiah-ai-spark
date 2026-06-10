-- =============================================================================
-- Aladiah Platform Audit Framework — Site Audit Authority
-- =============================================================================
-- Extends the Operations & Platform Authority's findings into the structured
-- pre-launch audit output: Issue · Severity · Screenshot · Fix Recommendation ·
-- Owner · Status. Additive; read-only reporting (no auto-fixes). Idempotent.
-- =============================================================================

ALTER TABLE public.ops_findings ADD COLUMN IF NOT EXISTS owner      TEXT;
ALTER TABLE public.ops_findings ADD COLUMN IF NOT EXISTS screenshot TEXT;

-- VERIFY:
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema='public' AND table_name='ops_findings'
--   AND column_name IN ('owner','screenshot') ORDER BY 1;  -- EXPECT 2
-- =============================================================================
