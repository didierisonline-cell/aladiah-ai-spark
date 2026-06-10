// =============================================================================
// Competency taxonomy mirror — Product Builder Agent
// =============================================================================
// SOURCE OF TRUTH: /docs/standards/COMPETENCY_TAXONOMY.md (canonical).
// This is a code mirror of the APPROVED Axis-1 slugs. NEVER invent slugs here
// and NEVER rename an existing slug — competency is snapshotted onto attempt
// rows at submit time, so a rename orphans historical analytics.
//
// When a new program is added, append its Axis-1 section in the canon doc FIRST,
// then mirror it here. The agent must only tag generated questions with slugs
// that exist in this registry.
// =============================================================================

export interface CompetencySlug {
  slug: string;
  label: string;
  /** Axis-2 cross-program meta-category (see COMPETENCY_TAXONOMY.md §3). */
  meta: string;
}

/** Scrum Master — Axis-1 registry (8 slugs). Mirrors COMPETENCY_TAXONOMY.md §2. */
export const SCRUM_COMPETENCIES: CompetencySlug[] = [
  { slug: 'scrum:framework', label: 'Scrum Framework Fundamentals', meta: 'foundations' },
  { slug: 'scrum:roles', label: 'Accountabilities & Roles', meta: 'roles-accountabilities' },
  { slug: 'scrum:events', label: 'Scrum Events', meta: 'process-execution' },
  { slug: 'scrum:artifacts', label: 'Artifacts & Commitments', meta: 'artifacts-tooling' },
  { slug: 'scrum:empiricism', label: 'Empiricism & Agile Principles', meta: 'foundations' },
  { slug: 'scrum:team-dynamics', label: 'Team Dynamics & Facilitation', meta: 'people-leadership' },
  { slug: 'scrum:stakeholders', label: 'Stakeholder & Organizational Engagement', meta: 'stakeholder-engagement' },
  { slug: 'scrum:delivery-metrics', label: 'Delivery & Flow Metrics', meta: 'measurement-outcomes' },
];

/** All known competencies by program key. Extend as the canon doc grows. */
export const COMPETENCIES_BY_PROGRAM: Record<string, CompetencySlug[]> = {
  scrum: SCRUM_COMPETENCIES,
};

export function competenciesFor(program: string): CompetencySlug[] {
  return COMPETENCIES_BY_PROGRAM[program] ?? [];
}

export function isApprovedSlug(slug: string): boolean {
  return Object.values(COMPETENCIES_BY_PROGRAM).some((list) => list.some((c) => c.slug === slug));
}

export function labelFor(slug: string): string {
  for (const list of Object.values(COMPETENCIES_BY_PROGRAM)) {
    const hit = list.find((c) => c.slug === slug);
    if (hit) return hit.label;
  }
  return slug;
}
