import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const courseData = {
  title: "AI Product Manager",
  description: "Master the art of building and shipping AI-powered products. From roadmapping and AI UX design to metric frameworks and managing engineering teams building LLM applications.",
  chapters: [
    {
      title: "Module 1: AI Product Management Fundamentals",
      description: "Understand how AI PM differs from traditional PM, and the frameworks for discovering, prioritizing, and shipping AI features.",
      order_index: 0,
      videos: [
        {
          title: "1.1 How AI Product Management Differs from Traditional PM",
          description: "The unique challenges and opportunities of managing AI products \u2014 probabilistic outputs, technical dependencies, and the ML development lifecycle.",
          order_index: 0,
          lessonScript: {
            mainPoints: [
              "AI product management requires a fundamentally different mindset than traditional software PM. Traditional software is deterministic \u2014 the same input always produces the same output, and a failing feature throws an error. AI features are probabilistic \u2014 the same input may produce different outputs, quality exists on a spectrum rather than pass/fail, and degradation is gradual rather than sudden. AI PMs must be comfortable with 'good enough' rather than 'correct'.",
              "The ML development lifecycle has different timelines than software development. A feature in traditional software can be shipped in 2 weeks. An ML feature requires: data collection/curation (weeks to months), model training and experimentation (days to weeks), evaluation and A/B testing (weeks), deployment and monitoring setup (days to weeks). AI PMs must set realistic timelines that account for experimental uncertainty \u2014 sometimes the model just doesn't work and the roadmap needs revision.",
              "AI PMs must understand the machine learning pipeline without being ML engineers. You need to know what a training dataset is and why its quality matters more than model architecture. You need to understand evaluation metrics (precision, recall, F1, NDCG, BLEU) and explain them to stakeholders. You need to recognize when a model needs more data versus better features versus a different algorithm. You don't code models; you need enough understanding to have productive conversations with the team.",
              "Managing stakeholder expectations for AI features is one of the most challenging aspects of AI PM. Non-technical stakeholders expect AI to be magic \u2014 perfect, infallible, instant. Reality: AI makes mistakes, confidence varies by input type, performance degrades on out-of-distribution inputs, and capabilities improve gradually. AI PMs must proactively set expectations, communicate model limitations clearly, and design product experiences that gracefully handle AI errors.",
              "The AI PM's north star is user value from AI capabilities. This requires understanding: what problem does the AI solve, is AI the right solution or is a deterministic system better, how does AI failure affect user experience, what's the minimum viable model quality for user value, and how do you measure AI contribution to business outcomes versus other factors. These questions must be answered before writing a single line of the PRD."
            ]
          },
          questions: [            {
              question_text: "Why must AI PMs set different timeline expectations than traditional software PMs?",
              scenario_context: "Stakeholders expect a new AI recommendation feature in 2 weeks.",
              options: ["AI PMs should accept the same timelines", "ML development is experimental \u2014 data collection, model training, evaluation, and A/B testing require weeks to months with uncertain outcomes that may require iteration", "AI development is always slower than traditional software", "Timeline differences only apply to training large models"],
              correct_answer_index: 1,
              explanation: "ML experimentation is inherently uncertain \u2014 the model may not work well enough after initial training, requiring data improvements, architecture changes, or feature engineering. AI PMs must budget for this uncertainty in roadmaps."
            },
            {
              question_text: "Your AI feature achieves 78% accuracy overall, but 92% on desktop users and 58% on mobile users. What is the correct product decision?",
              scenario_context: "Evaluating whether to ship the mobile version of the AI feature.",
              options: ["Ship to all users \u2014 78% is good average accuracy", "Evaluate mobile-specific training data, define minimum accuracy threshold for user value, consider mobile-only exclusion or clearly communicating limitations to mobile users", "Ship to mobile with no disclaimer \u2014 accuracy will improve with more usage data", "Cancel the feature entirely"],
              correct_answer_index: 1,
              explanation: "Segment-specific accuracy differences often indicate data distribution problems. 58% accuracy on mobile may be worse than the manual baseline \u2014 shipping a degraded experience is worse than no AI feature. Fix mobile training data or explicitly exclude mobile until quality meets threshold."
            },
            {
              question_text: "What is the correct AI PM approach when a model shows high confidence but wrong predictions on edge cases?",
              scenario_context: "Your image classification model outputs 95% confidence on incorrect classifications for unusual inputs.",
              options: ["Accept \u2014 high confidence predictions are always reliable", "Implement confidence calibration evaluation; add uncertainty quantification to the UX; set minimum confidence thresholds; test extensively on edge cases before shipping", "Only test common cases \u2014 edge cases rarely occur", "Trust the model confidence scores without validation"],
              correct_answer_index: 1,
              explanation: "Overconfident wrong predictions are worse than acknowledged uncertainty. The UX should reflect actual model reliability \u2014 high confidence on unusual inputs is a calibration problem requiring fix before shipping."
            },
            {
              question_text: "What is the most important data point before writing an AI feature PRD?",
              scenario_context: "You're planning a customer churn prediction feature.",
              options: ["Target accuracy metric", "30-minute ML feasibility conversation: does training data exist? What's task difficulty? What's serving infrastructure? What are compliance constraints?", "Competitor analysis of similar AI features", "Expected business ROI from the feature"],
              correct_answer_index: 1,
              explanation: "A feasibility conversation with the ML team before writing the PRD determines if the feature is buildable with available data and compute, what quality to expect, and what infrastructure is needed \u2014 preventing writing detailed requirements for infeasible features."
            }]
        },
        {
          title: "1.2 Discovering and Prioritizing AI Use Cases",
          description: "Frameworks for identifying where AI creates real value and how to prioritize the AI roadmap.",
          order_index: 1,
          lessonScript: {
            mainPoints: [
              "Use case discovery for AI starts with opportunity identification: where does the product have tasks that are manual, repetitive, judgment-based, or data-intensive? Each is an AI opportunity. Map these against two dimensions: feasibility (can current AI capabilities solve this?) and impact (what is the business and user value if it works?). High-impact, high-feasibility opportunities are your immediate roadmap. High-impact, low-feasibility are your research investments.",
              "The AI opportunity matrix has four quadrants. Stars: high impact, high feasibility \u2014 build now. Question marks: high impact, low feasibility \u2014 prototype and invest in research. Cash cows: low impact, high feasibility \u2014 may be worth building for automation savings. Dogs: low impact, low feasibility \u2014 deprioritize. Most mature AI product roadmaps have 1-2 star opportunities (driving the current quarter), 2-3 question marks (funded with research time), and explicitly excluded dogs.",
              "MoSCoW prioritization for AI features requires AI-specific considerations beyond traditional software. Must-have: model quality threshold (if the model is below X accuracy, the feature is worse than the manual process). Should-have: monitoring and human override capability. Could-have: personalization and user adaptation. Won't-have (this iteration): fully autonomous operation without human oversight. This framing ensures AI features ship with appropriate guardrails.",
              "Technical feasibility assessment for AI use cases requires collaboration with ML engineers and data scientists. Key questions: does sufficient training data exist (labeled examples)? What quality of data is available? What's the baseline difficulty of the prediction task (human performance level)? What infrastructure is required for serving? What's the P50/P90/P99 latency requirement? What are the compliance constraints (PII in training data, regulatory requirements)? A 30-minute feasibility conversation with the ML team before writing a PRD saves weeks of wasted work.",
              "AI product-market fit differs from traditional PMF. You need two types of fit: the AI capability fit (the model is good enough to deliver real value) and the product-market fit (users want the AI-enhanced product). AI capability fit must be assessed first \u2014 a perfect product experience wrapping a mediocre AI creates user frustration. Use proxy metrics during development: offline model metrics correlate with online user metrics. A/B test model improvements against the control to validate that model quality improvements translate to user value."
            ]
          },
          questions: [            {
              question_text: "Why must AI PMs set different timeline expectations than traditional software PMs?",
              scenario_context: "Stakeholders expect a new AI recommendation feature in 2 weeks.",
              options: ["AI PMs should accept the same timelines", "ML development is experimental \u2014 data collection, model training, evaluation, and A/B testing require weeks to months with uncertain outcomes that may require iteration", "AI development is always slower than traditional software", "Timeline differences only apply to training large models"],
              correct_answer_index: 1,
              explanation: "ML experimentation is inherently uncertain \u2014 the model may not work well enough after initial training, requiring data improvements, architecture changes, or feature engineering. AI PMs must budget for this uncertainty in roadmaps."
            },
            {
              question_text: "Your AI feature achieves 78% accuracy overall, but 92% on desktop users and 58% on mobile users. What is the correct product decision?",
              scenario_context: "Evaluating whether to ship the mobile version of the AI feature.",
              options: ["Ship to all users \u2014 78% is good average accuracy", "Evaluate mobile-specific training data, define minimum accuracy threshold for user value, consider mobile-only exclusion or clearly communicating limitations to mobile users", "Ship to mobile with no disclaimer \u2014 accuracy will improve with more usage data", "Cancel the feature entirely"],
              correct_answer_index: 1,
              explanation: "Segment-specific accuracy differences often indicate data distribution problems. 58% accuracy on mobile may be worse than the manual baseline \u2014 shipping a degraded experience is worse than no AI feature. Fix mobile training data or explicitly exclude mobile until quality meets threshold."
            },
            {
              question_text: "What is the correct AI PM approach when a model shows high confidence but wrong predictions on edge cases?",
              scenario_context: "Your image classification model outputs 95% confidence on incorrect classifications for unusual inputs.",
              options: ["Accept \u2014 high confidence predictions are always reliable", "Implement confidence calibration evaluation; add uncertainty quantification to the UX; set minimum confidence thresholds; test extensively on edge cases before shipping", "Only test common cases \u2014 edge cases rarely occur", "Trust the model confidence scores without validation"],
              correct_answer_index: 1,
              explanation: "Overconfident wrong predictions are worse than acknowledged uncertainty. The UX should reflect actual model reliability \u2014 high confidence on unusual inputs is a calibration problem requiring fix before shipping."
            },
            {
              question_text: "What is the most important data point before writing an AI feature PRD?",
              scenario_context: "You're planning a customer churn prediction feature.",
              options: ["Target accuracy metric", "30-minute ML feasibility conversation: does training data exist? What's task difficulty? What's serving infrastructure? What are compliance constraints?", "Competitor analysis of similar AI features", "Expected business ROI from the feature"],
              correct_answer_index: 1,
              explanation: "A feasibility conversation with the ML team before writing the PRD determines if the feature is buildable with available data and compute, what quality to expect, and what infrastructure is needed \u2014 preventing writing detailed requirements for infeasible features."
            }]
        }
      ],
      endQuizQuestions: [            {
              question_text: "You're prioritizing Q3 AI features. Feature A: AI-generated response suggestions (feasibility: high, impact: medium). Feature B: fully autonomous customer service agent (feasibility: low \u2014 insufficient data, impact: high). Feature C: AI email subject line optimizer (feasibility: high, impact: low). What is the optimal prioritization?",
              scenario_context: "You have capacity for 2 features this quarter.",
              options: ["Feature B for maximum impact", "Feature A for highest near-term ROI, plus research investment in Feature B's data problem while deprioritizing Feature C", "Feature C because it's fastest to ship", "Feature A and C"],
              correct_answer_index: 1,
              explanation: "Feature A is a 'star' \u2014 high feasibility, medium impact, ship now. Feature B is a 'question mark' \u2014 high impact, low feasibility, invest in fixing the data problem as a research workstream. Feature C is a 'dog' for AI \u2014 build only if it has other strategic value."
            },
            {
              question_text: "Your AI product's A/B test shows the new model (better offline metrics: NDCG +12%) has no statistically significant lift in click-through rate or conversion. What does this mean?",
              scenario_context: "Six weeks of ML work showed no user value improvement.",
              options: ["Deploy the new model anyway \u2014 offline metrics will eventually translate to online metrics", "Investigate the offline-online metric disconnect: the business metric may not be sensitive to the model improvement, or the improvement may only matter for tail cases not well-represented in the A/B test sample", "The ML team's model is wrong despite good offline metrics", "NDCG is not a valid offline metric for this use case"],
              correct_answer_index: 1,
              explanation: "Offline-online metric disconnect is common in recommendation systems. Causes: the online metric isn't sensitive to ranking quality improvements; the improvement only matters for unpopular items with low traffic; other product factors dominate user behavior. Debug by looking at subgroup analysis and longer experiment windows."
            }]
    }
  ]
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      // SECURITY: founder/admin only — this seeder writes content with the service role.
      const __adminCheck = await requireAdmin(req);
      if (__adminCheck instanceof Response) return __adminCheck;
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const { data: existing } = await supabaseClient
      .from("courses").select("id").eq("title", courseData.title).maybeSingle();
    if (existing) {
      return new Response(JSON.stringify({ message: "Course already exists", courseId: existing.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: course, error: courseError } = await supabaseClient
      .from("courses")
      .insert({ title: courseData.title, description: courseData.description, is_published: true })
      .select().single();
    if (courseError) throw courseError;
    for (const chapterData of courseData.chapters) {
      const { data: chapter, error: chErr } = await supabaseClient
        .from("chapters")
        .insert({ course_id: course.id, title: chapterData.title, description: chapterData.description, order_index: chapterData.order_index })
        .select().single();
      if (chErr) throw chErr;
      for (const videoData of chapterData.videos) {
        const transcript = videoData.lessonScript.mainPoints.join("\n\n");
        const { data: video, error: vErr } = await supabaseClient
          .from("videos")
          .insert({ chapter_id: chapter.id, title: videoData.title, description: videoData.description, order_index: videoData.order_index, translations: { en: { title: videoData.title, transcript }, es: { title: videoData.title, transcript }, fr: { title: videoData.title, transcript }, de: { title: videoData.title, transcript }, zh: { title: videoData.title, transcript }, ar: { title: videoData.title, transcript }, ja: { title: videoData.title, transcript } } })
          .select().single();
        if (vErr) throw vErr;
        const { data: quiz, error: qErr } = await supabaseClient
          .from("quizzes")
          .insert({ video_id: video.id, chapter_id: chapter.id, quiz_type: "mini_video", passing_score: 85 })
          .select().single();
        if (qErr) throw qErr;
        for (let i = 0; i < videoData.questions.length; i++) {
          const q = videoData.questions[i];
          await supabaseClient.from("quiz_questions").insert({ quiz_id: quiz.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
        }
      }
      const { data: endQuiz, error: eqErr } = await supabaseClient
        .from("quizzes")
        .insert({ chapter_id: chapter.id, quiz_type: "chapter_end", passing_score: 85 })
        .select().single();
      if (eqErr) throw eqErr;
      for (let i = 0; i < chapterData.endQuizQuestions.length; i++) {
        const q = chapterData.endQuizQuestions[i];
        await supabaseClient.from("quiz_questions").insert({ quiz_id: endQuiz.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
      }
    }
    return new Response(JSON.stringify({ message: "Course seeded successfully", courseId: course.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
