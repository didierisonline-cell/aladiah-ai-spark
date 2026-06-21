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

**Discovery economics — cost of the experiment vs. cost of being wrong.** Executives don't fund
experiments because they're trendy; they fund them because they're *cheap insurance.* The math is simple
and powerful: a **$500 experiment that prevents a $500,000 mistake** is a 1000× return. Framing
discovery this way — an **Experiment ROI Assessment** comparing the cost and time of the test against the
cost of building the wrong thing — turns "can we skip discovery?" into an obviously bad bet, in the
language executives already use. The riskier and costlier the build, the higher the ROI of testing first.

**The test ladder — match the test to the risk.** Not every assumption deserves a six-month build to
validate; most deserve a far lighter touch. Tests climb a ladder of cost and fidelity — **interview →
prototype → Wizard-of-Oz → concierge → MVP → pilot → scale** — and you ascend only as confidence
demands, spending more *only* once cheaper tests have de-risked the bet. A **Validation Roadmap**
sequences which tests you'll run, in what order, with what decision gates — so you spend the least money
to reach the most confidence. A concierge test that costs a week routinely beats a six-month build that
costs a career.

### Practical exercise
For your riskiest assumption, design the *lightest* experiment that could validate or kill it: the test,
the metric, the success/kill threshold, and the cost/time. Name what you'd do for each outcome.

### Artifact produced — **Experiment Plan** + **Experiment ROI Assessment** + **Validation Roadmap** (showcaseable)
An experiment plan (hypothesis · lightest credible test · success/kill criteria · decision), *plus* an
**Experiment ROI Assessment** (test cost vs. cost-of-being-wrong) and a **Validation Roadmap** sequencing
the test ladder (interview → prototype → Wizard-of-Oz → concierge → MVP → pilot → scale) with decision
gates — proof you validate cheaply *and* reason about discovery in executive economics.

> **Gate:** capability = experiment design + discovery economics · artifact = Experiment Plan + ROI Assessment + Validation Roadmap · recruiter ✅ · public ✅ · interview ✅.

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

**The evidence hierarchy — not all evidence is equal.** Rank evidence by how much it deserves your
trust: **opinion → interview → observation → behavior → transaction data.** A customer's *opinion* ("I'd
totally use that") is the weakest; their *behavior* and *actual transactions* are the strongest, because
**what people do beats what they say** every time (*customer says X, customer does Y*). An **Evidence
Strength Matrix** scores each piece of evidence by type and strength, so a conclusion built on
transaction data outweighs one built on a few enthusiastic interviews — and every finding carries a
known confidence.

**Discovery anti-patterns — the traps that produce confident, wrong answers.** Most discovery failures
are behavioral, not technical. The recurring traps: **confirmation bias** (seeking only support for a
decision already made), **solution-first thinking** (validating a feature instead of understanding a
problem), **executive anchoring** (the HIPPO's idea framing the whole inquiry), **leading questions**,
**false consensus**, **interviewing only power users** (unrepresentative), and **mistaking opinions for
evidence.** Running a **Discovery Failure Audit** — checking your own process against these anti-patterns
*before* you trust a conclusion — is what elite consultants do: they spend as much energy avoiding bad
conclusions as finding good ones.

### Practical exercise
For a discovery question, list the evidence you have by type (behavioral vs. attitudinal) and source.
Write the one result that would change your mind — and check whether you're seeking it or avoiding it.

### Artifact produced — **Discovery Findings** + **Evidence Strength Matrix** + **Discovery Failure Audit** (showcaseable)
A findings summary (triangulated by type/source · signal vs. noise · confidence · what would change the
conclusion), *plus* an **Evidence Strength Matrix** (opinion → interview → observation → behavior →
transaction data) and a **Discovery Failure Audit** checking your process against the discovery
anti-patterns — rigorous, defensible discovery a hiring manager trusts, and proof you avoid bad
conclusions, not just chase good ones.

> **Gate:** capability = evidence rigor + anti-pattern awareness · artifact = Discovery Findings + Evidence Strength Matrix + Discovery Failure Audit · recruiter ✅ · public ✅ · interview ✅.

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

**From findings to decision — the Executive Discovery Memo.** Most discovery work stops at "research
findings"; executives need a **decision.** The senior move converts evidence into a crisp decision memo:
**Evidence → Insight → Recommendation → Investment Request → Expected Outcome.** The Executive Discovery
Memo is the one-page version a sponsor can act on in a meeting — it doesn't report what you learned, it
tells them what to *do*, what it costs, and what they'll get. This is the bridge from discovery back into
the transformation-consultant track: **discovery as a decision-making discipline, not a research
activity.**

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

### Artifact produced — **Executive Discovery Report (P1)** + **Executive Discovery Memo** (showcaseable)
The strategic trio's capstone artifact: an evidence-backed discovery report (problem · opportunities ·
evidence/confidence · recommendation · risks) with a Working-Backwards narrative — **Portfolio Artifact
#1**, defended in **Simulation 1** — *plus* a one-page **Executive Discovery Memo** (Evidence → Insight →
Recommendation → Investment Request → Expected Outcome) a sponsor can act on in a meeting. The clearest
proof you can turn ambiguity into a fundable, validated *decision*.

> **Gate:** capability = Working Backwards + decision synthesis · artifact = Executive Discovery Report + Executive Discovery Memo (→ Sim 1, P1) · recruiter ✅ · public ✅ · interview ✅.

---

## Module 10 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:product-discovery`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Continuous discovery + OST | Opportunity Solution Tree | ✅ | ✅ | ✅ |
| 2 | Assumption mapping + hypotheses | Assumption Map | ✅ | ✅ | ✅ |
| 3 | Experiment design + discovery economics | Experiment Plan + ROI Assessment + Validation Roadmap | ✅ | ✅ | ✅ |
| 4 | Evidence rigor + anti-pattern awareness | Discovery Findings + Evidence Strength Matrix + Discovery Failure Audit | ✅ | ✅ | ✅ |
| 5 | Working Backwards + decision memo | **Executive Discovery Report** + Executive Discovery Memo (→ Sim 1, P1) | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate.

## Meets the gold standard
Unique bodies · real frameworks & cases (Torres continuous discovery + OST, Bland assumption mapping,
leap-of-faith/riskiest-assumption testing, Ries MVP/Build-Measure-Learn, Dropbox video & concierge MVPs,
behavioral-over-attitudinal evidence + confirmation-bias guard, Amazon Working Backwards/PR-FAQ; the
trial-conversion OST, fintech viability, marketplace concierge, and cherry-picked-interview cases) ·
exercise + portfolio-worthy artifact per lesson · completes the strategic trio (M8–M10) · feeds
Simulation 1 + Portfolio P1 · employment-graded.
