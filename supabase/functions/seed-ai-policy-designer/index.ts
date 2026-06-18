import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/auth.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Policy Designer",
  "description": "Design the policies, standards, and guidelines that govern AI development and deployment at organizational and societal levels. 10 modules covering policy design methodology, regulatory analysis, corporate AI policy, public policy engagement, and international AI governance.",
  "translations": {
    "es": {
      "title": "AI Policy Designer",
      "description": "Design the policies, standards, and guidelines that govern AI development and deployment at organizational and societal levels. 10 modules covering policy design methodology, regulatory analysis, corp"
    },
    "fr": {
      "title": "AI Policy Designer",
      "description": "Design the policies, standards, and guidelines that govern AI development and deployment at organizational and societal levels. 10 modules covering policy design methodology, regulatory analysis, corp"
    },
    "de": {
      "title": "AI Policy Designer",
      "description": "Design the policies, standards, and guidelines that govern AI development and deployment at organizational and societal levels. 10 modules covering policy design methodology, regulatory analysis, corp"
    },
    "zh": {
      "title": "AI Policy Designer",
      "description": "Design the policies, standards, and guidelines that govern AI development and deployment at organizational and societal levels. 10 modules covering policy design methodology, regulatory analysis, corp"
    },
    "ar": {
      "title": "AI Policy Designer",
      "description": "Design the policies, standards, and guidelines that govern AI development and deployment at organizational and societal levels. 10 modules covering policy design methodology, regulatory analysis, corp"
    },
    "ja": {
      "title": "AI Policy Designer",
      "description": "Design the policies, standards, and guidelines that govern AI development and deployment at organizational and societal levels. 10 modules covering policy design methodology, regulatory analysis, corp"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Policy Fundamentals — Why Policy Matters and How It Works",
      "desc": "The AI policy ecosystem (international → national → sectoral → organizational), how AI policy shapes AI development trajectories (the Brussels Effect — how EU AI regulation becomes global standard), policy analysis methodology (problem framing, option generation, option analysis, recommendation, implementation, evaluation), the policy design process lifecycle, and the AI policy professional's role and career. Case study: 5 years of EU AI Act legislative history.",
      "lessons": [
        {
          "title": "Foundations: AI Policy Fundamentals — Why Policy Matters and How It Works",
          "desc": "The AI policy ecosystem (international → national → sectoral → organizational), how AI policy shapes AI development trajectories (the Brussels Effect — how EU AI regulation becomes global standard), policy analysis methodology (problem framing, option generation, option analysis, recommendation, implementation, evaluation), the policy design process lifecycle, and the AI policy professional's role and career. Case study: 5 years of EU AI Act legislative history."
        },
        {
          "title": "Module 1.2 Deep Dive: how AI policy shapes AI development trajectories (the Brussels Effect — how EU AI regulation becomes global standard)",
          "desc": "The AI policy ecosystem (international → national → sectoral → organizational), how AI policy shapes AI development trajectories (the Brussels Effect — how EU AI regulation becomes global standard), p. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: policy analysis methodology (problem framing",
          "desc": "The AI policy ecosystem (international → national → sectoral → organizational), how AI policy shapes AI development trajectories (the Brussels Effect — how EU AI regulation becomes global standard), p. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: option generation",
          "desc": "The AI policy ecosystem (international → national → sectoral → organizational), how AI policy shapes AI development trajectories (the Brussels Effect — how EU AI regulation becomes global standard), p. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: option analysis",
          "desc": "The AI policy ecosystem (international → national → sectoral → organizational), how AI policy shapes AI development trajectories (the Brussels Effect — how EU AI regulation becomes global standard), p. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: recommendation",
          "desc": "The AI policy ecosystem (international → national → sectoral → organizational), how AI policy shapes AI development trajectories (the Brussels Effect — how EU AI regulation becomes global standard), p. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Policy Fundamentals — Why Policy Matters and How It Works. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI policy ecosystem (international → national → sectoral → organizational), how AI policy shapes AI development trajectories (the Brussels Effect "
        }
      ]
    },
    {
      "title": "Module 2: Regulatory Analysis — Reading, Interpreting, and Applying AI Regulations",
      "desc": "Legal research methodology for AI policy (primary sources: legislation, regulation, guidance; secondary sources: commentary, enforcement actions, court decisions), regulatory interpretation techniques (plain meaning, legislative intent, regulatory history), gap analysis methodology (where existing regulations are silent on AI), mapping regulations to specific AI use cases, and the compliance analysis workflow. Hands-on: Analyze EU AI Act application to a specific AI system.",
      "lessons": [
        {
          "title": "Foundations: Regulatory Analysis — Reading, Interpreting, and Applying AI Regulations",
          "desc": "Legal research methodology for AI policy (primary sources: legislation, regulation, guidance; secondary sources: commentary, enforcement actions, court decisions), regulatory interpretation techniques (plain meaning, legislative intent, regulatory history), gap analysis methodology (where existing regulations are silent on AI), mapping regulations to specific AI use cases, and the compliance analysis workflow. Hands-on: Analyze EU AI Act application to a specific AI system."
        },
        {
          "title": "Module 2.2 Deep Dive: regulation",
          "desc": "Legal research methodology for AI policy (primary sources: legislation, regulation, guidance; secondary sources: commentary, enforcement actions, court decisions), regulatory interpretation techniques. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: guidance; secondary sources: commentary",
          "desc": "Legal research methodology for AI policy (primary sources: legislation, regulation, guidance; secondary sources: commentary, enforcement actions, court decisions), regulatory interpretation techniques. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: enforcement actions",
          "desc": "Legal research methodology for AI policy (primary sources: legislation, regulation, guidance; secondary sources: commentary, enforcement actions, court decisions), regulatory interpretation techniques. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: court decisions)",
          "desc": "Legal research methodology for AI policy (primary sources: legislation, regulation, guidance; secondary sources: commentary, enforcement actions, court decisions), regulatory interpretation techniques. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: regulatory interpretation techniques (plain meaning",
          "desc": "Legal research methodology for AI policy (primary sources: legislation, regulation, guidance; secondary sources: commentary, enforcement actions, court decisions), regulatory interpretation techniques. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Regulatory Analysis — Reading, Interpreting, and Applying AI Regulations. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Legal research methodology for AI policy (primary sources: legislation, regulation, guidance; secondary sources: commentary, enforcement actions, cour"
        }
      ]
    },
    {
      "title": "Module 3: Corporate AI Policy Architecture — Principles, Policies, Standards, and Procedures",
      "desc": "Corporate AI policy hierarchy (AI principles → AI policy → AI standards → AI procedures → AI guidelines), writing AI acceptable use policies (permitted, restricted, and prohibited AI uses with clear examples), AI procurement policy (what vendors must satisfy), AI development standards (required documentation, testing, approval gates), the AI policy approval and maintenance process, and communicating AI policies to employees. Template: Complete corporate AI policy framework.",
      "lessons": [
        {
          "title": "Foundations: Corporate AI Policy Architecture — Principles, Policies, Standards, and Procedures",
          "desc": "Corporate AI policy hierarchy (AI principles → AI policy → AI standards → AI procedures → AI guidelines), writing AI acceptable use policies (permitted, restricted, and prohibited AI uses with clear examples), AI procurement policy (what vendors must satisfy), AI development standards (required documentation, testing, approval gates), the AI policy approval and maintenance process, and communicating AI policies to employees. Template: Complete corporate AI policy framework."
        },
        {
          "title": "Module 3.2 Deep Dive: writing AI acceptable use policies (permitted",
          "desc": "Corporate AI policy hierarchy (AI principles → AI policy → AI standards → AI procedures → AI guidelines), writing AI acceptable use policies (permitted, restricted, and prohibited AI uses with clear e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: restricted",
          "desc": "Corporate AI policy hierarchy (AI principles → AI policy → AI standards → AI procedures → AI guidelines), writing AI acceptable use policies (permitted, restricted, and prohibited AI uses with clear e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: and prohibited AI uses with clear examples)",
          "desc": "Corporate AI policy hierarchy (AI principles → AI policy → AI standards → AI procedures → AI guidelines), writing AI acceptable use policies (permitted, restricted, and prohibited AI uses with clear e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: AI procurement policy (what vendors must satisfy)",
          "desc": "Corporate AI policy hierarchy (AI principles → AI policy → AI standards → AI procedures → AI guidelines), writing AI acceptable use policies (permitted, restricted, and prohibited AI uses with clear e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: AI development standards (required documentation",
          "desc": "Corporate AI policy hierarchy (AI principles → AI policy → AI standards → AI procedures → AI guidelines), writing AI acceptable use policies (permitted, restricted, and prohibited AI uses with clear e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Corporate AI Policy Architecture — Principles, Policies, Standards, and Procedures. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Corporate AI policy hierarchy (AI principles → AI policy → AI standards → AI procedures → AI guidelines), writing AI acceptable use policies (permitte"
        }
      ]
    },
    {
      "title": "Module 4: AI Governance Policy — Roles, Decision Rights, and Accountability Structures",
      "desc": "Governance policy design (who decides what about AI — decision rights matrix), the AI governance policy framework (RACI model for AI decisions: who is Responsible, Accountable, Consulted, Informed), board-level AI governance policy (board oversight responsibilities for AI), executive AI accountability policy (Chief AI Officer mandate, executive AI performance objectives), whistleblower policy for AI (speaking up about AI harms), and anti-retaliation provisions.",
      "lessons": [
        {
          "title": "Foundations: AI Governance Policy — Roles, Decision Rights, and Accountability Structures",
          "desc": "Governance policy design (who decides what about AI — decision rights matrix), the AI governance policy framework (RACI model for AI decisions: who is Responsible, Accountable, Consulted, Informed), board-level AI governance policy (board oversight responsibilities for AI), executive AI accountability policy (Chief AI Officer mandate, executive AI performance objectives), whistleblower policy for AI (speaking up about AI harms), and anti-retaliation provisions."
        },
        {
          "title": "Module 4.2 Deep Dive: the AI governance policy framework (RACI model for AI decisions: who is Responsible",
          "desc": "Governance policy design (who decides what about AI — decision rights matrix), the AI governance policy framework (RACI model for AI decisions: who is Responsible, Accountable, Consulted, Informed), b. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: Accountable",
          "desc": "Governance policy design (who decides what about AI — decision rights matrix), the AI governance policy framework (RACI model for AI decisions: who is Responsible, Accountable, Consulted, Informed), b. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: Consulted",
          "desc": "Governance policy design (who decides what about AI — decision rights matrix), the AI governance policy framework (RACI model for AI decisions: who is Responsible, Accountable, Consulted, Informed), b. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: Informed)",
          "desc": "Governance policy design (who decides what about AI — decision rights matrix), the AI governance policy framework (RACI model for AI decisions: who is Responsible, Accountable, Consulted, Informed), b. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: board-level AI governance policy (board oversight responsibilities for AI)",
          "desc": "Governance policy design (who decides what about AI — decision rights matrix), the AI governance policy framework (RACI model for AI decisions: who is Responsible, Accountable, Consulted, Informed), b. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: AI Governance Policy — Roles, Decision Rights, and Accountability Structures. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Governance policy design (who decides what about AI — decision rights matrix), the AI governance policy framework (RACI model for AI decisions: who is"
        }
      ]
    },
    {
      "title": "Module 5: Data Policy for AI — Collection, Use, Retention, and the GDPR Intersection",
      "desc": "AI data policy architecture (data collection policy for AI training: lawful basis, purpose limitation, data minimization requirements; data use policy: what training data can be used for; retention schedule: how long training data is kept; deletion procedures: right to erasure implementation), consent policy for AI training data, data sharing policy for model improvement, synthetic data policy, and the GDPR-compliant AI data policy template.",
      "lessons": [
        {
          "title": "Foundations: Data Policy for AI — Collection, Use, Retention, and the GDPR Intersection",
          "desc": "AI data policy architecture (data collection policy for AI training: lawful basis, purpose limitation, data minimization requirements; data use policy: what training data can be used for; retention schedule: how long training data is kept; deletion procedures: right to erasure implementation), consent policy for AI training data, data sharing policy for model improvement, synthetic data policy, and the GDPR-compliant AI data policy template."
        },
        {
          "title": "Module 5.2 Deep Dive: purpose limitation",
          "desc": "AI data policy architecture (data collection policy for AI training: lawful basis, purpose limitation, data minimization requirements; data use policy: what training data can be used for; retention sc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: data minimization requirements; data use policy: what training data can be used for; retention schedule: how long training data is kept; deletion procedures: right to erasure implementation)",
          "desc": "AI data policy architecture (data collection policy for AI training: lawful basis, purpose limitation, data minimization requirements; data use policy: what training data can be used for; retention sc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: consent policy for AI training data",
          "desc": "AI data policy architecture (data collection policy for AI training: lawful basis, purpose limitation, data minimization requirements; data use policy: what training data can be used for; retention sc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: data sharing policy for model improvement",
          "desc": "AI data policy architecture (data collection policy for AI training: lawful basis, purpose limitation, data minimization requirements; data use policy: what training data can be used for; retention sc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: synthetic data policy",
          "desc": "AI data policy architecture (data collection policy for AI training: lawful basis, purpose limitation, data minimization requirements; data use policy: what training data can be used for; retention sc. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Data Policy for AI — Collection, Use, Retention, and the GDPR Intersection. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI data policy architecture (data collection policy for AI training: lawful basis, purpose limitation, data minimization requirements; data use policy"
        }
      ]
    },
    {
      "title": "Module 6: Public Policy Engagement — Regulatory Comment, Advocacy, and Coalition Building",
      "desc": "The public policy process (notice-and-comment rulemaking, legislative process, international standard-setting), writing effective public comments on AI regulations (structure, substance, evidence requirements — what regulators actually read vs. ignore), AI policy advocacy strategies (direct engagement, coalition building, think tank partnerships), and engaging regulators proactively (building relationships before regulations are written). Case study: How tech industry shaped EU AI Act provisions through comment periods.",
      "lessons": [
        {
          "title": "Foundations: Public Policy Engagement — Regulatory Comment, Advocacy, and Coalition Building",
          "desc": "The public policy process (notice-and-comment rulemaking, legislative process, international standard-setting), writing effective public comments on AI regulations (structure, substance, evidence requirements — what regulators actually read vs. ignore), AI policy advocacy strategies (direct engagement, coalition building, think tank partnerships), and engaging regulators proactively (building relationships before regulations are written). Case study: How tech industry shaped EU AI Act provisions through comment periods."
        },
        {
          "title": "Module 6.2 Deep Dive: legislative process",
          "desc": "Case study: How tech industry shaped EU AI Act provisions through comment periods.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: international standard-setting)",
          "desc": "The public policy process (notice-and-comment rulemaking, legislative process, international standard-setting), writing effective public comments on AI regulations (structure, substance, evidence requ. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: writing effective public comments on AI regulations (structure",
          "desc": "The public policy process (notice-and-comment rulemaking, legislative process, international standard-setting), writing effective public comments on AI regulations (structure, substance, evidence requ. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: substance",
          "desc": "The public policy process (notice-and-comment rulemaking, legislative process, international standard-setting), writing effective public comments on AI regulations (structure, substance, evidence requ. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: evidence requirements — what regulators actually read vs. ignore)",
          "desc": "The public policy process (notice-and-comment rulemaking, legislative process, international standard-setting), writing effective public comments on AI regulations (structure, substance, evidence requ. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Public Policy Engagement — Regulatory Comment, Advocacy, and Coalition Building. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The public policy process (notice-and-comment rulemaking, legislative process, international standard-setting), writing effective public comments on A"
        }
      ]
    },
    {
      "title": "Module 7: International AI Policy — Coordination, Conflicts, and Strategic Navigation",
      "desc": "The global AI governance landscape (OECD AI Principles, G7 Hiroshima AI Process, UN Secretary-General AI Advisory Body, Bletchley Declaration, Seoul AI Summit), jurisdictional conflicts in AI policy (GDPR vs. US AI executive order, China AI rules vs. US requirements), the Brussels Effect and extraterritorial application of EU AI regulation, multi-jurisdictional AI policy compliance strategy, and strategies for multinational AI policy management.",
      "lessons": [
        {
          "title": "Foundations: International AI Policy — Coordination, Conflicts, and Strategic Navigation",
          "desc": "The global AI governance landscape (OECD AI Principles, G7 Hiroshima AI Process, UN Secretary-General AI Advisory Body, Bletchley Declaration, Seoul AI Summit), jurisdictional conflicts in AI policy (GDPR vs. US AI executive order, China AI rules vs. US requirements), the Brussels Effect and extraterritorial application of EU AI regulation, multi-jurisdictional AI policy compliance strategy, and strategies for multinational AI policy management."
        },
        {
          "title": "Module 7.2 Deep Dive: G7 Hiroshima AI Process",
          "desc": "US requirements), the Brussels Effect and extraterritorial application of EU AI regulation, multi-jurisdictional AI policy compliance strategy, and strategies for multinational AI policy management.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: UN Secretary-General AI Advisory Body",
          "desc": "The global AI governance landscape (OECD AI Principles, G7 Hiroshima AI Process, UN Secretary-General AI Advisory Body, Bletchley Declaration, Seoul AI Summit), jurisdictional conflicts in AI policy (. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: Bletchley Declaration",
          "desc": "The global AI governance landscape (OECD AI Principles, G7 Hiroshima AI Process, UN Secretary-General AI Advisory Body, Bletchley Declaration, Seoul AI Summit), jurisdictional conflicts in AI policy (. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: Seoul AI Summit)",
          "desc": "The global AI governance landscape (OECD AI Principles, G7 Hiroshima AI Process, UN Secretary-General AI Advisory Body, Bletchley Declaration, Seoul AI Summit), jurisdictional conflicts in AI policy (. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: jurisdictional conflicts in AI policy (GDPR vs. US AI executive order",
          "desc": "The global AI governance landscape (OECD AI Principles, G7 Hiroshima AI Process, UN Secretary-General AI Advisory Body, Bletchley Declaration, Seoul AI Summit), jurisdictional conflicts in AI policy (. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: International AI Policy — Coordination, Conflicts, and Strategic Navigation. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The global AI governance landscape (OECD AI Principles, G7 Hiroshima AI Process, UN Secretary-General AI Advisory Body, Bletchley Declaration, Seoul A"
        }
      ]
    },
    {
      "title": "Module 8: Sector-Specific AI Policy Design and Implementation",
      "desc": "Healthcare AI policy (clinical decision support policy, AI diagnostic tool governance, patient consent for AI), financial services AI policy (algorithmic trading governance, AI credit policy, robo-advisor regulation compliance), law enforcement AI policy (facial recognition use policy, predictive policing governance, body camera AI policy), education AI policy (student data AI policy, AI in academic assessment, chatbot policies for students), and the policy design process for each sector.",
      "lessons": [
        {
          "title": "Foundations: Sector-Specific AI Policy Design and Implementation",
          "desc": "Healthcare AI policy (clinical decision support policy, AI diagnostic tool governance, patient consent for AI), financial services AI policy (algorithmic trading governance, AI credit policy, robo-advisor regulation compliance), law enforcement AI policy (facial recognition use policy, predictive policing governance, body camera AI policy), education AI policy (student data AI policy, AI in academic assessment, chatbot policies for students), and the policy design process for each sector."
        },
        {
          "title": "Module 8.2 Deep Dive: AI diagnostic tool governance",
          "desc": "Healthcare AI policy (clinical decision support policy, AI diagnostic tool governance, patient consent for AI), financial services AI policy (algorithmic trading governance, AI credit policy, robo-adv. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: patient consent for AI)",
          "desc": "Healthcare AI policy (clinical decision support policy, AI diagnostic tool governance, patient consent for AI), financial services AI policy (algorithmic trading governance, AI credit policy, robo-adv. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: financial services AI policy (algorithmic trading governance",
          "desc": "Healthcare AI policy (clinical decision support policy, AI diagnostic tool governance, patient consent for AI), financial services AI policy (algorithmic trading governance, AI credit policy, robo-adv. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: AI credit policy",
          "desc": "Healthcare AI policy (clinical decision support policy, AI diagnostic tool governance, patient consent for AI), financial services AI policy (algorithmic trading governance, AI credit policy, robo-adv. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: robo-advisor regulation compliance)",
          "desc": "Healthcare AI policy (clinical decision support policy, AI diagnostic tool governance, patient consent for AI), financial services AI policy (algorithmic trading governance, AI credit policy, robo-adv. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Sector-Specific AI Policy Design and Implementation. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Healthcare AI policy (clinical decision support policy, AI diagnostic tool governance, patient consent for AI), financial services AI policy (algorith"
        }
      ]
    },
    {
      "title": "Module 9: Policy Implementation, Monitoring, and Enforcement",
      "desc": "Translating AI policy into operational procedures (the 'last mile' of policy implementation), policy communication and training programs (making policy understandable to engineers and data scientists), compliance monitoring mechanisms (automated policy compliance scanning, manual audit programs), policy exception management (when to grant exceptions and at what authority level), policy review and update cadence (annual review minimum, triggered updates for regulatory changes), and the policy management system.",
      "lessons": [
        {
          "title": "Foundations: Policy Implementation, Monitoring, and Enforcement",
          "desc": "Translating AI policy into operational procedures (the 'last mile' of policy implementation), policy communication and training programs (making policy understandable to engineers and data scientists), compliance monitoring mechanisms (automated policy compliance scanning, manual audit programs), policy exception management (when to grant exceptions and at what authority level), policy review and update cadence (annual review minimum, triggered updates for regulatory changes), and the policy management system."
        },
        {
          "title": "Module 9.2 Deep Dive: policy communication and training programs (making policy understandable to engineers and data scientists)",
          "desc": "Translating AI policy into operational procedures (the 'last mile' of policy implementation), policy communication and training programs (making policy understandable to engineers and data scientists). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: compliance monitoring mechanisms (automated policy compliance scanning",
          "desc": "Translating AI policy into operational procedures (the 'last mile' of policy implementation), policy communication and training programs (making policy understandable to engineers and data scientists). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: manual audit programs)",
          "desc": "Translating AI policy into operational procedures (the 'last mile' of policy implementation), policy communication and training programs (making policy understandable to engineers and data scientists). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: policy exception management (when to grant exceptions and at what authority level)",
          "desc": "Translating AI policy into operational procedures (the 'last mile' of policy implementation), policy communication and training programs (making policy understandable to engineers and data scientists). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: policy review and update cadence (annual review minimum",
          "desc": "Translating AI policy into operational procedures (the 'last mile' of policy implementation), policy communication and training programs (making policy understandable to engineers and data scientists). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Policy Implementation, Monitoring, and Enforcement. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Translating AI policy into operational procedures (the 'last mile' of policy implementation), policy communication and training programs (making polic"
        }
      ]
    },
    {
      "title": "Module 10: AI Policy Leadership and Capstone",
      "desc": "The AI policy professional career path (policy analyst → policy manager → VP Policy → Chief Policy Officer — $150K-$300K range), building the AI policy function, thought leadership in AI policy (writing, speaking, advising regulators), and the capstone: design a complete corporate AI policy framework for a provided organization scenario AND write a public comment response to a provided AI regulatory proposal — demonstrating both internal governance and external engagement capabilities.",
      "lessons": [
        {
          "title": "Foundations: AI Policy Leadership and Capstone",
          "desc": "The AI policy professional career path (policy analyst → policy manager → VP Policy → Chief Policy Officer — $150K-$300K range), building the AI policy function, thought leadership in AI policy (writing, speaking, advising regulators), and the capstone: design a complete corporate AI policy framework for a provided organization scenario AND write a public comment response to a provided AI regulatory proposal — demonstrating both internal governance and external engagement capabilities."
        },
        {
          "title": "Module 10.2 Deep Dive: building the AI policy function",
          "desc": "The AI policy professional career path (policy analyst → policy manager → VP Policy → Chief Policy Officer — $150K-$300K range), building the AI policy function, thought leadership in AI policy (writi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: thought leadership in AI policy (writing",
          "desc": "The AI policy professional career path (policy analyst → policy manager → VP Policy → Chief Policy Officer — $150K-$300K range), building the AI policy function, thought leadership in AI policy (writi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: speaking",
          "desc": "The AI policy professional career path (policy analyst → policy manager → VP Policy → Chief Policy Officer — $150K-$300K range), building the AI policy function, thought leadership in AI policy (writi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: advising regulators)",
          "desc": "The AI policy professional career path (policy analyst → policy manager → VP Policy → Chief Policy Officer — $150K-$300K range), building the AI policy function, thought leadership in AI policy (writi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: and the capstone: design a complete corporate AI policy framework for a provided organization scenario AND write a public comment response to a provided AI regulatory proposal — demonstrating both internal governance and external engagement capabilities.",
          "desc": "The AI policy professional career path (policy analyst → policy manager → VP Policy → Chief Policy Officer — $150K-$300K range), building the AI policy function, thought leadership in AI policy (writi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: AI Policy Leadership and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI policy professional career path (policy analyst → policy manager → VP Policy → Chief Policy Officer — $150K-$300K range), building the AI polic"
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
