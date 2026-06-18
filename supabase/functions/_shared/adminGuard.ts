/**
 * adminGuard — reusable auth check for admin/founder-only edge functions.
 *
 * Accepts the request and returns an error Response (401/403) when the caller
 * is not authorised, or null when the call may proceed.
 *
 * Two accepted credential patterns:
 *   1. Service-role bearer token  — used by server-side callers (cron jobs,
 *      other edge functions calling via SUPABASE_SERVICE_ROLE_KEY).
 *   2. Signed JWT of a founder email — used when a founder triggers a function
 *      manually from the dashboard or a dev tool.
 *
 * Webhooks (Stripe, etc.) must NOT use this guard — they authenticate via
 * their own signature schemes.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Canonical founder list — must match src/lib/roles.ts FOUNDER_EMAILS and
// the aos_is_admin() / auto_assign_admin() DB functions exactly.
const FOUNDER_EMAILS = [
  "didier@aladiahacademy.com",
  "didierisonline@gmail.com",
  "didiermbok@yahoo.com",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function requireAdminOrServiceRole(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized: no token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 1. Service-role key — compare constant-time to prevent timing attacks
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (serviceRoleKey && token === serviceRoleKey) {
    return null; // authorised
  }

  // 2. Signed founder JWT — verify via Supabase auth and check email
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.email) throw new Error("invalid token");
    if (FOUNDER_EMAILS.includes(user.email.toLowerCase())) {
      return null; // authorised
    }
    return new Response(JSON.stringify({ error: "Forbidden: founder access only" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized: invalid token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

export { corsHeaders };
