// =============================================================================
// Aladiah SEO Strategy Agent — shared types
// Mirrors migration 20260610150000_seo_strategy_agent.sql.
// =============================================================================

export const SEO_AGENT_SLUG = 'seo-strategy';

export type SearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';
export type SeoPriority = 'low' | 'medium' | 'high';
export type KeywordStatus = 'opportunity' | 'targeted' | 'ranking' | 'won' | 'dropped';

export interface SeoKeyword {
  id: string;
  keyword: string;
  category: string | null;
  cluster: string | null;
  intent: SearchIntent | null;
  search_volume: number;
  difficulty: number;
  priority: SeoPriority;
  current_rank: number | null;
  target_rank: number | null;
  status: KeywordStatus;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ClusterTopic {
  topic: string;
  keyword: string;
  status: 'planned' | 'requested' | 'published';
}
export interface InternalLink {
  from: string;
  to: string;
  anchor: string;
}
export interface SeoCluster {
  id: string;
  name: string;
  pillar_keyword: string | null;
  category: string | null;
  description: string | null;
  pillar_status: 'planned' | 'requested' | 'published';
  supporting_topics: ClusterTopic[];
  internal_links: InternalLink[];
  status: string;
  created_by_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeoCompetitor {
  id: string;
  name: string;
  domain: string | null;
  focus_areas: string[];
  strengths: string[];
  tracked_keywords: string[];
  notes: string | null;
  last_reviewed: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AuditIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  detail: string;
}
export interface SeoAudit {
  id: string;
  page_path: string;
  title: string | null;
  score: number | null;
  issues: AuditIssue[];
  recommendations: string | null;
  status: 'open' | 'resolved';
  created_by_agent: string | null;
  created_at: string;
  updated_at: string;
}

export type RecType =
  | 'keyword'
  | 'cluster'
  | 'landing_page'
  | 'internal_link'
  | 'audit'
  | 'content_request';
export type RecStatus = 'pending' | 'delegated' | 'done' | 'dismissed';

export interface SeoRecommendation {
  id: string;
  title: string;
  rec_type: RecType;
  priority: SeoPriority;
  rationale: string | null;
  target_keyword: string | null;
  cluster: string | null;
  status: RecStatus;
  delegated_task_id: string | null;
  created_by_agent: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ---- dashboard rollups -----------------------------------------------------
export interface SeoStats {
  totalKeywords: number;
  opportunities: number;
  targeted: number;
  clusters: number;
  competitors: number;
  openAudits: number;
  recommendations: number;
  marketingRequests: number;
  topCategories: { category: string; count: number }[];
}

// ---- SEO task kinds (for CEO -> SEO delegation) ----------------------------
export type SeoTaskKind =
  | 'keyword_research'
  | 'build_cluster'
  | 'competitor_analysis'
  | 'audit'
  | 'content_request';
