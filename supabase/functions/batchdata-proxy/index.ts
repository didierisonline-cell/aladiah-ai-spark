// Edge function: batchdata-proxy
// Server-side proxy to BatchData (skip tracing). Holds the secret BATCHDATA_KEY
// so the frontend never sees it. Client posts { path, body }; we forward to the
// allowlisted BatchData endpoint and return JSON.
//
// SECURITY: `path` is allowlisted. Deploy with `BATCHDATA_KEY` set. Not deployed
// automatically (repo rule: no live infra changes without explicit approval).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ENDPOINTS: Record<string, string> = {
  "skip-trace": "https://api.batchdata.com/api/v1/property/skip-trace",
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

    const BATCHDATA_KEY = Deno.env.get("BATCHDATA_KEY");
    if (!BATCHDATA_KEY) throw new Error("BATCHDATA_KEY not configured");

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BATCHDATA_KEY}`,
      },
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
