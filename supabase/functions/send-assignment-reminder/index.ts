import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendEmail, emailWrapper, btnHtml, SITE_URL } from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find students with active subscriptions who haven't completed a quiz in 24h+
    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("status", "active");

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No active students" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    let sentCount = 0;

    for (const sub of subscriptions) {
      // Check last quiz completion
      const { data: recentProgress } = await supabase
        .from("user_progress")
        .select("completed_at")
        .eq("user_id", sub.user_id)
        .not("quiz_id", "is", null)
        .gte("completed_at", oneDayAgo)
        .limit(1);

      // If they have recent activity, skip
      if (recentProgress && recentProgress.length > 0) continue;

      // Check they have SOME progress (not brand new)
      const { data: anyProgress } = await supabase
        .from("user_progress")
        .select("id")
        .eq("user_id", sub.user_id)
        .limit(1);

      if (!anyProgress || anyProgress.length === 0) continue;

      // Get user info
      const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id);
      const user = userData?.user;
      if (!user?.email) continue;

      const firstName = user.user_metadata?.full_name?.split(" ")[0] || "Student";

      const content = `
        <p style="color:rgba(255,255,255,0.8);font-size:15px;line-height:1.7;margin:0 0 16px;">
          Hey <strong style="color:#fff;">${firstName}</strong>,
        </p>
        <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0 0 16px;">
          You haven't completed a lesson in over 24 hours. Your assignment is waiting!
          Consistency is the key to certification success — even 15 minutes today keeps your momentum going.
        </p>
        <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:16px;margin:16px 0;">
          <p style="color:#f59e0b;font-size:14px;font-weight:600;margin:0;">
            ⏰ Assignment Deadline Approaching
          </p>
          <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:8px 0 0;">
            Continue where you left off and complete your next quiz.
          </p>
        </div>
        <div style="text-align:center;margin:24px 0;">
          ${btnHtml("Continue My Lesson →", `${SITE_URL}/courses`, "#f59e0b")}
        </div>
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:16px 0 0;">
          Professor Didier is ready to help. See you in class!
        </p>
      `;

      await sendEmail(
        user.email,
        `${firstName}, your assignment is waiting! ⏰`,
        emailWrapper("Assignment Reminder", content)
      );
      sentCount++;
    }

    return new Response(JSON.stringify({ message: `Sent ${sentCount} reminders` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Assignment reminder error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
