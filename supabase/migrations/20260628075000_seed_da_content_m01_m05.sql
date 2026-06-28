-- =============================================================================
-- DA Lesson Content — Modules 1–5 (18-module structure)
-- Course: AI Data Analyst & Decision Intelligence Professional (da-v1)
-- Apply AFTER: 20260628030000_seed_da_structure.sql
-- =============================================================================

DO $$
DECLARE
  v_da_id UUID;
  v_ch    UUID;
BEGIN
  SELECT id INTO v_da_id FROM public.courses
    WHERE title = 'AI Data Analyst & Decision Intelligence Professional'
      AND curriculum_version = 'da-v1';
  IF v_da_id IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 1 — Introduction to Data Analysis & the Analyst's Mindset (OFFSET 0)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_da_id ORDER BY order_index LIMIT 1 OFFSET 0;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M1 chapter not found'; END IF;

  UPDATE public.videos SET
    description = 'The analyst role in modern organizations, career ladder, and how data drives every business decision.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'What Data Analysts Do — Role, Impact, and Career Path',
      'description', 'The analyst role in modern organizations, career ladder, and how data drives every business decision.',
      'transcript', 'WHAT DATA ANALYSTS DO — ROLE, IMPACT, AND CAREER PATH

WHY THIS MATTERS

Data analysts are among the most in-demand professionals in the global workforce. Every organization — from startups to governments — is generating more data than it can make sense of. Your job as an analyst is to turn that data into decisions that move the organization forward.

This lesson establishes what that actually means in practice: what you will be asked to do, how your work creates value, and what the career path looks like from junior analyst to senior roles.

THE CORE ROLE

A data analyst answers business questions with data. That sounds simple, but it contains multitudes.

The business question might come from a marketing director asking "which customer segment has the highest lifetime value?" or a COO asking "where are we losing efficiency in our supply chain?" or a product manager asking "why did our activation rate drop last month?"

Your job is to take these questions, find the right data, apply the right methods, and produce an answer that the decision-maker can act on. Not a spreadsheet of numbers — an answer. There is a difference.

THE VALUE CHAIN

Data analysts sit at the intersection of data and decisions. The value chain works like this:

Data is collected — from transactions, user behavior, sensors, surveys, CRMs, ERPs, and dozens of other sources.

Data is stored — in databases, data warehouses, and data lakes.

Data is processed — cleaned, transformed, and structured for analysis.

Data is analyzed — by you, using SQL, Python, and BI tools.

Insights are communicated — in dashboards, reports, and presentations.

Decisions are made — by executives, managers, and operators who use your insights.

Value is created — in revenue, cost savings, efficiency, or customer satisfaction.

You live in steps 4 and 5. But you need to understand steps 1 through 3 to do your job well, because data quality problems originate upstream, and you cannot debug a bad answer without tracing it back to a bad source.

THE CAREER PATH

Junior Data Analyst: You are learning the tools and building technical fluency. You handle defined queries, build dashboards to spec, and support senior analysts. Focus: accuracy and speed.

Mid-Level Data Analyst: You own analytical projects end-to-end. You translate business questions to data questions independently. You start building relationships with business stakeholders. Focus: impact and communication.

Senior Data Analyst: You set the analytical agenda for a domain or team. You mentor juniors. You influence strategy. Focus: insight quality and organizational influence.

Lead / Principal Analyst: You define methodology, own the data culture, and operate as a strategic partner to the C-suite. Some analysts move into data science, analytics engineering, or product analytics at this point.

The most important thing to understand early: technical skill gets you in the room. Communication skill determines what happens once you are there. Both matter equally.

DELIVERABLE: Write down three business decisions you have seen made — at work, in news, or in a case study. For each one, identify what data could have made that decision better. This exercise trains the most important analyst habit: seeing the data opportunity in every decision.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET
    description = 'How raw data becomes business decisions: collection, storage, processing, analysis, visualization, and action.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The Data-to-Insight Pipeline',
      'description', 'How raw data becomes business decisions: collection, storage, processing, analysis, visualization, and action.',
      'transcript', 'THE DATA-TO-INSIGHT PIPELINE

WHY THIS MATTERS

Before you write a single line of SQL, you need to understand the system you are operating in. Data does not arrive at your desk clean, structured, and ready to analyze. It travels through a pipeline — and every stage of that pipeline introduces opportunities for things to go wrong.

Understanding the pipeline makes you a better analyst because you can diagnose problems at their source, you can communicate with data engineers and architects, and you can set appropriate expectations about data freshness and accuracy.

THE PIPELINE STAGES

STAGE 1 — DATA COLLECTION

Data originates from many sources: transactional databases (every purchase, every login), web and app event tracking (clicks, page views, session duration), IoT sensors (temperature, location, usage), CRMs and ERPs (customers, inventory, employees), and third-party data providers (demographics, market data).

The quality of your analysis is fundamentally bounded by the quality of collection. If events are not tracked, if transactions are not captured, if sensors fail — you cannot analyze what you do not have.

STAGE 2 — DATA STORAGE

Raw data lands in a storage layer. This might be a relational database (PostgreSQL, MySQL), a cloud data warehouse (BigQuery, Redshift, Snowflake), or a data lake (S3, GCS). Each has different strengths for analytical workloads.

As an analyst, you need to know where your data lives and how it is organized. The storage architecture determines what queries are possible and how fast they run.

STAGE 3 — DATA PROCESSING

Raw data is rarely in the right shape for analysis. It needs to be cleaned (handle nulls, fix inconsistencies), transformed (calculate derived fields, join tables), and aggregated (roll up to the right grain). This is the ETL/ELT layer, often owned by data engineers.

STAGE 4 — ANALYSIS

This is your primary domain. You query processed data using SQL, explore it with Python or R, and apply statistical methods to find patterns, test hypotheses, and answer questions.

STAGE 5 — VISUALIZATION AND COMMUNICATION

Raw analytical output — tables of numbers, statistical summaries — is not usable by most decision-makers. You translate your findings into charts, dashboards, and narratives that communicate clearly and drive action.

STAGE 6 — DECISION AND ACTION

The pipeline only creates value when it changes a decision or enables an action. An insight that sits in a report nobody reads is worth nothing. Your job ends when someone acts on what you found.

THE FEEDBACK LOOP

The pipeline is not linear — it is a feedback loop. Decisions generate new questions. New questions require new data. New data reveals gaps in collection. The loop improves over time if analysts and data engineers collaborate well.

DELIVERABLE: Map the data pipeline for one process you know well — a purchase flow, a customer onboarding, or a marketing campaign. Identify every stage from collection to decision. This is the mental model you will use for every analytical project.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET
    description = 'Tables, rows, columns, primary keys, foreign keys, and the relational model — the foundation of every SQL query.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Relational Databases and SQL Fundamentals',
      'description', 'Tables, rows, columns, primary keys, foreign keys, and the relational model — the foundation of every SQL query.',
      'transcript', 'RELATIONAL DATABASES AND SQL FUNDAMENTALS

WHY THIS MATTERS

SQL is the language of data. Every analyst uses it daily. But SQL is a language for querying relational databases — and to write good SQL, you need to understand what a relational database is and how it organizes data.

This lesson gives you the conceptual foundation that makes SQL intuitive rather than mysterious.

THE RELATIONAL MODEL

A relational database organizes data into tables. Each table represents one entity: customers, orders, products, employees. Each row in the table represents one instance of that entity. Each column represents one attribute.

This sounds simple, but the relational model has three properties that make it powerful:

Structured: data has a defined schema — column names, data types, constraints. This makes it predictable and queryable.

Related: tables can be linked to each other through keys. The orders table can reference the customers table. This eliminates redundancy and enables complex queries.

Queryable: SQL gives you a standard, expressive language to ask any question the data can answer — without writing custom code for every query.

TABLES, ROWS, AND COLUMNS

A table is a grid of data. The columns define what attributes are tracked. The rows contain the actual data.

Example: a customers table might have columns for customer_id, name, email, signup_date, and country. Each row is one customer. If you have 50,000 customers, you have 50,000 rows.

PRIMARY KEYS

A primary key is a column (or combination of columns) that uniquely identifies each row. In the customers table, customer_id is the primary key — no two customers have the same ID.

Primary keys enforce uniqueness. They also serve as the anchor for relationships between tables.

FOREIGN KEYS

A foreign key is a column in one table that references the primary key of another table. In an orders table, customer_id is a foreign key referencing the customers table.

Foreign keys define relationships. They tell the database: "every order belongs to a customer." This relationship is what makes JOINs possible — and JOINs are how analysts connect information across tables.

SQL — THE QUERY LANGUAGE

SQL (Structured Query Language) is the standard interface for relational databases. It lets you express questions as queries: SELECT what you want, FROM where it lives, WHERE certain conditions are met.

SQL was designed to be readable. A well-written SQL query reads almost like English: "SELECT customer name FROM customers WHERE country is France AND signup date is after 2024."

DELIVERABLE: Find a relational database diagram (also called an ERD — Entity Relationship Diagram) for a system you use — a CRM, an e-commerce platform, or a public dataset. Identify three tables, their primary keys, and at least two foreign key relationships. This exercise builds the schema-reading skill you will use constantly.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET
    description = 'SQL editors, BigQuery, PostgreSQL, Redshift — setting up your analytical environment for the course.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Your SQL Environment — Tools and Setup',
      'description', 'SQL editors, BigQuery, PostgreSQL, Redshift — setting up your analytical environment for the course.',
      'transcript', 'YOUR SQL ENVIRONMENT — TOOLS AND SETUP

