-- =============================================================================
-- DA Quiz Questions — Modules 1-9
-- Course: AI Data Analyst & Decision Intelligence Professional (da-v1)
-- 15 questions per module, order_index 1–9 → 135 questions total
-- Competency slugs per COMPETENCY_TAXONOMY.md §8
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================

-- ============================================================
-- MODULE 1 — Introduction to Data Analysis (da:sql)
-- ============================================================
DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz
  FROM public.quizzes q
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid AND c.order_index = 1 AND q.quiz_type = 'chapter_end'
  LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 1'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 1 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is the primary role of a data analyst in an organization?',
   '',
   '["Writing production application code","Transforming raw data into actionable insights that support business decisions","Managing the company''s IT infrastructure","Designing marketing campaigns"]'::jsonb,
   1, 'A data analyst''s core function is bridging raw data and business decisions. While analysts may write code (SQL, Python), the purpose is insight generation, not software production. IT infrastructure management and marketing campaign design are distinct roles.', 1, 'da:sql', '{}'::jsonb),

  (qz, 'Which of the following best describes a relational database?',
   '',
   '["A flat file where all data is stored in one continuous table","A collection of tables that store data in rows and columns, with relationships defined between tables using keys","A storage system that only holds images and documents","A programming language for data transformation"]'::jsonb,
   1, 'A relational database organizes data into structured tables where rows are records and columns are attributes. Tables relate to each other via primary and foreign keys. This enables efficient querying across related entities. Flat files and document stores are different paradigms entirely.', 2, 'da:sql', '{}'::jsonb),

  (qz, 'In a typical data pipeline, what happens FIRST?',
   '',
   '["Visualization","Analysis","Data collection and ingestion","Report distribution"]'::jsonb,
   2, 'The data pipeline starts with collection and ingestion — pulling raw data from source systems into a staging or storage layer. Only after data is ingested can it be cleaned, transformed, analyzed, and ultimately visualized or distributed as reports.', 3, 'da:sql', '{}'::jsonb),

  (qz, 'What does SQL stand for?',
   '',
   '["Structured Query Language","System Query Logic","Standard Querying Library","Sequential Query Loop"]'::jsonb,
   0, 'SQL stands for Structured Query Language. It is the standard language for interacting with relational databases — querying, inserting, updating, and deleting data. The other options are invented terms not used in the industry.', 4, 'da:sql', '{}'::jsonb),

  (qz, 'Which SQL statement is used to retrieve data from a database table?',
   '',
   '["INSERT","UPDATE","SELECT","CREATE"]'::jsonb,
   2, 'SELECT is the SQL command for reading (querying) data. INSERT adds new rows, UPDATE modifies existing rows, and CREATE defines new database objects like tables. The SELECT statement is the most frequently used SQL command by analysts.', 5, 'da:sql', '{}'::jsonb),

  (qz, 'A business analyst asks: "How many customers made a purchase last month?" Which SQL concept is needed to answer this?',
   'The purchases table has columns: customer_id, purchase_date, and amount.',
   '["A JOIN between two tables","A SELECT with a WHERE filter on purchase_date and a COUNT aggregate","An UPDATE statement","A CREATE TABLE command"]'::jsonb,
   1, 'Counting purchases within a date range requires SELECT (to read), WHERE (to filter by date), and COUNT (to aggregate). No JOIN is needed because all relevant data is in a single table. UPDATE and CREATE TABLE are write operations irrelevant to analytical queries.', 6, 'da:sql', '{}'::jsonb),

  (qz, 'What is a primary key in a relational database?',
   '',
   '["Any column that stores numbers","A column (or combination of columns) that uniquely identifies each row in a table","The first column in every table, always named ''id''","A password used to access the database"]'::jsonb,
   1, 'A primary key uniquely identifies each record in a table — no two rows can share the same primary key value, and it cannot be null. It is not required to be named ''id'' or to be numeric. Primary keys are fundamental to establishing relationships between tables via foreign keys.', 7, 'da:sql', '{}'::jsonb),

  (qz, 'Which tool is most appropriate for an analyst exploring a new dataset for the first time?',
   'You have just been given access to a 500,000-row transactions table and want to understand its structure and data quality.',
   '["Building a production dashboard immediately","Running SELECT * with a LIMIT, then profiling column distributions and checking for nulls","Writing a data migration script","Emailing the database administrator for a summary"]'::jsonb,
   1, 'Exploratory analysis starts with understanding data shape, not building deliverables. Limiting rows prevents overwhelming output while column profiling reveals data quality issues early. Jumping to dashboards before understanding data quality leads to misleading reports.', 8, 'da:sql', '{}'::jsonb),

  (qz, 'What does "data granularity" mean?',
   '',
   '["The speed at which data is loaded","The level of detail at which data is stored — e.g., individual transactions vs. daily summaries","The color scheme used in charts","The number of columns in a table"]'::jsonb,
   1, 'Granularity describes the level of detail in a dataset. Transaction-level data is high granularity; monthly totals are low granularity. Choosing the right granularity matters enormously: summarized data may hide patterns that transaction-level data would reveal.', 9, 'da:sql', '{}'::jsonb),

  (qz, 'A foreign key in a relational database serves what purpose?',
   '',
   '["It encrypts sensitive columns","It links a column in one table to the primary key of another table, establishing a relationship","It speeds up SELECT queries automatically","It prevents any duplicate values in the column"]'::jsonb,
   1, 'A foreign key enforces referential integrity by linking records in one table to records in another. For example, an orders table might have a customer_id foreign key referencing the customers table. Foreign keys are not encryption tools, automatic indexes, or uniqueness constraints.', 10, 'da:sql', '{}'::jsonb),

  (qz, 'A stakeholder says "I want to see our sales data." What is the analyst''s best first response?',
   'The company has 12 different sales-related tables spanning five years of transactional history.',
   '["Immediately build a dashboard with all available data","Ask clarifying questions: what decision is this data meant to support, what time period, which products or regions, and what level of detail is needed","Send all 12 raw tables to the stakeholder","Ask the IT team to build a new database"]'::jsonb,
   1, 'Analytical work starts with understanding the business question, not the data. Without clarifying the decision context, time period, and granularity, any deliverable risks being irrelevant. The analytical mindset prioritizes question-first, then data-second.', 11, 'da:sql', '{}'::jsonb),

  (qz, 'Which of the following is an example of structured data?',
   '',
   '["A collection of customer support email threads","A table of sales transactions with defined columns for date, product, and amount","Social media posts in various languages","Video recordings of customer interviews"]'::jsonb,
   1, 'Structured data is organized in a predefined schema — rows and columns with defined data types. Sales transaction tables are the canonical example. Emails, social media posts, and videos are unstructured data with no inherent schema that SQL can directly query.', 12, 'da:sql', '{}'::jsonb),

  (qz, 'Why do analysts use ORDER BY in SQL queries?',
   '',
   '["To aggregate data using functions like SUM or COUNT","To define which table to query","To filter out unwanted rows","To sort the result set by one or more columns"]'::jsonb,
   3, 'ORDER BY controls the sequence of rows returned. It is used to rank results, identify top performers, or present data chronologically. WHERE filters rows, aggregate functions summarize data, and FROM defines the source table — none of these are ORDER BY''s function.', 13, 'da:sql', '{}'::jsonb),

  (qz, 'An analyst queries a table and gets different row counts each time the query runs. What is the most likely explanation?',
   'The query is: SELECT COUNT(*) FROM public.orders WHERE status = ''pending''.',
   '["SQL COUNT is inconsistent by design","New rows are being inserted into the orders table between runs, or rows are being updated to/from ''pending'' status","The database is broken","The analyst is using the wrong aggregation function"]'::jsonb,
   1, 'Live databases are constantly updated by applications. A COUNT on a live table reflects data at the moment of query execution. If orders are being created or statuses updated, counts will legitimately vary. This is expected behavior in production systems, not a SQL defect.', 14, 'da:sql', '{}'::jsonb),

  (qz, 'Which analytical mindset principle best prevents the common mistake of "finding what you expect to find" in data?',
   'A manager tells you before your analysis: "I''m certain our new feature caused the sales spike last quarter."',
   '["Confirmation bias: look for data that supports the manager''s claim first","Hypothesis-driven analysis with pre-registered expectations: form a testable hypothesis, define what evidence would falsify it, then look at the data without cherry-picking","Only analyze data from the past week to keep it simple","Ask the manager to run the analysis themselves"]'::jsonb,
   1, 'Confirmation bias — seeking data that supports a preexisting belief — is one of the most dangerous analytical errors. Hypothesis-driven analysis counters this by defining what disconfirming evidence would look like before examining the data. Pre-registering expectations prevents post-hoc rationalization of results.', 15, 'da:sql', '{}'::jsonb);

END $$;

