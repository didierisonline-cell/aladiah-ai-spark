# BA Flagship — Question Tagging Map & Coverage Matrix

> Status: **Tagging spec + coverage analysis.** No content generated, no DB writes. This is the
> authoritative competency tag for each existing BA question, applied at **insert time** when the
> BA curriculum is promoted to migrations (per `00_ARCHITECTURE.md` §9 build sequence; honors the
> CLAUDE.md rule that competency is populated at insert and never NULL). Source of questions:
> `supabase/functions/seed-business-analysis-course/index.ts` — **200 real questions**, structured
> 8 modules × 5 lessons × 5 questions. (The second seed `seed-ai-business-analyst` is templated
> boilerplate and is excluded.)

## 1. Tagging map (lesson = atomic unit; 5 questions each → one `ba:` slug)

| Lesson | Topic | → `ba:` slug | Qs |
|---|---|---|---|
| 1.1 | The BA Role | `ba:requirements` | 5 |
| 1.2 | BABOK & Frameworks | `ba:requirements` | 5 |
| 1.3 | BA Planning | `ba:requirements` | 5 |
| 1.4 | Core Competencies | `ba:facilitation` | 5 |
| 1.5 | AI Tools for BA | `ba:ai-analysis` | 5 |
| 2.1 | Elicitation Techniques | `ba:elicitation` | 5 |
| 2.2 | Stakeholder Mgmt | `ba:stakeholders` | 5 |
| 2.3 | Requirements Documentation | `ba:requirements` | 5 |
| 2.4 | Requirements Quality | `ba:requirements` | 5 |
| 2.5 | Elicitation for Digital Transformation | `ba:elicitation` | 5 |
| 3.1 | BPMN | `ba:process-analysis` | 5 |
| 3.2 | Process Improvement | `ba:process-analysis` | 5 |
| 3.3 | Use Case Modeling | `ba:requirements` | 5 |
| 3.4 | Data Flow & Entity Analysis | `ba:process-analysis` | 5 |
| 3.5 | AI for Process Analysis | `ba:ai-analysis` | 5 |
| 4.1 | BA in Agile | `ba:product-thinking` | 5 |
| 4.2 | User Story Mapping | `ba:product-discovery` | 5 |
| 4.3 | Backlog Mgmt | `ba:product-thinking` | 5 |
| 4.4 | ATDD/BDD | `ba:requirements` | 5 |
| 4.5 | SAFe BA | `ba:product-thinking` | 5 |
| 5.1 | Problem Definition / RCA | `ba:process-analysis` | 5 |
| 5.2 | Solution Options | `ba:solution-eval` | 5 |
| 5.3 | Requirements Prioritization | `ba:product-thinking` | 5 |
| 5.4 | Solution Validation | `ba:solution-eval` | 5 |
| 5.5 | Business Case | `ba:solution-eval` | 5 |
| 6.1 | Data Fundamentals | `ba:data-analysis` | 5 |
| 6.2 | SQL for BAs | `ba:data-analysis` | 5 |
| 6.3 | Metrics & KPIs | `ba:data-analysis` | 5 |
| 6.4 | Visualization | `ba:data-analysis` | 5 |
| 6.5 | AI for Data-Driven BA | `ba:ai-analysis` | 5 |
| 7.1 | Change Mgmt | `ba:stakeholders` | 5 |
| 7.2 | Enterprise Architecture | `ba:business-architecture` 🆕 | 5 |
| 7.3 | Digital Transformation | `ba:product-thinking` | 5 |
| 7.4 | Communication | `ba:facilitation` | 5 |
| 7.5 | Org Analysis & Design | `ba:business-architecture` 🆕 | 5 |
| 8.1 | CBAP Prep | `ba:requirements` | 5 |
| 8.2 | PMI-PBA | `ba:requirements` | 5 |
| 8.3 | Career Paths | — (non-assessed: career) | 5 |
| 8.4 | Portfolio | — (non-assessed: career) | 5 |
| 8.5 | Future of BA | `ba:ai-analysis` | 5 |

**Tag note vs the inventory pass:** lessons **7.2 Enterprise Architecture** and **7.5 Org Analysis
& Design** are re-pointed to the new `ba:business-architecture` slug (they were provisionally under
solution-eval / process-analysis). The two career lessons (8.3, 8.4 = 10 Qs) map to **no**
competency — flag as `non-assessed` (keep as career content, exclude from competency rollups).

## 2. Coverage after tagging (190 competency-tagged + 10 non-assessed = 200)

