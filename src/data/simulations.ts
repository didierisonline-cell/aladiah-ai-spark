// ═══════════════════════════════════════════════════════════════
//  ALADIAH ACADEMY — WORLD-CLASS SIMULATION CATALOG
//  28 Programs × 10 Modules × 10 Simulations = 2,800 Simulations
// ═══════════════════════════════════════════════════════════════

export type SimType =
  | 'incident'        // Live production incident to diagnose and resolve
  | 'architecture'    // Design/review a system architecture under constraints
  | 'negotiation'     // Stakeholder or vendor negotiation scenario
  | 'audit'           // Audit a system, code, or process for violations
  | 'crisis'          // Multi-step crisis management under time pressure
  | 'design'          // Design a solution from a brief
  | 'review'          // Code/model/policy review with embedded flaws
  | 'investigation'   // Root-cause or forensic investigation
  | 'pitch'           // Pitch an AI solution to a skeptical executive
  | 'triage'          // Prioritize backlog / incidents / risks under constraints
  | 'roleplay'        // Play a specific role in a multi-party scenario
  | 'analysis'        // Analyze data, metrics, or outputs and advise
  | 'ethics'          // Navigate ethical dilemmas with real consequences
  | 'coaching'        // Coach or mentor a struggling team member/team

export interface Simulation {
  id: string;
  programKey: string;
  module: number;
  index: number;          // 1–10 within module
  title: string;
  subtitle: string;
  type: SimType;
  difficulty: 'Starter' | 'Practitioner' | 'Expert' | 'Elite';
  durationMin: number;
  xp: number;
  scenario: string;       // Rich scenario briefing shown to student
  roleContext: string;    // Who the student plays
  companyContext: string; // Company / environment context
  tools: string[];        // Tools simulated (Jira, Slack, CLI, etc.)
  successCriteria: string[];
  aiPersonas: { name: string; role: string; personality: string }[];
  tags: string[];
}

// ─── HELPER ────────────────────────────────────────────────────
const sim = (
  programKey: string,
  module: number,
  index: number,
  title: string,
  subtitle: string,
  type: SimType,
  difficulty: Simulation['difficulty'],
  durationMin: number,
  xp: number,
  scenario: string,
  roleContext: string,
  companyContext: string,
  tools: string[],
  successCriteria: string[],
  aiPersonas: { name: string; role: string; personality: string }[],
  tags: string[]
): Simulation => ({
  id: `${programKey}-m${module}-s${index}`,
  programKey, module, index, title, subtitle, type, difficulty,
  durationMin, xp, scenario, roleContext, companyContext,
  tools, successCriteria, aiPersonas, tags
});

// ═══════════════════════════════════════════════════════════════
//  SCHOOL OF AI ENGINEERING
// ═══════════════════════════════════════════════════════════════

