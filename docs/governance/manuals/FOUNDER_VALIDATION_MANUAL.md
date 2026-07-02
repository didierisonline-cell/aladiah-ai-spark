# Founder Validation Manual

**Status: DRAFT v0.1 — consolidates the former `FOUNDER_VALIDATION_RUNBOOK.md`
and `VALIDATION_PLAYBOOK.md` into one governance manual.** The walks themselves
live as chapters under `validation-walks/` (migrated intact — their SQL and
checklists are proven artifacts, not rewritten).

## The doctrine (shared by every walk)

Derived from `LAUNCH_DECISION_PRINCIPLE.md` (ratified) — these rules bind every
validation session:

1. **Founder walks it, live.** No feature, migration, or program is "done"
   because code merged — it is done when the founder walks the path on the
   live system and it works.
2. **"Success / no rows" means the statement ran, not that it was correct.**
   Every SQL apply is followed by its verification `SELECT`.
3. **Claude never auto-applies SQL.** Migrations are founder-applied by hand,
   in order, in the Supabase SQL editor.
4. **Every failure becomes a `BLK-###`** in the blocker log with symptom,
   screen/route, and evidence — then flows to
   `LAUNCH_COMMAND_CENTER.md` (this directory), the permanent registry.
5. **Go/No-Go is explicit.** A walk ends with a marked decision and a reason,
   never with silence.

## The walks (chapters)

| Chapter | Scope | When to run |
|---|---|---|
| [`validation-walks/ba-flagship-walk.md`](validation-walks/ba-flagship-walk.md) | The full student journey: migrations → Enroll → Learn → Pass → Capstone → Approval → Certificate → go-live | Before publishing the BA flagship; template for every future program launch |
| [`validation-walks/founder-portal-walk.md`](validation-walks/founder-portal-walk.md) | Founder Portal + quiz-question workflow: migrations, edge-function redeploys, RLS proofs, per-route checks, student isolation | After changes to the founder surfaces or question pipeline |

New walks are added as chapters here, follow the doctrine above, and get a
registry entry before they bind anyone.

## Relationship to other governance

- Blockers found → `LAUNCH_COMMAND_CENTER.md` (permanent, evidence-closed).
- Ratification of walked features → `../constitution/ratification.md`.
- The cockpit work-order pipeline is the machine-side mirror of this manual:
  walks produce evidence; evidence gates approvals.
