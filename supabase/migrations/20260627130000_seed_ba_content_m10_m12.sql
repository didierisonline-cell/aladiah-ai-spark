-- =============================================================================
-- Seed BA lesson content (description + EN transcript) — Modules 10–12
--
--   M10: Product Discovery & Solution Definition     (order_index 10, OFFSET 9)
--   M11: Data Analysis for BAs: Decision Intelligence (order_index 11, OFFSET 10)
--   M12: Solution Evaluation, Validation & Acceptance (order_index 12, OFFSET 11)
--
-- Pattern: UPDATE videos SET description, translations
--          WHERE chapter_id = v_ch AND order_index = N
-- BA lesson order_index is 1-based (1..5 per module).
--
-- Apply: paste into Supabase SQL Editor → Run
-- Verify: SELECT below (modules 10, 11, 12 → filled=5 each)
-- =============================================================================

DO $$
DECLARE
  v_ba_id UUID;
  v_ch    UUID;
BEGIN

  SELECT id INTO v_ba_id FROM public.courses
  WHERE title = 'AI Business Analyst & Product Discovery Specialist'
    AND curriculum_version = 'ba-v1';

  IF v_ba_id IS NULL THEN
    RAISE EXCEPTION 'BA course not found — run 20260621000000_publish_ba_structure.sql first';
  END IF;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 10 — Product Discovery & Solution Definition  (OFFSET 9, order_index = 10)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 9;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M10 chapter not found'; END IF;

  -- Lesson 1: Continuous Discovery & Opportunity Solution Trees
  UPDATE public.videos SET
    description = 'Teresa Torres''s Continuous Discovery framework replaced the old "big discovery upfront" model with a disciplined weekly cadence of customer conversations, opportunity identification, and assumption testing. The Opportunity Solution Tree (OST) is the visual tool that organises everything — outcome, opportunities, solutions, and experiments — on a single artefact that keeps product teams honest. This lesson teaches you to build and maintain an OST so discovery is never a one-time event again.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Continuous Discovery & Opportunity Solution Trees',
      'description', 'Teresa Torres''s Continuous Discovery replaces big upfront discovery with a weekly cadence of customer conversations and assumption testing. This lesson teaches you to build and maintain an Opportunity Solution Tree that keeps product teams honest.',
      'transcript', 'CONTINUOUS DISCOVERY & OPPORTUNITY SOLUTION TREES

THE PROBLEM WITH DISCOVERY-AS-A-PHASE

The traditional model: the team runs a discovery phase for 6–12 weeks, produces a requirements document, hands it to development, and never talks to a customer again until launch.

The problem: customer needs change. Markets shift. Assumptions baked into month-3 requirements are stale by month-9 delivery. The team delivers something nobody wants because the evidence was collected once and never updated.

Teresa Torres''s insight: discovery is not a phase — it is an ongoing practice. Product teams that win conduct at least one customer interview per week, every week, for the life of the product.

WHAT IS AN OPPORTUNITY SOLUTION TREE?

The Opportunity Solution Tree (OST) is a visual framework introduced by Teresa Torres in "Continuous Discovery Habits" (2021). It organises four levels:

Level 1 — DESIRED OUTCOME
The business or product metric you are trying to move. Specific and measurable.
Example: "Increase free-to-paid conversion rate from 4% to 7% within 6 months."
Rule: there is ONE outcome per OST. If you have multiple outcomes, you have multiple trees.

Level 2 — OPPORTUNITIES
The customer needs, pain points, or desires that, if addressed, would move the outcome. Opportunities are discovered through customer interviews — they are not invented in a meeting room.
Example: "Customers don''t understand the value of the paid tier before they hit the paywall."
"Customers hit the paywall at the worst possible moment — when they need the feature most."
Rule: opportunities are expressed in customer language, not solution language.

Level 3 — SOLUTIONS
The ideas your team generates to address each opportunity. Multiple solutions per opportunity.
Example: For the opportunity "customers don''t understand paid value":
- In-app value-preview mode
- Email nurture sequence highlighting paid features
- Contextual tooltip showing what paid users get

Level 4 — EXPERIMENTS
The smallest test you can run to learn whether a solution assumption holds before you build the full thing.
Example: "Show 10% of free users a 48-hour paid preview. Measure: do they convert at 2× the base rate?"

THE CONTINUOUS DISCOVERY CADENCE

Weekly rhythm:
- Monday: one or two customer interviews (30 minutes each)
- Wednesday: team reviews interview notes, updates the OST
- Friday: design one new experiment based on OST priorities

This rhythm means the team is always building on current evidence. Assumptions are tested before sprints, not after launch.

HOW A BA USES THE OST

The BA''s role in continuous discovery:
1. Facilitate the OST workshop — build the first tree collaboratively with the product team
2. Translate customer interview insights into opportunities on the tree
3. Challenge solutions that do not map to a real opportunity
4. Ensure experiments are designed to produce a testable result (not just "let''s try it")
5. Maintain the OST as a living document — add, prune, and promote nodes as evidence accumulates

DELIVERABLE: Opportunity Solution Tree
Choose a product or feature your organisation is working on. Define the desired outcome (one metric). Conduct two customer interviews (internal users count). Identify three to five opportunities from the interviews. Generate two solutions per opportunity. Design one experiment for your highest-priority solution. Assemble these on a visual OST using Miro, FigJam, or a whiteboard photo.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Assumption Mapping & Hypotheses
  UPDATE public.videos SET
    description = 'Every solution is built on a stack of assumptions — about what customers need, how they will behave, and what the business can deliver. Assumption Mapping makes that stack visible and forces you to test the riskiest assumptions before writing a line of code. This lesson teaches the Assumption Map framework: how to surface hidden assumptions, rate them by risk, and convert them into testable hypotheses.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Assumption Mapping & Hypotheses',
      'description', 'Every solution is built on hidden assumptions. Assumption Mapping makes that stack visible and forces you to test the riskiest ones before building. This lesson teaches you to surface, rate, and convert assumptions into testable hypotheses.',
      'transcript', 'ASSUMPTION MAPPING & HYPOTHESES

WHY ASSUMPTIONS KILL PROJECTS

Post-launch failure analysis consistently shows the same root cause: the team assumed something that was never true, or was once true and stopped being true. The failure was predictable — it just was not predicted because no one made the assumptions explicit.

Assumptions live in three places:
1. Inside individual team members'' heads (never articulated)
2. Inside the requirements document as embedded "fact" (never flagged as uncertain)
3. Inside the business case as projected numbers (never tested)

Assumption Mapping externalises all of them.

THE ASSUMPTION MAP FRAMEWORK

Step 1 — ASSUMPTION HARVEST
Set a timer for 10 minutes. The product team writes every assumption they can think of on sticky notes. One assumption per note. No filtering yet.

Prompts to generate assumptions:
- "We assume customers will..." (desire assumptions)
- "We assume our solution will..." (feasibility assumptions)
- "We assume the business can..." (viability assumptions)
- "We assume the market has..." (market assumptions)
- "We assume regulation will allow..." (compliance assumptions)

Step 2 — THE ASSUMPTION MAP GRID

Plot every assumption on a 2×2 grid:

Axis 1 — IMPORTANCE (high/low): how bad is it if this assumption is wrong?
Axis 2 — CERTAINTY (high/low): how confident are you right now that this is true?

The four quadrants:
HIGH importance / LOW certainty → TEST FIRST (critical unknowns — your biggest risks)
HIGH importance / HIGH certainty → VALIDATE (document the evidence behind your confidence)
LOW importance / LOW certainty → TEST IF EASY (de-risk cheaply if you can)
LOW importance / HIGH certainty → MONITOR (these are not worth significant attention now)

Step 3 — CONVERT TO HYPOTHESES

For every HIGH importance / LOW certainty assumption, write a structured hypothesis:

We believe that [subject] will [action] because [reason].
We will know this is true when [observable outcome] in [experiment].

Example:
"We believe that free-tier users will upgrade to paid within 48 hours of seeing a preview of the collaboration feature. We will know this is true when 8% of users who see the preview click ''Upgrade'' within the preview window."

Step 4 — PRIORITISE BY RISK

