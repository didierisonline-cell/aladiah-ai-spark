# Part 3 / Phase 2 — Strengths/Weaknesses Rollup (DESIGN ONLY — NOTHING APPLIED)

Status: **Design under review. No code, no DB, no .env.** Companion to `PHASE1_WIRING_PLAN.md`
and `FINAL_EXAM_ENGINE_PLAN.md`. Build in a future session, **after** Phase-1 capture is live.

Goal: turn the raw per-question grain that Phase-1 starts writing (`quiz_attempt_answers`, each
row carrying a `competency` snapshot) into a per-student **strengths/weaknesses profile** in the
existing `student_learning_profiles` table — `weak_areas` / `strong_areas` / `quiz_accuracy_trend`
(all JSONB, already present). **Reuse the table. No new table is proposed.**

---

## ⚠️ PILOT SCOPE — Phase-2 builds the machinery, not platform coverage (read first)

Phase-2 ships the **rollup engine** (capture → per-competency aggregate → profile). But the engine only
produces *real* output for competencies that are actually tagged. As of P2.1, **only Scrum Module-1's six
Axis-1 slugs are tagged** (`scrum:framework`, `scrum:roles`, `scrum:team-dynamics`, `scrum:empiricism`,
`scrum:events`, `scrum:stakeholders`; `scrum:artifacts` and `scrum:delivery-metrics` are intentionally
absent from Module 1 per `COMPETENCY_TAXONOMY.md` §4). Scrum Modules 2–4 and all other ~30 programs
(~270 questions) are still `competency = NULL`.

