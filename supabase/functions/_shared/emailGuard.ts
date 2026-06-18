// =============================================================================
// _shared/emailGuard — abuse protection for email-sending edge functions
// =============================================================================
// Provides: input validation, HTML escaping (the recipient name is interpolated
// into email HTML), a service-role caller check (for server-only senders), and
// per-recipient rate limiting backed by public.email_send_log.
// =============================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

/** RFC-ish email check + length cap. */
export function isValidEmail(e: unknown): e is string {
  return typeof e === "string" && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/** Escape user-supplied text before it goes into email HTML (anti-injection). */
export function escapeHtml(s: unknown, max = 200): string {
  return String(s ?? "")
    .slice(0, max)
    .replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

/** Server-to-server only: caller must present the service-role key as bearer. */
export function requireServiceRole(req: Request): Response | null {
  const auth = req.headers.get("Authorization") ?? "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!key || auth !== `Bearer ${key}`) return json(403, { error: "Forbidden" });
  return null;
}

/**
 * Per-identity rate limit. Returns a 429 Response when over cap, else null
 * (and records the send). Fails OPEN on infrastructure error (e.g. table not
 * yet migrated) so a logging hiccup never blocks a legitimate signup email.
 */
export async function rateLimit(
  key: string,
  emailType: string,
  opts: { perHour?: number; perDay?: number } = {},
): Promise<Response | null> {
  const perHour = opts.perHour ?? 5;
  const perDay = opts.perDay ?? 20;
  try {
    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const recipient_key = key.trim().toLowerCase();
    const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
    const dayAgo = new Date(Date.now() - 86_400_000).toISOString();

    const { count: h, error: he } = await db
      .from("email_send_log").select("*", { count: "exact", head: true })
      .eq("recipient_key", recipient_key).gte("created_at", hourAgo);
    if (he) return null; // infra error → fail open
    if ((h ?? 0) >= perHour) return json(429, { error: "Rate limit exceeded" });

    const { count: d } = await db
      .from("email_send_log").select("*", { count: "exact", head: true })
      .eq("recipient_key", recipient_key).gte("created_at", dayAgo);
    if ((d ?? 0) >= perDay) return json(429, { error: "Rate limit exceeded" });

    await db.from("email_send_log").insert({ recipient_key, email_type: emailType });
    return null;
  } catch {
    return null; // never block legitimate mail on a limiter failure
  }
}
