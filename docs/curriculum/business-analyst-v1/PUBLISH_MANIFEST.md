# BA Flagship — PUBLISH_MANIFEST (v1)

> Governed by `docs/standards/PUBLISH_LAYER.md`. This is the row-level contract
> for publishing the **AI Business Analyst & Product Discovery Specialist**
> flagship into the student learn-path. The publish migration is a mechanical
> translation of this manifest; QA audits the migration against it.
> Source of truth for content: `docs/curriculum/business-analyst-v1/modules/*.md`.
> Competency registry: `COMPETENCY_TAXONOMY.md` §7 (`ba:`, 13 slugs, ratified).

## Course

| Field | Value |
|---|---|
| `title` | AI Business Analyst & Product Discovery Specialist |
| `curriculum_version` / `flagship_version` | `ba-v1` |
| `is_flagship` | true |
| `is_published` | **false** (flip only after verification + founder approval) |
| `launch_status` | `draft` |
| `target_market` | Career-changers & analysts moving into AI-era BA / product roles |
| `target_salary_low` / `high` | 90000 / 230000 (USD indicative; Jr BA→Business Architect ladder) |

## Modules → lessons → exam (75 lessons, 15 `chapter_end` exams)

Module exam pass = 85 (capstone = 80, distinction ≥92). Every lesson row gets
`translations := '{}'::jsonb`. Competency is **not** stored on `chapters`/`videos`
— it is carried by `quiz_questions` (next migration) per the module's primary slug(s).

| # | Module (chapter) | Lessons (videos) | Primary `ba:` competency |
|---|---|---|---|
| 1 | Business Analysis in the AI Era | Evolution of the BA · Deterministic vs Probabilistic · AI-Native Operating Model · Requirements in the Age of AI · Outcomes over Outputs | requirements, ai-analysis, product-thinking |
| 2 | BA Planning, Competencies & the AI Toolkit | BA Competency Map · Planning the Analysis Approach · Modern BA AI Toolkit · Working with AI Responsibly · Communication & Collaboration | requirements, ai-analysis, facilitation |
| 3 | Stakeholder Analysis & Management | Stakeholder Mapping & Power · Engagement & Sponsor Alignment · Executive Communication & Steering · Political Navigation · Conflict & Negotiation | stakeholders |
| 4 | Elicitation Techniques & Collaboration | The Elicitation Toolkit · Discovery & JTBD Interviewing · Contextual Inquiry & Observation · Root-Cause & Signal Detection · Eliciting from Difficult Stakeholders | elicitation |
| 5 | Facilitation & Workshop Leadership | Facilitation Foundations & Safety · Discovery Workshops & Story Mapping · Event Storming · Prioritization & Conflict Workshops · Executive Decision Forums | facilitation |
| 6 | Requirements Engineering | Requirements Types & Quality · Analysis & Specification · User Stories & Acceptance Criteria · Traceability & Lifecycle · Conflicting Requirements & Resolution | requirements |
| 7 | Process Analysis & Modeling (BPMN) | Process Thinking & Value Streams · As-Is BPMN · Gap & Root-Cause Analysis · To-Be Design · Process Mining & AI | process-analysis |
| 8 | Business Architecture | Capability Mapping · Value Streams & Operating Models · Capability Heatmaps · Target-State Architecture · Strategic Alignment & Transformation Framing | business-architecture |
| 9 | Product Thinking & Strategy | Outcomes, Vision & Value · Business-Model & North-Star · Choosing Opportunities · Value vs Effort · Product Opportunity Assessment | product-thinking |
| 10 | Product Discovery & Solution Definition | Continuous Discovery & OST · Assumption Mapping · Experiment Design & MVP · Discovery Research & Evidence · Working Backwards / Discovery Report | product-discovery |
| 11 | Data Analysis for BAs: Decision Intelligence | Reporting → Decision Intelligence · Metrics, KPIs & Metric Trees · SQL for Decisions · Visualization & Dashboards · Root-Cause & Decision Brief | data-analysis |
| 12 | Solution Evaluation, Validation & Acceptance | Solution Options & Trade-offs · Business Case & ROI · Solution Validation & Acceptance · UAT Design & Execution · Value Realization & PIR | solution-eval |
| 13 | AI Business Analysis & Decision Intelligence | AI Requirement Ladder 2.0 · Human + AI Decision Systems · AI Failure Investigation · AI Governance & Monitoring · Executive AI Transformation Roadmap | ai-analysis, ai-prompting |
| 14 | Regulatory, Risk & Compliance | Regulatory Impact Assessment · Risk Quantification · Controls & Assurance · Executive Risk Decisions · AI Governance in Regulated Industries | compliance |
| 15 | Capstone: Discovery-to-Transformation (pass 80) | Phase 1 Discovery · Phase 2 Architecture & Strategy · Phase 3 Requirements/Governance/Risk · Phase 4 Investment Case · Phase 5 Board Recommendation & Defense | integrates all 13 |

## Assets (later migrations — readiness-counted, not in this structure migration)

| Asset | Home table | Source | Surfaced to student? |
|---|---|---|---|
| Simulations (10-suite + Discovery Engagement) | `program_simulations` + `ba_simulations` engine | `simulations/` | Sim 1–3 engine live; catalog rows TBD |
| Labs (7) | `program_labs` | architecture §4 | submission UI partial |
| Portfolio (8 artifacts P1–P8) | `program_portfolios` | module outputs | TBD |
| Interview prep (4 scenarios + 15 sets) | `program_interview_prep` | architecture §6 | TBD |
| AI mentor prompts | `program_ai_mentor_prompts` | — | TBD |
| Capstone | `program_capstones` | module-15 | engine = Sim 10 |
| Certification | `program_certifications` | architecture §7 | gate: 15 exams ≥85 + capstone ≥80 |

## Build order for BA (each verified before the next)

1. **Structure** (this migration) — course + 15 chapters + 75 lessons + 15 exam shells, `is_published=false`. ← current
2. **Questions** — tag the existing bank + author gap Qs to ~20/module, competency at insert; attach to each `chapter_end` quiz.
3. **Assets** — seed `program_*` rows (sims, labs, portfolio, interview, capstone, cert).
4. **Surface** — wire `program_*` assets into the student player (close PUBLISH_LAYER §2c gap).
5. **Publish** — verification passes → founder flips `is_published=true`.

## Open item to resolve before step 2 (questions)

`COMPETENCY_TAXONOMY.md` contains **two** BA registries: §2A ("9 slugs", stale)
and §7 ("13 slugs", ratified — matches all module content per the change log).
The modules are correctly built on §7. Recommend the founder **retire/annotate
§2A** as superseded so there is one BA registry. Non-blocking for structure;
must be settled before question-tagging so slugs are unambiguous.
