import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Program Manager",
  "description": "Master program management for complex AI initiatives — from portfolio planning through delivery and value realization. 10 modules combining PMP, SAFe Agile, and AI-specific program management used at Google, Microsoft, and leading AI companies.",
  "translations": {
    "es": {
      "title": "AI Program Manager",
      "description": "Master program management for complex AI initiatives — from portfolio planning through delivery and value realization. 10 modules combining PMP, SAFe Agile, and AI-specific program management used at "
    },
    "fr": {
      "title": "AI Program Manager",
      "description": "Master program management for complex AI initiatives — from portfolio planning through delivery and value realization. 10 modules combining PMP, SAFe Agile, and AI-specific program management used at "
    },
    "de": {
      "title": "AI Program Manager",
      "description": "Master program management for complex AI initiatives — from portfolio planning through delivery and value realization. 10 modules combining PMP, SAFe Agile, and AI-specific program management used at "
    },
    "zh": {
      "title": "AI Program Manager",
      "description": "Master program management for complex AI initiatives — from portfolio planning through delivery and value realization. 10 modules combining PMP, SAFe Agile, and AI-specific program management used at "
    },
    "ar": {
      "title": "AI Program Manager",
      "description": "Master program management for complex AI initiatives — from portfolio planning through delivery and value realization. 10 modules combining PMP, SAFe Agile, and AI-specific program management used at "
    },
    "ja": {
      "title": "AI Program Manager",
      "description": "Master program management for complex AI initiatives — from portfolio planning through delivery and value realization. 10 modules combining PMP, SAFe Agile, and AI-specific program management used at "
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Program Management Fundamentals",
      "desc": "Program vs. project vs. portfolio management for AI (the three-level model), the AI program lifecycle (strategy → initiation → planning → execution → monitoring → closure), PMI PMBOK 7 adapted for AI programs, unique AI program challenges (research dependencies, probabilistic timelines, data dependencies, model uncertainty), and the AI program manager's value proposition. Case study: Managing Google's 1,000+ active AI programs.",
      "lessons": [
        {
          "title": "Foundations: AI Program Management Fundamentals",
          "desc": "Program vs. project vs. portfolio management for AI (the three-level model), the AI program lifecycle (strategy → initiation → planning → execution → monitoring → closure), PMI PMBOK 7 adapted for AI programs, unique AI program challenges (research dependencies, probabilistic timelines, data dependencies, model uncertainty), and the AI program manager's value proposition. Case study: Managing Google's 1,000+ active AI programs."
        },
        {
          "title": "Module 1.2 Deep Dive: the AI program lifecycle (strategy → initiation → planning → execution → monitoring → closure)",
          "desc": "Program vs. project vs. portfolio management for AI (the three-level model), the AI program lifecycle (strategy → initiation → planning → execution → monitoring → closure), PMI PMBOK 7 adapted for AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: PMI PMBOK 7 adapted for AI programs",
          "desc": "Program vs. project vs. portfolio management for AI (the three-level model), the AI program lifecycle (strategy → initiation → planning → execution → monitoring → closure), PMI PMBOK 7 adapted for AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: unique AI program challenges (research dependencies",
          "desc": "Program vs. project vs. portfolio management for AI (the three-level model), the AI program lifecycle (strategy → initiation → planning → execution → monitoring → closure), PMI PMBOK 7 adapted for AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: probabilistic timelines",
          "desc": "Program vs. project vs. portfolio management for AI (the three-level model), the AI program lifecycle (strategy → initiation → planning → execution → monitoring → closure), PMI PMBOK 7 adapted for AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: data dependencies",
          "desc": "Program vs. project vs. portfolio management for AI (the three-level model), the AI program lifecycle (strategy → initiation → planning → execution → monitoring → closure), PMI PMBOK 7 adapted for AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Program Management Fundamentals. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Program vs. project vs. portfolio management for AI (the three-level model), the AI program lifecycle (strategy → initiation → planning → execution → "
        }
      ]
    },
    {
      "title": "Module 2: AI Program Planning — Scope, Timeline, and Resource Management",
      "desc": "AI program scope definition (preventing research scope creep), timeline planning with AI uncertainty (Monte Carlo simulation for ML project schedules — never give a single date for AI projects), resource planning for scarce AI talent (the ML engineer supply constraint), dependency mapping for AI programs (data dependencies, model dependencies, infrastructure dependencies), and the AI program plan template.",
      "lessons": [
        {
          "title": "Foundations: AI Program Planning — Scope, Timeline, and Resource Management",
          "desc": "AI program scope definition (preventing research scope creep), timeline planning with AI uncertainty (Monte Carlo simulation for ML project schedules — never give a single date for AI projects), resource planning for scarce AI talent (the ML engineer supply constraint), dependency mapping for AI programs (data dependencies, model dependencies, infrastructure dependencies), and the AI program plan template."
        },
        {
          "title": "Module 2.2 Deep Dive: timeline planning with AI uncertainty (Monte Carlo simulation for ML project schedules — never give a single date for AI projects)",
          "desc": "AI program scope definition (preventing research scope creep), timeline planning with AI uncertainty (Monte Carlo simulation for ML project schedules — never give a single date for AI projects), resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: resource planning for scarce AI talent (the ML engineer supply constraint)",
          "desc": "AI program scope definition (preventing research scope creep), timeline planning with AI uncertainty (Monte Carlo simulation for ML project schedules — never give a single date for AI projects), resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: dependency mapping for AI programs (data dependencies",
          "desc": "AI program scope definition (preventing research scope creep), timeline planning with AI uncertainty (Monte Carlo simulation for ML project schedules — never give a single date for AI projects), resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: model dependencies",
          "desc": "AI program scope definition (preventing research scope creep), timeline planning with AI uncertainty (Monte Carlo simulation for ML project schedules — never give a single date for AI projects), resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: infrastructure dependencies)",
          "desc": "AI program scope definition (preventing research scope creep), timeline planning with AI uncertainty (Monte Carlo simulation for ML project schedules — never give a single date for AI projects), resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: AI Program Planning — Scope, Timeline, and Resource Management. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI program scope definition (preventing research scope creep), timeline planning with AI uncertainty (Monte Carlo simulation for ML project schedules "
        }
      ]
    },
    {
      "title": "Module 3: Agile Program Management — SAFe, LeSS, and the Spotify Model for AI",
      "desc": "SAFe (Scaled Agile Framework) applied to AI programs (ART for AI — the Agile Release Train), LeSS (Large-Scale Scrum) for ML team coordination, the Spotify model squads/tribes/chapters/guilds applied to AI organizations, PI Planning for AI programs (Program Increment Planning with ML-specific ceremonies), and managing the research vs. delivery tension. What Scrum masters need to know about ML sprints.",
      "lessons": [
        {
          "title": "Foundations: Agile Program Management — SAFe, LeSS, and the Spotify Model for AI",
          "desc": "SAFe (Scaled Agile Framework) applied to AI programs (ART for AI — the Agile Release Train), LeSS (Large-Scale Scrum) for ML team coordination, the Spotify model squads/tribes/chapters/guilds applied to AI organizations, PI Planning for AI programs (Program Increment Planning with ML-specific ceremonies), and managing the research vs. delivery tension. What Scrum masters need to know about ML sprints."
        },
        {
          "title": "Module 3.2 Deep Dive: LeSS (Large-Scale Scrum) for ML team coordination",
          "desc": "SAFe (Scaled Agile Framework) applied to AI programs (ART for AI — the Agile Release Train), LeSS (Large-Scale Scrum) for ML team coordination, the Spotify model squads/tribes/chapters/guilds applied . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: the Spotify model squads/tribes/chapters/guilds applied to AI organizations",
          "desc": "SAFe (Scaled Agile Framework) applied to AI programs (ART for AI — the Agile Release Train), LeSS (Large-Scale Scrum) for ML team coordination, the Spotify model squads/tribes/chapters/guilds applied . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: PI Planning for AI programs (Program Increment Planning with ML-specific ceremonies)",
          "desc": "SAFe (Scaled Agile Framework) applied to AI programs (ART for AI — the Agile Release Train), LeSS (Large-Scale Scrum) for ML team coordination, the Spotify model squads/tribes/chapters/guilds applied . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: and managing the research vs. delivery tension. What Scrum masters need to know about ML sprints.",
          "desc": "SAFe (Scaled Agile Framework) applied to AI programs (ART for AI — the Agile Release Train), LeSS (Large-Scale Scrum) for ML team coordination, the Spotify model squads/tribes/chapters/guilds applied . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: SAFe (Scaled Agile Framework) applied to AI programs (ART fo",
          "desc": "SAFe (Scaled Agile Framework) applied to AI programs (ART for AI — the Agile Release Train), LeSS (Large-Scale Scrum) for ML team coordination, the Spotify model squads/tribes/chapters/guilds applied . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Agile Program Management — SAFe, LeSS, and the Spotify Model for AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. SAFe (Scaled Agile Framework) applied to AI programs (ART for AI — the Agile Release Train), LeSS (Large-Scale Scrum) for ML team coordination, the Sp"
        }
      ]
    },
    {
      "title": "Module 4: Stakeholder Management and Executive Communication",
      "desc": "AI program stakeholder mapping (who influences success?), the AI program status report that executives actually read (the one-page format with the three questions: Are we on track? Do we have what we need? What decisions do you need to make?), managing up effectively (communicating AI uncertainty to non-technical executives), managing across (coordinating business, IT, and data science stakeholders), and the steering committee governance. Template: AI program dashboard.",
      "lessons": [
        {
          "title": "Foundations: Stakeholder Management and Executive Communication",
          "desc": "AI program stakeholder mapping (who influences success?), the AI program status report that executives actually read (the one-page format with the three questions: Are we on track? Do we have what we need? What decisions do you need to make?), managing up effectively (communicating AI uncertainty to non-technical executives), managing across (coordinating business, IT, and data science stakeholders), and the steering committee governance. Template: AI program dashboard."
        },
        {
          "title": "Module 4.2 Deep Dive: the AI program status report that executives actually read (the one-page format with the three questions: Are we on track? Do we have what we need? What decisions do you need to make?)",
          "desc": "AI program stakeholder mapping (who influences success?), the AI program status report that executives actually read (the one-page format with the three questions: Are we on track? Do we have what we . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: managing up effectively (communicating AI uncertainty to non-technical executives)",
          "desc": "AI program stakeholder mapping (who influences success?), the AI program status report that executives actually read (the one-page format with the three questions: Are we on track? Do we have what we . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: managing across (coordinating business",
          "desc": "AI program stakeholder mapping (who influences success?), the AI program status report that executives actually read (the one-page format with the three questions: Are we on track? Do we have what we . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: IT",
          "desc": "AI program stakeholder mapping (who influences success?), the AI program status report that executives actually read (the one-page format with the three questions: Are we on track? Do we have what we . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: and data science stakeholders)",
          "desc": "AI program stakeholder mapping (who influences success?), the AI program status report that executives actually read (the one-page format with the three questions: Are we on track? Do we have what we . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Stakeholder Management and Executive Communication. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI program stakeholder mapping (who influences success?), the AI program status report that executives actually read (the one-page format with the thr"
        }
      ]
    },
    {
      "title": "Module 5: AI Program Risk Management — The Risks That Kill AI Programs",
      "desc": "AI-specific program risk taxonomy (technical: model performance risk, data quality risk; organizational: talent attrition, sponsorship loss; regulatory: compliance requirement changes; vendor: API deprecation, pricing changes; ethical: bias discovery post-launch), the AI program risk register, risk probability × impact scoring, risk response strategies (avoid/reduce/transfer/accept), and the early warning indicators for at-risk AI programs.",
      "lessons": [
        {
          "title": "Foundations: AI Program Risk Management — The Risks That Kill AI Programs",
          "desc": "AI-specific program risk taxonomy (technical: model performance risk, data quality risk; organizational: talent attrition, sponsorship loss; regulatory: compliance requirement changes; vendor: API deprecation, pricing changes; ethical: bias discovery post-launch), the AI program risk register, risk probability × impact scoring, risk response strategies (avoid/reduce/transfer/accept), and the early warning indicators for at-risk AI programs."
        },
        {
          "title": "Module 5.2 Deep Dive: data quality risk; organizational: talent attrition",
          "desc": "AI-specific program risk taxonomy (technical: model performance risk, data quality risk; organizational: talent attrition, sponsorship loss; regulatory: compliance requirement changes; vendor: API dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: sponsorship loss; regulatory: compliance requirement changes; vendor: API deprecation",
          "desc": "AI-specific program risk taxonomy (technical: model performance risk, data quality risk; organizational: talent attrition, sponsorship loss; regulatory: compliance requirement changes; vendor: API dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: pricing changes; ethical: bias discovery post-launch)",
          "desc": "AI-specific program risk taxonomy (technical: model performance risk, data quality risk; organizational: talent attrition, sponsorship loss; regulatory: compliance requirement changes; vendor: API dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: the AI program risk register",
          "desc": "AI-specific program risk taxonomy (technical: model performance risk, data quality risk; organizational: talent attrition, sponsorship loss; regulatory: compliance requirement changes; vendor: API dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: risk probability × impact scoring",
          "desc": "AI-specific program risk taxonomy (technical: model performance risk, data quality risk; organizational: talent attrition, sponsorship loss; regulatory: compliance requirement changes; vendor: API dep. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: AI Program Risk Management — The Risks That Kill AI Programs. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI-specific program risk taxonomy (technical: model performance risk, data quality risk; organizational: talent attrition, sponsorship loss; regulator"
        }
      ]
    },
    {
      "title": "Module 6: AI Program Budget Management and FinOps",
      "desc": "AI program budget structure (compute infrastructure, data acquisition, talent, tools, licenses — and why compute is often 60% of budget), cloud cost management for AI programs (budget alerts at 80%/100%, reserved capacity planning, spot instance strategy), the build-vs-buy financial analysis for AI programs, managing budget variances in research-heavy programs, and AI program financial reporting. Template: AI program budget tracker with scenario modeling.",
      "lessons": [
        {
          "title": "Foundations: AI Program Budget Management and FinOps",
          "desc": "AI program budget structure (compute infrastructure, data acquisition, talent, tools, licenses — and why compute is often 60% of budget), cloud cost management for AI programs (budget alerts at 80%/100%, reserved capacity planning, spot instance strategy), the build-vs-buy financial analysis for AI programs, managing budget variances in research-heavy programs, and AI program financial reporting. Template: AI program budget tracker with scenario modeling."
        },
        {
          "title": "Module 6.2 Deep Dive: data acquisition",
          "desc": "AI program budget structure (compute infrastructure, data acquisition, talent, tools, licenses — and why compute is often 60% of budget), cloud cost management for AI programs (budget alerts at 80%/10. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: talent",
          "desc": "AI program budget structure (compute infrastructure, data acquisition, talent, tools, licenses — and why compute is often 60% of budget), cloud cost management for AI programs (budget alerts at 80%/10. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: tools",
          "desc": "AI program budget structure (compute infrastructure, data acquisition, talent, tools, licenses — and why compute is often 60% of budget), cloud cost management for AI programs (budget alerts at 80%/10. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: licenses — and why compute is often 60% of budget)",
          "desc": "AI program budget structure (compute infrastructure, data acquisition, talent, tools, licenses — and why compute is often 60% of budget), cloud cost management for AI programs (budget alerts at 80%/10. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: cloud cost management for AI programs (budget alerts at 80%/100%",
          "desc": "AI program budget structure (compute infrastructure, data acquisition, talent, tools, licenses — and why compute is often 60% of budget), cloud cost management for AI programs (budget alerts at 80%/10. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: AI Program Budget Management and FinOps. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI program budget structure (compute infrastructure, data acquisition, talent, tools, licenses — and why compute is often 60% of budget), cloud cost m"
        }
      ]
    },
    {
      "title": "Module 7: Vendor and Partner Management for AI Programs",
      "desc": "AI vendor evaluation and selection methodology (RFP for AI services, vendor scoring matrix), AI service SLA negotiation (model performance SLAs are new — how to structure them), vendor risk assessment for AI (single-vendor concentration risk, API deprecation risk, pricing risk), managing multi-vendor AI programs (coordination overhead, integration complexity), and the vendor governance framework.",
      "lessons": [
        {
          "title": "Foundations: Vendor and Partner Management for AI Programs",
          "desc": "AI vendor evaluation and selection methodology (RFP for AI services, vendor scoring matrix), AI service SLA negotiation (model performance SLAs are new — how to structure them), vendor risk assessment for AI (single-vendor concentration risk, API deprecation risk, pricing risk), managing multi-vendor AI programs (coordination overhead, integration complexity), and the vendor governance framework."
        },
        {
          "title": "Module 7.2 Deep Dive: vendor scoring matrix)",
          "desc": "AI vendor evaluation and selection methodology (RFP for AI services, vendor scoring matrix), AI service SLA negotiation (model performance SLAs are new — how to structure them), vendor risk assessment. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: AI service SLA negotiation (model performance SLAs are new — how to structure them)",
          "desc": "AI vendor evaluation and selection methodology (RFP for AI services, vendor scoring matrix), AI service SLA negotiation (model performance SLAs are new — how to structure them), vendor risk assessment. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: vendor risk assessment for AI (single-vendor concentration risk",
          "desc": "AI vendor evaluation and selection methodology (RFP for AI services, vendor scoring matrix), AI service SLA negotiation (model performance SLAs are new — how to structure them), vendor risk assessment. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: API deprecation risk",
          "desc": "AI vendor evaluation and selection methodology (RFP for AI services, vendor scoring matrix), AI service SLA negotiation (model performance SLAs are new — how to structure them), vendor risk assessment. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: pricing risk)",
          "desc": "AI vendor evaluation and selection methodology (RFP for AI services, vendor scoring matrix), AI service SLA negotiation (model performance SLAs are new — how to structure them), vendor risk assessment. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Vendor and Partner Management for AI Programs. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI vendor evaluation and selection methodology (RFP for AI services, vendor scoring matrix), AI service SLA negotiation (model performance SLAs are ne"
        }
      ]
    },
    {
      "title": "Module 8: AI Ethics and Responsible AI in Program Delivery",
      "desc": "Responsible AI framework integration into program management (NIST AI RMF governance function applied to programs), ethics review checkpoints in the AI program lifecycle, managing mid-program ethical discoveries (what to do when bias is found 80% through development), the 'kill switch' decision framework for harmful AI programs, and building responsible AI gates into program approval processes.",
      "lessons": [
        {
          "title": "Foundations: AI Ethics and Responsible AI in Program Delivery",
          "desc": "Responsible AI framework integration into program management (NIST AI RMF governance function applied to programs), ethics review checkpoints in the AI program lifecycle, managing mid-program ethical discoveries (what to do when bias is found 80% through development), the 'kill switch' decision framework for harmful AI programs, and building responsible AI gates into program approval processes."
        },
        {
          "title": "Module 8.2 Deep Dive: ethics review checkpoints in the AI program lifecycle",
          "desc": "Responsible AI framework integration into program management (NIST AI RMF governance function applied to programs), ethics review checkpoints in the AI program lifecycle, managing mid-program ethical . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: managing mid-program ethical discoveries (what to do when bias is found 80% through development)",
          "desc": "Responsible AI framework integration into program management (NIST AI RMF governance function applied to programs), ethics review checkpoints in the AI program lifecycle, managing mid-program ethical . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: the 'kill switch' decision framework for harmful AI programs",
          "desc": "Responsible AI framework integration into program management (NIST AI RMF governance function applied to programs), ethics review checkpoints in the AI program lifecycle, managing mid-program ethical . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: and building responsible AI gates into program approval processes.",
          "desc": "Responsible AI framework integration into program management (NIST AI RMF governance function applied to programs), ethics review checkpoints in the AI program lifecycle, managing mid-program ethical . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: Responsible AI framework integration into program management",
          "desc": "Responsible AI framework integration into program management (NIST AI RMF governance function applied to programs), ethics review checkpoints in the AI program lifecycle, managing mid-program ethical . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: AI Ethics and Responsible AI in Program Delivery. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Responsible AI framework integration into program management (NIST AI RMF governance function applied to programs), ethics review checkpoints in the A"
        }
      ]
    },
    {
      "title": "Module 9: AI Program Quality and Testing Management",
      "desc": "Quality management planning for AI programs (test strategy: unit → integration → system → acceptance → production monitoring), managing the model validation process (independent validation requirement, timeline impact), coordinating UAT for AI features (users testing probabilistic systems need special guidance), managing defects in ML systems (what is a 'bug' in an AI system?), and the AI program go-live criteria.",
      "lessons": [
        {
          "title": "Foundations: AI Program Quality and Testing Management",
          "desc": "Quality management planning for AI programs (test strategy: unit → integration → system → acceptance → production monitoring), managing the model validation process (independent validation requirement, timeline impact), coordinating UAT for AI features (users testing probabilistic systems need special guidance), managing defects in ML systems (what is a 'bug' in an AI system?), and the AI program go-live criteria."
        },
        {
          "title": "Module 9.2 Deep Dive: managing the model validation process (independent validation requirement",
          "desc": "Quality management planning for AI programs (test strategy: unit → integration → system → acceptance → production monitoring), managing the model validation process (independent validation requirement. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: timeline impact)",
          "desc": "Quality management planning for AI programs (test strategy: unit → integration → system → acceptance → production monitoring), managing the model validation process (independent validation requirement. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: coordinating UAT for AI features (users testing probabilistic systems need special guidance)",
          "desc": "Quality management planning for AI programs (test strategy: unit → integration → system → acceptance → production monitoring), managing the model validation process (independent validation requirement. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: managing defects in ML systems (what is a 'bug' in an AI system?)",
          "desc": "Quality management planning for AI programs (test strategy: unit → integration → system → acceptance → production monitoring), managing the model validation process (independent validation requirement. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: and the AI program go-live criteria.",
          "desc": "Quality management planning for AI programs (test strategy: unit → integration → system → acceptance → production monitoring), managing the model validation process (independent validation requirement. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: AI Program Quality and Testing Management. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Quality management planning for AI programs (test strategy: unit → integration → system → acceptance → production monitoring), managing the model vali"
        }
      ]
    },
    {
      "title": "Module 10: AI Program Leadership and Capstone",
      "desc": "AI PM career path and compensation ($150K-$280K for senior AI PMs), building the AI PMO, lessons from the most expensive AI program failures (and what better program management would have changed), and the capstone: develop a complete program charter, integrated program plan, risk register, stakeholder management plan, communication plan, and budget for a complex multi-stream AI transformation program.",
      "lessons": [
        {
          "title": "Foundations: AI Program Leadership and Capstone",
          "desc": "AI PM career path and compensation ($150K-$280K for senior AI PMs), building the AI PMO, lessons from the most expensive AI program failures (and what better program management would have changed), and the capstone: develop a complete program charter, integrated program plan, risk register, stakeholder management plan, communication plan, and budget for a complex multi-stream AI transformation program."
        },
        {
          "title": "Module 10.2 Deep Dive: building the AI PMO",
          "desc": "AI PM career path and compensation ($150K-$280K for senior AI PMs), building the AI PMO, lessons from the most expensive AI program failures (and what better program management would have changed), an. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: lessons from the most expensive AI program failures (and what better program management would have changed)",
          "desc": "AI PM career path and compensation ($150K-$280K for senior AI PMs), building the AI PMO, lessons from the most expensive AI program failures (and what better program management would have changed), an. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: and the capstone: develop a complete program charter",
          "desc": "AI PM career path and compensation ($150K-$280K for senior AI PMs), building the AI PMO, lessons from the most expensive AI program failures (and what better program management would have changed), an. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: integrated program plan",
          "desc": "AI PM career path and compensation ($150K-$280K for senior AI PMs), building the AI PMO, lessons from the most expensive AI program failures (and what better program management would have changed), an. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: risk register",
          "desc": "AI PM career path and compensation ($150K-$280K for senior AI PMs), building the AI PMO, lessons from the most expensive AI program failures (and what better program management would have changed), an. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: AI Program Leadership and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI PM career path and compensation ($150K-$280K for senior AI PMs), building the AI PMO, lessons from the most expensive AI program failures (and what"
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
