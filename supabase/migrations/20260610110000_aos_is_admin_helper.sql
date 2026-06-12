-- =============================================================================
-- aos_is_admin() helper — prerequisite for every admin-scoped RLS policy
-- (content architecture, AOS, etc.). Dependency-free so it can be applied to a
-- project that has NOT run the original AOS migrations.
--   - Founder recognized by JWT email claim (no table dependency).
--   - A public.user_roles(role='admin') table is honored ONLY if it exists
--     (guarded with to_regclass + dynamic EXECUTE → never errors).
-- Apply BY HAND in the Supabase SQL editor, BEFORE 20260611000000.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_role boolean := false;
BEGIN
  IF lower(coalesce(auth.jwt() ->> 'email', '')) = 'didier@aladiahacademy.com' THEN
    RETURN true;
  END IF;

  IF to_regclass('public.user_roles') IS NOT NULL THEN
    EXECUTE 'SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = ''admin'')'
      INTO has_role;
  END IF;

  RETURN has_role;
END;
$$;

-- VERIFICATION (run while authenticated): SELECT public.aos_is_admin();
