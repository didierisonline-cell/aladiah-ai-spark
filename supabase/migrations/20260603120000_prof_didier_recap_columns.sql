-- =============================================================================
-- prof_didier_recap_columns — Prof. Didier greeting/recap, Step 1 (SCHEMA ONLY)
-- =============================================================================
-- Adds the student-state columns on public.profiles that the personalized
-- Prof. Didier briefing/recap reads. Additive + idempotent; no backfill needed
-- (sane defaults). RLS is UNCHANGED — the existing owner row policies on
-- public.profiles ("Users can view/insert/update own profile",
-- auth.uid() = user_id) already cover these columns.
--
-- DELIVERY: reviewable file + paste-ready block. NOT executed by Claude Code —
-- apply by hand in the Supabase SQL editor, then run the verification SELECT.
-- Per CLAUDE.md: "success / no rows" means it RAN, not that it's CORRECT — verify.
--
-- COLUMNS (purpose):
--   onboarding_completed          — has the student finished initial onboarding
--                                   (distinct from has_completed_intro, which is
--                                   the Community intro-form flag).
--   last_login_at                 — drives "welcome back" vs first-time briefing.
--   last_prof_didier_briefing_at  — when the recap/briefing was last delivered
--                                   (lets a future writer gate frequency).
--   prof_didier_voice_muted       — student preference to mute the voice briefing.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed          BOOLEAN     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_login_at                 TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_prof_didier_briefing_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS prof_didier_voice_muted       BOOLEAN     NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- VERIFICATION (run after applying — expect exactly these 4 rows):
-- ---------------------------------------------------------------------------
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name   = 'profiles'
--   AND column_name IN ('onboarding_completed', 'last_login_at',
--                       'last_prof_didier_briefing_at', 'prof_didier_voice_muted')
-- ORDER BY column_name;
