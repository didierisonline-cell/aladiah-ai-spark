-- =============================================================================
-- Seed BA lesson content (description + EN transcript) — Modules 1–3
--
--   M1: Business Analysis in the AI Era          (order_index 1, OFFSET 0)
--   M2: BA Planning, Competencies & the AI Toolkit (order_index 2, OFFSET 1)
--   M3: Stakeholder Analysis & Management         (order_index 3, OFFSET 2)
--
-- Pattern: UPDATE videos SET description, translations
--          WHERE chapter_id = v_ch AND order_index = N
-- BA lesson order_index is 1-based (1..5 per module).
--
-- Apply: paste into Supabase SQL Editor → Run
-- Verify: SELECT c.order_index, COUNT(*) FILTER (WHERE translations->'en'->>'transcript' IS NOT NULL) AS filled
--         FROM videos v JOIN chapters c ON c.id=v.chapter_id
--         JOIN courses co ON co.id=c.course_id
--         WHERE co.curriculum_version='ba-v1'
--         GROUP BY c.order_index ORDER BY c.order_index;
-- Expected: modules 1,2,3 → filled=5 each
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
-- MODULE 1 — Business Analysis in the AI Era  (OFFSET 0, order_index = 1)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 0;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M1 chapter not found'; END IF;

  -- Lesson 1: The Evolution of the Business Analyst
  UPDATE public.videos SET
    description = 'The Business Analyst role has evolved from requirements scribe to strategic value-driver. In the AI era, BAs who understand probabilistic systems, can frame opportunities in outcome terms, and can bridge executive strategy with technical delivery command salaries up to $230K. This lesson maps the evolution ladder and shows exactly where you sit today — and where you need to be.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The Evolution of the Business Analyst',
      'description', 'The BA role has evolved from requirements scribe to strategic value-driver. In the AI era, BAs who understand probabilistic systems and frame outcomes command top salaries.',
      'transcript', 'THE EVOLUTION OF THE BUSINESS ANALYST

THE VALUE LADDER

Business Analysis has passed through five evolutionary stages:

Stage 1 — Requirements Scribe (1980s–1990s)
The BA captured what stakeholders said they wanted and wrote it down. The output was a requirements document. The BA had no strategic voice; they were a human transcription service.

Stage 2 — Process Analyst (1990s–2000s)
BAs learned to model processes (flowcharts, UML, BPMN) and began questioning whether the stated requirement actually solved the real problem. Analysis started to matter.

Stage 3 — Solution Analyst (2000s–2010s)
BAs became responsible for options analysis: evaluating build vs. buy, assessing vendor solutions, running feasibility studies. The BA started influencing decisions, not just documenting them.

Stage 4 — Business Partner (2010s–2020s)
Senior BAs became embedded in product teams, product discovery, and business transformation. They facilitated strategy, owned discovery, and translated between C-suite vision and delivery teams.

Stage 5 — AI-Augmented Analyst (2020s–now)
The modern BA uses AI tools to accelerate analysis, validate assumptions, detect patterns in data, and draft requirements. But the highest-value skill is knowing what AI cannot do: make judgment calls, navigate politics, and ask the right question before running the analysis.

WHERE THE SALARY LIVES

The IIBA Salary Survey shows that BAs operating at Stage 4–5 earn 40–80% more than Stage 1–2 practitioners. The differentiator is not certificates — it is demonstrated ability to move a business metric.

YOUR CAREER TRANSFORMATION PLAN

This course moves you from wherever you are on the ladder to Stage 5. By Module 15, you will have a portfolio artifact for every major BA competency.

DELIVERABLE: Personal Career Transformation Plan
Map your current stage honestly. Identify your two biggest gaps. Name the three portfolio artifacts from this course that will close those gaps. This is a living document — update it after every module.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Deterministic vs Probabilistic: Why AI Changes BA
  UPDATE public.videos SET
    description = 'Traditional systems are deterministic: given the same input, they always produce the same output. AI systems are probabilistic: they produce confident-sounding outputs that are sometimes wrong, biased, or outdated. This fundamental difference changes how a BA specifies requirements, designs acceptance criteria, and validates AI solutions in production.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Deterministic vs Probabilistic: Why AI Changes BA',
      'description', 'AI systems are probabilistic — they produce confident-sounding outputs that are sometimes wrong. This changes how a BA specifies requirements and validates AI solutions.',
      'transcript', 'DETERMINISTIC VS PROBABILISTIC SYSTEMS

THE CORE DISTINCTION

Deterministic system: Given input X, always produces output Y.
  Example: A tax calculator. $50,000 income × 20% tax rate = $10,000. Always.

Probabilistic system: Given input X, produces output Y with confidence C.
  Example: An AI fraud detection model. Transaction flagged as fraud with 87% confidence.
  Sometimes that 87% is wrong.

WHY THIS CHANGES EVERYTHING FOR THE BA

When you specify requirements for a deterministic system, you write:
  "The system shall calculate tax as gross_income × tax_rate."
  Pass/fail is binary. Either it calculates correctly or it does not.

When you specify requirements for an AI system, you must write:
  "The fraud model shall achieve ≥ 92% precision and ≥ 85% recall on the held-out test set."
  "The model shall not have a false positive rate more than 2× higher for any demographic group."
  "The model shall produce an explainability score for every decision above $500 in impact."

You are now specifying: accuracy thresholds, fairness constraints, explainability requirements, fallback behaviour, drift detection, and human override conditions.

