# Founder Validation Playbook — Founder Portal

**Goal:** validate the entire Founder Portal in ONE session after applying migrations.
**Scope:** PR #7 (branch `claude/adoring-brown-1f452f`).
**Rule (repo canon):** "Success / no rows" means the statement *ran*, not that it was
*correct* — every write is followed by a verification `SELECT`. Claude Code does not
auto-apply SQL; you apply it by hand in the Supabase SQL editor.

Project: `vgujnkxylipfwmkpwzvb`. Primary founder: `didier@aladiahacademy.com`.

---

## 1. Migration execution steps (exact, in order)

Apply **in this order** in the Supabase SQL editor. Each file ends with its own
`-- VERIFICATION:` block — run it before moving on.

| # | File | What it does | Depends on |
|---|---|---|---|
| 1 | `20260612030000_quiz_question_bank.sql` | competency/topic/difficulty cols, quiz index, `get_exam_questions()` | quiz_questions table |
| 2 | `20260612040000_quiz_question_workflow.sql` | status/reviewed_by/approved_by/reviewed_at/approved_at/version + status CHECK; `get_exam_questions` → approved-only | #1 |
| 3 | `20260612050000_quiz_questions_founder_rls.sql` | founder SELECT + UPDATE policies via `aos_is_admin()` | `aos_is_admin()` (already live) |
| 4 | `20260612060000_review_quiz_questions_rpc.sql` | atomic founder-gated transition RPC (stamps + version) | #2, `aos_is_admin()` |

**Steps for each migration:**
1. Open the file from the PR diff. Copy the full contents.
2. Supabase → SQL Editor → New query → paste → **Run**.
3. Run the file's `-- VERIFICATION:` SELECT. Confirm the expected shape (below).
4. Only then proceed to the next file.

> Do NOT skip order. #2 adds the `status` column that #4's RPC and the edge
> functions depend on; #4 will error if #2 hasn't run.

---

## 2. Edge function redeploy steps (exact)

These two functions reference `status`, so they must be redeployed **after** migration
#2 is live (otherwise existing quizzes error).

Changed functions:
- `supabase/functions/get-quiz-questions/index.ts` (now filters `status='approved'`)
- `supabase/functions/submit-quiz/index.ts` (map-mode filters `status='approved'`)
- `supabase/functions/generate-question-bank/index.ts` (inserts `status='draft'`)

**Order:** apply migration #2 → THEN redeploy. Using the Supabase CLI:

```bash
# from repo root, after migrations 1–4 are applied
supabase functions deploy get-quiz-questions   --project-ref vgujnkxylipfwmkpwzvb
supabase functions deploy submit-quiz          --project-ref vgujnkxylipfwmkpwzvb
supabase functions deploy generate-question-bank --project-ref vgujnkxylipfwmkpwzvb
```

Confirm each reports a new version/deployed timestamp in the Supabase Functions dashboard.
Required secrets already set: `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`.

---

## 3. Supabase verification queries (exact)

Run these in the SQL editor after migrations 1–4.

**3.1 — Workflow columns exist (migration 2):**
```sql
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='quiz_questions'
  AND column_name IN ('status','reviewed_by','approved_by','reviewed_at','approved_at','version','competency','topic','difficulty')
ORDER BY column_name;
-- EXPECT: all 9 rows.
```

**3.2 — Existing rows defaulted to approved (backward compat):**
```sql
SELECT status, count(*) FROM public.quiz_questions GROUP BY status ORDER BY status;
-- EXPECT: pre-existing questions are 'approved' (so live courses are unaffected).
```

**3.3 — RLS policies present (migration 3):**
```sql
SELECT policyname, cmd FROM pg_policies
WHERE schemaname='public' AND tablename='quiz_questions' ORDER BY cmd, policyname;
-- EXPECT: SELECT → "No direct access to quiz questions" (false) + "admin read quiz questions";
--         UPDATE → "admin update quiz questions".
```

**3.4 — get_exam_questions serves approved-only, no answer key:**
```sql
-- pick a chapter_end quiz id with questions:
SELECT q.id FROM public.quizzes q WHERE q.quiz_type='chapter_end' LIMIT 1;
-- then:
SELECT * FROM public.get_exam_questions('<quiz_id>', 20);
-- EXPECT: ≤20 rows; columns do NOT include correct_answer_index;
--         every returned row is status='approved' in the base table.
```

**3.5 — Review RPC exists and stamps correctly (migration 4):**
```sql
-- grab one draft question id (or any id you can re-approve afterward):
SELECT id, status, version FROM public.quiz_questions WHERE status='draft' LIMIT 1;
-- transition it:
SELECT public.review_quiz_questions(ARRAY['<qid>']::uuid[], 'approve', 'didier@aladiahacademy.com');
-- verify the stamp:
SELECT status, reviewed_by, reviewed_at, approved_by, approved_at, version
FROM public.quiz_questions WHERE id='<qid>';
-- EXPECT: status='approved', reviewed_by/approved_by = your email, timestamps set.
-- reject test (version bump + approval cleared):
SELECT public.review_quiz_questions(ARRAY['<qid>']::uuid[], 'reject', 'didier@aladiahacademy.com');
SELECT status, approved_by, approved_at, version FROM public.quiz_questions WHERE id='<qid>';
-- EXPECT: status='draft', approved_by/at = NULL, version incremented by 1.
```

