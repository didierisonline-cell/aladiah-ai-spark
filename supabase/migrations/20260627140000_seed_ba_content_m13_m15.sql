-- =============================================================================
-- Seed BA lesson content (description + EN transcript) — Modules 13–15
--
--   M13: AI Business Analysis & Decision Intelligence  (order_index 13, OFFSET 12)
--   M14: Regulatory, Risk & Compliance                 (order_index 14, OFFSET 13)
--   M15: Capstone: Discovery-to-Transformation         (order_index 15, OFFSET 14)
--
-- Pattern: UPDATE videos SET description, translations
--          WHERE chapter_id = v_ch AND order_index = N
-- BA lesson order_index is 1-based (1..5 per module).
-- M13/M14: teaching content with deliverables.
-- M15: capstone project briefs with assessment guidance (not teaching lessons).
--
-- Apply: paste into Supabase SQL Editor → Run
-- Verify: SELECT below (expected: modules 13,14,15 → filled=5 each)
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
-- MODULE 13 — AI Business Analysis & Decision Intelligence  (OFFSET 12, order_index = 13)
-- Flagship differentiator module. AI-specific BA skills.
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 12;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M13 chapter not found'; END IF;

  -- Lesson 1: The AI Requirement Ladder 2.0
  UPDATE public.videos SET
    description = 'Traditional requirements engineering assumes deterministic systems. AI systems break that assumption — and BAs who do not adapt produce requirements that are unverifiable, unfair, and ungovernable. This lesson introduces the five-layer AI Requirement Ladder: a structured framework for specifying AI systems completely, from functional outputs through to governance obligations. Every AI feature you analyse from this point forward runs through this ladder.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The AI Requirement Ladder 2.0',
      'description', 'The five-layer AI Requirement Ladder — Functional → Accuracy → Fairness → Explainability → Governance — is the definitive framework for specifying AI systems completely. This lesson teaches every layer with concrete examples from fraud detection, recommendation engines, and churn prediction.',
      'transcript', 'THE AI REQUIREMENT LADDER 2.0

WHY TRADITIONAL REQUIREMENTS FAIL FOR AI

A traditional functional requirement: "The system shall flag suspicious transactions for review."
This passes for a rule-based fraud detection system. It fails catastrophically for an AI fraud detection model. Why?

Because it says nothing about:
- How accurately the model must flag fraud (accuracy)
- Whether it flags fraud equally across demographic groups (fairness)
- Whether a customer can understand why they were flagged (explainability)
- Who is accountable when the model makes a wrong call (governance)

An AI system built to that single requirement will be technically compliant and practically dangerous.

THE FIVE-LAYER AI REQUIREMENT LADDER

Layer 1 — FUNCTIONAL REQUIREMENTS
What the AI must do.
"The fraud detection model shall classify each transaction as fraudulent or legitimate and return a risk score between 0 and 1."
This is the same as a traditional requirement. It is necessary but not sufficient.

Layer 2 — ACCURACY REQUIREMENTS
How good the AI must be.
"The fraud detection model shall achieve ≥ 95% precision and ≥ 80% recall on the held-out test set."
"The model shall be retrained if precision drops below 92% in production monitoring."
Key principle: agree the metric AND the threshold BEFORE the model is built. A metric agreed after training is not a requirement — it is a rationalisation.
Metrics to specify: precision, recall, F1, AUC-ROC, mean absolute error, latency (for real-time models), throughput.

Layer 3 — FAIRNESS REQUIREMENTS
Whether the AI treats all groups equitably.
"The false positive rate for the fraud model shall not differ by more than 3 percentage points across gender, age group, or geographic region."
"The model shall be evaluated on protected attribute parity before each production deployment."
The BA''s role: identify which demographic groups are relevant, which fairness metric applies (demographic parity, equalised odds, individual fairness), and at what threshold an imbalance becomes a compliance risk.
Common mistake: treating fairness as a bonus feature. For regulated industries, fairness is a legal obligation.

Layer 4 — EXPLAINABILITY REQUIREMENTS
Whether the AI can justify its decisions.
"For every transaction declined by the fraud model, the system shall generate a plain-language explanation that can be displayed to the customer within 500 milliseconds."
"For regulatory audit, the model shall be able to produce feature-level attribution for any historical decision."
Three audiences need explanations at different depths:
- End users: "Your transaction was declined because it was made in a new location, from a new device, and at an unusual time for your account." (plain language)
- Business reviewers: feature importance scores (which inputs drove the decision?)
- Regulators: full decision audit trail with model version, input data, output, and confidence score
Specify who needs what level of explanation. Not all AI systems need all three.

Layer 5 — GOVERNANCE REQUIREMENTS
Who is accountable, and how accountability is enforced.
"A named model owner is responsible for the fraud model''s performance. They must review a monthly monitoring report and sign off before the model is promoted to a new production version."
"All model decisions above $10,000 in impact are logged and retained for 7 years for regulatory review."
Governance requirements answer: who owns the model, who reviews it, how often, what triggers a human override, and what the audit trail looks like.

APPLYING THE LADDER: THREE EXAMPLES

EXAMPLE 1 — FRAUD DETECTION
Layer 1: Classify transactions as fraudulent/legitimate
Layer 2: ≥ 95% precision, ≥ 80% recall; latency ≤ 200ms
Layer 3: False positive rate parity across demographic groups ± 3%
Layer 4: Plain-language explanation for every declined transaction
Layer 5: Model owner review monthly; all decisions logged 7 years

EXAMPLE 2 — RECOMMENDATION ENGINE
Layer 1: Return 5 ranked product recommendations per user session
Layer 2: Click-through rate ≥ 8%; Precision@5 ≥ 0.35
Layer 3: Price distribution of recommendations does not favour premium products for high-income segments disproportionately
Layer 4: "Because you bought X, you might like Y" explanation for each recommendation
Layer 5: Monthly CTR review; A/B test protocol required for model updates

EXAMPLE 3 — CHURN PREDICTION
Layer 1: Assign a churn probability score (0–1) to each customer monthly
Layer 2: AUC-ROC ≥ 0.82; calibration within 5% of observed churn rate
Layer 3: Churn score distribution reviewed across contract type, tenure, and geography
Layer 4: For high-churn-risk customers, account managers receive a top 3 contributing factors
Layer 5: Retraining triggered if AUC drops below 0.78; model owner sign-off required

CONTRASTING WITH TRADITIONAL REQUIREMENT TIERS

Traditional BRD (Business Requirements Document) has:
- Functional requirements: what the system does
- Non-functional requirements: performance, security, availability
This is a 2-tier model. Adequate for deterministic software.

The AI Requirement Ladder is a 5-tier model. The additional tiers (Fairness, Explainability, Governance) exist because AI systems produce probabilistic outputs that affect real people and require explicit accountability.

DELIVERABLE: AI Requirements Package
For any AI feature in your engagement, complete all five layers of the AI Requirement Ladder. Each layer must have at least one specific, measurable requirement. This package is the foundation of your Module 15 capstone submission.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Human + AI Decision Systems
  UPDATE public.videos SET
    description = 'Not all AI decisions should be made the same way. Some should be fully automated. Some require a human to review before acting. Some require a human to override after the fact. And some should never be delegated to AI at all. This lesson teaches the Decision Authority Matrix: a framework for mapping every AI decision to the appropriate level of human oversight, based on risk, reversibility, and regulatory context.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Human + AI Decision Systems',
      'description', 'The Decision Authority Matrix maps every AI decision to the right level of human oversight — autonomous, human-in-the-loop, human-on-the-loop, or human-in-command. This lesson teaches the risk-based framework for setting oversight levels before a model goes to production.',
      'transcript', 'HUMAN + AI DECISION SYSTEMS

THE HUMAN OVERSIGHT SPECTRUM

There are four levels of human oversight for AI decisions:

LEVEL 1 — AI DECIDES AUTONOMOUSLY (Human-out-of-the-loop)
The AI makes the decision and acts on it without human review.
Examples: email spam filtering, fraud score below a low threshold auto-approved, product recommendations displayed automatically.
Use when: the decision is low-stakes, reversible, and the AI''s accuracy has been validated at scale.
Risk: errors accumulate invisibly; bias compounds without detection; regulatory exposure in high-stakes domains.

LEVEL 2 — HUMAN-IN-THE-LOOP
The AI generates a recommendation; a human reviews and approves before action is taken.
Examples: fraud cases above a moderate threshold are reviewed by an analyst before the card is blocked; loan applications above a certain risk score are reviewed by an underwriter.
Use when: the stakes are moderate to high, the decision is not easily reversible, or regulatory requirements mandate human review.
Cost: adds human time to every decision above the threshold. Design the threshold carefully — if too low, humans are overwhelmed and become rubber-stampers.

LEVEL 3 — HUMAN-ON-THE-LOOP
The AI acts autonomously but a human monitors the decisions in aggregate and can override, retrain, or shut down the model.
Examples: automated trading algorithms (no per-trade review, but portfolio limits and kill-switch monitoring); content moderation AI (posts are auto-removed, but humans review patterns and can override policy).
Use when: per-decision human review is impractical at the required speed or volume, but aggregate human monitoring is feasible.
Key requirement: the human-on-the-loop must have real power to intervene — not just observe.

LEVEL 4 — HUMAN-IN-COMMAND (AI advises only)
The AI provides information or analysis; the human makes every decision independently.
Examples: medical diagnosis support (AI flags anomalies; doctor decides treatment), criminal sentencing risk scores (AI provides risk assessment; judge decides sentence).
Use when: the stakes are irreversible or life-affecting, regulatory requirements mandate human authority, or the cost of AI error is catastrophic.
Important: "AI advises only" is not a compliance escape hatch. The human must exercise genuine independent judgment, not rubber-stamp the AI''s output. Rubber-stamping a human-in-command system is the same as autonomous AI — with extra liability.

THE DECISION AUTHORITY MATRIX

The Decision Authority Matrix maps each AI decision type in your system to the appropriate oversight level.

Columns:
- Decision type (what the AI is deciding)
- Decision frequency (how many times per day/hour)
- Stakes (financial, regulatory, reputational, safety)
- Reversibility (can the decision be undone easily?)
- Current accuracy (validated performance metric)
- Oversight level (1–4)
- Human role (what the human specifically does)
- Monitoring method (how deviations are detected)

Example matrix row:
Decision type: Loan application approval under $5,000
Frequency: 500/day
Stakes: Financial, regulatory (fair lending laws)
Reversibility: Partially reversible (customer can appeal)
Accuracy: AUC 0.84, fair lending parity confirmed
Oversight level: 2 — Human-in-the-loop for declines; auto-approve for scores above 0.85
Human role: Underwriter reviews all auto-declined applications
Monitoring: Daily dashboard of approval rates by demographic group

A RISK-BASED FRAMEWORK FOR SETTING OVERSIGHT LEVELS

Use this scoring matrix to determine the minimum required oversight level:

Score each dimension 1–3:
- Stakes: 1 = low (reversible, low financial impact), 2 = medium, 3 = high (irreversible, life-affecting, or regulated)
- Accuracy: 1 = high confidence (validated), 2 = moderate confidence, 3 = low confidence or new deployment
- Regulatory exposure: 1 = none, 2 = applicable but indirect, 3 = direct regulatory obligation

Sum the scores:
3–4: Level 1 (autonomous) may be appropriate
5–6: Level 2 (human-in-the-loop) required
7–8: Level 3 (human-on-the-loop) required
9: Level 4 (human-in-command) required

This is a floor, not a ceiling. You can always increase oversight. You cannot decrease it below the regulatory minimum.

THE BA''S RESPONSIBILITY

The BA does not decide the oversight level unilaterally. The BA:
1. Maps all decision types using the matrix
2. Scores each using the risk framework
3. Proposes an oversight level per decision type
4. Validates the proposal with legal, compliance, and the business owner
5. Documents the decision — and the rationale — in the Governance Blueprint

