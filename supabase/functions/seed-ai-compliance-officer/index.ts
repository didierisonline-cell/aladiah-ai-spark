import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/adminGuard.ts";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Compliance Officer",
  "description": "Master AI compliance across the global regulatory landscape — EU AI Act, US executive orders, sector-specific regulations, ISO 42001, and building compliance programs that protect organizations while enabling responsible AI innovation. 10 modules covering the complete AI compliance curriculum.",
  "translations": {
    "es": {
      "title": "AI Compliance Officer",
      "description": "Master AI compliance across the global regulatory landscape — EU AI Act, US executive orders, sector-specific regulations, ISO 42001, and building compliance programs that protect organizations while "
    },
    "fr": {
      "title": "AI Compliance Officer",
      "description": "Master AI compliance across the global regulatory landscape — EU AI Act, US executive orders, sector-specific regulations, ISO 42001, and building compliance programs that protect organizations while "
    },
    "de": {
      "title": "AI Compliance Officer",
      "description": "Master AI compliance across the global regulatory landscape — EU AI Act, US executive orders, sector-specific regulations, ISO 42001, and building compliance programs that protect organizations while "
    },
    "zh": {
      "title": "AI Compliance Officer",
      "description": "Master AI compliance across the global regulatory landscape — EU AI Act, US executive orders, sector-specific regulations, ISO 42001, and building compliance programs that protect organizations while "
    },
    "ar": {
      "title": "AI Compliance Officer",
      "description": "Master AI compliance across the global regulatory landscape — EU AI Act, US executive orders, sector-specific regulations, ISO 42001, and building compliance programs that protect organizations while "
    },
    "ja": {
      "title": "AI Compliance Officer",
      "description": "Master AI compliance across the global regulatory landscape — EU AI Act, US executive orders, sector-specific regulations, ISO 42001, and building compliance programs that protect organizations while "
    }
  },
  "modules": [
    {
      "title": "Module 1: The Global AI Regulatory Landscape — The Race to Regulate AI",
      "desc": "EU AI Act (world's first comprehensive AI law, effective August 2024 — obligations phasing in through 2027), US Executive Order 14110 on Safe, Secure, and Trustworthy AI (reporting requirements, red-teaming mandates), UK's pro-innovation AI regulation approach, China's generative AI regulations and algorithmic recommendation rules, India's emerging AI governance framework, and G7 Hiroshima AI Process. The compliance officer's global regulatory map.",
      "lessons": [
        {
          "title": "Foundations: The Global AI Regulatory Landscape — The Race to Regulate AI",
          "desc": "EU AI Act (world's first comprehensive AI law, effective August 2024 — obligations phasing in through 2027), US Executive Order 14110 on Safe, Secure, and Trustworthy AI (reporting requirements, red-teaming mandates), UK's pro-innovation AI regulation approach, China's generative AI regulations and algorithmic recommendation rules, India's emerging AI governance framework, and G7 Hiroshima AI Process. The compliance officer's global regulatory map."
        },
        {
          "title": "Module 1.2 Deep Dive: effective August 2024 — obligations phasing in through 2027)",
          "desc": "EU AI Act (world's first comprehensive AI law, effective August 2024 — obligations phasing in through 2027), US Executive Order 14110 on Safe, Secure, and Trustworthy AI (reporting requirements, red-t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: US Executive Order 14110 on Safe",
          "desc": "EU AI Act (world's first comprehensive AI law, effective August 2024 — obligations phasing in through 2027), US Executive Order 14110 on Safe, Secure, and Trustworthy AI (reporting requirements, red-t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: Secure",
          "desc": "EU AI Act (world's first comprehensive AI law, effective August 2024 — obligations phasing in through 2027), US Executive Order 14110 on Safe, Secure, and Trustworthy AI (reporting requirements, red-t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: and Trustworthy AI (reporting requirements",
          "desc": "EU AI Act (world's first comprehensive AI law, effective August 2024 — obligations phasing in through 2027), US Executive Order 14110 on Safe, Secure, and Trustworthy AI (reporting requirements, red-t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: red-teaming mandates)",
          "desc": "EU AI Act (world's first comprehensive AI law, effective August 2024 — obligations phasing in through 2027), US Executive Order 14110 on Safe, Secure, and Trustworthy AI (reporting requirements, red-t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: The Global AI Regulatory Landscape — The Race to Regulate AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. EU AI Act (world's first comprehensive AI law, effective August 2024 — obligations phasing in through 2027), US Executive Order 14110 on Safe, Secure,"
        }
      ]
    },
    {
      "title": "Module 2: EU AI Act Deep Dive — Risk Tiers, Obligations, Penalties, and Timeline",
      "desc": "EU AI Act risk classification (unacceptable risk: 8 prohibited practices, high-risk: Annex III categories + Annex II regulated products, limited risk: transparency obligations, minimal risk: no obligation), high-risk AI obligations deep dive (conformity assessment, technical documentation requirements, human oversight measures, accuracy and robustness, data governance), GPAI model rules (general-purpose AI, systemic risk threshold), and penalties (€35M or 7% global revenue). Compliance timeline: 2024-2027 phased implementation.",
      "lessons": [
        {
          "title": "Foundations: EU AI Act Deep Dive — Risk Tiers, Obligations, Penalties, and Timeline",
          "desc": "EU AI Act risk classification (unacceptable risk: 8 prohibited practices, high-risk: Annex III categories + Annex II regulated products, limited risk: transparency obligations, minimal risk: no obligation), high-risk AI obligations deep dive (conformity assessment, technical documentation requirements, human oversight measures, accuracy and robustness, data governance), GPAI model rules (general-purpose AI, systemic risk threshold), and penalties (€35M or 7% global revenue). Compliance timeline: 2024-2027 phased implementation."
        },
        {
          "title": "Module 2.2 Deep Dive: high-risk: Annex III categories + Annex II regulated products",
          "desc": "EU AI Act risk classification (unacceptable risk: 8 prohibited practices, high-risk: Annex III categories + Annex II regulated products, limited risk: transparency obligations, minimal risk: no obliga. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: limited risk: transparency obligations",
          "desc": "EU AI Act risk classification (unacceptable risk: 8 prohibited practices, high-risk: Annex III categories + Annex II regulated products, limited risk: transparency obligations, minimal risk: no obliga. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: minimal risk: no obligation)",
          "desc": "EU AI Act risk classification (unacceptable risk: 8 prohibited practices, high-risk: Annex III categories + Annex II regulated products, limited risk: transparency obligations, minimal risk: no obliga. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: high-risk AI obligations deep dive (conformity assessment",
          "desc": "EU AI Act risk classification (unacceptable risk: 8 prohibited practices, high-risk: Annex III categories + Annex II regulated products, limited risk: transparency obligations, minimal risk: no obliga. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: technical documentation requirements",
          "desc": "EU AI Act risk classification (unacceptable risk: 8 prohibited practices, high-risk: Annex III categories + Annex II regulated products, limited risk: transparency obligations, minimal risk: no obliga. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: EU AI Act Deep Dive — Risk Tiers, Obligations, Penalties, and Timeline. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. EU AI Act risk classification (unacceptable risk: 8 prohibited practices, high-risk: Annex III categories + Annex II regulated products, limited risk:"
        }
      ]
    },
    {
      "title": "Module 3: Data Privacy Compliance for AI — GDPR Article 22, CCPA, and Global Privacy",
      "desc": "GDPR's comprehensive impact on AI (Article 22 automated decision rights — when explanation is required, when human review is required, when it's prohibited altogether; Article 5 purpose limitation for training data; Article 17 right to erasure — machine unlearning requirements; Article 35 DPIA for AI), CCPA/CPRA opt-out rights for AI profiling, Brazil LGPD, India PDPB, and the global AI privacy compliance program. DPIA template for AI systems.",
      "lessons": [
        {
          "title": "Foundations: Data Privacy Compliance for AI — GDPR Article 22, CCPA, and Global Privacy",
          "desc": "GDPR's comprehensive impact on AI (Article 22 automated decision rights — when explanation is required, when human review is required, when it's prohibited altogether; Article 5 purpose limitation for training data; Article 17 right to erasure — machine unlearning requirements; Article 35 DPIA for AI), CCPA/CPRA opt-out rights for AI profiling, Brazil LGPD, India PDPB, and the global AI privacy compliance program. DPIA template for AI systems."
        },
        {
          "title": "Module 3.2 Deep Dive: when human review is required",
          "desc": "GDPR's comprehensive impact on AI (Article 22 automated decision rights — when explanation is required, when human review is required, when it's prohibited altogether; Article 5 purpose limitation for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: when it's prohibited altogether; Article 5 purpose limitation for training data; Article 17 right to erasure — machine unlearning requirements; Article 35 DPIA for AI)",
          "desc": "GDPR's comprehensive impact on AI (Article 22 automated decision rights — when explanation is required, when human review is required, when it's prohibited altogether; Article 5 purpose limitation for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: CCPA/CPRA opt-out rights for AI profiling",
          "desc": "GDPR's comprehensive impact on AI (Article 22 automated decision rights — when explanation is required, when human review is required, when it's prohibited altogether; Article 5 purpose limitation for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: Brazil LGPD",
          "desc": "GDPR's comprehensive impact on AI (Article 22 automated decision rights — when explanation is required, when human review is required, when it's prohibited altogether; Article 5 purpose limitation for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: India PDPB",
          "desc": "GDPR's comprehensive impact on AI (Article 22 automated decision rights — when explanation is required, when human review is required, when it's prohibited altogether; Article 5 purpose limitation for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: Data Privacy Compliance for AI — GDPR Article 22, CCPA, and Global Privacy. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. GDPR's comprehensive impact on AI (Article 22 automated decision rights — when explanation is required, when human review is required, when it's prohi"
        }
      ]
    },
    {
      "title": "Module 4: Financial Services AI Compliance — OCC, CFPB, SEC, and Fair Lending",
      "desc": "Federal Reserve / OCC SR 11-7 model risk management guidance updated for AI (model development, independent validation, ongoing monitoring requirements), CFPB UDAAP (unfair, deceptive, or abusive acts) applied to AI-driven consumer decisions, Equal Credit Opportunity Act disparate impact analysis for credit AI, Fair Housing Act for AI-powered housing decisions, SEC AI disclosure requirements (2024 updates), and the financial services AI compliance program architecture. Case study: CFPB enforcement actions against algorithmic lending bias.",
      "lessons": [
        {
          "title": "Foundations: Financial Services AI Compliance — OCC, CFPB, SEC, and Fair Lending",
          "desc": "Federal Reserve / OCC SR 11-7 model risk management guidance updated for AI (model development, independent validation, ongoing monitoring requirements), CFPB UDAAP (unfair, deceptive, or abusive acts) applied to AI-driven consumer decisions, Equal Credit Opportunity Act disparate impact analysis for credit AI, Fair Housing Act for AI-powered housing decisions, SEC AI disclosure requirements (2024 updates), and the financial services AI compliance program architecture. Case study: CFPB enforcement actions against algorithmic lending bias."
        },
        {
          "title": "Module 4.2 Deep Dive: independent validation",
          "desc": "Federal Reserve / OCC SR 11-7 model risk management guidance updated for AI (model development, independent validation, ongoing monitoring requirements), CFPB UDAAP (unfair, deceptive, or abusive acts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: ongoing monitoring requirements)",
          "desc": "Federal Reserve / OCC SR 11-7 model risk management guidance updated for AI (model development, independent validation, ongoing monitoring requirements), CFPB UDAAP (unfair, deceptive, or abusive acts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: CFPB UDAAP (unfair",
          "desc": "Federal Reserve / OCC SR 11-7 model risk management guidance updated for AI (model development, independent validation, ongoing monitoring requirements), CFPB UDAAP (unfair, deceptive, or abusive acts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: deceptive",
          "desc": "Federal Reserve / OCC SR 11-7 model risk management guidance updated for AI (model development, independent validation, ongoing monitoring requirements), CFPB UDAAP (unfair, deceptive, or abusive acts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: or abusive acts) applied to AI-driven consumer decisions",
          "desc": "Federal Reserve / OCC SR 11-7 model risk management guidance updated for AI (model development, independent validation, ongoing monitoring requirements), CFPB UDAAP (unfair, deceptive, or abusive acts. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Financial Services AI Compliance — OCC, CFPB, SEC, and Fair Lending. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Federal Reserve / OCC SR 11-7 model risk management guidance updated for AI (model development, independent validation, ongoing monitoring requirement"
        }
      ]
    },
    {
      "title": "Module 5: Healthcare AI Compliance — FDA, HIPAA, and Clinical AI Governance",
      "desc": "FDA AI/ML-Based Software as a Medical Device (SaMD) guidance (10-stage classification framework, predetermined change control plans for continuously learning AI), 21st Century Cures Act information blocking provisions for AI, HIPAA compliance for AI using PHI (the 18 PHI identifiers, de-identification standards — Safe Harbor vs. Expert Determination), the clinical AI validation requirements, and healthcare AI incident reporting. Case study: The Epic sepsis prediction model controversy and regulatory response.",
      "lessons": [
        {
          "title": "Foundations: Healthcare AI Compliance — FDA, HIPAA, and Clinical AI Governance",
          "desc": "FDA AI/ML-Based Software as a Medical Device (SaMD) guidance (10-stage classification framework, predetermined change control plans for continuously learning AI), 21st Century Cures Act information blocking provisions for AI, HIPAA compliance for AI using PHI (the 18 PHI identifiers, de-identification standards — Safe Harbor vs. Expert Determination), the clinical AI validation requirements, and healthcare AI incident reporting. Case study: The Epic sepsis prediction model controversy and regulatory response."
        },
        {
          "title": "Module 5.2 Deep Dive: predetermined change control plans for continuously learning AI)",
          "desc": "Case study: The Epic sepsis prediction model controversy and regulatory response.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: 21st Century Cures Act information blocking provisions for AI",
          "desc": "FDA AI/ML-Based Software as a Medical Device (SaMD) guidance (10-stage classification framework, predetermined change control plans for continuously learning AI), 21st Century Cures Act information bl. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: HIPAA compliance for AI using PHI (the 18 PHI identifiers",
          "desc": "FDA AI/ML-Based Software as a Medical Device (SaMD) guidance (10-stage classification framework, predetermined change control plans for continuously learning AI), 21st Century Cures Act information bl. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: de-identification standards — Safe Harbor vs. Expert Determination)",
          "desc": "FDA AI/ML-Based Software as a Medical Device (SaMD) guidance (10-stage classification framework, predetermined change control plans for continuously learning AI), 21st Century Cures Act information bl. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: the clinical AI validation requirements",
          "desc": "FDA AI/ML-Based Software as a Medical Device (SaMD) guidance (10-stage classification framework, predetermined change control plans for continuously learning AI), 21st Century Cures Act information bl. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Healthcare AI Compliance — FDA, HIPAA, and Clinical AI Governance. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. FDA AI/ML-Based Software as a Medical Device (SaMD) guidance (10-stage classification framework, predetermined change control plans for continuously l"
        }
      ]
    },
    {
      "title": "Module 6: ISO 42001 — AI Management System Certification",
      "desc": "ISO 42001 structure (following ISO high-level structure, Annex SL harmonization with ISO 27001 and 9001), the AI management system requirements (Clause 4: organizational context for AI, Clause 5: leadership and AI policy, Clause 6: AI risk and opportunity management, Clause 7: support, Clause 8: AI system operations, Clause 9: performance evaluation, Clause 10: continual improvement), Annex A controls for AI systems (26 specific AI controls), certification process, and integration with existing management systems.",
      "lessons": [
        {
          "title": "Foundations: ISO 42001 — AI Management System Certification",
          "desc": "ISO 42001 structure (following ISO high-level structure, Annex SL harmonization with ISO 27001 and 9001), the AI management system requirements (Clause 4: organizational context for AI, Clause 5: leadership and AI policy, Clause 6: AI risk and opportunity management, Clause 7: support, Clause 8: AI system operations, Clause 9: performance evaluation, Clause 10: continual improvement), Annex A controls for AI systems (26 specific AI controls), certification process, and integration with existing management systems."
        },
        {
          "title": "Module 6.2 Deep Dive: Annex SL harmonization with ISO 27001 and 9001)",
          "desc": "ISO 42001 structure (following ISO high-level structure, Annex SL harmonization with ISO 27001 and 9001), the AI management system requirements (Clause 4: organizational context for AI, Clause 5: lead. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: the AI management system requirements (Clause 4: organizational context for AI",
          "desc": "ISO 42001 structure (following ISO high-level structure, Annex SL harmonization with ISO 27001 and 9001), the AI management system requirements (Clause 4: organizational context for AI, Clause 5: lead. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: Clause 5: leadership and AI policy",
          "desc": "ISO 42001 structure (following ISO high-level structure, Annex SL harmonization with ISO 27001 and 9001), the AI management system requirements (Clause 4: organizational context for AI, Clause 5: lead. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: Clause 6: AI risk and opportunity management",
          "desc": "ISO 42001 structure (following ISO high-level structure, Annex SL harmonization with ISO 27001 and 9001), the AI management system requirements (Clause 4: organizational context for AI, Clause 5: lead. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: Clause 7: support",
          "desc": "ISO 42001 structure (following ISO high-level structure, Annex SL harmonization with ISO 27001 and 9001), the AI management system requirements (Clause 4: organizational context for AI, Clause 5: lead. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: ISO 42001 — AI Management System Certification. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. ISO 42001 structure (following ISO high-level structure, Annex SL harmonization with ISO 27001 and 9001), the AI management system requirements (Claus"
        }
      ]
    },
    {
      "title": "Module 7: AI Incident Response and Regulatory Reporting",
      "desc": "AI incident taxonomy (safety incidents, bias incidents, privacy incidents, security incidents, misuse incidents), the AI incident response plan (detection → containment → investigation → remediation → reporting → improvement), regulatory notification requirements (EU AI Act serious incident reporting within 15 days for high-risk AI, FDA Medical Device Reporting for SaMD), post-incident analysis methodology, and maintaining the AI incident database for organizational learning. Template: Complete AI incident response playbook.",
      "lessons": [
        {
          "title": "Foundations: AI Incident Response and Regulatory Reporting",
          "desc": "AI incident taxonomy (safety incidents, bias incidents, privacy incidents, security incidents, misuse incidents), the AI incident response plan (detection → containment → investigation → remediation → reporting → improvement), regulatory notification requirements (EU AI Act serious incident reporting within 15 days for high-risk AI, FDA Medical Device Reporting for SaMD), post-incident analysis methodology, and maintaining the AI incident database for organizational learning. Template: Complete AI incident response playbook."
        },
        {
          "title": "Module 7.2 Deep Dive: bias incidents",
          "desc": "AI incident taxonomy (safety incidents, bias incidents, privacy incidents, security incidents, misuse incidents), the AI incident response plan (detection → containment → investigation → remediation →. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: privacy incidents",
          "desc": "AI incident taxonomy (safety incidents, bias incidents, privacy incidents, security incidents, misuse incidents), the AI incident response plan (detection → containment → investigation → remediation →. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: security incidents",
          "desc": "AI incident taxonomy (safety incidents, bias incidents, privacy incidents, security incidents, misuse incidents), the AI incident response plan (detection → containment → investigation → remediation →. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: misuse incidents)",
          "desc": "AI incident taxonomy (safety incidents, bias incidents, privacy incidents, security incidents, misuse incidents), the AI incident response plan (detection → containment → investigation → remediation →. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: the AI incident response plan (detection → containment → investigation → remediation → reporting → improvement)",
          "desc": "AI incident taxonomy (safety incidents, bias incidents, privacy incidents, security incidents, misuse incidents), the AI incident response plan (detection → containment → investigation → remediation →. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: AI Incident Response and Regulatory Reporting. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI incident taxonomy (safety incidents, bias incidents, privacy incidents, security incidents, misuse incidents), the AI incident response plan (detec"
        }
      ]
    },
    {
      "title": "Module 8: AI Audit, Third-Party Risk, and Vendor Governance",
      "desc": "Third-party AI risk management program (vendor AI due diligence questionnaire — 50 key questions, ongoing monitoring triggers, annual review process), AI vendor contract requirements (performance SLAs, audit rights, data processing terms, liability allocation, model update notification requirements), the emerging third-party AI audit profession, and selecting external AI auditors. Template: AI vendor due diligence questionnaire.",
      "lessons": [
        {
          "title": "Foundations: AI Audit, Third-Party Risk, and Vendor Governance",
          "desc": "Third-party AI risk management program (vendor AI due diligence questionnaire — 50 key questions, ongoing monitoring triggers, annual review process), AI vendor contract requirements (performance SLAs, audit rights, data processing terms, liability allocation, model update notification requirements), the emerging third-party AI audit profession, and selecting external AI auditors. Template: AI vendor due diligence questionnaire."
        },
        {
          "title": "Module 8.2 Deep Dive: ongoing monitoring triggers",
          "desc": "Third-party AI risk management program (vendor AI due diligence questionnaire — 50 key questions, ongoing monitoring triggers, annual review process), AI vendor contract requirements (performance SLAs. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: annual review process)",
          "desc": "Third-party AI risk management program (vendor AI due diligence questionnaire — 50 key questions, ongoing monitoring triggers, annual review process), AI vendor contract requirements (performance SLAs. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: AI vendor contract requirements (performance SLAs",
          "desc": "Third-party AI risk management program (vendor AI due diligence questionnaire — 50 key questions, ongoing monitoring triggers, annual review process), AI vendor contract requirements (performance SLAs. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: audit rights",
          "desc": "Third-party AI risk management program (vendor AI due diligence questionnaire — 50 key questions, ongoing monitoring triggers, annual review process), AI vendor contract requirements (performance SLAs. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: data processing terms",
          "desc": "Third-party AI risk management program (vendor AI due diligence questionnaire — 50 key questions, ongoing monitoring triggers, annual review process), AI vendor contract requirements (performance SLAs. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: AI Audit, Third-Party Risk, and Vendor Governance. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Third-party AI risk management program (vendor AI due diligence questionnaire — 50 key questions, ongoing monitoring triggers, annual review process),"
        }
      ]
    },
    {
      "title": "Module 9: Building the Enterprise AI Compliance Program",
      "desc": "AI compliance program components (policy → procedure → training → monitoring → testing → reporting), AI compliance risk assessment methodology, the AI compliance calendar (regulatory deadlines, review cycles, audit schedule), compliance technology (GRC tools with AI modules — ServiceNow, MetricStream), compliance metrics and KPIs, and the compliance officer's relationship with engineering and product teams. How to be a compliance enabler not a compliance blocker.",
      "lessons": [
        {
          "title": "Foundations: Building the Enterprise AI Compliance Program",
          "desc": "AI compliance program components (policy → procedure → training → monitoring → testing → reporting), AI compliance risk assessment methodology, the AI compliance calendar (regulatory deadlines, review cycles, audit schedule), compliance technology (GRC tools with AI modules — ServiceNow, MetricStream), compliance metrics and KPIs, and the compliance officer's relationship with engineering and product teams. How to be a compliance enabler not a compliance blocker."
        },
        {
          "title": "Module 9.2 Deep Dive: AI compliance risk assessment methodology",
          "desc": "AI compliance program components (policy → procedure → training → monitoring → testing → reporting), AI compliance risk assessment methodology, the AI compliance calendar (regulatory deadlines, review. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: the AI compliance calendar (regulatory deadlines",
          "desc": "AI compliance program components (policy → procedure → training → monitoring → testing → reporting), AI compliance risk assessment methodology, the AI compliance calendar (regulatory deadlines, review. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: review cycles",
          "desc": "AI compliance program components (policy → procedure → training → monitoring → testing → reporting), AI compliance risk assessment methodology, the AI compliance calendar (regulatory deadlines, review. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: audit schedule)",
          "desc": "AI compliance program components (policy → procedure → training → monitoring → testing → reporting), AI compliance risk assessment methodology, the AI compliance calendar (regulatory deadlines, review. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: compliance technology (GRC tools with AI modules — ServiceNow",
          "desc": "AI compliance program components (policy → procedure → training → monitoring → testing → reporting), AI compliance risk assessment methodology, the AI compliance calendar (regulatory deadlines, review. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: Building the Enterprise AI Compliance Program. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI compliance program components (policy → procedure → training → monitoring → testing → reporting), AI compliance risk assessment methodology, the AI"
        }
      ]
    },
    {
      "title": "Module 10: AI Compliance Leadership and Capstone",
      "desc": "The Chief AI Compliance Officer role (emerging, $200K-$350K range), competency model (legal depth + technical fluency + business acumen), board-level AI compliance reporting, staying ahead of AI regulation (regulatory monitoring framework, industry association engagement), and the capstone: develop a complete AI compliance program for a provided organization scenario — regulatory mapping, gap assessment, compliance program design, implementation roadmap, and board reporting template.",
      "lessons": [
        {
          "title": "Foundations: AI Compliance Leadership and Capstone",
          "desc": "The Chief AI Compliance Officer role (emerging, $200K-$350K range), competency model (legal depth + technical fluency + business acumen), board-level AI compliance reporting, staying ahead of AI regulation (regulatory monitoring framework, industry association engagement), and the capstone: develop a complete AI compliance program for a provided organization scenario — regulatory mapping, gap assessment, compliance program design, implementation roadmap, and board reporting template."
        },
        {
          "title": "Module 10.2 Deep Dive: $200K-$350K range)",
          "desc": "The Chief AI Compliance Officer role (emerging, $200K-$350K range), competency model (legal depth + technical fluency + business acumen), board-level AI compliance reporting, staying ahead of AI regul. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: competency model (legal depth + technical fluency + business acumen)",
          "desc": "The Chief AI Compliance Officer role (emerging, $200K-$350K range), competency model (legal depth + technical fluency + business acumen), board-level AI compliance reporting, staying ahead of AI regul. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: board-level AI compliance reporting",
          "desc": "The Chief AI Compliance Officer role (emerging, $200K-$350K range), competency model (legal depth + technical fluency + business acumen), board-level AI compliance reporting, staying ahead of AI regul. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: staying ahead of AI regulation (regulatory monitoring framework",
          "desc": "The Chief AI Compliance Officer role (emerging, $200K-$350K range), competency model (legal depth + technical fluency + business acumen), board-level AI compliance reporting, staying ahead of AI regul. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: industry association engagement)",
          "desc": "The Chief AI Compliance Officer role (emerging, $200K-$350K range), competency model (legal depth + technical fluency + business acumen), board-level AI compliance reporting, staying ahead of AI regul. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: AI Compliance Leadership and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The Chief AI Compliance Officer role (emerging, $200K-$350K range), competency model (legal depth + technical fluency + business acumen), board-level "
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
