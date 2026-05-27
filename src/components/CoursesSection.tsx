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
    modules:[{title:'Cloud Foundations & AI Services',lessons:8},{title:'Container Orchestration',lessons:7},{title:'Serverless AI Patterns',lessons:7},{title:'MLOps on Cloud',lessons:6},{title:'Enterprise AI Architecture',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p2', name:'AI Agent Engineer', school:'engineering', icon:'🤖',
    tagline:'Build autonomous multi-agent AI systems',
    description:'Master LLMs, LangGraph, RAG pipelines, and MCP to build production-grade autonomous agents. The most in-demand AI engineering skill of 2025–2030.',
    weeks:30, salary:'$130–200K/yr', levels:'L100–L700',
    skills:['LangGraph','RAG','MCP','LLMs','LangChain','Vector DBs','Python','Prompt Engineering'],
    outcomes:['AI Agent Engineer at AI-first companies','LLM Engineer roles','AI Research Engineering'],
    modules:[{title:'LLM Foundations',lessons:8},{title:'Retrieval & Memory',lessons:7},{title:'Multi-Agent Systems',lessons:7},{title:'Production Deployment',lessons:6},{title:'Enterprise Agent Design',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p3', name:'AI Data Engineer', school:'engineering', icon:'📊',
    tagline:'Build the data pipelines that power AI',
    description:'Master dbt, Snowflake, Kafka, and feature engineering to build enterprise-grade data infrastructure for AI and ML systems.',
    weeks:28, salary:'$115–165K/yr', levels:'L100–L700',
    skills:['dbt','Snowflake','Kafka','Spark','Airflow','Python','Feature Engineering','SQL'],
    outcomes:['Senior Data Engineer','AI Data Platform roles','ML Infrastructure Engineer'],
    modules:[{title:'Modern Data Stack',lessons:7},{title:'Stream Processing',lessons:7},{title:'Feature Engineering',lessons:7},{title:'Data Quality & Governance',lessons:6},{title:'MLOps Data Pipelines',lessons:5},{title:'Enterprise Simulation',lessons:4}],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p4', name:'AI DevOps Engineer', school:'engineering', icon:'🔧',
    tagline:'Automate and scale AI delivery pipelines',
    description:'Master CI/CD, Docker, GitOps, and AI pipeline automation. Build the infrastructure that ships AI systems reliably to production at scale.',
    weeks:28, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['CI/CD','Docker','GitOps','GitHub Actions','Jenkins','ArgoCD','Monitoring','Python'],
    outcomes:['AI DevOps Engineer','Platform Engineer','MLOps Engineer'],
    modules:[{title:'CI/CD Fundamentals',lessons:7},{title:'Container & Orchestration',lessons:7},{title:'GitOps Patterns',lessons:6},{title:'AI Pipeline Automation',lessons:6},{title:'Observability & SRE',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p5', name:'AI Security Engineer', school:'engineering', icon:'🛡️',
    tagline:'Secure AI systems at enterprise scale',
    description:'Zero trust, AI threat modeling, and red teaming. Protect enterprise AI deployments from adversarial attacks, data poisoning, and model theft.',
    weeks:26, salary:'$120–175K/yr', levels:'L100–L700',
    skills:['Zero Trust','Threat Modeling','Red Teaming','OWASP AI','Penetration Testing','IAM','SOC','SIEM'],
    outcomes:['AI Security Engineer','CISO-track roles','Cybersecurity Consultant'],
    modules:[{title:'AI Threat Landscape',lessons:7},{title:'Zero Trust Architecture',lessons:6},{title:'Red Teaming AI',lessons:6},{title:'Regulatory Compliance',lessons:6},{title:'Incident Response',lessons:5},{title:'Enterprise Simulation',lessons:4}],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p6', name:'AI MLOps Engineer', school:'engineering', icon:'🧬',
    tagline:'Operationalize ML models at enterprise scale',
    description:'Model serving, drift detection, and experiment tracking. Bridge the gap between data science and production with robust MLOps practices.',
    weeks:28, salary:'$120–170K/yr', levels:'L100–L700',
    skills:['MLflow','Kubeflow','Model Serving','Drift Detection','A/B Testing','Feast','Weights & Biases','Python'],
    outcomes:['MLOps Engineer','AI Platform Engineer','ML Infrastructure Lead'],
    modules:[{title:'ML Lifecycle Management',lessons:7},{title:'Model Serving & APIs',lessons:7},{title:'Monitoring & Drift',lessons:6},{title:'Experiment Tracking',lessons:6},{title:'Feature Stores',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p7', name:'AI Solutions Architect', school:'engineering', icon:'🏗️',
    tagline:'Design enterprise AI systems end-to-end',
    description:'Enterprise AI design, multi-cloud integration, and system architecture. Lead the technical vision for AI transformation at Fortune 500 companies.',
    weeks:32, salary:'$150–220K/yr', levels:'L100–L700',
    skills:['Enterprise Architecture','Multi-Cloud','Integration Patterns','API Design','TOGAF','Well-Architected','Scalability','Security'],
    outcomes:['AI Solutions Architect','Enterprise Architect','CTO-track technical leadership'],
    modules:[{title:'Architecture Fundamentals',lessons:8},{title:'Multi-Cloud Patterns',lessons:7},{title:'Integration & APIs',lessons:7},{title:'AI System Design',lessons:7},{title:'Enterprise Governance',lessons:7},{title:'Enterprise Simulation',lessons:4}],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  { id:'p8', name:'AI Platform Engineer', school:'engineering', icon:'⚙️',
    tagline:'Build internal developer platforms for AI teams',
    description:'Internal developer platforms and AI toolchains. Enable 10x engineering productivity by building the infrastructure layer that AI teams depend on.',
    weeks:26, salary:'$120–165K/yr', levels:'L100–L700',
    skills:['Platform Engineering','Developer Portals','Backstage','Internal APIs','Toolchains','Golden Paths','DevEx','Python'],
    outcomes:['Platform Engineer','Staff Engineer','Engineering Productivity Lead'],
    modules:[{title:'Platform Thinking',lessons:6},{title:'Developer Portals',lessons:6},{title:'AI Toolchain Design',lessons:6},{title:'Self-Service Infrastructure',lessons:6},{title:'Platform Operations',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.blue, colorD:DS.bd, colorB:DS.bb },
  // Business
  { id:'p9', name:'AI Solutions Consultant', school:'business', icon:'🧠',
    tagline:'Sell and deliver enterprise AI strategy',
    description:'Client engagement, RFP response, and AI strategy delivery. Become the trusted advisor enterprises turn to when they need to navigate AI transformation.',
    weeks:30, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['Client Engagement','RFP','AI Strategy','Consulting Frameworks','Stakeholder Management','Proposal Writing','Discovery','Delivery'],
    outcomes:['AI Strategy Consultant','Management Consulting at top firms','Independent Consultant ($200K+)'],
    modules:[{title:'Consulting Fundamentals',lessons:7},{title:'AI Strategy Frameworks',lessons:7},{title:'Client Engagement',lessons:7},{title:'RFP & Proposal',lessons:6},{title:'Delivery & Governance',lessons:7},{title:'Enterprise Simulation',lessons:4}],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p10', name:'AI Product Manager', school:'business', icon:'📱',
    tagline:'Build and ship AI-powered products',
    description:'Roadmapping, AI UX, and metric frameworks. Drive the product vision for AI features that millions of users depend on.',
    weeks:28, salary:'$120–180K/yr', levels:'L100–L700',
    skills:['Product Roadmapping','AI UX','OKRs','User Research','A/B Testing','PRD','Discovery','Agile'],
    outcomes:['AI Product Manager at FAANG','Director of Product','AI Product Lead'],
    modules:[{title:'Product Fundamentals',lessons:7},{title:'AI Feature Design',lessons:7},{title:'User Research for AI',lessons:6},{title:'Metrics & Analytics',lessons:6},{title:'Roadmap & Strategy',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p11', name:'AI Business Operations', school:'business', icon:'⚡',
    tagline:'Automate and optimize business processes with AI',
    description:'Process automation and AI workflow design. Identify inefficiencies, design AI-powered solutions, and drive measurable business impact.',
    weeks:24, salary:'$95–140K/yr', levels:'L100–L700',
    skills:['Process Automation','AI Workflows','RPA','N8N','Make','Business Analysis','Change Management','ROI Measurement'],
    outcomes:['AI Operations Lead','Business Transformation Manager','Operations Consultant'],
    modules:[{title:'Process Analysis',lessons:6},{title:'AI Automation Tools',lessons:6},{title:'Workflow Design',lessons:6},{title:'Change Management',lessons:6},{title:'ROI & Governance',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p12', name:'AI Sales Engineer', school:'business', icon:'💰',
    tagline:'Win enterprise AI deals with technical credibility',
    description:'Technical sales, POC design, and demo mastery. Bridge the gap between engineering and revenue at AI-first companies.',
    weeks:24, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['Technical Sales','POC Design','Demo Engineering','RFP Response','Objection Handling','CRM','Pricing','Negotiation'],
    outcomes:['AI Sales Engineer','Solutions Engineer','Pre-Sales Architect'],
    modules:[{title:'Sales Engineering Fundamentals',lessons:6},{title:'AI Product Knowledge',lessons:6},{title:'POC & Demo Design',lessons:6},{title:'Enterprise Sales Process',lessons:6},{title:'Winning & Closing',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p13', name:'AI Business Analyst', school:'business', icon:'📋',
    tagline:'Translate business needs into AI solutions',
    description:'Requirements, data storytelling, and stakeholder management. Be the bridge between business problems and technical AI solutions.',
    weeks:26, salary:'$95–140K/yr', levels:'L100–L700',
    skills:['Requirements','User Stories','Data Storytelling','BPMN','Gap Analysis','Stakeholder Management','Power BI','SQL'],
    outcomes:['Senior Business Analyst','AI Product Analyst','Business Intelligence Lead'],
    modules:[{title:'BA Fundamentals',lessons:6},{title:'Requirements Engineering',lessons:6},{title:'Data Analysis for BA',lessons:6},{title:'AI Solution Design',lessons:7},{title:'Stakeholder & Governance',lessons:5},{title:'Enterprise Simulation',lessons:4}],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p14', name:'AI Transformation Manager', school:'business', icon:'🔄',
    tagline:'Lead enterprise-wide AI adoption',
    description:'Change management, adoption frameworks, and OKRs. Guide organizations through the most complex transformation of our era.',
    weeks:28, salary:'$130–190K/yr', levels:'L100–L700',
    skills:['Change Management','OKRs','Adoption Frameworks','Executive Communication','Training Design','PROSCI','Stakeholder Buy-in','KPIs'],
    outcomes:['AI Transformation Manager','Chief Digital Officer','VP of AI Strategy'],
    modules:[{title:'Transformation Fundamentals',lessons:7},{title:'Change Management',lessons:7},{title:'AI Adoption Design',lessons:6},{title:'Executive Alignment',lessons:6},{title:'Measuring Success',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p15', name:'AI Program Manager', school:'business', icon:'🗓️',
    tagline:'Deliver complex AI programs on time',
    description:'SAFe, delivery, and executive reporting. Orchestrate multi-team AI programs from inception to value delivery.',
    weeks:28, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['SAFe','Program Planning','Executive Reporting','Risk Management','PI Planning','OKRs','Jira','Stakeholder Management'],
    outcomes:['AI Program Manager','Delivery Lead','Portfolio Manager'],
    modules:[{title:'Program Management Fundamentals',lessons:7},{title:'SAFe & Agile at Scale',lessons:7},{title:'Planning & Forecasting',lessons:6},{title:'Risk & Dependencies',lessons:6},{title:'Executive Reporting',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  { id:'p16', name:'AI Enterprise Architect', school:'business', icon:'🏛️',
    tagline:'Architect the enterprise for AI at scale',
    description:'EA frameworks, capability modeling, and AI integration. Define the blueprint that aligns business strategy with AI technology across the enterprise.',
    weeks:32, salary:'$140–200K/yr', levels:'L100–L700',
    skills:['TOGAF','Business Architecture','Capability Modeling','EA Frameworks','Roadmapping','Governance','Integration','Strategy'],
    outcomes:['Enterprise Architect','Chief Architect','VP of Technology'],
    modules:[{title:'EA Fundamentals',lessons:8},{title:'Business Architecture',lessons:7},{title:'AI Capability Modeling',lessons:7},{title:'Integration Architecture',lessons:7},{title:'Governance & Roadmap',lessons:7},{title:'Enterprise Simulation',lessons:4}],
    color:DS.orange, colorD:DS.od, colorB:DS.ob },
  // Governance
  { id:'p17', name:'AI Governance Professional', school:'governance', icon:'⚖️',
    tagline:'Design AI governance frameworks',
    description:'AI policy design, governance committees, and framework implementation. Build the structures that ensure AI is deployed responsibly at scale.',
    weeks:26, salary:'$120–170K/yr', levels:'L100–L700',
    skills:['AI Governance','Policy Design','Committees','NIST AI RMF','ISO 42001','Risk Management','Audit','Compliance'],
    outcomes:['AI Governance Lead','Chief AI Ethics Officer','Policy Director'],
    modules:[{title:'Governance Fundamentals',lessons:6},{title:'Framework Design',lessons:6},{title:'Policy & Standards',lessons:6},{title:'Implementation',lessons:6},{title:'Audit & Review',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p18', name:'Responsible AI Specialist', school:'governance', icon:'🛡️',
    tagline:'Make AI fair, explainable, and trustworthy',
    description:'Bias detection, fairness frameworks, and explainability. Ensure AI systems respect human rights and operate transparently.',
    weeks:24, salary:'$110–155K/yr', levels:'L100–L700',
    skills:['Bias Detection','Fairness Metrics','Explainability','XAI','SHAP','LIME','Human Rights','Impact Assessment'],
    outcomes:['Responsible AI Lead','AI Ethics Researcher','Trust & Safety Manager'],
    modules:[{title:'AI Ethics Foundations',lessons:6},{title:'Bias & Fairness',lessons:6},{title:'Explainability Tools',lessons:6},{title:'Impact Assessment',lessons:6},{title:'Responsible Deployment',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p19', name:'AI Compliance Officer', school:'governance', icon:'📜',
    tagline:'Navigate global AI regulations',
    description:'EU AI Act, NIST RMF, ISO 42001, and GDPR. Ensure enterprise AI complies with the growing global web of AI regulation.',
    weeks:24, salary:'$110–160K/yr', levels:'L100–L700',
    skills:['EU AI Act','NIST RMF','ISO 42001','GDPR','Regulatory Mapping','Compliance Programs','Legal Tech','Audit'],
    outcomes:['AI Compliance Officer','Chief Compliance Officer','Regulatory Affairs Director'],
    modules:[{title:'Regulatory Landscape',lessons:6},{title:'EU AI Act Deep Dive',lessons:6},{title:'NIST & ISO Frameworks',lessons:6},{title:'Compliance Programs',lessons:6},{title:'Cross-Border Operations',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p20', name:'AI Risk Manager', school:'governance', icon:'⚠️',
    tagline:'Identify and manage AI risk at enterprise scale',
    description:'Risk registers, controls, and threat modeling. Protect organizations from the operational, reputational, and financial risks of AI deployment.',
    weeks:24, salary:'$125–175K/yr', levels:'L100–L700',
    skills:['Risk Registers','Threat Modeling','Controls Design','Risk Assessment','Scenario Planning','ERM','Insurance','Reporting'],
    outcomes:['AI Risk Manager','Chief Risk Officer','Enterprise Risk Consultant'],
    modules:[{title:'Risk Management Foundations',lessons:6},{title:'AI Threat Modeling',lessons:6},{title:'Risk Registers & Controls',lessons:6},{title:'Quantitative Risk',lessons:6},{title:'Risk Reporting',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p21', name:'AI Auditor', school:'governance', icon:'🔍',
    tagline:'Audit AI systems for compliance and trust',
    description:'Technical audits and third-party assessment of AI systems. Become the independent voice that enterprises and regulators trust.',
    weeks:22, salary:'$110–155K/yr', levels:'L100–L700',
    skills:['AI Auditing','Technical Assessment','Third-Party Review','Audit Reports','ISO 42001','Evidence Gathering','Documentation','Independence'],
    outcomes:['AI Auditor','Internal Audit Lead','Third-Party Assessor'],
    modules:[{title:'Audit Fundamentals',lessons:5},{title:'Technical AI Auditing',lessons:6},{title:'Regulatory Audit',lessons:5},{title:'Evidence & Documentation',lessons:5},{title:'Audit Reporting',lessons:5},{title:'Enterprise Simulation',lessons:4}],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p22', name:'AI Policy Designer', school:'governance', icon:'📝',
    tagline:'Draft AI policy for organizations and governments',
    description:'Policy drafting and regulatory engagement. Shape the rules that govern how AI is developed and deployed globally.',
    weeks:22, salary:'$105–150K/yr', levels:'L100–L700',
    skills:['Policy Drafting','Regulatory Engagement','Stakeholder Consultation','Legislative Analysis','Public Affairs','Communications','Advocacy','Research'],
    outcomes:['AI Policy Manager','Government Affairs Lead','Policy Researcher'],
    modules:[{title:'Policy Fundamentals',lessons:5},{title:'Policy Drafting',lessons:6},{title:'Regulatory Engagement',lessons:5},{title:'Stakeholder Management',lessons:5},{title:'Implementation',lessons:5},{title:'Enterprise Simulation',lessons:4}],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  { id:'p23', name:'AI Ethics Specialist', school:'governance', icon:'🤝',
    tagline:'Build ethical frameworks for AI deployment',
    description:'Ethical frameworks and stakeholder impact assessment. Ensure AI systems reflect human values and respect the communities they affect.',
    weeks:20, salary:'$100–145K/yr', levels:'L100–L700',
    skills:['Ethics Frameworks','Stakeholder Impact','Value Alignment','Moral Philosophy','Cultural Sensitivity','Community Engagement','Reporting','Education'],
    outcomes:['AI Ethics Lead','Ethics Board Member','Academic Researcher'],
    modules:[{title:'AI Ethics Foundations',lessons:5},{title:'Frameworks & Principles',lessons:5},{title:'Stakeholder Impact',lessons:5},{title:'Cultural & Global Ethics',lessons:5},{title:'Operationalizing Ethics',lessons:4},{title:'Enterprise Simulation',lessons:4}],
    color:DS.gold, colorD:DS.gd, colorB:DS.gb },
  // Human-AI
  { id:'p24', name:'AI UX Designer', school:'humanai', icon:'🎨',
    tagline:'Design human-centered AI experiences',
    description:'Human-centered AI design, usability research, and interaction patterns. Create AI experiences that feel natural, trustworthy, and genuinely helpful.',
    weeks:26, salary:'$100–155K/yr', levels:'L100–L700',
    skills:['UX Research','Figma','Usability Testing','AI Interaction Patterns','Prototyping','Accessibility','Design Systems','Human-Centered Design'],
    outcomes:['AI UX Designer','Principal Designer','Head of AI Experience'],
    modules:[{title:'UX Foundations',lessons:6},{title:'AI-Specific Design Patterns',lessons:7},{title:'Research Methods',lessons:6},{title:'Prototyping AI Interactions',lessons:6},{title:'Enterprise AI Experience',lessons:5},{title:'Enterprise Simulation',lessons:4}],
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
  { id:'p25', name:'Conversation Designer', school:'humanai', icon:'💬',
    tagline:'Design dialogue flows for AI agents',
    description:'Dialogue flows, NLU, and chatbot/voice design. Build the conversational experiences that connect millions of users with AI systems.',
    weeks:24, salary:'$95–140K/yr', levels:'L100–L700',
    skills:['Dialogue Design','NLU','Voice UX','Chatbot Design','Rasa','Dialogflow','Persona Design','Error Handling'],
    outcomes:['Conversation Designer','Voice UX Lead','Chatbot Product Manager'],
    modules:[{title:'Conversation Design Foundations',lessons:6},{title:'NLU & Intent Design',lessons:6},{title:'Voice & Multimodal',lessons:6},{title:'Testing & Optimization',lessons:6},{title:'Enterprise Deployments',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
  { id:'p26', name:'Human-AI Interaction Specialist', school:'humanai', icon:'🔬',
    tagline:'Research how humans and AI work together',
    description:'Cognitive load, trust calibration, and behavior research. Build the evidence base for how AI systems should be designed to support human decision-making.',
    weeks:24, salary:'$95–145K/yr', levels:'L100–L700',
    skills:['Cognitive Science','Trust Research','Behavioral Studies','Eye Tracking','A/B Testing','Human Factors','Mixed Methods','Academic Writing'],
    outcomes:['Human Factors Engineer','AI Research Scientist','UX Research Lead'],
    modules:[{title:'Human Factors Foundations',lessons:6},{title:'Trust & Cognitive Load',lessons:6},{title:'Research Methods',lessons:6},{title:'Behavioral Studies',lessons:6},{title:'Applied Research',lessons:6},{title:'Enterprise Simulation',lessons:4}],
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
  { id:'p27', name:'AI Workflow Designer', school:'humanai', icon:'🔄',
    tagline:'Redesign work for human-AI collaboration',
    description:'Process redesign for human-AI collaboration. Transform how teams work by intelligently integrating AI into existing workflows.',
    weeks:22, salary:'$95–140K/yr', levels:'L100–L700',
    skills:['Workflow Analysis','Human-AI Collaboration','Process Design','Change Management','RPA','N8N','Automation','Training'],
    outcomes:['Workflow Automation Lead','Future of Work Consultant','Operations Designer'],
    modules:[{title:'Workflow Design Fundamentals',lessons:5},{title:'Human-AI Integration',lessons:6},{title:'Automation Tools',lessons:5},{title:'Change & Adoption',lessons:5},{title:'Measuring Impact',lessons:5},{title:'Enterprise Simulation',lessons:4}],
    color:DS.green, colorD:DS.grd, colorB:'rgba(34,201,138,.28)' },
  { id:'p28', name:'AI Experience Architect', school:'humanai', icon:'🏛️',
    tagline:'Architect end-to-end AI journeys at enterprise scale',
    description:'End-to-end AI journey design at enterprise scale. Define the experience vision that guides how employees and customers interact with AI across every touchpoint.',
    weeks:28, salary:'$120–170K/yr', levels:'L100–L700',
    skills:['Experience Architecture','Journey Mapping','Service Design','AI Touchpoints','Design Strategy','Research Ops','Systems Thinking','Executive Communication'],
    outcomes:['AI Experience Architect','Chief Experience Officer','Design Director'],
    modules:[{title:'Experience Architecture',lessons:7},{title:'AI Journey Mapping',lessons:7},{title:'Service Design',lessons:6},{title:'Organizational Design',lessons:6},{title:'Experience Strategy',lessons:6},{title:'Enterprise Simulation',lessons:4}],
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

const CoursesSection = ({ progressData = {} }: Props) => {
  const nav = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [programsCollapsed, setProgramsCollapsed] = React.useState(false);

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      {/* ── 4 Schools Grid ── */}
      <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', overflow:'hidden', marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:`1px solid ${DS.border}` }}>
          <div>
            <span style={{ fontSize:14, fontWeight:700, color:DS.fg }}>AI Workforce Programs</span>
            <span style={{ fontSize:12, color:DS.fm, marginLeft:8 }}>28 programs · 4 schools · All-Access Pass</span>
          </div>
          <button onClick={() => setProgramsCollapsed(p => !p)} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color: programsCollapsed ? DS.blue : DS.fm, background:'none', border:'1px solid '+DS.border, borderRadius:'0.4rem', padding:'3px 10px', cursor:'pointer', transition:'all 0.2s' }}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: programsCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition:'transform 0.25s ease', display:'block' }}><polyline points="6 9 12 15 18 9"/></svg>{programsCollapsed ? 'Show' : 'Hide'}</button>
          <button onClick={() => nav('/schools')} style={{ fontSize:12, fontWeight:700, color:DS.blue, background:'none', border:'none', cursor:'pointer' }}>Browse All Schools →</button>
        </div>

        {/* School cards grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:DS.border }}>
          <div style={{ maxHeight: programsCollapsed ? '0px' : '9999px', overflow:'hidden', transition:'max-height 0.4s ease-in-out' }}>
          {SCHOOLS.map(school => {
            const schoolProgs = PROGRAMS.filter(p => p.school === school.id);
            const visibleProgs = schoolProgs.slice(0, 4);
            const extra = schoolProgs.length - 4;
            return (
              <div key={school.id} style={{ background:DS.bg, padding:'1.25rem' }}>
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
                    <span style={{ fontSize:11, color:DS.fm }}>💰 <strong style={{ color:DS.fg }}>{school.salary}</strong></span>
                    <span style={{ fontSize:11, color:DS.fm }}>🏅 <strong style={{ color:DS.fg }}>L100–L700</strong></span>
                  </div>
                  <button onClick={() => nav('/schools')}
                    style={{ fontSize:12, fontWeight:700, color:school.color, background:'none', border:'none', cursor:'pointer' }}>
                    Explore →
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>
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
