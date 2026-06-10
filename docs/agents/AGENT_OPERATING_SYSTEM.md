# Aladiah AI Workforce — Agent Operating System (AOS)

Status: **Design canon for the AI Workforce layer.** Read the platform canon in
`/docs/standards` first (NORTH_STAR · ARCHITECTURE_PRINCIPLE · COMPETENCY_TAXONOMY).
This document governs how autonomous agents are built, run, and scaled on Aladiah.

> **Architecture note (read before extending).** The five Core Systems in
> `ARCHITECTURE_PRINCIPLE.md` (Competency Measurement, Personalization, Simulation
> Readiness, AI Coaching, Employer Visibility) define the *product* surface. The AI
> Workforce is a **platform-operations layer beside them**: it does not replace a
> Core System and must **block none**. It qualifies under the Architecture Test the
> way observability/tooling does — by *serving* the Core Systems (giving the
> operator the picture needed to allocate effort toward employability outcomes)
> while **only reading** their data, never gating their write paths. Every agent
> added here keeps that contract: read-only on Core System tables, isolated in the
> `agent_*` tables, and justified by which Core System(s) its output advances.

---

## 1. Why an operating system, not a script

We are building a **workforce of agents** that will grow (CEO Chief of Staff, Head
of Growth, Head of Curriculum, Placement Officer, Risk & Compliance, …). If each
agent invents its own storage, scheduling, auth, and output shape, the system
becomes unmaintainable by agent #3. The AOS fixes the *shared* concerns once so
adding an agent is small and predictable.

| Concern | Solved once by the AOS | Per-agent responsibility |
|---|---|---|
| Report storage | `agent_reports` (JSONB sections) | Define a JSON schema |
| Task spin-off | `agent_tasks` | Map actions → tasks |
| Recommendations | `agent_recommendations` (founder-approval gate) | Map actions → recommendations |
| KPI snapshot | `business_metrics_daily` | Read it |
| Auth & RLS | admin-scoped via `user_roles` | Reuse it |
| UI surfacing | Command-Center component pattern | One React component set |

---

## 2. The shared tables

All agent state lives in four tables (migration
`supabase/migrations/20260610120000_ceo_chief_of_staff_agent.sql`), isolated from
Core System tables and **admin-scoped via `user_roles`** (RLS grants admins
SELECT/INSERT/UPDATE — never DELETE; service-role bypasses RLS for future cron).

```
business_metrics_daily ──read──> agent (service)
                                    │ writes
                 ┌──────────────────┼─────────────────────┐
                 ▼                   ▼                     ▼
          agent_reports      agent_tasks         agent_recommendations
          (daily report)     (tracked tasks)     (founder-approval gate)
```

- **`agent_reports`** — one canonical report per `(agent_name, report_date)`; the
  eight report sections live in JSONB columns, with `summary` + `urgency_level`
  denormalized for fast list views.
- **`agent_tasks`** — internal tasks the agent spins up from a report's actions.
- **`agent_recommendations`** — CEO recommendations carrying `approved_by_founder`
  (starts `false`); the autonomy boundary is structural, not just prose.
- **`business_metrics_daily`** — daily KPI snapshot the agent reads (and that an
  ingestion job can populate).

Why JSONB for report sections: each agent's report shape differs and evolves;
JSONB + a per-agent JSON Schema gives schema discipline without a migration per
prompt tweak.

---

## 3. Execution model

```
   trigger (manual button now | scheduled cron next)
                     │
                     ▼
   service: src/services/agents/<agent>.ts   (runs under the admin session)
     1. gather metrics   → defensive read-only queries across product tables
     2. build report     → assemble the report object (Phase 2: Claude synthesis)
     3. persist          → upsert agent_reports (one per agent per day)
     4. spin off work    → agent_tasks + agent_recommendations
     5. return report
                     │
                     ▼
   Command Center UI renders the latest report
```

Key rules:

- **Read-only on product data.** Agents read to build a report; they never write
  Core System tables. Guarantees they block 0 Core Systems.
- **Never fabricate.** Missing inputs are reported as 0 with a `notes` gap — never
  invented. Mirrors the canon rule that competency is never `null`-faked.
- **Structured output.** Each agent's report conforms to its JSON schema, so the
  stored payload is always valid and renderable.
- **Autonomy is structural.** v1 runs client-side under the admin session; it can
  only read product data and write the `agent_*` tables. Outbound actions (email,
  DMs, pricing, refunds, deploys) require explicit founder approval — see each
  agent spec's approval rules.

> **Server-side synthesis (Phase 2).** When agents use Claude for narrative
> synthesis, that call moves to a Supabase edge function so `ANTHROPIC_API_KEY`
> stays server-side. Default generation settings: `claude-opus-4-8`, adaptive
> thinking, `effort: high`, structured output = the agent's JSON schema.

---

## 4. Agent #1 — CEO Chief of Staff

The first agent of the workforce. Full spec:
`docs/agents/ceo-chief-of-staff/AGENT_SPEC.md`. Surface: `/admin/command-center`.

| Piece | Location |
|---|---|
| Service | `src/services/agents/ceoChiefOfStaffAgent.ts` |
| Types | `src/types/agentReports.ts` |
| Report schema | `docs/agents/ceo-chief-of-staff/daily_report.schema.json` |
| Page | `src/pages/admin/CommandCenter.tsx` |
| Components | `CommandCenterDashboard` · `MetricCard` · `RiskRadar` · `CEOActionQueue` · `DailyReportCard` |

---

## 5. The roadmap (workforce, not one agent)

Each future agent must pass the Architecture Test.

| # | Agent | Cadence | Serves (Core Systems) |
|---|---|---|---|
| 1 | **CEO Chief of Staff** | daily | All — operating picture for resource allocation |
| 2 | Head of Curriculum | weekly | Competency Measurement, Personalization |
| 3 | Head of Growth / Admissions | daily | platform ops; feeds enrollment → all |
| 4 | Placement Officer | weekly | Employer Visibility |
| 5 | Risk & Compliance Officer | daily | platform ops; guards all |
| 6 | Simulation Designer | on-demand | Simulation Readiness |

Future agents may **consume each other's reports** (the CEO agent reads the
Curriculum/Placement reports rather than recomputing). Because reports are stored
uniformly in `agent_reports`, agent-to-agent consumption needs no new plumbing.

---

## 6. How to add the next agent (checklist)

1. **Schema** — write `docs/agents/<slug>/<report>.schema.json` + add types to
   `src/types/agentReports.ts`.
2. **Prompt** — write the master system prompt in `docs/agents/<slug>/AGENT_SPEC.md`.
3. **Service** — copy `src/services/agents/ceoChiefOfStaffAgent.ts` → adapt the
   metric gathering, report build, and task/recommendation spin-off. Reuse the
   `agent_*` tables (no new tables unless the agent truly needs them).
4. **UI** — copy the Command-Center component set → render the new sections.
5. **Schedule** — wire a cron trigger once the manual path is verified.

One discrete agent at a time, verified before the next — per the platform working
rules.