Rank your hypotheses:
1. Most likely to invalidate the entire solution if wrong (kill-shot assumptions first)
2. Most expensive to reverse if built incorrectly
3. Most time-sensitive (market window, regulatory deadline)

Test in that order.

THE HYPOTHESIS CARD

For each hypothesis to be tested, produce a Hypothesis Card:
- Hypothesis statement (we believe / we will know format)
- Assumption category (desire / feasibility / viability / market / compliance)
- Risk rating (1–5: 5 = solution collapses if wrong)
- Proposed experiment
- Success metric and threshold
- Owner and target date for experiment completion

DELIVERABLE: Assumption Map
Take your OST from lesson 1. For the one solution you chose to experiment with, run a 20-minute assumption harvest. Plot every assumption on the Assumption Map grid. Write hypothesis cards for all HIGH importance / LOW certainty assumptions. Rank them by risk. The highest-risk hypothesis becomes your next experiment.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Experiment Design & MVP
  UPDATE public.videos SET
    description = 'An experiment is not a prototype, a pilot, or a soft launch. It is the smallest test you can run to learn whether a specific assumption is true before committing resources to build. This lesson teaches the Experiment Design Canvas: how to choose the right experiment type, set clear success metrics, avoid confirmation bias in your results, and use MVP thinking to maximise learning speed while minimising build cost.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Experiment Design & MVP',
      'description', 'An experiment is the smallest test that generates real evidence. This lesson teaches the Experiment Design Canvas, how to choose the right experiment type, set honest success metrics, and use MVP thinking to maximise learning at minimum cost.',
      'transcript', 'EXPERIMENT DESIGN & MVP

THE MISTAKE MOST TEAMS MAKE

Most teams confuse "building fast" with "learning fast." They build a minimal product and ship it, then declare that the MVP validated their idea. But an MVP that was never designed around a specific assumption test has not tested anything — it has just launched.

The Build-Measure-Learn loop (Lean Startup) is powerful, but it requires a deliberately designed "Measure" step. Without a pre-specified metric and threshold, any result can be rationalised as validation.

EXPERIMENT TYPES (ORDERED BY COST)

1. LITERATURE / DATA REVIEW (cost: hours)
Before running any experiment: what does existing data tell you? Check: internal analytics, customer support logs, NPS verbatims, industry research. Often you can answer the assumption without any new experiment.

2. CUSTOMER INTERVIEW (cost: days)
Talk to 5 customers. Ask about the problem, not the solution. "How do you currently handle X? What do you do when Y happens? How often? What does that cost you?" Five interviews are enough to surface patterns — not statistical proof, but directional signal.

3. SMOKE TEST / LANDING PAGE (cost: days)
Build a landing page describing the solution (or feature). Drive traffic. Measure: do people click "get early access" or "learn more"? This tests desire without building anything.

4. CONCIERGE (cost: weeks)
Deliver the solution manually, by hand, to a small set of real customers. The team does the work a machine would eventually do. Validates whether the outcome is achieved — not whether the product is buildable.

5. PROTOTYPE TEST (cost: weeks)
A clickable or non-functional prototype. Tests UX, flow, and comprehension without writing production code.

6. PILOT / BETA (cost: months)
A limited release to real users. Tests at scale but costs significantly more. Reserve for assumptions that cannot be tested more cheaply.

THE EXPERIMENT DESIGN CANVAS

For every experiment, complete these six fields before you start:

1. Assumption being tested: (the specific hypothesis card from lesson 2)
2. Experiment type: (from the list above — choose the cheapest that generates valid signal)
3. Target participants: (who, how many, how recruited)
4. What they will experience: (exactly what happens during the experiment)
5. Success metric: (the observable outcome you will measure)
6. Success threshold: (the number that says "assumption validated" vs. "assumption failed")

MINIMUM VIABLE PRODUCT

An MVP is not a stripped-down version of the full product. An MVP is the smallest set of functionality that allows you to test the riskiest assumption in a real usage environment.

The question is not: "What can we cut to ship faster?"
The question is: "What is the single assumption we must test in production — and what is the minimum build that tests only that?"

AVOIDING CONFIRMATION BIAS

Pre-specify your success threshold BEFORE running the experiment. Write it down. Share it publicly.

If your threshold was "8% of preview users upgrade within 48 hours" and you got 5%, you have not validated the assumption — even if 5% "feels good." Results that do not hit the pre-specified threshold require an honest conversation: pivot, persevere, or abandon.

DELIVERABLE: Experiment Plan
Using the highest-risk hypothesis from your Assumption Map, complete an Experiment Design Canvas. Choose the cheapest experiment type that generates valid signal. Define your success metric and threshold before designing the experiment. Outline a two-week execution plan including recruitment, execution, and analysis.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Discovery Research & Evidence
  UPDATE public.videos SET
    description = 'Discovery research is the engine that converts customer conversations into product decisions. Without a structured approach, teams drown in interesting anecdotes but cannot identify the patterns that actually matter. This lesson teaches the Discovery Research Framework: how to plan a research sprint, choose between qualitative and quantitative methods, synthesise findings into prioritised opportunity clusters, and document evidence in a way that stands up to stakeholder scrutiny.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Discovery Research & Evidence',
      'description', 'Discovery research converts customer conversations into product decisions. This lesson teaches the Discovery Research Framework: planning a research sprint, choosing methods, synthesising findings into opportunity clusters, and documenting evidence that withstands stakeholder scrutiny.',
      'transcript', 'DISCOVERY RESEARCH & EVIDENCE

THE DIFFERENCE BETWEEN RESEARCH AND ANECDOTE

"Our CEO talked to a customer who said they loved the idea" is an anecdote.
"We conducted 14 interviews across three customer segments and found that 11 of 14 cited this problem unprompted" is evidence.

Anecdotes drive features that the loudest stakeholder cares about. Evidence drives features that the most customers need.

The BA''s role in discovery research is to build an evidence base rigorous enough to make the case for or against a solution in front of a sceptical CFO.

RESEARCH QUESTION FIRST

Before choosing a method, define your research question precisely:
- "Do customers in the enterprise segment experience X problem?"
- "How do customers currently solve Y, and how much does it cost them?"
- "What is the priority of problem Z relative to the other problems customers face?"

A clear research question tells you which method to use. An unclear research question produces unusable data.

QUALITATIVE VS. QUANTITATIVE

QUALITATIVE (why and how)
Best for: understanding behaviour, uncovering hidden motivations, generating hypotheses
Methods: user interviews, contextual observation, diary studies, focus groups
Sample size: 5–20 participants (patterns emerge quickly with structured analysis)
Output: themes, opportunity clusters, hypothesis candidates

QUANTITATIVE (how many and how much)
Best for: validating frequency, measuring magnitude, testing hypotheses at scale
Methods: surveys, A/B tests, funnel analytics, cohort analysis
Sample size: statistically significant (minimum 100–200 for directional signal; 1,000+ for decision-grade confidence)
Output: percentages, confidence intervals, statistical significance scores

Most discovery requires both: qualitative to understand the problem, quantitative to size it.

THE FIVE-STEP RESEARCH SPRINT

Step 1 — PLAN (day 1–2)
Define research questions, choose methods, recruit participants, prepare interview guides or survey instruments.

Step 2 — COLLECT (day 3–7)
Run interviews. Conduct surveys. Pull analytics. Maintain a research log noting who said what.

Step 3 — CODE (day 8–9)
Affinity mapping: write each observation on a sticky note. Group observations that share a theme. Name the theme. Count how many participants raised each theme.

Step 4 — SYNTHESISE (day 10)
Rank opportunity clusters by: frequency (how many participants raised it), severity (how much pain does it cause), business value (how much does solving it move our outcome).

Step 5 — COMMUNICATE (day 11)
Produce a Discovery Findings document: the research question, method, participant profile, top 3 opportunity clusters (with supporting evidence), and recommended next steps.

EVIDENCE STANDARDS FOR STAKEHOLDER PRESENTATIONS

When presenting discovery findings to stakeholders, meet these standards:
- Quote customers directly (sanitised for anonymity)
- State participant count and selection criteria
- Show the distribution of responses (not just the most striking quote)
- Separate observation (what people said) from inference (what you think it means)
- State your confidence level and what would change your conclusion

