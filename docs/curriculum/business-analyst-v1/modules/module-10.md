# Module 10 — Product Discovery & Solution Definition (authored)

> Status: **Authored — Module 10.** Gold-standard bar; **Employment Value Gate** applied while writing.
> Completes the strategic trio. Module 8 = enterprise thinking, Module 9 = product *strategy* (choosing);
> **Module 10 = product *discovery* (finding & validating)** — the engine that turns strategy into
> evidence *before* anyone commits to building. Frameworks from Teresa Torres (continuous discovery),
> David Bland (assumption mapping), Eric Ries (Lean Startup), and Amazon Working Backwards.
> Competency: `ba:product-discovery` · Simulation: **Sim 1 (Discovery Engagement)** · feeds
> **Portfolio P1 (Executive Discovery Report)** · Assessment: 20-Q `chapter_end` (`ba:product-discovery`,
> pass 85%, competency at submit). Builds on M4 (elicitation) + M9 (strategy).

---

## Lesson 1 · Continuous Discovery & Opportunity Solution Trees
**Competency:** `ba:product-discovery` · **Output:** Opportunity Solution Tree

### Objectives
- Adopt continuous discovery as a habit, not a one-off phase.
- Use an Opportunity Solution Tree to connect outcome → opportunities → solutions → experiments.
- Produce an Opportunity Solution Tree.

### Lesson
The opposite of discovery is the **big up-front "requirements phase"** followed by months of building
the wrong thing. **Continuous discovery** (Teresa Torres) replaces it: small, frequent touchpoints with
customers — ideally weekly — so the team keeps learning *while* it builds, and course-corrects early and
cheaply. Discovery isn't a stage you finish; it's a rhythm you sustain.

