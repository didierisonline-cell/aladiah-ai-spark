/**
 * simliConfig — env gate for the OPTION B (Simli real talking-head) prototype.
 *
 * The Simli path is INERT unless BOTH Preview env vars are present:
 *   VITE_SIMLI_API_KEY   — Simli API key (Vercel Preview scope only)
 *   VITE_SIMLI_FACE_ID   — the Professor Didier face id created in the Simli dashboard
 *
 * No secrets are hardcoded here — values come only from import.meta.env. When either
 * is missing (the default today), SIMLI_ENABLED is false and the classroom renders
 * Option A (the audio-reactive professor) exactly as before.
 *
 * NOTE: reading the key on the client is acceptable for this PREVIEW prototype (mirrors
 * Simli's own create-simli-app NEXT_PUBLIC pattern). Production hardening = mint the
 * Simli session token behind an edge function so the key never ships to the browser.
 */
export const SIMLI_API_KEY = (import.meta.env.VITE_SIMLI_API_KEY as string | undefined) || "";
export const SIMLI_FACE_ID = (import.meta.env.VITE_SIMLI_FACE_ID as string | undefined) || "";

/** True only when both Preview env vars are set. Gates the entire Simli path. */
export const SIMLI_ENABLED = Boolean(SIMLI_API_KEY && SIMLI_FACE_ID);