This is what distinguishes a credible discovery brief from a slide deck of opinions.

DELIVERABLE: Discovery Findings
Plan and conduct a mini research sprint: 3–5 customer interviews (internal stakeholders count) around an opportunity in your OST. Apply affinity mapping. Identify your top 2 opportunity clusters with supporting evidence. Write a one-page Discovery Findings document suitable for a product team or sponsor review.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Working Backwards & the Executive Discovery Report
  UPDATE public.videos SET
    description = 'Amazon''s "Working Backwards" method forces product teams to write the press release and FAQ before writing a single requirement — ensuring the team can articulate value before they commit to building. This lesson teaches Working Backwards as a discovery synthesis tool, shows how to integrate it with your OST and Assumption Map, and produces the Executive Discovery Report: the artefact that takes your discovery findings to leadership and gets the funding decision made.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Working Backwards & the Executive Discovery Report',
      'description', 'Amazon''s Working Backwards method forces teams to articulate customer value before writing a single requirement. This lesson teaches Working Backwards as a synthesis tool and produces the Executive Discovery Report that secures the funding decision.',
      'transcript', 'WORKING BACKWARDS & THE EXECUTIVE DISCOVERY REPORT

THE WORKING BACKWARDS METHOD

Amazon''s product development method, detailed by Colin Bryar and Bill Carr in "Working Backwards" (2021), starts from the desired customer outcome and works backwards to the product. Before any technical design or requirements work, the team writes two documents:

1. THE PRESS RELEASE (1 page)
Written as if the product has already launched and is being announced. It must include:
- Headline: the product name and the single customer benefit
- Sub-headline: who the product is for and what problem it solves
- Problem paragraph: describe the customer problem in customer language
- Solution paragraph: explain the product and how it solves the problem
- Quote from a fictional satisfied customer
- Quote from an internal leader explaining why the product matters
- Call to action

The discipline: if you cannot write a clear, compelling press release, you do not yet understand what you are building or why.

2. THE FAQ (2–3 pages)
Anticipates every hard question a customer, partner, regulator, or investor might ask. Sections typically include:
- Customer experience questions ("What happens if...?")
- Technical questions ("How does the system handle...?")
- Business questions ("What does this cost? What are the terms?")
- Edge case questions ("What about customers who...?")
- Failure mode questions ("What if the AI is wrong?")

Writing the FAQ forces the team to confront the hardest problems before they invest in building.

HOW WORKING BACKWARDS CONNECTS TO THE OST

The Working Backwards press release and FAQ are discovery synthesis tools. They sit between discovery research and solution definition:

Discovery Findings → Working Backwards PR/FAQ → Refined OST → Experiment Design

The press release tests whether you can articulate the opportunity in customer language. If you cannot, you need more discovery. If you can, the FAQ forces you to surface the hardest assumptions to test.

THE EXECUTIVE DISCOVERY REPORT

The Executive Discovery Report (EDR) is the BA''s bridge between discovery outputs and a funding or prioritisation decision. It synthesises everything from the discovery module into a document a senior leader can act on in 20 minutes.

STRUCTURE OF THE EXECUTIVE DISCOVERY REPORT:

1. EXECUTIVE SUMMARY (half page)
The recommended decision and the top three reasons, written for someone who will not read the rest of the document.

2. PROBLEM DEFINITION (half page)
The customer problem in customer language, with quantified scope where available.

3. DISCOVERY EVIDENCE SUMMARY (1 page)
Key findings from customer research: participant profile, top opportunities, supporting evidence.

4. PROPOSED DIRECTION (half page)
The recommended solution direction (not a detailed spec — a direction). Includes which opportunity cluster it addresses and why.

5. WORKING BACKWARDS PRESS RELEASE
The draft press release for the proposed solution.

6. RISKIEST ASSUMPTIONS & NEXT EXPERIMENTS (half page)
The top 3 assumptions that must be tested before committing to build, and the proposed experiments.

7. RECOMMENDED DECISION & NEXT STEPS (half page)
A clear recommended decision (proceed / hold / pivot) with supporting rationale and proposed next steps if approved.

DELIVERABLE: Executive Discovery Report
Synthesise your work from module 10 — your OST, Assumption Map, Experiment Plan, and Discovery Findings — into a complete Executive Discovery Report. Write the Working Backwards press release and FAQ for your recommended solution direction. Produce a document suitable for a 20-minute leadership review.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 11 — Data Analysis for BAs: Decision Intelligence  (OFFSET 10, order_index = 11)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 10;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M11 chapter not found'; END IF;

  -- Lesson 1: From Reporting to Decision Intelligence
  UPDATE public.videos SET
    description = 'Reporting tells you what happened. Decision intelligence tells you what to do about it. The shift from BA-as-report-requester to BA-as-decision-intelligence-practitioner is one of the highest-leverage career moves available — and it starts with understanding the difference between a KPI and a decision trigger, between a dashboard and an insight, and between data that informs and data that drives action. This lesson frames the module and teaches you how to assess the health of any KPI set in under 30 minutes.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'From Reporting to Decision Intelligence',
      'description', 'Reporting tells you what happened. Decision intelligence tells you what to do. This lesson teaches the shift from report-requester to decision-intelligence practitioner, and how to assess the health of any KPI set in under 30 minutes.',
      'transcript', 'FROM REPORTING TO DECISION INTELLIGENCE

THE REPORTING TRAP

Most organisations have too many reports and too little intelligence. Data is collected, aggregated, formatted, and emailed to executives who glance at it, feel informed, and take no specific action.

This is the reporting trap: the illusion of data-driven decision-making. The team is looking at data. The data is not producing decisions.

Decision intelligence is different. It asks: "What decision does this data need to support, and does our current data architecture enable that decision?" If the answer is no, the reporting infrastructure needs to change — regardless of how many dashboards exist.

THE REPORTING-TO-INTELLIGENCE SPECTRUM

Level 1 — DESCRIPTIVE: what happened?
"Our churn rate last quarter was 4.2%."
Value: awareness. No action implied.

Level 2 — DIAGNOSTIC: why did it happen?
"Churn was highest in the enterprise segment, driven by customers who did not complete onboarding."
Value: root cause. Implies an action direction.

Level 3 — PREDICTIVE: what will happen?
"Based on usage patterns, 18% of accounts are at elevated churn risk in the next 60 days."
Value: intervention window. Specific customers to target.

Level 4 — PRESCRIPTIVE: what should we do?
"For accounts at churn risk, proactive outreach by a customer success manager within 14 days reduces churn by 60%."
Value: decision. Specific action with expected outcome.

The BA operating at Level 3–4 has a fundamentally different impact than one operating at Level 1.

WHAT MAKES A KPI GOOD?

A KPI (Key Performance Indicator) is only as good as the decision it enables. Test every KPI against these five criteria:

1. LINKED TO OUTCOME: does this metric move when the business outcome improves?
2. ACTIONABLE: if this metric moves in the wrong direction, is there a clear action the team can take?
3. OWNED: does one person own this metric and have authority to act on it?
4. CURRENT: is this data available within a decision-useful timeframe?
5. TRUSTED: does the team actually believe this number, or do they debate the methodology?

A KPI that fails any of these criteria is a vanity metric — it looks good in a board presentation but does not drive decisions.

THE KPI HEALTH ASSESSMENT

The KPI Health Assessment is a one-page diagnostic the BA runs at the start of any engagement involving metrics:

For each KPI in scope:
- Name and definition
- Owner
- Current value
- Target / threshold
- Data source and refresh cadence
- Five-criteria rating (1–5 per criterion)
- Verdict: decision-ready / needs improvement / replace

This assessment tells you immediately which metrics can be trusted to drive recommendations and which need to be fixed before analysis work begins.

