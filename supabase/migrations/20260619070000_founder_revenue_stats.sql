-- ============================================================================
-- Founder revenue analytics — admin-only AGGREGATE RPC (counts only, no PII).
-- Apply by hand in Supabase (Claude Code does not auto-apply).
--
-- WHY: public.subscriptions is owner-only RLS ("Users can read own subscription"),
-- so the founder client cannot read aggregates. This SECURITY DEFINER function
-- returns ONLY aggregate COUNTS (by status / by active tier) — never user_id,
-- stripe_customer_id, stripe_subscription_id, emails, or per-user rows. Guarded
-- to admins via public.aos_is_admin().
--
-- SCOPE: counts only. Dollar revenue / MRR is NOT returned because amount/currency
-- are not stored in the schema today — that needs a separate Revenue Data Model
-- PR (amount column + append-only payment event log + webhook writes). The
-- Revenue Truth dashboard shows those as NOT MEASURED.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.founder_revenue_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.aos_is_admin() THEN
    RAISE EXCEPTION 'founder_revenue_stats: admin only';
  END IF;

  SELECT jsonb_build_object(
    'total_subscriptions', (SELECT count(*) FROM public.subscriptions),
    'active',              (SELECT count(*) FROM public.subscriptions WHERE status = 'active'),
    'by_status', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('status', status, 'n', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT status, count(*) AS n FROM public.subscriptions GROUP BY status) s),
    'by_tier_active', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('tier', tier, 'n', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT tier, count(*) AS n FROM public.subscriptions WHERE status = 'active' GROUP BY tier) s)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.founder_revenue_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_revenue_stats() TO authenticated;

-- VERIFICATION (run as the founder, signed in):
--   SELECT public.founder_revenue_stats();   -- expect a jsonb object of counts
--   -- as a non-admin it must RAISE 'admin only'.
-- ROLLBACK:  DROP FUNCTION public.founder_revenue_stats();
