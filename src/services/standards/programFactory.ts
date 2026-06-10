// =============================================================================
// Aladiah Program Factory — generate canonical programs from the Program Standard.
// Future programs are produced from a ProgramFactorySpec; the resulting blueprint
// conforms to the Program Standard v1.0 and is built via Curriculum Excellence →
// Product Builder → QA → Founder Approval → Student Success / Placement.
// =============================================================================
import { ModuleBlueprint } from '@/types/curriculum';
import { ProgramFactorySpec } from '@/types/programStandard';
import { SCRUM_18_BLUEPRINT } from '@/services/agents/curriculum/blueprint18';

/** Reference implementation of the standard. */
export const REFERENCE_SPEC: ProgramFactorySpec = {
  key: 'ai-scrum-master',
  name: 'AI Scrum Master Professional Certification',
  programKey: 'scrum',
  moduleCount: 18,
  competencies: [
    'scrum:framework', 'scrum:roles', 'scrum:events', 'scrum:artifacts',
    'scrum:empiricism', 'scrum:team-dynamics', 'scrum:stakeholders', 'scrum:delivery-metrics',
  ],
  description: 'The reference implementation of the Aladiah Program Standard v1.0.',
};

/** Example future-program specs (not yet built — show the factory generalizes). */
export const FUTURE_SPECS: ProgramFactorySpec[] = [
  { key: 'ai-product-manager', name: 'AI Product Manager Certification', programKey: 'ai-pm', moduleCount: 16, competencies: [], description: 'Generated from the standard once its taxonomy is added.' },
  { key: 'ai-project-manager', name: 'AI Project Manager Certification', programKey: 'project-management', moduleCount: 16, competencies: [], description: 'Generated from the standard once its taxonomy is added.' },
];

const LAB_TOOLS = ['Jira', 'Confluence', 'Miro', 'Azure DevOps', 'GitHub', 'AI tools'];
const PORTFOLIO_ARTIFACTS = ['Plan', 'Stakeholder Plan', 'Risk Register', 'Roadmap', 'Retrospective', 'Metrics Dashboard'];

/**
 * Generate a standard-conforming blueprint from a factory spec. The reference
 * program returns its curated 18-module blueprint; any other program is generated
 * generically (every module gets the full standard architecture).
 */
export function generateFactoryBlueprint(spec: ProgramFactorySpec): ModuleBlueprint[] {
  if (spec.key === REFERENCE_SPEC.key) return SCRUM_18_BLUEPRINT;

  const comps = spec.competencies.length ? spec.competencies : [`${spec.programKey}:core`];
  return Array.from({ length: spec.moduleCount }, (_, i) => {
    const no = i + 1;
    const isCapstone = no === spec.moduleCount;
    const competency = comps[i % comps.length];
    return {
      no,
      title: isCapstone ? `Capstone: ${spec.name} — Career Transformation & Placement` : `Module ${no}: ${competency}`,
      competencies: [competency],
      aiMentorFocus: isCapstone ? 'AI runs full mock interviews + portfolio review' : 'AI mentor integrated throughout the module',
      lab: { tool: LAB_TOOLS[i % LAB_TOOLS.length], task: `Hands-on practical for ${competency}` },
      simulation: { company: 'Enterprise scenario', scenario: `Real-world ${competency} challenge with stakeholders and conflict` },
      portfolioArtifact: isCapstone ? 'Capstone Case Study + Aladiah Profile' : `${competency} ${PORTFOLIO_ARTIFACTS[i % PORTFOLIO_ARTIFACTS.length]}`,
      quizTiers: ['practice', 'adaptive', 'final'],
      careerOutcome: isCapstone ? 'Employment + placement readiness' : `Capability in ${competency}`,
    } as ModuleBlueprint;
  });
}

/** The canonical per-module structure the standard requires (the module template). */
export const CANONICAL_MODULE_STRUCTURE = [
  'Lesson content (objectives, content, real examples)',
  'AI mentor (integrated, not a final chapter)',
  'Practice activities + scenario exercises',
  'Knowledge checks',
  'Three quiz tiers (practice / adaptive / final), competency-tagged',
  'Enterprise simulation (company, stakeholders, constraints, conflict, decision tree, scoring, AI feedback)',
  'Tool-based lab with a deliverable',
  'Portfolio artifact (employer-facing, saved to portfolio)',
  'Reflection',
  'Competency assessment',
  'Career outcome mapping',
];
