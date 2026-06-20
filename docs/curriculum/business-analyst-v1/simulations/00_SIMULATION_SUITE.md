# BA Flagship — Simulation Suite (10) blueprint + coverage validation

> Status: **Architecture / blueprint only.** No implementation, no code, no lessons, no content.
> Purpose: design all 10 BA simulations at blueprint level and **validate that every competency
> slug is exercised multiple times across the suite BEFORE any single sim is built.** All sims reuse
> the shared engine from Sim 1 (`01_DISCOVERY_ENGAGEMENT_BLUEPRINT.md`). Difficulty tiers:
> **F**oundational · **I**ntermediate · **A**dvanced · **C**apstone.

## 1. Suite at a glance

| # | Name | Outcome | Difficulty | Prereq |
|---|---|---|---|---|
| 1 | Discovery Engagement | Find the real problem | I | — |
| 2 | Executive Steering Committee | Defend the recommendation | I | 1 |
| 3 | Conflicting Requirements Crisis | Resolve stakeholder conflict | I | 1 |
| 4 | AI Requirements Validation | Detect AI errors | A | 1,3 |
| 5 | Compliance Investigation | Trace controls and evidence | A | 3 |
| 6 | Product Prioritization War Room | Choose what gets built | A | 1,2 |
| 7 | Business Architecture Assessment | Capability / value-stream analysis | A | 1 |
| 8 | Transformation Roadmap Design | Build the future-state plan | A | 7 |
| 9 | Executive Recommendation Board | Present the transformation case | A | 6,8 |
| 10 | Enterprise Discovery Program | Full capstone (integrates all) | C | all |

## 2. Per-simulation blueprints

### Sim 1 — Discovery Engagement *(detailed in `01_…`)*
- **Scenario:** "Aurora Retail: the Returns Problem" — ambiguous brief, conflicting stakeholders.
- **Competencies:** elicitation, stakeholders, ai-analysis, ai-prompting, requirements, process-analysis, product-discovery, product-thinking, compliance, solution-eval.
- **Portfolio:** #1 Executive Discovery Report. **Difficulty:** I. **Prereq:** —.
- **Inputs:** sponsor brief, 6 personas, partial interview notes, contradictory requirements, evidence pack, compliance constraint. **Outputs:** prioritized opportunities + recommendation.
- **Scoring:** elicitation, stakeholder navigation, synthesis/evidence rigor, current-state accuracy, opportunity/prioritization, compliance, recommendation.

### Sim 2 — Executive Steering Committee
- **Scenario:** Present the Sim-1 recommendation to a skeptical exec committee (CFO challenges ROI, COO challenges feasibility, Legal challenges compliance).
- **Competencies:** stakeholders, solution-eval, product-thinking, facilitation, data-analysis, business-architecture.
- **Portfolio:** #7 Stakeholder Management Plan. **Difficulty:** I. **Prereq:** 1.
- **Inputs:** the Discovery Report, exec personas + objections, financials. **Outputs:** a defended decision + funding outcome.
- **Scoring:** executive communication, objection handling, evidence under pressure, value framing, decision facilitation.

