import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── SEC-002: entitlement is derived SERVER-SIDE ────────────────────────────────
// The client-supplied `tier` is NEVER trusted. The `priceId` must exist in this
// canonical map or the request is rejected (fail closed). Stripe price IDs come
// from env (never hardcoded); the price→tier mapping is the single source of truth
// for what a checkout is allowed to grant. This closes the "pay for a cheap price,
// claim an expensive tier" spoofing vector.
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    // `tier` is intentionally NOT destructured — it must never come from the client.
    const { priceId, email, userId, successUrl, cancelUrl } = await req.json();

    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) throw new Error("Stripe not configured");

    // 1) Validate priceId against the canonical map and DERIVE tier from it.
    if (!priceId) throw new Error("Missing priceId");
    const tier = buildPriceTierMap()[priceId];
    if (!tier) throw new Error("Unknown or unconfigured priceId"); // fail closed

    // 2) Bind identity to a VERIFIED user when a real session token is present.
    //    Frontend follow-up (tracked in SEC-002): always send the user's access
    //    token; then set verify_jwt=true for this function and drop client `userId`
    //    entirely. Until then we prefer a verified id and fall back to the claim.
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
      // Server-derived entitlement only — tier comes from the price, not the client.
      metadata: { tier, user_id: resolvedUserId, email: email || "" },
      subscription_data: { metadata: { tier, user_id: resolvedUserId } },
    });
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("create-checkout error:", (error as Error).message);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
