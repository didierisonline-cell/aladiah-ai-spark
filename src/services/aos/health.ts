// =============================================================================
// AOS Subsystem 7 — Health Monitoring
// Agent uptime, last successful run, error count, performance score.
// Health rollups live on aos_agents (updated after every run) and are
// classified here for the dashboard. Deeper analysis reads aos_runs.
// =============================================================================
import { AgentHealth, AgentRecord } from '@/types/aos';
import { listAgents } from './registry';
import { db } from './_internal';

const STALE_AFTER_MS = 36 * 60 * 60 * 1000; // a daily agent silent > 36h is "idle"

function classify(a: AgentRecord): AgentHealth['health'] {
  if (a.status === 'disabled' || a.status === 'paused') return 'idle';
  if (a.consecutive_failures >= 3 || a.status === 'error') return 'down';
  if (a.consecutive_failures > 0 || a.performance_score < 70) return 'degraded';
  if (a.last_success_at && Date.now() - new Date(a.last_success_at).getTime() > STALE_AFTER_MS && a.cadence !== 'manual')
    return 'idle';
  return 'healthy';
}

function toHealth(a: AgentRecord): AgentHealth {
  const uptimePct = a.run_count > 0 ? Math.round(((a.run_count - a.error_count) / a.run_count) * 100) : 100;
  return {
    slug: a.slug,
    name: a.name,
    status: a.status,
    uptimePct,
    lastSuccessAt: a.last_success_at,
    lastErrorAt: a.last_error_at,
    errorCount: a.error_count,
    consecutiveFailures: a.consecutive_failures,
    performanceScore: Number(a.performance_score),
    avgDurationMs: a.avg_duration_ms,
    health: classify(a),
  };
}

/** Health snapshot for the whole workforce. */
export async function getFleetHealth(): Promise<AgentHealth[]> {
  const agents = await listAgents();
  return agents.map(toHealth);
}

export async function getAgentHealth(slug: string): Promise<AgentHealth | null> {
  const agents = await listAgents();
  const a = agents.find((x) => x.slug === slug);
  return a ? toHealth(a) : null;
}

/**
 * Record a run outcome onto the registry's health columns. Called by the
 * orchestrator after each run. Recomputes performance_score and rolling avg.
 */
export async function recordRunOutcome(
  agent: AgentRecord,
  outcome: { ok: boolean; durationMs: number; error?: string; nextRunAt: string | null },
): Promise<void> {
  const runCount = agent.run_count + 1;
  const errorCount = agent.error_count + (outcome.ok ? 0 : 1);
  const consecutiveFailures = outcome.ok ? 0 : agent.consecutive_failures + 1;

  // performance_score: success-rate blended with a recent-failure penalty.
  const successRate = (runCount - errorCount) / runCount;
  const penalty = Math.min(consecutiveFailures * 10, 40);
  const performanceScore = Math.max(0, Math.round(successRate * 100 - penalty));

  // Rolling average duration (simple incremental mean).
  const prevAvg = agent.avg_duration_ms ?? outcome.durationMs;
  const avgDuration = Math.round((prevAvg * agent.run_count + outcome.durationMs) / runCount);

  const now = new Date().toISOString();
  const patch: Record<string, unknown> = {
    run_count: runCount,
    error_count: errorCount,
    consecutive_failures: consecutiveFailures,
    performance_score: performanceScore,
    avg_duration_ms: avgDuration,
    last_run_at: now,
    next_run_at: outcome.nextRunAt,
    updated_at: now,
  };
  if (outcome.ok) {
    patch.last_success_at = now;
    if (agent.status === 'error') patch.status = 'active';
  } else {
    patch.last_error_at = now;
    patch.last_error = outcome.error ?? 'Unknown error';
    if (consecutiveFailures >= 3) patch.status = 'error';
  }

  const { error } = await db.from('aos_agents').update(patch).eq('slug', agent.slug);
  if (error) console.error('[AOS:health] recordRunOutcome failed:', error.message);
}
