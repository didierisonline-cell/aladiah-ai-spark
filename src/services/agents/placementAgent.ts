// =============================================================================
// Aladiah Placement & Employer Relations Authority — service
// =============================================================================
// Agent #8. The bridge between Aladiah Academy and Aladiah Management. It ingests
// placement-ready students from the Student Success Agent, runs the employer +
// talent-marketplace + placement pipeline, forecasts workforce demand, and feeds
// demand + salary intelligence back to the Academy agents (Product Builder, QA,
// Student Success, Admissions).
//
// APPROVAL RULES (AOS permissions: publish=false, human_approval_required=true):
// NO contract, NO candidate submission, and NO employer communication happens
// without founder approval — the agent drafts these as placement_actions.
//
// Primary KPI: Student Placement Rate.
// =============================================================================
import { db, nowISO, safe } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { createTask } from '@/services/aos/tasks';
import { reportToCeo, sendMessage } from '@/services/aos/communication';
import { AgentRunOutput, RunContext } from '@/types/aos';
import {
  Candidate,
  DemandSignal,
  Employer,
  PLACEMENT_AGENT_SLUG,
  PlacementAction,
  PlacementJob,
  PlacementMatch,
  PlacementStats,
  MatchStage,
} from '@/types/placement';
import { FEEDBACK_TARGETS } from './placement/engines';

const SLUG = PLACEMENT_AGENT_SLUG;
const EMPLOYERS = 'placement_employers';
const CANDIDATES = 'placement_candidates';
const JOBS = 'placement_jobs';
const MATCHES = 'placement_matches';
const ACTIONS = 'placement_actions';
const DEMAND = 'placement_demand';

const roleForProgram = (program: string | null) => (program === 'project-management' ? 'Project Manager' : 'Scrum Master');

// ---------------------------------------------------------------------------
// 1. Receive placement-ready students from the Student Success Agent
// ---------------------------------------------------------------------------
export async function ingestPlacementReady(runId?: string | null): Promise<number> {
  const ready = await safe(async () =>
    (await db.from('success_students').select('*').eq('status', 'placement_ready').limit(500)).data ?? [],
  [] as any[]);

  let ingested = 0;
  for (const s of ready as any[]) {
    const { data: existing } = await db.from(CANDIDATES).select('id, status').eq('user_id', s.user_id).maybeSingle();
    const scores = {
      name: s.name,
      program: s.program,
      target_role: roleForProgram(s.program),
      employability_score: s.employability_score ?? 0,
      portfolio_score: s.portfolio_readiness ?? 0,
      interview_readiness: s.interview_readiness ?? 0,
      competency_mastery: s.competency_mastery ?? 0,
      cts: s.career_transformation_score ?? 0,
      source_success_id: s.id,
      updated_at: nowISO(),
    };
    if (existing) {
      await db.from(CANDIDATES).update(scores).eq('id', existing.id); // refresh scores, keep pipeline status
    } else {
      await db.from(CANDIDATES).insert({ user_id: s.user_id, status: 'received', ...scores });
      ingested += 1;
    }
  }
  await logAction(SLUG, 'ingest_placement_ready', { runId, result: 'success', message: `Ingested ${ingested} new placement-ready candidate(s)` });
  return ingested;
}

// ---------------------------------------------------------------------------
// 2. Match candidates to open jobs + draft (gated) submissions
// ---------------------------------------------------------------------------
export async function matchCandidates(runId?: string | null): Promise<number> {
  const [{ data: cands }, { data: jobs }, { data: existingMatches }] = await Promise.all([
    db.from(CANDIDATES).select('*').in('status', ['received', 'matched']).limit(500),
    db.from(JOBS).select('*').eq('status', 'open').limit(500),
    db.from(MATCHES).select('candidate_id').limit(2000),
  ]);
  const matched = new Set((existingMatches ?? []).map((m: any) => m.candidate_id));
  const openJobs = (jobs as PlacementJob[]) ?? [];
  let created = 0;

  for (const c of (cands as Candidate[]) ?? []) {
    if (matched.has(c.id)) continue;
    const job = openJobs.find((j) => j.role === c.target_role) ?? openJobs[0];
    const match_score = Math.round(0.5 * c.employability_score + 0.3 * c.interview_readiness + 0.2 * c.competency_mastery);
    const { data: m } = await db
      .from(MATCHES)
      .insert({ candidate_id: c.id, job_id: job?.id ?? null, employer_id: job?.employer_id ?? null, match_score, stage: 'matched' })
      .select('*')
      .single();
    await db.from(CANDIDATES).update({ status: 'matched', updated_at: nowISO() }).eq('id', c.id);

    // Draft a GATED candidate submission (never auto-submitted).
    await db.from(ACTIONS).insert({
      action_type: 'candidate_submission',
      candidate_id: c.id,
      employer_id: job?.employer_id ?? null,
      match_id: m?.id ?? null,
      title: `Submit ${c.name ?? 'candidate'} for ${job?.role ?? c.target_role}`,
      body: `Match score ${match_score}. Employability ${c.employability_score}, interview ${c.interview_readiness}, competency ${c.competency_mastery}. Founder approval required to submit.`,
      status: 'pending',
      payload: { match_score },
    });
    created += 1;
  }
  await logAction(SLUG, 'match_candidates', { runId, result: 'success', message: `Matched ${created} candidate(s); submissions drafted (gated)` });
  return created;
}

