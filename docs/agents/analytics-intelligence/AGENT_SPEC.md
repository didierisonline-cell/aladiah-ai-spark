# Agent Spec — Analytics & Executive Intelligence Authority

Status: **Canonical spec for Agent #9 of the Aladiah AI Workforce.**

## 1. Identity & mission
- **Slug:** `analytics-intelligence` · **Cadence:** daily.
- **Mission:** Be the Executive Intelligence Layer and **source of truth** for the
  whole ecosystem (Academy, Management, marketing, admissions, student success,
  placement, revenue, employability, curriculum). **It does not create content — it
  analyzes.**
- **Primary KPI:** **Career Transformation Impact Score (CTIS)** — the master
  company KPI: student success · placement success · salary growth · certification
  success · competency growth · employer satisfaction (weighted in `analytics/engines.ts`).

## 2. Intelligence engines
Revenue · Student · Employability · Curriculum · Marketing intelligence — each with
tracked metrics and forecasts (`INTELLIGENCE_ENGINES`). The service aggregates from
subscriptions, profiles, progress, quiz attempts, quiz coverage, marketing content,
referrals, placement + success tables, and product artifacts.

## 3. CEO briefing system
Each cycle `buildBrief()` computes CTIS + the five intelligence sections +
forecasts (30d/90d/12m revenue, enrollment growth, completion/dropout probability)
+ risks + recommendations + priority actions, persists a `ceo_brief` in
`analytics_reports` (one per day, upsert), snapshots key metrics into
`analytics_metrics`, stores the brief in memory, and reports to the CEO Agent.

## 4. Approval rules (read-only)
**Never modifies production data.** Read-only analytics; recommendations only; no
publishing, no student/enrollment/placement modification. Permissions:
`read:true, write:false`.

## 5. AOS + Control Center
Auto-registers; `analyticsRunner` on the orchestrator; logs all actions; reports to
the CEO Agent; **feeds the Control Center the CTIS master KPI** (surfaced as the
first global metric) and appears as a registry card. Health rolls up.

**Code:** `src/services/agents/analyticsAgent.ts`, `analytics/engines.ts`,
`src/types/analytics.ts`; migration `20260610220000_analytics_intelligence.sql`
(`analytics_reports`, `analytics_metrics`); page `src/pages/admin/AnalyticsAgent.tsx`
(`/admin/analytics`).

## 6. Dashboard (`/admin/analytics`)
CTIS hero + tabs: Executive · Revenue · Students · Employability · Curriculum ·
Marketing · Forecasting · Reports · Health.

## 7. Future
Wire real billing (revenue by program/country/tier/source), ad-spend (CPL/CPA/ROI),
and salary outcomes; replace heuristic forecasts with model-based forecasting and
Claude-generated narrative briefs.
