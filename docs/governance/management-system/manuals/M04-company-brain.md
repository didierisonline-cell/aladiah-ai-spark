# M04 — Company Brain & Institutional Knowledge Management Manual

**Version 1.0 · DRAFT — at step 5 (Founder Review) of the Permanent
Management Rule, under WO-0004.** Inherits the M01 gold-standard structure.
Registry key: `m04-company-brain` · Genome: `playbook:m04-company-brain`.

## 1. Institutional Metadata

| Field | Value |
|---|---|
| **Title** | Company Brain & Institutional Knowledge Management Manual |
| **Accession** | M04 (permanent) |
| **Purpose** | How the Institution remembers, validates, retrieves, and learns: institutional memory, the knowledge and learning lifecycles, AI learning rules, evidence management, and the governance of the Brain itself. |
| **Version / Status** | 1.0 · Draft — Permanent Rule steps 1–4 complete, step 5 in progress |
| **Authority Level** | operational |
| **Owner** | analytics-intelligence |
| **Governing canon** | Covenant · Constitution · Permanent Definitions (FD-2026-012: the Brain learns HOW TO IMPROVE) · Genome Standard · AMS Framework v1.1 |
| **Related manuals** | M02 (governance records) · M03 (genome mirrors) · M06 (intelligence, pending) |
| **Review cadence** | 90 days upon ratification |
| **Ratification status** | Pending Founder Ratification (step 6) |

**Lifecycle record (Permanent Rule):**
| Step | Status | Evidence |
|---|---|---|
| 1 Draft | ✅ 2026-07-02 | this document, genome-first |
| 2 Engineering Review | ✅ 2026-07-02 | every procedure maps to running code (brain.ts, memory.ts, syncs, lessons); the two unbuilt items are named as gaps, not procedures (§11) |
| 3 QA Review | ✅ 2026-07-02 | entry/exit conditions on all procedures; 6 KPIs well-formed; 85/85 tests green |
| 4 Company Brain Review | ✅ 2026-07-02 | the Brain reviewed its own manual: precedent honored — 12 memory categories in force, idempotent-sync markers, the Remember Invariant (AIOS L5), retention finding (EPIC-001) carried forward, not hidden |
| 5 Founder Review | ⏳ this presentation | — |

## 2. Mission Link

Covenant Art. II (*Truth* — "knowledge evolves; we welcome evidence"),
Art. VII (*Research* — "every discovery strengthens the next generation"),
Art. XI (*Continuous Improvement*), Art. XII (*Legacy* — "the knowledge
preserved"). Per the Permanent Definitions: the Brain is HOW TO IMPROVE —
it closes FD-2026-011's learning loop (Evidence updates the Brain; the Brain
improves future Standards).

## 3. Scope & Reference Model

**Governs:** what must be remembered, how knowledge is validated and
retrieved, how AI employees learn, how the Brain itself is governed.
**Does not govern:** what is decided (M01), what is registered (M03),
intelligence observation (M06, pending).

```
SOURCES                          THE BRAIN                       CONSUMERS
decisions · ratifications   ┌──────────────────────────┐   recall() before
lessons · impact measures ─►│ aos_agent_memory          │◄─ deciding (precedent)
genomes · governance docs   │ 12 categories · markers   │   intelligence cycles
briefings · walk evidence   │ short/long/episodic       │   manual reviews
                            │ importance-scored         │   future AI workers
                            └──────────┬───────────────┘   the annual report
                     three redundant stores: git · registry · Brain
```

## 4. Definitions

**Institutional memory** — knowledge that survives model, technology, and
personnel change because it lives in the Brain's durable categories.
**Knowledge object** — one Brain entry: content + summary marker + category +
importance + provenance. **Marker** — the idempotency key
(`genome:<id>:v<n>`, `governance:doc:<key>:v<n>`, `briefing:<period>:<date>`,
`lesson:<scope>:<date>`) — one fact, one mirror, re-sync never duplicates.
**Validated knowledge** — an entry whose evidence is current (LDP: evidence
expires; stale evidence requires re-validation).

## 5. Roles, Authorities & Governance Matrix (RACI)

