-- ============================================================================
-- Marketing Attribution Layer — Phase 1 (first-party, no vendor, no cookies).
-- Apply by hand in Supabase (Claude Code does not auto-apply).
--
-- Adds a dedicated signup_attribution table (one row per user), extends the
-- existing handle_new_user() signup trigger to record first-party attribution
-- from auth metadata (best-effort — it can NEVER block account creation), and
-- exposes an admin-only aggregate RPC (counts only, no PII).
-- ============================================================================

-- 1) Dedicated attribution table (kept OUT of profiles so it can grow to
--    multi-touch later without bloating profiles).
CREATE TABLE IF NOT EXISTS public.signup_attribution (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text,
  gclid         text,
  fbclid        text,
  referral_code text,
  landing_page  text,
  first_seen_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.signup_attribution ENABLE ROW LEVEL SECURITY;
-- Owner can read own row; admins can read all. Writes happen ONLY through the
-- SECURITY DEFINER signup trigger (no user INSERT/UPDATE policy on purpose).
DROP POLICY IF EXISTS "Users read own attribution"  ON public.signup_attribution;
DROP POLICY IF EXISTS "Admins read attribution"     ON public.signup_attribution;
CREATE POLICY "Users read own attribution" ON public.signup_attribution
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read attribution" ON public.signup_attribution
  FOR SELECT USING (public.aos_is_admin());

-- 2) Extend the signup trigger. Keeps the existing profiles insert EXACTLY, then
--    records attribution in an exception-safe sub-block so a bad value can never
--    break signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  BEGIN
    INSERT INTO public.signup_attribution (
      user_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      gclid, fbclid, referral_code, landing_page, first_seen_at
    ) VALUES (
      NEW.id,
      NULLIF(NEW.raw_user_meta_data->>'utm_source',   ''),
      NULLIF(NEW.raw_user_meta_data->>'utm_medium',   ''),
      NULLIF(NEW.raw_user_meta_data->>'utm_campaign', ''),
      NULLIF(NEW.raw_user_meta_data->>'utm_content',  ''),
      NULLIF(NEW.raw_user_meta_data->>'utm_term',     ''),
      NULLIF(NEW.raw_user_meta_data->>'gclid',        ''),
      NULLIF(NEW.raw_user_meta_data->>'fbclid',       ''),
      NULLIF(NEW.raw_user_meta_data->>'referral_code',''),
      NULLIF(NEW.raw_user_meta_data->>'landing_page', ''),
      NULLIF(NEW.raw_user_meta_data->>'first_seen_at','')::timestamptz
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- attribution is best-effort; never block account creation
  END;

  RETURN NEW;
END;
$$;

-- 3) Admin-only aggregate RPC (counts only — no user_id, emails, codes, or rows).
CREATE OR REPLACE FUNCTION public.founder_attribution_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.aos_is_admin() THEN
    RAISE EXCEPTION 'founder_attribution_stats: admin only';
  END IF;

  SELECT jsonb_build_object(
    'total_attributed', (SELECT count(*) FROM public.signup_attribution),
    'referrals',        (SELECT count(*) FROM public.signup_attribution WHERE referral_code IS NOT NULL),
    'unknown',          (SELECT count(*) FROM public.signup_attribution
                          WHERE utm_source IS NULL AND referral_code IS NULL
                            AND gclid IS NULL AND fbclid IS NULL),
    'by_source', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('source', src, 'n', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (
        SELECT COALESCE(utm_source, CASE WHEN referral_code IS NOT NULL THEN 'referral'
               WHEN gclid IS NOT NULL THEN 'google_ads' WHEN fbclid IS NOT NULL THEN 'meta_ads'
               ELSE 'direct/unknown' END) AS src, count(*) AS n
        FROM public.signup_attribution GROUP BY 1) s),
    'by_medium', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('medium', COALESCE(utm_medium,'(none)'), 'n', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT utm_medium, count(*) AS n FROM public.signup_attribution GROUP BY utm_medium) s),
    'by_campaign', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('campaign', utm_campaign, 'n', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT utm_campaign, count(*) AS n FROM public.signup_attribution WHERE utm_campaign IS NOT NULL GROUP BY utm_campaign LIMIT 20) s)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.founder_attribution_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_attribution_stats() TO authenticated;

-- VERIFICATION:
--   SELECT public.founder_attribution_stats();  -- admin: jsonb counts; non-admin: raises
--   SELECT count(*) FROM public.signup_attribution;  -- grows by 1 per new signup with attribution
-- ROLLBACK (note: also restore the prior handle_new_user body if fully reverting):
--   DROP FUNCTION public.founder_attribution_stats();
--   DROP TABLE public.signup_attribution;
