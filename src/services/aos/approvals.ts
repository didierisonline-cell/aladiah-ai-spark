// =============================================================================
// Founder Approval Queue — cross-agent aggregation.
// Nothing an agent produces goes live on its own. Product artifacts (after QA
// review), marketing content, and authority recommendations all land here for
// the founder to approve. This rolls every source into one unified queue for
// /admin/approvals. Every query is defensive (missing table -> []).
// =============================================================================
import { db } from './_internal';

export type ApprovalSource =
  | 'product'
  | 'marketing'
  | 'admissions'
  | 'student-success'
  | 'placement';

export interface ApprovalItem {
  id: string;
  source: ApprovalSource;
  sourceLabel: string;
  title: string;
  detail: string | null;
  status: string;
  createdAt: string | null;
  /** Where the founder reviews/acts on this item. */
  route: string;
}

interface SourceSpec {
  source: ApprovalSource;
  sourceLabel: string;
  table: string;
  statuses: string[];
  route: string;
  title: (r: any) => string;
  detail: (r: any) => string | null;
}

const SOURCES: SourceSpec[] = [
  {
    source: 'product',
    sourceLabel: 'Product Builder',
    table: 'product_artifacts',
    statuses: ['pending_approval'],
    route: '/admin/product-agent',
    title: (r) => r.title ?? r.artifact_type ?? 'Product artifact',
    detail: (r) => r.engine ?? r.artifact_type ?? null,
  },
  {
    source: 'marketing',
    sourceLabel: 'Marketing',
    table: 'marketing_content',
    statuses: ['pending_approval'],
    route: '/admin/marketing-agent',
    title: (r) => r.title ?? r.content_type ?? 'Marketing content',
    detail: (r) => r.platform ?? r.content_type ?? null,
  },
  {
    source: 'admissions',
    sourceLabel: 'Admissions',
    table: 'admissions_recommendations',
    statuses: ['pending', 'pending_approval'],
    route: '/admin/admissions-agent',
    title: (r) => r.title ?? r.recommendation ?? 'Admissions recommendation',
    detail: (r) => r.summary ?? r.rationale ?? null,
  },
  {
    source: 'student-success',
    sourceLabel: 'Student Success',
    table: 'success_recommendations',
    statuses: ['pending', 'pending_approval'],
    route: '/admin/student-success',
    title: (r) => r.title ?? r.recommendation ?? 'Success recommendation',
    detail: (r) => r.summary ?? r.rationale ?? null,
  },
  {
    source: 'placement',
    sourceLabel: 'Placement',
    table: 'placement_recommendations',
    statuses: ['pending', 'pending_approval'],
    route: '/admin/placement-agent',
    title: (r) => r.title ?? r.recommendation ?? 'Placement action',
    detail: (r) => r.summary ?? r.rationale ?? null,
  },
];

async function fromSource(spec: SourceSpec): Promise<ApprovalItem[]> {
  try {
    const { data, error } = await db
      .from(spec.table)
      .select('*')
      .in('status', spec.statuses)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error || !data) return [];
    return (data as any[]).map((r) => ({
      id: String(r.id),
      source: spec.source,
      sourceLabel: spec.sourceLabel,
      title: spec.title(r),
      detail: spec.detail(r),
      status: String(r.status ?? 'pending'),
      createdAt: r.created_at ?? null,
      route: spec.route,
    }));
  } catch {
    return [];
  }
}

export interface ApprovalQueueSnapshot {
  items: ApprovalItem[];
  countsBySource: Record<ApprovalSource, number>;
  total: number;
}

export async function getApprovalQueue(): Promise<ApprovalQueueSnapshot> {
  const lists = await Promise.all(SOURCES.map(fromSource));
  const items = lists
    .flat()
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  const countsBySource = SOURCES.reduce((acc, s, i) => {
    acc[s.source] = lists[i].length;
    return acc;
  }, {} as Record<ApprovalSource, number>);
  return { items, countsBySource, total: items.length };
}

/** Just the total pending count — cheap enough for card badges. */
export async function getPendingApprovalCount(): Promise<number> {
  const { total } = await getApprovalQueue();
  return total;
}
