# Scrum Flagship Reconciliation + Old Seed Deprecation — Apply Package

> **Reviewable apply package — Claude Code does not auto-apply SQL.** The founder
> runs each block by hand in the Supabase SQL editor, in order, and runs the
> verification `SELECT`s before and after. "Success / no rows" means the
> statement *ran*, not that it was *correct* — always confirm with the SELECTs.
> **Nothing here deletes course data.** Deprecation = visibility toggle only.

## Context (from `/founder/truth`, 2026-06-19)

- Security migrations: ✅ applied & verified.
- Flagship migration `20260619000000`: ✅ applied — live flagship has **18 modules**.
- ❌ **Old seed still live**; **Live Scrum courses = 3** (duplicates); modules with
  questions **0/18**; translated modules **0/18**; capstone/sims/labs/portfolio not
  live-backed.

### What this means
The 18-module flagship structure exists, but:
1. The **old 4-module seed** (`AI-Powered Scrum Master Professional Certification`,
   from `supabase/functions/seed-scrum-course`) and at least one more Scrum course
   are still present → 3 total.
2. The follow-on migrations that populate lessons/quizzes (`20260619010000`) and map
   the question bank (`20260619020000`) were **never applied** → 0 questions.
3. The flagship may not even be the *published* (student-visible) course — student
   lists filter `is_published = true` (`src/pages/PortalCourses.tsx`), and the
   flagship migration never set `is_published`, while the old seed was published.

## Levers confirmed in code (why this approach is safe)

- **Visibility:** student course lists filter `.eq('is_published', true)`. Flipping
  `is_published` is the clean, reversible deprecation lever. **No delete.**
- **`launch_status`** only allows `draft/internal/beta/launch_ready/production`
  (CHECK) — no "archived" value — so `is_published` is the right tool, not `launch_status`.
- **Flagship identity:** `courses.is_flagship = true` (set by `20260619000000`).
- **Follow-on migrations** `010000`/`020000` select the target by
  `WHERE is_flagship ORDER BY created_at LIMIT 1` — **by flag, not title** — so they
  hit the correct course **as long as exactly one `is_flagship` row exists**.

---

## ⚠️ Founder approval points (decide BEFORE applying)

1. **Confirm which course is the canonical flagship.** Expect exactly one
   `is_flagship = true`. If 0 or >1, **stop** — Phase 4 migrations would target the
   wrong/none.
2. **Old seeds may have student progress.** Phase 0 checks for enrolled/in-progress
   students on the courses you're about to hide. If any exist, decide: hide anyway
   (they keep access via direct link/enrollment, just not browse), or migrate them
   first. **Hiding does not delete their data.**
3. **Deprecate by explicit ID (recommended)** over the flag-based bulk update, so you
   see exactly which rows change.

---

## Phase 0 — Inventory (READ-ONLY; run first, change nothing)

```sql
-- Every Scrum course with the signals that matter:
SELECT
  c.id,
  c.title,
  c.is_flagship,
  c.is_published,
  c.created_at,
  (SELECT count(*) FROM public.chapters ch WHERE ch.course_id = c.id)              AS chapters,
  (SELECT count(*) FROM public.user_progress up WHERE up.course_id = c.id)         AS progress_rows
FROM public.courses c
WHERE c.title ILIKE '%Scrum%'
ORDER BY c.is_flagship DESC, c.created_at;
```
**Record the output.** You should see ~3 rows. Identify:
- **Flagship** = the `is_flagship = true` row (note its `id` → call it `FLAGSHIP_ID`).
- **Old/duplicates** = the `is_flagship = false` rows (note their `id`s → `OLD_IDS`).

```sql
-- Hard gate: there must be exactly ONE flagship.
SELECT count(*) AS flagship_count FROM public.courses WHERE is_flagship = true;
```
🛑 **Stop if `flagship_count <> 1`.** If 0: the flagship flag was lost — re-confirm
`20260619000000` applied. If >1: two courses are flagged; decide which is canonical
(keep the one with the 18 chapters) and clear the flag on the other before continuing.

```sql
-- Are real students mid-course on the OLD seeds? (approval point #2)
SELECT up.course_id, count(DISTINCT up.user_id) AS students
FROM public.user_progress up
WHERE up.course_id IN ( /* paste OLD_IDS */ )
GROUP BY up.course_id;
```
**Expected:** ideally 0. If non-zero, see approval point #2 before hiding.

---

## Phase 1 — Make the flagship the published student course

```sql
BEGIN;
UPDATE public.courses
   SET is_published = true
 WHERE is_flagship = true;
COMMIT;
```
**Verify:**
```sql
SELECT id, title, is_published FROM public.courses WHERE is_flagship = true;
-- expect: 1 row, is_published = true
```
🛑 Stop if it returns 0 rows or `is_published` is still false.

---

## Phase 2 — Deprecate the old seed(s) (visibility only, reversible)

**Recommended — by explicit ID** (paste the `OLD_IDS` from Phase 0):
```sql
BEGIN;
UPDATE public.courses
   SET is_published = false
 WHERE id IN ( /* paste OLD_IDS, comma-separated */ )
   AND is_flagship = false;   -- guard: never unpublish the flagship
COMMIT;
```

**Alternative — flag-based bulk** (only if you trust the inventory; the
`is_flagship=false` guard protects the flagship):
```sql
BEGIN;
UPDATE public.courses
   SET is_published = false
 WHERE is_flagship = false
   AND title ILIKE '%Scrum%';
COMMIT;
```