**3.6 — Non-founder cannot read drafts (RLS proof, optional):**
```sql
-- As a NON-founder JWT (or anon), a direct select must return zero:
SELECT count(*) FROM public.quiz_questions;   -- EXPECT: 0 for non-founder/anon.
```

---

## 4. Founder Portal validation tests (per route)

Sign in as `didier@aladiahacademy.com`. Open browser devtools console (watch for errors).

### `/founder`
- **Expected behavior:** Founder Portal home renders — Crown header, CEO status board,
  Workforce launchpad, FounderNav with links incl. **Curriculum Readiness** and
  **Question Review**. "Enter Student Portal" button present.
- **Success:** page renders, nav visible, no console errors, no redirect.
- **Failure:** redirect to `/portal` (role not resolving as founder), white screen, or
  console error.

### `/founder/control-center`
- **Expected behavior:** Control Center renders under FounderNav (existing surface).
- **Success:** renders for founder, no redirect, no console error.
- **Failure:** redirect/404/white screen.

### `/founder/readiness` — Curriculum Readiness Dashboard
- **Expected behavior:** Executive summary strip (Total Programs, Launch Ready, In
  Development, Below 80%, Total Assets, Assets Pending Review, **Questions Pending
  Review**). Tabs: **By School / By Program / By Module**. Each program shows
  name, modules (completed/total), Readiness Score, Launch Score, the 9 dimensions
  with %, and color bars (red <50, yellow 50–79, blue 80–94, green ≥95).
- **Success:** summary numbers load; switching tabs works; By Module dropdown
  re-queries per program; "Questions Pending Review" > 0 once drafts exist;
  a program shows "Launch Ready" ONLY when the 7 gate dims are 100%.
- **Failure:** all zeros after migrations applied + drafts generated (→ RLS not
  applied), tab switch errors, console error, or a program marked Launch Ready
  with a gate dim < 100%.

### `/founder/curriculum` — Question Review + Module Readiness
- **Expected behavior:** Two tabs. **Question Review**: filters (Course, Module,
  Competency, Status, Difficulty); status tabs Draft/In Review/Approved/Archived
  with counts; checkbox select + bulk Approve / Send to Review / Reject / Archive;
  expand a row to see scenario, options (correct marked), rationale, competency,
  topic, difficulty, created_at, version. **Module Readiness**: per-module 7-dim
  table with %.
- **Success:** queue lists draft questions (after generation); selecting + Approve
  moves them to the Approved tab and the success toast shows N updated; the
  approved count rises and the Draft count falls; Reject returns items to Draft and
  bumps version (check the row's `v` column); filters narrow the list.
- **Failure:** empty queue when drafts exist in DB (→ RLS migration 050000 not
  applied), bulk action returns an error string (→ RPC migration 060000 not applied
  or `aos_is_admin()` false for your account), or console error.

### Student isolation spot-check (use a NON-founder account)
- **Expected behavior:** `/founder*` redirects to `/portal`. A student taking a quiz
  receives only approved questions; no draft/in-review/archived content appears.
- **Success:** redirect happens; quiz shows only approved items; no answer key in any
  network response.
- **Failure:** student reaches any `/founder*` route, sees non-approved content, or a
  network response contains `correct_answer_index`.

---

## 5. Go / No-Go checklist

Mark each. **All must be GO to declare the Founder Portal production-ready.**

**Migrations**
- [ ] 030000 applied + verification passed
- [ ] 040000 applied + 9 columns present (3.1) + existing rows = approved (3.2)
- [ ] 050000 applied + policies present (3.3)
- [ ] 060000 applied + RPC stamps + version bump on reject (3.5)

**Edge functions**
- [ ] `get-quiz-questions` redeployed (after 040000)
- [ ] `submit-quiz` redeployed
- [ ] `generate-question-bank` redeployed

**Data integrity**
- [ ] `get_exam_questions` returns approved-only, no `correct_answer_index` (3.4)
- [ ] Non-founder direct `quiz_questions` read returns 0 (3.6)

**Routes (founder signed in)**
- [ ] `/founder` renders, no redirect
- [ ] `/founder/control-center` renders
- [ ] `/founder/readiness` loads summary + 3 views
- [ ] `/founder/curriculum` lists drafts + bulk actions work

**Workflow**
- [ ] Approve moves Draft → Approved + stamps approved_by/at
- [ ] Reject returns to Draft + clears approval + bumps version
- [ ] Send to Review → In Review; Archive → Archived
- [ ] Readiness "Questions Pending Review" reflects real draft count

**Security**
- [ ] Non-founder redirected from every `/founder*` route
- [ ] Student quiz shows approved-only content
- [ ] No `correct_answer_index` in any client/network response

**Decision:** ☐ GO   ☐ NO-GO   — reason: ____________________

---

## Notes
- Generate drafts to exercise the queue: call the founder-only
  `generate-question-bank` edge function (body `{}` defaults to the Scrum flagship,
  25/run, target 350). All inserts land as `status='draft'`.
- School grouping is heuristic (title keywords) until a `school` column is added —
  override per course in `src/services/curriculum/programReadiness.ts` (`SCHOOL_OVERRIDES`).
