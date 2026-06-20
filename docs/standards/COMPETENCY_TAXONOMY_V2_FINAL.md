> **Status: RATIFIED — merged into canon.** The canonical source of truth is now
> `COMPETENCY_TAXONOMY.md` §6–§11 (PM/BA/DA registries, Axis-2 V2 map, Career Outcome
> Matrix, program-key index). This file is retained as the design rationale + Program
> Outcome Definitions reference. Where the two differ, the canon wins — in particular the
> Axis-2 keys use canon names: `people-leadership`, `stakeholder-engagement`,
> `measurement-outcomes` (+ the ratified `ai-augmentation`).
> Part of the Aladiah platform canon (`/docs/standards`).

# Competency Taxonomy V2 — Final (ratification candidate)

Extends the canonical taxonomy from one program (Scrum Master) to four. Honors every
existing convention: `program:topic` slugs (lowercase, hyphenated), **append-only**,
**never rename a slug**, **one primary Axis-1 slug per question**, a program uses a
**subset** of its slugs per module. Scrum (8 slugs) is unchanged and is the gold-standard
template every program here mirrors.

Program keys: `scrum` (existing) · **`pm`** · **`ba`** · **`da`**.
Slug totals: Scrum 8 · PM 11 · BA 11 · DA 10 = **40 Axis-1 slugs**.

---

## 1 · AI Project Manager & Delivery Leader — `pm:` (11 slugs)

| Slug | Label | Definition |
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

Boundary note: `pm:stakeholders` (communicate up/out) ≠ `pm:change-leadership` (org transformation) ≠ `pm:leadership` (lead the people on the team).

---

## 2 · AI Business Analyst & Product Discovery Specialist — `ba:` (11 slugs)

| Slug | Label | Definition |
|---|---|---|
| `ba:requirements` | Requirements Engineering | Analysis, specification, traceability, validation & lifecycle management of requirements. |
| `ba:elicitation` | Elicitation & Collaboration | Interviews, workshops, observation, document analysis, prototyping. |
| `ba:process-analysis` | Business Process Analysis | As-is/to-be modeling (BPMN), gap & root-cause analysis, optimization. |
| `ba:stakeholders` | Stakeholder Management | Identification, RACI, alignment, negotiation, conflict resolution. |
| `ba:product-thinking` | Product Thinking & Strategy | Outcomes over outputs, value/vision, business-model thinking, product strategy, north-star metrics. |
| `ba:product-discovery` | Product Discovery & Solution Definition | Discovery process: opportunity framing, experiments, validation, MVP, prioritization techniques. |
| `ba:facilitation` | Facilitation & Workshop Leadership | Structured facilitation, decision-making, consensus, design thinking. |
| `ba:data-analysis` | Data Analysis for BAs | Metrics, SQL basics, data-informed requirements, KPI definition. |
| `ba:ai-analysis` | AI-Assisted Analysis | LLM-assisted elicitation synthesis, requirement drafting, model generation. |
| `ba:compliance` | Regulatory, Risk & Compliance | Controls, audit, data-privacy & regulatory requirement analysis. |
| `ba:solution-eval` | Solution Evaluation & Acceptance | UAT, acceptance, value realization, post-implementation review. |

Boundary note: `ba:product-thinking` (the strategic mindset / *why*) ≠ `ba:product-discovery` (the discovery *process* / *how we learn*).

---

## 3 · AI Data Analyst & Decision Intelligence Professional — `da:` (10 slugs)

| Slug | Label | Definition |
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

Boundary note: `da:decision-support` (*what to decide & why* — reasoning) ≠ `da:data-storytelling` (*how to communicate it* — delivery craft).

---

## 4 · Axis-2 meta-category map (the competency graph backbone)

Every Axis-1 slug resolves to a generic Axis-2 meta-category at Phase-2 rollup, so the
Talent Score & Competency Graph aggregate **transferable** skill across programs. The
first five metas are canon; **`ai-augmentation` is a proposed new meta** (AI fluency is
cross-cutting and new). `team-leadership`, `stakeholder-org`, `metrics-analytics` follow
the same generic scheme already implied by Scrum.

| Axis-2 meta | Scrum | PM | BA | DA |
|---|---|---|---|---|
| `foundations` | framework, empiricism | delivery-methods | product-thinking, compliance | data-ethics |
| `roles-accountabilities` | roles | — | — | — |
| `process-execution` | events | planning, risk, portfolio, quality-closure | requirements, elicitation, process-analysis, product-discovery | sql, data-modeling |
| `artifacts-tooling` | artifacts | — | — | visualization, bi |
| `stakeholder-org` | stakeholders | procurement, stakeholders | stakeholders | decision-support, data-storytelling |
| `team-leadership` | team-dynamics | change-leadership, leadership | facilitation | — |
| `metrics-analytics` | delivery-metrics | finance | data-analysis, solution-eval | statistics, forecasting |
| `ai-augmentation` 🆕 | *(reserve `scrum:ai`)* | ai-delivery | ai-analysis | ai-analytics |

