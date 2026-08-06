// Provider abstraction layer.
//
// Every external dependency sits behind an interface with a mock adapter that
// works today. To go live: implement the same interface against a real API
// (ReAPI, BatchData, Twilio, …) behind the edge proxy and set the edge base URL.
// No UI or business-logic code changes.

import type { Address, OwnerContact, Property, PropertyType } from "../types";
import { hasLiveProviders } from "../env";
import {
  MockPropertyDataProvider,
  MockSkipTraceProvider,
  MockCommsProvider,
} from "./mock";
import { RealEstateApiPropertyProvider } from "./live/realEstateApi";
import { BatchDataSkipTraceProvider } from "./live/batchData";

// ---------------------------------------------------------------------------
// Property data — list building & comps
// ---------------------------------------------------------------------------

export interface PropertyListFilter {
  state: string;
  cities?: string[];
  propertyTypes?: PropertyType[];
  /** Distress stacks: e.g. ["preForeclosure","highEquity"] (intersection). */
  signals?: string[];
  minEquityPct?: number;
  limit?: number;
}

export interface PropertyDataProvider {
  readonly name: string;
  /** Pull a list of candidate properties matching distress filters. */
  searchProperties(filter: PropertyListFilter): Promise<Property[]>;
  /** Comparable sales near a subject address, for ARV. */
  getComps(address: Address, sqft: number): Promise<import("../types").Comp[]>;
}

// ---------------------------------------------------------------------------
// Skip trace — owner contact enrichment
// ---------------------------------------------------------------------------

export interface SkipTraceProvider {
  readonly name: string;
  skipTrace(property: Property): Promise<OwnerContact>;
}

// ---------------------------------------------------------------------------
// Comms — SMS / voice, with compliance gates baked in
// ---------------------------------------------------------------------------

export interface SendResult {
  ok: boolean;
  channel: "sms" | "call";
  blockedReason?: "dnc" | "no_consent" | "quiet_hours" | "a2p_unregistered";
  providerMessageId?: string;
}

export interface CommsProvider {
  readonly name: string;
  /** A2P 10DLC registration status — SMS is blocked until "approved". */
  readonly registrationStatus: "unregistered" | "pending" | "approved";
  sendSms(to: string, body: string, opts: { consent: boolean; dnc: boolean; localHour: number }): Promise<SendResult>;
  startCall(to: string, opts: { dnc: boolean; localHour: number }): Promise<SendResult>;
}

// ---------------------------------------------------------------------------
// Factories — swap point between mock and live
// ---------------------------------------------------------------------------

// Live adapters are used automatically once the edge proxy is configured
// (VITE_WHOLESALE_EDGE_BASE). Until then everything runs on mocks — no spend,
// works today. See src/wholesale/env.ts.

export function getPropertyDataProvider(): PropertyDataProvider {
  return hasLiveProviders()
    ? new RealEstateApiPropertyProvider()
    : new MockPropertyDataProvider();
}

export function getSkipTraceProvider(): SkipTraceProvider {
  return hasLiveProviders()
    ? new BatchDataSkipTraceProvider()
    : new MockSkipTraceProvider();
}

export function getCommsProvider(): CommsProvider {
  // Live comms (Twilio A2P 10DLC) lands in Phase 2 with the compliance engine.
  // Until then the mock enforces the same TCPA/DNC/A2P gates so logic is real.
  return new MockCommsProvider();
}
