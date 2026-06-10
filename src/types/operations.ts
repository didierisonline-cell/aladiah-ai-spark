// =============================================================================
// Aladiah Operations & Platform Authority — shared types
// Mirrors migration 20260610230000_operations_platform_authority.sql.
// =============================================================================

export const OPERATIONS_AGENT_SLUG = 'operations-platform';

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type ComponentStatus = 'operational' | 'degraded' | 'down' | 'unknown';
export type FindingStatus = 'open' | 'acknowledged' | 'resolved' | 'dismissed';
export type StatusCategory = 'platform' | 'infrastructure' | 'ai_service' | 'payment';

export type OpsEngineId =
  | 'platform_monitoring'
  | 'functional_testing'
  | 'course_integrity'
  | 'simulation_integrity'
  | 'payment'
  | 'infrastructure'
  | 'ai_engine_monitoring'
  | 'platform_audit';

export interface OpsEngineDef {
  id: OpsEngineId;
  name: string;
  purpose: string;
}

export interface OpsStatus {
  id: string;
  component: string;
  category: StatusCategory;
  status: ComponentStatus;
  latency_ms: number | null;
  detail: string | null;
  checked_at: string;
}

export interface OpsFinding {
  id: string;
  engine: string;
  severity: Severity;
  area: string | null;
  title: string;        // Issue
  detail: string | null;
  recommendation: string | null; // Fix Recommendation
  owner: string | null;          // Owner
  screenshot: string | null;     // Screenshot (URL / reference)
  status: FindingStatus;         // Status
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/** A surface area that must be audited before launch. */
export interface AuditSurfaceArea {
  category: string;
  items: string[];
  owner: string;
}

export interface OpsReport {
  id: string;
  report_date: string;
  platform_status: string;
  summary: string | null;
  critical_count: number;
  sections: Record<string, unknown>;
  created_at: string;
}

export interface OpsStats {
  platformStatus: string;
  components: number;
  operational: number;
  openFindings: number;
  critical: number;
  high: number;
  bySeverity: { severity: Severity; count: number }[];
}