DELIVERABLE: Decision Authority Matrix
For the AI system you are analysing (or the case study system), build a Decision Authority Matrix. Include at minimum: 5 decision types, scored across all dimensions, with oversight level and human role specified for each.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: AI Failure Investigation
  UPDATE public.videos SET
    description = 'AI systems fail differently from traditional software. They degrade gradually, behave well in testing and badly in production, and can fail in ways that are invisible until the damage is done. This lesson teaches the AI Failure Autopsy framework: how to classify AI failure types, investigate root cause systematically, and put monitoring changes in place that catch the next failure before it impacts customers.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI Failure Investigation',
      'description', 'AI systems fail differently — they degrade gradually, pass tests and fail in production, and cause invisible harm. The AI Failure Autopsy framework systematically classifies failure type, investigates root cause, and defines monitoring changes to catch the next failure early.',
      'transcript', 'AI FAILURE INVESTIGATION

HOW AI SYSTEMS FAIL

AI failures are not software bugs in the traditional sense. They are distributional, systemic, and often invisible until they have caused significant harm. Understanding how AI fails is the first step to detecting failures early.

THE FIVE AI FAILURE TYPES

FAILURE TYPE 1 — DATA DRIFT
What it is: The statistical distribution of input data changes over time, diverging from the distribution the model was trained on.
Example: A churn prediction model trained on pre-pandemic customer behaviour. Post-pandemic, customer tenure patterns, usage patterns, and churn triggers all changed. The model''s accuracy degrades because the world it was trained on no longer exists.
Detection signals: Feature distribution shift (statistical tests like KL divergence, PSI), declining model accuracy in production monitoring, increasing rate of model-driven decisions later reversed by humans.

FAILURE TYPE 2 — CONCEPT DRIFT
What it is: The relationship between inputs and the target output changes, even if the input distribution is stable.
Example: A credit default model. Economic conditions change. The same financial profile that predicted low default risk in a growth economy predicts higher risk in a recession — but the model does not know the economy has changed.
Detection signals: Model accuracy declining despite stable input distributions; human override rates increasing; business outcomes diverging from model predictions.

FAILURE TYPE 3 — FEEDBACK LOOPS
What it is: The model''s outputs influence future inputs, creating a self-reinforcing cycle that degrades performance over time.
Example: A content recommendation AI that surfaces only high-engagement content trains users to engage only with high-engagement content, which trains the model to surface only high-engagement content — producing filter bubbles and engagement collapse when users churn.
Example: A predictive policing model that directs resources to area A, leading to more arrests in area A, which produces more training data from area A, which reinforces predictions about area A — regardless of actual crime distribution.
Detection signals: Input data becoming less diverse over time; model confidence increasing while business outcomes stagnate or worsen.

FAILURE TYPE 4 — ADVERSARIAL INPUTS
What it is: Inputs deliberately engineered to fool the model.
Example: A fraud detection model successfully deployed, then reverse-engineered by fraudsters who learn the features that trigger fraud flags and modify their transaction patterns to stay just below every threshold.
Example: A text classification model deployed for content moderation, then bypassed by posting prohibited content with deliberate misspellings or Unicode substitutions.
Detection signals: Sudden drop in fraud caught; increase in appeals or false negatives; pattern analysis revealing systematic avoidance of known detection thresholds.

FAILURE TYPE 5 — HALLUCINATION (generative AI)
What it is: Generative AI models produce confident, plausible-sounding outputs that are factually incorrect.
Example: An AI legal assistant that generates case citations that do not exist. An AI customer service agent that quotes terms and conditions the company does not have. An AI requirements generator that produces regulatory references to laws that were not in force.
Detection signals: Factual errors in AI-generated outputs identified during human review; customer complaints about incorrect AI responses; legal or compliance escalations.

THE AI FAILURE AUTOPSY FRAMEWORK

When an AI failure is detected, the BA leads (or contributes to) an AI Failure Autopsy. Structure:

SECTION 1 — WHAT HAPPENED
Objective description of the failure event. What did the model do? What was it supposed to do? Over what time period? At what scale?
"The fraud detection model had a false positive rate of 12% in March, compared to the accepted threshold of 3%. Approximately 4,200 legitimate transactions were incorrectly declined."

SECTION 2 — WHAT WAS THE IMPACT
Business and customer impact, quantified where possible.
"4,200 declined transactions at an average value of $340 = $1.4M in prevented revenue. Estimated 12% of affected customers closed their accounts within 30 days = approximately 500 accounts lost."

SECTION 3 — ROOT CAUSE
The primary cause of the failure. Apply the 5 Whys. Identify the failure type.
"Root cause: data drift. The training data did not include the transaction patterns typical of the new payment method introduced in January, which accounts for 18% of transaction volume."

SECTION 4 — CONTRIBUTING FACTORS
Secondary factors that allowed the failure to occur or persist.
"No feature distribution monitoring was in place. The new payment method was not flagged as a significant change requiring model re-evaluation. The monthly model review was deferred in February due to team capacity constraints."

SECTION 5 — FIX
What was done to address the immediate failure and the root cause.
"Model retrained on dataset including 6 months of new payment method transactions. Production deployment on [date]. False positive rate returned to 2.8% within 48 hours."

SECTION 6 — MONITORING CHANGE
What monitoring was added or changed to detect this class of failure earlier in the future.
"Feature distribution monitoring added for all payment method categories. Alert threshold: PSI > 0.1 triggers human review. Monthly model review made mandatory with no deferral permitted."

HOW BAS DETECT AI FAILURES EARLY

The BA''s contribution to AI failure prevention:
1. Define monitoring requirements as part of the AI Requirements Package (Layer 2 — Accuracy Requirements include monitoring thresholds and alerting)
2. Specify the monitoring dashboard as a formal BA deliverable (see Lesson 4)
3. Establish user feedback channels that capture failure signals from the human side (end users often detect AI failures before monitoring dashboards do)
4. Conduct regular model health reviews as a BA-led governance activity, not just a data science internal process

DELIVERABLE: AI Failure Autopsy
Select one of the following: (a) an AI failure you have encountered or read about, or (b) the case study system. Complete a full AI Failure Autopsy using the six-section framework. Identify which failure type it was, the root cause, and what monitoring change would catch it earlier next time.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: AI Governance & Monitoring
  UPDATE public.videos SET
    description = 'AI governance is not compliance paperwork — it is the operating system for trustworthy AI. Without governance, models are deployed with no owner, monitored by no one, and retired only when they cause a crisis. This lesson teaches the four pillars of AI governance, the artefacts that make governance real (model cards and data sheets), and how to design a monitoring cadence that keeps AI systems healthy throughout their production lifecycle.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI Governance & Monitoring',
      'description', 'AI governance is the operating system for trustworthy AI — covering accountability, transparency, fairness, and safety. This lesson covers model cards, data sheets, and how to design a monitoring cadence that keeps AI systems healthy long after they are deployed.',
      'transcript', 'AI GOVERNANCE & MONITORING

WHY AI GOVERNANCE MATTERS NOW

The AI governance landscape has changed fundamentally in two years:
- The EU AI Act creates legal obligations for high-risk AI systems in EU markets, effective 2026
- GDPR Article 22 requires the right to explanation for automated decisions affecting individuals
- The US Executive Order on AI (2023) mandated federal AI governance standards
- Sector regulators (FCA, OCC, FDA, EEOC) have published AI-specific guidance for financial services, healthcare, and employment

AI governance is no longer optional for organisations operating in regulated markets. The BA who cannot document, justify, and defend an AI system''s governance posture is a liability.

THE FOUR PILLARS OF AI GOVERNANCE

PILLAR 1 — ACCOUNTABILITY
Every AI system must have a named human owner who is responsible for its performance, fairness, and compliance.
Accountability requirements the BA specifies:
- Named model owner (person, not a team)
- Named data owner
- Escalation path when the model malfunctions
- Decision authority for model retirement

PILLAR 2 — TRANSPARENCY
Stakeholders must be able to understand what the AI does, how it was built, and what its limitations are.
Transparency requirements the BA specifies:
- Model card (see below) published and accessible
- Plain-language summary of the model''s purpose and limitations accessible to end users
- Decision audit trail for regulated decisions
- Disclosure requirements (where required to disclose AI involvement to customers)

PILLAR 3 — FAIRNESS
The AI must not produce systematically different outcomes for similarly situated people based on protected characteristics.
Fairness requirements the BA specifies:
- Protected attributes to be monitored (per relevant regulation)
- Fairness metric and threshold (e.g., equalised odds, ± 3%)
- Bias testing protocol before each production deployment
- Ongoing fairness monitoring cadence

PILLAR 4 — SAFETY
The AI must not cause harm — to customers, employees, or society — through malfunction, misuse, or misapplication.
Safety requirements the BA specifies:
- Human override capability (technical and procedural)
- Fallback behaviour when the model is unavailable or low-confidence
- Kill-switch protocol: who can shut down the model and under what conditions
- Incident response procedure: what happens when a failure is detected

MODEL CARDS: THE TRANSPARENCY ARTEFACT

A model card (Mitchell et al., 2019; widely adopted by Google, Hugging Face, and others) is a short document that accompanies every AI model in production.

Standard model card sections:
1. Model overview: what the model does, who built it, when it was deployed
2. Intended use: the specific use cases the model is designed for
3. Out-of-scope uses: what the model should NOT be used for
4. Training data: what data was used to train the model, and its known biases or limitations
5. Evaluation results: performance metrics on the test set, broken down by relevant subgroups
6. Ethical considerations: known fairness risks, potential for harm, and mitigations
7. Caveats and recommendations: known limitations and guidance for users

The BA''s role: specify the model card as a required governance artefact before the model goes to production. Draft the non-technical sections (intended use, out-of-scope uses, ethical considerations). Validate the technical sections with the data science team.

DATA SHEETS: THE DATA GOVERNANCE ARTEFACT

A data sheet (Gebru et al., 2018) documents the dataset used to train the model.

Standard data sheet sections:
1. Motivation: why was the dataset created?
2. Composition: what does it contain? How many records? What time period?
3. Collection process: how was the data collected?
4. Preprocessing: what was done to clean or transform the data?
5. Uses: what is this dataset intended for?
6. Distribution: how is it distributed or shared?
7. Maintenance: who maintains it? How often is it updated?

The BA''s role: data sheets are primarily a data science artefact, but the BA validates that the training data meets the data governance requirements specified in the AI Requirements Package.

MONITORING CADENCE: WHAT, HOW OFTEN, WHO, WHAT TRIGGERS

A monitoring cadence is a governance schedule that defines systematic oversight of an AI model in production.

THE MONITORING MATRIX:

Accuracy monitoring:
What: precision, recall, AUC, or the relevant metric for this model
How often: daily automated alerts for threshold breaches; weekly human review; monthly formal report
Who: model owner reviews monthly report; data science team acts on daily alerts
Trigger: if accuracy drops below [threshold], model owner notified within 24 hours; if not resolved in 5 business days, model suspended pending review

Fairness monitoring:
What: fairness metric (e.g., equalised false positive rate across demographic groups)
How often: monthly (more frequent if model makes high-volume high-stakes decisions)
Who: model owner and compliance officer
Trigger: if fairness metric exceeds threshold, compliance officer notified; regulatory disclosure assessed

Data drift monitoring:
What: input feature distribution (Population Stability Index or equivalent)
How often: weekly automated check; monthly human review
Who: data science team; model owner reviews monthly
Trigger: PSI > 0.1 triggers human investigation; PSI > 0.2 triggers mandatory retraining assessment

Human override rate monitoring:
What: the rate at which human reviewers overturn AI recommendations
How often: weekly
Who: model owner
Trigger: if human override rate increases by more than 20% week-on-week, model review triggered

User feedback monitoring:
What: user complaints, appeals, or feedback attributable to AI decisions
How often: ongoing; monthly summary
Who: model owner and customer experience team
Trigger: complaint rate above baseline triggers root cause investigation

DELIVERABLE: AI Governance Dashboard
Design an AI Governance Dashboard for the AI system you are analysing. The dashboard must show: model health (accuracy, fairness), monitoring status (last checked, alerts active), accountability (named owner, last review date), and a compliance status indicator. Document the monitoring cadence: what is measured, how often, who reviews it, and what triggers a human escalation.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Executive AI Transformation Roadmap
  UPDATE public.videos SET
    description = 'An AI Transformation Roadmap is not a list of AI projects — it is a sequenced capability-building plan that takes an organisation from identified AI opportunities to deployed, governed, business-value-generating AI capabilities. This lesson teaches the four-horizon model, how to sequence AI investments across quick wins, core capabilities, differentiators, and moonshots, and how to communicate the roadmap to executives without over-promising or under-selling.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Executive AI Transformation Roadmap',
      'description', 'An AI Transformation Roadmap sequences capability-building from quick wins through moonshots. This lesson covers the four-horizon model, investment sequencing, and how to communicate AI transformation to executives — setting realistic expectations while framing the opportunity compellingly.',
      'transcript', 'EXECUTIVE AI TRANSFORMATION ROADMAP

