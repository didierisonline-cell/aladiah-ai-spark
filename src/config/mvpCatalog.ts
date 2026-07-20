// =============================================================================
// mvpCatalog — single source of truth for MVP launch program gating (WO-P0-001)
// =============================================================================
// Launch Cabinet Directive 001: only verified programs are enterable at launch.
// Everything else is visible but Coming Soon / Locked. No DB rows are deleted
// or unpublished — gating is a display/entry concern owned by the frontend.
//
// Programs are matched by curriculum_version (stable, set at build time) with
// a course-id prefix fallback. Update PREVIEW → ACTIVE only after the Founder
// verifies content completeness in the database (QA_STANDARD evidence gate).
// =============================================================================

export type ProgramStatus = 'active' | 'preview' | 'coming_soon';

/** Certificates are not issuable at MVP launch — all levels show Coming Soon. */
export const CERTIFICATES_ENABLED = false;

// ACTIVE — verified, enterable programs.
const ACTIVE_VERSIONS = new Set(['v3.0', 'pm-v1', 'cyber-v1', 'da-v1', 'ba-v1']);
const ACTIVE_ID_PREFIXES = [
  'f46d8fc2', // AI Enterprise Scrum Master & Agile Transformation Leader
  'c9177a56', // AI Enterprise Project Manager & Strategic Delivery Leader
  '1181ed06', // AI Data Analyst & Analytics Engineer
  '1d16d2c1', // AI Enterprise Cybersecurity & Digital Trust Engineer
  '8b36ab1f', // AI Business Analyst — ACTIVATED per Founder gate (docs/qa/BA_ACTIVATION_VERIFICATION.sql)
];

// PREVIEW — visible, not enterable until DB verification passes.
const PREVIEW_VERSIONS = new Set<string>([]);
const PREVIEW_ID_PREFIXES: string[] = [];

export const MVP_ACTIVE_COUNT = ACTIVE_ID_PREFIXES.length;

export interface ProgramStatusInput {
  id?: string | null;
  curriculum_version?: string | null;
}

export function getProgramStatus(course: ProgramStatusInput): ProgramStatus {
  const cv = course.curriculum_version || '';
  if (ACTIVE_VERSIONS.has(cv)) return 'active';
  if (PREVIEW_VERSIONS.has(cv)) return 'preview';
  const id = (course.id || '').toLowerCase();
  if (ACTIVE_ID_PREFIXES.some((p) => id.startsWith(p))) return 'active';
  if (PREVIEW_ID_PREFIXES.some((p) => id.startsWith(p))) return 'preview';
  return 'coming_soon';
}

/** True only for programs a student may enter at MVP launch. */
export const isEnterable = (course: ProgramStatusInput) =>
  getProgramStatus(course) === 'active';

export const PROGRAM_STATUS_LABEL: Record<ProgramStatus, string> = {
  active: 'Active',
  preview: 'Preview',
  coming_soon: 'Coming Soon',
};
