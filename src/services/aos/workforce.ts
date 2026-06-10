// =============================================================================
// AI Workforce — cross-agent aggregation for the unified Control Center.
// Reads the AOS (registry, health, tasks, memory, logs) plus per-agent domain
// tables (marketing_content, agent_reports) and rolls everything into one
// snapshot for /admin/ai-workforce. Every query is defensive (missing table -> 0).
// =============================================================================
import { db } from './_internal';
import { listAgents } from './registry';
import { getFleetHealth } from './health';
import { AgentHealth, AgentMemory, AgentRecord } from '@/types/aos';

export interface AgentSnapshot {
  slug: string;
  name: string;
  role: string | null;
  status: AgentRecord['status'];
  cadence: string;
  performanceScore: number;
  health: AgentHealth['health'];
  uptimePct: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  runCount: number;
  errorCount: number;
  tasksCompleted: number;
  tasksPending: number;
  memoryRecords: number;
  executionLogs: number;
}

export interface WorkforceGlobals {
  activeAgents: number;
  totalAgents: number;
  tasksCompletedToday: number;
  contentGenerated: number;
  leadsGenerated: number;
  revenueImpact: number;
  healthScore: number;
}

export interface WorkforceSnapshot {
  agents: AgentSnapshot[];
  globals: WorkforceGlobals;
}

const startOfTodayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

async function countRows(table: string, apply: (q: any) => any = (q) => q): Promise<number> {
  try {
    const { count, error } = await apply(db.from(table).select('*', { count: 'exact', head: true }));
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

const PENDING_TASK_STATUSES = ['pending', 'ready', 'blocked', 'in_progress'];

export async function getWorkforceSnapshot(): Promise<WorkforceSnapshot> {
  const [agents, fleet] = await Promise.all([listAgents(), getFleetHealth()]);
  const healthBySlug = new Map(fleet.map((h) => [h.slug, h]));

  const agentSnapshots: AgentSnapshot[] = await Promise.all(
    agents.map(async (a): Promise<AgentSnapshot> => {
      const [tasksCompleted, tasksPending, memoryRecords, executionLogs] = await Promise.all([
        countRows('aos_tasks', (q) => q.eq('assigned_agent', a.slug).eq('status', 'completed')),
        countRows('aos_tasks', (q) => q.eq('assigned_agent', a.slug).in('status', PENDING_TASK_STATUSES)),
        countRows('aos_agent_memory', (q) => q.eq('agent_slug', a.slug)),
        countRows('aos_execution_logs', (q) => q.eq('agent_slug', a.slug)),
      ]);
      const h = healthBySlug.get(a.slug);
      return {
        slug: a.slug,
        name: a.name,
        role: a.role,
        status: a.status,
        cadence: a.cadence,
        performanceScore: Number(a.performance_score),
        health: h?.health ?? 'idle',
        uptimePct: h?.uptimePct ?? 100,
        lastRunAt: a.last_run_at,
        nextRunAt: a.next_run_at,
        runCount: a.run_count,
        errorCount: a.error_count,
        tasksCompleted,
        tasksPending,
        memoryRecords,
        executionLogs,
      };
    }),
  );

  // ---- global metrics ----
  const [tasksCompletedToday, contentGenerated] = await Promise.all([
    countRows('aos_tasks', (q) => q.eq('status', 'completed').gte('completed_at', startOfTodayISO())),
    countRows('marketing_content'),
  ]);

  // Leads generated: sum of marketing_content.performance.leads (0 until analytics flow in).
  let leadsGenerated = 0;
  try {
    const { data } = await db.from('marketing_content').select('performance').limit(2000);
    leadsGenerated = (data ?? []).reduce(
      (sum: number, r: any) => sum + Number(r?.performance?.leads ?? 0),
      0,
    );
  } catch {
    leadsGenerated = 0;
  }

  // Revenue impact: latest CEO report MRR (honest — 0 if no report/data yet).
  let revenueImpact = 0;
  try {
    const { data } = await db
      .from('agent_reports')
      .select('revenue_summary')
      .order('report_date', { ascending: false })
      .limit(1);
    revenueImpact = Number((data?.[0]?.revenue_summary as any)?.mrr ?? 0);
  } catch {
    revenueImpact = 0;
  }

  const healthScore =
    agentSnapshots.length > 0
      ? Math.round(agentSnapshots.reduce((s, a) => s + a.performanceScore, 0) / agentSnapshots.length)
      : 100;

  return {
    agents: agentSnapshots,
    globals: {
      activeAgents: agents.filter((a) => a.status === 'active').length,
      totalAgents: agents.length,
      tasksCompletedToday,
      contentGenerated,
      leadsGenerated,
      revenueImpact,
      healthScore,
    },
  };
}

/** Recent memories across the whole workforce (Memory tab). */
export async function getRecentMemory(limit = 60): Promise<AgentMemory[]> {
  try {
    const { data, error } = await db
      .from('aos_agent_memory')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as AgentMemory[];
  } catch {
    return [];
  }
}

export interface WorkforceReport {
  id: string;
  agent_name: string;
  report_date: string;
  summary: string | null;
  urgency_level: string | null;
  report_type: string | null;
}

/** Recent agent reports (Reports tab) — currently the CEO daily command reports. */
export async function getRecentReports(limit = 20): Promise<WorkforceReport[]> {
  try {
    const { data, error } = await db
      .from('agent_reports')
      .select('id, agent_name, report_date, summary, urgency_level, report_type')
      .order('report_date', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as WorkforceReport[];
  } catch {
    return [];
  }
}