FROM OPPORTUNITY TO CAPABILITY

Most organisations have no shortage of AI ideas. They have a shortage of sequenced, funded, governed plans for turning those ideas into business value.

The AI Transformation Roadmap is the BA''s output that bridges that gap. It transforms a list of AI opportunities into a credible, sequenced, resourced plan that a CFO can fund and a board can approve.

THE FOUR-HORIZON MODEL

Horizon 1 — QUICK WINS (0–6 months)
Characteristics: high confidence in value, low technical complexity, uses existing data, minimal governance build required.
Examples: AI-assisted document processing, AI-generated first-draft reports, internal chatbot on existing knowledge base, AI-powered data quality detection.
Goal: build organisational confidence in AI, demonstrate early ROI, develop internal AI muscle.
Investment profile: low capital, low risk, high probability of positive return.

Horizon 2 — CORE CAPABILITIES (6–18 months)
Characteristics: moderate complexity, requires new data pipelines or model development, delivers strategic business value.
Examples: customer churn prediction, AI-powered personalisation, demand forecasting, AI-augmented customer service.
Goal: build the AI infrastructure (data platform, MLOps, model governance) that enables all future AI investment.
Investment profile: moderate capital, medium risk, high strategic value.
Note: Horizon 2 is the foundation layer. Without it, Horizons 3 and 4 are not feasible. It must be funded even when it feels like plumbing.

Horizon 3 — DIFFERENTIATORS (18–36 months)
Characteristics: significant technical complexity, competitive differentiation, market-level impact.
Examples: AI-native product features, intelligent underwriting, predictive maintenance at scale, AI-powered pricing optimisation.
Goal: create competitive advantage that is difficult for competitors to replicate quickly.
Investment profile: significant capital, higher risk, very high strategic value if successful.
Warning: Horizon 3 initiatives require Horizon 2 infrastructure. Attempting to jump from Horizon 1 to Horizon 3 is the most common AI transformation failure pattern.

Horizon 4 — MOONSHOTS (36+ months)
Characteristics: transformative and speculative, may not be technically feasible at current AI capability levels, but must be tracked.
Examples: fully autonomous operations in specific domains, AI-native business model transformation, generalised AI advisory services.
Goal: maintain strategic awareness of transformative possibilities; place small exploratory bets; avoid being disrupted.
Investment profile: small exploratory budget; staged gates; option value thinking.

BUILDING THE ROADMAP: FROM OPPORTUNITIES TO INITIATIVES

Step 1: Inventory AI opportunities
From your discovery work, list all identified AI opportunities. Do not filter yet.

Step 2: Score each opportunity
Score on: business value (1–5), technical feasibility today (1–5), data readiness (1–5), governance complexity (1–5 inverted), strategic alignment (1–5).

Step 3: Classify by horizon
Using the scores and the horizon characteristics, assign each opportunity to a horizon. The horizon is a function of complexity and dependency, not just score.

Step 4: Identify dependencies
Which Horizon 2 capabilities does each Horizon 3 initiative require? Draw the dependency lines. This is the sequencing logic.

Step 5: Build the roadmap timeline
Plot initiatives on a timeline by horizon. Show: initiative name, business owner, estimated start, estimated value delivery date, key dependencies.

Step 6: Define success metrics per horizon
What does success look like for Horizon 1 at month 6? For Horizon 2 at month 18?
Without success metrics, the roadmap is a wish list, not a plan.

EXECUTIVE COMMUNICATION OF AI TRANSFORMATION

The most common AI roadmap presentations fail in one of three ways:
1. Overpromising: "AI will save us $50M in year one." (It will not.)
2. Under-selling: A technically correct presentation that fails to create executive urgency.
3. Jargon overload: Executives disengage when they cannot follow the language.

PRINCIPLES FOR EXECUTIVE AI ROADMAP COMMUNICATION

Lead with the business problem, not the technology.
Wrong: "We will implement a machine learning model using a gradient-boosted tree architecture..."
Right: "We are losing 18% of our highest-value customers in their second year. AI can predict which customers are at risk 90 days before they churn — giving us time to intervene."

Frame risk honestly but proportionally.
Acknowledge that AI investments carry uncertainty. Executives respect honest risk framing. They distrust false certainty.
"Horizon 2 investments carry execution risk. We are mitigating this by phasing delivery, establishing governance upfront, and building on proven use cases before attempting novel applications."

Use the cost-of-inaction argument.
"Our top three competitors have deployed AI-powered personalisation. If we do not reach Horizon 2 capabilities within 18 months, we estimate a 12-point decline in our competitive NPS position."

Quantify the roadmap in financial terms.
Each horizon should have: estimated investment, estimated value, risk-adjusted expected return, and payback period.
Horizon 1: $200K investment, $800K annualised savings, 3-month payback.
Horizon 2: $1.8M investment, $4.2M annualised value, 14-month payback.
Horizon 3: $5M investment, $12M+ annualised value (range), 24–36 month payback.

DELIVERABLE: AI Transformation Blueprint
Produce a board-ready AI Transformation Blueprint. Include: the four-horizon roadmap (with at least 2 initiatives per horizon), dependency map between horizons, financial summary (investment and value per horizon), success metrics, risk summary, and executive communication narrative (1–2 pages, SCQ structure). This is a Module 15 capstone-eligible deliverable.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 14 — Regulatory, Risk & Compliance  (OFFSET 13, order_index = 14)
-- Content must be accurate on real regulatory frameworks (GDPR, EU AI Act, ISO 31000).
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 13;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M14 chapter not found'; END IF;

  -- Lesson 1: Regulatory Impact Assessment
  UPDATE public.videos SET
    description = 'Every AI system operates within a regulatory landscape — and the BA who does not map that landscape before writing requirements will produce requirements that are legally non-compliant, operationally unacceptable, or both. This lesson teaches the major regulatory frameworks affecting AI (GDPR, EU AI Act, SOX, HIPAA, and algorithmic fairness laws) and a systematic process for conducting a Regulatory Impact Assessment before any AI initiative is scoped.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Regulatory Impact Assessment',
      'description', 'GDPR, EU AI Act, SOX, HIPAA, and algorithmic fairness laws all affect AI system requirements. This lesson teaches the five regulatory frameworks every BA must know and a step-by-step process for conducting a Regulatory Impact Assessment at the start of every AI initiative.',
      'transcript', 'REGULATORY IMPACT ASSESSMENT

WHY REGULATION IS A REQUIREMENTS CONSTRAINT

Regulation is not a post-development checklist. Regulatory requirements are constraints that must be embedded in the AI Requirements Package from the start. A system built to perfect functional specifications but in violation of GDPR will not be deployed. A system deployed in violation of the EU AI Act faces fines of up to €30M or 6% of global annual revenue.

The BA who discovers regulatory conflicts at UAT has failed. The BA who prevents them at requirements is invaluable.

THE MAJOR REGULATORY FRAMEWORKS AFFECTING AI

GDPR — General Data Protection Regulation (EU, 2018; applied globally for EU data)
Key provisions affecting AI:
- Article 5: Data minimisation — AI systems may only use personal data that is adequate, relevant, and limited to what is necessary.
- Article 13/14: Transparency — individuals must be informed when their data is used in AI systems.
- Article 22: Automated decision-making — individuals have the right not to be subject to a decision based solely on automated processing that significantly affects them, unless specific conditions are met. When automated decisions are permitted, individuals have the right to explanation and human review.
- Article 25: Data protection by design and by default.
- Article 35: Data Protection Impact Assessment (DPIA) — mandatory for high-risk processing, including large-scale processing of sensitive data and systematic automated decision-making.

BA obligations: any AI system that processes personal data of EU individuals requires GDPR compliance mapping. The BA specifies: data minimisation constraints (what data can be used and what cannot), the explanation requirement (Layers 4 and 5 of the AI Requirement Ladder), and whether a DPIA is required.

EU AI ACT — (in force from 2024; obligations phased through 2026)
Risk classification of AI systems:
- Unacceptable risk (prohibited): AI systems that manipulate human behaviour subliminally, social scoring by public authorities, real-time biometric identification in public spaces (with limited exceptions).
- High risk: AI systems in critical infrastructure, education, employment, essential services, law enforcement, migration, and administration of justice. High-risk AI systems face mandatory conformity assessment, registration, transparency, human oversight, accuracy, robustness, and security requirements.
- Limited risk: AI systems with specific transparency obligations (e.g., chatbots must disclose they are AI).
- Minimal risk: No specific obligations (e.g., spam filters, AI in video games).

BA obligations: classify the AI system under the EU AI Act risk classification. For high-risk systems, specify the conformity assessment requirements (human oversight, accuracy, robustness, transparency, logging) as formal requirements.

SOX — Sarbanes-Oxley Act (US, 2002; applies to US-listed companies)
Key AI implications:
- Section 404: Management must assess and report on the effectiveness of internal controls over financial reporting. AI systems that affect financial reporting are subject to SOX controls.
- AI models used in financial forecasting, revenue recognition, or financial risk management must have: documented model risk management controls, human review and approval of AI outputs before they affect financial statements, audit trail for AI-driven financial decisions.

BA obligations: for any AI system that touches financial data or decisions, specify SOX-compliant controls: model approval workflow, output review, audit trail, and change control for model updates.

HIPAA — Health Insurance Portability and Accountability Act (US, 1996)
Key AI implications:
- Protected Health Information (PHI) cannot be used to train AI models without explicit patient consent or a valid waiver under the HIPAA Privacy Rule.
- The Security Rule requires administrative, physical, and technical safeguards for electronic PHI — including data used to train AI models.
- AI systems that make or support clinical decisions must be validated for accuracy and bias, particularly across demographic groups, to avoid discriminatory patient outcomes.

BA obligations: for any AI system in a healthcare context, specify: PHI handling constraints, de-identification requirements for training data, bias evaluation requirements across patient demographic groups, and clinical decision support disclosure requirements.

ALGORITHMIC FAIRNESS LAWS
An emerging and rapidly expanding category:
- US Executive Order on AI (2023): federal agencies must assess AI systems for discriminatory impact and civil rights implications.
- EEOC AI guidance (2023): AI tools used in employment screening must not have a disparate impact on protected classes under Title VII.
- NYC Local Law 144 (2023): automated employment decision tools must undergo annual bias audits by an independent auditor, and results must be made publicly available.
- EU AI Act (employment): AI systems used for recruitment, promotion, task allocation, and termination are classified as high-risk.

BA obligations: for any AI system used in employment, lending, housing, or essential services, specify: bias audit requirements, protected classes to be evaluated, fairness metrics and thresholds, audit documentation requirements, and disclosure obligations.

HOW TO CONDUCT A REGULATORY IMPACT ASSESSMENT

A Regulatory Impact Assessment (RIA) for an AI initiative follows five steps:

STEP 1 — SCOPE
Define the AI system: what does it do, where does it operate, who does it affect?

STEP 2 — RELEVANT REGULATIONS
Identify every regulation that applies based on: jurisdiction, industry, data types processed, decision types made, and populations affected.

STEP 3 — OBLIGATIONS
For each applicable regulation, list the specific obligations it imposes on this AI system. Be specific: cite the article or section.

STEP 4 — GAPS
Compare the obligations to the current (or proposed) system design. Where are the gaps? What is not currently compliant?

STEP 5 — ACTIONS
For each gap, specify the action required: is it a requirements addition? A data constraint? A governance control? A design change? Who is responsible? By when?

THE DIFFERENCE BETWEEN COMPLIANCE AND GOVERNANCE

Compliance is the minimum required by law. Governance is best practice.
A system that is compliant may still be irresponsible. A system that is governed well will be compliant as a natural consequence.

The BA who aims for governance — not just compliance — produces AI systems that are durable, defensible, and trusted. The BA who aims only for compliance produces systems that are technically legal and practically fragile.