DELIVERABLE: KPI Health Assessment
Choose a product, project, or business unit you are familiar with. List every KPI currently being tracked (or that should be tracked). Rate each against the five criteria. Produce a one-page KPI Health Assessment with your verdict on each metric and your top three recommendations for improvement.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Metrics, KPIs & Metric Trees
  UPDATE public.videos SET
    description = 'A Metric Tree maps how every leading and lagging indicator in a business connects to a single north-star metric — and makes visible which levers the team can actually pull. This lesson teaches you to build a Metric Tree from scratch, identify the metrics where small improvements have the highest leverage, and diagnose why a top-line metric is moving (or not) by tracing it through the tree.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Metrics, KPIs & Metric Trees',
      'description', 'A Metric Tree maps how every leading and lagging indicator connects to a north-star metric. This lesson teaches you to build one from scratch, identify high-leverage metrics, and diagnose why a top-line number is moving by tracing it through the tree.',
      'transcript', 'METRICS, KPIS & METRIC TREES

THE PROBLEM WITH FLAT METRIC LISTS

Most organisations track metrics in a flat list: revenue, churn, NPS, activation rate, DAU, ticket volume. These are all measured. None are connected.

When revenue dips, the team debates which metric is responsible. Hours are wasted. Nobody can prove causality because the relationship between metrics was never mapped.

A Metric Tree solves this by making the hierarchy explicit.

WHAT IS A METRIC TREE?

A Metric Tree (also called a KPI tree or metric decomposition tree) is a hierarchical diagram that shows:
- The NORTH-STAR metric at the top (the single measure of overall product or business health)
- PRIMARY metrics one level down (the 3–5 metrics that directly drive the north star)
- SECONDARY metrics (the levers that drive each primary metric)
- LEADING INDICATORS at the base (the early-warning signals that predict secondary metric movement before it happens)

Example tree for a SaaS product:

NORTH STAR: Monthly Recurring Revenue (MRR)
  ├── New MRR (from new customers)
  │     ├── Trial starts
  │     │     └── Lead volume × Trial conversion rate
  │     └── Trial-to-paid conversion rate
  │           └── Activation rate (completed onboarding in week 1)
  └── Retained MRR (from existing customers)
        ├── Gross retention rate
        │     └── Product engagement score (daily active use)
        └── Expansion MRR
              └── Feature adoption rate (paid features used per account)

HOW TO BUILD A METRIC TREE

Step 1 — IDENTIFY THE NORTH STAR
What is the single metric that best represents the value the product delivers to customers AND the revenue it generates for the business? For most SaaS products: MRR. For marketplaces: GMV. For consumer apps: Daily Active Users × Revenue per User.

Step 2 — DECOMPOSE THE NORTH STAR
Use the formula approach. MRR = (Number of customers × Average Revenue per Customer). Now decompose each factor: Number of customers = New customers − Churned customers. Each decomposition creates a new level of the tree.

Step 3 — ADD LEADING INDICATORS
Leading indicators are early-warning metrics that change before the outcome metric changes. Example: "Feature X adoption in week 1" predicts retention in month 3. Add these at the base of each branch.

Step 4 — VALIDATE EACH RELATIONSHIP
Do not assume correlation implies causality. For each parent-child relationship in the tree, ask: "Do we have evidence that improving this metric actually improves its parent?" If not, label the relationship as "hypothesis — to be tested."

USING THE TREE TO DIAGNOSE PROBLEMS

When MRR drops unexpectedly, the Metric Tree becomes a diagnostic tool:
1. Check each primary metric: which one changed?
2. For the metric that changed, check its secondary metrics: which lever moved?
3. For the secondary metric that changed, check leading indicators: when did this start?

This narrows a company-level problem to a specific, actionable cause in minutes — not days.

DELIVERABLE: Metric Tree
Build a Metric Tree for a product, product line, or business unit you know. Start with the north-star metric. Decompose two levels down. Add at least one leading indicator per primary metric branch. Validate (or flag as hypothesis) each relationship. Present as a visual diagram with a one-paragraph interpretation of what the tree tells you about where to look if performance declines.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: SQL & Analysis for Decisions
  UPDATE public.videos SET
    description = 'A BA who can write SQL has a career superpower. Not because they replace data analysts — but because they can ask and answer questions in minutes instead of waiting days for a data pull, can validate requirements against real data before a sprint starts, and can speak the technical language of the engineering team with authority. This lesson teaches the core SQL patterns every BA needs: filtering, aggregation, joining, and window functions — all framed around the business question, not the query syntax.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'SQL & Analysis for Decisions',
      'description', 'A BA who can write SQL asks and answers business questions in minutes instead of waiting days for a data pull. This lesson teaches the core SQL patterns every BA needs — filtering, aggregation, joins, and window functions — framed around the business question.',
      'transcript', 'SQL & ANALYSIS FOR DECISIONS

WHY BAS NEED SQL (BUT NOT DBA-LEVEL SQL)

You do not need to optimise query performance, manage indexes, or design database schemas. You need to:
- Pull the data you need to validate an assumption
- Aggregate metrics to answer a business question
- Join tables to combine information the business holds in separate places
- Calculate time-based metrics like retention, churn, and conversion

These four skills cover 90% of what a BA needs from SQL.

THE BUSINESS-QUESTION-FIRST APPROACH

Never start with a SQL query. Start with the business question.

Business question: "How many customers who signed up in Q1 are still active today?"
Then translate: I need the users table (signup date), the activity table (last active date), join them, filter for Q1 signups, count those still active.
Then write SQL.

This sequence — question → logic → query — prevents the most common mistake: writing a query and then searching for a question it answers.

CORE PATTERN 1: FILTERING AND AGGREGATION

SELECT
  segment,
  COUNT(*) AS customer_count,
  AVG(monthly_revenue) AS avg_mrr,
  SUM(monthly_revenue) AS total_mrr
FROM customers
WHERE status = ''active''
  AND signup_date >= ''2025-01-01''
GROUP BY segment
ORDER BY total_mrr DESC;

Business question answered: "What is the revenue breakdown by segment for active customers who signed up this year?"
Key clauses: WHERE (filter), GROUP BY (aggregate), ORDER BY (sort for readability).

CORE PATTERN 2: JOINING TABLES

SELECT
  c.customer_id,
  c.company_name,
  c.segment,
  COUNT(o.order_id) AS order_count,
  SUM(o.order_value) AS lifetime_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.signup_date >= ''2024-01-01''
GROUP BY c.customer_id, c.company_name, c.segment
ORDER BY lifetime_value DESC NULLS LAST;

Business question answered: "What is the lifetime value of customers by company, including customers who have never ordered?"
Key concept: LEFT JOIN includes customers with no orders (order columns are NULL). INNER JOIN would exclude them.

CORE PATTERN 3: CONVERSION FUNNEL

SELECT
  DATE_TRUNC(''week'', created_at) AS week,
  COUNT(DISTINCT user_id) AS signups,
  COUNT(DISTINCT CASE WHEN completed_onboarding THEN user_id END) AS activated,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN completed_onboarding THEN user_id END)
    / NULLIF(COUNT(DISTINCT user_id), 0), 1
  ) AS activation_rate_pct
FROM user_events
WHERE created_at >= NOW() - INTERVAL ''90 days''
GROUP BY week
ORDER BY week;

Business question answered: "How is our weekly activation rate trending over the last 90 days?"

CORE PATTERN 4: COHORT RETENTION (WINDOW FUNCTION)

SELECT
  cohort_month,
  months_since_signup,
  COUNT(DISTINCT user_id) AS retained_users,
  ROUND(
    100.0 * COUNT(DISTINCT user_id)
    / FIRST_VALUE(COUNT(DISTINCT user_id)) OVER (
        PARTITION BY cohort_month ORDER BY months_since_signup
    ), 1
  ) AS retention_pct
FROM cohort_data
GROUP BY cohort_month, months_since_signup
ORDER BY cohort_month, months_since_signup;

Business question answered: "What percentage of each monthly cohort is still active 1, 2, 3 months after signup?"
Key concept: OVER (PARTITION BY) creates a window — it computes a function across a defined set of rows without collapsing them.

AI-ASSISTED SQL

A BA does not need to memorise syntax. Use AI to generate first-draft queries:
Prompt: "Write a PostgreSQL query that shows the 7-day rolling average of new signups from the users table, filtered to the last 6 months. Include the date, daily signups, and rolling average."
Then: validate the logic against your business question, check the JOIN conditions, run against a sample dataset, verify the output makes sense.

