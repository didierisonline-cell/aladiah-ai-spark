# Aladiah Agent Operating System (AOS)

Status: **Permanent infrastructure canon for the AI Workforce.** Read the platform
canon in `/docs/standards` first. **Every future agent plugs into this framework
— it does not build its own registry, scheduling, memory, logging, permissions,
health, or messaging.**

> **Architecture note.** The five Core Systems in `ARCHITECTURE_PRINCIPLE.md` are
> the *product* surface. The AOS is a **platform-operations layer beside them**: it
> only *reads* product data and writes solely to its own `aos_*` tables, so it
> serves the Core Systems (it is how the workforce that advances them is run and
> observed) and **blocks none**.

---

## 1. The eight subsystems

| # | Subsystem | Table(s) | Service module |
|---|---|---|---|
| 1 | **Agent Registry** | `aos_agents` | `services/aos/registry.ts` |
| 2 | **Agent Memory** | `aos_agent_memory` | `services/aos/memory.ts` |
| 3 | **Task Manager** | `aos_tasks` | `services/aos/tasks.ts` |
| 4 | **Orchestrator** | `aos_runs` (+ runner registry) | `services/aos/orchestrator.ts` |
| 5 | **Execution Logs** | `aos_execution_logs` | `services/aos/logs.ts` |
| 6 | **Permissions** | `aos_agents.permissions` (jsonb) | `services/aos/permissions.ts` |
| 7 | **Health Monitoring** | `aos_agents` health columns | `services/aos/health.ts` |
| 8 | **Communication** | `aos_messages` | `services/aos/communication.ts` |

Schema: `supabase/migrations/20260610130000_agent_operating_system.sql`.
Types: `src/types/aos.ts`. Facade: `import { aos } from '@/services/aos'`.

> **`aos_*` vs `agent_*`.** The `aos_*` tables are shared **infrastructure**. The
> CEO agent's `agent_reports` / `agent_recommendations` / `business_metrics_daily`
> (migration `…120000`) remain its **domain output** store. Infra is shared; an
> agent's specialized output can stay in its own domain tables.

---

## 2. Subsystem detail

**1. Agent Registry** — one row per agent: `name`, `role`, `status`
(active/paused/disabled/error), `priority`, `cadence`, `last_run_at`,
`next_run_at`, `system_prompt`, `permissions`, plus health rollups. The single
source of truth for who is in the workforce.

**2. Agent Memory** — `short_term` / `long_term` / `episodic` memories with an
`importance` score (0–1, auto-scored via `scoreImportance` or caller-supplied),
`tags`, and full-text **search** via `recall()`. `consolidate()` promotes durable
short-term memories to long-term and ages out expired ones. Phase-2 swaps the
`embedding` column to pgvector for semantic recall (see §5).

**3. Task Manager** — `createTask` / `assignTask` / `setTaskStatus`, **priority**
levels (low→critical) and **dependencies** (`depends_on`). A task with unmet
dependencies starts `blocked`; completing a dependency calls `resolveDependents`
to unblock it. `listReadyTasks(agent)` returns what an agent can pick up now.

**4. Orchestrator** — agents register a **runner** (their executable body) via
`registerRunner(slug, fn)`. `runAgent(slug, trigger)` wraps execution in a run
record, retries with backoff (`config.maxAttempts`), updates health, and logs
every step. `tick()` runs all **due** agents (`next_run_at <= now`, active,
non-manual) in priority order — wire it to a scheduled trigger in Phase 2.

**5. Execution Logs** — `aos_runs` = one row per invocation (outcome/retries);
`aos_execution_logs` = every action within a run (timestamp, agent, level,
result, error). Full audit trail for the whole workforce.

**6. Permissions Framework** — capabilities `read` · `write` · `publish` ·
`admin` · `human_approval_required` (jsonb on the registry). `guard(slug, cap)`
throws `PermissionError` when missing and `ApprovalRequiredError` for gated
write/publish actions unless `{ approved: true }`. Enforced in the service layer
and structurally by RLS (an agent never exceeds the admin session it runs under).

**7. Health Monitoring** — `getFleetHealth()` classifies each agent
(healthy/degraded/down/idle) from registry rollups: uptime (success rate),
last success, error count, consecutive failures, performance score, avg duration.
`recordRunOutcome()` updates these after every run.

