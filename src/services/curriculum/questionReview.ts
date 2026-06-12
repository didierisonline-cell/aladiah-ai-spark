// =============================================================================
// Question Review + Module Readiness — data layer for the Founder Portal.
// 100% live Supabase; reads quiz_questions directly (founder RLS) and rolls up
// per-module readiness across lessons, approved quiz questions, simulations,
// projects (labs), interview scenarios, portfolio work, and certification.
// Defensive: a missing table or absent migration degrades to zero, never throws.
// =============================================================================
import { db } from '@/services/aos/_internal';
import { listManagedCourses, type ManagedCourse } from './courses';

export type QuestionStatus = 'draft' | 'in_review' | 'approved' | 'archived';
export type ReviewAction = 'approve' | 'review' | 'reject' | 'archive';

export interface ReviewQuestion {
  id: string;
  quiz_id: string;
  module: number;          // chapter order_index (1-based for display)
  moduleTitle: string;
  question_text: string;
  scenario_context: string | null;
  options: string[];
  correct_answer_index: number;
  explanation: string | null;
  competency: string | null;
  topic: string | null;
  difficulty: string | null;
  status: QuestionStatus;
  version: number;
  created_at: string | null;
}

export interface QuestionFilters {
  courseId?: string;
  module?: number;             // chapter order_index
  competency?: string;
  status?: QuestionStatus;
  difficulty?: string;
}

export interface ModuleOption { module: number; title: string; quizId: string | null; }

// "Ready" bar per module (the Aladiah Program Standard, per-module slice).
export const PER_MODULE_TARGET = {
  lessons: 9,        // 162 lessons / 18 modules
  questions: 300,    // approved question bank per module (300–400 range)
  simulations: 3,    // 54 / 18
  projects: 1,       // 18 labs / 18 modules
  interview: 1,      // 18 / 18
  portfolio: 1,      // 18 / 18
} as const;

const pctOf = (have: number, target: number) =>
  target > 0 ? Math.min(100, Math.round((have / target) * 100)) : 100;

// ---- Courses + modules (for the filter dropdowns) ---------------------------

export async function loadReviewCourses(): Promise<ManagedCourse[]> {
  try { return await listManagedCourses(); } catch { return []; }
}

/** Modules (chapters) of a course + the chapter_end quiz id of each. */
export async function loadModules(courseId: string): Promise<ModuleOption[]> {
  try {
    const { data: chapters } = await db
      .from('chapters').select('id, title, order_index')
      .eq('course_id', courseId).order('order_index');
    const chaps = (chapters ?? []) as any[];
    const { data: quizzes } = await db
      .from('quizzes').select('id, chapter_id, quiz_type')
      .in('chapter_id', chaps.map((c) => c.id)).eq('quiz_type', 'chapter_end');
    const quizByChap = new Map<string, string>();
    (quizzes ?? []).forEach((q: any) => { if (!quizByChap.has(q.chapter_id)) quizByChap.set(q.chapter_id, q.id); });
    return chaps.map((c, i) => ({
      module: c.order_index ?? i + 1,
      title: c.title,
      quizId: quizByChap.get(c.id) ?? null,
    }));
  } catch { return []; }
}

// ---- Question queue ---------------------------------------------------------

