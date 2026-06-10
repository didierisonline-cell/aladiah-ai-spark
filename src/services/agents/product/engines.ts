// =============================================================================
// Aladiah Career Transformation Architecture — engine registry (code mirror)
// SOURCE OF TRUTH: docs/agents/product-builder/CAREER_TRANSFORMATION_ARCHITECTURE.md
// The Product Builder is a Career Transformation Factory of ten engines that
// optimize for the six transformation OUTCOMES, not course completion.
// =============================================================================
import { ArtifactType, EngineDef, EngineId, TransformationOutcome } from '@/types/product';

export const TRANSFORMATION_OUTCOMES: { id: TransformationOutcome; label: string }[] = [
  { id: 'employment', label: 'Employment' },
  { id: 'promotion', label: 'Promotion' },
  { id: 'salary_growth', label: 'Salary Growth' },
  { id: 'leadership_readiness', label: 'Leadership Readiness' },
  { id: 'ai_readiness', label: 'AI Readiness' },
  { id: 'competency_mastery', label: 'Competency Mastery' },
];

export const ENGINES: EngineDef[] = [
  {
    id: 'competency',
    name: 'Competency Engine',
    purpose: 'Define and measure what a learner knows and can do, against the canonical taxonomy.',
    inputs: ['Competency taxonomy', 'Live quiz coverage', 'Attempt analytics'],
    outputs: ['Competency maps', 'Tagged objectives', 'Coverage reports'],
    qualityStandards: ['One Axis-1 slug per objective', 'No invented slugs', 'Measurable outcomes'],
    kpis: ['Competency Mastery %', 'Coverage per competency', 'Mastery velocity'],
    approval: 'Founder approval; competency mapping non-negotiable',
    artifactTypes: ['module', 'learning_path'],
    targetOutcomes: ['competency_mastery'],
  },
  {
    id: 'assessment',
    name: 'Assessment Engine',
    purpose: 'Prove competency through rigorous, fair assessment that generates trustworthy signal.',
    inputs: ['Competency map', 'Target role', 'Difficulty calibration'],
    outputs: ['Quizzes', 'Diagnostic assessments', 'Competency checkpoints'],
    qualityStandards: ['≥4 tagged questions', 'Valid answers + explanations', 'No A)/B) prefixes'],
    kpis: ['Pass rate', 'Score distribution', 'Mastery lift'],
    approval: 'Founder approval; strong-quiz standard enforced',
    artifactTypes: ['quiz', 'assessment'],
    targetOutcomes: ['competency_mastery', 'ai_readiness'],
  },
  {
    id: 'simulation',
    name: 'Simulation Engine',
    purpose: 'Build real-world capability through crisis, stakeholder, leadership, and communication simulations.',
    inputs: ['Competency map', 'Role scenarios', 'Scoring rubrics'],
    outputs: ['Branching simulations', 'Competency-mapped rubrics'],
    qualityStandards: ['≥2 decision points', 'Competency-mapped rubric', 'Realistic scenario'],
    kpis: ['Completion + score', 'Decision quality', 'Leadership Readiness lift'],
    approval: 'Founder approval; strong-simulation standard enforced',
    artifactTypes: ['simulation'],
    targetOutcomes: ['leadership_readiness', 'competency_mastery'],
  },
  {
    id: 'lab',
    name: 'Lab Engine',
    purpose: 'Hands-on practice that turns knowledge into doing, producing real deliverables.',
    inputs: ['Competency', 'Tools', 'Real task templates'],
    outputs: ['Step-by-step labs', 'Deliverables'],
    qualityStandards: ['≥3 steps', 'A deliverable', 'Real tools'],
    kpis: ['Lab completion', 'Deliverable quality', 'Applied-skill lift'],
    approval: 'Founder approval; hands-on-lab standard enforced',
    artifactTypes: ['lab'],
    targetOutcomes: ['competency_mastery', 'ai_readiness'],
  },
  {
    id: 'project',
    name: 'Project Engine',
    purpose: 'Portfolio-grade capstones that demonstrate end-to-end capability to employers.',
    inputs: ['Competency set', 'Role brief', 'Evaluation rubric'],
    outputs: ['Project briefs', 'Competency-mapped rubrics'],
    qualityStandards: ['Clear brief', 'Measurable requirements', 'Rubric maps ≥3 competencies'],
    kpis: ['Project completion', 'Portfolio strength', 'Employment lift'],
    approval: 'Founder approval',
    artifactTypes: ['project'],
    targetOutcomes: ['leadership_readiness', 'employment'],
  },
  {
    id: 'interview_prep',
    name: 'Interview Preparation Engine',
    purpose: 'Make learners interview-ready: question banks, mock scripts, STAR frameworks.',
    inputs: ['Target role', 'Competency map', 'Employer expectations'],
    outputs: ['Interview prep packs', 'Mock-interview rubrics'],
    qualityStandards: ['Role-specific', 'Competency-aligned', 'Scored mock rubric'],
    kpis: ['Interview-success rate', 'Mock score', 'Offer rate'],
    approval: 'Founder approval',
    artifactTypes: ['interview_prep'],
    targetOutcomes: ['employment', 'promotion'],
  },
  {
    id: 'career_transformation',
    name: 'Career Transformation Engine',
    purpose: 'Orchestrate the outcome journey: Learn → Practice → Simulate → Validate → Interview → Place → Grow.',
    inputs: ['Learner goal', 'Current state', 'Target role/salary', 'All engine outputs'],
    outputs: ['Career-transformation plans', 'Outcome-driven learning paths'],
    qualityStandards: ['Ends in employability not completion', 'Milestones map to outcomes', 'AI coaching woven in'],
    kpis: ['Job-placement rate', 'Salary growth', 'Promotion rate', 'Time-to-outcome'],
    approval: 'Founder approval',
    artifactTypes: ['career_plan', 'learning_path'],
    targetOutcomes: ['employment', 'salary_growth', 'promotion'],
  },
  {
    id: 'employer_alignment',
    name: 'Employer Alignment Engine',
    purpose: 'Make capability visible and trusted by employers; align outputs to real job requirements.',
    inputs: ['Role requirements', 'Employer expectations', 'Competency map'],
    outputs: ['Role→competency maps', 'Employer-readiness rubrics', 'Aladiah-Profile criteria'],
    qualityStandards: ['Maps to real role requirements', 'Measurable readiness', 'Employer-credible'],
    kpis: ['Employer-readiness score', 'Placement-success rate', 'Employer satisfaction'],
    approval: 'Founder approval',
    artifactTypes: ['employer_alignment'],
    targetOutcomes: ['employment'],
  },
  {
    id: 'ai_integration',
    name: 'AI Integration Engine',
    purpose: 'Weave AI through every artifact (tutor, feedback, coach, practice) and build AI-readiness.',
    inputs: ['Every artifact', 'AI-pedagogy patterns', 'AI-skill frameworks'],
    outputs: ['AI-integration specs', 'AI-readiness modules'],
    qualityStandards: ['AI integrated start to finish (critical)', 'AI-readiness measurable'],
    kpis: ['AI Readiness score', 'AI-tool fluency', 'AI-assisted task performance'],
    approval: 'Founder approval; AI-integration standard enforced on all artifacts',
    artifactTypes: ['ai_readiness'],
    targetOutcomes: ['ai_readiness'],
  },
  {
    id: 'student_outcome',
    name: 'Student Outcome Engine',
    purpose: 'Close the loop — measure real transformation and feed it back into prioritization.',
    inputs: ['Placement/salary/promotion data', 'Competency analytics', 'All engine KPIs'],
    outputs: ['Outcome dashboards', 'Outcome-improvement plans', 'Prioritization signals'],
    qualityStandards: ['Metrics are real (never fabricated)', 'Tied to the six outcomes', 'Actionable'],
    kpis: ['Employment', 'Promotion', 'Salary Growth', 'Leadership Readiness', 'AI Readiness', 'Competency Mastery'],
    approval: 'Founder approval for plans; outcome data is read-only signal',
    artifactTypes: ['outcome_plan'],
    targetOutcomes: ['employment', 'promotion', 'salary_growth', 'leadership_readiness', 'ai_readiness', 'competency_mastery'],
  },
];

const TYPE_TO_ENGINE = new Map<ArtifactType, EngineId>();
const TYPE_TO_OUTCOMES = new Map<ArtifactType, TransformationOutcome[]>();
for (const e of ENGINES) {
  for (const t of e.artifactTypes) {
    if (!TYPE_TO_ENGINE.has(t)) TYPE_TO_ENGINE.set(t, e.id);
    if (!TYPE_TO_OUTCOMES.has(t)) TYPE_TO_OUTCOMES.set(t, e.targetOutcomes);
  }
}

export function engineForType(type: ArtifactType): EngineId {
  return TYPE_TO_ENGINE.get(type) ?? 'competency';
}
export function outcomesForType(type: ArtifactType): TransformationOutcome[] {
  return TYPE_TO_OUTCOMES.get(type) ?? ['competency_mastery'];
}
export function engineById(id: EngineId): EngineDef | undefined {
  return ENGINES.find((e) => e.id === id);
}
