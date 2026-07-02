# M05 — AI Workforce Management Manual

**Version 1.1 · RATIFIED (FD-2026-014) — binding institutional doctrine.** Inherits the M01 gold-standard structure.
Registry key: `m05-ai-workforce-management` · Genome:
`playbook:m05-ai-workforce-management`.

## 0. The Five Questions (Engineering Law — answered before work began)

1. **Why does this capability exist?** So that no intelligence operates in
   the Institution without identity, charter, accountability, and learning —
   Covenant Art. VI: AI strengthens human judgment; humans remain responsible.
2. **Which constitutional authority governs it?** The Covenant (Art. VI) →
   Constitution (Art. VI, the AI Workforce) → AI Workforce Manual
   (AGENT_OPERATING_SYSTEM, ratified canon) → AMS Framework → this manual.
3. **Which existing capability does it extend?** The AOS registry/charters/
   health/permissions machinery, the Employee Record, `run.identity`, and
   M04's AI learning rules — codified into management procedure; nothing
   parallel is created.
4. **What evidence will prove it works?** Identity coverage 100%
   (test-enforced today), zero charter breaches, fleet health computed, every
   run opening with its identity log, learning histories accumulating.
5. **How will the Company Brain learn from it?** Every hire, review,
   suspension, and retirement is Brain-recorded; performance reviews ingest
   lessons; the 90-day cycle feeds back into this manual's Improvement Log.

## 1. Institutional Metadata

| Field | Value |
|---|---|
| **Title** | AI Workforce Management Manual |
| **Accession** | M05 (permanent) |
| **Purpose** | The governance of every AI employee, specialist, department, executive function, and future autonomous workforce: hiring, charter, operation, performance, learning, discipline, retirement. |
| **Version / Status** | 1.1 · Ratified (FD-2026-014) — founder doctrine appended verbatim |
| **Authority Level** | operational |
| **Owner** | operations-platform (workforce administration) · Constitutional oversight: founder |
| **Governing canon** | Covenant Art. VI · Constitution Art. VI · AGENT_OPERATING_SYSTEM (ratified) · M04 P7 (AI learning rules) · AMS Framework v1.1 |
| **Related manuals** | M01 (executive authority) · M04 (learning) · M08 Quality (pending) |
| **Review cadence** | 90 days upon ratification |
| **Ratification status** | RATIFIED 2026-07-02 by the Founder (FD-2026-014) |

**Lifecycle record (Permanent Rule):**
| Step | Status | Evidence |
|---|---|---|
| 1 Draft | ✅ 2026-07-02 | this document, genome-first, Five Questions answered |
| 2 Engineering Review | ✅ 2026-07-02 | every procedure maps to running machinery (bootstrap, registry, health, permissions, employee records); Founder Doctrine honored — extends, never parallels |
| 3 QA Review | ✅ 2026-07-02 | procedures with entry/exit conditions; 6 KPIs well-formed; 85/85 green |
| 4 Company Brain Review | ✅ 2026-07-02 | precedent honored: AOS canon §6 (how to add an agent), M04 P7, FD-2026-007 (every AI an employee), persona boundary (personas are product surfaces, not agents) |
| 5 Founder Review | ✅ 2026-07-02 | FD-2026-014 |
| 6 Ratification | ✅ 2026-07-02 | FD-2026-014 — binding institutional doctrine |
| 7 Publication | ✅ 2026-07-02 | registered ratified; Brain mirror at next sync |
| 8 Continuous Improvement | ⏳ | first 90-day review 2026-10-02 |

## 2. Mission Link

Covenant Art. VI verbatim: AI "should strengthen human judgment rather than
replace it… Humans remain responsible for the decisions that shape lives."
This manual is that article as employment law: no anonymous intelligence, no
ungoverned authority, no unaccountable act.

## 3. Scope & Reference Model

**Governs:** the 12 chartered AI departments, the 2 student-facing personas,
the executive AI function (CEO agent), and the rules any future autonomous
workforce must satisfy before existing. **Does not govern:** what departments
produce (their manuals), model selection/infrastructure (M19, pending),
human staff (Faculty Handbook, reserved shelf 09).

```
HIRE (P1)          OPERATE (P3)              DEVELOP (P5)
charter → genome → runs open with identity → memory + lessons
registry row       cadence · gates · logs    (governed channels only)
     │                   │                        │
     ▼                   ▼                        ▼
REVIEW (P4)        DISCIPLINE (P7)           RETIRE (P8)
computed health    pause → investigate       never deleted;
+ learning record  → founder decision        genome + record persist
          every transition Brain-recorded and Event-Bus traced
```

## 4. Definitions

**AI employee** — a chartered agent: registry row + runner + AGENT_SPEC +
`ai-role` genome + permissions. **Persona** — a student-facing product
surface (Prof. Didier, Career Simulation Engine): governed as product, not
employed as agent — the boundary is constitutional (they carry no authority).
**Charter breach** — any act outside AGENT_SPEC + permissions (e.g., a write
without its gate). **Autonomous operation** — any run not triggered by a
human action (scheduler-era; preconditions in P9).

