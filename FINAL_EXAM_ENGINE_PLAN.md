# Final Exam Engine — Design Plan (review-locked, NOT yet applied)

Status: approved design, nothing applied. Build in a future session. Companion to `PHASE1_WIRING_PLAN.md`.

Locked recommendations:
- **Decision 1 = C-minimal** — `course_id` + `is_final_exam` boolean + drop `chapter_id` NOT NULL, keep `quiz_type='chapter_end'` so the enum and CHECK stay untouched.
- **Decision 2 = stateful blueprint** — `get-final-exam` / `submit-final-exam` edge functions.
- **Decision 3 = course-scoped predicate query + completion gating**, and fix the chapter-quiz path to select by `quiz_type` predicate, not `quizzes[0]`.

---

## ⚠️ CRITICAL — RLS lock has a hard prerequisite (read before building)

Protecting the exam answer key requires re-asserting `quiz_questions` RLS to `FOR SELECT USING (false)` so the pool + key are server-only. **Doing that will BREAK the existing chapter quizzes.**

Why: today's `Quiz.tsx` fetches questions **client-side via `.select('*')`** and only works because the **live RLS has drifted open** (the migration says `USING(false)`, but the live policy is permissive — see `quiz-schema-notes` memory). Locking RLS back to `USING(false)` cuts off that client fetch and every chapter quiz stops loading questions.

**Ordering dependency:** RLS lock is blocked until the chapter-quiz fetch is migrated off `.select('*')` and onto the **`get-quiz-questions`** edge function (which already strips the answer key). That migration is chapter-quiz work that belongs with / immediately after **`PHASE1_WIRING_PLAN.md`**, not inside this plan.

Sequence across the two plans:
1. PHASE-1 wiring (attempts capture + `passing_score` threshold fix).
2. Migrate chapter-quiz question fetch from client `.select('*')` → `get-quiz-questions` edge function.
3. **Only then** re-assert `quiz_questions` RLS `USING(false)`.
4. Build this final-exam engine on top of the now-server-only question access.

Skipping step 2 and locking RLS first = broken chapter quizzes in production.

---

## Key discovery that shapes the design

The server-side grading infrastructure already exists and is the *intended* design:
- **`get-quiz-questions`** — fetches questions with the answer key stripped (`select id, quiz_id, question_text, scenario_context, options, explanation, order_index` — no `correct_answer_index`).
- **`submit-quiz`** — server-grades against `passing_score`, never leaks the key, writes `quiz_attempts` + `user_progress`.
- Migration sets `quiz_questions` RLS to `FOR SELECT USING (false)` — "No direct access to quiz questions (use edge function)."

Today's `Quiz.tsx` bypasses both (client `.select('*')` + local grading), surviving only on the drifted-open RLS. A certification final exam cannot tolerate a client-side answer key, so the exam is built the way the chapter quiz was *originally* designed: server draw + server grade.

---

## Decision 1 — `final_exam` tier vs `chapter_id NOT NULL` (LOCKED: C-minimal)

Constraint surface:
```sql
quizzes.chapter_id  UUID NOT NULL          -- a final exam has no chapter
quiz_type           ENUM('mini_video','chapter_end')   -- no final_exam value
CHECK ( (mini_video AND video_id NOT NULL) OR (chapter_end AND video_id IS NULL) )
```
A final exam is course-scoped, but every quiz is forced to hang off a chapter.

