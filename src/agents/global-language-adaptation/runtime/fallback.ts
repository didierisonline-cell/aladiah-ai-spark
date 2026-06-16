/**
 * Student Experience / graceful fallback (Core responsibility #7).
 *
 * When a translation is missing for the active language, the platform must:
 *   1. show the source string (French, then English) so the student is never
 *      blocked by an empty UI, and
 *   2. surface a calm, honest notice, and
 *   3. AUTOMATICALLY log the miss into `language_missing_translations` so the
 *      gap shows up in the founder dashboard and gets fixed — without the
 *      student having to report anything.
 *
 * This module is dependency-light on purpose: it accepts a minimal Supabase-like
 * client so it can be unit-tested and so it never hard-couples to the generated
 * Database types (the new tables are not in those types until the migration is
 * applied by hand).
 */

export const FALLBACK_NOTICE: Record<string, string> = {
  // Shown beneath/around content that fell back. Keep short and reassuring.
  bas: 'Basaa translation pending. Showing French/English version temporarily.',
  default: 'Translation pending. Showing the original version temporarily.',
};

export type TranslationSurface =
  | 'navigation'
  | 'button'
  | 'course_title'
  | 'lesson_title'
  | 'lesson_body'
  | 'quiz_question'
  | 'quiz_answer'
  | 'feedback'
  | 'simulation'
  | 'diagram_label'
  | 'dashboard_card'
  | 'alert'
  | 'transcript'
  | 'tutor'
  | 'other';

export interface MissingTranslationEvent {
  language: string;
  /** Stable identifier for the string (i18n key, content id, or hash). */
  stringKey: string;
  surface: TranslationSurface;
  /** The English/French source actually shown to the student. */
  sourceText?: string;
  /** Where it happened — route, course/lesson id, etc. (for triage). */
  context?: Record<string, unknown>;
}

/** Minimal shape we need from the Supabase client (keeps this file decoupled).
 *  We call the SECURITY DEFINER RPC `log_missing_translation` so a student
 *  session can record a gap without any direct table-write privilege. */
interface MinimalClient {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ error: unknown }>;
}

export function fallbackNotice(language: string): string {
  return FALLBACK_NOTICE[language] ?? FALLBACK_NOTICE.default;
}

/**
 * Resolve a string for the active language with graceful fallback.
 * Returns the best available text AND whether a fallback was used (so the UI
 * can render the notice). Order: active language → French → English → key.
 */
export function resolveWithFallback(args: {
  language: string;
  stringKey: string;
  active?: string | null; // translation in the active language, if any
  fr?: string | null;
  en?: string | null;
}): { text: string; usedFallback: boolean; from: 'active' | 'fr' | 'en' | 'key' } {
  const { language, stringKey, active, fr, en } = args;
  if (active && active.trim()) return { text: active, usedFallback: false, from: 'active' };
  if (language !== 'fr' && fr && fr.trim()) return { text: fr, usedFallback: true, from: 'fr' };
  if (en && en.trim()) return { text: en, usedFallback: true, from: 'en' };
  return { text: stringKey, usedFallback: true, from: 'key' };
}

/**
 * Fire-and-forget log of a missing translation via the SECURITY DEFINER RPC.
 * Deduplicated server-side on (language, string_key, surface) — the RPC bumps
 * `miss_count` and `last_seen_at` instead of inserting duplicates.
 *
 * Never throws: a logging failure must never break the student's lesson.
 */
export async function logMissingTranslation(
  client: MinimalClient,
  event: MissingTranslationEvent,
): Promise<void> {
  try {
    await client.rpc('log_missing_translation', {
      p_language: event.language,
      p_string_key: event.stringKey,
      p_surface: event.surface,
      p_source_text: event.sourceText ?? null,
      p_context: event.context ?? {},
    });
  } catch {
    // swallow — telemetry must be best-effort
  }
}
