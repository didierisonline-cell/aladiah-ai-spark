import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/auth.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Transformation Manager",
  "description": "Lead enterprise AI transformation from strategy through execution. 10 modules covering transformation strategy, AI program governance, change management, workforce transformation, and the leadership practices that determine whether AI investments deliver value — drawing from DBS Bank, Siemens, Amazon, and Starbucks transformations.",
  "translations": {
    "es": {
      "title": "AI Transformation Manager",
      "description": "Lead enterprise AI transformation from strategy through execution. 10 modules covering transformation strategy, AI program governance, change management, workforce transformation, and the leadership p"
    },
    "fr": {
      "title": "AI Transformation Manager",
      "description": "Lead enterprise AI transformation from strategy through execution. 10 modules covering transformation strategy, AI program governance, change management, workforce transformation, and the leadership p"
    },
    "de": {
      "title": "AI Transformation Manager",
      "description": "Lead enterprise AI transformation from strategy through execution. 10 modules covering transformation strategy, AI program governance, change management, workforce transformation, and the leadership p"
    },
    "zh": {
      "title": "AI Transformation Manager",
      "description": "Lead enterprise AI transformation from strategy through execution. 10 modules covering transformation strategy, AI program governance, change management, workforce transformation, and the leadership p"
    },
    "ar": {
      "title": "AI Transformation Manager",
      "description": "Lead enterprise AI transformation from strategy through execution. 10 modules covering transformation strategy, AI program governance, change management, workforce transformation, and the leadership p"
    },
    "ja": {
      "title": "AI Transformation Manager",
      "description": "Lead enterprise AI transformation from strategy through execution. 10 modules covering transformation strategy, AI program governance, change management, workforce transformation, and the leadership p"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Transformation Strategy — Vision, Roadmap, and the $13T Opportunity",
      "desc": "Why 70% of AI transformations fail (McKinsey), the 8 critical success factors for AI transformation (strategy, data, talent, technology, operating model, culture, governance, ecosystem), transformation vs. incremental AI improvement, the AI transformation strategy framework, and building the board-level mandate. Case study: DBS Bank's 6-year transformation from traditional bank to 'best digital bank in the world.'",
      "lessons": [
        {
          "title": "Foundations: AI Transformation Strategy — Vision, Roadmap, and the $13T Opportunity",
          "desc": "Why 70% of AI transformations fail (McKinsey), the 8 critical success factors for AI transformation (strategy, data, talent, technology, operating model, culture, governance, ecosystem), transformation vs. incremental AI improvement, the AI transformation strategy framework, and building the board-level mandate. Case study: DBS Bank's 6-year transformation from traditional bank to 'best digital bank in the world.'"
        },
        {
          "title": "Module 1.2 Deep Dive: the 8 critical success factors for AI transformation (strategy",
          "desc": "Case study: DBS Bank's 6-year transformation from traditional bank to 'best digital bank in the world.'. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: data",
          "desc": "Why 70% of AI transformations fail (McKinsey), the 8 critical success factors for AI transformation (strategy, data, talent, technology, operating model, culture, governance, ecosystem), transformatio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: talent",
          "desc": "Why 70% of AI transformations fail (McKinsey), the 8 critical success factors for AI transformation (strategy, data, talent, technology, operating model, culture, governance, ecosystem), transformatio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: technology",
          "desc": "Why 70% of AI transformations fail (McKinsey), the 8 critical success factors for AI transformation (strategy, data, talent, technology, operating model, culture, governance, ecosystem), transformatio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: operating model",
          "desc": "Why 70% of AI transformations fail (McKinsey), the 8 critical success factors for AI transformation (strategy, data, talent, technology, operating model, culture, governance, ecosystem), transformatio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Transformation Strategy — Vision, Roadmap, and the $13T Opportunity. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Why 70% of AI transformations fail (McKinsey), the 8 critical success factors for AI transformation (strategy, data, talent, technology, operating mod"
        }
      ]
    },
    {
      "title": "Module 2: AI Maturity Assessment and Organizational Readiness",
      "desc": "McKinsey's AI maturity model (5 stages), Gartner's AI Readiness Assessment, assessing data maturity (the #1 predictor of transformation success — 78% of failed AI transformations had data foundation issues), talent readiness assessment, technology readiness (infrastructure, tools, platforms), process readiness, and culture readiness. Deliverable: Complete AI readiness assessment tool with organizational scoring.",
      "lessons": [
        {
          "title": "Foundations: AI Maturity Assessment and Organizational Readiness",
          "desc": "McKinsey's AI maturity model (5 stages), Gartner's AI Readiness Assessment, assessing data maturity (the #1 predictor of transformation success — 78% of failed AI transformations had data foundation issues), talent readiness assessment, technology readiness (infrastructure, tools, platforms), process readiness, and culture readiness. Deliverable: Complete AI readiness assessment tool with organizational scoring."
        },
        {
          "title": "Module 2.2 Deep Dive: Gartner's AI Readiness Assessment",
          "desc": "McKinsey's AI maturity model (5 stages), Gartner's AI Readiness Assessment, assessing data maturity (the #1 predictor of transformation success — 78% of failed AI transformations had data foundation i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: assessing data maturity (the #1 predictor of transformation success — 78% of failed AI transformations had data foundation issues)",
          "desc": "McKinsey's AI maturity model (5 stages), Gartner's AI Readiness Assessment, assessing data maturity (the #1 predictor of transformation success — 78% of failed AI transformations had data foundation i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: talent readiness assessment",
          "desc": "McKinsey's AI maturity model (5 stages), Gartner's AI Readiness Assessment, assessing data maturity (the #1 predictor of transformation success — 78% of failed AI transformations had data foundation i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: technology readiness (infrastructure",
          "desc": "McKinsey's AI maturity model (5 stages), Gartner's AI Readiness Assessment, assessing data maturity (the #1 predictor of transformation success — 78% of failed AI transformations had data foundation i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: tools",
          "desc": "McKinsey's AI maturity model (5 stages), Gartner's AI Readiness Assessment, assessing data maturity (the #1 predictor of transformation success — 78% of failed AI transformations had data foundation i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: AI Maturity Assessment and Organizational Readiness. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. McKinsey's AI maturity model (5 stages), Gartner's AI Readiness Assessment, assessing data maturity (the #1 predictor of transformation success — 78% "
        }
      ]
    },
    {
      "title": "Module 3: AI Program Governance — Structure, Decision Rights, and Accountability",
      "desc": "AI transformation governance models (centralized AI COE vs. federated AI in business units vs. hybrid), the AI Steering Committee (composition, charter, meeting cadence, decision authority), Chief AI Officer role (responsibilities, organizational placement, relationship with CDO and CTO), AI governance frameworks (NIST AI RMF, ISO 42001, EU AI Act implications for governance), and governance anti-patterns that kill transformations.",
      "lessons": [
        {
          "title": "Foundations: AI Program Governance — Structure, Decision Rights, and Accountability",
          "desc": "AI transformation governance models (centralized AI COE vs. federated AI in business units vs. hybrid), the AI Steering Committee (composition, charter, meeting cadence, decision authority), Chief AI Officer role (responsibilities, organizational placement, relationship with CDO and CTO), AI governance frameworks (NIST AI RMF, ISO 42001, EU AI Act implications for governance), and governance anti-patterns that kill transformations."
        },
        {
          "title": "Module 3.2 Deep Dive: the AI Steering Committee (composition",
          "desc": "hybrid), the AI Steering Committee (composition, charter, meeting cadence, decision authority), Chief AI Officer role (responsibilities, organizational placement, relationship with CDO and CTO), AI governance frameworks (NIST AI RMF, ISO 42001, EU AI Act implications for governance), and governance anti-patterns that kill transformations.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: charter",
          "desc": "AI transformation governance models (centralized AI COE vs. federated AI in business units vs. hybrid), the AI Steering Committee (composition, charter, meeting cadence, decision authority), Chief AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: meeting cadence",
          "desc": "AI transformation governance models (centralized AI COE vs. federated AI in business units vs. hybrid), the AI Steering Committee (composition, charter, meeting cadence, decision authority), Chief AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: decision authority)",
          "desc": "AI transformation governance models (centralized AI COE vs. federated AI in business units vs. hybrid), the AI Steering Committee (composition, charter, meeting cadence, decision authority), Chief AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: Chief AI Officer role (responsibilities",
          "desc": "AI transformation governance models (centralized AI COE vs. federated AI in business units vs. hybrid), the AI Steering Committee (composition, charter, meeting cadence, decision authority), Chief AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: AI Program Governance — Structure, Decision Rights, and Accountability. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI transformation governance models (centralized AI COE vs. federated AI in business units vs. hybrid), the AI Steering Committee (composition, charte"
        }
      ]
    },
    {
      "title": "Module 4: Change Management for AI — PROSCI, Kotter, and the Human Dimension",
      "desc": "PROSCI ADKAR methodology applied to AI transformation (Awareness → Desire → Knowledge → Ability → Reinforcement), Kotter's 8-step model with AI-specific tactics, building the coalition of the willing (identifying and empowering AI champions), managing workforce anxiety about automation (the communication that prevents panic), and resistance management playbook. Case study: Siemens' AI change program across 360,000 employees.",
      "lessons": [
        {
          "title": "Foundations: Change Management for AI — PROSCI, Kotter, and the Human Dimension",
          "desc": "PROSCI ADKAR methodology applied to AI transformation (Awareness → Desire → Knowledge → Ability → Reinforcement), Kotter's 8-step model with AI-specific tactics, building the coalition of the willing (identifying and empowering AI champions), managing workforce anxiety about automation (the communication that prevents panic), and resistance management playbook. Case study: Siemens' AI change program across 360,000 employees."
        },
        {
          "title": "Module 4.2 Deep Dive: Kotter's 8-step model with AI-specific tactics",
          "desc": "PROSCI ADKAR methodology applied to AI transformation (Awareness → Desire → Knowledge → Ability → Reinforcement), Kotter's 8-step model with AI-specific tactics, building the coalition of the willing . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: building the coalition of the willing (identifying and empowering AI champions)",
          "desc": "PROSCI ADKAR methodology applied to AI transformation (Awareness → Desire → Knowledge → Ability → Reinforcement), Kotter's 8-step model with AI-specific tactics, building the coalition of the willing . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: managing workforce anxiety about automation (the communication that prevents panic)",
          "desc": "PROSCI ADKAR methodology applied to AI transformation (Awareness → Desire → Knowledge → Ability → Reinforcement), Kotter's 8-step model with AI-specific tactics, building the coalition of the willing . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: and resistance management playbook. Case study: Siemens' AI change program across 360",
          "desc": "PROSCI ADKAR methodology applied to AI transformation (Awareness → Desire → Knowledge → Ability → Reinforcement), Kotter's 8-step model with AI-specific tactics, building the coalition of the willing . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: 000 employees.",
          "desc": "PROSCI ADKAR methodology applied to AI transformation (Awareness → Desire → Knowledge → Ability → Reinforcement), Kotter's 8-step model with AI-specific tactics, building the coalition of the willing . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Change Management for AI — PROSCI, Kotter, and the Human Dimension. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. PROSCI ADKAR methodology applied to AI transformation (Awareness → Desire → Knowledge → Ability → Reinforcement), Kotter's 8-step model with AI-specif"
        }
      ]
    },
    {
      "title": "Module 5: AI Workforce Strategy — Reskilling, New Roles, and Future of Work",
      "desc": "WEF Future of Jobs Report 2025: 85M jobs displaced, 97M new roles by 2025 (the net positive story most executives miss), designing the AI reskilling program (Amazon's $700M Upskilling 2025 as the benchmark), building AI literacy at scale (differentiated programs by role), new AI-era job families (AI trainer, prompt engineer, AI ethicist, AI auditor), and workforce planning for the transformed organization.",
      "lessons": [
        {
          "title": "Foundations: AI Workforce Strategy — Reskilling, New Roles, and Future of Work",
          "desc": "WEF Future of Jobs Report 2025: 85M jobs displaced, 97M new roles by 2025 (the net positive story most executives miss), designing the AI reskilling program (Amazon's $700M Upskilling 2025 as the benchmark), building AI literacy at scale (differentiated programs by role), new AI-era job families (AI trainer, prompt engineer, AI ethicist, AI auditor), and workforce planning for the transformed organization."
        },
        {
          "title": "Module 5.2 Deep Dive: 97M new roles by 2025 (the net positive story most executives miss)",
          "desc": "WEF Future of Jobs Report 2025: 85M jobs displaced, 97M new roles by 2025 (the net positive story most executives miss), designing the AI reskilling program (Amazon's $700M Upskilling 2025 as the benc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: designing the AI reskilling program (Amazon's $700M Upskilling 2025 as the benchmark)",
          "desc": "WEF Future of Jobs Report 2025: 85M jobs displaced, 97M new roles by 2025 (the net positive story most executives miss), designing the AI reskilling program (Amazon's $700M Upskilling 2025 as the benc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: building AI literacy at scale (differentiated programs by role)",
          "desc": "WEF Future of Jobs Report 2025: 85M jobs displaced, 97M new roles by 2025 (the net positive story most executives miss), designing the AI reskilling program (Amazon's $700M Upskilling 2025 as the benc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: new AI-era job families (AI trainer",
          "desc": "WEF Future of Jobs Report 2025: 85M jobs displaced, 97M new roles by 2025 (the net positive story most executives miss), designing the AI reskilling program (Amazon's $700M Upskilling 2025 as the benc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: prompt engineer",
          "desc": "WEF Future of Jobs Report 2025: 85M jobs displaced, 97M new roles by 2025 (the net positive story most executives miss), designing the AI reskilling program (Amazon's $700M Upskilling 2025 as the benc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: AI Workforce Strategy — Reskilling, New Roles, and Future of Work. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. WEF Future of Jobs Report 2025: 85M jobs displaced, 97M new roles by 2025 (the net positive story most executives miss), designing the AI reskilling p"
        }
      ]
    },
    {
      "title": "Module 6: AI Technology Strategy — Build, Buy, Partner, and Avoid Lock-In",
      "desc": "The build-buy-partner decision framework for enterprise AI (when each is appropriate), enterprise AI platform evaluation (Microsoft Azure AI, Google Vertex AI, AWS SageMaker, Salesforce Einstein — scorecard methodology), vendor governance and relationship management, avoiding vendor lock-in (open standards strategy), and technology architecture principles that support transformation agility.",
      "lessons": [
        {
          "title": "Foundations: AI Technology Strategy — Build, Buy, Partner, and Avoid Lock-In",
          "desc": "The build-buy-partner decision framework for enterprise AI (when each is appropriate), enterprise AI platform evaluation (Microsoft Azure AI, Google Vertex AI, AWS SageMaker, Salesforce Einstein — scorecard methodology), vendor governance and relationship management, avoiding vendor lock-in (open standards strategy), and technology architecture principles that support transformation agility."
        },
        {
          "title": "Module 6.2 Deep Dive: enterprise AI platform evaluation (Microsoft Azure AI",
          "desc": "The build-buy-partner decision framework for enterprise AI (when each is appropriate), enterprise AI platform evaluation (Microsoft Azure AI, Google Vertex AI, AWS SageMaker, Salesforce Einstein — sco. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: Google Vertex AI",
          "desc": "The build-buy-partner decision framework for enterprise AI (when each is appropriate), enterprise AI platform evaluation (Microsoft Azure AI, Google Vertex AI, AWS SageMaker, Salesforce Einstein — sco. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: AWS SageMaker",
          "desc": "The build-buy-partner decision framework for enterprise AI (when each is appropriate), enterprise AI platform evaluation (Microsoft Azure AI, Google Vertex AI, AWS SageMaker, Salesforce Einstein — sco. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: Salesforce Einstein — scorecard methodology)",
          "desc": "The build-buy-partner decision framework for enterprise AI (when each is appropriate), enterprise AI platform evaluation (Microsoft Azure AI, Google Vertex AI, AWS SageMaker, Salesforce Einstein — sco. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: vendor governance and relationship management",
          "desc": "The build-buy-partner decision framework for enterprise AI (when each is appropriate), enterprise AI platform evaluation (Microsoft Azure AI, Google Vertex AI, AWS SageMaker, Salesforce Einstein — sco. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: AI Technology Strategy — Build, Buy, Partner, and Avoid Lock-In. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The build-buy-partner decision framework for enterprise AI (when each is appropriate), enterprise AI platform evaluation (Microsoft Azure AI, Google V"
        }
      ]
    },
    {
      "title": "Module 7: AI Data Strategy — The Foundation Without Which Transformation Fails",
      "desc": "The data strategy framework for AI transformation (data collection → curation → governance → platform → monetization), data literacy programs at scale, building the data culture (from data-informed to data-driven to data-transformed), CDO as transformation partner (the CDO-CAO relationship model), and the data roadmap that enables the AI roadmap. Case study: Starbucks' Deep Brew data strategy enabling hyper-personalization.",
      "lessons": [
        {
          "title": "Foundations: AI Data Strategy — The Foundation Without Which Transformation Fails",
          "desc": "The data strategy framework for AI transformation (data collection → curation → governance → platform → monetization), data literacy programs at scale, building the data culture (from data-informed to data-driven to data-transformed), CDO as transformation partner (the CDO-CAO relationship model), and the data roadmap that enables the AI roadmap. Case study: Starbucks' Deep Brew data strategy enabling hyper-personalization."
        },
        {
          "title": "Module 7.2 Deep Dive: data literacy programs at scale",
          "desc": "The data strategy framework for AI transformation (data collection → curation → governance → platform → monetization), data literacy programs at scale, building the data culture (from data-informed to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: building the data culture (from data-informed to data-driven to data-transformed)",
          "desc": "The data strategy framework for AI transformation (data collection → curation → governance → platform → monetization), data literacy programs at scale, building the data culture (from data-informed to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: CDO as transformation partner (the CDO-CAO relationship model)",
          "desc": "The data strategy framework for AI transformation (data collection → curation → governance → platform → monetization), data literacy programs at scale, building the data culture (from data-informed to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: and the data roadmap that enables the AI roadmap. Case study: Starbucks' Deep Brew data strategy enabling hyper-personalization.",
          "desc": "The data strategy framework for AI transformation (data collection → curation → governance → platform → monetization), data literacy programs at scale, building the data culture (from data-informed to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: The data strategy framework for AI transformation (data coll",
          "desc": "The data strategy framework for AI transformation (data collection → curation → governance → platform → monetization), data literacy programs at scale, building the data culture (from data-informed to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: AI Data Strategy — The Foundation Without Which Transformation Fails. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The data strategy framework for AI transformation (data collection → curation → governance → platform → monetization), data literacy programs at scale"
        }
      ]
    },
    {
      "title": "Module 8: AI Transformation Program Management",
      "desc": "Managing complex multi-stream AI transformation programs (interdependency management, critical path for AI programs), the transformation PMO structure (program governance layer, delivery management layer, change management layer), managing executive sponsors (the sponsor contract), and the program reporting cadence. The 70% failure rate analysis: what the data says about why AI transformations fail.",
      "lessons": [
        {
          "title": "Foundations: AI Transformation Program Management",
          "desc": "Managing complex multi-stream AI transformation programs (interdependency management, critical path for AI programs), the transformation PMO structure (program governance layer, delivery management layer, change management layer), managing executive sponsors (the sponsor contract), and the program reporting cadence. The 70% failure rate analysis: what the data says about why AI transformations fail."
        },
        {
          "title": "Module 8.2 Deep Dive: critical path for AI programs)",
          "desc": "Managing complex multi-stream AI transformation programs (interdependency management, critical path for AI programs), the transformation PMO structure (program governance layer, delivery management la. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: the transformation PMO structure (program governance layer",
          "desc": "Managing complex multi-stream AI transformation programs (interdependency management, critical path for AI programs), the transformation PMO structure (program governance layer, delivery management la. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: delivery management layer",
          "desc": "Managing complex multi-stream AI transformation programs (interdependency management, critical path for AI programs), the transformation PMO structure (program governance layer, delivery management la. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: change management layer)",
          "desc": "Managing complex multi-stream AI transformation programs (interdependency management, critical path for AI programs), the transformation PMO structure (program governance layer, delivery management la. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: managing executive sponsors (the sponsor contract)",
          "desc": "Managing complex multi-stream AI transformation programs (interdependency management, critical path for AI programs), the transformation PMO structure (program governance layer, delivery management la. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: AI Transformation Program Management. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Managing complex multi-stream AI transformation programs (interdependency management, critical path for AI programs), the transformation PMO structure"
        }
      ]
    },
    {
      "title": "Module 9: Measuring AI Transformation ROI and Value Realization",
      "desc": "The AI value realization framework (inputs → activities → outputs → outcomes → impact — the logic model for AI), leading indicators for transformation progress (model deployment velocity, data quality scores, adoption rates), lagging indicators (cost reduction, revenue impact, customer satisfaction improvement), the AI transformation scorecard, and reporting to the board. Case study: Measuring diffuse AI transformation benefits.",
      "lessons": [
        {
          "title": "Foundations: Measuring AI Transformation ROI and Value Realization",
          "desc": "The AI value realization framework (inputs → activities → outputs → outcomes → impact — the logic model for AI), leading indicators for transformation progress (model deployment velocity, data quality scores, adoption rates), lagging indicators (cost reduction, revenue impact, customer satisfaction improvement), the AI transformation scorecard, and reporting to the board. Case study: Measuring diffuse AI transformation benefits."
        },
        {
          "title": "Module 9.2 Deep Dive: leading indicators for transformation progress (model deployment velocity",
          "desc": "The AI value realization framework (inputs → activities → outputs → outcomes → impact — the logic model for AI), leading indicators for transformation progress (model deployment velocity, data quality. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: data quality scores",
          "desc": "The AI value realization framework (inputs → activities → outputs → outcomes → impact — the logic model for AI), leading indicators for transformation progress (model deployment velocity, data quality. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: adoption rates)",
          "desc": "The AI value realization framework (inputs → activities → outputs → outcomes → impact — the logic model for AI), leading indicators for transformation progress (model deployment velocity, data quality. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: lagging indicators (cost reduction",
          "desc": "The AI value realization framework (inputs → activities → outputs → outcomes → impact — the logic model for AI), leading indicators for transformation progress (model deployment velocity, data quality. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: revenue impact",
          "desc": "The AI value realization framework (inputs → activities → outputs → outcomes → impact — the logic model for AI), leading indicators for transformation progress (model deployment velocity, data quality. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Measuring AI Transformation ROI and Value Realization. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI value realization framework (inputs → activities → outputs → outcomes → impact — the logic model for AI), leading indicators for transformation"
        }
      ]
    },
    {
      "title": "Module 10: Sustaining the Transformation and Capstone",
      "desc": "Building self-sustaining AI capability (embedding AI into the operating model, not running it as a transformation program), the AI organization design (what does the transformed org structure look like?), AI transformation leadership succession, and the capstone: develop a complete 3-year AI transformation roadmap for a provided Fortune 500 scenario — assessment, strategy, program plan, change management plan, and measurement framework.",
      "lessons": [
        {
          "title": "Foundations: Sustaining the Transformation and Capstone",
          "desc": "Building self-sustaining AI capability (embedding AI into the operating model, not running it as a transformation program), the AI organization design (what does the transformed org structure look like?), AI transformation leadership succession, and the capstone: develop a complete 3-year AI transformation roadmap for a provided Fortune 500 scenario — assessment, strategy, program plan, change management plan, and measurement framework."
        },
        {
          "title": "Module 10.2 Deep Dive: not running it as a transformation program)",
          "desc": "Building self-sustaining AI capability (embedding AI into the operating model, not running it as a transformation program), the AI organization design (what does the transformed org structure look lik. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: the AI organization design (what does the transformed org structure look like?)",
          "desc": "Building self-sustaining AI capability (embedding AI into the operating model, not running it as a transformation program), the AI organization design (what does the transformed org structure look lik. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: AI transformation leadership succession",
          "desc": "Building self-sustaining AI capability (embedding AI into the operating model, not running it as a transformation program), the AI organization design (what does the transformed org structure look lik. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: and the capstone: develop a complete 3-year AI transformation roadmap for a provided Fortune 500 scenario — assessment",
          "desc": "Building self-sustaining AI capability (embedding AI into the operating model, not running it as a transformation program), the AI organization design (what does the transformed org structure look lik. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: strategy",
          "desc": "Building self-sustaining AI capability (embedding AI into the operating model, not running it as a transformation program), the AI organization design (what does the transformed org structure look lik. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Sustaining the Transformation and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Building self-sustaining AI capability (embedding AI into the operating model, not running it as a transformation program), the AI organization design"
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