THE FIVE NEW REQUIREMENT CATEGORIES FOR AI

1. Accuracy requirements — what does "good enough" look like in numbers?
2. Fairness requirements — does the model perform equitably across demographic groups?
3. Explainability requirements — can the model''s decision be explained to a regulator or end-user?
4. Fallback requirements — what happens when the model is uncertain or unavailable?
5. Drift requirements — how do we detect when the model degrades in production?

PRACTICAL IMPACT ON YOUR WORK

As an AI-augmented BA, you will:
- Write acceptance criteria that include numerical thresholds, not just functional behaviour
- Design UAT that includes adversarial test cases and edge cases
- Specify the human-in-the-loop checkpoints where AI decisions must be reviewed
- Define what "good enough" looks like before the model is trained — not after

DELIVERABLE: AI Impact Assessment
For any AI system you are analysing, complete this five-row table:
| Category | Requirement | Measurement method | Acceptable threshold |
Start with Accuracy. Add one row per category. This becomes the core of your AI Requirements specification.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: The AI-Native Operating Model
  UPDATE public.videos SET
    description = 'An AI-native BA does not just use AI tools — they design explicit validation loops into every AI-assisted workflow. This lesson teaches you to build a Human+AI Operating Model: where you use AI to accelerate, where you use human judgment to validate, and how to document those boundaries so your work is defensible, traceable, and repeatable.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The AI-Native Operating Model',
      'description', 'An AI-native BA designs explicit validation loops into every AI-assisted workflow — knowing where to use AI to accelerate and where human judgment must validate.',
      'transcript', 'THE AI-NATIVE OPERATING MODEL

THE PROBLEM WITH "JUST USE AI"

Many analysts are using AI tools (ChatGPT, Claude, Copilot) to write requirements, summarise stakeholder interviews, and draft process models. This is good — but only if you build in validation loops.

Without validation loops:
- AI hallucinations end up in your requirements document
- AI-generated stakeholder summaries miss the political subtext
- AI-drafted process models omit exceptions the SME mentioned once in passing

The AI-native BA is not the one who uses AI most. It is the one who validates AI outputs most rigorously.

THE THREE-ZONE MODEL

Zone 1 — AI Accelerates (low risk, high volume)
Examples: first-draft user stories from meeting notes, formatting requirements into a template, summarising a 50-page policy document, generating BPMN diagram from a text description.
Validation: Spot-check 20% of outputs against source material.

Zone 2 — Human Validates AI Output (medium risk)
Examples: stakeholder analysis, process gap analysis, acceptance criteria, risk identification.
Validation: Full human review against original sources. AI generates; you verify every claim.

Zone 3 — Human Leads, AI Assists (high risk, judgment-dependent)
Examples: political navigation, conflict resolution, executive communication, transformation framing.
Validation: AI may suggest language; human makes every call. No AI output goes out unchecked.

BUILDING YOUR OPERATING MODEL

Your AI BA Operating Model is a one-page document that maps:
1. Every recurring analysis task you do
2. Which zone it falls in
3. The AI tool you use for that task
4. The validation step you always perform

This makes your AI use traceable, repeatable, and defensible in a governance review.

DELIVERABLE: AI BA Operating Model
Create a table with columns: Task | Zone (1/2/3) | AI Tool | AI Step | Validation Step | Output.
Populate it with the 10 analysis tasks you do most often. This is your personal AI workflow playbook.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Requirements in the Age of AI
  UPDATE public.videos SET
    description = 'AI features require a new vocabulary of requirements that goes beyond traditional functional and non-functional categories. This lesson introduces the AI Requirements Primer: accuracy, fallback, fairness, evaluation, and explainability — and shows you how to write each one so that a developer, data scientist, and regulator can all act on it.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Requirements in the Age of AI',
      'description', 'AI features require new requirement categories: accuracy, fallback, fairness, evaluation, and explainability. This lesson shows you how to write each one so every stakeholder can act on it.',
      'transcript', 'REQUIREMENTS IN THE AGE OF AI

WHY TRADITIONAL REQUIREMENTS FAIL FOR AI

A traditional functional requirement looks like:
"The system shall display a product recommendation when a user views a product page."

This is useless for an AI recommendation engine. It says nothing about:
- How accurate the recommendations must be
- What happens when the model has low confidence
- Whether the recommendations favour certain product categories unfairly
- How the recommendation will be explained to the user
- How you will know if the model degrades over time

AI REQUIREMENT CATEGORIES

1. FUNCTIONAL REQUIREMENTS (What the AI does)
"The recommendation engine shall display 5 products ranked by predicted purchase probability."
Same as always — but make sure you specify: real-time vs. batch, personalised vs. segment-level.

2. ACCURACY REQUIREMENTS (How good is good enough)
"The recommendation engine shall achieve a click-through rate ≥ 8% on the test set."
"Precision@5 shall be ≥ 0.35 before the model goes to production."
Key: agree the metric AND the threshold BEFORE the model is built.

3. FAIRNESS REQUIREMENTS (Equitable outcomes)
"The recommendation engine shall not display recommendations that differ by more than 15% in average price across demographic segments."
Key: identify which groups, which metrics, which thresholds.

4. EXPLAINABILITY REQUIREMENTS (Justifiable decisions)
"For any recommendation, the system shall be able to produce a plain-language reason displayable to the user (e.g., ''Because you bought X, you might like Y'')."
Key: specify who needs the explanation (user, regulator, auditor) — each needs different depth.

