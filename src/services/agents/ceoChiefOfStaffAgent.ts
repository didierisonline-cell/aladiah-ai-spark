// =============================================================================
// Aladiah AI Workforce — Agent #1: CEO Chief of Staff
// =============================================================================
// Client-side agent service (blueprint v1, build prompt §3). It:
//   1. Fetches the day's business metrics from Supabase (defensively)
//   2. Assembles a structured Daily Command Report object
//   3. Saves the report to agent_reports (upsert: one per agent per day)
//   4. Derives recommended CEO actions -> agent_tasks + agent_recommendations
//
// Design notes:
//  - Runs under the logged-in admin's session; RLS (migration 20260610120000)
//    grants admin SELECT/INSERT/UPDATE on these tables.
//  - NEVER fabricates a metric. When a source is missing, it uses 0 and records
//    the gap in the relevant `notes` field (per the agent's honesty contract).
//  - Schema drift is known on this DB, so every query is wrapped — a missing or
//    renamed table degrades gracefully instead of throwing.
//  - Deterministic v1. The Claude-powered narrative synthesis (using the Master
//    System Prompt in docs/agents/ceo-chief-of-staff/AGENT_SPEC.md) is Phase 2,
//    delivered via a server-side edge function so the API key stays server-side.
// =============================================================================

import { supabase } from '@/integrations/supabase/client';
import {
  AgentReportRow,
  CeoAction,
  DailyCommandReport,
  Severity,
  UrgencyLevel,
  reportFromRow,
} from '@/types/agentReports';

export const AGENT_NAME = 'CEO Chief of Staff Agent';
export const REPORT_TYPE = 'daily_command_report';

// Supabase generated types don't yet include the new agent_* tables; this DB
// also has known drift. Use a loosely-typed handle for runtime-flexible queries.
// (Build is esbuild, no tsc — but this keeps the editor quiet too.)
const db = supabase as unknown as {
  from: (table: string) => any;
};

const isoDaysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const todayISODate = () => new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// Defensive query helpers — never throw, return null when a source is missing.
// ---------------------------------------------------------------------------

