# M03 — Institutional Registry & Capability Genome Operations Manual

**Version 1.0 · DRAFT — at step 5 (Founder Review) of the Permanent
Management Rule, under WO-0003.** Inherits the M01 gold-standard structure.
Registry key: `m03-registry-genome-operations` · Genome:
`playbook:m03-registry-genome-operations`.

## 1. Institutional Metadata

| Field | Value |
|---|---|
| **Title** | Institutional Registry & Capability Genome Operations Manual |
| **Accession** | M03 (permanent) |
| **Purpose** | How every institutional asset is registered, versioned, governed, traced, and retired — the operating procedures of the constitutional catalog. |
| **Version / Status** | 1.0 · Draft — Permanent Rule steps 1–4 complete, step 5 in progress |
| **Authority Level** | operational |
| **Owner** | operations-platform (the Registrar) |
| **Governing canon** | Capability Genome Standard v2.0 (ratified) · Registry design artifacts (approved) · M02 Governance Operations (ratified) · AMS Framework v1.1 |
| **Related manuals** | M02 (lifecycles) · M04 (Brain, pending) · M07 (work orders, pending) |
| **Review cadence** | 90 days upon ratification |
| **Ratification status** | Pending Founder Ratification (step 6) |

**Lifecycle record (Permanent Rule):**
| Step | Status | Evidence |
|---|---|---|
| 1 Draft | ✅ 2026-07-02 | this document, genome-first |
| 2 Engineering Review | ✅ 2026-07-02 | template conformance; every procedure maps to running code (genome.ts, institutionalRegistry.ts); no procedure describes unbuilt machinery |
| 3 QA Review | ✅ 2026-07-02 | procedures carry entry/exit conditions; KPIs match the approved registry KPI dictionary; 85/85 tests green incl. V1–V12 + parity |
| 4 Company Brain Review | ✅ 2026-07-02 | precedent honored: ratified Genome Standard, Phase-0 classifications, FD-2026-004 amendments, the Unknown-queue doctrine; no contradiction |
| 5 Founder Review | ⏳ this presentation | — |

## 2. Mission Link

