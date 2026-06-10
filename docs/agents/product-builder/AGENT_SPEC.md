# Agent Spec — Product Builder Agent

Status: **Canonical spec for Agent #4 of the Aladiah AI Workforce.**
Part of the Agent Operating System (`/docs/agents/AGENT_OPERATING_SYSTEM.md`).
Read the platform canon in `/docs/standards` first — this agent touches the
Competency Engine, so canon compliance is mandatory.

## 1. Identity & AOS integration

- **Slug:** `product-builder` · **Name:** Product Builder Agent · **Cadence:** weekly (overnight-capable).
- **Mission:** Continuously improve Aladiah Academy.

A first-class AOS citizen (no parallel infrastructure):

| AOS subsystem | Integration |
|---|---|
| **Registry** | Auto-registered in `bootstrap.ts` + migration seed. |
| **Memory** | Stores gaps found, overnight-run summaries, improvement themes (long-term). |
| **Task Manager** | Accepts delegated product tasks (`enqueueProductTask`); the runner processes them. |
| **Orchestrator** | `productRunner`; **default cycle = the overnight improvement workflow** (a scheduled tick improves courses unattended). |
| **Execution Logs** | Every gap-detect / generate / quality-check / approval action logged. |
| **Communication** | Reports every run to the CEO Agent (and thus the Control Center). |
| **Health** | Uptime/errors/perf score roll up on the registry. |
| **Permissions** | `publish:false`, `human_approval_required:true` — structurally cannot publish. |

**Code:** service `src/services/agents/productBuilderAgent.ts`; generators
`src/services/agents/product/generators.ts`; quality gate
`src/services/agents/product/quality.ts`; taxonomy mirror
`src/services/agents/product/taxonomy.ts`; types `src/types/product.ts`; schema
`supabase/migrations/20260610160000_product_builder_agent.sql`
(`product_artifacts`, `product_gaps`, `product_recommendations`, `product_approvals`);
page `src/pages/admin/ProductAgent.tsx` (`/admin/product-agent`).

## 2. Responsibilities

Create modules · quizzes · simulations · labs · projects · learning paths;
detect curriculum gaps; recommend course improvements; recommend new programs;
build learning paths; improve student outcomes.

## 3. Canon compliance (non-negotiable)

- **Reads live curriculum READ-ONLY** (`courses`, `chapters`, `videos`,
  `quizzes`, `quiz_questions`) for gap analysis. Writes only `product_*` drafts.
- **Never publishes.** Generated artifacts are DRAFTS. Promotion into the live
  curriculum is a separate, human-gated step — Claude Code never auto-applies SQL
  or live-DB writes (NORTH_STAR working rules).
- **Competency at insert, one slug per question.** Every generated quiz question
  carries exactly one Axis-1 slug from `COMPETENCY_TAXONOMY.md` (mirrored in
  `product/taxonomy.ts` — never invent or rename slugs).
- **No letter prefixes.** Option text never embeds `A)/B)/C)/D)` — the quiz UI
  prefixes via `String.fromCharCode(65+idx)` (CLAUDE.md).

## 4. The Aladiah Quality Standard (the gate)

Every artifact runs through `runQualityChecks()` (13 standards — see
`QUALITY_STANDARD.md`). **Only artifacts that pass all CRITICAL standards reach the
Founder Approval Queue** (`status = pending_approval`); failures are held as
`draft` with their full report attached. Nothing skips the gate; nothing auto-publishes.

## 5. Overnight improvement run

`runOvernightImprovement(program)` (the runner's default cycle) executes the
founder's overnight workflow:

1. **Select** course areas needing improvement (weakest competency coverage, from
   live `quiz_questions`).
2. **Generate** improved content (module) per weak area.
3. **Create quizzes** (competency-tagged) per weak area.
4. **Create simulations** (one per run).
5. **Create labs** per weak area + a learning path.
6. **Run quality checks** on every artifact.
7. **Save** passing work as `pending_approval` (Founder Approval Queue); hold
   failures as `draft`.
8. **Report** the full summary to the CEO Agent and the AI Workforce Control Center.

Schedule it by pointing a daily/nightly trigger at `orchestrator.tick()` (the
agent is `weekly` cadence by default — adjust in the registry) or invoke
`runAgent('product-builder')` from a cron edge function.

## 6. Founder Approval Queue

`/admin/product-agent` → **Approval Queue** shows each pending artifact with its
quality checklist and full content. The founder can **approve**, **reject**, or
**edit** (title/summary). Decisions are audited in `product_approvals`. Approving
marks the artifact `approved` (ready); live promotion stays a manual step.

## 7. Foundation for future agents

The unified `product_artifacts` table + generators + quality gate + gap analysis
are the substrate for:
- **Curriculum Agent** — sequences approved artifacts into programs/paths.
- **Simulation Factory Agent** — specializes the `simulation` generators at scale.
- **QA Agent** — extends `quality.ts` with deeper review + regression checks.

Each will register in the AOS and reuse these tables/gate rather than building anew.

## 8. Future (AI synthesis)

Swap the deterministic generators for Claude (`claude-opus-4-8`, adaptive thinking,
structured output) in a server-side edge function — same `DraftArtifact` contract,
same quality gate, same approval flow. The quality gate becomes even more important
as generation gets more powerful.
