# AI-Powered Scrum Master Professional Certification — Career Transformation Redesign

Status: **Redesign blueprint.** Built with Aladiah's Career Transformation
Architecture (`/docs/agents/product-builder/CAREER_TRANSFORMATION_ARCHITECTURE.md`).
Data source: `src/services/agents/product/programs/aiScrumMaster.ts`. Builder:
`buildAIScrumMasterProgram()` in `productBuilderAgent.ts` (also on the Product
Agent dashboard → **Build AI Scrum Master Program**).

> **Outcome, not completion.** This is a career-transformation program: every
> module drives employment, promotion, salary growth, leadership readiness, AI
> readiness, and competency mastery — with AI woven from start to finish.

## How it's delivered (canon-safe)

Running the builder turns this blueprint into **Product Builder artifacts**, each
tagged with its engine + target outcomes, run through the **Aladiah Quality
Standard**, and placed in the **Founder Approval Queue** (`pending_approval`).
**It never overwrites the live curriculum** — promotion of approved artifacts into
the live program is a separate, human-gated step.

Per module, the builder emits: a foundational **Module** artifact (Competency
Engine) carrying the mission briefing, competency map, lessons, AI workflows,
career readiness, employer alignment, and Talent Score impact; plus an **AI
Workflows** artifact (AI Integration), a **Lab** (Lab Engine), a **Simulation**
(Simulation Engine), a **Quiz** (Assessment Engine), a **Portfolio** artifact
(Project Engine), an **Interview Prep** pack (Interview Prep Engine), and an
**Employer Alignment** map (Employer Alignment Engine). Program-level: a **Career
Transformation Plan**, a **Diagnostic Assessment**, and an **Outcome Improvement
Plan**. (~35 artifacts total.)

## The 12 components → engines (every module)

| # | Component | Engine | Where it lives |
|---|---|---|---|
| 1 | Mission briefing | Competency / Career Transformation | Module payload `mission_briefing` |
| 2 | Competency map | Competency | Module `competencies` + payload `competency_map` |
| 3 | Lessons | Competency | Module payload `lessons` |
| 4 | AI-powered Scrum Master workflows | AI Integration | Module payload + dedicated `ai_readiness` artifact |
| 5 | Hands-on labs | Lab | `lab` artifact |
| 6 | Simulations | Simulation | `simulation` artifact |
| 7 | Quizzes & assessments | Assessment | `quiz` artifact + program diagnostic |
| 8 | Portfolio artifacts | Project | `project` artifact |
| 9 | Interview preparation | Interview Prep | `interview_prep` artifact |
| 10 | Career readiness outcomes | Career Transformation | Module payload `career_readiness` + program `career_plan` |
| 11 | Employer alignment | Employer Alignment | `employer_alignment` artifact + module payload |
| 12 | Talent Score impact | Student Outcome | Module payload + artifact `metadata.talent_score_impact` |

## Module map (competency coverage across all 8 slugs)

### Module 1 — The AI-Augmented Scrum Master (Role & Foundations)
`scrum:framework · scrum:roles · scrum:team-dynamics · scrum:empiricism`
- **Mission:** step into the Scrum Master accountability with an AI co-pilot.
- **AI workflows:** AI Daily Scrum Assistant · AI Impediment Triage · AI Coaching Companion.
- **Lab:** Daily Scrum. **Sim:** earning team trust in week one. **Portfolio:** Scrum Master Charter & Working Agreement.
- **Career outcome:** ready for an associate/junior Scrum Master role.

### Module 2 — Scrum Events & Empirical Execution (AI-Facilitated)
`scrum:events · scrum:empiricism`
- **Mission:** facilitate a full Sprint independently with AI.
- **AI workflows:** AI Sprint Planning Forecaster · AI Retrospective Synthesizer · AI Review Prep.
- **Lab:** Sprint Retrospective. **Sim:** rescuing a failing Sprint. **Portfolio:** Five-Event Facilitation Playbook.
- **Career outcome:** ready to facilitate a full Sprint independently.

### Module 3 — Artifacts, Commitments & Delivery Metrics (AI-Driven)
`scrum:artifacts · scrum:delivery-metrics`
- **Mission:** own the artifacts and use flow metrics with AI for improvement.
- **AI workflows:** AI Backlog Refinement · AI Flow-Metric Analyst · AI Forecasting.
- **Lab:** Definition of Done & Backlog Refinement. **Sim:** scope vs. Definition of Done. **Portfolio:** Metrics Dashboard + DoD.
- **Career outcome:** ready to own artifacts and drive measurable improvement.

### Module 4 — Stakeholders, Leadership & Career Launch (AI Agile Leader)
`scrum:stakeholders · scrum:team-dynamics`
- **Mission:** lead beyond the team and launch the career.
- **AI workflows:** AI Stakeholder Communications · AI Org-Impediment Mapping · AI Leadership Coach.
- **Lab:** Stakeholder Engagement Plan. **Sim:** leading through organizational change. **Portfolio:** Capstone 3-Sprint Transformation Case Study + Aladiah Profile.
- **Career outcome:** ready for employment as a Scrum Master and positioned for promotion into Agile leadership.

## Outcome support (every module)

Each module's `talent_score_impact` allocates points across the six outcomes, so
progress is measurable on the student's Aladiah Talent Score and rolls up into the
Student Outcome Engine's KPIs (`product_outcomes`). Module 4 weights employment +
promotion + leadership most heavily (career launch); Modules 1–3 build competency,
AI readiness, and leadership toward it.

## To generate

Open `/admin/product-agent` → **Build AI Scrum Master Program**. Review everything
in the **Approval Queue** (each artifact shows its Aladiah Quality Standard
checklist). Approve / edit / reject. Nothing publishes automatically.