Covenant Art. IX (*Stewardship* — "Every steward leaves it stronger than it
was received": the registry is how a steward knows what was received) and
Art. XI (*Continuous Improvement* — nothing improves untracked). Serves the
Architecture Principle by protecting every Core System from ungoverned
capability — the Shadow Factory lesson, institutionalized.

## 3. Scope & Reference Model

**Governs:** the operations of registration, validation, classification,
versioning, lineage, parity, and retirement for every capability class.
**Does not govern:** what capabilities do (their manuals), document authority
(M02), the standard itself (Canon — amendments via P6 of M02).

```
DISCOVER (scanner/manifests) → CLASSIFY (Phase-0 categories, evidence)
  → GENOME (35 loci, validated V1–V12) → REGISTER (reviewed commit)
  → OPERATE (versioned, traced, KPI-measured)
  → RETIRE (never deleted — permanently discoverable)
        every arrow CI-enforced · every state Brain-mirrored
```

## 4. Definitions

**Asset / capability** — anything matching a genome type (22 classes).
**The Registrar** — operations-platform in its registry-operating role.
**Parity** — bidirectional agreement between reality (filesystem/manifests)
and the catalog, per class. **Quarantine** — the standing gate on Unknown
production-writers: founder walk required before any invocation.

## 5. Roles, Authorities & Governance Matrix (RACI)

| Activity | Founder | Registrar (ops-platform) | analytics-intelligence | qa-authority | Dept. owners |
|---|---|---|---|---|---|
| Register new capability | I | **R** (commit) | C (classification proposal) | C | **R** (genome content) |
| Classification: unknown → decided | **A/R** (walk) | R (record) | C (evidence) | I | C |
| Version / amend genome | I | **R** | I | C (MAJOR) | R |
| Class onboarding (new parity class) | **A** | **R** | C | C | I |
| Retirement | **A** (work order) | **R** | I | C | R (evidence) |
| Registry audits | **A** | **R** | C | C | C |

## 6. Operating Procedures

**P1 — Register.** Entry: capability discovered or proposed. Classify first
(no classification, no entry — Phase-0 rule) → author the genome (35 loci;
`missing`/`unknown` honest, never absent) → validate (V1–V12; every violation
listed) → reviewed commit → parity green → Brain mirror at next sync. Exit:
CI green with the new genome.

**P2 — Version & amend.** MINOR (content within scope): owner + Registrar
commit, evolution event appended. MAJOR (type, classification, authority,
gates): work order + the M02 lifecycle. Ids never change (append-only law);
`brainLink` version increments so the mirror re-syncs.

**P3 — Resolve an Unknown.** Entry: founder walk evidence (deployment status,
invocation logs, content diff). Decide per asset: **retire** (P6) · **govern**
(reclassify with evidence; genome gains real gates; V4 lock lifts — maturity
recomputes) · **archive** (historical, no live path). Record: evolution event
citing walk evidence + Brain + work order closure. Exit: Unknown-queue age
KPI unbreached. *Standing population: the 37 shadow seeders, risk-ordered.*

**P4 — Trace (lineage operations).** Any asset answers the six questions
(governed-by / governs / dependents / standards / consumers / dashboards) via
the graph API, and its descent (derived-from / supersedes / replaced-by) via
lineage loci. Tracing rule: **before building anything, query what it
derives from and what it would supersede** — a new capability that duplicates
a live one is a finding, not a feature (Architecture Principle:
anti-duplication).

**P5 — Onboard a parity class.** Entry: founder directive or approved work
order (class creation is an institutional act). Build the class manifest
(generated from reality, like edge functions and pages — never hand-listed)
→ genomes via factory with honest defaults → bidirectional parity test →
`parityEnforcedClasses` updated (the cockpit shows enforcement honestly).
Exit: a capability of that class can no longer exist unregistered.

**P6 — Retire.** Entry: founder-approved work order with decommission
evidence. Genome → `deprecated` → `retired` (V9: `retiredOn` mandatory);
`replacedBy` named or `null` with rationale; the record remains permanently
discoverable (Amendment IV — institutional history is never deleted); paths
may vanish (archived exemption). Exit: retirement event on the Event Bus +
Brain.

**P7 — Registry audits.** Continuous: parity + V1–V12 in CI. Quarterly
(with M02 P8): semantic audit — do owners, departments, and workforce
bindings still match practice? Are `missing` artifacts shrinking? Findings →
work orders.

## 7. Quality Gates & Standards

Registration gates (all machine-enforced today): classification before entry ·
genome completeness (V1) · computed truth (V3/V4 — hand-set maturity
rejected) · gate declaration on production-writers (V5) · resolving, acyclic
lineage (V6) · creation authority (V7) · constitutional attachment (V8) ·
lifecycle order + retirement coherence (V9/V10). Standard: **a genome that
lies fails the build** — the registry's trustworthiness is a test result,
not a claim.

## 8. KPI Dictionary *(per the approved registry KPI dictionary)*

| KPI | Formula | Target | Owner | Cadence | Source |
|---|---|---|---|---|---|
| Registry coverage | discovered with genomes ÷ discovered (per enforced class) | 100% (CI) | Registrar | every CI run | parity tests |
| Classification coverage | genomes ≠ unknown ÷ all | ≥95% steady-state | founder | weekly | registry |
| Unknown queue age | max days unknown | ≤14 days | founder | daily brief | registry |
| Mean engineering maturity | mean(maturity) non-archived | ≥3.0 in two quarters | Registrar | monthly | computed |
| Parity classes onboarded | enforced classes ÷ 22 | grows per P5 plan | Registrar | quarterly | parityEnforcedClasses |
| Brain mirror freshness | current-version mirrors ÷ genomes | 100% post-session | analytics-intelligence | per session | sync markers |

## 9. Dashboard Specification

Primary: **Institutional Registry panel** (`/founder`) — classification
chips, the risk-ordered Unknown queue (destructive first), lifecycle
distribution, honest mean maturity, enforced-classes disclosure. Supporting:
Institution Strip (genomes/classified/unknown/maturity). Gap registered:
per-class coverage breakdown and maturity trend have no tiles yet.

## 10. AI Workforce Binding

Registrar `operations-platform` **operates** (commits, parity, audits;
future: the scanner observer per the approved Workforce Spec).
`analytics-intelligence` **stewards** (classification proposals as
confidence-scored findings — never auto-classifies). `qa-authority`
**reviews** MAJOR changes. Department owners author genome content for their
capabilities. The Founder decides every Unknown and every retirement.

## 11. Risk & Escalation Model

| Risk | L/I | Control | Escalation |
|---|---|---|---|
| Unknown queue stagnation (37 standing) | current/high | age KPI (≤14d) + daily-brief surfacing + quarantine gates | breach → M01 P5 escalation |
| Semantic staleness (fields rot while paths pass) | medium/medium | P7 quarterly semantic audit | findings → work orders |
| Factory-genome shallowness (honest but thin) | accepted/low | maturity KPI pressure; `missing` visible; owners enrich per P2 | maturity trend in monthly report |
| Class sprawl (22 types tempting ad-hoc additions) | low/medium | P5: class creation is an institutional act | governance finding |
| Registry-as-code merge conflicts at scale | future/medium | per-class file split when catalog > ~500 genomes (engineering decision recorded now for then) | Registrar proposal |

## 12. Company Brain Integration

Writes: every genome (versioned mirrors), every classification decision,
every retirement, audit findings, lessons. Reads: P4's tracing rule makes
Brain-recall part of registration (has the Institution built this before?
what happened?). The registry and the Brain are the same truth in two
shapes: one validates, one remembers.

## 13. Continuous Improvement Cycle

90-day reviews ingest: Unknown-resolution outcomes (did the walk change our
classification criteria?), parity incidents, maturity trends, and lessons
tagged M03. The learning loop of FD-2026-011 applies directly: registry
EVIDENCE (walk results, audits) updates the BRAIN, which improves this
STANDARD's procedures.

**Improvement Log (append-only):**
| Date | Lesson | Change |
|---|---|---|
| — | *(first entries after first review cycle)* | — |

## 14. Appendices

**A. Genome:** `playbook:m03-registry-genome-operations`.
**B. Authorizing instruments:** WO-0003 · FD-2026-011 · Capability Genome
Standard v2.0 (ratified) · approved registry design artifacts.
**C. Machinery inventory (evidence):** `genome.ts` (V1–V12, computed
maturity), `institutionalRegistry.ts` (210+ genomes, factories, Unknown
queue, employee records), `edgeFunctionManifest.ts` + `pageManifest.ts`
(generated manifests), parity + integrity tests — all green, 85/85.