DELIVERABLE: Regulatory Impact Assessment
Conduct a Regulatory Impact Assessment for the AI system you are analysing (or the case study system). Complete all five steps. Identify at least three specific regulatory obligations and the requirements changes each one drives.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Risk Quantification
  UPDATE public.videos SET
    description = 'Risk management in AI is not about avoiding all risk — it is about understanding, quantifying, and consciously accepting or mitigating risk at the right level. This lesson teaches quantitative risk assessment for AI systems: how to score likelihood, impact, velocity, and detectability; how to express risk in financial terms that executives can act on; and how to build a Risk Exposure Register that becomes the governing document for every risk conversation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Risk Quantification',
      'description', 'Risk = Likelihood × Impact × Velocity × Detectability. This lesson teaches quantitative AI risk assessment — including how to express risk in financial terms and build a Risk Exposure Register that drives every governance conversation with executives.',
      'transcript', 'RISK QUANTIFICATION

THE LIMITATION OF QUALITATIVE RISK ASSESSMENT

The traditional risk matrix (High/Medium/Low for likelihood and impact) is a communication tool. It is not a decision tool.

Two risks, both rated "High Likelihood × High Impact," may differ by a factor of 100 in their actual expected financial loss. Without quantification, you cannot prioritise between them. Without quantification, executives cannot make informed risk decisions. Without quantification, risk management is theatre.

THE STANDARD RISK FORMULA

Risk = Likelihood × Impact

This is the ISO 31000 baseline. For AI systems, two additional dimensions are critical:

Velocity: how fast does the risk materialise once triggered?
A slow-velocity risk (a regulatory fine that takes 18 months to arrive) gives time for mitigation. A high-velocity risk (a model producing discriminatory outputs at 50,000 decisions per day) can cause catastrophic harm in hours.

Detectability: how easily is the risk detected once it occurs?
A high-detectability risk (a model that goes offline — immediately obvious) can be addressed quickly. A low-detectability risk (a model producing subtly biased outputs that no monitoring picks up) can persist for months.

THE EXTENDED AI RISK FORMULA

Exposure Score = Likelihood × Impact × Velocity × (1 / Detectability)

Where:
- Likelihood: probability of the risk event occurring (0–1, or 1–5 scale)
- Impact: magnitude of harm if the event occurs (financial, reputational, regulatory, safety — expressed in financial equivalent)
- Velocity: how quickly harm materialises (1 = slow: months; 5 = fast: hours or days)
- Detectability: how easily the risk is detected (1 = highly detectable; 5 = very hard to detect; inverted so that low detectability = higher exposure)

QUANTIFYING RISK IN FINANCIAL TERMS

Expected Loss = Probability × Financial Impact

Example: A fraud detection model failure
Probability: 15% chance of a significant false positive surge in the next 12 months (based on historical model drift data)
Financial impact: a false positive surge like the one in March cost $1.4M in lost revenue and $200K in remediation
Expected loss = 15% × $1.6M = $240K per year

This $240K expected loss is the budget justification for any mitigation that costs less than $240K per year.

BUILDING THE RISK EXPOSURE REGISTER

The Risk Exposure Register is a living document that catalogues every material risk associated with an AI system and tracks its status over time.

Columns:
- Risk ID: a unique identifier (e.g., R-01, R-02)
- Risk category: data, model, regulatory, operational, reputational, strategic
- Risk description: a clear, specific statement of what could go wrong
- Likelihood (1–5 or probability estimate): how likely is this to occur?
- Impact (£/$ equivalent or 1–5 scale): what is the financial or business impact if it occurs?
- Velocity (1–5): how fast does harm materialise?
- Detectability (1–5): how hard is it to detect?
- Exposure score: Likelihood × Impact × Velocity × (1/Detectability)
- Risk owner: the named person responsible for this risk
- Current controls: what is currently in place to mitigate or detect this risk
- Residual risk: what is the residual exposure after current controls?
- Treatment (see Lesson 4): accept / mitigate / transfer / avoid
- Review date: when will this risk be formally reviewed next?

EXAMPLE RISK REGISTER ENTRIES FOR AN AI SYSTEM

R-01: Data Drift
Category: Model
Description: Input data distribution drifts from training distribution, causing model accuracy to degrade below acceptable threshold
Likelihood: 3 (moderate — has occurred once in past 18 months)
Impact: $800K (based on previous incident cost)
Velocity: 3 (degradation typically takes 4–6 weeks to reach critical threshold)
Detectability: 2 (now that monitoring is in place post-incident)
Exposure score: 3 × 5 (scaled impact) × 3 × (1/2) = manageable with monitoring
Treatment: Mitigate (monitoring + automated retraining trigger)

R-02: Algorithmic Bias Complaint
Category: Regulatory/Reputational
Description: Regulatory body finds disparate impact in model outputs; enforcement action and/or public disclosure
Likelihood: 2 (low — current fairness testing shows parity within threshold)
Impact: $3M (estimated regulatory fine + remediation + reputational damage)
Velocity: 4 (regulatory investigations move quickly once a complaint is filed)
Detectability: 4 (bias can persist without detection if monitoring is inadequate)
Exposure score: high absolute value driven by impact and detectability
Treatment: Mitigate (fairness monitoring, bias audit, documented compliance posture)

RISK CATEGORIES SPECIFIC TO AI SYSTEMS

- Model risk: the risk that the model performs differently than expected (accuracy, fairness, robustness)
- Data risk: the risk that training or inference data is incorrect, incomplete, biased, or inappropriately used
- Algorithmic risk: the risk that the model''s logic produces harmful, unfair, or unintended outputs
- Operational risk: the risk of failure in the systems, processes, or human oversight surrounding the model
- Regulatory risk: the risk of non-compliance with applicable regulations
- Strategic risk: the risk that AI investment does not deliver the expected business value
- Reputational risk: the risk of public, media, or regulatory attention due to AI-related harm

DELIVERABLE: Risk Exposure Register
Build a Risk Exposure Register for the AI system you are analysing. Include at least 6 risks across at least 3 categories. Score each using the extended formula. Quantify at least 2 risks in financial terms using the expected loss calculation. Identify the top 3 risks by exposure score.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Controls & Assurance
  UPDATE public.videos SET
    description = 'A risk without a control is a risk you are choosing to ignore. Controls are the mechanisms that prevent AI risks from materialising, detect them when they do, or limit the damage once they have occurred. This lesson teaches the three control types, the specific controls that matter for AI systems (input validation, model monitoring, output review, and feedback loop controls), and how to build a Control Matrix that gives executives and auditors a clear line of sight from risk to remedy.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Controls & Assurance',
      'description', 'Preventive, detective, and corrective controls are the mechanisms that keep AI risk manageable. This lesson covers the four control categories specific to AI systems and how to build a Control Matrix that links every risk to a testable, owned, and scheduled control.',
      'transcript', 'CONTROLS & ASSURANCE

THE THREE CONTROL TYPES

PREVENTIVE CONTROLS
Prevent a risk from materialising in the first place.
Examples: input data validation before the model sees the data; bias testing required before each model deployment; change control process that prevents unauthorised model updates.

DETECTIVE CONTROLS
Detect when a risk has materialised so that corrective action can be taken.
Examples: model performance monitoring alerts; fairness monitoring dashboards; human override rate tracking; audit log review.

CORRECTIVE CONTROLS
Limit damage and restore normal operation after a risk event.
Examples: model rollback procedure (revert to last known good model version); human escalation path when model is suspended; customer remediation process for customers harmed by a model failure.

A well-controlled AI system has all three types. Preventive controls are most efficient (preventing harm is cheaper than correcting it). Detective controls are essential (prevention is never perfect). Corrective controls are the safety net.

THE FOUR AI-SPECIFIC CONTROL CATEGORIES

1. INPUT VALIDATION CONTROLS (Preventive)
What they control: the quality and appropriateness of data entering the model
Examples:
- Schema validation: input data must match expected data types, value ranges, and completeness requirements before being passed to the model
- Distribution monitoring: input feature distributions are checked against training distribution before inference
- PII screening: personal data is detected and handled according to data governance policy before model ingestion
- Adversarial input detection: inputs that appear designed to exploit model vulnerabilities are flagged

2. MODEL MONITORING CONTROLS (Detective)
What they control: the ongoing performance of the model in production
Examples:
- Accuracy threshold alerts: automated alert if precision or recall drops below specified threshold
- Fairness monitoring: regular calculation of fairness metrics across protected groups; alert on threshold breach
- Data drift detection: PSI or equivalent calculated on input features; alert on significant distribution shift
- Prediction distribution monitoring: alert if the distribution of model outputs shifts significantly (e.g., sudden increase in high-confidence fraud flags)

3. OUTPUT REVIEW CONTROLS (Preventive + Detective)
What they control: the decisions or outputs produced by the model before they affect individuals or business operations
Examples:
- Human-in-the-loop review: all model decisions above a specified risk threshold require human approval before action is taken
- Output confidence thresholds: model outputs below a confidence threshold are routed to manual review rather than acted upon automatically
- Output audit logging: all model decisions are logged with input data snapshot, model version, output, and timestamp (enables retrospective review)
- Sampling review: a random sample of model decisions is reviewed by humans on a scheduled basis, even for decisions below the human-review threshold

4. FEEDBACK LOOP CONTROLS (Preventive + Corrective)
What they control: the risk of model outputs influencing future training data in ways that degrade performance or amplify bias
Examples:
- Training data governance: a documented approval process controls what data is used for model retraining
- Retraining impact assessment: before retraining on new data, the expected impact on fairness and accuracy is assessed
- Human review of retraining results: model performance on held-out test set must be reviewed and approved by a human before the retrained model is deployed
- Feedback loop monitoring: detection of systematic patterns in model decisions that suggest the model is influencing its own input data

THE CONTROL MATRIX

The Control Matrix links each risk in the Risk Exposure Register to one or more controls.

Columns:
- Risk ID: links to the Risk Exposure Register
- Control ID: a unique identifier (e.g., C-01, C-02)
- Control description: what the control does
- Control type: Preventive / Detective / Corrective
- Control category: Input validation / Model monitoring / Output review / Feedback loop / Other
- Control owner: the named person responsible for operating this control
- Test frequency: how often the control is tested to verify it is working
- Last tested: date the control was last verified
- Control effectiveness: pass/fail/partial — based on last test result

ASSURANCE: TESTING THAT CONTROLS WORK

A control that exists on paper but has never been tested is not a control. It is a hope.

Assurance is the process of verifying that controls are operating as designed. For AI systems, assurance activities include:

- Model validation: independent evaluation of model performance against the accuracy and fairness requirements before deployment
- Penetration testing: for AI systems with adversarial exposure, testing whether the model can be manipulated by crafted inputs
- Audit trail review: periodic review of decision logs to verify that the audit trail is complete, accurate, and tamper-evident
- Human override testing: verifying that the human-in-the-loop process is functioning — that humans are genuinely reviewing decisions and not rubber-stamping
- Scenario testing: testing model behaviour under conditions outside the training distribution (stress testing)

THE BA''S ROLE IN CONTROLS DESIGN

The BA does not design technical controls — that is the role of the data science and engineering teams. The BA:
1. Specifies the control requirements (what must be controlled, and to what standard)
2. Validates that the controls designed by the technical team address the specified requirements
3. Documents the Control Matrix as a governance artefact
4. Ensures control testing is scheduled and results are reviewed by the appropriate governance body
5. Escalates control gaps or failures to the model owner

DELIVERABLE: Control Matrix
Build a Control Matrix for the AI system you are analysing. Link at least 5 risks from your Risk Exposure Register to controls. Include at least one control from each of the four AI-specific control categories. For each control, specify: type, owner, test frequency, and how its effectiveness will be verified.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Executive Risk Decisions
  UPDATE public.videos SET
    description = 'Not all risks can be mitigated — and not all risks should be. The four risk treatment options (accept, mitigate, transfer, avoid) are strategic choices, not technical ones. This lesson teaches how to frame risk decisions for executives: presenting the options, the trade-offs, and the residual risk in terms that enable a confident decision — and how to produce a Risk Treatment Plan that is both a governance document and an executive communication tool.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Executive Risk Decisions',
      'description', 'Risk treatment is a strategic choice: accept, mitigate, transfer, or avoid. This lesson teaches how to present these trade-offs to executives in terms they can act on, and how to produce a Risk Treatment Plan that is both a governance document and a board-ready communication.',
      'transcript', 'EXECUTIVE RISK DECISIONS

THE FOUR RISK TREATMENT OPTIONS

ISO 31000 defines four risk treatment options. Understanding when each is appropriate — and how to present it to executives — is a core BA competency.

