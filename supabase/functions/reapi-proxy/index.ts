// Edge function: reapi-proxy
// Server-side proxy to RealEstateAPI (ReAPI). Holds the secret REAPI_KEY so the
// frontend never sees it. The client posts { path, body }; we forward to the
// matching ReAPI endpoint with the key and return the JSON verbatim.
//
// SECURITY: `path` is allowlisted — this is NOT an open proxy. Deploy with
// `REAPI_KEY` set in the function's secrets. Not deployed automatically (repo
// rule: no live infra changes without explicit approval).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ReAPI endpoint allowlist: our logical path → real ReAPI URL.
const ENDPOINTS: Record<string, string> = {
  PropertySearch: "https://api.realestateapi.com/v2/PropertySearch",
  PropertyComps: "https://api.realestateapi.com/v3/PropertyComps",
  PropertyDetail: "https://api.realestateapi.com/v2/PropertyDetail",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { path, body } = await req.json();
    const url = ENDPOINTS[path];
    if (!url) {
      return new Response(JSON.stringify({ error: `path not allowed: ${path}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const REAPI_KEY = Deno.env.get("REAPI_KEY");
    if (!REAPI_KEY) throw new Error("REAPI_KEY not configured");

    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": REAPI_KEY },
      body: JSON.stringify(body ?? {}),
    });
    const data = await upstream.json();

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
