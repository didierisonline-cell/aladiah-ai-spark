# Agent Spec — Placement & Employer Relations Authority

Status: **Canonical spec for Agent #8 of the Aladiah AI Workforce.**
Part of the Agent Operating System (`/docs/agents/AGENT_OPERATING_SYSTEM.md`).

## 1. Identity & mission

- **Slug:** `placement-authority` · **Cadence:** daily.
- **Mission:** Transform placement-ready students into employed professionals and
  connect **Aladiah Academy** with **Aladiah Management**. This agent is the bridge
  between the two.
- **Primary KPI:** **Student Placement Rate.**
  Secondary: Average Salary · Time to Placement · Employer Satisfaction ·
  Promotion Rate · Retention Rate.

## 2. What it owns (15 areas)

Employer Intelligence · Employer Relationships · Recruiter Network · Talent
Marketplace · Student Matching · Job Pipeline · Interview Tracking · Offer Tracking ·
Salary Intelligence · Placement Tracking · Staffing Operations · Client Success ·
Employer Feedback · Alumni Career Growth · Workforce Demand Forecasting
(`src/services/agents/placement/engines.ts`).

## 3. The cross-agent bridge

**Receives** (from the Student Success Agent): placement-ready students with their
employability, portfolio, interview-readiness, and competency-mastery scores
(`ingestPlacementReady` reads `success_students` where `status='placement_ready'`).

**Feeds back** employer demand + salary intelligence to the Academy agents
(`forecastAndFeed` sends AOS messages to **product-builder, qa-authority,
student-success, admissions-authority**) so the Academy builds what the market
demands. Salary intelligence flows back to the Academy the same way.

## 4. Pipeline + approval gates (non-negotiable)

`runPipeline` (the runner's default cycle): ingest → match candidates to open jobs
→ draft a **gated** candidate submission → forecast + feed demand → report to CEO.

**No contract is sent, no candidate is submitted, and no employer communication
happens without founder approval.** These are stored as `placement_actions`
(`pending`); approving a `candidate_submission` advances the match to `submitted`.
Enforced by AOS permissions (`publish:false`, `human_approval_required:true`).

## 5. AOS integration

Auto-registered (`bootstrap.ts` + migration seed); `placementRunner` on the
orchestrator; every action logged; demand feedback remembered; accepts delegated
`run_pipeline` tasks (`enqueuePlacementTask`); reports the placement rate to the CEO
Agent; health rolls up; appears in the Control Center.

**Code:** service `src/services/agents/placementAgent.ts`; areas
`src/services/agents/placement/engines.ts`; types `src/types/placement.ts`; schema
`supabase/migrations/20260610210000_placement_employer_authority.sql`
(`placement_employers`, `placement_candidates`, `placement_jobs`,
`placement_matches`, `placement_actions`, `placement_demand`); page
`src/pages/admin/PlacementAgent.tsx` (`/admin/placement-agent`).

## 6. Dashboards (`/admin/placement-agent`)

KPIs (placement rate, avg salary, time-to-placement, employer satisfaction,
candidates, pending approvals) and tabs covering the required surfaces:
**Pipeline** (Placement Dashboard), **Employers** (Employer/Recruiter/Client
Dashboard, filterable by relationship), **Talent** (Talent Marketplace), **Demand &
Approvals** (workforce demand fed back + the gated contract/submission/outreach
queue), **Areas**, **Health**.

## 7. Future

Phase 2: live ATS/job-board ingestion, real employer CRM, automatic interview/offer
status sync, and closing the alumni loop (promotion + retention) — feeding real
placement, salary, promotion, and retention outcomes back into the Student Outcome
Engine and Admissions success predictions.
