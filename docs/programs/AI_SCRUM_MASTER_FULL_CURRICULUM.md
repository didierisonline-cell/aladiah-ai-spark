# AI Scrum Master Professional Certification — Complete Curriculum

> ⚠️ **TARGET SPEC — not yet live.** Figures here (162 lessons · 1,080-question bank · 200-question exam · 54 simulations · 18 labs/portfolios) are **design targets**. **Current authored:** 18 modules · 72 lessons · 100 questions + 40 capstone; simulations/labs/portfolio are **code-only** (not on the student DB path). Do **not** use these numbers in public/marketing until `/founder/truth` shows them backed by live data. Evidence: `docs/audits/FLAGSHIP_SCRUM_READINESS_AUDIT.md`.


Status: **Reference implementation** of the Aladiah Program Standard v1.0.
The complete generated curriculum (data: `src/services/agents/curriculum/programs/
aiScrumMasterFull.ts`; viewable in-app at `/admin/curriculum-excellence` → **Full
Curriculum**). Every program built hereafter conforms to this reference.

## Program overview

- **Standard:** Aladiah Program Standard v1.0 · **Modules:** 18
- **Simulations:** 54 (18 × beginner/intermediate/advanced) · **Labs:** 18 ·
  **Portfolio deliverables:** 18
- **Assessment:** per module — 20-question module quiz + 20-question competency
  quiz + final certification; 60-question rotating bank/module (**1,080 total**);
  difficulty 30/50/20 (easy/med/hard); adaptive; pass ≥ 85% (capstone ≥ 90%).
- **GitHub portfolio path:** `github.com/{student}/aladiah-ai-scrum-master-portfolio`
  — one folder per module (`/module-XX/<deliverable>`), deliverables committed
  automatically.
- **Alignment:** Scrum Guide 2020 · PSM I · PSM II · SAFe · Agile Coaching ·
  Enterprise Agile · AI-enabled delivery.

### Certification architecture & readiness tracks
- **PSM I readiness** — Modules 1–10 (core framework, accountabilities, events,
  artifacts, empiricism).
- **PSM II readiness** — Modules 11–16, 18 (facilitation, coaching, stakeholders,
  change, metrics, scaling, capstone).
- **AI Scrum Master readiness** — Modules 1, 5, 6, 9, 15, 17 (AI woven throughout,
  mastered in 17).
- **Agile Transformation readiness** — Modules 10, 13, 14, 16.
- **Executive Scrum Master readiness** — Modules 13, 14, 15, 16, 18.

Final certification: complete all 18 modules (each ≥ 85%), all 54 simulations, all
18 labs, all 18 portfolio deliverables, and the capstone (≥ 90%) + Aladiah Profile.

---

## Phase 1 — Foundations (Modules 1–3)

### Module 1 — Agile & Scrum Foundations (AI-Augmented)
- **Objectives:** Explain Scrum as a lightweight empirical framework · contrast with waterfall · describe the three pillars + five values · use an AI co-pilot.
- **Competencies:** `scrum:framework` (70%), `scrum:empiricism` (30%).
- **Lessons:** What Scrum is (and is not) · Empiricism (transparency, inspection, adaptation) · The Scrum values · Your AI co-pilot.
- **Readings:** Scrum Guide 2020 (Purpose & Definition) · Scrum Theory & Values · Agile Manifesto + 12 principles.
- **Videos:** Scrum in 10 minutes · Empiricism explained · Waterfall vs. Scrum.
- **AI mentor:** AI explains each pillar with your-background examples · quizzes Scrum vs. waterfall · drafts a "why Scrum" for a skeptical manager.
- **Lab:** Sprint Planning Lab (Confluence) — author a team charter & Agile primer → **Team Charter**.
- **Simulations:** *Beginner* — a team tries Scrum (Global fintech). *Intermediate* — piloting Scrum in a waterfall org (phase gates vs. empiricism). *Advanced* — rescuing a failed Agile adoption (systemic diagnosis).
- **Portfolio:** Team Charter + Working Agreement.
- **Interview prep:** Behavioral (introducing new ways of working) · Scenario (manager wants daily status) · Leadership (building trust) · STAR coaching.
- **Assessment:** 20+20 quiz · bank 60 · adaptive · pass 85%.
- **Aligned:** Scrum Guide 2020, PSM I.

