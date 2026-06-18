import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/adminGuard.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Auditor",
  "description": "Master AI audit methodology — from planning through execution, reporting, and the emerging profession of AI audit that regulators increasingly require. 10 modules covering IIA standards for AI, technical audit techniques, bias auditing, algorithmic accountability, and enterprise AI audit programs.",
  "translations": {
    "es": {
      "title": "AI Auditor",
      "description": "Master AI audit methodology — from planning through execution, reporting, and the emerging profession of AI audit that regulators increasingly require. 10 modules covering IIA standards for AI, techni"
    },
    "fr": {
      "title": "AI Auditor",
      "description": "Master AI audit methodology — from planning through execution, reporting, and the emerging profession of AI audit that regulators increasingly require. 10 modules covering IIA standards for AI, techni"
    },
    "de": {
      "title": "AI Auditor",
      "description": "Master AI audit methodology — from planning through execution, reporting, and the emerging profession of AI audit that regulators increasingly require. 10 modules covering IIA standards for AI, techni"
    },
    "zh": {
      "title": "AI Auditor",
      "description": "Master AI audit methodology — from planning through execution, reporting, and the emerging profession of AI audit that regulators increasingly require. 10 modules covering IIA standards for AI, techni"
    },
    "ar": {
      "title": "AI Auditor",
      "description": "Master AI audit methodology — from planning through execution, reporting, and the emerging profession of AI audit that regulators increasingly require. 10 modules covering IIA standards for AI, techni"
    },
    "ja": {
      "title": "AI Auditor",
      "description": "Master AI audit methodology — from planning through execution, reporting, and the emerging profession of AI audit that regulators increasingly require. 10 modules covering IIA standards for AI, techni"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Audit Foundations — Standards, Frameworks, and Professional Standards",
      "desc": "IIA (Institute of Internal Auditors) International Standards applied to AI audit, ISACA COBIT 2019 for AI governance audit, the AI auditor's professional requirements (independence, objectivity, professional skepticism, technical competence), the AI audit universe (all AI systems in scope for internal audit), how AI audit differs from traditional IT audit (probabilistic systems, model drift, algorithmic accountability), and the Big Four AI audit practices. AI auditor certification landscape.",
      "lessons": [
        {
          "title": "Foundations: AI Audit Foundations — Standards, Frameworks, and Professional Standards",
          "desc": "IIA (Institute of Internal Auditors) International Standards applied to AI audit, ISACA COBIT 2019 for AI governance audit, the AI auditor's professional requirements (independence, objectivity, professional skepticism, technical competence), the AI audit universe (all AI systems in scope for internal audit), how AI audit differs from traditional IT audit (probabilistic systems, model drift, algorithmic accountability), and the Big Four AI audit practices. AI auditor certification landscape."
        },
        {
          "title": "Module 1.2 Deep Dive: ISACA COBIT 2019 for AI governance audit",
          "desc": "IIA (Institute of Internal Auditors) International Standards applied to AI audit, ISACA COBIT 2019 for AI governance audit, the AI auditor's professional requirements (independence, objectivity, profe. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: the AI auditor's professional requirements (independence",
          "desc": "IIA (Institute of Internal Auditors) International Standards applied to AI audit, ISACA COBIT 2019 for AI governance audit, the AI auditor's professional requirements (independence, objectivity, profe. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: objectivity",
          "desc": "IIA (Institute of Internal Auditors) International Standards applied to AI audit, ISACA COBIT 2019 for AI governance audit, the AI auditor's professional requirements (independence, objectivity, profe. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: professional skepticism",
          "desc": "IIA (Institute of Internal Auditors) International Standards applied to AI audit, ISACA COBIT 2019 for AI governance audit, the AI auditor's professional requirements (independence, objectivity, profe. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: technical competence)",
          "desc": "IIA (Institute of Internal Auditors) International Standards applied to AI audit, ISACA COBIT 2019 for AI governance audit, the AI auditor's professional requirements (independence, objectivity, profe. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Audit Foundations — Standards, Frameworks, and Professional Standards. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. IIA (Institute of Internal Auditors) International Standards applied to AI audit, ISACA COBIT 2019 for AI governance audit, the AI auditor's professio"
        }
      ]
    },
    {
      "title": "Module 2: AI Audit Risk Assessment and Annual Planning",
      "desc": "AI-specific audit risk factors (algorithmic bias risk: HIGH for customer-facing decisions; model instability risk: MEDIUM for regularly retrained models; regulatory compliance risk: HIGH for EU AI Act high-risk systems; vendor dependency risk: MEDIUM for third-party AI), the AI audit risk assessment matrix, integrating AI audit into the annual internal audit plan, resource planning for AI audits (technical skills required vs. available), and the AI audit universe coverage strategy.",
      "lessons": [
        {
          "title": "Foundations: AI Audit Risk Assessment and Annual Planning",
          "desc": "AI-specific audit risk factors (algorithmic bias risk: HIGH for customer-facing decisions; model instability risk: MEDIUM for regularly retrained models; regulatory compliance risk: HIGH for EU AI Act high-risk systems; vendor dependency risk: MEDIUM for third-party AI), the AI audit risk assessment matrix, integrating AI audit into the annual internal audit plan, resource planning for AI audits (technical skills required vs. available), and the AI audit universe coverage strategy."
        },
        {
          "title": "Module 2.2 Deep Dive: the AI audit risk assessment matrix",
          "desc": "AI-specific audit risk factors (algorithmic bias risk: HIGH for customer-facing decisions; model instability risk: MEDIUM for regularly retrained models; regulatory compliance risk: HIGH for EU AI Act. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: integrating AI audit into the annual internal audit plan",
          "desc": "AI-specific audit risk factors (algorithmic bias risk: HIGH for customer-facing decisions; model instability risk: MEDIUM for regularly retrained models; regulatory compliance risk: HIGH for EU AI Act. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: resource planning for AI audits (technical skills required vs. available)",
          "desc": "AI-specific audit risk factors (algorithmic bias risk: HIGH for customer-facing decisions; model instability risk: MEDIUM for regularly retrained models; regulatory compliance risk: HIGH for EU AI Act. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: and the AI audit universe coverage strategy.",
          "desc": "AI-specific audit risk factors (algorithmic bias risk: HIGH for customer-facing decisions; model instability risk: MEDIUM for regularly retrained models; regulatory compliance risk: HIGH for EU AI Act. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: AI-specific audit risk factors (algorithmic bias risk: HIGH",
          "desc": "AI-specific audit risk factors (algorithmic bias risk: HIGH for customer-facing decisions; model instability risk: MEDIUM for regularly retrained models; regulatory compliance risk: HIGH for EU AI Act. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: AI Audit Risk Assessment and Annual Planning. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI-specific audit risk factors (algorithmic bias risk: HIGH for customer-facing decisions; model instability risk: MEDIUM for regularly retrained mode"
        }
      ]
    },
    {
      "title": "Module 3: Data Audit — Quality, Integrity, Lineage, and Governance",
      "desc": "Data quality audit methodology (sampling strategy for large AI training datasets, DAMA-DMBOK quality dimensions testing), data lineage audit (tracing data from source systems through preprocessing transformations to training datasets — is the lineage documented and accurate?), data governance audit (is policy adherence happening?), access controls audit for training data (who can modify training data?), and detecting data manipulation or poisoning. The audit evidence standards for data findings.",
      "lessons": [
        {
          "title": "Foundations: Data Audit — Quality, Integrity, Lineage, and Governance",
          "desc": "Data quality audit methodology (sampling strategy for large AI training datasets, DAMA-DMBOK quality dimensions testing), data lineage audit (tracing data from source systems through preprocessing transformations to training datasets — is the lineage documented and accurate?), data governance audit (is policy adherence happening?), access controls audit for training data (who can modify training data?), and detecting data manipulation or poisoning. The audit evidence standards for data findings."
        },
        {
          "title": "Module 3.2 Deep Dive: DAMA-DMBOK quality dimensions testing)",
          "desc": "Data quality audit methodology (sampling strategy for large AI training datasets, DAMA-DMBOK quality dimensions testing), data lineage audit (tracing data from source systems through preprocessing tra. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: data lineage audit (tracing data from source systems through preprocessing transformations to training datasets — is the lineage documented and accurate?)",
          "desc": "Data quality audit methodology (sampling strategy for large AI training datasets, DAMA-DMBOK quality dimensions testing), data lineage audit (tracing data from source systems through preprocessing tra. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: data governance audit (is policy adherence happening?)",
          "desc": "Data quality audit methodology (sampling strategy for large AI training datasets, DAMA-DMBOK quality dimensions testing), data lineage audit (tracing data from source systems through preprocessing tra. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: access controls audit for training data (who can modify training data?)",
          "desc": "Data quality audit methodology (sampling strategy for large AI training datasets, DAMA-DMBOK quality dimensions testing), data lineage audit (tracing data from source systems through preprocessing tra. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: and detecting data manipulation or poisoning. The audit evidence standards for data findings.",
          "desc": "Data quality audit methodology (sampling strategy for large AI training datasets, DAMA-DMBOK quality dimensions testing), data lineage audit (tracing data from source systems through preprocessing tra. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Data Audit — Quality, Integrity, Lineage, and Governance. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Data quality audit methodology (sampling strategy for large AI training datasets, DAMA-DMBOK quality dimensions testing), data lineage audit (tracing "
        }
      ]
    },
    {
      "title": "Module 4: Model Development Audit — Process, Documentation, and Independent Validation",
      "desc": "Auditing the model development lifecycle against documented standards (requirements → design → development → testing → independent validation → approval → deployment), model documentation audit (is the model card complete, accurate, and current?), independent validation audit (is validation truly independent? was the validator involved in development?), hyperparameter selection audit (is the selection process disciplined and documented?), and the model development audit program with testing procedures.",
      "lessons": [
        {
          "title": "Foundations: Model Development Audit — Process, Documentation, and Independent Validation",
          "desc": "Auditing the model development lifecycle against documented standards (requirements → design → development → testing → independent validation → approval → deployment), model documentation audit (is the model card complete, accurate, and current?), independent validation audit (is validation truly independent? was the validator involved in development?), hyperparameter selection audit (is the selection process disciplined and documented?), and the model development audit program with testing procedures."
        },
        {
          "title": "Module 4.2 Deep Dive: model documentation audit (is the model card complete",
          "desc": "Auditing the model development lifecycle against documented standards (requirements → design → development → testing → independent validation → approval → deployment), model documentation audit (is th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: accurate",
          "desc": "Auditing the model development lifecycle against documented standards (requirements → design → development → testing → independent validation → approval → deployment), model documentation audit (is th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: and current?)",
          "desc": "Auditing the model development lifecycle against documented standards (requirements → design → development → testing → independent validation → approval → deployment), model documentation audit (is th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: independent validation audit (is validation truly independent? was the validator involved in development?)",
          "desc": "Auditing the model development lifecycle against documented standards (requirements → design → development → testing → independent validation → approval → deployment), model documentation audit (is th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: hyperparameter selection audit (is the selection process disciplined and documented?)",
          "desc": "Auditing the model development lifecycle against documented standards (requirements → design → development → testing → independent validation → approval → deployment), model documentation audit (is th. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Model Development Audit — Process, Documentation, and Independent Validation. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Auditing the model development lifecycle against documented standards (requirements → design → development → testing → independent validation → approv"
        }
      ]
    },
    {
      "title": "Module 5: Algorithmic Bias and Fairness Audit — Technical Methodology",
      "desc": "Bias audit scope definition (which protected classes, which metrics, which population segments), audit sampling strategy for bias testing (representative sample selection, minimum sample sizes for statistical validity), technical bias testing methodology (adverse impact ratio calculation, z-test for proportional difference, chi-square test for independence, SHAP-based explanation bias), intersectionality testing, and documenting bias audit findings for regulatory submission. Hands-on: Conduct a bias audit with Python, aif360, and Aequitas.",
      "lessons": [
        {
          "title": "Foundations: Algorithmic Bias and Fairness Audit — Technical Methodology",
          "desc": "Bias audit scope definition (which protected classes, which metrics, which population segments), audit sampling strategy for bias testing (representative sample selection, minimum sample sizes for statistical validity), technical bias testing methodology (adverse impact ratio calculation, z-test for proportional difference, chi-square test for independence, SHAP-based explanation bias), intersectionality testing, and documenting bias audit findings for regulatory submission. Hands-on: Conduct a bias audit with Python, aif360, and Aequitas."
        },
        {
          "title": "Module 5.2 Deep Dive: which metrics",
          "desc": "Bias audit scope definition (which protected classes, which metrics, which population segments), audit sampling strategy for bias testing (representative sample selection, minimum sample sizes for sta. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: which population segments)",
          "desc": "Bias audit scope definition (which protected classes, which metrics, which population segments), audit sampling strategy for bias testing (representative sample selection, minimum sample sizes for sta. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: audit sampling strategy for bias testing (representative sample selection",
          "desc": "Bias audit scope definition (which protected classes, which metrics, which population segments), audit sampling strategy for bias testing (representative sample selection, minimum sample sizes for sta. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: minimum sample sizes for statistical validity)",
          "desc": "Bias audit scope definition (which protected classes, which metrics, which population segments), audit sampling strategy for bias testing (representative sample selection, minimum sample sizes for sta. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: technical bias testing methodology (adverse impact ratio calculation",
          "desc": "Bias audit scope definition (which protected classes, which metrics, which population segments), audit sampling strategy for bias testing (representative sample selection, minimum sample sizes for sta. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Algorithmic Bias and Fairness Audit — Technical Methodology. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Bias audit scope definition (which protected classes, which metrics, which population segments), audit sampling strategy for bias testing (representat"
        }
      ]
    },
    {
      "title": "Module 6: AI Security and Robustness Audit",
      "desc": "Auditing AI security controls (access controls to model artifacts, API authentication and authorization, model encryption), adversarial robustness audit (does the organization test models against adversarial inputs? are results documented?), prompt injection vulnerability assessment for LLM applications (is the application tested against OWASP LLM Top 10?), data poisoning risk audit (is training data provenance documented and protected?), and the AI security audit program.",
      "lessons": [
        {
          "title": "Foundations: AI Security and Robustness Audit",
          "desc": "Auditing AI security controls (access controls to model artifacts, API authentication and authorization, model encryption), adversarial robustness audit (does the organization test models against adversarial inputs? are results documented?), prompt injection vulnerability assessment for LLM applications (is the application tested against OWASP LLM Top 10?), data poisoning risk audit (is training data provenance documented and protected?), and the AI security audit program."
        },
        {
          "title": "Module 6.2 Deep Dive: API authentication and authorization",
          "desc": "Auditing AI security controls (access controls to model artifacts, API authentication and authorization, model encryption), adversarial robustness audit (does the organization test models against adve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: model encryption)",
          "desc": "Auditing AI security controls (access controls to model artifacts, API authentication and authorization, model encryption), adversarial robustness audit (does the organization test models against adve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: adversarial robustness audit (does the organization test models against adversarial inputs? are results documented?)",
          "desc": "Auditing AI security controls (access controls to model artifacts, API authentication and authorization, model encryption), adversarial robustness audit (does the organization test models against adve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: prompt injection vulnerability assessment for LLM applications (is the application tested against OWASP LLM Top 10?)",
          "desc": "Auditing AI security controls (access controls to model artifacts, API authentication and authorization, model encryption), adversarial robustness audit (does the organization test models against adve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: data poisoning risk audit (is training data provenance documented and protected?)",
          "desc": "Auditing AI security controls (access controls to model artifacts, API authentication and authorization, model encryption), adversarial robustness audit (does the organization test models against adve. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: AI Security and Robustness Audit. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Auditing AI security controls (access controls to model artifacts, API authentication and authorization, model encryption), adversarial robustness aud"
        }
      ]
    },
    {
      "title": "Module 7: AI Operations and Monitoring Audit",
      "desc": "Auditing AI monitoring controls (is model performance monitored in production? are drift thresholds defined and tested?), alerting and escalation audit (do monitoring alerts reach the right people? are response times documented?), incident response audit (are AI incidents detected, documented, investigated, and remediated within defined SLAs?), change management audit for AI models (is every model update in production documented, reviewed, and approved?), and the operations audit program.",
      "lessons": [
        {
          "title": "Foundations: AI Operations and Monitoring Audit",
          "desc": "Auditing AI monitoring controls (is model performance monitored in production? are drift thresholds defined and tested?), alerting and escalation audit (do monitoring alerts reach the right people? are response times documented?), incident response audit (are AI incidents detected, documented, investigated, and remediated within defined SLAs?), change management audit for AI models (is every model update in production documented, reviewed, and approved?), and the operations audit program."
        },
        {
          "title": "Module 7.2 Deep Dive: alerting and escalation audit (do monitoring alerts reach the right people? are response times documented?)",
          "desc": "Auditing AI monitoring controls (is model performance monitored in production? are drift thresholds defined and tested?), alerting and escalation audit (do monitoring alerts reach the right people? ar. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: incident response audit (are AI incidents detected",
          "desc": "Auditing AI monitoring controls (is model performance monitored in production? are drift thresholds defined and tested?), alerting and escalation audit (do monitoring alerts reach the right people? ar. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: documented",
          "desc": "Auditing AI monitoring controls (is model performance monitored in production? are drift thresholds defined and tested?), alerting and escalation audit (do monitoring alerts reach the right people? ar. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: investigated",
          "desc": "Auditing AI monitoring controls (is model performance monitored in production? are drift thresholds defined and tested?), alerting and escalation audit (do monitoring alerts reach the right people? ar. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: and remediated within defined SLAs?)",
          "desc": "Auditing AI monitoring controls (is model performance monitored in production? are drift thresholds defined and tested?), alerting and escalation audit (do monitoring alerts reach the right people? ar. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: AI Operations and Monitoring Audit. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Auditing AI monitoring controls (is model performance monitored in production? are drift thresholds defined and tested?), alerting and escalation audi"
        }
      ]
    },
    {
      "title": "Module 8: Regulatory Compliance Audit for AI",
      "desc": "EU AI Act compliance audit methodology (conformity assessment review for high-risk AI, technical documentation completeness assessment, human oversight implementation testing), GDPR Article 22 compliance audit (automated decision rights implementation), sector-specific AI compliance audits (FDA SaMD: predetermined change control plan audit; SR 11-7 model risk: independent validation audit; NYC Local Law 144: bias audit documentation review), and the evidence standards for regulatory compliance audit findings.",
      "lessons": [
        {
          "title": "Foundations: Regulatory Compliance Audit for AI",
          "desc": "EU AI Act compliance audit methodology (conformity assessment review for high-risk AI, technical documentation completeness assessment, human oversight implementation testing), GDPR Article 22 compliance audit (automated decision rights implementation), sector-specific AI compliance audits (FDA SaMD: predetermined change control plan audit; SR 11-7 model risk: independent validation audit; NYC Local Law 144: bias audit documentation review), and the evidence standards for regulatory compliance audit findings."
        },
        {
          "title": "Module 8.2 Deep Dive: technical documentation completeness assessment",
          "desc": "EU AI Act compliance audit methodology (conformity assessment review for high-risk AI, technical documentation completeness assessment, human oversight implementation testing), GDPR Article 22 complia. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: human oversight implementation testing)",
          "desc": "EU AI Act compliance audit methodology (conformity assessment review for high-risk AI, technical documentation completeness assessment, human oversight implementation testing), GDPR Article 22 complia. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: GDPR Article 22 compliance audit (automated decision rights implementation)",
          "desc": "EU AI Act compliance audit methodology (conformity assessment review for high-risk AI, technical documentation completeness assessment, human oversight implementation testing), GDPR Article 22 complia. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: sector-specific AI compliance audits (FDA SaMD: predetermined change control plan audit; SR 11-7 model risk: independent validation audit; NYC Local Law 144: bias audit documentation review)",
          "desc": "EU AI Act compliance audit methodology (conformity assessment review for high-risk AI, technical documentation completeness assessment, human oversight implementation testing), GDPR Article 22 complia. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: and the evidence standards for regulatory compliance audit findings.",
          "desc": "EU AI Act compliance audit methodology (conformity assessment review for high-risk AI, technical documentation completeness assessment, human oversight implementation testing), GDPR Article 22 complia. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Regulatory Compliance Audit for AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. EU AI Act compliance audit methodology (conformity assessment review for high-risk AI, technical documentation completeness assessment, human oversigh"
        }
      ]
    },
    {
      "title": "Module 9: AI Audit Reporting and Stakeholder Communication",
      "desc": "AI audit finding documentation standards (condition, criteria, cause, effect — the 4Cs of audit findings), finding severity rating for AI (Critical: active harm being caused; High: significant risk of harm; Medium: control gap; Low: improvement opportunity; Informational: advisory), evidence quality standards for AI findings (evidence from automated tests vs. interviews vs. documentation review), management response review, action plan adequacy assessment, and presenting AI audit results to boards and regulators. Template: AI audit report structure.",
      "lessons": [
        {
          "title": "Foundations: AI Audit Reporting and Stakeholder Communication",
          "desc": "AI audit finding documentation standards (condition, criteria, cause, effect — the 4Cs of audit findings), finding severity rating for AI (Critical: active harm being caused; High: significant risk of harm; Medium: control gap; Low: improvement opportunity; Informational: advisory), evidence quality standards for AI findings (evidence from automated tests vs. interviews vs. documentation review), management response review, action plan adequacy assessment, and presenting AI audit results to boards and regulators. Template: AI audit report structure."
        },
        {
          "title": "Module 9.2 Deep Dive: criteria",
          "desc": "Template: AI audit report structure.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: cause",
          "desc": "AI audit finding documentation standards (condition, criteria, cause, effect — the 4Cs of audit findings), finding severity rating for AI (Critical: active harm being caused; High: significant risk of. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: effect — the 4Cs of audit findings)",
          "desc": "AI audit finding documentation standards (condition, criteria, cause, effect — the 4Cs of audit findings), finding severity rating for AI (Critical: active harm being caused; High: significant risk of. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: finding severity rating for AI (Critical: active harm being caused; High: significant risk of harm; Medium: control gap; Low: improvement opportunity; Informational: advisory)",
          "desc": "AI audit finding documentation standards (condition, criteria, cause, effect — the 4Cs of audit findings), finding severity rating for AI (Critical: active harm being caused; High: significant risk of. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: evidence quality standards for AI findings (evidence from automated tests vs. interviews vs. documentation review)",
          "desc": "AI audit finding documentation standards (condition, criteria, cause, effect — the 4Cs of audit findings), finding severity rating for AI (Critical: active harm being caused; High: significant risk of. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: AI Audit Reporting and Stakeholder Communication. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI audit finding documentation standards (condition, criteria, cause, effect — the 4Cs of audit findings), finding severity rating for AI (Critical: a"
        }
      ]
    },
    {
      "title": "Module 10: Building the AI Audit Practice and Capstone",
      "desc": "Transforming internal audit for AI (skills gap analysis, co-sourcing strategy for technical expertise, AI audit tools — AuditBoard, Galvanize with AI modules), the external AI audit market (regulatory-required audits in the EU AI Act era), the AI auditor career path (IT Auditor → AI Auditor → Senior AI Auditor → Director of AI Audit), and the capstone: conduct a complete AI audit — audit plan, fieldwork execution (bias audit, operations audit, compliance audit), evidence documentation, findings, and formal audit report.",
      "lessons": [
        {
          "title": "Foundations: Building the AI Audit Practice and Capstone",
          "desc": "Transforming internal audit for AI (skills gap analysis, co-sourcing strategy for technical expertise, AI audit tools — AuditBoard, Galvanize with AI modules), the external AI audit market (regulatory-required audits in the EU AI Act era), the AI auditor career path (IT Auditor → AI Auditor → Senior AI Auditor → Director of AI Audit), and the capstone: conduct a complete AI audit — audit plan, fieldwork execution (bias audit, operations audit, compliance audit), evidence documentation, findings, and formal audit report."
        },
        {
          "title": "Module 10.2 Deep Dive: co-sourcing strategy for technical expertise",
          "desc": "Transforming internal audit for AI (skills gap analysis, co-sourcing strategy for technical expertise, AI audit tools — AuditBoard, Galvanize with AI modules), the external AI audit market (regulatory. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: AI audit tools — AuditBoard",
          "desc": "Transforming internal audit for AI (skills gap analysis, co-sourcing strategy for technical expertise, AI audit tools — AuditBoard, Galvanize with AI modules), the external AI audit market (regulatory. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: Galvanize with AI modules)",
          "desc": "Transforming internal audit for AI (skills gap analysis, co-sourcing strategy for technical expertise, AI audit tools — AuditBoard, Galvanize with AI modules), the external AI audit market (regulatory. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: the external AI audit market (regulatory-required audits in the EU AI Act era)",
          "desc": "Transforming internal audit for AI (skills gap analysis, co-sourcing strategy for technical expertise, AI audit tools — AuditBoard, Galvanize with AI modules), the external AI audit market (regulatory. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: the AI auditor career path (IT Auditor → AI Auditor → Senior AI Auditor → Director of AI Audit)",
          "desc": "Transforming internal audit for AI (skills gap analysis, co-sourcing strategy for technical expertise, AI audit tools — AuditBoard, Galvanize with AI modules), the external AI audit market (regulatory. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Building the AI Audit Practice and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Transforming internal audit for AI (skills gap analysis, co-sourcing strategy for technical expertise, AI audit tools — AuditBoard, Galvanize with AI "
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
