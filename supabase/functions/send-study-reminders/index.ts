import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdminOrServiceRole, corsHeaders } from "../_shared/adminGuard.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  const authError = await requireAdminOrServiceRole(req);
  if (authError) return authError;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get all users with profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name");

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ message: "No students found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get recent progress for each user
    const results = [];
    for (const profile of profiles) {
      // Check last activity
      const { data: lastProgress } = await supabase
        .from("user_progress")
        .select("completed_at")
        .eq("user_id", profile.user_id)
        .order("completed_at", { ascending: false })
        .limit(1);

      const lastActive = lastProgress?.[0]?.completed_at;
      const daysSinceActive = lastActive
        ? Math.floor((Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      // Get user's total progress
      const { count: completedCount } = await supabase
        .from("user_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.user_id);

      let reminderType = "none";
      if (daysSinceActive >= 7) {
        reminderType = "inactive_week";
      } else if (daysSinceActive >= 3) {
        reminderType = "gentle_nudge";
      } else if (daysSinceActive === 0) {
        reminderType = "streak_keep";
      }

      results.push({
        userId: profile.user_id,
        name: profile.full_name || "Student",
        daysSinceActive,
        completedLessons: completedCount || 0,
        reminderType,
      });
    }

    // Generate AI-powered blog content for the weekly digest
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let weeklyBlogSummary = "";

    if (LOVABLE_API_KEY) {
      try {
        const blogResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content: "You are a Scrum Master career coach. Write a brief, engaging weekly digest (150 words max) about current trends in Scrum/Agile, a practical tip, and motivation for students. Include relevant emojis.",
              },
              { role: "user", content: "Write this week's Scrum Master newsletter digest." },
            ],
          }),
        });

        if (blogResp.ok) {
          const blogData = await blogResp.json();
          weeklyBlogSummary = blogData.choices?.[0]?.message?.content || "";
        }
      } catch (e) {
        console.error("Blog generation error:", e);
      }
    }

    // Store the weekly blog if generated
    if (weeklyBlogSummary) {
      await supabase.from("weekly_blogs").insert({
        title: `Weekly Scrum Digest - ${new Date().toLocaleDateString()}`,
        content: weeklyBlogSummary,
        summary: weeklyBlogSummary.slice(0, 200),
        tags: ["weekly-digest", "scrum", "career"],
        published: true,
      });
    }

    return new Response(
      JSON.stringify({
        processed: results.length,
        reminders: results.filter((r) => r.reminderType !== "none").length,
        blogGenerated: !!weeklyBlogSummary,
        details: results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Reminder error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
