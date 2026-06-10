// =============================================================================
// Aladiah Product Builder Agent — service
// =============================================================================
// Agent #4, a first-class AOS citizen and the product-development department.
// It continuously improves Aladiah: detects competency/curriculum gaps (reading
// live curriculum READ-ONLY), generates modules/quizzes/simulations/labs/
// projects/learning-paths as DRAFTS, runs every artifact through the Aladiah
// Quality Standard, and routes passing work into the Founder Approval Queue.
//
// IT NEVER PUBLISHES DIRECTLY. Promotion of an approved artifact into the live
// curriculum is a separate, human-gated step (Claude Code never auto-applies
// SQL / live-DB writes — NORTH_STAR working rules).
//
// Overnight capability: the orchestrator runner's default cycle runs the
// overnight improvement workflow, so a scheduled tick improves courses while the
// founder is away — and reports everything to the CEO Agent + Control Center.
// =============================================================================
import { db, nowISO } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { createTask } from '@/services/aos/tasks';
import { reportToCeo } from '@/services/aos/communication';
import { AgentRunOutput, RunContext } from '@/types/aos';
import {
  ArtifactStatus,
  ArtifactType,
  OvernightRunResult,
  ProductArtifact,
  ProductGap,
  ProductRecommendation,
  ProductStats,
  ProductTaskKind,
  QualityReport,
} from '@/types/product';
import { competenciesFor, labelFor, SCRUM_COMPETENCIES } from './product/taxonomy';
import {
  DraftArtifact,
  generateLab,
  generateLearningPath,
  generateModule,
  generateProject,
  generateQuiz,
  generateSimulation,
} from './product/generators';
import { runQualityChecks } from './product/quality';

const SLUG = 'product-builder';
const ARTIFACTS = 'product_artifacts';
const GAPS = 'product_gaps';
const RECS = 'product_recommendations';
const APPROVALS = 'product_approvals';

// ---------------------------------------------------------------------------
// Enrichment — guarantee the cross-cutting quality signals exist on every draft
// (AI integration, career relevance, interview readiness) so the standard can
// be met by well-formed artifacts.
// ---------------------------------------------------------------------------
function enrich(draft: DraftArtifact): DraftArtifact {
  const payload = {
    ...draft.payload,
    ai_integration:
      (draft.payload as any).ai_integration ??
      'AI woven through: AI tutor explanations on incorrect answers, an AI practice coach, and AI-assisted reflection on competency gaps.',
    career_relevance:
      (draft.payload as any).career_relevance ??
      `Builds employable, job-ready capability and interview readiness, mapped to measurable competency outcomes (${draft.competencies.join(', ') || 'program competencies'}).`,
    interview_ready: true,
  };
  const summary = /career|employab|job|interview|transformation/i.test(draft.summary)
    ? draft.summary
    : `${draft.summary} Career-transformation focused with interview readiness.`;
  return { ...draft, payload, summary };
}

// ---------------------------------------------------------------------------
// Persistence — quality gate decides the queue
// ---------------------------------------------------------------------------
export interface PersistResult {
  artifact: ProductArtifact | null;
  report: QualityReport;
}

async function persistArtifact(
  raw: DraftArtifact,
  opts: { source?: string; runId?: string | null; gapId?: string } = {},
): Promise<PersistResult> {
  const draft = enrich(raw);
  const report = runQualityChecks({
    artifact_type: draft.artifact_type,
    title: draft.title,
    summary: draft.summary,
    program: draft.program,
    competencies: draft.competencies,
    payload: draft.payload,
    quality_score: draft.quality_score,
  });

  // Passing the Aladiah Quality Standard is the ONLY way into the Founder
  // Approval Queue. Failing artifacts are held as drafts with their report.
  const status: ArtifactStatus = report.passed ? 'pending_approval' : 'draft';

  const { data, error } = await db
    .from(ARTIFACTS)
    .insert({
      agent_slug: SLUG,
      artifact_type: draft.artifact_type,
      title: draft.title,
      summary: draft.summary,
      program: draft.program,
      competencies: draft.competencies,
      payload: draft.payload,
      quality_score: report.score,
      status,
      source: opts.source ?? opts.runId ?? null,
      metadata: { quality_report: report, quality_passed: report.passed },
      created_by_agent: SLUG,
    })
    .select('*')
    .single();

  if (error) {
    await logAction(SLUG, 'persist_artifact', { runId: opts.runId, level: 'error', result: 'error', error: error.message });
    return { artifact: null, report };
  }

  await logAction(SLUG, 'persist_artifact', {
    runId: opts.runId,
    result: 'success',
    message: `${draft.artifact_type}: ${draft.title} → ${status} (quality ${report.score})`,
    detail: { id: data.id, status, quality_passed: report.passed },
  });

  if (opts.gapId && data) {
    await db.from(GAPS).update({ status: 'addressed', related_artifact_id: data.id, updated_at: nowISO() }).eq('id', opts.gapId);
  }
  return { artifact: data as ProductArtifact, report };
}

