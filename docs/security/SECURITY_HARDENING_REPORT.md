# Security Hardening Report

**Scope:** launch-blocking security hardening on `claude/adoring-brown-1f452f`.
**Date:** 2026-06-18. **Status:** code committed & building; **3 SQL migrations await
manual application in Supabase** (this repo does not auto-apply SQL).

This report covers four blockers, each shipped as its own focused commit.

| # | Blocker | Commit | DB change to apply |
|---|---|---|---|
| 1 | profiles PII RLS lockdown + safe referral path | `f971947` | `20260619030000_profiles_pii_rls_lockdown.sql` |
| 2 | seed-* edge function admin guard | `bc35f21` | — (code only) |
| 3 | send-email / send-welcome-email abuse protection | `1479c87` | `20260619040000_email_send_log.sql` |
| 4 | founder identity alignment | `2af3693` | `20260619050000_founder_admin_alignment.sql` |

---

## 1. profiles PII RLS lockdown + safe public referral path

**Vulnerability.** Migration `20260215063914` made `public.profiles` world-readable
(`USING (true)`) and exposed `public.referral_codes` (code → user_id) to anyone. Any
anonymous visitor could read every user's PII (full_name, avatar, login timestamps,
language/course/tier preferences) and enumerate the full code→user mapping.

**Fix.**
- `profiles` SELECT → owner-only (`auth.uid() = user_id`) **or** admin (`aos_is_admin()`).
- `referral_codes` → owner-only SELECT (public lookup dropped).
- `get_referral_profile(code)` — SECURITY DEFINER RPC returning only safe display
  fields for anonymous referral pages (name, avatar, joined date, counts, last 3 posts,
  referral_code_id). No PII.
- `public_profiles` view (name + avatar only, `authenticated`-only) so community/feedback
  author names keep working without re-exposing the base table.

**Client.** `ReferralProfile` uses the RPC; `Community`/`Feedback` read names from
`public_profiles`. Own-profile and admin reads verified intact; edge functions use the
service role. Detail: `docs/security/PROFILES_PII_RLS.md`.

---

## 2. seed-* edge function admin guard

**Vulnerability.** All **44** `seed-*` functions ran with the SERVICE_ROLE key (full DB
write, RLS bypassed) with **no caller authentication** — anyone reaching the URL could
overwrite course/curriculum data.

**Fix.** `_shared/adminGuard.ts` → `requireAdmin(req)` validates the caller JWT and
confirms `user_roles.role = 'admin'` (checked via service role). Wired into all 44
functions after the OPTIONS preflight and before any service-role work. Unauthorized →
401 (no/invalid session) / 403 (not admin). Verified: 44/44 import + invoke the guard;
guard precedes service-role use in every file.

---

## 3. send-email / send-welcome-email abuse protection

**Vulnerability.** `send-welcome-email` had `verify_jwt = false` and no caller check — a
true open relay (academy-branded mail to any address via our Resend domain). `send-email`
interpolated the user-supplied name straight into email HTML (injection) and had no
recipient validation or rate limiting.

**Fix.** `_shared/emailGuard.ts` (`isValidEmail`, `escapeHtml`, `requireServiceRole`,
`rateLimit`) + `email_send_log` table (RLS-locked, service-role-only).
- `send-welcome-email`: `requireServiceRole` (server-to-server only — the payment webhook
  already passes the service-role bearer); validates email; escapes name.
- `send-email`: validates recipient; HTML-escapes name + admin-notify payload; per-recipient
  rate limit (6/hour, 20/day, fails open on infra error so signup mail is never blocked).

---

## 4. founder identity alignment

**Vulnerability / risk.** All server-side security keys off `user_roles.role = 'admin'`,
but the auto-assign trigger only fired on signup — existing founder accounts were never
granted admin, so the hardened RLS (blockers 1–2) would lock the founder out. The client
`FOUNDER_EMAILS` also listed a 3rd legacy email the DB never granted admin (UI/DB drift).

**Fix.** Migration backfills `admin` for the existing founder accounts, re-asserts the
trigger for the aligned set (`didier@aladiahacademy.com`, `didierisonline@gmail.com`), and
revokes stray admin (least privilege). Client `FOUNDER_EMAILS` reduced to the same two and
documented as the migration's lockstep partner.

---

## Apply order (Supabase SQL editor)

Apply **before** deploying the updated edge functions, then run each file's verification
`SELECT`s ("success / no rows" means it ran, not that it's correct — verify):

1. `20260619030000_profiles_pii_rls_lockdown.sql`
2. `20260619040000_email_send_log.sql`
3. `20260619050000_founder_admin_alignment.sql`  ← do this so the founder keeps admin

Then deploy edge functions (`seed-*`, `send-email`, `send-welcome-email`).

---

## Verification summary

- Frontend `vite build` clean after every commit.
- All edited edge functions parse cleanly (esbuild); seed guard present in 44/44.
- Post-apply DB checks: per-file `SELECT`s confirm policies, `prosecdef`, RLS flags, and
  the founder admin grant.

---

## Known items NOT in this pass (flagged, need a decision)

- **Lovable AI Gateway dependency.** 7 edge functions (enrollment-chat, scrum-simulation,
  send-study-reminders, ai-grading, lesson-qa, student-assistant, interview-simulator)
  call `https://ai.gateway.lovable.dev` with `LOVABLE_API_KEY`. This is a live third-party
  AI backend, not branding. Migrating to a first-party provider (Anthropic/Claude) is an
  infra change needing a provider + key decision. **Recommend before launch.**
- **send-email anon-key exposure.** `verify_jwt = true` means it requires the (public)
  anon key; rate limiting + validation now bound abuse, but the endpoint is still
  callable by anyone with the public key. Acceptable post-hardening; revisit if abused.
- **Community display via `public_profiles`.** Authenticated users can read other members'
  name + avatar (required for community author display). PII stays locked. Confirm this is
  the intended product behavior.
- **Broader RLS sweep.** This pass targeted the named blockers. A full table-by-table RLS
  audit (every `public.*` table) is recommended as a follow-up.

## Go / No-Go

**Go for launch on these four blockers once the three migrations are applied and verified.**
The AI-gateway migration is a separate launch-readiness decision, not part of this pass.
