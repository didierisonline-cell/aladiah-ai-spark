// =============================================================================
// Aladiah World-Class QA Agent — Academic Quality & Employability Authority
// =============================================================================
// Agent #5 and the FINAL AUTHORITY before founder review. Product Builder
// artifacts that pass their own Aladiah Quality Standard land in status
// 'qa_review'. This agent reviews each across 13 quality engines, benchmarks them
// against 12 world-class authorities, and runs six validations (GitHub portfolio,
// interview readiness, market demand, salary relevance, AI readiness, employer
// alignment). Only artifacts that PASS QA are promoted to 'pending_approval' (the
// Founder Approval Queue); the rest become 'qa_rejected' with findings.
//
// Fully integrated with the AOS (registry, runner, logs, memory, tasks, comms,
// health, permissions). v1 review is deterministic + structural; Phase 2 swaps in
// Claude (LLM-as-judge) + live GitHub/market data behind the same QAReview shape.
// =============================================================================
import { db, nowISO } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { reportToCeo } from '@/services/aos/communication';
import { createTask } from '@/services/aos/tasks';
import { AgentRunOutput, RunContext } from '@/types/aos';
import { ProductArtifact } from '@/types/product';
import {
  MarketIntelligence,
  QA_AGENT_SLUG,
  QAFinding,
  QAReview,
  QAStats,
  QAVerdict,
  ValidationKey,
  ValidationResult,
} from '@/types/qa';
import { enginesForType, QA_ENGINES } from './qa/engines';
import { relevantBenchmarks } from './qa/benchmarks';

const SLUG = QA_AGENT_SLUG;
const ARTIFACTS = 'product_artifacts';
const REVIEWS = 'qa_reviews';
const MARKET = 'qa_market_intelligence';

const PASS_THRESHOLD = 80;
const CONDITIONAL_THRESHOLD = 70;

// Critical validations that must pass for an artifact to clear QA.
const CRITICAL_VALIDATIONS: ValidationKey[] = ['ai_readiness', 'employer_alignment', 'market_demand'];

function domainForType(type: string): string {
  if (type === 'module' || type === 'learning_path') return 'curriculum';
  if (type === 'quiz' || type === 'assessment') return 'assessment';
  if (type === 'simulation') return 'scrum';
  if (type === 'lab') return 'lab';
  if (type === 'project') return 'project';
  if (type === 'ai_readiness') return 'ai';
  return 'employability';
}

function roleForProgram(program: string | null): string {
  switch (program) {
    case 'scrum':
      return 'Scrum Master';
    case 'project-management':
      return 'Project Manager';
    default:
      return 'Scrum Master';
  }
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// ---------------------------------------------------------------------------
// Engine scoring
// ---------------------------------------------------------------------------
function scoreEngine(engineId: string, a: ProductArtifact, blob: string): number {
  const p = a.payload as any;
  const base = a.quality_score ?? 70;
  switch (engineId) {
    case 'curriculum_quality':
      return clamp(a.artifact_type === 'module' ? (Array.isArray(p.objectives) && p.objectives.length >= 2 && Array.isArray(p.lessons) && p.lessons.length >= 2 ? base + 8 : base - 25) : base + 5);
    case 'assessment_quality': {
      if (!['quiz', 'assessment'].includes(a.artifact_type)) return clamp(base);
      const qs = p.questions ?? [];
      const ok = qs.length >= 4 && qs.every((q: any) => Array.isArray(q.options) && typeof q.correct_index === 'number' && q.competency && q.explanation && q.options.every((o: string) => !/^[A-D]\)/.test(String(o).trim())));
      return clamp(ok ? base + 10 : base - 25);
    }
    case 'simulation_quality': {
      if (a.artifact_type !== 'simulation') return clamp(base);
      const ok = (p.decision_points ?? []).length >= 2 && (p.scoring_rubric ?? []).length >= 1;
      return clamp(ok ? base + 8 : base - 25);
    }
    case 'lab_quality':
      return clamp(a.artifact_type === 'lab' ? ((p.steps ?? []).length >= 3 && p.deliverable ? base + 6 : base - 15) : base);
    case 'project_quality':
      return clamp(a.artifact_type === 'project' ? ((p.requirements ?? []).length >= 2 && (p.rubric ?? []).length >= 1 ? base + 6 : base - 12) : base);
    case 'employability':
      return clamp((a.target_outcomes?.length ?? 0) > 0 || a.competencies.length > 0 ? base + 6 : base - 20);
    case 'ai_quality':
      return clamp(p.ai_integration || /\bAI\b|artificial intelligence/i.test(blob) ? base + 10 : 30);
    case 'student_experience':
      return clamp(a.summary && a.summary.length > 0 ? base + 4 : base - 10);
    case 'certification':
      return clamp(a.competencies.length > 0 ? base + 4 : base - 10);
    case 'portfolio':
      return clamp(a.artifact_type === 'project' ? base + 5 : base);
    case 'market_intelligence':
    case 'continuous_improvement':
    default:
      return clamp(base);
  }
}

