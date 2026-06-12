-- =============================================================================
-- Founder identity update → didier@aladiahacademy.com
-- Updates the LIVE DB RBAC to the new founder email. Editing the source of the
-- earlier helper/alignment migrations does NOT change an already-applied DB —
-- this migration re-applies the function + trigger with the new address.
--
-- ⚠️ PREREQUISITE: didier@aladiahacademy.com must be a registered Supabase auth
--    user (sign it up first) — otherwise the founder cannot authenticate as
--    admin after this runs.
-- Apply BY HAND in the Supabase SQL editor. Run the verification SELECTs after.
-- =============================================================================

-- 1) RBAC helper — founder recognized by JWT email (+ optional user_roles).
CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE has_role boolean := false;
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

-- 2) Signup trigger — only the founder email auto-receives the admin role.
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'didier@aladiahacademy.com' THEN
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

-- 3) Grant admin to the new founder account if it already exists.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = 'didier@aladiahacademy.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 4) Revoke admin/moderator from every other account (incl. the old founder).
DELETE FROM public.user_roles ur
WHERE ur.role IN ('admin','moderator')
  AND ur.user_id NOT IN (SELECT u.id FROM auth.users u WHERE lower(u.email) = 'didier@aladiahacademy.com');

-- VERIFICATION:
-- (a) Exactly one admin = founder:
-- SELECT u.email, ur.role FROM public.user_roles ur JOIN auth.users u ON u.id=ur.user_id WHERE ur.role='admin';
-- (b) Founder resolves as admin:
-- SELECT public.is_admin(u.id) FROM auth.users u WHERE lower(u.email)='didier@aladiahacademy.com';
