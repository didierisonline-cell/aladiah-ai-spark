// Mock provider adapters — realistic, deterministic data so the whole app
// works today with zero external spend. Each implements the same interface a
// live provider will, so swapping to real APIs is drop-in.

import type {
  Address,
  Comp,
  OwnerContact,
  Property,
  PropertyType,
} from "../types";
import type {
  CommsProvider,
  PropertyDataProvider,
  PropertyListFilter,
  SendResult,
  SkipTraceProvider,
} from "./index";

// Small deterministic PRNG so mock data is stable across renders/reloads.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STREETS = [
  "Peachtree St", "Oak Ave", "Maple Dr", "Elm St", "Sycamore Ln",
  "Cedar Ct", "Dogwood Way", "Magnolia Blvd", "Pine St", "Birch Rd",
];
const FIRST = ["James", "Mary", "Robert", "Patricia", "John", "Linda", "Michael", "Barbara"];
const LAST = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
const TYPES: PropertyType[] = ["single_family", "single_family", "townhouse", "multi_family", "condo"];

// Rough ZIP + area-code prefixes per state so mock data looks local.
const ZIP_PREFIX: Record<string, string> = { FL: "336", GA: "303", TX: "770", OH: "441" };
const AREA_CODE: Record<string, string> = { FL: "813", GA: "404", TX: "713", OH: "216" };
const zipFor = (state: string) => ZIP_PREFIX[state.toUpperCase()] ?? "336";
const areaFor = (state: string) => AREA_CODE[state.toUpperCase()] ?? "813";

export class MockPropertyDataProvider implements PropertyDataProvider {
  readonly name = "mock-property-data";

  async searchProperties(filter: PropertyListFilter): Promise<Property[]> {
    const cities = filter.cities?.length
      ? filter.cities
      : ["Atlanta", "Marietta", "Decatur"];
    const count = Math.min(filter.limit ?? 12, 50);
    const rng = mulberry32(hashStr(filter.state + cities.join() + count));
    const props: Property[] = [];

    for (let i = 0; i < count; i++) {
      const city = cities[Math.floor(rng() * cities.length)];
      const sqft = 900 + Math.floor(rng() * 2600);
      const value = Math.round((120_000 + rng() * 380_000) / 1000) * 1000;
      const equityPct = Math.floor(rng() * 100);
      const address: Address = {
        line1: `${100 + Math.floor(rng() * 8900)} ${STREETS[Math.floor(rng() * STREETS.length)]}`,
        city,
        state: filter.state,
        zip: `${zipFor(filter.state)}${(10 + Math.floor(rng() * 89)).toString()}`,
      };
      props.push({
        id: `prop_${filter.state}_${i}_${Math.floor(rng() * 1e6)}`,
        address,
        propertyType: TYPES[Math.floor(rng() * TYPES.length)],
        beds: 2 + Math.floor(rng() * 4),
        baths: 1 + Math.floor(rng() * 3),
        sqft,
        yearBuilt: 1950 + Math.floor(rng() * 70),
        estimatedValue: value,
        mortgageBalance: Math.round(value * (1 - equityPct / 100)),
        signals: {
          preForeclosure: rng() < 0.25,
          taxDelinquent: rng() < 0.3,
          vacant: rng() < 0.2,
          absenteeOwner: rng() < 0.4,
          highEquityPct: equityPct,
          codeViolation: rng() < 0.15,
          probate: rng() < 0.12,
          divorce: rng() < 0.1,
          tiredLandlord: rng() < 0.18,
          liens: rng() < 0.15,
          yearsOwned: Math.floor(rng() * 30),
        },
      });
    }

    // Apply signal-stack filter (intersection) if requested.
    let out = props;
    if (filter.signals?.length) {
      out = out.filter((p) =>
        filter.signals!.every((s) => Boolean((p.signals as Record<string, unknown>)[s])),
      );
    }
    if (typeof filter.minEquityPct === "number") {
      out = out.filter((p) => (p.signals.highEquityPct ?? 0) >= filter.minEquityPct!);
    }
    if (filter.propertyTypes?.length) {
      out = out.filter((p) => filter.propertyTypes!.includes(p.propertyType));
    }
    return out;
  }

  async getComps(address: Address, sqft: number): Promise<Comp[]> {
    const rng = mulberry32(hashStr(address.line1 + address.zip + sqft));
    const basePpsf = 140 + rng() * 120; // $140–260/sqft market
    const n = 4 + Math.floor(rng() * 3);
    return Array.from({ length: n }, (_, i) => {
      const compSqft = Math.round(sqft * (0.85 + rng() * 0.3));
      const ppsf = basePpsf * (0.92 + rng() * 0.16);
      return {
        address: {
          line1: `${100 + Math.floor(rng() * 8900)} ${STREETS[Math.floor(rng() * STREETS.length)]}`,
          city: address.city,
          state: address.state,
          zip: address.zip,
        },
        soldPrice: Math.round((compSqft * ppsf) / 500) * 500,
        soldDate: `2026-0${1 + (i % 8)}-15`,
        sqft: compSqft,
        beds: 3,
        baths: 2,
        distanceMiles: Math.round(rng() * 15) / 10,
      };
    });
  }
}

export class MockSkipTraceProvider implements SkipTraceProvider {
  readonly name = "mock-skip-trace";

  async skipTrace(property: Property): Promise<OwnerContact> {
    const rng = mulberry32(hashStr(property.id));
    const name = `${FIRST[Math.floor(rng() * FIRST.length)]} ${LAST[Math.floor(rng() * LAST.length)]}`;
    const area = areaFor(property.address.state);
    const mkPhone = () =>
      `${area}${Math.floor(1000000 + rng() * 8999999).toString().slice(0, 7)}`;
    return {
      fullName: name,
      phones: [
        { number: mkPhone(), type: "mobile", dnc: rng() < 0.2 },
        { number: mkPhone(), type: "landline", dnc: rng() < 0.3 },
      ],
      emails: [`${name.toLowerCase().replace(/\s+/g, ".")}@example.com`],
      skipTraced: true,
    };
  }
}

export class MockCommsProvider implements CommsProvider {
  readonly name = "mock-comms";
  // Mock brand is "approved" so the demo can send; real Twilio starts "pending".
  readonly registrationStatus = "approved" as const;

  async sendSms(
    _to: string,
    _body: string,
    opts: { consent: boolean; dnc: boolean; localHour: number },
  ): Promise<SendResult> {
    const blocked = this.gate(opts);
    if (blocked) return { ok: false, channel: "sms", blockedReason: blocked };
    return { ok: true, channel: "sms", providerMessageId: `sms_${Date.now()}` };
  }

  async startCall(
    _to: string,
    opts: { dnc: boolean; localHour: number },
  ): Promise<SendResult> {
    const blocked = this.gate({ ...opts, consent: true });
    if (blocked) return { ok: false, channel: "call", blockedReason: blocked };
    return { ok: true, channel: "call", providerMessageId: `call_${Date.now()}` };
  }

  /** Shared compliance gate: A2P, consent, DNC, TCPA quiet hours (8am–9pm). */
  private gate(opts: { consent: boolean; dnc: boolean; localHour: number }): SendResult["blockedReason"] | null {
    if (this.registrationStatus !== "approved") return "a2p_unregistered";
    if (!opts.consent) return "no_consent";
    if (opts.dnc) return "dnc";
    if (opts.localHour < 8 || opts.localHour >= 21) return "quiet_hours";
    return null;
  }
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