/** List questions for the review queue, filtered. Founder RLS required. */
export async function listQuestions(filters: QuestionFilters): Promise<ReviewQuestion[]> {
  if (!filters.courseId) return [];
  const modules = await loadModules(filters.courseId);
  // restrict to the chapter_end quizzes of this course (and one module if chosen)
  const scoped = typeof filters.module === 'number'
    ? modules.filter((m) => m.module === filters.module)
    : modules;
  const quizIds = scoped.map((m) => m.quizId).filter(Boolean) as string[];
  if (!quizIds.length) return [];
  const titleByQuiz = new Map<string, { module: number; title: string }>();
  scoped.forEach((m) => { if (m.quizId) titleByQuiz.set(m.quizId, { module: m.module, title: m.title }); });

  try {
    let q = db.from('quiz_questions')
      .select('id, quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, competency, topic, difficulty, status, version, created_at')
      .in('quiz_id', quizIds)
      .order('created_at', { ascending: false })
      .limit(2000);
    if (filters.status) q = q.eq('status', filters.status);
    if (filters.difficulty) q = q.eq('difficulty', filters.difficulty);
    if (filters.competency) q = q.ilike('competency', `%${filters.competency}%`);
    const { data, error } = await q;
    if (error || !data) return [];
    return (data as any[]).map((r) => {
      const meta = titleByQuiz.get(r.quiz_id) ?? { module: 0, title: '—' };
      return {
        id: r.id, quiz_id: r.quiz_id, module: meta.module, moduleTitle: meta.title,
        question_text: r.question_text, scenario_context: r.scenario_context ?? null,
        options: Array.isArray(r.options) ? r.options : [],
        correct_answer_index: r.correct_answer_index ?? 0,
        explanation: r.explanation ?? null, competency: r.competency ?? null,
        topic: r.topic ?? null, difficulty: r.difficulty ?? null,
        status: (r.status ?? 'draft') as QuestionStatus,
        version: r.version ?? 1, created_at: r.created_at ?? null,
      };
    });
  } catch { return []; }
}

/** Status counts for the queue tabs (respects course/module filters only). */
export function tallyByStatus(rows: ReviewQuestion[]): Record<QuestionStatus, number> {
  const t: Record<QuestionStatus, number> = { draft: 0, in_review: 0, approved: 0, archived: 0 };
  rows.forEach((r) => { t[r.status] = (t[r.status] ?? 0) + 1; });
  return t;
}

