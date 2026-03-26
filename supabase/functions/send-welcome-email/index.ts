import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail, emailWrapper, btnHtml, SITE_URL } from "../_shared/email.ts";

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

  try {
    const { email, fullName, tier } = await req.json();
    if (!email) throw new Error("Missing email");

    const firstName = (fullName || "Student").split(" ")[0];
    const tierName = TIER_NAMES[tier] || "Foundation Builder";

    const content = `
      <p style="color:rgba(255,255,255,0.8);font-size:15px;line-height:1.7;margin:0 0 16px;">
        Welcome, <strong style="color:#fff;">${firstName}</strong>! 🎉
      </p>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0 0 16px;">
        You're now enrolled in the <strong style="color:#f59e0b;">${tierName}</strong> plan at Aladiah Academy.
        Your portal is ready — courses, AI professors, and career tools are waiting for you.
      </p>
      <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:16px;margin:16px 0;">
        <p style="color:#fff;font-size:14px;font-weight:600;margin:0 0 8px;">🚀 Quick Start:</p>
        <ol style="color:rgba(255,255,255,0.7);font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
          <li>Log in to your portal</li>
          <li>Choose your language</li>
          <li>Start your first lesson with Professor Didier</li>
          <li>Complete the quiz to track your progress</li>
        </ol>
      </div>
      <div style="text-align:center;margin:24px 0;">
        ${btnHtml("Enter My Portal →", `${SITE_URL}/auth`, "#f59e0b")}
      </div>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;line-height:1.6;margin:16px 0 0;">
        Need help? Reply to this email or visit the Community section in your portal.
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