WHY THIS MATTERS

SQL is universal — it runs on dozens of different database systems. But each system has its own dialect, its own tools, and its own quirks. Setting up your environment correctly from the start saves hours of frustration later.

This lesson walks you through the main SQL environments you will encounter as a data analyst and helps you get ready to write your first queries.

THE MAIN SQL ENVIRONMENTS

POSTGRESQL

PostgreSQL is one of the most widely used open-source relational databases. It is the standard for learning SQL because it supports the full SQL standard, has excellent documentation, and runs everywhere — locally, on a server, or in the cloud.

For this course, if you want a local practice environment, PostgreSQL with pgAdmin or DBeaver is the recommended setup.

GOOGLE BIGQUERY

BigQuery is Google Cloud''s managed data warehouse. It is widely used in analytics roles because it scales to petabytes without infrastructure management, supports standard SQL, and has a generous free tier for learning.

Many analytics teams run their entire analytical stack on BigQuery. Familiarity with it is a significant career asset.

AMAZON REDSHIFT

Redshift is AWS''s data warehouse service. It is extremely common in enterprise environments, especially companies already on AWS. It uses PostgreSQL-compatible SQL, so skills transfer.

SNOWFLAKE

Snowflake is a cloud-agnostic data warehouse that has grown rapidly in popularity. Its query syntax is close to standard SQL, and its architecture separates compute from storage, allowing teams to scale independently.

SQL EDITORS AND TOOLS

A SQL editor is the interface you use to write and run queries. Common options:

DBeaver: free, connects to almost any database, excellent for local and cloud databases.

DataGrip: JetBrains'' commercial SQL IDE — powerful, with strong autocomplete and query analysis.

pgAdmin: the standard GUI for PostgreSQL.

BigQuery Console: Google Cloud''s web-based SQL editor for BigQuery — no installation required.

Metabase / Redash / Superset: open-source BI tools that include SQL editors and visualization.

CHOOSING YOUR ENVIRONMENT

For this course: any SQL environment works for the exercises. If you are starting from scratch, use BigQuery (free tier) or a local PostgreSQL installation with pgAdmin.

In your job: you will use whatever your company uses. The SQL fundamentals you learn here transfer directly — only the dialect differs slightly (functions have different names, some syntax varies), but the concepts are identical.

DELIVERABLE: Connect to a SQL environment this week. Run your first query: SELECT current_date; — this should return today''s date. If it does, your environment is working. Take a screenshot as evidence.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET
    description = 'Question framing, analytical curiosity, avoiding cognitive traps, and building the data mindset that separates great analysts from average ones.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Thinking Like a Data Analyst',
      'description', 'Question framing, analytical curiosity, avoiding cognitive traps, and building the data mindset that separates great analysts from average ones.',
      'transcript', 'THINKING LIKE A DATA ANALYST

WHY THIS MATTERS

Technical skills — SQL, Python, statistics, visualization — are table stakes. Every analyst you will compete with for jobs has them. What separates the best analysts from the rest is how they think.

This lesson is about the mental habits and reasoning patterns that define exceptional analytical work. You can develop these deliberately, and you should start now.

QUESTION FRAMING

The most important analytical skill is knowing what question you are actually trying to answer. This sounds obvious. It is not.

A stakeholder says: "I need a dashboard of our sales metrics." That is not a question. What decision will be made based on this dashboard? Who will use it? What would cause them to act differently? If you cannot answer those questions, you cannot build the right dashboard.

Reframe every request: "What decision are we trying to improve?" and "What would a correct answer look like?"

DECOMPOSING PROBLEMS

Complex business questions contain multiple sub-questions. "Why did revenue drop last quarter?" might decompose into: did volume drop, did price drop, or did mix shift? For volume: which products, which regions, which customer segments? For each segment: was it acquisition, retention, or frequency?

Decomposition is the analytical superpower. Break every question into its components before touching any data. A structured decomposition prevents you from analyzing the wrong thing.

DISTINGUISHING CORRELATION FROM CAUSATION

This is the trap every analyst falls into at least once, and most fall into repeatedly. Two things moving together does not mean one caused the other. Both might be caused by a third factor. The correlation might be coincidental.

Example: ice cream sales and drowning rates are correlated. Neither causes the other — both are caused by hot weather. An analyst who recommends banning ice cream to reduce drownings has failed analytically.

Before claiming causation, ask: Is there a plausible mechanism? Could a confounding variable explain this? Can we design an experiment to test it?

INTELLECTUAL HONESTY

The most dangerous analyst is the one who finds what they set out to find. Confirmation bias — the tendency to interpret data in ways that confirm your prior beliefs — is a constant hazard.

Practice steel-manning: after you find a result, spend equal time trying to find evidence against it. What would have to be true for your conclusion to be wrong? If you cannot articulate that, you have not thought hard enough.

COMMUNICATING UNCERTAINTY

Real data analysis almost always produces probabilistic conclusions, not certainties. Saying "customers who buy product A are 40% more likely to return within 30 days" is not the same as "product A causes retention." The first is a fact about your data. The second is a claim about causation that requires more evidence.

Be precise about what you know, what you infer, and what you are uncertain about. Decision-makers respect analysts who are honest about uncertainty more than those who oversell confidence.

DELIVERABLE: Take any recent business decision you know about. Write down: (1) the question that decision was answering, (2) what data was used or should have been used, (3) one cognitive trap that might have influenced the outcome. This is the analytical autopsy habit that makes you better with every project.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 2 — SQL Foundations: SELECT, Joins & Aggregations (OFFSET 1)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_da_id ORDER BY order_index LIMIT 1 OFFSET 1;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M2 chapter not found'; END IF;

  UPDATE public.videos SET
    description = 'Filtering rows, selecting columns, ordering results, and using aliases — the SELECT statement in full.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'SELECT, FROM, WHERE — Querying Data with Precision',
      'description', 'Filtering rows, selecting columns, ordering results, and using aliases — the SELECT statement in full.',
      'transcript', 'SELECT, FROM, WHERE — QUERYING DATA WITH PRECISION

WHY THIS MATTERS

The SELECT statement is the foundation of all analytical SQL. Every query you will ever write — no matter how complex — contains a SELECT. Understanding it deeply, not just superficially, determines the quality of every query that follows.

This lesson covers the SELECT statement in full: what it does, how it works, and the habits that separate clean, professional queries from brittle, confusing ones.

THE SELECT STATEMENT

A SELECT statement has three required components:

SELECT — what columns to return
FROM — what table to query
WHERE — which rows to include (optional but almost always needed)

The simplest possible query:
SELECT * FROM customers;

This returns every column and every row from the customers table. The asterisk (*) means "all columns." In production analytical work, you almost never use SELECT * — you select only the columns you need, by name. This makes queries faster, more readable, and more maintainable.

SELECTING SPECIFIC COLUMNS

SELECT customer_id, name, email, country
FROM customers;

This returns only four columns. When a table has 40 columns and you need 4, this is dramatically more efficient and clearer about intent.

COLUMN ALIASES

Use AS to rename columns in your output:
SELECT customer_id AS id, signup_date AS joined
FROM customers;

Aliases make output readable. They are especially important when you are calculating derived values — giving a calculated field a meaningful name makes the result self-documenting.

FILTERING ROWS WITH WHERE

The WHERE clause filters rows based on conditions:

SELECT name, country FROM customers WHERE country = ''France'';

Conditions can use: = (equal), != or <> (not equal), >, <, >=, <= (comparisons), LIKE (pattern matching), IN (list membership), BETWEEN (range), IS NULL / IS NOT NULL.

Multiple conditions combine with AND and OR:
SELECT name FROM customers
WHERE country = ''France'' AND signup_date >= ''2024-01-01'';

ORDERING RESULTS

ORDER BY controls the sort order:
SELECT name, signup_date FROM customers
ORDER BY signup_date DESC;

DESC is descending (newest first). ASC (default) is ascending (oldest first). You can sort by multiple columns: ORDER BY country ASC, signup_date DESC.

LIMITING RESULTS

LIMIT returns only the first N rows:
SELECT * FROM customers ORDER BY signup_date DESC LIMIT 10;

This returns the 10 most recently signed-up customers. LIMIT is essential for exploring large tables without loading millions of rows.

DELIVERABLE: Write three queries against a customers or sales table: (1) all customers from a specific country, (2) the 10 most recent orders, (3) all orders above a certain value. Verify your results make sense.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET
    description = 'When and how to use INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with real business examples.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN',
      'description', 'When and how to use INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with real business examples.',
      'transcript', 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN

WHY THIS MATTERS

Most analytical questions require data from more than one table. Revenue per customer requires joining orders to customers. Product performance requires joining transactions to products. Churn analysis requires joining subscription events to user profiles.

JOINs are how you combine tables. Getting them wrong produces silently incorrect results — the query runs, returns rows, and you never know the answer is wrong unless you understand what each JOIN type does.

THE FOUR JOIN TYPES

