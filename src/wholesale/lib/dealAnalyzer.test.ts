import { describe, it, expect } from "vitest";
import {
  analyzeDeal,
  calcMAO,
  estimateARV,
  estimateRepairs,
  DEFAULT_ARV_PERCENT,
} from "./dealAnalyzer";
import type { Comp } from "../types";

const comp = (soldPrice: number, sqft: number, distanceMiles = 0.5): Comp => ({
  address: { line1: "x", city: "c", state: "GA", zip: "30301" },
  soldPrice,
  soldDate: "2026-06-01",
  sqft,
  beds: 3,
  baths: 2,
  distanceMiles,
});

describe("estimateARV", () => {
  it("returns 0/low with no comps", () => {
    expect(estimateARV(1500, [])).toEqual({ arv: 0, confidence: "low" });
  });

  it("prices a uniform market at the comp price-per-sqft", () => {
    // All comps at $200/sqft → 1500 sqft subject → $300k.
    const comps = [comp(400_000, 2000), comp(300_000, 1500), comp(200_000, 1000)];
    const { arv } = estimateARV(1500, comps);
    expect(arv).toBe(300_000);
  });

  it("raises confidence with more comps", () => {
    const many = Array.from({ length: 5 }, () => comp(300_000, 1500));
    expect(estimateARV(1500, many).confidence).toBe("high");
    expect(estimateARV(1500, [comp(300_000, 1500)]).confidence).toBe("low");
  });
});

describe("estimateRepairs", () => {
  it("uses tier × sqft", () => {
    expect(estimateRepairs(1500, "moderate")).toBe(45_000); // 30 * 1500
    expect(estimateRepairs(1500, "gut")).toBe(112_500); // 75 * 1500
  });
  it("honors an explicit override", () => {
    expect(estimateRepairs(1500, "gut", 20_000)).toBe(20_000);
  });
});

describe("calcMAO", () => {
  it("applies MAO = ARV*pct - repairs - fee", () => {
    // 300k*0.7 - 45k - 10k = 210k - 55k = 155k
    expect(calcMAO(300_000, 45_000, DEFAULT_ARV_PERCENT, 10_000)).toBe(155_000);
  });
});

describe("analyzeDeal", () => {
  it("produces a coherent underwrite end-to-end", () => {
    const r = analyzeDeal({
      subjectSqft: 1500,
      comps: [comp(300_000, 1500), comp(400_000, 2000), comp(200_000, 1000)],
      repairTier: "moderate",
      desiredAssignmentFee: 10_000,
    });
    expect(r.arv).toBe(300_000);
    expect(r.repairEstimate).toBe(45_000);
    expect(r.mao).toBe(155_000);
    // investor all-in = 155k + 10k + 45k = 210k; spread vs 300k ARV = 90k
    expect(r.investorSpread).toBe(90_000);
  });

  it("warns on a negative MAO deal", () => {
    const r = analyzeDeal({
      subjectSqft: 1000,
      comps: [comp(100_000, 1000)],
      repairTier: "gut",
      desiredAssignmentFee: 20_000,
    });
    // 100k*0.7 - 75k - 20k = 70k - 95k = -25k
    expect(r.mao).toBeLessThan(0);
    expect(r.warnings.some((w) => w.includes("MAO"))).toBe(true);
  });

  it("flags restricted wholesaling states", () => {
    const r = analyzeDeal({
      subjectSqft: 1500,
      comps: [comp(300_000, 1500)],
      state: "IL",
    });
    expect(r.warnings.some((w) => w.includes("IL"))).toBe(true);
  });
});
