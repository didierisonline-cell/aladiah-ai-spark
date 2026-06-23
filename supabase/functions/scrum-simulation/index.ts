import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TEAM_MEMBERS = [
  { name: "Sean", role: "Product Owner", personality: "Business-focused, values ROI, asks tough questions about user value. Experienced but sometimes pushes for too much scope. Presents prioritized backlog and sprint goals." },
  { name: "Aisha", role: "Business Analyst", personality: "Bridge between business and tech. Excellent at writing acceptance criteria. Sometimes adds too many requirements. Partners with PO on backlog." },
  { name: "Maya", role: "Cloud Engineer", personality: "AWS infrastructure expert. Handles VPC, IAM, networking. Gives solid estimates but sometimes over-engineers solutions." },
  { name: "Carlos", role: "DevOps Engineer", personality: "CI/CD pipeline specialist. Strong opinions on automation and deployment strategies. Manages Terraform and infrastructure-as-code." },
  { name: "James", role: "Backend Developer", personality: "Mid-level, reliable. Works on authentication service migration. Asks good clarifying questions. Quiet but produces quality work." },
  { name: "Priya", role: "Security Engineer", personality: "IAM policies, security reviews, compliance. Sometimes cautious about timelines but ensures nothing ships without proper security validation." },
  { name: "Sebastian", role: "QA Engineer", personality: "Detail-oriented, methodical, raises edge cases. Runs regression testing, validates deployments. Sometimes pessimistic about timelines but thorough." },
];

const BACKLOG_STORIES = [
  { id: "NEB-101", title: "Provision AWS VPC with private/public subnets", points: 8, epic: "Infrastructure", priority: "Critical", assignee: "Maya" },
  { id: "NEB-102", title: "Configure IAM roles and policies for migration", points: 5, epic: "Security", priority: "Critical", assignee: "Priya" },
  { id: "NEB-103", title: "Set up CI/CD pipeline with CodePipeline", points: 8, epic: "DevOps", priority: "High", assignee: "Carlos" },
  { id: "NEB-104", title: "Migrate Authentication Service to AWS ECS", points: 13, epic: "Migration", priority: "Critical", assignee: "James" },
  { id: "NEB-105", title: "Configure CloudWatch monitoring & alerts", points: 5, epic: "Observability", priority: "High", assignee: "Carlos" },
  { id: "NEB-106", title: "Security scan and penetration testing", points: 8, epic: "Security", priority: "High", assignee: "Priya" },
  { id: "NEB-107", title: "Set up AWS WAF and Shield for DDoS protection", points: 5, epic: "Security", priority: "Medium", assignee: "Maya" },
  { id: "NEB-108", title: "Database migration plan for RDS PostgreSQL", points: 8, epic: "Migration", priority: "High", assignee: "James" },
  { id: "NEB-109", title: "Load testing and performance benchmarking", points: 5, epic: "QA", priority: "Medium", assignee: "Sebastian" },
  { id: "NEB-110", title: "Disaster recovery and failover configuration", points: 8, epic: "Infrastructure", priority: "Medium", assignee: "Maya" },
  { id: "NEB-111", title: "Write acceptance criteria for auth migration", points: 3, epic: "Analysis", priority: "High", assignee: "Aisha" },
  { id: "NEB-112", title: "Network peering and firewall rules", points: 5, epic: "Infrastructure", priority: "Critical", assignee: "Maya" },
];

// 10-day sprint: W1 Wed-Fri, W2 Mon-Fri
const SPRINT_SCHEDULE = [
  { day: 1, weekday: "Wednesday", ceremonies: ["sprint_planning"], description: "Sprint Planning — Define sprint goal, select backlog items, plan capacity. NO Daily StandUp today." },
  { day: 2, weekday: "Thursday", ceremonies: ["daily_standup"], description: "Daily StandUp (15 min) FIRST → then development begins. Scrum of Scrums at midday." },
  { day: 3, weekday: "Friday", ceremonies: ["daily_standup", "backlog_refinement"], description: "Daily StandUp FIRST → Development + Backlog Refinement session. Sprint health check." },
  { day: 4, weekday: "Monday", ceremonies: ["daily_standup"], description: "Week 2 — Daily StandUp FIRST → Scrum of Scrums. Check progress and blockers." },
  { day: 5, weekday: "Tuesday", ceremonies: ["daily_standup"], description: "Daily StandUp FIRST → Mid-sprint. Monitor velocity. Board audit." },
  { day: 6, weekday: "Wednesday", ceremonies: ["daily_standup", "backlog_refinement"], description: "Daily StandUp FIRST → 2nd Backlog Refinement + Pre-Demo Review." },
  { day: 7, weekday: "Thursday", ceremonies: ["daily_standup"], description: "Daily StandUp FIRST → Stabilization mode. No large stories started. Bug fixes, regression, docs." },
  { day: 8, weekday: "Friday", ceremonies: ["daily_standup", "sprint_review", "retrospective"], description: "Daily StandUp FIRST → Sprint Review demo → Retrospective → Sprint Close." },
];

