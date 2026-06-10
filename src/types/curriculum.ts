// =============================================================================
// Aladiah Curriculum Excellence Initiative — shared types
// Mirrors migration 20260610240000_curriculum_excellence.sql.
// =============================================================================

export const CURRICULUM_AGENT_SLUG = 'curriculum-excellence';

export interface StandardCategory {
  id: string;
  name: string;
  requirements: string[];
  target: string;
}

export interface ModuleBlueprint {
  no: number;
  title: string;
  competencies: string[];
  aiMentorFocus: string;
  lab: { tool: string; task: string };
  simulation: { company: string; scenario: string };
  portfolioArtifact: string;
  quizTiers: ('practice' | 'adaptive' | 'final')[];
  careerOutcome: string;
}

export interface ModuleGap {
  no: number;
  title: string;
  present: string[];
  missing: string[];
}

export interface CurriculumAudit {
  id: string;
  program: string;
  report_date: string;
  target_modules: number;
  excellence_score: number;
  present_count: number;
  gap_count: number;
  gaps: ModuleGap[];
  summary: string | null;
  created_at: string;
}
