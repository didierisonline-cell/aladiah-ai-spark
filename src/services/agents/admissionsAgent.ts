// =============================================================================
// Aladiah Admissions Authority Agent — service
// =============================================================================
// Agent #6. Converts QUALIFIED prospects into successful students, optimizing for
// enrollment QUALITY (fit, completion probability, certification success,
// employment, salary) — never volume. Ten engines score each prospect; the agent
// drafts recommendations + follow-ups but NEVER sends, charges, or enrolls
// without founder approval (AOS permissions: publish=false, human approval).
//
// Deterministic v1; Phase 2 swaps the scorers for Claude + live CRM/market data.
// =============================================================================
import { db, nowISO } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { createTask } from '@/services/aos/tasks';
import { reportToCeo } from '@/services/aos/communication';
import { AgentRunOutput, RunContext } from '@/types/aos';
import {
  ADMISSIONS_AGENT_SLUG,
  AdmissionsFollowup,
  AdmissionsRecommendation,
  AdmissionsStats,
  Objection,
  Prospect,
  ProspectIntake,
  ProspectStatus,
} from '@/types/admissions';

const SLUG = ADMISSIONS_AGENT_SLUG;
const PROSPECTS = 'admissions_prospects';
const RECS = 'admissions_recommendations';
const FOLLOWUPS = 'admissions_followups';

// Curated career/market reference (Phase 2: live market data via QA Market Intel).
const CAREER: Record<string, { program: string; demand: number; salaryRange: string; ttpMonths: number }> = {
  'Scrum Master': { program: 'scrum', demand: 82, salaryRange: 'USD 75k–140k', ttpMonths: 4 },
  'Agile Coach': { program: 'scrum', demand: 74, salaryRange: 'USD 95k–175k', ttpMonths: 5 },
  'Project Manager': { program: 'project-management', demand: 80, salaryRange: 'USD 70k–140k', ttpMonths: 4 },
  'Product Owner': { program: 'scrum', demand: 78, salaryRange: 'USD 80k–155k', ttpMonths: 4 },
};
const careerFor = (role: string | null) => CAREER[role ?? ''] ?? CAREER['Scrum Master'];

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// ---------------------------------------------------------------------------
// Engine scoring (pure)
// ---------------------------------------------------------------------------
interface Scores {
  qualification_score: number;
  fit_score: number;
  financial_score: number;
  financial_readiness: Prospect['financial_readiness'];
  completion_probability: number;
  employability_score: number;
  matched_program: string;
  recommended_program: string;
  objections: Objection[];
  employability_projection: Record<string, unknown>;
  success_prediction: Record<string, unknown>;
  status: ProspectStatus;
}

function commitmentScore(h: number): number {
  if (h >= 8) return 100;
  if (h >= 4) return 65;
  if (h >= 2) return 35;
  return 15;
}
function backgroundFit(bg: string | null): number {
  switch (bg) {
    case 'manager': return 88;
    case 'developer': return 84;
    case 'student': return 68;
    case 'non_tech': return 62;
    default: return 70;
  }
}

function deriveObjections(p: Prospect): Objection[] {
  const out: Objection[] = [];
  if (p.budget_band === 'low' || p.budget_band === 'unknown')
    out.push({ type: 'cost', concern: 'Is it affordable?', response: 'We offer installment plans and scholarships for emerging markets — let’s find a path that fits your budget without compromising the outcome.' });
  if (p.background === 'non_tech')
    out.push({ type: 'capability', concern: 'Can I do this without a tech background?', response: 'The Scrum Master path is built for career changers — our simulations and AI coach take you from zero to job-ready with measurable competency.' });
  if (p.timeline === 'exploring')
    out.push({ type: 'timing', concern: 'I’m just exploring.', response: 'No pressure — start with the diagnostic and a free resource so you can decide with evidence, not hype.' });
  if (p.motivation <= 2)
    out.push({ type: 'fit', concern: 'Not sure it’s for me.', response: 'That’s honest — if this isn’t the right fit right now, we’ll point you to free resources rather than enroll you.' });
  return out;
}

