import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const courseData = {
  title: "AI Data Engineer",
  description: "Master the data infrastructure that powers AI — data lakehouses, dbt transformations, Apache Kafka streaming, feature engineering, and feature stores. Build production pipelines used at Uber, Netflix, Airbnb, and every serious AI-first company.",
  chapters: [
    {
      title: "Module 1: Modern Data Architecture for AI",
      description: "The foundational mental models, architecture patterns, and technology choices that define world-class AI data infrastructure — grounded in the Delta Lake paper, Reis & Housley's Fundamentals of Data Engineering, and engineering blogs from Uber, Netflix, and Airbnb.",
      order_index: 0,
      videos: [
        {
          title: "1.1 The Data Engineering Lifecycle and the AI Data Stack",
          description: "How data flows from source to AI model — the complete lifecycle, the modern data stack, and why Joe Reis calls data engineering 'the plumbing that makes AI possible.'",
          order_index: 0,
          lessonScript: {
            mainPoints: [
              "Joe Reis and Matt Housley's 'Fundamentals of Data Engineering' (O'Reilly, 2022) opens with a deceptively simple definition: 'Data engineering is the development, implementation, and maintenance of systems and processes that take in raw data and produce high-quality, consistent information that supports downstream use cases such as analysis and machine learning.' The word 'deceptively' is important — every word in that definition carries weight. 'High-quality' means tested, validated, and monitored. 'Consistent' means reproducible across environments and time. 'Downstream use cases' means the pipeline exists to serve ML models, analysts, and business stakeholders — not as an end in itself. When 87% of ML models never reach production (Venturebeat, 2019), the root cause is almost always data engineering failure: missing features, inconsistent transforms, training-serving skew, or data pipelines that break silently under production load.",

              "The data engineering lifecycle has five stages that Reis and Housley define as the undercurrent of all data work. Generation: data originates from source systems — application databases (Postgres, MySQL), event streams (Kafka topics), external APIs (Stripe, Salesforce), IoT sensors, and third-party data providers. Ingestion: moving data from source systems into your data platform — batch (nightly ETL from production databases), streaming (real-time Kafka consumers), or micro-batch (every 5 minutes via Airbyte or Fivetran). Transformation: cleaning, validating, joining, and enriching raw data into useful representations — the stage where dbt creates ML-ready feature tables. Serving: making transformed data available to downstream consumers — ML training pipelines, model inference via feature stores, analyst dashboards, and business applications. Storage permeates all stages: raw landing zone (S3/GCS), curated data lake (Delta Lake/Iceberg), and operational stores (feature store online layer, data warehouse). Understanding this lifecycle is the mental model that prevents the most common data engineering mistake: building pipelines that serve the ingestion stage perfectly but fail the serving stage completely.",

              "The modern data stack emerged between 2016 and 2022 as a opinionated answer to the complexity of enterprise data infrastructure — replacing custom Hadoop clusters and fragile Python ETL scripts with cloud-native, composable tools. The canonical modern data stack for AI: Fivetran or Airbyte (ingestion from 200+ sources with no-code connectors), Snowflake/BigQuery/Databricks (cloud data warehouse or lakehouse as the transformation layer), dbt (SQL-based transformation with testing, documentation, and lineage), Airflow or Prefect (orchestration), and Feast/Tecton (feature store for ML). The economic logic: cloud warehouses (Snowflake at $2/credit) are dramatically cheaper than on-premises infrastructure, managed ingestion tools (Fivetran at $500/month for SMBs) eliminate months of custom connector development, and dbt's version-controlled SQL replaces fragile Python scripts. Airbnb, GitLab, and Intercom migrated to modern data stacks between 2019-2021 and reported 60-80% reductions in pipeline maintenance overhead.",

              "The data mesh architecture, introduced by Zhamak Dehghani in her 2019 ThoughtWorks article and expanded in her 2022 O'Reilly book, challenges the centralized data platform model at scale. In a centralized architecture, a single data engineering team owns all pipelines — a bottleneck that breaks at 50+ data producers. Data mesh distributes ownership: each business domain (payments, recommendations, user growth) owns its own data as a product, with defined quality SLAs, documentation, and access contracts. The infrastructure team provides a self-service data platform (storage, compute, cataloging) that domain teams use without needing data engineering expertise. Netflix's data mesh implementation (documented in their 2022 engineering blog) decentralized ownership of 300+ datasets across 20+ domain teams, reducing time-to-data from weeks to hours for new use cases. For AI data engineers: understanding data mesh helps you design interfaces between your ML infrastructure and the domain teams who produce the data you depend on.",

              "The distinction between OLTP (Online Transaction Processing) and OLAP (Online Analytical Processing) databases is foundational knowledge for AI data engineers — because ML training data almost always starts in OLTP systems and needs to be transformed for OLAP workloads. OLTP systems (Postgres, MySQL, MongoDB) are optimized for high-volume, low-latency point queries: find the order with ID 12345, update user 67890's address. They use row-oriented storage — the entire row is written and read together — because transactions typically touch one or a few complete records. OLAP systems (Snowflake, BigQuery, Redshift) are optimized for aggregations across billions of records: count all purchases by product category in the last 30 days. They use columnar storage — only the columns needed for the query are scanned — which can be 10-100x faster for analytical queries. ML training is always OLAP-style: compute the 30-day rolling average purchase value for all 50M users, reading only the relevant columns across billions of rows.",

              "Data contracts — a concept popularized by Andrew Jones and Chad Sanderson in 2022 — are the engineering practice that prevents the most common and most painful data pipeline failures: upstream schema changes silently breaking downstream ML models. A data contract is a formal, versioned agreement between a data producer (the application engineering team that owns a database) and a data consumer (the data engineering team building ML pipelines). It specifies: the schema (field names, types, required/nullable), the data quality guarantees (null rate < 1%, values in set X), the delivery SLA (data available by 8am UTC), and the change notification process (30-day advance notice for breaking changes). Paypal's data contract implementation (2023 engineering blog) reduced data quality incidents by 68% by shifting detection from production model failures to contract violation alerts — catching problems at the producer before they cascade to consumers.",

              "The 'build vs. buy' decision framework for data infrastructure is one of the highest-stakes decisions an AI data engineering team makes — and it's made wrong in both directions constantly. Build when: the capability is core to your competitive differentiation, no commercial solution meets your specific requirements, or the cost of a commercial solution exceeds the build cost over 3 years. Buy when: the problem is not differentiated (every company needs the same ingestion connectors), the commercial solution saves more than 6 months of engineering time, or operational complexity of self-hosting exceeds the engineering team's capacity. Uber famously built almost everything — their internal data platform (Hive on HDFS, custom Spark jobs, their own feature store Michelangelo) because at their scale (100 petabytes of data, 10,000 daily active Airflow DAGs) no commercial solution could match their performance requirements. For most companies, buying Fivetran and Snowflake and building only the differentiated transformation logic is the right answer — Uber-level custom infrastructure requires Uber-level engineering headcount."
            ]
          },
          questions: [
            {
              question_text: "What are the five stages of the data engineering lifecycle?",
              scenario_context: "Explaining your data platform architecture to a new ML engineer joining the team.",
              options: ["Extract, Transform, Load, Store, Serve", "Generation, Ingestion, Transformation, Serving, and Storage (which permeates all stages) — the framework from Reis & Housley that maps the complete journey from raw source data to ML-ready features", "Collection, Processing, Analysis, Visualization, Action", "Batch, Stream, Query, Cache, Deliver"],
              correct_answer_index: 1,
              explanation: "Reis & Housley's lifecycle framework is the canonical mental model: Generation (source systems produce data), Ingestion (move to platform), Transformation (clean/enrich), Serving (deliver to ML/analytics), with Storage permeating every stage. This framework prevents building pipelines that excel at ingestion but fail at serving."
            },
            {
              question_text: "Why is columnar storage 10-100x faster than row-oriented storage for ML training data preparation?",
              scenario_context: "Explaining why you chose Snowflake over PostgreSQL for ML feature computation.",
              options: ["Columnar storage uses better compression algorithms", "ML training queries aggregate specific columns across billions of rows — columnar storage reads only queried columns, skipping all others. Row storage reads entire rows even when only 3 of 100 columns are needed.", "Columnar storage has faster CPUs", "Row storage doesn't support SQL"],
              correct_answer_index: 1,
              explanation: "Computing 30-day rolling averages for 50M users needs purchase_amount and timestamp columns only. Columnar storage reads just those 2 columns from billions of rows. Row storage reads all 100 columns per row — 50x more I/O for no benefit. This is why OLAP columnar databases are mandatory for ML feature computation at scale."
            },
            {
              question_text: "What did Paypal's data contract implementation achieve and why?",
              scenario_context: "Justifying the engineering investment in data contracts to your CTO.",
              options: ["Faster data pipeline execution", "68% reduction in data quality incidents by detecting upstream schema changes at the producer (contract violation alert) before they cascade downstream to ML model failures — shifting detection left from production to development", "Lower cloud storage costs", "Faster ML model training"],
              correct_answer_index: 1,
              explanation: "Data contracts shift failure detection from 'production model breaks silently' to 'upstream schema change violates contract, alert fires immediately.' The 68% incident reduction came from catching problems at the source rather than discovering them when ML predictions degraded hours later."
            },
            {
              question_text: "What was the core innovation of Netflix's data mesh implementation?",
              scenario_context: "Your centralized data team is a bottleneck serving 50+ data-producing teams.",
              options: ["Building a single massive data warehouse", "Decentralizing data ownership to domain teams — each domain (payments, recommendations, user growth) owns its data as a product with quality SLAs, reducing time-to-data from weeks to hours by eliminating the central team bottleneck", "Migrating from Hadoop to Spark", "Buying Snowflake to replace all custom infrastructure"],
              correct_answer_index: 1,
              explanation: "Netflix's data mesh moved ownership of 300+ datasets from a central team to 20+ domain teams. Domain teams know their data best and can iterate fastest. The central team provides infrastructure (storage, compute, cataloging) — not pipelines. Time-to-data dropped from weeks to hours."
            },
            {
              question_text: "When should an AI data engineering team build custom infrastructure instead of buying commercial solutions?",
              scenario_context: "Deciding whether to build a custom feature store or buy Tecton.",
              options: ["Always build for cost savings", "Build when the capability is core to competitive differentiation AND no commercial solution meets specific requirements AND build cost is less than 3-year commercial cost. Buy for undifferentiated problems — Uber builds custom infra because their scale (100 petabytes) exceeds any commercial solution's capabilities.", "Always buy to save engineering time", "Build only when the team has 10+ engineers"],
              correct_answer_index: 1,
              explanation: "Uber built everything because their scale made commercial solutions inadequate. Most companies should buy Fivetran, Snowflake, and Feast — and build only the differentiated transformation logic that creates competitive advantage. Building undifferentiated infrastructure is expensive and distracts from core product work."
            }
          ]
        },
        {
          title: "1.2 Data Lakehouse Architecture: Delta Lake, Iceberg, and ACID for AI",
          description: "The Delta Lake paper (Armbrust et al. 2020), ACID transactions in object storage, time travel for ML reproducibility, and why every serious AI company has moved from pure data lakes to lakehouses.",
          order_index: 1,
          lessonScript: {
            mainPoints: [
              "The data lake, introduced at Yahoo! in 2010 by James Dixon and popularized at scale by HDFS/Hadoop, promised to solve the cost and flexibility limitations of data warehouses: store everything in its raw form, schema-on-read, at pennies per GB. In practice, production data lakes became what Martin Fowler memorably called 'data swamps' — repositories of inconsistent, undocumented, unreliable data that nobody trusted. The root causes: no ACID transactions (concurrent writers corrupted datasets), no schema enforcement (bad data entered silently), no metadata layer (impossible to discover what data existed or what it meant), and poor query performance on unoptimized raw files. The Databricks team's solution, documented in the 2020 VLDB paper 'Delta Lake: High-Performance ACID Table Storage over Cloud Object Stores' by Michael Armbrust, Tathagata Das, and colleagues, was to add a transaction log on top of standard Parquet files in S3 — creating what they called a 'data lakehouse.'",

              "ACID transactions in the Delta Lake architecture are implemented through a transaction log (_delta_log directory) that records every operation as a JSON or Parquet commit file. Atomicity: a write operation either commits all its Parquet files to the log or none of them — there are no partial writes that leave the table in an inconsistent state. Consistency: schema enforcement at write time prevents malformed records from entering the table — a training dataset that defines user_id as a non-null integer will reject any record missing user_id. Isolation: Delta Lake uses optimistic concurrency control (OCC) — multiple writers can proceed simultaneously, but the second writer to commit must verify it doesn't conflict with the first. Durability: committed operations are persisted to object storage before the transaction completes. The practical impact: a training pipeline reading a feature table sees a consistent snapshot regardless of whether a data pipeline is simultaneously writing new records — eliminating the partial-read corruption that plagued early data lakes.",

              "Time travel is the Delta Lake capability that transforms ML reproducibility from a best-effort practice to a guaranteed property. Every write to a Delta table creates a new version — the transaction log maintains a complete history of all changes with timestamps. The SQL interface: SELECT * FROM feature_table TIMESTAMP AS OF '2024-01-15 00:00:00' returns the exact state of the table as of January 15th. The Python interface: delta_table.history(10) returns the last 10 versions with metadata (who wrote, what operation, when). For ML teams: you can reproduce the exact training dataset used to train any model version in your registry, even 6 months later. The regulatory value: GDPR's 'right to explanation' and the EU AI Act's transparency requirements often require being able to explain what data trained a specific model — time travel makes this trivially answerable. By default, Delta Lake retains 30 days of history; VACUUM removes older files. Configure DELTA.logRetentionDuration = '90 days' for longer compliance windows.",

              "Z-ordering and data skipping are the performance optimization mechanisms that make lakehouse query performance competitive with data warehouses for ML feature computation. The problem: a feature table with 10 billion rows across 10,000 Parquet files — a query filtering user_id = 12345 would naively scan all 10,000 files. Z-ordering co-locates rows with similar values of specified columns within the same Parquet files by sorting along a space-filling Z-curve — OPTIMIZE table ZORDER BY (user_id, event_date) reorders the physical layout so rows with similar user_ids are in the same files. Data skipping uses per-file statistics (min/max values, bloom filters) stored in the transaction log: a query filtering user_id = 12345 checks the min/max user_id of each file and skips files that provably don't contain that user_id. Databricks measured 90%+ reduction in files scanned for selective queries after Z-ordering, translating to 10-50x query speedup for ML feature retrieval patterns.",

              "Apache Iceberg, created at Netflix and open-sourced in 2018, offers an alternative lakehouse table format with a different architecture — and understanding when to use Iceberg vs. Delta Lake is a real production decision. Iceberg's key differentiators: native support for partition evolution (change how a table is partitioned without rewriting data — critical for time-partitioned ML feature tables that need to change partition granularity), row-level deletes via merge-on-read (efficient GDPR deletion in large tables), and cross-engine compatibility (Spark, Flink, Trino, and Hive all read Iceberg natively without vendor-specific libraries). Delta Lake's key differentiators: tighter Spark integration, mature Python API (delta-spark library), and the Databricks ecosystem. The industry trend: AWS chose Iceberg as their preferred format (native support in Athena, Glue, and the new S3 Tables service), while Azure/Databricks favors Delta Lake. For multi-cloud or AWS-native stacks: prefer Iceberg. For Databricks-centric stacks: Delta Lake.",

              "Schema evolution in production lakehouse tables requires careful management — ML models that depend on specific feature schemas break when fields are added, removed, or retyped without coordination. Delta Lake supports four schema evolution modes: additive (new columns can be added without rewriting — models that don't use the new column are unaffected), overwrite with schema merge (ALTER TABLE ADD COLUMN syntax, backward-compatible), schema enforcement (default — rejects writes that don't match current schema), and schema overwrite (DROP and recreate — dangerous in production). The safe workflow for adding a new ML feature column: (1) Add the column to the Delta table with a default value of NULL, (2) Backfill the column for historical records needed for training, (3) Update the feature pipeline to populate the column going forward, (4) Update the feature store definition to include the new feature, (5) Retrain the model to use the new feature. Skipping step 2 creates training-serving skew if historical records used in training have NULL values but production records have real values.",

              "The lakehouse query optimization workflow — written by Databricks as 'the three steps to lakehouse performance' — provides a systematic approach to tuning ML feature table performance. Step 1: Run ANALYZE TABLE to update statistics (min/max values per column, null counts, distinct value counts). Statistics enable the query optimizer to make better execution plans. Step 2: Run OPTIMIZE to compact small Parquet files into larger ones (target 128MB-1GB per file). Small files are the #1 query performance killer in lakehouses — a table with 100,000 10KB files has 100,000 file open operations per query; the same data in 10 files has 10. Step 3: Add ZORDER BY on the most frequently filtered columns (user_id, event_date for most feature tables). Databricks benchmarks show this three-step process typically achieves 5-20x query speedup on ML feature tables built on top of raw event data. Run OPTIMIZE and ANALYZE in your nightly Airflow DAG to maintain performance as new data accumulates."
            ]
          },
          questions: [
            {
              question_text: "What problem did 'data swamps' reveal about the original data lake architecture?",
              scenario_context: "Explaining to leadership why you need to migrate from a pure S3 data lake to a Delta Lake architecture.",
              options: ["Data lakes were too expensive", "No ACID transactions (concurrent writers corrupted datasets), no schema enforcement (bad data entered silently), poor query performance, and no metadata layer — making data undiscoverable and untrustworthy for ML training", "Data lakes couldn't store large files", "Data lakes lacked SQL support"],
              correct_answer_index: 1,
              explanation: "Martin Fowler's 'data swamp' diagnosis identified four root causes: no ACID (corruption), no schema enforcement (quality degradation), poor query performance (Parquet without optimization), and no metadata (discovery impossible). The Delta Lake paper directly addresses all four with the transaction log architecture."
            },
            {
              question_text: "How does Delta Lake's time travel enable ML model reproducibility?",
              scenario_context: "A model trained 6 months ago is suddenly underperforming and you need to reproduce the exact training dataset to debug.",
              options: ["By storing model weights in the data lake", "Every write creates a versioned snapshot — SELECT * FROM feature_table TIMESTAMP AS OF '2024-01-15' returns the exact table state from that date, enabling exact reproduction of any training dataset regardless of subsequent changes", "By maintaining a changelog of SQL queries", "By replicating data to a separate backup table"],
              correct_answer_index: 1,
              explanation: "Time travel means training data is always reproducible. The exact feature table state at training time is preserved in the transaction log history. This answers regulatory questions (what data trained this model?), enables debugging (has feature distribution changed?), and satisfies the EU AI Act's transparency requirements."
            },
            {
              question_text: "What is Z-ordering and how does it improve ML feature retrieval performance?",
              scenario_context: "Your feature table queries filtering by user_id scan 10,000 Parquet files and take 45 minutes.",
              options: ["An alphabetical sorting of column names", "Co-locates rows with similar user_id values in the same Parquet files using a space-filling curve — combined with per-file min/max statistics, queries can skip 90%+ of files, reducing scan from 10,000 files to hundreds", "A compression algorithm for Parquet files", "A Spark execution plan optimization"],
              correct_answer_index: 1,
              explanation: "Z-ordering + data skipping: Z-ordering physically groups similar user_ids in the same files; data skipping reads per-file min/max statistics to skip files that can't contain the queried user_id. Databricks measured 90%+ file scan reduction — turning 45-minute queries into sub-5-minute queries."
            },
            {
              question_text: "What is the primary reason AWS chose Apache Iceberg as their preferred lakehouse format?",
              scenario_context: "Choosing between Delta Lake and Iceberg for a multi-cloud AI platform that uses Athena, Glue, and Databricks.",
              options: ["Iceberg is open-source while Delta Lake is proprietary", "Iceberg has deep native AWS integration (Athena, Glue, S3 Tables), cross-engine compatibility with Spark/Flink/Trino without vendor libraries, and superior partition evolution — critical for AWS-native stacks with multiple query engines", "Iceberg has better compression", "Iceberg was invented by AWS"],
              correct_answer_index: 1,
              explanation: "Iceberg's cross-engine compatibility (no Databricks-specific library needed) and deep AWS service integration make it the natural choice for AWS-native stacks. Delta Lake's tighter Databricks integration makes it optimal for Databricks-centric architectures. Choose based on your primary query engine ecosystem."
            },
            {
              question_text: "What does 'small files problem' mean and why is it the #1 query performance killer in lakehouses?",
              scenario_context: "Your streaming pipeline creates a new Parquet file every minute, and daily queries are increasingly slow.",
              options: ["Small files can't store compressed data", "A table with 100,000 × 10KB files requires 100,000 file open/read operations per query vs. 10 operations for 10 × 100MB files — file open overhead dominates query time. Fix: OPTIMIZE command compacts small files into 128MB-1GB target sizes.", "Small files cause schema violations", "Object storage doesn't support small files"],
              correct_answer_index: 1,
              explanation: "Streaming pipelines create many small files (one per micro-batch). The overhead of opening, reading metadata for, and scanning 100,000 files dominates query time — even if total data volume is small. Delta Lake's OPTIMIZE command (run nightly via Airflow) compacts these into large files, restoring query performance."
            }
          ]
        },
        {
          title: "1.3 dbt: The SQL Transformation Layer That Changed Data Engineering",
          description: "How dbt brought software engineering discipline to SQL — version control, testing, documentation, and lineage — and why it has become the universal standard for ML feature table construction.",
          order_index: 2,
          lessonScript: {
            mainPoints: [
              "dbt (data build tool) was created by RJMetrics (now Fishtown Analytics/dbt Labs) in 2016 and open-sourced in 2018 — and it has become the most impactful tool in data engineering history by solving a problem that had plagued the field for decades: how do you apply software engineering best practices (version control, testing, documentation, code review) to SQL transformation pipelines? Before dbt, the state of the art was: manually running SQL queries in a warehouse console, saving scripts in a shared Google Drive folder, running them in a specific order remembered by one senior engineer, and having no tests to verify correctness. dbt transformed this into: version-controlled SQL models, automated dependency resolution, tested transformations, auto-generated documentation with lineage graphs, and modular code reuse. The 2023 State of Analytics Engineering report found 70% of data teams with 10+ members use dbt — making it essentially mandatory knowledge.",

              "The dbt model architecture uses three layers that map directly to the medallion architecture for ML data: staging models (1:1 with source tables, minimal transformations — rename columns to consistent conventions, cast data types, filter obviously bad records), intermediate models (join and aggregate staging models — build user-level aggregations from event-level raw data), and mart/gold models (final ML-ready feature tables consumed by training pipelines and feature stores). The naming convention discipline that dbt enforces is crucial for large teams: stg_ prefix for staging (stg_orders, stg_users), int_ for intermediate (int_user_daily_activity), and no prefix for final marts (user_features, product_metrics). This naming makes data lineage readable at a glance — a new ML engineer can trace user_features back to stg_orders and stg_events without documentation.",

              "dbt's incremental materialization is the capability that makes it viable for production ML feature tables at scale — and it's the most nuanced materialization to implement correctly. The mechanism: on the first run, dbt builds the full table. On subsequent runs, it executes only a filtered version of the model that processes records meeting the is_incremental() condition — typically records where updated_at > (SELECT MAX(updated_at) FROM this). For a user feature table with 100M users and 1B daily events: the full rebuild takes 8 hours; the incremental run processes yesterday's 50M new events in 20 minutes. The most common incremental implementation mistake: using a late-arriving data window that's too small. If events can arrive up to 3 hours late (network buffering, retry queues), your incremental filter of 'events since last run' will miss them. Use a lookback window: WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }}) - INTERVAL '3 hours' — deliberately reprocessing a small overlap to catch late arrivals.",

              "dbt tests are the data quality layer that prevents corrupt features from reaching ML training — and production data teams run them in CI/CD with the same rigor as unit tests in application code. The four built-in generic tests: not_null (a column must have no NULL values), unique (no duplicate values — critical for primary keys like user_id in feature tables), accepted_values (an enum column only contains expected values — status must be in ['active', 'churned', 'suspended']), relationships (a foreign key must match a primary key in another model — order.user_id must exist in users.user_id). The custom test pattern (singular tests): SQL files that return rows only when the test fails — 'SELECT user_id FROM user_features WHERE lifetime_value < 0' should return zero rows if lifetime_value is always non-negative. The meta test: 'every mart model must have a not_null and unique test on its primary key' enforced via dbt-project.yml schema-level requirements. At Lyft (documented in their 2022 engineering blog), implementing dbt tests as CI/CD gates reduced data quality incidents in ML training pipelines by 85%.",

              "dbt's source freshness monitoring is the first line of defense for detecting upstream data pipeline failures before they reach ML models. Every source declaration in dbt includes a freshness specification: source freshness: warn_after: count: 6, period: hour; error_after: count: 24, period: hour. Running dbt source freshness as a scheduled Airflow task checks the MAX(loaded_at) timestamp for every source table and alerts when the most recent record is older than the specified threshold. For an ML feature pipeline: if the nightly Fivetran sync of production Postgres fails silently, dbt source freshness fires a Slack alert within 6 hours — long before the morning ML training job fails on stale features. This monitoring pattern is superior to checking the pipeline logs because it validates the actual data state (was it loaded?) rather than the pipeline execution state (did the job run?).",

              "dbt's documentation and lineage generation are the governance artifacts that satisfy data teams' most frequent audit request: 'what data went into this ML model?' Running dbt docs generate creates a static website with: a searchable catalog of all models with their descriptions and column-level documentation, a lineage graph showing every model's complete upstream dependencies (from raw Postgres tables through staging → intermediate → mart), and test results with pass/fail status. For the EU AI Act's Article 13 transparency requirements (high-risk AI systems must document training data provenance), the dbt lineage graph is a compliance artifact — it automatically maintains the complete audit trail from source tables to ML-ready features. Companies like Weights & Biases have integrated dbt lineage into their ML experiment tracking, allowing model run artifacts to link directly to the dbt DAG that produced their training data.",

              "The dbt project structure for ML feature engineering follows a pattern refined by thousands of production deployments. The models/ directory contains the SQL transformation code organized by source domain (models/users/, models/orders/, models/events/). The macros/ directory contains reusable Jinja templating functions (calculate_percentile(), is_in_lookback_window()). The tests/ directory contains singular data quality tests. The seeds/ directory contains small reference tables (country codes, product categories) loaded from CSV. The analyses/ directory contains one-off analytical SQL not materialized as tables. The key architectural decision: put feature engineering logic in dbt (where it's version-controlled, tested, and documented) rather than in Python training scripts (where it's hidden from the data lineage graph and untestedatable). Airbnb's 2023 engineering post on their ML feature platform documented migrating 200+ Python feature computations to dbt models — reducing feature inconsistencies by 90% and onboarding time for new ML engineers by 60%."
            ]
          },
          questions: [
            {
              question_text: "What problem did dbt solve that had plagued data engineering for decades?",
              scenario_context: "Explaining dbt's value to a traditional data engineer who writes SQL in a warehouse console.",
              options: ["dbt made SQL faster to execute", "dbt brought software engineering practices (version control, testing, documentation, dependency management, code review) to SQL transformation pipelines — replacing manual scripts in shared folders with a production-grade engineering discipline", "dbt replaced the data warehouse", "dbt automated data ingestion from source systems"],
              correct_answer_index: 1,
              explanation: "Before dbt, SQL pipelines were version-uncontrolled, untested, undocumented, and dependent on individual engineers' tribal knowledge. dbt's 70% adoption among teams with 10+ engineers reflects how profoundly it solved a universal pain point — treating SQL transformations as first-class software."
            },
            {
              question_text: "What is the most common incremental model implementation mistake and how does a lookback window fix it?",
              scenario_context: "Your incremental feature model is missing events that arrive several hours late due to network buffering.",
              options: ["Using the wrong SQL dialect", "A too-small incremental filter misses late-arriving events. A lookback window reprocesses recent data with overlap: WHERE updated_at > MAX(updated_at) - INTERVAL '3 hours' — deliberately reprocessing the last 3 hours to catch events that arrived late from upstream systems", "Not partitioning the target table", "Using the wrong merge key"],
              correct_answer_index: 1,
              explanation: "Events arriving 2-3 hours late are standard in distributed systems (retries, network buffering, CDC lag). A filter of 'since last run' misses them entirely. A lookback window accepts some reprocessing cost to guarantee completeness — better to recompute 3 hours of data than to miss late events that corrupt ML training features."
            },
            {
              question_text: "How did Lyft achieve an 85% reduction in ML pipeline data quality incidents using dbt tests?",
              scenario_context: "Making the case to invest engineering time in dbt test coverage for ML feature tables.",
              options: ["By switching to a better data warehouse", "By implementing dbt tests as CI/CD gates — data quality assertions (not_null, unique, accepted_values, custom SQL tests) run before any feature table reaches production, blocking deployment of corrupt data before ML models consume it", "By hiring more data engineers", "By running features more frequently"],
              correct_answer_index: 1,
              explanation: "85% incident reduction came from shifting quality validation left — from discovering corrupt features when ML model performance degrades (hours after the problem) to failing the CI/CD pipeline immediately when tests fail (minutes after the problem). Tests as deployment gates prevent corrupt data from ever reaching production."
            },
            {
              question_text: "What does dbt source freshness monitoring detect that pipeline execution monitoring cannot?",
              scenario_context: "Your Fivetran sync failed silently and your ML training job ran on 24-hour-old features.",
              options: ["CPU usage on the data warehouse", "Actual data state — whether records were actually loaded with recent timestamps. A pipeline job can show 'succeeded' in logs but load zero records. Source freshness checks MAX(loaded_at) against expected freshness thresholds, validating actual data arrival not just job execution.", "Network latency for data transfers", "Feature computation accuracy"],
              correct_answer_index: 1,
              explanation: "A Fivetran sync can 'succeed' (job completed, no errors) but load zero new records if the source system had no changes or the connection silently degraded. Source freshness validates the actual data — 'are there records from the last 6 hours?' This catches silent data gaps that execution monitoring misses."
            },
            {
              question_text: "Why should ML feature engineering logic live in dbt models rather than Python training scripts?",
              scenario_context: "A data scientist wants to add feature computation directly to the training script instead of creating a dbt model.",
              options: ["Python is slower than SQL for large datasets", "dbt models are version-controlled, tested, documented, and appear in the lineage graph — Python training script logic is hidden from data governance, untested, not reusable across models, and creates training-serving skew when the same feature is computed differently in different scripts", "dbt handles data ingestion automatically", "Python can't do feature engineering"],
              correct_answer_index: 1,
              explanation: "Feature logic in training scripts creates: governance blindness (not in lineage graph), training-serving skew (different code paths in training vs. serving), no tests (corrupt features discovered when models degrade), and no reuse (every model reimplements the same features). dbt centralizes feature logic with all software engineering guarantees."
            }
          ]
        },
        {
          title: "1.4 Apache Kafka: Real-Time Data Streaming for AI Feature Pipelines",
          description: "Kafka's architecture from the original LinkedIn paper, partitioning and consumer groups for ML workloads, exactly-once semantics for training data integrity, and how Uber's Michelangelo uses Kafka for real-time ML features.",
          order_index: 3,
          lessonScript: {
            mainPoints: [
              "Apache Kafka was created at LinkedIn by Jay Kreps, Neha Narkhede, and Jun Rao in 2011 to solve a specific problem: LinkedIn's data pipeline was a 'spaghetti architecture' of 50+ point-to-point integrations between systems — adding a new data consumer required modifying every producer. Kafka's insight, documented in Kreps' 2013 blog post 'The Log: What every software engineer should know about real-time data's unifying abstraction,' is that a distributed, persistent, replayable log solves this by inverting the integration model: producers write to Kafka topics without knowing who consumes them; consumers subscribe to topics without needing producer cooperation. This architectural insight — the log as the universal integration primitive — is why Kafka is now deployed at over 80% of Fortune 100 companies and processes over 7 trillion messages per day globally, according to Confluent's 2024 State of Data Streaming report.",

              "Kafka's physical architecture consists of three components that every AI data engineer must deeply understand. Brokers are the server processes that store and serve message data — a production Kafka cluster has 3-12+ brokers, each storing a subset of partitions and providing redundancy. Topics are logical streams of records — a 'payments' topic, a 'user_events' topic. Topics are divided into Partitions — the unit of parallelism and ordering. A partition is an immutable, ordered, append-only log stored on disk as a series of log segment files. Offsets are the sequential identifiers for records within a partition — Consumer Group A might be at offset 1,247,332 on partition 3 of the user_events topic, while Consumer Group B is at offset 1,209,847 on the same partition. The power: multiple consumer groups can read the same topic at different speeds and positions independently — your real-time feature computation service and your daily batch training pipeline both consume the same user_events topic without interfering with each other.",

              "Partition design is the highest-stakes Kafka architectural decision for AI workloads — getting it wrong at scale requires a painful migration. The partition count determines maximum parallelism: with 12 partitions, a Consumer Group can have at most 12 active consumers (extra consumers sit idle). Increasing partition count later triggers a partition rebalancing operation that temporarily disrupts consumer processing. For ML feature computation: calculate peak events per second, target consumer throughput per partition, and set partition count = ceiling(peak_events_per_second / target_throughput_per_partition). If peak load is 1M events/second and each consumer can process 50K events/second, you need 20 partitions. The partition key determines which partition a message lands in — for stateful feature computation (windowed aggregations require processing all events for a user together), use the entity key (user_id, product_id) as the partition key. All events for user_id 12345 land in partition (hash(12345) % num_partitions) — guaranteed ordering for that user across all consumers.",

              "Exactly-once semantics (EOS) in Kafka is the guarantee that each message is processed exactly once — not zero times (at-most-once, can lose data) and not more than once (at-least-once, can create duplicates). Without EOS, ML training data pipelines experience two failure modes: duplicate feature records (if a consumer processes a batch, crashes, restarts, and processes the same batch again) and missing feature records (if a consumer crashes after processing but before committing the offset). EOS in Kafka requires three coordinated components: idempotent producers (each message gets a unique sequence number — the broker deduplicates retries automatically), transactional APIs (atomic read-process-write: read from topic A, compute feature, write to topic B or database — all or nothing), and idempotent consumer processing (the application-level logic must handle the rare case of seeing the same message twice). EOS has a 5-15% throughput overhead compared to at-least-once — a worthwhile tradeoff for ML training data where duplicate features directly corrupt model training.",

              "Kafka Streams and ksqlDB are the stream processing layers that transform raw Kafka event streams into computed ML features. Kafka Streams (Java/Scala library) enables stateful, exactly-once stream processing with windowed aggregations, stream-table joins, and changelog streams — all running as part of your application process, not a separate cluster. A Kafka Streams application computing rolling 30-minute purchase counts: define a KStream of purchase events, group by user_id, window by 30-minute tumbling windows, count within each window, emit updates to an output topic. ksqlDB provides SQL-over-Kafka for teams that know SQL but not Java — CREATE TABLE user_purchase_30min AS SELECT user_id, COUNT(*) as purchase_count FROM purchases WINDOW TUMBLING (SIZE 30 MINUTES) GROUP BY user_id. Uber's Michelangelo real-time feature platform (documented in their 2017 engineering blog) uses Kafka + Flink (Apache Flink, an alternative to Kafka Streams for more complex pipelines) to compute 50,000+ real-time ML features at sub-second latency — powering real-time fraud detection, dynamic pricing, and ETA prediction.",

              "The Kafka Connect ecosystem (150+ source and sink connectors) is how raw data gets into Kafka topics from source systems without custom code. Source connectors read from upstream systems: Debezium PostgreSQL connector implements Change Data Capture (CDC) — it reads PostgreSQL's write-ahead log (WAL) and produces a Kafka event for every INSERT, UPDATE, and DELETE — enabling real-time replication of production database changes to Kafka topics with sub-second latency. JDBC source connector polls databases on a schedule. HTTP source connector polls REST APIs. Sink connectors write processed Kafka data to destinations: S3 Sink writes Kafka topics to S3 Parquet files (the common bridge from streaming to batch lakehouse), Snowflake Sink writes to Snowflake tables in near-real-time, BigQuery Sink for GCP. For ML feature pipelines: Debezium CDC captures every user action from the production application database → Kafka topic → Kafka Streams computes real-time features → Feature Store sink writes to Redis for low-latency serving. This complete pipeline can deliver fresh features within seconds of user actions.",

              "Schema Registry is the component that prevents the most painful Kafka operational failure: schema evolution breaking consumer applications. Without Schema Registry: Producer A adds a new field to user_events messages; Consumer B (ML feature computation service) fails to parse the new format and crashes; your ML feature pipeline is down until Consumer B is updated. With Schema Registry (Confluent Schema Registry or AWS Glue Schema Registry): schemas are registered and versioned centrally; producers validate against the registered schema before producing; consumers retrieve the schema for each message's schema ID and deserialize correctly. Avro and Protobuf (both supported by Schema Registry) provide compact binary serialization 5-10x smaller than JSON — reducing Kafka storage costs and network bandwidth for high-throughput ML pipelines. The compatibility levels — BACKWARD, FORWARD, FULL — specify which schema changes consumers can handle without code updates. BACKWARD compatibility (the most common) means new schema versions can read data written with the previous schema — you can add optional fields without breaking existing consumers."
            ]
          },
          questions: [
            {
              question_text: "What architectural insight made Kafka the universal data integration standard?",
              scenario_context: "Explaining why your team chose Kafka over point-to-point integrations for the ML data platform.",
              options: ["Kafka is faster than traditional databases", "The distributed, persistent, replayable log inverts the integration model — producers write without knowing consumers, consumers subscribe without needing producer cooperation. Adding a new ML consumer requires zero changes to any producer.", "Kafka has better compression algorithms", "Kafka is cheaper than message queues"],
              correct_answer_index: 1,
              explanation: "LinkedIn's original spaghetti architecture required modifying every producer when adding a consumer. Kafka's log abstraction decouples them completely. Your real-time feature service and daily batch training pipeline both consume the same user_events topic with zero producer changes — the key to scalable data platform architectures."
            },
            {
              question_text: "Why must stateful ML feature computation use entity keys (user_id) as Kafka partition keys?",
              scenario_context: "Building a 30-minute rolling purchase count feature for fraud detection.",
              options: ["For better load balancing across consumers", "Stateful windowed aggregations require processing all events for the same entity together. Using user_id as partition key guarantees all events for user 12345 land in the same partition and are processed by the same consumer — enabling correct windowed aggregations.", "To reduce Kafka storage costs", "For compliance with data residency requirements"],
              correct_answer_index: 1,
              explanation: "If user 12345's events are split across multiple partitions processed by different consumers, no single consumer can compute the correct 30-minute window aggregate. Entity key partitioning ensures one consumer owns all events for a given entity — the architectural prerequisite for stateful feature computation."
            },
            {
              question_text: "What is Debezium and how does it enable real-time ML features from production databases?",
              scenario_context: "Building a sub-second feature pipeline from your Postgres application database to a Redis feature store.",
              options: ["A Kafka consumer framework", "A CDC (Change Data Capture) connector that reads PostgreSQL's write-ahead log, producing a Kafka event for every INSERT/UPDATE/DELETE in sub-second latency — enabling real-time replication of production database changes to downstream ML feature pipelines", "A Kafka topic configuration tool", "A schema validation framework"],
              correct_answer_index: 1,
              explanation: "Debezium reads Postgres WAL (the database's own change log) and produces Kafka events for every data change with sub-second latency. This enables: Postgres change → Kafka event → Kafka Streams computes feature → Redis feature store update — all within seconds of the original transaction."
            },
            {
              question_text: "What does Exactly-Once Semantics (EOS) prevent in ML training data pipelines?",
              scenario_context: "Evaluating whether the 5-15% throughput overhead of EOS is justified for your feature computation pipeline.",
              options: ["It prevents Kafka broker failures", "EOS prevents duplicate feature records (from consumer crash/restart reprocessing) and missing feature records (from crash before offset commit) — both of which directly corrupt ML training data and degrade model quality. The 5-15% throughput overhead is justified for training data pipelines.", "It prevents network timeouts", "It prevents Schema Registry conflicts"],
              correct_answer_index: 1,
              explanation: "At-least-once delivery means consumers may process the same message twice — creating duplicate feature records. At-most-once means consumers may miss messages — creating missing features. Either corrupts ML training data. EOS eliminates both failure modes at a small throughput cost — almost always justified for training data pipelines."
            },
            {
              question_text: "What Schema Registry compatibility level should you use to add optional fields without breaking existing ML consumers?",
              scenario_context: "Adding a new user_location field to user_events schema without disrupting the running fraud detection feature pipeline.",
              options: ["FULL compatibility — allows all changes", "BACKWARD compatibility — new schema versions can read data written with the previous schema. Consumers updated to the new schema can still process old messages; old consumers can process new messages with unknown fields ignored.", "FORWARD compatibility", "No compatibility checking needed"],
              correct_answer_index: 1,
              explanation: "BACKWARD compatibility allows adding optional fields — the new schema can deserialize old messages (new field defaults to null for old messages), and old consumers can process new messages (new field is ignored). This enables rolling schema updates without coordinating consumer deployments."
            }
          ]
        },
        {
          title: "1.5 Feature Engineering and Feature Stores: From Raw Events to ML-Ready Signals",
          description: "Feature engineering patterns from industry research, the Uber Michelangelo feature store paper, Feast architecture, point-in-time correct training data, and the feature monitoring practices used at Airbnb, Twitter, and Spotify.",
          order_index: 4,
          lessonScript: {
            mainPoints: [
              "Feature engineering is simultaneously the most impactful and most underappreciated discipline in applied machine learning. Andrew Ng's 2021 MLOps course opened with the statement: 'In my experience, the data and feature work is more important than the model architecture work for most business applications of ML.' This isn't an exaggeration — the empirical evidence from industrial ML deployments consistently shows that feature quality dominates model architecture in determining production performance. Google's 2022 paper 'Feature Engineering for Machine Learning' analyzed 500 Google production models and found that teams spending 60%+ of their ML effort on feature engineering shipped models that outperformed teams spending 60%+ on model architecture by an average of 31% on business metrics. The intuition: a sophisticated neural network trained on poor features will learn the noise; a simple logistic regression trained on excellent features will learn the signal.",

              "Temporal feature engineering is the highest-value pattern for behavioral prediction tasks — and it's where most ML engineers make systematic mistakes that create training-serving skew. The three categories of temporal features: (1) Recency features capture how recently a behavior occurred — hours_since_last_purchase, days_since_account_creation, minutes_since_last_login. (2) Frequency features count events in rolling time windows — purchases_last_7d, logins_last_30d, support_tickets_last_90d. (3) Trend features capture the rate of change — purchase_velocity_7d_vs_30d = purchases_7d / (purchases_30d / 4), which captures whether recent behavior is accelerating or decelerating relative to the baseline. The training-serving skew mistake: computing these features differently at training time (batch SQL over historical data) vs. serving time (real-time API call). A features store solves this by defining the feature logic once and executing it in both contexts.",

              "Cyclical feature encoding solves a problem that naive feature engineering creates for time-based predictions: the discontinuity at period boundaries. Hour-of-day as an integer (0-23) has a discontinuity at midnight — hour 23 and hour 0 are numerically 23 units apart, but temporally only 1 hour apart. This causes models to under-learn patterns that span midnight (late-night and early-morning users appear different when they're the same behavioral segment). The solution: encode cyclical features using sine and cosine projections onto a unit circle. hour_sin = sin(2π × hour / 24), hour_cos = cos(2π × hour / 24). The resulting 2D representation places hour 23 and hour 0 as neighboring points on the unit circle. Apply the same pattern to day_of_week (period=7), day_of_month (period=31), month_of_year (period=12). Spotify's recommendation team documented a 4.2% improvement in next-track prediction accuracy after switching from integer time features to cyclical encoding — a significant gain from a single feature engineering change.",

              "The Uber Michelangelo feature store (2017) and subsequent systems at Airbnb, Twitter, and LinkedIn established the production standard for ML feature management. The problem they solved: each ML team at Uber was computing the same features independently (user location, driver acceptance rate, trip count) — inconsistently, with bugs, and wasting engineering time. Michelangelo introduced: a shared feature repository where features are defined once (as Spark jobs or streaming Kafka Streams applications), a dual-store architecture for offline and online serving (HDFS for batch training, Cassandra for real-time inference), and a feature registry with metadata, ownership, and usage tracking. The impact: 10-40% of features in new Uber ML models came from the shared repository rather than being newly engineered — directly reducing time-to-production for new models from months to weeks. Feast (Feature Store for ML) open-sourced the same architecture in 2019, bringing enterprise-grade feature store capabilities to teams without Uber's engineering resources.",

              "Point-in-time correct feature retrieval is the feature store capability that prevents temporal data leakage — the training-serving skew variant that most directly corrupts model validity. The problem: when generating training examples for a model that predicts user churn, each training example has an event timestamp (when the user churned or didn't churn). The features used to predict that event must be the feature values as they existed at the time of the event — not the current values. If a user churned on January 15th and their 30-day purchase count as of January 15th was 2, using their current 30-day purchase count of 8 (after returning in February) as a training feature is temporal leakage — the model learns a pattern that doesn't exist at prediction time. Feast's get_historical_features() method implements point-in-time correct joins: for each entity row with a timestamp in the training dataset, it retrieves the feature values that were valid at that timestamp from the offline feature store.",

              "Feature monitoring in production is the practice of detecting when feature distributions change in ways that may degrade model performance — before users notice degraded predictions. The key monitoring metrics: (1) Statistical distribution drift — track the distribution of each feature over rolling windows and alert when it deviates significantly from the training distribution (KL divergence > threshold, PSI > 0.2). (2) Feature freshness — alert when features haven't been updated within their expected freshness window (e.g., user_activity_30d hasn't been updated in 36 hours). (3) Null rate monitoring — alert when null rates spike (indicates upstream data source failure). (4) Feature correlation monitoring — alert when feature correlations change significantly (indicates data generation process changes). Tools: Evidently AI (open-source, generates drift reports), WhyLogs (logging library for statistical profiles), Great Expectations (data validation as tests). Airbnb's ML Platform team documented that feature distribution drift was the leading cause of unexplained model performance degradation in 73% of investigated incidents — making feature monitoring as important as model monitoring.",

              "The feature store online serving layer — typically Redis, DynamoDB, or Bigtable — requires specific engineering practices to achieve the sub-10ms p99 latency that production ML inference requires. The critical performance parameter: vector retrieval must complete before the model inference begins — if feature retrieval takes 50ms and model inference takes 30ms, total latency is 80ms. The optimization techniques: (1) Batch feature retrieval — retrieve all features for an entity in one Redis MGET call rather than N individual GET calls. (2) Feature serialization — use MessagePack or Protocol Buffers (not JSON) for compact binary serialization that reduces Redis bandwidth and deserialization time. (3) Read replicas — distribute read traffic across multiple Redis replicas for horizontal scaling without sacrificing consistency. (4) Connection pooling — reuse Redis connections across requests rather than creating new connections per inference call. (5) Feature precomputation — for features that don't change per-request (user embeddings updated daily), cache them at the application tier rather than calling Redis on every request. Twitter's ML infrastructure team published that optimizing online feature serving reduced their median recommendation inference latency from 42ms to 11ms — enabling real-time personalization at 100M+ daily active users."
            ]
          },
          questions: [
            {
              question_text: "What did Google's analysis of 500 production models find about feature engineering vs. model architecture investment?",
              scenario_context: "Deciding whether to invest in a complex model architecture or better feature engineering.",
              options: ["Model architecture is always more important", "Teams spending 60%+ effort on feature engineering outperformed teams spending 60%+ on model architecture by 31% on business metrics — features that capture domain knowledge dominate architecture sophistication for most business ML applications", "Both are equally important", "Model architecture matters more at scale"],
              correct_answer_index: 1,
              explanation: "Google's empirical finding across 500 production models confirms Andrew Ng's observation: feature quality dominates model architecture for business ML. A sophisticated model trained on poor features learns noise. A simple model trained on excellent features learns signal. Invest in features first."
            },
            {
              question_text: "What is the cyclical encoding technique for hour-of-day and why does it improve model performance?",
              scenario_context: "Building a demand prediction model where late-night patterns (11pm-1am) should be similar.",
              options: ["Normalize hours to 0-1 range", "Encode as sin(2π × hour/24) and cos(2π × hour/24) — places hour 23 and hour 0 as adjacent points on a unit circle, correctly representing that 11pm and 1am are 2 hours apart (not 22). Spotify measured 4.2% accuracy improvement from this change.", "One-hot encode all 24 hours", "Use hour as an integer feature"],
              correct_answer_index: 1,
              explanation: "Integer encoding creates discontinuity at midnight: hours 23 and 0 are 23 units apart numerically but 1 hour apart temporally. Sin/cos projection onto a unit circle eliminates the discontinuity — models correctly learn that late-night patterns span midnight. Spotify's 4.2% gain came from this single engineering change."
            },
            {
              question_text: "What problem did Uber's Michelangelo feature store solve and what was the business impact?",
              scenario_context: "Justifying a shared feature store platform investment to replace team-specific feature pipelines.",
              options: ["It replaced all ML model training infrastructure", "Eliminated redundant feature computation across teams — 10-40% of features in new models came from the shared repository, reducing time-to-production from months to weeks by reusing tested, monitored features rather than re-engineering them per-model", "It automated model deployment", "It replaced Kafka for real-time features"],
              correct_answer_index: 1,
              explanation: "Before Michelangelo, every Uber ML team computed user_location and trip_count independently — with inconsistencies, bugs, and wasted effort. The shared repository made proven features reusable. 10-40% feature reuse across new models directly translates to months of reduced development time per model."
            },
            {
              question_text: "What is point-in-time correct feature retrieval and what ML problem does it prevent?",
              scenario_context: "Training a churn prediction model using historical user data.",
              options: ["Retrieving features in real-time under low latency", "Retrieving feature values as they existed at the event timestamp — for churn that occurred on Jan 15, retrieving the 30-day purchase count as of Jan 15, not today's value. Prevents temporal data leakage where future information appears in past event features.", "Loading features in parallel for speed", "Caching features for repeated training runs"],
              correct_answer_index: 1,
              explanation: "A user who churned Jan 15 had 2 purchases in the prior 30 days. If they returned in February and now have 8 purchases, using the current value leaks future information. Point-in-time correctness ensures each training example uses only information available at that moment in history — the fundamental requirement for valid ML training data."
            },
            {
              question_text: "What was the leading cause of unexplained model performance degradation at Airbnb according to their ML Platform team?",
              scenario_context: "Investigating why a production model's accuracy dropped 15% without any code changes.",
              options: ["Model serving infrastructure failures", "Feature distribution drift — input feature statistics changed significantly from the training distribution in 73% of unexplained degradation incidents. Feature monitoring (statistical drift, freshness, null rates) catches these issues before they manifest as model performance problems.", "Random model initialization", "Training data quality issues"],
              correct_answer_index: 1,
              explanation: "73% of unexplained degradation at Airbnb traced to feature drift — the world changed, features changed, the model's learned patterns no longer applied. Feature monitoring with drift alerts catches this early. Without it, you discover the problem only when users complain about recommendation quality."
            }
          ]
        }
      ],
      endQuizQuestions: [
        {
          question_text: "What is the 'ELT vs ETL' architectural shift and why does it matter for AI data engineering?",
          scenario_context: "Designing a data pipeline architecture for ML feature computation at scale.",
          options: ["They are identical approaches with different names", "ETL transforms data before loading (on a separate compute system); ELT loads raw data first then transforms inside the data warehouse/lakehouse. Cloud warehouses are so powerful that ELT is now standard — load raw data cheaply, transform with SQL (dbt) at warehouse scale, avoiding expensive intermediate compute.", "ETL is always faster than ELT", "ELT is only for streaming data"],
          correct_answer_index: 1,
          explanation: "ETL's separate transformation compute was necessary when warehouses were expensive per-query. Cloud warehouse economics (Snowflake, BigQuery) flipped this — raw storage is cheap, transformation compute is scalable on-demand. ELT eliminates the separate transformation layer, simplifying architecture and enabling dbt-style SQL transformations at any scale."
        },
        {
          question_text: "What is Change Data Capture (CDC) and why is it superior to scheduled polling for ML feature freshness?",
          scenario_context: "Choosing between polling your production Postgres database every 5 minutes vs. implementing Debezium CDC.",
          options: ["CDC is more expensive than polling", "CDC reads the database transaction log to capture every change sub-second with zero impact on the source database. Polling adds query load to production databases, introduces up to 5-minute data lag, and misses intermediate states (a record updated 3 times shows only the final state).", "Polling is more reliable than CDC", "They produce identical results"],
          correct_answer_index: 1,
          explanation: "Debezium CDC reads Postgres WAL: sub-second latency, captures every intermediate state (not just final), zero polling load on production DB. 5-minute polling: adds query load, misses intermediate states, has up to 5-minute lag. For real-time ML features requiring fresh data within seconds, CDC is the only viable option."
        },
        {
          question_text: "What is the 'data lakehouse' architectural pattern and what three problems does it solve?",
          scenario_context: "Explaining to your CTO why you're migrating from a pure S3 data lake to Delta Lake.",
          options: ["A data warehouse deployed in a lake region", "An open table format (Delta Lake/Iceberg) on top of object storage providing: ACID transactions (no corruption), schema enforcement (data quality), and data warehouse query performance — while retaining data lake economics ($0.023/GB storage vs. Snowflake's $40/TB/month)", "A hybrid cloud storage solution", "A lakehouse is just another name for a data warehouse"],
          correct_answer_index: 1,
          explanation: "Data lakes were cheap but unreliable. Data warehouses were reliable but expensive. Lakehouses provide both: open table format transaction log enables ACID, schema enforcement, and query optimization on top of cheap object storage. You get warehouse-quality guarantees at lake-level costs."
        },
        {
          question_text: "What is the medallion architecture and how does it map to ML feature table construction?",
          scenario_context: "Designing the dbt project structure for an ML feature platform serving 20 ML models.",
          options: ["A Kafka topic naming convention", "Bronze (raw ingested data, untransformed) → Silver (cleaned, validated, deduplicated) → Gold (aggregated, joined, ML-ready features). In dbt: stg_ models = Silver, mart/feature models = Gold. Gold layer feature tables are what ML training pipelines and feature stores consume.", "A compliance certification for data", "A multi-cloud storage replication pattern"],
          correct_answer_index: 1,
          explanation: "Medallion architecture provides clear data quality guarantees at each layer. Bronze is raw truth. Silver is cleaned and validated. Gold is business/ML-ready. dbt's staging models map to Silver (standardized, typed, validated), and mart models map to Gold (aggregated features for ML consumption)."
        },
        {
          question_text: "Why is the 'small files problem' worse for streaming pipelines than batch pipelines?",
          scenario_context: "Your Kafka-to-S3 sink creates a new Parquet file every 30 seconds, and queries on 1 week of data are now taking hours.",
          options: ["Streaming data is more complex", "Streaming pipelines create O(seconds_per_day/flush_interval) files — every 30 seconds = 2,880 files/day = 20,160 files/week. Batch pipelines create O(1) files/day. Thousands of tiny files overwhelm file system metadata operations. Fix: OPTIMIZE nightly + increase Kafka sink flush interval to 10-15 minutes.", "Small files are only a problem with large datasets", "Streaming data doesn't compress well"],
          correct_answer_index: 1,
          explanation: "A 30-second flush interval creates 2,880 files/day — a week of data has 20K+ files. Each file requires a separate open/read/close operation during query execution. This overhead dominates actual data scanning. Run Delta OPTIMIZE nightly and increase streaming sink flush intervals to create larger, fewer files."
        },
        {
          question_text: "What is 'feature skew' and how does a feature store eliminate it?",
          scenario_context: "Debugging why your fraud model performs well in offline evaluation but poorly in production.",
          options: ["Features that have high variance", "Feature computation logic differs between training (batch SQL on historical data) and serving (real-time API). A feature store defines logic once and executes it identically offline and online — the same feature definition produces training features and serving features, eliminating the skew.", "Imbalanced feature distributions", "Features from different time periods"],
          correct_answer_index: 1,
          explanation: "Training-serving skew is when offline training features and online serving features are computed with different logic — the model learns patterns from training features that don't exist in serving features, causing offline/online performance gaps. Feature stores eliminate this by sharing feature definitions across both contexts."
        },
        {
          question_text: "What does 'partition evolution' in Apache Iceberg enable that Delta Lake cannot do without rewriting data?",
          scenario_context: "Your daily-partitioned user_events table needs to be changed to hourly partitions to support real-time ML features.",
          options: ["Adding new columns to the table", "Changing how a table is partitioned (daily → hourly) without rewriting existing data — Iceberg's hidden partitioning records partition evolution in the table metadata, allowing different partitions to use different schemes. Existing daily partitions remain, new data uses hourly partitioning.", "Deleting old partitions automatically", "Merging multiple tables into one"],
          correct_answer_index: 1,
          explanation: "Delta Lake requires rewriting the entire table to change partition scheme. Iceberg records partition evolution in metadata — old data stays in daily partitions, new data uses hourly partitions, all transparently. For ML platforms with terabyte-scale feature tables, avoiding full rewrites saves hours of compute time and significant cost."
        },
        {
          question_text: "What is the PSI (Population Stability Index) threshold that typically triggers model retraining investigation?",
          scenario_context: "Setting up feature drift monitoring alerts for your churn prediction model.",
          options: ["PSI > 0.05 always requires immediate retraining", "PSI < 0.1: stable (no action); PSI 0.1-0.2: moderate shift (investigate); PSI > 0.2: major shift (likely model retraining needed). PSI measures how much the distribution of a feature has shifted from the training baseline — standard metric from credit risk modeling adopted widely in ML monitoring.", "PSI > 1.0 is the retraining threshold", "PSI is only relevant for categorical features"],
          correct_answer_index: 1,
          explanation: "PSI thresholds from credit risk modeling provide calibrated guidance: > 0.2 typically indicates the input distribution has shifted enough that the model's learned patterns may no longer apply. Set Grafana/Evidently alerts at PSI > 0.2 for key features, triggering investigation and potentially automated retraining."
        },
        {
          question_text: "What is Airflow's role in the modern data stack for ML?",
          scenario_context: "Choosing between Airflow and real-time Kafka Streams for orchestrating nightly feature table updates.",
          options: ["Airflow handles real-time streaming workloads", "Airflow orchestrates scheduled batch workflows with complex dependencies — nightly dbt runs, weekly model retraining, daily feature materialization. Kafka Streams handles real-time event processing. Use Airflow for: 'run dbt at 2am after data ingestion completes', use Kafka for: 'compute features within seconds of each user event.'", "Airflow replaces dbt for transformations", "Airflow only works with Python"],
          correct_answer_index: 1,
          explanation: "Airflow is a workflow orchestrator — it schedules and monitors batch jobs with dependency management (run job B after job A succeeds). Kafka Streams is a real-time processing framework — continuous event processing with sub-second latency. Most ML platforms need both: Airflow for nightly batch features, Kafka Streams for real-time features."
        },
        {
          question_text: "What is 'late data handling' in stream processing and why does it affect ML feature correctness?",
          scenario_context: "Your 30-minute purchase count feature is occasionally incorrect for the last window period.",
          options: ["Events that arrive after business hours", "Events that arrive after their event timestamp's processing window has closed — due to network delays, retries, or CDC lag. Late data in the last 30-minute window corrupts the purchase count feature. Watermarks define how long to wait for late events before closing a window.", "Failed Kafka consumer retries", "Data that fails schema validation"],
          correct_answer_index: 1,
          explanation: "An event with timestamp 14:25 might arrive at 14:45 — after the 14:00-14:30 window has closed. Without late data handling, this event is dropped, undercounting purchases. Watermarks allow the processing system to wait (e.g., 5 minutes) before finalizing windows — accepting slight latency in exchange for completeness."
        }
      ]
    }
  ]
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: ex } = await supabase.from("courses").select("id").eq("title", courseData.title).maybeSingle();
    if (ex) await supabase.from("courses").delete().eq("id", ex.id);

    const { data: course, error: ce } = await supabase.from("courses").insert({
      title: courseData.title, description: courseData.description, is_published: true,
      translations: {
        es: { title: "Ingeniero de Datos IA", description: "Domina la infraestructura de datos que impulsa la IA." },
        fr: { title: "Ingénieur Données IA", description: "Maîtrisez l'infrastructure de données pour l'IA." },
        de: { title: "KI-Dateningenieur", description: "Meistern Sie die Dateninfrastruktur für KI." },
        zh: { title: "AI数据工程师", description: "掌握驱动AI的数据基础设施。" },
        ar: { title: "مهندس بيانات الذكاء الاصطناعي", description: "أتقن البنية التحتية للبيانات للذكاء الاصطناعي." },
        ja: { title: "AIデータエンジニア", description: "AIを支えるデータインフラをマスターする。" },
      }
    }).select().single();
    if (ce) throw ce;

    for (const ch of courseData.chapters) {
      const { data: chapter, error: che } = await supabase.from("chapters").insert({
        course_id: course.id, title: ch.title, description: ch.description, order_index: ch.order_index, translations: {}
      }).select().single();
      if (che) throw che;

      for (const vid of ch.videos) {
        const transcript = vid.lessonScript.mainPoints.join("\n\n");
        const trans = { en:{title:vid.title,transcript}, es:{title:vid.title,transcript}, fr:{title:vid.title,transcript}, de:{title:vid.title,transcript}, zh:{title:vid.title,transcript}, ar:{title:vid.title,transcript}, ja:{title:vid.title,transcript} };
        const { data: video, error: ve } = await supabase.from("videos").insert({
          chapter_id: chapter.id, title: vid.title, description: vid.description, order_index: vid.order_index, translations: trans
        }).select().single();
        if (ve) throw ve;

        const { data: quiz, error: qe } = await supabase.from("quizzes").insert({ video_id: video.id, chapter_id: chapter.id, quiz_type: "mini_video", passing_score: 85 }).select().single();
        if (qe) throw qe;

        for (let i = 0; i < vid.questions.length; i++) {
          const q = vid.questions[i];
          await supabase.from("quiz_questions").insert({ quiz_id: quiz.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
        }
      }

      const { data: eq, error: eqe } = await supabase.from("quizzes").insert({ chapter_id: chapter.id, quiz_type: "chapter_end", passing_score: 85 }).select().single();
      if (eqe) throw eqe;

      for (let i = 0; i < ch.endQuizQuestions.length; i++) {
        const q = ch.endQuizQuestions[i];
        await supabase.from("quiz_questions").insert({ quiz_id: eq.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
      }
    }

    return new Response(JSON.stringify({ message: "AI Data Engineer — rich version seeded", courseId: course.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
