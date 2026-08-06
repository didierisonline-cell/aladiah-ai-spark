// Lead persistence layer.
//
// The UI/services talk to a LeadRepository interface, never to Supabase
// directly — same abstraction discipline as the provider layer. Default is an
// in-memory repo (works today). A Supabase-backed repo activates automatically
// once a dedicated wholesale project is configured (see env.ts) AND the schema
// in docs/wholesale/schema.sql has been applied by a human.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { DealAnalysis, Lead, LeadStage, OwnerContact, Property } from "../types";
import { WHOLESALE_ENV, hasSupabase } from "../env";

export interface LeadRepository {
  readonly kind: "memory" | "supabase";
  list(): Promise<Lead[]>;
  get(id: string): Promise<Lead | null>;
  upsert(lead: Lead): Promise<Lead>;
  setStage(id: string, stage: LeadStage): Promise<void>;
}

// ---------------------------------------------------------------------------
// In-memory (default) — seeded by the caller; survives for the session only.
// ---------------------------------------------------------------------------

export class InMemoryLeadRepository implements LeadRepository {
  readonly kind = "memory" as const;
  private store = new Map<string, Lead>();

  constructor(seed: Lead[] = []) {
    for (const l of seed) this.store.set(l.id, l);
  }

  async list(): Promise<Lead[]> {
    return [...this.store.values()].sort((a, b) => b.motivationScore - a.motivationScore);
  }
  async get(id: string): Promise<Lead | null> {
    return this.store.get(id) ?? null;
  }
  async upsert(lead: Lead): Promise<Lead> {
    this.store.set(lead.id, lead);
    return lead;
  }
  async setStage(id: string, stage: LeadStage): Promise<void> {
    const l = this.store.get(id);
    if (l) this.store.set(id, { ...l, stage });
  }
}

// ---------------------------------------------------------------------------
// Supabase-backed — requires the applied schema + a dedicated project.
// ---------------------------------------------------------------------------

/** Row shape returned by the nested select below. */
export interface LeadRow {
  id: string;
  stage: LeadStage;
  motivation_score: number;
  temperature: Lead["temperature"];
  source: string | null;
  assigned_to: string | null;
  analysis: DealAnalysis | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  property: PropertyRow | null;
  owner: OwnerRow | null;
}
interface PropertyRow {
  id: string; line1: string; city: string; state: string; zip: string;
  property_type: Property["propertyType"]; beds: number | null; baths: number | null;
  sqft: number | null; lot_sqft: number | null; year_built: number | null;
  estimated_value: number | null; last_sale_price: number | null;
  last_sale_date: string | null; mortgage_balance: number | null;
  signals: Property["signals"];
}
interface OwnerRow {
  full_name: string | null; phones: OwnerContact["phones"];
  emails: string[]; skip_traced: boolean;
}

/** Pure DB→domain mapping (unit-tested). */
export function rowToLead(row: LeadRow): Lead {
  const p = row.property;
  const property: Property = {
    id: p?.id ?? "",
    address: { line1: p?.line1 ?? "", city: p?.city ?? "", state: p?.state ?? "", zip: p?.zip ?? "" },
    propertyType: p?.property_type ?? "single_family",
    beds: p?.beds ?? 0,
    baths: p?.baths ?? 0,
    sqft: p?.sqft ?? 0,
    lotSqft: p?.lot_sqft ?? undefined,
    yearBuilt: p?.year_built ?? undefined,
    estimatedValue: p?.estimated_value ?? undefined,
    lastSalePrice: p?.last_sale_price ?? undefined,
    lastSaleDate: p?.last_sale_date ?? undefined,
    mortgageBalance: p?.mortgage_balance ?? undefined,
    signals: p?.signals ?? {},
  };
  const owner: OwnerContact = row.owner
    ? {
        fullName: row.owner.full_name ?? "",
        phones: row.owner.phones ?? [],
        emails: row.owner.emails ?? [],
        skipTraced: row.owner.skip_traced,
      }
    : { fullName: "", phones: [], emails: [], skipTraced: false };

  return {
    id: row.id,
    property,
    owner,
    stage: row.stage,
    motivationScore: row.motivation_score,
    temperature: row.temperature,
    source: row.source ?? "",
    assignedTo: row.assigned_to ?? undefined,
    analysis: row.analysis ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const LEAD_SELECT =
  "*, property:wholesale_properties(*), owner:wholesale_owners(*)";

export class SupabaseLeadRepository implements LeadRepository {
  readonly kind = "supabase" as const;
  private client: SupabaseClient;

  constructor(client?: SupabaseClient) {
    this.client =
      client ?? createClient(WHOLESALE_ENV.supabaseUrl, WHOLESALE_ENV.supabaseAnonKey);
  }

  async list(): Promise<Lead[]> {
    const { data, error } = await this.client
      .from("wholesale_leads")
      .select(LEAD_SELECT)
      .order("motivation_score", { ascending: false });
    if (error) throw error;
    return (data as unknown as LeadRow[]).map(rowToLead);
  }

  async get(id: string): Promise<Lead | null> {
    const { data, error } = await this.client
      .from("wholesale_leads")
      .select(LEAD_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToLead(data as unknown as LeadRow) : null;
  }

  async upsert(lead: Lead): Promise<Lead> {
    // Persist the lead row (property/owner rows are managed by their own
    // ingestion path in Phase 1; here we write the lead + snapshotted analysis).
    const { error } = await this.client.from("wholesale_leads").upsert({
      id: lead.id,
      stage: lead.stage,
      motivation_score: lead.motivationScore,
      temperature: lead.temperature,
      source: lead.source,
      assigned_to: lead.assignedTo ?? null,
      analysis: lead.analysis ?? null,
      notes: lead.notes ?? null,
      updated_at: lead.updatedAt,
    });
    if (error) throw error;
    return lead;
  }

  async setStage(id: string, stage: LeadStage): Promise<void> {
    const { error } = await this.client
      .from("wholesale_leads")
      .update({ stage })
      .eq("id", id);
    if (error) throw error;
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/** Returns the Supabase repo when configured, else an in-memory repo (seeded). */
export function getLeadRepository(seed: Lead[] = []): LeadRepository {
  return hasSupabase() ? new SupabaseLeadRepository() : new InMemoryLeadRepository(seed);
}
