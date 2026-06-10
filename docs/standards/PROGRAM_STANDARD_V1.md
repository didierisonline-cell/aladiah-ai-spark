# Aladiah Program Standard v1.0

Status: **Canonical.** Part of the Aladiah platform canon (`/docs/standards`).
The canonical structure **every Aladiah program must follow** to be world-class.
Code mirror: `src/services/standards/programStandard.ts` (standard + scoring),
`programFactory.ts` (generation). Reference implementation: **AI Scrum Master
Professional Certification** (18-module blueprint).

This standard turns "course completion" into **career transformation**: a program
only ships when it is designed to — and built to — world-class thresholds.

---

## 1. The 10 architectures

Every program is composed of these ten architectures. Each has required
components, a **weight** (contribution to the Curriculum Excellence Score), a
**minimum threshold**, and whether it is **critical** (must meet threshold for the
program to be world-class).

| # | Architecture | Weight | Min | Critical | Required components |
|---|---|---:|---:|:---:|---|
| 1 | **Module** | 12 | 80 | ✅ | Lesson · AI Coach · Practice · Scenario · Knowledge Check · Reflection · Competency Mapping |
| 2 | **Lesson** | 8 | 75 | — | Objectives · Content · Real Examples · AI Explanations |
| 3 | **Assessment** | 12 | 80 | ✅ | Practice Quiz · Adaptive Quiz · Final Quiz · Competency-tagged · Rotating · Exam-quality |
| 4 | **Simulation** | 14 | 80 | ✅ | Real Company · Stakeholders · Constraints · Conflict · Decision Tree · Scoring Engine · AI Feedback |
| 5 | **Lab** | 10 | 75 | — | Real Tool (Jira/Confluence/Miro/Azure DevOps/GitHub/AI) · Hands-on Task · Deliverable |
| 6 | **Portfolio** | 10 | 75 | — | Artifact · Employer-facing · Saved to Portfolio |
| 7 | **Capstone** | 8 | 80 | ✅ | Integrative Project · Aladiah Profile · Leadership Demonstration |
| 8 | **Certification** | 6 | 75 | — | Full Competency Coverage · Final Assessment · Credibility vs Real Certs |
| 9 | **Interview** | 8 | 75 | — | Question Bank · Mock Interview · STAR Framework · Scoring |
| 10 | **Career Transformation** | 12 | 80 | ✅ | Outcome Mapping · Employability · Salary Projection · Placement Link |

Weights sum to **100**.

---

## 2. Scoring model

Each architecture is scored **0–100** by evaluating a program's blueprint (and, for
build progress, its produced artifacts). The composite is the **Curriculum
Excellence Score**.

```
Curriculum Excellence Score (CES) = Σ (dimension_score × weight) / Σ weight   (0–100)
```

- A dimension **meets** its bar when its score ≥ its minimum threshold.
- **Critical** dimensions (Module, Assessment, Simulation, Capstone, Career
  Transformation) must meet their thresholds.

---

## 3. Curriculum Excellence Score (0–100)

The CES is the single number that says how close a program is to world-class. It is
computed by `scoreBlueprint()` and stored on `curriculum_audits.ces` (with
per-dimension scores in `dimension_scores`). The Curriculum Excellence dashboard
(`/admin/curriculum-excellence` → **Program Standard**) shows the CES, every
dimension vs its threshold, and the world-class verdict.

> The audit also tracks **build progress** (`excellence_score`) — the % of required
> artifacts actually produced — separately from CES (design compliance), so you can
> see both "is it designed world-class?" and "how much is built?".

---

## 4. Minimum world-class thresholds

A program is **world-class** when:

1. **CES ≥ 85**, AND
2. **every critical architecture** meets its minimum threshold.

If either fails, the program is "below world-class" and the failed critical
dimensions are named. (`WORLD_CLASS_CES = 85`.)

---

## 5. Reference implementation

The **AI Scrum Master Professional Certification** (18-module blueprint,
`blueprint18.ts`) is the reference implementation. By design it satisfies all ten
architectures across all 8 Scrum competencies and culminates in a placement-ready
capstone — scoring world-class against this standard. Every future program is held
to the same bar.

---

## 6. Program Factory specifications

Future programs are **generated from the standard** rather than hand-built:

- A **`ProgramFactorySpec`** declares `{ key, name, programKey, moduleCount,
  competencies }`.
- **`generateFactoryBlueprint(spec)`** produces a standard-conforming blueprint —
  every module gets the full canonical structure (lesson, AI mentor, practice,
  scenario, knowledge checks, three quiz tiers, enterprise simulation, tool-based
  lab, portfolio artifact, reflection, competency assessment, career outcome),
  with a capstone as the final module.
- The reference spec returns the curated 18-module AI Scrum Master blueprint;
  other specs are generated generically and then refined.
- **`CANONICAL_MODULE_STRUCTURE`** is the per-module template the standard requires.

Planned specs (await taxonomy): AI Product Manager, AI Project Manager.

---

## 7. Integration with the AI Workforce

The standard is the contract that connects the agents:

```
Curriculum Excellence  — owns the standard; scores programs (CES); audits gaps;
                         delegates builds.
Product Builder        — builds artifacts to the standard's architectures.
QA Authority           — gates every artifact (its 13 engines map to the
                         architectures: curriculum, assessment, simulation, lab,
                         project/portfolio, certification, AI, employability).
Student Success        — consumes competency/employability outcomes (CTS).
Placement Authority    — consumes portfolio + employability for placement.
```

Nothing publishes automatically; every built artifact is QA-gated and enters the
Founder Approval Queue. The standard makes "world-class" measurable, repeatable,
and enforceable across every Aladiah program.
