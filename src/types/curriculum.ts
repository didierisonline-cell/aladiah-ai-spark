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
  // AI-readiness fields (optional so existing blueprints stay valid):
  //   aiSkills    — explicit, hireable AI/automation skills the module teaches.
  //   futureOfWork — how AI reshapes this competency / the future-of-role angle.
  // Both feed the AI-Readiness score (src/services/standards/aiReadiness.ts).
  aiSkills?: string[];
  futureOfWork?: string;
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
  excellence_score: number; // build progress (% artifacts present)
  present_count: number;
  gap_count: number;
  gaps: ModuleGap[];
  summary: string | null;
  // Program Standard v1.0 evaluation:
  ces?: number;                                   // Curriculum Excellence Score vs the standard
  dimension_scores?: Record<string, number>;
  world_class?: boolean;
  standard_version?: string;
  created_at: string;
}
