import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { ProgramExplorer, Program } from './ProgramExplorer';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

const SCHOOLS = [
  { id:'engineering', name:'School of AI Engineering', icon:'⚙️', count:8,
    color:DS.blue, colorD:DS.bd, colorB:DS.bb,
    tagline:'BUILD. DEPLOY. SCALE.',
    desc:'Design and operate the AI systems powering modern enterprises.',
    salary:'$120K–$220K/yr' },
  { id:'business', name:'School of AI Business Transformation', icon:'💼', count:8,
    color:DS.orange, colorD:DS.od, colorB:DS.ob,
    tagline:'CONSULT. MANAGE. DELIVER.',
    desc:'Lead enterprise AI adoption at the intersection of strategy and execution.',
    salary:'$100K–$190K/yr' },
  { id:'governance', name:'School of Governance & Risk', icon:'⚖️', count:7,
    color:DS.gold, colorD:DS.gd, colorB:DS.gb,
    tagline:'GOVERN. COMPLY. PROTECT.',
    desc:'Design the frameworks, policies, and audit systems that make AI responsible.',
    salary:'$95K–$175K/yr' },
  { id:'humanai', name:'School of Human-AI Experience', icon:'🎨', count:5,
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)',
    tagline:'DESIGN. TRUST. CONNECT.',
    desc:'Create the interfaces, conversations, and workflows where humans and AI collaborate.',
    salary:'$95K–$145K/yr' },
];

