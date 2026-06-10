# Agent Spec — Operations & Platform Authority

Status: **Canonical spec for Agent #10 of the Aladiah AI Workforce.**

## 1. Identity & mission
- **Slug:** `operations-platform` · **Cadence:** daily.
- **Mission:** Guardian of **platform reliability, student experience, revenue
  protection, and operational excellence.** Monitors the entire ecosystem.

## 2. Engines (8)
Platform Monitoring · Functional Testing · Course Integrity · Simulation Integrity ·
Payment · Infrastructure · AI Engine Monitoring · Platform Audit
(`src/services/agents/operations/engines.ts`).

## 3. Severity model
`critical` · `high` · `medium` · `low`. Every finding carries a severity and a
recommendation; findings are deduped by title while open.

## 4. What the audit does (v1, read-only)
`runAudit()`:
- **Infrastructure** — a live client→Supabase query proves the DB/auth reachable
  (records latency; a failure is a **critical** finding). AI services are kept
  `unknown` (server-side probes are Phase 2).
- **Course Integrity** — verifies the program has the full artifact set (module,
  quiz, simulation, lab, project, learning_path, assessment); flags missing types.
  Also flags quiz questions missing a competency slug (canon).
- **Simulation Integrity** — flags simulations missing decision points / rubric.
- **Payment** — detects revenue leakage (past_due / canceled subscriptions).
- **Platform Monitoring** — structural status (live crawl is Phase 2).
- Composes the **daily operations report** (platform status, critical count,
  payment risks), reports to the CEO Agent, and stores it in memory.

## 5. Approval rules
**No automatic fixes, no publishing, no student/enrollment/placement
modification.** Reports findings only; founder approval required for any
corrective action. Permissions: `read:true, write:false`.

## 6. AOS + Control Center
Auto-registers; `operationsRunner` (default cycle = run the audit); logs all
actions; reports to the CEO Agent; appears as a workforce card; health rolls up.

**Code:** `src/services/agents/operationsAgent.ts`, `operations/engines.ts`,
`src/types/operations.ts`; migration `20260610230000_operations_platform_authority.sql`
(`ops_status`, `ops_findings`, `ops_reports`); page
`src/pages/admin/OperationsAgent.tsx` (`/admin/operations`).

## 7. Dashboard (`/admin/operations`)
KPIs (platform status, components OK, open findings, critical, high, payment
risks) and tabs: Platform · Infrastructure · Courses · Simulations · AI Services ·
Payments · Alerts · Audit Center · Health.

## 8. Future
Live route crawling (broken links / 404 / missing assets), real infra/API health
probes (server-side), AI-service latency/quality checks, and synthetic functional
tests of buttons/forms/flows.