### Module 2 — The Scrum Master Role & Servant Leadership
- **Objectives:** Define the Scrum Master accountability · differentiate from a PM · apply servant/facilitative leadership · coach toward self-management.
- **Competencies:** `scrum:roles` (60%), `scrum:team-dynamics` (40%).
- **Lessons:** The Scrum Master accountability · Servant leadership · SM vs. PM · Building self-management.
- **Readings:** Scrum Guide (Scrum Master) · Servant leadership primer · Coaching vs. mentoring. **Videos:** Servant leadership · A day in the life · SM vs PM.
- **AI mentor:** Role-plays a directive manager · critiques facilitative language · builds a "stop/start" list.
- **Lab:** Backlog Refinement Lab (Miro) — Scrum Master role canvas → **Role Canvas**.
- **Simulations:** *Beginner* — week one as SM. *Intermediate* — earning trust on a skeptical team. *Advanced* — SM caught between PO and team (servant balance).
- **Portfolio:** Scrum Master Role Canvas. **Interview:** lead without authority / asked to assign tasks / grow self-management. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, Agile Coaching.

### Module 3 — Scrum Team Accountabilities
- **Objectives:** Describe the three accountabilities · clarify PO/SM/Developer boundaries · resolve overlaps · support a cross-functional, self-managing team.
- **Competencies:** `scrum:roles` (100%).
- **Lessons:** Product Owner · Developers · Scrum Master · Boundaries & overlaps. **Readings:** Scrum Guide (The Scrum Team) · Accountabilities vs. roles · Cross-functional teams. **Videos:** The three accountabilities · PO vs SM · Self-managing teams.
- **AI mentor:** quizzes boundaries · generates a RACI · flags role anti-patterns.
- **Lab:** Velocity Lab (Confluence) — accountabilities/RACI map → **Accountabilities Map**.
- **Simulations:** *Beginner* — who owns the backlog? *Intermediate* — a PM acts like a PO. *Advanced* — scaling roles across teams.
- **Portfolio:** Accountabilities Map. **Interview:** role conflict / stakeholder gives orders / clarity at scale. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I.

## Phase 2 — Events & Execution (Modules 4–6)

### Module 4 — The Sprint & Sprint Planning
- **Objectives:** Explain the Sprint · facilitate Sprint Planning · craft a Sprint Goal · forecast realistically with AI.
- **Competencies:** `scrum:events` (100%). **Lessons:** The Sprint · Planning topics (why/what/how) · The Sprint Goal · Capacity & forecasting. **Readings:** Scrum Guide (Sprint, Planning) · Sprint Goal patterns · Forecasting basics. **Videos:** Planning facilitation · Writing a Sprint Goal · Capacity planning.
- **AI mentor:** forecasts a realistic sprint + risks · critiques your Sprint Goal · generates facilitation prompts.
- **Lab:** Release Planning Lab (Jira) — set up a sprint & plan capacity → **Sprint Plan**.
- **Simulations:** *Beginner* — first Sprint Planning. *Intermediate* — planning under deadline pressure (protect a realistic forecast). *Advanced* — dependency-heavy planning.
- **Portfolio:** Sprint Dashboard (Sprint Plan). **Interview:** prevented over-commitment / leadership demands too much / meaningful Sprint Goals. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, PSM II.

### Module 5 — Daily Scrum & Sprint Execution
- **Objectives:** Run an effective Daily Scrum · keep execution on the Sprint Goal · make/remove impediments · summarize standups with AI.
- **Competencies:** `scrum:events` (60%), `scrum:team-dynamics` (40%). **Lessons:** Purpose of the Daily Scrum · Anti-patterns · Impediment management · Flow during the Sprint. **Readings/Videos:** Daily Scrum · Impediment removal · Visualizing flow.
- **AI mentor:** summarizes standups + surfaces blockers · classifies/prioritizes impediments · suggests removal strategies.
- **Lab:** Daily Scrum Lab (Jira) — run a sprint board & manage flow → **Impediment Log**.
- **Simulations:** *Beginner* — standup becomes a status meeting. *Intermediate* — hidden impediments. *Advanced* — rescuing a failing Sprint mid-cycle.
- **Portfolio:** Impediment Log + Flow Board. **Interview:** major impediment removed / team hides blockers / keep focus on the goal. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I.

### Module 6 — Sprint Review & Retrospective
- **Objectives:** Facilitate a value-focused Review · run an effective Retrospective · drive empirical improvement · synthesize retros with AI.
- **Competencies:** `scrum:events` (55%), `scrum:empiricism` (45%). **Lessons:** Sprint Review · Retrospective · Improvement experiments · Facilitation techniques. **Readings/Videos:** Review & Retro · Retro formats · Improvement experiments.
- **AI mentor:** clusters retro inputs → experiments · drafts a Review narrative · suggests retro formats.
- **Lab:** Retrospective Lab (Miro) — facilitate a retro board → **Retrospective + Action Items**.
- **Simulations:** *Beginner* — a demo with no feedback. *Intermediate* — a blameful retrospective (safety). *Advanced* — stagnant continuous improvement.
- **Portfolio:** Retrospective + Action Items. **Interview:** retro that changed your team / retros feel pointless / sustain improvement. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, Agile Coaching.

