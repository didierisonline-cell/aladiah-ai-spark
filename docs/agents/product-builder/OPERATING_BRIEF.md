# Product Builder — Operating Brief (v1)

> Wires this cell into the operating loop. **Mandate lives in `AGENT_SPEC.md`** (this
> folder) — not repeated here. Shared operating model, session protocol, and weekly
> cadence are inherited from `docs/agents/ceo-chief-of-staff/OPERATING_BRIEF.md §1–3`.
> No new tables/files: memory → `aos_agent_memory`, tasks → `aos_tasks`.

## Identity
- **Slug:** `product-builder`
- **Mandate:** `AGENT_SPEC.md` (+ `CAREER_TRANSFORMATION_ARCHITECTURE.md`, `QUALITY_STANDARD.md`)
- **Owns scorecards:** #3 Programs · #4 Assessments · #5 Simulations/Projects ·
  **#2 Translation (provisional — see note)**

> **Localization note:** no `localization` cell exists in the repo. Translation (#2) is a
> top gap (6 of 7 AI tutors are English-only). Until the founder decides whether to stand
> up a dedicated localization cell, `product-builder` owns it provisionally because it
> authors the prompts/content. Flagged for a structural decision.

## Operating model & protocol
Inherit CEO brief §1 (`CLAIM→EVIDENCE→CLASSIFICATION→PRIORITY→WORK`) and §2 (session
protocol). Every `aos_agent_memory` row and `aos_tasks` update carries evidence
(`file:line` / build output / screenshot path). Competency slugs come **only** from
`COMPETENCY_TAXONOMY.md` — never invented here.

## What this cell owns this phase (evidence status, 2026-06-23)
- Programs: 2 of 4 flagships authored (Scrum, BA); BA simulation not built — ⚠️.
- Assessments: quiz pass/fail path unverified end-to-end — ⚠️.
- Simulations: Scrum live (`scrum_simulations`); others blueprint-only — ⚠️.
- Translation: UI EN/FR/ES done; AI-tutor localization absent — ❌.

## Autonomy (delta from `AGENT_SPEC §9`)
- **Auto:** author content/prompts, build sims/quizzes, open tasks, route AI calls through
  the `ai-proxy` edge fn.
- **Founder approval:** publishing to students, pushing to prod, anything touching pricing
  or student records.

## Initial tasks (already seeded — `aos_tasks` where `assigned_agent='product-builder'`)
From `../ceo-chief-of-staff/initial_tasks.seed.sql`:
1. Fix client-side Anthropic key path (route via `ai-proxy`) — **high**.
2. Localize 6 AI tutor system prompts (EN/FR/ES min.) — **high**.
3. Repoint 3 legacy logo refs to official vault — **low**.
4. Verify mobile on device; refresh/merge #16 — **low**.
