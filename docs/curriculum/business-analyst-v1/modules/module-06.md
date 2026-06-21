# Module 6 — Requirements Engineering (authored)

> Status: **Authored — Module 6.** Gold-standard bar; **Employment Value Gate** applied while writing.
> Sequence: M1 why · M2 operating system · M3 people & power · M4 discover reality · M5 align decisions ·
> **M6 engineer requirements.** This is the BA's classic craft — but taught for 2026: traceable,
> testable, AI-augmented, and validated. Competency: `ba:requirements` · Lab: **RTM lab** · Simulation:
> **Sim 3 — Conflicting Requirements Crisis** · feeds **Portfolio P3 (AI Requirements Package)** ·
> Assessment: 20-Q `chapter_end` (`ba:requirements`, pass 85%, competency at submit).

---

## Lesson 1 · Requirements Types & Quality
**Competency:** `ba:requirements` · **Output:** Requirements Quality Checklist

### Objectives
- Distinguish business, stakeholder, functional, and non-functional requirements.
- Recognize and write to the markers of a good requirement.
- Produce a Requirements Quality Checklist.

### Lesson
Requirements fail in predictable ways: vague, untestable, gold-plated, contradictory, or actually a
solution in disguise. The first craft skill is knowing the **levels** — *business* requirements (the
why / the outcome), *stakeholder* requirements (what a group needs), *functional* requirements (what
the system does), and *non-functional* requirements (how well — performance, security, accessibility,
the layers AI features especially demand, per Module 1's ladder). Confusing the levels is how teams
build the right feature for the wrong reason, or the wrong feature efficiently.

The second skill is **quality.** A good requirement is *unambiguous* (one interpretation),
*testable* (you can prove it's met), *atomic* (one thing), *necessary* (traces to a real need),
*feasible*, and *free of solutioning* (states the need, not the design). "The system shall be fast" is
none of these; "95% of search results shall return in < 500ms under peak load" is all of them. The
NFRs — the "-ilities" — are where requirements quietly die, because they're the easiest to omit and the
most expensive to retrofit.

Real example: a requirement read "the report should load quickly." It passed review, shipped, and
generated a production incident when "quickly" meant 200ms to the business and 8 seconds to
engineering. One untestable adjective cost a release. Quality isn't pedantry; it's the difference
between a requirement that can be built and verified and one that becomes a fight later.

**Requirements Failure Autopsy.** Elite BAs study catastrophic failures the way doctors study autopsies —
the most expensive requirements lessons are written in real disasters. The **Boeing 737 MAX (MCAS)** is
the starkest: MCAS was allowed to trigger on a *single* angle-of-attack sensor (no redundancy
requirement) on the flawed *assumption* that pilots would diagnose and correct a malfunction in seconds.
Two crashes, 346 lives. No line of code was "buggy" in isolation — the failure lived in the
**requirements and assumptions**: a missing redundancy requirement, an unvalidated human-factors
assumption, and absent failure-mode analysis. The **TSB Bank 2018 migration** (inadequate migration and
testing requirements locked ~1.9M customers out for weeks) and **Healthcare.gov** (integration and load
assumptions never validated) teach the same discipline. Run every serious requirement through the
autopsy questions: **What requirement was missing or wrong? What assumption silently failed? What
validation should have caught it? How would we prevent recurrence?** You're not just writing
requirements — you're engineering the *absence of catastrophic failure.*

### Practical exercise
Take five real requirements. Score each against the quality markers (unambiguous, testable, atomic,
necessary, feasible, no solutioning). Rewrite the two worst. Then pick one real failure (Boeing MCAS,
TSB, Healthcare.gov, or one from your domain) and run the four autopsy questions on it.

### Artifact produced — **Requirements Quality Checklist** + **Requirements Failure Analysis Report** (showcaseable)
A reusable quality checklist (markers + NFR prompts) you run every requirement through — *plus* a
one-page **Requirements Failure Analysis Report** on a real failure: the missing/wrong requirement, the
failed assumption, the validation that should have existed, and the prevention mechanism. The autopsy
report is a standout interview piece — very few candidates can analyze failure at this level.

> **Gate:** capability = requirement quality + NFRs + failure analysis · artifact = Quality Checklist + Failure Analysis Report · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 2 · Analysis & Specification
**Competency:** `ba:requirements` · **Output:** Requirements Specification

### Objectives
- Move from raw elicitation evidence to analyzed, specified requirements.
- Use models (not just prose) to specify clearly.
- Produce a Requirements Specification.

### Lesson
Elicitation (Module 4) gives you evidence; **analysis** turns it into requirements. That means
organizing, deduplicating, resolving contradictions, filling gaps, and *modeling* — because a picture
specifies more precisely than a paragraph. The professional toolkit: a context diagram (scope
boundaries), use cases or user-story sets (behavior), state diagrams (lifecycle), business rules
(constraints), and data definitions (the nouns). The right model depends on the problem; the skill is
choosing one that removes ambiguity rather than decorating the document.

Specification is where you also decide *format* to fit the delivery approach (Module 2): a formal SRS
for a regulated, predictive build; a refined product backlog with acceptance criteria for adaptive
work; usually a hybrid. Either way, every requirement must be specified well enough that a developer
and a tester read it the same way — that shared interpretation is the entire point.

Real example: a payments team specified "handle refunds" in prose; three developers built three
different behaviors for partial refunds. Respecified as a use case with explicit alternate flows
(partial, failed, duplicate, fraud-flagged) and business rules, the ambiguity vanished and rework
dropped sharply. The model did what the paragraph couldn't.

### Practical exercise
Take a requirement area from your elicitation evidence. Specify it with one model (use case or state
diagram) plus its business rules and acceptance criteria.

### Artifact produced — **Requirements Specification** (showcaseable)
A specified slice: a model + business rules + acceptance criteria for one capability — a real BA
deliverable that demonstrates you can turn messy input into build-ready specs.

> **Gate:** capability = analysis + modeling/specification · artifact = Requirements Specification · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 3 · User Stories & Acceptance Criteria
**Competency:** `ba:requirements` · **Output:** Backlog + Acceptance Criteria

### Objectives
- Write user stories that carry real user value (not "as a user…").
- Write testable acceptance criteria, including edge and negative cases.
- Produce a backlog slice with acceptance criteria.

### Lesson
In adaptive delivery, the requirement unit is the **user story** plus its **acceptance criteria**.
A good story follows **INVEST** (Independent, Negotiable, Valuable, Estimable, Small, Testable) and
names a *specific persona, goal, and value* — *"As a returns agent, I want to see a customer's full
return history so I can spot serial abusers"* — not the generic "as a user." The story is a placeholder
for a conversation; the **acceptance criteria** are where the real requirement lives.

Acceptance criteria must be **testable** and cover more than the happy path. The **Gherkin / BDD**
format — *Given / When / Then* — forces concreteness: *Given a customer with 3 prior returns this month,
When the agent opens the return, Then a high-risk flag is shown.* The discipline that separates seniors:
deliberately writing the **edge and negative cases** AI and juniors omit — the failed refund, the
duplicate request, the regulated exception. Acceptance criteria are the contract between business and
engineering, and the seed of the test cases (Module 12).

Real example: a story "agent can issue refunds" shipped with only happy-path criteria; the failure
modes (partial, already-refunded, over-limit) became production bugs. The same story with negative-case
acceptance criteria would have caught them in refinement, for free.

### Practical exercise
Write three INVEST user stories for a real feature. For one, write Gherkin acceptance criteria covering
the happy path plus two edge/negative cases.

### Artifact produced — **Backlog + Acceptance Criteria** (showcaseable)
A small, well-formed backlog slice with INVEST stories and Gherkin acceptance criteria (incl. edge
cases) — exactly what a hiring manager wants to see you can write.

> **Gate:** capability = stories + testable acceptance criteria · artifact = Backlog + AC · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 4 · Traceability & Lifecycle Management
**Competency:** `ba:requirements` · **Output:** Requirements Traceability Matrix (Lab)

### Objectives
- Trace each requirement from source to design to test.
- Manage requirements through change without losing control.
- Produce a Requirements Traceability Matrix.

### Lesson
A requirement isn't done when it's written — it lives through design, build, test, and change.
**Traceability** is the discipline that keeps that lifecycle under control: each requirement links
*backward* to the validated source/need that justifies it and *forward* to the design and the tests
that verify it. A **Requirements Traceability Matrix (RTM)** makes this visible — and it does three
jobs at once: it proves coverage (every requirement is tested), it exposes orphans (a requirement that
traces to no real need is scope creep; a need with no requirement is a gap), and — crucially for AI
work — it surfaces **unsupported/hallucinated requirements**, because an AI-fabricated item traces back
to nothing (Module 1).

**Trace the full chain, not just requirement→test.** A junior RTM has two columns (requirement, test);
a transformation-grade RTM traces the whole line of sight: **Requirement → Risk → Control → Test →
Business Outcome.** Each requirement links to the *risk* it mitigates, the *control* that addresses it,
the *test* that verifies it, and the *business outcome* it serves. This is exactly the structure AI
governance, compliance, auditability, and executive reporting demand — and it lets you answer the
executive's question, "why are we building this, and how do we know it works?", in a single row.

Then there's **change**. Requirements change; uncontrolled change is how projects die. Lifecycle
management means a light but real process: assess each change's impact via the traceability links,
get the right approval, and update the baseline — so you always know the current truth and why it
changed. In regulated work this trace is also your audit evidence (Module 14).

Real example: a program with no RTM shipped having silently dropped two requirements during churn —
discovered only when an auditor asked for coverage. A traceability matrix would have flagged the
orphaned needs immediately; instead it became a compliance finding.

### Practical exercise
Build a small RTM (5–8 rows) across the full chain: requirement → risk → control → test → business
outcome. Mark any row missing a link — each gap is a real risk.

### Artifact produced — **Requirements Traceability Matrix** (Lab, showcaseable)
An RTM that traces each requirement across the full chain — **Requirement → Risk → Control → Test →
Business Outcome** (not just requirement→test) — produced in the **RTM lab**. A senior-grade artifact
most BAs talk about but few can show; it doubles as an AI-hallucination control and maps directly to
compliance/audit and executive reporting.

> **Gate:** capability = traceability + change control · artifact = RTM · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 5 · Conflicting Requirements & Resolution
**Competency:** `ba:requirements` · **Output:** Requirements Package draft · **links Sim 3**

### Objectives
- Detect contradictions and overlaps across a requirement set.
- Resolve conflicting requirements without defaulting to seniority.
- Produce the Requirements Package that feeds Simulation 3 and Portfolio P3.

### Lesson
On any real initiative, requirements **conflict** — Customer Service wants instant refunds, Finance
wants fraud holds, Legal wants data deleted, Fraud wants data kept. Unresolved, these contradictions
surface in production as the most expensive kind of defect. The BA's job is to **detect** them early
(a structured cross-check of the requirement set — increasingly AI-assisted, per Module 13, to surface
contradictions and dependencies at scale) and **resolve** them.

Resolution reuses skills you've built: surface the *interest* behind each requirement (Module 3's
Fisher & Ury), find options that serve both where possible (instant refunds *for low-risk transactions*,
holds for the rest), and route genuine trade-offs to the right deciding authority with the trade-off
made explicit — then **record the decision and its rationale in the traceability matrix** so it stays
resolved. Resolving requirements conflict *is* stakeholder work; this is where Modules 3–6 converge.

This lesson assembles the module's outputs into a **Requirements Package** — specified, testable,
traceable, conflict-resolved requirements — the input you carry into **Simulation 3 (Conflicting
Requirements Crisis)** and a core component of Portfolio P3. Lesson → artifact → simulation → defense.

### Practical exercise
Take a real requirement set and find two genuine conflicts. For each, write the competing interests and
one resolution option, and note who should make the final call.

### Artifact produced — **Requirements Package draft** (showcaseable)
A consolidated package: specified requirements + acceptance criteria + RTM + a conflict-resolution log
— carried into **Simulation 3** and feeding **Portfolio P3 (AI Requirements Package)**. Employer-grade
evidence that you can engineer requirements end-to-end.

> **Gate:** capability = conflict detection + resolution · artifact = Requirements Package (→ Sim 3, P3) · recruiter ✅ · public ✅ · interview ✅.

---

## Module 6 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:requirements`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Requirement types + quality + NFRs | Requirements Quality Checklist | ✅ | ✅ | ✅ |
| 2 | Analysis + modeling/specification | Requirements Specification | ✅ | ✅ | ✅ |
| 3 | Stories + testable acceptance criteria | Backlog + Acceptance Criteria | ✅ | ✅ | ✅ |
| 4 | Traceability + change control | Requirements Traceability Matrix (Lab) | ✅ | ✅ | ✅ |
| 5 | Conflict detection + resolution | **Requirements Package** (→ Sim 3, P3) | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate.

## Meets the gold standard
Unique bodies · real craft & cases (requirement levels, quality markers/NFRs, models for specification,
INVEST + Gherkin/BDD, the RTM as coverage + hallucination control, interests-based conflict resolution;
the "load quickly", partial-refund, and dropped-requirement audit cases) · exercise + portfolio-worthy
artifact per lesson · builds on M3/M4/M5 · feeds RTM lab + Simulation 3 + Portfolio P3 · employment-graded.
