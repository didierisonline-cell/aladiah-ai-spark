import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user is admin
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check admin role
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) throw new Error("Admin access required");

    // Gather all analytics
    const [
      { count: totalStudents },
      { data: analytics },
      { data: quizAttempts },
      { data: labsData },
      { data: pointsData },
      { data: blogData },
      { count: totalReferrals },
    ] = await Promise.all([
      adminClient.from("profiles").select("*", { count: "exact", head: true }),
      adminClient.from("student_analytics").select("*").order("created_at", { ascending: false }).limit(1000),
      adminClient.from("quiz_attempts").select("*").order("created_at", { ascending: false }).limit(500),
      adminClient.from("student_labs").select("*"),
      adminClient.from("student_points").select("*"),
      adminClient.from("blog_engagement").select("*"),
      adminClient.from("referral_tracking").select("*", { count: "exact", head: true }),
    ]);

    // Calculate metrics
    const logins = (analytics || []).filter(a => a.event_type === "login");
    const videoWatches = (analytics || []).filter(a => a.event_type === "video_watch");
    const aiChats = (analytics || []).filter(a => a.event_type === "ai_chat");
    const blogReads = (analytics || []).filter(a => a.event_type === "blog_read");
    const blogClicks = (analytics || []).filter(a => a.event_type === "blog_click");

    const totalTimeSpent = (analytics || []).reduce((sum, a) => sum + (a.duration_seconds || 0), 0);
    const avgQuizScore = quizAttempts?.length
      ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length)
      : 0;
    const totalPoints = (pointsData || []).reduce((sum, p) => sum + p.points, 0);
    const completedLabs = (labsData || []).filter(l => l.completed).length;

    const result = {
      overview: {
        totalStudents: totalStudents || 0,
        totalLogins: logins.length,
        totalVideoWatches: videoWatches.length,
        totalAiChats: aiChats.length,
        totalBlogReads: blogReads.length,
        totalBlogClicks: blogClicks.length,
        totalTimeSpentHours: Math.round(totalTimeSpent / 3600),
        avgQuizScore,
        totalPointsEarned: totalPoints,
        completedLabs,
        totalReferrals: totalReferrals || 0,
      },
      // Financial projections
      financials: {
        pricePerStudent: 1999,
        milestones: [
          { students: 1, revenue: 1999, label: "First Student" },
          { students: 50, revenue: 99950, label: "50 Students" },
          { students: 100, revenue: 199900, label: "100 Students" },
          { students: 200, revenue: 399800, label: "200 Students" },
          { students: 500, revenue: 999500, label: "500 Students" },
          { students: 1000, revenue: 1999000, label: "1000 Students (Goal)" },
        ],
        placement: {
          scrumMaster: { contractValue: 150000, cost: 40000, profit: 110000 },
          projectManager: { contractValue: 200000, cost: 50000, profit: 150000 },
          targets: [
            { role: "Scrum Master", placed: 500, profitEach: 100000, totalProfit: 50000000 },
            { role: "Scrum Master", placed: 1000, profitEach: 100000, totalProfit: 100000000 },
            { role: "Project Manager", placed: 500, profitEach: 130000, totalProfit: 65000000 },
          ],
        },
        twoYearPlan: {
          year1: { enrollmentTarget: 334, enrollmentRevenue: 667666, placementTarget: 167, placementRevenue: 16700000 },
          year2: { enrollmentTarget: 666, enrollmentRevenue: 1331334, placementTarget: 333, placementRevenue: 33300000 },
        },
      },
      recentActivity: (analytics || []).slice(0, 20),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-analytics error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: e instanceof Error && e.message === "Admin access required" ? 403 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