## 5. Roles, Authorities & Governance Matrix (RACI)

| Activity | Founder | operations-platform (Workforce Admin) | ceo-chief-of-staff | qa-authority | The agent |
|---|---|---|---|---|---|
| Hire (new department) | **A** (charter) | **R** (onboard) | C | C (spec review) | — |
| Charter amendment | **A** | R (commit) | C | C | I |
| Daily operation | I | C (health watch) | R (delegation) | I | **R** |
| Performance review | **A** (quarterly read) | **R** (compile) | C | C | I (record) |
| Learning & development | I | C | I | I | **R** (P5) |
| Discipline (pause/suspend) | **A** | **R** (execute) | C | C (findings) | I |
| Retirement | **A** (work order) | **R** | I | C | I |
| Autonomy preconditions (P9) | **A** (sole) | R (verify) | C | C | — |

## 6. Operating Procedures

**P1 — Hire an AI employee.** Entry: founder-approved work order (Five
Questions answered; the anti-duplication check of M03 P4 passed — does an
existing department already own this?). Steps: AGENT_SPEC (the charter) →
`ai-role` genome (identity before existence) → bootstrap block (registry row
+ runner, permissions **always** `publish:false, human_approval_required:true`)
→ drift check green (spec + genome + registry parity are test-enforced) →
first run witnessed (identity log verified). Exit: the employee appears on
the Agent Operating Grid with computed health. *Per AOS canon §6 — one block;
no parallel plumbing.*

**P2 — Charter & identity.** Every employee's identity is resolvable at all
times (`getWorkforceIdentity`); every run opens by logging it. Charter
changes are MAJOR events: work order → spec + genome amended together →
founder approval. An employee may never operate on an identity the registry
doesn't hold — that is the definition of anonymous intelligence, and it is
prohibited.

**P3 — Operate.** Runs execute under the orchestrator only (retries, logs,
health, run records); every write beyond `aos_*` flows through work-order
gates; read-only departments own only recommendations (PermissionError
otherwise — enforced). Cadences per registry; manual triggers by founder
surfaces; due-agent ticks by the founder until P9 preconditions are met.

**P4 — Performance management.** Continuous: computed health (success rate,
performance score, consecutive failures — never hand-set). Quarterly: the
Workforce Admin compiles each employee's record (performance + learning +
charter compliance + KPI contribution) into the founder's quarterly review;
persistent degradation (health `down`, failures > threshold) triggers P7
investigation, not silent tolerance.

**P5 — Learning & development.** Per M04 P7 (binding): learning only through
governed channels — memory, lessons, Brain recall; self-modification of
charter/prompt/permissions/genome is a charter breach by definition. Each
employee's learning history is auditable (Employee Record). Departments are
expected to LEARN: a department with zero lessons across two review cycles is
itself a finding (learning is a duty, not an option — FD-2026-007).

**P6 — Permissions & authority changes.** All permission changes are founder
decisions executed as reviewed commits; `publish` remains false for every
agent — publication authority is constitutionally human. Temporary elevation
does not exist; if a task needs more authority, the task flows to the
authority (work order → founder), never the reverse.

**P7 — Discipline.** Entry: charter breach, evidence in hand (logs, events,
diffs). Steps: pause (status `paused` — immediate, Workforce Admin) →
investigation (evidence compiled; the agent's identity/permissions/memory
audited) → founder decision: resume (with lesson recorded) · amend charter ·
suspend (`disabled`) · retire (P8). Every step Brain-recorded. Exit: decision
recorded with evidence; if machinery allowed the breach, a work order fixes
the machinery (the breach is also OUR defect — M04 P1 logic).

**P8 — Retirement.** Founder-approved work order → final run witnessed →
status `disabled` → genome to `retired` (never deleted; lineage names any
successor) → memory PRESERVED (institutional knowledge outlives the
employee — Covenant Art. XII) → Employee Record archived, permanently
discoverable. The Institution does not forget its workers.

**P9 — The future autonomous workforce (preconditions, founder-gated).** No
autonomous (unattended) operation until ALL are true: ① retention policy
ratified (M04 §11 work order) ② CI drift enforcement live remotely (the
one-paste install) ③ the 37 Unknowns resolved (no ungoverned production
writers coexist with autonomy) ④ escalation latency KPI proven in attended
operation ⑤ founder ratifies the autonomy charter (which agents, which
cadences, which kill-switch). Autonomy is earned by evidence, never assumed
by capability. Until then: the founder's tick is the heartbeat, by design.

## 7. Quality Gates & Standards

Employment gates (machine-enforced today): identity coverage 100%
(drift check: every bootstrap slug has spec + genome) · no publish permission
exists in the fleet · read-only ownership limits (PermissionError) ·
every run logged with identity · gates on every production write (V5).
Standard: **an intelligence the registry cannot explain does not run** —
the Shadow Factory rule applied to the workforce itself.

## 8. KPI Dictionary

