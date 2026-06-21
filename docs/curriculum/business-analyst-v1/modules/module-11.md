# Module 11 — Data Analysis for BAs: Decision Intelligence (authored)

> Status: **Authored — Module 11.** Gold-standard bar; **Employment Value Gate** applied while writing.
> Opens the back third (Analytics → Decisions → Governance). Most programs teach "SQL, Excel,
> dashboards"; **this module teaches Decision Intelligence** — using data to change *decisions*, not to
> produce reports. The recurring principle: **"Data without decisions is reporting. Data with decisions
> is transformation."** Every lesson runs the loop **Observation → Insight → Recommendation → Business
> Impact.** Competency: `ba:data-analysis` · Lab: **SQL lab** · Simulations: **Sim 5 / Sim 6** ·
> Assessment: 20-Q `chapter_end` (`ba:data-analysis`, pass 85%, competency at submit).

---

## Lesson 1 · From Reporting to Decision Intelligence
**Competency:** `ba:data-analysis` · **Output:** KPI Health Assessment

### Objectives
- Shift from "what does the data say?" to "what decision should change because of the data?"
- Tell decision-driving metrics from vanity metrics, and assess KPI health.
- Produce a KPI Health Assessment.

### Lesson
The defining mistake in business analytics is **reporting** — producing dashboards and decks that
describe what happened and change nothing. **Decision Intelligence** (a discipline popularized by
Google's Cassie Kozyrkov) flips the starting question. Reporting asks *"what does the data say?"*;
decision intelligence asks *"what decision are we trying to make, and what would change our mind?"* —
*then* gathers the data. The decision comes first; the data serves it. A number that can't change a
decision is, by definition, not worth measuring.

This reframes what a "good metric" is. **Vanity metrics** (total page views, cumulative signups) feel
good and drive nothing. **Decision-driving metrics** are *actionable* (a change implies a clear action),
*comparable* (over time or segment), and tied to a real outcome (Module 9's North-Star). A **KPI Health
Assessment** audits an organization's metrics against this bar: which KPIs actually drive decisions,
which are vanity, which are missing, and which are *gamed*. Surprisingly often, leadership is flying on
a dashboard full of numbers that look important and inform nothing.

Real example: a company tracked 40 KPIs on an executive dashboard and still couldn't decide anything —
the signal was buried in vanity metrics. A KPI Health Assessment cut it to the six metrics that actually
drove decisions (and added two that were missing). Fewer, sharper numbers; faster, better decisions.

**Decision loop:** *Observation* — 40 KPIs, no decisions made → *Insight* — most are vanity; the
decision-relevant few are missing or buried → *Recommendation* — replace with 6 actionable KPIs + 2
guardrails → *Business Impact* — faster, evidence-based executive decisions.

**Metrics can be wrong — the Metric Failure Audit.** A subtler danger than a vanity metric is a *harmful*
one: a KPI that, when it "improves," makes the business *worse.* Optimize a call center for **speed** and
customer satisfaction collapses; optimize engineering for **velocity** and the defect rate explodes;
optimize sales for **volume** and profitability declines. The transformation-consultant question is: **if
this KPI improves, can the business still get worse?** A **Metric Failure Audit** stress-tests each KPI for
the perverse behavior it could incentivize and pairs it with the **guardrail metric** that prevents gaming
(Module 9's North-Star discipline applied to every metric). Few analysts think to ask whether the metric
itself is the problem.

### Practical exercise
Take a real dashboard or KPI set. Label each metric vanity vs. decision-driving, and for each
decision-driving one, name the decision it informs. Flag missing or gamed metrics.

### Artifact produced — **KPI Health Assessment** + **Metric Failure Audit** (showcaseable)
An audit of an organization's KPIs (decision-driving vs. vanity, missing, gamed) with recommendations,
*plus* a **Metric Failure Audit** stress-testing each KPI ("if this improves, can the business still get
worse?") with its guardrail — proof you think in decisions *and* protect against the metric itself being
the problem.

> **Gate:** capability = decision-first analytics + metric integrity · artifact = KPI Health Assessment + Metric Failure Audit · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 2 · Metrics, KPIs & Metric Trees
**Competency:** `ba:data-analysis` · **Output:** Metric Tree

### Objectives
- Decompose a top metric into the drivers a team can actually act on.
- Connect day-to-day work to the outcomes leadership cares about.
- Produce a Metric Tree.

### Lesson
A single top-line metric (revenue, retention, the North-Star) is true but **un-actionable** — no team
can "go improve revenue" directly. A **Metric Tree** (a.k.a. KPI tree / driver tree) decomposes it into
the inputs that drive it, level by level, until you reach metrics a specific team can move. *Revenue =
customers × average order value × purchase frequency*; each of those decomposes further (customers = new
+ retained; new = traffic × conversion…). The tree makes the **causal structure** visible, so you can
see *which lever* actually moves the outcome and *who owns it.*

This is decision intelligence made operational: when leadership wants to move the top metric, the tree
shows the candidate drivers, their current values, and where the biggest, most movable gap is — turning
"improve retention" into "lift 30-day activation for the SMB segment, owned by onboarding." It also
exposes **conflicts** (two teams optimizing sibling metrics that trade off) and connects frontline work
to executive outcomes — the same line-of-sight the RTM gave requirements (Module 6) and the capability
map gave strategy (Module 8).

Real example: a team was told to "improve retention" and flailed. A metric tree decomposed retention
into onboarding completion, week-1 engagement, and support resolution time — and the data showed
onboarding completion was the weak, high-leverage driver. One driver, clearly owned, moved the
outcome — found by decomposition, not guesswork.

**Decision loop:** *Observation* — retention is down → *Insight* — the metric tree isolates onboarding
completion as the weak driver → *Recommendation* — invest in onboarding for the at-risk segment →
*Business Impact* — retention recovers via the one lever that matters.

**Leading vs. lagging indicators.** Most organizations obsess over **lagging** indicators — revenue,
churn, profit, NPS — which only tell you what *already* happened, too late to act. The higher-leverage
skill is identifying **leading** indicators: the early signals that *predict* the outcome before it
occurs — activation rate, time-to-first-value, feature adoption, training completion, support-ticket
trends. In a metric tree, the leading indicators are usually the *upstream drivers* you can move **now**
to change a lagging outcome **later.** A **Leading Indicator Framework** pairs each lagging outcome with
the leading indicators that predict it — so leadership steers by the windshield, not the rearview mirror.
The executive question: **which metric predicts the outcome before it happens?**

### Practical exercise
Pick a top metric. Build a metric tree two levels deep (drivers → sub-drivers). Mark the current value
and owner of each leaf, and circle the highest-leverage, most-movable driver.

### Artifact produced — **Metric Tree** + **Leading Indicator Framework** (showcaseable)
A decomposition of a top metric into owned, actionable drivers with the highest-leverage lever marked,
*plus* a **Leading Indicator Framework** pairing each lagging outcome with the leading indicators that
predict it — proof you connect strategy to movable metrics *and* steer by the windshield, not the rearview.

> **Gate:** capability = metric decomposition + leading indicators · artifact = Metric Tree + Leading Indicator Framework · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 3 · SQL & Analysis for Decisions
**Competency:** `ba:data-analysis` · **Output:** SQL Decision Query Set (Lab)

### Objectives
- Query data to answer decision questions, not to dump rows.
- Use joins, aggregation, and window functions to find the *why* behind a metric.
- Produce a decision-oriented SQL query set.

### Lesson
SQL is the BA's most practical data skill — but the decision-intelligence framing matters here too:
you query to **answer a decision question**, not to produce a report nobody reads. The core toolkit is
small and high-leverage: `JOIN` (combine the customer, order, and product tables to see the whole
picture), `GROUP BY` + aggregates (turn millions of rows into the number that matters per segment),
`WHERE`/filters (isolate the cohort the decision is about), and **window functions** (rank, running
totals, period-over-period) for the trend and outlier questions executives actually ask. The skill isn't
syntax; it's translating *"why did refunds spike in the Southeast last month?"* into the query that
answers it.

The discipline that separates analysts from report-runners: start from the **question and the decision**,
write the query that answers *exactly* that, then sanity-check the result (does the total reconcile? are
nulls handled? is the cohort right?) before you trust it — the same validation rigor as Module 1's AI
loop and Module 10's evidence hierarchy (transaction data is the strongest evidence). AI copilots and
natural-language-to-SQL accelerate the writing; you still own correctness.

Real example: "returns cost is up" was the alarm. A few well-aimed queries — joining returns to products
and regions, aggregated by month, with a period-over-period window — localized the spike to one product
category in one region, driven by a sizing issue. The query turned a vague worry into a specific,
fixable cause. That's analysis for decisions, not reporting.

**Decision loop:** *Observation* — returns cost rising → *Insight* — SQL localizes it to one
category/region (sizing) → *Recommendation* — fix the size guide + supplier spec → *Business Impact* —
targeted fix instead of a blanket, expensive overreaction.

### Practical exercise
Write SQL for a real decision question (use a join, a group-by aggregate, and one window function).
State the decision it informs and one validation check you'd run on the result.

### Artifact produced — **SQL Decision Query Set** (Lab, showcaseable)
A small set of decision-oriented SQL queries (with the question + decision each answers and a validation
note) produced in the **SQL lab** — a concrete, hiring-manager-recognized data skill tied to decisions.

> **Gate:** capability = SQL for decision questions · artifact = SQL Decision Query Set · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 4 · Visualization & Executive Dashboards
**Competency:** `ba:data-analysis` · **Output:** Executive KPI Dashboard Spec

### Objectives
- Visualize so the decision is obvious, not just the data pretty.
- Design an executive dashboard that drives action, not admiration.
- Produce an Executive KPI Dashboard Spec.

### Lesson
A chart's job is to make the **decision obvious** — to compress data into a picture a busy executive
reads in seconds and acts on. Good visualization is a discipline (Stephen Few's work is the canon):
choose the chart for the question (trend → line, comparison → bar, composition → stacked/100%,
correlation → scatter), strip the chartjunk, and put the *insight* — not just the numbers — front and
center. The most common failure is a beautiful dashboard that informs nothing because it answers no
decision.

An **executive dashboard** is decision intelligence at a glance: a small set of decision-driving KPIs
(from your KPI Health Assessment), each with **context** (target, trend, threshold) so a number means
something, and ideally a "so-what" annotation. The design questions are: *what decisions does this
dashboard support? what action does a red metric trigger? who owns it?* A dashboard that can't answer
those is wallpaper. The BA writes the **spec** — the metrics, their definitions (tie to the metric
tree), the visual for each, the thresholds, and the decisions supported — which is the durable,
tool-agnostic artifact (Power BI, Tableau, Looker just render it).

Real example: an exec team had a 30-tile dashboard nobody used. Respecified to 8 decision-driving KPIs,
each with target/trend/threshold and a clear owner and trigger, it became the artifact that ran the
weekly business review — because every tile answered "what do we do about this?"

**Decision loop:** *Observation* — dashboard ignored → *Insight* — it shows data, not decisions →
*Recommendation* — 8 KPIs with thresholds + triggers + owners → *Business Impact* — the dashboard now
drives the weekly decisions.

**Decision cadence — turning reporting into governance.** Executives don't (and shouldn't) review every
metric daily. Different metrics earn different rhythms: **operational** metrics (queue lengths, error
rates) → daily/weekly at the team level; **management** metrics (funnel conversion, cycle time) →
weekly/monthly; **strategic** metrics (North-Star, market share) → monthly/quarterly at the leadership
level. An **Executive Review Calendar** assigns each KPI its cadence, forum, and audience — so the right
people see the right numbers at the right time, and dashboards become **governance** rather than wallpaper.

### Practical exercise
Spec an executive dashboard for a real area: 6–8 decision-driving KPIs, the chart for each, its
target/threshold, the decision/trigger it supports, and the owner.

### Artifact produced — **Executive KPI Dashboard Spec** + **Executive Review Calendar** (showcaseable)
A tool-agnostic dashboard spec (KPIs · definitions · visuals · thresholds · decisions/triggers · owners),
*plus* an **Executive Review Calendar** assigning each KPI an operational/management/strategic cadence,
forum, and audience — proof you design dashboards that drive action *and* turn reporting into governance.

> **Gate:** capability = decision-driving viz + review governance · artifact = Executive KPI Dashboard Spec + Executive Review Calendar · recruiter ✅ · public ✅ · interview ✅.

---

## Lesson 5 · Root-Cause Analysis & the Decision Brief
**Competency:** `ba:data-analysis` · **Output:** Root-Cause Analysis Report + Decision Brief

### Objectives
- Move from "what changed?" to "*why* did it change?" with data.
- Convert analysis into a recommendation an executive can act on.
- Produce a Root-Cause Analysis Report and a Decision Brief.

### Lesson
A metric moving is an **observation**; the value is in the **why.** Data-driven **root-cause analysis**
combines the techniques you've built — segmenting the data to find *where* the change concentrates (which
cohort, region, product), 5 Whys and fishbone to reason from symptom to cause (Module 4), and the
evidence hierarchy to confirm it (Module 10) — to explain a metric movement rather than just flag it.
The discipline is resisting the first plausible story: a metric can move for mix-shift, seasonality, a
data-quality glitch, or a real behavioral change, and the analyst's job is to distinguish them before
recommending action.

Then comes the step most analysts skip and every executive needs: the **Decision Brief.** It converts
analysis into a decision — **Observation → Insight → Recommendation → Business Impact** — on one page. It
doesn't report the analysis; it tells leadership *what to do, why, and what it's worth.* This is the
through-line of the whole module, and it's why **"data without decisions is reporting; data with
decisions is transformation."** The Decision Brief is the data analog of Module 10's Executive Discovery
Memo and Module 3's Executive Narrative — the artifact that turns a BA who *knows things* into one who
*changes things.*

This module feeds **Simulation 5 (Compliance Investigation)** and **Simulation 6 (Prioritization War
Room)**, both of which run on data-driven decisions — and the analytical rigor here underpins Module 13
(AI Decision Intelligence) and Module 12's business cases.

**Decision loop (the module in one line):** *Observation* — conversion dropped 8% → *Insight* — root-
cause isolates a checkout change for mobile users, not a market shift → *Recommendation* — roll back the
change + A/B the fix → *Business Impact* — recover the 8% (~$X) instead of chasing the wrong cause.

**Decision rights — ownership turns analysis into action.** The reason most reports change nothing is that
**no one owns the decision.** Before a recommendation can act, four questions need answers: **who owns this
metric, who can change it, who approves the action, and who is accountable for the outcome?** A **Decision
Rights Matrix** (a RACI for metrics and decisions) makes that explicit — without it, dashboards are
decoration and Decision Briefs die in inboxes. Pairing the Decision Brief with clear decision rights is
what converts an insight into a funded, owned action.

### Practical exercise
Take a real metric movement. Do a quick root-cause analysis (segment → 5 Whys → confirm), then write a
one-page Decision Brief: Observation → Insight → Recommendation → Business Impact.

### Artifact produced — **Root-Cause Analysis Report** + **Decision Brief** + **Decision Rights Matrix** (showcaseable)
A data-driven root-cause report (where the change concentrates · the validated cause · ruled-out
alternatives), a one-page **Decision Brief** (Observation → Insight → Recommendation → Business Impact),
*plus* a **Decision Rights Matrix** (who owns / can change / approves / is accountable). The artifacts that
prove you turn data into *owned, actionable* decisions — exactly what a Decision/BI analyst is hired to do.

> **Gate:** capability = root-cause + decision brief + decision rights · artifact = Root-Cause Report + Decision Brief + Decision Rights Matrix · recruiter ✅ · public ✅ · interview ✅.

---

## Module 11 assessment & Employment-value review
- **Assessment:** 20-Q `chapter_end` quiz (`ba:data-analysis`), pass 85%, competency at submit.

| L | Capability gained | Artifact (portfolio-worthy) | Recruiter? | Public? | Interview? |
|---|---|---|---|---|---|
| 1 | Decision-first analytics + metric integrity | KPI Health Assessment + Metric Failure Audit | ✅ | ✅ | ✅ |
| 2 | Metric decomposition + leading indicators | Metric Tree + Leading Indicator Framework | ✅ | ✅ | ✅ |
| 3 | SQL for decision questions | SQL Decision Query Set (Lab) | ✅ | ✅ | ✅ |
| 4 | Decision-driving viz + review governance | Executive KPI Dashboard Spec + Executive Review Calendar | ✅ | ✅ | ✅ |
| 5 | Root-cause + decision brief + decision rights | **Root-Cause Report + Decision Brief + Decision Rights Matrix** | ✅ | ✅ | ✅ |

All five clear the Employment Value Gate.

## Meets the gold standard
Unique bodies · real frameworks & cases (Decision Intelligence / Kozyrkov, vanity-vs-actionable metrics,
metric/driver trees, SQL joins-aggregates-windows, Few's visualization principles, data-driven
root-cause, the Decision Brief; the 40-KPI dashboard, retention-driver, returns-spike SQL, ignored-
dashboard, and conversion-drop cases) · every lesson runs Observation → Insight → Recommendation →
Business Impact · exercise + portfolio-worthy artifact per lesson · feeds Sim 5 + Sim 6 and underpins
M12/M13 · employment-graded. **Data without decisions is reporting; data with decisions is transformation.**