5. FALLBACK REQUIREMENTS (Graceful degradation)
"When model confidence is below 0.6, the system shall display best-seller recommendations instead of personalised recommendations."
Key: always specify what happens when the AI cannot produce a reliable output.

6. EVALUATION REQUIREMENTS (Continuous monitoring)
"The model performance shall be re-evaluated monthly. If click-through rate drops below 6% for two consecutive months, the team shall trigger a model review."
Key: define the monitoring cadence, the threshold, and the escalation path.

DELIVERABLE: AI Requirements Primer
Write one requirement in each of the six categories for an AI system you choose. Keep each to 2–3 sentences. This primer is the input to your AI Requirements Package (Module 13).'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Outcomes over Outputs: The Value Mindset
  UPDATE public.videos SET
    description = 'The most dangerous thing a BA can do is deliver exactly what was asked for and still fail. This lesson teaches the outcome mindset: how to identify the real business metric that matters, distinguish it from the output the stakeholder asked for, and reframe the request so you are solving the right problem — before a single requirement is written.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Outcomes over Outputs: The Value Mindset',
      'description', 'The most dangerous BA failure is delivering what was asked and still failing. This lesson teaches you to identify the real metric, distinguish it from the stated output, and reframe the request before writing requirements.',
      'transcript', 'OUTCOMES OVER OUTPUTS: THE VALUE MINDSET

THE TRAP

A stakeholder asks for: "A dashboard showing all customer complaints by category."
You build it. It works. They never use it.

Why? Because what they actually needed was: "A way to reduce complaint resolution time below 48 hours so NPS improves."

The dashboard was an output. The outcome was faster resolution and higher NPS.

You solved the wrong problem — perfectly.

OUTPUTS VS OUTCOMES

Output: a thing the team delivers (a feature, a report, a system, a process).
Outcome: a change in human behaviour or business metric that results from the output.

Examples:
| Output | Outcome |
|--------|---------|
| Customer complaint dashboard | Complaint resolution time < 48h |
| AI chatbot for HR queries | HR ticket volume reduced 40% |
| Automated onboarding workflow | Time-to-productivity for new hires reduced by 2 weeks |
| Fraud detection model | Fraud losses < 0.1% of transaction value |

The BA''s job is to make the outcome explicit BEFORE the output is specified.

THE FIVE-QUESTION REFRAME

When a stakeholder brings you a request, ask these five questions before accepting the brief:

1. "What will change in the business if this works?"
2. "How will we know it worked? What will we measure?"
3. "Who is affected most if this problem is not solved?"
4. "What is the current state of that metric right now?"
5. "What would ''good'' look like 6 months after delivery?"

These questions expose the real outcome. Then you can write requirements that actually move the metric.

SAYING NO TO LOW-VALUE WORK

An AI-augmented BA knows that analysis time is scarce. You cannot analyse everything. The value mindset gives you a principled way to say no: "I''d like to help with this, but I''m not yet clear on which metric it moves. Can we spend 20 minutes clarifying the outcome before I start the analysis?"

This is not pushback. This is professional responsibility.

DELIVERABLE: Value Framing One-Pager
Take any project you are currently working on (or have worked on). Complete this template:
- Requested output:
- Assumed outcome:
- Metric it should move (with current baseline):
- "Good enough" threshold at 90 days:
- Risk if output is delivered but outcome is not achieved:'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 2 — BA Planning, Competencies & the AI Toolkit  (OFFSET 1, order_index = 2)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 1;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M2 chapter not found'; END IF;

  -- Lesson 1: The BA Competency Map
  UPDATE public.videos SET
    description = 'The IIBA defines 13 core BA competencies across analytical thinking, business knowledge, communication, interaction, and leadership. This lesson maps all 13, shows how they cluster, and gives you an honest self-assessment framework so you know exactly where to invest your development energy in this course.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The BA Competency Map',
      'description', 'The IIBA defines 13 core BA competencies. This lesson maps all 13 and gives you an honest self-assessment framework to focus your development.',
      'transcript', 'THE BA COMPETENCY MAP

THE 13 IIBA COMPETENCIES

The IIBA Business Analysis Body of Knowledge (BABOK) defines 13 underlying competencies that support excellent business analysis. They fall into five clusters:

CLUSTER 1 — ANALYTICAL THINKING & PROBLEM SOLVING
1. Creative thinking — generating novel approaches and solutions
2. Decision making — selecting the best course of action with incomplete information
3. Learning — rapidly building domain knowledge in new contexts
4. Problem solving — identifying root causes, not just symptoms
5. Systems thinking — understanding how parts interact within a whole

CLUSTER 2 — BEHAVIOURAL CHARACTERISTICS
6. Ethics — maintaining professional standards and transparency
7. Personal organisation — managing complexity without losing accuracy
8. Trustworthiness — building credibility through consistent follow-through

CLUSTER 3 — BUSINESS KNOWLEDGE
9. Business acumen — understanding how the organisation makes and spends money
10. Industry knowledge — sector-specific regulations, terminology, competitive dynamics

CLUSTER 4 — COMMUNICATION
11. Oral communication — presenting analysis clearly at every organisational level
12. Teaching — enabling others to understand and apply analytical thinking

CLUSTER 5 — INTERACTION
13. Facilitation — guiding groups to shared decisions without imposing your own

WHERE AI-ERA BAs MUST EXCEL