## Phase 3 — Artifacts & Delivery (Modules 7–9)

### Module 7 — Scrum Artifacts & Commitments
- **Objectives:** Explain the three artifacts · connect each to its commitment · maximize transparency · structure backlogs with AI.
- **Competencies:** `scrum:artifacts` (100%). **Lessons:** Product Backlog & Product Goal · Sprint Backlog & Sprint Goal · Increment & DoD · Transparency. **Readings/Videos:** Artifacts & Commitments · Product Goal patterns · Transparency.
- **AI mentor:** checks artifact transparency · drafts a Product Goal · structures a backlog.
- **Lab:** Definition of Done Lab (Jira) — structure Product & Sprint Backlogs → **Product + Sprint Backlog**.
- **Simulations:** *Beginner* — an opaque backlog. *Intermediate* — missing Product Goal. *Advanced* — distributed-team transparency (regulated).
- **Portfolio:** Product + Sprint Backlog. **Interview:** improving transparency / stakeholders distrust the backlog / commitments drive focus. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I.

### Module 8 — Definition of Done & Quality
- **Objectives:** Create a strong DoD · protect quality under pressure · connect DoD to pipelines · review the DoD with AI.
- **Competencies:** `scrum:artifacts` (60%), `scrum:delivery-metrics` (40%). **Lessons:** Definition of Done · Quality as non-negotiable · DoD and CI/CD · Scope vs. DoD. **Readings/Videos:** DoD · Quality gates · CI/CD.
- **AI mentor:** reviews your DoD · suggests pipeline gates · role-plays a scope-pushing stakeholder.
- **Lab:** Metrics Dashboard Lab (Azure DevOps) — DoD with a CI/CD quality gate → **Definition of Done**.
- **Simulations:** *Beginner* — no shared DoD. *Intermediate* — scope vs. DoD under deadline. *Advanced* — org-wide DoD for compliance.
- **Portfolio:** Definition of Done + Quality Gates. **Interview:** protecting quality under pressure / sponsor asks to ship below DoD / raise quality across teams. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, Enterprise Agile.

### Module 9 — Product Backlog Management & Refinement
- **Objectives:** Facilitate refinement · split/order by value · support the PO without owning the backlog · draft/split stories with AI.
- **Competencies:** `scrum:artifacts` (55%), `scrum:stakeholders` (45%). **Lessons:** Refinement as continuous · Story splitting & acceptance criteria · Ordering by value & risk · Supporting the PO. **Readings/Videos:** Refinement · Story splitting · Story mapping.
- **AI mentor:** drafts/splits stories · generates acceptance criteria · flags dependencies.
- **Lab:** Facilitation Lab (Jira) — refinement + story mapping → **Refined Backlog + Story Map**.
- **Simulations:** *Beginner* — a messy backlog. *Intermediate* — a demanding PO (outcome focus). *Advanced* — multi-stakeholder prioritization.
- **Portfolio:** Refined Backlog + Story Map. **Interview:** tough prioritization / PO dictates solutions / keep refinement valuable. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I.

## Phase 4 — Empiricism & Facilitation (Modules 10–12)

### Module 10 — Empiricism, Transparency & Scrum Values
- **Objectives:** Deepen empirical control · build radical transparency · live the values · surface transparency gaps with AI.
- **Competencies:** `scrum:empiricism` (100%). **Lessons:** Empiricism in depth · Transparency radiators · Values under pressure · Trust & safety. **Readings/Videos:** Theory & Values · Information radiators · Psychological safety.
- **AI mentor:** surfaces transparency gaps · values self-assessment · coaches a values conflict.
- **Lab:** Coaching Lab (Confluence) — transparency radiators → **Team Working Agreement**.
- **Simulations:** *Beginner* — hidden status (green-shifting). *Intermediate* — a values conflict. *Advanced* — low-trust organization.
- **Portfolio:** Team Working Agreement. **Interview:** showing courage / "green" reports vs. "red" reality / build safety. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, Agile Coaching.

