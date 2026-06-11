// =============================================================================
// Curriculum Launch Readiness — inventories every program and scores how
// complete it actually is vs the Aladiah Program Standard (world-class target).
// DB programs are measured against LIVE content (chapters/videos/quizzes — what
// students actually receive). The flagship is measured from its code curriculum.
// Honest: dimensions not yet tracked in the DB (sims/labs/portfolios/etc.) read 0
// for DB programs — that is the "looks finished but isn't" signal.
// =============================================================================
import { db } from '@/services/aos/_internal';
import {
  AI_SCRUM_MASTER_CURRICULUM as FLAG,
  AI_SCRUM_MASTER_PROGRAM_META as FMETA,
} from '@/services/agents/curriculum/programs/aiScrumMasterFull';

// World-class target (Aladiah Program Standard v1.0).
const TARGET = { modules: 18, lessons: 162, quizzes: 18, simulations: 54, labs: 18, portfolios: 18, interview: 18, mentor: 18, certification: 1 };
const WEIGHT: Record<string, number> = { lessons: 0.25, modules: 0.15, quizzes: 0.15, simulations: 0.15, labs: 0.10, portfolios: 0.10, interview: 0.05, mentor: 0.05 };
const DIM_LABEL: Record<string, string> = {
  modules: 'Modules', lessons: 'Lessons', quizzes: 'Quizzes', simulations: 'Simulations',
  labs: 'Labs', portfolios: 'Portfolios', interview: 'Interview Prep', mentor: 'AI Mentor Prompts',
};
const DB_TRACKED = new Set(['modules', 'lessons', 'quizzes']); // the rest aren't in the DB content model yet

export interface Dim { key: string; label: string; have: number; target: number; pct: number; dbTracked: boolean; }
export interface ModuleGap { module: number; title: string; missing: string[]; }
export interface ProgramReadiness {
  id: string; title: string; source: 'db' | 'flagship'; readiness: number; tier: string;
  dims: Dim[]; moduleGaps: ModuleGap[];
}
export interface AcademyReadiness {
  generatedAt: string;
  academyReadiness: number;
  totalPrograms: number;
  launchReady: number;          // programs >= 90
  programs: ProgramReadiness[]; // sorted desc by readiness
  missing: { key: string; label: string; count: number }[]; // total missing across academy
}

const tierFor = (n: number) => (n >= 95 ? 'Elite' : n >= 90 ? 'World Class' : n >= 80 ? 'Good' : n >= 60 ? 'Watch' : 'Critical');
const pct = (have: number, target: number) => (target > 0 ? Math.min(100, Math.round((have / target) * 100)) : 100);

function buildDims(have: Record<string, number>): { dims: Dim[]; readiness: number } {
  const dims: Dim[] = Object.keys(TARGET)
    .filter((k) => k !== 'certification')
    .map((k) => ({ key: k, label: DIM_LABEL[k], have: have[k] ?? 0, target: (TARGET as any)[k], pct: pct(have[k] ?? 0, (TARGET as any)[k]), dbTracked: DB_TRACKED.has(k) }));
  const readiness = Math.round(dims.reduce((a, d) => a + (d.pct / 100) * (WEIGHT[d.key] ?? 0), 0) * 100);
  return { dims, readiness };
}

function flagshipProgram(): ProgramReadiness {
  const have = {
    modules: FLAG.length,
    lessons: FLAG.reduce((a, m) => a + m.lessons.length, 0),
    quizzes: FLAG.length,
    simulations: FLAG.length * 3,
    labs: FLAG.length,
    portfolios: FLAG.length,
    interview: FLAG.length,
    mentor: FLAG.length,
  };
  const { dims, readiness } = buildDims(have);
  return {
    id: 'flagship-ai-scrum-master', title: `${FMETA.name} (reference)`, source: 'flagship',
    readiness, tier: tierFor(readiness), dims, moduleGaps: [],
  };
}

export async function getAcademyReadiness(): Promise<AcademyReadiness> {
  const programs: ProgramReadiness[] = [flagshipProgram()];

  try {
    const { data: courses } = await db.from('courses').select('id, title').eq('is_published', true).order('title');
    const courseList = (courses ?? []) as { id: string; title: string }[];
    if (courseList.length) {
      const ids = courseList.map((c) => c.id);
      const { data: chapters } = await db.from('chapters').select('id, course_id, title, order_index').in('course_id', ids).order('order_index');
      const chaps = (chapters ?? []) as any[];
      const chapIds = chaps.map((c) => c.id);
      const [{ data: videos }, { data: quizzes }] = await Promise.all([
        db.from('videos').select('chapter_id').in('chapter_id', chapIds),
        db.from('quizzes').select('chapter_id, quiz_type').in('chapter_id', chapIds).eq('quiz_type', 'chapter_end'),
      ]);
      const vidByChap = new Map<string, number>();
      (videos ?? []).forEach((r: any) => vidByChap.set(r.chapter_id, (vidByChap.get(r.chapter_id) ?? 0) + 1));
      const quizChaps = new Set((quizzes ?? []).map((r: any) => r.chapter_id));

      for (const c of courseList) {
        const cChaps = chaps.filter((ch) => ch.course_id === c.id);
        const lessons = cChaps.reduce((a, ch) => a + (vidByChap.get(ch.id) ?? 0), 0);
        const quizzesHave = cChaps.filter((ch) => quizChaps.has(ch.id)).length;
        const have = { modules: cChaps.length, lessons, quizzes: quizzesHave, simulations: 0, labs: 0, portfolios: 0, interview: 0, mentor: 0 };
        const { dims, readiness } = buildDims(have);
        const moduleGaps: ModuleGap[] = cChaps.map((ch, i) => {
          const missing: string[] = [];
          if ((vidByChap.get(ch.id) ?? 0) === 0) missing.push('Lessons');
          if (!quizChaps.has(ch.id)) missing.push('Quiz');
          return { module: ch.order_index ?? i + 1, title: ch.title, missing };
        }).filter((g) => g.missing.length > 0);
        programs.push({ id: c.id, title: c.title, source: 'db', readiness, tier: tierFor(readiness), dims, moduleGaps });
      }
    }
  } catch {
    /* defensive — flagship still shown */
  }

  programs.sort((a, b) => b.readiness - a.readiness);
  const academyReadiness = programs.length ? Math.round(programs.reduce((a, p) => a + p.readiness, 0) / programs.length) : 0;
  const missing = Object.keys(TARGET).filter((k) => k !== 'certification').map((k) => ({
    key: k, label: DIM_LABEL[k],
    count: programs.reduce((a, p) => { const d = p.dims.find((x) => x.key === k); return a + Math.max(0, (d?.target ?? 0) - (d?.have ?? 0)); }, 0),
  }));

  return {
    generatedAt: new Date().toISOString(),
    academyReadiness, totalPrograms: programs.length,
    launchReady: programs.filter((p) => p.readiness >= 90).length,
    programs, missing,
  };
}