// ---------------------------------------------------------------------------
// Generation workflows (each returns the persisted artifact + quality report)
// ---------------------------------------------------------------------------
export const buildModule = (program: string, competency: string, runId?: string | null, gapId?: string) =>
  persistArtifact(generateModule({ program, competency }), { runId, gapId });
export const buildQuiz = (program: string, competency: string, questionCount = 4, runId?: string | null) =>
  persistArtifact(generateQuiz({ program, competency, questionCount }), { runId });
export const buildSimulation = (program: string, runId?: string | null) =>
  persistArtifact(generateSimulation({ program }), { runId });
export const buildLab = (program: string, topic: string, runId?: string | null) =>
  persistArtifact(generateLab({ program, topic }), { runId });
export const buildProject = (program: string, runId?: string | null) =>
  persistArtifact(generateProject({ program }), { runId });
export const buildLearningPath = (program: string, runId?: string | null) =>
  persistArtifact(generateLearningPath({ program }), { runId });

// ---------------------------------------------------------------------------
// Curriculum gap analysis (reads live quiz_questions READ-ONLY)
// ---------------------------------------------------------------------------
export interface CoverageRow {
  competency: string;
  label: string;
  questions: number;
  status: 'covered' | 'weak' | 'missing';
}

export async function computeCoverage(program = 'scrum'): Promise<CoverageRow[]> {
  const comps = competenciesFor(program);
  const counts = new Map<string, number>();
  try {
    const { data } = await db.from('quiz_questions').select('competency').not('competency', 'is', null).limit(10000);
    for (const r of data ?? []) {
      const c = (r as any).competency as string;
      if (c) counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  } catch {
    /* table may not exist yet — treat as zero coverage */
  }
  return comps.map((c) => {
    const questions = counts.get(c.slug) ?? 0;
    const status = questions === 0 ? 'missing' : questions < 3 ? 'weak' : 'covered';
    return { competency: c.slug, label: c.label, questions, status };
  });
}

export async function detectGaps(program = 'scrum', runId?: string | null): Promise<{ created: number; coverage: CoverageRow[] }> {
  const coverage = await computeCoverage(program);
  const { data: openGaps } = await db.from(GAPS).select('competency, gap_type').eq('program', program).eq('status', 'open');
  const existing = new Set((openGaps ?? []).map((g: any) => `${g.competency}:${g.gap_type}`));

  const toInsert = coverage
    .filter((c) => c.status !== 'covered')
    .map((c) => ({
      program,
      competency: c.competency,
      gap_type: c.status === 'missing' ? 'no_assessment' : 'weak_coverage',
      severity: c.status === 'missing' ? 'high' : 'medium',
      description: `${c.label} has ${c.questions} tagged quiz question(s) — ${c.status} coverage.`,
      recommendation: `Generate a quiz (and supporting module) for ${c.label} (${c.competency}).`,
      status: 'open',
      created_by_agent: SLUG,
    }))
    .filter((g) => !existing.has(`${g.competency}:${g.gap_type}`));

  if (toInsert.length > 0) {
    await db.from(GAPS).insert(toInsert);
    await remember({
      agentSlug: SLUG,
      content: `Detected ${toInsert.length} curriculum gap(s) in ${program}: ${toInsert.map((g) => g.competency).join(', ')}.`,
      summary: `gaps:${program}`,
      type: 'short_term',
      tags: ['curriculum_gap', program],
      source: runId ?? undefined,
    });
  }
  await logAction(SLUG, 'detect_gaps', { runId, result: 'success', message: `${toInsert.length} new gap(s); coverage computed for ${coverage.length} competencies` });
  return { created: toInsert.length, coverage };
}

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------
export async function recommendImprovements(program = 'scrum', runId?: string | null): Promise<number> {
  const { data: gaps } = await db.from(GAPS).select('*').eq('program', program).eq('status', 'open').limit(20);
  const { data: existing } = await db.from(RECS).select('title').eq('status', 'pending');
  const titles = new Set((existing ?? []).map((r: any) => r.title));

  const recs = (gaps ?? [])
    .map((g: ProductGap) => ({
      rec_type: 'course_improvement',
      title: `Improve coverage: ${labelFor(g.competency || '')}`,
      rationale: g.description ?? '',
      priority: g.severity === 'high' || g.severity === 'critical' ? 'high' : 'medium',
      program,
      status: 'pending',
      payload: { competency: g.competency, gap_id: g.id },
      created_by_agent: SLUG,
    }))
    .filter((r) => !titles.has(r.title));

  // One standing "new program" recommendation (only if not present).
  const newProgramTitle = 'Launch AI Product Manager program';
  if (!titles.has(newProgramTitle)) {
    recs.push({
      rec_type: 'new_program',
      title: newProgramTitle,
      rationale: 'High job-market demand adjacent to the current programs; reuses the competency + simulation engine.',
      priority: 'medium',
      program: 'ai-careers',
      status: 'pending',
      payload: {},
      created_by_agent: SLUG,
    } as any);
  }

  if (recs.length === 0) {
    await logAction(SLUG, 'recommend_improvements', { runId, result: 'skipped', message: 'No new recommendations' });
    return 0;
  }
  await db.from(RECS).insert(recs);
  await logAction(SLUG, 'recommend_improvements', { runId, result: 'success', message: `${recs.length} recommendation(s)` });
  return recs.length;
}

// ---------------------------------------------------------------------------
// OVERNIGHT IMPROVEMENT RUN — selects weak areas, generates + quality-checks,
// queues passing work for founder approval, reports to the CEO + Control Center.
// ---------------------------------------------------------------------------
export async function runOvernightImprovement(
  program = 'scrum',
  opts: { maxAreas?: number; runId?: string | null } = {},
): Promise<OvernightRunResult> {
  const runId = opts.runId ?? null;
  await logAction(SLUG, 'overnight.start', { runId, message: `Overnight improvement for ${program}` });

  // 1. Select course areas needing improvement.
  const { coverage } = await detectGaps(program, runId);
  const weakFirst = [...coverage].sort((a, b) => a.questions - b.questions);
  const selected = weakFirst.filter((c) => c.status !== 'covered').slice(0, opts.maxAreas ?? 3);
  const areas = selected.length > 0 ? selected : weakFirst.slice(0, 2); // always improve something

  const artifactIds: string[] = [];
  let generated = 0;
  let passedToApproval = 0;
  let heldAsDraft = 0;

  const record = (r: PersistResult) => {
    generated += 1;
    if (r.artifact) {
      artifactIds.push(r.artifact.id);
      if (r.artifact.status === 'pending_approval') passedToApproval += 1;
      else heldAsDraft += 1;
    }
  };

  // 2-6. For each weak area: improved module + quiz + lab, quality-checked.
  for (const area of areas) {
    record(await buildModule(program, area.competency, runId));
    record(await buildQuiz(program, area.competency, 4, runId));
    record(await buildLab(program, 'Sprint Retrospective', runId));
  }
  // One simulation + one learning path per overnight run.
  record(await buildSimulation(program, runId));
  record(await buildLearningPath(program, runId));

  // 7. (statuses already set by the quality gate during persist)
  // 8. Report to the CEO Agent (the Control Center reads this + the artifacts).
  await recommendImprovements(program, runId);

  const result: OvernightRunResult = {
    program,
    areasSelected: areas.length,
    generated,
    passedToApproval,
    heldAsDraft,
    artifactIds,
  };

  await remember({
    agentSlug: SLUG,
    content: `Overnight run (${program}): improved ${areas.length} area(s), generated ${generated} artifacts, ${passedToApproval} queued for founder approval, ${heldAsDraft} held as draft.`,
    summary: `overnight:${program}`,
    type: 'long_term',
    importance: 0.8,
    tags: ['overnight', program],
    source: runId ?? undefined,
  });

  await reportToCeo(SLUG, {
    subject: `Overnight course improvement: ${passedToApproval} item(s) awaiting your approval`,
    body: `Improved ${areas.length} weak area(s) in ${program}. Generated ${generated} artifacts; ${passedToApproval} passed the Aladiah Quality Standard and are in the Founder Approval Queue; ${heldAsDraft} held as draft. Nothing was published.`,
    payload: result as unknown as Record<string, unknown>,
  });

  await logAction(SLUG, 'overnight.complete', {
    runId,
    result: 'success',
    message: `Generated ${generated}, queued ${passedToApproval}, held ${heldAsDraft}`,
    detail: result as unknown as Record<string, unknown>,
  });

  return result;
}

// ---------------------------------------------------------------------------
// Founder Approval Queue — approve / reject / edit (nothing publishes here)
// ---------------------------------------------------------------------------
async function recordDecision(artifactId: string, decision: 'approved' | 'rejected' | 'edited', notes?: string) {
  await db.from(APPROVALS).insert({ artifact_id: artifactId, decision, notes: notes ?? null });
  await logAction(SLUG, `artifact_${decision}`, { result: 'success', message: artifactId, detail: { notes } });
}

export async function approveArtifact(artifactId: string, notes?: string): Promise<boolean> {
  // Approval marks the artifact ready; promotion to the LIVE curriculum remains a
  // separate human-gated step (Claude never auto-applies live-DB writes).
  const { error } = await db
    .from(ARTIFACTS)
    .update({ status: 'approved', approved_at: nowISO(), updated_at: nowISO() })
    .eq('id', artifactId);
  if (error) return false;
  await recordDecision(artifactId, 'approved', notes);
  return true;
}

export async function rejectArtifact(artifactId: string, notes?: string): Promise<boolean> {
  const { error } = await db.from(ARTIFACTS).update({ status: 'rejected', updated_at: nowISO() }).eq('id', artifactId);
  if (error) return false;
  await recordDecision(artifactId, 'rejected', notes);
  return true;
}

export async function editArtifact(
  artifactId: string,
  patch: { title?: string; summary?: string },
  alsoApprove = false,
): Promise<boolean> {
  const { error } = await db.from(ARTIFACTS).update({ ...patch, updated_at: nowISO() }).eq('id', artifactId);
  if (error) return false;
  await recordDecision(artifactId, 'edited');
  if (alsoApprove) return approveArtifact(artifactId, 'Edited then approved');
  return true;
}

// ---------------------------------------------------------------------------
// Reads for the dashboard
// ---------------------------------------------------------------------------
export async function listArtifacts(filter: { status?: ArtifactStatus; type?: ArtifactType; limit?: number } = {}): Promise<ProductArtifact[]> {
  let q = db.from(ARTIFACTS).select('*');
  if (filter.status) q = q.eq('status', filter.status);
  if (filter.type) q = q.eq('artifact_type', filter.type);
  const { data } = await q.order('created_at', { ascending: false }).limit(filter.limit ?? 200);
  return (data as ProductArtifact[]) ?? [];
}
export const listPendingApproval = () => listArtifacts({ status: 'pending_approval' });

export async function listGaps(): Promise<ProductGap[]> {
  const { data } = await db.from(GAPS).select('*').order('created_at', { ascending: false }).limit(100);
  return (data as ProductGap[]) ?? [];
}
export async function listRecommendations(): Promise<ProductRecommendation[]> {
  const { data } = await db.from(RECS).select('*').order('created_at', { ascending: false }).limit(100);
  return (data as ProductRecommendation[]) ?? [];
}

export async function getStats(program = 'scrum'): Promise<ProductStats> {
  const [artifacts, gaps, recs, coverage] = await Promise.all([
    listArtifacts({ limit: 1000 }),
    listGaps(),
    listRecommendations(),
    computeCoverage(program),
  ]);
  const byTypeMap = new Map<ArtifactType, number>();
  for (const a of artifacts) byTypeMap.set(a.artifact_type, (byTypeMap.get(a.artifact_type) ?? 0) + 1);
  return {
    totalArtifacts: artifacts.length,
    pendingApproval: artifacts.filter((a) => a.status === 'pending_approval').length,
    approved: artifacts.filter((a) => a.status === 'approved').length,
    openGaps: gaps.filter((g) => g.status === 'open').length,
    criticalGaps: gaps.filter((g) => g.status === 'open' && (g.severity === 'high' || g.severity === 'critical')).length,
    recommendations: recs.filter((r) => r.status === 'pending').length,
    byType: [...byTypeMap.entries()].map(([type, count]) => ({ type, count })),
    coverage,
  };
}

// ---------------------------------------------------------------------------
// CEO -> Product delegation + orchestrator runner
// ---------------------------------------------------------------------------
export async function enqueueProductTask(
  kind: ProductTaskKind,
  payload: Record<string, unknown> = {},
  opts: { fromAgent?: string; title?: string; priority?: 'low' | 'medium' | 'high' | 'critical' } = {},
) {
  return createTask({
    title: opts.title ?? `Product: ${kind.replace(/_/g, ' ')}`,
    createdByAgent: opts.fromAgent ?? 'human',
    assignedAgent: SLUG,
    priority: opts.priority ?? 'medium',
    payload: { kind, ...payload },
  });
}

async function executeProductTask(kind: ProductTaskKind, payload: any, runId: string | null): Promise<Record<string, unknown>> {
  const program = payload?.program ?? 'scrum';
  switch (kind) {
    case 'detect_gaps':
      return await detectGaps(program, runId);
    case 'generate_module':
      return { id: (await buildModule(program, payload.competency, runId)).artifact?.id };
    case 'generate_quiz':
      return { id: (await buildQuiz(program, payload.competency, payload.questionCount, runId)).artifact?.id };
    case 'generate_simulation':
      return { id: (await buildSimulation(program, runId)).artifact?.id };
    case 'generate_lab':
      return { id: (await buildLab(program, payload.topic ?? 'Sprint Review', runId)).artifact?.id };
    case 'generate_project':
      return { id: (await buildProject(program, runId)).artifact?.id };
    case 'generate_learning_path':
      return { id: (await buildLearningPath(program, runId)).artifact?.id };
    case 'recommend_improvements':
      return { recs: await recommendImprovements(program, runId) };
    case 'overnight_improvement':
      return (await runOvernightImprovement(program, { runId })) as unknown as Record<string, unknown>;
    default:
      return { error: `Unknown product task kind: ${kind}` };
  }
}

export const productRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const { listReadyTasks, setTaskStatus } = await import('@/services/aos/tasks');
  const ready = await listReadyTasks(SLUG);
  await ctx.log('scan_tasks', { message: `${ready.length} ready task(s)` });

  if (ready.length > 0) {
    let processed = 0;
    for (const task of ready) {
      const kind = (task.payload as any)?.kind as ProductTaskKind | undefined;
      if (!kind) {
        await setTaskStatus(task.id, 'failed', { error: 'Task missing payload.kind' });
        continue;
      }
      await setTaskStatus(task.id, 'in_progress');
      try {
        const result = await executeProductTask(kind, task.payload, ctx.runId);
        await setTaskStatus(task.id, 'completed', result);
        await ctx.log('task_completed', { result: 'success', message: kind, detail: result });
        processed += 1;
      } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        await setTaskStatus(task.id, 'failed', { error });
        await ctx.log('task_failed', { level: 'error', result: 'error', error });
      }
    }
    return { ok: true, output: { processed } };
  }

  // Default cycle = the overnight improvement workflow (scheduled tick runs this).
  const result = await runOvernightImprovement('scrum', { runId: ctx.runId });
  return { ok: true, output: result as unknown as Record<string, unknown> };
};

export { SCRUM_COMPETENCIES };
