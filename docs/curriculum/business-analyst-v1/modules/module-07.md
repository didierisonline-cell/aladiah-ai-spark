# Module 7 — Process Analysis & Modeling (BPMN) (authored)

> Status: **Authored — Module 7.** Gold-standard bar; **Employment Value Gate** applied while writing.
> Sequence: …M5 align decisions · M6 engineer requirements · **M7 model processes.** A BA who can model
> and improve how work actually flows is operating on the path toward business architecture (M8).
> Competency: `ba:process-analysis` · Lab: **BPMN lab** · Simulation: **Sim 5 — Compliance
> Investigation** · feeds **Portfolio P2 (Current-/Future-State BPMN Package)** · Assessment: 20-Q
> `chapter_end` (`ba:process-analysis`, pass 85%, competency at submit). Builds on M5's Event-Storm.

---

## Lesson 1 · Process Thinking & Value Streams
**Competency:** `ba:process-analysis` · **Output:** Process Inventory

### Objectives
- Think in end-to-end processes and value streams, not departmental silos.
- Distinguish a process from a value stream and know when to use each lens.
- Produce a Process Inventory.

### Lesson
Most organizational pain lives **between** departments, not inside them — in the handoffs nobody owns.
Process thinking is the habit of following value end-to-end across those silos. A **process** is a
sequence of activities that turns inputs into an output ("handle a return"); a **value stream** is the
broader end-to-end flow that delivers value to a customer ("from purchase regret to refunded and
restocked"), cutting across many processes and functions. The value-stream lens — borrowed from **Lean**
— is where you find the cross-functional waste a single-process view hides.

The first move on any improvement work is to **inventory the processes**: name them, identify their
trigger and outcome, their owner (or the telling absence of one), and roughly where the pain is. This
prevents the classic mistake of optimizing one step while the real bottleneck sits two handoffs away.

Real example: a company chasing "slow refunds" kept optimizing the finance team's approval step. A
value-stream view showed refunds were actually stuck for days in a *handoff* between the store system
and the e-commerce system — a gap no single department owned. Optimizing finance did nothing; the
value-stream lens found the real constraint. Following value across silos is the whole skill.

### Practical exercise
For a real area, list the processes (trigger → outcome → owner). Then draw the value stream that
connects them and circle where you suspect value is stuck.

### Artifact produced — **Process Inventory** (showcaseable)
A structured inventory: processes with triggers/outcomes/owners, mapped onto the value stream, with
suspected pain points flagged. Shows you think in systems, not silos.

> **Gate:** capability = process & value-stream thinking · artifact = Process Inventory · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 2 · As-Is Modeling with BPMN
**Competency:** `ba:process-analysis` · **Output:** As-Is BPMN (Lab)

### Objectives
- Model a current-state process accurately in standard BPMN 2.0.
- Use swimlanes, gateways, and events to capture real complexity.
- Produce an As-Is BPMN model.

### Lesson
**BPMN 2.0** is the lingua franca of process modeling — a standard notation business and technical
people both read. The core vocabulary is small: **events** (start/intermediate/end — what happens),
**activities** (the work — tasks and sub-processes), **gateways** (the decisions and branches — exclusive
"either/or", parallel "and"), **sequence flows** (the order), and **swimlanes/pools** (who does what).
Master those and you can model almost any process clearly enough that everyone agrees on what it shows.

The discipline is modeling the **as-is** honestly — the process as it *actually* runs, including the
ugly parts: the rework loops, the exception paths, the manual workaround in lane 3. Modeling the
idealized version the documentation describes (rather than reality) is the cardinal sin; it produces
beautiful diagrams that improve nothing. This is where Module 4's *observation* and Module 5's
*Event-Storm* pay off — they give you the real process to model, not the official fiction.

Real example: a team modeled a loan-approval process from the policy manual — clean, linear, four
steps. The observed reality had a hidden fifth lane: officers emailing a senior manager for exception
approvals that the "system of record" never saw. The honest as-is model exposed that shadow step as
the actual bottleneck; the tidy version would have optimized a process that didn't exist.

### Practical exercise
Model a real process in BPMN (start event → activities → gateways → end), with swimlanes for each
actor. Include at least one exception path and one rework loop — the parts people leave out.

### Artifact produced — **As-Is BPMN** (Lab, showcaseable)
A clean, standards-correct current-state BPMN diagram (swimlanes, gateways, exceptions) produced in the
**BPMN lab** — a core, instantly-recognizable BA deliverable every hiring manager understands.

> **Gate:** capability = BPMN 2.0 current-state modeling · artifact = As-Is BPMN · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 3 · Gap & Root-Cause Process Analysis
**Competency:** `ba:process-analysis` · **Output:** Process Gap Analysis

### Objectives
- Analyze a process for waste, bottlenecks, and root causes (not symptoms).
- Quantify where time and value are actually lost.
- Produce a Process Gap Analysis.

### Lesson
A model is description; **analysis** is where the value is. Three lenses do most of the work. **Lean
waste** — the eight wastes (DOWNTIME: Defects, Overproduction, Waiting, Non-utilized talent,
Transportation, Inventory, Motion, Extra-processing) — gives you a checklist to spot value-destroying
activity; in office processes, **Waiting** (work sitting in queues) and **Defects** (rework) dominate.
The **Theory of Constraints** says every process has *one* bottleneck that sets the pace of the whole —
optimizing anything other than the constraint is wasted effort, so find the constraint first. And
**root-cause analysis** (5 Whys from Module 4, fishbone diagrams) keeps you fixing causes, not symptoms.

The senior move is to **quantify**: cycle time vs. *value-add* time (often shockingly small — work
spends most of its life waiting in queues, not being worked), handoff counts, rework rates. Numbers
turn "this feels slow" into "94% of cycle time is queue time between two systems," which is fundable.

Real example: a returns process took 11 days end-to-end. Analysis showed only ~40 minutes of actual
work — the other ~10.9 days were *waiting* in two queues (classic Lean Waiting waste), and one of them
was the single constraint. Fixing that one bottleneck, not the whole process, cut days. Quantified
analysis told them exactly where to aim.

### Practical exercise
On your As-Is model, mark each step value-add / non-value-add, identify the single biggest bottleneck,
and run 5 Whys on it. Estimate cycle time vs. value-add time if you can.

### Artifact produced — **Process Gap Analysis** (showcaseable)
A crisp analysis: wastes identified, the constraint named, root causes, and (where possible) cycle-time
vs. value-add numbers. Evidence you can diagnose, not just draw — exactly what employers pay analysts for.

> **Gate:** capability = waste/constraint/root-cause analysis · artifact = Process Gap Analysis · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 4 · To-Be Design & Optimization
**Competency:** `ba:process-analysis` · **Output:** To-Be BPMN

### Objectives
- Design an improved future-state process that targets the real constraint.
- Decide what to automate, eliminate, or redesign — and what to leave alone.
- Produce a validated To-Be BPMN.

### Lesson
The **to-be** process is a *design decision*, not a drawing — which means it must be validated and
agreed with stakeholders, never invented by the analyst alone (Module 1's lesson, and Module 5's
facilitation). Good redesign follows a priority order: **eliminate** unnecessary steps first
(the cheapest improvement is work you stop doing), **simplify** what remains, **automate** the
repetitive rule-based parts — and only then add new capability. Automating a wasteful step just makes
waste faster; eliminate before you automate.

**Automation Readiness — before you automate.** The full optimization ladder is **Eliminate → Simplify
→ Standardize → Automate → Augment.** Standardize the variants *before* automating — you can't reliably
automate a process that runs ten different ways — and only **augment** with AI/agentic workflows once
the process is stable, measurable, repeatable, and governed. Organizations that skip straight to "add
AI" automate chaos. Before recommending automation, score the process on four readiness questions —
**Is it stable? Is it measurable? Is it repeatable? Is it governed?** — and green-light automation only
when the answers hold.

Target the **constraint** from Lesson 3 — improvements elsewhere don't move the end-to-end outcome.
And mind the trade-offs the to-be introduces: a faster auto-approval flow may need a fraud control and
an audit trail (the conflict you'll meet again in Sim 5 and Module 14). A senior BA designs the future
state *with* its controls, not as a naive happy path.

Real example: the 11-day returns process wasn't redesigned by adding staff. The team **eliminated** a
redundant manual re-keying step, **automated** the low-risk approvals (with a confidence threshold and
an audit trail to satisfy Finance), and **routed** only exceptions to humans — collapsing the
cross-system queue that was the constraint. The to-be model showed the new flow *and* its controls, so
every stakeholder could see their interest was protected before sign-off.

### Practical exercise
Design a to-be BPMN for your process: mark each change as eliminate / simplify / automate / redesign,
target the constraint, and add one control the change requires. Note who must sign off.

### Artifact produced — **To-Be BPMN** + **Automation Readiness Scorecard** (showcaseable)
A future-state BPMN with changes labelled (eliminate/simplify/standardize/automate) and required
controls shown — *plus* an **Automation Readiness Scorecard** rating the process on stable / measurable
/ repeatable / governed, with a go / not-yet recommendation on automation. A design a hiring manager can
see drives measurable improvement — and proof you won't automate chaos.

> **Gate:** capability = future-state design + automation readiness · artifact = To-Be BPMN + Automation Readiness Scorecard · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 5 · Process Mining & AI-Assisted Analysis
**Competency:** `ba:process-analysis` · **Output:** BPMN Package (P2) · **links Sim 5**

### Objectives
- Use process mining to discover the *real* process from system event logs.
- Apply AI to accelerate process discovery and analysis responsibly.
- Produce the Current-/Future-State BPMN Package.

### Lesson
Interviews and workshops give you the process people *believe* they run; **process mining** gives you
the process they *actually* run. Tools like **Celonis** reconstruct the real end-to-end flow from the
event logs systems already produce — every variant, every rework loop, every step's true duration —
turning process discovery from opinion into data. It routinely reveals dozens of process *variants*
where everyone assumed one, and pinpoints the exact handoff where time is lost. Where the data exists,
mining is the most objective as-is you can get.

**Process Mapping vs. Process Mining — and the gap between them.** Traditional BA *maps* the process by
asking people and documenting it; the modern transformation consultant *mines* it from the data and
then **compares stated vs. real.** The gap is often where the biggest opportunities hide — the variants
nobody admits to, the rework loop everyone normalized, the "rare" exception that's actually 30% of
volume. Capturing that gap is its own deliverable: a **Process Reality Report** answering (1) what
people *say* happens, (2) what the *data* shows happens, (3) where they differ, (4) the business impact
of the gap, and (5) what should change. It's the signal-vs-noise, evidence-over-opinion discipline
(Module 4) applied to process.

**AI** accelerates the rest: drafting BPMN from a narrative, summarizing variants, suggesting
bottlenecks to investigate — all subject to the validation discipline from Modules 1–2 (AI proposes,
you verify against the real process and stakeholders; an AI-suggested "optimization" that breaks a
compliance control is a trap). The judgment stays human; the grunt work gets faster.

This lesson assembles the module into the **Current-/Future-State BPMN Package** — process inventory,
as-is model, gap analysis, to-be model, and (where available) mining evidence — **Portfolio Artifact
P2**, and the process foundation you carry into **Simulation 5 (Compliance Investigation)**, where you
trace a process against its controls. Lesson → artifact → simulation → defense.

### Practical exercise
For a real process, describe what an event log could reveal that interviews can't. Then take one
AI-suggested process improvement and write the validation check you'd run before trusting it.

### Artifact produced — **BPMN Package (P2)** + **Process Reality Report** (showcaseable)
The consolidated current-/future-state package (inventory · as-is · gap analysis · to-be · mining
evidence) — **Portfolio Artifact #2** — *plus* a **Process Reality Report** (stated vs. real, the gap,
business impact, recommendation). Carried into **Simulation 5**. Comprehensive, employer-grade proof you
can model, analyze, and redesign real processes from evidence, not opinion.

> **Gate:** capability = process mining + stated-vs-real analysis · artifact = BPMN Package + Process Reality Report (→ Sim 5, P2) · recruiter ✅ · public ✅ · interview ✅.

---

## Module 7 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:process-analysis`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Process & value-stream thinking | Process Inventory | ✅ | ✅ | ✅ |
| 2 | BPMN 2.0 current-state modeling | As-Is BPMN (Lab) | ✅ | ✅ | ✅ |
| 3 | Waste/constraint/root-cause analysis | Process Gap Analysis | ✅ | ✅ | ✅ |
| 4 | Future-state design + automation readiness | To-Be BPMN + Automation Readiness Scorecard | ✅ | ✅ | ✅ |
| 5 | Process mining + stated-vs-real analysis | **BPMN Package** + Process Reality Report (→ Sim 5, P2) | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate.

## Meets the gold standard
Unique bodies · real frameworks & cases (value-stream/Lean thinking, BPMN 2.0, the 8 wastes / DOWNTIME,
Theory of Constraints, process mining/Celonis, eliminate-simplify-automate, AI-assisted modeling; the
cross-system handoff, shadow-lane loan, and 11-day returns cases) · exercise + portfolio-worthy artifact
per lesson · builds on M4/M5 · feeds BPMN lab + Simulation 5 + Portfolio P2 · employment-graded.
