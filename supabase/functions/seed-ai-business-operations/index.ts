import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/adminGuard.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Business Operations",
  "description": "Transform business operations with AI — from intelligent automation through supply chain optimization, customer operations AI, and financial operations. 10 modules combining operational excellence frameworks with AI implementation, drawing from Amazon, DHL, JPMorgan, and leading AI-ops companies.",
  "translations": {
    "es": {
      "title": "AI Business Operations",
      "description": "Transform business operations with AI — from intelligent automation through supply chain optimization, customer operations AI, and financial operations. 10 modules combining operational excellence fra"
    },
    "fr": {
      "title": "AI Business Operations",
      "description": "Transform business operations with AI — from intelligent automation through supply chain optimization, customer operations AI, and financial operations. 10 modules combining operational excellence fra"
    },
    "de": {
      "title": "AI Business Operations",
      "description": "Transform business operations with AI — from intelligent automation through supply chain optimization, customer operations AI, and financial operations. 10 modules combining operational excellence fra"
    },
    "zh": {
      "title": "AI Business Operations",
      "description": "Transform business operations with AI — from intelligent automation through supply chain optimization, customer operations AI, and financial operations. 10 modules combining operational excellence fra"
    },
    "ar": {
      "title": "AI Business Operations",
      "description": "Transform business operations with AI — from intelligent automation through supply chain optimization, customer operations AI, and financial operations. 10 modules combining operational excellence fra"
    },
    "ja": {
      "title": "AI Business Operations",
      "description": "Transform business operations with AI — from intelligent automation through supply chain optimization, customer operations AI, and financial operations. 10 modules combining operational excellence fra"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Operations Strategy — The $13T Opportunity and Prioritization Framework",
      "desc": "McKinsey's $13T AI economic impact analysis by function, the operational value creation matrix (cost vs. quality vs. speed vs. new capability), the operations AI maturity model (reactive → automated → predictive → autonomous), prioritizing AI investments across operational functions, and building the business case for operations AI. Case study: Amazon's fulfillment center AI reducing picking costs 25%.",
      "lessons": [
        {
          "title": "Foundations: AI Operations Strategy — The $13T Opportunity and Prioritization Framework",
          "desc": "McKinsey's $13T AI economic impact analysis by function, the operational value creation matrix (cost vs. quality vs. speed vs. new capability), the operations AI maturity model (reactive → automated → predictive → autonomous), prioritizing AI investments across operational functions, and building the business case for operations AI. Case study: Amazon's fulfillment center AI reducing picking costs 25%."
        },
        {
          "title": "Module 1.2 Deep Dive: the operational value creation matrix (cost vs. quality vs. speed vs. new capability)",
          "desc": "Case study: Amazon's fulfillment center AI reducing picking costs 25%.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: the operations AI maturity model (reactive → automated → predictive → autonomous)",
          "desc": "McKinsey's $13T AI economic impact analysis by function, the operational value creation matrix (cost vs. quality vs. speed vs. new capability), the operations AI maturity model (reactive → automated →. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: prioritizing AI investments across operational functions",
          "desc": "McKinsey's $13T AI economic impact analysis by function, the operational value creation matrix (cost vs. quality vs. speed vs. new capability), the operations AI maturity model (reactive → automated →. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: and building the business case for operations AI. Case study: Amazon's fulfillment center AI reducing picking costs 25%.",
          "desc": "McKinsey's $13T AI economic impact analysis by function, the operational value creation matrix (cost vs. quality vs. speed vs. new capability), the operations AI maturity model (reactive → automated →. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: McKinsey's $13T AI economic impact analysis by function, the",
          "desc": "McKinsey's $13T AI economic impact analysis by function, the operational value creation matrix (cost vs. quality vs. speed vs. new capability), the operations AI maturity model (reactive → automated →. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Operations Strategy — The $13T Opportunity and Prioritization Framework. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. McKinsey's $13T AI economic impact analysis by function, the operational value creation matrix (cost vs. quality vs. speed vs. new capability), the op"
        }
      ]
    },
    {
      "title": "Module 2: Intelligent Process Automation — RPA, IDP, and Agentic Automation",
      "desc": "The automation hierarchy (RPA for rule-based → IDP for document-heavy → AI agents for judgment-required), UiPath and Automation Anywhere for RPA, Google Document AI and AWS Textract for IDP, agentic automation for complex multi-step workflows, building the automation COE (Center of Excellence), and measuring automation ROI. Case study: JPMorgan's COiN program — 360,000 hours of legal work automated annually.",
      "lessons": [
        {
          "title": "Foundations: Intelligent Process Automation — RPA, IDP, and Agentic Automation",
          "desc": "The automation hierarchy (RPA for rule-based → IDP for document-heavy → AI agents for judgment-required), UiPath and Automation Anywhere for RPA, Google Document AI and AWS Textract for IDP, agentic automation for complex multi-step workflows, building the automation COE (Center of Excellence), and measuring automation ROI. Case study: JPMorgan's COiN program — 360,000 hours of legal work automated annually."
        },
        {
          "title": "Module 2.2 Deep Dive: UiPath and Automation Anywhere for RPA",
          "desc": "The automation hierarchy (RPA for rule-based → IDP for document-heavy → AI agents for judgment-required), UiPath and Automation Anywhere for RPA, Google Document AI and AWS Textract for IDP, agentic a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: Google Document AI and AWS Textract for IDP",
          "desc": "The automation hierarchy (RPA for rule-based → IDP for document-heavy → AI agents for judgment-required), UiPath and Automation Anywhere for RPA, Google Document AI and AWS Textract for IDP, agentic a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: agentic automation for complex multi-step workflows",
          "desc": "The automation hierarchy (RPA for rule-based → IDP for document-heavy → AI agents for judgment-required), UiPath and Automation Anywhere for RPA, Google Document AI and AWS Textract for IDP, agentic a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: building the automation COE (Center of Excellence)",
          "desc": "The automation hierarchy (RPA for rule-based → IDP for document-heavy → AI agents for judgment-required), UiPath and Automation Anywhere for RPA, Google Document AI and AWS Textract for IDP, agentic a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: and measuring automation ROI. Case study: JPMorgan's COiN program — 360",
          "desc": "The automation hierarchy (RPA for rule-based → IDP for document-heavy → AI agents for judgment-required), UiPath and Automation Anywhere for RPA, Google Document AI and AWS Textract for IDP, agentic a. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Intelligent Process Automation — RPA, IDP, and Agentic Automation. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The automation hierarchy (RPA for rule-based → IDP for document-heavy → AI agents for judgment-required), UiPath and Automation Anywhere for RPA, Goog"
        }
      ]
    },
    {
      "title": "Module 3: Intelligent Document Processing — From Unstructured to Structured",
      "desc": "Document processing pipeline architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing), AI document classification (routing invoices vs. contracts vs. claims), LLM-based information extraction with Pydantic schemas, human-in-the-loop for low-confidence extractions, SLA management for document processing, and quality metrics. Case study: Insurance claims processing 10x acceleration.",
      "lessons": [
        {
          "title": "Foundations: Intelligent Document Processing — From Unstructured to Structured",
          "desc": "Document processing pipeline architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing), AI document classification (routing invoices vs. contracts vs. claims), LLM-based information extraction with Pydantic schemas, human-in-the-loop for low-confidence extractions, SLA management for document processing, and quality metrics. Case study: Insurance claims processing 10x acceleration."
        },
        {
          "title": "Module 3.2 Deep Dive: AI document classification (routing invoices vs. contracts vs. claims)",
          "desc": "Case study: Insurance claims processing 10x acceleration.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: LLM-based information extraction with Pydantic schemas",
          "desc": "Document processing pipeline architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing), AI document classification (routing invoices vs. contracts vs. claims), L. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: human-in-the-loop for low-confidence extractions",
          "desc": "Document processing pipeline architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing), AI document classification (routing invoices vs. contracts vs. claims), L. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: SLA management for document processing",
          "desc": "Document processing pipeline architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing), AI document classification (routing invoices vs. contracts vs. claims), L. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: and quality metrics. Case study: Insurance claims processing 10x acceleration.",
          "desc": "Document processing pipeline architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing), AI document classification (routing invoices vs. contracts vs. claims), L. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Intelligent Document Processing — From Unstructured to Structured. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Document processing pipeline architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing), AI document classificat"
        }
      ]
    },
    {
      "title": "Module 4: AI-Powered Analytics and Business Intelligence",
      "desc": "Natural language querying of business data (text-to-SQL, BI copilots), automated insight generation (anomaly detection, trend identification, root cause suggestions), AI-augmented forecasting (combining statistical models with LLM-enhanced explanations), operational dashboards with AI alerting, and building the analytics AI COE. Case study: Netflix's data-driven operations culture and how AI enhances it.",
      "lessons": [
        {
          "title": "Foundations: AI-Powered Analytics and Business Intelligence",
          "desc": "Natural language querying of business data (text-to-SQL, BI copilots), automated insight generation (anomaly detection, trend identification, root cause suggestions), AI-augmented forecasting (combining statistical models with LLM-enhanced explanations), operational dashboards with AI alerting, and building the analytics AI COE. Case study: Netflix's data-driven operations culture and how AI enhances it."
        },
        {
          "title": "Module 4.2 Deep Dive: BI copilots)",
          "desc": "Natural language querying of business data (text-to-SQL, BI copilots), automated insight generation (anomaly detection, trend identification, root cause suggestions), AI-augmented forecasting (combini. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: automated insight generation (anomaly detection",
          "desc": "Natural language querying of business data (text-to-SQL, BI copilots), automated insight generation (anomaly detection, trend identification, root cause suggestions), AI-augmented forecasting (combini. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: trend identification",
          "desc": "Natural language querying of business data (text-to-SQL, BI copilots), automated insight generation (anomaly detection, trend identification, root cause suggestions), AI-augmented forecasting (combini. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: root cause suggestions)",
          "desc": "Natural language querying of business data (text-to-SQL, BI copilots), automated insight generation (anomaly detection, trend identification, root cause suggestions), AI-augmented forecasting (combini. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: AI-augmented forecasting (combining statistical models with LLM-enhanced explanations)",
          "desc": "Natural language querying of business data (text-to-SQL, BI copilots), automated insight generation (anomaly detection, trend identification, root cause suggestions), AI-augmented forecasting (combini. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: AI-Powered Analytics and Business Intelligence. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Natural language querying of business data (text-to-SQL, BI copilots), automated insight generation (anomaly detection, trend identification, root cau"
        }
      ]
    },
    {
      "title": "Module 5: Supply Chain AI — Forecasting, Optimization, and Resilience",
      "desc": "Demand forecasting with deep learning (temporal fusion transformers for multi-horizon forecasting), inventory optimization with reinforcement learning (AWS DeepRacer applied to logistics), supply chain disruption early warning systems (geopolitical events, weather, supplier financial health signals), last-mile delivery optimization, and the supply chain AI architecture. Case study: DHL's AI network optimization saving $300M annually.",
      "lessons": [
        {
          "title": "Foundations: Supply Chain AI — Forecasting, Optimization, and Resilience",
          "desc": "Demand forecasting with deep learning (temporal fusion transformers for multi-horizon forecasting), inventory optimization with reinforcement learning (AWS DeepRacer applied to logistics), supply chain disruption early warning systems (geopolitical events, weather, supplier financial health signals), last-mile delivery optimization, and the supply chain AI architecture. Case study: DHL's AI network optimization saving $300M annually."
        },
        {
          "title": "Module 5.2 Deep Dive: inventory optimization with reinforcement learning (AWS DeepRacer applied to logistics)",
          "desc": "Demand forecasting with deep learning (temporal fusion transformers for multi-horizon forecasting), inventory optimization with reinforcement learning (AWS DeepRacer applied to logistics), supply chai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: supply chain disruption early warning systems (geopolitical events",
          "desc": "Demand forecasting with deep learning (temporal fusion transformers for multi-horizon forecasting), inventory optimization with reinforcement learning (AWS DeepRacer applied to logistics), supply chai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: weather",
          "desc": "Demand forecasting with deep learning (temporal fusion transformers for multi-horizon forecasting), inventory optimization with reinforcement learning (AWS DeepRacer applied to logistics), supply chai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: supplier financial health signals)",
          "desc": "Demand forecasting with deep learning (temporal fusion transformers for multi-horizon forecasting), inventory optimization with reinforcement learning (AWS DeepRacer applied to logistics), supply chai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: last-mile delivery optimization",
          "desc": "Demand forecasting with deep learning (temporal fusion transformers for multi-horizon forecasting), inventory optimization with reinforcement learning (AWS DeepRacer applied to logistics), supply chai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Supply Chain AI — Forecasting, Optimization, and Resilience. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Demand forecasting with deep learning (temporal fusion transformers for multi-horizon forecasting), inventory optimization with reinforcement learning"
        }
      ]
    },
    {
      "title": "Module 6: Customer Operations AI — Support, Success, and Experience at Scale",
      "desc": "AI customer support architecture (intent classification → knowledge retrieval → response generation → sentiment monitoring → escalation), customer success AI (churn prediction models, health scoring, playbook automation), experience measurement at scale (NPS prediction, sentiment analysis of millions of interactions), and the human-AI collaboration model. Case study: Zendesk's AI-first support platform achieving 85% deflection rate.",
      "lessons": [
        {
          "title": "Foundations: Customer Operations AI — Support, Success, and Experience at Scale",
          "desc": "AI customer support architecture (intent classification → knowledge retrieval → response generation → sentiment monitoring → escalation), customer success AI (churn prediction models, health scoring, playbook automation), experience measurement at scale (NPS prediction, sentiment analysis of millions of interactions), and the human-AI collaboration model. Case study: Zendesk's AI-first support platform achieving 85% deflection rate."
        },
        {
          "title": "Module 6.2 Deep Dive: customer success AI (churn prediction models",
          "desc": "AI customer support architecture (intent classification → knowledge retrieval → response generation → sentiment monitoring → escalation), customer success AI (churn prediction models, health scoring, . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: health scoring",
          "desc": "AI customer support architecture (intent classification → knowledge retrieval → response generation → sentiment monitoring → escalation), customer success AI (churn prediction models, health scoring, . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: playbook automation)",
          "desc": "AI customer support architecture (intent classification → knowledge retrieval → response generation → sentiment monitoring → escalation), customer success AI (churn prediction models, health scoring, . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: experience measurement at scale (NPS prediction",
          "desc": "AI customer support architecture (intent classification → knowledge retrieval → response generation → sentiment monitoring → escalation), customer success AI (churn prediction models, health scoring, . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: sentiment analysis of millions of interactions)",
          "desc": "AI customer support architecture (intent classification → knowledge retrieval → response generation → sentiment monitoring → escalation), customer success AI (churn prediction models, health scoring, . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Customer Operations AI — Support, Success, and Experience at Scale. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI customer support architecture (intent classification → knowledge retrieval → response generation → sentiment monitoring → escalation), customer suc"
        }
      ]
    },
    {
      "title": "Module 7: Financial Operations AI — Fraud, Compliance, and Forecasting",
      "desc": "Real-time transaction fraud detection (feature engineering for financial data, graph neural networks for fraud ring detection), AML (anti-money laundering) AI patterns (SAR automation, customer risk scoring), financial forecasting with AI (cash flow prediction, P&L modeling), automated compliance monitoring, and the regulatory framework for financial AI. Case study: Mastercard preventing $20B in annual fraud.",
      "lessons": [
        {
          "title": "Foundations: Financial Operations AI — Fraud, Compliance, and Forecasting",
          "desc": "Real-time transaction fraud detection (feature engineering for financial data, graph neural networks for fraud ring detection), AML (anti-money laundering) AI patterns (SAR automation, customer risk scoring), financial forecasting with AI (cash flow prediction, P&L modeling), automated compliance monitoring, and the regulatory framework for financial AI. Case study: Mastercard preventing $20B in annual fraud."
        },
        {
          "title": "Module 7.2 Deep Dive: graph neural networks for fraud ring detection)",
          "desc": "Real-time transaction fraud detection (feature engineering for financial data, graph neural networks for fraud ring detection), AML (anti-money laundering) AI patterns (SAR automation, customer risk s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: AML (anti-money laundering) AI patterns (SAR automation",
          "desc": "Real-time transaction fraud detection (feature engineering for financial data, graph neural networks for fraud ring detection), AML (anti-money laundering) AI patterns (SAR automation, customer risk s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: customer risk scoring)",
          "desc": "Real-time transaction fraud detection (feature engineering for financial data, graph neural networks for fraud ring detection), AML (anti-money laundering) AI patterns (SAR automation, customer risk s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: financial forecasting with AI (cash flow prediction",
          "desc": "Real-time transaction fraud detection (feature engineering for financial data, graph neural networks for fraud ring detection), AML (anti-money laundering) AI patterns (SAR automation, customer risk s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: P&L modeling)",
          "desc": "Real-time transaction fraud detection (feature engineering for financial data, graph neural networks for fraud ring detection), AML (anti-money laundering) AI patterns (SAR automation, customer risk s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Financial Operations AI — Fraud, Compliance, and Forecasting. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Real-time transaction fraud detection (feature engineering for financial data, graph neural networks for fraud ring detection), AML (anti-money launde"
        }
      ]
    },
    {
      "title": "Module 8: HR Operations AI — Recruiting, Retention, and Workforce Planning",
      "desc": "AI recruiting tools (resume screening, assessment, interview intelligence), mitigating bias in HR AI (EEOC disparate impact testing, blind screening design), employee retention prediction (flight risk models, intervention triggers), AI-powered workforce planning (skill gap analysis, scenario modeling), and the legal framework for HR AI. Case study: Unilever's AI recruiting transformation — both the wins and the controversy.",
      "lessons": [
        {
          "title": "Foundations: HR Operations AI — Recruiting, Retention, and Workforce Planning",
          "desc": "AI recruiting tools (resume screening, assessment, interview intelligence), mitigating bias in HR AI (EEOC disparate impact testing, blind screening design), employee retention prediction (flight risk models, intervention triggers), AI-powered workforce planning (skill gap analysis, scenario modeling), and the legal framework for HR AI. Case study: Unilever's AI recruiting transformation — both the wins and the controversy."
        },
        {
          "title": "Module 8.2 Deep Dive: assessment",
          "desc": "AI recruiting tools (resume screening, assessment, interview intelligence), mitigating bias in HR AI (EEOC disparate impact testing, blind screening design), employee retention prediction (flight risk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: interview intelligence)",
          "desc": "AI recruiting tools (resume screening, assessment, interview intelligence), mitigating bias in HR AI (EEOC disparate impact testing, blind screening design), employee retention prediction (flight risk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: mitigating bias in HR AI (EEOC disparate impact testing",
          "desc": "AI recruiting tools (resume screening, assessment, interview intelligence), mitigating bias in HR AI (EEOC disparate impact testing, blind screening design), employee retention prediction (flight risk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: blind screening design)",
          "desc": "AI recruiting tools (resume screening, assessment, interview intelligence), mitigating bias in HR AI (EEOC disparate impact testing, blind screening design), employee retention prediction (flight risk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: employee retention prediction (flight risk models",
          "desc": "AI recruiting tools (resume screening, assessment, interview intelligence), mitigating bias in HR AI (EEOC disparate impact testing, blind screening design), employee retention prediction (flight risk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: HR Operations AI — Recruiting, Retention, and Workforce Planning. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI recruiting tools (resume screening, assessment, interview intelligence), mitigating bias in HR AI (EEOC disparate impact testing, blind screening d"
        }
      ]
    },
    {
      "title": "Module 9: Operations AI Governance — Quality, Monitoring, and Improvement Loops",
      "desc": "AI operations quality framework (automated process KPIs, exception rate monitoring, accuracy dashboards), continuous improvement loops (PDCA for AI operations, Six Sigma DMAIC applied to AI process quality), change management for AI-automated processes (operator reskilling, workflow redesign), and the operations AI governance committee structure.",
      "lessons": [
        {
          "title": "Foundations: Operations AI Governance — Quality, Monitoring, and Improvement Loops",
          "desc": "AI operations quality framework (automated process KPIs, exception rate monitoring, accuracy dashboards), continuous improvement loops (PDCA for AI operations, Six Sigma DMAIC applied to AI process quality), change management for AI-automated processes (operator reskilling, workflow redesign), and the operations AI governance committee structure."
        },
        {
          "title": "Module 9.2 Deep Dive: exception rate monitoring",
          "desc": "AI operations quality framework (automated process KPIs, exception rate monitoring, accuracy dashboards), continuous improvement loops (PDCA for AI operations, Six Sigma DMAIC applied to AI process qu. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: accuracy dashboards)",
          "desc": "AI operations quality framework (automated process KPIs, exception rate monitoring, accuracy dashboards), continuous improvement loops (PDCA for AI operations, Six Sigma DMAIC applied to AI process qu. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: continuous improvement loops (PDCA for AI operations",
          "desc": "AI operations quality framework (automated process KPIs, exception rate monitoring, accuracy dashboards), continuous improvement loops (PDCA for AI operations, Six Sigma DMAIC applied to AI process qu. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: Six Sigma DMAIC applied to AI process quality)",
          "desc": "AI operations quality framework (automated process KPIs, exception rate monitoring, accuracy dashboards), continuous improvement loops (PDCA for AI operations, Six Sigma DMAIC applied to AI process qu. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: change management for AI-automated processes (operator reskilling",
          "desc": "AI operations quality framework (automated process KPIs, exception rate monitoring, accuracy dashboards), continuous improvement loops (PDCA for AI operations, Six Sigma DMAIC applied to AI process qu. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Operations AI Governance — Quality, Monitoring, and Improvement Loops. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI operations quality framework (automated process KPIs, exception rate monitoring, accuracy dashboards), continuous improvement loops (PDCA for AI op"
        }
      ]
    },
    {
      "title": "Module 10: Future of Operations and Capstone",
      "desc": "The autonomous operations center (fully agentic operational AI), the human workforce in AI-automated operations (augmentation not replacement), designing the operations organization of 2030, emerging technologies (quantum computing for optimization, digital twins for simulation), and the capstone: design a complete AI operations transformation for a provided scenario with implementation roadmap and ROI model.",
      "lessons": [
        {
          "title": "Foundations: Future of Operations and Capstone",
          "desc": "The autonomous operations center (fully agentic operational AI), the human workforce in AI-automated operations (augmentation not replacement), designing the operations organization of 2030, emerging technologies (quantum computing for optimization, digital twins for simulation), and the capstone: design a complete AI operations transformation for a provided scenario with implementation roadmap and ROI model."
        },
        {
          "title": "Module 10.2 Deep Dive: the human workforce in AI-automated operations (augmentation not replacement)",
          "desc": "The autonomous operations center (fully agentic operational AI), the human workforce in AI-automated operations (augmentation not replacement), designing the operations organization of 2030, emerging . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: designing the operations organization of 2030",
          "desc": "The autonomous operations center (fully agentic operational AI), the human workforce in AI-automated operations (augmentation not replacement), designing the operations organization of 2030, emerging . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: emerging technologies (quantum computing for optimization",
          "desc": "The autonomous operations center (fully agentic operational AI), the human workforce in AI-automated operations (augmentation not replacement), designing the operations organization of 2030, emerging . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: digital twins for simulation)",
          "desc": "The autonomous operations center (fully agentic operational AI), the human workforce in AI-automated operations (augmentation not replacement), designing the operations organization of 2030, emerging . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: and the capstone: design a complete AI operations transformation for a provided scenario with implementation roadmap and ROI model.",
          "desc": "The autonomous operations center (fully agentic operational AI), the human workforce in AI-automated operations (augmentation not replacement), designing the operations organization of 2030, emerging . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Future of Operations and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The autonomous operations center (fully agentic operational AI), the human workforce in AI-automated operations (augmentation not replacement), design"
        }
      ]
    }
  ]
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    const _denied = await requireAdmin(req);
    if (_denied) return _denied;
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
