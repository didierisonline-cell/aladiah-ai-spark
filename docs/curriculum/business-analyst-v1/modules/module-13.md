# Module 13 — AI Business Analysis & Decision Intelligence (authored)

> Status: **Authored — Module 13. The flagship differentiator.** Gold-standard bar; **Employment Value
> Gate** applied while writing. Every competitor teaches *Business Analysis + optional AI tools.* This
> module teaches **Business Analysis *because of* AI** — a different mindset: AI changes what gets
> specified, who decides, how it fails, and how it must be governed. Competencies: `ba:ai-analysis`,
> `ba:ai-prompting` · Simulation: **Sim 4 (AI Requirements Validation)** · feeds **Portfolio P3 (AI
> Requirements Package)** · Assessment: 20-Q `chapter_end` (pass 85%, competency at submit). Builds on
> M1 (AI Requirement Ladder), M9 (AI Product Strategy), M11 (Decision Intelligence), and sets up M14
> (Compliance & Governance).
>
> **The permanent question.** Every artifact in this module must answer one question that separates AI
> *users* from AI *transformation leaders*: **"What happens if the AI is wrong?"** It appears in each
> deliverable below. A BA who can't answer it should not be specifying AI systems.
>
> **By the end, the student can answer five questions:** (1) Should we use AI here? (2) What could go
> wrong? (3) What governance is required? (4) How do we monitor it? (5) How do we transform the business
> responsibly?

---

## Lesson 1 · The AI Requirement Ladder 2.0
**Competency:** `ba:ai-analysis` · **Output:** AI Requirements Package (P3)

### Objectives
- Specify an AI capability across the full requirement ladder, not just the functional layer.
- Treat validation, oversight, governance, and monitoring as first-class requirements.
- Produce an AI Requirements Package.

### Lesson
Module 1 introduced the AI Requirement Ladder; here it becomes the BA's signature deliverable. A
traditional requirement is one layer; an **AI requirement is a stack** — and writing only the top layer
is exactly how the failures in Lesson 3 happen. The full ladder:
1. **Functional requirement** — the behavior. *"Auto-approve eligible returns."*
2. **AI (probabilistic) requirement** — accuracy threshold + fallback. *"Auto-approve only at confidence
   ≥ 0.85; otherwise route to a human; ≥ 95% accuracy on the validation set."*
3. **Validation requirement** — how output quality is proven before trust. *"Evaluate weekly on a labeled
   set; report precision/recall; drift > 3 pts triggers review."*
4. **Human-oversight requirement** — where a person must stay in the loop. *"Decisions > $500 require human
   confirmation; every AI-assisted decision is logged."*
5. **Governance requirement** — accountability, fairness, auditability. *"Tamper-evident audit trail;
   accuracy parity across protected groups within 3 pts; named model owner."*
6. **Monitoring requirement** — the rung that makes it *2.0*: AI requirements are **never done at launch.**
   *"Continuously monitor accuracy, drift, bias, and override rate; alert on threshold breach; scheduled
   re-validation."* Models decay; a requirement that isn't monitored is a liability waiting to mature.

The first five layers ask "is it right?"; the sixth asks "is it *still* right?" — the question
deterministic systems never needed. A BA who writes all six is specifying a *trustworthy* AI system; one
who writes only layer 1 is specifying the next headline.

**What happens if the AI is wrong?** — answered structurally by layers 2 (fallback), 4 (human oversight),
and 6 (monitoring catches it). Every AI Requirements Package must make this answer explicit.

**Classify the risk before you specify the controls.** Not every AI system deserves the same rigor —
**governance proportional to risk** is the principle. Classify each AI use by the stakes of being wrong: a
**meeting summary** is *low* risk, **resume screening** *medium*, **loan approval** *high*, **medical
diagnosis** *critical.* An **AI Risk Register** records each AI system, its risk level, and the *governance
tier* it therefore requires — light-touch for low-risk, the full ladder + monitoring + human oversight for
high/critical (an approach now mirrored in regulation like the EU AI Act's risk tiers). The question it
answers: **what level of governance does this AI deserve?** Over-governing a summarizer wastes effort;
under-governing a loan model is a lawsuit. The BA right-sizes the controls.

### Practical exercise
For a real AI feature, write one requirement at each of the six ladder layers — and a one-line answer to
"what happens if the AI is wrong?"

### Artifact produced — **AI Requirements Package (P3)** + **AI Risk Register** (showcaseable)
A full-ladder AI requirements set (functional → AI → validation → oversight → governance → monitoring) with
an explicit **"what happens if the AI is wrong?"** answer — **Portfolio Artifact #3**, carried into
**Simulation 4** — *plus* an **AI Risk Register** classifying AI systems low/medium/high/critical and the
governance tier each deserves. Proof you specify AI responsibly *and* right-size the controls to the risk.

> **Gate:** capability = full-ladder AI requirements + risk classification · artifact = AI Requirements Package (P3) + AI Risk Register · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 2 · Human + AI Decision Systems
**Competency:** `ba:ai-analysis` · **Output:** Decision Authority Matrix

### Objectives
- Decide which decisions belong to AI, to humans, or to a blend.
- Match decision autonomy to stakes, reversibility, and the cost of being wrong.
- Produce a Decision Authority Matrix.

### Lesson
The central design question of AI-era analysis isn't "can the AI do this?" — it's **"who should decide?"**
There's a spectrum of decision authority: **human-only** (AI gives no input), **AI-assisted** (AI informs,
human decides), **human-approved** (AI proposes/acts, human must confirm — classic human-in-the-loop), and
**AI-autonomous** (AI decides and acts within bounds). Each is right *somewhere* and catastrophic
elsewhere — and choosing the wrong level is its own failure mode.

