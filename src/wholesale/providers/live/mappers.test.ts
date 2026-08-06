import { describe, it, expect } from "vitest";
import { mapRawProperty, mapReapiPropertyType, mapRawComp } from "./realEstateApi";
import { mapBatchResult } from "./batchData";
import { rowToLead, type LeadRow } from "../../data/leadRepository";

describe("ReAPI mappers", () => {
  it("maps property type strings to our enum, defaulting safely", () => {
    expect(mapReapiPropertyType("SFR")).toBe("single_family");
    expect(mapReapiPropertyType("Condo")).toBe("condo");
    expect(mapReapiPropertyType(undefined)).toBe("single_family");
    expect(mapReapiPropertyType("something-unknown")).toBe("single_family");
  });

  it("maps a raw property and derives absentee from ownerOccupied=false", () => {
    const p = mapRawProperty({
      id: 42,
      address: { address: "123 Bay St", city: "Tampa", state: "FL", zip: "33602" },
      propertyType: "SFR",
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      equityPercent: 65,
      ownerOccupied: false,
      preForeclosure: true,
    });
    expect(p.id).toBe("42");
    expect(p.address.city).toBe("Tampa");
    expect(p.propertyType).toBe("single_family");
    expect(p.signals.absenteeOwner).toBe(true);
    expect(p.signals.highEquityPct).toBe(65);
    expect(p.signals.preForeclosure).toBe(true);
  });

  it("degrades gracefully on an empty payload", () => {
    const p = mapRawProperty({});
    expect(p.beds).toBe(0);
    expect(p.sqft).toBe(0);
    expect(p.address.line1).toBe("");
  });

  it("maps comps, inheriting subject location when comp omits it", () => {
    const subject = { line1: "123 Bay St", city: "Tampa", state: "FL", zip: "33602" };
    const c = mapRawComp({ lastSalePrice: 300_000, squareFeet: 1500, distance: 0.4 }, subject);
    expect(c.soldPrice).toBe(300_000);
    expect(c.address.city).toBe("Tampa");
    expect(c.distanceMiles).toBe(0.4);
  });
});

describe("BatchData mapper", () => {
  it("normalizes phone types and flags DNC", () => {
    const c = mapBatchResult({
      name: { full: "Jane Doe" },
      phoneNumbers: [
        { number: "8135551234", type: "Mobile", dnc: true },
        { number: "8135555678", type: "LandLine" },
      ],
      emails: ["jane@example.com", { address: "j2@example.com" }],
    });
    expect(c.fullName).toBe("Jane Doe");
    expect(c.phones[0]).toEqual({ number: "8135551234", type: "mobile", dnc: true });
    expect(c.phones[1].type).toBe("landline");
    expect(c.emails).toEqual(["jane@example.com", "j2@example.com"]);
    expect(c.skipTraced).toBe(true);
  });
});

describe("rowToLead", () => {
  it("maps a joined DB row to a domain Lead", () => {
    const row: LeadRow = {
      id: "lead_1",
      stage: "contacted",
      motivation_score: 82,
      temperature: "hot",
      source: "reapi",
      assigned_to: null,
      analysis: null,
      notes: null,
      created_at: "2026-08-01T00:00:00Z",
      updated_at: "2026-08-02T00:00:00Z",
      property: {
        id: "prop_1", line1: "123 Bay St", city: "Tampa", state: "FL", zip: "33602",
        property_type: "single_family", beds: 3, baths: 2, sqft: 1500, lot_sqft: null,
        year_built: 1985, estimated_value: 320_000, last_sale_price: null,
        last_sale_date: null, mortgage_balance: 100_000, signals: { preForeclosure: true },
      },
      owner: { full_name: "Jane Doe", phones: [], emails: ["jane@example.com"], skip_traced: true },
    };
    const lead = rowToLead(row);
    expect(lead.id).toBe("lead_1");
    expect(lead.property.address.city).toBe("Tampa");
    expect(lead.property.signals.preForeclosure).toBe(true);
    expect(lead.owner.skipTraced).toBe(true);
    expect(lead.motivationScore).toBe(82);
  });

  it("handles a null owner (not yet skip-traced)", () => {
    const row = {
      id: "lead_2", stage: "new", motivation_score: 40, temperature: "warm",
      source: null, assigned_to: null, analysis: null, notes: null,
      created_at: "x", updated_at: "y", property: null, owner: null,
    } as unknown as LeadRow;
    const lead = rowToLead(row);
    expect(lead.owner.skipTraced).toBe(false);
    expect(lead.property.propertyType).toBe("single_family");
  });
});
