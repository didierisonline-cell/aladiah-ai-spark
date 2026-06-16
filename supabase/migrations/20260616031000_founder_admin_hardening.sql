-- =============================================================================
-- SEC-C2 — Close the founder-email takeover path.
--
-- ROOT CAUSE: admin was conferred two automatic ways:
--   (a) aos_is_admin() returned TRUE for any JWT whose email was in a hardcoded
--       founder allowlist, and
--   (b) a signup trigger (auto_assign_admin) granted user_roles.admin to any
--       account created with a founder email.
-- Either path means: register/confirm an UNCLAIMED founder address -> instant
-- admin. This migration removes BOTH automatic paths so admin is conferred ONLY
-- by an explicit user_roles grant that the founder applies by hand.
--
-- ⚠️ APPLY BY HAND in the Supabase SQL editor. Claude Code does not auto-apply.
-- ⚠️ LOCKOUT SAFETY: the grant (step 1) runs BEFORE the helper is tightened
--    (step 2), and is guarded on email_confirmed_at, so a confirmed, owned
--    founder account keeps admin throughout. EDIT the email list in step 1/4 to
--    the address(es) you actually own and have confirmed, then run top-to-bottom.
-- =============================================================================

BEGIN;

-- ── STEP 1 — Explicitly grant admin to YOUR real, confirmed, owned account(s) ──
-- Keep ONLY addresses you control and that are email-confirmed. Unconfirmed /
-- unclaimed addresses are skipped by the email_confirmed_at guard (so they can
-- never gain admin even if listed).
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN (
        'didierisonline@gmail.com'  -- ← the active founder login (edit as needed)
        -- ,'didier@aladiahacademy.com'  -- uncomment ONLY if registered + confirmed + owned
      )
  AND u.email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- ── STEP 2 — RBAC helper: admin = an explicit user_roles grant ONLY ───────────
-- Removes the JWT-email allowlist bypass entirely.
CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- ── STEP 3 — Remove the signup auto-grant (no automatic escalation) ───────────
DROP TRIGGER IF EXISTS assign_admin_on_signup ON auth.users;
DROP FUNCTION IF EXISTS public.auto_assign_admin();

-- ── STEP 4 — Revoke admin/moderator from everyone who is NOT a verified founder ─
DELETE FROM public.user_roles ur
WHERE ur.role IN ('admin','moderator')
  AND ur.user_id NOT IN (
    SELECT u.id FROM auth.users u
    WHERE lower(u.email) IN (
            'didierisonline@gmail.com'  -- ← keep identical to STEP 1
            -- ,'didier@aladiahacademy.com'
          )
      AND u.email_confirmed_at IS NOT NULL
  );

COMMIT;

-- =============================================================================
-- VERIFICATION — run AFTER commit; confirm each result.
-- (a) Exactly your founder account(s) hold admin:
--   SELECT u.email, ur.role FROM public.user_roles ur
--   JOIN auth.users u ON u.id = ur.user_id WHERE ur.role='admin';
-- (b) No JWT-email bypass remains (run while signed in as the founder):
--   SELECT public.aos_is_admin();            -- expect TRUE for the founder
-- (c) The signup trigger is gone:
--   SELECT tgname FROM pg_trigger WHERE tgname = 'assign_admin_on_signup'; -- 0 rows
-- =============================================================================
