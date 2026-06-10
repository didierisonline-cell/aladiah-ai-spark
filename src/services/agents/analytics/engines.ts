// =============================================================================
// Analytics & Executive Intelligence Authority — the 5 intelligence engines.
// Primary KPI: Career Transformation Impact Score (CTIS).
// =============================================================================
import { CTISComponents, IntelligenceEngineDef } from '@/types/analytics';

export const INTELLIGENCE_ENGINES: IntelligenceEngineDef[] = [
  {
    id: 'revenue_intelligence',
    name: 'Revenue Intelligence',
    tracks: ['Daily/Weekly/Monthly/Annual revenue', 'By program', 'By country', 'By tier', 'By source'],
    forecasts: ['30 days', '90 days', '12 months'],
  },
  {
    id: 'student_intelligence',
    name: 'Student Intelligence',
    tracks: ['Active/new students', 'Graduates', 'Completion + certification rates', 'Churn risk', 'Student health'],
    forecasts: ['Dropout probability', 'Completion probability', 'Certification probability'],
  },
  {
    id: 'employability_intelligence',
    name: 'Employability Intelligence',
    tracks: ['Placement rate', 'Time to placement', 'Interview success', 'Salary outcomes', 'Employer satisfaction'],
    forecasts: ['Job demand', 'Hiring trends', 'Salary trends'],
  },
  {
    id: 'curriculum_intelligence',
    name: 'Curriculum Intelligence',
    tracks: ['Best/worst programs', 'Weak modules/lessons/simulations/labs/projects'],
    forecasts: ['Improvements', 'New simulations/labs/projects', 'New programs'],
  },
  {
    id: 'marketing_intelligence',
    name: 'Marketing Intelligence',
    tracks: ['Leads', 'Conversions', 'Funnel', 'CPL', 'CPA', 'Campaign ROI'],
    forecasts: ['Enrollment growth', 'Revenue growth'],
  },
];

/** CTIS weights (sum = 100). */
export const CTIS_WEIGHTS: Record<keyof CTISComponents, number> = {
  student_success: 25,
  placement_success: 25,
  salary_growth: 10,
  certification_success: 15,
  competency_growth: 15,
  employer_satisfaction: 10,
};

export function computeCTIS(c: CTISComponents): number {
  let total = 0;
  let w = 0;
  for (const [k, weight] of Object.entries(CTIS_WEIGHTS)) {
    total += (c[k as keyof CTISComponents] ?? 0) * weight;
    w += weight;
  }
  return Math.round(total / Math.max(w, 1));
}
