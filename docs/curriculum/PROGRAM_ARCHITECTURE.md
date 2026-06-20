# Program Architecture — BA / PM / DA flagships (architecture only)

> Status: **Architecture design.** No lessons, quizzes, or simulations are generated here —
> this defines structure only. Built on the ratified `COMPETENCY_TAXONOMY.md` (V2). Uses the
> AI Enterprise Scrum Master program as the gold-standard factory template. Build order:
> **Scrum (≥95%) → BA → PM → DA.**

## 0. The gold-standard template (what "to Scrum standard" means)

Every flagship must reach this shape before it ships:

| Dimension | Standard (per program) |
|---|---|
| Modules | 10–18, each owning ≥1 primary competency slug |
| Lessons | ~9 per module (video + summary + interactive) |
| Quizzes | 15–20 competency-tagged questions per module + a final; **every** program slug exercised |
| Simulation | ≥1 bespoke, role-authentic scenario (not procedural stubs) |
| Labs | program-specific applied tasks (not the generic tutor) |
| Capstone | one end-to-end deliverable mirroring the Day-1 job |
| Portfolio | the capstone's artifacts, employer-presentable |
| Interview prep | ≥2 program-specific scenarios + behavioral |
| Certification | a `program_certifications` row: credential_name + competency_tags (all program slugs) |

**"≥95%" acceptance** = all slugs assessed, simulation + capstone live, cert seeded, portfolio artifacts defined, interview scenarios authored.

---

## 1. AI Business Analyst & Product Discovery Specialist — flagship blueprint (next milestone)

