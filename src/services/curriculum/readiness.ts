// =============================================================================
// Curriculum Launch Readiness — 100% LIVE Supabase. No code-only assumptions.
// Every score traces to authored rows: chapters (modules), videos (lessons),
// quizzes, and the first-class content tables (simulations, portfolios,
// interview prep, AI-mentor prompts, capstones, certifications).
// Defensive: a table that doesn't exist yet (migration not applied) → 0.
// =============================================================================
import { db } from '@/services/aos/_internal';
import { listManagedCourses } from './courses';

// World-class target per program (Aladiah Program Standard v1.0).
const TARGET = { modules: 18, lessons: 162, quizzes: 18, simulations: 54, labs: 18, portfolios: 18, interview: 18, mentor: 18, copilot: 18, executive: 6, employer: 3, capstones: 1, certifications: 1 };
const WEIGHT: Record<string, number> = { modules: 0.08, lessons: 0.14, quizzes: 0.08, simulations: 0.12, labs: 0.08, portfolios: 0.08, interview: 0.06, mentor: 0.03, copilot: 0.10, executive: 0.08, employer: 0.03, capstones: 0.08, certifications: 0.04 };
const DIM_LABEL: Record<string, string> = {
  modules: 'Modules', lessons: 'Lessons', quizzes: 'Quizzes', simulations: 'Simulations',
  labs: 'Labs', portfolios: 'Portfolios', interview: 'Interview Prep', mentor: 'AI Mentor Prompts',
  copilot: 'AI Co-Pilot', executive: 'Executive Sims', employer: 'Employer Validation',
  capstones: 'Capstones', certifications: 'Certifications',
};
// content table per dimension (published rows only count toward launch readiness)
const ASSET_TABLE: Record<string, string> = {
  simulations: 'program_simulations', labs: 'program_labs', portfolios: 'program_portfolios',
  interview: 'program_interview_prep', mentor: 'program_ai_mentor_prompts',
  copilot: 'program_ai_copilot_challenges', executive: 'program_executive_simulations',
  employer: 'program_employer_validation',
  capstones: 'program_capstones', certifications: 'program_certifications',
};

export interface Dim { key: string; label: string; have: number; target: number; pct: number; }
export interface ModuleGap { module: number; title: string; missing: string[]; }
export interface ModuleReadiness { module: number; title: string; lessons: boolean; quiz: boolean; score: number; }
export interface ProgramReadiness {
  id: string; title: string; source: 'db'; readiness: number; tier: string;
  dims: Dim[]; moduleGaps: ModuleGap[]; moduleReadiness: ModuleReadiness[];
  launchBlockers: string[]; launchReady: boolean;
}

// A program cannot be Launch Ready unless every required dimension exists (>0).
const REQUIRED = ['lessons', 'quizzes', 'simulations', 'labs', 'portfolios', 'interview', 'copilot', 'executive', 'capstones'];
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

/** Authored + published counts per course for a content table (defensive). */
async function countByCourse(table: string): Promise<Map<string, { all: number; pub: number }>> {
  const m = new Map<string, { all: number; pub: number }>();
  try {
    const { data, error } = await db.from(table).select('course_id, is_published').limit(10000);
    if (error || !data) return m;
    for (const r of data as any[]) {
      const e = m.get(r.course_id) ?? { all: 0, pub: 0 };
      e.all += 1; if (r.is_published) e.pub += 1;
      m.set(r.course_id, e);
    }
  } catch { /* table not created yet */ }
  return m;
}

