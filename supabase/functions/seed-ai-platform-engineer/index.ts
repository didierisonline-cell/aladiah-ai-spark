import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Platform Engineer",
  "description": "Build the internal developer platforms that make AI teams 10x more productive. 10 modules covering IDP design, Backstage, self-service GPU provisioning, feature stores, model serving platforms, and the engineering excellence that reduces AI infrastructure friction from weeks to minutes.",
  "translations": {
    "es": {
      "title": "AI Platform Engineer",
      "description": "Build the internal developer platforms that make AI teams 10x more productive. 10 modules covering IDP design, Backstage, self-service GPU provisioning, feature stores, model serving platforms, and th"
    },
    "fr": {
      "title": "AI Platform Engineer",
      "description": "Build the internal developer platforms that make AI teams 10x more productive. 10 modules covering IDP design, Backstage, self-service GPU provisioning, feature stores, model serving platforms, and th"
    },
    "de": {
      "title": "AI Platform Engineer",
      "description": "Build the internal developer platforms that make AI teams 10x more productive. 10 modules covering IDP design, Backstage, self-service GPU provisioning, feature stores, model serving platforms, and th"
    },
    "zh": {
      "title": "AI Platform Engineer",
      "description": "Build the internal developer platforms that make AI teams 10x more productive. 10 modules covering IDP design, Backstage, self-service GPU provisioning, feature stores, model serving platforms, and th"
    },
    "ar": {
      "title": "AI Platform Engineer",
      "description": "Build the internal developer platforms that make AI teams 10x more productive. 10 modules covering IDP design, Backstage, self-service GPU provisioning, feature stores, model serving platforms, and th"
    },
    "ja": {
      "title": "AI Platform Engineer",
      "description": "Build the internal developer platforms that make AI teams 10x more productive. 10 modules covering IDP design, Backstage, self-service GPU provisioning, feature stores, model serving platforms, and th"
    }
  },
  "modules": [
    {
      "title": "Module 1: Platform Engineering Philosophy — IDPs, Paved Roads, and DevEx",
      "desc": "The CNCF Platform Engineering Working Group definition, Internal Developer Platforms as products (not projects), the paved road philosophy vs. golden paths, cognitive load reduction as the primary platform metric, and developer experience measurement (DORA metrics, Space framework, DevEx surveys). Case study: Spotify's Backstage origin — why they built it and what it cost not to.",
      "lessons": [
        {
          "title": "Foundations: Platform Engineering Philosophy — IDPs, Paved Roads, and DevEx",
          "desc": "The CNCF Platform Engineering Working Group definition, Internal Developer Platforms as products (not projects), the paved road philosophy vs. golden paths, cognitive load reduction as the primary platform metric, and developer experience measurement (DORA metrics, Space framework, DevEx surveys). Case study: Spotify's Backstage origin — why they built it and what it cost not to."
        },
        {
          "title": "Module 1.2 Deep Dive: Internal Developer Platforms as products (not projects)",
          "desc": "Case study: Spotify's Backstage origin — why they built it and what it cost not to.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: the paved road philosophy vs. golden paths",
          "desc": "The CNCF Platform Engineering Working Group definition, Internal Developer Platforms as products (not projects), the paved road philosophy vs. golden paths, cognitive load reduction as the primary pla. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: cognitive load reduction as the primary platform metric",
          "desc": "The CNCF Platform Engineering Working Group definition, Internal Developer Platforms as products (not projects), the paved road philosophy vs. golden paths, cognitive load reduction as the primary pla. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: and developer experience measurement (DORA metrics",
          "desc": "The CNCF Platform Engineering Working Group definition, Internal Developer Platforms as products (not projects), the paved road philosophy vs. golden paths, cognitive load reduction as the primary pla. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: Space framework",
          "desc": "The CNCF Platform Engineering Working Group definition, Internal Developer Platforms as products (not projects), the paved road philosophy vs. golden paths, cognitive load reduction as the primary pla. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: Platform Engineering Philosophy — IDPs, Paved Roads, and DevEx. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The CNCF Platform Engineering Working Group definition, Internal Developer Platforms as products (not projects), the paved road philosophy vs. golden "
        }
      ]
    },
    {
      "title": "Module 2: Backstage — Building the Enterprise AI Developer Portal",
      "desc": "Spotify's Backstage architecture (frontend plugin system, backend plugins, catalog infrastructure), Software Catalog for AI assets (models, datasets, pipelines, services), Software Templates for one-click ML service creation (generates Dockerfile, k8s manifests, CI/CD, dashboards), TechDocs for AI documentation, and the 1,200+ community plugins. Building an AI-specific Backstage plugin from scratch.",
      "lessons": [
        {
          "title": "Foundations: Backstage — Building the Enterprise AI Developer Portal",
          "desc": "Spotify's Backstage architecture (frontend plugin system, backend plugins, catalog infrastructure), Software Catalog for AI assets (models, datasets, pipelines, services), Software Templates for one-click ML service creation (generates Dockerfile, k8s manifests, CI/CD, dashboards), TechDocs for AI documentation, and the 1,200+ community plugins. Building an AI-specific Backstage plugin from scratch."
        },
        {
          "title": "Module 2.2 Deep Dive: backend plugins",
          "desc": "Spotify's Backstage architecture (frontend plugin system, backend plugins, catalog infrastructure), Software Catalog for AI assets (models, datasets, pipelines, services), Software Templates for one-c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: catalog infrastructure)",
          "desc": "Spotify's Backstage architecture (frontend plugin system, backend plugins, catalog infrastructure), Software Catalog for AI assets (models, datasets, pipelines, services), Software Templates for one-c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: Software Catalog for AI assets (models",
          "desc": "Spotify's Backstage architecture (frontend plugin system, backend plugins, catalog infrastructure), Software Catalog for AI assets (models, datasets, pipelines, services), Software Templates for one-c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: datasets",
          "desc": "Spotify's Backstage architecture (frontend plugin system, backend plugins, catalog infrastructure), Software Catalog for AI assets (models, datasets, pipelines, services), Software Templates for one-c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: pipelines",
          "desc": "Spotify's Backstage architecture (frontend plugin system, backend plugins, catalog infrastructure), Software Catalog for AI assets (models, datasets, pipelines, services), Software Templates for one-c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Backstage — Building the Enterprise AI Developer Portal. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Spotify's Backstage architecture (frontend plugin system, backend plugins, catalog infrastructure), Software Catalog for AI assets (models, datasets, "
        }
      ]
    },
    {
      "title": "Module 3: Self-Service GPU Infrastructure — From 3 Days to 5 Minutes",
      "desc": "On-demand GPU cluster provisioning architecture (Backstage form → GitOps → Karpenter → GPU node → RayCluster), resource quota enforcement per team namespace, cost attribution with labels (team/project/environment), idle detection and auto-termination (save 70% GPU waste), and the developer experience that makes data scientists productive. Case study: Anthropic's research GPU infrastructure.",
      "lessons": [
        {
          "title": "Foundations: Self-Service GPU Infrastructure — From 3 Days to 5 Minutes",
          "desc": "On-demand GPU cluster provisioning architecture (Backstage form → GitOps → Karpenter → GPU node → RayCluster), resource quota enforcement per team namespace, cost attribution with labels (team/project/environment), idle detection and auto-termination (save 70% GPU waste), and the developer experience that makes data scientists productive. Case study: Anthropic's research GPU infrastructure."
        },
        {
          "title": "Module 3.2 Deep Dive: resource quota enforcement per team namespace",
          "desc": "On-demand GPU cluster provisioning architecture (Backstage form → GitOps → Karpenter → GPU node → RayCluster), resource quota enforcement per team namespace, cost attribution with labels (team/project. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: cost attribution with labels (team/project/environment)",
          "desc": "On-demand GPU cluster provisioning architecture (Backstage form → GitOps → Karpenter → GPU node → RayCluster), resource quota enforcement per team namespace, cost attribution with labels (team/project. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: idle detection and auto-termination (save 70% GPU waste)",
          "desc": "On-demand GPU cluster provisioning architecture (Backstage form → GitOps → Karpenter → GPU node → RayCluster), resource quota enforcement per team namespace, cost attribution with labels (team/project. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: and the developer experience that makes data scientists productive. Case study: Anthropic's research GPU infrastructure.",
          "desc": "On-demand GPU cluster provisioning architecture (Backstage form → GitOps → Karpenter → GPU node → RayCluster), resource quota enforcement per team namespace, cost attribution with labels (team/project. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: On-demand GPU cluster provisioning architecture (Backstage f",
          "desc": "On-demand GPU cluster provisioning architecture (Backstage form → GitOps → Karpenter → GPU node → RayCluster), resource quota enforcement per team namespace, cost attribution with labels (team/project. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Self-Service GPU Infrastructure — From 3 Days to 5 Minutes. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. On-demand GPU cluster provisioning architecture (Backstage form → GitOps → Karpenter → GPU node → RayCluster), resource quota enforcement per team nam"
        }
      ]
    },
    {
      "title": "Module 4: Feature Store Platforms — Feast, Tecton, and Enterprise Patterns",
      "desc": "Feature store architecture fundamentals (offline store for training, online store for serving, materialization jobs), Feast deployment on Kubernetes (registry, offline store with BigQuery/Redshift, online store with Redis), Tecton's managed platform, feature discovery and reuse governance, and the business case: Uber's feature platform prevented months of redundant feature engineering. Case study: LinkedIn's Feathr platform serving 1B+ users.",
      "lessons": [
        {
          "title": "Foundations: Feature Store Platforms — Feast, Tecton, and Enterprise Patterns",
          "desc": "Feature store architecture fundamentals (offline store for training, online store for serving, materialization jobs), Feast deployment on Kubernetes (registry, offline store with BigQuery/Redshift, online store with Redis), Tecton's managed platform, feature discovery and reuse governance, and the business case: Uber's feature platform prevented months of redundant feature engineering. Case study: LinkedIn's Feathr platform serving 1B+ users."
        },
        {
          "title": "Module 4.2 Deep Dive: online store for serving",
          "desc": "Feature store architecture fundamentals (offline store for training, online store for serving, materialization jobs), Feast deployment on Kubernetes (registry, offline store with BigQuery/Redshift, on. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: materialization jobs)",
          "desc": "Feature store architecture fundamentals (offline store for training, online store for serving, materialization jobs), Feast deployment on Kubernetes (registry, offline store with BigQuery/Redshift, on. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: Feast deployment on Kubernetes (registry",
          "desc": "Feature store architecture fundamentals (offline store for training, online store for serving, materialization jobs), Feast deployment on Kubernetes (registry, offline store with BigQuery/Redshift, on. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: offline store with BigQuery/Redshift",
          "desc": "Feature store architecture fundamentals (offline store for training, online store for serving, materialization jobs), Feast deployment on Kubernetes (registry, offline store with BigQuery/Redshift, on. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: online store with Redis)",
          "desc": "Feature store architecture fundamentals (offline store for training, online store for serving, materialization jobs), Feast deployment on Kubernetes (registry, offline store with BigQuery/Redshift, on. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Feature Store Platforms — Feast, Tecton, and Enterprise Patterns. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Feature store architecture fundamentals (offline store for training, online store for serving, materialization jobs), Feast deployment on Kubernetes ("
        }
      ]
    },
    {
      "title": "Module 5: Model Serving Platforms — Triton, BentoML, and KServe",
      "desc": "Triton Inference Server as a multi-model, multi-framework serving platform (model repository, ensemble pipelines, dynamic batching configuration, Prometheus metrics), BentoML for packaging and serving (Bento build, containerization, deployment), KServe (formerly KFServing) on Kubernetes (InferenceService CRD, canary rollout, auto-scaling), and the model serving platform decision matrix.",
      "lessons": [
        {
          "title": "Foundations: Model Serving Platforms — Triton, BentoML, and KServe",
          "desc": "Triton Inference Server as a multi-model, multi-framework serving platform (model repository, ensemble pipelines, dynamic batching configuration, Prometheus metrics), BentoML for packaging and serving (Bento build, containerization, deployment), KServe (formerly KFServing) on Kubernetes (InferenceService CRD, canary rollout, auto-scaling), and the model serving platform decision matrix."
        },
        {
          "title": "Module 5.2 Deep Dive: multi-framework serving platform (model repository",
          "desc": "Triton Inference Server as a multi-model, multi-framework serving platform (model repository, ensemble pipelines, dynamic batching configuration, Prometheus metrics), BentoML for packaging and serving. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: ensemble pipelines",
          "desc": "Triton Inference Server as a multi-model, multi-framework serving platform (model repository, ensemble pipelines, dynamic batching configuration, Prometheus metrics), BentoML for packaging and serving. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: dynamic batching configuration",
          "desc": "Triton Inference Server as a multi-model, multi-framework serving platform (model repository, ensemble pipelines, dynamic batching configuration, Prometheus metrics), BentoML for packaging and serving. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: Prometheus metrics)",
          "desc": "Triton Inference Server as a multi-model, multi-framework serving platform (model repository, ensemble pipelines, dynamic batching configuration, Prometheus metrics), BentoML for packaging and serving. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: BentoML for packaging and serving (Bento build",
          "desc": "Triton Inference Server as a multi-model, multi-framework serving platform (model repository, ensemble pipelines, dynamic batching configuration, Prometheus metrics), BentoML for packaging and serving. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Model Serving Platforms — Triton, BentoML, and KServe. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Triton Inference Server as a multi-model, multi-framework serving platform (model repository, ensemble pipelines, dynamic batching configuration, Prom"
        }
      ]
    },
    {
      "title": "Module 6: MLOps Platform — Orchestration, Tracking, and Registry",
      "desc": "Kubeflow Pipelines vs. Apache Airflow for ML orchestration (when to use each), MLflow server deployment (tracking server, artifact store on S3, MySQL backend), model registry governance (staging workflows, approval processes, lineage), W&B for teams (shared workspaces, reports, artifact sharing), and the integrated MLOps platform that enables Level 2 maturity.",
      "lessons": [
        {
          "title": "Foundations: MLOps Platform — Orchestration, Tracking, and Registry",
          "desc": "Kubeflow Pipelines vs. Apache Airflow for ML orchestration (when to use each), MLflow server deployment (tracking server, artifact store on S3, MySQL backend), model registry governance (staging workflows, approval processes, lineage), W&B for teams (shared workspaces, reports, artifact sharing), and the integrated MLOps platform that enables Level 2 maturity."
        },
        {
          "title": "Module 6.2 Deep Dive: MLflow server deployment (tracking server",
          "desc": "Kubeflow Pipelines vs. Apache Airflow for ML orchestration (when to use each), MLflow server deployment (tracking server, artifact store on S3, MySQL backend), model registry governance (staging workf. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: artifact store on S3",
          "desc": "Kubeflow Pipelines vs. Apache Airflow for ML orchestration (when to use each), MLflow server deployment (tracking server, artifact store on S3, MySQL backend), model registry governance (staging workf. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: MySQL backend)",
          "desc": "Kubeflow Pipelines vs. Apache Airflow for ML orchestration (when to use each), MLflow server deployment (tracking server, artifact store on S3, MySQL backend), model registry governance (staging workf. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: model registry governance (staging workflows",
          "desc": "Kubeflow Pipelines vs. Apache Airflow for ML orchestration (when to use each), MLflow server deployment (tracking server, artifact store on S3, MySQL backend), model registry governance (staging workf. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: approval processes",
          "desc": "Kubeflow Pipelines vs. Apache Airflow for ML orchestration (when to use each), MLflow server deployment (tracking server, artifact store on S3, MySQL backend), model registry governance (staging workf. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: MLOps Platform — Orchestration, Tracking, and Registry. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Kubeflow Pipelines vs. Apache Airflow for ML orchestration (when to use each), MLflow server deployment (tracking server, artifact store on S3, MySQL "
        }
      ]
    },
    {
      "title": "Module 7: Data Platform Engineering — Ingestion, Quality, and Cataloging",
      "desc": "Data ingestion platform deployment (Airbyte on Kubernetes, connector management, schema drift handling), Great Expectations as a data quality platform (checkpoint execution, data docs, Slack alerting), DataHub for data cataloging (metadata ingestion, lineage visualization, search), and the data platform SLA (freshness guarantees for AI feature pipelines). Case study: Airbnb's Dataportal.",
      "lessons": [
        {
          "title": "Foundations: Data Platform Engineering — Ingestion, Quality, and Cataloging",
          "desc": "Data ingestion platform deployment (Airbyte on Kubernetes, connector management, schema drift handling), Great Expectations as a data quality platform (checkpoint execution, data docs, Slack alerting), DataHub for data cataloging (metadata ingestion, lineage visualization, search), and the data platform SLA (freshness guarantees for AI feature pipelines). Case study: Airbnb's Dataportal."
        },
        {
          "title": "Module 7.2 Deep Dive: connector management",
          "desc": "Data ingestion platform deployment (Airbyte on Kubernetes, connector management, schema drift handling), Great Expectations as a data quality platform (checkpoint execution, data docs, Slack alerting). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: schema drift handling)",
          "desc": "Data ingestion platform deployment (Airbyte on Kubernetes, connector management, schema drift handling), Great Expectations as a data quality platform (checkpoint execution, data docs, Slack alerting). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: Great Expectations as a data quality platform (checkpoint execution",
          "desc": "Data ingestion platform deployment (Airbyte on Kubernetes, connector management, schema drift handling), Great Expectations as a data quality platform (checkpoint execution, data docs, Slack alerting). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: data docs",
          "desc": "Data ingestion platform deployment (Airbyte on Kubernetes, connector management, schema drift handling), Great Expectations as a data quality platform (checkpoint execution, data docs, Slack alerting). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: Slack alerting)",
          "desc": "Data ingestion platform deployment (Airbyte on Kubernetes, connector management, schema drift handling), Great Expectations as a data quality platform (checkpoint execution, data docs, Slack alerting). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Data Platform Engineering — Ingestion, Quality, and Cataloging. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Data ingestion platform deployment (Airbyte on Kubernetes, connector management, schema drift handling), Great Expectations as a data quality platform"
        }
      ]
    },
    {
      "title": "Module 8: Observability Platform for AI — The Complete Monitoring Stack",
      "desc": "Deploying kube-prometheus-stack (Prometheus + Grafana + Alertmanager), Grafana Loki for log aggregation (FluentBit DaemonSet, LogQL queries for ML debugging), Grafana Tempo for distributed tracing (OTel Collector configuration, trace sampling), Evidently AI for ML monitoring (drift detection, data quality, model performance), and the unified AI observability dashboard.",
      "lessons": [
        {
          "title": "Foundations: Observability Platform for AI — The Complete Monitoring Stack",
          "desc": "Deploying kube-prometheus-stack (Prometheus + Grafana + Alertmanager), Grafana Loki for log aggregation (FluentBit DaemonSet, LogQL queries for ML debugging), Grafana Tempo for distributed tracing (OTel Collector configuration, trace sampling), Evidently AI for ML monitoring (drift detection, data quality, model performance), and the unified AI observability dashboard."
        },
        {
          "title": "Module 8.2 Deep Dive: Grafana Loki for log aggregation (FluentBit DaemonSet",
          "desc": "Deploying kube-prometheus-stack (Prometheus + Grafana + Alertmanager), Grafana Loki for log aggregation (FluentBit DaemonSet, LogQL queries for ML debugging), Grafana Tempo for distributed tracing (OT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: LogQL queries for ML debugging)",
          "desc": "Deploying kube-prometheus-stack (Prometheus + Grafana + Alertmanager), Grafana Loki for log aggregation (FluentBit DaemonSet, LogQL queries for ML debugging), Grafana Tempo for distributed tracing (OT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: Grafana Tempo for distributed tracing (OTel Collector configuration",
          "desc": "Deploying kube-prometheus-stack (Prometheus + Grafana + Alertmanager), Grafana Loki for log aggregation (FluentBit DaemonSet, LogQL queries for ML debugging), Grafana Tempo for distributed tracing (OT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: trace sampling)",
          "desc": "Deploying kube-prometheus-stack (Prometheus + Grafana + Alertmanager), Grafana Loki for log aggregation (FluentBit DaemonSet, LogQL queries for ML debugging), Grafana Tempo for distributed tracing (OT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: Evidently AI for ML monitoring (drift detection",
          "desc": "Deploying kube-prometheus-stack (Prometheus + Grafana + Alertmanager), Grafana Loki for log aggregation (FluentBit DaemonSet, LogQL queries for ML debugging), Grafana Tempo for distributed tracing (OT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Observability Platform for AI — The Complete Monitoring Stack. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Deploying kube-prometheus-stack (Prometheus + Grafana + Alertmanager), Grafana Loki for log aggregation (FluentBit DaemonSet, LogQL queries for ML deb"
        }
      ]
    },
    {
      "title": "Module 9: Platform Security, RBAC, and Compliance Engineering",
      "desc": "Platform RBAC design (who can do what in the AI platform — data scientists vs. ML engineers vs. administrators), audit logging for all platform operations (every model deployment, every dataset access logged), compliance controls embedded in platform workflows (EU AI Act documentation requirements as CI gates), secret management at platform scale (Vault operator, ESO), and platform supply chain security.",
      "lessons": [
        {
          "title": "Foundations: Platform Security, RBAC, and Compliance Engineering",
          "desc": "Platform RBAC design (who can do what in the AI platform — data scientists vs. ML engineers vs. administrators), audit logging for all platform operations (every model deployment, every dataset access logged), compliance controls embedded in platform workflows (EU AI Act documentation requirements as CI gates), secret management at platform scale (Vault operator, ESO), and platform supply chain security."
        },
        {
          "title": "Module 9.2 Deep Dive: audit logging for all platform operations (every model deployment",
          "desc": "Platform RBAC design (who can do what in the AI platform — data scientists vs. ML engineers vs. administrators), audit logging for all platform operations (every model deployment, every dataset access. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: every dataset access logged)",
          "desc": "Platform RBAC design (who can do what in the AI platform — data scientists vs. ML engineers vs. administrators), audit logging for all platform operations (every model deployment, every dataset access. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: compliance controls embedded in platform workflows (EU AI Act documentation requirements as CI gates)",
          "desc": "Platform RBAC design (who can do what in the AI platform — data scientists vs. ML engineers vs. administrators), audit logging for all platform operations (every model deployment, every dataset access. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: secret management at platform scale (Vault operator",
          "desc": "Platform RBAC design (who can do what in the AI platform — data scientists vs. ML engineers vs. administrators), audit logging for all platform operations (every model deployment, every dataset access. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: ESO)",
          "desc": "Platform RBAC design (who can do what in the AI platform — data scientists vs. ML engineers vs. administrators), audit logging for all platform operations (every model deployment, every dataset access. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Platform Security, RBAC, and Compliance Engineering. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Platform RBAC design (who can do what in the AI platform — data scientists vs. ML engineers vs. administrators), audit logging for all platform operat"
        }
      ]
    },
    {
      "title": "Module 10: Platform Roadmap, Metrics, and the Product Mindset",
      "desc": "Developer experience metrics program (quarterly surveys, Friction Logs, DORA tracking), Self-Service Rate as the primary platform KPI (target >90%), platform as a product (user interviews, roadmap prioritization, release communications), building the platform team (SRE + DevEx + ML Infra), organizational change management, and the capstone: design a complete AI platform for a 500-person ML organization with 3-year roadmap.",
      "lessons": [
        {
          "title": "Foundations: Platform Roadmap, Metrics, and the Product Mindset",
          "desc": "Developer experience metrics program (quarterly surveys, Friction Logs, DORA tracking), Self-Service Rate as the primary platform KPI (target >90%), platform as a product (user interviews, roadmap prioritization, release communications), building the platform team (SRE + DevEx + ML Infra), organizational change management, and the capstone: design a complete AI platform for a 500-person ML organization with 3-year roadmap."
        },
        {
          "title": "Module 10.2 Deep Dive: Friction Logs",
          "desc": "Developer experience metrics program (quarterly surveys, Friction Logs, DORA tracking), Self-Service Rate as the primary platform KPI (target >90%), platform as a product (user interviews, roadmap pri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: DORA tracking)",
          "desc": "Developer experience metrics program (quarterly surveys, Friction Logs, DORA tracking), Self-Service Rate as the primary platform KPI (target >90%), platform as a product (user interviews, roadmap pri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: Self-Service Rate as the primary platform KPI (target >90%)",
          "desc": "Developer experience metrics program (quarterly surveys, Friction Logs, DORA tracking), Self-Service Rate as the primary platform KPI (target >90%), platform as a product (user interviews, roadmap pri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: platform as a product (user interviews",
          "desc": "Developer experience metrics program (quarterly surveys, Friction Logs, DORA tracking), Self-Service Rate as the primary platform KPI (target >90%), platform as a product (user interviews, roadmap pri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: roadmap prioritization",
          "desc": "Developer experience metrics program (quarterly surveys, Friction Logs, DORA tracking), Self-Service Rate as the primary platform KPI (target >90%), platform as a product (user interviews, roadmap pri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Platform Roadmap, Metrics, and the Product Mindset. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Developer experience metrics program (quarterly surveys, Friction Logs, DORA tracking), Self-Service Rate as the primary platform KPI (target >90%), p"
        }
      ]
    }
  ]
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const COURSE_TITLE = courseData.title;
    const { data: ex } = await supabase.from("courses").select("id").eq("title", COURSE_TITLE).maybeSingle();
    if (ex) await supabase.from("courses").delete().eq("id", ex.id);
    const { data: course, error: ce } = await supabase.from("courses").insert({ title: courseData.title, description: courseData.description, is_published: true, translations: courseData.translations }).select().single();
    if (ce) throw ce;
    let chaptersCreated = 0; let videosCreated = 0;
    for (let mi = 0; mi < courseData.modules.length; mi++) {
      const mod = courseData.modules[mi];
      const { data: chapter, error: che } = await supabase.from("chapters").insert({ course_id: course.id, title: mod.title, description: mod.desc, order_index: mi, translations: {} }).select().single();
      if (che) throw che; chaptersCreated++;
      for (let li = 0; li < mod.lessons.length; li++) {
        const les = mod.lessons[li];
        const transcript = les.title + "\n\n" + les.desc + "\n\nThis is a world-class lesson from Aladiah Academy's professional certification program. Prof. Didier teaches this with production depth, real case studies, and implementation guidance. Module context: " + mod.title + ". " + mod.desc;
        const trans = { en:{title:les.title,transcript}, es:{title:les.title,transcript}, fr:{title:les.title,transcript}, de:{title:les.title,transcript}, zh:{title:les.title,transcript}, ar:{title:les.title,transcript}, ja:{title:les.title,transcript} };
        const { data: video, error: ve } = await supabase.from("videos").insert({ chapter_id: chapter.id, title: les.title, description: les.desc, order_index: li, translations: trans }).select().single();
        if (ve) throw ve; videosCreated++;
        const { data: quiz, error: qe } = await supabase.from("quizzes").insert({ video_id: video.id, chapter_id: chapter.id, quiz_type: "mini_video", passing_score: 85 }).select().single();
        if (qe) throw qe;
        await supabase.from("quiz_questions").insert([
          { quiz_id: quiz.id, question_text: "What production expertise does this lesson build?", scenario_context: "Applying this in a professional role.", options: [les.desc.substring(0,120)+"...", "Only theoretical background", "Covered elsewhere", "Optional content"], correct_answer_index: 0, explanation: les.desc, order_index: 0 },
          { quiz_id: quiz.id, question_text: "Which real-world organizations' practices are referenced?", scenario_context: "Grounding knowledge in production reality.", options: ["Leading global organizations — case studies ground every lesson in production reality", "No real organizations referenced", "Only academic examples", "Only startups"], correct_answer_index: 0, explanation: "Every lesson uses production case studies from world-class organizations.", order_index: 1 },
        ]);
      }
      const { data: eq, error: eqe } = await supabase.from("quizzes").insert({ chapter_id: chapter.id, quiz_type: "chapter_end", passing_score: 85 }).select().single();
      if (eqe) throw eqe;
      await supabase.from("quiz_questions").insert([
        { quiz_id: eq.id, question_text: "What expert-level competency does this module develop?", scenario_context: "Module completion assessment.", options: [mod.desc.substring(0,140)+"...", "Only introductory familiarity", "Theoretical knowledge only", "Not career-relevant"], correct_answer_index: 0, explanation: mod.desc, order_index: 0 },
        { quiz_id: eq.id, question_text: "What career level does mastery of this module support?", scenario_context: "Professional development planning.", options: ["Senior professional and leadership roles in the fastest-growing AI specialization globally", "Entry-level only", "Academic roles only", "No direct career value"], correct_answer_index: 0, explanation: "Each module builds expertise directly valued in high-compensation AI professional roles.", order_index: 1 },
      ]);
    }
    return new Response(JSON.stringify({ message: courseData.title + " — 10-module world-class version seeded", courseId: course.id, modules: chaptersCreated, lessons: videosCreated }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
