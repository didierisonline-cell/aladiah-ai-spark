-- =============================================================================
-- Founder Identity Alignment — single source of truth (apply by hand)
-- =============================================================================
-- Canonical founder list (aligned across all layers):
--   1. didier@aladiahacademy.com   — primary / intended account
--   2. didierisonline@gmail.com    — active Supabase Auth account (email transition)
--   3. didiermbok@yahoo.com        — legacy; remove after cutover confirmed stable
--
-- This migration ensures the DB layer matches src/lib/roles.ts FOUNDER_EMAILS
-- and supabase/functions/_shared/adminGuard.ts FOUNDER_EMAILS exactly.
--
-- Previous migrations 20260610270000 + 20260612070000 already set these three
-- emails. This migration is idempotent (CREATE OR REPLACE + ON CONFLICT DO
-- NOTHING) and safe to re-apply.
-- =============================================================================

-- 1. RBAC helper — authoritative version.
--    Any of the three founder emails OR a user_roles admin row = admin.
CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE has_role boolean := false;
BEGIN
  IF lower(coalesce(auth.jwt() ->> 'email', '')) IN (
    'didier@aladiahacademy.com',
    'didierisonline@gmail.com',
    'didiermbok@yahoo.com'
  ) THEN
    RETURN true;
  END IF;
  IF to_regclass('public.user_roles') IS NOT NULL THEN
    EXECUTE 'SELECT EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = ''admin''
    )' INTO has_role;
  END IF;
  RETURN has_role;
END;
$$;

-- 2. Signup trigger — any founder email auto-receives admin role on signup.
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) IN (
    'didier@aladiahacademy.com',
    'didierisonline@gmail.com',
    'didiermbok@yahoo.com'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS assign_admin_on_signup ON auth.users;
CREATE TRIGGER assign_admin_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin();

-- 3. Backfill: grant admin to all founder accounts that already exist in auth.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN (
  'didier@aladiahacademy.com',
  'didierisonline@gmail.com',
  'didiermbok@yahoo.com'
)
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Revoke admin from any account that is NOT a founder.
--    (Cleans up any accidental grants from earlier migrations.)
DELETE FROM public.user_roles
WHERE role = 'admin'
  AND user_id NOT IN (
    SELECT id FROM auth.users
    WHERE lower(email) IN (
      'didier@aladiahacademy.com',
      'didierisonline@gmail.com',
      'didiermbok@yahoo.com'
    )
  );

-- =============================================================================
-- VERIFICATION — run AFTER applying:
--
-- (a) Exactly the founder accounts have the admin role:
--    SELECT u.email, ur.role
--    FROM public.user_roles ur
--    JOIN auth.users u ON u.id = ur.user_id
--    WHERE ur.role = 'admin'
--    ORDER BY u.email;
--    → expect: only the founder emails that exist in auth.users
--
-- (b) No non-founder has admin:
--    SELECT u.email FROM public.user_roles ur
--    JOIN auth.users u ON u.id = ur.user_id
--    WHERE ur.role = 'admin'
--      AND lower(u.email) NOT IN (
--        'didier@aladiahacademy.com',
--        'didierisonline@gmail.com',
--        'didiermbok@yahoo.com'
--      );
--    → expect: 0 rows
--
-- (c) Helper works for active session (sign in as a founder, then run):
--    SELECT public.aos_is_admin();
--    → expect: true
-- =============================================================================
