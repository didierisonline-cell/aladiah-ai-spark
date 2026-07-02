// =============================================================================
// Continuous Intelligence — every department as an always-observing analyst.
// The cycle: Observe → Analyze → Validate → Score confidence → Recommend →
// (governance pipeline: gates → founder approval) → Measure → Learn.
//
// HONESTY CONSTRAINTS (canon: LAUNCH_DECISION_PRINCIPLE):
// - Observers read LIVE internal telemetry only. External research/benchmark
//   ingestion has no client-side path and is declared as an unconnected
//   integration point — never fabricated.
// - A recommendation without evidence is invalid BY CONSTRUCTION (throws).
// - Confidence is a scored claim with a stated basis, not a vibe.
// - "Always-on" is bounded by Phase-1 reality: cycles run when triggered
//   (founder action or orchestrator tick), not on a server cron.
// =============================================================================
import { TaskPriority } from '@/types/aos';
import { EvidenceNote, WorkOrder, WorkOrderType, listWorkOrders } from './workOrders';
import { openWorkOrder } from './orchestration';
import { emitEvent } from './events';
import { remember } from './memory';
import { db, nowISO } from './_internal';

// ---- Contract ---------------------------------------------------------------
/** Confidence is always a value AND the basis that justifies it. */
export interface ConfidenceScore {
  /** 0.0 (guess) – 1.0 (reproducible proof in hand). */
  value: number;
  /** What makes this confidence justified (probe, sample size, reproducibility). */
  basis: string;
}

/** The mandatory shape of every department recommendation. */
export interface Recommendation {
  department: string; // owning agent slug
  title: string;
  summary: string;
  evidence: EvidenceNote[]; // ≥1 — no recommendation without evidence
  confidence: ConfidenceScore;
  estimatedImpact: string;
  estimatedEffort: string;
  risks: string[]; // ≥1 — 'none identified' must be said explicitly
  dependencies: string[];
  successMetrics: string[]; // ≥1 — how we will know it worked
  collaborators?: string[];
  priority?: TaskPriority;
  /** What the work becomes AFTER approval (informational; the order itself
   *  always opens as 'recommendation' so read-only departments can recommend). */
  targetType?: WorkOrderType;
}

export class InvalidRecommendationError extends Error {
  constructor(public violations: string[]) {
    super(`Invalid recommendation: ${violations.join('; ')}`);
    this.name = 'InvalidRecommendationError';
  }
}

/** Pure validation — returns every violation (empty = valid). */
export function validateRecommendation(rec: Recommendation): string[] {
  const v: string[] = [];
  if (!rec.title?.trim()) v.push('title is required');
  if (!rec.summary?.trim()) v.push('summary is required');
  if (!rec.evidence || rec.evidence.length === 0) v.push('at least one evidence note is required (no recommendation without evidence)');
  if (rec.evidence?.some((e) => !e.note?.trim())) v.push('evidence notes cannot be empty');
  if (rec.confidence == null || rec.confidence.value < 0 || rec.confidence.value > 1) v.push('confidence.value must be 0–1');
  if (!rec.confidence?.basis?.trim()) v.push('confidence.basis is required (a score without a basis is a vibe)');
  if (!rec.estimatedImpact?.trim()) v.push('estimatedImpact is required');
  if (!rec.estimatedEffort?.trim()) v.push('estimatedEffort is required');
  if (!rec.risks || rec.risks.length === 0) v.push("risks are required (say 'none identified' explicitly)");
  if (!rec.successMetrics || rec.successMetrics.length === 0) v.push('at least one success metric is required');
  return v;
}