INNER JOIN — Returns only rows that have a matching record in both tables.

SELECT c.name, o.amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;

This returns only customers who have placed at least one order. Customers with no orders are excluded. Orders with no matching customer are excluded.

Business use: when you only care about entities that exist in both tables — e.g., "show me only customers who purchased."

LEFT JOIN (LEFT OUTER JOIN) — Returns all rows from the left table, with matching rows from the right table. When there is no match, right table columns are NULL.

SELECT c.name, o.amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;

This returns every customer, whether or not they have placed an order. Customers with no orders appear with NULL in the amount column.

Business use: "show me all customers, including those who have never ordered" — essential for churn analysis, activation funnels, and cohort studies.

RIGHT JOIN (RIGHT OUTER JOIN) — The mirror of LEFT JOIN. Returns all rows from the right table, with matching rows from the left. Less commonly used; most analysts rewrite these as LEFT JOINs for readability.

FULL OUTER JOIN — Returns all rows from both tables. Where there is no match, the non-matching side has NULLs.

Business use: reconciliation — "show me everything in both systems, with NULLs where records do not match on either side."

THE CRITICAL MENTAL MODEL

Think of JOINs as set operations on your data:

INNER JOIN = intersection (only matching)
LEFT JOIN = all left + matching right
FULL OUTER JOIN = union (everything from both)

COMMON MISTAKES

Forgetting the ON condition: produces a Cartesian product — every row in the left table matched to every row in the right. If left has 1,000 rows and right has 1,000 rows, you get 1,000,000 rows. Always specify your join condition.

Using INNER JOIN when you need LEFT JOIN: you silently drop rows and produce incorrect aggregations.

DELIVERABLE: Write a LEFT JOIN query to find all customers who have never placed an order (WHERE o.customer_id IS NULL after the LEFT JOIN). This pattern — left join + IS NULL filter — is the standard way to find unmatched records.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET
    description = 'COUNT, SUM, AVG, MIN, MAX — summarizing data at the group level with GROUP BY and HAVING.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'GROUP BY, HAVING, and Aggregate Functions',
      'description', 'COUNT, SUM, AVG, MIN, MAX — summarizing data at the group level with GROUP BY and HAVING.',
      'transcript', 'GROUP BY, HAVING, AND AGGREGATE FUNCTIONS

WHY THIS MATTERS

Business questions are almost always about groups, not individual rows. "Revenue by country." "Average order value by product category." "Number of customers per signup month." All of these require aggregation — summarizing many rows into one value per group.

GROUP BY and aggregate functions are the tools. They are used in nearly every analytical query.

AGGREGATE FUNCTIONS

Aggregate functions compute a single value from a set of rows:

COUNT(*) — counts rows. COUNT(column) counts non-null values in a column.
SUM(column) — adds up values.
AVG(column) — calculates the arithmetic mean.
MIN(column) — returns the smallest value.
MAX(column) — returns the largest value.

SELECT COUNT(*) FROM orders; — how many orders total?
SELECT SUM(amount) FROM orders; — total revenue?
SELECT AVG(amount) FROM orders; — average order value?

GROUP BY

GROUP BY splits the data into groups and applies aggregate functions to each group:

SELECT country, COUNT(*) AS order_count, SUM(amount) AS total_revenue
FROM orders
GROUP BY country
ORDER BY total_revenue DESC;

This returns one row per country, with the number of orders and total revenue for each. The ORDER BY puts the highest-revenue countries first.

The key rule: every column in your SELECT that is not an aggregate function must appear in the GROUP BY clause.

GROUPING BY MULTIPLE COLUMNS

SELECT country, product_category, SUM(amount) AS revenue
FROM orders
GROUP BY country, product_category;

This returns one row per unique combination of country and product category.

HAVING — FILTERING GROUPS

WHERE filters individual rows before grouping. HAVING filters groups after aggregation:

SELECT country, SUM(amount) AS revenue
FROM orders
GROUP BY country
HAVING SUM(amount) > 100000;

This returns only countries with more than $100,000 in total revenue. You cannot use WHERE for this because WHERE runs before GROUP BY — the total does not exist yet at that point.

COMBINING WITH JOIN

SELECT c.country, COUNT(DISTINCT o.customer_id) AS buyers, SUM(o.amount) AS revenue
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.country
ORDER BY revenue DESC;

This joins customers to orders and aggregates — a pattern you will use daily.

DELIVERABLE: Write a query that shows the top 5 product categories by total revenue, including only categories with more than 10 orders. Use GROUP BY, SUM, COUNT, HAVING, and ORDER BY with LIMIT.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET
    description = 'Nesting queries inside queries — correlated subqueries, scalar subqueries, and when subqueries vs. JOINs are the right tool.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Subqueries and Derived Tables',
      'description', 'Nesting queries inside queries — correlated subqueries, scalar subqueries, and when subqueries vs. JOINs are the right tool.',
      'transcript', 'SUBQUERIES AND DERIVED TABLES

WHY THIS MATTERS

Some analytical questions cannot be answered in a single-pass query. You need intermediate results — a temporary set of data computed from one query that feeds into another. Subqueries are how you express this in SQL.

Understanding subqueries makes complex multi-step analysis possible without creating intermediate tables or running multiple queries and combining results manually.

WHAT IS A SUBQUERY?

A subquery is a query nested inside another query. It can appear in the SELECT, FROM, or WHERE clause.

SELECT name FROM customers
WHERE customer_id IN (
  SELECT customer_id FROM orders WHERE amount > 500
);

The inner query (SELECT customer_id FROM orders WHERE amount > 500) produces a list of customer IDs. The outer query uses that list to filter customers. This is an IN subquery — the outer WHERE uses IN to match against the inner query result.

SCALAR SUBQUERIES

A scalar subquery returns exactly one value (one row, one column):

SELECT name, amount,
  (SELECT AVG(amount) FROM orders) AS avg_order_value
FROM orders;

This adds the overall average order value to every row, so you can compare each order to the average. Useful for showing variance from a baseline.

DERIVED TABLES (SUBQUERIES IN FROM)

You can use a subquery as a table in the FROM clause — this is called a derived table or inline view:

SELECT country, avg_revenue
FROM (
  SELECT country, AVG(amount) AS avg_revenue
  FROM orders
  GROUP BY country
) AS country_averages
WHERE avg_revenue > 1000;

The inner query creates a temporary result set. The outer query filters it. This is powerful because you can filter on aggregated values without HAVING — useful when the logic is more complex.

CORRELATED SUBQUERIES

A correlated subquery references a column from the outer query:

SELECT name, amount
FROM orders o
WHERE amount > (
  SELECT AVG(amount) FROM orders WHERE country = o.country
);

The inner query runs once per row in the outer query, using o.country from each row. This finds orders where the amount exceeds the average for that specific country. Correlated subqueries are powerful but can be slow on large tables — consider window functions as an alternative.

SUBQUERY VS. JOIN — WHEN TO USE WHICH

Use JOINs when you need columns from both tables in your result.
Use subqueries when you need a filtered or aggregated set to query against.
Use CTEs (Common Table Expressions, covered in Module 3) for complex multi-step logic — they are more readable than nested subqueries.

DELIVERABLE: Rewrite a subquery as a JOIN and a JOIN as a subquery for the same question. Verify that both return identical results. This exercise builds intuition for when each approach is preferable.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET
    description = 'Revenue by region, customer counts, retention rates — solving real business problems with SQL from start to finish.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'SQL for Business Questions — Applied Practice',
      'description', 'Revenue by region, customer counts, retention rates — solving real business problems with SQL from start to finish.',
      'transcript', 'SQL FOR BUSINESS QUESTIONS — APPLIED PRACTICE

WHY THIS MATTERS

SQL knowledge is not demonstrated by memorizing syntax — it is demonstrated by taking a business question and producing a correct, efficient, readable query that answers it. This lesson bridges theory and practice with five realistic business scenarios.

For each scenario, we walk through the thought process: understand the question, identify the tables, design the query, validate the result.

SCENARIO 1 — REVENUE BY REGION, MONTH OVER MONTH

Question: How has revenue trended by region over the last 12 months?

Thought process: Revenue = SUM(amount). Grouped by region and month. Filtered to last 12 months.

SELECT
  c.region,
  DATE_TRUNC(''month'', o.order_date) AS month,
  SUM(o.amount) AS revenue
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date >= CURRENT_DATE - INTERVAL ''12 months''
GROUP BY c.region, DATE_TRUNC(''month'', o.order_date)
ORDER BY c.region, month;

DATE_TRUNC(''month'', date) truncates a date to the first of its month — grouping April 3 and April 27 together as April 1.

SCENARIO 2 — TOP CUSTOMERS BY LIFETIME VALUE

Question: Who are our top 20 customers by total spend?

SELECT
  c.customer_id,
  c.name,
  SUM(o.amount) AS lifetime_value,
  COUNT(o.order_id) AS total_orders,
  MIN(o.order_date) AS first_order,
  MAX(o.order_date) AS last_order
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name
ORDER BY lifetime_value DESC
LIMIT 20;

SCENARIO 3 — CUSTOMER ACQUISITION BY CHANNEL

Question: How many new customers did each marketing channel acquire per month?

SELECT
  DATE_TRUNC(''month'', signup_date) AS month,
  acquisition_channel,
  COUNT(*) AS new_customers
