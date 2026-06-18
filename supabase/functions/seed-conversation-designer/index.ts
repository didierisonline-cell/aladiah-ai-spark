import { requireAdminOrServiceRole, corsHeaders } from "../_shared/adminGuard.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
  "description": "Master the art and science of designing conversations between humans and AI. 10 modules covering dialogue design, NLU/NLG, persona design, voice UX, multimodal conversation, LLM-based conversation design, and the craft of making AI conversations feel natural, helpful, and trustworthy at scale.",
  "translations": {
    "es": {
      "title": "Conversation Designer",
      "description": "Master the art and science of designing conversations between humans and AI. 10 modules covering dialogue design, NLU/NLG, persona design, voice UX, multimodal conversation, LLM-based conversation des"
    },
    "fr": {
      "title": "Conversation Designer",
      "description": "Master the art and science of designing conversations between humans and AI. 10 modules covering dialogue design, NLU/NLG, persona design, voice UX, multimodal conversation, LLM-based conversation des"
    },
    "de": {
      "title": "Conversation Designer",
      "description": "Master the art and science of designing conversations between humans and AI. 10 modules covering dialogue design, NLU/NLG, persona design, voice UX, multimodal conversation, LLM-based conversation des"
    },
    "zh": {
      "title": "Conversation Designer",
      "description": "Master the art and science of designing conversations between humans and AI. 10 modules covering dialogue design, NLU/NLG, persona design, voice UX, multimodal conversation, LLM-based conversation des"
    },
    "ar": {
      "title": "Conversation Designer",
      "description": "Master the art and science of designing conversations between humans and AI. 10 modules covering dialogue design, NLU/NLG, persona design, voice UX, multimodal conversation, LLM-based conversation des"
    },
    "ja": {
      "title": "Conversation Designer",
      "description": "Master the art and science of designing conversations between humans and AI. 10 modules covering dialogue design, NLU/NLG, persona design, voice UX, multimodal conversation, LLM-based conversation des"
    }
  },
  "modules": [
    {
      "title": "Module 1: Conversation Design Foundations — The Science of Human-AI Dialogue",
      "desc": "Grice's Cooperative Principle (quantity: right amount of information, quality: true and evidenced, relation: relevant, manner: clear) as a conversation design framework, the 7 conversation design principles from Google's PAIR research, what distinguishes great conversational AI from frustrating chatbots (response quality analysis of 10 real-world examples), the conversation designer's toolkit (flow diagrams, persona guides, response templates, test scripts), and the conversation design career. Case study: The design thinking behind Siri's personality and why it needed to change.",
      "lessons": [
        {
          "title": "Foundations: Conversation Design Foundations — The Science of Human-AI Dialogue",
          "desc": "Grice's Cooperative Principle (quantity: right amount of information, quality: true and evidenced, relation: relevant, manner: clear) as a conversation design framework, the 7 conversation design principles from Google's PAIR research, what distinguishes great conversational AI from frustrating chatbots (response quality analysis of 10 real-world examples), the conversation designer's toolkit (flow diagrams, persona guides, response templates, test scripts), and the conversation design career. Case study: The design thinking behind Siri's personality and why it needed to change."
        },
        {
          "title": "Module 1.2 Deep Dive: quality: true and evidenced",
          "desc": "Grice's Cooperative Principle (quantity: right amount of information, quality: true and evidenced, relation: relevant, manner: clear) as a conversation design framework, the 7 conversation design prin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: relation: relevant",
          "desc": "Grice's Cooperative Principle (quantity: right amount of information, quality: true and evidenced, relation: relevant, manner: clear) as a conversation design framework, the 7 conversation design prin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: manner: clear) as a conversation design framework",
          "desc": "Grice's Cooperative Principle (quantity: right amount of information, quality: true and evidenced, relation: relevant, manner: clear) as a conversation design framework, the 7 conversation design prin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: the 7 conversation design principles from Google's PAIR research",
          "desc": "Grice's Cooperative Principle (quantity: right amount of information, quality: true and evidenced, relation: relevant, manner: clear) as a conversation design framework, the 7 conversation design prin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: what distinguishes great conversational AI from frustrating chatbots (response quality analysis of 10 real-world examples)",
          "desc": "Grice's Cooperative Principle (quantity: right amount of information, quality: true and evidenced, relation: relevant, manner: clear) as a conversation design framework, the 7 conversation design prin. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: Conversation Design Foundations — The Science of Human-AI Dialogue. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Grice's Cooperative Principle (quantity: right amount of information, quality: true and evidenced, relation: relevant, manner: clear) as a conversatio"
        }
      ]
    },
    {
      "title": "Module 2: Dialogue Design — Flow, State Management, and Recovery",
      "desc": "Dialogue flow architecture (linear flows for simple tasks, branching trees for complex decisions, mixed-initiative for collaborative interaction), dialogue state management (tracking established facts, user preferences, task progress across turns), happy path vs. error path design (failure is more important to design than success), graceful degradation strategies, the disambiguation pattern (how to resolve ambiguous user intent without frustrating the user), and Voiceflow and Botpress for dialogue prototyping.",
      "lessons": [
        {
          "title": "Foundations: Dialogue Design — Flow, State Management, and Recovery",
          "desc": "Dialogue flow architecture (linear flows for simple tasks, branching trees for complex decisions, mixed-initiative for collaborative interaction), dialogue state management (tracking established facts, user preferences, task progress across turns), happy path vs. error path design (failure is more important to design than success), graceful degradation strategies, the disambiguation pattern (how to resolve ambiguous user intent without frustrating the user), and Voiceflow and Botpress for dialogue prototyping."
        },
        {
          "title": "Module 2.2 Deep Dive: branching trees for complex decisions",
          "desc": "Dialogue flow architecture (linear flows for simple tasks, branching trees for complex decisions, mixed-initiative for collaborative interaction), dialogue state management (tracking established facts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: mixed-initiative for collaborative interaction)",
          "desc": "Dialogue flow architecture (linear flows for simple tasks, branching trees for complex decisions, mixed-initiative for collaborative interaction), dialogue state management (tracking established facts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: dialogue state management (tracking established facts",
          "desc": "Dialogue flow architecture (linear flows for simple tasks, branching trees for complex decisions, mixed-initiative for collaborative interaction), dialogue state management (tracking established facts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: user preferences",
          "desc": "Dialogue flow architecture (linear flows for simple tasks, branching trees for complex decisions, mixed-initiative for collaborative interaction), dialogue state management (tracking established facts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: task progress across turns)",
          "desc": "Dialogue flow architecture (linear flows for simple tasks, branching trees for complex decisions, mixed-initiative for collaborative interaction), dialogue state management (tracking established facts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Dialogue Design — Flow, State Management, and Recovery. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Dialogue flow architecture (linear flows for simple tasks, branching trees for complex decisions, mixed-initiative for collaborative interaction), dia"
        }
      ]
    },
    {
      "title": "Module 3: NLU Architecture — Intents, Entities, Slots, and Context Management",
      "desc": "Intent classification architecture (binary classifiers vs. multi-class, confidence thresholds, fallback intent design), entity types and their design implications (list entities vs. regex entities vs. ML entities), slot filling for multi-turn information gathering (required vs. optional slots, validation logic), context management across turns (carrying established information, context windows, context expiration), and the NLU testing methodology (intent accuracy, entity accuracy, full conversation accuracy). Working with Rasa, Dialogflow CX, and AWS Lex.",
      "lessons": [
        {
          "title": "Foundations: NLU Architecture — Intents, Entities, Slots, and Context Management",
          "desc": "Intent classification architecture (binary classifiers vs. multi-class, confidence thresholds, fallback intent design), entity types and their design implications (list entities vs. regex entities vs. ML entities), slot filling for multi-turn information gathering (required vs. optional slots, validation logic), context management across turns (carrying established information, context windows, context expiration), and the NLU testing methodology (intent accuracy, entity accuracy, full conversation accuracy). Working with Rasa, Dialogflow CX, and AWS Lex."
        },
        {
          "title": "Module 3.2 Deep Dive: confidence thresholds",
          "desc": "ML entities), slot filling for multi-turn information gathering (required vs. optional slots, validation logic), context management across turns (carrying established information, context windows, context expiration), and the NLU testing methodology (intent accuracy, entity accuracy, full conversation accuracy). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: fallback intent design)",
          "desc": "Working with Rasa, Dialogflow CX, and AWS Lex.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: entity types and their design implications (list entities vs. regex entities vs. ML entities)",
          "desc": "Intent classification architecture (binary classifiers vs. multi-class, confidence thresholds, fallback intent design), entity types and their design implications (list entities vs. regex entities vs.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: slot filling for multi-turn information gathering (required vs. optional slots",
          "desc": "Intent classification architecture (binary classifiers vs. multi-class, confidence thresholds, fallback intent design), entity types and their design implications (list entities vs. regex entities vs.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: validation logic)",
          "desc": "Intent classification architecture (binary classifiers vs. multi-class, confidence thresholds, fallback intent design), entity types and their design implications (list entities vs. regex entities vs.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: NLU Architecture — Intents, Entities, Slots, and Context Management. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Intent classification architecture (binary classifiers vs. multi-class, confidence thresholds, fallback intent design), entity types and their design "
        }
      ]
    },
    {
      "title": "Module 4: AI Persona Design — Voice, Tone, Character, and Ethical Boundaries",
      "desc": "Persona design methodology (user research → persona brief → voice guide → tone variations → style examples), brand voice translation into conversational AI (how Mailchimp's 'voice' became their bot's personality), designing for trust and appropriate authority (when AI should sound certain vs. uncertain), the ethics of persona design (disclosure requirements — AI must not pretend to be human, per FTC guidance and EU AI Act), designing persona resilience (maintaining persona under adversarial user behavior), and the persona style guide template.",
      "lessons": [
        {
          "title": "Foundations: AI Persona Design — Voice, Tone, Character, and Ethical Boundaries",
          "desc": "Persona design methodology (user research → persona brief → voice guide → tone variations → style examples), brand voice translation into conversational AI (how Mailchimp's 'voice' became their bot's personality), designing for trust and appropriate authority (when AI should sound certain vs. uncertain), the ethics of persona design (disclosure requirements — AI must not pretend to be human, per FTC guidance and EU AI Act), designing persona resilience (maintaining persona under adversarial user behavior), and the persona style guide template."
        },
        {
          "title": "Module 4.2 Deep Dive: brand voice translation into conversational AI (how Mailchimp's 'voice' became their bot's personality)",
          "desc": "Persona design methodology (user research → persona brief → voice guide → tone variations → style examples), brand voice translation into conversational AI (how Mailchimp's 'voice' became their bot's . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: designing for trust and appropriate authority (when AI should sound certain vs. uncertain)",
          "desc": "Persona design methodology (user research → persona brief → voice guide → tone variations → style examples), brand voice translation into conversational AI (how Mailchimp's 'voice' became their bot's . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: the ethics of persona design (disclosure requirements — AI must not pretend to be human",
          "desc": "Persona design methodology (user research → persona brief → voice guide → tone variations → style examples), brand voice translation into conversational AI (how Mailchimp's 'voice' became their bot's . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: per FTC guidance and EU AI Act)",
          "desc": "Persona design methodology (user research → persona brief → voice guide → tone variations → style examples), brand voice translation into conversational AI (how Mailchimp's 'voice' became their bot's . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: designing persona resilience (maintaining persona under adversarial user behavior)",
          "desc": "Persona design methodology (user research → persona brief → voice guide → tone variations → style examples), brand voice translation into conversational AI (how Mailchimp's 'voice' became their bot's . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: AI Persona Design — Voice, Tone, Character, and Ethical Boundaries. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Persona design methodology (user research → persona brief → voice guide → tone variations → style examples), brand voice translation into conversation"
        }
      ]
    },
    {
      "title": "Module 5: Voice UX Design — Spoken Interaction Without Visual Affordances",
      "desc": "Voice-first design constraints (sequential information processing in audio — no scanning, no going back without explicit commands), voice interaction patterns (wake word design, invocation phrases, skill/action activation, multi-turn conversation, confirmation patterns), prosody and pacing in TTS (punctuation affects speech rhythm, sentence length affects comprehension), SSML (Speech Synthesis Markup Language) for expressive TTS, error recovery in voice (how to handle misrecognitions gracefully), and multimodal voice+screen design for smart displays.",
      "lessons": [
        {
          "title": "Foundations: Voice UX Design — Spoken Interaction Without Visual Affordances",
          "desc": "Voice-first design constraints (sequential information processing in audio — no scanning, no going back without explicit commands), voice interaction patterns (wake word design, invocation phrases, skill/action activation, multi-turn conversation, confirmation patterns), prosody and pacing in TTS (punctuation affects speech rhythm, sentence length affects comprehension), SSML (Speech Synthesis Markup Language) for expressive TTS, error recovery in voice (how to handle misrecognitions gracefully), and multimodal voice+screen design for smart displays."
        },
        {
          "title": "Module 5.2 Deep Dive: no going back without explicit commands)",
          "desc": "Voice-first design constraints (sequential information processing in audio — no scanning, no going back without explicit commands), voice interaction patterns (wake word design, invocation phrases, sk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: voice interaction patterns (wake word design",
          "desc": "Voice-first design constraints (sequential information processing in audio — no scanning, no going back without explicit commands), voice interaction patterns (wake word design, invocation phrases, sk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: invocation phrases",
          "desc": "Voice-first design constraints (sequential information processing in audio — no scanning, no going back without explicit commands), voice interaction patterns (wake word design, invocation phrases, sk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: skill/action activation",
          "desc": "Voice-first design constraints (sequential information processing in audio — no scanning, no going back without explicit commands), voice interaction patterns (wake word design, invocation phrases, sk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: multi-turn conversation",
          "desc": "Voice-first design constraints (sequential information processing in audio — no scanning, no going back without explicit commands), voice interaction patterns (wake word design, invocation phrases, sk. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Voice UX Design — Spoken Interaction Without Visual Affordances. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Voice-first design constraints (sequential information processing in audio — no scanning, no going back without explicit commands), voice interaction "
        }
      ]
    },
    {
      "title": "Module 6: Multimodal Conversation Design — Text + Voice + Image + Touch",
      "desc": "Multimodal design principles (modal harmony: use the right modality for each information type; modal switch: seamless transitions between modalities; modal consistency: consistent behavior across modalities), screen + voice design for smart displays (what shows visually while audio plays), image-input conversation design (handling user photo submissions in conversation), text + image generation conversation patterns, gesture + voice for spatial computing, and the multimodal conversation design pattern library.",
      "lessons": [
        {
          "title": "Foundations: Multimodal Conversation Design — Text + Voice + Image + Touch",
          "desc": "Multimodal design principles (modal harmony: use the right modality for each information type; modal switch: seamless transitions between modalities; modal consistency: consistent behavior across modalities), screen + voice design for smart displays (what shows visually while audio plays), image-input conversation design (handling user photo submissions in conversation), text + image generation conversation patterns, gesture + voice for spatial computing, and the multimodal conversation design pattern library."
        },
        {
          "title": "Module 6.2 Deep Dive: screen + voice design for smart displays (what shows visually while audio plays)",
          "desc": "Multimodal design principles (modal harmony: use the right modality for each information type; modal switch: seamless transitions between modalities; modal consistency: consistent behavior across moda. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: image-input conversation design (handling user photo submissions in conversation)",
          "desc": "Multimodal design principles (modal harmony: use the right modality for each information type; modal switch: seamless transitions between modalities; modal consistency: consistent behavior across moda. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: text + image generation conversation patterns",
          "desc": "Multimodal design principles (modal harmony: use the right modality for each information type; modal switch: seamless transitions between modalities; modal consistency: consistent behavior across moda. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: gesture + voice for spatial computing",
          "desc": "Multimodal design principles (modal harmony: use the right modality for each information type; modal switch: seamless transitions between modalities; modal consistency: consistent behavior across moda. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: and the multimodal conversation design pattern library.",
          "desc": "Multimodal design principles (modal harmony: use the right modality for each information type; modal switch: seamless transitions between modalities; modal consistency: consistent behavior across moda. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Multimodal Conversation Design — Text + Voice + Image + Touch. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Multimodal design principles (modal harmony: use the right modality for each information type; modal switch: seamless transitions between modalities; "
        }
      ]
    },
    {
      "title": "Module 7: Enterprise Conversation Design — Support, Sales, HR, and Compliance",
      "desc": "Enterprise conversation design for customer support (resolution-first design philosophy, knowledge base integration patterns, sentiment detection and escalation triggers, after-hours handling), sales conversation AI (discovery, qualification, objection handling in conversation format), HR AI conversation design (benefits queries, PTO requests, sensitive topics like harassment), and the compliance requirements for enterprise AI conversations (call recording disclosure, HIPAA for healthcare conversations, financial advice disclaimers).",
      "lessons": [
        {
          "title": "Foundations: Enterprise Conversation Design — Support, Sales, HR, and Compliance",
          "desc": "Enterprise conversation design for customer support (resolution-first design philosophy, knowledge base integration patterns, sentiment detection and escalation triggers, after-hours handling), sales conversation AI (discovery, qualification, objection handling in conversation format), HR AI conversation design (benefits queries, PTO requests, sensitive topics like harassment), and the compliance requirements for enterprise AI conversations (call recording disclosure, HIPAA for healthcare conversations, financial advice disclaimers)."
        },
        {
          "title": "Module 7.2 Deep Dive: knowledge base integration patterns",
          "desc": "Enterprise conversation design for customer support (resolution-first design philosophy, knowledge base integration patterns, sentiment detection and escalation triggers, after-hours handling), sales . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: sentiment detection and escalation triggers",
          "desc": "Enterprise conversation design for customer support (resolution-first design philosophy, knowledge base integration patterns, sentiment detection and escalation triggers, after-hours handling), sales . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: after-hours handling)",
          "desc": "Enterprise conversation design for customer support (resolution-first design philosophy, knowledge base integration patterns, sentiment detection and escalation triggers, after-hours handling), sales . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: sales conversation AI (discovery",
          "desc": "Enterprise conversation design for customer support (resolution-first design philosophy, knowledge base integration patterns, sentiment detection and escalation triggers, after-hours handling), sales . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: qualification",
          "desc": "Enterprise conversation design for customer support (resolution-first design philosophy, knowledge base integration patterns, sentiment detection and escalation triggers, after-hours handling), sales . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Enterprise Conversation Design — Support, Sales, HR, and Compliance. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Enterprise conversation design for customer support (resolution-first design philosophy, knowledge base integration patterns, sentiment detection and "
        }
      ]
    },
    {
      "title": "Module 8: LLM-Based Conversation Design — Prompting for Scale and Consistency",
      "desc": "The system prompt as conversation design artifact (not just instructions — it's the persona guide, the policy guide, and the quality standard), designing system prompts using RISEN framework for conversational AI, few-shot examples embedded in system prompts for consistent quality, handling off-topic queries at scale (graceful redirect vs. engagement), conversation quality monitoring at million-conversation scale (LLM-as-judge for quality scoring), and maintaining conversation consistency as underlying models update.",
      "lessons": [
        {
          "title": "Foundations: LLM-Based Conversation Design — Prompting for Scale and Consistency",
          "desc": "The system prompt as conversation design artifact (not just instructions — it's the persona guide, the policy guide, and the quality standard), designing system prompts using RISEN framework for conversational AI, few-shot examples embedded in system prompts for consistent quality, handling off-topic queries at scale (graceful redirect vs. engagement), conversation quality monitoring at million-conversation scale (LLM-as-judge for quality scoring), and maintaining conversation consistency as underlying models update."
        },
        {
          "title": "Module 8.2 Deep Dive: the policy guide",
          "desc": "The system prompt as conversation design artifact (not just instructions — it's the persona guide, the policy guide, and the quality standard), designing system prompts using RISEN framework for conve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: and the quality standard)",
          "desc": "The system prompt as conversation design artifact (not just instructions — it's the persona guide, the policy guide, and the quality standard), designing system prompts using RISEN framework for conve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: designing system prompts using RISEN framework for conversational AI",
          "desc": "The system prompt as conversation design artifact (not just instructions — it's the persona guide, the policy guide, and the quality standard), designing system prompts using RISEN framework for conve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: few-shot examples embedded in system prompts for consistent quality",
          "desc": "The system prompt as conversation design artifact (not just instructions — it's the persona guide, the policy guide, and the quality standard), designing system prompts using RISEN framework for conve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: handling off-topic queries at scale (graceful redirect vs. engagement)",
          "desc": "The system prompt as conversation design artifact (not just instructions — it's the persona guide, the policy guide, and the quality standard), designing system prompts using RISEN framework for conve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: LLM-Based Conversation Design — Prompting for Scale and Consistency. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The system prompt as conversation design artifact (not just instructions — it's the persona guide, the policy guide, and the quality standard), design"
        }
      ]
    },
    {
      "title": "Module 9: Conversation Testing and Quality Assurance",
      "desc": "The conversation testing pyramid (unit: individual intent/entity tests; integration: multi-turn flow tests; end-to-end: full conversation tests; adversarial: abuse and edge case tests), test script design methodology, NLU accuracy testing (intent accuracy matrix, entity recall/precision), conversation quality metrics (resolution rate, conversation length, escalation rate, CSAT correlation), simulation-based testing for large-scale coverage, and the conversation QA program that catches regressions before users experience them.",
      "lessons": [
        {
          "title": "Foundations: Conversation Testing and Quality Assurance",
          "desc": "The conversation testing pyramid (unit: individual intent/entity tests; integration: multi-turn flow tests; end-to-end: full conversation tests; adversarial: abuse and edge case tests), test script design methodology, NLU accuracy testing (intent accuracy matrix, entity recall/precision), conversation quality metrics (resolution rate, conversation length, escalation rate, CSAT correlation), simulation-based testing for large-scale coverage, and the conversation QA program that catches regressions before users experience them."
        },
        {
          "title": "Module 9.2 Deep Dive: test script design methodology",
          "desc": "The conversation testing pyramid (unit: individual intent/entity tests; integration: multi-turn flow tests; end-to-end: full conversation tests; adversarial: abuse and edge case tests), test script de. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: NLU accuracy testing (intent accuracy matrix",
          "desc": "The conversation testing pyramid (unit: individual intent/entity tests; integration: multi-turn flow tests; end-to-end: full conversation tests; adversarial: abuse and edge case tests), test script de. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: entity recall/precision)",
          "desc": "The conversation testing pyramid (unit: individual intent/entity tests; integration: multi-turn flow tests; end-to-end: full conversation tests; adversarial: abuse and edge case tests), test script de. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: conversation quality metrics (resolution rate",
          "desc": "The conversation testing pyramid (unit: individual intent/entity tests; integration: multi-turn flow tests; end-to-end: full conversation tests; adversarial: abuse and edge case tests), test script de. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: conversation length",
          "desc": "The conversation testing pyramid (unit: individual intent/entity tests; integration: multi-turn flow tests; end-to-end: full conversation tests; adversarial: abuse and edge case tests), test script de. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Conversation Testing and Quality Assurance. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The conversation testing pyramid (unit: individual intent/entity tests; integration: multi-turn flow tests; end-to-end: full conversation tests; adver"
        }
      ]
    },
    {
      "title": "Module 10: Conversation Design Leadership and Capstone",
      "desc": "Building a conversation design practice (team structure, process integration with product and engineering, voice and conversational AI CoE), the conversation designer career path ($100K-$180K range), emerging conversation paradigms (LLM-native conversation design, proactive conversation initiation, emotional AI conversation), and the capstone: complete conversation design deliverables for an AI system — persona guide, dialogue flows for all key journeys, NLU design documentation, voice guidelines, multimodal specifications, sample conversations for training, and conversation test suite.",
      "lessons": [
        {
          "title": "Foundations: Conversation Design Leadership and Capstone",
          "desc": "Building a conversation design practice (team structure, process integration with product and engineering, voice and conversational AI CoE), the conversation designer career path ($100K-$180K range), emerging conversation paradigms (LLM-native conversation design, proactive conversation initiation, emotional AI conversation), and the capstone: complete conversation design deliverables for an AI system — persona guide, dialogue flows for all key journeys, NLU design documentation, voice guidelines, multimodal specifications, sample conversations for training, and conversation test suite."
        },
        {
          "title": "Module 10.2 Deep Dive: process integration with product and engineering",
          "desc": "Building a conversation design practice (team structure, process integration with product and engineering, voice and conversational AI CoE), the conversation designer career path ($100K-$180K range), . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: voice and conversational AI CoE)",
          "desc": "Building a conversation design practice (team structure, process integration with product and engineering, voice and conversational AI CoE), the conversation designer career path ($100K-$180K range), . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: the conversation designer career path ($100K-$180K range)",
          "desc": "Building a conversation design practice (team structure, process integration with product and engineering, voice and conversational AI CoE), the conversation designer career path ($100K-$180K range), . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: emerging conversation paradigms (LLM-native conversation design",
          "desc": "Building a conversation design practice (team structure, process integration with product and engineering, voice and conversational AI CoE), the conversation designer career path ($100K-$180K range), . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: proactive conversation initiation",
          "desc": "Building a conversation design practice (team structure, process integration with product and engineering, voice and conversational AI CoE), the conversation designer career path ($100K-$180K range), . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Conversation Design Leadership and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Building a conversation design practice (team structure, process integration with product and engineering, voice and conversational AI CoE), the conve"
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
