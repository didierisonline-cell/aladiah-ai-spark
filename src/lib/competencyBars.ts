// =============================================================================
// competencyBars — derive the dashboard "Skill Strengths" bars from REAL,
// quiz-derived competency data (student_learning_profiles cross-program row),
// not a synthetic target scaled by progress.
//
// Each strong/weak area carries a 0–100 `score` (round(accuracy*100)) keyed by
// Axis-2 metaCategory (see recompute-learning-profiles AXIS2 + COMPETENCY_TAXONOMY).
// We render the canonical competency framework always-visible and fill in the
// real score per area; competencies with no quiz evidence yet read 0%.
//
// Zero-state guarantee: no profile / no quiz answers ⇒ every bar is 0%.
// =============================================================================

export interface CompetencyBar {
  label: string;
  score: number; // 0–100, real (0 when no quiz evidence)
  color: string;
}

interface Area { topic?: string | null; score?: number | null }
interface ProfileLike { strongAreas?: Area[] | null; weakAreas?: Area[] | null }

// Canonical Axis-2 competency framework (keys mirror recompute AXIS2 values).
// Shown in this order; labels are human-readable, colors stable per competency.
export const COMPETENCY_FRAMEWORK: { key: string; label: string; color: string }[] = [
  { key: 'foundations',            label: 'Foundations',            color: '#6366f1' },
  { key: 'roles-accountabilities', label: 'Roles & Accountabilities', color: '#8b5cf6' },
  { key: 'process-execution',      label: 'Process & Execution',    color: '#10b981' },
  { key: 'artifacts-tooling',      label: 'Artifacts & Tooling',    color: '#f59e0b' },
  { key: 'people-leadership',      label: 'People & Leadership',    color: '#f97316' },
  { key: 'stakeholder-engagement', label: 'Stakeholder Engagement', color: '#ec4899' },
  { key: 'measurement-outcomes',   label: 'Measurement & Outcomes', color: '#22d3ee' },
];

const clampScore = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Map of competency key → real 0–100 score from the learning profile. */
function scoreMap(profile: ProfileLike | null): Map<string, number> {
  const m = new Map<string, number>();
  if (!profile) return m;
  for (const a of [...(profile.strongAreas || []), ...(profile.weakAreas || [])]) {
    if (!a || a.topic == null || typeof a.score !== 'number') continue;
    const prev = m.get(a.topic);
    const v = clampScore(a.score);
    if (prev == null || v > prev) m.set(a.topic, v); // dedupe: strongest wins
  }
  return m;
}

/**
 * Real competency bars, highest score first, capped at `max`.
 * Always returns the framework (filled with 0 where there's no evidence yet),
 * so the panel renders a true zero-state rather than fabricated percentages.
 */
export function competencyBarsFromProfile(profile: ProfileLike | null, max = 5): CompetencyBar[] {
  const scores = scoreMap(profile);
  return COMPETENCY_FRAMEWORK
    .map((c) => ({ label: c.label, color: c.color, score: scores.get(c.key) ?? 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
}

/** True once the student has any real competency evidence (≥1 area with a score). */
export function hasCompetencyEvidence(profile: ProfileLike | null): boolean {
  return scoreMap(profile).size > 0;
}