**Day-1 target:** Business Analyst / Product Analyst / Requirements Analyst. **12 modules · ~108 lessons · ~200-question bank** (maps to the ~200 already-authored BA questions — tag, don't regenerate).

### Module → competency map
| # | Module | Primary slug(s) | Lessons |
|---|---|---|---|
| 1 | Foundations of Business Analysis & the BA Role | `ba:requirements` (intro), `ba:product-thinking` (intro) | 8 |
| 2 | Stakeholder Analysis & Management | `ba:stakeholders` | 9 |
| 3 | Elicitation Techniques & Collaboration | `ba:elicitation` | 9 |
| 4 | Requirements Engineering: Analysis & Specification | `ba:requirements` | 10 |
| 5 | Requirements Lifecycle, Traceability & Management | `ba:requirements`, `ba:solution-eval` | 9 |
| 6 | Business Process Analysis & Modeling (BPMN) | `ba:process-analysis` | 10 |
| 7 | Facilitation & Workshop Leadership | `ba:facilitation` | 8 |
| 8 | Product Thinking & Strategy | `ba:product-thinking` | 9 |
| 9 | Product Discovery & Solution Definition | `ba:product-discovery` | 9 |
| 10 | Data Analysis for BAs (SQL, metrics, KPIs) | `ba:data-analysis` | 9 |
| 11 | Regulatory, Risk & Compliance Analysis | `ba:compliance` | 8 |
| 12 | AI-Assisted Analysis + Solution Evaluation (Capstone) | `ba:ai-analysis`, `ba:solution-eval` | 10 |

**Coverage check:** all 11 `ba:` slugs are a primary competency of ≥1 module. ✅

- **Simulation — "Discovery Engagement":** a stakeholder asks for a vague solution; learner elicits (interview/workshop), models as-is/to-be (BPMN), writes a BRD, builds a prioritized backlog, defines UAT. Reuses the simulation engine pattern.
- **Labs:** elicitation question-design lab · BPMN modeling lab · SQL-for-BA lab.
- **Capstone:** complete discovery + BRD for a realistic business problem.
- **Portfolio:** BRD, as-is/to-be process maps, user-story backlog w/ acceptance criteria, stakeholder RACI, discovery findings, UAT plan.
- **Interview prep:** `ba_case` (requirements case study) · `ba_elicitation` (role-play) · behavioral (STAR).
- **Certification:** credential "AI Business Analyst & Product Discovery Specialist"; `competency_tags` = all 11 `ba:` slugs.

---

## 2. AI Project Manager & Delivery Leader — flagship blueprint

**Day-1 target:** Project Coordinator / Project Manager / Delivery Lead. **12 modules · ~108 lessons.**

| # | Module | Primary slug(s) |
|---|---|---|
| 1 | PM Foundations & Delivery Methods | `pm:delivery-methods` |
| 2 | Project Initiation & Charter | `pm:planning` |
| 3 | Scope, WBS & Schedule (Critical Path) | `pm:planning` |
| 4 | Risk & Issue Management | `pm:risk` |
| 5 | Financial Management & EVM | `pm:finance` |
| 6 | Procurement & Vendor Management | `pm:procurement` |
| 7 | Stakeholder & Executive Communication | `pm:stakeholders` |
| 8 | Team Leadership & Influence | `pm:leadership` |
| 9 | Change Leadership & Adoption | `pm:change-leadership` |
| 10 | Portfolio & Program Management | `pm:portfolio` |
| 11 | AI-Augmented Delivery | `pm:ai-delivery` |
| 12 | Quality, Outcomes & Closure (Capstone) | `pm:quality-closure` |

**Coverage check:** all 11 `pm:` slugs covered. ✅
- **Simulation — "Project Rescue":** inherit a red project; rebaseline scope/schedule, build a risk register, run EVM, manage a steering committee, drive to closure.
- **Labs:** schedule/critical-path lab · risk-register lab · EVM lab.
- **Capstone:** deliver a project end-to-end (charter → closure). **Portfolio:** charter, WBS+schedule, risk register, EVM/status report, comms plan, lessons-learned.
- **Interview prep:** `pm_pmp` (PMP/CAPM-style) · `pm_rescue` (scenario) · behavioral. **Cert:** all 11 `pm:` slugs.

*(Leverages strong Scrum overlap: `pm:delivery-methods` ↔ Scrum framework/events; reuse where authentic, never relabel Scrum content as PM.)*

---

## 3. AI Data Analyst & Decision Intelligence Professional — flagship blueprint

**Day-1 target:** Data Analyst / BI Analyst / Reporting Analyst. **10 modules · ~90 lessons · ~200-question bank** (tag the existing ~200 data questions).

| # | Module | Primary slug(s) |
|---|---|---|
| 1 | Data Analyst Foundations & Data Ethics | `da:data-ethics` |
| 2 | SQL & Data Querying | `da:sql` |
| 3 | Data Modeling & Preparation | `da:data-modeling` |
| 4 | Statistics & Analytical Methods | `da:statistics` |
| 5 | Data Visualization (Tableau / Power BI) | `da:visualization` |
| 6 | Business Intelligence & Reporting | `da:bi` |
| 7 | Forecasting & Predictive Analytics | `da:forecasting` |
| 8 | AI-Assisted Analytics | `da:ai-analytics` |
| 9 | Executive Decision Support | `da:decision-support` |
| 10 | Data Storytelling (Capstone) | `da:data-storytelling` |

**Coverage check:** all 10 `da:` slugs covered. ✅
- **Simulation — "Decision Room":** given a messy dataset + a business question, clean/model the data, analyze, build a dashboard, and present a recommendation to executives.
- **Labs:** SQL lab · Power BI/Tableau dashboard lab · statistics/A-B lab. *(DA carries the most lab + data-infrastructure work — sequence last.)*
- **Capstone:** dataset → dashboard → executive insight memo. **Portfolio:** SQL portfolio, cleaned dataset + model, dashboard, stats/A-B write-up, insight deck.
- **Interview prep:** `da_sql` (live SQL) · `da_case` (analytics case) · behavioral. **Cert:** all 10 `da:` slugs.

---

## 4. Cross-program build sequence & dependencies

1. **Finish Scrum to ≥95%** — completes the factory template (question bank for all 18 modules, cert seed, capstone, portfolio, 2nd simulation).
2. **Build the shared asset engines once** so they generalize: program-specific Labs, the bespoke-simulation pattern, capstone/portfolio submission + scoring, interview-prep scenarios, `program_certifications` seeding.
3. **BA** — tag the existing ~200 questions to `ba:` slugs, author lessons against the §1 map, seed cert. Fastest second flagship.
4. **PM** — author lessons + competency-tagged questions; exploit Scrum overlap.
5. **DA** — define data infrastructure for labs/sims; tag the ~200 data questions; heaviest lift, sequenced last.

No content is generated until each program's module→competency map above is signed off.
