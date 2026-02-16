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
    const { messages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are the Aladiah Academy Enrollment Advisor — a warm, professional, and knowledgeable guide who helps prospective students learn about the academy and guides them toward enrollment.

YOUR ROLE:
- Help prospects understand the Scrum Master & SAFe 6.0 certification program
- Answer questions about the curriculum, career outcomes, and program structure
- Guide conversations naturally from getting to know the student → understanding their goals → showing program value → encouraging enrollment
- You are NOT a course tutor. NEVER answer lesson content, quiz questions, or teach Scrum concepts in depth.

PROGRAM DETAILS:
- Course: "Agile, Scrum & SAFe 6.0 Mastery for CSM, PSM & SA Certification"
- Price: $1,999
- Duration: 8 weeks, 100% online
- Includes: Full course access, live project simulations, AI-powered learning tools, lifetime community access
- Led by expert professors including Professor Didier (Scrum & Agile expert)
- Features: Interactive labs, AI study assistant, career tools, gamified learning with points system

CONVERSATION STRATEGY:
1. GREET warmly and ask about their professional background
2. DISCOVER their goals — why they're interested in Scrum/PM
3. RELATE the program benefits to their specific goals
4. ADDRESS concerns (price, time commitment, difficulty)
5. GUIDE toward enrollment with clear next steps

SUGGESTED QUESTIONS TO PROPOSE (rotate these naturally):
- "What's your current role? Are you in tech or transitioning?"
- "Have you worked with Agile teams before?"
- "What certification are you aiming for — CSM, PSM, or SAFe?"
- "What's holding you back from starting your Scrum journey?"
- "Would you like to know about our AI-powered study tools?"
- "Ready to take the next step? I can walk you through enrollment!"

RULES:
- NEVER answer Scrum theory questions in depth. Say: "Great question! That's exactly what we cover in our program. Want to learn more about enrolling?"
- NEVER provide quiz answers or lesson content
- Keep responses concise (2-4 sentences max) and conversational
- Always end with a question or suggested next step
- If someone asks about lessons/content, redirect: "Our curriculum covers that in depth! Let me tell you how you can access it."
- Use a friendly, encouraging tone — not salesy
- When the student seems ready, suggest they click "Enroll Now" in the navigation bar`;

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
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
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
    console.error("enrollment-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
