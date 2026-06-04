# PROF_DIDIER_GREETING_PLAN.md

**Status:** STEP 1 BUILT as reviewable drafts (not executed / not deployed) — on branch `feature/prof-didier-greeting`. Claude Code built ahead of reading this plan, so the function shape needs the reconciliation noted below before we proceed. Prereq is cleared — the boundary violation that caused the in-lesson-question cutoff (completion-token → setTimeout → navigate) was already removed in commit `5245090`; the lesson agent now has zero navigation power. Recommend one live re-test of the in-lesson questions to confirm the symptom is gone, but no longer a code-level blocker.

**As-built Step 1 (drafts on branch):**
- Migration: `supabase/migrations/20260603120000_prof_didier_recap_columns.sql` — adds the 4 columns to `profiles`, additive + idempotent, RLS unchanged. NOT executed (paste-and-verify pending).
- Function: `supabase/functions/get-student-recap/index.ts` — read-only, JWT-scoped (RLS-enforced, no service-role). NOT deployed. **Built shape:** `{ student, freeCourse, progress, competency }` — raw data only; it does NOT yet emit `mode` or `first_message`. See reconciliation in Architecture.
- **Discovery:** competency data already exists — `student_learning_profiles` has a cross-program row (`course_id IS NULL`). So `weak_areas`/strengths can be REAL in v1, not deferred.
- JWT-scoped read auth (what was built) is the right call for a function returning the caller's own data — keep it over the service-role + `{userId}` pattern used by `recompute-learning-profiles`.

**Branch:** `feature/prof-didier-greeting`