/** Apply a bulk workflow transition, stamping reviewer provenance. */
export async function bulkSetStatus(
  ids: string[], action: ReviewAction, reviewer: string,
): Promise<{ updated: number; error?: string }> {
  if (!ids.length) return { updated: 0 };
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = {};
  switch (action) {
    case 'approve':
      patch.status = 'approved'; patch.approved_by = reviewer; patch.approved_at = now;
      patch.reviewed_by = reviewer; patch.reviewed_at = now; break;
    case 'review':
      patch.status = 'in_review'; patch.reviewed_by = reviewer; patch.reviewed_at = now; break;
    case 'reject':
      // back to author for rework; clear any prior approval
      patch.status = 'draft'; patch.reviewed_by = reviewer; patch.reviewed_at = now;
      patch.approved_by = null; patch.approved_at = null; break;
    case 'archive':
      patch.status = 'archived'; patch.reviewed_by = reviewer; patch.reviewed_at = now; break;
  }
  try {
    const { error, count } = await db.from('quiz_questions')
      .update(patch, { count: 'exact' }).in('id', ids);
    if (error) return { updated: 0, error: error.message };
    return { updated: count ?? ids.length };
  } catch (e) {
    return { updated: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

// ---- Module readiness -------------------------------------------------------

export interface ModuleDim { key: string; label: string; have: number; target: number; pct: number; }
export interface ModuleReadinessRow {
  module: number; title: string; readiness: number; dims: ModuleDim[];
}

/**
 * Per-module readiness across the seven Founder-Portal dimensions:
 * Lessons · Quiz Questions (approved) · Simulations · Projects · Interview
 * Scenarios · Portfolio Work · Certification Readiness.
 * Asset dims are attributed to a module by chapter_id; unassigned rows are not
 * double-counted into a module. Certification Readiness is the module's own
 * roll-up (mean of the other six), i.e. how exam-ready that module is.
 */
export async function getModuleReadiness(courseId: string): Promise<ModuleReadinessRow[]> {
  try {
    const { data: chapters } = await db
      .from('chapters').select('id, title, order_index')
      .eq('course_id', courseId).order('order_index');
    const chaps = (chapters ?? []) as any[];
    if (!chaps.length) return [];
    const chapIds = chaps.map((c) => c.id);

    const [{ data: quizzes }, { data: videos }, sims, labs, iv, port] = await Promise.all([
      db.from('quizzes').select('id, chapter_id, quiz_type').in('chapter_id', chapIds).eq('quiz_type', 'chapter_end'),
      db.from('videos').select('chapter_id').in('chapter_id', chapIds),
      countByChapter('program_simulations', chapIds),
      countByChapter('program_labs', chapIds),
      countByChapter('program_interview_prep', chapIds),
      countByChapter('program_portfolios', chapIds),
    ]);

    // chapter_end quiz id per chapter + approved-question count per quiz
    const quizByChap = new Map<string, string>();
    (quizzes ?? []).forEach((q: any) => { if (!quizByChap.has(q.chapter_id)) quizByChap.set(q.chapter_id, q.id); });
    const quizIds = [...quizByChap.values()];
    const approvedByQuiz = new Map<string, number>();
    if (quizIds.length) {
      try {
        const { data: qq } = await db.from('quiz_questions')
          .select('quiz_id, status').in('quiz_id', quizIds).eq('status', 'approved').limit(10000);
        (qq ?? []).forEach((r: any) => approvedByQuiz.set(r.quiz_id, (approvedByQuiz.get(r.quiz_id) ?? 0) + 1));
      } catch { /* RLS / table */ }
    }

    const vidByChap = new Map<string, number>();
    (videos ?? []).forEach((r: any) => vidByChap.set(r.chapter_id, (vidByChap.get(r.chapter_id) ?? 0) + 1));

    return chaps.map((c, i) => {
      const quizId = quizByChap.get(c.id);
      const have = {
        lessons: vidByChap.get(c.id) ?? 0,
        questions: quizId ? (approvedByQuiz.get(quizId) ?? 0) : 0,
        simulations: sims.get(c.id) ?? 0,
        projects: labs.get(c.id) ?? 0,
        interview: iv.get(c.id) ?? 0,
        portfolio: port.get(c.id) ?? 0,
      };
      const base: ModuleDim[] = [
        { key: 'lessons', label: 'Lessons', have: have.lessons, target: PER_MODULE_TARGET.lessons, pct: pctOf(have.lessons, PER_MODULE_TARGET.lessons) },
        { key: 'questions', label: 'Quiz Questions', have: have.questions, target: PER_MODULE_TARGET.questions, pct: pctOf(have.questions, PER_MODULE_TARGET.questions) },
        { key: 'simulations', label: 'Simulations', have: have.simulations, target: PER_MODULE_TARGET.simulations, pct: pctOf(have.simulations, PER_MODULE_TARGET.simulations) },
        { key: 'projects', label: 'Projects', have: have.projects, target: PER_MODULE_TARGET.projects, pct: pctOf(have.projects, PER_MODULE_TARGET.projects) },
        { key: 'interview', label: 'Interview Scenarios', have: have.interview, target: PER_MODULE_TARGET.interview, pct: pctOf(have.interview, PER_MODULE_TARGET.interview) },
        { key: 'portfolio', label: 'Portfolio Work', have: have.portfolio, target: PER_MODULE_TARGET.portfolio, pct: pctOf(have.portfolio, PER_MODULE_TARGET.portfolio) },
      ];
      const cert = Math.round(base.reduce((a, d) => a + d.pct, 0) / base.length);
      const dims = [...base, { key: 'certification', label: 'Certification Readiness', have: cert, target: 100, pct: cert }];
      return { module: c.order_index ?? i + 1, title: c.title, readiness: cert, dims };
    });
  } catch { return []; }
}

/** Count rows of an asset table grouped by chapter_id (defensive). */
async function countByChapter(table: string, chapterIds: string[]): Promise<Map<string, number>> {
  const m = new Map<string, number>();
  if (!chapterIds.length) return m;
  try {
    const { data, error } = await db.from(table).select('chapter_id').in('chapter_id', chapterIds).limit(10000);
    if (error || !data) return m;
    (data as any[]).forEach((r) => { if (r.chapter_id) m.set(r.chapter_id, (m.get(r.chapter_id) ?? 0) + 1); });
  } catch { /* table absent */ }
  return m;
}
