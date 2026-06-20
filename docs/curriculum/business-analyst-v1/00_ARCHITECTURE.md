# AI Business Analyst & Product Discovery Specialist — Flagship Architecture (v1)

> Status: **Architecture only.** No lessons, quizzes, or simulations are generated here.
> Built on the ratified canon (`COMPETENCY_TAXONOMY.md` §7, **13 `ba:` slugs**) and mirrors the
> AI Enterprise Scrum Master flagship template (`docs/curriculum/scrum-master-v3/`,
> `aiScrumMasterFull.ts`). Goal: take BA from ~25% → ≥95% of the Scrum quality bar.

## 0. North star — the best BA in the world, 2026–2030

Not a CBAP requirements-scribe. The target graduate is an **AI-augmented analyst who can find
AND choose opportunities, model the enterprise, engineer & validate AI output, navigate
compliance, and defend a recommendation to a board** — synthesizing IIBA (CBAP/AAC/POA),
SVPG/Cagan/Torres continuous discovery, Amazon Working Backwards, and McKinsey/Deloitte/
Accenture transformation consulting. Career ladder (canon §10): Jr BA/Requirements Analyst →
BA/Product Analyst → Lead BA/Product Owner → Head of Product Operations / Director of BA.

## 1. Module map (15 modules · 6 phases) → competency coverage

Mirrors Scrum's 6-phase shape. Each module owns a primary slug (weights shown like Scrum's
`competencyMapping`). ~5 lessons/module → **~75 lessons** (Scrum authored 72).

| # | Module | Phase | Primary competency (weight) |
|---|---|---|---|
| 1 | BA Foundations & the Modern BA Role | 1 Foundations | `ba:requirements` 70, `ba:product-thinking` 30 |
| 2 | BA Planning, Competencies & AI Toolkit | 1 Foundations | `ba:requirements` 50, `ba:ai-analysis` 30, `ba:facilitation` 20 |
| 3 | Stakeholder Analysis & Management | 2 Discovery & Stakeholders | `ba:stakeholders` 100 |
| 4 | Elicitation Techniques & Collaboration | 2 | `ba:elicitation` 100 |
| 5 | Facilitation & Workshop Leadership | 2 | `ba:facilitation` 100 |
| 6 | Requirements Engineering: Analysis, Spec & Lifecycle | 3 Requirements & Architecture | `ba:requirements` 100 |
| 7 | Business Process Analysis & Modeling (BPMN) | 3 | `ba:process-analysis` 100 |
| 8 | Business Architecture: Capabilities, Value Streams & Operating Models | 3 | `ba:business-architecture` 100 🆕 |
| 9 | Product Thinking & Strategy | 4 Product & Solution | `ba:product-thinking` 100 |
| 10 | Product Discovery & Solution Definition | 4 | `ba:product-discovery` 100 |
| 11 | Solution Evaluation, Validation & Acceptance | 4 | `ba:solution-eval` 100 |
| 12 | Data Analysis for BAs (SQL, metrics, KPIs) | 5 Data, AI & Compliance | `ba:data-analysis` 100 |
| 13 | AI-Augmented Analysis & Prompt Engineering | 5 | `ba:ai-analysis` 50, `ba:ai-prompting` 50 🆕 |
| 14 | Regulatory, Risk & Compliance Analysis | 5 | `ba:compliance` 100 🆕 |
| 15 | Capstone: Discovery-to-Transformation + Aladiah Profile | 6 Capstone | integrates all 13 |

**Coverage check: all 13 `ba:` slugs are a primary competency of ≥1 module. ✅**

## 2. Quiz strategy — tag the 200, author the gaps

The existing **200 hand-authored questions** (`seed-business-analysis-course`, 8 modules ×
5 lessons × 5 Qs, clean — no letter-prefix issues) are re-tagged to slugs at insert time and
remapped onto the 15-module structure. The second seed (`seed-ai-business-analyst`) is
templated boilerplate — **excluded**.