The BA's job is to place each decision at the right level, governed by three factors: **stakes** (a wrong
product recommendation is cheap; a wrong loan denial or medical triage is not), **reversibility** (can we
undo it? autonomous is safer when reversible), and **cost of being wrong** (the expected damage × its
likelihood). High-stakes, irreversible, high-cost-of-error decisions stay human-approved or human-only;
low-stakes, reversible ones can be autonomous. A **Decision Authority Matrix** maps decisions × authority
level with the rationale — the artifact that answers *"what decisions belong to AI and what belong to
humans?"* explicitly, before an incident answers it for you.

Real example: a lender let an AI **auto-decline** loans (autonomous) to cut costs — a high-stakes,
high-cost-of-error, regulated decision that belonged at *human-approved* at most. The first bias
complaint became a regulatory and reputational crisis. Auto-*approving* low-risk applications (reversible,
low-cost-of-error) would have been fine; auto-*declining* was authority placed at the wrong level. The
matrix would have caught it.

**What happens if the AI is wrong?** — at each authority level, name the consequence and the recovery; it's
the test of whether the level is appropriate.

**The human override principle.** Designing the authority level isn't enough; you must define **when and
how a human can override the model** — a control many companies deploy AI without ever specifying. A
**Human Override Matrix** captures, per decision: the AI recommendation, who holds **override authority**,
how an override is triggered and logged, and the **escalation path** when human and model disagree. Without
it, "human-in-the-loop" is a slogan — humans rubber-stamp the AI because no one defined their power to say
no. The override matrix makes human authority real and auditable.

### Practical exercise
List 5 decisions in a real process. Place each on the authority spectrum (human-only → AI-autonomous) using
stakes, reversibility, and cost-of-error — and state what happens if the AI is wrong at that level.

### Artifact produced — **Decision Authority Matrix** + **Human Override Matrix** (showcaseable)
A matrix of decisions × authority level (human-only / AI-assisted / human-approved / AI-autonomous) with the
stakes/reversibility/cost-of-error rationale, *plus* a **Human Override Matrix** (per decision: AI
recommendation · override authority · trigger · escalation path). Proof you design human+AI systems where
human authority is real and auditable, not a rubber stamp.

> **Gate:** capability = human+AI decision design + override · artifact = Decision Authority Matrix + Human Override Matrix · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 3 · AI Failure Investigation
**Competency:** `ba:ai-prompting` · **Output:** AI Failure Autopsy

### Objectives
- Investigate real AI failures to their root cause (requirement, assumption, or governance).
- Generalize prevention mechanisms a BA can specify.
- Produce an AI Failure Autopsy.

### Lesson
Module 6 taught the requirements failure autopsy; AI failures deserve their own, because they fail in
*new* ways. Study the landmark cases as a clinician studies pathology:
- **COMPAS** — biased recidivism scoring; no fairness requirement, no transparency (Module 1).
- **Amazon recruiting AI** — learned gender bias from historical data; no bias evaluation.
- **Zillow Offers** — an AI home-pricing model that systematically *overpaid*; the model drifted from a
  shifting market and lacked the **monitoring/guardrails** to catch it, contributing to a ~$500M loss and
  the unit's shutdown in 2021. A textbook missing-monitoring (ladder layer 6) failure.
- **Healthcare risk algorithm** (Obermeyer) — cost used as a proxy for need; a flawed *assumption*.
- **ChatGPT hallucinations** — a lawyer filed AI-fabricated case citations (Mata v. Avianca, 2023) and was
  sanctioned; no **validation** of AI output before it was trusted (ladder layer 3).

