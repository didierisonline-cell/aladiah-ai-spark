-- =============================================================================
-- Lock down public.profiles (PII) + provide safe, minimal access paths.
-- =============================================================================
-- PROBLEM: migration 20260215063914 added `FOR SELECT USING (true)` on profiles
-- and DROPPED the owner-only policy, making EVERY user's full_name / avatar /
-- tier world-readable (even to anon). It did the same to referral_codes.
--
-- THIS MIGRATION:
--   1. profiles  → SELECT only own row (auth.uid()=user_id) OR founder/admin.
--   2. referral_codes → SELECT only own row; the public /refer path no longer
--      reads the table directly.
--   3. get_referral_inviter(code) — SECURITY DEFINER RPC for the public
--      /refer/:code page. Returns ONLY {valid, display_name (first name),
--      avatar_url}. Never exposes user_id, email, full_name, tier or row data.
--      Also records the click (best-effort).
--   4. safe_member_profiles — a column-limited view (user_id, display_name,
--      avatar_url) for AUTHENTICATED community/feedback author display, so the
--      lockdown does not break those features. No full_name / email / tier.
--
-- AUTH helper: public.aos_is_admin() (20260610110000).
-- DELIVERY: reviewable file — apply BY HAND in Supabase. Idempotent. Additive
-- except for the deliberate removal of the two `USING(true)` policies.
-- =============================================================================

-- 1) profiles --------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view profiles for referral pages" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.aos_is_admin());
-- (INSERT/UPDATE "own" policies from the original migration are unchanged.)

-- 2) referral_codes --------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can look up referral codes by code" ON public.referral_codes;
DROP POLICY IF EXISTS "Users can view own referral codes" ON public.referral_codes;
CREATE POLICY "Users can view own referral codes" ON public.referral_codes
  FOR SELECT USING (auth.uid() = user_id);

-- 3) Safe public referral RPC ---------------------------------------------
-- SECURITY DEFINER: lets an anonymous /refer visitor resolve an inviter's
-- public display WITHOUT any SELECT grant on profiles/referral_codes.
CREATE OR REPLACE FUNCTION public.get_referral_inviter(p_code text)
RETURNS TABLE (valid boolean, display_name text, avatar_url text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid;
  v_code_id uuid;
  v_full text;
  v_avatar text;
BEGIN
  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RETURN QUERY SELECT false, NULL::text, NULL::text;
    RETURN;
  END IF;

  SELECT rc.id, rc.user_id INTO v_code_id, v_user
  FROM public.referral_codes rc
  WHERE rc.code = p_code;

  IF v_user IS NULL THEN
    RETURN QUERY SELECT false, NULL::text, NULL::text;
    RETURN;
  END IF;

  SELECT p.full_name, p.avatar_url INTO v_full, v_avatar
  FROM public.profiles p
  WHERE p.user_id = v_user;

  -- Best-effort click tracking; never let it block the response.
  BEGIN
    INSERT INTO public.referral_tracking (referral_code_id, status)
    VALUES (v_code_id, 'clicked');
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN QUERY SELECT
    true,
    NULLIF(split_part(coalesce(v_full, ''), ' ', 1), ''), -- first name only
    v_avatar;
END $$;

GRANT EXECUTE ON FUNCTION public.get_referral_inviter(text) TO anon, authenticated;

-- 4) Safe co-member display view (authenticated community/feedback) --------
-- Column-limited: first name + avatar only. Intentionally a NON-invoker view so
-- authenticated members can see each other's display name without the base
-- table being world-readable. anon is NOT granted access.
DROP VIEW IF EXISTS public.safe_member_profiles;
CREATE VIEW public.safe_member_profiles AS
  SELECT
    user_id,
    NULLIF(split_part(coalesce(full_name, ''), ' ', 1), '') AS display_name,
    avatar_url
  FROM public.profiles;

REVOKE ALL ON public.safe_member_profiles FROM anon;
GRANT SELECT ON public.safe_member_profiles TO authenticated;

-- =============================================================================
-- VERIFICATION (run after applying — "ran" ≠ "correct")
-- =============================================================================
-- 1) profiles SELECT policies are owner + admin only (no USING(true)):
-- SELECT policyname, cmd, qual FROM pg_policies
-- WHERE schemaname='public' AND tablename='profiles' AND cmd='SELECT';
--
-- 2) As a NON-admin authenticated user, reading another user's profile returns
--    0 rows; reading your own returns 1.
--
-- 3) Referral RPC returns only safe fields and works for anon:
-- SELECT * FROM public.get_referral_inviter('<some_code>');  -- valid + first name + avatar
-- SELECT * FROM public.get_referral_inviter('___bogus___');  -- valid=false, nulls
--
-- 4) safe_member_profiles exposes no full_name/email/tier columns:
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema='public' AND table_name='safe_member_profiles';
-- Expect exactly: user_id, display_name, avatar_url.
