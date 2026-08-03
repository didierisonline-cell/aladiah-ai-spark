// Lead scoring — turn distress signals into an explainable motivation score.
//
// Deterministic and transparent on purpose: an operator (or auditor) can see
// exactly why a lead scored 82. No black box. ML scoring comes in a later phase,
// trained on real closed-deal outcomes — this rule-based model is the baseline.

import type { DistressSignals, LeadTemperature } from "../types";

/** Weighted contribution of each signal toward the 0..100 motivation score. */
export const SIGNAL_WEIGHTS: Record<string, number> = {
  preForeclosure: 25, // strong urgency
  taxDelinquent: 15,
  vacant: 15,
  probate: 15,
  codeViolation: 10,
  divorce: 10,
  bankruptcy: 10,
  liens: 8,
  tiredLandlord: 10,
  absenteeOwner: 8,
};

export interface ScoredReason {
  signal: string;
  points: number;
}

export interface LeadScore {
  score: number; // 0..100
  temperature: LeadTemperature;
  reasons: ScoredReason[]; // why it scored what it did
}

/**
 * Score a lead from its distress signals plus equity/tenure.
 * High equity matters because it means the seller *can* discount — a motivated
 * seller with no equity is a dead end.
 */
export function scoreLead(signals: DistressSignals): LeadScore {
  const reasons: ScoredReason[] = [];
  let raw = 0;

  for (const [key, weight] of Object.entries(SIGNAL_WEIGHTS)) {
    if (signals[key as keyof DistressSignals]) {
      raw += weight;
      reasons.push({ signal: key, points: weight });
    }
  }

  // Equity bonus: up to +15 for owners with room to discount.
  if (typeof signals.highEquityPct === "number") {
    const equityPoints = Math.round((Math.min(signals.highEquityPct, 100) / 100) * 15);
    if (equityPoints > 0) {
      raw += equityPoints;
      reasons.push({ signal: "highEquity", points: equityPoints });
    }
  }

  // Long tenure often correlates with tired/ready-to-sell owners: +5 at 15+ yrs.
  if (typeof signals.yearsOwned === "number" && signals.yearsOwned >= 15) {
    raw += 5;
    reasons.push({ signal: "longTenure", points: 5 });
  }

  const score = Math.max(0, Math.min(100, Math.round(raw)));
  const temperature: LeadTemperature =
    score >= 70 ? "hot" : score >= 40 ? "warm" : "cold";

  reasons.sort((a, b) => b.points - a.points);
  return { score, temperature, reasons };
}
