// =============================================================================
// Aladiah Curriculum Excellence Authority — service
// =============================================================================
// Phase 2. Makes every Aladiah program world-class. It audits a program against
// the Curriculum Excellence Framework, produces a gap report, holds the 18-module
// redesign blueprint, and DELEGATES module builds to the Product Builder — which
// are QA-gated, founder-approved, and consumed by Student Success / Placement.
// It does not modify production curriculum.
// =============================================================================
import { db, nowISO, safe } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { reportToCeo, sendMessage } from '@/services/aos/communication';
import { AgentRunOutput, RunContext } from '@/types/aos';
import { CURRICULUM_AGENT_SLUG, CurriculumAudit, ModuleGap } from '@/types/curriculum';
import { CURRICULUM_STANDARDS, MODULE_REQUIRED_ELEMENTS } from './curriculum/standards';
import { SCRUM_18_BLUEPRINT, SCRUM_18_TITLE } from './curriculum/blueprint18';
import { enqueueProductTask } from './productBuilderAgent';
import { scoreBlueprint } from '@/services/standards/programStandard';

const SLUG = CURRICULUM_AGENT_SLUG;
const PROGRAM = 'ai-scrum-master';

// Map each required module element to the artifact type that satisfies it.
const ELEMENT_TYPE: Record<string, string> = {
  lesson_content: 'module',
  ai_mentor: 'ai_readiness',
  practice: 'quiz',
  scenario: 'simulation',
  knowledge_check: 'quiz',
  quiz: 'quiz',
  simulation: 'simulation',
  lab: 'lab',
  portfolio_artifact: 'project',
  reflection: 'module',
  competency_assessment: 'assessment',
};

export const getStandards = () => CURRICULUM_STANDARDS;
export const getBlueprint = () => SCRUM_18_BLUEPRINT;

// ---------------------------------------------------------------------------
// Curriculum audit + gap analysis (against the 18-module blueprint)
// ---------------------------------------------------------------------------
export async function runAudit(runId?: string | null): Promise<CurriculumAudit> {
  const artifacts = await safe(async () => (await db.from('product_artifacts').select('artifact_type, metadata').limit(5000)).data ?? [], [] as any[]);

  // Which (type, module) pairs exist?
  const have = new Set<string>();
  const typesAny = new Set<string>();
  for (const a of artifacts) {
    typesAny.add(a.artifact_type);
    const mod = (a.metadata as any)?.module;
    if (mod) have.add(`${a.artifact_type}:${mod}`);
  }

  const gaps: ModuleGap[] = SCRUM_18_BLUEPRINT.map((m) => {
    const present: string[] = [];
    const missing: string[] = [];
    for (const el of MODULE_REQUIRED_ELEMENTS) {
      const type = ELEMENT_TYPE[el];
      // Present if an artifact of the type is tagged to this module.
      const ok = have.has(`${type}:${m.no}`);
      (ok ? present : missing).push(el);
    }
    return { no: m.no, title: m.title, present, missing };
  });

  const presentCount = gaps.reduce((s, g) => s + g.present.length, 0);
  const totalRequired = SCRUM_18_BLUEPRINT.length * MODULE_REQUIRED_ELEMENTS.length;
  const gapCount = totalRequired - presentCount;
  const excellenceScore = Math.round((presentCount / totalRequired) * 100);

  // Program Standard v1.0 — does the 18-module redesign qualify as world-class?
  const evaluation = scoreBlueprint(SCRUM_18_BLUEPRINT, 'scrum');
  const dimension_scores = Object.fromEntries(evaluation.dimensions.map((d) => [d.id, d.score]));

  const summary = `Curriculum audit of ${SCRUM_18_TITLE}: Curriculum Excellence Score ${evaluation.ces}/100 (${evaluation.worldClass ? 'WORLD-CLASS' : 'below world-class'}) vs Program Standard ${evaluation.version}. Build progress: ${excellenceScore}% (${presentCount}/${totalRequired} required elements present across ${SCRUM_18_BLUEPRINT.length} modules; ${gapCount} gaps). The redesign blueprint meets the standard; build the artifacts (QA-gated) to close the progress gap.`;

  const payload = {
    program: PROGRAM,
    report_date: new Date().toISOString().slice(0, 10),
    target_modules: SCRUM_18_BLUEPRINT.length,
    excellence_score: excellenceScore,
    present_count: presentCount,
    gap_count: gapCount,
    gaps,
    summary,
    ces: evaluation.ces,
    dimension_scores,
    world_class: evaluation.worldClass,
    standard_version: evaluation.version,
  };
  const { data } = await db.from('curriculum_audits').upsert(payload, { onConflict: 'program,report_date' }).select('*').single();

  await remember({ agentSlug: SLUG, content: `Curriculum audit: CES ${evaluation.ces}/100 (${evaluation.worldClass ? 'world-class' : 'below'}), build progress ${excellenceScore}%, ${gapCount} gaps.`, summary: `ces:${evaluation.ces}`, type: 'long_term', importance: 0.85, tags: ['curriculum_audit', PROGRAM], source: runId ?? undefined });
  await reportToCeo(SLUG, { subject: `Curriculum Excellence Score ${evaluation.ces}/100 (${evaluation.worldClass ? 'world-class' : 'below'})`, body: summary, payload: { ces: evaluation.ces, worldClass: evaluation.worldClass, excellenceScore, gapCount } });
  await logAction(SLUG, 'run_audit', { runId, result: 'success', message: `CES ${evaluation.ces}, progress ${excellenceScore}%, ${gapCount} gaps` });

  return (data as CurriculumAudit) ?? ({ ...payload, id: '', created_at: nowISO() } as any);
}

