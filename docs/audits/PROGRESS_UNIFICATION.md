# Canonical Student Progress — Unification

**Date:** 2026-06-18 · **Branch:** `claude/adoring-brown-1f452f` · **Status:** unified, build clean, 4-scenario test green

Follow-up #1 from the zero-state regression. Replaces three divergent progress
definitions with one canonical model consumed by every surface.

## 1. Current progress sources map (before)

| # | Where | Definition | Problem |
|---|---|---|---|
| A | `useProgress` | `(chapterCompletion% + avgScore) / 2` | score blended into completion → a scored quiz with 0 lessons read as 50% |
| B | `StudentPortal.overallPct` | mean of per-course `doneVideos / totalVideos` | video-only; disagreed with A on the same screen |
| C | `Dashboard` per-course cards | `miniQuizzesPassed / totalVideos` | a third, mini-quiz-based definition |
| — | Career hours | `StudentPortal` (remaining) + `PortalSidebar` (earned) | two inline `* 600` constants off A |

The dashboard rendered A (Talent Score/skills) and B (Overall Progress stat) side by
side — the logically inconsistent screen reported in the audit.

## 2. New canonical interface — `src/lib/progressModel.ts`

```ts
interface StudentProgress {
  pct: number;               // CANONICAL headline, 0–100 (lesson completion)
  lessonsCompleted: number;
  lessonsTotal: number;
  chaptersCompleted: number; // passed chapter_end quizzes
  chaptersTotal: number;
  avgScore: number;          // avg score over passed chapter_end quizzes — QUALITY ONLY
  loading: boolean;
  progress: number;          // @deprecated alias of pct (legacy consumers)
}
computeCanonicalProgress(inputs): StudentProgress   // pure, no I/O
careerHoursEarned(pct) / careerHoursLeft(pct)        // single 600h source
```

## 3. Formula explanation

```
pct = lessonsTotal > 0 ? round(lessonsCompleted / lessonsTotal * 100) : 0
```
- A **lesson** = a video in a **published** course. **Completed** = a `user_progress`
  row for that video with `completed_at` set (distinct, so duplicates never double-count).
- Quiz **score is never blended into `pct`**. It is surfaced separately as `avgScore`
  (a quality signal). This is the structural fix: completion and score are different
  axes, so a high score can no longer manufacture completion. Progress is now literally
  "you finished X of Y lessons" — explainable and consistent.
- **Downstream cascade**, all from the one `pct`: Talent Score knowledge dim =
  `round(pct/100·300)`; Career Path = `careerHoursEarned/Left(pct)` against a 600h target;
  skill bars = `base·pct/100`.
- **Invariant:** `lessonsCompleted = 0 ⇒ pct = 0 ⇒ Talent Score 0, skills 0%, hours 0 earned / 600 left.`

## 4. Files changed

- **NEW** `src/lib/progressModel.ts` — canonical interface + pure `computeCanonicalProgress` + 600h helpers.
- `src/hooks/useProgress.ts` — now a thin wrapper: fetches the published lesson/chapter
  universe + `user_progress`, defers all math to `computeCanonicalProgress`. Returns the rich object.
- `src/pages/StudentPortal.tsx` — deleted the divergent `overallPct` (per-course average);
  headline stat, Prof. Didier greeting, Talent Score, Career Path hours, skill bars, and the
  mobile `score` prop all read the single `overallProgress = useProgress().pct`.
- `src/components/PortalSidebar.tsx` — career hours via `careerHoursEarned(pct)` (single 600h source).
- **NEW** `scripts/verify-canonical-progress.mjs` (`npm run verify:progress` / `verify:zero-state`).
- Removed the now-stale `scripts/verify-progress-zero-state.mjs` (mirrored the old formula).

Consumers needing no change (already flow through the one hook): `Dashboard`, `ProgressBar`,
`MobileLearn`, `MobileHome` (via `StudentPortal` `score` prop), `PortalTalentScore` (via `useTalentScore`).

## 5. Build proof

`vite build` ✓ clean (esbuild, no type errors).

## 6. Regression test — `npm run verify:progress`

Exercises the **real** `progressModel.ts` (transpiled with esbuild), all green:

| Scenario | Result |
|---|---|
| a. zero-state student | pct 0 · Talent 0 · hours 0/600 · skills 0% |
| b. free Module-1 quiz only (scored 100, 0 lessons) | **pct 0** (was the 50% regression) · Talent 0 · skills 0% |
| c. active learner (2/4 lessons, 1 chapter @90) | pct 50 · lessons 2/4 · avgScore 90 reported separately · Talent 150 |
| d. completed program (4/4 lessons) | pct 100 · Talent 300 · hours 600/0 |
| guard. duplicate completed rows | counted once (1/4 = 25%) |

## 7. Out of scope (next, per instruction)

Skill bars remain synthetic (`StudentPortal` 92/88/85… and `PortalCareerPanel` 45/72 +
résumé-preview "Talent Score: 874/1000"). They are now **zero-state safe** (scale by the
canonical pct → 0 at zero-state) but still not earned per-competency mastery. Wiring them to
real `learning_profiles` data is the deferred follow-up #2 — not touched here, as instructed.
