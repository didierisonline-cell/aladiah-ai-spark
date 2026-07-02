# M07 — Work Order & Execution Management Manual

**Version 1.0 · DRAFT — at step 5 (Founder Review) of the Permanent
Management Rule, under WO-0007 (self-referential: this manual governs the
instrument that produced it).** Registry key: `m07-work-order-execution` ·
Genome: `playbook:m07-work-order-execution`.

## 0. The Five Questions (Engineering Law)

1. **Why?** So every institutional change travels one governed road — opened
   with purpose, gated by evidence, decided by authority, measured by
   outcome, remembered forever (Covenant Art. III, IV; Constitution Art. V).
2. **Which authority?** Constitution Art. V (Governance of Change) → AMS →
   this manual; the Five Questions law (FD-2026-013) binds every order.
3. **Which existing capability does it extend?** The work-order engine
   (typed orders, four gates, evidence-gated approval, completion, impact
   measurement — running and tested) plus the WO-#### executive series;
   codified, nothing parallel.
4. **What evidence proves it works?** Six ratified manuals produced through
   it; evidence-integrity 100% by construction; every order's full audit
   trail reconstructable from the Event Bus.
5. **How does the Brain learn?** Every decision, completion, impact
   measurement, and lesson is Brain-recorded; stuck-order post-mortems feed
   the 90-day cycle.

## 1. Institutional Metadata

| Field | Value |
|---|---|
| **Title** | Work Order & Execution Management Manual |
| **Accession** | M07 (permanent) |
| **Purpose** | The one governed road for institutional change: how work is opened, gated, decided, executed, completed, measured, and learned from. |
| **Version / Status** | 1.0 · Draft — Permanent Rule steps 1–4 complete, step 5 in progress |
| **Authority Level** | operational |
| **Owner** | ceo-chief-of-staff |
| **Governing canon** | Constitution Art. V · Five Questions law · LAUNCH_DECISION_PRINCIPLE · AMS v1.1 |
| **Related manuals** | M01 (the decision seat) · M02 (governance view of WOs) · M08 Quality (pending) |
| **Review cadence** | 90 days upon ratification |
| **Ratification status** | Pending Founder Ratification (step 6) |

**Lifecycle record:** 1 Draft ✅ · 2 Engineering Review ✅ (every procedure
maps to the running engine; six ratified manuals as operating evidence) ·
3 QA Review ✅ (entry/exit conditions; 5 KPIs; 85/85 green on main) ·
4 Brain Review ✅ (precedent: gate order, evidence rule, dedup, quarantine,
Five Questions — none contradicted) · 5 Founder Review ⏳ this presentation.

## 2. Mission Link

