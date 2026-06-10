// =============================================================================
// Aladiah AI Workforce — shared types for agent reports
// Mirrors the CEO Chief of Staff "Daily Report JSON Schema" (blueprint v1, §6)
// and the agent_* Supabase tables (migration 20260610120000).
// =============================================================================

export type UrgencyLevel = 'normal' | 'elevated' | 'high' | 'critical';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Priority = 'low' | 'medium' | 'high';

export interface RevenueSummary {
  new_paid_students: number;
  mrr: number;
  revenue_today: number;
  failed_payments: number;
  cancellations: number;
  notes: string;
}

export interface StudentSummary {
  new_signups: number;
  active_students: number;
  inactive_students: number;
  quiz_failures: number;
  students_needing_help: number;
  notes: string;
}

export interface ProductSummary {
  new_lessons_created: number;
  new_modules_completed: number;
  new_simulations_created: number;
  content_gaps: string[];
  notes: string;
}

export interface PlatformSummary {
  website_status: string;
  signup_flow_status: string;
  payment_flow_status: string;
  broken_links: string[];
  errors_detected: string[];
  notes: string;
}

export interface MarketingSummary {
  posts_published: number;
  top_content: string;
  website_visitors: number;
  leads_generated: number;
  notes: string;
}

export interface SalesSummary {
  new_inquiries: number;
  hot_leads: number;
  unanswered_messages: number;
  webinar_signups: number;
  notes: string;
}

export interface AgentRisk {
  risk: string;
  category: string;
  severity: Severity;
  recommended_response: string;
}

export interface CeoAction {
  action: string;
  reason: string;
  priority: Priority;
  estimated_impact: string;
}

/** The full daily command report — the structured-output contract (blueprint §6). */
export interface DailyCommandReport {
  report_date: string; // YYYY-MM-DD
  agent_name: string;
  urgency_level: UrgencyLevel;
  executive_summary: string;
  revenue: RevenueSummary;
  students: StudentSummary;
  product: ProductSummary;
  platform: PlatformSummary;
  marketing: MarketingSummary;
  sales: SalesSummary;
  risks: AgentRisk[];
  recommended_ceo_actions: CeoAction[];
}

// ----------------------------------------------------------------------------
// Persistence row shapes (match the agent_* tables)
// ----------------------------------------------------------------------------

/** A row of public.agent_reports. JSONB columns hold the report sections. */
export interface AgentReportRow {
  id: string;
  report_date: string;
  agent_name: string;
  report_type: string;
  summary: string | null;
  revenue_summary: RevenueSummary | null;
  student_summary: StudentSummary | null;
  product_summary: ProductSummary | null;
  platform_summary: PlatformSummary | null;
  marketing_summary: MarketingSummary | null;
  sales_summary: SalesSummary | null;
  risks: AgentRisk[] | null;
  recommended_actions: CeoAction[] | null;
  urgency_level: string | null;
  created_at: string;
}

export interface AgentTaskRow {
  id: string;
  title: string;
  description: string | null;
  assigned_agent: string | null;
  status: string;
  priority: string;
  category: string | null;
  due_date: string | null;
  source_report_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessMetricsDailyRow {
  id: string;
  metric_date: string;
  new_signups: number;
  paid_students: number;
  active_students: number;
  inactive_students: number;
  new_leads: number;
  hot_leads: number;
  mrr: number;
  revenue_today: number;
  failed_payments: number;
  cancelled_subscriptions: number;
  website_visitors: number;
  posts_published: number;
  support_tickets_open: number;
  created_at: string;
}

/** Rebuild the in-memory report shape from a stored agent_reports row. */
export function reportFromRow(row: AgentReportRow): DailyCommandReport {
  return {
    report_date: row.report_date,
    agent_name: row.agent_name,
    urgency_level: (row.urgency_level as UrgencyLevel) || 'normal',
    executive_summary: row.summary || '',
    revenue: row.revenue_summary as RevenueSummary,
    students: row.student_summary as StudentSummary,
    product: row.product_summary as ProductSummary,
    platform: row.platform_summary as PlatformSummary,
    marketing: row.marketing_summary as MarketingSummary,
    sales: row.sales_summary as SalesSummary,
    risks: row.risks || [],
    recommended_ceo_actions: row.recommended_actions || [],
  };
}
