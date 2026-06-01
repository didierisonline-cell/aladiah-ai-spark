# Part 3 / Phase 1 — Quiz Write-Path Wiring (APPROVED PLAN — NOT YET APPLIED)

Status: **Approved, not applied.** This is the reviewable spec to apply in a fresh session.
Scope: wire quiz submission to capture attempts + per-question detail for the Prof. Didier
intelligence layer, and fix the pass-threshold split-brain. **Code only — one file (`Quiz.tsx`).**

---

## ⚠️ BIG RISK — READ BEFORE APPLYING (deliberate, watch-it-live action)

Shipping this **drops the pass threshold from the hardcoded `>= 100%`** (current `Quiz.tsx:132`)
**to each quiz's real `quizzes.passing_score`.** Many quizzes are seeded at **70**
(`seed_quizzes.cjs:442`). Consequences the moment this goes live:

- Students who "failed" at 70–99% on those quizzes will now **PASS**.
- `user_progress.passed` flips `true` more often → **chapter/quiz unlocks fire more**
  (`ChapterView.tsx:772` `onComplete(passed)` gating).
- This is the *correct* behavior, but it visibly changes who passes and what unlocks for
  **live students**. Apply intentionally, during a window you can watch — **not a blind deploy.**

**Apply order is mandatory:** the Phase-1 migration
(`supabase/migrations/20260531201551_quiz_attempt_answers_and_competency.sql`) must be
**applied and verified in the live DB FIRST**. This code inserts into `quiz_attempt_answers`
and reads `quiz_questions.competency`. Inserts are best-effort/non-fatal, so if the migration
isn't live, students can still finish quizzes but **capture silently no-ops**.

---

## Decision: Approach B — direct insert from `handleSubmit` (NOT revive `submit-quiz`)

