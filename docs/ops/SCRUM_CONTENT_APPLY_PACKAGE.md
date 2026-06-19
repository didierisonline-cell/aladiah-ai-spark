# Scrum Lessons/Quizzes + Question-Mapping — Apply Package

> **Reviewable apply package — Claude Code does not auto-apply SQL.** The founder
> runs each block by hand in the Supabase SQL editor and runs the verification
> `SELECT`s. **No production data is modified by merging this doc.**

## 1. Executive summary

This package prepares the **manual** apply of two migrations that already exist in
`main` but have **not** been applied to the live DB:

1. `supabase/migrations/20260619010000_flagship_scrum_lessons_quizzes.sql` —
   inserts **72 lessons** (18 modules × 4 videos) + **18 module `chapter_end` quizzes**.
2. `supabase/migrations/20260619020000_flagship_scrum_questions_mapped.sql` —
   inserts **100 authored questions**, mapped onto **7 of the 18 modules**
   (order_index 1, 2, 4, 10, 12, 13, 18).

Both target the flagship via `WHERE is_flagship ORDER BY created_at LIMIT 1`
(stable flag, **not** a title match). `020000` depends on the `chapter_end`
quizzes that `010000` creates, so **order matters**.

- ❌ This does **not** create a 1,080-question bank — it maps the **100** currently
  authored questions only. `/founder/truth` will still show the question claim as
  partial. That is correct and intended.
- ❌ It does not author capstone/simulations/labs/portfolio (separate future work).

## 🛑 2. CRITICAL FINDING — read before anything (likely a HARD STOP)

