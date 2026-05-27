import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Solutions Consultant",
  "description": "Master the art and science of AI consulting — discovery, solution design, business case development, and managing enterprise AI transformation programs. 10 modules combining technical depth with business acumen from McKinsey, Deloitte, and Accenture AI practice methodologies.",
  "translations": {
    "es": {
      "title": "AI Solutions Consultant",
      "description": "Master the art and science of AI consulting — discovery, solution design, business case development, and managing enterprise AI transformation programs. 10 modules combining technical depth with busin"
    },
    "fr": {
      "title": "AI Solutions Consultant",
      "description": "Master the art and science of AI consulting — discovery, solution design, business case development, and managing enterprise AI transformation programs. 10 modules combining technical depth with busin"
    },
    "de": {
      "title": "AI Solutions Consultant",
      "description": "Master the art and science of AI consulting — discovery, solution design, business case development, and managing enterprise AI transformation programs. 10 modules combining technical depth with busin"
    },
    "zh": {
      "title": "AI Solutions Consultant",
      "description": "Master the art and science of AI consulting — discovery, solution design, business case development, and managing enterprise AI transformation programs. 10 modules combining technical depth with busin"
    },
    "ar": {
      "title": "AI Solutions Consultant",
      "description": "Master the art and science of AI consulting — discovery, solution design, business case development, and managing enterprise AI transformation programs. 10 modules combining technical depth with busin"
    },
    "ja": {
      "title": "AI Solutions Consultant",
      "description": "Master the art and science of AI consulting — discovery, solution design, business case development, and managing enterprise AI transformation programs. 10 modules combining technical depth with busin"
    }
  },
  "modules": [
    {
      "title": "Module 1: AI Consulting Foundations — The $50B Market and Consultant's Mindset",
      "desc": "The AI consulting market landscape (QuantumBlack, NTTDATA AI, Accenture Applied Intelligence, Deloitte AI Institute), consulting engagement models (strategy advisory, implementation, managed services, productized consulting), hypothesis-driven problem solving for AI (Minto Pyramid Principle, MECE frameworks), and building a personal AI consulting brand. The six-figure consulting rate justification.",
      "lessons": [
        {
          "title": "Foundations: AI Consulting Foundations — The $50B Market and Consultant's Mindset",
          "desc": "The AI consulting market landscape (QuantumBlack, NTTDATA AI, Accenture Applied Intelligence, Deloitte AI Institute), consulting engagement models (strategy advisory, implementation, managed services, productized consulting), hypothesis-driven problem solving for AI (Minto Pyramid Principle, MECE frameworks), and building a personal AI consulting brand. The six-figure consulting rate justification."
        },
        {
          "title": "Module 1.2 Deep Dive: NTTDATA AI",
          "desc": "The AI consulting market landscape (QuantumBlack, NTTDATA AI, Accenture Applied Intelligence, Deloitte AI Institute), consulting engagement models (strategy advisory, implementation, managed services,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: Accenture Applied Intelligence",
          "desc": "The AI consulting market landscape (QuantumBlack, NTTDATA AI, Accenture Applied Intelligence, Deloitte AI Institute), consulting engagement models (strategy advisory, implementation, managed services,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: Deloitte AI Institute)",
          "desc": "The AI consulting market landscape (QuantumBlack, NTTDATA AI, Accenture Applied Intelligence, Deloitte AI Institute), consulting engagement models (strategy advisory, implementation, managed services,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: consulting engagement models (strategy advisory",
          "desc": "The AI consulting market landscape (QuantumBlack, NTTDATA AI, Accenture Applied Intelligence, Deloitte AI Institute), consulting engagement models (strategy advisory, implementation, managed services,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: implementation",
          "desc": "The AI consulting market landscape (QuantumBlack, NTTDATA AI, Accenture Applied Intelligence, Deloitte AI Institute), consulting engagement models (strategy advisory, implementation, managed services,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: AI Consulting Foundations — The $50B Market and Consultant's Mindset. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The AI consulting market landscape (QuantumBlack, NTTDATA AI, Accenture Applied Intelligence, Deloitte AI Institute), consulting engagement models (st"
        }
      ]
    },
    {
      "title": "Module 2: Discovery and AI Opportunity Assessment",
      "desc": "Executive discovery interview methodology (SPIN selling adapted for AI), the AI maturity assessment framework (McKinsey's 5 stages: Aware → Active → Operational → Systematic → Transformational), opportunity mapping workshops (where does AI create maximum value across the value chain?), stakeholder mapping (power/interest grid for AI decisions), and the discovery-to-proposal conversion. Template: 90-minute executive discovery interview guide.",
      "lessons": [
        {
          "title": "Foundations: Discovery and AI Opportunity Assessment",
          "desc": "Executive discovery interview methodology (SPIN selling adapted for AI), the AI maturity assessment framework (McKinsey's 5 stages: Aware → Active → Operational → Systematic → Transformational), opportunity mapping workshops (where does AI create maximum value across the value chain?), stakeholder mapping (power/interest grid for AI decisions), and the discovery-to-proposal conversion. Template: 90-minute executive discovery interview guide."
        },
        {
          "title": "Module 2.2 Deep Dive: the AI maturity assessment framework (McKinsey's 5 stages: Aware → Active → Operational → Systematic → Transformational)",
          "desc": "Executive discovery interview methodology (SPIN selling adapted for AI), the AI maturity assessment framework (McKinsey's 5 stages: Aware → Active → Operational → Systematic → Transformational), oppor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: opportunity mapping workshops (where does AI create maximum value across the value chain?)",
          "desc": "Executive discovery interview methodology (SPIN selling adapted for AI), the AI maturity assessment framework (McKinsey's 5 stages: Aware → Active → Operational → Systematic → Transformational), oppor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: stakeholder mapping (power/interest grid for AI decisions)",
          "desc": "Executive discovery interview methodology (SPIN selling adapted for AI), the AI maturity assessment framework (McKinsey's 5 stages: Aware → Active → Operational → Systematic → Transformational), oppor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: and the discovery-to-proposal conversion. Template: 90-minute executive discovery interview guide.",
          "desc": "Executive discovery interview methodology (SPIN selling adapted for AI), the AI maturity assessment framework (McKinsey's 5 stages: Aware → Active → Operational → Systematic → Transformational), oppor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: Executive discovery interview methodology (SPIN selling adap",
          "desc": "Executive discovery interview methodology (SPIN selling adapted for AI), the AI maturity assessment framework (McKinsey's 5 stages: Aware → Active → Operational → Systematic → Transformational), oppor. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Discovery and AI Opportunity Assessment. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Executive discovery interview methodology (SPIN selling adapted for AI), the AI maturity assessment framework (McKinsey's 5 stages: Aware → Active → O"
        }
      ]
    },
    {
      "title": "Module 3: AI Use Case Prioritization — Impact, Feasibility, and ROI Modeling",
      "desc": "The 2×2 impact/feasibility prioritization matrix, AI use case scoring methodology (business impact × data availability × technical feasibility × organizational readiness), quick wins vs. transformational bets portfolio approach, 3-year AI investment roadmap construction, and the prioritization workshop facilitation guide. Case study: Prioritizing 200+ AI use cases for a global retail bank.",
      "lessons": [
        {
          "title": "Foundations: AI Use Case Prioritization — Impact, Feasibility, and ROI Modeling",
          "desc": "The 2×2 impact/feasibility prioritization matrix, AI use case scoring methodology (business impact × data availability × technical feasibility × organizational readiness), quick wins vs. transformational bets portfolio approach, 3-year AI investment roadmap construction, and the prioritization workshop facilitation guide. Case study: Prioritizing 200+ AI use cases for a global retail bank."
        },
        {
          "title": "Module 3.2 Deep Dive: AI use case scoring methodology (business impact × data availability × technical feasibility × organizational readiness)",
          "desc": "Case study: Prioritizing 200+ AI use cases for a global retail bank.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: quick wins vs. transformational bets portfolio approach",
          "desc": "The 2×2 impact/feasibility prioritization matrix, AI use case scoring methodology (business impact × data availability × technical feasibility × organizational readiness), quick wins vs. transformatio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: 3-year AI investment roadmap construction",
          "desc": "The 2×2 impact/feasibility prioritization matrix, AI use case scoring methodology (business impact × data availability × technical feasibility × organizational readiness), quick wins vs. transformatio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: and the prioritization workshop facilitation guide. Case study: Prioritizing 200+ AI use cases for a global retail bank.",
          "desc": "The 2×2 impact/feasibility prioritization matrix, AI use case scoring methodology (business impact × data availability × technical feasibility × organizational readiness), quick wins vs. transformatio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: The 2×2 impact/feasibility prioritization matrix, AI use cas",
          "desc": "The 2×2 impact/feasibility prioritization matrix, AI use case scoring methodology (business impact × data availability × technical feasibility × organizational readiness), quick wins vs. transformatio. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: AI Use Case Prioritization — Impact, Feasibility, and ROI Modeling. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The 2×2 impact/feasibility prioritization matrix, AI use case scoring methodology (business impact × data availability × technical feasibility × organ"
        }
      ]
    },
    {
      "title": "Module 4: Solution Architecture for Client Engagements",
      "desc": "Translating business requirements into AI technical architectures for non-technical clients, vendor evaluation frameworks (weighted scoring for build vs. buy vs. partner), architecture presentation techniques (the 1-page architecture diagram that executives understand), data flow documentation, integration complexity assessment, and the solution design review process. Consulting artifact: AI solution design document template.",
      "lessons": [
        {
          "title": "Foundations: Solution Architecture for Client Engagements",
          "desc": "Translating business requirements into AI technical architectures for non-technical clients, vendor evaluation frameworks (weighted scoring for build vs. buy vs. partner), architecture presentation techniques (the 1-page architecture diagram that executives understand), data flow documentation, integration complexity assessment, and the solution design review process. Consulting artifact: AI solution design document template."
        },
        {
          "title": "Module 4.2 Deep Dive: vendor evaluation frameworks (weighted scoring for build vs. buy vs. partner)",
          "desc": "Consulting artifact: AI solution design document template.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: architecture presentation techniques (the 1-page architecture diagram that executives understand)",
          "desc": "Translating business requirements into AI technical architectures for non-technical clients, vendor evaluation frameworks (weighted scoring for build vs. buy vs. partner), architecture presentation te. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: data flow documentation",
          "desc": "Translating business requirements into AI technical architectures for non-technical clients, vendor evaluation frameworks (weighted scoring for build vs. buy vs. partner), architecture presentation te. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: integration complexity assessment",
          "desc": "Translating business requirements into AI technical architectures for non-technical clients, vendor evaluation frameworks (weighted scoring for build vs. buy vs. partner), architecture presentation te. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: and the solution design review process. Consulting artifact: AI solution design document template.",
          "desc": "Translating business requirements into AI technical architectures for non-technical clients, vendor evaluation frameworks (weighted scoring for build vs. buy vs. partner), architecture presentation te. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Solution Architecture for Client Engagements. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Translating business requirements into AI technical architectures for non-technical clients, vendor evaluation frameworks (weighted scoring for build "
        }
      ]
    },
    {
      "title": "Module 5: Business Case Development and Financial Modeling",
      "desc": "The CFO-ready AI business case structure (3-statement model impact, NPV/IRR, payback period), AI ROI modeling with sensitivity analysis (best/base/worst scenarios), Monte Carlo simulation for AI project uncertainty, cost avoidance vs. cost reduction vs. revenue generation categorization, and the $50M AI investment business case walk-through. Template: AI business case financial model.",
      "lessons": [
        {
          "title": "Foundations: Business Case Development and Financial Modeling",
          "desc": "The CFO-ready AI business case structure (3-statement model impact, NPV/IRR, payback period), AI ROI modeling with sensitivity analysis (best/base/worst scenarios), Monte Carlo simulation for AI project uncertainty, cost avoidance vs. cost reduction vs. revenue generation categorization, and the $50M AI investment business case walk-through. Template: AI business case financial model."
        },
        {
          "title": "Module 5.2 Deep Dive: NPV/IRR",
          "desc": "Template: AI business case financial model.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: payback period)",
          "desc": "The CFO-ready AI business case structure (3-statement model impact, NPV/IRR, payback period), AI ROI modeling with sensitivity analysis (best/base/worst scenarios), Monte Carlo simulation for AI proje. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: AI ROI modeling with sensitivity analysis (best/base/worst scenarios)",
          "desc": "The CFO-ready AI business case structure (3-statement model impact, NPV/IRR, payback period), AI ROI modeling with sensitivity analysis (best/base/worst scenarios), Monte Carlo simulation for AI proje. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: Monte Carlo simulation for AI project uncertainty",
          "desc": "The CFO-ready AI business case structure (3-statement model impact, NPV/IRR, payback period), AI ROI modeling with sensitivity analysis (best/base/worst scenarios), Monte Carlo simulation for AI proje. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: cost avoidance vs. cost reduction vs. revenue generation categorization",
          "desc": "The CFO-ready AI business case structure (3-statement model impact, NPV/IRR, payback period), AI ROI modeling with sensitivity analysis (best/base/worst scenarios), Monte Carlo simulation for AI proje. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Business Case Development and Financial Modeling. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The CFO-ready AI business case structure (3-statement model impact, NPV/IRR, payback period), AI ROI modeling with sensitivity analysis (best/base/wor"
        }
      ]
    },
    {
      "title": "Module 6: Proposal Writing and Statement of Work Mastery",
      "desc": "Winning consulting proposal structure (situation, complication, resolution — Barbara Minto), Statement of Work for AI projects (scope with explicit exclusions, SMART deliverables, acceptance criteria, payment milestones, IP ownership), proposal pricing strategies (value-based, cost-plus, fixed-fee, T&M), negotiation tactics, and proposal review process. Template: Complete AI consulting proposal framework.",
      "lessons": [
        {
          "title": "Foundations: Proposal Writing and Statement of Work Mastery",
          "desc": "Winning consulting proposal structure (situation, complication, resolution — Barbara Minto), Statement of Work for AI projects (scope with explicit exclusions, SMART deliverables, acceptance criteria, payment milestones, IP ownership), proposal pricing strategies (value-based, cost-plus, fixed-fee, T&M), negotiation tactics, and proposal review process. Template: Complete AI consulting proposal framework."
        },
        {
          "title": "Module 6.2 Deep Dive: complication",
          "desc": "Winning consulting proposal structure (situation, complication, resolution — Barbara Minto), Statement of Work for AI projects (scope with explicit exclusions, SMART deliverables, acceptance criteria,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: resolution — Barbara Minto)",
          "desc": "Winning consulting proposal structure (situation, complication, resolution — Barbara Minto), Statement of Work for AI projects (scope with explicit exclusions, SMART deliverables, acceptance criteria,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: Statement of Work for AI projects (scope with explicit exclusions",
          "desc": "Winning consulting proposal structure (situation, complication, resolution — Barbara Minto), Statement of Work for AI projects (scope with explicit exclusions, SMART deliverables, acceptance criteria,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: SMART deliverables",
          "desc": "Winning consulting proposal structure (situation, complication, resolution — Barbara Minto), Statement of Work for AI projects (scope with explicit exclusions, SMART deliverables, acceptance criteria,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: acceptance criteria",
          "desc": "Winning consulting proposal structure (situation, complication, resolution — Barbara Minto), Statement of Work for AI projects (scope with explicit exclusions, SMART deliverables, acceptance criteria,. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Proposal Writing and Statement of Work Mastery. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Winning consulting proposal structure (situation, complication, resolution — Barbara Minto), Statement of Work for AI projects (scope with explicit ex"
        }
      ]
    },
    {
      "title": "Module 7: Engagement Delivery — Managing AI Projects to Success",
      "desc": "AI project lifecycle management (discovery → design → build → validate → deploy → operate), managing client expectations during AI uncertainty (the 'AI fog of war'), status reporting frameworks (RAID log, executive dashboard), scope creep management (change control for AI projects), quality gates, and the go-live checklist. Case study: Delivering a $5M AI transformation on time and budget.",
      "lessons": [
        {
          "title": "Foundations: Engagement Delivery — Managing AI Projects to Success",
          "desc": "AI project lifecycle management (discovery → design → build → validate → deploy → operate), managing client expectations during AI uncertainty (the 'AI fog of war'), status reporting frameworks (RAID log, executive dashboard), scope creep management (change control for AI projects), quality gates, and the go-live checklist. Case study: Delivering a $5M AI transformation on time and budget."
        },
        {
          "title": "Module 7.2 Deep Dive: managing client expectations during AI uncertainty (the 'AI fog of war')",
          "desc": "AI project lifecycle management (discovery → design → build → validate → deploy → operate), managing client expectations during AI uncertainty (the 'AI fog of war'), status reporting frameworks (RAID . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: status reporting frameworks (RAID log",
          "desc": "AI project lifecycle management (discovery → design → build → validate → deploy → operate), managing client expectations during AI uncertainty (the 'AI fog of war'), status reporting frameworks (RAID . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: executive dashboard)",
          "desc": "AI project lifecycle management (discovery → design → build → validate → deploy → operate), managing client expectations during AI uncertainty (the 'AI fog of war'), status reporting frameworks (RAID . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: scope creep management (change control for AI projects)",
          "desc": "AI project lifecycle management (discovery → design → build → validate → deploy → operate), managing client expectations during AI uncertainty (the 'AI fog of war'), status reporting frameworks (RAID . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: quality gates",
          "desc": "AI project lifecycle management (discovery → design → build → validate → deploy → operate), managing client expectations during AI uncertainty (the 'AI fog of war'), status reporting frameworks (RAID . Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: Engagement Delivery — Managing AI Projects to Success. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. AI project lifecycle management (discovery → design → build → validate → deploy → operate), managing client expectations during AI uncertainty (the 'A"
        }
      ]
    },
    {
      "title": "Module 8: AI Change Management and Organizational Transformation",
      "desc": "Kotter's 8-step change model applied to enterprise AI adoption, PROSCI ADKAR methodology for AI change, building the AI champion network, managing workforce anxiety about AI automation, AI literacy program design, and measuring adoption success. Case study: How DBS Bank transformed 33,000 employees into AI practitioners in 3 years and became 'the world's best digital bank.'",
      "lessons": [
        {
          "title": "Foundations: AI Change Management and Organizational Transformation",
          "desc": "Kotter's 8-step change model applied to enterprise AI adoption, PROSCI ADKAR methodology for AI change, building the AI champion network, managing workforce anxiety about AI automation, AI literacy program design, and measuring adoption success. Case study: How DBS Bank transformed 33,000 employees into AI practitioners in 3 years and became 'the world's best digital bank.'"
        },
        {
          "title": "Module 8.2 Deep Dive: PROSCI ADKAR methodology for AI change",
          "desc": "Kotter's 8-step change model applied to enterprise AI adoption, PROSCI ADKAR methodology for AI change, building the AI champion network, managing workforce anxiety about AI automation, AI literacy pr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: building the AI champion network",
          "desc": "Kotter's 8-step change model applied to enterprise AI adoption, PROSCI ADKAR methodology for AI change, building the AI champion network, managing workforce anxiety about AI automation, AI literacy pr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: managing workforce anxiety about AI automation",
          "desc": "Kotter's 8-step change model applied to enterprise AI adoption, PROSCI ADKAR methodology for AI change, building the AI champion network, managing workforce anxiety about AI automation, AI literacy pr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: AI literacy program design",
          "desc": "Kotter's 8-step change model applied to enterprise AI adoption, PROSCI ADKAR methodology for AI change, building the AI champion network, managing workforce anxiety about AI automation, AI literacy pr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: and measuring adoption success. Case study: How DBS Bank transformed 33",
          "desc": "Kotter's 8-step change model applied to enterprise AI adoption, PROSCI ADKAR methodology for AI change, building the AI champion network, managing workforce anxiety about AI automation, AI literacy pr. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: AI Change Management and Organizational Transformation. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Kotter's 8-step change model applied to enterprise AI adoption, PROSCI ADKAR methodology for AI change, building the AI champion network, managing wor"
        }
      ]
    },
    {
      "title": "Module 9: AI Ethics, Responsible AI, and Consultant Accountability",
      "desc": "The consultant's fiduciary duty in AI engagements (who do you serve — client or society?), bias auditing as a consulting deliverable, building responsible AI into client engagements (not as an add-on), managing reputational risk from controversial AI projects, the whistleblowing question, and documenting ethical considerations in engagement deliverables. Case study: Amazon's biased recruiting AI — consultant accountability.",
      "lessons": [
        {
          "title": "Foundations: AI Ethics, Responsible AI, and Consultant Accountability",
          "desc": "The consultant's fiduciary duty in AI engagements (who do you serve — client or society?), bias auditing as a consulting deliverable, building responsible AI into client engagements (not as an add-on), managing reputational risk from controversial AI projects, the whistleblowing question, and documenting ethical considerations in engagement deliverables. Case study: Amazon's biased recruiting AI — consultant accountability."
        },
        {
          "title": "Module 9.2 Deep Dive: bias auditing as a consulting deliverable",
          "desc": "The consultant's fiduciary duty in AI engagements (who do you serve — client or society?), bias auditing as a consulting deliverable, building responsible AI into client engagements (not as an add-on). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: building responsible AI into client engagements (not as an add-on)",
          "desc": "The consultant's fiduciary duty in AI engagements (who do you serve — client or society?), bias auditing as a consulting deliverable, building responsible AI into client engagements (not as an add-on). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: managing reputational risk from controversial AI projects",
          "desc": "The consultant's fiduciary duty in AI engagements (who do you serve — client or society?), bias auditing as a consulting deliverable, building responsible AI into client engagements (not as an add-on). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: the whistleblowing question",
          "desc": "The consultant's fiduciary duty in AI engagements (who do you serve — client or society?), bias auditing as a consulting deliverable, building responsible AI into client engagements (not as an add-on). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: and documenting ethical considerations in engagement deliverables. Case study: Amazon's biased recruiting AI — consultant accountability.",
          "desc": "The consultant's fiduciary duty in AI engagements (who do you serve — client or society?), bias auditing as a consulting deliverable, building responsible AI into client engagements (not as an add-on). Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: AI Ethics, Responsible AI, and Consultant Accountability. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The consultant's fiduciary duty in AI engagements (who do you serve — client or society?), bias auditing as a consulting deliverable, building respons"
        }
      ]
    },
    {
      "title": "Module 10: Building Your AI Consulting Practice and Capstone",
      "desc": "Personal brand building for AI consultants (LinkedIn thought leadership, speaking, publishing), developing proprietary consulting frameworks (your IP), pricing your expertise ($5K-$50K/day rates at top consultants), building a referral network, and the capstone: deliver a complete AI consulting engagement — discovery, maturity assessment, use case prioritization, solution design, business case, and proposal for a provided client scenario.",
      "lessons": [
        {
          "title": "Foundations: Building Your AI Consulting Practice and Capstone",
          "desc": "Personal brand building for AI consultants (LinkedIn thought leadership, speaking, publishing), developing proprietary consulting frameworks (your IP), pricing your expertise ($5K-$50K/day rates at top consultants), building a referral network, and the capstone: deliver a complete AI consulting engagement — discovery, maturity assessment, use case prioritization, solution design, business case, and proposal for a provided client scenario."
        },
        {
          "title": "Module 10.2 Deep Dive: speaking",
          "desc": "Personal brand building for AI consultants (LinkedIn thought leadership, speaking, publishing), developing proprietary consulting frameworks (your IP), pricing your expertise ($5K-$50K/day rates at to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: publishing)",
          "desc": "Personal brand building for AI consultants (LinkedIn thought leadership, speaking, publishing), developing proprietary consulting frameworks (your IP), pricing your expertise ($5K-$50K/day rates at to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: developing proprietary consulting frameworks (your IP)",
          "desc": "Personal brand building for AI consultants (LinkedIn thought leadership, speaking, publishing), developing proprietary consulting frameworks (your IP), pricing your expertise ($5K-$50K/day rates at to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: pricing your expertise ($5K-$50K/day rates at top consultants)",
          "desc": "Personal brand building for AI consultants (LinkedIn thought leadership, speaking, publishing), developing proprietary consulting frameworks (your IP), pricing your expertise ($5K-$50K/day rates at to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: building a referral network",
          "desc": "Personal brand building for AI consultants (LinkedIn thought leadership, speaking, publishing), developing proprietary consulting frameworks (your IP), pricing your expertise ($5K-$50K/day rates at to. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: Building Your AI Consulting Practice and Capstone. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Personal brand building for AI consultants (LinkedIn thought leadership, speaking, publishing), developing proprietary consulting frameworks (your IP)"
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