-- ============================================================
-- MODULE 2 — SQL Foundations (da:sql)
-- ============================================================
DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz
  FROM public.quizzes q
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid AND c.order_index = 2 AND q.quiz_type = 'chapter_end'
  LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 2'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 2 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'Which SQL clause filters rows BEFORE aggregation?',
   '',
   '["WHERE","HAVING","ORDER BY","GROUP BY"]'::jsonb,
   0, 'WHERE filters individual rows before any grouping or aggregation occurs. HAVING filters groups after aggregation. ORDER BY sorts the result. GROUP BY partitions rows into groups. Using WHERE vs. HAVING in the wrong place is a common SQL mistake that produces incorrect results.', 1, 'da:sql', '{}'::jsonb),

  (qz, 'What does a LEFT JOIN return?',
   '',
   '["Only rows where both tables have matching values","All rows from the left table, plus matching rows from the right table — with NULLs where there is no match","All rows from both tables, regardless of match","Only rows unique to the left table"]'::jsonb,
   1, 'LEFT JOIN preserves every row from the left (first) table. Where the right table has no matching row, columns from the right table return NULL. This is essential for finding customers with no orders, products never sold, etc. INNER JOIN only returns matched rows; FULL OUTER JOIN returns all rows from both sides.', 2, 'da:sql', '{}'::jsonb),

  (qz, 'Which aggregate function returns the number of non-NULL values in a column?',
   '',
   '["MAX","SUM","AVG","COUNT(column_name)"]'::jsonb,
   3, 'COUNT(column_name) counts non-NULL values in that column. COUNT(*) counts all rows including NULLs. SUM adds values, AVG averages them, MAX finds the maximum — none count rows. Distinguishing COUNT(*) from COUNT(column) is critical when columns have NULLs.', 3, 'da:sql', '{}'::jsonb),

  (qz, 'What is the correct order of clauses in a SELECT statement?',
   '',
   '["FROM → WHERE → SELECT → GROUP BY → HAVING → ORDER BY","SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY","WHERE → FROM → SELECT → HAVING → GROUP BY → ORDER BY","SELECT → WHERE → FROM → GROUP BY → ORDER BY → HAVING"]'::jsonb,
   1, 'Standard SQL clause order is: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY. This order reflects the logical processing sequence: define the source (FROM), filter rows (WHERE), group (GROUP BY), filter groups (HAVING), select columns (SELECT), and sort (ORDER BY). Violating this order causes syntax errors.', 4, 'da:sql', '{}'::jsonb),

  (qz, 'A query uses GROUP BY department, returning one row per department. How do you then filter to show only departments with more than 10 employees?',
   '',
   '["Add WHERE count(*) > 10 before GROUP BY","Add HAVING count(*) > 10 after GROUP BY","Add ORDER BY count(*) > 10","Add LIMIT 10 at the end"]'::jsonb,
   1, 'HAVING filters aggregated groups. After GROUP BY produces per-department counts, HAVING count(*) > 10 removes departments that don''t meet the threshold. WHERE operates on individual rows before grouping and cannot reference aggregate functions like COUNT.', 5, 'da:sql', '{}'::jsonb),

  (qz, 'A marketing analyst wants all customers and, for each customer, the total amount of their orders — including customers who have never placed an order (showing 0 or NULL for them). Which join type is correct?',
   'Tables: customers (customer_id, name) and orders (order_id, customer_id, amount).',
   '["INNER JOIN — it returns all customers","RIGHT JOIN on orders","LEFT JOIN from customers to orders","CROSS JOIN"]'::jsonb,
   2, 'LEFT JOIN from customers to orders preserves every customer row. Customers with no orders get NULL for order columns (which can be COALESCE-d to 0). INNER JOIN would exclude customers with no orders entirely, which is exactly what this requirement prohibits.', 6, 'da:sql', '{}'::jsonb),

  (qz, 'What does a subquery in the WHERE clause do?',
   '',
   '["It defines a new table to join","It returns a value or set of values used as a filter criterion in the outer query","It groups rows by a computed column","It creates a stored procedure"]'::jsonb,
   1, 'A subquery in WHERE provides dynamic filter values derived from another query — for example, WHERE customer_id IN (SELECT customer_id FROM vip_customers). This avoids hardcoding values and keeps queries composable. Subqueries in FROM act as derived tables, which is a different use case.', 7, 'da:sql', '{}'::jsonb),

  (qz, 'Which JOIN returns only rows that exist in BOTH tables?',
   '',
   '["INNER JOIN","LEFT JOIN","FULL OUTER JOIN","CROSS JOIN"]'::jsonb,
   0, 'INNER JOIN is the intersection: it returns only rows where the join condition is satisfied in both tables. LEFT JOIN keeps all left-table rows. FULL OUTER JOIN keeps rows from either side. CROSS JOIN produces a Cartesian product with no matching condition.', 8, 'da:sql', '{}'::jsonb),

  (qz, 'An analyst writes: SELECT product_id, SUM(revenue) FROM sales GROUP BY product_id ORDER BY SUM(revenue) DESC. What does this query return?',
   '',
   '["Revenue for each sale, sorted by date","Total revenue per product, sorted from highest to lowest revenue","All columns from the sales table","The product with the single highest sale"]'::jsonb,
   1, 'GROUP BY product_id collapses all rows for each product into one group. SUM(revenue) adds up all revenue within each group. ORDER BY SUM(revenue) DESC ranks products from highest to lowest total revenue. This is the canonical product-revenue ranking query.', 9, 'da:sql', '{}'::jsonb),

  (qz, 'What is the difference between UNION and UNION ALL?',
   '',
   '["There is no difference — they are synonyms","UNION removes duplicate rows across the combined result sets; UNION ALL keeps all rows including duplicates","UNION ALL is only available in PostgreSQL","UNION combines tables horizontally; UNION ALL combines them vertically"]'::jsonb,
   1, 'UNION deduplicates the combined results (applying a DISTINCT operation), while UNION ALL returns all rows from all component queries including exact duplicates. UNION ALL is faster because it skips deduplication. Choose UNION when duplicates are meaningful errors; UNION ALL when you intentionally want all rows.', 10, 'da:sql', '{}'::jsonb),

  (qz, 'A query returns unexpected NULLs in a SUM column. What is the most likely cause?',
   'Query: SELECT customer_id, SUM(discount_amount) AS total_discount FROM orders GROUP BY customer_id.',
   '["SUM is broken in this database","Some customers have no rows with a discount_amount value, and SUM of no rows returns NULL","NULLs are always removed by GROUP BY","The customer_id column contains duplicates"]'::jsonb,
   1, 'SUM over an empty set (no rows matching a group) or a group where all values are NULL returns NULL, not 0. This surprises many analysts expecting 0 for customers with no discounts. The fix is COALESCE(SUM(discount_amount), 0). GROUP BY does not remove NULLs — it groups them.', 11, 'da:sql', '{}'::jsonb),

  (qz, 'Which SQL clause is used to filter results to only rows where a text column contains a specific pattern?',
   '',
   '["WHERE column = ''pattern''","WHERE column LIKE ''%pattern%''","WHERE column IN (''pattern'')","WHERE column BETWEEN ''a'' AND ''z''"]'::jsonb,
   1, 'LIKE with % wildcards enables pattern matching: %pattern% finds the pattern anywhere in the string, pattern% finds strings starting with it. An equality check (=) requires an exact match. IN checks membership against a discrete list. BETWEEN applies range conditions, not patterns.', 12, 'da:sql', '{}'::jsonb),

  (qz, 'You need to combine customer data from a legacy system table and a new system table, where both tables have the same columns. Customers may exist in either or both tables. Which approach returns every unique customer exactly once?',
   '',
   '["CROSS JOIN","INNER JOIN on customer_id","UNION ALL of both SELECT statements","UNION of both SELECT statements"]'::jsonb,
   3, 'UNION deduplicates: if a customer appears in both tables with identical column values, UNION returns them only once. UNION ALL would include duplicates. INNER JOIN only returns customers present in both tables. CROSS JOIN produces every combination, which is incorrect here.', 13, 'da:sql', '{}'::jsonb),

  (qz, 'An analyst needs the TOP 5 highest-revenue products from a query that already calculates total revenue per product. What is the most reliable SQL approach?',
   '',
   '["Add LIMIT 5 without ORDER BY","Add ORDER BY total_revenue DESC and LIMIT 5","Use HAVING total_revenue > 0","Use GROUP BY with a MAX function"]'::jsonb,
   1, 'ORDER BY total_revenue DESC ranks products from highest to lowest. LIMIT 5 then takes the first five rows after sorting. LIMIT without ORDER BY returns an arbitrary 5 rows with no revenue ranking. HAVING filters groups but does not rank them.', 14, 'da:sql', '{}'::jsonb),

  (qz, 'A query joins three tables: orders, customers, and products. It runs correctly but returns far more rows than expected — roughly the product of the three table sizes. What is the most likely cause?',
   '',
   '["The SELECT clause includes too many columns","One or more JOIN conditions are missing or incorrect, creating a partial or full Cartesian product","The WHERE clause is filtering too broadly","ORDER BY is causing row duplication"]'::jsonb,
   1, 'Missing or incorrect JOIN conditions produce a Cartesian product — every row in one table is matched with every row in another. With three large tables this creates astronomically large result sets. The fix is to verify that every JOIN has a correct ON clause referencing the appropriate foreign key relationship. Column count and ORDER BY never cause row multiplication.', 15, 'da:sql', '{}'::jsonb);

END $$;

