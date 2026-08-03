// Deal analyzer — the wholesale money math.
//
// Pure, side-effect-free functions. This is the platform's core IP: every
// dollar the operator sees traces back through these formulas to real comps
// and repair inputs (Evidence creates truth). Unit-tested in dealAnalyzer.test.ts.

import type {
  Comp,
  DealAnalysis,
  DealAnalysisInput,
  RepairTier,
} from "../types";

/** Default per-sqft repair costs by tier (USD). Tune per market in config. */
export const REPAIR_COST_PER_SQFT: Record<RepairTier, number> = {
  cosmetic: 15, // paint, carpet, fixtures
  moderate: 30, // kitchen/bath refresh, some systems
  heavy: 50, // full kitchen/baths, roof, HVAC
  gut: 75, // down to studs
};

/** The classic wholesale "70% rule" — investors pay ~70% of ARV all-in. */
export const DEFAULT_ARV_PERCENT = 0.7;
export const DEFAULT_ASSIGNMENT_FEE = 10_000;

/**
 * States that restrict or regulate unlicensed wholesaling. Deals here get a
 * warning so the operator confirms the equitable-interest disclosure / license
 * posture before proceeding. Not legal advice — a prompt to verify locally.
 */
export const RESTRICTED_WHOLESALE_STATES = new Set(["IL", "OK", "SC"]);

/**
 * Estimate After-Repair Value from comparable sales using a
 * price-per-sqft approach, weighted toward closer & more recent comps.
 *
 * Returns arv=0 with "low" confidence when there are no comps — callers must
 * check `warnings`/confidence rather than trusting a zero.
 */
export function estimateARV(
  subjectSqft: number,
  comps: Comp[],
): { arv: number; confidence: DealAnalysis["arvConfidence"] } {
  if (!comps.length || subjectSqft <= 0) {
    return { arv: 0, confidence: "low" };
  }

  // Weight each comp: closer distance and larger sqft similarity count more.
  let weightedPpsfSum = 0;
  let weightSum = 0;
  for (const c of comps) {
    if (c.sqft <= 0) continue;
    const ppsf = c.soldPrice / c.sqft;
    const distanceWeight = 1 / (1 + c.distanceMiles); // 1mi→0.5, 0mi→1
    const sizeSimilarity =
      1 / (1 + Math.abs(c.sqft - subjectSqft) / subjectSqft); // closer sqft → ~1
    const weight = distanceWeight * sizeSimilarity;
    weightedPpsfSum += ppsf * weight;
    weightSum += weight;
  }

  if (weightSum === 0) return { arv: 0, confidence: "low" };

  const avgPpsf = weightedPpsfSum / weightSum;
  const arv = Math.round(avgPpsf * subjectSqft);

  // Confidence scales with comp count (more comps → tighter estimate).
  const usableComps = comps.filter((c) => c.sqft > 0).length;
  const confidence: DealAnalysis["arvConfidence"] =
    usableComps >= 5 ? "high" : usableComps >= 3 ? "medium" : "low";

  return { arv, confidence };
}

/** Estimate rehab cost: explicit override wins, else tier × sqft. */
export function estimateRepairs(
  subjectSqft: number,
  tier: RepairTier = "moderate",
  override?: number,
): number {
  if (typeof override === "number" && override >= 0) return Math.round(override);
  return Math.round(REPAIR_COST_PER_SQFT[tier] * Math.max(subjectSqft, 0));
}

/**
 * Max Allowable Offer — the most we can pay the seller and still leave the
 * investor their margin after our assignment fee.
 *
 *   MAO = ARV * arvPercent - repairs - assignmentFee
 */
export function calcMAO(
  arv: number,
  repairs: number,
  arvPercent: number,
  assignmentFee: number,
): number {
  return Math.round(arv * arvPercent - repairs - assignmentFee);
}

/** Full underwrite: comps + repairs → ARV, MAO, spread, and warnings. */
export function analyzeDeal(input: DealAnalysisInput): DealAnalysis {
  const arvPercent = input.arvPercent ?? DEFAULT_ARV_PERCENT;
  const assignmentFee = input.desiredAssignmentFee ?? DEFAULT_ASSIGNMENT_FEE;

  const { arv, confidence } = estimateARV(input.subjectSqft, input.comps);
  const repairEstimate = estimateRepairs(
    input.subjectSqft,
    input.repairTier,
    input.repairEstimateOverride,
  );
  const mao = calcMAO(arv, repairEstimate, arvPercent, assignmentFee);

  // Investor buys at MAO+fee, spends repairs; their equity cushion vs. ARV.
  const investorAllIn = mao + assignmentFee + repairEstimate;
  const investorSpread = Math.round(arv - investorAllIn);

  const warnings: string[] = [];
  if (confidence === "low") {
    warnings.push("Thin comp data — ARV is low-confidence; verify before offering.");
  }
  if (mao <= 0) {
    warnings.push("MAO is zero or negative — no room for a deal at these numbers.");
  }
  if (input.state && RESTRICTED_WHOLESALE_STATES.has(input.state.toUpperCase())) {
    warnings.push(
      `${input.state.toUpperCase()} regulates wholesaling — confirm license/disclosure posture before contracting.`,
    );
  }
  if (repairEstimate > arv * 0.5 && arv > 0) {
    warnings.push("Repairs exceed 50% of ARV — heavy-rehab risk; double-check the scope.");
  }

  return {
    arv,
    arvConfidence: confidence,
    repairEstimate,
    mao,
    arvPercent,
    assignmentFee,
    investorSpread,
    warnings,
  };
}
