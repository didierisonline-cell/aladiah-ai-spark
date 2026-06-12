// =============================================================================
// generate-question-bank — founder-only. Generates ORIGINAL Scrum questions
// into each chapter_end quiz of a course, in the quiz_questions schema
// (question_text, scenario_context, options, correct_answer_index, explanation,
// competency, topic, difficulty). Additive only — never deletes.
// Run repeatedly (perRun batches) until each module reaches `target` (300-400).
//
// Body: { courseId?, perRun?=25, target?=350 }
// =============================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FOUNDER_EMAILS = ["didier@aladiahacademy.com", "didiermbok@yahoo.com"];
const FLAGSHIP = "f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14";

// Module (order_index) → topic + competency tags. 0-based index.
const MODULES = [
  { topic: "Agile & Scrum Foundations", comp: "Scrum,Agile,AI" },
  { topic: "Scrum Master Role & Servant Leadership", comp: "Scrum,Leadership" },
  { topic: "Scrum Team & Accountabilities", comp: "Scrum,Stakeholders" },
  { topic: "Sprint Planning & Capacity", comp: "Scrum,Metrics" },
  { topic: "Daily Scrum & Flow", comp: "Scrum,AI,Metrics" },
  { topic: "Facilitation & Retrospectives", comp: "Leadership,Scrum" },
  { topic: "Product & Sprint Backlog", comp: "Scrum,Stakeholders" },
  { topic: "Definition of Done & Quality", comp: "Scrum,Metrics" },
  { topic: "Agile Metrics & AI Analytics", comp: "Metrics,AI" },
  { topic: "Scaling Scrum & SAFe", comp: "SAFe,Scaling" },
  { topic: "PI Planning", comp: "SAFe,Scaling,Stakeholders" },
  { topic: "Dependencies, Risk & Impediments at Scale", comp: "Scaling,Metrics" },
  { topic: "Stakeholder & Executive Management", comp: "Leadership,Stakeholders" },
  { topic: "Organizational Change & Coaching", comp: "Leadership,Scaling" },
  { topic: "AI-Enabled Delivery", comp: "AI,Leadership" },
  { topic: "Enterprise Transformation Strategy", comp: "Scaling,Leadership,Stakeholders" },
  { topic: "Executive Communication & Board Readiness", comp: "Leadership,Stakeholders" },
  { topic: "Capstone Integration", comp: "Scrum,Agile,SAFe,Leadership,AI,Metrics,Stakeholders,Scaling" },
];

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;

    // ---- AuthZ: founder only ----
    const authed = createClient(url, anon, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
    const { data: { user } } = await authed.auth.getUser();
    if (!user || !FOUNDER_EMAILS.includes((user.email ?? "").toLowerCase())) {
      return new Response(JSON.stringify({ error: "founder only" }), { status: 403, headers: { ...cors, "content-type": "application/json" } });
    }

    const { courseId = FLAGSHIP, perRun = 25, target = 350 } = await req.json().catch(() => ({}));
    const db = createClient(url, service);

    // chapter_end quizzes for the course, with chapter order/title
    const { data: quizzes } = await db
      .from("quizzes").select("id, chapter_id, quiz_type, chapters(course_id, title, order_index)")
      .eq("quiz_type", "chapter_end");
    const target_quizzes = (quizzes ?? []).filter((q: any) => q.chapters?.course_id === courseId);

    const result: Record<string, number> = {};
    for (const q of target_quizzes) {
      const idx = q.chapters?.order_index ?? 0;
      const mod = MODULES[idx] ?? MODULES[0];
      const { count: existing } = await db.from("quiz_questions").select("id", { count: "exact", head: true }).eq("quiz_id", q.id);
      const have = existing ?? 0;
      if (have >= target) { result[`M${idx + 1}`] = 0; continue; }
      const n = Math.min(perRun, target - have);

      const system = `You are a Scrum.org-certified assessment author. Write ${n} ORIGINAL multiple-choice questions for an "AI Enterprise Scrum Master" certification, module "${mod.topic}".
RULES:
- ORIGINAL only. Base difficulty/style on the Scrum Guide 2020 and Scrum.org PSM I/PSM II *learning objectives* — NEVER copy or paraphrase any official exam question.
- 4 options, exactly one correct. Include realistic scenario_context where useful.
- Mix difficulty (easy/medium/hard).
- Competency must be one of: ${mod.comp}. Topic = "${mod.topic}".
Return ONLY a JSON array, each item:
{"question_text":"","scenario_context":"","options":["","","",""],"correct_answer_index":0,"explanation":"","competency":"","topic":"","difficulty":"easy|medium|hard"}`;

      const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": anthropicKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, system, messages: [{ role: "user", content: `Generate ${n} questions now as a JSON array.` }] }),
      });
      const ai = await aiRes.json();
      const text = ai?.content?.[0]?.text ?? "[]";
      let items: any[] = [];
      try { items = JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1)); } catch { items = []; }

      const rows = items
        .filter((it) => it?.question_text && Array.isArray(it?.options) && it.options.length === 4 && typeof it.correct_answer_index === "number")
        .map((it, i) => ({
          quiz_id: q.id, question_text: String(it.question_text), scenario_context: it.scenario_context ?? null,
          options: it.options, correct_answer_index: Math.max(0, Math.min(3, it.correct_answer_index)),
          explanation: it.explanation ?? null, order_index: have + i,
          competency: it.competency ?? mod.comp.split(",")[0], topic: it.topic ?? mod.topic, difficulty: it.difficulty ?? "medium",
        }));
      if (rows.length) await db.from("quiz_questions").insert(rows);
      result[`M${idx + 1}`] = rows.length;
    }

    return new Response(JSON.stringify({ ok: true, courseId, inserted: result }), { headers: { ...cors, "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { ...cors, "content-type": "application/json" } });
  }
});