-- ============================================================
-- MODULE 3 — SQL Mastery (da:sql)
-- ============================================================
DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz
  FROM public.quizzes q
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid AND c.order_index = 3 AND q.quiz_type = 'chapter_end'
  LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 3'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 3 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What does the PARTITION BY clause do in a window function?',
   '',
   '["It physically splits the table into separate storage partitions","It defines subsets of rows within which the window function is independently calculated, without collapsing rows like GROUP BY","It filters rows before the window function runs","It sorts rows within each window"]'::jsonb,
   1, 'PARTITION BY divides the result set into logical windows. The window function (e.g., ROW_NUMBER, SUM) is applied independently within each partition. Unlike GROUP BY, PARTITION BY does not reduce rows — each original row retains its result. ORDER BY inside OVER() controls ordering within each partition.', 1, 'da:sql', '{}'::jsonb),

  (qz, 'What is the difference between RANK() and DENSE_RANK()?',
   '',
   '["They are identical functions","RANK() skips rank numbers after ties (e.g., 1,1,3); DENSE_RANK() does not skip (e.g., 1,1,2)","DENSE_RANK() skips rank numbers; RANK() does not","RANK() only works with numeric columns"]'::jsonb,
   1, 'When two rows tie, both RANK() and DENSE_RANK() assign them the same rank. But RANK() then skips the next rank number (1,1,3,4), while DENSE_RANK() continues sequentially (1,1,2,3). The choice matters when you need "top N distinct ranks" — DENSE_RANK() is usually more intuitive for that use case.', 2, 'da:sql', '{}'::jsonb),

  (qz, 'A CTE (Common Table Expression) is defined using which SQL keyword?',
   '',
   '["DECLARE","CREATE TEMP TABLE","DEFINE","WITH"]'::jsonb,
   3, 'CTEs are introduced with the WITH keyword: WITH cte_name AS (SELECT ...) SELECT * FROM cte_name. They improve readability by naming intermediate result sets and can be referenced multiple times in the main query. They are not physical tables and exist only for the duration of the query.', 3, 'da:sql', '{}'::jsonb),

  (qz, 'What does the LAG() window function return?',
   '',
   '["The next row''s value in the ordered partition","The previous row''s value in the ordered partition","The running total up to the current row","The difference between the current row and the partition average"]'::jsonb,
   1, 'LAG(column, n) accesses the value n rows before the current row within the ordered partition. It is essential for period-over-period comparisons: revenue this month vs. last month. LEAD() is the mirror — it looks forward. Neither computes totals or averages by itself.', 4, 'da:sql', '{}'::jsonb),

  (qz, 'ROW_NUMBER() assigned to a result set with PARTITION BY customer_id ORDER BY order_date assigns what values?',
   '',
   '["A unique integer across the entire result set, ignoring partitions","A sequential integer starting at 1 for each customer, ordered by order_date — so each customer''s earliest order gets row number 1","The same number to all rows with the same customer_id","The total count of orders per customer"]'::jsonb,
   1, 'ROW_NUMBER() restarts at 1 for each partition (customer). Within each customer''s partition, rows are numbered 1, 2, 3, ... in order_date sequence. This is the standard pattern for "most recent order per customer": wrap in a CTE, then filter WHERE rn = 1.', 5, 'da:sql', '{}'::jsonb),

  (qz, 'An analyst writes a query with four nested subqueries, making it difficult to read and debug. What is the best refactoring approach?',
   '',
   '["Add more comments to the nested subqueries","Rewrite using CTEs (WITH clauses) to name each intermediate step, making the logic readable and independently testable","Move all logic into a stored procedure","Split the query into four separate queries and join their outputs in application code"]'::jsonb,
   1, 'CTEs transform deeply nested logic into a sequence of named, readable steps. Each CTE can be independently validated. This is the standard professional approach for complex analytical queries. Stored procedures add operational overhead inappropriate for ad-hoc analysis. Application-side joins sacrifice SQL set-based efficiency.', 6, 'da:sql', '{}'::jsonb),

  (qz, 'When building a user retention cohort analysis, what does "cohort" typically mean?',
   'You want to track what percentage of users who signed up each month are still active 30, 60, and 90 days later.',
   '["Any group of users who share a behavioral trait","A group of users who first engaged (signed up) in the same time period, tracked over subsequent periods","All users who are currently active","Users grouped by their geographic region"]'::jsonb,
   1, 'In cohort analysis, a cohort is defined by when users first joined or took a specific action (acquisition month/week). All members of the same cohort are tracked together over time. This isolates the behavior of that group from newer or older users, enabling true retention measurement.', 7, 'da:sql', '{}'::jsonb),

  (qz, 'What does EXPLAIN (or EXPLAIN ANALYZE) do in PostgreSQL?',
   '',
   '["It runs the query and returns the first 10 rows","It shows the execution plan the query optimizer will use — including estimated/actual costs, row counts, and join strategies — without necessarily running the full query","It adds indexes automatically to improve query speed","It translates SQL into Python code"]'::jsonb,
   1, 'EXPLAIN shows the query planner''s execution plan: which indexes are used, join order and method (hash/nested loop/merge), estimated cost and row counts. EXPLAIN ANALYZE actually executes the query and shows actual vs. estimated figures. This is the primary tool for diagnosing slow queries.', 8, 'da:sql', '{}'::jsonb),

  (qz, 'A query uses SUM(revenue) OVER (PARTITION BY region ORDER BY month) . What does this compute?',
   '',
   '["Total revenue per region for all time","Running cumulative revenue per region, accumulating month by month","Average monthly revenue per region","Total revenue across all regions per month"]'::jsonb,
   1, 'With PARTITION BY region and ORDER BY month, the default window frame is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. SUM() over this frame accumulates revenue from the first month up to and including the current month, restarting for each region. This produces a running total (cumulative sum) per region.', 9, 'da:sql', '{}'::jsonb),

  (qz, 'A funnel analysis tracks users through steps: visit → signup → purchase. A user appears in the visits table but not in the signups table. How should a funnel query handle this user?',
   '',
   '["Exclude the user entirely using INNER JOINs","Use LEFT JOINs from the first step through subsequent steps, so users who drop off at any stage are counted at that stage with NULLs for later stages","Use UNION ALL of all three tables","Require the user to complete all steps to appear in the funnel"]'::jsonb,
   1, 'Funnel queries require LEFT JOINs because the whole point is measuring drop-off. Users who don''t reach later stages must still appear at the stage where they stopped. INNER JOINs would only show users who completed every step, making the funnel appear to have 100% conversion — entirely defeating its purpose.', 10, 'da:sql', '{}'::jsonb),

  (qz, 'An analyst notices a query takes 45 seconds on a 10-million-row table. EXPLAIN reveals a "Seq Scan" (sequential scan) on the filter column. What is the most likely fix?',
   '',
   '["Reduce the number of columns in SELECT","Create an index on the column used in the WHERE clause filter","Switch from PostgreSQL to MySQL","Rewrite the query using a CTE"]'::jsonb,
   1, 'A sequential scan means the database is reading every row to find matches — O(n). Creating an index on the filter column enables an index scan — O(log n) — dramatically reducing query time on large tables. Reducing SELECT columns and CTEs do not address the scan problem. Database switching is an extreme, rarely appropriate response.', 11, 'da:sql', '{}'::jsonb),

  (qz, 'Which window function would you use to calculate each salesperson''s revenue as a percentage of the total regional revenue, without collapsing rows?',
   '',
   '["GROUP BY region with a SUM, joined back to the original table","SUM(revenue) OVER (PARTITION BY region) in the denominator, with each salesperson''s revenue in the numerator","AVG(revenue) OVER (PARTITION BY region)","A subquery with MAX(revenue)"]'::jsonb,
   1, 'The pattern is: revenue / SUM(revenue) OVER (PARTITION BY region). The window SUM gives the regional total for each row''s region without collapsing rows. Dividing each row''s revenue by this window total gives the share. The GROUP BY + join approach works but is more verbose; it is not wrong, but the window function approach is more elegant and less error-prone.', 12, 'da:sql', '{}'::jsonb),

  (qz, 'In a recursive CTE, what does the anchor member represent?',
   '',
   '["The final result of the recursion","The termination condition","The base case — the initial set of rows from which the recursion starts","The column used to join recursive iterations"]'::jsonb,
   2, 'A recursive CTE has two parts separated by UNION ALL: the anchor (base case, runs once, defines the starting rows) and the recursive member (references the CTE itself, runs repeatedly until no new rows are produced). Recursive CTEs are used for hierarchical data like org charts and bill-of-materials structures.', 13, 'da:sql', '{}'::jsonb),

  (qz, 'You need the second-highest salary in a company without using window functions. Which approach is correct?',
   '',
   '["SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees)","SELECT MIN(salary) FROM employees","SELECT salary FROM employees ORDER BY salary DESC LIMIT 1","SELECT AVG(salary) FROM employees"]'::jsonb,
   0, 'The subquery finds the maximum salary. The outer query then finds the maximum salary strictly less than that maximum — which is the second highest. LIMIT 1 with DESC gives the highest, not second. MIN gives the lowest. This is a classic interview question testing subquery and MAX composition.', 14, 'da:sql', '{}'::jsonb),

  (qz, 'A query using multiple CTEs runs slower than expected. EXPLAIN ANALYZE reveals each CTE is being materialized (evaluated eagerly and written to a temporary table). What is the professional approach to investigate this performance issue?',
   '',
   '["Always add MATERIALIZED keyword to force re-evaluation","Try adding NOT MATERIALIZED to allow the optimizer to inline the CTE, and test whether pushdown of WHERE filters into the CTE improves performance","Delete all CTEs and use subqueries instead","Add indexes to every column in every CTE"]'::jsonb,
   1, 'In PostgreSQL 12+, CTEs are materialized by default (evaluated once, result cached). NOT MATERIALIZED allows the planner to inline the CTE and push predicates into it, sometimes dramatically improving performance. The right answer depends on the query — test both. Blanket subquery conversion and adding indexes to every column are blunt instruments, not diagnostic approaches.', 15, 'da:sql', '{}'::jsonb);

END $$;

-- ============================================================
-- MODULE 4 — Data Structures and Modeling (da:data-modeling)
-- ============================================================
DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz
  FROM public.quizzes q
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid AND c.order_index = 4 AND q.quiz_type = 'chapter_end'
  LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 4'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 4 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'In a star schema, what is a fact table?',
   '',
   '["The central table that stores measurable, quantitative business events (e.g., sales transactions) with foreign keys to dimension tables","A table that stores descriptive attributes about business entities like customers and products","A lookup table of valid codes","A table that stores only historical data"]'::jsonb,
   0, 'Fact tables store the measurements or events being analyzed — sales amounts, order counts, click events. They contain numeric metrics (facts) and foreign keys pointing to dimension tables. Dimension tables store the descriptive context (who, what, where, when). This is the defining structure of a star schema.', 1, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What distinguishes a snowflake schema from a star schema?',
   '',
   '["A snowflake schema has no fact table","In a snowflake schema, dimension tables are normalized into multiple related tables, whereas in a star schema dimensions are denormalized into single flat tables","A star schema stores more data than a snowflake schema","A snowflake schema is only used for real-time data"]'::jsonb,
   1, 'Star schemas use wide, denormalized dimension tables (all attributes in one table). Snowflake schemas normalize dimensions into sub-dimension tables (e.g., product → category → department). Snowflake reduces storage redundancy but adds JOIN complexity. Star schemas are generally preferred in analytics for query simplicity.', 2, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is database normalization?',
   '',
   '["Compressing a database to save storage","Converting all data types to VARCHAR","Ensuring all column values follow the same format","The process of organizing data to reduce redundancy and improve integrity by dividing tables into smaller related tables"]'::jsonb,
   3, 'Normalization eliminates data redundancy by decomposing tables to ensure each fact is stored once. Normal forms (1NF, 2NF, 3NF) progressively remove different types of redundancy. While normalization improves data integrity and storage efficiency, it often requires more JOINs in queries — a tradeoff analytics schemas often resolve by deliberate denormalization.', 3, 'da:data-modeling', '{}'::jsonb),

  (qz, 'Which data type is most appropriate for storing a monetary value like $1,234.56 where precision matters?',
   '',
   '["VARCHAR(20)","FLOAT or DOUBLE","NUMERIC or DECIMAL with specified precision and scale","INTEGER"]'::jsonb,
   2, 'NUMERIC/DECIMAL stores exact decimal values, making them appropriate for financial data where rounding errors are unacceptable. FLOAT and DOUBLE are approximate binary floating-point types — they can introduce tiny precision errors that accumulate in financial calculations. INTEGER loses the decimal portion. VARCHAR requires conversion for arithmetic.', 4, 'da:data-modeling', '{}'::jsonb),

  (qz, 'In dimensional modeling, what is a "slowly changing dimension" (SCD)?',
   '',
   '["A dimension updated only once per year","A fact table that aggregates data slowly","A dimension that changes over time, requiring a strategy to track historical states — for example, a customer who moves to a new region","A dimension table that is never updated"]'::jsonb,
   2, 'SCDs model attributes that change infrequently but do change — customer address, product category, employee department. Different SCD types handle history differently: Type 1 overwrites (no history), Type 2 adds new rows (full history), Type 3 adds a previous-value column (limited history). The choice depends on whether historical accuracy matters for reporting.', 5, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A data warehouse has a products table referenced by a sales fact table. A product''s category is changed from "Electronics" to "Appliances." Analysts need historical sales to show the original category at time of sale. Which SCD approach supports this?',
   '',
   '["SCD Type 1 — overwrite the category value in the existing row","SCD Type 2 — insert a new row for the product with the new category, a new effective date, and mark the old row as expired","SCD Type 3 — add a ''previous_category'' column","A new fact table"]'::jsonb,
   1, 'SCD Type 2 preserves full history by inserting a new dimension row with the updated attribute and validity dates, while marking the old row as expired. Sales rows retain their foreign key to the old product row, so historical reports show "Electronics" for old sales and "Appliances" for new ones. This is the gold standard for historical accuracy in data warehousing.', 6, 'da:data-modeling', '{}'::jsonb),

  (qz, 'Why are surrogate keys preferred over natural keys as primary keys in dimensional models?',
   '',
   '["Surrogate keys are required by SQL standards","Natural keys cannot be used in JOINs","Surrogate keys are shorter and therefore faster to type","Natural keys can change over time (a customer''s email address or account number may be reassigned), while surrogate keys are system-generated integers that never change and are independent of source systems"]'::jsonb,
   3, 'Natural keys (business identifiers like email or SSN) can change, be reused, or be inconsistent across source systems. Surrogate keys are meaningless integers assigned by the warehouse, guaranteeing stability regardless of upstream changes. This insulates the data model from source system volatility — critical for long-lived analytics systems.', 7, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A grain is defined as "one row per order line item." Which of the following would violate this grain?',
   '',
   '["A row with order_id, product_id, quantity, and unit_price","A row representing an entire order with total_amount aggregated across all line items","A row with a NULL product_id for a service fee line","A row with the shipment date for a specific line item"]'::jsonb,
   1, 'The declared grain is one row per order line item. Aggregating an entire order into one row with total_amount represents a coarser grain — it violates the fact table''s declared granularity. Mixed grains in a fact table cause double-counting and incorrect aggregations. Nulls for optional fields and shipment dates at line-item level are consistent with the declared grain.', 8, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is denormalization and when is it appropriate in analytics contexts?',
   '',
   '["Denormalization is always a modeling mistake","Denormalization means converting VARCHAR columns to integers","Denormalization means removing all foreign keys from a database","Denormalization intentionally introduces redundancy by collapsing related tables into fewer, wider tables to reduce JOIN complexity and improve analytical query performance"]'::jsonb,
   3, 'Denormalization trades storage efficiency for query speed and simplicity. In OLAP (analytical) systems, where data is read frequently and rarely updated, wide denormalized tables reduce JOIN overhead and simplify SQL. In OLTP (transactional) systems, normalization protects data integrity. The trade-off is context-dependent.', 9, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is a bridge table (or junction table) used for?',
   '',
   '["Storing data that does not fit in other tables","Resolving a many-to-many relationship by creating a table with foreign keys to both sides, plus any attributes of the relationship itself","Connecting two databases on different servers","Providing a read-only view of a fact table"]'::jsonb,
   1, 'Many-to-many relationships cannot be directly represented with simple foreign keys. A bridge/junction table has one row per valid combination of the two entities'' primary keys. For example, a student-course bridge table has one row per student-course enrollment. The bridge table can also carry relationship attributes like enrollment date.', 10, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A new analyst on the team designs a fact table where some rows store order-level data and others store line-item-level data in the same table. What is wrong with this design?',
   '',
   '["Nothing — mixed grains are a best practice for flexibility","This violates grain consistency: aggregating any metric across the table will double-count or miss data because rows represent different things. The correct fix is separate fact tables at each grain, or standardizing to one grain.","The table needs more columns","The fact table should not have any NULL values"]'::jsonb,
   1, 'Mixed-grain fact tables are one of the most damaging data modeling mistakes. When some rows are order-level and others line-item-level, any SUM will either double-count (adding order totals and line-item totals) or produce nonsensical results. Each fact table must have exactly one, consistently defined grain.', 11, 'da:data-modeling', '{}'::jsonb),

  (qz, 'Which schema design is generally preferred for an OLAP (analytics) data warehouse?',
   '',
   '["Entity-relationship model optimized for write transactions","Fully normalized to 3NF to eliminate all redundancy","A star or snowflake schema with a central fact table and denormalized or lightly normalized dimensions","A document store with nested JSON objects"]'::jsonb,
   2, 'OLAP workloads involve complex, read-heavy queries across large data sets. Star/snowflake schemas minimize JOINs, simplify query logic, and align with how BI tools (Tableau, Power BI) expect data to be structured. Fully normalized 3NF schemas are optimal for OLTP transaction integrity, not analytical query performance.', 12, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A date dimension table contains columns such as date_key, full_date, day_of_week, month_name, quarter, fiscal_year, is_holiday. Why is this table valuable in a data warehouse?',
   '',
   '["It reduces the size of the fact table","It allows analysts to filter and group by date attributes (quarter, fiscal year, weekday vs. weekend) without complex date arithmetic in every query","It ensures the fact table has no NULL dates","It is required by SQL for date comparisons"]'::jsonb,
   1, 'A date dimension pre-computes every useful date attribute. Instead of writing complex EXTRACT() or CASE expressions in every query, analysts simply JOIN to the date dimension and filter on is_holiday = TRUE or quarter = ''Q4''. This is especially valuable for fiscal calendars that don''t align with calendar years.', 13, 'da:data-modeling', '{}'::jsonb),

  (qz, 'Referential integrity means:',
   '',
   '["All columns have the same data type","Every foreign key value in a child table either matches a primary key value in the parent table or is NULL — there are no orphaned references","No table can have more than one foreign key","All rows must be inserted in chronological order"]'::jsonb,
   1, 'Referential integrity guarantees that relationships between tables remain valid: you cannot have an order with a customer_id that doesn''t exist in the customers table. Databases enforce this via FOREIGN KEY constraints. Violations occur when parent rows are deleted before child rows, or when data is loaded without constraint checking.', 14, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A data model has a products dimension with 500,000 rows, each with a category_id that links to a separate categories table. Query performance is slow on product-category reports. An engineer proposes denormalizing category_name directly into the products table. What is the correct trade-off analysis?',
   '',
   '["Never denormalize — normalization is always correct","Denormalization eliminates the JOIN to categories, improving query speed. The cost is that if a category name changes, every product row must be updated. If category names are stable and read performance is critical, denormalization is the right choice.","Denormalization will always cause data corruption","Adding more indexes to categories will always be better than denormalization"]'::jsonb,
   1, 'This is a genuine architectural trade-off. Denormalization reduces JOIN overhead (significant at 500K rows) at the cost of update complexity (if category names change). For analytical workloads where category names are stable and read performance dominates, denormalization is often the right choice. A senior analyst or data engineer must weigh the update frequency before deciding.', 15, 'da:data-modeling', '{}'::jsonb);

