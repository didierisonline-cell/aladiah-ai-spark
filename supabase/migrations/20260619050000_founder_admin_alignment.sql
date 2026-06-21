-- =============================================================================
-- SECURITY HARDENING — founder identity alignment
-- =============================================================================
-- Apply by hand in Supabase. Makes the founder's DB admin grant authoritative
-- and consistent with the client role middleware (src/lib/roles.ts).
--
-- WHY: all server-side security keys off public.user_roles.role = 'admin'
--   (public.aos_is_admin(), the profiles "Admins can view all profiles" policy,
--   the seed-* admin guard, every aos_is_admin-gated table). The auto_assign
--   trigger only fired AFTER signup, so founder accounts that already existed
--   were never granted 'admin' — under the new RLS they would be locked out of
--   their own admin surfaces. This backfills them and re-asserts the trigger
--   for the aligned founder set.
--
-- ALIGNED FOUNDER SET (must match FOUNDER_EMAILS in src/lib/roles.ts):
--   didiermbok@yahoo.com, didier@aladiahacademy.com, didierisonline@gmail.com
--   (didiermbok@yahoo.com is the founder's original identity — retained as
--    admin during launch readiness; tighten later if ever formally retired.)
-- =============================================================================

BEGIN;

-- 1) Authoritative trigger fn for FUTURE founder signups (aligned set) --------
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IN ('didiermbok@yahoo.com', 'didier@aladiahacademy.com', 'didierisonline@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- 2) Backfill EXISTING founder accounts (the trigger never ran for them) ------
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
WHERE lower(u.email) IN ('didiermbok@yahoo.com', 'didier@aladiahacademy.com', 'didierisonline@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- 3) Revoke any stray admin not in the aligned set (least privilege) ----------
-- Removes admin from accounts that are NOT a current founder email (e.g. any
-- manually-granted admin). The three aligned founder emails are preserved.
-- Comment out if you keep additional staff admins.
DELETE FROM public.user_roles ur
WHERE ur.role = 'admin'
  AND ur.user_id NOT IN (
    SELECT u.id FROM auth.users u
    WHERE lower(u.email) IN ('didiermbok@yahoo.com', 'didier@aladiahacademy.com', 'didierisonline@gmail.com')
  );

COMMIT;

-- =============================================================================
-- VERIFICATION
--   -- exactly the founder accounts hold 'admin':
--   SELECT u.email, ur.role
--   FROM public.user_roles ur JOIN auth.users u ON u.id = ur.user_id
--   WHERE ur.role = 'admin' ORDER BY u.email;
--   -- founder can now see all profiles / pass aos_is_admin():
--   --   (sign in as the founder, then) SELECT public.aos_is_admin();  -- expect true
-- =============================================================================
