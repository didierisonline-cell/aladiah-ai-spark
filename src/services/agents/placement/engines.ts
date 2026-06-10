// =============================================================================
// Placement & Employer Relations Authority — the 15 areas it owns (code mirror).
// The bridge between Aladiah Academy and Aladiah Management.
// Primary KPI: Student Placement Rate.
// =============================================================================
import { PlacementArea } from '@/types/placement';

export const PLACEMENT_AREAS: PlacementArea[] = [
  { id: 'employer_intelligence', name: 'Employer Intelligence', purpose: 'Know who is hiring, for what, and why.', kpi: 'Employer coverage' },
  { id: 'employer_relationships', name: 'Employer Relationships', purpose: 'Build and grow employer partnerships.', kpi: 'Active clients' },
  { id: 'recruiter_network', name: 'Recruiter Network', purpose: 'Maintain a recruiter/agency network.', kpi: 'Active recruiters' },
  { id: 'talent_marketplace', name: 'Talent Marketplace', purpose: 'Surface placement-ready talent to employers.', kpi: 'Marketplace candidates' },
  { id: 'student_matching', name: 'Student Matching', purpose: 'Match candidates to the right roles.', kpi: 'Match quality' },
  { id: 'job_pipeline', name: 'Job Pipeline', purpose: 'Track open requisitions.', kpi: 'Open reqs' },
  { id: 'interview_tracking', name: 'Interview Tracking', purpose: 'Track interview stages and outcomes.', kpi: 'Interview→offer rate' },
  { id: 'offer_tracking', name: 'Offer Tracking', purpose: 'Track offers and acceptance.', kpi: 'Offer acceptance rate' },
  { id: 'salary_intelligence', name: 'Salary Intelligence', purpose: 'Real salary data fed back to the Academy.', kpi: 'Average salary' },
  { id: 'placement_tracking', name: 'Placement Tracking', purpose: 'Track placements end to end.', kpi: 'Student Placement Rate (PRIMARY)' },
  { id: 'staffing_operations', name: 'Staffing Operations', purpose: 'Run Aladiah Management staffing ops.', kpi: 'Time to placement' },
  { id: 'client_success', name: 'Client Success', purpose: 'Keep employer clients successful.', kpi: 'Employer satisfaction' },
  { id: 'employer_feedback', name: 'Employer Feedback', purpose: 'Capture employer feedback on talent.', kpi: 'Feedback loop closure' },
  { id: 'alumni_career_growth', name: 'Alumni Career Growth', purpose: 'Track promotions and retention post-placement.', kpi: 'Promotion + retention rate' },
  { id: 'workforce_demand_forecasting', name: 'Workforce Demand Forecasting', purpose: 'Forecast demand + feed it back to Academy agents.', kpi: 'Forecast accuracy' },
];

/** Agents that receive demand/salary feedback from placement. */
export const FEEDBACK_TARGETS = ['product-builder', 'qa-authority', 'student-success', 'admissions-authority'];
