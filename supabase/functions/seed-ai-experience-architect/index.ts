import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/auth.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Experience Architect",
  "description": "Architect holistic AI experiences that span products, services, and organizational touchpoints. 10 modules covering service design, experience strategy, AI journey mapping, personalization architecture, inclusive design, and the systems thinking required to design AI experiences that are seamless, trustworthy, and genuinely valuable.",
  "translations": {
    "es": {
      "title": "AI Experience Architect",
      "description": "Architect holistic AI experiences that span products, services, and organizational touchpoints. 10 modules covering service design, experience strategy, AI journey mapping, personalization architectur"
    },
    "fr": {
      "title": "AI Experience Architect",
      "description": "Architect holistic AI experiences that span products, services, and organizational touchpoints. 10 modules covering service design, experience strategy, AI journey mapping, personalization architectur"
    },
    "de": {
      "title": "AI Experience Architect",
      "description": "Architect holistic AI experiences that span products, services, and organizational touchpoints. 10 modules covering service design, experience strategy, AI journey mapping, personalization architectur"
    },
    "zh": {
      "title": "AI Experience Architect",
      "description": "Architect holistic AI experiences that span products, services, and organizational touchpoints. 10 modules covering service design, experience strategy, AI journey mapping, personalization architectur"
    },
    "ar": {
      "title": "AI Experience Architect",
      "description": "Architect holistic AI experiences that span products, services, and organizational touchpoints. 10 modules covering service design, experience strategy, AI journey mapping, personalization architectur"
    },
    "ja": {
      "title": "AI Experience Architect",
      "description": "Architect holistic AI experiences that span products, services, and organizational touchpoints. 10 modules covering service design, experience strategy, AI journey mapping, personalization architectur"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Experience Architecture — Systems Thinking for Holistic AI Design",
      "desc": "The experience architect role (not designing individual interfaces but entire experience systems), service design thinking applied to AI (front stage: visible AI interactions; backstage: invisible AI operations; support: technology and people enabling AI), the AI experience ecosystem map (all touchpoints where AI touches the user journey), experience architecture as strategic business capability, and the difference between interaction design and experience architecture. Case study: How Amazon designed the complete Alexa experience ecosystem across 100+ device types.",
      "lessons": [
        {
          "title": "Foundations: AI Experience Architecture — Systems Thinking for Holistic AI Design",
          "desc": "The experience architect role (not designing individual interfaces but entire experience systems), service design thinking applied to AI (front stage: visible AI interactions; backstage: invisible AI operations; support: technology and people enabling AI), the AI experience ecosystem map (all touchpoints where AI touches the user journey), experience architecture as strategic business capability, and the difference between interaction design and experience architecture. Case study: How Amazon designed the complete Alexa experience ecosystem across 100+ device types."
        },
        {
          "title": "Module 1.2 Deep Dive: service design thinking applied to AI (front stage: visible AI interactions; backstage: invisible AI operations; support: technology and people enabling AI)",
          "desc": "The experience architect role (not designing individual interfaces but entire experience systems), service design thinking applied to AI (front stage: visible AI interactions; backstage: invisible AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: the AI experience ecosystem map (all touchpoints where AI touches the user journey)",
          "desc": "The experience architect role (not designing individual interfaces but entire experience systems), service design thinking applied to AI (front stage: visible AI interactions; backstage: invisible AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: experience architecture as strategic business capability",
          "desc": "The experience architect role (not designing individual interfaces but entire experience systems), service design thinking applied to AI (front stage: visible AI interactions; backstage: invisible AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: and the difference between interaction design and experience architecture. Case study: How Amazon designed the complete Alexa experience ecosystem across 100+ device types.",
          "desc": "The experience architect role (not designing individual interfaces but entire experience systems), service design thinking applied to AI (front stage: visible AI interactions; backstage: invisible AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: The experience architect role (not designing individual inte",
          "desc": "The experience architect role (not designing individual interfaces but entire experience systems), service design thinking applied to AI (front stage: visible AI interactions; backstage: invisible AI . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Experience Architecture — Systems Thinking for Holistic AI Design. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The experience architect role (not designing individual interfaces but entire experience systems), service design thinking applied to AI (front stage:"
        }
      ]
    },
    {
      "title": "Module 2: AI Journey Mapping — The Complete Toolkit for Experience Discovery",
      "desc": "Customer journey mapping adapted for AI experiences (the double-diamond adapted for AI journey discovery), AI touchpoint analysis (where does AI intervene? proactively or reactively? visibly or invisibly?), emotional journey mapping with AI (how does AI affect user emotion at each touchpoint — delight, frustration, anxiety, trust?), the before/during/after AI interaction model, opportunity identification from journey maps, and the AI journey mapping workshop facilitation guide.",
      "lessons": [
        {
          "title": "Foundations: AI Journey Mapping — The Complete Toolkit for Experience Discovery",
          "desc": "Customer journey mapping adapted for AI experiences (the double-diamond adapted for AI journey discovery), AI touchpoint analysis (where does AI intervene? proactively or reactively? visibly or invisibly?), emotional journey mapping with AI (how does AI affect user emotion at each touchpoint — delight, frustration, anxiety, trust?), the before/during/after AI interaction model, opportunity identification from journey maps, and the AI journey mapping workshop facilitation guide."
        },
        {
          "title": "Module 2.2 Deep Dive: AI touchpoint analysis (where does AI intervene? proactively or reactively? visibly or invisibly?)",
          "desc": "Customer journey mapping adapted for AI experiences (the double-diamond adapted for AI journey discovery), AI touchpoint analysis (where does AI intervene? proactively or reactively? visibly or invisi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: emotional journey mapping with AI (how does AI affect user emotion at each touchpoint — delight",
          "desc": "Customer journey mapping adapted for AI experiences (the double-diamond adapted for AI journey discovery), AI touchpoint analysis (where does AI intervene? proactively or reactively? visibly or invisi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: frustration",
          "desc": "Customer journey mapping adapted for AI experiences (the double-diamond adapted for AI journey discovery), AI touchpoint analysis (where does AI intervene? proactively or reactively? visibly or invisi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: anxiety",
          "desc": "Customer journey mapping adapted for AI experiences (the double-diamond adapted for AI journey discovery), AI touchpoint analysis (where does AI intervene? proactively or reactively? visibly or invisi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: trust?)",
          "desc": "Customer journey mapping adapted for AI experiences (the double-diamond adapted for AI journey discovery), AI touchpoint analysis (where does AI intervene? proactively or reactively? visibly or invisi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: AI Journey Mapping — The Complete Toolkit for Experience Discovery. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Customer journey mapping adapted for AI experiences (the double-diamond adapted for AI journey discovery), AI touchpoint analysis (where does AI inter"
        }
      ]
    },
    {
      "title": "Module 3: AI Experience Strategy — Vision, Principles, and Competitive Differentiation",
      "desc": "Developing the AI experience vision (what AI experience do we want to be renowned for?), AI experience principles as design guardrails (the principles that make every AI decision consistent), experience differentiation through AI (how does AI create a uniquely valuable experience that competitors can't easily replicate?), the AI experience product roadmap, aligning AI experience strategy with brand strategy, and the experience-led vs. technology-led AI strategy debate. Case study: Spotify's AI experience strategy — discover, not just consume.",
      "lessons": [
        {
          "title": "Foundations: AI Experience Strategy — Vision, Principles, and Competitive Differentiation",
          "desc": "Developing the AI experience vision (what AI experience do we want to be renowned for?), AI experience principles as design guardrails (the principles that make every AI decision consistent), experience differentiation through AI (how does AI create a uniquely valuable experience that competitors can't easily replicate?), the AI experience product roadmap, aligning AI experience strategy with brand strategy, and the experience-led vs. technology-led AI strategy debate. Case study: Spotify's AI experience strategy — discover, not just consume."
        },
        {
          "title": "Module 3.2 Deep Dive: AI experience principles as design guardrails (the principles that make every AI decision consistent)",
          "desc": "Case study: Spotify's AI experience strategy — discover, not just consume.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: experience differentiation through AI (how does AI create a uniquely valuable experience that competitors can't easily replicate?)",
          "desc": "Developing the AI experience vision (what AI experience do we want to be renowned for?), AI experience principles as design guardrails (the principles that make every AI decision consistent), experien. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: the AI experience product roadmap",
          "desc": "Developing the AI experience vision (what AI experience do we want to be renowned for?), AI experience principles as design guardrails (the principles that make every AI decision consistent), experien. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: aligning AI experience strategy with brand strategy",
          "desc": "Developing the AI experience vision (what AI experience do we want to be renowned for?), AI experience principles as design guardrails (the principles that make every AI decision consistent), experien. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: and the experience-led vs. technology-led AI strategy debate. Case study: Spotify's AI experience strategy — discover",
          "desc": "Developing the AI experience vision (what AI experience do we want to be renowned for?), AI experience principles as design guardrails (the principles that make every AI decision consistent), experien. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: AI Experience Strategy — Vision, Principles, and Competitive Differentiation. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Developing the AI experience vision (what AI experience do we want to be renowned for?), AI experience principles as design guardrails (the principles"
        }
      ]
    },
    {
      "title": "Module 4: Multi-Channel and Omnichannel AI Experience Design",
      "desc": "Designing AI experiences across channels (web, mobile app, voice, in-store kiosk, email, customer support, field sales), channel-specific AI interaction patterns (what AI capabilities are appropriate for each channel), experience continuity across channels (AI that remembers you — your preferences, history, and context — across all touchpoints), designing for channel-switching within a single journey (start on mobile, complete on desktop with AI context preserved), and the technology architecture that enables consistent omnichannel AI.",
      "lessons": [
        {
          "title": "Foundations: Multi-Channel and Omnichannel AI Experience Design",
          "desc": "Designing AI experiences across channels (web, mobile app, voice, in-store kiosk, email, customer support, field sales), channel-specific AI interaction patterns (what AI capabilities are appropriate for each channel), experience continuity across channels (AI that remembers you — your preferences, history, and context — across all touchpoints), designing for channel-switching within a single journey (start on mobile, complete on desktop with AI context preserved), and the technology architecture that enables consistent omnichannel AI."
        },
        {
          "title": "Module 4.2 Deep Dive: mobile app",
          "desc": "Designing AI experiences across channels (web, mobile app, voice, in-store kiosk, email, customer support, field sales), channel-specific AI interaction patterns (what AI capabilities are appropriate . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: voice",
          "desc": "Designing AI experiences across channels (web, mobile app, voice, in-store kiosk, email, customer support, field sales), channel-specific AI interaction patterns (what AI capabilities are appropriate . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: in-store kiosk",
          "desc": "Designing AI experiences across channels (web, mobile app, voice, in-store kiosk, email, customer support, field sales), channel-specific AI interaction patterns (what AI capabilities are appropriate . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: email",
          "desc": "Designing AI experiences across channels (web, mobile app, voice, in-store kiosk, email, customer support, field sales), channel-specific AI interaction patterns (what AI capabilities are appropriate . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: customer support",
          "desc": "Designing AI experiences across channels (web, mobile app, voice, in-store kiosk, email, customer support, field sales), channel-specific AI interaction patterns (what AI capabilities are appropriate . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Multi-Channel and Omnichannel AI Experience Design. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Designing AI experiences across channels (web, mobile app, voice, in-store kiosk, email, customer support, field sales), channel-specific AI interacti"
        }
      ]
    },
    {
      "title": "Module 5: Personalization Architecture — From Data to Individualized Experience",
      "desc": "Personalization strategy framework (what to personalize: content, timing, channel, format, offers; for whom: user segment vs. individual; when: real-time vs. scheduled; based on: behavioral, contextual, stated preference data), the personalization data foundation (event collection architecture, identity resolution, feature store for personalization), real-time personalization architecture (recommendation engines, content adaptation, dynamic experience assembly), and the privacy-personalization tradeoff — when personalization crosses into surveillance. Case study: Netflix's personalization architecture serving 260M members.",
      "lessons": [
        {
          "title": "Foundations: Personalization Architecture — From Data to Individualized Experience",
          "desc": "Personalization strategy framework (what to personalize: content, timing, channel, format, offers; for whom: user segment vs. individual; when: real-time vs. scheduled; based on: behavioral, contextual, stated preference data), the personalization data foundation (event collection architecture, identity resolution, feature store for personalization), real-time personalization architecture (recommendation engines, content adaptation, dynamic experience assembly), and the privacy-personalization tradeoff — when personalization crosses into surveillance. Case study: Netflix's personalization architecture serving 260M members."
        },
        {
          "title": "Module 5.2 Deep Dive: timing",
          "desc": "scheduled; based on: behavioral, contextual, stated preference data), the personalization data foundation (event collection architecture, identity resolution, feature store for personalization), real-time personalization architecture (recommendation engines, content adaptation, dynamic experience assembly), and the privacy-personalization tradeoff — when personalization crosses into surveillance. Case study: Netflix's personalization architecture serving 260M members.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: channel",
          "desc": "Personalization strategy framework (what to personalize: content, timing, channel, format, offers; for whom: user segment vs. individual; when: real-time vs. scheduled; based on: behavioral, contextua. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: format",
          "desc": "Personalization strategy framework (what to personalize: content, timing, channel, format, offers; for whom: user segment vs. individual; when: real-time vs. scheduled; based on: behavioral, contextua. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: offers; for whom: user segment vs. individual; when: real-time vs. scheduled; based on: behavioral",
          "desc": "Personalization strategy framework (what to personalize: content, timing, channel, format, offers; for whom: user segment vs. individual; when: real-time vs. scheduled; based on: behavioral, contextua. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: contextual",
          "desc": "Personalization strategy framework (what to personalize: content, timing, channel, format, offers; for whom: user segment vs. individual; when: real-time vs. scheduled; based on: behavioral, contextua. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Personalization Architecture — From Data to Individualized Experience. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Personalization strategy framework (what to personalize: content, timing, channel, format, offers; for whom: user segment vs. individual; when: real-t"
        }
      ]
    },
    {
      "title": "Module 6: AI Experience Governance — Consistency, Quality, and Trust at Scale",
      "desc": "AI experience governance framework (experience inventory: all AI touchpoints cataloged and owned; design system: AI-specific components, patterns, and guidelines that ensure consistency; quality monitoring: measuring AI experience quality at scale; incident management: what to do when AI creates a bad experience; change management: how to update AI experiences without creating inconsistencies), and building the governance model that maintains experience quality as AI capabilities evolve and expand.",
      "lessons": [
        {
          "title": "Foundations: AI Experience Governance — Consistency, Quality, and Trust at Scale",
          "desc": "AI experience governance framework (experience inventory: all AI touchpoints cataloged and owned; design system: AI-specific components, patterns, and guidelines that ensure consistency; quality monitoring: measuring AI experience quality at scale; incident management: what to do when AI creates a bad experience; change management: how to update AI experiences without creating inconsistencies), and building the governance model that maintains experience quality as AI capabilities evolve and expand."
        },
        {
          "title": "Module 6.2 Deep Dive: patterns",
          "desc": "AI experience governance framework (experience inventory: all AI touchpoints cataloged and owned; design system: AI-specific components, patterns, and guidelines that ensure consistency; quality monit. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: and guidelines that ensure consistency; quality monitoring: measuring AI experience quality at scale; incident management: what to do when AI creates a bad experience; change management: how to update AI experiences without creating inconsistencies)",
          "desc": "AI experience governance framework (experience inventory: all AI touchpoints cataloged and owned; design system: AI-specific components, patterns, and guidelines that ensure consistency; quality monit. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: and building the governance model that maintains experience quality as AI capabilities evolve and expand.",
          "desc": "AI experience governance framework (experience inventory: all AI touchpoints cataloged and owned; design system: AI-specific components, patterns, and guidelines that ensure consistency; quality monit. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: AI experience governance framework (experience inventory: al",
          "desc": "AI experience governance framework (experience inventory: all AI touchpoints cataloged and owned; design system: AI-specific components, patterns, and guidelines that ensure consistency; quality monit. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: AI experience governance framework (experience inventory: al",
          "desc": "AI experience governance framework (experience inventory: all AI touchpoints cataloged and owned; design system: AI-specific components, patterns, and guidelines that ensure consistency; quality monit. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: AI Experience Governance — Consistency, Quality, and Trust at Scale. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI experience governance framework (experience inventory: all AI touchpoints cataloged and owned; design system: AI-specific components, patterns, and"
        }
      ]
    },
    {
      "title": "Module 7: Measuring AI Experience — Metrics, Research, and Continuous Improvement",
      "desc": "AI experience measurement beyond NPS (experience quality index: composite of multiple signals; AI task success rate: did the AI help users accomplish their goals?; effort score: how much did users have to work with the AI?; trust score: do users trust the AI appropriately?; adoption rate: are users engaging with AI features?), customer journey analytics for AI experience visibility, qualitative research at scale (AI-powered synthesis of customer feedback, automated theme extraction), and the continuous improvement loop.",
      "lessons": [
        {
          "title": "Foundations: Measuring AI Experience — Metrics, Research, and Continuous Improvement",
          "desc": "AI experience measurement beyond NPS (experience quality index: composite of multiple signals; AI task success rate: did the AI help users accomplish their goals?; effort score: how much did users have to work with the AI?; trust score: do users trust the AI appropriately?; adoption rate: are users engaging with AI features?), customer journey analytics for AI experience visibility, qualitative research at scale (AI-powered synthesis of customer feedback, automated theme extraction), and the continuous improvement loop."
        },
        {
          "title": "Module 7.2 Deep Dive: customer journey analytics for AI experience visibility",
          "desc": "AI experience measurement beyond NPS (experience quality index: composite of multiple signals; AI task success rate: did the AI help users accomplish their goals?; effort score: how much did users hav. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: qualitative research at scale (AI-powered synthesis of customer feedback",
          "desc": "AI experience measurement beyond NPS (experience quality index: composite of multiple signals; AI task success rate: did the AI help users accomplish their goals?; effort score: how much did users hav. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: automated theme extraction)",
          "desc": "AI experience measurement beyond NPS (experience quality index: composite of multiple signals; AI task success rate: did the AI help users accomplish their goals?; effort score: how much did users hav. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: and the continuous improvement loop.",
          "desc": "AI experience measurement beyond NPS (experience quality index: composite of multiple signals; AI task success rate: did the AI help users accomplish their goals?; effort score: how much did users hav. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: AI experience measurement beyond NPS (experience quality ind",
          "desc": "AI experience measurement beyond NPS (experience quality index: composite of multiple signals; AI task success rate: did the AI help users accomplish their goals?; effort score: how much did users hav. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Measuring AI Experience — Metrics, Research, and Continuous Improvement. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI experience measurement beyond NPS (experience quality index: composite of multiple signals; AI task success rate: did the AI help users accomplish "
        }
      ]
    },
    {
      "title": "Module 8: Inclusive and Accessible AI Experience Design",
      "desc": "Designing AI experiences for the full spectrum of human diversity (visual impairment: AI interfaces must be screen-reader compatible; hearing impairment: AI voice features must have text equivalents; motor impairment: AI interactions must be keyboard and switch-accessible; cognitive diversity: AI interfaces must support varying comprehension levels), cultural adaptation for global AI products (localization beyond translation — adapting AI personality, interaction style, and trust signals for different cultures), and the inclusive design audit process.",
      "lessons": [
        {
          "title": "Foundations: Inclusive and Accessible AI Experience Design",
          "desc": "Designing AI experiences for the full spectrum of human diversity (visual impairment: AI interfaces must be screen-reader compatible; hearing impairment: AI voice features must have text equivalents; motor impairment: AI interactions must be keyboard and switch-accessible; cognitive diversity: AI interfaces must support varying comprehension levels), cultural adaptation for global AI products (localization beyond translation — adapting AI personality, interaction style, and trust signals for different cultures), and the inclusive design audit process."
        },
        {
          "title": "Module 8.2 Deep Dive: cultural adaptation for global AI products (localization beyond translation — adapting AI personality",
          "desc": "Designing AI experiences for the full spectrum of human diversity (visual impairment: AI interfaces must be screen-reader compatible; hearing impairment: AI voice features must have text equivalents; . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: interaction style",
          "desc": "Designing AI experiences for the full spectrum of human diversity (visual impairment: AI interfaces must be screen-reader compatible; hearing impairment: AI voice features must have text equivalents; . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: and trust signals for different cultures)",
          "desc": "Designing AI experiences for the full spectrum of human diversity (visual impairment: AI interfaces must be screen-reader compatible; hearing impairment: AI voice features must have text equivalents; . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: and the inclusive design audit process.",
          "desc": "Designing AI experiences for the full spectrum of human diversity (visual impairment: AI interfaces must be screen-reader compatible; hearing impairment: AI voice features must have text equivalents; . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: Designing AI experiences for the full spectrum of human dive",
          "desc": "Designing AI experiences for the full spectrum of human diversity (visual impairment: AI interfaces must be screen-reader compatible; hearing impairment: AI voice features must have text equivalents; . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Inclusive and Accessible AI Experience Design. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Designing AI experiences for the full spectrum of human diversity (visual impairment: AI interfaces must be screen-reader compatible; hearing impairme"
        }
      ]
    },
    {
      "title": "Module 9: Emerging AI Experience Paradigms — Spatial, Ambient, and Embodied AI",
      "desc": "Spatial computing AI experience (Apple Vision Pro and the challenges of designing AI in 3D space, hand gesture + eye gaze + voice for AI interaction, AI-enhanced AR overlays in physical environments), ambient AI experiences (AI that operates continuously in the background, surfacing insights without explicit invocation), embodied AI experiences (robots, smart home devices, autonomous vehicles — AI embedded in physical form), and the proactive AI experience (AI that anticipates needs and acts without being asked — the most powerful and most dangerous AI experience paradigm).",
      "lessons": [
        {
          "title": "Foundations: Emerging AI Experience Paradigms — Spatial, Ambient, and Embodied AI",
          "desc": "Spatial computing AI experience (Apple Vision Pro and the challenges of designing AI in 3D space, hand gesture + eye gaze + voice for AI interaction, AI-enhanced AR overlays in physical environments), ambient AI experiences (AI that operates continuously in the background, surfacing insights without explicit invocation), embodied AI experiences (robots, smart home devices, autonomous vehicles — AI embedded in physical form), and the proactive AI experience (AI that anticipates needs and acts without being asked — the most powerful and most dangerous AI experience paradigm)."
        },
        {
          "title": "Module 9.2 Deep Dive: hand gesture + eye gaze + voice for AI interaction",
          "desc": "Spatial computing AI experience (Apple Vision Pro and the challenges of designing AI in 3D space, hand gesture + eye gaze + voice for AI interaction, AI-enhanced AR overlays in physical environments),. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: AI-enhanced AR overlays in physical environments)",
          "desc": "Spatial computing AI experience (Apple Vision Pro and the challenges of designing AI in 3D space, hand gesture + eye gaze + voice for AI interaction, AI-enhanced AR overlays in physical environments),. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: ambient AI experiences (AI that operates continuously in the background",
          "desc": "Spatial computing AI experience (Apple Vision Pro and the challenges of designing AI in 3D space, hand gesture + eye gaze + voice for AI interaction, AI-enhanced AR overlays in physical environments),. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: surfacing insights without explicit invocation)",
          "desc": "Spatial computing AI experience (Apple Vision Pro and the challenges of designing AI in 3D space, hand gesture + eye gaze + voice for AI interaction, AI-enhanced AR overlays in physical environments),. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: embodied AI experiences (robots",
          "desc": "Spatial computing AI experience (Apple Vision Pro and the challenges of designing AI in 3D space, hand gesture + eye gaze + voice for AI interaction, AI-enhanced AR overlays in physical environments),. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Emerging AI Experience Paradigms — Spatial, Ambient, and Embodied AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Spatial computing AI experience (Apple Vision Pro and the challenges of designing AI in 3D space, hand gesture + eye gaze + voice for AI interaction, "
        }
      ]
    },
    {
      "title": "Module 10: AI Experience Leadership and Capstone",
      "desc": "Building the AI experience architecture practice (cross-functional team building: connecting UX, design systems, data science, engineering, and business; the experience council model), the experience architect career path ($140K-$260K range), cross-functional leadership without direct authority, and the capstone: design a complete AI experience architecture for a specified brand — experience vision statement, journey maps for 3 key journeys, touchpoint design specifications for 5 AI moments, governance framework, personalization strategy, measurement program, and 3-year experience roadmap with implementation priorities.",
      "lessons": [
        {
          "title": "Foundations: AI Experience Leadership and Capstone",
          "desc": "Building the AI experience architecture practice (cross-functional team building: connecting UX, design systems, data science, engineering, and business; the experience council model), the experience architect career path ($140K-$260K range), cross-functional leadership without direct authority, and the capstone: design a complete AI experience architecture for a specified brand — experience vision statement, journey maps for 3 key journeys, touchpoint design specifications for 5 AI moments, governance framework, personalization strategy, measurement program, and 3-year experience roadmap with implementation priorities."
        },
        {
          "title": "Module 10.2 Deep Dive: design systems",
          "desc": "Building the AI experience architecture practice (cross-functional team building: connecting UX, design systems, data science, engineering, and business; the experience council model), the experience . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: data science",
          "desc": "Building the AI experience architecture practice (cross-functional team building: connecting UX, design systems, data science, engineering, and business; the experience council model), the experience . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: engineering",
          "desc": "Building the AI experience architecture practice (cross-functional team building: connecting UX, design systems, data science, engineering, and business; the experience council model), the experience . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: and business; the experience council model)",
          "desc": "Building the AI experience architecture practice (cross-functional team building: connecting UX, design systems, data science, engineering, and business; the experience council model), the experience . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: the experience architect career path ($140K-$260K range)",
          "desc": "Building the AI experience architecture practice (cross-functional team building: connecting UX, design systems, data science, engineering, and business; the experience council model), the experience . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: AI Experience Leadership and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Building the AI experience architecture practice (cross-functional team building: connecting UX, design systems, data science, engineering, and busine"
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
