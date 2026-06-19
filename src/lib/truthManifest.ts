// =============================================================================
// truthManifest — the documented SPEC/claim and AUTHORED values that the CEO
// Truth Dashboard measures against LIVE database evidence.
// =============================================================================
// IMPORTANT: nothing here is a "live metric". These are the *claims* and the
// *authored* counts (with provenance) that the dashboard compares against real
// Supabase queries at render time. The Live column is ALWAYS fetched live; if a
// query fails the dashboard shows "unknown", never a number from this file.
// Update a claim here only when the underlying doc/migration changes.
// =============================================================================

export interface ClaimSpec {
  key: string;
  label: string;
  /** The public/spec claim (marketing or certification number). */
  claimed: number;
  /** What migrations/code actually author (the authored reality). */
  authored: number;
  /** Whether the authored asset reaches the student DB path at all. */
  authoredOnStudentPath: boolean;
  unit: string;
  claimSource: string;
  authoredSource: string;
}

// Scrum flagship — the program under active replacement (audit 294a9de).
export const SCRUM_FLAGSHIP_CLAIMS: ClaimSpec[] = [
  { key: 'modules', label: 'Modules', claimed: 18, authored: 18, authoredOnStudentPath: true,
    unit: 'modules', claimSource: 'CERTIFICATION.md', authoredSource: 'migration 20260619000000' },
  { key: 'lessons', label: 'Lessons', claimed: 162, authored: 72, authoredOnStudentPath: true,
    unit: 'lessons', claimSource: 'CERTIFICATION.md / PRODUCTION_SPEC', authoredSource: 'migration 20260619010000 (18×4)' },
  { key: 'questions', label: 'Exam question bank', claimed: 1080, authored: 100, authoredOnStudentPath: true,
    unit: 'questions', claimSource: 'course description / CERTIFICATION.md', authoredSource: 'migration 20260619020000 (100 mapped)' },
  { key: 'capstoneQuestions', label: 'Capstone questions', claimed: 40, authored: 40, authoredOnStudentPath: true,
    unit: 'questions', claimSource: 'CAPSTONE.md', authoredSource: 'migration 20260619020000' },
  { key: 'simulations', label: 'Simulations', claimed: 54, authored: 54, authoredOnStudentPath: false,
    unit: 'sims', claimSource: 'course description', authoredSource: 'aiScrumMasterFull.ts (CODE, not DB)' },
  { key: 'labs', label: 'Labs', claimed: 18, authored: 18, authoredOnStudentPath: false,
    unit: 'labs', claimSource: 'CERTIFICATION.md', authoredSource: 'aiScrumMasterFull.ts (CODE, not DB)' },
  { key: 'portfolio', label: 'Portfolio projects', claimed: 18, authored: 18, authoredOnStudentPath: false,
    unit: 'projects', claimSource: 'CERTIFICATION.md', authoredSource: 'aiScrumMasterFull.ts (CODE, not DB)' },
];

// Strings that, if found in a LIVE course description, are unsupported claims.
export const DANGEROUS_CLAIM_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /1[,.]?080[- ]?question/i, label: '1,080-question bank' },
  { pattern: /\b162\s+lessons?\b/i, label: '162 lessons' },
  { pattern: /\b200[- ]?question/i, label: '200-question exam' },
  { pattern: /\b54\s+simulations?\b/i, label: '54 simulations' },
];

// Title heuristics for finding the flagship + detecting the old seed duplicate.
export const FLAGSHIP_TITLE_LIKE = '%Scrum Master%';
export const OLD_SEED_TITLE = 'AI-Powered Scrum Master Professional Certification';

export type ClaimStatus = 'backed' | 'partial' | 'unsupported' | 'unknown';

/** Decide a claim's status from the live value (null = unverifiable). */
export function claimStatus(spec: ClaimSpec, live: number | null): ClaimStatus {
  if (live === null) return 'unknown';
  if (live >= spec.claimed) return 'backed';
  if (live > 0) return 'partial';
  return 'unsupported';
}
