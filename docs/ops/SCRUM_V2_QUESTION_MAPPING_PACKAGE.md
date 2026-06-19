# Scrum v2 Question-Mapping — Apply Package (Path B)

> **Reviewable apply package — Claude Code does not auto-apply SQL.** The founder
> runs each block by hand in the Supabase SQL editor. **No production data is
> modified by merging this doc.**

## 1. Executive summary

**Path B is confirmed** by the read-only pre-flight:

| flagship | modules | lessons | chapter_end quizzes | mapped questions |
| --- | --- | --- | --- | --- |
| `f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14` (v2) | 18 | **162** | **18** | **0** |

So lessons and quizzes already exist — the **only** missing piece is **question
mapping**. We do **not** run `20260619010000` (it would duplicate the 162 lessons +
18 quizzes).

**Key result of the investigation:** `20260619020000` is **safe to reuse as-is**
for Path B. It inserts **0 videos and 0 quizzes** — only **100 `quiz_questions`** —
and it targets the **existing** quizzes via
`WHERE course_id = <flagship> AND chapters.order_index = N AND quizzes.quiz_type='chapter_end'`.
Because the v2 flagship already has the 18 `chapter_end` quizzes, those lookups
resolve to the live quizzes. It creates nothing structural.

- The 100 questions are **inline** in `20260619020000` (hardcoded `INSERT VALUES`,
  authored from `seed-scrum-course`). There is no separate question-bank table.
- Coverage is **partial**: 100 questions across **7 of 18** modules
  (order_index 1, 2, 4, 10, 12, 13, 18). **Not** the 1,080-question bank.
- The **only** gap is idempotency: `quiz_questions` has **no UNIQUE constraint**,
  so re-running would duplicate. This package adds a **guard block** that aborts
  if any questions are already mapped.

## 2. Pre-flight SQL (READ-ONLY — run first, change nothing)

```sql
-- (a) exactly one flagship, expected id, published
SELECT count(*) AS flagship_count FROM public.courses WHERE is_flagship = true;            -- expect 1
SELECT id, title, is_flagship, is_published FROM public.courses WHERE is_flagship = true;
-- expect id = f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14, is_published = true

-- (b) old Scrum rows unpublished
SELECT id, title, is_published FROM public.courses
WHERE title ILIKE '%scrum%' AND is_flagship = false;                                       -- expect all false

-- (c) structure + current counts (expect 18 / 162 / 18 / 0)
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT
  (SELECT count(*) FROM public.chapters ch WHERE ch.course_id=(SELECT id FROM f))                                                                          AS modules,
  (SELECT count(*) FROM public.videos v JOIN public.chapters ch ON ch.id=v.chapter_id WHERE ch.course_id=(SELECT id FROM f))                                AS lessons_now,
  (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f) AND q.quiz_type='chapter_end') AS chapter_quizzes_now,
  (SELECT count(*) FROM public.quiz_questions qq JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f)) AS questions_now;

-- (d) the 7 target modules each HAVE a chapter_end quiz to map onto (expect 7 rows)
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT ch.order_index, q.id AS quiz_id
FROM public.chapters ch
JOIN public.quizzes q ON q.chapter_id = ch.id AND q.quiz_type='chapter_end'
WHERE ch.course_id=(SELECT id FROM f) AND ch.order_index IN (1,2,4,10,12,13,18)
ORDER BY ch.order_index;

-- (e) no question already mapped to an UNPUBLISHED old Scrum course (expect 0)
SELECT count(*) AS leaked FROM public.quiz_questions qq
JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id
JOIN public.courses c ON c.id=ch.course_id
WHERE c.is_flagship = false AND c.title ILIKE '%scrum%';
```

## 3. Hard-stop gates

- 🛑 STOP if `flagship_count <> 1`.
- 🛑 STOP if flagship id ≠ `f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14`.
- 🛑 STOP if `modules <> 18`.
- 🛑 STOP if `lessons_now <> 162` (this is the populated v2 course we expect).
- 🛑 STOP if `chapter_quizzes_now <> 18`.
- 🛑 STOP if `questions_now > 0` — questions already mapped; do **not** re-insert
  (no UNIQUE constraint ⇒ would duplicate). The guard block (§4) enforces this.
- 🛑 STOP if pre-flight (d) returns fewer than 7 rows — a target module has no
  `chapter_end` quiz, so `020000` would skip/fail that module.
- 🛑 STOP if any old Scrum row is still `is_published = true`.
- 🛑 STOP if the SQL cannot prove what it will touch before inserting.

## 4. Proposed apply SQL

`020000` already maps onto the existing v2 quizzes and creates no lessons/quizzes,
so the apply is: **(1) run the idempotency guard, then (2) paste `020000` verbatim.**

