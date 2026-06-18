import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/adminGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const courseData = {
  title: "AI Governance Professional",
  description: "Design AI governance frameworks, implement the EU AI Act, manage organizational AI risk, and build the policies and committees that ensure responsible AI deployment at enterprise scale.",
  chapters: [
    {
      title: "Module 1: AI Governance Fundamentals",
      description: "Understand the AI governance landscape, regulatory environment, and why governance is the fastest-growing AI specialization.",
      order_index: 0,
      videos: [
        {
          title: "1.1 Why AI Governance Is Now a C-Suite Priority",
          description: "The business case for AI governance: risk, regulation, trust, and competitive advantage.",
          order_index: 0,
          lessonScript: {
            mainPoints: [
              "AI governance emerged as a C-suite priority because AI failures have direct, material business consequences. Amazon's hiring algorithm systematically discriminated against women. Apple's credit card algorithm gave men higher credit limits than women with identical financial profiles. Uber's surge pricing algorithms disproportionately affected lower-income neighborhoods. Healthcare AI systems showed racial bias in risk scoring. These failures created regulatory liability, reputational damage, and destroyed shareholder value.",
              "The EU AI Act \u2014 the world's first comprehensive AI regulatory framework \u2014 came into force in August 2024. It classifies AI systems by risk level: unacceptable risk (banned entirely \u2014 social scoring, real-time biometric surveillance), high-risk (regulated with strict requirements \u2014 credit scoring, hiring, healthcare, education, law enforcement), limited risk (transparency obligations), and minimal risk (no regulation). Non-compliance penalties reach \u20ac35 million or 7% of global annual turnover \u2014 dwarfing GDPR penalties.",
              "Beyond regulation, AI governance creates competitive advantage. Organizations with mature governance can deploy AI to sensitive use cases \u2014 healthcare, finance, hiring \u2014 that ungoverned organizations cannot. Customer trust in AI systems increases with transparency and accountability. Institutional investors increasingly require ESG-aligned AI practices. Governments and enterprise buyers prefer vendors with certified AI governance programs.",
              "The AI governance professional role sits at the intersection of law, ethics, technology, and business strategy. You need to understand how AI systems work technically, what regulations require legally, how to design governance structures organizationally, and how to communicate risk to executives and boards. This rare combination commands premium compensation \u2014 $120K-$170K+ \u2014 and the demand vastly exceeds supply.",
              "Mature AI governance programs have four components: governance structures (committees, roles, accountability frameworks), risk management (identification, assessment, mitigation, monitoring), policy and standards (acceptable use, development standards, deployment requirements), and monitoring and audit (continuous oversight of deployed AI systems). Building these four components systematically is the core competency of an AI Governance Professional."
            ]
          },
          questions: [            {
              question_text: "Under the EU AI Act, which category of AI system faces the highest compliance burden?",
              scenario_context: "You're classifying an employee performance monitoring AI for a multinational.",
              options: ["Minimal risk systems", "High-risk AI systems in sensitive domains like employment, credit, healthcare \u2014 requiring risk management, documentation, human oversight, and accuracy standards", "Limited risk systems with transparency obligations", "General-purpose AI models"],
              correct_answer_index: 1,
              explanation: "High-risk AI systems (Annex III) must comply with the full EU AI Act requirements: risk management system, data governance, technical documentation, record-keeping, user transparency, human oversight mechanisms, and accuracy/robustness standards."
            },
            {
              question_text: "What is the maximum fine for violating the EU AI Act's prohibitions on unacceptable-risk AI?",
              scenario_context: "The board asks about liability exposure from the AI Act.",
              options: ["\u20ac1 million", "\u20ac35 million or 7% of global annual worldwide turnover, whichever is higher", "\u20ac10 million", "Criminal prosecution only"],
              correct_answer_index: 1,
              explanation: "The EU AI Act's enforcement tier: prohibited AI violations = up to \u20ac35M or 7% global turnover. High-risk compliance failures = up to \u20ac15M or 3%. Providing incorrect information = up to \u20ac7.5M or 1%."
            },
            {
              question_text: "Why does the EU AI Act apply to US companies with no EU presence?",
              scenario_context: "A US-based HR software company asks if the EU AI Act affects them.",
              options: ["It doesn't \u2014 only EU companies must comply", "Extraterritorial reach: the Act applies to any AI affecting EU persons regardless of deployer location \u2014 similar to GDPR's extraterritorial scope", "Only if the company has EU offices", "Only for AI systems hosted in EU data centers"],
              correct_answer_index: 1,
              explanation: "Like GDPR, the EU AI Act has extraterritorial reach \u2014 any organization deploying AI that processes data of or makes decisions about EU residents must comply, regardless of where the organization is headquartered."
            },
            {
              question_text: "What new obligations does the EU AI Act impose on providers of general-purpose AI models with systemic risk?",
              scenario_context: "You're advising an AI company deploying a GPT-4 equivalent model.",
              options: ["No additional requirements beyond standard GPAI rules", "Adversarial testing (red-teaming), incident reporting to the EU AI Office, cybersecurity measures, and energy efficiency reporting", "Only documentation requirements", "Only copyright compliance"],
              correct_answer_index: 1,
              explanation: "GPAI models with systemic risk (assessed by training compute threshold: >10^25 FLOPs) face enhanced obligations including mandatory adversarial testing, incident and serious incident reporting, and cybersecurity measures proportionate to systemic risk."
            }]
        },
        {
          title: "1.2 The EU AI Act: What Every AI Organization Must Know",
          description: "Comprehensive breakdown of the EU AI Act \u2014 the world's first AI law \u2014 and its operational requirements.",
          order_index: 1,
          lessonScript: {
            mainPoints: [
              "The EU AI Act takes a risk-based regulatory approach. Risk is determined by the AI system's intended purpose and context, not its technical architecture. The same computer vision system could be minimal risk (photo filter) or high risk (biometric identification for law enforcement). Context-dependence requires organizations to classify each AI system individually and document the classification rationale.",
              "High-risk AI systems (Annex III) face the most stringent requirements. These include AI used in: critical infrastructure, education, employment and HR, essential services (credit scoring, insurance), law enforcement, migration and asylum, justice administration, and democratic processes. Requirements: risk management system, data governance practices, technical documentation, record-keeping, transparency to users, human oversight mechanisms, accuracy and robustness, and cybersecurity measures.",
              "The conformity assessment process varies by risk category. Most high-risk AI uses self-assessment \u2014 the provider conducts their own conformity assessment against harmonized standards and retains documentation. For certain high-risk categories (biometric identification, real-time surveillance), third-party conformity assessment by a notified body is required. The EU database will publicly register all high-risk AI systems deployed in the EU.",
              "Foundation model providers face new obligations under the AI Act's GPAI (General Purpose AI) rules. Providers must maintain technical documentation, comply with copyright law, publish summaries of training data, and implement policies to prevent illegal content generation. Providers of GPAI models with systemic risk (GPT-4 scale) face additional requirements: adversarial testing, incident reporting to the EU AI Office, and cybersecurity protections.",
              "Extraterritorial reach means the AI Act applies to any organization deploying AI that affects people in the EU \u2014 regardless of where the deployer is located. A US fintech deploying credit scoring for EU customers must comply. A Singapore healthcare company deploying diagnostics for EU patients must comply. This mirrors GDPR's approach and means global organizations need EU AI Act compliance programs regardless of headquarters location."
            ]
          },
          questions: [            {
              question_text: "Under the EU AI Act, which category of AI system faces the highest compliance burden?",
              scenario_context: "You're classifying an employee performance monitoring AI for a multinational.",
              options: ["Minimal risk systems", "High-risk AI systems in sensitive domains like employment, credit, healthcare \u2014 requiring risk management, documentation, human oversight, and accuracy standards", "Limited risk systems with transparency obligations", "General-purpose AI models"],
              correct_answer_index: 1,
              explanation: "High-risk AI systems (Annex III) must comply with the full EU AI Act requirements: risk management system, data governance, technical documentation, record-keeping, user transparency, human oversight mechanisms, and accuracy/robustness standards."
            },
            {
              question_text: "What is the maximum fine for violating the EU AI Act's prohibitions on unacceptable-risk AI?",
              scenario_context: "The board asks about liability exposure from the AI Act.",
              options: ["\u20ac1 million", "\u20ac35 million or 7% of global annual worldwide turnover, whichever is higher", "\u20ac10 million", "Criminal prosecution only"],
              correct_answer_index: 1,
              explanation: "The EU AI Act's enforcement tier: prohibited AI violations = up to \u20ac35M or 7% global turnover. High-risk compliance failures = up to \u20ac15M or 3%. Providing incorrect information = up to \u20ac7.5M or 1%."
            },
            {
              question_text: "Why does the EU AI Act apply to US companies with no EU presence?",
              scenario_context: "A US-based HR software company asks if the EU AI Act affects them.",
              options: ["It doesn't \u2014 only EU companies must comply", "Extraterritorial reach: the Act applies to any AI affecting EU persons regardless of deployer location \u2014 similar to GDPR's extraterritorial scope", "Only if the company has EU offices", "Only for AI systems hosted in EU data centers"],
              correct_answer_index: 1,
              explanation: "Like GDPR, the EU AI Act has extraterritorial reach \u2014 any organization deploying AI that processes data of or makes decisions about EU residents must comply, regardless of where the organization is headquartered."
            },
            {
              question_text: "What new obligations does the EU AI Act impose on providers of general-purpose AI models with systemic risk?",
              scenario_context: "You're advising an AI company deploying a GPT-4 equivalent model.",
              options: ["No additional requirements beyond standard GPAI rules", "Adversarial testing (red-teaming), incident reporting to the EU AI Office, cybersecurity measures, and energy efficiency reporting", "Only documentation requirements", "Only copyright compliance"],
              correct_answer_index: 1,
              explanation: "GPAI models with systemic risk (assessed by training compute threshold: >10^25 FLOPs) face enhanced obligations including mandatory adversarial testing, incident and serious incident reporting, and cybersecurity measures proportionate to systemic risk."
            }]
        }
      ],
      endQuizQuestions: [            {
              question_text: "Your company deploys an AI hiring tool that screens 50,000 resumes/year for EU-based roles. What EU AI Act obligations apply?",
              scenario_context: "Compliance team needs a clear requirements list.",
              options: ["No obligations \u2014 AI is just a tool", "High-risk AI (employment category): implement risk management system, ensure data governance, create technical documentation, enable human oversight of decisions, inform applicants, register in EU AI Act database", "Only transparency obligations", "Only if the tool makes final hiring decisions"],
              correct_answer_index: 1,
              explanation: "AI used in hiring is explicitly listed in Annex III as high-risk. All high-risk requirements apply: risk management system, data governance, technical documentation, transparency to candidates, human review capability, and EU database registration."
            },
            {
              question_text: "A healthcare AI system in your portfolio achieves 95% diagnostic accuracy overall but 82% accuracy on patients from minority ethnic groups. Under EU AI Act and general AI governance principles, what is required?",
              scenario_context: "Your AI audit found disparate performance across demographic groups.",
              options: ["Accept the disparity \u2014 82% is still good performance", "Document the performance disparity, assess if it constitutes unacceptable bias under AI Act accuracy requirements, implement mitigations (additional training data, fairness constraints), and monitor ongoing performance by demographic group", "Deploy only to majority demographic groups", "Reduce the overall accuracy target to match minority performance"],
              correct_answer_index: 1,
              explanation: "EU AI Act requires high-risk AI to be accurate and robust across intended uses. Demographic performance disparities must be documented, assessed for acceptability, mitigated where possible, and monitored continuously. Unexplained disparities may constitute discriminatory AI under EU non-discrimination law."
            }]
    }
  ]
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
    const _denied = await requireAdmin(req);
    if (_denied) return _denied;
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
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
