// Live skip-trace adapter — BatchData (chosen primary, see COMPETITIVE_RESEARCH §4).
// Calls our edge proxy (secret key server-side); pure mapper is unit-tested.
//
// NOTE: confirm BatchData's skip-trace request/response schema against current
// docs before enabling. The mapper is defensive against partial payloads.

import type { OwnerContact, Property } from "../../types";
import type { SkipTraceProvider } from "../index";
import { WHOLESALE_ENV } from "../../env";

export interface RawBatchPhone {
  number?: string;
  type?: string; // "Mobile" | "Landline" | "VOIP" ...
  dnc?: boolean;
}

export interface RawBatchResult {
  name?: { full?: string };
  phoneNumbers?: RawBatchPhone[];
  emails?: (string | { address?: string })[];
}

function normalizePhoneType(t?: string): "mobile" | "landline" | "voip" {
  const s = (t ?? "").toLowerCase();
  if (s.includes("mobile") || s.includes("cell")) return "mobile";
  if (s.includes("voip")) return "voip";
  return "landline";
}

/** Pure vendor→domain mapping for a skip-trace hit. */
export function mapBatchResult(raw: RawBatchResult): OwnerContact {
  const phones = (raw.phoneNumbers ?? [])
    .filter((p) => p.number)
    .map((p) => ({
      number: String(p.number),
      type: normalizePhoneType(p.type),
      dnc: Boolean(p.dnc),
    }));
  const emails = (raw.emails ?? [])
    .map((e) => (typeof e === "string" ? e : e.address ?? ""))
    .filter(Boolean);
  return {
    fullName: raw.name?.full ?? "",
    phones,
    emails,
    skipTraced: true,
  };
}

export class BatchDataSkipTraceProvider implements SkipTraceProvider {
  readonly name = "batchdata";

  async skipTrace(property: Property): Promise<OwnerContact> {
    const res = await fetch(`${WHOLESALE_ENV.edgeBase}/batchdata-proxy`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        path: "skip-trace",
        body: {
          address: property.address.line1,
          city: property.address.city,
          state: property.address.state,
          zip: property.address.zip,
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`BatchData proxy error ${res.status}: ${await res.text().catch(() => "")}`);
    }
    const raw = (await res.json()) as { result?: RawBatchResult };
    return mapBatchResult(raw.result ?? {});
  }
}
