// =============================================================================
// Aladiah World-Class QA Agent — shared types
// Mirrors migration 20260610180000_qa_quality_authority.sql.
// =============================================================================

export const QA_AGENT_SLUG = 'qa-authority';

export type QAVerdict = 'pass' | 'conditional' | 'fail';

export type QAEngineId =
  | 'curriculum_quality'
  | 'assessment_quality'
  | 'simulation_quality'
  | 'lab_quality'
  | 'project_quality'
  | 'employability'
  | 'market_intelligence'
  | 'ai_quality'
  | 'student_experience'
  | 'certification'
  | 'portfolio'
  | 'website_experience'
  | 'continuous_improvement';

export interface QAEngineDef {
  id: QAEngineId;
  name: string;
  purpose: string;
  appliesTo: string[]; // artifact types ('*' = all)
  critical: boolean;
}

export interface BenchmarkAuthority {
  id: string;
  name: string;
  domains: string[]; // which artifact areas it anchors
}

/** The six required validations. */
export type ValidationKey =
  | 'github_portfolio'
  | 'interview_readiness'
  | 'market_demand'
  | 'salary_relevance'
  | 'ai_readiness'
  | 'employer_alignment';

export interface ValidationResult {
  key: ValidationKey;
  passed: boolean;
  note: string;
}

export interface QAFinding {
  severity: 'low' | 'medium' | 'high';
  area: string;
  note: string;
}

export interface QAReview {
  id: string;
  artifact_id: string;
  artifact_type: string;
  engine: string | null;
  overall_score: number;
  verdict: QAVerdict;
  passed: boolean;
  engine_scores: Record<string, number>;
  benchmark_scores: Record<string, number>;
  validations: Record<string, ValidationResult>;
  findings: QAFinding[];
  reviewer_agent: string;
  created_at: string;
}

export interface MarketIntelligence {
  id: string;
  role: string;
  region: string;
  demand_score: number;
  salary_min: number | null;
  salary_median: number | null;
  salary_max: number | null;
  currency: string | null;
  ai_demand: number;
  trend: string;
  source: string | null;
  updated_at: string;
  created_at: string;
}

export interface QAStats {
  reviewed: number;
  passed: number;
  conditional: number;
  failed: number;
  awaitingReview: number; // artifacts in qa_review status
  avgScore: number;
  byVerdict: { verdict: QAVerdict; count: number }[];
}
