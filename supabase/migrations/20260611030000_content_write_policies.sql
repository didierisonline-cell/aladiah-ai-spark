-- =============================================================================
-- Founder/admin write policies for curriculum building.
-- The Content Authoring Center + Build Flagship v2 run client-side under the
-- founder session, so the base content tables need an admin write policy.
-- Additive: existing read/student policies are untouched; RLS stays ENABLED;
-- service-role is NOT used (builder runs in the browser).
-- Requires public.aos_is_admin() (see 20260610110000_aos_is_admin_helper.sql).
-- Apply BY HAND in the Supabase SQL editor.
-- =============================================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['courses','chapters','videos','quizzes'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin manage %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "admin manage %1$s" ON public.%1$I FOR ALL USING (public.aos_is_admin()) WITH CHECK (public.aos_is_admin());', t);
  END LOOP;
END $$;

-- VERIFICATION:
-- SELECT tablename, policyname, cmd FROM pg_policies
-- WHERE schemaname='public' AND tablename IN ('courses','chapters','videos','quizzes')
-- ORDER BY tablename, cmd;
