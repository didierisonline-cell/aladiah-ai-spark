# Agent Spec — Admissions Authority Agent

Status: **Canonical spec for Agent #6 of the Aladiah AI Workforce.**
Part of the Agent Operating System (`/docs/agents/AGENT_OPERATING_SYSTEM.md`).

## 1. Identity & mission

- **Slug:** `admissions-authority` · **Name:** Admissions Authority Agent · **Cadence:** daily.
- **Mission:** Convert qualified prospects into successful Aladiah students and
  maximize enrollment **quality**, student-program fit, completion probability, and
  employability outcomes.
- **Optimizes for:** Enrollment Quality · Program Fit · Completion Probability ·
  Certification Success · Employment Outcomes · Salary Growth — **not volume.**

## 2. The 10 engines

Lead Qualification · Career Matching · Program Recommendation · Financial Readiness ·
Objection Resolution · Webinar Conversion · Enrollment · Follow-Up · Employability
Projection · Student Success Prediction (`src/services/agents/admissions/engines.ts`,
each with Purpose / Inputs / Outputs / Quality Standards / KPIs / Approval).

## 3. Quality-over-volume model

`computeScores()` scores each prospect: qualification, fit, financial readiness,
completion probability, employability, plus an employability projection (employment
%, salary range, time-to-placement) and a success prediction (completion +
certification likelihood, risk factors). Status is decided **honestly**:

- `qualified` — high fit + completion ≥ 60 → enroll-ready (founder-approved).
- `nurturing` — promising but not yet ready.
- `disqualified` — low completion probability → recommend free resources, **not** enrollment.

## 4. Approval rules (non-negotiable)

The agent **drafts** recommendations and a 3-step follow-up sequence but **never**:
sends messages, charges payments, or enrolls/modifies student records without
**founder approval**. Enforced by AOS permissions (`publish:false`,
`human_approval_required:true`). Follow-ups are stored `drafted` and require approval;
enrollment is a founder action.

## 5. AOS integration

| Subsystem | Integration |
|---|---|
| Registry | Auto-registered in `bootstrap.ts` + migration seed. |
| Orchestrator | `admissionsRunner`; default cycle = process the new-prospect queue. |
| Execution Logs | Every scoring + cycle logged. |
| Memory | Qualification cycles + patterns. |
| Tasks | Accepts delegated `process_queue` tasks (`enqueueAdmissionsTask`). |
| Communication | Reports qualified counts to the CEO Agent. |
| Health | Rolls up on the registry. |
| Permissions | `publish:false`, `human_approval_required:true`. |

**Code:** service `src/services/agents/admissionsAgent.ts`; engines under
`src/services/agents/admissions/`; types `src/types/admissions.ts`; schema
`supabase/migrations/20260610190000_admissions_authority_agent.sql`
(`admissions_prospects`, `admissions_recommendations`, `admissions_followups`);
page `src/pages/admin/AdmissionsAgent.tsx` (`/admin/admissions-agent`).

## 6. Dashboard (`/admin/admissions-agent`)

KPIs (prospects, qualified, nurturing, enrolled, avg completion, pending approvals);
**Process Queue** (orchestrator) and a **Prospect Intake** form; tabs: Pipeline
(prospect table + detail with projection, success prediction, objections,
recommendations, and drafted follow-ups — each founder-approvable), Engines, Health.

## 7. Future

Phase 2: live CRM/lead-source ingestion, Claude-scored qualification + tailored
objection handling, real webinar attendance data, and feeding actual enrollment →
completion → placement outcomes back to calibrate the Student Success Prediction and
Employability Projection engines (closing the loop with the Student Outcome Engine).