**8. Communication Layer** — `sendMessage` / `inbox` between agents.
`delegateTask(toAgent, task)` lets the **CEO agent create tasks for other agents**
(task + `task_request` message). `reportToCeo(fromAgent, report)` lets agents
**return reports back to the CEO agent**.

---

## 3. Service architecture

```
import { aos } from '@/services/aos';

await aos.ensure();                         // bootstrap: register runners + registry rows
await aos.orchestrator.runAgent(slug);      // run one agent (retries + logs + health)
await aos.orchestrator.tick();              // run all due agents
await aos.memory.remember({ ... });         // store memory
await aos.memory.recall(slug, 'query');     // search memory
await aos.tasks.createTask({ ... });        // task with deps + priority
await aos.comms.delegateTask(to, { ... });  // CEO -> agent
await aos.health.getFleetHealth();          // dashboard health
await aos.permissions.guard(slug, 'write'); // permission/approval gate
```

- **`bootstrap.ts`** wires existing agents into the OS (runner + registry row).
  The CEO agent is registered there; a new agent adds one block.
- All services run client-side under the **admin session**; RLS scopes every
  `aos_*` table to admins (SELECT/INSERT/UPDATE — never DELETE).
- The aos_* tables aren't in the generated Supabase types yet, so services use a
  loosely-typed handle (`_internal.ts`); the esbuild build is unaffected.

---

## 4. Dashboard

`/admin/agent-os` (`src/pages/admin/AgentOS.tsx`) — the control plane:

- **Registry** tab — agents with status/priority/last+next run/permissions; per-agent
  **Run** and **Pause/Resume**.
- **Health** tab — fleet health cards (perf score, success rate, errors).
- **Tasks** tab — task board grouped by status with priority + dependencies.
- **Logs** tab — recent runs + the execution-log stream.
- **Comms** tab — agent-to-agent message feed.
- Toolbar — **Run Orchestrator Tick** (runs all due agents) + Refresh.

Components in `src/components/admin/aos/`.

---

## 5. Future AI integration architecture

The AOS is built so intelligence slots in without re-plumbing:

1. **Server-side reasoning.** Agent runners that call Claude do so via a Supabase
   **edge function** (keeps `ANTHROPIC_API_KEY` server-side). Defaults:
   `claude-opus-4-8`, adaptive thinking, `effort: high`, structured output =
   the agent's JSON schema. The orchestrator already wraps the call in
   run/logs/health, so an AI runner is a drop-in replacement for a deterministic one.

2. **Memory as context.** Before a run, an AI agent calls `recall()` to load
   relevant long-term memories into the prompt; after a run it `remember()`s new
   findings. Phase 2 upgrades `aos_agent_memory.embedding` to **pgvector** for
   semantic recall (enable the extension, swap the column to `vector`, add an
   embedding step in `remember`, switch `recall` to a vector match — the service
   API is unchanged).

3. **Tools = subsystems.** When agents call Claude with tool use, the tools map
   onto AOS services (`createTask`, `delegateTask`, `recall`, `sendMessage`),
   with `permissions.guard()` enforced before any write/publish tool executes and
   `human_approval_required` gating sensitive actions.

4. **Scheduled autonomy.** A cron/edge trigger calls `orchestrator.tick()` on an
   interval; due agents run unattended, with all outcomes captured in `aos_runs`
   and health auto-updated.

5. **Multi-agent workflows.** Agents coordinate purely through the Communication
   Layer + Task Manager: the CEO agent delegates via `delegateTask`, directors
   `reportToCeo`, dependencies sequence multi-step work. No new plumbing needed.

---

## 6. How to add the next agent

1. **Register** — add a `registerAgent({...})` block + a runner in `bootstrap.ts`
   (or seed a row in the migration). Set its `permissions` and `cadence`.
2. **Runner** — implement `(ctx) => Promise<AgentRunOutput>`; use `ctx.log(...)`
   for actions and the `aos` services for tasks/memory/messages.
3. **Domain output (optional)** — if the agent produces a specialized artifact,
   it may keep its own domain table (like the CEO agent's `agent_reports`); it
   still uses the AOS for everything cross-cutting.
4. **UI (optional)** — add a dedicated surface, or rely on `/admin/agent-os`.

The agent inherits scheduling, retries, logging, health, permissions, memory, and
messaging for free. **Do not build parallel systems.**
