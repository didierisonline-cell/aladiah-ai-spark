import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Data Engineer",
  "description": "Master the data infrastructure that powers AI — dbt, Snowflake, Apache Kafka, Airflow, feature engineering, and modern data lakehouse architectures used at the world's leading AI companies.",
  "translations": {
    "es": {
      "title": "Ingeniero de Datos IA",
      "description": "Domina la infraestructura de datos que impulsa la IA."
    },
    "fr": {
      "title": "Ingénieur Données IA",
      "description": "Maîtrisez l'infrastructure de données pour l'IA."
    },
    "de": {
      "title": "KI-Dateningenieur",
      "description": "Meistern Sie die Dateninfrastruktur für KI."
    },
    "zh": {
      "title": "AI数据工程师",
      "description": "掌握驱动AI的数据基础设施。"
    },
    "ar": {
      "title": "مهندس بيانات الذكاء الاصطناعي",
      "description": "أتقن البنية التحتية للبيانات للذكاء الاصطناعي."
    },
    "ja": {
      "title": "AIデータエンジニア",
      "description": "AIを支えるデータインフラをマスターする。"
    }
  },
  "chapters": [
    {
      "title": "Module 1: Modern Data Stack and Lakehouse Architecture",
      "description": "Build the foundation: data lakehouse, ELT paradigm, and the modern data stack that powers production AI.",
      "order_index": 0,
      "videos": [
        {
          "title": "1.1 The Data Lakehouse: Delta Lake, Iceberg, and ACID for AI",
          "description": "Why data lakehouses replaced traditional warehouses for AI — ACID, time travel, and petabyte-scale performance.",
          "order_index": 0,
          "lessonScript": {
            "mainPoints": [
              "The data lakehouse emerged to solve the fundamental tension between data lakes (cheap storage, raw formats, poor query performance) and data warehouses (great query performance, expensive, rigid schemas). Delta Lake, Apache Iceberg, and Apache Hudi are open table formats that bring ACID transactions, schema enforcement, and high-performance query execution to object storage. For AI data engineering, this means warehouse-quality reliability at lake-scale economics — you can store petabytes of training data at cents per GB while running analytical queries in seconds.",
              "ACID transactions in the lakehouse prevent training data corruption. Atomicity: a write either fully succeeds or fully fails — no partial commits that leave datasets in inconsistent state. Consistency: schema enforcement catches malformed records at write time. Isolation: multiple ML training jobs reading the same dataset concurrently with ongoing pipeline writes don't corrupt each other. Durability: committed data persists even through system failures. For ML pipelines where bad training data directly degrades model quality, ACID is non-negotiable.",
              "Time travel is the lakehouse capability that transforms ML reproducibility. Every write creates an immutable snapshot — you query any past version with SELECT * FROM table TIMESTAMP AS OF '2024-01-01'. For ML teams: reproduce the exact training dataset used 6 months ago when debugging model drift, audit what data trained a specific model version for compliance, roll back accidental deletions without backup restoration. Delta Lake retains 30 days of history by default; configure VACUUM to balance storage costs with reproducibility requirements.",
              "Parquet file format is the columnar storage foundation of all major lakehouse formats. Key properties: columnar storage (reads only needed columns, not entire rows — 10x faster for analytical queries that read 5 of 100 columns), dictionary encoding (efficient storage of repeated values like categorical features), Bloom filters (probabilistic data structure for fast existence checks), and min/max statistics per row group enabling predicate pushdown. Understanding Parquet is understanding why lakehouses are fast — queries skip entire file groups based on statistics.",
              "The modern data stack for AI typically looks like: Fivetran/Airbyte (ingestion from source systems) → S3/GCS/Azure Blob (raw landing zone, Bronze layer) → dbt + Snowflake/Databricks/BigQuery (transformation, Silver and Gold layers) → Feature Store (Feast/Tecton) → ML Training and Serving. Each layer has clear responsibilities and clean interfaces. Understanding how data flows from source to model training is the AI data engineer's core mental model."
            ]
          },
          "questions": [
            {
              "qt": "What problem does the data lakehouse architecture solve?",
              "ctx": "Choosing a data platform for a team that needs both cheap large-scale storage and reliable ML training data.",
              "opts": [
                "It replaces all databases",
                "Combines cheap object storage economics with warehouse-quality ACID transactions and query performance — solving the binary choice between lakes and warehouses",
                "Eliminates the need for data engineers",
                "Provides free cloud storage"
              ],
              "ans": 1,
              "exp": "The lakehouse eliminates the forced choice: lake (cheap, unreliable, slow queries) or warehouse (expensive, reliable, fast queries). Open table formats bring warehouse capabilities to object storage, enabling both."
            },
            {
              "qt": "What does ACID Isolation guarantee for ML training jobs?",
              "ctx": "Two training jobs simultaneously reading a feature table while a pipeline writes new records.",
              "opts": [
                "Training jobs use less memory",
                "Concurrent reads and writes don't corrupt each other — training jobs see a consistent snapshot regardless of ongoing write operations",
                "Training jobs run faster",
                "Writes are queued indefinitely"
              ],
              "ans": 1,
              "exp": "ACID Isolation ensures each transaction sees a consistent view of data. Training jobs reading a dataset see a snapshot from when their read began, unaffected by concurrent writes — preventing partial reads of inconsistent datasets."
            },
            {
              "qt": "How does time travel enable ML model debugging?",
              "ctx": "A model's performance degraded 3 months ago and you need to find what changed in the training data.",
              "opts": [
                "It speeds up model training",
                "Enables querying historical table states to reproduce exact training datasets from any past point — identifying data changes that caused model degradation",
                "It time-stamps model predictions",
                "It logs training run history"
              ],
              "ans": 1,
              "exp": "Time travel queries historical table snapshots — you can reproduce the exact training dataset from 3 months ago, compare it to today's data, and identify the specific data change that caused model degradation."
            },
            {
              "qt": "What Parquet capability enables queries to skip entire file groups?",
              "ctx": "Optimizing a query that filters 10TB feature table by date range.",
              "opts": [
                "Columnar storage",
                "Min/max statistics and Bloom filters per row group — enabling the query engine to skip file groups that provably don't contain matching rows",
                "Data compression",
                "Dictionary encoding"
              ],
              "ans": 1,
              "exp": "Parquet stores min/max statistics and Bloom filters per row group. A query filtering date > '2024-01-01' skips any row group with max_date < '2024-01-01' — reading only relevant files rather than scanning the full 10TB."
            },
            {
              "qt": "In the modern data stack, what layer does dbt primarily operate in?",
              "ctx": "Understanding data transformation responsibilities for an AI data platform.",
              "opts": [
                "Data ingestion layer",
                "Silver and Gold transformation layers — transforming raw ingested data into clean, business-ready tables and ML-optimized feature tables",
                "Real-time streaming layer",
                "Model serving layer"
              ],
              "ans": 1,
              "exp": "dbt operates on already-ingested raw data, transforming it into clean, tested, documented models. In medallion architecture terms, dbt builds Silver (cleaned) and Gold (business/ML-optimized) tables from Bronze (raw) source data."
            }
          ]
        },
        {
          "title": "1.2 dbt: Production-Grade SQL Transformations for AI Data",
          "description": "Master dbt — the tool that made SQL transformations testable, versioned, and production-grade for ML feature pipelines.",
          "order_index": 1,
          "lessonScript": {
            "mainPoints": [
              "dbt transforms raw data into analysis-ready models using SQL, bringing software engineering best practices to data transformation. The dbt workflow: write SQL SELECT statements (called models), dbt compiles them into CREATE TABLE/VIEW/INCREMENTAL statements, runs them against your warehouse in the correct dependency order, and materializes results. The ref() function creates dependencies between models — dbt automatically builds a DAG and runs parents before children. Every modern data team uses dbt as their SQL transformation layer.",
              "Model materialization in dbt: Views (SQL executes at query time — always current, no storage cost, slow on large datasets), Tables (pre-computed and stored — fast queries, storage cost, must be refreshed), Incremental (processes only new or changed records since last run — the gold standard for large ML feature tables), and Snapshots (slowly changing dimensions — captures row history for point-in-time feature lookups). For a user_feature table processed from billions of events: incremental materialization processes yesterday's new events only, not the full 3-year history every night.",
              "dbt tests are data quality assertions that run automatically in CI/CD. Schema tests (defined in YAML): not_null (no missing values), unique (no duplicates), accepted_values (enum validation), relationships (referential integrity). Custom tests (SQL assertions): 'the count of users with negative spend should be 0', 'daily revenue should never decrease by more than 50%'. For ML training data, dbt tests are the last line of defense against corrupted features reaching model training. Configure tests to fail CI/CD pipelines — bad data must not reach production.",
              "The dbt source() macro declares dependencies on raw data tables and enables freshness checks. source('raw_events', 'clicks') references the raw clicks table from the events source. In dbt YAML configuration: freshness: warn_after: count: 6 hours. error_after: count: 24 hours. Running dbt source freshness alerts when raw data hasn't been updated — the first signal that upstream data pipelines are failing. For ML teams where fresh training data means fresh models, source freshness monitoring is operationally critical.",
              "dbt docs generate automatically from model SQL, YAML descriptions, and test definitions — creating a full data lineage graph from raw source tables through all transformation models to final ML features. Business users, data scientists, and ML engineers can see exactly what each table contains, where it came from, and how it's tested. For AI governance, dbt documentation provides the data provenance trail required by regulations — which raw data sources feed which ML training features."
            ]
          },
          "questions": [
            {
              "qt": "What is the dbt ref() function?",
              "ctx": "Building a feature model that depends on a cleaned user model.",
              "opts": [
                "A reference to external APIs",
                "Creates a compile-time dependency between dbt models — dbt runs referenced models first and uses their results, building an automatic DAG",
                "Imports Python libraries",
                "References cloud storage buckets"
              ],
              "ans": 1,
              "exp": "ref('model_name') establishes model dependencies — dbt builds a DAG, runs models in topological order, and validates all references compile. It's how dbt knows which models to run before others."
            },
            {
              "qt": "What dbt materialization strategy is optimal for a 5TB user feature table refreshed nightly?",
              "ctx": "Reducing nightly dbt transformation runtime from 6 hours to 20 minutes.",
              "opts": [
                "View — recalculated at query time",
                "Incremental — processes only new/changed records since last run, typically 1-5% of the full table",
                "Table — full recompute every run",
                "Snapshot — for historical tracking"
              ],
              "ans": 1,
              "exp": "Incremental models process only records meeting the is_incremental() filter (typically where updated_at > last run timestamp) — for a 5TB table with 50GB of daily new events, incremental processes 50GB instead of 5TB."
            },
            {
              "qt": "Which dbt built-in test would catch duplicate user records in a feature table?",
              "ctx": "Ensuring training data quality for a user behavior model.",
              "opts": [
                "not_null",
                "unique — fails if any column value appears more than once, catching duplicate records that could overweight certain users in model training",
                "accepted_values",
                "relationships"
              ],
              "ans": 1,
              "exp": "The unique test fails if any values in the column appear more than once. Duplicate user_ids in a feature table could cause training data imbalance or incorrect joins with target labels."
            },
            {
              "qt": "What does dbt source freshness monitoring detect?",
              "ctx": "Setting up early warning for data pipeline failures affecting ML features.",
              "opts": [
                "Model compilation errors",
                "Upstream data source staleness — alerts when raw data hasn't been updated within configured thresholds, indicating pipeline failures before they cascade to ML features",
                "dbt version updates",
                "Warehouse capacity issues"
              ],
              "ans": 1,
              "exp": "Source freshness checks timestamp the latest record in source tables. When a data pipeline fails, freshness immediately alerts — catching pipeline failures before stale features corrupt model training or degrade production model predictions."
            },
            {
              "qt": "How does dbt documentation support AI governance?",
              "ctx": "Preparing data provenance documentation for a regulatory audit of ML training data.",
              "opts": [
                "It creates compliance certificates",
                "Provides automated data lineage documentation from raw sources through all transformations to ML features — enabling auditors to trace exactly what data trained each model",
                "It encrypts sensitive data",
                "It creates backup copies of data"
              ],
              "ans": 1,
              "exp": "dbt auto-generates lineage graphs showing exactly how each feature was computed from which raw source tables. This data provenance documentation satisfies regulatory requirements for transparency in AI model training data."
            }
          ]
        },
        {
          "title": "1.3 Apache Airflow: Orchestrating AI Data Pipelines",
          "description": "Master Airflow — the industry standard for orchestrating complex ML data pipelines with dependencies, schedules, and monitoring.",
          "order_index": 2,
          "lessonScript": {
            "mainPoints": [
              "Apache Airflow is the leading open-source platform for orchestrating complex data pipelines as directed acyclic graphs (DAGs). A DAG defines tasks and their dependencies — Task A must complete before Task B starts. For AI data engineering, Airflow orchestrates: raw data ingestion from APIs and databases, dbt transformation runs, feature computation pipelines, model training triggers, and data quality checks. Airflow's UI provides a visual DAG view, task logs, and rerun capabilities — the operational command center for your AI data platform.",
              "DAG design principles for AI pipelines: decompose into granular tasks (prefer 10 small tasks over 1 large one — granularity enables partial retries), use idempotent tasks (running a task twice should produce the same result), handle failure gracefully (upstream task failure should propagate correctly to downstream tasks via depends_on_past and trigger_rule configurations), and use connection objects for credentials (never hardcode API keys in DAG code).",
              "Airflow Operators are the building blocks of tasks. BashOperator (run shell commands), PythonOperator (call Python functions), PostgresOperator (execute SQL), SparkSubmitOperator (submit Spark jobs), KubernetesPodOperator (run arbitrary containers on Kubernetes — the most powerful operator for AI pipelines). KubernetesPodOperator lets you run any containerized task (dbt runs, ML training jobs, custom Python) without Airflow worker dependencies, enabling clean separation of pipeline orchestration from execution environment.",
              "XComs (cross-communication) pass data between Airflow tasks. Task A pushes a value (model training job ID), Task B pulls it (queries training job status). XCom is designed for small metadata, not large datasets — never put DataFrames in XCom. For large data passing between tasks: write intermediate results to S3/GCS and pass the path via XCom. This pattern (path-based communication) is the standard for AI pipelines — Airflow orchestrates the workflow, object storage holds the actual data.",
              "Airflow sensors wait for external conditions before allowing downstream tasks to proceed. S3KeySensor (wait for a specific S3 file to appear), ExternalTaskSensor (wait for a task in another DAG to complete), HttpSensor (poll an API endpoint until it returns success). For AI pipelines: a sensor waits for the nightly data export from the production database before triggering feature computation. Without sensors, pipelines must be scheduled conservatively to allow upstream dependencies to complete — sensors enable tighter, more reliable schedules."
            ]
          },
          "questions": [
            {
              "qt": "What does a DAG represent in Apache Airflow?",
              "ctx": "Explaining Airflow to a new data engineer joining the team.",
              "opts": [
                "A visualization tool",
                "A directed acyclic graph defining tasks and their dependencies — the structure that ensures tasks run in correct order with proper dependency management",
                "A database schema",
                "A machine learning model structure"
              ],
              "ans": 1,
              "exp": "DAGs in Airflow define tasks (units of work) and edges (dependencies between tasks). Airflow's scheduler uses the DAG structure to run tasks in correct topological order, with no circular dependencies."
            },
            {
              "qt": "What Airflow principle requires that running a task twice produces identical results?",
              "ctx": "Designing Airflow tasks for a reliable ML feature pipeline.",
              "opts": [
                "Atomicity",
                "Idempotency — tasks should produce the same result whether run once or multiple times, enabling safe retries without data corruption",
                "Parallelism",
                "Determinism"
              ],
              "ans": 1,
              "exp": "Idempotent tasks can be safely retried after failures without producing duplicates or inconsistencies. For ML pipelines, non-idempotent tasks (like appending to a table without deduplication) create corrupted training data on retry."
            },
            {
              "qt": "What Airflow operator is most powerful for AI pipeline tasks?",
              "ctx": "Running a dbt transformation inside an Airflow DAG without installing dbt on Airflow workers.",
              "opts": [
                "BashOperator",
                "KubernetesPodOperator — runs any containerized task on Kubernetes, enabling arbitrary execution environments without Airflow worker dependencies",
                "PythonOperator",
                "SqlSensor"
              ],
              "ans": 1,
              "exp": "KubernetesPodOperator launches a container on Kubernetes for each task — the dbt container, training container, or custom ML processing container runs with its own environment, dependencies, and resources. This is the most flexible and scalable operator for AI workloads."
            },
            {
              "qt": "What is XCom in Airflow and what is it designed for?",
              "ctx": "Passing the output file path between a training task and an evaluation task.",
              "opts": [
                "Cross-cluster communication",
                "Small metadata passing between tasks (IDs, paths, status flags) — NOT for large datasets which should be passed via S3/GCS paths",
                "Large dataframe transfers",
                "Airflow user authentication"
              ],
              "ans": 1,
              "exp": "XCom (cross-communication) is designed for small metadata — task IDs, file paths, status values. Passing a file path pointing to S3 data is correct XCom usage. Putting a 10GB DataFrame in XCom will crash Airflow's metadata database."
            },
            {
              "qt": "What Airflow component enables pipelines to wait for upstream dependencies before executing?",
              "ctx": "Your feature pipeline sometimes runs before the nightly data export completes.",
              "opts": [
                "TriggerDagRunOperator",
                "Sensors (S3KeySensor, ExternalTaskSensor, HttpSensor) — pause downstream tasks until an external condition is met",
                "Schedule intervals only",
                "Task retry logic"
              ],
              "ans": 1,
              "exp": "Sensors poll for external conditions and block downstream tasks until met. An S3KeySensor waiting for the nightly export file prevents the feature pipeline from running on yesterday's data when today's export is delayed."
            }
          ]
        },
        {
          "title": "1.4 Feature Engineering: From Raw Events to Predictive ML Signals",
          "description": "Feature engineering transforms raw data into predictive ML signals — the highest-ROI skill in applied machine learning.",
          "order_index": 3,
          "lessonScript": {
            "mainPoints": [
              "Feature engineering is the craft of transforming raw data into representations that enable machine learning models to learn patterns effectively. Andrew Ng's observation — that feature engineering is responsible for 80% of practical ML improvement — reflects a fundamental truth: better features outperform better algorithms. A simple logistic regression with great features often outperforms a complex neural network with poor features. The AI data engineer's role is to translate domain knowledge into model-ready signals.",
              "Temporal feature patterns are among the most predictive in business ML applications. Window aggregations: count(events, 7d), sum(revenue, 30d), avg(session_duration, 90d) capture recent behavior. Recency features: hours_since_last_purchase, days_since_last_login. Trend features: revenue_7d / revenue_30d captures short-term vs long-term momentum. Cyclical time encoding: sin(2π×hour/24) and cos(2π×hour/24) correctly encodes that 11pm and 1am are adjacent, not 22 hours apart. For any behavioral prediction (churn, fraud, purchase), temporal features are essential.",
              "High-cardinality categorical encoding requires careful selection. One-hot encoding: works for low cardinality (<50 values), creates sparse binary vectors. Target encoding: replaces categories with mean target value — high signal but risks data leakage without proper cross-validation. Embedding layers: for cardinalities of 1,000+ (product IDs, user IDs), embeddings learn dense representations capturing semantic relationships. Hash encoding: fast, memory-efficient, handles novel categories at inference time. For product recommendation: product embeddings learned jointly with the recommendation model capture purchase similarity.",
              "Data leakage destroys model validity silently. Temporal leakage: training on features computed with future information (90-day rolling features for a 7-day outcome). Label leakage: including features derived from the target variable. Test set contamination: using test data statistics for feature normalization or selection. Prevention toolkit: strict temporal train/test splits (train before date T, evaluate after), feature creation reviewing only information available at prediction time, and sklearn Pipeline objects ensuring all preprocessing fits on training data only.",
              "Feature selection prevents overfitting and reduces training cost. Filter methods: correlation-based (remove features with correlation > 0.95 — they add redundancy, not signal), mutual information scoring (rank features by statistical dependency with target). Wrapper methods: recursive feature elimination (RFE) uses model performance to identify which features to drop. Embedded methods: L1 regularization (Lasso) automatically zeroes out irrelevant features during training. For large feature tables with 500+ columns, feature selection before model training is not optional — it's the difference between a 2-hour and 10-minute training run."
            ]
          },
          "questions": [
            {
              "qt": "Why does feature engineering account for 80% of practical ML improvement?",
              "ctx": "Justifying investment in feature engineering over model architecture tuning.",
              "opts": [
                "Modern GPUs make computation cheap",
                "Better features provide models with pre-computed domain knowledge signals — directly expressing the patterns models struggle to learn from raw data",
                "Feature engineering is faster than training",
                "Companies always say this for marketing reasons"
              ],
              "ans": 1,
              "exp": "Feature engineering encodes domain expertise into model inputs — predicting fraud is easier when you have 'transactions_last_hour' and 'deviation_from_normal_amount' rather than just raw transaction amount and timestamp. Domain knowledge in features provides the highest-signal representations for models."
            },
            {
              "qt": "What is temporal leakage in feature engineering and why is it catastrophic?",
              "ctx": "Reviewing a churn prediction model with unrealistically high validation accuracy.",
              "opts": [
                "Features computed slowly",
                "Using information from after the prediction date to compute features for that prediction — making the model appear to perform well in validation but fail completely in production",
                "Features with missing timestamps",
                "Using historical data for training"
              ],
              "ans": 1,
              "exp": "Temporal leakage uses future information as features for predicting the past — the model learns a pattern that doesn't exist at prediction time. Validation metrics look great because future information 'predicts' the past perfectly, but production performance is dismal."
            },
            {
              "qt": "When should embedding layers be used for categorical features?",
              "ctx": "Encoding product_id (500K unique values) for a recommendation model.",
              "opts": [
                "Never — one-hot encoding is always best",
                "For high-cardinality features (1K+ unique values) where learned dense representations capture semantic relationships between categories",
                "Only for text data",
                "When features have missing values"
              ],
              "ans": 1,
              "exp": "Embedding layers learn dense vector representations for categories — similar products get similar embeddings. For 500K product IDs, one-hot encoding creates 500K sparse dimensions; embeddings represent them in 32-256 dimensions while capturing product similarity."
            },
            {
              "qt": "What sin/cos encoding technique correctly represents hour-of-day as a cyclical feature?",
              "ctx": "Predicting hourly demand patterns where 11pm and 1am should be treated as adjacent.",
              "opts": [
                "Divide hour by 24 for 0-1 range",
                "sin(2π×hour/24) and cos(2π×hour/24) — projects time onto a unit circle so hour 23 and hour 1 are adjacent (close in Euclidean space)",
                "Use hour as integer (0-23)",
                "One-hot encode all 24 hours"
              ],
              "ans": 1,
              "exp": "Integer encoding (0-23) treats hour 0 and hour 23 as 23 units apart when they're actually 1 hour apart cyclically. Sin/cos projection maps time to a circle, correctly representing cyclic proximity for model consumption."
            },
            {
              "qt": "What is recursive feature elimination (RFE) used for?",
              "ctx": "Reducing a 500-feature dataset to the most predictive subset for a credit model.",
              "opts": [
                "Generating new features automatically",
                "Iteratively removing least-important features by training a model and eliminating features with lowest importance scores — finding the minimal feature set with maximum predictive power",
                "Encoding categorical features",
                "Normalizing numerical features"
              ],
              "ans": 1,
              "exp": "RFE trains a model, ranks features by importance, removes the least important, and repeats — identifying the minimum feature set that preserves maximum model performance. Essential for reducing training cost and preventing overfitting with large feature sets."
            }
          ]
        },
        {
          "title": "1.5 Feature Stores: The Infrastructure for Reusable ML Features",
          "description": "Feature stores solve the feature reuse, consistency, and serving challenge. Master Feast, Tecton, and production feature infrastructure.",
          "order_index": 4,
          "lessonScript": {
            "mainPoints": [
              "A feature store is the operational infrastructure that bridges offline feature engineering and online model serving. The core problems it solves: feature reuse across teams (define user_lifetime_value once, use in 20 models), training-serving consistency (identical computation at training and inference time), and online serving (millisecond feature retrieval for real-time inference). Feast is the open-source standard; Tecton and Hopsworks are managed alternatives. Every major tech company (Uber, Airbnb, Twitter, LinkedIn) built their own feature store — now the open-source ecosystem provides this capability to all organizations.",
              "Feature store architecture has two stores with different latency and access patterns. Offline store: historical feature values in data warehouse (Snowflake, BigQuery) or data lake (S3 + Delta Lake) — queried with pandas/Spark for training dataset generation, tolerates minutes of latency, stores years of history at TB/PB scale. Online store: latest feature values in low-latency key-value store (Redis, DynamoDB, Bigtable) — queried during inference for real-time features, requires <10ms p99 latency, stores only current state.",
              "Materialization is the process that keeps online store fresh. A scheduled job (every 1-60 minutes, or event-driven) reads computed features from the offline store and writes them to the online store. Materialization architecture: Feast computes features in batch using Spark/pandas, writes to offline store (Delta Lake/Snowflake), then materializes to online (Redis) on schedule. For real-time features (user activity in last 5 minutes), consider streaming materialization via Kafka → Flink → Redis pipeline rather than batch.",
              "Point-in-time correct training dataset generation is the feature store's most important capability for preventing leakage. When you call feast.get_historical_features(entity_df, features), each entity row has a timestamp, and the feature store returns feature values as they existed at that exact timestamp — not today's values. A user's 30-day purchase count for a past fraud event should reflect purchases in the 30 days before that event, not their entire purchase history. This as-of join is computationally expensive but non-negotiable for model validity.",
              "Feature monitoring catches data quality issues before they degrade model performance. Key metrics: feature freshness (time since last successful materialization), null rate (percentage of null values — spike indicates upstream pipeline failure), distribution drift (KL divergence between current and training-time distributions), and cardinality (new categorical values not in training vocabulary). Set up Feast/Evidently integration to compute these metrics continuously and alert when thresholds are exceeded. Feature monitoring issues caught in 5 minutes save hours of degraded model performance."
            ]
          },
          "questions": [
            {
              "qt": "What is training-serving skew and how do feature stores prevent it?",
              "ctx": "Debugging a model that performs well in offline evaluation but poorly in production.",
              "opts": [
                "A performance issue in model serving",
                "Features computed differently at training vs. inference time — feature stores ensure identical feature computation logic is used for both, eliminating the skew",
                "A model versioning problem",
                "A data format incompatibility"
              ],
              "ans": 1,
              "exp": "Training-serving skew occurs when feature computation logic differs between training (offline batch) and serving (real-time). Feature stores use the same feature definitions for both — one definition, consistent outputs regardless of whether training or serving."
            },
            {
              "qt": "What is the online store in a feature store architecture optimized for?",
              "ctx": "Designing a feature store for a fraud detection model requiring real-time decisions.",
              "opts": [
                "Historical training data storage",
                "Real-time feature retrieval with <10ms p99 latency — Redis/DynamoDB storing current feature values for immediate lookup during inference",
                "Analytical batch processing",
                "Long-term archival storage"
              ],
              "ans": 1,
              "exp": "The online store (Redis/DynamoDB) stores only current feature values, optimized for sub-10ms key-value retrieval during real-time inference. Historical data for training lives in the offline store."
            },
            {
              "qt": "What is materialization in a feature store?",
              "ctx": "Updating online store features to reflect recent user activity.",
              "opts": [
                "Converting model weights to production format",
                "Moving computed features from offline store to online store on a schedule — keeping online features fresh for real-time inference",
                "Training new embedding models",
                "Compressing feature vectors"
              ],
              "ans": 1,
              "exp": "Materialization is the batch or streaming process that copies features from offline (batch-computed, historical) to online (Redis, DynamoDB) storage — ensuring real-time inference uses fresh features without recomputing them at request time."
            },
            {
              "qt": "What is point-in-time correctness in feature store training data generation?",
              "ctx": "Generating training data for a credit risk model using historical loan applications.",
              "opts": [
                "Features computed at the same UTC time daily",
                "Each training example's features reflect values as they existed at the event timestamp — preventing future information from appearing in past event features",
                "Using the same feature version for all training",
                "Normalizing features to the same scale"
              ],
              "ans": 1,
              "exp": "Point-in-time correct joins return feature values as they existed at each event's timestamp — preventing temporal leakage where a past event's features include information from after the event occurred."
            },
            {
              "qt": "What feature monitoring metric indicates an upstream data pipeline failure?",
              "ctx": "Your recommendation model's CTR drops suddenly with no code changes.",
              "opts": [
                "Increased model inference latency",
                "Spike in null rate for key features — upstream pipeline stopped providing values, creating missing features that degrade model predictions",
                "High CPU utilization on feature servers",
                "Model weight file size increase"
              ],
              "ans": 1,
              "exp": "Null rate spikes indicate upstream data sources have stopped providing values to feature computation — the feature pipeline is running but producing empty results. This manifests as missing features in model inputs, degrading predictions before any alert fires on model quality metrics."
            }
          ]
        }
      ],
      "endQuiz": [
        {
          "qt": "What is the medallion architecture in data engineering?",
          "ctx": "Designing a data lakehouse for an AI platform serving both batch training and real-time inference.",
          "opts": [
            "A blockchain-based storage system",
            "Bronze (raw ingestion) → Silver (cleaned/validated) → Gold (business-ready/ML-optimized) layers — progressively refining data quality with clear responsibilities at each tier",
            "A paid enterprise data service",
            "An EU data governance framework"
          ],
          "ans": 1,
          "exp": "Medallion architecture organizes lakehouse data into quality tiers. Bronze holds raw, ingested-as-is data. Silver is cleaned, deduplicated, and schema-validated. Gold is aggregated, joined, and optimized for specific uses (ML features, reporting). Each tier has clear ownership and quality standards."
        },
        {
          "qt": "When would you use Kafka over Airflow for a data pipeline?",
          "ctx": "Building a pipeline that processes user clickstream events within 100ms for real-time personalization.",
          "opts": [
            "For all data pipelines",
            "Kafka for continuous real-time event streaming requiring millisecond latency; Airflow for scheduled batch pipelines with complex task dependencies",
            "Airflow is always better",
            "They are functionally identical"
          ],
          "ans": 1,
          "exp": "Kafka handles continuous event streams with millisecond latency — real-time clickstreams, transactions, sensor data. Airflow orchestrates scheduled batch workflows with complex dependencies — nightly dbt runs, weekly model retraining. AI platforms use both."
        },
        {
          "qt": "What is a data contract and why is it valuable for ML pipelines?",
          "ctx": "A model breaks every time the upstream data team changes their events schema.",
          "opts": [
            "A vendor agreement for data tools",
            "A formal, versioned agreement between data producers and consumers specifying schema, quality guarantees, and SLAs — preventing breaking changes from cascading to ML models",
            "A legal compliance document",
            "A dbt model test file"
          ],
          "ans": 1,
          "exp": "Data contracts formalize the interface between data producers (events team) and consumers (ML team) — producers commit to schema stability, consumers document their requirements. Contracts catch breaking changes before they cause production ML failures."
        },
        {
          "qt": "What is Z-ordering in Delta Lake and how does it optimize ML feature queries?",
          "ctx": "Queries on a 10TB feature table filtering by user_id and event_date take 45 minutes.",
          "opts": [
            "Sorting data alphabetically",
            "Co-locating related data within Parquet files based on filter columns — queries filtering on Z-ordered columns can skip entire file groups, reducing scan from 10TB to <500GB",
            "Compressing Parquet files with Z algorithm",
            "Partitioning data into subdirectories"
          ],
          "ans": 1,
          "exp": "Z-ordering stores rows with similar values in the same Parquet file sections. Queries filtering on Z-ordered columns (user_id, event_date) use min/max statistics to skip files that provably don't match — a 10TB table effectively becomes a 500GB query."
        },
        {
          "qt": "What is a Slowly Changing Dimension (SCD) and when does it matter for ML?",
          "ctx": "Building a churn model that needs to know what pricing plan a user had at the time of each event.",
          "opts": [
            "A dimension that never changes",
            "A table design that captures row history — enabling point-in-time queries of what values existed at any past timestamp, critical for ML training data accuracy",
            "A deprecated database concept",
            "A feature with gradual drift"
          ],
          "ans": 1,
          "exp": "SCDs capture how dimension values change over time with validity timestamps. For ML training data, using a user's current plan to predict past churn labels would be temporal leakage — SCD Type 2 tables provide the correct historical plan value at each training event timestamp."
        }
      ]
    }
  ]
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: ex } = await supabase.from("courses").select("id").eq("title", courseData.title).single();
    if (ex) return new Response(JSON.stringify({ message: "Course already exists", courseId: ex.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: course, error: ce } = await supabase.from("courses").insert({ title: courseData.title, description: courseData.description, is_published: true, translations: courseData.translations }).select().single();
    if (ce) throw ce;
    for (const ch of courseData.chapters) {
      const { data: chapter, error: che } = await supabase.from("chapters").insert({ course_id: course.id, title: ch.title, description: ch.description, order_index: ch.order_index, translations: {} }).select().single();
      if (che) throw che;
      for (const vid of ch.videos) {
        const tr = vid.lessonScript.mainPoints.join("\n\n");
        const trans = {en:{title:vid.title,transcript:tr},es:{title:vid.title,transcript:tr},fr:{title:vid.title,transcript:tr},de:{title:vid.title,transcript:tr},zh:{title:vid.title,transcript:tr},ar:{title:vid.title,transcript:tr},ja:{title:vid.title,transcript:tr}};
        const { data: video, error: ve } = await supabase.from("videos").insert({ chapter_id: chapter.id, title: vid.title, description: vid.description, order_index: vid.order_index, translations: trans }).select().single();
        if (ve) throw ve;
        const { data: quiz, error: qe } = await supabase.from("quizzes").insert({ video_id: video.id, chapter_id: chapter.id, quiz_type: "mini_video", passing_score: 85 }).select().single();
        if (qe) throw qe;
        for (let i = 0; i < vid.questions.length; i++) { const q = vid.questions[i]; await supabase.from("quiz_questions").insert({ quiz_id: quiz.id, question_text: q.qt, scenario_context: q.ctx, options: q.opts, correct_answer_index: q.ans, explanation: q.exp, order_index: i }); }
      }
      const { data: eq, error: eqe } = await supabase.from("quizzes").insert({ chapter_id: chapter.id, quiz_type: "chapter_end", passing_score: 85 }).select().single();
      if (eqe) throw eqe;
      for (let i = 0; i < ch.endQuiz.length; i++) { const q = ch.endQuiz[i]; await supabase.from("quiz_questions").insert({ quiz_id: eq.id, question_text: q.qt, scenario_context: q.ctx, options: q.opts, correct_answer_index: q.ans, explanation: q.exp, order_index: i }); }
    }
    return new Response(JSON.stringify({ message: courseData.title + " created", courseId: course.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