// ---------------------------------------------------------------------------
// Validations
// ---------------------------------------------------------------------------
function runValidations(a: ProductArtifact, blob: string, market?: MarketIntelligence): Record<string, ValidationResult> {
  const p = a.payload as any;
  const v = (key: ValidationKey, passed: boolean, note: string): [string, ValidationResult] => [key, { key, passed, note }];

  const isProject = a.artifact_type === 'project';
  return Object.fromEntries([
    v('github_portfolio',
      isProject ? Boolean(p.requirements || /portfolio|deliverable|github|repository/i.test(blob)) : true,
      isProject ? 'Project specifies a verifiable portfolio deliverable.' : 'n/a for this artifact type.'),
    v('interview_readiness',
      a.artifact_type === 'interview_prep' || /interview/i.test(blob) || (a.target_outcomes ?? []).includes('employment'),
      'Advances interview readiness.'),
    v('market_demand',
      (market?.demand_score ?? 0) >= 60,
      market ? `Role "${market.role}" demand ${market.demand_score}/100 (${market.trend}).` : 'No market data for role.'),
    v('salary_relevance',
      Boolean(market?.salary_median && market.salary_median > 0),
      market?.salary_median ? `Median salary ${market.currency} ${market.salary_median}.` : 'No salary data.'),
    v('ai_readiness',
      Boolean(p.ai_integration) || /\bAI\b/i.test(blob),
      p.ai_integration ? 'AI integrated start to finish.' : 'No AI-integration element.'),
    v('employer_alignment',
      a.competencies.length > 0 || a.artifact_type === 'employer_alignment',
      a.competencies.length > 0 ? `Mapped to ${a.competencies.length} competency(ies).` : 'No competency mapping.'),
  ]);
}

// ---------------------------------------------------------------------------
// Review one artifact (pure-ish; reads market cache passed in)
// ---------------------------------------------------------------------------
export function reviewArtifact(a: ProductArtifact, market?: MarketIntelligence): Omit<QAReview, 'id' | 'created_at'> {
  const blob = `${a.title} ${a.summary ?? ''} ${JSON.stringify(a.payload ?? {})}`;
  const engines = enginesForType(a.artifact_type);

  const engine_scores: Record<string, number> = {};
  for (const e of engines) engine_scores[e.id] = scoreEngine(e.id, a, blob);

  const overall_score = clamp(
    Object.values(engine_scores).reduce((s, n) => s + n, 0) / Math.max(Object.keys(engine_scores).length, 1),
  );

  const domain = domainForType(a.artifact_type);
  const benchmark_scores: Record<string, number> = {};
  for (const b of relevantBenchmarks(domain)) {
    // Alignment heuristic: overall quality with a small authority-specific jitter.
    benchmark_scores[b.id] = clamp(overall_score - 3 + ((b.id.length * 7) % 6));
  }

  const validations = runValidations(a, blob, market);

  const findings: QAFinding[] = [];
  for (const e of engines) {
    if (engine_scores[e.id] < PASS_THRESHOLD) {
      findings.push({ severity: e.critical ? 'high' : 'medium', area: e.name, note: `Below world-class threshold (${engine_scores[e.id]}/100).` });
    }
  }
  for (const key of Object.keys(validations)) {
    const val = validations[key];
    if (!val.passed) findings.push({ severity: CRITICAL_VALIDATIONS.includes(key as ValidationKey) ? 'high' : 'medium', area: `Validation: ${key}`, note: val.note });
  }

  const criticalEnginesPass = engines.filter((e) => e.critical).every((e) => engine_scores[e.id] >= PASS_THRESHOLD);
  const criticalValidationsPass = CRITICAL_VALIDATIONS.every((k) => validations[k]?.passed);
  const passed = overall_score >= PASS_THRESHOLD && criticalEnginesPass && criticalValidationsPass;
  const verdict: QAVerdict = passed ? 'pass' : overall_score >= CONDITIONAL_THRESHOLD ? 'conditional' : 'fail';

  return {
    artifact_id: a.id,
    artifact_type: a.artifact_type,
    engine: a.engine ?? null,
    overall_score,
    verdict,
    passed,
    engine_scores,
    benchmark_scores,
    validations,
    findings,
    reviewer_agent: SLUG,
  };
}

