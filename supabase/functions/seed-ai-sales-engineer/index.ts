import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/adminGuard.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Sales Engineer",
  "description": "Master technical sales for AI products — from discovery and demo to proof of concept and close. 10 modules covering AI product demos, objection handling, PoC design, ROI modeling, and the consultative approach that wins enterprise AI deals worth $100K-$10M.",
  "translations": {
    "es": {
      "title": "AI Sales Engineer",
      "description": "Master technical sales for AI products — from discovery and demo to proof of concept and close. 10 modules covering AI product demos, objection handling, PoC design, ROI modeling, and the consultative"
    },
    "fr": {
      "title": "AI Sales Engineer",
      "description": "Master technical sales for AI products — from discovery and demo to proof of concept and close. 10 modules covering AI product demos, objection handling, PoC design, ROI modeling, and the consultative"
    },
    "de": {
      "title": "AI Sales Engineer",
      "description": "Master technical sales for AI products — from discovery and demo to proof of concept and close. 10 modules covering AI product demos, objection handling, PoC design, ROI modeling, and the consultative"
    },
    "zh": {
      "title": "AI Sales Engineer",
      "description": "Master technical sales for AI products — from discovery and demo to proof of concept and close. 10 modules covering AI product demos, objection handling, PoC design, ROI modeling, and the consultative"
    },
    "ar": {
      "title": "AI Sales Engineer",
      "description": "Master technical sales for AI products — from discovery and demo to proof of concept and close. 10 modules covering AI product demos, objection handling, PoC design, ROI modeling, and the consultative"
    },
    "ja": {
      "title": "AI Sales Engineer",
      "description": "Master technical sales for AI products — from discovery and demo to proof of concept and close. 10 modules covering AI product demos, objection handling, PoC design, ROI modeling, and the consultative"
    }
  },
  "modules": [
    {
      "title": "Module 1: The AI Sales Engineer Role — Technical Credibility Meets $300K OTE",
      "desc": "The AI SE market (Salesforce, Microsoft, Google, Anthropic, and 10,000 AI startups all hiring), the SE-AE partnership model (SE owns technical win, AE owns commercial win), the AI buying committee (CTO evaluates capability, CISO evaluates risk, CDO evaluates data, CFO evaluates ROI, business sponsor evaluates value), and compensation structure ($150K-$300K OTE at top AI companies). Building technical authority with skeptical buyers.",
      "lessons": [
        {
          "title": "Foundations: The AI Sales Engineer Role — Technical Credibility Meets $300K OTE",
          "desc": "The AI SE market (Salesforce, Microsoft, Google, Anthropic, and 10,000 AI startups all hiring), the SE-AE partnership model (SE owns technical win, AE owns commercial win), the AI buying committee (CTO evaluates capability, CISO evaluates risk, CDO evaluates data, CFO evaluates ROI, business sponsor evaluates value), and compensation structure ($150K-$300K OTE at top AI companies). Building technical authority with skeptical buyers."
        },
        {
          "title": "Module 1.2 Deep Dive: Microsoft",
          "desc": "The AI SE market (Salesforce, Microsoft, Google, Anthropic, and 10,000 AI startups all hiring), the SE-AE partnership model (SE owns technical win, AE owns commercial win), the AI buying committee (CT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: Google",
          "desc": "The AI SE market (Salesforce, Microsoft, Google, Anthropic, and 10,000 AI startups all hiring), the SE-AE partnership model (SE owns technical win, AE owns commercial win), the AI buying committee (CT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: Anthropic",
          "desc": "The AI SE market (Salesforce, Microsoft, Google, Anthropic, and 10,000 AI startups all hiring), the SE-AE partnership model (SE owns technical win, AE owns commercial win), the AI buying committee (CT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: and 10",
          "desc": "The AI SE market (Salesforce, Microsoft, Google, Anthropic, and 10,000 AI startups all hiring), the SE-AE partnership model (SE owns technical win, AE owns commercial win), the AI buying committee (CT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: 000 AI startups all hiring)",
          "desc": "The AI SE market (Salesforce, Microsoft, Google, Anthropic, and 10,000 AI startups all hiring), the SE-AE partnership model (SE owns technical win, AE owns commercial win), the AI buying committee (CT. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: The AI Sales Engineer Role — Technical Credibility Meets $300K OTE. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI SE market (Salesforce, Microsoft, Google, Anthropic, and 10,000 AI startups all hiring), the SE-AE partnership model (SE owns technical win, AE"
        }
      ]
    },
    {
      "title": "Module 2: AI Discovery Engineering — Uncovering the Real Technical Requirements",
      "desc": "Technical discovery framework for AI opportunities (current state architecture, pain points, desired outcomes, technical constraints, data landscape, security requirements), MEDDIC adapted for AI (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion), qualifying AI opportunities, and the discovery-to-demo transition. Template: AI technical discovery questionnaire.",
      "lessons": [
        {
          "title": "Foundations: AI Discovery Engineering — Uncovering the Real Technical Requirements",
          "desc": "Technical discovery framework for AI opportunities (current state architecture, pain points, desired outcomes, technical constraints, data landscape, security requirements), MEDDIC adapted for AI (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion), qualifying AI opportunities, and the discovery-to-demo transition. Template: AI technical discovery questionnaire."
        },
        {
          "title": "Module 2.2 Deep Dive: pain points",
          "desc": "Technical discovery framework for AI opportunities (current state architecture, pain points, desired outcomes, technical constraints, data landscape, security requirements), MEDDIC adapted for AI (Met. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: desired outcomes",
          "desc": "Technical discovery framework for AI opportunities (current state architecture, pain points, desired outcomes, technical constraints, data landscape, security requirements), MEDDIC adapted for AI (Met. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: technical constraints",
          "desc": "Technical discovery framework for AI opportunities (current state architecture, pain points, desired outcomes, technical constraints, data landscape, security requirements), MEDDIC adapted for AI (Met. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: data landscape",
          "desc": "Technical discovery framework for AI opportunities (current state architecture, pain points, desired outcomes, technical constraints, data landscape, security requirements), MEDDIC adapted for AI (Met. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: security requirements)",
          "desc": "Technical discovery framework for AI opportunities (current state architecture, pain points, desired outcomes, technical constraints, data landscape, security requirements), MEDDIC adapted for AI (Met. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: AI Discovery Engineering — Uncovering the Real Technical Requirements. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Technical discovery framework for AI opportunities (current state architecture, pain points, desired outcomes, technical constraints, data landscape, "
        }
      ]
    },
    {
      "title": "Module 3: AI Product Demo Mastery — Value-First Demo Methodology",
      "desc": "Building demo environments that show customer-relevant value (not generic demos), the 'show don't tell' AI demo structure (establish pain → demonstrate relief → quantify value), handling live AI failures (they happen at the worst moments — recovery techniques), customizing demos for technical vs. business audiences, and the follow-on demo strategy. 10 common demo mistakes and how to avoid them.",
      "lessons": [
        {
          "title": "Foundations: AI Product Demo Mastery — Value-First Demo Methodology",
          "desc": "Building demo environments that show customer-relevant value (not generic demos), the 'show don't tell' AI demo structure (establish pain → demonstrate relief → quantify value), handling live AI failures (they happen at the worst moments — recovery techniques), customizing demos for technical vs. business audiences, and the follow-on demo strategy. 10 common demo mistakes and how to avoid them."
        },
        {
          "title": "Module 3.2 Deep Dive: the 'show don't tell' AI demo structure (establish pain → demonstrate relief → quantify value)",
          "desc": "10 common demo mistakes and how to avoid them.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: handling live AI failures (they happen at the worst moments — recovery techniques)",
          "desc": "Building demo environments that show customer-relevant value (not generic demos), the 'show don't tell' AI demo structure (establish pain → demonstrate relief → quantify value), handling live AI failu. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: customizing demos for technical vs. business audiences",
          "desc": "Building demo environments that show customer-relevant value (not generic demos), the 'show don't tell' AI demo structure (establish pain → demonstrate relief → quantify value), handling live AI failu. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: and the follow-on demo strategy. 10 common demo mistakes and how to avoid them.",
          "desc": "Building demo environments that show customer-relevant value (not generic demos), the 'show don't tell' AI demo structure (establish pain → demonstrate relief → quantify value), handling live AI failu. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: Building demo environments that show customer-relevant value",
          "desc": "Building demo environments that show customer-relevant value (not generic demos), the 'show don't tell' AI demo structure (establish pain → demonstrate relief → quantify value), handling live AI failu. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: AI Product Demo Mastery — Value-First Demo Methodology. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Building demo environments that show customer-relevant value (not generic demos), the 'show don't tell' AI demo structure (establish pain → demonstrat"
        }
      ]
    },
    {
      "title": "Module 4: Technical Objection Handling — The 50 AI Objections You'll Face",
      "desc": "The 50 most common AI technical objections (data privacy/sovereignty, model accuracy, integration complexity, vendor lock-in, explainability, cost, hallucination risk, regulatory compliance, model deprecation risk, open source alternatives), objection response frameworks (acknowledge → clarify → reframe → evidence → close), competitive objections, and the 'we'll build it ourselves' objection. Role-play playbook with documented objection handling.",
      "lessons": [
        {
          "title": "Foundations: Technical Objection Handling — The 50 AI Objections You'll Face",
          "desc": "The 50 most common AI technical objections (data privacy/sovereignty, model accuracy, integration complexity, vendor lock-in, explainability, cost, hallucination risk, regulatory compliance, model deprecation risk, open source alternatives), objection response frameworks (acknowledge → clarify → reframe → evidence → close), competitive objections, and the 'we'll build it ourselves' objection. Role-play playbook with documented objection handling."
        },
        {
          "title": "Module 4.2 Deep Dive: model accuracy",
          "desc": "The 50 most common AI technical objections (data privacy/sovereignty, model accuracy, integration complexity, vendor lock-in, explainability, cost, hallucination risk, regulatory compliance, model dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: integration complexity",
          "desc": "The 50 most common AI technical objections (data privacy/sovereignty, model accuracy, integration complexity, vendor lock-in, explainability, cost, hallucination risk, regulatory compliance, model dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: vendor lock-in",
          "desc": "The 50 most common AI technical objections (data privacy/sovereignty, model accuracy, integration complexity, vendor lock-in, explainability, cost, hallucination risk, regulatory compliance, model dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: explainability",
          "desc": "The 50 most common AI technical objections (data privacy/sovereignty, model accuracy, integration complexity, vendor lock-in, explainability, cost, hallucination risk, regulatory compliance, model dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: cost",
          "desc": "The 50 most common AI technical objections (data privacy/sovereignty, model accuracy, integration complexity, vendor lock-in, explainability, cost, hallucination risk, regulatory compliance, model dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Technical Objection Handling — The 50 AI Objections You'll Face. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The 50 most common AI technical objections (data privacy/sovereignty, model accuracy, integration complexity, vendor lock-in, explainability, cost, ha"
        }
      ]
    },
    {
      "title": "Module 5: Proof of Concept Design — The 6-Week PoC That Closes Deals",
      "desc": "PoC scoping methodology (success criteria before you start, or you'll fail on terms the customer defines later), PoC architecture (minimum viable implementation showing maximum business value), data requirements and data preparation support, PoC stakeholder management (keeping the champion engaged, managing executive expectations), measuring PoC success vs. failure, and the PoC-to-production expansion conversation. Case study: $5M deal won with 6-week PoC.",
      "lessons": [
        {
          "title": "Foundations: Proof of Concept Design — The 6-Week PoC That Closes Deals",
          "desc": "PoC scoping methodology (success criteria before you start, or you'll fail on terms the customer defines later), PoC architecture (minimum viable implementation showing maximum business value), data requirements and data preparation support, PoC stakeholder management (keeping the champion engaged, managing executive expectations), measuring PoC success vs. failure, and the PoC-to-production expansion conversation. Case study: $5M deal won with 6-week PoC."
        },
        {
          "title": "Module 5.2 Deep Dive: or you'll fail on terms the customer defines later)",
          "desc": "Case study: $5M deal won with 6-week PoC.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: PoC architecture (minimum viable implementation showing maximum business value)",
          "desc": "PoC scoping methodology (success criteria before you start, or you'll fail on terms the customer defines later), PoC architecture (minimum viable implementation showing maximum business value), data r. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: data requirements and data preparation support",
          "desc": "PoC scoping methodology (success criteria before you start, or you'll fail on terms the customer defines later), PoC architecture (minimum viable implementation showing maximum business value), data r. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: PoC stakeholder management (keeping the champion engaged",
          "desc": "PoC scoping methodology (success criteria before you start, or you'll fail on terms the customer defines later), PoC architecture (minimum viable implementation showing maximum business value), data r. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: managing executive expectations)",
          "desc": "PoC scoping methodology (success criteria before you start, or you'll fail on terms the customer defines later), PoC architecture (minimum viable implementation showing maximum business value), data r. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Proof of Concept Design — The 6-Week PoC That Closes Deals. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. PoC scoping methodology (success criteria before you start, or you'll fail on terms the customer defines later), PoC architecture (minimum viable impl"
        }
      ]
    },
    {
      "title": "Module 6: ROI Modeling — The CFO-Approved Business Case",
      "desc": "AI ROI model structure (cost savings + productivity gains + revenue uplift + risk reduction), industry-specific ROI benchmarks (financial services: 15-30% efficiency, healthcare: 20-40% diagnostic accuracy improvement, retail: 10-20% demand forecast improvement), sensitivity analysis presentation, payback period calculation, and presenting to the CFO. Template: Complete AI ROI model with visualization package.",
      "lessons": [
        {
          "title": "Foundations: ROI Modeling — The CFO-Approved Business Case",
          "desc": "AI ROI model structure (cost savings + productivity gains + revenue uplift + risk reduction), industry-specific ROI benchmarks (financial services: 15-30% efficiency, healthcare: 20-40% diagnostic accuracy improvement, retail: 10-20% demand forecast improvement), sensitivity analysis presentation, payback period calculation, and presenting to the CFO. Template: Complete AI ROI model with visualization package."
        },
        {
          "title": "Module 6.2 Deep Dive: industry-specific ROI benchmarks (financial services: 15-30% efficiency",
          "desc": "AI ROI model structure (cost savings + productivity gains + revenue uplift + risk reduction), industry-specific ROI benchmarks (financial services: 15-30% efficiency, healthcare: 20-40% diagnostic acc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: healthcare: 20-40% diagnostic accuracy improvement",
          "desc": "AI ROI model structure (cost savings + productivity gains + revenue uplift + risk reduction), industry-specific ROI benchmarks (financial services: 15-30% efficiency, healthcare: 20-40% diagnostic acc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: retail: 10-20% demand forecast improvement)",
          "desc": "AI ROI model structure (cost savings + productivity gains + revenue uplift + risk reduction), industry-specific ROI benchmarks (financial services: 15-30% efficiency, healthcare: 20-40% diagnostic acc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: sensitivity analysis presentation",
          "desc": "AI ROI model structure (cost savings + productivity gains + revenue uplift + risk reduction), industry-specific ROI benchmarks (financial services: 15-30% efficiency, healthcare: 20-40% diagnostic acc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: payback period calculation",
          "desc": "AI ROI model structure (cost savings + productivity gains + revenue uplift + risk reduction), industry-specific ROI benchmarks (financial services: 15-30% efficiency, healthcare: 20-40% diagnostic acc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: ROI Modeling — The CFO-Approved Business Case. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI ROI model structure (cost savings + productivity gains + revenue uplift + risk reduction), industry-specific ROI benchmarks (financial services: 15"
        }
      ]
    },
    {
      "title": "Module 7: AI Integration Architecture for Sales Conversations",
      "desc": "Enterprise integration patterns every AI SE must know (REST APIs, webhooks, batch ETL, streaming, SSO/SAML/OIDC), explaining AI integration complexity honestly (over-promising integration ease is the #1 cause of failed implementations), security and compliance requirements for enterprise AI (SOC2, ISO 27001, HIPAA, FedRAMP), and positioning your AI product's integration story vs. competitors.",
      "lessons": [
        {
          "title": "Foundations: AI Integration Architecture for Sales Conversations",
          "desc": "Enterprise integration patterns every AI SE must know (REST APIs, webhooks, batch ETL, streaming, SSO/SAML/OIDC), explaining AI integration complexity honestly (over-promising integration ease is the #1 cause of failed implementations), security and compliance requirements for enterprise AI (SOC2, ISO 27001, HIPAA, FedRAMP), and positioning your AI product's integration story vs. competitors."
        },
        {
          "title": "Module 7.2 Deep Dive: webhooks",
          "desc": "Enterprise integration patterns every AI SE must know (REST APIs, webhooks, batch ETL, streaming, SSO/SAML/OIDC), explaining AI integration complexity honestly (over-promising integration ease is the . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: batch ETL",
          "desc": "Enterprise integration patterns every AI SE must know (REST APIs, webhooks, batch ETL, streaming, SSO/SAML/OIDC), explaining AI integration complexity honestly (over-promising integration ease is the . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: streaming",
          "desc": "Enterprise integration patterns every AI SE must know (REST APIs, webhooks, batch ETL, streaming, SSO/SAML/OIDC), explaining AI integration complexity honestly (over-promising integration ease is the . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: SSO/SAML/OIDC)",
          "desc": "Enterprise integration patterns every AI SE must know (REST APIs, webhooks, batch ETL, streaming, SSO/SAML/OIDC), explaining AI integration complexity honestly (over-promising integration ease is the . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: explaining AI integration complexity honestly (over-promising integration ease is the #1 cause of failed implementations)",
          "desc": "Enterprise integration patterns every AI SE must know (REST APIs, webhooks, batch ETL, streaming, SSO/SAML/OIDC), explaining AI integration complexity honestly (over-promising integration ease is the . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: AI Integration Architecture for Sales Conversations. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Enterprise integration patterns every AI SE must know (REST APIs, webhooks, batch ETL, streaming, SSO/SAML/OIDC), explaining AI integration complexity"
        }
      ]
    },
    {
      "title": "Module 8: Competitive Intelligence and Battle Card Mastery",
      "desc": "The AI competitive landscape (hyperscaler AI vs. vertical AI vs. horizontal AI platforms), building battle cards (strengths, weaknesses, how-to-win, how-to-lose, landmines to plant), the technical competitive differentiation framework, gathering competitive intelligence ethically, and the 'bake-off' strategy when customers evaluate multiple vendors. Case study: Winning a 4-vendor AI evaluation.",
      "lessons": [
        {
          "title": "Foundations: Competitive Intelligence and Battle Card Mastery",
          "desc": "The AI competitive landscape (hyperscaler AI vs. vertical AI vs. horizontal AI platforms), building battle cards (strengths, weaknesses, how-to-win, how-to-lose, landmines to plant), the technical competitive differentiation framework, gathering competitive intelligence ethically, and the 'bake-off' strategy when customers evaluate multiple vendors. Case study: Winning a 4-vendor AI evaluation."
        },
        {
          "title": "Module 8.2 Deep Dive: building battle cards (strengths",
          "desc": "Case study: Winning a 4-vendor AI evaluation.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: weaknesses",
          "desc": "The AI competitive landscape (hyperscaler AI vs. vertical AI vs. horizontal AI platforms), building battle cards (strengths, weaknesses, how-to-win, how-to-lose, landmines to plant), the technical com. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: how-to-win",
          "desc": "The AI competitive landscape (hyperscaler AI vs. vertical AI vs. horizontal AI platforms), building battle cards (strengths, weaknesses, how-to-win, how-to-lose, landmines to plant), the technical com. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: how-to-lose",
          "desc": "The AI competitive landscape (hyperscaler AI vs. vertical AI vs. horizontal AI platforms), building battle cards (strengths, weaknesses, how-to-win, how-to-lose, landmines to plant), the technical com. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: landmines to plant)",
          "desc": "The AI competitive landscape (hyperscaler AI vs. vertical AI vs. horizontal AI platforms), building battle cards (strengths, weaknesses, how-to-win, how-to-lose, landmines to plant), the technical com. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Competitive Intelligence and Battle Card Mastery. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI competitive landscape (hyperscaler AI vs. vertical AI vs. horizontal AI platforms), building battle cards (strengths, weaknesses, how-to-win, h"
        }
      ]
    },
    {
      "title": "Module 9: Enterprise Procurement — Security Reviews, Legal, and Negotiation",
      "desc": "The enterprise AI procurement gauntlet (security questionnaire → InfoSec review → legal review → DPA negotiation → procurement → executive approval), navigating InfoSec reviews for AI products (common security questionnaire failures and how to preempt them), GDPR/CCPA Data Processing Agreements for AI, procurement negotiation tactics (discount authority, end-of-quarter dynamics, multi-year deals), and the final negotiation.",
      "lessons": [
        {
          "title": "Foundations: Enterprise Procurement — Security Reviews, Legal, and Negotiation",
          "desc": "The enterprise AI procurement gauntlet (security questionnaire → InfoSec review → legal review → DPA negotiation → procurement → executive approval), navigating InfoSec reviews for AI products (common security questionnaire failures and how to preempt them), GDPR/CCPA Data Processing Agreements for AI, procurement negotiation tactics (discount authority, end-of-quarter dynamics, multi-year deals), and the final negotiation."
        },
        {
          "title": "Module 9.2 Deep Dive: navigating InfoSec reviews for AI products (common security questionnaire failures and how to preempt them)",
          "desc": "The enterprise AI procurement gauntlet (security questionnaire → InfoSec review → legal review → DPA negotiation → procurement → executive approval), navigating InfoSec reviews for AI products (common. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: GDPR/CCPA Data Processing Agreements for AI",
          "desc": "The enterprise AI procurement gauntlet (security questionnaire → InfoSec review → legal review → DPA negotiation → procurement → executive approval), navigating InfoSec reviews for AI products (common. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: procurement negotiation tactics (discount authority",
          "desc": "The enterprise AI procurement gauntlet (security questionnaire → InfoSec review → legal review → DPA negotiation → procurement → executive approval), navigating InfoSec reviews for AI products (common. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: end-of-quarter dynamics",
          "desc": "The enterprise AI procurement gauntlet (security questionnaire → InfoSec review → legal review → DPA negotiation → procurement → executive approval), navigating InfoSec reviews for AI products (common. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: multi-year deals)",
          "desc": "The enterprise AI procurement gauntlet (security questionnaire → InfoSec review → legal review → DPA negotiation → procurement → executive approval), navigating InfoSec reviews for AI products (common. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Enterprise Procurement — Security Reviews, Legal, and Negotiation. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The enterprise AI procurement gauntlet (security questionnaire → InfoSec review → legal review → DPA negotiation → procurement → executive approval), "
        }
      ]
    },
    {
      "title": "Module 10: SE Career Development and Full Deal Simulation Capstone",
      "desc": "AI SE career progression (IC → Senior → Principal → SE Manager → VP SE), building your AI technical brand, thought leadership that attracts inbound opportunities, and the capstone: a complete simulated enterprise AI deal simulation — technical discovery call, customized demo, objection handling session, PoC design document, ROI model, and executive business review presentation.",
      "lessons": [
        {
          "title": "Foundations: SE Career Development and Full Deal Simulation Capstone",
          "desc": "AI SE career progression (IC → Senior → Principal → SE Manager → VP SE), building your AI technical brand, thought leadership that attracts inbound opportunities, and the capstone: a complete simulated enterprise AI deal simulation — technical discovery call, customized demo, objection handling session, PoC design document, ROI model, and executive business review presentation."
        },
        {
          "title": "Module 10.2 Deep Dive: building your AI technical brand",
          "desc": "AI SE career progression (IC → Senior → Principal → SE Manager → VP SE), building your AI technical brand, thought leadership that attracts inbound opportunities, and the capstone: a complete simulate. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: thought leadership that attracts inbound opportunities",
          "desc": "AI SE career progression (IC → Senior → Principal → SE Manager → VP SE), building your AI technical brand, thought leadership that attracts inbound opportunities, and the capstone: a complete simulate. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: and the capstone: a complete simulated enterprise AI deal simulation — technical discovery call",
          "desc": "AI SE career progression (IC → Senior → Principal → SE Manager → VP SE), building your AI technical brand, thought leadership that attracts inbound opportunities, and the capstone: a complete simulate. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: customized demo",
          "desc": "AI SE career progression (IC → Senior → Principal → SE Manager → VP SE), building your AI technical brand, thought leadership that attracts inbound opportunities, and the capstone: a complete simulate. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: objection handling session",
          "desc": "AI SE career progression (IC → Senior → Principal → SE Manager → VP SE), building your AI technical brand, thought leadership that attracts inbound opportunities, and the capstone: a complete simulate. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: SE Career Development and Full Deal Simulation Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI SE career progression (IC → Senior → Principal → SE Manager → VP SE), building your AI technical brand, thought leadership that attracts inbound op"
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
