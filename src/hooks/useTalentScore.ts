import { useProgress } from './useProgress';

// =============================================================================
// useTalentScore — THE single source of truth for the Talent Score™.
// Previously the dashboard showed a hardcoded 612 and the Talent Score page
// showed a hardcoded 0 — two unrelated fabricated values. This hook computes one
// consistent score from real signals so every surface agrees.
//
// Model (max 1000): Knowledge Mastery 300 · Project Quality 200 · Certifications
// 150 · Enterprise Simulation 200 · Peer Review 100 · Consistency & Streak 50.
// Knowledge Mastery is derived from real quiz progress (useProgress). The other
// five dimensions read 0 until their data sources are wired (honest, not faked) —
// tracked as a Phase-1 Medium follow-up. overall = sum of dimensions.
// =============================================================================

export interface TalentDimension {
  key: string;
  label: string;
  labelKey: string;
  score: number;
  max: number;
  color: string;
}

export interface TalentScore {
  overall: number;
  max: number;
  dimensions: TalentDimension[];
  loading: boolean;
}

const clampPct = (n: number) => Math.max(0, Math.min(100, n));

/** Pure: the six Talent Score dimensions for a given quiz-progress %. */
export function talentDimensionsFromProgress(progress: number): TalentDimension[] {
  const knowledge = Math.round((clampPct(progress) / 100) * 300);
  return [
    { key: 'knowledge', label: 'Knowledge Mastery', labelKey: 'ts.dim_knowledge', score: knowledge, max: 300, color: '#4A90F5' },
    { key: 'project', label: 'Project Quality', labelKey: 'ts.dim_project', score: 0, max: 200, color: '#F0622A' },
    { key: 'certs', label: 'Certifications', labelKey: 'ts.dim_certs', score: 0, max: 150, color: '#F5B81A' },
    { key: 'simulation', label: 'Enterprise Simulation', labelKey: 'ts.dim_simulation', score: 0, max: 200, color: '#22C98A' },
    { key: 'peer', label: 'Peer Review Score', labelKey: 'ts.dim_peer', score: 0, max: 100, color: '#A78BFA' },
    { key: 'streak', label: 'Consistency & Streak', labelKey: 'ts.dim_streak', score: 0, max: 50, color: '#F472B6' },
  ];
}

/** Pure: overall Talent Score (0–1000) for a given progress %. Use this when the
 *  caller already has progress (avoids a second fetch). */
export function talentScoreFromProgress(progress: number): number {
  return talentDimensionsFromProgress(progress).reduce((sum, d) => sum + d.score, 0);
}

export const TALENT_SCORE_MAX = 1000;

export function useTalentScore(userId: string | undefined): TalentScore {
  const { progress, loading } = useProgress(userId);
  const dimensions = talentDimensionsFromProgress(progress);
  const overall = dimensions.reduce((sum, d) => sum + d.score, 0);
  return { overall, max: TALENT_SCORE_MAX, dimensions, loading };
}
