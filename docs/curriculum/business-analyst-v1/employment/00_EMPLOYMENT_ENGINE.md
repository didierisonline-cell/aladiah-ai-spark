# BA Flagship — Employment Engine (5 shared frameworks) blueprint

> Status: **Architecture / blueprint only.** No implementation, no code, no lessons, no content,
> no migrations. Designs the five layers that convert competencies into hireable evidence:
> **Labs · Portfolio Submission · Interview Engine · Certification · Capstone.** Designed BA-first
> but **engine-shared** — each framework generalizes to PM and DA (like the simulation engine).
> Mirrors the Scrum flagship's intent (`scrum-master-v3/CERTIFICATION.md`, `CAPSTONE.md`,
> `aiScrumMasterFull.ts` lab/portfolio/interview structures) and the live certificate vertical
> (`program_certifications`, `issue_certificate`/`verify_certificate`, PR #49).
>
> **Frozen inputs (do not modify):** the 13-slug competency model, the ~330-question bank, the
> competency coverage matrix, the 10-simulation suite, and the portfolio coverage matrix.
>
> **The employment flow:** `Labs + Simulations → Portfolio → Interview readiness → Certification → Placement`.

---

## 1. Labs Framework

A **lab** is a focused, tool-based applied task (smaller than a simulation) that produces one
concrete deliverable. Mirrors the Scrum `lab { name, tool, task, deliverable }` model.

- **Structure:** `{ id, competency, name, tool, task, rubric, deliverable, feeds_portfolio }`.
- **Flow:** `Lab → graded deliverable → feeds a Portfolio Artifact`.
- **Grading:** deterministic checks + AI rubric (same pattern as sim scoring); pass threshold per lab.
- **BA labs** (from `00_ARCHITECTURE.md` §4, each tagged to a slug):

| Lab | Tool | Competency | Feeds portfolio |
|---|---|---|---|
| Elicitation question design | — | `ba:elicitation` | #1 Discovery Report |
| Requirements traceability (RTM) | — | `ba:requirements` | #3 AI Requirements Pkg |
| Process modeling | BPMN (Lucid/draw.io) | `ba:process-analysis` | #2 BPMN Package |
| Capability mapping | — | `ba:business-architecture` | #8 Transformation Deck |
| SQL for BAs | SQL sandbox | `ba:data-analysis` | (data-informed reqs) |
| AI prompting + validation | LLM | `ba:ai-prompting` | #3 AI Requirements Pkg |
| Compliance matrix | — | `ba:compliance` | Compliance/Controls Matrix |
| **UAT Lab** 🆕 | — | `ba:solution-eval` | **#6 UAT Package** |

> **UAT decision (ratified):** the **UAT Package (#6)** is produced by the **UAT Lab** and finalized in
> the **Sim 10 capstone** — no 11th simulation. (Sims 3/5/6/10 feed pieces into it.)

- **Reuse:** labs run in a lightweight task shell (prompt + workspace + submit), reusing the
  grading/persistence pattern from the sim engine. **Generalizes:** PM/DA define their own lab list
  against their slugs.

---

## 2. Portfolio Submission Framework

Turns sim/lab/capstone outputs into an **employer-facing portfolio**.

- **Home:** `github.com/{student}/aladiah-ai-business-analyst-portfolio`, one folder per artifact
  (mirrors the Scrum per-module → GitHub model). DB home: `program_portfolios` (schema exists; rows
  to be seeded).
- **Artifact record:** `{ id, title, source (sim/lab/capstone), competencies[], status (draft→submitted→reviewed→published), score, evidence_links[] }`.
- **The 8 BA artifacts and their producer:**

| # | Artifact | Produced by | Competencies |
|---|---|---|---|
| 1 | Executive Discovery Report | Sim 1 | discovery, stakeholders, solution-eval |
| 2 | Current-State BPMN Package | Sim 5 / Process lab | process-analysis |
| 3 | AI Requirements Package | Sim 4 / AI lab | ai-analysis, ai-prompting, requirements |
| 4 | Product Opportunity Assessment | Sim 6 | product-thinking, product-discovery |
| 5 | Business Case | Sim 6 | solution-eval |
| 6 | UAT Package | UAT Lab + Capstone | solution-eval |
| 7 | Stakeholder Management Plan | Sim 2 | stakeholders |
| 8 | Transformation Recommendation Deck | Sim 9 | business-architecture |

- **Validation/scoring:** each artifact graded against a rubric; portfolio completeness feeds the
  cert eligibility gate and Talent Score. **Honest states:** never show a fabricated artifact; empty =
  "not yet produced."
- **Generalizes:** PM/DA get their own artifact set + repo, same submission/grading shell.

---

## 3. Interview Engine

Role-specific interview preparation with AI generate + score (mirrors `InterviewSimulator.tsx`,
gated `interview_coach`).

- **Tracks (role-specific, not generic):** Junior BA · Mid BA · Senior BA · Lead BA · Product Analyst ·
  Product Owner · Transformation Consultant — aligned to the canon Career Outcome Matrix (§10).
- **Per session:** 6 AI-generated questions `{ behavioral, scenario, competency-probe }`, scored on
  `{ overall, competency dimensions, communication, problem-solving, feedback, strengths[], improvements[] }`.
- **Competency mapping:** each track weights the 13 slugs differently (e.g., Transformation Consultant
  → business-architecture + stakeholders + product-thinking heavy; Junior BA → requirements +
  elicitation heavy).
- **Readiness scoring:** an **Interview Readiness** score per track feeds the placement-ready signal.
- **Generalizes:** PM/DA define their own tracks (e.g., PMP-track, BI-Analyst-track) on the same engine.

---

## 4. Certification Framework

Validates the **entire stack** — competencies + simulations + portfolio + interview — not just a quiz.

- **Credential:** "AI Business Analyst & Product Discovery Specialist", `credential_level` **Professional (L300)**, `passing_score` 85.
- **`program_certifications` row:** `competency_tags` = all **13 `ba:` slugs**; `industry_alignment` = [IIBA CBAP, IIBA AAC, IIBA POA, PMI-PBA]; `exam_blueprint` jsonb; `completion_logic` jsonb.
- **`exam_blueprint`:** final exam (~150 Qs) balanced from the ~330 bank by domain weight
  (requirements & process ~28%, discovery & product ~20%, data & AI ~22%, stakeholders & facilitation ~15%, compliance & architecture ~15%).
- **Eligibility gate (`completion_logic`):** all module quizzes ≥85% **+** required simulations passed
  **+** required portfolio artifacts published **+** interview readiness met **+** capstone ≥80.
- **Issuance:** reuses the live cert vertical — `issue_certificate` (demonstrated-competency snapshot,
  never NULL) → credential record + Talent Score boost + **placement-ready** flag; `verify_certificate`
  for public verification (no PII). **Generalizes:** PM/DA each seed their own `program_certifications` row.

---

## 5. Capstone Framework

The crown deliverable — **Sim 10 "Enterprise Discovery Program."**

- **Scope:** a full enterprise transformation integrating all 13 competencies end-to-end (discover →
  model → prioritize → validate AI → ensure compliance → architect → roadmap → present).
- **Produces:** the **complete portfolio** (all 8 artifacts, incl. the finalized UAT Package) **+ the
  Aladiah Profile** (the placement-facing summary).
- **Gate:** pass ≥80, distinction ≥92; the capstone result is the **certification gate** (mirrors the
  Scrum M18 capstone gate).
- **Output → placement:** on pass, the student is **placement-ready** with a verifiable credential and a
  real portfolio — the evidence employers hire on. **Generalizes:** PM/DA each get a capstone of the
  same shape.

---

## 6. How the engine connects (the employment value chain)

```
Competencies (frozen) ─▶ Questions/Quizzes ─▶ Simulations ─┐
                                                            ├─▶ Portfolio ─▶ Interview Readiness ─▶ Certification ─▶ Placement-ready
                                              Labs ─────────┘                         │
                                                                         Talent Score integration (cross-program)
```

- **Talent Score integration:** portfolio scores + sim scores + interview readiness + cert status roll
  up (per the Axis-2 shared spine) into a cross-program Talent Score and the placement signal.
- **Build order after approval (still design-gated, one at a time):**
  1. Labs framework → 2. Portfolio submission → 3. Interview engine → 4. Certification → 5. Capstone,
  then implement against the shared engines.

## 7. Out of scope
No implementation, no code, no migrations, no lessons, no certifications issued, no new competencies/
slugs. This is the architecture for the five employment layers; each is built only after its blueprint
is approved.