| KPI | Formula | Target | Owner | Cadence | Source |
|---|---|---|---|---|---|
| Identity coverage | employees with charter+genome+registry ÷ employees | 100% (CI) | operations-platform | every CI run | drift check |
| Fleet health | mean performance score, active agents | ≥85 | operations-platform | daily | health rollups |
| Run success rate | successful runs ÷ runs (fleet, 30d) | ≥95% | operations-platform | weekly | aos_runs |
| Charter compliance | breaches (P7 entries) | 0 | founder | per incident | Brain + events |
| Learning activity | departments with ≥1 lesson per review cycle ÷ 12 | 100% | analytics-intelligence | quarterly | lesson records |
| Gate integrity (workforce view) | agent production writes through gates ÷ all | 100% (by construction) | qa-authority | continuous | V5 + work orders |

## 9. Dashboard Specification

Primary: **Agent Operating Grid** (`/founder`) — 14 cards: health, current
task, last run, approvals, blockers, readiness, risk, control-center links.
Supporting: per-agent control centers (12 routes), Employee Record (identity
+ performance + learning), `run.identity` in execution logs. Gaps registered:
no learning-activity tile; quarterly-review view is compiled, not rendered —
both follow-up work orders.

## 10. AI Workforce Binding *(reflexive)*

`operations-platform` **operates** this manual (Workforce Admin).
`ceo-chief-of-staff` **stewards** daily coordination. `qa-authority`
**reviews** hires and discipline findings. Every employee is **subject** to
it — including its operator: operations-platform's own breaches escalate
directly to the founder (no self-investigation).

## 11. Risk & Escalation Model

| Risk | L/I | Control | Escalation |
|---|---|---|---|
| Anonymous intelligence (capability without charter) | low (enforced) / high | P2 + identity coverage CI + Shadow-Factory rule | discovery = critical → founder |
| Charter drift (spec says X, behavior does Y) | medium/medium | P4 quarterly compile + M02 practice audits | P7 |
| Self-investigation conflict | low/medium | §10 reflexive rule | founder direct |
| Premature autonomy | pressure-driven/high | P9 preconditions, founder-gated, evidence-earned | none — the gate IS the control |
| Persona scope creep (product surface acquiring authority) | low/medium | §4 constitutional boundary; personas carry no permissions | governance finding |
| Fleet learning stagnation | medium/low | learning-activity KPI + P5 duty | quarterly review |

## 12. Company Brain Integration

Writes: hires, charter changes, reviews, breaches AND resolutions,
retirements — every employment event. Reads: P1 recalls prior hires and
retirements in the domain (has this department existed before? why did it
end?); P7 recalls prior discipline for pattern detection. The workforce's
history is the Institution's memory of how it learned to work.

## 13. Continuous Improvement Cycle

90-day reviews ingest: health trends, breach post-mortems, learning-activity
gaps, hire/retire lessons. Known first-cycle candidates (honest): the two
dashboard gaps (§9), the quarterly-review rendering, and — when the founder
walk closes the Unknowns — P9's precondition ③ progress.

**Improvement Log (append-only):**
| Date | Lesson | Change |
|---|---|---|
| — | *(first entries after first review cycle)* | — |

## 14. Appendices

**A. Genome:** `playbook:m05-ai-workforce-management`.
**B. Authorizing instruments:** WO-0005 · FD-2026-013 (Phase I complete; the
Five Questions) · FD-2026-007 (every AI an employee) · AGENT_OPERATING_SYSTEM
(ratified canon).
**C. Machinery inventory (evidence):** bootstrap registration (12+1 blocks),
permissions framework (publish:false fleet-wide), health rollups,
`getWorkforceIdentity` + `getEmployeeRecord`, `run.identity` logging,
identity-coverage drift checks, PermissionError enforcement, pause/disable
registry controls — all running; 85/85 tests.

---

## FOUNDER AMENDMENT — v1.1 (verbatim, FD-2026-014, 2026-07-02)

### THE EMPLOYEE PRINCIPLE

Every human employee and every AI employee shall be governed by the same institutional framework.

Differences in capability shall never create differences in accountability.

Every employee shall have: Identity · Charter · Authority · Responsibilities · Performance Metrics · Evidence · Lessons Learned · Continuous Improvement Record.

No employee shall exist outside the Registry. No employee shall operate outside a Charter. No employee shall exercise authority not expressly delegated.

### THE INSTITUTIONAL EQUALITY PRINCIPLE

The Institution shall evaluate work, not origin.

Whether a task is performed by a Founder, a human employee, an AI employee, or a future autonomous system, the same governance standards apply.

Quality is universal. Evidence is universal. Accountability is universal.

### AUTONOMY DOCTRINE

Autonomy is a privilege. Autonomy is earned through evidence.

Autonomy may be reduced, suspended, or revoked whenever institutional risk exceeds institutional benefit.

Safety shall always prevail over automation.

*(The Founder's Reserved Powers are filed at `../../constitution/founder-reserved-powers.md` — constitutional tier; referenced here as the boundary no delegation may cross.)*
