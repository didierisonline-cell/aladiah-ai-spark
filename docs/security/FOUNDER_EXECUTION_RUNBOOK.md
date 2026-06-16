# Aladiah — Founder Security Execution Runbook

> Purpose: turn the **Security Gate GREEN** by closing SEC-C1 (Stripe webhook) and
> SEC-C2 (founder-admin takeover). Companion to `RISK_REGISTER.md`, PR #14.
> Audience: **the Founder, executing from an iPad** (Safari). No terminal required
> except where explicitly noted (the one CLI fallback).
> Golden rule: **do the steps in order.** Ordering prevents payment downtime and
> admin lockout.

---

## 0. Pre-flight (5 min) — do NOT skip

| | Detail |
|---|---|
| **Why** | Capture current state + ensure you can recover. |
| **Backup** | Supabase Dashboard → **Database** → **Backups** → confirm a recent daily backup exists (or **Point-in-Time Recovery** is ON). Expected: at least one backup timestamp today. |
| **Record current admins** | Supabase → **SQL Editor** → **+ New query** → paste → **Run**:<br>`SELECT u.email, ur.role FROM public.user_roles ur JOIN auth.users u ON u.id=ur.user_id WHERE ur.role IN ('admin','moderator');` |
| **Expected** | A small list including **your** founder email. **Write down your email exactly** — you'll need it in Step 4. |
| **Failure** | If your account is NOT listed as admin, STOP — do Step 4's grant first and tell me before tightening. |

---

## STEP 1 — Stripe: get the webhook signing secret  *(must precede Step 3)*

