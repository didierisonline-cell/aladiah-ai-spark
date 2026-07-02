// =============================================================================
// Executive Briefings — cadenced OS-level reports, compiled from live state.
// Daily CEO briefing · Weekly executive report · Monthly strategic review ·
// Quarterly roadmap recommendations. Every report is generated from the same
// live sources the cockpit reads (never fabricated), stored in the Company
// Brain (category 'executive-report'), and stamped so staleness is visible.
// The CEO agent's business report (agent_reports) remains its own artifact —
// these briefings cover the OPERATING SYSTEM: readiness, governance, and the
// recommendation pipeline.
// =============================================================================
import { getCockpitSnapshot } from './cockpit';
import { emitEvent, listEvents } from './events';
import { WorkOrder, listWorkOrders, addEvidence } from './workOrders';
import { BrainEntry, listBrain, recordDecision } from './brain';
import { nowISO } from './_internal';

export type BriefingPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export const PERIODS: { key: BriefingPeriod; label: string; staleAfterHours: number }[] = [
  { key: 'daily', label: 'Daily CEO Briefing', staleAfterHours: 24 },
  { key: 'weekly', label: 'Weekly Executive Report', staleAfterHours: 7 * 24 },
  { key: 'monthly', label: 'Monthly Strategic Review', staleAfterHours: 30 * 24 },
  { key: 'quarterly', label: 'Quarterly Roadmap', staleAfterHours: 90 * 24 },
];

const hoursSince = (iso: string) => (Date.now() - new Date(iso).getTime()) / 36e5;

