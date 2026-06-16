/** Shared types for the Full Translation Coverage Scanner. */

export interface KeyCoverage {
  language: string;
  /** Number of i18n keys present for this language. */
  presentKeys: number;
  /** Total keys defined for the canonical language (English). */
  totalKeys: number;
  /** Keys that exist in English but are missing for this language. */
  missingKeys: string[];
  /** Keys present but whose value is byte-identical to the English value
   *  (a strong signal of an untranslated placeholder). */
  identicalToEnglishKeys: string[];
  /** presentKeys-identical / totalKeys, as 0–100. */
  coveragePercent: number;
}

export interface HardcodedFinding {
  file: string;
  line: number;
  /** A short excerpt of the offending literal. */
  sample: string;
  /** Why the heuristic flagged it. */
  reason: 'jsx_text' | 'string_prop';
}

export interface HardcodedReport {
  scannedFiles: number;
  totalFindings: number;
  byFile: Record<string, number>;
  findings: HardcodedFinding[];
}

export interface CoverageReport {
  generatedAt: string;
  canonicalLanguage: string;
  languages: KeyCoverage[];
}
