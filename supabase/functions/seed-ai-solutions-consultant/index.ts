import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/adminGuard.ts";
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
  {"title": "Module 1: AI Consulting Landscape", "desc": "Market, models, hypothesis-driven problem solving.", "lessons": [
    {"title": "1.1 AI Consulting Market Overview", "desc": "The $50B+ AI consulting market (McKinsey QuantumBlack, Accenture Applied Intelligence, Deloitte AI Institute). Three engagement models: strategy advisory, implementation, managed services. Specialist commands 40% premium. Entry paths: Big 4, boutique, independent, vendor-embedded."},
    {"title": "1.2 Hypothesis-Driven Problem Solving", "desc": "Management consulting methodology for AI: issue trees, MECE decomposition, pyramid principle. Start with hypotheses, test with data. Case: McKinsey retail AI — structured tree starting with 15% inventory cost target."},
    {"title": "1.3 Client Discovery", "desc": "The most important engagement phase. Discovery interview framework: business context, problem exploration, data landscape, organizational readiness. The 5 Whys. Red flags: no metrics, missing data, organizational resistance."},
    {"title": "1.4 Winning AI Proposals", "desc": "Structure: executive summary, situation analysis, approach, differentiation, commercial terms. Value-based pricing argument. Case: beating larger firms — specificity beats brand in competitive evaluations."},
    {"title": "1.5 Engagement Delivery", "desc": "Phases: discovery, PoC, implementation, knowledge transfer. Workshop facilitation. The handoff problem. Case: Accenture's 'build with' model ensuring knowledge transfer throughout delivery."},
    {"title": "1.6 Managing Expectations", "desc": "The demo-to-production expectation gap. Concrete accuracy metrics, baseline comparison, confidence intervals. Case: logistics AI nearly failed because consultant promised GPT-4 demo accuracy on custom task."},
    {"title": "1.7 Assessment: Consulting Pitch", "desc": "Develop a proposal for an insurance company AI opportunity: discovery plan, hypothesis tree, approach, metrics, pricing."}
  ]},
  {"title": "Module 2: Technical Assessment", "desc": "Evaluating AI readiness, data landscape, infrastructure, and ROI.", "lessons": [
    {"title": "2.1 AI Readiness Framework", "desc": "Five dimensions: data, infrastructure, talent, process, leadership readiness. Score 1-5, find binding constraint. IBM AI Ladder: collected → organized → analyzed → infused."},
    {"title": "2.2 Data Landscape Assessment", "desc": "Quality profiling, sufficiency benchmarks (1K images/class, 10K tabular rows, 500 NLP examples/class), red flags. Case: healthcare engagement where critical outcome variable was never linked across systems."},
    {"title": "2.3 ML Infrastructure Assessment", "desc": "Maturity levels 0-3, gap analysis, remediation estimate ($500K-$2M for L0→L2). Case: e-commerce company needed L3 infrastructure for real-time recommendations — Phase 1 became infrastructure buildout."},
    {"title": "2.4 Team Capability and Build vs. Buy", "desc": "Dimensions: DE, MLE, DS, AI PM, executive literacy. Capability gap determines engagement model. Build for differentiation, buy for commodity. Case: Deloitte's embedded AI Academy."},
    {"title": "2.5 ROI and Business Case", "desc": "Components: current state cost, AI value, implementation cost, time to value. Conservative approach, sensitivity analysis. Case: manufacturing predictive maintenance — $2M cost, $4M annual value, 6-month payback."},
    {"title": "2.6 Technology Selection", "desc": "Evaluate for requirements, TCO, client operability, vendor stability. Avoid consultant technology preference bias. Case: when switching costs outweigh capability improvements."},
    {"title": "2.7 Assessment: AI Readiness Report", "desc": "Full 5-dimension scored assessment, data landscape analysis, infrastructure gap, team matrix, ROI estimation, technology recommendation."}
  ]},
  {"title": "Module 3: Solution Design", "desc": "Architecture, prototyping, vendor evaluation, PoC management.", "lessons": [
    {"title": "3.1 Solution Architecture for Consultants", "desc": "Key decisions: data pipeline, model selection, integration, deployment, monitoring. Common mistakes: real-time when batch suffices, deep learning when simple ML works. Case: 1-page retail architecture implementable by client IT team."},
    {"title": "3.2 Rapid Prototyping", "desc": "80/20 prototype in 2-4 weeks. Tools: Jupyter, Streamlit, Hugging Face. Test the right assumptions. Case: 3-week prototype saved client from $5M investment by revealing data quality issues."},
    {"title": "3.3 Vendor Evaluation", "desc": "Framework: requirements alignment, technical evaluation on client data, security, commercial terms, vendor stability. Case: 4 document processing vendors — benchmark on client data produced dramatically different results than demos."},
    {"title": "3.4 Proof of Concept Management", "desc": "Scope: which questions must it answer? Success criteria, failure criteria, 4-8 week timeboxing. PoC failure is success — prevents much larger failure. Case: manufacturing camera quality insufficient for AI — discovered before AI development."},
    {"title": "3.5 Change Management Design", "desc": "Stakeholder mapping, resistance analysis, communication, training, adoption metrics. AI-specific: displacement fear, quality distrust, workflow disruption. Case: bank agent adoption from 40% to 92%."},
    {"title": "3.6 Project Management for AI Uncertainty", "desc": "Agile for AI. Timeline reality: estimates not commitments. Risk types and mitigations. No-surprise stakeholder management. Case: month 2 data quality issue — recovery plan and communication."},
    {"title": "3.7 Assessment: Solution Design Document", "desc": "Complete design for logistics route optimization: architecture, vendor matrix, PoC design, change management, risk register, project plan."}
  ]},
  {"title": "Module 4: Industry Specialization", "desc": "Healthcare, finance, retail, manufacturing AI consulting with regulatory depth.", "lessons": [
    {"title": "4.1 Healthcare AI Consulting", "desc": "HIPAA, FDA (CDS vs. SaMD), GDPR. Use cases: clinical decision support, operations, population health. Workflow integration. Case: sepsis AI — clinical workflow integration took 3x longer than model development."},
    {"title": "4.2 Financial Services AI Consulting", "desc": "SR 11-7 model risk management. Fair lending: disparate impact, adverse action notices, bias audits. Case: community bank AI scoring — documentation doubled timeline but regulatory examination was seamless."},
    {"title": "4.3 Retail and CPG AI Consulting", "desc": "Demand forecasting (15-25% inventory reduction), dynamic pricing, personalization. Retail data advantage. Case: specialty retailer — 23% accuracy improvement, $4M first-year value."},
    {"title": "4.4 Manufacturing AI Consulting", "desc": "Predictive maintenance (20-40% downtime reduction), quality control, process optimization. OT/IT integration, air-gap deployment. Case: automotive supplier — sensor installation phase was critical before ML development."},
    {"title": "4.5 Building an AI Consulting Practice", "desc": "Horizontal vs. vertical vs. hybrid specialization. 40-60% premium for specialization. BD: thought leadership, network, references. Case: $2M independent practice built on healthcare AI compliance specialization."},
    {"title": "4.6 Ethics in AI Consulting", "desc": "Risk categories: bias, privacy, autonomous decisions, misinformation. Professional obligation: disclose proactively, decline harmful engagements. Case: consultant discovering disparate impact before deployment — prevented regulatory action."},
    {"title": "4.7 Assessment: Industry Case Study Analysis", "desc": "Analyze retail demand forecasting case: business problem, data landscape, architecture, change management, lessons, what you would do differently."}
  ]},
  {"title": "Module 5: Delivering Value", "desc": "Measurement, continuous improvement, relationship expansion, knowledge transfer.", "lessons": [
    {"title": "5.1 Value Realization", "desc": "Methodology: baseline, controlled comparison, attribution. Challenges: attribution confusion, baseline drift, delayed value. Framework: 3 metrics before launch, measured at 30/60/90/180 days. Case: AI sales forecasting measurement."},
    {"title": "5.2 Continuous Improvement", "desc": "Monthly performance review, quarterly drift analysis, annual retraining, as-needed updates. Degradation causes. Client ownership after engagement. Case: supply chain AI detecting COVID drift in 3 months vs. estimated 12+."},
    {"title": "5.3 Land and Expand Strategy", "desc": "Deliver bounded project → prove value → expand to adjacent use cases. Expansion timing: when initial system is in production delivering value. Account planning. Case: $200K PoC → $2M multi-year engagement."},
    {"title": "5.4 Knowledge Transfer", "desc": "Documentation, training, pairing, gradual handoff. Deliverables: technical docs, runbook, training evidence. Failure mode: delivering docs without validating client can operate. Case: 8-week structured handoff for customer service AI."},
    {"title": "5.5 Vendor to Strategic Partner", "desc": "Trust-building: honesty, sharing negatives, recommending competitors when appropriate. Relationship depth indicators: executive access, strategic advance notice. Case: underperforming AI project strengthening partnership through transparent communication."},
    {"title": "5.6 Case Study Development", "desc": "Structure: context, challenge, approach, results, lessons. Get permission early. Distribution channels. ROI: strong case study generates 5-10x development cost in BD value. Case: translating ML metrics to business outcomes."},
    {"title": "5.7 Module 5 Capstone: Engagement Simulation", "desc": "Complete simulated logistics AI engagement: discovery findings, solution design, project plan, change management, value measurement, knowledge transfer plan, 1-page case study."}
  ]},
  {"title": "Module 6: Commercial Skills", "desc": "Pricing, business development, proposals, negotiation, practice scaling.", "lessons": [
    {"title": "6.1 AI Consulting Pricing", "desc": "Rate benchmarks 2024: independent $200-400/hr, boutique $300-600/hr, Big 4 $500-1000/hr. Pricing models: hourly, fixed-fee, retainer, outcome-based. Value-based argument: $5M client value → $500K fee = 10x ROI. Case: transitioning from hourly to fixed-fee."},
    {"title": "6.2 Building a Pipeline", "desc": "Metrics: new leads, opportunities, proposals, win rate, contract value. Activities: content (30-60 day lag), speaking (high credibility), network (highest conversion), referrals. Time allocation: 20% BD even at full utilization. Case: $1.5M practice through LinkedIn — 50K followers, 80% inbound."},
    {"title": "6.3 Proposal Optimization", "desc": "Win rate: average 30-40%, top 50-60%. Quality factors: specificity, credibility, ROI clarity, competitiveness. Process: qualify first, discover before proposing, senior review. Case: firm improving win rate from 28% to 45%."},
    {"title": "6.4 Negotiations", "desc": "Preparation: BATNA, client priorities, scenarios. Pressure tactics and responses. Key terms: IP ownership, scope change process, payment milestones, termination provisions. Case: $1.5M contract negotiation lessons."},
    {"title": "6.5 Partnership Strategy", "desc": "Types: technology (AWS/GCP/Azure), complementary services, data. Reciprocal referral model. Evaluation: audience alignment, complementarity, quality. Case: 3 system integrator partnerships generating 40% of revenue."},
    {"title": "6.6 Scaling to a Team", "desc": "Triggers: $400K+ revenue, team capability requests, specialization needs. First hire decision. Quality: methodology standardization, work product review, NPS. Case: solo to 12-person practice in 3 years."},
    {"title": "6.7 Capstone: Business Plan", "desc": "Plan for AI consulting practice: specialization positioning, pricing, Year 1-3 projections, BD approach, team structure, quality management, competitive differentiation."}
  ]},
  {"title": "Module 7: Implementation Management", "desc": "Complex AI project delivery, technical leadership, QA, deployment.", "lessons": [
    {"title": "7.1 Implementation Planning", "desc": "WBS, resource plan, dependency map, risk register, success criteria. ML-specific: data prep takes 40-60%, model timelines are ranges, deployment takes 2-3x longer than estimated. Case: enterprise NLP project on-time delivery despite scope changes."},
    {"title": "7.2 Technical Leadership Without Authority", "desc": "Shared understanding, architectural guardrails, technical debt management, expertise recognition. Client engineer dynamic. Disagreement handling. Escalation framework. Case: disagreement with senior client DS — better decision, preserved relationship."},
    {"title": "7.3 AI Quality Assurance", "desc": "Dimensions: model, data, system, integration quality. Acceptance testing: criteria before testing, production-representative scenarios, business team involvement. Case: healthcare AI with physician evaluation before production."},
    {"title": "7.4 Production Deployment", "desc": "Cutover planning, rollback plan, communication, scheduling. Hypercare period (2-4 weeks). Common issues. Stabilization handoff. Case: real-time pricing optimization deployment — issues and stabilization."},
    {"title": "7.5 Stakeholder Conflict Management", "desc": "Common conflicts: IT vs. business, data vs. ML teams, users vs. AI, legal vs. timeline. Interest-based negotiation, escalation timing, documented decisions. Case: data governance vs. ML team data access — satisfying both parties."},
    {"title": "7.6 Post-Implementation Review", "desc": "Structure: went well, improvements, client perspective, value delivered. Separate client-facing and internal PIR. Case: technically successful but dissatisfied client — root cause analysis leading to methodology change."},
    {"title": "7.7 Capstone: Implementation Plan", "desc": "Complete plan for B2B SaaS churn prediction AI: WBS, resources, dependencies, risks, stakeholder communication, acceptance testing, deployment, PIR methodology."}
  ]},
  {"title": "Module 8: Specializations — GenAI, MLOps, and AI Strategy", "desc": "Premium consulting specializations and how to build them.", "lessons": [
    {"title": "8.1 Generative AI Consulting", "desc": "Scope: use case identification, vendor evaluation, prompt engineering, RAG architecture, responsible AI. Enterprise stack: foundation model + retrieval + orchestration + application. Case: knowledge base assistant achieving 92% accuracy on internal policy questions."},
    {"title": "8.2 MLOps Advisory", "desc": "Maturity assessment L0-L4. Common gaps: no experiment tracking, unmonitored models, no registry. Build vs. buy: most enterprises should buy. Case: financial services — 12 unmonitored models discovered, 6-month remediation roadmap."},
    {"title": "8.3 AI Strategy Consulting", "desc": "Components: opportunity landscape, competitive assessment, capability gaps, investment roadmap. Pitfalls: ignoring capability reality, no governance, no measurement. Case: Fortune 500 retailer — 2-year roadmap with $50M Year 3 expected value."},
    {"title": "8.4 Data Strategy Consulting", "desc": "Architecture (warehouse vs. lakehouse vs. data mesh), governance, data products, team design. Data monetization opportunity. Case: healthcare network enabling AI while maintaining HIPAA compliance."},
    {"title": "8.5 AI Governance Consulting", "desc": "Ethics policy, bias audit methodology, explainability, SR 11-7, EU AI Act compliance. Business case: governance prevents fines, reputation damage, trust loss. Case: credit card issuer collections AI disparate impact remediation."},
    {"title": "8.6 International AI Consulting", "desc": "Markets: EU (AI Act demand), Middle East (sovereign AI), Southeast Asia, India. Cross-cultural delivery. Regulatory navigation. Case: Saudi Arabia implementation — cultural adaptations and partnership model."},
    {"title": "8.7 Capstone: Specialization Strategy", "desc": "Define target specialization, required credentials, 12-month content plan, pricing, target clients, 3-year revenue projection."}
  ]},
  {"title": "Module 9: Future of AI Consulting", "desc": "AI tools, emerging markets, adapting to change, ethics, thought leadership.", "lessons": [
    {"title": "9.1 AI Tools for Consultants", "desc": "Discovery: interview analysis, competitive intelligence, financial modeling. Delivery: code generation, document generation, presentation design. BD: social listening, content generation. Productivity gain: 30-50%. Case: boutique consultancy transforming practice with AI tools."},
    {"title": "9.2 Emerging Markets", "desc": "Agentic AI (fastest-growing), edge AI, industry-specific foundation models, AI governance acceleration (EU AI Act 2026), synthetic data. Case: firm capturing 60% of initial agentic AI consulting demand."},
    {"title": "9.3 Adapting to Capability Changes", "desc": "Foundation model shift: custom model training → prompt engineering + integration. Permanent value: business understanding, organizational capability, governance, complex integration. More valuable: strategy, governance, change management, industry expertise. Case: data science firm pivoting after GPT-4."},
    {"title": "9.4 Consulting Ethics", "desc": "Scenarios: competing client confidentiality, quality vs. speed, harmful AI, vendor conflicts. Professional standards: transparency, accuracy, independence, client primacy. Case: vendor recommendation conflict of interest — ethical resolution."},
    {"title": "9.5 Thought Leadership", "desc": "Channels: writing, speaking, research. Newsletter strategy: 5K engaged > 50K passive. Content from client insights. Case: former McKinsey consultant building 100K-subscriber newsletter on AI in financial services."},
    {"title": "9.6 Career Development", "desc": "Progression: Analyst → Senior → Manager → Director → Partner. Compensation 2024: Analyst $80-100K, Senior $150-200K, Manager $200-280K, Director $280-400K, Partner $400K-$1M+. Case: successful AI consulting partner trajectory."},
    {"title": "9.7 Final Capstone: 3-Year Career Plan", "desc": "Current capabilities, target specialization, skill gaps, learning plan, reputation-building (content, speaking, research), BD targets, financial milestones with quarterly cadence."}
  ]}
