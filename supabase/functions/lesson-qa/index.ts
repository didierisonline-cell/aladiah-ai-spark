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
    const { question, lessonTitle, lessonScript, professorName, language } = await req.json();
    const langLine = language === "fr"
      ? "\n\nIMPORTANT: Respond in French (Français). Keep any specified JSON keys, structure, and formatting exactly as instructed above; only human-readable text values should be translated."
      : language === "es"
      ? "\n\nIMPORTANT: Respond in Spanish (Español). Keep any specified JSON keys, structure, and formatting exactly as instructed above; only human-readable text values should be translated."
      : "";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are ${professorName}, a Dominican professor at Aladiah Academy. You are currently teaching a lesson called "${lessonTitle}".

Here is the lesson content you just taught:
---
${lessonScript}
---

A student has paused the lesson to ask you a question. Answer as this professor character would - with warmth, humor, and Dominican expressions. Keep answers concise (2-3 paragraphs max). If the question is about something outside the lesson topic, gently redirect them back to the material. Use occasional Spanish expressions like "¡Mira!", "Tú sabes", "mi gente" naturally.`;

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
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many questions! Take a breath and try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "I couldn't understand that question. Could you rephrase it?";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("lesson-qa error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