const SYSTEM_PROMPT = `You are simulating a realistic enterprise Scrum team executing a 2-week sprint for an AWS cloud migration program called "Project Nebula". The student is the Scrum Master.

PROJECT CONTEXT:
A mid-size enterprise is migrating its legacy Customer Identity Platform from on-premises to AWS. This sprint focuses on provisioning secure infrastructure and migrating the Authentication Service. The program is already underway — teams are executing successive migration waves. Nothing starts from zero.

SPRINT GOAL:
"Provision secure AWS infrastructure components and migrate the Authentication Service while validating deployment automation, monitoring, and security controls."

TEAM MEMBERS (7 total):
${TEAM_MEMBERS.map(m => `- ${m.name} (${m.role}): ${m.personality}`).join('\n')}

SPRINT BACKLOG:
${BACKLOG_STORIES.map(s => `- ${s.id}: ${s.title} (${s.points} pts, ${s.priority}, ${s.epic}, assigned: ${s.assignee})`).join('\n')}

DEFINITION OF DONE:
✔ Deployed successfully in AWS ✔ Security validated ✔ QA passed ✔ CI/CD integrated ✔ Monitoring active ✔ Acceptance criteria met ✔ Linked to epic ✔ Documentation updated

JIRA BOARD COLUMNS: Backlog → Ready → In Progress → Code Review → QA → Ready for Release → Done

OPERATING LAW: Daily StandUp is ALWAYS the first meeting of the day (15 min), EXCEPT Sprint Planning Wednesday (Day 1).

RULES:
1. Stay in character. Each member speaks according to their personality and role.
2. Create realistic enterprise scenarios: blockers from other teams, scope creep from PO, security review delays, infrastructure dependencies, network peering issues, IAM approval delays.
3. The Scrum Master (student) must facilitate — don't do their job for them.
4. If the student makes a mistake (assigns tasks, makes technical decisions, skips ceremonies), have team members react realistically.
5. Include realistic Scrum artifacts: story points, sprint goals, burndown data, velocity.
6. Respond with JSON format: { "messages": [{ "speaker": "name", "content": "..." }], "actions_available": ["action1", "action2"], "board_updates": [{ "story_id": "NEB-101", "from": "In Progress", "to": "Code Review" }], "emails": [{ "from": "name", "subject": "...", "body": "...", "priority": "high|normal|low" }], "risks": [{ "risk": "...", "impact": "High|Medium|Low", "owner": "...", "mitigation": "..." }] }
7. The actions_available should be contextual choices the Scrum Master can take.
8. board_updates, emails, and risks are optional — include them when contextually appropriate.
9. Create challenges: ${getEventForDay()}

SCORING CRITERIA (evaluate the Scrum Master on):
- Facilitation (0-25): Did they run ceremonies properly? Time-boxed? Everyone participated?
- Communication (0-25): Clear, servant-leader approach? Removed impediments? Stakeholder communication?
- Artifacts (0-25): Sprint goal defined? Board maintained? Backlog clean? Risks visible?
- Decision Making (0-25): Made good calls on scope, priorities, team dynamics? Escalated appropriately?

When asked to score a day, return JSON: { "score": { "facilitation": N, "communication": N, "artifact": N, "decision": N, "total": N, "feedback": "..." }, "messages": [...], "executive_report": { "health": "green|yellow|red", "summary": "...", "risks": "...", "next_focus": "..." } }`;

