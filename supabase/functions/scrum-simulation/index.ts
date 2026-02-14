import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TEAM_MEMBERS = [
  { name: "Sean", role: "Product Owner", personality: "Business-focused, values ROI, asks tough questions about user value. Experienced but sometimes pushes for too much scope." },
  { name: "Sebastian", role: "QA Engineer", personality: "Detail-oriented, methodical, raises edge cases. Sometimes pessimistic about timelines but thorough." },
  { name: "Christo", role: "QA Engineer", personality: "Enthusiastic about automation testing, proactive, suggests testing strategies early." },
  { name: "Maya", role: "Senior Developer", personality: "Tech lead informally, experienced, gives solid estimates. Sometimes over-engineers solutions." },
  { name: "James", role: "Developer", personality: "Mid-level, reliable, asks good clarifying questions. Quiet but produces quality work." },
  { name: "Priya", role: "Developer", personality: "Junior but eager, sometimes underestimates tasks. Great at frontend work, learning backend." },
  { name: "Carlos", role: "Developer", personality: "Backend specialist, strong opinions on architecture. Can be resistant to change but usually right." },
  { name: "Aisha", role: "Business Analyst", personality: "Bridge between business and tech. Excellent at writing acceptance criteria. Sometimes adds too many requirements." },
];

// 10-day sprint schedule (Wed-Fri week1, Mon-Fri week2)
const SPRINT_SCHEDULE = [
  { day: 1, weekday: "Wednesday", ceremonies: ["sprint_planning"], description: "Sprint Planning Day - Define sprint goal, select backlog items, plan capacity" },
  { day: 2, weekday: "Thursday", ceremonies: ["daily_scrum"], description: "First development day - Team starts working on sprint items" },
  { day: 3, weekday: "Friday", ceremonies: ["daily_scrum", "backlog_refinement"], description: "Development continues + Backlog Refinement session" },
  { day: 4, weekday: "Monday", ceremonies: ["daily_scrum"], description: "Week 2 begins - Check progress and address blockers" },
  { day: 5, weekday: "Tuesday", ceremonies: ["daily_scrum"], description: "Mid-sprint - Monitor velocity and adjust if needed" },
  { day: 6, weekday: "Wednesday", ceremonies: ["daily_scrum", "backlog_refinement"], description: "Second Backlog Refinement + continued development" },
  { day: 7, weekday: "Thursday", ceremonies: ["daily_scrum"], description: "Development push - Ensure stories are on track for completion" },
  { day: 8, weekday: "Friday", ceremonies: ["daily_scrum"], description: "Final development push - Complete remaining work" },
  { day: 9, weekday: "Monday", ceremonies: ["daily_scrum", "sprint_review"], description: "Sprint Review - Demo completed work to stakeholders" },
  { day: 10, weekday: "Tuesday", ceremonies: ["sprint_retro"], description: "Sprint Retrospective - Reflect and improve" },
];