FROM customers
GROUP BY DATE_TRUNC(''month'', signup_date), acquisition_channel
ORDER BY month, new_customers DESC;

SCENARIO 4 — PRODUCTS WITH NO SALES IN LAST 30 DAYS

Question: Which products have had zero sales in the last 30 days?

SELECT p.product_id, p.name
FROM products p
LEFT JOIN orders o ON p.product_id = o.product_id
  AND o.order_date >= CURRENT_DATE - 30
WHERE o.product_id IS NULL;

LEFT JOIN + IS NULL is the canonical pattern for "find things with no matching records."

SCENARIO 5 — AVERAGE ORDER VALUE BY SEGMENT

Question: What is the average order value and order frequency for each customer segment?

SELECT
  c.segment,
  AVG(o.amount) AS avg_order_value,
  AVG(order_count) AS avg_orders_per_customer
FROM customers c
JOIN (
  SELECT customer_id, COUNT(*) AS order_count, AVG(amount) AS avg_amount
  FROM orders
  GROUP BY customer_id
) orders_summary ON c.customer_id = orders_summary.customer_id
GROUP BY c.segment
ORDER BY avg_order_value DESC;

THE PATTERN

Every business SQL question follows the same pattern: (1) identify what metric you need, (2) identify which tables contain it, (3) identify what dimensions to group by, (4) write SELECT-FROM-JOIN-WHERE-GROUP BY-ORDER BY, (5) validate your result against a known source.

DELIVERABLE: Pick one of the five scenarios and adapt it to a dataset you have access to — a spreadsheet, a public dataset, or a practice database. The adaptation process — translating table names and column names — is exactly what you do in every real job.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 3 — SQL Mastery: Window Functions, CTEs & Query Optimization (OFFSET 2)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_da_id ORDER BY order_index LIMIT 1 OFFSET 2;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M3 chapter not found'; END IF;

  UPDATE public.videos SET
    description = 'Ranking rows within partitions without collapsing the result set — ROW_NUMBER, RANK, and DENSE_RANK explained.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Window Functions — ROW_NUMBER, RANK, DENSE_RANK',
      'description', 'Ranking rows within partitions without collapsing the result set — ROW_NUMBER, RANK, and DENSE_RANK explained.',
      'transcript', 'WINDOW FUNCTIONS — ROW_NUMBER, RANK, DENSE_RANK

WHY THIS MATTERS

Window functions are the feature that separates intermediate SQL from advanced SQL. They let you compute a value across a set of rows related to the current row — without collapsing those rows into a single summary value the way GROUP BY does.

This is the capability that enables ranking, running totals, moving averages, row numbering, and lag/lead comparisons — all essential analytical patterns.

WHAT IS A WINDOW FUNCTION?

A window function operates on a "window" of rows defined by OVER(). Unlike aggregate functions, it does not collapse rows — every row keeps its own output.

SELECT
  customer_id,
  amount,
  ROW_NUMBER() OVER (ORDER BY amount DESC) AS rank_by_amount
FROM orders;

This adds a rank column to every row without removing any rows. The customer with the highest amount gets rank 1, second-highest gets 2, and so on.

THE THREE RANKING FUNCTIONS

ROW_NUMBER() — assigns a unique sequential integer to each row. No ties: if two rows have equal values, one gets rank 1 and the other gets rank 2 (arbitrarily determined by the database).

RANK() — assigns the same rank to tied rows, then skips the next rank. If two rows tie for rank 2, the next rank is 4 (skipping 3). This matches sports ranking: two silver medalists, no bronze.

DENSE_RANK() — assigns the same rank to tied rows, but does not skip ranks. Two rows tied at rank 2 means the next unique rank is 3. Dense — no gaps.

PARTITIONING WITH PARTITION BY

PARTITION BY divides rows into groups and restarts the window calculation within each group:

SELECT
  customer_id,
  product_category,
  amount,
  ROW_NUMBER() OVER (PARTITION BY product_category ORDER BY amount DESC) AS rank_in_category
FROM orders;

This ranks orders within each product category independently. The top order in Electronics gets rank 1, the top order in Furniture gets rank 1, etc. Without PARTITION BY, you would get global ranking across all categories.

PRACTICAL USE: TOP-N PER GROUP

The most common use of ROW_NUMBER() with PARTITION BY is finding the top N records per group:

SELECT * FROM (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY country ORDER BY amount DESC) AS rn
  FROM orders
) ranked
WHERE rn <= 3;

This returns the top 3 orders by amount for each country. This query is impossible to write cleanly without window functions.

DELIVERABLE: Write a query that returns the top-selling product in each category using ROW_NUMBER() with PARTITION BY. Verify by also writing a subquery approach and confirming the results match.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET
    description = 'Comparing current rows to previous and next rows, and calculating cumulative sums with LAG, LEAD, and SUM OVER.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'LAG, LEAD, and Running Totals',
      'description', 'Comparing current rows to previous and next rows, and calculating cumulative sums with LAG, LEAD, and SUM OVER.',
      'transcript', 'LAG, LEAD, AND RUNNING TOTALS

WHY THIS MATTERS

Two of the most common analytical questions are: "How does this period compare to the previous one?" and "What is the cumulative total over time?" Both require accessing other rows — the previous row''s value, or the sum of all rows up to this point. LAG, LEAD, and running totals with SUM OVER are the tools.

LAG AND LEAD

LAG(column, n) returns the value of column from n rows before the current row (in the order defined by ORDER BY). LEAD(column, n) returns the value from n rows after.

SELECT
  order_date,
  daily_revenue,
  LAG(daily_revenue, 1) OVER (ORDER BY order_date) AS prev_day_revenue,
  daily_revenue - LAG(daily_revenue, 1) OVER (ORDER BY order_date) AS day_over_day_change
FROM daily_revenue_summary;

This adds two columns: yesterday''s revenue and the day-over-day change. This pattern is how you build every time-series comparison: week-over-week, month-over-month, year-over-year.

PERIOD-OVER-PERIOD WITH PARTITION BY

SELECT
  region,
  month,
  revenue,
  LAG(revenue) OVER (PARTITION BY region ORDER BY month) AS prev_month_revenue,
  ROUND(100.0 * (revenue - LAG(revenue) OVER (PARTITION BY region ORDER BY month))
    / NULLIF(LAG(revenue) OVER (PARTITION BY region ORDER BY month), 0), 1) AS mom_growth_pct
FROM monthly_revenue;

This computes month-over-month growth percentage per region. NULLIF prevents division by zero when the previous month had zero revenue.

RUNNING TOTALS WITH SUM OVER

SUM() OVER (ORDER BY date) computes a cumulative sum:

SELECT
  order_date,
  amount,
  SUM(amount) OVER (ORDER BY order_date) AS cumulative_revenue
FROM orders;

Each row shows the amount plus all previous amounts — a running total. Combine with PARTITION BY for running totals within groups:

SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date)

This gives each customer''s cumulative spend over time.

RUNNING AVERAGES AND MOVING WINDOWS

Define a frame to compute rolling averages:

AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)

This computes a 7-day rolling average (6 preceding + current = 7 rows). Adjust ROWS BETWEEN to control the window size.

DELIVERABLE: Build a month-over-month revenue comparison for your dataset using LAG. Then add a running total column. Combine them in one query to produce a time-series summary that shows monthly revenue, previous month revenue, MoM growth %, and year-to-date cumulative revenue.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET
    description = 'WITH clauses for readable, maintainable complex queries — when and how to use CTEs instead of nested subqueries.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Common Table Expressions (CTEs) and Recursive Queries',
      'description', 'WITH clauses for readable, maintainable complex queries — when and how to use CTEs instead of nested subqueries.',
      'transcript', 'COMMON TABLE EXPRESSIONS (CTEs) AND RECURSIVE QUERIES

WHY THIS MATTERS

As analytical queries grow in complexity, nested subqueries become hard to read, hard to debug, and hard to maintain. A query with three levels of nesting is nearly unreadable after 48 hours. CTEs solve this by letting you name intermediate results and compose them clearly.

WHAT IS A CTE?

A Common Table Expression (CTE) defines a named temporary result set using WITH. It runs before the main query and can be referenced by name.

WITH monthly_revenue AS (
  SELECT
    DATE_TRUNC(''month'', order_date) AS month,
    SUM(amount) AS revenue
  FROM orders
  GROUP BY DATE_TRUNC(''month'', order_date)
)
SELECT month, revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month,
  revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM monthly_revenue
ORDER BY month;

The CTE (monthly_revenue) computes monthly totals. The main query then applies window functions to that result. This is far more readable than embedding the GROUP BY as a subquery.

MULTIPLE CTEs

Chain multiple CTEs with commas:

WITH
  orders_enriched AS (
    SELECT o.*, c.region, c.segment
    FROM orders o JOIN customers c ON o.customer_id = c.customer_id
  ),
  segment_totals AS (
    SELECT segment, region, SUM(amount) AS revenue
    FROM orders_enriched
    GROUP BY segment, region
  )
SELECT * FROM segment_totals
WHERE revenue > 50000
ORDER BY revenue DESC;

Each CTE builds on the previous ones. The logic reads top to bottom — like paragraphs in an argument.