| | Detail |
|---|---|
| **Location** | Stripe Dashboard (dashboard.stripe.com) on iPad Safari. |
| **Click path** | **Developers** → **Webhooks** → click your endpoint (URL ending `…/functions/v1/handle-payment-webhook`). |
| **Action** | Under **Signing secret**, tap **Reveal** → copy the value. |
| **Expected** | A string starting **`whsec_…`**. |
| **If no endpoint exists** | **Add endpoint** → URL = `https://<your-project>.supabase.co/functions/v1/handle-payment-webhook` → select events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted` → **Add** → then reveal the secret. |
| **Failure indicators** | No `whsec_` shown / endpoint 404 on test. |
| **Rollback** | None (read-only). |

---

## STEP 2 — Supabase: set the function secrets  *(makes the new code work)*

| | Detail |
|---|---|
| **Location** | Supabase Dashboard → **Edge Functions** → **Secrets** (on some versions: **Project Settings → Edge Functions → Secrets**). |
| **Action** | Ensure these secrets exist (Add new secret if missing):<br>• `STRIPE_WEBHOOK_SECRET` = the `whsec_…` from Step 1<br>• `STRIPE_SECRET_KEY` = your Stripe **secret** key (`sk_live_…`)<br>• (already present) `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Expected** | Both Stripe secrets listed (values masked). |
| **Failure indicators** | Secret missing → after deploy, the webhook returns **500 "webhook not configured"** (fail-closed; this is by design, but payments won't process until set). |
| **Rollback** | Removing a secret reverts to the prior state; not recommended. |

> ⚠️ **Do Step 2 BEFORE Step 4 (deploy).** The hardened code fails closed: if the
> secret isn't set when it deploys, all webhooks return 500 and new purchases won't
> unlock. Setting the secret first prevents any payment gap.

---

## STEP 3 — Supabase: apply Migration 1 (idempotency table)

| | Detail |
|---|---|
| **Location** | Supabase → **SQL Editor** → **+ New query**. |
| **Command** | Paste **exactly** and tap **Run**: |

```sql
CREATE TABLE IF NOT EXISTS public.processed_stripe_events (
  event_id     text PRIMARY KEY,
  type         text,
  processed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.processed_stripe_events ENABLE ROW LEVEL SECURITY;
```

| | |
|---|---|
| **Expected** | "Success. No rows returned." |
| **Verify** | `SELECT count(*) FROM public.processed_stripe_events;` → returns `0`. |
| **Failure indicators** | Any red error (e.g., permission). Re-check you're in the SQL Editor (runs as service role). |
| **Rollback** | `DROP TABLE public.processed_stripe_events;` (safe — the webhook then just fails-open on dedup, still processes). |

---

## STEP 4 — Supabase: apply Migration 2 (founder-admin hardening)  ⚠️ sensitive

| | Detail |
|---|---|
| **Location** | Supabase → **SQL Editor** → **+ New query**. |
| **BEFORE RUNNING** | In the SQL below, **replace the email** with the founder address you logged into Step 0 with (the one you own + have confirmed). Keep ONLY owned+confirmed addresses. |
| **Command** | Paste, edit the email(s) in BOTH places, then **Run**: |

```sql
BEGIN;
-- 1) Grant admin to YOUR real, confirmed account(s) FIRST (no lockout).
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN ('didierisonline@gmail.com')   -- ← EDIT to your owned email
  AND u.email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Admin = explicit user_roles grant ONLY (removes the JWT-email bypass).
CREATE OR REPLACE FUNCTION public.aos_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

-- 3) Neutralize the signup auto-grant WITHOUT deleting the trigger/function.
--    The trigger stays attached; the function becomes a no-op (no auto-elevation).
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- SEC-C2: NO-OP. No founder-email auto-elevation. Admin is managed via user_roles only.
  RETURN NEW;
END;
$$;

-- 4) Revoke admin/moderator from everyone who is NOT your verified account.
DELETE FROM public.user_roles ur
WHERE ur.role IN ('admin','moderator')
  AND ur.user_id NOT IN (
    SELECT u.id FROM auth.users u
    WHERE lower(u.email) IN ('didierisonline@gmail.com')  -- ← SAME email as step 1
      AND u.email_confirmed_at IS NOT NULL
  );
COMMIT;
```

| | |
|---|---|
| **Expected** | "Success." |
| **Verify (a)** | `SELECT u.email, ur.role FROM public.user_roles ur JOIN auth.users u ON u.id=ur.user_id WHERE ur.role='admin';` → **only your account(s)**. |
| **Verify (b)** | Open the app in a new tab, signed in as founder → go to `/founder` → it loads (not redirected to `/portal`). |
| **Verify (c)** | Trigger kept, function neutralized: `SELECT prosrc FROM pg_proc WHERE proname='auto_assign_admin';` → body is the **no-op** (NO `didierisonline`/`didiermbok`/`INSERT … user_roles`). |
| **Failure indicators** | Verify (a) empty, or (b) redirects you off `/founder` → you're not admin. Use the **emergency rollback** below. |
| **Emergency rollback (un-lock yourself)** | The SQL Editor runs as service role and ignores RLS, so you can always re-grant:<br>`INSERT INTO public.user_roles (user_id, role) SELECT id,'admin'::public.app_role FROM auth.users WHERE lower(email)='YOUR_EMAIL' ON CONFLICT DO NOTHING;` |

---

## STEP 5 — Supabase: deploy the hardened webhook function

| | Detail |
|---|---|
| **Location** | Supabase → **Edge Functions** → **handle-payment-webhook** → **Code** editor. |
| **Action (iPad path)** | Select-all the existing code, delete, paste the full code from **Appendix A** below, tap **Deploy**. |
| **Confirm setting** | Same function → **Details/Settings** → **Verify JWT = OFF** (Stripe is unauthenticated; if ON, Stripe can't call it). |
| **Expected** | "Deployed" toast; new version timestamp. |
| **If in-dashboard editing is NOT available on your plan** | This step needs the Supabase CLI on a computer (not iPad): `supabase functions deploy handle-payment-webhook`. Tell me and I'll guide it / it can wait for a laptop. **This is the only non-iPad step.** |
| **Failure indicators** | Deploy error; or test event (Step 6) returns 500. |
| **Rollback** | Re-deploy the previous version: Edge Functions → handle-payment-webhook → **Deployments/History** → select prior version → **Restore/Redeploy** (or paste the previous code). |

---

## STEP 6 — Stripe: test the webhook end-to-end

| | Detail |
|---|---|
| **Location** | Stripe → **Developers** → **Webhooks** → your endpoint → **Send test webhook**. |
| **Action** | Choose **`checkout.session.completed`** → **Send test event**. |
| **Expected** | Response **200**. In Supabase SQL Editor: `SELECT * FROM public.processed_stripe_events ORDER BY processed_at DESC LIMIT 5;` → a new row for that event id. |
| **Replay check** | In Stripe, on that delivered event tap **Resend** → still **200** but **no new row** (idempotent) and the response shows `duplicate:true`. |
| **Forged check (optional, needs laptop)** | `curl -X POST <endpoint> -d '{}'` → expect **400 "missing signature"** (never 200). |
| **Failure indicators** | 500 = secret missing (redo Step 2). 400 on the *signed* test = signature/secret mismatch (re-copy `whsec_`). |
| **Rollback** | Re-deploy previous webhook (Step 5 rollback). |

---

## STEP 7 — Supabase: enforce email confirmation

| | Detail |
|---|---|
| **Location** | Supabase → **Authentication** → **Providers** → **Email** (or **Authentication → Sign In / Configuration**). |
| **Action** | Ensure **Confirm email** = **ON** (users must confirm before a session). |
| **Expected** | Toggle ON; saved. |
| **Why** | Backstops SEC-C2: an attacker can't get a session for a founder email they don't control. |
| **Failure indicators** | If OFF, unconfirmed signups get sessions. |
| **Rollback** | Toggle OFF (not recommended). |

---

## STEP 8 — Post-deployment validation (flip the gate)

Run/confirm all:
- [ ] Step 3 table exists; Step 4 verify (a)(b)(c) pass; you can still reach `/founder`.
- [ ] Step 6: signed test = 200 + row; resend = 200 + no dup; (optional) unsigned = 400.
- [ ] Step 2: `STRIPE_WEBHOOK_SECRET` + `STRIPE_SECRET_KEY` present.
- [ ] Step 7: email confirmation ON.
- [ ] Smoke: real student login works; founder login + `/founder` works.

**When all are ✅ → reply "C1/C2 applied"** with the result of Verify (a) and the Step 6 status. I will mark SEC-C1 + SEC-C2 **CLOSED**, set **Security Gate = GREEN**, and resume P1 architecture.

---

## Rollback master list (if anything breaks)
| Symptom | Action |
|---|---|
| Payments stop / webhook 500 | Confirm `STRIPE_WEBHOOK_SECRET` set (Step 2). If still broken, redeploy previous webhook (Step 5 rollback). |
| You lost `/founder` access | Run the emergency re-grant SQL (Step 4) with your email. |
| Migration error | Each migration is idempotent; re-run after fixing the flagged line. Table rollback = `DROP TABLE public.processed_stripe_events;`. |
| Need to fully revert C2 | Tell me — I'll provide the exact prior `aos_is_admin()` + trigger definitions to restore. |

---

## Appendix A — full `handle-payment-webhook/index.ts` to paste (Step 5)

```ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&no-check";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
  }
  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      console.error("Webhook misconfigured: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
      return new Response(JSON.stringify({ error: "webhook not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16", httpClient: Stripe.createFetchHttpClient() });
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) return new Response(JSON.stringify({ error: "missing signature" }), { status: 400, headers: { "Content-Type": "application/json" } });
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("Signature verification failed:", err?.message);
      return new Response(JSON.stringify({ error: "invalid signature" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const { error: dedupErr } = await supabase.from("processed_stripe_events").insert({ event_id: event.id, type: event.type });
    if (dedupErr) {
      if ((dedupErr as any).code === "23505") {
        return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      console.error("Dedup insert error (proceeding):", dedupErr.message);
    }
    console.log(`Stripe event: ${event.type} (${event.id})`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email || session.metadata?.email || session.customer_details?.email;
      const tier = session.metadata?.tier || "t2";
      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      let resolvedUserId = userId;
      let fullName = "Student";
      if (!resolvedUserId && email) {
        const { data } = await supabase.auth.admin.listUsers();
        const matched = data?.users?.find((u: any) => u.email === email);
        resolvedUserId = matched?.id;
        fullName = matched?.user_metadata?.full_name || matched?.user_metadata?.name || "Student";
      } else if (resolvedUserId) {
        const { data } = await supabase.auth.admin.getUserById(resolvedUserId);
        fullName = data?.user?.user_metadata?.full_name || data?.user?.user_metadata?.name || "Student";
      }
      if (!resolvedUserId) {
        return new Response(JSON.stringify({ received: true, warning: "no_user" }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      const { error: upsertError } = await supabase.from("subscriptions").upsert({
        user_id: resolvedUserId, stripe_customer_id: customerId, stripe_subscription_id: subscriptionId,
        tier, status: "active", current_period_end: null, updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" }).select();
      if (upsertError) {
        return new Response(JSON.stringify({ received: true, error: upsertError.message }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      await supabase.from("profiles").upsert({ user_id: resolvedUserId, tier, free_course_completed: false }, { onConflict: "user_id" });
      try {
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-welcome-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
          body: JSON.stringify({ email, tier, fullName }),
        });
      } catch (e) { console.error("Welcome email error (non-fatal):", e); }
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const periodEnd = invoice.lines?.data?.[0]?.period?.end;
      if (customerId) await supabase.from("subscriptions").update({ status: "active", current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null, updated_at: new Date().toISOString() }).eq("stripe_customer_id", customerId);
    }
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      if (customerId) await supabase.from("subscriptions").update({ status: "past_due", updated_at: new Date().toISOString() }).eq("stripe_customer_id", customerId);
    }
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      if (customerId) await supabase.from("subscriptions").update({ status: "canceled", updated_at: new Date().toISOString() }).eq("stripe_customer_id", customerId);
    }
    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
});
```

> Note: Appendix A is the SAME logic as the current function with the duplicate
> `profiles` upsert removed (it was an accidental copy-paste) — behavior identical.
> Vercel: **no change required** for these two criticals (the Stripe secret lives in
> Supabase function secrets, not Vercel). Do NOT put `STRIPE_SECRET_KEY` in Vercel.
