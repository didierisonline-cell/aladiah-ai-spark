import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendEmail, emailWrapper, btnHtml, SITE_URL } from "../_shared/email.ts";
import { requireAdminOrServiceRole, corsHeaders } from "../_shared/adminGuard.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const authError = await requireAdminOrServiceRole(req);
  if (authError) return authError;

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("status", "active");

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No active students" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    let sentCount = 0;

    for (const sub of subscriptions) {
      const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id);
      const user = userData?.user;
      if (!user?.email) continue;

      const firstName = user.user_metadata?.full_name?.split(" ")[0] || "Student";

      // Quizzes passed this week
      const { data: weekQuizzes } = await supabase
        .from("user_progress")
        .select("quiz_id, completed_at")
        .eq("user_id", sub.user_id)
        .not("quiz_id", "is", null)
        .gte("completed_at", oneWeekAgo);

      const quizzesPassed = weekQuizzes?.length || 0;

      // Total progress
      const { data: allProgress } = await supabase
        .from("user_progress")
        .select("quiz_id")
        .eq("user_id", sub.user_id)
        .not("quiz_id", "is", null);

      const totalQuizzes = allProgress?.length || 0;

      // Points earned this week
      const { data: weekPoints } = await supabase
        .from("student_points")
        .select("points")
        .eq("user_id", sub.user_id)
        .gte("created_at", oneWeekAgo);

      const pointsEarned = (weekPoints || []).reduce((sum, p) => sum + p.points, 0);

      // Streak calculation
      const { data: streakData } = await supabase
        .from("user_progress")
        .select("completed_at")
        .eq("user_id", sub.user_id)
        .not("quiz_id", "is", null)
        .order("completed_at", { ascending: false })
        .limit(30);

      const dates = (streakData || [])
        .map(p => new Date(p.completed_at).toDateString())
        .filter((v, i, a) => a.indexOf(v) === i);
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < dates.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i);
        if (dates[i] === expected.toDateString()) streak++;
        else break;
      }

      // Motivational message based on performance
      let motivation = "";
      if (quizzesPassed >= 10) motivation = "Incredible week! You're on fire! 🔥";
      else if (quizzesPassed >= 5) motivation = "Great progress this week! Keep the momentum! 💪";
      else if (quizzesPassed >= 1) motivation = "Good start! Try to squeeze in a few more lessons this week. 📚";
      else motivation = "This week was quiet. Jump back in — even one lesson keeps your skills sharp! ⚡";

      const statRow = (label: string, value: string, emoji: string) =>
        `<tr>
          <td style="padding:8px 12px;color:rgba(255,255,255,0.5);font-size:13px;">${emoji} ${label}</td>
          <td style="padding:8px 12px;color:#fff;font-size:14px;font-weight:700;text-align:right;">${value}</td>
        </tr>`;

      const content = `
        <p style="color:rgba(255,255,255,0.8);font-size:15px;line-height:1.7;margin:0 0 16px;">
          Hi <strong style="color:#fff;">${firstName}</strong>, here's your weekly progress report:
        </p>
        <table style="width:100%;border-collapse:collapse;background:rgba(255,255,255,0.03);border-radius:12px;overflow:hidden;margin:16px 0;">
          ${statRow("Lessons Completed", String(quizzesPassed), "📖")}
          ${statRow("Total Quizzes Passed", String(totalQuizzes), "✅")}
          ${statRow("Points Earned", String(pointsEarned), "⭐")}
          ${statRow("Current Streak", `${streak} days`, "🔥")}
        </table>
        <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:16px;margin:16px 0;">
          <p style="color:#3b82f6;font-size:14px;font-weight:600;margin:0 0 8px;">📋 This Week's Game Plan:</p>
          <ul style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
            <li>Complete at least 5 lessons to stay on track</li>
            <li>Focus on any areas where quizzes were challenging</li>
            <li>Try a Lab session to reinforce what you've learned</li>
            <li>Engage in the Community for peer support</li>
          </ul>
        </div>
        <p style="color:rgba(255,255,255,0.7);font-size:14px;font-style:italic;margin:16px 0;text-align:center;">
          "${motivation}"
        </p>
        <div style="text-align:center;margin:24px 0;">
          ${btnHtml("Continue Learning →", `${SITE_URL}/portal`)}
        </div>
      `;

      await sendEmail(
        user.email,
        `${firstName}'s Weekly Progress Report 📊`,
        emailWrapper("Your Weekly Progress Report", content)
      );
      sentCount++;
    }

    return new Response(JSON.stringify({ message: `Sent ${sentCount} weekly reports` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weekly report error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
