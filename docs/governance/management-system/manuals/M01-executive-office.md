# M01 — Executive Office Manual

**Version 1.0 · DRAFT — presented for Founder Review under WO-0001. The Gold
Standard: every remaining Management Manual inherits this structure.**
Registry key: `m01-executive-office` · Genome: `playbook:m01-executive-office`.

## 1. Institutional Metadata

| Field | Value |
|---|---|
| **Title** | Executive Office Manual |
| **Accession** | M01 (permanent) |
| **Purpose** | The operational blueprint for the Executive Office: how directives are issued, decisions made, ratifications recorded, approvals granted, briefings produced, escalations handled, and the Institution kept operable without daily Founder execution. |
| **Version / Status** | 1.0 · Draft (workflow: Draft → QA gate → Founder ratification) |
| **Authority Level** | operational (implements canon; never extends it) |
| **Owner** | founder (Executive Office) · Operating agent: `ceo-chief-of-staff` |
| **Governing canon** | Covenant · Constitution · Capability Genome Standard · Permanent Engineering Mission · AMS Framework |
| **Related manuals** | M02 Governance Ops · M07 Work Orders · (Founding Library shelf 14 — Founder's personal doctrine; referenced, never duplicated) |
| **Review cadence** | 90 days upon ratification; 14 days while draft |
| **Ratification status** | Pending Founder Review (this presentation) |

**Revision history:** 2026-07-02 · v1.0 · Authored under WO-0001 · by founder commission.
**Approval history:** QA structural conformance — template-complete (see §7); Founder decision pending.

## 2. Mission Link

The Executive Office exists so that every institutional decision honors the
Covenant (Preamble: "Every decision made within Aladiah shall honor these
principles") — specifically Art. II *Truth* (evidence before decisions),
Art. IV *Integrity* (decisions recorded, never silent), Art. IX *Stewardship*
(the office outlives its occupant), and Art. XIII *Our Commitment* (every
decision evaluated by the value created for those we serve). It serves all
five Core Systems by governing the pipeline through which anything reaches
them.

## 3. Scope & Reference Model *(Deliverable 1)*

**Governs:** founder directives · founder decisions and approvals ·
ratifications · executive briefings · escalations to the Founder · the
founder walk · executive continuity.
**Does not govern:** department-internal operations (their manuals), the
Founder's personal methods (shelf 14), constitutional content (the Canon).

```
                    ┌────────────────────────────────┐
                    │        EXECUTIVE OFFICE        │
                    │  Founder (constitutional       │
                    │  authority — decides, ratifies)│
                    │  CEO Chief of Staff (operates —│
                    │  briefs, routes, delegates)    │
                    └───────┬──────────────┬─────────┘
              directives &  │              │  briefings & escalations
              decisions DOWN▼              ▲UP evidence only
        ┌───────────────────────────┐  ┌───────────────────────────┐
        │ Work orders · gates ·     │  │ Daily brief · queue ages ·│
        │ ratifications · walks     │  │ criticals · KPI movements │
        └───────────────────────────┘  └───────────────────────────┘
                    all recorded in the Institutional Registry
                    and remembered by the Company Brain
```

## 4. Definitions

**Directive** — written founder instruction with standing authority (FD-###
or WO-#### series), accessioned as a `founder-directive` genome on issuance.
**Decision** — a founder approval/rejection/ratification with evidence,
recorded per the constitutional lifecycle.
**Escalation** — an item that must reach the Founder outside normal cadence.
**The Walk** — live-system validation performed by the Founder (Validation
Manual doctrine); the only act that converts hypothesis to proven.
**Executive continuity** — the Institution's ability to operate on standing
authority when the Founder is not executing daily.

## 5. Roles, Authorities & Governance Matrix (RACI) *(Deliverables 7, 12)*

| Activity | Founder | ceo-chief-of-staff | qa-authority | Dept. owners | Brain |
|---|---|---|---|---|---|
| Issue directive | **A/R** | I | I | I | I (record) |
| Constitutional ratification | **A/R** (sole) | I | I | I | I |
| Work-order approval | **A/R** (evidence-gated) | C (routes) | C (gate) | C | I |
| Daily command brief | I | **R** | — | C | I |
| Executive briefings (weekly/monthly/quarterly/annual) | **A** | **R** | — | C | I |
| Escalation intake & routing | **A** | **R** | C | R (raise) | I |
| The founder walk | **A/R** (sole) | C (prepares) | C (BLK registry) | C | I |
| Unknown-queue resolution | **A/R** | C | C | C | I |

**Authority boundaries (canon-derived, non-negotiable):** the Founder alone
ratifies constitutional change; no agent publishes or deploys; every
production-writing act names its gate (Genome V5); approval without evidence
is impossible by construction (`EvidenceRequiredError`).

## 6. Operating Procedures *(Deliverables 3, 13, 14)*

**P1 — Issue a Directive.** Founder writes it (verbatim discipline) → filed in
the governance tree → accessioned as `founder-directive` genome → mirrored to
Brain at next sync → cited by every work order it authorizes.

**P2 — The Decision Seat (founder approval session).** Open `/founder` →
Institution Strip (anything red first) → Approval Queue → for each item:
evidence present? (if absent: bounce with `EvidenceRequiredError` — never
waive) → decide → decision auto-recorded to order evidence, Brain, Event Bus.
*Exit condition: queue age within KPI target.*

**P3 — Ratification.** Per `constitution/ratification.md`: founder statement
with evidence → registry status change via reviewed commit →
`recordRatification()` → changelog when constitutional. Never batch-ratify
without reading; never ratify a description of an unbuilt system.

**P4 — Executive Briefings (Work-Order & Reporting Structure).** Daily
Founder Brief (90 seconds; generated from live state) · Weekly (5 minutes) ·
Monthly Board Report · Quarterly Strategic Review · Annual State of Aladiah.
Staleness shows as *due* on the cockpit; a stale daily brief for >48h is
itself an escalation (P5). Reporting flows one way: departments → CEO agent →
Founder; requests flow back as work orders, never as informal asks.

**P5 — Escalation Intake.** Triggers (exhaustive, per M01 scope): platform
critical · security gate NO-GO · gate with no reviewing agent · evidence
conflict on an approval · any agent acting outside charter · Unknown-queue
age breach. Route: raiser → CEO agent alert → Founder cockpit red strip →
founder decision recorded within the escalation-latency KPI.

**P6 — The Founder Walk.** Scheduled per validation manual; outcomes to the
BLK registry; walk evidence unlocks genome classifications (Unknown → decided)
and ratifications (hypothesis → proven).

**P7 — Executive Continuity.** When the Founder is not executing daily: all
standing authority remains in force (directives, ratified manuals, gates);
agents operate to charter; nothing requiring founder decision proceeds — it
queues with age tracking; the CEO agent's briefs accumulate as the return
briefing. *The Institution slows without the Founder; it never drifts.*

## 7. Quality Gates & Standards *(Deliverables 4, 8)*

**Standards for everything the Office produces:** directives are written and
verbatim-filed (no oral authority); decisions carry evidence; briefs compile
from live state only (a brief may never disagree with the dashboard);
escalations are typed, never ad-hoc; the office's own records satisfy the
Genome Standard's honesty invariants.
**Gates:** a directive without filing = not in force · an approval without
evidence = rejected by machinery · a brief from stale data = due-flagged ·
a ratification without a registry commit = void (rule: "the registry is the
record") · M01 changes ride the AMS approval workflow (MAJOR: founder;
MINOR: owner + QA).

## 8. KPI Dictionary *(Deliverable 6)*

| KPI | Formula | Target | Owner | Cadence | Source |
|---|---|---|---|---|---|
| Decision latency | median age of items in the Founder Approval Queue at decision time | founder-set pending | founder | daily brief | approvals queue timestamps |
| Escalation latency | time from escalation event → founder decision recorded | founder-set pending | founder | per incident | Event Bus |
| Briefing currency | cadences current ÷ 5 | 100% | ceo-chief-of-staff | daily | briefing staleness engine |
| Evidence integrity | approvals carrying evidence ÷ all approvals | 100% (by construction) | qa-authority | continuous | EvidenceRequiredError telemetry |
| Ratification review currency | governance reviews on time ÷ due | ≥95% | founder | weekly | governance registry |
| Directive traceability | work orders citing an authorizing directive ÷ all | 100% for new orders | ceo-chief-of-staff | weekly | work-order payloads |

All computed; none asserted; unmeasured renders as —.

## 9. Dashboard Specification *(Deliverable 5)*

Primary surface: the Founder Cockpit (`/founder`). The Office reads, in
order: **Institution Strip** (governance health, genomes, Unknown, maturity,
reviews due) → **Executive Command Header** (readiness, gates, blockers,
vitals) → **Approval Queue + Work Orders** (the decision seat) →
**Briefings panel** (cadence currency) → **Event Bus** (the flight recorder).
Gap registered honestly: decision-latency and escalation-latency KPIs have no
tile yet — dashboard work order to follow M01 ratification. All values
computed (FD-007 P3); the Office adds no manual numbers.

## 10. AI Workforce Binding

`ceo-chief-of-staff` **operates** (briefs, routing, delegation, reportToCeo
hub) — identity resolvable via `getWorkforceIdentity('ceo-chief-of-staff')`,
which cites this manual as its playbook upon ratification. `qa-authority`
**reviews** (gate integrity). All twelve departments **report** through the
structures of P4. No agent holds founder authority; the permissions framework
(publish:false, human_approval_required) is the technical enforcement of this
manual's §5.

## 11. Risk & Escalation Model *(Deliverable 11)*

| Risk | Likelihood/Impact | Control | Escalation |
|---|---|---|---|
| Founder bottleneck (queue growth) | expected / medium | decision-latency KPI + P7 queueing discipline | weekly brief flags trend |
| Decision without evidence | low (blocked) / high | `EvidenceRequiredError` by construction | any bypass = critical governance incident |
| Stale executive picture | medium / medium | briefing staleness + cockpit computed truth | >48h stale daily brief → P5 |
| Silent authority (unfiled directive) | low / high | P1 filing rule; unfiled = not in force | discovery → governance finding |
| Founder unavailability | possible / high | P7 continuity: standing authority + queue + return briefing | none — this IS the control |
| Single-person ratification capture | by design / accepted | Constitutional: founder-only is the Canon, not a flaw; succession = Organizational Charter (Vol III, reserved) | Vol III authorship |

## 12. Company Brain Integration *(Deliverable 9)*

The Office writes: every directive (accession) · every decision
(`governance-record` / order evidence) · every ratification
(`recordRatification`) · every briefing (`executive-report`) · every lesson
(`recordLessonLearned`). The Office reads before deciding: prior decisions on
the same subject (recall by key), the capability's genome lineage, and its
improvement history. **Rule: no decision on a subject the Brain already
decided without citing the precedent — consistency is institutional memory
working.**

## 13. Continuous Improvement Cycle *(Deliverable 10)*

Per the Five Permanent Loops, applied to the Office itself: each 90-day
review ingests (a) accumulated lessons in M01 scope, (b) KPI trends (§8),
(c) escalation post-mortems → proposed MINOR/MAJOR revisions ride the AMS
workflow → adopted changes append to the Improvement Log below. The manual
that governs decisions is itself governed by what decisions taught.

**Improvement Log (append-only):**
| Date | Lesson | Change |
|---|---|---|
| — | *(first entries after first review cycle)* | — |

## 14. Appendices

**A. Genome:** `playbook:m01-executive-office` (Institutional Registry).
**B. Authorizing instruments:** WO-0001; FD-2026-009 (AMS); FD-2026-007
(operational excellence); the Permanent Engineering Mission.
**C. Conformance note:** This manual implements the Universal Manual Template
(AMS Framework §3) in full — the structural inheritance every subsequent
manual (M02–M20) follows.
