# AIE — The Aladiah Intelligence Engine
# Architectural Blueprint (WO-0012)

**Status: DESIGN — blueprint only. No implementation, no external AI
services installed, no vendor lock-in introduced. Awaiting Founder review
before implementation.** Registry key: `aie-blueprint` · Capability genome:
`service:aie` (proposed).

**The Five Questions:** ① The Institution's velocity is the speed of truth
discovery (LDP); the AIE is the cognitive layer that discovers, reasons over,
and explains institutional truth — Covenant Art. II (truth pursued with
humility) and Art. VII (research precedes teaching). ② Covenant →
Constitution → Intelligence Architecture (ratified lineage) → this blueprint;
the Reserved Powers bound it absolutely. ③ Extends — never parallels — the
Brain (memory), the intelligence layer (observers/confidence), the genome
graph (structure), decision packages (M06 P9), the briefing engine, and the
AVIS adapter pattern. ④ Evidence: explanation coverage 100%, calibration
measured (inferences vs. outcomes), zero ungoverned learning inputs
(test-enforceable). ⑤ Every inference, recommendation, and outcome is
Brain-recorded; the engine's own calibration is its learning.

**The four binding requirements, restated as architecture:** the AIE *learns
only from governed evidence* (§5 is its only mouth); *never bypasses the
Constitution or Reserved Powers* (§4 produces packages, never decisions);
*explains every recommendation* (§7's explanation contract is mandatory,
validated like genomes); *is vendor-independent* (§20's adapter seam is the
only place a model vendor exists — the AVIS §15 pattern, generalized).

---

## 1. Knowledge Engine

The governed substrate of what the Institution knows — **the Company Brain,
operated per M04, with a typed knowledge-object layer above it**: every
knowledge object carries category, marker, provenance, importance, and
freshness (evidence expires — LDP). The Knowledge Engine adds no second
store: it is the READ/WRITE discipline (M04 P1–P6) plus typed access for the
engines below. One memory, many readers.

## 2. Knowledge Graph

The unification of graphs that already exist: the governance graph (parents,
dependencies, the six questions), the genome graph (lineage: derived-from /
supersedes / dependencies across 210+ capabilities), the workforce graph
(departments, roles, manuals), and Brain markers (decisions ↔ subjects).
Design: one `InstitutionalGraph` query layer — `node(id) → edges(typed)` —
computed from the registries (no new store; the registries ARE the graph,
per one-fact-one-home). Future semantic edges (concept similarity) enter
only via §20 backends with provenance.

## 3. Reasoning Engine

