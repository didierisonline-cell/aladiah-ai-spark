# THE ALADIAH OPERATING SYSTEM — v1.0

**Status: DRAFT v1.0 — design blueprint. No code until the founder ratifies the
design.** Registered in the Institutional Knowledge registry. Parent:
the Constitution. This document designs the living institution; it does not
implement it.

---

## Design philosophy — what we took from each

| From | We take | It becomes |
|---|---|---|
| **Apple** | Ruthless information hierarchy — one glance, one truth; nothing on screen that doesn't earn its place | The 60-Second Rule and the five-zone cockpit |
| **Amazon** | Single-threaded owners; metrics nobody owns don't exist; working backwards from the customer outcome | Every score has exactly one owning department and a definition written before the widget |
| **Stripe** | The system IS the API — every number a typed, versioned contract; documentation as product | The Score Contract: every score is a typed interface with formula, source, basis, and staleness |
| **NASA** | Flight rules written before launch; go/no-go polls; telemetry over opinion; nothing flies untested | Gates as flight rules, the Event Bus as telemetry, the drift check as pre-flight |
| **A university** | Faculties with academic freedom inside ratified standards; a registrar that never forgets; tenure earned by review | Departments free to recommend, bound by canon; the Brain as registrar; ratification as tenure |

**Combined into something better:** none of those institutions makes *evidence*
the physical substrate of authority. Aladiah does: a claim without evidence
cannot become a finding, a finding cannot skip a gate, a decision cannot skip
the founder, and nothing that happened can be unremembered.

---

## The seven levels

```
L1 CONSTITUTION            supreme authority — everything derives from it
L2 FOUNDER STANDARDS       how every decision is made (operational law)
L3 ENTERPRISE ARCHITECTURE departments · workflows · owners · I/O · dependencies
L4 INTELLIGENCE ARCH.      agents · findings · confidence · approval chains
L5 COMPANY BRAIN           everything important, remembered forever
L6 EXECUTION SYSTEM        work in → gates → founder → shipped → measured
L7 FOUNDER DASHBOARD       the whole institution, understood in 60 seconds
```

Authority flows DOWN (L1→L7). Evidence flows UP (L7→L1): telemetry feeds
scores, scores feed briefs, briefs feed decisions, decisions feed the
Constitution's amendment history.

### L1 — The Constitution *(exists: draft v0.1, awaiting ratification)*
The eight articles composed from ratified canon. Nothing below may contradict
it. Amendment only through the ratification lifecycle.

### L2 — The Founder Standards *(to be drafted — the one missing document)*
The operational interpretation of the Constitution: how decisions are made
day-to-day. Contents (working backwards from decisions actually made this
quarter): the evidence bar per decision class · who may decide what without
the founder · time-boxes for review states · the writing standard (honest
metrics, no fabrication, plain language) · the definition of "done" (walked
live, measured, remembered). Drafted FROM the Brain's `founder-decision` and
`governance-record` entries — codified precedent, not invented policy.

### L3 — Enterprise Architecture *(exists: draft v0.1 — to be completed per this design)*
The complete department matrix. For each of the 12 departments:
**responsibility · owner (agent) · human escalation (founder) · inputs
(tables/events consumed) · outputs (tables/artifacts produced) · dependencies
(upstream departments) · workflows (its runner cycles + gate roles)**. The
matrix is derivable from code today (bootstrap registry + domain tables +
GATE_REVIEWERS) and must be written into the document so the org chart and the
codebase can never diverge — the drift check extends to verify it.

### L4 — Intelligence Architecture *(exists: v1.0 in review — ten components, tested)*
Already operational: observers → evidence-gated findings → confidence-scored
recommendations → deduplicated work orders → approval chains. v1.1 additions
designed here: per-department cadences replacing the flat 24h staleness, and
decision-path records (which finding → which order → which decision → which
impact) queryable end-to-end from the Brain.

