// Live property-data adapter — RealEstateAPI (ReAPI), the chosen primary vendor
// (see docs/wholesale/COMPETITIVE_RESEARCH.md §4).
//
// It calls OUR edge-function proxy (which injects the secret ReAPI key
// server-side) — the frontend never holds the key. Response mapping is a pure,
// unit-tested function so we can verify the vendor→domain shape without network.
//
// NOTE: ReAPI endpoint paths and exact field names must be confirmed against
// current ReAPI docs before enabling in production. The mappers below are
// defensive (optional chaining + fallbacks) so partial payloads degrade
// gracefully rather than throw.

import type { Address, Comp, Property, PropertyType } from "../../types";
import type { PropertyDataProvider, PropertyListFilter } from "../index";
import { WHOLESALE_ENV } from "../../env";

// Shape of the raw JSON we expect back from ReAPI (via our proxy). Loose on
// purpose — the vendor returns many more fields; we map only what we use.
export interface RawReapiProperty {
  id?: string | number;
  address?: { address?: string; city?: string; state?: string; zip?: string };
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSquareFeet?: number;
  yearBuilt?: number;
  estimatedValue?: number;
  lastSalePrice?: number;
  lastSaleDate?: string;
  openMortgageBalance?: number;
  equityPercent?: number;
  // distress flags
  preForeclosure?: boolean;
  taxLien?: boolean;
  vacant?: boolean;
  absenteeOwner?: boolean;
  ownerOccupied?: boolean;
  yearsOwned?: number;
}

const PROPERTY_TYPE_MAP: Record<string, PropertyType> = {
  SFR: "single_family",
  "SINGLE FAMILY": "single_family",
  MFR: "multi_family",
  "MULTI FAMILY": "multi_family",
  TOWNHOUSE: "townhouse",
  CONDO: "condo",
  MOBILE: "mobile",
  LAND: "land",
};

export function mapReapiPropertyType(raw?: string): PropertyType {
  if (!raw) return "single_family";
  return PROPERTY_TYPE_MAP[raw.toUpperCase()] ?? "single_family";
}

/** Pure vendor→domain mapping. Unit-tested; safe on partial payloads. */
export function mapRawProperty(raw: RawReapiProperty): Property {
  const address: Address = {
    line1: raw.address?.address ?? "",
    city: raw.address?.city ?? "",
    state: raw.address?.state ?? "",
    zip: raw.address?.zip ?? "",
  };
  return {
    id: String(raw.id ?? `${address.line1}-${address.zip}`),
    address,
    propertyType: mapReapiPropertyType(raw.propertyType),
    beds: raw.bedrooms ?? 0,
    baths: raw.bathrooms ?? 0,
    sqft: raw.squareFeet ?? 0,
    lotSqft: raw.lotSquareFeet,
    yearBuilt: raw.yearBuilt,
    estimatedValue: raw.estimatedValue,
    lastSalePrice: raw.lastSalePrice,
    lastSaleDate: raw.lastSaleDate,
    mortgageBalance: raw.openMortgageBalance,
    signals: {
      preForeclosure: raw.preForeclosure,
      taxDelinquent: raw.taxLien,
      vacant: raw.vacant,
      absenteeOwner: raw.absenteeOwner ?? (raw.ownerOccupied === false ? true : undefined),
      highEquityPct: raw.equityPercent,
      yearsOwned: raw.yearsOwned,
    },
  };
}

export interface RawReapiComp {
  address?: { address?: string; city?: string; state?: string; zip?: string };
  lastSalePrice?: number;
  lastSaleDate?: string;
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
  distance?: number;
}

export function mapRawComp(raw: RawReapiComp, subject: Address): Comp {
  return {
    address: {
      line1: raw.address?.address ?? "",
      city: raw.address?.city ?? subject.city,
      state: raw.address?.state ?? subject.state,
      zip: raw.address?.zip ?? subject.zip,
    },
    soldPrice: raw.lastSalePrice ?? 0,
    soldDate: raw.lastSaleDate ?? "",
    sqft: raw.squareFeet ?? 0,
    beds: raw.bedrooms ?? 0,
    baths: raw.bathrooms ?? 0,
    distanceMiles: raw.distance ?? 0,
  };
}

/** POST to our edge proxy, which forwards to ReAPI with the secret key. */
async function callProxy<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${WHOLESALE_ENV.edgeBase}/reapi-proxy`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path, body }),
  });
  if (!res.ok) {
    throw new Error(`ReAPI proxy error ${res.status}: ${await res.text().catch(() => "")}`);
  }
  return (await res.json()) as T;
}

export class RealEstateApiPropertyProvider implements PropertyDataProvider {
  readonly name = "realestateapi";

  async searchProperties(filter: PropertyListFilter): Promise<Property[]> {
    // Map our filter to ReAPI's PropertySearch body. Field names per ReAPI docs.
    const body = {
      state: filter.state,
      city: filter.cities?.[0],
      property_type: filter.propertyTypes?.[0],
      size: filter.limit ?? 24,
      // Distress stacks → ReAPI boolean filters (confirm names against docs):
      ...(filter.signals?.includes("preForeclosure") && { pre_foreclosure: true }),
      ...(filter.signals?.includes("vacant") && { vacant: true }),
      ...(filter.signals?.includes("absenteeOwner") && { absentee_owner: true }),
      ...(typeof filter.minEquityPct === "number" && { equity_percent_min: filter.minEquityPct }),
    };
    const raw = await callProxy<{ data?: RawReapiProperty[] }>("PropertySearch", body);
    return (raw.data ?? []).map(mapRawProperty);
  }

  async getComps(address: Address, sqft: number): Promise<Comp[]> {
    const raw = await callProxy<{ data?: RawReapiComp[] }>("PropertyComps", {
      address: address.line1,
      city: address.city,
      state: address.state,
      zip: address.zip,
      square_feet: sqft,
    });
    return (raw.data ?? []).map((c) => mapRawComp(c, address));
  }
}