**Recon findings locked in (run against live main):**
- Onboarding gesture = the **confirm** click `handleConfirm` (`CourseSelectionGate.tsx:73`, button `:184`), the sole writer of `free_course_id` — NOT the card-select click. Chain onboarding voice here.
- Use **`firstMessage`** override (proven in `ProfDidierFloat.tsx:89`, `LiveClassroom.tsx:213/294`). `dynamic_variables` is unused codebase-wide — do not introduce it for v1.
- `mode` signals from live `profiles` columns: `upgrade_coach` ⇐ `free_course_completed === true`; `onboarding` ⇐ `onboarding_completed === false`; else `daily_briefing`.
- `has_completed_intro` exists but is the Community intro form — distinct, do NOT reuse for onboarding gating.
- Existing `generateProfGreeting` (`StudentPortal.tsx:270`) is an LLM greeting call to eventually consolidate into `get-student-recap` (note, don't refactor in step 1).
- Lesson completion is quiz-driven and voice-decoupled (`ChapterView.tsx:779–803`); paywall lock fires at `:296/:301/:449/:803`.
- Live `profiles` columns: id, user_id, full_name, avatar_url, created_at, updated_at, has_completed_intro, tier, free_course_id, free_switch_used, free_course_completed, preferred_language. The four new columns do not exist (write SQL defensively with IF NOT EXISTS).

**Goal:** Prof. Didier speaks proactively at three key moments — he does NOT wait for "Talk to Prof. Didier" — while the app, not Prof. Didier, controls access and navigation.

1. **After free-program selection (onboarding):** on the **confirm click** (`handleConfirm`, sole writer of `free_course_id`), Prof. Didier immediately speaks — congratulating on the program + explaining the Module 1 journey. The click satisfies autoplay rules.
2. **On returning login (daily briefing):** auto-start the spoken recap. If autoplay/mic is blocked, fall back to a premium animated prompt + "Start My Briefing" button; the click plays the recap.
3. **After free Module 1 completion (Upgrade Coach):** persona shifts — auto-speak or prompt "Prof. Didier has your next-step briefing," focused ONLY on continuation, upgrading, career outcomes, encouragement.

**Hard boundary (everywhere):** Prof. Didier *speaks*; the app *controls access and navigation/progression*. The voice agent must never advance lessons, unlock content, mark completion, or route. (Same boundary whose violation caused the in-lesson-question bug.)

## Architecture: two layers, one contract

### Layer A — Greeting shell (no data dependency)
First-vs-return detection; once-ever onboarding + once-per-day daily gating; mentor-card UI; ElevenLabs session kickoff via `firstMessage`.

### Layer B — Recap content (`get-student-recap`, read-only, JWT-scoped)
Competency data already exists (`student_learning_profiles`), so v1 returns REAL `weak_areas`/strengths.

**Contract reconciliation (DECISION NEEDED).** Claude Code built `{ student, freeCourse, progress, competency }`. Spec wants `mode` + ready-to-speak `first_message`. The raw shape contains everything to derive both.
- **Option A (recommended): extend `get-student-recap`** to also return `mode` + `first_message`, composed server-side. One stable contract, i18n + persona logic in one place. Template-per-mode for v1; LLM warmth (consolidating `generateProfGreeting`) later inside the same function.
- **Option B:** keep raw, compose `mode`/`first_message` in a separate assembly step.

Target contract (Option A):
```json
{
  "mode": "daily_briefing",
  "is_first_time": false,
  "voice_muted": false,
  "student_name": "Didier",
  "language": "es",
  "last_login_at": "2026-05-30T14:02:00Z",
  "days_since_last_login": 4,
  "last_briefing_at": "2026-05-30T14:02:00Z",
  "current_course": { "id": "...", "title": "Scrum Master" },
  "current_lesson": { "id": "...", "title": "1.4 ..." },
  "since_last_login": { "lessons_completed": 2, "quizzes_taken": 1, "best_quiz_score": 90, "weak_areas": ["sprint planning"] },
  "recommendation": "Continue with Lesson 1.5",
  "first_message": "¡Bienvenido de nuevo, Didier! ..."
}
```
- `mode` derivation: `upgrade_coach` ⇐ `free_course_completed`; `onboarding` ⇐ `onboarding_completed === false`; else `daily_briefing`.
- `weak_areas` sourced from `student_learning_profiles` (`course_id IS NULL` row). Real in v1.
- `first_message` composed server-side in the student's language, played via `firstMessage` override.

## Detection & gating

Columns on `profiles`:
- `onboarding_completed` (bool, default false) — once-ever onboarding gate. (Distinct from `has_completed_intro`.)
- `last_prof_didier_briefing_at` (timestamptz) — once-per-day gate + refresh guard.
- `last_login_at` (timestamptz) — anchor for "since last login"; update after computing recap.
- `prof_didier_voice_muted` (bool, default false) — when true, text only, never auto-speak.
- (client) per-session guard (sessionStorage) — at most once per session unless student clicks.

Portal-load logic: muted → text only · `!onboarding_completed` + just confirmed program → onboarding · `free_course_completed` → upgrade_coach · `last_prof_didier_briefing_at != today` + no session guard → daily briefing · else no auto-speak (button still works).

## Auto-speak behavior

Text always rendered immediately (accessibility); voice is the layer on top.
- **Moment 1:** chain session start onto `handleConfirm`. `first_message` = congrats + Module 1 journey. Once ever.
- **Moment 2:** attempt auto-start; on block, show "Prof. Didier is ready with your daily briefing." + "Start My Briefing" button → click plays recap. Recap text shows regardless. Gated once/day + once/session.
- **Moment 3:** `upgrade_coach` persona — auto-speak or "Prof. Didier has your next-step briefing." Continuation/upgrade/career/encouragement ONLY; account is paywall-locked so no new content.

Rules: never auto-start on every refresh; max once/session unless student asks; respect `prof_didier_voice_muted`; text always visible; pass recap via `firstMessage` override (not `dynamic_variables`); voice agent output is speech only — never navigation.

## Files likely touched
- `src/pages/StudentPortal.tsx` — mentor card, daily/upgrade triggers, "Start My Briefing" fallback. (Also touched by sidebar-instability pin — branch isolates.)
- Free-program confirm handler (`CourseSelectionGate.tsx` `handleConfirm`) — chain onboarding session start.
- ElevenLabs session-start logic (`firstMessage` override). Enforce speech-only boundary.
- `src/contexts/LanguageContext.tsx` — greeting/recap/upgrade strings + "Start My Briefing" ×7.
- `supabase/functions/get-student-recap` — extend per Option A.
- Schema migration (4 columns) — paste-and-verify, never auto-executed.

## Build order
1. Schema columns — paste-and-verify SQL. ✅ drafted
2. `get-student-recap` returning contract w/ `mode` + `first_message`. ⏳ raw half built; reconcile per A.
3. Mentor-card shell: detection + gating + card UI + session guard (text only).
4. Moment 1 — onboarding voice on confirm click.
5. Moment 2 — daily-briefing auto-start + fallback prompt.
6. Moment 3 — Upgrade Coach persona.
7. ElevenLabs `firstMessage` wiring; enforce speech-only boundary.
8. Mute preference + always-visible text.
9. i18n strings ×7.
10. Verify on one student (fresh incognito) across all three moments, then commit/merge.

## Park / pick-up notes
- Prereq cleared: boundary violation removed in `5245090`; worth a live re-test of in-lesson questions.
- Competency data exists now → `weak_areas` is real, not deferred.
- Autoplay settled: gesture-chained where a click exists; attempt-then-fallback on returning login; text always visible.
- Open decisions: (1) contract Option A vs B; (2) mute UX — defaulting to persistent `prof_didier_voice_muted` flag + in-card toggle.
- Mentor-card layout/avatar polish: the longer recap first_message displaces the Prof. Didier avatar / "Your AI Mentor" header in the card. Adjust card layout to accommodate richer text. (Found during Step 2A live test.)
- Recap i18n alignment: get-student-recap returns English on a Spanish UI (preferred_language path falls back to en; only en/es/fr templated). Align recap language with UI language. This is Build-order step 9.