const PROGRAMS: Program[] = [
  // Engineering
  { id:'p1', name:'AI Cloud Engineer', school:'engineering', icon:'☁️',
    tagline:'Build scalable cloud-native AI infrastructure',
    description:'Design, deploy, and operate AI workloads on AWS, Azure, and GCP. Master IaC, Kubernetes, and serverless AI patterns used by Fortune 500 engineering teams.',
    weeks:32, salary:'$120–180K/yr', levels:'L100–L700',
    skills:['AWS','Azure','GCP','Kubernetes','IaC','Serverless','Docker','Terraform'],
    outcomes:['AI Cloud Engineer at top-tier tech firms','Solutions Architect roles','Platform Engineering leads'],
    modules:[
      {title:'Cloud Foundations & AI Services',lessons:7},
      {title:'Container Orchestration & Kubernetes',lessons:7},
      {title:'Infrastructure as Code & GitOps',lessons:7},
      {title:'IAM, Secrets & Zero-Trust Security',lessons:7},
      {title:'Serverless & GPU Inference Patterns',lessons:7},
      {title:'Observability, SRE & Reliability',lessons:7},
      {title:'MLOps on Cloud Platforms',lessons:7},
      {title:'Multi-Cloud AI Architecture',lessons:7},
      {title:'FinOps & Cost Optimization',lessons:7},
      {title:'Capstone: Enterprise AI Platform',lessons:7},
    ],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p2', name:'AI Agent Engineer', school:'engineering', icon:'🤖',
    tagline:'Build autonomous multi-agent AI systems',
    description:'Master LLMs, LangGraph, RAG pipelines, and MCP to build production-grade autonomous agents. The most in-demand AI engineering skill of 2025–2030.',
    weeks:30, salary:'$130–200K/yr', levels:'L100–L700',
    skills:['LangGraph','RAG','MCP','LLMs','LangChain','Vector DBs','Python','Prompt Engineering'],
    outcomes:['AI Agent Engineer at AI-first companies','LLM Engineer roles','AI Research Engineering'],
    modules:[
      {title:'LLM Foundations & Prompt Engineering',lessons:7},
      {title:'RAG Pipelines & Vector Databases',lessons:7},
      {title:'LangGraph & Agent Orchestration',lessons:7},
      {title:'Memory, Context & State Management',lessons:7},
      {title:'Multi-Agent Systems & Coordination',lessons:7},
      {title:'Tool Use, MCP & External APIs',lessons:7},
      {title:'Agent Security & Evaluation',lessons:7},
      {title:'Production Deployment & Scaling',lessons:7},
      {title:'Enterprise Agent Design Patterns',lessons:7},
      {title:'Capstone: Autonomous Enterprise Agent',lessons:7},
    ],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p3', name:'AI Data Engineer', school:'engineering', icon:'📊',
    tagline:'Build the data pipelines that power AI',
    description:'Master dbt, Snowflake, Kafka, and feature engineering to build enterprise-grade data infrastructure for AI and ML systems.',
    weeks:28, salary:'$115–165K/yr', levels:'L100–L700',
    skills:['dbt','Snowflake','Kafka','Spark','Airflow','Python','Feature Engineering','SQL'],
    outcomes:['Senior Data Engineer','AI Data Platform roles','ML Infrastructure Engineer'],
    modules:[
      {title:'Modern Data Stack Foundations',lessons:7},
      {title:'SQL Mastery & Analytical Engineering',lessons:7},
      {title:'dbt: Transform, Test & Document',lessons:7},
      {title:'Stream Processing with Kafka & Spark',lessons:7},
      {title:'Feature Engineering for ML',lessons:7},
      {title:'Data Quality, Observability & Governance',lessons:7},
      {title:'Orchestration with Airflow & Dagster',lessons:7},
      {title:'Cloud Data Warehouses at Scale',lessons:7},
      {title:'MLOps Data Pipelines',lessons:7},
      {title:'Capstone: Enterprise AI Data Platform',lessons:7},
    ],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p4', name:'AI DevOps Engineer', school:'engineering', icon:'🔧',
    tagline:'Automate and scale AI delivery pipelines',
    description:'Master CI/CD, Docker, GitOps, and AI pipeline automation. Build the infrastructure that ships AI systems reliably to production at scale.',
    weeks:28, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['CI/CD','Docker','GitOps','GitHub Actions','Jenkins','ArgoCD','Monitoring','Python'],
    outcomes:['AI DevOps Engineer','Platform Engineer','MLOps Engineer'],
    modules:[
      {title:'DevOps Foundations & Culture',lessons:7},
      {title:'CI/CD Pipelines: GitHub Actions & Jenkins',lessons:7},
      {title:'Docker & Container Engineering',lessons:7},
      {title:'Kubernetes for DevOps',lessons:7},
      {title:'GitOps with ArgoCD & Flux',lessons:7},
      {title:'AI Pipeline Automation',lessons:7},
      {title:'Infrastructure as Code for DevOps',lessons:7},
      {title:'Observability & Incident Response',lessons:7},
      {title:'Security & Compliance in DevOps',lessons:7},
      {title:'Capstone: Production AI Delivery System',lessons:7},
    ],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p5', name:'AI Security Engineer', school:'engineering', icon:'🛡️',
    tagline:'Secure AI systems at enterprise scale',
    description:'Zero trust, AI threat modeling, and red teaming. Protect enterprise AI deployments from adversarial attacks, data poisoning, and model theft.',
    weeks:26, salary:'$120–175K/yr', levels:'L100–L700',
    skills:['Zero Trust','Threat Modeling','Red Teaming','OWASP AI','Penetration Testing','IAM','SOC','SIEM'],
    outcomes:['AI Security Engineer','CISO-track roles','Cybersecurity Consultant'],
    modules:[
      {title:'AI Threat Landscape & Attack Surface',lessons:7},
      {title:'Zero Trust Architecture for AI',lessons:7},
      {title:'Red Teaming & Adversarial ML',lessons:7},
      {title:'OWASP LLM Top 10 & Prompt Injection',lessons:7},
      {title:'Data Security & Privacy for AI',lessons:7},
      {title:'IAM & Secrets Management',lessons:7},
      {title:'SOC, SIEM & AI Monitoring',lessons:7},
      {title:'Regulatory Compliance & Frameworks',lessons:7},
      {title:'Incident Response for AI Systems',lessons:7},
      {title:'Capstone: Enterprise AI Security Architecture',lessons:7},
    ],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p6', name:'AI MLOps Engineer', school:'engineering', icon:'🧬',
    tagline:'Operationalize ML models at enterprise scale',
    description:'Model serving, drift detection, and experiment tracking. Bridge the gap between data science and production with robust MLOps practices.',
    weeks:28, salary:'$120–170K/yr', levels:'L100–L700',
    skills:['MLflow','Kubeflow','Model Serving','Drift Detection','A/B Testing','Feast','Weights & Biases','Python'],
    outcomes:['MLOps Engineer','AI Platform Engineer','ML Infrastructure Lead'],
    modules:[
      {title:'ML Lifecycle & MLOps Foundations',lessons:7},
      {title:'Experiment Tracking with MLflow & W&B',lessons:7},
      {title:'Model Serving: FastAPI, Triton & BentoML',lessons:7},
      {title:'Feature Stores: Feast & Tecton',lessons:7},
      {title:'Model Monitoring & Drift Detection',lessons:7},
      {title:'CI/CD for ML: Automated Retraining',lessons:7},
      {title:'Kubeflow Pipelines & Vertex AI',lessons:7},
      {title:'A/B Testing & Shadow Deployment',lessons:7},
      {title:'Governance, Lineage & Audit Trails',lessons:7},
      {title:'Capstone: End-to-End MLOps Platform',lessons:7},
    ],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p7', name:'AI Solutions Architect', school:'engineering', icon:'🏗️',
    tagline:'Design enterprise AI systems end-to-end',
    description:'Enterprise AI design, multi-cloud integration, and system architecture. Lead the technical vision for AI transformation at Fortune 500 companies.',
    weeks:32, salary:'$150–220K/yr', levels:'L100–L700',
    skills:['Enterprise Architecture','Multi-Cloud','Integration Patterns','API Design','TOGAF','Well-Architected','Scalability','Security'],
    outcomes:['AI Solutions Architect','Enterprise Architect','CTO-track technical leadership'],
    modules:[
      {title:'Architecture Fundamentals & Patterns',lessons:7},
      {title:'AI System Design Principles',lessons:7},
      {title:'Multi-Cloud & Hybrid Architecture',lessons:7},
      {title:'Integration Architecture & APIs',lessons:7},
      {title:'Data Architecture for AI Platforms',lessons:7},
      {title:'Security Architecture & Zero Trust',lessons:7},
      {title:'Scalability, Resilience & HA Design',lessons:7},
      {title:'Enterprise Governance & Standards',lessons:7},
      {title:'Architecture Decision Records & Comms',lessons:7},
      {title:'Capstone: Full Enterprise AI Blueprint',lessons:7},
    ],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p8', name:'AI Platform Engineer', school:'engineering', icon:'⚙️',
    tagline:'Build internal developer platforms for AI teams',
    description:'Internal developer platforms and AI toolchains. Enable 10x engineering productivity by building the infrastructure layer that AI teams depend on.',
    weeks:26, salary:'$120–165K/yr', levels:'L100–L700',
    skills:['Platform Engineering','Developer Portals','Backstage','Internal APIs','Toolchains','Golden Paths','DevEx','Python'],
    outcomes:['Platform Engineer','Staff Engineer','Engineering Productivity Lead'],
    modules:[
      {title:'Platform Engineering Fundamentals',lessons:7},
      {title:'Developer Experience & Golden Paths',lessons:7},
      {title:'Backstage: Building Developer Portals',lessons:7},
      {title:'AI Toolchain Design & Integration',lessons:7},
      {title:'Self-Service Infrastructure & Templates',lessons:7},
      {title:'Internal APIs & Service Catalogs',lessons:7},
      {title:'Platform Observability & Metrics',lessons:7},
      {title:'Security & Compliance Automation',lessons:7},
      {title:'Platform Adoption & Change Management',lessons:7},
      {title:'Capstone: Enterprise AI Developer Platform',lessons:7},
    ],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  // Business
  { id:'p9', name:'AI Solutions Consultant', school:'business', icon:'🧠',
    tagline:'Sell and deliver enterprise AI strategy',
    description:'Client engagement, RFP response, and AI strategy delivery. Become the trusted advisor enterprises turn to when they need to navigate AI transformation.',
    weeks:30, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['Client Engagement','RFP','AI Strategy','Consulting Frameworks','Stakeholder Management','Proposal Writing','Discovery','Delivery'],
    outcomes:['AI Strategy Consultant','Management Consulting at top firms','Independent Consultant ($200K+)'],
    modules:[
      {title:'Consulting Fundamentals & Mindset',lessons:7},
      {title:'AI Strategy Frameworks',lessons:7},
      {title:'Discovery & Client Interviews',lessons:7},
      {title:'Business Case & ROI Modeling',lessons:7},
      {title:'RFP Response & Proposal Writing',lessons:7},
      {title:'Stakeholder Management & Politics',lessons:7},
      {title:'AI Solution Design for Clients',lessons:7},
      {title:'Delivery, Governance & QA',lessons:7},
      {title:'Practice Development & BD',lessons:7},
      {title:'Capstone: Full AI Consulting Engagement',lessons:7},
    ],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p10', name:'AI Product Manager', school:'business', icon:'📱',
    tagline:'Build and ship AI-powered products',
    description:'Roadmapping, AI UX, and metric frameworks. Drive the product vision for AI features that millions of users depend on.',
    weeks:28, salary:'$120–180K/yr', levels:'L100–L700',
    skills:['Product Roadmapping','AI UX','OKRs','User Research','A/B Testing','PRD','Discovery','Agile'],
    outcomes:['AI Product Manager at FAANG','Director of Product','AI Product Lead'],
    modules:[
      {title:'Product Management Fundamentals',lessons:7},
      {title:'AI Product Discovery & Research',lessons:7},
      {title:'PRD Writing & Feature Specification',lessons:7},
      {title:'AI-Specific UX & Interaction Design',lessons:7},
      {title:'Metrics, OKRs & North Star',lessons:7},
      {title:'Roadmapping & Prioritization',lessons:7},
      {title:'Working with Engineering on AI',lessons:7},
      {title:'A/B Testing & Experimentation',lessons:7},
      {title:'Product Strategy & Competitive Analysis',lessons:7},
      {title:'Capstone: AI Product Launch',lessons:7},
    ],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p11', name:'AI Business Operations', school:'business', icon:'⚡',
    tagline:'Automate and optimize business processes with AI',
    description:'Process automation and AI workflow design. Identify inefficiencies, design AI-powered solutions, and drive measurable business impact.',
    weeks:24, salary:'$95–140K/yr', levels:'L100–L700',
    skills:['Process Automation','AI Workflows','RPA','N8N','Make','Business Analysis','Change Management','ROI Measurement'],
    outcomes:['AI Operations Lead','Business Transformation Manager','Operations Consultant'],
    modules:[
      {title:'Business Operations Foundations',lessons:7},
      {title:'Process Mapping & Analysis',lessons:7},
      {title:'AI Automation Tools: N8N & Make',lessons:7},
      {title:'RPA & Intelligent Document Processing',lessons:7},
      {title:'Workflow Design & Optimization',lessons:7},
      {title:'Data Dashboards & Operations Analytics',lessons:7},
      {title:'Change Management for AI Ops',lessons:7},
      {title:'Vendor Selection & Tool Evaluation',lessons:7},
      {title:'ROI Measurement & Reporting',lessons:7},
      {title:'Capstone: AI Operations Transformation',lessons:7},
    ],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p12', name:'AI Sales Engineer', school:'business', icon:'💰',
    tagline:'Win enterprise AI deals with technical credibility',
    description:'Technical sales, POC design, and demo mastery. Bridge the gap between engineering and revenue at AI-first companies.',
    weeks:24, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['Technical Sales','POC Design','Demo Engineering','RFP Response','Objection Handling','CRM','Pricing','Negotiation'],
    outcomes:['AI Sales Engineer','Solutions Engineer','Pre-Sales Architect'],
    modules:[
      {title:'Sales Engineering Fundamentals',lessons:7},
      {title:'AI Product Knowledge & Positioning',lessons:7},
      {title:'Discovery: Uncovering Technical Requirements',lessons:7},
      {title:'POC Design & Proof of Value',lessons:7},
      {title:'Demo Engineering & Storytelling',lessons:7},
      {title:'RFP Response & Technical Writing',lessons:7},
      {title:'Objection Handling & Competitive Intel',lessons:7},
      {title:'Enterprise Sales Process & Stakeholders',lessons:7},
      {title:'Pricing, Negotiation & Closing',lessons:7},
      {title:'Capstone: Enterprise AI Deal Simulation',lessons:7},
    ],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p13', name:'AI Business Analyst', school:'business', icon:'📋',
    tagline:'Translate business needs into AI solutions',
    description:'Requirements, data storytelling, and stakeholder management. Be the bridge between business problems and technical AI solutions.',
    weeks:26, salary:'$95–140K/yr', levels:'L100–L700',
    skills:['Requirements','User Stories','Data Storytelling','BPMN','Gap Analysis','Stakeholder Management','Power BI','SQL'],
    outcomes:['Senior Business Analyst','AI Product Analyst','Business Intelligence Lead'],
    modules:[
      {title:'Business Analysis Foundations',lessons:7},
      {title:'Requirements Elicitation Techniques',lessons:7},
      {title:'User Stories, Epics & Acceptance Criteria',lessons:7},
      {title:'Process Modeling with BPMN',lessons:7},
      {title:'Data Analysis & SQL for BAs',lessons:7},
      {title:'Data Storytelling & Power BI',lessons:7},
      {title:'AI Solution Design for Business',lessons:7},
      {title:'Gap Analysis & As-Is / To-Be Mapping',lessons:7},
      {title:'Stakeholder Management & Governance',lessons:7},
      {title:'Capstone: AI Business Case & Specification',lessons:7},
    ],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p14', name:'AI Transformation Manager', school:'business', icon:'🔄',
    tagline:'Lead enterprise-wide AI adoption',
    description:'Change management, adoption frameworks, and OKRs. Guide organizations through the most complex transformation of our era.',
    weeks:28, salary:'$130–190K/yr', levels:'L100–L700',
    skills:['Change Management','OKRs','Adoption Frameworks','Executive Communication','Training Design','PROSCI','Stakeholder Buy-in','KPIs'],
    outcomes:['AI Transformation Manager','Chief Digital Officer','VP of AI Strategy'],
    modules:[
      {title:'AI Transformation Fundamentals',lessons:7},
      {title:'Organizational Readiness Assessment',lessons:7},
      {title:'Change Management: PROSCI & ADKAR',lessons:7},
      {title:'AI Adoption Roadmapping',lessons:7},
      {title:'Executive Alignment & Sponsorship',lessons:7},
      {title:'Training Design & Enablement Programs',lessons:7},
      {title:'OKRs & Transformation KPIs',lessons:7},
      {title:'Resistance, Culture & Politics',lessons:7},
      {title:'Sustaining Change & Continuous Improvement',lessons:7},
      {title:'Capstone: Enterprise AI Transformation Plan',lessons:7},
    ],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p15', name:'AI Program Manager', school:'business', icon:'🗓️',
    tagline:'Deliver complex AI programs on time',
    description:'SAFe, delivery, and executive reporting. Orchestrate multi-team AI programs from inception to value delivery.',
    weeks:28, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['SAFe','Program Planning','Executive Reporting','Risk Management','PI Planning','OKRs','Jira','Stakeholder Management'],
    outcomes:['AI Program Manager','Delivery Lead','Portfolio Manager'],
    modules:[
      {title:'Program Management Foundations',lessons:7},
      {title:'SAFe & Agile at Scale',lessons:7},
      {title:'PI Planning & ART Coordination',lessons:7},
      {title:'Program Roadmaps & Forecasting',lessons:7},
      {title:'Risk Management & Dependencies',lessons:7},
      {title:'Budgeting & Resource Planning',lessons:7},
      {title:'Executive Reporting & Dashboards',lessons:7},
      {title:'Vendor & Third-Party Management',lessons:7},
      {title:'Governance, Audit & Portfolio Review',lessons:7},
      {title:'Capstone: AI Program Delivery Simulation',lessons:7},
    ],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p16', name:'AI Enterprise Architect', school:'business', icon:'🏛️',
    tagline:'Architect the enterprise for AI at scale',
    description:'EA frameworks, capability modeling, and AI integration. Define the blueprint that aligns business strategy with AI technology across the enterprise.',
    weeks:32, salary:'$140–200K/yr', levels:'L100–L700',
    skills:['TOGAF','Business Architecture','Capability Modeling','EA Frameworks','Roadmapping','Governance','Integration','Strategy'],
    outcomes:['Enterprise Architect','Chief Architect','VP of Technology'],
    modules:[
      {title:'Enterprise Architecture Foundations',lessons:7},
      {title:'TOGAF & Architecture Frameworks',lessons:7},
      {title:'Business Architecture & Capability Modeling',lessons:7},
      {title:'Data Architecture for Enterprise AI',lessons:7},
      {title:'Application & Integration Architecture',lessons:7},
      {title:'Technology Architecture & Standards',lessons:7},
      {title:'AI Strategy & Roadmapping',lessons:7},
      {title:'EA Governance & Review Boards',lessons:7},
      {title:'Architecture Communication & Buy-In',lessons:7},
      {title:'Capstone: Enterprise AI Architecture Blueprint',lessons:7},
    ],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  // Governance
  { id:'p17', name:'AI Governance Professional', school:'governance', icon:'⚖️',
    tagline:'Design AI governance frameworks',
    description:'AI policy design, governance committees, and framework implementation. Build the structures that ensure AI is deployed responsibly at scale.',
    weeks:26, salary:'$120–170K/yr', levels:'L100–L700',
    skills:['AI Governance','Policy Design','Committees','NIST AI RMF','ISO 42001','Risk Management','Audit','Compliance'],
    outcomes:['AI Governance Lead','Chief AI Ethics Officer','Policy Director'],
    modules:[
      {title:'AI Governance Foundations',lessons:7},
      {title:'Governance Framework Design',lessons:7},
      {title:'Policy Writing & Standards Development',lessons:7},
      {title:'NIST AI RMF Implementation',lessons:7},
      {title:'ISO 42001 Certification Path',lessons:7},
      {title:'Governance Committees & Operating Models',lessons:7},
      {title:'Risk Integration & Controls',lessons:7},
      {title:'Vendor & Third-Party AI Governance',lessons:7},
      {title:'Audit, Review & Continuous Improvement',lessons:7},
      {title:'Capstone: Enterprise AI Governance Program',lessons:7},
    ],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p18', name:'Responsible AI Specialist', school:'governance', icon:'🛡️',
    tagline:'Make AI fair, explainable, and trustworthy',
    description:'Bias detection, fairness frameworks, and explainability. Ensure AI systems respect human rights and operate transparently.',
    weeks:24, salary:'$110–155K/yr', levels:'L100–L700',
    skills:['Bias Detection','Fairness Metrics','Explainability','XAI','SHAP','LIME','Human Rights','Impact Assessment'],
    outcomes:['Responsible AI Lead','AI Ethics Researcher','Trust & Safety Manager'],
    modules:[
      {title:'AI Ethics & Responsibility Foundations',lessons:7},
      {title:'Bias: Sources, Types & Detection',lessons:7},
      {title:'Fairness Metrics & Tradeoffs',lessons:7},
      {title:'Explainability: SHAP, LIME & Integrated Gradients',lessons:7},
      {title:'Privacy-Preserving AI Techniques',lessons:7},
      {title:'Human Rights Impact Assessment',lessons:7},
      {title:'Responsible AI Tools & Testing',lessons:7},
      {title:'Stakeholder Communication & Transparency',lessons:7},
      {title:'Responsible Deployment & Monitoring',lessons:7},
      {title:'Capstone: Responsible AI Audit & Remediation',lessons:7},
    ],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p19', name:'AI Compliance Officer', school:'governance', icon:'📜',
    tagline:'Navigate global AI regulations',
    description:'EU AI Act, NIST RMF, ISO 42001, and GDPR. Ensure enterprise AI complies with the growing global web of AI regulation.',
    weeks:24, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['EU AI Act','NIST RMF','ISO 42001','GDPR','Regulatory Mapping','Compliance Programs','Legal Tech','Audit'],
    outcomes:['AI Compliance Officer','Chief Compliance Officer','Regulatory Affairs Director'],
    modules:[
      {title:'AI Regulation Landscape Overview',lessons:7},
      {title:'EU AI Act: Risk Classification & Obligations',lessons:7},
      {title:'GDPR & Data Protection for AI',lessons:7},
      {title:'NIST AI RMF in Practice',lessons:7},
      {title:'ISO 42001 & International Standards',lessons:7},
      {title:'Compliance Program Design',lessons:7},
      {title:'Regulatory Mapping & Gap Analysis',lessons:7},
      {title:'Cross-Border & Sector-Specific Rules',lessons:7},
      {title:'Audit Readiness & Evidence Management',lessons:7},
      {title:'Capstone: Enterprise AI Compliance Program',lessons:7},
    ],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p20', name:'AI Risk Manager', school:'governance', icon:'⚠️',
    tagline:'Identify and manage AI risk at enterprise scale',
    description:'Risk registers, controls, and threat modeling. Protect organizations from the operational, reputational, and financial risks of AI deployment.',
    weeks:24, salary:'$125–175K/yr', levels:'L100–L700',
    skills:['Risk Registers','Threat Modeling','Controls Design','Risk Assessment','Scenario Planning','ERM','Insurance','Reporting'],
    outcomes:['AI Risk Manager','Chief Risk Officer','Enterprise Risk Consultant'],
    modules:[
      {title:'Risk Management Foundations',lessons:7},
      {title:'AI-Specific Risk Taxonomy',lessons:7},
      {title:'AI Threat Modeling Methods',lessons:7},
      {title:'Risk Registers & Control Design',lessons:7},
      {title:'Quantitative Risk Analysis',lessons:7},
      {title:'Scenario Planning & Stress Testing',lessons:7},
      {title:'Third-Party & Supply Chain Risk',lessons:7},
      {title:'ERM Integration & Reporting',lessons:7},
      {title:'Incident Learning & Risk Culture',lessons:7},
      {title:'Capstone: Enterprise AI Risk Program',lessons:7},
    ],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p21', name:'AI Auditor', school:'governance', icon:'🔍',
    tagline:'Audit AI systems for compliance and trust',
    description:'Technical audits and third-party assessment of AI systems. Become the independent voice that enterprises and regulators trust.',
    weeks:22, salary:'$110–155K/yr', levels:'L100–L700',
    skills:['AI Auditing','Technical Assessment','Third-Party Review','Audit Reports','ISO 42001','Evidence Gathering','Documentation','Independence'],
    outcomes:['AI Auditor','Internal Audit Lead','Third-Party Assessor'],
    modules:[
      {title:'AI Auditing Foundations',lessons:7},
      {title:'Audit Standards & Frameworks',lessons:7},
      {title:'Technical AI System Assessment',lessons:7},
      {title:'Data & Model Audit Techniques',lessons:7},
      {title:'Regulatory & Compliance Audits',lessons:7},
      {title:'Evidence Gathering & Documentation',lessons:7},
      {title:'Audit Fieldwork & Sampling Methods',lessons:7},
      {title:'Audit Reporting & Findings Communication',lessons:7},
      {title:'Continuous Auditing & Monitoring',lessons:7},
      {title:'Capstone: Full AI System Audit',lessons:7},
    ],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p22', name:'AI Policy Designer', school:'governance', icon:'📝',
    tagline:'Draft AI policy for organizations and governments',
    description:'Policy drafting and regulatory engagement. Shape the rules that govern how AI is developed and deployed globally.',
    weeks:22, salary:'$105–150K/yr', levels:'L100–L700',
    skills:['Policy Drafting','Regulatory Engagement','Stakeholder Consultation','Legislative Analysis','Public Affairs','Communications','Advocacy','Research'],
    outcomes:['AI Policy Manager','Government Affairs Lead','Policy Researcher'],
    modules:[
      {title:'AI Policy Foundations',lessons:7},
      {title:'Policy Research & Evidence Gathering',lessons:7},
      {title:'Policy Drafting: Structure & Language',lessons:7},
      {title:'Regulatory Processes & Engagement',lessons:7},
      {title:'Stakeholder Consultation Methods',lessons:7},
      {title:'Legislative Analysis & Comment Letters',lessons:7},
      {title:'International Policy Comparison',lessons:7},
      {title:'Public Affairs & Advocacy',lessons:7},
      {title:'Policy Implementation & Evaluation',lessons:7},
      {title:'Capstone: National AI Policy Framework',lessons:7},
    ],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p23', name:'AI Ethics Specialist', school:'governance', icon:'🤝',
    tagline:'Build ethical frameworks for AI deployment',
    description:'Ethical frameworks and stakeholder impact assessment. Ensure AI systems reflect human values and respect the communities they affect.',
    weeks:20, salary:'$100–145K/yr', levels:'L100–L700',
    skills:['Ethics Frameworks','Stakeholder Impact','Value Alignment','Moral Philosophy','Cultural Sensitivity','Community Engagement','Reporting','Education'],
    outcomes:['AI Ethics Lead','Ethics Board Member','Academic Researcher'],
    modules:[
      {title:'Foundations of AI Ethics',lessons:7},
      {title:'Moral Philosophy for AI Practitioners',lessons:7},
      {title:'Ethical Frameworks in Practice',lessons:7},
      {title:'Stakeholder Impact Assessment',lessons:7},
      {title:'Cultural & Global Ethics Perspectives',lessons:7},
      {title:'Value Alignment & Design for Ethics',lessons:7},
      {title:'Community Engagement & Participation',lessons:7},
      {title:'Ethics Governance & Institutionalization',lessons:7},
      {title:'Communicating Ethics to Leadership',lessons:7},
      {title:'Capstone: Ethics Review for a Real AI System',lessons:7},
    ],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  // Human-AI
  { id:'p24', name:'AI UX Designer', school:'humanai', icon:'🎨',
    tagline:'Design human-centered AI experiences',
    description:'Human-centered AI design, usability research, and interaction patterns. Create AI experiences that feel natural, trustworthy, and genuinely helpful.',
    weeks:26, salary:'$100–155K/yr', levels:'L100–L700',
    skills:['UX Research','Figma','Usability Testing','AI Interaction Patterns','Prototyping','Accessibility','Design Systems','Human-Centered Design'],
    outcomes:['AI UX Designer','Principal Designer','Head of AI Experience'],
    modules:[
      {title:'UX Design Foundations',lessons:7},
      {title:'Human-Centered Design for AI',lessons:7},
      {title:'AI-Specific Interaction Patterns',lessons:7},
      {title:'User Research Methods for AI Products',lessons:7},
      {title:'Prototyping AI Interactions in Figma',lessons:7},
      {title:'Usability Testing & Iteration',lessons:7},
      {title:'Trust, Transparency & Error States',lessons:7},
      {title:'Accessibility & Inclusive AI Design',lessons:7},
      {title:'AI Design Systems & Scalability',lessons:7},
      {title:'Capstone: End-to-End AI Product Design',lessons:7},
    ],
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
  { id:'p25', name:'Conversation Designer', school:'humanai', icon:'💬',
    tagline:'Design dialogue flows for AI agents',
    description:'Dialogue flows, NLU, and chatbot/voice design. Build the conversational experiences that connect millions of users with AI systems.',
    weeks:24, salary:'$95–140K/yr', levels:'L100–L700',
    skills:['Dialogue Design','NLU','Voice UX','Chatbot Design','Rasa','Dialogflow','Persona Design','Error Handling'],
    outcomes:['Conversation Designer','Voice UX Lead','Chatbot Product Manager'],
    modules:[
      {title:'Conversation Design Foundations',lessons:7},
      {title:'NLU: Intents, Entities & Slots',lessons:7},
      {title:'Dialogue Flow Architecture',lessons:7},
      {title:'Persona Design & Tone of Voice',lessons:7},
      {title:'Error Handling & Graceful Degradation',lessons:7},
      {title:'Voice & Multimodal Conversations',lessons:7},
      {title:'Chatbot Platforms: Rasa & Dialogflow',lessons:7},
      {title:'Testing, Analytics & Optimization',lessons:7},
      {title:'LLM-Powered Conversational AI',lessons:7},
      {title:'Capstone: Enterprise Conversational AI Launch',lessons:7},
    ],
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
  { id:'p26', name:'Human-AI Interaction Specialist', school:'humanai', icon:'🔬',
    tagline:'Research how humans and AI work together',
    description:'Cognitive load, trust calibration, and behavior research. Build the evidence base for how AI systems should be designed to support human decision-making.',
    weeks:24, salary:'$95–145K/yr', levels:'L100–L700',
    skills:['Cognitive Science','Trust Research','Behavioral Studies','Eye Tracking','A/B Testing','Human Factors','Mixed Methods','Academic Writing'],
    outcomes:['Human Factors Engineer','AI Research Scientist','UX Research Lead'],
    modules:[
      {title:'Human Factors & Cognitive Science Foundations',lessons:7},
      {title:'Mental Models & AI Expectations',lessons:7},
      {title:'Trust Calibration in AI Systems',lessons:7},
      {title:'Cognitive Load & Decision Support',lessons:7},
      {title:'Quantitative Research Methods',lessons:7},
      {title:'Qualitative & Mixed Methods Research',lessons:7},
      {title:'Eye Tracking, Biometrics & Lab Studies',lessons:7},
      {title:'Behavioral Studies in Production',lessons:7},
      {title:'Translating Research to Design',lessons:7},
      {title:'Capstone: Original Human-AI Research Study',lessons:7},
    ],
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
  { id:'p27', name:'AI Workflow Designer', school:'humanai', icon:'🔄',
    tagline:'Redesign work for human-AI collaboration',
    description:'Process redesign for human-AI collaboration. Transform how teams work by intelligently integrating AI into existing workflows.',
    weeks:22, salary:'$95–140K/yr', levels:'L100–L700',
    skills:['Workflow Analysis','Human-AI Collaboration','Process Design','Change Management','RPA','N8N','Automation','Training'],
    outcomes:['Workflow Automation Lead','Future of Work Consultant','Operations Designer'],
    modules:[
      {title:'Workflow Design Fundamentals',lessons:7},
      {title:'Current-State Workflow Analysis',lessons:7},
      {title:'Human-AI Collaboration Patterns',lessons:7},
      {title:'Automation Tools: N8N, Make & RPA',lessons:7},
      {title:'Designing Future-State Workflows',lessons:7},
      {title:'Pilot Design & Testing',lessons:7},
      {title:'Change Management & Adoption',lessons:7},
      {title:'Measuring Impact & Iteration',lessons:7},
      {title:'Scaling Workflow Transformations',lessons:7},
      {title:'Capstone: Workplace AI Transformation Design',lessons:7},
    ],
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
  { id:'p28', name:'AI Experience Architect', school:'humanai', icon:'🏛️',
    tagline:'Architect end-to-end AI journeys at enterprise scale',
    description:'End-to-end AI journey design at enterprise scale. Define the experience vision that guides how employees and customers interact with AI across every touchpoint.',
    weeks:28, salary:'$120–170K/yr', levels:'L100–L700',
    skills:['Experience Architecture','Journey Mapping','Service Design','AI Touchpoints','Design Strategy','Research Ops','Systems Thinking','Executive Communication'],
    outcomes:['AI Experience Architect','Chief Experience Officer','Design Director'],
    modules:[
      {title:'Experience Architecture Foundations',lessons:7},
      {title:'Systems Thinking for AI Experiences',lessons:7},
      {title:'Journey Mapping at Enterprise Scale',lessons:7},
      {title:'Service Design for Human-AI Systems',lessons:7},
      {title:'AI Touchpoint Audit & Design',lessons:7},
      {title:'Research Ops & Insights Infrastructure',lessons:7},
      {title:'Organizational Design for Experience',lessons:7},
      {title:'Experience Governance & Standards',lessons:7},
      {title:'Experience Strategy & Executive Buy-In',lessons:7},
      {title:'Capstone: Enterprise AI Experience Blueprint',lessons:7},
    ],
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
];

const SIMS = [
  { t:'AI Agent Deployment: Enterprise Ops', c:'AI Agent Engineer', d:'3-week project', color:DS.blue, tags:['LangGraph','MCP','RAG'], locked:true },
  { t:'Cloud Security Incident Response', c:'AI Security Engineer', d:'2-week exercise', color:DS.blue, tags:['Zero Trust','Incident Response'], locked:true },
  { t:'AI Governance Audit: Financial Institution', c:'AI Governance Professional', d:'2-week audit', color:DS.gold, tags:['EU AI Act','NIST RMF'], locked:true },
  { t:'B2B SaaS AI Product Launch', c:'AI Product Manager', d:'4-week cycle', color:DS.orange, tags:['PRD','Discovery','GTM'], locked:true },
  { t:'National AI Literacy Program: Government', c:'AI Transformation Manager', d:'3-week engagement', color:DS.orange, tags:['Change Mgmt','OKRs'], locked:true },
  { t:'Data Pipeline: Retail AI Platform', c:'AI Data Engineer', d:'3-week build', color:DS.blue, tags:['dbt','Snowflake','Kafka'], locked:true },
  { t:'Conversation Design: AI Customer Service Bot', c:'Conversation Designer', d:'2-week sprint', color:DS.green, tags:['Dialogue Design','NLU'], locked:false },
  { t:'Live Sprint Simulation: Agile AI Delivery', c:'AI Program Manager', d:'2-week sprint', color:DS.orange, tags:['SAFe','Sprint Planning'], locked:false },
  { t:'Enterprise AI Ethics Review', c:'AI Ethics Specialist', d:'1-week workshop', color:DS.gold, tags:['Ethics Framework','Stakeholders'], locked:true },
  { t:'Multi-Cloud AI Migration', c:'AI Solutions Architect', d:'4-week project', color:DS.blue, tags:['AWS','Azure','GCP'], locked:true },
];

const RESOURCES = [
  { track:'⚙️ AI Engineering', color:DS.blue, items:[
      { label:'AWS Well-Architected Framework', url:'https://aws.amazon.com/architecture/well-architected/', type:'Framework' },
      { label:'Docker Documentation', url:'https://docs.docker.com/get-started/', type:'Docs' },
      { label:'LangChain Documentation', url:'https://docs.langchain.com/', type:'Docs' },
      { label:'Kubernetes Basics', url:'https://kubernetes.io/docs/tutorials/kubernetes-basics/', type:'Tutorial' },
      { label:'GitHub Actions Docs', url:'https://docs.github.com/en/actions', type:'Docs' },
  ]},
  { track:'💼 AI Business', color:DS.orange, items:[
      { label:'McKinsey AI Report 2024', url:'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai', type:'Report' },
      { label:'PMI Agile Practice Guide', url:'https://www.pmi.org/pmbok-guide-standards/agile', type:'Guide' },
      { label:'SAFe 6.0 Framework', url:'https://scaledagile.com/what-is-safe/', type:'Framework' },
      { label:'BABOK Guide', url:'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', type:'Standard' },
  ]},
  { track:'⚖️ Governance & Risk', color:DS.gold, items:[
      { label:'EU AI Act Full Text', url:'https://artificialintelligenceact.eu/', type:'Regulation' },
      { label:'NIST AI Risk Management Framework', url:'https://www.nist.gov/system/files/documents/2023/01/26/AI RMF 1.0.pdf', type:'Framework' },
      { label:'ISO 42001 Overview', url:'https://www.iso.org/standard/81230.html', type:'Standard' },
      { label:'OECD AI Principles', url:'https://oecd.ai/en/ai-principles', type:'Reference' },
  ]},
  { track:'🎨 Human-AI Experience', color:DS.green, items:[
      { label:'Google PAIR Guidebook', url:'https://pair.withgoogle.com/guidebook/', type:'Guide' },
      { label:'Microsoft HAX Toolkit', url:'https://www.microsoft.com/en-us/haxtoolkit/', type:'Toolkit' },
      { label:'NN/g AI UX Research', url:'https://www.nngroup.com/topic/ai/', type:'Research' },
      { label:'Conversation Design Institute', url:'https://www.conversationdesigninstitute.com/', type:'Course' },
  ]},
  { track:'🔐 Cybersecurity', color:'#ef4444', items:[
      { label:'CompTIA Security+ Guide', url:'https://www.comptia.org/certifications/security', type:'Cert' },
      { label:'NIST Cybersecurity Framework', url:'https://www.nist.gov/cyberframework', type:'Framework' },
      { label:'OWASP Top 10 for LLMs', url:'https://owasp.org/www-project-top-10-for-large-language-model-applications/', type:'Guide' },
  ]},
  { track:'📈 Data Analytics', color:'#10b981', items:[
      { label:'Google Data Analytics Certificate', url:'https://grow.google/certificates/data-analytics/', type:'Course' },
      { label:'Kaggle Learn', url:'https://www.kaggle.com/learn', type:'Course' },
      { label:'dbt Learn', url:'https://courses.getdbt.com/', type:'Course' },
  ]},
  { track:'☁️ DevOps & Cloud', color:'#06b6d4', items:[
      { label:'AWS Cloud Practitioner', url:'https://aws.amazon.com/certification/certified-cloud-practitioner/', type:'Cert' },
      { label:'Linux Foundation Free Courses', url:'https://training.linuxfoundation.org/resources/?_sft_content_type=free-course', type:'Course' },
      { label:'Terraform Documentation', url:'https://developer.hashicorp.com/terraform/docs', type:'Docs' },
  ]},
  { track:'🤖 AI Mastery', color:'#f59e0b', items:[
      { label:'Prompt Engineering Guide', url:'https://www.promptingguide.ai/', type:'Guide' },
      { label:'DeepLearning.AI Short Courses', url:'https://www.deeplearning.ai/short-courses/', type:'Course' },
      { label:'Hugging Face Learn', url:'https://huggingface.co/learn', type:'Reference' },
      { label:'Google AI Essentials', url:'https://grow.google/certificates/ai-essentials/', type:'Course' },
  ]},
];

interface Props { progressData?: Record<string,any>; }

const ResourceCard = ({ res }: { res: typeof RESOURCES[0] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', padding:'1.25rem', transition:'all .2s' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.75rem' }}>
        <div style={{ width:4, height:18, background:res.color, borderRadius:2 }}/>
        <span style={{ fontSize:13, fontWeight:700, color:DS.fg }}>{res.track}</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column' as const, gap:'.4rem' }}>
        {res.items.map(item => (
          <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', background:'rgba(255,255,255,.03)', border:`1px solid ${DS.border}`, borderRadius:'.45rem', textDecoration:'none', transition:'background .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.07)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.03)'}>
            <span style={{ fontSize:12, color:DS.fm }}>{item.label}</span>
            <span style={{ fontSize:10, fontWeight:700, color:res.color, background:res.color+'20', padding:'2px 7px', borderRadius:4 }}>{item.type}</span>
          </a>
        ))}
      </div>
      <button onClick={() => setOpen(!open)}
        style={{ marginTop:'.75rem', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', background: open ? res.color+'20' : 'rgba(255,255,255,.03)', border:`1px solid ${res.color}40`, borderRadius:'.45rem', cursor:'pointer' }}>
        <span style={{ fontSize:11, fontWeight:700, color:res.color }}>📖 GLOSSARY</span>
        <span style={{ fontSize:11, color:res.color }}>{open ? '▲ Hide' : '▼ Show terms'}</span>
      </button>
    </div>
  );
};


const CAREERS = [
  { name:'Conversation Designer',       school:'Human-AI Experience',    color:'#22C98A', min:75,  max:130, top:160, demand:'Growing',  remote:95, roles:['Dialogue Designer','Bot Developer','UX Writer'] },
  { name:'AI Workflow Designer',        school:'Human-AI Experience',    color:'#22C98A', min:80,  max:140, top:170, demand:'High',     remote:90, roles:['RPA Developer','Process Automation Eng.','AI Ops'] },
  { name:'AI UX Designer',             school:'Human-AI Experience',    color:'#22C98A', min:85,  max:145, top:180, demand:'High',     remote:88, roles:['Product Designer','UX Researcher','AI Experience Lead'] },
  { name:'Human-AI Interaction Spec.', school:'Human-AI Experience',    color:'#22C98A', min:88,  max:150, top:185, demand:'High',     remote:85, roles:['HCI Researcher','CX Lead','AI Interaction Designer'] },
  { name:'AI Compliance Officer',      school:'Governance & Risk',      color:'#F5B81A', min:90,  max:155, top:190, demand:'Booming',  remote:75, roles:['Compliance Analyst','Risk Officer','Regulatory Lead'] },
  { name:'Responsible AI Specialist',  school:'Governance & Risk',      color:'#F5B81A', min:92,  max:158, top:195, demand:'Booming',  remote:80, roles:['AI Ethics Lead','Trust & Safety Eng.','Policy Analyst'] },
  { name:'AI Business Analyst',        school:'Business Transformation',color:'#F0622A', min:95,  max:155, top:185, demand:'High',     remote:80, roles:['Business Analyst','Data Analyst','Process Optimizer'] },
  { name:'AI Auditor',                 school:'Governance & Risk',      color:'#F5B81A', min:95,  max:162, top:200, demand:'High',     remote:72, roles:['Model Risk Auditor','AI Assurance Lead','IA Manager'] },
  { name:'AI Ethics Specialist',       school:'Governance & Risk',      color:'#F5B81A', min:95,  max:160, top:200, demand:'High',     remote:82, roles:['AI Ethics Researcher','Trust Lead','Policy Writer'] },
  { name:'AI Experience Architect',    school:'Human-AI Experience',    color:'#22C98A', min:95,  max:165, top:210, demand:'V.High',   remote:82, roles:['Principal UX Architect','AI Product Lead','CX Architect'] },
  { name:'AI Risk Manager',            school:'Governance & Risk',      color:'#F5B81A', min:100, max:168, top:210, demand:'Booming',  remote:70, roles:['Enterprise Risk Mgr','Model Risk Analyst','CRO Advisor'] },
  { name:'AI Policy Designer',         school:'Governance & Risk',      color:'#F5B81A', min:100, max:170, top:215, demand:'High',     remote:78, roles:['Policy Strategist','Gov. Affairs Lead','AI Reg. Counsel'] },
  { name:'AI Business Operations',     school:'Business Transformation',color:'#F0622A', min:100, max:165, top:200, demand:'High',     remote:72, roles:['AI Ops Manager','Business Transformation Lead','COO Advisor'] },
  { name:'AI Sales Engineer',          school:'Business Transformation',color:'#F0622A', min:100, max:170, top:220, demand:'V.High',   remote:75, roles:['Solutions Engineer','Pre-Sales AI Lead','Tech Sales'] },
  { name:'AI Governance Professional', school:'Governance & Risk',      color:'#F5B81A', min:105, max:175, top:225, demand:'V.High',   remote:75, roles:['Chief AI Officer','Governance Director','AI Board Advisor'] },
  { name:'AI Product Manager',         school:'Business Transformation',color:'#F0622A', min:110, max:180, top:230, demand:'Booming',  remote:85, roles:['AI Product Manager','AI Product Owner','Head of AI Products'] },
  { name:'AI Solutions Consultant',    school:'Business Transformation',color:'#F0622A', min:110, max:175, top:220, demand:'V.High',   remote:80, roles:['AI Consultant','Digital Transformation Lead','Strategy Partner'] },
  { name:'AI DevOps Engineer',         school:'AI Engineering',         color:'#4A90F5', min:110, max:165, top:210, demand:'High',     remote:90, roles:['MLOps Engineer','DevOps AI Lead','Platform Engineer'] },
  { name:'AI Data Engineer',           school:'AI Engineering',         color:'#4A90F5', min:115, max:170, top:215, demand:'V.High',   remote:88, roles:['Data Engineer','ML Data Architect','Pipeline Engineer'] },
  { name:'AI Transformation Manager',  school:'Business Transformation',color:'#F0622A', min:115, max:185, top:235, demand:'High',     remote:70, roles:['Transformation Director','Change Lead','AI Program Director'] },
  { name:'AI Security Engineer',       school:'AI Engineering',         color:'#4A90F5', min:120, max:180, top:225, demand:'Booming',  remote:85, roles:['AI Security Architect','Red Team AI','Adversarial ML Eng.'] },
  { name:'AI Agent Engineer',          school:'AI Engineering',         color:'#4A90F5', min:120, max:185, top:235, demand:'Booming',  remote:92, roles:['AI Agent Developer','Autonomous Systems Eng.','LLM Engineer'] },
  { name:'AI MLOps Engineer',          school:'AI Engineering',         color:'#4A90F5', min:120, max:180, top:228, demand:'Booming',  remote:90, roles:['MLOps Engineer','Model Deployment Lead','AI Infra Eng.'] },
  { name:'AI Program Manager',         school:'Business Transformation',color:'#F0622A', min:120, max:190, top:240, demand:'High',     remote:72, roles:['Program Director','PMO AI Lead','Delivery Principal'] },
  { name:'AI Platform Engineer',       school:'AI Engineering',         color:'#4A90F5', min:125, max:195, top:245, demand:'V.High',   remote:88, roles:['Platform Engineer','AI Infra Lead','Cloud ML Architect'] },
  { name:'AI Enterprise Architect',    school:'Business Transformation',color:'#F0622A', min:130, max:200, top:260, demand:'V.High',   remote:78, roles:['Enterprise Architect','Chief Architect','CTO Advisor'] },
  { name:'AI Cloud Engineer',          school:'AI Engineering',         color:'#4A90F5', min:130, max:200, top:250, demand:'V.High',   remote:90, roles:['Cloud AI Architect','ML Infrastructure Lead','Solutions Architect'] },
  { name:'AI Solutions Architect',     school:'AI Engineering',         color:'#4A90F5', min:150, max:230, top:300, demand:'Critical', remote:85, roles:['Principal AI Architect','Chief AI Officer','Distinguished Engineer'] },
].sort((a:any,b:any) => a.min - b.min);
const DC:Record<string,string> = { 'Growing':'#22C98A','High':'#4A90F5','V.High':'#F5B81A','Booming':'#F0622A','Critical':'#E040FB' };

const CoursesSection = ({ progressData = {} }: Props) => {
  const nav = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [workforceOpen, setWorkforceOpen] = useState(true);

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      {/* ── 4 Schools Grid ── */}
      <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', overflow:'hidden', marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom: workforceOpen ? `1px solid ${DS.border}` : 'none', cursor:'pointer' }}
          onClick={() => setWorkforceOpen(o => !o)}>
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
            {/* Chevron */}
            <span style={{ fontSize:10, color:DS.fm, transition:'transform .2s', display:'inline-block', transform: workforceOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
            <div>
              <span style={{ fontSize:14, fontWeight:700, color:DS.fg }}>AI Career Opportunities</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
            <span style={{ fontSize:11, color:DS.blue, fontWeight:700, border:'1px solid '+DS.border, borderRadius:'0.4rem', padding:'3px 10px', background:'rgba(74,144,245,0.08)' }}>{workforceOpen ? 'Hide ↑' : 'Show ↓'}</span>
            
            <button
              onClick={e => { e.stopPropagation(); nav('/schools'); }}
              style={{ fontSize:12, fontWeight:700, color:DS.blue, background:'none', border:'none', cursor:'pointer' }}>
              Browse All Schools →
            </button>
          </div>
        </div>

        {/* School cards grid — collapsible */}
        {workforceOpen && <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:DS.border }}>
          <div style={{maxHeight:'9999px',overflow:'hidden',transition:'max-height 0.4s ease-in-out'}}>
    {SCHOOLS.map(school => {
            const schoolProgs = PROGRAMS.filter(p => p.school === school.id);
            const visibleProgs = schoolProgs.slice(0, 4);
            const extra = schoolProgs.length - 4;
            return (
              <div key={school.id} style={{ background:DS.bg, padding:'1.25rem', display:'grid', gridTemplateColumns:'1fr 260px', gap:'1.5rem', alignItems:'start' }}><div>
                {/* School header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                    <div style={{ width:32, height:32, borderRadius:'.5rem', background:school.colorD, border:`1px solid ${school.colorB}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{school.icon}</div>
                    <div>
                      <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.5px', textTransform:'uppercase' as const, color:school.color }}>{school.name.replace('School of ','')}</div>
                      <div style={{ fontSize:10, color:DS.fm }}>{school.count} programs</div>
                    </div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:999, background:school.colorD, color:school.color, border:`1px solid ${school.colorB}` }}>{school.count} programs</span>
                </div>

                {/* Tagline */}
                <div style={{ fontSize:11, fontWeight:800, color:school.color, letterSpacing:'.5px', marginBottom:'.35rem' }}>{school.tagline}</div>
                <div style={{ fontSize:11, color:DS.fm, lineHeight:1.5, marginBottom:'.85rem' }}>{school.desc}</div>

                {/* Program pills — clickable */}
                <div style={{ display:'flex', flexWrap:'wrap' as const, gap:'.35rem', marginBottom:'.75rem' }}>
                  {visibleProgs.map(prog => (
                    <button key={prog.id}
                      onClick={() => setSelectedProgram(prog)}
                      style={{ fontSize:11, fontWeight:600, padding:'.25rem .65rem', borderRadius:999, background:school.colorD, color:school.color, border:`1px solid ${school.colorB}`, cursor:'pointer', transition:'all .15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = school.colorB; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = school.colorD; }}>
                      {prog.name}
                    </button>
                  ))}
                  {extra > 0 && (
                    <button onClick={() => nav('/schools')}
                      style={{ fontSize:11, fontWeight:600, padding:'.25rem .65rem', borderRadius:999, background:'rgba(255,255,255,.05)', color:DS.fm, border:`1px solid ${DS.border}`, cursor:'pointer' }}>
                      +{extra} more
                    </button>
                  )}
                </div>

                {/* Footer row */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', gap:'1rem' }}>
                    <span style={{ fontSize:11, color:DS.fm }}>💰 <strong style={{ color:school.color }}>{school.salary}</strong></span>
                    <span style={{ fontSize:11, color:DS.fm }}>🏅 <strong style={{ color:DS.fg }}>L100–L700</strong></span>
                  </div>
                  <button onClick={() => nav('/schools')}
                    style={{ fontSize:12, fontWeight:700, color:school.color, background:'none', border:'none', cursor:'pointer' }}>
                    Explore →
                  </button>
                </div>
              </div>
              <div style={{ borderLeft:'1px solid #1E2D47', paddingLeft:'1.25rem' }}>
                <div style={{ fontSize:10, fontWeight:800, color:'#8596AD', letterSpacing:'.5px', textTransform:'uppercase', marginBottom:'.6rem' }}>💼 Careers & Salaries</div>
                {CAREERS.filter((c:any) => c.school === school.name).map((c:any, i:number) => (
                  <div key={i} style={{ marginBottom:'.6rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:'#EDF2F7' }}>{c.name}</span>
                      <span style={{ fontSize:9, fontWeight:700, padding:'1px 5px', borderRadius:99, background:(DC[c.demand]||'#4A90F5')+'22', color:DC[c.demand]||'#4A90F5' }}>{c.demand}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:10, color:school.color, fontWeight:700, minWidth:34 }}>${c.min}K</span>
                      <div style={{ flex:1, height:3, borderRadius:99, background:'rgba(255,255,255,.07)' }}><div style={{ width:Math.round((c.max/300)*100)+'%', height:'100%', borderRadius:99, background:'linear-gradient(90deg,'+school.color+'55,'+school.color+')' }}/></div>
                      <span style={{ fontSize:10, color:'#EDF2F7', fontWeight:700, minWidth:34, textAlign:'right' }}>${c.max}K</span>
                      <span style={{ fontSize:9, color:'#F5B81A' }}>↑${c.top}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
    </div>
        </div>}
      </div>


      {/* ── Enterprise Simulation Lab ── */}
      <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', overflow:'hidden', marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:`1px solid ${DS.border}` }}>
          <div>
            <span style={{ fontSize:14, fontWeight:700, color:DS.fg }}>Enterprise Simulation Lab</span>
            <span style={{ fontSize:12, color:DS.fm, marginLeft:8 }}>L600 · Unlock at program completion</span>
          </div>
          <span style={{ fontSize:10, fontWeight:800, color:DS.gold, letterSpacing:1 }}>NEW STANDARD</span>
        </div>
        <div style={{ padding:'.75rem 1.5rem', background:'rgba(74,144,245,.04)', borderBottom:`1px solid ${DS.border}` }}>
          <p style={{ fontSize:12, color:DS.fm, lineHeight:1.6, margin:0 }}>Every certification track has a dedicated enterprise simulation at L600. Complete L100–L500 to unlock yours.</p>
        </div>
        {SIMS.map((sim, i) => (
          <div key={i} style={{ display:'flex', alignItems:'stretch', borderBottom: i < SIMS.length-1 ? `1px solid rgba(255,255,255,.04)` : 'none', opacity: sim.locked ? .65 : 1 }}>
            <div style={{ width:4, background:sim.color, flexShrink:0 }}/>
            <div style={{ flex:1, padding:'1rem 1.25rem' }}>
              <div style={{ fontSize:13, fontWeight:700, color:DS.fg, marginBottom:2 }}>{sim.t}</div>
              <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase' as const, color:DS.fm, marginBottom:6 }}>{sim.c} · L600 ENTERPRISE SIMULATION</div>
              <div style={{ display:'flex', gap:'.35rem', flexWrap:'wrap' as const, marginBottom:4 }}>
                {sim.tags.map(tag => <span key={tag} style={{ fontSize:10, fontWeight:600, padding:'1px 7px', borderRadius:'.35rem', background:DS.muted, border:`1px solid ${DS.border}`, color:DS.fm }}>{tag}</span>)}
              </div>
              <div style={{ fontSize:11, color:DS.fm }}>{sim.d}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column' as const, alignItems:'center', justifyContent:'center', padding:'1rem', borderLeft:`1px solid rgba(255,255,255,.06)`, minWidth:110, gap:6 }}>
              {sim.locked
                ? <span style={{ fontSize:9, fontWeight:800, textTransform:'uppercase' as const, padding:'3px 8px', borderRadius:999, background:DS.gd, color:DS.gold, border:`1px solid ${DS.gb}` }}>COMING SOON</span>
                : <button onClick={() => nav('/simulation')} style={{ fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:'.45rem', background:sim.color, color:'#fff', border:'none', cursor:'pointer' }}>Start</button>
              }
              <span style={{ fontSize:10, color:DS.fm, textAlign:'center' as const }}>{sim.locked ? 'In development' : 'Available now'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Resources Library ── */}
      <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:`1px solid ${DS.border}` }}>
          <div>
            <span style={{ fontSize:14, fontWeight:700, color:DS.fg }}>Resources Library</span>
            <span style={{ fontSize:12, color:DS.fm, marginLeft:8 }}>Official sources only · Always free</span>
          </div>
          <span style={{ fontSize:10, fontWeight:600, color:DS.fm }}>8 TRACKS</span>
        </div>
        <div style={{ padding:'1.25rem', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem' }}>
          {RESOURCES.map(res => <ResourceCard key={res.track} res={res} />)}
        </div>
        <p style={{ fontSize:10, color:DS.fd, textAlign:'center' as const, padding:'.75rem', borderTop:`1px solid ${DS.border}` }}>© AWS, Google, Microsoft, NIST, EU, IIBA, PMI. Educational reference only.</p>
      </div>

      {/* ── Program Explorer drawer ── */}
      <ProgramExplorer program={selectedProgram} onClose={() => setSelectedProgram(null)} />
    </div>
  );
};

// expose DS so StudentPortal can use the muted color
const muted = '#18243A';
export { muted };
export default CoursesSection;
