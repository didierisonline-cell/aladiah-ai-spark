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
  | 'placement'
  | 'work-order';

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
    // Migration 20260610200000 names the table success_interventions; the
    // spec above is kept for forward-compat. Both are defensive.
    source: 'student-success',
    sourceLabel: 'Student Success',
    table: 'success_interventions',
    statuses: ['pending'],
    route: '/admin/student-success',
    title: (r) => r.title ?? 'Success intervention',
    detail: (r) => r.rationale ?? r.intervention_type ?? null,
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
  {
    // Migration 20260610210000 names the table placement_actions.
    source: 'placement',
    sourceLabel: 'Placement',
    table: 'placement_actions',
    statuses: ['pending'],
    route: '/admin/placement-agent',
    title: (r) => r.title ?? 'Placement action',
    detail: (r) => r.body ?? r.action_type ?? null,
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

/** Work orders whose gates all cleared and now await the founder's decision. */
async function fromWorkOrders(): Promise<ApprovalItem[]> {
  try {
    const { data, error } = await db
      .from('aos_tasks')
      .select('*')
      .contains('payload', { kind: 'work_order', founder_approval: 'pending' })
      .order('created_at', { ascending: false })
      .limit(100);
    if (error || !data) return [];
    return (data as any[]).map((r) => ({
      id: String(r.id),
      source: 'work-order' as const,
      sourceLabel: 'Work Order',
      title: r.title ?? 'Work order',
      detail: (r.payload?.type ? `${r.payload.type} · owner ${r.assigned_agent ?? '—'}` : null),
      status: 'pending_approval',
      createdAt: r.created_at ?? null,
      route: '/founder',
    }));
  } catch {
    return [];
  }
}

export async function getApprovalQueue(): Promise<ApprovalQueueSnapshot> {
  const [lists, workOrders] = await Promise.all([
    Promise.all(SOURCES.map(fromSource)),
    fromWorkOrders(),
  ]);
  const items = [...lists.flat(), ...workOrders]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  const countsBySource = items.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] ?? 0) + 1;
    return acc;
  }, {
    product: 0, marketing: 0, admissions: 0, 'student-success': 0, placement: 0, 'work-order': 0,
  } as Record<ApprovalSource, number>);
  return { items, countsBySource, total: items.length };
}

/** Just the total pending count — cheap enough for card badges. */
export async function getPendingApprovalCount(): Promise<number> {
  const { total } = await getApprovalQueue();
  return total;
}
