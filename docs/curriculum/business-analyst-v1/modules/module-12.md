# Module 12 — Solution Evaluation, Validation & Acceptance (authored)

> Status: **Authored — Module 12.** Gold-standard bar; **Employment Value Gate** applied while writing.
> The framing that makes this senior: solution evaluation is not "does it work?" — it's **"does this
> solution deserve to be funded, rolled out, scaled, or retired?"** Every solution faces an *investment
> decision* at each gate, and the BA's job is to inform it with evidence. Competency: `ba:solution-eval` ·
> Lab: **UAT lab** · Simulation: **Sim 8 (Transformation Roadmap)** · delivers **Portfolio P5 (Business
> Case)** + **P6 (UAT Package)** · Assessment: 20-Q `chapter_end` (`ba:solution-eval`, pass 85%,
> competency at submit). Builds on M9/M10 (chosen + validated opportunities) and M11 (decision evidence).

---

## Lesson 1 · Solution Options & Trade-offs
**Competency:** `ba:solution-eval` · **Output:** Options Analysis

### Objectives
- Generate and compare real solution options instead of defending the first idea.
- Evaluate build vs. buy vs. partner vs. configure against weighted criteria.
- Produce an Options Analysis.

### Lesson
The first evaluation skill is refusing the **single-option trap** — presenting one solution as if it
were the only one. Executives can't make a real decision without alternatives, and the analyst who
brings options (with a recommendation) is trusted; the one who brings a foregone conclusion is not.
Serious options usually include **build, buy, partner, configure, and do-nothing** — and "do nothing"
is a real option that anchors the others (if the status quo is acceptable, the bar for change is high).

Comparison must be **structured, not vibes**: define the decision criteria that matter (total cost of
ownership, time-to-value, risk, strategic fit, flexibility), weight them by importance, and score each
option — the same weighted-criteria discipline as Module 8's investment matrix. The output isn't "option
B is nice"; it's "option B best balances cost, speed, and risk against our weighted criteria, *here's
the trade-off we're accepting.*" Naming the trade-off explicitly is what separates an evaluation from a
sales pitch.

Real example: a team was set on **building** a custom returns platform. A structured options analysis —
build vs. a configurable SaaS vs. a partner integration — showed the SaaS hit 90% of needs at a third of
the cost and a quarter of the time, with the trade-off of less customization the business didn't
actually need. The options analysis turned an expensive default into a deliberate, cheaper choice.

### Practical exercise
For a real need, generate 3–4 options (incl. do-nothing). Define and weight 4–5 criteria, score each
option, and write the recommendation with its explicit trade-off.

### Artifact produced — **Options Analysis** (showcaseable)
A weighted options comparison (build/buy/partner/do-nothing × criteria) with a recommendation and named
trade-off — proof you drive solution *decisions*, not single-option pitches.

> **Gate:** capability = options analysis + trade-offs · artifact = Options Analysis · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 2 · Business Case & ROI — the Funding Decision
**Competency:** `ba:solution-eval` · **Output:** Business Case (P5)

### Objectives
- Build a business case that earns (or honestly denies) funding.
- Quantify costs, benefits, ROI, payback, and risk.
- Produce a Business Case.

### Lesson
A **business case** answers the first gate: **does this deserve funding?** It is the artifact that wins
budget — and the one most BAs do weakly, because it requires translating a solution into the language of
money and risk executives fund in. A credible case quantifies the **costs** (build + run, the full TCO,
not just the project), the **benefits** (revenue gained, cost saved, risk avoided — tied to the
outcomes/North-Star of Module 9 and the metrics of Module 11), and the **financial verdict**: **ROI**,
**payback period**, and ideally **NPV** (because a dollar next year is worth less than a dollar today).
It also names the **risks and assumptions** honestly — an inflated case that ignores risk is worse than
no case, because it destroys your credibility on the next one.

The discipline that makes it senior: **benefits must be evidenced, not asserted.** "This will increase
conversion 20%" needs a basis (a benchmark, a pilot, a discovery experiment from Module 10), and a good
case states its confidence and sensitivity ("at 10% it still pays back in a year"). Executives fund cases
that are honest about uncertainty far more readily than ones that promise the moon.