OPTION 1 — ACCEPT
Definition: The organisation acknowledges the risk exists and chooses to proceed without additional controls, accepting the potential consequences.
When appropriate:
- The cost of mitigation exceeds the expected loss from the risk
- The risk is within the organisation''s defined risk appetite
- No technically or commercially feasible mitigation exists
- The probability is so low that treatment is not cost-effective

Example: A churn prediction model has a 5% chance per year of a data drift event that would cost $50K to remediate. Implementing continuous automated monitoring would cost $80K per year. The accept decision: proceed without monitoring, remediate manually if the event occurs. ($50K × 5% = $2.5K expected annual loss vs $80K annual monitoring cost.)

Important note: accepting a risk is not the same as ignoring it. The accept decision must be:
- Documented: the risk is recorded in the Risk Exposure Register
- Reviewed periodically: accepted risks must be reviewed on a schedule (the environment changes)
- Within risk appetite: confirmed by the appropriate governance authority, not decided unilaterally

OPTION 2 — MITIGATE
Definition: Reduce the likelihood, impact, velocity, or detectability of the risk through controls.
When appropriate:
- The cost of controls is less than the expected loss from the risk
- The risk is above the organisation''s risk appetite but is technically controllable
- Regulatory requirements mandate certain controls regardless of cost-benefit analysis

Example: The fraud detection model has a 15% chance per year of a bias incident that could cost $3M. Implementing fairness monitoring and bias testing before each deployment costs $120K per year. Expected loss without controls: $450K (15% × $3M). Cost of controls: $120K. Mitigation is clearly cost-effective; risk residual after controls reduces expected loss to approximately $90K (5% × $3M with better detection and faster response).

Mitigation reduces risk — it does not eliminate it. The residual risk must be documented.

OPTION 3 — TRANSFER
Definition: Transfer the financial consequence of the risk to a third party (typically through insurance or contractual liability allocation).
When appropriate:
- The risk is insurable and the premium is less than the expected loss
- A vendor or third party is in a better position to manage the risk
- Contractual allocation of liability is appropriate (e.g., vendor is responsible for model performance to agreed SLAs)

Example: A third-party AI vendor provides a fraud detection model under a performance SLA. Contractual liability for SLA failures is assigned to the vendor. The organisation retains operational risk (the risk that vendor systems are unavailable), but transfers model performance risk.

Important: transfer does not transfer regulatory liability. If a third-party AI model violates GDPR, the data controller (your organisation) remains liable. Transfer of financial risk does not transfer compliance risk.

OPTION 4 — AVOID
Definition: Do not pursue the activity or feature that creates the risk.
When appropriate:
- The risk is unacceptable and cannot be adequately mitigated or transferred
- The activity is prohibited (regulatory, ethical, or policy grounds)
- The expected return does not justify the risk even after mitigation

Example: An organisation considers using AI for automated employment termination decisions. After the Regulatory Impact Assessment (EU AI Act — high risk; EEOC disparate impact risk; reputational risk), the organisation decides to avoid this use of AI entirely. Human decisions with AI as advisory input only.

The avoid decision should not be a default (avoiding risk means forgoing opportunity). It should be a deliberate choice backed by the Regulatory Impact Assessment and the risk scoring from the Risk Exposure Register.

PRESENTING RISK TRADE-OFFS TO EXECUTIVES

Executives need to make risk decisions — not receive risk lectures. Frame every risk treatment recommendation as:

1. THE RISK (one sentence, quantified)
"There is an estimated 15% probability of an algorithmic bias incident in the next 12 months, with an expected financial impact of $3M."

2. THE TREATMENT OPTIONS (two or three options, not one)
"Option A — Accept: proceed with current controls. Expected annual loss: $450K. No additional investment required.
Option B — Mitigate: implement fairness monitoring and pre-deployment bias testing. Cost: $120K/year. Expected annual loss reduces to approximately $90K.
Option C — Transfer: purchase AI liability insurance cover for bias incidents. Premium estimated at $200K/year. Financial exposure capped at policy excess."

3. THE RECOMMENDED TREATMENT (with rationale)
"We recommend Option B. It provides a net reduction in expected annual loss of $360K at a cost of $120K — a 3:1 return on investment. Option A leaves unacceptable residual regulatory exposure. Option C costs more than it saves."

4. THE RESIDUAL RISK
"After implementing Option B, residual risk is estimated at approximately $90K expected annual loss. This is within the organisation''s stated risk appetite of $150K for model risk in this category."

5. THE DECISION REQUESTED
"We are seeking approval to proceed with Option B, with a budget of $120K for fairness monitoring implementation in Q3."

THE RISK TREATMENT PLAN

The Risk Treatment Plan documents every risk treatment decision in a format that serves both governance and audit.

Columns:
- Risk ID: links to Risk Exposure Register
- Chosen treatment: Accept / Mitigate / Transfer / Avoid
- Rationale: why this treatment was chosen
- Treatment action: the specific action(s) to be taken
- Cost of treatment: investment required
- Residual risk: expected exposure after treatment
- Residual within risk appetite? Yes / No / Requires board approval
- Treatment owner: who is responsible for implementing the treatment
- Target completion: when will the treatment be in place?
- Monitoring: how will residual risk be monitored?
- Review date: when will the treatment decision be reviewed?

DELIVERABLE: Risk Treatment Plan
Complete a Risk Treatment Plan for the top 6 risks in your Risk Exposure Register. For each risk, document the chosen treatment, rationale, residual risk, and cost of treatment. Your plan must include at least one example of each treatment option (accept, mitigate, transfer, and avoid). Present the most material risk decision in executive communication format (the five-element structure above).'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: AI Governance in Regulated Industries
  UPDATE public.videos SET
    description = 'Financial services, healthcare, and HR are the three sectors with the most developed AI regulatory frameworks — and the highest potential consequences for non-compliance. This lesson teaches sector-specific AI governance requirements: what the regulators expect, what documentation is required, and how BAs in these sectors must extend the standard AI governance framework to meet the bar that financial regulators, the FDA, and the EEOC are setting.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI Governance in Regulated Industries',
      'description', 'Financial services (SR 11-7), healthcare (FDA AI/ML guidance), and HR (EEOC algorithmic screening) each impose specific AI governance requirements. This lesson teaches what each sector demands, what documentation proves compliance, and how to structure AI governance that survives regulatory scrutiny.',
      'transcript', 'AI GOVERNANCE IN REGULATED INDUSTRIES

FINANCIAL SERVICES: MODEL RISK MANAGEMENT

The definitive framework for AI governance in financial services is SR 11-7 — the US Federal Reserve and OCC''s 2011 Supervisory Guidance on Model Risk Management. Despite being published in 2011 (predating modern AI), SR 11-7 remains the standard against which financial institutions'' AI governance is evaluated by US banking regulators. The FCA and PRA in the UK have issued equivalent guidance.

SR 11-7 REQUIREMENTS FOR AI MODELS IN FINANCIAL SERVICES:

1. Model inventory: every model used in a regulated context must be catalogued in a model inventory with: model name, purpose, owner, developer, validation status, and deployment date.

2. Model validation: before deployment, every model must be independently validated — by a team that did not develop the model — for:
   - Conceptual soundness: is the modelling approach appropriate for the problem?
   - Outcomes analysis: does the model produce accurate, reliable outputs on out-of-sample data?
   - Process verification: were the development and testing processes appropriate?

3. Ongoing monitoring: every deployed model must have defined performance monitoring, with reports reviewed by model owners on a specified cadence. Significant deterioration triggers a validation review.

4. Model documentation: models must be documented sufficiently for an informed third party (a regulator or independent validator) to understand what the model does, how it was built, and how it performs. The model card is one implementation of this requirement.

5. Governance: board-level or senior management oversight of model risk is required. This typically means a Model Risk Committee with board representation.

BA obligations in financial services: contribute to the model inventory (specify the fields that must be populated at deployment); specify model documentation requirements; define the monitoring cadence and escalation thresholds; support the independent validation team in understanding the model''s intended use.

ALGORITHMIC TRADING RULES AND EXPLAINABILITY REQUIREMENTS

For AI systems used in financial markets (algorithmic trading, order routing, market-making):
- MiFID II (EU): algorithmic trading systems must be tested before deployment, have kill-switches, and maintain detailed logs of all orders placed by the algorithm.
- SEC Rule 15c3-5 (Market Access Rule, US): firms must have pre-trade risk controls on automated order flow.
- Explainability: if an algorithmic trading decision is challenged by a regulator, the firm must be able to explain the decision logic. Black-box models with no interpretability are increasingly problematic in this context.

HEALTHCARE: FDA AI/ML GUIDANCE

The FDA published its Action Plan for AI/ML-Based Software as a Medical Device (SaMD) in 2021 and has been developing a regulatory framework for AI in clinical settings.

KEY FDA AI/ML REQUIREMENTS FOR CLINICAL AI:

1. Pre-specified performance criteria: before deployment, the AI system''s performance must be specified and validated against objective criteria, including performance across relevant patient subgroups (age, sex, race, ethnicity, comorbidities).

2. Algorithmic transparency: the FDA expects transparency about how the AI system works — not necessarily full white-box interpretability, but sufficient understanding to assess potential failure modes and limitations.

3. Real-world performance monitoring: AI systems that change or adapt over time (or that are retrained) require a pre-specified plan for monitoring real-world performance and reporting significant performance changes to the FDA.

4. Human factors: clinical AI systems must be designed and validated for usability — ensuring that clinicians can use the AI output appropriately and are not over-reliant on AI recommendations (automation bias).

ALGORITHMIC BIAS IN CLINICAL AI

Clinical AI systems have demonstrated systematic bias across demographic groups in published studies:
- Dermatology AI trained predominantly on light-skinned patients performs worse on dark-skinned patients.
- Sepsis prediction models have shown differential performance by race.
- Pain assessment AI has underestimated pain in patients of colour.

BA obligations: for any clinical AI system, specify bias evaluation requirements across all relevant patient demographic groups as mandatory pre-deployment requirements. These are not optional — they are patient safety requirements.

PATIENT SAFETY MONITORING

Clinical AI systems that affect patient care decisions must have:
- Defined clinical safety thresholds (what level of performance is clinically acceptable?)
- Post-market surveillance: systematic collection and analysis of real-world performance data
- Adverse event reporting: clear protocol for reporting AI-related adverse events to the FDA and to clinical governance
- Clinician override: every clinical AI recommendation must be overrideable by the clinician without friction

HR AND EMPLOYMENT: EEOC ALGORITHMIC EMPLOYMENT SCREENING

The EEOC Technical Assistance Document (2023) on AI and Employment clarifies the application of Title VII and the ADA to AI-powered hiring, promotion, and termination decisions.

KEY EEOC REQUIREMENTS:

1. Disparate impact analysis: if an AI tool has a disparate impact on a protected class (race, sex, national origin, age, disability), the employer must show the tool is job-related and consistent with business necessity.

2. Reasonable accommodation: if an AI hiring tool screens out candidates based on characteristics associated with a disability, and a reasonable accommodation would have enabled the candidate to perform the job, the employer may be liable.

3. Selection rate monitoring: employers using AI hiring tools must monitor selection rates by race, sex, and national origin to detect adverse impact.

NYC Local Law 144 (effective 2023) goes further:
- Automated employment decision tools (AEDTs) used in NYC must undergo annual bias audits by an independent auditor
- Bias audit results must be publicly posted on the employer''s website
- Job candidates and employees must be notified that an AEDT is being used

BIAS TESTING REQUIREMENTS IN EMPLOYMENT AI

A bias audit for employment AI must evaluate:
- Selection rate by race, sex, and intersectional categories
- Adverse impact ratio: the ratio of the selection rate of a protected group to the selection rate of the most-selected group (EEOC four-fifths rule: any ratio below 0.8 is presumptive evidence of adverse impact)
- If the AEDT is assessing candidates for a role, the audit must assess whether the tool predicts job performance equally across groups

HOW TO DOCUMENT AI COMPLIANCE

Regardless of sector, AI compliance documentation follows a common structure:

1. Model cards: what the model does, its performance, its limitations, and its intended use
2. Data lineage: where the training data came from, how it was processed, and whether it meets governance requirements
3. Decision logs: for regulated decisions, a log of every decision made by the AI system, including: input data snapshot, model version, output, confidence score, and any human review action
4. Audit trails: tamper-evident records of model development, validation, deployment, monitoring, and retirement decisions — sufficient for a regulatory review

