// =============================================================================
// AOS internal helpers — shared DB handle + small utilities.
// =============================================================================
import { supabase } from '@/integrations/supabase/client';

// The aos_* tables are not in the generated Supabase types; use a loosely-typed
// handle. (Build is esbuild — no tsc — and this keeps the editor quiet too.)
export const db = supabase as unknown as { from: (table: string) => any };

export const nowISO = () => new Date().toISOString();

export const hoursFromNow = (h: number) =>
  new Date(Date.now() + h * 60 * 60 * 1000).toISOString();

/** Advance a timestamp by an agent cadence; null for 'manual'. */
export function nextRunFor(cadence: string | null | undefined): string | null {
  const base = Date.now();
  switch (cadence) {
    case 'hourly':
      return new Date(base + 60 * 60 * 1000).toISOString();
    case 'daily':
      return new Date(base + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(base + 7 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return null; // manual
  }
}

/** Never-throw wrapper for read queries that may hit a missing table. */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error('[AOS] query failed:', e instanceof Error ? e.message : e);
    return fallback;
  }
}