function getEventForDay() {
  return `Day 2: CTO sends urgent email about IAM policy gaps from security audit. Maya hits AWS service quota limit blocking VPC work. Day 3: CI/CD pipeline failures blocking deployments. AWS support reports VPC peering route propagation delay. Day 4: James is out sick — auth migration at risk. Program Manager moves VP demo to Day 6. QA test environment is unstable. Day 5: Sean (PO) wants to add urgent PKCE compliance requirement mid-sprint — scope creep. Priya finds 3 critical security vulnerabilities. Day 6: Mid-sprint VP demo — team must present progress. AWS architect provides architecture review feedback. Day 7: Sebastian finds critical session hijacking vulnerability in auth module. Deployment rollback drill reveals DNS propagation issues. Day 8: Sprint Review and Retrospective — final presentations and team reflection.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return json(null, 204);

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

    const { action, simulation_id, day, message, ceremony, language } = await req.json();
    const langLine = language === "fr"
      ? "\n\nIMPORTANT: Respond in French (Français). Keep any specified JSON keys, structure, and formatting exactly as instructed above; only human-readable text values should be translated."
      : language === "es"
      ? "\n\nIMPORTANT: Respond in Spanish (Español). Keep any specified JSON keys, structure, and formatting exactly as instructed above; only human-readable text values should be translated."
      : "";

    if (action === "start") {
      const { data: sim, error } = await supabase
        .from("scrum_simulations")
        .insert({ user_id: user.id })
        .select()
        .single();
      if (error) throw error;

      const dayInfo = SPRINT_SCHEDULE[0];
      const openingPrompt = `It's ${dayInfo.weekday}, Day 1 of the sprint. The team has gathered for Sprint Planning in the conference room. This is a continuation from the previous sprint — the AWS migration program is already underway.

Sean (PO) should present the sprint goal and the prioritized backlog. The team needs to discuss capacity, estimate stories, identify dependencies, and commit to the sprint. Present the stories from the backlog for discussion.

Also generate:
- An initial set of emails (e.g., welcome email from Program Manager, infrastructure readiness update)
- Initial risk items the team should be aware of
- Initial board state (all stories in Backlog or Ready)

Make it feel like a real enterprise Sprint Planning session.`;

      const aiResponse = await callAI(openingPrompt, [], langLine);
      const parsed = parseAIResponse(aiResponse);

      for (const msg of parsed.messages) {
        await supabase.from("simulation_messages").insert({
          simulation_id: sim.id, day: 1, role: "team_member",
          speaker: msg.speaker, content: msg.content, ceremony: "sprint_planning",
        });
      }

      return json({ simulation: sim, day: dayInfo, ...parsed, backlog: BACKLOG_STORIES });
    }

    if (action === "message") {
      await supabase.from("simulation_messages").insert({
        simulation_id, day, role: "user",
        speaker: "Scrum Master (You)", content: message, ceremony,
      });

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

Respond in character as the relevant team members. Be realistic. Include board_updates if stories move, emails if stakeholders communicate, risks if new ones emerge.`;

      const conversationHistory = (history || []).map(h => ({
        role: h.role === "user" ? "user" as const : "assistant" as const,
        content: h.role === "user" ? h.content : `[${h.speaker}]: ${h.content}`,
      }));

      const aiResponse = await callAI(contextPrompt, conversationHistory, langLine);
      const parsed = parseAIResponse(aiResponse);

      for (const msg of parsed.messages) {
        await supabase.from("simulation_messages").insert({
          simulation_id, day, role: "team_member",
          speaker: msg.speaker, content: msg.content,
          ceremony: ceremony || dayInfo.ceremonies[0],
        });
      }

      return json(parsed);
    }

    if (action === "end_day") {
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

Score this day's Scrum Master performance. Also generate an executive_report with health status, summary, risks, and next_focus. Return the score JSON and a daily risk broadcast.`;

      const aiResponse = await callAI(scorePrompt, [], langLine);
      const parsed = parseAIResponse(aiResponse);

      if (parsed.score) {
        await supabase.from("simulation_scores").insert({
          simulation_id, day,
          facilitation_score: parsed.score.facilitation,
          communication_score: parsed.score.communication,
          artifact_score: parsed.score.artifact,
          decision_score: parsed.score.decision,
          total_score: parsed.score.total,
          feedback: parsed.score.feedback,
        });

        const nextDay = day + 1;
        if (nextDay <= 8) {
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
${day === 4 ? 'CRITICAL EVENT: James (Backend Developer) called in sick today. The authentication migration work is at risk.' : ''}
${day === 5 ? 'CRITICAL EVENT: Sean (PO) approaches wanting to add an urgent compliance requirement from legal — mid-sprint scope change.' : ''}
${day === 7 ? 'CRITICAL EVENT: Sebastian found a critical security vulnerability in the authentication module during regression testing.' : ''}
${day === 3 ? 'EVENT: Network peering approval is delayed. Maya flags this as a blocker for NEB-112.' : ''}

Set the scene. If there's a Daily StandUp (every day except Day 1), team members give updates: what they did yesterday, plan today, blockers. Generate relevant emails and board_updates too.`;

      const aiResponse = await callAI(prompt, [], langLine);
      const parsed = parseAIResponse(aiResponse);

      for (const msg of parsed.messages) {
        await supabase.from("simulation_messages").insert({
          simulation_id, day, role: "team_member",
          speaker: msg.speaker, content: msg.content,
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

async function callAI(prompt: string, history: { role: "user" | "assistant"; content: string }[], langLine = "") {
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
        { role: "system", content: SYSTEM_PROMPT + langLine },
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

function parseAIResponse(content: string): {
  messages: { speaker: string; content: string }[];
  actions_available?: string[];
  score?: any;
  board_updates?: { story_id: string; from: string; to: string }[];
  emails?: { from: string; subject: string; body: string; priority: string }[];
  risks?: { risk: string; impact: string; owner: string; mitigation: string }[];
  executive_report?: { health: string; summary: string; risks: string; next_focus: string };
} {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        messages: parsed.messages || [{ speaker: "Narrator", content }],
        actions_available: parsed.actions_available,
        score: parsed.score,
        board_updates: parsed.board_updates,
        emails: parsed.emails,
        risks: parsed.risks,
        executive_report: parsed.executive_report,
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
