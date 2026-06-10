# Agent Spec — Marketing Content Agent

Status: **Canonical spec for Agent #2 of the Aladiah AI Workforce.**
Part of the Agent Operating System (`/docs/agents/AGENT_OPERATING_SYSTEM.md`).
Read the platform canon in `/docs/standards` first.

## 1. Identity & AOS integration

- **Slug:** `marketing-content`  ·  **Name:** Marketing Content Agent
- **Mission:** Generate high-quality marketing assets that create **awareness,
  authority, leads, and student enrollments** for Aladiah Academy.
- **Cadence:** daily (manual + orchestrated).

This agent is a **first-class AOS citizen** — it does not build its own
infrastructure. It uses every subsystem:

| AOS subsystem | How this agent uses it |
|---|---|
| **Registry** | Auto-registered in `bootstrap.ts` (`registerAgent`) + seeded in the migration. |
| **Memory** | Stores content themes (short-term) and best-performing content (long-term, importance 0.85). |
| **Task Manager** | `enqueueMarketingTask()` creates tasks assigned to it; the runner processes ready tasks with dependency/priority handling. |
| **Orchestrator** | `marketingRunner` registered via `registerRunner`; runs with retries, run records, and scheduling. |
| **Execution Logs** | Every generation/persist/approval action is logged (`logAction` / `ctx.log`). |
| **Permissions** | `read:true, write:true, publish:false, human_approval_required:true` — publishing is structurally blocked; approval gates content. |
| **Health** | Uptime/errors/perf score roll up on the registry after each run; shown on the dashboard. |
| **Communication** | Reports back to the CEO agent after each run; **accepts delegated tasks** from CEO/SEO/Social/YouTube agents. |

**Code:**
- Service: `src/services/agents/marketingContentAgent.ts`
- Generators: `src/services/agents/marketing/generators.ts`
- Types: `src/types/marketing.ts`
- Schema: `supabase/migrations/20260610140000_marketing_content_agent.sql`
  (`marketing_content`, `marketing_campaigns`, `marketing_content_calendar`, `marketing_approvals`)
- Page: `src/pages/admin/MarketingAgent.tsx` (`/admin/marketing-agent`)
- Components: `src/components/admin/marketing/*`

> **Domain vs infra.** The `marketing_*` tables are this agent's **domain output**;
> all cross-cutting state (registry, runs, logs, memory, tasks, messages) lives in
> the shared `aos_*` tables. This is the canonical pattern for every new agent.

## 2. Content types

- **LinkedIn** — thought leadership, career transformation, agile, AI-workforce, success stories
- **Facebook** — community, motivational, program highlights
- **Instagram** — captions, carousels, reels concepts
- **Blog** — long-form SEO articles, pillar content, career guides, industry reports
- **Email** — newsletters, lead nurturing, webinar invitations
- **YouTube** — long-form scripts, shorts scripts, descriptions, titles, thumbnail concepts
- **Webinars** — topics, landing-page copy, follow-up sequences
- **Lead magnets** — checklists, PDF guides, career roadmaps, interview guides

## 3. Tasks supported

`create_content` · `repurpose` · `campaign` · `webinar` · `lead_magnet` ·
`content_calendar`. Each is callable directly (dashboard) or via a delegated AOS
task (`enqueueMarketingTask`) that the orchestrated runner executes.

## 4. Repurposing engine

One idea automatically becomes **13 assets**: 1 blog · 3 LinkedIn · 2 Facebook ·
1 email · 2 Instagram captions · 1 YouTube long-form script · 3 Shorts ideas
(`REPURPOSE_PLAN` in `generators.ts`).

## 5. Content calendar

`daily` (1 slot) · `weekly` (7) · `monthly` (30) — a rotating multi-platform plan
stored in `marketing_content_calendar.plan` (slots reference platform/type/date/
theme; assets generated on demand).

## 6. Approval system (non-negotiable)

**Nothing publishes automatically.** Every generated asset is created at status
`pending_approval`. The founder can **approve**, **reject**, or **edit** from
`/admin/marketing-agent`. Decisions are audited in `marketing_approvals` and logged
to AOS execution logs. The permission framework enforces this: `publish:false` +
`human_approval_required:true`.

## 7. Memory

Stores: best-performing content (on `recordPerformance` when engagement is high),
content themes, audience interests, and engagement patterns — recalled to inform
future generation (Phase 2 AI synthesis).

## 8. Delegation (agent-to-agent)

Other agents delegate via the Communication Layer + Task Manager:

```ts
import { enqueueMarketingTask } from '@/services/agents/marketingContentAgent';
// CEO / SEO / Social / YouTube agent:
await enqueueMarketingTask('repurpose', { idea, theme }, { fromAgent: 'seo-agent', priority: 'high' });
```

The marketing runner picks up the ready task on its next orchestrated run,
generates the assets (into the approval queue), and `reportToCeo(...)`. When the
SEO/Social/YouTube agents are built, they delegate the same way — no new plumbing.

## 9. Future social media integration architecture

1. **Generation → approval → scheduling → publish.** Today the pipeline stops at
   `approved`. Phase 2 adds a `scheduled`/`published` transition wired to platform
   APIs (LinkedIn, Meta Graph, YouTube Data API, an ESP for email) behind the
   AOS **publish** permission — which stays `false` until a human enables it per
   channel. Publishing always runs server-side (edge function holding channel
   tokens), never client-side.
2. **AI synthesis.** Swap the deterministic generators for Claude
   (`claude-opus-4-8`, adaptive thinking, structured output = `DraftAsset`) in a
   server-side edge function; the service contract is unchanged.
3. **Performance ingestion.** Scheduled jobs pull post analytics into
   `marketing_content.performance`; `recordPerformance` already promotes winners to
   long-term memory so the agent learns what works.
4. **Specialist agents.** SEO, Social Media, and YouTube agents register in the AOS
   and delegate to this agent (Task Manager), or consume its assets — multi-agent
   marketing department, all on the shared framework.