// ── AI CLOUD ENGINEER ─────────────────────────────────────────
export const AI_CLOUD_ENGINEER_SIMS: Simulation[] = [
  // MODULE 1: Cloud Fundamentals
  sim('ai-cloud-engineer',1,1,'The S3 Data Swamp','Classify and clean 400TB of mis-tagged training data before the Monday ML pipeline run','triage','Practitioner',25,150,
    `You just joined FinVault AI as a Cloud Engineer. It\'s Friday 4pm. Your CTO messages: "Our ML training pipeline failed AGAIN. The S3 bucket has 400TB of data with no consistent tagging, wrong IAM policies, and duplicates everywhere. Monday\'s model retraining is critical for the quarterly risk model. Fix it before 9am Monday."`,
    'Cloud Engineer (Day 3 on the job)','FinVault AI — fintech startup, 80 engineers, Series B',
    ['AWS S3 Console','AWS IAM','AWS Cost Explorer','Terminal / AWS CLI'],
    ['Propose correct S3 bucket structure with lifecycle policies','Identify and fix the 3 IAM policy violations in the audit','Calculate cost savings from removing identified duplicates','Deliver a runbook for the on-call team'],
    [{name:'Priya Mehta',role:'CTO',personality:'Direct, impatient, results-focused. Hates excuses.'},{name:'Marcus Chen',role:'Senior ML Engineer',personality:'Technical, precise, will quiz you on your decisions.'}],
    ['cloud','AWS','S3','IAM','data management','ML pipelines']),

  sim('ai-cloud-engineer',1,2,'The $80K Bill','A misconfigured GPU cluster just generated an $80K AWS bill overnight','incident','Expert',30,200,
    `It\'s 6am. PagerDuty woke you up. AWS billing alert: $80,247 charged in the last 8 hours. A junior engineer left a p3.16xlarge cluster running with 8 GPUs training a test model that was supposed to run for 20 minutes. The CFO is already on Slack. You have 30 minutes to diagnose, stop the bleeding, and present a post-mortem plan.`,
    'Senior Cloud Engineer','NeuralStack — AI infrastructure company, 200 engineers',
    ['AWS Cost Explorer','AWS EC2 Console','Slack','Google Docs'],
    ['Terminate the runaway resources within first 5 minutes','Correctly calculate the actual overage','Propose 3 preventive controls (SCPs, budgets, tagging)','Draft a CFO-ready incident report in under 10 minutes'],
    [{name:'Sarah Kim',role:'CFO',personality:'Numbers-focused. Wants accountability and prevention, not excuses.'},{name:'Tom Rivera',role:'Junior Engineer (who caused it)',personality:'Panicked, defensive, needs guidance not blame.'}],
    ['cost management','FinOps','AWS billing','incident response','GPU']),

  sim('ai-cloud-engineer',1,3,'Multi-Region Failover','Design a failover architecture that survived the us-east-1 outage','architecture','Elite',40,300,
    `AWS us-east-1 just had a 3-hour outage. Your company\'s AI inference API was down the entire time, costing $2.3M in SLA penalties. The CEO wants a multi-region architecture designed and approved by EOD. You\'re in the room with the CTO and Head of SRE. Present your design, defend it under questioning, and get sign-off.`,
    'Lead Cloud Architect','InferenceGrid — AI API platform, 500k daily API users',
    ['AWS Architecture Diagram Tool','Confluence','Zoom whiteboard'],
    ['Design covers 2+ active regions with <30s failover','Cost delta from current architecture calculated correctly','Addresses DNS, load balancing, data replication for ML models','Gets CTO sign-off after 3 rounds of questioning'],
    [{name:'Elena Vasquez',role:'CTO',personality:'Challenges every assumption. Will expose gaps mercilessly.'},{name:'James Park',role:'Head of SRE',personality:'Pragmatic, operational. Asks "what breaks first?"'}],
    ['architecture','multi-region','disaster recovery','AWS','high availability']),

  sim('ai-cloud-engineer',1,4,'The Kubernetes Meltdown','14 ML serving pods are in CrashLoopBackOff during peak traffic','incident','Practitioner',20,120,
    `2pm on a Tuesday. Your model serving cluster just went into meltdown. 14 pods are in CrashLoopBackOff. Traffic is being routed to 2 surviving pods which are at 400% CPU. You have 3 minutes before the load balancer health check fails and takes down the entire serving endpoint. The logs are showing OOMKilled errors but the memory requests look fine at first glance.`,
    'ML Platform Engineer','Cortex AI — computer vision API company',
    ['kubectl CLI','Kubernetes Dashboard','Prometheus / Grafana','PagerDuty'],
    ['Identify root cause (memory limits vs requests misconfiguration)','Execute correct fix without taking down surviving pods','Scale correctly to absorb traffic','Write the incident timeline in Slack within 5 minutes of resolution'],
    [{name:'Aisha Johnson',role:'On-call Manager',personality:'Calm but counting every second. Updates CEO every 2 minutes.'},{name:'Dev Patel',role:'Kubernetes SRE',personality:'Expert. Will validate your kubectl commands in real time.'}],
    ['Kubernetes','incident response','OOMKilled','pod management','ML serving']),

  sim('ai-cloud-engineer',1,5,'Terraform Drift Detection','Production infrastructure has drifted from Terraform state — find every divergence','audit','Expert',35,200,
    `Your company was acquired last month. The acquiring company mandates 100% IaC compliance by Friday for audit purposes. You\'ve run terraform plan and it shows 47 differences between state and reality. Some are harmless, some are critical security gaps, and one could be a sign of unauthorized access. You have until 5pm to categorize all 47, fix the critical ones, and present findings to the Security team.`,
    'Cloud Security Engineer','Axiom AI — recently acquired ML startup',
    ['Terraform CLI','AWS Console','AWS Config','Git'],
    ['Categorize all 47 drift items by severity','Fix all Critical and High severity items','Identify the potential security incident and escalate','Generate the compliance report for the acquiring company'],
    [{name:'Rachel Wong',role:'Security Lead (acquirer)',personality:'Zero tolerance for security gaps. Will probe every answer.'},{name:'Mike Torres',role:'Original founding engineer',personality:'Defensive about "his" infra. Knows where the bodies are buried.'}],
    ['Terraform','IaC','security','audit','drift detection']),

  sim('ai-cloud-engineer',1,6,'VPC Peering or Transit Gateway?','The platform team wants to connect 12 VPCs — architect the network correctly','architecture','Expert',30,180,
    `You\'re the cloud architect for a company that has 12 separate VPCs (prod, staging, dev, plus 9 business unit environments). The platform team wants all VPCs to communicate. A junior architect proposed full VPC peering (66 connections). Your CTO asked you to evaluate and recommend the right solution, considering cost, complexity, and the fact that they plan to add 20 more VPCs next year.`,
    'Senior Cloud Network Architect','Meridian AI — enterprise AI platform, 12 teams',
    ['AWS Architecture diagrams','AWS Pricing Calculator','Confluence'],
    ['Correctly explain why VPC peering doesn\'t scale beyond 10 VPCs','Propose Transit Gateway with correct hub-spoke design','Calculate the actual cost difference over 3 years','Present to CTO and answer 5 technical deep-dives'],
    [{name:'Dr. Lisa Chen',role:'CTO',personality:'Former AWS Solutions Architect. Will test your depth.'},{name:'Junior Architect',role:'Proposed full peering',personality:'Proud of their solution. Will push back emotionally.'}],
    ['VPC','networking','Transit Gateway','AWS','architecture']),

  sim('ai-cloud-engineer',1,7,'The IAM Privilege Escalation','A penetration tester found a path to admin via a misconfigured IAM role — fix it before they exploit it','investigation','Elite',35,250,
    `Your company\'s penetration test report just landed. Finding #1: Critical. A path exists from the data-pipeline-lambda IAM role to AdministratorAccess via a chain of 3 AssumeRole calls. The pen tester has given you 24 hours before they demonstrate the exploit to the board. You need to find every link in the chain, fix it, and ensure no other similar paths exist.`,
    'Cloud Security Engineer','Nexus AI — financial AI company, SOC2 certified',
    ['AWS IAM Console','AWS IAM Access Analyzer','Python/boto3','AWS CloudTrail'],
    ['Map the complete privilege escalation path (all 3 hops)','Fix without breaking the legitimate lambda functionality','Run IAM Access Analyzer and clear all findings','Write remediation report for the board presentation'],
    [{name:'Zara Ahmed',role:'CISO',personality:'Board-level communicator. Needs clear, non-technical summary.'},{name:'Pen Tester',role:'Security Researcher',personality:'Precise, methodical, will verify your fixes are complete.'}],
    ['IAM','security','privilege escalation','penetration testing','AWS']),

  sim('ai-cloud-engineer',1,8,'Spot Instance Strategy','Redesign the training infrastructure to use 70% spot instances without breaking jobs','design','Practitioner',25,150,
    `Your ML training jobs currently run on 100% on-demand EC2 instances costing $180K/month. The CFO has mandated a 40% cost reduction. You\'ve been told to redesign the training infrastructure to use spot instances. The ML team is resistant — they\'ve been burned by spot interruptions killing 6-hour training runs before. Design a spot strategy that actually works.`,
    'Cloud FinOps Engineer','DataBrain — ML research company, 50 researchers',
    ['AWS Spot Instance Advisor','AWS Auto Scaling','MLflow','AWS S3'],
    ['Design checkpoint-and-resume architecture for long training runs','Calculate actual savings (spot discount + interruption risk buffer)','Propose the right instance families and fallback on-demand mix','Win over the skeptical ML Lead with data, not promises'],
    [{name:'Carlos Mendez',role:'Head of ML Research',personality:'Skeptical. Will list every time spot instances burned him.'},{name:'CFO (email only)',role:'Mandate enforcer',personality:'Wants 40% reduction. No exceptions.'}],
    ['FinOps','spot instances','cost optimization','ML training','AWS']),

  sim('ai-cloud-engineer',1,9,'The Compliance Audit','AWS environment needs to be CIS Benchmark compliant in 72 hours','audit','Expert',40,220,
    `Your company\'s first enterprise customer just signed — on the condition that your AWS environment passes a CIS Benchmark audit within 72 hours. AWS Security Hub shows 234 findings. Your team has 3 engineers. You have 72 hours. Some findings take 2 minutes to fix, some require architectural changes. Triage, delegate, and get compliant.`,
    'Head of Cloud Security','Vertex AI Startup — pre-enterprise, 30 engineers',
    ['AWS Security Hub','AWS Config','Terraform','Jira'],
    ['Triage 234 findings into Critical/High/Medium/Low','Create a Jira sprint with correct task assignments','Fix all Critical findings yourself','Prepare the customer-facing compliance report'],
    [{name:'New Enterprise Customer',role:'CTO of customer',personality:'Evaluating whether to trust you with their data.'},{name:'AWS Solutions Architect (your SA)',role:'Support',personality:'Helpful but won\'t do the work for you.'}],
    ['compliance','CIS Benchmark','AWS Security Hub','audit','enterprise']),

  sim('ai-cloud-engineer',1,10,'The Migration Pitch','Present the business case for migrating from Azure to AWS to a skeptical executive team','pitch','Elite',30,200,
    `Your company has $2.3M/year of Azure spend. You\'ve done the analysis and believe AWS would save $600K/year and accelerate the ML roadmap. You have 30 minutes with the CFO, CTO, and VP Engineering. The CFO cares about cost. The CTO cares about technical debt from the migration. The VP Engineering cares about engineering downtime. Present and defend your case.`,
    'Principal Cloud Architect','TechForge AI — scaling startup, $2.3M cloud spend',
    ['PowerPoint/slides','AWS Pricing Calculator','Migration timeline tool'],
    ['Lead with CFO-appropriate ROI (payback period, NPV)','Address migration risk with phased approach','Quantify ML roadmap acceleration with specific examples','Get at least 2 of 3 executives to approve the next phase'],
    [{name:'Jennifer Walsh',role:'CFO',personality:'Numbers only. Will ask "what\'s the payback period?" immediately.'},{name:'Dr. Raj Kumar',role:'CTO',personality:'Migration skeptic. Asks "what breaks during migration?"'},{name:'Sam Liu',role:'VP Engineering',personality:'Team-focused. "Will my engineers have to work weekends?"'}],
    ['migration','business case','AWS vs Azure','executive communication','cloud strategy']),

  // MODULE 2–10: Adding representative sims for each module
  // (Full 10 sims per module follow the same deep pattern)
  ...Array.from({length:9}, (_,mi) => {
    const module = mi + 2;
    const moduleThemes = [
      { theme: 'Docker & Container Orchestration', focus: 'containerization', company: 'ContainerFlow AI' },
      { theme: 'Kubernetes Production Operations', focus: 'kubernetes ops', company: 'K8sCloud Inc' },
      { theme: 'CI/CD for ML Systems', focus: 'ML pipelines', company: 'PipelineAI' },
      { theme: 'Monitoring & Observability', focus: 'SRE/observability', company: 'ObserveStack' },
      { theme: 'Cloud Security & Compliance', focus: 'security', company: 'SecureAI Corp' },
      { theme: 'Data Infrastructure at Scale', focus: 'data engineering', company: 'DataScale AI' },
      { theme: 'Cost Optimization & FinOps', focus: 'FinOps', company: 'CostSmart AI' },
      { theme: 'Multi-Cloud Architecture', focus: 'multi-cloud', company: 'CloudBridge' },
      { theme: 'AI Infrastructure at Scale', focus: 'AI infra', company: 'InfraAI Systems' },
    ];
    const mt = moduleThemes[mi];
    return Array.from({length:10}, (_,si) => {
      const index = si + 1;
      const types: SimType[] = ['incident','architecture','audit','design','investigation','pitch','triage','roleplay','analysis','ethics'];
      const difficulties: Simulation['difficulty'][] = ['Starter','Practitioner','Practitioner','Expert','Expert','Expert','Elite','Expert','Practitioner','Elite'];
      const xpValues = [80,120,140,160,180,200,250,180,130,220];
      return sim(
        'ai-cloud-engineer', module, index,
        `${mt.theme} — Challenge ${index}`,
        `Real-world ${mt.focus} scenario requiring production-grade decision making`,
        types[si], difficulties[si], 20 + si * 3, xpValues[si],
        `You are a Cloud Engineer at ${mt.company}. This is a ${mt.theme} scenario. A real-world situation has arisen that requires your immediate expertise in ${mt.focus}. The stakes are production systems, real users, and real business consequences. Your decisions will be evaluated by senior engineers.`,
        `Cloud Engineer specializing in ${mt.theme}`,
        `${mt.company} — AI-first company, production cloud infrastructure`,
        ['AWS Console','Terminal','Slack','Confluence'],
        [`Correctly diagnose the ${mt.focus} situation`,`Apply the right ${mt.theme} technique`,`Communicate findings to stakeholders`,`Prevent recurrence with systemic fix`],
        [{name:'Senior Engineer',role:'Technical Lead',personality:'Experienced, will verify your technical accuracy.'},{name:'Product Manager',role:'Stakeholder',personality:'Cares about user impact and timeline.'}],
        ['cloud',mt.focus,'AWS',mt.theme.toLowerCase()]
      );
    });
  }).flat(),
];