END $$;

-- ============================================================
-- MODULE 5 — Data Cleaning and ETL (da:data-modeling)
-- ============================================================
DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz
  FROM public.quizzes q
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid AND c.order_index = 5 AND q.quiz_type = 'chapter_end'
  LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 5'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 5 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What does ETL stand for?',
   '',
   '["Extract, Transform, Load","Extract, Transfer, Load","Evaluate, Test, Launch","Export, Translate, Link"]'::jsonb,
   0, 'ETL stands for Extract, Transform, Load. Extract pulls raw data from source systems. Transform cleans, reshapes, and enriches the data. Load writes the transformed data to a destination (data warehouse, data mart). Modern ELT (Extract, Load, Transform) inverts the last two steps by loading raw data first and transforming in the warehouse.', 1, 'da:data-modeling', '{}'::jsonb),

  (qz, 'According to the DAMA data quality framework, which dimension describes whether all required data is present with no missing values?',
   '',
   '["Accuracy","Timeliness","Completeness","Consistency"]'::jsonb,
   2, 'Completeness measures whether all required data is present — no missing rows, no NULL values in mandatory fields. Accuracy measures whether values are correct. Timeliness measures whether data is available when needed. Consistency measures whether values agree across systems. These six DAMA dimensions (also including validity and uniqueness) are the standard data quality vocabulary.', 2, 'da:data-modeling', '{}'::jsonb),

  (qz, 'Which of the following best defines a data quality "outlier"?',
   '',
   '["Any value that is NULL","A value that is significantly different from the rest of the data — which may indicate a data entry error, a genuine extreme event, or a measurement anomaly requiring investigation","A duplicate row","A column with a wrong data type"]'::jsonb,
   1, 'Outliers are extreme values that deviate substantially from the distribution of other values. They may be errors (a salary of $9,999,999 instead of $99,999) or genuine extremes (a viral product sold 10,000 units in a day). Data cleaning requires investigating outliers — not blindly removing them — because real extreme events should be retained.', 3, 'da:data-modeling', '{}'::jsonb),

  (qz, 'Which SQL technique identifies duplicate rows in a dataset?',
   '',
   '["ORDER BY primary key","SELECT DISTINCT on all columns","SELECT * with LIMIT 1","GROUP BY all relevant columns, HAVING count(*) > 1"]'::jsonb,
   3, 'Grouping by all identifying columns and filtering for count > 1 surfaces sets of duplicate rows. This is the standard deduplication audit pattern. SELECT DISTINCT returns unique rows but doesn''t quantify duplicates. ORDER BY doesn''t detect duplicates — it just sorts.', 4, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What does "data consistency" mean in the DAMA quality framework?',
   '',
   '["All rows have the same number of columns","The same data item has the same value across all systems and representations — e.g., a customer''s address is identical in the CRM, billing, and shipping systems","All data was loaded at the same time","Every table has a primary key"]'::jsonb,
   1, 'Consistency measures agreement across systems and representations. Inconsistency occurs when the same entity has different values in different systems — a customer shows revenue of $5,000 in the CRM but $4,800 in the billing system. Inconsistency often indicates synchronization failures or different business logic applied in different systems.', 5, 'da:data-modeling', '{}'::jsonb),

  (qz, 'An ETL pipeline fails silently — it completes without errors but loads 200,000 fewer rows than expected. What pipeline validation practice would have caught this?',
   '',
   '["Adding more logging to the extract phase","Implementing row-count reconciliation checks that compare source row counts to destination row counts after each load and alert on discrepancies above a threshold","Using a faster ETL tool","Running the pipeline twice"]'::jsonb,
   1, 'Row-count reconciliation is a fundamental pipeline validation control. After each ETL stage, the count of records at the destination should match (or be explainably less than) the count at the source. Silent row loss — common in bad JOIN conditions, failed file splits, or network interruptions — is detected immediately by count checks.', 6, 'da:data-modeling', '{}'::jsonb),

  (qz, 'You are cleaning a date column and find values like ''01/02/2024''. What data quality issue does this most likely represent?',
   '',
   '["A completeness issue — the date is missing","An ambiguity and validity issue — ''01/02/2024'' could be January 2nd or February 1st depending on locale, making the value unreliable without knowing the source format","An outlier — dates are always wrong","A consistency issue only if another column has a different date"]'::jsonb,
   1, 'Ambiguous date formats like DD/MM vs. MM/DD create validity issues. A value that could be correctly interpreted two different ways is unreliable without format documentation. This is why data quality standards require unambiguous date formats (ISO 8601: YYYY-MM-DD) in data pipelines. The issue is about validity (is the format deterministic?) and accuracy (do we know what date is meant?).', 7, 'da:data-modeling', '{}'::jsonb),

  (qz, 'In a data pipeline, what is an "idempotent" load operation?',
   '',
   '["A load that only inserts new records and never updates","A load that runs only on weekdays","A load operation that produces the same result whether run once or multiple times — re-running it does not create duplicate data","A load that runs faster each time"]'::jsonb,
   2, 'Idempotency is a critical pipeline design property. If a pipeline fails mid-run and is restarted, an idempotent load (e.g., TRUNCATE+INSERT or UPSERT) produces correct results without manual cleanup. Non-idempotent pipelines (e.g., raw INSERT) create duplicate rows on retry. Idempotency enables safe pipeline re-runs.', 8, 'da:data-modeling', '{}'::jsonb),

  (qz, 'Which DAMA data quality dimension measures whether data arrives in time to be useful for its intended purpose?',
   '',
   '["Completeness","Uniqueness","Timeliness","Validity"]'::jsonb,
   2, 'Timeliness measures whether data is available when decision-makers need it. Sales data that arrives 3 days after the reporting window closes is complete and accurate but useless for daily operations. Timeliness SLAs (e.g., data must be loaded by 6 AM for morning dashboards) are a key data engineering requirement.', 9, 'da:data-modeling', '{}'::jsonb),

  (qz, 'An analyst finds a customer table where the same customer appears with three different email addresses across different rows. Which DAMA dimension is primarily violated?',
   '',
   '["Completeness","Uniqueness — there should be exactly one record per customer entity, not three","Timeliness","Accuracy"]'::jsonb,
   1, 'Uniqueness (also called deduplication or entity resolution) requires that each real-world entity is represented exactly once. Multiple records for the same customer lead to inflated customer counts, split revenue attribution, and incorrect lifetime value calculations. Deduplication is one of the hardest data quality problems.', 10, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is the difference between deleting a NULL value and replacing it with a default in data cleaning?',
   '',
   '["They have the same effect on downstream analysis","Deleting rows with NULLs removes real observations from the dataset, potentially introducing selection bias. Replacing with a default (imputation) preserves the row but introduces an assumption. Both approaches change the data and must be documented and justified.","NULLs should always be deleted","NULLs should always be replaced with 0"]'::jsonb,
   1, 'There is no universally correct treatment for NULLs. Deletion creates smaller datasets and can bias analysis if NULLs are not random. Imputation (replacing with mean, median, mode, or a model-predicted value) preserves sample size but injects assumptions. The choice depends on the proportion of NULLs, the reason for missingness, and the downstream analytical use.', 11, 'da:data-modeling', '{}'::jsonb),

  (qz, 'An ETL pipeline joins two large tables and loads the result into a warehouse. After loading, analysts report unexpected revenue figures. EXPLAIN on the ETL query reveals a Cartesian product on a join condition. What went wrong?',
   '',
   '["The warehouse is too small for the data volume","A JOIN condition was missing or incorrect, causing a many-to-many explosion that multiplied rows — inflating all aggregated metrics in the downstream load","The ETL tool has a bug","The analysts are filtering incorrectly"]'::jsonb,
   1, 'A missing or incorrect JOIN condition in an ETL pipeline is catastrophic: it creates a Cartesian product that multiplies row counts, causing all downstream aggregations (SUM, COUNT) to be dramatically inflated. This is a common, hard-to-spot ETL bug — it doesn''t cause an error, it silently corrupts data. Row-count checks and metric sanity checks would catch it.', 12, 'da:data-modeling', '{}'::jsonb),

  (qz, 'What is "data lineage" and why does it matter for data quality?',
   '',
   '["The order in which tables were created in the database","The history of database schema changes","The age of data records in a table","A record of where data originated, how it was transformed at each pipeline stage, and where it flows downstream — enabling analysts to trace errors back to their source"]'::jsonb,
   3, 'Data lineage documents the journey of data from source to consumption. When a metric is wrong, lineage enables root-cause analysis: which transformation introduced the error? Which source system supplied the bad value? Without lineage, debugging data quality issues is guesswork. Modern data platforms (dbt, Databricks) make lineage a first-class feature.', 13, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A data pipeline uses UPSERT (INSERT … ON CONFLICT UPDATE) logic. What problem does this solve?',
   '',
   '["It makes the pipeline run faster","It handles the case where a record may already exist in the destination: if it exists, update it; if not, insert it — preventing duplicate rows on incremental loads","It compresses large tables automatically","It validates data types before inserting"]'::jsonb,
   1, 'UPSERT solves the idempotent load problem for record-level changes. Pure INSERT fails if a record already exists (duplicate key error). UPSERT (or MERGE in some dialects) gracefully handles both new and updated records. This is the standard pattern for incremental ETL pipelines that re-process recent data windows.', 14, 'da:data-modeling', '{}'::jsonb),

  (qz, 'A retail company''s ETL pipeline loads sales data nightly. On Tuesday, analysts notice Monday''s figures are 40% lower than typical. The pipeline log shows 0 errors and 0 warnings. What is the most professional next step?',
   '',
   '["Assume Monday was a slow day and move on","Immediately contact the CEO","Investigate whether the drop is genuine (a business event like a system outage or promotion expiry) or a data issue (pipeline silently dropped records, source system had fewer transactions). Check row counts at each pipeline stage against Monday''s source system, and compare to prior Mondays.","Re-run the pipeline and assume the new numbers will be correct"]'::jsonb,
   2, 'A 40% revenue drop is a significant anomaly that requires investigation before any business response. Silent pipeline failures (missing partitions, source system issues, filter logic errors) can produce this result without errors. The analyst must distinguish data failure from business reality by comparing source counts to loaded counts, then comparing to prior-period baselines.', 15, 'da:data-modeling', '{}'::jsonb);

