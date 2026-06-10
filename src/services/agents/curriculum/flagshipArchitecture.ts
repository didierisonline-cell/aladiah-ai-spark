// =============================================================================
// AI Scrum Master Flagship — full Curriculum Architecture (Blueprint Generator).
// Expands the 18-module blueprint into the world-class per-module architecture:
//   Assessment (20-q module quiz + 20-q competency quiz + final cert, question
//   bank, rotating, difficulty levels, adaptive), Simulation (beginner /
//   intermediate / advanced = 54 total), Lab (1 hands-on per module), Portfolio
//   (GitHub-stored deliverables), Interview (AI coach per module).
// =============================================================================
import { ModuleBlueprint } from '@/types/curriculum';
import { SCRUM_18_BLUEPRINT } from './blueprint18';

export interface AssessmentArchitecture {
  moduleQuizQuestions: number;
  competencyQuizQuestions: number;
  finalCertification: boolean;
  questionBankSize: number;
  rotating: boolean;
  difficultyLevels: string[];
  adaptive: boolean;
}

export interface ModuleSimulation { level: 'beginner' | 'intermediate' | 'advanced'; title: string; }

export interface InterviewArchitecture { components: string[]; }

export interface FlagshipModule {
  no: number;
  title: string;
  competencies: string[];
  aiMentorFocus: string;
  lab: { name: string; tool: string; task: string };
  simulations: ModuleSimulation[]; // 3 per module (beginner/intermediate/advanced)
  assessment: AssessmentArchitecture;
  interview: InterviewArchitecture;
  portfolioArtifact: string;
  careerOutcome: string;
}

/** Assessment architecture applied to every module. */
export const ASSESSMENT_ARCHITECTURE: AssessmentArchitecture = {
  moduleQuizQuestions: 20,
  competencyQuizQuestions: 20,
  finalCertification: true,
  questionBankSize: 60, // bank > visible so questions rotate
  rotating: true,
  difficultyLevels: ['easy', 'medium', 'hard'],
  adaptive: true,
};

/** Interview architecture applied to every module. */
export const INTERVIEW_ARCHITECTURE: InterviewArchitecture = {
  components: ['AI Interview Coach', 'Behavioral questions', 'Scenario questions', 'Leadership questions', 'STAR coaching', 'Scoring engine'],
};

/** Lab names cycle through the flagship lab library. */
const LAB_LIBRARY = [
  'Sprint Planning Lab', 'Backlog Refinement Lab', 'Velocity Lab', 'Release Planning Lab',
  'Stakeholder Management Lab', 'Risk Management Lab', 'Definition of Done Lab', 'Daily Scrum Lab',
  'Retrospective Lab', 'Metrics Dashboard Lab', 'Facilitation Lab', 'Coaching Lab',
  'Impediment Removal Lab', 'Scaling Lab', 'Flow Forecasting Lab', 'AI Automation Lab',
  'Transformation Lab', 'Capstone Portfolio Lab',
];

/** Program-level portfolio deliverables, stored automatically to the GitHub portfolio. */
export const PORTFOLIO_DELIVERABLES = [
  'Sprint Dashboard', 'Release Plan', 'RAID Log', 'Agile Transformation Plan',
  'Executive Status Report', 'Stakeholder Communication Plan', 'Jira Configuration', 'AI Scrum Automation Workflow',
];
export const PORTFOLIO_GITHUB_STORED = true;

function simulationsFor(m: ModuleBlueprint): ModuleSimulation[] {
  const base = m.simulation;
  return [
    { level: 'beginner', title: `${base.company}: guided intro — ${base.scenario}` },
    { level: 'intermediate', title: `${base.company}: ${base.scenario}` },
    { level: 'advanced', title: `${base.company}: high-stakes escalation — ${base.scenario}` },
  ];
}

/** The fully-expanded flagship architecture (18 modules × full architecture). */
export function getFlagshipModules(): FlagshipModule[] {
  return SCRUM_18_BLUEPRINT.map((m, i) => ({
    no: m.no,
    title: m.title,
    competencies: m.competencies,
    aiMentorFocus: m.aiMentorFocus,
    lab: { name: LAB_LIBRARY[i % LAB_LIBRARY.length], tool: m.lab.tool, task: m.lab.task },
    simulations: simulationsFor(m),
    assessment: ASSESSMENT_ARCHITECTURE,
    interview: INTERVIEW_ARCHITECTURE,
    portfolioArtifact: m.portfolioArtifact,
    careerOutcome: m.careerOutcome,
  }));
}

export const FLAGSHIP_TOTALS = {
  modules: SCRUM_18_BLUEPRINT.length,
  simulations: SCRUM_18_BLUEPRINT.length * 3, // 54
  labs: SCRUM_18_BLUEPRINT.length,
  moduleQuizzes: SCRUM_18_BLUEPRINT.length,
  competencyQuizzes: SCRUM_18_BLUEPRINT.length,
  finalCertification: 1,
  questionBank: SCRUM_18_BLUEPRINT.length * ASSESSMENT_ARCHITECTURE.questionBankSize, // 1080
  portfolioDeliverables: PORTFOLIO_DELIVERABLES.length,
};
