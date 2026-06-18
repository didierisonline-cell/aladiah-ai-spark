// =============================================================================
// Shared auth guard for Supabase Edge Functions.
// =============================================================================
// Privileged functions (course/quiz seeders, admin writers) must verify that
// the caller is an authenticated founder/admin BEFORE doing any service-role
// work. `verify_jwt` only proves *a* JWT exists — it does NOT prove admin — so
// every privileged function calls requireAdmin() and bails on a Response.
//
// Founder identity is recognized two ways (mirrors src/lib/roles.ts):
//   1. the caller's email is in FOUNDER_EMAILS, OR
//   2. the caller has a public.user_roles(role='admin') row.
// =============================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/** Canonical founder accounts recognized server-side. Keep in sync with
 *  src/lib/roles.ts and public.aos_is_admin(). The legacy didiermbok@yahoo.com
 *  is intentionally NOT here — it has TEMPORARY access via a user_roles admin
 *  row (honored by the fallback below), revocable without a code change. */
export const FOUNDER_EMAILS = [
  "didier@aladiahacademy.com",
  "didierisonline@gmail.com",
];

export const sharedCors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export interface AuthedUser {
  id: string;
  email: string;
}

function deny(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...sharedCors, "Content-Type": "application/json" },
  });
}

/**
 * Require an authenticated founder/admin caller.
 * @returns the authed user on success, or a Response (401/403) the caller must
 *          return immediately.
 *
 *   const auth = await requireAdmin(req);
 *   if (auth instanceof Response) return auth;
 */
export async function requireAdmin(req: Request): Promise<AuthedUser | Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return deny(401, "Unauthorized");
  }

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  if (!url || !anonKey) return deny(500, "Auth not configured");

  // Resolve the caller from THEIR token (anon key client + their Authorization).
  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error } = await userClient.auth.getUser();
  if (error || !user) return deny(401, "Unauthorized");

  const email = (user.email ?? "").toLowerCase();
  if (FOUNDER_EMAILS.includes(email)) return { id: user.id, email };

  // Fallback: user_roles(role='admin') lookup via service role.
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (serviceKey) {
    const admin = createClient(url, serviceKey);
    const { data } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (data) return { id: user.id, email };
  }

  return deny(403, "Admin access required");
}

/**
 * True when the request is an INTERNAL call carrying the service-role key as its
 * Bearer token (e.g. one edge function invoking another, or a trusted cron).
 * The service-role key is server-only and never shipped to the browser.
 */
export function isServiceRoleCall(req: Request): boolean {
  const header = req.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  return token.length > 0 && key.length > 0 && token === key;
}

/**
 * Allow an internal service-role caller OR an authenticated founder/admin.
 * Used by sensitive senders (email) that must never be invokable by the public.
 *
 *   const auth = await requireServiceOrAdmin(req);
 *   if (auth instanceof Response) return auth;
 */
export async function requireServiceOrAdmin(
  req: Request,
): Promise<AuthedUser | { service: true } | Response> {
  if (isServiceRoleCall(req)) return { service: true };
  return await requireAdmin(req);
}
