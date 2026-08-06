// Wholesale platform configuration.
//
// Starter market defaults + the switch that decides mock vs. live providers.
// Flip WHOLESALE_LIVE_PROVIDERS to true once real API keys are wired.

export const WHOLESALE_CONFIG = {
  /**
   * Launch market: Tampa Bay, FL. Chosen on evidence (see
   * docs/wholesale/COMPETITIVE_RESEARCH.md §3): #1 foreclosure rate among 1M+
   * metros in 2025, deepest cash-buyer / all-cash exit pool nationally, legal
   * without a license with no restrictive 2025 legislation, and open (sunshine)
   * public records for free comps. Runners-up: Jacksonville, FL; Atlanta, GA.
   * Focus single-family distressed (FL condos are cooling).
   */
  primaryMarket: {
    label: "Tampa Bay, FL",
    state: "FL",
    cities: ["Tampa", "St. Petersburg", "Clearwater", "Brandon", "Lakeland"],
  },

  /** Underwriting defaults (overridable per deal). */
  underwriting: {
    arvPercent: 0.7, // the "70% rule"
    defaultAssignmentFee: 10_000,
  },

  /**
   * When false, the app runs entirely on mock adapters (works today, no spend).
   * When true, factories return live provider clients (require API keys in env).
   */
  liveProviders: false,
} as const;

export type WholesaleConfig = typeof WHOLESALE_CONFIG;