| Activity | Founder | analytics-intelligence (Brain steward) | operations-platform | All agents | qa-authority |
|---|---|---|---|---|---|
| Remember Invariant compliance | I | **R** (audit) | C | **R** (write at source) | C |
| Institution → Brain sync | **A/R** (session) | R (mechanism) | C | — | I |
| Knowledge validation / expiry | **A** (disputes) | **R** | C | C | C |
| Recall-before-decide (precedent) | **R** (decision seat) | R (agents) | R | **R** | C |
| Lesson recording | A (own lessons) | **R** (discipline) | R | **R** | C |
| Brain Review (Permanent Rule step 4) | I | **R** | C | — | C |
| Retention policy (pending) | **A** | R (proposal) | **R** | — | C |

## 6. Operating Procedures

**P1 — The Remember Invariant (what MUST be recorded).** Ratifications and
governance decisions (`governance-record`) · founder decisions
(`founder-decision`) · impact measurements and lessons (`impact-measurement`)
· executive reports (`executive-report`) · readiness history · genome and
registry mirrors (versioned markers) · walk evidence (via work-order evidence
→ Brain on decision). Enforcement lives at the source: the recording is part
of the act (`recordRatification`, `recordDecision`, `recordImpactMeasurement`,
`recordLessonLearned`, the syncs). *An act whose record can be skipped is a
defect in the act's implementation, not a training issue.*

