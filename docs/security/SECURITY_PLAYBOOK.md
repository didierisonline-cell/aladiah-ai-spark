# Aladiah — Security Playbook

> Status: **Canonical (security).** Companion to `RISK_REGISTER.md`.
> Covers: security architecture, crown jewels, hardening checklist, launch security
> checklist, incident response, the permanent Security Operating Standard, and the
> Security Agent charter.

---

## 1. Security architecture diagram

```
                         ┌─────────────────────────────┐
                         │           STUDENT           │
                         │       (browser / mobile)    │
                         └──────────────┬──────────────┘
                          anon key (public, role:anon) + user JWT
                                        │ HTTPS
          ┌─────────────────────────────┼───────────────────────────────┐
          │                             │                               │
    ┌─────▼─────┐               ┌───────▼────────┐              ┌────────▼────────┐
    │  Vercel    │              │  Supabase Auth │              │ Supabase Edge   │
    │  (SPA +    │              │  (sessions,    │              │ Functions (Deno)│
    │  api/*.js) │              │  email confirm,│              │ verify_jwt gate │
    │            │              │  recovery)     │              │ + service role  │
    └─────┬──────┘              └───────┬────────┘              └────────┬────────┘
          │ proxy                       │                                │
          │ (create-checkout,           │ JWT                            │ service_role
          │  auth-signup[dead])         │                                │
    ┌─────▼──────┐              ┌────────▼─────────────────────────────────▼──────┐
    │   Stripe   │              │            Supabase Postgres                    │
    │  checkout  │◄── webhook ──│   RLS everywhere · aos_is_admin() = authz root  │
    │  + webhook │  (verify sig)│   user data · progress · subscriptions · roles  │
    └────────────┘              └─────────────────────────────────────────────────┘

  Secrets (server-only, never client): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
  SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, LOVABLE_API_KEY, ELEVENLABS_API_KEY,
  RESEND key.  Client holds ONLY the public anon key.

  Trust boundaries:
   • Client role (lib/roles.ts) = UX only, SPOOFABLE — not a security control.
   • Real authorization = Postgres RLS via aos_is_admin() (JWT email OR user_roles.admin).
   • Edge functions: platform verify_jwt (default true) + (required) in-function founder gate.
```

---

## 2. Crown jewels (what we protect, by tier)

### Tier 1 — must never be compromised
- Founder / admin accounts (`user_roles.admin`, `aos_is_admin()`)
- Stripe account + **webhook secret** + secret key
- Supabase **service-role key** + database
- **User PII** (auth.users, profiles)
- **Student progress** (user_progress, quiz_attempt_answers)
- **Payment data** (subscriptions, stripe_customer_id)

### Tier 2 — critical
- AI Mentor pipeline + LLM keys (Anthropic, Lovable gateway)
- Curriculum content + quiz bank (`quiz_questions`, approval workflow)
- Simulations engine + data
- Analytics / agent operating system

### Tier 3 — recoverable
- Marketing assets, landing pages, blog content, public copy

**Blast-radius rule:** a compromise of any Tier-1 jewel = SEV-1 incident (see §6).

---

## 3. Security hardening checklist (remediation work)

> Each maps to a Risk Register ID. Items touching payments/auth/edge/RLS require **founder approval**.

- [ ] **C1** Webhook: fail-closed without secret; verify signature; `event.id` dedup table; staleness check.
- [ ] **C2** Enforce email confirmation; confirm all founder emails owned; remove legacy email; gate trigger to confirmed users.
- [ ] **H1** Shared founder-JWT gate on all `seed-*`/admin edge functions; restrict their CORS.
- [ ] **H2** Delete `api/auth-signup.js` (or validate + rate-limit + origin-allowlist).
- [ ] **H3** Inventory every privileged RPC/edge fn; confirm each re-checks `aos_is_admin()`/JWT.
- [ ] **H4** Single entitlement source (`subscriptions`) + RLS on premium content; wire/remove `requireSubscription`.
- [ ] **H5** Rate limiting on auth, LLM, and privileged endpoints.
- [ ] **M1** One checkout path; remove anon key from Vercel env.
- [ ] **M2** Restrict CORS on seed/admin functions to known origins.
- [ ] **M3** Confirm/sanitize `dangerouslySetInnerHTML` usages.
- [ ] **M5** Verify privileged writes are logged (audit trail).
- [ ] **L3–L5** One lockfile; gitignore `dist/`; add CI dependency + secret scanning.

---

## 4. Launch security checklist (Go/No-Go)

**HARD GATE — all must be ✅ to launch:**
- [ ] SEC-C1 closed (webhook signature enforced + idempotent) and tested with Stripe CLI (signed ✓, unsigned ✗, duplicate no-op).
- [ ] SEC-C2 closed (email confirmation ON; founder emails owned; legacy removed).
- [ ] `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY` set in prod env; **none** in client.
- [ ] RLS deny-by-default verified on: `profiles`, `user_progress`, `subscriptions`, `quiz_questions`, `user_roles`.
- [ ] Founder-only routes reject students (FounderRoute + RLS) — verified for a real student account.
- [ ] Seed/admin edge functions reject non-founder callers (SEC-H1).
- [ ] No fabricated metrics shown to students (✅ already remediated).

