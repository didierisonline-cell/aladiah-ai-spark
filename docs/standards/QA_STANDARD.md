> **Status: Canonical** — Required reading for: Claude Code · AI agents · QA agents · developers · product owners.
> Part of the Aladiah platform canon (`/docs/standards`): NORTH_STAR (why) · ARCHITECTURE_PRINCIPLE (what qualifies) · COMPETENCY_TAXONOMY (how competency is named) · QA_STANDARD (what "Ready" and "Done" mean).
> Append-only where noted; do not delete or fork. Changes to this document are platform-level decisions.

# QA_STANDARD.md — Aladiah QA & Launch-Readiness Standard v1.3

**A checkbox is a claim. Evidence is proof. Nothing reaches Founder Review on a claim.**

This standard defines what "Ready" and "Done" mean for every division, what counts as
evidence, how defects are ranked, and what the Founder is allowed to be interrupted for.
It exists to **reduce Founder review volume while increasing confidence.**

## The Global Gate

Nothing reaches Founder Review unless all four are satisfied, in order:

```
Definition of Ready  →  Definition of Done  →  Evidence  →  QA Approval  →  Founder Review
```

- **DoR before DoD is sacred.** You cannot "do" what was never ready. Work that fails DoR
  is rejected at intake — it never enters QA.
- **No artifact, no green check.** Every DoD item carries a required evidence type (§ Evidence
  Schema). A check without its artifact is not complete.
- **Severity governs the gate** (§ Severity Tiers). Blockers stop launch. Majors proceed with
  an owner and a date. Minors never stop launch.

## Founder Review Eligibility

A Founder Review may only occur when **all** of the following hold:

```
DoR passed
DoD passed
Evidence attached
No open Blockers
Security approved
QA approved
```

If any is missing, the Founder Review is **automatically rejected** before it reaches the
Founder. This is enforcement, not courtesy — it protects Founder time and guarantees that
anything the Founder sees is already proven. Security signs off before QA; QA signs off before
the Founder.

## Severity Tiers

Every defect is ranked. The rank decides what happens to the launch.

| Tier | Meaning | Launch effect | Examples |
| --- | --- | --- | --- |
| **BLOCKER** | Core student or money path is broken | **Launch stops.** Escalates to Founder. | Payment broken · login broken · quiz submission broken · progress not saving · certificate failure · exposed secret · RLS hole |
| **MAJOR** | Wrong or missing, but not path-breaking | Launch may proceed **with named owner + due date** | Wrong translation · simulation scoring error · missing lesson · dashboard calculation wrong |
| **MINOR** | Cosmetic / non-functional | **Never stops launch.** Logged to backlog. | Typo · alignment · spacing · cosmetic icon |

Only **Blockers** and **Approval requests** are allowed to interrupt the Founder. Everything
else is resolved at team level.

## Evidence Schema

A division is not "Done" until each check carries its required evidence. No evidence = not complete.

| Check | Required Evidence |
| --- | --- |
| Lesson QA | reviewer name + date + lesson URL + review notes |
| Quiz QA | exported question list + score results |
| Simulation QA | recording + transcript + scored outcome |
| Translation QA | native-reviewer sign-off ID |
| Payment QA | test-transaction evidence (success **and** failure path) |
| Certificate QA | issued certificate ID |
| Security QA | scan report + verification results |

Cultural/native review maps to the existing voice architecture — native reviewers for
FR/DE/ZH/AR/JA, LaSean-tier for EN/ES. Do not invent a second reviewer map.

## Rejection Protocol

Every QA rejection is a tracked record with a clock. Without the clock, work rots silently in
"almost ready."

```
Rejected By:
Rejected Date:
Reason:
Severity:        (Blocker | Major | Minor)
Owner:
Due Date:
Escalation Date:
```

A rejection that passes its Escalation Date without resolution escalates one level. A Blocker
rejection escalates to the Founder.

## Launch Command Center

Severity *ranks* a defect; the Command Center *tracks* it. Every open Blocker and Major is a row
in one live registry — the single source of truth the CEO Brief reads from. Minors are counted,
not tracked individually.

Every Blocker carries:

```
Blocker ID        Title             Owner
Date Opened       Target Fix Date   Evidence Link
Current Status
```

Example:

```
BLK-023   Stripe Webhook Validation Failure
Owner:    Security Lead
Opened:   2026-06-21
Target:   2026-06-22
Evidence: Vercel log URL
Status:   In Progress
```

