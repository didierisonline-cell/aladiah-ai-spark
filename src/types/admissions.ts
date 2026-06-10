// =============================================================================
// Aladiah Admissions Authority Agent — shared types
// Mirrors migration 20260610190000_admissions_authority_agent.sql.
// =============================================================================

export const ADMISSIONS_AGENT_SLUG = 'admissions-authority';

export type ProspectStatus = 'new' | 'qualified' | 'nurturing' | 'enrolled' | 'disqualified';
export type BudgetBand = 'low' | 'mid' | 'high' | 'unknown';
export type Timeline = 'now' | '3m' | '6m' | 'exploring';
export type FinancialReadiness = 'ready' | 'needs_plan' | 'not_ready' | 'unknown';

export type AdmissionsEngineId =
  | 'lead_qualification'
  | 'career_matching'
  | 'program_recommendation'
  | 'financial_readiness'
  | 'objection_resolution'
  | 'webinar_conversion'
  | 'enrollment'
  | 'follow_up'
  | 'employability_projection'
  | 'student_success_prediction';

export interface AdmissionsEngineDef {
  id: AdmissionsEngineId;
  name: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  qualityStandards: string[];
  kpis: string[];
  approval: string;
}

export interface Objection {
  type: string;
  concern: string;
  response: string;
}

export interface EmployabilityProjection {
  projected_employment_pct: number;
  salary_range: string;
  time_to_placement_months: number;
  demand: number;
}

export interface SuccessPrediction {
  completion_probability: number;
  certification_success: number;
  risk_factors: string[];
}

export interface Prospect {
  id: string;
  name: string | null;
  email: string | null;
  source: string | null;
  region: string | null;
  target_role: string | null;
  current_role: string | null;
  background: string | null;
  budget_band: BudgetBand;
  timeline: Timeline;
  commitment_hours: number;
  motivation: number;
  webinar_attended: boolean;
  qualification_score: number | null;
  fit_score: number | null;
  completion_probability: number | null;
  employability_score: number | null;
  financial_score: number | null;
  matched_program: string | null;
  recommended_program: string | null;
  financial_readiness: FinancialReadiness;
  status: ProspectStatus;
  objections: Objection[];
  employability_projection: EmployabilityProjection | Record<string, never>;
  success_prediction: SuccessPrediction | Record<string, never>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdmissionsRecommendation {
  id: string;
  prospect_id: string;
  rec_type: 'program' | 'enroll' | 'nurture' | 'disqualify' | 'action';
  title: string;
  rationale: string | null;
  priority: string;
  status: 'pending' | 'approved' | 'actioned' | 'dismissed';
  approved_by_founder: boolean;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdmissionsFollowup {
  id: string;
  prospect_id: string;
  step_no: number;
  channel: 'email' | 'call' | 'dm';
  subject: string | null;
  message: string | null;
  scheduled_for: string | null;
  status: 'drafted' | 'approved' | 'sent' | 'skipped';
  requires_approval: boolean;
  created_at: string;
}

export interface ProspectIntake {
  name: string;
  email?: string;
  source?: string;
  region?: string;
  targetRole: string;
  currentRole?: string;
  background?: string;
  budgetBand?: BudgetBand;
  timeline?: Timeline;
  commitmentHours?: number;
  motivation?: number;
  webinarAttended?: boolean;
}

export interface AdmissionsStats {
  total: number;
  qualified: number;
  nurturing: number;
  enrolled: number;
  disqualified: number;
  avgFit: number;
  avgCompletionProbability: number;
  pendingRecommendations: number;
  draftedFollowups: number;
  byProgram: { program: string; count: number }[];
}