Covenant Art. III (*Excellence* — "every decision should reflect our pursuit
of excellence") and Art. IV (*Integrity* — actions over claims). The work
order is where excellence and integrity become procedure: no change without
purpose, no approval without evidence, no completion without measurement.

## 3. Scope & Reference Model

**Governs:** all work orders — runtime orders (the engine) and executive
orders (WO-#### series) — from opening through learning. **Does not govern:**
what the work produces (domain manuals) or who decides (M01).

```
OPEN (Five Questions + authorizing directive)
  → GATES (QA → Security → Translation → UX, as typed)
  → FOUNDER DECISION (evidence-gated; EvidenceRequiredError otherwise)
  → EXECUTE (through the owner's gated surface only)
  → COMPLETE (dependents resolve) → MEASURE IMPACT (vs. own success metrics)
  → LEARN (lesson → Brain) — every arrow on the Event Bus
```

## 4. Definitions

**Runtime order** — an `aos_tasks` work order (typed, gated, evidence-carrying).
**Executive order (WO-####)** — a founder-issued order of record, accessioned
via its directive; may spawn runtime orders. **Stuck order** — past both its
review cadence and its gate reviewer's cadence without transition.
**Impact measurement** — the recorded outcome against the order's own
success metrics (positive/neutral/negative + evidence).

## 5. Roles, Authorities & Governance Matrix (RACI)

| Activity | Founder | ceo-chief-of-staff | qa-authority | Gate reviewers | Owner dept. |
|---|---|---|---|---|---|
| Open (runtime) | A (or delegate) | R (routes) | I | I | **R** |
| Open (WO-#### executive) | **A/R** | R (accession) | I | I | I |
| Gate review | A (ungated gates) | C | **R** (QA) | **R** (UX: interface-experience) | I |
| Approval | **A/R** (evidence-gated) | C | C | C | I |
| Execution | I | C | C | I | **R** |
| Completion + impact | A (reads) | C | C | I | **R** |
| Stuck-order escalation | **A** | **R** (detect) | C | C | R |

## 6. Operating Procedures

**P1 — Open.** Entry: the Five Questions answered + authorizing directive
cited (directive-traceability KPI) + M03 P4 anti-duplication check. Typed
(type sets gates), owned (one owner; read-only owners → recommendations
only, machine-enforced), acceptance criteria stated. Exit: order visible on
the board, first gate routed.

**P2 — Gates.** Canonical order QA → Security → Translation → UX; reviewers
per charter (QA: qa-authority; UX: interface-experience; Security &
Translation: founder-reviewed on their surfaces via CEO alert). A failed
gate bounces to the owner with findings — failure is workflow, not shame
(Covenant Art. II). Gate outcomes carry evidence notes; all emit events.

**P3 — Founder decision.** Per M01 P2 (the Decision Seat): evidence present
or approval impossible (machine rule); decisions recorded to order + Brain +
Event Bus; rejection returns with notes, never silently.

**P4 — Execute.** Only through the owner's founder-gated surface; the order
records evidence as work proceeds; scope change = amendment (MAJOR reopens
gates that the change touches).

**P5 — Complete & measure.** Completion resolves dependents; approved orders
close only through completion; **impact measurement is mandatory before the
learning loop closes** — the cockpit queues completed-unmeasured orders;
outcomes and lessons Brain-recorded (M04 P3).

**P6 — Dependencies.** Declared at opening; blocked orders start blocked and
release automatically on dependency completion (engine behavior); circular
dependencies are impossible by construction (acyclic checks).

**P7 — Stuck orders.** Detection: age vs. cadence per state (CEO agent
watch). Route: owner nudge → gate-reviewer escalation → founder decision
seat (M01 P5). Post-mortem for any order stuck twice: the blockage is
studied, not just cleared.

**P8 — The executive series (WO-####).** Founder-issued; accessioned with
its directive; numbers permanent and sequential; each closes with a
presentation for Founder Review (this document is WO-0007 closing itself).

## 7. Quality Gates & Standards

Machine-enforced today: typed gates per order type · evidence-gated approval
(`EvidenceRequiredError`) · read-only ownership limits (`PermissionError`) ·
dedup on open (sweeps idempotent) · gate order canonical · quarantine on
ungoverned production writers. Standard: **work that bypasses the road does
not exist institutionally** — and the road is one road (no parallel change
paths; the Founder Doctrine applied to process).

## 8. KPI Dictionary

| KPI | Formula | Target | Owner | Cadence | Source |
|---|---|---|---|---|---|
| Evidence integrity | approvals with evidence ÷ all | 100% (construction) | qa-authority | continuous | engine telemetry |
| Directive traceability | orders citing authorizing directive ÷ new orders | 100% | ceo-chief-of-staff | weekly | order payloads |
| Cycle time | open → founder decision (median) | founder-set pending | ceo-chief-of-staff | weekly | event bus |
| Impact-measurement completion | completed orders with impact recorded ÷ completed | 100% | owner depts. | monthly | brain records |
| Stuck-order rate | orders past cadence ÷ open | ≤5% | ceo-chief-of-staff | weekly | board ages |

## 9. Dashboard Specification

Primary: **Work Order board** (`/founder`) — create, gates, evidence trail,
decisions, completion; the approval queue integration; the
completed-unmeasured queue (Intelligence panel). Gaps registered: cycle-time
and stuck-order tiles absent (first-cycle work orders).

## 10. AI Workforce Binding

`ceo-chief-of-staff` **operates** (routing, series accession, stuck-watch).
`qa-authority` + `interface-experience` **review** their gates. All
departments **execute** as owners. The founder **decides** — the one
authority no order routes around.

## 11. Risk & Escalation Model

| Risk | L/I | Control | Escalation |
|---|---|---|---|
| Road bypass (change outside the engine) | low/critical | V5 gate-declaration + shadow-factory precedent + audits | discovery = critical governance incident |
| Founder queue saturation | expected/medium | cycle-time KPI + M01 P7 queueing | weekly trend |
| Gate rubber-stamping | medium/high | evidence notes mandatory; M02 practice audits sample gate quality | QA finding |
| Measurement skipped after completion | medium/medium | P5 mandatory rule + cockpit queue | monthly KPI breach |
| Executive-series drift (unnumbered/unaccessioned orders) | low/medium | P8 + directive-accession KPI (M02) | governance finding |

## 12. Company Brain Integration

Writes: every decision, completion, impact, lesson, stuck post-mortem.
Reads: P1's anti-duplication recall; P3's precedent rule (M01 §12). The
work-order history IS the Institution's execution memory — how it built
itself, order by order, with evidence.

## 13. Continuous Improvement Cycle

90-day reviews ingest: cycle-time trends, stuck post-mortems, gate-quality
samples, measurement-completion gaps. First-cycle candidates (honest): the
two dashboard tiles, cycle-time wiring, and gate-reviewer cadences for the
founder-reviewed gates.

**Improvement Log (append-only):**
| Date | Lesson | Change |
|---|---|---|
| — | *(first entries after first review cycle)* | — |

## 14. Appendices

**A. Genome:** `playbook:m07-work-order-execution`.
**B. Authorizing instruments:** WO-0007 (via the Master Operating Order,
Priority B) · FD-2026-013 (Five Questions) · Constitution Art. V.
**C. Machinery inventory (evidence):** workOrders.ts (typed orders, gates,
evidence, dedup), orchestration.ts (routing, evidence-gated decisions,
completion), impact measurement + lesson recording, the board + approval
queue + unmeasured queue, event-bus audit trails, 6 ratified manuals
produced through this exact machinery — all running; 85/85 tests on main.
