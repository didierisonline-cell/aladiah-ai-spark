-- =============================================================================
-- profiles RLS lockdown — fixes world-readable profiles. Apply BY HAND in the
-- Supabase SQL editor (Claude Code does not auto-apply SQL).
--
-- PROBLEM (introduced by 20260215063914): that migration dropped the owner-only
-- "Users can view own profile" SELECT policy and replaced it with
-- "Public can view profiles for referral pages" USING (true). Net effect: the
-- ENTIRE profiles table (tier, full_name, login timestamps, recap state, flags)
-- is readable by anon and by every authenticated user.
--
-- FIX (safe referral/view pattern):
--   1. Remove the world-read policy.
--   2. Owner can SELECT only their own row.
--   3. Founder/admin (public.aos_is_admin) can SELECT all rows.
--   4. Public/community/referral display reads go through a NARROW view
--      (public.public_profiles) exposing ONLY non-sensitive columns —
--      never tier, email, timestamps, or internal flags.
--
-- Non-destructive to data; only swaps policies and adds a view.
-- Requires public.aos_is_admin() (20260610110000 / 20260612070000).
-- =============================================================================

-- 1) Remove the world-readable SELECT policy.
DROP POLICY IF EXISTS "Public can view profiles for referral pages" ON public.profiles;

-- 2) Owner-only SELECT (idempotent re-create).
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- 3) Founder/admin can read all profiles (admin dashboards, support).
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.aos_is_admin());

-- (INSERT/UPDATE own-row policies from the initial migration are unchanged.)

-- 4) Narrow public view for community/feedback/referral display.
--    A non-security_invoker view runs as its owner and returns ONLY these
--    columns, so the base-table RLS lockdown above is preserved while public
--    pages still get display name + avatar. NO tier / email / flags exposed.
CREATE OR REPLACE VIEW public.public_profiles AS
  SELECT user_id, full_name, avatar_url, created_at
  FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- =============================================================================
-- VERIFICATION (run after applying):
--
-- Effective profiles policies (expect: own SELECT, admin SELECT, own INSERT, own UPDATE):
--   SELECT policyname, cmd, qual FROM pg_policies
--   WHERE schemaname='public' AND tablename='profiles' ORDER BY cmd, policyname;
--
-- 1. anon cannot read profiles directly (run as anon / signed out):
--   SELECT count(*) FROM public.profiles;            -- expect 0 rows / permission denied
-- 2. authenticated reads only their own:
--   SELECT user_id FROM public.profiles;             -- expect exactly the caller's row
-- 3. founder reads all (run while signed in as a founder email):
--   SELECT count(*) FROM public.profiles;            -- expect full count
-- 4. referral pages still work without base-table access:
--   SELECT * FROM public.public_profiles LIMIT 1;    -- expect name/avatar only, any user
-- =============================================================================
