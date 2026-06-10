// =============================================================================
// AOS Subsystem 3 — Agent Task Manager
// Create, assign, track status, dependencies, and priority levels.
// =============================================================================
import { AgentTask, CreateTaskInput, TaskStatus } from '@/types/aos';
import { db, nowISO } from './_internal';

const TABLE = 'aos_tasks';

/** A task is blocked unless every dependency is completed. */
function initialStatus(dependsOn: string[]): TaskStatus {
  return dependsOn.length > 0 ? 'blocked' : 'ready';
}

export async function createTask(input: CreateTaskInput): Promise<AgentTask | null> {
  const dependsOn = input.dependsOn ?? [];
  const row = {
    title: input.title,
    description: input.description ?? null,
    created_by_agent: input.createdByAgent ?? 'human',
    assigned_agent: input.assignedAgent ?? null,
    status: initialStatus(dependsOn),
    priority: input.priority ?? 'medium',
    depends_on: dependsOn,
    payload: input.payload ?? {},
    due_at: input.dueAt ?? null,
    source_report_id: input.sourceReportId ?? null,
  };
  const { data, error } = await db.from(TABLE).insert(row).select('*').single();
  if (error) {
    console.error('[AOS:tasks] createTask failed:', error.message);
    return null;
  }
  return data as AgentTask;
}

export async function assignTask(taskId: string, agentSlug: string): Promise<boolean> {
  const { error } = await db
    .from(TABLE)
    .update({ assigned_agent: agentSlug, updated_at: nowISO() })
    .eq('id', taskId);
  return !error;
}

export async function setTaskStatus(
  taskId: string,
  status: TaskStatus,
  result?: Record<string, unknown>,
): Promise<boolean> {
  const patch: Record<string, unknown> = { status, updated_at: nowISO() };
  if (status === 'in_progress') patch.started_at = nowISO();
  if (status === 'completed' || status === 'failed' || status === 'cancelled')
    patch.completed_at = nowISO();
  if (result) patch.result = result;

  const { error } = await db.from(TABLE).update(patch).eq('id', taskId);
  if (error) return false;

  // When a task completes, re-evaluate dependents that may now be unblocked.
  if (status === 'completed') await resolveDependents(taskId);
  return true;
}

/** Move blocked tasks to 'ready' once all their dependencies are completed. */
export async function resolveDependents(completedTaskId: string): Promise<void> {
  const { data: dependents } = await db
    .from(TABLE)
    .select('id, depends_on')
    .contains('depends_on', [completedTaskId])
    .eq('status', 'blocked');
  if (!dependents || dependents.length === 0) return;

  for (const t of dependents as { id: string; depends_on: string[] }[]) {
    const { data: deps } = await db
      .from(TABLE)
      .select('status')
      .in('id', t.depends_on);
    const allDone = (deps ?? []).every((d: any) => d.status === 'completed');
    if (allDone) {
      await db.from(TABLE).update({ status: 'ready', updated_at: nowISO() }).eq('id', t.id);
    }
  }
}

/** Tasks an agent can pick up now (assigned or in the open pool, unblocked). */
export async function listReadyTasks(agentSlug?: string): Promise<AgentTask[]> {
  let q = db.from(TABLE).select('*').eq('status', 'ready');
  if (agentSlug) q = q.or(`assigned_agent.eq.${agentSlug},assigned_agent.is.null`);
  const { data, error } = await q
    .order('priority', { ascending: true })
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data as AgentTask[];
}

export async function listTasks(status?: TaskStatus): Promise<AgentTask[]> {
  let q = db.from(TABLE).select('*');
  if (status) q = q.eq('status', status);
  const { data, error } = await q.order('created_at', { ascending: false }).limit(200);
  if (error || !data) return [];
  return data as AgentTask[];
}
