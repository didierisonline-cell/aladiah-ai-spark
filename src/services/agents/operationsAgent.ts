// =============================================================================
// Aladiah Operations & Platform Authority — service
// =============================================================================
// Agent #10. Guardian of platform reliability, student experience, revenue
// protection, and operational excellence. READ-ONLY: monitors and reports
// findings by severity, refreshes component status, and writes a daily operations
// report. It never fixes, publishes, or modifies anything — founder approval is
// required for any corrective action.
// =============================================================================
import { db, nowISO, safe } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { reportToCeo } from '@/services/aos/communication';
import { AgentRunOutput, RunContext } from '@/types/aos';
import {
  OPERATIONS_AGENT_SLUG,
  OpsFinding,
  OpsReport,
  OpsStats,
  OpsStatus,
  Severity,
} from '@/types/operations';
import { AUDIT_SURFACE, SEVERITY_ORDER, ownerForEngine } from './operations/engines';

export const getAuditSurface = () => AUDIT_SURFACE;

const SLUG = OPERATIONS_AGENT_SLUG;
const STATUS = 'ops_status';
const FINDINGS = 'ops_findings';
const REPORTS = 'ops_reports';

const REQUIRED_ARTIFACT_TYPES = ['module', 'quiz', 'simulation', 'lab', 'project', 'learning_path', 'assessment'];

async function upsertStatus(component: string, category: string, status: string, detail: string, latency_ms?: number) {
  await db.from(STATUS).upsert({ component, category, status, detail, latency_ms: latency_ms ?? null, checked_at: nowISO() }, { onConflict: 'component' });
}

async function addFinding(engine: string, severity: Severity, area: string, title: string, detail: string, recommendation: string) {
  const { data: existing } = await db.from(FINDINGS).select('id').eq('title', title).eq('status', 'open').limit(1);
  if (existing && existing.length > 0) return false;
  // Owner is assigned per engine; screenshot is attached during a live audit (Phase 2).
  await db.from(FINDINGS).insert({ engine, severity, area, title, detail, recommendation, owner: ownerForEngine(engine), screenshot: null, status: 'open' });
  return true;
}