### 2a. Existing-bank coverage after re-tagging (per canon §7)
| `ba:` slug | Qs available | Source lessons | Status |
|---|---:|---|---|
| requirements | 45 | 1.1–1.3, 2.3–2.4, 3.3, 4.4, 8.1–8.2 | over-supplied → distribute M1/M2/M6 |
| process-analysis | ~20 | 3.1, 3.2, 3.4, 5.1 | strong |
| data-analysis | 20 | 6.1–6.4 | strong |
| solution-eval | ~15 | 5.2, 5.4, 5.5 | strong |
| product-thinking | 20 | 4.1, 4.3, 4.5, 5.3, 7.3 | adequate |
| ai-analysis | 20 | 1.5, 3.5, 6.5, 8.5 | adequate (shallow → deepen) |
| **business-architecture** 🆕 | ~10 | 7.2 Enterprise Arch, 7.5 Org Design (re-mapped here) | **partial — author +10** |
| stakeholders | 10 | 2.2, 7.1 | thin → top up |
| elicitation | 10 | 2.1, 2.5 | thin → top up |
| facilitation | 10 | 1.4, 7.4 | thin → top up |
| product-discovery | 5 | 4.2 | **under — author +15** |
| **ai-prompting** 🆕 | 0 | — | **GAP — author ~20** |
| **compliance** | 0 | — | **GAP — author ~20** |

10 legacy "career" questions (old 8.3/8.4) map to no competency → **retire or mark non-assessed**.

### 2b. Gap-authoring list (priority order, author LATER — not now)
1. **`ba:compliance`** — ~20 Qs (zero today). Biggest hole; the differentiator vs commodity BA programs.
2. **`ba:ai-prompting`** — ~20 Qs (new slug). Prompt patterns + validating AI output (bias/hallucination/traceability).
3. **`ba:product-discovery`** — +15 (only 5). Opportunity-solution trees, assumption testing, continuous discovery (Torres), Working Backwards.
4. **`ba:business-architecture`** — +10 (only ~10 re-mapped). Capability maps, value streams, operating models, target-state.
5. **Top-ups** — stakeholders / elicitation / facilitation to ~15–20 each.
6. **Deepen `ba:ai-analysis`** from awareness-level to applied.

**Target bank:** ~20 Qs/module (≈300), each `chapter_end`, passing 85 (capstone 90), competency
populated at insert (never NULL — honors CLAUDE.md). Mirrors Scrum's `ASSESS` blueprint.

## 3. Simulation blueprint (the 10-scenario suite)

Mirrors Scrum's two-layer model: one bespoke multi-screen interactive sim (like "Project Nebula")
+ a graded scenario suite. Screens reuse the simulation engine pattern (chat ceremonies, a work
board, an inbox, a validation/reports board) via a new `ba-simulation` edge function.

| # | Simulation | Tier | Competencies stressed |
|---|---|---|---|
| 1 | **Discovery Engagement** (primary interactive sim) | Core | elicitation, product-discovery, stakeholders, requirements |
| 2 | Hostile Stakeholder Workshop | Intermediate | facilitation, stakeholders |
| 3 | Conflicting Requirements Crisis | Intermediate | requirements, stakeholders |
| 4 | Executive Steering Committee | Advanced | stakeholders, product-thinking |
| 5 | AI Requirements Generator Validation | Advanced | ai-prompting, ai-analysis |
| 6 | Regulatory Compliance Failure | Advanced | compliance |
| 7 | Product Prioritization War Room | Advanced | product-thinking, product-discovery |
| 8 | UAT Defect Storm | Intermediate | solution-eval |
| 9 | Enterprise Transformation Program | Capstone-tier | business-architecture, all |
| 10 | Board-Level Recommendation | Capstone-tier | business-architecture, product-thinking, stakeholders |

**Interactive sim "Discovery Engagement" — screens:** Stakeholder Interviews (AI chat) ·
Requirements Workspace (BRD + backlog) · Process Modeler (BPMN board) · Elicitation Inbox
(requests/conflicts) · Validation & UAT board · Insights/Recommendation report. Scoring on
4 dimensions (elicitation, modeling, prioritization, communication) → grade + skills report,
mirroring `scrum_simulations`/`simulation_scores`.

## 4. Labs blueprint (program-specific, `{name, tool, task, deliverable}`)
| Module | Lab | Tool | Deliverable |
|---|---|---|---|
| 4 | Elicitation question design | — | Interview/workshop guide |
| 6 | Requirements traceability | — | RTM (requirements traceability matrix) |
| 7 | Process modeling | Lucid/draw.io/BPMN | As-is + to-be BPMN |
| 8 | Capability mapping | — | Capability map + value stream |
| 12 | SQL for BAs | SQL sandbox | Queried KPI set |
| 13 | AI prompting + validation | LLM | Prompt library + validation checklist |
| 14 | Compliance matrix | — | Regulatory requirements matrix |