AI tools can accelerate Cluster 1 and 3 skills (analysis, research). They cannot replace Clusters 4 and 5 (communication, facilitation). The highest-paid BAs excel at competencies AI cannot replicate: stakeholder navigation, executive communication, and facilitating ambiguous decisions.

SELF-ASSESSMENT FRAMEWORK

Rate yourself 1–5 on each competency:
1 = No experience
2 = Some exposure, not yet confident
3 = Competent in straightforward situations
4 = Skilled in complex, high-stakes situations
5 = Can coach others and design the approach

Be brutal. Level 3 honest beats Level 5 delusional.

DELIVERABLE: Competency Self-Assessment
Complete the 13-row self-assessment table. Identify your two lowest scores. For each, name one module in this course that directly builds that competency.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Planning the Analysis Approach
  UPDATE public.videos SET
    description = 'Not all analysis engagements are the same. A regulatory compliance project, an AI system implementation, and a process improvement initiative each require a different approach, different deliverables, and different governance. This lesson teaches you to read the engagement context and tailor your analysis approach — producing a BA Plan that sets clear expectations before work begins.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Planning the Analysis Approach',
      'description', 'Different engagements require different analysis approaches, deliverables, and governance. This lesson teaches you to read context and produce a BA Plan that sets expectations before work begins.',
      'transcript', 'PLANNING THE ANALYSIS APPROACH

WHY ONE SIZE DOES NOT FIT ALL

A startup building an MVP needs: lightweight requirements, continuous discovery, frequent pivots.
A bank implementing a new compliance system needs: formal requirements, traceability matrices, sign-off gates.
An enterprise AI deployment needs: accuracy requirements, fairness testing, governance documentation.

If you apply the same analysis approach to all three, you will be wrong in at least two of them.

THE FOUR PLANNING DIMENSIONS

1. APPROACH (how structured will the analysis be?)
- Predictive: requirements defined upfront, change is controlled (waterfall, RUP)
- Adaptive: requirements emerge through iteration (Agile, Scrum)
- Hybrid: structured phases with adaptive delivery within them
Choose based on: how well understood the problem is, how stable the requirements are, how risk-averse the organisation is.

2. DELIVERABLES (what will you produce?)
Match deliverables to stakeholder needs:
- Executive sponsors need: business case, outcomes framing, risk summary
- Development teams need: user stories, acceptance criteria, data models
- Regulators need: traceability matrices, compliance documentation, audit trails
- Operations teams need: process models, training materials, runbooks

3. GOVERNANCE (who approves what, and when?)
Define: who signs off requirements, who resolves conflicts, who owns scope decisions, what the change control process is.

4. TIMELINE (when does analysis need to be complete?)
Work backwards from delivery. Analysis that finishes after development starts is too late.

THE BA PLAN

A BA Plan is a one-to-two page document that answers:
- What is the scope of the analysis?
- What approach will be used and why?
- What deliverables will be produced?
- Who are the key stakeholders and what is their role?
- What are the major milestones?
- What are the top three analysis risks?

DELIVERABLE: BA Plan
Produce a BA Plan for a project you are currently working on or have worked on. If you have no live project, use the case study provided in the course resources.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: The Modern BA AI Toolkit
  UPDATE public.videos SET
    description = 'The modern BA has access to AI tools that can compress days of analysis into hours — but only if you select the right tool for each task. This lesson maps the BA AI toolkit across the analysis lifecycle: discovery, modelling, requirements, documentation, and validation. You will produce a Tool Selection Matrix that becomes your personal AI workflow.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The Modern BA AI Toolkit',
      'description', 'The modern BA toolkit includes AI tools that compress analysis from days to hours. This lesson maps the right tool for each analysis task and produces your Tool Selection Matrix.',
      'transcript', 'THE MODERN BA AI TOOLKIT

THE FIVE ANALYSIS PHASES AND AI TOOLS

PHASE 1 — DISCOVERY
Task: Understanding the problem space, researching context
Tools: Claude / ChatGPT (for domain research, competitor analysis, regulatory summaries), Perplexity AI (for real-time web research), NotebookLM (for synthesising documents)
Key use: "Summarise the key regulatory requirements for AI in financial services in the EU."

PHASE 2 — ELICITATION
Task: Extracting requirements from stakeholders
Tools: AI meeting transcription (Otter.ai, Fireflies), Claude for interview question generation, AI sentiment analysis on meeting recordings
Key use: "Here are the raw notes from a stakeholder interview. Identify the unstated assumptions, the stated requirements, and the key concerns."

PHASE 3 — MODELLING
Task: Process diagrams, data models, use case models
Tools: Claude / ChatGPT (generate BPMN XML from text description), Miro AI (visual collaboration), Lucidchart AI features
Key use: "Generate a BPMN 2.0 XML for this process: customer submits form → system validates → if valid, routes to approver; if invalid, returns error."

PHASE 4 — REQUIREMENTS SPECIFICATION
Task: Writing user stories, acceptance criteria, functional specs
Tools: Claude (first-draft requirements from meeting notes), GitHub Copilot (for technical requirements), custom prompts for BA output templates
Key use: "Convert these 10 bullet points from our workshop into user stories with acceptance criteria in Gherkin format."

PHASE 5 — VALIDATION & REVIEW
Task: Checking requirements for quality, completeness, conflicts
Tools: Claude (requirements review against SMART criteria), checklist-driven prompts, AI-assisted gap analysis
Key use: "Review these acceptance criteria against the INVEST criteria. Identify any that are too vague, untestable, or dependent on another story."

