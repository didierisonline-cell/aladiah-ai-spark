# Security Closure — Priority #2 (pre-launch)

Scope: the four areas the founder named — **webhook · tier spoofing · cron
secrets · key rotation** — audited against the live edge functions and config.
Findings are severity-tagged with evidence (`file:line`) and an exact fix. Items
marked **[APPLIED]** are fixed on this branch; **[NEEDS FOUNDER]** changes the
payment contract or requires secrets/deploy, so it's delivered as a reviewable
plan (canon: human applies sensitive production changes).

> Deploy note: edge-function changes here are committed, not deployed. The founder
> deploys after confirming env secrets — surfaces naturally in the Founder
> Validation Runbook "Payment" step.

---

## SEC-001 — Webhook signature was optional · CRITICAL · [APPLIED]

**Evidence:** `supabase/functions/handle-payment-webhook/index.ts` previously did:
```ts
if (STRIPE_WEBHOOK_SECRET) { …verify… } else { event = JSON.parse(body); }  // unsigned fallback
```
**Risk:** if `STRIPE_WEBHOOK_SECRET` is unset, anyone who knows the function URL
can POST a forged `checkout.session.completed` with arbitrary
`metadata.tier` + `metadata.user_id` and grant themselves a paid (even Elite) tier
— payment bypass + tier spoofing in one request.
**Fix applied:** signature verification is now **mandatory and fail-closed** —
missing secret or missing/invalid signature is rejected. (Also removed a duplicate
`profiles` upsert.)
**Action for founder:** ensure `STRIPE_WEBHOOK_SECRET` is set in the function's
env before deploy, or webhooks will (correctly) be rejected.

---

## SEC-002 — create-checkout trusts client tier / priceId / userId · CRITICAL · [NEEDS FOUNDER]

**Evidence:** `supabase/functions/create-checkout/index.ts:13,27-28` and
`supabase/config.toml` (`[functions.create-checkout] verify_jwt = false`):
```ts
const { priceId, email, tier, userId, … } = await req.json();   // all client-supplied
metadata: { tier: tier || "t1", user_id: userId || "" }          // tier not derived from price
```
**Risk:** the caller can send a **cheap `priceId` with `tier:"t3"`** (pay little,
get Elite), or set `userId` to another account. `tier` flows through metadata into
the subscription, so this is a real tier-spoofing path independent of SEC-001.
**Recommended fix (reviewable — needs your real Stripe price IDs):**
1. **Derive tier server-side from `priceId`**, ignore any client `tier`:
   ```ts
   // env STRIPE_PRICE_TIER_MAP = {"price_xxx":"t1","price_yyy":"t2","price_zzz":"t3"}
   const MAP = JSON.parse(Deno.env.get("STRIPE_PRICE_TIER_MAP") || "{}");
   const tier = MAP[priceId];
   if (!tier) throw new Error("Unknown priceId");   // fail closed
   ```
2. **Authenticate the caller** instead of trusting `userId`: flip
   `verify_jwt = true` for `create-checkout` and read the user id from the verified
   JWT (`supabase.auth.getUser(token)`), not the request body.
3. Keep `email` only as a Stripe display hint; never as an identity key.
> Not auto-applied: it changes the checkout contract and requires your real price
> IDs + a frontend check that it still sends the auth header. Approve and provide
> the price→tier mapping and I'll implement + verify.

---

## SEC-003 — Cron / reminder functions · LOW · [VERIFIED OK]

**Evidence:** `supabase/config.toml` lists only three `verify_jwt = false`
functions (`send-welcome-email`, `create-checkout`, `handle-payment-webhook`).
The reminder/cron functions (`send-payment-reminder`, `send-study-reminders`,
`send-assignment-reminder`, `send-weekly-report`) are **not** listed → they keep
the Supabase default `verify_jwt = true`, so they require a valid JWT (the cron
scheduler invokes them with the service-role key).
**Status:** no open hole. **Recommendation (hardening, optional):** if any of
these is ever made public, add an explicit `CRON_SECRET` header check. Document the
intended invocation (pg_cron / scheduler + service role) so it's not accidentally
opened later.

---

## SEC-004 — Key handling / rotation · MEDIUM · [PARTIAL / NEEDS FOUNDER]

**Evidence:**
- `src/components/SimEngine.tsx:151` and `src/pages/StudentPortal.tsx:387` hardcode
  a Supabase **anon JWT** inline in a `Bearer` header.
- `src/services/security/securityPosture.ts:38` correctly asserts no
  service_role / Stripe / OpenAI / Anthropic / GitHub secrets are in the repo.

**Clarification:** the hardcoded token is the **anon (publishable) key** — public
by design, **not** a secret leak. The posture claim is accurate. **But** hardcoding
it in source means a key **rotation** requires code edits + redeploy in N places.
**Recommended fix (safe, low-risk):** replace the two inline literals with the
centralized client / env var already used elsewhere
(`import.meta.env.VITE_SUPABASE_ANON_KEY` or the shared `supabase` client), so
rotation is a single env change. I can apply this on request.
**Rotation hygiene (founder, out of repo):** confirm `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, and any model keys live only
in function env / secrets, and document a rotation runbook (rotate → update env →
redeploy → verify).

---

## Closure checklist

| ID | Area | Severity | Status |
|----|------|----------|--------|
| SEC-001 | Webhook signature | CRITICAL | ✅ Applied (fail-closed) |
| SEC-002 | create-checkout tier spoofing | CRITICAL | ⚠️ Needs founder (price map + auth) |
| SEC-003 | Cron secret gating | LOW | ✅ Verified OK (jwt-gated) |
| SEC-004 | Anon key hardcoded / rotation | MEDIUM | ◻️ Partial — fix on request |

**Gate to launch:** SEC-002 should close before real payments are accepted.
SEC-001 is closed in code (pending deploy with the secret set).
