# PUBLISH_LAYER.md — Aladiah Program Publishing Standard

> Canon. Read with `NORTH_STAR.md`, `ARCHITECTURE_PRINCIPLE.md`, and
> `COMPETENCY_TAXONOMY.md`. This document governs how authored program content
> becomes a course a student can actually complete. It is the shared spine for
> all flagship programs (Scrum, BA, PM, DA). Build it once; every program is
> published through it.

## 1. Why this exists — the authored-vs-published chasm

The June 2026 program audit found the same failure across every program: content
is **authored** (as markdown docs, seed functions, or migrations) but not
**published** (rows a student reads, with competency tags, behind `is_published`).

| Program | Authored | Student-publishable today | Gap |
|---|---|---|---|
| Project Manager | 84 lessons, 477 Qs (seed fns) | partial — no competency tags, no sims | ~67% |
| Scrum Master | 18 modules, 72 lessons, 100 Qs (migrations) | partial — 9% of question bank, sims code-only | ~42% |
| Business Analyst | 15 modules, 305 Qs (docs only) | **none seeded** | ~30% |
| Data Analyst | architecture only | none | low |

The bottleneck is **not authoring**. It is the absence of a single, disciplined,
repeatable path from authored content to published, competency-tagged,
verifiable rows. This standard is that path.

## 2. The verified schema contract

Two halves, both already in the database. Do not invent new tables; publish into
these.

### 2a. Learn path (rendered by the student player)

The student app reads these (`.from('courses'|'chapters'|'videos'|'quizzes'|'quiz_questions')`):

```
courses        id, title, description, image_url, is_published,
               is_flagship, flagship_version, curriculum_version,
               launch_status, launch_score, target_market,
               target_salary_low, target_salary_high, translations(jsonb)
chapters       id, course_id, title, description, order_index, translations
  = MODULES
videos         id, chapter_id, title, description, order_index, translations
  = LESSONS
quizzes        id, chapter_id, quiz_type, passing_score
  quiz_type:  'chapter_end' (module exam, counts toward readiness),
              'mini_video'  (per-lesson formative)
quiz_questions id, quiz_id, question_text, scenario_context, options(jsonb),
               correct_answer_index, explanation, order_index,
               competency, translations
```

Progress / assessment: `user_progress`, `quiz_attempts`, `quiz_attempt_answers`.

### 2b. Career-transformation assets (`program_*`, readiness-counted)

Each row carries `course_id` and `is_published`. Authored count (all rows)
drives completion %; published count gates `launch_ready`.

```
program_simulations      program_labs            program_portfolios
program_interview_prep   program_ai_mentor_prompts
program_capstones        program_certifications
```

The view `program_content_readiness` already aggregates both halves per course
and computes a weighted `readiness_score`. **Readiness instrumentation is done —
the job is to fill the rows.**

### 2c. Known gap to track (do not silently ignore)

The `program_*` assets are **counted for readiness but not yet read by the
student player** (the frontend queries simulation tables like `ba_simulations`,
`simulation_scores`, `student_labs` directly, not the `program_*` catalog). So an
asset can be "published" for scoring yet invisible in the student UI. Every
program publish MUST note, per asset type, whether it is (a) readiness-counted
only, or (b) actually surfaced to the student. Closing (a)→(b) is tracked work,
not assumed.

## 3. The publish pipeline (canon-compliant)

```
  authored content              reviewable SQL                applied by hand
  (docs / question banks)  ──▶  migration file          ──▶  (founder, in Supabase)
                                + paste-ready block            + verification SELECT
```

Rules, all non-negotiable (from CLAUDE.md working rules):

1. **No auto-apply.** Claude Code delivers a migration file under
   `supabase/migrations/` **and** a paste-ready block. The human applies it.
   Edge-function seeders that insert on invocation are NOT the publish path for
   flagships — they bypass review.
2. **Competency at insert time.** Every `quiz_questions` row and every
   `program_*` asset row sets `competency` to an approved slug from
   `COMPETENCY_TAXONOMY.md` in the same INSERT. Never null, never backfilled.
3. **Translations scaffold.** Every learn-path row sets `translations := '{}'::jsonb`
   at insert so Priority 2 (EN/FR/ES) has a uniform target. No hardcoded text
   lives outside this column.
4. **Idempotent + re-runnable.** Migrations key off stable identifiers
   (course title + `curriculum_version`, `order_index`) and guard inserts so a
   re-run does not duplicate. Pattern: look up the course by
   `(title, curriculum_version)`; insert children only when absent.
5. **`is_published` gating.** Seed content as `is_published = false`. Flip to
   true only after the verification SELECT passes and the founder approves. A
   half-seeded course must never be student-visible.
6. **Verify after every write.** "Success / no rows" means it *ran*, not that it
   is *correct*. Each migration ships with a companion verification SELECT that
   asserts counts and competency coverage.

## 4. Asset → home map (the 13-point checklist)