const SYSTEM_PROMPT = `You are simulating a realistic Scrum team in a 2-week sprint. The student is the Scrum Master.

TEAM MEMBERS:
${TEAM_MEMBERS.map(m => `- ${m.name} (${m.role}): ${m.personality}`).join('\n')}

PROJECT CONTEXT:
The team is building a Task Management Web Application for a mid-size company. The product backlog includes:
- User authentication and profiles
- Task creation with priority levels
- Kanban board view
- Sprint reporting dashboard
- Notification system
- Search and filter functionality
- Mobile responsive design
- API integrations with Slack and Jira

RULES:
1. Stay in character as team members. Each member speaks according to their personality.
2. Create realistic scenarios: blockers, scope creep, team disagreements, estimation debates.
3. The Scrum Master (student) must facilitate - don't do their job for them.
4. If the student makes a mistake (e.g., assigns tasks, makes technical decisions), have team members react realistically.
5. Include realistic Scrum artifacts: user stories, story points, sprint goals, burndown data.
6. Respond with JSON format: { "messages": [{ "speaker": "name", "content": "..." }], "actions_available": ["action1", "action2"] }
7. The actions_available should be contextual choices the Scrum Master can take.
8. Create challenges: a developer is sick on day 4, the PO wants to add scope mid-sprint, QA finds critical bugs, etc.

SCORING CRITERIA (evaluate the Scrum Master on):
- Facilitation (0-25): Did they run ceremonies properly? Time-boxed? Everyone participated?
- Communication (0-25): Clear, servant-leader approach? Removed impediments?
- Artifacts (0-25): Sprint goal defined? Burndown tracked? Backlog maintained?
- Decision Making (0-25): Made good calls on scope, priorities, team dynamics?

When asked to score a day, return JSON: { "score": { "facilitation": N, "communication": N, "artifact": N, "decision": N, "total": N, "feedback": "..." }, "messages": [...] }`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { action, simulation_id, day, message, ceremony } = await req.json();

    if (action === "start") {
      // Create new simulation
      const { data: sim, error } = await supabase
        .from("scrum_simulations")
        .insert({ user_id: user.id })
        .select()
        .single();
      if (error) throw error;

      // Generate opening scene
      const dayInfo = SPRINT_SCHEDULE[0];
      const openingPrompt = `It's ${dayInfo.weekday}, Day 1 of the sprint. The team has gathered for Sprint Planning. Introduce the scene and have team members greet the Scrum Master. Sean (PO) should present the prioritized backlog items. The team needs to define a sprint goal and select items for the sprint. Present 6-8 user stories from the product backlog with rough descriptions for the team to discuss and estimate. Make it feel real and interactive.`;

      const aiResponse = await callAI(openingPrompt, []);
      
      // Save the AI messages
      const parsed = parseAIResponse(aiResponse);
      for (const msg of parsed.messages) {
        await supabase.from("simulation_messages").insert({
          simulation_id: sim.id,
          day: 1,
          role: "team_member",
          speaker: msg.speaker,
          content: msg.content,
          ceremony: "sprint_planning",
        });
      }

      return json({ simulation: sim, day: dayInfo, ...parsed });
    }

    if (action === "message") {
      // Save user message
      await supabase.from("simulation_messages").insert({
        simulation_id,
        day,
        role: "user",
        speaker: "Scrum Master (You)",
        content: message,
        ceremony,
      });

      // Get conversation history for context
      const { data: history } = await supabase
        .from("simulation_messages")
        .select("*")
        .eq("simulation_id", simulation_id)
        .eq("day", day)
        .order("created_at", { ascending: true })
        .limit(30);

      const dayInfo = SPRINT_SCHEDULE[day - 1];
      const contextPrompt = `Current day: Day ${day} (${dayInfo.weekday}) - ${dayInfo.description}
Current ceremony: ${ceremony || dayInfo.ceremonies[0]}
The Scrum Master says: "${message}"

Respond in character as the relevant team members. Be realistic and create engaging interactions.`;

      const conversationHistory = (history || []).map(h => ({
        role: h.role === "user" ? "user" as const : "assistant" as const,
        content: h.role === "user" ? h.content : `[${h.speaker}]: ${h.content}`,
      }));

      const aiResponse = await callAI(contextPrompt, conversationHistory);
      const parsed = parseAIResponse(aiResponse);

      for (const msg of parsed.messages) {
        await supabase.from("simulation_messages").insert({
          simulation_id,
          day,
          role: "team_member",
          speaker: msg.speaker,
          content: msg.content,
          ceremony: ceremony || dayInfo.ceremonies[0],
        });
      }

      return json(parsed);
    }

    if (action === "end_day") {
      // Get all messages for the day
      const { data: dayMessages } = await supabase
        .from("simulation_messages")
        .select("*")
        .eq("simulation_id", simulation_id)
        .eq("day", day)
        .order("created_at", { ascending: true });

      const dayInfo = SPRINT_SCHEDULE[day - 1];
      const scorePrompt = `The day is ending. Day ${day} (${dayInfo.weekday}) - ${dayInfo.description}.
Review the Scrum Master's performance today and provide a score. Here's what happened:

${(dayMessages || []).map(m => `[${m.speaker || m.role}]: ${m.content}`).join('\n')}

Score this day's Scrum Master performance and provide specific, actionable feedback. Return the score JSON.`;

      const aiResponse = await callAI(scorePrompt, []);
      const parsed = parseAIResponse(aiResponse);

      if (parsed.score) {
        await supabase.from("simulation_scores").insert({
          simulation_id,
          day,
          facilitation_score: parsed.score.facilitation,
          communication_score: parsed.score.communication,
          artifact_score: parsed.score.artifact,
          decision_score: parsed.score.decision,
          total_score: parsed.score.total,
          feedback: parsed.score.feedback,
        });

        // Advance to next day
        const nextDay = day + 1;
        if (nextDay <= 10) {
          await supabase.from("scrum_simulations")
            .update({ current_day: nextDay })
            .eq("id", simulation_id);
        } else {
          await supabase.from("scrum_simulations")
            .update({ status: "completed", completed_at: new Date().toISOString() })
            .eq("id", simulation_id);
        }
      }

      return json(parsed);
    }

    if (action === "start_day") {
      const dayInfo = SPRINT_SCHEDULE[day - 1];
      const prompt = `It's ${dayInfo.weekday}, Day ${day} of the sprint. ${dayInfo.description}.
Ceremonies today: ${dayInfo.ceremonies.join(', ')}.
${day === 4 ? 'IMPORTANT: James called in sick today. The team needs to handle this.' : ''}
${day === 5 ? 'IMPORTANT: Sean (PO) approaches the team wanting to add a new urgent feature mid-sprint.' : ''}
${day === 8 ? 'IMPORTANT: Sebastian found a critical security bug in the authentication module.' : ''}
Set the scene and have team members start the day naturally. If there is a Daily Scrum, team members should give their updates (what they did yesterday, what they plan to do today, any blockers).`;

      const aiResponse = await callAI(prompt, []);
      const parsed = parseAIResponse(aiResponse);

      for (const msg of parsed.messages) {
        await supabase.from("simulation_messages").insert({
          simulation_id,
          day,
          role: "team_member",
          speaker: msg.speaker,
          content: msg.content,
          ceremony: dayInfo.ceremonies[0],
        });
      }

      return json({ day: dayInfo, ...parsed });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("Simulation error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

async function callAI(prompt: string, history: { role: "user" | "assistant"; content: string }[]) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("AI not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("AI error:", response.status, text);
    if (response.status === 429) throw new Error("Rate limited - please wait a moment");
    if (response.status === 402) throw new Error("AI credits exhausted");
    throw new Error("AI service error");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function parseAIResponse(content: string): { messages: { speaker: string; content: string }[]; actions_available?: string[]; score?: any } {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        messages: parsed.messages || [{ speaker: "Narrator", content }],
        actions_available: parsed.actions_available,
        score: parsed.score,
      };
    }
  } catch {
    // If JSON parsing fails, wrap as narrator message
  }
  return { messages: [{ speaker: "Narrator", content }] };
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