DELIVERABLE: SQL Decision Query Set
Choose 3 business questions from your KPI Health Assessment that require data to answer. Write a SQL query for each. If you do not have database access, write the queries as if the tables exist and describe the expected output. Annotate each query with: business question, table logic, key clauses, and what decision the output enables.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Visualization & Executive Dashboards
  UPDATE public.videos SET
    description = 'An executive dashboard that requires explanation has failed. The purpose of a dashboard is to answer the right questions instantly — without a meeting, without a data analyst, without ambiguity. This lesson teaches the principles behind dashboards that executives actually use: how to choose the right chart for each data question, how to design for decision speed, and how to write a dashboard specification that a BI developer can build without a single follow-up question.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Visualization & Executive Dashboards',
      'description', 'A dashboard that requires explanation has failed. This lesson teaches chart selection, design-for-decision-speed principles, and how to write a dashboard specification a BI developer can build without follow-up questions.',
      'transcript', 'VISUALIZATION & EXECUTIVE DASHBOARDS

THE PURPOSE OF A DASHBOARD

A dashboard serves one purpose: to answer a specific set of questions instantly, for a specific audience, with a specific decision in mind.

If you cannot state those three things — questions, audience, decision — before you design the dashboard, you will produce a data display that looks impressive and drives no action.

CHART SELECTION: THE RULE OF PURPOSE

Do not choose a chart type because it looks interesting. Choose it because it answers the question.

QUESTION TYPE → CHART TYPE:

"How much / how many?" → Bar chart (vertical for time series, horizontal for rankings)
"How is this trending over time?" → Line chart (one line per metric; no more than 4 lines per chart)
"What is the breakdown of a whole?" → Stacked bar or treemap (avoid pie charts — human eyes cannot accurately compare angles)
"How do two variables relate?" → Scatter plot (add regression line if showing correlation)
"How is performance distributed?" → Histogram or box plot
"How does actual compare to target?" → Bullet chart or bar chart with target line overlay
"What is the current status?" → Single-number KPI card with trend indicator (↑ ↓) and comparison period

THE FIVE DASHBOARD DESIGN PRINCIPLES

1. ONE DECISION PER DASHBOARD
A dashboard trying to answer 20 questions answers none of them well. Each dashboard should enable one category of decision: "Should we intervene in churn this week?" or "Did the launch perform as expected?"

2. LEAD WITH THE DECISION METRIC
The most important metric goes top-left. Humans read dashboards like newspapers — top-left first. Whatever is most important to the decision goes there.

3. TRAFFIC LIGHT THRESHOLDS
Every metric on an executive dashboard should have a RAG (Red/Amber/Green) threshold. The executive should be able to identify at a glance which metrics need attention. Green = on target. Amber = within 10% of threshold, watching. Red = threshold breached, action required.

4. CONTEXT, NOT JUST CURRENT
Never show a single number without context: prior period comparison, trend sparkline, or target. "Churn rate: 4.2%" means nothing. "Churn rate: 4.2% (↑ from 3.8% last month; target: ≤ 3.5%)" drives a conversation.

5. MINIMISE COGNITIVE LOAD
Each additional element on a dashboard increases the cognitive load of the viewer. Remove: decorative elements, 3D effects, gridlines that do not aid reading, colours that serve no informational purpose. If removing it does not reduce clarity, remove it.

WRITING THE DASHBOARD SPECIFICATION

The BA''s deliverable is not the dashboard — it is the specification that the BI developer builds from. A complete Dashboard Specification includes:

1. Dashboard name and purpose statement
2. Primary audience and decision it enables
3. Refresh cadence (real-time / hourly / daily / weekly)
4. Metric table: for each metric — name, definition, source table/field, calculation, RAG thresholds, chart type, position on grid
5. Filter requirements: date ranges, segments, regions, product lines
6. Drill-down requirements: which metrics link to supporting detail views
7. Access and permissions: who can see what

DELIVERABLE: Executive KPI Dashboard Spec
Using the Metric Tree from lesson 2, design an executive dashboard for the north-star metric and its primary metrics. Write a complete Dashboard Specification following the structure above. Include: RAG thresholds for every metric, chart type justification for each, and a wireframe sketch (hand-drawn is fine).'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Root-Cause Analysis & the Decision Brief
  UPDATE public.videos SET
    description = 'When a metric moves unexpectedly, the pressure to act immediately is intense — and almost always wrong. Acting on a symptom while the root cause is undiagnosed wastes resources and often makes the problem worse. This lesson teaches two root-cause analysis frameworks (the 5 Whys and the Fishbone Diagram), how to use your Metric Tree to narrow the search space, and how to package your findings as a Decision Brief that takes executives from problem to recommended action in one document.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Root-Cause Analysis & the Decision Brief',
      'description', 'Acting on a symptom while the root cause is undiagnosed wastes resources. This lesson teaches the 5 Whys and Fishbone Diagram, how to use your Metric Tree to narrow root-cause searches, and how to write a Decision Brief that moves executives from problem to action.',
      'transcript', 'ROOT-CAUSE ANALYSIS & THE DECISION BRIEF

WHY ROOT CAUSE ANALYSIS IS HARD

Two reasons root cause analysis fails in practice:

1. STOPPING TOO EARLY: teams identify the first plausible cause and act on it. The first plausible cause is almost never the root cause — it is the most visible symptom.

2. ANCHORING: the most senior person in the room names a cause in the first five minutes, and the team spends the rest of the meeting confirming their hypothesis rather than investigating alternatives.

Structured root cause analysis forces the team to go deeper and wider before committing to a diagnosis.

THE 5 WHYS

Developed at Toyota as part of the Toyota Production System. Deceptively simple — powerful when applied rigorously.

Rule: ask "Why?" five times. Each answer becomes the input to the next why.

Example:
Symptom: "Churn rate increased from 3.5% to 5.2% in the last 30 days."

Why 1: Why did churn increase?
Answer: "Enterprise customers are cancelling at higher rates than usual."

Why 2: Why are enterprise customers cancelling?
Answer: "Exit surveys show they feel they are not getting enough value."

Why 3: Why do they feel they are not getting enough value?
Answer: "They are not using the features they paid for."

Why 4: Why are they not using the features?
Answer: "The onboarding for enterprise features takes 4 weeks and requires professional services."

Why 5: Why does onboarding take 4 weeks?
Answer: "Our professional services team is at capacity and there is a 3-week backlog for enterprise onboarding slots."

Root cause: Professional services capacity constraint is creating a 3-week delay in enterprise onboarding, resulting in customers churning before they realise value.

Action: Prioritise PS capacity expansion and/or self-serve onboarding for enterprise features.

THE FISHBONE DIAGRAM (ISHIKAWA)

The Fishbone (or Ishikawa) diagram maps multiple potential causes across six standard categories:

The "fish head" is the problem statement. The "spine" is the central axis. Six "bones" represent cause categories:

1. PEOPLE — training gaps, staffing, accountability
2. PROCESS — workflow failures, handoff breakdowns, missing steps
3. SYSTEMS — technology failures, integration gaps, data quality
4. ENVIRONMENT — market conditions, regulatory changes, external factors
5. MEASUREMENT — wrong metrics, missing data, misleading thresholds
6. MANAGEMENT — decision-making delays, resource allocation, priority conflicts

For each category, brainstorm potential causes of the problem. Then vote on the most likely candidates and apply the 5 Whys to each finalist.

USING THE METRIC TREE TO NARROW THE SEARCH

Before running a 5 Whys or Fishbone, use your Metric Tree:
1. Identify which branch of the tree changed (narrowing from 20 metrics to 3)
2. Check leading indicators for that branch (identifying when the issue started)
3. Cross-reference with external events (releases, campaigns, market events) in that timeframe

This narrows a company-level problem to a specific domain in minutes — making the 5 Whys exercise far more productive.

THE DECISION BRIEF

A Decision Brief packages root cause analysis findings for executive action. It is a 1–2 page document structured as:

