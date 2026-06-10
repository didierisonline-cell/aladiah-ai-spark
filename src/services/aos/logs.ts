// =============================================================================
// AOS Subsystem 5 — Execution Logs (+ run records)
// aos_runs    = one row per agent invocation (the orchestrator's outcome record)
// aos_execution_logs = every action performed within a run (fine-grained audit)
// =============================================================================
import {
  ActionResult,
  AgentRun,
  ExecutionLog,
  LogLevel,
  RunStatus,
  TriggerSource,
} from '@/types/aos';
import { db, nowISO } from './_internal';

const RUNS = 'aos_runs';
const LOGS = 'aos_execution_logs';

export async function startRun(
  agentSlug: string,
  trigger: TriggerSource,
  maxAttempts = 1,
): Promise<AgentRun | null> {
  const { data, error } = await db
    .from(RUNS)
    .insert({
      agent_slug: agentSlug,
      trigger_source: trigger,
      status: 'running',
      attempt: 1,
      max_attempts: maxAttempts,
      started_at: nowISO(),
    })
    .select('*')
    .single();
  if (error) {
    console.error('[AOS:logs] startRun failed:', error.message);
    return null;
  }
  return data as AgentRun;
}

export async function finishRun(
  runId: string,
  status: RunStatus,
  opts: { error?: string; output?: Record<string, unknown>; attempt?: number; startedAt?: string } = {},
): Promise<void> {
  const finished = nowISO();
  const duration = opts.startedAt
    ? new Date(finished).getTime() - new Date(opts.startedAt).getTime()
    : null;
  const patch: Record<string, unknown> = {
    status,
    finished_at: finished,
    duration_ms: duration,
    error: opts.error ?? null,
    output: opts.output ?? null,
  };
  if (opts.attempt != null) patch.attempt = opts.attempt;
  const { error } = await db.from(RUNS).update(patch).eq('id', runId);
  if (error) console.error('[AOS:logs] finishRun failed:', error.message);
}

export async function logAction(
  agentSlug: string,
  action: string,
  opts: {
    runId?: string | null;
    level?: LogLevel;
    result?: ActionResult;
    message?: string;
    detail?: Record<string, unknown>;
    error?: string;
  } = {},
): Promise<void> {
  const { error } = await db.from(LOGS).insert({
    run_id: opts.runId ?? null,
    agent_slug: agentSlug,
    action,
    level: opts.level ?? 'info',
    result: opts.result ?? null,
    message: opts.message ?? null,
    detail: opts.detail ?? {},
    error: opts.error ?? null,
  });
  if (error) console.error('[AOS:logs] logAction failed:', error.message);
}

export async function listRuns(agentSlug?: string, limit = 50): Promise<AgentRun[]> {
  let q = db.from(RUNS).select('*');
  if (agentSlug) q = q.eq('agent_slug', agentSlug);
  const { data, error } = await q.order('started_at', { ascending: false }).limit(limit);
  if (error || !data) return [];
  return data as AgentRun[];
}

export async function listLogs(
  opts: { agentSlug?: string; runId?: string; level?: LogLevel; limit?: number } = {},
): Promise<ExecutionLog[]> {
  let q = db.from(LOGS).select('*');
  if (opts.agentSlug) q = q.eq('agent_slug', opts.agentSlug);
  if (opts.runId) q = q.eq('run_id', opts.runId);
  if (opts.level) q = q.eq('level', opts.level);
  const { data, error } = await q
    .order('created_at', { ascending: false })
    .limit(opts.limit ?? 100);
  if (error || !data) return [];
  return data as ExecutionLog[];
}
