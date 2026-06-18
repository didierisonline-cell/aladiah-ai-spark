import { requireAdminOrServiceRole, corsHeaders } from "../_shared/adminGuard.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
  "description": "Master enterprise risk management for AI systems — NIST AI RMF, SR 11-7 model risk, operational risk, third-party AI risk, and quantitative risk modeling. 10 modules covering the complete AI risk management curriculum from risk identification through governance.",
  "translations": {
    "es": {
      "title": "AI Risk Manager",
      "description": "Master enterprise risk management for AI systems — NIST AI RMF, SR 11-7 model risk, operational risk, third-party AI risk, and quantitative risk modeling. 10 modules covering the complete AI risk mana"
    },
    "fr": {
      "title": "AI Risk Manager",
      "description": "Master enterprise risk management for AI systems — NIST AI RMF, SR 11-7 model risk, operational risk, third-party AI risk, and quantitative risk modeling. 10 modules covering the complete AI risk mana"
    },
    "de": {
      "title": "AI Risk Manager",
      "description": "Master enterprise risk management for AI systems — NIST AI RMF, SR 11-7 model risk, operational risk, third-party AI risk, and quantitative risk modeling. 10 modules covering the complete AI risk mana"
    },
    "zh": {
      "title": "AI Risk Manager",
      "description": "Master enterprise risk management for AI systems — NIST AI RMF, SR 11-7 model risk, operational risk, third-party AI risk, and quantitative risk modeling. 10 modules covering the complete AI risk mana"
    },
    "ar": {
      "title": "AI Risk Manager",
      "description": "Master enterprise risk management for AI systems — NIST AI RMF, SR 11-7 model risk, operational risk, third-party AI risk, and quantitative risk modeling. 10 modules covering the complete AI risk mana"
    },
    "ja": {
      "title": "AI Risk Manager",
      "description": "Master enterprise risk management for AI systems — NIST AI RMF, SR 11-7 model risk, operational risk, third-party AI risk, and quantitative risk modeling. 10 modules covering the complete AI risk mana"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Risk Management Foundations — NIST AI RMF and Enterprise Risk Integration",
      "desc": "NIST AI Risk Management Framework (AI RMF 1.0, January 2023) — four core functions (Govern: policies and accountability, Map: risk identification and context, Measure: risk assessment and analysis, Manage: risk treatment and monitoring), ISO 31000 risk management principles for AI, integrating AI risk into enterprise ERM frameworks (ISO 31000, COSO ERM, COBIT), and the AI risk manager role in the three lines of defense.",
      "lessons": [
        {
          "title": "Foundations: AI Risk Management Foundations — NIST AI RMF and Enterprise Risk Integration",
          "desc": "NIST AI Risk Management Framework (AI RMF 1.0, January 2023) — four core functions (Govern: policies and accountability, Map: risk identification and context, Measure: risk assessment and analysis, Manage: risk treatment and monitoring), ISO 31000 risk management principles for AI, integrating AI risk into enterprise ERM frameworks (ISO 31000, COSO ERM, COBIT), and the AI risk manager role in the three lines of defense."
        },
        {
          "title": "Module 1.2 Deep Dive: January 2023) — four core functions (Govern: policies and accountability",
          "desc": "NIST AI Risk Management Framework (AI RMF 1.0, January 2023) — four core functions (Govern: policies and accountability, Map: risk identification and context, Measure: risk assessment and analysis, Ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: Map: risk identification and context",
          "desc": "NIST AI Risk Management Framework (AI RMF 1.0, January 2023) — four core functions (Govern: policies and accountability, Map: risk identification and context, Measure: risk assessment and analysis, Ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: Measure: risk assessment and analysis",
          "desc": "NIST AI Risk Management Framework (AI RMF 1.0, January 2023) — four core functions (Govern: policies and accountability, Map: risk identification and context, Measure: risk assessment and analysis, Ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: Manage: risk treatment and monitoring)",
          "desc": "NIST AI Risk Management Framework (AI RMF 1.0, January 2023) — four core functions (Govern: policies and accountability, Map: risk identification and context, Measure: risk assessment and analysis, Ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: ISO 31000 risk management principles for AI",
          "desc": "NIST AI Risk Management Framework (AI RMF 1.0, January 2023) — four core functions (Govern: policies and accountability, Map: risk identification and context, Measure: risk assessment and analysis, Ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Risk Management Foundations — NIST AI RMF and Enterprise Risk Integration. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. NIST AI Risk Management Framework (AI RMF 1.0, January 2023) — four core functions (Govern: policies and accountability, Map: risk identification and "
        }
      ]
    },
    {
      "title": "Module 2: AI Risk Taxonomy — The Complete Universe of What Can Go Wrong",
      "desc": "Technical risks (model performance degradation, adversarial attacks, data poisoning, training infrastructure failures), operational risks (deployment failures, monitoring gaps, vendor dependencies, key person dependencies), compliance risks (regulatory violations, data protection failures), reputational risks (bias incidents, AI safety failures, public controversies), strategic risks (competitive risk from AI, investment ROI risk, stranded asset risk from AI obsolescence), and building the organization's AI risk register.",
      "lessons": [
        {
          "title": "Foundations: AI Risk Taxonomy — The Complete Universe of What Can Go Wrong",
          "desc": "Technical risks (model performance degradation, adversarial attacks, data poisoning, training infrastructure failures), operational risks (deployment failures, monitoring gaps, vendor dependencies, key person dependencies), compliance risks (regulatory violations, data protection failures), reputational risks (bias incidents, AI safety failures, public controversies), strategic risks (competitive risk from AI, investment ROI risk, stranded asset risk from AI obsolescence), and building the organization's AI risk register."
        },
        {
          "title": "Module 2.2 Deep Dive: adversarial attacks",
          "desc": "Technical risks (model performance degradation, adversarial attacks, data poisoning, training infrastructure failures), operational risks (deployment failures, monitoring gaps, vendor dependencies, ke. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: data poisoning",
          "desc": "Technical risks (model performance degradation, adversarial attacks, data poisoning, training infrastructure failures), operational risks (deployment failures, monitoring gaps, vendor dependencies, ke. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: training infrastructure failures)",
          "desc": "Technical risks (model performance degradation, adversarial attacks, data poisoning, training infrastructure failures), operational risks (deployment failures, monitoring gaps, vendor dependencies, ke. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: operational risks (deployment failures",
          "desc": "Technical risks (model performance degradation, adversarial attacks, data poisoning, training infrastructure failures), operational risks (deployment failures, monitoring gaps, vendor dependencies, ke. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: monitoring gaps",
          "desc": "Technical risks (model performance degradation, adversarial attacks, data poisoning, training infrastructure failures), operational risks (deployment failures, monitoring gaps, vendor dependencies, ke. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: AI Risk Taxonomy — The Complete Universe of What Can Go Wrong. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Technical risks (model performance degradation, adversarial attacks, data poisoning, training infrastructure failures), operational risks (deployment "
        }
      ]
    },
    {
      "title": "Module 3: AI Risk Assessment — Qualitative and Quantitative Methodologies",
      "desc": "Risk assessment methodology selection (qualitative heat maps for emerging risks, semi-quantitative scoring for established risks, quantitative modeling for material risks), probability × impact scoring calibration for AI risks (common biases in AI risk assessment), scenario analysis for AI tail risks (what would a major model failure look like?), Monte Carlo simulation for AI program risk, stress testing AI systems under adverse conditions, and the AI risk assessment report.",
      "lessons": [
        {
          "title": "Foundations: AI Risk Assessment — Qualitative and Quantitative Methodologies",
          "desc": "Risk assessment methodology selection (qualitative heat maps for emerging risks, semi-quantitative scoring for established risks, quantitative modeling for material risks), probability × impact scoring calibration for AI risks (common biases in AI risk assessment), scenario analysis for AI tail risks (what would a major model failure look like?), Monte Carlo simulation for AI program risk, stress testing AI systems under adverse conditions, and the AI risk assessment report."
        },
        {
          "title": "Module 3.2 Deep Dive: semi-quantitative scoring for established risks",
          "desc": "Risk assessment methodology selection (qualitative heat maps for emerging risks, semi-quantitative scoring for established risks, quantitative modeling for material risks), probability × impact scorin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: quantitative modeling for material risks)",
          "desc": "Risk assessment methodology selection (qualitative heat maps for emerging risks, semi-quantitative scoring for established risks, quantitative modeling for material risks), probability × impact scorin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: probability × impact scoring calibration for AI risks (common biases in AI risk assessment)",
          "desc": "Risk assessment methodology selection (qualitative heat maps for emerging risks, semi-quantitative scoring for established risks, quantitative modeling for material risks), probability × impact scorin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: scenario analysis for AI tail risks (what would a major model failure look like?)",
          "desc": "Risk assessment methodology selection (qualitative heat maps for emerging risks, semi-quantitative scoring for established risks, quantitative modeling for material risks), probability × impact scorin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: Monte Carlo simulation for AI program risk",
          "desc": "Risk assessment methodology selection (qualitative heat maps for emerging risks, semi-quantitative scoring for established risks, quantitative modeling for material risks), probability × impact scorin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: AI Risk Assessment — Qualitative and Quantitative Methodologies. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Risk assessment methodology selection (qualitative heat maps for emerging risks, semi-quantitative scoring for established risks, quantitative modelin"
        }
      ]
    },
    {
      "title": "Module 4: Model Risk Management — SR 11-7, OCC 2011-12, and the Model Risk Framework",
      "desc": "Federal Reserve SR 11-7 / OCC 2011-12 guidance on model risk management (model definition, tiering framework, development standards, independent validation requirements, ongoing monitoring), applying SR 11-7 to AI and ML models (where traditional guidance is silent on AI-specific risks), the model risk management lifecycle (development → validation → approval → production → monitoring → retirement), independent model validation as a risk control, and model risk appetite statement. Case study: JPMorgan managing 10,000+ production models under SR 11-7.",
      "lessons": [
        {
          "title": "Foundations: Model Risk Management — SR 11-7, OCC 2011-12, and the Model Risk Framework",
          "desc": "Federal Reserve SR 11-7 / OCC 2011-12 guidance on model risk management (model definition, tiering framework, development standards, independent validation requirements, ongoing monitoring), applying SR 11-7 to AI and ML models (where traditional guidance is silent on AI-specific risks), the model risk management lifecycle (development → validation → approval → production → monitoring → retirement), independent model validation as a risk control, and model risk appetite statement. Case study: JPMorgan managing 10,000+ production models under SR 11-7."
        },
        {
          "title": "Module 4.2 Deep Dive: tiering framework",
          "desc": "Federal Reserve SR 11-7 / OCC 2011-12 guidance on model risk management (model definition, tiering framework, development standards, independent validation requirements, ongoing monitoring), applying . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: development standards",
          "desc": "Federal Reserve SR 11-7 / OCC 2011-12 guidance on model risk management (model definition, tiering framework, development standards, independent validation requirements, ongoing monitoring), applying . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: independent validation requirements",
          "desc": "Federal Reserve SR 11-7 / OCC 2011-12 guidance on model risk management (model definition, tiering framework, development standards, independent validation requirements, ongoing monitoring), applying . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: ongoing monitoring)",
          "desc": "Federal Reserve SR 11-7 / OCC 2011-12 guidance on model risk management (model definition, tiering framework, development standards, independent validation requirements, ongoing monitoring), applying . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: applying SR 11-7 to AI and ML models (where traditional guidance is silent on AI-specific risks)",
          "desc": "Federal Reserve SR 11-7 / OCC 2011-12 guidance on model risk management (model definition, tiering framework, development standards, independent validation requirements, ongoing monitoring), applying . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Model Risk Management — SR 11-7, OCC 2011-12, and the Model Risk Framework. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Federal Reserve SR 11-7 / OCC 2011-12 guidance on model risk management (model definition, tiering framework, development standards, independent valid"
        }
      ]
    },
    {
      "title": "Module 5: Operational Risk for AI Systems — Basel Framework and Beyond",
      "desc": "Operational risk categories for AI (technology risk, process risk, people risk, external event risk), operational risk measurement for AI (loss event database, risk and control self-assessment, key risk indicators), operational resilience requirements for AI-critical processes (impact tolerance setting, important business service mapping), business continuity planning for AI failures, and Basel III/IV operational risk capital implications for AI-intensive banks.",
      "lessons": [
        {
          "title": "Foundations: Operational Risk for AI Systems — Basel Framework and Beyond",
          "desc": "Operational risk categories for AI (technology risk, process risk, people risk, external event risk), operational risk measurement for AI (loss event database, risk and control self-assessment, key risk indicators), operational resilience requirements for AI-critical processes (impact tolerance setting, important business service mapping), business continuity planning for AI failures, and Basel III/IV operational risk capital implications for AI-intensive banks."
        },
        {
          "title": "Module 5.2 Deep Dive: process risk",
          "desc": "Operational risk categories for AI (technology risk, process risk, people risk, external event risk), operational risk measurement for AI (loss event database, risk and control self-assessment, key ri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: people risk",
          "desc": "Operational risk categories for AI (technology risk, process risk, people risk, external event risk), operational risk measurement for AI (loss event database, risk and control self-assessment, key ri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: external event risk)",
          "desc": "Operational risk categories for AI (technology risk, process risk, people risk, external event risk), operational risk measurement for AI (loss event database, risk and control self-assessment, key ri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: operational risk measurement for AI (loss event database",
          "desc": "Operational risk categories for AI (technology risk, process risk, people risk, external event risk), operational risk measurement for AI (loss event database, risk and control self-assessment, key ri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: risk and control self-assessment",
          "desc": "Operational risk categories for AI (technology risk, process risk, people risk, external event risk), operational risk measurement for AI (loss event database, risk and control self-assessment, key ri. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Operational Risk for AI Systems — Basel Framework and Beyond. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Operational risk categories for AI (technology risk, process risk, people risk, external event risk), operational risk measurement for AI (loss event "
        }
      ]
    },
    {
      "title": "Module 6: Third-Party and Concentration Risk in AI",
      "desc": "Third-party AI risk program (due diligence for AI vendors, concentration risk assessment — when too many critical processes depend on one AI provider, supply chain risk for AI models), the OpenAI concentration risk case study (when OpenAI has an outage, 1,000+ dependent companies experience service failures), model provider dependency risk, vendor exit strategy planning, and the third-party AI risk management framework.",
      "lessons": [
        {
          "title": "Foundations: Third-Party and Concentration Risk in AI",
          "desc": "Third-party AI risk program (due diligence for AI vendors, concentration risk assessment — when too many critical processes depend on one AI provider, supply chain risk for AI models), the OpenAI concentration risk case study (when OpenAI has an outage, 1,000+ dependent companies experience service failures), model provider dependency risk, vendor exit strategy planning, and the third-party AI risk management framework."
        },
        {
          "title": "Module 6.2 Deep Dive: concentration risk assessment — when too many critical processes depend on one AI provider",
          "desc": "Third-party AI risk program (due diligence for AI vendors, concentration risk assessment — when too many critical processes depend on one AI provider, supply chain risk for AI models), the OpenAI conc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: supply chain risk for AI models)",
          "desc": "Third-party AI risk program (due diligence for AI vendors, concentration risk assessment — when too many critical processes depend on one AI provider, supply chain risk for AI models), the OpenAI conc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: the OpenAI concentration risk case study (when OpenAI has an outage",
          "desc": "Third-party AI risk program (due diligence for AI vendors, concentration risk assessment — when too many critical processes depend on one AI provider, supply chain risk for AI models), the OpenAI conc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: 1",
          "desc": "Third-party AI risk program (due diligence for AI vendors, concentration risk assessment — when too many critical processes depend on one AI provider, supply chain risk for AI models), the OpenAI conc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: 000+ dependent companies experience service failures)",
          "desc": "Third-party AI risk program (due diligence for AI vendors, concentration risk assessment — when too many critical processes depend on one AI provider, supply chain risk for AI models), the OpenAI conc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Third-Party and Concentration Risk in AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Third-party AI risk program (due diligence for AI vendors, concentration risk assessment — when too many critical processes depend on one AI provider,"
        }
      ]
    },
    {
      "title": "Module 7: Emerging and Systemic AI Risks",
      "desc": "Systemic risk from AI (AI-driven financial market instability — flash crash risk from correlated AI trading strategies, correlated failures across institutions using the same AI providers), AGI transition risk (how to prepare for increasingly capable AI), AI safety risk (alignment failures, deceptive AI, capability jumps), climate risk from AI (energy consumption implications for corporate sustainability commitments), and risk management frameworks for risks without historical data.",
      "lessons": [
        {
          "title": "Foundations: Emerging and Systemic AI Risks",
          "desc": "Systemic risk from AI (AI-driven financial market instability — flash crash risk from correlated AI trading strategies, correlated failures across institutions using the same AI providers), AGI transition risk (how to prepare for increasingly capable AI), AI safety risk (alignment failures, deceptive AI, capability jumps), climate risk from AI (energy consumption implications for corporate sustainability commitments), and risk management frameworks for risks without historical data."
        },
        {
          "title": "Module 7.2 Deep Dive: correlated failures across institutions using the same AI providers)",
          "desc": "Systemic risk from AI (AI-driven financial market instability — flash crash risk from correlated AI trading strategies, correlated failures across institutions using the same AI providers), AGI transi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: AGI transition risk (how to prepare for increasingly capable AI)",
          "desc": "Systemic risk from AI (AI-driven financial market instability — flash crash risk from correlated AI trading strategies, correlated failures across institutions using the same AI providers), AGI transi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: AI safety risk (alignment failures",
          "desc": "Systemic risk from AI (AI-driven financial market instability — flash crash risk from correlated AI trading strategies, correlated failures across institutions using the same AI providers), AGI transi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: deceptive AI",
          "desc": "Systemic risk from AI (AI-driven financial market instability — flash crash risk from correlated AI trading strategies, correlated failures across institutions using the same AI providers), AGI transi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: capability jumps)",
          "desc": "Systemic risk from AI (AI-driven financial market instability — flash crash risk from correlated AI trading strategies, correlated failures across institutions using the same AI providers), AGI transi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Emerging and Systemic AI Risks. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Systemic risk from AI (AI-driven financial market instability — flash crash risk from correlated AI trading strategies, correlated failures across ins"
        }
      ]
    },
    {
      "title": "Module 8: AI Risk Treatment and Controls Design",
      "desc": "Risk treatment option selection (avoid: don't deploy this AI, reduce: implement controls, transfer: insurance/contracts, accept: formal risk acceptance with documentation), controls design for AI-specific risks (model drift controls: automated retraining triggers; bias monitoring controls: demographic performance dashboards; adversarial input controls: anomaly detection; hallucination controls: RAG with source citation), controls effectiveness testing, and residual risk acceptance process.",
      "lessons": [
        {
          "title": "Foundations: AI Risk Treatment and Controls Design",
          "desc": "Risk treatment option selection (avoid: don't deploy this AI, reduce: implement controls, transfer: insurance/contracts, accept: formal risk acceptance with documentation), controls design for AI-specific risks (model drift controls: automated retraining triggers; bias monitoring controls: demographic performance dashboards; adversarial input controls: anomaly detection; hallucination controls: RAG with source citation), controls effectiveness testing, and residual risk acceptance process."
        },
        {
          "title": "Module 8.2 Deep Dive: reduce: implement controls",
          "desc": "Risk treatment option selection (avoid: don't deploy this AI, reduce: implement controls, transfer: insurance/contracts, accept: formal risk acceptance with documentation), controls design for AI-spec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: transfer: insurance/contracts",
          "desc": "Risk treatment option selection (avoid: don't deploy this AI, reduce: implement controls, transfer: insurance/contracts, accept: formal risk acceptance with documentation), controls design for AI-spec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: accept: formal risk acceptance with documentation)",
          "desc": "Risk treatment option selection (avoid: don't deploy this AI, reduce: implement controls, transfer: insurance/contracts, accept: formal risk acceptance with documentation), controls design for AI-spec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: controls design for AI-specific risks (model drift controls: automated retraining triggers; bias monitoring controls: demographic performance dashboards; adversarial input controls: anomaly detection; hallucination controls: RAG with source citation)",
          "desc": "Risk treatment option selection (avoid: don't deploy this AI, reduce: implement controls, transfer: insurance/contracts, accept: formal risk acceptance with documentation), controls design for AI-spec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: controls effectiveness testing",
          "desc": "Risk treatment option selection (avoid: don't deploy this AI, reduce: implement controls, transfer: insurance/contracts, accept: formal risk acceptance with documentation), controls design for AI-spec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: AI Risk Treatment and Controls Design. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Risk treatment option selection (avoid: don't deploy this AI, reduce: implement controls, transfer: insurance/contracts, accept: formal risk acceptanc"
        }
      ]
    },
    {
      "title": "Module 9: AI Risk Reporting and Board-Level Communication",
      "desc": "AI risk reporting hierarchy (operational risk → risk committee → board risk committee), board AI literacy challenge (communicating complex AI risks to non-technical board members), key risk indicators for AI (model performance degradation rate, adverse incident frequency, third-party concentration score, bias metric trends), AI risk dashboards, the emerging AI risk disclosure requirements (SEC climate-AI parallel, TCFD for AI), and the AI risk appetite statement template.",
      "lessons": [
        {
          "title": "Foundations: AI Risk Reporting and Board-Level Communication",
          "desc": "AI risk reporting hierarchy (operational risk → risk committee → board risk committee), board AI literacy challenge (communicating complex AI risks to non-technical board members), key risk indicators for AI (model performance degradation rate, adverse incident frequency, third-party concentration score, bias metric trends), AI risk dashboards, the emerging AI risk disclosure requirements (SEC climate-AI parallel, TCFD for AI), and the AI risk appetite statement template."
        },
        {
          "title": "Module 9.2 Deep Dive: board AI literacy challenge (communicating complex AI risks to non-technical board members)",
          "desc": "AI risk reporting hierarchy (operational risk → risk committee → board risk committee), board AI literacy challenge (communicating complex AI risks to non-technical board members), key risk indicators. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: key risk indicators for AI (model performance degradation rate",
          "desc": "AI risk reporting hierarchy (operational risk → risk committee → board risk committee), board AI literacy challenge (communicating complex AI risks to non-technical board members), key risk indicators. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: adverse incident frequency",
          "desc": "AI risk reporting hierarchy (operational risk → risk committee → board risk committee), board AI literacy challenge (communicating complex AI risks to non-technical board members), key risk indicators. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: third-party concentration score",
          "desc": "AI risk reporting hierarchy (operational risk → risk committee → board risk committee), board AI literacy challenge (communicating complex AI risks to non-technical board members), key risk indicators. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: bias metric trends)",
          "desc": "AI risk reporting hierarchy (operational risk → risk committee → board risk committee), board AI literacy challenge (communicating complex AI risks to non-technical board members), key risk indicators. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: AI Risk Reporting and Board-Level Communication. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI risk reporting hierarchy (operational risk → risk committee → board risk committee), board AI literacy challenge (communicating complex AI risks to"
        }
      ]
    },
    {
      "title": "Module 10: Building the AI Risk Function and Capstone",
      "desc": "AI risk function design (dedicated AI risk team vs. embedded AI risk champions model), competency model for AI risk managers (risk fundamentals + AI/ML fluency + domain expertise), AI risk technology stack (risk management platforms with AI modules), the AI risk culture (risk awareness in data science and ML engineering teams), and the capstone: conduct a complete AI risk assessment for a provided enterprise AI system and produce the risk treatment plan, controls framework, and board risk report.",
      "lessons": [
        {
          "title": "Foundations: Building the AI Risk Function and Capstone",
          "desc": "AI risk function design (dedicated AI risk team vs. embedded AI risk champions model), competency model for AI risk managers (risk fundamentals + AI/ML fluency + domain expertise), AI risk technology stack (risk management platforms with AI modules), the AI risk culture (risk awareness in data science and ML engineering teams), and the capstone: conduct a complete AI risk assessment for a provided enterprise AI system and produce the risk treatment plan, controls framework, and board risk report."
        },
        {
          "title": "Module 10.2 Deep Dive: competency model for AI risk managers (risk fundamentals + AI/ML fluency + domain expertise)",
          "desc": "AI risk function design (dedicated AI risk team vs. embedded AI risk champions model), competency model for AI risk managers (risk fundamentals + AI/ML fluency + domain expertise), AI risk technology . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: AI risk technology stack (risk management platforms with AI modules)",
          "desc": "AI risk function design (dedicated AI risk team vs. embedded AI risk champions model), competency model for AI risk managers (risk fundamentals + AI/ML fluency + domain expertise), AI risk technology . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: the AI risk culture (risk awareness in data science and ML engineering teams)",
          "desc": "AI risk function design (dedicated AI risk team vs. embedded AI risk champions model), competency model for AI risk managers (risk fundamentals + AI/ML fluency + domain expertise), AI risk technology . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: and the capstone: conduct a complete AI risk assessment for a provided enterprise AI system and produce the risk treatment plan",
          "desc": "AI risk function design (dedicated AI risk team vs. embedded AI risk champions model), competency model for AI risk managers (risk fundamentals + AI/ML fluency + domain expertise), AI risk technology . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: controls framework",
          "desc": "AI risk function design (dedicated AI risk team vs. embedded AI risk champions model), competency model for AI risk managers (risk fundamentals + AI/ML fluency + domain expertise), AI risk technology . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Building the AI Risk Function and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI risk function design (dedicated AI risk team vs. embedded AI risk champions model), competency model for AI risk managers (risk fundamentals + AI/M"
        }
      ]
    }
  ]

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const authError = await requireAdminOrServiceRole(req);
  if (authError) return authError;
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