export function computeScores(p: Prospect): Scores {
  const career = careerFor(p.target_role);
  const qualification_score = clamp(p.motivation * 12 + commitmentScore(p.commitment_hours) * 0.25 + ({ now: 15, '3m': 10, '6m': 5, exploring: 0 }[p.timeline] ?? 0) + (p.webinar_attended ? 8 : 0));
  const fit_score = clamp(backgroundFit(p.background) * 0.8 + p.motivation * 4);
  const financial_score = clamp({ high: 90, mid: 75, low: 50, unknown: 40 }[p.budget_band] ?? 40);
  const financial_readiness: Prospect['financial_readiness'] = financial_score >= 75 ? 'ready' : financial_score >= 50 ? 'needs_plan' : financial_score >= 40 ? 'unknown' : 'not_ready';
  const completion_probability = clamp(p.motivation * 10 * 0.4 + commitmentScore(p.commitment_hours) * 0.3 + fit_score * 0.3);
  const employability_score = clamp(career.demand * 0.6 + completion_probability * 0.4);

  // Quality-over-volume status decision.
  let status: ProspectStatus = 'nurturing';
  if (completion_probability < 35 || (p.motivation <= 2 && p.commitment_hours < 2)) status = 'disqualified';
  else if (qualification_score >= 70 && completion_probability >= 60) status = 'qualified';
  else status = 'nurturing';

  const employability_projection = {
    projected_employment_pct: clamp(career.demand * 0.7 + completion_probability * 0.3),
    salary_range: career.salaryRange,
    time_to_placement_months: career.ttpMonths,
    demand: career.demand,
  };
  const risk_factors: string[] = [];
  if (p.commitment_hours < 4) risk_factors.push('Low weekly time commitment');
  if (p.motivation <= 3) risk_factors.push('Moderate motivation');
  if (p.background === 'non_tech') risk_factors.push('Career-changer — needs strong onboarding');
  const success_prediction = {
    completion_probability,
    certification_success: clamp(completion_probability - 5),
    risk_factors,
  };

  return {
    qualification_score,
    fit_score,
    financial_score,
    financial_readiness,
    completion_probability,
    employability_score,
    matched_program: career.program,
    recommended_program: career.program,
    objections: deriveObjections(p),
    employability_projection,
    success_prediction,
    status,
  };
}

// ---------------------------------------------------------------------------
// Score + persist a prospect, then draft (gated) recommendations + follow-ups
// ---------------------------------------------------------------------------
async function scoreAndPersist(p: Prospect, runId?: string | null): Promise<Prospect | null> {
  const s = computeScores(p);
  const { data, error } = await db
    .from(PROSPECTS)
    .update({ ...s, updated_at: nowISO() })
    .eq('id', p.id)
    .select('*')
    .single();
  if (error) {
    await logAction(SLUG, 'score_prospect', { runId, level: 'error', result: 'error', error: error.message });
    return null;
  }

  // Recommendation (approval-gated) — quality decision, not a push to enroll.
  const recType = s.status === 'qualified' ? 'enroll' : s.status === 'disqualified' ? 'disqualify' : 'nurture';
  const recTitle =
    recType === 'enroll' ? `Enroll-ready: ${p.name} → ${s.recommended_program}`
    : recType === 'disqualify' ? `Not a fit right now: ${p.name}`
    : `Nurture: ${p.name} → ${s.recommended_program}`;
  const recRationale =
    `Qualification ${s.qualification_score}, fit ${s.fit_score}, completion probability ${s.completion_probability}%, employability ${s.employability_score}. `
    + (recType === 'enroll' ? 'High-fit, ready — recommend founder-approved enrollment outreach.'
      : recType === 'disqualify' ? 'Low completion probability — recommend pointing to free resources rather than enrolling.'
      : 'Promising but not yet ready — nurture toward fit and readiness.');

  // Only create the rec set once per prospect.
  const { data: existing } = await db.from(RECS).select('id').eq('prospect_id', p.id).limit(1);
  if (!existing || existing.length === 0) {
    await db.from(RECS).insert([
      { prospect_id: p.id, rec_type: 'program', title: `Recommended program: ${s.recommended_program}`, rationale: `Career-matched to ${p.target_role} (demand ${s.employability_score}).`, priority: 'medium', status: 'pending', payload: { program: s.recommended_program } },
      { prospect_id: p.id, rec_type: recType, title: recTitle, rationale: recRationale, priority: recType === 'enroll' ? 'high' : 'medium', status: 'pending', payload: { status: s.status } },
    ]);

    // Drafted follow-ups (NEVER auto-sent) — skip for disqualified prospects.
    if (s.status !== 'disqualified') {
      const first = (p.name ?? 'there').split(' ')[0];
      await db.from(FOLLOWUPS).insert([
        { prospect_id: p.id, step_no: 1, channel: 'email', subject: `Your path to ${p.target_role}`, message: `Hi ${first}, based on your goals, the ${s.recommended_program} program is a strong fit. Here's your projected outcome and a free diagnostic to confirm it's right for you.`, requires_approval: true, status: 'drafted' },
        { prospect_id: p.id, step_no: 2, channel: 'email', subject: `Is ${p.target_role} realistic for you?`, message: `Hi ${first}, completion probability for your profile is ${s.completion_probability}%. Here's how our AI coach + simulations get you job-ready, and the financing options available.`, requires_approval: true, status: 'drafted' },
        { prospect_id: p.id, step_no: 3, channel: 'email', subject: `A spot is open — your decision, no pressure`, message: `Hi ${first}, if it's the right time we can start your enrollment. If not, here are free resources to keep growing. Either way, we're rooting for you.`, requires_approval: true, status: 'drafted' },
      ]);
    }
  }

  await logAction(SLUG, 'score_prospect', { runId, result: 'success', message: `${p.name} → ${s.status} (fit ${s.fit_score}, completion ${s.completion_probability}%)`, detail: { prospectId: p.id, status: s.status } });
  return data as Prospect;
}

