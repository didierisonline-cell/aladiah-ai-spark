# Aladiah — Security Risk Register

> Status: **Active.** Owner: Security Agent (see `SECURITY_PLAYBOOK.md`). Mode: **Security Hardening.**
> Classification: CRITICAL (blocks launch) · HIGH · MEDIUM · LOW.
> **Rule: nothing launches until every CRITICAL is CLOSED.**
> Source: code + config review of this repo (frontend, `api/*`, `supabase/functions/*`,
> `supabase/migrations/*`, `supabase/config.toml`). Live Supabase/Stripe/Vercel dashboards
> were NOT inspected (no access) — items needing console verification are marked **[verify-console]**.

Legend: ☐ open · ◐ mitigated · ☑ closed.

---

## CRITICAL

### SEC-C1 — Stripe webhook accepts UNSIGNED events when the secret is unset
- **Where:** `supabase/functions/handle-payment-webhook/index.ts` (signature branch); `config.toml` sets `verify_jwt = false` for this function (correct — Stripe is the caller).
- **Risk:** If `STRIPE_WEBHOOK_SECRET` is missing/empty in the function env, the handler falls back to `JSON.parse(body)` and trusts it. An attacker can POST a forged `checkout.session.completed` to unlock paid tiers without paying, or `customer.subscription.deleted` to cancel paying users. No `event.id` dedup or `event.created` staleness check → replay.
- **Impact:** Revenue theft, entitlement forgery, customer disruption. **Tier-1 (payments).**
- **Status:** 🟡 **PENDING LIVE PAYMENT VERIFICATION.** Code deployed + applied in prod: idempotency table created (`processed_stripe_events`, verified count=0), `STRIPE_WEBHOOK_SECRET` + `STRIPE_SECRET_KEY` set, hardened webhook handles fail-closed + signature + dedup. **Not yet certified** because no successful live payment has ever occurred end-to-end. **To CLOSE:** one live ~$1 payment (private Stripe Payment Link) → confirm `checkout.session.completed` = HTTP 200, `processed_stripe_events` count → 1, resend does not increment, subscription unlocks. Founder live test scheduled (~2 days).
- **Remediation:** ✅ done in code: fail-closed + signature + `event.id` idempotency. (No `event.created` cutoff — that would drop legitimate Stripe retries; the signature timestamp tolerance is the correct replay control.) *(Founder deploys + verifies.)*

### SEC-C2 — Founder auto-admin trigger grants admin to ANY founder email on signup
- **Where:** `auto_assign_admin()` trigger (migrations `…founder_email_*`, `…founder_role_alignment`); allowlist `didier@aladiahacademy.com`, `didierisonline@gmail.com`, `didiermbok@yahoo.com`.
- **Risk:** The trigger fires `AFTER INSERT ON auth.users` and grants `user_roles.admin` for any of those emails. If **email confirmation is OFF**, or if any founder address is **not yet registered/owned**, an attacker who signs up with that address gains admin (RLS-level) via `aos_is_admin()`.
- **Impact:** Full admin/founder takeover, data exposure, content tampering. **Tier-1 (founder/admin).**
- **Status:** ✅ **CLOSED** (verified in production 2026-06-16). `aos_is_admin()` keys only on explicit `user_roles.admin`; JWT-email bypass removed; `auto_assign_admin()` neutralized to a no-op (trigger retained per founder directive, no deletion); admin census = single confirmed founder account (`didierisonline@gmail.com`); legacy `didiermbok@yahoo.com` admin revoked. Founder `/founder` access preserved.
- **Remediation:** ✅ done in code: explicit-grant-only authorization + no auto-escalation. *(Founder applies the reviewable migration + verifies.)* Residual: edge fns `generate-question-bank`/`translate-content` still check founder email directly (needs a confirmed owned session) — tighten to require `user_roles` in a follow-up (HIGH, not blocker).

---

## HIGH

### SEC-H1 — Seed/admin Edge Functions do destructive writes with no in-function authorization
- **Where:** ~45 `supabase/functions/seed-*` (delete-then-insert course data with `SUPABASE_SERVICE_ROLE_KEY`); no founder JWT check inside. Default `verify_jwt = true` requires a JWT, **but the public anon key is a valid JWT**, so any visitor can invoke.
- **Risk:** Course-data deletion/churn, duplicate content, cost/DoS (some invoke LLMs).
- **Status:** ☐ open.
- **Remediation:** Add a shared `_shared/auth.ts` founder gate (verify caller JWT email ∈ founder list) to every seed/admin function; restrict CORS to known origins. *(Founder-approval — edge/security.)*

### SEC-H2 — `api/auth-signup.js` is dead code with dangerous defaults
- **Where:** Vercel function `api/auth-signup.js`; `config.toml` not applicable (Vercel), CORS `*`, zero input validation, no rate-limit; forwards raw body to Supabase signup with the anon key. **Not referenced by the frontend** (signup uses `supabase.auth.signUp`).
- **Risk:** If reached, unauthenticated/abusable account creation (CSRF-style, bombing).
- **Status:** ☐ open.
- **Remediation:** **Delete it** (unused). If kept, add origin allowlist + schema validation + rate limiting. *(Founder-approval — auth.)*

