# Scrum Flagship — System Reconciliation & Single Source of Truth

Grounded in source. DB row counts require a live query (audit SQL provided earlier).

## PHASE 1 — Architecture audit matrix

| Asset | Current source | Current storage | Localization status | Recommended SoT |
|---|---|---|---|---|
| Course titles | courses.title (+translations) | DB | ✅ resolver, JSONB | DB courses.translations |
| Module titles | chapters.title (+translations) | DB | ✅ resolver (fixed) | DB chapters.translations |
| Lesson titles | videos.title (+translations) | DB | ✅ resolver | DB videos.translations |
| Lesson descriptions | videos.description (+translations) | DB | ✅ resolver | DB videos.translations |
| Lesson content (body) | videos.description | DB | ✅ via translations | DB videos.translations |
| Lesson transcripts | videos.translations.en.transcript (no base col) | DB | ✅ translate-content handles transcript | DB videos.translations |
| Diagrams | lesson_visuals.svgs (AI-generated) | DB | ❌ SVG text is English; not translated | DB + per-language visual generation |
| Quizzes | quizzes | DB | n/a (container) | DB |
| Quiz questions | quiz_questions (+translations col ADDED) | DB | ⚠️ column exists, NOT populated | DB quiz_questions.translations |
| Simulations | aiScrumMasterFull.ts / simulations.ts | **CODE** | ❌ not localized | **migrate to DB (content_i18n)** |
| Labs | aiScrumMasterFull.ts | **CODE** | ❌ | **migrate to DB** |
| Portfolio projects | aiScrumMasterFull.ts (no DB table) | **CODE** | ❌ | **migrate to DB** |
| Assessments | quizzes + quiz_questions | DB | ⚠️ via questions | DB |
| Certification exam | none dedicated (capstone quiz); program_certifications = credential metadata | partial | — | **define capstone quiz as canonical cert gate** |

## PHASE 2 — Curriculum consolidation (eliminate duplicate Scrum programs)
- **A. Old Scrum** = `supabase/functions/seed-scrum-course/index.ts` — 4 modules, 102 real authored questions, currently deployed (contains "Scrum Master Opportunities"/"Final Project").
- **B. Flagship** = `aiScrumMasterFull.ts` (18-module spec) + the 3 DB migrations (`…000000/010000/020000`).
- **Plan → ONE production curriculum = the DB-seeded 18-module flagship.** Apply the 3 migrations; **100/102 old questions already mapped** into it. Then **deprecate `seed-scrum-course`** (mark obsolete — do NOT delete until the 2 unparsed questions are recovered + verified). Nothing discarded; old authored content preserved by the mapping.

## PHASE 3 — Flagship readiness report (per module)
| Module | Lessons | Sims | Lab | Portfolio | Assessment (Qs) | Status |
|---|---|---|---|---|---|---|
| M1 | 4 ✅ | 3 (code) | 1 (code) | 1 (code) | 1 | ◑ thin Qs |
| M2 | 4 | 3c | 1c | 1c | 5 | ◑ |
| M3,5,6,7,8,9,11,14,15,16,17 | 4 each | 3c | 1c | 1c | **0** | ❌ no Qs |
| M4 | 4 | 3c | 1c | 1c | 3 | ◑ |
| M10 | 4 | 3c | 1c | 1c | 4 | ◑ |
| M12 | 4 | 3c | 1c | 1c | 10 | ◑ |
| M13 | 4 | 3c | 1c | 1c | 37 | ✅ |
| M18 Capstone | 4 | 3c | 1c | 1c | 40 | ✅ cert-ready |
*(c = exists in CODE only, not student DB path.)* Lessons 72 ✅ (DB after migration). Sims 54 / Labs 18 / Portfolio 18 = code-only → DB gap. Questions: 100 across 7 modules; **11 modules empty**.

