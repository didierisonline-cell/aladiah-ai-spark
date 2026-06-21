# Module 14 — Regulatory, Risk & Compliance (authored)

> Status: **Authored — Module 14.** Gold-standard bar; **Employment Value Gate** applied while writing.
> This is where governance gets teeth. Most compliance courses **teach regulations**; this module teaches
> **how regulations change decisions** — the difference between a policy writer and a transformation
> leader. Competency: `ba:compliance` · Lab: **Compliance Matrix lab** · Simulation: **Sim 5 (Compliance
> Investigation)** · Assessment: 20-Q `chapter_end` (`ba:compliance`, pass 85%, competency at submit).
> Builds on M6 (compliance requirements), M12 (risk in the business case), and M13 (AI governance).
>
> **The permanent question.** Every artifact in this module must answer one question that separates policy
> writers from transformation leaders: **"What is the consequence if this control fails?"** A control with
> no understood failure consequence isn't a control — it's paperwork.

---

## Lesson 1 · Regulatory Impact Assessment
**Competency:** `ba:compliance` · **Output:** Regulatory Impact Assessment

### Objectives
- Translate a regulation into the business *decisions* it forces, not its text.
- Identify which requirements and controls a regulation changes.
- Produce a Regulatory Impact Assessment.

### Lesson
The most common compliance failure in BA work is **memorizing regulations** — reciting what GDPR or SOX
*says* — instead of analyzing what they *change.* Executives don't need a BA who can quote Article 17; they
need one who can say *"because of GDPR, we must change how we collect consent, how long we retain data, and
how we handle deletion — here are the specific decisions and requirements that change, and here's what
happens if we don't."* Compliance is decision analysis, not recitation.

A **Regulatory Impact Assessment** does exactly that translation: for each applicable regulation
(GDPR/HIPAA/PCI/SOX and their kin — by data, geography, and industry), it maps the **business decisions and
requirements that must change**, the **controls** they imply, and the **consequence of non-compliance**
(GDPR fines reach 4% of global revenue; HIPAA and PCI carry their own teeth). The senior move is starting
from the *decision*: "what must we now do differently, and what's the cost if we don't?" — which turns an
intimidating legal text into a concrete, fundable change.

Real example: a product team treated "GDPR compliance" as a checkbox and kept collecting data "in case it's
useful." A Regulatory Impact Assessment reframed it as decisions: collect only what's necessary (data
minimization), define retention per purpose, build consent + deletion flows — each a requirement with a
cost, and each with a non-compliance consequence in the millions. The regulation became a set of design
decisions the business could actually act on.

**What is the consequence if this control fails?** — for each mapped requirement, name the regulatory,
financial, and reputational consequence. That column is what makes leadership fund the work.

### Practical exercise
Pick a regulation relevant to a real system. Map 3–4 business decisions/requirements it forces, the control
each implies, and the consequence if that control fails.

### Artifact produced — **Regulatory Impact Assessment** (showcaseable)
A regulation-to-decision map (applicable regs → changed decisions/requirements → controls → consequence of
non-compliance) — proof you turn regulation into fundable business decisions, not legal recitation.

> **Gate:** capability = regulatory impact analysis · artifact = Regulatory Impact Assessment · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 2 · Risk Quantification
**Competency:** `ba:compliance` · **Output:** Risk Exposure Register

### Objectives
- Move risk from High/Medium/Low to quantified, executive-grade numbers.
- Estimate probability, impact, exposure, and expected loss.
- Produce a Risk Exposure Register.