TOOL SELECTION PRINCIPLES

1. AI accelerates generation — humans verify accuracy
2. Never paste PII or confidential data into public AI tools
3. Document which AI tool produced which output (for governance and audit)
4. Treat AI output as a first draft, not a final deliverable

DELIVERABLE: Tool Selection Matrix
Create a table: Task | Phase | AI Tool | Prompt pattern | Validation step. Populate with 10 tasks you do regularly. This is your personal AI workflow reference.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Working with AI Responsibly
  UPDATE public.videos SET
    description = 'AI tools accelerate analysis — but they also introduce risks: hallucination, bias, privacy leakage, and unverifiable provenance. This lesson defines the guardrails every AI-augmented BA must apply: what data you can and cannot share with AI tools, how to validate AI outputs, and how to document your AI use so your work remains auditable and trustworthy.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Working with AI Responsibly',
      'description', 'AI tools introduce risks: hallucination, bias, privacy leakage, and unverifiable provenance. This lesson defines the guardrails every AI-augmented BA must apply to keep their work auditable and trustworthy.',
      'transcript', 'WORKING WITH AI RESPONSIBLY

THE FOUR AI RISKS FOR BAS

RISK 1 — HALLUCINATION
AI tools generate confident-sounding text that is factually wrong. This is most dangerous when:
- Researching regulatory requirements (wrong citations, outdated rules)
- Generating stakeholder data from memory (fabricated names, roles, decisions)
- Producing process models (invented steps the SME never described)
Mitigation: Always verify factual claims against primary sources. Never cite AI output without independent verification.

RISK 2 — BIAS
AI models trained on historical data reflect historical biases. When AI assists with:
- Stakeholder analysis: it may underweight perspectives from underrepresented groups
- Requirement prioritisation: it may favour solutions similar to past projects
- Risk identification: it may miss novel risks that have no historical precedent
Mitigation: Explicitly prompt for underrepresented perspectives. Review AI output for systematic omissions.

RISK 3 — PRIVACY LEAKAGE
Public AI tools (ChatGPT, Claude.ai free tier) may use your input for training. If you paste:
- Customer PII (names, emails, transaction data)
- Commercial-in-confidence information (financial data, unreleased product plans)
- Employee personal data
... you may be violating GDPR, CCPA, or your employer''s data policy.
Mitigation: Use API access with data processing agreements, or enterprise versions with data residency guarantees. Anonymise before pasting.

RISK 4 — TRACEABILITY LOSS
If you cannot explain where a requirement came from, it cannot be validated or defended. AI-generated content has no verifiable source.
Mitigation: Document AI use in your analysis log: "First draft generated by Claude on [date] from meeting notes; validated against original recording on [date]."

THE AI GUARDRAILS CHECKLIST

Before using AI on any analysis task:
☐ Is this data safe to share externally? (If PII or confidential: use anonymised version)
☐ Am I using an enterprise-approved AI tool?
☐ Will I verify every factual claim against primary sources?
☐ Will I document the AI tool, date, and validation step in my analysis log?

DELIVERABLE: AI Usage Guardrails
Write a one-page AI usage policy for your own BA practice. Include: approved tools, data classification rules, validation requirements, and documentation standards.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Communication & Collaboration Foundations
  UPDATE public.videos SET
    description = 'Analysis that cannot be communicated has no value. This lesson covers the communication and collaboration foundations every BA needs: adapting your communication style to different audiences, structuring written analysis for clarity, and establishing a Communication Charter at the start of an engagement to prevent the most common BA failure mode — stakeholder misalignment.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Communication & Collaboration Foundations',
      'description', 'Analysis that cannot be communicated has no value. This lesson covers adapting communication to audiences, structuring written analysis, and establishing a Communication Charter to prevent stakeholder misalignment.',
      'transcript', 'COMMUNICATION & COLLABORATION FOUNDATIONS

THE BA COMMUNICATION FAILURE MODE

The most common BA failure is not bad analysis — it is correct analysis that the wrong people received in the wrong format at the wrong time.

A 40-page requirements document delivered to a C-suite executive who needed a one-page decision brief.
A verbal summary delivered to a developer who needed a testable acceptance criterion.
A weekly status email delivered to a stakeholder who needed a 60-second voice memo.

Right analysis. Wrong format. Wasted effort.

ADAPTING TO YOUR AUDIENCE

Four primary audience types:

EXECUTIVES
- Time: minutes, not hours
- Format: outcome-focused, financially framed, risk-highlighted
- Length: 1-2 pages maximum, lead with the recommendation
- Danger: Jargon, process detail, technical architecture

TECHNICAL TEAMS
- Time: asynchronous, async-first
- Format: precise, unambiguous, testable criteria
- Length: as long as needed for completeness
- Danger: Vagueness, missing edge cases, ambiguous acceptance criteria

BUSINESS SUBJECT MATTER EXPERTS (SMEs)
- Time: limited — they have a day job
- Format: conversational, concrete examples, process language
- Length: what fits in a 30-minute working session
- Danger: Technical jargon, abstract frameworks, theory

EXTERNAL STAKEHOLDERS (customers, regulators, vendors)
- Time: minimal — they are not paid to analyse
- Format: clear, jargon-free, outcome-focused
- Length: the minimum needed to achieve the communication objective
- Danger: Internal language, assumed context, oversharing

