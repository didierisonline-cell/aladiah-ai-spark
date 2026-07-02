# The Aladiah Capability Genome Standard

**Status: DRAFT v1.0 — designed on founder commission (2026-07-02); no
authority until founder ratification. No implementation authorized.**
Registry key: `capability-genome-standard`. The canonical specification for
every capability within the Institution: **no capability shall exist without a
genome.**

---

## 1. Definition

A **Capability Genome** is the complete, standardized, machine-readable
description of one institutional capability — what it is for, who answers for
it, what governs it, what it consumes and produces, how it is measured, and
how it has learned. The genome is to a capability what the Institutional
Metadata block is to a Founding Library volume: identity that survives
technology, personnel, and model changes.

The Institutional Registry (design: `docs/engineering/registry/`) is the
**collection of genomes plus enforcement**. Upon ratification of this
standard, the Registry Reference Model's record schema is conformed to the
genome — the genome is the master specification; the registry stores,
validates, and surfaces it.

## 2. The genome — 22 loci

| # | Locus | Type | Required | Definition & validation |
|---|---|---|---|---|
| 1 | **Mission** | text | ✅ | Which institutional mission this capability serves — stated as an outcome for a served group (Covenant Art. XIII), not a feature description |
| 2 | **Purpose** | text | ✅ | One sentence: why this capability exists. Empty or circular purposes fail validation |
| 3 | **Capability Type** | enum | ✅ | program · course · lesson · simulation · assessment · dashboard · policy · standard · playbook · reference-model · ai-role · institute · department · team · work-order · founder-directive · research-report · translation · visual-asset · knowledge-article · edge-function · service. Type creation is an institutional act (founder directive) |
| 4 | **Classification** | enum | ✅ | constitutional · strategic · operational · experimental · legacy · archived · unknown (Phase-0 categories). Precedes registration, always |
| 5 | **Owner** | slug | ✅ | Exactly one — an agent slug or `founder`. "Shared" is not an owner |
| 6 | **Authority** | enum | ✅ | foundational · constitutional · canonical · operational · informational — which tier of the spine governs it |
| 7 | **Institute** | slug∣null | ✅ (nullable) | Future organizational unit; null until the Organizational Charter (Volume III) defines institutes — never invented before it |
| 8 | **Department** | slug | ✅ | One of the 12 chartered departments, or `founder` |
| 9 | **Reference Model** | path∣missing∣n/a | ✅ | The model that governs its design. `missing` is honest and visible; `n/a` requires justification in Evidence |
| 10 | **Playbook** | path∣missing∣n/a | ✅ | The procedure that operates it |
| 11 | **Standards** | keys[] | ✅ | Registry keys of the standards it must satisfy (always includes this one) |
| 12 | **Dependencies** | genome ids[] | ✅ (may be empty) | Upstream capabilities. References must resolve; graph must stay acyclic |
| 13 | **Inputs** | typed list | ✅ (may be empty) | What it consumes: data (tables/events), documents, human actions — named, not implied |
| 14 | **Outputs** | typed list | ✅ (may be empty) | What it produces: data, artifacts, decisions, side effects. **Production-writing outputs must name their approval gate** |
| 15 | **Security** | enum + notes | ✅ | Classification (public · student · founder · secret) + authN/authZ posture. Capabilities that can write production content require the gate chain stated here |
| 16 | **Accessibility** | enum | ✅ | unmeasured · posture · audited · n/a — honesty scale, never asserted without evidence |
| 17 | **AI Workforce** | slugs[] + roles | ✅ (may be empty) | Which agents operate/steward/review it, in which role |
| 18 | **KPIs** | dictionary ref | ✅ | Reference to its KPI dictionary (formula · target · owner · cadence · source per KPI). `missing` is honest and visible |
| 19 | **Engineering Maturity** | 0–5 computed | ✅ | Derived from artifact presence (loci 9, 10, 11, 18 + dashboard spec + quality gates + brain link + measured KPIs). **Never hand-set** |
| 20 | **Institutional Status** | enum | ✅ | Class-specific lifecycle state (e.g. draft · review · live · retired), plus review dates (last/next) |
| 21 | **Company Brain Link** | marker | ✅ | The Brain mirror marker (`genome:<id>:v<n>`); freshness is a registry KPI |
| 22 | **Continuous Improvement History** | events[] | ✅ (grows) | Typed events: created · amended · reviewed · impact-measured · lesson-learned — each with date, actor, evidence. The genome remembers how it got better |

## 3. Genome invariants (CI-enforced upon implementation)

1. **Completeness**: all 22 loci present; `missing`/`unmeasured`/`unknown`
   are valid values — absence of the locus itself is not.
2. **Honesty**: unknown classification blocks maturity > 0 and readiness
   claims; unmeasured is never rendered as zero; computed loci (19) cannot be
   asserted.
3. **Identity**: genome ids are immutable and append-only (`<type>:<slug>`).
4. **Lineage**: dependencies resolve and stay acyclic; authority tier must be
   ≥ consistent with the governing parent's tier.
5. **Gate declaration**: any capability whose Outputs write production content
   must declare its approval chain at locus 15 — a genome claiming direct
   production writes with no gate is invalid *by construction* (this rule
   alone would have flagged all 42 publish-direct seeders).
6. **Evidence**: classification, status transitions, and improvement events
   carry evidence per the Launch Decision Principle.
7. **One fact, one home**: loci reference existing registries (governance
   docs, charters, KPI dictionaries) by key — never duplicate their content.

## 4. Lifecycle

Genome created at capability conception (before implementation — per FD-001,
artifacts precede code) → validated in CI → mirrored to the Company Brain →
surfaced on the Registry dashboard → amended through reviewed commits →
enriched by improvement events after every measured change → survives the
capability's retirement (archived genomes are the institution's memory of
what it once operated).

## 5. Conformance

- **Genome-complete**: all loci present and valid → may enter the Registry.
- **Genome-mature**: maturity ≥ 3 → may be depended upon by strategic
  capabilities.
- **Genome-exemplary**: maturity 5 with measured KPIs and ≥ 1 lesson-learned
  event → the standard other capabilities are held to.

## 6. Ratification

This standard takes effect upon founder ratification, recorded per
`../constitution/ratification.md`. Upon ratification: (a) the Institutional
Registry Reference Model is conformed to the genome, (b) implementation of
the Registry may begin per the approved six artifacts, (c) every existing
capability's Phase-0 classification becomes locus 4 of its future genome.
