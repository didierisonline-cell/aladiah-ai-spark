// =============================================================================
// Aladiah Student Success & Employability Authority — shared types
// Mirrors migration 20260610200000_student_success_authority.sql.
// =============================================================================

export const SUCCESS_AGENT_SLUG = 'student-success';

export type RiskLevel = 'low' | 'medium' | 'high';
export type StudentStatus = 'active' | 'at_risk' | 'thriving' | 'placement_ready';

export type SuccessAreaId =
  | 'competency_mastery'
  | 'risk_detection'
  | 'gap_analysis'
  | 'certification_readiness'
  | 'simulation_mastery'
  | 'portfolio_readiness'
  | 'interview_readiness'
  | 'resume_optimization'
  | 'linkedin_authority'
  | 'employability_scoring'
  | 'salary_projection'
  | 'promotion_readiness'
  | 'ai_readiness'
  | 'career_transformation';

export interface SuccessArea {
  id: SuccessAreaId;
  name: string;
  purpose: string;
  kpi: string;
}

export interface SalaryProjection {
  current_estimate?: number;
  projected: number;
  range: string;
  currency: string;
}

export interface SuccessStudent {
  id: string;
  user_id: string;
  name: string | null;
  program: string | null;
  competency_mastery: number;
  completion: number;
  certification_readiness: number;
  simulation_mastery: number;
  portfolio_readiness: number;
  interview_readiness: number;
  resume_score: number;
  linkedin_score: number;
  employability_score: number;
  ai_readiness: number;
  promotion_readiness: number;
  salary_projection: SalaryProjection | Record<string, never>;
  career_transformation_score: number; // PRIMARY KPI
  risk_level: RiskLevel;
  risk_factors: string[];
  status: StudentStatus;
  last_active: string | null;
  estimated: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SuccessIntervention {
  id: string;
  student_id: string;
  intervention_type: 'nudge' | 'coaching' | 'remediation' | 'outreach' | 'placement' | 'escalation';
  title: string;
  rationale: string | null;
  priority: string;
  status: 'pending' | 'approved' | 'actioned' | 'dismissed';
  approved_by_founder: boolean;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SuccessStats {
  students: number;
  avgCTS: number; // primary KPI across the cohort
  thriving: number;
  atRisk: number;
  placementReady: number;
  pendingInterventions: number;
  ctsDistribution: { band: string; count: number }[];
}