| Option | Migration | Tradeoffs |
|---|---|---|
| A. Full enum — `ALTER TYPE quiz_type ADD VALUE 'final_exam'` + add `course_id` + drop `chapter_id` NOT NULL + rewrite CHECK | Heavy | Most "textbook," but enum `ADD VALUE` is irreversible and historically can't run in a txn block; also forces a CHECK rewrite. High risk against a constraint `submit-quiz`/ChapterView depend on, for no gain over a boolean. |
| B. Sentinel chapter — one real `chapters` row per course (`is_exam=true`) | Light schema | Pollutes every `chapters` query app-wide. `PortalCourseDetail` does `chapters.map(...)` — the sentinel renders as a phantom "module" unless every listing query filters it. Fragile. |
| **C-minimal. Boolean + course_id, no enum/CHECK surgery** ⭐ LOCKED | Light | `ADD course_id` (nullable FK), `ADD is_final_exam bool DEFAULT false`, `DROP NOT NULL` on `chapter_id`. Keep `quiz_type='chapter_end'` → `video_id IS NULL` → existing CHECK still passes untouched. No enum mutation, no CHECK rewrite — only the NOT-NULL relax. |
| D. Separate tables — `final_exams` + own pool | Medium-heavy | Cleanest isolation, zero risk to `quizzes`, but duplicates/generalizes `get-quiz-questions`, `submit-quiz`, `quiz_attempts`, RLS. Most code; loses the reuse that makes this cheap. |

### Locked: C-minimal

A final exam stays a row in `quizzes` with children in `quiz_questions`, so the existing fetch + grade + attempts machinery is reused verbatim (rules out D). C-minimal is the only option touching neither the irreversible enum nor the CHECK:

```sql
ALTER TABLE quizzes ADD COLUMN course_id UUID REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE quizzes ADD COLUMN is_final_exam BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE quizzes ALTER COLUMN chapter_id DROP NOT NULL;
```
Final exam = `quiz_type='chapter_end'`, `video_id NULL` (CHECK happy), `chapter_id NULL`, `course_id` set, `is_final_exam=true`. Dropping NOT-NULL is non-destructive. The only real cost is auditing code that assumes `chapter_id` is present (see Decision 5).

---

## Decision 2 — Pooling / shuffle engine + where the draw happens (LOCKED: stateful blueprint)

**Where: server-side, non-negotiable.** A client-side draw ships the full pool incl. answer key to the browser — fatal for a certification exam and contrary to `USING(false)`. The draw extends the `get-quiz-questions` pattern.

**Grading problem:** if the server shuffles questions and options, the client only sees shuffled indices — how does grading know what's correct?

- **Stateful blueprint** ⭐ LOCKED — at exam start the server draws + shuffles, persists the per-attempt blueprint (drawn question IDs, option permutation, correct index *in shuffled space*), and returns a pending `attemptId` + sanitized questions. At submit, server loads the blueprint and grades selected-index against stored shuffled-correct-index. Key never leaves the server; full audit trail for free.
- Stateless signed token (rejected) — HMAC token echoed back at submit; no DB write at draw time but needs a signing secret + anti-replay; easy to get subtly wrong.

### Flow

1. **`get-final-exam`** (new, generalizes `get-quiz-questions`):
   - Auth user → load full pool (service role) for the exam's `quiz_id`.
   - Fisher-Yates draw N of pool (N a config column, e.g. 25 of 60).
   - Shuffle question order; for each question shuffle options, computing `newCorrect = perm.indexOf(oldCorrectIndex)`.
   - Create a pending `quiz_attempts` row; store the blueprint (drawn IDs + per-question shuffled-correct-index + option order) in a dedicated `exam_blueprint JSONB` column.
   - Return `{ attemptId, questions }` — questions carry no correct index.
2. **`submit-final-exam`** (new, generalizes `submit-quiz`): takes `attemptId + answers`, loads blueprint, grades against shuffled-correct indices, updates the attempt (`score/passed`), writes `user_progress`, and (per PHASE-1) the `quiz_attempt_answers` rows with `competency` snapshots.

**Option remap, concretely:** `newOptions[i] = oldOptions[perm[i]]`; new correct position = `perm.indexOf(oldCorrectIndex)`. Store that integer in the blueprint so grading is a plain `selected === stored` compare; remediation still maps back to `explanation`.

**"No two attempts repeat":** treated as statistical, not enforced — a 60→25 draw plus per-question option shuffles makes collisions negligible under a per-attempt random seed. A hard "never repeat a drawn set" guard (store/compare drawn-set hashes per user) is complexity for no practical gain. (`Date.now()`/`Math.random()` are fine inside the Deno edge function.)

---

## Decision 3 — "Final Exam" UI + dodging the `quizzes[0]` collision (LOCKED)

