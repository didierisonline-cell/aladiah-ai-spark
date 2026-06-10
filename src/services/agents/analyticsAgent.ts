// =============================================================================
// Aladiah Analytics & Executive Intelligence Authority — service
// =============================================================================
// Agent #9. The executive intelligence layer and source of truth. READ-ONLY: it
// analyzes data from every other agent's tables + the product DB and produces
// revenue/student/employability/curriculum/marketing intelligence, forecasts, and
// a daily CEO brief. Primary KPI: Career Transformation Impact Score (CTIS).
// It NEVER modifies production data — recommendations only.
// =============================================================================
import { db, nowISO, safe } from '@/services/aos/_internal';
import { logAction } from '@/services/aos/logs';
import { remember } from '@/services/aos/memory';
import { reportToCeo } from '@/services/aos/communication';
import { AgentRunOutput, RunContext } from '@/types/aos';
import {
  ANALYTICS_AGENT_SLUG,
  AnalyticsMetric,
  AnalyticsReport,
  Forecasts,
  IntelligenceSections,
  Metric,
} from '@/types/analytics';
import { computeCTIS } from './analytics/engines';

const SLUG = ANALYTICS_AGENT_SLUG;
const PRICE = 1999; // membership price (estimate; used for revenue projection, flagged)

const m = (label: string, value: string | number, note?: string): Metric => ({ label, value: String(value), note });
const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
const since = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