**P2 — Knowledge lifecycle.** Capture (at source, P1) → Classify (category +
importance; signals auto-score, callers may override with justification) →
Consolidate (short-term ≥0.7 importance promotes to long-term; expired
short-term archives to episodic — never hard-deleted) → Validate (P4) →
Retire (supersession recorded; the old entry remains, marked superseded by
its successor's marker).

**P3 — Learning lifecycle (Continuous Organizational Learning).** Evidence
(work-order outcomes, walks, incidents) → `recordImpactMeasurement` /
`recordLessonLearned` → lesson lands in agent memory + Brain + Event Bus →
**mandatory ingestion**: 90-day manual reviews (AMS §8 step 8) and
intelligence cycles read lessons in scope → adopted improvements append to
the owning manual's Improvement Log → the improved standard is the loop
closing (FD-2026-011's organizing law, operationalized).

**P4 — Knowledge validation & evidence management.** Every entry carries
provenance (recordedBy + source/evidence in content). Validation rule (LDP):
evidence is current or the claim degrades — a decision citing expired
evidence re-validates before reuse. Disputed knowledge escalates to the
Founder (M01 P5); the Brain records the dispute AND the resolution — the
Institution remembers its corrections (Covenant Art. II: intellectually
honest when evidence challenges prior beliefs).

**P5 — Retrieval standards.** Before deciding: recall by marker/key for
precedent (M01 §12's rule — no decision on a decided subject without citing
precedent). Before building: recall + registry descent query (M03 P4).
Retrieval today is full-text + importance-ranked (`recall()`); semantic
retrieval (pgvector) is Phase-2 — until it ships, summary markers ARE the
retrieval contract: every writer must produce a searchable, prefixed marker.

**P6 — Sync discipline & version history.** `syncGovernanceToBrain()` +
`syncGenomesToBrain()` every founder session (mirror-freshness KPI);
idempotent per version — a version bump re-mirrors, an unchanged version
skips. Version history is the marker series itself: `…:v1`, `…:v2` remain
side by side; the Brain's history of a document is queryable by prefix.

**P7 — AI learning rules.** AI employees learn ONLY through governed
channels: their memory (`remember`/`recall`), lessons (P3), and the Brain —
**never through claims of self-modification** (no agent alters its charter,
prompt, permissions, or genome; those change via reviewed commits under M02).
Learning is auditable: an agent's learning history is its memory + lessons
(the Employee Record). Model upgrades change capability, not identity —
identity persists in the genome (Amendment V); a new model inherits the same
Brain, which is precisely why the Brain exists.

**P8 — Performing the Brain Review (Permanent Rule step 4).** For any manual
or major change: query precedent in scope (markers + categories) → verify no
prior decision is silently contradicted → verify carried-forward findings are
cited, not hidden → record the review outcome in the lifecycle table with
evidence. A Brain Review that finds nothing must say what it searched.

## 7. Quality Gates & Standards

A knowledge object is valid only with: category (of the 12) · marker
(prefixed, unique per version) · provenance · importance. Sync gates:
idempotency proven (skipped ≥ 0 on re-run); mirror freshness 100%
post-session. Learning gates: a lesson without evidence is rejected at the
recorder (empty evidence throws); an Improvement Log entry must cite its
lesson. The Brain never stores fabrications: entries derive from acts, not
assertions.

## 8. KPI Dictionary

| KPI | Formula | Target | Owner | Cadence | Source |
|---|---|---|---|---|---|
| Mirror freshness | current-version mirrors ÷ (genomes + governance docs) | 100% post-session | analytics-intelligence | per founder session | sync markers |
| Remember Invariant compliance | decision-class acts with Brain records ÷ acts | 100% (by construction) | analytics-intelligence | continuous | recorder call sites |
| Lesson capture | lessons recorded ÷ completed work orders with impact | founder-set pending | all departments | monthly | impact-measurement entries |
| Precedent citation | founder decisions citing recalled precedent ÷ decisions on previously-decided subjects | 100% (M01 §12) | founder | per decision seat | decision evidence |
| Consolidation health | promotable short-term memories consolidated ÷ eligible | ≥95% | operations-platform | weekly (post-run auto) | consolidate() outcomes |
| Review ingestion | 90-day manual reviews citing lessons ÷ reviews | 100% | manual owners | per review | Improvement Logs |

## 9. Dashboard Specification

Primary: **Company Brain panel** (`/founder`) — categories, counts, record
control, the one-click Institution → Brain sync. Supporting: Event Feed
(brain.decision.recorded, impact.measured), Employee learning history (per
agent). Gaps registered: mirror-freshness and lesson-capture tiles absent;
Brain search UI is category-filtered only (semantic search awaits pgvector).

## 10. AI Workforce Binding

`analytics-intelligence` **operates** (steward: validation, audits, sync
mechanism, Brain Reviews). `operations-platform` **stewards** infrastructure
(consolidation runs post-run automatically; retention engineering when
ratified). **Every agent** writes at source per P1 and recalls per P5 —
the Brain is the one subsystem the whole workforce shares by design
(AOS canon: no parallel memory systems).

## 11. Risk & Escalation Model

| Risk | L/I | Control | Escalation |
|---|---|---|---|
| **Retention policy undefined** (aos_messages + memory grow unbounded) | current/medium | append-only by design; volume low pre-scheduler; **standing finding carried from EPIC-001 — a retention DECISION is required before autonomous scheduling multiplies volume** | founder decision, proposed as the first M04 work order after ratification |
| Sync staleness (manual until scheduler) | current/low | mirror-freshness KPI + session discipline | stale >1 session → M01 P5 |
| Keyword-recall misses (no semantic search) | current/medium | marker discipline (P5) + prefix conventions | pgvector Phase-2 (AOS canon §5) |
| Knowledge pollution (low-value flooding) | low/medium | importance scoring + consolidation archival + category discipline | steward audit |
| Precedent rot (evidence expires silently) | medium/medium | P4 validation rule; disputes recorded with resolutions | founder on dispute |
| Un-auditable AI learning claims | low/high | P7: learning only via governed channels; Employee Record = the audit | any violation = charter breach → founder |

## 12. Company Brain Integration *(self-referential, by design)*

This manual governs the Brain and is governed by it: M04 mirrors into the
Brain on ratification; its lessons feed its own 90-day reviews; its Brain
Review (step 4) was performed BY the discipline it codifies (§1 lifecycle
record). The recursion is the proof: the Institution's memory remembers how
to remember.

## 13. Continuous Improvement Cycle

90-day reviews ingest: recall-miss reports (what couldn't be found?), sync
incidents, lesson-capture trends, validation disputes. Expected first-cycle
improvements already visible: the retention decision (§11), mirror-freshness
tile, and the pgvector upgrade path — each becomes a work order, not a
silent edit.

**Improvement Log (append-only):**
| Date | Lesson | Change |
|---|---|---|
| — | *(first entries after first review cycle)* | — |

## 14. Appendices

**A. Genome:** `playbook:m04-company-brain`.
**B. Authorizing instruments:** WO-0004 · FD-2026-012 (Permanent Definitions)
· FD-2026-011 (learning loop) · FD-2026-007 (knowledge compounds).
**C. Machinery inventory (evidence):** `brain.ts` (12 categories,
recordDecision, listBrain, counts), `memory.ts` (remember/recall/consolidate,
importance scoring, TTL), `recordLessonLearned` + `recordImpactMeasurement`,
`syncGovernanceToBrain` + `syncGenomesToBrain` (idempotent markers),
post-run consolidation in the orchestrator, the cockpit Brain panel with
one-click sync — all running; 85/85 tests.
