// =============================================================================
// Aladiah Placement & Employer Relations Authority — shared types
// Mirrors migration 20260610210000_placement_employer_authority.sql.
// =============================================================================

export const PLACEMENT_AGENT_SLUG = 'placement-authority';

export type RelationshipStatus = 'prospect' | 'engaged' | 'client' | 'recruiter' | 'inactive';
export type CandidateStatus = 'received' | 'matched' | 'submitted' | 'interviewing' | 'offer' | 'placed' | 'declined';
export type MatchStage = 'matched' | 'submitted' | 'interview' | 'offer' | 'placed' | 'rejected';
export type ActionType = 'contract' | 'candidate_submission' | 'employer_outreach';
export type ActionStatus = 'pending' | 'approved' | 'sent' | 'dismissed';

export type PlacementAreaId =
  | 'employer_intelligence'
  | 'employer_relationships'
  | 'recruiter_network'
  | 'talent_marketplace'
  | 'student_matching'
  | 'job_pipeline'
  | 'interview_tracking'
  | 'offer_tracking'
  | 'salary_intelligence'
  | 'placement_tracking'
  | 'staffing_operations'
  | 'client_success'
  | 'employer_feedback'
  | 'alumni_career_growth'
  | 'workforce_demand_forecasting';

export interface PlacementArea {
  id: PlacementAreaId;
  name: string;
  purpose: string;
  kpi: string;
}

export interface Employer {
  id: string;
  name: string;
  industry: string | null;
  region: string | null;
  relationship_status: RelationshipStatus;
  demand_roles: string[];
  open_reqs: number;
  satisfaction: number | null;
  contact_name: string | null;
  contact_email: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  user_id: string;
  name: string | null;
  program: string | null;
  target_role: string | null;
  employability_score: number;
  portfolio_score: number;
  interview_readiness: number;
  competency_mastery: number;
  cts: number;
  status: CandidateStatus;
  source_success_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PlacementJob {
  id: string;
  employer_id: string | null;
  role: string;
  region: string | null;
  salary_min: number | null;
  salary_median: number | null;
  salary_max: number | null;
  status: 'open' | 'filled' | 'closed';
  demand: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PlacementMatch {
  id: string;
  candidate_id: string;
  job_id: string | null;
  employer_id: string | null;
  match_score: number;
  stage: MatchStage;
  interview_date: string | null;
  offer_amount: number | null;
  placed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PlacementAction {
  id: string;
  action_type: ActionType;
  candidate_id: string | null;
  employer_id: string | null;
  match_id: string | null;
  title: string;
  body: string | null;
  status: ActionStatus;
  approved_by_founder: boolean;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DemandSignal {
  id: string;
  role: string;
  region: string;
  demand_score: number;
  salary_min: number | null;
  salary_median: number | null;
  salary_max: number | null;
  skill_gaps: string[];
  trend: string;
  period: string;
  source: string | null;
  fed_back: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlacementStats {
  candidates: number;
  placed: number;
  placementRate: number;        // PRIMARY KPI (%)
  avgSalary: number;            // secondary
  timeToPlacementDays: number;  // secondary
  employerSatisfaction: number; // secondary
  promotionRate: number;        // secondary
  retentionRate: number;        // secondary
  employers: number;
  openJobs: number;
  pendingActions: number;
  pipeline: { stage: MatchStage; count: number }[];
}
