// Wholesale platform environment resolution.
//
// SECURITY: vendor API keys (ReAPI, BatchData, HouseCanary, Twilio) are NEVER
// read here — they must live server-side in the edge-function proxy, never in
// the Vite bundle. The frontend only knows the *base URL* of our own edge
// proxy. If that base URL is absent, the app runs on mock adapters.

type ViteEnv = Record<string, string | undefined>;
const viteEnv: ViteEnv =
  (typeof import.meta !== "undefined" && (import.meta as { env?: ViteEnv }).env) || {};

export const WHOLESALE_ENV = {
  /** Base URL of our edge-function proxy (holds vendor keys). Empty ⇒ mock. */
  edgeBase: viteEnv.VITE_WHOLESALE_EDGE_BASE ?? "",

  /** Dedicated wholesale Supabase project (separate from the education app). */
  supabaseUrl: viteEnv.VITE_WHOLESALE_SUPABASE_URL ?? "",
  supabaseAnonKey: viteEnv.VITE_WHOLESALE_SUPABASE_ANON_KEY ?? "",
};

/** Live provider adapters are usable only when the edge proxy is configured. */
export const hasLiveProviders = (): boolean => WHOLESALE_ENV.edgeBase.length > 0;

/** Supabase persistence is usable only when a dedicated project is configured. */
export const hasSupabase = (): boolean =>
  WHOLESALE_ENV.supabaseUrl.length > 0 && WHOLESALE_ENV.supabaseAnonKey.length > 0;
