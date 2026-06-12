-- =============================================================================
-- Founder identity — ZERO-DOWNTIME dual-email cutover.
-- Both addresses are treated as founder during the transition:
--   - didier@aladiahacademy.com  (primary, new)
--   - didiermbok@yahoo.com       (legacy, temporary)
-- A later cleanup migration removes the legacy address once the cutover is
-- confirmed stable. Apply BY HAND in the Supabase SQL editor.
-- =============================================================================

-- 1) RBAC helper — either founder email (+ optional user_roles) is admin.
CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE has_role boolean := false;
BEGIN
  IF lower(coalesce(auth.jwt() ->> 'email', '')) IN ('didier@aladiahacademy.com','didiermbok@yahoo.com') THEN
    RETURN true;
  END IF;
  IF to_regclass('public.user_roles') IS NOT NULL THEN
    EXECUTE 'SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = ''admin'')'
      INTO has_role;
  END IF;
  RETURN has_role;
END;
$$;

-- 2) Signup trigger — either founder email auto-receives the admin role.
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) IN ('didier@aladiahacademy.com','didiermbok@yahoo.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS assign_admin_on_signup ON auth.users;
CREATE TRIGGER assign_admin_on_signup
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin();

-- 3) Grant admin to BOTH founder accounts if they exist.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN ('didier@aladiahacademy.com','didiermbok@yahoo.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- 4) Revoke admin/moderator from every NON-founder account (keeps both founders).
DELETE FROM public.user_roles ur
WHERE ur.role IN ('admin','moderator')
  AND ur.user_id NOT IN (
    SELECT u.id FROM auth.users u WHERE lower(u.email) IN ('didier@aladiahacademy.com','didiermbok@yahoo.com')
  );

-- VERIFICATION:
-- SELECT u.email, ur.role FROM public.user_roles ur JOIN auth.users u ON u.id=ur.user_id WHERE ur.role='admin';
--   → expect exactly the two founder emails (or one, if the new account hasn't signed in yet).