STRUCTURING WRITTEN ANALYSIS

The Pyramid Principle (Minto):
1. Start with the answer (recommendation or conclusion)
2. Then the supporting arguments (3–5 key points)
3. Then the evidence underneath each argument

Never bury the recommendation on page 7. Executives read the first paragraph. Everyone else skims.

THE COMMUNICATION CHARTER

A Communication Charter is a one-page agreement established at the start of an engagement:
- Who receives what communications, in what format, on what cadence
- Who is the decision-maker vs. the informed party vs. the consulted party
- How conflicts or scope changes are escalated
- What the single source of truth is for requirements (tool, location, version control)

DELIVERABLE: Communication Charter
Draft a Communication Charter for any current or recent engagement. If no live project, use the BA course case study. Include: stakeholder list, communication format per stakeholder, cadence, and escalation path.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 3 — Stakeholder Analysis & Management  (OFFSET 2, order_index = 3)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 2;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M3 chapter not found'; END IF;

  -- Lesson 1: Stakeholder Mapping & Power Dynamics
  UPDATE public.videos SET
    description = 'Stakeholder mapping is not a one-time exercise — it is a living intelligence system. This lesson teaches the Power/Interest Grid, the Salience Model, and the political landscape map: how to identify who really makes decisions (not just who has the formal title), where power actually sits, and how to use that intelligence to sequence your engagement for maximum impact.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Stakeholder Mapping & Power Dynamics',
      'description', 'Stakeholder mapping is a living intelligence system. This lesson teaches the Power/Interest Grid, the Salience Model, and how to find where power actually sits — not just who has the title.',
      'transcript', 'STAKEHOLDER MAPPING & POWER DYNAMICS

WHY STAKEHOLDER MAPPING FAILS

Most BAs create a stakeholder list, assign RACI tags, and move on. This misses the most important dimension: power dynamics.

Power in organisations rarely follows the org chart. The EA who controls the CEO''s calendar may have more practical power than the VP who attends three boards. The informal technical expert who everyone defers to may have more influence over architecture decisions than the CTO.

If you map the org chart but miss the power dynamics, your engagement strategy will fail.

THE POWER/INTEREST GRID

Axis 1: Power (high/low) — ability to make or block decisions
Axis 2: Interest (high/low) — motivation to be involved in this engagement

QUADRANT STRATEGIES:

High Power / High Interest — MANAGE CLOSELY
These are your critical stakeholders. Engage frequently. Co-create where possible. Never surprise them.

High Power / Low Interest — KEEP SATISFIED
These stakeholders can block you if unhappy but will not engage in detail. Send concise updates. Escalate to them only when decisions require their authority.

Low Power / High Interest — KEEP INFORMED
Often your most engaged participants — SMEs, end users, front-line managers. They give you the best requirements information. Keep them informed and feeling valued.

Low Power / Low Interest — MONITOR
Minimal engagement. Check quarterly. Their interest may increase if the project touches them more directly.

THE SALIENCE MODEL

A richer model for complex stakeholder landscapes. Rates each stakeholder on three attributes:

Power: authority to influence the outcome
Legitimacy: whether their claims are appropriate given their role
Urgency: time pressure on their claims (is this urgent for them right now?)

Stakeholders with all three attributes (power + legitimacy + urgency) are your DEFINITIVE stakeholders. They get your full attention.

FINDING REAL POWER

Ask these questions to discover informal power:
- "Who do people go to when they need a decision made quickly outside the formal process?"
- "Whose objection would stop this project even if the sponsor says yes?"
- "Who has successfully blocked similar initiatives in the past?"

DELIVERABLE: Stakeholder Map & Power/Interest Grid
List every stakeholder for a project you are working on. Place them on the Power/Interest Grid. For your top 5 high-power stakeholders, apply the Salience Model. Document what you discovered about informal power.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Engagement Strategy & Sponsor Alignment
  UPDATE public.videos SET
    description = 'A stakeholder engagement strategy is not a communication plan — it is a relationship roadmap. This lesson shows you how to build genuine sponsor alignment (not just sign-off), tailor your engagement approach per stakeholder, and establish the trust signals that make stakeholders come to you with problems before they become blockers.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Engagement Strategy & Sponsor Alignment',
      'description', 'A stakeholder engagement strategy is a relationship roadmap, not just a communication plan. This lesson covers building genuine sponsor alignment and the trust signals that make stakeholders come to you first.',
      'transcript', 'ENGAGEMENT STRATEGY & SPONSOR ALIGNMENT

THE DIFFERENCE BETWEEN SIGN-OFF AND ALIGNMENT

Sign-off: the sponsor approves the document because you put it in front of them.
Alignment: the sponsor advocates for your analysis because they helped shape it.

Sign-off is fragile. The sponsor who signed off a requirements document in January will distance themselves from it in June when delivery is under pressure. The sponsor who co-created the requirements will defend them.

Your engagement strategy must move every critical stakeholder from sign-off to alignment.

THE ALIGNMENT JOURNEY

Stage 1 — AWARE: stakeholder knows the project exists
Stage 2 — UNDERSTANDING: stakeholder knows what the project aims to achieve
Stage 3 — SUPPORTIVE: stakeholder agrees the project is the right approach
Stage 4 — COMMITTED: stakeholder actively advocates for the project
Stage 5 — LEADING: stakeholder co-creates and champions the initiative

