// =============================================================================
// Work Order System — the shared unit of cross-agent work.
// A work order IS an aos_task (payload.kind = 'work_order'): id, title, owner,
// priority, status, dependencies, created/updated all come from the Task
// Manager for free (per AGENT_OPERATING_SYSTEM.md: do not build parallel
// systems). The work-order layer adds the coordination contract on top:
// type, collaborating agents, acceptance criteria, the four gates
// (QA / Security / Translation / UX), founder approval, and evidence notes.
// Nothing publishes or deploys from here — founder approval is a recorded
// decision, not an execution trigger.
// =============================================================================
import { AgentTask, TaskPriority, TaskStatus } from '@/types/aos';
import { db, nowISO } from './_internal';
import { createTask } from './tasks';

const TABLE = 'aos_tasks';
export const WORK_ORDER_KIND = 'work_order';

export type WorkOrderType =
  | 'content'
  | 'curriculum'
  | 'platform'
  | 'marketing'
  | 'security'
  | 'localization'
  | 'design'
  | 'deployment'
  | 'recommendation';

/** Review gates a work order can pass through before founder approval. */
export type GateKey = 'qa' | 'security' | 'translation' | 'ux';
export type GateStatus = 'not_required' | 'pending' | 'in_review' | 'passed' | 'failed';
export type FounderApprovalStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

export interface EvidenceNote {
  at: string;
  author: string; // agent slug or 'founder'
  note: string;
}

