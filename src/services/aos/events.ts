// =============================================================================
// AOS Event Bus — typed publish/subscribe over the Communication Layer.
// Events are aos_messages rows with to_agent='broadcast' (a convention inbox()
// already understands), so the bus inherits RLS, auditability, and the
// append-only invariant with ZERO schema changes. Every governance-relevant
// transition in the OS emits here: agent runs, work-order lifecycle, gate
// outcomes, founder decisions, brain records, readiness snapshots.
// Emission is fire-and-forget — a failed emit never breaks the action itself.
// =============================================================================
import { AgentMessage } from '@/types/aos';
import { db } from './_internal';
import { sendMessage } from './communication';

export const EVENT_AUDIENCE = 'broadcast';

export type AOSEventType =
  | 'agent.run.completed'
  | 'agent.run.failed'
  | 'work_order.opened'
  | 'work_order.gate.passed'
  | 'work_order.gate.failed'
  | 'work_order.submitted'
  | 'work_order.approved'
  | 'work_order.rejected'
  | 'work_order.completed'
  | 'brain.decision.recorded'
  | 'readiness.snapshot';

export interface AOSEvent {
  id: string;
  type: AOSEventType;
  source: string; // agent slug or 'founder' / 'system'
  subject: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

/** Event subjects are prefixed so events are distinguishable in aos_messages. */
const EVENT_PREFIX = 'event:';

/**
 * Publish an event to the bus. Never throws — traceability must not be able
 * to break the operation being traced.
 */
export async function emitEvent(
  type: AOSEventType,
  source: string,
  subject: string,
  payload: Record<string, unknown> = {},
): Promise<void> {
  try {
    await sendMessage({
      fromAgent: source,
      toAgent: EVENT_AUDIENCE,
      type: 'alert',
      subject: `${EVENT_PREFIX}${type}`,
      body: subject,
      payload: { ...payload, event_type: type },
    });
  } catch (e) {
    console.error('[AOS:events] emit failed:', e instanceof Error ? e.message : e);
  }
}

function toEvent(m: AgentMessage): AOSEvent | null {
  if (m.to_agent !== EVENT_AUDIENCE || !m.subject?.startsWith(EVENT_PREFIX)) return null;
  return {
    id: m.id,
    type: m.subject.slice(EVENT_PREFIX.length) as AOSEventType,
    source: m.from_agent,
    subject: m.body ?? '',
    payload: m.payload ?? {},
    createdAt: m.created_at,
  };
}

/** Recent events, newest first. Optionally filter by type prefix (e.g. 'work_order'). */
export async function listEvents(limit = 80, typePrefix?: string): Promise<AOSEvent[]> {
  try {
    let q = db
      .from('aos_messages')
      .select('*')
      .eq('to_agent', EVENT_AUDIENCE)
      .like('subject', `${EVENT_PREFIX}%`);
    if (typePrefix) q = q.like('subject', `${EVENT_PREFIX}${typePrefix}%`);
    const { data, error } = await q.order('created_at', { ascending: false }).limit(limit);
    if (error || !data) return [];
    return (data as AgentMessage[]).map(toEvent).filter((e): e is AOSEvent => e !== null);
  } catch {
    return [];
  }
}

/** Events related to one work order — its full audit trail on the bus. */
export async function listWorkOrderEvents(workOrderId: string, limit = 50): Promise<AOSEvent[]> {
  try {
    const { data, error } = await db
      .from('aos_messages')
      .select('*')
      .eq('to_agent', EVENT_AUDIENCE)
      .like('subject', `${EVENT_PREFIX}work_order%`)
      .contains('payload', { work_order_id: workOrderId })
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error || !data) return [];
    return (data as AgentMessage[]).map(toEvent).filter((e): e is AOSEvent => e !== null);
  } catch {
    return [];
  }
}
