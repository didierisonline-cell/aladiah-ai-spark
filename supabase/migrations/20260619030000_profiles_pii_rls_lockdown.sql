-- =============================================================================
-- SECURITY HARDENING — profiles PII RLS lockdown + safe public referral RPC
-- =============================================================================
-- Apply by hand in the Supabase SQL editor (Claude Code does not auto-apply).
-- After running, see the verification SELECTs at the bottom.
--
-- PROBLEM
--   Migration 20260215063914 made public.profiles WORLD-READABLE:
--     CREATE POLICY "Public can view profiles for referral pages"
--       ON public.profiles FOR SELECT USING (true);
--   and dropped the owner-only SELECT. It also exposed public.referral_codes
--   (code -> user_id mapping) to anyone via USING (true). profiles carries PII
--   (full_name, avatar_url, login timestamps, language + course preferences),
--   so any anonymous visitor could read every user's profile and enumerate the
--   full code->user mapping. Launch blocker.
--
-- FIX
--   1. profiles: readable ONLY by the owner (auth.uid() = user_id) or an admin
--      (public.aos_is_admin()). No public access.
--   2. referral_codes: restore owner-only SELECT (no public code->user lookup).
--   3. Referral landing pages read through ONE SECURITY DEFINER function,
--      public.get_referral_profile(code), which returns ONLY safe display
--      fields — never email/phone/language/login-time/course IDs.
-- =============================================================================

BEGIN;

-- 1) profiles — remove the world-readable policy, restore least privilege -----
DROP POLICY IF EXISTS "Public can view profiles for referral pages" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile"                  ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"                ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Rule 2 — users can read only their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Rule 3 — founder/admin (role = 'admin' in user_roles) can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.aos_is_admin());

-- 2) referral_codes — stop exposing code -> user_id to the world --------------
DROP POLICY IF EXISTS "Anyone can look up referral codes by code" ON public.referral_codes;
DROP POLICY IF EXISTS "Users can view own referral codes"          ON public.referral_codes;

CREATE POLICY "Users can view own referral codes"
  ON public.referral_codes FOR SELECT
  USING (auth.uid() = user_id);

-- 3) safe public referral function (Rules 4 & 5) ------------------------------
-- Resolves a referral code and returns ONLY non-sensitive display fields.
-- SECURITY DEFINER so it can read under the now-locked RLS, but it hand-selects
-- safe columns only. Note the explicit, fixed search_path (anti-hijack).
CREATE OR REPLACE FUNCTION public.get_referral_profile(p_code text)
RETURNS TABLE (
  referral_code_id  uuid,
  full_name         text,
  avatar_url        text,
  joined_date       timestamptz,
  post_count        integer,
  reply_count       integer,
  courses_completed integer,
  recent_posts      jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH rc AS (
    SELECT id, user_id FROM public.referral_codes WHERE code = p_code LIMIT 1
  )
  SELECT
    rc.id,
    p.full_name,
    p.avatar_url,
    p.created_at,
    COALESCE((SELECT count(*) FROM public.community_posts   cp WHERE cp.user_id = rc.user_id), 0)::int,
    COALESCE((SELECT count(*) FROM public.community_replies cr WHERE cr.user_id = rc.user_id), 0)::int,
    COALESCE((SELECT count(*) FROM public.user_progress     up WHERE up.user_id = rc.user_id), 0)::int,
    COALESCE((
      SELECT jsonb_agg(row_to_json(x))
      FROM (
        SELECT content, created_at, post_type
        FROM public.community_posts cp
        WHERE cp.user_id = rc.user_id
        ORDER BY cp.created_at DESC
        LIMIT 3
      ) x
    ), '[]'::jsonb)
  FROM rc
  JOIN public.profiles p ON p.user_id = rc.user_id;
$$;

-- Only callable as an RPC; not selectable as a value source.
REVOKE ALL ON FUNCTION public.get_referral_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_referral_profile(text) TO anon, authenticated;

-- 4) safe display surface for authenticated social features ------------------
-- profiles is now owner/admin-only, which would blank author names in the
-- community / feedback feeds (they read other users' display names). Expose
-- ONLY non-sensitive display columns (name + avatar) via a definer-style view
-- (security_invoker = false → runs as the view owner, bypassing profiles RLS),
-- granted to AUTHENTICATED users only. No email, phone, language, login times,
-- tier, or course choices are exposed. Anonymous referral pages do NOT use this
-- view — they use get_referral_profile() above.
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles
  WITH (security_invoker = false) AS
  SELECT user_id, full_name, avatar_url
  FROM public.profiles;

REVOKE ALL ON public.public_profiles FROM PUBLIC;
GRANT SELECT ON public.public_profiles TO authenticated;

COMMIT;

-- =============================================================================
-- VERIFICATION (run AFTER the COMMIT; "no rows" on a write means it ran, not
-- that it was correct — always confirm with these SELECTs)
-- =============================================================================
-- (a) profiles is no longer world-readable; only owner + admin SELECT remain:
--   SELECT policyname, cmd, qual
--   FROM pg_policies WHERE schemaname='public' AND tablename='profiles' ORDER BY policyname;
--   -- expect: "Users can view own profile" (auth.uid() = user_id)
--   --         "Admins can view all profiles" (aos_is_admin())
--   -- and NO "Public can view profiles for referral pages".
--
-- (b) referral_codes has no USING(true) policy:
--   SELECT policyname, cmd, qual FROM pg_policies
--   WHERE schemaname='public' AND tablename='referral_codes';
--
-- (c) the safe RPC exists and is SECURITY DEFINER:
--   SELECT proname, prosecdef FROM pg_proc WHERE proname='get_referral_profile';
--   -- expect prosecdef = true
--
-- (d) functional check — anonymous referral read still works through the RPC:
--   SELECT * FROM public.get_referral_profile('<an existing code>');
-- =============================================================================
