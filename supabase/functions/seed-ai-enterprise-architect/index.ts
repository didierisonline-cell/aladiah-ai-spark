import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/auth.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Enterprise Architect",
  "description": "Design the enterprise AI architecture that enables organizations to scale AI across every business function. 10 deep modules covering TOGAF for AI, reference architectures, integration patterns, security architecture, technology standards, governance frameworks, and the architectural leadership that drives enterprise AI strategy.",
  "translations": {
    "es": {
      "title": "AI Enterprise Architect",
      "description": "Design the enterprise AI architecture that enables organizations to scale AI across every business function. 10 deep modules covering TOGAF for AI, reference architectures, integration patterns, secur"
    },
    "fr": {
      "title": "AI Enterprise Architect",
      "description": "Design the enterprise AI architecture that enables organizations to scale AI across every business function. 10 deep modules covering TOGAF for AI, reference architectures, integration patterns, secur"
    },
    "de": {
      "title": "AI Enterprise Architect",
      "description": "Design the enterprise AI architecture that enables organizations to scale AI across every business function. 10 deep modules covering TOGAF for AI, reference architectures, integration patterns, secur"
    },
    "zh": {
      "title": "AI Enterprise Architect",
      "description": "Design the enterprise AI architecture that enables organizations to scale AI across every business function. 10 deep modules covering TOGAF for AI, reference architectures, integration patterns, secur"
    },
    "ar": {
      "title": "AI Enterprise Architect",
      "description": "Design the enterprise AI architecture that enables organizations to scale AI across every business function. 10 deep modules covering TOGAF for AI, reference architectures, integration patterns, secur"
    },
    "ja": {
      "title": "AI Enterprise Architect",
      "description": "Design the enterprise AI architecture that enables organizations to scale AI across every business function. 10 deep modules covering TOGAF for AI, reference architectures, integration patterns, secur"
    }
  },
  "modules": [
    {
      "title": "Module 1: Enterprise Architecture for AI — TOGAF, ArchiMate, and AI Frameworks",
      "desc": "TOGAF ADM (Architecture Development Method) applied to AI transformation — Business Architecture layer (AI capabilities map, value streams, business motivation model), Data Architecture layer (AI data landscape, master data for AI, data governance), Application Architecture layer (AI application portfolio, API ecosystem), Technology Architecture layer (AI infrastructure stack). ArchiMate notation for AI. Case study: Global bank's TOGAF-governed AI transformation.",
      "lessons": [
        {
          "title": "Foundations: Enterprise Architecture for AI — TOGAF, ArchiMate, and AI Frameworks",
          "desc": "TOGAF ADM (Architecture Development Method) applied to AI transformation — Business Architecture layer (AI capabilities map, value streams, business motivation model), Data Architecture layer (AI data landscape, master data for AI, data governance), Application Architecture layer (AI application portfolio, API ecosystem), Technology Architecture layer (AI infrastructure stack). ArchiMate notation for AI. Case study: Global bank's TOGAF-governed AI transformation."
        },
        {
          "title": "Module 1.2 Deep Dive: value streams",
          "desc": "Case study: Global bank's TOGAF-governed AI transformation.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: business motivation model)",
          "desc": "TOGAF ADM (Architecture Development Method) applied to AI transformation — Business Architecture layer (AI capabilities map, value streams, business motivation model), Data Architecture layer (AI data. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: Data Architecture layer (AI data landscape",
          "desc": "TOGAF ADM (Architecture Development Method) applied to AI transformation — Business Architecture layer (AI capabilities map, value streams, business motivation model), Data Architecture layer (AI data. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: master data for AI",
          "desc": "TOGAF ADM (Architecture Development Method) applied to AI transformation — Business Architecture layer (AI capabilities map, value streams, business motivation model), Data Architecture layer (AI data. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: data governance)",
          "desc": "TOGAF ADM (Architecture Development Method) applied to AI transformation — Business Architecture layer (AI capabilities map, value streams, business motivation model), Data Architecture layer (AI data. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: Enterprise Architecture for AI — TOGAF, ArchiMate, and AI Frameworks. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. TOGAF ADM (Architecture Development Method) applied to AI transformation — Business Architecture layer (AI capabilities map, value streams, business m"
        }
      ]
    },
    {
      "title": "Module 2: AI Reference Architectures — Cloud, On-Premises, Hybrid, and Edge",
      "desc": "AWS Reference Architecture for Enterprise AI (SageMaker-centric, well-architected for ML), Google Cloud AI reference architecture (Vertex AI, BigQuery ML, Dataflow), Microsoft Azure AI reference architecture (Azure ML, Cognitive Services, OpenAI Service), hybrid cloud AI patterns (training on cloud, inference on-premises), edge AI architecture (inference on IoT devices), and the reference architecture selection framework.",
      "lessons": [
        {
          "title": "Foundations: AI Reference Architectures — Cloud, On-Premises, Hybrid, and Edge",
          "desc": "AWS Reference Architecture for Enterprise AI (SageMaker-centric, well-architected for ML), Google Cloud AI reference architecture (Vertex AI, BigQuery ML, Dataflow), Microsoft Azure AI reference architecture (Azure ML, Cognitive Services, OpenAI Service), hybrid cloud AI patterns (training on cloud, inference on-premises), edge AI architecture (inference on IoT devices), and the reference architecture selection framework."
        },
        {
          "title": "Module 2.2 Deep Dive: well-architected for ML)",
          "desc": "AWS Reference Architecture for Enterprise AI (SageMaker-centric, well-architected for ML), Google Cloud AI reference architecture (Vertex AI, BigQuery ML, Dataflow), Microsoft Azure AI reference archi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: Google Cloud AI reference architecture (Vertex AI",
          "desc": "AWS Reference Architecture for Enterprise AI (SageMaker-centric, well-architected for ML), Google Cloud AI reference architecture (Vertex AI, BigQuery ML, Dataflow), Microsoft Azure AI reference archi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: BigQuery ML",
          "desc": "AWS Reference Architecture for Enterprise AI (SageMaker-centric, well-architected for ML), Google Cloud AI reference architecture (Vertex AI, BigQuery ML, Dataflow), Microsoft Azure AI reference archi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: Dataflow)",
          "desc": "AWS Reference Architecture for Enterprise AI (SageMaker-centric, well-architected for ML), Google Cloud AI reference architecture (Vertex AI, BigQuery ML, Dataflow), Microsoft Azure AI reference archi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: Microsoft Azure AI reference architecture (Azure ML",
          "desc": "AWS Reference Architecture for Enterprise AI (SageMaker-centric, well-architected for ML), Google Cloud AI reference architecture (Vertex AI, BigQuery ML, Dataflow), Microsoft Azure AI reference archi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: AI Reference Architectures — Cloud, On-Premises, Hybrid, and Edge. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AWS Reference Architecture for Enterprise AI (SageMaker-centric, well-architected for ML), Google Cloud AI reference architecture (Vertex AI, BigQuery"
        }
      ]
    },
    {
      "title": "Module 3: Data Architecture for Enterprise AI — MDM, Governance, and Quality at Scale",
      "desc": "Master Data Management (MDM) for AI systems (how poor master data corrupts AI), the data architecture pattern evolution (ODS → EDW → Data Lake → Data Lakehouse → Data Mesh), data governance at enterprise scale (data stewardship, data catalog, data quality SLAs), petabyte-scale data quality management, and the Chief Data Officer as architecture partner. Case study: Walmart's petabyte data governance for retail AI.",
      "lessons": [
        {
          "title": "Foundations: Data Architecture for Enterprise AI — MDM, Governance, and Quality at Scale",
          "desc": "Master Data Management (MDM) for AI systems (how poor master data corrupts AI), the data architecture pattern evolution (ODS → EDW → Data Lake → Data Lakehouse → Data Mesh), data governance at enterprise scale (data stewardship, data catalog, data quality SLAs), petabyte-scale data quality management, and the Chief Data Officer as architecture partner. Case study: Walmart's petabyte data governance for retail AI."
        },
        {
          "title": "Module 3.2 Deep Dive: the data architecture pattern evolution (ODS → EDW → Data Lake → Data Lakehouse → Data Mesh)",
          "desc": "Master Data Management (MDM) for AI systems (how poor master data corrupts AI), the data architecture pattern evolution (ODS → EDW → Data Lake → Data Lakehouse → Data Mesh), data governance at enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: data governance at enterprise scale (data stewardship",
          "desc": "Master Data Management (MDM) for AI systems (how poor master data corrupts AI), the data architecture pattern evolution (ODS → EDW → Data Lake → Data Lakehouse → Data Mesh), data governance at enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: data catalog",
          "desc": "Master Data Management (MDM) for AI systems (how poor master data corrupts AI), the data architecture pattern evolution (ODS → EDW → Data Lake → Data Lakehouse → Data Mesh), data governance at enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: data quality SLAs)",
          "desc": "Master Data Management (MDM) for AI systems (how poor master data corrupts AI), the data architecture pattern evolution (ODS → EDW → Data Lake → Data Lakehouse → Data Mesh), data governance at enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: petabyte-scale data quality management",
          "desc": "Master Data Management (MDM) for AI systems (how poor master data corrupts AI), the data architecture pattern evolution (ODS → EDW → Data Lake → Data Lakehouse → Data Mesh), data governance at enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Data Architecture for Enterprise AI — MDM, Governance, and Quality at Scale. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Master Data Management (MDM) for AI systems (how poor master data corrupts AI), the data architecture pattern evolution (ODS → EDW → Data Lake → Data "
        }
      ]
    },
    {
      "title": "Module 4: Integration Architecture — API-Led Connectivity and Event-Driven AI",
      "desc": "MuleSoft API-led connectivity (system layer, process layer, experience layer) applied to AI services, Apigee for AI API management (rate limiting, monetization, analytics), Apache Kafka as the enterprise AI data backbone (event sourcing for ML feature generation, exactly-once semantics for training data integrity), iPaaS platforms (Boomi, Workato) for AI workflow integration, and the integration governance model.",
      "lessons": [
        {
          "title": "Foundations: Integration Architecture — API-Led Connectivity and Event-Driven AI",
          "desc": "MuleSoft API-led connectivity (system layer, process layer, experience layer) applied to AI services, Apigee for AI API management (rate limiting, monetization, analytics), Apache Kafka as the enterprise AI data backbone (event sourcing for ML feature generation, exactly-once semantics for training data integrity), iPaaS platforms (Boomi, Workato) for AI workflow integration, and the integration governance model."
        },
        {
          "title": "Module 4.2 Deep Dive: process layer",
          "desc": "MuleSoft API-led connectivity (system layer, process layer, experience layer) applied to AI services, Apigee for AI API management (rate limiting, monetization, analytics), Apache Kafka as the enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: experience layer) applied to AI services",
          "desc": "MuleSoft API-led connectivity (system layer, process layer, experience layer) applied to AI services, Apigee for AI API management (rate limiting, monetization, analytics), Apache Kafka as the enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: Apigee for AI API management (rate limiting",
          "desc": "MuleSoft API-led connectivity (system layer, process layer, experience layer) applied to AI services, Apigee for AI API management (rate limiting, monetization, analytics), Apache Kafka as the enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: monetization",
          "desc": "MuleSoft API-led connectivity (system layer, process layer, experience layer) applied to AI services, Apigee for AI API management (rate limiting, monetization, analytics), Apache Kafka as the enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: analytics)",
          "desc": "MuleSoft API-led connectivity (system layer, process layer, experience layer) applied to AI services, Apigee for AI API management (rate limiting, monetization, analytics), Apache Kafka as the enterpr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Integration Architecture — API-Led Connectivity and Event-Driven AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. MuleSoft API-led connectivity (system layer, process layer, experience layer) applied to AI services, Apigee for AI API management (rate limiting, mon"
        }
      ]
    },
    {
      "title": "Module 5: Security Architecture for Enterprise AI at Scale",
      "desc": "SABSA (Sherwood Applied Business Security Architecture) for AI systems, the CIA triad for AI (Confidentiality of training data, Integrity of model outputs, Availability of AI services), Zero Trust architecture at enterprise scale (BeyondCorp model for AI access), the security architecture review process for AI systems, penetration testing for AI systems, and the security architecture patterns that satisfy EU AI Act Article 15.",
      "lessons": [
        {
          "title": "Foundations: Security Architecture for Enterprise AI at Scale",
          "desc": "SABSA (Sherwood Applied Business Security Architecture) for AI systems, the CIA triad for AI (Confidentiality of training data, Integrity of model outputs, Availability of AI services), Zero Trust architecture at enterprise scale (BeyondCorp model for AI access), the security architecture review process for AI systems, penetration testing for AI systems, and the security architecture patterns that satisfy EU AI Act Article 15."
        },
        {
          "title": "Module 5.2 Deep Dive: the CIA triad for AI (Confidentiality of training data",
          "desc": "SABSA (Sherwood Applied Business Security Architecture) for AI systems, the CIA triad for AI (Confidentiality of training data, Integrity of model outputs, Availability of AI services), Zero Trust arc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: Integrity of model outputs",
          "desc": "SABSA (Sherwood Applied Business Security Architecture) for AI systems, the CIA triad for AI (Confidentiality of training data, Integrity of model outputs, Availability of AI services), Zero Trust arc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: Availability of AI services)",
          "desc": "SABSA (Sherwood Applied Business Security Architecture) for AI systems, the CIA triad for AI (Confidentiality of training data, Integrity of model outputs, Availability of AI services), Zero Trust arc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: Zero Trust architecture at enterprise scale (BeyondCorp model for AI access)",
          "desc": "SABSA (Sherwood Applied Business Security Architecture) for AI systems, the CIA triad for AI (Confidentiality of training data, Integrity of model outputs, Availability of AI services), Zero Trust arc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: the security architecture review process for AI systems",
          "desc": "SABSA (Sherwood Applied Business Security Architecture) for AI systems, the CIA triad for AI (Confidentiality of training data, Integrity of model outputs, Availability of AI services), Zero Trust arc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Security Architecture for Enterprise AI at Scale. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. SABSA (Sherwood Applied Business Security Architecture) for AI systems, the CIA triad for AI (Confidentiality of training data, Integrity of model out"
        }
      ]
    },
    {
      "title": "Module 6: Cloud Architecture Strategy — Multi-Cloud, Hybrid, and FinOps at Scale",
      "desc": "Enterprise cloud strategy for AI (when single-cloud depth beats multi-cloud flexibility), the FinOps maturity model applied to enterprise AI (Inform → Optimize → Operate at Fortune 500 scale), cloud governance structures (AWS Landing Zone, GCP Organization, Azure Management Groups), edge AI architecture for IoT use cases, and multi-cloud AI for regulatory data residency. Case study: A global bank's multi-cloud AI strategy for GDPR compliance.",
      "lessons": [
        {
          "title": "Foundations: Cloud Architecture Strategy — Multi-Cloud, Hybrid, and FinOps at Scale",
          "desc": "Enterprise cloud strategy for AI (when single-cloud depth beats multi-cloud flexibility), the FinOps maturity model applied to enterprise AI (Inform → Optimize → Operate at Fortune 500 scale), cloud governance structures (AWS Landing Zone, GCP Organization, Azure Management Groups), edge AI architecture for IoT use cases, and multi-cloud AI for regulatory data residency. Case study: A global bank's multi-cloud AI strategy for GDPR compliance."
        },
        {
          "title": "Module 6.2 Deep Dive: the FinOps maturity model applied to enterprise AI (Inform → Optimize → Operate at Fortune 500 scale)",
          "desc": "Enterprise cloud strategy for AI (when single-cloud depth beats multi-cloud flexibility), the FinOps maturity model applied to enterprise AI (Inform → Optimize → Operate at Fortune 500 scale), cloud g. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: cloud governance structures (AWS Landing Zone",
          "desc": "Enterprise cloud strategy for AI (when single-cloud depth beats multi-cloud flexibility), the FinOps maturity model applied to enterprise AI (Inform → Optimize → Operate at Fortune 500 scale), cloud g. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: GCP Organization",
          "desc": "Enterprise cloud strategy for AI (when single-cloud depth beats multi-cloud flexibility), the FinOps maturity model applied to enterprise AI (Inform → Optimize → Operate at Fortune 500 scale), cloud g. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: Azure Management Groups)",
          "desc": "Enterprise cloud strategy for AI (when single-cloud depth beats multi-cloud flexibility), the FinOps maturity model applied to enterprise AI (Inform → Optimize → Operate at Fortune 500 scale), cloud g. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: edge AI architecture for IoT use cases",
          "desc": "Enterprise cloud strategy for AI (when single-cloud depth beats multi-cloud flexibility), the FinOps maturity model applied to enterprise AI (Inform → Optimize → Operate at Fortune 500 scale), cloud g. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Cloud Architecture Strategy — Multi-Cloud, Hybrid, and FinOps at Scale. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Enterprise cloud strategy for AI (when single-cloud depth beats multi-cloud flexibility), the FinOps maturity model applied to enterprise AI (Inform →"
        }
      ]
    },
    {
      "title": "Module 7: AI Technology Standards and Governance",
      "desc": "Building the enterprise AI technology radar (ThoughtWorks methodology: Adopt → Trial → Assess → Hold), the technology stack governance process (endorsed technologies vs. permitted vs. restricted vs. prohibited), vendor management for AI platforms (evaluation criteria, exit strategy planning), technology lifecycle management for AI components, and the architecture community of practice for AI standards. Template: Enterprise AI technology standards document.",
      "lessons": [
        {
          "title": "Foundations: AI Technology Standards and Governance",
          "desc": "Building the enterprise AI technology radar (ThoughtWorks methodology: Adopt → Trial → Assess → Hold), the technology stack governance process (endorsed technologies vs. permitted vs. restricted vs. prohibited), vendor management for AI platforms (evaluation criteria, exit strategy planning), technology lifecycle management for AI components, and the architecture community of practice for AI standards. Template: Enterprise AI technology standards document."
        },
        {
          "title": "Module 7.2 Deep Dive: the technology stack governance process (endorsed technologies vs. permitted vs. restricted vs. prohibited)",
          "desc": "Template: Enterprise AI technology standards document.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: vendor management for AI platforms (evaluation criteria",
          "desc": "Building the enterprise AI technology radar (ThoughtWorks methodology: Adopt → Trial → Assess → Hold), the technology stack governance process (endorsed technologies vs. permitted vs. restricted vs. p. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: exit strategy planning)",
          "desc": "Building the enterprise AI technology radar (ThoughtWorks methodology: Adopt → Trial → Assess → Hold), the technology stack governance process (endorsed technologies vs. permitted vs. restricted vs. p. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: technology lifecycle management for AI components",
          "desc": "Building the enterprise AI technology radar (ThoughtWorks methodology: Adopt → Trial → Assess → Hold), the technology stack governance process (endorsed technologies vs. permitted vs. restricted vs. p. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: and the architecture community of practice for AI standards. Template: Enterprise AI technology standards document.",
          "desc": "Building the enterprise AI technology radar (ThoughtWorks methodology: Adopt → Trial → Assess → Hold), the technology stack governance process (endorsed technologies vs. permitted vs. restricted vs. p. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: AI Technology Standards and Governance. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Building the enterprise AI technology radar (ThoughtWorks methodology: Adopt → Trial → Assess → Hold), the technology stack governance process (endors"
        }
      ]
    },
    {
      "title": "Module 8: AI Architecture Review Board — Process, Governance, and ADRs",
      "desc": "Architecture Review Board (ARB) for AI — composition (enterprise architect, security architect, data architect, business representative), the AI architecture review criteria (scalability, security, data governance, responsible AI, cost), Architecture Decision Records (ADRs) at enterprise scale (lightweight templates that get used vs. heavyweight templates that get ignored), managing the tension between architecture standards and delivery speed.",
      "lessons": [
        {
          "title": "Foundations: AI Architecture Review Board — Process, Governance, and ADRs",
          "desc": "Architecture Review Board (ARB) for AI — composition (enterprise architect, security architect, data architect, business representative), the AI architecture review criteria (scalability, security, data governance, responsible AI, cost), Architecture Decision Records (ADRs) at enterprise scale (lightweight templates that get used vs. heavyweight templates that get ignored), managing the tension between architecture standards and delivery speed."
        },
        {
          "title": "Module 8.2 Deep Dive: security architect",
          "desc": "Architecture Review Board (ARB) for AI — composition (enterprise architect, security architect, data architect, business representative), the AI architecture review criteria (scalability, security, da. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: data architect",
          "desc": "Architecture Review Board (ARB) for AI — composition (enterprise architect, security architect, data architect, business representative), the AI architecture review criteria (scalability, security, da. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: business representative)",
          "desc": "Architecture Review Board (ARB) for AI — composition (enterprise architect, security architect, data architect, business representative), the AI architecture review criteria (scalability, security, da. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: the AI architecture review criteria (scalability",
          "desc": "Architecture Review Board (ARB) for AI — composition (enterprise architect, security architect, data architect, business representative), the AI architecture review criteria (scalability, security, da. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: security",
          "desc": "Architecture Review Board (ARB) for AI — composition (enterprise architect, security architect, data architect, business representative), the AI architecture review criteria (scalability, security, da. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: AI Architecture Review Board — Process, Governance, and ADRs. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Architecture Review Board (ARB) for AI — composition (enterprise architect, security architect, data architect, business representative), the AI archi"
        }
      ]
    },
    {
      "title": "Module 9: Emerging Technology Evaluation for Enterprise Architects",
      "desc": "Enterprise evaluation framework for emerging AI technologies (lab → PoC → pilot → production), evaluating foundation models for enterprise adoption (build vs. fine-tune vs. RAG vs. prompt engineering decision tree), agentic AI risk assessment for enterprise architecture, quantum computing implications for AI security (post-quantum cryptography for AI systems), and the architecture radar process for emerging AI technologies.",
      "lessons": [
        {
          "title": "Foundations: Emerging Technology Evaluation for Enterprise Architects",
          "desc": "Enterprise evaluation framework for emerging AI technologies (lab → PoC → pilot → production), evaluating foundation models for enterprise adoption (build vs. fine-tune vs. RAG vs. prompt engineering decision tree), agentic AI risk assessment for enterprise architecture, quantum computing implications for AI security (post-quantum cryptography for AI systems), and the architecture radar process for emerging AI technologies."
        },
        {
          "title": "Module 9.2 Deep Dive: evaluating foundation models for enterprise adoption (build vs. fine-tune vs. RAG vs. prompt engineering decision tree)",
          "desc": "Enterprise evaluation framework for emerging AI technologies (lab → PoC → pilot → production), evaluating foundation models for enterprise adoption (build vs. fine-tune vs. RAG vs. prompt engineering . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: agentic AI risk assessment for enterprise architecture",
          "desc": "Enterprise evaluation framework for emerging AI technologies (lab → PoC → pilot → production), evaluating foundation models for enterprise adoption (build vs. fine-tune vs. RAG vs. prompt engineering . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: quantum computing implications for AI security (post-quantum cryptography for AI systems)",
          "desc": "Enterprise evaluation framework for emerging AI technologies (lab → PoC → pilot → production), evaluating foundation models for enterprise adoption (build vs. fine-tune vs. RAG vs. prompt engineering . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: and the architecture radar process for emerging AI technologies.",
          "desc": "Enterprise evaluation framework for emerging AI technologies (lab → PoC → pilot → production), evaluating foundation models for enterprise adoption (build vs. fine-tune vs. RAG vs. prompt engineering . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: Enterprise evaluation framework for emerging AI technologies",
          "desc": "Enterprise evaluation framework for emerging AI technologies (lab → PoC → pilot → production), evaluating foundation models for enterprise adoption (build vs. fine-tune vs. RAG vs. prompt engineering . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Emerging Technology Evaluation for Enterprise Architects. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Enterprise evaluation framework for emerging AI technologies (lab → PoC → pilot → production), evaluating foundation models for enterprise adoption (b"
        }
      ]
    },
    {
      "title": "Module 10: Architecture Leadership and Capstone",
      "desc": "The EA career path (Solutions Architect → Enterprise Architect → Principal Architect → Chief Architect — $200K-$400K range), influencing AI strategy without direct authority, building the enterprise architecture practice, EA value demonstration (how to prove EA saves more than it costs), and the capstone: develop a complete enterprise AI architecture for a Fortune 500 company — business architecture, data architecture, application architecture, technology architecture, security architecture, and governance model.",
      "lessons": [
        {
          "title": "Foundations: Architecture Leadership and Capstone",
          "desc": "The EA career path (Solutions Architect → Enterprise Architect → Principal Architect → Chief Architect — $200K-$400K range), influencing AI strategy without direct authority, building the enterprise architecture practice, EA value demonstration (how to prove EA saves more than it costs), and the capstone: develop a complete enterprise AI architecture for a Fortune 500 company — business architecture, data architecture, application architecture, technology architecture, security architecture, and governance model."
        },
        {
          "title": "Module 10.2 Deep Dive: influencing AI strategy without direct authority",
          "desc": "The EA career path (Solutions Architect → Enterprise Architect → Principal Architect → Chief Architect — $200K-$400K range), influencing AI strategy without direct authority, building the enterprise a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: building the enterprise architecture practice",
          "desc": "The EA career path (Solutions Architect → Enterprise Architect → Principal Architect → Chief Architect — $200K-$400K range), influencing AI strategy without direct authority, building the enterprise a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: EA value demonstration (how to prove EA saves more than it costs)",
          "desc": "The EA career path (Solutions Architect → Enterprise Architect → Principal Architect → Chief Architect — $200K-$400K range), influencing AI strategy without direct authority, building the enterprise a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: and the capstone: develop a complete enterprise AI architecture for a Fortune 500 company — business architecture",
          "desc": "The EA career path (Solutions Architect → Enterprise Architect → Principal Architect → Chief Architect — $200K-$400K range), influencing AI strategy without direct authority, building the enterprise a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: data architecture",
          "desc": "The EA career path (Solutions Architect → Enterprise Architect → Principal Architect → Chief Architect — $200K-$400K range), influencing AI strategy without direct authority, building the enterprise a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Architecture Leadership and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The EA career path (Solutions Architect → Enterprise Architect → Principal Architect → Chief Architect — $200K-$400K range), influencing AI strategy w"
        }
      ]
    }
  ]
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    // SECURITY: founder/admin only — this seeder writes content with the service role.
    const __adminCheck = await requireAdmin(req);
    if (__adminCheck instanceof Response) return __adminCheck;
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
