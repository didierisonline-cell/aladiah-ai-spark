# Zero-State Dashboard Regression — Root Cause & Fix

**Date:** 2026-06-18 · **Branch:** `claude/adoring-brown-1f452f` · **Status:** FIXED, build clean, guard added

## Symptom (reported)

A student with 0 completed lessons/quizzes/labs/certs showed:
Career Path 300/600 hrs · Talent Score 150 · Cloud Architecture 46% · Problem Solving 44% ·
AI/ML Fundamentals 43% — while Overall Progress = 0%, Day Streak/Labs/Certs = 0. Logically inconsistent.

## Root cause — ONE source, not hardcoded numbers

The numbers were **not** seeded, mocked, or hardcoded. They were **computed** from a single
inflated value: `useProgress()` returning **50%** for a zero-completion student. Every reported
"earned" value is a deterministic function of that 50%:

| Surface | Formula (`StudentPortal.tsx` / `useTalentScore.ts`) | At 50% | Reported |
|---|---|---|---|
| Talent Score | `(progress/100)*300` | **150** | 150 ✓ |
| Career Path hours | `(100-progress)/100*600` | **300**/600 | 300/600 ✓ |
| Cloud Architecture | `round(92*progress/100)` | **46%** | 46% ✓ |
| Problem Solving | `round(88*progress/100)` | **44%** | 44% ✓ |
| AI/ML Fundamentals | `round(85*progress/100)` | **43%** | 43% ✓ |

**Why `useProgress` returned 50% with zero completions** — `src/hooks/useProgress.ts`:
`overall = (completionPct + avgScore) / 2`, but the two halves were measured over **different
quiz populations**:
- `completionPct` counted only **`chapter_end`** quizzes (correctly 0 for a new student).
- `avgScore` averaged **every** quiz the student ever scored — including the free Module-1 quiz
  and module/practice quizzes that are *not* chapter completions.

So a new student who scored ~100% on the one free quiz, with **0 chapters completed**, got
`overall = (0 + 100) / 2 = 50%`. Meanwhile the "Overall Progress" stat uses a *different*
variable, `overallPct` (line 472), computed from video-completion (`user_progress.completed_at`
÷ total videos) — correctly 0%. The two progress sources disagreed; that is the visible inconsistency.

## Fix (one change, at the source)

`src/hooks/useProgress.ts`: scope `avgScore` to the **same** `chapter_end` population as
`completionPct` (a `Set` of passed chapter-end quiz ids). Invariant guaranteed:
**0 chapter completions ⇒ `scores=[]` ⇒ `overall = completionPct = 0`** → cascades to Talent
Score 0, hours 600/600, all skills 0%. Genuine learners are mathematically unchanged.

This single hook is the sole source for all affected surfaces (`StudentPortal`, `Dashboard`,
`PortalTalentScore`, `PortalSidebar`, `ProgressBar`, `MobileLearn`, `MobileHome`), so the fix
propagates everywhere consistently.

## Value-source trace (mission item 1–3)

| Metric | Source | Table / query | Verdict |
|---|---|---|---|
| Talent Score | `talentScoreFromProgress(overallProgress)` | derived from `useProgress` | ✅ real (now 0 at zero-state) |
| Career Path hours | `(100-overallProgress)/100*600` | derived from `useProgress` | ✅ real |
| Skill Strengths | base const × `overallProgress`/100 (`StudentPortal.tsx:48-52,811`) | derived from `useProgress` | ⚠️ zero-safe but **synthetic** (see follow-ups) |
| Overall Progress stat | `overallPct` avg of `courses[].pct` | `videos` + `user_progress.completed_at` | ✅ real completion |
| Day Streak | `user_progress.completed_at` distinct days | `user_progress` | ✅ real |
| Labs / Certs / Points | `student_labs`, `user_progress`/5, `student_points` | respective tables | ✅ real |

No demo/seed/founder-default values feed these metrics. The repo-wide sweep for `150/300/46/44/43`
found only **max-value constants** (talent dimension caps) and computed expressions — no hardcoded defaults.

## Proof (mission item 6)

`npm run verify:zero-state` (`scripts/verify-progress-zero-state.mjs`) replays the formula:
- Reproduces the exact reported numbers under the OLD logic, and
- Asserts 0-everywhere under the FIX, while a genuine 3/10-chapter learner stays 60%/180.

I cannot capture live before/after **screenshots** in this environment (no browser + seeded DB).
The executable replay is provided in their place and is a stronger guarantee of the math; a live
screenshot pass against a seeded zero-state account remains a manual QA step.

## Honest follow-ups (separate from this regression)

1. **Two divergent progress definitions.** `overallProgress` (quiz completion + score) vs
   `overallPct` (video completion) measure different things and will diverge for active students
   even though both are now 0 at zero-state. Recommend choosing one canonical definition.
2. **Skill Strengths are synthetic.** Bars derive from hardcoded targets (92/88/85…) scaled by
   progress — zero-safe now, but for active students they are NOT earned per-competency mastery.
   Real per-competency data already exists via `recompute-learning-profiles` / `learning_profiles`;
   wiring the bars to it is the correct longer-term fix.
3. **`PortalCareerPanel.tsx`** contains static demo content (skills 45/72, a résumé preview
   "Talent Score: 874/1000"). Not user-bound and not part of this regression, but should be
   replaced with real data or clearly labeled as a sample.