**Verify (after):**
```sql
SELECT id, title, is_flagship, is_published
FROM public.courses
WHERE title ILIKE '%Scrum%'
ORDER BY is_flagship DESC, created_at;
-- expect: flagship row is_published = true; ALL old/duplicate rows is_published = false
```
🛑 Stop if the flagship shows `is_published = false`, or any old seed still shows `true`.

**Rollback (re-publish if needed):**
```sql
UPDATE public.courses SET is_published = true
WHERE id IN ( /* the OLD_IDS you just changed */ );
```

> **No rows are deleted.** All chapters, quizzes, and student progress on the old
> seeds remain intact; they are merely hidden from student browse lists.

---

## Phase 3 — Populate the flagship's lessons/quizzes + question bank

These two migrations are **in `main` but not applied**. Apply **only after Phase 0
confirmed exactly one `is_flagship`** (both use `WHERE is_flagship ... LIMIT 1`).

1. **`supabase/migrations/20260619010000_flagship_scrum_lessons_quizzes.sql`** —
   seeds lessons + the per-module quizzes (incl. the `chapter_end` quizzes that
   questions attach to).
   **Verify:**
   ```sql
   SELECT count(*) FROM quizzes q JOIN chapters c ON c.id=q.chapter_id
   WHERE c.course_id = (SELECT id FROM courses WHERE is_flagship);   -- expect 18
   ```
2. **`supabase/migrations/20260619020000_flagship_scrum_questions_mapped.sql`** —
   maps the 100 authored questions onto the module quizzes.
   **Verify:**
   ```sql
   -- questions present on the flagship, and modules covered:
   SELECT count(*) AS questions
   FROM quiz_questions qq
   JOIN quizzes q   ON q.id = qq.quiz_id
   JOIN chapters c  ON c.id = q.chapter_id
   WHERE c.course_id = (SELECT id FROM courses WHERE is_flagship);

   SELECT count(DISTINCT c.id) AS modules_with_questions
   FROM quiz_questions qq
   JOIN quizzes q  ON q.id = qq.quiz_id
   JOIN chapters c ON c.id = q.chapter_id
   WHERE c.course_id = (SELECT id FROM courses WHERE is_flagship);
   ```
   **Expected:** `questions` > 0 (≈100 authored), `modules_with_questions` rising toward 18.
   🛑 Stop if `questions = 0` after applying (wrong target or quizzes missing — re-check Phase 3.1).

> **Honest scope note:** `020000` maps the **100 currently-authored** questions — it
> does **not** create a 1,080-question bank. `/founder/truth` will still show the
> claim gap until more questions are authored. That is correct and expected (the
> interim claim wording already reflects this).

---

## Phase 4 — Forward plans (NOT SQL to run now)

These are **planning items**, not paste-ready blocks — each needs authored content
before it can be applied. Listed so the path is explicit.

| Asset | Current state | Plan to make live |
| --- | --- | --- |
| **Exam question bank** | 100 authored, mapped via `020000` | Author the remaining questions in the question bank; map each batch to module `chapter_end` quizzes via the same INSERT pattern as `020000`. Re-verify counts on `/founder/truth`. |
| **Capstone questions** | last chapter (module 18) has 0 | Author capstone questions; INSERT into the module-18 `chapter_end` quiz (dashboard reads `capstoneQuestionsLive` from the last chapter's quiz). |
| **Simulations** | `scrum_simulations` table exists; flagship-linked sims not seeded | Seed scenario rows into `public.scrum_simulations` (engine table from `20260214065348`); link to the flagship. Move the code-only sim definitions (`aiScrumMasterFull.ts`) into DB rows. |
| **Labs / Portfolio** | **no DB table** on the student path | Decide the data model first (new tables `scrum_labs` / `scrum_portfolio_projects` or columns on chapters), then a migration + seed. Until then `/founder/truth` correctly shows 0. |
| **Translations** | `chapters.translations` empty (0/18) | Run `scripts/populate-translations.mjs` (fills `chapters.translations` for ES/FR/PT/DE/AR/ZH/HI) after lessons exist; the `20260618120000_translation_status` migration (on the long-lived branch, **not yet in main**) tracks status — bring it in via a separate scoped PR if needed. |

Each of these should come back as its **own** reviewable apply package once the
content is authored — not bundled blindly.

---

## Expected `/founder/truth` changes after Phases 1–3

| Probe | Before | After Phases 1–3 |
| --- | --- | --- |
| Old seed still live | ❌ | ✅ resolved (old seeds `is_published=false`) |
| Live Scrum courses | 3 | still 3 *rows*, but **1 published** (browse shows only the flagship) |
| Duplicate Scrum courses live | ⚠️ (3) | warning clears once duplicates are unpublished |
| Flagship is the student course | (old seed may show) | flagship `is_published=true` |
| Modules with questions | 0/18 | >0 (≈ the mapped authored set) |
| Capstone / sims / labs / portfolio / translations | unsupported | unchanged until Phase 4 content is authored (honest gap) |

> If the dashboard's "duplicate" / "old seed" probes key off row **count** rather
> than `is_published`, they may still warn after unpublishing. That's a dashboard
> refinement (count published-only), handled separately — it does **not** change
> the student-facing fix.

---

## Apply order summary

1. **Phase 0** inventory (read-only) → record `FLAGSHIP_ID` + `OLD_IDS`; gate on exactly 1 flagship.
2. **Phase 1** publish the flagship.
3. **Phase 2** unpublish old seeds (by ID).
4. **Phase 3** apply `20260619010000` then `20260619020000`; verify question counts.
5. Re-open `/founder/truth` and compare against the table above.
6. **Phase 4** plans return later as separate authored packages.

Do **not** proceed to PM / BA / Cybersecurity audits until the founder confirms the
reconciliation results on `/founder/truth`.
