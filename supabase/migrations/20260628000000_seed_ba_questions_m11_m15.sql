-- =============================================================================
-- BA Quiz Questions — Modules 11–15
-- Course: AI Business Analyst & Product Discovery Specialist (ba-v1)
-- Modules:
--   11: Data Analysis for BAs: Decision Intelligence   (order_index 11)
--   12: Solution Evaluation, Validation & Acceptance   (order_index 12)
--   13: AI Business Analysis & Decision Intelligence   (order_index 13)
--   14: Regulatory, Risk & Compliance                  (order_index 14)
--   15: Capstone: Discovery-to-Transformation          (order_index 15)
-- 15 questions per module = 75 questions total
-- Apply: paste into Supabase SQL Editor → Run
-- Verify after: SELECT below
-- =============================================================================

DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Business Analyst & Product Discovery Specialist';
  IF cid IS NULL THEN RAISE EXCEPTION 'BA course not found'; END IF;

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 11 — Data Analysis for BAs: Decision Intelligence  (order_index 11)
  -- Competency: ba:data-analysis
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 11 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 11'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 11 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is the key difference between traditional reporting and decision intelligence?', 'Your VP of Product says the weekly report is full of numbers but never tells anyone what to do next.',
   '["Decision intelligence uses prettier charts","Traditional reporting describes what happened; decision intelligence translates data into recommended actions and decisions","Decision intelligence requires AI tools","Traditional reporting is faster to produce"]'::jsonb,
   1, 'Decision intelligence closes the loop between data and action. Traditional reports answer "what happened." Decision intelligence answers "so what, and what should we do about it."', 1, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'A BA is asked to define a north-star metric for a B2B SaaS product. Which of the following is the strongest candidate?', 'Your product team cannot agree on which single metric best reflects whether the product is delivering value.',
   '["Total registered users","Monthly active accounts generating revenue above a threshold","Number of support tickets","Pages viewed per session"]'::jsonb,
   1, 'A north-star metric must reflect core value delivery, not vanity activity. Monthly active accounts generating revenue captures engagement AND value realization — the two key signals for B2B SaaS.', 2, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'A metric tree breaks down a north-star metric into contributing inputs. Why is this important for BAs?', 'The engineering team is not sure which features to prioritize to move the core business metric.',
   '["It creates a visual hierarchy for executive presentations","It identifies which specific inputs drive top-level outcomes, helping prioritize features and initiatives","It replaces the need for user research","It is required for regulatory compliance"]'::jsonb,
   1, 'Metric trees reveal levers: the inputs you can actually move. Without a metric tree, teams optimize features that feel impactful but may not move the north-star metric.', 3, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'Which SQL clause is used to filter aggregate results — for example, showing only product categories with more than 100 orders?', 'You need to write a query that returns only customer segments with average order value above $500.',
   '["WHERE","GROUP BY","ORDER BY","HAVING"]'::jsonb,
   3, 'HAVING filters on aggregated values (like COUNT, SUM, AVG). WHERE filters individual rows before aggregation. Using WHERE with aggregate functions causes a SQL error.', 4, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'A stakeholder asks for a dashboard that shows "everything." What is the BA''s best response?', 'The Head of Sales requests a dashboard with 40 KPIs covering every sales activity metric available.',
   '["Build all 40 KPIs as requested to ensure the stakeholder has full data access","Ask: ''What decision will you make differently based on this data?'' — then design around the 3–5 metrics that inform those decisions","Suggest reducing to 20 metrics as a compromise","Escalate to the BI team to handle scope"]'::jsonb,
   1, 'Dashboard overload leads to analysis paralysis. The BA''s job is to identify what decisions the dashboard must support, then design the minimum set of metrics that informs those decisions clearly.', 5, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'A root-cause analysis reveals that customer churn increased 15% last quarter. Which technique helps systematically identify contributing causes before jumping to conclusions?', 'Leadership is pressuring the team to "fix churn" but no one agrees on the real cause.',
   '["Immediately A/B test a price reduction","Use the 5 Whys or Fishbone Diagram to trace symptoms back to root causes","Analyze only the most recent churned customers","Survey every current customer"]'::jsonb,
   1, 'The 5 Whys and Fishbone Diagram (Ishikawa) are structured root-cause analysis techniques. They prevent teams from treating symptoms instead of causes, which wastes resources on the wrong fixes.', 6, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'What does a "decision brief" deliver that a standard data report does not?', 'The analytics team produces a 30-slide deck of data. The leadership team leaves the meeting still unsure what to decide.',
   '["More detailed data tables","A single recommended action with supporting evidence, trade-offs, and confidence level","More attractive visualizations","A longer time horizon for forecasting"]'::jsonb,
   1, 'A decision brief is purpose-built for decision-making: one recommendation, supporting evidence, explicit trade-offs, and a clear ask. It replaces a data dump with a decision architecture.', 7, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'When visualizing data for an executive audience, which principle is most important?', 'You are presenting a complex regression analysis to a C-suite audience.',
   '["Show all the data so they can form their own conclusions","Design for the decision, not the data — highlight the signal, suppress the noise, and label your recommendation","Include all technical methodology so they trust the analysis","Use the most sophisticated chart type available"]'::jsonb,
   1, 'Executive audiences need signal, not noise. The BA''s role is to pre-process complexity and present the actionable insight. Showing all data shifts cognitive burden onto the audience.', 8, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'What is a cohort analysis, and when should a BA use it?', 'Your product manager wants to understand whether newer customers retain better than customers acquired two years ago.',
   '["An analysis of a survey cohort — use it for NPS tracking","A technique for comparing groups who share a characteristic (e.g. acquisition month) over time — ideal for retention and lifecycle analysis","A statistical method for predicting future revenue","An A/B testing framework"]'::jsonb,
   1, 'Cohort analysis groups users by a shared characteristic (e.g. month they signed up) and tracks them over time. It reveals whether retention, engagement, or conversion is improving across customer vintages.', 9, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'A BA notices that average session duration dropped 20% last month. Before recommending action, what should they investigate first?', 'The drop appears sharply on the same date in both the US and EU regions.',
   '["Immediately conclude that product quality declined","Check if a tracking code change, deployment, or data collection issue caused a measurement error on that date","Recommend a UX redesign","Reduce server response time"]'::jsonb,
   1, 'A sudden, simultaneous drop across regions often signals a measurement error — a tracking code change, data pipeline failure, or tool migration. Always validate data integrity before concluding a real change occurred.', 10, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'What distinguishes a KPI from a metric?', 'Your stakeholder uses "KPI" and "metric" interchangeably. A teammate challenges this.',
   '["KPIs are quantitative; metrics are qualitative","All metrics are KPIs if tracked regularly","A KPI is a metric tied to a specific strategic objective and threshold — a metric is any measurable quantity","KPIs are calculated weekly; metrics are daily"]'::jsonb,
   2, 'All KPIs are metrics, but not all metrics are KPIs. KPIs are strategic: they measure progress toward a specific goal, have a target threshold, and signal whether you are on track.', 11, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'A SQL window function is used to calculate the running total of sales by region. What makes window functions different from GROUP BY?', 'You need each row to show its own sale amount AND the cumulative total for that region.',
   '["Window functions are faster than GROUP BY","Window functions compute aggregates across a set of rows while retaining each individual row — GROUP BY collapses rows into one per group","Window functions only work on dates","GROUP BY is newer and more powerful"]'::jsonb,
   1, 'Window functions (OVER, PARTITION BY, ORDER BY) apply calculations across a window of rows without collapsing them. This allows each row to display both its individual value and an aggregate — impossible with GROUP BY alone.', 12, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'A stakeholder wants a chart showing both monthly revenue trend and the cumulative YTD total on the same view. Which chart type best serves this need?', 'The CFO wants a single view showing month-over-month performance AND the accumulating annual picture.',
   '["Scatter plot","Pie chart for monthly revenue, separate bar chart for YTD","Combo chart: bars for monthly revenue, line overlay for cumulative YTD","Heat map"]'::jsonb,
   2, 'A combo chart (dual encoding) lets viewers read two related but different measures at once. Bars communicate discrete monthly values; a line communicates the continuous cumulative story — the natural fit for this use case.', 13, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'What is the primary risk of presenting correlation as causation in a decision brief?', 'Your analysis shows that customer support contact rate rises whenever marketing spend increases. You are about to recommend cutting marketing.',
   '["It makes the analysis look unsophisticated","Executives may make costly decisions based on a spurious relationship that does not reflect an actual cause","The dashboard will be hard to maintain","The data team will question your methodology"]'::jsonb,
   1, 'Correlation ≠ causation. Both marketing spend and support contacts may rise with company growth — not because marketing causes support load. Misattributing cause leads to incorrect decisions with real financial consequences.', 14, 'ba:data-analysis', '{}'::jsonb),

  (qz, 'Which of the following is the strongest structure for a decision brief presented to a steering committee?', 'You have been asked to present an analysis of three technology options to the executive committee.',
   '["50-page detailed analysis of all options","One-page summary with no data","Context → Key Question → Analysis → Recommendation → Next Steps, all on 1–3 pages with supporting appendix","Data tables and raw exports for the committee to analyze themselves"]'::jsonb,
   2, 'Steering committees need a clear decision framework, not raw data. The pyramid structure (conclusion first, then reasoning) respects their time and cognitive load. Detail lives in the appendix for those who want it.', 15, 'ba:data-analysis', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 12 — Solution Evaluation, Validation & Acceptance  (order_index 12)
  -- Competency: ba:solution-eval
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 12 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 12'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 12 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'When evaluating solution options, a BA''s primary job is to do which of the following?', 'Three vendors have submitted proposals with different pricing, capabilities, and implementation timelines.',
   '["Select the cheapest option","Select the most technologically advanced option","Evaluate each option against defined business requirements, constraints, and strategic fit — then present a structured recommendation","Let the technical team decide based on architecture preference"]'::jsonb,
   2, 'BAs evaluate options against requirements and constraints, not personal preference or vendor prestige. The structured recommendation connects each option''s trade-offs to business outcomes — giving decision-makers what they need.', 1, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'What is a business case, and what must it demonstrate to win executive approval?', 'Your initiative has been described as "strategically important" for two years but has never received funding.',
   '["A technical specification of the proposed solution","A document that demonstrates the problem is real, quantifies the expected ROI or strategic benefit, estimates costs and risks, and recommends a preferred option","A project plan with Gantt chart","A market analysis of competitor products"]'::jsonb,
   1, 'A business case makes the investment argument: it connects the problem to cost, the solution to measurable benefit, and the do-nothing scenario to risk. Without it, "strategic importance" remains an opinion.', 2, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'How should a BA calculate ROI for a process automation initiative?', 'Automating manual invoice processing will eliminate 2,400 hours of manual work per year at an average cost of $45/hour.',
   '["ROI = (Annual savings − Implementation cost) / Implementation cost × 100","ROI = Annual savings only","ROI = Total project budget / Number of users","ROI = Number of automated tasks / Total tasks"]'::jsonb,
   0, 'ROI = (Net Benefit / Cost) × 100. For this initiative: annual savings = 2,400 × $45 = $108,000. If implementation costs $80,000, ROI = ($108,000 − $80,000) / $80,000 × 100 = 35%. This is the standard finance formula.', 3, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'What is User Acceptance Testing (UAT), and who is primarily responsible for executing it?', 'Your development team has passed all unit and integration tests, but the project sponsor is asking whether the system is ready to go live.',
   '["UAT is a technical test run by QA engineers to find bugs","UAT is validation by business users that the system meets their requirements and is fit for purpose — executed by business stakeholders or their designated representatives","UAT is a security scan run before deployment","UAT is a performance test run by the infrastructure team"]'::jsonb,
   1, 'UAT answers the business question: "Does this work for us?" It is executed by business users (or their proxies), not technical teams. Only business users can confirm that the solution satisfies their actual working needs.', 4, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'During UAT, testers discover that a critical report is missing a filter the business uses daily. How should the BA handle this?', 'The project is two weeks from go-live and this gap was never documented in the original requirements.',
   '["Proceed to go-live anyway — it can be fixed post-launch","Immediately cancel the project","Log it as a defect versus a change request — defects (missing agreed requirement) are fixed before launch; change requests (new scope) are deferred unless critical","Let the development team decide"]'::jsonb,
   2, 'BAs triage UAT findings: defects (something that breaks an agreed requirement) are go-live blockers. Change requests (new requirements not in scope) are deferred. Misclassification delays projects unnecessarily or risks a broken launch.', 5, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'What is the "do-nothing" option in solution evaluation, and why must it always be included?', 'An executive asks why the business case includes a "status quo" analysis since they have already decided to move forward.',
   '["It is a regulatory requirement for all projects","It provides the baseline against which all options are measured — without it, the cost of action cannot be justified against the cost of inaction","It is included only when the project is at risk of cancellation","It allows the team to delay the decision"]'::jsonb,
   1, 'The do-nothing baseline quantifies what happens if the organization does nothing. Without it, ROI cannot be calculated and the urgency of acting cannot be argued. Decision-makers need to see the cost of inaction.', 6, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'A solution has been live for 90 days. How does a BA determine whether it delivered the promised value?', 'The system was launched on time and within budget. The COO asks whether it was worth it.',
   '["Check if users are happy","Compare actual post-implementation KPIs to the baseline metrics defined in the business case","Count the number of features delivered","Measure user adoption rate alone"]'::jsonb,
   1, 'Value realization requires comparing actual outcomes to the pre-defined success metrics from the business case. Without a baseline and measurement plan, you cannot objectively answer whether the investment paid off.', 7, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'What distinguishes a functional requirement from a non-functional requirement in solution validation?', 'A stakeholder says the system "works" but users are complaining it is too slow.',
   '["Functional = UI features; non-functional = backend logic","Functional = what the system does (capabilities); non-functional = how it performs (speed, security, reliability, scalability)","Non-functional requirements are optional","Functional requirements are tested by developers only"]'::jsonb,
   1, 'Slowness is a non-functional requirement violation. UAT must cover both: functional tests confirm capabilities work; non-functional tests confirm the system meets performance, security, and reliability standards that often matter just as much.', 8, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'What is a post-implementation review (PIR), and when should it occur?', 'Three months after a major CRM migration, the project team has disbanded and no lessons have been captured.',
   '["A technical audit run by IT security after go-live","A structured review held 30–90 days after go-live to assess whether benefits were realized, what went well, and what should be improved in future projects","A review of the project budget after financial close","A customer satisfaction survey sent on launch day"]'::jsonb,
   1, 'A PIR is a learning investment. Conducted 30–90 days post-launch (after the dust settles), it compares results to the business case, captures lessons, and feeds them into the organization''s project playbook. Skipping it repeats expensive mistakes.', 9, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'A solution evaluation matrix compares three vendor options across multiple criteria. What must the BA define before scoring?', 'The evaluation team starts arguing about which vendor is better without a structured framework.',
   '["The team''s personal preferences for each vendor","The weighted criteria (requirements, risk, cost, strategic fit) aligned to stakeholder priorities before any scoring begins","The vendor with the most features","The implementation timeline"]'::jsonb,
   1, 'Weighted criteria must be defined before scoring to prevent bias. If criteria weights are decided after seeing the options, evaluators unconsciously weight criteria in favor of their preferred vendor — invalidating the evaluation.', 10, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'A business case requires a sensitivity analysis. What does this test?', 'The CFO asks what happens to the ROI if the adoption rate is 30% lower than projected.',
   '["Whether the technology is scalable","How the ROI or outcome changes when key assumptions vary — identifying which variables most affect the investment decision","Whether the vendor is financially stable","How long implementation will take"]'::jsonb,
   1, 'Sensitivity analysis stress-tests assumptions. It answers: "If adoption is 30% lower, is the investment still worthwhile?" This reveals which assumptions are make-or-break and which variables the team should actively manage.', 11, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'Who should sign off on UAT entry criteria before testing begins?', 'The project team is debating whether to start UAT when only 80% of features have been deployed.',
   '["The project manager alone","The development team lead","The BA, business sponsor, and key stakeholders — ensuring everyone agrees on what ''ready for UAT'' means before investing in test execution","The QA manager only"]'::jsonb,
   2, 'UAT entry criteria (what must be true before testing starts) must be signed off by the business stakeholders who will execute UAT. Starting UAT on an incomplete build wastes tester time and damages confidence.', 12, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'What does "total cost of ownership" (TCO) mean in solution evaluation?', 'A vendor quotes $50,000 for implementation. A stakeholder wants to approve based on this number alone.',
   '["The initial purchase or implementation price","All costs over the solution''s lifetime: license, implementation, training, maintenance, integration, support, and eventual decommissioning","Only recurring license fees","The project manager''s budget allocation"]'::jsonb,
   1, 'TCO is the full financial story. A $50K implementation may carry $200K in annual licenses and $30K in support costs. Without TCO, stakeholders make investment decisions with incomplete financial information.', 13, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'A project has delivered all agreed features but the business sponsor says the project "failed." What is the most likely explanation?', 'The system was built exactly to specification, but adoption is near zero six months after launch.',
   '["The developers wrote poor-quality code","The requirements were technically correct but the BA failed to capture the actual business outcomes the sponsor needed — output was delivered, but value was not","The PM failed to manage the timeline","The sponsor changed their mind arbitrarily"]'::jsonb,
   1, 'Delivering features is not the same as delivering value. If adoption is zero, the system solved the wrong problem, was too hard to use, or lacked the change management needed for adoption. BAs must tie requirements to outcomes, not just outputs.', 14, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'What is the BA''s role during solution implementation — after requirements have been handed to development?', 'A developer encounters an ambiguous requirement mid-sprint and the BA is unavailable.',
   '["The BA has no role once requirements are documented","The BA serves as the requirements authority throughout delivery: answering clarifications, managing change requests, validating solutions against original intent, and supporting UAT","The BA should manage the development timeline","The BA should rewrite requirements during implementation"]'::jsonb,
   1, 'Requirements work does not end at hand-off. During delivery, ambiguities surface, scope changes emerge, and validation is needed. The BA is the bridge between original intent and delivered solution throughout the entire lifecycle.', 15, 'ba:solution-eval', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 13 — AI Business Analysis & Decision Intelligence  (order_index 13)
  -- Competency: ba:ai-analysis, ba:ai-prompting
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 13 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 13'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 13 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What does the "AI Requirement Ladder" describe?', 'A data scientist tells your BA team to "just send us the requirements" for a new ML model, but you realize the team has never written AI requirements before.',
   '["The process for deploying AI models to production","A hierarchy of requirement types specific to AI systems: data requirements, model behavior requirements, performance thresholds, fairness constraints, and monitoring requirements","A technical architecture pattern for AI infrastructure","A vendor selection framework for AI tools"]'::jsonb,
   1, 'AI systems require a different requirements hierarchy than traditional software. The Ladder captures each layer — from data quality to explainability to drift monitoring — that must be specified for an AI system to be reliably deployed and maintained.', 1, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'A BA is writing requirements for a loan approval AI model. Which requirement type is most critical to include that would NOT appear in a traditional software project?', 'The compliance team flags that the AI model must not discriminate based on protected attributes.',
   '["Performance response time requirements","Fairness and bias constraints defining acceptable disparity thresholds across demographic groups","UI color and layout specifications","Number of API calls per minute"]'::jsonb,
   1, 'AI systems can encode discriminatory patterns from biased training data. Fairness constraints — explicitly specifying acceptable disparity levels — are unique to AI and must be quantified as hard requirements, not aspirational guidelines.', 2, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'What is a "human-in-the-loop" decision system, and when should a BA specify it?', 'Your organization is considering an AI system that would auto-approve supplier contracts under $50,000.',
   '["A system where every decision is made by a human regardless of AI output","A design pattern where AI makes a recommendation or preliminary decision, and a human reviews and approves before action is taken","A system where humans train the AI model","A backup system when AI is unavailable"]'::jsonb,
   1, 'Human-in-the-loop is the right pattern when the cost of an AI error is high, decisions have regulatory implications, or low volume makes full automation unnecessary. BAs must specify when human review is mandatory based on risk tolerance and compliance requirements.', 3, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'An AI recommendation system is producing outputs that stakeholders cannot explain to customers. What requirement gap does this reveal?', 'Customers are rejecting AI-generated product recommendations because they cannot understand why they were recommended.',
   '["The model needs more training data","The UI needs to be redesigned","An explainability requirement was missing — the system must be able to generate human-understandable reasoning for its outputs","The integration with the CRM is broken"]'::jsonb,
   2, 'Explainability is a first-class AI requirement. In customer-facing or regulated contexts, stakeholders must be able to explain AI outputs. If this requirement is not specified upfront, it is often architecturally expensive to add later.', 4, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'What is model drift, and why does a BA need to specify monitoring requirements for it?', 'Three months after launch, an AI churn prediction model''s accuracy has dropped from 87% to 61% without any code changes.',
   '["Model drift is a technical bug that developers must fix independently","Model drift occurs when the real-world data distribution changes and the model''s performance degrades — BAs must specify monitoring thresholds and retraining triggers in requirements","Model drift is a security vulnerability","Model drift only affects large language models"]'::jsonb,
   1, 'AI models degrade when the world changes — new customer behaviors, market shifts, seasonal patterns. Monitoring requirements must specify drift detection metrics, alert thresholds, and retraining protocols. Without these, production AI silently fails.', 5, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'A BA is asked to use AI to synthesize 200 stakeholder interview transcripts into key themes. What critical validation step must follow the AI output?', 'You use an LLM to summarize 200 transcripts into 10 themes and plan to share them directly with the executive team.',
   '["Share the AI output directly — AI does not make errors at this task","Validate the themes against a sample of original transcripts to check for hallucinated themes, missed voices, or disproportionate emphasis","Ask the AI to validate its own output","Ask a colleague to read the summary"]'::jsonb,
   1, 'LLMs can hallucinate themes that sound plausible, over-represent frequently mentioned but less important topics, or miss critical minority viewpoints. The BA must spot-check AI synthesis against primary sources before it becomes an organizational input.', 6, 'ba:ai-prompting', '{}'::jsonb),

  (qz, 'Which of the following is the strongest prompt structure for asking an AI to draft acceptance criteria?', 'You want an AI assistant to generate acceptance criteria for a customer notification feature.',
   '["''Write acceptance criteria for notifications''","''You are a senior BA. For the following user story: [story], write 5 acceptance criteria in Given/When/Then format. Ensure each criterion is independently testable. Context: [product domain].''","''Make acceptance criteria for my feature''","''List requirements for sending notifications to users''"]'::jsonb,
   1, 'Effective AI prompts specify role, task, format, constraints, and context. A vague prompt produces generic output. A structured prompt with role framing, user story input, format specification (G/W/T), quality constraint (independently testable), and domain context produces usable output.', 7, 'ba:ai-prompting', '{}'::jsonb),

  (qz, 'How should a BA approach an AI investigation when an AI model is producing unexpected outputs in production?', 'The customer scoring model is flagging healthy accounts as high-risk, causing unnecessary account reviews.',
   '["Immediately retrain the model with new data","Investigate systematically: audit the input data for anomalies, check if the data pipeline changed, review recent deployment changes, test edge cases, and compare outputs to expected behavior before recommending any fix","Blame the data science team","Replace the AI model with a rule-based system"]'::jsonb,
   1, 'AI failure investigation is structured, not reactive. Jumping straight to retraining without understanding the root cause often fails or masks the real problem. BAs must treat AI failures like incident investigations: hypothesis → evidence → diagnosis → recommendation.', 8, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'What is AI governance, and what is the BA''s role in defining it?', 'Your organization has deployed 12 AI systems over the past year with no consistent ownership, monitoring, or review process.',
   '["AI governance is the IT team''s responsibility — BAs are not involved","AI governance is the policies, processes, and accountability structures that ensure AI systems are used responsibly and effectively — BAs define governance requirements: ownership, monitoring schedules, human escalation paths, retraining triggers, and audit trails","AI governance is a one-time legal review","AI governance only applies to regulated industries"]'::jsonb,
   1, 'BAs are critical governance architects. They translate regulatory, ethical, and operational expectations into concrete requirements: who owns each model, how it is monitored, when humans must intervene, and how decisions are audited. Without this, AI deployment is ungoverned risk.', 9, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'A BA is drafting an executive AI transformation roadmap. What should it prioritize first?', 'A new CEO wants to "become an AI company" and asks the BA to draft a 3-year roadmap.',
   '["List every possible AI use case across the organization","Prioritize AI use cases by impact and feasibility — starting with high-impact, high-feasibility opportunities that build organizational capability and deliver early wins","Recommend replacing all existing systems with AI","Focus exclusively on cost reduction use cases"]'::jsonb,
   1, 'Transformation roadmaps must be sequenced strategically. Early wins build organizational AI maturity, trust, and capability. A "boil the ocean" approach overwhelms organizations and delays value. The 2×2 impact/feasibility matrix is the BA''s most powerful prioritization tool.', 10, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'What does "hallucination" mean in the context of AI-generated requirements artifacts, and how does a BA mitigate it?', 'An AI tool generates a detailed requirements document that references specific regulatory codes you cannot find in any official source.',
   '["Hallucination means the AI tool crashed","AI hallucination is when a model generates plausible-sounding but factually incorrect content — BAs mitigate it by grounding AI outputs with verified sources and spot-checking all generated artifacts against authoritative references","Hallucination only affects image generation models","AI hallucination is resolved by using a newer model version"]'::jsonb,
   1, 'LLMs generate fluent, confident-sounding text even when fabricating facts. In requirements work, this is dangerous: a hallucinated regulatory reference can cause compliance failures. BAs must treat AI as a capable first-drafter, not an authoritative source.', 11, 'ba:ai-prompting', '{}'::jsonb),

  (qz, 'An AI system deployed in HR makes promotion recommendations. What specific requirement must the BA include to ensure organizational accountability?', 'The AI system has been making promotion recommendations for 6 months, but no one can explain why specific individuals were selected or bypassed.',
   '["A requirement for weekly AI status reports","An audit trail requirement: every AI recommendation must log inputs, outputs, model version, timestamp, and the human decision taken — so every outcome can be traced and reviewed","A requirement for AI to explain itself in plain English","A performance requirement for response time under 2 seconds"]'::jsonb,
   1, 'In high-stakes HR decisions, audit trails are not optional — they are legally and ethically mandatory. BAs must specify that every AI recommendation is logged with full decision provenance. Without this, the organization cannot investigate complaints, demonstrate fairness, or comply with employment law.', 12, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'What is the difference between AI-assisted analysis (ba:ai-analysis) and AI prompt engineering (ba:ai-prompting)?', 'Your manager asks whether you are "using AI" and you realize these are two different skills.',
   '["They are the same skill with different names","AI-assisted analysis is applying AI tools to produce BA artifacts (requirements, process maps, stakeholder summaries). AI prompt engineering is designing and validating effective prompts and critically checking AI outputs for errors, bias, and hallucination","AI-assisted analysis is for data scientists; AI prompting is for BAs","AI prompt engineering is a technical skill outside the BA role"]'::jsonb,
   1, 'These are distinct competencies. Analysis applies AI to do BA work. Prompting is the craft of directing AI effectively AND critically validating its output. Both are essential — a BA who can apply AI but not validate its output is dangerous.', 13, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'A BA is asked to define "AI readiness requirements" for a new data pipeline. What should be included?', 'The data science team says they cannot build a reliable model because the data feeding it is inconsistent.',
   '["Hardware specifications for the AI server","Data quality requirements: completeness thresholds, freshness SLAs, schema stability standards, labeling consistency requirements, and privacy/PII handling specifications","Only the schema documentation","The AI vendor''s API documentation"]'::jsonb,
   1, 'AI models are only as good as their training data. BAs must specify data requirements that the upstream pipeline must meet: completeness, timeliness, consistency, labeling accuracy, and PII governance. Skipping this is the most common cause of AI project failure.', 14, 'ba:ai-analysis', '{}'::jsonb),

  (qz, 'You have used AI to generate a full set of user stories. Before presenting them to the stakeholder, what is your responsibility?', 'You generated 50 user stories in 20 minutes using an AI assistant and saved significant time.',
   '["Present them as-is — the time savings justify the risk","Review each story for accuracy, completeness, and alignment with actual stakeholder needs — add your BA judgment, remove duplicates, flag gaps, and correct any errors before presenting","Ask the stakeholder to review them without your own review","Have the developer team review them instead of you"]'::jsonb,
   1, 'Speed does not transfer responsibility. AI-generated artifacts are a starting point, not a finished product. The BA owns the output that goes to stakeholders — including errors, gaps, and hallucinations in AI-generated content. Review is not optional.', 15, 'ba:ai-prompting', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 14 — Regulatory, Risk & Compliance  (order_index 14)
  -- Competency: ba:compliance
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 14 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 14'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 14 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is a Regulatory Impact Assessment (RIA), and when should a BA conduct one?', 'Your organization is launching a new digital lending product in three countries simultaneously.',
   '["A financial audit conducted after launch","A structured analysis identifying which regulations apply to a business initiative, what compliance requirements they impose, and how the solution design must accommodate them — conducted before design begins","A legal review conducted by the compliance team without BA involvement","A risk register update conducted at project close"]'::jsonb,
   1, 'The RIA is the BA''s first compliance move on any regulated initiative. Conducting it at the start prevents designing a solution that must be entirely rearchitected later to meet regulatory requirements discovered in UAT.', 1, 'ba:compliance', '{}'::jsonb),

  (qz, 'Under GDPR, what is "data minimization" and how does it affect requirements?', 'Your marketing team wants to collect 40 fields of customer data at sign-up to enable future personalization.',
   '["Storing data in compressed format","The principle that only data strictly necessary for the specified purpose should be collected — requirements must specify exactly what data is collected and justify each field against its stated purpose","A database performance optimization technique","A requirement to delete data after 30 days"]'::jsonb,
   1, 'Data minimization is a GDPR core principle. BAs must challenge every data collection requirement: "Is this field necessary for the stated purpose?" Collecting unnecessary PII creates both legal exposure and breach risk without corresponding business value.', 2, 'ba:compliance', '{}'::jsonb),

  (qz, 'What is qualitative vs. quantitative risk assessment, and when should each be used?', 'Your risk register has been flagged by auditors as "too subjective" because it uses High/Medium/Low ratings without numerical basis.',
   '["Qualitative = about people; quantitative = about systems","Qualitative assessment uses likelihood/impact ratings (H/M/L) for rapid prioritization when data is insufficient; quantitative uses numerical probability and financial impact when data and time allow — use both as the risk profile warrants","Qualitative is always preferred","Quantitative is required only for financial risks"]'::jsonb,
   1, 'Both approaches have their place. Qualitative is faster and works when precise data is unavailable. Quantitative (expected value = probability × impact) enables financial prioritization. Mature risk management uses qualitative for triage and quantitative for high-stakes decisions.', 3, 'ba:compliance', '{}'::jsonb),

  (qz, 'What is a control, and what are the three types a BA must understand?', 'An auditor asks your project team to document the controls that prevent unauthorized data access in the new system.',
   '["A software testing technique","A safeguard that reduces the likelihood or impact of a risk — types are: preventive (stop the risk from occurring), detective (identify it when it occurs), and corrective (remediate after it occurs)","A project management approval gate","A regulatory fine for non-compliance"]'::jsonb,
   1, 'Controls are the mechanism by which risks are managed. BAs must specify all three types in system requirements: preventive (e.g., role-based access), detective (e.g., audit logs, anomaly alerts), and corrective (e.g., incident response procedures).', 4, 'ba:compliance', '{}'::jsonb),

  (qz, 'A BA is presenting a risk decision to an executive. The risk has a 5% probability of occurring and a $2,000,000 financial impact. What is the expected value, and what does this mean for prioritization?', 'The CFO asks whether this risk warrants a $75,000 mitigation investment.',
   '["$2M — full impact should always be budgeted","$100,000 expected value (5% × $2M) — the mitigation cost of $75,000 is below expected value, so it is financially justified","$25,000 — too small to warrant attention","Cannot be calculated without more data"]'::jsonb,
   1, 'Expected Value = Probability × Impact = 0.05 × $2,000,000 = $100,000. A $75,000 mitigation is a positive investment: you spend $75K to avoid an expected loss of $100K. This is how BAs make financially defensible risk recommendations to executives.', 5, 'ba:compliance', '{}'::jsonb),

  (qz, 'What is the right response when a project scope change increases regulatory risk during delivery?', 'Mid-project, the team adds a feature that requires storing credit card numbers in a new database that was not in the original compliance scope.',
   '["Proceed with the change — it is a small feature addition","Note it in the project log","Trigger a formal change request, update the Regulatory Impact Assessment, ensure PCI-DSS compliance requirements are added to scope, and obtain sign-off from the compliance team before implementation","Ask the developer to handle compliance independently"]'::jsonb,
   2, 'Any scope change that introduces new regulatory exposure must trigger a compliance re-assessment. PCI-DSS has strict requirements for cardholder data environments. Proceeding without compliance sign-off can expose the organization to multi-million dollar fines and audit failures.', 6, 'ba:compliance', '{}'::jsonb),

  (qz, 'What does "right to erasure" (also known as "right to be forgotten") require in a system design context?', 'A customer requests deletion of all their personal data under GDPR. Your system has no erasure capability.',
   '["Only applies to social media platforms","A regulatory requirement under GDPR where organizations must be able to delete all PII linked to an individual upon request — BA must specify data erasure workflows, identify all data stores, and design deletion confirmation mechanisms","A requirement to archive data rather than delete it","Only applies to EU citizens living in the EU"]'::jsonb,
   1, 'Right to erasure is a systemic BA requirement. You must map every location where PII is stored (database, backups, logs, third-party integrations), specify deletion processes for each, and design audit confirmation. BAs who miss this create a liability that surfaces only when a customer exercises the right.', 7, 'ba:compliance', '{}'::jsonb),

  (qz, 'What is "assurance" in the context of internal controls, and how does it differ from compliance?', 'The external auditor says your project has compliance documentation but no assurance framework.',
   '["Assurance and compliance are the same thing","Compliance is having the right controls in place; assurance is independently verifying that controls are operating effectively — assurance requires testing, evidence collection, and reporting that controls actually work","Assurance is only for financial audits","Assurance is a legal requirement under GDPR"]'::jsonb,
   1, 'Compliance = having controls. Assurance = proving they work. BAs must specify not just what controls are required, but how they will be tested and evidenced. An organization can be technically compliant while having controls that do not function as designed.', 8, 'ba:compliance', '{}'::jsonb),

  (qz, 'An executive pressures a BA to exclude a known regulatory risk from the project risk register because "it will delay approval." What should the BA do?', 'A compliance officer flagged that the new payment processing flow may violate PSD2 regulations in the EU.',
   '["Exclude it to keep the project moving","Agree to document it separately, outside the formal risk register","Maintain the risk in the register and escalate the situation through appropriate channels — withholding material compliance information from decision-makers is professionally and potentially legally unacceptable","Immediately report it to regulators"]'::jsonb,
   2, 'BAs must maintain professional integrity. Hiding material compliance risk from decision-makers is a serious professional and ethical failure. The BA''s job is to surface risk, not suppress it. If stakeholders override the BA''s documented recommendation, that is their accountable decision — not the BA''s responsibility to suppress.', 9, 'ba:compliance', '{}'::jsonb),

  (qz, 'What specific AI governance requirement must a BA specify for AI systems operating in a regulated industry (e.g. financial services)?', 'A banking regulator asks your organization to demonstrate that your AI credit scoring model can be audited and that its decisions can be explained to customers who are declined.',
   '["A fast response time requirement","Model explainability requirements, audit trail specifications, human override capability, and regular bias testing schedules — all documented before deployment","A requirement to retrain the model quarterly","A security scanning requirement"]'::jsonb,
   1, 'Regulated industries have elevated AI governance requirements. BAs must specify: explainability for adverse decisions, immutable audit logs, human escalation paths, bias testing frequency, and model version tracking. Without these requirements documented upfront, the system cannot be deployed in a regulated environment.', 10, 'ba:compliance', '{}'::jsonb),

  (qz, 'What is a Privacy Impact Assessment (PIA) / Data Protection Impact Assessment (DPIA), and when is it mandatory under GDPR?', 'Your project introduces real-time behavioral tracking of users on a public platform.',
   '["A security penetration test","A structured assessment required when processing is likely to result in high risk to individuals — mandatory for new technologies, large-scale PII processing, or systematic monitoring — it evaluates privacy risks and determines mitigation measures","A one-time legal review at company founding","An optional best practice recommended for large enterprises"]'::jsonb,
   1, 'Under GDPR Article 35, a DPIA is mandatory for high-risk processing — including systematic monitoring, large-scale sensitive data processing, or novel technologies. BAs must identify when a DPIA is required and ensure it is conducted before processing begins, not after.', 11, 'ba:compliance', '{}'::jsonb),

  (qz, 'When mapping regulatory requirements to system requirements, what is the BA''s most critical output?', 'The compliance team has produced a 200-page regulatory document. The development team cannot figure out what they actually need to build.',
   '["A summary of the regulation for executives","A traceability matrix that maps each regulatory obligation to specific system requirements, so that each requirement can be tested and evidence of compliance collected — enabling audit readiness","A project timeline with compliance milestones","A list of fines for non-compliance"]'::jsonb,
   1, 'The regulatory-to-requirements traceability matrix is the BA''s core compliance artifact. It ensures every obligation is implemented, testable, and evidenced — making the difference between a system that is technically compliant and one that can prove compliance in an audit.', 12, 'ba:compliance', '{}'::jsonb),

  (qz, 'A risk response strategy of "acceptance" means the organization has decided to do what?', 'After analyzing a low-probability, low-impact risk, the project sponsor decides not to invest in mitigation.',
   '["Ignore the risk without documenting it","Eliminate the risk entirely","Accept the potential consequences of the risk without mitigation — the expected cost of mitigation exceeds the expected cost of the risk materializing","Transfer the risk to an insurance provider"]'::jsonb,
   2, 'Risk acceptance is a legitimate strategy — not negligence — when the cost of mitigation exceeds the expected loss. But it must be documented explicitly: who accepted the risk, why, and on what date. Undocumented acceptance looks like oversight in an audit.', 13, 'ba:compliance', '{}'::jsonb),

  (qz, 'What is the role of the BA in an executive risk decision meeting?', 'The CEO must decide whether to proceed with a high-risk market entry with significant regulatory uncertainty.',
   '["Present all data without a recommendation — executives should decide alone","Provide a structured risk analysis: probability, impact, expected value, mitigation options and their costs, and a recommended risk response — giving executives a decision architecture rather than a data dump","Attend as an observer only","Recommend the safest option regardless of business context"]'::jsonb,
   1, 'BAs serve executives by structuring the decision, not just presenting data. A risk decision requires: quantified expected loss, mitigation options with costs, and a recommendation. The executive makes the call — but the BA enables an informed, defensible decision.', 14, 'ba:compliance', '{}'::jsonb),

  (qz, 'What is "vendor risk" in a compliance context, and how must a BA address it in solution requirements?', 'Your new HR system will be hosted by a third-party SaaS vendor who will process EU employee data.',
   '["Vendor risk is unrelated to BA requirements work","Vendor risk is the compliance exposure created when a third party processes sensitive data or performs regulated activities on your behalf — BAs must specify contractual requirements: DPA/GDPR data processing agreements, right to audit, subprocessor controls, breach notification SLAs, and data deletion clauses","Vendor risk is solely the procurement team''s concern","Vendor risk only applies to financial services vendors"]'::jsonb,
   1, 'Under GDPR, you cannot outsource compliance responsibility to vendors — you remain the data controller. BAs must specify contractual and technical compliance requirements for vendors: data residency, processing restrictions, audit rights, incident notification obligations, and deletion guarantees.', 15, 'ba:compliance', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 15 — Capstone: Discovery-to-Transformation  (order_index 15)
  -- Competency: mixed (integrative capstone)
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 15 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 15'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 15 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'In the Discovery phase of a transformation engagement, what is the BA''s primary deliverable?', 'You have been given access to 30 stakeholder interviews, 5 years of process data, and the current operating model documentation.',
   '["A prioritized backlog of features","A diagnosis: a clear articulation of the root-cause business problem, the current-state pain points, and the strategic opportunity — supported by evidence from multiple sources","A prototype of the proposed solution","A vendor selection recommendation"]'::jsonb,
   0, 'Discovery is about establishing shared understanding of the problem. The BA synthesizes multiple evidence sources into a clear, evidence-based diagnosis. Without this, any solution is built on assumption. Discovery prevents the most expensive mistake: solving the wrong problem.', 1, 'ba:product-discovery', '{}'::jsonb),

  (qz, 'When moving from Discovery to Architecture & Strategy, what question does the BA help answer?', 'You have completed discovery and confirmed the problem. Stakeholders now ask "so what do we do about it?"',
   '["Which vendor has the best case studies","What is the minimum viable architecture that addresses the root-cause problem while remaining within feasibility constraints — people, technology, process, and regulatory","What features should the UI have","Which team should own the project"]'::jsonb,
   1, 'Architecture & Strategy translates the diagnosis into a direction. The BA helps frame the solution architecture: what must change (process, technology, org structure), what is technically and organizationally feasible, and what the future-state operating model looks like.', 2, 'ba:business-architecture', '{}'::jsonb),

  (qz, 'During the Requirements, Governance & Risk phase of a capstone engagement, what must the BA produce before any solution is built?', 'The development team is ready to start building. The project sponsor says requirements can be gathered iteratively during development.',
   '["Just enough requirements to start the first sprint, with the rest to follow","A complete set of functional and non-functional requirements, a regulatory requirements traceability matrix, and a documented risk register — signed off by all stakeholders before major development investment begins","Only high-level requirements for the executive audience","A detailed Gantt chart showing requirement delivery dates"]'::jsonb,
   1, 'For a transformation engagement, requirements and risk must be baselined before significant investment. "Agile" does not mean "no requirements" — it means requirements are well-understood, prioritized, and traceable. Discovering major compliance gaps mid-build is among the most expensive BA failures.', 3, 'ba:requirements', '{}'::jsonb),

  (qz, 'When building an investment case (business case) for a transformation initiative, what financial information is most critical to present?', 'The board must decide whether to allocate $3.5M to a 24-month digital transformation program.',
   '["The number of features that will be delivered","NPV, ROI, payback period, total cost of ownership, and sensitivity analysis showing how ROI changes under different adoption and benefit scenarios","The project timeline in months","The technology vendor''s market share"]'::jsonb,
   1, 'The board makes capital allocation decisions. They need the financial story: NPV (time-adjusted value), ROI (return on investment), payback period (when they break even), TCO (full cost), and sensitivity analysis (what if key assumptions are wrong). Anything less is an incomplete investment argument.', 4, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'A board presentation on a transformation recommendation is most effective when structured how?', 'You have 20 minutes to present a 24-month, $3.5M transformation recommendation to a skeptical board.',
   '["Start with 50 pages of detailed analysis","Start with detailed technical specifications","Use the Pyramid Principle: lead with the recommendation and financial summary, follow with supporting evidence, and close with the ask and next steps — all in under 10 slides","Present all options without a recommendation to avoid bias"]'::jsonb,
   2, 'Boards make decisions in minutes. The Pyramid Principle (conclusion first, then evidence) respects their time and cognitive load. Leading with the recommendation signals confidence and makes it easy for the board to probe the reasoning — not guess at your conclusion.', 5, 'ba:stakeholders', '{}'::jsonb),

  (qz, 'A stakeholder challenges your transformation recommendation by saying "the data could support the opposite conclusion." How should the BA respond?', 'During your board presentation, the CFO says the same data could justify maintaining the status quo.',
   '["Agree and withdraw the recommendation","Defend your recommendation by explaining the analytical logic: what assumptions were made, which scenarios were tested (including do-nothing), and why the recommended path has a superior expected outcome under the most probable scenarios","Defer to the CFO''s interpretation","Escalate the disagreement to the CEO"]'::jsonb,
   1, 'Professional disagreement is healthy. The BA defends the recommendation with analytical transparency — not authority. Explaining assumptions, tested scenarios, and expected outcome differences gives the board the framework to evaluate competing interpretations. Withdrawing under pressure substitutes confidence for accuracy.', 6, 'ba:product-thinking', '{}'::jsonb),

  (qz, 'At the capstone level, how does a BA''s role differ from earlier in the curriculum?', 'A junior BA on your team asks why the capstone project requires them to present to an executive committee rather than just write requirements.',
   '["It does not differ — BA work is the same at all levels","At the capstone level, the BA operates as a transformation advisor: synthesizing discovery, strategy, requirements, and financial analysis into a coherent investment argument and leading the executive decision — not just documenting what stakeholders say","At the capstone level, BAs only review junior BAs'' work","The capstone is only about certification, not real BA skills"]'::jsonb,
   1, 'Senior BA work is strategic, not just operational. The capstone BA synthesizes all analytical disciplines — discovery, architecture, requirements, risk, financials — into a unified narrative that shapes organizational decisions. The skill jump is from documenting to advising.', 7, 'ba:foundations', '{}'::jsonb),

  (qz, 'You discover during capstone analysis that the originally proposed solution does not address the root-cause problem. What is the professionally correct action?', 'Two months into a project, your analysis reveals the real problem is organizational structure, not the technology platform the team has been tasked to replace.',
   '["Continue with the original scope to meet contractual obligations","Document the finding privately and avoid raising it with stakeholders to prevent conflict","Present the finding transparently to stakeholders: the root cause has been identified, the proposed solution will not solve it, and here is a revised recommendation — even if this resets the project","Modify your analysis to match the original scope"]'::jsonb,
   2, 'The BA''s obligation is to the business outcome, not the original solution assumption. Surfacing a misdiagnosis early — even if it disrupts the plan — prevents a much larger investment in the wrong solution. Professional integrity and courage are as important as analytical skill at the capstone level.', 8, 'ba:product-discovery', '{}'::jsonb),

  (qz, 'A transformation program has five workstreams. How should a capstone BA ensure requirements coherence across all workstreams?', 'Each workstream team is writing requirements independently, and the integration team is finding conflicts between them.',
   '["Let each workstream handle its own requirements in isolation","Establish a requirements architecture: a shared domain model, agreed data dictionary, cross-workstream traceability matrix, and integration requirements review process — with the BA serving as the integration authority","Assign one developer to reconcile requirements at the end","Use only verbal communication between workstreams"]'::jsonb,
   1, 'At scale, requirements coherence requires architecture, not just coordination. The BA must design the requirements system: shared vocabulary, integration points, and a process for detecting and resolving conflicts before they reach development. This is the senior BA''s most distinctive contribution in a large program.', 9, 'ba:requirements', '{}'::jsonb),

  (qz, 'When presenting Phase 5 (The Board Recommendation & Defense), what distinguishes a world-class BA presentation from an adequate one?', 'Two BAs are presenting competing recommendations to the same board. One wins approval; the other is deferred.',
   '["The winning BA had more slides and more data","The winning BA had more seniority","The winning BA anticipated and pre-emptively addressed the board''s most likely objections — demonstrating that risks were examined, alternatives were evaluated, and the recommendation holds under scrutiny","The winning BA''s project had a smaller budget"]'::jsonb,
   2, 'World-class BA presentations are adversarially prepared. They anticipate the board''s questions — risk objections, alternative challenges, assumption challenges — and address them in the presentation itself. This signals analytical rigor and builds board confidence that the BA has stress-tested their own recommendation.', 10, 'ba:stakeholders', '{}'::jsonb),

  (qz, 'What is the difference between an output, an outcome, and an impact in a transformation context?', 'The steering committee debates whether the new digital platform "succeeded."',
   '["They are synonyms in project management","Output = what was built (the platform); outcome = what changed in behavior or performance (adoption rate, process time); impact = long-term business value created (revenue, cost reduction, customer satisfaction) — success is measured at the outcome and impact level, not the output level","Outputs and outcomes are the same; impact is a financial metric only","Impact is measured during the project; outcomes after"]'::jsonb,
   1, 'Transformation success is not measured by delivery of outputs. The platform is an output. Whether it changed behavior is the outcome. Whether that behavior change created business value is the impact. BAs who measure only outputs miss the point of transformation.', 11, 'ba:product-thinking', '{}'::jsonb),

  (qz, 'In a capstone engagement, how should a BA handle a stakeholder who is technically correct but politically motivated in their objection?', 'A division head opposes your recommendation. Their technical objection is valid, but you believe the real reason is they would lose budget authority under the proposed model.',
   '["Dismiss the objection because the motivation is political","Address the technical objection on its merits in the formal forum while understanding the political driver — then engage the stakeholder privately to understand their underlying concern and find a way to accommodate legitimate interests without compromising the recommendation","Escalate the political conflict to the CEO","Withdraw the recommendation to avoid organizational conflict"]'::jsonb,
   1, 'Skilled BAs separate the technical from the political. They address the stated objection transparently and rigorously. They engage the unstated concern through relationship, not confrontation. Ignoring either dimension — the technical validity or the political reality — produces worse outcomes.', 12, 'ba:stakeholders', '{}'::jsonb),

  (qz, 'A board approves the transformation program. What is the BA''s most critical handover deliverable to the implementation team?', 'The program has been approved and the project team is being assembled.',
   '["The PowerPoint presentation shown to the board","A complete requirements package: business case, requirement specifications, regulatory traceability matrix, architecture overview, risk register, success KPIs with measurement plan, and a stakeholder map — documented well enough that a team not present in discovery can implement with fidelity","A verbal briefing at project kick-off","The discovery interview transcripts only"]'::jsonb,
   1, 'The BA''s intellectual capital — the why, the what, and the how-to-measure-success — must be captured in a handover package. Verbal briefings evaporate. Undocumented decisions get reversed. The handover package is what ensures the board-approved vision is actually implemented.', 13, 'ba:requirements', '{}'::jsonb),

  (qz, 'What is the most important lesson a BA learns from the Discovery-to-Transformation capstone experience?', 'After completing the capstone, a student reflects on what was hardest about the full engagement.',
   '["That data analysis is the hardest skill to master","That writing requirements is the most time-consuming activity","That BA work is fundamentally about creating clarity for decision-makers at every stage — from problem diagnosis through investment case to implementation hand-off — and that analytical rigor without communication skill or stakeholder influence produces no organizational change","That the board presentation is the only thing that matters"]'::jsonb,
   2, 'The capstone synthesizes all BA disciplines into a single truth: analysis that does not move decisions is academic. The world-class BA combines analytical rigor (data, requirements, risk) with communication craft (stakeholder influence, executive storytelling, board-level confidence) to create organizational change.', 14, 'ba:foundations', '{}'::jsonb),

  (qz, 'How does a BA know a transformation engagement has truly succeeded?', 'Twelve months after the program closed, the sponsor asks whether it "worked."',
   '["When the final report was accepted by the steering committee","When the system went live on time and on budget","When the KPIs defined in the original business case have been achieved — adoption targets met, efficiency gains realized, revenue or cost impact validated against baseline — and the organization has embedded the new capability into its operating model","When all stakeholders said they were happy at go-live"]'::jsonb,
   2, 'Transformation success is measured against the original business case metrics, 6–12 months post-implementation. On-time delivery and stakeholder satisfaction are necessary but insufficient. Value realization — the actual improvement in KPIs — is the only objective measure of whether the transformation achieved its purpose.', 15, 'ba:solution-eval', '{}'::jsonb);

END $$;

-- =============================================================================
-- VERIFICATION QUERY — run this after applying the DO block above
-- Expected: each module 11–15 shows filled = 15
-- =============================================================================
SELECT c.order_index AS module, c.title AS module_title,
       count(qq.id)                                                AS total_questions,
       count(qq.id) FILTER (WHERE qq.status = 'approved')         AS approved,
       count(DISTINCT qq.competency)                               AS distinct_competencies
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.quizzes qz ON qz.chapter_id = c.id AND qz.quiz_type = 'chapter_end'
LEFT JOIN public.quiz_questions qq ON qq.quiz_id = qz.id
WHERE co.title = 'AI Business Analyst & Product Discovery Specialist'
  AND c.order_index IN (11, 12, 13, 14, 15)
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
