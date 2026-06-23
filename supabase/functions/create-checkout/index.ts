import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Structured JSON response carrying a stable `code` so the proxy, client, and logs
// can tell WHICH failure occurred (missing env vs bad price vs Stripe error) instead
// of an opaque 500.
function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ── SEC-002: entitlement is derived SERVER-SIDE ────────────────────────────────
// The client-supplied `tier` is NEVER trusted. The `priceId` must exist in this
// canonical map or the request is rejected (fail closed). Stripe price IDs come
// from env (never hardcoded); the price→tier mapping is the single source of truth.
function buildPriceTierMap(): Record<string, string> {
  const map: Record<string, string> = {};
  const add = (priceId: string | undefined | null, tier: string) => {
    if (priceId) map[priceId] = tier;
  };
  add(Deno.env.get("STRIPE_PRICE_FOUNDATION"), "t1");
  add(Deno.env.get("STRIPE_PRICE_ACCELERATOR"), "t2");
  add(Deno.env.get("STRIPE_PRICE_ANNUAL"), "t2");
  add(Deno.env.get("STRIPE_PRICE_ELITE"), "t3");
  // Optional JSON override for additional/renamed prices:
  //   STRIPE_PRICE_TIER_MAP = {"price_abc":"t2","price_def":"t3"}
  try {
    const extra = JSON.parse(Deno.env.get("STRIPE_PRICE_TIER_MAP") || "{}");
    for (const [k, v] of Object.entries(extra)) map[k] = String(v);
  } catch { /* malformed override ignored — map stays as built */ }
  return map;
}

// Which price env vars are SET — booleans only, never the values. Lets a failed
// request report exactly which server prices are configured without leaking ids.
function priceEnvPresence() {
  return {
    STRIPE_PRICE_FOUNDATION: !!Deno.env.get("STRIPE_PRICE_FOUNDATION"),
    STRIPE_PRICE_ACCELERATOR: !!Deno.env.get("STRIPE_PRICE_ACCELERATOR"),
    STRIPE_PRICE_ANNUAL: !!Deno.env.get("STRIPE_PRICE_ANNUAL"),
    STRIPE_PRICE_ELITE: !!Deno.env.get("STRIPE_PRICE_ELITE"),
    STRIPE_PRICE_TIER_MAP: !!Deno.env.get("STRIPE_PRICE_TIER_MAP"),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse body first so the (non-secret) priceId can be logged on any failure.
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    console.error("[create-checkout] BAD_REQUEST: body is not valid JSON");
    return json({ error: "Request body must be JSON", code: "BAD_REQUEST" }, 400);
  }

  // `tier` is intentionally NOT read from the client — entitlement is derived below.
  const { priceId, email, userId, successUrl, cancelUrl } = (body ?? {}) as Record<string, string>;
  console.log("[create-checkout] request", { priceId: priceId ?? null, hasEmail: !!email });

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  if (!STRIPE_SECRET_KEY) {
    console.error("[create-checkout] STRIPE_NOT_CONFIGURED: STRIPE_SECRET_KEY missing");
    return json({ error: "Stripe is not configured on the server", code: "STRIPE_NOT_CONFIGURED" }, 500);
  }

  if (!priceId) {
    console.error("[create-checkout] MISSING_PRICE_ID");
    return json({ error: "Missing priceId", code: "MISSING_PRICE_ID" }, 400);
  }

  // 1) Validate priceId against the canonical map and DERIVE tier from it (fail closed).
  const tier = buildPriceTierMap()[priceId];
  if (!tier) {
    const presence = priceEnvPresence();
    console.error("[create-checkout] UNKNOWN_PRICE_ID", { priceId, priceEnvPresence: presence });
    return json({
      error: "priceId is not configured on the server (price→tier map miss)",
      code: "UNKNOWN_PRICE_ID",
      receivedPriceId: priceId,
      priceEnvConfigured: presence,
    }, 400);
  }

  // 2) Bind identity to a VERIFIED user when a real session token is present (SEC-002).
  let resolvedUserId = typeof userId === "string" ? userId : "";
  const authz = req.headers.get("Authorization") || "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : "";
  const ANON = Deno.env.get("SUPABASE_ANON_KEY");
  if (token && token !== ANON) {
    try {
      const sb = createClient(Deno.env.get("SUPABASE_URL")!, ANON ?? "");
      const { data } = await sb.auth.getUser(token);
      if (data?.user?.id) resolvedUserId = data.user.id; // verified wins
    } catch { /* not a user token — fall back to the client-claimed id */ }
  }

  // 3) Create the Stripe Checkout Session. Stripe SDK errors carry a `type`
  //    (e.g. StripeAuthenticationError = bad/test-vs-live key) — surface it.
  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${req.headers.get("origin")}/auth?payment=success`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/pricing`,
      customer_email: email,
      allow_promotion_codes: true,
      metadata: { tier, user_id: resolvedUserId, email: email || "" },
      subscription_data: { metadata: { tier, user_id: resolvedUserId } },
    });
    console.log("[create-checkout] OK", { tier, sessionId: session.id });
    return json({ url: session.url });
  } catch (error) {
    const e = error as { message?: string; type?: string; raw?: { message?: string } };
    const message = e?.raw?.message || e?.message || "Stripe request failed";
    console.error("[create-checkout] STRIPE_ERROR", { type: e?.type ?? null, message });
    return json({ error: message, code: "STRIPE_ERROR", stripeType: e?.type ?? null }, 502);
  }
});
