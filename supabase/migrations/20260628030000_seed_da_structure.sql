-- =============================================================================
-- AI Data Analyst & Decision Intelligence Professional — Course Structure (18 modules)
-- Creates: course + 18 chapters + 5 video stubs per chapter + 18 quiz shells
-- curriculum_version: da-v1
-- Module map (competency → modules):
--   da:sql          M1 (intro) · M2 (foundations) · M3 (advanced)
--   da:data-modeling M4 (schemas) · M5 (ETL & cleaning)
--   da:statistics   M6 (descriptive) · M7 (hypothesis testing)
--   da:visualization M8 (principles) · M9 (Power BI / Tableau)
--   da:bi           M10 (architecture) · M11 (reporting & governance)
--   da:forecasting  M12 (time series) · M13 (predictive analytics)
--   da:ai-analytics M14 (NL-to-SQL & insight) · M15 (ML fundamentals)
--   da:decision-support M16
--   da:data-storytelling M17
--   da:data-ethics  M18 (capstone)
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
      'Master SQL, data modeling, statistics, visualization, BI, forecasting, AI-assisted analytics, executive decision support, data storytelling, and data governance. 18 modules, 90 lessons — from data fundamentals to executive-level decision intelligence.',
      false, true, 'da-v1', 'da-v1', 'draft',
      'Career-changers and professionals moving into data analysis and decision intelligence roles',
      75000, 175000, '{}'::jsonb)
    RETURNING id INTO v_da_id;
    RAISE NOTICE 'Created DA course: %', v_da_id;
  ELSE
    RAISE NOTICE 'DA course already exists: %', v_da_id;
  END IF;

  -- ── MODULE 1 — Introduction to Data Analysis & the Analyst''s Mindset (da:sql)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 1;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Introduction to Data Analysis & the Analyst''s Mindset',
      'What data analysts actually do, how they think, and where SQL fits in the analyst''s toolkit. The foundations of analytical thinking, the data-to-insight pipeline, and relational databases.', 1, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'What Data Analysts Do — Role, Impact, and Career Path', 'The analyst''s role in modern organizations, career ladder, and how data drives business decisions.', 1, '{}'::jsonb),
    (v_ch, 'The Data-to-Insight Pipeline', 'How raw data becomes business decisions: collection, storage, processing, analysis, visualization.', 2, '{}'::jsonb),
    (v_ch, 'Relational Databases and SQL Fundamentals', 'Tables, rows, columns, primary keys, foreign keys, and the relational model.', 3, '{}'::jsonb),
    (v_ch, 'Your SQL Environment — Tools and Setup', 'SQL editors, BigQuery, PostgreSQL, Redshift — setting up your analytical environment.', 4, '{}'::jsonb),
    (v_ch, 'Thinking Like a Data Analyst', 'Question framing, analytical curiosity, avoiding common traps, and building a data mindset.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 2 — SQL Foundations: SELECT, Joins & Aggregations (da:sql)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 2;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'SQL Foundations — SELECT, Joins & Aggregations',
      'The core SQL vocabulary every analyst uses daily: SELECT with filtering and sorting, all join types, GROUP BY aggregations, and HAVING. Building readable, correct queries from the start.', 2, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'SELECT, FROM, WHERE — Querying Data with Precision', 'Filtering rows, selecting columns, ordering results, and using aliases.', 1, '{}'::jsonb),
    (v_ch, 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN', 'When and how to use each join type with real business examples.', 2, '{}'::jsonb),
    (v_ch, 'GROUP BY, HAVING, and Aggregate Functions', 'COUNT, SUM, AVG, MIN, MAX — summarizing data at the group level.', 3, '{}'::jsonb),
    (v_ch, 'Subqueries and Derived Tables', 'Nesting queries, correlated subqueries, and when to use them.', 4, '{}'::jsonb),
    (v_ch, 'SQL for Business Questions — Applied Practice', 'Revenue by region, customer counts, retention rates — solving real business questions with SQL.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 3 — SQL Mastery: Window Functions, CTEs & Query Optimization (da:sql)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 3;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'SQL Mastery — Window Functions, CTEs & Query Optimization',
      'Advanced SQL that separates junior from senior analysts: window functions for running totals and rankings, CTEs for readable complex queries, and query optimization for production-scale data.', 3, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Window Functions — ROW_NUMBER, RANK, DENSE_RANK', 'Ranking rows within partitions without collapsing the result set.', 1, '{}'::jsonb),
    (v_ch, 'LAG, LEAD, and Running Totals', 'Comparing rows to previous/next rows and calculating cumulative metrics.', 2, '{}'::jsonb),
    (v_ch, 'Common Table Expressions (CTEs) and Recursive Queries', 'WITH clauses for readable, maintainable complex queries.', 3, '{}'::jsonb),
    (v_ch, 'Query Optimization and Execution Plans', 'Indexes, query plans, avoiding full scans, and writing efficient SQL at scale.', 4, '{}'::jsonb),
    (v_ch, 'Advanced SQL Patterns — Cohorts, Funnels, and Retention', 'Cohort analysis, conversion funnels, and churn/retention in SQL.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 4 — Data Structures, Schemas & Relational Modeling (da:data-modeling)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 4;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Data Structures, Schemas & Relational Modeling',
      'How data is stored and structured for analysis: relational models, star and snowflake schemas, normalization vs. denormalization, and designing tables optimized for analytical queries.', 4, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'The Relational Model — Tables, Keys, and Constraints', 'Primary keys, foreign keys, unique constraints, and referential integrity.', 1, '{}'::jsonb),
    (v_ch, 'Star Schema and Snowflake Schema', 'Fact tables, dimension tables, and the two dominant analytical data models.', 2, '{}'::jsonb),
    (v_ch, 'Normalization vs. Denormalization', 'When to normalize (OLTP) vs. denormalize (OLAP) — and why analysts care.', 3, '{}'::jsonb),
    (v_ch, 'Data Types, Null Handling, and Integrity', 'Choosing appropriate data types, handling NULLs, and enforcing data integrity.', 4, '{}'::jsonb),
    (v_ch, 'Building Analytical Data Models', 'Designing schemas for reporting, dashboards, and self-serve analytics.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 5 — Data Cleaning, ETL & Pipeline Fundamentals (da:data-modeling)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 5;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Data Cleaning, ETL & Pipeline Fundamentals',
      'Data is never analysis-ready out of the box. Master cleaning, wrangling, ETL pipelines, data quality assessment, and the unglamorous work that separates reliable analysis from misleading reports.', 5, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Diagnosing Dirty Data — Common Data Quality Problems', 'Nulls, duplicates, inconsistent formats, outliers, and how to find them.', 1, '{}'::jsonb),
    (v_ch, 'Data Cleaning Techniques — SQL and Python', 'COALESCE, CASE, string cleaning, deduplication, and type casting.', 2, '{}'::jsonb),
    (v_ch, 'ETL Fundamentals — Extract, Transform, Load', 'How data moves from source systems to analytical stores.', 3, '{}'::jsonb),
    (v_ch, 'Data Quality Dimensions — DAMA Framework', 'Completeness, accuracy, consistency, timeliness, validity, and uniqueness.', 4, '{}'::jsonb),
    (v_ch, 'Data Pipeline Monitoring and Validation', 'Automated quality checks, alerting on pipeline failures, and data contracts.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 6 — Descriptive Statistics & Probability for Analysts (da:statistics)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 6;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Descriptive Statistics & Probability for Analysts',
      'The statistical foundation every analyst needs: distributions, central tendency, spread, correlation, and probability — applied to real business data, not textbook examples.', 6, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Descriptive Statistics — Mean, Median, Mode, Variance', 'Summarizing distributions and understanding central tendency vs. spread.', 1, '{}'::jsonb),
    (v_ch, 'Distributions — Normal, Skewed, and Long-Tail', 'How data distributes, what that means for analysis, and common patterns.', 2, '{}'::jsonb),
    (v_ch, 'Correlation vs. Causation', 'The most important distinction in analytics — and how to talk about it.', 3, '{}'::jsonb),
    (v_ch, 'Probability Fundamentals for Analysts', 'Conditional probability, Bayes'' theorem, and probabilistic thinking.', 4, '{}'::jsonb),
    (v_ch, 'Sampling, Confidence Intervals, and Estimation', 'How to draw valid conclusions from samples and quantify uncertainty.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 7 — Inferential Statistics, Hypothesis Testing & A/B Experiments (da:statistics)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 7;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Inferential Statistics, Hypothesis Testing & A/B Experiments',
      'Testing whether observed differences are real or random: hypothesis tests, p-values, statistical power, and designing A/B experiments that produce trustworthy business decisions.', 7, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Hypothesis Testing — Null Hypothesis, p-value, Significance', 'What statistical significance means (and doesn''t mean) for business decisions.', 1, '{}'::jsonb),
    (v_ch, 'T-tests, Chi-Square, and ANOVA', 'Choosing the right test for comparing means, proportions, and multiple groups.', 2, '{}'::jsonb),
    (v_ch, 'Statistical Power and Sample Size', 'How to avoid underpowered experiments and false negatives.', 3, '{}'::jsonb),
    (v_ch, 'Designing A/B Tests for Business', 'Randomization, control groups, metrics, and avoiding common A/B pitfalls.', 4, '{}'::jsonb),
    (v_ch, 'Interpreting and Communicating Statistical Results', 'Translating p-values and confidence intervals into business language.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 8 — Data Visualization Principles & Chart Design (da:visualization)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 8;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Data Visualization Principles & Chart Design',
      'The principles that separate great visualizations from misleading or confusing ones: preattentive attributes, chart selection, design hierarchy, and building visuals that communicate clearly.', 8, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Why Most Charts Fail — Common Visualization Mistakes', 'Misleading scales, chartjunk, wrong chart types, and how to avoid them.', 1, '{}'::jsonb),
    (v_ch, 'Chart Selection Framework — Which Chart for Which Story', 'Bar, line, scatter, area, heatmap, waterfall — when to use each.', 2, '{}'::jsonb),
    (v_ch, 'Preattentive Attributes and Visual Hierarchy', 'Color, position, size, shape — how the brain processes visual information.', 3, '{}'::jsonb),
    (v_ch, 'Designing for Your Audience', 'Executive summaries vs. exploratory analysis — matching the visual to the consumer.', 4, '{}'::jsonb),
    (v_ch, 'From Data to Visual Story — Applied Design Process', 'Building a visualization that answers a question, not just displays data.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 9 — Power BI, Tableau & Interactive Dashboard Development (da:visualization)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 9;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Power BI, Tableau & Interactive Dashboard Development',
      'Building production-grade dashboards in Power BI and Tableau: connecting to data sources, calculated fields, filters, interactivity, and publishing self-serve analytics for business users.', 9, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Power BI Fundamentals — Data Model, Visuals, DAX Basics', 'Connecting data, building relationships, and creating calculated measures.', 1, '{}'::jsonb),
    (v_ch, 'Tableau Fundamentals — Workbooks, Views, and Calculated Fields', 'Dimensions, measures, LOD expressions, and building interactive views.', 2, '{}'::jsonb),
    (v_ch, 'Dashboard Design and Layout', 'Dashboard composition, filter placement, drill-downs, and navigation.', 3, '{}'::jsonb),
    (v_ch, 'Publishing, Sharing, and Scheduling Reports', 'Power BI Service, Tableau Server, scheduled refreshes, and permissions.', 4, '{}'::jsonb),
    (v_ch, 'Building a Self-Serve Analytics Product', 'Designing dashboards business users can explore without analyst help.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 10 — Business Intelligence Architecture, KPIs & Semantic Models (da:bi)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 10;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Business Intelligence Architecture, KPIs & Semantic Models',
      'How BI systems are architected: data warehouses, semantic layers, KPI frameworks, and the structures that let analysts answer any business question quickly and reliably.', 10, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Data Warehouse Architecture — Layers and Zones', 'Raw, staging, marts, and the modern lakehouse pattern.', 1, '{}'::jsonb),
    (v_ch, 'Semantic Models and Business Metrics Layers', 'dbt, LookML, Power BI datasets — the layer between data and dashboard.', 2, '{}'::jsonb),
    (v_ch, 'KPI Framework Design', 'Defining good KPIs: specific, measurable, owned, and aligned to business outcomes.', 3, '{}'::jsonb),
    (v_ch, 'Building a Single Source of Truth', 'Avoiding metric divergence and building trusted, consistent reporting.', 4, '{}'::jsonb),
    (v_ch, 'BI Governance — Versioning, Testing, and Documentation', 'dbt tests, lineage documentation, and change management for data models.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 11 — Executive Reporting, Self-Serve BI & BI Governance (da:bi)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 11;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Executive Reporting, Self-Serve BI & BI Governance',
      'Delivering analytics at organizational scale: building executive report packages, enabling self-serve analytics, governing BI assets, and managing the reporting cadence.', 11, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Executive Report Design — What Leaders Need to See', 'The executive report vs. the analyst report — different purpose, different design.', 1, '{}'::jsonb),
    (v_ch, 'Self-Serve Analytics — Enabling Business Users', 'Training users, designing intuitive data products, and reducing analyst bottlenecks.', 2, '{}'::jsonb),
    (v_ch, 'Reporting Cadence and Stakeholder Management', 'Daily/weekly/monthly/quarterly reporting rhythms and managing stakeholder expectations.', 3, '{}'::jsonb),
    (v_ch, 'BI Asset Governance — Ownership, Certification, and Deprecation', 'Who owns what, how dashboards get certified, and cleaning up the BI estate.', 4, '{}'::jsonb),
    (v_ch, 'Measuring BI Impact — Are People Actually Using the Data?', 'Dashboard adoption, usage analytics, and measuring the ROI of analytics investment.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 12 — Forecasting & Time Series Analysis (da:forecasting)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 12;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Forecasting & Time Series Analysis',
      'Predicting the future from historical patterns: time series decomposition, moving averages, seasonality, trend analysis, and building reliable business forecasts.', 12, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Time Series Fundamentals — Components and Decomposition', 'Trend, seasonality, cyclicality, and residuals — the four components of a time series.', 1, '{}'::jsonb),
    (v_ch, 'Moving Averages and Smoothing Techniques', 'Simple MA, exponential smoothing, and when to use each.', 2, '{}'::jsonb),
    (v_ch, 'Seasonality Detection and Adjustment', 'Identifying and removing seasonal patterns to see the underlying trend.', 3, '{}'::jsonb),
    (v_ch, 'Building Business Forecasts', 'Revenue forecasting, demand planning, and capacity forecasting.', 4, '{}'::jsonb),
    (v_ch, 'Forecast Accuracy — MAPE, MAE, RMSE', 'How to measure and communicate forecast quality.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 13 — Predictive Analytics, Regression & Scenario Planning (da:forecasting)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 13;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Predictive Analytics, Regression & Scenario Planning',
      'Beyond time series: regression models for prediction, scenario planning frameworks, sensitivity analysis, and presenting forecasts under uncertainty to business leaders.', 13, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Linear and Multiple Regression for Business', 'Predicting outcomes from multiple variables — without a statistics PhD.', 1, '{}'::jsonb),
    (v_ch, 'Regression Diagnostics — Assumptions and Validity', 'Linearity, homoscedasticity, multicollinearity — checking your model is trustworthy.', 2, '{}'::jsonb),
    (v_ch, 'Scenario Planning and Sensitivity Analysis', 'Best case / base case / worst case — structuring executive decision support.', 3, '{}'::jsonb),
    (v_ch, 'Communicating Forecasts Under Uncertainty', 'Confidence intervals, probability language, and presenting uncertainty without undermining credibility.', 4, '{}'::jsonb),
    (v_ch, 'Forecasting Tools — Excel, Python, and BI Platform Integration', 'Building forecasts in tools analysts actually use.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 14 — AI-Augmented Analytics: NL-to-SQL & Automated Insight (da:ai-analytics)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 14;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'AI-Augmented Analytics — NL-to-SQL & Automated Insight',
      'Using AI to accelerate analytical work: natural language to SQL, automated insight detection, AI-powered data prep, and augmenting — not replacing — analytical judgment.', 14, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Natural Language to SQL — How It Works and Its Limits', 'Using AI to generate SQL queries: where it excels and where it fails.', 1, '{}'::jsonb),
    (v_ch, 'Automated Insight Detection Tools', 'AI-powered outlier detection, trend alerts, and anomaly notifications.', 2, '{}'::jsonb),
    (v_ch, 'AI-Assisted Data Cleaning and Preparation', 'Using AI to accelerate the unglamorous 80% of analyst work.', 3, '{}'::jsonb),
    (v_ch, 'Prompt Engineering for Data Analysis', 'Getting reliable analytical outputs from AI models — structured prompting for analysts.', 4, '{}'::jsonb),
    (v_ch, 'Validating AI-Generated Analysis', 'How to catch errors in AI outputs before they reach stakeholders.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 15 — Machine Learning Fundamentals for Data Analysts (da:ai-analytics)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 15;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Machine Learning Fundamentals for Data Analysts',
      'What analysts need to know about ML — without becoming data scientists: supervised vs. unsupervised learning, classification vs. regression, model evaluation, and when to hand off to data science.', 15, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Supervised vs. Unsupervised Learning', 'Labelled vs. unlabelled data, and what problems each type solves.', 1, '{}'::jsonb),
    (v_ch, 'Classification Models — Decision Trees, Logistic Regression', 'Predicting categorical outcomes and interpreting classification results.', 2, '{}'::jsonb),
    (v_ch, 'Clustering and Segmentation', 'K-means, customer segmentation, and finding natural groups in data.', 3, '{}'::jsonb),
    (v_ch, 'Model Evaluation — Accuracy, Precision, Recall, F1, AUC', 'Choosing the right metric for the business problem.', 4, '{}'::jsonb),
    (v_ch, 'When to Use ML vs. SQL Analytics — and How to Collaborate with Data Science', 'The analyst''s role in ML projects and knowing when to hand off.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 16 — Executive Decision Support & Decision Intelligence (da:decision-support)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 16;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Executive Decision Support & Decision Intelligence',
      'Structuring analytical outputs to support high-stakes organizational decisions: decision framing, options analysis, recommendation logic, and the analyst''s role in the executive decision room.', 16, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Decision Intelligence — From Data to Decision', 'How analysis becomes a decision: the full decision support workflow.', 1, '{}'::jsonb),
    (v_ch, 'Framing Decisions — Options, Criteria, and Trade-offs', 'Structuring complex decisions so executives can make them quickly.', 2, '{}'::jsonb),
    (v_ch, 'Building the Recommendation', 'How to structure an analytical recommendation that drives action.', 3, '{}'::jsonb),
    (v_ch, 'Cognitive Biases in Decision-Making', 'Common traps executives and analysts fall into — and how data helps.', 4, '{}'::jsonb),
    (v_ch, 'The Analyst in the Executive Room', 'How to present analysis, handle challenges, and build decision credibility.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 17 — Data Storytelling & Executive Communication (da:data-storytelling)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 17;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Data Storytelling & Executive Communication',
      'The craft of making data persuasive: the pyramid principle, visual narrative structure, executive briefings, handling challenges to your analysis, and building trust with leadership.', 17, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'The Pyramid Principle for Data Presentations', 'Conclusion first, then evidence — structuring presentations the way executives think.', 1, '{}'::jsonb),
    (v_ch, 'Visual Narrative — The Story Arc in Data', 'Context, tension, resolution — turning charts into a narrative that compels action.', 2, '{}'::jsonb),
    (v_ch, 'The Executive Briefing Format', 'One-page summaries, three-slide decks, and the art of saying more with less.', 3, '{}'::jsonb),
    (v_ch, 'Handling Questions and Challenges', 'How to defend your analysis under pressure while staying open to being wrong.', 4, '{}'::jsonb),
    (v_ch, 'Building Analytical Credibility Over Time', 'How analysts earn the trust of leadership and become the go-to insight source.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  -- ── MODULE 18 — Data Governance, Ethics & Capstone (da:data-ethics)
  SELECT id INTO v_ch FROM public.chapters WHERE course_id = v_da_id AND order_index = 18;
  IF v_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (v_da_id, 'Data Governance, Ethics & Capstone',
      'The analyst''s ethical and governance obligations: privacy law, algorithmic bias, data minimization, responsible disclosure, data ownership roles, and the capstone project integrating all program competencies.', 18, '{}'::jsonb)
    RETURNING id INTO v_ch;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations) VALUES
    (v_ch, 'Data Privacy Law — GDPR, CCPA, and the Analyst''s Obligations', 'What privacy regulations require and what they mean for day-to-day analytical work.', 1, '{}'::jsonb),
    (v_ch, 'Algorithmic Bias — Types, Sources, and Detection', 'Historical, measurement, and selection bias in analytical models.', 2, '{}'::jsonb),
    (v_ch, 'Data Governance Roles — Owner, Steward, Custodian', 'The governance org chart and what each role is responsible for.', 3, '{}'::jsonb),
    (v_ch, 'Responsible Disclosure and Ethical Decision-Making', 'When to escalate, when to push back, and how to handle data ethics dilemmas.', 4, '{}'::jsonb),
    (v_ch, 'Capstone — Full-Cycle Data Analysis Project', 'End-to-end project: SQL data extraction, cleaning, statistical analysis, visualization, and executive briefing.', 5, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (v_ch, 'chapter_end', 80);
  END IF;

  RAISE NOTICE 'DA 18-module structure complete.';

END $$;

-- =============================================================================
-- VERIFICATION — Expected: 18 chapters, 5 videos each, 18 quizzes
-- =============================================================================
SELECT
  c.order_index                                       AS module,
  c.title                                             AS chapter_title,
  COUNT(DISTINCT v.id)                                AS videos,
  COUNT(DISTINCT q.id) FILTER (WHERE q.quiz_type = 'chapter_end') AS quiz_shells
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.videos v ON v.chapter_id = c.id
LEFT JOIN public.quizzes q ON q.chapter_id = c.id
WHERE co.title = 'AI Data Analyst & Decision Intelligence Professional'
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
