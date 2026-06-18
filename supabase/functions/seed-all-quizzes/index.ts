import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    // SECURITY: founder/admin only — this seeder writes content with the service role.
    const __adminCheck = await requireAdmin(req);
    if (__adminCheck instanceof Response) return __adminCheck;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all videos that don't have a quiz yet
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('id, title, chapter_id, order_index');
    
    if (videosError) throw videosError;

    // Get existing quizzes to avoid duplicates
    const { data: existingQuizzes } = await supabase
      .from('quizzes')
      .select('video_id');
    
    const existingVideoIds = new Set((existingQuizzes || []).map(q => q.video_id));

    // Filter videos that need quizzes
    const videosNeedingQuizzes = (videos || []).filter(v => !existingVideoIds.has(v.id));

    if (videosNeedingQuizzes.length === 0) {
      return new Response(
        JSON.stringify({ message: "All videos already have quizzes", count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create mini_video quizzes for each video
    const quizzesToCreate = videosNeedingQuizzes.map(video => ({
      video_id: video.id,
      chapter_id: video.chapter_id,
      quiz_type: 'mini_video',
      passing_score: 100
    }));

    const { data: createdQuizzes, error: createError } = await supabase
      .from('quizzes')
      .insert(quizzesToCreate)
      .select();

    if (createError) throw createError;

    // Now create 5 questions for each quiz
    const questionsToCreate: any[] = [];
    
    for (const quiz of createdQuizzes || []) {
      const video = videosNeedingQuizzes.find(v => v.id === quiz.video_id);
      const videoTitle = video?.title || "this topic";
      
      // Generate 5 scenario-based questions per quiz
      const questions = generateQuestionsForTopic(videoTitle, quiz.id);
      questionsToCreate.push(...questions);
    }

    // Insert questions in batches to avoid timeout
    const batchSize = 50;
    for (let i = 0; i < questionsToCreate.length; i += batchSize) {
      const batch = questionsToCreate.slice(i, i + batchSize);
      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(batch);
      
      if (questionsError) {
        console.error('Error inserting questions batch:', questionsError);
      }
    }

    // Also create chapter_end quizzes for chapters that don't have one
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id');
    
    const { data: chapterQuizzes } = await supabase
      .from('quizzes')
      .select('chapter_id')
      .eq('quiz_type', 'chapter_end');
    
    const chaptersWithEndQuiz = new Set((chapterQuizzes || []).map(q => q.chapter_id));
    const chaptersNeedingEndQuiz = (chapters || []).filter(c => !chaptersWithEndQuiz.has(c.id));

    if (chaptersNeedingEndQuiz.length > 0) {
      const chapterQuizzesToCreate = chaptersNeedingEndQuiz.map(chapter => ({
        chapter_id: chapter.id,
        quiz_type: 'chapter_end',
        passing_score: 100
      }));

      const { data: createdChapterQuizzes, error: chapterQuizError } = await supabase
        .from('quizzes')
        .insert(chapterQuizzesToCreate)
        .select();

      if (chapterQuizError) {
        console.error('Error creating chapter quizzes:', chapterQuizError);
      }

      // Create 40 questions for each chapter end quiz
      for (const quiz of createdChapterQuizzes || []) {
        const chapterQuestions = generateChapterEndQuestions(quiz.id);
        
        for (let i = 0; i < chapterQuestions.length; i += batchSize) {
          const batch = chapterQuestions.slice(i, i + batchSize);
          const { error: chapterQError } = await supabase
            .from('quiz_questions')
            .insert(batch);
          
          if (chapterQError) {
            console.error('Error inserting chapter questions:', chapterQError);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        quizzesCreated: createdQuizzes?.length || 0,
        questionsCreated: questionsToCreate.length,
        chapterQuizzesCreated: chaptersNeedingEndQuiz.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error seeding quizzes:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateQuestionsForTopic(topicTitle: string, quizId: string) {
  // Base questions that can be adapted to any Agile/Scrum topic
  const questionTemplates = [
    {
      scenario: `During a team discussion about ${topicTitle}, a team member asks why this concept is important.`,
      question: `What is the PRIMARY purpose of ${topicTitle} in Agile methodology?`,
      options: [
        "To add bureaucratic documentation to the process",
        "To enable continuous improvement and value delivery",
        "To give managers more control over the team",
        "To slow down the development process for quality"
      ],
      correct: 1,
      explanation: `${topicTitle} is designed to enable continuous improvement and deliver maximum value to customers through iterative development.`
    },
    {
      scenario: `Your organization is implementing ${topicTitle} for the first time. The leadership team wants to understand the key benefits.`,
      question: `Which of the following is a key benefit of properly implementing ${topicTitle}?`,
      options: [
        "Reduced collaboration between team members",
        "Longer planning cycles with more detailed specifications",
        "Faster feedback loops and adaptability to change",
        "Elimination of all meetings and ceremonies"
      ],
      correct: 2,
      explanation: "Faster feedback loops and adaptability to change are core benefits of Agile practices."
    },
    {
      scenario: `A new Scrum Master is trying to explain ${topicTitle} to stakeholders who are unfamiliar with Agile.`,
      question: `How would you best describe the role of ${topicTitle} in a Scrum team's success?`,
      options: [
        "It's optional and only used by advanced teams",
        "It's a critical component that supports empirical process control",
        "It's mainly for documentation purposes",
        "It replaces the need for a Scrum Master"
      ],
      correct: 1,
      explanation: "This concept is a critical component that supports empirical process control through transparency, inspection, and adaptation."
    },
    {
      scenario: `During a Sprint Retrospective, the team discusses how well they applied ${topicTitle} during the last sprint.`,
      question: `What is the BEST indicator that ${topicTitle} is being applied effectively?`,
      options: [
        "The team completes all documentation on time",
        "Management is satisfied with the reports",
        "The team continuously improves and delivers value each sprint",
        "There are no conflicts during meetings"
      ],
      correct: 2,
      explanation: "Effective application is measured by continuous improvement and consistent value delivery, not just process compliance."
    },
    {
      scenario: `A Product Owner is unsure how ${topicTitle} affects their daily responsibilities.`,
      question: `How does understanding ${topicTitle} help a Product Owner maximize product value?`,
      options: [
        "It allows them to bypass the development team's input",
        "It helps them make informed prioritization decisions",
        "It removes their responsibility for the product backlog",
        "It eliminates the need for stakeholder communication"
      ],
      correct: 1,
      explanation: "Understanding Agile concepts helps Product Owners make informed decisions that maximize product value for stakeholders."
    }
  ];

  return questionTemplates.map((template, index) => ({
    quiz_id: quizId,
    question_text: template.question,
    scenario_context: template.scenario,
    options: JSON.stringify(template.options),
    correct_answer_index: template.correct,
    explanation: template.explanation,
    order_index: index
  }));
}

function generateChapterEndQuestions(quizId: string) {
  // Generate 40 comprehensive chapter-end questions
  const questions = [];
  
  const scrumTopics = [
    { topic: "Scrum Values", desc: "Commitment, Focus, Openness, Respect, and Courage" },
    { topic: "Sprint Planning", desc: "defining what can be delivered and how" },
    { topic: "Daily Scrum", desc: "15-minute daily synchronization" },
    { topic: "Sprint Review", desc: "inspecting the increment and adapting the backlog" },
    { topic: "Sprint Retrospective", desc: "inspecting and adapting the team's processes" },
    { topic: "Product Backlog", desc: "ordered list of everything needed in the product" },
    { topic: "Sprint Backlog", desc: "selected items for the sprint plus a plan" },
    { topic: "Definition of Done", desc: "shared understanding of completeness" },
    { topic: "Scrum Master role", desc: "servant leader helping the team" },
    { topic: "Product Owner role", desc: "maximizing product value" },
    { topic: "Development Team", desc: "self-organizing professionals" },
    { topic: "User Stories", desc: "expressing requirements from user perspective" },
    { topic: "Story Points", desc: "relative estimation of effort" },
    { topic: "Velocity", desc: "amount of work completed per sprint" },
    { topic: "Burndown Charts", desc: "tracking remaining work" },
    { topic: "Backlog Refinement", desc: "adding detail and estimates to items" },
    { topic: "Sprint Goal", desc: "objective that guides the team" },
    { topic: "Increment", desc: "sum of completed items in a sprint" },
    { topic: "Time-boxing", desc: "fixed maximum time for activities" },
    { topic: "Empirical Process", desc: "transparency, inspection, and adaptation" }
  ];

  for (let i = 0; i < 40; i++) {
    const topic = scrumTopics[i % scrumTopics.length];
    const questionVariants = [
      {
        scenario: `A team is struggling with ${topic.topic}. As a Scrum Master, you need to help them understand its importance.`,
        question: `What is the PRIMARY purpose of ${topic.topic} in Scrum?`,
        options: [
          `To add documentation requirements`,
          `To enable ${topic.desc}`,
          `To satisfy management reporting needs`,
          `To create more meetings for the team`
        ],
        correct: 1
      },
      {
        scenario: `During a certification exam, you encounter a question about ${topic.topic}.`,
        question: `According to the Scrum Guide, ${topic.topic} is BEST described as:`,
        options: [
          `An optional practice for advanced teams`,
          `A core element for ${topic.desc}`,
          `A management control mechanism`,
          `A documentation requirement`
        ],
        correct: 1
      }
    ];

    const variant = questionVariants[i % 2];
    
    questions.push({
      quiz_id: quizId,
      question_text: variant.question,
      scenario_context: variant.scenario,
      options: JSON.stringify(variant.options),
      correct_answer_index: variant.correct,
      explanation: `${topic.topic} is essential for ${topic.desc}. Understanding this concept is crucial for Scrum Master certification.`,
      order_index: i
    });
  }

  return questions;
}