IDs are sequential and permanent (`BLK-###` Blockers, `MAJ-###` Majors). A Blocker is never
deleted — it is closed with its resolution evidence, so the registry doubles as the audit trail.

---

# Division Standards

Each division below carries a Definition of Ready (intake gate) and a Definition of Done
(exit gate). DoD items inherit their evidence type from the Evidence Schema above.

## Program QA

**Definition of Ready** — a program cannot enter QA until:
- *Structure:* modules defined · learning objectives defined · competencies mapped ·
  certification mapping defined · employer mapping defined.
- *Content:* lessons drafted · quizzes drafted · exams drafted · simulations drafted ·
  projects drafted.
- *Translation:* translation-ready, no hardcoded content.

**Definition of Done**
- *Lessons:* 100% complete · reviewed · no placeholders · no AI hallucinations · examples validated.
- *Quizzes:* 20+ question pool · rotating questions · explanations present · difficulty balanced.
- *Simulations:* realistic · deliverables included · rubrics included · stakeholder conflict included.
- *Portfolio:* a real artifact is produced.
- *Interview:* interview preparation included.
- *Employer:* skills mapped to jobs.
- *QA:* all checks passed with evidence.

### Content Asset Gates (DoR / DoD)

A program is the sum of its assets. Each asset carries its own gate: one that fails its DoR
cannot be started, and one that fails its DoD cannot count toward program readiness.

- **Lesson** — *DoR:* learning objective · competency tag · difficulty level · expected outcome.
  *DoD:* written · reviewed · published · translation scaffolded · competency tagged.
- **Quiz** — *DoR:* competency mapped · passing score set · explanations required.
  *DoD:* questions validated · answers verified · passing score verified.
- **Simulation** — *DoR:* scenario · rubric · expected decisions · scoring criteria.
  *DoD:* scenario tested · rubric tested · score tested.
- **Program** — *DoD:* lessons · quizzes · simulations · portfolio · interview prep · certification
  all exist and have each passed their own gate.

## Translation QA

**Definition of Ready** — translation files exist · language architecture exists · no
untranslated placeholders.

**Definition of Done** — 100% translated across website · portal · courses · quizzes ·
simulations · AI Tutor (localized). Validation: native review · cultural review · no mixed
languages.

## Brand QA

**Definition of Ready** — approved logo exists · brand guide exists.

**Definition of Done** — logo placed on header · footer · mobile · login · signup · portal ·
certificates · favicon · social previews. Consistency: colors · typography · spacing · mobile verified.

## Payment QA

**Definition of Ready** — Stripe configured · products configured · plans configured.

**Definition of Done**
- *Success path:* checkout works · subscription activates · access unlocks.
- *Failure path:* failed payment handled · cancel works · downgrade works · retry works.
- *Founder visibility:* founder dashboard updated.

## Security QA *(Blocker-tier division)*

Live surfaces requiring this gate: Stripe · Supabase · authentication · certificates · student data.

**Definition of Ready** — auth, payments, and data layers exist and are reachable in a test environment.

**Definition of Done** (all are Blocker-tier; any failure stops launch). Security signs off before Founder Review.
- Stripe checkout verified.
- Stripe webhook signature validation verified.
- RLS policies verified.
- Founder routes protected.
- Admin routes protected.
- User (student) permissions verified.
- PII handling reviewed.
- Secrets management verified (none exposed in client code / bundle).

## Marketing QA

**Definition of Ready** — strategy approved · target audience defined · objective defined.

**Definition of Done** — content on brand · fact-checked · CTA included · visual approved.
Analytics: tracking enabled · attribution enabled · KPI assigned.

## Media QA *(future movies / daily shows)*

**Definition of Done** — story compelling · educational · accurate. Production: audio clean ·
video clean · branding correct. Distribution: YouTube · Shorts · Instagram · TikTok · Facebook versions.

## Analytics & Intelligence Division

This division tells the CEO Agent whether Aladiah is winning, so its definitions are the most rigorous.

- **Program Analytics** — Done: completion rates · quiz performance · simulation performance · employability tracked.
- **Student Analytics** — Done: active users · retention · churn · learning velocity · language usage tracked.
- **Revenue Analytics** — Done: MRR · ARR · churn · conversion · revenue forecast tracked.
- **Marketing Analytics** — Done: traffic · leads · conversion · cost per lead · cost per acquisition tracked.
- **Employer Analytics** — Done: placements · interviews · employer satisfaction tracked.
- **Content Analytics** — Done: watch time · engagement · shares · leads generated tracked.
- **Forecasting** — Done: student · revenue · hiring · capacity forecasts available.
- **Competitive Intelligence** — Done: monthly competitor report · quarterly market report ·
  AI-education trends report · salary-trend report.

