# CLAUDE.md — Aladiah repo

## Read before doing anything

This repository is governed by the **Aladiah platform canon** in `/docs/standards`.
Read these three documents at the start of every session, in order, and treat them as
binding:

1. **`/docs/standards/NORTH_STAR.md`** — why Aladiah exists. The goal is career
   transformation, not course completion. Orders what to build *now*.
2. **`/docs/standards/ARCHITECTURE_PRINCIPLE.md`** — what qualifies to be built. Every
   feature must serve ≥ 1 Core System and block 0 Core Systems. Run this test before
   building anything.
3. **`/docs/standards/COMPETENCY_TAXONOMY.md`** — the only approved source of competency
   slugs. Never invent slugs elsewhere; never rename an existing slug.

If a request conflicts with the canon, surface the conflict before proceeding.

## Working rules (non-negotiable)

- No `.env` or live-DB writes without explicit approval.
- Production SQL is delivered as a reviewable file + paste-ready block; the human applies
  it by hand in Supabase. Claude Code does not auto-apply SQL.
- "Success / no rows" means the statement *ran*, not that it was *correct* — always follow
  a write with a verification `SELECT`.
- Verify structure before content; build before deploy.
- One discrete change at a time, verified. `/clear` between workstreams.
- Competency must be populated at insert time (never `null`) — competency is snapshotted
  onto attempt rows at submit and cannot be backfilled into past attempts.

## Repo facts

- Frontend: React/TypeScript/Vite on Vercel. Backend: Supabase (project
  `vgujnkxylipfwmkpwzvb`) + Railway (Node/Express).
- Build is `vite build` (esbuild, no `tsc`); `tsconfig.app.json` has `strict: false`.
- Quiz UI auto-prefixes `A)/B)/C)/D)` via `String.fromCharCode(65 + idx)` — never hardcode
  letter prefixes into option text.
