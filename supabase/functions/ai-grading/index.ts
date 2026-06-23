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
    const { mode, submission, rubric, studentContext, language } = await req.json();
    const langLine = language === "fr"
      ? "\n\nIMPORTANT: Respond in French (Français). Keep any specified JSON keys, structure, and formatting exactly as instructed above; only human-readable text values should be translated."
      : language === "es"
      ? "\n\nIMPORTANT: Respond in Spanish (Español). Keep any specified JSON keys, structure, and formatting exactly as instructed above; only human-readable text values should be translated."
      : "";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";

    if (mode === "grade_project") {
      systemPrompt = `You are the Aladiah Academy AI Grading Engine. Evaluate student project submissions with rigorous, fair standards.

Rubric: ${JSON.stringify(rubric || {
  technicalAccuracy: { weight: 30, criteria: "Correct application of Scrum/Agile concepts" },
  leadershipThinking: { weight: 25, criteria: "Servant leadership, team empowerment decisions" },
  clarityOfExplanation: { weight: 20, criteria: "Clear, structured communication" },
  practicalApplication: { weight: 25, criteria: "Real-world applicability and actionability" },
})}

Student Level: ${studentContext?.difficulty || 'beginner'}

Return JSON:
{
  "overallScore": <0-100>,
  "categoryScores": {"technicalAccuracy": <0-100>, "leadershipThinking": <0-100>, "clarityOfExplanation": <0-100>, "practicalApplication": <0-100>},
  "grade": "A|B|C|D|F",
  "feedback": "<detailed markdown feedback>",
  "strengths": ["..."],
  "improvements": ["..."],
  "suggestedResources": ["..."]
}`;
    } else if (mode === "student_success_check") {
      systemPrompt = `You are the Aladiah Academy Student Success AI. Analyze student engagement data and determine if intervention is needed.

Student Data:
- Progress: ${studentContext?.courseProgress || 0}%
- Last Activity: ${studentContext?.lastActivity || 'unknown'}
- Quiz Trend: ${JSON.stringify(studentContext?.quizTrend || [])}
- Engagement Score: ${studentContext?.engagementScore || 50}/100
- Days Since Last Login: ${studentContext?.daysSinceLogin || 0}
- Consecutive Failures: ${studentContext?.consecutiveFailures || 0}

Return JSON:
{
  "riskLevel": "low|medium|high|critical",
  "shouldIntervene": true/false,
  "interventionType": "encouragement|study_plan|mentor_call|break_suggestion",
  "message": "<personalized message to the student>",
  "recommendedActions": ["..."],
  "estimatedDropoutRisk": <0-100>
}`;
    } else if (mode === "generate_marketing") {
      systemPrompt = `You are the Aladiah Academy Marketing AI. Generate professional marketing content for the academy.

Academy Info: Aladiah Academy offers AI-powered Scrum Master, SAFe 6.0, and Project Management certification programs. The academy features AI tutors, interview simulators, and hands-on simulations.

Content Type: ${studentContext?.contentType || 'linkedin_post'}

Return JSON:
{
  "content": "<the marketing content>",
  "hashtags": ["..."],
  "callToAction": "...",
  "targetAudience": "...",
  "suggestedImagePrompt": "..."
}`;
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
          { role: "system", content: systemPrompt + langLine },
          { role: "user", content: typeof submission === 'string' ? submission : JSON.stringify(submission || 'Analyze the student data provided in the system prompt.') },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let content = aiResponse.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1].trim();

    const parsed = JSON.parse(content);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-grading error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
