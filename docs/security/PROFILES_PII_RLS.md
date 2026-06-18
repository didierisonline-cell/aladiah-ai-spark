# Security — profiles PII RLS lockdown + safe referral path

**Status:** code committed; **SQL must be applied by hand** in Supabase (Claude Code
does not auto-apply). Migration: `supabase/migrations/20260619030000_profiles_pii_rls_lockdown.sql`.

## Vulnerability (launch blocker)

Migration `20260215063914` made `public.profiles` **world-readable**
(`USING (true)`) and dropped the owner-only SELECT, and exposed `public.referral_codes`
(code → user_id) to anyone. Any anonymous visitor could read every user's profile
(full_name, avatar_url, login timestamps, language & course preferences, tier) and
enumerate the entire code→user mapping.

## Fix (this commit)

1. **profiles** — world-readable policy dropped. SELECT now only:
   - **own** profile (`auth.uid() = user_id`), and
   - **admin/founder** (`public.aos_is_admin()` → `user_roles.role = 'admin'`).
2. **referral_codes** — public `USING (true)` lookup dropped; restored owner-only SELECT.
3. **Anonymous referral pages** read through one SECURITY DEFINER RPC,
   `public.get_referral_profile(code)`, returning ONLY safe display fields
   (full_name, avatar_url, joined date, aggregate counts, last 3 public posts,
   referral_code_id for click tracking). No email/phone/language/login-time/course IDs.
4. **Authenticated social features** (community, feedback) read author display names
   via a definer view `public.public_profiles` exposing **only** `user_id, full_name,
   avatar_url`, granted to `authenticated` only. Prevents author names collapsing to
   "Student" without re-exposing PII.

## Client changes

- `src/pages/ReferralProfile.tsx` — one `get_referral_profile` RPC replaces the direct
  `referral_codes` + `profiles` reads; click tracking uses the RPC's `referral_code_id`
  (anon INSERT on `referral_tracking` is already allowed).
- `src/pages/Community.tsx`, `src/pages/Feedback.tsx` — cross-user author-name reads
  repointed from `profiles` to the `public_profiles` view. Own-profile reads unchanged.

## Reads verified safe after lockdown

- Own-profile reads (`.eq('user_id', user.id)`): StudentPortal, useIdentity, CourseSelectionGate,
  IntroForm, StatDetailModals, PortalCourses, Community (intro flag) — allowed by own policy.
- Admin surfaces (AdminDashboard, analyticsAgent, studentSuccessAgent): covered by the
  admin policy (require `role = 'admin'`).
- Edge functions (admin-analytics, get-student-recap, send-study-reminders,
  handle-payment-webhook): run with the service role → bypass RLS.

## Apply & verify

Run the migration SQL in Supabase, then the verification `SELECT`s at the bottom of the
migration file (policy list on `profiles`/`referral_codes`, `prosecdef=true` on the RPC,
and a functional `SELECT * FROM get_referral_profile('<code>')`).

## Note for the founder-identity-alignment task (next)

The admin read-all policy keys off `user_roles.role = 'admin'`. Confirm the founder
account holds that role; otherwise the founder loses cross-profile visibility. Tracked
as the separate "founder identity alignment" item.

## Judgment call to confirm

`public_profiles` lets any **authenticated** user read other members' display name +
avatar (required for community/feedback author display — already shown there today). PII
stays locked. If you want community fully anonymized, say so and I'll gate it differently.
