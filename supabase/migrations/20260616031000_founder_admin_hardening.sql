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
-- NOTE (founder directive): NO trigger/function deletion. Step 3 REPLACES the
-- function body with a no-op instead of dropping the trigger — the trigger stays
-- wired to auth.users but performs no auto-elevation.
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

-- ── STEP 3 — Neutralize the signup auto-grant WITHOUT deleting anything ───────
-- Per founder directive: NO trigger or function deletion. The trigger
-- 'assign_admin_on_signup' stays attached to auth.users; we only REPLACE the
-- function body so it no longer auto-elevates ANY email. Admin is conferred only
-- by explicit user_roles grants (Step 1). This removes the auto-escalation path
-- while leaving the existing trigger wiring intact.
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- SEC-C2: intentionally a NO-OP. No founder-email auto-elevation. Do not add
  -- privilege grants here — admin is managed exclusively via user_roles by hand.
  RETURN NEW;
END;
$$;

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
-- (c) The trigger still exists (not deleted) BUT no longer auto-elevates:
--   SELECT tgname FROM pg_trigger WHERE tgname='assign_admin_on_signup';  -- 1 row (kept)
--   SELECT prosrc FROM pg_proc WHERE proname='auto_assign_admin';
--       -- expect the no-op body: NO 'didierisonline'/'didiermbok'/'INSERT ... user_roles'.
-- (d) Negative test (optional): create a throwaway account with a founder-looking
--     email -> it must NOT appear in the admin census from (a).
-- =============================================================================