1. PROBLEM STATEMENT: what metric moved, by how much, since when
2. IMPACT QUANTIFICATION: what this costs in revenue, NPS, or other business impact if unaddressed
3. ROOT CAUSE FINDING: the diagnosed root cause with supporting evidence
4. OPTIONS CONSIDERED: 2–3 response options with estimated impact and cost
5. RECOMMENDED ACTION: the BA''s recommendation with rationale
6. DECISION REQUIRED: what the executive needs to decide today
7. NEXT STEPS: immediate actions if approved, owner, and timeline

The Decision Brief is the difference between data that informs and data that drives action.

DELIVERABLE: Root-Cause Analysis Report + Decision Brief
Choose a metric from your KPI Health Assessment that is underperforming. Apply the 5 Whys to diagnose the root cause. Create a Fishbone Diagram identifying causes across all six categories. Document your diagnosis in a Root-Cause Analysis Report. Then write a one-page Decision Brief recommending a course of action to a senior stakeholder.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 12 — Solution Evaluation, Validation & Acceptance  (OFFSET 11, order_index = 12)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 11;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M12 chapter not found'; END IF;

  -- Lesson 1: Solution Options & Trade-offs
  UPDATE public.videos SET
    description = 'The worst solution evaluation is the one where the team considers only the solution someone already decided to build. Options Analysis forces the team to compare at least three distinct approaches before committing — and to make that comparison along the dimensions that actually matter: cost, risk, strategic fit, time to value, and implementation complexity. This lesson teaches you to run a rigorous options analysis that gives executives a real choice, not a rubber stamp.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Solution Options & Trade-offs',
      'description', 'Options Analysis forces teams to compare at least three approaches before committing — across cost, risk, strategic fit, time to value, and complexity. This lesson teaches rigorous options analysis that gives executives a real choice, not a rubber stamp.',
      'transcript', 'SOLUTION OPTIONS & TRADE-OFFS

THE SINGLE-OPTION TRAP

The most common failure in solution evaluation: the team presents one option ("here is how we will build it") framed as analysis. This is not analysis. This is advocacy dressed up as objectivity.

Genuine options analysis requires at least three distinct approaches to be seriously evaluated. If you cannot identify three options, you have not done enough discovery.

THE MINIMUM THREE OPTIONS

For any solution choice, structure your analysis around at minimum:

OPTION 1 — DO NOTHING (or DEFER)
What happens if the business does not address this problem right now? What is the cost of inaction in 6, 12, 24 months? Quantify it. "Do nothing" is always a valid strategic choice — make it explicit so decision-makers can consciously choose or reject it.

OPTION 2 — MINIMUM VIABLE SOLUTION
The smallest investment that meaningfully addresses the core problem. Often a process change, a workaround, or a minimal technology intervention. Fastest to implement, lowest risk, lowest cost — and often undervalued because it is not impressive.

OPTION 3 — FULL BUILD / OPTIMAL SOLUTION
The solution the team most wants to build. Full functionality, optimal architecture, best long-term outcome. Highest cost, highest implementation complexity, longest time to value.

If budget and time were not constraints, you would always choose Option 3. The job of options analysis is to determine whether the additional investment is justified given the evidence.

THE FIVE EVALUATION DIMENSIONS

Evaluate every option across these five dimensions:

1. COST (total cost of ownership)
Include: implementation cost, licensing/infrastructure, ongoing maintenance, training, change management, opportunity cost of the team''s time.

2. RISK (technical + business)
Technical risk: how confident are we that this can be built as specified?
Business risk: what happens if this does not deliver the expected outcome?
Rate each option: Low / Medium / High risk.

3. STRATEGIC FIT
Does this option align with the organisation''s stated strategic direction? Does it build capability the business needs long-term, or does it create a dead-end solution?

4. TIME TO VALUE
How long before the business starts realising benefit? A solution that takes 18 months to deliver may be suboptimal compared to a solution that delivers 60% of the value in 6 months.

5. IMPLEMENTATION COMPLEXITY
Stakeholder change required, integration dependencies, regulatory approvals needed, data migration complexity, team capability requirements.

THE WEIGHTED SCORING MODEL

When trade-offs are complex, a Weighted Scoring Model adds rigour:

Step 1: Agree the weights for each dimension with the sponsor (weights must sum to 100)
Step 2: Rate each option 1–5 on each dimension (5 = most favourable)
Step 3: Multiply each rating by the weight
Step 4: Sum the weighted scores per option

The option with the highest weighted score is not automatically chosen — but it provides a data-anchored starting point for the conversation.

Important: document any disagreement with the model''s output. "The model recommends Option 2 but the sponsor overruled due to strategic considerations not captured in the model" is a valid and important audit trail note.

DELIVERABLE: Options Analysis
For the solution direction identified in your Executive Discovery Report (module 10), develop a formal Options Analysis. Define at least three options including "do nothing." Evaluate each across the five dimensions. Apply a weighted scoring model (agree weights with a sponsor or stakeholder). Write a two-page Options Analysis summary with your recommendation and the trade-off rationale.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Business Case & ROI — the Funding Decision
  UPDATE public.videos SET
    description = 'A business case is not a PowerPoint presentation — it is a structured financial and strategic argument that justifies an investment decision. The BAs who get funding approved are the ones who can quantify expected benefits, model the costs, calculate ROI and payback period, and present the risk-adjusted case with intellectual honesty about the uncertainties. This lesson teaches the five-section business case structure and the ROI calculation methods that CFOs actually respect.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Business Case & ROI — the Funding Decision',
      'description', 'A business case is a structured financial and strategic argument for investment. This lesson teaches the five-section structure and ROI calculation methods — payback period, NPV, and benefit-to-cost ratio — that CFOs actually respect.',
      'transcript', 'BUSINESS CASE & ROI: THE FUNDING DECISION

WHAT A BUSINESS CASE IS (AND IS NOT)

A business case is NOT:
- A feature specification
- A project plan
- A slide deck about why the team is excited about the idea
- A document written to justify a decision already made

A business case IS:
A structured argument that a specific investment will generate a return that justifies its cost and risk, evaluated against alternative uses of the same resources.

The BA who can write a credible business case is a strategic asset. The BA who cannot is a requirements writer. The difference in career trajectory is significant.

THE FIVE-SECTION BUSINESS CASE STRUCTURE

SECTION 1: EXECUTIVE SUMMARY (1 page)
The decision required, the recommended option, the expected ROI, and the top three reasons to proceed. Written last, read first. An executive who reads only this section should have enough to make an informed decision.

SECTION 2: PROBLEM / OPPORTUNITY STATEMENT (1 page)
Define the business problem or opportunity the investment addresses. Quantify the current cost of the problem or the size of the opportunity. Include: current state metrics, target state metrics, the gap between them.

SECTION 3: OPTIONS ANALYSIS SUMMARY (1 page)
A condensed version of the Options Analysis from lesson 1. Present the shortlisted options, the evaluation criteria, and why the recommended option was chosen. Do not hide the alternatives — executives who see only one option will invent the alternatives themselves, and their invented alternatives are less favourable than your real ones.

SECTION 4: FINANCIAL ANALYSIS (2–3 pages)
This is the heart of the business case. Include:

A) COST MODEL
- Implementation cost: people (by role × days × rate), technology, licensing, infrastructure
- Change management: training, communications, process redesign
- Ongoing costs: maintenance, support, licensing renewals
- Total Cost of Ownership (TCO) over the benefit period (typically 3–5 years)

B) BENEFIT MODEL
Benefits fall into three categories:
- Hard benefits (quantifiable, directly measurable): cost reduction, revenue increase, headcount avoided
- Soft benefits (real but hard to measure): improved compliance posture, risk reduction, employee satisfaction
- Strategic benefits (long-term positioning): capability built, market access, competitive differentiation

Prioritise hard benefits. Soft and strategic benefits support the case but should not be the primary justification.

C) ROI CALCULATIONS

Payback Period: at what point does cumulative benefit exceed cumulative cost?
Payback = Total implementation cost ÷ Annual net benefit
Example: £500K implementation ÷ £200K annual benefit = 2.5-year payback

Return on Investment (ROI):
ROI % = (Total benefits − Total costs) ÷ Total costs × 100
Example: (£600K benefits − £500K costs) ÷ £500K × 100 = 20% ROI

