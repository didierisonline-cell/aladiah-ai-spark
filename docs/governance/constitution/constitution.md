# The Aladiah Constitution

**Status: DRAFT — v0.1. No constitutional authority until founder ratification
(see `ratification.md`).**

This document does not invent new law. It composes the principles the founder
has already ratified into one founding document, so that every future
department, agent, workflow, curriculum, dashboard, and feature inherits a
single chain of authority. Where an article summarizes a canonical document,
**the canonical document prevails** until this constitution is ratified.

---

## Preamble

Aladiah exists to transform careers, not to complete courses. Its velocity is
determined by the speed of truth discovery, not the speed of coding. Its
authority flows from evidence, not opinion.

## Article I — Mission
*(source: `docs/standards/NORTH_STAR.md`, ratified)*

The goal is career transformation. Every decision must improve at least one
of: student competency, employability, income, career growth, employer trust,
placement success. Africa + Caribbean first. The quarterly question: "Does
this feature make students more employable?"

## Article II — The Decision Law
*(source: `docs/standards/LAUNCH_DECISION_PRINCIPLE.md`, ratified — the root
operating principle)*

Hypothesis ≠ Fact. Evidence creates truth; truth creates priorities;
priorities create work. No blocker without evidence. No hypothesis treated as
fact. No estimate before validation. No work without ownership. No launch
decision without a walked, live proof.

## Article III — The Architecture Test
*(source: `docs/standards/ARCHITECTURE_PRINCIPLE.md`, ratified)*

Nothing may be built unless it serves at least one Core System and blocks
none. The five Core Systems, in dependency order: Competency Measurement →
Personalization → Simulation Readiness → AI Coaching → Employer Visibility.
Competency data is the root; cosmetic work never outranks it.

## Article IV — The Competency Law
*(source: `docs/standards/COMPETENCY_TAXONOMY.md`, ratified)*

Competency slugs have one source of truth. Append-only; never rename; one
primary slug per question; populated at insert time, never backfilled.

## Article V — Governance of Change

No production publishing, deployment, or content modification happens outside
the pipeline: **Research → Evidence → Work Order → QA → Security → Founder
Approval → Deployment → Measurement → Company Brain.** Founder approval is a
recorded decision and requires evidence. Review gates run in canonical order:
QA → Security → Translation → UX.
*(implemented: `src/services/aos/orchestration.ts`, tested)*

## Article VI — The AI Workforce
*(source: `docs/agents/AGENT_OPERATING_SYSTEM.md`, ratified)*

Every agent plugs into the shared operating system — registry, memory, tasks,
orchestration, logs, permissions, health, communication, work orders, event
bus, brain, intelligence. No agent builds parallel systems. No agent publishes;
every write capability is founder-gated. Read-only agents may only own
recommendations.

## Article VII — Institutional Knowledge

Every governing document carries: name, version, status, owner, authority
level, parent, children, review dates, ratification status — registered in
`src/services/aos/governance.ts` and visible on the Founder Cockpit. A document
not in the registry has no institutional authority.

## Article VIII — Amendment

This constitution and all constitutional documents change only through the
ratification lifecycle (`ratification.md`): Draft → Review → Ratified →
Deprecated, each transition founder-decided, evidence-attached, and recorded
in the Company Brain and `changelog.md`.

---

*Drafted 2026-07-01 from the ratified canon. Awaiting founder review and
ratification.*
