import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&no-check";

// Allowed subscription tiers (must match subscriptions.tier CHECK constraint).
const VALID_TIERS = ["t1", "t2", "t3"] as const;
type Tier = (typeof VALID_TIERS)[number];

/**
 * Server-side price -> tier map, built from edge-function env so the granted
 * entitlement is derived from what the customer ACTUALLY purchased, not from
 * client-supplied checkout metadata (which the browser controls).
 * Configure these in Supabase Edge Function secrets to fully close tier
 * escalation: STRIPE_PRICE_T1, STRIPE_PRICE_T2, STRIPE_PRICE_T3,
 * STRIPE_PRICE_ANNUAL (annual maps to t2).
 */
function buildPriceTierMap(): Record<string, Tier> {
  const map: Record<string, Tier> = {};
  const add = (envName: string, tier: Tier) => {
    const v = Deno.env.get(envName);
    if (v) map[v] = tier;
  };
  add("STRIPE_PRICE_T1", "t1");
  add("STRIPE_PRICE_T2", "t2");
  add("STRIPE_PRICE_T3", "t3");
  add("STRIPE_PRICE_ANNUAL", "t2");
  return map;
}

function validTier(value: unknown): Tier | null {
  return VALID_TIERS.includes(value as Tier) ? (value as Tier) : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
  }
  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!STRIPE_SECRET_KEY) throw new Error("Stripe not configured");

    // SECURITY: the webhook secret is MANDATORY. Without signature verification
    // an attacker could POST a forged "checkout.session.completed" event and be
    // granted a paid subscription. Refuse to process anything unsigned.
    if (!STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET is not set — refusing to process webhook.");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const priceTierMap = buildPriceTierMap();

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      // Signature verification failed — reject (do NOT fall back to parsing).
      console.error("Webhook signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Stripe event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email || session.metadata?.email || session.customer_details?.email;
      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      // SECURITY: derive the tier from the PRICE the customer actually paid for,
      // looking up the session's line item. Client-supplied metadata.tier is only
      // a last-resort fallback and is validated against the allowed set. This
      // prevents "request t3 while paying the t1 price" escalation.
      let tier: Tier = "t1";
      let derivedFrom = "default";
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
        const paidPriceId = lineItems.data?.[0]?.price?.id;
        const mapped = paidPriceId ? priceTierMap[paidPriceId] : undefined;
        if (mapped) {
          tier = mapped;
          derivedFrom = `price:${paidPriceId}`;
        } else {
          const metaTier = validTier(session.metadata?.tier);
          if (metaTier) {
            tier = metaTier;
            derivedFrom = paidPriceId
              ? `metadata(unmapped price ${paidPriceId})`
              : "metadata(no line item)";
          }
        }
      } catch (e) {
        const metaTier = validTier(session.metadata?.tier);
        if (metaTier) { tier = metaTier; derivedFrom = "metadata(lineitem lookup failed)"; }
        console.error("Line item lookup failed:", (e as any)?.message);
      }
      console.log(`Resolved tier=${tier} (${derivedFrom})`);

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

      console.log(`Attempting upsert: userId=${resolvedUserId}, tier=${tier}, customer=${customerId}, fullName=${fullName}`);

      if (!resolvedUserId) {
        console.error("No user_id could be resolved. email=", email);
        return new Response(JSON.stringify({ received: true, warning: "no_user" }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      const { data: upsertData, error: upsertError } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: resolvedUserId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          tier,
          status: "active",
          current_period_end: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" })
        .select();

      if (upsertError) {
        console.error("Upsert failed:", upsertError);
        return new Response(JSON.stringify({ received: true, error: upsertError.message }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      console.log(`Subscription upserted, rows: ${JSON.stringify(upsertData)}`);

      // Update profiles.tier so the frontend unlocks immediately.
      await supabase.from("profiles").upsert({
        user_id: resolvedUserId,
        tier: tier,
        free_course_completed: false,
      }, { onConflict: "user_id" });
      console.log(`Profile tier updated to ${tier}`);

      try {
        const emailResp = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-welcome-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({ email, tier, fullName }),
        });
        console.log(`Welcome email status: ${emailResp.status}`);
      } catch (e) {
        console.error("Welcome email error (non-fatal):", e);
      }
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const periodEnd = invoice.lines?.data?.[0]?.period?.end;
      if (customerId) {
        await supabase.from("subscriptions").update({
          status: "active",
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        }).eq("stripe_customer_id", customerId);
      }
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