### Module 11 — Facilitation Mastery
- **Objectives:** Master facilitation across events · design engaging sessions · handle difficult dynamics · critique facilitation with AI.
- **Competencies:** `scrum:team-dynamics` (55%), `scrum:events` (45%). **Lessons:** Facilitation fundamentals · Designing sessions · Difficult dynamics · Facilitation toolkit. **Readings/Videos:** Facilitation techniques · Liberating Structures · Group dynamics.
- **AI mentor:** critiques facilitation language · designs a session plan · role-plays a difficult participant.
- **Lab:** Impediment Removal Lab (Miro) — facilitation techniques per event → **Facilitation Playbook**.
- **Simulations:** *Beginner* — a dominated meeting. *Intermediate* — a silent team. *Advanced* — a contentious cross-team session.
- **Portfolio:** Facilitation Playbook. **Interview:** hard session / a dominator / design for participation. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, Agile Coaching, PSM II.

### Module 12 — Coaching & Team Dynamics
- **Objectives:** Coach individuals/teams · build high-performing dynamics · resolve conflict · practice coaching with an AI role-player.
- **Competencies:** `scrum:team-dynamics` (100%). **Lessons:** Coaching stance · Team development · Conflict resolution · Emotional intelligence. **Readings/Videos:** Coaching Agile Teams · Team development · Conflict resolution.
- **AI mentor:** role-plays a difficult team member · feedback on coaching questions · coaching plan.
- **Lab:** Scaling Lab (AI tools) — coaching dialogues with an AI role-player → **Team Coaching Plan**.
- **Simulations:** *Beginner* — a struggling new team. *Intermediate* — persistent conflict. *Advanced* — a low-trust, low-performing team (coach the system).
- **Portfolio:** Team Coaching Plan. **Interview:** coaching a struggling team / two members in conflict / build high performance. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, Agile Coaching, PSM II.

## Phase 5 — Leadership & Scale (Modules 13–16)

### Module 13 — Stakeholder Engagement & Communication
- **Objectives:** Engage stakeholders · communicate with executives · manage expectations · draft comms with AI.
- **Competencies:** `scrum:stakeholders` (100%). **Lessons:** Stakeholder mapping · Executive communication · Expectation management · The right events for feedback. **Readings/Videos:** Stakeholder engagement · Executive communication · Managing expectations.
- **AI mentor:** drafts stakeholder updates · builds a stakeholder map · role-plays a demanding executive.
- **Lab:** Stakeholder Management Lab (Confluence) — stakeholder comms plan → **Stakeholder Communication Plan**.
- **Simulations:** *Beginner* — an anxious stakeholder. *Intermediate* — conflicting senior stakeholders. *Advanced* — executive escalation (protect the team).
- **Portfolio:** Stakeholder Communication Plan. **Interview:** difficult stakeholder / exec demands a fixed date / earn executive trust. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, Enterprise Agile, PSM II.

### Module 14 — Organizational Change & Removing Impediments
- **Objectives:** Drive organizational change · remove systemic impediments · influence without authority · map impediments with AI.
- **Competencies:** `scrum:stakeholders` (55%), `scrum:team-dynamics` (45%). **Lessons:** Change models · Systemic impediments · Influence without authority · Agile transformation basics. **Readings/Videos:** Change management · Systemic impediments · Influence · SAFe transformation overview.
- **AI mentor:** maps systemic impediments · drafts a change plan · role-plays resistance.
- **Lab:** Transformation Lab (Miro) — organizational impediments + change plan → **RAID Log + Change Plan**.
- **Simulations:** *Beginner* — a blocked team. *Intermediate* — departmental resistance. *Advanced* — stalled transformation.
- **Portfolio:** RAID Log + Agile Transformation Plan. **Interview:** change against resistance / department blocks the team / lead transformation without authority. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, SAFe, Enterprise Agile, PSM II.

### Module 15 — Agile Metrics, Flow & Forecasting
- **Objectives:** Use flow metrics responsibly · forecast empirically · avoid metric misuse · analyze flow with AI.
- **Competencies:** `scrum:delivery-metrics` (100%). **Lessons:** Flow metrics · Forecasting · Velocity done right · Avoiding metric misuse. **Readings/Videos:** Flow metrics · Probabilistic forecasting · Metric anti-patterns.
- **AI mentor:** analyzes flow + forecasts · flags metric misuse · builds a metrics narrative.
- **Lab:** Flow Forecasting Lab (Azure DevOps) — flow metrics + forecast → **Agile Metrics Dashboard**.
- **Simulations:** *Beginner* — no visibility. *Intermediate* — velocity as a target (reframe). *Advanced* — forecasting a fixed-date release.
- **Portfolio:** Agile Metrics Dashboard + Executive Status Report. **Interview:** metrics to drive improvement / manager weaponizes velocity / forecast without false promises. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, Enterprise Agile, PSM II.

