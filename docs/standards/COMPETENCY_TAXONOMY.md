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

## 3. Axis-2 cross-program meta-category map (CONFIRMED — locked for Phase-2 build)

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

---

# Taxonomy V2 — additional programs (ratified)

> Ratified by the founder. Adds three programs (PM, BA, DA) to the canon, append-only.
> Scrum (§2–5) is unchanged and remains the gold-standard template. The same conventions
> in §1 apply to every program below.

## 6. AI Project Manager & Delivery Leader — Axis-1 registry (`pm:`, 11 slugs)

| Slug | Label | Description |
|---|---|---|
| `pm:planning` | Project Planning & Scope | Charter, scope/WBS, scheduling, critical path, baselines, plan tailoring. |
| `pm:risk` | Risk & Issue Management | Identification, qual/quant analysis, response strategies, escalation, contingency. |
| `pm:finance` | Financial Management & Value | Budgeting, cost control, EVM (CPI/SPI), ROI/benefit cases. |
| `pm:procurement` | Vendor & Procurement Management | Make/buy, SOWs/contracts, vendor selection & performance, third-party delivery. |
| `pm:portfolio` | Portfolio & Program Management | Prioritization, cross-project dependencies, benefits realization, governance gates. |
| `pm:stakeholders` | Stakeholder & Executive Communication | Steering committees, exec/status reporting, expectation & escalation management (up/out). |
| `pm:delivery-methods` | Delivery Methods & Hybrid Agile | Predictive/agile/hybrid selection, lifecycle tailoring, scaling. |
| `pm:ai-delivery` | AI-Augmented Delivery | AI for planning, status synthesis, risk prediction, PMO automation. |
| `pm:change-leadership` | Change Leadership & Adoption | Org-level change, resistance, adoption curves, sponsorship. |
| `pm:leadership` | Team Leadership & Influence | Leading the delivery team — influence without authority, conflict management, executive presence, cross-functional alignment. |
| `pm:quality-closure` | Quality, Outcomes & Closure | Acceptance criteria, benefits validation, lessons learned, formal closure. |

Boundary: `pm:stakeholders` (communicate up/out) ≠ `pm:change-leadership` (org transformation) ≠ `pm:leadership` (lead the people on the team).

## 7. AI Business Analyst & Product Discovery Specialist — Axis-1 registry (`ba:`, 11 slugs)

| Slug | Label | Description |
|---|---|---|
| `ba:requirements` | Requirements Engineering | Analysis, specification, traceability, validation & lifecycle management of requirements. |
| `ba:elicitation` | Elicitation & Collaboration | Interviews, workshops, observation, document analysis, prototyping. |
| `ba:process-analysis` | Business Process Analysis | As-is/to-be modeling (BPMN), gap & root-cause analysis, optimization. |
| `ba:stakeholders` | Stakeholder Management | Identification, RACI, alignment, negotiation, conflict resolution. |
| `ba:product-thinking` | Product Thinking & Strategy | Outcomes over outputs, value/vision, business-model thinking, product strategy, north-star metrics. |
| `ba:product-discovery` | Product Discovery & Solution Definition | Discovery process: opportunity framing, experiments, validation, MVP, prioritization. |
| `ba:facilitation` | Facilitation & Workshop Leadership | Structured facilitation, decision-making, consensus, design thinking. |
| `ba:data-analysis` | Data Analysis for BAs | Metrics, SQL basics, data-informed requirements, KPI definition. |
| `ba:ai-analysis` | AI-Assisted Analysis | LLM-assisted elicitation synthesis, requirement drafting, model generation. |
| `ba:compliance` | Regulatory, Risk & Compliance | Controls, audit, data-privacy & regulatory requirement analysis. |
| `ba:solution-eval` | Solution Evaluation & Acceptance | UAT, acceptance, value realization, post-implementation review. |

Boundary: `ba:product-thinking` (strategic mindset / *why*) ≠ `ba:product-discovery` (discovery *process* / *how we learn*).

## 8. AI Data Analyst & Decision Intelligence Professional — Axis-1 registry (`da:`, 10 slugs)