/** The coordination contract stored in aos_tasks.payload. */
export interface WorkOrderMeta {
  kind: typeof WORK_ORDER_KIND;
  type: WorkOrderType;
  collaborators: string[]; // agent slugs working alongside the owner
  acceptance_criteria: string[];
  gates: Record<GateKey, GateStatus>;
  founder_approval: FounderApprovalStatus;
  evidence: EvidenceNote[];
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string | null;
  type: WorkOrderType;
  ownerAgent: string | null;
  collaborators: string[];
  priority: TaskPriority;
  status: TaskStatus;
  dependsOn: string[];
  acceptanceCriteria: string[];
  gates: Record<GateKey, GateStatus>;
  founderApproval: FounderApprovalStatus;
  evidence: EvidenceNote[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkOrderInput {
  title: string;
  description?: string;
  type: WorkOrderType;
  ownerAgent: string;
  collaborators?: string[];
  priority?: TaskPriority;
  dependsOn?: string[];
  acceptanceCriteria?: string[];
  createdByAgent?: string;
  /** Gates this order must pass. Defaults come from gatesForType(). */
  gates?: Partial<Record<GateKey, GateStatus>>;
}

/**
 * Default gate set per work-order type. Every order ends at founder approval;
 * these decide which reviews must happen first. Risk-bearing types always get
 * the Security gate; anything student/founder-visible gets the UX gate.
 */
export function gatesForType(type: WorkOrderType): Record<GateKey, GateStatus> {
  const g: Record<GateKey, GateStatus> = {
    qa: 'not_required',
    security: 'not_required',
    translation: 'not_required',
    ux: 'not_required',
  };
  switch (type) {
    case 'content':
    case 'curriculum':
      g.qa = 'pending';
      g.translation = 'pending';
      g.ux = 'pending';
      break;
    case 'marketing':
      g.qa = 'pending';
      g.translation = 'pending';
      break;
    case 'platform':
    case 'deployment':
      g.qa = 'pending';
      g.security = 'pending';
      break;
    case 'security':
      g.security = 'pending';
      break;
    case 'localization':
      g.translation = 'pending';
      g.qa = 'pending';
      break;
    case 'design':
      g.ux = 'pending';
      break;
    case 'recommendation':
      break; // straight to founder review
  }
  return g;
}

function toWorkOrder(task: AgentTask): WorkOrder | null {
  const meta = task.payload as unknown as WorkOrderMeta | undefined;
  if (!meta || meta.kind !== WORK_ORDER_KIND) return null;
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    type: meta.type ?? 'recommendation',
    ownerAgent: task.assigned_agent,
    collaborators: meta.collaborators ?? [],
    priority: task.priority,
    status: task.status,
    dependsOn: task.depends_on ?? [],
    acceptanceCriteria: meta.acceptance_criteria ?? [],
    gates: { ...gatesForType(meta.type ?? 'recommendation'), ...(meta.gates ?? {}) },
    founderApproval: meta.founder_approval ?? 'not_submitted',
    evidence: meta.evidence ?? [],
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  };
}

export async function createWorkOrder(input: CreateWorkOrderInput): Promise<WorkOrder | null> {
  const meta: WorkOrderMeta = {
    kind: WORK_ORDER_KIND,
    type: input.type,
    collaborators: input.collaborators ?? [],
    acceptance_criteria: input.acceptanceCriteria ?? [],
    gates: { ...gatesForType(input.type), ...(input.gates ?? {}) },
    founder_approval: 'not_submitted',
    evidence: [],
  };
  const task = await createTask({
    title: input.title,
    description: input.description,
    createdByAgent: input.createdByAgent ?? 'human',
    assignedAgent: input.ownerAgent,
    priority: input.priority ?? 'medium',
    dependsOn: input.dependsOn,
    payload: meta as unknown as Record<string, unknown>,
  });
  return task ? toWorkOrder(task) : null;
}

export async function listWorkOrders(limit = 200): Promise<WorkOrder[]> {
  try {
    const { data, error } = await db
      .from(TABLE)
      .select('*')
      .contains('payload', { kind: WORK_ORDER_KIND })
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return (data as AgentTask[]).map(toWorkOrder).filter((w): w is WorkOrder => w !== null);
  } catch {
    return [];
  }
}

export async function getWorkOrder(id: string): Promise<WorkOrder | null> {
  try {
    const { data, error } = await db.from(TABLE).select('*').eq('id', id).single();
    if (error || !data) return null;
    return toWorkOrder(data as AgentTask);
  } catch {
    return null;
  }
}

async function patchMeta(id: string, mutate: (meta: WorkOrderMeta) => WorkOrderMeta): Promise<WorkOrder | null> {
  try {
    const { data } = await db.from(TABLE).select('*').eq('id', id).single();
    if (!data) return null;
    const task = data as AgentTask;
    const meta = task.payload as unknown as WorkOrderMeta;
    if (!meta || meta.kind !== WORK_ORDER_KIND) return null;
    const next = mutate({ ...meta, gates: { ...meta.gates }, evidence: [...(meta.evidence ?? [])] });
    const { data: updated, error } = await db
      .from(TABLE)
      .update({ payload: next, updated_at: nowISO() })
      .eq('id', id)
      .select('*')
      .single();
    if (error || !updated) return null;
    return toWorkOrder(updated as AgentTask);
  } catch {
    return null;
  }
}

export async function setGateStatus(
  id: string,
  gate: GateKey,
  status: GateStatus,
  note?: { author: string; note: string },
): Promise<WorkOrder | null> {
  return patchMeta(id, (meta) => {
    meta.gates[gate] = status;
    if (note) meta.evidence.push({ at: nowISO(), ...note });
    return meta;
  });
}

/**
 * Record the founder's decision. This is a RECORD only — approving a work
 * order never publishes or deploys anything; the owning agent (or the founder)
 * executes the approved work through its own gated surface.
 */
export async function setFounderApproval(
  id: string,
  status: FounderApprovalStatus,
  note?: string,
): Promise<WorkOrder | null> {
  return patchMeta(id, (meta) => {
    meta.founder_approval = status;
    if (note) meta.evidence.push({ at: nowISO(), author: 'founder', note });
    return meta;
  });
}

export async function addEvidence(id: string, author: string, note: string): Promise<WorkOrder | null> {
  return patchMeta(id, (meta) => {
    meta.evidence.push({ at: nowISO(), author, note });
    return meta;
  });
}

/** All gates either passed or not required. */
export function gatesCleared(wo: WorkOrder): boolean {
  return (Object.keys(wo.gates) as GateKey[]).every(
    (k) => wo.gates[k] === 'passed' || wo.gates[k] === 'not_required',
  );
}

/** The next gate still blocking this order, in canonical review order. */
export function nextPendingGate(wo: WorkOrder): GateKey | null {
  const ORDER: GateKey[] = ['qa', 'security', 'translation', 'ux'];
  return ORDER.find((k) => wo.gates[k] === 'pending' || wo.gates[k] === 'in_review' || wo.gates[k] === 'failed') ?? null;
}

export interface WorkOrderStats {
  total: number;
  open: number;
  awaitingFounder: number;
  gateBlocked: number;
  byStatus: Record<string, number>;
}

export async function getWorkOrderStats(): Promise<WorkOrderStats> {
  const orders = await listWorkOrders(500);
  const open = orders.filter((o) => !['completed', 'cancelled', 'failed'].includes(o.status));
  return {
    total: orders.length,
    open: open.length,
    awaitingFounder: orders.filter((o) => o.founderApproval === 'pending').length,
    gateBlocked: open.filter((o) => nextPendingGate(o) !== null).length,
    byStatus: orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}
