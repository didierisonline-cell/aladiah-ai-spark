# Agent Spec — SEO Strategy Agent

Status: **Canonical spec for Agent #3 of the Aladiah AI Workforce.**
Part of the Agent Operating System (`/docs/agents/AGENT_OPERATING_SYSTEM.md`).

## 1. Identity & AOS integration

- **Slug:** `seo-strategy`  ·  **Name:** SEO Strategy Agent  ·  **Cadence:** daily.
- **Mission:** Own organic discovery for Aladiah Academy.

A first-class AOS citizen — it builds no parallel infrastructure:

| AOS subsystem | How this agent uses it |
|---|---|
| **Registry** | Auto-registered in `bootstrap.ts` + seeded in the migration. |
| **Memory** | Stores keywords, competitor sets, clusters, and SEO opportunities. |
| **Task Manager** | Accepts CEO-delegated SEO tasks (`enqueueSeoTask`); **creates content tasks for the Marketing Agent** (`enqueueMarketingTask`). |
| **Orchestrator** | `seoRunner` registered via `registerRunner`; runs with retries + run records. |
| **Execution Logs** | Every research/cluster/audit/delegation action logged. |
| **Communication** | Sends `task_request` messages to the Marketing Agent; reports cycles to the CEO agent. |
| **Health** | Uptime/errors/perf score roll up on the registry; shown on the dashboard. |
| **Permissions** | `publish:false`, `human_approval_required:true`. |

**Code:** service `src/services/agents/seoStrategyAgent.ts`; types `src/types/seo.ts`;
schema `supabase/migrations/20260610150000_seo_strategy_agent.sql`
(`seo_keywords`, `seo_clusters`, `seo_competitors`, `seo_audits`, `seo_recommendations`);
page `src/pages/admin/SeoAgent.tsx` (`/admin/seo-agent`); components
`src/components/admin/seo/*`.

> **The SEO Agent does NOT create marketing content.** It generates SEO strategy
> and **delegates** content requests to the Marketing Content Agent through the AOS
> Task Manager.

## 2. Responsibilities

- **Keyword research** across the program areas: Scrum Master, Project Management,
  AI Careers, Cybersecurity, Cloud Computing, Data Analytics, Business Analysis,
  Agile Coaching, AI Workforce Development.
- **Topic clusters** — pillar pages, supporting articles, internal-link recommendations.
- **Competitor analysis** — Coursera, Udemy, Simplilearn, Scrum.org, PMI, Google
  Career Certificates (extensible list in the service).
- **SEO audits** — metadata, schema, broken links, internal linking, content depth.
- **Content requests** — turn high-opportunity keywords into delegated tasks.

## 3. Marketing delegation workflow

`requestContentForKeyword(keyword)` turns one keyword into a content package and
files it through the Task Manager as tasks **assigned to `marketing-content`**:

| Keyword: *AI Scrum Master Certification* → |
|---|
| Pillar article (`create_content` · blog · pillar) |
| LinkedIn series (`create_content` · linkedin) |
| YouTube script (`create_content` · youtube · long_form_script) |
| Lead magnet (`lead_magnet` · checklist) |

It also sends a `task_request` message to the Marketing Agent and records the link
in `seo_recommendations.delegated_task_id` (+ `metadata.task_ids`). The Marketing
Agent's orchestrated runner then generates the assets into its approval queue.
**SEO decides; Marketing produces; the founder approves.**

## 4. Memory

Stores keywords (short-term), competitor reviews (short-term), and durable
opportunities/clusters (long-term, importance ≥ 0.7) — recalled to inform future
strategy and the Phase-2 AI synthesis.

## 5. Dashboard (`/admin/seo-agent`)

Keyword opportunities (with per-keyword "Request content"), topic clusters,
competitor tracking, SEO audits, recommendations (with "Delegate to Marketing"),
the marketing requests generated, and agent health. Toolbar runs a full strategy
cycle (through the orchestrator), a site audit, or a competitor refresh.

## 6. CEO → SEO delegation

`enqueueSeoTask(kind, payload)` lets the CEO agent (or a human) delegate
`keyword_research`, `build_cluster`, `competitor_analysis`, `audit`, or
`content_request` to this agent; the runner processes ready tasks first, then falls
back to a default strategy cycle.

## 7. Future architecture

1. **Live SEO data.** Replace the deterministic catalog with real keyword/rank/
   SERP data (Search Console, a keyword API) and competitor crawls.
2. **AI synthesis.** Swap heuristics for Claude (`claude-opus-4-8`, structured
   output) in a server-side edge function — same service contract.
3. **Closed loop.** Track delegated requests → published content → rankings;
   feed ranking deltas back into `seo_keywords.current_rank` and memory so the
   agent learns which clusters win.
4. **Specialist hand-offs.** Social Media and YouTube agents consume SEO clusters
   and delegate the same way — multi-agent growth department on the shared AOS.