| Slug | Label | Description |
|---|---|---|
| `da:sql` | SQL & Data Querying | Joins, aggregation, window functions, query optimization. |
| `da:data-modeling` | Data Modeling & Preparation | Cleaning/wrangling, schemas, ETL basics, data integrity. |
| `da:statistics` | Statistics & Analytical Methods | Descriptive/inferential stats, A/B testing, significance, sampling. |
| `da:visualization` | Data Visualization | Chart selection, dashboard design, Tableau / Power BI craft. |
| `da:bi` | Business Intelligence & Reporting | KPIs, semantic models, self-serve BI, reporting cadence. |
| `da:forecasting` | Forecasting & Predictive Analytics | Time-series, regression, trend & scenario modeling. |
| `da:ai-analytics` | AI-Assisted Analytics | NL-to-SQL, automated insight, ML fundamentals, augmented analysis. |
| `da:decision-support` | Executive Decision Support | Decision framing, structuring options, recommendation logic (decision intelligence). |
| `da:data-storytelling` | Data Storytelling & Communication | Executive communication, visual narratives, insight presentation, recommendation framing. |
| `da:data-ethics` | Data Quality, Governance & Ethics | Privacy, bias, integrity, responsible-use guardrails. |

Boundary: `da:decision-support` (*what to decide & why* — reasoning) ≠ `da:data-storytelling` (*how to communicate it* — delivery craft).

## 9. Axis-2 map — V2 programs (extends §3)

The §3 cross-program vocabulary is reused verbatim. **One ratified addition: `ai-augmentation`**
(AI fluency is cross-cutting and new; adding an Axis-2 meta is safe — Axis-2 is *derived* from
Axis-1 at rollup, so it orphans no snapshotted data). Updated Axis-2 set (8):
`foundations` · `roles-accountabilities` · `process-execution` · `artifacts-tooling` ·
`people-leadership` · `stakeholder-engagement` · `measurement-outcomes` · `ai-augmentation`.

| Program | `foundations` | `process-execution` | `artifacts-tooling` | `people-leadership` | `stakeholder-engagement` | `measurement-outcomes` | `ai-augmentation` |
|---|---|---|---|---|---|---|---|
| **PM** | delivery-methods | planning, risk, portfolio | — | change-leadership, leadership | procurement, stakeholders | finance, quality-closure | ai-delivery |
| **BA** | product-thinking, compliance | requirements, elicitation, process-analysis, product-discovery | — | facilitation | stakeholders | data-analysis, solution-eval | ai-analysis |
| **DA** | data-ethics | sql, data-modeling | visualization, bi | — | decision-support, data-storytelling | statistics, forecasting | ai-analytics |

Shared (transferable) competency spine across all programs: `stakeholder-engagement`,
`measurement-outcomes`, `people-leadership`, and `ai-augmentation` — these power
cross-program Talent Score comparison and hiring matching.

## 10. Career Outcome Matrix (the north star for every learning path)

Aladiah sells careers, not courses. Every program targets a real hiring ladder. Titles are
representative market roles; salary context is region-dependent (Aladiah's remote LATAM/Africa
markets typically index below US bands).

| Program | Entry | Mid | Senior | Executive |
|---|---|---|---|---|
| **Scrum Master** | Junior Scrum Master · Agile Team Facilitator | Scrum Master · Agile Delivery Lead | Senior Scrum Master · Agile Coach · RTE | Head of Agile · Director of Delivery |
| **Project Manager** | Project Coordinator · Junior PM | Project Manager · Delivery Manager | Senior PM · Program Manager · PMO Lead | Director PMO · VP Programs |
| **Business Analyst** | Junior BA · Requirements Analyst | Business Analyst · Product Analyst | Lead BA · Product Owner | Head of Product Operations · Director of Business Analysis |
| **Data Analyst** | Reporting Analyst · Junior BI Analyst | Data Analyst · BI Analyst | Senior Data Analyst · Analytics Manager · Decision Intelligence Lead | Director Analytics · Head of Decision Intelligence |

## 11. Program-key index & change log

| Program key | Program | Slugs | Status |
|---|---|---|---|
| `scrum` | AI Enterprise Scrum Master & Agile Transformation Leader | 8 | Canon (v1) — gold-standard template |
| `pm` | AI Project Manager & Delivery Leader | 11 | Canon (v2, ratified) |
| `ba` | AI Business Analyst & Product Discovery Specialist | 11 | Canon (v2, ratified) |
| `da` | AI Data Analyst & Decision Intelligence Professional | 10 | Canon (v2, ratified) |

**Total: 40 Axis-1 slugs across 4 programs.** V2 ratification adds the `ai-augmentation`
Axis-2 meta and the Career Outcome Matrix (§10). Build order: Scrum (≥95%) → BA → PM → DA.
