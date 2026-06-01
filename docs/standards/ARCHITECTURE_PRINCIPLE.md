# ARCHITECTURE_PRINCIPLE.md

Status: **Canonical.**

This document defines **what may enter the platform.**

- The **North Star** explains WHY we exist (career transformation).
- The **Competency Taxonomy** defines HOW competencies are named and measured.
- **This document** defines WHAT qualifies to be built.

---

## Core Principle

Every learning object, feature, workflow, assessment, simulation, AI capability, or
platform component must satisfy the **Aladiah Architecture Test.**

A feature is valid only if:

1. It directly contributes to at least one Core System.
2. It does not architecturally block any other Core System.

**Passing condition:** Serve ≥ 1 Core System · Block = 0 Core Systems.

---

## The Five Core Systems

### System 1 — Competency Measurement *(Foundation Layer)*
Measure what the learner actually knows and can do.
Examples: competency taxonomy, quizzes, assessments, competency scoring, skill graphs,
readiness scoring.
**This is the foundational system. All other systems depend on it.** Without trustworthy
competency data, the remaining systems lose value.
Priority: **Highest.**

### System 2 — Personalization Engine
Adapt learning to the individual learner.
Examples: adaptive learning paths, dynamic remediation, personalized study plans,
learning recommendations.
Consumes competency data. Cannot function without System 1.
Priority: High.

### System 3 — Simulation Readiness Engine
Develop real-world capability through practical application.
Examples: business, crisis, stakeholder, leadership, and technical project simulations.
Consumes competency data. **Produces performance data.**
Priority: High.

### System 4 — AI Coaching Engine
Provide intelligent guidance and support.
Examples: AI Professor Didier, AI Tutor, AI Career Coach, AI Interview Coach, AI Mentor.
Consumes competency data and simulation performance data.
Priority: High.

### System 5 — Employer Visibility Engine
Make learner capability visible and trusted by employers.
Examples: Aladiah Profile, competency reports, employer dashboards, readiness scores,
talent marketplace.
Consumes outputs from all previous systems.
Priority: High.

---

## Dependency Order

```
System 1 → System 2 → System 3 → System 4 → System 5
```

Competency Measurement is the **root**. Every other system depends on data it produces.
When prioritization conflicts occur, **prioritize the lowest-level dependency.**

- Competency Engine beats cosmetic UI.
- Competency tagging beats quiz animations.
- Simulation data capture beats marketing dashboards.

**Note — System 3 is also a producer.** Systems 2 and 4 are pure consumers of competency
data, but System 3 both consumes competency data AND produces performance data that
System 4 and System 5 then consume. So the chain is not purely linear: System 3 is a
second data-source root alongside System 1. Anything that captures simulation
performance is therefore foundation-grade, not consumer-grade, and should be prioritized
accordingly even though System 3 sits "after" System 1 in the arrow order.

---

## Feature Evaluation Framework

Before building anything, answer:

1. Which Core System does this serve?
2. Which future Core Systems will consume its data?
3. Does it block any future Core System?
4. Does it strengthen the Competency Engine?
5. Will it improve career-transformation outcomes?

If answers are unclear: **challenge the feature before building.**

---

## Architectural Anti-Patterns

Reject or challenge features that:

- Generate data that cannot be measured.
- Generate data that cannot be reused.
- Create isolated functionality.
- Bypass competency measurement.
- Duplicate existing systems.
- Increase complexity without improving employability.

---

## Worked Examples

**P2.1 Competency Tagging**
Serves: Competency Measurement. Enables: Personalization, Simulations, AI Coaching,
Employer Visibility. Blocks: none. → **Approved.**

**Fancy Quiz Animation**
Serves: no Core System directly. Produces no competency data. → **Low priority.**

---

## A Caution on the Test Itself

The word "eventually" is this document's main loophole: almost any feature can be argued
to *eventually* connect to a Core System. The test only has teeth if BOTH clauses are
enforced — serve ≥ 1 **and** block 0. "It'll connect someday" is not a pass; name the
system, the consuming systems, and what (if anything) it forecloses. A feature that
serves one system while making another harder later is a **trade to be made explicit,
not an automatic approval.**

This document is a gate, not a mission. It answers "does this qualify to be built?" — not
"is this worth building now?" Ordering live work is the North Star's job and depends on
revenue, sequencing, and dependencies a static gate can't see. Use both together: this
filters, the North Star prioritizes.

---

## Final Rule

If a feature improves employability, competency visibility, simulation performance,
personalization, coaching effectiveness, or employer trust, it moves closer to the
mission. If it does not, challenge it before building.

The goal is not to build more software. The goal is to build the world's most trusted
AI-powered career-transformation ecosystem.