## 5. Portfolio blueprint (8 employer-facing artifacts → GitHub)

Path `github.com/{student}/aladiah-ai-business-analyst-portfolio`, one folder per artifact
(mirrors Scrum's per-module portfolio → GitHub model).

| # | Artifact | Built in | Competency proof |
|---|---|---|---|
| 1 | Executive Discovery Report | M10 | product-discovery, stakeholders |
| 2 | Current-/Future-State BPMN Package | M7 | process-analysis |
| 3 | AI Requirements Package | M13 | ai-analysis, ai-prompting |
| 4 | Product Opportunity Assessment | M9 | product-thinking |
| 5 | Business Case | M11 | solution-eval |
| 6 | Full UAT Package | M11 | solution-eval |
| 7 | Stakeholder Management Plan | M3 | stakeholders |
| 8 | Transformation Recommendation Deck | M8/M15 | business-architecture |

## 6. Interview-prep blueprint
- **Interview Simulator scenarios** (new, mirror `InterviewSimulator.tsx`, gated `interview_coach`, 6 Qs, AI generate+score): `business_analyst` (medium), `requirements_architect` (hard), `product_analyst` (medium), `transformation_consultant` (hard).
- **Per-module sets**: `{ behavioral[], scenario[], leadership[], star }` for all 15 modules (Scrum parity).

## 7. Certification blueprint
- **`program_certifications` row:** credential "AI Business Analyst & Product Discovery Specialist"; `credential_level` Professional (**L300**); `passing_score` 85; `competency_tags` = all **13 `ba:` slugs**; `industry_alignment` = [IIBA CBAP, IIBA AAC, IIBA POA, PMI-PBA].
- **`exam_blueprint`:** ~150-question final, balanced from the bank by domain weight (requirements & process ~30%, discovery & product ~20%, data & AI ~20%, stakeholders & facilitation ~15%, compliance & architecture ~15%).
- **`completion_logic` / gate:** all 15 module quizzes ≥85% + capstone (M15) ≥80% → credential issued, Talent Score boost, placement-ready flag (mirrors Scrum issuance path; competency snapshot is *demonstrated*, never NULL).

## 8. Gap analysis — BA ~25% → Scrum ~95%

| Dimension | Current | Target (Scrum bar) | Work to close |
|---|---|---|---|
| Modules | 8 (seed-fn, DB-only) | 15 in migrations, 6 phases | Restructure + promote to migrations |
| Lessons | 40 templated | ~75 authored (transcript+video+resource+assignment) | Author to Scrum bar |
| Quizzes | 200 untagged | ~300 tagged, all 13 slugs, insert-time competency | Tag 200 + author ~85 gap Qs + retire 10 career Qs |
| Simulations | 0 real (stubs) | 1 interactive + 10-scenario suite | Build `ba-simulation` engine + scenarios |
| Labs | generic tutor | 7 BA-specific labs | Author labs |
| Portfolio | stub | 8 artifacts → GitHub | Build submission + artifact templates |
| Interview | absent | 4 sim scenarios + 15 module sets | Author scenarios |
| Certification | none | `program_certifications` row + gate | Seed cert + blueprint |

## 9. Build sequence (post-approval; no content generated yet)
1. **Tag the 200 existing questions** to `ba:` slugs (insert-time) per §2a; retire the 10 career Qs.
2. **Author the gap questions** (§2b priority order) — compliance, ai-prompting, discovery, business-architecture, thin top-ups.
3. **Promote curriculum to migrations** — 15-module/6-phase structure, course row `is_flagship`.
4. **Author lessons** to the Scrum bar (~75).
5. **Build the "Discovery Engagement" interactive sim** (reuse the simulation engine) + scenario suite.
6. **Seed `program_certifications`** + exam blueprint + gate.
7. **BA labs, portfolio submission, interview scenarios.**

Each step is verified before the next (one discrete change at a time, per CLAUDE.md). No lessons,
quizzes, or simulations are generated until this architecture is approved.
