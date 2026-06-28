# Founder Validation Runbook — BA Flagship

> **Purpose:** prove the entire student journey on the live system, end to end, in one sitting.
> **Owner:** founder (per canon, Claude does not auto-apply SQL).
> **Definition of done:** a real student account walks Enroll → Learn → Pass → Capstone → Approval → Certificate, and every failure is logged as a `BLK-###` below.
>
> Source of truth: the three migrations under `supabase/migrations/2026062*`. Apply them **in order**. "Success / no rows" means the statement *ran*, not that it was *correct* — always run the verification `SELECT` after each apply.

---

## Phase 1 — Apply migrations (Supabase SQL editor, in order)

| # | File | Applies | Verify expects |
|---|------|---------|----------------|
| 1 | `20260620130000_retire_placeholder_ba_course.sql` | Retires the old placeholder BA course | old course gone / unpublished |
| 2 | `20260621000000_publish_ba_structure.sql` | Course + 15 modules + 75 lessons + 14 exam shells | `modules=15, lessons=75, exams=15, is_published=false` |
| 3 | `20260621010000_publish_ba_questions.sql` | 295 competency-tagged questions | `0 untagged` questions |
| 4 | `20260621020000_completion_engine.sql` | `capstone_submissions` + `course_certificates` tables + 2 functions | 2 new tables exist |

> The course publishes with **`is_published=false`** on purpose — it is **founder-previewable, student-hidden**. You walk it before any student can see it.

### Verify 2 — structure
```sql
SELECT c.title, c.is_published, c.launch_status,
  (SELECT count(*) FROM public.chapters ch WHERE ch.course_id=c.id) AS modules,
  (SELECT count(*) FROM public.videos v JOIN public.chapters ch ON ch.id=v.chapter_id
     WHERE ch.course_id=c.id) AS lessons,
  (SELECT count(*) FROM public.quizzes q JOIN public.chapters ch ON ch.id=q.chapter_id
     WHERE ch.course_id=c.id AND q.quiz_type='chapter_end') AS exams
FROM public.courses c
WHERE c.title='AI Business Analyst & Product Discovery Specialist' AND c.curriculum_version='ba-v1';
-- expect: modules=15, lessons=75, exams=15, is_published=false
```

### Verify 3 — every exam question is competency-tagged
```sql
SELECT count(*) AS untagged
FROM public.quiz_questions qq
JOIN public.quizzes q ON q.id=qq.quiz_id
JOIN public.chapters ch ON ch.id=q.chapter_id
JOIN public.courses c ON c.id=ch.course_id
WHERE c.curriculum_version='ba-v1'
  AND (qq.competency IS NULL OR qq.competency='');
-- expect: untagged = 0
```

### Verify 4 — completion engine tables exist
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema='public' AND table_name IN ('capstone_submissions','course_certificates')
ORDER BY table_name;
-- expect: 2 rows
```

---

## Phase 2 — Walk the flow (founder account, course still unpublished)

| Step | Where | Pass condition | If it fails |
|------|-------|----------------|-------------|
| 1. Enroll | `/courses` → BA card → `/enroll` | enrollment row created | `BLK-001` |
| 2. Learn | course player | all 5 lessons of a module open | `BLK-002` |
| 3. Quiz | module-end exam | A)/B)/C)/D) render once, scoring works | `BLK-003` |
| 4. Pass | submit a passing exam | `user_progress` records the pass | `BLK-004` |
| 5. Progress | progress bar / module list | bar advances on pass | `BLK-005` |
| 6. Gate | try certificate before finishing | blocked until all 14 exams + capstone | `BLK-006` |
| 7. Capstone submit | student capstone screen | submission row, status `submitted` | `BLK-007` |
| 8. Founder approval | `/founder/capstones` | Approve flips status `approved` | `BLK-008` |
| 9. Certificate | student claim screen | `issue_course_certificate` returns a cert id | `BLK-009` |

### Eligibility spot-check (run as the student, mid-walk)
```sql
SELECT public.course_completion_status(
  (SELECT id FROM public.courses
   WHERE curriculum_version='ba-v1' LIMIT 1));
-- inspect: exams_total=14, exams_passed, capstone_status, eligible
```

---

## Phase 3 — Go live (only after Phase 2 is clean)

```sql
UPDATE public.courses SET is_published=true, launch_status='live'
WHERE title='AI Business Analyst & Product Discovery Specialist' AND curriculum_version='ba-v1';
-- then re-run Verify 2: is_published should now be true
```
Open enrollment to the first **25–50** students. Do not wait for simulations — those are post-MVP enrichment.

---

## Blocker log (fill as you walk)

| ID | Step | Symptom | Status | Notes |
|----|------|---------|--------|-------|
| BLK-001 | Enroll | | open / fixed | |
| BLK-002 | Learn | | open / fixed | |
| BLK-003 | Quiz | | open / fixed | |
| BLK-004 | Pass | | open / fixed | |
| BLK-005 | Progress | | open / fixed | |
| BLK-006 | Gate | | open / fixed | |
| BLK-007 | Capstone submit | | open / fixed | |
| BLK-008 | Founder approval | | open / fixed | |
| BLK-009 | Certificate | | open / fixed | |

> Paste any `BLK-###` back to Claude with the symptom and the exact screen/route — that's the fastest path to a fix.

---

## Appendix — what PM (Program #2) actually needs

The publish **spine is reusable** (course → lessons → tagged questions → exams → capstone → certificate) and the `pm:` competency registry is already canon (taxonomy §6, 11 slugs). What is **not** reusable is the **content**: PM needs net-new authored lessons (~75) and competency-tagged questions (~290) before it can publish. PM is fast on *plumbing*, not on *authoring* — budget accordingly.