So: **"Phase-2 done" ≠ "Competency Engine covers the platform."** Shipping the rollup makes strengths/
weaknesses work *for the tagged slice* and proves the pipeline end-to-end; widening coverage is **separate,
ongoing content work** (tag each program's `quiz_questions`, same "data, not code" property as step 6).
Don't read a green Phase-2 as platform-wide competency measurement — it's the machine plus one tagged pilot.

---

## ✅ DEPENDENCY STATUS — capture is LIVE; tagging is the remaining lever (read first)

**Updated post-P2.1 (supersedes the original "nothing to roll up yet" blocker).** Phase-1 capture shipped in
commit **bc8365b**: `Quiz.tsx:151-168` inserts a `quiz_attempts` header plus one `quiz_attempt_answers` row
per question on every submit, snapshotting the question's tag onto each answer row
(`Quiz.tsx:163` — `competency: questions[idx].competency ?? null`). The grain table is therefore **written on
every live quiz submission** — the "written by nothing today" blocker is **cleared**, and the gate at the
original top of this plan is satisfied.

What now gates *meaningful* output is **tagging**, not capture:
1. ✅ `quiz_attempt_answers` rows accrue per submit → the rollup has grain to read.
2. ⏳ `quiz_attempt_answers.competency` is non-null **only for tagged questions.** Scrum Module-1's 30
   questions are tagged (commit **f591921** live + seed sync); the other ~270 seeded questions are still
   `competency = NULL`, so their answer rows snapshot NULL. Per **CLAUDE.md** the snapshot is taken at submit
   and **cannot be backfilled into past attempts** — tagging a question changes only *future* submits; rows
   already captured against an untagged question stay NULL forever.

So the real ordering is now: ~~Phase-1 capture~~ **(done)** → **tag questions (ongoing content work)** →
**this rollup**, and the rollup must tolerate partial tagging — see "Rollup logic" (the `competency IS NOT NULL`
filter).

---

## ⚠️ SECOND FINDING — the learning-profile layer is currently DORMANT

Investigation result that reframes the whole phase: **`student_learning_profiles` is wired end-to-end
in dead/backup code only.** Nothing live writes the strengths/weaknesses data, and nothing live reads it.

Evidence:
- **No live writer.** `useLearningProfile.recordQuizResult()` (the existing client-side topic rollup,
  `src/hooks/useLearningProfile.ts:161-243`) and `recordStruggle()` are **never called** anywhere in
  `src/`. The only importers of `useLearningProfile` are `src/pages/StudentPortal.tsx.bak*` /
  `.backup` (seven dead snapshots). The **active** `src/pages/StudentPortal.tsx` does not import the
  hook at all.
- **No live reader.** `KnowledgeGraph.tsx` and `YouTubeRecommendations.tsx` (which consume
  `weakAreas`/`strongAreas`) are only rendered from those same `.bak*` files. `SmartSidebar` *is*
  rendered live by `VideoPlayer.tsx:854`, but **without** the `learningProfile` prop — so it always
  falls back to empty `weakAreas`/`strongAreas` (`SmartSidebar.tsx:73-81`).
- The hook still auto-creates an empty profile row per user on mount (`useLearningProfile.ts:114-128`),
  but only when something mounts it — which live code doesn't.
- **Capture is client-side; a dormant server `submit-quiz` exists.** The live submit path is the client
  (`Quiz.tsx` writes `quiz_attempts`/`quiz_attempt_answers` directly — no edge invoke). There is also a
  `supabase/functions/submit-quiz/index.ts` that writes `quiz_attempts` only (no per-question capture, no
  profile writes) and is **not invoked from live `src/`**. This shapes where the rollup trigger should
  live — see "Where the rollup runs."

**Why this matters for the design:** the existing `recordQuizResult` rollup is **not a system to
integrate with — it's a draft to supersede.** It is client-side, fires per-quiz on a single aggregate
`score` + a free-text `topic` string (not the locked competency vocabulary), and double-writes
`consecutive_failures` in a way that already conflicts with `recordStruggle` (both increment it).
Phase-2 should define the **authoritative server-side rollup** keyed on `competency`, and treat the
client hook's writer methods as **legacy to retire or repoint**, not as the contract to preserve. The
*read* shape (the TS interfaces the UI expects) is worth preserving for cheap reuse — see "Profile shape."

---

## What exists today (investigation findings)

| Surface | File | What it does with analytics | Reads from |
|---|---|---|---|
| Admin dashboard API | `supabase/functions/admin-analytics/index.ts` | Service-role aggregation across ALL students: per-student avg quiz score, streaks, points, labs, per-course % from `mini_video` passes. **Coarse** — avg of `quiz_attempts.score`, no per-question, no competency. | `quiz_attempts`, `user_progress`, `student_analytics`, `quizzes`, etc. |
| AI grading / success | `supabase/functions/ai-grading/index.ts` | LLM modes: `grade_project`, `student_success_check` (consumes `quizTrend`, `engagementScore`, `consecutiveFailures` passed IN as `studentContext`), `generate_marketing`. **Does not read the DB** — caller supplies context. | (none — params only) |
| Profile hook | `src/hooks/useLearningProfile.ts` | Defines the TS shape (`WeakArea{topic,score,lastTested,attempts}`, `StrongArea{topic,score,masteredAt}`, `quizAccuracyTrend[{date,score,quizId}]`) + the dormant client rollup. | `student_learning_profiles` |
| Student stat modals | `src/components/portal/StatDetailModals.tsx` | Student-facing detail dialogs. Quiz history reads `user_progress` (score/passed/completed_at). **Does not touch `student_learning_profiles`** — no weak/strong UI live. | `user_progress`, `profiles`, `student_points`, `student_labs` |
| Profile table | migration `20260217131855_*.sql` | `weak_areas`/`strong_areas`/`struggle_events`/`review_queue`/`quiz_accuracy_trend` all `JSONB DEFAULT '[]'`. `UNIQUE(user_id, course_id)`. RLS: owner SELECT/INSERT/UPDATE + admin SELECT. | — |
| Raw grain (Phase-1) | migration `20260531201551_*.sql` | `quiz_attempt_answers(attempt_id, question_id, selected_index, correct_index, is_correct, competency, created_at)`; index on `(competency, is_correct)`. `quiz_questions += competency, topic`. | written by Phase-1 `Quiz.tsx` |

Net: admin-analytics already does cross-student rollups but at the **attempt-score** grain; it never
descends to per-question/per-competency. The profile table is the right home for the finer grain, and
its RLS + cross-user service-role pattern already matches how admin-analytics aggregates. **No new
table needed.**

---

## Vocabulary alignment — one `competency` TEXT, two axes

The locked vocabulary is two-axis, and **the map is now canonical** — `COMPETENCY_TAXONOMY.md` §3 holds
the Axis-1→Axis-2 mapping and the fixed Axis-2 vocabulary (it is no longer "not yet written to a doc"):
- **Axis 1** — program-namespaced slug, e.g. `scrum:framework`, `scrum:roles`. The
  `quiz_questions.competency` snapshot copied into `quiz_attempt_answers.competency` **is the Axis-1
  slug.** It is per-program by construction (the namespace prefix).
- **Axis 2** — a cross-program **meta-category** that several programs' Axis-1 slugs map up into, so
  analytics can compare a student across programs. The **actual Axis-2 keys** (from `COMPETENCY_TAXONOMY.md`
  §3, not invented here) are: `foundations`, `roles-accountabilities`, `process-execution`,
  `artifacts-tooling`, `people-leadership`, `stakeholder-engagement`, `measurement-outcomes`. Scrum's
  mapping per §3: `scrum:framework`/`scrum:empiricism` → `foundations`; `scrum:roles` →
  `roles-accountabilities`; `scrum:events` → `process-execution`; `scrum:artifacts` → `artifacts-tooling`;
  `scrum:team-dynamics` → `people-leadership`; `scrum:stakeholders` → `stakeholder-engagement`;
  `scrum:delivery-metrics` → `measurement-outcomes`.

There is **no Axis-2 column today** and none is needed in the raw grain. Recommendation:

- **Keep `quiz_attempt_answers.competency` = Axis-1 slug only** (it already snapshots that). Don't
  denormalize Axis-2 into the answer rows — meta-category mappings change, and re-tagging history is
  exactly what the snapshot was designed to avoid for Axis-1.
- **Resolve Axis-2 at rollup time by reading the canon map** (`COMPETENCY_TAXONOMY.md` §3) — do **not**
  invent a separate `Record<string,string>` that could drift from the canon. The rollup should mirror §3
  exactly (load/derive from it; if mirrored in code, treat the doc as source of truth and keep them in
  sync). If it ever needs to be data-driven, promote §3 to a `competency_catalog(slug, meta_category, label)`
  reference table — but that is a *Phase-3+* convenience, **not** required here and explicitly **not** the
  "new table" the brief warns against (it's a lookup, not a per-student store).
- The rollup writes **both** groupings into the profile: per-program weak/strong keyed by Axis-1 slug,
  and a parallel cross-program roll keyed by Axis-2 meta-category (see shape below). Per-program lives
  in the `course_id`-scoped profile row; cross-program lives in the `course_id IS NULL` row (the table's
  `UNIQUE(user_id, course_id)` already supports both — null course_id = the global profile).

This keeps "works per-program AND across programs" a pure rollup concern, with zero schema change
beyond what Phase-1 already shipped.

---

## Rollup logic — how wrong answers become weak/strong entries

Source grain: `quiz_attempt_answers` joined to its parent `quiz_attempts` (for `user_id`, `created_at`,
`quiz_id`). **Filter `WHERE competency IS NOT NULL` before grouping**, then group by `competency` (Axis-1),
per user.

> **Why the NULL filter is mandatory (partial-tagging reality).** Capture snapshots
> `questions[idx].competency ?? null`, so every answer row on a *not-yet-tagged* question carries
> `competency = NULL`. Without this filter those rows collapse into a single **phantom `NULL` competency**
> bucket — and because a student can easily answer ≥3 untagged questions, the `attempts >= 3` min-sample
> guard would **not** stop a bogus "NULL" weak/strong entry from being written. Excluding NULL means the
> rollup reports only genuinely-tagged competencies (today, Scrum Module-1's six slugs) and simply ignores
> untagged attempts — which is also the only correct behavior given those snapshots can never be backfilled
> (CLAUDE.md). Untagged ≠ weak; untagged = not measured.

**Per-competency aggregate (the unit of the rollup; over `competency IS NOT NULL` rows only):**
```
attempts        = count(answer rows for this user × competency)        -- questions answered, not quizzes
correct         = count(... where is_correct)
accuracy        = correct / attempts                                   -- 0..1
last_tested     = max(quiz_attempts.created_at) over those rows
trend           = ordered (date, accuracy) points, bucketed per attempt-session or per day
```
Compute accuracy over a **rolling window** (recommend last N=50 answered questions per competency, or
last 90 days — whichever the data supports) so a student who improves isn't damned by early failures.
Keep a small `sample` count alongside accuracy so the UI/Phase-3 can suppress low-confidence verdicts.

**Weak vs strong thresholds (recommended starting values, tune later):**
- **Weak area** = `accuracy < 0.70` **AND** `attempts >= 3` (min-sample guard so one unlucky question
  doesn't flag a competency). The 0.70 cut mirrors the legacy hook's `score < 70` weak threshold —
  treat it as a **tunable constant**, not a derived value. (Note: do **not** justify it via quiz
  `passing_score`. The live Scrum quizzes are seeded `passing_score = 100`, not 70 — `Quiz.tsx` uses
  `passing_score ?? 100` — so per-competency accuracy and the quiz pass bar are unrelated scales.)
- **Strong area** = `accuracy >= 0.90` **AND** `attempts >= 3`. Mirrors the hook's `>= 90` mastery cut —
  also a tunable constant.
- **Neutral band** `0.70 ≤ accuracy < 0.90`: in neither list (avoids churn / list thrash).
- A competency is **mutually exclusive** between weak and strong (promotion clears it from the other),
  exactly as the legacy hook did (`useLearningProfile.ts:172-187`) — preserve that rule.

**Trend** (`quiz_accuracy_trend`): keep the existing `{date, score, quizId}` point shape for backward
compatibility with the TS interface, but **add a per-competency trend** inside each weak/strong entry
(see shape) so Phase-3 can say "you're improving in X, still declining in Y." Cap arrays (existing hook
caps trend at 30, struggle_events at 50) — keep a cap (recommend 30) to bound JSONB growth.

---

## Profile shape to write (superset of today's TS, additive)

Preserve the field **names** the dormant TS interfaces already declare (so the eventual UI rewire is a
prop-passing change, not a reshape), and **extend** each entry with competency-aware fields. Existing
readers that only look at `topic`/`score` keep working; new readers get the richer data.

`weak_areas` / `strong_areas` entry (per-program row, `course_id` set):
```jsonc
{
  "competency": "scrum:framework",   // Axis-1 slug — the new authoritative key
  "topic": "Scrum Framework",        // human label (keeps legacy `topic` field populated)
  "metaCategory": "foundations",     // Axis-2 key from COMPETENCY_TAXONOMY.md §3, resolved at rollup time
  "accuracy": 0.58,                  // 0..1 over the window
  "score": 58,                       // legacy 0..100 mirror = round(accuracy*100) for old readers
  "attempts": 12,                    // questions answered in this competency
  "lastTested": "2026-05-31T...",
  "trend": [ { "date": "...", "accuracy": 0.4 }, { "date": "...", "accuracy": 0.58 } ]
}
```
Cross-program row (`course_id IS NULL`): identical shape but keyed by `metaCategory` (Axis-2), rolling
up every program's matching Axis-1 slugs into one comparable view.

`quiz_accuracy_trend` stays `[{date, score, quizId}]` (unchanged contract).

Fields **not** owned by this phase — leave to their current owners, do not double-write:
`struggle_events`, `consecutive_failures`, `needs_intervention`, `review_queue`, `engagement_score`,
`learning_style`. (Note the **pre-existing** `consecutive_failures` double-write between the hook's
`recordQuizResult` and `recordStruggle`; Phase-2 should NOT add a third writer — if it touches
intervention signals at all, that's a separate, later decision.)

This shape feeds Phase-3 directly: a recommender reads `weak_areas` (sorted by `accuracy` asc, filtered
`attempts >= min`), maps each `competency`/`metaCategory` to rev-isit content, and phrases "revisit X,
you're weak in Y" from `topic` + `trend` direction. No further reshape needed for Phase-3.

---

## Where the rollup runs (the main architectural decision)

| Option | How | Pros | Cons | Verdict |
|---|---|---|---|---|
| **A. Incremental on submit** | Phase-1's submit path (client `Quiz.tsx`, or a server `submit-quiz`) recomputes the affected competencies for that user right after inserting answer rows | Profile always fresh; cheap per write (only touched competencies) | Couples capture to rollup — a rollup bug can break submit UX if not isolated; client-side recompute re-exposes the "client writes profile" smell; concurrency on the single profile row | Viable but risky to bolt onto the client submit |
| **B. Scheduled / triggered batch** | A `recompute-learning-profiles` edge function (service role) runs on cron (e.g. nightly) and/or is invoked after submit; full or incremental re-roll per user | Decoupled from submit; service-role bypasses RLS just like admin-analytics; one place to own thresholds; can backfill historical attempts in one pass | Profile is stale between runs (acceptable for strengths/weaknesses — not real-time data); needs a scheduler entry | **RECOMMENDED** |
| **C. Compute-on-read** | No stored rollup; compute weak/strong from `quiz_attempt_answers` each time the UI/Phase-3 asks | Zero staleness, zero write path, no profile drift | Recomputes every read; can't cheaply do cross-program without scanning; throws away the JSONB columns the brief wants populated; Phase-3 recommender pays the cost on every call | Rejected as primary (good as a fallback/debug view) |

**Recommendation: B — a service-role batch rollup, invoked two ways:**
1. **Triggered (near-real-time enough) — prefer a DB `AFTER INSERT` trigger on `quiz_attempt_answers`,
   NOT a client-submit hook.** Capture is currently **client-side** (`Quiz.tsx` writes the grain directly;
   the server `submit-quiz` function is dormant/uninvoked — see SECOND FINDING). A DB-side trigger that
   enqueues the affected `user_id` therefore fires regardless of *which* client or path wrote the rows,
   keeps the profile fresh within seconds, and keeps rollup logic out of the client entirely. A
   "fire-and-forget from the submit path" would mean editing client code and re-exposes the "client
   writes profile" smell — avoid it unless/until submit is moved server-side (e.g. by reviving
   `submit-quiz`).
2. **Scheduled sweep:** a nightly run re-rolls all active users — self-heals missed triggers, applies
   threshold/vocabulary changes retroactively, and does the **initial backfill** over all historical
   `quiz_attempt_answers`.

> **⚠️ No scheduler exists in-repo yet.** `supabase/config.toml` has only four `[functions.*]` blocks
> (verify_jwt-type config), none scheduled, and there is no `pg_cron` setup committed. Approach B's
> "nightly cron" is a **task to stand up**, not an existing facility — choose and provision one
> (Supabase scheduled functions / `pg_cron` / external scheduler) as part of the trigger+schedule step.
> The send-reminder edge functions exist but their scheduling (if any) lives outside this repo, so they
> are not a usable precedent.

This mirrors the proven `admin-analytics` shape (service-role, cross-user aggregation, RLS-bypassing
read) and keeps the client out of the profile-write business entirely — directly addressing the
"dormant client rollup is a draft to supersede" finding. The function is the **single owner** of
`weak_areas`/`strong_areas`/competency-trend writes.

Per-user incremental within the function: only recompute competencies whose answer rows changed since
`updated_at` (cheap), full re-roll on the nightly sweep.

---

## Testing — synthetic-data harness (don't wait for real attempts)

There is almost **no live grain to test against** (the only test attempt was deleted, and P2.1 removed the
old Module-1 filler questions and their answer rows). Capture is live, but real volume is far off and the
thresholds need volume to exercise (`attempts >= 3` per competency; rolling window N=50). So **validate the
rollup with controlled synthetic data**, not by waiting.

Approach:
- **Disposable test `user_id`.** Use a dedicated test account; never a real student. All synthetic rows
  carry that `user_id` so they're trivially isolated and removable.
- **Hand-built `quiz_attempts` + `quiz_attempt_answers`** with *known* competencies and *known* accuracies,
  so the expected output is computable by hand. Suggested fixtures (all `competency` non-null, Scrum slugs):
  - `scrum:roles` → **3 correct / 10 answered** = 0.30 accuracy, 10 attempts → **must flag WEAK**
    (`< 0.70`, `attempts >= 3`).
  - `scrum:events` → **9 / 10** = 0.90, 10 attempts → **must flag STRONG** (`>= 0.90`, `attempts >= 3`).
  - `scrum:team-dynamics` → **2 / 2** = 1.0 but only **2 answered** → **must stay NEUTRAL** (fails the
    `attempts >= 3` min-sample guard — proves one lucky/unlucky pair can't flag a competency).
  - (Optional) one `competency = NULL` answer row for the same user → **must NOT appear** in any
    weak/strong list (proves the `WHERE competency IS NOT NULL` filter; no phantom bucket).
- **Assert against hand-computed expectations**, not eyeballing: after running the rollup for that user,
  the per-program profile row should list `scrum:roles` weak (accuracy 0.30, attempts 10), `scrum:events`
  strong (0.90, 10), neither for `scrum:team-dynamics`, and nothing for the NULL row; the cross-program
  (`course_id IS NULL`) row should mirror via the §3 Axis-2 keys (`roles-accountabilities` weak,
  `process-execution` strong).
- **Per canon, the synthetic rows are DB writes** — deliver them as reviewable SQL the human applies (no
  auto-apply), scoped to the test `user_id`, and **cleanly deletable** with the same child-then-parent,
  user-scoped delete pattern proven in P2.1 (`quiz_attempt_answers` by `attempt_id`, then `quiz_attempts`
  by `user_id`). Keep synthetic data out of production aggregates (admin-analytics) — scope or tear down
  after the test.
- **Idempotency check:** run the rollup twice against the same fixtures — output must be identical
  (no double-counting, arrays stay capped).

This makes Phase-2 testable today, deterministically, without depending on real student traffic.

---

## Build sequence (each step independently shippable)

0. **GATE:** ✅ already met — Phase-1 capture is live (bc8365b); `quiz_attempt_answers` rows accrue per
   submit. (Was "verify capture writes rows"; now done — see DEPENDENCY STATUS.)
1. **Question tagging (ongoing content work, not a one-time "backfill").** Populate
   `quiz_questions.competency` with Axis-1 slugs, program by program. **Scrum Module 1 is done** (P2.1:
   live + seed-synced in f591921); Scrum Modules 2–4 and the other ~30 programs remain. **Important per
   CLAUDE.md:** this tags the *question*, which is snapshotted onto *future* attempts only — it is **not**
   a backfill of past `quiz_attempt_answers` (those are immutable snapshots and stay NULL). Method is
   tagging-tool's choice (`UPDATE quiz_questions SET competency=…` for the question is fine, or
   delete+insert as P2.1 did); either way only post-tag submits carry the slug. **Data only**, no schema.
2. **Axis-2 resolution** — the map already exists in `COMPETENCY_TAXONOMY.md` §3; the rollup **reads/mirrors
   the canon map**, it does not author a new one (see "Vocabulary alignment"). No schema.
3. **Rollup function** — `recompute-learning-profiles` edge function (service role): read
   `quiz_attempt_answers` **filtered `WHERE competency IS NOT NULL`** (+ parent `quiz_attempts` for
   user/date), aggregate per competency, apply thresholds, resolve Axis-2 from §3, upsert per-program
   (`course_id`) and cross-program (`course_id IS NULL`) profile rows. Idempotent; safe to re-run. Owns
   only the weak/strong/trend fields.
4. **Trigger + schedule** — prefer a **DB `AFTER INSERT` trigger on `quiz_attempt_answers`** (enqueue the
   `user_id`) over a client hook, since capture is client-side. **Provision a scheduler** for the nightly
   sweep + one-time historical backfill — none exists in-repo today (see the ⚠️ note under "Where the
   rollup runs"), so this step includes choosing/standing one up (Supabase scheduled functions / `pg_cron`
   / external).
5. **Rewire the read side (small)** — pass the live `learningProfile` into `SmartSidebar`
   (`VideoPlayer.tsx:854` currently omits it) and/or surface weak/strong in a student modal. This is the
   step that takes the layer from dormant to visible; it can land independently once profiles are
   populated. (Decommission or repoint the legacy `useLearningProfile.recordQuizResult` writer so two
   systems don't fight over the row.)
6. **Roll out** — backfill competency tags for the remaining programs; the rollup is program-agnostic
   and picks them up automatically (same "data, not code" property as the Final-Exam plan's Decision 4).

---

## Risks / watch items

- **Empty-until-tagged.** With `competency` null (Phase-1 default), the rollup yields nothing. Don't
  ship the read-side UI (step 5) before at least the pilot is tagged, or students see an empty/ broken
  "weaknesses" panel. Gate the UI on non-empty profiles.
- **Two writers on one row.** The legacy client hook and the new server function both target
  `student_learning_profiles`. If the hook is ever re-mounted (it auto-creates rows and writes
  weak/strong on `recordQuizResult`), it will clobber server output. **Decommission/repoint the hook's
  writers** as part of step 5; keep its read mapping if reused.
- **`consecutive_failures` collision (pre-existing).** Already double-incremented by the hook's
  `recordQuizResult` + `recordStruggle`. Phase-2 must not add a third writer to intervention fields;
  scope Phase-2 strictly to weak/strong/competency-trend.
- **Window/threshold tuning.** 0.70/0.90 and N=50 are starting points mirroring existing cuts; expose
  them as constants in the function so tuning is a one-line change, and log the chosen window so admin
  can audit why a competency flagged weak.
- **Profile-row concurrency.** A submit-triggered recompute racing the nightly sweep can interleave
  writes. Upsert per-competency-merge (read-modify-write the JSONB) under the `UNIQUE(user_id,course_id)`
  row; prefer the function computing the full array and writing it atomically over piecemeal edits.
- **Cross-program row semantics.** The `course_id IS NULL` profile is reused as the global/cross-program
  store. Confirm nothing else assumes "null course_id = default per-course profile" before overloading
  it (the hook's `fetchProfile` already treats null course_id as a valid global row, so this is
  consistent — but verify any future reader).
- **Backfill cost.** The one-time historical sweep scans all `quiz_attempt_answers`; the
  `(competency, is_correct)` index from Phase-1 supports the grouping, but run it off-peak and per-user
  batched.

---

## What is explicitly NOT in this phase

- No new table (reuse `student_learning_profiles`; the optional `competency_catalog` lookup is a
  later convenience, not a per-student store, and not built here).
- No schema change (Phase-1 already added the grain + `competency`; Axis-2 is resolved at rollup time).
- No real-time/streaming analytics (strengths/weaknesses tolerate minutes/hours of staleness).
- No intervention/engagement logic (those fields stay with their current owners).
- No Phase-3 recommender (this phase only produces the shape Phase-3 will consume).
- Nothing applied. Design only, pending review.
