# M02 — Governance Operations Manual

**Version 1.0 · DRAFT — at step 5 (Founder Review) of the Permanent
Management Rule, under WO-0002.** Inherits the M01 gold-standard structure —
only content changes. Registry key: `m02-governance-operations` · Genome:
`playbook:m02-governance-operations`.

## 1. Institutional Metadata

| Field | Value |
|---|---|
| **Title** | Governance Operations Manual |
| **Accession** | M02 (permanent) |
| **Purpose** | How governance is executed throughout the Institution: the lifecycles of documents, policies, and standards; directives; work orders; engineering decisions; constitutional amendments; audits; and the machinery that enforces all of it. |
| **Version / Status** | 1.0 · Draft — Permanent Rule steps 1–4 complete (below), step 5 in progress |
| **Authority Level** | operational |
| **Owner** | founder (Governance) · Operating agent: `operations-platform` (Registrar) |
| **Governing canon** | Covenant · Constitution · Ratification Process · Capability Genome Standard · AMS Framework v1.1 (Permanent Management Rule) |
| **Related manuals** | M01 Executive Office (decision seat) · M03 Registry & Genome Ops · M07 Work Orders |
| **Review cadence** | 90 days upon ratification |
| **Ratification status** | Pending Founder Ratification (step 6) |

**Lifecycle record (Permanent Rule):**
| Step | Status | Evidence |
|---|---|---|
| 1 Draft | ✅ 2026-07-02 | this document, genome-first |
| 2 Engineering Review | ✅ 2026-07-02 | conformance to M01 template §1–§14; canon citations verified; genome validates V1–V12 in CI |
| 3 QA Review | ✅ 2026-07-02 | procedures numbered with entry/exit conditions; 5 KPIs well-formed; structural tests green (85/85) |
| 4 Company Brain Review | ✅ 2026-07-02 | precedent cited throughout: ratification lifecycle, drift-check practice, FD-2026-004/010 decisions; no prior decision contradicted |
| 5 Founder Review | ⏳ this presentation | — |
| 6–8 | pending | — |

## 2. Mission Link

Governance operations serve Covenant Art. II (*Truth* — "We welcome
evidence"), Art. IV (*Integrity* — decisions recorded, trust protected
through actions), and Art. IX (*Stewardship* — every steward leaves the
Institution stronger). They protect the root Core System indirectly: nothing
ungoverned may corrupt competency data or any system downstream of it.

## 3. Scope & Reference Model

**Governs:** the execution of governance — every lifecycle transition, audit,
and enforcement mechanism. **Does not govern:** the content of decisions
(the Founder's), constitutional text (the Canon's), department internals
(their manuals).

```
INSTRUMENTS                    MACHINERY                       RECORDS
Founder Directives ──────┐   ┌─ Governance Registry (code) ──┐
Work Orders ─────────────┤   ├─ Drift Check (CI)             ├─→ git (reviewed)
Engineering Decisions ───┼──►├─ Genome validation V1–V12     ├─→ Registry
Policies & Standards ────┤   ├─ Permanent Rule (8 steps)     ├─→ Company Brain
Constitutional Amendments┘   └─ Evidence-gated approvals ────┘   Event Bus
```
One law spans the diagram: **the registry is the record** — a transition not
committed to the registry did not institutionally happen.

## 4. Definitions

**Lifecycle transition** — a status change under `ratification.md`
(Draft → Review → Ratified → Deprecated) or the Permanent Rule (manuals).
**Engineering Decision** — a technical choice with institutional consequence,
recorded in genome lineage (locus 31) and commit messages of record.
**Governance audit** — a systematic check that the registry matches reality.
**Drift** — any disagreement between registry, filesystem, and practice.

## 5. Roles, Authorities & Governance Matrix (RACI)

| Activity | Founder | operations-platform (Registrar) | analytics-intelligence | qa-authority | Owners |
|---|---|---|---|---|---|
| Document lifecycle transitions | **A** (ratify/deprecate) | **R** (commits) | C | C | R (draft/review) |
| Policy & standard lifecycle | **A** | R | C | **C** (gates) | R |
| Founder Directive accession | **A/R** (issues) | R (genome) | I | I | I |
| Work-order governance | **A** (approve) | C | C | R (gate) | R (execute) |
| Engineering decision records | I | **R** | C | C | R |
| Constitutional amendment | **A/R** (sole) | R (record) | I | I | I |
| Governance audits | **A** | **R** | C (findings) | C | C |
| Escalation (governance) | **A** | R | C | C | R (raise) |

## 6. Operating Procedures

**P1 — Governance document lifecycle.** Draft (owner; registered on arrival
or CI fails) → Review (owner submits; frozen except review edits) → Ratified
(Founder only; evidence required; `recordRatification()` + registry commit
+ changelog when constitutional) → Deprecated (Founder only; never deleted;
successor named). *Exit condition per step: the registry commit exists.*

**P2 — Policy & standard lifecycle.** As P1, plus: standards declare their
enforcing mechanism (test, gate, or review) before ratification — an
unenforceable standard returns to draft. Precedent: the Genome Standard
shipped with V1–V12 and CI enforcement on ratification day.

**P3 — Founder Directives.** Issued in writing → filed verbatim → accessioned
as `founder-directive` genome (same session) → cited by every work order it
authorizes (directive-accession KPI = 100%). Directives carry authority on
issuance; conflicts between directives escalate to the Founder, newest
prevailing until resolved.