### Module 16 — Scaling Scrum & Enterprise Agility
- **Objectives:** Coordinate multiple teams · apply scaling patterns responsibly · manage dependencies · model dependencies with AI.
- **Competencies:** `scrum:delivery-metrics` (50%), `scrum:stakeholders` (50%). **Lessons:** Scaling principles (descale first) · Cross-team coordination · Dependency management · Enterprise agility (SAFe, LeSS). **Readings/Videos:** Scaling Scrum · SAFe essentials · LeSS · Dependency management.
- **AI mentor:** models cross-team dependencies · drafts a scaling roadmap · role-plays a multi-team planning event.
- **Lab:** AI Automation Lab (Jira) — coordinate multi-team delivery → **Scaling Roadmap**.
- **Simulations:** *Beginner* — two teams, one product. *Intermediate* — dependency gridlock. *Advanced* — enterprise big-room planning.
- **Portfolio:** Scaling Roadmap + Jira Configuration. **Interview:** coordinating multiple teams / dependencies block delivery / scale without bureaucracy. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, SAFe, Enterprise Agile, PSM II.

## Phase 6 — AI & Capstone (Modules 17–18)

### Module 17 — AI for the Scrum Master
- **Objectives:** Master AI workflows across the role · augment facilitation/analysis/delivery · apply AI responsibly · build an AI Scrum Master toolkit.
- **Competencies:** `scrum:framework` (50%), `scrum:delivery-metrics` (50%). **Lessons:** AI across the role · AI-augmented facilitation & analysis · AI Scrum automations · Responsible AI. **Readings/Videos:** AI-enabled delivery · Responsible AI · Prompting for facilitation.
- **AI mentor:** build an AI prompt library · automate retro synthesis · create an AI flow-metric analyzer.
- **Lab:** AI Automation Lab (GitHub) — assemble an AI Scrum Master toolkit (prompts + automations) → **AI Scrum Automation Workflow**.
- **Simulations:** *Beginner* — first AI workflow. *Intermediate* — AI-augmented delivery (augment, not replace). *Advanced* — scaling AI across teams (responsible-AI guardrails).
- **Portfolio:** AI Scrum Automation Workflow. **Interview:** AI to improve delivery / team over-relies on AI / adopt AI responsibly at scale. **Assessment:** 20+20, pass 85%. **Aligned:** Scrum Guide, PSM I, AI-enabled delivery, PSM II.

### Module 18 — Capstone: Career Transformation & Placement
- **Objectives:** Integrate all competencies · assemble the Aladiah Profile + portfolio · complete full interview readiness · demonstrate leadership readiness.
- **Competencies:** `scrum:team-dynamics` (40%), `scrum:stakeholders` (30%), `scrum:delivery-metrics` (30%). **Lessons:** The capstone (3-Sprint turnaround) · Assembling your portfolio · The Aladiah Profile · Interview & placement readiness. **Readings/Videos:** Portfolio best practices · Interview frameworks · Career transformation.
- **AI mentor:** full mock interviews + scoring · portfolio gap review · Aladiah Profile narrative.
- **Lab:** Capstone Portfolio Lab (GitHub) — assemble the Aladiah Profile + portfolio → **Capstone Case Study + Aladiah Profile**.
- **Simulations:** *Beginner* — capstone kickoff (diagnose + plan). *Intermediate* — mid-point review (adapt empirically). *Advanced* — leadership finale + mock interview.
- **Portfolio:** Capstone Case Study + Aladiah Profile (full portfolio). **Interview:** biggest transformation / lead a struggling team in three Sprints / why hire you. **Assessment:** 20+20, **pass 90%**. **Aligned:** Scrum Guide, PSM I, PSM II, SAFe, Agile Coaching, Enterprise Agile, AI-enabled delivery.

---

## Build & QA path

This curriculum is the design. To produce it: `/admin/curriculum-excellence` →
**Delegate Full Redesign** queues every module's artifacts (module, quizzes,
simulations, lab, portfolio) to the **Product Builder**, each **QA-gated** by the
QA Authority and routed to the **Founder Approval Queue** — nothing auto-publishes.
On approval, the **Student Success** and **Placement** authorities consume the
competency, portfolio, and employability outcomes. The result is scored against the
Program Standard v1.0 (Curriculum Excellence Score) on the **Scorecard** tab.
