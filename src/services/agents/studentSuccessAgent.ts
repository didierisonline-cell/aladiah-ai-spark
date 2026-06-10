// =============================================================================
// Aladiah Student Success & Employability Authority — service
// =============================================================================
// Agent #7. Transforms students into employable professionals and future leaders.
// Reads student data (profiles, user_progress, quiz_attempts, student_analytics,
// subscriptions) READ-ONLY, computes per-student readiness across 14 dimensions,
// and the PRIMARY KPI: the Career Transformation Score (CTS). It drafts
// interventions but NEVER modifies student records or acts without founder
// approval (AOS permissions: publish=false, human_approval_required=true).
//
// Honesty: dimensions computed from real data (competency mastery from quiz
// scores, completion from progress, recency from activity) are genuine; derived
// dimensions (simulation/portfolio/resume/linkedin/ai readiness) are flagged in
// `estimated[]` until those data sources are wired (Phase 2).
// =============================================================================
import { db, nowISO, safe } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { createTask } from '@/services/aos/tasks';
import { reportToCeo } from '@/services/aos/communication';
import { AgentRunOutput, RunContext } from '@/types/aos';
import {
  SUCCESS_AGENT_SLUG,
  SuccessIntervention,
  SuccessStats,
  SuccessStudent,
  RiskLevel,
  StudentStatus,
} from '@/types/success';
import { computeCTS } from './success/engines';

const SLUG = SUCCESS_AGENT_SLUG;
const STUDENTS = 'success_students';
const INTERVENTIONS = 'success_interventions';

const PROGRAM = 'scrum';
const PROGRAM_DEMAND = 82;
const SALARY_BASE = 105000; // USD median for Scrum Master (curated)

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const daysSince = (iso: string | null) => (iso ? (Date.now() - new Date(iso).getTime()) / 86400000 : Infinity);

// ---------------------------------------------------------------------------
// Per-student computation
// ---------------------------------------------------------------------------
interface RawStudent {
  user_id: string;
  name: string | null;
  avgScore: number;     // from quiz_attempts (real)
  attempts: number;     // real
  passed: number;       // user_progress passed quizzes (real)
  lastActive: string | null;
  active: boolean;      // active subscription
}

function buildProfile(r: RawStudent): Partial<SuccessStudent> {
  const recency = daysSince(r.lastActive);

  // Real signals
  const competency_mastery = clamp(r.attempts > 0 ? r.avgScore : 0);
  const completion = clamp(Math.min(100, r.passed * 8)); // ~8% per passed quiz (proxy)

  // Derived (flagged as estimated until live data exists)
  const certification_readiness = clamp(0.6 * competency_mastery + 0.4 * completion);
  const simulation_mastery = clamp(competency_mastery * 0.85);
  const portfolio_readiness = clamp(completion * 0.8);
  const interview_readiness = clamp(0.5 * competency_mastery + 0.3 * completion + (recency < 14 ? 15 : 0));
  const resume_score = clamp(45 + completion * 0.3 + (competency_mastery > 60 ? 15 : 0));
  const linkedin_score = clamp(40 + (r.active ? 20 : 0) + completion * 0.2);
  const ai_readiness = clamp(competency_mastery * 0.7 + 15);
  const promotion_readiness = clamp(0.5 * competency_mastery + 0.2 * completion + 0.3 * simulation_mastery);
  const employability_score = clamp(0.45 * competency_mastery + 0.25 * completion + 0.3 * PROGRAM_DEMAND);

  const dims = {
    competency_mastery, completion, certification_readiness, simulation_mastery,
    portfolio_readiness, interview_readiness, resume_score, linkedin_score,
    employability_score, ai_readiness, promotion_readiness,
  };
  const career_transformation_score = computeCTS(dims);

  const projected = Math.round(SALARY_BASE * (0.7 + employability_score / 333)); // scales ~0.7x–1.0x
  const salary_projection = {
    projected,
    range: `USD ${Math.round(projected * 0.85 / 1000)}k–${Math.round(projected * 1.25 / 1000)}k`,
    currency: 'USD',
  };

  // Risk detection
  const risk_factors: string[] = [];
  if (recency > 30) risk_factors.push('Inactive 30+ days');
  else if (recency > 14) risk_factors.push('Low recent activity');
  if (r.attempts > 0 && competency_mastery < 50) risk_factors.push('Low competency mastery');
  if (completion < 20) risk_factors.push('Low progress');
  const risk_level: RiskLevel = recency > 30 || (competency_mastery < 40 && r.attempts > 0) ? 'high' : risk_factors.length > 0 ? 'medium' : 'low';

  let status: StudentStatus = 'active';
  if (risk_level === 'high') status = 'at_risk';
  else if (career_transformation_score >= 70 && employability_score >= 75) status = 'placement_ready';
  else if (career_transformation_score >= 80) status = 'thriving';

  return {
    user_id: r.user_id,
    name: r.name,
    program: PROGRAM,
    ...dims,
    salary_projection,
    career_transformation_score,
    risk_level,
    risk_factors,
    status,
    last_active: r.lastActive,
    estimated: ['simulation_mastery', 'portfolio_readiness', 'interview_readiness', 'resume_score', 'linkedin_score', 'ai_readiness', 'promotion_readiness'],
  };
}

