// =============================================================================
// Curriculum Launch Readiness — 100% LIVE Supabase. No code-only assumptions.
// Every score traces to authored rows: chapters (modules), videos (lessons),
// quizzes, and the first-class content tables (simulations, portfolios,
// interview prep, AI-mentor prompts, capstones, certifications).
// Defensive: a table that doesn't exist yet (migration not applied) → 0.
// =============================================================================
import { db } from '@/services/aos/_internal';

// World-class target per program (Aladiah Program Standard v1.0).
const TARGET = { modules: 18, lessons: 162, quizzes: 18, simulations: 54, portfolios: 18, interview: 18, mentor: 18, capstones: 1, certifications: 1 };
const WEIGHT: Record<string, number> = { modules: 0.12, lessons: 0.18, quizzes: 0.12, simulations: 0.18, portfolios: 0.12, interview: 0.08, mentor: 0.05, capstones: 0.08, certifications: 0.07 };
const DIM_LABEL: Record<string, string> = {
  modules: 'Modules', lessons: 'Lessons', quizzes: 'Quizzes', simulations: 'Simulations',
  portfolios: 'Portfolios', interview: 'Interview Prep', mentor: 'AI Mentor Prompts',
  capstones: 'Capstones', certifications: 'Certifications',
};
// content table per dimension (published rows only count toward launch readiness)
const ASSET_TABLE: Record<string, string> = {
  simulations: 'program_simulations', portfolios: 'program_portfolios',
  interview: 'program_interview_prep', mentor: 'program_ai_mentor_prompts',
  capstones: 'program_capstones', certifications: 'program_certifications',
};

export interface Dim { key: string; label: string; have: number; target: number; pct: number; }
export interface ModuleGap { module: number; title: string; missing: string[]; }
export interface ProgramReadiness {
  id: string; title: string; source: 'db'; readiness: number; tier: string;
  dims: Dim[]; moduleGaps: ModuleGap[];
}
export interface AcademyReadiness {
  generatedAt: string;
  academyReadiness: number;
  totalPrograms: number;
  launchReady: number;
  programs: ProgramReadiness[];
  missing: { key: string; label: string; count: number }[];
}

const tierFor = (n: number) => (n >= 95 ? 'Elite' : n >= 90 ? 'World Class' : n >= 80 ? 'Good' : n >= 60 ? 'Watch' : 'Critical');
const pct = (have: number, target: number) => (target > 0 ? Math.min(100, Math.round((have / target) * 100)) : 100);

function buildDims(have: Record<string, number>): { dims: Dim[]; readiness: number } {
  const dims: Dim[] = Object.keys(TARGET).map((k) => ({
    key: k, label: DIM_LABEL[k], have: have[k] ?? 0, target: (TARGET as any)[k], pct: pct(have[k] ?? 0, (TARGET as any)[k]),
  }));
  const readiness = Math.round(dims.reduce((a, d) => a + (d.pct / 100) * (WEIGHT[d.key] ?? 0), 0) * 100);
  return { dims, readiness };
}

/** Published-row count per course for a content table (defensive: missing table → empty). */
async function countByCourse(table: string): Promise<Map<string, number>> {
  const m = new Map<string, number>();
  try {
    const { data, error } = await db.from(table).select('course_id, is_published').eq('is_published', true).limit(5000);
    if (error || !data) return m;
    for (const r of data as any[]) m.set(r.course_id, (m.get(r.course_id) ?? 0) + 1);
  } catch { /* table not created yet */ }
  return m;
}

export async function getAcademyReadiness(): Promise<AcademyReadiness> {
  const programs: ProgramReadiness[] = [];
  try {
    const { data: courses } = await db.from('courses').select('id, title').eq('is_published', true).order('title');
    const courseList = (courses ?? []) as { id: string; title: string }[];
    if (courseList.length) {
      const ids = courseList.map((c) => c.id);
      const { data: chapters } = await db.from('chapters').select('id, course_id, title, order_index').in('course_id', ids).order('order_index');
      const chaps = (chapters ?? []) as any[];
      const chapIds = chaps.map((c) => c.id);
      const [{ data: videos }, { data: quizzes }, simMap, portMap, ivMap, mentorMap, capMap, certMap] = await Promise.all([
        db.from('videos').select('chapter_id').in('chapter_id', chapIds),
        db.from('quizzes').select('chapter_id, quiz_type').in('chapter_id', chapIds).eq('quiz_type', 'chapter_end'),
        countByCourse(ASSET_TABLE.simulations),
        countByCourse(ASSET_TABLE.portfolios),
        countByCourse(ASSET_TABLE.interview),
        countByCourse(ASSET_TABLE.mentor),
        countByCourse(ASSET_TABLE.capstones),
        countByCourse(ASSET_TABLE.certifications),
      ]);
      const vidByChap = new Map<string, number>();
      (videos ?? []).forEach((r: any) => vidByChap.set(r.chapter_id, (vidByChap.get(r.chapter_id) ?? 0) + 1));
      const quizChaps = new Set((quizzes ?? []).map((r: any) => r.chapter_id));

      for (const c of courseList) {
        const cChaps = chaps.filter((ch) => ch.course_id === c.id);
        const have = {
          modules: cChaps.length,
          lessons: cChaps.reduce((a, ch) => a + (vidByChap.get(ch.id) ?? 0), 0),
          quizzes: cChaps.filter((ch) => quizChaps.has(ch.id)).length,
          simulations: simMap.get(c.id) ?? 0,
          portfolios: portMap.get(c.id) ?? 0,
          interview: ivMap.get(c.id) ?? 0,
          mentor: mentorMap.get(c.id) ?? 0,
          capstones: capMap.get(c.id) ?? 0,
          certifications: certMap.get(c.id) ?? 0,
        };
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
  } catch { /* defensive */ }

  programs.sort((a, b) => b.readiness - a.readiness);
  const academyReadiness = programs.length ? Math.round(programs.reduce((a, p) => a + p.readiness, 0) / programs.length) : 0;
  const missing = Object.keys(TARGET).map((k) => ({
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
