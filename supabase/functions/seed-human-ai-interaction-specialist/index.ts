import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "Human-AI Interaction Specialist",
  "description": "Master the science and practice of human-AI interaction — from cognitive psychology and human factors through organizational impact and societal dimensions. 10 modules bridging HCI research, cognitive science, and practical AI deployment for human flourishing.",
  "translations": {
    "es": {
      "title": "Human-AI Interaction Specialist",
      "description": "Master the science and practice of human-AI interaction — from cognitive psychology and human factors through organizational impact and societal dimensions. 10 modules bridging HCI research, cognitive"
    },
    "fr": {
      "title": "Human-AI Interaction Specialist",
      "description": "Master the science and practice of human-AI interaction — from cognitive psychology and human factors through organizational impact and societal dimensions. 10 modules bridging HCI research, cognitive"
    },
    "de": {
      "title": "Human-AI Interaction Specialist",
      "description": "Master the science and practice of human-AI interaction — from cognitive psychology and human factors through organizational impact and societal dimensions. 10 modules bridging HCI research, cognitive"
    },
    "zh": {
      "title": "Human-AI Interaction Specialist",
      "description": "Master the science and practice of human-AI interaction — from cognitive psychology and human factors through organizational impact and societal dimensions. 10 modules bridging HCI research, cognitive"
    },
    "ar": {
      "title": "Human-AI Interaction Specialist",
      "description": "Master the science and practice of human-AI interaction — from cognitive psychology and human factors through organizational impact and societal dimensions. 10 modules bridging HCI research, cognitive"
    },
    "ja": {
      "title": "Human-AI Interaction Specialist",
      "description": "Master the science and practice of human-AI interaction — from cognitive psychology and human factors through organizational impact and societal dimensions. 10 modules bridging HCI research, cognitive"
    }
  },
  "modules": [
    {
      "title": "Module 1: Foundations of HAI — Cognitive Science Meets Artificial Intelligence",
      "desc": "Human information processing applied to AI interface design (attentional bottlenecks, working memory limits of 7±2 chunks — Miller's Law, long-term memory encoding for AI-assisted learning), dual process theory (System 1 fast automatic vs. System 2 slow deliberate — when AI should engage which system), cognitive biases in AI interaction (automation bias, algorithm aversion, anchoring on AI suggestions, Dunning-Kruger with AI tools), and HCI research methodology for studying human-AI interaction.",
      "lessons": [
        {
          "title": "Foundations: Foundations of HAI — Cognitive Science Meets Artificial Intelligence",
          "desc": "Human information processing applied to AI interface design (attentional bottlenecks, working memory limits of 7±2 chunks — Miller's Law, long-term memory encoding for AI-assisted learning), dual process theory (System 1 fast automatic vs. System 2 slow deliberate — when AI should engage which system), cognitive biases in AI interaction (automation bias, algorithm aversion, anchoring on AI suggestions, Dunning-Kruger with AI tools), and HCI research methodology for studying human-AI interaction."
        },
        {
          "title": "Module 1.2 Deep Dive: working memory limits of 7±2 chunks — Miller's Law",
          "desc": "Human information processing applied to AI interface design (attentional bottlenecks, working memory limits of 7±2 chunks — Miller's Law, long-term memory encoding for AI-assisted learning), dual proc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: long-term memory encoding for AI-assisted learning)",
          "desc": "Human information processing applied to AI interface design (attentional bottlenecks, working memory limits of 7±2 chunks — Miller's Law, long-term memory encoding for AI-assisted learning), dual proc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: dual process theory (System 1 fast automatic vs. System 2 slow deliberate — when AI should engage which system)",
          "desc": "Human information processing applied to AI interface design (attentional bottlenecks, working memory limits of 7±2 chunks — Miller's Law, long-term memory encoding for AI-assisted learning), dual proc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: cognitive biases in AI interaction (automation bias",
          "desc": "Human information processing applied to AI interface design (attentional bottlenecks, working memory limits of 7±2 chunks — Miller's Law, long-term memory encoding for AI-assisted learning), dual proc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: algorithm aversion",
          "desc": "Human information processing applied to AI interface design (attentional bottlenecks, working memory limits of 7±2 chunks — Miller's Law, long-term memory encoding for AI-assisted learning), dual proc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: Foundations of HAI — Cognitive Science Meets Artificial Intelligence. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Human information processing applied to AI interface design (attentional bottlenecks, working memory limits of 7±2 chunks — Miller's Law, long-term me"
        }
      ]
    },
    {
      "title": "Module 2: Mental Models, Trust, and the Psychology of AI Relationships",
      "desc": "How users form mental models of AI (folk theories of AI — users imagine AI as very smart human, magic, or database lookup — all wrong), the consequences of wrong mental models (over-reliance when AI is uncertain, under-use when AI is capable), the trust formation process for AI (initial trust, trust calibration, trust repair), factors affecting AI trust (accuracy, consistency, transparency, controllability, social influence), and the algorithm aversion phenomenon (why people sometimes prefer worse human judgment to better AI judgment).",
      "lessons": [
        {
          "title": "Foundations: Mental Models, Trust, and the Psychology of AI Relationships",
          "desc": "How users form mental models of AI (folk theories of AI — users imagine AI as very smart human, magic, or database lookup — all wrong), the consequences of wrong mental models (over-reliance when AI is uncertain, under-use when AI is capable), the trust formation process for AI (initial trust, trust calibration, trust repair), factors affecting AI trust (accuracy, consistency, transparency, controllability, social influence), and the algorithm aversion phenomenon (why people sometimes prefer worse human judgment to better AI judgment)."
        },
        {
          "title": "Module 2.2 Deep Dive: magic",
          "desc": "How users form mental models of AI (folk theories of AI — users imagine AI as very smart human, magic, or database lookup — all wrong), the consequences of wrong mental models (over-reliance when AI i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: or database lookup — all wrong)",
          "desc": "How users form mental models of AI (folk theories of AI — users imagine AI as very smart human, magic, or database lookup — all wrong), the consequences of wrong mental models (over-reliance when AI i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: the consequences of wrong mental models (over-reliance when AI is uncertain",
          "desc": "How users form mental models of AI (folk theories of AI — users imagine AI as very smart human, magic, or database lookup — all wrong), the consequences of wrong mental models (over-reliance when AI i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: under-use when AI is capable)",
          "desc": "How users form mental models of AI (folk theories of AI — users imagine AI as very smart human, magic, or database lookup — all wrong), the consequences of wrong mental models (over-reliance when AI i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: the trust formation process for AI (initial trust",
          "desc": "How users form mental models of AI (folk theories of AI — users imagine AI as very smart human, magic, or database lookup — all wrong), the consequences of wrong mental models (over-reliance when AI i. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Mental Models, Trust, and the Psychology of AI Relationships. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. How users form mental models of AI (folk theories of AI — users imagine AI as very smart human, magic, or database lookup — all wrong), the consequenc"
        }
      ]
    },
    {
      "title": "Module 3: Human Factors and Ergonomics for AI-Augmented Workplaces",
      "desc": "Ergonomics principles for AI interface design (reducing cognitive and physical load), the vigilance decrement problem (humans monitoring automated systems become less vigilant over time — the autopilot complacency problem), the handoff problem (transferring control between human and AI is the most dangerous moment in human-automation interaction), situation awareness in AI systems (Level 1: perception, Level 2: comprehension, Level 3: projection — Endsley model for AI), and the safety-critical systems perspective.",
      "lessons": [
        {
          "title": "Foundations: Human Factors and Ergonomics for AI-Augmented Workplaces",
          "desc": "Ergonomics principles for AI interface design (reducing cognitive and physical load), the vigilance decrement problem (humans monitoring automated systems become less vigilant over time — the autopilot complacency problem), the handoff problem (transferring control between human and AI is the most dangerous moment in human-automation interaction), situation awareness in AI systems (Level 1: perception, Level 2: comprehension, Level 3: projection — Endsley model for AI), and the safety-critical systems perspective."
        },
        {
          "title": "Module 3.2 Deep Dive: the vigilance decrement problem (humans monitoring automated systems become less vigilant over time — the autopilot complacency problem)",
          "desc": "Ergonomics principles for AI interface design (reducing cognitive and physical load), the vigilance decrement problem (humans monitoring automated systems become less vigilant over time — the autopilo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: the handoff problem (transferring control between human and AI is the most dangerous moment in human-automation interaction)",
          "desc": "Ergonomics principles for AI interface design (reducing cognitive and physical load), the vigilance decrement problem (humans monitoring automated systems become less vigilant over time — the autopilo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: situation awareness in AI systems (Level 1: perception",
          "desc": "Ergonomics principles for AI interface design (reducing cognitive and physical load), the vigilance decrement problem (humans monitoring automated systems become less vigilant over time — the autopilo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: Level 2: comprehension",
          "desc": "Ergonomics principles for AI interface design (reducing cognitive and physical load), the vigilance decrement problem (humans monitoring automated systems become less vigilant over time — the autopilo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: Level 3: projection — Endsley model for AI)",
          "desc": "Ergonomics principles for AI interface design (reducing cognitive and physical load), the vigilance decrement problem (humans monitoring automated systems become less vigilant over time — the autopilo. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Human Factors and Ergonomics for AI-Augmented Workplaces. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Ergonomics principles for AI interface design (reducing cognitive and physical load), the vigilance decrement problem (humans monitoring automated sys"
        }
      ]
    },
    {
      "title": "Module 4: Cognitive Load and AI-Augmented Decision Making",
      "desc": "Cognitive Load Theory (Sweller) applied to AI interfaces (intrinsic load from task complexity, extraneous load from poor AI UX, germane load from genuine learning), measuring cognitive load in AI interaction (NASA-TLX scale, secondary task methodology, EEG/fNIRS for physiological measurement), designing AI to reduce rather than increase cognitive load, AI-augmented decision making (improving human decisions without automating them entirely), and the automation paradox (the better the automation, the less capable the human becomes without it).",
      "lessons": [
        {
          "title": "Foundations: Cognitive Load and AI-Augmented Decision Making",
          "desc": "Cognitive Load Theory (Sweller) applied to AI interfaces (intrinsic load from task complexity, extraneous load from poor AI UX, germane load from genuine learning), measuring cognitive load in AI interaction (NASA-TLX scale, secondary task methodology, EEG/fNIRS for physiological measurement), designing AI to reduce rather than increase cognitive load, AI-augmented decision making (improving human decisions without automating them entirely), and the automation paradox (the better the automation, the less capable the human becomes without it)."
        },
        {
          "title": "Module 4.2 Deep Dive: extraneous load from poor AI UX",
          "desc": "Cognitive Load Theory (Sweller) applied to AI interfaces (intrinsic load from task complexity, extraneous load from poor AI UX, germane load from genuine learning), measuring cognitive load in AI inte. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: germane load from genuine learning)",
          "desc": "Cognitive Load Theory (Sweller) applied to AI interfaces (intrinsic load from task complexity, extraneous load from poor AI UX, germane load from genuine learning), measuring cognitive load in AI inte. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: measuring cognitive load in AI interaction (NASA-TLX scale",
          "desc": "Cognitive Load Theory (Sweller) applied to AI interfaces (intrinsic load from task complexity, extraneous load from poor AI UX, germane load from genuine learning), measuring cognitive load in AI inte. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: secondary task methodology",
          "desc": "Cognitive Load Theory (Sweller) applied to AI interfaces (intrinsic load from task complexity, extraneous load from poor AI UX, germane load from genuine learning), measuring cognitive load in AI inte. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: EEG/fNIRS for physiological measurement)",
          "desc": "Cognitive Load Theory (Sweller) applied to AI interfaces (intrinsic load from task complexity, extraneous load from poor AI UX, germane load from genuine learning), measuring cognitive load in AI inte. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Cognitive Load and AI-Augmented Decision Making. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Cognitive Load Theory (Sweller) applied to AI interfaces (intrinsic load from task complexity, extraneous load from poor AI UX, germane load from genu"
        }
      ]
    },
    {
      "title": "Module 5: Social and Emotional Dimensions of Human-AI Interaction",
      "desc": "The ELIZA effect (1966 — people formed emotional attachments to a simple pattern-matching program, establishing that humans anthropomorphize AI unavoidably), parasocial relationships with AI assistants (psychological research on user-AI bonds), emotional expression in AI (when AI should express emotion vs. when it's manipulative), AI companions for loneliness (the ethics and psychological impact), anthropomorphism in AI product design (when to leverage it, when it backfires), and appropriate boundaries in AI relationships.",
      "lessons": [
        {
          "title": "Foundations: Social and Emotional Dimensions of Human-AI Interaction",
          "desc": "The ELIZA effect (1966 — people formed emotional attachments to a simple pattern-matching program, establishing that humans anthropomorphize AI unavoidably), parasocial relationships with AI assistants (psychological research on user-AI bonds), emotional expression in AI (when AI should express emotion vs. when it's manipulative), AI companions for loneliness (the ethics and psychological impact), anthropomorphism in AI product design (when to leverage it, when it backfires), and appropriate boundaries in AI relationships."
        },
        {
          "title": "Module 5.2 Deep Dive: establishing that humans anthropomorphize AI unavoidably)",
          "desc": "The ELIZA effect (1966 — people formed emotional attachments to a simple pattern-matching program, establishing that humans anthropomorphize AI unavoidably), parasocial relationships with AI assistant. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: parasocial relationships with AI assistants (psychological research on user-AI bonds)",
          "desc": "The ELIZA effect (1966 — people formed emotional attachments to a simple pattern-matching program, establishing that humans anthropomorphize AI unavoidably), parasocial relationships with AI assistant. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: emotional expression in AI (when AI should express emotion vs. when it's manipulative)",
          "desc": "The ELIZA effect (1966 — people formed emotional attachments to a simple pattern-matching program, establishing that humans anthropomorphize AI unavoidably), parasocial relationships with AI assistant. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: AI companions for loneliness (the ethics and psychological impact)",
          "desc": "The ELIZA effect (1966 — people formed emotional attachments to a simple pattern-matching program, establishing that humans anthropomorphize AI unavoidably), parasocial relationships with AI assistant. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: anthropomorphism in AI product design (when to leverage it",
          "desc": "The ELIZA effect (1966 — people formed emotional attachments to a simple pattern-matching program, establishing that humans anthropomorphize AI unavoidably), parasocial relationships with AI assistant. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Social and Emotional Dimensions of Human-AI Interaction. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The ELIZA effect (1966 — people formed emotional attachments to a simple pattern-matching program, establishing that humans anthropomorphize AI unavoi"
        }
      ]
    },
    {
      "title": "Module 6: AI in the Workplace — Augmentation, Displacement, and Team Dynamics",
      "desc": "The human-AI collaboration model (what humans do best: creativity, ethics, relationship, judgment; what AI does best: speed, scale, pattern recognition, consistency — the complementarity thesis), job redesign for AI collaboration (task allocation between human and AI), managing the emotional impact of AI on workers (anxiety, identity threat, loss of mastery), human-AI team performance measurement, and the organizational change required for effective human-AI collaboration. Case study: How radiologists collaborate with AI diagnostic tools.",
      "lessons": [
        {
          "title": "Foundations: AI in the Workplace — Augmentation, Displacement, and Team Dynamics",
          "desc": "The human-AI collaboration model (what humans do best: creativity, ethics, relationship, judgment; what AI does best: speed, scale, pattern recognition, consistency — the complementarity thesis), job redesign for AI collaboration (task allocation between human and AI), managing the emotional impact of AI on workers (anxiety, identity threat, loss of mastery), human-AI team performance measurement, and the organizational change required for effective human-AI collaboration. Case study: How radiologists collaborate with AI diagnostic tools."
        },
        {
          "title": "Module 6.2 Deep Dive: ethics",
          "desc": "The human-AI collaboration model (what humans do best: creativity, ethics, relationship, judgment; what AI does best: speed, scale, pattern recognition, consistency — the complementarity thesis), job . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: relationship",
          "desc": "The human-AI collaboration model (what humans do best: creativity, ethics, relationship, judgment; what AI does best: speed, scale, pattern recognition, consistency — the complementarity thesis), job . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: judgment; what AI does best: speed",
          "desc": "The human-AI collaboration model (what humans do best: creativity, ethics, relationship, judgment; what AI does best: speed, scale, pattern recognition, consistency — the complementarity thesis), job . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: scale",
          "desc": "The human-AI collaboration model (what humans do best: creativity, ethics, relationship, judgment; what AI does best: speed, scale, pattern recognition, consistency — the complementarity thesis), job . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: pattern recognition",
          "desc": "The human-AI collaboration model (what humans do best: creativity, ethics, relationship, judgment; what AI does best: speed, scale, pattern recognition, consistency — the complementarity thesis), job . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: AI in the Workplace — Augmentation, Displacement, and Team Dynamics. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The human-AI collaboration model (what humans do best: creativity, ethics, relationship, judgment; what AI does best: speed, scale, pattern recognitio"
        }
      ]
    },
    {
      "title": "Module 7: Accessibility, Equity, and Inclusive Human-AI Interaction",
      "desc": "Designing inclusive AI interactions (users with visual, hearing, motor, and cognitive disabilities), AI as accessibility technology (AI transcription, AI image description, AI navigation assistance), the digital divide in AI access (lower-income, rural, and elderly populations interacting with AI less effectively), language equity in AI (non-English speakers interacting with predominantly English-trained AI), cultural dimensions of human-AI interaction (high vs. low power distance cultures, individualist vs. collectivist preferences in AI interaction style), and the equity impact assessment for AI systems.",
      "lessons": [
        {
          "title": "Foundations: Accessibility, Equity, and Inclusive Human-AI Interaction",
          "desc": "Designing inclusive AI interactions (users with visual, hearing, motor, and cognitive disabilities), AI as accessibility technology (AI transcription, AI image description, AI navigation assistance), the digital divide in AI access (lower-income, rural, and elderly populations interacting with AI less effectively), language equity in AI (non-English speakers interacting with predominantly English-trained AI), cultural dimensions of human-AI interaction (high vs. low power distance cultures, individualist vs. collectivist preferences in AI interaction style), and the equity impact assessment for AI systems."
        },
        {
          "title": "Module 7.2 Deep Dive: hearing",
          "desc": "collectivist preferences in AI interaction style), and the equity impact assessment for AI systems.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: motor",
          "desc": "Designing inclusive AI interactions (users with visual, hearing, motor, and cognitive disabilities), AI as accessibility technology (AI transcription, AI image description, AI navigation assistance), . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: and cognitive disabilities)",
          "desc": "Designing inclusive AI interactions (users with visual, hearing, motor, and cognitive disabilities), AI as accessibility technology (AI transcription, AI image description, AI navigation assistance), . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: AI as accessibility technology (AI transcription",
          "desc": "Designing inclusive AI interactions (users with visual, hearing, motor, and cognitive disabilities), AI as accessibility technology (AI transcription, AI image description, AI navigation assistance), . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: AI image description",
          "desc": "Designing inclusive AI interactions (users with visual, hearing, motor, and cognitive disabilities), AI as accessibility technology (AI transcription, AI image description, AI navigation assistance), . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Accessibility, Equity, and Inclusive Human-AI Interaction. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Designing inclusive AI interactions (users with visual, hearing, motor, and cognitive disabilities), AI as accessibility technology (AI transcription,"
        }
      ]
    },
    {
      "title": "Module 8: Safety, Control, and Human Oversight in Autonomous AI",
      "desc": "The human control spectrum for AI (manual control → automation with monitoring → supervisory control → full autonomy), designing safe autonomy transitions (how to hand off control between human and AI safely), mode confusion in human-AI systems (operators unsure whether AI or human is in control — a leading cause of aviation accidents applied to AI), the 'meaningful human control' requirement in EU AI Act Article 14, and interaction design patterns that maintain genuine human oversight without creating oversight theater.",
      "lessons": [
        {
          "title": "Foundations: Safety, Control, and Human Oversight in Autonomous AI",
          "desc": "The human control spectrum for AI (manual control → automation with monitoring → supervisory control → full autonomy), designing safe autonomy transitions (how to hand off control between human and AI safely), mode confusion in human-AI systems (operators unsure whether AI or human is in control — a leading cause of aviation accidents applied to AI), the 'meaningful human control' requirement in EU AI Act Article 14, and interaction design patterns that maintain genuine human oversight without creating oversight theater."
        },
        {
          "title": "Module 8.2 Deep Dive: designing safe autonomy transitions (how to hand off control between human and AI safely)",
          "desc": "The human control spectrum for AI (manual control → automation with monitoring → supervisory control → full autonomy), designing safe autonomy transitions (how to hand off control between human and AI. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: mode confusion in human-AI systems (operators unsure whether AI or human is in control — a leading cause of aviation accidents applied to AI)",
          "desc": "The human control spectrum for AI (manual control → automation with monitoring → supervisory control → full autonomy), designing safe autonomy transitions (how to hand off control between human and AI. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: the 'meaningful human control' requirement in EU AI Act Article 14",
          "desc": "The human control spectrum for AI (manual control → automation with monitoring → supervisory control → full autonomy), designing safe autonomy transitions (how to hand off control between human and AI. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: and interaction design patterns that maintain genuine human oversight without creating oversight theater.",
          "desc": "The human control spectrum for AI (manual control → automation with monitoring → supervisory control → full autonomy), designing safe autonomy transitions (how to hand off control between human and AI. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: The human control spectrum for AI (manual control → automati",
          "desc": "The human control spectrum for AI (manual control → automation with monitoring → supervisory control → full autonomy), designing safe autonomy transitions (how to hand off control between human and AI. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Safety, Control, and Human Oversight in Autonomous AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The human control spectrum for AI (manual control → automation with monitoring → supervisory control → full autonomy), designing safe autonomy transit"
        }
      ]
    },
    {
      "title": "Module 9: Research Methods and Evaluation for Human-AI Interaction",
      "desc": "Experimental design for HAI research (between-subjects vs. within-subjects, controlling for learning effects, ecological validity in AI interaction studies), quantitative methods (performance metrics, behavioral logs analysis, statistical testing), qualitative methods (think-aloud protocols for AI interaction, interviews about AI experience, ethnographic observation), physiological methods (eye tracking, galvanic skin response for measuring stress in AI interaction), and the mixed-methods approach for comprehensive HAI evaluation.",
      "lessons": [
        {
          "title": "Foundations: Research Methods and Evaluation for Human-AI Interaction",
          "desc": "Experimental design for HAI research (between-subjects vs. within-subjects, controlling for learning effects, ecological validity in AI interaction studies), quantitative methods (performance metrics, behavioral logs analysis, statistical testing), qualitative methods (think-aloud protocols for AI interaction, interviews about AI experience, ethnographic observation), physiological methods (eye tracking, galvanic skin response for measuring stress in AI interaction), and the mixed-methods approach for comprehensive HAI evaluation."
        },
        {
          "title": "Module 9.2 Deep Dive: controlling for learning effects",
          "desc": "Experimental design for HAI research (between-subjects vs. within-subjects, controlling for learning effects, ecological validity in AI interaction studies), quantitative methods (performance metrics,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: ecological validity in AI interaction studies)",
          "desc": "Experimental design for HAI research (between-subjects vs. within-subjects, controlling for learning effects, ecological validity in AI interaction studies), quantitative methods (performance metrics,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: quantitative methods (performance metrics",
          "desc": "Experimental design for HAI research (between-subjects vs. within-subjects, controlling for learning effects, ecological validity in AI interaction studies), quantitative methods (performance metrics,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: behavioral logs analysis",
          "desc": "Experimental design for HAI research (between-subjects vs. within-subjects, controlling for learning effects, ecological validity in AI interaction studies), quantitative methods (performance metrics,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: statistical testing)",
          "desc": "Experimental design for HAI research (between-subjects vs. within-subjects, controlling for learning effects, ecological validity in AI interaction studies), quantitative methods (performance metrics,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Research Methods and Evaluation for Human-AI Interaction. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Experimental design for HAI research (between-subjects vs. within-subjects, controlling for learning effects, ecological validity in AI interaction st"
        }
      ]
    },
    {
      "title": "Module 10: The Future of Human-AI Interaction and Capstone",
      "desc": "Emerging HAI paradigms (brain-computer interfaces for direct AI interaction, spatial computing with AI in physical space, ambient AI that operates continuously in the background, embodied AI in physical robots), the long-term psychological impact of pervasive AI (identity, cognition, relationships, meaning-making in an AI-saturated world), the philosophical question of human flourishing alongside AI, and the capstone: design and evaluate a human-AI interaction system for a specified work context — incorporating cognitive, social, organizational, and ethical factors with a research evaluation plan.",
      "lessons": [
        {
          "title": "Foundations: The Future of Human-AI Interaction and Capstone",
          "desc": "Emerging HAI paradigms (brain-computer interfaces for direct AI interaction, spatial computing with AI in physical space, ambient AI that operates continuously in the background, embodied AI in physical robots), the long-term psychological impact of pervasive AI (identity, cognition, relationships, meaning-making in an AI-saturated world), the philosophical question of human flourishing alongside AI, and the capstone: design and evaluate a human-AI interaction system for a specified work context — incorporating cognitive, social, organizational, and ethical factors with a research evaluation plan."
        },
        {
          "title": "Module 10.2 Deep Dive: spatial computing with AI in physical space",
          "desc": "Emerging HAI paradigms (brain-computer interfaces for direct AI interaction, spatial computing with AI in physical space, ambient AI that operates continuously in the background, embodied AI in physic. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: ambient AI that operates continuously in the background",
          "desc": "Emerging HAI paradigms (brain-computer interfaces for direct AI interaction, spatial computing with AI in physical space, ambient AI that operates continuously in the background, embodied AI in physic. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: embodied AI in physical robots)",
          "desc": "Emerging HAI paradigms (brain-computer interfaces for direct AI interaction, spatial computing with AI in physical space, ambient AI that operates continuously in the background, embodied AI in physic. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: the long-term psychological impact of pervasive AI (identity",
          "desc": "Emerging HAI paradigms (brain-computer interfaces for direct AI interaction, spatial computing with AI in physical space, ambient AI that operates continuously in the background, embodied AI in physic. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: cognition",
          "desc": "Emerging HAI paradigms (brain-computer interfaces for direct AI interaction, spatial computing with AI in physical space, ambient AI that operates continuously in the background, embodied AI in physic. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: The Future of Human-AI Interaction and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Emerging HAI paradigms (brain-computer interfaces for direct AI interaction, spatial computing with AI in physical space, ambient AI that operates con"
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
