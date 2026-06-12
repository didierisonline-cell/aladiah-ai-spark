// =============================================================================
// Program-level Curriculum Readiness — the primary Founder operating screen.
// Aggregates every module of every managed program into program readiness,
// launch score + launch gate, school grouping, and an executive roll-up
// (assets + questions pending review). 100% live Supabase; fully defensive —
// a missing table or unapplied migration degrades to zero, never throws.
// =============================================================================
import { db } from '@/services/aos/_internal';
import { listManagedCourses } from './courses';
import { getModuleReadiness } from './questionReview';

// ---- Schools ----------------------------------------------------------------
export const SCHOOLS = [
  'AI Engineering',
  'AI Business Transformation',
  'Governance & Risk',
  'Human-AI Experience',
] as const;
export type School = (typeof SCHOOLS)[number] | 'Unassigned';

// Explicit overrides win; otherwise a program is classified by title keywords.
const SCHOOL_OVERRIDES: Record<string, School> = {
  // 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14': 'AI Business Transformation',
};
const SCHOOL_KEYWORDS: { school: School; words: string[] }[] = [
  { school: 'AI Engineering', words: ['engineer', 'developer', 'ml', 'machine learning', 'data', 'mlops', 'llm', 'prompt eng', 'software'] },
  { school: 'AI Business Transformation', words: ['scrum', 'agile', 'transformation', 'product', 'business', 'leader', 'manager', 'safe', 'delivery'] },
  { school: 'Governance & Risk', words: ['governance', 'risk', 'compliance', 'security', 'audit', 'policy', 'ethics', 'regulat'] },
  { school: 'Human-AI Experience', words: ['experience', 'ux', 'design', 'human', 'interaction', 'service', 'support', 'cx'] },
];
export function schoolFor(courseId: string, title: string): School {
  if (SCHOOL_OVERRIDES[courseId]) return SCHOOL_OVERRIDES[courseId];
  const t = (title || '').toLowerCase();
  for (const { school, words } of SCHOOL_KEYWORDS) {
    if (words.some((w) => t.includes(w))) return school;
  }
  return 'Unassigned';
}

// ---- Dimensions -------------------------------------------------------------
// Nine readiness dimensions. The first seven are the LAUNCH GATE (all must be
// 100% to be Launch Ready). Capstone + AI Mentor inform readiness but do not
// gate launch. Per-module unit targets scale to the program's module count.
export const DIM_DEFS = [
  { key: 'lessons', label: 'Lessons', perModule: 9, gate: true },
  { key: 'questions', label: 'Quiz Questions', perModule: 60, gate: true },     // approved exam-ready bank (≥60/module)
  { key: 'simulations', label: 'Simulations', perModule: 3, gate: true },
  { key: 'projects', label: 'Projects', perModule: 1, gate: true },             // program_labs
  { key: 'interview', label: 'Interview Scenarios', perModule: 1, gate: true },
  { key: 'portfolio', label: 'Portfolio Work', perModule: 1, gate: true },
  { key: 'certification', label: 'Certification Readiness', fixed: 1, gate: true },
  { key: 'capstone', label: 'Capstone Readiness', fixed: 1, gate: false },
  { key: 'mentor', label: 'AI Mentor Readiness', perModule: 1, gate: false },
] as const;
export type DimKey = (typeof DIM_DEFS)[number]['key'];

export interface ProgramDim { key: DimKey; label: string; have: number; target: number; pct: number; gate: boolean; }
export interface ProgramRow {
  id: string; title: string; school: School;
  totalModules: number; completedModules: number;
  readinessScore: number;   // mean of all 9 dims
  launchScore: number;      // mean of the 7 gate dims
  launchReady: boolean;     // every gate dim === 100%
  dims: ProgramDim[];
  blockers: string[];       // gate dims below 100%
}
export interface ExecutiveSummary {
  totalPrograms: number;
  launchReady: number;
  inDevelopment: number;
  below80: number;
  totalAssets: number;
  assetsPendingReview: number;
  questionsPendingReview: number;
}
export interface SchoolGroup { school: School; programs: ProgramRow[]; readiness: number; launchReady: number; }
export interface ProgramReadinessReport {
  generatedAt: string;
  programs: ProgramRow[];
  schools: SchoolGroup[];
  summary: ExecutiveSummary;
}

// Color buckets (shared with the UI).
export const colorFor = (pct: number) =>
  pct >= 95 ? 'green' : pct >= 80 ? 'blue' : pct >= 50 ? 'yellow' : 'red';

const pctOf = (have: number, target: number) => (target > 0 ? Math.min(100, Math.round((have / target) * 100)) : 0);

// Asset tables that count toward "Total Assets" + pending-review.
const ASSET_TABLES = [
  'program_simulations', 'program_labs', 'program_portfolios', 'program_interview_prep',
  'program_ai_mentor_prompts', 'program_ai_copilot_challenges', 'program_executive_simulations',
  'program_employer_validation', 'program_capstones', 'program_certifications',
];
const PENDING = new Set(['draft', 'in_review']);

