// =============================================================================
// AOS Subsystem 8 — Communication Layer
// Agent-to-agent messaging. The CEO agent can create tasks for other agents;
// agents can return reports back to the CEO agent.
// =============================================================================
import { AgentMessage, AgentTask, MessageStatus, SendMessageInput } from '@/types/aos';
import { db, nowISO } from './_internal';
import { createTask } from './tasks';

const TABLE = 'aos_messages';
export const CEO_AGENT = 'ceo-chief-of-staff';

export async function sendMessage(input: SendMessageInput): Promise<AgentMessage | null> {
  const row = {
    from_agent: input.fromAgent,
    to_agent: input.toAgent,
    message_type: input.type ?? 'message',
    subject: input.subject ?? null,
    body: input.body ?? null,
    payload: input.payload ?? {},
    status: 'unread',
    related_task_id: input.relatedTaskId ?? null,
    related_report_id: input.relatedReportId ?? null,
    requires_response: input.requiresResponse ?? false,
    in_reply_to: input.inReplyTo ?? null,
  };
  const { data, error } = await db.from(TABLE).insert(row).select('*').single();
  if (error) {
    console.error('[AOS:comms] sendMessage failed:', error.message);
    return null;
  }
  return data as AgentMessage;
}

export async function inbox(agentSlug: string, status?: MessageStatus): Promise<AgentMessage[]> {
  let q = db
    .from(TABLE)
    .select('*')
    .or(`to_agent.eq.${agentSlug},to_agent.eq.broadcast`);
  if (status) q = q.eq('status', status);
  const { data, error } = await q.order('created_at', { ascending: false }).limit(100);
  if (error || !data) return [];
  return data as AgentMessage[];
}

export async function listMessages(limit = 100): Promise<AgentMessage[]> {
  const { data, error } = await db
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as AgentMessage[];
}

export async function setMessageStatus(id: string, status: MessageStatus): Promise<boolean> {
  const patch: Record<string, unknown> = { status };
  if (status === 'read') patch.read_at = nowISO();
  const { error } = await db.from(TABLE).update(patch).eq('id', id);
  return !error;
}

/**
 * CEO -> agent delegation. Creates a task assigned to `toAgent` and notifies it
 * with a `task_request` message that references the task.
 */
export async function delegateTask(
  toAgent: string,
  task: { title: string; description?: string; priority?: AgentTask['priority']; payload?: Record<string, unknown>; dueAt?: string },
  fromAgent: string = CEO_AGENT,
): Promise<{ task: AgentTask | null; message: AgentMessage | null }> {
  const created = await createTask({
    title: task.title,
    description: task.description,
    createdByAgent: fromAgent,
    assignedAgent: toAgent,
    priority: task.priority,
    payload: task.payload,
    dueAt: task.dueAt,
  });
  const message = await sendMessage({
    fromAgent,
    toAgent,
    type: 'task_request',
    subject: `New task: ${task.title}`,
    body: task.description,
    relatedTaskId: created?.id,
    requiresResponse: true,
  });
  return { task: created, message };
}

/** Agent -> CEO report hand-back. */
export async function reportToCeo(
  fromAgent: string,
  report: { subject: string; body?: string; reportId?: string; payload?: Record<string, unknown> },
): Promise<AgentMessage | null> {
  return sendMessage({
    fromAgent,
    toAgent: CEO_AGENT,
    type: 'report',
    subject: report.subject,
    body: report.body,
    relatedReportId: report.reportId,
    payload: report.payload,
  });
}
