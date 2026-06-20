-- ============================================================================
-- Founder marketing analytics — admin-only AGGREGATE RPC (counts only, no PII).
-- Apply by hand in Supabase (Claude Code does not auto-apply).
--
-- WHY: blog_engagement / student_analytics are owner/admin-scoped, so the founder
-- client can't read them in aggregate cleanly. This SECURITY DEFINER function
-- returns ONLY aggregate COUNTS — never user_id, emails, or per-user activity.
-- Guarded to admins via public.aos_is_admin().
--
-- SCOPE: DB-backed CONTENT + ENGAGEMENT only. Web traffic / sessions / page views
-- / acquisition source / UTM / campaigns / SEO / social reach / ad spend / CAC /
-- ROAS / channel attribution / traffic→signup are NOT returned — none are captured
-- in the DB (no web-analytics integration). The dashboard shows those NOT MEASURED.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.founder_marketing_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.aos_is_admin() THEN
    RAISE EXCEPTION 'founder_marketing_stats: admin only';
  END IF;

  SELECT jsonb_build_object(
    'blogs_total',          (SELECT count(*) FROM public.weekly_blogs),
    'blogs_published',      (SELECT count(*) FROM public.weekly_blogs WHERE published IS TRUE),
    'community_posts',      (SELECT count(*) FROM public.community_posts),
    'blog_engagement_total',(SELECT count(*) FROM public.blog_engagement),
    'blog_engagement_by_type', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('type', engagement_type, 'n', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT engagement_type, count(*) AS n FROM public.blog_engagement GROUP BY engagement_type) s),
    'inapp_events_total',   (SELECT count(*) FROM public.student_analytics),
    'inapp_events_by_type', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('type', event_type, 'n', n) ORDER BY n DESC), '[]'::jsonb)
      FROM (SELECT event_type, count(*) AS n FROM public.student_analytics GROUP BY event_type ORDER BY count(*) DESC LIMIT 12) s)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.founder_marketing_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_marketing_stats() TO authenticated;

-- VERIFICATION (run as the founder, signed in):
--   SELECT public.founder_marketing_stats();   -- expect a jsonb object of counts
--   -- as a non-admin it must RAISE 'admin only'.
-- ROLLBACK:  DROP FUNCTION public.founder_marketing_stats();