export async function getAcademyReadiness(): Promise<AcademyReadiness> {
  const programs: ProgramReadiness[] = [];
  try {
    const courseList = await listManagedCourses();
    if (courseList.length) {
      const ids = courseList.map((c) => c.id);
      const { data: chapters } = await db.from('chapters').select('id, course_id, title, order_index').in('course_id', ids).order('order_index');
      const chaps = (chapters ?? []) as any[];
      const chapIds = chaps.map((c) => c.id);
      const [{ data: videos }, { data: quizzes }, simMap, labsMap, portMap, ivMap, mentorMap, copMap, execMap, empMap, capMap, certMap] = await Promise.all([
        db.from('videos').select('chapter_id').in('chapter_id', chapIds),
        db.from('quizzes').select('chapter_id, quiz_type').in('chapter_id', chapIds).eq('quiz_type', 'chapter_end'),
        countByCourse(ASSET_TABLE.simulations),
        countByCourse(ASSET_TABLE.labs),
        countByCourse(ASSET_TABLE.portfolios),
        countByCourse(ASSET_TABLE.interview),
        countByCourse(ASSET_TABLE.mentor),
        countByCourse(ASSET_TABLE.copilot),
        countByCourse(ASSET_TABLE.executive),
        countByCourse(ASSET_TABLE.employer),
        countByCourse(ASSET_TABLE.capstones),
        countByCourse(ASSET_TABLE.certifications),
      ]);
      const vidByChap = new Map<string, number>();
      (videos ?? []).forEach((r: any) => vidByChap.set(r.chapter_id, (vidByChap.get(r.chapter_id) ?? 0) + 1));
      const quizChaps = new Set((quizzes ?? []).map((r: any) => r.chapter_id));

      const z = { all: 0, pub: 0 };
      for (const c of courseList) {
        const cChaps = chaps.filter((ch) => ch.course_id === c.id);
        const lessons = cChaps.reduce((a, ch) => a + (vidByChap.get(ch.id) ?? 0), 0);
        const quizzesHave = cChaps.filter((ch) => quizChaps.has(ch.id)).length;
        const sim = simMap.get(c.id) ?? z, labs = labsMap.get(c.id) ?? z, port = portMap.get(c.id) ?? z, iv = ivMap.get(c.id) ?? z;
        const men = mentorMap.get(c.id) ?? z, cop = copMap.get(c.id) ?? z, exec = execMap.get(c.id) ?? z, emp = empMap.get(c.id) ?? z;
        const cap = capMap.get(c.id) ?? z, cert = certMap.get(c.id) ?? z;
        // Authored counts drive completion/readiness (what's built).
        const have = {
          modules: cChaps.length, lessons, quizzes: quizzesHave,
          simulations: sim.all, labs: labs.all, portfolios: port.all, interview: iv.all, mentor: men.all,
          copilot: cop.all, executive: exec.all, employer: emp.all,
          capstones: cap.all, certifications: cert.all,
        };
        // Published counts drive the launch gate (what's shippable).
        const pub: Record<string, number> = {
          lessons, quizzes: quizzesHave,
          simulations: sim.pub, labs: labs.pub, portfolios: port.pub, interview: iv.pub, mentor: men.pub,
          copilot: cop.pub, executive: exec.pub, employer: emp.pub,
          capstones: cap.pub, certifications: cert.pub,
        };
        const { dims, readiness } = buildDims(have);
        const moduleReadiness: ModuleReadiness[] = cChaps.map((ch, i) => {
          const lessons = (vidByChap.get(ch.id) ?? 0) > 0;
          const quiz = quizChaps.has(ch.id);
          return { module: ch.order_index ?? i + 1, title: ch.title, lessons, quiz, score: (lessons ? 50 : 0) + (quiz ? 50 : 0) };
        });
        const moduleGaps: ModuleGap[] = moduleReadiness
          .map((m) => ({ module: m.module, title: m.title, missing: [...(m.lessons ? [] : ['Lessons']), ...(m.quiz ? [] : ['Quiz'])] }))
          .filter((g) => g.missing.length > 0);
        // Launch gate requires PUBLISHED rows for every required dimension.
        const launchBlockers = REQUIRED.filter((k) => (pub[k] ?? 0) === 0).map((k) => DIM_LABEL[k]);
        const launchReady = launchBlockers.length === 0 && readiness >= 90;
        programs.push({ id: c.id, title: c.title, source: 'db', readiness, tier: tierFor(readiness), dims, moduleGaps, moduleReadiness, launchBlockers, launchReady });
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
    launchReady: programs.filter((p) => p.launchReady).length,
    programs, missing,
  };
}

/** Persist launch_score + launch_status on a course from its real readiness. */
export async function recomputeLaunch(courseId: string): Promise<{ score: number; status: string; launchReady: boolean }> {
  const r = await getAcademyReadiness();
  const p = r.programs.find((x) => x.id === courseId);
  if (!p) return { score: 0, status: 'draft', launchReady: false };
  const status = p.launchReady ? 'launch_ready' : p.readiness >= 80 ? 'beta' : p.readiness >= 40 ? 'internal' : 'draft';
  try { await db.from('courses').update({ launch_score: p.readiness, launch_status: status }).eq('id', courseId); } catch { /* columns absent */ }
  return { score: p.readiness, status, launchReady: p.launchReady };
}

// Architecture validation — which content entities exist in Supabase.
const ARCH = [
  'courses', 'chapters', 'videos', 'quizzes',
  'program_simulations', 'program_labs', 'program_portfolios', 'program_interview_prep',
  'program_ai_mentor_prompts', 'program_ai_copilot_challenges', 'program_executive_simulations',
  'program_employer_validation', 'program_capstones', 'program_certifications',
  'program_content_readiness', 'curriculum_audit_log',
];
export async function getArchitectureStatus(): Promise<{ name: string; exists: boolean }[]> {
  return Promise.all(ARCH.map(async (t) => {
    try {
      const { error } = await db.from(t).select('*', { head: true, count: 'exact' }).limit(1);
      return { name: t, exists: !error };
    } catch {
      return { name: t, exists: false };
    }
  }));
}
