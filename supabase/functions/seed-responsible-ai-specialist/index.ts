import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "Responsible AI Specialist",
  "description": "Master the practices, frameworks, and tools that make AI systems ethical, fair, accountable, and transparent. 10 modules covering fairness and bias, the impossibility theorems, explainability, human oversight, impact assessment, and the technical implementations used at Google, Microsoft, and IBM.",
  "translations": {
    "es": {
      "title": "Responsible AI Specialist",
      "description": "Master the practices, frameworks, and tools that make AI systems ethical, fair, accountable, and transparent. 10 modules covering fairness and bias, the impossibility theorems, explainability, human o"
    },
    "fr": {
      "title": "Responsible AI Specialist",
      "description": "Master the practices, frameworks, and tools that make AI systems ethical, fair, accountable, and transparent. 10 modules covering fairness and bias, the impossibility theorems, explainability, human o"
    },
    "de": {
      "title": "Responsible AI Specialist",
      "description": "Master the practices, frameworks, and tools that make AI systems ethical, fair, accountable, and transparent. 10 modules covering fairness and bias, the impossibility theorems, explainability, human o"
    },
    "zh": {
      "title": "Responsible AI Specialist",
      "description": "Master the practices, frameworks, and tools that make AI systems ethical, fair, accountable, and transparent. 10 modules covering fairness and bias, the impossibility theorems, explainability, human o"
    },
    "ar": {
      "title": "Responsible AI Specialist",
      "description": "Master the practices, frameworks, and tools that make AI systems ethical, fair, accountable, and transparent. 10 modules covering fairness and bias, the impossibility theorems, explainability, human o"
    },
    "ja": {
      "title": "Responsible AI Specialist",
      "description": "Master the practices, frameworks, and tools that make AI systems ethical, fair, accountable, and transparent. 10 modules covering fairness and bias, the impossibility theorems, explainability, human o"
    }
  },
  "modules": [
    {
      "title": "Module 1: Responsible AI Principles — From Aspirational to Operational",
      "desc": "The major responsible AI frameworks (Google 7 principles, Microsoft 6 principles, IBM 5 pillars, EU Ethics Guidelines for Trustworthy AI), the tension between principles (fairness vs. accuracy, privacy vs. utility, autonomy vs. oversight), the gap between principles and practice (why 78% of organizations with RAI principles have no implementation process), and operationalizing RAI as engineering requirements. The harms that motivated each framework.",
      "lessons": [
        {
          "title": "Foundations: Responsible AI Principles — From Aspirational to Operational",
          "desc": "The major responsible AI frameworks (Google 7 principles, Microsoft 6 principles, IBM 5 pillars, EU Ethics Guidelines for Trustworthy AI), the tension between principles (fairness vs. accuracy, privacy vs. utility, autonomy vs. oversight), the gap between principles and practice (why 78% of organizations with RAI principles have no implementation process), and operationalizing RAI as engineering requirements. The harms that motivated each framework."
        },
        {
          "title": "Module 1.2 Deep Dive: Microsoft 6 principles",
          "desc": "The harms that motivated each framework.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: IBM 5 pillars",
          "desc": "The major responsible AI frameworks (Google 7 principles, Microsoft 6 principles, IBM 5 pillars, EU Ethics Guidelines for Trustworthy AI), the tension between principles (fairness vs. accuracy, privac. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: EU Ethics Guidelines for Trustworthy AI)",
          "desc": "The major responsible AI frameworks (Google 7 principles, Microsoft 6 principles, IBM 5 pillars, EU Ethics Guidelines for Trustworthy AI), the tension between principles (fairness vs. accuracy, privac. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: the tension between principles (fairness vs. accuracy",
          "desc": "The major responsible AI frameworks (Google 7 principles, Microsoft 6 principles, IBM 5 pillars, EU Ethics Guidelines for Trustworthy AI), the tension between principles (fairness vs. accuracy, privac. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: privacy vs. utility",
          "desc": "The major responsible AI frameworks (Google 7 principles, Microsoft 6 principles, IBM 5 pillars, EU Ethics Guidelines for Trustworthy AI), the tension between principles (fairness vs. accuracy, privac. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: Responsible AI Principles — From Aspirational to Operational. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The major responsible AI frameworks (Google 7 principles, Microsoft 6 principles, IBM 5 pillars, EU Ethics Guidelines for Trustworthy AI), the tension"
        }
      ]
    },
    {
      "title": "Module 2: Fairness in AI — The 20 Definitions and the Impossibility Theorems",
      "desc": "Chouldechova's impossibility theorem (you cannot simultaneously satisfy demographic parity, equalized odds, AND calibration when base rates differ — mathematical proof), Kleinberg et al.'s impossibility result, the 20+ technical fairness definitions and when each is legally and ethically appropriate, disparate treatment vs. disparate impact under US law (Title VII, ECOA), and the fairness definition selection framework. Case study: COMPAS analysis — ProPublica vs. Northpointe.",
      "lessons": [
        {
          "title": "Foundations: Fairness in AI — The 20 Definitions and the Impossibility Theorems",
          "desc": "Chouldechova's impossibility theorem (you cannot simultaneously satisfy demographic parity, equalized odds, AND calibration when base rates differ — mathematical proof), Kleinberg et al.'s impossibility result, the 20+ technical fairness definitions and when each is legally and ethically appropriate, disparate treatment vs. disparate impact under US law (Title VII, ECOA), and the fairness definition selection framework. Case study: COMPAS analysis — ProPublica vs. Northpointe."
        },
        {
          "title": "Module 2.2 Deep Dive: equalized odds",
          "desc": "Case study: COMPAS analysis — ProPublica vs. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: AND calibration when base rates differ — mathematical proof)",
          "desc": "Chouldechova's impossibility theorem (you cannot simultaneously satisfy demographic parity, equalized odds, AND calibration when base rates differ — mathematical proof), Kleinberg et al.'s impossibili. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: Kleinberg et al.'s impossibility result",
          "desc": "Chouldechova's impossibility theorem (you cannot simultaneously satisfy demographic parity, equalized odds, AND calibration when base rates differ — mathematical proof), Kleinberg et al.'s impossibili. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: the 20+ technical fairness definitions and when each is legally and ethically appropriate",
          "desc": "Chouldechova's impossibility theorem (you cannot simultaneously satisfy demographic parity, equalized odds, AND calibration when base rates differ — mathematical proof), Kleinberg et al.'s impossibili. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: disparate treatment vs. disparate impact under US law (Title VII",
          "desc": "Chouldechova's impossibility theorem (you cannot simultaneously satisfy demographic parity, equalized odds, AND calibration when base rates differ — mathematical proof), Kleinberg et al.'s impossibili. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Fairness in AI — The 20 Definitions and the Impossibility Theorems. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Chouldechova's impossibility theorem (you cannot simultaneously satisfy demographic parity, equalized odds, AND calibration when base rates differ — m"
        }
      ]
    },
    {
      "title": "Module 3: Bias Detection and Mitigation — Tools, Techniques, and Audit Methodology",
      "desc": "Pre-processing (data resampling, reweighting, adversarial debiasing of training data), in-processing (fairness constraints, adversarial training), post-processing (threshold calibration per demographic group, reject option classification). IBM AI Fairness 360 toolkit (30+ fairness metrics, 9 mitigation algorithms), Google Fairness Indicators, Aequitas toolkit. The bias audit methodology: what to test, who to test, how to report. Case study: Audit a hiring algorithm for gender and race disparities.",
      "lessons": [
        {
          "title": "Foundations: Bias Detection and Mitigation — Tools, Techniques, and Audit Methodology",
          "desc": "Pre-processing (data resampling, reweighting, adversarial debiasing of training data), in-processing (fairness constraints, adversarial training), post-processing (threshold calibration per demographic group, reject option classification). IBM AI Fairness 360 toolkit (30+ fairness metrics, 9 mitigation algorithms), Google Fairness Indicators, Aequitas toolkit. The bias audit methodology: what to test, who to test, how to report. Case study: Audit a hiring algorithm for gender and race disparities."
        },
        {
          "title": "Module 3.2 Deep Dive: reweighting",
          "desc": "The bias audit methodology: what to test, who to test, how to report. Case study: Audit a hiring algorithm for gender and race disparities.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: adversarial debiasing of training data)",
          "desc": "Pre-processing (data resampling, reweighting, adversarial debiasing of training data), in-processing (fairness constraints, adversarial training), post-processing (threshold calibration per demographi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: in-processing (fairness constraints",
          "desc": "Pre-processing (data resampling, reweighting, adversarial debiasing of training data), in-processing (fairness constraints, adversarial training), post-processing (threshold calibration per demographi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: adversarial training)",
          "desc": "Pre-processing (data resampling, reweighting, adversarial debiasing of training data), in-processing (fairness constraints, adversarial training), post-processing (threshold calibration per demographi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: post-processing (threshold calibration per demographic group",
          "desc": "Pre-processing (data resampling, reweighting, adversarial debiasing of training data), in-processing (fairness constraints, adversarial training), post-processing (threshold calibration per demographi. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Bias Detection and Mitigation — Tools, Techniques, and Audit Methodology. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Pre-processing (data resampling, reweighting, adversarial debiasing of training data), in-processing (fairness constraints, adversarial training), pos"
        }
      ]
    },
    {
      "title": "Module 4: Explainability — LIME, SHAP, Counterfactuals, and Legal Requirements",
      "desc": "Model-agnostic interpretability (LIME: local surrogate models, SHAP: Shapley value attribution), SHAP deep dive (TreeSHAP for gradient boosting, DeepSHAP for neural networks, force plots, summary plots, dependence plots), counterfactual explanations (algorithmic recourse — 'what would need to change for a different decision?'), concept activation vectors for neural networks, and explainability as a legal requirement (GDPR Article 22, EU AI Act Article 13). Hands-on: Generate SHAP explanations for a credit scoring model.",
      "lessons": [
        {
          "title": "Foundations: Explainability — LIME, SHAP, Counterfactuals, and Legal Requirements",
          "desc": "Model-agnostic interpretability (LIME: local surrogate models, SHAP: Shapley value attribution), SHAP deep dive (TreeSHAP for gradient boosting, DeepSHAP for neural networks, force plots, summary plots, dependence plots), counterfactual explanations (algorithmic recourse — 'what would need to change for a different decision?'), concept activation vectors for neural networks, and explainability as a legal requirement (GDPR Article 22, EU AI Act Article 13). Hands-on: Generate SHAP explanations for a credit scoring model."
        },
        {
          "title": "Module 4.2 Deep Dive: SHAP: Shapley value attribution)",
          "desc": "Model-agnostic interpretability (LIME: local surrogate models, SHAP: Shapley value attribution), SHAP deep dive (TreeSHAP for gradient boosting, DeepSHAP for neural networks, force plots, summary plot. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: SHAP deep dive (TreeSHAP for gradient boosting",
          "desc": "Model-agnostic interpretability (LIME: local surrogate models, SHAP: Shapley value attribution), SHAP deep dive (TreeSHAP for gradient boosting, DeepSHAP for neural networks, force plots, summary plot. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: DeepSHAP for neural networks",
          "desc": "Model-agnostic interpretability (LIME: local surrogate models, SHAP: Shapley value attribution), SHAP deep dive (TreeSHAP for gradient boosting, DeepSHAP for neural networks, force plots, summary plot. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: force plots",
          "desc": "Model-agnostic interpretability (LIME: local surrogate models, SHAP: Shapley value attribution), SHAP deep dive (TreeSHAP for gradient boosting, DeepSHAP for neural networks, force plots, summary plot. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: summary plots",
          "desc": "Model-agnostic interpretability (LIME: local surrogate models, SHAP: Shapley value attribution), SHAP deep dive (TreeSHAP for gradient boosting, DeepSHAP for neural networks, force plots, summary plot. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Explainability — LIME, SHAP, Counterfactuals, and Legal Requirements. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Model-agnostic interpretability (LIME: local surrogate models, SHAP: Shapley value attribution), SHAP deep dive (TreeSHAP for gradient boosting, DeepS"
        }
      ]
    },
    {
      "title": "Module 5: Privacy-Preserving AI — DP, Federated Learning, Synthetic Data, and Unlearning",
      "desc": "Differential Privacy mathematics (ε-differential privacy, (ε,δ)-DP, the privacy-utility tradeoff at different ε values), DP-SGD implementation (Abadi et al. 2016 — per-sample gradient clipping + Gaussian noise addition), Apple's Local DP deployment (iOS 10, 1B+ users), Google RAPPOR, Federated Learning (McMahan et al. 2017) with and without DP, synthetic data generation (CTGAN, TabSyn for DP-synthetic tabular data), and GDPR machine unlearning requirements.",
      "lessons": [
        {
          "title": "Foundations: Privacy-Preserving AI — DP, Federated Learning, Synthetic Data, and Unlearning",
          "desc": "Differential Privacy mathematics (ε-differential privacy, (ε,δ)-DP, the privacy-utility tradeoff at different ε values), DP-SGD implementation (Abadi et al. 2016 — per-sample gradient clipping + Gaussian noise addition), Apple's Local DP deployment (iOS 10, 1B+ users), Google RAPPOR, Federated Learning (McMahan et al. 2017) with and without DP, synthetic data generation (CTGAN, TabSyn for DP-synthetic tabular data), and GDPR machine unlearning requirements."
        },
        {
          "title": "Module 5.2 Deep Dive: (ε",
          "desc": "2017) with and without DP, synthetic data generation (CTGAN, TabSyn for DP-synthetic tabular data), and GDPR machine unlearning requirements.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: δ)-DP",
          "desc": "Differential Privacy mathematics (ε-differential privacy, (ε,δ)-DP, the privacy-utility tradeoff at different ε values), DP-SGD implementation (Abadi et al. 2016 — per-sample gradient clipping + Gauss. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: the privacy-utility tradeoff at different ε values)",
          "desc": "Differential Privacy mathematics (ε-differential privacy, (ε,δ)-DP, the privacy-utility tradeoff at different ε values), DP-SGD implementation (Abadi et al. 2016 — per-sample gradient clipping + Gauss. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: DP-SGD implementation (Abadi et al. 2016 — per-sample gradient clipping + Gaussian noise addition)",
          "desc": "Differential Privacy mathematics (ε-differential privacy, (ε,δ)-DP, the privacy-utility tradeoff at different ε values), DP-SGD implementation (Abadi et al. 2016 — per-sample gradient clipping + Gauss. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: Apple's Local DP deployment (iOS 10",
          "desc": "Differential Privacy mathematics (ε-differential privacy, (ε,δ)-DP, the privacy-utility tradeoff at different ε values), DP-SGD implementation (Abadi et al. 2016 — per-sample gradient clipping + Gauss. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Privacy-Preserving AI — DP, Federated Learning, Synthetic Data, and Unlearning. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Differential Privacy mathematics (ε-differential privacy, (ε,δ)-DP, the privacy-utility tradeoff at different ε values), DP-SGD implementation (Abadi "
        }
      ]
    },
    {
      "title": "Module 6: Human Oversight and AI Accountability",
      "desc": "The meaningful human control spectrum (full control → advisory → collaborative → supervised autonomy → full autonomy — with EU AI Act placement for each level), designing HITL systems (approval gates, review queues, override mechanisms that are actually used), accountability structures for AI harms (the accountability gap — when everyone is responsible, no one is), and organizational structures that enable genuine human oversight at scale.",
      "lessons": [
        {
          "title": "Foundations: Human Oversight and AI Accountability",
          "desc": "The meaningful human control spectrum (full control → advisory → collaborative → supervised autonomy → full autonomy — with EU AI Act placement for each level), designing HITL systems (approval gates, review queues, override mechanisms that are actually used), accountability structures for AI harms (the accountability gap — when everyone is responsible, no one is), and organizational structures that enable genuine human oversight at scale."
        },
        {
          "title": "Module 6.2 Deep Dive: designing HITL systems (approval gates",
          "desc": "The meaningful human control spectrum (full control → advisory → collaborative → supervised autonomy → full autonomy — with EU AI Act placement for each level), designing HITL systems (approval gates,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: review queues",
          "desc": "The meaningful human control spectrum (full control → advisory → collaborative → supervised autonomy → full autonomy — with EU AI Act placement for each level), designing HITL systems (approval gates,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: override mechanisms that are actually used)",
          "desc": "The meaningful human control spectrum (full control → advisory → collaborative → supervised autonomy → full autonomy — with EU AI Act placement for each level), designing HITL systems (approval gates,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: accountability structures for AI harms (the accountability gap — when everyone is responsible",
          "desc": "The meaningful human control spectrum (full control → advisory → collaborative → supervised autonomy → full autonomy — with EU AI Act placement for each level), designing HITL systems (approval gates,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: no one is)",
          "desc": "The meaningful human control spectrum (full control → advisory → collaborative → supervised autonomy → full autonomy — with EU AI Act placement for each level), designing HITL systems (approval gates,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Human Oversight and AI Accountability. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The meaningful human control spectrum (full control → advisory → collaborative → supervised autonomy → full autonomy — with EU AI Act placement for ea"
        }
      ]
    },
    {
      "title": "Module 7: AI Impact Assessment — Algorithmic Impact Assessment Methodology",
      "desc": "AIA (Algorithmic Impact Assessment) methodology (problem framing → stakeholder mapping → impact analysis → risk assessment → mitigation planning → ongoing monitoring), multi-stakeholder impact mapping (direct users, indirectly affected parties, societal impacts), participatory design methods (including affected communities), pre-deployment AIA process, and the AIA that could have prevented Amazon's AI recruiting failure. Template: Complete AIA methodology.",
      "lessons": [
        {
          "title": "Foundations: AI Impact Assessment — Algorithmic Impact Assessment Methodology",
          "desc": "AIA (Algorithmic Impact Assessment) methodology (problem framing → stakeholder mapping → impact analysis → risk assessment → mitigation planning → ongoing monitoring), multi-stakeholder impact mapping (direct users, indirectly affected parties, societal impacts), participatory design methods (including affected communities), pre-deployment AIA process, and the AIA that could have prevented Amazon's AI recruiting failure. Template: Complete AIA methodology."
        },
        {
          "title": "Module 7.2 Deep Dive: multi-stakeholder impact mapping (direct users",
          "desc": "AIA (Algorithmic Impact Assessment) methodology (problem framing → stakeholder mapping → impact analysis → risk assessment → mitigation planning → ongoing monitoring), multi-stakeholder impact mapping. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: indirectly affected parties",
          "desc": "AIA (Algorithmic Impact Assessment) methodology (problem framing → stakeholder mapping → impact analysis → risk assessment → mitigation planning → ongoing monitoring), multi-stakeholder impact mapping. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: societal impacts)",
          "desc": "AIA (Algorithmic Impact Assessment) methodology (problem framing → stakeholder mapping → impact analysis → risk assessment → mitigation planning → ongoing monitoring), multi-stakeholder impact mapping. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: participatory design methods (including affected communities)",
          "desc": "AIA (Algorithmic Impact Assessment) methodology (problem framing → stakeholder mapping → impact analysis → risk assessment → mitigation planning → ongoing monitoring), multi-stakeholder impact mapping. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: pre-deployment AIA process",
          "desc": "AIA (Algorithmic Impact Assessment) methodology (problem framing → stakeholder mapping → impact analysis → risk assessment → mitigation planning → ongoing monitoring), multi-stakeholder impact mapping. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: AI Impact Assessment — Algorithmic Impact Assessment Methodology. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AIA (Algorithmic Impact Assessment) methodology (problem framing → stakeholder mapping → impact analysis → risk assessment → mitigation planning → ong"
        }
      ]
    },
    {
      "title": "Module 8: Responsible AI for High-Stakes Domains",
      "desc": "Healthcare AI (FDA AI/ML SaMD framework, clinical validation requirements, the diagnostic AI accountability question — who is responsible when AI causes misdiagnosis?), criminal justice AI (COMPAS controversy, pretrial risk assessment fairness, predictive policing ethics), financial AI (ECOA, Fair Housing Act, CFPB guidance, UDAAP), hiring AI (EEOC disparate impact, NYC Local Law 144 AI hiring audit requirement), and the domain-specific responsible AI requirements.",
      "lessons": [
        {
          "title": "Foundations: Responsible AI for High-Stakes Domains",
          "desc": "Healthcare AI (FDA AI/ML SaMD framework, clinical validation requirements, the diagnostic AI accountability question — who is responsible when AI causes misdiagnosis?), criminal justice AI (COMPAS controversy, pretrial risk assessment fairness, predictive policing ethics), financial AI (ECOA, Fair Housing Act, CFPB guidance, UDAAP), hiring AI (EEOC disparate impact, NYC Local Law 144 AI hiring audit requirement), and the domain-specific responsible AI requirements."
        },
        {
          "title": "Module 8.2 Deep Dive: clinical validation requirements",
          "desc": "Healthcare AI (FDA AI/ML SaMD framework, clinical validation requirements, the diagnostic AI accountability question — who is responsible when AI causes misdiagnosis?), criminal justice AI (COMPAS con. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: the diagnostic AI accountability question — who is responsible when AI causes misdiagnosis?)",
          "desc": "Healthcare AI (FDA AI/ML SaMD framework, clinical validation requirements, the diagnostic AI accountability question — who is responsible when AI causes misdiagnosis?), criminal justice AI (COMPAS con. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: criminal justice AI (COMPAS controversy",
          "desc": "Healthcare AI (FDA AI/ML SaMD framework, clinical validation requirements, the diagnostic AI accountability question — who is responsible when AI causes misdiagnosis?), criminal justice AI (COMPAS con. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: pretrial risk assessment fairness",
          "desc": "Healthcare AI (FDA AI/ML SaMD framework, clinical validation requirements, the diagnostic AI accountability question — who is responsible when AI causes misdiagnosis?), criminal justice AI (COMPAS con. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: predictive policing ethics)",
          "desc": "Healthcare AI (FDA AI/ML SaMD framework, clinical validation requirements, the diagnostic AI accountability question — who is responsible when AI causes misdiagnosis?), criminal justice AI (COMPAS con. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Responsible AI for High-Stakes Domains. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Healthcare AI (FDA AI/ML SaMD framework, clinical validation requirements, the diagnostic AI accountability question — who is responsible when AI caus"
        }
      ]
    },
    {
      "title": "Module 9: RAI Governance — Policies, Review Boards, and Culture",
      "desc": "RAI governance structure (Responsible AI Committee composition, review process, escalation path), responsible AI policy framework (prohibited use cases list, high-risk cases requiring review, standard cases), responsible AI culture (psychological safety to raise concerns, blameless post-mortems for AI failures), the DAIR (Distributed AI Research) model of distributed RAI responsibility, and metrics for RAI governance maturity.",
      "lessons": [
        {
          "title": "Foundations: RAI Governance — Policies, Review Boards, and Culture",
          "desc": "RAI governance structure (Responsible AI Committee composition, review process, escalation path), responsible AI policy framework (prohibited use cases list, high-risk cases requiring review, standard cases), responsible AI culture (psychological safety to raise concerns, blameless post-mortems for AI failures), the DAIR (Distributed AI Research) model of distributed RAI responsibility, and metrics for RAI governance maturity."
        },
        {
          "title": "Module 9.2 Deep Dive: review process",
          "desc": "RAI governance structure (Responsible AI Committee composition, review process, escalation path), responsible AI policy framework (prohibited use cases list, high-risk cases requiring review, standard. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: escalation path)",
          "desc": "RAI governance structure (Responsible AI Committee composition, review process, escalation path), responsible AI policy framework (prohibited use cases list, high-risk cases requiring review, standard. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: responsible AI policy framework (prohibited use cases list",
          "desc": "RAI governance structure (Responsible AI Committee composition, review process, escalation path), responsible AI policy framework (prohibited use cases list, high-risk cases requiring review, standard. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: high-risk cases requiring review",
          "desc": "RAI governance structure (Responsible AI Committee composition, review process, escalation path), responsible AI policy framework (prohibited use cases list, high-risk cases requiring review, standard. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: standard cases)",
          "desc": "RAI governance structure (Responsible AI Committee composition, review process, escalation path), responsible AI policy framework (prohibited use cases list, high-risk cases requiring review, standard. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: RAI Governance — Policies, Review Boards, and Culture. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. RAI governance structure (Responsible AI Committee composition, review process, escalation path), responsible AI policy framework (prohibited use case"
        }
      ]
    },
    {
      "title": "Module 10: Building the Responsible AI Practice and Capstone",
      "desc": "Embedding RAI in the development lifecycle (design → development → testing → deployment → monitoring — RAI checkpoints at each gate), the RAI tooling survey (TensorFlow Responsible AI Toolkit, Microsoft Responsible AI Toolbox, IBM OpenScale), building the RAI function in an organization, RAI career paths, and the capstone: conduct a complete responsible AI assessment for a provided AI system — bias audit, explainability analysis, impact assessment, and governance recommendations.",
      "lessons": [
        {
          "title": "Foundations: Building the Responsible AI Practice and Capstone",
          "desc": "Embedding RAI in the development lifecycle (design → development → testing → deployment → monitoring — RAI checkpoints at each gate), the RAI tooling survey (TensorFlow Responsible AI Toolkit, Microsoft Responsible AI Toolbox, IBM OpenScale), building the RAI function in an organization, RAI career paths, and the capstone: conduct a complete responsible AI assessment for a provided AI system — bias audit, explainability analysis, impact assessment, and governance recommendations."
        },
        {
          "title": "Module 10.2 Deep Dive: the RAI tooling survey (TensorFlow Responsible AI Toolkit",
          "desc": "Embedding RAI in the development lifecycle (design → development → testing → deployment → monitoring — RAI checkpoints at each gate), the RAI tooling survey (TensorFlow Responsible AI Toolkit, Microso. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: Microsoft Responsible AI Toolbox",
          "desc": "Embedding RAI in the development lifecycle (design → development → testing → deployment → monitoring — RAI checkpoints at each gate), the RAI tooling survey (TensorFlow Responsible AI Toolkit, Microso. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: IBM OpenScale)",
          "desc": "Embedding RAI in the development lifecycle (design → development → testing → deployment → monitoring — RAI checkpoints at each gate), the RAI tooling survey (TensorFlow Responsible AI Toolkit, Microso. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: building the RAI function in an organization",
          "desc": "Embedding RAI in the development lifecycle (design → development → testing → deployment → monitoring — RAI checkpoints at each gate), the RAI tooling survey (TensorFlow Responsible AI Toolkit, Microso. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: RAI career paths",
          "desc": "Embedding RAI in the development lifecycle (design → development → testing → deployment → monitoring — RAI checkpoints at each gate), the RAI tooling survey (TensorFlow Responsible AI Toolkit, Microso. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Building the Responsible AI Practice and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Embedding RAI in the development lifecycle (design → development → testing → deployment → monitoring — RAI checkpoints at each gate), the RAI tooling "
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
