// =============================================================================
// Product Builder — auto-generates DRAFT curriculum assets into the content
// tables, tied to a program's real Supabase modules (chapters). Founder reviews,
// edits, and publishes via the Authoring Center; the Curriculum Excellence
// Dashboard then measures it. For the flagship (AI Scrum Master) it pulls richer
// text from the reference code curriculum. Everything lands as status='draft'.
// =============================================================================
import { db } from '@/services/aos/_internal';
import { AI_SCRUM_MASTER_CURRICULUM as FLAG } from '@/services/agents/curriculum/programs/aiScrumMasterFull';
import { AssetType, ASSET_TYPES, metaFor, logAudit } from './contentStore';

const base = (courseId: string, author: string, extra: Record<string, any>) => ({
  course_id: courseId, author, status: 'draft', is_published: false, version: 1,
  completion_pct: 60, readiness_score: 60,
  ai_generated: true, ai_reviewed: false, human_reviewed: false, quality_score: 60,
  ...extra,
});

export async function generateAssets(courseId: string, courseTitle: string, type: AssetType, author: string): Promise<{ created: number; error?: string }> {
  const isFlag = /scrum master/i.test(courseTitle);
  let chaps: any[] = [];
  try {
    const { data } = await db.from('chapters').select('id, title, order_index').eq('course_id', courseId).order('order_index');
    chaps = data ?? [];
  } catch { /* ignore */ }

  const rows: Record<string, any>[] = [];
  const flagAt = (i: number) => (isFlag ? FLAG[i] : undefined);

  // shared per-module intelligence metadata from the reference curriculum
  const meta = (i: number) => {
    const m = flagAt(i);
    return {
      competency_tags: m?.competencies ?? [],
      learning_objectives: m?.learningObjectives ?? [],
      industry_alignment: m?.alignment ?? [],
    };
  };

  if (type === 'simulations') {
    chaps.forEach((ch, i) => {
      (['beginner', 'intermediate', 'advanced'] as const).forEach((level) => {
        const f = flagAt(i)?.simulations?.[level];
        rows.push(base(courseId, author, {
          chapter_id: ch.id, level, order_index: i, difficulty_level: level, estimated_completion_minutes: 45,
          title: f?.title ? `${f.title}` : `${ch.title} — ${level} simulation`,
          scenario_type: 'case_study', industry: f?.company ?? 'Enterprise', complexity: level, role: 'Scrum Master',
          scenario: f ? { company: f.company, conflict: f.conflict, decisionPoints: f.decisionPoints } : {},
          expected_deliverables: f?.decisionPoints ?? [], grading_rubric: f ? { scoring: f.scoring } : {},
          ...meta(i),
        }));
      });
    });
  } else if (type === 'portfolios') {
    chaps.forEach((ch, i) => rows.push(base(courseId, author, {
      chapter_id: ch.id, order_index: i, difficulty_level: 'intermediate', estimated_completion_minutes: 120,
      title: `${ch.title} — portfolio`, deliverable: flagAt(i)?.portfolioDeliverable ?? `${ch.title} deliverable`,
      portfolio_category: 'project_artifact', employer_value_score: 80, interview_relevance_score: 78, ...meta(i),
    })));
  } else if (type === 'interview') {
    chaps.forEach((ch, i) => rows.push(base(courseId, author, {
      chapter_id: ch.id, order_index: i, kind: 'behavioral', difficulty_level: 'intermediate', estimated_completion_minutes: 30,
      title: `${ch.title} — interview prep`, company_type: 'enterprise', interview_stage: 'onsite',
      questions: flagAt(i)?.interviewPrep ? [...(flagAt(i)!.interviewPrep.behavioral || []), ...(flagAt(i)!.interviewPrep.scenario || [])] : [],
      expected_answers: [], evaluation_criteria: { star: true }, ...meta(i),
    })));
  } else if (type === 'mentor') {
    chaps.forEach((ch, i) => rows.push(base(courseId, author, {
      chapter_id: ch.id, order_index: i, difficulty_level: 'all', estimated_completion_minutes: 20,
      title: `${ch.title} — AI mentor`, prompt: flagAt(i)?.aiMentorActivities?.[0] ?? `Coach the student through ${ch.title}.`,
      activity: flagAt(i)?.aiMentorActivities?.join(' · ') ?? '',
      mentor_persona: 'Prof. Didier', coaching_type: 'socratic', competency_area: flagAt(i)?.competencies?.[0] ?? '', ...meta(i),
    })));
  } else if (type === 'labs') {
    chaps.forEach((ch, i) => {
      const lab = flagAt(i)?.lab;
      rows.push(base(courseId, author, {
        chapter_id: ch.id, order_index: i, difficulty_level: 'intermediate', estimated_completion_minutes: 90,
        title: lab?.name ?? `${ch.title} — lab`, tool: lab?.tool ?? 'Jira',
        task: lab?.task ?? `Apply ${ch.title} hands-on.`, deliverable: lab?.deliverable ?? `${ch.title} artifact`,
        ...meta(i),
      }));
    });
  } else if (type === 'executive') {
    const EXEC = new Set([6, 8, 10, 13, 15, 18]); // module numbers (order_index + 1)
    chaps.forEach((ch, i) => {
      if (!EXEC.has(i + 1)) return;
      rows.push(base(courseId, author, {
        chapter_id: ch.id, order_index: i, difficulty_level: 'executive', estimated_completion_minutes: 120,
        title: `${ch.title} — Executive Simulation`, crisis_type: 'delivery',
        exec_stakeholders: ['VP Engineering', 'CPO', 'PMO Director'], board_presentation: (i + 1) === 18,
        scenario: { company: 'Enterprise', stakes: 'board-level' }, grading_rubric: {}, ...meta(i),
      }));
    });
  } else if (type === 'copilot') {
    chaps.forEach((ch, i) => rows.push(base(courseId, author, {
      chapter_id: ch.id, order_index: i, difficulty_level: 'intermediate', estimated_completion_minutes: 40,
      title: `${ch.title} — AI Co-Pilot Challenge`, ai_tool: 'AI co-pilot',
      challenge: `Use an AI co-pilot to accelerate ${ch.title}.`, expected_output: 'A reviewed, AI-assisted deliverable',
      evaluation_criteria: {}, ...meta(i),
    })));
  } else if (type === 'employer') {
    const CHECK = new Set([6, 12, 18]);
    chaps.forEach((ch, i) => {
      if (!CHECK.has(i + 1)) return;
      rows.push(base(courseId, author, {
        chapter_id: ch.id, order_index: i, difficulty_level: 'checkpoint', estimated_completion_minutes: 60,
        title: `Employer Validation — after ${ch.title}`, employer: 'Aladiah employer panel',
        checkpoint: `Checkpoint at module ${i + 1}`, validation_criteria: {}, ...meta(i),
      }));
    });
  } else if (type === 'capstones') {
    rows.push(base(courseId, author, {
      title: `${courseTitle} Capstone`, brief: `Integrate every competency from ${courseTitle} into one capstone deliverable.`,
      project_type: 'integrative', business_domain: 'Agile delivery', estimated_hours: 40, difficulty_level: 'advanced',
    }));
  } else if (type === 'certifications') {
    rows.push(base(courseId, author, {
      credential_name: `${courseTitle} Professional Certification`, passing_score: 85, exam_duration: 90,
      credential_level: 'professional', difficulty_level: 'advanced', exam_blueprint: {}, completion_logic: {},
    }));
  }

  if (!rows.length) return { created: 0, error: type !== 'capstones' && type !== 'certifications' ? 'No modules (chapters) found for this program — add modules first.' : undefined };

  // Idempotency: skip assets that already exist (deterministic key) so reruns
  // never duplicate. Module assets key on chapter (+ level for sims); program
  // assets (capstone/cert) key on the program (one each).
  const keyOf = (r: any) => type === 'simulations'
    ? `${r.chapter_id ?? ''}|${r.level ?? ''}`
    : (type === 'capstones' || type === 'certifications') ? 'program' : `${r.chapter_id ?? ''}`;
  const existing = new Set<string>();
  try {
    const cols = type === 'simulations' ? 'chapter_id, level' : (type === 'capstones' || type === 'certifications') ? 'id' : 'chapter_id';
    const { data } = await db.from(metaFor(type).table).select(cols).eq('course_id', courseId).limit(10000);
    (data ?? []).forEach((r: any) => existing.add(keyOf(r)));
  } catch { /* table absent */ }
  const newRows = rows.filter((r) => !existing.has(keyOf(r)));
  if (!newRows.length) return { created: 0 };

  try {
    const { error } = await db.from(metaFor(type).table).insert(newRows);
    if (error) throw error;
    await logAudit('generate', type, null, courseId, author, { created: newRows.length });
    return { created: newRows.length };
  } catch (e: any) {
    return { created: 0, error: e?.message || 'Generate failed (is the migration applied?)' };
  }
}

/** Bulk: draft every asset type for a program in one pass. */
export async function generateAllAssets(courseId: string, courseTitle: string, author: string): Promise<{ total: number; byType: Record<string, number>; error?: string }> {
  const byType: Record<string, number> = {};
  let total = 0; let error: string | undefined;
  for (const m of ASSET_TYPES) {
    const r = await generateAssets(courseId, courseTitle, m.type, author);
    byType[m.type] = r.created; total += r.created;
    if (r.error && !error) error = r.error;
  }
  return { total, byType, error };
}