END $$;

-- ============================================================
-- MODULE 6 — Descriptive Statistics (da:statistics)
-- ============================================================
DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz
  FROM public.quizzes q
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid AND c.order_index = 6 AND q.quiz_type = 'chapter_end'
  LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 6'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 6 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'Which measure of central tendency is most resistant to extreme outliers?',
   '',
   '["Median","Mean","Mode","Range"]'::jsonb,
   0, 'The median (middle value when sorted) is resistant to outliers because it depends only on rank, not magnitude. The mean is pulled toward extreme values — a single $10M salary can make average salary appear far higher than what most employees earn. For skewed distributions like income or house prices, median is the more informative central tendency measure.', 1, 'da:statistics', '{}'::jsonb),

  (qz, 'What does standard deviation measure?',
   '',
   '["The most frequently occurring value","The value at the 50th percentile","The difference between the highest and lowest values","The average distance of data points from the mean — a measure of how spread out the data is"]'::jsonb,
   3, 'Standard deviation quantifies the typical distance of individual data points from the mean. Low standard deviation means values cluster tightly around the mean; high standard deviation means they are widely spread. It is the square root of variance and uses the same units as the original data, making it more interpretable than variance.', 2, 'da:statistics', '{}'::jsonb),

  (qz, 'In a perfectly normal (bell-curve) distribution, which statement is true?',
   '',
   '["The mean is always 0","The mean, median, and mode are all equal","The distribution has two peaks","The standard deviation equals the mean"]'::jsonb,
   1, 'A perfect normal distribution is symmetric around its center. Because the distribution is symmetric, the mean, median, and mode all coincide at the peak. In right-skewed distributions, mean > median > mode; in left-skewed, the order reverses. The mean being 0 is only true for the standard normal distribution, not all normal distributions.', 3, 'da:statistics', '{}'::jsonb),

  (qz, 'What does a correlation coefficient of -0.85 between two variables indicate?',
   '',
   '["No relationship between the variables","A strong positive relationship","A strong negative (inverse) relationship — as one variable increases, the other tends to decrease","A causal relationship where one variable causes the other"]'::jsonb,
   2, 'A correlation coefficient (r) ranges from -1 to +1. Values near -1 indicate a strong negative (inverse) relationship. Values near +1 indicate strong positive. Values near 0 indicate no linear relationship. Critically, correlation does not imply causation — the -0.85 only tells us the variables move in opposite directions, not why.', 4, 'da:statistics', '{}'::jsonb),

  (qz, 'What is the difference between a population and a sample?',
   '',
   '["Population data is only available for census data","A sample is always exactly 10% of the population","A population includes every member of the group being studied; a sample is a subset selected to represent that population","Population is more accurate; sample is less accurate"]'::jsonb,
   2, 'A population is the complete set of entities you want to draw conclusions about. A sample is a subset drawn from that population. Statistical inference allows conclusions about the population based on the sample — but only if the sample is representative and appropriately sized. Convenience samples, self-selected samples, and small samples can produce misleading inferences.', 5, 'da:statistics', '{}'::jsonb),

  (qz, 'Monthly sales data shows values: $10K, $12K, $9K, $11K, $250K. Which measure best describes typical monthly sales for this business?',
   '',
   '["Mean — it captures all values including the outlier","Median — it describes the middle value and is not distorted by the $250K outlier","Mode — it shows the most common sales figure","Range — it describes the full spread of sales"]'::jsonb,
   1, 'The $250K value (perhaps a one-time deal) is an extreme outlier that would dramatically inflate the mean. The median of the five values ($11K) accurately represents what a "typical" month looks like. The mode may not exist in continuous data. The range describes spread, not central tendency.', 6, 'da:statistics', '{}'::jsonb),

  (qz, 'A distribution is described as "right-skewed" (positively skewed). What does this mean?',
   '',
   '["The distribution is symmetric","The distribution has a long tail on the right side, with most values clustered on the left — the mean is pulled above the median","The distribution has a long tail on the left","The distribution has two peaks"]'::jsonb,
   1, 'Right-skewed (positive skew) means a long right tail — a few very high values pull the distribution rightward. Income distributions are classically right-skewed: most people earn modest amounts, but a few earn extremely high amounts. In right-skewed data, mean > median > mode because the mean is sensitive to extreme high values.', 7, 'da:statistics', '{}'::jsonb),

  (qz, 'What is a confidence interval?',
   '',
   '["The standard deviation expressed as a percentage","The minimum and maximum of a sample","The range of values in the dataset","A range of plausible values for a population parameter, calculated from sample data, with an associated probability (confidence level) that the interval contains the true value"]'::jsonb,
   3, 'A 95% confidence interval means: if we repeated this sampling process many times, 95% of the resulting intervals would contain the true population parameter. It does NOT mean there is a 95% probability the true value is in this specific interval. Wider intervals indicate more uncertainty (smaller samples or higher variability).', 8, 'da:statistics', '{}'::jsonb),

  (qz, 'Two variables show a strong correlation (r = 0.92). A manager concludes that one causes the other. What is wrong with this reasoning?',
   '',
   '["Nothing — high correlation always implies causation","Correlation measures the strength of the linear relationship between variables but cannot establish causation. There may be a confounding variable, the relationship may be coincidental, or the direction of causation may be the reverse of what the manager assumed.","r = 0.92 is too low to draw any conclusion","Correlation can only be negative"]'::jsonb,
   1, 'Correlation ≠ causation is the most important statistical principle for analysts to communicate to stakeholders. High correlation can occur due to confounders (a third variable driving both), spurious coincidence, or reverse causation. Establishing causation requires controlled experiments or rigorous quasi-experimental designs, not just observational correlation.', 9, 'da:statistics', '{}'::jsonb),

  (qz, 'What does a bimodal distribution indicate about a dataset?',
   '',
   '["The data contains exactly two outliers","The distribution has two distinct peaks, suggesting the data may contain two different subpopulations mixed together","The data is perfectly symmetric","The mean and median are identical"]'::jsonb,
   1, 'Bimodal distributions have two modes (peaks), often indicating two distinct groups have been combined — e.g., exam scores from two classes with different preparation levels, or heights from a mixed-gender dataset. Treating a bimodal distribution as a single normal population produces misleading summary statistics. Investigating the subpopulations is usually more informative.', 10, 'da:statistics', '{}'::jsonb),

  (qz, 'An analyst reports that the average customer support wait time is 4.2 minutes with a standard deviation of 0.3 minutes. A manager says "95% of wait times are between 3.6 and 4.8 minutes." Is this correct?',
   'Assume wait times are approximately normally distributed.',
   '["Yes — that is exactly what standard deviation means","Approximately correct: for a normal distribution, roughly 95% of values fall within 2 standard deviations of the mean (4.2 ± 0.6 = 3.6 to 4.8). The 68-95-99.7 rule confirms this.","No — standard deviation tells you nothing about percentiles","No — 95% of wait times would be between 3.9 and 4.5"]'::jsonb,
   1, 'The 68-95-99.7 empirical rule for normal distributions: ~68% of values fall within ±1 SD, ~95% within ±2 SD, ~99.7% within ±3 SD. 4.2 ± 2(0.3) = 3.6 to 4.8. The manager''s statement is approximately correct. This rule only applies to approximately normal distributions — it breaks down for skewed or heavy-tailed data.', 11, 'da:statistics', '{}'::jsonb),

  (qz, 'What is the interquartile range (IQR) and why is it useful?',
   '',
   '["The average of all values divided by the range","The range of the middle 50% of values (Q3 − Q1), which is resistant to outliers and describes the spread of the core distribution","The range between the minimum and maximum","The range of values within one standard deviation of the mean"]'::jsonb,
   1, 'IQR = Q3 (75th percentile) − Q1 (25th percentile). It describes the spread of the central 50% of data, ignoring the top and bottom 25% (where outliers live). It is the standard measure of spread for skewed distributions. IQR is also used in the 1.5×IQR rule to identify statistical outliers in box plots.', 12, 'da:statistics', '{}'::jsonb),

  (qz, 'A probability of 0.05 means:',
   '',
   '["The event will happen exactly once in 20 trials","The event is expected to occur 5% of the time over many repeated trials — not a certainty in any single trial","The event will never happen","The event is 5 times more likely than a 1% event"]'::jsonb,
   1, 'Probability is a long-run frequency concept. P = 0.05 means that over a very large number of identical trials, the event will occur about 5% of the time. It says nothing about any individual trial. A 5% probability event can happen on the very first try or not happen for hundreds of trials.', 13, 'da:statistics', '{}'::jsonb),

  (qz, 'When is a sample size of 30 frequently cited as a rough minimum? Why?',
   '',
   '["Because 30 is always sufficient for any statistical analysis","Because the Central Limit Theorem (CLT) states that for many distributions, sample means become approximately normally distributed at around n = 30, enabling the use of parametric statistical tests","Because surveys typically include 30 questions","Because database systems perform better with at least 30 records"]'::jsonb,
   1, 'The Central Limit Theorem guarantees that the sampling distribution of the mean approaches normality as n increases, regardless of the original distribution''s shape. n = 30 is a practical threshold (not a universal law) for many moderately non-normal distributions. For highly skewed distributions, larger samples may be needed.', 14, 'da:statistics', '{}'::jsonb),

  (qz, 'A product manager presents a chart showing that users who use Feature X have 40% higher retention than those who don''t. They conclude Feature X causes higher retention and want to make it mandatory. What statistical concern should an analyst raise?',
   '',
   '["The 40% difference is not large enough to be meaningful","There may be a self-selection bias: users who choose to use Feature X may already be more engaged users. The correlation between Feature X usage and retention may be driven by this underlying engagement level, not by Feature X itself. A controlled experiment is needed to establish causation.","The analysis should use standard deviation instead of percentages","This conclusion is correct if the sample size is large enough"]'::jsonb,
   1, 'Self-selection bias is the most common causal error in product analytics. Users who adopt features are systematically different from those who don''t — they tend to be more engaged. Observational analysis cannot separate "Feature X causes retention" from "engaged users use Feature X AND have high retention." Only a randomized controlled experiment (A/B test) can isolate the causal effect.', 15, 'da:statistics', '{}'::jsonb);

