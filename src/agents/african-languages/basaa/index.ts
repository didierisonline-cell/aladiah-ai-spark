/**
 * Basaa Language Agent — capture entry point.
 *
 * `captureBasaaInput` is the ONLY sanctioned way to record Basaa learner input.
 * It writes to `language_student_submissions` (the student-writable table whose
 * RLS allows `auth.uid() = user_id` inserts only), tagged `language='bas'` and
 * `status='unreviewed'`. The review pipeline (AI → human) later promotes
 * approved rows into the `basaa_*` knowledge tables.
 *
 * It NEVER writes to basaa_dictionary_entries / basaa_sentence_pairs /
 * basaa_tech_terms / basaa_translation_memory directly — those are review-gated.
 */

export const BASAA_LANGUAGE = {
  code: 'bas',
  iso6393: 'bas',
  englishName: 'Basaa',
  endonym: 'Ɓasaa',
  family: 'Bantu (A43, Cameroon)',
  fallbackChain: ['fr', 'en'] as const, // graceful fallback order
} as const;

export type BasaaSubmissionType =
  | 'new_word'
  | 'phrase'
  | 'correction'
  | 'pronunciation'
  | 'sentence_pair';

export interface BasaaCaptureInput {
  /** new Basaa word/phrase, a correction, or a sentence in Basaa. */
  term: string;
  submissionType?: BasaaSubmissionType;
  suggestedTranslation?: string;
  englishEquiv?: string;
  frenchEquiv?: string;
  pronunciationNotes?: string;
  /** confidence 0..1 (e.g. tutor's certainty, or learner self-rating). */
  confidence?: number;
  /** Where the input came from: course, lesson, concept, user intent. */
  context?: {
    course?: string;
    lesson?: string;
    concept?: string;
    userIntent?: string;
    [k: string]: unknown;
  };
}

/** Minimal Supabase-like client (decoupled from generated Database types). */
interface MinimalClient {
  from: (table: string) => {
    insert: (values: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
}

/**
 * Record Basaa learner input into the review pipeline. Best-effort: returns
 * `{ ok }` rather than throwing, so a tutor interaction is never broken by a
 * capture failure.
 */
export async function captureBasaaInput(
  client: MinimalClient,
  input: BasaaCaptureInput,
): Promise<{ ok: boolean; error?: unknown }> {
  try {
    const { error } = await client.from('language_student_submissions').insert({
      language: BASAA_LANGUAGE.code,
      submission_type: input.submissionType ?? 'new_word',
      term: input.term,
      suggested_translation: input.suggestedTranslation ?? null,
      english_equiv: input.englishEquiv ?? null,
      french_equiv: input.frenchEquiv ?? null,
      pronunciation_notes: input.pronunciationNotes ?? null,
      confidence: input.confidence ?? 0,
      context: input.context ?? {},
      status: 'unreviewed', // governance: never auto-publish
    });
    return { ok: !error, error: error ?? undefined };
  } catch (error) {
    return { ok: false, error };
  }
}