| `ba:` slug | Qs | Status |
|---|---:|---|
| `ba:requirements` | 45 | 🟢 over-supplied (rebalance across M1/M2/M6) |
| `ba:product-thinking` | 25 | 🟢 strong |
| `ba:process-analysis` | 20 | 🟢 strong |
| `ba:data-analysis` | 20 | 🟢 strong |
| `ba:ai-analysis` | 20 | 🟡 adequate by count, **shallow** (awareness-level) — deepen |
| `ba:solution-eval` | 15 | 🟢 ok |
| `ba:business-architecture` 🆕 | 10 | 🟡 partial — author +10 |
| `ba:stakeholders` | 10 | 🟡 thin — top up |
| `ba:elicitation` | 10 | 🟡 thin — top up |
| `ba:facilitation` | 10 | 🟡 thin — top up |
| `ba:product-discovery` | 5 | 🔴 under — author +15 |
| `ba:ai-prompting` 🆕 | 0 | 🔴 **GAP — author ~20** |
| `ba:compliance` | 0 | 🔴 **GAP — author ~20** |

## 3. Coverage Matrix (the go-live gate)

No competency goes live until every row is covered across **all five** asset types. Q = question
count; Sim/Lab/Port/Intv = ✅ designed (in `00_ARCHITECTURE.md`) / ❌ not yet.

| Competency | Questions | Simulation | Lab | Portfolio | Interview | Row ready? |
|---|---:|---|---|---|---|---|
| requirements | 45 🟢 | #3 ✅ | #6 RTM ✅ | #3 AI Reqs ✅ | ✅ | ✅ |
| product-thinking | 25 🟢 | #7 ✅ | — ❌ | #4 Opportunity ✅ | ✅ | ⚠️ (lab) |
| process-analysis | 20 🟢 | #1 ✅ | #7 BPMN ✅ | #2 BPMN ✅ | ✅ | ✅ |
| data-analysis | 20 🟢 | — ❌ | #12 SQL ✅ | — ❌ | ✅ | ⚠️ |
| ai-analysis | 20 🟡 | #5 ✅ | #13 AI ✅ | #3 ✅ | ✅ | ⚠️ (depth) |
| solution-eval | 15 🟢 | #8 UAT ✅ | — ❌ | #5/#6 ✅ | ✅ | ⚠️ (lab) |
| business-architecture 🆕 | 10 🟡 | #9 ✅ | #8 capability ✅ | #8 Transformation ✅ | ✅ | ⚠️ (Qs) |
| stakeholders | 10 🟡 | #2/#4 ✅ | — ❌ | #7 Stakeholder Plan ✅ | ✅ | ⚠️ (Qs/lab) |
| elicitation | 10 🟡 | #1 ✅ | #4 elicitation ✅ | #1 Discovery ✅ | ✅ | ⚠️ (Qs) |
| facilitation | 10 🟡 | #2 ✅ | — ❌ | — ❌ | ✅ | ⚠️ |
| product-discovery | 5 🔴 | #1/#7 ✅ | — ❌ | #1 Discovery ✅ | ✅ | ❌ (Qs) |
| ai-prompting 🆕 | 0 🔴 | #5 ✅ | #13 AI ✅ | #3 ✅ | ✅ | ❌ (Qs) |
| compliance | 0 🔴 | #6 ✅ | #14 compliance ✅ | — ❌ | ✅ | ❌ (Qs) |

**Interpretation:** simulation/interview coverage is complete by design; the binding constraints
are **questions** (3 red rows) and a few **labs/portfolio** cells (data-analysis, facilitation,
product-thinking, solution-eval each missing one asset). Nothing is "live" yet — these are design
commitments, not shipped assets.

## 4. Exact gap list (author in this order — content generation, NOT yet authorized)
1. **`ba:compliance`** — ~20 questions + a compliance portfolio artifact. (Biggest hole; the differentiator vs commodity BA programs.)
2. **`ba:ai-prompting`** — ~20 questions (prompt patterns + validating AI output: bias/hallucination/traceability).
3. **`ba:product-discovery`** — +15 questions (opportunity-solution trees, assumption testing, Working Backwards).
4. **`ba:business-architecture`** — +10 questions (beyond the 10 re-mapped).
5. **Top-ups** — stakeholders / elicitation / facilitation to ~15–20 each; **deepen** the 20 ai-analysis questions from awareness → applied.
6. **Asset fills** — labs for product-thinking/solution-eval/facilitation/stakeholders/data-analysis; portfolio for data-analysis/facilitation/compliance.
7. **Retire/relabel** the 10 career questions (8.3, 8.4) as non-assessed.

**Net new questions to author: ~85–100** (≈compliance 20 + ai-prompting 20 + discovery 15 +
business-arch 10 + top-ups 20–35), taking the bank from 200 → ~290–300 (≈20/module, Scrum parity).

## 5. Gate before content generation
✅ 200 questions tagged · ✅ coverage matrix produced · ✅ exact gaps identified.
**Hold:** no lessons, quizzes, simulations, or labs generated until this is approved and the
gap-fill order (above) is green-lit.