/** Open recommendation work orders, highest confidence first (parsed from description). */
function topRecommendations(orders: WorkOrder[], limit: number): string[] {
  const recs = orders
    .filter((o) => o.type === 'recommendation' && !['completed', 'cancelled', 'failed'].includes(o.status))
    .map((o) => {
      const m = /Confidence: (\d+)%/.exec(o.description ?? '');
      return { title: o.title, owner: o.ownerAgent ?? '—', confidence: m ? Number(m[1]) : 0, approval: o.founderApproval };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
  return recs.map((r) => `- [${r.confidence}% conf] ${r.title} (owner: ${r.owner}; founder: ${r.approval})`);
}

/** Compile one report from live state. Returns the stored Brain entry. */
export async function generateExecutiveReport(period: BriefingPeriod): Promise<BrainEntry | null> {
  const [snap, orders] = await Promise.all([getCockpitSnapshot(), listWorkOrders(300)]);
  const windowH = period === 'daily' ? 24 : period === 'weekly' ? 7 * 24 : period === 'monthly' ? 30 * 24 : 90 * 24;
  const events = (await listEvents(200)).filter((e) => hoursSince(e.createdAt) <= windowH);

  const runFails = events.filter((e) => e.type === 'agent.run.failed').length;
  const runOks = events.filter((e) => e.type === 'agent.run.completed').length;
  const decisions = events.filter((e) => e.type === 'work_order.approved' || e.type === 'work_order.rejected').length;
  const recsOpened = events.filter((e) => e.type === 'intelligence.recommendation').length;
  const openOrders = orders.filter((o) => !['completed', 'cancelled', 'failed'].includes(o.status));
  const completed = events.filter((e) => e.type === 'work_order.completed').length;

  const trend = snap.readinessHistory.slice(period === 'daily' ? -2 : period === 'weekly' ? -7 : -30);
  const trendLine =
    trend.length >= 2
      ? `${trend[0].score}% → ${trend[trend.length - 1].score}% over ${trend.length} recorded day(s)`
      : 'insufficient history (grows as the cockpit is used daily)';

  const lines: string[] = [
    `Launch readiness: ${snap.launchReadiness ?? '—'}% (${snap.scoredDimensions} scored, ${snap.unmeasuredDimensions} unmeasured). Trend: ${trendLine}.`,
    `Gates: ${snap.gates.map((g) => `${g.label} ${g.verdict}`).join(' · ')}. Platform: ${snap.platformHealth}. Critical blockers: ${snap.criticalBlockers}.`,
    `Business: ${snap.students ?? '—'} students · MRR $${snap.mrr} · ${snap.subscriptionRisks} subscription risk(s).`,
    `Governance (${period} window): ${snap.approvals.total} approval(s) pending · ${openOrders.length} open work order(s) (${snap.workOrders.gateBlocked} in gates) · ${decisions} founder decision(s) · ${completed} completed.`,
    `Workforce (${period} window): ${runOks} successful run(s), ${runFails} failed. ${recsOpened} recommendation(s) opened by intelligence.`,
  ];

  if (period === 'monthly' || period === 'quarterly') {
    const unmeasured = snap.dimensions.filter((d) => d.basis === 'unmeasured').map((d) => d.label);
    lines.push(`Strategic gaps (unmeasured dimensions): ${unmeasured.join(', ') || 'none'}.`);
  }
  if (period === 'quarterly') {
    lines.push('Top open recommendations by confidence:');
    const top = topRecommendations(orders, 8);
    lines.push(...(top.length ? top : ['- none open — run an intelligence sweep']));
  }

  const label = PERIODS.find((p) => p.key === period)?.label ?? period;
  const today = nowISO().slice(0, 10);
  const entry = await recordDecision({
    category: 'executive-report',
    content: `${label} — ${today}\n\n${lines.join('\n')}`,
    summary: `briefing:${period}:${today}`,
    recordedBy: 'analytics-intelligence',
  });
  if (entry) {
    await emitEvent('briefing.generated', 'analytics-intelligence', `${label} generated (${today})`, {
      period,
      brain_entry_id: entry.id,
    });
  }
  return entry;
}

export interface BriefingStatus {
  period: BriefingPeriod;
  label: string;
  lastGeneratedAt: string | null;
  stale: boolean;
}

/** When was each cadence last produced, and is it overdue? */
export async function getBriefingStatus(): Promise<BriefingStatus[]> {
  const reports = await listBrain('executive-report', 200);
  return PERIODS.map((p) => {
    const last = reports.find((r) => r.summary?.startsWith(`briefing:${p.key}:`));
    return {
      period: p.key,
      label: p.label,
      lastGeneratedAt: last?.createdAt ?? null,
      stale: !last || hoursSince(last.createdAt) > p.staleAfterHours,
    };
  });
}

export async function listBriefings(period?: BriefingPeriod, limit = 20): Promise<BrainEntry[]> {
  const reports = await listBrain('executive-report', 200);
  return reports.filter((r) => !period || r.summary?.startsWith(`briefing:${period}:`)).slice(0, limit);
}

// ---- Impact measurement (the learn loop) ------------------------------------
export type ImpactOutcome = 'positive' | 'negative' | 'neutral';

/**
 * Record what actually happened after an approved work order shipped —
 * against its own success metrics. Lands on the order's evidence trail AND
 * in the Company Brain so the next recommendation learns from it.
 */
export async function recordImpactMeasurement(
  wo: WorkOrder,
  input: { outcome: ImpactOutcome; measured: string; recordedBy?: string },
): Promise<BrainEntry | null> {
  const by = input.recordedBy ?? 'founder';
  await addEvidence(wo.id, by, `IMPACT (${input.outcome}): ${input.measured}`);
  const entry = await recordDecision({
    category: 'impact-measurement',
    content: `Work order "${wo.title}" (${wo.id}) — outcome ${input.outcome.toUpperCase()}: ${input.measured}`,
    summary: `impact:${input.outcome}:${wo.id}`,
    recordedBy: by,
  });
  await emitEvent('impact.measured', by, `Impact ${input.outcome}: ${wo.title}`, {
    work_order_id: wo.id,
    outcome: input.outcome,
  });
  return entry;
}
