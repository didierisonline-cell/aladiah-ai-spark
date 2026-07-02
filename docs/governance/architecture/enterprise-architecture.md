# Aladiah Enterprise Architecture

**Status: DRAFT — v0.1.** Composes the verified architecture facts into one
whole-system view. Sources prevail until ratification: `docs/architecture/
SHELL_ARCHITECTURE.md`, `docs/agents/AGENT_OPERATING_SYSTEM.md`, repo
`CLAUDE.md`.

## The layers (as built, evidence: the repo)

```
┌──────────────────────────────────────────────────────────────┐
│ EXPERIENCE      React/TypeScript/Vite on Vercel               │
│                 /portal (students) · /founder + /admin        │
│                 (founder-only, FounderRoute + RLS backstop)   │
├──────────────────────────────────────────────────────────────┤
│ OPERATING       AOS (13 subsystems, aos_* tables):            │
│ SYSTEM          registry · memory · tasks · orchestrator ·    │
│                 logs · permissions · health · comms · work    │
│                 orders · orchestration · brain · event bus ·  │
│                 intelligence — client-side, admin-session,    │
│                 founder-gated writes                          │
├──────────────────────────────────────────────────────────────┤
│ PRODUCT DATA    Supabase (project vgujnkxylipfwmkpwzvb):      │
│                 courses/chapters/videos/quizzes/attempts ·    │
│                 competency snapshots · subscriptions ·        │
│                 per-agent domain tables — RLS everywhere      │
├──────────────────────────────────────────────────────────────┤
│ SERVICES        Railway (Node/Express) · Supabase edge        │
│                 functions (ai-proxy, webhooks) · Stripe       │
└──────────────────────────────────────────────────────────────┘
```

## Governing constraints (inherited, ratified)

- Build: `vite build` (esbuild, no tsc); tests: vitest.
- Production SQL is founder-applied by hand; nothing auto-applies.
- No `.env` or live-DB writes without approval; RLS is never bypassed.
- The AOS writes only to `aos_*`; product data is read-only to agents.
- The five Core Systems order all priorities (ARCHITECTURE_PRINCIPLE).

## Known architectural debts (declared, not hidden)

1. **Client-side AOS execution** — agents run in the founder's browser under
   the admin session; unattended autonomy requires the Phase-2 edge-function
   scheduler.
2. **Cockpit query fan-out** (~60–70 queries per load) — needs an RPC/view
   consolidation before multi-admin use.
3. **`aos_messages` retention** — append-only and unbounded; needs a policy
   before scheduled runs multiply volume.
4. **Loose-typed `db` handle** — `aos_*` tables absent from generated Supabase
   types.

## To ratify this document

Per `ratification.md`, ratification requires evidence the description matches
the system. The layer map above is verifiable today; ratify after the founder
walk confirms it, or amend where reality disagrees.
