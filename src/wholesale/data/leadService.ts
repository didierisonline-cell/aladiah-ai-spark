// Lead service — orchestrates provider → score → lead, and underwrites deals.
// This is the seam the UI talks to; it never touches providers directly.

import type { Lead, LeadStage, Property } from "../types";
import { scoreLead } from "../lib/leadScoring";
import { analyzeDeal } from "../lib/dealAnalyzer";
import {
  getPropertyDataProvider,
  getSkipTraceProvider,
  type PropertyListFilter,
} from "../providers";
import { WHOLESALE_CONFIG } from "../config";

// Spread freshly-sourced leads across early pipeline stages for a realistic board.
const SEED_STAGES: LeadStage[] = [
  "new", "new", "new", "skip_traced", "skip_traced",
  "contacted", "contacted", "qualifying", "appointment",
  "under_contract", "marketing", "closed",
];

function propertyToLead(property: Property, index: number): Lead {
  const { score, temperature } = scoreLead(property.signals);
  const now = "2026-08-03T12:00:00.000Z";
  return {
    id: `lead_${property.id}`,
    property,
    owner: {
      fullName: "(not skip-traced)",
      phones: [],
      emails: [],
      skipTraced: false,
    },
    stage: SEED_STAGES[index % SEED_STAGES.length],
    motivationScore: score,
    temperature,
    source: "mock-list:distressed-stack",
    createdAt: now,
    updatedAt: now,
  };
}

/** Source a batch of leads for the primary market, scored and stage-seeded. */
export async function sourceLeads(
  overrides: Partial<PropertyListFilter> = {},
): Promise<Lead[]> {
  const provider = getPropertyDataProvider();
  const filter: PropertyListFilter = {
    state: WHOLESALE_CONFIG.primaryMarket.state,
    cities: WHOLESALE_CONFIG.primaryMarket.cities,
    limit: 24,
    ...overrides,
  };
  const properties = await provider.searchProperties(filter);
  return properties
    .map(propertyToLead)
    .sort((a, b) => b.motivationScore - a.motivationScore);
}

/** Enrich a lead with owner contact via the skip-trace provider. */
export async function skipTraceLead(lead: Lead): Promise<Lead> {
  const provider = getSkipTraceProvider();
  const owner = await provider.skipTrace(lead.property);
  return {
    ...lead,
    owner,
    stage: lead.stage === "new" ? "skip_traced" : lead.stage,
    updatedAt: "2026-08-03T12:00:00.000Z",
  };
}

/** Underwrite a lead: pull comps and run the deal analyzer. */
export async function underwriteLead(lead: Lead): Promise<Lead> {
  const provider = getPropertyDataProvider();
  const comps = await provider.getComps(lead.property.address, lead.property.sqft);
  const analysis = analyzeDeal({
    subjectSqft: lead.property.sqft,
    comps,
    repairTier: "moderate",
    arvPercent: WHOLESALE_CONFIG.underwriting.arvPercent,
    desiredAssignmentFee: WHOLESALE_CONFIG.underwriting.defaultAssignmentFee,
    state: lead.property.address.state,
  });
  return { ...lead, analysis, updatedAt: "2026-08-03T12:00:00.000Z" };
}