Real example: two teams pitched similar projects. One claimed huge, unevidenced benefits; the other
showed a modest, benchmarked ROI with a clear payback and a sensitivity range. Finance funded the
*second* — not because the upside was bigger, but because the case was *credible.* A business case is
trusted in proportion to its honesty about risk.

### Practical exercise
Build a one-page business case for a real solution: TCO, quantified benefits (with basis), ROI + payback,
top 3 risks/assumptions, and a funding recommendation with a sensitivity note.

### Artifact produced — **Business Case (P5)** (showcaseable)
A decision-grade business case (TCO · evidenced benefits · ROI/payback/NPV · risks · recommendation) —
**Portfolio Artifact #5.** The artifact that proves you can get a solution *funded*, in executives' own
language.

> **Gate:** capability = business case + ROI / funding decision · artifact = Business Case (P5) · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 3 · Solution Validation & Acceptance
**Competency:** `ba:solution-eval` · **Output:** Validation Plan

### Objectives
- Define what "good enough to accept" means *before* building.
- Plan how a solution will be validated against requirements and outcomes.
- Produce a Validation Plan.

### Lesson
**Acceptance criteria define done; validation proves it.** The cardinal error is deciding whether a
solution is acceptable *after* it's built, when judgments get political and "good enough" is whatever
shipped. The senior move is to define **acceptance criteria up front** — the measurable conditions a
solution must meet to be accepted — covering not just functional behavior but the **non-functional**
bars (performance, security, accessibility — Module 6's NFRs) and, crucially, the **outcome** it was
funded to move (does it actually shift the metric, not just pass tests?).

A **Validation Plan** lays out how you'll prove it: what's verified (against requirements), what's
validated (against real user needs and the business outcome), the methods (UAT, pilots, A/B tests,
metric checks), and the **decision each result triggers** — accept, fix, or reject. This connects
validation to evaluation: a solution can pass every functional test and still fail to move the outcome,
in which case it shouldn't roll out regardless of how "done" it looks. Validation against *outcomes*,
not just specs, is what distinguishes solution evaluation from QA.

Real example: a feature passed 100% of its acceptance tests and shipped — and moved its target metric
by zero, because it solved a problem users didn't actually have (a discovery failure from Module 10).
Functional acceptance said "done"; outcome validation would have said "don't roll out." Validating
against the outcome, not just the spec, is the gate that prevents shipping expensive irrelevance.

### Practical exercise
For a solution, write acceptance criteria (functional + NFR + outcome) and a validation plan: what
you'll verify/validate, by what method, and the accept/fix/reject decision each result triggers.

### Artifact produced — **Validation Plan** (showcaseable)
A validation plan tying acceptance criteria (functional · NFR · outcome) to methods and accept/fix/reject
decisions — proof you evaluate solutions against outcomes, not just specs.

> **Gate:** capability = validation + acceptance design · artifact = Validation Plan · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 4 · UAT Design & Execution — the Rollout Decision
**Competency:** `ba:solution-eval` · **Output:** UAT Package (P6, Lab)

### Objectives
- Design and run User Acceptance Testing that protects the business at rollout.
- Triage defects and make a defensible go/no-go sign-off.
- Produce a UAT Package.

### Lesson
UAT answers the **rollout gate**: *is this safe and valuable enough to put in front of real users?* It's
where the business — not just QA — confirms the solution does what it needs in real scenarios. Good UAT
is designed, not improvised: **test cases** drawn from the acceptance criteria and real workflows
(including the edge and exception paths from Module 6 and the observed reality from Module 4), the right
**business testers**, and clear **entry/exit criteria.** The output is evidence, not vibes.

The skill most often missing is **defect triage and the go/no-go call.** Not every defect blocks
rollout; you classify by severity and business impact (a cosmetic issue ships, a data-integrity or
compliance defect does not), and you make a **defensible sign-off**: go, go-with-known-issues (documented
+ owned), or no-go. This is a risk decision, and the BA frames it so leadership decides with eyes open —
"these 3 criticals must fix; these 9 minors we accept with workarounds and a fast-follow." A signed UAT
package is the artifact that makes a rollout decision accountable.

Real example: a migration's UAT surfaced a defect that silently dropped a fraction of transactions —
cosmetically minor in the demo, catastrophic in production (echoes of the TSB migration from Module 6).
Severity-based triage flagged it as a no-go blocker; without designed UAT and honest triage, it would
have shipped. UAT isn't a formality; it's the last gate before the business is exposed.

### Practical exercise
For a solution, design a small UAT: 5–8 test cases from acceptance criteria, a defect-severity scheme,
and the go/no-go rule. Write the sign-off you'd give for a realistic mix of defects.

### Artifact produced — **UAT Package (P6)** (Lab, showcaseable)
A complete UAT package (test cases · defect log + severity triage · entry/exit criteria · go/no-go
sign-off) produced in the **UAT lab** — **Portfolio Artifact #6.** Proof you can make a rollout safe and
accountable.

> **Gate:** capability = UAT design + go/no-go · artifact = UAT Package (P6) · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 5 · Value Realization & Post-Implementation Review — Scale or Retire
**Competency:** `ba:solution-eval` · **Output:** Post-Implementation Review

### Objectives
- Verify a solution actually delivered the value it was funded for.
- Make the scale / sustain / fix / retire decision on evidence.
- Produce a Post-Implementation Review.

### Lesson
The gate everyone forgets is the last one: **did it actually work — and what do we do now?** Most
organizations declare victory at launch and never check whether the funded benefits materialized. A
**Post-Implementation Review (PIR)** closes the loop: it compares **actual outcomes vs. the business
case** (did the metric move as promised? did costs land as estimated?), captures lessons, and — most
importantly — drives the next **investment decision**: **scale** (it worked; expand it), **sustain** (it
works; keep it), **fix** (close but underperforming; iterate), or **retire** (it didn't deliver; cut
losses — Module 9's rationalization discipline). Treating launch as the finish line is how organizations
accumulate a portfolio of underperforming solutions nobody dares kill.

This is the heart of the module's framing: a solution continuously earns the right to be funded, rolled
out, scaled, or retired, and the BA informs each decision with evidence rather than sunk-cost emotion.
The PIR is also where benefits realization meets honesty — the courage to report that a beloved project
*didn't* deliver, and recommend retiring it, is exactly the senior judgment that feeds **Simulation 8
(Transformation Roadmap)**, where these solution decisions sequence into a portfolio plan.

Real example: a company launched a feature, celebrated, and moved on. A PIR six months later showed it
had *not* moved its target metric and was costing support time — but it survived for a year because no
one reviewed it. Instituting PIRs turned "launch and forget" into "measure and decide," and freed budget
by retiring three underperformers. The last gate is where value is actually protected.

### Practical exercise
For a launched solution, draft a PIR: actual vs. business-case outcomes, lessons, and a scale / sustain
/ fix / retire recommendation with its rationale.

### Artifact produced — **Post-Implementation Review** (showcaseable)
A PIR comparing actual outcomes to the business case with a scale/sustain/fix/retire recommendation —
proof you evaluate solutions across their whole lifecycle and make evidence-based investment calls, not
sunk-cost ones.

> **Gate:** capability = value realization + scale/retire decision · artifact = Post-Implementation Review · recruiter ✅ · public ✅ · interview ✅.

---

## Module 12 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:solution-eval`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Options analysis + trade-offs | Options Analysis | ✅ | ✅ | ✅ |
| 2 | Business case / funding decision | **Business Case (P5)** | ✅ | ✅ | ✅ |
| 3 | Validation + acceptance (vs outcomes) | Validation Plan | ✅ | ✅ | ✅ |
| 4 | UAT design + rollout go/no-go | **UAT Package (P6)** | ✅ | ✅ | ✅ |
| 5 | Value realization + scale/retire | Post-Implementation Review | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate.

## Meets the gold standard
Unique bodies · real frameworks & cases (single-option trap, build/buy/partner weighted options, business
case TCO/ROI/payback/NPV + sensitivity, acceptance-vs-outcome validation, designed UAT + severity triage +
go/no-go, post-implementation review + scale/sustain/fix/retire; the SaaS-vs-build, credible-ROI funding,
passed-tests-zero-impact, dropped-transactions UAT, and launch-and-forget PIR cases) · the funding →
rollout → scale → retire decision lens throughout · exercise + portfolio-worthy artifact per lesson ·
delivers Portfolio **P5 + P6** · feeds Simulation 8 · employment-graded.