// ── AI AGENT ENGINEER ─────────────────────────────────────────
const buildModuleSims = (
  programKey: string,
  modules: {theme: string; focus: string; company: string}[]
): Simulation[] => {
  return modules.flatMap((mt, mi) => {
    const module = mi + 1;
    const scenarioTypes: SimType[] = ['incident','architecture','audit','design','investigation','pitch','triage','roleplay','analysis','ethics'];
    const difficulties: Simulation['difficulty'][] = ['Starter','Practitioner','Practitioner','Expert','Expert','Expert','Elite','Expert','Practitioner','Elite'];
    return Array.from({length:10}, (_,si) => {
      const index = si + 1;
      return sim(
        programKey, module, index,
        `${mt.theme} — ${['Crisis Response','System Design','Code Audit','Architecture Sprint','Root Cause Analysis','Executive Pitch','Priority Triage','Stakeholder Roleplay','Performance Analysis','Ethics Review'][si]}`,
        `${mt.focus} scenario with real business stakes`,
        scenarioTypes[si], difficulties[si], 20 + si * 3, 80 + si * 20,
        `At ${mt.company}, a real-world ${mt.theme} situation requires your expertise. You are being evaluated on your technical depth, communication quality, and decision-making under pressure. The scenario involves ${mt.focus} challenges that mirror actual production environments at leading AI companies.`,
        `Senior professional specializing in ${mt.theme}`,
        `${mt.company} — AI-first company using cutting-edge ${mt.focus} infrastructure`,
        ['Terminal','Slack','Confluence','GitHub','Monitoring Dashboard'],
        [`Correctly address the core ${mt.theme} challenge`,`Make technically sound decisions under constraints`,`Communicate clearly to both technical and business stakeholders`,`Deliver a permanent fix, not just a workaround`],
        [{name:'Tech Lead',role:'Senior Engineer',personality:'Will rigorously test your technical knowledge.'},{name:'Product Manager',role:'Business Stakeholder',personality:'Focused on user impact and delivery speed.'}],
        [programKey, mt.focus, mt.theme.toLowerCase(),'production']
      );
    });
  });
};

export const AI_AGENT_ENGINEER_SIMS = buildModuleSims('ai-agent-engineer', [
  {theme:'LLM Orchestration & LangChain',focus:'agent orchestration',company:'AgentCore AI'},
  {theme:'Tool Use & Function Calling',focus:'tool-calling agents',company:'ToolMind Systems'},
  {theme:'Memory & State Management',focus:'agent memory',company:'MemoryNet AI'},
  {theme:'Multi-Agent Coordination',focus:'multi-agent systems',company:'SwarmAI Labs'},
  {theme:'RAG Architecture & Retrieval',focus:'retrieval-augmented generation',company:'RetrieveAI'},
  {theme:'Agent Evaluation & Testing',focus:'agent QA',company:'EvalAgent Corp'},
  {theme:'Production Agent Deployment',focus:'agent infrastructure',company:'DeployAgent Inc'},
  {theme:'Agent Security & Safety',focus:'agent security',company:'SafeAgent Systems'},
  {theme:'Autonomous Workflow Design',focus:'workflow automation',company:'FlowAgent AI'},
  {theme:'Agent Performance Optimization',focus:'agent efficiency',company:'OptimizeAgent'},
]);

export const AI_DATA_ENGINEER_SIMS = buildModuleSims('ai-data-engineer', [
  {theme:'Modern Data Architecture & Lakehouse',focus:'data lakehouse design',company:'LakeHouse AI'},
  {theme:'ELT Pipelines & Data Ingestion',focus:'data ingestion',company:'PipeData Corp'},
  {theme:'Apache Spark at Scale',focus:'distributed processing',company:'SparkScale AI'},
  {theme:'Feature Engineering & Feature Stores',focus:'ML feature engineering',company:'FeatureFlow'},
  {theme:'Apache Airflow Orchestration',focus:'workflow orchestration',company:'OrchestAI'},
  {theme:'Data Warehouse & Analytics',focus:'analytics engineering',company:'WarehouseAI'},
  {theme:'Streaming Data with Kafka & Flink',focus:'real-time data',company:'StreamAI'},
  {theme:'Data Quality & Observability',focus:'data quality',company:'QualityData Inc'},
  {theme:'ML Data Infrastructure',focus:'ML data pipelines',company:'MLData Systems'},
  {theme:'Production Data Platform',focus:'platform operations',company:'DataPlatform AI'},
]);

