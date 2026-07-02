# AVIS — The Aladiah Visual Intelligence System
# Complete Engineering Blueprint (WO-0008)

**Status: DESIGN — no implementation, no installation, no external APIs, no
package selection. The constitutional foundation for Visual Intelligence,
awaiting Founder approval before any implementation begins.**
Registry key: `avis-blueprint` · Capability genome: `service:avis` (proposed).
Sibling authority: the AVIS Design Bible (Founding Library shelf 11, scaffold).

**The Five Questions (Engineering Law):** ① Visual learning transforms
comprehension — Covenant Art. I (teaching is transformation) and the Closing
Affirmation's own words: *"to strengthen understanding through visual
intelligence."* ② Covenant → Constitution → AVIS Design Bible (shelf 11) →
this blueprint → the future M-series visual procedures. ③ Extends: the
genome/registry pattern (visual assets are already a genome class), the Brain
(visual knowledge mirrors like all knowledge), the gate pipeline (visuals ride
the UX gate), the existing `generate-visuals`/`generate-lesson-audio`
experiments (classified Experimental — governed, not discarded), the token
system and brand inventory. ④ Evidence: every approved visual a governed
asset with genome + provenance; zero ungoverned visuals (parity-class
enforcement); comprehension KPIs once learners interact. ⑤ Every visual's
prompt, version, QA verdict, and usage lesson is Brain-recorded.

---

## 1. AVIS Architecture

```
GOVERNANCE (this blueprint · Design Bible · standards §6–§10)
      │ authorizes
      ▼
VISUAL INTELLIGENCE ENGINE (§2)             the reasoning layer
  need → taxonomy match → spec → prompt → generation (future §17)
      │ every artifact through
      ▼
QA GATES (§6) → founder/steward approval → VISUAL ASSET REGISTRY (§4)
      │ registered assets flow to
      ▼
SURFACES: lessons · simulations · dashboards · enterprise models · marketing
      │ evidence returns via
      ▼
VISUAL COMPANY BRAIN (§3): usage, comprehension, lessons → better standards
```

Constitutional position: AVIS is a **capability of the Institution**, not a
tool — genome-first, registry-cataloged, gate-bound, Brain-remembered, exactly
like everything else (Priority F: nothing exists in isolation).

## 2. Visual Intelligence Engine

The reasoning layer that decides *what to visualize and how* — deliberately
separate from generation (which is replaceable technology; §17):
**Need detection** — the Visual First Principle operationalized: content
pipelines flag concepts where visual value exceeds textual (rubric in §12).
**Spec synthesis** — need + taxonomy class + brand/accessibility standards →
a Visual Specification (the contract generation must satisfy): purpose,
audience, taxonomy class, required elements, prohibited elements, alt-text
intent, brand tokens.
**Prompt compilation** — spec → versioned prompt (§7) for whichever
generation backend exists (human designer today; Open-Gen-AI later — the
engine is backend-agnostic by design).
**Verification hooks** — every generated artifact returns to the engine for
QA-gate routing before registration.

## 3. Visual Company Brain

Visual knowledge = institutional knowledge (M04 applies in full):
- Every approved visual mirrors to the Brain (`visual:<asset-id>:v<n>`
  markers) with its spec, prompt version, and QA verdict.
- **Both modalities preserved** (Master Order): the visual asset + its
  textual description/alt-text are one knowledge object — a future AI worker
  who cannot see still knows what the Institution drew and why.
- Lessons: comprehension outcomes, reuse patterns, rejected-visual
  post-mortems (why a visual failed QA is as valuable as why one passed).
- Retrieval: taxonomy-class + purpose markers until semantic search ships.

## 4. Visual Asset Registry

The `visual-asset` genome class (already in the 22 ratified types), made a
**parity-enforced class** per M03 P5: a manifest generated from the asset
store; an asset on disk without a genome fails CI — the Shadow-Factory rule
applied to imagery before a single image exists.
Asset record (genome + visual loci): spec reference · taxonomy class ·
prompt version · source (human/model+version) · license/provenance · brand
compliance verdict · accessibility verdict (alt text, contrast) · usage sites
(which lessons/dashboards) · supersession chain (a re-generated visual
supersedes, never overwrites — Amendment IV for pixels).

## 5. Visual Capability Genome

