> **Status: Canonical** — Required reading for: Claude Code · AI agents · developers · product owners.
> Part of the Aladiah platform canon (`/docs/standards`): NORTH_STAR (why) · ARCHITECTURE_PRINCIPLE (what qualifies) · COMPETENCY_TAXONOMY (how competency is named).
> Append-only where noted; do not delete or fork. Changes to these documents are platform-level decisions.

# Competency Taxonomy — Canonical Standard (repo source of truth)

Status: **Canonical. This file is the single source of truth for competency slugs.**
Code (quiz seeding, insert-time tagging, Phase-2 rollup) must read slugs from this
registry. Do **not** invent slugs anywhere else. First program defined: **Scrum Master**.
This file is the model every future program extends — append a new Axis-1 section, never fork.

---

## 1. Conventions & governance (apply to ALL programs)

**Slug format:** `<program>:<topic>` — e.g. `scrum:roles`.
- `<program>` = stable short program key, lowercase (`scrum`, future: `cyber`, `ai-ux`, …).
- `<topic>` = lowercase, hyphenated, analytics-friendly. No spaces, no caps, no underscores.

**Governance rules (these protect historical analytics — read before editing):**
1. **Append-only.** New topics get new slugs. You may ADD slugs at any time.
2. **Never rename a slug.** `competency` is snapshotted onto each `quiz_attempt_answers`
   row at submit time. Renaming a slug orphans every past attempt that carried the old
   value — exactly like mutating an enum. If a label is wrong, fix the *label/description*
   here; leave the *slug string* frozen.
3. **One primary slug per question.** Each quiz question carries exactly one Axis-1 slug
   (its dominant competency). Don't multi-tag — it breaks clean per-competency rollups.
4. **A program uses a SUBSET per module.** It is normal and expected for an early module
   to exercise only some of a program's slugs. Unused ≠ missing.

---

## 2. Scrum Master — Axis-1 registry (8 slugs)

| Slug | Label | Description |
|---|---|---|
| `scrum:framework` | Scrum Framework Fundamentals | What Scrum is, when to use it, how the pieces fit together, and Scrum vs. traditional/waterfall approaches. |
| `scrum:roles` | Accountabilities & Roles | The three accountabilities (Scrum Master, Product Owner, Developers): responsibilities, boundaries, and how the Scrum Master differs from a traditional project manager. |
| `scrum:events` | Scrum Events | The Sprint plus the four events (Planning, Daily Scrum, Review, Retrospective): purpose, timeboxes, participants, facilitation. |
| `scrum:artifacts` | Artifacts & Commitments | Product Backlog, Sprint Backlog, Increment — and their commitments: Product Goal, Sprint Goal, Definition of Done. |
| `scrum:empiricism` | Empiricism & Agile Principles | The empirical pillars (transparency, inspection, adaptation), the Scrum values, and the underlying Agile/lean principles. |
| `scrum:team-dynamics` | Team Dynamics & Facilitation | Servant/facilitative leadership, coaching vs. mentoring, conflict resolution, self-management, emotional intelligence, building a healthy team. |
| `scrum:stakeholders` | Stakeholder & Organizational Engagement | Working with stakeholders and the Product Owner, organizational change, and removing impediments beyond the immediate team. |
| `scrum:delivery-metrics` | Delivery & Flow Metrics | Velocity, burndown/burnup, flow and forecasting, and using metrics to support continuous improvement (not as performance targets). |

---

## 3. Axis-2 cross-program meta-category map (PROPOSED — confirm before Phase-2 build)

Phase-2 analytics resolves each Axis-1 slug to a cross-program meta-category at rollup
time (per `PHASE2_ANALYTICS_PLAN.md`). Keeping that map here keeps it single-source.
Meta-category keys are deliberately generic so other programs map into the same set.

| Axis-1 slug | Axis-2 meta-category |
|---|---|
| `scrum:framework` | `foundations` |
| `scrum:empiricism` | `foundations` |
| `scrum:roles` | `roles-accountabilities` |
| `scrum:events` | `process-execution` |
| `scrum:artifacts` | `artifacts-tooling` |
| `scrum:team-dynamics` | `people-leadership` |
| `scrum:stakeholders` | `stakeholder-engagement` |
| `scrum:delivery-metrics` | `measurement-outcomes` |

Cross-program meta-category set (the fixed Axis-2 vocabulary future programs map into):
`foundations` · `roles-accountabilities` · `process-execution` · `artifacts-tooling` ·
`people-leadership` · `stakeholder-engagement` · `measurement-outcomes`.

---

## 4. Module 1 scope note ("The Role of the Scrum Master")

Module 1 is role-heavy (course intro, SM role & benefits, what the SM does, SM skills,
a day in the life). Expect its questions to draw mainly on:
`scrum:framework`, `scrum:roles`, `scrum:team-dynamics`, with some `scrum:events`,
`scrum:stakeholders`, and `scrum:empiricism`.

`scrum:artifacts` and `scrum:delivery-metrics` are **unlikely to appear in Module 1** and
that is expected — they belong to later modules. If a Module-1 mapping leans on those two,
treat it as a flag to re-check, not a default.

---

## 5. How code consumes this (informational)

- **Insert-time tagging:** every `quiz_questions` row is seeded with one slug from §2.
- **Capture:** `Quiz.tsx` snapshots `quiz_questions.competency` onto each
  `quiz_attempt_answers` row at submit (already live as of commit `bc8365b`).
- **Phase-2 rollup:** groups attempt rows by Axis-1 slug → per-competency accuracy;
  resolves Axis-2 via §3 for cross-program views. No schema change required.
