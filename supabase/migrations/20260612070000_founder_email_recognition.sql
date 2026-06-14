-- =============================================================================
-- Founder email recognition — additive, NON-DESTRUCTIVE.
-- Restores founder/admin DB access to the account currently in Supabase Auth
-- (didierisonline@gmail.com) WITHOUT removing the intended primary
-- (didier@aladiahacademy.com) or the legacy address. All three are treated as
-- founder during the email transition. This migration only GRANTS and redefines
-- functions (CREATE OR REPLACE) — it performs NO revokes/deletes, so it cannot
-- break existing access. Apply BY HAND in the Supabase SQL editor.
-- =============================================================================

-- 1) RBAC helper — any of the three founder emails (+ optional user_roles) is admin.
CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE has_role boolean := false;
BEGIN
  IF lower(coalesce(auth.jwt() ->> 'email', '')) IN
     ('didier@aladiahacademy.com','didierisonline@gmail.com','didiermbok@yahoo.com') THEN
    RETURN true;
  END IF;
  IF to_regclass('public.user_roles') IS NOT NULL THEN
    EXECUTE 'SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = ''admin'')'
      INTO has_role;
  END IF;
  RETURN has_role;
END;
$$;

-- 2) Signup trigger — any founder email auto-receives the admin role.
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) IN
     ('didier@aladiahacademy.com','didierisonline@gmail.com','didiermbok@yahoo.com') THEN
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

-- 3) Grant admin to all three founder accounts that exist (idempotent; no deletes).
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN
      ('didier@aladiahacademy.com','didierisonline@gmail.com','didiermbok@yahoo.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- NOTE: no revoke step here on purpose — this migration must not remove access.

-- VERIFICATION:
-- SELECT u.email, ur.role FROM public.user_roles ur JOIN auth.users u ON u.id=ur.user_id
--   WHERE ur.role='admin' ORDER BY u.email;
--   → expect didierisonline@gmail.com (and didier@aladiahacademy.com if it exists).
-- Confirm the helper sees the active session as admin (run while signed in):
-- SELECT public.aos_is_admin();   → expect true for the founder.
