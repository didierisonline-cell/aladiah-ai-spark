// =============================================================================
// _shared/adminGuard — authorize privileged edge functions (seed-*, etc.)
// =============================================================================
// Seed/import functions run with the SERVICE_ROLE key (full DB write, RLS
// bypassed). Without a caller check, anyone who can reach the URL could
// overwrite course data. requireAdmin() validates the caller's JWT and confirms
// they hold the 'admin' role in public.user_roles. Call it AFTER the OPTIONS
// preflight and BEFORE any service-role work.
//
// Returns null when authorized; otherwise a ready-to-return error Response.
// =============================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function deny(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export async function requireAdmin(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader) return deny(401, "Missing Authorization header");

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // 1) Authenticate: validate the caller's JWT.
  const caller = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error } = await caller.auth.getUser();
  if (error || !user) return deny(401, "Invalid or expired session");

  // 2) Authorize: caller must hold the 'admin' role (checked with service role,
  //    independent of RLS).
  const admin = createClient(url, serviceKey);
  const { data: role } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!role) return deny(403, "Admin privilege required");

  return null; // authorized
}
