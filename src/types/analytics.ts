// =============================================================================
// Aladiah Analytics & Executive Intelligence Authority — shared types
// Mirrors migration 20260610220000_analytics_intelligence.sql.
// =============================================================================

export const ANALYTICS_AGENT_SLUG = 'analytics-intelligence';

export type IntelligenceEngineId =
  | 'revenue_intelligence'
  | 'student_intelligence'
  | 'employability_intelligence'
  | 'curriculum_intelligence'
  | 'marketing_intelligence';

export interface IntelligenceEngineDef {
  id: IntelligenceEngineId;
  name: string;
  tracks: string[];
  forecasts: string[];
}

export interface Metric { label: string; value: string; note?: string; }

export interface IntelligenceSections {
  revenue: { metrics: Metric[]; note: string };
  students: { metrics: Metric[]; note: string };
  employability: { metrics: Metric[]; note: string };
  curriculum: { metrics: Metric[]; note: string };
  marketing: { metrics: Metric[]; note: string };
}

export interface Forecasts {
  revenue_30d: number;
  revenue_90d: number;
  revenue_12m: number;
  enrollment_growth_pct: number;
  avg_completion_probability: number;
  avg_dropout_probability: number;
}

export interface AnalyticsReport {
  id: string;
  report_type: string;
  report_date: string;
  ctis: number; // Career Transformation Impact Score — master KPI
  summary: string | null;
  sections: IntelligenceSections | Record<string, never>;
  forecasts: Forecasts | Record<string, never>;
  risks: string[];
  recommendations: string[];
  priority_actions: string[];
  created_at: string;
}

export interface AnalyticsMetric {
  id: string;
  metric_key: string;
  value: number;
  dimension: string | null;
  period: string;
  captured_at: string;
}

/** CTIS components (weighted). */
export interface CTISComponents {
  student_success: number;
  placement_success: number;
  salary_growth: number;
  certification_success: number;
  competency_growth: number;
  employer_satisfaction: number;
}