async function safeCount(
  table: string,
  apply: (q: any) => any = (q) => q,
): Promise<number | null> {
  try {
    const base = db.from(table).select('*', { count: 'exact', head: true });
    const { count, error } = await apply(base);
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

async function safeDistinct(
  table: string,
  column: string,
  apply: (q: any) => any = (q) => q,
): Promise<number | null> {
  try {
    const base = db.from(table).select(column).limit(10000);
    const { data, error } = await apply(base);
    if (error || !data) return null;
    return new Set(data.map((r: any) => r[column]).filter(Boolean)).size;
  } catch {
    return null;
  }
}

async function safeRow(
  table: string,
  apply: (q: any) => any = (q) => q,
): Promise<any | null> {
  try {
    const { data, error } = await apply(db.from(table).select('*'));
    if (error || !data || data.length === 0) return null;
    return data[0];
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 1. Gather metrics
// ---------------------------------------------------------------------------

interface GatheredMetrics {
  // revenue
  paidStudents: number | null;
  mrr: number | null;
  revenueToday: number | null;
  failedPayments: number | null;
  cancellations: number | null;
  // students
  newSignups: number | null;
  activeStudents: number | null;
  inactiveStudents: number | null;
  quizFailures: number | null;
  studentsNeedingHelp: number | null;
  totalStudents: number | null;
  // marketing / sales
  postsPublished: number | null;
  websiteVisitors: number | null;
  newLeads: number | null;
  hotLeads: number | null;
  supportTicketsOpen: number | null;
  // product
  newCourses: number | null;
  newQuizzes: number | null;
}

async function gatherMetrics(): Promise<GatheredMetrics> {
  const since24 = isoDaysAgo(1);
  const since7 = isoDaysAgo(7);
  const today = todayISODate();

  // Prefer a pre-computed daily snapshot when present.
  const bm = await safeRow('business_metrics_daily', (q) =>
    q.eq('metric_date', today).limit(1),
  );

  // Live fallbacks from real product tables (best-effort).
  const [
    totalStudents,
    newSignups,
    paidStudents,
    activeStudents,
    quizFailures,
    newCourses,
    newQuizzes,
  ] = await Promise.all([
    safeCount('profiles'),
    safeCount('profiles', (q) => q.gte('created_at', since24)),
    safeCount('subscriptions', (q) => q.eq('status', 'active')),
    safeDistinct('student_analytics', 'user_id', (q) =>
      q.gte('created_at', since24),
    ),
    safeCount('quiz_attempts', (q) => q.gte('created_at', since24).lt('score', 70)),
    safeCount('courses', (q) => q.gte('created_at', since7)),
    safeCount('quizzes', (q) => q.gte('created_at', since7)),
  ]);

  const inactiveStudents =
    totalStudents !== null && activeStudents !== null
      ? Math.max(totalStudents - activeStudents, 0)
      : null;

  return {
    // revenue — only what the DB actually exposes; money fields come from the
    // daily snapshot (not fabricated from a guessed price).
    paidStudents: bm?.paid_students ?? paidStudents,
    mrr: bm?.mrr ?? null,
    revenueToday: bm?.revenue_today ?? null,
    failedPayments: bm?.failed_payments ?? null,
    cancellations: bm?.cancelled_subscriptions ?? null,
    // students
    newSignups: bm?.new_signups ?? newSignups,
    activeStudents: bm?.active_students ?? activeStudents,
    inactiveStudents: bm?.inactive_students ?? inactiveStudents,
    quizFailures,
    studentsNeedingHelp: bm?.support_tickets_open ?? null,
    totalStudents,
    // marketing / sales
    postsPublished: bm?.posts_published ?? null,
    websiteVisitors: bm?.website_visitors ?? null,
    newLeads: bm?.new_leads ?? null,
    hotLeads: bm?.hot_leads ?? null,
    supportTicketsOpen: bm?.support_tickets_open ?? null,
    // product
    newCourses,
    newQuizzes,
  };
}

// ---------------------------------------------------------------------------
// 2. Build the report (deterministic v1)
// ---------------------------------------------------------------------------

const n = (v: number | null) => (v === null ? 0 : v);
const gap = (v: number | null, label: string) =>
  v === null ? `${label}: source unavailable — reported as 0.` : '';
const joinNotes = (...parts: string[]) =>
  parts.filter(Boolean).join(' ') || 'No data gaps detected.';

function buildReport(m: GatheredMetrics): DailyCommandReport {
  const risks = deriveRisks(m);
  const actions = deriveActions(m);

  const revenue = {
    new_paid_students: 0, // not separable from active count in v1 schema
    mrr: n(m.mrr),
    revenue_today: n(m.revenueToday),
    failed_payments: n(m.failedPayments),
    cancellations: n(m.cancellations),
    notes: joinNotes(
      `Active paying students: ${n(m.paidStudents)}.`,
      gap(m.mrr, 'MRR'),
      gap(m.revenueToday, 'Revenue today'),
      gap(m.failedPayments, 'Failed payments'),
      gap(m.cancellations, 'Cancellations'),
    ),
  };

  const students = {
    new_signups: n(m.newSignups),
    active_students: n(m.activeStudents),
    inactive_students: n(m.inactiveStudents),
    quiz_failures: n(m.quizFailures),
    students_needing_help: n(m.studentsNeedingHelp),
    notes: joinNotes(
      `Total students on platform: ${n(m.totalStudents)}.`,
      gap(m.activeStudents, 'Active students (last 24h)'),
      gap(m.quizFailures, 'Quiz failures'),
      gap(m.studentsNeedingHelp, 'Students needing help'),
    ),
  };

  const product = {
    new_lessons_created: 0,
    new_modules_completed: 0,
    new_simulations_created: 0,
    content_gaps: [] as string[],
    notes: joinNotes(
      `New courses (7d): ${n(m.newCourses)}; new quizzes (7d): ${n(m.newQuizzes)}.`,
      'Lesson / module / simulation creation counters require the product-events feed (Phase 2).',
    ),
  };

  const platform = {
    website_status: 'unknown',
    signup_flow_status: 'unknown',
    payment_flow_status: 'unknown',
    broken_links: [] as string[],
    errors_detected: [] as string[],
    notes:
      'Platform health checks (uptime, flow probes, error logs) are not yet wired. Status is reported as "unknown" rather than assumed healthy.',
  };

  const marketing = {
    posts_published: n(m.postsPublished),
    top_content: '',
    website_visitors: n(m.websiteVisitors),
    leads_generated: n(m.newLeads),
    notes: joinNotes(
      gap(m.postsPublished, 'Posts published'),
      gap(m.websiteVisitors, 'Website visitors'),
      gap(m.newLeads, 'Leads generated'),
      'Channel analytics (LinkedIn, YouTube, Search Console) are manual-input until integrated.',
    ),
  };

  const sales = {
    new_inquiries: n(m.newLeads),
    hot_leads: n(m.hotLeads),
    unanswered_messages: 0,
    webinar_signups: 0,
    notes: joinNotes(
      gap(m.newLeads, 'New inquiries / leads'),
      gap(m.hotLeads, 'Hot leads'),
      'DMs, unanswered messages, and webinar signups are manual-import until integrated.',
    ),
  };

  const urgency_level = urgencyFromRisks(risks);

  return {
    report_date: todayISODate(),
    agent_name: AGENT_NAME,
    urgency_level,
    executive_summary: buildExecutiveSummary(m, risks, urgency_level),
    revenue,
    students,
    product,
    platform,
    marketing,
    sales,
    risks,
    recommended_ceo_actions: actions,
  };
}

function buildExecutiveSummary(
  m: GatheredMetrics,
  risks: DailyCommandReport['risks'],
  urgency: UrgencyLevel,
): string {
  const parts: string[] = [];
  parts.push(
    `${n(m.totalStudents)} students on platform, ${n(m.activeStudents)} active in the last 24h, ${n(m.newSignups)} new signups.`,
  );
  parts.push(`${n(m.paidStudents)} active paying students.`);
  if (n(m.quizFailures) > 0)
    parts.push(`${n(m.quizFailures)} quiz failures in the last 24h to watch.`);
  if (risks.length > 0) {
    const top = risks[0];
    parts.push(`Top risk (${top.severity}): ${top.risk}.`);
  } else {
    parts.push('No material risks surfaced from available data.');
  }
  if (urgency !== 'normal')
    parts.push(`Overall urgency is ${urgency.toUpperCase()} today.`);
  parts.push(
    'Several sources (revenue, marketing, sales, platform health) are not yet integrated and are reported as gaps, not assumed values.',
  );
  return parts.join(' ');
}

// ---------------------------------------------------------------------------
// Risk + action derivation (deterministic rules)
// ---------------------------------------------------------------------------

function deriveRisks(m: GatheredMetrics): DailyCommandReport['risks'] {
  const risks: DailyCommandReport['risks'] = [];

  if (n(m.failedPayments) > 0)
    risks.push({
      risk: `${n(m.failedPayments)} failed payment(s) in the last day.`,
      category: 'revenue',
      severity: n(m.failedPayments) >= 3 ? 'high' : 'medium',
      recommended_response:
        'Review failed payments and trigger the dunning / retry flow before churn lands.',
    });

  if (n(m.cancellations) > 0)
    risks.push({
      risk: `${n(m.cancellations)} cancellation(s) recorded.`,
      category: 'revenue',
      severity: n(m.cancellations) >= 3 ? 'high' : 'medium',
      recommended_response:
        'Run win-back outreach and capture cancellation reasons to find the root cause.',
    });

  if (m.activeStudents !== null && m.totalStudents && m.totalStudents > 0) {
    const activeRate = (m.activeStudents || 0) / m.totalStudents;
    if (activeRate < 0.1)
      risks.push({
        risk: `Only ${m.activeStudents}/${m.totalStudents} students active in 24h — low engagement.`,
        category: 'student_dropout',
        severity: 'high',
        recommended_response:
          'Launch a re-engagement nudge (AI tutor check-in / next-lesson reminder) to inactive cohort.',
      });
  }

  if (n(m.quizFailures) >= 5)
    risks.push({
      risk: `${n(m.quizFailures)} quiz failures in 24h may signal a content or difficulty problem.`,
      category: 'product',
      severity: 'medium',
      recommended_response:
        'Identify the failing quizzes and review difficulty / explanations against the competency taxonomy.',
    });

  // Platform health is unverified — surface that as an explicit (low) risk so it
  // is never silently assumed healthy.
  risks.push({
    risk: 'Platform health is not actively monitored (uptime, flows, error logs).',
    category: 'technical',
    severity: 'low',
    recommended_response:
      'Wire automated health probes for signup, login, and payment flows (Phase 2 automation).',
  });

  // Highest severity first.
  const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  return risks.sort((a, b) => order[a.severity] - order[b.severity]);
}

function deriveActions(m: GatheredMetrics): CeoAction[] {
  const actions: CeoAction[] = [];

  if (m.activeStudents !== null && m.totalStudents && m.totalStudents > 0) {
    const activeRate = (m.activeStudents || 0) / m.totalStudents;
    if (activeRate < 0.25)
      actions.push({
        action: 'Approve a re-engagement push to inactive students this week.',
        reason: `Active rate is ${(activeRate * 100).toFixed(0)}% — engagement drives completion and employability outcomes.`,
        priority: 'high',
        estimated_impact: 'Higher active rate → more competency data and completions.',
      });
  }

  if (n(m.failedPayments) > 0 || n(m.cancellations) > 0)
    actions.push({
      action: 'Review the revenue-leak list (failed payments + cancellations).',
      reason: 'Recovering at-risk revenue is the cheapest growth available today.',
      priority: 'high',
      estimated_impact: 'Direct MRR protection.',
    });

  if (n(m.newSignups) > 0)
    actions.push({
      action: `Ensure today's ${n(m.newSignups)} new signup(s) hit the activation path.`,
      reason: 'First-session activation is the strongest predictor of retention.',
      priority: 'medium',
      estimated_impact: 'Better signup→active conversion.',
    });

  // Always include the foundational ops action so the workforce keeps maturing.
  actions.push({
    action: 'Green-light Phase 2: connect revenue, marketing, and platform-health data sources.',
    reason: 'Today’s report has real student data but flagged gaps elsewhere; closing them sharpens every future decision.',
    priority: actions.length === 0 ? 'high' : 'medium',
    estimated_impact: 'A complete, trustworthy daily operating picture.',
  });

  // Keep the top 3, as the agent is required to recommend the top 3 actions.
  const rank: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return actions.sort((a, b) => rank[a.priority] - rank[b.priority]).slice(0, 3);
}

function urgencyFromRisks(risks: DailyCommandReport['risks']): UrgencyLevel {
  if (risks.some((r) => r.severity === 'critical')) return 'critical';
  if (risks.some((r) => r.severity === 'high')) return 'high';
  if (risks.some((r) => r.severity === 'medium')) return 'elevated';
  return 'normal';
}

// ---------------------------------------------------------------------------
// 3 & 4. Persist report, tasks, recommendations
// ---------------------------------------------------------------------------

async function saveReport(report: DailyCommandReport): Promise<string | null> {
  const payload = {
    report_date: report.report_date,
    agent_name: report.agent_name,
    report_type: REPORT_TYPE,
    summary: report.executive_summary,
    revenue_summary: report.revenue,
    student_summary: report.students,
    product_summary: report.product,
    platform_summary: report.platform,
    marketing_summary: report.marketing,
    sales_summary: report.sales,
    risks: report.risks,
    recommended_actions: report.recommended_ceo_actions,
    urgency_level: report.urgency_level,
  };

  const { data, error } = await db
    .from('agent_reports')
    .upsert(payload, { onConflict: 'agent_name,report_date' })
    .select('id')
    .single();

  if (error) {
    console.error('[ceoChiefOfStaffAgent] saveReport failed:', error.message);
    return null;
  }
  return data?.id ?? null;
}

async function generateTasksAndRecommendations(
  report: DailyCommandReport,
  reportId: string,
): Promise<void> {
  const dueToday = todayISODate();

  const tasks = report.recommended_ceo_actions.map((a) => ({
    title: a.action,
    description: `${a.reason} (Expected impact: ${a.estimated_impact})`,
    assigned_agent: AGENT_NAME,
    status: 'pending',
    priority: a.priority,
    category: 'ceo_action',
    due_date: dueToday,
    source_report_id: reportId,
  }));

  const recommendations = report.recommended_ceo_actions.map((a) => ({
    report_id: reportId,
    recommendation: a.action,
    reason: a.reason,
    impact_level: a.priority,
    effort_level: 'medium',
    status: 'pending',
    approved_by_founder: false,
  }));

  if (tasks.length > 0) {
    const { error } = await db.from('agent_tasks').insert(tasks);
    if (error) console.error('[ceoChiefOfStaffAgent] task insert failed:', error.message);
  }
  if (recommendations.length > 0) {
    const { error } = await db.from('agent_recommendations').insert(recommendations);
    if (error)
      console.error('[ceoChiefOfStaffAgent] recommendation insert failed:', error.message);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface RunResult {
  report: DailyCommandReport;
  reportId: string | null;
}

/** Full daily run: gather → build → save → spin up tasks. Returns the report. */
export async function runCeoChiefOfStaffAgent(): Promise<RunResult> {
  const metrics = await gatherMetrics();
  const report = buildReport(metrics);
  const reportId = await saveReport(report);
  if (reportId) {
    await generateTasksAndRecommendations(report, reportId);
  }
  return { report, reportId };
}

/** Fetch the most recent stored report (for the Command Center on load). */
export async function getLatestReport(): Promise<DailyCommandReport | null> {
  try {
    const { data, error } = await db
      .from('agent_reports')
      .select('*')
      .eq('agent_name', AGENT_NAME)
      .order('report_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return reportFromRow(data[0] as AgentReportRow);
  } catch {
    return null;
  }
}
