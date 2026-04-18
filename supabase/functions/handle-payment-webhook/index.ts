import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&no-check";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
  }
  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!STRIPE_SECRET_KEY) throw new Error("Stripe not configured");
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.text();
    let event: Stripe.Event;
    if (STRIPE_WEBHOOK_SECRET) {
      const sig = req.headers.get("stripe-signature");
      if (!sig) throw new Error("Missing stripe-signature header");
      event = await stripe.webhooks.constructEventAsync(body, sig, STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body);
    }
    console.log(`Stripe event: ${event.type}`);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email || session.metadata?.email;
      const tier = session.metadata?.tier || "t1";
      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      let resolvedUserId = userId;
      if (!resolvedUserId) {
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users?.users?.find((u: { email: string }) => u.email === email);
        resolvedUserId = user?.id;
      }
      if (resolvedUserId) {
        await supabase.from("subscriptions").upsert({
          user_id: resolvedUserId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          tier, status: "active",
          current_period_end: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
        console.log(`✅ Subscription created: user=${resolvedUserId}, tier=${tier}`);
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
  } catch (error) {
    console.error("Webhook error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
});
