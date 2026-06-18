-- =============================================================================
-- FIX: profiles table world-readable policy (SECURITY BLOCKER)
--
-- Migration 20260215063914 created "Public can view profiles for referral pages"
-- with USING (true) — making every profiles row readable by anon.
-- This grants unauthenticated access to full_name, avatar_url, tier, and
-- every other column added since, which is a PII exposure for all students.
--
-- Root cause: referral landing pages do NOT require direct profiles SELECT.
-- They only use referral_codes and referral_tracking. The USING (true) policy
-- was unnecessary and must be removed.
--
-- Fix strategy:
--  1. Drop the world-readable policy.
--  2. Restore owner-only SELECT for regular authenticated users.
--  3. Add founder/admin SELECT-all using the existing aos_is_admin() helper.
--  4. Expose a SECURITY DEFINER RPC (get_referral_profile) for any page that
--     legitimately needs to show a referrer's public name/avatar from a code —
--     returns ONLY the non-sensitive display fields, bypasses RLS safely.
--
-- Apply BY HAND in the Supabase SQL editor.
-- Verify with the SELECT checks at the bottom before proceeding.
-- =============================================================================

-- 1. Drop the world-readable policy
DROP POLICY IF EXISTS "Public can view profiles for referral pages" ON public.profiles;

-- 2. Restore owner-only SELECT (authenticated users see only their own row)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Founder/admin can SELECT all profiles (uses existing aos_is_admin() helper)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.aos_is_admin());

-- 4. Safe RPC for referral pages: returns only display-safe fields for a given referral code.
--    SECURITY DEFINER means it runs with the function owner's privileges, bypassing RLS.
--    Only returns (full_name, avatar_url) — never tier, user_id, or PII columns.
CREATE OR REPLACE FUNCTION public.get_referral_profile(p_code text)
RETURNS TABLE (display_name text, avatar_url text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      COALESCE(NULLIF(pr.full_name, ''), 'An Aladiah Member') AS display_name,
      pr.avatar_url
    FROM public.referral_codes rc
    JOIN public.profiles pr ON pr.user_id = rc.user_id
    WHERE rc.code = p_code
      AND rc.is_active = true
    LIMIT 1;
END;
$$;

-- Grant execute to anon and authenticated (the function itself restricts what data is returned)
GRANT EXECUTE ON FUNCTION public.get_referral_profile(text) TO anon, authenticated;

-- 5. Safe RPC for community pages: returns only display-safe fields for a list of user_ids.
--    Used by Community.tsx to show post authors' display names without exposing PII.
--    Returns ONLY (user_id, full_name) — never tier, avatar_url, or other columns.
CREATE OR REPLACE FUNCTION public.get_community_display_names(p_user_ids uuid[])
RETURNS TABLE (user_id uuid, display_name text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      pr.user_id,
      COALESCE(NULLIF(pr.full_name, ''), 'Aladiah Member') AS display_name
    FROM public.profiles pr
    WHERE pr.user_id = ANY(p_user_ids);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_community_display_names(uuid[]) TO authenticated;

-- =============================================================================
-- VERIFICATION — run these after applying:
--
-- 1. Anon cannot SELECT profiles:
--    SET ROLE anon;
--    SELECT * FROM public.profiles LIMIT 1;
--    → expect: (0 rows) or "permission denied"
--    RESET ROLE;
--
-- 2. Authenticated user sees only own row:
--    -- (sign in as a non-admin student, then run:)
--    SELECT count(*) FROM public.profiles;
--    → expect: 1 (only their own row)
--
-- 3. Founder/admin sees all rows:
--    SELECT public.aos_is_admin();   → true
--    SELECT count(*) FROM public.profiles;
--    → expect: total student count
--
-- 4. RPC returns display name without exposing tier/user_id:
--    SELECT * FROM public.get_referral_profile('YOUR_TEST_CODE');
--    → expect: display_name, avatar_url only
-- =============================================================================
