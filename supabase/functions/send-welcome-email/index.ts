import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail, emailWrapper, btnHtml, SITE_URL } from "../_shared/email.ts";
import { requireServiceRole, isValidEmail, escapeHtml, json } from "../_shared/emailGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TIER_NAMES: Record<string, string> = {
  t1: "Foundation Builder",
  t2: "Career Accelerator",
  t3: "Elite Mentorship",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Server-to-server only (invoked by handle-payment-webhook with the service
  // role key). verify_jwt = false for this function, so this body check is what
  // closes the open relay.
  const denied = requireServiceRole(req);
  if (denied) return denied;

  try {
    const { email, fullName, tier } = await req.json();
    if (!isValidEmail(email)) return json(400, { error: "Invalid email" });

    const firstName = escapeHtml((fullName || "Student").split(" ")[0], 60);
    const tierName = TIER_NAMES[tier] || "Foundation Builder";

    const content = `
      <p style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.7;margin:0 0 16px;">
        Welcome, <strong style="color:#fff;">${firstName}</strong>! 🎉
      </p>
      <p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.7;margin:0 0 20px;">
        You're now enrolled in the <strong style="color:#f59e0b;">${tierName}</strong> plan at Aladiah Academy.
        Your portal is ready — courses, AI professors, and career tools are waiting for you.
      </p>

      <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.25);border-radius:12px;padding:20px;margin:20px 0;">
        <p style="color:#fff;font-size:15px;font-weight:700;margin:0 0 12px;">🚀 Your First 6 Steps:</p>
        <ol style="color:rgba(255,255,255,0.8);font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
          <li><strong style="color:#fff;">Log in to your portal</strong> — welcome home</li>
          <li><strong style="color:#fff;">Choose your language</strong> — learn in any of 7 languages</li>
          <li><strong style="color:#fff;">Introduce yourself in the Community</strong> — earn <span style="color:#f59e0b;">500 points</span> redeemable in the Academy Shop</li>
          <li><strong style="color:#fff;">Read the Scrum Guide or PMBOK</strong> — foundation material for a strong start</li>
          <li><strong style="color:#fff;">Start your first course</strong> — meet Professor Didier and dive in</li>
          <li><strong style="color:#fff;">Complete courses and track your progress</strong> — earn certificates as you go</li>
        </ol>
      </div>

      <div style="text-align:center;margin:28px 0;">
        ${btnHtml("Enter My Portal →", `${SITE_URL}/portal`, "#f59e0b")}
      </div>

      <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:20px 0 0;text-align:center;">
        Need help? Reply to this email or visit the Community section in your portal.<br>
        We're here for you every step of the way.
      </p>
    `;

    const result = await sendEmail(
      email,
      `Welcome to Aladiah Academy, ${firstName}! 🎓`,
      emailWrapper(`Welcome to Aladiah Academy! 🎓`, content)
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