END $$;

-- ============================================================
-- MODULE 7 — Inferential Statistics and A/B Testing (da:statistics)
-- ============================================================
DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz
  FROM public.quizzes q
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid AND c.order_index = 7 AND q.quiz_type = 'chapter_end'
  LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 7'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 7 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'In hypothesis testing, what does the null hypothesis (H₀) represent?',
   '',
   '["The conclusion after statistical analysis","The hypothesis that the experiment will succeed","The assumption of no effect or no difference — the default position to be tested against the data","The expected outcome of the experiment"]'::jsonb,
   2, 'The null hypothesis is the status quo or "no-effect" position. Statistical tests calculate the probability of observing the data (or more extreme data) if H₀ were true. Rejecting H₀ means the data provides sufficient evidence against the no-effect assumption. Failing to reject H₀ means evidence is insufficient — not that H₀ is proven true.', 1, 'da:statistics', '{}'::jsonb),

  (qz, 'What does a p-value represent?',
   '',
   '["The probability that the null hypothesis is true","The probability of observing data at least as extreme as what was observed, given that the null hypothesis is true","The probability that the result is practically meaningful","The confidence level of the test"]'::jsonb,
   1, 'The p-value is P(data this extreme | H₀ is true). A small p-value means the observed data is unlikely under the null hypothesis — providing evidence against it. A p-value does NOT tell you P(H₀ is true), nor does it measure effect size or practical importance. This misinterpretation is extremely common and extremely costly.', 2, 'da:statistics', '{}'::jsonb),

  (qz, 'In an A/B test with significance level α = 0.05, a result has p = 0.03. What is the correct interpretation?',
   '',
   '["There is a 3% chance the null hypothesis is true","The result is statistically significant at the 5% level — we reject the null hypothesis. The probability of seeing this data (or more extreme) if there were no true difference is 3%.","The treatment group is 3% better than the control","There is a 97% chance the result is practically meaningful"]'::jsonb,
   1, 'p = 0.03 < α = 0.05 means we reject H₀ at the 5% significance level. The result is statistically significant. However, statistical significance does not equal practical significance — the effect could be real but tiny. Analysts must also report effect size and confidence intervals, not just p-values.', 3, 'da:statistics', '{}'::jsonb),

  (qz, 'What is a Type I error?',
   '',
   '["Using too small a sample size","Choosing the wrong statistical test","Rejecting the null hypothesis when it is actually true — a false positive","Failing to detect a real effect that exists"]'::jsonb,
   2, 'Type I error (false positive) is rejecting H₀ when H₀ is actually true. The significance level α defines the Type I error rate — at α = 0.05, there is a 5% chance of falsely detecting an effect that does not exist. Type II error (false negative) is failing to reject H₀ when a real effect exists. These two errors trade off against each other.', 4, 'da:statistics', '{}'::jsonb),

  (qz, 'What is statistical power in hypothesis testing?',
   '',
   '["The significance level α","The sample size divided by the effect size","The probability of correctly rejecting the null hypothesis when a true effect of a given size exists — the ability to detect real effects","The width of the confidence interval"]'::jsonb,
   2, 'Power = 1 − β (where β is the Type II error rate). Power represents the test''s ability to detect a real effect when one exists. Low power (< 0.80 is the conventional minimum) means many real effects will be missed. Power depends on sample size, effect size, and significance level — pre-study power analysis determines required sample size.', 5, 'da:statistics', '{}'::jsonb),

  (qz, 'An A/B test running for 3 days shows p = 0.04. The product manager wants to ship immediately. What concern should the analyst raise?',
   'The company''s user base has strong day-of-week effects — Monday traffic is 3× Sunday traffic.',
   '["None — p < 0.05 means the test is complete","The test may not have run for a full weekly cycle, so day-of-week effects could bias the result. Additionally, peeking at results early and stopping when p < 0.05 inflates the false-positive rate. The pre-registered sample size should be reached before concluding.","The p-value should be 0.01 to be reliable","A/B tests should never run for less than 30 days"]'::jsonb,
   1, 'Two problems: (1) novelty and day-of-week effects can produce early spurious signals that disappear over a full week cycle; (2) "peeking" — stopping a test as soon as p < α — dramatically inflates false positives because you are repeatedly testing and stopping on chance crossings. The pre-registered sample size must be reached before declaring results.', 6, 'da:statistics', '{}'::jsonb),

  (qz, 'You are comparing average purchase values between two customer segments. Which statistical test is most appropriate?',
   '',
   '["ANOVA","Z-test for proportions","Chi-square test","Two-sample t-test (or Welch''s t-test for unequal variances)"]'::jsonb,
   3, 'Comparing the means of a continuous variable (purchase value) between two independent groups uses a two-sample t-test. Welch''s version handles unequal group variances. Chi-square tests categorical variables. ANOVA compares means across three or more groups. Z-test for proportions compares rates or proportions, not means.', 7, 'da:statistics', '{}'::jsonb),

  (qz, 'What does ANOVA (Analysis of Variance) test?',
   '',
   '["Whether the variance of one group is larger than another","Whether there is a statistically significant difference in means across three or more groups simultaneously","Whether two proportions are equal","Whether a single mean equals a hypothesized value"]'::jsonb,
   1, 'ANOVA tests whether at least one group mean differs from the others across three or more groups — using a single test rather than multiple pairwise t-tests (which would inflate Type I error). A significant ANOVA result tells you at least one group differs but does NOT tell you which groups — post-hoc tests (Tukey, Bonferroni) are needed for pairwise comparisons.', 8, 'da:statistics', '{}'::jsonb),

  (qz, 'A chi-square test of independence is appropriate for which type of analysis?',
   '',
   '["Testing whether two categorical variables are statistically independent — e.g., whether subscription tier and country are related","Comparing the average revenue between two groups","Measuring correlation between two continuous variables","Testing whether a sample mean equals a hypothesized value"]'::jsonb,
   0, 'Chi-square independence tests examine whether two categorical variables are associated. For example: does the distribution of subscription tiers (Free/Pro/Enterprise) differ across countries? It works on count data arranged in a contingency table. It cannot compare means or measure linear correlation.', 9, 'da:statistics', '{}'::jsonb),

  (qz, 'What happens to required sample size as the minimum detectable effect (MDE) decreases?',
   '',
   '["Sample size decreases proportionally","Sample size remains the same","Sample size increases — detecting smaller effects requires larger samples to achieve adequate statistical power","Sample size should be set to 1000 regardless of MDE"]'::jsonb,
   2, 'Detecting a smaller true effect requires more data to distinguish signal from noise. The relationship is approximately inverse-square: halving the MDE roughly quadruples the required sample size. This is why businesses must carefully choose the minimum effect that is practically meaningful before calculating required sample size — chasing tiny effects is enormously expensive.', 10, 'da:statistics', '{}'::jsonb),

  (qz, 'Your A/B test shows a statistically significant result (p = 0.001), but the conversion rate improvement is 0.01 percentage points (from 2.00% to 2.01%). Should the company ship the treatment?',
   'The change required 3 months of engineering work to implement and maintain.',
   '["Yes — any statistically significant result should be shipped","Statistical significance and practical significance are different. With millions of users, even a 0.01 pp improvement may be detectable, but 3 months of engineering cost for a 0.01 pp lift is almost certainly not worth it. Business value (effect size × user volume × revenue impact) must be weighed against implementation cost.","No — the p-value should be below 0.0001 to justify shipping","The test is inconclusive because we need a confidence interval"]'::jsonb,
   1, 'This is the statistical significance vs. practical significance distinction. With enough data, any non-zero effect becomes statistically detectable — but "detectable" ≠ "worth acting on." The analyst''s job is to translate the effect size into business value (additional conversions × revenue per conversion) and compare it to the cost of implementation.', 11, 'da:statistics', '{}'::jsonb),

  (qz, 'What is the multiple comparisons problem in A/B testing?',
   '',
   '["Running A/B tests on multiple devices","Running many statistical tests simultaneously inflates the overall false-positive rate beyond α. If you run 20 tests at α = 0.05, you expect one false positive by chance alone, even if no treatments have real effects.","Using multiple analysts to review results","Comparing more than two groups with a t-test"]'::jsonb,
   1, 'Each test at α = 0.05 has a 5% chance of a false positive. Run 20 tests and the probability of at least one false positive is ~64%. This is why testing many metrics, segments, or variants simultaneously requires corrections (Bonferroni, Benjamini-Hochberg) or pre-registration of primary metrics. The multiple comparisons problem is behind many failed replication studies.', 12, 'da:statistics', '{}'::jsonb),

  (qz, 'An analyst runs an A/B test where users in the control group can interact with users in the treatment group (e.g., a social sharing feature). What bias does this introduce?',
   '',
   '["Survivorship bias","Network interference or SUTVA violation: treatment effects spill over to control users, contaminating the comparison and typically causing the true treatment effect to be underestimated","Sampling bias","Confirmation bias"]'::jsonb,
   1, 'SUTVA (Stable Unit Treatment Value Assumption) requires that each unit''s outcome depends only on its own treatment assignment, not others''. When users interact with each other across groups, control users are partially exposed to the treatment via network effects. This contaminates the control group and biases effect estimates downward. Solutions include cluster-level randomization.', 13, 'da:statistics', '{}'::jsonb),

  (qz, 'What is the difference between a one-tailed and two-tailed hypothesis test?',
   '',
   '["One-tailed tests are more accurate","A one-tailed test tests for an effect in a specific direction (e.g., treatment > control). A two-tailed test tests for any difference regardless of direction. Two-tailed is more conservative; one-tailed has more power but requires a directional pre-commitment.","Two-tailed tests always require larger samples","One-tailed tests should never be used in practice"]'::jsonb,
   1, 'One-tailed tests concentrate all α in one direction — they have more power to detect effects in the predicted direction but cannot detect effects in the opposite direction. Two-tailed tests split α between both tails. In practice, two-tailed tests are preferred for business experiments because unexpected negative effects (treatment worse than control) are also important to detect.', 14, 'da:statistics', '{}'::jsonb),

  (qz, 'You have run 50 A/B tests this year and found 15 statistically significant results at α = 0.05. Your manager congratulates you on the success rate. What statistical concern should you raise?',
   '',
   '["A 30% success rate is suspiciously high — it must be wrong","At α = 0.05, you expect approximately 5% of tests with no true effect to show false positives. If most of your 50 tests had no true effect, you would expect about 2-3 false positives. However, the more nuanced issue is: given your prior success rate, how many of the 15 ''significant'' results are likely true effects vs. false positives? Bayesian thinking and replication are needed.","There is no concern — more significant results are always better","The significance threshold should be raised to 0.10 for future tests"]'::jsonb,
   1, 'This question probes understanding of the false discovery rate. With 50 tests at α = 0.05, ~2-3 false positives are expected by chance alone. If many tests have no true effect, a substantial fraction of "significant" findings could be false positives. Responsible analysts track replication rates and apply false discovery rate controls (like Benjamini-Hochberg) for exploratory testing programs.', 15, 'da:statistics', '{}'::jsonb);