/** Title normalization for duplicate detection — case/whitespace tolerant. */
export function normalizeTitle(t: string): string {
  return t.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Pure duplicate check: an order counts as a duplicate while it is still in
 * flight (not completed/cancelled/failed and not founder-rejected).
 */
export function findDuplicate(orders: WorkOrder[], title: string): WorkOrder | undefined {
  const wanted = normalizeTitle(title);
  return orders.find(
    (w) =>
      normalizeTitle(w.title) === wanted &&
      !['completed', 'cancelled', 'failed'].includes(w.status) &&
      w.founderApproval !== 'rejected',
  );
}

/**
 * Open a validated recommendation as a work order in the governance pipeline.
 * Skips (returns null) if an open work order with the same title already
 * exists — sweeps must be idempotent, not spammy.
 */
export async function openRecommendation(rec: Recommendation): Promise<WorkOrder | null> {
  const violations = validateRecommendation(rec);
  if (violations.length) throw new InvalidRecommendationError(violations);

  const existing = await listWorkOrders(300);
  if (findDuplicate(existing, rec.title)) return null;

  const wo = await openWorkOrder({
    title: rec.title,
    description:
      `${rec.summary}\n\nConfidence: ${Math.round(rec.confidence.value * 100)}% — ${rec.confidence.basis}` +
      `\nImpact: ${rec.estimatedImpact}\nEffort: ${rec.estimatedEffort}` +
      `\nRisks: ${rec.risks.join('; ')}` +
      (rec.dependencies.length ? `\nDependencies: ${rec.dependencies.join('; ')}` : '') +
      `\nSuccess metrics: ${rec.successMetrics.join('; ')}` +
      (rec.targetType ? `\nBecomes on approval: ${rec.targetType}` : ''),
    type: 'recommendation',
    ownerAgent: rec.department,
    collaborators: rec.collaborators,
    priority: rec.priority ?? 'medium',
    createdByAgent: rec.department,
  });
  if (!wo) return null;

  // Seed the order's evidence trail from the recommendation's evidence.
  const { addEvidence } = await import('./workOrders');
  for (const e of rec.evidence) await addEvidence(wo.id, e.author, e.note);

  await emitEvent('intelligence.recommendation', rec.department, `Recommendation: ${rec.title}`, {
    work_order_id: wo.id,
    confidence: rec.confidence.value,
    department: rec.department,
  });
  return wo;
}

// ---- Findings & observers -----------------------------------------------------
export type FindingSeverity = 'info' | 'attention' | 'critical';

export interface IntelligenceFinding {
  department: string;
  title: string;
  detail: string;
  evidence: EvidenceNote[];
  confidence: ConfidenceScore;
  severity: FindingSeverity;
  /** Present when the finding justifies opening a governance work order. */
  recommendation?: Omit<Recommendation, 'department' | 'evidence' | 'confidence' | 'title'> & { title?: string };
}

export interface DepartmentObserver {
  department: string;
  /** What this observer watches (shown on the cockpit). */
  source: string;
  observe: () => Promise<IntelligenceFinding[]>;
}

const observers: DepartmentObserver[] = [];

export function registerObserver(obs: DepartmentObserver): void {
  if (!observers.some((o) => o.department === obs.department && o.source === obs.source)) {
    observers.push(obs);
  }
}

export function listObservers(): DepartmentObserver[] {
  return [...observers];
}

/**
 * Pure validation for FINDINGS — the gate at the mouth of the pipeline.
 * A finding with no evidence, no confidence basis, or no department is
 * discarded at cycle time (and counted), never rendered or recommended.
 */
export function validateFinding(f: IntelligenceFinding): string[] {
  const v: string[] = [];
  if (!f.department?.trim()) v.push('department is required');
  if (!f.title?.trim()) v.push('title is required');
  if (!f.evidence || f.evidence.length === 0) v.push('at least one evidence note is required');
  if (f.evidence?.some((e) => !e.note?.trim())) v.push('evidence notes cannot be empty');
  if (f.confidence == null || f.confidence.value < 0 || f.confidence.value > 1) v.push('confidence.value must be 0–1');
  if (!f.confidence?.basis?.trim()) v.push('confidence.basis is required');
  return v;
}

/** Findings below this confidence never auto-open work orders. */
export const RECOMMEND_CONFIDENCE_THRESHOLD = 0.6;

/** Pure recommendation decision: valid finding + attached rec + confidence ≥ threshold. */
export function shouldRecommend(f: IntelligenceFinding): boolean {
  return (
    validateFinding(f).length === 0 &&
    f.recommendation != null &&
    f.confidence.value >= RECOMMEND_CONFIDENCE_THRESHOLD
  );
}

export interface CycleResult {
  department: string;
  findings: IntelligenceFinding[];
  /** Findings an observer emitted that failed validation — dropped, never shown. */
  invalidFindings: number;
  recommendationsOpened: number;
  ranAt: string;
}

/** Run one department's observers: findings → memory → events → work orders. */
export async function runDepartmentCycle(department: string): Promise<CycleResult> {
  const own = observers.filter((o) => o.department === department);
  const raw: IntelligenceFinding[] = [];
  for (const obs of own) {
    try {
      raw.push(...(await obs.observe()));
    } catch (e) {
      console.error(`[AOS:intelligence] observer failed (${department}/${obs.source}):`, e);
    }
  }

  // Evidence gate: invalid findings are dropped and counted, never rendered.
  const findings = raw.filter((f) => {
    const violations = validateFinding(f);
    if (violations.length) console.error(`[AOS:intelligence] finding dropped (${department}): ${violations.join('; ')}`);
    return violations.length === 0;
  });
  const invalidFindings = raw.length - findings.length;

  let opened = 0;
  for (const f of findings) {
    if (!shouldRecommend(f) || !f.recommendation) continue;
    try {
      const wo = await openRecommendation({
        department: f.department,
        title: f.recommendation.title ?? f.title,
        evidence: f.evidence,
        confidence: f.confidence,
        summary: f.recommendation.summary,
        estimatedImpact: f.recommendation.estimatedImpact,
        estimatedEffort: f.recommendation.estimatedEffort,
        risks: f.recommendation.risks,
        dependencies: f.recommendation.dependencies,
        successMetrics: f.recommendation.successMetrics,
        collaborators: f.recommendation.collaborators,
        priority: f.recommendation.priority,
        targetType: f.recommendation.targetType,
      });
      if (wo) opened += 1;
    } catch (e) {
      console.error('[AOS:intelligence] recommendation rejected:', e instanceof Error ? e.message : e);
    }
  }

  const critical = findings.filter((f) => f.severity === 'critical').length;
  const summary =
    `Intelligence cycle: ${findings.length} finding(s) (${critical} critical), ${opened} recommendation(s) opened.` +
    (invalidFindings > 0 ? ` ${invalidFindings} invalid finding(s) dropped at the evidence gate.` : '');
  await remember({
    agentSlug: department,
    content: `${summary} ${findings.map((f) => f.title).join(' · ')}`,
    summary: `intel:${findings.length}f:${opened}r:${critical}c`,
    type: 'short_term',
    tags: ['intelligence-cycle', critical > 0 ? 'critical' : 'routine'],
  });
  await emitEvent('intelligence.cycle.completed', department, summary, {
    department,
    findings: findings.length,
    critical,
    invalid: invalidFindings,
    recommendations_opened: opened,
  });

  return { department, findings, invalidFindings, recommendationsOpened: opened, ranAt: nowISO() };
}

/** Run every registered department's cycle. */
export async function runIntelligenceSweep(): Promise<CycleResult[]> {
  const departments = [...new Set(observers.map((o) => o.department))];
  const results: CycleResult[] = [];
  for (const d of departments) results.push(await runDepartmentCycle(d));
  return results;
}

// ---- At-rest intelligence status (dashboard visibility) ----------------------
/**
 * Structural fact: no server-side ingestion path for external research exists.
 * Flip ONLY when a founder-approved ingestion integration actually ships.
 */
export const EXTERNAL_INTELLIGENCE_CONNECTED = false;

/** A department's cycle is stale after this many hours without observation. */
export const CYCLE_STALE_HOURS = 24;

export interface DepartmentIntelligenceStatus {
  department: string;
  observers: number;
  sources: string[];
  lastCycleAt: string | null;
  lastSummary: string | null;
  /** True when never observed or last cycle older than CYCLE_STALE_HOURS. */
  stale: boolean;
  lastHadCritical: boolean;
  openRecommendations: number;
}

export interface IntelligenceStatus {
  departments: DepartmentIntelligenceStatus[];
  externalConnected: boolean;
  totalOpenRecommendations: number;
}

/**
 * What the founder sees BEFORE running anything: which departments are
 * observed, how fresh their last cycle is, and what recommendations wait.
 * Reads the durable record (agent memory + work orders) — survives reload.
 */
export async function getIntelligenceStatus(): Promise<IntelligenceStatus> {
  const departments = [...new Set(observers.map((o) => o.department))];

  // Latest cycle memory per department (tag 'intelligence-cycle').
  const lastBySlug = new Map<string, { at: string; content: string; critical: boolean }>();
  try {
    const { data } = await db
      .from('aos_agent_memory')
      .select('agent_slug,content,tags,created_at')
      .contains('tags', ['intelligence-cycle'])
      .order('created_at', { ascending: false })
      .limit(200);
    for (const row of (data ?? []) as { agent_slug: string; content: string; tags: string[]; created_at: string }[]) {
      if (!lastBySlug.has(row.agent_slug)) {
        lastBySlug.set(row.agent_slug, {
          at: row.created_at,
          content: row.content,
          critical: (row.tags ?? []).includes('critical'),
        });
      }
    }
  } catch {
    /* defensive — status renders as never-observed */
  }

  const orders = await listWorkOrders(300);
  const openRecs = orders.filter(
    (o) => o.type === 'recommendation' && !['completed', 'cancelled', 'failed'].includes(o.status) && o.founderApproval !== 'rejected',
  );

  const statuses: DepartmentIntelligenceStatus[] = departments.map((d) => {
    const own = observers.filter((o) => o.department === d);
    const last = lastBySlug.get(d) ?? null;
    const ageH = last ? (Date.now() - new Date(last.at).getTime()) / 36e5 : Infinity;
    return {
      department: d,
      observers: own.length,
      sources: own.map((o) => o.source),
      lastCycleAt: last?.at ?? null,
      lastSummary: last?.content ?? null,
      stale: ageH > CYCLE_STALE_HOURS,
      lastHadCritical: last?.critical ?? false,
      openRecommendations: openRecs.filter((o) => o.ownerAgent === d).length,
    };
  });

  return {
    departments: statuses,
    externalConnected: EXTERNAL_INTELLIGENCE_CONNECTED,
    totalOpenRecommendations: openRecs.length,
  };
}