// ---------------------------------------------------------------------------
// Gather real student signals (bulk, defensive)
// ---------------------------------------------------------------------------
async function gatherStudents(): Promise<RawStudent[]> {
  const profiles = await safe(async () => (await db.from('profiles').select('*').limit(2000)).data ?? [], [] as any[]);
  const attempts = await safe(async () => (await db.from('quiz_attempts').select('user_id, score, created_at').limit(20000)).data ?? [], [] as any[]);
  const progress = await safe(async () => (await db.from('user_progress').select('user_id, quiz_id, completed_at').not('quiz_id', 'is', null).limit(20000)).data ?? [], [] as any[]);
  const analytics = await safe(async () => (await db.from('student_analytics').select('user_id, created_at').order('created_at', { ascending: false }).limit(20000)).data ?? [], [] as any[]);
  const subs = await safe(async () => (await db.from('subscriptions').select('user_id, status').limit(5000)).data ?? [], [] as any[]);

  const activeSet = new Set((subs as any[]).filter((s) => s.status === 'active').map((s) => s.user_id));
  const lastActiveByUser = new Map<string, string>();
  for (const a of analytics as any[]) if (!lastActiveByUser.has(a.user_id)) lastActiveByUser.set(a.user_id, a.created_at);

  return (profiles as any[]).map((p) => {
    const uid = p.user_id ?? p.id;
    const myAttempts = (attempts as any[]).filter((a) => a.user_id === uid);
    const avgScore = myAttempts.length ? myAttempts.reduce((s, a) => s + (a.score ?? 0), 0) / myAttempts.length : 0;
    const passed = (progress as any[]).filter((pr) => pr.user_id === uid).length;
    const lastProgress = (progress as any[]).filter((pr) => pr.user_id === uid).map((pr) => pr.completed_at).sort().pop() ?? null;
    const lastAnalytics = lastActiveByUser.get(uid) ?? null;
    const lastActive = [lastProgress, lastAnalytics].filter(Boolean).sort().pop() ?? p.created_at ?? null;
    return { user_id: uid, name: p.full_name ?? null, avgScore, attempts: myAttempts.length, passed, lastActive, active: activeSet.has(uid) };
  });
}

// ---------------------------------------------------------------------------
// Process the cohort: compute, persist, draft interventions
// ---------------------------------------------------------------------------
async function draftInterventions(student: SuccessStudent) {
  const { data: existing } = await db.from(INTERVENTIONS).select('id').eq('student_id', student.id).eq('status', 'pending').limit(1);
  if (existing && existing.length > 0) return; // already has pending interventions

  const rows: any[] = [];
  const first = (student.name ?? 'the student').split(' ')[0];
  if (student.risk_level === 'high') {
    rows.push({ student_id: student.id, intervention_type: 'outreach', title: `Re-engage ${first} (high risk)`, rationale: `Risk factors: ${student.risk_factors.join(', ')}.`, priority: 'high', status: 'pending', payload: { draft: `Hi ${first}, we noticed you've been away. Here's a quick win to restart your path to ${PROGRAM}.` } });
  }
  if (student.competency_mastery < 50 && student.competency_mastery > 0) {
    rows.push({ student_id: student.id, intervention_type: 'remediation', title: `Competency remediation for ${first}`, rationale: `Competency mastery ${student.competency_mastery}% — recommend targeted practice + AI tutor.`, priority: 'medium', status: 'pending', payload: {} });
  }
  if (student.status === 'placement_ready') {
    rows.push({ student_id: student.id, intervention_type: 'placement', title: `${first} is placement-ready`, rationale: `CTS ${student.career_transformation_score}, employability ${student.employability_score}. Recommend interview prep + employer matching.`, priority: 'high', status: 'pending', payload: {} });
  }
  if (rows.length > 0) await db.from(INTERVENTIONS).insert(rows);
}

