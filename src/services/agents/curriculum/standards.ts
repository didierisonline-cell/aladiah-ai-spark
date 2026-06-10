// =============================================================================
// Aladiah Curriculum Excellence Framework — the standards every program must meet.
// Source of truth (code mirror): docs/curriculum/CURRICULUM_EXCELLENCE_FRAMEWORK.md
// =============================================================================
import { StandardCategory } from '@/types/curriculum';

export const CURRICULUM_STANDARDS: StandardCategory[] = [
  {
    id: 'curriculum',
    name: 'Curriculum Standards',
    requirements: ['Lessons', 'AI Coach Interaction', 'Practice Activities', 'Scenario Exercises', 'Knowledge Checks', 'Quiz', 'Simulation', 'Lab', 'Portfolio Artifact', 'Reflection', 'Competency Mapping'],
    target: 'Every module contains all 11 elements; competency-mapped end to end.',
  },
  {
    id: 'assessment',
    name: 'Assessment Standards',
    requirements: ['Practice Quiz', 'Adaptive Quiz', 'Final Quiz', 'Questions rotate', 'Competency-tagged', 'Exam-quality', 'Reflects real Scrum certifications'],
    target: 'Three quiz tiers per module; exam-quality, rotating, competency-tagged.',
  },
  {
    id: 'simulation',
    name: 'Simulation Standards',
    requirements: ['Real companies', 'Real stakeholders', 'Real constraints', 'Real conflict', 'Decision trees', 'Scoring engine', 'AI feedback'],
    target: 'Enterprise-level realism in every module simulation.',
  },
  {
    id: 'lab',
    name: 'Lab Standards',
    requirements: ['Jira', 'Confluence', 'Miro', 'Azure DevOps', 'GitHub', 'AI tools'],
    target: 'Hands-on, tool-based practical experience in every module.',
  },
  {
    id: 'portfolio',
    name: 'Portfolio Standards',
    requirements: ['Sprint Plans', 'Stakeholder Plans', 'Risk Registers', 'Roadmaps', 'Retrospectives', 'Agile Metrics Dashboards'],
    target: 'Every module produces employer-facing evidence saved to the student portfolio.',
  },
  {
    id: 'employability',
    name: 'Employability Standards',
    requirements: ['Interview readiness', 'Resume strength', 'LinkedIn authority', 'Portfolio quality'],
    target: 'Every module measurably improves employability.',
  },
  {
    id: 'ai_integration',
    name: 'AI Integration Standards',
    requirements: ['AI in every module', 'Integrated throughout (not a final chapter)', 'AI mentor', 'AI feedback', 'AI workflows'],
    target: 'AI woven through every module, start to finish.',
  },
];

/** The module-level required elements used by the audit. */
export const MODULE_REQUIRED_ELEMENTS = [
  'lesson_content', 'ai_mentor', 'practice', 'scenario', 'knowledge_check',
  'quiz', 'simulation', 'lab', 'portfolio_artifact', 'reflection', 'competency_assessment',
];