Your stakeholder engagement strategy maps where each critical stakeholder currently sits on this journey and what moves them one stage to the right.

SPONSOR ALIGNMENT: THE FIVE PRACTICES

1. Brief the sponsor before every major decision point — no surprises
2. Use their language, not yours — if the CFO talks about "cost per acquisition," use that term
3. Bring them problems early, not solutions — ask for input before you have all the answers
4. Show them the trade-offs, not just the recommendation — sponsors who see the trade-offs own the decision
5. Follow up within 24 hours of every meeting with a written summary — this builds a shared memory

TAILORED ENGAGEMENT PER STAKEHOLDER

For each high-power stakeholder, define:
- Current alignment stage (1–5)
- Target stage by project milestone
- The one thing that would move them forward
- The one risk that would move them backward
- Your engagement touchpoint plan (frequency, format, owner)

DELIVERABLE: Stakeholder Engagement & Sponsor-Alignment Plan
Extend your stakeholder map from lesson 1. For your top 5 stakeholders, add: current alignment stage, target stage, next engagement action, and risk to alignment.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Executive Communication & Steering Committees
  UPDATE public.videos SET
    description = 'Steering committees make or break projects. The BA who can run a steering committee — setting the agenda, framing decisions clearly, managing the room, and producing a crisply written outcome summary — has a skill that is rare and highly valued. This lesson teaches the structure, the preparation, and the in-room tactics that make steering committees work.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Executive Communication & Steering Committees',
      'description', 'The BA who can run a steering committee effectively has a rare, high-value skill. This lesson covers preparation, agenda structure, in-room tactics, and the outcome summary that executives actually read.',
      'transcript', 'EXECUTIVE COMMUNICATION & STEERING COMMITTEES

WHY STEERING COMMITTEES FAIL

The typical steering committee failure pattern:
1. BA presents a 30-slide deck covering every detail of the analysis
2. Executives ask questions that were answered on slide 4 (they were not looking at slide 4)
3. No clear decision is reached
4. Meeting is re-scheduled
5. Project stalls

The problem is almost never a lack of information. It is a lack of structure.

THE EXECUTIVE COMMUNICATION FORMULA

Executives make decisions. Everything you present must be structured around the decision they need to make.

Structure every executive communication as:
1. SITUATION (2 sentences): What is the current state that requires a decision?
2. COMPLICATION (2 sentences): What has changed or what problem has emerged?
3. QUESTION (1 sentence): What decision does this group need to make today?
4. ANSWER (1 sentence, your recommendation):
5. SUPPORTING EVIDENCE (3–5 bullets): Why this recommendation?
6. TRADE-OFFS (2 bullets): What are you trading off with this recommendation?
7. NEXT STEPS (3 bullets, with owners and dates): What happens next if they approve?

This structure is known as the SCQ (Situation-Complication-Question) model, popularised by McKinsey. It respects executive time by front-loading the decision and recommendation.

STEERING COMMITTEE PREPARATION

Two weeks before:
- Confirm the decision(s) required with the meeting chair
- Identify any stakeholders who need to be pre-briefed (never surprise a power stakeholder in a room)
- Prepare a one-page decision brief for each decision item

One day before:
- Circulate materials (executives must have read time — do not present 40 slides cold)
- Confirm quorum — if a key decision-maker is absent, the decision may need to be deferred

IN THE ROOM: FACILITATION TACTICS

- Time-box each agenda item. State the time explicitly: "We have 10 minutes for this item."
- Separate discussion from decision: "We have two minutes for questions, then I will call for a decision."
- Name the decision explicitly: "The decision is: do we proceed with Option A or Option B?"
- Record the decision in real time on a shared screen — no ambiguity about what was agreed
- Close with next steps, owners, and dates — read them aloud before leaving the room

DELIVERABLE: Executive Briefing / Steering-Committee Pack
Prepare a one-page decision brief using the SCQ structure for a decision that is currently pending on any project. Add a companion agenda for a 60-minute steering committee that would make that decision.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Political Navigation & Influence Without Authority
  UPDATE public.videos SET
    description = 'BAs have no direct authority over the people whose cooperation they need most. This lesson teaches influence without authority: how to build a political landscape map, identify where coalitions and resistance are forming, and use credibility, reciprocity, and framing to move stakeholders without a management mandate.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Political Navigation & Influence Without Authority',
      'description', 'BAs have no authority over those whose cooperation they need. This lesson teaches the political landscape map, coalition building, and how to use credibility, reciprocity, and framing to move stakeholders.',
      'transcript', 'POLITICAL NAVIGATION & INFLUENCE WITHOUT AUTHORITY

THE BA''S POWER PARADOX

The BA is often the most informed person in the room about what needs to happen. But the BA has no direct authority. You cannot tell the VP of Sales to change their process. You cannot order the development team to prioritise your requirements. You cannot instruct the CFO to release funding.

You must influence. Influence without authority is the BA''s most critical soft skill.

UNDERSTANDING ORGANISATIONAL POLITICS

Organisational politics is not a dirty word. It is the system through which decisions get made in organisations with competing interests and limited resources.

Ignoring politics does not make it go away. Ignoring politics means someone else''s political agenda wins.

THE THREE INFLUENCE LEVERS

1. CREDIBILITY
People follow those they trust to be technically sound and personally reliable.
Build it by: delivering what you promise, being accurate more often than not, and acknowledging uncertainty rather than faking confidence.
Spend it sparingly: once you overstate your certainty and are wrong, credibility is hard to rebuild.