**The bug** (ChapterView.tsx:749): the chapter query returns all quizzes for a chapter (`mini_video` + `chapter_end`), then opens `quizzes[0].id` — index access, so a video quiz at `[0]` opens the wrong quiz. Root cause: selecting by position instead of by type.

**The final exam sidesteps it by construction:**
- `chapter_id IS NULL`, so it never appears in ChapterView's `eq('chapter_id', chapterId)` query — different surface entirely.
- It renders on `PortalCourseDetail`, after the `chapters.map(...)` list, as a dedicated bar, fed by a single-row predicate query (never an index):
  ```ts
  supabase.from('quizzes')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_final_exam', true)
    .maybeSingle()
  ```
- **Gating:** enable only when prerequisites are met (all chapters / required `chapter_end` quizzes present in `user_progress`); otherwise render locked with a "complete all modules" state.
- A new `FinalExam` route reuses the `Quiz.tsx` presentation but sources questions from `get-final-exam` and submits via `submit-final-exam`.

**Adjacent fix to bake in:** the chapter quiz must select by predicate too — `quizzes.find(q => q.quiz_type === 'chapter_end')`, never `quizzes[0]`. Same discipline everywhere kills the bug class.

---

## Decision 4 — Generalizing to all 28 programs

The pattern is data, not per-program code:
- Each course optionally owns exactly one `is_final_exam` quiz (`course_id` set, `chapter_id NULL`), with a pool in `quiz_questions` (`quiz_id` → that quiz) larger than the draw count.
- Difficulty tuned per program via columns/config: `passing_score` and draw-count `N` — no code branches.
- Pools seeded through the existing `seed-*` edge-function pattern (one per program already exists). Adding a final-exam pool is one more seed step per course.
- `get-final-exam` / `submit-final-exam` are keyed on `quiz_id` and program-agnostic — written once, serve all 28.
- `PortalCourseDetail` renders the bar whenever the course has a final-exam quiz — automatic per program as its pool lands.

Scaling to 28 = author 28 question pools (data) + flip them on. Zero new code per program.

---

## Decision 5 — Build sequence & what could break

**Order (each step independently shippable):**
1. Migration — `course_id`, `is_final_exam`, `exam_blueprint JSONB`, draw-count config; `DROP NOT NULL` on `chapter_id`; index on `(course_id, is_final_exam)`. (Apply the pending PHASE-1 migration first if not yet live — ship both the file and paste-ready SQL.)
2. Pilot pool — seed one program's final exam (Scrum is the natural pilot) — data only.
3. Server — `get-final-exam` + `submit-final-exam` as new functions (not edits to the working chapter-quiz path).
4. Client — `PortalCourseDetail` final-exam bar (course-scoped predicate query + completion gating) + `FinalExam` route.
5. Roll out — seed pools across the remaining 27.

**What could break / watch items:**
- **`chapter_id` NOT-NULL drop** — audit every assumer. Enumerated safe: ChapterView's chapter-scoped query excludes null rows; `user_progress.chapter_id` already nullable; chapter `submit-quiz` untouched (exam uses its own function). Confirm no other query assumes non-null.
- **RLS drift is load-bearing** — see the CRITICAL flag at top. Exam secrecy depends on `quiz_questions` being server-only, but live RLS currently lets the client `.select('*')`. Re-assert `USING(false)` and route all exam question access through the edge function — but ONLY after the chapter-quiz fetch is migrated to `get-quiz-questions` (hard prerequisite, ordering dependency with PHASE1_WIRING_PLAN.md).
- **`passing_score` defaults to 100** — set it explicitly per exam (e.g. 70/80); don't inherit 100 by accident.
- **Pending-attempt orphans** — the begin/submit split creates pending `quiz_attempts` rows; abandoned exams leave danglers. Minor — a `started_at` + sweep, or tolerate.
- **Blueprint must live in its own column** (`exam_blueprint`), not overloaded into `answers`.
- **Enum/CHECK untouched** by design (boolean chosen), so no `ALTER TYPE`-in-transaction hazard.
