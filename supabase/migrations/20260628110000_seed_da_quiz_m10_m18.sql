-- =============================================================================
-- DA Quiz Questions — Modules 10–18 (18-module structure)
-- Course: AI Data Analyst & Decision Intelligence Professional (da-v1)
-- Modules:
--   10: BI Architecture                          (order_index 10)  da:bi
--   11: Executive Reporting & Self-Serve BI      (order_index 11)  da:bi
--   12: Time Series Analysis                     (order_index 12)  da:forecasting
--   13: Predictive Analytics & Regression        (order_index 13)  da:forecasting
--   14: AI-Augmented Analytics                   (order_index 14)  da:ai-analytics
--   15: Machine Learning for Analysts            (order_index 15)  da:ai-analytics
--   16: Decision Intelligence                    (order_index 16)  da:decision-support
--   17: Data Storytelling                        (order_index 17)  da:data-storytelling
--   18: Data Governance & Ethics                 (order_index 18)  da:data-ethics
-- 15 questions per module = 135 questions total
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 10 — BI Architecture  (da:bi)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 10 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 10'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 10 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1 Foundational
  (qz, 'In a traditional data warehouse, what is the purpose of the staging layer?',
   'A data engineering team is designing a three-layer warehouse for a retail client.',
   '["To serve aggregated, business-friendly data directly to BI tools","To land raw data from source systems exactly as received, preserving it for auditing and reprocessing","To store final dimensional models and fact tables","To cache query results for faster dashboard loads"]'::jsonb,
   1, 'The staging layer is a temporary holding area where raw source data lands without transformation — preserving fidelity for audit and reprocessing. Business-ready aggregated data belongs in the data mart layer. Dimensional models (facts/dimensions) live in the core or presentation layer. Query caching is a BI tool concern, not a warehouse layer.', 1, 'da:bi', '{}'::jsonb),

  -- Q2 Foundational
  (qz, 'What is a data mart?',
   'The finance team complains that the enterprise data warehouse is too complex for their analysts to navigate.',
   '["A cloud storage bucket for raw files","A subject-oriented subset of the data warehouse optimized for the needs of a specific business domain or team","A real-time streaming pipeline","A data quality monitoring dashboard"]'::jsonb,
   1, 'A data mart is a focused, subject-oriented slice of the broader warehouse — for example, a finance mart or a sales mart — shaped to the vocabulary and query patterns of one business domain. Cloud storage handles raw files. Streaming pipelines handle real-time ingestion. Data quality dashboards monitor freshness and accuracy.', 2, 'da:bi', '{}'::jsonb),

  -- Q3 Foundational
  (qz, 'What distinguishes ELT from ETL in modern cloud data platforms?',
   'A data team is choosing between two pipeline architectures for loading data into Snowflake.',
   '["ELT transforms data before loading; ETL transforms it after","ETL loads raw data into the destination first and transforms it there using the warehouse''s compute; ELT transforms data before loading it","ELT loads raw data into the destination first and transforms it there using the warehouse''s compute; ETL transforms data before loading it","ELT is only for streaming data; ETL is for batch"]'::jsonb,
   2, 'In ELT, raw data lands in the destination (e.g., Snowflake, BigQuery) first, then transformations run inside the warehouse using its scalable compute — enabling raw data preservation and flexible re-transformation. ETL transforms before loading, requiring a separate transformation server. Modern cloud warehouses favour ELT because their compute is elastic and cheap. ELT works equally well for batch and streaming.', 3, 'da:bi', '{}'::jsonb),

  -- Q4 Foundational
  (qz, 'What is a semantic model in a BI context?',
   'A Power BI developer is explaining to a business stakeholder why all revenue figures across 12 dashboards now match.',
   '["A raw SQL table exposed directly to report authors","A business-logic layer that defines metrics, hierarchies, and relationships once — so all reports consuming it share consistent definitions","A data pipeline that transforms raw events","A type of machine learning model trained on business KPIs"]'::jsonb,
   1, 'A semantic model (e.g., a Power BI dataset, LookML model, or dbt metric layer) centralises business logic — metric definitions, joins, hierarchies — so every downstream report inherits consistent numbers. Without it, analysts define revenue differently in each dashboard, causing mismatches. It is not a pipeline, an ML model, or raw SQL exposure.', 4, 'da:bi', '{}'::jsonb),

  -- Q5 Foundational
  (qz, 'In the lakehouse architecture, what problem does it solve compared to running a data lake and a data warehouse separately?',
   'A company maintains both an S3-based data lake and a Redshift warehouse, and analysts complain about duplicate storage costs and data inconsistency between the two.',
   '["It eliminates the need for any data transformation","It combines open-format storage with warehouse-quality query performance and ACID transactions in a single system, reducing duplication","It replaces structured data with only unstructured files","It is only suitable for streaming workloads"]'::jsonb,
   1, 'The lakehouse merges the flexibility of a data lake (open formats, low-cost storage, support for unstructured data) with the reliability and query performance of a warehouse (ACID transactions, indexing, SQL access) — eliminating the need to maintain two separate systems with duplicate copies. It does not remove the need for transformation, nor is it limited to streaming.', 5, 'da:bi', '{}'::jsonb),

  -- Q6 Applied
  (qz, 'A BI team notices that three different dashboards report different values for "monthly active users." What is the most effective architectural remedy?',
   'Each dashboard was built by a different analyst who calculated MAU slightly differently in their local SQL.',
   '["Ask each analyst to document their MAU formula in a shared spreadsheet","Define MAU once in the semantic model layer (e.g., a dbt metric or LookML measure) and have all dashboards reference that single definition","Lock down dashboard editing so no one can create new MAU metrics","Switch to a different BI tool"]'::jsonb,
   1, 'The root cause is metric logic duplicated across reports. Centralising the definition in the semantic layer means a single change propagates to all consumers and eliminates divergence. A documentation spreadsheet does not enforce consistency. Locking editing does not fix the underlying disagreement. Switching tools changes the surface, not the architecture problem.', 6, 'da:bi', '{}'::jsonb),

  -- Q7 Applied
  (qz, 'Which dbt concept enforces data quality checks — such as "this column must never be null" and "all values must exist in a reference table" — automatically on every pipeline run?',
   'A dbt project feeds the company''s core revenue dashboard and the team wants to catch bad data before it reaches analysts.',
   '["dbt snapshots","dbt seeds","dbt tests (schema tests and singular tests)","dbt exposures"]'::jsonb,
   2, 'dbt tests run assertions against the transformed data after each build: schema tests (not_null, unique, accepted_values, relationships) cover the most common data quality rules, and singular tests handle custom logic. Snapshots capture slowly changing dimensions. Seeds load static CSV reference data. Exposures document downstream consumers but do not run checks.', 7, 'da:bi', '{}'::jsonb),

  -- Q8 Applied
  (qz, 'An analyst is designing a KPI framework for a SaaS company. Which KPI would best indicate whether the product is retaining customers over time?',
   'The VP of Product asks for a single metric that signals long-term customer health rather than short-term acquisition.',
   '["Number of new sign-ups per month","Customer Acquisition Cost (CAC)","Net Revenue Retention (NRR) — revenue from existing customers in the current period divided by their revenue in the prior period","Average session duration"]'::jsonb,
   2, 'Net Revenue Retention measures whether existing customers are staying, expanding, or churning — it captures both churn and expansion in one number. Values above 100% mean the existing base is growing without new acquisition. New sign-ups and CAC measure acquisition. Session duration measures engagement, not retention revenue.', 8, 'da:bi', '{}'::jsonb),

  -- Q9 Applied
  (qz, 'What does "single source of truth" mean in a BI context, and why is it difficult to achieve?',
   'An executive team receives conflicting revenue figures from the finance, sales, and marketing dashboards every Monday.',
   '["Having one BI tool that everyone uses","Ensuring that every metric is defined and computed in exactly one place and all reports derive from that authoritative definition — difficult because metrics evolve, teams have legitimate definitional disagreements, and legacy reports resist refactoring","Storing all data in one database table","Deleting all dashboards except one official version"]'::jsonb,
   1, 'Single source of truth is an architectural principle: one authoritative metric definition, one computation, consumed everywhere. The difficulty is organisational as much as technical — teams define metrics differently for valid reasons, legacy systems embed their own logic, and enforcing the standard requires governance discipline alongside technical architecture. Using one tool or one table does not guarantee definitional consistency.', 9, 'da:bi', '{}'::jsonb),

  -- Q10 Applied
  (qz, 'A company is evaluating whether to use a star schema or a third-normal-form (3NF) schema for their analytics warehouse. What is the primary advantage of a star schema for BI workloads?',
   'The data engineering team is debating schema design choices before building a new sales analytics layer.',
   '["3NF is always more accurate than star schema","Star schema minimises storage by eliminating redundancy","Star schema is optimised for read-heavy analytical queries — simple joins between one fact table and multiple denormalised dimension tables — resulting in better query performance and easier comprehension for analysts","Star schema enforces stronger referential integrity than 3NF"]'::jsonb,
   2, 'Star schema trades storage efficiency for query performance: denormalised dimensions mean fewer joins and simpler SQL, which analytical engines can optimise aggressively. 3NF is optimised for write-heavy transactional systems, not read-heavy analytics. Both can be accurate; 3NF enforces stronger referential integrity via normalisation but at the cost of query complexity.', 10, 'da:bi', '{}'::jsonb),

  -- Q11 Expert
  (qz, 'A data platform team is deciding between materialising a wide, pre-aggregated table versus keeping granular fact tables and computing aggregations at query time. Which factor most strongly favours pre-aggregation?',
   'The finance dashboard runs 47 complex queries nightly and P95 query time has grown to 8 minutes.',
   '["The number of source systems feeding the warehouse","Dashboard query patterns are repetitive and well-understood, aggregation logic is stable, and query latency is unacceptable — pre-aggregation trades storage and pipeline complexity for consistent sub-second dashboard performance","Pre-aggregation is always preferred regardless of use case","The team prefers SQL to Python"]'::jsonb,
   1, 'Pre-aggregation is justified when query patterns are predictable, the metric definitions are stable, and latency matters. It compresses complex computation into a pipeline run so dashboards are fast. If queries are exploratory or metric definitions change frequently, pre-aggregation creates maintenance burden — every logic change requires reprocessing. The number of source systems and tooling preference are not the deciding factors.', 11, 'da:bi', '{}'::jsonb),

  -- Q12 Expert
  (qz, 'In a BI governance program, what is the difference between a "certified" dataset and a "promoted" dataset in Power BI?',
   'A large enterprise has 400+ Power BI datasets and analysts are uncertain which ones to trust.',
   '["They are the same; the terms are interchangeable","Promoted means the dataset owner has marked it as noteworthy; Certified means a designated authority (usually a data governance team) has formally validated accuracy, documentation, and ownership — making certification a higher trust signal","Certified datasets load faster than promoted ones","Promoted datasets are only visible to administrators"]'::jsonb,
   1, 'Power BI''s endorsement framework has two levels: Promoted (self-attested by the owner as useful) and Certified (validated by an authorised certifier against governance standards — correct definitions, documented owners, tested). Certified is a higher trust signal because it involves independent review. The terms are not interchangeable, and endorsement level does not affect load speed or visibility rules.', 12, 'da:bi', '{}'::jsonb),

  -- Q13 Expert
  (qz, 'A company''s data team is implementing dbt at scale across 15 data domains. What is the most important practice for preventing dbt model sprawl and maintaining long-term maintainability?',
   'After one year the dbt project has grown to 800 models, many undocumented, and the team cannot identify which models are actively used.',
   '["Run dbt compile more frequently","Enforce a layered model architecture (staging → intermediate → mart), require documentation and owner tags on every model, use dbt exposures to track downstream consumers, and establish a regular audit cycle to deprecate unused models","Limit the number of contributors to the dbt project","Switch from dbt to a different transformation tool"]'::jsonb,
   1, 'dbt sprawl is an organisational problem that requires architectural convention (layered naming), documentation standards, ownership tagging, and lifecycle management (deprecation). Exposures track which reports depend on which models, making it safe to clean up. Compiling more frequently does not address sprawl. Limiting contributors reduces throughput without fixing the underlying governance gap.', 13, 'da:bi', '{}'::jsonb),

  -- Q14 Expert
  (qz, 'An analytics engineer proposes replacing the company''s semantic layer with direct SQL access for all analysts. What is the most significant risk of this approach?',
   'A startup is debating whether to invest in building a dbt metric layer or let analysts query staging tables directly.',
   '["Direct SQL access is technically impossible in most warehouses","Analysts will write slower queries","Metric definitions will diverge over time as each analyst implements their own interpretation of business logic, making cross-functional reporting unreliable and eroding executive trust in the data","Direct SQL requires more expensive compute"]'::jsonb,
   2, 'The semantic layer''s primary value is definitional consistency. Without it, each analyst encodes their own interpretation of a metric — what counts as a customer, how churn is calculated — and reports drift apart. This erodes trust precisely when leadership needs to make aligned decisions. Direct SQL is technically possible, query speed is a secondary concern, and compute cost is not the defining issue.', 14, 'da:bi', '{}'::jsonb),

  -- Q15 Expert
  (qz, 'A senior analyst is tasked with designing a KPI framework for a 50-person company entering its growth phase. Which approach best ensures the KPIs drive aligned decision-making rather than metric gaming?',
   'The CEO wants every team to have their own KPIs but the COO is concerned about teams optimising their local metrics at the expense of company-wide outcomes.',
   '["Give each team full autonomy to choose any KPIs they want","Assign identical KPIs to every team regardless of function","Design a hierarchical KPI tree: one or two company-level north-star metrics at the top, with each team''s KPIs defined as leading indicators or sub-drivers of those north-stars — so local optimisation directionally improves the company metric","Use only financial KPIs to avoid subjectivity"]'::jsonb,
   2, 'A KPI tree connects team-level metrics to company outcomes so that a team hitting its local target contributes to, rather than conflicts with, company-wide performance. Full autonomy fragments alignment; identical KPIs ignore team function; purely financial KPIs miss leading indicators. The hierarchical design is the standard approach in OKR and balanced scorecard frameworks.', 15, 'da:bi', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 11 — Executive Reporting & Self-Serve BI  (da:bi)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 11 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 11'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 11 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1 Foundational
  (qz, 'What is the primary design principle for an executive-level dashboard?',
   'A BI analyst is asked to build a new dashboard for the CEO who currently receives a 40-tab Excel report weekly.',
   '["Show as much data as possible so executives can explore freely","Lead with the most critical KPIs and exceptions at a glance, minimising cognitive load — executives need signals, not spreadsheets","Include every metric the business tracks to avoid omissions","Use the most complex chart types to demonstrate analytical sophistication"]'::jsonb,
   1, 'Executive dashboards succeed by showing the right information instantly — key metrics, traffic-light status, and anomalies — not by maximising data volume. Cognitive load reduction is the central design constraint: executives make decisions in minutes, not hours of exploration. Complex chart types obscure rather than clarify at that level.', 1, 'da:bi', '{}'::jsonb),

  -- Q2 Foundational
  (qz, 'What is self-serve analytics?',
   'A data team receives 50 ad-hoc report requests per week from business users who want slightly different cuts of the same data.',
   '["A system where analysts build every report for every business user on demand","An environment where business users can independently answer their own data questions using governed, curated data assets and BI tools — without needing to file a request to the data team","A data warehouse with no access controls","A process where executives write their own SQL queries"]'::jsonb,
   1, 'Self-serve analytics shifts routine data exploration from the data team to empowered business users, by giving them governed curated data, friendly BI tools, and appropriate training. It does not mean no governance or that executives write SQL — it means business users can answer their own questions within guardrails set by the data team.', 2, 'da:bi', '{}'::jsonb),

  -- Q3 Foundational
  (qz, 'Which reporting cadence is most appropriate for operational KPIs that require immediate corrective action if they deviate?',
   'A contact-centre manager needs to know if call-abandonment rate spikes above threshold so agents can be redeployed within the hour.',
   '["Monthly reporting","Quarterly reporting","Daily or real-time reporting","Annual reporting"]'::jsonb,
   2, 'Operational KPIs that drive same-day or same-hour decisions require daily or real-time refresh cadences. Monthly or quarterly cadences are appropriate for strategic and financial metrics where trends matter more than immediate reaction. The abandonment-rate scenario requires a cadence short enough to enable an operational response within the business''s reaction window.', 3, 'da:bi', '{}'::jsonb),

  -- Q4 Foundational
  (qz, 'In BI asset governance, what does "deprecating" a report mean?',
   'A BI team has identified 60 dashboards that have not been viewed in six months and contain outdated metric definitions.',
   '["Deleting the report immediately without notice","Formally marking a report as no longer maintained or accurate — typically with a banner, a sunset date, and a redirect to the approved replacement — before removing it","Restricting access to administrators only","Renaming the report"]'::jsonb,
   1, 'Deprecation is an orderly end-of-life process: communicate to users that the asset is no longer maintained, provide a sunset timeline, point to the replacement, and then remove after the deadline. Immediate silent deletion breaks user workflows. Access restriction without communication leaves users confused. Renaming is a different operation.', 4, 'da:bi', '{}'::jsonb),

  -- Q5 Foundational
  (qz, 'What metric best measures BI adoption within an organisation?',
   'A data team wants to prove the value of their BI investment to the CFO.',
   '["The number of dashboards published","The number of database tables in the warehouse","The percentage of target business users who actively use governed BI assets at least once per week (weekly active users among the intended audience)","The average query run time"]'::jsonb,
   2, 'BI adoption is measured by active usage among the intended audience, not by the quantity of assets produced. Publishing 200 dashboards that nobody opens is not adoption. Active user rate (weekly active users / total intended users) is the most direct proxy for whether BI is actually changing how decisions are made. Query speed and table count are infrastructure metrics, not adoption metrics.', 5, 'da:bi', '{}'::jsonb),

  -- Q6 Applied
  (qz, 'An executive asks why her weekly revenue dashboard shows a different figure than the one the CFO presented in the board meeting. What is the most likely structural cause and the correct remedy?',
   'Both dashboards are built in the same BI tool but were created by different teams at different times.',
   '["The BI tool has a bug that should be reported to the vendor","The two dashboards use different definitions of revenue — the remedy is to create a single certified revenue metric in the semantic layer and retire both ad-hoc definitions","The executive''s dashboard needs to refresh more often","The board presentation data was wrong and should be ignored"]'::jsonb,
   1, 'Differing revenue figures almost always trace to definitional divergence: one report counts recognised revenue, another counts bookings, or they use different date filters. The structural fix is a single certified definition in the semantic model that both reports consume. Refreshing more often does not resolve a definitional conflict. Blaming the tool without investigating the definition is a poor first response.', 6, 'da:bi', '{}'::jsonb),

  -- Q7 Applied
  (qz, 'When designing a self-serve BI environment, which approach best balances data access with governance?',
   'A 200-person company wants business analysts to explore data freely while ensuring sensitive HR and financial data remains restricted.',
   '["Give all users full access to all data to maximise self-serve capability","Allow no self-serve access — all reports must go through the central data team","Implement row-level and column-level security on sensitive tables, publish curated certified datasets for common use cases, and provide training and documentation so business users can explore safely","Require all queries to be reviewed by a data engineer before running"]'::jsonb,
   2, 'Effective self-serve governance uses technical controls (row/column security) to enforce data boundaries automatically, curated datasets to guide users toward trusted data, and enablement (training, documentation) so users can be productive without hand-holding. Full access ignores privacy and compliance. Full restriction negates self-serve. Engineer review of every query reintroduces the bottleneck self-serve is meant to remove.', 7, 'da:bi', '{}'::jsonb),

  -- Q8 Applied
  (qz, 'A quarterly business review (QBR) deck needs to communicate performance to the board. Which structuring principle should guide the data analyst building the slide pack?',
   'The analyst has three weeks of data preparation done and is now designing the narrative flow of the presentation.',
   '["Start with 20 slides of methodology before showing results","Present all available metrics alphabetically","Lead with the headline performance verdict (are we on track or not?), follow with the evidence by strategic pillar, and close with recommended actions — conclusion before detail","Begin with the lowest-performing metrics to manage expectations"]'::jsonb,
   2, 'Board and executive audiences make decisions; they need the verdict first (Pyramid Principle: conclusion → evidence → recommendation). Leading with methodology or low metrics buries the insight. Alphabetical ordering has no narrative logic. The three-part structure (verdict, evidence, actions) ensures the board can engage from the first slide even if time runs short.', 8, 'da:bi', '{}'::jsonb),

  -- Q9 Applied
  (qz, 'A BI team wants to assign clear ownership to every report in their portfolio. What three roles should they define for each BI asset?',
   'Currently, nobody knows who to call when a dashboard shows incorrect data, because "everyone built it together."',
   '["Creator, viewer, administrator","Business owner (accountable for the content and decisions it drives), data steward (responsible for the underlying data quality), and BI developer (responsible for the technical build and maintenance)","Executive sponsor, project manager, developer","Data engineer, data scientist, business analyst"]'::jsonb,
   1, 'BI asset governance requires three distinct accountabilities: a business owner who is accountable for correctness and acts on the data, a data steward who ensures the underlying data meets quality standards, and a BI developer who maintains the technical report. Without this separation, accountability defaults to nobody. Creator/viewer/admin are tool permission roles, not governance roles.', 9, 'da:bi', '{}'::jsonb),

  -- Q10 Applied
  (qz, 'A company wants to move from a weekly manually-emailed Excel report to a live executive dashboard. What is the most important first step before building the dashboard?',
   'The data team is eager to start in Power BI but the VP of Finance is skeptical the numbers will match his current Excel model.',
   '["Choose the BI tool and start building immediately","Align on metric definitions with the VP of Finance — document what each metric means, how it is calculated, and what the authoritative data source is — before writing a single DAX formula","Ask the VP of Finance to learn Power BI himself","Build the dashboard and correct any definition mismatches after launch"]'::jsonb,
   1, 'Metric definition alignment must precede technical build. If the VP''s Excel model uses a different revenue definition than the new dashboard, the dashboard will be wrong from day one and trust will be broken before adoption begins. Discovering definition mismatches after launch is far more costly than resolving them in a pre-build alignment session.', 10, 'da:bi', '{}'::jsonb),

  -- Q11 Expert
  (qz, 'A BI team measures adoption using "number of dashboard views per month" and reports strong growth. The head of data challenges this metric. What is the most valid critique?',
   'The dashboard view count has grown 300% but business stakeholders still send the same volume of ad-hoc data requests to the data team.',
   '["The metric is too technical for business stakeholders to understand","Views are a vanity metric — they count opens, not value delivered. A more meaningful adoption measure is whether BI consumption is replacing manual data requests or improving the quality and speed of business decisions","The dashboard should be redesigned to get more views","The head of data should be ignored because views are the only measurable proxy"]'::jsonb,
   1, 'View counts measure traffic, not impact. High views alongside unchanged ad-hoc request volume suggests users are opening dashboards but not finding answers — they still need analyst help. Better adoption proxies include reduction in ad-hoc requests, user-reported decision confidence, and whether KPI owners can explain their metric''s trend without involving the data team.', 11, 'da:bi', '{}'::jsonb),

  -- Q12 Expert
  (qz, 'A large enterprise has a "wild west" BI environment: 1,200 published reports, no owners, inconsistent metrics, and analysts cannot tell which reports are authoritative. Which intervention has the highest impact-to-effort ratio for restoring governance?',
   'The data governance team has a budget of two analyst-months and executive sponsorship to fix the problem.',
   '["Delete all 1,200 reports and start over","Implement a BI asset registry with ownership, certification status, and usage metadata — then use usage data to identify the top 20 reports that drive 80% of views, certify those first, and establish a deprecation process for low-usage assets","Restrict all BI access until every report is reviewed","Hire 10 more BI developers to rebuild every report"]'::jsonb,
   1, 'With limited budget, a Pareto approach maximises impact: certify the high-traffic, high-trust reports first (likely 20 reports driving 80% of usage), establish an endorsement framework, and deprecate the long tail. Starting over destroys institutional knowledge. Blanket access restriction stops business operations. Rebuilding everything is a multi-year programme, not a two-month fix.', 12, 'da:bi', '{}'::jsonb),

  -- Q13 Expert
  (qz, 'An analyst discovers that a widely-used executive dashboard contains a calculation error that has been overstating revenue by 8% for three months. What is the professionally correct sequence of actions?',
   'The error affects the monthly board report that was presented last week.',
   '["Quietly fix the error and say nothing to avoid embarrassment","Fix the error immediately, notify the dashboard owner and business stakeholders with a clear explanation of what was wrong, the correct figures for the affected period, and the remediation taken — then add a data test to prevent recurrence","Delete the dashboard and create a new one","Wait until next month''s board meeting to correct it"]'::jsonb,
   1, 'Transparency is non-negotiable when a material error has affected executive decisions. The correct response is immediate correction, prompt disclosure to affected stakeholders with corrected figures, and a root-cause fix (automated tests). Quiet correction without disclosure leaves executives operating on incorrect information. Deleting the dashboard destroys evidence. Waiting a month delays stakeholder awareness of potentially impactful misreporting.', 13, 'da:bi', '{}'::jsonb),

  -- Q14 Expert
  (qz, 'A company wants to implement a reporting cadence framework. Which principle should govern how frequently a metric is reported?',
   'The operations team wants every metric reported daily; the strategy team wants monthly; the finance team wants both daily and monthly for the same revenue metric.',
   '["All metrics should be reported at the same cadence to simplify the reporting calendar","Cadence should match the decision-making cycle for that metric: operational metrics that drive same-day actions need daily or real-time reporting; strategic metrics that inform quarterly decisions need monthly or quarterly reporting; the same metric may legitimately need multiple cadences for different audiences","Daily is always better than monthly because fresher data is always more valuable","Cadence should be determined by the cost of data extraction"]'::jsonb,
   1, 'Reporting cadence is audience-and-decision-driven, not data-driven. The same revenue metric can be a daily operational signal for the finance operations team (cash flow management) and a monthly strategic indicator for the CFO (trend and forecast). Uniform cadence ignores the diversity of decision timelines. Cost of extraction is a constraint, not the governing principle.', 14, 'da:bi', '{}'::jsonb),

  -- Q15 Expert
  (qz, 'A self-serve BI rollout is failing six months in: business users are not using the curated datasets, preferring to export raw data to Excel instead. What is the most likely root cause and the highest-leverage intervention?',
   'User interviews reveal the curated datasets do not contain the columns analysts need, and the documentation is incomplete.',
   '["The BI tool is not good enough — replace it","Force users to stop using Excel by revoking export permissions","The curated datasets do not serve actual user needs — the highest-leverage fix is a structured data product review with the top power users to identify missing fields and add them, combined with improved documentation and hands-on training","The business users are resistant to change and need more management pressure"]'::jsonb,
   2, 'Self-serve fails when curated datasets are not fit for purpose — missing columns, wrong grain, or poor documentation. The fix is product iteration, not coercion. Revoking Excel access frustrates users without solving their underlying data need. Replacing the BI tool is expensive and changes the surface, not the content. Management pressure breeds resentment, not adoption. Co-designing datasets with power users is the evidence-based path to adoption.', 15, 'da:bi', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 12 — Time Series Analysis  (da:forecasting)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 12 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 12'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 12 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1 Foundational
  (qz, 'Which of the four classical time series components represents random, unpredictable fluctuations that cannot be attributed to trend, seasonality, or cyclicality?',
   'An analyst decomposes monthly sales data and finds a portion of variance that fits no recognisable pattern.',
   '["Trend","Seasonality","Cyclical component","Irregular (residual) component"]'::jsonb,
   3, 'The irregular (residual or error) component captures random noise — one-off events, measurement errors, and unexplained variation that remain after trend, seasonality, and cyclicality are removed. Trend is the long-run direction. Seasonality repeats on a fixed calendar schedule. Cyclical components follow economic or business cycles longer than one year but shorter and less regular than secular trend.', 1, 'da:forecasting', '{}'::jsonb),

  -- Q2 Foundational
  (qz, 'A simple moving average (SMA) smooths a time series by doing what?',
   'A supply chain analyst wants to remove week-to-week noise from daily demand data.',
   '["Multiplying each observation by a fixed weight","Replacing each data point with the average of the N most recent observations, giving equal weight to each","Applying exponential decay so that older observations contribute less","Fitting a straight trend line through all data points"]'::jsonb,
   1, 'A simple moving average computes the mean of the last N periods, giving each equal weight. This smooths short-term noise but lags behind recent changes. Weighted moving averages assign different weights per period. Exponential smoothing assigns geometrically decaying weights — that describes EMA, not SMA. Trend line fitting uses regression, not moving averages.', 2, 'da:forecasting', '{}'::jsonb),

  -- Q3 Foundational
  (qz, 'How does an exponential moving average (EMA) differ from a simple moving average (SMA)?',
   'A financial analyst is comparing two smoothing methods for a volatile daily revenue metric.',
   '["EMA uses more data points than SMA","EMA uses a fixed window of equally-weighted observations; SMA uses decaying weights","EMA assigns geometrically decaying weights to older observations, so recent data influences the average more than older data","EMA and SMA always produce the same result"]'::jsonb,
   2, 'EMA assigns the highest weight to the most recent observation and decreases weights exponentially for older ones — making it more responsive to recent changes than SMA. SMA gives equal weight to all observations in the window. They diverge when data has a recent trend or sudden shift. They never produce identical results in a changing series.', 3, 'da:forecasting', '{}'::jsonb),

  -- Q4 Foundational
  (qz, 'What is the purpose of seasonal adjustment in time series analysis?',
   'An economist wants to compare retail sales this November to last August without the distortion of holiday seasonality.',
   '["To remove the trend component from the series","To eliminate random noise from the data","To remove the predictable, recurring seasonal pattern so that the underlying trend and irregular components can be analysed or compared across seasons","To convert nominal values to real values by adjusting for inflation"]'::jsonb,
   2, 'Seasonal adjustment removes the calendar-driven periodic variation so that periods with different seasonal baselines can be compared meaningfully — for example, comparing Q4 (holiday season) to Q2 (slower season) without the seasonal effect inflating Q4. It does not remove trend or adjust for inflation; those are separate operations.', 4, 'da:forecasting', '{}'::jsonb),

  -- Q5 Foundational
  (qz, 'What does MAPE stand for and what does it measure?',
   'A forecasting team is evaluating which of three models to deploy for demand planning.',
   '["Mean Absolute Performance Error — a measure of model speed","Mean Absolute Percentage Error — the average absolute difference between forecast and actual values expressed as a percentage of the actual","Mean Accuracy Prediction Estimate — a percentage of correct predictions","Median Absolute Percentage Error — the middle error value across all forecasts"]'::jsonb,
   1, 'MAPE (Mean Absolute Percentage Error) = average of |Actual − Forecast| / |Actual| × 100. It expresses forecast error in percentage terms, making it interpretable across different scales and useful for comparing models on the same dataset. Its weakness is that it is undefined when actuals are zero and inflates error when actuals are small.', 5, 'da:forecasting', '{}'::jsonb),

  -- Q6 Applied
  (qz, 'An analyst builds a 3-month simple moving average forecast for monthly revenue. Revenue has been rising steadily for 12 months. What systematic problem will this forecast have?',
   'The analyst compares the SMA forecast to actuals and notices the forecast is consistently below actual values.',
   '["The forecast will be too high because SMA over-reacts to recent peaks","SMA will produce a lag bias — it will systematically underestimate a rising series because it averages in older, lower values","SMA cannot be applied to revenue data","The 3-month window is too short for any meaningful smoothing"]'::jsonb,
   1, 'SMA averages the last N periods equally. In a consistently rising series, the N-period average always includes older, lower values — creating a persistent downward lag. The forecast will always trail the actual. Exponential smoothing or trend-adjusted methods reduce this lag because they weight recent data more heavily. SMA does not over-react; that is actually EMA''s relative risk.', 6, 'da:forecasting', '{}'::jsonb),

  -- Q7 Applied
  (qz, 'A retail company wants to forecast next December''s sales. Historical data shows both an upward multi-year trend and a strong December seasonality. Which forecasting method handles both components simultaneously?',
   'A simpler model that handles only trend or only seasonality produced poor results in last year''s planning cycle.',
   '["Simple moving average","Linear regression on raw values with no seasonal variables","Holt-Winters triple exponential smoothing, which models level, trend, and seasonality together","A 12-month SMA which smooths out seasonality"]'::jsonb,
   2, 'Holt-Winters (triple exponential smoothing) explicitly models three components: level (current value), trend (direction), and seasonality (periodic pattern) — making it well-suited for series with both trend and seasonality. SMA smooths seasonality away rather than modelling it. Simple linear regression on raw values conflates seasonal peaks with trend. A 12-month SMA cancels out seasonality but loses the ability to forecast seasonal peaks.', 7, 'da:forecasting', '{}'::jsonb),

  -- Q8 Applied
  (qz, 'A demand planner''s forecast has MAPE = 5% for one product category and MAPE = 22% for another. What does this mean for how each forecast should be used?',
   'Both forecasts are used to set safety stock levels in the warehouse management system.',
   '["Both forecasts are equally reliable because both use the same method","The 5% MAPE forecast is highly accurate and suitable for tighter inventory management; the 22% MAPE forecast has substantial error and requires larger safety stock buffers and more frequent human review","MAPE only matters for financial forecasts, not supply chain","A 22% MAPE means the forecast is completely unusable and should be discarded"]'::jsonb,
   1, 'MAPE quantifies average forecast error as a percentage of actual. 5% MAPE is strong for demand planning — safety stock can be set tightly. 22% MAPE means the forecast is off by an average of nearly a quarter of actual demand — requiring larger buffers and more oversight. It is not necessarily unusable, but the risk of stock-outs or overstock is significantly higher and the business must plan accordingly.', 8, 'da:forecasting', '{}'::jsonb),

  -- Q9 Applied
  (qz, 'Which of the following correctly defines MAE and explains when it is preferred over MAPE?',
   'A data science team is choosing accuracy metrics for a product demand forecasting model where some SKUs have near-zero historical sales.',
   '["MAE (Mean Absolute Error) is the same as MAPE but expressed as a decimal","MAE is the average of the absolute differences between forecast and actual values in original units; it is preferred over MAPE when actuals can be zero or very small, because MAPE is undefined or distorted in those cases","MAE squares the errors to penalise large deviations more heavily","MAE cannot be calculated when forecast values are negative"]'::jsonb,
   1, 'MAE = average of |Actual − Forecast| in the original unit (e.g., units sold). It is interpretable, symmetric, and — crucially — defined even when actuals are zero. MAPE divides by the actual, making it undefined at zero and unreliable at low volumes. RMSE (not MAE) squares errors to penalise large deviations. MAE can be calculated with negative values.', 9, 'da:forecasting', '{}'::jsonb),

  -- Q10 Applied
  (qz, 'An analyst presents a 12-month revenue forecast to the CFO. The CFO asks "how confident should I be in this?" What should the analyst provide to answer this question rigorously?',
   'The analyst currently only presents a single point forecast with no range.',
   '["Explain that forecasts are always accurate because they are based on historical data","Quote the model''s R² value as a measure of forecast confidence","Provide a prediction interval (e.g., 80% or 95% confidence band) around the point forecast, show historical MAPE or MAE to give the CFO a sense of typical error magnitude, and note the key assumptions that could cause the forecast to deviate","Tell the CFO that confidence intervals are too technical for executive audiences"]'::jsonb,
   2, 'A point forecast alone obscures uncertainty. Prediction intervals show the plausible range at a given confidence level. Historical error metrics (MAPE/MAE) ground the uncertainty in observed performance. Key assumptions make the forecast falsifiable. R² measures in-sample fit, not forecast accuracy. Executive audiences benefit from uncertainty information presented clearly — concealing it is not a service.', 10, 'da:forecasting', '{}'::jsonb),

  -- Q11 Expert
  (qz, 'A time series exhibits strong weekly seasonality AND a gradual upward trend. An analyst applies a 7-day simple moving average and then fits a linear trend to the smoothed series. What is the main limitation of this two-step approach?',
   'The analyst is trying to build a monthly revenue forecast for a news website that spikes every Monday.',
   '["7-day SMA is not a valid smoothing window","The two-step approach cannot handle an upward trend","By smoothing first and then fitting trend, the analyst discards the seasonal pattern entirely — the final model cannot regenerate seasonal forecasts for specific days of the week","Simple moving average is too computationally expensive"]'::jsonb,
   2, 'The 7-day SMA cancels the weekly seasonality by design — that is useful for isolating trend, but it means the smoothed series carries no seasonal information. A trend model fitted to the smoothed series can only forecast a de-seasonalised average, not a Monday spike. To forecast by day of week, the analyst must either decompose and recombine the seasonal component, or use a model (like Holt-Winters or Prophet) that explicitly carries seasonality through to the forecast output.', 11, 'da:forecasting', '{}'::jsonb),

  -- Q12 Expert
  (qz, 'A forecasting model achieves 4% MAPE on the training data (2018–2022) but 31% MAPE on the 2023 holdout period. What is the most likely cause and the correct diagnostic step?',
   'The model was trained on pre-pandemic data and first deployed for 2023 planning.',
   '["The holdout MAPE is always higher than training MAPE — this is expected","The model is overfitted to the training period or the 2023 data contains a structural break (a permanent shift in the demand pattern) that was not present in training; the diagnostic step is to plot actual vs. predicted for 2023 and check whether the error is systematic (structural break) or random (overfitting)","MAPE cannot be calculated on holdout data","The model should simply be re-trained on 2023 data and the historical period should be discarded"]'::jsonb,
   1, 'A large gap between training and holdout MAPE signals either overfitting (model memorised training noise) or a structural break (the relationship between inputs and outputs changed). Visual diagnosis — plotting actuals vs. forecast on the holdout — distinguishes systematic under- or over-prediction (structural break) from random error (overfitting). Discarding history without understanding the break risks repeating the mistake.', 12, 'da:forecasting', '{}'::jsonb),

  -- Q13 Expert
  (qz, 'A business analyst is asked to build a forecast for a product launched 4 months ago. What is the most significant challenge and how should it be addressed?',
   'The product team needs a 12-month forward forecast to plan inventory and headcount.',
   '["New products are easier to forecast than established ones because they have no seasonality yet","The challenge is insufficient historical data — without at least one full seasonal cycle, statistical models will extrapolate trend without capturing seasonal patterns; the analyst should supplement thin historical data with analogous product benchmarks, market research, and explicit assumption documentation with wide confidence intervals","A 4-month history is sufficient for Holt-Winters triple smoothing","The analyst should refuse to forecast until 24 months of data are available"]'::jsonb,
   1, 'Forecasting new products is one of the hardest problems in demand planning. Four months of data cannot reveal annual seasonality. Statistical models will extrapolate trend, potentially badly. The professional approach is to triangulate: use analogous product launch curves as a prior, incorporate market research, and be explicit that the forecast is assumption-driven with wide uncertainty — not false precision from an ill-fitted model.', 13, 'da:forecasting', '{}'::jsonb),

  -- Q14 Expert
  (qz, 'An analyst notices that RMSE is much larger than MAE for the same forecast model. What does this indicate about the error distribution, and what are the implications for the business?',
   'A supply chain team uses both metrics to evaluate a demand planning model across 500 SKUs.',
   '["RMSE being larger than MAE is mathematically impossible","RMSE and MAE measure different things and cannot be compared","Because RMSE squares errors before averaging, a much larger RMSE than MAE indicates the presence of a few very large forecast errors — outlier SKUs with extreme misses are disproportionately inflating RMSE; the business implication is to investigate those specific SKUs for root causes rather than averaging them away","RMSE is always preferred over MAE; the larger value means the model is more accurate"]'::jsonb,
   2, 'RMSE penalises large errors quadratically: RMSE² = average(error²), while MAE = average(|error|). When RMSE >> MAE, the squared penalty is amplified by a few very large individual errors. For the business, this means most SKUs forecast well, but a handful have dramatic misses — which can cause stock-outs or overstock on high-volume lines. The right response is to segment the error analysis and investigate those outlier SKUs specifically.', 14, 'da:forecasting', '{}'::jsonb),

  -- Q15 Expert
  (qz, 'A company uses a seasonal index to adjust its monthly revenue forecast. January''s seasonal index is 0.72, and the annual trend forecast for January is $1.4M. What is the seasonally-adjusted January forecast, and what does a seasonal index below 1.0 mean?',
   'The planning team builds monthly budgets using a multiplicative seasonal decomposition model.',
   '["$1.94M; an index below 1.0 means January is above the annual average","$1.01M; the index corrects for inflation","$1.008M; the index reflects January''s share of annual revenue","$1.008M — calculated as $1.4M × 0.72 — and an index below 1.0 means January is a below-average month relative to the annual level; the seasonal effect suppresses expected revenue in that month"]'::jsonb,
   3, '$1.4M × 0.72 = $1.008M. A seasonal index below 1.0 means the period is typically weaker than the annual average — January at 0.72 means it runs at 72% of the average monthly level. An index of 1.0 would be exactly average; above 1.0 means an above-average period. In a multiplicative model, the seasonal factor scales the trend forecast up or down based on historical seasonal strength.', 15, 'da:forecasting', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 13 — Predictive Analytics & Regression  (da:forecasting)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 13 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 13'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 13 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1 Foundational
  (qz, 'What does a simple linear regression model represent?',
   'A marketing analyst wants to understand the relationship between advertising spend and revenue.',
   '["A curve that passes through every data point exactly","A straight line that best describes the linear relationship between one independent variable and one dependent variable, minimising the sum of squared residuals","A model with multiple outcome variables","A non-parametric ranking of data points"]'::jsonb,
   1, 'Simple linear regression fits the line Y = β₀ + β₁X that minimises the sum of squared residuals (OLS). It models how the dependent variable (Y) changes on average for each unit change in the independent variable (X). It assumes linearity, one predictor, and one outcome. Passing through every point would require a polynomial interpolation, not a regression.', 1, 'da:forecasting', '{}'::jsonb),

  -- Q2 Foundational
  (qz, 'In multiple regression, what does it mean when a coefficient is said to be "statistically significant"?',
   'A regression model predicts employee attrition using salary, tenure, and manager rating as predictors.',
   '["The coefficient is large in magnitude","The coefficient is positive","The p-value for the coefficient is below the chosen significance level (commonly 0.05), meaning the observed relationship is unlikely to have occurred by chance alone","The variable was added last to the model"]'::jsonb,
   2, 'Statistical significance is determined by the p-value: if p < 0.05, we reject the null hypothesis that the true coefficient is zero. It does not mean the effect is large or practically important — a tiny coefficient can be highly significant with enough data. A positive or large coefficient is a separate property from significance.', 2, 'da:forecasting', '{}'::jsonb),

  -- Q3 Foundational
  (qz, 'What does R² (coefficient of determination) measure in a regression model?',
   'An analyst reports that her revenue forecasting model has R² = 0.87.',
   '["The percentage of predictions that are exactly correct","The proportion of variance in the dependent variable explained by the independent variable(s) in the model","The number of data points used in the regression","The p-value of the model"]'::jsonb,
   1, 'R² measures how much of the total variance in Y is captured by the model. R² = 0.87 means 87% of revenue variance is explained by the predictors. It does not mean 87% of predictions are exactly correct — regression predictions are almost never exact. It is not a count of data points, and it is unrelated to the p-value (which measures significance, not fit).', 3, 'da:forecasting', '{}'::jsonb),

  -- Q4 Foundational
  (qz, 'What is multicollinearity in multiple regression and why is it a problem?',
   'A regression model predicting house prices uses both "square footage" and "number of rooms" as independent variables.',
   '["When the dependent variable has a non-linear relationship with predictors","When two or more independent variables are highly correlated with each other, making it difficult to isolate the individual effect of each predictor — inflating standard errors and making coefficients unstable","When the model has too many data points","When residuals are not normally distributed"]'::jsonb,
   1, 'Multicollinearity occurs when predictors are highly inter-correlated (e.g., square footage and room count tend to move together). The model cannot cleanly attribute variance to each predictor independently — coefficients become unstable, standard errors inflate, and p-values become unreliable even if the overall model R² is high. It does not describe non-linearity or residual distribution problems.', 4, 'da:forecasting', '{}'::jsonb),

  -- Q5 Foundational
  (qz, 'In regression diagnostics, what does a residual plot reveal?',
   'An analyst plots the residuals of her linear regression against the fitted values and sees a clear funnel shape widening to the right.',
   '["Whether the model has enough predictors","The R² of the model","Whether regression assumptions (linearity, constant variance, independence) are met — patterns in residuals indicate violations","The correlation between predictors"]'::jsonb,
   2, 'Residual plots visualise whether the model''s error terms behave as expected under OLS assumptions. A funnel shape (wider variance at higher fitted values) signals heteroscedasticity — violation of the constant-variance assumption. Curves in the residual plot signal non-linearity. The plot does not show R² or predictor correlation, and adding more predictors does not automatically fix assumption violations.', 5, 'da:forecasting', '{}'::jsonb),

  -- Q6 Applied
  (qz, 'A retail analyst builds a linear regression to predict weekly sales using temperature, promotions, and day-of-week. The model has R² = 0.91 on training data but R² = 0.43 on new test-week data. What is the most likely problem?',
   'The model was trained on 52 weeks of data and tested on the next 8 weeks.',
   '["The test data is too small to evaluate the model","Linear regression is inappropriate for retail data","The model is overfitted to the training data — it has learned noise or idiosyncratic patterns in the 52 training weeks that do not generalise; the analyst should simplify the model, use cross-validation, and evaluate on a rolling holdout","R² cannot be computed on test data"]'::jsonb,
   2, 'A large gap between training R² (0.91) and test R² (0.43) is the classic signature of overfitting. The model has memorised the training set rather than learning generalisable patterns. Solutions include feature reduction, regularisation, and validating on a proper holdout or cross-validation scheme. R² is fully valid on test data — that is one of its most important uses.', 6, 'da:forecasting', '{}'::jsonb),

  -- Q7 Applied
  (qz, 'A business analyst is asked to build a "best case / base case / worst case" scenario plan for next year''s revenue. What is the correct methodology?',
   'The CFO wants to understand the range of possible outcomes before setting the annual budget.',
   '["Run three separate regression models and pick the middle one","Report only the base case to avoid confusing the CFO","Define the key uncertain drivers (e.g., market growth rate, conversion rate, churn), set optimistic/most-likely/pessimistic values for each, and run the revenue model with each combination to generate three scenarios — then present the range with the assumption set behind each","Ask the CFO which scenario she prefers and model only that"]'::jsonb,
   2, 'Scenario planning decomposes revenue into its key drivers and tests the sensitivity to different driver values. Best/base/worst cases are defined by coherent sets of driver assumptions, not by arbitrary model variants. The CFO needs all three scenarios to understand the distribution of outcomes and set an appropriate budget with contingency. Running three models without a driver framework produces arbitrary, not defensible, scenarios.', 7, 'da:forecasting', '{}'::jsonb),

  -- Q8 Applied
  (qz, 'A regression model predicting customer lifetime value (CLV) shows heteroscedasticity — the residuals fan out as CLV increases. What is the most appropriate corrective action?',
   'The analyst''s residual vs. fitted plot shows increasing variance for high-CLV customers.',
   '["Delete the high-CLV customers from the training data","Ignore it — heteroscedasticity does not affect prediction quality","Apply a log transformation to the dependent variable (CLV) to stabilise variance, or use weighted least squares regression — then re-examine the residual plot to confirm the violation is resolved","Add more predictor variables to the model"]'::jsonb,
   2, 'Heteroscedasticity violates OLS assumptions, inflating standard errors and making significance tests unreliable. Log-transforming CLV often stabilises variance in right-skewed financial variables. Weighted least squares down-weights high-variance observations. Adding more predictors does not fix variance instability. Deleting high-CLV customers is both statistically wrong and wastes the most valuable data in a CLV model.', 8, 'da:forecasting', '{}'::jsonb),

  -- Q9 Applied
  (qz, 'An analyst runs a sensitivity analysis on a pricing model. What does it reveal when she changes the assumed price elasticity from -1.2 to -1.8?',
   'The base case projects $10M revenue at a 10% price increase.',
   '["Nothing — sensitivity analysis only applies to cost models","Sensitivity analysis reveals how much the output (projected revenue) changes in response to a change in a key assumption (price elasticity) — helping the analyst identify which assumptions most strongly drive the result and therefore deserve the most scrutiny","The model has an error because elasticity should be positive","Sensitivity analysis requires at least 10 input variables"]'::jsonb,
   1, 'Sensitivity analysis tests "what if this assumption is wrong?" by varying one input at a time and measuring the output change. If revenue changes dramatically when elasticity moves from -1.2 to -1.8, elasticity is a high-sensitivity driver that warrants more careful estimation. It applies to any model, not just cost models. Price elasticity is negative by convention (price up → demand down).', 9, 'da:forecasting', '{}'::jsonb),

  -- Q10 Applied
  (qz, 'When communicating a predictive model''s output to a non-technical executive, what information is most important to include alongside the point prediction?',
   'A data analyst is presenting a customer churn probability model to the Chief Revenue Officer.',
   '["The full Python code used to build the model","A histogram of the training data distribution","The model''s accuracy on a held-out test set, the key drivers of the prediction, the confidence or probability range around the prediction, and the main assumptions and limitations — so the executive can calibrate how much weight to place on it","Only the predicted probability — executives do not need technical details"]'::jsonb,
   2, 'Executives make decisions based on model outputs; they need to know how reliable those outputs are. Providing test-set accuracy, the main drivers (what factors matter most), a confidence range (not just a point), and key limitations enables calibrated decision-making. Providing only a point prediction without context is misleading. Full code is irrelevant for the audience. A training data histogram is a technical diagnostic, not an executive communication.', 10, 'da:forecasting', '{}'::jsonb),

  -- Q11 Expert
  (qz, 'A regression model has Variance Inflation Factor (VIF) scores of 8.4 and 9.1 for two predictors. What action should the analyst take?',
   'The model predicts employee performance using 12 variables including years_experience and years_in_role.',
   '["VIF scores above 5 are fine — no action needed","A VIF of 8–10 is within acceptable range for social science research","VIF above 5–10 signals high multicollinearity; the analyst should investigate whether the correlated predictors can be combined into a composite variable, drop the less theoretically important one, or use regularisation (ridge regression) to stabilise coefficients — then recheck VIF","Remove all predictors with VIF above 1"]'::jsonb,
   2, 'VIF quantifies how much a predictor''s variance is inflated by multicollinearity. VIF > 5 is commonly flagged as concerning; VIF > 10 is severe. For years_experience and years_in_role, the two are likely highly correlated. Options: create a composite (e.g., tenure total), drop the weaker one, or use ridge regression which handles multicollinearity via L2 regularisation. VIF = 1 would mean no correlation at all — removing everything above 1 would eliminate all predictors.', 11, 'da:forecasting', '{}'::jsonb),

  -- Q12 Expert
  (qz, 'A predictive model for loan default achieves 96% accuracy on the test set, but the model flags almost no defaults. The actual default rate in the dataset is 3%. What is the most likely problem and the correct evaluation metric?',
   'A fintech company is evaluating a new credit risk model before production deployment.',
   '["96% accuracy is excellent — the model should be deployed immediately","The model has learned to predict the majority class (no default) for every observation, achieving 97% accuracy by always saying no default — accuracy is misleading on imbalanced classes; the correct metrics are precision, recall, F1, and AUC-ROC which evaluate performance on the minority (default) class","The dataset is too small for this type of model","A 3% default rate is too rare to model"]'::jsonb,
   1, 'With a 3% positive class rate, a model that predicts "no default" for every loan achieves 97% accuracy trivially — yet flags zero actual defaults, which is catastrophically bad for a credit risk model. On imbalanced datasets, accuracy is misleading. Recall (did we catch the actual defaults?) and precision (when we flag a default, are we right?) matter far more. AUC-ROC measures overall discrimination ability across all thresholds.', 12, 'da:forecasting', '{}'::jsonb),

  -- Q13 Expert
  (qz, 'A business wants to build a "worst case" scenario for revenue planning that is statistically grounded rather than arbitrary. What approach produces a defensible worst-case estimate?',
   'The CFO rejected last year''s worst case as "too optimistic" after actual results came in worse.',
   '["Simply subtract 20% from the base case","Use the 5th or 10th percentile of the predictive distribution — derived from Monte Carlo simulation or a prediction interval — as the worst case, and document the specific driver assumptions (low market growth, high churn, etc.) that produce it","Ask the most pessimistic executive for their gut estimate","Use the minimum value ever observed in the historical data"]'::jsonb,
   1, 'A statistically grounded worst case uses the lower tail of the forecast distribution (e.g., 5th percentile from Monte Carlo or the lower bound of a prediction interval), driven by coherent pessimistic assumptions on each key driver. This is defensible because it has a defined probability and explicit assumptions. Arbitrary percentage cuts and gut estimates cannot be defended or updated as conditions change. Historical minimums anchor to the past rather than the current environment.', 13, 'da:forecasting', '{}'::jsonb),

  -- Q14 Expert
  (qz, 'An analyst builds a multiple regression model with 15 predictors on a dataset of 120 observations. The model achieves very high training R² but poor test performance. What regularisation technique directly addresses this problem and how does it work?',
   'The data science team suggests trying ridge regression or lasso.',
   '["Add more predictor variables to capture more variance","Use a larger train/test split ratio","Ridge regression adds an L2 penalty (sum of squared coefficients × λ) to the loss function, shrinking all coefficients toward zero to reduce overfitting; Lasso adds an L1 penalty that can shrink some coefficients to exactly zero, performing variable selection — both reduce model complexity at the cost of a small increase in bias","Use a decision tree instead of regression"]'::jsonb,
   2, 'With 15 predictors on 120 observations (8 observations per predictor), overfitting is almost certain. Regularisation adds a penalty term to the loss function that discourages large coefficients: Ridge (L2) shrinks all coefficients proportionally, reducing variance; Lasso (L1) can zero out irrelevant predictors entirely, combining shrinkage with variable selection. Both trade a little bias for substantially less variance — the classic bias-variance trade-off resolution.', 14, 'da:forecasting', '{}'::jsonb),

  -- Q15 Expert
  (qz, 'A retail chain builds a promotional uplift model using regression. The coefficient on the "promotion" dummy variable is +$12,000, with a 95% confidence interval of [$3,000, $21,000]. How should the analyst communicate this to the marketing director?',
   'The marketing director wants to know if the promotion is worth running based on the model output.',
   '["The promotion causes exactly $12,000 in additional revenue — approve all promotions","We cannot say anything useful because the confidence interval is too wide","The model estimates that running this promotion is associated with approximately $12,000 in additional revenue on average (95% CI: $3,000–$21,000) — meaning we are 95% confident the true effect is somewhere in that range; if the promotion cost is below $3,000, it is likely profitable under even the pessimistic scenario","The confidence interval means the model is wrong 95% of the time"]'::jsonb,
   2, 'The point estimate ($12,000) is the best single estimate, but the confidence interval [$3,000–$21,000] communicates the uncertainty. A marketing director needs to know: at the low end of the plausible range, is the promotion still worth it? If the promotion costs $2,000 and the lower bound is $3,000, even the pessimistic scenario is profitable. The CI means 95% of such intervals contain the true effect — not that the model is wrong 95% of the time.', 15, 'da:forecasting', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 14 — AI-Augmented Analytics  (da:ai-analytics)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 14 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 14'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 14 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1 Foundational
  (qz, 'What is NL-to-SQL and what problem does it solve for data analysts?',
   'A product manager wants to query the database but does not know SQL.',
   '["A technique for converting SQL queries into natural language documentation","A capability where a user types a question in plain English and an AI system generates a SQL query that retrieves the relevant data — reducing the SQL barrier for non-technical users","A database engine that stores data in natural language format","A data visualisation method"]'::jsonb,
   1, 'NL-to-SQL (natural language to SQL) uses large language models to translate a plain-language question ("How many customers churned last month?") into executable SQL. It lowers the barrier for non-technical business users to access data. The underlying database still stores structured data normally — NL-to-SQL is a translation layer, not a storage format or visualisation.', 1, 'da:ai-analytics', '{}'::jsonb),

  -- Q2 Foundational
  (qz, 'What is the most important limitation of NL-to-SQL tools that analysts must understand?',
   'A data team is evaluating whether to deploy an NL-to-SQL tool for their finance team.',
   '["NL-to-SQL tools are too slow for production use","NL-to-SQL tools can only work with Excel files","NL-to-SQL tools can generate syntactically correct SQL that retrieves the wrong data — especially when the schema has ambiguous column names or when the business question requires domain-specific metric definitions the AI does not know","NL-to-SQL tools require the user to know SQL"]'::jsonb,
   2, 'The most dangerous NL-to-SQL failure is a plausible-looking query that runs without error but answers the wrong question — for example, joining on the wrong key or using the wrong date filter. This risk is highest with ambiguous schemas or business-specific metric definitions (like a custom churn definition) that the AI model cannot infer. The tool should be validated against ground-truth queries before deployment to non-technical users.', 2, 'da:ai-analytics', '{}'::jsonb),

  -- Q3 Foundational
  (qz, 'What does an "automated insight detection" tool do?',
   'A BI platform vendor claims their product will surface insights analysts would miss.',
   '["It manually reviews data and emails a report to the analyst","It algorithmically scans a dataset or dashboard for statistically notable patterns — anomalies, significant changes, correlations, outliers — and surfaces them without the analyst having to write custom code","It replaces the analyst entirely","It automatically builds machine learning models on the dataset"]'::jsonb,
   1, 'Automated insight detection (e.g., Power BI''s Smart Narratives, Tableau Explain Data) uses statistical algorithms to find patterns worth highlighting: unusual spikes, unexpected correlations, significant segment differences. It augments the analyst by handling the initial scan. It does not replace analytical judgment about which insights are meaningful for the business, and it does not build predictive ML models.', 3, 'da:ai-analytics', '{}'::jsonb),

  -- Q4 Foundational
  (qz, 'What does "prompt engineering" mean in the context of using AI for data analysis tasks?',
   'An analyst uses ChatGPT to help interpret a regression output and gets a vague, unhelpful response.',
   '["Writing Python code to call the OpenAI API","Designing clear, specific, contextual inputs to an AI model — including relevant context, the desired output format, constraints, and examples — to get accurate and useful responses","Adjusting the AI model''s internal weights","Selecting which AI model to use"]'::jsonb,
   1, 'Prompt engineering is the craft of writing inputs to an AI model that reliably produce useful outputs. For analytics tasks this means: providing data context (schema, sample rows), specifying the desired output format (SQL, explanation, table), stating constraints, and giving examples of good output. Vague prompts produce vague responses. It is distinct from API programming, model training, or model selection.', 4, 'da:ai-analytics', '{}'::jsonb),

  -- Q5 Foundational
  (qz, 'What is the correct approach when validating an AI-generated SQL query before sharing its results with stakeholders?',
   'An AI assistant generated a 25-line SQL query in response to a business question. The analyst is about to paste it into the BI dashboard.',
   '["Run it immediately and trust the output because the AI generated it","Check only the first and last lines to verify the table name is correct","Read every line of the query to confirm the joins, filters, aggregations, and date logic match the business intent — then test on a sample where the expected result is known — before using it in production","Ask a colleague to run the query independently at the same time"]'::jsonb,
   2, 'AI-generated SQL must be treated as a first draft, not a trusted output. The analyst must read the full query for correctness (correct tables, joins, filter conditions, date ranges, aggregation logic) and validate results against a known expected value before sharing with stakeholders. Spot-checking only the first or last line misses the most common error locations — which are in JOIN conditions and WHERE filters.', 5, 'da:ai-analytics', '{}'::jsonb),

  -- Q6 Applied
  (qz, 'An analyst uses an AI assistant to clean a messy dataset containing customer names with inconsistent capitalisation, duplicate records, and missing phone numbers. What is the most critical validation step after applying the AI''s suggested cleaning code?',
   'The dataset has 50,000 rows and will feed the company''s CRM system.',
   '["Trust the AI''s output because AI makes fewer errors than manual cleaning","Run the code and check that the row count did not change","Compare key statistics (row count, null rates per column, value distributions, duplicate counts) before and after cleaning — and manually inspect a random sample of transformed rows to verify the changes are correct and no records were incorrectly merged or dropped","Only check the phone number column since that was the only missing field"]'::jsonb,
   2, 'AI-generated data cleaning code can silently merge non-duplicate records (false deduplication), drop valid rows, or misformat values. The validation protocol is: check row counts before/after, compare null rates, inspect value distributions, and manually audit a random sample of changed rows. Checking only one column ignores the other cleaning operations. Row count alone does not catch incorrect merges.', 6, 'da:ai-analytics', '{}'::jsonb),

  -- Q7 Applied
  (qz, 'A data analyst prompts an AI assistant: "Analyse my sales data." The AI returns a generic summary. What prompt revision would most improve the output quality?',
   'The analyst has a dataset with columns: date, region, product_category, units_sold, revenue, cogs.',
   '["Analyse my sales data more thoroughly","Give me insights","You are a senior data analyst. The dataset has columns: date, region, product_category, units_sold, revenue, cogs. Identify the top 3 revenue trends by region over the last 6 months, flag any product categories with declining margin, and format the output as a numbered list with one supporting data point per finding.","Tell me everything about my data"]'::jsonb,
   2, 'Effective prompts for analysis tasks specify: role context (senior data analyst), dataset schema (column names and their meaning), the specific analytical question (top 3 revenue trends, declining margin), the time scope (last 6 months), and the desired output format (numbered list with one data point). Generic prompts ("analyse my data") produce generic responses. Specificity is the primary lever for AI output quality.', 7, 'da:ai-analytics', '{}'::jsonb),

  -- Q8 Applied
  (qz, 'An AI tool flags three "interesting insights" in a dashboard dataset: a 2% uplift in mobile sessions, a correlation between temperature and ice cream sales, and a 40% week-over-week drop in API calls. Which should the analyst prioritise investigating and why?',
   'The analyst has limited time and needs to escalate only the most business-critical finding.',
   '["Prioritise the temperature-ice cream correlation because it has the strongest obvious relationship","Prioritise the mobile sessions uplift because it is the most positive finding","Prioritise the 40% week-over-week drop in API calls — a sharp, large, unexpected decline in a system metric likely signals a technical problem, data pipeline failure, or product issue requiring immediate investigation","Report all three findings simultaneously without prioritisation"]'::jsonb,
   2, 'A 40% week-over-week drop is a large, sudden, directional change in an operational metric — the type of anomaly most likely to indicate a real problem (bug, outage, data pipeline failure, customer churn event) requiring immediate triage. A 2% mobile uplift is likely normal variation. The temperature-ice cream correlation is expected and not actionable. AI insight tools detect all patterns equally; the analyst must apply business judgment to triage.', 8, 'da:ai-analytics', '{}'::jsonb),

  -- Q9 Applied
  (qz, 'When using an AI assistant to help write a data analysis report, what is the most important quality control step?',
   'An analyst uses AI to draft a written interpretation of A/B test results for the product team.',
   '["Publish the AI''s output directly to save time","Change the font and formatting before sending","Read every sentence of the AI''s draft against the actual data to verify that every claim, number, and conclusion is factually correct and matches the analysis — then rewrite any section where the AI has hallucinated or misinterpreted","Ask the AI to review its own output for accuracy"]'::jsonb,
   2, 'AI language models can produce fluent, confident-sounding text that misrepresents the actual data — hallucinating numbers, overstating significance, or drawing conclusions the data does not support. The analyst must read every claim against the source data. Asking the AI to self-review is unreliable because the model cannot access the actual dataset to verify its own claims. Publishing without review is professionally unacceptable.', 9, 'da:ai-analytics', '{}'::jsonb),

  -- Q10 Applied
  (qz, 'A company deploys an NL-to-SQL tool for 50 business analysts with no SQL training. After one month, executives report seeing conflicting numbers across different NL-generated reports. What governance control would have prevented this?',
   'Different analysts asked similar questions in slightly different ways and got different SQL with different metric logic.',
   '["Remove NL-to-SQL access from analysts who get wrong answers","Upgrade to a more expensive NL-to-SQL tool","Establish a semantic layer with certified metric definitions that the NL-to-SQL tool is configured to use — so that revenue, churn, and other key terms resolve to the same SQL logic regardless of how the question is phrased","Require all NL questions to be pre-approved by the data team"]'::jsonb,
   2, 'NL-to-SQL tools generate metric logic on the fly from schema metadata. Without a semantic layer, the same business term ("revenue") can resolve to different SQL depending on the phrasing. The fix is to configure the NL-to-SQL tool to use certified, pre-defined metric logic from the semantic layer — making metric definitions authoritative regardless of natural language variation. Pre-approval of every query defeats the purpose of self-serve.', 10, 'da:ai-analytics', '{}'::jsonb),

  -- Q11 Expert
  (qz, 'An AI-assisted insight tool surfaces a statistically significant correlation (r = 0.78, p < 0.001) between employee coffee consumption and quarterly revenue in a company dataset. What is the analyst''s correct interpretation and recommended action?',
   'The CEO is excited and wants to start a "coffee incentive program" to boost revenue.',
   '["Approve the coffee incentive program — the correlation is statistically significant and strong","Reject the finding entirely because correlation never has business relevance","Investigate for confounding: both coffee consumption and revenue likely increase during high-activity business periods (e.g., product launches, quarter-end pushes) — this is a spurious correlation driven by a third variable (workload intensity). No causal inference is warranted and no intervention should be based on this finding alone","Report the finding as a proven causal relationship to the CEO"]'::jsonb,
   2, 'Statistical significance does not imply causation. A correlation between coffee and revenue almost certainly reflects a shared driver — both spike during intense work periods. Recommending a causal intervention (coffee program) based on a spurious correlation wastes resources and damages analytical credibility. The analyst''s job is to identify the confounding variable and educate the CEO on the distinction between correlation and causation.', 11, 'da:ai-analytics', '{}'::jsonb),

  -- Q12 Expert
  (qz, 'A team uses an AI assistant to generate Python code for exploratory data analysis. The AI produces code that runs without errors and generates plausible-looking output. What is the most insidious validation failure mode the analyst should watch for?',
   'The analyst is exploring a customer transaction dataset for the first time.',
   '["The code takes too long to run","The AI uses Python libraries the analyst does not recognise","The code is syntactically correct and executes cleanly, but contains logical errors — for example, calculating average order value by dividing total revenue by number of products instead of number of orders — producing a number that looks reasonable but is analytically wrong","The code generates too many charts"]'::jsonb,
   2, 'The most dangerous AI code error is a logical error that produces a plausible-but-wrong number. Syntax errors fail loudly; logical errors fail silently. An analyst who does not verify the computational logic against the business definition will share incorrect analysis with high confidence. The validation discipline is: read the code and confirm that every calculation matches the business definition before accepting the output.', 12, 'da:ai-analytics', '{}'::jsonb),

  -- Q13 Expert
  (qz, 'An organisation wants to use AI to automate anomaly detection across 200 KPI streams. What is the key design decision that determines whether the system will be useful or will generate alert fatigue?',
   'The current system pages the data team 50 times per day, most of which are false positives.',
   '["The choice of cloud provider","The number of KPI streams monitored — fewer streams means better quality","Tuning the sensitivity threshold and alert routing: sensitivity controls the false-positive/false-negative trade-off; routing ensures each alert goes to the team best positioned to act. Without deliberate calibration, automated anomaly detection generates noise, not signal","The colour scheme of the alert dashboard"]'::jsonb,
   2, 'Alert fatigue is the primary failure mode of automated anomaly detection. The key design levers are: sensitivity threshold (lower = more alerts, higher false-positive rate; higher = fewer alerts, risk of missing real events) and routing (right alert to the right person who can actually investigate). These must be calibrated per KPI stream based on the cost of false positives vs. false negatives for that specific metric. UI aesthetics and cloud provider are irrelevant to alert quality.', 13, 'da:ai-analytics', '{}'::jsonb),

  -- Q14 Expert
  (qz, 'A data analyst uses an AI assistant to help interpret statistical output from a hypothesis test. The AI confidently states "the result is statistically significant, therefore the treatment caused the improvement." What error has the AI made, and how should the analyst correct it?',
   'The test compared two groups in an observational study, not a randomised controlled experiment.',
   '["The AI is correct — statistical significance always implies causation","The AI is correct — significance in observational studies is the same as in experiments","The AI has conflated statistical significance with causal inference. In an observational study, statistical significance only means the difference is unlikely due to random chance — it does not rule out confounding variables. Causal language is only warranted in a properly randomised experiment. The analyst must correct the language in any report using this output","The test should be re-run until the result is non-significant"]'::jsonb,
   2, 'Causation requires ruling out confounding, which observational studies cannot do without additional design features (matching, instrumental variables, regression discontinuity, etc.). Statistical significance addresses random chance, not confounding. AI models frequently conflate the two because causal language is common in the training data even when the evidence does not support it. The analyst must correct this before publishing results.', 14, 'da:ai-analytics', '{}'::jsonb),

  -- Q15 Expert
  (qz, 'A senior analyst is building an AI-assisted analytics workflow for a regulated financial services firm. Which governance practice is most critical for regulatory compliance?',
   'The firm''s risk function requires a full audit trail for every analytical output that influences a credit decision.',
   '["Use the fastest AI model available","Ensure all AI prompts are under 500 words","Implement a human-in-the-loop review and approval process for AI-generated outputs that influence regulated decisions, maintain a complete audit log of the prompt, model version, output, and the human reviewer who approved it — so the firm can reconstruct every decision for regulators","Avoid using AI entirely in regulated contexts"]'::jsonb,
   2, 'Regulated financial decisions require auditability: regulators need to trace every decision back to its inputs, logic, and the human who was accountable. An AI-assisted workflow must therefore log: the prompt, the model and version used, the output, and the human approval. Human-in-the-loop review ensures accountability cannot be delegated to an AI. Avoiding AI entirely forgoes a legitimate productivity tool. Prompt length and model speed are not regulatory concerns.', 15, 'da:ai-analytics', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 15 — Machine Learning for Analysts  (da:ai-analytics)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 15 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 15'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 15 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1 Foundational
  (qz, 'What is the fundamental difference between supervised and unsupervised machine learning?',
   'A data team is selecting an ML approach to analyse customer behaviour.',
   '["Supervised learning is faster; unsupervised learning is more accurate","Supervised learning trains a model using labelled examples (input-output pairs) to predict an outcome; unsupervised learning finds structure in unlabelled data without predefined outcome labels","Supervised learning requires more data than unsupervised learning","Unsupervised learning is used only for image recognition"]'::jsonb,
   1, 'Supervised learning requires labelled training data — each example is tagged with the correct answer (e.g., churned / not churned). The model learns to map inputs to outputs. Unsupervised learning has no labels — it discovers latent structure, such as customer segments, through patterns in the data itself. Neither is inherently faster or more accurate; the choice depends on whether labelled data exists and what question is being answered.', 1, 'da:ai-analytics', '{}'::jsonb),

  -- Q2 Foundational
  (qz, 'A decision tree classifies customers as "likely to churn" or "likely to stay." What makes decision trees particularly useful for business analysts communicating results to non-technical stakeholders?',
   'The data science team is recommending decision trees over other models for a churn intervention pilot.',
   '["Decision trees are always more accurate than other algorithms","Decision trees require the least amount of data","Decision trees produce human-readable, flowchart-like rules (IF tenure < 6 months AND support_tickets > 3 THEN likely to churn) that can be understood, challenged, and acted on by business teams without requiring ML expertise","Decision trees never overfit"]'::jsonb,
   2, 'Decision trees are interpretable by design: the split conditions at each node are explicit business rules that stakeholders can read, debate, and translate into action. This is their primary business advantage over black-box models. They are not inherently more accurate (in fact, they often underperform ensemble methods) and they are among the models most prone to overfitting without pruning or depth constraints.', 2, 'da:ai-analytics', '{}'::jsonb),

  -- Q3 Foundational
  (qz, 'Logistic regression is commonly used for classification tasks. What does it output?',
   'A data analyst is building a model to predict whether a loan application will default (yes/no).',
   '["A continuous value such as the predicted loan amount","The exact class of each observation with no uncertainty measure","A probability between 0 and 1 that an observation belongs to the positive class — which is then compared to a threshold (commonly 0.5) to produce a binary classification","A ranked list of all possible outcomes"]'::jsonb,
   2, 'Logistic regression applies a sigmoid function to a linear combination of features, squashing the output to the range [0, 1] — interpretable as a probability. A threshold (e.g., 0.5) converts the probability into a binary label. This probabilistic output is useful because the threshold can be adjusted to trade off precision and recall based on business needs (e.g., a lower threshold catches more defaults at the cost of more false alarms).', 3, 'da:ai-analytics', '{}'::jsonb),

  -- Q4 Foundational
  (qz, 'What is K-means clustering and what type of question does it answer?',
   'A marketing team wants to understand whether their customer base has distinct behavioural segments.',
   '["K-means predicts the probability of a customer churning","K-means partitions observations into K groups by iteratively assigning each point to the nearest centroid and updating centroids — answering the question: what natural groupings exist in this data?","K-means requires a labelled training dataset","K-means is used exclusively for image processing"]'::jsonb,
   1, 'K-means is an unsupervised clustering algorithm. It partitions data into K clusters by minimising intra-cluster distance (each point belongs to the nearest centroid). It answers "what groupings exist?" without any predefined labels. It is commonly used for customer segmentation, anomaly detection, and data compression. It does not predict outcomes or require labelled data.', 4, 'da:ai-analytics', '{}'::jsonb),

  -- Q5 Foundational
  (qz, 'What does the AUC-ROC metric measure for a classification model?',
   'A data science team is comparing three churn prediction models and reports AUC scores of 0.62, 0.81, and 0.94.',
   '["The percentage of correct predictions across the full dataset","The model''s accuracy on the training set","The model''s ability to discriminate between positive and negative classes across all classification thresholds — an AUC of 1.0 is perfect discrimination; 0.5 is no better than random guessing","The average error in predicted probabilities"]'::jsonb,
   2, 'AUC-ROC (Area Under the Receiver Operating Characteristic Curve) summarises discrimination ability across all possible thresholds. It answers: across all threshold settings, how well does the model separate positives from negatives? AUC = 0.94 means 94% of randomly selected (positive, negative) pairs are ranked correctly. It is threshold-independent, making it ideal for model comparison. It is not an accuracy measure and does not reflect training-set performance specifically.', 5, 'da:ai-analytics', '{}'::jsonb),

  -- Q6 Applied
  (qz, 'A business analyst is asked whether to use a classification model or a regression model to predict next month''s customer spend. Which is correct and why?',
   'The finance team wants to budget for expected revenue per customer account.',
   '["Classification, because it is more accurate for financial data","Either — they produce identical results","Regression, because the outcome (spend amount) is a continuous numerical variable, not a discrete category; classification would force a continuous outcome into buckets, losing precision","Classification, because spend can be grouped into high/medium/low"]'::jsonb,
   2, 'Regression predicts a continuous numeric outcome (e.g., $1,247 spend). Classification predicts a discrete category (e.g., high/medium/low spender). Grouping spend into bins for classification discards information and introduces arbitrary thresholds. When the business need is a precise dollar amount for budgeting, regression is the correct choice. Classification into spend tiers is a separate, supplementary question.', 6, 'da:ai-analytics', '{}'::jsonb),

  -- Q7 Applied
  (qz, 'A data analyst trains a customer churn model. On the test set, precision = 0.72 and recall = 0.41. What do these metrics mean in business terms, and what trade-off do they reveal?',
   'The retention team will call every customer the model flags as likely to churn.',
   '["72% of customers will churn; 41% will not","The model is wrong 72% of the time","Of customers the model flags as churners, 72% actually churn (precision); but the model only catches 41% of all actual churners (recall) — it misses 59% of real churners. The business trade-off: the call list is fairly clean (low wasted calls) but many at-risk customers are invisible to the retention team","The model has 72% overall accuracy"]'::jsonb,
   2, 'Precision = TP / (TP + FP): of those flagged, how many truly churn? Recall = TP / (TP + FN): of those who actually churn, how many were flagged? High precision / low recall means: good targeting quality but poor coverage — many real churners escape the retention program. Whether to increase recall (at the cost of lower precision / more wasted calls) is a business decision based on the relative cost of a missed churn vs. an unnecessary call.', 7, 'da:ai-analytics', '{}'::jsonb),

  -- Q8 Applied
  (qz, 'A K-means segmentation produces 5 customer clusters. Cluster 3 has the highest average purchase frequency and highest average order value. What is the most appropriate business action for this cluster?',
   'The e-commerce team is using the segmentation to design differentiated marketing programs.',
   '["Exclude Cluster 3 from marketing because they already buy a lot","Send Cluster 3 the largest discounts to maintain their loyalty","Identify Cluster 3 as the high-value segment, protect their experience (premium service, proactive retention), study their characteristics to identify potential look-alike customers to acquire, and prioritise product features that serve their needs","Treat all clusters identically to avoid bias"]'::jsonb,
   2, 'High-frequency, high-AOV customers are the most valuable segment by revenue concentration. The playbook: protect (minimise churn risk), understand (what drives their loyalty?), and replicate (find look-alike prospects). Mass discounting devalues the brand and erodes margin on customers who already buy without incentives. Identical treatment across segments negates the segmentation''s purpose.', 8, 'da:ai-analytics', '{}'::jsonb),

  -- Q9 Applied
  (qz, 'An ML model achieves 99% accuracy on the training set but 61% accuracy on the test set. What is the most likely explanation and the primary remedy?',
   'The model was trained on 3 years of historical transaction data using 80 features.',
   '["The test set was incorrectly constructed","The model algorithm is fundamentally flawed","The model is overfitted — it has memorised noise and patterns in the training set that do not generalise. With 80 features, the model has sufficient capacity to overfit. Remedies include reducing feature count via feature selection, applying regularisation, increasing training data, or using cross-validation to select hyperparameters","The accuracy metric is inappropriate for this dataset"]'::jsonb,
   2, 'A 38-percentage-point gap between training and test accuracy is severe overfitting. With 80 features, the model has high capacity to memorise training patterns, especially noise. Remedies address the bias-variance trade-off: fewer features (remove noise sources), regularisation (penalise complexity), more data (reduce the signal-to-noise impact of any single observation), or ensemble methods with built-in variance reduction.', 9, 'da:ai-analytics', '{}'::jsonb),

  -- Q10 Applied
  (qz, 'A data analyst is evaluating whether to hand off a modelling task to the data science team. Which scenario most clearly warrants that handoff?',
   'The analyst can build a logistic regression model in Python but the business needs are becoming more complex.',
   '["The analyst''s logistic regression model achieves 80% accuracy and the stakeholder is happy","The analyst wants to learn a new algorithm","The business requires a production-grade model with real-time inference, retraining pipelines, model monitoring for drift, and explainability reports — concerns that go beyond building and evaluating a model in a notebook","The dataset has more than 10,000 rows"]'::jsonb,
   2, 'Analysts build exploratory and batch models; data scientists engineer production ML systems. The handoff is warranted when requirements shift from "train a model and evaluate it" to "deploy, serve, monitor, and maintain a model at scale." Real-time inference, automated retraining, and drift monitoring require MLOps engineering skills and infrastructure that extend beyond the analyst role. The analyst should hand off with a clear model evaluation brief and remain involved in the business interpretation layer.', 10, 'da:ai-analytics', '{}'::jsonb),

  -- Q11 Expert
  (qz, 'A churn model has F1 score = 0.68. The customer success manager asks: "is 0.68 good enough to act on?" What is the most complete and correct answer?',
   'The retention team has budget for 200 outreach calls per month.',
   '["F1 = 0.68 is below 0.70 so the model should not be used","F1 is the only metric needed to make this decision","Whether F1 = 0.68 is actionable depends on: the baseline rate (how many customers actually churn?), the cost of a false positive (wasted call), the cost of a false negative (lost customer revenue), and whether the 200-call budget is binding. A model that targets the right 200 customers with 68% precision-recall balance may deliver substantial ROI even if a higher-performing model is theoretically possible","F1 = 0.68 is excellent for any business problem"]'::jsonb,
   2, 'F1 score is one signal, not a decision threshold. The business question is: does this model make the retention program more effective than no model (random calling) or a simple rule (call everyone who logs in less than once a month)? If the baseline is random selection at 3% actual churn rate, an F1 of 0.68 likely represents enormous improvement. The budget constraint (200 calls) makes precision especially important. Business value, not an absolute F1 threshold, is the correct decision criterion.', 11, 'da:ai-analytics', '{}'::jsonb),

  -- Q12 Expert
  (qz, 'An analyst builds a customer segmentation using K-means with K=5. A colleague challenges the choice of K=5, saying K=3 or K=8 might be better. How should the analyst defend or revise the choice of K?',
   'The segmentation will be used to design five distinct marketing journeys.',
   '["K=5 is always the best choice for customer segmentation","The choice of K is arbitrary — any number works","The analyst should use the elbow method (plot inertia vs. K and look for the inflection point), the silhouette score (measures how well-separated clusters are), and business interpretability (can each cluster be described with a coherent business profile and actioned differently?). The correct K is where statistical structure and business utility align — not the mathematically optimal K alone","Use K equal to the number of products in the portfolio"]'::jsonb,
   2, 'K selection is both a statistical and a business judgment. The elbow method identifies where additional clusters yield diminishing returns in inertia reduction. Silhouette scores measure cluster cohesion and separation. But the final test is business interpretability: are the clusters meaningfully different in ways that justify different marketing programmes? K=5 may be optimal statistically but if two clusters are indistinguishable in business terms, K=4 is better in practice.', 12, 'da:ai-analytics', '{}'::jsonb),

  -- Q13 Expert
  (qz, 'A company deploys a churn prediction model. After 3 months, the model''s AUC drops from 0.87 at launch to 0.71. What is the most likely cause and the correct response?',
   'Nothing about the scoring pipeline has changed technically since deployment.',
   '["The model was incorrectly evaluated at launch","3 months is too short to evaluate a model","Model drift: the statistical relationship between the input features and the churn outcome has shifted (possibly due to a product change, a macro-economic shift, or evolving customer behaviour) — causing the model''s learned patterns to become less predictive. The response is to investigate which features have drifted, retrain on more recent data, and implement ongoing monitoring with automatic alerts","The AUC calculation methodology changed"]'::jsonb,
   2, 'Model drift (specifically concept drift — the input-output relationship changes) is the most common cause of production model degradation. Feature drift (input distribution shifts) is a secondary cause. The diagnostic is to compare input feature distributions at training time vs. now, and examine which customer segments the model is now getting wrong. The response is retraining on recent data, potentially with a higher weight on recent observations, and deploying monitoring to detect future drift earlier.', 13, 'da:ai-analytics', '{}'::jsonb),

  -- Q14 Expert
  (qz, 'An analyst presents a random forest churn model with AUC = 0.91 to the CEO, who asks "why does it predict this customer will churn?" The analyst cannot explain the model''s reasoning. What should the analyst have prepared, and why does this matter for business adoption?',
   'The CEO wants to discuss specific cases with the customer success team before approving the model for production use.',
   '["The model''s AUC is high enough — no further explanation is needed","Tell the CEO that random forests are inherently unexplainable and she must trust the output","SHAP (SHapley Additive exPlanations) or LIME values, which attribute the prediction for each customer to specific features — for example, showing that this customer''s churn score is driven 60% by low login frequency and 30% by a recent support ticket. Explainability is critical for executive adoption, regulatory compliance, and enabling the customer success team to have a meaningful retention conversation","Request that the CEO approve the model without seeing individual explanations"]'::jsonb,
   2, 'Random forests are ensemble models that are opaque by default, but post-hoc explainability tools like SHAP generate per-prediction feature attributions. These are essential for business adoption: the retention team needs to know why a customer is flagged to have a credible conversation; executives need to trust the reasoning, not just the AUC; and in regulated industries, unexplained decisions can be legally impermissible. High AUC without explainability is a deployment blocker in many business contexts.', 14, 'da:ai-analytics', '{}'::jsonb),

  -- Q15 Expert
  (qz, 'A data analyst is asked to evaluate whether an ML model or a simple business rule achieves better churn prediction. The current rule is: "flag any customer who has not logged in for 30 days." The ML model achieves precision=0.71, recall=0.65. The rule achieves precision=0.55, recall=0.80. Which should the business choose and what additional information is needed?',
   'The retention team calls flagged customers and has budget for 300 calls per month.',
   '["Always choose the ML model because it has higher precision","Always choose the rule because it has higher recall","The choice depends on the relative cost of a false positive (wasted call) vs. a false negative (missed churn). At 300 calls/month: the ML model delivers cleaner targeting (fewer wasted calls, higher precision) but misses more churners (lower recall); the rule catches more churners but wastes more calls. If the customer lifetime value is high and churn is expensive, higher recall (the rule) may be preferred. If call capacity is the binding constraint, higher precision (the model) is preferred. A cost-benefit analysis using CLV and call cost resolves the trade-off definitively","ML is always better than a rule-based approach"]'::jsonb,
   2, 'Neither metric dominates absolutely — the optimal choice depends on the business cost structure. If a missed churner costs $2,000 in lost CLV and a wasted call costs $20, recall is the priority and the simple rule wins on this dataset. If call capacity is the scarce resource, precision is the priority and the ML model wins. The professional answer is to quantify the trade-off explicitly using actual cost numbers rather than asserting that one metric or one approach is universally superior.', 15, 'da:ai-analytics', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 16 — Decision Intelligence  (da:decision-support)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 16 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 16'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 16 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1 Foundational
  (qz, 'What is decision intelligence as a discipline?',
   'A chief analytics officer is explaining to the board why the analytics team is rebranding as a "Decision Intelligence" function.',
   '["A synonym for business intelligence and dashboard reporting","The application of data science to automate all business decisions","A discipline that combines data analysis, behavioural science, and decision theory to improve the quality of human decisions — by framing choices clearly, quantifying trade-offs, and structuring options so that decision-makers can act on evidence rather than intuition alone","A specific software product category"]'::jsonb,
   2, 'Decision intelligence goes beyond reporting: it applies structured decision frameworks, quantitative analysis, and behavioural insights to help humans make better choices under uncertainty. It is not automation (replacing human decisions) nor is it simply BI (reporting what happened). It is the analytical practice of improving how people decide.', 1, 'da:decision-support', '{}'::jsonb),

  -- Q2 Foundational
  (qz, 'What is anchoring bias and how does it affect data-driven decision-making?',
   'A sales leader says "we need to hit $10M this quarter" at the start of a planning meeting, before any data is presented.',
   '["Anchoring bias is when analysts prefer charts over tables","Anchoring bias occurs when the first piece of information encountered (the anchor) disproportionately influences subsequent judgments — the $10M figure will make all subsequent estimates cluster around it regardless of what the data shows","Anchoring bias only affects financial professionals","Anchoring bias is eliminated by showing more data"]'::jsonb,
   1, 'Anchoring is a well-documented cognitive bias: the first number heard biases all subsequent estimates toward it. In a planning context, an anchor stated before data review causes the team to adjust insufficiently from the anchor even when the data supports a very different conclusion. Analysts must be aware of anchoring when facilitating data-driven discussions — starting with data before anchoring statements is a mitigation.', 2, 'da:decision-support', '{}'::jsonb),

  -- Q3 Foundational
  (qz, 'What is confirmation bias and why is it particularly dangerous in analytical work?',
   'An analyst is asked to "prove" that the new product launch was successful before presenting findings to the CEO.',
   '["Confirmation bias is the tendency to make decisions too quickly","Confirmation bias is the tendency to search for, interpret, and favour information that confirms pre-existing beliefs — leading analysts to emphasise supporting evidence and discount contradicting evidence","Confirmation bias only affects executives, not analysts","Confirmation bias is harmless if the original belief is probably correct"]'::jsonb,
   1, 'Confirmation bias is especially dangerous for analysts because they control what data is included, how it is framed, and what is highlighted. An analyst asked to "prove" success will unconsciously (or consciously) select metrics that confirm success and ignore those that contradict it. The professional standard is to present balanced evidence — confirming and disconfirming — and disclose the framing of the brief to stakeholders.', 3, 'da:decision-support', '{}'::jsonb),

  -- Q4 Foundational
  (qz, 'What is the availability heuristic and how does it distort executive decision-making?',
   'A CEO decides to cancel all remote work after reading two news articles about remote-work failures at competitors.',
   '["The tendency to choose the option with the most available data","The cognitive shortcut where people judge the likelihood or importance of events based on how easily examples come to mind — vivid, recent, or emotionally salient events are overweighted relative to their actual statistical frequency","A decision-making framework for resource allocation","A method for prioritising analytical tasks"]'::jsonb,
   1, 'The availability heuristic causes decision-makers to overweight information that is cognitively salient — memorable, recent, emotionally striking — regardless of its statistical representativeness. Two vivid competitor failures do not constitute evidence that remote work fails in general. Analysts counter this by bringing base-rate data to anchor judgments in statistical reality, not anecdote.', 4, 'da:decision-support', '{}'::jsonb),

  -- Q5 Foundational
  (qz, 'In a decision support framework, what does "framing the decision" involve?',
   'An executive team is about to vote on whether to enter a new market, but team members seem to be talking past each other.',
   '["Designing the slide deck for the presentation","Framing the decision means making the decision structure explicit: what is the specific question being decided, what are the feasible options, what criteria matter most, what are the key uncertainties, and who is the decision-maker — ensuring all parties are evaluating the same choice","Collecting all available data before any discussion","Assigning the decision to the most senior person in the room"]'::jsonb,
   1, 'Decision framing is a prerequisite for productive deliberation. Without it, people debate different interpretations of the question, compare options against different criteria, or anchor on incomplete option sets. A well-framed decision has: a clear question, an explicit option set, agreed evaluation criteria, identified uncertainties, and a named decision-maker. Analysts who facilitate this framing provide enormous value before a single data point is shown.', 5, 'da:decision-support', '{}'::jsonb),

  -- Q6 Applied
  (qz, 'An executive team must choose between three market expansion options: entering Brazil now, entering Brazil in 12 months, or not entering Brazil. How should a data analyst structure the analytical support for this decision?',
   'The strategy team has two weeks to prepare a recommendation.',
   '["Present all available data about Brazil and let the executives decide","Recommend the option the analyst personally finds most interesting","Build a decision matrix: define the evaluation criteria (market size, regulatory risk, competitive intensity, required investment, time-to-profit), score each option against each criterion using available data, weight criteria by strategic importance, and present a sensitivity analysis showing how the ranking changes if key assumptions shift","Ask the executives to vote without analysis"]'::jsonb,
   2, 'A decision matrix (or multi-criteria analysis) makes trade-offs explicit and systematic. Defining criteria before scoring prevents post-hoc rationalisation. Weighting criteria forces strategic priority conversations. Sensitivity analysis reveals which criteria drive the ranking — if "regulatory risk" weight changes the answer, that is the assumption most worth debating. This structure elevates the quality of the decision conversation.', 6, 'da:decision-support', '{}'::jsonb),

  -- Q7 Applied
  (qz, 'A data analyst is building a recommendation for the VP of Operations on whether to automate a manual process. The analyst favours automation. What is the most important practice to maintain analytical integrity?',
   'The analyst has been working on the automation project for three months and is emotionally invested in it.',
   '["Omit the risks of automation to make the recommendation stronger","Only present data that supports the automation case","Explicitly test the case against automation: quantify the costs, implementation risks, change management burden, and failure scenarios — present both the pro-automation evidence and the anti-automation evidence, and let the strength of the combined case speak for itself","Ask a colleague who also favours automation to review the analysis"]'::jsonb,
   2, 'Analytical integrity requires the analyst to be the strongest critic of their own recommendation. Pre-mortem thinking (what would have to be true for this to fail?) and adversarial testing (what is the best case for the status quo?) are professional obligations, not optional. A recommendation that only presents confirming evidence is advocacy, not analysis — and it will be rightly challenged by a rigorous executive audience.', 7, 'da:decision-support', '{}'::jsonb),

  -- Q8 Applied
  (qz, 'An analyst presents three options to the CFO: Option A (low cost, low impact), Option B (medium cost, medium impact), Option C (high cost, high impact). The CFO immediately says "obviously B." What should the analyst consider about this response?',
   'The decision has major long-term implications for the company''s technology infrastructure.',
   '["Accept the CFO''s choice immediately — executives always know best","Challenge the CFO''s authority publicly","The "middle option" is often chosen because of the compromise heuristic (avoid extremes) rather than because it is analytically optimal. The analyst should probe whether B is genuinely the best option given the company''s risk tolerance and strategic context, or whether the framing of A, B, C is anchoring the CFO to the middle — a structuring effect that the analyst should disclose","Redesign the options so Option A becomes Option B"]'::jsonb,
   2, 'The compromise effect (or extremeness aversion) is a well-documented cognitive bias: when three options are presented, the middle option is disproportionately chosen regardless of its objective merit. An analyst who presents three options should be aware that the choice of A and C defines the perceived extremes, which anchors B as "reasonable." If B is genuinely the best option, the analyst should be able to demonstrate this independently — not rely on positional framing.', 8, 'da:decision-support', '{}'::jsonb),

  -- Q9 Applied
  (qz, 'A company is making a capital allocation decision. The analyst has data suggesting Option A has a higher expected value but higher variance than Option B. How should this trade-off be presented to the executive team?',
   'Option A: expected NPV $8M, range $2M–$18M. Option B: expected NPV $5M, range $3M–$8M.',
   '["Just present the expected values — executives do not care about variance","Recommend Option B without showing Option A","Present both the expected value and the full range for each option, and frame the choice explicitly as a risk-return trade-off: Option A offers higher upside but also higher downside risk; Option B offers more predictable outcomes at a lower expected return. Ask the executive team about their risk tolerance and the organisation''s capacity to absorb the downside scenario","Always recommend the option with the higher expected value"]'::jsonb,
   2, 'Expected value alone is insufficient for capital decisions. Variance (risk) is equally important — organisations with low liquidity or high debt cannot afford the downside scenario even if the expected return is higher. Presenting the range and framing it as a risk-return trade-off gives the executive team the information they need to match the decision to the organisation''s risk appetite. Expected value maximisation is the right choice only for risk-neutral decision-makers, which most organisations are not.', 9, 'da:decision-support', '{}'::jsonb),

  -- Q10 Applied
  (qz, 'After completing an analysis, a data analyst disagrees with the decision the executive team makes. What is the professionally appropriate response?',
   'The analyst believes the chosen option has a 70% probability of underperforming based on the data.',
   '["Refuse to support the decision","Say nothing and implement the decision without comment","Clearly state the analytical concern once, with the specific evidence and the downside scenario quantified, so the decision-maker has the information on record — then support the decision professionally. Propose a monitoring plan with clear trigger metrics so the team can course-correct early if the downside scenario materialises","Leak the analysis to other stakeholders to override the decision"]'::jsonb,
   1, 'The analyst''s role is to inform, not to control decisions. The professional obligation is to ensure the decision-maker has heard the concern and the evidence — once, clearly, on the record. After that, the analyst supports the decision. A monitoring plan with pre-defined trigger thresholds transforms disagreement into a professional risk-management mechanism: if the analyst is right, the team will know early enough to course-correct.', 10, 'da:decision-support', '{}'::jsonb),

  -- Q11 Expert
  (qz, 'A CEO is considering a $15M acquisition. Due diligence data shows positive synergy projections but also significant integration risk. The CEO has personally championed this acquisition publicly for six months. Which cognitive bias is most likely to affect the quality of the decision, and what is the analyst''s mitigation?',
   'The board is relying on the analytics team to provide independent assessment.',
   '["Availability heuristic — mitigate by showing more examples of successful acquisitions","Anchoring bias — mitigate by presenting a lower acquisition price first","Commitment and escalation bias (sunk cost + ego investment) — the CEO''s public commitment makes it psychologically costly to reverse course. The analyst''s mitigation is to structure the analysis around forward-looking value (not past investment) and to present the integration risk scenarios in terms of expected total cost-of-failure, making the downside concrete enough to overcome commitment inertia","Recency bias — mitigate by showing older acquisition data"]'::jsonb,
   2, 'Escalation of commitment (related to sunk cost fallacy) is intensified by public commitment: the CEO has reputational skin in the game. Reversing the decision now costs face. The analytical mitigation is to reframe the decision prospectively — "given where we are today, what is the expected value of proceeding vs. stopping?" — and to quantify the failure scenarios concretely. Concrete downside numbers can overcome commitment inertia in a way that abstract risk statements cannot.', 11, 'da:decision-support', '{}'::jsonb),

  -- Q12 Expert
  (qz, 'A decision support analyst is asked to recommend whether to discontinue a product line. The data shows the product is losing $2M annually. However, the analyst discovers that 30% of the company''s most profitable customers use this product as part of a broader bundle. What is the correct analytical approach?',
   'The product line P&L looks clearly negative in isolation.',
   '["Recommend discontinuation based on the direct P&L — $2M loss is clear","Ignore the bundling effect because it is hard to quantify","Model the decision at the correct unit of analysis: the impact on total customer revenue and margin, not just the product P&L. Estimate the revenue at risk if bundle customers churn or downgrade when the product is discontinued, and compare the $2M direct loss against the potential loss of margin from the top-customer segment. The correct recommendation emerges from the net total impact","Ask customers whether they would leave if the product was discontinued"]'::jsonb,
   2, 'The product P&L is the wrong unit of analysis when the product has significant cross-sell interdependencies. Discontinuing a loss-leader that anchors high-margin bundle customers could cost far more than $2M in total margin. The analyst must model the portfolio effect. Customer surveys about churn are weak evidence (stated preference ≠ revealed preference). The correct analysis always matches the unit of analysis to the unit of decision.', 12, 'da:decision-support', '{}'::jsonb),

  -- Q13 Expert
  (qz, 'An executive asks an analyst to "just tell me what to do" on a strategic decision. What is the correct balance between providing a clear recommendation and preserving decision-maker agency?',
   'The analyst has completed a thorough analysis with a clear leading option.',
   '["Refuse to make a recommendation — that is the executive''s job","Give a recommendation and present it as the only rational choice","Provide a clear, specific recommendation with the analytical rationale, acknowledge the key uncertainties and the conditions under which a different option would be preferred, and explicitly invite the executive to bring information or priorities the analysis may not have captured — the analyst''s job is to reduce uncertainty and structure the choice, not to remove human judgment","Recommend the status quo to avoid risk"]'::jsonb,
   2, 'The best decision support is direct but not dogmatic. A clear recommendation reduces decision fatigue and demonstrates analytical confidence. Acknowledging uncertainty boundaries shows intellectual honesty. Inviting additional executive context respects that the decision-maker may have strategic, political, or relational information the analyst does not. This combination provides maximum value while preserving appropriate human authority over consequential decisions.', 13, 'da:decision-support', '{}'::jsonb),

  -- Q14 Expert
  (qz, 'A decision intelligence analyst is building a framework to help a hospital prioritise which patient safety interventions to fund. The options differ in cost, expected lives saved, implementation difficulty, and staff disruption. What framework best structures this multi-criteria decision?',
   'The hospital has a fixed budget of $2M and 12 intervention options on the table.',
   '["Fund the cheapest interventions until the budget is exhausted","Fund the intervention with the best single metric (e.g., lowest cost per life saved) and ignore other criteria","Use a weighted multi-criteria decision analysis (MCDA): define criteria (cost, expected lives saved, feasibility, disruption), assign weights reflecting the hospital''s values and constraints, score each intervention on each criterion, and optimise the portfolio of interventions within the $2M budget constraint — then test the sensitivity of the result to weight changes","Ask each clinical team to vote for their preferred intervention"]'::jsonb,
   2, 'MCDA (Multi-Criteria Decision Analysis) is the appropriate tool when decisions involve multiple incommensurable criteria and value trade-offs. Funding by cost alone ignores impact. Funding by a single metric ignores other legitimate criteria. Team voting introduces politics and anchoring effects. MCDA makes the value trade-offs explicit and auditable — critical in a public-health context where decisions must be defensible to regulators, staff, and the public.', 14, 'da:decision-support', '{}'::jsonb),

  -- Q15 Expert
  (qz, 'An analyst is asked to facilitate a decision that the executive team has been unable to reach consensus on for three months. What decision intelligence technique is most likely to break the impasse?',
   'The team agrees on the data but disagrees on which option to choose. Meetings keep ending without a decision.',
   '["Run another analysis with more data","Escalate to the board immediately","Use a structured decision dialogue: separate the factual disagreements from the value disagreements (the team likely agrees on data but disagrees on priorities), make the value weights explicit (e.g., ask each executive to allocate 100 points across criteria), surface where weights diverge, and re-run the decision model with each weight profile to show which option wins under which values — transforming an implicit values conflict into an explicit, resolvable trade-off conversation","Ask the CEO to decide unilaterally to end the delay"]'::jsonb,
   2, 'Persistent deadlock in the presence of agreed data is almost always a values conflict masquerading as a data dispute. Structured decision dialogues separate these two types of disagreement. Making value weights explicit (via point allocation or priority ranking) forces the latent conflict to the surface where it can be resolved. The decision model then shows transparently which option wins under each values configuration — converting an unproductive political stalemate into a productive conversation about organisational priorities.', 15, 'da:decision-support', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 17 — Data Storytelling  (da:data-storytelling)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 17 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 17'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 17 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1 Foundational
  (qz, 'What is the Pyramid Principle in the context of analytical communication?',
   'A data analyst is preparing a briefing for the VP of Marketing and wants to structure it effectively.',
   '["Start with background and methodology, then present findings, then conclude","Present all data first and let the audience draw conclusions","Lead with the single most important conclusion or recommendation, then provide the supporting arguments, then supply the detailed evidence — ensuring the audience understands the bottom line even if they only read the first slide","Structure communication as a narrative story with a problem and resolution at the end"]'::jsonb,
   2, 'The Pyramid Principle (Barbara Minto) structures communication with the conclusion first (the pyramid apex), supported by key arguments (second tier), each backed by evidence (base). This respects executive time: the conclusion is available immediately, and supporting detail is available for those who need it. Burying the conclusion at the end forces the audience to track details before knowing why they matter.', 1, 'da:data-storytelling', '{}'::jsonb),

  -- Q2 Foundational
  (qz, 'What is the difference between a data dump and a data story?',
   'An analyst emails the executive team a 47-page spreadsheet with the label "Q3 Analysis" every month.',
   '["A data story uses more charts; a data dump uses more tables","A data story is shorter than a data dump","A data dump presents raw or aggregated data without interpretive context; a data story structures the same data into a narrative that explains what happened, why it matters, and what should be done — turning information into insight and insight into action","There is no meaningful difference; both communicate data"]'::jsonb,
   2, 'A data dump transfers data; a data story creates meaning. The distinction is in interpretive layer: what happened (the data), why it matters (business context), and what to do next (recommendation). Without this layer, the audience must do the interpretive work themselves — which most executives will not, or will do inconsistently. The analyst''s value is precisely in that interpretive layer.', 2, 'da:data-storytelling', '{}'::jsonb),

  -- Q3 Foundational
  (qz, 'In a visual narrative for an executive audience, what is the role of the chart title?',
   'An analyst is redesigning a suite of monthly performance charts for the board pack.',
   '["The chart title should be the name of the metric (e.g., Revenue)","The chart title should describe the data source","The chart title should state the insight or finding (e.g., Revenue grew 18% YoY driven by enterprise segment) not just the metric name — so the audience understands the takeaway even without reading the chart in detail","The chart title is decorative and optional in executive presentations"]'::jsonb,
   2, 'Insight-driven titles (also called "action titles" or "headline titles") do the interpretive work for the audience. A title like "Revenue" tells the reader what is being measured; a title like "Enterprise segment drove 83% of Q3 revenue growth" tells them what to think about it. In an executive deck where time is scarce, insight titles ensure the conclusion is absorbed even if the chart body is skimmed.', 3, 'da:data-storytelling', '{}'::jsonb),

  -- Q4 Foundational
  (qz, 'What is an executive briefing format?',
   'A data analyst is asked to present findings to the C-suite in 10 minutes.',
   '["A detailed technical walkthrough of the analysis methodology","A document with all underlying data tables","A structured, highly condensed communication format that leads with the situation and key finding, presents 2-3 supporting evidence points, and closes with a clear recommendation and the specific decision or action requested — optimised for a time-constrained, high-authority audience","An informal chat with the executive over coffee"]'::jsonb,
   2, 'Executive briefings are optimised for time scarcity and decision authority. The canonical structure is: Situation (context, why this matters now), Complication (what has changed or what is the tension), Question (what decision does the audience need to make?), Answer (the recommendation), Support (key evidence). Methodology details, data tables, and informal conversations serve different purposes and different audiences.', 4, 'da:data-storytelling', '{}'::jsonb),

  -- Q5 Foundational
  (qz, 'What does it mean to build "analytical credibility" with an executive audience over time?',
   'A junior data analyst wants to become the go-to person for the CEO''s strategic data questions.',
   '["Produce more dashboards than any other analyst","Use the most advanced statistical methods in every analysis","Consistently deliver accurate, clearly communicated, and appropriately caveated analysis — being transparent about uncertainty, acknowledging when you are wrong, and never overstating confidence — so that the executive learns to trust your analytical judgment","Always agree with the executive''s existing view of the data"]'::jsonb,
   2, 'Analytical credibility is built through reliability and intellectual honesty over time. Executives test analysts by checking whether their predictions come true, whether they acknowledge errors, and whether they caveat appropriately. An analyst who overstates confidence once loses credibility that takes months to rebuild. An analyst who consistently says "here is what the data shows, here is what I am uncertain about, here is what I would watch" becomes a trusted advisor.', 5, 'da:data-storytelling', '{}'::jsonb),

  -- Q6 Applied
  (qz, 'An executive challenges your analysis by saying "that chart is misleading." How should the analyst respond?',
   'During a board presentation, the CFO says the Y-axis scale makes a small change look dramatic.',
   '["Defend the chart without engaging with the criticism","Agree and remove the chart from the presentation immediately","Engage directly: acknowledge the concern, explain the design choice (e.g., why the axis starts where it does), and offer to show the chart with a full zero-based Y-axis alongside the original — letting the evidence speak. If the CFO''s critique is valid, concede and correct it; if not, the side-by-side comparison makes the case transparently","Change the chart axis immediately during the presentation without discussion"]'::jsonb,
   2, 'Handling challenges to analysis requires intellectual honesty and composure. If the critique is valid (axis truncation does mislead), accept it transparently and correct it — this builds credibility. If the critique is incorrect, a calm, evidence-based response (showing both versions) is more persuasive than defensiveness. The worst outcome is either capitulating without investigation or doubling down without engagement.', 6, 'da:data-storytelling', '{}'::jsonb),

  -- Q7 Applied
  (qz, 'An analyst has 20 minutes to present a year-long project''s findings to the board. She has 60 slides of detailed analysis. How should she approach structuring the presentation?',
   'The board is known for interrupting presentations with questions within the first 5 minutes.',
   '["Present all 60 slides at double speed to ensure completeness","Remove all detail and present only one summary slide","Lead with a 3-slide executive summary (situation, key findings, recommendation) that can stand alone, then offer to go deeper into any section the board wants to probe — keeping the remaining 57 slides as an appendix the board can request","Ask the board to read all 60 slides in advance"]'::jsonb,
   2, 'The executive-summary-first structure with an appendix is the professional standard for board presentations. The first 3 slides must be able to stand alone — if the board only engages with those, the key message has been delivered. The appendix signals analytical rigour (the work is done) without forcing the board to sit through detail they did not request. This structure also accommodates the common pattern of a board that immediately dives into questions.', 7, 'da:data-storytelling', '{}'::jsonb),

  -- Q8 Applied
  (qz, 'A stakeholder responds to your recommendation with "the data could be interpreted differently." What is the best analytical response?',
   'You have just presented a recommendation to increase pricing, and a senior director disagrees.',
   '["Withdraw the recommendation to avoid conflict","Agree with the director and change your recommendation","Acknowledge that data often supports multiple interpretations, explain the analytical assumptions that led to this interpretation, present what the alternative interpretation would require to be true, and show which interpretation is better supported by the weight of evidence — then invite the director to bring additional data that might change the analysis","Insist your interpretation is the only valid one"]'::jsonb,
   2, 'Good analytical communication treats challenges as invitations to clarify reasoning, not attacks to defend against. Explaining your assumptions and what the alternative would require to be true moves the conversation from opinion to evidence. If the director has additional data, it should be welcomed. This approach demonstrates analytical confidence without rigidity — the hallmark of a trusted analytical advisor.', 8, 'da:data-storytelling', '{}'::jsonb),

  -- Q9 Applied
  (qz, 'What is the key difference between presenting "here is what the data shows" versus "here is what I recommend we do about it"?',
   'An analyst consistently presents findings without recommendations and executives say they want more from the data team.',
   '["There is no difference — the analyst''s job ends at data presentation","Recommendations require a different job title","Presenting data describes the past or current state; making a recommendation requires the analyst to synthesise the evidence, apply business judgment, and take an analytical position on the best course of action — this is the transition from analyst to analytical advisor, and it requires courage as well as skill because it involves being wrong","Recommendations should only be made by executives, never analysts"]'::jsonb,
   2, 'The gap between "data presentation" and "analytical recommendation" is the most common ceiling for data analyst career growth. Moving from describing to advising requires synthesising evidence into a position, which means being accountable for being wrong. Analysts who consistently stop at data presentation leave decision-making to executives without analytical support. Those who move to recommendation become strategic partners — which is what most executives say they want from their data function.', 9, 'da:data-storytelling', '{}'::jsonb),

  -- Q10 Applied
  (qz, 'How should a data analyst handle a situation where the data tells a story the executive sponsor does not want to hear?',
   'A new product launch has underperformed. The VP who championed it will receive the analyst''s findings.',
   '["Soften the findings to protect the VP''s feelings","Present only the positive aspects of the launch data","Present the findings honestly and completely, lead with what worked before addressing what underperformed, frame underperformance in terms of learnings and forward-looking actions, and deliver the message privately to the VP before any broader presentation so they are not blindsided in front of their peers","Delay publishing the findings until the situation improves"]'::jsonb,
   2, 'Analytical honesty is non-negotiable, but delivery craft matters. Leading with what worked before what underperformed is accurate and fair. Private pre-briefing the sponsor prevents public embarrassment and gives them the chance to process and engage constructively. Softening findings or delaying publication are integrity failures that ultimately damage both the analysis and the analyst''s credibility. The goal is honest findings delivered with professional sensitivity.', 10, 'da:data-storytelling', '{}'::jsonb),

  -- Q11 Expert
  (qz, 'An analyst presents a compelling data story that leads to a major strategic decision. Six months later the outcome is worse than the analysis predicted. How should the analyst respond?',
   'The analyst''s forecast had a 90% confidence interval that did not include the actual outcome.',
   '["Blame the executive team for implementing the strategy incorrectly","Claim the analysis was correct and the external environment was at fault","Conduct an honest post-mortem: was the outcome within the stated uncertainty bounds? Were the assumptions documented? Did new information arrive after the decision that was unknowable at the time? Present the findings transparently — including what the analysis got wrong and why — and update the forecasting approach. Intellectual honesty after a wrong call is the fastest way to rebuild trust","Quietly update the model and never discuss the miss"]'::jsonb,
   2, 'Analytical credibility is most tested when predictions fail. A transparent post-mortem that distinguishes between model error (wrong logic), assumption error (wrong inputs), and unforeseeable external shocks demonstrates intellectual integrity. Updating the approach publicly signals commitment to improvement. Covering up or deflecting responsibility destroys the trust that analytical credibility requires — trust built on accuracy alone is fragile; trust built on honesty is durable.', 11, 'da:data-storytelling', '{}'::jsonb),

  -- Q12 Expert
  (qz, 'A senior analyst is presenting to a board that includes both data-literate members (the CFO, a former data scientist) and data-unfamiliar members (the independent non-executive directors). How should the presentation be designed?',
   'The analyst has one presentation slot and cannot split the audience.',
   '["Pitch to the most data-literate members and let others follow along","Use only simple charts and no statistics to keep the lowest-literacy members engaged","Design the main narrative for the broadest audience (clear language, business-centric framing, insight-led titles, minimal jargon) and include a technical appendix with methodology, statistical details, and model diagnostics for the data-literate members who will want to go deeper — brief both audiences in the same session","Ask the data-unfamiliar members to leave the room during technical sections"]'::jsonb,
   2, 'Mixed-literacy executive audiences require layered communication: the main deck serves the broadest audience with clarity and insight framing; the appendix serves technically sophisticated members who need methodological detail to trust the conclusions. This approach is inclusive and efficient — no one is bored or lost in the main session, and no one leaves without the depth they need. Excluding or ignoring either segment is both impractical and counterproductive.', 12, 'da:data-storytelling', '{}'::jsonb),

  -- Q13 Expert
  (qz, 'An analyst is asked to present the same findings in three different formats: a 10-minute executive briefing, a 2-page memo, and a Slack message. What principle should guide the adaptation?',
   'The same underlying analysis on customer acquisition cost needs to reach three different audiences at three different speeds.',
   '["Use the same content in all three formats and change only the visual design","The 10-minute briefing should be the memo printed on a screen","For each format, lead with the most critical insight appropriate to that medium and audience attention span: the Slack message carries the single headline finding and a link; the memo carries the situation, 3 key findings, recommendation, and next steps; the briefing carries the full narrative with supporting evidence and interactive Q&A — the analysis is the same; the editorial judgment about what to prioritise changes by format","Create three completely different analyses for each format"]'::jsonb,
   2, 'The underlying analysis is constant; the editorial curation varies by format and attention-span. A Slack message must earn attention in 2 seconds — one headline, one link. A memo earns 5–10 minutes of focused reading — structured argument. A briefing earns 10 minutes of presence and dialogue. The skill is knowing what to include, what to subordinate, and what to omit for each format — not creating three separate analyses.', 13, 'da:data-storytelling', '{}'::jsonb),

  -- Q14 Expert
  (qz, 'An analyst''s recommendation is overruled and the executive team chooses a different option. Three months later, leading indicators suggest the analyst''s original recommendation would have performed better. What is the professionally appropriate action?',
   'The analyst has been tracking the metrics she recommended as success indicators.',
   '["Say nothing — the decision has been made","Immediately send an "I told you so" email to the executive team","Bring the data forward through the normal reporting channel: present the performance data objectively, note that the metrics are trending toward the risk scenario that was flagged in the original analysis, and provide an updated recommendation for corrective action — without blaming or self-congratulating. The goal is course-correction, not credit","Wait until the situation becomes a crisis before raising it"]'::jsonb,
   2, 'The analyst''s obligation to the organisation does not end when a recommendation is overruled. When leading indicators signal a problem, bringing the data forward promptly (through normal channels, not an adversarial message) enables early course-correction — which is far less costly than waiting for a crisis. Framing the update around corrective action rather than retrospective blame is both more effective and more professionally appropriate.', 14, 'da:data-storytelling', '{}'::jsonb),

  -- Q15 Expert
  (qz, 'A data analyst wants to influence a major strategic decision but has no formal authority over the decision-makers. What is the most effective approach to build influence through analytical work?',
   'The analyst sits three levels below the strategic decision-makers and has no budget or direct access.',
   '["Wait to be promoted before attempting to influence strategy","Produce more dashboards and hope decision-makers notice","Build influence through the quality and reliability of analytical insights: consistently frame analysis in terms of business outcomes the decision-maker cares about, pre-empt their questions, deliver accurate predictions, acknowledge uncertainty transparently, and build a track record of being right on the metrics that matter most — trust built through repeated accuracy is the most durable form of analytical influence","Send unsolicited strategy memos to the CEO"]'::jsonb,
   2, 'Influence without authority in analytical roles is earned through credibility, not hierarchy. The path is: frame work in the language of the decision-maker''s priorities, be accurate and transparent over time, develop a reputation for intellectual honesty (including when wrong), and ensure your analysis reaches the decision chain through the appropriate channels. Trust built on repeated analytical accuracy is more durable than any formal authority — and it is the only form of influence available to analysts at junior levels.', 15, 'da:data-storytelling', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 18 — Data Governance & Ethics  (da:data-ethics)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 18 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 18'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 18 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1 Foundational
  (qz, 'What does "purpose limitation" mean under GDPR?',
   'A marketing team wants to use customer email addresses collected for order confirmations to send promotional newsletters.',
   '["Personal data can be used for any purpose once collected","Data subjects must provide written consent for every new use of their data","Personal data collected for a specific, explicitly stated purpose may not be used for a different, incompatible purpose without obtaining new consent or a separate legal basis","Purpose limitation only applies to health data"]'::jsonb,
   2, 'GDPR Article 5(1)(b) requires that personal data be "collected for specified, explicit and legitimate purposes and not further processed in a manner incompatible with those purposes." Using order-confirmation email addresses for marketing is a new purpose that requires a separate legal basis (e.g., opt-in consent). Purpose limitation is not restricted to health data and does not require written consent for every use — only for new, incompatible purposes.', 1, 'da:data-ethics', '{}'::jsonb),

  -- Q2 Foundational
  (qz, 'What is data minimisation as a GDPR principle?',
   'An e-commerce app collects date of birth, gender, full address, phone number, and social security number during checkout even though only an email and shipping address are needed to fulfil orders.',
   '["Storing the minimum number of database records","Compressing data files to use less storage space","Collecting only the personal data that is adequate, relevant, and limited to what is necessary for the specified processing purpose","Deleting all data after 30 days"]'::jsonb,
   2, 'GDPR Article 5(1)(c) mandates that personal data be "adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed." Collecting SSN, gender, and date of birth for a standard e-commerce checkout that only needs email and shipping address violates data minimisation. It is about the scope of collection, not file size or retention period.', 2, 'da:data-ethics', '{}'::jsonb),

  -- Q3 Foundational
  (qz, 'Under GDPR, what is the "right to erasure" (right to be forgotten)?',
   'A former customer emails a company requesting that all their personal data be deleted.',
   '["Companies are never required to delete customer data","The right to have all data deleted immediately in all circumstances","The right of a data subject to request deletion of their personal data when it is no longer necessary for the original purpose, consent has been withdrawn, or the data has been unlawfully processed — subject to legal exceptions such as compliance obligations or freedom of expression","The right to have data deleted only from marketing databases"]'::jsonb,
   2, 'GDPR Article 17 grants individuals the right to request erasure when specific grounds apply (no longer necessary, consent withdrawn, unlawful processing, etc.). It is not absolute — exceptions include data needed for compliance with legal obligations, legal claims, or public interest. Companies cannot refuse all erasure requests, nor must they delete data in every circumstance regardless of legal obligations.', 3, 'da:data-ethics', '{}'::jsonb),

  -- Q4 Foundational
  (qz, 'What is historical bias in algorithmic systems?',
   'A hiring algorithm trained on 10 years of historical hiring decisions consistently recommends fewer female candidates for senior engineering roles.',
   '["Bias introduced by the algorithm designers consciously","Bias that occurs when a model is trained on data that reflects past human decisions that were themselves biased — embedding and perpetuating those historical inequities in automated decisions","Bias that only appears in financial models","Bias that can be eliminated by collecting more data"]'::jsonb,
   1, 'Historical bias occurs when training data reflects discriminatory patterns from the past (e.g., a culture that promoted fewer women into senior roles). The model learns these patterns as "correct" and perpetuates them. Collecting more of the same biased historical data amplifies, not eliminates, the problem. Addressing historical bias requires data rebalancing, fairness constraints, or fundamentally different training data.', 4, 'da:data-ethics', '{}'::jsonb),

  -- Q5 Foundational
  (qz, 'In a data governance framework, what is the role of a Data Owner?',
   'A company is setting up a formal data governance structure for the first time.',
   '["The person who physically stores the data on servers","The IT administrator who manages database access rights","The senior business leader who is accountable for the quality, appropriate use, and fitness-for-purpose of a specific data domain — they make decisions about who can access the data and for what purpose","The data analyst who built the dashboard using that data"]'::jsonb,
   2, 'The Data Owner is a senior business accountable role — they own the business decisions around a data domain (e.g., the VP of Finance owns financial data). They are distinct from the Data Steward (who ensures quality) and the Data Custodian (IT, who manages storage and access infrastructure). Analysts who consume the data are neither owners nor stewards in the governance sense.', 5, 'da:data-ethics', '{}'::jsonb),

  -- Q6 Applied
  (qz, 'A data analyst discovers that a loan approval model has an approval rate of 73% for white applicants and 41% for Black applicants with similar credit profiles. What type of bias is most likely present and what is the correct response?',
   'The model was trained on 15 years of loan approval decisions from the company''s own history.',
   '["Selection bias — the sample is too small","Measurement bias — the credit scores are wrong","Historical (or societal) bias embedded in the training data: 15 years of loan decisions likely reflects prior discriminatory lending practices, which the model has learned as signal. The correct response is to: flag the disparate impact immediately, conduct a full fairness audit, remove or correct the biased signal from the training data, apply fairness constraints, and engage legal/compliance — disparate impact in lending is a regulatory violation in most jurisdictions","No action is needed because the model uses the same algorithm for all applicants"]'::jsonb,
   2, 'Using the same algorithm for all applicants does not guarantee fairness if the training data encodes historical discrimination. The 32-percentage-point approval gap on similar credit profiles is a textbook disparate impact finding. In regulated lending (e.g., US Fair Housing Act, Equal Credit Opportunity Act), disparate impact is illegal regardless of intent. The model must be audited, the bias source identified, and the model corrected before continued use.', 6, 'da:data-ethics', '{}'::jsonb),

  -- Q7 Applied
  (qz, 'An analyst is building a predictive model for employee performance. What is measurement bias and how might it appear in this context?',
   'The model uses manager ratings as the ground-truth label for "high performance."',
   '["Measurement bias occurs when the sample size is too small","Measurement bias occurs when the labels or features used to represent a construct are themselves biased measurements of that construct — manager ratings of performance may reflect recency bias, in-group favouritism, or proximity bias rather than true performance","Measurement bias only occurs in medical studies","Measurement bias is eliminated by normalising the rating scale"]'::jsonb,
   1, 'Measurement bias arises when what we measure is not a valid proxy for what we intend to measure. Manager performance ratings are subjective and known to reflect biases: managers tend to rate people they interact with more (proximity), people similar to themselves (affinity), and people they remember most recently (recency). A model trained on biased labels will predict "who managers rate highly" not "who performs well." Normalising the scale does not remove systematic bias from the ratings.', 7, 'da:data-ethics', '{}'::jsonb),

  -- Q8 Applied
  (qz, 'What is "privacy by design" and when should it be applied in an analytics project?',
   'A data team is starting a new project that will involve processing health records for predictive modelling.',
   '["A privacy review conducted after the project launches","A setting in the database that encrypts all data automatically","An approach where privacy protections are built into the system and analytical process from the beginning — including data minimisation, pseudonymisation, access controls, and retention policies — rather than added as an afterthought after a privacy incident","A compliance checkbox completed once per year"]'::jsonb,
   2, 'Privacy by design (GDPR Article 25) requires that data protection be embedded into system architecture and analytical processes from inception — not retrofitted after the fact. For a health records project, this means designing minimised data collection, pseudonymisation before analysis, role-based access control, clear retention and deletion policies, and privacy impact assessment before any processing begins. Compliance checkboxes and post-launch reviews are insufficient substitutes.', 8, 'da:data-ethics', '{}'::jsonb),

  -- Q9 Applied
  (qz, 'A company''s data warehouse contains a lineage gap: analysts cannot trace where a key revenue figure comes from. Why is data lineage important and what is the risk of this gap?',
   'The CFO has asked the data team to certify the accuracy of the annual revenue figure used in the investor report.',
   '["Data lineage is only important for compliance audits","Data lineage — the documented record of where data originated and how it was transformed at each step — is essential for trusting and certifying data. Without it, the team cannot verify whether the revenue figure is correct, identify where an error was introduced, or meet audit requirements. The risk is certifying an incorrect number in a regulated filing","Data lineage is only required for customer data","Data lineage gaps can be resolved by running the query again"]'::jsonb,
   1, 'Data lineage documents the provenance of every data point: source system → transformations → final value. Without it, there is no way to verify that a certified revenue figure is correct, trace the source of an error, or satisfy auditors who require traceability. For a number in an investor report, lineage is not optional — misreporting investor-facing financials can result in regulatory penalties and legal liability.', 9, 'da:data-ethics', '{}'::jsonb),

  -- Q10 Applied
  (qz, 'A data analyst discovers that a model currently in production is making systematically biased decisions against a protected group. They report it to their manager, who says "do not worry about it — it is performing well on the overall accuracy metric." What should the analyst do?',
   'The model affects credit decisions for thousands of customers per month.',
   '["Accept the manager''s assessment and continue","Only raise the issue if a customer complains directly","Escalate through the appropriate internal channel (e.g., the data ethics committee, legal/compliance, or a formal risk escalation process) with documented evidence of the disparate impact. If internal channels are exhausted without action, the analyst should seek legal advice about external reporting obligations — systemic bias in credit decisions is a regulatory and ethical violation that the analyst cannot responsibly ignore","Delete the model without telling anyone"]'::jsonb,
   1, 'Overall accuracy masking disparate group impact is the most common argument used to dismiss bias findings. A data analyst who discovers material bias in a credit model has both an ethical obligation and potentially a legal one (depending on jurisdiction) to escalate. The escalation path is: internal channels first (compliance, legal, ethics committee), with documented evidence. If those fail, legal advice about external obligations (whistleblower protections vary by jurisdiction). Silently deleting the model without disclosure is both insubordinate and potentially legally problematic.', 10, 'da:data-ethics', '{}'::jsonb),

  -- Q11 Expert
  (qz, 'A company wants to comply with a GDPR right-to-erasure request, but the customer''s data is embedded in a trained machine learning model. What is the correct approach?',
   'The customer''s data was used to train a fraud detection model that has been in production for two years.',
   '["Ignore the erasure request because ML models are exempt from GDPR","Delete only the raw training data — the model itself does not contain personal data","This is an active area of regulatory interpretation. If the model can reproduce or reveal the individual''s data (memorisation), it may need to be retrained or the customer''s data removed via machine unlearning techniques. The company should document the technical challenge, consult legal counsel on the applicable interpretation, delete the raw personal data immediately, and assess whether model retraining is required under the specific supervisory authority''s guidance","Tell the customer their data was anonymised when it was used for training"]'::jsonb,
   2, 'ML model erasure is genuinely complex: models trained on personal data can, in some cases, memorise and reproduce training examples. Regulatory guidance varies by supervisory authority. The defensible approach is: delete the raw data immediately (straightforward), assess whether the model memorises individual data (technical privacy audit), consult legal counsel on the authority''s current interpretation, and document the steps taken. Claiming blanket exemption or assuring anonymisation without verification are both legally risky positions.', 11, 'da:data-ethics', '{}'::jsonb),

  -- Q12 Expert
  (qz, 'A fintech company uses a third-party credit scoring model. The model vendor will not disclose the model''s features or logic. A customer is denied credit and asks why. What are the company''s obligations under GDPR and ethical best practice?',
   'The company operates in the EU and the denial is based solely on the automated model score.',
   '["The company has no obligation to explain a third-party model","Tell the customer the model is proprietary and nothing can be disclosed","Under GDPR Article 22, individuals have the right not to be subject to solely automated decisions that significantly affect them, and the right to obtain human review and a meaningful explanation of the logic involved. The company cannot outsource this obligation to the vendor — if the vendor''s black box prevents meaningful explanation, the company must either obtain the necessary transparency from the vendor or cease using the model for automated decisions","Provide the customer with the model''s overall accuracy statistics as the explanation"]'::jsonb,
   2, 'GDPR Article 22 grants data subjects the right to human review of significant automated decisions and the right to "meaningful information about the logic involved." This obligation falls on the data controller (the fintech company), not the vendor. Vendor opacity is not a valid defense. The company must either negotiate model transparency with the vendor or use an explainable alternative. Overall accuracy statistics do not constitute a meaningful individual-level explanation.', 12, 'da:data-ethics', '{}'::jsonb),

  -- Q13 Expert
  (qz, 'A Data Steward discovers that a core business dataset has a 12% null rate in a field that should never be null, and the issue has been present for six months undetected. What are the Data Steward''s responsibilities in this situation?',
   'The field in question feeds the company''s revenue recognition calculation.',
   '["Fix the nulls by filling them with zeros and say nothing","Raise the issue only at the next quarterly governance meeting","Immediately investigate the root cause (upstream pipeline failure? source system change?), assess the downstream impact on all reports and calculations using the field, notify affected Data Owners and business stakeholders, quarantine or flag affected data until it is corrected, document the incident and remediation in the data quality log, and implement automated checks to detect the issue in future","Wait for an analyst to notice and report it"]'::jsonb,
   2, 'The Data Steward is responsible for data quality in their domain. A 12% null rate in a revenue recognition field is a material data quality failure with potential financial reporting implications. The response is immediate: root-cause investigation, downstream impact assessment, stakeholder notification, data quarantine, and remediation — not deferral. The documentation and automated monitoring prevent recurrence. Filling nulls with zeros silently corrupts the data further.', 13, 'da:data-ethics', '{}'::jsonb),

  -- Q14 Expert
  (qz, 'An analyst is working with a dataset that was originally collected for customer service improvement but is now being proposed for use in a performance management model that could result in employee terminations. What ethical and legal issues does this raise?',
   'The dataset includes employee call recordings and interaction logs from a customer service team.',
   '["No issues — the data exists and can be used for any internal purpose","The only issue is technical — ensuring the model is accurate","This raises purpose limitation concerns (GDPR: using data beyond its original purpose), employee privacy rights (depending on jurisdiction, employees may have rights regarding how their interactions are used for employment decisions), potential for algorithmic bias in performance assessment, and the ethical question of using data collected under one expectation (service improvement) for decisions with serious personal consequences (termination). The project requires legal review, employee notification or consent, and a fairness audit before proceeding","The company owns the data so it can be used however it likes"]'::jsonb,
   2, 'Re-purposing customer-service interaction data for employment decisions is a significant escalation in data use with serious implications. GDPR purpose limitation may require new legal basis. Employment law in many jurisdictions requires informing employees if their work is subject to automated monitoring. Using interaction data as a performance proxy introduces measurement bias (not all interactions are equivalent). And using data collected without disclosure of potential employment consequences raises fundamental trust and fairness concerns.', 14, 'da:data-ethics', '{}'::jsonb),

  -- Q15 Expert
  (qz, 'A senior data analyst is building an algorithmic system that will allocate healthcare resources — prioritising which patients receive follow-up calls from nurses. The system performs well on overall accuracy but the analyst notices it consistently deprioritises elderly patients with multiple chronic conditions. What is the correct professional and ethical response?',
   'The system is about to go live in a network of 50 clinics serving 200,000 patients.',
   '["Launch the system because overall accuracy is high","Adjust the system to also deprioritise young healthy patients to balance the error rates","Halt the launch: the bias toward deprioritising elderly multi-morbid patients — likely the highest-need population — is an ethically critical failure that could cause serious patient harm. Conduct a comprehensive fairness audit across all demographic subgroups, redefine the optimisation objective to include equity of resource allocation alongside efficiency, engage clinical ethics and legal counsel, and retest before deployment","Report the bias only after launch once more data is collected"]'::jsonb,
   2, 'Healthcare resource allocation is among the highest-stakes applications of algorithmic decision-making. A system that systematically deprioritises elderly patients with multiple chronic conditions — the patients most likely to benefit from follow-up care — inverts the clinical purpose of the intervention. High overall accuracy is irrelevant when the errors are concentrated in the most vulnerable population. The professional and ethical obligation is to halt deployment, conduct a rigorous equity audit, redesign the objective function, and obtain clinical ethics review before any live use.', 15, 'da:data-ethics', '{}'::jsonb);

END $$;


-- =============================================================================
-- Verification
-- =============================================================================
SELECT c.order_index AS module, c.title AS module_title,
       count(qq.id) AS total_questions
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.quizzes qz ON qz.chapter_id = c.id AND qz.quiz_type = 'chapter_end'
LEFT JOIN public.quiz_questions qq ON qq.quiz_id = qz.id
WHERE co.title = 'AI Data Analyst & Decision Intelligence Professional'
  AND c.order_index BETWEEN 10 AND 18
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