2. RECIPROCITY
People return favours. People who feel helped are more likely to help.
Build it by: solving small problems for stakeholders unprompted, sharing useful information before they ask, advocating for their concerns in rooms they are not in.
This is not transactional cynicism — it is genuine service. The reciprocity comes naturally.

3. FRAMING
How you present a proposal shapes how it is received.
For a cost-focused CFO: frame the solution in ROI and payback period.
For a risk-averse COO: frame the solution around risk reduction and control.
For a growth-focused CMO: frame the solution in customer acquisition and revenue.
Same solution. Different frame. Different receptivity.

POLITICAL LANDSCAPE MAPPING

For any complex engagement, map:
- The formal decision authority (who has the title)
- The informal influencers (who shapes opinions before the meeting)
- The coalition already forming (who is aligned to which position)
- The likely resisters (who benefits from the status quo)
- The swing stakeholders (who is undecided and could be won)

Then build your influence strategy around the swing stakeholders. You rarely need to convert resisters — you need enough coalition to move without them.

DELIVERABLE: Political Landscape Map & Influence Strategy
Map the political landscape for a current or recent project. Identify: 1 champion, 1 resister, 2 swing stakeholders. For each swing stakeholder, identify the influence lever most likely to work and your next concrete action.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Conflict, Negotiation & Difficult-Stakeholder Recovery
  UPDATE public.videos SET
    description = 'Conflict is not a failure of the stakeholder management process — it is a signal that something important is at stake. This lesson teaches the BA''s conflict resolution toolkit: when to mediate, when to escalate, how to recover a broken stakeholder relationship, and the negotiation principles that preserve the relationship while resolving the issue.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Conflict, Negotiation & Difficult-Stakeholder Recovery',
      'description', 'Conflict signals that something important is at stake. This lesson covers mediation vs escalation, recovering broken stakeholder relationships, and negotiation principles that resolve issues without destroying relationships.',
      'transcript', 'CONFLICT, NEGOTIATION & DIFFICULT-STAKEHOLDER RECOVERY

CONFLICT AS SIGNAL

Most BAs try to avoid conflict. This is understandable but wrong.

Conflict signals that stakeholders care about the outcome. A meeting where everyone agrees on everything is a meeting where either the stakes are low or people are not being honest.

The BA''s job is not to eliminate conflict — it is to make conflict productive.

THE THREE TYPES OF CONFLICT

1. SUBSTANTIVE CONFLICT: disagreement about facts, data, analysis
This is healthy. Resolve by going back to the evidence. "Let''s agree on the data source and re-run the analysis."

2. PROCESS CONFLICT: disagreement about how work is being done
Resolve by clarifying roles and decision rights. "Who owns this decision? Let''s agree the decision authority before we discuss the options."

3. RELATIONSHIP CONFLICT: interpersonal tension, damaged trust
This is the hardest. It must be addressed directly — relationship conflict bleeds into every other interaction. Ignoring it makes it worse.

MEDIATE OR ESCALATE?

Mediate when:
- Both parties are willing to engage
- You have credibility with both parties
- The issue is within the project scope to resolve

Escalate when:
- One party refuses to engage
- The conflict involves competing organisational priorities above your level
- Resolution requires a decision that only senior leadership can make
- Your own position is in conflict (you cannot mediate your own dispute)

NEGOTIATION: INTERESTS OVER POSITIONS

A position is what someone says they want: "I want requirement X implemented exactly as written."
An interest is why they want it: "I need assurance that the system will not break our compliance process."

Negotiation that focuses on positions creates deadlock.
Negotiation that focuses on interests creates solutions.

Ask: "Help me understand why this is so important to you." The answer reveals the interest. Once you understand the interest, you can often find a solution that satisfies the interest without delivering the stated position.

RECOVERING A BROKEN STAKEHOLDER RELATIONSHIP

Step 1: Request a private conversation (not email, not a meeting with others present)
Step 2: Acknowledge the breakdown without assigning blame: "I think our relationship has become difficult and I want to address that directly."
Step 3: Listen more than you talk. Ask what their experience has been.
Step 4: Agree on one concrete change in how you will work together.
Step 5: Follow through on that one change immediately and visibly.

You cannot recover a relationship in one conversation. You recover it through consistent behaviour over time.

DELIVERABLE: Stakeholder Management Plan + Conflict-Recovery Playbook
Extend your stakeholder documents into a full Stakeholder Management Plan. Add a Conflict-Recovery Playbook with: 1 current conflict or potential conflict you are managing, the type (substantive/process/relationship), your chosen approach, and your next step.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- =============================================================================
-- VERIFY (run immediately after applying)
-- Expected: modules 1, 2, 3 each show filled=5
-- =============================================================================
SELECT
  c.order_index AS module,
  c.title       AS chapter,
  COUNT(v.id)   AS lessons,
  COUNT(*) FILTER (
    WHERE v.translations->'en'->>'transcript' IS NOT NULL
      AND v.translations->'en'->>'transcript' <> ''
  )             AS filled
FROM public.videos v
JOIN public.chapters c ON c.id = v.chapter_id
JOIN public.courses  co ON co.id = c.course_id
WHERE co.title = 'AI Business Analyst & Product Discovery Specialist'
  AND co.curriculum_version = 'ba-v1'
  AND c.order_index IN (1, 2, 3)
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