,
  {"title": "Module 10: AI Consulting Career — Building Your Path to Partnership", "desc": "Final module: positioning your AI consulting career, specialization strategy, thought leadership, and the 3-year plan to reach Partner or independent practice leader.", "lessons": [
    {"title": "10.1 AI Consulting Career Levels and Compensation", "desc": "Career progression: Analyst ($80-100K) → Senior Consultant ($150-200K) → Manager ($200-280K) → Director ($280-400K) → Partner ($400K-$1M+). AI premium: 30-50% above traditional consulting. Fastest path to Partner: own a signature case study, build a specialization, and develop a reference customer base within 3 years."},
    {"title": "10.2 Building Your Signature Specialization", "desc": "The most successful AI consultants own a specific intersection: industry × capability × regulatory context. Example: financial services × generative AI × EU AI Act. This intersection commands 2-3x the generalist rate and is defensible against larger firms. Specialization strategy: pick the intersection where your background creates an asymmetric advantage, publish 3 case studies, speak at 2 industry conferences, and build 10 reference relationships within 18 months."},
    {"title": "10.3 Thought Leadership as Business Development", "desc": "AI consulting thought leadership converts to revenue at 5-10x the cost of other BD channels. The flywheel: publish weekly LinkedIn insights → attract inbound inquiry → reference clients → speaking invitations → higher-profile clients → richer content. 5,000 engaged newsletter subscribers generates more qualified leads than a traditional consulting firm's entire BD budget. Content strategy: write what senior practitioners can't find in textbooks."},
    {"title": "10.4 Building the Independent AI Consulting Practice", "desc": "From employee to independent in 12 months: build 3 reference clients while employed, develop a $200K annual pipeline before leaving, establish LLC and professional infrastructure, create a retainer offer ($10-20K/month for ongoing advisory). The retainer model creates predictable revenue that project-based work cannot. Target: 3 retainer clients at $15K/month = $540K ARR as a solo practitioner. Case study: how 5 former Big 4 AI leads built $1M+ solo practices in under 2 years."},
    {"title": "10.5 Managing Client Relationships at Scale", "desc": "When you have 10+ active clients, relationship management becomes a system. CRM for consultants: HubSpot or Notion database tracking relationship health, last contact, next action, and revenue potential. The quarterly business review as relationship investment: 1-hour QBR per client per quarter builds loyalty that survives competitive pitches. Referral system: every satisfied client should become a referral source — build this into the engagement contract with explicit asks."},
    {"title": "10.6 International AI Consulting: Building a Global Practice", "desc": "AI consulting demand is global but delivery models must adapt. EU market: highest regulatory complexity, best rates, longest sales cycles. Middle East: sovereign AI investment creates massive opportunities for the right credentials. LATAM: growing AI adoption, price-sensitive, relationship-first. APAC: Singapore hub for SE Asia, Japan requires Japanese-speaking partners. Multi-market strategy: anchor in your home market, establish 2 international partnerships in year 2, pursue direct international clients in year 3. The global practice multiplier: one international case study opens doors in 10 markets simultaneously."},
    {"title": "10.7 Module 10 Capstone: Your 3-Year AI Consulting Career Plan", "desc": "Comprehensive 3-year career plan: Year 1 (specialization selection, first 3 case studies, first speaking engagement, target $200K revenue), Year 2 (reference client network of 10, retainer model launch, first international engagement, target $400K revenue), Year 3 (partnership track or $1M independent practice, industry recognition, 20-person referral network). Present your plan with quarterly milestones, specific target clients, and the single most important investment you will make in each year."}
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
