import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdmin } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // SECURITY: founder/admin only via the shared guard (canonical founder emails
  // OR a user_roles admin row) — replaces the prior user_roles-only check, which
  // had no founder-email fallback.
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Gather all analytics
    const [
      { count: totalStudents },
      { data: analytics },
      { data: quizAttempts },
      { data: labsData },
      { data: pointsData },
      { data: blogData },
      { count: totalReferrals },
      { data: profilesData },
      { data: allProgress },
      { data: coursesData },
      { data: chaptersData },
      { data: videosData },
      { data: quizzesData },
    ] = await Promise.all([
      adminClient.from("profiles").select("*", { count: "exact", head: true }),
      adminClient.from("student_analytics").select("*").order("created_at", { ascending: false }).limit(1000),
      adminClient.from("quiz_attempts").select("*").order("created_at", { ascending: false }).limit(500),
      adminClient.from("student_labs").select("*"),
      adminClient.from("student_points").select("*"),
      adminClient.from("blog_engagement").select("*"),
      adminClient.from("referral_tracking").select("*", { count: "exact", head: true }),
      adminClient.from("profiles").select("user_id, full_name, created_at"),
      adminClient.from("user_progress").select("user_id, quiz_id, completed_at").not("quiz_id", "is", null),
      adminClient.from("courses").select("id, title").eq("is_published", true),
      adminClient.from("chapters").select("id, course_id"),
      adminClient.from("videos").select("id, chapter_id"),
      adminClient.from("quizzes").select("id, video_id, chapter_id, quiz_type"),
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

    // ---- Per-student roster ----
    const students = (profilesData || []).map(profile => {
      const userId = profile.user_id;

      // Points
      const userPoints = (pointsData || [])
        .filter(p => p.user_id === userId)
        .reduce((sum, p) => sum + p.points, 0);

      // Labs
      const userLabs = (labsData || []).filter(l => l.user_id === userId);
      const userLabsCompleted = userLabs.filter(l => l.completed).length;

      // Quiz attempts
      const userQuizAttempts = (quizAttempts || []).filter(q => q.user_id === userId);
      const userAvgScore = userQuizAttempts.length > 0
        ? Math.round(userQuizAttempts.reduce((s, q) => s + q.score, 0) / userQuizAttempts.length)
        : 0;

      // Progress (passed quizzes)
      const userPassedQuizIds = (allProgress || [])
        .filter(p => p.user_id === userId)
        .map(p => p.quiz_id);

      // Overall progress: count mini_video quizzes passed / total mini_video quizzes
      const allMiniQuizzes = (quizzesData || []).filter(q => q.quiz_type === "mini_video");
      const passedMini = allMiniQuizzes.filter(q => userPassedQuizIds.includes(q.id)).length;
      const overallPct = allMiniQuizzes.length > 0
        ? Math.round((passedMini / allMiniQuizzes.length) * 100)
        : 0;

      // Streak
      const userDates = (allProgress || [])
        .filter(p => p.user_id === userId)
        .map(p => new Date(p.completed_at).toDateString())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < userDates.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i);
        if (userDates[i] === expected.toDateString()) streak++;
        else break;
      }

      // Per-course progress
      const courseProgress = (coursesData || []).map(course => {
        const cChapters = (chaptersData || []).filter(ch => ch.course_id === course.id);
        const cVideos = (videosData || []).filter(v => cChapters.some(ch => ch.id === v.chapter_id));
        const cMiniQuizzes = (quizzesData || []).filter(q =>
          cVideos.some(v => v.id === q.video_id) && q.quiz_type === "mini_video"
        );
        const passed = cMiniQuizzes.filter(q => userPassedQuizIds.includes(q.id)).length;
        return {
          courseId: course.id,
          title: course.title,
          total: cVideos.length,
          completed: passed,
          pct: cVideos.length > 0 ? Math.round((passed / cVideos.length) * 100) : 0,
        };
      });

      return {
        userId,
        fullName: profile.full_name || "Unknown",
        registeredAt: profile.created_at,
        overallProgress: overallPct,
        streak,
        points: userPoints,
        labsCompleted: userLabsCompleted,
        totalLabs: userLabs.length,
        avgQuizScore: userAvgScore,
        quizAttempts: userQuizAttempts.length,
        courseProgress,
      };
    });

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
      students,
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
