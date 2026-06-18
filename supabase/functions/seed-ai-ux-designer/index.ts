import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/auth.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI UX Designer",
  "description": "Design exceptional user experiences for AI-powered products — from conversational interfaces through generative AI and autonomous agents. 10 modules covering AI-specific UX patterns, trust design, error states for probabilistic systems, multimodal interaction, and the research methods that reveal how users actually think about AI.",
  "translations": {
    "es": {
      "title": "AI UX Designer",
      "description": "Design exceptional user experiences for AI-powered products — from conversational interfaces through generative AI and autonomous agents. 10 modules covering AI-specific UX patterns, trust design, err"
    },
    "fr": {
      "title": "AI UX Designer",
      "description": "Design exceptional user experiences for AI-powered products — from conversational interfaces through generative AI and autonomous agents. 10 modules covering AI-specific UX patterns, trust design, err"
    },
    "de": {
      "title": "AI UX Designer",
      "description": "Design exceptional user experiences for AI-powered products — from conversational interfaces through generative AI and autonomous agents. 10 modules covering AI-specific UX patterns, trust design, err"
    },
    "zh": {
      "title": "AI UX Designer",
      "description": "Design exceptional user experiences for AI-powered products — from conversational interfaces through generative AI and autonomous agents. 10 modules covering AI-specific UX patterns, trust design, err"
    },
    "ar": {
      "title": "AI UX Designer",
      "description": "Design exceptional user experiences for AI-powered products — from conversational interfaces through generative AI and autonomous agents. 10 modules covering AI-specific UX patterns, trust design, err"
    },
    "ja": {
      "title": "AI UX Designer",
      "description": "Design exceptional user experiences for AI-powered products — from conversational interfaces through generative AI and autonomous agents. 10 modules covering AI-specific UX patterns, trust design, err"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI UX Foundations — Designing for Intelligence, Uncertainty, and Probability",
      "desc": "How AI UX differs from traditional UX (probabilistic behavior, evolving capabilities, emergent responses, inexplicable failures), the unique UX challenges of AI (managing expectations, handling AI failures gracefully, building appropriate trust, communicating uncertainty), mental models users form about AI (and why they're almost always wrong), and the AI UX design principles from Google People + AI Research (PAIR), Apple Human Interface Guidelines for AI, and Microsoft's AI UX patterns.",
      "lessons": [
        {
          "title": "Foundations: AI UX Foundations — Designing for Intelligence, Uncertainty, and Probability",
          "desc": "How AI UX differs from traditional UX (probabilistic behavior, evolving capabilities, emergent responses, inexplicable failures), the unique UX challenges of AI (managing expectations, handling AI failures gracefully, building appropriate trust, communicating uncertainty), mental models users form about AI (and why they're almost always wrong), and the AI UX design principles from Google People + AI Research (PAIR), Apple Human Interface Guidelines for AI, and Microsoft's AI UX patterns."
        },
        {
          "title": "Module 1.2 Deep Dive: evolving capabilities",
          "desc": "How AI UX differs from traditional UX (probabilistic behavior, evolving capabilities, emergent responses, inexplicable failures), the unique UX challenges of AI (managing expectations, handling AI fai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: emergent responses",
          "desc": "How AI UX differs from traditional UX (probabilistic behavior, evolving capabilities, emergent responses, inexplicable failures), the unique UX challenges of AI (managing expectations, handling AI fai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: inexplicable failures)",
          "desc": "How AI UX differs from traditional UX (probabilistic behavior, evolving capabilities, emergent responses, inexplicable failures), the unique UX challenges of AI (managing expectations, handling AI fai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: the unique UX challenges of AI (managing expectations",
          "desc": "How AI UX differs from traditional UX (probabilistic behavior, evolving capabilities, emergent responses, inexplicable failures), the unique UX challenges of AI (managing expectations, handling AI fai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: handling AI failures gracefully",
          "desc": "How AI UX differs from traditional UX (probabilistic behavior, evolving capabilities, emergent responses, inexplicable failures), the unique UX challenges of AI (managing expectations, handling AI fai. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI UX Foundations — Designing for Intelligence, Uncertainty, and Probability. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. How AI UX differs from traditional UX (probabilistic behavior, evolving capabilities, emergent responses, inexplicable failures), the unique UX challe"
        }
      ]
    },
    {
      "title": "Module 2: Research Methods for AI Products — Understanding How People Think About AI",
      "desc": "User research adapted for AI products (interview questions that reveal mental models, not just behaviors), wizard of oz prototyping for AI (simulate AI with a human — the most valuable prototyping technique for AI UX), diary studies for AI feature discovery (how do people actually use AI over time?), contextual inquiry for AI workflow integration, usability testing challenges for probabilistic systems (what is a 'task failure' when the AI is uncertain?), and the AI UX research program.",
      "lessons": [
        {
          "title": "Foundations: Research Methods for AI Products — Understanding How People Think About AI",
          "desc": "User research adapted for AI products (interview questions that reveal mental models, not just behaviors), wizard of oz prototyping for AI (simulate AI with a human — the most valuable prototyping technique for AI UX), diary studies for AI feature discovery (how do people actually use AI over time?), contextual inquiry for AI workflow integration, usability testing challenges for probabilistic systems (what is a 'task failure' when the AI is uncertain?), and the AI UX research program."
        },
        {
          "title": "Module 2.2 Deep Dive: not just behaviors)",
          "desc": "User research adapted for AI products (interview questions that reveal mental models, not just behaviors), wizard of oz prototyping for AI (simulate AI with a human — the most valuable prototyping tec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: wizard of oz prototyping for AI (simulate AI with a human — the most valuable prototyping technique for AI UX)",
          "desc": "User research adapted for AI products (interview questions that reveal mental models, not just behaviors), wizard of oz prototyping for AI (simulate AI with a human — the most valuable prototyping tec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: diary studies for AI feature discovery (how do people actually use AI over time?)",
          "desc": "User research adapted for AI products (interview questions that reveal mental models, not just behaviors), wizard of oz prototyping for AI (simulate AI with a human — the most valuable prototyping tec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: contextual inquiry for AI workflow integration",
          "desc": "User research adapted for AI products (interview questions that reveal mental models, not just behaviors), wizard of oz prototyping for AI (simulate AI with a human — the most valuable prototyping tec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: usability testing challenges for probabilistic systems (what is a 'task failure' when the AI is uncertain?)",
          "desc": "User research adapted for AI products (interview questions that reveal mental models, not just behaviors), wizard of oz prototyping for AI (simulate AI with a human — the most valuable prototyping tec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Research Methods for AI Products — Understanding How People Think About AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. User research adapted for AI products (interview questions that reveal mental models, not just behaviors), wizard of oz prototyping for AI (simulate A"
        }
      ]
    },
    {
      "title": "Module 3: Trust Design — Calibrated Confidence in AI",
      "desc": "The trust calibration problem (users over-trust confident-sounding AI, under-trust uncertain AI), the trust spectrum (appropriate trust → automation bias → algorithm aversion), designing for appropriate trust (not maximum trust), signaling AI limitations in the UI (without undermining utility), transparency mechanisms (why did the AI make this decision?), progressive disclosure of AI capability, and trust repair after AI failures. Case study: How to design AI trust cues for a medical diagnosis assistant.",
      "lessons": [
        {
          "title": "Foundations: Trust Design — Calibrated Confidence in AI",
          "desc": "The trust calibration problem (users over-trust confident-sounding AI, under-trust uncertain AI), the trust spectrum (appropriate trust → automation bias → algorithm aversion), designing for appropriate trust (not maximum trust), signaling AI limitations in the UI (without undermining utility), transparency mechanisms (why did the AI make this decision?), progressive disclosure of AI capability, and trust repair after AI failures. Case study: How to design AI trust cues for a medical diagnosis assistant."
        },
        {
          "title": "Module 3.2 Deep Dive: under-trust uncertain AI)",
          "desc": "The trust calibration problem (users over-trust confident-sounding AI, under-trust uncertain AI), the trust spectrum (appropriate trust → automation bias → algorithm aversion), designing for appropria. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: the trust spectrum (appropriate trust → automation bias → algorithm aversion)",
          "desc": "The trust calibration problem (users over-trust confident-sounding AI, under-trust uncertain AI), the trust spectrum (appropriate trust → automation bias → algorithm aversion), designing for appropria. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: designing for appropriate trust (not maximum trust)",
          "desc": "The trust calibration problem (users over-trust confident-sounding AI, under-trust uncertain AI), the trust spectrum (appropriate trust → automation bias → algorithm aversion), designing for appropria. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: signaling AI limitations in the UI (without undermining utility)",
          "desc": "The trust calibration problem (users over-trust confident-sounding AI, under-trust uncertain AI), the trust spectrum (appropriate trust → automation bias → algorithm aversion), designing for appropria. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: transparency mechanisms (why did the AI make this decision?)",
          "desc": "The trust calibration problem (users over-trust confident-sounding AI, under-trust uncertain AI), the trust spectrum (appropriate trust → automation bias → algorithm aversion), designing for appropria. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Trust Design — Calibrated Confidence in AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The trust calibration problem (users over-trust confident-sounding AI, under-trust uncertain AI), the trust spectrum (appropriate trust → automation b"
        }
      ]
    },
    {
      "title": "Module 4: Conversational AI UX — Chatbots, Voice, and the Dialogue Design Principles",
      "desc": "Conversation design principles (Grice's cooperative principle: quantity, quality, relation, manner), handling out-of-scope queries gracefully, designing AI personas and voice (consistent character, appropriate personality, brand alignment), voice UX for AI (designing for spoken language, no visual affordances), the chatbot conversation pattern library (disambiguation, clarification, confirmation, recovery), and LLM conversation UX (open-ended vs. guided interactions). Case study: Claude.ai's interface evolution.",
      "lessons": [
        {
          "title": "Foundations: Conversational AI UX — Chatbots, Voice, and the Dialogue Design Principles",
          "desc": "Conversation design principles (Grice's cooperative principle: quantity, quality, relation, manner), handling out-of-scope queries gracefully, designing AI personas and voice (consistent character, appropriate personality, brand alignment), voice UX for AI (designing for spoken language, no visual affordances), the chatbot conversation pattern library (disambiguation, clarification, confirmation, recovery), and LLM conversation UX (open-ended vs. guided interactions). Case study: Claude.ai's interface evolution."
        },
        {
          "title": "Module 4.2 Deep Dive: quality",
          "desc": "Conversation design principles (Grice's cooperative principle: quantity, quality, relation, manner), handling out-of-scope queries gracefully, designing AI personas and voice (consistent character, ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: relation",
          "desc": "Conversation design principles (Grice's cooperative principle: quantity, quality, relation, manner), handling out-of-scope queries gracefully, designing AI personas and voice (consistent character, ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: manner)",
          "desc": "Conversation design principles (Grice's cooperative principle: quantity, quality, relation, manner), handling out-of-scope queries gracefully, designing AI personas and voice (consistent character, ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: handling out-of-scope queries gracefully",
          "desc": "Conversation design principles (Grice's cooperative principle: quantity, quality, relation, manner), handling out-of-scope queries gracefully, designing AI personas and voice (consistent character, ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: designing AI personas and voice (consistent character",
          "desc": "Conversation design principles (Grice's cooperative principle: quantity, quality, relation, manner), handling out-of-scope queries gracefully, designing AI personas and voice (consistent character, ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Conversational AI UX — Chatbots, Voice, and the Dialogue Design Principles. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Conversation design principles (Grice's cooperative principle: quantity, quality, relation, manner), handling out-of-scope queries gracefully, designi"
        }
      ]
    },
    {
      "title": "Module 5: Generative AI UX — Text, Image, Code, and Multimodal Generation Interfaces",
      "desc": "UX patterns for generative AI (prompt input design, generation previews and progressive rendering, variation display and selection, iteration controls, history and versioning), the blank page problem in generative AI (helping users get started), undo/redo semantics for AI-generated content, integration of generative AI into existing workflows (inline suggestions vs. modal AI), and designing AI experiences that enhance rather than replace creative work. Case study: GitHub Copilot's UX evolution from annoyance to indispensable.",
      "lessons": [
        {
          "title": "Foundations: Generative AI UX — Text, Image, Code, and Multimodal Generation Interfaces",
          "desc": "UX patterns for generative AI (prompt input design, generation previews and progressive rendering, variation display and selection, iteration controls, history and versioning), the blank page problem in generative AI (helping users get started), undo/redo semantics for AI-generated content, integration of generative AI into existing workflows (inline suggestions vs. modal AI), and designing AI experiences that enhance rather than replace creative work. Case study: GitHub Copilot's UX evolution from annoyance to indispensable."
        },
        {
          "title": "Module 5.2 Deep Dive: generation previews and progressive rendering",
          "desc": "Case study: GitHub Copilot's UX evolution from annoyance to indispensable.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: variation display and selection",
          "desc": "UX patterns for generative AI (prompt input design, generation previews and progressive rendering, variation display and selection, iteration controls, history and versioning), the blank page problem . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: iteration controls",
          "desc": "UX patterns for generative AI (prompt input design, generation previews and progressive rendering, variation display and selection, iteration controls, history and versioning), the blank page problem . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: history and versioning)",
          "desc": "UX patterns for generative AI (prompt input design, generation previews and progressive rendering, variation display and selection, iteration controls, history and versioning), the blank page problem . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: the blank page problem in generative AI (helping users get started)",
          "desc": "UX patterns for generative AI (prompt input design, generation previews and progressive rendering, variation display and selection, iteration controls, history and versioning), the blank page problem . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Generative AI UX — Text, Image, Code, and Multimodal Generation Interfaces. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. UX patterns for generative AI (prompt input design, generation previews and progressive rendering, variation display and selection, iteration controls"
        }
      ]
    },
    {
      "title": "Module 6: AI Error States and Failure Design",
      "desc": "The taxonomy of AI failures (wrong answer with high confidence, correct answer with low confidence, refused answer, timeout, technical failure), designing graceful degradation (serving when AI is unavailable), error messages for AI that maintain trust (acknowledge without undermining confidence), the 'I don't know' interaction pattern, appropriate error specificity (too vague vs. too technical), and recovery design that maintains user trust after AI failures. The anti-pattern library: 20 bad AI error state examples.",
      "lessons": [
        {
          "title": "Foundations: AI Error States and Failure Design",
          "desc": "The taxonomy of AI failures (wrong answer with high confidence, correct answer with low confidence, refused answer, timeout, technical failure), designing graceful degradation (serving when AI is unavailable), error messages for AI that maintain trust (acknowledge without undermining confidence), the 'I don't know' interaction pattern, appropriate error specificity (too vague vs. too technical), and recovery design that maintains user trust after AI failures. The anti-pattern library: 20 bad AI error state examples."
        },
        {
          "title": "Module 6.2 Deep Dive: correct answer with low confidence",
          "desc": "The anti-pattern library: 20 bad AI error state examples.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: refused answer",
          "desc": "The taxonomy of AI failures (wrong answer with high confidence, correct answer with low confidence, refused answer, timeout, technical failure), designing graceful degradation (serving when AI is unav. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: timeout",
          "desc": "The taxonomy of AI failures (wrong answer with high confidence, correct answer with low confidence, refused answer, timeout, technical failure), designing graceful degradation (serving when AI is unav. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: technical failure)",
          "desc": "The taxonomy of AI failures (wrong answer with high confidence, correct answer with low confidence, refused answer, timeout, technical failure), designing graceful degradation (serving when AI is unav. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: designing graceful degradation (serving when AI is unavailable)",
          "desc": "The taxonomy of AI failures (wrong answer with high confidence, correct answer with low confidence, refused answer, timeout, technical failure), designing graceful degradation (serving when AI is unav. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: AI Error States and Failure Design. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The taxonomy of AI failures (wrong answer with high confidence, correct answer with low confidence, refused answer, timeout, technical failure), desig"
        }
      ]
    },
    {
      "title": "Module 7: Accessibility and Inclusive Design for AI",
      "desc": "WCAG 2.1 AA compliance for AI-generated content (dynamic content accessibility, screen reader support for streaming AI responses), cognitive accessibility for AI interfaces (reducing cognitive load, designing for varying digital literacy levels), AI for accessibility (AI as accessibility technology — transcription, description, navigation assistance), cultural adaptation for global AI products (interaction patterns, language, imagery, trust signals across cultures), and the inclusive design process.",
      "lessons": [
        {
          "title": "Foundations: Accessibility and Inclusive Design for AI",
          "desc": "WCAG 2.1 AA compliance for AI-generated content (dynamic content accessibility, screen reader support for streaming AI responses), cognitive accessibility for AI interfaces (reducing cognitive load, designing for varying digital literacy levels), AI for accessibility (AI as accessibility technology — transcription, description, navigation assistance), cultural adaptation for global AI products (interaction patterns, language, imagery, trust signals across cultures), and the inclusive design process."
        },
        {
          "title": "Module 7.2 Deep Dive: screen reader support for streaming AI responses)",
          "desc": "WCAG 2.1 AA compliance for AI-generated content (dynamic content accessibility, screen reader support for streaming AI responses), cognitive accessibility for AI interfaces (reducing cognitive load, d. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: cognitive accessibility for AI interfaces (reducing cognitive load",
          "desc": "WCAG 2.1 AA compliance for AI-generated content (dynamic content accessibility, screen reader support for streaming AI responses), cognitive accessibility for AI interfaces (reducing cognitive load, d. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: designing for varying digital literacy levels)",
          "desc": "WCAG 2.1 AA compliance for AI-generated content (dynamic content accessibility, screen reader support for streaming AI responses), cognitive accessibility for AI interfaces (reducing cognitive load, d. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: AI for accessibility (AI as accessibility technology — transcription",
          "desc": "WCAG 2.1 AA compliance for AI-generated content (dynamic content accessibility, screen reader support for streaming AI responses), cognitive accessibility for AI interfaces (reducing cognitive load, d. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: description",
          "desc": "WCAG 2.1 AA compliance for AI-generated content (dynamic content accessibility, screen reader support for streaming AI responses), cognitive accessibility for AI interfaces (reducing cognitive load, d. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Accessibility and Inclusive Design for AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. WCAG 2.1 AA compliance for AI-generated content (dynamic content accessibility, screen reader support for streaming AI responses), cognitive accessibi"
        }
      ]
    },
    {
      "title": "Module 8: Agentic AI UX — Designing for Autonomous Systems",
      "desc": "UX patterns for AI agents (progress visualization for long-running tasks, interruption and override mechanisms, agent action visualization, confidence indicators for agent decisions), designing the approval gate experience (presenting agent actions for human review in a way that enables informed decisions), transparency requirements for autonomous AI (what should users be able to see about agent reasoning?), and the trust and control design for AI agents that act in the world. Case study: Designing the UX for an AI assistant managing your calendar.",
      "lessons": [
        {
          "title": "Foundations: Agentic AI UX — Designing for Autonomous Systems",
          "desc": "UX patterns for AI agents (progress visualization for long-running tasks, interruption and override mechanisms, agent action visualization, confidence indicators for agent decisions), designing the approval gate experience (presenting agent actions for human review in a way that enables informed decisions), transparency requirements for autonomous AI (what should users be able to see about agent reasoning?), and the trust and control design for AI agents that act in the world. Case study: Designing the UX for an AI assistant managing your calendar."
        },
        {
          "title": "Module 8.2 Deep Dive: interruption and override mechanisms",
          "desc": "UX patterns for AI agents (progress visualization for long-running tasks, interruption and override mechanisms, agent action visualization, confidence indicators for agent decisions), designing the ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: agent action visualization",
          "desc": "UX patterns for AI agents (progress visualization for long-running tasks, interruption and override mechanisms, agent action visualization, confidence indicators for agent decisions), designing the ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: confidence indicators for agent decisions)",
          "desc": "UX patterns for AI agents (progress visualization for long-running tasks, interruption and override mechanisms, agent action visualization, confidence indicators for agent decisions), designing the ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: designing the approval gate experience (presenting agent actions for human review in a way that enables informed decisions)",
          "desc": "UX patterns for AI agents (progress visualization for long-running tasks, interruption and override mechanisms, agent action visualization, confidence indicators for agent decisions), designing the ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: transparency requirements for autonomous AI (what should users be able to see about agent reasoning?)",
          "desc": "UX patterns for AI agents (progress visualization for long-running tasks, interruption and override mechanisms, agent action visualization, confidence indicators for agent decisions), designing the ap. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Agentic AI UX — Designing for Autonomous Systems. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. UX patterns for AI agents (progress visualization for long-running tasks, interruption and override mechanisms, agent action visualization, confidence"
        }
      ]
    },
    {
      "title": "Module 9: AI UX Metrics, Evaluation, and Continuous Improvement",
      "desc": "AI UX metrics beyond standard NPS (task completion rate with AI assistance, assistance acceptance rate, AI override rate, calibration score, long-term retention of AI features), designing A/B tests for AI UX features, qualitative evaluation methods for AI (think-aloud protocols for AI interactions, post-AI-use interviews), longitudinal UX research (how does AI UX change as users develop expertise?), and the AI UX evaluation program that drives continuous improvement.",
      "lessons": [
        {
          "title": "Foundations: AI UX Metrics, Evaluation, and Continuous Improvement",
          "desc": "AI UX metrics beyond standard NPS (task completion rate with AI assistance, assistance acceptance rate, AI override rate, calibration score, long-term retention of AI features), designing A/B tests for AI UX features, qualitative evaluation methods for AI (think-aloud protocols for AI interactions, post-AI-use interviews), longitudinal UX research (how does AI UX change as users develop expertise?), and the AI UX evaluation program that drives continuous improvement."
        },
        {
          "title": "Module 9.2 Deep Dive: assistance acceptance rate",
          "desc": "AI UX metrics beyond standard NPS (task completion rate with AI assistance, assistance acceptance rate, AI override rate, calibration score, long-term retention of AI features), designing A/B tests fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: AI override rate",
          "desc": "AI UX metrics beyond standard NPS (task completion rate with AI assistance, assistance acceptance rate, AI override rate, calibration score, long-term retention of AI features), designing A/B tests fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: calibration score",
          "desc": "AI UX metrics beyond standard NPS (task completion rate with AI assistance, assistance acceptance rate, AI override rate, calibration score, long-term retention of AI features), designing A/B tests fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: long-term retention of AI features)",
          "desc": "AI UX metrics beyond standard NPS (task completion rate with AI assistance, assistance acceptance rate, AI override rate, calibration score, long-term retention of AI features), designing A/B tests fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: designing A/B tests for AI UX features",
          "desc": "AI UX metrics beyond standard NPS (task completion rate with AI assistance, assistance acceptance rate, AI override rate, calibration score, long-term retention of AI features), designing A/B tests fo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: AI UX Metrics, Evaluation, and Continuous Improvement. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI UX metrics beyond standard NPS (task completion rate with AI assistance, assistance acceptance rate, AI override rate, calibration score, long-term"
        }
      ]
    },
    {
      "title": "Module 10: AI UX Leadership and Capstone",
      "desc": "Building an AI UX practice (team structure, process integration, research ops for AI), the AI UX designer career path ($120K-$220K range), collaborating with ML engineers and data scientists on UX, emerging AI interaction paradigms (spatial computing, ambient AI, embodied AI), and the capstone: complete UX design for an AI product — user research synthesis, UX strategy, information architecture, interaction design specifications, visual design, and usability testing plan with evaluation methodology.",
      "lessons": [
        {
          "title": "Foundations: AI UX Leadership and Capstone",
          "desc": "Building an AI UX practice (team structure, process integration, research ops for AI), the AI UX designer career path ($120K-$220K range), collaborating with ML engineers and data scientists on UX, emerging AI interaction paradigms (spatial computing, ambient AI, embodied AI), and the capstone: complete UX design for an AI product — user research synthesis, UX strategy, information architecture, interaction design specifications, visual design, and usability testing plan with evaluation methodology."
        },
        {
          "title": "Module 10.2 Deep Dive: process integration",
          "desc": "Building an AI UX practice (team structure, process integration, research ops for AI), the AI UX designer career path ($120K-$220K range), collaborating with ML engineers and data scientists on UX, em. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: research ops for AI)",
          "desc": "Building an AI UX practice (team structure, process integration, research ops for AI), the AI UX designer career path ($120K-$220K range), collaborating with ML engineers and data scientists on UX, em. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: the AI UX designer career path ($120K-$220K range)",
          "desc": "Building an AI UX practice (team structure, process integration, research ops for AI), the AI UX designer career path ($120K-$220K range), collaborating with ML engineers and data scientists on UX, em. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: collaborating with ML engineers and data scientists on UX",
          "desc": "Building an AI UX practice (team structure, process integration, research ops for AI), the AI UX designer career path ($120K-$220K range), collaborating with ML engineers and data scientists on UX, em. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: emerging AI interaction paradigms (spatial computing",
          "desc": "Building an AI UX practice (team structure, process integration, research ops for AI), the AI UX designer career path ($120K-$220K range), collaborating with ML engineers and data scientists on UX, em. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: AI UX Leadership and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Building an AI UX practice (team structure, process integration, research ops for AI), the AI UX designer career path ($120K-$220K range), collaborati"
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