Chains evidence into inferences **with citations at every step**:
`Inference = { claim, premises: KnowledgeRef[], method, confidence(+basis) }`.
Two tiers: **deterministic reasoning** (rules over the graph — e.g., "program
X is blocked because gate Y is NO-GO and dependency Z is unknown-classified")
implemented as pure, testable functions; **model-assisted reasoning**
(hypothesis generation, synthesis) via §20 backends — whose outputs are
*hypotheses requiring evidence*, never facts (LDP applied to our own AI).
An inference that cannot cite its premises does not exist.

## 4. Decision Engine

Extends M06 P9's decision-intelligence packages into a standard artifact:
`DecisionPackage = { question, options[], perOption: {evidence, risks,
reversibility, cost}, recommendation(+explanation §7), precedent(Brain),
whatWouldChangeThis }`. **Constitutional boundary, absolute:** the Decision
Engine produces packages; humans decide. Reserved-Powers subjects
(ratification, appointment, institutes, strategy, succession) are flagged
`founder-only` at package creation — the engine cannot even *route* them
elsewhere.

## 5. Evidence Engine

The engine's only mouth: everything the AIE learns from enters here.
Registers evidence with provenance (source, method, collected-at,
collected-by), freshness (expiry per evidence class — the LDP rule made
mechanical), and reproducibility notes. Sources today: the Brain, registries,
telemetry, walk results, KPI dictionaries. External evidence (market,
employer) enters **only after the Research Institute Handbook ratifies
sources** — the standing NOT-CONNECTED banner governs here too. Ungoverned
input is not an option the API surface offers.

## 6. Learning Engine

The Five Permanent Loops applied to intelligence itself: records every
inference/recommendation outcome (accepted? implemented? did reality agree?)
→ **calibration**: per-engine and per-advisor confidence adjustment with
evidence ("the readiness observer's 0.9 claims proved right 94% — trust
maintained; the X-forecast's 0.8 proved right 60% — confidence discounted,
finding raised"). Lessons flow to M04; miscalibration is a finding, not an
embarrassment (Covenant Art. II).

## 7. Recommendation Engine

Extends the ratified intelligence layer (observers → findings → confidence →
work orders) with the **Explanation Contract** — every recommendation
carries, validated like a genome: the evidence chain (§5 refs) · the
reasoning path (§3 inferences) · confidence WITH basis · precedent (§1) ·
counterfactual (*what evidence would change this recommendation*) · the
governed route it proposes (work order, never direct action). A
recommendation missing any element is invalid by construction.

## 8. Analytics Engine

The computed-truth layer, consolidated: scores (AIOS Score Contract), KPI
evaluation across all dictionaries, trend computation (readiness history
pattern generalized), cohort/segment analytics for students and programs.
Rules inherited whole: computed never asserted; unmeasured renders `—`;
coverage always displayed. This engine also owns the **cockpit query
consolidation** (the standing fan-out debt becomes its first implementation
work order).

## 9. AI Workforce Intelligence

The Employee Record, made analytical: fleet health trends, per-department
calibration (§6), learning-activity analysis (M05's duty measured), charter-
compliance patterns, and advisor-trust scores feeding the founder's quarterly
review. The workforce learns which of itself to trust — with evidence.

## 10. AVIS Integration

Intelligence made visible: reasoning chains rendered as governed diagrams
(taxonomy class `process-flow`/`architecture`), dashboards' visual layer,
the Knowledge Graph explorable visually. AVIS renders what the AIE explains;
both modalities preserved in the Brain. The Visual First Principle applies
to intelligence outputs like everything else.

## 11. Open-Gen-AI Integration

Language-model reasoning as a **backend behind §20's seam** — the AVIS
lesson generalized: server-side only (the `ai-proxy` pattern; the AOS canon
§5 already designed this for agent reasoning), prompts compiled from
governed context (Brain recall + graph excerpts — never raw user text into
institutional reasoning), outputs are hypotheses with mandatory §5 evidence
registration before they can support any package. The same provider may
serve AVIS rendering and AIE reasoning through two different seams — neither
defines a standard.

## 12. Company Brain Integration

Bidirectional and total: the Brain is §1's substrate; every engine writes
its outputs back (inferences, packages, calibrations) as governed knowledge;
M04's Remember Invariant extends to cognition — *a thought the Institution
acted on is a thought the Institution remembers*. The retention decision
(standing finding) becomes load-bearing here and gates §19's volume.

## 13. Founder Intelligence Dashboard

The cockpit's cognitive upgrade (extends, per AIOS design + M06 P2):
decision packages queued with explanations · advisor calibration at a
glance · early warnings with reasoning chains · the counterfactual view
("what evidence would change today's picture"). Gated on the AIOS cockpit-v2
ratification path; until then packages surface through existing panels.

## 14. Executive Intelligence Dashboard

The five briefing cadences, upgraded to explain: score movements *with
their reasoning chains*, strategic reviews with calibration retrospectives,
the annual report's "what the Institution learned about its own judgment."
Same engine, executive register.

## 15. Student Intelligence

Extends what exists (learning profiles recompute, competency snapshots,
Phase-2 rollup design, CTS): per-learner insight packages — competency
trajectory, gap explanation ("why this module next"), transformation
progress — **governed as student-classified outputs** (RLS, persona
delivery via Prof. Didier), never exposing other learners, never
manipulating (Covenant Art. IV: we protect our learners). Serves Core
Systems 1→2 directly.

## 16. Employer Intelligence

Demand signals, placement-fit reasoning, salary intelligence — **honest
gate: external ingestion remains NOT CONNECTED** until the Research Handbook
ratifies sources; until then employer intelligence is internal-only
(placement pipeline, employer feedback records) and says so. Serves Core
System 5.

## 17. Institutional Memory

Already three-redundant (git · registry · Brain) — the AIE adds the
*cognitive index*: what was decided, why, on what evidence, with what
outcome — queryable as precedent (§1) and as calibration data (§6).
Memory that cannot be reasoned over is storage; this makes it memory.

## 18. Prediction & Forecasting

M06 P5's honesty, extended into capability: **tier 1 (now)** trend
projection with stated basis + horizon · **tier 2 (gated)** statistical
models — enter only with backtesting evidence against institutional history,
validated and founder-ratified per model · **tier 3 (future)** model-
assisted scenario reasoning via §20 — always labeled hypothesis. The
permanent rule: *a forecast's confidence is earned by its track record*
(§6 calibrates forecasters like every advisor).

## 19. Continuous Learning

The engine improves itself only through governed channels (M04 P7 binds the
AIE like any employee): calibration updates, prompt/rule revisions as
reviewed commits, backtest-driven model promotion — never silent
self-modification. Its 90-day review ingests its own calibration report:
the Intelligence Engine is the first system whose performance review is
computed by itself and audited by others.

## 20. Future AI Plug-in Architecture

The AVIS §15 pattern, generalized — **the only place a vendor exists**:

```ts
interface CognitiveBackend {
  id: string; version: string;
  capabilities(): { reasoning?: boolean; embedding?: boolean; forecasting?: boolean };
  reason(context: GovernedContext, task: ReasoningTask): Promise<Hypothesis[]>; // hypotheses, never facts
  cost(task: ReasoningTask): Promise<CostEstimate>;
}
```
Registered + **founder-enabled** only (the renderer registry pattern);
server-side adapters; per-backend budgets and rate limits (the AVIS §12–13
machinery reused); model upgrades change capability, never identity (M04 P7)
— the Institution's judgment survives every model that will ever run it.

---

## Governance & sequencing

AIE's genome enters `proposed`; Founder approval moves it to `governed` and
authorizes implementation work orders in dependency order: ① Evidence Engine
+ Explanation Contract (pure, testable — the mouth and the mandate) ·
② Knowledge Graph query layer (over existing registries) · ③ deterministic
Reasoning + Decision packages · ④ Learning/calibration · ⑤ Analytics
consolidation (kills the cockpit fan-out debt) · ⑥ backends via §20 (server-
side, founder-deployed). Preconditions carried honestly: the retention
decision (M04 §11) gates §19 volume; the Research Handbook gates §16;
AIOS cockpit-v2 ratification gates §13's full form. Until approval:
not one line of implementation.