The BA''s role is to specify these documentation requirements in the AI Requirements Package before the system is built — not to create the documentation after the fact.

DELIVERABLE: AI Governance Compliance Blueprint
Produce an AI Governance Compliance Blueprint for the AI system you are analysing. Choose one sector (financial services, healthcare, or employment) and document: the applicable regulatory requirements, the governance artefacts required to demonstrate compliance (model card outline, data sheet outline, decision log specification, audit trail requirements), and the gaps between the current (or proposed) system and full compliance. This is a Module 15 capstone-eligible deliverable.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 15 — Capstone: Discovery-to-Transformation  (OFFSET 14, order_index = 15)
-- Five-phase capstone project. Each lesson = one phase.
-- Content = project brief + coaching guidance, not teaching lessons.
-- Passing score: 80%. Distinction: 92%.
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 14;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M15 chapter not found'; END IF;

  -- Phase 1: Discovery
  UPDATE public.videos SET
    description = 'Phase 1 begins your capstone journey: a complex multi-channel retail scenario with declining NPS and rising operational costs. Your task is to cut through the noise — separating loud requests from evidenced problems — and produce an Executive Discovery Report that names the one real problem, proves it with evidence, and establishes the metric that will define transformation success. This phase tests whether you can find signal in a stakeholder landscape full of noise.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Phase 1 · Discovery',
      'description', 'Given a complex multi-channel retail scenario with declining NPS and rising operational costs, your task is to find the one real problem beneath the noise. The Executive Discovery Report must name the problem, prove it with evidence, and establish the success metric.',
      'transcript', 'CAPSTONE PHASE 1 — DISCOVERY

WELCOME TO YOUR CAPSTONE

The Aladiah Business Analyst Capstone is not an exam. It is a professional simulation. You will receive a complex business scenario and produce the same deliverables a senior BA would produce for a paying client. The quality bar is professional standard — not student standard.

Phases 1–5 build on each other. Your Phase 1 discovery informs your Phase 2 architecture. Your Phase 2 architecture drives your Phase 3 requirements and governance. Your Phase 3 output feeds your Phase 4 investment case. Everything culminates in Phase 5: the board recommendation and your Aladiah Profile.

Do not rush Phase 1. Everything downstream depends on whether you found the right problem.

THE SCENARIO

You have been engaged as the lead Business Analyst by the executive team of Meridian Retail Group — a mid-size multi-channel retailer operating across e-commerce, 38 physical stores, and a wholesale B2B channel in the Caribbean and West Africa markets.

Meridian''s CEO has provided you with the following briefing:
"We have been growing top-line revenue at 6% annually, but our NPS has dropped from +42 to +18 over the past 18 months. Our operational costs have risen 23% in the same period despite a cost reduction programme. My leadership team cannot agree on what is wrong. Marketing says we need a new loyalty programme. Operations says we need a new WMS. IT says we need to migrate to the cloud. I need an independent view: what is actually broken, and what do we fix first?"

SUPPORTING DATA PROVIDED TO YOU

You have been given access to:
- 18 months of NPS survey data (broken down by channel, store region, and customer segment)
- Customer complaint log (12,000 entries, categorised by complaint type)
- Operational cost breakdown by function (procurement, logistics, store operations, IT, customer service)
- Stakeholder interview summaries from 8 senior leaders (conflicting priorities are evident)
- A Voice-of-Customer report from a survey of 400 customers conducted 3 months ago
- Two internal project proposals: one for a loyalty programme ($2.1M), one for a WMS replacement ($3.8M)

YOUR TASK — EXECUTIVE DISCOVERY REPORT

Produce an Executive Discovery Report that answers four questions:

1. WHAT IS THE ONE REAL PROBLEM?
Not a list of problems. Not a description of symptoms. The single root-cause problem that, if resolved, would move the NPS and cost metrics significantly.

2. WHAT IS THE EVIDENCE FOR IT?
Cite specific data from the materials provided. The evidence must be quantified where possible. Assertions without evidence will not pass.

3. WHAT IS NOT THE PROBLEM (AND WHY)?
Name at least two things that have been suggested as the problem but are not the root cause. Explain why — with evidence.

4. WHAT METRIC WILL MEASURE SUCCESS?
Name the one primary metric. State its current value. State what ''good'' looks like at 12 months.

COACHING GUIDANCE

USE JTBD METHODOLOGY
Approach the stakeholder interviews as JTBD data. What job is each senior leader really trying to get done? Their requests (loyalty programme, WMS, cloud migration) are positions, not interests. Dig for the underlying interest: what outcome are they actually trying to achieve?

USE ROOT-CAUSE ANALYSIS
Apply the 5 Whys to the NPS decline. What is the symptom? What is the proximate cause? What is the systemic root cause? Stop when you reach a structural cause that explains both the NPS decline and the cost increase — they are almost certainly connected.

USE STAKEHOLDER MAPPING
Before you interpret the interview summaries, map the stakeholders. Who has the most to lose from a true root-cause diagnosis? Whose framing of the problem is most likely to be biased by departmental self-interest? Discount those framings and look for the evidence that contradicts them.

SEPARATE LOUDNESS FROM EVIDENCE
The loudest voice in the room is not the most reliable source of truth. The marketing team wants a loyalty programme — that is a solution, not a diagnosis. What does the NPS data actually show? Where is NPS declining fastest? What do customers say in the complaint log? Those sources are more reliable than senior leadership opinions.

ASSESSMENT CRITERIA

This phase is assessed on four dimensions:

1. Problem identification (30%): Did you identify the correct root cause? Is the problem statement clear, specific, and distinct from symptoms?

2. Evidence quality (30%): Is the problem backed by specific, quantified evidence from the data provided? Are multiple data sources corroborated?

3. Counter-argument quality (20%): Did you address and credibly dismiss the alternative diagnoses? Did you use evidence to do so?

4. Success metric (20%): Is the metric specific, measurable, and logically connected to the identified root cause? Does it reflect a business outcome (not an output)?

PASSING THRESHOLD: 80%
DISTINCTION THRESHOLD: 92%

To achieve distinction, your problem statement must be counterintuitive — it must go beyond what the most obvious reading of the data would suggest and reveal a root cause that requires genuine analytical insight.

WHAT TO SUBMIT
- The Executive Discovery Report (maximum 4 pages, excluding appendices)
- A one-paragraph executive summary (maximum 150 words, designed to be the opening of a CEO briefing)
- An annotated data reference (showing which data points support your diagnosis)

Proceed to Phase 2 when your Executive Discovery Report has been reviewed by AI Professor Didier or assessed by the course team.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Phase 2: Architecture & Strategy
  UPDATE public.videos SET
    description = 'Phase 2 lifts the analysis from the individual problem you identified in Phase 1 to the enterprise level. You will build a capability map of Meridian Retail Group, identify the capability gaps that explain the problems you found, define a target-state architecture, and produce a Product Opportunity Assessment framed as a board-ready investment case. This phase tests whether you can think at enterprise scale — not just process or system level.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Phase 2 · Architecture & Strategy',
      'description', 'Phase 2 lifts from the problem to the enterprise: build a capability map, identify gaps, define the target state, and produce a Product Opportunity Assessment as a board-ready investment case. This phase tests whether you can think at enterprise scale.',
      'transcript', 'CAPSTONE PHASE 2 — ARCHITECTURE & STRATEGY

YOUR PHASE 2 BRIEF

In Phase 1, you identified the root-cause problem at Meridian Retail Group. In Phase 2, you zoom out to the enterprise level: what capabilities does Meridian need to solve this problem and be fit for the next five years?

Phase 2 is the architecture and strategy phase. It produces three deliverables that together make the case for where Meridian should invest — before any solution is specified.

DELIVERABLE 1 — CAPABILITY MAP

A business capability map shows what an organisation needs to be able to do — not how it does it, and not which system or team does it. Capabilities are stable over time even when technology and organisational structures change.

Your Capability Map must:
- Contain at least 3 domains (e.g., Customer Experience, Supply Chain & Operations, Data & Intelligence)
- Contain at least 4 capabilities per domain (e.g., within Customer Experience: Order Management, Returns & Refunds, Loyalty & Retention, Customer Feedback & NPS)
- Rate each capability: 1 (minimal/absent) to 5 (world-class), based on your Phase 1 analysis
- Highlight the capabilities that are most critical to solving the root-cause problem you identified

The capability map is not an org chart and not a process map. It is an investment prioritisation tool: it shows where the organisation is strong and where it is weak, so that investment decisions are grounded in capability reality, not departmental lobbying.

DELIVERABLE 2 — TARGET-STATE ARCHITECTURE

The Target-State Architecture defines where Meridian needs to be — the future capability profile that would resolve the root-cause problems and enable the growth strategy.

Your Target-State Architecture must:
- Show the delta from current state: for each capability you have assessed, what level does it need to reach? (Current: 2 → Target: 4)
- Identify which capabilities are foundational (must be built first because others depend on them)
- Identify which AI capabilities are required in the target state (which capabilities will require AI to reach the target level?)
- Be feasible: the target state must be achievable in 24–36 months, not a theoretical ideal

TOGAF INFLUENCE: You do not need to produce a TOGAF-compliant architecture. But you should use TOGAF''s discipline of describing architecture in four layers: Business Architecture (capabilities and value streams), Data Architecture (what data is needed), Application Architecture (what systems are needed), and Technology Architecture (what infrastructure is needed). Your Target-State Architecture should address the Business and Data layers at minimum.

DELIVERABLE 3 — PRODUCT OPPORTUNITY ASSESSMENT

The Product Opportunity Assessment (POA) frames the transformation opportunity as a board-level investment case. It answers: why should Meridian invest in this transformation, and why now?

Your POA must be structured as a board-ready investment case:

1. THE OPPORTUNITY
What is the market or operational opportunity that this transformation addresses? Quantify it: revenue upside, cost reduction, risk mitigation.

2. THE STRATEGIC FIT
How does this opportunity align with Meridian''s stated strategy? Why is now the right time?

3. THE CAPABILITY GAPS
Which specific capability gaps (from your Capability Map) are blocking Meridian from capturing this opportunity?

4. THE SOLUTION DIRECTION
What general direction of investment will close the gaps? (Not the technical solution — the capability solution.)

5. THE INVESTMENT RATIONALE
Why should the board approve this over competing investment options? What is the cost of delay (see Module 12)?

6. THE RECOMMENDED NEXT STEP
What is the specific investment decision the board is being asked to make today?

COACHING GUIDANCE

USE THE OPPORTUNITY SOLUTION TREE
Before building the Capability Map, use an Opportunity Solution Tree (Teresa Torres) to organise the opportunity space. At the top: the business outcome (from your Phase 1 success metric). Below: the opportunity areas (what are the problems and unmet needs that, if addressed, would move the metric?). Below: the solution directions (what capability investments would address each opportunity area?).

This structure ensures your Capability Map and Target-State Architecture are grounded in the business outcome — not in a generic best-practice capability model.

MAKE THE DELTA EXPLICIT
The most common failure in Phase 2 is a beautiful current-state capability map with no clear path to the target state. The examiner cannot see the delta unless you show it explicitly. Use a table, a heat map, or a colour-coded capability map that shows current level, target level, and the gap.

FRAME THE POA FOR A BOARD AUDIENCE
The Product Opportunity Assessment is read by the board, not the project team. Lead with the financial opportunity. Use the language of the CEO briefing (from Phase 1). Every claim must be quantified or cited. The board will not approve an investment case full of qualitative assertions.

ASSESSMENT CRITERIA

1. Capability Map quality (25%): Does it cover the right domains? Are the capability assessments credible given the Phase 1 analysis? Is it at the right level of abstraction (not processes, not systems)?

2. Target-state coherence (25%): Is the delta from current to target state explicit? Are the foundational dependencies correctly identified? Are AI capabilities appropriately included?

3. POA as investment case (30%): Is it framed in financial terms? Does it make the board-level case compellingly? Is the cost of inaction addressed?

4. Strategic insight (20%): Does the architecture tell a story that flows logically from the Phase 1 problem to the Phase 2 target state? Is the investment rationale distinctive?

PASSING THRESHOLD: 80%
DISTINCTION THRESHOLD: 92%