| # | Checklist item | Home | Status of home |
|---|---|---|---|
| 1 | Modules | `chapters` | ✅ rendered |
| 2 | Lessons | `videos` | ✅ rendered |
| 3 | Quizzes (formative) | `quizzes('mini_video')` + `quiz_questions` | ✅ rendered |
| 4 | 20-Q module exams | `quizzes('chapter_end')` + `quiz_questions` | ✅ rendered |
| 5 | Simulations | `program_simulations` (catalog) + per-sim engine tables | 🟡 readiness-counted; player wiring per-program |
| 6 | Projects / Labs | `program_labs` + `student_labs` (submissions) | 🟡 readiness-counted; submission UI partial |
| 7 | Capstone | `program_capstones` | 🟡 readiness-counted; engine per-program |
| 8 | Interview prep | `program_interview_prep` | 🟡 readiness-counted; player wiring TBD |
| 9 | Portfolio artifacts | `program_portfolios` | 🟡 readiness-counted; submission UI TBD |
| 10 | AI integration / mentor | `program_ai_mentor_prompts` | 🟡 readiness-counted |
| 11 | Employer skill mapping | `quiz_questions.competency` + asset `competency` | ✅ enforced at insert |
| 12 | Certification alignment | `program_certifications` | 🟡 readiness-counted; completion logic TBD |
| 13 | Question bank + tagging | `quiz_questions` | ✅ rendered + tagged |

"✅ rendered" = a student sees it today. "🟡 readiness-counted" = a row exists and
scores, but student-facing surfacing is tracked work (see §2c).

## 5. Per-program publish manifest

Before generating SQL, each program gets a manifest at
`docs/curriculum/<program>/PUBLISH_MANIFEST.md` declaring the exact target rows:

```
course:        title, curriculum_version, target_market, salary band
modules[]:     order_index, title, description, primary competency
  lessons[]:   order_index, title, description, source doc + section
  exam:        passing_score (flagship default 85), question_source, # questions
assets:
  simulations[]:        slug, competency, surfaced? (y/n + route)
  labs[]:               slug, competency, deliverable
  portfolio[]:          artifact, produced_by (sim/lab), competency
  interview_prep[]:     track, competency
  ai_mentor_prompts[]:  module, competency
  capstone:             title, rubric ref, pass threshold
  certification:        credential name, aligned standards, gate rule
```

The manifest is the contract. The migration is a mechanical translation of it.
QA audits the migration against the manifest.

## 6. Verification protocol (ships with every migration)

A companion `*_verify.sql` (or paste block) that asserts, at minimum:

```sql
-- counts match the manifest
select c.title,
  (select count(*) from chapters ch where ch.course_id=c.id) as modules,
  (select count(*) from videos v join chapters ch on ch.id=v.chapter_id
     where ch.course_id=c.id) as lessons,
  (select count(*) from quizzes q join chapters ch on ch.id=q.chapter_id
     where ch.course_id=c.id and q.quiz_type='chapter_end') as exams
from courses c where c.title = :title and c.curriculum_version = :ver;

-- NO untagged questions (competency is mandatory)
select count(*) as untagged
from quiz_questions qq
  join quizzes q on q.id=qq.quiz_id
  join chapters ch on ch.id=q.chapter_id
  join courses c on c.id=ch.course_id
where c.title = :title and qq.competency is null;   -- must be 0

-- every competency used is in the approved taxonomy for this program
select distinct qq.competency from quiz_questions qq /* ...join... */;
```

A publish is "done" only when: counts == manifest, `untagged == 0`, all
competencies are approved slugs, and the founder has flipped `is_published`.

## 7. Reference implementation

- Pattern reference (canon-compliant, already merged):
  `supabase/migrations/20260619010000_flagship_scrum_lessons_quizzes.sql`
  (chapter loop → videos + `chapter_end` quizzes) and
  `20260619020000_flagship_scrum_questions_mapped.sql`
  (`quiz_questions` with `competency` + `translations` at insert).
- Template for new programs: `docs/curriculum/_publish/TEMPLATES.md` (this PR) —
  the idempotent publish migration + verification blocks. (Kept as markdown
  because `.gitignore` tracks `*.sql` only under `supabase/migrations/`; a
  template becomes a real `.sql` migration when instantiated per program.)

## 8. Build backlog (program-agnostic spine, then per program)

Spine (this workstream):
1. ✅ Standard + schema contract (this doc).
2. Reference migration + verification templates (this PR).
3. Per-program manifest stubs for Scrum / BA / PM / DA.

Then per program, in canon build order (Scrum ≥95 → BA → PM → DA):
4. Generate publish migration from manifest (reviewable, `is_published=false`).
5. Founder applies; run verification; flip `is_published=true`.
6. Surface `program_*` assets in the student player (close §2c gaps).

## 9. Program scope note (founder-ratified, 2026-06-21)

Launch programs are **Scrum Master, Project Manager, Business Analyst, Data
Analyst** — aligning execution with the canon build order. **Cybersecurity is a
post-launch (future) program**: it has no `cyber:` competency track yet and is
out of scope for the four-program launch. When it is greenlit, it must first
earn a ratified `cyber:` taxonomy section before any content is authored.