### SEC-H3 — Privileged RPC/Edge authorization must be re-verified server-side
- **Where:** Client role (`lib/roles.ts`) is **UX-only and spoofable**; the real boundary is RLS via `aos_is_admin()`. Most privileged functions look correct (`review_quiz_questions` RPC, `generate-question-bank`, `translate-content`, `admin-analytics`), but this must be audited exhaustively.
- **Risk:** Any privileged edge/RPC that trusts the client role instead of re-checking `aos_is_admin()`/JWT = escalation.
- **Status:** ◐ partially verified.
- **Remediation:** Inventory every function/RPC that writes privileged data; confirm each re-checks server-side. *(Audit; fixes founder-approval.)*

### SEC-H4 — No route-level subscription/entitlement enforcement
- **Where:** `ProtectedRoute` declares `requireSubscription` but never enforces it; tier read is fragmented (`subscriptions` vs `profiles.tier` vs `user_metadata`).
- **Risk:** Authenticated free users may reach paid surfaces; inconsistent entitlement.
- **Status:** ☐ open.
- **Remediation:** Single entitlement source (`subscriptions`) + RLS on premium content; wire or remove the prop. *(Founder-approval — payments/authz.)*

### SEC-H5 — No rate limiting on custom endpoints
- **Where:** `api/*` (Vercel) and edge functions (LLM, seed) beyond Supabase Auth's built-in limits.
- **Risk:** Credential/signup bombing, LLM cost abuse, seed-function spam.
- **Status:** ☐ open.
- **Remediation:** Add rate limiting (edge middleware / gateway) on auth, LLM, and privileged functions. *(Founder-approval.)*

---

## MEDIUM

- **SEC-M1 — Dual checkout path** (`api/create-checkout.js` proxy + `functions/create-checkout`); anon key stored in Vercel env unnecessarily. → Consolidate to one path; drop the redundant env var. ☐
- **SEC-M2 — Wildcard CORS (`*`) on all edge functions.** Fine for public endpoints; **restrict seed/admin** to `https://aladiahacademy.com` (+ preview). ☐
- **SEC-M3 — `dangerouslySetInnerHTML`** in `ChapterView.tsx`, `Enroll.tsx`. → Confirm content is trusted/static; sanitize if any user-influenced input reaches it (XSS). ☐ **[verify]**
- **SEC-M4 — Webhook side-effect idempotency** (welcome email can fire twice). Covered by SEC-C1 dedup. ☐
- **SEC-M5 — Audit trail coverage.** `curriculum_audit_log` exists; confirm all privileged writes (role grants, content publish, approvals) are logged. ◐ **[verify]**
- **SEC-M6 — Duplicated session-token parsing** across 5 files (`useAuth`, `ProtectedRoute`, `Header`, `ProfileHub`, `PortalSettings`). Not a vuln; fragility risk. → single util. ☐

## LOW

- **SEC-L1 — Anon key + Supabase project ref hardcoded in client.** Safe by design (role `anon`); discloses project ref (reconnaissance only). ◐
- **SEC-L2 — Founder emails embedded in client bundle** (minor info disclosure; unavoidable with client gating). ◐
- **SEC-L3 — Three lockfiles** (`bun.lock`, `bun.lockb`, `package-lock.json`) → nondeterministic installs / supply-chain hygiene. ☐
- **SEC-L4 — `dist/` committed** to git (artifact hygiene). ☐
- **SEC-L5 — No automated security scanning in CI** (dependency/secret scan). ☐

---

## Verified-GOOD (controls confirmed present)
- ✅ **No secrets committed.** `.env` gitignored; only `.env.example` placeholders tracked. No `sk_live`/`whsec_`/service-role keys in source.
- ✅ **Service-role key is server-only** (`Deno.env`), never shipped to the client. The only client-side JWT is role `anon` (public by design).
- ✅ **LLM / ElevenLabs / Stripe-secret keys** read from `Deno.env`, never returned in responses.
- ✅ **RLS via `aos_is_admin()`** is the real authorization boundary (independent of the client gate).
- ✅ **Password reset:** global `signOut` after change; non-enumerating "if an account exists" forgot-password copy.
- ✅ **Webhook signature verification code exists** (the gap is the unsigned fallback, SEC-C1).

---

## Launch gate
| Severity | Open | State | Must close before launch? |
|---|---|---|---|
| CRITICAL | 1 open (C1) · 1 closed (C2) | C2 ✅ closed; C1 🟡 pending live-payment verification | **YES — hard blocker (C1)** |
| HIGH | 5 | open | Strongly recommended (H1, H4) |
| MEDIUM | 6 | open | Best-effort |
| LOW | 5 | open | Post-launch |

**Go/No-Go: NO-GO** (1 open CRITICAL). **SEC-C2 ✅ CLOSED** (verified in prod).
**SEC-C1 🟡 pending the live-payment test** — hardening is deployed and applied,
but certification requires one successful live ~$1 payment proving the full
checkout→webhook→unlock chain (idempotency confirmed on resend). → **GO when the
live-payment test passes** (then CRITICAL count = 0). No launch until then.
