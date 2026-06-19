# Scrum v2 Content Reconciliation — Decision Package

> **Reviewable decision package — Claude Code does not auto-apply SQL.**
> **Do NOT apply any SQL until the founder runs the read-only pre-flight (§3) and
> we review the output together.** The live v2 flagship appears already populated
> (≈162 lessons), so **Path B is likely** and the bare-course seed must NOT run.

## ⚠️ Top warning

`supabase/migrations/20260619010000_flagship_scrum_lessons_quizzes.sql` seeds a
**bare** course (72 lessons + 18 quizzes) with **unconditional INSERTs and no
dedup**. The live flagship **"AI Scrum Master Professional Certification v2"**
(`f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14`) reportedly shows **162 lessons** —
i.e. already populated. **Applying 010000 to a populated course duplicates
content.** The pre-flight decides Path A vs Path B; counts are the only authority.

## 1. Verified state

- Merged: #31 (dashboard published-vs-historical), #32 (old-Scrum route guard),
  #33 (brand/homepage cleanup).
- Live student-facing Scrum flagship: **AI Scrum Master Professional Certification
  v2**, id `f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14`, `is_flagship=true`,
  `is_published=true`, 18 modules, ~162 lessons visible.
- Old Scrum rows: unpublished, preserved, not deleted.

## 2. The two migrations (already in `main`, NOT applied)

- `20260619010000_flagship_scrum_lessons_quizzes.sql` — 72 videos + 18
  `chapter_end` quizzes. Targets `WHERE is_flagship ORDER BY created_at LIMIT 1`.
  **Non-idempotent.**
- `20260619020000_flagship_scrum_questions_mapped.sql` — 100 authored questions
  across **7 of 18** modules (order_index 1,2,4,10,12,13,18). **Depends on the
  `chapter_end` quizzes 010000 creates.** Non-idempotent.

## 3. MANDATORY pre-flight SQL (READ-ONLY — run first, change nothing)

```sql
-- 1) exactly one flagship?
SELECT count(*) AS flagship_count FROM public.courses WHERE is_flagship = true;            -- expect 1

-- 2,3) the expected, published flagship?
SELECT id, title, is_flagship, is_published FROM public.courses WHERE is_flagship = true;
-- expect id = f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14, is_published = true

-- 4) old Scrum rows unpublished?
SELECT id, title, is_published FROM public.courses
WHERE title ILIKE '%scrum%' AND is_flagship = false;                                       -- expect all false

-- 5-10) structure + current content on the flagship
WITH f AS (SELECT id FROM public.courses WHERE is_flagship = true LIMIT 1)
SELECT
  (SELECT count(*) FROM public.chapters ch WHERE ch.course_id=(SELECT id FROM f))                                                                      AS modules,          -- 5 (expect 18)
  (SELECT count(*) FROM public.videos v JOIN public.chapters ch ON ch.id=v.chapter_id WHERE ch.course_id=(SELECT id FROM f))                            AS lessons_now,      -- 6
  (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f))                           AS quizzes_now,      -- 7 (all types)
  (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f) AND q.quiz_type='chapter_end') AS chapter_quizzes_now,
  (SELECT count(*) FROM public.quiz_questions qq JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f)) AS questions_now,  -- 8/9
  (SELECT count(DISTINCT ch.id) FROM public.quiz_questions qq JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id WHERE ch.course_id=(SELECT id FROM f)) AS modules_with_questions; -- 10

-- 11) any quiz/question mapped onto an UNPUBLISHED old Scrum course? (should be 0)
SELECT count(*) AS leaked
FROM public.quiz_questions qq
JOIN public.quizzes q ON q.id=qq.quiz_id JOIN public.chapters ch ON ch.id=q.chapter_id
JOIN public.courses c ON c.id=ch.course_id
WHERE c.is_flagship = false AND c.title ILIKE '%scrum%';                                    -- expect 0

-- 12) would 010000 duplicate? (same as lessons_now/chapter_quizzes_now above)
-- If lessons_now > 0 OR chapter_quizzes_now > 0 → YES, it would duplicate.
```