### Competency graph layers
- **Shared (transferable across all 4):** stakeholder management + metrics/analytics — the spine of a cross-program Talent Score.
- **Program-specific:** the technical/domain slugs unique to each track.
- **AI layer (`*:ai-*` → `ai-augmentation`):** program-scoped slugs (keeps per-program analytics & one-slug-per-question clean) rolled up to show portfolio-wide AI fluency.
- **Leadership layer (`scrum:team-dynamics`, `pm:leadership`, `pm:change-leadership`, `ba:facilitation`) → `team-leadership`:** a portfolio-wide leadership signal.

---

## 5 · Program Outcome Definitions (Aladiah sells careers, not courses)

Each program's canonical destination — what certificates, Talent Score, AI Mentor,
portfolio scoring, and hiring readiness target. Salary bands are indicative market
ranges (USD, region-dependent; Aladiah's LATAM/Africa remote markets typically index lower).

### Scrum Master — AI Enterprise Scrum Master & Agile Transformation Leader
- **Day-1 titles:** Scrum Master · Agile Delivery Lead · Agile Project Manager · (→ Agile Coach / RTE with experience)
- **Salary band:** entry $60–85k · mid $90–120k · senior $120k+
- **Hiring archetypes:** enterprise IT/transformation orgs, software/product companies, banks & telecoms scaling agile, consultancies, Fortune-500 PMOs
- **Portfolio outcomes:** Definition of Done, team working agreements, sprint artifacts, retrospective outcomes, an impediment log, a transformation plan
- **Interview readiness:** PSM I/II-style Q&A, facilitation & coaching role-play, impediment-removal and team-conflict behavioral scenarios

### Project Manager — AI Project Manager & Delivery Leader
- **Day-1 titles:** Project Coordinator · Project Manager · Delivery Lead · Technical PM · (→ Program Manager)
- **Salary band:** entry $65–90k · mid $95–130k · senior $130k+
- **Hiring archetypes:** enterprises, consultancies, IT/engineering/construction, SaaS, agencies, Fortune-500 PMOs
- **Portfolio outcomes:** project charter, WBS + schedule with critical path, risk register, EVM/status report, stakeholder communication plan, closure & lessons-learned
- **Interview readiness:** PMP/CAPM-style Q&A, STAR behavioral, "rescue a failing project," an EVM scenario, a stakeholder-conflict scenario

### Business Analyst — AI Business Analyst & Product Discovery Specialist
- **Day-1 titles:** Business Analyst · Product Analyst · Systems Analyst · Requirements Analyst · Process Analyst
- **Salary band:** entry $60–85k · mid $90–115k · senior $115k+
- **Hiring archetypes:** enterprise IT, product orgs, consultancies, finance/insurance/healthcare, government/public sector
- **Portfolio outcomes:** requirements package (BRD), BPMN as-is/to-be process maps, user-story backlog with acceptance criteria, stakeholder RACI, discovery findings, UAT plan
- **Interview readiness:** IIBA/BABOK-style Q&A, elicitation role-play, requirements case study, a process-improvement scenario

### Data Analyst — AI Data Analyst & Decision Intelligence Professional
- **Day-1 titles:** Data Analyst · BI Analyst · Reporting Analyst · Decision Analyst · Analytics Consultant
- **Salary band:** entry $60–85k · mid $90–115k · senior $115k+
- **Hiring archetypes:** every data-driven org — tech, finance, retail/e-commerce, healthcare, ops teams, consultancies
- **Portfolio outcomes:** SQL query portfolio, cleaned dataset + data model, Power BI/Tableau dashboard, a statistical/A-B-test write-up, an executive insight memo/deck
- **Interview readiness:** live SQL screen, analytics case interview, dashboard critique, "present an insight to executives," statistics fundamentals

---

## 6 · Build order (founder-ratified sequence)

1. **Phase 1 — Scrum Master to ≥95%.** Becomes the reference architecture every program copies.
2. **Phase 2 — Business Analyst.** Fastest second flagship — ~200 real questions already authored; tag to `ba:*`, add lessons, seed cert.
3. **Phase 3 — Project Manager.** Huge market demand, strong overlap with Scrum.
4. **Phase 4 — Data Analyst.** Most net-new content, labs, and portfolio work.

Cross-cutting prerequisite for Phases 2–4: ratify these slugs first (this document), then
build the shared asset engines once (program-specific Labs, real Simulations, capstone/
portfolio submission, interview prep, `program_certifications` seeding) so they generalize.

---

## Ratification checklist (founder)
- [ ] Approve PM 11 slugs · BA 11 slugs · DA 10 slugs (incl. `pm:leadership`, `ba:product-thinking`, `da:data-storytelling`)
- [ ] Approve new Axis-2 meta `ai-augmentation`
- [ ] Approve Program Outcome Definitions (titles · salary bands · hiring archetypes · portfolio · interview)
- [ ] On approval: append the three program sections to the canonical `COMPETENCY_TAXONOMY.md` (append-only) and adopt this file's Outcome Definitions as canon.
