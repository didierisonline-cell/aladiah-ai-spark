# Agent Spec — Student Success & Employability Authority

Status: **Canonical spec for Agent #7 of the Aladiah AI Workforce.**
Part of the Agent Operating System (`/docs/agents/AGENT_OPERATING_SYSTEM.md`).

## 1. Identity & mission

- **Slug:** `student-success` · **Name:** Student Success & Employability Authority · **Cadence:** daily.
- **Mission:** Transform students into employable professionals and future leaders.
- **Primary KPI:** **Career Transformation Score (CTS)** — the weighted composite of
  the readiness dimensions (`computeCTS` in `success/engines.ts`).

## 2. What it owns (14 areas)

Competency Mastery · Student Risk Detection · Learning Gap Analysis · Certification
Readiness · Simulation Mastery · Portfolio Readiness · Interview Readiness · Resume
Optimization · LinkedIn Authority · Employability Scoring · Salary Projection ·
Promotion Readiness · AI Readiness · Career Transformation
(`src/services/agents/success/engines.ts`).

## 3. Scoring model (honest)

The agent reads student data READ-ONLY (`profiles`, `user_progress`,
`quiz_attempts`, `student_analytics`, `subscriptions`) and computes each dimension:

- **Real signals:** competency mastery (quiz scores), completion (progress),
  activity recency (analytics) → risk detection.
- **Derived (flagged in `estimated[]`):** simulation/portfolio/interview/resume/
  LinkedIn/AI/promotion readiness — until those data sources are wired (Phase 2).

CTS = weighted sum of dimensions (competency 20, employability 12, completion/
certification/simulation/interview 10 each, portfolio 8, resume/linkedin/ai/
promotion 5 each). Status: `at_risk` (high risk), `placement_ready` (CTS ≥ 70 +
employability ≥ 75), `thriving` (CTS ≥ 80), else `active`. A salary projection is
derived from program demand × employability.

## 4. Approval rules (non-negotiable)

The agent detects risk, scores readiness, and **drafts** interventions (outreach,
remediation, placement, escalation) — but **never modifies student records, sends
messages, or acts without founder approval** (AOS permissions `publish:false`,
`human_approval_required:true`). Interventions are stored `pending`; the founder
approves or dismisses each.

## 5. AOS integration

| Subsystem | Integration |
|---|---|
| Registry | Auto-registered in `bootstrap.ts` + migration seed. |
| Orchestrator | `studentSuccessRunner`; default cycle = process the cohort. |
| Execution Logs | Every cycle logged. |
| Memory | CTS cycles + cohort patterns. |
| Tasks | Accepts delegated `process_cohort` tasks (`enqueueSuccessTask`). |
| Communication | Reports avg CTS + at-risk counts to the CEO Agent. |
| Health | Rolls up on the registry. |
| Control Center | Appears automatically via the registry snapshot. |
| Permissions | `publish:false`, `human_approval_required:true`. |

**Code:** service `src/services/agents/studentSuccessAgent.ts`; areas
`src/services/agents/success/engines.ts`; types `src/types/success.ts`; schema
`supabase/migrations/20260610200000_student_success_authority.sql`
(`success_students`, `success_interventions`); page
`src/pages/admin/StudentSuccessAgent.tsx` (`/admin/student-success`).

## 6. Dashboard (`/admin/student-success`)

KPIs (students, **avg CTS**, thriving, at-risk, placement-ready, pending
interventions); **Process Cohort** (orchestrator); tabs: Cohort (CTS-ranked table +
per-student readiness profile, salary projection, risk factors, and drafted
interventions with approve/dismiss), Areas (the 14 owned areas), Health.

## 7. Future

Phase 2 wires the estimated dimensions to real data (simulation engine scores,
portfolio/GitHub from the QA Agent, resume/LinkedIn from the career tools), uses
Claude to generate personalized coaching, and feeds actual placement/salary
outcomes back to calibrate projections — closing the loop with the Product Builder's
Student Outcome Engine and the Admissions Agent's success predictions.
