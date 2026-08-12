# CEO Chief-of-Staff — Operating Brief & Weekly Loop (v1)

> **This document adds the *operating loop* on top of the existing mandate.** It does
> **not** replace `AGENT_SPEC.md` (the mandate / system prompt / autonomy rules) and it
> introduces **no new tables or directories**. Memory, tasks, and messages live in the
> Agent Operating System tables that already exist
> (`supabase/migrations/20260610130000_agent_operating_system.sql`). Read the platform
> canon in `/docs/standards` first.

---

## 0. Single sources of truth (do not duplicate these)

| Concern | Canonical home | Never recreate as |
|---|---|---|
| Mandate / system prompt / autonomy | `docs/agents/ceo-chief-of-staff/AGENT_SPEC.md` | a second brief |
| Agent memory (state, last work, evidence) | **`aos_agent_memory`** table | a `memory.md` file |
| Tasks (owner, status, priority, deps) | **`aos_tasks`** table | a `tasks.md` file |
| Agent ↔ agent / CEO comms | **`aos_messages`** table | ad-hoc notes |
| Live numbers (read-only aggregation) | `src/services/ceo/ceoStatus.ts` | hand-typed metrics |
| CEO dashboard (human view) | `CeoTruthDashboard.tsx` + Revenue/Marketing/Admissions/Journey Truth pages | a new dashboard |
| Daily executive report | `agent_reports` (+ `daily_report.schema.json`) | a new report store |
| Strategy / non-negotiables | `docs/standards/{NORTH_STAR,ARCHITECTURE_PRINCIPLE,COMPETENCY_TAXONOMY}.md` | a restated copy |

If a needed structure already exists above, **extend it** — do not fork it. (Lesson from
PR #83: a parallel asset/structure creates two sources of truth and is rejected.)

---

## 1. Operating model (binding)

```
CLAIM → EVIDENCE → CLASSIFICATION → PRIORITY → WORK
```

Every status is one of **PROVEN · HYPOTHESIS · BROKEN**, and carries evidence
(`file:line`, command output, migration name, or a screenshot in the evidence walk).

**Rules (non-negotiable):**
- No blocker without evidence.
- No hypothesis treated as fact.
- No estimate before validation.
- No work without ownership.
- No launch without proof.
- **Evidence before artifacts** — do not build scaffolding/dashboards ahead of the data
  that would fill them.
- **Honesty contract** (from `AGENT_SPEC.md §3`): never fabricate a number; a missing
  source is reported as `0` + a `notes` gap. A gap is information, not a failure.

---

## 2. Session protocol (every agent run, every cell)

1. **Read the mandate** — the cell's `AGENT_SPEC.md`.
2. **Read memory** — latest `aos_agent_memory` rows for this `agent_slug`
   (importance-ordered).
3. **Read tasks** — open `aos_tasks` where `assigned_agent = <slug>` and
   `status IN ('pending','ready','in_progress','blocked')`.
4. **Do the work** — within the autonomy boundaries in `AGENT_SPEC.md §9`.
5. **Write memory** — append an `aos_agent_memory` row: what was done, the result, and
   the **evidence** (`file:line` / output / screenshot path).
6. **Update tasks** — set `aos_tasks.status`, `result`, timestamps; open any follow-up
   tasks (with `created_by_agent`, `priority`, `depends_on`).

> Founder-facing surfaces are append-only and gated: anything in `AGENT_SPEC.md §9`
> "requires Didier's approval" (send email/DM, publish, pricing, student records, delete,
> push to prod, charge/refund) is **never** auto-executed — it is written as a task/message
> for approval.

---

## 3. Weekly cadence

**Monday — frame the week (CEO agent):**
- Post last week's live numbers from `ceoStatus.getCEOStatus()` + a one-line **R/Y/G** per
  domain (the 9 scorecards in §4), each linked to evidence.
- Each cell reads the dashboard and writes **3–5** priorities for the week into `aos_tasks`
  (`assigned_agent = <slug>`, `priority`, `payload.evidence_required`).

**During the week — execute:**
- Agents work from `aos_tasks`; on each unit of work, append to `aos_agent_memory` with
  evidence and any new numbers; flip task `status`.

**Friday — close the week (CEO agent):**
- Read all cells' latest `aos_agent_memory`, refresh the CEO dashboard, and post a 1-page
  summary: **what moved · what stayed stuck · where to focus next week** — facts separated
  from recommendations, top 3 CEO actions named (`AGENT_SPEC.md §2`).

---

## 4. The 9 scorecards → data sources → current evidence status

R/Y/G is set **only** from evidence; "no data yet" is **⚠️ HYPOTHESIS**, never green.

| # | Scorecard | Live source | Status (2026-06-23 audit) |
|---|---|---|---|
| 1 | Website / Public | Vercel build + `Index.tsx` surfaces | ⚠️ structure PROVEN, polish/mobile unverified |
| 2 | Translation | `LanguageContext` + sessions by UI lang | ✅ EN/FR/ES UI; ❌ AI-tutor localization (6/7 English-only) |
| 3 | Programs (flagships) | `courses/chapters/quizzes` + seed fns | ⚠️ 2 of 4 authored (Scrum, BA); BA sim not built |
| 4 | Assessments | `quiz_attempts` pass/fail | ⚠️ unverified end-to-end |
| 5 | Simulations / Projects | `scrum_simulations` (live); BA = blueprint | ⚠️ Scrum only |
| 6 | Employer Alignment | `placement-authority` cell + employer/placement tables | ❌ not built — **North Star metric** (employment proof); highest strategic gap |
| 7 | Payments | `create-checkout` / `handle-payment-webhook` + `subscriptions` | ⚠️ code merged (#81), **not deployed**, E2E unproven |
| 8 | Founder Control | `aos_*` + `ceoStatus` + RLS (`aos_is_admin`) | ✅ role separation client+server |
| 9 | Marketing | email subscribers · enrollment-page traffic · signups | ❌ not measured (RPCs not installed) |

> Revenue/Marketing/Admissions/Journey dashboards already render **honest "not measured"**
> states; they light up when (a) the two payment functions are deployed, (b) students flow,
> and (c) the founder analytics RPC migrations are applied. The OS is built — it is
> **data-starved, not structure-starved.**

---

## 5. Initial CEO tasks

Seeded from the 2026-06-23 evidence audit (Top-10 actions) into `aos_tasks` — delivered as
a **reviewable, paste-ready** SQL block in `initial_tasks.seed.sql` (this folder). Per repo
canon, **the founder applies it by hand in Supabase**; Claude Code does not auto-apply SQL.
It requires the AOS migration (`aos_tasks`) to be applied first, and should be followed by
the verification `SELECT` included in that file.

The single highest-leverage chain remains: **deploy the two payment functions → walk the
Founder Validation Runbook → convert payment/completion/certificate from HYPOTHESIS to
fact.** No new scaffolding outranks that.
