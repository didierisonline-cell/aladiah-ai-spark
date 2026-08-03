// Wholesale Real Estate — domain types.
// Single source of truth for the shapes that flow through the whole pipeline.

// ---------------------------------------------------------------------------
// Property & ownership
// ---------------------------------------------------------------------------

export interface Address {
  line1: string;
  city: string;
  state: string; // 2-letter
  zip: string;
}

export type PropertyType =
  | "single_family"
  | "multi_family"
  | "townhouse"
  | "condo"
  | "mobile"
  | "land";

/** Distress / motivation signals — the raw evidence lead scoring runs on. */
export interface DistressSignals {
  preForeclosure?: boolean;
  taxDelinquent?: boolean;
  vacant?: boolean;
  absenteeOwner?: boolean;
  highEquityPct?: number; // 0..100, owner equity as % of value
  codeViolation?: boolean;
  probate?: boolean;
  divorce?: boolean;
  tiredLandlord?: boolean; // e.g. eviction filings / long tenure rental
  liens?: boolean;
  bankruptcy?: boolean;
  yearsOwned?: number;
}

export interface Property {
  id: string;
  address: Address;
  propertyType: PropertyType;
  beds: number;
  baths: number;
  sqft: number;
  lotSqft?: number;
  yearBuilt?: number;
  /** Provider's automated value estimate (AVM), if available. */
  estimatedValue?: number;
  lastSalePrice?: number;
  lastSaleDate?: string; // ISO
  mortgageBalance?: number;
  signals: DistressSignals;
}

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

export interface OwnerContact {
  fullName: string;
  phones: { number: string; type: "mobile" | "landline" | "voip"; dnc: boolean }[];
  emails: string[];
  mailingAddress?: Address;
  /** Set once a skip trace has run against this owner. */
  skipTraced: boolean;
}

// ---------------------------------------------------------------------------
// Lead pipeline
// ---------------------------------------------------------------------------

/** The 9 stages of the wholesale value chain — mirrors the Kanban board. */
export type LeadStage =
  | "new" // sourced, not yet worked
  | "skip_traced"
  | "contacted"
  | "qualifying" // in conversation
  | "appointment"
  | "under_contract"
  | "marketing" // dispo to buyers
  | "assigned" // buyer signed assignment
  | "closed" // funded, paid
  | "dead"; // dead lead / lost

export type LeadTemperature = "hot" | "warm" | "cold";

export interface Lead {
  id: string;
  property: Property;
  owner: OwnerContact;
  stage: LeadStage;
  /** 0..100, from lib/leadScoring — deterministic and explainable. */
  motivationScore: number;
  temperature: LeadTemperature;
  source: string; // which list/provider surfaced it
  assignedTo?: string; // acquisitions rep (human or AI)
  createdAt: string; // ISO
  updatedAt: string; // ISO
  notes?: string;
  /** Underwriting result, populated once the deal is analyzed. */
  analysis?: DealAnalysis;
}

// ---------------------------------------------------------------------------
// Deal analysis (the money math)
// ---------------------------------------------------------------------------

export interface Comp {
  address: Address;
  soldPrice: number;
  soldDate: string; // ISO
  sqft: number;
  beds: number;
  baths: number;
  distanceMiles: number;
}

export type RepairTier = "cosmetic" | "moderate" | "heavy" | "gut";

export interface DealAnalysisInput {
  subjectSqft: number;
  comps: Comp[];
  repairTier?: RepairTier;
  /** Overrides the tier-based estimate if the operator has line-item numbers. */
  repairEstimateOverride?: number;
  /** Fraction of ARV an investor will pay all-in (the "70% rule" → 0.70). */
  arvPercent?: number;
  /** Our target assignment fee (the spread we make). */
  desiredAssignmentFee?: number;
  /** State code — drives the wholesaling-legality flag. */
  state?: string;
}

export interface DealAnalysis {
  arv: number; // After Repair Value (from comps)
  arvConfidence: "low" | "medium" | "high";
  repairEstimate: number;
  /** Max Allowable Offer = ARV*arvPercent - repairs - assignmentFee. */
  mao: number;
  arvPercent: number;
  assignmentFee: number;
  /** What the end investor nets vs. ARV after our fee + repairs. */
  investorSpread: number;
  /** Non-blocking warnings (thin comps, restricted state, negative MAO, …). */
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Dispo — cash buyers
// ---------------------------------------------------------------------------

export interface Buyer {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  /** Buy-box: what this investor wants. Used for auto-matching new deals. */
  buyBox: {
    states: string[];
    cities?: string[];
    propertyTypes: PropertyType[];
    minBeds?: number;
    maxPrice?: number;
    minRoiPct?: number;
    strategy: ("flip" | "buy_hold" | "brrrr" | "wholesale")[];
  };
  proofOfFunds: boolean;
  dealsClosedWithUs: number;
  reliabilityScore: number; // 0..100 — closes-what-they-sign reputation
  createdAt: string;
}
