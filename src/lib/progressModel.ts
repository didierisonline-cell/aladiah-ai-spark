// =============================================================================
// progressModel — THE canonical student-progress definition (pure, no I/O).
// =============================================================================
// One definition of "Overall Progress" for the entire app. Every surface
// (StudentPortal, Dashboard, PortalSidebar, mobile, Talent Score, Career Path)
// derives from this single object so the numbers can never disagree again.
//
// CANONICAL FORMULA
//   pct = round(lessonsCompleted / lessonsTotal * 100)        // 0 when no lessons
// where a "lesson" is a video in a PUBLISHED course and "completed" means the
// student has a user_progress row for it with completed_at set.
//
// Quiz score is reported SEPARATELY as `avgScore` (a quality signal) and is
// NEVER blended into `pct`. Blending score into completion was the original
// regression (a single scored quiz with 0 lessons read as 50%). Keeping them
// separate makes progress explainable: "you finished X of Y lessons", full stop.
//
// INVARIANT (proven in scripts/verify-canonical-progress.mjs):
//   0 completed lessons  ⇒  pct = 0  ⇒  Talent Score 0, skills 0%, hours 0 earned.
// =============================================================================

export interface StudentProgress {
  /** Canonical headline progress, 0–100 (lesson completion). */
  pct: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  /** Passed chapter_end quizzes (completion of a chapter's assessment). */
  chaptersCompleted: number;
  chaptersTotal: number;
  /** Average score over passed chapter_end quizzes, 0–100. Quality only — not mixed into pct. */
  avgScore: number;
  loading: boolean;
  /** @deprecated Alias of `pct` for legacy consumers that destructured `progress`. Prefer `pct`. */
  progress: number;
}

export interface ProgressRow {
  video_id?: string | null;
  quiz_id?: string | null;
  score?: number | null;
  completed_at?: string | null;
}

export interface ProgressInputs {
  /** Ids of every lesson (video) in the published-course universe. */
  lessonIds: Iterable<string>;
  /** Ids of every chapter_end quiz (the chapter-assessment universe). */
  chapterEndQuizIds: Iterable<string>;
  /** The student's user_progress rows. */
  progressRows: ProgressRow[];
}

const clampPct = (n: number) => Math.max(0, Math.min(100, n));

/** The single canonical progress computation. Pure: same inputs ⇒ same object. */
export function computeCanonicalProgress(inputs: ProgressInputs): StudentProgress {
  const lessonIds = inputs.lessonIds instanceof Set ? inputs.lessonIds : new Set(inputs.lessonIds);
  const chapterEndIds = inputs.chapterEndQuizIds instanceof Set ? inputs.chapterEndQuizIds : new Set(inputs.chapterEndQuizIds);
  const rows = inputs.progressRows || [];

  // Completed lessons: distinct videos with completed_at, inside the published universe.
  const completedLessons = new Set<string>();
  for (const r of rows) {
    if (r.completed_at && r.video_id && lessonIds.has(r.video_id)) completedLessons.add(r.video_id);
  }

  // Completed chapters: distinct passed chapter_end quizzes. avgScore over those only.
  const chapterRows = rows.filter((r) => r.quiz_id && chapterEndIds.has(r.quiz_id));
  const chaptersCompleted = new Set(chapterRows.map((r) => r.quiz_id as string)).size;
  const scores = chapterRows.filter((r) => r.score != null).map((r) => r.score as number);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const lessonsTotal = lessonIds.size;
  const lessonsCompleted = completedLessons.size;
  const pct = lessonsTotal > 0 ? Math.round((lessonsCompleted / lessonsTotal) * 100) : 0;

  return {
    pct,
    progress: pct,
    lessonsCompleted,
    lessonsTotal,
    chaptersCompleted,
    chaptersTotal: chapterEndIds.size,
    avgScore,
    loading: false,
  };
}

export const EMPTY_PROGRESS: StudentProgress = {
  pct: 0, progress: 0, lessonsCompleted: 0, lessonsTotal: 0,
  chaptersCompleted: 0, chaptersTotal: 0, avgScore: 0, loading: false,
};

// ── Career Path (single source for the 600-hour model) ───────────────────────
export const CAREER_HOURS_TARGET = 600;
/** Hours "earned" toward employability, derived from canonical pct. 0 at zero-state. */
export const careerHoursEarned = (pct: number) => Math.round((clampPct(pct) / 100) * CAREER_HOURS_TARGET);
/** Hours remaining to the target. Full 600 at zero-state. */
export const careerHoursLeft = (pct: number) => CAREER_HOURS_TARGET - careerHoursEarned(pct);