### L5 — The Company Brain *(exists: 11 categories — completeness rules added here)*
The registrar. Design rule — **the Remember Invariant**: every event class
below MUST produce a Brain record, enforced in the layer that performs it:
ratifications (`governance-record`) · founder decisions (`founder-decision`) ·
deployments & launches (new `deployment-record` category, written when the
founder marks a deploy walked) · curriculum changes (audit trail already in
`curriculum_audits`, mirrored on approval) · impact measurements · readiness
history · executive reports. Meetings: founder records minutes as
`founder-decision` entries — the cockpit Brain panel is the notebook.

### L6 — The Execution System *(exists and tested — this design adds nothing but names it)*
```
Work enters   → work order (typed, owned, acceptance criteria)
Gates validate→ QA → Security → Translation → UX  (flight rules)
Founder decides→ evidence-gated approval (recorded, never silent)
Work ships    → through the owner's founder-gated surface only
Brain remembers→ impact measured against the order's own success metrics
Dashboard reports→ scores + briefs recompute from the same live sources
```

### L7 — The Founder Dashboard v2 *(designed below — the build after ratification)*

---

## Founder Dashboard v2 — the 60-Second Cockpit

**The 60-Second Rule (design constraint, Apple discipline):** the founder must
be able to answer, in order, within 60 seconds, without clicking:
1. *Is anything on fire?* (0–5s)
2. *Can we launch?* (5–15s)
3. *Is the business alive?* (15–30s)
4. *Is the workforce working?* (30–45s)
5. *What needs ME today?* (45–60s)

Five zones, one screen, strict information budget (≤ 40 numbers above the fold):

```
┌─ ZONE 1 · PULSE ────────────────────────────────────────────────┐
│  COMPANY HEALTH ██ 74   Readiness 68%▲2   Gates: S●GO Q●GO T●NO │
│  🔴 2 critical blockers        (red strip ONLY when nonzero)     │
├─ ZONE 2 · SCORECARDS (12 tiles, uniform contract) ──────────────┤
│  Security 92● · Curriculum 81● · Translation 100● · Infra 95●   │
│  AI Fleet 88● · StudentSuccess 61◐ · Financial 45◐ · UX 78◑     │
│  Risk 71● · Placement —○ · Marketing —○ · Readiness 68●         │
│  (● measured ◐ partial ◑ posture ○ unmeasured — never faked)    │
├─ ZONE 3 · NEEDS THE FOUNDER ────────────────────────────────────┤
│  Approvals (n) · Gate reviews (n) · Reviews due (n) · BLK open  │
├─ ZONE 4 · THE WORKFORCE ────────────────────────────────────────┤
│  14 agents: health dots + current task, one line each           │
├─ ZONE 5 · TODAY'S BRIEF ────────────────────────────────────────┤
│  Latest Daily Founder Brief inline · older briefs one click     │
└─────────────────────────────────────────────────────────────────┘
```

Everything currently on the cockpit (work orders, brain, event bus,
intelligence, governance, briefings) remains — **below the fold**, reached by
scrolling, never competing with the 60-second read. v2 is a re-composition of
proven panels plus the score engine; it is not a rebuild.

---

## The Score System — one contract, thirteen instances

**The Score Contract (Stripe discipline)** — every score is:

```ts
interface DomainScore {
  key: string;            // stable identifier
  score: number | null;   // 0–100; null = unmeasured, shown as —, never 0
  basis: 'measured' | 'partial' | 'posture' | 'unmeasured';
  formula: string;        // human-readable, versioned in this document
  source: string;         // the live tables/services it reads
  owner: string;          // the single-threaded owning department
  asOf: string;           // staleness is visible, always
}
```