**Step 1 — idempotency guard (paste-ready; aborts if anything is already mapped):**
```sql
DO $$
DECLARE cid uuid; existing int;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE is_flagship ORDER BY created_at LIMIT 1;
  IF cid IS NULL THEN RAISE EXCEPTION 'No flagship course found'; END IF;
  IF cid <> 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14' THEN
    RAISE EXCEPTION 'Flagship id % is not the expected v2 course — aborting', cid;
  END IF;
  SELECT count(*) INTO existing
  FROM public.quiz_questions qq
  JOIN public.quizzes q  ON q.id = qq.quiz_id
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid;
  IF existing > 0 THEN
    RAISE EXCEPTION 'Flagship already has % mapped question(s) — aborting to avoid duplicates', existing;
  END IF;
  RAISE NOTICE 'Guard passed: 0 questions mapped — safe to apply 20260619020000.';
END $$;
```

**Step 2 — only if the guard passed (no exception):** paste the **entire** contents
of `supabase/migrations/20260619020000_flagship_scrum_questions_mapped.sql` verbatim
and run it. (Referenced rather than duplicated here to avoid doc/file drift; diff
the pasted text against the repo file if you wish.)

This package does **not**: insert lessons, insert quizzes, delete any rows, touch
`user_progress`, modify course titles, or reference old courses (the targeting is
by the flagship `course_id` only).

## 5. Verification SQL (run after Step 2)

```sql
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT
  (SELECT count(*) FROM public.quiz_questions qq JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f)) AS questions,             -- expect 100
  (SELECT count(DISTINCT ch.id) FROM public.quiz_questions qq JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f)) AS modules_with_questions,  -- expect 7
  (SELECT count(*) FROM public.chapters ch WHERE ch.course_id=(SELECT id FROM f))                                                                          AS modules,             -- still 18
  (SELECT count(*) FROM public.videos v JOIN public.chapters ch ON ch.id=v.chapter_id WHERE ch.course_id=(SELECT id FROM f))                                AS lessons,             -- still 162
  (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f) AND q.quiz_type='chapter_end') AS chapter_quizzes;     -- still 18

-- questions per module (expect rows for 1,2,4,10,12,13,18)
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT ch.order_index AS module, count(qq.*) AS questions
FROM public.chapters ch JOIN public.quizzes q ON q.chapter_id=ch.id
LEFT JOIN public.quiz_questions qq ON qq.quiz_id=q.id
WHERE ch.course_id=(SELECT id FROM f) GROUP BY ch.order_index ORDER BY ch.order_index;

-- safety: 0 questions on unpublished old courses; old rows still unpublished
SELECT count(*) AS leaked FROM public.quiz_questions qq
JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id
JOIN public.courses c ON c.id=ch.course_id
WHERE c.is_flagship=false AND c.title ILIKE '%scrum%';                      -- expect 0
SELECT id, is_published FROM public.courses WHERE title ILIKE '%scrum%' AND is_flagship=false;  -- still false

-- no duplicate mapping (same quiz + same question_text appearing >1)
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT qq.quiz_id, qq.question_text, count(*) FROM public.quiz_questions qq
JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id
WHERE ch.course_id=(SELECT id FROM f)
GROUP BY qq.quiz_id, qq.question_text HAVING count(*) > 1;                  -- expect 0 rows
```

## 6. Expected `/founder/truth` changes

| Probe | Before | After |
| --- | --- | --- |
| Modules | backed (18) | backed (18) — unchanged |
| Lessons | backed (162) | backed (162) — unchanged |
| Quizzes (chapter_end) | 18 | 18 — unchanged |
| Modules with questions | 0/18 | **7/18** |
| Exam question bank | unsupported | **partial** (100 live vs 1,080 claimed) |
| Capstone / sims / labs / portfolio / translations | unsupported | unchanged (separate work) |

**No** claim reaches "fully backed." The 1,080-question and full-exam-bank claims
remain flagged by design. This maps the authored 100 only.

## 7. Rollback notes

Remove **only** the mappings this package inserted — never delete quizzes,
lessons, course rows, or `user_progress`.

```sql
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
DELETE FROM public.quiz_questions qq
USING public.quizzes q, public.chapters ch
WHERE qq.quiz_id = q.id AND q.chapter_id = ch.id AND ch.course_id = (SELECT id FROM f);
```
> Safe because the flagship had **0** mapped questions before apply (the §3/§4
> gate), so this deletes exactly the 100 just inserted. Do **not** run it if the
> course had pre-existing questions.

## 8. Founder runbook (Supabase SQL Editor)

1. **Pre-flight** — paste §2 (a–e). Confirm 18 / 162 / 18 / **0**, 7 quiz rows in (d), 0 leaked.
2. **Gate** — apply §3. If `questions_now > 0` → STOP.
3. **Guard** — paste §4 Step 1. It must print *"Guard passed"* (no exception).
4. **Apply** — paste the full contents of `…20260619020000…sql`. Run.
5. **Verify** — paste §5. Expect 100 questions, 7 modules, lessons still 162, quizzes still 18, 0 leaked, 0 duplicates.
6. Open **`/founder/truth`** and compare against §6; screenshot.

---

**Bottom line:** `020000` is the correct, structurally-safe tool for the populated
v2 course (it maps to existing quizzes, creates no lessons/quizzes). Run the §4
guard first so it can never double-insert. Result: **100 questions across 7/18
modules — partial, honest, no claim inflation.**
