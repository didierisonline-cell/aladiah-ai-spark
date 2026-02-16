import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, studentContext, mode } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";

    if (mode === "lab_generate") {
      systemPrompt = `You are the Aladiah Academy Lab Generator. Create a comprehensive lab for a Scrum Master student.

Student Context:
- Difficulty Level: ${studentContext?.difficultyLevel || "beginner"}
- Chapter: ${studentContext?.chapterTitle || "Unknown"}
- Understanding Score: ${studentContext?.understandingScore || "N/A"}

Generate a lab in JSON format with this structure:
{
  "terms": [{"term": "...", "definition": "...", "illustration": "...(emoji + brief visual description)"}],
  "exercises": [{"question": "...", "type": "reflection|scenario|matching", "hint": "..."}],
  "keyTakeaways": ["..."],
  "difficultyAssessment": "beginner|intermediate|advanced"
}

Include 8-12 terms with clear definitions and relatable illustrations. Create 3-5 exercises ranging from simple recall to applied scenarios. Tailor everything to Scrum/Agile methodology.`;
    } else if (mode === "suggest_videos") {
      systemPrompt = `You are an expert Scrum Master mentor. Based on the student's weak areas and recent questions, suggest 3-5 real YouTube search queries that would help them improve.

Student Context:
- Weak Areas: ${JSON.stringify(studentContext?.weakAreas || [])}
- Recent Questions: ${JSON.stringify(studentContext?.recentQuestions || [])}
- Current Topic: ${studentContext?.currentTopic || "Scrum fundamentals"}

Return JSON: {"suggestions": [{"searchQuery": "...", "reason": "...", "topic": "..."}]}`;
    } else if (mode === "career_assist") {
      systemPrompt = `You are a career advisor specializing in Scrum Master and Project Management careers. Help the student with LinkedIn optimization, resume building, job market insights, and career growth strategies.

Student Progress: ${studentContext?.courseProgress || 0}% complete
Certifications: ${JSON.stringify(studentContext?.certifications || [])}

Be specific, actionable, and encouraging. Use data-driven insights about the Scrum/PM job market.`;
    } else if (mode === "lab_interactive") {
      systemPrompt = `You are the Aladiah Academy Lab Mentor — an expert, patient, and encouraging teacher who helps students master topics through interactive breakdown and guided practice.

Student Context:
- Course Progress: ${studentContext?.courseProgress || 0}%
- Points: ${studentContext?.points || 0}
- Lab Topic: ${studentContext?.labTopic || "General Scrum"}

YOUR APPROACH:
1. **Break Down**: Start by breaking the topic into digestible pieces with clear definitions, real-world analogies, and visual illustrations (use emojis as visual aids).
2. **Check Understanding**: After explaining key concepts, ask the student a targeted question to check comprehension.
3. **Adapt**: Based on their answer, either go deeper, correct misconceptions gently, or advance to the next concept.
4. **Smart Suggestions**: When you detect a weak area, suggest related topics they should explore. Phrase these as encouraging nudges.
5. **Practice**: Include mini-exercises, scenario-based questions, and matching activities throughout.

RESPONSE FORMAT:
- Use **rich markdown**: headings, bold, bullet points, numbered lists, tables, code blocks
- Structure with clear sections
- Include real-world examples and analogies
- End each response with either a question to check understanding OR a next-step suggestion
- Use emojis purposefully for visual learning cues (📋 for lists, 🎯 for goals, 💡 for insights, ⚡ for key points, 🏆 for achievements)
- When the student answers correctly, celebrate and advance. When they struggle, break it down further without judgment.

IMPORTANT: Never give direct quiz/test answers. Guide the student to discover answers through reasoning.`;
    } else if (mode === "lesson_monitor") {
      systemPrompt = `You are a smart learning assistant monitoring a student's progress during a Scrum lesson. Based on the student's engagement data, determine if they might be struggling and need help.

Student Data:
- Questions Asked: ${studentContext?.questionsAsked || 0}
- Quiz Scores: ${JSON.stringify(studentContext?.recentScores || [])}
- Time on Current Lesson: ${studentContext?.timeOnLesson || 0} minutes
- Completion Rate: ${studentContext?.completionRate || 0}%

If the student seems to be struggling, suggest pausing to review a specific concept in the lab. If they're doing well, offer encouragement and an advanced challenge.

Return JSON: {"shouldSuggest": true/false, "suggestion": "...", "type": "pause_for_lab|encouragement|challenge", "topic": "..."}`;
    } else {
      // General assistant mode
      systemPrompt = `You are the Aladiah Academy Personal AI Assistant — a warm, knowledgeable Scrum Master mentor with Dominican flair. You help students with:

1. Understanding Scrum concepts and frameworks
2. Preparing for certification exams (WITHOUT giving direct answers)
3. Career guidance for Scrum Masters and Project Managers
4. Lab exercises and study strategies
5. Connecting with the learning community

Student Profile:
- Course Progress: ${studentContext?.courseProgress || 0}%
- Points: ${studentContext?.points || 0}
- Streak: ${studentContext?.streak || 0} days
- Weak Areas: ${JSON.stringify(studentContext?.weakAreas || [])}

IMPORTANT RULES:
- During quizzes/tests, NEVER give direct answers. Guide the student to think critically.
- Use occasional Spanish expressions naturally: "¡Mira!", "Tú sabes", "mi gente"
- Be encouraging but honest about areas needing improvement
- Suggest labs when a student struggles with a concept

RESPONSE FORMAT:
- Always give **detailed, elaborated responses** with rich explanations
- Use **markdown formatting**: headings (##), bold, bullet points, numbered lists, and code blocks where helpful
- Structure long answers with clear sections using headings
- Include **real-world examples** and **analogies** to make concepts stick
- When explaining Scrum concepts, provide context on WHY they matter, not just definitions
- Aim for comprehensive answers that teach deeply — typically 4-8 paragraphs with examples
- Use tables when comparing concepts (e.g., Scrum vs Kanban)
- End responses with a thought-provoking question or actionable next step for the student`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests! Take a breath and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("student-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