| # | Score | Formula (v1) | Source (live today?) | Owner |
|---|---|---|---|---|
| 4 | **Company Health** | Weighted mean of scored domains below; weights: Security .15, Curriculum .15, StudentSuccess .15, Infrastructure .10, Financial .10, Translation .10, AI Fleet .10, UX .05, Risk .05, Marketing .025, Placement .025 — **coverage % always displayed** | composite | analytics-intelligence |
| 5 | Readiness | existing 13-dimension measured-only score + trend | ✅ cockpit engine | analytics-intelligence |
| 6 | Risk | 100 − (25·criticals + 10·NO-GO gates + 5·high findings + 5·subscription risks), floor 0 | ✅ derivable now | operations-platform |
| 7 | Security | posture weighted sections (existing) | ✅ securityPosture | operations-platform |
| 8 | Curriculum | academyReadiness (existing live counts) | ✅ readiness service | curriculum-excellence |
| 9 | Translation | flagship non-EN coverage % (existing probe); v2 adds UI-string coverage | ✅ partial | curriculum-excellence |
| 10 | Student Success | v1: quiz pass-rate × completion presence (live attempts); v2: Career Transformation Score per canon | ◐ quiz_attempts live | student-success |
| 11 | Placement | unmeasured until placements exist — pipeline evidence shown, no invented score | ○ honest | placement-authority |
| 12 | Marketing | unmeasured until attribution flows — pipeline evidence shown | ○ honest | marketing-content |
| 13 | Infrastructure | operational components % + DB latency band (ops engine) | ✅ ops_status | operations-platform |
| 14 | AI Agent Health | fleet mean performance × active share (existing) | ✅ health service | operations-platform |
| 15 | Financial | v1: MRR level + subscription-risk penalty + payment-gate status; v2: Stripe-webhook truth (revenue, churn, LTV) | ◐ honest partial | ceo-chief-of-staff |
| — | UX / Accessibility | uxPosture weighted sections (existing) | ✅ posture | interface-experience |

**Honesty invariants (constitutional):** an unmeasured domain shows `—`, never
0 or 100; Company Health always shows its coverage ("74 · from 9 of 12
domains"); every tile links to its evidence; personas never carry fabricated
operational scores.

---

## The Reporting Bureau — five cadences

Built on the existing briefing engine (compiled from live state, stored in the
Brain, staleness-tracked). Each cadence has an audience and a fixed spine:

| # | Report | Audience | Spine (working backwards from the reader) |
|---|---|---|---|
| 16 | **Daily Founder Brief** | Founder, 90 seconds | Pulse deltas · new criticals · decisions waiting · yesterday's workforce output · one number that moved |
| 17 | **Weekly Founder Brief** | Founder, 5 minutes | Score movements w/ causes · governance throughput (opened/gated/approved/shipped/measured) · intelligence highlights · next week's due reviews |
| 18 | **Monthly Board Report** | Board-grade record | Financials (honest: MRR, risks, coverage gaps) · Company Health trend · launch readiness vs. plan · strategic gaps · decisions made + evidence |
| 19 | **Quarterly Strategic Review** | Founder + Brain | Top recommendations by confidence · dimension trends · canon review-due sweep · roadmap proposal as draft work orders |
| 20 | **Annual State of Aladiah** | The institution | The year in decisions (from the Brain) · scores year-over-year · every launch · every ratification · the mission test: are students more employable? |

All five: generated from the same live sources as the cockpit — a report can
never disagree with the dashboard. Annual adds a new `annual` period to the
existing engine.

---

## Build plan (after ratification — each phase through the governance pipeline)

| Phase | Delivers | Size |
|---|---|---|
| **P5.1 Score Engine** | `scores.ts` implementing the Score Contract + 13 instances + tests; consolidated cockpit RPC (kills the query fan-out debt) | M |
| **P5.2 Cockpit v2** | Five-zone recomposition of existing panels + scorecard tiles | M |
| **P5.3 Reporting Bureau** | Monthly board + annual formats; brief spines per this design | S |
| **P5.4 Brain Completeness** | `deployment-record` category + Remember-Invariant enforcement + decision-path query | S |
| **P5.5 Enterprise Matrix** | L3 department matrix written + drift-checked against bootstrap | S |
| **P5.6 Founder Standards** | Drafted from Brain precedent — the L2 document (founder writes, Claude compiles) | Founder-led |

Every phase: tests, build, lint, founder review — per the Execution System it
lives inside.

---

*Designed 2026-07-01. Awaiting founder ratification of the design before any
implementation begins (Article II: no work without a decision; Article VIII:
this document gains authority only through the lifecycle).*
