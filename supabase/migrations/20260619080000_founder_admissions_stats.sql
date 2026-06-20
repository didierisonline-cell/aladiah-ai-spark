-- ============================================================================
-- Founder admissions analytics — admin-only AGGREGATE RPC (counts only, no PII).
-- Apply by hand in Supabase (Claude Code does not auto-apply).
--
-- WHY: course_waitlist / referral_* hold emails + user ids and are not founder-
-- readable in aggregate. This SECURITY DEFINER function returns ONLY aggregate
-- COUNTS — never emails, user_id values, referral codes, or per-user rows.
-- Guarded to admins via public.aos_is_admin().
--
-- SCOPE: counts-first. Applications / leads / admissions interviews / decisions /
-- full lead→enrolled funnel / recruiter outreach / employer pipeline are NOT
-- returned because those tables don't exist yet (future Admissions Data Model).
-- The dashboard shows those as NOT MEASURED.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.founder_admissions_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.aos_is_admin() THEN
    RAISE EXCEPTION 'founder_admissions_stats: admin only';
  END IF;

  SELECT jsonb_build_object(
    'total_signups',     (SELECT count(*) FROM public.profiles),
    'completed_intro',   (SELECT count(*) FROM public.profiles WHERE has_completed_intro IS TRUE),
    'program_selected',  (SELECT count(*) FROM public.profiles WHERE free_course_id IS NOT NULL),
    'waitlist',          (SELECT count(*) FROM public.course_waitlist),
    'referral_codes',    (SELECT count(*) FROM public.referral_codes),
    'referrals_total',   (SELECT count(*) FROM public.referral_tracking),
    'referrals_by_status', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('status', status, 'n', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT status, count(*) AS n FROM public.referral_tracking GROUP BY status) s)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.founder_admissions_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_admissions_stats() TO authenticated;

-- VERIFICATION (run as the founder, signed in):
--   SELECT public.founder_admissions_stats();   -- expect a jsonb object of counts
--   -- as a non-admin it must RAISE 'admin only'.
-- ROLLBACK:  DROP FUNCTION public.founder_admissions_stats();