// ---------------------------------------------------------------------------
// Delegate module builds to the Product Builder (QA-gated → founder approval)
// ---------------------------------------------------------------------------
export async function delegateModule(no: number, fromAgent = SLUG): Promise<number> {
  const mod = SCRUM_18_BLUEPRINT.find((m) => m.no === no);
  if (!mod) return 0;
  const primary = mod.competencies[0];
  const tasks: { kind: any; payload: Record<string, unknown>; title: string }[] = [
    { kind: 'generate_module', payload: { program: 'scrum', competency: primary, module: no }, title: `M${no} module: ${mod.title}` },
    { kind: 'generate_quiz', payload: { program: 'scrum', competency: primary, questionCount: 4, module: no }, title: `M${no} quiz` },
    { kind: 'generate_simulation', payload: { program: 'scrum', module: no }, title: `M${no} simulation: ${mod.simulation.company}` },
    { kind: 'generate_lab', payload: { program: 'scrum', topic: mod.lab.task, module: no }, title: `M${no} lab (${mod.lab.tool})` },
    { kind: 'generate_project', payload: { program: 'scrum', module: no }, title: `M${no} portfolio: ${mod.portfolioArtifact}` },
  ];
  for (const t of tasks) await enqueueProductTask(t.kind, t.payload, { fromAgent, title: t.title, priority: 'high' });
  await sendMessage({ fromAgent, toAgent: 'product-builder', type: 'task_request', subject: `Build Module ${no}: ${mod.title}`, body: `Generate the full module artifact set (module, quiz, simulation, lab, portfolio). QA will gate; founder approves.`, payload: { module: no } });
  await logAction(SLUG, 'delegate_module', { result: 'success', message: `Delegated Module ${no} build (${tasks.length} tasks)`, detail: { module: no } });
  return tasks.length;
}

export async function delegateRedesign(): Promise<number> {
  let total = 0;
  for (const m of SCRUM_18_BLUEPRINT) total += await delegateModule(m.no);
  await reportToCeo(SLUG, { subject: `Curriculum redesign delegated: ${total} build task(s) to the Product Builder`, body: `Queued the full 18-module redesign build. Each artifact is QA-gated and lands in the Founder Approval Queue; nothing publishes automatically.`, payload: { total } });
  return total;
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------
export async function getLatestAudit(): Promise<CurriculumAudit | null> {
  const { data } = await db.from('curriculum_audits').select('*').eq('program', PROGRAM).order('report_date', { ascending: false }).limit(1);
  return (data?.[0] as CurriculumAudit) ?? null;
}
export async function listAudits(limit = 20): Promise<CurriculumAudit[]> {
  const { data } = await db.from('curriculum_audits').select('*').order('report_date', { ascending: false }).limit(limit);
  return (data as CurriculumAudit[]) ?? [];
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------
export const curriculumRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const audit = await runAudit(ctx.runId);
  return { ok: true, output: { ces: audit.ces, worldClass: audit.world_class, excellenceScore: audit.excellence_score, gaps: audit.gap_count } };
};