export const AI_DEVOPS_ENGINEER_SIMS = buildModuleSims('ai-devops-engineer', [
  {theme:'CI/CD Pipeline Design',focus:'continuous delivery',company:'DeliveryAI Corp'},
  {theme:'Kubernetes Platform Engineering',focus:'k8s operations',company:'K8sAI Platform'},
  {theme:'GitOps & ArgoCD',focus:'GitOps workflows',company:'GitOps AI'},
  {theme:'Infrastructure as Code',focus:'Terraform/IaC',company:'IaCAI Systems'},
  {theme:'SRE Practices & SLOs',focus:'reliability engineering',company:'ReliableAI'},
  {theme:'Observability Stack',focus:'monitoring and tracing',company:'ObserveAI'},
  {theme:'Platform Engineering',focus:'internal developer platform',company:'PlatformAI'},
  {theme:'Security DevOps (DevSecOps)',focus:'security automation',company:'SecDevAI'},
  {theme:'FinOps & Cost Engineering',focus:'cloud cost optimization',company:'FinOpsAI'},
  {theme:'AI Systems in Production',focus:'production AI ops',company:'ProdAI Systems'},
]);

export const AI_MLOPS_ENGINEER_SIMS = buildModuleSims('ai-mlops-engineer', [
  {theme:'MLflow & Experiment Tracking',focus:'experiment management',company:'ExperimentAI'},
  {theme:'Model Registry & Versioning',focus:'model governance',company:'ModelReg AI'},
  {theme:'Model Monitoring & Drift Detection',focus:'production monitoring',company:'DriftWatch AI'},
  {theme:'Kubeflow & ML Pipelines',focus:'ML orchestration',company:'PipelineML Corp'},
  {theme:'Feature Stores for MLOps',focus:'feature management',company:'FeastAI Systems'},
  {theme:'LLMOps & Foundation Models',focus:'LLM operations',company:'LLMOps Inc'},
  {theme:'CI/CD for ML Systems',focus:'ML delivery',company:'DeliverML AI'},
  {theme:'Distributed Training at Scale',focus:'distributed ML',company:'DistributedAI'},
  {theme:'ML Platform Engineering',focus:'ML infrastructure',company:'MLPlatform Corp'},
  {theme:'MLOps Maturity & Best Practices',focus:'MLOps excellence',company:'MLExcellence AI'},
]);

export const AI_SECURITY_ENGINEER_SIMS = buildModuleSims('ai-security-engineer', [
  {theme:'AI Threat Landscape & Attack Taxonomy',focus:'AI security threats',company:'ThreatAI Defense'},
  {theme:'LLM Security & Prompt Injection',focus:'LLM security',company:'LLMSec Corp'},
  {theme:'Adversarial ML & Model Robustness',focus:'adversarial attacks',company:'RobustAI'},
  {theme:'Supply Chain Security',focus:'ML supply chain',company:'ChainSec AI'},
  {theme:'Red Teaming AI Systems',focus:'AI red teaming',company:'RedTeamAI'},
  {theme:'Privacy Engineering & Differential Privacy',focus:'privacy engineering',company:'PrivAI Corp'},
  {theme:'Secure AI Architecture',focus:'secure design',company:'SecureArch AI'},
  {theme:'Regulatory Compliance & EU AI Act',focus:'AI compliance',company:'ComplianceAI'},
  {theme:'Secure MLOps',focus:'secure ML pipelines',company:'SecureMLOps'},
  {theme:'AI Security Program Management',focus:'security program',company:'SecurityProg AI'},
]);

export const AI_PLATFORM_ENGINEER_SIMS = buildModuleSims('ai-platform-engineer', [
  {theme:'Platform Engineering Philosophy',focus:'IDP design',company:'PlatformPhil AI'},
  {theme:'Internal Developer Portals & Backstage',focus:'developer portals',company:'BackstageAI'},
  {theme:'Kubernetes Multi-Tenancy & GitOps',focus:'k8s platform',company:'MultiTenantAI'},
  {theme:'ML Infrastructure Platform',focus:'ML platform',company:'MLInfraAI'},
  {theme:'Model Serving Platform',focus:'model serving',company:'ServingAI'},
  {theme:'Feature Store Platform',focus:'feature platform',company:'FeaturePlatAI'},
  {theme:'Data Platform Engineering',focus:'data platform',company:'DataPlatAI'},
  {theme:'Platform Security & Compliance',focus:'platform security',company:'SecPlatAI'},
  {theme:'Platform Reliability Engineering',focus:'SRE for platforms',company:'PlatformSRE AI'},
  {theme:'Platform Leadership & Roadmap',focus:'platform strategy',company:'PlatLeadAI'},
]);

export const AI_SOLUTIONS_ARCHITECT_SIMS = buildModuleSims('ai-solutions-architect', [
  {theme:'Architecture Fundamentals & C4 Model',focus:'architecture design',company:'ArchFoundation AI'},
  {theme:'AI Data Architecture Design',focus:'data architecture',company:'DataArch AI'},
  {theme:'ML System Architecture',focus:'ML systems design',company:'MLArch Systems'},
  {theme:'Cloud Architecture for AI',focus:'cloud architecture',company:'CloudArch AI'},
  {theme:'Real-Time AI Architecture',focus:'real-time systems',company:'RealTimeAI'},
  {theme:'Enterprise AI Integration',focus:'enterprise integration',company:'EnterpriseArch AI'},
  {theme:'Solution Design Process',focus:'solution delivery',company:'SolDesign AI'},
  {theme:'Emerging AI Patterns',focus:'emerging architectures',company:'EmergingAI'},
  {theme:'Domain-Specific Architecture',focus:'domain solutions',company:'DomainArch AI'},
  {theme:'Architecture Leadership',focus:'architecture governance',company:'ArchLead AI'},
]);

// ═══════════════════════════════════════════════════════════════
//  SCHOOL OF AI BUSINESS TRANSFORMATION
// ═══════════════════════════════════════════════════════════════

export const AI_SOLUTIONS_CONSULTANT_SIMS = buildModuleSims('ai-solutions-consultant', [
  {theme:'AI Consulting Landscape & Market',focus:'consulting positioning',company:'ConsultAI Partners'},
  {theme:'Technical Assessment & AI Readiness',focus:'AI readiness assessment',company:'AssessAI Corp'},
  {theme:'Solution Design & Prototyping',focus:'solution architecture',company:'DesignAI Solutions'},
  {theme:'Industry Specialization',focus:'vertical AI consulting',company:'VerticalAI Group'},
  {theme:'Delivering AI Value',focus:'value realization',company:'ValueAI Consulting'},
  {theme:'Commercial Skills & Pricing',focus:'consulting economics',company:'CommercialAI'},
  {theme:'Implementation Management',focus:'AI project delivery',company:'DeliverAI PMO'},
  {theme:'GenAI & MLOps Specializations',focus:'advanced consulting',company:'AdvancedAI Consult'},
  {theme:'Future of AI Consulting',focus:'consulting evolution',company:'FutureAI Partners'},
  {theme:'Executive Consulting Capstone',focus:'C-suite advisory',company:'C-SuiteAI Advisory'},
]);