## 4. Decision table

| Pre-flight result | Meaning | Action |
| --- | --- | --- |
| `lessons_now = 0` **and** `chapter_quizzes_now = 0` **and** `questions_now = 0` | bare migration-created flagship | **Path A** may proceed |
| `lessons_now > 0` **or** `quizzes_now > 0` | already populated | **STOP Path A → Path B** |
| `lessons_now ≈ 162` | populated **v2** course | **Path B** — do **not** run 010000 |
| `questions_now > 0` | 020000-style content already present | **STOP** — reconcile, don't re-insert |
| `flagship_count ≠ 1` / id ≠ `f46d8fc2…` / old rows published / `modules ≠ 18` | unsafe preconditions | **STOP** (see §6) |

## 5. The two paths

### PATH A — bare-course seed (only if §4 says bare)
Apply, in order, pasting each repo file's full contents into Supabase:
1. `…20260619010000…sql` → verify: 72 lessons, 18 `chapter_end` quizzes, 0 duplicate quizzes per module.
2. `…20260619020000…sql` → verify: 100 questions, 7 modules covered, 0 leaked.

Expected: 72 lessons · 18 quizzes · 100 questions across 7/18 modules. **No
1,080-question bank, no 162-lesson claim** — those gaps stay visible on `/founder/truth`.

### PATH B — populated v2 reconciliation (likely)
**Do NOT apply 010000.** Keep the existing 162 lessons. Then a *separate* package
(prepared only after we see your pre-flight output) will:
- Determine whether the v2 modules already have `chapter_end` quizzes, or need
  **only missing quiz shells** created (one per module, no duplicates).
- Map the **100 authored questions** onto the **existing** v2 modules/quizzes using
  **stable `course_id` + `chapter_id`** references (never title-only).
- Insert **only what's missing** (guarded with existence checks), so it is safe to
  re-run.
- Never duplicate lessons, never duplicate quizzes, never delete old rows, never
  touch `user_progress`.

> ⚠️ `020000` as written expects the quiz structure `010000` creates. On a v2
> course it must **not** be pasted blindly — the Path B package will re-target the
> question inserts to the live v2 quizzes. **STOP** if 020000 would reference
> quizzes that don't match the live course.

## 6. Hard-stop gates

- 🛑 STOP if `flagship_count ≠ 1`.
- 🛑 STOP if flagship id ≠ `f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14`.
- 🛑 STOP if any old Scrum row is still `is_published = true`.
- 🛑 STOP if the flagship has existing lessons and 010000 would insert more.
- 🛑 STOP if the flagship has existing quizzes and 010000 would insert duplicates.
- 🛑 STOP if a migration would target by **title only** instead of stable id/flag.
- 🛑 STOP if 020000 depends on 010000's quizzes but those don't match the live v2 course.
- 🛑 STOP if the SQL cannot prove what it will touch **before** inserting.

## 7. Question-mapping reality (no claim inflation)

- This work covers **100** authored questions — **partial** coverage.
- It does **not** satisfy the 1,080-question target.
- Done correctly, it moves `/founder/truth`'s question probe from **unsupported →
  partial** only. Full question-bank generation is a **later** package.

## 8. Founder runbook

1. **Run the §3 pre-flight SQL only** (read-only).
2. **Paste the results back to Claude.**
3. Claude determines **Path A** or **Path B** from the counts.
4a. **If bare** → founder applies `010000` then `020000` manually; verify per §5 Path A.
4b. **If populated v2** → Claude prepares a new v2-safe reconciliation package
    (no lesson re-seed; question mapping onto existing quizzes, guarded).
5. Run the verification SELECTs.
6. Open **`/founder/truth`** and compare.
7. Screenshot results.

---

**Bottom line:** the next action is **read-only pre-flight only**. Do not paste any
seed/insert SQL until the counts choose Path A or Path B. Given the live course
shows ~162 lessons, expect **Path B**.
