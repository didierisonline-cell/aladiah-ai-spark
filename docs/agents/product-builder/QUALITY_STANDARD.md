# Aladiah Quality Standard

Status: **Canonical gate for the Product Builder Agent (and future Curriculum /
Simulation Factory / QA agents).** Implemented in
`src/services/agents/product/quality.ts` (`runQualityChecks`).

Every generated course update — module, quiz, simulation, lab, rubric, project,
learning path, or course improvement — **must pass this checklist before it can be
submitted to the Founder Approval Queue.** Artifacts that fail any **critical**
standard are held as `draft` with their report attached. **Nothing is ever
auto-published.**

## The 13 standards

| # | Standard | Critical | How it's checked (v1) |
|---|---|:---:|---|
| 1 | World-class quality | ✅ | Quality score ≥ 75 |
| 2 | AI integrated start to finish | ✅ | Artifact carries an AI-integration element (AI tutor / feedback / coach) |
| 3 | Practical real-world application | — | Lab/project/simulation, or practice/real-world content present |
| 4 | Career transformation focused | ✅ | References career/employability/interview/transformation |
| 5 | Clear lesson structure | — | Modules: ≥2 objectives and ≥2 structured lessons |
| 6 | Strong quizzes | — | Quizzes: ≥4 questions, valid answers, **one competency slug each**, explanations, **no letter-prefixed options** |
| 7 | Strong simulations | — | Simulations: ≥2 decision points + competency-mapped rubric |
| 8 | Hands-on labs | — | Labs: ≥3 steps + a deliverable |
| 9 | Student-friendly language | — | Accessible summary present |
| 10 | Professional tone | — | No casual/unprofessional language |
| 11 | Job-market relevance | — | Mapped to a program and competencies |
| 12 | Interview readiness | — | Builds toward interview readiness |
| 13 | Measurable competency outcomes | ✅ | Mapped to ≥1 approved competency slug; outcomes measurable |

**Pass rule:** an artifact passes when **all critical standards pass**. The report
also records an overall score (`passed/total`) and a per-standard note. Critical
standards (1, 2, 4, 13) protect Aladiah's non-negotiables: world-class quality,
AI-native pedagogy, career-transformation focus, and the Competency Engine.

## Why these are checks, not vibes

The gate is a structural predicate over each artifact, so it is objective,
auditable, and shown to the founder in the Approval Queue (the full checklist
renders per artifact). As generation upgrades to Claude (Phase 2), the same gate
runs unchanged — and matters more, not less.

## Evolving the standard

- Add/adjust standards in `ALADIAH_QUALITY_STANDARDS` (`product/quality.ts`).
- Tightening a check may move previously-passing drafts back to `draft` — that is
  intended (the bar rises).
- The future **QA Agent** extends this file with deeper review (factual accuracy,
  difficulty calibration against competency analytics, regression checks).
