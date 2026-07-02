// =============================================================================
// AOS Subsystem 4 — Agent Orchestrator
// Determines which agent runs, schedules execution, handles retries, and tracks
// outcomes. Agents register a runner (their executable body); the orchestrator
// wraps every execution in a run record + execution logs + health update.
// =============================================================================
import { AgentRecord, AgentRunner, RunContext, TriggerSource } from '@/types/aos';
import { getAgent, listAgents } from './registry';
import { finishRun, logAction, startRun } from './logs';
import { recordRunOutcome } from './health';
import { nextRunFor } from './_internal';
import { emitEvent } from './events';
import { consolidate } from './memory';
import { getWorkforceIdentity } from './institutionalRegistry';

// Runner registry — populated at bootstrap. Each agent's code registers here.
const runners = new Map<string, AgentRunner>();

export function registerRunner(slug: string, runner: AgentRunner): void {
  runners.set(slug, runner);
}

export function hasRunner(slug: string): boolean {
  return runners.has(slug);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface RunOutcome {
  agentSlug: string;
  ok: boolean;
  runId: string | null;
  attempts: number;
  durationMs: number;
  output?: Record<string, unknown>;
  error?: string;
}

/**
 * Execute one agent now, with retries + full bookkeeping.
 * `maxAttempts` defaults from agent.config.maxAttempts (or 1).
 */
export async function runAgent(
  slug: string,
  trigger: TriggerSource = 'manual',
): Promise<RunOutcome> {
  const agent = await getAgent(slug);
  if (!agent) {
    return { agentSlug: slug, ok: false, runId: null, attempts: 0, durationMs: 0, error: 'Agent not registered' };
  }
  if (agent.status === 'disabled') {
    return { agentSlug: slug, ok: false, runId: null, attempts: 0, durationMs: 0, error: 'Agent is disabled' };
  }
  const runner = runners.get(slug);
  if (!runner) {
    return { agentSlug: slug, ok: false, runId: null, attempts: 0, durationMs: 0, error: 'No runner registered for agent' };
  }

  const maxAttempts = Math.max(1, Number((agent.config as any)?.maxAttempts ?? 1));
  const startedAt = new Date().toISOString();
  const run = await startRun(slug, trigger, maxAttempts);
  const runId = run?.id ?? null;

  const ctx: RunContext = {
    agentSlug: slug,
    runId,
    trigger,
    log: (action, opts) => logAction(slug, action, { runId, ...opts }),
  };

  // FD-2026-006 P4: every AI runs knowing its constitutional identity.
  const identity = getWorkforceIdentity(slug);
  if (identity) {
    await ctx.log('run.identity', {
      message: `Operating as ${identity.genomeId} · authority ${identity.authority} · dept ${identity.department}`,
      detail: { standards: identity.standards, playbook: identity.playbook, kpis: identity.kpis },
    });
  }

  let attempt = 0;
  let lastError: string | undefined;
  let output: Record<string, unknown> | undefined;
  let ok = false;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      await ctx.log('run.attempt', { message: `Attempt ${attempt}/${maxAttempts}` });
      const result = await runner(ctx);
      if (result.ok) {
        ok = true;
        output = result.output;
        break;
      }
      lastError = result.error ?? 'Runner reported failure';
      await ctx.log('run.attempt_failed', { level: 'warn', result: 'error', error: lastError });
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      await ctx.log('run.attempt_failed', { level: 'error', result: 'error', error: lastError });
    }
    if (attempt < maxAttempts) await sleep(Math.min(2 ** attempt * 250, 4000)); // backoff
  }

  const durationMs = Date.now() - new Date(startedAt).getTime();
  const nextRunAt = nextRunFor(agent.cadence);

  if (runId) {
    await finishRun(runId, ok ? 'success' : 'error', {
      error: ok ? undefined : lastError,
      output,
      attempt,
      startedAt,
    });
  }
  await recordRunOutcome(agent as AgentRecord, { ok, durationMs, error: lastError, nextRunAt });
  // Memory hygiene: promote durable short-term memories, archive expired ones.
  if (ok) void consolidate(slug).catch(() => {});
  await emitEvent(
    ok ? 'agent.run.completed' : 'agent.run.failed',
    slug,
    ok ? `${agent.name} ran (${durationMs}ms, ${attempt} attempt(s))` : `${agent.name} FAILED: ${lastError}`,
    { run_id: runId, trigger, duration_ms: durationMs, attempts: attempt, ...(ok ? {} : { error: lastError }) },
  );
  await ctx.log(ok ? 'run.success' : 'run.error', {
    level: ok ? 'info' : 'error',
    result: ok ? 'success' : 'error',
    message: ok ? 'Run completed' : 'Run failed after all attempts',
    error: ok ? undefined : lastError,
  });

  return { agentSlug: slug, ok, runId, attempts: attempt, durationMs, output, error: ok ? undefined : lastError };
}

/** Which active agents are due to run now (next_run_at in the past). */
export async function dueAgents(): Promise<AgentRecord[]> {
  const now = Date.now();
  const agents = await listAgents();
  return agents
    .filter(
      (a) =>
        a.status === 'active' &&
        a.cadence !== 'manual' &&
        runners.has(a.slug) &&
        a.next_run_at != null &&
        new Date(a.next_run_at).getTime() <= now,
    )
    .sort((a, b) => a.priority - b.priority);
}

/**
 * One orchestration tick: run every due agent in priority order.
 * Returns the outcomes. (Wire this to a cron/scheduled trigger in Phase 2.)
 */
export async function tick(): Promise<RunOutcome[]> {
  const due = await dueAgents();
  const outcomes: RunOutcome[] = [];
  for (const agent of due) {
    outcomes.push(await runAgent(agent.slug, 'orchestrator'));
  }
  return outcomes;
}
