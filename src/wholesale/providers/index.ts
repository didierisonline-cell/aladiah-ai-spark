// Provider abstraction layer.
//
// Every external dependency sits behind an interface with a mock adapter that
// works today. To go live: implement the same interface against a real API
// (ATTOM, BatchData, Twilio, …), add keys to env, and flip config.liveProviders.
// No UI or business-logic code changes.

import type { Address, OwnerContact, Property, PropertyType } from "../types";
import { WHOLESALE_CONFIG } from "../config";
import {
  MockPropertyDataProvider,
  MockSkipTraceProvider,
  MockCommsProvider,
} from "./mock";

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

export function getPropertyDataProvider(): PropertyDataProvider {
  if (WHOLESALE_CONFIG.liveProviders) {
    throw new Error(
      "Live property-data provider not wired yet. Implement PropertyDataProvider (e.g. ATTOM/BatchData) and register it here.",
    );
  }
  return new MockPropertyDataProvider();
}

export function getSkipTraceProvider(): SkipTraceProvider {
  if (WHOLESALE_CONFIG.liveProviders) {
    throw new Error(
      "Live skip-trace provider not wired yet. Implement SkipTraceProvider (e.g. BatchSkipTracing/IDI) and register it here.",
    );
  }
  return new MockSkipTraceProvider();
}

export function getCommsProvider(): CommsProvider {
  if (WHOLESALE_CONFIG.liveProviders) {
    throw new Error(
      "Live comms provider not wired yet. Implement CommsProvider (e.g. Twilio A2P 10DLC) and register it here.",
    );
  }
  return new MockCommsProvider();
}
