-- =============================================================================
-- AI Data Analyst & Decision Intelligence Professional — Course Structure
-- Creates: course + 10 chapters + 5 video stubs per chapter + 10 quiz shells
-- curriculum_version: da-v1
-- Apply: paste into Supabase SQL Editor → Run BEFORE content migrations
-- =============================================================================

DO $$
DECLARE
  v_da_id UUID;
  v_ch    UUID;
BEGIN

  -- ── 1. Course ────────────────────────────────────────────────────────────────
  SELECT id INTO v_da_id FROM public.courses
    WHERE title = 'AI Data Analyst & Decision Intelligence Professional'
      AND curriculum_version = 'da-v1';
  IF v_da_id IS NULL THEN
    INSERT INTO public.courses (title, description, is_published, is_flagship,
        flagship_version, curriculum_version, launch_status,
        target_market, target_salary_low, target_salary_high, translations)
    VALUES (
      'AI Data Analyst & Decision Intelligence Professional',
      'Master SQL, data modeling, statistics, visualization, BI, forecasting, AI-assisted analytics, executive decision support, data storytelling, and data governance. 10 modules, 50 lessons — from data fundamentals to executive-level decision intelligence.',
      false, true, 'da-v1', 'da-v1', 'draft',
      'Career-changers and professionals moving into data analysis and decision intelligence roles',
      75000, 175000, '{}'::jsonb)
    RETURNING id INTO v_da_id;
    RAISE NOTICE 'Created DA course: %', v_da_id;
  ELSE
    RAISE NOTICE 'DA course already exists: %', v_da_id;
  END IF;

  -- ── Helper: create chapter + 5 video stubs + quiz shell ─────────────────────

  -- MODULE 1 — SQL & Data Querying Foundations  (da:sql)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 1;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'SQL & Data Querying Foundations',
      'Master the analyst''s most essential tool: SQL. From basic queries to window functions, CTEs, and query optimization — the language every data analyst must speak fluently.', 1, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Database Fundamentals and the Analyst''s SQL Toolkit', 'Relational databases, tables, keys, and your SQL environment.', 1, '{}'::jsonb),
    (v_ch, 'SELECT, FROM, WHERE — Querying Data with Precision', 'Filtering, sorting, and selecting data with precision.', 2, '{}'::jsonb),
    (v_ch, 'Joins and Aggregations', 'INNER/LEFT/RIGHT joins, GROUP BY, HAVING, COUNT, SUM, AVG.', 3, '{}'::jsonb),
    (v_ch, 'Window Functions and CTEs', 'ROW_NUMBER, RANK, LAG, LEAD, PARTITION BY, and Common Table Expressions.', 4, '{}'::jsonb),
    (v_ch, 'SQL for Business Analysis — Real-World Patterns', 'Cohort analysis, funnel analysis, retention, and revenue reporting in SQL.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- MODULE 2 — Data Modeling & Preparation  (da:data-modeling)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 2;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Data Modeling & Preparation',
      'Data is never analysis-ready out of the box. Master schemas, data cleaning, wrangling, ETL pipelines, and data quality validation — the unglamorous work that separates good analysts from great ones.', 2, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Understanding Data Structures and Schemas', 'Star schemas, snowflake schemas, normalized vs. denormalized data models.', 1, '{}'::jsonb),
    (v_ch, 'Data Cleaning and Wrangling Techniques', 'Handling nulls, duplicates, outliers, inconsistent formats, and dirty data.', 2, '{}'::jsonb),
    (v_ch, 'ETL Fundamentals and Data Pipelines', 'Extract, Transform, Load: how data moves from source to analytical store.', 3, '{}'::jsonb),
    (v_ch, 'Data Quality Assessment and Validation', 'Completeness, accuracy, consistency, timeliness — the DAMA quality dimensions.', 4, '{}'::jsonb),
    (v_ch, 'Building Analytical Data Models', 'Designing tables and relationships optimized for analytical queries.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- MODULE 3 — Statistics & Analytical Methods  (da:statistics)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 3;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Statistics & Analytical Methods',
      'Numbers without statistical thinking lie. Master descriptive statistics, probability, hypothesis testing, A/B testing, and regression — the analytical bedrock every data analyst must own.', 3, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Descriptive Statistics — Distributions and Central Tendency', 'Mean, median, mode, variance, standard deviation, distributions, and skewness.', 1, '{}'::jsonb),
    (v_ch, 'Probability and Inferential Statistics', 'Probability fundamentals, sampling, confidence intervals, the Central Limit Theorem.', 2, '{}'::jsonb),
    (v_ch, 'Hypothesis Testing and Statistical Significance', 'Null and alternative hypotheses, p-values, Type I/II errors, statistical power.', 3, '{}'::jsonb),
    (v_ch, 'A/B Testing and Experimental Design', 'Designing experiments, sample size calculation, running and reading A/B tests.', 4, '{}'::jsonb),
    (v_ch, 'Correlation, Regression, and Causation', 'Linear regression, R-squared, correlation vs. causation, confounders.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- MODULE 4 — Data Visualization Mastery  (da:visualization)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 4;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Data Visualization Mastery',
      'A chart that confuses is worse than no chart. Master the principles, tools, and design thinking behind visualizations that make executives act and decisions get made.', 4, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Principles of Effective Data Visualization', 'Pre-attentive attributes, cognitive load, Gestalt principles, and visual clarity.', 1, '{}'::jsonb),
    (v_ch, 'Choosing the Right Chart for the Right Question', 'Bar, line, scatter, heatmap, waterfall, and when to use each — and when not to.', 2, '{}'::jsonb),
    (v_ch, 'Building Dashboards with Power BI', 'Power BI fundamentals: data model, measures, visuals, slicers, and publishing.', 3, '{}'::jsonb),
    (v_ch, 'Tableau for Business Analysts', 'Tableau Desktop: connecting data, calculated fields, LOD expressions, dashboards.', 4, '{}'::jsonb),
    (v_ch, 'Design Principles for Executive Audiences', 'Decluttering, color theory, annotation, and designing for a 10-second read.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- MODULE 5 — Business Intelligence & Reporting  (da:bi)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 5;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Business Intelligence & Reporting',
      'BI is not just dashboards — it is the organizational system that delivers the right information to the right decision-maker at the right time. Build it right and the business runs on data.', 5, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'BI Architecture and the Modern Data Stack', 'Data warehouse, data lake, lakehouse: the modern BI infrastructure landscape.', 1, '{}'::jsonb),
    (v_ch, 'KPIs, Metrics, and Semantic Models', 'Defining KPIs, building semantic models, ensuring consistent metric definitions.', 2, '{}'::jsonb),
    (v_ch, 'Self-Service BI and Governed Analytics', 'Balancing user empowerment with data governance — the self-serve BI paradox.', 3, '{}'::jsonb),
    (v_ch, 'Building Executive Reporting Cadences', 'Daily, weekly, monthly executive reporting: format, frequency, and content design.', 4, '{}'::jsonb),
    (v_ch, 'BI Governance and Data Literacy', 'Promoting data literacy, managing BI sprawl, and governing the analytics environment.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- MODULE 6 — Forecasting & Predictive Analytics  (da:forecasting)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 6;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Forecasting & Predictive Analytics',
      'Leaders do not want to know what happened — they want to know what will happen. Master time-series forecasting, regression modeling, and scenario analysis to give executives the foresight they need.', 6, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Time Series Fundamentals for Business Analysts', 'Trends, seasonality, cycles, and irregular components in time-series data.', 1, '{}'::jsonb),
    (v_ch, 'Moving Averages, Smoothing, and Decomposition', 'Simple and exponential moving averages, STL decomposition, removing noise.', 2, '{}'::jsonb),
    (v_ch, 'Regression Models for Business Forecasting', 'Linear and multiple regression for business forecasting — assumptions and pitfalls.', 3, '{}'::jsonb),
    (v_ch, 'Scenario Planning and Sensitivity Analysis', 'Base, bull, and bear scenarios; sensitivity tables; tornado diagrams.', 4, '{}'::jsonb),
    (v_ch, 'Communicating Forecast Uncertainty to Stakeholders', 'Confidence intervals, forecast ranges, and why expressing uncertainty builds trust.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- MODULE 7 — AI-Augmented Analytics  (da:ai-analytics)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 7;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'AI-Augmented Analytics',
      'AI does not replace the data analyst — it amplifies them. Master NL-to-SQL, automated insight, ML fundamentals, and AI-assisted analysis to work 10× faster without sacrificing analytical integrity.', 7, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Natural Language to SQL — AI as Your Coding Partner', 'Using LLMs to generate, debug, and optimize SQL queries at speed.', 1, '{}'::jsonb),
    (v_ch, 'Automated Insight and Anomaly Detection', 'AI tools that surface patterns, outliers, and trends automatically.', 2, '{}'::jsonb),
    (v_ch, 'Machine Learning Fundamentals for Analysts', 'Supervised vs. unsupervised learning, classification, clustering — conceptual mastery without code.', 3, '{}'::jsonb),
    (v_ch, 'Augmented Analytics Platforms', 'Copilot in Power BI, Einstein Analytics, Tableau AI — evaluating AI-native BI tools.', 4, '{}'::jsonb),
    (v_ch, 'Prompt Engineering for Data Analysis', 'Designing prompts that produce accurate, auditable, analysis-grade outputs.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- MODULE 8 — Executive Decision Support  (da:decision-support)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 8;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Executive Decision Support',
      'The highest-value analyst does not just produce data — they frame decisions. Master the decision intelligence framework, recommendation logic, and the decision brief that gets executives to act.', 8, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'From Data to Decision — The Decision Intelligence Framework', 'Decision types, decision quality vs. outcome quality, reversible vs. irreversible decisions.', 1, '{}'::jsonb),
    (v_ch, 'Structuring Complex Business Decisions', 'Decision trees, MECE framing, options structuring, and criteria weighting.', 2, '{}'::jsonb),
    (v_ch, 'Building Recommendation Logic', 'How to move from analysis to a defensible recommendation with evidence.', 3, '{}'::jsonb),
    (v_ch, 'Uncertainty, Risk, and Decision Quality', 'Expected value, risk tolerance, cognitive biases in data-driven decisions.', 4, '{}'::jsonb),
    (v_ch, 'The Decision Brief — The Analyst''s Most Powerful Deliverable', 'One-page decision brief format: situation, options, recommendation, risks, ask.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- MODULE 9 — Data Storytelling & Communication  (da:data-storytelling)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 9;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Data Storytelling & Communication',
      'Analysis that does not communicate is analysis that does not matter. Master the craft of translating complex data into compelling narratives that move executives to action.', 9, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Why Data Analysts Fail in Meetings (and How to Fix It)', 'The data dump problem: why showing everything you found is always wrong.', 1, '{}'::jsonb),
    (v_ch, 'The Pyramid Principle for Data Presentations', 'Lead with the insight, not the methodology. SCR (Situation-Complication-Resolution) structure.', 2, '{}'::jsonb),
    (v_ch, 'Narrative Structure for Analytical Insights', 'Building the analytical story arc: context, conflict, resolution, and call to action.', 3, '{}'::jsonb),
    (v_ch, 'Designing Executive-Ready Reports and Decks', 'One-page report design, executive deck structure, annotation and callouts.', 4, '{}'::jsonb),
    (v_ch, 'Handling Pushback, Questions, and Data Skeptics', 'How to defend your analysis, handle "the data is wrong," and build data trust.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- MODULE 10 — Data Governance, Quality & Ethics  (da:data-ethics)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 10;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Data Governance, Quality & Ethics',
      'Data power carries data responsibility. Master governance frameworks, privacy compliance, algorithmic bias, and the ethics mindset that makes analysts trusted stewards of organizational data.', 10, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Data Quality Dimensions — The Foundation of Trust', 'Completeness, accuracy, consistency, timeliness, validity, and uniqueness (DAMA-DMBOK).', 1, '{}'::jsonb),
    (v_ch, 'Data Governance Frameworks (DAMA-DMBOK)', 'Data stewardship, ownership, policies, and the governance operating model.', 2, '{}'::jsonb),
    (v_ch, 'Privacy, Compliance, and Responsible Data Use', 'GDPR, CCPA, data minimization, consent, and the analyst''s legal obligations.', 3, '{}'::jsonb),
    (v_ch, 'Bias in Data and Algorithmic Fairness', 'Sources of bias in data and models, fairness metrics, and the analyst''s role in prevention.', 4, '{}'::jsonb),
    (v_ch, 'Building a Data Culture — The Analyst as Ethics Champion', 'Data literacy, ethical frameworks, speaking truth to power, and building organizational trust.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

END $$;

-- =============================================================================
-- VERIFICATION — expected: 10 rows, each with 5 lessons and a quiz shell
-- =============================================================================
SELECT
  c.order_index AS module,
  c.title AS module_title,
  (SELECT COUNT(*) FROM public.videos v WHERE v.chapter_id = c.id) AS lessons,
  (SELECT COUNT(*) FROM public.quizzes q WHERE q.chapter_id = c.id AND q.quiz_type = 'chapter_end') AS quiz_shells
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
WHERE co.title = 'AI Data Analyst & Decision Intelligence Professional'
ORDER BY c.order_index;