## PHASE 4 — Localization reconciliation
French screenshot (UI ✅ / content ❌) root cause = content tiers not populated/translated:
- **Chrome:** dictionary, 8 langs, 100% ✅.
- **Course/module/lesson title+desc+transcript:** DB JSONB → resolver renders selected language; **populate via `translate-content`** (courses/chapters/videos).
- **Quiz questions:** `translations` column added; **translate-content does NOT yet cover quiz_questions** → extend it, then populate.
- **Simulations/labs/portfolio:** CODE → must move to DB to be translatable.
- **Diagrams:** SVG text English → per-language generation (or accept English short-term).
**Rule:** selected language controls all assets once each tier is DB-backed + populated.

## PHASE 5 — Question bank strategy
- **Available:** 100 mapped (+2 to recover) of 102 authored.
- **Per module:** M18=40, M13=37, M12=10, M2=5, M10=4, M4=3, M1=1, others=0.
- **Min (20/module quiz):** need 360 → **260 short**; 11 modules at 0.
- **Cert blueprint (60/module = 1,080):** **980 short**.
- **Strategy:** (A) **reuse** authored — done (100). (B) **generate** the ~260 to reach 20/module via the question-bank generator, seeded by each module's competencyMapping + learningObjectives. (C) **human review** before publish (mandatory for AR/ZH). Order: fill 11 empty modules first.

## PHASE 6 — Single source of truth (target architecture)
- **Canonical curriculum:** the **DB** (`courses/chapters/videos`). `aiScrumMasterFull.ts` becomes the **authoring/seed source** that *generates* the DB — not a parallel render path. (Follow-up: point `FlagshipProgram.tsx` at the DB so there's no code render path.)
- **Canonical assessment:** `quizzes` + `quiz_questions` (DB).
- **Canonical localization:** `*.translations` JSONB (content) + `LanguageContext` (chrome); long-term unify under the Phase-2 `content_i18n` pipeline.
- **Canonical certification:** the **capstone (M18) chapter_end quiz** as the cert gate; `program_certifications` for credential metadata.
- **Invariant:** no asset rendered from code on the student path; no curriculum split code/DB.

## PHASE 7 — Execution plan (ranked by impact)
**1. Already complete:** render resolver (merged, prod); chrome i18n 8 langs (100%); 3 flagship migrations authored (18 modules / 72 lessons / 18 quizzes / 100 questions + quiz_questions.translations); translate-content for course content; founder dashboard + audit tooling + populate executor.
**2. Migrate (apply, by you):** the 3 migrations in order; then deprecate `seed-scrum-course`.
**3. Generate:** ~260 questions (→20/module), later 980 (→60/module); migrate sims/labs/portfolio into DB.
**4. Translate:** run `populate-translations.mjs` (courses/chapters/videos); extend it to quiz_questions; translate sims/labs/portfolio once DB-backed.
**5. Review:** AR/ZH content + question QA; recover the 2 unparsed questions.
**6. Blocks launch:** 11 empty module assessments; quiz_question translations unpopulated; sims/labs/portfolio code-only + untranslated; diagrams English.
**7. Launch immediately (after step 2+4 for course content):** 18 modules + 72 localized lessons + **capstone certification (M18, 40 real Qs)** in all 8 languages — a complete, certifiable path with no per-module-quiz gating.

### Impact ranking
1. **Apply 3 migrations + run populate-translations** → unlocks 18 localized modules + lessons + capstone cert in 8 langs. *(Unblocks the core success condition.)*
2. **Generate questions for 11 empty modules → 20 each** → per-module assessments.
3. **Extend translate-content to quiz_questions + populate** → localized assessments.
4. **Migrate sims/labs/portfolio to DB + translate** → removes code-only deps.
5. **Diagram localization** → lowest; English acceptable short-term.

## Success condition — honest reachability
French student completing all 18 modules + lessons + transcript + **capstone certification** in French = **reachable after steps 2 + 4** (apply migrations, populate translations). Full parity (per-module quizzes, simulations, labs, portfolio, diagrams all French) requires steps 3–5. No fabrication; no duplicate curriculum once `seed-scrum-course` is deprecated.
