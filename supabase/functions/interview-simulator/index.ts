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
    const { mode, scenarioId, count, questions, answers } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "generate_questions") {
      systemPrompt = `You are an expert technical interviewer specializing in Agile, Scrum, and SAFe roles. Generate interview questions for a ${scenarioId} role.

Return ONLY valid JSON with this structure:
{"questions": [{"id": 1, "question": "...", "category": "Experience|Leadership|Problem Solving|Agile Knowledge|Facilitation|Scaling", "difficulty": "easy|medium|hard"}]}

Generate ${count || 6} questions that mix behavioral (STAR-based) and technical scenarios. Make them realistic — the kind asked at Fortune 500 companies. Include at least one situational judgment question.`;
      userPrompt = `Generate ${count || 6} interview questions for a ${scenarioId.replace(/_/g, ' ')} position. Mix difficulties.`;
    } else if (mode === "score") {
      systemPrompt = `You are an expert interview evaluator for Agile/Scrum roles. Score the candidate's interview performance.

Return ONLY valid JSON:
{
  "overall": <0-100>,
  "agileKnowledge": <0-100>,
  "leadership": <0-100>,
  "communication": <0-100>,
  "problemSolving": <0-100>,
  "feedback": "<detailed markdown feedback with specific improvement advice>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"]
}

Evaluation criteria:
- Agile Knowledge: Correct use of Scrum/SAFe terminology, understanding of principles
- Leadership: Servant leadership, conflict resolution, team empowerment
- Communication: Clarity, structure (STAR method), conciseness
- Problem Solving: Creative solutions, root cause analysis, pragmatism

Be fair but rigorous. Real interview standards.`;

      const qaPairs = questions.map((q: string, i: number) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || '(no answer)'}`).join('\n\n');
      userPrompt = `Evaluate this ${scenarioId.replace(/_/g, ' ')} interview:\n\n${qaPairs}`;
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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
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
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1].trim();

    const parsed = JSON.parse(content);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("interview-simulator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