// ---------------------------------------------------------------------------
// 3. Forecast workforce demand + feed it back to the Academy agents
// ---------------------------------------------------------------------------
export async function forecastAndFeed(runId?: string | null): Promise<number> {
  const [{ data: demand }, { data: employers }] = await Promise.all([
    db.from(DEMAND).select('*').limit(200),
    db.from(EMPLOYERS).select('demand_roles, open_reqs').limit(500),
  ]);
  const signals = (demand as DemandSignal[]) ?? [];
  // (Open-req aggregation could refine demand here; v1 uses the curated signals.)

  const top = [...signals].sort((a, b) => b.demand_score - a.demand_score).slice(0, 5);
  const summary = top.map((d) => `${d.role}: demand ${d.demand_score}, median ${d.salary_median ?? '—'} (${d.trend})`).join('; ');

  // Feed demand + salary intelligence back to the Academy agents.
  for (const target of FEEDBACK_TARGETS) {
    await sendMessage({
      fromAgent: SLUG,
      toAgent: target,
      type: 'alert',
      subject: 'Employer demand + salary intelligence',
      body: `Workforce demand update from Aladiah Management: ${summary}. Skill gaps: ${top.flatMap((d) => d.skill_gaps).join(', ') || 'none'}.`,
      payload: { demand: top },
    });
  }
  await db.from(DEMAND).update({ fed_back: true, updated_at: nowISO() }).in('id', signals.map((s) => s.id));

  await remember({
    agentSlug: SLUG,
    content: `Fed employer demand + salary intelligence back to ${FEEDBACK_TARGETS.join(', ')}. Top: ${summary}.`,
    summary: 'demand_feedback',
    type: 'long_term',
    importance: 0.75,
    tags: ['demand', 'feedback'],
    source: runId ?? undefined,
  });
  await logAction(SLUG, 'forecast_and_feed', { runId, result: 'success', message: `Fed demand to ${FEEDBACK_TARGETS.length} agents` });
  return signals.length;
}