// ---------------------------------------------------------------------------
// Gather + compute (the source of truth)
// ---------------------------------------------------------------------------
export async function buildBrief(runId?: string | null): Promise<AnalyticsReport> {
  const G = async (fn: () => Promise<any[]>) => safe(fn, [] as any[]);
  const [profiles, subs, progress, attempts, qquestions, analytics, marketing, referrals, placements, employers, successStudents, plMatches] =
    await Promise.all([
      G(async () => (await db.from('profiles').select('user_id, id, created_at').limit(5000)).data ?? []),
      G(async () => (await db.from('subscriptions').select('user_id, status, created_at').limit(5000)).data ?? []),
      G(async () => (await db.from('user_progress').select('user_id, quiz_id, completed_at').not('quiz_id', 'is', null).limit(20000)).data ?? []),
      G(async () => (await db.from('quiz_attempts').select('user_id, score, created_at').limit(20000)).data ?? []),
      G(async () => (await db.from('quiz_questions').select('competency').not('competency', 'is', null).limit(10000)).data ?? []),
      G(async () => (await db.from('student_analytics').select('user_id, created_at').gte('created_at', since(1)).limit(20000)).data ?? []),
      G(async () => (await db.from('marketing_content').select('performance, status').limit(2000)).data ?? []),
      G(async () => (await db.from('referral_tracking').select('id').limit(5000)).data ?? []),
      G(async () => (await db.from('placement_candidates').select('status').limit(5000)).data ?? []),
      G(async () => (await db.from('placement_employers').select('satisfaction').limit(2000)).data ?? []),
      G(async () => (await db.from('success_students').select('career_transformation_score, competency_mastery, status, certification_readiness').limit(5000)).data ?? []),
      G(async () => (await db.from('placement_matches').select('stage, offer_amount').limit(5000)).data ?? []),
    ]);

  // --- Revenue intelligence ---
  const activeSubs = subs.filter((s) => s.status === 'active').length;
  const newSubs7d = subs.filter((s) => new Date(s.created_at).getTime() >= Date.now() - 7 * 86400000).length;
  const mrr = activeSubs * PRICE; // estimate
  const revenue = {
    metrics: [
      m('Active memberships', activeSubs),
      m('New (7d)', newSubs7d),
      m('MRR (est.)', `$${mrr.toLocaleString()}`, 'Estimated at list price; wire real billing for exact.'),
      m('ARR (est.)', `$${(mrr * 12).toLocaleString()}`),
    ],
    note: 'Revenue by program/country/tier/source requires billing metadata (Phase 2).',
  };

  // --- Student intelligence ---
  const totalStudents = profiles.length;
  const activeUsers = new Set(analytics.map((a) => a.user_id)).size;
  const newStudents7d = profiles.filter((p) => new Date(p.created_at).getTime() >= Date.now() - 7 * 86400000).length;
  const avgScore = avg(attempts.map((a) => a.score ?? 0));
  const atRisk = successStudents.filter((s) => s.status === 'at_risk').length;
  const certRate = avg(successStudents.map((s) => s.certification_readiness ?? 0));
  const students = {
    metrics: [
      m('Total students', totalStudents),
      m('Active (24h)', activeUsers),
      m('New (7d)', newStudents7d),
      m('Avg quiz score', `${avgScore}%`),
      m('At-risk (churn)', atRisk),
      m('Certification readiness', `${certRate}%`),
    ],
    note: 'Completion/certification rates sharpen as Student Success data accumulates.',
  };

  // --- Employability intelligence ---
  const placed = plMatches.filter((x) => x.stage === 'placed').length;
  const placementRate = placements.length ? Math.round((placed / placements.length) * 100) : 0;
  const empSat = avg((employers as any[]).map((e) => e.satisfaction ?? 0).filter(Boolean));
  const employability = {
    metrics: [
      m('Placement-ready candidates', placements.length),
      m('Placed', placed),
      m('Placement rate', `${placementRate}%`),
      m('Employer satisfaction', empSat ? `${empSat}` : '—'),
    ],
    note: 'Salary/time-to-placement populate as placements complete.',
  };

  // --- Curriculum intelligence ---
  const compCounts = new Map<string, number>();
  for (const q of qquestions) { const c = (q as any).competency; if (c) compCounts.set(c, (compCounts.get(c) ?? 0) + 1); }
  const weakComps = [...compCounts.entries()].filter(([, n]) => n < 3).map(([c]) => c);
  const curriculum = {
    metrics: [
      m('Best program', 'Scrum Master', 'Only active program'),
      m('Competencies tracked', compCounts.size),
      m('Weak competencies', weakComps.length ? weakComps.join(', ') : 'none'),
    ],
    note: 'Curriculum quality is governed by the Product Builder + QA agents.',
  };

  // --- Marketing intelligence ---
  const leads = (marketing as any[]).reduce((s, c) => s + Number(c?.performance?.leads ?? 0), 0);
  const marketingSec = {
    metrics: [
      m('Content assets', marketing.length),
      m('Leads (tracked)', leads),
      m('Referrals', referrals.length),
    ],
    note: 'CPL/CPA/ROI require ad-spend + conversion data (Phase 2).',
  };

  const sections: IntelligenceSections = { revenue, students, employability, curriculum, marketing: marketingSec };

  // --- CTIS (master KPI) ---
  const ctisComponents = {
    student_success: avg(successStudents.map((s) => s.career_transformation_score ?? 0)),
    placement_success: placementRate,
    salary_growth: 0, // populated by Placement once salary outcomes land
    certification_success: certRate,
    competency_growth: avg(successStudents.map((s) => s.competency_mastery ?? 0)) || avgScore,
    employer_satisfaction: empSat,
  };
  const ctis = computeCTIS(ctisComponents);

  // --- Forecasts (heuristic v1) ---
  const dailyRev = mrr / 30;
  const forecasts: Forecasts = {
    revenue_30d: Math.round(dailyRev * 30),
    revenue_90d: Math.round(dailyRev * 90 * 1.05),
    revenue_12m: Math.round(mrr * 12 * 1.1),
    enrollment_growth_pct: newSubs7d > 0 ? 8 : 2,
    avg_completion_probability: avg(successStudents.map((s) => s.career_transformation_score ?? 0)),
    avg_dropout_probability: clampPct(100 - avg(successStudents.map((s) => s.career_transformation_score ?? 0))),
  };

  // --- Risks / recommendations / priority actions ---
  const risks: string[] = [];
  if (atRisk > 0) risks.push(`${atRisk} student(s) at churn risk.`);
  if (activeUsers < totalStudents * 0.1) risks.push('Low active-student rate — engagement risk.');
  if (placementRate < 30 && placements.length > 0) risks.push('Placement rate below target.');
  if (risks.length === 0) risks.push('No material risks from available data.');

  const recommendations = [
    'Wire real billing + ad-spend data to complete revenue and marketing intelligence.',
    'Drive active-student rate via Student Success interventions.',
    'Accelerate placements to lift the CTIS placement component.',
  ];
  const priority_actions = [
    atRisk > 0 ? 'Approve Student Success interventions for at-risk students.' : 'Approve next marketing campaign to grow enrollment.',
    'Review QA-cleared curriculum artifacts in the Founder Approval Queue.',
    'Approve any pending placement submissions.',
  ];

  const summary = `CTIS ${ctis}. ${totalStudents} students (${activeUsers} active/24h), ${activeSubs} memberships, placement rate ${placementRate}%. ${atRisk} at-risk. Several data sources (billing, ad spend, salary outcomes) are estimated/pending — flagged inline.`;

  // --- Persist (own tables only) ---
  const payload = {
    report_type: 'ceo_brief',
    report_date: new Date().toISOString().slice(0, 10),
    ctis,
    summary,
    sections,
    forecasts,
    risks,
    recommendations,
    priority_actions,
  };
  const { data } = await db.from('analytics_reports').upsert(payload, { onConflict: 'report_type,report_date' }).select('*').single();

  // Snapshot key metrics for trend/forecasting history.
  await db.from('analytics_metrics').insert([
    { metric_key: 'ctis', value: ctis },
    { metric_key: 'mrr_estimate', value: mrr },
    { metric_key: 'active_students_24h', value: activeUsers },
    { metric_key: 'placement_rate', value: placementRate },
  ]);

  await remember({ agentSlug: SLUG, content: `CEO brief: CTIS ${ctis}. ${summary}`, summary: `ctis:${ctis}`, type: 'long_term', importance: 0.85, tags: ['ceo_brief', 'ctis'], source: runId ?? undefined });
  await reportToCeo(SLUG, { subject: `Executive brief: CTIS ${ctis}`, body: summary, payload: { ctis, forecasts } });
  await logAction(SLUG, 'build_brief', { runId, result: 'success', message: `CTIS ${ctis}` });

  return (data as AnalyticsReport) ?? ({ ...payload, id: '', created_at: nowISO() } as any);
}