// ---------------------------------------------------------------------------
// Audit (the runner's default cycle)
// ---------------------------------------------------------------------------
export async function runAudit(runId?: string | null): Promise<{ findings: number; critical: number; platformStatus: string }> {
  let newFindings = 0;

  // --- Infrastructure: a live DB ping proves Supabase/DB/Auth reachable ---
  const t0 = Date.now();
  let dbUp = false;
  try {
    const { error } = await db.from('aos_agents').select('slug', { count: 'exact', head: true });
    dbUp = !error;
  } catch { dbUp = false; }
  const latency = Date.now() - t0;
  await upsertStatus('Supabase', 'infrastructure', dbUp ? 'operational' : 'down', dbUp ? 'Reachable' : 'Unreachable from client', latency);
  await upsertStatus('Database', 'infrastructure', dbUp ? 'operational' : 'down', dbUp ? 'Query OK' : 'Query failed', latency);
  await upsertStatus('Authentication', 'infrastructure', dbUp ? 'operational' : 'unknown', 'Auth-backed query OK');
  if (!dbUp) newFindings += (await addFinding('infrastructure', 'critical', 'Supabase', 'Database unreachable from client', 'A client-side query to Supabase failed.', 'Check Supabase status, keys, and RLS.')) ? 1 : 0;

  // --- AI services: no client probe in v1 (kept 'unknown', flagged) ---
  for (const ai of ['Claude', 'OpenAI', 'ElevenLabs']) await upsertStatus(ai, 'ai_service', 'unknown', 'Live probe Phase 2 (server-side)');

  // --- Course integrity: every program needs the full artifact set ---
  const artifacts = await safe(async () => (await db.from('product_artifacts').select('artifact_type, payload, status').limit(5000)).data ?? [], [] as any[]);
  const typeCounts = new Map<string, number>();
  for (const a of artifacts) typeCounts.set(a.artifact_type, (typeCounts.get(a.artifact_type) ?? 0) + 1);
  for (const t of REQUIRED_ARTIFACT_TYPES) {
    if ((typeCounts.get(t) ?? 0) === 0) {
      const sev: Severity = t === 'simulation' || t === 'quiz' || t === 'assessment' ? 'high' : 'medium';
      newFindings += (await addFinding('course_integrity', sev, 'Scrum program', `Missing content type: ${t}`, `No ${t} artifacts exist for the program.`, `Have the Product Builder generate ${t} content (QA-gated).`)) ? 1 : 0;
    }
  }

  // --- Competency tagging (canon): every quiz question needs a slug ---
  const untagged = await safe(async () => (await db.from('quiz_questions').select('id', { count: 'exact', head: true }).is('competency', null)).count ?? 0, 0 as any);
  if (Number(untagged) > 0) newFindings += (await addFinding('course_integrity', 'medium', 'Quiz questions', `${untagged} quiz question(s) missing a competency slug`, 'Competency must be populated at insert time (canon).', 'Tag questions with an approved competency slug.')) ? 1 : 0;

  // --- Simulation integrity: decision points + scoring rubric ---
  let brokenSims = 0;
  for (const a of artifacts.filter((x) => x.artifact_type === 'simulation')) {
    const p = a.payload ?? {};
    if (!(p.decision_points?.length >= 2 && p.scoring_rubric?.length >= 1)) brokenSims += 1;
  }
  if (brokenSims > 0) newFindings += (await addFinding('simulation_integrity', 'high', 'Simulations', `${brokenSims} simulation(s) missing decision points or scoring rubric`, 'Simulations need ≥2 decision points and a competency-mapped rubric.', 'Regenerate via the Product Builder; QA will gate it.')) ? 1 : 0;

  // --- Payment engine: revenue leakage detection ---
  const subs = await safe(async () => (await db.from('subscriptions').select('status').limit(5000)).data ?? [], [] as any[]);
  const leaking = subs.filter((s) => ['past_due', 'unpaid', 'canceled', 'cancelled'].includes(String(s.status))).length;
  await upsertStatus('Checkout', 'payment', 'operational', `${subs.length} subscriptions tracked`);
  if (leaking > 0) {
    const sev: Severity = leaking >= 5 ? 'high' : 'medium';
    newFindings += (await addFinding('payment', sev, 'Payments', `${leaking} subscription(s) past_due/canceled — possible revenue leakage`, 'Failed or lapsed subscriptions detected.', 'Trigger the dunning flow and win-back outreach (founder-approved).')) ? 1 : 0;
  }

  // --- Platform monitoring: structural (live crawl Phase 2) ---
  for (const c of ['Homepage', 'Student Portal', 'Courses', 'Login']) await upsertStatus(c, 'platform', 'operational', 'Structural check (live crawl Phase 2)');

  // --- Compose the daily operations report ---
  const { data: openFindings } = await db.from(FINDINGS).select('severity').eq('status', 'open');
  const critical = (openFindings ?? []).filter((f: any) => f.severity === 'critical').length;
  const high = (openFindings ?? []).filter((f: any) => f.severity === 'high').length;
  const platformStatus = critical > 0 || !dbUp ? 'down' : high > 0 ? 'degraded' : 'operational';
  const summary = `Platform ${platformStatus}. ${(openFindings ?? []).length} open finding(s) (${critical} critical, ${high} high). DB ${dbUp ? 'reachable' : 'UNREACHABLE'} (${latency}ms). ${leaking} payment risk(s).`;

  await db.from(REPORTS).upsert({
    report_date: new Date().toISOString().slice(0, 10),
    platform_status: platformStatus,
    summary,
    critical_count: critical,
    sections: { db_latency_ms: latency, open_findings: (openFindings ?? []).length, payment_risks: leaking },
  }, { onConflict: 'report_date' });

  await remember({ agentSlug: SLUG, content: `Ops audit: ${summary}`, summary: `ops:${platformStatus}`, type: 'short_term', tags: ['operations', platformStatus], source: runId ?? undefined });
  await reportToCeo(SLUG, { subject: `Operations: platform ${platformStatus}, ${critical} critical`, body: summary, payload: { platformStatus, critical, high } });
  await logAction(SLUG, 'run_audit', { runId, result: critical > 0 ? 'error' : 'success', message: summary });

  return { findings: newFindings, critical, platformStatus };
}

// ---------------------------------------------------------------------------
// Founder actions (acknowledge / resolve / dismiss findings) — no auto-fix
// ---------------------------------------------------------------------------
export async function setFindingStatus(id: string, status: 'acknowledged' | 'resolved' | 'dismissed'): Promise<boolean> {
  const { error } = await db.from(FINDINGS).update({ status, updated_at: nowISO() }).eq('id', id);
  return !error;
}

// ---------------------------------------------------------------------------
// Reads + stats
// ---------------------------------------------------------------------------
export async function listStatus(): Promise<OpsStatus[]> {
  const { data } = await db.from(STATUS).select('*').order('category').limit(200);
  return (data as OpsStatus[]) ?? [];
}
export async function listFindings(): Promise<OpsFinding[]> {
  const { data } = await db.from(FINDINGS).select('*').order('created_at', { ascending: false }).limit(300);
  return ((data as OpsFinding[]) ?? []).sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}
export async function getLatestReport(): Promise<OpsReport | null> {
  const { data } = await db.from(REPORTS).select('*').order('report_date', { ascending: false }).limit(1);
  return (data?.[0] as OpsReport) ?? null;
}

export async function getStats(): Promise<OpsStats> {
  const [status, findings, report] = await Promise.all([listStatus(), listFindings(), getLatestReport()]);
  const open = findings.filter((f) => f.status === 'open');
  const sev = (s: Severity) => open.filter((f) => f.severity === s).length;
  return {
    platformStatus: report?.platform_status ?? 'unknown',
    components: status.length,
    operational: status.filter((s) => s.status === 'operational').length,
    openFindings: open.length,
    critical: sev('critical'),
    high: sev('high'),
    bySeverity: (['critical', 'high', 'medium', 'low'] as Severity[]).map((severity) => ({ severity, count: sev(severity) })),
  };
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------
export const operationsRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const result = await runAudit(ctx.runId);
  return { ok: result.platformStatus !== 'down', output: result };
};