END $$;

-- ============================================================
-- MODULE 8 — Visualization Principles (da:visualization)
-- ============================================================
DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz
  FROM public.quizzes q
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid AND c.order_index = 8 AND q.quiz_type = 'chapter_end'
  LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 8'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 8 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'Which chart type is most appropriate for showing the relationship between two continuous variables?',
   '',
   '["Bar chart","Pie chart","Scatter plot","Stacked area chart"]'::jsonb,
   2, 'Scatter plots encode two continuous variables on X and Y axes, making them the canonical chart for revealing correlation, clustering, and outliers between two numeric variables. Bar charts compare discrete categories. Pie charts show parts of a whole. Stacked area charts show composition over time. None of these alternatives visualize bivariate relationships effectively.', 1, 'da:visualization', '{}'::jsonb),

  (qz, 'What does "data-to-ink ratio" mean and why does it matter?',
   '',
   '["The number of colors used in a chart","The ratio of positive to negative values in a dataset","The proportion of a visualization''s ink used to represent actual data vs. decorative or non-informational elements — maximizing this ratio removes chart junk and focuses the viewer''s attention on data","The ratio of data tables to charts in a report"]'::jsonb,
   2, 'Edward Tufte''s data-to-ink ratio principle: every drop of ink (or pixel) should serve a purpose — conveying information. Gridlines, 3D effects, decorative borders, unnecessary colors, and legends that duplicate labels all reduce this ratio. Maximizing it produces cleaner, more honest, and faster-to-read visualizations.', 2, 'da:visualization', '{}'::jsonb),

  (qz, 'Preattentive attributes in data visualization are:',
   '',
   '["Attributes that require careful reading to notice","Visual properties (color, position, length, size, orientation) that the human visual system processes instantly and automatically, before conscious attention — used to direct viewer focus","Chart titles and axis labels","Interactive filters in a dashboard"]'::jsonb,
   1, 'Preattentive processing happens in under 250ms, before conscious attention. Color, position, size, and length are the strongest preattentive attributes. Skilled visualizers use these purposefully — e.g., making an outlier red in a chart of gray bars immediately draws the eye to it without any need to read text.', 3, 'da:visualization', '{}'::jsonb),

  (qz, 'When should a pie chart be used?',
   '',
   '["When comparing values over time","To show the relationship between two variables","Whenever you want to compare values across many categories","Only when showing parts of a whole for a very small number of categories (ideally 2-5) where relative proportions are the key insight"]'::jsonb,
   3, 'Pie charts are appropriate for a small number of categories where the whole-to-part relationship is the key message. Human perception struggles to accurately compare slice angles, especially with more than 5 slices. For 6+ categories or when precise comparison matters, a bar chart is almost always better than a pie chart.', 4, 'da:visualization', '{}'::jsonb),

  (qz, 'Which chart type is best for showing trends over time for multiple product lines?',
   '',
   '["Grouped bar chart","Line chart with one line per product","Pie chart","Scatter plot"]'::jsonb,
   1, 'Line charts encode time on the X-axis and value on Y, making trends immediately visible through the slope of each line. Multiple product lines become multiple overlapping lines. The human eye tracks line direction efficiently. Grouped bars compare discrete time periods but obscure trend trajectories. Pie and scatter charts are not designed for time-series data.', 5, 'da:visualization', '{}'::jsonb),

  (qz, 'A dashboard showing weekly sales performance will be presented to a C-suite executive in a 5-minute meeting. Which design principle is most important?',
   '',
   '["Maximum data density — show every possible metric","Clear visual hierarchy: the most critical KPI visible immediately, supporting context available on demand, and no chart requiring more than 10 seconds to interpret","Maximum chart variety to demonstrate analytical range","Color-coding every chart differently to distinguish them"]'::jsonb,
   1, 'Executives process dashboards in seconds, not minutes. Visual hierarchy ensures the answer to "how are we doing?" is instantly visible — the primary KPI at the top, prominent, with clear reference to target. Supporting detail recedes visually. Decision-makers do not need every metric; they need the right metrics, in the right visual priority.', 6, 'da:visualization', '{}'::jsonb),

  (qz, 'What is wrong with a bar chart where the Y-axis starts at a value other than zero?',
   '',
   '["Nothing — Y-axis starting point is always arbitrary","Starting a bar chart''s Y-axis above zero exaggerates the visual magnitude of differences. Bars encode value through their full length from the baseline; truncating the baseline makes small differences look enormous.","The bars should always start at 100","Only line charts require Y-axes starting at zero"]'::jsonb,
   1, 'Bar charts use length as the primary encoding — the viewer''s eye compares bar heights relative to the baseline. Truncating the Y-axis at a non-zero value compresses the visible range and makes small relative differences look large in percentage terms. Line charts encode value through position, so their Y-axis need not start at zero.', 7, 'da:visualization', '{}'::jsonb),

  (qz, 'A heatmap is most useful for visualizing:',
   '',
   '["The distribution of a single continuous variable","Patterns across two categorical dimensions using color intensity to show magnitude — e.g., sales by product category and day of week","The market share of three companies","The trend in a single metric over time"]'::jsonb,
   1, 'Heatmaps encode a third variable (magnitude, frequency, rate) using color across a two-dimensional grid of categories. Classic uses include showing at what time of day × day of week traffic peaks, or correlation matrices. They are poorly suited for precise value reading — use them to spot patterns and hotspots, not to communicate exact numbers.', 8, 'da:visualization', '{}'::jsonb),

  (qz, 'What is a waterfall chart best used for?',
   '',
   '["Showing values changing continuously over time","Showing how an initial value increases and decreases through a series of intermediate steps to arrive at a final value — such as revenue bridge or budget variance analysis","Comparing values across many geographic regions","Showing the distribution of a dataset"]'::jsonb,
   1, 'Waterfall charts decompose a change from a starting value to an ending value, showing each contributing factor as an up or down bar. They are the standard chart for financial bridges (how did we get from last year''s revenue to this year''s?), budget variance analysis, and profit-and-loss decomposition. They tell the story of change components, not just the net result.', 9, 'da:visualization', '{}'::jsonb),

  (qz, 'An analyst uses red and green to distinguish two categories in a chart. What accessibility issue does this create?',
   '',
   '["No issue — red and green are universally recognized","Red-green color blindness affects approximately 8% of men and 0.5% of women — this color pair is the most common form of color blindness. The chart will be unreadable for a significant portion of the audience. Blue and orange, or patterns combined with color, are better accessible alternatives.","The chart will be too bright","Red should always be reserved for negative values"]'::jsonb,
   1, 'Red-green color blindness (deuteranopia/protanopia) is the most prevalent form of color vision deficiency. Using red and green as the only distinguishing encoding makes the chart inaccessible. Best practices: use blue and orange, or blue and red, or supplement color with texture/pattern/direct labels. Accessible visualization is professional visualization.', 10, 'da:visualization', '{}'::jsonb),

  (qz, 'A chart shows monthly revenue with 36 months of data. When presented to the CEO, the line chart is difficult to read because of too much volatility. What technique best shows the trend while preserving the underlying data?',
   '',
   '["Remove the noisy months from the chart","Add a 3-month or 12-month rolling average line overlaid on the raw monthly values — the rolling average reveals the trend while the underlying data remains visible for context","Switch to a bar chart","Change the Y-axis to a logarithmic scale"]'::jsonb,
   1, 'Rolling averages smooth short-term volatility to reveal the underlying trend. Overlaying the rolling average on the raw data is the best-of-both-worlds solution: the trend is readable for executive communication while the underlying variability is preserved for transparency. Removing months destroys data. Log scale helps with proportional changes, not noise reduction.', 11, 'da:visualization', '{}'::jsonb),

  (qz, 'When should you use a logarithmic scale on a chart axis?',
   '',
   '["Whenever the numbers are very large","When data spans multiple orders of magnitude (e.g., comparing companies with $10K, $1M, and $1B revenue) or when the rate of change (percentage growth) is more meaningful than absolute change","Only in scientific publications","When the audience is not familiar with logarithms"]'::jsonb,
   1, 'Logarithmic scales are appropriate when data spans several orders of magnitude (a linear scale would render small values invisible) or when multiplicative growth is the story (log scale makes equal percentage changes appear as equal vertical distances). They require a more numerate audience and should always be clearly labeled. For general audiences, consider transforming the data and using a linear scale.', 12, 'da:visualization', '{}'::jsonb),

  (qz, 'What is "chart junk" as defined by Edward Tufte?',
   '',
   '["Charts that contain incorrect data","Visual elements that do not convey information — 3D effects, decorative patterns, excessive gridlines, clip art, unnecessary legends — that clutter a chart and reduce the data-to-ink ratio","Charts that use too many colors","Charts with more than 10 data series"]'::jsonb,
   1, 'Tufte coined "chart junk" for non-data ink that increases cognitive load without adding information. 3D effects distort visual encoding, decorative patterns create visual noise, redundant gridlines clutter. Removing chart junk is not about minimalism for its own sake — it is about directing the viewer''s attention to the data signal, not the design noise.', 13, 'da:visualization', '{}'::jsonb),

  (qz, 'An executive dashboard has 15 KPI tiles, 6 charts, 3 maps, and 2 tables on a single screen. What is the primary design problem?',
   '',
   '["Cognitive overload: too many elements compete for attention, making it impossible to identify priorities quickly. Dashboard design for executives should establish visual hierarchy — the most critical 3-5 KPIs must dominate, with supporting context available through drill-down or hover.","The maps are unnecessary","The KPI tiles should be bar charts instead","There are not enough charts"]'::jsonb,
   0, 'Dashboard overload is a pervasive problem. When everything is prominent, nothing is prominent. Executive dashboards should answer "what needs my attention right now?" in under 10 seconds. The signal-to-noise ratio must be high. Supporting detail belongs in drill-down layers, not on the primary view.', 14, 'da:visualization', '{}'::jsonb),

  (qz, 'Two charts show the same monthly revenue data. Chart A uses a bar chart with the Y-axis starting at zero. Chart B uses a line chart with the Y-axis starting at $980K (the minimum value), making a $15K month-over-month increase look like a doubling. A manager prefers Chart B because "it clearly shows the growth." What should the analyst say?',
   '',
   '["Use Chart B — executives prefer dramatic visualizations","Chart B is misleading: truncating the Y-axis on a bar-equivalent representation exaggerates the visual magnitude of a $15K change that is actually less than 1.5% growth. The analyst should use Chart A for honest representation, and separately annotate the growth rate if the trend direction needs emphasis.","Chart A and Chart B are equivalent — the data is the same","Use Chart B but add more colors"]'::jsonb,
   1, 'Analysts have an obligation to visualize data honestly. Chart B manipulates perception by making a small absolute change look dramatic through Y-axis truncation. While a line chart CAN legitimately truncate the Y-axis (because it encodes position, not length), using it to make marginal changes appear dramatic is still misleading and unprofessional. The $15K increase should be communicated with its correct percentage context.', 15, 'da:visualization', '{}'::jsonb);

END $$;