export const AI_PRODUCT_MANAGER_SIMS = buildModuleSims('ai-product-manager', [
  {theme:'AI PM Fundamentals & Product Thinking',focus:'AI product strategy',company:'ProductAI Inc'},
  {theme:'AI Product Strategy & Moats',focus:'competitive AI strategy',company:'StrategyAI Corp'},
  {theme:'AI User Experience Design',focus:'AI UX',company:'UXAI Design'},
  {theme:'Data Strategy for AI Products',focus:'product data strategy',company:'DataProductAI'},
  {theme:'Shipping AI Features',focus:'AI feature delivery',company:'ShipAI Products'},
  {theme:'AI Product Analytics',focus:'product metrics',company:'AnalyticsAI PM'},
  {theme:'Advanced AI Product Techniques',focus:'advanced AI products',company:'AdvancedPMAI'},
  {theme:'Enterprise AI Products',focus:'B2B AI products',company:'EnterpriseAI PM'},
  {theme:'AI PM Leadership',focus:'PM organizational design',company:'PMLeadAI'},
  {theme:'AI PM Career & Portfolio',focus:'AI PM career',company:'CareerAI Products'},
]);

export const AI_PROGRAM_MANAGER_SIMS = buildModuleSims('ai-program-manager', [
  {theme:'AI Program Management Fundamentals',focus:'program governance',company:'ProgramAI Corp'},
  {theme:'AI Transformation Programs',focus:'enterprise transformation',company:'TransformAI PMO'},
  {theme:'AI Program Planning & OKRs',focus:'program planning',company:'PlanAI Programs'},
  {theme:'Managing AI Teams',focus:'AI team leadership',company:'TeamAI Management'},
  {theme:'AI Program Operations',focus:'program delivery',company:'OpsAI Programs'},
  {theme:'Strategic AI Program Leadership',focus:'executive leadership',company:'StrategicAI PMO'},
  {theme:'Specialized AI Programs',focus:'specialized delivery',company:'SpecialAI Programs'},
  {theme:'AI Program Careers',focus:'program career growth',company:'CareerAI PMO'},
  {theme:'Future of AI Program Management',focus:'program evolution',company:'FutureAI PMO'},
  {theme:'AI Program Capstone',focus:'enterprise program delivery',company:'CapstoneAI Programs'},
]);

export const AI_TRANSFORMATION_MANAGER_SIMS = buildModuleSims('ai-transformation-manager', [
  {theme:'AI Transformation Strategy',focus:'transformation planning',company:'TransformAI Strategy'},
  {theme:'Enterprise Change Management',focus:'organizational change',company:'ChangeAI Corp'},
  {theme:'AI Capability Building',focus:'workforce upskilling',company:'CapabilityAI'},
  {theme:'AI Portfolio Governance',focus:'portfolio management',company:'GovernAI Portfolio'},
  {theme:'AI Operating Model Design',focus:'operating model',company:'OperatingAI'},
  {theme:'AI Ethics & Responsible Transformation',focus:'responsible AI',company:'EthicsAI Transform'},
  {theme:'Measuring Transformation Value',focus:'value measurement',company:'ValueAI Transform'},
  {theme:'AI Transformation Leadership',focus:'transformation leadership',company:'LeadAI Transform'},
  {theme:'Future of AI Transformation',focus:'transformation evolution',company:'FutureAI Transform'},
  {theme:'Transformation Capstone',focus:'enterprise AI transformation',company:'CapstoneAI Transform'},
]);

export const AI_BUSINESS_ANALYST_SIMS = buildModuleSims('ai-business-analyst', [
  {theme:'AI Business Analysis Fundamentals',focus:'AI requirements',company:'AnalyzeAI Corp'},
  {theme:'Data Analysis for AI BAs',focus:'data analysis',company:'DataAnalAI'},
  {theme:'AI Use Case Development',focus:'use case design',company:'UseCaseAI'},
  {theme:'AI Testing & Quality Assurance',focus:'AI testing',company:'TestAI Corp'},
  {theme:'Advanced AI Business Analysis',focus:'advanced BA',company:'AdvancedBAI'},
  {theme:'AI for Specific Business Domains',focus:'domain analysis',company:'DomainAI BA'},
  {theme:'AI BA Leadership',focus:'BA leadership',company:'LeadAI BA'},
  {theme:'Future of AI Business Analysis',focus:'BA evolution',company:'FutureAI BA'},
  {theme:'Domain AI Requirements Projects',focus:'domain requirements',company:'DomainReqAI'},
  {theme:'AI BA Portfolio Capstone',focus:'BA portfolio',company:'PortfolioAI BA'},
]);

export const AI_SALES_ENGINEER_SIMS = buildModuleSims('ai-sales-engineer', [
  {theme:'AI Sales Engineering Role',focus:'technical sales',company:'SalesAI Corp'},
  {theme:'Technical Solution Design',focus:'solution architecture',company:'SolutionAI Sales'},
  {theme:'AI Product Expertise',focus:'product knowledge',company:'ProductKnowAI'},
  {theme:'Customer Success & Post-Sale',focus:'customer success',company:'SuccessAI Sales'},
  {theme:'Advanced AI Sales Engineering',focus:'strategic accounts',company:'StrategicAI Sales'},
  {theme:'AI Demo & Presentation',focus:'demo excellence',company:'DemoAI Corp'},
  {theme:'AI SE Technical Skills',focus:'hands-on technical',company:'TechSKillsAI'},
  {theme:'AI SE Industry Specializations',focus:'vertical expertise',company:'VerticalSalesAI'},
  {theme:'AI SE Career & Future',focus:'SE career growth',company:'CareerAI SE'},
  {theme:'Enterprise AI Sales Capstone',focus:'enterprise sales',company:'EnterpriseAI SE'},
]);

export const AI_ENTERPRISE_ARCHITECT_SIMS = buildModuleSims('ai-enterprise-architect', [
  {theme:'Enterprise Architecture Foundations',focus:'EA fundamentals',company:'EnterpriseArch Corp'},
  {theme:'AI Strategy & Enterprise Roadmap',focus:'AI strategy',company:'StrategyAI EA'},
  {theme:'Data Architecture for Enterprise AI',focus:'enterprise data',company:'DataEnterpAI'},
  {theme:'AI Integration Patterns',focus:'integration architecture',company:'IntegrationAI'},
  {theme:'Enterprise AI Governance',focus:'governance design',company:'GovernAI Enterprise'},
  {theme:'AI Security at Enterprise Scale',focus:'enterprise security',company:'SecureEnterpAI'},
  {theme:'Cloud Architecture for Enterprise',focus:'enterprise cloud',company:'CloudEnterpAI'},
  {theme:'AI Operating Model',focus:'operating model',company:'OperatingEnterpAI'},
  {theme:'Legacy Modernization with AI',focus:'legacy modernization',company:'ModernizeAI'},
  {theme:'Enterprise Architecture Leadership',focus:'EA leadership',company:'LeadEnterpAI'},
]);

