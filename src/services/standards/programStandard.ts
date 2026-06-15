// =============================================================================
// Aladiah Program Standard v1.0 — canonical structure + scoring model
// Source of truth (code mirror): docs/standards/PROGRAM_STANDARD_V1.md
// Every Aladiah program is evaluated against this standard; the Curriculum
// Excellence Score (CES, 0-100) is the result. Reference implementation: the
// AI Scrum Master Professional Certification (18-module blueprint).
// =============================================================================
import { ModuleBlueprint } from '@/types/curriculum';
import {
  ArchitectureDef,
  DimensionScore,
  PROGRAM_STANDARD_VERSION,
  StandardEvaluation,
} from '@/types/programStandard';

/** Minimum overall CES to be certified world-class. */
export const WORLD_CLASS_CES = 85;

export type Tier = 'Elite' | 'World Class' | 'Good' | 'Needs Improvement';

/** Color-coded tier from a Curriculum Excellence Score. */
export function tierFor(ces: number): { tier: Tier; color: string; badge: string } {
  if (ces >= 95) return { tier: 'Elite', color: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  if (ces >= 90) return { tier: 'World Class', color: 'text-green-600', badge: 'bg-green-100 text-green-700 border-green-200' };
  if (ces >= 80) return { tier: 'Good', color: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200' };
  return { tier: 'Needs Improvement', color: 'text-red-600', badge: 'bg-red-100 text-red-700 border-red-200' };
}

/** The 10 architectures every Aladiah program must follow (weights sum to 100). */
export const PROGRAM_ARCHITECTURES: ArchitectureDef[] = [
  { id: 'module', name: 'Module Architecture', components: ['Lesson', 'AI Coach', 'Practice', 'Scenario', 'Knowledge Check', 'Reflection', 'Competency Mapping'], weight: 12, threshold: 80, critical: true },
  { id: 'lesson', name: 'Lesson Architecture', components: ['Objectives', 'Content', 'Real Examples', 'AI Explanations'], weight: 8, threshold: 75, critical: false },
  { id: 'assessment', name: 'Assessment Architecture', components: ['Practice Quiz', 'Adaptive Quiz', 'Final Quiz', 'Competency-tagged', 'Rotating', 'Exam-quality'], weight: 12, threshold: 80, critical: true },
  { id: 'simulation', name: 'Simulation Architecture', components: ['Real Company', 'Stakeholders', 'Constraints', 'Conflict', 'Decision Tree', 'Scoring Engine', 'AI Feedback'], weight: 14, threshold: 80, critical: true },
  { id: 'lab', name: 'Lab Architecture', components: ['Real Tool (Jira/Confluence/Miro/Azure DevOps/GitHub/AI)', 'Hands-on Task', 'Deliverable'], weight: 10, threshold: 75, critical: false },
  { id: 'portfolio', name: 'Portfolio Architecture', components: ['Artifact', 'Employer-facing', 'Saved to Portfolio'], weight: 10, threshold: 75, critical: false },
  { id: 'capstone', name: 'Capstone Architecture', components: ['Integrative Project', 'Aladiah Profile', 'Leadership Demonstration'], weight: 8, threshold: 80, critical: true },
  { id: 'certification', name: 'Certification Architecture', components: ['Full Competency Coverage', 'Final Assessment', 'Credibility vs Real Certs'], weight: 6, threshold: 75, critical: false },
  { id: 'interview', name: 'Interview Architecture', components: ['Question Bank', 'Mock Interview', 'STAR Framework', 'Scoring'], weight: 8, threshold: 75, critical: false },
  { id: 'career_transformation', name: 'Career Transformation Architecture', components: ['Outcome Mapping', 'Employability', 'Salary Projection', 'Placement Link'], weight: 12, threshold: 80, critical: true },
];

const PROGRAM_COMPETENCY_COUNT: Record<string, number> = { scrum: 8, ba: 9 };
const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

/**
 * Score a program BLUEPRINT against the standard (does the design qualify as
 * world-class?). Returns per-dimension scores + the Curriculum Excellence Score.
 */
export function scoreBlueprint(modules: ModuleBlueprint[], programKey = 'scrum'): StandardEvaluation {
  const n = modules.length || 1;
  const has = (f: (m: ModuleBlueprint) => boolean) => modules.filter(f).length;

  const distinctComps = new Set(modules.flatMap((m) => m.competencies));
  const competencyCoverage = pct(distinctComps.size, (PROGRAM_COMPETENCY_COUNT[programKey] ?? distinctComps.size) || 1);
  const hasCapstone = modules.some((m) => /capstone/i.test(m.title));
  const hasInterview = modules.some((m) => /interview/i.test(m.aiMentorFocus) || /capstone/i.test(m.title));

  const raw: Record<string, number> = {
    module: pct(has((m) => m.competencies.length > 0), n),
    lesson: has((m) => Boolean(m.aiMentorFocus)) === n ? 90 : 70,
    assessment: pct(has((m) => m.quizTiers.length >= 3), n),
    simulation: pct(has((m) => Boolean(m.simulation?.company && m.simulation?.scenario)), n),
    lab: pct(has((m) => Boolean(m.lab?.tool && m.lab?.task)), n),
    portfolio: pct(has((m) => Boolean(m.portfolioArtifact)), n),
    capstone: hasCapstone ? 100 : 0,
    certification: Math.round(competencyCoverage * 0.7 + (pct(has((m) => m.quizTiers.includes('final')), n)) * 0.3),
    interview: hasInterview ? 100 : 70,
    career_transformation: pct(has((m) => Boolean(m.careerOutcome)), n),
  };

  return evaluate(raw);
}

/** Build a StandardEvaluation from raw 0-100 dimension scores. */
export function evaluate(raw: Record<string, number>): StandardEvaluation {
  const dimensions: DimensionScore[] = PROGRAM_ARCHITECTURES.map((a) => {
    const score = Math.max(0, Math.min(100, Math.round(raw[a.id] ?? 0)));
    return { id: a.id, name: a.name, score, threshold: a.threshold, met: score >= a.threshold, critical: a.critical };
  });
  const ces = computeCES(dimensions);
  const failedCritical = dimensions.filter((d) => d.critical && !d.met).map((d) => d.name);
  const worldClass = ces >= WORLD_CLASS_CES && failedCritical.length === 0;
  return { version: PROGRAM_STANDARD_VERSION, ces, worldClass, dimensions, failedCritical };
}

/** Curriculum Excellence Score = weighted average of dimension scores. */
export function computeCES(dimensions: DimensionScore[]): number {
  const byId = new Map(dimensions.map((d) => [d.id, d.score]));
  let total = 0;
  let w = 0;
  for (const a of PROGRAM_ARCHITECTURES) {
    total += (byId.get(a.id) ?? 0) * a.weight;
    w += a.weight;
  }
  return Math.round(total / Math.max(w, 1));
}
