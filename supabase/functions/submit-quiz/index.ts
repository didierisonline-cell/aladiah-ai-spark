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

    // `answers` accepts two shapes, both supported for backward compatibility:
    //  - LEGACY (existing live courses): a positional array indexed by
    //    order_index. Every question in the quiz is served and graded.
    //  - SERVED-SUBSET (exam/question-bank mode): an object map of
    //    { questionId: answerIndex }. Only the questions that were actually
    //    served/answered are fetched and graded — used when get_exam_questions
    //    serves N random questions from a large bank.
    const isArrayMode = Array.isArray(answers);
    const isMapMode =
      !isArrayMode &&
      answers !== null &&
      typeof answers === "object";

    if (!quizId || !answers || (!isArrayMode && !isMapMode)) {
      return new Response(
        JSON.stringify({ error: "Quiz ID and answers (array or {questionId: index} map) are required" }),
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

    // In map-mode we grade ONLY the question IDs that were served/answered.
    // In array-mode we grade every question in the quiz (legacy behaviour).
    const servedIds = isMapMode ? Object.keys(answers as Record<string, unknown>) : null;

    let questionsQuery = supabaseAdmin
      .from("quiz_questions")
      .select("id, correct_answer_index, explanation")
      .eq("quiz_id", quizId);

    if (servedIds) {
      // Bound the served set to questions that genuinely belong to this quiz —
      // a forged ID from another quiz is simply ignored, not graded. Also require
      // status='approved' so a forged draft/archived ID can't be graded (and have
      // its answer/rationale returned). Legacy array-mode is left unfiltered for
      // backward compatibility (existing live courses default to 'approved').
      questionsQuery = questionsQuery.in("id", servedIds).eq("status", "approved");
    }

    const { data: questions, error: questionsError } = await questionsQuery
      .order("order_index", { ascending: true });

    if (questionsError || !questions) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch questions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (questions.length === 0) {
      return new Response(
        JSON.stringify({ error: "No questions to grade for this quiz" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Grade the quiz. In array-mode the answer is looked up positionally; in
    // map-mode it is looked up by question id, so only the served subset counts.
    let correctCount = 0;
    const results = questions.map((q, index) => {
      const userAnswer = isMapMode
        ? (answers as Record<string, number>)[q.id]
        : (answers as number[])[index];
      const isCorrect = userAnswer === q.correct_answer_index;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        userAnswer: userAnswer ?? null,
        correctAnswer: q.correct_answer_index,
        isCorrect,
        explanation: q.explanation,
      };
    });

    // Denominator is the number of questions actually served/graded — the full
    // quiz in array-mode, the served subset (e.g. 20 of 350) in map-mode.
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