-- ============================================================
-- MODULE 9 — Power BI and Tableau (da:visualization)
-- ============================================================
DO $$
DECLARE
  cid UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz
  FROM public.quizzes q
  JOIN public.chapters c ON c.id = q.chapter_id
  WHERE c.course_id = cid AND c.order_index = 9 AND q.quiz_type = 'chapter_end'
  LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 9'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 9 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is Power Query used for in Power BI?',
   '',
   '["Publishing reports to the Power BI service","Writing DAX measures for KPI calculations","Designing the visual layout of dashboards","Extracting, transforming, and loading data before it reaches the data model — handling cleaning, reshaping, and combining data sources"]'::jsonb,
   3, 'Power Query (M language) is Power BI''s ETL layer. It connects to data sources, applies transformations (filtering rows, renaming columns, merging tables, unpivoting), and delivers clean data to the data model. DAX then defines calculations on top of that model. Power Query runs before DAX — it shapes the data; DAX analyzes it.', 1, 'da:visualization', '{}'::jsonb),

  (qz, 'In Power BI, what is a DAX measure?',
   '',
   '["A column added to a table during Power Query","A pre-built visualization template","A formula written in DAX (Data Analysis Expressions) that calculates a value dynamically based on the filter context applied to a report — e.g., Total Sales = SUM(Sales[Amount])","A connection to an external API"]'::jsonb,
   2, 'DAX measures are calculated at query time in response to the current filter context — the slicers, row/column context, and page filters active when the visual renders. This makes measures dynamic and reusable across any visual or filter combination. Calculated columns are computed row by row at data refresh; measures respond to context at runtime.', 2, 'da:visualization', '{}'::jsonb),

  (qz, 'What is a "calculated field" in Tableau?',
   '',
   '["A field imported from a SQL database","A visualization type available in Tableau","A new field created using a formula in Tableau — can perform calculations on existing fields, create logic-based categories, or define custom metrics like profit margin","A geographic data field"]'::jsonb,
   2, 'Calculated fields in Tableau use Tableau''s formula language to define new data fields from existing ones. Examples: [Profit] / [Revenue] for margin, IF [Region] = ''West'' THEN ''Target'' ELSE ''Non-Target'' END for segmentation. They can be used as dimensions or measures, exactly like any other field in the data source.', 3, 'da:visualization', '{}'::jsonb),

  (qz, 'In Tableau, what is an LOD (Level of Detail) expression used for?',
   '',
   '["Adjusting the zoom level of a dashboard","Creating drill-down hierarchies","Changing the resolution of maps","Computing aggregations at a different level of granularity than the current view — for example, calculating average revenue per customer across the entire dataset even when the view is filtered to a single region"]'::jsonb,
   3, 'LOD expressions (FIXED, INCLUDE, EXCLUDE) override the view''s default aggregation level. {FIXED [Customer ID] : AVG([Revenue])} computes average revenue per customer regardless of other dimensions in the view. This is essential for cohort-level metrics, percent-of-total calculations, and customer-level metrics inside product-level views.', 4, 'da:visualization', '{}'::jsonb),

  (qz, 'What does "self-serve analytics" mean in a BI context?',
   '',
   '["Business users can explore, filter, and analyze data using a BI tool without requiring IT or data team involvement for every report request","Analytics performed without any data tools","Only IT staff can access dashboards","Analytics that requires no training to use"]'::jsonb,
   0, 'Self-serve analytics empowers business users — not just analysts or engineers — to answer their own data questions using governed, pre-built data models and intuitive BI tools. It reduces analyst bottlenecks for routine questions while freeing the data team for more complex analytical work. Effective self-serve requires good data governance, semantic models, and user training.', 5, 'da:visualization', '{}'::jsonb),

  (qz, 'A Power BI report has a Sales by Region visual. When a user clicks on "West," what feature automatically filters all other visuals on the page to show only West data?',
   '',
   '["DAX filter","Cross-filtering (cross-highlighting) — a built-in Power BI behavior where selecting a data point in one visual automatically filters or highlights related data in connected visuals on the same page","A manual slicer","A report-level filter"]'::jsonb,
   1, 'Cross-filtering is a core Power BI interaction model. Clicking a data point in any visual acts as a temporary filter propagating to all visuals governed by the same model relationships on the page. This enables exploratory analysis without pre-building every possible segmentation. Slicers are persistent filters; cross-filtering is an on-click interaction.', 6, 'da:visualization', '{}'::jsonb),

  (qz, 'In Tableau, what is the difference between a dimension and a measure?',
   '',
   '["Dimensions are numeric; measures are categorical","Dimensions are qualitative categorical fields used to slice and group data (e.g., Region, Product Category); measures are quantitative numeric fields that are aggregated (e.g., Revenue, Quantity)","Dimensions are only available in maps","Measures cannot be used in filters"]'::jsonb,
   1, 'Tableau''s fundamental data model: dimensions define how to slice/group (they appear in the Rows/Columns shelf), while measures define what to aggregate (they appear in Marks or Values). A product category is a dimension; the total sales for that category is a measure. Understanding this distinction is essential for building correct visualizations in Tableau.', 7, 'da:visualization', '{}'::jsonb),

  (qz, 'A Power BI dashboard is slow to load. The data model has 50 calculated columns and the dataset is 20 million rows. What is the most likely performance fix?',
   '',
   '["Add more calculated columns to pre-compute values","Increase the number of visuals on the dashboard","Replace calculated columns with DAX measures where possible — measures are computed on demand for the filtered context, while calculated columns consume memory row by row across the full dataset","Publish to a workspace with fewer users"]'::jsonb,
   2, 'Calculated columns are stored in the model memory for every row at refresh time. With 20 million rows and 50 calculated columns, the memory footprint can be enormous. DAX measures compute only for the current visual''s filtered context at render time. Converting calculated columns to measures dramatically reduces model size and often improves report performance.', 8, 'da:visualization', '{}'::jsonb),

  (qz, 'In Tableau, what does a "parameter" allow a report user to do?',
   '',
   '["Change the underlying database connection","Control a dynamic variable — such as a date range, a sales threshold, or a metric toggle — that feeds into calculated fields, filters, or reference lines, enabling user-controlled what-if exploration","View the raw SQL behind a visualization","Export data to Excel"]'::jsonb,
   1, 'Tableau parameters are user-controlled variables. They can drive calculated fields (IF [Selected Metric] = ''Revenue'' THEN [Revenue] ELSE [Units] END), dynamic filters (show only products above parameter threshold), or reference lines. Parameters enable flexible, self-serve dashboards without requiring separate views for each variant.', 9, 'da:visualization', '{}'::jsonb),

  (qz, 'A business wants its regional managers to see only their own region''s data in a Power BI report. All managers use the same report. Which feature enables this?',
   '',
   '["Creating a separate report for each region","Row-Level Security (RLS) — a Power BI feature that restricts data access based on the user''s identity, so each manager sees only the rows matching their region, even though the underlying report is identical","Report-level filters set by the report author","Publishing the report to separate workspaces per region"]'::jsonb,
   1, 'Row-Level Security (RLS) enforces data access at the model level using DAX filter expressions tied to the logged-in user''s identity. A single report can serve all regional managers, with each seeing only their authorized data. This is more maintainable than separate reports and ensures governance — the filter is server-enforced, not client-side.', 10, 'da:visualization', '{}'::jsonb),

  (qz, 'What is the purpose of a Tableau extract (TDE or Hyper file) vs. a live connection?',
   '',
   '["Extracts are less secure than live connections","An extract copies data into Tableau''s optimized columnar format for fast local querying — best for large datasets or slow source systems. A live connection queries the source database in real time — best when data freshness is critical. The trade-off is query speed vs. data recency.","Live connections always perform faster","Extracts are required for all published dashboards"]'::jsonb,
   1, 'Extracts optimize query performance by compressing data into Tableau''s Hyper engine format, enabling very fast aggregations. Live connections always show current data but depend on source system performance. For executive dashboards over large historical datasets, extracts are often better. For operational dashboards requiring minute-by-minute freshness, live connections are necessary.', 11, 'da:visualization', '{}'::jsonb),

  (qz, 'A Power BI data model has Customer, Product, and Sales tables. The Sales table has foreign keys to both Customer and Product. In the Power BI model, how should relationships be configured?',
   '',
   '["One-to-one relationships between all three tables","Many-to-many relationships between Customer and Product","One-to-many relationships from Customer to Sales and from Product to Sales, with Sales as the fact table — filters flow from dimension tables into the fact table","Three separate models, one per table"]'::jsonb,
   2, 'This is the classic star schema in a Power BI model. Customer and Product are dimension tables (one side); Sales is the fact table (many side). Relationships filter from dimensions into facts: selecting a product filters the Sales table to that product''s transactions. Power BI enforces this cardinality and filter direction to enable correct aggregations.', 12, 'da:visualization', '{}'::jsonb),

  (qz, 'What does the DAX function CALCULATE() do?',
   '',
   '["It performs a SQL join between two tables","It evaluates an expression in a modified filter context — allowing you to override or extend the default context with additional filters","It creates a new table in the data model","It formats a number as currency"]'::jsonb,
   1, 'CALCULATE is the most important DAX function. It evaluates any DAX expression with a modified filter context. CALCULATE([Total Sales], Region = ''West'') computes Total Sales but with the Region filter locked to "West" — regardless of what the report visual''s current filter context is. It is essential for time intelligence, fixed comparisons, and percent-of-total calculations.', 13, 'da:visualization', '{}'::jsonb),

  (qz, 'When publishing a Tableau dashboard to Tableau Server or Tableau Online, what best practice ensures business users can find and understand the report?',
   '',
   '["Publish without a description to keep it simple","Provide a clear descriptive name, a project folder aligned to the business domain, a description of the dashboard''s purpose and intended audience, and mark data sources as certified if they are governed — enabling users to trust and find the content","Publish all dashboards to a single folder","Restrict all access to the IT team"]'::jsonb,
   1, 'Publishing governance is as important as the report itself. A dashboard without a clear description, proper project classification, or audience tagging gets lost or misused. Certified data sources signal to users that the data is governed and trusted. This is the difference between a report and a scalable self-serve analytics asset.', 14, 'da:visualization', '{}'::jsonb),

  (qz, 'A Power BI report''s CALCULATE measure returns incorrect totals when viewed at a higher aggregation level (e.g., the regional total does not equal the sum of city totals). What is the most likely cause?',
   '',
   '["The data source has incorrect values","Context transition or a FIXED filter in CALCULATE that does not respect the visual''s aggregation level — for example, a measure using CALCULATE with a hardcoded filter that is not additive across dimension values","Power BI has a calculation bug","The relationship between tables is broken"]'::jsonb,
   1, 'This is the "non-additive measure" problem in DAX. CALCULATE with certain filter expressions can break the additivity that makes totals correct. For example, a "% of total" measure computed row by row does not sum to 100% at the parent level — it is inherently non-additive. Analysts must understand DAX filter context to design measures that behave correctly at all aggregation levels.', 15, 'da:visualization', '{}'::jsonb);

END $$;

-- =============================================================================
-- Verification: count questions per module for DA modules 1-9
-- =============================================================================
SELECT c.order_index AS module, c.title AS module_title,
       count(qq.id) AS total_questions
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.quizzes qz ON qz.chapter_id = c.id AND qz.quiz_type = 'chapter_end'
LEFT JOIN public.quiz_questions qq ON qq.quiz_id = qz.id
WHERE co.title = 'AI Data Analyst & Decision Intelligence Professional'
  AND c.order_index BETWEEN 1 AND 9
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
