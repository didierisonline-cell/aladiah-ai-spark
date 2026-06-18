import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/auth.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Workflow Designer",
  "description": "Design and implement AI-powered workflows that transform how work gets done. 10 modules covering process mining, no-code and low-code AI tools, integration architecture, agentic workflows, governance, and systematic AI workflow transformation methodology.",
  "translations": {
    "es": {
      "title": "AI Workflow Designer",
      "description": "Design and implement AI-powered workflows that transform how work gets done. 10 modules covering process mining, no-code and low-code AI tools, integration architecture, agentic workflows, governance,"
    },
    "fr": {
      "title": "AI Workflow Designer",
      "description": "Design and implement AI-powered workflows that transform how work gets done. 10 modules covering process mining, no-code and low-code AI tools, integration architecture, agentic workflows, governance,"
    },
    "de": {
      "title": "AI Workflow Designer",
      "description": "Design and implement AI-powered workflows that transform how work gets done. 10 modules covering process mining, no-code and low-code AI tools, integration architecture, agentic workflows, governance,"
    },
    "zh": {
      "title": "AI Workflow Designer",
      "description": "Design and implement AI-powered workflows that transform how work gets done. 10 modules covering process mining, no-code and low-code AI tools, integration architecture, agentic workflows, governance,"
    },
    "ar": {
      "title": "AI Workflow Designer",
      "description": "Design and implement AI-powered workflows that transform how work gets done. 10 modules covering process mining, no-code and low-code AI tools, integration architecture, agentic workflows, governance,"
    },
    "ja": {
      "title": "AI Workflow Designer",
      "description": "Design and implement AI-powered workflows that transform how work gets done. 10 modules covering process mining, no-code and low-code AI tools, integration architecture, agentic workflows, governance,"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Workflow Design Foundations — The Automation Opportunity",
      "desc": "The workflow automation opportunity (McKinsey: 60% of occupations have 30%+ automatable activities with current AI), the automation spectrum (manual → rule-based RPA → document AI → decision AI → agentic AI), what makes a workflow a good AI candidate (volume × judgment-required × data richness = AI opportunity score), the AI workflow design methodology (discover → analyze → design → build → deploy → optimize), and building the business case. Case study: Legal contract review time reduced 60% with AI workflows.",
      "lessons": [
        {
          "title": "Foundations: AI Workflow Design Foundations — The Automation Opportunity",
          "desc": "The workflow automation opportunity (McKinsey: 60% of occupations have 30%+ automatable activities with current AI), the automation spectrum (manual → rule-based RPA → document AI → decision AI → agentic AI), what makes a workflow a good AI candidate (volume × judgment-required × data richness = AI opportunity score), the AI workflow design methodology (discover → analyze → design → build → deploy → optimize), and building the business case. Case study: Legal contract review time reduced 60% with AI workflows."
        },
        {
          "title": "Module 1.2 Deep Dive: the automation spectrum (manual → rule-based RPA → document AI → decision AI → agentic AI)",
          "desc": "The workflow automation opportunity (McKinsey: 60% of occupations have 30%+ automatable activities with current AI), the automation spectrum (manual → rule-based RPA → document AI → decision AI → agen. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: what makes a workflow a good AI candidate (volume × judgment-required × data richness = AI opportunity score)",
          "desc": "The workflow automation opportunity (McKinsey: 60% of occupations have 30%+ automatable activities with current AI), the automation spectrum (manual → rule-based RPA → document AI → decision AI → agen. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: the AI workflow design methodology (discover → analyze → design → build → deploy → optimize)",
          "desc": "The workflow automation opportunity (McKinsey: 60% of occupations have 30%+ automatable activities with current AI), the automation spectrum (manual → rule-based RPA → document AI → decision AI → agen. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: and building the business case. Case study: Legal contract review time reduced 60% with AI workflows.",
          "desc": "The workflow automation opportunity (McKinsey: 60% of occupations have 30%+ automatable activities with current AI), the automation spectrum (manual → rule-based RPA → document AI → decision AI → agen. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: The workflow automation opportunity (McKinsey: 60% of occupa",
          "desc": "The workflow automation opportunity (McKinsey: 60% of occupations have 30%+ automatable activities with current AI), the automation spectrum (manual → rule-based RPA → document AI → decision AI → agen. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Workflow Design Foundations — The Automation Opportunity. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The workflow automation opportunity (McKinsey: 60% of occupations have 30%+ automatable activities with current AI), the automation spectrum (manual →"
        }
      ]
    },
    {
      "title": "Module 2: Process Mining and Workflow Discovery — Find What's Actually Happening",
      "desc": "Process mining fundamentals (event log extraction from ERP/CRM/ITSM systems, process discovery with PM4Py and Celonis), conformance checking (actual vs. documented process — the 'as-is' reality vs. 'should-be' fantasy), performance mining (bottleneck identification, cycle time analysis, waiting time analysis), AI opportunity identification within discovered processes (where does judgment occur?), and the process mining to AI workflow design pipeline. Case study: Siemens identifying $1B+ in process improvement opportunities through mining.",
      "lessons": [
        {
          "title": "Foundations: Process Mining and Workflow Discovery — Find What's Actually Happening",
          "desc": "Process mining fundamentals (event log extraction from ERP/CRM/ITSM systems, process discovery with PM4Py and Celonis), conformance checking (actual vs. documented process — the 'as-is' reality vs. 'should-be' fantasy), performance mining (bottleneck identification, cycle time analysis, waiting time analysis), AI opportunity identification within discovered processes (where does judgment occur?), and the process mining to AI workflow design pipeline. Case study: Siemens identifying $1B+ in process improvement opportunities through mining."
        },
        {
          "title": "Module 2.2 Deep Dive: process discovery with PM4Py and Celonis)",
          "desc": "'should-be' fantasy), performance mining (bottleneck identification, cycle time analysis, waiting time analysis), AI opportunity identification within discovered processes (where does judgment occur?), and the process mining to AI workflow design pipeline. Case study: Siemens identifying $1B+ in process improvement opportunities through mining.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: conformance checking (actual vs. documented process — the 'as-is' reality vs. 'should-be' fantasy)",
          "desc": "Process mining fundamentals (event log extraction from ERP/CRM/ITSM systems, process discovery with PM4Py and Celonis), conformance checking (actual vs. documented process — the 'as-is' reality vs. 's. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: performance mining (bottleneck identification",
          "desc": "Process mining fundamentals (event log extraction from ERP/CRM/ITSM systems, process discovery with PM4Py and Celonis), conformance checking (actual vs. documented process — the 'as-is' reality vs. 's. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: cycle time analysis",
          "desc": "Process mining fundamentals (event log extraction from ERP/CRM/ITSM systems, process discovery with PM4Py and Celonis), conformance checking (actual vs. documented process — the 'as-is' reality vs. 's. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: waiting time analysis)",
          "desc": "Process mining fundamentals (event log extraction from ERP/CRM/ITSM systems, process discovery with PM4Py and Celonis), conformance checking (actual vs. documented process — the 'as-is' reality vs. 's. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Process Mining and Workflow Discovery — Find What's Actually Happening. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Process mining fundamentals (event log extraction from ERP/CRM/ITSM systems, process discovery with PM4Py and Celonis), conformance checking (actual v"
        }
      ]
    },
    {
      "title": "Module 3: No-Code AI Workflows — Zapier, Make, and n8n",
      "desc": "Zapier for AI workflow automation (ChatGPT, Claude, Anthropic integrations, 5,000+ app connectors), Make (Integromat) for complex multi-step AI workflows (visual builder, error handling, data transformation), n8n for open-source self-hosted AI workflows (GDPR compliance advantage, custom nodes for proprietary AI), Power Automate with AI Builder (Microsoft 365 ecosystem, document processing, approval flows), and the no-code AI workflow decision matrix. Building 5 production workflows from scratch.",
      "lessons": [
        {
          "title": "Foundations: No-Code AI Workflows — Zapier, Make, and n8n",
          "desc": "Zapier for AI workflow automation (ChatGPT, Claude, Anthropic integrations, 5,000+ app connectors), Make (Integromat) for complex multi-step AI workflows (visual builder, error handling, data transformation), n8n for open-source self-hosted AI workflows (GDPR compliance advantage, custom nodes for proprietary AI), Power Automate with AI Builder (Microsoft 365 ecosystem, document processing, approval flows), and the no-code AI workflow decision matrix. Building 5 production workflows from scratch."
        },
        {
          "title": "Module 3.2 Deep Dive: Claude",
          "desc": "Zapier for AI workflow automation (ChatGPT, Claude, Anthropic integrations, 5,000+ app connectors), Make (Integromat) for complex multi-step AI workflows (visual builder, error handling, data transfor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: Anthropic integrations",
          "desc": "Zapier for AI workflow automation (ChatGPT, Claude, Anthropic integrations, 5,000+ app connectors), Make (Integromat) for complex multi-step AI workflows (visual builder, error handling, data transfor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: 5",
          "desc": "Zapier for AI workflow automation (ChatGPT, Claude, Anthropic integrations, 5,000+ app connectors), Make (Integromat) for complex multi-step AI workflows (visual builder, error handling, data transfor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: 000+ app connectors)",
          "desc": "Zapier for AI workflow automation (ChatGPT, Claude, Anthropic integrations, 5,000+ app connectors), Make (Integromat) for complex multi-step AI workflows (visual builder, error handling, data transfor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: Make (Integromat) for complex multi-step AI workflows (visual builder",
          "desc": "Zapier for AI workflow automation (ChatGPT, Claude, Anthropic integrations, 5,000+ app connectors), Make (Integromat) for complex multi-step AI workflows (visual builder, error handling, data transfor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: No-Code AI Workflows — Zapier, Make, and n8n. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Zapier for AI workflow automation (ChatGPT, Claude, Anthropic integrations, 5,000+ app connectors), Make (Integromat) for complex multi-step AI workfl"
        }
      ]
    },
    {
      "title": "Module 4: Low-Code AI Development — Retool, Bubble, and Enterprise Platforms",
      "desc": "Retool for internal AI tools (connecting LLMs to databases, CRMs, and APIs through a GUI), Bubble for AI-powered web applications (full application development with AI integrations), Appsmith for AI operations dashboards (open-source Retool alternative), Microsoft Power Apps with AI Copilot (enterprise integration advantage), and the design patterns for effective low-code AI applications. When low-code is the right choice vs. custom development. Case study: Building an AI-powered customer support escalation tool in Retool in 2 days.",
      "lessons": [
        {
          "title": "Foundations: Low-Code AI Development — Retool, Bubble, and Enterprise Platforms",
          "desc": "Retool for internal AI tools (connecting LLMs to databases, CRMs, and APIs through a GUI), Bubble for AI-powered web applications (full application development with AI integrations), Appsmith for AI operations dashboards (open-source Retool alternative), Microsoft Power Apps with AI Copilot (enterprise integration advantage), and the design patterns for effective low-code AI applications. When low-code is the right choice vs. custom development. Case study: Building an AI-powered customer support escalation tool in Retool in 2 days."
        },
        {
          "title": "Module 4.2 Deep Dive: CRMs",
          "desc": "Case study: Building an AI-powered customer support escalation tool in Retool in 2 days.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: and APIs through a GUI)",
          "desc": "Retool for internal AI tools (connecting LLMs to databases, CRMs, and APIs through a GUI), Bubble for AI-powered web applications (full application development with AI integrations), Appsmith for AI o. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: Bubble for AI-powered web applications (full application development with AI integrations)",
          "desc": "Retool for internal AI tools (connecting LLMs to databases, CRMs, and APIs through a GUI), Bubble for AI-powered web applications (full application development with AI integrations), Appsmith for AI o. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: Appsmith for AI operations dashboards (open-source Retool alternative)",
          "desc": "Retool for internal AI tools (connecting LLMs to databases, CRMs, and APIs through a GUI), Bubble for AI-powered web applications (full application development with AI integrations), Appsmith for AI o. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: Microsoft Power Apps with AI Copilot (enterprise integration advantage)",
          "desc": "Retool for internal AI tools (connecting LLMs to databases, CRMs, and APIs through a GUI), Bubble for AI-powered web applications (full application development with AI integrations), Appsmith for AI o. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Low-Code AI Development — Retool, Bubble, and Enterprise Platforms. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Retool for internal AI tools (connecting LLMs to databases, CRMs, and APIs through a GUI), Bubble for AI-powered web applications (full application de"
        }
      ]
    },
    {
      "title": "Module 5: AI Integration Architecture — APIs, Events, and Reliability Patterns",
      "desc": "REST API design for AI workflow integration (authentication: OAuth 2.0 and API keys, rate limiting handling with exponential backoff, pagination for large result sets, error handling for AI-specific failures), webhooks for event-triggered AI workflows (delivery guarantees, retry logic, idempotency requirements), message queues for reliable AI task processing (Redis Queue, AWS SQS with dead letter queues for failed AI tasks), and integrating AI into legacy enterprise systems (Salesforce, ServiceNow, SAP) through integration platforms.",
      "lessons": [
        {
          "title": "Foundations: AI Integration Architecture — APIs, Events, and Reliability Patterns",
          "desc": "REST API design for AI workflow integration (authentication: OAuth 2.0 and API keys, rate limiting handling with exponential backoff, pagination for large result sets, error handling for AI-specific failures), webhooks for event-triggered AI workflows (delivery guarantees, retry logic, idempotency requirements), message queues for reliable AI task processing (Redis Queue, AWS SQS with dead letter queues for failed AI tasks), and integrating AI into legacy enterprise systems (Salesforce, ServiceNow, SAP) through integration platforms."
        },
        {
          "title": "Module 5.2 Deep Dive: rate limiting handling with exponential backoff",
          "desc": "REST API design for AI workflow integration (authentication: OAuth 2.0 and API keys, rate limiting handling with exponential backoff, pagination for large result sets, error handling for AI-specific f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: pagination for large result sets",
          "desc": "REST API design for AI workflow integration (authentication: OAuth 2.0 and API keys, rate limiting handling with exponential backoff, pagination for large result sets, error handling for AI-specific f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: error handling for AI-specific failures)",
          "desc": "REST API design for AI workflow integration (authentication: OAuth 2.0 and API keys, rate limiting handling with exponential backoff, pagination for large result sets, error handling for AI-specific f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: webhooks for event-triggered AI workflows (delivery guarantees",
          "desc": "REST API design for AI workflow integration (authentication: OAuth 2.0 and API keys, rate limiting handling with exponential backoff, pagination for large result sets, error handling for AI-specific f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: retry logic",
          "desc": "REST API design for AI workflow integration (authentication: OAuth 2.0 and API keys, rate limiting handling with exponential backoff, pagination for large result sets, error handling for AI-specific f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: AI Integration Architecture — APIs, Events, and Reliability Patterns. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. REST API design for AI workflow integration (authentication: OAuth 2.0 and API keys, rate limiting handling with exponential backoff, pagination for l"
        }
      ]
    },
    {
      "title": "Module 6: Document Processing Workflows — From Paper to Insight at Scale",
      "desc": "End-to-end document processing workflow architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing → storage → monitoring), AI document classification (training a router model to sort document types), LLM-based information extraction (invoice line items, contract clauses, medical form fields — with Pydantic schemas for structured output), confidence-based human review routing (low confidence → human queue), and the document processing workflow SLA management.",
      "lessons": [
        {
          "title": "Foundations: Document Processing Workflows — From Paper to Insight at Scale",
          "desc": "End-to-end document processing workflow architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing → storage → monitoring), AI document classification (training a router model to sort document types), LLM-based information extraction (invoice line items, contract clauses, medical form fields — with Pydantic schemas for structured output), confidence-based human review routing (low confidence → human queue), and the document processing workflow SLA management."
        },
        {
          "title": "Module 6.2 Deep Dive: AI document classification (training a router model to sort document types)",
          "desc": "End-to-end document processing workflow architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing → storage → monitoring), AI document classification (training a . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: LLM-based information extraction (invoice line items",
          "desc": "End-to-end document processing workflow architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing → storage → monitoring), AI document classification (training a . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: contract clauses",
          "desc": "End-to-end document processing workflow architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing → storage → monitoring), AI document classification (training a . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: medical form fields — with Pydantic schemas for structured output)",
          "desc": "End-to-end document processing workflow architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing → storage → monitoring), AI document classification (training a . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: confidence-based human review routing (low confidence → human queue)",
          "desc": "End-to-end document processing workflow architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing → storage → monitoring), AI document classification (training a . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Document Processing Workflows — From Paper to Insight at Scale. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. End-to-end document processing workflow architecture (ingestion → classification → OCR → extraction → validation → enrichment → routing → storage → mo"
        }
      ]
    },
    {
      "title": "Module 7: Agentic Workflows — Multi-Step AI Task Automation",
      "desc": "Agentic workflow patterns (sequential chains, parallel fan-out/fan-in, conditional branching based on AI decisions, human approval checkpoints, iterative refinement loops), designing the state machine for complex AI workflows (what state needs to be tracked? where can it resume if interrupted?), cost management for multi-step agentic workflows (token budgets per workflow step, cost-per-workflow tracking), monitoring agentic workflows in production (step-by-step visibility, anomaly detection for runaway agents), and the agentic workflow design pattern library.",
      "lessons": [
        {
          "title": "Foundations: Agentic Workflows — Multi-Step AI Task Automation",
          "desc": "Agentic workflow patterns (sequential chains, parallel fan-out/fan-in, conditional branching based on AI decisions, human approval checkpoints, iterative refinement loops), designing the state machine for complex AI workflows (what state needs to be tracked? where can it resume if interrupted?), cost management for multi-step agentic workflows (token budgets per workflow step, cost-per-workflow tracking), monitoring agentic workflows in production (step-by-step visibility, anomaly detection for runaway agents), and the agentic workflow design pattern library."
        },
        {
          "title": "Module 7.2 Deep Dive: parallel fan-out/fan-in",
          "desc": "Agentic workflow patterns (sequential chains, parallel fan-out/fan-in, conditional branching based on AI decisions, human approval checkpoints, iterative refinement loops), designing the state machine. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: conditional branching based on AI decisions",
          "desc": "Agentic workflow patterns (sequential chains, parallel fan-out/fan-in, conditional branching based on AI decisions, human approval checkpoints, iterative refinement loops), designing the state machine. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: human approval checkpoints",
          "desc": "Agentic workflow patterns (sequential chains, parallel fan-out/fan-in, conditional branching based on AI decisions, human approval checkpoints, iterative refinement loops), designing the state machine. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: iterative refinement loops)",
          "desc": "Agentic workflow patterns (sequential chains, parallel fan-out/fan-in, conditional branching based on AI decisions, human approval checkpoints, iterative refinement loops), designing the state machine. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: designing the state machine for complex AI workflows (what state needs to be tracked? where can it resume if interrupted?)",
          "desc": "Agentic workflow patterns (sequential chains, parallel fan-out/fan-in, conditional branching based on AI decisions, human approval checkpoints, iterative refinement loops), designing the state machine. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Agentic Workflows — Multi-Step AI Task Automation. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Agentic workflow patterns (sequential chains, parallel fan-out/fan-in, conditional branching based on AI decisions, human approval checkpoints, iterat"
        }
      ]
    },
    {
      "title": "Module 8: Testing, Quality, and Validation for AI Workflows",
      "desc": "Testing methodology for AI workflows (unit tests for individual AI steps: mock the LLM response and test the pipeline; integration tests for end-to-end flows with real AI calls; regression testing for model updates; adversarial testing for unexpected inputs), quality metrics for AI workflows (accuracy: is the AI doing the right thing?; throughput: how many documents/requests per hour?; error rate: what percentage fail or require human intervention?; cycle time: total time from input to output?), and the AI workflow QA program.",
      "lessons": [
        {
          "title": "Foundations: Testing, Quality, and Validation for AI Workflows",
          "desc": "Testing methodology for AI workflows (unit tests for individual AI steps: mock the LLM response and test the pipeline; integration tests for end-to-end flows with real AI calls; regression testing for model updates; adversarial testing for unexpected inputs), quality metrics for AI workflows (accuracy: is the AI doing the right thing?; throughput: how many documents/requests per hour?; error rate: what percentage fail or require human intervention?; cycle time: total time from input to output?), and the AI workflow QA program."
        },
        {
          "title": "Module 8.2 Deep Dive: quality metrics for AI workflows (accuracy: is the AI doing the right thing?; throughput: how many documents/requests per hour?; error rate: what percentage fail or require human intervention?; cycle time: total time from input to output?)",
          "desc": "Testing methodology for AI workflows (unit tests for individual AI steps: mock the LLM response and test the pipeline; integration tests for end-to-end flows with real AI calls; regression testing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: and the AI workflow QA program.",
          "desc": "Testing methodology for AI workflows (unit tests for individual AI steps: mock the LLM response and test the pipeline; integration tests for end-to-end flows with real AI calls; regression testing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: Testing methodology for AI workflows (unit tests for individ",
          "desc": "Testing methodology for AI workflows (unit tests for individual AI steps: mock the LLM response and test the pipeline; integration tests for end-to-end flows with real AI calls; regression testing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: Testing methodology for AI workflows (unit tests for individ",
          "desc": "Testing methodology for AI workflows (unit tests for individual AI steps: mock the LLM response and test the pipeline; integration tests for end-to-end flows with real AI calls; regression testing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: Testing methodology for AI workflows (unit tests for individ",
          "desc": "Testing methodology for AI workflows (unit tests for individual AI steps: mock the LLM response and test the pipeline; integration tests for end-to-end flows with real AI calls; regression testing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Testing, Quality, and Validation for AI Workflows. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Testing methodology for AI workflows (unit tests for individual AI steps: mock the LLM response and test the pipeline; integration tests for end-to-en"
        }
      ]
    },
    {
      "title": "Module 9: Governance and Change Management for AI Workflows",
      "desc": "AI workflow governance framework (workflow inventory: what AI workflows exist and who owns them?; documentation standards: is every AI workflow documented with its data flows, decision points, and human review triggers?; change management: who must approve workflow updates?; compliance documentation: audit trail requirements for regulated workflows), change management for AI workflow deployment (user training program, resistance management, adoption measurement), and the AI workflow COE (Center of Excellence) operating model.",
      "lessons": [
        {
          "title": "Foundations: Governance and Change Management for AI Workflows",
          "desc": "AI workflow governance framework (workflow inventory: what AI workflows exist and who owns them?; documentation standards: is every AI workflow documented with its data flows, decision points, and human review triggers?; change management: who must approve workflow updates?; compliance documentation: audit trail requirements for regulated workflows), change management for AI workflow deployment (user training program, resistance management, adoption measurement), and the AI workflow COE (Center of Excellence) operating model."
        },
        {
          "title": "Module 9.2 Deep Dive: decision points",
          "desc": "AI workflow governance framework (workflow inventory: what AI workflows exist and who owns them?; documentation standards: is every AI workflow documented with its data flows, decision points, and hum. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: and human review triggers?; change management: who must approve workflow updates?; compliance documentation: audit trail requirements for regulated workflows)",
          "desc": "AI workflow governance framework (workflow inventory: what AI workflows exist and who owns them?; documentation standards: is every AI workflow documented with its data flows, decision points, and hum. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: change management for AI workflow deployment (user training program",
          "desc": "AI workflow governance framework (workflow inventory: what AI workflows exist and who owns them?; documentation standards: is every AI workflow documented with its data flows, decision points, and hum. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: resistance management",
          "desc": "AI workflow governance framework (workflow inventory: what AI workflows exist and who owns them?; documentation standards: is every AI workflow documented with its data flows, decision points, and hum. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: adoption measurement)",
          "desc": "AI workflow governance framework (workflow inventory: what AI workflows exist and who owns them?; documentation standards: is every AI workflow documented with its data flows, decision points, and hum. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Governance and Change Management for AI Workflows. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI workflow governance framework (workflow inventory: what AI workflows exist and who owns them?; documentation standards: is every AI workflow docume"
        }
      ]
    },
    {
      "title": "Module 10: AI Workflow Practice Leadership and Capstone",
      "desc": "Building an AI workflow design practice (team structure, process methodology, tool stack, knowledge management), the AI workflow designer career path ($110K-$190K range), emerging workflow patterns (fully agentic end-to-end process automation, AI workflow orchestration platforms), and the capstone: design a complete AI workflow transformation for a business process — process mining analysis, opportunity identification, workflow design with full documentation, integration architecture, testing strategy, deployment plan, governance framework, and ROI measurement model.",
      "lessons": [
        {
          "title": "Foundations: AI Workflow Practice Leadership and Capstone",
          "desc": "Building an AI workflow design practice (team structure, process methodology, tool stack, knowledge management), the AI workflow designer career path ($110K-$190K range), emerging workflow patterns (fully agentic end-to-end process automation, AI workflow orchestration platforms), and the capstone: design a complete AI workflow transformation for a business process — process mining analysis, opportunity identification, workflow design with full documentation, integration architecture, testing strategy, deployment plan, governance framework, and ROI measurement model."
        },
        {
          "title": "Module 10.2 Deep Dive: process methodology",
          "desc": "Building an AI workflow design practice (team structure, process methodology, tool stack, knowledge management), the AI workflow designer career path ($110K-$190K range), emerging workflow patterns (f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: tool stack",
          "desc": "Building an AI workflow design practice (team structure, process methodology, tool stack, knowledge management), the AI workflow designer career path ($110K-$190K range), emerging workflow patterns (f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: knowledge management)",
          "desc": "Building an AI workflow design practice (team structure, process methodology, tool stack, knowledge management), the AI workflow designer career path ($110K-$190K range), emerging workflow patterns (f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: the AI workflow designer career path ($110K-$190K range)",
          "desc": "Building an AI workflow design practice (team structure, process methodology, tool stack, knowledge management), the AI workflow designer career path ($110K-$190K range), emerging workflow patterns (f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: emerging workflow patterns (fully agentic end-to-end process automation",
          "desc": "Building an AI workflow design practice (team structure, process methodology, tool stack, knowledge management), the AI workflow designer career path ($110K-$190K range), emerging workflow patterns (f. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: AI Workflow Practice Leadership and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Building an AI workflow design practice (team structure, process methodology, tool stack, knowledge management), the AI workflow designer career path "
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
