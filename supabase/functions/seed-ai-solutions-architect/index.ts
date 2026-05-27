import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Solutions Architect",
  "description": "Master enterprise AI architecture — TOGAF, cloud-native AI patterns, microservices, data architecture, security architecture, and the complete capstone of designing a Fortune 500 AI platform. 10 deep modules combining the depth of AWS Solutions Architect Professional with AI-specific production patterns.",
  "translations": {
    "es": {
      "title": "AI Solutions Architect",
      "description": "Master enterprise AI architecture — TOGAF, cloud-native AI patterns, microservices, data architecture, security architecture, and the complete capstone of designing a Fortune 500 AI platform. 10 deep "
    },
    "fr": {
      "title": "AI Solutions Architect",
      "description": "Master enterprise AI architecture — TOGAF, cloud-native AI patterns, microservices, data architecture, security architecture, and the complete capstone of designing a Fortune 500 AI platform. 10 deep "
    },
    "de": {
      "title": "AI Solutions Architect",
      "description": "Master enterprise AI architecture — TOGAF, cloud-native AI patterns, microservices, data architecture, security architecture, and the complete capstone of designing a Fortune 500 AI platform. 10 deep "
    },
    "zh": {
      "title": "AI Solutions Architect",
      "description": "Master enterprise AI architecture — TOGAF, cloud-native AI patterns, microservices, data architecture, security architecture, and the complete capstone of designing a Fortune 500 AI platform. 10 deep "
    },
    "ar": {
      "title": "AI Solutions Architect",
      "description": "Master enterprise AI architecture — TOGAF, cloud-native AI patterns, microservices, data architecture, security architecture, and the complete capstone of designing a Fortune 500 AI platform. 10 deep "
    },
    "ja": {
      "title": "AI Solutions Architect",
      "description": "Master enterprise AI architecture — TOGAF, cloud-native AI patterns, microservices, data architecture, security architecture, and the complete capstone of designing a Fortune 500 AI platform. 10 deep "
    }
  },
  "modules": [
    {
      "title": "Module 1: Enterprise Architecture Foundations — TOGAF, Zachman, and AI Frameworks",
      "desc": "TOGAF ADM applied to AI transformation, Zachman Framework for AI systems, ArchiMate notation, business capability mapping, and translating C-suite AI vision into executable architecture. Case study: McKinsey's enterprise AI transformation methodology and why 70% fail without architectural discipline.",
      "lessons": [
        {
          "title": "Foundations: Enterprise Architecture Foundations — TOGAF, Zachman, and AI Frameworks",
          "desc": "TOGAF ADM applied to AI transformation, Zachman Framework for AI systems, ArchiMate notation, business capability mapping, and translating C-suite AI vision into executable architecture. Case study: McKinsey's enterprise AI transformation methodology and why 70% fail without architectural discipline."
        },
        {
          "title": "Module 1.2 Deep Dive: Zachman Framework for AI systems",
          "desc": "TOGAF ADM applied to AI transformation, Zachman Framework for AI systems, ArchiMate notation, business capability mapping, and translating C-suite AI vision into executable architecture. Case study: M. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: ArchiMate notation",
          "desc": "TOGAF ADM applied to AI transformation, Zachman Framework for AI systems, ArchiMate notation, business capability mapping, and translating C-suite AI vision into executable architecture. Case study: M. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: business capability mapping",
          "desc": "TOGAF ADM applied to AI transformation, Zachman Framework for AI systems, ArchiMate notation, business capability mapping, and translating C-suite AI vision into executable architecture. Case study: M. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: and translating C-suite AI vision into executable architecture. Case study: McKinsey's enterprise AI transformation methodology and why 70% fail without architectural discipline.",
          "desc": "TOGAF ADM applied to AI transformation, Zachman Framework for AI systems, ArchiMate notation, business capability mapping, and translating C-suite AI vision into executable architecture. Case study: M. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: TOGAF ADM applied to AI transformation, Zachman Framework fo",
          "desc": "TOGAF ADM applied to AI transformation, Zachman Framework for AI systems, ArchiMate notation, business capability mapping, and translating C-suite AI vision into executable architecture. Case study: M. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: Enterprise Architecture Foundations — TOGAF, Zachman, and AI Frameworks. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. TOGAF ADM applied to AI transformation, Zachman Framework for AI systems, ArchiMate notation, business capability mapping, and translating C-suite AI "
        }
      ]
    },
    {
      "title": "Module 2: Cloud-Native AI Architecture Patterns",
      "desc": "The 12-factor app for AI systems, event-driven architectures for ML pipelines, CQRS for AI read/write separation, saga pattern for distributed AI workflows, strangler fig for legacy AI migration, and the sidecar pattern for adding AI capabilities to existing services. Case study: Netflix's migration from monolith to AI microservices.",
      "lessons": [
        {
          "title": "Foundations: Cloud-Native AI Architecture Patterns",
          "desc": "The 12-factor app for AI systems, event-driven architectures for ML pipelines, CQRS for AI read/write separation, saga pattern for distributed AI workflows, strangler fig for legacy AI migration, and the sidecar pattern for adding AI capabilities to existing services. Case study: Netflix's migration from monolith to AI microservices."
        },
        {
          "title": "Module 2.2 Deep Dive: event-driven architectures for ML pipelines",
          "desc": "The 12-factor app for AI systems, event-driven architectures for ML pipelines, CQRS for AI read/write separation, saga pattern for distributed AI workflows, strangler fig for legacy AI migration, and . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: CQRS for AI read/write separation",
          "desc": "The 12-factor app for AI systems, event-driven architectures for ML pipelines, CQRS for AI read/write separation, saga pattern for distributed AI workflows, strangler fig for legacy AI migration, and . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: saga pattern for distributed AI workflows",
          "desc": "The 12-factor app for AI systems, event-driven architectures for ML pipelines, CQRS for AI read/write separation, saga pattern for distributed AI workflows, strangler fig for legacy AI migration, and . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: strangler fig for legacy AI migration",
          "desc": "The 12-factor app for AI systems, event-driven architectures for ML pipelines, CQRS for AI read/write separation, saga pattern for distributed AI workflows, strangler fig for legacy AI migration, and . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: and the sidecar pattern for adding AI capabilities to existing services. Case study: Netflix's migration from monolith to AI microservices.",
          "desc": "The 12-factor app for AI systems, event-driven architectures for ML pipelines, CQRS for AI read/write separation, saga pattern for distributed AI workflows, strangler fig for legacy AI migration, and . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Cloud-Native AI Architecture Patterns. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The 12-factor app for AI systems, event-driven architectures for ML pipelines, CQRS for AI read/write separation, saga pattern for distributed AI work"
        }
      ]
    },
    {
      "title": "Module 3: Data Architecture — Lakehouse, Data Mesh, and Real-Time AI",
      "desc": "Delta Lake and Apache Iceberg for AI data lakehouse, data mesh principles (domain ownership, data as product), Microsoft Fabric, Databricks Lakehouse Platform, Apache Kafka for real-time AI feature streams, and the data architecture that prevented Uber's data quality disasters. Case study: Airbnb's complete data platform evolution.",
      "lessons": [
        {
          "title": "Foundations: Data Architecture — Lakehouse, Data Mesh, and Real-Time AI",
          "desc": "Delta Lake and Apache Iceberg for AI data lakehouse, data mesh principles (domain ownership, data as product), Microsoft Fabric, Databricks Lakehouse Platform, Apache Kafka for real-time AI feature streams, and the data architecture that prevented Uber's data quality disasters. Case study: Airbnb's complete data platform evolution."
        },
        {
          "title": "Module 3.2 Deep Dive: data mesh principles (domain ownership",
          "desc": "Delta Lake and Apache Iceberg for AI data lakehouse, data mesh principles (domain ownership, data as product), Microsoft Fabric, Databricks Lakehouse Platform, Apache Kafka for real-time AI feature st. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: data as product)",
          "desc": "Delta Lake and Apache Iceberg for AI data lakehouse, data mesh principles (domain ownership, data as product), Microsoft Fabric, Databricks Lakehouse Platform, Apache Kafka for real-time AI feature st. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: Microsoft Fabric",
          "desc": "Delta Lake and Apache Iceberg for AI data lakehouse, data mesh principles (domain ownership, data as product), Microsoft Fabric, Databricks Lakehouse Platform, Apache Kafka for real-time AI feature st. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: Databricks Lakehouse Platform",
          "desc": "Delta Lake and Apache Iceberg for AI data lakehouse, data mesh principles (domain ownership, data as product), Microsoft Fabric, Databricks Lakehouse Platform, Apache Kafka for real-time AI feature st. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: Apache Kafka for real-time AI feature streams",
          "desc": "Delta Lake and Apache Iceberg for AI data lakehouse, data mesh principles (domain ownership, data as product), Microsoft Fabric, Databricks Lakehouse Platform, Apache Kafka for real-time AI feature st. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Data Architecture — Lakehouse, Data Mesh, and Real-Time AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Delta Lake and Apache Iceberg for AI data lakehouse, data mesh principles (domain ownership, data as product), Microsoft Fabric, Databricks Lakehouse "
        }
      ]
    },
    {
      "title": "Module 4: Microservices Architecture for AI Systems",
      "desc": "Decomposing AI monoliths into services, API gateway patterns for model serving, service mesh with Istio, circuit breaker pattern for ML dependencies, bulkhead isolation for AI components, and the domain-driven design (DDD) approach to AI service boundaries. Case study: How Spotify decomposed their recommendation engine into 47 microservices.",
      "lessons": [
        {
          "title": "Foundations: Microservices Architecture for AI Systems",
          "desc": "Decomposing AI monoliths into services, API gateway patterns for model serving, service mesh with Istio, circuit breaker pattern for ML dependencies, bulkhead isolation for AI components, and the domain-driven design (DDD) approach to AI service boundaries. Case study: How Spotify decomposed their recommendation engine into 47 microservices."
        },
        {
          "title": "Module 4.2 Deep Dive: API gateway patterns for model serving",
          "desc": "Decomposing AI monoliths into services, API gateway patterns for model serving, service mesh with Istio, circuit breaker pattern for ML dependencies, bulkhead isolation for AI components, and the doma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: service mesh with Istio",
          "desc": "Decomposing AI monoliths into services, API gateway patterns for model serving, service mesh with Istio, circuit breaker pattern for ML dependencies, bulkhead isolation for AI components, and the doma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: circuit breaker pattern for ML dependencies",
          "desc": "Decomposing AI monoliths into services, API gateway patterns for model serving, service mesh with Istio, circuit breaker pattern for ML dependencies, bulkhead isolation for AI components, and the doma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: bulkhead isolation for AI components",
          "desc": "Decomposing AI monoliths into services, API gateway patterns for model serving, service mesh with Istio, circuit breaker pattern for ML dependencies, bulkhead isolation for AI components, and the doma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: and the domain-driven design (DDD) approach to AI service boundaries. Case study: How Spotify decomposed their recommendation engine into 47 microservices.",
          "desc": "Decomposing AI monoliths into services, API gateway patterns for model serving, service mesh with Istio, circuit breaker pattern for ML dependencies, bulkhead isolation for AI components, and the doma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Microservices Architecture for AI Systems. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Decomposing AI monoliths into services, API gateway patterns for model serving, service mesh with Istio, circuit breaker pattern for ML dependencies, "
        }
      ]
    },
    {
      "title": "Module 5: Security Architecture for Enterprise AI",
      "desc": "Zero Trust Architecture (NIST SP 800-207) for AI systems, STRIDE threat modeling for ML pipelines, defense-in-depth for AI data flows, compliance architecture patterns (HIPAA, SOC2, PCI-DSS), privacy-by-design for AI, and the security architecture review process. Case study: Capital One's breach and the AI security architecture that would have prevented it.",
      "lessons": [
        {
          "title": "Foundations: Security Architecture for Enterprise AI",
          "desc": "Zero Trust Architecture (NIST SP 800-207) for AI systems, STRIDE threat modeling for ML pipelines, defense-in-depth for AI data flows, compliance architecture patterns (HIPAA, SOC2, PCI-DSS), privacy-by-design for AI, and the security architecture review process. Case study: Capital One's breach and the AI security architecture that would have prevented it."
        },
        {
          "title": "Module 5.2 Deep Dive: STRIDE threat modeling for ML pipelines",
          "desc": "Zero Trust Architecture (NIST SP 800-207) for AI systems, STRIDE threat modeling for ML pipelines, defense-in-depth for AI data flows, compliance architecture patterns (HIPAA, SOC2, PCI-DSS), privacy-. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: defense-in-depth for AI data flows",
          "desc": "Zero Trust Architecture (NIST SP 800-207) for AI systems, STRIDE threat modeling for ML pipelines, defense-in-depth for AI data flows, compliance architecture patterns (HIPAA, SOC2, PCI-DSS), privacy-. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: compliance architecture patterns (HIPAA",
          "desc": "Zero Trust Architecture (NIST SP 800-207) for AI systems, STRIDE threat modeling for ML pipelines, defense-in-depth for AI data flows, compliance architecture patterns (HIPAA, SOC2, PCI-DSS), privacy-. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: SOC2",
          "desc": "Zero Trust Architecture (NIST SP 800-207) for AI systems, STRIDE threat modeling for ML pipelines, defense-in-depth for AI data flows, compliance architecture patterns (HIPAA, SOC2, PCI-DSS), privacy-. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: PCI-DSS)",
          "desc": "Zero Trust Architecture (NIST SP 800-207) for AI systems, STRIDE threat modeling for ML pipelines, defense-in-depth for AI data flows, compliance architecture patterns (HIPAA, SOC2, PCI-DSS), privacy-. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Security Architecture for Enterprise AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Zero Trust Architecture (NIST SP 800-207) for AI systems, STRIDE threat modeling for ML pipelines, defense-in-depth for AI data flows, compliance arch"
        }
      ]
    },
    {
      "title": "Module 6: Scalability and Performance Architecture",
      "desc": "Horizontal scaling patterns for AI inference (stateless serving, load balancing strategies), vertical scaling for training workloads, caching architecture (Redis for feature serving, CDN for model outputs), database sharding for ML metadata at scale, and performance testing AI systems under production load. Case study: TikTok's recommendation serving at 1B users.",
      "lessons": [
        {
          "title": "Foundations: Scalability and Performance Architecture",
          "desc": "Horizontal scaling patterns for AI inference (stateless serving, load balancing strategies), vertical scaling for training workloads, caching architecture (Redis for feature serving, CDN for model outputs), database sharding for ML metadata at scale, and performance testing AI systems under production load. Case study: TikTok's recommendation serving at 1B users."
        },
        {
          "title": "Module 6.2 Deep Dive: load balancing strategies)",
          "desc": "Horizontal scaling patterns for AI inference (stateless serving, load balancing strategies), vertical scaling for training workloads, caching architecture (Redis for feature serving, CDN for model out. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: vertical scaling for training workloads",
          "desc": "Horizontal scaling patterns for AI inference (stateless serving, load balancing strategies), vertical scaling for training workloads, caching architecture (Redis for feature serving, CDN for model out. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: caching architecture (Redis for feature serving",
          "desc": "Horizontal scaling patterns for AI inference (stateless serving, load balancing strategies), vertical scaling for training workloads, caching architecture (Redis for feature serving, CDN for model out. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: CDN for model outputs)",
          "desc": "Horizontal scaling patterns for AI inference (stateless serving, load balancing strategies), vertical scaling for training workloads, caching architecture (Redis for feature serving, CDN for model out. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: database sharding for ML metadata at scale",
          "desc": "Horizontal scaling patterns for AI inference (stateless serving, load balancing strategies), vertical scaling for training workloads, caching architecture (Redis for feature serving, CDN for model out. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Scalability and Performance Architecture. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Horizontal scaling patterns for AI inference (stateless serving, load balancing strategies), vertical scaling for training workloads, caching architec"
        }
      ]
    },
    {
      "title": "Module 7: Cost Architecture and FinOps for AI at Scale",
      "desc": "TCO modeling for AI systems (compute, storage, networking, labor), build vs. buy decision framework, reserved capacity planning for ML workloads, multi-cloud cost arbitrage, FinOps governance structure, and the architectural decisions that achieved 60% cost reduction. Case study: How Cloudflare reduced AI inference cost 96% through architectural optimization.",
      "lessons": [
        {
          "title": "Foundations: Cost Architecture and FinOps for AI at Scale",
          "desc": "TCO modeling for AI systems (compute, storage, networking, labor), build vs. buy decision framework, reserved capacity planning for ML workloads, multi-cloud cost arbitrage, FinOps governance structure, and the architectural decisions that achieved 60% cost reduction. Case study: How Cloudflare reduced AI inference cost 96% through architectural optimization."
        },
        {
          "title": "Module 7.2 Deep Dive: storage",
          "desc": "Case study: How Cloudflare reduced AI inference cost 96% through architectural optimization.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: networking",
          "desc": "TCO modeling for AI systems (compute, storage, networking, labor), build vs. buy decision framework, reserved capacity planning for ML workloads, multi-cloud cost arbitrage, FinOps governance structur. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: labor)",
          "desc": "TCO modeling for AI systems (compute, storage, networking, labor), build vs. buy decision framework, reserved capacity planning for ML workloads, multi-cloud cost arbitrage, FinOps governance structur. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: build vs. buy decision framework",
          "desc": "TCO modeling for AI systems (compute, storage, networking, labor), build vs. buy decision framework, reserved capacity planning for ML workloads, multi-cloud cost arbitrage, FinOps governance structur. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: reserved capacity planning for ML workloads",
          "desc": "TCO modeling for AI systems (compute, storage, networking, labor), build vs. buy decision framework, reserved capacity planning for ML workloads, multi-cloud cost arbitrage, FinOps governance structur. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Cost Architecture and FinOps for AI at Scale. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. TCO modeling for AI systems (compute, storage, networking, labor), build vs. buy decision framework, reserved capacity planning for ML workloads, mult"
        }
      ]
    },
    {
      "title": "Module 8: Integration Architecture — APIs, Events, and Data Contracts",
      "desc": "REST vs. GraphQL vs. gRPC for AI APIs (benchmark comparison), AsyncAPI for event-driven AI integrations, Protocol Buffers and Avro for AI data contracts, API versioning strategies for model-serving APIs, the API gateway as AI service governance layer, and API security patterns. Case study: Stripe's API design principles applied to AI services.",
      "lessons": [
        {
          "title": "Foundations: Integration Architecture — APIs, Events, and Data Contracts",
          "desc": "REST vs. GraphQL vs. gRPC for AI APIs (benchmark comparison), AsyncAPI for event-driven AI integrations, Protocol Buffers and Avro for AI data contracts, API versioning strategies for model-serving APIs, the API gateway as AI service governance layer, and API security patterns. Case study: Stripe's API design principles applied to AI services."
        },
        {
          "title": "Module 8.2 Deep Dive: AsyncAPI for event-driven AI integrations",
          "desc": "REST vs. GraphQL vs. gRPC for AI APIs (benchmark comparison), AsyncAPI for event-driven AI integrations, Protocol Buffers and Avro for AI data contracts, API versioning strategies for model-serving AP. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: Protocol Buffers and Avro for AI data contracts",
          "desc": "REST vs. GraphQL vs. gRPC for AI APIs (benchmark comparison), AsyncAPI for event-driven AI integrations, Protocol Buffers and Avro for AI data contracts, API versioning strategies for model-serving AP. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: API versioning strategies for model-serving APIs",
          "desc": "REST vs. GraphQL vs. gRPC for AI APIs (benchmark comparison), AsyncAPI for event-driven AI integrations, Protocol Buffers and Avro for AI data contracts, API versioning strategies for model-serving AP. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: the API gateway as AI service governance layer",
          "desc": "REST vs. GraphQL vs. gRPC for AI APIs (benchmark comparison), AsyncAPI for event-driven AI integrations, Protocol Buffers and Avro for AI data contracts, API versioning strategies for model-serving AP. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: and API security patterns. Case study: Stripe's API design principles applied to AI services.",
          "desc": "REST vs. GraphQL vs. gRPC for AI APIs (benchmark comparison), AsyncAPI for event-driven AI integrations, Protocol Buffers and Avro for AI data contracts, API versioning strategies for model-serving AP. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Integration Architecture — APIs, Events, and Data Contracts. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. REST vs. GraphQL vs. gRPC for AI APIs (benchmark comparison), AsyncAPI for event-driven AI integrations, Protocol Buffers and Avro for AI data contrac"
        }
      ]
    },
    {
      "title": "Module 9: Resilience, DR, and Chaos Engineering for AI",
      "desc": "Chaos engineering principles (Netflix Chaos Monkey for AI), multi-region active-active architecture for AI serving, RTO/RPO design for ML systems, graceful degradation (serve cached predictions when model is unavailable), circuit breaker implementation for AI dependencies, and GameDay exercises for AI platform teams. Case study: Google's 99.99% SLA architecture.",
      "lessons": [
        {
          "title": "Foundations: Resilience, DR, and Chaos Engineering for AI",
          "desc": "Chaos engineering principles (Netflix Chaos Monkey for AI), multi-region active-active architecture for AI serving, RTO/RPO design for ML systems, graceful degradation (serve cached predictions when model is unavailable), circuit breaker implementation for AI dependencies, and GameDay exercises for AI platform teams. Case study: Google's 99.99% SLA architecture."
        },
        {
          "title": "Module 9.2 Deep Dive: multi-region active-active architecture for AI serving",
          "desc": "Chaos engineering principles (Netflix Chaos Monkey for AI), multi-region active-active architecture for AI serving, RTO/RPO design for ML systems, graceful degradation (serve cached predictions when m. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: RTO/RPO design for ML systems",
          "desc": "Chaos engineering principles (Netflix Chaos Monkey for AI), multi-region active-active architecture for AI serving, RTO/RPO design for ML systems, graceful degradation (serve cached predictions when m. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: graceful degradation (serve cached predictions when model is unavailable)",
          "desc": "Chaos engineering principles (Netflix Chaos Monkey for AI), multi-region active-active architecture for AI serving, RTO/RPO design for ML systems, graceful degradation (serve cached predictions when m. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: circuit breaker implementation for AI dependencies",
          "desc": "Chaos engineering principles (Netflix Chaos Monkey for AI), multi-region active-active architecture for AI serving, RTO/RPO design for ML systems, graceful degradation (serve cached predictions when m. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: and GameDay exercises for AI platform teams. Case study: Google's 99.99% SLA architecture.",
          "desc": "Chaos engineering principles (Netflix Chaos Monkey for AI), multi-region active-active architecture for AI serving, RTO/RPO design for ML systems, graceful degradation (serve cached predictions when m. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Resilience, DR, and Chaos Engineering for AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Chaos engineering principles (Netflix Chaos Monkey for AI), multi-region active-active architecture for AI serving, RTO/RPO design for ML systems, gra"
        }
      ]
    },
    {
      "title": "Module 10: Architecture Governance, ADRs, and Capstone",
      "desc": "Architecture Decision Records (ADRs) with real examples, Architecture Review Board operating model, technical debt quantification for AI systems (SQALE method), architecture metrics (coupling, cohesion, complexity), and the capstone: design a complete greenfield enterprise AI platform for a Fortune 500 financial services company with full documentation.",
      "lessons": [
        {
          "title": "Foundations: Architecture Governance, ADRs, and Capstone",
          "desc": "Architecture Decision Records (ADRs) with real examples, Architecture Review Board operating model, technical debt quantification for AI systems (SQALE method), architecture metrics (coupling, cohesion, complexity), and the capstone: design a complete greenfield enterprise AI platform for a Fortune 500 financial services company with full documentation."
        },
        {
          "title": "Module 10.2 Deep Dive: Architecture Review Board operating model",
          "desc": "Architecture Decision Records (ADRs) with real examples, Architecture Review Board operating model, technical debt quantification for AI systems (SQALE method), architecture metrics (coupling, cohesio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: technical debt quantification for AI systems (SQALE method)",
          "desc": "Architecture Decision Records (ADRs) with real examples, Architecture Review Board operating model, technical debt quantification for AI systems (SQALE method), architecture metrics (coupling, cohesio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: architecture metrics (coupling",
          "desc": "Architecture Decision Records (ADRs) with real examples, Architecture Review Board operating model, technical debt quantification for AI systems (SQALE method), architecture metrics (coupling, cohesio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: cohesion",
          "desc": "Architecture Decision Records (ADRs) with real examples, Architecture Review Board operating model, technical debt quantification for AI systems (SQALE method), architecture metrics (coupling, cohesio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: complexity)",
          "desc": "Architecture Decision Records (ADRs) with real examples, Architecture Review Board operating model, technical debt quantification for AI systems (SQALE method), architecture metrics (coupling, cohesio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Architecture Governance, ADRs, and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Architecture Decision Records (ADRs) with real examples, Architecture Review Board operating model, technical debt quantification for AI systems (SQAL"
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
