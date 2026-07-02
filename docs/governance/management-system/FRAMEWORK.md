# The Aladiah Management System (AMS) — Framework v1.0

**Status: DESIGN — awaiting Founder review (FD-2026-009). No manual is
authored until the Founder approves this framework.** Registry key:
`ams-framework`. The AMS occupies the **Operational Policies** tier of the
constitutional spine — between Department Charters and Implementation —
exactly where the Founder Constitutional Decision of 2026-07-02 placed it.

---

## 1. Purpose

The Management System is **how the Institution is run, written down** — the
complete, governed set of operating manuals by which Aladiah is managed for
decades, by any steward, human or AI, without dependence on any individual's
memory. The Canon says what Aladiah *is* and *may do*; the Management System
says how Aladiah *does it, repeatably*. If the Canon is the genome of the
Institution, the AMS is its physiology.

## 2. Position in the Institution

```
CANON (Covenant → Constitution → Founder Standards → Organizational Charter)
   │  authorizes
   ▼
EXECUTIVE OFFICE (Founder + CEO agent: directives, ratifications, approvals)
   │  directs through
   ▼
MANAGEMENT SYSTEM (this framework + 20 permanent manuals)  ←── you are here
   │  operates
   ├─► INSTITUTES (future org units — Organizational Charter, Vol III)
   ├─► DEPARTMENTS (12 chartered) ─► AI WORKFORCE (governed employees)
   │  every act recorded in
   ├─► INSTITUTIONAL REGISTRY (each manual = a governed capability genome)
   └─► COMPANY BRAIN (manuals mirrored; lessons feed manual revisions)
```

Rules of the diagram: authority flows down only through named documents;
evidence flows up only through measured KPIs and recorded lessons; nothing
operates outside a manual once its manual is ratified.

## 3. The Universal Manual Template

Every manual, without exception:

```
M<NN> — <Title>
1. Institutional Metadata (the standard block: title, purpose, version,
   status, authority, owner, genome id, governing canon, related manuals,
   review cadence, ratification status, revision + approval history)
2. Mission Link — which Covenant articles and Core Systems this manual serves
3. Scope — what it governs; what it explicitly does not
4. Definitions — terms owned by this manual (one home per term)
5. Roles & Authorities — who may do what (humans and AI, by charter)
6. Operating Procedures — the numbered, repeatable procedures
7. Quality Gates — what must pass before outputs count
8. KPIs — this domain's dictionary (formula · target · owner · cadence · source)
9. Dashboards — where this domain's computed truth is displayed
10. AI Workforce Binding — which agents execute, steward, review
11. Failure & Escalation — what breaks, who is told, how fast
12. Records — what this manual writes to the Brain, and when
13. Improvement Log — lessons that changed this manual (append-only)
14. Appendices
```

## 4. Governance rules for manuals

1. **A manual is a capability**: genome of type `playbook`, complete before
   the manual is drafted (genome-first, per the ratified standard).
2. **Registered on arrival**: every manual file registers in the governance
   registry; the drift check fails CI on unregistered manuals.
3. **One owner** (a chartered department or the founder); "shared" is not an
   owner. Owners answer for currency, accuracy, and their KPI dictionaries.
4. **Canon supremacy**: a manual may implement canon; it may never contradict
   or extend it. Discovering a needed canon change is a Founder submission,
   never a manual edit.
5. **No orphan procedures**: any recurring institutional activity not covered
   by a manual is a registered gap, not an informal practice.

## 5. Versioning

`MAJOR.MINOR`. MINOR = clarifications and additions inside approved scope
(owner-approved, QA-gated). MAJOR = scope, authority, or procedure changes
(full approval workflow, founder sign-off). Every change is a typed history
event with evidence; genomes' evolution loci mirror manual versions. Nothing
is renumbered; manual ids (M01–M20) are permanent accession numbers.

## 6. Ownership

Assigned in the Catalog (below) by department charter alignment. Owner duties:
keep procedures true to practice (drift between manual and reality is a
finding), maintain the domain KPI dictionary, run the review cadence, record
lessons. Ownership transfers are approval-workflow events, recorded in the
genome's lineage.

## 7. Review cadence

Ratified manuals: **90 days** (or after any major incident in scope, whichever
first). Draft/review: **14 days**. Reviews are due-dated in the registry and
surface on the cockpit exactly like every governance review — silence is not
compliance.

## 8. Approval workflow

```
Owner drafts (genome exists first)
  → QA gate (structure vs. template; procedures testable; KPIs well-formed)
  → Security gate (when the manual touches secrets, PII, payments, or access)
  → Founder approval (ratification per the constitutional lifecycle)
  → Registered ratified · mirrored to Brain · in force
```
All transitions ride existing machinery: work orders, evidence-gated
approvals, `recordRatification()`. No parallel approval system.

## 9. Quality requirements

Written to be executed: numbered procedures with entry/exit conditions;
every claim evidence-backed or marked unmeasured; every KPI computed, never
asserted; plain language (a new steward can operate from the manual alone);
translations follow the Localization manual once ratified; accessibility of
the manuals themselves follows the documentation standard.

## 10. Relationship to Capability Genomes

Bidirectional: each manual **is** a genome (type `playbook`), and each manual
**is referenced by** the genomes of the capabilities it operates (their
locus-10 playbook field). The registry can therefore answer both "how is this
capability operated?" and "which capabilities does this manual govern?" —
with drift checks on both directions.

## 11. Relationship to the Company Brain

Every manual mirrors to the Brain on ratification (`governance-record`).
Every lesson recorded in a manual's scope (`recordLessonLearned`) cites the
manual; accumulated lessons are the mandatory input to each review cycle —
the Five Permanent Loops applied to management itself: the Institution's
manuals learn.

## 12. Relationship to KPIs

Each manual owns its domain's KPI dictionary (template §8) under the Score
Contract discipline: formula, target (or `founder-set pending`), owner,
cadence, source — computed, never asserted. Domain KPIs roll up to the
institutional scores per the AIOS design once ratified.

## 13. Relationship to Dashboards

Each manual names the dashboards that display its domain (template §9) —
and those dashboards render only computed truth. A manual whose domain has no
dashboard states so as a registered gap.

## 14. Relationship to AI Workforce Specifications

Template §10 binds each manual to the agents that execute it, in charter
terms: which agent operates, stewards, reviews; what remains founder-only.
An agent's `getWorkforceIdentity()` playbook field resolves to the manuals it
executes — every AI employee can always answer "which manual am I running?"