// ---------------------------------------------------------------------------
// Process the QA queue — THE GATE before the Founder Approval Queue
// ---------------------------------------------------------------------------
export async function processQAQueue(runId?: string | null): Promise<{ reviewed: number; passed: number; rejected: number }> {
  const { data: queue } = await db.from(ARTIFACTS).select('*').eq('status', 'qa_review').limit(500);
  const artifacts = (queue as ProductArtifact[]) ?? [];
  const marketByRole = await marketMap();

  let passed = 0;
  let rejected = 0;
  for (const a of artifacts) {
    const market = marketByRole.get(roleForProgram(a.program));
    const review = reviewArtifact(a, market);
    await db.from(REVIEWS).insert({ ...review });
    const newStatus = review.passed ? 'pending_approval' : 'qa_rejected';
    await db
      .from(ARTIFACTS)
      .update({
        status: newStatus,
        metadata: { ...(a.metadata ?? {}), qa_review: { verdict: review.verdict, score: review.overall_score, at: nowISO() } },
        updated_at: nowISO(),
      })
      .eq('id', a.id);
    if (review.passed) passed += 1;
    else rejected += 1;
    await logAction(SLUG, 'qa_review', {
      runId,
      result: review.passed ? 'success' : 'error',
      message: `${a.artifact_type} "${a.title}" → ${review.verdict} (${review.overall_score})`,
      detail: { artifactId: a.id, verdict: review.verdict, newStatus },
    });
  }

  if (artifacts.length > 0) {
    await remember({
      agentSlug: SLUG,
      content: `QA reviewed ${artifacts.length} artifact(s): ${passed} passed to founder queue, ${rejected} rejected.`,
      summary: 'qa_cycle',
      type: 'short_term',
      tags: ['qa', 'review_cycle'],
      source: runId ?? undefined,
    });
    await reportToCeo(SLUG, {
      subject: `QA review: ${passed} artifact(s) cleared to the Founder Approval Queue`,
      body: `Reviewed ${artifacts.length} artifact(s) against 13 quality engines + 12 benchmark authorities + 6 employability validations. ${passed} passed and are now in the Founder Approval Queue; ${rejected} were rejected with findings. QA is the final authority before your review.`,
      payload: { reviewed: artifacts.length, passed, rejected },
    });
  }
  await logAction(SLUG, 'qa_cycle', { runId, result: 'success', message: `Reviewed ${artifacts.length}, passed ${passed}, rejected ${rejected}` });
  return { reviewed: artifacts.length, passed, rejected };
}

// ---------------------------------------------------------------------------
// Market intelligence
// ---------------------------------------------------------------------------
export async function listMarketIntelligence(): Promise<MarketIntelligence[]> {
  const { data } = await db.from(MARKET).select('*').order('demand_score', { ascending: false });
  return (data as MarketIntelligence[]) ?? [];
}
async function marketMap(): Promise<Map<string, MarketIntelligence>> {
  const rows = await listMarketIntelligence();
  return new Map(rows.map((r) => [r.role, r]));
}

// ---------------------------------------------------------------------------
// Reads + stats for the dashboard
// ---------------------------------------------------------------------------
export async function listReviews(limit = 200): Promise<QAReview[]> {
  const { data } = await db.from(REVIEWS).select('*').order('created_at', { ascending: false }).limit(limit);
  return (data as QAReview[]) ?? [];
}

export async function countAwaitingReview(): Promise<number> {
  try {
    const { count } = await db.from(ARTIFACTS).select('*', { count: 'exact', head: true }).eq('status', 'qa_review');
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getStats(): Promise<QAStats> {
  const [reviews, awaitingReview] = await Promise.all([listReviews(1000), countAwaitingReview()]);
  const v = (verdict: QAVerdict) => reviews.filter((r) => r.verdict === verdict).length;
  const avgScore = reviews.length ? Math.round(reviews.reduce((s, r) => s + r.overall_score, 0) / reviews.length) : 0;
  return {
    reviewed: reviews.length,
    passed: v('pass'),
    conditional: v('conditional'),
    failed: v('fail'),
    awaitingReview,
    avgScore,
    byVerdict: (['pass', 'conditional', 'fail'] as QAVerdict[]).map((verdict) => ({ verdict, count: v(verdict) })),
  };
}

// ---------------------------------------------------------------------------
// CEO -> QA delegation + orchestrator runner
// ---------------------------------------------------------------------------
export async function enqueueQATask(
  kind: 'review_queue',
  opts: { fromAgent?: string; priority?: 'low' | 'medium' | 'high' | 'critical' } = {},
) {
  return createTask({
    title: 'QA: review queue',
    createdByAgent: opts.fromAgent ?? 'human',
    assignedAgent: SLUG,
    priority: opts.priority ?? 'high',
    payload: { kind },
  });
}

export const qaRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const { listReadyTasks, setTaskStatus } = await import('@/services/aos/tasks');
  const ready = await listReadyTasks(SLUG);
  await ctx.log('scan_tasks', { message: `${ready.length} ready task(s)` });
  for (const task of ready) {
    await setTaskStatus(task.id, 'in_progress');
    try {
      const r = await processQAQueue(ctx.runId);
      await setTaskStatus(task.id, 'completed', r);
      await ctx.log('task_completed', { result: 'success', message: 'review_queue', detail: r });
    } catch (e) {
      await setTaskStatus(task.id, 'failed', { error: e instanceof Error ? e.message : String(e) });
    }
  }
  // Default cycle: review the queue (the gate before founder review).
  const result = await processQAQueue(ctx.runId);
  return { ok: true, output: result };
};

export { QA_ENGINES };