AVIS itself: `service:avis`, classification `strategic`, lifecycle `proposed`
until this blueprint is approved (then `governed`). Its genome carries this
blueprint as reference model, the Design Bible as standards home, the KPI set
(§20 adjunct), and the gate declaration: **AVIS writes production content
(lesson visuals) — its gate chain is QA → accessibility → brand → founder/
steward approval, stated in the genome per V5, before the engine exists.**

## 6. Visual Quality Standards

A visual passes QA only if: factually correct (diagrams match the systems
they depict — an architecture diagram is CODE REVIEWED against reality) ·
pedagogically purposeful (the §12 rubric scored it above textual) · brand
compliant (§9) · accessible (§8) · honest (no decorative data, no implied
precision — chart standards inherit the honesty conventions: unmeasured is
absent, never invented). Rejection is recorded with reasons (Brain, §3).

## 7. Prompt Engineering Standards

Prompts are **governed source code for visuals**: versioned (MAJOR.MINOR,
immutable history), reviewed like commits, attached to every generated
asset's genome, and reusable (a prompt library organized by taxonomy class).
Standards: every prompt states audience + purpose + prohibited elements ·
brand tokens referenced by name, never described ad hoc · no prompt embeds
claims the Institution hasn't verified (LDP applies to what we ask models to
draw) · prompt changes that alter meaning are MAJOR and re-gate the assets
built on them.

## 8. Accessibility Standards

