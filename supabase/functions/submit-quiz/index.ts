import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;

    const { quizId, answers } = await req.json();

    if (!quizId || !answers || !Array.isArray(answers)) {
      return new Response(
        JSON.stringify({ error: "Quiz ID and answers array are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get quiz info
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("*, chapters(course_id)")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return new Response(
        JSON.stringify({ error: "Quiz not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get questions with correct answers
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from("quiz_questions")
      .select("id, correct_answer_index, explanation")
      .eq("quiz_id", quizId)
      .order("order_index", { ascending: true });

    if (questionsError || !questions) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch questions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Grade the quiz
    let correctCount = 0;
    const results = questions.map((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correct_answer_index;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correct_answer_index,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passing_score;

    // Save the attempt
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from("quiz_attempts")
      .insert({
        user_id: userId,
        quiz_id: quizId,
        answers: answers,
        score,
        passed,
      })
      .select()
      .single();

    if (attemptError) {
      console.error("Error saving attempt:", attemptError);
      return new Response(
        JSON.stringify({ error: "Failed to save attempt" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If passed, record progress
    if (passed) {
      await supabaseAdmin
        .from("user_progress")
        .upsert({
          user_id: userId,
          course_id: quiz.chapters?.course_id,
          quiz_id: quizId,
          chapter_id: quiz.chapter_id,
          video_id: quiz.video_id,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,quiz_id",
        });
    }

    return new Response(
      JSON.stringify({
        attemptId: attempt.id,
        score,
        passed,
        correctCount,
        totalQuestions: questions.length,
        results,
        passingScore: quiz.passing_score,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
