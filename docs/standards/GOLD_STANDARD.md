# THE GOLD STANDARD — Aladiah Flagship Programs

**Ratified by the Founder — July 2026.**
Aladiah does not advertise dozens of courses. It is known for **five exceptional AI
workforce programs that consistently produce capable graduates.** This document is
the single standard every flagship must meet, the evidence required to prove it,
and the freeze rule that protects it.

## The Five Flagships

| # | Program | curriculum_version |
|---|---------|--------------------|
| 1 | AI Scrum Master | `v3.0` |
| 2 | AI Project Manager | `pm-v1` |
| 3 | AI Business Analyst | `ba-v1` |
| 4 | AI Data Analyst | `da-v1` |
| 5 | AI Cybersecurity | `cyber-v1` |

No sixth program enters the catalog as Active until all five hold this standard
**and** the Founder lifts the freeze.

---

## 1 · Curriculum

- **18 modules** (15 core + 3 advanced). Cyber carries an approved 19th
  (Founder-ratified masterclass exception).
- **5 lessons per module** — 90 lessons per program.
- **Logical progression** — each module builds on the previous; a student can
  complete the program end-to-end with distinct progression.
- **Zero duplicate lessons** — no repeated lesson titles, no duplicate or
  near-duplicate transcripts, anywhere in the program.
- **Premium transcripts** — every lesson ≥ 1,200 characters of real teaching
  content (house norm 2,000–6,000), with a learning-objective description.
  No placeholders, no "coming soon", no unfinished sections.

**Evidence:** static migration sweep (titles, transcript hashes, length
distribution, unfinished-marker scan) **plus** the live-DB gate query
(`docs/qa/BA_ACTIVATION_VERIFICATION.sql` pattern, per program).

## 2 · Classroom

- **Professor Didier™ experience** — every lesson opens in the Official
  Classroom (flag `OFFICIAL_CLASSROOM`, all courses).
- **Unique module whiteboards** — one distinct board per module, academy-wide
  (Founder rule; registry in `src/components/classroom-test/moduleBoards.tsx`).
- **Working voice** — tap-to-speak connects, Professor teaches; failures surface
  a readable on-screen cause.
- **Notes and progress tracking** — student notes usable; module progress
  advances on quiz pass.

**Evidence:** classroom renders per module (screenshots), voice verified on a
real device by the Founder, progress row written after a passed quiz.

## 3 · Assessment

- **Module quizzes** — one chapter-end exam per module, ≥ 10 approved
  questions, graded server-side (answer key never client-exposed).
- **Capstone project** — final module capstone; certificate gate runs through
  `course_completion_status` + Founder-approved capstone submission.
- **AI-assisted practical exercises** — program simulations seeded
  (100 per program) and reachable from the portal.
- **Competency tagging** — `competency` populated on every question **at
  insert** (never NULL, never backfilled — CLAUDE.md rule), using approved
  taxonomy slugs.

**Evidence:** question counts + NULL-competency = 0 in the DB gate query;
simulation count per program; capstone flow exercised once per program.

## 4 · Portfolio

- Students finish with **real deliverables an employer can review**: the
  capstone artifact plus module-level work products (templates, models,
  documents in the industry's own formats).
- Portfolio surfaces (portal portfolio + capstone submission) hold the
  artifacts; nothing fabricated, nothing pre-filled.

**Evidence:** capstone module content names the deliverables; a test account
can attach and submit an artifact.

## 5 · Production QA (per program, on production)

| Check | Pass condition |
|---|---|
| Enrollment | New account can select the program and reach Module 1 Lesson 1 |
| Lesson playback | Lessons render in the classroom; transcripts display |
| Quiz grading | Exam loads, submits, grades, records attempt |
| Progress persistence | Refresh/re-login keeps module progress |
| Completion logic | All exams + capstone → completion status reflects it |
| Mobile/iPad | The above verified on iPad Safari |

**Evidence:** Founder (or delegated tester) walkthrough per program with the
standing ALMOST rule — any failed criterion → ALMOST/NO-GO with root cause and
repair plan before further changes.

---

## The Freeze

When all five flagships hold this standard, they are **frozen**: changes limited
to bug fixes and student-feedback improvements. Energy shifts to acquiring
students, employer partnerships, AI Industry Labs, and catalog expansion —
each new program entering only by meeting this same standard first.

## Current Status Ledger

Maintained in the activation PRs and Founder QA notes. As of 2026-07-18:

| Gate | Scrum | PM | BA | DA | Cyber |
|---|---|---|---|---|---|
| Curriculum structure (18×5) | ✅ | ✅ | ✅ | ✅ | ✅ (19) |
| Zero duplicates / unfinished | ✅ | ✅ | ✅ | ✅ | ✅ |
| Premium transcripts | ⚠️ 1 lesson enriched via `20260718000000` | ✅ | ✅ | ✅ | ⚠️ 1 lesson enriched via `20260718000000` |
| Classroom + unique boards | ✅ | ✅ | ✅ | ✅ | ✅ |
| Voice verified on device | ⏳ Founder QA | ⏳ | ⏳ | ⏳ | ⏳ |
| Module quizzes ≥10 Q, tagged | ✅ | ✅ | ✅ | ✅ | ✅ |
| Simulations seeded | ✅ | ✅ | ✅ | ✅ | ✅ |
| Capstone flow exercised | ⏳ Founder QA | ⏳ | ⏳ | ⏳ | ⏳ |
| Production QA walkthrough | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| DB gate query run | ⏳ | ⏳ | ⏳ (#134 gate) | ⏳ | ⏳ |

✅ verified in repo/code · ⚠️ repair authored, Founder applies · ⏳ requires live-DB/device evidence
