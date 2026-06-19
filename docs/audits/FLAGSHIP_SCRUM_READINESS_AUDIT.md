# Flagship Program Readiness Audit — AI Enterprise Scrum Master & Agile Transformation Leader

**Date:** 2026-06-19 · **Auditor pass:** code/migration evidence only (live DB **not** queried — requires Supabase access/approval). Scores below are grounded in source files, not the running database.

## TL;DR

- **Is the old Scrum course replaced?** **Not in the live system.** The 18-module flagship exists as **3 reviewable migrations + a code spec**, but the migrations are **not applied**, so production still serves the **old 4-module `seed-scrum-course`**. Replacement is *authored and one founder action away* (apply 3 migrations in order, then deprecate `seed-scrum-course`).
- **Readiness honesty:** the **certifiable core** (18 modules, 72 lessons, capstone with 40 real questions, certification alignment, AI integration) is strong and close to launch-ready *after* applying migrations + populating translations. But **assessments, simulations, labs, portfolio, and interview prep are materially incomplete or code-only**, and the **published spec over-claims vs. what is actually authored**.

## Three tiers of truth (they do not match — this is the core risk)

| Tier | What it says | Evidence |
|---|---|---|
| **A. Spec (aspirational)** | 18 modules · **162 lessons** · 18 module exams · 54 sims · 18 labs · 18 portfolios · 6 exec sims · capstone · **200-q final exam** · "1,080-question bank" | `docs/curriculum/scrum-master-v3/CERTIFICATION.md`; course `description` in `20260619000000_*.sql` |
| **B. Authored (migrations, NOT applied)** | 18 modules · **72 lessons** (18×4) · 18 module quiz containers · **100 questions across 7 modules** · capstone 40 Q | `20260619000000/010000/020000_*.sql` (verified: 18 chapter inserts; loop-generated 4 lessons/module; 100 question rows) |
| **C. Live DB (production today)** | **Old 4-module `seed-scrum-course`** (102 authored questions) | `supabase/functions/seed-scrum-course/index.ts`; migrations unapplied |

**Integrity flags:** the course **description claims "1,080-question bank"** and the cert spec claims **162 lessons / 200-q exam**, while only **100 questions** and **72 lessons** are actually authored. These public-facing claims must not ship until backed by real content.

## 12-point Program Readiness scorecard (evidence-based)

| # | Criterion | Status | Evidence / gap |
|---|---|:--:|---|
| 1 | Full module structure | ✅ authored | 18 modules in `…000000` (verified 18 inserts). Live ❌ until applied. |
| 2 | Lessons complete | ◑ partial | 72 authored (loop 4/module) vs **162 in spec** → 44% of spec. EN only; translations not populated. |
| 3 | Quizzes complete | ◑ partial | 18 module quiz **containers** authored; content thin (see #4). |
| 4 | Module exams (20 Q each) | ❌ gap | 100 questions across **7** modules; **11 modules have 0 questions**. Need 360 for 20/module → **260 short**. |
| 5 | Simulations complete | ◑ code-only | 54 authored in `aiScrumMasterFull.ts` — **not on student DB path, not localized**. |
| 6 | Projects complete | ◑ code-only | 18 portfolio deliverables in code; not DB-backed. |
| 7 | Capstone complete | ✅ authored | M18 capstone, **40 real questions**, cert-ready (`CAPSTONE.md`). |
| 8 | Interview prep complete | ◑ code-only | Per-module behavioral/scenario/leadership/STAR in `aiScrumMasterFull.ts` — code-only, not localized. |
| 9 | Portfolio deliverables | ◑ code-only | Same as #6. |
| 10 | Certification alignment | ✅ authored | Scrum.org **PSM I/II** readiness; capstone = cert gate (`CERTIFICATION.md`). |
| 11 | AI integration every module | ✅ authored | "AI-Augmented" modules + an "AI co-pilot" lesson per module. |
| 12 | Employer skills mapped | ◑ partial | `competencyMapping` + `learningObjectives` per module ✅; explicit job-title/posting mapping partial. |

**Honest composite:** structure ~95% · student-path content ~50% (72/162 lessons, EN-only) · assessments ~28% (100/360 for 20-per-module) · sims/labs/portfolio/interview ~0% on the student path (code-only) · capstone + cert alignment ✅. **Sell-ready ≈ 55–65%**, but a **certifiable core path** (18 modules + 72 lessons + capstone in 8 languages) is reachable after two actions below.

## What unblocks the certifiable core (ranked, from the reconciliation doc)

1. **Apply the 3 migrations** (in order) + run `populate-translations.mjs` → 18 localized modules + 72 lessons + capstone cert in 8 languages. *(Founder/human action — SQL is not auto-applied.)*
2. **Generate ~260 questions** to bring all 18 modules to 20/module (seeded by each module's `competencyMapping` + `learningObjectives`; human review before publish, mandatory for AR/ZH).
3. **Extend `translate-content` to `quiz_questions`** + populate → localized assessments.
4. **Migrate sims/labs/portfolio/interview-prep from CODE → DB** + translate (removes the code-only student-path dependency).
5. **Deprecate `seed-scrum-course`** once the 2 unparsed questions are recovered.
6. **Correct public claims** (description "1,080-question bank", cert "162 lessons / 200-q exam") to match real authored content, or build the content first.

## Founder approval points (per your operating rule)

- Apply the 3 flagship migrations to production (replaces the live Scrum course).
- Approve the corrected program description / certification claims (currently over-claimed).
- Approve AI-generated questions after QA before they go live.

## Scope note

This audit covers **one** flagship (AI Scrum Master). PM / Business Analyst / Cybersecurity were **not** audited this pass — recommend the same 3-tier check (Spec vs Authored vs Live) for each before claiming readiness.
