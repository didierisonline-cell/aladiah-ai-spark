-- =============================================================================
-- Founder Role Alignment — single founder: didiermbok@yahoo.com
-- -----------------------------------------------------------------------------
-- Aligns the DB privilege model with the app role architecture (founder vs
-- student). DB privilege = public.user_roles.role = 'admin', enforced by
-- public.aos_is_admin() / public.is_admin() across every AOS + admin-scoped RLS
-- policy. After this migration the ONLY account with admin (founder) privileges
-- is didiermbok@yahoo.com; every other account is a student.
--
-- ⚠️  Apply BY HAND in the Supabase SQL editor. Claude Code does not auto-apply
--     SQL. "Success / no rows" means the statement RAN, not that it was correct —
--     run the VERIFICATION SELECTs at the bottom afterwards and confirm the
--     expected results.
-- =============================================================================

BEGIN;

-- 1) Future signups: only the founder email auto-receives the admin role.
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'didiermbok@yahoo.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Ensure the signup trigger is present and bound to the function (idempotent).
DROP TRIGGER IF EXISTS assign_admin_on_signup ON auth.users;
CREATE TRIGGER assign_admin_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_admin();

-- 2) Guarantee the founder HAS admin (covers an already-existing account).
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = 'didiermbok@yahoo.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 3) Revoke every privileged role (admin, moderator) from ALL other accounts.
--    Non-privileged 'user' rows are left untouched.
DELETE FROM public.user_roles ur
WHERE ur.role IN ('admin', 'moderator')
  AND ur.user_id NOT IN (
    SELECT u.id FROM auth.users u WHERE lower(u.email) = 'didiermbok@yahoo.com'
  );

COMMIT;

-- =============================================================================
-- VERIFICATION — run AFTER committing. Confirm each expected result.
-- =============================================================================

-- (a) Exactly ONE admin and it is the founder.  EXPECT: 1 row → didiermbok@yahoo.com
SELECT u.email, ur.role
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- (b) No privileged role remains for anyone else.  EXPECT: 0 rows
SELECT u.email, ur.role
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role IN ('admin', 'moderator')
  AND lower(u.email) <> 'didiermbok@yahoo.com';

-- (c) The founder resolves as admin via the RLS helper.  EXPECT: founder_is_admin = true
SELECT u.email, public.is_admin(u.id) AS founder_is_admin
FROM auth.users u
WHERE lower(u.email) = 'didiermbok@yahoo.com';

-- (d) Sanity: full privileged-role census (should list only the founder).
SELECT u.email, ur.role
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role IN ('admin', 'moderator')
ORDER BY u.email;
