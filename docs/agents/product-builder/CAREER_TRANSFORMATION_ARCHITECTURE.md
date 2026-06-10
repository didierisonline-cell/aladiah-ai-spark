# Aladiah Career Transformation Architecture

Status: **Canonical.** The Product Builder Agent is **not a course factory — it is a
Career Transformation Factory.** It optimizes for outcomes, not completion:

> **Employment · Promotion · Salary Growth · Leadership Readiness · AI Readiness ·
> Competency Mastery**

This document defines the **ten engines** the Product Builder operates. Each engine
has a Purpose, Inputs, Outputs, Quality Standards, KPIs, Data Model, Dashboard
Components, and Approval Requirements. Code mirror:
`src/services/agents/product/engines.ts`. All outputs are drafts that pass the
Aladiah Quality Standard (`QUALITY_STANDARD.md`) and enter the Founder Approval
Queue — **nothing auto-publishes**, and nothing writes to the live curriculum
without a separate human-gated promotion step (NORTH_STAR working rules).

The six transformation outcomes are the north-star metrics every engine ties back
to. They live in `product_artifacts.target_outcomes` (which outcomes an artifact
advances) and are tracked over time in `product_outcomes` (the Student Outcome
Engine's data model).

---

## 1. Competency Engine

- **Purpose.** Define and measure what a learner actually knows and can do, against
  the canonical competency taxonomy. The foundation all other engines consume.
- **Inputs.** Competency taxonomy (`COMPETENCY_TAXONOMY.md`), live `quiz_questions`
  coverage, attempt analytics, program definitions.
- **Outputs.** Competency maps, competency-tagged learning objectives, coverage
  reports, skill graphs, readiness scores. Artifact types: `module`, `learning_path`.
- **Quality Standards.** Every objective maps to exactly one Axis-1 slug; no invented
  slugs; measurable outcomes; world-class clarity.
- **KPIs.** Competency Mastery %, coverage per competency, mastery velocity.
- **Data Model.** `product_artifacts` (engine=`competency`); coverage derived from
  live `quiz_questions.competency`; `product_outcomes` metric `competency_mastery`.
- **Dashboard.** Competency Coverage bars, gap list, mastery KPI.
- **Approval.** Founder approval; competency mapping is non-negotiable (critical
  quality standard #13).

## 2. Assessment Engine

- **Purpose.** Prove competency through rigorous, fair assessment — diagnostics,
  quizzes, and competency checks that generate trustworthy signal.
- **Inputs.** Competency map, target role, difficulty calibration, prior attempts.
- **Outputs.** Quizzes, diagnostic assessments, competency checkpoints. Artifact
  types: `quiz`, `assessment`.
- **Quality Standards.** ≥4 well-formed questions, one competency slug each, valid
  answers + explanations, **no A)/B) option prefixes**, difficulty calibrated.
- **KPIs.** Assessment pass rate, score distribution, competency-mastery lift.
- **Data Model.** `product_artifacts` (engine=`assessment`); question payload carries
  per-question competency; outcomes `competency_mastery`, `ai_readiness`.
- **Dashboard.** Approval queue items show the full question set + quality checklist.
- **Approval.** Founder approval; strong-quiz standard enforced.

## 3. Simulation Engine

- **Purpose.** Build real-world capability through crisis, stakeholder, leadership,
  and communication simulations — Aladiah's biggest differentiator.
- **Inputs.** Competency map, role scenarios, decision trees, scoring rubrics.
- **Outputs.** Branching simulations with decision points + competency-mapped rubrics.
  Artifact type: `simulation`.
- **Quality Standards.** ≥2 decision points, competency-mapped scoring rubric,
  realistic scenario, leadership/communication signal.
- **KPIs.** Simulation completion + score, decision quality, Leadership Readiness lift.
- **Data Model.** `product_artifacts` (engine=`simulation`); outcomes
  `leadership_readiness`, `competency_mastery`.
- **Dashboard.** Approval queue (scenario + decision points + rubric).
- **Approval.** Founder approval; strong-simulation standard enforced.

## 4. Lab Engine

- **Purpose.** Hands-on practice that turns knowledge into doing — tool-based,
  deliverable-producing labs.
- **Inputs.** Competency, tools, real task templates.
- **Outputs.** Step-by-step labs with a concrete deliverable. Artifact type: `lab`.
- **Quality Standards.** ≥3 steps, a deliverable, real tools, practical relevance.
- **KPIs.** Lab completion, deliverable quality, applied-skill lift.
- **Data Model.** `product_artifacts` (engine=`lab`); outcomes `competency_mastery`,
  `ai_readiness`.
- **Dashboard.** Approval queue; artifact library filter `lab`.
- **Approval.** Founder approval; hands-on-lab standard enforced.

## 5. Project Engine

- **Purpose.** Portfolio-grade capstones that demonstrate end-to-end capability to
  employers.
- **Inputs.** Competency set, role brief, evaluation rubric.
- **Outputs.** Project briefs with requirements + competency-mapped rubrics.
  Artifact type: `project`.
- **Quality Standards.** Clear brief, measurable requirements, rubric maps ≥3
  competencies, employer-credible.
- **KPIs.** Project completion, portfolio strength, Employment lift.
- **Data Model.** `product_artifacts` (engine=`project`); outcomes
  `leadership_readiness`, `employment`.
- **Dashboard.** Approval queue; artifact library filter `project`.
- **Approval.** Founder approval.

