// =============================================================================
// QA Agent — the 13 quality engines (Academic Quality & Employability Authority).
// Each engine reviews a slice of the ecosystem. `appliesTo` lists the artifact
// types it scores ('*' = all). `critical` engines must pass for an artifact to
// clear QA.
// =============================================================================
import { QAEngineDef } from '@/types/qa';

export const QA_ENGINES: QAEngineDef[] = [
  { id: 'curriculum_quality', name: 'Curriculum Quality Engine', purpose: 'World-class structure, pedagogy, clarity, and competency mapping.', appliesTo: ['module', 'learning_path'], critical: true },
  { id: 'assessment_quality', name: 'Assessment Quality Engine', purpose: 'Valid, fair, competency-tagged assessment that generates trustworthy signal.', appliesTo: ['quiz', 'assessment'], critical: true },
  { id: 'simulation_quality', name: 'Simulation Quality Engine', purpose: 'Realistic, decision-rich simulations with competency-mapped scoring.', appliesTo: ['simulation'], critical: true },
  { id: 'lab_quality', name: 'Lab Quality Engine', purpose: 'Hands-on labs with real tools and a concrete deliverable.', appliesTo: ['lab'], critical: false },
  { id: 'project_quality', name: 'Project Quality Engine', purpose: 'Portfolio-grade, employer-credible capstones.', appliesTo: ['project'], critical: false },
  { id: 'employability', name: 'Employability Engine', purpose: 'Does this advance employment, promotion, and salary growth?', appliesTo: ['*'], critical: true },
  { id: 'market_intelligence', name: 'Market Intelligence Engine', purpose: 'Aligned to real market demand and salary relevance.', appliesTo: ['*'], critical: false },
  { id: 'ai_quality', name: 'AI Quality Engine', purpose: 'AI integrated start to finish; learners become AI-ready.', appliesTo: ['*'], critical: true },
  { id: 'student_experience', name: 'Student Experience Engine', purpose: 'Clear, motivating, student-friendly experience.', appliesTo: ['*'], critical: false },
  { id: 'certification', name: 'Certification Engine', purpose: 'Certification rigor and credibility vs. external authorities.', appliesTo: ['learning_path', 'project', 'assessment'], critical: false },
  { id: 'portfolio', name: 'Portfolio Engine', purpose: 'Produces verifiable, employer-facing portfolio evidence.', appliesTo: ['project'], critical: false },
  { id: 'website_experience', name: 'Website Experience Engine', purpose: 'Platform/site experience quality (site-level reviews).', appliesTo: [], critical: false },
  { id: 'continuous_improvement', name: 'Continuous Improvement Engine', purpose: 'Captures findings and feeds improvement back into the factory.', appliesTo: ['*'], critical: false },
];

export function enginesForType(type: string): QAEngineDef[] {
  return QA_ENGINES.filter((e) => e.appliesTo.includes('*') || e.appliesTo.includes(type));
}
