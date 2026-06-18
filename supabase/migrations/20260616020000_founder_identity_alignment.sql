-- =============================================================================
-- Founder identity alignment — canonical founder set + temporary legacy access.
-- =============================================================================
-- Establishes the canonical, permanent founder identity server-side and demotes
-- the legacy address to TEMPORARY, revocable access.
--
--   CANONICAL (permanent, hardcoded):
--     - didier@aladiahacademy.com   (intended primary)
--     - didierisonline@gmail.com    (active Supabase Auth account)
--   TEMPORARY (NOT hardcoded; access only via a revocable user_roles row):
--     - didiermbok@yahoo.com        (legacy — remove at cutover, see step 4)
--
-- Supersedes the prior aos_is_admin()/auto_assign_admin() definitions
-- (20260612070000), which hardcoded all three. This migration is NON-DESTRUCTIVE
-- to existing access: it does NOT delete didiermbok's user_roles row, so that
-- account keeps working until the founder explicitly revokes it (step 4).
-- Apply BY HAND in the Supabase SQL editor. Idempotent.
-- =============================================================================

-- 1) RBAC helper — canonical founder emails OR a user_roles(role='admin') row.
--    (didiermbok is intentionally absent here — it relies on its user_roles row.)
CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE has_role boolean := false;
BEGIN
  IF lower(coalesce(auth.jwt() ->> 'email', '')) IN
     ('didier@aladiahacademy.com','didierisonline@gmail.com') THEN
    RETURN true;
  END IF;
  IF to_regclass('public.user_roles') IS NOT NULL THEN
    EXECUTE 'SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = ''admin'')'
      INTO has_role;
  END IF;
  RETURN has_role;
END;
$$;

-- 2) Signup trigger — only the canonical founders auto-receive the admin role.
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) IN
     ('didier@aladiahacademy.com','didierisonline@gmail.com') THEN
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

-- 3) Backfill admin rows for the canonical founder accounts that exist
--    (idempotent; user_roles becomes the durable source of truth even if the
--    hardcoded fallback is ever tightened further).
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN ('didier@aladiahacademy.com','didierisonline@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- 4) TEMPORARY legacy access — didiermbok@yahoo.com.
--    Its existing user_roles admin row (granted by 20260612070000) is LEFT IN
--    PLACE so the account keeps working during the transition. It is no longer
--    hardcoded, so revoking it is a one-liner. RUN THIS AT CUTOVER to fully
--    remove its server-side founder powers:
--
--    DELETE FROM public.user_roles ur
--    USING auth.users u
--    WHERE ur.user_id = u.id AND ur.role = 'admin'
--      AND lower(u.email) = 'didiermbok@yahoo.com';

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- Canonical founders are admin via the helper (run while signed in as each):
--   SELECT public.aos_is_admin();   -- expect true
--
-- Admin rows present for the canonical founders:
--   SELECT u.email, ur.role FROM public.user_roles ur
--   JOIN auth.users u ON u.id = ur.user_id
--   WHERE ur.role='admin' ORDER BY u.email;
--
-- didiermbok currently still admin (via row only, not hardcode) until step 4 is
-- run: confirm by checking the row above; after step 4 it should be gone.
