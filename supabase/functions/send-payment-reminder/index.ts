import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendEmail, emailWrapper, btnHtml, SITE_URL } from "../_shared/email.ts";
import { requireAdminOrServiceRole, corsHeaders } from "../_shared/adminGuard.ts";

const TIER_NAMES: Record<string, string> = {
  t1: "Foundation Builder",
  t2: "Career Accelerator",
  t3: "Elite Mentorship",
};

const TIER_PRICES: Record<string, number> = {
  t1: 99, t2: 299, t3: 499,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const authError = await requireAdminOrServiceRole(req);
  if (authError) return authError;

  try {
    const { email, tier, nextPaymentDate } = await req.json();
    if (!email) throw new Error("Missing email");

    const tierName = TIER_NAMES[tier] || "Foundation Builder";
    const price = TIER_PRICES[tier] || 99;
    const dateStr = nextPaymentDate
      ? new Date(nextPaymentDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "soon";

    // Upgrade suggestion for non-Elite tiers
    const upgradeSection = tier !== "t3" ? `
      <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:16px;margin:16px 0;">
        <p style="color:#10b981;font-size:14px;font-weight:600;margin:0 0 8px;">✨ Ready to Level Up?</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 12px;">
          ${tier === "t1"
            ? "Upgrade to Career Accelerator for AI Interview Coach, Resume Builder, and real-world simulations."
            : "Upgrade to Elite for weekly 1-on-1 mentorship with Professor Didier and placement support."
          }
        </p>
        ${btnHtml("View Upgrade Options", `${SITE_URL}/pricing`, "#10b981")}
      </div>
    ` : "";

    const content = `
      <p style="color:rgba(255,255,255,0.8);font-size:15px;line-height:1.7;margin:0 0 16px;">
        Your <strong style="color:#f59e0b;">${tierName}</strong> subscription payment of
        <strong style="color:#fff;">$${price}/month</strong> is coming up on <strong style="color:#fff;">${dateStr}</strong>.
      </p>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0 0 16px;">
        Make sure your payment method is up to date to avoid any interruption to your courses and AI tools.
      </p>
      <div style="text-align:center;margin:20px 0;">
        ${btnHtml("Go to My Portal", `${SITE_URL}/portal`)}
      </div>
      ${upgradeSection}
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:16px 0 0;">
        Need to update your payment method or change your plan? Visit your portal or reply to this email.
      </p>
    `;

    const result = await sendEmail(
      email,
      `Payment reminder — $${price} due ${dateStr}`,
      emailWrapper("Payment Reminder", content)
    );

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