Net Present Value (NPV): for multi-year investments, discount future benefits to present value
Use your organisation''s hurdle rate (typically 8–15%). Benefits in year 3 are worth less than benefits in year 1. NPV > 0 means the investment creates value.

Benefit-to-Cost Ratio (BCR):
BCR = Total benefits ÷ Total costs
BCR > 1.5 is generally considered a strong investment case.

D) SENSITIVITY ANALYSIS
What if benefits are 20% lower than projected? What if costs are 20% higher? Run three scenarios: optimistic, base case, pessimistic. Present the base case as your primary recommendation. Show that even the pessimistic case is acceptable (or explain why the risk is worth taking).

SECTION 5: RISKS, ASSUMPTIONS & GOVERNANCE (1 page)
Document the top 5 risks, their likelihood and impact, and the proposed mitigations. List the critical assumptions the financial model depends on. Describe the governance: who will oversee the investment, how will benefits be tracked, and what is the trigger for reviewing the decision if reality diverges from forecast.

DELIVERABLE: Business Case
Write a complete Business Case for the recommended option from your Options Analysis. Include all five sections. Model the TCO over 3 years. Calculate payback period, ROI, and NPV. Run a sensitivity analysis with three scenarios. The document should be suitable for a CFO or investment committee review.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Solution Validation & Acceptance
  UPDATE public.videos SET
    description = 'Building the right solution and building the solution right are two different things — and the BA owns both. Solution validation ensures that what was built matches what was specified. Acceptance testing ensures that what was specified actually solves the business problem. This lesson teaches the Validation Plan: how to define acceptance criteria before development starts, design test coverage that exposes real issues, and manage the formal acceptance process with stakeholders who did not read the requirements document.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Solution Validation & Acceptance',
      'description', 'Building the right solution and building it right are two different things. This lesson teaches the Validation Plan: defining acceptance criteria before development starts, designing coverage that exposes real issues, and managing formal acceptance with stakeholders.',
      'transcript', 'SOLUTION VALIDATION & ACCEPTANCE

THE TWO VALIDATION QUESTIONS

Verification: did we build it right?
Does the solution match the specification? Does every acceptance criterion pass? Are there no defects in the specified functionality?

Validation: did we build the right thing?
Does the solution actually solve the business problem? If every acceptance criterion passes but the business outcome is not achieved, validation has failed.

Both questions must be answered before acceptance is granted. A system that perfectly implements a flawed specification has passed verification but failed validation.

ACCEPTANCE CRITERIA: THE FOUNDATION OF VALIDATION

The quality of acceptance testing is entirely determined by the quality of acceptance criteria written before development begins.

Strong acceptance criteria are:
- TESTABLE: you can run a test with a clear pass/fail outcome (not "the system should be user-friendly")
- COMPLETE: they cover the success path, the error paths, and the edge cases
- UNAMBIGUOUS: every stakeholder reads them the same way
- TRACEABLE: each criterion links back to a requirement, and each requirement links to a business outcome

Acceptance criteria formats:

GIVEN / WHEN / THEN (Gherkin):
Given [initial context]
When [action taken]
Then [observable outcome]

Example:
Given a user is on the checkout page with 3 items in their cart
When they apply a 15%-off discount code
Then the order total reduces by exactly 15% and the updated total is displayed before payment

RULE-BASED FORMAT:
"The system must [behaviour] when [condition], resulting in [measurable outcome]."

COVERAGE DESIGN: WHAT TESTS TO INCLUDE

Your validation plan must include coverage across four categories:

1. HAPPY PATH (does it work when everything goes right?)
The primary success scenario. User takes the expected path. All inputs are valid. System behaves as specified.

2. NEGATIVE / ERROR PATH (does it fail gracefully when things go wrong?)
Invalid inputs. Missing required fields. System unavailable. User has insufficient permissions. Does the system return a meaningful error message or silently fail?

3. EDGE CASES (does it behave correctly at the boundaries?)
Maximum values. Minimum values. Zero. Empty sets. Duplicate data. Concurrent users. The cases that never appear in demos but regularly appear in production.

4. NON-FUNCTIONAL REQUIREMENTS (does it meet quality standards?)
Performance (does it respond within the specified time under expected load?), security (does it prevent unauthorised access?), accessibility (does it meet WCAG 2.1 AA?), compatibility (does it work in all specified browsers/devices?).

MANAGING THE FORMAL ACCEPTANCE PROCESS

Step 1: PRE-ACCEPTANCE WALKTHROUGH
Before formal UAT begins, the BA and a representative user walk through the system. This is not UAT — it is a quality gate. If the system cannot pass a 30-minute walkthrough without critical issues, it is not ready for user testing. Send it back.

Step 2: DISTRIBUTE UAT SCRIPTS IN ADVANCE
UAT participants should receive test scripts 48 hours before testing begins. Each script specifies: the test scenario, the steps to execute, the expected result, and where to record the actual result. Participants who arrive at UAT without preparation waste everyone''s time.

Step 3: TRIAGE DURING UAT
Not all defects are equal. During UAT, every issue found is classified:
- BLOCKER: system cannot go live until this is resolved
- MAJOR: significant impact on users; must be fixed in this release
- MINOR: workaround exists; can be fixed in a future release
- COSMETIC: no functional impact; low priority

Step 4: THE ACCEPTANCE SIGN-OFF
A formal sign-off is a legal and commercial document. It states: "I, [name, role], accept this solution as meeting the defined acceptance criteria as of [date]." It is not an expression of enthusiasm — it is a formal commitment. Ensure the signatories have authority to make that commitment.

DELIVERABLE: Validation Plan
Write a Validation Plan for the solution from your Business Case. Include: acceptance criteria in Gherkin format for the top 5 requirements, test coverage across all four categories, a UAT execution timeline, a defect triage classification, and the proposed sign-off process with named signatories.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: UAT Design & Execution — the Rollout Decision
  UPDATE public.videos SET
    description = 'User Acceptance Testing is the last gate before a solution reaches production — and the most commonly mismanaged phase in the entire delivery lifecycle. The most common UAT failure is not finding defects; it is running UAT that was never designed to find the defects that matter. This lesson teaches UAT design from the ground up: how to write UAT scripts that test real user journeys, how to run a UAT cycle that produces actionable results, and how to make the go/no-go rollout decision with clarity and accountability.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'UAT Design & Execution — the Rollout Decision',
      'description', 'UAT is the last gate before production — and the most commonly mismanaged phase. This lesson teaches how to write UAT scripts that test real user journeys, run a cycle that produces actionable results, and make the go/no-go rollout decision with clarity.',
      'transcript', 'UAT DESIGN & EXECUTION: THE ROLLOUT DECISION

WHY UAT FAILS

The five most common UAT failure patterns:

1. UAT designed after development finishes — acceptance criteria written retrospectively to match what was built, not what was needed
2. Wrong users doing UAT — IT staff testing on behalf of business users, finding technical defects but missing usability and business-logic issues
3. No test scripts — testers free-form the system and miss critical scenarios
4. No triage process — every issue raised as equally urgent, creating noise that buries critical defects
5. No clear go/no-go criteria — the rollout decision is made on instinct rather than evidence

Each of these is preventable with proper upfront design.

THE UAT DESIGN PROCESS (START BEFORE DEVELOPMENT ENDS)

UAT design should begin when development begins — not when development finishes.

At sprint 1: identify the UAT participants (real users, not IT proxies), the UAT environment requirements, and the data requirements (what data needs to exist in the UAT environment to test realistic scenarios).

At sprint mid-point: draft the UAT scripts. Review them with a sample user to confirm they reflect real work patterns. Revise.

At development complete: hold a pre-UAT walkthrough. Gate entry: the system must pass the walkthrough before UAT begins.

WRITING UAT SCRIPTS

A UAT script is not a test case — it is a guided user journey. The tester should feel like they are doing their real job, not running a test.

UAT Script structure:
- Test ID and name (e.g., UAT-012: Process a refund for an order over 90 days old)
- Business scenario: the realistic business situation that motivates this test
- Pre-conditions: what must be true before starting (data that must exist, permissions required)
- Steps: numbered, specific actions the user takes (click "Submit Order" — not "click the button")
- Expected result for each step: what should happen (not a general description — a specific outcome)
- Actual result: blank for the tester to fill in
- Pass / Fail: simple assessment
- Defect reference: if failed, the defect ID raised