### Sim 3 — Conflicting Requirements Crisis
- **Scenario:** Two departments submit mutually exclusive "must-have" requirements mid-project; timeline is fixed.
- **Competencies:** requirements, stakeholders, facilitation, elicitation, solution-eval.
- **Portfolio:** Requirements & Conflict-Resolution Package (feeds #3). **Difficulty:** I. **Prereq:** 1.
- **Inputs:** conflicting requirement sets, stakeholder positions, constraints. **Outputs:** a negotiated, traceable resolution + decision log.
- **Scoring:** conflict diagnosis (positions→interests), facilitation, requirements quality, negotiated outcome, traceability.

### Sim 4 — AI Requirements Validation
- **Scenario:** An AI tool produced a 60-requirement set for a regulated feature; some are hallucinated, contradictory, or non-compliant. Find and fix.
- **Competencies:** ai-prompting, ai-analysis, requirements, compliance.
- **Portfolio:** #3 AI Requirements Package. **Difficulty:** A. **Prereq:** 1,3.
- **Inputs:** AI-generated requirements (seeded with errors), source docs, regs. **Outputs:** validated set + provenance/traceability + governance notes.
- **Scoring:** hallucination/contradiction detection, source verification, traceability, governance judgment.

### Sim 5 — Compliance Investigation
- **Scenario:** An audit finding: a process may violate data-retention + lacks an audit trail. Trace obligation → control → evidence.
- **Competencies:** compliance, requirements, process-analysis, solution-eval, data-analysis.
- **Portfolio:** #2 Current-State BPMN Package + Compliance/Controls Matrix. **Difficulty:** A. **Prereq:** 3.
- **Inputs:** process docs, regulation extracts, audit log samples. **Outputs:** compliance traceability matrix + remediation requirements.
- **Scoring:** obligation→control→evidence mapping, gap identification, process accuracy, remediation quality.

### Sim 6 — Product Prioritization War Room
- **Scenario:** 15 validated opportunities, finite budget, competing sponsors — decide what gets built.
- **Competencies:** product-thinking, product-discovery, solution-eval, stakeholders, data-analysis.
- **Portfolio:** #4 Product Opportunity Assessment + #5 Business Case. **Difficulty:** A. **Prereq:** 1,2.
- **Inputs:** opportunity set with evidence, budget, value/effort data, sponsor pressures. **Outputs:** a prioritized, defensible roadmap slice + business case.
- **Scoring:** evidence-based prioritization, value/effort reasoning, trade-off transparency, stakeholder management.

### Sim 7 — Business Architecture Assessment
- **Scenario:** Map a business unit's capabilities and value streams; heatmap maturity to find where to invest.
- **Competencies:** business-architecture, process-analysis, data-analysis, product-thinking.
- **Portfolio:** Capability Assessment (capability map + value stream + heatmap). **Difficulty:** A. **Prereq:** 1.
- **Inputs:** org/process info, performance data, strategy statement. **Outputs:** capability map, value streams, heatmap, investment focus.
- **Scoring:** capability modeling, value-stream accuracy, heatmap rigor, strategic alignment.

### Sim 8 — Transformation Roadmap Design
- **Scenario:** Given current vs target capabilities, design a phased, dependency-aware transformation roadmap.
- **Competencies:** business-architecture, product-thinking, solution-eval, stakeholders, compliance.
- **Portfolio:** Transformation Roadmap (feeds #8). **Difficulty:** A. **Prereq:** 7.
- **Inputs:** current/target state, dependencies, constraints, risk profile. **Outputs:** phased roadmap with sequencing rationale + risks.
- **Scoring:** gap analysis, sequencing logic, dependency/risk handling, outcome alignment.

### Sim 9 — Executive Recommendation Board
- **Scenario:** Present the full transformation case to a board: strategy → capabilities → roadmap → investment → outcomes/risks.
- **Competencies:** stakeholders, solution-eval, business-architecture, facilitation, data-analysis.
- **Portfolio:** #8 Transformation Recommendation Deck. **Difficulty:** A. **Prereq:** 6,8.
- **Inputs:** roadmap, business case, board personas + tough questions. **Outputs:** board decision + funded plan.
- **Scoring:** executive narrative, strategy-to-outcome coherence, financial framing, Q&A under pressure.

### Sim 10 — Enterprise Discovery Program (CAPSTONE)
- **Scenario:** A full enterprise transformation: discover, model, prioritize, validate AI, ensure compliance, architect, roadmap, and present — end to end.
- **Competencies:** **all 13** `ba:` slugs.
- **Portfolio:** integrated capstone portfolio (all artifacts). **Difficulty:** C. **Prereq:** all.
- **Inputs:** a large ambiguous enterprise brief + multi-unit stakeholders + data + regs. **Outputs:** the full BA portfolio + Aladiah Profile.
- **Scoring:** integrative — weighted across all competencies; pass ≥80, distinction ≥92.

## 3. Competency coverage validation (the gate)

✓ = scored in that sim. Every slug must appear **≥2** times across Sims 1–9 (Sim 10 covers all).

| `ba:` slug | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Count (1–9) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| requirements | ✓ | | ✓ | ✓ | ✓ | | | | | ✓ | **4** |
| elicitation | ✓ | | ✓ | | | | | | | ✓ | **2** |
| process-analysis | ✓ | | | | ✓ | | ✓ | | | ✓ | **3** |
| business-architecture | | ✓ | | | | | ✓ | ✓ | ✓ | ✓ | **4** |
| stakeholders | ✓ | ✓ | ✓ | | | ✓ | | ✓ | ✓ | ✓ | **6** |
| product-thinking | ✓ | ✓ | | | | ✓ | ✓ | ✓ | | ✓ | **5** |
| product-discovery | ✓ | | | | | ✓ | | | | ✓ | **2** |
| facilitation | | ✓ | ✓ | | | | | | ✓ | ✓ | **3** |
| data-analysis | | ✓ | | | ✓ | ✓ | ✓ | | ✓ | ✓ | **5** |
| ai-analysis | ✓ | | | ✓ | | | | | | ✓ | **2** |
| ai-prompting | ✓ | | | ✓ | | | | | | ✓ | **2** |
| compliance | ✓ | | | ✓ | ✓ | | | ✓ | | ✓ | **4** |
| solution-eval | ✓ | ✓ | ✓ | | ✓ | ✓ | | ✓ | ✓ | ✓ | **7** |

**Result: all 13 slugs appear ≥2 times across Sims 1–9 ✅** (thinnest: elicitation, product-discovery,
ai-analysis, ai-prompting at 2 — each with a dedicated sim providing depth; Sim 10 reinforces all).

## 4. Portfolio coverage validation (8 artifacts)

| Artifact | Produced by |
|---|---|
| #1 Executive Discovery Report | Sim 1 ✅ |
| #2 Current-State BPMN Package | Sim 5 ✅ |
| #3 AI Requirements Package | Sim 4 ✅ |
| #4 Product Opportunity Assessment | Sim 6 ✅ |
| #5 Business Case | Sim 6 ✅ |
| #6 **UAT Package** | ⚠️ **no dedicated sim** — produced via Lab + Capstone |
| #7 Stakeholder Management Plan | Sim 2 ✅ |
| #8 Transformation Recommendation Deck | Sim 9 ✅ |

**Gap flagged (caught now, not after months):** the **UAT Package (#6)** has no dedicated simulation.
Solution-evaluation is heavily scored (7×), but hands-on UAT/test-case authoring is best produced by a
**lab** (e.g., a UAT lab in `00_ARCHITECTURE.md` §4) and the capstone — not a standalone sim. Decision
for the founder: accept lab/capstone coverage for UAT, or add an 11th "UAT Defect Storm" sim.

## 5. Difficulty progression & prerequisite chain
`1(I) → 2(I),3(I) → 4(A),5(A),6(A),7(A) → 8(A) → 9(A) → 10(C)`. Discovery→defense (1→2),
conflict/validation/compliance mid-tier (3,4,5), product & architecture (6,7,8), board (9), capstone (10).

## 6. Out of scope
No implementation, no code, no migrations, no lessons, no certifications, no new slugs. Build order
after approval: implement sims **in sequence** against the shared engine, Sim 1 first.