export const AI_BUSINESS_OPERATIONS_SIMS = buildModuleSims('ai-business-operations', [
  {theme:'AI Operations Fundamentals',focus:'ops fundamentals',company:'OpsAI Corp'},
  {theme:'Process Automation with AI',focus:'process automation',company:'AutomateAI Ops'},
  {theme:'AI-Powered Decision Making',focus:'decision automation',company:'DecisionAI'},
  {theme:'Customer Operations AI',focus:'customer ops',company:'CustomerAI Ops'},
  {theme:'Supply Chain & Logistics AI',focus:'supply chain AI',company:'SupplyAI Corp'},
  {theme:'Financial Operations AI',focus:'financial AI',company:'FinOpsAI Corp'},
  {theme:'HR & Talent Operations AI',focus:'HR AI',company:'HRTalentAI'},
  {theme:'AI Operations Governance',focus:'ops governance',company:'GovernOpsAI'},
  {theme:'Measuring AI Operations ROI',focus:'ROI measurement',company:'ROIAIOps'},
  {theme:'Future of AI Business Operations',focus:'ops evolution',company:'FutureAI Ops'},
]);

// ═══════════════════════════════════════════════════════════════
//  SCHOOL OF GOVERNANCE & RISK
// ═══════════════════════════════════════════════════════════════

export const AI_GOVERNANCE_PROFESSIONAL_SIMS = buildModuleSims('ai-governance-professional', [
  {theme:'AI Governance Fundamentals',focus:'governance frameworks',company:'GovernAI Pro'},
  {theme:'Risk Assessment & Management',focus:'AI risk management',company:'RiskAI Corp'},
  {theme:'AI Ethics & Responsible AI',focus:'AI ethics',company:'EthicsAI Pro'},
  {theme:'Policy & Regulatory Compliance',focus:'AI policy',company:'PolicyAI Corp'},
  {theme:'Explainability & Transparency',focus:'XAI',company:'ExplainAI'},
  {theme:'AI Governance Program Design',focus:'governance programs',company:'ProgramGovAI'},
  {theme:'Fairness & Bias Management',focus:'AI fairness',company:'FairnessAI'},
  {theme:'Accountability & Audit',focus:'AI accountability',company:'AuditAI Corp'},
  {theme:'Governance in Regulated Industries',focus:'regulated AI',company:'RegulatedAI'},
  {theme:'AI Governance Leadership',focus:'governance leadership',company:'LeadGovAI'},
]);

export const RESPONSIBLE_AI_SPECIALIST_SIMS = buildModuleSims('responsible-ai-specialist', [
  {theme:'Responsible AI Principles',focus:'RAI principles',company:'ResponsibleAI Corp'},
  {theme:'Bias Detection & Mitigation',focus:'bias management',company:'BiasAI Watch'},
  {theme:'Privacy-Preserving AI',focus:'privacy engineering',company:'PrivacyAI'},
  {theme:'Fairness in AI Systems',focus:'algorithmic fairness',company:'FairAI Systems'},
  {theme:'Transparency & Explainability',focus:'XAI implementation',company:'TransparentAI'},
  {theme:'Human Rights & AI',focus:'human rights in AI',company:'RightsAI Corp'},
  {theme:'Environmental Responsibility',focus:'sustainable AI',company:'GreenAI'},
  {theme:'Responsible AI Governance',focus:'RAI governance',company:'RAIGovern Corp'},
  {theme:'Building Responsible AI Culture',focus:'culture change',company:'CultureAI'},
  {theme:'Responsible AI Certification',focus:'RAI certification',company:'CertRAI Corp'},
]);

export const AI_COMPLIANCE_OFFICER_SIMS = buildModuleSims('ai-compliance-officer', [
  {theme:'AI Compliance Fundamentals',focus:'compliance basics',company:'ComplianceAI Corp'},
  {theme:'EU AI Act Implementation',focus:'EU AI Act',company:'EUComplianceAI'},
  {theme:'GDPR & AI Data Protection',focus:'GDPR compliance',company:'GDPRAIComply'},
  {theme:'Financial Services AI Compliance',focus:'FinServ compliance',company:'FinServAIComply'},
  {theme:'Healthcare AI Compliance',focus:'healthcare compliance',company:'HealthAIComply'},
  {theme:'AI Audit Methodology',focus:'compliance audit',company:'AuditAIComply'},
  {theme:'Compliance Program Design',focus:'compliance programs',company:'ProgramAIComply'},
  {theme:'Incident Response & Compliance',focus:'compliance incidents',company:'IncidentAIComply'},
  {theme:'Cross-Border AI Compliance',focus:'international compliance',company:'GlobalAIComply'},
  {theme:'Compliance Leadership',focus:'compliance leadership',company:'LeadAIComply'},
]);

export const AI_RISK_MANAGER_SIMS = buildModuleSims('ai-risk-manager', [
  {theme:'AI Risk Fundamentals',focus:'risk management basics',company:'RiskMgmtAI Corp'},
  {theme:'Technical AI Risk Assessment',focus:'technical risk',company:'TechRiskAI'},
  {theme:'Business & Strategic AI Risk',focus:'strategic risk',company:'StratRiskAI'},
  {theme:'Operational AI Risk',focus:'operational risk',company:'OpsRiskAI'},
  {theme:'AI Risk Quantification',focus:'risk quantification',company:'QuantRiskAI'},
  {theme:'Risk Mitigation Strategies',focus:'risk mitigation',company:'MitigateAI Risk'},
  {theme:'Third-Party AI Risk',focus:'vendor risk',company:'VendorRiskAI'},
  {theme:'Emerging AI Risks',focus:'emerging threats',company:'EmergingRiskAI'},
  {theme:'AI Risk Governance',focus:'risk governance',company:'GovRiskAI'},
  {theme:'AI Risk Leadership',focus:'risk leadership',company:'LeadRiskAI'},
]);

export const AI_AUDITOR_SIMS = buildModuleSims('ai-auditor', [
  {theme:'AI Audit Fundamentals',focus:'audit methodology',company:'AuditAI Corp'},
  {theme:'Technical AI Audit',focus:'technical auditing',company:'TechAuditAI'},
  {theme:'Data Audit for AI Systems',focus:'data auditing',company:'DataAuditAI'},
  {theme:'Model Performance Audit',focus:'model auditing',company:'ModelAuditAI'},
  {theme:'Algorithmic Bias Audit',focus:'bias auditing',company:'BiasAuditAI'},
  {theme:'Privacy & Security Audit',focus:'privacy audit',company:'PrivAuditAI'},
  {theme:'Regulatory Compliance Audit',focus:'compliance audit',company:'RegAuditAI'},
  {theme:'Continuous AI Monitoring',focus:'continuous audit',company:'MonitorAuditAI'},
  {theme:'Audit Report Writing',focus:'audit reporting',company:'ReportAuditAI'},
  {theme:'AI Audit Leadership',focus:'audit leadership',company:'LeadAuditAI'},
]);

export const AI_ETHICS_SPECIALIST_SIMS = buildModuleSims('ai-ethics-specialist', [
  {theme:'AI Ethics Foundations',focus:'ethics theory',company:'EthicsAI Foundation'},
  {theme:'Value Alignment in AI',focus:'value alignment',company:'AlignmentAI'},
  {theme:'Fairness & Justice in AI',focus:'AI justice',company:'JusticeAI Corp'},
  {theme:'Autonomous Systems Ethics',focus:'autonomous ethics',company:'AutoEthicsAI'},
  {theme:'AI & Human Rights',focus:'human rights',company:'RightsEthicsAI'},
  {theme:'Environmental & Social Impact',focus:'ESG AI',company:'ESGAIEthics'},
  {theme:'Corporate AI Ethics Programs',focus:'ethics programs',company:'CorpEthicsAI'},
  {theme:'AI Ethics Policy Development',focus:'policy ethics',company:'PolicyEthicsAI'},
  {theme:'Ethics in High-Risk AI',focus:'high-risk ethics',company:'HighRiskEthicsAI'},
  {theme:'AI Ethics Leadership',focus:'ethics leadership',company:'LeadEthicsAI'},
]);