---

# Reporting — Exception-Based, Not Scheduled Noise

Five guaranteed status emails a day train the reader to ignore all of them. The Founder gets
**one** scheduled brief and is otherwise interrupted only by signal.

## Always send

```
9:00 PM — CEO End-of-Day Brief   (every day, no exceptions)
```

The Brief is a **scoreboard, not a narrative.** Fixed shape:

```
Open Blockers:  2
Majors:         4
Minors:        11

Launch Readiness:
  BA     88%
  PM     72%
  Scrum  63%
  DA     15%

Top Risk:           Stripe webhook validation incomplete (BLK-023)
Decisions Needed:   ...
Tomorrow's Priorities: ...
```

Readiness percentages come straight from the **Launch Readiness Formula**; the Blocker/Major/Minor
counts and the Top Risk come straight from the **Launch Command Center**. No prose summaries — the
numbers are the report.

## Event-triggered only — send immediately when

```
New blocker            Deadline missed
Launch readiness drops  Payment failure
Critical bug           Security issue
```

## The accountability block

Every email — scheduled or triggered — answers:

```
What changed?   What broke?   What improved?
What is blocked?   Who owns it?   When will it be fixed?   Evidence?
```

Percentages without these answers are not a report.

## What the Founder receives

The Founder Review inbox receives **only**: Blockers · Approval requests · the daily 9 PM CEO Brief.
All other status remains at team level. **Objective: reduce Founder review volume while increasing confidence.**

---

# Launch Readiness Formula

A program is not "launch-ready" by opinion. Readiness is scored, weighted by what moves a
student toward career transformation:

| Dimension | Weight |
| --- | --- |
| Content | 25% |
| Assessment | 20% |
| Simulation | 20% |
| Portfolio | 10% |
| Certification | 10% |
| Translation | 5% |
| Security | 5% |
| QA Signoff | 5% |

Thresholds:

```
90%  =  launchable   (MVP — launch and improve weekly)
95%  =  flagship      (the bar for a program we put our name behind)
```

Security and QA Signoff carry low weight but are **gating, not optional**: a program scoring
95% with an open Security Blocker does not launch. The formula ranks readiness; **severity
still holds the gate.**

---

# Launch Doctrine

The curriculum workstream's bottleneck is **publishing**. The QA workstream's bottleneck is
**evidence**. These findings are consistent: Aladiah does not need more curriculum to launch —
it needs proof that what exists is ready.

An MVP launches when these four are true and evidenced:

1. Published student paths.
2. Evidence-based QA (this standard, enforced).
3. Student-completable programs.
4. Payments + certificates working.

"Student-completable" is concrete: one flagship program runs this path flawlessly, end to end:

```
Sign Up → Subscribe → Learn → Pass Exam → Submit Capstone → Earn Certificate
```

When that single flow works, Aladiah has a real MVP and can launch while the rest of the
ecosystem matures. Cyber (Program #5) stays authored and ratified but does not delay launch.

Once true, launch and improve curriculum every week thereafter.

## The next 30 days — five launch tracks

To launch fast, QA focuses on five tracks only. If these five work flawlessly, Aladiah can
launch and acquire students while the rest of the platform matures. Everything else is
secondary until these five are evidenced and Blocker-free.

```
1. Authentication
2. Payments
3. Learning path (course → lesson → quiz)
4. Simulations
5. Certificates
```

---

*Ratified as Aladiah QA Standard v1.2. Supersedes v1.1 and v1.0 (informal). v1.1 added: Evidence
Schema, Severity Tiers, Rejection Protocol, Security QA division, exception-based reporting.
v1.2 added: Founder Review Eligibility (auto-reject gate), Content Asset DoR/DoD gates, the
weighted Launch Readiness Formula (90% launchable / 95% flagship), the expanded eight-point
Security QA checklist, and the 30-day five-track launch focus. v1.3 added: the Launch Command
Center (Blocker/Major registry with permanent IDs as audit trail), the scoreboard-format CEO
Brief, and the concrete end-to-end student-completable path as the MVP definition.*