These migrations were written for the **migration-created** flagship: a clean
18-chapter course with **zero** lessons and **zero** quizzes (created by
`20260619000000`, which titles it *"AI Enterprise Scrum Master & Agile
Transformation Leader"*).

**But the live flagship is a different, already-populated course:**
- title **"AI Scrum Master Professional Certification v2"** (not the migration's title)
- `/founder/truth` + the course page report **162 lessons** already visible.

`010000` only authors **72** lessons. **162 ≠ 72.** That strongly implies the live
"v2" flagship was seeded by some other process and **already has lessons/quizzes**.

Neither migration is idempotent — they `INSERT` unconditionally with **no**
`ON CONFLICT` / dedup. So if the flagship already has videos/quizzes, applying
`010000` would **add 72 more lessons + 18 duplicate quizzes** on top of the
existing 162 — corrupting the live course.

**➡️ Therefore: do NOT apply `010000`/`020000` until Pre-flight (§3) proves the
flagship currently has 0 videos and 0 `chapter_end` quizzes.** If it already has
lessons/quizzes, STOP — the live "v2" course needs a different reconciliation
(map questions onto its existing quizzes), not these seed migrations. Bring that
back as a separate package.

## 3. Pre-flight SQL checks (READ-ONLY — run first, change nothing)

```sql
-- (a) exactly one flagship, and it is the expected published course id
SELECT id, title, is_flagship, is_published
FROM public.courses WHERE is_flagship = true;
-- expect: exactly 1 row; id = f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14; is_published = true

SELECT count(*) AS flagship_count FROM public.courses WHERE is_flagship = true;  -- expect 1

-- (b) old Scrum seeds remain unpublished
SELECT id, title, is_published FROM public.courses
WHERE title ILIKE '%scrum%' AND is_flagship = false;   -- expect all is_published = false

-- (c) flagship structure + CURRENT content counts (the decisive numbers)
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT
  (SELECT count(*) FROM public.chapters ch WHERE ch.course_id = (SELECT id FROM f))                                   AS modules,
  (SELECT count(*) FROM public.videos v JOIN public.chapters ch ON ch.id=v.chapter_id WHERE ch.course_id=(SELECT id FROM f)) AS lessons_now,
  (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f) AND q.quiz_type='chapter_end') AS chapter_quizzes_now,
  (SELECT count(*) FROM public.quiz_questions qq JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f)) AS questions_now;
-- modules expect 18. lessons_now / chapter_quizzes_now / questions_now are the gate (see §4).
```

## 4. Hard-stop gates

- 🛑 STOP if `flagship_count <> 1`.
- 🛑 STOP if the flagship `id` ≠ `f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14`.
- 🛑 STOP if any old Scrum row is still `is_published = true`.
- 🛑 STOP if `modules <> 18`.
- 🛑 **STOP if `lessons_now > 0` or `chapter_quizzes_now > 0`** — the flagship is
  already populated; `010000` would duplicate. Reconcile separately (do **not**
  apply these seeds). This is the most likely outcome given the 162-lesson report.
- 🛑 STOP if `questions_now > 0` (020000 already applied / questions already present).
- 🛑 Do not proceed to `020000` until `010000` is verified (020000 needs its quizzes).

**Only if** `lessons_now = 0` AND `chapter_quizzes_now = 0` AND `questions_now = 0`
(a bare migration-created flagship) is it safe to continue.

## 5. Paste-ready SQL (verbatim from the repo — not reassembled)

The SQL is **exactly** the two migration files already in `main`. Apply each by
opening the file and pasting its **entire** contents into the Supabase SQL editor
(referenced rather than copied here to avoid any drift between this doc and the
canonical files):

1. `supabase/migrations/20260619010000_flagship_scrum_lessons_quizzes.sql`
   (one `DO $$ … END $$;` block — 72 video inserts + 18 quiz inserts; targets
   `WHERE is_flagship ORDER BY created_at LIMIT 1`).
2. `supabase/migrations/20260619020000_flagship_scrum_questions_mapped.sql`
   (adds `quiz_questions.translations` if missing, then one `DO $$ … END $$;`
   block — 100 question inserts across modules 1,2,4,10,12,13,18).

> Both files exist and are complete (146 / 145 lines). No SQL was invented for
> this package; if you prefer, diff the pasted text against the repo file before
> running.

## 6. Verification SELECTs

**After `010000`:**
```sql
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT
  (SELECT count(*) FROM public.videos v JOIN public.chapters ch ON ch.id=v.chapter_id WHERE ch.course_id=(SELECT id FROM f)) AS lessons,        -- expect 72 (on a bare course)
  (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f) AND q.quiz_type='chapter_end') AS chapter_quizzes;  -- expect 18
-- no duplicate quizzes (each chapter has exactly one chapter_end quiz):
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT ch.order_index, count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id=q.chapter_id
WHERE ch.course_id=(SELECT id FROM f) AND q.quiz_type='chapter_end' GROUP BY ch.order_index HAVING count(*) > 1;  -- expect 0 rows
```

**After `020000`:**
```sql
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT count(*) AS questions FROM public.quiz_questions qq
JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id
WHERE ch.course_id=(SELECT id FROM f);   -- expect 100

-- questions per module (expect 7 modules with questions: 1,2,4,10,12,13,18):
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT ch.order_index AS module, count(qq.*) AS questions
FROM public.chapters ch JOIN public.quizzes q ON q.chapter_id=ch.id
LEFT JOIN public.quiz_questions qq ON qq.quiz_id=q.id
WHERE ch.course_id=(SELECT id FROM f) GROUP BY ch.order_index ORDER BY ch.order_index;

-- safety: NO questions mapped onto an unpublished old Scrum course
SELECT count(*) AS leaked FROM public.quiz_questions qq
JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id
JOIN public.courses c ON c.id=ch.course_id
WHERE c.is_flagship = false AND c.title ILIKE '%scrum%';   -- expect 0
```

## 7. Expected `/founder/truth` changes (only on a bare flagship)

| Probe | Before | After |
| --- | --- | --- |
| Modules | backed (18) | backed (18) — unchanged |
| Lessons | live 0/72 | **72** (matches authored; claim of 162 stays a gap) |
| Quizzes (chapter_end) | 0 | **18** |
| Modules with questions | 0/18 | **7/18** (only the authored modules) |
| Exam question bank | unsupported | **partial** — 100 live vs 1,080 claimed (still flagged) |
| Capstone / sims / labs / portfolio / translations | unsupported | unchanged (separate work) |

**No** claim reaches "fully backed." The 162-lesson and 1,080-question gaps remain
visible by design.

## 8. Rollback notes

Scope rollback to the rows these migrations inserted — **never** delete the course
row or any `user_progress`.

```sql
-- Roll back 020000 (the 100 mapped questions) — flagship only:
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
DELETE FROM public.quiz_questions qq
USING public.quizzes q, public.chapters ch
WHERE qq.quiz_id=q.id AND q.chapter_id=ch.id AND ch.course_id=(SELECT id FROM f);

-- Roll back 010000 (the 72 lessons + 18 quizzes) — flagship only.
-- Delete quizzes first only if you also rolled back the questions above
-- (quiz_questions reference quizzes):
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
DELETE FROM public.quizzes q USING public.chapters ch
WHERE q.chapter_id=ch.id AND ch.course_id=(SELECT id FROM f) AND q.quiz_type='chapter_end';
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
DELETE FROM public.videos v USING public.chapters ch
WHERE v.chapter_id=ch.id AND ch.course_id=(SELECT id FROM f);
```
> ⚠️ These rollback deletes remove **all** flagship lessons/quizzes/questions — run
> them only if the flagship had none before you applied (the §4 gate). If the
> course was already populated, do **not** run these.

## 9. Founder runbook (Supabase SQL Editor)

1. **Pre-flight** — paste §3 (a,b,c). Read the output.
2. **Gate** — apply §4. If `lessons_now > 0` / `chapter_quizzes_now > 0` → **STOP**
   and reply with the counts; we reconcile the populated "v2" course separately.
3. If clear: paste the full contents of `…20260619010000…sql`. Run.
4. **Verify** — paste §6 "After 010000". Expect 72 lessons, 18 quizzes, 0 dup rows.
5. Paste the full contents of `…20260619020000…sql`. Run.
6. **Verify** — paste §6 "After 020000". Expect 100 questions, 7 modules covered, 0 leaked.
7. Open **`/founder/truth`** and screenshot; compare against §7.

---

**Bottom line:** the SQL is ready and verbatim from the repo, but the **most likely
correct action is to STOP at the §4 gate** — the live "v2" flagship appears already
populated (162 lessons), and these seed migrations are built for a bare course.
Run the pre-flight first; the counts decide everything.