To achieve distinction, your POA must include a quantified cost-of-delay calculation (how much does Meridian lose for each month it delays this investment?) and your Capability Map must identify at least one counterintuitive capability gap — one that the leadership team would not have named but that your Phase 1 analysis reveals as critical.

WHAT TO SUBMIT
- Capability Map (visual format acceptable: table, diagram, or Miro board export)
- Current vs. Target State delta table
- Product Opportunity Assessment (maximum 5 pages, board-ready format)
- Annotated linkage: how does each deliverable connect to your Phase 1 root-cause diagnosis?'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Phase 3: Requirements, Governance & Risk
  UPDATE public.videos SET
    description = 'Phase 3 makes the transformation real and safe. You will apply the AI Requirement Ladder 2.0 to specify the AI features in your target-state architecture, build a Governance Blueprint that addresses accountability, transparency, fairness, and safety, and produce a Risk Treatment Plan with explicit treatment decisions. This phase tests whether you can operate at the intersection of analytical precision and governance rigour.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Phase 3 · Requirements, Governance & Risk',
      'description', 'Phase 3 makes the transformation real and safe: apply the AI Requirement Ladder 2.0, build a Governance Blueprint covering all four pillars, and produce a Risk Treatment Plan with explicit treatment decisions across accept, mitigate, transfer, and avoid.',
      'transcript', 'CAPSTONE PHASE 3 — REQUIREMENTS, GOVERNANCE & RISK

YOUR PHASE 3 BRIEF

In Phase 2, you defined where Meridian needs to go and why. In Phase 3, you make it real and safe.

Phase 3 produces three interlocking deliverables: the AI Requirements Package, the Governance Blueprint, and the Risk Treatment Plan. Together they represent the full professional output of a senior BA on an AI transformation engagement. This is the most technically demanding phase of the capstone.

DELIVERABLE 1 — AI REQUIREMENTS PACKAGE

Apply the AI Requirement Ladder 2.0 (from Module 13) to at least one AI feature from your Phase 2 target-state architecture.

Your AI Requirements Package must include:

All five layers of the AI Requirement Ladder for at least one AI feature:
- Layer 1 (Functional): what the AI does, inputs, outputs, interface requirements
- Layer 2 (Accuracy): performance metric, threshold, measurement method, retraining trigger
- Layer 3 (Fairness): protected attributes, fairness metric, threshold, evaluation cadence
- Layer 4 (Explainability): who needs explanations, at what depth, in what format, within what latency
- Layer 5 (Governance): model owner, review cadence, audit trail requirements, kill-switch protocol

A Decision Authority Matrix for the AI feature: mapping each decision type to the appropriate oversight level (autonomous / human-in-the-loop / human-on-the-loop / human-in-command), with risk scoring justifying each level.

Non-functional requirements: latency, availability, scalability, security, and data residency where applicable.

Transition requirements: what is needed to move from the current state to the deployed AI capability? (Data preparation, staff training, process change, legacy system retirement.)

DELIVERABLE 2 — GOVERNANCE BLUEPRINT

The Governance Blueprint is the operating manual for responsible AI at Meridian. It must address all four governance pillars from Module 13, Lesson 4.

Your Governance Blueprint must address:

ACCOUNTABILITY:
- Named roles and responsibilities for each AI system in the target state
- Escalation path when an AI system malfunctions or produces harmful outputs
- Decision authority for: deploying, pausing, and retiring AI systems

TRANSPARENCY:
- Model card template (completed for at least one AI feature)
- Data sheet template (outline structure)
- Customer disclosure requirements (where Meridian must disclose AI involvement to customers)
- Regulatory disclosure requirements (if applicable given your Regulatory Impact Assessment)

FAIRNESS:
- Protected attributes to be monitored across Meridian''s AI portfolio
- Fairness metrics and thresholds per AI system
- Pre-deployment bias testing protocol
- Ongoing fairness monitoring cadence

SAFETY:
- Human override capability: technical and procedural
- Fallback behaviour specifications for each AI feature
- Incident response protocol: what happens when an AI system causes harm?
- Kill-switch protocol: who can shut down an AI system and under what conditions?

DELIVERABLE 3 — RISK TREATMENT PLAN

Apply the risk quantification and treatment framework from Module 14 (Lessons 2–4) to the AI features in your target-state architecture.

Your Risk Treatment Plan must:

- Include at least 6 risks across at least 3 categories (model, regulatory, operational, reputational)
- Score each risk using the extended formula: Likelihood × Impact × Velocity × (1/Detectability)
- Include at least one financial quantification: expected loss = probability × financial impact
- Include explicit treatment decisions for each risk:
  - At least one ACCEPT decision (with documented rationale and residual risk)
  - At least one MITIGATE decision (with specific controls specified and cost-benefit analysis)
  - At least one TRANSFER decision (with the mechanism: insurance or contractual)
- Include a residual risk summary: what is the aggregate residual risk after all treatments?

COACHING GUIDANCE

THE INTERDEPENDENCE OF THE THREE DELIVERABLES
These three deliverables are not independent. The AI Requirements Package (especially Layer 5 — Governance) feeds the Governance Blueprint. The Governance Blueprint''s monitoring requirements become detective controls in the Risk Treatment Plan. The Risk Treatment Plan''s accept/mitigate decisions feed back into the Layer 5 governance requirements. Show the examiner that you understand these connections — reference each deliverable from the others.

USE THE AI REQUIREMENT LADDER RIGOROUSLY
The most common Phase 3 failure is completing the AI Requirement Ladder at Layers 1 and 2 with real precision, then becoming vague at Layers 3–5. Examiners at distinction level look for the same rigour at Layer 5 (Governance) as at Layer 2 (Accuracy). Every governance requirement must be specific, named, and scheduled — not generic.

THE GOVERNANCE BLUEPRINT IS NOT A POLICY DOCUMENT
A policy document says "we will do X." A Governance Blueprint says "Person A will do X by reviewing metric Y on cadence Z, and will escalate to Person B if threshold W is breached." Make it operational, not aspirational.

ASSESSMENT CRITERIA

1. AI Requirements Package completeness (30%): All five layers completed for at least one AI feature. Requirements are specific and measurable. Decision Authority Matrix is scored and justified.

2. Governance Blueprint operational quality (30%): All four pillars addressed. Named owners, specific cadences, explicit escalation paths. Model card completed for at least one feature.

3. Risk Treatment Plan rigour (25%): All four treatment types present. Financial quantification present. Residual risks documented. Controls link to specific risks.

4. Cross-deliverable coherence (15%): Do the three deliverables tell a consistent story? Does the examiner see the linkages between requirements, governance, and risk?

PASSING THRESHOLD: 80%
DISTINCTION THRESHOLD: 92%

To achieve distinction, you must demonstrate cross-deliverable coherence explicitly: include a one-page integration summary showing how specific requirements drive specific governance controls, and how specific governance controls address specific risks in the Risk Treatment Plan.

WHAT TO SUBMIT
- AI Requirements Package (all five layers, Decision Authority Matrix, NFRs, transition requirements)
- Governance Blueprint (four pillars, model card for at least one feature)
- Risk Treatment Plan (6+ risks, all four treatment types, financial quantification)
- Integration summary (one page, showing cross-deliverable linkages)'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Phase 4: The Investment Case
  UPDATE public.videos SET
    description = 'Phase 4 translates the transformation into money that a CFO can approve. You will build a three-year financial model (investment, savings, revenue impact, NPV), quantify the cost of delay per month, and produce a Benefits Realization Plan that tells the CFO who measures what and when. This phase tests whether you can operate at the intersection of BA rigour and financial literacy — the combination that unlocks executive funding.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Phase 4 · The Investment Case',
      'description', 'Phase 4 translates the transformation into money: three-year financials, cost of delay per month, and a Benefits Realization Plan. This phase tests whether you can produce a business case that a CFO can approve and a board can fund.',
      'transcript', 'CAPSTONE PHASE 4 — THE INVESTMENT CASE

YOUR PHASE 4 BRIEF

You have found the problem (Phase 1), defined the solution direction (Phase 2), and made it safe (Phase 3). Now you must make the money case.

The Phase 4 investment case is the document that determines whether Meridian''s board approves the transformation. A technically excellent Phase 1–3 submission that cannot be translated into a fundable business case will not result in a transformation. Real transformations are funded on financial arguments — not analytical excellence.

DELIVERABLE 1 — BUSINESS CASE (P5)

Your Business Case must contain:

THREE-YEAR FINANCIAL MODEL
Structure:

Year 0 (Implementation):
- Technology investment (platform, infrastructure, licences)
- Implementation costs (professional services, internal resource, vendor fees)
- Change management and training
- Governance and compliance build costs
Total Year 0 investment: £/$ [X]

Year 1 (Partial benefit):
- Benefits beginning to materialise (typically 30–50% of full-year benefit in Year 1)
- Ongoing operating costs (licences, model maintenance, monitoring, governance)
Net Year 1: £/$ [Y] (may still be negative)

Year 2 (Full operational benefit):
- Full annual benefit realised
- Ongoing operating costs
Net Year 2: £/$ [Z]

Year 3 (Compounding benefit):
- Full annual benefit, with growth assumptions
- Any incremental investment for Horizon 3 capabilities
Net Year 3: £/$ [W]

NPV CALCULATION
Net Present Value = sum of discounted cash flows over 3 years
Discount rate: use 10% (a reasonable cost of capital for a mid-size retail business)
Formula: NPV = (Year 0 CF) + (Year 1 CF / 1.10) + (Year 2 CF / 1.10²) + (Year 3 CF / 1.10³)

ROI CALCULATION
ROI = (Total Benefits – Total Investment) / Total Investment × 100%

PAYBACK PERIOD
The month at which cumulative cash flows turn positive. Plot on a cash flow timeline.

HOW TO ESTIMATE BENEFITS
Benefits for a transformation of this type typically come from three sources:

1. Cost reduction:
- Operational efficiency gains (automation replacing manual processes)
- Error reduction (AI-assisted quality checking)
- Customer service cost reduction (AI handling tier-1 queries)
Estimate: quantify the current cost of the inefficiency (from Phase 1 root-cause analysis) and apply a realistic capture rate (typically 30–60% in Year 1, 50–80% in Year 2).

2. Revenue protection and growth:
- NPS improvement translating into reduced churn (NPS +10 points typically reduces churn by 1–3% for a retail business of this size — quantify the revenue value of 1% churn reduction at Meridian''s revenue and margin)
- Conversion rate improvement from personalisation (if your target state includes AI personalisation)
- New capability enabling new revenue streams

3. Risk cost avoidance:
- Regulatory fine avoidance (from your Risk Treatment Plan — the expected loss from regulatory exposure that governance investment reduces)
- Fraud loss reduction
- Customer complaint cost reduction

DELIVERABLE 2 — COST OF DELAY CALCULATION

Cost of Delay is the economic value of waiting one month to begin the transformation. It is one of the most powerful executive communication tools in the BA toolkit because it makes the cost of inaction concrete and monthly.

Your Cost of Delay must:

1. Quantify the monthly cost of delay in financial terms
Components:
- Revenue loss per month from continued NPS decline (NPS decline rate × revenue impact per NPS point)
- Operational cost overrun per month from unresolved root-cause problems
- Regulatory exposure accumulation per month (from Risk Treatment Plan — expected monthly cost of unmitigated risks)
- Competitive position erosion per month (if quantifiable)

2. Present the calculation transparently
Show your assumptions and their sources. A CFO will challenge unsupported numbers. A CFO will approve supported ones.

3. Frame it as a board decision
"Every month this board does not approve this investment costs Meridian an estimated £[X] in combined revenue loss, operational overrun, and regulatory exposure. This investment pays back in [Y] months."

DELIVERABLE 3 — BENEFITS REALIZATION PLAN

A Business Case approved without a Benefits Realization Plan is an aspiration, not a commitment. The Benefits Realization Plan defines who is responsible for each benefit, how it will be measured, and when it will be reported.

Your Benefits Realization Plan must:

- List every material benefit from the Business Case
- For each benefit:
  - Benefit owner (the named executive accountable for realising this benefit — not the IT team)
  - Current baseline measurement (what is the metric today?)
  - Target value (what is the committed value at 12 months? At 24 months?)
  - Measurement method (how will this be measured? What data source?)
  - Reporting cadence (monthly? Quarterly?)
  - Enabling condition (what must be true for this benefit to be realised? e.g., "AI personalisation feature deployed and live for 90 days")
  - Risk to realisation (what would prevent this benefit from being achieved? What is the contingency?)