/** course_id → { total, pending, approved } for an asset table (defensive). */
async function assetStatusByCourse(table: string) {
  const m = new Map<string, { total: number; pending: number; approved: number }>();
  try {
    const { data, error } = await db.from(table).select('course_id, status').limit(20000);
    if (error || !data) return m;
    for (const r of data as any[]) {
      const e = m.get(r.course_id) ?? { total: 0, pending: 0, approved: 0 };
      e.total += 1;
      if (PENDING.has(r.status)) e.pending += 1;
      if (r.status === 'approved' || r.status === 'published') e.approved += 1;
      m.set(r.course_id, e);
    }
  } catch { /* table absent */ }
  return m;
}

export async function getProgramReadiness(): Promise<ProgramReadinessReport> {
  const programs: ProgramRow[] = [];
  let totalAssets = 0, assetsPendingReview = 0, questionsPendingReview = 0;

  try {
    const courses = await listManagedCourses();

    // Asset status maps (one query per table, across all courses).
    const assetMaps: Record<string, Map<string, { total: number; pending: number; approved: number }>> = {};
    await Promise.all(ASSET_TABLES.map(async (t) => { assetMaps[t] = await assetStatusByCourse(t); }));
    for (const t of ASSET_TABLES) {
      for (const v of assetMaps[t].values()) { totalAssets += v.total; assetsPendingReview += v.pending; }
    }

    // Questions pending review (draft + in_review), program-wide.
    try {
      const { data } = await db.from('quiz_questions').select('status').in('status', ['draft', 'in_review']).limit(50000);
      questionsPendingReview = (data ?? []).length;
    } catch { /* RLS / column */ }

    for (const c of courses) {
      // Per-module readiness gives us module count, lessons, approved questions,
      // simulations, projects, interview, portfolio — already attributed per module.
      const modRows = await getModuleReadiness(c.id);
      const modules = modRows.length;
      if (!modules) {
        programs.push(emptyProgram(c.id, c.title));
        continue;
      }
      const sum = (k: string) => modRows.reduce((a, m) => a + (m.dims.find((d) => d.key === k)?.have ?? 0), 0);
      const have: Record<string, number> = {
        lessons: sum('lessons'), questions: sum('questions'), simulations: sum('simulations'),
        projects: sum('projects'), interview: sum('interview'), portfolio: sum('portfolio'),
        certification: (assetMaps['program_certifications'].get(c.id)?.approved ?? 0),
        capstone: (assetMaps['program_capstones'].get(c.id)?.approved ?? 0),
        mentor: (assetMaps['program_ai_mentor_prompts'].get(c.id)?.total ?? 0),
      };

      const dims: ProgramDim[] = DIM_DEFS.map((d) => {
        const target = 'fixed' in d ? (d as any).fixed : (d as any).perModule * modules;
        const pct = pctOf(have[d.key] ?? 0, target);
        return { key: d.key, label: d.label, have: have[d.key] ?? 0, target, pct, gate: d.gate };
      });

      const gate = dims.filter((d) => d.gate);
      const launchScore = Math.round(gate.reduce((a, d) => a + d.pct, 0) / gate.length);
      const readinessScore = Math.round(dims.reduce((a, d) => a + d.pct, 0) / dims.length);
      const launchReady = gate.every((d) => d.pct >= 100);
      const blockers = gate.filter((d) => d.pct < 100).map((d) => d.label);
      // A module is "completed" when its own roll-up is green (≥95%).
      const completedModules = modRows.filter((m) => m.readiness >= 95).length;

      programs.push({
        id: c.id, title: c.title, school: schoolFor(c.id, c.title),
        totalModules: modules, completedModules,
        readinessScore, launchScore, launchReady, dims, blockers,
      });
    }
  } catch { /* defensive */ }

  programs.sort((a, b) => b.readinessScore - a.readinessScore);

  // School grouping.
  const schools: SchoolGroup[] = [...SCHOOLS, 'Unassigned'].map((s) => {
    const ps = programs.filter((p) => p.school === s);
    const readiness = ps.length ? Math.round(ps.reduce((a, p) => a + p.readinessScore, 0) / ps.length) : 0;
    return { school: s as School, programs: ps, readiness, launchReady: ps.filter((p) => p.launchReady).length };
  }).filter((g) => g.programs.length > 0);

  const summary: ExecutiveSummary = {
    totalPrograms: programs.length,
    launchReady: programs.filter((p) => p.launchReady).length,
    inDevelopment: programs.filter((p) => !p.launchReady).length,
    below80: programs.filter((p) => p.readinessScore < 80).length,
    totalAssets, assetsPendingReview, questionsPendingReview,
  };

  return { generatedAt: new Date().toISOString(), programs, schools, summary };
}

function emptyProgram(id: string, title: string): ProgramRow {
  const dims: ProgramDim[] = DIM_DEFS.map((d) => ({
    key: d.key, label: d.label, have: 0, target: 'fixed' in d ? (d as any).fixed : (d as any).perModule, pct: 0, gate: d.gate,
  }));
  return {
    id, title, school: schoolFor(id, title), totalModules: 0, completedModules: 0,
    readinessScore: 0, launchScore: 0, launchReady: false, dims,
    blockers: dims.filter((d) => d.gate).map((d) => d.label),
  };
}

// Re-export module readiness for the "By Module" view.
export { getModuleReadiness } from './questionReview';
export type { ModuleReadinessRow } from './questionReview';