WHEN TO USE CTEs VS. SUBQUERIES

Use CTEs when: a subquery is used more than once, the query has more than two levels of nesting, or the intermediate result has a meaningful name.

Use subqueries for: simple one-use filters (WHERE x IN (SELECT ...)) where a CTE would add verbosity without clarity.

RECURSIVE CTEs

Recursive CTEs can query hierarchical data — organizational charts, product categories, folder structures — by repeatedly applying a query to its own output.

WITH RECURSIVE org_chart AS (
  SELECT employee_id, name, manager_id, 0 AS level
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.name, e.manager_id, oc.level + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.employee_id
)
SELECT * FROM org_chart ORDER BY level, name;

The base case starts with top-level employees. The recursive case adds their direct reports. Repeat until no more employees exist.

DELIVERABLE: Refactor a complex nested subquery you have written into CTEs. Verify the results are identical. Measure whether the CTE version is easier to explain to someone else in one minute.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET
    description = 'Indexes, query execution plans, avoiding full table scans, and writing efficient SQL for production-scale data.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Query Optimization and Execution Plans',
      'description', 'Indexes, query execution plans, avoiding full table scans, and writing efficient SQL for production-scale data.',
      'transcript', 'QUERY OPTIMIZATION AND EXECUTION PLANS

WHY THIS MATTERS

A query that returns correct results but takes 10 minutes is not production-ready. At scale — billions of rows, concurrent users, real-time dashboards — query performance is a business problem. Understanding how the database executes your queries lets you write SQL that is fast, not just correct.

HOW DATABASES EXECUTE QUERIES

When you submit a SQL query, the database engine runs it through a query planner. The planner evaluates multiple possible execution plans — different ways to join tables, filter rows, and aggregate data — and selects the one it estimates to be fastest based on statistics about the data.

You can see the planner''s choice using EXPLAIN or EXPLAIN ANALYZE:

EXPLAIN SELECT * FROM orders WHERE customer_id = 12345;

The output shows the execution plan: which index (if any) was used, how many rows were estimated, and what operations were performed.

INDEXES

An index is a data structure that allows the database to find rows without scanning the entire table. Without an index on customer_id, a query filtering by customer_id requires reading every row — a full table scan. With an index, the database jumps directly to the matching rows.

Indexes dramatically speed up queries on large tables. The trade-off: indexes take storage space and slow down writes (every INSERT/UPDATE/DELETE must update the index). Index the columns you query most frequently in WHERE, JOIN, and ORDER BY clauses.

AVOIDING COMMON PERFORMANCE PROBLEMS

Full table scans: if your query does not use an index, it scans the entire table. On a 100M-row table, this is slow. Add indexes on frequently-filtered columns.

Functions on indexed columns: WHERE LOWER(email) = ''user@example.com'' cannot use an index on email. Use a functional index or store data in normalized form.

SELECT *: loading all columns loads more data than needed. Always select only the columns you use.

Non-sargable predicates: WHERE YEAR(order_date) = 2024 prevents index use on order_date. Rewrite as WHERE order_date BETWEEN ''2024-01-01'' AND ''2024-12-31''.

Unnecessary DISTINCT: DISTINCT adds a sort/dedup step. Only use it when you actually need to eliminate duplicates.

PARTITIONING FOR LARGE TABLES

For very large tables (hundreds of millions of rows), partitioning divides the table into smaller physical segments by date, region, or category. Queries that filter on the partition key only scan the relevant partition — dramatically reducing I/O.

DELIVERABLE: Run EXPLAIN on three queries you have written. Identify whether each uses an index or a full table scan. For any full table scan, investigate whether an index exists on the filtered column and how you would create one.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET
    description = 'Cohort analysis, conversion funnels, and churn and retention metrics built entirely in SQL.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Advanced SQL Patterns — Cohorts, Funnels, and Retention',
      'description', 'Cohort analysis, conversion funnels, and churn and retention metrics built entirely in SQL.',
      'transcript', 'ADVANCED SQL PATTERNS — COHORTS, FUNNELS, AND RETENTION

WHY THIS MATTERS

Cohort analysis, funnel analysis, and retention metrics are the analytical patterns most requested by product, growth, and marketing teams. Knowing how to build them in SQL is a career-defining skill for data analysts — it is the difference between answering "how many users do we have?" and "how well do we retain the users we acquire?"

COHORT ANALYSIS

A cohort is a group of users defined by a shared characteristic at a specific point in time — most commonly, their acquisition month. Cohort analysis tracks how that group behaves over time.

Step 1: Assign each user to their acquisition cohort.
Step 2: For each cohort, track activity in subsequent periods.
Step 3: Compute retention as a percentage of the original cohort size.

WITH cohorts AS (
  SELECT customer_id, DATE_TRUNC(''month'', first_order_date) AS cohort_month
  FROM customers
),
activity AS (
  SELECT o.customer_id,
    DATE_TRUNC(''month'', o.order_date) AS activity_month
  FROM orders o
),
cohort_activity AS (
  SELECT c.cohort_month, a.activity_month,
    COUNT(DISTINCT a.customer_id) AS active_customers
  FROM cohorts c
  JOIN activity a ON c.customer_id = a.customer_id
  GROUP BY c.cohort_month, a.activity_month
)
SELECT cohort_month, activity_month,
  active_customers,
  FIRST_VALUE(active_customers) OVER (PARTITION BY cohort_month ORDER BY activity_month) AS cohort_size,
  ROUND(100.0 * active_customers /
    FIRST_VALUE(active_customers) OVER (PARTITION BY cohort_month ORDER BY activity_month), 1) AS retention_pct
FROM cohort_activity
ORDER BY cohort_month, activity_month;

FUNNEL ANALYSIS

A funnel tracks what fraction of users complete each step in a sequence. For a purchase funnel: viewed product → added to cart → started checkout → completed purchase.

SELECT
  COUNT(DISTINCT CASE WHEN event = ''view'' THEN user_id END) AS viewed,
  COUNT(DISTINCT CASE WHEN event = ''add_to_cart'' THEN user_id END) AS added_to_cart,
  COUNT(DISTINCT CASE WHEN event = ''checkout_start'' THEN user_id END) AS checkout_started,
  COUNT(DISTINCT CASE WHEN event = ''purchase'' THEN user_id END) AS purchased
FROM events
WHERE event_date >= CURRENT_DATE - 30;

CONDITIONAL COUNT(DISTINCT) is the standard pattern. Each column counts only users who reached that step.

CHURN IDENTIFICATION

A churned customer is one who was active in a past period but not in a recent period. Standard approach: flag users who purchased in the prior 90 days but not in the last 30 days.

SELECT DISTINCT customer_id
FROM orders
WHERE order_date BETWEEN CURRENT_DATE - 90 AND CURRENT_DATE - 31
AND customer_id NOT IN (
  SELECT DISTINCT customer_id FROM orders WHERE order_date >= CURRENT_DATE - 30
);

DELIVERABLE: Build a 3-month retention cohort table for any dataset you have access to. Identify which cohort has the highest 3-month retention and hypothesize one reason why.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 4 — Data Structures, Schemas & Relational Modeling (OFFSET 3)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_da_id ORDER BY order_index LIMIT 1 OFFSET 3;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M4 chapter not found'; END IF;

  UPDATE public.videos SET
    description = 'Primary keys, foreign keys, unique constraints, and referential integrity — the rules that keep relational data trustworthy.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The Relational Model — Tables, Keys, and Constraints',
      'description', 'Primary keys, foreign keys, unique constraints, and referential integrity — the rules that keep relational data trustworthy.',
      'transcript', 'THE RELATIONAL MODEL — TABLES, KEYS, AND CONSTRAINTS

WHY THIS MATTERS

The relational model is not just a way to organize data — it is a set of rules that enforce data integrity. Understanding these rules helps you write better queries, diagnose data quality problems, and communicate with data engineers about schema design.

THE RELATIONAL MODEL

Proposed by Edgar Codd in 1970, the relational model organizes data into relations (tables). Each relation has a defined set of attributes (columns), and each tuple (row) represents one instance of the entity.

The power of the relational model comes from its mathematical foundation: every table represents a set, and SQL operations (SELECT, JOIN, UNION) are set operations. This makes the behavior of SQL predictable and composable.

PRIMARY KEYS

A primary key uniquely identifies each row in a table. Rules: it must be unique across all rows, it cannot be null, and it must remain stable (values should not change after creation).

Types of primary keys:
Natural key: a business attribute that is naturally unique — email address, national ID, product SKU. Advantage: meaningful. Disadvantage: can change (people change emails) or be incorrectly duplicated.
Surrogate key: a system-generated identifier with no business meaning — typically an auto-incrementing integer or a UUID. Advantage: guaranteed unique, never changes. Disadvantage: requires joining to get meaningful information.

Most modern systems use surrogate keys (UUIDs or serial IDs) for stability.

FOREIGN KEYS

A foreign key in one table references the primary key of another table. In an orders table, customer_id is a foreign key referencing customers.customer_id.

Foreign keys enforce referential integrity: the database will not allow you to insert an order for a customer_id that does not exist in the customers table. It will not allow you to delete a customer who has existing orders (unless you define CASCADE behavior).

This is the mechanism that ensures joins are meaningful. If referential integrity is not enforced, you can have orphaned records — orders with no matching customer — which silently corrupt analytical results.

