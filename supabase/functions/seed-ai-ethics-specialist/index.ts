import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/adminGuard.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Ethics Specialist",
  "description": "Master applied AI ethics — from philosophical foundations through practical implementation in AI development teams. 10 modules covering normative ethics for AI, value alignment, algorithmic justice, privacy ethics, environmental ethics, and building genuine AI ethics programs.",
  "translations": {
    "es": {
      "title": "AI Ethics Specialist",
      "description": "Master applied AI ethics — from philosophical foundations through practical implementation in AI development teams. 10 modules covering normative ethics for AI, value alignment, algorithmic justice, p"
    },
    "fr": {
      "title": "AI Ethics Specialist",
      "description": "Master applied AI ethics — from philosophical foundations through practical implementation in AI development teams. 10 modules covering normative ethics for AI, value alignment, algorithmic justice, p"
    },
    "de": {
      "title": "AI Ethics Specialist",
      "description": "Master applied AI ethics — from philosophical foundations through practical implementation in AI development teams. 10 modules covering normative ethics for AI, value alignment, algorithmic justice, p"
    },
    "zh": {
      "title": "AI Ethics Specialist",
      "description": "Master applied AI ethics — from philosophical foundations through practical implementation in AI development teams. 10 modules covering normative ethics for AI, value alignment, algorithmic justice, p"
    },
    "ar": {
      "title": "AI Ethics Specialist",
      "description": "Master applied AI ethics — from philosophical foundations through practical implementation in AI development teams. 10 modules covering normative ethics for AI, value alignment, algorithmic justice, p"
    },
    "ja": {
      "title": "AI Ethics Specialist",
      "description": "Master applied AI ethics — from philosophical foundations through practical implementation in AI development teams. 10 modules covering normative ethics for AI, value alignment, algorithmic justice, p"
    }
  },
  "modules": [
    {
      "title": "Module 1: Philosophical Foundations — Four Ethical Frameworks Applied to AI",
      "desc": "Consequentialism (maximize good outcomes — utilitarian calculus for AI decisions), deontology (Kantian respect for persons — AI systems must respect human dignity and autonomy as ends, not merely means), virtue ethics (what would a person of good character build?), contractarianism (Rawlsian veil of ignorance — design AI as if you didn't know which group you'd belong to), and care ethics (contextual relationships over abstract principles). Each framework applied to the same AI dilemma: self-driving car trolley problem. Why reasonable people reach different conclusions.",
      "lessons": [
        {
          "title": "Foundations: Philosophical Foundations — Four Ethical Frameworks Applied to AI",
          "desc": "Consequentialism (maximize good outcomes — utilitarian calculus for AI decisions), deontology (Kantian respect for persons — AI systems must respect human dignity and autonomy as ends, not merely means), virtue ethics (what would a person of good character build?), contractarianism (Rawlsian veil of ignorance — design AI as if you didn't know which group you'd belong to), and care ethics (contextual relationships over abstract principles). Each framework applied to the same AI dilemma: self-driving car trolley problem. Why reasonable people reach different conclusions."
        },
        {
          "title": "Module 1.2 Deep Dive: deontology (Kantian respect for persons — AI systems must respect human dignity and autonomy as ends",
          "desc": "Why reasonable people reach different conclusions.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: not merely means)",
          "desc": "Consequentialism (maximize good outcomes — utilitarian calculus for AI decisions), deontology (Kantian respect for persons — AI systems must respect human dignity and autonomy as ends, not merely mean. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: virtue ethics (what would a person of good character build?)",
          "desc": "Consequentialism (maximize good outcomes — utilitarian calculus for AI decisions), deontology (Kantian respect for persons — AI systems must respect human dignity and autonomy as ends, not merely mean. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: contractarianism (Rawlsian veil of ignorance — design AI as if you didn't know which group you'd belong to)",
          "desc": "Consequentialism (maximize good outcomes — utilitarian calculus for AI decisions), deontology (Kantian respect for persons — AI systems must respect human dignity and autonomy as ends, not merely mean. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: and care ethics (contextual relationships over abstract principles). Each framework applied to the same AI dilemma: self-driving car trolley problem. Why reasonable people reach different conclusions.",
          "desc": "Consequentialism (maximize good outcomes — utilitarian calculus for AI decisions), deontology (Kantian respect for persons — AI systems must respect human dignity and autonomy as ends, not merely mean. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: Philosophical Foundations — Four Ethical Frameworks Applied to AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Consequentialism (maximize good outcomes — utilitarian calculus for AI decisions), deontology (Kantian respect for persons — AI systems must respect h"
        }
      ]
    },
    {
      "title": "Module 2: Value Alignment — The Hardest Problem in AI Ethics",
      "desc": "The value alignment problem (making AI systems do what humans actually want, not what they literally say), specification gaming (Goodhart's Law: when a measure becomes a target, it ceases to be a good measure), the diversity of human values (different cultures, contexts, individuals — whose values should AI align to?), RLHF (Reinforcement Learning from Human Feedback) as an alignment approach (and its limitations), Constitutional AI (Anthropic's approach), and why value alignment is an ongoing engineering challenge, not a solved problem.",
      "lessons": [
        {
          "title": "Foundations: Value Alignment — The Hardest Problem in AI Ethics",
          "desc": "The value alignment problem (making AI systems do what humans actually want, not what they literally say), specification gaming (Goodhart's Law: when a measure becomes a target, it ceases to be a good measure), the diversity of human values (different cultures, contexts, individuals — whose values should AI align to?), RLHF (Reinforcement Learning from Human Feedback) as an alignment approach (and its limitations), Constitutional AI (Anthropic's approach), and why value alignment is an ongoing engineering challenge, not a solved problem."
        },
        {
          "title": "Module 2.2 Deep Dive: not what they literally say)",
          "desc": "The value alignment problem (making AI systems do what humans actually want, not what they literally say), specification gaming (Goodhart's Law: when a measure becomes a target, it ceases to be a good. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: specification gaming (Goodhart's Law: when a measure becomes a target",
          "desc": "The value alignment problem (making AI systems do what humans actually want, not what they literally say), specification gaming (Goodhart's Law: when a measure becomes a target, it ceases to be a good. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: it ceases to be a good measure)",
          "desc": "The value alignment problem (making AI systems do what humans actually want, not what they literally say), specification gaming (Goodhart's Law: when a measure becomes a target, it ceases to be a good. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: the diversity of human values (different cultures",
          "desc": "The value alignment problem (making AI systems do what humans actually want, not what they literally say), specification gaming (Goodhart's Law: when a measure becomes a target, it ceases to be a good. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: contexts",
          "desc": "The value alignment problem (making AI systems do what humans actually want, not what they literally say), specification gaming (Goodhart's Law: when a measure becomes a target, it ceases to be a good. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Value Alignment — The Hardest Problem in AI Ethics. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The value alignment problem (making AI systems do what humans actually want, not what they literally say), specification gaming (Goodhart's Law: when "
        }
      ]
    },
    {
      "title": "Module 3: Algorithmic Justice — Fairness Beyond Mathematics",
      "desc": "Social justice frameworks applied to AI (distributive justice: are AI benefits and harms fairly distributed?; procedural justice: is the AI decision process fair?; recognition justice: does the AI recognize and respect all groups?; participatory justice: did affected communities participate in AI design?), historical injustices encoded in training data (how biased historical data produces biased AI), the limits of technical fairness metrics in achieving social justice, and building AI systems that advance rather than entrench inequality. Case study: COMPAS beyond the math.",
      "lessons": [
        {
          "title": "Foundations: Algorithmic Justice — Fairness Beyond Mathematics",
          "desc": "Social justice frameworks applied to AI (distributive justice: are AI benefits and harms fairly distributed?; procedural justice: is the AI decision process fair?; recognition justice: does the AI recognize and respect all groups?; participatory justice: did affected communities participate in AI design?), historical injustices encoded in training data (how biased historical data produces biased AI), the limits of technical fairness metrics in achieving social justice, and building AI systems that advance rather than entrench inequality. Case study: COMPAS beyond the math."
        },
        {
          "title": "Module 3.2 Deep Dive: historical injustices encoded in training data (how biased historical data produces biased AI)",
          "desc": "Social justice frameworks applied to AI (distributive justice: are AI benefits and harms fairly distributed?; procedural justice: is the AI decision process fair?; recognition justice: does the AI rec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: the limits of technical fairness metrics in achieving social justice",
          "desc": "Social justice frameworks applied to AI (distributive justice: are AI benefits and harms fairly distributed?; procedural justice: is the AI decision process fair?; recognition justice: does the AI rec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: and building AI systems that advance rather than entrench inequality. Case study: COMPAS beyond the math.",
          "desc": "Social justice frameworks applied to AI (distributive justice: are AI benefits and harms fairly distributed?; procedural justice: is the AI decision process fair?; recognition justice: does the AI rec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: Social justice frameworks applied to AI (distributive justic",
          "desc": "Social justice frameworks applied to AI (distributive justice: are AI benefits and harms fairly distributed?; procedural justice: is the AI decision process fair?; recognition justice: does the AI rec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: Social justice frameworks applied to AI (distributive justic",
          "desc": "Social justice frameworks applied to AI (distributive justice: are AI benefits and harms fairly distributed?; procedural justice: is the AI decision process fair?; recognition justice: does the AI rec. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Algorithmic Justice — Fairness Beyond Mathematics. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Social justice frameworks applied to AI (distributive justice: are AI benefits and harms fairly distributed?; procedural justice: is the AI decision p"
        }
      ]
    },
    {
      "title": "Module 4: AI and Human Rights — Legal and Philosophical Foundations",
      "desc": "The UN Universal Declaration of Human Rights applied to AI (right to privacy: AI surveillance violations; right to equality: AI discrimination; right to freedom of expression: AI content moderation; right to fair trial: AI criminal justice tools; right to work: AI and economic displacement), the emerging AI and human rights legal frameworks (UN High Commissioner for Human Rights on AI, Council of Europe AI Convention), human dignity in AI systems (treating people as ends, not means), and the human rights impact assessment for AI.",
      "lessons": [
        {
          "title": "Foundations: AI and Human Rights — Legal and Philosophical Foundations",
          "desc": "The UN Universal Declaration of Human Rights applied to AI (right to privacy: AI surveillance violations; right to equality: AI discrimination; right to freedom of expression: AI content moderation; right to fair trial: AI criminal justice tools; right to work: AI and economic displacement), the emerging AI and human rights legal frameworks (UN High Commissioner for Human Rights on AI, Council of Europe AI Convention), human dignity in AI systems (treating people as ends, not means), and the human rights impact assessment for AI."
        },
        {
          "title": "Module 4.2 Deep Dive: the emerging AI and human rights legal frameworks (UN High Commissioner for Human Rights on AI",
          "desc": "The UN Universal Declaration of Human Rights applied to AI (right to privacy: AI surveillance violations; right to equality: AI discrimination; right to freedom of expression: AI content moderation; r. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: Council of Europe AI Convention)",
          "desc": "The UN Universal Declaration of Human Rights applied to AI (right to privacy: AI surveillance violations; right to equality: AI discrimination; right to freedom of expression: AI content moderation; r. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: human dignity in AI systems (treating people as ends",
          "desc": "The UN Universal Declaration of Human Rights applied to AI (right to privacy: AI surveillance violations; right to equality: AI discrimination; right to freedom of expression: AI content moderation; r. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: not means)",
          "desc": "The UN Universal Declaration of Human Rights applied to AI (right to privacy: AI surveillance violations; right to equality: AI discrimination; right to freedom of expression: AI content moderation; r. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: and the human rights impact assessment for AI.",
          "desc": "The UN Universal Declaration of Human Rights applied to AI (right to privacy: AI surveillance violations; right to equality: AI discrimination; right to freedom of expression: AI content moderation; r. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: AI and Human Rights — Legal and Philosophical Foundations. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The UN Universal Declaration of Human Rights applied to AI (right to privacy: AI surveillance violations; right to equality: AI discrimination; right "
        }
      ]
    },
    {
      "title": "Module 5: AI in High-Stakes Domains — Medical, Criminal Justice, and Welfare AI Ethics",
      "desc": "Medical AI ethics (patient autonomy vs. AI paternalism, clinical validation requirements and the risk of deployment without validation, who is responsible when diagnostic AI is wrong?), criminal justice AI ethics (presumption of innocence vs. predictive AI, transparency requirements for consequential decisions, the ProPublica-Northpointe COMPAS controversy in depth), welfare systems AI ethics (automated benefit denials, algorithmic governance of poverty), and the domain-specific ethical analysis framework.",
      "lessons": [
        {
          "title": "Foundations: AI in High-Stakes Domains — Medical, Criminal Justice, and Welfare AI Ethics",
          "desc": "Medical AI ethics (patient autonomy vs. AI paternalism, clinical validation requirements and the risk of deployment without validation, who is responsible when diagnostic AI is wrong?), criminal justice AI ethics (presumption of innocence vs. predictive AI, transparency requirements for consequential decisions, the ProPublica-Northpointe COMPAS controversy in depth), welfare systems AI ethics (automated benefit denials, algorithmic governance of poverty), and the domain-specific ethical analysis framework."
        },
        {
          "title": "Module 5.2 Deep Dive: clinical validation requirements and the risk of deployment without validation",
          "desc": "predictive AI, transparency requirements for consequential decisions, the ProPublica-Northpointe COMPAS controversy in depth), welfare systems AI ethics (automated benefit denials, algorithmic governance of poverty), and the domain-specific ethical analysis framework.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: who is responsible when diagnostic AI is wrong?)",
          "desc": "Medical AI ethics (patient autonomy vs. AI paternalism, clinical validation requirements and the risk of deployment without validation, who is responsible when diagnostic AI is wrong?), criminal justi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: criminal justice AI ethics (presumption of innocence vs. predictive AI",
          "desc": "Medical AI ethics (patient autonomy vs. AI paternalism, clinical validation requirements and the risk of deployment without validation, who is responsible when diagnostic AI is wrong?), criminal justi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: transparency requirements for consequential decisions",
          "desc": "Medical AI ethics (patient autonomy vs. AI paternalism, clinical validation requirements and the risk of deployment without validation, who is responsible when diagnostic AI is wrong?), criminal justi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: the ProPublica-Northpointe COMPAS controversy in depth)",
          "desc": "Medical AI ethics (patient autonomy vs. AI paternalism, clinical validation requirements and the risk of deployment without validation, who is responsible when diagnostic AI is wrong?), criminal justi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: AI in High-Stakes Domains — Medical, Criminal Justice, and Welfare AI Ethics. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Medical AI ethics (patient autonomy vs. AI paternalism, clinical validation requirements and the risk of deployment without validation, who is respons"
        }
      ]
    },
    {
      "title": "Module 6: Environmental Ethics for AI — Sustainability, Energy Justice, and Planetary Boundaries",
      "desc": "AI's environmental footprint (Training GPT-3: 552 tons CO2 equivalent; inference at scale: ongoing energy consumption; data center water usage), energy justice dimension (AI data centers consuming power in regions with inadequate electricity access), sustainable AI practices (model compression, efficient architectures, pruning, quantization, knowledge distillation), renewable energy commitments for AI companies, and the ethics of AI's environmental impact when climate urgency is critical.",
      "lessons": [
        {
          "title": "Foundations: Environmental Ethics for AI — Sustainability, Energy Justice, and Planetary Boundaries",
          "desc": "AI's environmental footprint (Training GPT-3: 552 tons CO2 equivalent; inference at scale: ongoing energy consumption; data center water usage), energy justice dimension (AI data centers consuming power in regions with inadequate electricity access), sustainable AI practices (model compression, efficient architectures, pruning, quantization, knowledge distillation), renewable energy commitments for AI companies, and the ethics of AI's environmental impact when climate urgency is critical."
        },
        {
          "title": "Module 6.2 Deep Dive: energy justice dimension (AI data centers consuming power in regions with inadequate electricity access)",
          "desc": "AI's environmental footprint (Training GPT-3: 552 tons CO2 equivalent; inference at scale: ongoing energy consumption; data center water usage), energy justice dimension (AI data centers consuming pow. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: sustainable AI practices (model compression",
          "desc": "AI's environmental footprint (Training GPT-3: 552 tons CO2 equivalent; inference at scale: ongoing energy consumption; data center water usage), energy justice dimension (AI data centers consuming pow. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: efficient architectures",
          "desc": "AI's environmental footprint (Training GPT-3: 552 tons CO2 equivalent; inference at scale: ongoing energy consumption; data center water usage), energy justice dimension (AI data centers consuming pow. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: pruning",
          "desc": "AI's environmental footprint (Training GPT-3: 552 tons CO2 equivalent; inference at scale: ongoing energy consumption; data center water usage), energy justice dimension (AI data centers consuming pow. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: quantization",
          "desc": "AI's environmental footprint (Training GPT-3: 552 tons CO2 equivalent; inference at scale: ongoing energy consumption; data center water usage), energy justice dimension (AI data centers consuming pow. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Environmental Ethics for AI — Sustainability, Energy Justice, and Planetary Boundaries. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI's environmental footprint (Training GPT-3: 552 tons CO2 equivalent; inference at scale: ongoing energy consumption; data center water usage), energ"
        }
      ]
    },
    {
      "title": "Module 7: AI and Power — Surveillance, Concentration, Democratic Accountability",
      "desc": "Mass surveillance AI ethics (facial recognition in public spaces, behavioral monitoring, social scoring systems), AI and economic power concentration (platform AI creating winner-take-all dynamics, the AI divide between well-resourced and under-resourced organizations), AI and democratic processes (deepfakes in elections, algorithmic political advertising, information ecosystem manipulation by AI), and the governance mechanisms needed to prevent AI power concentration. Case study: China's Social Credit System and the Western response.",
      "lessons": [
        {
          "title": "Foundations: AI and Power — Surveillance, Concentration, Democratic Accountability",
          "desc": "Mass surveillance AI ethics (facial recognition in public spaces, behavioral monitoring, social scoring systems), AI and economic power concentration (platform AI creating winner-take-all dynamics, the AI divide between well-resourced and under-resourced organizations), AI and democratic processes (deepfakes in elections, algorithmic political advertising, information ecosystem manipulation by AI), and the governance mechanisms needed to prevent AI power concentration. Case study: China's Social Credit System and the Western response."
        },
        {
          "title": "Module 7.2 Deep Dive: behavioral monitoring",
          "desc": "Mass surveillance AI ethics (facial recognition in public spaces, behavioral monitoring, social scoring systems), AI and economic power concentration (platform AI creating winner-take-all dynamics, th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: social scoring systems)",
          "desc": "Mass surveillance AI ethics (facial recognition in public spaces, behavioral monitoring, social scoring systems), AI and economic power concentration (platform AI creating winner-take-all dynamics, th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: AI and economic power concentration (platform AI creating winner-take-all dynamics",
          "desc": "Mass surveillance AI ethics (facial recognition in public spaces, behavioral monitoring, social scoring systems), AI and economic power concentration (platform AI creating winner-take-all dynamics, th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: the AI divide between well-resourced and under-resourced organizations)",
          "desc": "Mass surveillance AI ethics (facial recognition in public spaces, behavioral monitoring, social scoring systems), AI and economic power concentration (platform AI creating winner-take-all dynamics, th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: AI and democratic processes (deepfakes in elections",
          "desc": "Mass surveillance AI ethics (facial recognition in public spaces, behavioral monitoring, social scoring systems), AI and economic power concentration (platform AI creating winner-take-all dynamics, th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: AI and Power — Surveillance, Concentration, Democratic Accountability. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Mass surveillance AI ethics (facial recognition in public spaces, behavioral monitoring, social scoring systems), AI and economic power concentration "
        }
      ]
    },
    {
      "title": "Module 8: Applied Ethics for AI Development Teams — Integration Without Ethics Washing",
      "desc": "Integrating ethics into the development lifecycle (ethics by design: ethical requirements alongside technical requirements), ethics review process design (when is a review required? who conducts it? what criteria?), the 'ethics washing' problem (cosmetic ethics commitments without operational change — how to avoid it), building psychological safety for ethics concerns (speaking up when you see potential harm), and the ethics escalation path. Case studies of engineers who raised ethical concerns at major AI companies — and what happened.",
      "lessons": [
        {
          "title": "Foundations: Applied Ethics for AI Development Teams — Integration Without Ethics Washing",
          "desc": "Integrating ethics into the development lifecycle (ethics by design: ethical requirements alongside technical requirements), ethics review process design (when is a review required? who conducts it? what criteria?), the 'ethics washing' problem (cosmetic ethics commitments without operational change — how to avoid it), building psychological safety for ethics concerns (speaking up when you see potential harm), and the ethics escalation path. Case studies of engineers who raised ethical concerns at major AI companies — and what happened."
        },
        {
          "title": "Module 8.2 Deep Dive: ethics review process design (when is a review required? who conducts it? what criteria?)",
          "desc": "Integrating ethics into the development lifecycle (ethics by design: ethical requirements alongside technical requirements), ethics review process design (when is a review required? who conducts it? w. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: the 'ethics washing' problem (cosmetic ethics commitments without operational change — how to avoid it)",
          "desc": "Integrating ethics into the development lifecycle (ethics by design: ethical requirements alongside technical requirements), ethics review process design (when is a review required? who conducts it? w. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: building psychological safety for ethics concerns (speaking up when you see potential harm)",
          "desc": "Integrating ethics into the development lifecycle (ethics by design: ethical requirements alongside technical requirements), ethics review process design (when is a review required? who conducts it? w. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: and the ethics escalation path. Case studies of engineers who raised ethical concerns at major AI companies — and what happened.",
          "desc": "Integrating ethics into the development lifecycle (ethics by design: ethical requirements alongside technical requirements), ethics review process design (when is a review required? who conducts it? w. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: Integrating ethics into the development lifecycle (ethics by",
          "desc": "Integrating ethics into the development lifecycle (ethics by design: ethical requirements alongside technical requirements), ethics review process design (when is a review required? who conducts it? w. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Applied Ethics for AI Development Teams — Integration Without Ethics Washing. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Integrating ethics into the development lifecycle (ethics by design: ethical requirements alongside technical requirements), ethics review process des"
        }
      ]
    },
    {
      "title": "Module 9: Corporate AI Ethics Programs — Building Genuine Programs That Work",
      "desc": "The anatomy of an effective AI ethics program (structure + authority + resources + processes + culture), building an ethics committee with real decision-making authority (not just advisory), the resources required (dedicated ethics staff, ethics review time built into project schedules, ethics training budget), metrics for ethics program maturity, and case studies of corporate ethics programs — genuine (Microsoft, IBM) and ethics-washing (Google's Timnit Gebru controversy and what it reveals about institutional ethics commitments).",
      "lessons": [
        {
          "title": "Foundations: Corporate AI Ethics Programs — Building Genuine Programs That Work",
          "desc": "The anatomy of an effective AI ethics program (structure + authority + resources + processes + culture), building an ethics committee with real decision-making authority (not just advisory), the resources required (dedicated ethics staff, ethics review time built into project schedules, ethics training budget), metrics for ethics program maturity, and case studies of corporate ethics programs — genuine (Microsoft, IBM) and ethics-washing (Google's Timnit Gebru controversy and what it reveals about institutional ethics commitments)."
        },
        {
          "title": "Module 9.2 Deep Dive: building an ethics committee with real decision-making authority (not just advisory)",
          "desc": "The anatomy of an effective AI ethics program (structure + authority + resources + processes + culture), building an ethics committee with real decision-making authority (not just advisory), the resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: the resources required (dedicated ethics staff",
          "desc": "The anatomy of an effective AI ethics program (structure + authority + resources + processes + culture), building an ethics committee with real decision-making authority (not just advisory), the resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: ethics review time built into project schedules",
          "desc": "The anatomy of an effective AI ethics program (structure + authority + resources + processes + culture), building an ethics committee with real decision-making authority (not just advisory), the resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: ethics training budget)",
          "desc": "The anatomy of an effective AI ethics program (structure + authority + resources + processes + culture), building an ethics committee with real decision-making authority (not just advisory), the resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: metrics for ethics program maturity",
          "desc": "The anatomy of an effective AI ethics program (structure + authority + resources + processes + culture), building an ethics committee with real decision-making authority (not just advisory), the resou. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Corporate AI Ethics Programs — Building Genuine Programs That Work. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The anatomy of an effective AI ethics program (structure + authority + resources + processes + culture), building an ethics committee with real decisi"
        }
      ]
    },
    {
      "title": "Module 10: Future of AI Ethics and Capstone",
      "desc": "AI ethics for increasingly capable AI systems (the AGI alignment challenge, AI consciousness and moral status, the rights of AI), the long-termism vs. near-termism debate in AI ethics, international AI ethics cooperation (why AI ethics requires global coordination), the AI ethics career path, and the capstone: conduct a complete ethical analysis of a provided AI system using all four ethical frameworks (consequentialist, deontological, virtue ethics, contractarian), identify framework conflicts and how to navigate them, and design the ethics program and governance structure for the organization deploying this AI.",
      "lessons": [
        {
          "title": "Foundations: Future of AI Ethics and Capstone",
          "desc": "AI ethics for increasingly capable AI systems (the AGI alignment challenge, AI consciousness and moral status, the rights of AI), the long-termism vs. near-termism debate in AI ethics, international AI ethics cooperation (why AI ethics requires global coordination), the AI ethics career path, and the capstone: conduct a complete ethical analysis of a provided AI system using all four ethical frameworks (consequentialist, deontological, virtue ethics, contractarian), identify framework conflicts and how to navigate them, and design the ethics program and governance structure for the organization deploying this AI."
        },
        {
          "title": "Module 10.2 Deep Dive: AI consciousness and moral status",
          "desc": "AI ethics for increasingly capable AI systems (the AGI alignment challenge, AI consciousness and moral status, the rights of AI), the long-termism vs. near-termism debate in AI ethics, international A. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: the rights of AI)",
          "desc": "AI ethics for increasingly capable AI systems (the AGI alignment challenge, AI consciousness and moral status, the rights of AI), the long-termism vs. near-termism debate in AI ethics, international A. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: the long-termism vs. near-termism debate in AI ethics",
          "desc": "AI ethics for increasingly capable AI systems (the AGI alignment challenge, AI consciousness and moral status, the rights of AI), the long-termism vs. near-termism debate in AI ethics, international A. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: international AI ethics cooperation (why AI ethics requires global coordination)",
          "desc": "AI ethics for increasingly capable AI systems (the AGI alignment challenge, AI consciousness and moral status, the rights of AI), the long-termism vs. near-termism debate in AI ethics, international A. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: the AI ethics career path",
          "desc": "AI ethics for increasingly capable AI systems (the AGI alignment challenge, AI consciousness and moral status, the rights of AI), the long-termism vs. near-termism debate in AI ethics, international A. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Future of AI Ethics and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI ethics for increasingly capable AI systems (the AGI alignment challenge, AI consciousness and moral status, the rights of AI), the long-termism vs."
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