**Strongly recommended before launch:** SEC-H4 (paywall), SEC-H2 (delete dead signup), SEC-H5 (rate limiting), SEC-M2 (CORS).

**Verification owners:** founder (console/env/Stripe), Security Agent (code/RLS/functions).

---

## 5. Identity, session & access controls (audit summary)

| Area | Control | Status |
|---|---|---|
| Authentication | Supabase email/password + Google OAuth; email confirmation | ◐ verify confirm=ON |
| Session mgmt | Supabase JWT in localStorage; `onAuthStateChange`; global signout on pw change | ✅ (token parsing duplicated — M6) |
| Password reset | Recovery session + `updateUser`; global signOut; non-enumerating | ✅ |
| Authorization (data) | RLS via `aos_is_admin()` | ✅ root control |
| Authorization (UI) | `lib/roles.ts` email allowlist | ⚠ UX-only, spoofable (by design) |
| Founder/Admin access | `user_roles.admin` + email allowlist; FounderRoute | ◐ C2 risk |
| Route protection | `ProtectedRoute` / `FounderRoute` | ✅ (paywall gap H4) |
| Rate limiting | Supabase auth defaults only | ☐ H5 |
| Logging / audit | `curriculum_audit_log` + others | ◐ verify coverage M5 |
| Secrets | server-only; none committed | ✅ |
| GitHub / Actions | repo scope restricted; no committed secrets | ◐ add secret-scan CI (L5) |

---

## 6. Incident Response Plan

**Severity:** SEV-1 = Tier-1 jewel compromised (payments/auth/DB/PII). SEV-2 = Tier-2. SEV-3 = Tier-3.

**Phases (SEV-1):**
1. **Detect** — alert source: Stripe radar/logs, Supabase logs, auth-failure spike, unusual admin activity, user report.
2. **Contain (first 15 min)** —
   - Suspected key leak → **rotate** the affected key immediately (Stripe, Supabase service-role, Anthropic, Lovable, ElevenLabs, Resend).
   - Suspected admin takeover → revoke `user_roles.admin` for non-founder ids; force-signout (rotate Supabase JWT secret if needed).
   - Suspected webhook forgery → disable the webhook endpoint in Stripe; set/rotate `STRIPE_WEBHOOK_SECRET`.
3. **Eradicate** — patch the vector (deploy fix), invalidate forged sessions/subscriptions.
4. **Recover** — restore from backup if data altered (validate restore); re-enable services.
5. **Post-mortem (≤48h)** — root cause, timeline, fix, new Risk Register entry, prevention.

**Contacts/keys to rotate (runbook):** Stripe (dashboard → API keys + webhook secret), Supabase (service-role + JWT secret + anon if needed), Anthropic, Lovable, ElevenLabs, Resend. Store rotation steps per provider here as they're executed.

**Backups/DR:** confirm Supabase PITR/backups enabled; quarterly restore test (see §7).

---

## 7. Aladiah Security Operating Standard (permanent)

**Every day**
- [ ] Check Vercel deployments (unexpected deploys?)
- [ ] Check Supabase logs (errors, RLS denials, anomalies)
- [ ] Check Stripe logs (failed/forged events, disputes)
- [ ] Check authentication failures (spikes = brute force)
- [ ] Check unusual admin/founder activity

**Every week**
- [ ] Review user permissions (`user_roles` census)
- [ ] Review founder/admin accounts (still exactly the intended set?)
- [ ] Review API-key exposure (no new client-side leaks)
- [ ] Review edge functions (new/changed; authz intact)
- [ ] Review security alerts (GitHub/Dependabot, Supabase)
- [ ] Update the Risk Register

**Every month**
- [ ] Rotate sensitive keys: Anthropic · OpenAI · ElevenLabs · Stripe · Supabase service-role · Lovable · Resend

**Every quarter**
- [ ] Penetration test
- [ ] Full access review
- [ ] Disaster-recovery validation
- [ ] Backup restore test

---

## 8. Security Agent charter

**Mission:** no deploy ships without Security Agent sign-off.

**Daily:** vulnerability scans · permission audits · key audits · route audits.
**Weekly:** security report · Risk Register update.
**Before every release:** security approval + explicit **Go / No-Go** recommendation referencing the §4 launch checklist.

**Authority:** may block any release that has an open CRITICAL finding. Escalates to founder for any change in the founder-approval set (payments, auth, RBAC, founder/admin access, Supabase policies, schema, secrets).

**Definition of done for "secure to launch":** Risk Register CRITICAL count = 0 AND §4 hard-gate fully ✅.