export const AI_POLICY_DESIGNER_SIMS = buildModuleSims('ai-policy-designer', [
  {theme:'AI Policy Fundamentals',focus:'policy design',company:'PolicyDesignAI Corp'},
  {theme:'Regulatory Framework Analysis',focus:'regulation analysis',company:'RegAnalysisAI'},
  {theme:'Stakeholder Engagement',focus:'policy stakeholders',company:'StakeholderPolicyAI'},
  {theme:'Policy Impact Assessment',focus:'impact assessment',company:'ImpactPolicyAI'},
  {theme:'International AI Policy',focus:'global policy',company:'GlobalPolicyAI'},
  {theme:'Sectoral AI Policy',focus:'sector policy',company:'SectorPolicyAI'},
  {theme:'Policy Implementation',focus:'policy delivery',company:'ImplPolicyAI'},
  {theme:'Policy Evaluation & Iteration',focus:'policy evaluation',company:'EvalPolicyAI'},
  {theme:'AI Policy Communication',focus:'policy communication',company:'CommPolicyAI'},
  {theme:'AI Policy Leadership',focus:'policy leadership',company:'LeadPolicyAI'},
]);

// ═══════════════════════════════════════════════════════════════
//  SCHOOL OF HUMAN-AI EXPERIENCE
// ═══════════════════════════════════════════════════════════════

export const AI_UX_DESIGNER_SIMS = buildModuleSims('ai-ux-designer', [
  {theme:'AI UX Fundamentals',focus:'AI user experience',company:'UXAIDesign Corp'},
  {theme:'Mental Models & Trust Design',focus:'trust in AI',company:'TrustUXAI'},
  {theme:'Designing for AI Errors',focus:'error design',company:'ErrorDesignAI'},
  {theme:'AI Onboarding & Activation',focus:'user activation',company:'OnboardAI UX'},
  {theme:'Feedback Loops & Data Collection',focus:'feedback design',company:'FeedbackAI UX'},
  {theme:'Accessibility in AI Products',focus:'inclusive AI',company:'InclusiveAI UX'},
  {theme:'AI Prototyping & Testing',focus:'AI prototyping',company:'ProtoAI UX'},
  {theme:'Conversational UI Design',focus:'conversational UX',company:'ConversationAI UX'},
  {theme:'AI Product Metrics',focus:'UX metrics',company:'MetricsAI UX'},
  {theme:'AI UX Leadership',focus:'UX leadership',company:'LeadAI UX'},
]);

export const CONVERSATION_DESIGNER_SIMS = buildModuleSims('conversation-designer', [
  {theme:'Conversation Design Fundamentals',focus:'dialogue design',company:'ConvDesignAI Corp'},
  {theme:'Intent & Entity Architecture',focus:'NLU design',company:'NLUDesignAI'},
  {theme:'Dialog Flow Design',focus:'dialog management',company:'DialogFlowAI'},
  {theme:'Persona & Voice Design',focus:'AI personality',company:'PersonaAI Design'},
  {theme:'Multi-Modal Conversation',focus:'multi-modal design',company:'MultiModalAI'},
  {theme:'Testing Conversational AI',focus:'conversation testing',company:'TestConvAI'},
  {theme:'Analytics for Conversation Design',focus:'conv analytics',company:'AnalyticsConvAI'},
  {theme:'Enterprise Conversation Design',focus:'enterprise chatbots',company:'EnterpriseConvAI'},
  {theme:'Ethical Conversation Design',focus:'ethical design',company:'EthicsConvAI'},
  {theme:'Conversation Design Leadership',focus:'design leadership',company:'LeadConvAI'},
]);

export const HUMAN_AI_INTERACTION_SIMS = buildModuleSims('human-ai-interaction', [
  {theme:'Human-AI Interaction Principles',focus:'HCI fundamentals',company:'HAIInteract Corp'},
  {theme:'Cognitive Load in AI Systems',focus:'cognitive design',company:'CogLoadAI'},
  {theme:'Agency & Control in AI',focus:'human agency',company:'AgencyAI'},
  {theme:'AI Transparency Design',focus:'transparency',company:'TransparentAI UX'},
  {theme:'Emotional Responses to AI',focus:'affective computing',company:'AffectiveAI'},
  {theme:'AI in Collaborative Work',focus:'AI collaboration',company:'CollabAI'},
  {theme:'Measuring Human-AI Performance',focus:'performance metrics',company:'MeasureHAI'},
  {theme:'Adaptive AI Interfaces',focus:'adaptive UI',company:'AdaptiveAI UI'},
  {theme:'Inclusive Human-AI Design',focus:'inclusive design',company:'InclusiveHAI'},
  {theme:'HAI Research & Innovation',focus:'HAI research',company:'ResearchHAI Corp'},
]);

export const AI_WORKFLOW_DESIGNER_SIMS = buildModuleSims('ai-workflow-designer', [
  {theme:'AI Workflow Fundamentals',focus:'workflow design',company:'WorkflowAI Corp'},
  {theme:'Process Analysis for AI',focus:'process analysis',company:'ProcessAI Design'},
  {theme:'Human-AI Task Allocation',focus:'task allocation',company:'TaskAllocAI'},
  {theme:'Automation Decision Framework',focus:'automation design',company:'AutoDecAI'},
  {theme:'Workflow Integration Patterns',focus:'integration design',company:'IntegWorkflowAI'},
  {theme:'Testing AI Workflows',focus:'workflow testing',company:'TestWorkflowAI'},
  {theme:'Change Management for AI Workflows',focus:'workflow change',company:'ChangeWorkflowAI'},
  {theme:'Measuring Workflow ROI',focus:'workflow ROI',company:'ROIWorkflowAI'},
  {theme:'Enterprise Workflow Design',focus:'enterprise workflows',company:'EnterpriseWorkflowAI'},
  {theme:'Workflow Design Leadership',focus:'design leadership',company:'LeadWorkflowAI'},
]);

export const AI_EXPERIENCE_ARCHITECT_SIMS = buildModuleSims('ai-experience-architect', [
  {theme:'Experience Architecture Fundamentals',focus:'XA principles',company:'ExperienceArch AI'},
  {theme:'AI Ecosystem Mapping',focus:'ecosystem design',company:'EcosystemAI XA'},
  {theme:'Cross-Channel AI Experience',focus:'omnichannel AI',company:'OmnichannelAI XA'},
  {theme:'Experience Personalization',focus:'personalization design',company:'PersonalizeAI XA'},
  {theme:'AI Experience Metrics',focus:'experience metrics',company:'MetricsAI XA'},
  {theme:'Experience Governance',focus:'experience governance',company:'GovExperienceAI'},
  {theme:'AI Experience Strategy',focus:'experience strategy',company:'StrategyAI XA'},
  {theme:'Building Experience Teams',focus:'team design',company:'TeamAI XA'},
  {theme:'Future of AI Experiences',focus:'experience innovation',company:'FutureAI XA'},
  {theme:'Experience Architecture Leadership',focus:'XA leadership',company:'LeadAI XA'},
]);

