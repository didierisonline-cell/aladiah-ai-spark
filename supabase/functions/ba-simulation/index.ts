// =============================================================================
// ba-simulation — the AI brain for BA Simulation 1 (Discovery Engagement) and the
// reference engine for all future Aladiah simulations. Actions:
//   interview  — dynamic, in-character stakeholder reply (rapport/quality-gated)
//   evaluate   — 7-dimension rubric scoring of the whole engagement
//   report     — auto-generate a portfolio-grade Executive Discovery Report
//   story      — extract a STAR + lessons interview story from the engagement
// Mirrors scrum-simulation: Lovable AI gateway, google/gemini-3-flash-preview,
// JSON-in-message responses. The frontend falls back gracefully if this function
// is not deployed, so the simulation is always playable. Deploy by hand (Claude
// Code does not auto-deploy): supabase functions deploy ba-simulation.
// =============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const action = body.action as string;
    if (action === "interview") return json(await doInterview(body));
    if (action === "evaluate") return json(await doEvaluate(body));
    if (action === "report") return json(await doReport(body));
    if (action === "artifact") return json(await doArtifact(body));
    if (action === "story") return json(await doStory(body));
    return json({ error: "unknown action" }, 400);
  } catch (e) {
    console.error("ba-simulation error:", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

// --- Action: dynamic stakeholder interview reply ----------------------------
async function doInterview(b: any) {
  const p = b.persona || {};
  const sys = `You are role-playing a single stakeholder in a Business Analyst discovery simulation for "${b.company || "the company"}".
STAY IN CHARACTER as ${p.name} (${p.role}).
- Stated goal: ${p.statedGoal}
- Real incentives: ${p.incentives}
- Political concerns: ${p.politicalConcerns}
- Information you privately hold (reveal only if the analyst earns it with a good, open, non-leading question): ${p.hiddenInfo}
- Communication style: ${p.communicationStyle}
- Current willingness to support the project (0-100): ${p.willingnessToSupport}
Rules: Answer ONLY as this person, 1-3 sentences, realistic and human. If the analyst asks a leading, hypothetical, or low-quality question, give a guarded or unhelpful answer. If they ask a strong, open, behavioural question, be more forthcoming. Never break character or mention you are an AI.
Return STRICT JSON: {"reply": string, "finding": {"text": string, "source": "${p.name} (${p.role})", "reliability": "firsthand|secondhand|contradictory", "keySignal": boolean} | null}
Set "finding" only when your answer contains a concrete, capturable insight; otherwise null. keySignal=true only if it points at the REAL problem (refund-timing variance, ~48% cross-channel returns, or the data-retention constraint).`;
  const history = (b.history || []).slice(-8);
  const content = await callAI(sys, history, `Analyst asks: "${b.question}"`);
  const parsed = safeJson(content);
  return { reply: parsed?.reply || content, finding: parsed?.finding ?? null };
}

// --- Action: generic rubric evaluation (any simulation) ---------------------
// If `rubric` (array of {key,label}) and `context` are provided, grades against
// that rubric — so the same engine scores any simulation. Otherwise falls back
// to the Discovery 7-dimension default below.
async function doEvaluate(b: any) {
  if (Array.isArray(b.rubric) && b.context) {
    const sys = `You are a senior Business Analyst assessor grading a "${b.simName || "BA"}" simulation. Score 0-100 on EACH dimension and give terse, specific feedback. Be fair but demanding; reward evidence and reasoning over assertion.
Dimensions: ${b.rubric.map((d: any) => d.label).join(", ")}.
Return STRICT JSON: {"dimensions":{${b.rubric.map((d: any) => `"${d.key}":n`).join(",")}},"total":n,"grade":"A-F","feedback":string}. total = rounded average of the dimensions.`;
    const content = await callAI(sys, [], b.context);
    return safeJson(content) || null;
  }
  const sys = `You are a senior BA assessor grading a discovery engagement. Score 0-100 on each of 7 dimensions and give terse, specific feedback. Be fair but demanding; reward evidence over opinion.
Dimensions: discovery_quality, evidence_quality, stakeholder_coverage, signal_vs_noise, recommendation_quality, business_impact, executive_communication.
Return STRICT JSON: {"dimensions":{"discovery_quality":n,"evidence_quality":n,"stakeholder_coverage":n,"signal_vs_noise":n,"recommendation_quality":n,"business_impact":n,"executive_communication":n},"total":n,"grade":"A-F","feedback":string}. total = rounded average.`;
  const payload = `Scenario: ${b.company} — "${b.title}".
Stakeholders interviewed: ${b.coverage}/6.
Findings captured (★=key signal):
${(b.findings || []).map((f: any) => `${f.keySignal ? "★" : "•"} ${f.text} — ${f.source} [${f.reliability}]`).join("\n")}
Recommendation chosen: "${b.recommendation}" (assessor note: the evidence-aligned answer fixes refund-timing variance + cross-channel integration with fraud controls and compliant retention).`;
  const content = await callAI(sys, [], payload);
  return safeJson(content) || null;
}

// --- Action: generate Executive Discovery Report ----------------------------
async function doReport(b: any) {
  const sys = `You are a top-tier business analyst writing a one-page Executive Discovery Report for an executive sponsor. Use ONLY the evidence provided. Be concise, decision-first, and credible.
Return STRICT JSON: {"problem":string,"opportunities":[string],"evidence":[string],"recommendation":string,"risks":[string],"confidence":"low|medium|high"}.`;
  const payload = `Scenario: ${b.company} — "${b.title}".
Evidence gathered:
${(b.findings || []).map((f: any) => `- ${f.text} (${f.source})`).join("\n")}
Analyst's chosen recommendation: "${b.recommendation}".`;
  const content = await callAI(sys, [], payload);
  return safeJson(content) || null;
}

// --- Action: generate an arbitrary portfolio artifact (any simulation) ------
async function doArtifact(b: any) {
  const sys = `You are a top-tier business analyst producing a portfolio-grade "${b.artifactType}". Use ONLY the provided context; be concise, executive-grade, and credible.
Return STRICT JSON shaped exactly like: ${b.shape}.`;
  const content = await callAI(sys, [], b.context || "");
  return safeJson(content) || null;
}

// --- Action: extract STAR + lessons interview story -------------------------
async function doStory(b: any) {
  const sys = `You turn a completed BA discovery engagement into an interview-ready story a candidate can tell. First person, specific, humble-confident.
Return STRICT JSON: {"situation":string,"task":string,"action":string,"result":string,"lessons":string}.`;
  const payload = `Engagement: discovery at ${b.company} on "${b.title}". The analyst interviewed stakeholders, separated signal from noise, and recommended: "${b.recommendation}". Key evidence: ${(b.findings || []).map((f: any) => f.text).join("; ")}.`;
  const content = await callAI(sys, [], payload);
  return safeJson(content) || null;
}

// --- LLM call (Lovable gateway, mirrors scrum-simulation) --------------------
async function callAI(system: string, history: any[], user: string) {
  const KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!KEY) throw new Error("AI not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: system }, ...history, { role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limited - please wait a moment");
    if (res.status === 402) throw new Error("AI credits exhausted");
    throw new Error("AI service error");
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function safeJson(content: string): any {
  try {
    const m = content.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
  } catch { /* fall through */ }
  return null;
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