Binding floor (feeds the Design Bible's reserved accessibility chapter):
every visual ships with founder-grade alt text (the textual twin, §3) ·
contrast per the token system's accessible pairs · no meaning carried by
color alone (the cockpit's existing law, extended to all visuals) ·
animations respect reduced-motion preferences and never strobe · interactive
diagrams (§16) fully keyboard-navigable · complex diagrams provide a
structured text walk-through. **An inaccessible visual fails QA regardless
of beauty.**

## 9. Brand Standards

Inherits and binds: the token system (`src/index.css` — the single source),
the brand asset inventory, the Founder Story Canon, protected terms
(`docs/i18n/PROTECTED_TERMS.md` — never translated, never restyled).
Visual grammar per class: educational diagrams use the semantic palette
(risk colors reserved for risk — never decorative); marketing visuals may
use the full brand gradients; certificates and credentials use the
founder-signature standards (§10). One institution, one visual voice, many
registers.

## 10. Founder Signature Visual Standards

The visuals that carry the Founder's personal authority — certificates,
covenant/constitutional documents, official seals, program credentials:
generated NEVER without explicit founder approval per instance · a reserved
visual vocabulary (seal, signature marks, credential layouts) registered as
`founder-signature` sub-class with its own approval gate (founder only,
non-delegable — Reserved Powers applied to imagery) · counterfeit resistance
by provenance: every signature-class asset's genome records issue context,
and verification surfaces can check the registry.

## 11. Visual Version Control

Assets are immutable once approved: changes create successors
(`supersedes`/`replacedBy` — the genome lineage loci), the full chain
permanently discoverable; prompts version independently (§7); specs version
with their content (a lesson revision may re-spec its visuals). Storage
design (implementation-later): content-addressed asset store + genome
pointers — the registry never stores pixels, it governs them.

## 12. Educational Visual Taxonomy

The canonical classes (append-only, like the competency taxonomy —
`visual:<class>` slugs): `concept-diagram` · `process-flow` · `architecture`
· `comparison` · `timeline` · `data-viz` · `simulation-scene` ·
`interactive` · `animation` · `worked-example` · `assessment-visual` ·
`credential`. Each class defines: when it beats text (the Visual First
rubric: structure, relationship, sequence, scale, or state-change present →
visual candidate), its required elements, its QA checklist, its
accessibility pattern. The taxonomy is the engine's decision table (§2).

## 13. Enterprise Diagram Library

The Institution's own systems, drawn once, governed forever: the
constitutional spine · the operating hierarchy · the AOS architecture ·
the work-order road · the intelligence loop · department I/O maps ·
the learning loop. Sources: the ASCII diagrams already in the governed docs
are the SPECS — the library renders them as maintained visual assets whose
genomes cite the governing documents; a doc amendment flags its diagrams
stale (drift applied to imagery). Business-process maps and AI-workflow maps
join per department as their manuals ratify.

## 14. Simulation Visual Framework

For the Simulation Engine (Core System 3): scene classes (crisis room,
stakeholder meeting, incident war-room — the cyber IR sim already specifies
one), state visualization (simulation decision points rendered as visual
state, not walls of text), consequence visuals (what the learner's choice
did), cybersecurity attack visualizations (kill-chain stages, network
topology under attack — factual-accuracy QA is mandatory: security diagrams
reviewed by the security steward). All scene assets are taxonomy class
`simulation-scene` with per-program reuse.

## 15. Animation Framework

Purpose-bound motion: animations exist to show *change over time or causal
sequence* — never decoration (§6 honesty). Standards: every animation has a
static fallback + text walk-through (§8) · duration/pacing standards per
audience · the token system's existing keyframes as the motion vocabulary
baseline · lesson animations versioned like all assets. Formats and tooling:
implementation decisions, deferred (§17/§20 feed them).

## 16. Interactive Diagram Framework

Diagrams learners manipulate (explore an architecture, step a process,
toggle a comparison): interaction grammar (hover=detail, click=drill,
drag=never-required — accessibility) · state persisted per learner where
pedagogically useful (progress integration) · built on the existing
component system (shadcn + tokens — no parallel UI kit; Founder Doctrine) ·
every interactive is ALSO exportable as static + text (the three-modality
rule: interactive, static, textual).

## 17. Future Open-Gen-AI Integration Plan

Design-only, per the work order. Principles when implementation is
authorized: **backend-agnostic** (the engine's specs/prompts are the stable
contract; models are replaceable plugins) · **server-side only** (the
`ai-proxy` pattern — keys never client-side; the SEC-002/3 lesson) ·
**staged autonomy**: stage 1 human-in-the-loop (model drafts, steward
gates, founder approves classes) → stage 2 steward-gated bulk generation
for ratified classes → stage 3 (if ever) bounded auto-generation ONLY under
M05 P9-style preconditions. Candidate integration surface: a new edge
function per the M19 discipline, genome-first, quarantine-free by
construction (its gate chain declared before deployment — the anti-Shadow
rule). Model selection: a future work order with the §20 cost model as
input; **no vendor is chosen in this blueprint.**

## 18. API Architecture

Internal contracts (design): `avis.spec(need) → VisualSpecification` ·
`avis.compile(spec) → VersionedPrompt` · `avis.submit(artifact, spec) →
QA routing` · `avis.register(artifact, verdicts) → genome + Brain mirror` ·
`avis.retrieve(taxonomy/purpose) → assets`. All flowing through the AOS
facade (`aos.avis`) as subsystem — no parallel plumbing. External API
(generation backends): one adapter interface, versioned, per §17; webhook/
async completion per the platform's existing edge-function patterns.

## 19. Security Model

Assets are content: they ride the SAME production-write gates as text
(V5 — declared in the AVIS genome from day zero). Specific controls:
generation backends server-side with rotated keys (standing SEC actions
apply) · prompt injection surface: prompts are compiled from governed specs,
never from raw user input · signature-class assets founder-gated and
provenance-verified (§10) · asset store access-classified like all
capabilities (public/student/founder) · license/provenance mandatory on
every genome (no unlicensed imagery enters the Institution).

## 20. Cost Model

Design inputs for the founder's future decision — **no purchases, no vendor
selection here**: cost categories (generation compute per asset class ·
storage/CDN · human steward review time · accessibility production (alt
text, walk-throughs) · re-generation churn) · the governing ratio:
**cost per comprehension gain**, not cost per image — a visual that doesn't
outteach its textual twin is expensive at any price (§12 rubric as the
gate) · budget mechanics: per-program visual budgets set at program
ratification; signature-class assets outside volume budgets (founder-gated
individually) · the honest unknown: real unit costs await vendor quotes at
implementation time and will be presented as a decision package, not
assumed.

---

**Approval effect (Part D-style):** Founder approval of this blueprint moves
`service:avis` to `governed`, authorizes the AVIS engineering package's
implementation work orders in sequence (registry class enforcement → engine
spec/prompt machinery → enterprise diagram library as first content), and
makes the Design Bible's authorship (interface-experience, shelf 11) the
companion doctrine task. Until then: design only, exactly as ordered.
