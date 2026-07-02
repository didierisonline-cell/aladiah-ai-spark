# The Aladiah Capability Genome Standard — v2.0

**Status: DRAFT v2.0 — revised per Founder Directive FD-2026-004 (six
constitutional amendments incorporated); awaiting founder ratification. No
implementation authorized.** Registry key: `capability-genome-standard`.

**The constitutional principle (FD-2026-004):** *The Institution shall
preserve not only what it builds, but why it exists, how it evolved, under
whose authority it changed, and what future generations may learn from it.
The Institution is not software. The Institution is a living system of
governed knowledge.*

Supporting engineering artifacts: `docs/engineering/genome/` (schema ·
validation rules · reference model · worked example · ratification package).

---

## Part A — Constitutional principles

**A1 · Institutional Identity (Amendment V).** The Genome is the permanent
identity of a capability. Implementation, technology, ownership, and process
may all change; the constitutional identity persists through the Genome.

**A2 · Computed Institutional Truth (Amendment III).** Institutional claims
are earned through evidence, never asserted manually. Engineering Maturity,
Readiness, Institution Health, Quality, Security, Compliance, Operational
Status, and Institutional Status are **computed from measurable evidence**.
Manual assertion of any computed locus is prohibited by validation. Unknown
is an acceptable state; false certainty is not.

**A3 · Permanent Lineage (Amendment I).** Nothing within the Institution
loses its historical lineage. Institutional evolution remains permanently
auditable: every genome records how its capability came to exist, under whose
authority, and what it became.

**A4 · Constitutional Attachment (Amendment II).** No capability exists
independently of the Institution's constitutional framework — every genome
explicitly references the documents that govern it.

**A5 · The Registry is the constitutional catalog (Amendment VI).** No
capability enters the Institutional Registry without a complete genome. The
Registry is not an inventory; it is the constitutional catalog of governed
Capability Genomes.

---

## Part B — The genome

Seven sections, 35 loci. Field types and validation: see the Schema and
Validation Rules artifacts.

### Section 1 · Identity (loci 1–8)
1 **Mission** — the institutional outcome served (Covenant Art. XIII framing)
2 **Purpose** — one sentence: why this capability exists
3 **Capability Type** — closed enum; type creation is an institutional act
4 **Classification** — constitutional · strategic · operational ·
  experimental · legacy · archived · unknown
5 **Owner** — exactly one (agent slug or `founder`)
6 **Authority** — foundational · constitutional · canonical · operational · informational
7 **Institute** — null until the Organizational Charter defines institutes
8 **Department** — one of the 12 chartered departments, or `founder`

### Section 2 · Canonical References (Amendment II — loci 9–16)
Explicit references (registry keys / genome ids / Brain markers), each
`reference | missing | n/a-with-justification`:
9 **Constitution Volumes** — the Founding Library shelves that govern it
10 **Founder Standards** — applicable sections (reference reserved until Volume II is authored)
11 **Reference Model** · 12 **Operational Playbook** · 13 **Standards** (always includes this one)
14 **Dashboard Specification** · 15 **AI Workforce Specification** · 16 **KPI Dictionary**
Plus, within locus 13's list where applicable: Quality Gates, Security
Standards, Accessibility Standards, Translation Standards. Founder
Directives and Engineering/Architecture Decisions are referenced in Section 6
(Lineage); Company Brain knowledge objects in Section 7 (Memory).

### Section 3 · Interfaces (loci 17–19)
17 **Dependencies** — genome ids; resolving, acyclic
18 **Inputs** — named data/documents/human actions consumed
19 **Outputs** — named products; **production-writing outputs must name their
   approval gate** (the F-1 rule: a gateless production writer is invalid by construction)

### Section 4 · Assurance (loci 20–23)
20 **Security** — classification (public·student·founder·secret) + posture + gate chain
21 **Accessibility** — unmeasured · posture · audited · n/a (computed from audit evidence)
22 **Translation** — n/a · none · partial · full (computed from coverage probes)
23 **Quality (QA status)** — untested · planned · passing · failing · n/a (computed from test/QA evidence)

### Section 5 · Operation (loci 24–27)
24 **AI Workforce** — agents + roles (operates / stewards / reviews)
25 **KPIs** — the capability's KPI dictionary (formula·target·owner·cadence·source each)
26 **Engineering Maturity** — 0–5, computed from artifact presence + measurement; never hand-set
27 **Lifecycle State (Amendment IV)** —
   `Proposed → Draft → Governed → Implemented → Measured → Institutionalized → Deprecated → Retired`
   with last/next review dates. Retired genomes remain permanently
   discoverable; institutional history is never deleted.

### Section 6 · Lineage (Amendment I — loci 28–33)
28 **Ancestry** — Parent Capability · Child Capabilities (derived)
29 **Descent** — Derived From · Supersedes · Replaced By (genome ids; `none` is explicit)
30 **Authority trail** — Constitutional Authority (spine position) · Founder Directive(s)
31 **Decision trail** — Engineering Decision(s) · Architecture Decision Record(s)
32 **Dates** — Creation · Ratification · Retirement (if applicable)
33 **Evolution History** — append-only typed events (created · amended ·
   superseded · migrated · measured · deprecated · retired), each with date,
   actor, and evidence

### Section 7 · Memory (loci 34–35)
34 **Company Brain Link** — mirror marker (`genome:<id>:v<n>`); freshness is a registry KPI
35 **Continuous Improvement History** — impact measurements + lessons learned,
   evidence-carrying; the genome remembers how it got better

---

## Part C — Invariants (CI-enforced upon implementation)

1. **Completeness** — all 35 loci present; `missing`/`unmeasured`/`unknown`/`n/a`
   are valid values; an absent locus is not (Amendment VI: incomplete genome
   → no Registry entry).
2. **Computed truth** — loci 21, 22, 23, 26, and readiness derive from
   evidence; validation rejects manual assertion (Amendment III).
3. **Identity permanence** — ids immutable; genomes never deleted; `Retired`
   is a state, not an absence (Amendments IV, V).
4. **Lineage integrity** — descent references resolve; every genome carries
   at least its creation event with authority (Amendment I).
5. **Constitutional attachment** — locus 13 non-empty for every non-archived
   genome; every genome references at least one Constitution Volume or its
   governing canon (Amendment II).
6. **Gate declaration** — production-writing outputs without a named approval
   chain are invalid by construction.
7. **Honesty** — `unknown` classification blocks maturity > 0 and readiness;
   unmeasured never renders as zero.
8. **One fact, one home** — references by key, never duplicated content.

## Part D — Ratification

Effective upon founder ratification per `../constitution/ratification.md`.
Upon ratification: the Institutional Registry Reference Model conforms to
this genome; Registry implementation proceeds per the six approved
artifacts; Phase-0 classifications become locus 4 of first-generation
genomes; the Founder Ratification Package
(`docs/engineering/genome/06-ratification-package.md`) records the act.

## Revision history

| Date | Version | Change | Authority |
|---|---|---|---|
| 2026-07-02 | 1.0 | Initial 22-locus design on founder commission | founder commission |
| 2026-07-02 | 2.0 | Amendments I–VI incorporated: Lineage, Canonical References, Computed Truth, Lifecycle, Identity, Registry Conformance | FD-2026-004 |