## 6. Interview Preparation Engine

- **Purpose.** Make learners interview-ready: question banks, mock-interview scripts,
  STAR-story frameworks, role-specific prep.
- **Inputs.** Target role, competency map, common interview questions, employer
  expectations.
- **Outputs.** Interview prep packs (question banks, model answers, mock scripts,
  rubrics). Artifact type: `interview_prep`.
- **Quality Standards.** Role-specific, competency-aligned, realistic questions,
  scored mock rubric, AI-coach integration.
- **KPIs.** Interview-success rate, mock-interview score, offer rate.
- **Data Model.** `product_artifacts` (engine=`interview_prep`); outcomes
  `employment`, `promotion`.
- **Dashboard.** Approval queue; outcomes KPI (Employment).
- **Approval.** Founder approval.

## 7. Career Transformation Engine

- **Purpose.** The orchestrator — sequences competency → assessment → simulation →
  project → interview into an outcome-driven journey: *Learn → Practice → Simulate →
  Validate → Interview → Place → Grow.*
- **Inputs.** Learner goal, current state, target role/salary, all engine outputs.
- **Outputs.** Personalized career-transformation plans / learning paths to a role.
  Artifact types: `career_plan`, `learning_path`.
- **Quality Standards.** Ends in employability (not completion); milestones map to
  outcomes; realistic timeline; AI coaching woven in.
- **KPIs.** Job-placement rate, salary growth, promotion rate, time-to-outcome.
- **Data Model.** `product_artifacts` (engine=`career_transformation`); outcomes
  `employment`, `salary_growth`, `promotion`.
- **Dashboard.** Outcomes tab; learning-path view.
- **Approval.** Founder approval.

## 8. Employer Alignment Engine

- **Purpose.** Make capability visible and trusted by employers — align outputs to
  real job requirements and the Aladiah Profile.
- **Inputs.** Job-market role requirements, employer expectations, competency map.
- **Outputs.** Role→competency alignment maps, employer-readiness rubrics,
  Aladiah-Profile criteria. Artifact type: `employer_alignment`.
- **Quality Standards.** Maps to real role requirements, measurable readiness,
  employer-credible language.
- **KPIs.** Employer-readiness score, placement-success rate, employer satisfaction.
- **Data Model.** `product_artifacts` (engine=`employer_alignment`); outcomes
  `employment`.
- **Dashboard.** Outcomes tab (Employment), engine card.
- **Approval.** Founder approval.

## 9. AI Integration Engine

- **Purpose.** Ensure AI is woven through every artifact start-to-finish (AI tutor,
  AI feedback, AI coach, AI practice) and that learners become AI-ready.
- **Inputs.** Every artifact, AI-pedagogy patterns, AI-skill frameworks.
- **Outputs.** AI-integration specs per artifact + dedicated AI-readiness modules.
  Artifact type: `ai_readiness`; cross-cuts all engines via the `ai_integration`
  payload field.
- **Quality Standards.** AI integrated start to finish (critical standard #2);
  AI-readiness measurable.
- **KPIs.** AI Readiness score, AI-tool fluency, AI-assisted task performance.
- **Data Model.** `product_artifacts` (engine=`ai_integration`); every artifact
  carries `payload.ai_integration`; outcome `ai_readiness`.
- **Dashboard.** Outcomes tab (AI Readiness), per-artifact AI badge.
- **Approval.** Founder approval; AI-integration standard enforced on all artifacts.

## 10. Student Outcome Engine

- **Purpose.** Close the loop — measure whether learners actually transform
  (employment, promotion, salary, leadership, AI readiness, mastery) and feed it back
  into prioritization. This is what makes it a transformation factory, not a course
  factory.
- **Inputs.** Placement data, salary data, promotion data, competency analytics,
  simulation/interview scores, all engine KPIs.
- **Outputs.** Outcome dashboards, outcome-improvement plans, prioritization signals.
  Artifact type: `outcome_plan`; tracked rows in `product_outcomes`.
- **Quality Standards.** Metrics are real (never fabricated); tied to the six
  transformation outcomes; actionable.
- **KPIs.** All six: Employment, Promotion, Salary Growth, Leadership Readiness, AI
  Readiness, Competency Mastery.
- **Data Model.** `product_outcomes` (metric, program, value, target, period, source);
  `product_artifacts` (engine=`student_outcome`).
- **Dashboard.** Outcomes tab — the six transformation KPIs vs targets.
- **Approval.** Founder approval for outcome-improvement plans; outcome *data* is
  recorded (honest, never invented) and is read-only signal.

---

## How the engines compose

```
Competency ─┬─► Assessment ─┐
            ├─► Simulation ──┤
            ├─► Lab ─────────┼─► Career Transformation ─► Interview Prep ─► Employer Alignment
            └─► Project ─────┘                 │
   AI Integration ── woven through all ────────┘
                                               ▼
                                       Student Outcome  (measures the 6 outcomes,
                                                          feeds back to prioritize)
```

Competency is the root (Core System 1). Career Transformation is the orchestrator.
Student Outcome is the feedback loop that re-prioritizes what the Product Builder
generates next — always toward the six outcomes, never toward completion.

## Optimization target (every run)

The Product Builder's overnight run and recommendations are ranked by **expected
impact on the six transformation outcomes**, not by content volume. The quarterly
question (NORTH_STAR Rule 8) — *"Does this make students more employable?"* — is the
agent's objective function.
