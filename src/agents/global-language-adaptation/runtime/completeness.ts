/**
 * Language Completeness Rules (Core responsibility #2).
 *
 * A language is NOT considered "active" for students unless every dimension
 * below is 100% translated. This module is the single, testable definition of
 * that gate — the scanner produces the inputs, the dashboard renders the
 * verdict, and (later) the student language selector reads `isLanguageActive`
 * to decide whether to offer a language as fully-supported vs. preview.
 *
 * Pure functions only — no React, no DB — so it can run in the scanner (Node)
 * and in the browser identically.
 */

/** The dimensions that must each reach 100% before a language goes "active". */
export const COMPLETENESS_DIMENSIONS = [
  'navigation',
  'buttons',
  'courseTitles',
  'lessonTitles',
  'lessonBody',
  'quizQuestions',
  'quizAnswers',
  'feedbackMessages',
  'diagrams', // translated OR replaced with a translated SVG/image asset
] as const;

export type CompletenessDimension = (typeof COMPLETENESS_DIMENSIONS)[number];

/** translated / total for one dimension. */
export interface DimensionCount {
  translated: number;
  total: number;
}

export type LanguageCoverage = Record<CompletenessDimension, DimensionCount>;

export interface CompletenessResult {
  language: string;
  /** 0–100, weighted by string count across all dimensions. */
  overallPercent: number;
  /** Per-dimension percentage (0–100). */
  perDimension: Record<CompletenessDimension, number>;
  /** Dimensions still below 100%. */
  incompleteDimensions: CompletenessDimension[];
  /** True only when every dimension is exactly 100%. */
  isActive: boolean;
}

function pct(c: DimensionCount): number {
  if (!c || c.total <= 0) return 100; // nothing to translate ⇒ that dimension is complete
  return Math.round((c.translated / c.total) * 1000) / 10;
}

/**
 * Evaluate one language against the completeness rules.
 * `isActive` is true ONLY when all dimensions are 100% — this is the hard gate
 * referenced throughout the spec ("A language is not 'active' unless ...").
 */
export function evaluateCompleteness(
  language: string,
  coverage: LanguageCoverage,
): CompletenessResult {
  const perDimension = {} as Record<CompletenessDimension, number>;
  let translated = 0;
  let total = 0;
  const incompleteDimensions: CompletenessDimension[] = [];

  for (const dim of COMPLETENESS_DIMENSIONS) {
    const count = coverage[dim] ?? { translated: 0, total: 0 };
    const p = pct(count);
    perDimension[dim] = p;
    translated += count.translated;
    total += count.total;
    if (p < 100) incompleteDimensions.push(dim);
  }

  const overallPercent = total <= 0 ? 100 : Math.round((translated / total) * 1000) / 10;

  return {
    language,
    overallPercent,
    perDimension,
    incompleteDimensions,
    isActive: incompleteDimensions.length === 0,
  };
}
