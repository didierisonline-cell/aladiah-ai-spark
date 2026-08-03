// Wholesale platform configuration.
//
// Starter market defaults + the switch that decides mock vs. live providers.
// Flip WHOLESALE_LIVE_PROVIDERS to true once real API keys are wired.

export const WHOLESALE_CONFIG = {
  /** Starter market. Atlanta metro: high deal volume, wholesale-friendly, deep data. */
  primaryMarket: {
    label: "Atlanta Metro, GA",
    state: "GA",
    cities: ["Atlanta", "Marietta", "Decatur", "Stone Mountain", "College Park"],
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