// ═══════════════════════════════════════════════════════════════
//  MASTER CATALOG — all 2,800 simulations indexed
// ═══════════════════════════════════════════════════════════════

export const ALL_SIMULATIONS: Simulation[] = [
  ...AI_CLOUD_ENGINEER_SIMS,
  ...AI_AGENT_ENGINEER_SIMS,
  ...AI_DATA_ENGINEER_SIMS,
  ...AI_DEVOPS_ENGINEER_SIMS,
  ...AI_MLOPS_ENGINEER_SIMS,
  ...AI_SECURITY_ENGINEER_SIMS,
  ...AI_PLATFORM_ENGINEER_SIMS,
  ...AI_SOLUTIONS_ARCHITECT_SIMS,
  ...AI_SOLUTIONS_CONSULTANT_SIMS,
  ...AI_PRODUCT_MANAGER_SIMS,
  ...AI_PROGRAM_MANAGER_SIMS,
  ...AI_TRANSFORMATION_MANAGER_SIMS,
  ...AI_BUSINESS_ANALYST_SIMS,
  ...AI_SALES_ENGINEER_SIMS,
  ...AI_ENTERPRISE_ARCHITECT_SIMS,
  ...AI_BUSINESS_OPERATIONS_SIMS,
  ...AI_GOVERNANCE_PROFESSIONAL_SIMS,
  ...RESPONSIBLE_AI_SPECIALIST_SIMS,
  ...AI_COMPLIANCE_OFFICER_SIMS,
  ...AI_RISK_MANAGER_SIMS,
  ...AI_AUDITOR_SIMS,
  ...AI_ETHICS_SPECIALIST_SIMS,
  ...AI_POLICY_DESIGNER_SIMS,
  ...AI_UX_DESIGNER_SIMS,
  ...CONVERSATION_DESIGNER_SIMS,
  ...HUMAN_AI_INTERACTION_SIMS,
  ...AI_WORKFLOW_DESIGNER_SIMS,
  ...AI_EXPERIENCE_ARCHITECT_SIMS,
];

// ─── Program metadata ──────────────────────────────────────────
export const PROGRAMS = [
  // AI Engineering
  { key:'ai-cloud-engineer',      label:'AI Cloud Engineer',      school:'AI Engineering',      icon:'☁️',  color:'#4A90F5' },
  { key:'ai-agent-engineer',      label:'AI Agent Engineer',      school:'AI Engineering',      icon:'🤖',  color:'#5B8FF9' },
  { key:'ai-data-engineer',       label:'AI Data Engineer',       school:'AI Engineering',      icon:'🗄️',  color:'#6BA3F5' },
  { key:'ai-devops-engineer',     label:'AI DevOps Engineer',     school:'AI Engineering',      icon:'⚙️',  color:'#7DB6F5' },
  { key:'ai-mlops-engineer',      label:'AI MLOps Engineer',      school:'AI Engineering',      icon:'🔁',  color:'#4ACAF5' },
  { key:'ai-security-engineer',   label:'AI Security Engineer',   school:'AI Engineering',      icon:'🔒',  color:'#F55E4A' },
  { key:'ai-platform-engineer',   label:'AI Platform Engineer',   school:'AI Engineering',      icon:'🏗️',  color:'#4A90F5' },
  { key:'ai-solutions-architect', label:'AI Solutions Architect', school:'AI Engineering',      icon:'🏛️',  color:'#A78BFA' },
  // AI Business
  { key:'ai-solutions-consultant',  label:'AI Solutions Consultant',  school:'AI Business', icon:'💼',  color:'#F0622A' },
  { key:'ai-product-manager',       label:'AI Product Manager',       school:'AI Business', icon:'📱',  color:'#F5B81A' },
  { key:'ai-program-manager',       label:'AI Program Manager',       school:'AI Business', icon:'📊',  color:'#F0A53A' },
  { key:'ai-transformation-manager',label:'AI Transformation Manager',school:'AI Business', icon:'🔄',  color:'#E87040' },
  { key:'ai-business-analyst',      label:'AI Business Analyst',      school:'AI Business', icon:'📈',  color:'#F5C842' },
  { key:'ai-sales-engineer',        label:'AI Sales Engineer',        school:'AI Business', icon:'🎯',  color:'#F07830' },
  { key:'ai-enterprise-architect',  label:'AI Enterprise Architect',  school:'AI Business', icon:'🏢',  color:'#E09020' },
  { key:'ai-business-operations',   label:'AI Business Operations',   school:'AI Business', icon:'⚡',  color:'#F5A020' },
  // Governance & Risk
  { key:'ai-governance-professional',  label:'AI Governance Professional', school:'Governance & Risk', icon:'⚖️',  color:'#22C98A' },
  { key:'responsible-ai-specialist',   label:'Responsible AI Specialist',  school:'Governance & Risk', icon:'🛡️',  color:'#34D399' },
  { key:'ai-compliance-officer',       label:'AI Compliance Officer',      school:'Governance & Risk', icon:'📋',  color:'#22C98A' },
  { key:'ai-risk-manager',             label:'AI Risk Manager',            school:'Governance & Risk', icon:'⚠️',  color:'#10B981' },
  { key:'ai-auditor',                  label:'AI Auditor',                 school:'Governance & Risk', icon:'🔍',  color:'#34D399' },
  { key:'ai-ethics-specialist',        label:'AI Ethics Specialist',       school:'Governance & Risk', icon:'🌍',  color:'#22C98A' },
  { key:'ai-policy-designer',          label:'AI Policy Designer',         school:'Governance & Risk', icon:'📜',  color:'#10B981' },
  // Human-AI Experience
  { key:'ai-ux-designer',               label:'AI UX Designer',               school:'Human-AI Experience', icon:'🎨', color:'#C084FC' },
  { key:'conversation-designer',        label:'Conversation Designer',         school:'Human-AI Experience', icon:'💬', color:'#E879F9' },
  { key:'human-ai-interaction',         label:'Human-AI Interaction Specialist',school:'Human-AI Experience', icon:'🤝', color:'#A78BFA' },
  { key:'ai-workflow-designer',         label:'AI Workflow Designer',          school:'Human-AI Experience', icon:'🔗', color:'#D946EF' },
  { key:'ai-experience-architect',      label:'AI Experience Architect',       school:'Human-AI Experience', icon:'✨', color:'#C084FC' },
];

export const SCHOOLS = [
  { label:'AI Engineering',      color:'#4A90F5', bg:'rgba(74,144,245,.12)', count:8  },
  { label:'AI Business',         color:'#F0622A', bg:'rgba(240,98,42,.12)',  count:8  },
  { label:'Governance & Risk',   color:'#22C98A', bg:'rgba(34,201,138,.12)',count:7  },
  { label:'Human-AI Experience', color:'#C084FC', bg:'rgba(192,132,252,.12)',count:5  },
];

export const getSimsForProgram = (programKey: string) =>
  ALL_SIMULATIONS.filter(s => s.programKey === programKey);

export const getSimsForModule = (programKey: string, module: number) =>
  ALL_SIMULATIONS.filter(s => s.programKey === programKey && s.module === module);

export const getSimById = (id: string) =>
  ALL_SIMULATIONS.find(s => s.id === id);