The pattern is clear: AI failures trace to a **missing rung of the ladder** — no fallback, no bias check,
no validation, no monitoring — or a wrong **authority level** (Lesson 2). An **AI Failure Autopsy** dissects
a failure into: what the AI did, which requirement/assumption/governance was missing, what validation would
have caught it, and the prevention mechanism to specify next time. Doing this turns cautionary tales into
design rules — exactly the judgment that makes an AI-era BA valuable.

**What happens if the AI is wrong?** — every one of these failures is what happens when no one asked the
question in advance. The autopsy is the answer, written after the fact; your job is to write it *before.*

### Practical exercise
Pick one real AI failure (above or from your domain). Write its autopsy: what happened, the missing
ladder rung / wrong authority level, the validation that would have caught it, and the prevention rule.

### Artifact produced — **AI Failure Autopsy** (showcaseable)
A structured autopsy of a real AI failure (cause · missing rung · prevention) — a memorable, distinctive
interview piece (*"how would you prevent another Zillow Offers?"*) that proves you design AI to fail safely.

> **Gate:** capability = AI failure analysis + prevention · artifact = AI Failure Autopsy · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 4 · AI Governance & Monitoring
**Competency:** `ba:ai-prompting` · **Output:** AI Governance Dashboard

### Objectives
- Specify the ongoing governance an AI system needs after launch.
- Monitor drift, bias, explainability, and overrides — and define escalation.
- Produce an AI Governance Dashboard spec.

### Lesson
Deterministic systems are governed at build; **AI systems must be governed for life**, because they
*change* after deployment — the world shifts, data drifts, behavior degrades. AI governance is the
discipline of keeping a deployed model trustworthy, and the BA specifies what it must watch:
- **Drift** — is accuracy decaying as inputs shift from the training distribution? (the Zillow failure)
- **Bias / fairness** — is performance staying equitable across groups over time, not just at launch?
- **Explainability** — can a decision be explained to a customer, an auditor, or a regulator? (adverse-
  action requirements, the EU AI Act's transparency duties)
- **Override / human-correction rate** — how often do humans overturn the AI? A spike is an early warning.
- **Escalation** — what triggers a human review, a rollback, or a shutdown, and who owns that call?

These become an **AI Governance Dashboard** — the Decision Intelligence of Module 11 applied to the AI
itself: a small set of governance KPIs (accuracy/drift, fairness, override rate, incident count) each with
a threshold and an escalation trigger. It is the operational answer to the permanent question: a
well-governed AI system *detects* that it's wrong and *acts* — alerts, falls back, escalates — instead of
failing silently for months (the difference between a managed risk and a Zillow).

**What happens if the AI is wrong?** — the governance dashboard is precisely the mechanism that answers it
in production: monitor → detect → escalate → correct.

**AI incident response — borrow it from security.** Cybersecurity has mature incident response; AI systems
need the same, because *when* (not if) an AI misbehaves — bias surfaces, hallucinations slip through, drift
is detected, behavior shifts — the organization must respond fast and consistently. An **AI Incident
Response Playbook** defines the steps: **Detect** (monitoring flags it) → **Contain** (fall back to
human/safe mode) → **Investigate** (root cause — Lesson 3's autopsy) → **Correct** (retrain, re-validate, or
retire) → **Monitor** (confirm the fix, watch for recurrence) — with named owners and escalation at each
step. The difference between a managed incident and a Zillow-scale crisis is whether this playbook existed
*before* the incident.

### Practical exercise
For a deployed (or proposed) AI system, spec a governance dashboard: 5 governance KPIs (drift, bias,
explainability coverage, override rate, incidents), each with a threshold and an escalation action.

### Artifact produced — **AI Governance Dashboard** + **AI Incident Response Playbook** (showcaseable)
A governance dashboard spec (drift · bias · explainability · override rate · incidents, with thresholds +
escalation), *plus* an **AI Incident Response Playbook** (Detect → Contain → Investigate → Correct → Monitor,
with owners). Proof you can keep AI trustworthy *after* launch *and* respond to failures fast — the gap most
organizations don't know they have until it's a crisis.

> **Gate:** capability = AI governance + incident response · artifact = AI Governance Dashboard + AI Incident Response Playbook · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 5 · Executive AI Transformation Roadmap
**Competency:** `ba:ai-analysis` + `ba:ai-prompting` · **Output:** AI Transformation Blueprint

### Objectives
- Advise executives on adopting AI responsibly across a business.
- Synthesize the module into a board-ready AI transformation plan.
- Produce an AI Transformation Blueprint.

### Lesson
The module culminates with the BA as **AI transformation advisor** — the person who helps a business adopt
AI in a way that's valuable *and* governed, neither hype-chasing nor paralyzed. This is where everything
converges: the capability lens (M8) identifies where AI creates strategic value; AI product strategy (M9)
places each initiative at the right altitude (feature/product/company); the requirement ladder (L1),
decision authority (L2), failure lessons (L3), and governance (L4) ensure it's done safely; and the
investment governance (M12) makes it fundable.

The deliverable is the **AI Transformation Blueprint**: **current state** (AI maturity, where value sits) →
**future state** (target AI-enabled capabilities) → **risks** (the failure modes from L3, named) →
**governance** (the operating model + dashboards from L4) → **investment** (cost, ROI, cost of delay) →
**timeline** (phased, reversible-first) → **expected outcomes** (with the metrics to prove them). It is the
artifact that makes a graduate an *advisor* a board listens to on AI — the single most differentiated piece
in the entire portfolio, and the bridge to **Module 15's capstone** and the Transformation Consultant role.

**What happens if the AI is wrong?** — the blueprint answers it at the *enterprise* level: the governance
model, the human-authority boundaries, and the kill-switch criteria (M12) that protect the business as it
scales AI. An AI transformation plan without that answer is a liability dressed as a strategy.

**Five AI projects, not a hundred.** Organizations in AI hype want to do *everything*; transformation
advisors help them do the *right few.* An **AI Opportunity Portfolio** scores candidate AI initiatives on
**impact × complexity × risk × time-to-value × strategic alignment** — connecting directly to Module 8
(which capabilities matter), Module 9 (product strategy), Module 10 (validated opportunities), and Module
12 (investment governance). It turns "let's add AI everywhere" into a prioritized, governed portfolio of a
few high-value, right-risk bets — the difference between an AI strategy and an AI shopping list.

**Ten minutes with the CEO.** The capstone skill is presenting the AI transformation case to the top of the
house. Given ten minutes, the advisor walks a board through **Current State → AI Opportunity → Risk →
Governance → Investment → Expected Outcome → Recommendation** — the Executive Narrative (Module 3) at
AI-transformation scale. The **Executive AI Transformation Board Deck** is that presentation, and it becomes
one of the strongest portfolio pieces in the program: proof a graduate can advise a CEO on adopting AI
responsibly — the defining act of an AI Transformation Consultant.

### Practical exercise
Draft a one-page AI Transformation Blueprint for a real business: current/future state, top 3 risks,
governance model, investment + timeline, expected outcomes — and the enterprise answer to "what happens if
the AI is wrong?"

### Artifact produced — **AI Transformation Blueprint** + **AI Opportunity Portfolio** + **Executive AI Board Deck** (showcaseable)
The module's capstone artifacts: a board-ready **AI Transformation Blueprint** (current → future state ·
risks · governance · investment · timeline · outcomes), an **AI Opportunity Portfolio** scoring candidate AI
initiatives (impact × complexity × risk × time-to-value × strategic alignment), and a 10-minute **Executive
AI Transformation Board Deck** (Current State → AI Opportunity → Risk → Governance → Investment → Outcome →
Recommendation). The deliverables that turn an AI *user* into an AI *transformation leader* a CEO listens to.