**P4 — Work Orders (governance view).** WO-#### series; each cites its
authorizing directive; flows the gate pipeline; founder decisions
evidence-gated; completion requires impact measurement before the order may
close its improvement loop. (Execution detail: M07.)

**P5 — Engineering Decisions.** Consequential technical choices are recorded
where they live forever: the affected genome's `engineeringDecisions` locus +
the commit of record. A decision discoverable only in chat history is a
defect (this manual's own history is the precedent — every FD of this epoch
was accessioned retroactively on discovery of exactly that gap).

**P6 — Constitutional amendment.** Founder-only, per Constitution Art. VIII:
proposal → evidence → Founder decision → registry + changelog +
`recordRatification()` + Brain. Engineering may *submit* (Permanent Mission:
significant risk submission); engineering never *drafts doctrine* (Founding
Library rule).

**P7 — Escalation paths (governance).** Unregistered document discovered →
CI already red → Registrar fixes or registers within drift-MTTR. Silent
authority claim (unfiled directive, unratified standard cited as binding) →
governance finding → Founder. Registry/practice divergence → audit finding →
work order. Deadlocked review (past cadence twice) → Founder decision seat.

**P8 — Governance audits.** Continuous: the drift check on every CI run
(paths, parity, references, schedules, shelf integrity — 30+ assertions).
Quarterly: the Registrar's full audit — registry vs. practice (are owners
actually reviewing? are lessons feeding revisions?) — findings become work
orders. Annual: the State of Aladiah's governance chapter.

## 7. Quality Gates & Standards

A lifecycle transition is valid only with: the registry commit · the required
authority (founder for ratify/deprecate) · evidence in the history event ·
Brain record for founder decisions. Manuals additionally require the full
Permanent Rule (8 steps, no bypass). The gates are machinery, not policy:
unregistered governance docs, broken references, orphan shelves, and
hand-asserted maturity **fail CI today**.

## 8. KPI Dictionary

| KPI | Formula | Target | Owner | Cadence | Source |
|---|---|---|---|---|---|
| Governance health | slot coverage (40) + doc health (40) + ratified share (20) — computed | ≥90 steady-state | operations-platform | continuous | `getGovernanceHealth()` |
| Review currency | reviews on time ÷ due | ≥95% | founder | weekly | registry dates |
| Drift MTTR | CI red → green | ≤2 days | operations-platform | per incident | CI + Event Bus |
| Ratification latency | review-entry → founder decision | founder-set pending | founder | weekly | registry history |
| Directive accession | directives accessioned ÷ issued | 100% | ceo-chief-of-staff | per directive | founder-directive genomes |

## 9. Dashboard Specification

Primary: **Governance panel** (`/founder`) — headline four, full registry
with authority levels and review-due flags. Supporting: **Institution Strip**
(governance health number), **Institutional Registry panel** (policy-class
genomes), **Event Bus** (governance events). Gaps registered honestly:
ratification-latency and drift-MTTR have no tiles (follow-up work order
after ratification); the Governance Center full view awaits AIOS cockpit v2.

## 10. AI Workforce Binding

`operations-platform` **operates** (the Registrar: commits, audits, parity).
`analytics-intelligence` **stewards** (classification proposals as
confidence-scored findings; never auto-classifies). `qa-authority`
**reviews** (gates in the Permanent Rule and work-order pipeline). The
Founder is the sole ratifying authority — technically enforced by the absence
of any publish permission in the workforce.

## 11. Risk & Escalation Model

| Risk | L/I | Control | Escalation |
|---|---|---|---|
| Registry semantic drift (fields stale though paths valid) | medium/medium | quarterly Registrar audit (P8) | findings → work orders |
| Ratification bottleneck | expected/medium | latency KPI + M01 decision seat | weekly brief trend |
| CI enforcement gap (workflow uninstalled) | current/high | local `npm test` discipline; **standing founder action: one-paste install** | flagged since governance foundation |
| Governance theater (green metrics, dead practice) | low/high | P8 practice-audit dimension; lessons-feeding-revisions check | Founder review |
| Lost engineering decisions | was-high, now controlled | P5 rule + genome loci | audit finding |

## 12. Company Brain Integration

Writes: every ratification, deprecation, amendment (`governance-record`);
audit findings; lessons. Reads before acting: precedent on the same document
class (P6 of M01's precedent rule applies to governance itself). Sync
discipline: `syncGovernanceToBrain()` every founder session; the mirror-
freshness KPI belongs to M04 (Company Brain Manual) once authored.

## 13. Continuous Improvement Cycle

90-day reviews ingest: drift incidents (what escaped the checks?), audit
findings, ratification-latency trends, and lessons tagged to M02 scope.
Machinery improvements (new CI assertions, new audit dimensions) ride as
MINOR versions; lifecycle changes are MAJOR and founder-gated.

**Improvement Log (append-only):**
| Date | Lesson | Change |
|---|---|---|
| — | *(first entries after first review cycle)* | — |

## 14. Appendices

**A. Genome:** `playbook:m02-governance-operations`.
**B. Authorizing instruments:** WO-0002 · FD-2026-010 (Permanent Management
Rule; M01 precedent) · FD-2026-009 (AMS).
**C. Enforcement inventory (evidence):** governance drift check (paths,
schedules, shelf bijection, unregistered-doc scan, broken links) · genome
validation V1–V12 · single-root + spine tests · evidence-gated approvals —
all running in `npm test` today, 85/85.