COACHING GUIDANCE

MAKE YOUR ASSUMPTIONS EXPLICIT
The most common Business Case failure is hidden assumptions. If you assume NPS improvement of +12 points, state the basis for that assumption. If you assume a revenue value of £[X] per NPS point, cite the source or show the calculation. Assumptions that are not stated become points of attack in board scrutiny.

THE BENEFITS REALIZATION PLAN IS A COMMITMENT TOOL
The plan should name the benefit owner explicitly — and the benefit owner should know they are named. A Benefits Realization Plan without named owners is a wish list. A plan with named owners is a governance commitment.

QUANTIFY RISK TO REALISATION
For each benefit, the CFO will ask: "What could go wrong?" Your Benefits Realization Plan should answer this proactively. For each material benefit, identify the top risk to realisation and the mitigation. This shows financial maturity — you are not overselling the case.

ASSESSMENT CRITERIA

1. Financial model completeness and accuracy (35%): Three-year model present, NPV calculated correctly, ROI and payback period present, benefit estimates are realistic and sourced.

2. Cost of delay quality (25%): Monthly cost quantified, components identified, calculation transparent, board framing compelling.

3. Benefits Realization Plan operational quality (25%): All material benefits included, named owners, measurement method, enabling conditions, risks to realisation.

4. Realism and defensibility (15%): Are the numbers realistic? Could they survive CFO scrutiny? Are assumptions explicit?

PASSING THRESHOLD: 80%
DISTINCTION THRESHOLD: 92%

To achieve distinction, your Business Case must include a sensitivity analysis: what happens to NPV if (a) benefits are 20% lower than projected? (b) implementation costs are 30% higher than projected? This demonstrates financial maturity and pre-empts the most common CFO objection.

WHAT TO SUBMIT
- Business Case document (three-year financial model, NPV, ROI, payback period)
- Cost of Delay calculation (with transparent assumptions)
- Benefits Realization Plan (all material benefits, named owners, measurement methods)
- Sensitivity analysis (for distinction)'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Phase 5: The Board Recommendation & Defense
  UPDATE public.videos SET
    description = 'Phase 5 is the culmination of your Aladiah journey. You will synthesise all five phases into a maximum 10-slide Board Recommendation Deck and defend it before an AI executive board simulation. The deck must open with the recommendation, not the background. It must tell a complete story — problem, opportunity, solution, investment, risks, and ask — in the time and format that boards actually use. Your Aladiah Profile, synthesising all 15 module deliverables, is produced alongside the deck.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Phase 5 · The Board Recommendation & Defense',
      'description', 'Synthesise all five capstone phases into a maximum 10-slide Board Recommendation Deck and defend it before an executive board simulation. The Aladiah Profile synthesises all 15 module deliverables into your career portfolio — the professional credential that proves transformation, not just completion.',
      'transcript', 'CAPSTONE PHASE 5 — THE BOARD RECOMMENDATION & DEFENSE

YOUR FINAL BRIEF

You have built a complete BA transformation case across four phases:
- Phase 1: you found the one real problem
- Phase 2: you defined the enterprise architecture to address it
- Phase 3: you made it safe and governable
- Phase 4: you made the financial case

Phase 5 is the synthesis and defense. You will produce a Board Recommendation Deck — maximum 10 slides — and defend it before an AI executive board simulation powered by AI Professor Didier.

This is the moment where analytical excellence meets executive communication. The most rigorous analysis in the world is worthless if it cannot be communicated in the format and language that boards use to make decisions.

DELIVERABLE 1 — BOARD RECOMMENDATION DECK

HARD CONSTRAINTS:
- Maximum 10 slides
- Must open with the recommendation on slide 1 (not the agenda, not the background, not the problem context — the recommendation)
- Each slide has a message headline (a complete sentence that states the point of the slide, not a topic label)
- No slide is information-only: every slide drives toward or supports the recommendation
- Financial figures must appear on at least one slide in a format a CFO can interrogate

THE PYRAMID PRINCIPLE IN SLIDE STRUCTURE

Apply the Pyramid Principle (Minto) to the deck as a whole:
- Slide 1 (the top of the pyramid): your recommendation — what the board should approve
- Slides 2–8 (the supporting arguments): the evidence and reasoning that justify the recommendation
- Slides 9–10 (the next steps and ask): what happens if they approve, and what specifically you are asking for today

THE SCQ STRUCTURE FOR THE OPENING

The first 90 seconds of your board presentation sets the frame for everything that follows. Use the SCQ structure:
- SITUATION (1–2 sentences): what is the current state of Meridian that everyone in the room knows to be true?
- COMPLICATION (1–2 sentences): what has changed or what problem has emerged that requires a decision?
- QUESTION (1 sentence): the question that the board needs to answer today
- RECOMMENDATION (your answer to the question — stated clearly and confidently)

Example opening:
"Meridian has grown top-line revenue at 6% annually, but NPS has fallen 24 points in 18 months while operational costs have risen 23%. [Situation] Root-cause analysis shows this is driven by a single systemic failure in our customer fulfilment capability — not the loyalty, WMS, or cloud issues previously proposed. [Complication] The question for this board is: do we approve a £[X]M targeted capability investment to address the root cause — or do we continue with the three fragmented initiatives already proposed? [Question] My recommendation is to approve the targeted capability investment. [Recommendation] Here is why."

REQUIRED SLIDE STRUCTURE

Slide 1 — RECOMMENDATION SLIDE
The recommendation, stated in one clear sentence. Optionally: the three supporting reasons (one line each). This is the pyramid apex.

Slide 2 — THE PROBLEM
What is the one root-cause problem? Evidence (the key data points from Phase 1). Why the previously proposed solutions do not address this root cause.

Slide 3 — THE OPPORTUNITY
The financial opportunity (from Phase 4). What Meridian stands to gain if the problem is resolved. What it loses for each month it delays (cost of delay).

Slide 4 — THE SOLUTION DIRECTION
The target-state capability (from Phase 2 — Capability Map delta). Not a technology decision — a capability decision. What Meridian will be able to do that it cannot do today.

Slide 5 — THE AI APPROACH
For the AI components of the solution: what AI capabilities are proposed, and why they are appropriate. Summarised from your AI Requirements Package (Phase 3). Include: the Decision Authority Matrix oversight levels, and the governance posture.

Slide 6 — THE GOVERNANCE & RISK POSTURE
How the transformation will be governed. The top 3 risks and their treatments (from Phase 3 Risk Treatment Plan). Why the governance posture makes this investment safe to approve.

Slide 7 — THE INVESTMENT
Three-year financial model summary (from Phase 4). NPV, ROI, payback period. Cost of delay per month.

Slide 8 — THE ROADMAP
The four-horizon delivery roadmap (from Module 13 executive roadmap). Key milestones. Decision gates (points where the board can review progress and adjust).

Slide 9 — THE ASK
Exactly what you are asking the board to approve today. The specific budget. The specific mandate. The specific next step if they approve.

Slide 10 — APPENDIX REFERENCE
A single slide listing the supporting documents available for questions: capability map, full financial model, risk register, AI requirements package, governance blueprint, benefits realization plan.

DELIVERABLE 2 — THE ALADIAH PROFILE

Your Aladiah Profile is your professional career portfolio. It synthesises all 15 module deliverables into a structured evidence base that demonstrates your competency across the 13 BA slugs in the COMPETENCY_TAXONOMY.

PROFILE STRUCTURE:

Section 1 — Professional Summary
A 150-word professional summary that you could use on LinkedIn or in a job application. Written in the present tense. Describes what you can do, not just what you have studied.

Section 2 — Competency Evidence Map
A table mapping the 13 BA competency slugs to the deliverables that demonstrate each competency:

| Competency | Deliverable(s) | Module | Evidence quality (self-assessed 1–5) |
|---|---|---|---|
| ba:requirements | AI Requirements Package | M13, M15 Phase 3 | [score] |
| ba:elicitation | Elicitation Plan, Interview Guide | M4 | [score] |
| ba:process-analysis | Observation Findings, Event Storm | M4, M8 | [score] |
| ... | ... | ... | ... |

Section 3 — Portfolio Summary (15 deliverables)
A one-paragraph description of each of the 15 module deliverables, framed in professional terms (as you would describe them to a hiring manager, not as a student describing homework).

Section 4 — Capstone Summary
A one-page narrative of your Phase 1–5 capstone journey: the problem you found, the solution you designed, the financial case you made, and what you would do differently knowing what you know now.

Section 5 — Career Target Statement
Your target role (e.g., Senior Business Analyst · Lead BA · Product Owner), the sector you are targeting, and the three specific competencies from your profile that make you ready for that role.

THE BOARD DEFENSE SIMULATION

After submitting your deck, you will enter the Board Defense Simulation with AI Professor Didier acting as the executive board panel (CEO, CFO, CTO, and Board Sponsor).

The simulation will run 45 minutes. The panel will:
- Ask you to present your recommendation (slides 1–3) in 5 minutes
- Challenge your financial assumptions (Phase 4)
- Challenge your risk treatment decisions (Phase 3)
- Ask why you chose the AI capabilities you recommended (Phase 3)
- Test whether you can defend your root-cause diagnosis under pressure (Phase 1)
- Ask you to adapt your recommendation given a constraint they introduce in the room

COACHING GUIDANCE

THE RECOMMENDATION MUST BE DEFENSIBLE, NOT DEFERENTIAL
Junior analysts hedge. Senior analysts commit. Your recommendation must be stated clearly and defended under pressure. If your analysis is right, defend it. If the board challenges you with new information, update your position — but do not capitulate to pressure alone.

LEAD WITH THE RECOMMENDATION ON EVERY ANSWER
In the board defense, every answer you give should lead with the point, then the reasoning. Never lead with "it depends." Lead with your position: "My recommendation is X, for three reasons..." This mirrors the Pyramid Principle in spoken communication.

YOUR ALADIAH PROFILE IS YOUR CAREER ASSET
The Board Recommendation Deck will not follow you beyond this simulation. Your Aladiah Profile will. Invest the time to make it excellent, specific, and professionally written. This is the document you will show to employers.

ASSESSMENT CRITERIA

1. Board deck quality (30%): Does it open with the recommendation? Is each slide''s message clear? Is the financial case present and accurate? Does it tell a complete story in 10 slides?

2. Synthesis quality (25%): Does the deck coherently synthesise all five phases? Can the examiner see the through-line from Phase 1 problem to Phase 5 recommendation?

3. Defense performance (25%): Can you defend the recommendation under challenge? Do you lead with your position? Do you update appropriately when challenged with new information?

4. Aladiah Profile quality (20%): Is the competency evidence map complete and honest? Is the professional summary interview-ready? Is the career target statement specific?

PASSING THRESHOLD: 80%
DISTINCTION THRESHOLD: 92%

To achieve distinction in Phase 5, you must pass the board defense with at least one substantive position change under pressure — demonstrating that you can distinguish between capitulating to pressure (wrong) and updating your view based on new information (right). The examiner will introduce a constraint or piece of new information and observe how you handle it.

WHAT TO SUBMIT
- Board Recommendation Deck (maximum 10 slides, PDF)
- Aladiah Profile (structured document, all five sections)
- Board Defense: scheduled via AI Professor Didier or the course team

CONGRATULATIONS
You have completed the Aladiah AI Business Analyst & Product Discovery Specialist programme. Your Aladiah Profile is now your professional credential. The deliverables in that profile represent work that no certificate alone can replicate.

The goal was never course completion. The goal was career transformation.

Go build something that matters.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- =============================================================================
-- VERIFY (run immediately after applying)
-- Expected: modules 13, 14, 15 each show filled=5
-- =============================================================================
SELECT c.order_index AS module, c.title,
  COUNT(*) FILTER (WHERE v.translations->'en'->>'transcript' IS NOT NULL AND v.translations->'en'->>'transcript' <> '') AS filled
FROM public.videos v JOIN public.chapters c ON c.id = v.chapter_id
JOIN public.courses co ON co.id = c.course_id
WHERE co.curriculum_version = 'ba-v1' AND c.order_index IN (13,14,15)
GROUP BY c.order_index, c.title ORDER BY c.order_index;