OTHER CONSTRAINTS

UNIQUE: ensures no two rows have the same value in a column (or combination of columns). Used for business-level uniqueness that is not the primary key.

NOT NULL: ensures a column cannot contain null values. Use this for fields that must always have a value.

CHECK: enforces a condition on column values. CHECK (amount > 0) ensures no negative order amounts.

DEFAULT: specifies a default value when none is provided.

READING A DATABASE SCHEMA

As an analyst, you frequently encounter new databases and need to understand their schema quickly. Key questions: What are the primary tables? What are their primary keys? How are they linked via foreign keys? Which columns are nullable?

DELIVERABLE: Find a schema diagram or use INFORMATION_SCHEMA queries to document the primary keys, foreign keys, and constraints for three tables in a database you use. Identify one place where a constraint should exist but does not.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET
    description = 'Fact tables, dimension tables, star schema and snowflake schema — the two dominant models for analytical data warehouses.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Star Schema and Snowflake Schema',
      'description', 'Fact tables, dimension tables, star schema and snowflake schema — the two dominant models for analytical data warehouses.',
      'transcript', 'STAR SCHEMA AND SNOWFLAKE SCHEMA

WHY THIS MATTERS

Transactional databases are optimized for writes — processing millions of individual transactions quickly. Analytical databases need a different architecture, optimized for reads — aggregating millions of rows into reports and dashboards quickly.

The star schema and snowflake schema are the two dominant analytical data models. Understanding them helps you write better queries and communicate with data engineers and architects about data warehouse design.

FACT TABLES AND DIMENSION TABLES

Every analytical data model divides data into two types of tables:

Fact tables contain events or measurements — transactions, orders, page views, sensor readings. Each row is one event. Fact tables are typically very large (millions to billions of rows). They contain numeric measures (amount, quantity, duration) and foreign keys to dimension tables.

Dimension tables contain the context for those events — who, what, where, when. Customers, products, dates, locations. Dimension tables are typically smaller and contain descriptive attributes used for filtering and grouping.

The fact-dimension separation is the key insight: you aggregate facts and filter or group by dimensions.

THE STAR SCHEMA

In a star schema, one central fact table connects directly to multiple dimension tables. The diagram looks like a star: fact table in the center, dimension tables at the tips.

Example: an e-commerce star schema might have:
Fact table: fact_orders (order_id, customer_id, product_id, date_id, store_id, amount, quantity)
Dimension tables: dim_customers, dim_products, dim_date, dim_stores

To query "total revenue by product category per month," you join fact_orders to dim_products (for category) and dim_date (for month), then GROUP BY.

The star schema is optimized for query performance: most queries require only one JOIN between the fact table and one or two dimension tables.

THE SNOWFLAKE SCHEMA

A snowflake schema normalizes the dimension tables — breaking them into sub-dimensions. In a star schema, dim_products might include category_name and subcategory_name directly. In a snowflake schema, categories and subcategories would be separate tables.

Advantage: less data redundancy. Disadvantage: more JOINs required per query, which can reduce performance.

Most analytical databases use a star schema or a hybrid — the performance benefits outweigh the redundancy costs.

THE DATE DIMENSION

The date dimension is the most used dimension in any analytical warehouse. It should include: date, day of week, week number, month, quarter, year, is_weekend, is_holiday, fiscal_quarter. This allows time-based analysis without complex date functions in every query.

DELIVERABLE: Design a star schema for one business process you know well — a sales pipeline, a marketing funnel, or an operations workflow. Identify one fact table, its measures, its foreign keys, and at least three dimension tables.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET
    description = 'When to normalize (OLTP) versus denormalize (OLAP) — and why data analysts need to understand both.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Normalization vs. Denormalization',
      'description', 'When to normalize (OLTP) versus denormalize (OLAP) — and why data analysts need to understand both.',
      'transcript', 'NORMALIZATION VS. DENORMALIZATION

WHY THIS MATTERS

The same data can be stored in very different ways — highly normalized (split across many small tables) or denormalized (combined into fewer large tables). The choice affects query complexity, performance, and data integrity.

As an analyst, you will encounter both, and you need to understand why each approach was chosen and how to query each effectively.

NORMALIZATION

Normalization is the process of organizing tables to eliminate redundancy and protect data integrity. It follows a set of "normal forms" — rules about how data should be structured.

The key principle: each piece of information should exist in exactly one place. If a customer''s address is stored in both the customers table and the orders table, and the customer moves, you have to update both. If you only update one, you now have inconsistent data.

First Normal Form (1NF): every column contains atomic values (no lists, no repeating groups). Each row is unique.

Second Normal Form (2NF): every non-key column depends on the entire primary key (relevant for composite keys — no partial dependencies).

Third Normal Form (3NF): every non-key column depends only on the primary key, not on other non-key columns (no transitive dependencies).

A well-normalized OLTP database (for processing transactions) typically achieves 3NF. This minimizes storage and eliminates update anomalies.

DENORMALIZATION

Denormalization intentionally introduces redundancy to improve read performance. In analytical workloads, you frequently join many tables to get the data you need. These joins are expensive at scale.

Denormalized tables pre-join data — storing customer name directly in the orders table, or product category directly in the sales fact table — so queries can filter and group without joining.

The trade-off: if customer data changes, you must update it in multiple places. For analytical warehouses where data is loaded via ETL (not updated in real time), this is usually acceptable.

WHICH TO USE WHEN

OLTP (transactional) systems: use normalized schemas. Writes are frequent, data integrity is critical.

OLAP (analytical) systems: use denormalized or star schemas. Reads dominate, query speed is critical.

As an analyst, you typically read from analytical systems (denormalized) that are populated from OLTP systems (normalized) via ETL. Understanding both lets you trace where data comes from and why it looks the way it does.

DELIVERABLE: Look at a table in your analytical database. Identify two columns that are denormalized (data that could be in a separate dimension table but is stored directly). Identify what update anomaly would occur if the source data changed.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET
    description = 'Choosing appropriate data types, handling NULLs correctly, and enforcing data integrity at the schema level.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Data Types, Null Handling, and Integrity',
      'description', 'Choosing appropriate data types, handling NULLs correctly, and enforcing data integrity at the schema level.',
      'transcript', 'DATA TYPES, NULL HANDLING, AND INTEGRITY

WHY THIS MATTERS

Data type errors and NULL handling mistakes are among the most common sources of silent data quality bugs. A revenue column stored as TEXT instead of NUMERIC will fail to aggregate. NULLs in an average calculation silently exclude records. Understanding data types and NULL behavior prevents these traps.

DATA TYPES

Every column in a database has a data type that controls what values it can store and how operations on it behave.

Numeric types: INTEGER (whole numbers, no decimal), BIGINT (large whole numbers), NUMERIC/DECIMAL (exact decimals, used for money), FLOAT/DOUBLE (approximate floating-point, avoid for financial data due to rounding errors).

Text types: VARCHAR(n) (variable-length string up to n characters), TEXT (unlimited length), CHAR(n) (fixed-length, padded with spaces).

Date/time types: DATE (date only), TIMESTAMP (date and time), TIMESTAMPTZ (timestamp with timezone — preferred for global systems).

Boolean: TRUE / FALSE.

UUID: universally unique identifier — a 128-bit value commonly used as a primary key.

CHOOSING THE RIGHT TYPE

Use NUMERIC for monetary values — never FLOAT (rounding errors accumulate and can produce incorrect totals by fractions of cents).
Use TIMESTAMPTZ for any timestamp that might cross time zones.
Use TEXT rather than VARCHAR(n) in PostgreSQL — VARCHAR without a length limit has no performance advantage over TEXT, and length limits become schema migration headaches.

NULL — THE MISSING VALUE

NULL means the value is unknown or absent. It is not zero. It is not empty string. It is the absence of a value.

NULL behavior surprises most SQL beginners:
NULL = NULL evaluates to NULL (not TRUE) — use IS NULL / IS NOT NULL.
NULL in arithmetic: 5 + NULL = NULL.
NULL in aggregates: SUM, AVG, COUNT(column) all ignore NULLs. COUNT(*) counts all rows including those with NULLs.
NULL in sorting: NULLs sort before or after other values depending on database — specify NULLS FIRST or NULLS LAST.

HANDLING NULLS IN QUERIES

COALESCE(column, default_value): returns the first non-null argument. COALESCE(discount, 0) replaces NULL discounts with 0.

NULLIF(value1, value2): returns NULL if value1 = value2, otherwise value1. NULLIF(denominator, 0) prevents division by zero.

CASE WHEN column IS NULL THEN ... END: explicit NULL handling in any context.

DELIVERABLE: Audit one table in your database for NULL rates per column. Calculate: COUNT(*) total rows, COUNT(column) non-null rows per column, and 100 - (COUNT(column) * 100 / COUNT(*)) as null_pct. Columns with high null rates often indicate data collection problems.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET
    description = 'Designing schemas for reporting, dashboards, and self-serve analytics — practical data modeling from business requirements.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Building Analytical Data Models',
      'description', 'Designing schemas for reporting, dashboards, and self-serve analytics — practical data modeling from business requirements.',
      'transcript', 'BUILDING ANALYTICAL DATA MODELS

WHY THIS MATTERS