// ---------------------------------------------------------------------------
// Intake + queue processing
// ---------------------------------------------------------------------------
export async function intake(input: ProspectIntake): Promise<Prospect | null> {
  const { data, error } = await db
    .from(PROSPECTS)
    .insert({
      name: input.name,
      email: input.email ?? null,
      source: input.source ?? 'manual',
      region: input.region ?? null,
      target_role: input.targetRole,
      current_role: input.currentRole ?? null,
      background: input.background ?? 'unknown',
      budget_band: input.budgetBand ?? 'unknown',
      timeline: input.timeline ?? 'exploring',
      commitment_hours: input.commitmentHours ?? 0,
      motivation: input.motivation ?? 3,
      webinar_attended: input.webinarAttended ?? false,
      status: 'new',
    })
    .select('*')
    .single();
  if (error) return null;
  return scoreAndPersist(data as Prospect);
}

export async function processNewProspects(runId?: string | null): Promise<{ processed: number; qualified: number }> {
  const { data } = await db.from(PROSPECTS).select('*').eq('status', 'new').limit(200);
  const prospects = (data as Prospect[]) ?? [];
  let qualified = 0;
  for (const p of prospects) {
    const updated = await scoreAndPersist(p, runId);
    if (updated?.status === 'qualified') qualified += 1;
  }
  if (prospects.length > 0) {
    await remember({
      agentSlug: SLUG,
      content: `Processed ${prospects.length} new prospect(s); ${qualified} qualified for founder-approved enrollment outreach.`,
      summary: 'admissions_cycle',
      type: 'short_term',
      tags: ['admissions', 'qualification'],
      source: runId ?? undefined,
    });
    await reportToCeo(SLUG, {
      subject: `Admissions: ${qualified} qualified prospect(s) ready for your review`,
      body: `Qualified ${prospects.length} new prospect(s) for fit, completion probability, and employability. ${qualified} are enroll-ready (founder approval required to enroll/charge). Follow-ups are drafted but not sent.`,
      payload: { processed: prospects.length, qualified },
    });
  }
  await logAction(SLUG, 'admissions_cycle', { runId, result: 'success', message: `Processed ${prospects.length}, qualified ${qualified}` });
  return { processed: prospects.length, qualified };
}

