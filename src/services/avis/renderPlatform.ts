// =============================================================================
// AVIS — Visual Render Platform, the pure core (Phase IV step 3, WO-0014).
// Runtime-agnostic logic shared by the avis-render edge function (Deno) and
// the client/test suite (one source, no drift): visual fingerprinting, the
// render cache key (reuse-before-regenerate, Integration Architecture §8),
// quarantine/approved storage paths (§4), fail-closed rate limiting (§13 —
// "all limits are configuration the founder applies, not code constants":
// unconfigured means generation is DISABLED, never a silent default), the
// budget limiter (§12 — a department at cap cannot render), and the honest
// cost ledger (unit prices recorded per call from founder-applied
// configuration; unmeasured is null, never estimated).
// NO vendor exists here — the adapter lives only in the edge function.
// =============================================================================
import { CompiledPrompt } from './promptCompiler';
import { RenderOptions } from './renderer';

// ---- Visual fingerprinting (§5: assetId = content hash) -----------------------
/** SHA-256 hex of the image bytes — the candidateId / future assetId. */
export async function fingerprintBytes(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes.buffer as ArrayBuffer);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---- Render cache (§8: reuse-before-regenerate) --------------------------------
/** Deterministic cache identity: the governed prompt + renderer + geometry.
 *  Same compiled prompt through the same adapter at the same size never
 *  spends twice. Candidate count is NOT identity (a hit serves any count). */
export function renderCacheKey(prompt: Pick<CompiledPrompt, 'version'>, rendererId: string, opts: Pick<RenderOptions, 'size' | 'format'>): string {
  return `render:${rendererId}:${prompt.version}:${opts.size}:${opts.format}`;
}

// ---- Storage strategy (§4) ------------------------------------------------------
export const AVIS_BUCKET = 'avis-assets';
/** Drafts are quarantined: private prefix, steward/founder RLS only. */
export function draftStoragePath(candidateId: string, format: string): string {
  return `drafts/${candidateId}.${format}`;
}
/** Approved assets are immutable and class-scoped (access per classification). */
export function approvedStoragePath(visualClass: string, assetId: string, format: string): string {
  return `approved/${visualClass}/${assetId}.${format}`;
}

// ---- Rate limiting (§13) — fail closed ------------------------------------------
export interface RateDecision { allowed: boolean; reason: string }
/**
 * Per-caller ceiling. maxPerHour is founder-applied configuration; when it is
 * absent the platform fails CLOSED — no unattended spend, no silent default.
 */
export function decideRateLimit(callsThisHour: number, maxPerHour: number | null | undefined): RateDecision {
  if (maxPerHour == null || !Number.isFinite(maxPerHour)) {
    return { allowed: false, reason: 'rate limit unconfigured — generation is disabled until the founder applies AVIS_RENDER_MAX_PER_HOUR' };
  }
  if (maxPerHour <= 0) return { allowed: false, reason: 'rate limit is 0 — generation paused by configuration' };
  if (callsThisHour >= maxPerHour) return { allowed: false, reason: `per-caller ceiling reached (${callsThisHour}/${maxPerHour} this hour)` };
  return { allowed: true, reason: `within ceiling (${callsThisHour}/${maxPerHour})` };
}

// ---- Budget limiter (§12) — the hard limiter --------------------------------------
export interface BudgetDecision { allowed: boolean; remainingUsd: number | null; reason: string }
/**
 * Budgets are founder-set at enablement. No budget row → fail closed.
 * spentUsd is computed from the ledger (never asserted); a breach pauses the
 * budget until founder/steward release (M06 P4 early-warning class).
 */
export function decideBudget(budget: { capUsd: number; spentUsd: number } | null | undefined): BudgetDecision {
  if (!budget || !Number.isFinite(budget.capUsd)) {
    return { allowed: false, remainingUsd: null, reason: 'no founder-set budget for this budgetKey — generation is disabled (budgets are set at enablement)' };
  }
  const remaining = budget.capUsd - budget.spentUsd;
  if (remaining <= 0) {
    return { allowed: false, remainingUsd: 0, reason: `budget cap reached (${budget.spentUsd.toFixed(2)}/${budget.capUsd.toFixed(2)} USD) — paused until release` };
  }
  return { allowed: true, remainingUsd: remaining, reason: `within budget (${remaining.toFixed(2)} USD remaining)` };
}

// ---- The cost ledger (§12) — honest, per call --------------------------------------
export interface CostLedgerEntry {
  caller: string;
  budgetKey: string;
  visualClass: string;
  rendererId: string;
  rendererVersion: string;
  promptVersion: string;
  size: string;
  candidates: number;
  /** Founder-applied configuration (AVIS_RENDER_UNIT_COST_USD), read per call.
   *  Absent configuration records null — unmeasured, never estimated. */
  unitCostUsd: number | null;
  totalUsd: number | null;
  cacheHit: boolean;
  renderedAt: string;
}

export function ledgerEntry(input: Omit<CostLedgerEntry, 'totalUsd'>): CostLedgerEntry {
  const total = input.cacheHit
    ? 0 // a cache hit spends nothing — that is the point of reuse-before-regenerate
    : input.unitCostUsd == null ? null : input.unitCostUsd * input.candidates;
  return { ...input, totalUsd: total };
}

/** Ledger rollup for budget enforcement: null-cost rows spend 0 against caps
 *  but are counted, so unpriced spend is visible, never invisible. */
export function sumLedgerUsd(entries: Pick<CostLedgerEntry, 'totalUsd'>[]): { knownUsd: number; unpricedCalls: number } {
  let known = 0;
  let unpriced = 0;
  for (const e of entries) {
    if (e.totalUsd == null) unpriced += 1;
    else known += e.totalUsd;
  }
  return { knownUsd: known, unpricedCalls: unpriced };
}