Data analysts increasingly work upstream — not just querying existing schemas, but helping design them. Analytics engineers build dbt models. Data warehouse architects consult analysts on what structures enable the fastest analytical queries. Understanding how to design good analytical models is a competitive advantage.

FROM REQUIREMENTS TO SCHEMA

Analytical data modeling starts with business requirements, not with data sources.

Step 1 — Identify the analytical questions the model must answer. "Revenue by product, region, and channel, trended monthly." "Customer acquisition by cohort, tracked for 12 months." "Inventory turnover by SKU and warehouse."

Step 2 — Identify the metrics (facts) and the dimensions they need to be sliced by.

Step 3 — Design the fact and dimension tables to support those queries efficiently.

Step 4 — Map existing data sources to the target schema and define the ETL logic.

THE GRAIN

The grain of a fact table is the most granular level at which a fact is recorded. "One row per order line item" is a different grain than "one row per order." "One row per daily revenue summary by product" is a different grain than "one row per transaction."

Choosing the right grain is the most important decision in data modeling. The grain must be fine enough to answer all required questions. You can always roll up to coarser grain in queries; you cannot roll down to finer grain if it was never captured.

CONFORMED DIMENSIONS

A conformed dimension is shared across multiple fact tables. The date dimension used in sales analysis should be the same date dimension used in marketing analysis. This allows cross-domain analysis: "compare daily ad spend to daily revenue" requires both fact tables to join to the same date dimension.

Conformed dimensions are the glue of a data warehouse. Without them, metrics from different systems cannot be compared directly.

SLOWLY CHANGING DIMENSIONS (SCDs)

Dimensions change over time. A customer''s address changes. A product''s price changes. A salesperson''s territory changes. How you handle historical changes determines whether you can analyze past data accurately.

Type 1 SCD: overwrite the old value. Simple, but you lose history.
Type 2 SCD: add a new row with an effective date and expiry date. Preserves full history. Most common in analytical warehouses.
Type 3 SCD: add a new column for the new value, keep the old value in another column. Limited history.

DELIVERABLE: Design a data model for a subscription business. Identify: (1) the key fact table and its grain, (2) five dimension tables, (3) which dimensions would need to be slowly changing, (4) two analytical questions the model can answer and two it cannot.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 5 — Data Cleaning, ETL & Pipeline Fundamentals (OFFSET 4)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_da_id ORDER BY order_index LIMIT 1 OFFSET 4;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M5 chapter not found'; END IF;

  UPDATE public.videos SET
    description = 'Nulls, duplicates, inconsistent formats, outliers — diagnosing data quality problems before they corrupt your analysis.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Diagnosing Dirty Data — Common Data Quality Problems',
      'description', 'Nulls, duplicates, inconsistent formats, outliers — diagnosing data quality problems before they corrupt your analysis.',
      'transcript', 'DIAGNOSING DIRTY DATA — COMMON DATA QUALITY PROBLEMS

WHY THIS MATTERS

The single most time-consuming part of analytical work is not writing queries or building dashboards — it is dealing with dirty data. Studies consistently show that analysts spend 50-80% of their time on data cleaning. The analysts who do it fastest and most rigorously produce the most reliable insights.

This lesson teaches you to recognize the six most common data quality problems, diagnose them systematically, and prioritize which ones to fix.

THE SIX DATA QUALITY PROBLEMS

PROBLEM 1 — NULL VALUES

NULLs appear in analytical data for many reasons: optional fields not filled in, system failures during capture, migration gaps, or intentional absence. They become problems when you expect a value but get none, or when aggregates silently exclude records.

Diagnosis: COUNT(*) vs COUNT(column) per column. A large gap indicates a high null rate.

SELECT
  COUNT(*) AS total_rows,
  COUNT(customer_id) AS non_null_customer,
  COUNT(email) AS non_null_email,
  COUNT(signup_date) AS non_null_date
FROM customers;

PROBLEM 2 — DUPLICATES

Duplicate rows appear when ETL processes run multiple times, when data is imported from multiple sources without deduplication, or when join logic produces fan-out.

Diagnosis:
SELECT customer_id, COUNT(*) FROM customers GROUP BY customer_id HAVING COUNT(*) > 1;

PROBLEM 3 — INCONSISTENT FORMATS

The same value represented multiple ways: "USA", "US", "United States", "united states". Dates as "2024-01-15", "01/15/2024", "January 15 2024". Currency sometimes with $ symbol, sometimes without.

Diagnosis: SELECT DISTINCT country FROM customers ORDER BY country; — look for variations of the same value.

PROBLEM 4 — OUTLIERS

Extreme values that are either legitimate (a whale customer with a $500K order) or errors (a transaction recorded as $5,000,000 instead of $5,000). Outliers can dramatically skew averages.

Diagnosis: SELECT MIN(amount), MAX(amount), AVG(amount), PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY amount) as p99 FROM orders;

PROBLEM 5 — REFERENTIAL INTEGRITY VIOLATIONS

Orphaned records: orders with a customer_id that does not exist in the customers table. This happens when foreign key constraints are not enforced.

Diagnosis:
SELECT COUNT(*) FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id WHERE c.customer_id IS NULL;

PROBLEM 6 — TEMPORAL INCONSISTENCIES

Order dates before account creation dates. Ship dates before order dates. Event timestamps in the future. These indicate either data entry errors or ETL bugs.

Diagnosis:
SELECT COUNT(*) FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE o.order_date < c.signup_date;

DELIVERABLE: Run a data quality audit on one table using all six diagnostic queries above. Document your findings in a table: problem type, count of affected rows, percentage of total, and severity (critical/moderate/low).'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET
    description = 'COALESCE, CASE, string cleaning, deduplication, and type casting — the SQL and Python toolkit for cleaning data.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Data Cleaning Techniques — SQL and Python',
      'description', 'COALESCE, CASE, string cleaning, deduplication, and type casting — the SQL and Python toolkit for cleaning data.',
      'transcript', 'DATA CLEANING TECHNIQUES — SQL AND PYTHON

WHY THIS MATTERS

Diagnosing dirty data is step one. Fixing it is step two. This lesson covers the core toolkit for cleaning data using SQL and Python — the two languages every analyst uses for this work.

SQL CLEANING TECHNIQUES

HANDLING NULLS WITH COALESCE

COALESCE(value, fallback) returns the first non-null argument:
SELECT COALESCE(discount_pct, 0) AS discount FROM orders;

For multiple fallbacks: COALESCE(preferred_email, work_email, personal_email).

STANDARDIZING VALUES WITH CASE

CASE WHEN country IN (''US'', ''USA'', ''United States'') THEN ''United States''
     WHEN country IN (''UK'', ''GB'', ''Great Britain'') THEN ''United Kingdom''
     ELSE country END AS country_standardized

Use CASE to map inconsistent values to a canonical form. This is the most common approach for standardizing categorical fields.

STRING CLEANING

TRIM(column): removes leading and trailing whitespace.
LOWER(column): converts to lowercase for case-insensitive comparison.
REGEXP_REPLACE(column, pattern, replacement): removes or replaces characters matching a regex pattern.
SPLIT_PART(email, ''@'', 1): extracts the username from an email address.

DEDUPLICATION WITH ROW_NUMBER

SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC) AS rn
  FROM customers
) deduped WHERE rn = 1;

This keeps only the most recent record per customer_id, discarding duplicates.

TYPE CASTING

CAST(column AS INTEGER) or column::INTEGER: converts data type.
TO_DATE(''2024-01-15'', ''YYYY-MM-DD''): parses a string as a date.
TO_TIMESTAMP(unix_timestamp, ''YYYY-MM-DD HH24:MI:SS''): converts Unix timestamp.

PYTHON CLEANING TECHNIQUES (PANDAS)

For more complex cleaning that SQL cannot handle elegantly, pandas is the tool:

df.dropna(subset=[''customer_id'']): remove rows with nulls in critical columns.
df.fillna({''discount'': 0}): fill nulls with default values.
df.drop_duplicates(subset=[''customer_id''], keep=''last''): deduplicate.
df[''country''].str.strip().str.title(): clean string formatting.
df[''amount''].clip(lower=0, upper=df[''amount''].quantile(0.99)): cap outliers at the 99th percentile.
pd.to_datetime(df[''date_str''], format=''%Y-%m-%d'', errors=''coerce''): parse dates, converting unparseable values to NaT.

WHEN TO USE SQL VS. PYTHON

Use SQL for: deduplication, standardization of categorical values, NULL handling, and any cleaning that can be expressed as a query transformation.

Use Python for: complex regex, multi-step transformations that are awkward in SQL, fuzzy matching (e.g., matching "Acme Corp" to "Acme Corporation"), and cleaning that requires external libraries.

DELIVERABLE: Take a dirty dataset and apply at least four cleaning techniques from this lesson. Document what the data looked like before and after each transformation. Test your cleaning by re-running the diagnostic queries from the previous lesson.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET
    description = 'How data moves from source systems to analytical stores — Extract, Transform, Load fundamentals for analysts.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'ETL Fundamentals — Extract, Transform, Load',
      'description', 'How data moves from source systems to analytical stores — Extract, Transform, Load fundamentals for analysts.',
      'transcript', 'ETL FUNDAMENTALS — EXTRACT, TRANSFORM, LOAD