export async function processCohort(runId?: string | null): Promise<{ processed: number; atRisk: number; avgCTS: number }> {
  const raw = await gatherStudents();
  let atRisk = 0;
  let ctsSum = 0;
  let count = 0;

  for (const r of raw) {
    const profile = buildProfile(r);
    const { data, error } = await db.from(STUDENTS).upsert({ ...profile, updated_at: nowISO() }, { onConflict: 'user_id' }).select('*').single();
    if (error || !data) continue;
    const student = data as SuccessStudent;
    if (student.risk_level === 'high') atRisk += 1;
    ctsSum += student.career_transformation_score;
    count += 1;
    await draftInterventions(student);
  }

  const avgCTS = count ? Math.round(ctsSum / count) : 0;
  if (count > 0) {
    await remember({
      agentSlug: SLUG,
      content: `Processed ${count} student(s). Avg Career Transformation Score ${avgCTS}; ${atRisk} at-risk.`,
      summary: `success_cycle:cts:${avgCTS}`,
      type: 'short_term',
      tags: ['student_success', 'cts'],
      source: runId ?? undefined,
    });
    await reportToCeo(SLUG, {
      subject: `Student Success: avg CTS ${avgCTS}, ${atRisk} at-risk`,
      body: `Scored ${count} student(s) across 14 readiness dimensions. Average Career Transformation Score (primary KPI) is ${avgCTS}. ${atRisk} students are high-risk with drafted interventions awaiting your approval. No student records were modified.`,
      payload: { processed: count, atRisk, avgCTS },
    });
  }
  await logAction(SLUG, 'success_cycle', { runId, result: 'success', message: `Processed ${count}, atRisk ${atRisk}, avgCTS ${avgCTS}` });
  return { processed: count, atRisk, avgCTS };
}

// ---------------------------------------------------------------------------
// Founder approval actions (gated)
// ---------------------------------------------------------------------------
export async function approveIntervention(id: string): Promise<boolean> {
  const { error } = await db.from(INTERVENTIONS).update({ status: 'approved', approved_by_founder: true, updated_at: nowISO() }).eq('id', id);
  return !error;
}
export async function dismissIntervention(id: string): Promise<boolean> {
  const { error } = await db.from(INTERVENTIONS).update({ status: 'dismissed', updated_at: nowISO() }).eq('id', id);
  return !error;
}

// ---------------------------------------------------------------------------
// Reads + stats
// ---------------------------------------------------------------------------
export async function listStudents(limit = 500): Promise<SuccessStudent[]> {
  const { data } = await db.from(STUDENTS).select('*').order('career_transformation_score', { ascending: false }).limit(limit);
  return (data as SuccessStudent[]) ?? [];
}
export async function listInterventions(studentId?: string): Promise<SuccessIntervention[]> {
  let q = db.from(INTERVENTIONS).select('*');
  if (studentId) q = q.eq('student_id', studentId);
  const { data } = await q.order('created_at', { ascending: false }).limit(300);
  return (data as SuccessIntervention[]) ?? [];
}

export async function getStats(): Promise<SuccessStats> {
  const [students, interventions] = await Promise.all([listStudents(2000), listInterventions()]);
  const s = (st: StudentStatus) => students.filter((x) => x.status === st).length;
  const avgCTS = students.length ? Math.round(students.reduce((a, b) => a + b.career_transformation_score, 0) / students.length) : 0;
  const bands = [
    { band: '0-39', min: 0, max: 39 },
    { band: '40-59', min: 40, max: 59 },
    { band: '60-79', min: 60, max: 79 },
    { band: '80-100', min: 80, max: 100 },
  ];
  return {
    students: students.length,
    avgCTS,
    thriving: s('thriving'),
    atRisk: students.filter((x) => x.risk_level === 'high').length,
    placementReady: s('placement_ready'),
    pendingInterventions: interventions.filter((i) => i.status === 'pending').length,
    ctsDistribution: bands.map((b) => ({ band: b.band, count: students.filter((x) => x.career_transformation_score >= b.min && x.career_transformation_score <= b.max).length })),
  };
}

// ---------------------------------------------------------------------------
// CEO -> Success delegation + orchestrator runner
// ---------------------------------------------------------------------------
export async function enqueueSuccessTask(opts: { fromAgent?: string; priority?: 'low' | 'medium' | 'high' | 'critical' } = {}) {
  return createTask({
    title: 'Student Success: process cohort',
    createdByAgent: opts.fromAgent ?? 'human',
    assignedAgent: SLUG,
    priority: opts.priority ?? 'medium',
    payload: { kind: 'process_cohort' },
  });
}

export const studentSuccessRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const { listReadyTasks, setTaskStatus } = await import('@/services/aos/tasks');
  const ready = await listReadyTasks(SLUG);
  await ctx.log('scan_tasks', { message: `${ready.length} ready task(s)` });
  for (const task of ready) {
    await setTaskStatus(task.id, 'in_progress');
    try {
      const r = await processCohort(ctx.runId);
      await setTaskStatus(task.id, 'completed', r);
      await ctx.log('task_completed', { result: 'success', message: 'process_cohort', detail: r });
    } catch (e) {
      await setTaskStatus(task.id, 'failed', { error: e instanceof Error ? e.message : String(e) });
    }
  }
  const result = await processCohort(ctx.runId);
  return { ok: true, output: result };
};