// ---------------------------------------------------------------------------
// Gated approval actions (contracts / submissions / employer comms)
// ---------------------------------------------------------------------------
export async function approveAction(id: string): Promise<boolean> {
  const { data: action } = await db.from(ACTIONS).select('*').eq('id', id).single();
  const { error } = await db.from(ACTIONS).update({ status: 'approved', approved_by_founder: true, updated_at: nowISO() }).eq('id', id);
  if (error) return false;
  // On approving a candidate submission, advance the pipeline.
  if (action?.action_type === 'candidate_submission' && action.match_id) {
    await db.from(MATCHES).update({ stage: 'submitted', updated_at: nowISO() }).eq('id', action.match_id);
    if (action.candidate_id) await db.from(CANDIDATES).update({ status: 'submitted', updated_at: nowISO() }).eq('id', action.candidate_id);
  }
  await logAction(SLUG, 'approve_action', { result: 'success', message: `${action?.action_type} approved`, detail: { id } });
  return true;
}
export async function dismissAction(id: string): Promise<boolean> {
  const { error } = await db.from(ACTIONS).update({ status: 'dismissed', updated_at: nowISO() }).eq('id', id);
  return !error;
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------
export async function listEmployers(): Promise<Employer[]> {
  const { data } = await db.from(EMPLOYERS).select('*').order('relationship_status').limit(300);
  return (data as Employer[]) ?? [];
}
export async function listCandidates(): Promise<Candidate[]> {
  const { data } = await db.from(CANDIDATES).select('*').order('cts', { ascending: false }).limit(500);
  return (data as Candidate[]) ?? [];
}
export async function listJobs(): Promise<PlacementJob[]> {
  const { data } = await db.from(JOBS).select('*').order('created_at', { ascending: false }).limit(300);
  return (data as PlacementJob[]) ?? [];
}
export async function listMatches(): Promise<PlacementMatch[]> {
  const { data } = await db.from(MATCHES).select('*').order('created_at', { ascending: false }).limit(500);
  return (data as PlacementMatch[]) ?? [];
}
export async function listActions(): Promise<PlacementAction[]> {
  const { data } = await db.from(ACTIONS).select('*').order('created_at', { ascending: false }).limit(300);
  return (data as PlacementAction[]) ?? [];
}
export async function listDemand(): Promise<DemandSignal[]> {
  const { data } = await db.from(DEMAND).select('*').order('demand_score', { ascending: false }).limit(100);
  return (data as DemandSignal[]) ?? [];
}

export async function getStats(): Promise<PlacementStats> {
  const [candidates, employers, jobs, matches, actions] = await Promise.all([
    listCandidates(), listEmployers(), listJobs(), listMatches(), listActions(),
  ]);
  const placed = matches.filter((m) => m.stage === 'placed');
  const placementRate = candidates.length ? Math.round((placed.length / candidates.length) * 100) : 0;
  const offers = placed.map((m) => m.offer_amount ?? 0).filter(Boolean);
  const avgSalary = offers.length ? Math.round(offers.reduce((a, b) => a + b, 0) / offers.length) : 0;
  const sat = employers.map((e) => e.satisfaction ?? 0).filter(Boolean);
  const STAGES: MatchStage[] = ['matched', 'submitted', 'interview', 'offer', 'placed', 'rejected'];
  return {
    candidates: candidates.length,
    placed: placed.length,
    placementRate,
    avgSalary,
    timeToPlacementDays: 0, // computed from placed_at once placements land
    employerSatisfaction: sat.length ? Math.round(sat.reduce((a, b) => a + b, 0) / sat.length) : 0,
    promotionRate: 0, // alumni data (Phase 2)
    retentionRate: 0, // alumni data (Phase 2)
    employers: employers.length,
    openJobs: jobs.filter((j) => j.status === 'open').length,
    pendingActions: actions.filter((a) => a.status === 'pending').length,
    pipeline: STAGES.map((stage) => ({ stage, count: matches.filter((m) => m.stage === stage).length })),
  };
}

// ---------------------------------------------------------------------------
// CEO -> Placement delegation + orchestrator runner
// ---------------------------------------------------------------------------
export async function enqueuePlacementTask(opts: { fromAgent?: string; priority?: 'low' | 'medium' | 'high' | 'critical' } = {}) {
  return createTask({
    title: 'Placement: run pipeline',
    createdByAgent: opts.fromAgent ?? 'human',
    assignedAgent: SLUG,
    priority: opts.priority ?? 'medium',
    payload: { kind: 'run_pipeline' },
  });
}

async function runPipeline(runId?: string | null) {
  const ingested = await ingestPlacementReady(runId);
  const matched = await matchCandidates(runId);
  const fed = await forecastAndFeed(runId);
  const stats = await getStats();
  await reportToCeo(SLUG, {
    subject: `Placement: rate ${stats.placementRate}%, ${matched} new match(es), demand fed back`,
    body: `Ingested ${ingested} placement-ready candidate(s), created ${matched} match(es) (submissions drafted, founder approval required), and fed employer demand + salary intelligence to the Academy agents. Student Placement Rate: ${stats.placementRate}%.`,
    payload: { ingested, matched, fed, placementRate: stats.placementRate },
  });
  return { ingested, matched, fed, placementRate: stats.placementRate };
}

export const placementRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const { listReadyTasks, setTaskStatus } = await import('@/services/aos/tasks');
  const ready = await listReadyTasks(SLUG);
  await ctx.log('scan_tasks', { message: `${ready.length} ready task(s)` });
  for (const task of ready) {
    await setTaskStatus(task.id, 'in_progress');
    try {
      const r = await runPipeline(ctx.runId);
      await setTaskStatus(task.id, 'completed', r);
      await ctx.log('task_completed', { result: 'success', message: 'run_pipeline', detail: r });
    } catch (e) {
      await setTaskStatus(task.id, 'failed', { error: e instanceof Error ? e.message : String(e) });
    }
  }
  const result = await runPipeline(ctx.runId);
  return { ok: true, output: result };
};
