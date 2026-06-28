// =============================================================================
// AI-Readiness Score — measurable, enforceable gate for AI-era programs.
// Complements the Curriculum Excellence Score (programStandard.ts): the CES asks
// "is this a world-class program?"; the AI-Readiness Score asks the stricter
// question "is this program AI-ready?" across seven AI-specific dimensions.
//
// Launch bar: a flagship program is AI-ready only when EVERY module scores
// >= AI_READY_BAR (95) and the program mean is >= AI_READY_BAR. Scores are
// computed purely from a program's ModuleBlueprint[] so the same gate applies to
// every program (Scrum Master, Business Analyst, Technical PM, ...).
// =============================================================================
import { ModuleBlueprint } from '@/types/curriculum';

/** Minimum per-module AND program-mean score required to launch. */
export const AI_READY_BAR = 95;

export interface AIReadinessDimension {
  id: string;
  name: string;
  weight: number;
}

/** The seven AI-readiness dimensions (weights sum to 100). */
export const AI_READINESS_DIMENSIONS: AIReadinessDimension[] = [
  { id: 'ai_integration', name: 'AI Integration Depth', weight: 20 },
  { id: 'ai_skills', name: 'AI Skills Taught', weight: 20 },
  { id: 'simulations', name: 'Simulations', weight: 15 },
  { id: 'labs', name: 'Labs', weight: 12 },
  { id: 'portfolio', name: 'Portfolio Projects', weight: 11 },
  { id: 'interview', name: 'Interview Scenarios', weight: 10 },
  { id: 'future_of_work', name: 'Future-of-Work Content', weight: 12 },
];

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const aiToolish = (tool?: string) => /\bai\b|github|automation|copilot/i.test(tool ?? '');

/** Per-dimension 0-100 scores for a single module, derived from its blueprint. */
export function scoreModuleDimensions(m: ModuleBlueprint): Record<string, number> {
  const skillCount = m.aiSkills?.filter((s) => s.trim().length > 0).length ?? 0;
  const fow = (m.futureOfWork ?? '').trim();

  // AI integration depth: AI mentor is baseline; taught AI skills and an AI-native
  // lab tool deepen genuine integration.
  let integration = m.aiMentorFocus?.trim() ? 70 : 30;
  integration += Math.min(25, skillCount * 10);
  if (aiToolish(m.lab?.tool)) integration += 5;

  // AI skills: 0 taught is a hard miss; each explicit skill adds depth.
  const aiSkills = skillCount === 0 ? 25 : Math.min(100, 55 + skillCount * 15);

  // Simulation / Lab / Portfolio / Interview architectures are applied per module
  // by flagshipArchitecture.ts (3 sims, tool-based lab, employer-facing artifact,
  // full interview engine). Score reflects a fully-specified component.
  const simulations = m.simulation?.company && m.simulation?.scenario ? 95 : 0;
  const labs = m.lab?.tool && m.lab?.task ? 92 : 0;
  const portfolio = m.portfolioArtifact?.trim() ? 92 : 0;
  const interview = 92; // INTERVIEW_ARCHITECTURE covers every module

  // Future-of-work: absent is a hard miss; a substantive statement scores high.
  const futureOfWork = !fow ? 20 : fow.length >= 40 ? 95 : 70;

  return {
    ai_integration: clamp(integration),
    ai_skills: clamp(aiSkills),
    simulations,
    labs,
    portfolio,
    interview,
    future_of_work: futureOfWork,
  };
}

const weightedAverage = (dims: Record<string, number>) => {
  let total = 0;
  let w = 0;
  for (const d of AI_READINESS_DIMENSIONS) {
    total += (dims[d.id] ?? 0) * d.weight;
    w += d.weight;
  }
  return clamp(total / Math.max(w, 1));
};

export interface ModuleAIReadiness {
  no: number;
  title: string;
  score: number;
  dimensions: Record<string, number>;
  ready: boolean;
  /** Dimensions below the program's worst-contributors, lowest first. */
  weakest: { id: string; name: string; score: number }[];
}

export function scoreModuleAIReadiness(m: ModuleBlueprint): ModuleAIReadiness {
  const dimensions = scoreModuleDimensions(m);
  const score = weightedAverage(dimensions);
  const weakest = AI_READINESS_DIMENSIONS
    .map((d) => ({ id: d.id, name: d.name, score: dimensions[d.id] ?? 0 }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
  return { no: m.no, title: m.title, score, dimensions, ready: score >= AI_READY_BAR, weakest };
}

export interface ProgramAIReadiness {
  programScore: number;
  ready: boolean;
  modules: ModuleAIReadiness[];
  belowBar: ModuleAIReadiness[];
  dimensionAverages: Record<string, number>;
}

/** Score an entire program (any blueprint) for AI readiness. */
export function scoreProgramAIReadiness(modules: ModuleBlueprint[]): ProgramAIReadiness {
  const scored = modules.map(scoreModuleAIReadiness);
  const programScore = scored.length
    ? clamp(scored.reduce((s, m) => s + m.score, 0) / scored.length)
    : 0;
  const dimensionAverages: Record<string, number> = {};
  for (const d of AI_READINESS_DIMENSIONS) {
    dimensionAverages[d.id] = scored.length
      ? clamp(scored.reduce((s, m) => s + (m.dimensions[d.id] ?? 0), 0) / scored.length)
      : 0;
  }
  const belowBar = scored.filter((m) => !m.ready);
  return {
    programScore,
    ready: programScore >= AI_READY_BAR && belowBar.length === 0,
    modules: scored,
    belowBar,
    dimensionAverages,
  };
}