UAT EXECUTION: ROLES AND RESPONSIBILITIES

UAT LEAD (typically the BA):
- Coordinates scheduling and participant readiness
- Runs daily stand-up during UAT execution (15 minutes: blockers, progress, triage)
- Makes triage decisions in real time
- Escalates blockers to the development team within 4 hours
- Maintains the defect log

UAT PARTICIPANTS (business users):
- Execute scripts as assigned
- Record actual results honestly (not what they think should happen — what actually happened)
- Raise defects for every discrepancy, including minor ones (triage will decide priority)
- Complete assigned scripts within the defined UAT window

THE GO/NO-GO FRAMEWORK

The rollout decision should be made against pre-defined criteria, not gut feel:

GO criteria (all must be true):
☐ Zero open BLOCKER defects
☐ All MAJOR defects resolved or formally accepted with a documented workaround
☐ Acceptance criteria pass rate ≥ 95% (or the agreed threshold)
☐ UAT signatories available and prepared to sign
☐ Rollback plan tested and confirmed functional
☐ Production deployment window confirmed with operations

NO-GO triggers (any one is sufficient):
- Open BLOCKER defect(s)
- MAJOR defects unresolved without accepted workaround
- Pass rate below threshold
- Rollback plan not verified

The go/no-go decision is made by the project sponsor or product owner — not the BA, not the development team. The BA''s role is to present the evidence clearly and make a recommendation.

ROLLOUT SEQUENCING

For high-risk changes, consider phased rollout:
- CANARY RELEASE: deploy to 1–5% of users first; monitor for 48 hours; expand if stable
- REGIONAL/SEGMENT ROLLOUT: deploy to one geography or user segment before all users
- FEATURE FLAG: deploy code to all users but activate only for selected users

Phase rollout allows you to detect production issues before they affect your entire user base.

DELIVERABLE: UAT Package
Extend your Validation Plan from lesson 3 into a full UAT Package. Include: 10 UAT scripts (covering happy path, error path, and 3 edge cases), a defect triage classification with examples, a go/no-go decision framework with your pre-defined criteria, a UAT execution schedule (5-day example), and a rollout sequencing recommendation for the solution.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Value Realization & Post-Implementation Review
  UPDATE public.videos SET
    description = 'Most teams celebrate go-live and move on. The highest-performing BAs track whether the solution actually delivered the outcomes promised in the business case — because without that loop closing, the organisation never learns whether its investment decisions are good ones. This lesson teaches the Value Realisation Framework: how to design benefit tracking into the project from day one, run a Post-Implementation Review that is brutally honest and genuinely useful, and produce a PIR that improves every future project the organisation runs.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Value Realization & Post-Implementation Review',
      'description', 'Most teams celebrate go-live and never check if the solution delivered promised outcomes. This lesson teaches the Value Realisation Framework and how to produce a Post-Implementation Review that is honest, useful, and improves every future investment decision.',
      'transcript', 'VALUE REALIZATION & POST-IMPLEMENTATION REVIEW

THE GO-LIVE CELEBRATION PROBLEM

Most organisations treat go-live as the finish line. The team ships the solution, celebrates, closes the project, and moves to the next initiative. Nobody checks whether the business case was right.

The consequences:
- The organisation cannot distinguish good investment decisions from bad ones
- Future business cases are written with unvalidated assumptions from past projects
- The BA community loses the feedback loop that makes it better
- Stakeholders become cynical about business cases because they have never seen one validated

The Post-Implementation Review (PIR) closes this loop.

THE VALUE REALISATION FRAMEWORK

Value realisation is not a one-time event at the PIR. It is designed into the project from the business case stage.

Step 1 — DEFINE BENEFIT METRICS IN THE BUSINESS CASE
Every benefit claim in the business case must have:
- A named metric (what will be measured)
- A baseline (the current value before implementation)
- A target (the value that constitutes success)
- A measurement method (how it will be measured)
- A measurement owner (who is accountable for tracking it)
- A measurement timeline (when each measurement will be taken: 30 days, 90 days, 6 months, 12 months post-go-live)

Step 2 — LOCK THE BASELINE BEFORE GO-LIVE
Measure and record the baseline metric values the week before go-live. This is non-negotiable. Without a locked baseline, post-implementation measurement is meaningless — stakeholders will dispute the starting point.

Step 3 — SCHEDULE THE BENEFIT CHECK-INS
Book calendar invites at go-live for 30-day, 90-day, and 6-month reviews. Do this before the project team disperses. Once the team is dissolved, nobody has accountability for tracking benefits.

Step 4 — TRACK AND REPORT
At each check-in: measure the actual metric, compare to baseline and target, identify the variance, and understand the cause of any shortfall.

If benefits are tracking below target after 90 days: this is valuable information. It means either the solution is underperforming (remediation needed) or the business case assumptions were wrong (learning for future cases).

THE POST-IMPLEMENTATION REVIEW STRUCTURE

The PIR is a formal review, typically conducted 3–6 months after go-live. It covers:

1. PROJECT DELIVERY ASSESSMENT
Did we deliver what we said we would?
- Scope: what was delivered vs. what was committed
- Time: actual delivery date vs. planned
- Cost: actual spend vs. budget
- Quality: UAT defect count, production incident rate in first 30 days

2. BENEFIT REALISATION STATUS
For each benefit in the business case:
- Planned benefit and target value
- Actual measured value at review date
- Variance and variance explanation
- Projection: is the benefit still expected to be realised? When?

3. WHAT WORKED WELL
Be specific. "The stakeholder engagement process worked well" is not useful. "Running weekly sponsor alignment sessions in weeks 3–7 prevented three scope conflicts from escalating to formal change requests, saving an estimated 3 weeks of rework" is useful.

4. WHAT DID NOT WORK
This is the most valuable section — and the one most often sanitised into uselessness by politics. Create psychological safety: the PIR is not a performance review. Lessons learned only have value if they are honest.

5. RECOMMENDATIONS FOR FUTURE PROJECTS
Translate lessons into specific, actionable recommendations that the next project team can implement. Not "communicate better" — "hold a stakeholder communication charter session in week 1 and review it at the end of every phase."

CONDUCTING THE PIR WORKSHOP

Duration: 2–3 hours, no more.
Participants: project sponsor, BA lead, delivery lead, representative users, and one or two key stakeholders.
NOT included: the entire project team (too many people produces groupthink and inhibits honesty).

Opening frame: "This session is about making us better, not about assigning blame. Everything said here is confidential within this group unless we agree otherwise."

Facilitation technique for "what did not work": use anonymous input (sticky notes or a digital board like Miro where responses are not attributed). Anonymity surfaces the truths that direct attribution suppresses.

THE PIR AS A CAREER ASSET

A BA who runs rigorous PIRs builds a reputation for intellectual honesty and results orientation that is rare and highly valued. Over time, your collection of PIR learnings becomes a personal knowledge base: a library of what actually works, validated against real outcomes — worth more than any certification.

DELIVERABLE: Post-Implementation Review
Design the Value Realisation Framework for your Business Case from lesson 2: define the benefit metrics, baseline measurement plan, and check-in schedule. Then write a mock PIR for a project you have worked on, using the five-section structure. Be genuinely honest in the "what did not work" section. This document is your template for every PIR you will run in your career.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- =============================================================================
-- VERIFY (run immediately after applying)
-- Expected: modules 10, 11, 12 each show filled=5
-- =============================================================================
SELECT c.order_index AS module, c.title,
  COUNT(*) FILTER (WHERE v.translations->'en'->>'transcript' IS NOT NULL AND v.translations->'en'->>'transcript' <> '') AS filled
FROM public.videos v JOIN public.chapters c ON c.id = v.chapter_id
JOIN public.courses co ON co.id = c.course_id
WHERE co.curriculum_version = 'ba-v1' AND c.order_index IN (10,11,12)
GROUP BY c.order_index, c.title ORDER BY c.order_index;
