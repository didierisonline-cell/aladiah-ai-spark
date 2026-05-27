import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Product Manager",
  "description": "Master product management for the AI era — from discovery and strategy through launch and continuous improvement. 10 modules covering AI product strategy, Jobs-to-be-Done, AI-specific metrics, experimentation, responsible AI, and building products where AI is the core capability, not a feature add-on.",
  "translations": {
    "es": {
      "title": "AI Product Manager",
      "description": "Master product management for the AI era — from discovery and strategy through launch and continuous improvement. 10 modules covering AI product strategy, Jobs-to-be-Done, AI-specific metrics, experim"
    },
    "fr": {
      "title": "AI Product Manager",
      "description": "Master product management for the AI era — from discovery and strategy through launch and continuous improvement. 10 modules covering AI product strategy, Jobs-to-be-Done, AI-specific metrics, experim"
    },
    "de": {
      "title": "AI Product Manager",
      "description": "Master product management for the AI era — from discovery and strategy through launch and continuous improvement. 10 modules covering AI product strategy, Jobs-to-be-Done, AI-specific metrics, experim"
    },
    "zh": {
      "title": "AI Product Manager",
      "description": "Master product management for the AI era — from discovery and strategy through launch and continuous improvement. 10 modules covering AI product strategy, Jobs-to-be-Done, AI-specific metrics, experim"
    },
    "ar": {
      "title": "AI Product Manager",
      "description": "Master product management for the AI era — from discovery and strategy through launch and continuous improvement. 10 modules covering AI product strategy, Jobs-to-be-Done, AI-specific metrics, experim"
    },
    "ja": {
      "title": "AI Product Manager",
      "description": "Master product management for the AI era — from discovery and strategy through launch and continuous improvement. 10 modules covering AI product strategy, Jobs-to-be-Done, AI-specific metrics, experim"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Product Strategy — Moats, Positioning, and the AI Product Lifecycle",
      "desc": "The AI competitive moat framework (data flywheel, proprietary models, network effects, switching costs), foundation model commoditization and what it means for AI product differentiation, the AI product lifecycle (experiment → alpha → beta → GA → scaling → maturity), positioning AI products for different buyer personas, and the strategic decisions behind ChatGPT's viral launch. Case study: Why Notion AI succeeded where Google Bard struggled.",
      "lessons": [
        {
          "title": "Foundations: AI Product Strategy — Moats, Positioning, and the AI Product Lifecycle",
          "desc": "The AI competitive moat framework (data flywheel, proprietary models, network effects, switching costs), foundation model commoditization and what it means for AI product differentiation, the AI product lifecycle (experiment → alpha → beta → GA → scaling → maturity), positioning AI products for different buyer personas, and the strategic decisions behind ChatGPT's viral launch. Case study: Why Notion AI succeeded where Google Bard struggled."
        },
        {
          "title": "Module 1.2 Deep Dive: proprietary models",
          "desc": "The AI competitive moat framework (data flywheel, proprietary models, network effects, switching costs), foundation model commoditization and what it means for AI product differentiation, the AI produ. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: network effects",
          "desc": "The AI competitive moat framework (data flywheel, proprietary models, network effects, switching costs), foundation model commoditization and what it means for AI product differentiation, the AI produ. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: switching costs)",
          "desc": "The AI competitive moat framework (data flywheel, proprietary models, network effects, switching costs), foundation model commoditization and what it means for AI product differentiation, the AI produ. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: foundation model commoditization and what it means for AI product differentiation",
          "desc": "The AI competitive moat framework (data flywheel, proprietary models, network effects, switching costs), foundation model commoditization and what it means for AI product differentiation, the AI produ. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: the AI product lifecycle (experiment → alpha → beta → GA → scaling → maturity)",
          "desc": "The AI competitive moat framework (data flywheel, proprietary models, network effects, switching costs), foundation model commoditization and what it means for AI product differentiation, the AI produ. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Product Strategy — Moats, Positioning, and the AI Product Lifecycle. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI competitive moat framework (data flywheel, proprietary models, network effects, switching costs), foundation model commoditization and what it "
        }
      ]
    },
    {
      "title": "Module 2: Continuous Discovery for AI Products — Teresa Torres Framework",
      "desc": "Teresa Torres' Opportunity Solution Tree adapted for AI products, continuous discovery habits (weekly user interviews as a non-negotiable), assumption mapping for AI features (what must be true for this AI feature to create value?), the wizard of oz technique for AI product discovery, rapid prototyping for AI concepts, and the discovery cadence that GitHub used to find the Copilot use case. Real discovery artifacts from top AI PMs.",
      "lessons": [
        {
          "title": "Foundations: Continuous Discovery for AI Products — Teresa Torres Framework",
          "desc": "Teresa Torres' Opportunity Solution Tree adapted for AI products, continuous discovery habits (weekly user interviews as a non-negotiable), assumption mapping for AI features (what must be true for this AI feature to create value?), the wizard of oz technique for AI product discovery, rapid prototyping for AI concepts, and the discovery cadence that GitHub used to find the Copilot use case. Real discovery artifacts from top AI PMs."
        },
        {
          "title": "Module 2.2 Deep Dive: continuous discovery habits (weekly user interviews as a non-negotiable)",
          "desc": "Teresa Torres' Opportunity Solution Tree adapted for AI products, continuous discovery habits (weekly user interviews as a non-negotiable), assumption mapping for AI features (what must be true for th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: assumption mapping for AI features (what must be true for this AI feature to create value?)",
          "desc": "Teresa Torres' Opportunity Solution Tree adapted for AI products, continuous discovery habits (weekly user interviews as a non-negotiable), assumption mapping for AI features (what must be true for th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: the wizard of oz technique for AI product discovery",
          "desc": "Teresa Torres' Opportunity Solution Tree adapted for AI products, continuous discovery habits (weekly user interviews as a non-negotiable), assumption mapping for AI features (what must be true for th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: rapid prototyping for AI concepts",
          "desc": "Teresa Torres' Opportunity Solution Tree adapted for AI products, continuous discovery habits (weekly user interviews as a non-negotiable), assumption mapping for AI features (what must be true for th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: and the discovery cadence that GitHub used to find the Copilot use case. Real discovery artifacts from top AI PMs.",
          "desc": "Teresa Torres' Opportunity Solution Tree adapted for AI products, continuous discovery habits (weekly user interviews as a non-negotiable), assumption mapping for AI features (what must be true for th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Continuous Discovery for AI Products — Teresa Torres Framework. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Teresa Torres' Opportunity Solution Tree adapted for AI products, continuous discovery habits (weekly user interviews as a non-negotiable), assumption"
        }
      ]
    },
    {
      "title": "Module 3: AI Product Requirements — Writing Specs That Engineers and Data Scientists Can Execute",
      "desc": "Writing AI-specific product requirements (accuracy thresholds with confidence intervals, latency SLOs in P50/P95/P99, fairness constraints as acceptance criteria), the AI product spec structure (problem statement, success metrics, model requirements, training data requirements, evaluation methodology), user stories for AI features, and managing requirements uncertainty. Template: AI product requirements document.",
      "lessons": [
        {
          "title": "Foundations: AI Product Requirements — Writing Specs That Engineers and Data Scientists Can Execute",
          "desc": "Writing AI-specific product requirements (accuracy thresholds with confidence intervals, latency SLOs in P50/P95/P99, fairness constraints as acceptance criteria), the AI product spec structure (problem statement, success metrics, model requirements, training data requirements, evaluation methodology), user stories for AI features, and managing requirements uncertainty. Template: AI product requirements document."
        },
        {
          "title": "Module 3.2 Deep Dive: latency SLOs in P50/P95/P99",
          "desc": "Writing AI-specific product requirements (accuracy thresholds with confidence intervals, latency SLOs in P50/P95/P99, fairness constraints as acceptance criteria), the AI product spec structure (probl. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: fairness constraints as acceptance criteria)",
          "desc": "Writing AI-specific product requirements (accuracy thresholds with confidence intervals, latency SLOs in P50/P95/P99, fairness constraints as acceptance criteria), the AI product spec structure (probl. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: the AI product spec structure (problem statement",
          "desc": "Writing AI-specific product requirements (accuracy thresholds with confidence intervals, latency SLOs in P50/P95/P99, fairness constraints as acceptance criteria), the AI product spec structure (probl. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: success metrics",
          "desc": "Writing AI-specific product requirements (accuracy thresholds with confidence intervals, latency SLOs in P50/P95/P99, fairness constraints as acceptance criteria), the AI product spec structure (probl. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: model requirements",
          "desc": "Writing AI-specific product requirements (accuracy thresholds with confidence intervals, latency SLOs in P50/P95/P99, fairness constraints as acceptance criteria), the AI product spec structure (probl. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: AI Product Requirements — Writing Specs That Engineers and Data Scientists Can Execute. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Writing AI-specific product requirements (accuracy thresholds with confidence intervals, latency SLOs in P50/P95/P99, fairness constraints as acceptan"
        }
      ]
    },
    {
      "title": "Module 4: AI UX and Product Design — Patterns for Intelligent Interfaces",
      "desc": "AI UX patterns library (inline suggestions, confidence indicators, explanation surfaces, feedback mechanisms, progressive disclosure), the trust calibration problem in AI product design, designing for AI failure states (graceful degradation, appropriate error messaging), the blank page problem in generative AI, and designing AI products that users actually trust. Case study: GitHub Copilot's UX evolution from annoyance to essential tool.",
      "lessons": [
        {
          "title": "Foundations: AI UX and Product Design — Patterns for Intelligent Interfaces",
          "desc": "AI UX patterns library (inline suggestions, confidence indicators, explanation surfaces, feedback mechanisms, progressive disclosure), the trust calibration problem in AI product design, designing for AI failure states (graceful degradation, appropriate error messaging), the blank page problem in generative AI, and designing AI products that users actually trust. Case study: GitHub Copilot's UX evolution from annoyance to essential tool."
        },
        {
          "title": "Module 4.2 Deep Dive: confidence indicators",
          "desc": "AI UX patterns library (inline suggestions, confidence indicators, explanation surfaces, feedback mechanisms, progressive disclosure), the trust calibration problem in AI product design, designing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: explanation surfaces",
          "desc": "AI UX patterns library (inline suggestions, confidence indicators, explanation surfaces, feedback mechanisms, progressive disclosure), the trust calibration problem in AI product design, designing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: feedback mechanisms",
          "desc": "AI UX patterns library (inline suggestions, confidence indicators, explanation surfaces, feedback mechanisms, progressive disclosure), the trust calibration problem in AI product design, designing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: progressive disclosure)",
          "desc": "AI UX patterns library (inline suggestions, confidence indicators, explanation surfaces, feedback mechanisms, progressive disclosure), the trust calibration problem in AI product design, designing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: the trust calibration problem in AI product design",
          "desc": "AI UX patterns library (inline suggestions, confidence indicators, explanation surfaces, feedback mechanisms, progressive disclosure), the trust calibration problem in AI product design, designing for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: AI UX and Product Design — Patterns for Intelligent Interfaces. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI UX patterns library (inline suggestions, confidence indicators, explanation surfaces, feedback mechanisms, progressive disclosure), the trust calib"
        }
      ]
    },
    {
      "title": "Module 5: AI Product Roadmap and Prioritization Under Uncertainty",
      "desc": "AI product roadmapping with research dependency management, RICE scoring adapted for AI features (reach × impact × confidence × effort — confidence is critical for AI), the now/next/later framework for AI capabilities, communicating AI roadmap uncertainty to executive stakeholders, and the product council process for major AI capability decisions. Case study: How Duolingo prioritized its AI features to 5x engagement.",
      "lessons": [
        {
          "title": "Foundations: AI Product Roadmap and Prioritization Under Uncertainty",
          "desc": "AI product roadmapping with research dependency management, RICE scoring adapted for AI features (reach × impact × confidence × effort — confidence is critical for AI), the now/next/later framework for AI capabilities, communicating AI roadmap uncertainty to executive stakeholders, and the product council process for major AI capability decisions. Case study: How Duolingo prioritized its AI features to 5x engagement."
        },
        {
          "title": "Module 5.2 Deep Dive: RICE scoring adapted for AI features (reach × impact × confidence × effort — confidence is critical for AI)",
          "desc": "AI product roadmapping with research dependency management, RICE scoring adapted for AI features (reach × impact × confidence × effort — confidence is critical for AI), the now/next/later framework fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: the now/next/later framework for AI capabilities",
          "desc": "AI product roadmapping with research dependency management, RICE scoring adapted for AI features (reach × impact × confidence × effort — confidence is critical for AI), the now/next/later framework fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: communicating AI roadmap uncertainty to executive stakeholders",
          "desc": "AI product roadmapping with research dependency management, RICE scoring adapted for AI features (reach × impact × confidence × effort — confidence is critical for AI), the now/next/later framework fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: and the product council process for major AI capability decisions. Case study: How Duolingo prioritized its AI features to 5x engagement.",
          "desc": "AI product roadmapping with research dependency management, RICE scoring adapted for AI features (reach × impact × confidence × effort — confidence is critical for AI), the now/next/later framework fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: AI product roadmapping with research dependency management,",
          "desc": "AI product roadmapping with research dependency management, RICE scoring adapted for AI features (reach × impact × confidence × effort — confidence is critical for AI), the now/next/later framework fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: AI Product Roadmap and Prioritization Under Uncertainty. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI product roadmapping with research dependency management, RICE scoring adapted for AI features (reach × impact × confidence × effort — confidence is"
        }
      ]
    },
    {
      "title": "Module 6: AI Product Metrics and Experimentation Rigor",
      "desc": "The AI product metrics framework (North Star + input metrics + guardrail metrics), AI-specific metrics (task completion rate, assistance acceptance rate, override rate, calibration score), designing statistically valid A/B tests for AI features (power calculation, minimum detectable effect, guardrail metrics), causal inference for AI impact measurement, and the experimentation culture. Case study: Duolingo's AI experimentation program.",
      "lessons": [
        {
          "title": "Foundations: AI Product Metrics and Experimentation Rigor",
          "desc": "The AI product metrics framework (North Star + input metrics + guardrail metrics), AI-specific metrics (task completion rate, assistance acceptance rate, override rate, calibration score), designing statistically valid A/B tests for AI features (power calculation, minimum detectable effect, guardrail metrics), causal inference for AI impact measurement, and the experimentation culture. Case study: Duolingo's AI experimentation program."
        },
        {
          "title": "Module 6.2 Deep Dive: AI-specific metrics (task completion rate",
          "desc": "The AI product metrics framework (North Star + input metrics + guardrail metrics), AI-specific metrics (task completion rate, assistance acceptance rate, override rate, calibration score), designing s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: assistance acceptance rate",
          "desc": "The AI product metrics framework (North Star + input metrics + guardrail metrics), AI-specific metrics (task completion rate, assistance acceptance rate, override rate, calibration score), designing s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: override rate",
          "desc": "The AI product metrics framework (North Star + input metrics + guardrail metrics), AI-specific metrics (task completion rate, assistance acceptance rate, override rate, calibration score), designing s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: calibration score)",
          "desc": "The AI product metrics framework (North Star + input metrics + guardrail metrics), AI-specific metrics (task completion rate, assistance acceptance rate, override rate, calibration score), designing s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: designing statistically valid A/B tests for AI features (power calculation",
          "desc": "The AI product metrics framework (North Star + input metrics + guardrail metrics), AI-specific metrics (task completion rate, assistance acceptance rate, override rate, calibration score), designing s. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: AI Product Metrics and Experimentation Rigor. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI product metrics framework (North Star + input metrics + guardrail metrics), AI-specific metrics (task completion rate, assistance acceptance ra"
        }
      ]
    },
    {
      "title": "Module 7: Responsible AI Product Management — Ethics as Product Strategy",
      "desc": "Responsible AI embedded in the product development process (not compliance theater), the bias detection process for product teams (when to test, what to test, how to respond), explainability as a product feature (customers demand it), consent and transparency design patterns, managing the PR risk of AI failures, and the product manager's responsibility when AI causes harm. Case study: Twitter image cropping algorithm — the product decisions that led there.",
      "lessons": [
        {
          "title": "Foundations: Responsible AI Product Management — Ethics as Product Strategy",
          "desc": "Responsible AI embedded in the product development process (not compliance theater), the bias detection process for product teams (when to test, what to test, how to respond), explainability as a product feature (customers demand it), consent and transparency design patterns, managing the PR risk of AI failures, and the product manager's responsibility when AI causes harm. Case study: Twitter image cropping algorithm — the product decisions that led there."
        },
        {
          "title": "Module 7.2 Deep Dive: the bias detection process for product teams (when to test",
          "desc": "Responsible AI embedded in the product development process (not compliance theater), the bias detection process for product teams (when to test, what to test, how to respond), explainability as a prod. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: what to test",
          "desc": "Responsible AI embedded in the product development process (not compliance theater), the bias detection process for product teams (when to test, what to test, how to respond), explainability as a prod. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: how to respond)",
          "desc": "Responsible AI embedded in the product development process (not compliance theater), the bias detection process for product teams (when to test, what to test, how to respond), explainability as a prod. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: explainability as a product feature (customers demand it)",
          "desc": "Responsible AI embedded in the product development process (not compliance theater), the bias detection process for product teams (when to test, what to test, how to respond), explainability as a prod. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: consent and transparency design patterns",
          "desc": "Responsible AI embedded in the product development process (not compliance theater), the bias detection process for product teams (when to test, what to test, how to respond), explainability as a prod. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Responsible AI Product Management — Ethics as Product Strategy. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Responsible AI embedded in the product development process (not compliance theater), the bias detection process for product teams (when to test, what "
        }
      ]
    },
    {
      "title": "Module 8: AI Product Launch and Go-to-Market Strategy",
      "desc": "AI product launch strategies (limited alpha → waitlist → public beta → GA), pricing AI products (per-seat, usage-based, value-based, outcome-based), the freemium model for AI (how Notion AI captured 100M users), building the AI product narrative (what story resonates with which audience), managing the backlash risk, and post-launch monitoring. Case study: Salesforce Einstein's enterprise AI GTM — lessons from a $10B bet.",
      "lessons": [
        {
          "title": "Foundations: AI Product Launch and Go-to-Market Strategy",
          "desc": "AI product launch strategies (limited alpha → waitlist → public beta → GA), pricing AI products (per-seat, usage-based, value-based, outcome-based), the freemium model for AI (how Notion AI captured 100M users), building the AI product narrative (what story resonates with which audience), managing the backlash risk, and post-launch monitoring. Case study: Salesforce Einstein's enterprise AI GTM — lessons from a $10B bet."
        },
        {
          "title": "Module 8.2 Deep Dive: pricing AI products (per-seat",
          "desc": "AI product launch strategies (limited alpha → waitlist → public beta → GA), pricing AI products (per-seat, usage-based, value-based, outcome-based), the freemium model for AI (how Notion AI captured 1. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: usage-based",
          "desc": "AI product launch strategies (limited alpha → waitlist → public beta → GA), pricing AI products (per-seat, usage-based, value-based, outcome-based), the freemium model for AI (how Notion AI captured 1. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: value-based",
          "desc": "AI product launch strategies (limited alpha → waitlist → public beta → GA), pricing AI products (per-seat, usage-based, value-based, outcome-based), the freemium model for AI (how Notion AI captured 1. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: outcome-based)",
          "desc": "AI product launch strategies (limited alpha → waitlist → public beta → GA), pricing AI products (per-seat, usage-based, value-based, outcome-based), the freemium model for AI (how Notion AI captured 1. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: the freemium model for AI (how Notion AI captured 100M users)",
          "desc": "AI product launch strategies (limited alpha → waitlist → public beta → GA), pricing AI products (per-seat, usage-based, value-based, outcome-based), the freemium model for AI (how Notion AI captured 1. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: AI Product Launch and Go-to-Market Strategy. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI product launch strategies (limited alpha → waitlist → public beta → GA), pricing AI products (per-seat, usage-based, value-based, outcome-based), t"
        }
      ]
    },
    {
      "title": "Module 9: Managing AI Product Teams — The PM-Data Scientist-Engineer Triangle",
      "desc": "The AI product team operating model (PM owns the 'what and why,' data scientist owns the 'how accurately,' engineer owns the 'how reliably'), the PM-data scientist requirements translation process, managing research timelines (how to commit to product dates when model performance is uncertain), the AI product sprint model, and building psychological safety in AI teams. Lessons from Anthropic, OpenAI, and Google AI product leaders.",
      "lessons": [
        {
          "title": "Foundations: Managing AI Product Teams — The PM-Data Scientist-Engineer Triangle",
          "desc": "The AI product team operating model (PM owns the 'what and why,' data scientist owns the 'how accurately,' engineer owns the 'how reliably'), the PM-data scientist requirements translation process, managing research timelines (how to commit to product dates when model performance is uncertain), the AI product sprint model, and building psychological safety in AI teams. Lessons from Anthropic, OpenAI, and Google AI product leaders."
        },
        {
          "title": "Module 9.2 Deep Dive: ' data scientist owns the 'how accurately",
          "desc": "The AI product team operating model (PM owns the 'what and why,' data scientist owns the 'how accurately,' engineer owns the 'how reliably'), the PM-data scientist requirements translation process, ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: ' engineer owns the 'how reliably')",
          "desc": "The AI product team operating model (PM owns the 'what and why,' data scientist owns the 'how accurately,' engineer owns the 'how reliably'), the PM-data scientist requirements translation process, ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: the PM-data scientist requirements translation process",
          "desc": "The AI product team operating model (PM owns the 'what and why,' data scientist owns the 'how accurately,' engineer owns the 'how reliably'), the PM-data scientist requirements translation process, ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: managing research timelines (how to commit to product dates when model performance is uncertain)",
          "desc": "The AI product team operating model (PM owns the 'what and why,' data scientist owns the 'how accurately,' engineer owns the 'how reliably'), the PM-data scientist requirements translation process, ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: the AI product sprint model",
          "desc": "The AI product team operating model (PM owns the 'what and why,' data scientist owns the 'how accurately,' engineer owns the 'how reliably'), the PM-data scientist requirements translation process, ma. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Managing AI Product Teams — The PM-Data Scientist-Engineer Triangle. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI product team operating model (PM owns the 'what and why,' data scientist owns the 'how accurately,' engineer owns the 'how reliably'), the PM-d"
        }
      ]
    },
    {
      "title": "Module 10: AI Product Leadership and Capstone",
      "desc": "The AI PM career path ($150K-$350K compensation range), building an AI product organization, AI product strategy for 2025-2030 (agent-native products, multimodal defaults, AI-first design), and the capstone: complete product strategy document + PRD + launch plan + metrics dashboard for an AI product in a provided domain. Present to simulated executive panel.",
      "lessons": [
        {
          "title": "Foundations: AI Product Leadership and Capstone",
          "desc": "The AI PM career path ($150K-$350K compensation range), building an AI product organization, AI product strategy for 2025-2030 (agent-native products, multimodal defaults, AI-first design), and the capstone: complete product strategy document + PRD + launch plan + metrics dashboard for an AI product in a provided domain. Present to simulated executive panel."
        },
        {
          "title": "Module 10.2 Deep Dive: building an AI product organization",
          "desc": "The AI PM career path ($150K-$350K compensation range), building an AI product organization, AI product strategy for 2025-2030 (agent-native products, multimodal defaults, AI-first design), and the ca. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: AI product strategy for 2025-2030 (agent-native products",
          "desc": "The AI PM career path ($150K-$350K compensation range), building an AI product organization, AI product strategy for 2025-2030 (agent-native products, multimodal defaults, AI-first design), and the ca. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: multimodal defaults",
          "desc": "The AI PM career path ($150K-$350K compensation range), building an AI product organization, AI product strategy for 2025-2030 (agent-native products, multimodal defaults, AI-first design), and the ca. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: AI-first design)",
          "desc": "The AI PM career path ($150K-$350K compensation range), building an AI product organization, AI product strategy for 2025-2030 (agent-native products, multimodal defaults, AI-first design), and the ca. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: and the capstone: complete product strategy document + PRD + launch plan + metrics dashboard for an AI product in a provided domain. Present to simulated executive panel.",
          "desc": "The AI PM career path ($150K-$350K compensation range), building an AI product organization, AI product strategy for 2025-2030 (agent-native products, multimodal defaults, AI-first design), and the ca. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: AI Product Leadership and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI PM career path ($150K-$350K compensation range), building an AI product organization, AI product strategy for 2025-2030 (agent-native products,"
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