function clampPct(n: number) { return Math.max(0, Math.min(100, Math.round(n))); }

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------
export async function getLatestReport(): Promise<AnalyticsReport | null> {
  const { data } = await db.from('analytics_reports').select('*').eq('report_type', 'ceo_brief').order('report_date', { ascending: false }).limit(1);
  return (data?.[0] as AnalyticsReport) ?? null;
}
export async function listReports(limit = 30): Promise<AnalyticsReport[]> {
  const { data } = await db.from('analytics_reports').select('*').order('report_date', { ascending: false }).limit(limit);
  return (data as AnalyticsReport[]) ?? [];
}
export async function listMetrics(metricKey: string, limit = 30): Promise<AnalyticsMetric[]> {
  const { data } = await db.from('analytics_metrics').select('*').eq('metric_key', metricKey).order('captured_at', { ascending: false }).limit(limit);
  return (data as AnalyticsMetric[]) ?? [];
}
/** Master KPI for the Control Center. */
export async function getCTIS(): Promise<number> {
  const r = await getLatestReport();
  return r?.ctis ?? 0;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------
export const analyticsRunner = async (ctx: RunContext): Promise<AgentRunOutput> => {
  const report = await buildBrief(ctx.runId);
  return { ok: true, output: { ctis: report.ctis } };
};
