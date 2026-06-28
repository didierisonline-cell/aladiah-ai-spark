-- =============================================================================
-- ⚠️  DO NOT APPLY — 10-MODULE STRUCTURE ONLY (SUPERSEDED)
-- This file targets the original 10-module DA structure.
-- The DA course was rebuilt as 18 modules. Use 20260628100000_seed_da_quiz_m01_m09.sql
-- and 20260628110000_seed_da_quiz_m10_m18.sql instead.
-- =============================================================================
-- DA Quiz Questions — Modules 1–5 (10-module structure, superseded)
-- Course: AI Data Analyst & Decision Intelligence Professional (da-v1)
-- Modules:
--   1: SQL & Data Querying                    (order_index 1)
--   2: Data Modeling & Preparation            (order_index 2)
--   3: Statistics & Analytical Methods        (order_index 3)
--   4: Data Visualization                     (order_index 4)
--   5: Business Intelligence & Reporting      (order_index 5)
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
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 1 — SQL & Data Querying  (order_index 1)
  -- Competency: da:sql
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 1 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 1'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 1 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is the purpose of the WHERE clause in a SQL SELECT statement?',
   'A junior analyst writes a query to pull all customer orders but accidentally returns 4 million rows instead of the expected few thousand.',
   '["To sort the result set by one or more columns","To filter rows before they are returned, based on a specified condition","To group rows into summary buckets","To join two tables on a matching key"]'::jsonb,
   1, 'WHERE filters individual rows before any aggregation or grouping happens. Without a WHERE clause the query returns every row in the table. GROUP BY groups already-filtered rows; ORDER BY sorts the output; JOINs combine tables — none of these filter individual rows the way WHERE does.', 1, 'da:sql', '{}'::jsonb),

  (qz, 'Which JOIN type returns all rows from the left table and only the matching rows from the right table, filling in NULLs where there is no match?',
   'You are building a customer report and need every customer to appear even if they have never placed an order.',
   '["INNER JOIN","FULL OUTER JOIN","LEFT JOIN","CROSS JOIN"]'::jsonb,
   2, 'LEFT JOIN (or LEFT OUTER JOIN) keeps every row from the left table and fills NULL into right-table columns when no matching row exists. INNER JOIN drops unmatched rows entirely; FULL OUTER JOIN keeps all rows from both sides; CROSS JOIN produces a Cartesian product.', 2, 'da:sql', '{}'::jsonb),

  (qz, 'What is the difference between WHERE and HAVING in a SQL query?',
   'An analyst needs to find all sales regions where the total revenue exceeds $500,000, but their query using WHERE throws an error.',
   '["WHERE and HAVING are interchangeable","WHERE filters rows before aggregation; HAVING filters groups after aggregation — you cannot use aggregate functions inside WHERE","HAVING is only for date columns","WHERE is used in subqueries; HAVING in main queries"]'::jsonb,
   1, 'WHERE runs before GROUP BY and cannot reference aggregate functions like SUM() or COUNT(). HAVING runs after GROUP BY and is designed exactly for filtering on aggregate results. The query fails because WHERE SUM(revenue) > 500000 is syntactically invalid — that condition belongs in HAVING.', 3, 'da:sql', '{}'::jsonb),

  (qz, 'What does GROUP BY do in a SQL query?',
   'You need a report showing the total number of orders and average order value for each product category.',
   '["Sorts the output alphabetically","Removes duplicate rows","Collapses rows that share the same value in the specified column(s) into a single summary row, allowing aggregate functions to compute per-group totals","Joins related tables on a common key"]'::jsonb,
   2, 'GROUP BY defines the grouping dimension for aggregate functions (COUNT, SUM, AVG, etc.). Every non-aggregated column in the SELECT list must appear in the GROUP BY clause. It is the engine that transforms row-level data into summary statistics.', 4, 'da:sql', '{}'::jsonb),

  (qz, 'What is a SQL subquery, and when is it commonly used?',
   'You need to find all customers whose lifetime spend is above the average lifetime spend of all customers.',
   '["A second query run in a separate database session","A query nested inside another query — used to produce a value or set of values that the outer query depends on","A stored procedure called from a view","A temporary index created during query execution"]'::jsonb,
   1, 'A subquery (or inner query) runs first and its result is used by the outer query. Calculating average lifetime spend in a subquery and then comparing each customer against it is a classic use case. Alternatives include CTEs, which are often more readable for complex logic.', 5, 'da:sql', '{}'::jsonb),

  (qz, 'A Common Table Expression (CTE) is defined with which SQL keyword?',
   'You are refactoring a deeply nested subquery into something more readable so the team can audit it during a code review.',
   '["TEMP","CREATE VIEW","WITH","DEFINE"]'::jsonb,
   2, 'CTEs begin with the WITH keyword: WITH cte_name AS (SELECT ...). They exist only for the duration of the query and improve readability by naming intermediate result sets. Unlike subqueries, CTEs can be referenced multiple times within the same query.', 6, 'da:sql', '{}'::jsonb),

  (qz, 'Which window function calculates a running total of sales ordered by date without collapsing rows?',
   'The finance team needs a spreadsheet-style view where each transaction row shows its own amount AND the cumulative total to that point.',
   '["GROUP BY date, SUM(amount)","SUM(amount) OVER (ORDER BY date)","COUNT(*) OVER (PARTITION BY date)","AVG(amount) OVER (PARTITION BY date)"]'::jsonb,
   1, 'SUM(amount) OVER (ORDER BY date) is a window function that computes a cumulative (running) total while keeping every individual row intact. GROUP BY would collapse rows into one per date and cannot show both the individual amount and the running total on the same row.', 7, 'da:sql', '{}'::jsonb),

  (qz, 'What does PARTITION BY do inside a window function?',
   'You need each row to show the sales amount AND the total sales for that sales rep''s region, without losing any individual rows.',
   '["It splits the table into separate physical tables","It divides the result set into independent groups for the window function to operate over, resetting the calculation for each group","It filters rows in the same way as WHERE","It joins the table with itself"]'::jsonb,
   1, 'PARTITION BY defines the window boundaries. SUM(amount) OVER (PARTITION BY region) computes a separate total for each region while keeping all rows. Without PARTITION BY the window function spans the entire result set — useful for grand totals but wrong for per-group calculations.', 8, 'da:sql', '{}'::jsonb),

  (qz, 'A cohort analysis groups users by acquisition month and tracks retention over time. Which SQL feature is most naturally suited to building this?',
   'The growth team wants to know whether users acquired in Q4 retain at higher rates than users acquired in Q1 of the same year.',
   '["A simple WHERE clause filtering by signup date","A CROSS JOIN of the users table with itself","A CTE that defines each cohort by signup month, joined back to activity data and grouped by months-since-acquisition","A UNION of twelve separate monthly queries"]'::jsonb,
   2, 'Cohort analysis requires computing "months since acquisition" per user, then aggregating activity by that offset. A CTE cleanly defines each cohort (e.g. DATE_TRUNC(''month'', signup_date)) and a subsequent join calculates the time offset. This is more maintainable and readable than a UNION of twelve queries.', 9, 'da:sql', '{}'::jsonb),

  (qz, 'A query is taking 45 seconds to run against a 50-million-row orders table. The analyst is filtering by customer_id in the WHERE clause. What is the most likely cause and the most effective fix?',
   'The data team just loaded five years of historical orders into a new table. Simple lookups that were instant before are now extremely slow.',
   '["The query is too complex — rewrite it as a stored procedure","The customer_id column lacks an index — adding one will allow the database to find matching rows without scanning the entire table","Increase the query timeout setting","Reduce the number of columns in the SELECT list"]'::jsonb,
   1, 'Without an index on customer_id, the database performs a full table scan — reading all 50 million rows to find matches. An index is a pre-sorted lookup structure that lets the engine jump directly to relevant rows. This is the single most impactful optimization for filter-heavy queries on large tables.', 10, 'da:sql', '{}'::jsonb),

  (qz, 'A business analyst asks you: "Which customers placed more than 5 orders in the last 90 days?" Which SQL pattern correctly answers this?',
   'The retention team is building a VIP segmentation model and needs a list of highly active customers from the past quarter.',
   '["SELECT customer_id FROM orders WHERE order_count > 5","SELECT customer_id, COUNT(*) FROM orders WHERE order_date >= NOW() - INTERVAL ''90 days'' GROUP BY customer_id HAVING COUNT(*) > 5","SELECT customer_id FROM orders HAVING COUNT(*) > 5","SELECT customer_id FROM orders WHERE COUNT(*) > 5 GROUP BY customer_id"]'::jsonb,
   1, 'This requires filtering rows by date (WHERE), grouping by customer (GROUP BY), and then filtering on the aggregate count (HAVING). The common mistake is placing COUNT(*) > 5 inside WHERE, which is invalid because aggregates are computed after WHERE runs.', 11, 'da:sql', '{}'::jsonb),

  (qz, 'What is the ROW_NUMBER() window function used for?',
   'You need to de-duplicate a customer table that was loaded twice, keeping only the most recent record for each customer_id.',
   '["Counting distinct values in a column","Assigning a unique sequential integer to each row within a partition, often used to rank or de-duplicate records","Calculating the running total of a numeric column","Identifying NULL values in a column"]'::jsonb,
   1, 'ROW_NUMBER() assigns 1, 2, 3… to rows within each partition ordered by a specified column. To de-duplicate, partition by customer_id ORDER BY inserted_at DESC — then keep only ROW_NUMBER() = 1 (the most recent record). This is one of the most practical uses of window functions in data engineering.', 12, 'da:sql', '{}'::jsonb),

  (qz, 'An analyst writes: SELECT product_id, SUM(revenue) FROM sales GROUP BY product_id ORDER BY SUM(revenue) DESC LIMIT 10. What does this query return?',
   'The CMO wants to know which ten products generated the most revenue last quarter during a Monday morning standup.',
   '["The 10 products with the lowest revenue","All products sorted alphabetically","The 10 products with the highest total revenue, sorted from highest to lowest","The 10 most recently sold products"]'::jsonb,
   2, 'The query sums revenue per product (GROUP BY product_id), sorts descending by that sum (ORDER BY SUM(revenue) DESC), and takes the top ten (LIMIT 10). This is the standard "top-N by aggregate" pattern — one of the most common analytical queries.', 13, 'da:sql', '{}'::jsonb),

  (qz, 'A stakeholder asks for "month-over-month revenue growth as a percentage." Which SQL technique enables this calculation?',
   'The CFO wants a table showing each month''s revenue and the percentage change versus the previous month.',
   '["A simple GROUP BY month","A self-join or window function using LAG() to access the previous month''s revenue within the same query","A subquery that filters for dates after the current month","A UNION of two monthly queries"]'::jsonb,
   1, 'LAG(revenue, 1) OVER (ORDER BY month) retrieves the previous row''s revenue value within the ordered result set, enabling the formula (current_revenue - previous_revenue) / previous_revenue * 100. A self-join can achieve the same result but is less readable and harder to maintain.', 14, 'da:sql', '{}'::jsonb),

  (qz, 'You have two tables: users (user_id, signup_date) and events (user_id, event_date, event_type). You want every user''s first event after signup. A colleague suggests using a subquery with MIN(event_date). A senior analyst suggests a CTE with ROW_NUMBER(). What is the key advantage of the CTE approach?',
   'The product team needs a user-level dataset combining signup data with first-touch event data for a funnel analysis.',
   '["The CTE approach is always faster","The CTE with ROW_NUMBER() is more readable and easier to extend — for example, adding the second event later requires only changing a filter, whereas the MIN() subquery approach requires significant restructuring","The subquery approach cannot use MIN()","CTEs can access tables that subqueries cannot"]'::jsonb,
   1, 'Both approaches produce correct results. The CTE with ROW_NUMBER() wins on maintainability: if requirements change to "second event" or "most recent event," changing ROW_NUMBER() = 1 to ROW_NUMBER() = 2 or reversing the ORDER BY is trivial. Refactoring the MIN() subquery approach requires more structural change.', 15, 'da:sql', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 2 — Data Modeling & Preparation  (order_index 2)
  -- Competency: da:data-modeling
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 2 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 2'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 2 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is a star schema, and why is it commonly used in analytical databases?',
   'Your team is designing a data warehouse for an e-commerce company and needs to decide between schema designs for the reporting layer.',
   '["A schema with no primary keys, optimized for write speed","A single denormalized table containing all data","A central fact table surrounded by denormalized dimension tables — designed for fast, simple analytical queries with minimal joins","A fully normalized schema with many related tables to reduce data redundancy"]'::jsonb,
   2, 'The star schema places a fact table (metrics: orders, revenue, quantity) at the center, with dimension tables (customers, products, dates) directly joined to it. The denormalized dimensions minimize join depth, making queries simple and fast — the priority in analytical (OLAP) workloads where read performance matters more than storage efficiency.', 1, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What distinguishes a snowflake schema from a star schema?',
   'A data architect asks whether the product dimension should store category and subcategory in the same table or split them into a normalized hierarchy.',
   '["A snowflake schema has more fact tables","A snowflake schema normalizes dimension tables into multiple related sub-tables, reducing redundancy at the cost of more complex joins compared to the star schema''s flat dimensions","A snowflake schema is only used in cloud data warehouses","A snowflake schema does not have a central fact table"]'::jsonb,
   1, 'Snowflake normalizes dimensions: instead of storing Category directly on the Product dimension table, it has a separate Category table joined to Product. This reduces storage redundancy but adds join complexity. Star schema trades storage efficiency for query simplicity — the usual choice for BI tools.', 2, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is the difference between ETL and ELT?',
   'Your organization is migrating from an on-premise data warehouse to a cloud data platform and is debating the data loading strategy.',
   '["ETL is used for structured data; ELT is only for unstructured data","ETL transforms data before loading it into the target system; ELT loads raw data first and transforms it inside the target system using its compute power","ETL is a newer approach than ELT","ELT does not support data quality checks"]'::jsonb,
   1, 'ETL (Extract, Transform, Load) transforms data in a separate processing layer before it reaches the warehouse — common with legacy on-premise systems. ELT (Extract, Load, Transform) loads raw data into a cloud warehouse first, then uses the warehouse''s compute (e.g. BigQuery, Snowflake, Redshift) to transform it — more scalable and flexible for modern architectures.', 3, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A dataset has 12% of rows with NULL values in the customer_age column. What is the analyst''s best approach before using this column in a model?',
   'You are building a customer segmentation model and the age column has significant missing data that was not documented in the data dictionary.',
   '["Delete all rows with NULL age values immediately","Use the column as-is — NULL is treated as zero by most tools","Investigate why NULLs exist (missing at random vs. systematically missing), then decide: impute with median, create an ''unknown'' category, or exclude — documenting the decision","Replace all NULLs with the mean without investigation"]'::jsonb,
   2, 'The approach depends on WHY data is missing. If age is missing systematically (e.g. always missing for a specific customer segment), imputing with the mean introduces bias. The professional move is to understand the missingness pattern, choose an appropriate strategy (imputation, exclusion, or unknown category), and document it so results can be reproduced and audited.', 4, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is data normalization in the context of relational database design?',
   'A sales operations analyst notices that the rep''s territory name is stored redundantly in 50,000 order rows and gets out of sync whenever a territory is renamed.',
   '["Scaling numeric values between 0 and 1 for machine learning","Organizing a database to reduce redundancy by storing each piece of information in one place, linked via foreign keys","Converting all text to lowercase for consistency","Removing duplicate rows from a dataset"]'::jsonb,
   1, 'Relational normalization (1NF, 2NF, 3NF) moves repeating data into separate tables and links them with keys. Storing territory once in a Territories table and referencing it by ID in Orders eliminates the redundancy and the update anomaly. Normalization improves data integrity; denormalization (as in star schema) trades integrity for query speed.', 5, 'da:data-modeling', '{}'::jsonb),

  (qz, 'Which of the following best describes a "dimension" in a data warehouse star schema?',
   'A new analyst asks what the difference is between the Orders table and the Products table in the warehouse you just designed.',
   '["A column that stores numeric measurement values like revenue or quantity","A table that provides descriptive context for the facts — such as product name, category, color, or customer region","A table that is updated in real time as transactions occur","A table storing system configuration settings"]'::jsonb,
   1, 'Dimensions provide the WHO, WHAT, WHERE, WHEN, and HOW context around a measurable event. The fact table stores the measurable event (order placed: quantity = 3, revenue = $150); the dimension tables describe the participants (Product: name = ''Laptop'', category = ''Electronics''). Confusing them leads to poorly structured warehouses.', 6, 'da:data-modeling', '{}'::jsonb),

  (qz, 'You load a customer file and find that customer ID 10042 appears 3 times with slightly different email addresses. What is the most appropriate first step?',
   'The marketing team is about to run a campaign and the CRM export you received looks like it may have duplicate customer records.',
   '["Keep all three records to avoid data loss","Randomly delete two of the three records","Investigate the source: determine whether these are true duplicates (same person, data entry error) or distinct accounts (same person, multiple accounts) — then apply a deduplication rule based on that finding","Replace all three records with a single record using the most recent email"]'::jsonb,
   1, 'Deduplication requires understanding the business context. Three records with different emails might be a data entry error, a customer who changed emails, or a family sharing an account. Applying the wrong deduplication rule creates data loss. Investigate first, define the deduplication rule with the business owner, then apply it consistently.', 7, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What are the six dimensions of data quality commonly used to assess a dataset?',
   'The Chief Data Officer asks your team to produce a data quality scorecard for the customer master data before it feeds the new CRM.',
   '["Speed, cost, volume, format, lineage, privacy","Completeness, accuracy, consistency, timeliness, validity, and uniqueness","Size, structure, schema, indexing, encoding, compression","Raw, cleaned, enriched, modeled, aggregated, published"]'::jsonb,
   1, 'These six dimensions are the standard framework (from DAMA-DMBOK and others) for assessing data quality: Completeness (no missing values), Accuracy (correct values), Consistency (same value across systems), Timeliness (data is current enough), Validity (values conform to rules), and Uniqueness (no unintended duplicates). A scorecard built on these dimensions gives stakeholders a structured view of data health.', 8, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A data pipeline loads a daily sales file at 6am. Today it ran at 2pm due to an upstream delay. Which data quality dimension was violated?',
   'The sales dashboard showed stale data all morning and the Head of Sales complained that the numbers were wrong.',
   '["Accuracy — the data values were incorrect","Completeness — some rows were missing","Uniqueness — records were duplicated","Timeliness — the data did not arrive when it was needed to support the business process"]'::jsonb,
   3, 'Timeliness measures whether data is available when the business needs it. The data values may have been perfectly accurate, complete, and unique — but arriving 8 hours late meant the morning sales meeting ran on stale numbers. Timeliness violations are often invisible in quality dashboards that only measure row counts and null rates.', 9, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is a slowly changing dimension (SCD Type 2), and why does it matter for historical analysis?',
   'A customer moved from the West region to the East region in March. Your report shows all their historical orders tagged to East, distorting Q1 regional performance.',
   '["A dimension table that is never updated","A method that inserts a new row for each attribute change, preserving the historical record and allowing historical analysis to use the attribute value that was current at the time of each transaction","A dimension that changes frequently and is refreshed daily","A technique for compressing large dimension tables"]'::jsonb,
   1, 'SCD Type 2 preserves history by adding a new row (with effective and expiry dates) each time an attribute changes. Type 1 simply overwrites — which causes retroactive reassignment (all historical orders now show East). Type 2 is the correct choice whenever you need to analyze "what was true at the time" rather than "what is true now."', 10, 'da:data-modeling', '{}'::jsonb),

  (qz, 'An analyst receives a CSV where revenue is stored as the text string "$1,234.56" instead of a numeric value. What data preparation step is required?',
   'Your pipeline fails when trying to SUM the revenue column because the database treats the values as strings.',
   '["Sort the column alphabetically","Rename the column to remove the dollar sign","Parse and cast the field: strip the $ and , characters, then convert the string to a numeric type — and validate the result against known totals","Split the column into two columns: one for dollars and one for cents"]'::jsonb,
   2, 'Type casting is a fundamental data preparation step. String-formatted currency ("$1,234.56") must be cleaned (remove $ and ,) and cast to NUMERIC or FLOAT before arithmetic is possible. Always validate after casting: sum the transformed column and compare to a known total or spot-check against source records.', 11, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is the primary purpose of a data dictionary in an analytical project?',
   'A new analyst joins the team and spends two days figuring out what the "adj_rev" column means and whether it includes refunds.',
   '["A glossary of SQL syntax for beginners","A document that defines every dataset''s columns: their business meaning, data type, allowed values, source system, and any transformation rules applied — enabling consistent understanding across the team","A technical specification for the database server","A list of all data sources available to the organization"]'::jsonb,
   1, 'A data dictionary is the single source of truth for what each field means. Without it, analysts make conflicting assumptions ("adj_rev" could mean adjusted for refunds, adjusted for FX, or adjusted for returns — each yielding different numbers). A good data dictionary includes business definition, technical type, source, transformation rules, and a worked example.', 12, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is a surrogate key, and why is it preferred over a natural key in a data warehouse dimension table?',
   'The product catalog from the source system uses product codes like "SKU-A1234" as identifiers. The data architect says to create a separate integer key for the warehouse.',
   '["A surrogate key is a copy of the natural key stored in a separate column","A surrogate key is a system-generated integer or UUID with no business meaning — preferred because it is stable (business codes can change), compact (integer joins are faster), and can accommodate SCD Type 2 versioning without key collisions","A surrogate key is required by GDPR","A surrogate key is a hash of the natural key for encryption purposes"]'::jsonb,
   1, 'Natural keys (like SKU codes) can change when business rules change — breaking every fact table reference and historical join. Surrogate keys are system-generated, immutable, and meaningless outside the warehouse. They also enable SCD Type 2: when a product attribute changes, a new surrogate key is assigned to the new version while the old key preserves history.', 13, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A data pipeline runs nightly. The next morning the dashboard shows totals 20% lower than expected. What is the analyst''s structured debugging approach?',
   'The CFO is asking why last night''s revenue figure is dramatically different from the same report run two days ago.',
   '["Immediately report a data quality issue and wait for the engineering team","Assume it is correct and present it to the CFO","Check pipeline logs for errors or partial loads, compare row counts between source and destination, identify whether the drop is in all segments or specific ones, and validate against a control total from the source system before escalating","Re-run the pipeline immediately without investigation"]'::jsonb,
   2, 'Pipeline debugging is a structured process. Check logs first (did it complete?), then compare row counts (did all data arrive?), then segment the anomaly (is the drop in one product/region or everywhere?), then validate against source (is the source itself lower?). Running blind or escalating without diagnosis wastes engineering time and damages credibility.', 14, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A senior analyst says the orders table is "wide" (200 columns) and the analytics team should move to a "long" format. What does this mean, and when is long format preferred?',
   'The data team is discussing whether to store one column per product attribute or to normalize attributes into rows for the new flexible reporting layer.',
   '["Wide means high row count; long means high column count","Wide format stores each variable in its own column (one row per entity); long format stores variable names and values in two columns (many rows per entity) — long format is preferred when the set of attributes is dynamic or when the data will be filtered and pivoted in BI tools","Long format is faster for SQL queries","Wide format is only used in spreadsheets"]'::jsonb,
   1, 'Wide format is rigid: adding a new attribute requires a schema change. Long (tidy) format stores attribute name and value as rows, making it easy to add new attributes without schema changes and enabling flexible GROUP BY attribute_name queries. BI tools and pivot operations often work more naturally with long format, though read performance of specific attributes may require pivoting back.', 15, 'da:data-modeling', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 3 — Statistics & Analytical Methods  (order_index 3)
  -- Competency: da:statistics
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 3 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 3'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 3 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'A salary dataset has values: $45K, $48K, $50K, $52K, and $400K. Which measure of central tendency best represents the "typical" salary?',
   'An HR analyst is preparing a compensation benchmarking report and notices the dataset includes one executive salary that is dramatically higher than all others.',
   '["The mean, because it uses all data points","The mode, because it identifies the most frequent value","The median, because it is resistant to the outlier and better represents the middle of the distribution","The range, because it captures the full spread"]'::jsonb,
   2, 'The median (middle value when sorted) is the correct choice in skewed distributions with outliers. The $400K salary pulls the mean to approximately $119K — a figure that represents no one''s actual salary. The median of $50K is far more representative of where most employees sit. Defaulting to the mean without checking for skew is one of the most common analyst errors.', 1, 'da:statistics', '{}'::jsonb),

  (qz, 'What does standard deviation measure, and how should an analyst interpret a high standard deviation?',
   'You are analyzing customer purchase values across two product lines. Both have a mean of $200, but Product A has a standard deviation of $10 and Product B has a standard deviation of $150.',
   '["Standard deviation measures the average value in a dataset","Standard deviation measures how spread out values are around the mean — a high standard deviation means values vary widely, indicating an inconsistent or heterogeneous distribution","Standard deviation measures the maximum minus the minimum","Standard deviation is only meaningful for data above zero"]'::jsonb,
   1, 'Standard deviation quantifies dispersion. Product A ($10 SD) has very consistent pricing — nearly all customers pay close to $200. Product B ($150 SD) has enormous variability — some customers pay almost nothing while others pay $500+. Same mean, completely different business reality. Reporting only the mean without SD hides this critical difference.', 2, 'da:statistics', '{}'::jsonb),

  (qz, 'An analyst reports that the p-value for an A/B test is 0.03. What does this mean?',
   'You ran a 2-week email campaign test and your statistical software outputs a p-value of 0.03 at the 5% significance level.',
   '["There is a 3% chance the variant is better than the control","The test is 97% accurate","Assuming the null hypothesis is true, there is only a 3% probability of observing results as extreme as these by chance — at α=0.05, this is statistically significant","The variant increases conversion by 3%"]'::jsonb,
   2, 'The p-value is NOT the probability that the variant is better, nor a measure of effect size. It is the probability of seeing results at least this extreme if the null hypothesis (no difference) were true. At α=0.05, p=0.03 clears the significance threshold — we reject the null. Many stakeholders misinterpret p-values; analysts must explain this correctly.', 3, 'da:statistics', '{}'::jsonb),

  (qz, 'What is a Type I error in hypothesis testing?',
   'The product team ran an A/B test, declared the new checkout flow a winner, and launched it — only to see no improvement in actual revenue post-launch.',
   '["Failing to detect a real effect that actually exists","Correctly rejecting a false null hypothesis","Rejecting the null hypothesis when it is actually true — concluding there is a real effect when the result was due to random chance","Using too small a sample size"]'::jsonb,
   2, 'A Type I error (false positive) means declaring a winner when there is no real difference — the observed effect was random noise. This is controlled by the significance level α (commonly 5%). Launching a "winning" variant based on a Type I error wastes engineering effort and misleads the organization. Running many simultaneous tests without correction inflates Type I error risk.', 4, 'da:statistics', '{}'::jsonb),

  (qz, 'What is a Type II error, and how does sample size affect it?',
   'Your A/B test runs for two weeks with 500 users per group and shows no significant difference, so the team abandons the variant.',
   '["Accepting a result that is actually statistically significant","Finding a significant result that is not practically meaningful","Failing to detect a real effect because the test lacked sufficient statistical power — often caused by insufficient sample size","Running an A/B test for too long"]'::jsonb,
   2, 'A Type II error (false negative) occurs when a real effect exists but the test misses it due to insufficient power — often too few users. Larger sample sizes increase power (ability to detect true effects). A test with 500 users per group may be underpowered to detect a 2% lift; a power analysis before launch determines the required sample size.', 5, 'da:statistics', '{}'::jsonb),

  (qz, 'How should an analyst determine the required sample size for an A/B test before launching it?',
   'The growth team wants to detect a 5% improvement in conversion rate (currently 10%) with 80% power at a 5% significance level.',
   '["Run the test for exactly two weeks regardless of user volume","Use the total number of active users as the sample size","Conduct a power analysis using the baseline conversion rate, minimum detectable effect, desired power (80%), and significance level (5%) — this yields the minimum sample size needed per variant","Use a sample size of 1,000 users per variant as a general rule"]'::jsonb,
   2, 'A power analysis is the correct pre-test calculation. Inputs: baseline rate (10%), minimum detectable effect (5% relative = 0.5% absolute lift to 10.5%), desired power (80%), and α (5%). The calculation yields the required n per variant. Running without this risks either underpowered tests (Type II errors) or wastefully long tests (opportunity cost).', 6, 'da:statistics', '{}'::jsonb),

  (qz, 'What is a confidence interval, and how should an analyst communicate one to a non-technical stakeholder?',
   'Your A/B test shows the new landing page increases conversion by 3.2%, with a 95% confidence interval of [1.8%, 4.6%].',
   '["The range of values the true effect could theoretically take across all possible universes","A range calculated from the sample data such that, if we repeated this experiment many times, 95% of the resulting intervals would contain the true population effect — practically, it tells us the plausible range for the real lift","The probability that the variant is better","The margin of error in the measurement tool"]'::jsonb,
   1, 'Communicate the CI as a plausibility range: "We are confident the true lift is between 1.8% and 4.6%." This is more honest than reporting 3.2% as if it were exact. A narrow CI signals high precision; a wide CI signals high uncertainty. Reporting only the point estimate without the CI hides the uncertainty inherent in sample-based inference.', 7, 'da:statistics', '{}'::jsonb),

  (qz, 'A dataset shows a strong positive correlation (r=0.85) between ice cream sales and drowning deaths. What conclusion should the analyst draw?',
   'A public health team is reviewing summer data and finds that ice cream sales and drowning incidents rise together every month.',
   '["Ice cream causes drowning — recommend banning summer ice cream sales","The correlation proves a causal relationship and should be reported as such","Both variables are likely driven by a common cause (hot weather and increased outdoor activity) — correlation does not establish causation without a controlled study or causal model","The r=0.85 value is too low to be meaningful"]'::jsonb,
   2, 'Correlation measures co-movement, not cause. Here, a confounding variable (summer/heat) drives both ice cream sales and swimming (and thus drowning) — the classic spurious correlation. Analysts must always ask: "Is there a plausible causal mechanism, or are both variables driven by something else?" Presenting correlation as causation leads to wrong and sometimes harmful decisions.', 8, 'da:statistics', '{}'::jsonb),

  (qz, 'A linear regression model predicts sales. The coefficient for "advertising spend" is 4.2. How should this be interpreted?',
   'The CMO asks what the regression output tells her about the relationship between ad spend and sales.',
   '["For every $1 increase in advertising spend, sales increase by $4.20, holding all other variables in the model constant","Advertising spend explains 4.2% of sales variability","The model is 4.2 times more accurate than a simple average","There is a 4.2% chance that advertising does not affect sales"]'::jsonb,
   0, 'A regression coefficient is interpreted as: "a one-unit increase in the predictor is associated with a coefficient-sized change in the outcome, holding all other predictors constant." This is the ceteris paribus interpretation. Note "associated" — regression describes relationship, not cause — unless the study design supports causal inference.', 9, 'da:statistics', '{}'::jsonb),

  (qz, 'Statistical significance and practical significance are not the same. Which scenario best illustrates this distinction?',
   'The product team ran a 2-million-user A/B test and found statistically significant results (p < 0.001) for a new feature.',
   '["A test with p=0.06 that detects a 20% lift in revenue","A test with p < 0.001 that detects a 0.01% improvement in conversion rate — statistically significant due to massive sample size, but so small it generates less revenue than the engineering cost to ship the feature","A test with p=0.04 and a 95% confidence interval that includes zero","A test with a sample size of 50 that finds a 40% lift"]'::jsonb,
   1, 'With very large samples, tiny meaningless effects become statistically significant. The 0.01% conversion lift might be real (not random noise) but is practically irrelevant — the expected revenue gain is smaller than the cost of shipping and maintaining the feature. Analysts must always report effect size and business impact alongside statistical significance.', 10, 'da:statistics', '{}'::jsonb),

  (qz, 'Your A/B test shows the variant performs better in mobile (p=0.01) but worse on desktop (p=0.03). The overall result is inconclusive. What analytical concept explains this?',
   'The growth team is confused because the overall test is flat but segment-level results tell opposite stories.',
   '["A data quality error — the segments must be recalculated","Simpson''s Paradox — where a trend present in subgroups disappears or reverses when data is aggregated","A Type I error in both subgroup tests","Statistical insignificance in the mobile segment"]'::jsonb,
   1, 'Simpson''s Paradox occurs when segment-level trends reverse at the aggregate level due to confounding in the group sizes or compositions. Here, the mix of mobile and desktop users in each variant may differ. Aggregated A/B results can mask heterogeneous treatment effects — always segment your A/B results before reporting overall conclusions.', 11, 'da:statistics', '{}'::jsonb),

  (qz, 'What is the difference between descriptive and inferential statistics?',
   'A manager asks whether the 12% increase in support tickets last month is a meaningful trend or just normal variation.',
   '["Descriptive statistics use samples; inferential statistics use the full population","Descriptive statistics summarize and describe the data you have (mean, median, counts); inferential statistics use sample data to draw conclusions or make predictions about a larger population — determining whether the 12% increase is signal or noise is inferential","Descriptive statistics are more accurate than inferential statistics","Inferential statistics only apply to survey data"]'::jsonb,
   1, 'Descriptive statistics tell you what your data looks like (the 12% increase is a fact). Inferential statistics determine whether that fact reflects a real pattern in the underlying system — is 12% within the range of normal monthly variation, or is it a statistically unusual signal? The manager''s question is fundamentally inferential.', 12, 'da:statistics', '{}'::jsonb),

  (qz, 'What is multicollinearity in regression analysis, and why is it a problem?',
   'You build a sales prediction model with both "number of sales reps" and "total rep hours worked" as predictors, and both coefficients come out statistically insignificant even though either alone is significant.',
   '["Multicollinearity means the dependent variable is not normally distributed","Multicollinearity occurs when two or more predictor variables are highly correlated with each other — it makes individual coefficient estimates unstable and unreliable, even when the overall model fits well","Multicollinearity means the model has too many data points","Multicollinearity only occurs with categorical variables"]'::jsonb,
   1, '"Number of reps" and "rep hours" measure essentially the same thing — they move together almost perfectly. When they are both in the model, the regression cannot tell which one is driving sales. Individual coefficients become unreliable and their significance tests break down, even though the model''s R² may still look fine. Removing one of the correlated predictors or combining them resolves multicollinearity.', 13, 'da:statistics', '{}'::jsonb),

  (qz, 'A/B test results show p=0.04 for a primary metric and p=0.02 for a secondary metric. You also checked 8 other exploratory metrics. What statistical concern should the analyst raise?',
   'The product team is excited to ship because "two metrics are significant." You realize you checked 10 metrics in total.',
   '["No concern — two significant metrics is strong evidence","The test was underpowered","Multiple comparisons inflation: when testing 10 metrics at α=0.05, you expect 0.5 false positives by chance alone — without a correction (like Bonferroni), the risk of at least one false positive is much higher than 5%","The sample size was too small for 10 metrics"]'::jsonb,
   2, 'Multiple comparisons (the "look elsewhere" effect) inflates the family-wise error rate. At α=0.05, each test has a 5% false positive rate. Testing 10 metrics means ~40% chance of at least one false positive by chance. The Bonferroni correction divides α by the number of tests (0.05/10 = 0.005 per test). Pre-specifying the primary metric before the test avoids this entirely.', 14, 'da:statistics', '{}'::jsonb),

  (qz, 'A product analyst wants to understand whether user acquisition channel (organic, paid, referral) is associated with 30-day retention. What statistical test is most appropriate?',
   'The growth team hypothesizes that users from referral links retain better than paid users but wants to test this rigorously.',
   '["A linear regression with retention as the outcome","A chi-square test of independence — to test whether the distribution of retained/churned users differs across the three categorical acquisition channels","A t-test comparing mean retention across all channels simultaneously","A correlation coefficient between channel and retention"]'::jsonb,
   1, 'The chi-square test of independence is the right tool when both variables are categorical: acquisition channel (3 categories) and 30-day retention (retained/churned). It tests whether the distribution of retained users is independent of channel. A t-test compares two group means on a continuous variable; a correlation measures linear relationships between continuous variables.', 15, 'da:statistics', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 4 — Data Visualization  (order_index 4)
  -- Competency: da:visualization
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 4 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 4'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 4 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is a pre-attentive attribute in data visualization?',
   'You are designing a chart to help executives instantly spot underperforming regions in a sales table without reading every cell.',
   '["A label placed before the chart title","A visual property (such as color, size, or position) that the human brain processes in less than 250 milliseconds — before conscious attention is directed","A tooltip that appears when hovering over a data point","A chart annotation added during the review phase"]'::jsonb,
   1, 'Pre-attentive attributes (color hue, color intensity, size, shape, position, motion) are processed by the visual system automatically and near-instantly — before the viewer consciously focuses. Using a red fill on underperforming cells lets viewers find exceptions without reading. Overusing pre-attentive attributes (too many colors, too many highlights) defeats their purpose.', 1, 'da:visualization', '{}'::jsonb),

  (qz, 'Which chart type is most appropriate for showing a trend over time?',
   'The VP of Sales wants to see how monthly revenue has changed over the past 24 months.',
   '["A pie chart showing each month''s share of total revenue","A bar chart with one bar per month","A line chart connecting monthly data points in temporal order","A scatter plot of month vs. revenue"]'::jsonb,
   2, 'Line charts excel at showing continuous trends over time because the connecting line emphasizes direction and rate of change between periods. A bar chart works for discrete comparisons of a few categories but becomes cluttered at 24 bars. Pie charts show parts-of-a-whole for a single point in time — entirely wrong for trends.', 2, 'da:visualization', '{}'::jsonb),

  (qz, 'When should an analyst use a bar chart instead of a pie chart?',
   'A marketing analyst wants to show the revenue contribution of six product lines for last quarter.',
   '["Only when the number of categories is odd","When comparing magnitudes across multiple categories — bar charts make it easy to rank and compare; pie charts become difficult to read beyond 3–4 slices and cannot be accurately compared by angle alone","When the data sums to exactly 100%","When the audience is non-technical"]'::jsonb,
   1, 'Pie charts encode proportion as angle and arc — two perceptual channels humans read poorly for comparison. With six product lines, slices of similar size become nearly indistinguishable. Bar charts encode value as length — the most accurately perceived visual attribute — making ranking and comparison trivial. Default to bars for part-to-whole comparisons with more than 3 categories.', 3, 'da:visualization', '{}'::jsonb),

  (qz, 'What is cognitive load in the context of dashboard design, and how should analysts minimize it?',
   'A stakeholder says your dashboard feels "overwhelming" even though it contains only accurate data.',
   '["The total file size of the dashboard","The mental effort required for a viewer to extract the insight they need — minimized by reducing visual clutter, using consistent layouts, pre-attentive highlights, and showing only the metrics needed to support the intended decision","The time it takes for the dashboard to load","The number of data sources connected to the dashboard"]'::jsonb,
   1, 'High cognitive load forces the viewer to do the analyst''s job — searching for the signal in noise. Minimize it by: removing chart borders and gridlines where unnecessary, using a consistent color palette (not rainbow), limiting each dashboard to its decision purpose, labeling data directly instead of using legends, and using whitespace generously. Every element that does not aid comprehension should be removed.', 4, 'da:visualization', '{}'::jsonb),

  (qz, 'An executive dashboard and an operational dashboard serve different audiences. What is the key design difference?',
   'The analytics team is building two dashboards from the same data: one for the CEO and one for the call center supervisor.',
   '["Executive dashboards use more colors","Executive dashboards show high-level KPIs and trends to support strategic decisions; operational dashboards show granular, real-time metrics that enable immediate action at the team level","Operational dashboards are less accurate","Executive dashboards require more data sources"]'::jsonb,
   1, 'Executive dashboards answer: "Are we on track strategically?" — they show 3–5 KPIs with trend lines and variance to target. Operational dashboards answer: "What do I need to act on right now?" — they show queue depths, agent availability, SLA breach counts. Designing an executive dashboard with operational granularity causes analysis paralysis; designing an operational dashboard at executive altitude hides the actionable detail.', 5, 'da:visualization', '{}'::jsonb),

  (qz, 'A scatter plot is the best tool for visualizing what type of relationship?',
   'You want to show whether there is a relationship between marketing spend and customer acquisition volume across 120 monthly observations.',
   '["The proportion of a whole divided across categories","Trends over time for a single metric","The relationship or correlation between two continuous numeric variables","The ranking of categories by a single measure"]'::jsonb,
   2, 'Scatter plots show the joint distribution of two continuous variables and make correlation, clusters, and outliers visually apparent. A trend line (regression line) can be overlaid to show the direction and strength of the relationship. Scatter plots are inappropriate for categorical or time-series data — where bar charts and line charts respectively excel.', 6, 'da:visualization', '{}'::jsonb),

  (qz, 'Which of the following is a problematic use of color in a data visualization?',
   'You review a colleague''s bar chart that uses 8 different colors to distinguish 8 product lines with no other visual encoding.',
   '["Using blue for positive values and red for negative values","Using a sequential color scale from light to dark to encode quantity","Using 8 distinct hues to encode 8 categories, when the audience includes people with color blindness and no other visual encoding is used","Using gray for all non-highlighted bars"]'::jsonb,
   2, 'Using many distinct colors as the only differentiator is problematic for two reasons: approximately 8% of men have red-green color blindness (making many hue combinations indistinguishable), and human perception cannot reliably distinguish more than ~5–7 hues. Add shape, pattern, or direct labels as secondary encoding. The blue/red positive/negative convention is widely accepted; sequential scales for quantitative data are appropriate.', 7, 'da:visualization', '{}'::jsonb),

  (qz, 'What does "data-ink ratio" mean, and how does it guide chart design?',
   'A designer suggests adding a gradient background, thick border lines, and a 3D effect to your bar chart to "make it look more professional."',
   '["The ratio of data points to the chart size in pixels","Edward Tufte''s principle that the proportion of ink used to encode actual data should be maximized by eliminating non-data ink (gridlines, borders, 3D effects, decorative elements) that adds visual noise without adding information","The file size ratio between chart image and data source","The number of colors divided by the number of data series"]'::jsonb,
   1, 'Tufte''s data-ink ratio principle: every drop of ink (or pixel) should either encode data or serve a necessary structural purpose. 3D effects, gradient backgrounds, decorative shadows, heavy gridlines, and thick borders consume ink without adding information — they decrease signal-to-noise ratio. The cleaner the chart, the faster the viewer finds the insight.', 8, 'da:visualization', '{}'::jsonb),

  (qz, 'What is the primary functional difference between Tableau and Power BI that affects tool selection?',
   'Your analytics team is deciding which BI tool to standardize on. The organization is heavily invested in Microsoft 365.',
   '["Tableau can only connect to SQL databases; Power BI can connect to any source","Tableau is stronger for ad-hoc visual exploration and is tool-agnostic; Power BI integrates deeply with the Microsoft ecosystem (Azure, Excel, Teams, Active Directory) and has lower licensing cost for Microsoft-heavy organizations","Power BI cannot publish to the web","Tableau is free; Power BI requires enterprise licensing"]'::jsonb,
   1, 'Both tools are capable; the decision is primarily contextual. Power BI''s deep Microsoft integration (SSO via Active Directory, native Teams embedding, Excel connectivity, Azure data source support) makes it the natural choice for Microsoft-centric organizations. Tableau is preferred by teams that prioritize visual flexibility, complex calculated fields, and tool-agnostic deployment. Neither is universally superior.', 9, 'da:visualization', '{}'::jsonb),

  (qz, 'A line chart shows revenue trending upward steeply. A colleague points out the y-axis starts at $950,000 instead of $0. What is the problem?',
   'The chart is being used in a board presentation to show the growth trajectory of the business over the past 12 months.',
   '["There is no problem — truncating the y-axis always improves readability","Starting the y-axis above zero exaggerates the visual slope of the trend, making small changes look dramatic — this can mislead viewers about the magnitude of growth","Starting at zero would make the chart impossible to read","The problem is the x-axis, not the y-axis"]'::jsonb,
   1, 'Truncating the y-axis above zero compresses the baseline and exaggerates visual change. A $10K gain on a $950K–$960K y-axis looks like 100% growth visually. For line charts showing absolute values, starting at zero provides accurate visual context. For showing rates of change, starting above zero is acceptable if the chart title and axis labels make this explicit.', 10, 'da:visualization', '{}'::jsonb),

  (qz, 'When should an analyst use a heatmap instead of a bar chart?',
   'You need to show customer activity levels by day of week and hour of day — 168 cells of data — on a single view.',
   '["When showing trends over time for a single metric","When comparing 2–4 categories on a single measure","When visualizing the density or intensity of a two-dimensional matrix of values — heatmaps encode a third variable (magnitude) as color across a grid of two categorical dimensions","When the data contains negative values"]'::jsonb,
   2, 'A heatmap is ideal for showing magnitude across two categorical dimensions simultaneously. 168 bars (24 hours × 7 days) would be unreadable; a 7×24 heatmap lets the viewer instantly spot peak activity periods by color intensity. The tradeoff is that precise values are harder to read from color than from bar length — add tooltips for precision.', 11, 'da:visualization', '{}'::jsonb),

  (qz, 'An analyst creates a chart but cannot decide what title to use and writes "Revenue by Month." A senior analyst suggests "Revenue Growth Accelerated in Q3 After Campaign Launch." What principle does the senior analyst''s title apply?',
   'The chart will be used in an executive summary where viewers have 30 seconds to absorb the key point.',
   '["Descriptive titles are always correct; the senior analyst''s title is too opinionated","The senior analyst is applying the ''insight title'' principle — the title should state the conclusion, not just describe the data, so the chart self-communicates its meaning to time-constrained viewers","Chart titles should be neutral to avoid bias","The senior analyst''s title is too long"]'::jsonb,
   1, 'Insight titles (also called "headline titles") communicate the finding, not just the subject. "Revenue by Month" describes the axes. "Revenue Accelerated in Q3 After Campaign Launch" tells the story. For executive audiences who skim, an insight title ensures the chart''s meaning is captured even if the chart itself is not studied. Descriptive titles shift interpretive work to the reader.', 12, 'da:visualization', '{}'::jsonb),

  (qz, 'A dashboard has 14 KPIs, 8 charts, and 3 tables on a single screen. A stakeholder complains they "cannot find the important number." What dashboard design principle is being violated?',
   'The analytics team built a comprehensive dashboard covering all available metrics. Stakeholders rarely open it.',
   '["Responsiveness — the dashboard takes too long to load","The single-purpose principle — a dashboard should be designed around a specific decision or audience, showing the minimum set of metrics that informs that decision; a 25-element dashboard serves no audience well","Data freshness — the metrics may be stale","Color contrast — more colors would help viewers find key numbers"]'::jsonb,
   1, 'Dashboard sprawl (too many metrics on one screen) is the most common BI failure. It signals that no one asked "what decision does this dashboard support?" Design backward from the decision: identify 1–3 primary questions the dashboard must answer, include only the metrics that answer those questions, and move everything else to a drill-down or secondary view.', 13, 'da:visualization', '{}'::jsonb),

  (qz, 'A product manager asks for a visualization showing the user journey from sign-up through first purchase. Which chart type is specifically designed for this use case?',
   'The growth team wants to see what percentage of users who sign up complete each subsequent step toward making their first purchase.',
   '["A line chart showing user counts over time","A pie chart showing the proportion of users at each step","A funnel chart — designed to show the progressive reduction of a population through sequential stages of a process","A scatter plot comparing sign-up date to purchase date"]'::jsonb,
   2, 'A funnel chart is built for sequential conversion analysis. It visually encodes the drop-off between each stage, making it immediately apparent where the biggest losses occur. Line charts show temporal trends, not sequential stage conversion; pie charts show composition at a single point in time; scatter plots show relationships between two continuous variables.', 14, 'da:visualization', '{}'::jsonb),

  (qz, 'An analyst presents a chart that clearly shows a correlation and concludes: "This chart proves our marketing campaign caused the sales increase." What is wrong with this conclusion?',
   'The chart overlays the campaign launch date with a visible sales upward trend that begins at the same time.',
   '["Nothing is wrong — overlapping timing is sufficient proof","The chart shows association in time (correlation), not causation. Without a controlled experiment or causal model accounting for confounders (seasonality, competitor actions, economic conditions), the chart cannot prove the campaign caused the increase","The chart type is wrong for this analysis","The conclusion is correct if the correlation is above 0.7"]'::jsonb,
   1, 'Visualizations can reveal association; they cannot prove causation. A sales lift coinciding with a campaign launch could be caused by the campaign, by seasonal patterns, by a competitor''s stumble, or by a third factor that drove both the campaign launch and the sales. An honest analyst says "associated with" or "coincided with," not "caused." Establishing causation requires experimental design (A/B test) or rigorous causal methods.', 15, 'da:visualization', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 5 — Business Intelligence & Reporting  (order_index 5)
  -- Competency: da:bi
  -- ═══════════════════════════════════════════════════════════════════════════
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 5 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 5'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 5 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is a KPI, and what separates a good KPI from a vanity metric?',
   'The Head of Growth asks you to define the five most important KPIs for the SaaS product. The current list has 32 metrics tracked weekly.',
   '["KPIs are any metrics tracked in a dashboard","A KPI (Key Performance Indicator) is a metric tied to a specific strategic objective with a defined target and time horizon — a vanity metric looks impressive but does not correlate with actual business outcomes or inform decisions","KPIs are only financial metrics","Any metric becomes a KPI once it is reported to leadership"]'::jsonb,
   1, 'A KPI must satisfy three criteria: it measures progress toward a specific goal, it has a defined target (not just "go up"), and it informs a decision when it deviates. Vanity metrics (e.g. total registered users) feel good but do not signal health. Monthly active paying users with a revenue threshold is a KPI; total users is a vanity metric.', 1, 'da:bi', '{}'::jsonb),

  (qz, 'What is a semantic model (or semantic layer) in a BI architecture?',
   'Different teams are calculating "Monthly Active Users" differently, producing inconsistent numbers across dashboards.',
   '["A natural language interface for querying databases","An abstraction layer that defines business metrics, calculations, and relationships in a central location so that all BI tools and users draw from the same agreed definitions — ensuring metric consistency","A type of machine learning model for text analysis","A database schema documentation tool"]'::jsonb,
   1, 'The semantic layer (implemented in tools like dbt metrics, Looker LookML, or Power BI semantic models) is where business logic lives: how MAU is calculated, what "revenue" includes, how churn is defined. When all dashboards query through the semantic layer, the same business term always produces the same number — eliminating the "whose number is right?" problem.', 2, 'da:bi', '{}'::jsonb),

  (qz, 'What is self-serve BI, and what governance challenge does it introduce?',
   'The analytics team gave all 200 employees access to the raw data warehouse so they could build their own reports. Six months later, there are 400 conflicting reports.',
   '["A BI approach where the BI tool builds reports automatically","An approach that empowers business users to create their own analyses without requesting each report from IT — but introduces the risk of metric inconsistency, data sprawl, and ungoverned definitions proliferating across the organization","A security model where users only see their own data","A self-updating report that refreshes without analyst input"]'::jsonb,
   1, 'Self-serve BI trades speed for governance risk. Empowering users to build reports accelerates insight but creates ''BI sprawl'' — hundreds of conflicting definitions of the same metric. The solution is a governed self-serve model: curated, certified data sets with agreed definitions (via a semantic layer) that users can explore, plus guardrails on what raw data is directly accessible.', 3, 'da:bi', '{}'::jsonb),

  (qz, 'What is the difference between a data warehouse and a data lake?',
   'Your organization is debating whether to migrate from its legacy data warehouse to a data lake architecture.',
   '["A data lake is a smaller version of a data warehouse","A data warehouse stores structured, schema-defined data optimized for analytical queries; a data lake stores raw data in any format (structured, semi-structured, unstructured) at lower cost, with schema defined at query time — each has distinct use cases","A data warehouse is always in the cloud; a data lake is always on-premise","Data lakes are replacing data warehouses entirely"]'::jsonb,
   1, 'Data warehouses impose schema-on-write (structure enforced before loading) and are optimized for fast, governed analytical queries. Data lakes accept raw data as-is (schema-on-read) and are flexible and cheap for storage. The modern pattern is often a ''lakehouse'' — combining lake-style storage with warehouse-style query optimization (e.g. Databricks Delta Lake, BigQuery).', 4, 'da:bi', '{}'::jsonb),

  (qz, 'A business stakeholder asks for a report showing "all revenue." The analyst realizes this could mean gross revenue, net revenue, recognized revenue, or cash collected. What should the analyst do?',
   'You receive the request via email with no further context two hours before a board meeting.',
   '["Build the report using gross revenue as a default","Build all four versions and let the stakeholder pick","Ask one clarifying question: ''Which definition of revenue should this report use, and what decision will it inform?'' — then confirm the agreed definition is documented in the report","Deliver net revenue because it is the most conservative metric"]'::jsonb,
   2, 'Ambiguous metric requests are among the most dangerous BI situations. Delivering the wrong definition of revenue to a board meeting is a credibility-destroying error. One clarifying question, answered in two minutes, prevents it. Document the agreed definition in the report itself so the metric can be reproduced consistently in future.', 5, 'da:bi', '{}'::jsonb),

  (qz, 'What is "BI sprawl" and what is the primary organizational cause?',
   'The analytics team discovers there are 847 active reports across the organization, 70% of which have not been opened in six months.',
   '["BI sprawl is a database performance problem caused by too many concurrent queries","BI sprawl is the proliferation of inconsistent, redundant, and ungoverned reports that accumulates when there is no BI governance framework — typically caused by every team building its own reports to work around slow centralized analytics, with no lifecycle management to retire unused content","BI sprawl is caused by using too many different BI tools simultaneously","BI sprawl only affects organizations with more than 1,000 employees"]'::jsonb,
   1, 'BI sprawl is a governance failure, not a technical one. It happens when: teams cannot get reports quickly from analytics, so they build their own; there is no report ownership or retirement process; and there is no governed semantic layer ensuring consistency. The result is hundreds of conflicting, unmaintained reports that erode trust in data.', 6, 'da:bi', '{}'::jsonb),

  (qz, 'Which reporting cadence is most appropriate for a weekly executive sales summary?',
   'You are designing the operational reporting cadence for a mid-size e-commerce company. Sales leadership reviews performance weekly.',
   '["Real-time streaming dashboard updated every second","A monthly PDF emailed on the last day of the month","A weekly snapshot report delivered Monday morning, showing the prior week''s performance vs. target and prior week — aligned to the rhythm of the business review cycle","Ad-hoc reporting with no scheduled delivery"]'::jsonb,
   2, 'Reporting cadence should match the business''s decision rhythm. Weekly sales reviews need weekly data, delivered before the review meeting (Monday morning) so leadership arrives prepared. Real-time is unnecessary and expensive for weekly review cycles; monthly cadence misses the weekly review entirely. Aligning data delivery to the decision calendar is a core BI design principle.', 7, 'da:bi', '{}'::jsonb),

  (qz, 'What is a BI certification process, and why is it important in a large organization?',
   'The BI team receives complaints that different departments quote different revenue numbers in the same executive meeting.',
   '["A certification exam required for BI tool users","A quality control process where specific datasets and reports are reviewed, validated, and officially approved as trustworthy — published with a ''certified'' badge so users know which data sources are governed and which are exploratory","A vendor compliance process for BI software licensing","A process for renewing BI tool licenses annually"]'::jsonb,
   1, 'BI certification is a governance mechanism. When a dataset or report is certified, it signals: this is the official number, built on agreed definitions, reviewed for accuracy, and maintained by a named owner. Uncertified reports are exploratory and should not be cited in executive discussions. Certification programs are the primary cure for the "whose number is right?" problem.', 8, 'da:bi', '{}'::jsonb),

  (qz, 'A company has both a data warehouse and a data mart. What is the relationship between them?',
   'A business unit analyst asks why she should use the "Sales data mart" instead of querying the main data warehouse directly.',
   '["A data mart is a backup copy of the data warehouse","A data mart is a subject-specific, department-focused subset of the data warehouse — pre-modeled and optimized for a specific team''s analytical needs (e.g. Sales, Finance, Marketing), providing faster queries and governed, business-ready data without exposing the full warehouse complexity","A data mart replaces the data warehouse for small teams","A data mart stores real-time data; the warehouse stores historical data"]'::jsonb,
   1, 'Data marts are purpose-built layers on top of (or derived from) the data warehouse. They contain only the tables relevant to a specific domain, with pre-built metrics and joins already defined. This reduces query complexity for business users, improves performance, and provides a governed access point that hides raw warehouse complexity.', 9, 'da:bi', '{}'::jsonb),

  (qz, 'What is the primary risk when two different teams calculate the same metric (e.g. "Monthly Active Users") independently in their own dashboards?',
   'The product team reports 45,000 MAU; the marketing team reports 62,000 MAU in the same all-hands meeting.',
   '["One team is intentionally misrepresenting the data","The numbers may differ because each team uses a different definition (different activity criteria, different time windows, different user inclusion rules) — without a single governed definition, the same term produces different numbers, eroding trust in all analytics","The data warehouse has a synchronization error","The BI tools used by each team have calculation bugs"]'::jsonb,
   1, 'Metric inconsistency is a governance failure, not a data quality failure. Both teams may be technically correct by their own definitions. The fix is a semantic layer with one official MAU definition that both teams consume. Until then, every meeting where both numbers appear will end with a debate about methodology instead of a decision about the business.', 10, 'da:bi', '{}'::jsonb),

  (qz, 'A BI analyst is asked to design a KPI framework for a new product line. What is the correct starting point?',
   'The product director wants a set of KPIs ready for the quarterly business review in three weeks.',
   '["Start with the available data and build KPIs from what can be measured","Start with the BI tool and design the dashboard layout first","Start with the strategic objectives: what outcomes must this product achieve? Then define the metrics that measure progress toward each outcome, set targets, and only then identify the data needed to calculate them","Copy the KPI framework from a similar product in the industry"]'::jsonb,
   2, 'KPIs must be defined top-down from strategy, not bottom-up from available data. Starting with data produces metrics that are easy to measure but may not reflect strategic goals. Starting from objectives produces KPIs that are actually key — and sometimes reveals data gaps that need to be filled to measure what actually matters.', 11, 'da:bi', '{}'::jsonb),

  (qz, 'What is a "single source of truth" in BI architecture, and what technical pattern typically implements it?',
   'After a merger, two business units have separate data warehouses with conflicting customer records and different metric definitions.',
   '["A single report that all users are required to use","A single database server without any replication","A governed data layer — typically a central data warehouse or lakehouse with a semantic model — where all metrics are defined once and consumed by all downstream tools, ensuring every stakeholder is working from the same definitions and data","A policy requiring all analysts to use the same BI tool"]'::jsonb,
   2, 'Single source of truth (SSOT) is an architectural principle: business logic, metric definitions, and canonical data live in one governed place. The semantic layer (dbt metrics, Power BI dataset, Looker LookML) is the most common implementation — it sits between the warehouse and the BI tools, translating agreed business definitions into SQL that all tools consume consistently.', 12, 'da:bi', '{}'::jsonb),

  (qz, 'An analyst is asked to build a dashboard for the operations team that monitors real-time order fulfillment. Which architecture decision is most important?',
   'The operations team needs to see current queue depths and order status within 2 minutes of any change.',
   '["Use a weekly batch ETL pipeline feeding a star schema","Use a nightly data warehouse refresh","Use a near-real-time data pipeline (streaming or micro-batch) feeding a low-latency data store — the 2-minute SLA requirement makes batch architectures inappropriate","Use a CSV export refreshed manually by the analyst each morning"]'::jsonb,
   2, 'Reporting architecture must be designed to meet the data freshness SLA the business requires. A 2-minute freshness requirement eliminates nightly batch loads entirely. Near-real-time streaming (Kafka, Kinesis) or micro-batch pipelines (scheduled every 1–2 minutes) feeding an operational data store (not a traditional analytics warehouse) are the appropriate patterns for operational monitoring at this latency.', 13, 'da:bi', '{}'::jsonb),

  (qz, 'A BI team is told to "just add more dashboards" whenever a new business question arises. What is the organizational problem this reveals, and what is the recommended solution?',
   'After 18 months, the BI team has 300+ dashboards but stakeholders still say they cannot find the answers they need.',
   '["The BI tools are not powerful enough","The data warehouse needs more storage","The organization lacks a BI governance framework — adding dashboards without curation, ownership, and lifecycle management creates sprawl, not insight. The solution is a product-managed BI approach: treat the analytics catalog like a product with defined use cases, certified content, and retirement of unused reports","The analysts need more training on BI tools"]'::jsonb,
   2, 'Treating BI as a ticket queue ("new question = new dashboard") ignores the product management dimension of analytics. A product-managed BI approach: audit existing content, certify high-value reports, establish ownership for each certified report, create a request intake process that maps new questions to existing content first, and retire unused dashboards. This converts sprawl into a curated, trusted catalog.', 14, 'da:bi', '{}'::jsonb),

  (qz, 'An organization has 15 different definitions of "customer churn" used across product, finance, and sales dashboards. A new CDO wants to fix this. What is the correct sequence of steps?',
   'The CEO received three different churn numbers in one week, all from internal dashboards, and has lost confidence in the analytics function.',
   '["Delete all existing dashboards and rebuild from scratch","Force all teams to use the same BI tool","Convene a cross-functional working group to align on a single official churn definition with business sign-off, implement it in the semantic layer, publish it in the data dictionary, certify the reports that use it, and deprecate conflicting reports over a transition period","Ask IT to query the database and pick whichever definition matches the CEO''s preferred number"]'::jsonb,
   2, 'Metric alignment is a business problem, not a technical one. You cannot fix 15 definitions by rewriting SQL — you must get business stakeholders to agree on one definition first. The semantic layer implements the agreed definition technically. The data dictionary documents it. Certification signals it is official. The transition period manages change carefully to avoid breaking reports teams depend on. This is the full BI governance intervention.', 15, 'da:bi', '{}'::jsonb);

END $$;

-- =============================================================================
-- VERIFICATION QUERY — run this after applying the DO block above
-- Expected: each module 1–5 shows total_questions = 15
-- =============================================================================
SELECT c.order_index AS module, c.title AS module_title,
       count(qq.id)                                                AS total_questions,
       count(qq.id) FILTER (WHERE qq.status = 'approved')         AS approved,
       count(DISTINCT qq.competency)                               AS distinct_competencies
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.quizzes qz ON qz.chapter_id = c.id AND qz.quiz_type = 'chapter_end'
LEFT JOIN public.quiz_questions qq ON qq.quiz_id = qz.id
WHERE co.title = 'AI Data Analyst & Decision Intelligence Professional'
  AND c.order_index IN (1, 2, 3, 4, 5)
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