The structuring tool is the **Opportunity Solution Tree (OST)**. At the top sits a single **desired
outcome** (from Module 9's outcome thinking). Beneath it branch the **opportunities** — the unmet needs,
pains, and desires (discovered, not invented) that could move that outcome. Only beneath opportunities
do **solutions** appear, and beneath those, the **experiments** that test them. The tree enforces two
disciplines that separate discovery from guessing: every solution must trace up to a real opportunity
and a measurable outcome, and you must consider *multiple* opportunities before committing to one — the
structural antidote to "build the feature someone already fell in love with" (Module 1's trap, and
Module 9's "choosing").

Real example: a team's outcome was "increase trial-to-paid conversion." Instead of jumping to "add a
discount" (a solution someone loved), they built an OST and discovered three distinct opportunities —
users didn't understand the value, hit a setup wall, and feared lock-in. The discount addressed *none*
of them. The tree redirected effort to the setup wall (the biggest opportunity), and conversion moved.
The OST turned an expensive guess into a focused, evidence-led bet.

### Practical exercise
Build an Opportunity Solution Tree for a real outcome: the outcome at top, 3–4 opportunities beneath
(framed as customer needs/pains), and 1–2 candidate solutions under the most promising opportunity.

### Artifact produced — **Opportunity Solution Tree** (showcaseable)
A visual OST (outcome → opportunities → solutions → experiments) for a real product — a modern
discovery artifact that signals you connect solutions to validated needs, not opinions.

> **Gate:** capability = continuous discovery + OST · artifact = Opportunity Solution Tree · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 2 · Assumption Mapping & Hypotheses
**Competency:** `ba:product-discovery` · **Output:** Assumption Map

### Objectives
- Surface the assumptions a solution is silently betting on.
- Prioritize the riskiest assumptions and frame them as testable hypotheses.
- Produce an Assumption Map.

### Lesson
Every solution is a stack of **assumptions** — about what customers want, whether they'll use it,
whether it works, and whether it makes business sense. Most fail because a hidden assumption was wrong,
not because the team built badly. **Assumption mapping** (David Bland) makes those bets explicit across
four types: **desirability** (do they want it?), **viability** (does it work for the business?),
**feasibility** (can we build it?), and **usability** (can they use it?).

Then you prioritize. Plot each assumption on **importance × evidence**: the dangerous ones are
**high-importance, low-evidence** — the *leap-of-faith* assumptions that will sink the idea if wrong and
that you currently have no proof for. Those get tested *first*. Testing easy or well-evidenced
assumptions first is the most common way discovery wastes time. Each leap-of-faith assumption becomes a
**falsifiable hypothesis**: *"We believe [target users] will [behavior] because [reason]; we'll know
we're right if [measurable signal]."* A hypothesis you can't disprove isn't a hypothesis — it's a hope.

Real example: a fintech was certain users wanted an AI budgeting assistant (desirability) and poured
months into the model. The unexamined leap-of-faith assumption was *viability* — users wouldn't grant
the bank-data access the feature required. A one-week test of *that* assumption would have killed the
idea before the build. They mapped assumptions backwards, after the fact, and learned the lesson the
expensive way.

### Practical exercise
For a solution, list its assumptions across desirability/viability/feasibility/usability. Plot them on
importance × evidence and circle the two leap-of-faith assumptions. Write one as a testable hypothesis.

### Artifact produced — **Assumption Map** (showcaseable)
An assumption map (by type, plotted on importance × evidence) with leap-of-faith assumptions and one
testable hypothesis — proof you de-risk ideas before building, the core discovery discipline.

> **Gate:** capability = assumption mapping + hypotheses · artifact = Assumption Map · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 3 · Experiment Design & MVP
**Competency:** `ba:product-discovery` · **Output:** Experiment Plan

### Objectives
- Design the cheapest experiment that can validate or kill a risky assumption.
- Use an MVP as a learning instrument, not a small product.
- Produce an Experiment Plan.

### Lesson
Once you know the riskiest assumption (Lesson 2), you **test it as cheaply as possible.** The art of
experiment design is maximizing **validated learning per unit of effort**: the goal is a confident
answer, not a polished build. The toolkit runs from lightest to heaviest — customer interviews, landing-
page/"fake door" tests, concierge (do it manually before automating), Wizard-of-Oz (humans behind a
fake automation), prototypes — and you pick the *lightest* test that can credibly move your confidence.

The **MVP** (Eric Ries, Lean Startup) is widely misunderstood: it is not "version one, but smaller" — it
is the **minimum thing that produces validated learning about your riskiest assumption.** Sometimes the
right MVP isn't software at all. Dropbox's famous MVP was a **three-minute video** demonstrating the
product that didn't yet exist; it validated demand (the desirability assumption) overnight, for the cost
of a video, before a line of sync code was written. Each experiment runs a **Build–Measure–Learn** loop:
build the smallest test, measure the real behavioral signal, learn, and decide — persevere, pivot, or
kill.

Real example: a marketplace assumed sellers would do the work to list inventory. Instead of building a
seller portal, they ran a **concierge** test — staff listed items manually for ten sellers — and learned
sellers wouldn't supply the data at all. Weeks of testing saved a year of building the wrong platform.
The cheapest experiment that can kill a bad idea is the most valuable work in product.

### Practical exercise
For your riskiest assumption, design the *lightest* experiment that could validate or kill it: the test,
the metric, the success/kill threshold, and the cost/time. Name what you'd do for each outcome.

### Artifact produced — **Experiment Plan** (showcaseable)
An experiment plan: hypothesis, the lightest credible test, success/kill criteria, and the decision
each outcome triggers — proof you can validate ideas cheaply before committing build budget.

> **Gate:** capability = experiment design + MVP · artifact = Experiment Plan · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 4 · Discovery Research & Evidence
**Competency:** `ba:product-discovery` · **Output:** Discovery Findings

### Objectives
- Gather discovery evidence that holds up under scrutiny.
- Triangulate sources and separate real signal from noise.
- Produce Discovery Findings.

### Lesson
Discovery lives or dies on **evidence quality.** The strongest evidence is **behavioral** — what people
actually do (usage data, real purchases, observed workarounds, the results of your experiments) — which
outranks **attitudinal** evidence (what they *say* in surveys and interviews), which is prone to
courtesy and recall bias. This is Module 4's discipline aimed at validation: *show me, don't just tell
me.* The most robust findings **triangulate** — the same conclusion appearing across an interview, a
behavioral metric, and an experiment is far more trustworthy than any single source.

Two failure modes to guard against. **Confirmation bias:** teams run "discovery" that's really theater,
seeking evidence for the decision they've already made — the antidote is to define, in advance, what
result would *change your mind*. And **signal vs. noise** (Module 4): one vivid anecdote will dominate
your memory; weight recurring patterns across independent sources over the loudest single story. Good
discovery is honest enough to kill the team's favorite idea when the evidence says so.

Real example: a team "validated" a feature with five enthusiastic interviews and shipped it; usage was
near zero. The interviews were attitudinal and cherry-picked (confirmation bias); the behavioral signal
they ignored — low engagement with the existing related feature — had told the truth all along. Evidence
discipline isn't bureaucracy; it's the difference between learning and fooling yourself.

### Practical exercise
For a discovery question, list the evidence you have by type (behavioral vs. attitudinal) and source.
Write the one result that would change your mind — and check whether you're seeking it or avoiding it.

### Artifact produced — **Discovery Findings** (showcaseable)
A findings summary: evidence triangulated by type/source, signal vs. noise marked, confidence levels,
and what would change the conclusion — rigorous, defensible discovery a hiring manager trusts.

> **Gate:** capability = discovery research + evidence rigor · artifact = Discovery Findings · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 5 · Working Backwards & the Executive Discovery Report
**Competency:** `ba:product-discovery` · **Output:** Executive Discovery Report (P1) · **links Sim 1**

### Objectives
- Use Amazon's Working Backwards to articulate the validated solution from the customer in.
- Synthesize discovery into a decision-grade Executive Discovery Report.
- Produce Portfolio Artifact P1.

### Lesson
Discovery culminates in a **clear, customer-backwards articulation** of what to build and why.
**Amazon's Working Backwards** is the sharpest tool: before committing, write the **PR/FAQ** — a press
release and FAQ for the finished product *as if it already shipped* — describing the customer, the
problem, and the value in plain language, then answering the hard questions. Writing it forces clarity
and **kills weak ideas on paper**, cheaply, instead of after months of building. If you can't write a
compelling, honest PR/FAQ grounded in your evidence, you haven't discovered enough.

This synthesizes into the **Executive Discovery Report** — the artifact that answers, with evidence,
*"what's the real problem, what should we do about it, and how confident are we?"*: the problem framed
from discovery, the validated opportunities, the evidence (and its confidence), the recommended solution
direction, the key remaining risks, and a clear recommendation. It is the deliverable you carry into
**Simulation 1 (Discovery Engagement)** — the very first simulation in the program — and **Portfolio
Artifact #1.** The whole strategic trio lands here: enterprise context (M8), the chosen strategy (M9),
validated by discovery (M10), packaged for an executive decision.

Real example (and your simulation): a BA runs a discovery engagement on an ambiguous brief, separates
the loud requests from the evidenced needs, and presents an Executive Discovery Report recommending a
*different* solution than the one the sponsor walked in wanting — and wins, because the recommendation
is backed by behavioral evidence and a Working-Backwards narrative the sponsor can't argue with.

### Practical exercise
Write a one-page PR/FAQ for a validated solution (press release + 3 hard FAQs). Then outline the
Executive Discovery Report: problem, opportunities, evidence/confidence, recommendation, risks.

### Artifact produced — **Executive Discovery Report (P1)** (showcaseable)
The strategic trio's capstone artifact: an evidence-backed discovery report (problem · opportunities ·
evidence/confidence · recommendation · risks) with a Working-Backwards narrative — **Portfolio Artifact
#1**, defended in **Simulation 1.** The single clearest proof that you can turn ambiguity into a
fundable, validated recommendation.

> **Gate:** capability = Working Backwards + discovery synthesis · artifact = Executive Discovery Report (→ Sim 1, P1) · recruiter ✅ · public ✅ · interview ✅.

---

## Module 10 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:product-discovery`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Continuous discovery + OST | Opportunity Solution Tree | ✅ | ✅ | ✅ |
| 2 | Assumption mapping + hypotheses | Assumption Map | ✅ | ✅ | ✅ |
| 3 | Experiment design + MVP | Experiment Plan | ✅ | ✅ | ✅ |
| 4 | Discovery research + evidence rigor | Discovery Findings | ✅ | ✅ | ✅ |
| 5 | Working Backwards + discovery synthesis | **Executive Discovery Report** (→ Sim 1, P1) | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate.

## Meets the gold standard
Unique bodies · real frameworks & cases (Torres continuous discovery + OST, Bland assumption mapping,
leap-of-faith/riskiest-assumption testing, Ries MVP/Build-Measure-Learn, Dropbox video & concierge MVPs,
behavioral-over-attitudinal evidence + confirmation-bias guard, Amazon Working Backwards/PR-FAQ; the
trial-conversion OST, fintech viability, marketplace concierge, and cherry-picked-interview cases) ·
exercise + portfolio-worthy artifact per lesson · completes the strategic trio (M8–M10) · feeds
Simulation 1 + Portfolio P1 · employment-graded.