### Lesson
Most risk registers stop at **High/Medium/Low** — colors that feel rigorous and inform nothing, because you
can't compare or fund a "high." Executives think in **money and probability**, so quantify: **probability**
(how likely, per year), **impact** (the cost if it happens), **exposure** (what's at stake), and **expected
loss** (probability × impact — the risk-adjusted number you can actually budget against). "High risk"
becomes *"15% annual probability of a breach costing ~$4M = ~$600k expected annual loss"* — a number that
justifies a $200k control on its own (and pairs with Module 12's cost-of-delay and ROI thinking).

Quantification also enables **prioritization**: with expected-loss numbers, you rank risks by what they
actually cost the business in expectation, not by who shouted loudest in the risk workshop. It's the same
move as Module 11's decision intelligence, applied to risk — turning a wall of red cells into a ranked,
fundable list. Even rough quantification (orders of magnitude) beats color-coding, because it forces the
conversation into the units executives decide in.

Real example: a security team's register had 30 "high" risks and no way to choose. Quantifying expected loss
collapsed it to three risks carrying 80% of the exposure — and the business funded controls for *those*
first. The colors hid the signal; the numbers revealed it.

**What is the consequence if this control fails?** — the expected-loss figure *is* the consequence,
quantified. Make it explicit per risk.

### Practical exercise
Take 5 real risks. For each, estimate probability, impact ($), and expected loss. Rank them by expected loss
and note which control you'd fund first.

### Artifact produced — **Risk Exposure Register** (showcaseable)
A quantified risk register (risk · probability · impact · exposure · expected loss · owner), ranked by
expected loss — proof you speak risk in executives' language and can prioritize controls by what they're
actually worth.

> **Gate:** capability = risk quantification · artifact = Risk Exposure Register · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 3 · Controls & Assurance
**Competency:** `ba:compliance` · **Output:** Control Matrix

### Objectives
- Design controls that actually mitigate a named risk, and prove they work.
- Trace obligation → risk → control → test → evidence.
- Produce a Control Matrix.

### Lesson
A **control** is a safeguard that reduces a specific risk to an acceptable level — **preventive** (stops it
happening), **detective** (catches it when it does), or **corrective** (fixes it after). The discipline that
separates real assurance from theater is **traceability**: every control must trace back to the **risk** and
**obligation** it addresses, and forward to the **test** that verifies it works and the **evidence** that
proves it (the full-chain RTM from Module 6, applied to compliance). A control with no test is a hope; a
control with no evidence is unprovable at audit.

This **Risk → Control → Test → Evidence** chain is the backbone of assurance across every regulated domain —
**AI, cybersecurity, healthcare, banking, government** — and the framework auditors, regulators, and boards
all speak (the "three lines of defense" model formalizes who owns each part). A BA who can build a **Control
Matrix** — mapping each obligation/risk to its control, the control type, the test, the evidence, and the
**owner** — is producing the artifact that makes compliance *demonstrable*, not just asserted. It's also the
single most reusable deliverable in this module.

Real example: an organization "had controls" but failed an audit because none were *evidenced* — they
couldn't prove the controls operated. A Control Matrix linking each control to a test and a stored evidence
artifact turned a failed audit into a passed one the next cycle, and surfaced two obligations with **no**
control (pure gaps) that everyone had assumed "someone handled."

**What is the consequence if this control fails?** — a required field per control: the risk it stops
materializing, and the regulatory/financial/safety impact if it doesn't.

### Practical exercise
For 3 risks/obligations, build a Control Matrix: control + type (preventive/detective/corrective) + test +
evidence + owner + "consequence if it fails." Flag any obligation with no control.

### Artifact produced — **Control Matrix** (Lab, showcaseable)
A control matrix (obligation/risk → control → type → test → evidence → owner → failure consequence) produced
in the **Compliance Matrix lab** — the demonstrable-compliance artifact every regulated industry needs and
the most reusable deliverable in the module.

> **Gate:** capability = controls + assurance traceability · artifact = Control Matrix · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 4 · Executive Risk Decisions
**Competency:** `ba:compliance` · **Output:** Risk Treatment Plan

### Objectives
- Frame risk as the four decisions executives actually make.
- Recommend accept / mitigate / transfer / avoid with residual-risk clarity.
- Produce a Risk Treatment Plan.

### Lesson
Executives never ask "what is the risk?" — they ask **"what do we do about it?"** And there are only four
answers (the ISO 31000 risk-treatment options): **Accept** (the residual risk is tolerable; document and
own it), **Mitigate** (reduce probability or impact with controls — Lesson 3), **Transfer** (shift it to
someone else — insurance, contractual indemnity, outsourcing), or **Avoid** (don't do the risky thing at
all). The BA's job is to recommend the right treatment per risk, with the cost of the treatment weighed
against the expected loss it removes (Lesson 2), and the **residual risk** that remains after treatment made
explicit — because "mitigated" never means "gone."

This reframes compliance from a wall of obligations into a set of **business decisions** leadership can make
with eyes open: cyber-insurance to *transfer* breach risk, controls to *mitigate* fraud, a formal *accept*
of a small residual with a named owner, an *avoid* decision to not enter a market whose regulatory risk
isn't worth it. A **Risk Treatment Plan** records, per risk: the treatment decision, the rationale, the
residual risk, and the owner — the artifact that turns risk analysis into accountable executive action
(and pairs with Module 12's funding and kill-switch decisions).

Real example: a fintech faced a high fraud-loss risk. Rather than only "add controls," the BA presented the
four options with numbers: mitigate (controls, −60% expected loss, $300k), transfer (insurance, $X/yr for
catastrophic tail), accept (the small residual), and avoid (drop the high-risk segment). Leadership chose a
*combination* — mitigate the bulk, transfer the tail, accept the residual — a decision they could only make
because risk was framed as treatment options, not a red cell.

**What is the consequence if this control fails?** — for each treated risk, state the residual consequence,
i.e., what's still on the table after treatment.

### Practical exercise
Take 3 quantified risks. Recommend a treatment (accept/mitigate/transfer/avoid) for each, with rationale,
cost, residual risk, and owner.

### Artifact produced — **Risk Treatment Plan** (showcaseable)
A risk treatment plan (per risk: accept/mitigate/transfer/avoid · rationale · cost · residual risk · owner)
— proof you turn risk into accountable executive decisions, not just a register of red cells.

> **Gate:** capability = executive risk treatment decisions · artifact = Risk Treatment Plan · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 5 · AI Governance in Regulated Industries
**Competency:** `ba:compliance` · **Output:** AI Governance Compliance Blueprint · **links Sim 5**

### Objectives
- Combine AI governance (M13) with regulatory compliance for high-stakes domains.
- Apply the right controls to AI in healthcare, hiring, finance, and government.
- Produce an AI Governance Compliance Blueprint.

### Lesson
This lesson is the bridge between Modules 13 and 14 — and the most valuable, because **AI in regulated
industries** is where governance and compliance collide and where the consequences are largest. The same AI
techniques carry very different obligations by domain: **healthcare AI** (HIPAA + FDA + the EU AI Act's
high-risk tier, patient-safety consequences), **hiring AI** (EEOC, anti-discrimination law, NYC Local Law
144 bias audits — the COMPAS/Amazon failures from Module 13 are *illegal* here, not just unfortunate),
**financial AI** (fair-lending laws, model-risk management like SR 11-7, explainability for adverse-action
notices), and **government AI** (due process, transparency, public accountability).

The BA's deliverable is an **AI Governance Compliance Blueprint** that layers Module 13's AI governance (risk
classification, the requirement ladder, human oversight, monitoring, incident response) onto Module 14's
compliance machinery (regulatory impact, controls, treatment) for a specific regulated use. It answers, for
a high-risk AI system: which regulations apply, what they force, the controls (with tests + evidence), the
monitoring, the human-authority boundaries, and the consequence if each control fails. This is exactly the
analysis **Simulation 5 (Compliance Investigation)** runs — and the capability that lets a graduate advise
on AI in the highest-stakes, highest-paid environments.

Real example: a health-tech firm wanted an AI triage tool. The blueprint made the obligations concrete —
high-risk classification, clinical validation evidence, human-clinician override, bias monitoring across
demographics, an audit trail, and an incident-response plan — each tied to a control and a failure
consequence (a missed control here isn't a fine, it's patient harm). That blueprint is the difference
between an AI product that ships safely in healthcare and one that becomes a lawsuit or a recall.

**What is the consequence if this control fails?** — in regulated AI the consequence is often the most
severe: legal liability, regulatory shutdown, or human harm. Every control in the blueprint names it.

### Practical exercise
For an AI system in a regulated domain, draft an AI Governance Compliance Blueprint: applicable regs,
required controls (test + evidence), monitoring, human authority, and the consequence if each control fails.

### Artifact produced — **AI Governance Compliance Blueprint** (showcaseable)
A blueprint layering AI governance (M13) onto regulatory compliance for a high-stakes domain (regs · controls
· tests/evidence · monitoring · human authority · failure consequences) — carried into **Simulation 5.** The
artifact that proves you can govern AI where the stakes — and salaries — are highest.

> **Gate:** capability = AI governance in regulated industries · artifact = AI Governance Compliance Blueprint (→ Sim 5) · recruiter ✅ · public ✅ · interview ✅.

---

## Module 14 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:compliance`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Regulatory impact analysis | Regulatory Impact Assessment | ✅ | ✅ | ✅ |
| 2 | Risk quantification | Risk Exposure Register | ✅ | ✅ | ✅ |
| 3 | Controls + assurance traceability | Control Matrix (Lab) | ✅ | ✅ | ✅ |
| 4 | Executive risk treatment | Risk Treatment Plan | ✅ | ✅ | ✅ |
| 5 | AI governance in regulated industries | **AI Governance Compliance Blueprint** (→ Sim 5) | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate. **Every artifact answers "What is the consequence if this control fails?"**

## Meets the gold standard
Unique bodies · real frameworks & cases (regulation-to-decision impact, probability×impact expected-loss
quantification, Risk→Control→Test→Evidence + three-lines-of-defense, ISO 31000 accept/mitigate/transfer/avoid
treatment, AI in regulated industries — HIPAA/FDA, EEOC/NYC LL144, SR 11-7/fair lending, EU AI Act; the
GDPR-as-decisions, 30-highs-to-3, failed-evidence audit, fintech-fraud-treatment, and health-AI-triage cases)
· decision-changing compliance, not memorization · the permanent **"consequence if this control fails?"**
question on every artifact · exercise + portfolio-worthy artifact per lesson · Compliance Matrix lab +
Simulation 5 · employment-graded.