// ---------------------------------------------------------------------------
// Founder approval actions (gated)
// ---------------------------------------------------------------------------
export async function approveRecommendation(id: string): Promise<boolean> {
  const { error } = await db.from(RECS).update({ status: 'approved', approved_by_founder: true, updated_at: nowISO() }).eq('id', id);
  return !error;
}
export async function dismissRecommendation(id: string): Promise<boolean> {
  const { error } = await db.from(RECS).update({ status: 'dismissed', updated_at: nowISO() }).eq('id', id);
  return !error;
}
export async function approveFollowup(id: string): Promise<boolean> {
  // Founder approves a drafted message. (Actual sending stays a manual/human step.)
  const { error } = await db.from(FOLLOWUPS).update({ status: 'approved' }).eq('id', id);
  return !error;
}

// ---------------------------------------------------------------------------
// Reads + stats
// ---------------------------------------------------------------------------
export async function listProspects(status?: ProspectStatus): Promise<Prospect[]> {
  let q = db.from(PROSPECTS).select('*');
  if (status) q = q.eq('status', status);
  const { data } = await q.order('created_at', { ascending: false }).limit(300);
  return (data as Prospect[]) ?? [];
}
export async function listRecommendations(prospectId?: string): Promise<AdmissionsRecommendation[]> {
  let q = db.from(RECS).select('*');
  if (prospectId) q = q.eq('prospect_id', prospectId);
  const { data } = await q.order('created_at', { ascending: false }).limit(300);
  return (data as AdmissionsRecommendation[]) ?? [];
}
export async function listFollowups(prospectId?: string): Promise<AdmissionsFollowup[]> {
  let q = db.from(FOLLOWUPS).select('*');
  if (prospectId) q = q.eq('prospect_id', prospectId);
  const { data } = await q.order('created_at', { ascending: false }).limit(300);
  return (data as AdmissionsFollowup[]) ?? [];
}

export async function getStats(): Promise<AdmissionsStats> {
  const [prospects, recs, followups] = await Promise.all([listProspects(), listRecommendations(), listFollowups()]);
  const s = (st: ProspectStatus) => prospects.filter((p) => p.status === st).length;
  const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
  const byProg = new Map<string, number>();
  for (const p of prospects) if (p.recommended_program) byProg.set(p.recommended_program, (byProg.get(p.recommended_program) ?? 0) + 1);
  return {
    total: prospects.length,
    qualified: s('qualified'),
    nurturing: s('nurturing'),
    enrolled: s('enrolled'),
    disqualified: s('disqualified'),
    avgFit: avg(prospects.map((p) => p.fit_score ?? 0).filter(Boolean)),
    avgCompletionProbability: avg(prospects.map((p) => p.completion_probability ?? 0).filter(Boolean)),
    pendingRecommendations: recs.filter((r) => r.status === 'pending').length,
    draftedFollowups: followups.filter((f) => f.status === 'drafted').length,
    byProgram: [...byProg.entries()].map(([program, count]) => ({ program, count })),
  };
}

// ---------------------------------------------------------------------------
// CEO -> Admissions delegation + orchestrator runner
// ---------------------------------------------------------------------------
export async function enqueueAdmissionsTask(opts: { fromAgent?: string; priority?: 'low' | 'medium' | 'high' | 'critical' } = {}) {
  return createTask({
    title: 'Admissions: process prospect queue',
    createdByAgent: opts.fromAgent ?? 'human',
    assignedAgent: SLUG,
    priority: opts.priority ?? 'medium',
    payload: { kind: 'process_queue' },
  });
}

export const admissionsRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const { listReadyTasks, setTaskStatus } = await import('@/services/aos/tasks');
  const ready = await listReadyTasks(SLUG);
  await ctx.log('scan_tasks', { message: `${ready.length} ready task(s)` });
  for (const task of ready) {
    await setTaskStatus(task.id, 'in_progress');
    try {
      const r = await processNewProspects(ctx.runId);
      await setTaskStatus(task.id, 'completed', r);
      await ctx.log('task_completed', { result: 'success', message: 'process_queue', detail: r });
    } catch (e) {
      await setTaskStatus(task.id, 'failed', { error: e instanceof Error ? e.message : String(e) });
    }
  }
  const result = await processNewProspects(ctx.runId);
  return { ok: true, output: result };
};