Rationale (locked):
- Touches **one file**, no edge-function deploy. Avoids the `submit-quiz` JWT/deploy-history risk
  (it's not in `config.toml`, leans on default `verify_jwt`, and is almost certainly never deployed).
- Reuses the RLS shipped in the Phase-1 migration (owner INSERT on `quiz_attempts`,
  parent-scoped INSERT on `quiz_attempt_answers`).
- No security regression: the client **already** grades locally and **already** has
  `correct_answer_index` (`loadQuestions` does `select('*')`, `Quiz.tsx:61`).
- Phase 2 (optional, later): move grading server-side via `submit-quiz` for authoritative scoring
  (e.g. if certificates depend on it). No schema change needed for that.

---

## The exact diff (review, then apply)

### a) `Question` interface — carry the competency snapshot (already returned by `select('*')`)

```diff
 interface Question {
   id: string;
   question_text: string;
   scenario_context: string | null;
   options: string[];
   correct_answer_index: number;
   explanation: string | null;
   order_index: number;
+  competency: string | null;
 }
```

### b) `handleSubmit` (`Quiz.tsx:104-204`) — changed region

```diff
       const correctCount = results.filter(r => r.isCorrect).length;
       const score = Math.round((correctCount / questions.length) * 100);
-      const passed = score >= 100;
-
-      // Save progress if logged in
-      if (session) {
-        try {
-          // Get quiz details to find chapter_id and course_id
-          const { data: quizData } = await supabase
-            .from('quizzes')
-            .select('chapter_id, chapters(course_id)')
-            .eq('id', quizId)
-            .single();
-
-          const chapter_id = quizData?.chapter_id || null;
-          const course_id = (quizData?.chapters as any)?.course_id || null;
-
+
+      // Fetch quiz metadata once: passing threshold + chapter/course for progress
+      const { data: quizData } = await supabase
+        .from('quizzes')
+        .select('chapter_id, passing_score, chapters(course_id)')
+        .eq('id', quizId)
+        .single();
+
+      const passingScore = quizData?.passing_score ?? 100;
+      const passed = score >= passingScore;          // <- was hardcoded >= 100
+      const chapter_id = quizData?.chapter_id || null;
+      const course_id = (quizData?.chapters as any)?.course_id || null;
+
+      // Persist attempt + per-question detail + progress (best-effort; never blocks the results UI)
+      if (session) {
+        // 1) Intelligence-layer capture: attempt header + per-question rows
+        try {
+          const { data: attempt, error: attemptError } = await supabase
+            .from('quiz_attempts')
+            .insert({ user_id: session.user.id, quiz_id: quizId, answers, score, passed })
+            .select('id')
+            .single();
+          if (attemptError) throw attemptError;
+
+          const answerRows = questions.map((q, idx) => ({
+            attempt_id: attempt.id,
+            question_id: q.id,
+            selected_index: answers[idx],
+            correct_index: q.correct_answer_index,
+            is_correct: answers[idx] === q.correct_answer_index,
+            competency: q.competency ?? null,        // snapshot from quiz_questions.competency
+          }));
+          const { error: answersError } = await supabase
+            .from('quiz_attempt_answers')
+            .insert(answerRows);
+          if (answersError) console.error('Attempt answers save error:', answersError);
+        } catch (e) {
+          console.error('Attempt save exception:', e);
+        }
+
+        // 2) Progress (unchanged behavior): upsert score/passed for this quiz
+        try {
           const { data: existing } = await supabase
             .from('user_progress')
             .select('id')
             .eq('user_id', session.user.id)
             .eq('quiz_id', quizId)
             .maybeSingle();
@@  (existing user_progress insert/update block unchanged) @@
       if (passed) {
         toast({ title: '🎉 Congratulations!', description: `You scored ${score}%! You passed the quiz.` });
       } else {
-        toast({ title: 'Not quite there yet', description: `You scored ${score}%. You need 100% to pass. Try again!`, variant: 'destructive' });
+        toast({ title: 'Not quite there yet', description: `You scored ${score}%. You need ${passingScore}% to pass. Try again!`, variant: 'destructive' });
       }
```

Notes on the diff:
- The `user_progress` insert/update block is **unchanged**; it's only wrapped in its own `try`
  and the quiz fetch is moved above it so the threshold also drives the pass/fail **display** for
  logged-out users (one extra cheap `quizzes` read for anon users — acceptable).
- Each submit writes a **new** `quiz_attempts` row + N `quiz_attempt_answers` rows (attempt history
  is intentional; retries accumulate). `user_progress` stays upsert-by-quiz.

---

## What this fixes / does

1. **Threshold split-brain** → `passed = score >= (quizzes.passing_score ?? 100)`, and the failure
   toast reads `You need ${passingScore}%`. DB-persisted `passed` and on-screen result now agree.
2. **Competency snapshot** → `q.competency ?? null` copied into each `quiz_attempt_answers` row at
   insert time (no extra query; survives later tag edits / random-subset draws). Null until questions
   are tagged; non-null for the final-exam pool / tagged questions.
3. **Capture goes live** → `quiz_attempts` (currently written by nothing) + `quiz_attempt_answers`
   now populated on every authenticated submit.

---

## Other risks (beyond the threshold change at top)

- **Partial failure:** attempt header inserts but answer rows fail → header with no detail. Logged,
  non-fatal. Phase 2 could wrap both in an RPC for atomicity.
- **Anonymous users:** no session → no writes (unchanged); just see the correct threshold in the toast.

---

## Post-change verification

**Click:**
1. As a test student, take a `passing_score=70` chapter quiz, score ~70–80% → expect **pass** + congrats toast (proves threshold fix).
2. Take one and score below threshold → expect **fail** toast reading the real `%`.

**Read-only queries (as that user, RLS-scoped):**
```sql
-- newest attempt
select id, quiz_id, score, passed, created_at
from quiz_attempts where user_id = auth.uid()
order by created_at desc limit 1;

-- per-question detail: one row per question, correct flags + competency snapshot
select question_id, selected_index, correct_index, is_correct, competency
from quiz_attempt_answers where attempt_id = '<id from above>'
order by created_at;

-- analytics rollup works
select competency, count(*) filter (where not is_correct) as wrong, count(*) as total
from quiz_attempt_answers where attempt_id = '<id>' group by competency;

-- progress still written
select quiz_id, score, passed, completed_at
from user_progress where user_id = auth.uid() and quiz_id = '<quizId>';
```
Expect: one attempt row; one answer row per question with matching `is_correct`; `competency` null
until tagged; `user_progress` updated as before.

---

## Dependencies / sequencing recap

1. Apply + verify migration `20260531201551_quiz_attempt_answers_and_competency.sql` in live DB.
2. Apply this `Quiz.tsx` diff.
3. Watch live (threshold/unlock behavior change) + run the verification above.
4. (Later) Backfill `quiz_questions.competency` going forward; Phase 2 = optional server-side grading.
