export interface ResourceItem {
  label: string;
  url: string;
  type: 'Official Docs' | 'Course' | 'Cert' | 'Framework' | 'Standard' | 'Guide' | 'Practice Exam' | 'Tool' | 'Reference' | 'Community' | 'YouTube' | 'Research' | 'Regulation' | 'Toolkit' | 'Tutorial';
  free: boolean;
}
export interface GlossaryTerm { term: string; def: string; }
export interface ResourceTrack {
  id: string; school: string; color: string; icon: string;
  programs: string[]; resources: ResourceItem[]; glossary: GlossaryTerm[];
}

export const RESOURCE_TRACKS: ResourceTrack[] = [
  // ── AI ENGINEERING ──
  { id:'ai-cloud-engineer', school:'⚙️ AI Engineering', color:'#4A90F5', icon:'☁️',
    programs:['AI Cloud Engineer'],
    resources:[
      {label:'AWS Well-Architected Framework',url:'https://aws.amazon.com/architecture/well-architected/',type:'Framework',free:true},
      {label:'Google Cloud Architecture Center',url:'https://cloud.google.com/architecture',type:'Framework',free:true},
      {label:'Google Cloud Skills Boost',url:'https://cloudskillsboost.google/',type:'Course',free:true},
      {label:'Terraform Official Docs',url:'https://developer.hashicorp.com/terraform/docs',type:'Official Docs',free:true},
      {label:'Kubernetes Official Docs',url:'https://kubernetes.io/docs/home/',type:'Official Docs',free:true},
      {label:'Google SRE Book (Free)',url:'https://sre.google/sre-book/table-of-contents/',type:'Reference',free:true},
      {label:'CNCF Landscape',url:'https://landscape.cncf.io/',type:'Reference',free:true},
      {label:'AWS Solutions Architect Professional',url:'https://aws.amazon.com/certification/certified-solutions-architect-professional/',type:'Cert',free:false},
      {label:'Google Professional Cloud Architect',url:'https://cloud.google.com/learn/certification/cloud-architect',type:'Cert',free:false},
      {label:'CKA — Certified Kubernetes Administrator',url:'https://www.cncf.io/certification/cka/',type:'Cert',free:false},
    ],
    glossary:[
      {term:'IaC',def:'Infrastructure as Code — managing infrastructure via machine-readable config files (Terraform, Pulumi, CloudFormation).'},
      {term:'VPC',def:'Virtual Private Cloud — an isolated network section within a cloud provider.'},
      {term:'GitOps',def:'Using Git as single source of truth for declarative infrastructure and application delivery.'},
      {term:'FinOps',def:'Cloud financial management practice for maximizing business value through data-driven spend decisions.'},
      {term:'SLO',def:'Service Level Objective — a target value for a service level indicator, e.g. 99.9% uptime per 28-day window.'},
      {term:'Zero Trust',def:'Security model requiring strict identity verification for every user and device regardless of network location.'},
      {term:'Canary Deployment',def:'Rolling out changes to a small subset of users first before full rollout.'},
      {term:'Observability',def:'Understanding a system\'s internal state from external outputs: metrics, logs, and distributed traces.'},
      {term:'IRSA',def:'IAM Roles for Service Accounts — gives Kubernetes pods specific AWS IAM permissions without static credentials.'},
      {term:'Helm',def:'The package manager for Kubernetes that simplifies deploying and managing complex applications.'},
    ]
  },
  { id:'ai-agent-engineer', school:'⚙️ AI Engineering', color:'#4A90F5', icon:'🤖',
    programs:['AI Agent Engineer'],
    resources:[
      {label:'LangChain Official Docs',url:'https://docs.langchain.com/',type:'Official Docs',free:true},
      {label:'LangGraph Documentation',url:'https://langchain-ai.github.io/langgraph/',type:'Official Docs',free:true},
      {label:'Model Context Protocol Docs',url:'https://modelcontextprotocol.io/docs',type:'Official Docs',free:true},
      {label:'Anthropic Prompt Engineering Guide',url:'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',type:'Guide',free:true},
      {label:'OpenAI Cookbook',url:'https://cookbook.openai.com/',type:'Guide',free:true},
      {label:'Hugging Face Learn',url:'https://huggingface.co/learn',type:'Course',free:true},
      {label:'DeepLearning.AI Short Courses',url:'https://www.deeplearning.ai/short-courses/',type:'Course',free:true},
      {label:'CrewAI Documentation',url:'https://docs.crewai.com/',type:'Official Docs',free:true},
      {label:'OWASP LLM Top 10',url:'https://owasp.org/www-project-top-10-for-large-language-model-applications/',type:'Guide',free:true},
      {label:'Pinecone Learning Center',url:'https://www.pinecone.io/learn/',type:'Guide',free:true},
    ],
    glossary:[
      {term:'LLM',def:'Large Language Model — AI model trained on vast text data to understand and generate natural language.'},
      {term:'RAG',def:'Retrieval-Augmented Generation — combining retrieval with LLM to ground responses in real data.'},
      {term:'ReAct',def:'Reasoning and Acting — agent architecture interleaving chain-of-thought with tool use (Yao et al. 2022).'},
      {term:'MCP',def:"Model Context Protocol — Anthropic\'s open standard for connecting AI models to external tools and data sources."},
      {term:'Prompt Injection',def:'Attack where malicious instructions in input or retrieved content manipulate LLM behavior.'},
      {term:'Embedding',def:'Numerical vector representation of text capturing semantic meaning — similar texts have similar vectors.'},
      {term:'Hallucination',def:'When LLM generates plausible-sounding but factually incorrect information with high confidence.'},
      {term:'Tool Calling',def:'LLM capability to invoke external functions based on reasoning about user intent.'},
      {term:'Vector Database',def:'Database optimized for storing and searching high-dimensional embedding vectors (Pinecone, Qdrant, pgvector).'},
      {term:'Chunking',def:'Splitting documents into smaller pieces for embedding and retrieval in RAG systems.'},
    ]
  },
  { id:'ai-data-engineer', school:'⚙️ AI Engineering', color:'#4A90F5', icon:'🗄️',
    programs:['AI Data Engineer'],
    resources:[
      {label:'dbt Learn',url:'https://courses.getdbt.com/',type:'Course',free:true},
      {label:'Apache Kafka Documentation',url:'https://kafka.apache.org/documentation/',type:'Official Docs',free:true},
      {label:'Apache Spark Documentation',url:'https://spark.apache.org/docs/latest/',type:'Official Docs',free:true},
      {label:'Delta Lake Documentation',url:'https://docs.delta.io/latest/index.html',type:'Official Docs',free:true},
      {label:'Great Expectations Docs',url:'https://docs.greatexpectations.io/',type:'Official Docs',free:true},
      {label:'Snowflake University',url:'https://learn.snowflake.com/',type:'Course',free:true},
      {label:'DataHub Documentation',url:'https://datahubproject.io/docs/',type:'Official Docs',free:true},
      {label:'Google BigQuery Docs',url:'https://cloud.google.com/bigquery/docs',type:'Official Docs',free:true},
      {label:'Databricks Certified Data Engineer',url:'https://www.databricks.com/learn/certification/data-engineer-associate',type:'Cert',free:false},
      {label:'Google Professional Data Engineer',url:'https://cloud.google.com/learn/certification/data-engineer',type:'Cert',free:false},
    ],
    glossary:[
      {term:'Data Lakehouse',def:'Hybrid architecture combining data lake flexibility with ACID transactions and governance of data warehouses.'},
      {term:'dbt',def:'Data Build Tool — transforms data in warehouses using SQL and software engineering practices.'},
      {term:'Data Mesh',def:'Decentralized architecture where domain teams own data as products with federated governance.'},
      {term:'Feature Store',def:'Centralized repository for storing and serving ML features consistently across training and inference.'},
      {term:'ELT',def:'Extract, Load, Transform — loading raw data into warehouse first, then transforming in place.'},
      {term:'Data Lineage',def:"Complete history of data\'s origin, movement, transformations, and usage — critical for compliance."},
      {term:'Streaming',def:'Processing data in real-time as events occur (Kafka, Flink) vs. periodic batch jobs.'},
      {term:'Schema Evolution',def:"Ability to change a dataset\'s schema over time without breaking downstream consumers."},
    ]
  },
  { id:'ai-devops-engineer', school:'⚙️ AI Engineering', color:'#4A90F5', icon:'⚙️',
    programs:['AI DevOps Engineer'],
    resources:[
      {label:'DORA State of DevOps Report',url:'https://dora.dev/research/',type:'Research',free:true},
      {label:'GitHub Actions Documentation',url:'https://docs.github.com/en/actions',type:'Official Docs',free:true},
      {label:'ArgoCD Documentation',url:'https://argo-cd.readthedocs.io/',type:'Official Docs',free:true},
      {label:'Google SRE Book (Free)',url:'https://sre.google/sre-book/table-of-contents/',type:'Reference',free:true},
      {label:'Prometheus Documentation',url:'https://prometheus.io/docs/',type:'Official Docs',free:true},
      {label:'Grafana Documentation',url:'https://grafana.com/docs/',type:'Official Docs',free:true},
      {label:'Backstage Documentation',url:'https://backstage.io/docs/',type:'Official Docs',free:true},
      {label:'OpenTelemetry Documentation',url:'https://opentelemetry.io/docs/',type:'Official Docs',free:true},
      {label:'AWS DevOps Professional',url:'https://aws.amazon.com/certification/certified-devops-engineer-professional/',type:'Cert',free:false},
    ],
    glossary:[
      {term:'DORA Metrics',def:'Deployment Frequency, Lead Time for Changes, MTTR, Change Failure Rate — proven predictors of software delivery performance.'},
      {term:'CI/CD',def:'Continuous Integration and Delivery — automating code integration, testing, and deployment.'},
      {term:'Error Budget',def:'Allowable unreliability from SLO: 99.9% SLO = 43.8 min/month. When depleted, feature work pauses for reliability.'},
      {term:'Chaos Engineering',def:'Proactively injecting failures to verify resilience mechanisms work before real failures occur.'},
      {term:'Shift-Left Security',def:'Moving security validation earlier — from post-deployment audits to pre-commit hooks and CI gates.'},
      {term:'Platform Engineering',def:'Building Internal Developer Platforms that abstract infrastructure complexity into self-service interfaces.'},
    ]
  },
  { id:'ai-security-engineer', school:'⚙️ AI Engineering', color:'#4A90F5', icon:'🛡️',
    programs:['AI Security Engineer'],
    resources:[
      {label:'OWASP LLM Top 10',url:'https://owasp.org/www-project-top-10-for-large-language-model-applications/',type:'Guide',free:true},
      {label:'MITRE ATLAS (AI Threat Matrix)',url:'https://atlas.mitre.org/',type:'Framework',free:true},
      {label:'NIST AI Risk Management Framework',url:'https://airc.nist.gov/Docs/1',type:'Framework',free:true},
      {label:'IBM AI Fairness 360',url:'https://aif360.mybluemix.net/',type:'Toolkit',free:true},
      {label:'Garak LLM Vulnerability Scanner',url:'https://github.com/leondz/garak',type:'Tool',free:true},
      {label:'TensorFlow Privacy (DP-SGD)',url:'https://github.com/tensorflow/privacy',type:'Tool',free:true},
      {label:'SafeTensors Documentation',url:'https://huggingface.co/docs/safetensors/index',type:'Official Docs',free:true},
      {label:'EU AI Act Full Text',url:'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689',type:'Regulation',free:true},
    ],
    glossary:[
      {term:'Prompt Injection',def:'OWASP LLM #1 — malicious instructions in input or retrieved content override intended LLM behavior.'},
      {term:'Data Poisoning',def:'Attack corrupting training data to cause targeted misclassifications or embed backdoor triggers.'},
      {term:'Adversarial Example',def:'Input with imperceptible perturbations causing neural networks to misclassify confidently (Goodfellow 2014).'},
      {term:'Model Theft',def:'Using black-box API queries to train a surrogate model replicating target behavior without weight access.'},
      {term:'Differential Privacy',def:'Mathematical framework adding calibrated noise to bound how much any individual\'s data influences output.'},
      {term:'Membership Inference',def:"Determining whether a data point was in a model\'s training set by analyzing prediction confidence patterns."},
    ]
  },
  { id:'ai-mlops-engineer', school:'⚙️ AI Engineering', color:'#4A90F5', icon:'🔁',
    programs:['AI MLOps Engineer'],
    resources:[
      {label:'MLflow Documentation',url:'https://mlflow.org/docs/latest/index.html',type:'Official Docs',free:true},
      {label:'Weights & Biases Docs',url:'https://docs.wandb.ai/',type:'Official Docs',free:true},
      {label:'Kubeflow Docs',url:'https://www.kubeflow.org/docs/',type:'Official Docs',free:true},
      {label:'DVC (Data Version Control)',url:'https://dvc.org/doc',type:'Official Docs',free:true},
      {label:'Evidently AI Documentation',url:'https://docs.evidentlyai.com/',type:'Official Docs',free:true},
      {label:'Google MLOps Whitepaper',url:'https://cloud.google.com/resources/mlops-whitepaper',type:'Guide',free:true},
      {label:'Hidden Technical Debt in ML Systems',url:'https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html',type:'Research',free:true},
      {label:'Great Expectations Documentation',url:'https://docs.greatexpectations.io/',type:'Official Docs',free:true},
    ],
    glossary:[
      {term:'MLOps',def:'Machine Learning Operations — deploying, monitoring, and maintaining ML models in production reliably at scale.'},
      {term:'Model Drift',def:"Degradation of model performance as real-world data diverges from training data distribution."},
      {term:'PSI',def:'Population Stability Index — measures feature distribution change. >0.2 indicates significant shift requiring action.'},
      {term:'CACE Principle',def:'Changing Anything Changes Everything — in ML, any training change can unpredictably affect all predictions (Sculley 2015).'},
      {term:'Model Card',def:'Standardized ML model documentation: intended use, performance, training data, ethics (Mitchell et al. 2019).'},
      {term:'Training-Serving Skew',def:'Features computed differently at training vs. serving time — causes models to learn non-existent production patterns.'},
      {term:'Feature Leakage',def:'Including information in training features unavailable at prediction time — falsely optimistic offline metrics.'},
    ]
  },
  { id:'ai-solutions-architect', school:'⚙️ AI Engineering', color:'#4A90F5', icon:'🏛️',
    programs:['AI Solutions Architect'],
    resources:[
      {label:'TOGAF Standard Overview',url:'https://www.opengroup.org/togaf',type:'Standard',free:true},
      {label:'AWS Architecture Center',url:'https://aws.amazon.com/architecture/',type:'Reference',free:true},
      {label:'Google Cloud Architecture Framework',url:'https://cloud.google.com/architecture/framework',type:'Framework',free:true},
      {label:'Martin Fowler — Enterprise Patterns',url:'https://martinfowler.com/eaaCatalog/',type:'Reference',free:true},
      {label:'CNCF Cloud Native Landscape',url:'https://landscape.cncf.io/',type:'Reference',free:true},
      {label:'AWS Solutions Architect Professional',url:'https://aws.amazon.com/certification/certified-solutions-architect-professional/',type:'Cert',free:false},
    ],
    glossary:[
      {term:'TOGAF',def:'The Open Group Architecture Framework — the leading EA methodology for designing, planning, and governing IT architecture.'},
      {term:'ADR',def:'Architecture Decision Record — documents an architectural decision, context, options considered, and rationale.'},
      {term:'Event-Driven Architecture',def:'Services communicate through events (async messages) enabling loose coupling and real-time data flow.'},
      {term:'CQRS',def:'Command Query Responsibility Segregation — separating read and write operations for AI system scalability.'},
      {term:'Strangler Fig',def:'Gradually replacing legacy systems by routing traffic to new services — safe incremental AI modernization.'},
    ]
  },
  { id:'ai-platform-engineer', school:'⚙️ AI Engineering', color:'#4A90F5', icon:'🏗️',
    programs:['AI Platform Engineer'],
    resources:[
      {label:'Backstage Official Docs',url:'https://backstage.io/docs/',type:'Official Docs',free:true},
      {label:'Platform Engineering Community',url:'https://platformengineering.org/',type:'Community',free:true},
      {label:'CNCF Platform Engineering WG',url:'https://tag-app-delivery.cncf.io/wgs/platforms/',type:'Reference',free:true},
      {label:'Feast Feature Store Docs',url:'https://docs.feast.dev/',type:'Official Docs',free:true},
      {label:'Triton Inference Server Docs',url:'https://docs.nvidia.com/deeplearning/triton-inference-server/',type:'Official Docs',free:true},
      {label:'Karpenter Documentation',url:'https://karpenter.sh/docs/',type:'Official Docs',free:true},
      {label:'KServe Documentation',url:'https://kserve.github.io/website/',type:'Official Docs',free:true},
    ],
    glossary:[
      {term:'IDP',def:'Internal Developer Platform — self-service layer enabling developers to provision infrastructure without filing tickets.'},
      {term:'Paved Road',def:'Opinionated, well-supported path for common tasks incorporating security and best practices by default.'},
      {term:'Self-Service Rate',def:'Percentage of infrastructure requests resolved via self-service without a ticket. Target: >90%.'},
      {term:'Golden Path',def:'Curated recommended way to build and deploy services encoding organizational best practices.'},
      {term:'Cognitive Load',def:'Mental effort required to operate a system — Platform Engineering minimizes cognitive load for AI developers.'},
    ]
  },
  // ── AI BUSINESS ──
  { id:'ai-solutions-consultant', school:'💼 AI Business', color:'#F0622A', icon:'💼',
    programs:['AI Solutions Consultant'],
    resources:[
      {label:'McKinsey State of AI 2024',url:'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',type:'Research',free:true},
      {label:'Deloitte AI Institute',url:'https://www2.deloitte.com/us/en/pages/deloitte-analytics/articles/advancing-human-ai-collaboration.html',type:'Research',free:true},
      {label:'BCG AI Insights',url:'https://www.bcg.com/capabilities/artificial-intelligence',type:'Research',free:true},
      {label:'MIT Sloan Management Review — AI',url:'https://sloanreview.mit.edu/topic/artificial-intelligence/',type:'Reference',free:true},
      {label:'Harvard Business Review — AI',url:'https://hbr.org/topic/subject/artificial-intelligence',type:'Reference',free:true},
    ],
    glossary:[
      {term:'AI Maturity Model',def:'5-stage framework: Aware → Active → Operational → Systematic → Transformational (McKinsey).'},
      {term:'ROI',def:'Return on Investment — AI ROI = (cost savings + revenue uplift + productivity gains + risk reduction) / total investment.'},
      {term:'TCO',def:'Total Cost of Ownership — all costs of an AI system: compute, data, talent, tools, maintenance.'},
      {term:'MECE',def:'Mutually Exclusive, Collectively Exhaustive — structured problem decomposition used in consulting.'},
      {term:'Statement of Work',def:'Formal document defining scope, deliverables, acceptance criteria, timeline, and payment milestones for AI engagements.'},
    ]
  },
  { id:'ai-product-manager', school:'💼 AI Business', color:'#F0622A', icon:'📱',
    programs:['AI Product Manager'],
    resources:[
      {label:'Google PAIR Guidebook',url:'https://pair.withgoogle.com/guidebook/',type:'Guide',free:true},
      {label:'Microsoft HAX Toolkit',url:'https://www.microsoft.com/en-us/haxtoolkit/',type:'Toolkit',free:true},
      {label:'Teresa Torres — Continuous Discovery',url:'https://www.producttalk.org/2021/08/product-discovery/',type:'Guide',free:true},
      {label:'JTBD — Jobs to Be Done (HBR)',url:'https://hbr.org/2016/09/know-your-customers-jobs-to-be-done',type:'Reference',free:true},
      {label:'Lenny Rachitsky Newsletter',url:'https://www.lennysnewsletter.com/',type:'Reference',free:true},
    ],
    glossary:[
      {term:'JTBD',def:"Jobs-to-be-Done — users don\'t buy products, they hire them to do a job. Reveals true motivation for AI feature adoption."},
      {term:'North Star Metric',def:'Single metric capturing the core value an AI product delivers — e.g., GitHub Copilot\'s "code lines accepted per day."'},
      {term:'Assistance Acceptance Rate',def:'Percentage of AI suggestions a user accepts — direct measure of AI quality and trust.'},
      {term:'Data Flywheel',def:'Compounding moat: more users → more data → better models → better product → more users.'},
      {term:'Opportunity Solution Tree',def:'Teresa Torres\'s discovery framework mapping outcomes → opportunities → solutions → experiments.'},
    ]
  },
  { id:'ai-business-operations', school:'💼 AI Business', color:'#F0622A', icon:'📈',
    programs:['AI Business Operations'],
    resources:[
      {label:'UiPath Academy (Free)',url:'https://academy.uipath.com/',type:'Course',free:true},
      {label:'Automation Anywhere University',url:'https://university.automationanywhere.com/',type:'Course',free:true},
      {label:'Google Document AI',url:'https://cloud.google.com/document-ai/docs',type:'Official Docs',free:true},
      {label:'AWS Textract Documentation',url:'https://docs.aws.amazon.com/textract/',type:'Official Docs',free:true},
      {label:'Celonis Process Mining Academy',url:'https://academy.celonis.com/',type:'Course',free:true},
    ],
    glossary:[
      {term:'RPA',def:'Robotic Process Automation — software robots automating rule-based digital tasks (UiPath, Automation Anywhere).'},
      {term:'IDP',def:'Intelligent Document Processing — AI extraction of structured information from unstructured documents.'},
      {term:'Process Mining',def:'Discovering real business processes by analyzing event logs from enterprise systems.'},
      {term:'BPM',def:'Business Process Management — systematic approach to improving workflows through modeling and optimization.'},
    ]
  },
  { id:'ai-sales-engineer', school:'💼 AI Business', color:'#F0622A', icon:'🎯',
    programs:['AI Sales Engineer'],
    resources:[
      {label:'MEDDIC Sales Framework',url:'https://meddicc.com/the-meddic-framework/',type:'Guide',free:true},
      {label:'PreSales Collective Community',url:'https://www.presalescollective.com/',type:'Community',free:true},
      {label:'G2 AI Software Reviews',url:'https://www.g2.com/categories/artificial-intelligence',type:'Reference',free:true},
      {label:'Gartner AI Research',url:'https://www.gartner.com/en/information-technology/topics/artificial-intelligence',type:'Research',free:false},
    ],
    glossary:[
      {term:'MEDDIC',def:'Sales qualification: Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion.'},
      {term:'PoC',def:'Proof of Concept — limited implementation demonstrating AI value for a specific customer use case.'},
      {term:'ACV',def:'Annual Contract Value — average annualized revenue per customer contract.'},
      {term:'Technical Win',def:"Prospect\'s technical team validates your AI solution meets requirements — prerequisite for commercial approval."},
    ]
  },
  { id:'ai-business-analyst', school:'💼 AI Business', color:'#F0622A', icon:'📊',
    programs:['AI Business Analyst'],
    resources:[
      {label:'BABOK Guide (IIBA)',url:'https://www.iiba.org/career-resources/a-business-analysis-body-of-knowledge/',type:'Standard',free:false},
      {label:'BPMN 2.0 Specification',url:'https://www.omg.org/spec/BPMN/2.0/',type:'Standard',free:true},
      {label:'Great Expectations Documentation',url:'https://docs.greatexpectations.io/',type:'Official Docs',free:true},
      {label:'Kaggle Learn — Data Analysis',url:'https://www.kaggle.com/learn',type:'Course',free:true},
    ],
    glossary:[
      {term:'BABOK',def:'Business Analysis Body of Knowledge — international standard for business analysis knowledge areas and techniques.'},
      {term:'BPMN',def:'Business Process Model and Notation — standardized notation for modeling business processes.'},
      {term:'Acceptance Criteria',def:'Specific testable conditions an AI system must meet — e.g., "model shall achieve >90% F1 on held-out test set."'},
      {term:'Requirements Elicitation',def:'Gathering information from stakeholders to understand business needs and constraints for an AI system.'},
    ]
  },
  { id:'ai-transformation-manager', school:'💼 AI Business', color:'#F0622A', icon:'🔄',
    programs:['AI Transformation Manager'],
    resources:[
      {label:'McKinsey State of AI 2024',url:'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',type:'Research',free:true},
      {label:'PROSCI Change Management',url:'https://www.prosci.com/methodology',type:'Guide',free:true},
      {label:'Kotter 8-Step Model',url:'https://www.kotterinc.com/methodology/8-steps/',type:'Guide',free:true},
      {label:'WEF Future of Jobs Report',url:'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',type:'Research',free:true},
    ],
    glossary:[
      {term:'ADKAR',def:'PROSCI model: Awareness → Desire → Knowledge → Ability → Reinforcement — outcomes for successful change.'},
      {term:'AI COE',def:'AI Center of Excellence — team developing AI capabilities, setting standards, and enabling adoption organization-wide.'},
      {term:'Value Realization',def:'Measuring and capturing actual business benefits of AI investments — closes the gap between AI potential and ROI.'},
    ]
  },
  { id:'ai-program-manager', school:'💼 AI Business', color:'#F0622A', icon:'📋',
    programs:['AI Program Manager'],
    resources:[
      {label:'SAFe Framework (Scaled Agile)',url:'https://scaledagileframework.com/',type:'Framework',free:true},
      {label:'Atlassian Agile Resources',url:'https://www.atlassian.com/agile',type:'Guide',free:true},
      {label:'Google PM Certificate (Coursera)',url:'https://www.coursera.org/professional-certificates/google-project-management',type:'Course',free:false},
      {label:'PMP Certification (PMI)',url:'https://www.pmi.org/certifications/project-management-pmp',type:'Cert',free:false},
    ],
    glossary:[
      {term:'Program vs. Project',def:'Projects are temporary endeavors; programs are groups of related projects managed for combined benefits.'},
      {term:'PI Planning',def:'Program Increment Planning — SAFe event where all Agile Release Train teams plan together for 8-12 weeks.'},
      {term:'RAID Log',def:'Risks, Assumptions, Issues, Dependencies — program management tracking tool for ongoing attention items.'},
    ]
  },
  { id:'ai-enterprise-architect', school:'💼 AI Business', color:'#F0622A', icon:'🏛️',
    programs:['AI Enterprise Architect'],
    resources:[
      {label:'TOGAF Standard',url:'https://www.opengroup.org/togaf',type:'Standard',free:true},
      {label:'ArchiMate Specification',url:'https://www.opengroup.org/archimate-forum/archimate-overview',type:'Standard',free:true},
      {label:'ThoughtWorks Technology Radar',url:'https://www.thoughtworks.com/radar',type:'Reference',free:true},
      {label:'TOGAF 10 Certification',url:'https://www.opengroup.org/certifications/togaf',type:'Cert',free:false},
    ],
    glossary:[
      {term:'TOGAF ADM',def:'Architecture Development Method — TOGAF\'s iterative EA process from Preliminary through Architecture Change Management.'},
      {term:'ARB',def:'Architecture Review Board — governance body reviewing architectural decisions and enforcing standards.'},
      {term:'Technology Radar',def:'ThoughtWorks visualization: Adopt (use now), Trial (evaluate), Assess (research), Hold (avoid).'},
    ]
  },
  // ── GOVERNANCE & RISK ──
  { id:'ai-governance-professional', school:'⚖️ Governance & Risk', color:'#22C98A', icon:'⚖️',
    programs:['AI Governance Professional'],
    resources:[
      {label:'EU AI Act Full Text',url:'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689',type:'Regulation',free:true},
      {label:'NIST AI Risk Management Framework',url:'https://airc.nist.gov/Docs/1',type:'Framework',free:true},
      {label:'ISO 42001 Overview',url:'https://www.bsigroup.com/en-GB/capabilities/artificial-intelligence/iso-42001/',type:'Standard',free:true},
      {label:'OECD AI Principles',url:'https://oecd.ai/en/ai-principles',type:'Reference',free:true},
      {label:'AI Incident Database',url:'https://incidentdatabase.ai/',type:'Reference',free:true},
      {label:'Google AI Principles',url:'https://ai.google/responsibility/principles/',type:'Reference',free:true},
      {label:'Microsoft Responsible AI Standard',url:'https://www.microsoft.com/en-us/ai/responsible-ai',type:'Framework',free:true},
    ],
    glossary:[
      {term:'EU AI Act',def:'World\'s first comprehensive AI regulation (Aug 2024) classifying systems by risk with graduated obligations.'},
      {term:'NIST AI RMF',def:'Voluntary AI Risk Management Framework (2023): Govern, Map, Measure, and Manage AI risks.'},
      {term:'ISO 42001',def:'International standard for AI Management Systems — certification framework for responsible AI governance.'},
      {term:'High-Risk AI',def:'EU AI Act designation for Annex III AI systems requiring conformity assessment before deployment.'},
      {term:'Conformity Assessment',def:'Process high-risk AI must complete to demonstrate EU AI Act compliance.'},
    ]
  },
  { id:'responsible-ai-specialist', school:'⚖️ Governance & Risk', color:'#22C98A', icon:'🌱',
    programs:['Responsible AI Specialist'],
    resources:[
      {label:'IBM AI Fairness 360',url:'https://aif360.mybluemix.net/',type:'Toolkit',free:true},
      {label:'Google Fairness Indicators',url:'https://www.tensorflow.org/responsible_ai/fairness_indicators/guide',type:'Toolkit',free:true},
      {label:'Microsoft Responsible AI Toolbox',url:'https://responsibleaitoolbox.ai/',type:'Toolkit',free:true},
      {label:'Aequitas Bias Audit Toolkit',url:'https://github.com/dssg/aequitas',type:'Toolkit',free:true},
      {label:'SHAP Documentation',url:'https://shap.readthedocs.io/',type:'Official Docs',free:true},
      {label:'AI Now Institute',url:'https://ainowinstitute.org/research',type:'Research',free:true},
    ],
    glossary:[
      {term:'Fairness',def:"AI fairness: absence of unjust discrimination. 20+ definitions often mutually incompatible (Chouldechova\'s impossibility theorem)."},
      {term:'SHAP',def:"Game-theoretic approach explaining any ML model by computing each feature\'s contribution to a specific prediction."},
      {term:'Disparate Impact',def:'Neutral AI policy with disproportionately negative effect on a protected class — prohibited under US civil rights law.'},
      {term:'Counterfactual Explanation',def:'"What would need to change for a different AI decision?" — required for GDPR Article 22 compliance.'},
    ]
  },
  { id:'ai-compliance-officer', school:'⚖️ Governance & Risk', color:'#22C98A', icon:'📜',
    programs:['AI Compliance Officer'],
    resources:[
      {label:'EU AI Act Full Text',url:'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689',type:'Regulation',free:true},
      {label:'GDPR Full Text',url:'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679',type:'Regulation',free:true},
      {label:'FDA AI/ML SaMD Guidance',url:'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices',type:'Regulation',free:true},
      {label:'OCC Model Risk Management SR 11-7',url:'https://www.federalreserve.gov/supervisionreg/srletters/sr1107a1.pdf',type:'Regulation',free:true},
      {label:'CCPA Text (California AG)',url:'https://oag.ca.gov/privacy/ccpa',type:'Regulation',free:true},
    ],
    glossary:[
      {term:'GDPR Article 22',def:'Right not to be subject to solely automated decisions with significant effects — requires human review and explanation.'},
      {term:'SR 11-7',def:'Fed/OCC model risk management guidance defining development, validation, and governance standards for AI/ML models.'},
      {term:'DPIA',def:'Data Protection Impact Assessment — GDPR requirement before high-risk processing, including AI profiling systems.'},
      {term:'Right to Erasure',def:'GDPR Article 17 — right to delete personal data, requiring "machine unlearning" for AI trained on that data.'},
    ]
  },
  { id:'ai-risk-manager', school:'⚖️ Governance & Risk', color:'#22C98A', icon:'⚠️',
    programs:['AI Risk Manager'],
    resources:[
      {label:'NIST AI Risk Management Framework',url:'https://airc.nist.gov/Docs/1',type:'Framework',free:true},
      {label:'COSO ERM Framework',url:'https://www.coso.org/Pages/erm.aspx',type:'Framework',free:true},
      {label:'COBIT Framework (ISACA)',url:'https://www.isaca.org/resources/cobit',type:'Framework',free:true},
      {label:'AI Incident Database',url:'https://incidentdatabase.ai/',type:'Reference',free:true},
      {label:'Verizon DBIR Report',url:'https://www.verizon.com/business/resources/reports/dbir/',type:'Research',free:true},
    ],
    glossary:[
      {term:'RTO',def:'Recovery Time Objective — maximum acceptable time to restore an AI system after failure.'},
      {term:'Model Risk',def:'Risk of adverse consequences from decisions made using inaccurate, misused, or inappropriate AI model outputs.'},
      {term:'Three Lines of Defense',def:'1st line (business owns risk), 2nd line (risk/compliance oversees), 3rd line (audit independently assures).'},
      {term:'KRI',def:'Key Risk Indicator — early warning metric for increasing AI risk exposure.'},
    ]
  },
  { id:'ai-auditor', school:'⚖️ Governance & Risk', color:'#22C98A', icon:'🔍',
    programs:['AI Auditor'],
    resources:[
      {label:'IIA International Standards',url:'https://www.theiia.org/en/standards/',type:'Standard',free:true},
      {label:'ISACA COBIT',url:'https://www.isaca.org/resources/cobit',type:'Framework',free:true},
      {label:'NYC Local Law 144 (AI Hiring)',url:'https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page',type:'Regulation',free:true},
      {label:'NIST AI RMF Measure Function',url:'https://airc.nist.gov/Docs/1',type:'Framework',free:true},
    ],
    glossary:[
      {term:'Adverse Impact Ratio',def:'Ratio of pass rates between protected and most-favored group. Below 0.8 (80% rule) triggers EEOC concern.'},
      {term:'Independent Validation',def:'Model validation by team uninvolved in development — key SR 11-7 requirement for AI governance.'},
      {term:'Audit Finding Severity',def:'Rating: Critical (active harm), High (significant risk), Medium (gap), Low (improvement), Informational.'},
    ]
  },
  { id:'ai-policy-designer', school:'⚖️ Governance & Risk', color:'#22C98A', icon:'🗝️',
    programs:['AI Policy Designer'],
    resources:[
      {label:'EU AI Act Legislative Tracker',url:'https://artificialintelligenceact.eu/',type:'Regulation',free:true},
      {label:'OECD AI Policy Observatory',url:'https://oecd.ai/',type:'Reference',free:true},
      {label:'White House AI Executive Order',url:'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/',type:'Regulation',free:true},
      {label:'Future of Life Institute AI Policy',url:'https://futureoflife.org/cause-area/artificial-intelligence/',type:'Research',free:true},
    ],
    glossary:[
      {term:'Brussels Effect',def:'Tendency for EU regulation to become global standard — EU AI Act creates worldwide compliance requirements.'},
      {term:'Rulemaking',def:'Formal process for agencies to create regulations — notice-and-comment gives stakeholders 30-60 days to comment.'},
      {term:'Policy Hierarchy',def:'Principles (why) → Policy (what) → Standards (how) → Procedures (step-by-step) → Guidelines (recommendations).'},
    ]
  },
  { id:'ai-ethics-specialist', school:'⚖️ Governance & Risk', color:'#22C98A', icon:'🧭',
    programs:['AI Ethics Specialist'],
    resources:[
      {label:'AI Now Institute Research',url:'https://ainowinstitute.org/',type:'Research',free:true},
      {label:'Partnership on AI',url:'https://partnershiponai.org/',type:'Community',free:true},
      {label:'IEEE Ethically Aligned Design',url:'https://standards.ieee.org/industry-connections/ec/ead-v2/',type:'Framework',free:true},
      {label:'Moral Machine Experiment (MIT)',url:'https://www.moralmachine.net/',type:'Tool',free:true},
    ],
    glossary:[
      {term:'Value Alignment',def:'Challenge of ensuring AI systems pursue goals beneficial to humans — making AI do what we actually want.'},
      {term:'Constitutional AI',def:"Anthropic\'s alignment approach using principles (a constitution) that guides model behavior via self-critique."},
      {term:'Ethics Washing',def:'Cosmetic AI ethics commitments without operational implementation — using ethics language to manage reputation.'},
      {term:'Specification Gaming',def:"Goodhart\'s Law in AI: model achieves specified metric in unintended way violating the spirit of the objective."},
    ]
  },
  // ── HUMAN-AI EXPERIENCE ──
  { id:'ai-ux-designer', school:'🎨 Human-AI Experience', color:'#9B59B6', icon:'🎨',
    programs:['AI UX Designer'],
    resources:[
      {label:'Google PAIR Guidebook',url:'https://pair.withgoogle.com/guidebook/',type:'Guide',free:true},
      {label:'Microsoft HAX Toolkit',url:'https://www.microsoft.com/en-us/haxtoolkit/',type:'Toolkit',free:true},
      {label:'NN/g AI UX Research',url:'https://www.nngroup.com/topic/ai/',type:'Research',free:true},
      {label:'Apple Human Interface Guidelines',url:'https://developer.apple.com/design/human-interface-guidelines/',type:'Guide',free:true},
      {label:'Material Design 3 (Google)',url:'https://m3.material.io/',type:'Guide',free:true},
    ],
    glossary:[
      {term:'Automation Bias',def:'Over-reliance on AI recommendations reducing critical thinking — key safety concern for consequential AI.'},
      {term:'Algorithm Aversion',def:'Distrust of AI even when it outperforms human judgment — often triggered by a single visible AI failure.'},
      {term:'Trust Calibration',def:'Designing AI interfaces for appropriate trust — neither over-relying nor avoiding AI assistance.'},
      {term:'Progressive Disclosure',def:'Revealing AI capabilities gradually as users develop expertise — prevents overwhelming novices.'},
    ]
  },
  { id:'conversation-designer', school:'🎨 Human-AI Experience', color:'#9B59B6', icon:'💬',
    programs:['Conversation Designer'],
    resources:[
      {label:'Conversation Design Institute',url:'https://www.conversationdesigninstitute.com/',type:'Course',free:false},
      {label:'Google Conversation Design Docs',url:'https://developers.google.com/assistant/conversation-design',type:'Guide',free:true},
      {label:'Voiceflow Documentation',url:'https://docs.voiceflow.com/',type:'Official Docs',free:true},
      {label:'Rasa Open Source Docs',url:'https://rasa.com/docs/rasa/',type:'Official Docs',free:true},
      {label:'Dialogflow CX Documentation',url:'https://cloud.google.com/dialogflow/cx/docs',type:'Official Docs',free:true},
    ],
    glossary:[
      {term:"Grice\'s Maxims",def:'Principles of cooperative conversation: Quality (be truthful), Quantity (be brief), Relevance, Manner (be clear).'},
      {term:'Intent',def:'Purpose or goal a user wants to accomplish in a conversational AI interaction.'},
      {term:'Entity',def:'Information extracted from user utterance needed to fulfill an intent — e.g., date, location, quantity.'},
      {term:'NLU',def:'Natural Language Understanding — AI capability to extract meaning, intent, and entities from natural language.'},
      {term:'Fallback Intent',def:"Response when NLU can\'t match user input to any defined intent — the most important flow to design."},
    ]
  },
  { id:'human-ai-interaction', school:'🎨 Human-AI Experience', color:'#9B59B6', icon:'🤝',
    programs:['Human-AI Interaction Specialist'],
    resources:[
      {label:'Stanford HAI Research',url:'https://hai.stanford.edu/research',type:'Research',free:true},
      {label:'NASA-TLX Cognitive Load Tool',url:'https://humansystems.arc.nasa.gov/groups/tlx/',type:'Tool',free:true},
      {label:'ACM CHI Conference Proceedings',url:'https://dl.acm.org/conference/chi',type:'Research',free:true},
      {label:'NN/g Human-AI Interaction',url:'https://www.nngroup.com/topic/ai/',type:'Research',free:true},
    ],
    glossary:[
      {term:'Mental Model',def:"User\'s internal representation of how an AI system works — often inaccurate. Design must bridge the gap."},
      {term:'Vigilance Decrement',def:'Reduction in attentiveness when monitoring automated systems over time — safety concern for AI monitoring.'},
      {term:'Mode Confusion',def:"Uncertainty whether AI or human is in control — leads to aviation accidents and applies to AI supervision."},
      {term:'Meaningful Human Control',def:'EU AI Act Article 14: humans must genuinely understand and be capable of intervening — not just rubber-stamping.'},
    ]
  },
  { id:'ai-workflow-designer', school:'🎨 Human-AI Experience', color:'#9B59B6', icon:'🔀',
    programs:['AI Workflow Designer'],
    resources:[
      {label:'Zapier Documentation',url:'https://zapier.com/help',type:'Official Docs',free:true},
      {label:'Make Documentation',url:'https://www.make.com/en/help',type:'Official Docs',free:true},
      {label:'n8n Documentation',url:'https://docs.n8n.io/',type:'Official Docs',free:true},
      {label:'Power Automate Docs',url:'https://docs.microsoft.com/en-us/power-automate/',type:'Official Docs',free:true},
      {label:'Retool Documentation',url:'https://docs.retool.com/',type:'Official Docs',free:true},
      {label:'Celonis Process Mining Academy',url:'https://academy.celonis.com/',type:'Course',free:true},
    ],
    glossary:[
      {term:'Process Mining',def:'Discovering real business processes by analyzing event logs from enterprise information systems.'},
      {term:'Webhook',def:'HTTP callback that triggers a workflow when a specific event occurs — primary mechanism for event-driven automation.'},
      {term:'Idempotency',def:'Property where running the same operation multiple times produces the same result — critical for reliable AI workflow retries.'},
    ]
  },
  { id:'ai-experience-architect', school:'🎨 Human-AI Experience', color:'#9B59B6', icon:'✨',
    programs:['AI Experience Architect'],
    resources:[
      {label:'Service Design Network',url:'https://www.service-design-network.org/',type:'Community',free:true},
      {label:'IDEO Design Thinking',url:'https://designthinking.ideo.com/',type:'Guide',free:true},
      {label:'Google PAIR Guidebook',url:'https://pair.withgoogle.com/guidebook/',type:'Guide',free:true},
      {label:'Figma Community Resources',url:'https://www.figma.com/community',type:'Tool',free:true},
    ],
    glossary:[
      {term:'Experience Architecture',def:'Designing entire AI experience systems across all touchpoints — not individual interfaces but the complete ecosystem.'},
      {term:'Service Blueprint',def:'Diagram showing all components: customer actions, frontstage AI, backstage AI, and supporting systems.'},
      {term:'Touchpoint',def:'Any point of interaction between user and AI system — web, mobile, voice, email, in-store, API.'},
      {term:'Omnichannel AI',def:'AI experience maintaining context and continuity across all channels — remembers you regardless of how you interact.'},
    ]
  },
];
