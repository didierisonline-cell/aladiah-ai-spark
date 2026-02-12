import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fullName, email, phone, company, jobTitle, country, course } = await req.json();

    // Validate required fields
    if (!fullName || !email || !phone || !country) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // TODO: Create Stripe checkout session for $1,999
    // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
    // const session = await stripe.checkout.sessions.create({
    //   line_items: [{ price: 'price_scrum_master', quantity: 1 }],
    //   mode: 'payment',
    //   success_url: `${req.headers.get('origin')}/courses?enrolled=true`,
    //   cancel_url: `${req.headers.get('origin')}/enroll?course=${course}`,
    //   customer_email: email,
    //   metadata: { fullName, phone, company, jobTitle, country, course },
    // });

    // For now, return a placeholder response
    return new Response(
      JSON.stringify({ 
        message: "Stripe not yet configured. Checkout session will be created here.",
        // url: session.url  // This will redirect to Stripe checkout
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
