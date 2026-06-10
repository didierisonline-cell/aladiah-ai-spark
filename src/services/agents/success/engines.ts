// =============================================================================
// Student Success & Employability Authority — the 14 areas it owns (code mirror).
// The Career Transformation Score (CTS) is the primary KPI; it is the weighted
// composite of the readiness dimensions below.
// =============================================================================
import { SuccessArea, SuccessAreaId } from '@/types/success';

export const SUCCESS_AREAS: SuccessArea[] = [
  { id: 'competency_mastery', name: 'Competency Mastery', purpose: 'Measure what the student actually knows and can do.', kpi: 'Competency mastery %' },
  { id: 'risk_detection', name: 'Student Risk Detection', purpose: 'Detect disengagement / dropout risk early.', kpi: 'At-risk rate (inverse)' },
  { id: 'gap_analysis', name: 'Learning Gap Analysis', purpose: 'Pinpoint weak competencies to remediate.', kpi: 'Gaps closed' },
  { id: 'certification_readiness', name: 'Certification Readiness', purpose: 'Readiness to pass certification.', kpi: 'Certification-ready %' },
  { id: 'simulation_mastery', name: 'Simulation Mastery', purpose: 'Real-world capability via simulations.', kpi: 'Simulation score' },
  { id: 'portfolio_readiness', name: 'Portfolio Readiness', purpose: 'Employer-facing portfolio evidence.', kpi: 'Portfolio-ready %' },
  { id: 'interview_readiness', name: 'Interview Readiness', purpose: 'Readiness to win interviews.', kpi: 'Mock-interview score' },
  { id: 'resume_optimization', name: 'Resume Optimization', purpose: 'A strong, role-aligned resume.', kpi: 'Resume score' },
  { id: 'linkedin_authority', name: 'LinkedIn Authority', purpose: 'Professional presence + authority.', kpi: 'LinkedIn score' },
  { id: 'employability_scoring', name: 'Employability Scoring', purpose: 'Overall readiness to be hired.', kpi: 'Employability score' },
  { id: 'salary_projection', name: 'Salary Projection', purpose: 'Realistic salary outcome projection.', kpi: 'Projected salary' },
  { id: 'promotion_readiness', name: 'Promotion Readiness', purpose: 'Readiness to grow into leadership.', kpi: 'Promotion-ready %' },
  { id: 'ai_readiness', name: 'AI Readiness', purpose: 'AI-augmented professional capability.', kpi: 'AI readiness score' },
  { id: 'career_transformation', name: 'Career Transformation', purpose: 'The end-to-end transformation outcome.', kpi: 'Career Transformation Score (PRIMARY)' },
];

/** CTS weights (sum = 100). The Career Transformation Score is the primary KPI. */
export const CTS_WEIGHTS: Partial<Record<string, number>> = {
  competency_mastery: 20,
  completion: 10,
  certification_readiness: 10,
  simulation_mastery: 10,
  portfolio_readiness: 8,
  interview_readiness: 10,
  resume_score: 5,
  linkedin_score: 5,
  employability_score: 12,
  ai_readiness: 5,
  promotion_readiness: 5,
};

export function computeCTS(dims: Record<string, number>): number {
  let total = 0;
  let weightSum = 0;
  for (const [k, w] of Object.entries(CTS_WEIGHTS)) {
    total += (dims[k] ?? 0) * (w ?? 0);
    weightSum += w ?? 0;
  }
  return Math.round(total / Math.max(weightSum, 1));
}

export const areaById = (id: SuccessAreaId) => SUCCESS_AREAS.find((a) => a.id === id);