> **Gate:** capability = AI transformation advisory + prioritization + board pres · artifact = AI Transformation Blueprint + AI Opportunity Portfolio + Executive AI Board Deck · recruiter ✅ · public ✅ · interview ✅.

---

## Module 13 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:ai-analysis` / `ba:ai-prompting`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Full-ladder AI requirements + risk classification | **AI Requirements Package (P3)** + AI Risk Register | ✅ | ✅ | ✅ |
| 2 | Human+AI decision design + override | Decision Authority Matrix + Human Override Matrix | ✅ | ✅ | ✅ |
| 3 | AI failure analysis + prevention | AI Failure Autopsy | ✅ | ✅ | ✅ |
| 4 | AI governance + incident response | AI Governance Dashboard + AI Incident Response Playbook | ✅ | ✅ | ✅ |
| 5 | AI transformation advisory + prioritization + board pres | **AI Transformation Blueprint** + AI Opportunity Portfolio + Executive AI Board Deck | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate. **Every artifact answers "What happens if the AI is wrong?"**

## Meets the gold standard
Unique bodies · real frameworks & cases (the 6-rung AI Requirement Ladder 2.0, decision-authority spectrum,
AI failure autopsies — COMPAS, Amazon recruiting, **Zillow Offers**, Obermeyer, **Mata v. Avianca** — AI
governance/drift/bias/explainability, AI transformation blueprint) · the *"BA because of AI"* mindset · the
permanent **"what happens if the AI is wrong?"** question on every artifact · exercise + portfolio-worthy
artifact per lesson · feeds Simulation 4 + Portfolio P3 · employment-graded. **This is where Aladiah stops
being "a great BA course" and becomes the AI-era Business Transformation program.**
