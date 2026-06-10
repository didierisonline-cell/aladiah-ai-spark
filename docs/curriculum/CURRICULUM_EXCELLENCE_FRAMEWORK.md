# Aladiah Curriculum Excellence Framework

Status: **Phase 2 canon.** This is not another generic agent — it is the system
that makes every Aladiah program **world-class**, transforming it from **Course
Completion → Career Transformation**. Pilot program: **AI Scrum Master
Professional Certification**, redesigned to **18 modules**.

Code mirror: `src/services/agents/curriculum/standards.ts` (framework),
`blueprint18.ts` (redesign); service `curriculumExcellenceAgent.ts`; dashboard
`/admin/curriculum-excellence`.

## How it works (orchestrates the existing workforce)

```
Curriculum Excellence  → audits the program against the framework → gap report
        │ delegates module builds (Task Manager + Communication)
        ▼
Product Builder        → generates module/quiz/simulation/lab/portfolio artifacts
        ▼
QA Authority           → reviews each (13 engines + 12 benchmarks + 6 validations)
        ▼
Founder Approval Queue → approve / edit / reject (nothing auto-publishes)
        ▼
Student Success + Placement → consume the employability outcomes
```

It **does not modify production curriculum** and **does not duplicate** the
Product Builder — it raises the bar and routes the work through the QA → approval
→ outcomes pipeline.

## The standards (every module must meet all of them)

1. **Curriculum** — Lessons · AI Coach Interaction · Practice Activities · Scenario
   Exercises · Knowledge Checks · Quiz · Simulation · Lab · Portfolio Artifact ·
   Reflection · Competency Mapping.
2. **Assessment** — Practice Quiz · Adaptive Quiz · Final Quiz; questions rotate,
   are competency-tagged, exam-quality, and reflect real Scrum certifications.
3. **Simulation** — Real companies · real stakeholders · real constraints · real
   conflict · decision trees · scoring engine · AI feedback. Target: **enterprise
   realism.**
4. **Lab** — Hands-on with **Jira · Confluence · Miro · Azure DevOps · GitHub · AI
   tools.**
5. **Portfolio** — Sprint Plans · Stakeholder Plans · Risk Registers · Roadmaps ·
   Retrospectives · Agile Metrics Dashboards — saved to the student portfolio.
6. **Employability** — every module improves interview readiness · resume strength
   · LinkedIn authority · portfolio quality.
7. **AI Integration** — AI in **every** module, integrated throughout (never a
   final chapter): AI mentor · AI feedback · AI workflows.

## Curriculum audit & gap analysis

`runAudit()` analyzes the current program's artifacts (from `product_artifacts`)
against the 18-module blueprint × 11 required module elements (module, AI mentor,
practice, scenario, knowledge check, quiz, simulation, lab, portfolio artifact,
reflection, competency assessment). It computes an **excellence score**
(present/required), a per-module **gap list**, and a summary — stored in
`curriculum_audits` and reported to the CEO Agent. The current 4-module course
audits low against the 18-module standard; that gap **is** the redesign roadmap.

## The redesigned 18-module blueprint

Each module specifies: title · competencies (canonical slugs) · AI mentor focus ·
lab (tool + task) · enterprise simulation (company + scenario) · portfolio artifact
· three quiz tiers · career outcome. Lab tools and portfolio artifacts rotate
across the required set. See `blueprint18.ts` / the dashboard **18-Module
Blueprint** tab for the full architecture. Modules span all 8 Scrum competencies
and culminate in a capstone that produces the Aladiah Profile.

### Module / Simulation / Lab / Portfolio architecture
- **Module architecture** — lesson content + AI mentor + practice + scenario +
  knowledge check + reflection, competency-mapped.
- **Simulation architecture** — enterprise scenario, named company context,
  stakeholders, constraints, conflict, decision tree, scoring rubric, AI feedback.
- **Lab architecture** — a real tool (Jira/Confluence/Miro/Azure DevOps/GitHub/AI)
  and a concrete deliverable.
- **Portfolio architecture** — a tangible artifact (sprint plan, stakeholder plan,
  risk register, roadmap, retrospective, metrics dashboard, capstone) saved as
  employer-facing evidence.

## Career transformation mapping

Every module maps to a career outcome (foundational fluency → role clarity →
execution → facilitation/coaching → stakeholder leadership → metrics → scaling →
AI augmentation → capstone employment + placement). Outcomes feed the **Student
Success Agent** (readiness scores + CTS) and the **Placement Authority**
(employability, portfolio, talent marketplace) — closing the loop from learning to
employment.

## Delegation

`delegateModule(no)` queues the full artifact set for one module to the Product
Builder; `delegateRedesign()` queues all 18. Every artifact is QA-gated and lands
in the Founder Approval Queue. **Nothing publishes automatically.**