WHY THIS MATTERS

Data does not teleport from source systems to your analytical database. It travels through a pipeline — extracted, transformed, and loaded. As an analyst, you need to understand this pipeline to diagnose data freshness issues, explain data gaps, and collaborate effectively with data engineers.

WHAT IS ETL?

ETL stands for Extract, Transform, Load — the three stages of moving data from source systems to analytical destinations.

EXTRACT

Extraction pulls data from source systems. Sources include: operational databases (PostgreSQL, MySQL), SaaS platforms (Salesforce, HubSpot, Stripe via APIs), flat files (CSV, Excel), event streams (Kafka, Kinesis), and external data providers.

Key considerations: full extract (reload all data every time) vs. incremental extract (load only new/changed records since the last run). Full extracts are simple but slow; incremental extracts are efficient but require tracking change timestamps or CDC (Change Data Capture).

TRANSFORM

Transformation is where raw data becomes analytically useful. Common transformations: cleaning (handle nulls, fix formats), standardization (canonical values for countries, currencies), enrichment (joining with reference data), aggregation (pre-computing summaries), business logic (calculating revenue recognition, applying tier thresholds), and deduplication.

This is the stage that requires analytical knowledge — the transformations are determined by the business rules, not just the technical process.

LOAD

Loading writes transformed data to the destination — a data warehouse (BigQuery, Snowflake, Redshift) or a data mart (a subject-area subset of the warehouse). Loading strategies:

Full replace: drop and reload the target table entirely. Simple, consistent, but slow for large tables.
Upsert (INSERT or UPDATE): insert new rows, update changed rows. Efficient but requires a unique key.
Append-only: insert new rows, never update. Used for event logs and audit tables.

ELT — THE MODERN ALTERNATIVE

ELT (Extract, Load, Transform) reverses the order. Raw data is loaded into the warehouse first, then transformed using SQL (often with dbt — data build tool). This is now the dominant approach for cloud data warehouses because cloud storage is cheap and SQL-based transformations are easier to test and version control.

COMMON ETL TOOLS

Fivetran / Airbyte: managed connectors that extract from hundreds of SaaS sources and load to your warehouse. Handle authentication, pagination, and incremental logic automatically.

dbt: SQL-based transformation tool. Analysts write SELECT statements; dbt handles the materialization, dependencies, documentation, and testing.

Apache Airflow: workflow orchestration. Schedules ETL jobs, handles dependencies, retries failures, and provides visibility into pipeline health.

DELIVERABLE: Map the ETL pipeline for one data source in your organization. Identify: source system, extraction method (full or incremental), key transformations applied, destination table, and load frequency. This exercise forces you to understand where your data actually comes from.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET
    description = 'Completeness, accuracy, consistency, timeliness, validity, and uniqueness — the DAMA framework for measuring data quality.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Data Quality Dimensions — DAMA Framework',
      'description', 'Completeness, accuracy, consistency, timeliness, validity, and uniqueness — the DAMA framework for measuring data quality.',
      'transcript', 'DATA QUALITY DIMENSIONS — DAMA FRAMEWORK

WHY THIS MATTERS

"This data is bad" is not an actionable statement. "This data has 23% null rates in the revenue column and timestamp values that are 4 hours behind real-time" is actionable. Data quality is multi-dimensional, and each dimension requires different remediation.

The DAMA (Data Management Association) framework provides a standard vocabulary for describing data quality dimensions. Learning this vocabulary makes you more effective in conversations with engineering, product, and business stakeholders.

THE SIX DAMA DIMENSIONS

COMPLETENESS — Are all required values present?

Definition: the degree to which required data is present and available for use.

Measurement: (non-null count / total count) × 100 for each required column.

Example: if 15% of customer records are missing email addresses, completeness for the email field is 85%.

ACCURACY — Does the data correctly represent reality?

Definition: the degree to which data correctly describes the real-world object or event it represents.

Measurement: comparison to a trusted reference source (manual audit, third-party verification, cross-system comparison).

Example: shipping addresses that do not match postal validation services, prices that differ from the official product catalog.

CONSISTENCY — Is the same concept described the same way across systems?

Definition: the degree to which data is the same across different datasets, systems, or time points.

Measurement: cross-system comparison — does the customer count in the CRM match the customer count in the data warehouse?

Example: total revenue in Stripe for last month should equal total revenue in the data warehouse for last month. A discrepancy indicates an ETL bug or timing issue.

TIMELINESS — Is the data available when needed and up to date?

Definition: the degree to which data is available at the time it is needed and reflects the current state of the entity.

Measurement: data freshness — how far behind real-time is the data warehouse? What is the lag between events occurring and being queryable?

Example: if the data warehouse is updated daily at 6am, yesterday''s transactions are not queryable until morning. Is this acceptable for the use case?

VALIDITY — Does the data conform to defined rules and formats?

Definition: the degree to which data conforms to defined business rules, formats, and ranges.

Measurement: check against constraints — date values within valid range, numeric values within expected range, categorical values from defined lists.

Example: order amounts should be positive. Dates should not be in the future. Country codes should be ISO 3166 values.

UNIQUENESS — Is each entity represented exactly once?

Definition: the degree to which data has no unintended duplicates.

Measurement: COUNT(*) vs COUNT(DISTINCT primary_key). Duplicate rate = (total rows - distinct rows) / total rows.

APPLYING THE FRAMEWORK

For any analytical project, run a data quality assessment across all six dimensions for your primary data sources before drawing conclusions. Document findings in a data quality scorecard. Prioritize remediation based on impact to the analysis.

DELIVERABLE: Build a data quality scorecard for one table you use regularly. Score each of the six dimensions on a 0-100 scale. Identify the top two quality issues and the first step to remediate each.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET
    description = 'Automated quality checks, alerting on pipeline failures, and data contracts — monitoring your pipelines in production.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Data Pipeline Monitoring and Validation',
      'description', 'Automated quality checks, alerting on pipeline failures, and data contracts — monitoring your pipelines in production.',
      'transcript', 'DATA PIPELINE MONITORING AND VALIDATION

WHY THIS MATTERS

A data pipeline that runs without monitoring is a liability. ETL jobs fail silently, data volumes drop without explanation, and dashboards display stale numbers. By the time someone notices, the damage — decisions made on bad data — is already done.

Data pipeline monitoring and validation is how you prevent silent failures from corrupting analytical work.

DATA TESTS — THE FOUNDATION

Automated data tests run after every ETL load and alert when data does not meet expectations. They are the equivalent of unit tests for code, applied to data.

Common test types:

Not null tests: critical columns should never be null. ASSERT COUNT(*) = 0 FROM fact_orders WHERE order_id IS NULL.

Uniqueness tests: primary keys should be unique. ASSERT COUNT(order_id) = COUNT(DISTINCT order_id) FROM fact_orders.

Referential integrity tests: every foreign key should have a match. ASSERT COUNT(*) = 0 FROM fact_orders WHERE customer_id NOT IN (SELECT customer_id FROM dim_customers).

Volume tests: the number of rows loaded should be within expected bounds. If yesterday''s load had 50,000 rows and today''s has 500, something is wrong.

Range tests: numeric values should be within expected ranges. No negative amounts. No dates after today.

FRESHNESS MONITORING

Track when each table was last updated:

SELECT MAX(loaded_at) AS last_load FROM fact_orders;

Alert if the last load timestamp is more than 2× the expected interval. A daily table not updated in 36 hours should trigger an alert.

DBT TESTS

If your team uses dbt for transformations, dbt tests are the standard way to implement data validation. Built-in tests: not_null, unique, accepted_values, relationships. Custom tests can be written as SQL SELECT queries (a test passes if it returns 0 rows).

DATA CONTRACTS

A data contract is a formal agreement between data producers (engineering teams) and data consumers (analysts) about the schema, semantics, and quality of a data source.

It specifies: column names and data types, which columns are guaranteed not null, the expected update frequency, the meaning of each field, and how breaking changes will be communicated.

Data contracts are increasingly common in mature data organizations. They shift data quality accountability upstream — producers are responsible for meeting the contract, not analysts for working around broken data.

ALERTING AND INCIDENT RESPONSE

When a data test fails, the on-call analyst or data engineer should receive an alert immediately. The incident response process: detect (automated alert), diagnose (identify which test failed and why), remediate (fix the upstream cause or implement a workaround), communicate (notify stakeholders of the issue and resolution).

Never silently swallow a data pipeline failure. Stakeholders making decisions on stale or incorrect data is worse than knowing a report is delayed.

DELIVERABLE: Write three automated data tests for a table you own. Express each test as a SQL query that returns 0 rows when the test passes. Identify who should be alerted if each test fails and what the remediation steps are.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- =============================================================================
-- VERIFY (run immediately after applying)
-- Expected: modules 1-5 each show filled=5
-- =============================================================================
SELECT c.order_index, c.title,
       COUNT(*) FILTER (WHERE v.translations->'en'->>'transcript' IS NOT NULL) AS filled
FROM public.videos v
JOIN public.chapters c ON c.id = v.chapter_id
JOIN public.courses co ON co.id = c.course_id
WHERE co.title = 'AI Data Analyst & Decision Intelligence Professional'
  AND c.order_index BETWEEN 1 AND 5
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
