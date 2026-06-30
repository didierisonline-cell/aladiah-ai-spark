-- =============================================================================
-- AI Project Manager & Delivery Leader — Course Structure (18 modules)
-- Creates: course + 18 chapters + 5 lesson shells per chapter + 18 quiz shells
-- curriculum_version: pm-v1
-- Apply: paste into Supabase SQL Editor → Run BEFORE content migrations
-- Idempotent: safe to re-run; uses INSERT IF NOT EXISTS checks throughout
-- =============================================================================

-- 1) Course (idempotent on title + curriculum_version) ------------------------
DO $$
DECLARE cid uuid;
BEGIN
  SELECT id INTO cid FROM public.courses
    WHERE title = 'AI Project Manager & Delivery Leader'
      AND curriculum_version = 'pm-v1';
  IF cid IS NULL THEN
    INSERT INTO public.courses (title, description, is_published, is_flagship,
        flagship_version, curriculum_version, launch_status,
        target_market, target_salary_low, target_salary_high, translations)
    VALUES ('AI Project Manager & Delivery Leader',
        'Master the complete PM skill set for the AI era: initiation through closure, Agile and traditional delivery, risk and finance, stakeholder leadership, and AI-augmented project intelligence. 18 modules covering everything a world-class AI project manager must know.',
        false, true, 'pm-v1', 'pm-v1', 'draft',
        'Career-changers and professionals moving into project management and delivery leadership roles',
        85000, 185000, '{}'::jsonb);
  END IF;
END $$;

-- 2) Session-local helper: get-or-create a module by (course, order_index),
--    seed its lessons if empty, ensure a chapter_end quiz shell. Idempotent.
CREATE OR REPLACE FUNCTION pg_temp.seed_pm_module(
  p_idx int, p_title text, p_desc text, p_pass int, p_l text[], p_ld text[]
) RETURNS void LANGUAGE plpgsql AS $fn$
DECLARE cid uuid; m_ch uuid; i int;
BEGIN
  SELECT id INTO cid FROM public.courses
    WHERE title = 'AI Project Manager & Delivery Leader'
      AND curriculum_version = 'pm-v1';

  SELECT id INTO m_ch FROM public.chapters WHERE course_id = cid AND order_index = p_idx;
  IF m_ch IS NULL THEN
    INSERT INTO public.chapters (course_id, title, description, order_index, translations)
    VALUES (cid, p_title, p_desc, p_idx, '{}'::jsonb) RETURNING id INTO m_ch;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = m_ch) THEN
    FOR i IN 1 .. array_length(p_l, 1) LOOP
      INSERT INTO public.videos (chapter_id, title, description, order_index, translations)
      VALUES (m_ch, p_l[i], p_ld[i], i, '{}'::jsonb);
    END LOOP;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = m_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score) VALUES (m_ch, 'chapter_end', p_pass);
  END IF;
END;
$fn$;

-- 3) Modules (18) — titles/lessons/descriptions mirror curriculum exactly -----

SELECT pg_temp.seed_pm_module(1, 'PM Fundamentals & the AI Era',
  'How AI is reshaping the project management role — from manual tracking to intelligent delivery — alongside the core frameworks, lifecycle phases, and tools every modern PM must master.',
  80,
  ARRAY['The PM Role in the AI Era','Delivery Frameworks: Waterfall, Agile & Hybrid','Project Lifecycle & Phase Management','PMBOK 7th Edition & Performance Domains','AI Tools Every PM Must Master Today'],
  ARRAY['How AI is transforming project management — from manual tracking to intelligent delivery. Produces an AI PM Operating Charter.','Waterfall, Agile, Scrum, Kanban, SAFe, and hybrid: when to use each and how to choose. Produces a Framework Selection Guide.','Initiating, planning, executing, monitoring, and closing: the five-phase lifecycle with AI acceleration. Produces a Phase Checklist.','PMBOK 7th edition principles, performance domains, and the shift from process to outcomes. Produces a PMBOK Domain Map.','ChatGPT, Copilot, Jira AI, Notion AI, and specialized PM tools — your daily AI toolkit. Produces an AI Tool Inventory.']);

SELECT pg_temp.seed_pm_module(2, 'Project Initiation & Business Case',
  'How to start a project right: constructing a compelling business case, drafting a charter with real authority, mapping stakeholders, running a high-impact kick-off, and using AI to accelerate every initiation deliverable.',
  80,
  ARRAY['Business Case Development & Feasibility','Project Charter: Structure, Authority & Approval','Stakeholder Identification & Initial Mapping','Project Kick-Off: Preparation & Facilitation','AI-Assisted Initiation: Prompting for Charters & Analysis'],
  ARRAY['How to construct a business case that survives executive scrutiny: problem statement, options analysis, financial case, risk summary. Produces a Business Case Template.','The five elements every charter must contain: purpose, scope, authority, milestones, and success metrics. Produces a Project Charter.','Who matters, what they want, and how to reach them: power/interest matrix, influence mapping, and initial engagement strategy. Produces a Stakeholder Register.','How to run a kick-off meeting that creates alignment, surfaces risks early, and energizes the team. Produces a Kick-Off Agenda & Playbook.','Prompting AI to draft business cases, charters, feasibility summaries, and stakeholder maps in hours instead of days. Produces an AI Initiation Prompt Library.']);

SELECT pg_temp.seed_pm_module(3, 'Scope Management & WBS',
  'Defining, structuring, and protecting scope: from the scope statement and WBS to requirements traceability and integrated change control, with AI tools to audit and close gaps.',
  80,
  ARRAY['Scope Definition & Statement of Work','Work Breakdown Structure (WBS) Mastery','Requirements Elicitation & Traceability Matrix','Scope Baseline & Integrated Change Control','AI for Scope Documentation & Gap Analysis'],
  ARRAY['How to write a scope statement that prevents disputes: inclusions, exclusions, deliverables, and acceptance criteria. Produces a Scope Statement.','Decomposing project work into manageable packages: WBS structure, coding, and the 100% rule. Produces a WBS Dictionary.','Gathering, validating, and tracing requirements from business need to deliverable: interviews, workshops, RTM. Produces a Requirements Traceability Matrix.','Establishing the scope baseline and managing changes: CCB, impact assessment, and change log discipline. Produces a Change Control Process.','Using AI to identify scope gaps, generate requirements from briefs, and audit WBS completeness. Produces an AI Scope Audit Prompt Set.']);

SELECT pg_temp.seed_pm_module(4, 'Schedule Management & Critical Path',
  'Building and defending the schedule: network diagrams, critical path analysis, resource-loaded Gantt charts, schedule compression techniques, and AI-powered predictive timeline analysis.',
  85,
  ARRAY['Schedule Planning & Network Diagrams','Critical Path Method (CPM) & Float Analysis','Resource-Loaded Schedules & Gantt Charts','Schedule Compression: Crashing & Fast-Tracking','AI-Powered Scheduling & Predictive Timeline Analysis'],
  ARRAY['Activity definition, sequencing, and dependency mapping: PDM, AON, and network diagram construction. Produces a Network Diagram.','Finding the critical path, calculating float, and identifying schedule risk hot spots. Produces a Critical Path Analysis.','Assigning resources to activities, identifying over-allocation, and balancing workload. Produces a Resource-Loaded Schedule.','When and how to compress the schedule: crashing (adding resources) vs. fast-tracking (overlapping tasks), trade-offs and risks. Produces a Schedule Compression Analysis.','AI tools for schedule optimization, delay prediction, and what-if analysis. Produces an AI Schedule Intelligence Report.']);

SELECT pg_temp.seed_pm_module(5, 'Risk Management',
  'Identifying, analysing, and responding to risk: from the risk register and heat map through quantitative Monte Carlo simulation to AI-powered early warning systems.',
  85,
  ARRAY['Risk Identification Techniques & Risk Register','Qualitative Risk Analysis & Prioritization','Quantitative Risk Analysis & Monte Carlo Simulation','Risk Response Strategies & Contingency Planning','AI for Predictive Risk Detection & Early Warning Systems'],
  ARRAY['Brainstorming, SWOT, assumption analysis, and expert judgment: how to surface risks others miss. Produces a Risk Register.','Probability-impact matrix, risk scoring, and prioritization: separating the critical few from the trivial many. Produces a Risk Heat Map.','Expected monetary value, decision trees, and Monte Carlo: quantifying risk exposure in dollars and days. Produces a Quantitative Risk Report.','Avoid, mitigate, transfer, accept: choosing the right response for each risk category. Produces a Risk Response Plan.','Using AI to mine historical data, detect early warning signals, and generate risk scenarios. Produces an AI Risk Monitoring Dashboard.']);

SELECT pg_temp.seed_pm_module(6, 'Financial Management & Earned Value',
  'Estimating, budgeting, and controlling project finances: cost estimation techniques, the cost baseline, earned value metrics, financial forecasting at completion, and AI-powered cost monitoring.',
  85,
  ARRAY['Cost Estimation Techniques & Accuracy Ranges','Budget Development & Cost Baseline','Earned Value Management: CPI, SPI & Variance Analysis','Financial Forecasting: EAC, ETC & Variance at Completion','AI-Powered Financial Monitoring & Reporting'],
  ARRAY['Analogous, parametric, bottom-up, and three-point estimating: choosing the right technique for the project phase. Produces a Cost Estimate.','Aggregating estimates into a budget, establishing the cost baseline, and setting management reserves. Produces a Cost Baseline.','EV, PV, AC, CPI, SPI: the earned value metrics every PM must master for credible status reporting. Produces an EVM Dashboard.','Calculating EAC, ETC, and TCPI: how to forecast project cost at completion with confidence intervals. Produces a Financial Forecast Report.','Using AI to detect cost anomalies, automate EVM calculations, and generate executive financial summaries. Produces an AI Finance Prompt Set.']);

SELECT pg_temp.seed_pm_module(7, 'Stakeholder & Communication Management',
  'Mapping and engaging stakeholders from power/interest analysis through executive board reporting, conflict resolution, and AI-drafted status communications.',
  80,
  ARRAY['Stakeholder Analysis: Power, Interest & Influence Mapping','Communication Planning for Complex Projects','Executive & Board-Level Reporting','Conflict Resolution & Difficult Conversations','AI for Communication: Status Reports, Updates & Summaries'],
  ARRAY['Power/interest grid, influence/impact matrix, salience model: mapping who matters and how to engage them. Produces a Stakeholder Engagement Plan.','Communication matrix, channels, frequency, and escalation paths: the blueprint for stakeholder alignment. Produces a Communication Plan.','What executives want to know: RAG status, key decisions, risks, and forward look — in two minutes or less. Produces an Executive Dashboard Template.','Principled negotiation, de-escalation, and the hard conversations every PM must learn to have. Produces a Conflict Resolution Playbook.','Using AI to draft status reports, meeting summaries, stakeholder briefings, and risk communications in minutes. Produces an AI Communication Prompt Library.']);

SELECT pg_temp.seed_pm_module(8, 'Team Leadership & High Performance',
  'Building and sustaining high-performance project teams: formation strategies, motivation and delegation frameworks, performance management, remote leadership, and AI-augmented team productivity.',
  80,
  ARRAY['Building High-Performance Project Teams','Motivation, Delegation & Accountability Frameworks','Performance Management & Constructive Feedback','Remote & Distributed Team Leadership','AI-Augmented Team Productivity & Collaboration'],
  ARRAY['Tuckman model, team formation strategies, competency mapping, and creating psychological safety. Produces a Team Formation Plan.','Herzberg, intrinsic motivation, RACI-based delegation, and accountability contracts. Produces a Delegation & Accountability Framework.','Giving feedback that improves performance, managing underperformers, and conducting project team reviews. Produces a Performance Management Playbook.','Asynchronous communication, remote engagement, time zone management, and distributed team rituals. Produces a Remote Team Operating Guide.','AI tools for team productivity: meeting assistants, task automation, sentiment analysis, and workload balancing. Produces an AI Team Toolkit.']);

SELECT pg_temp.seed_pm_module(9, 'Procurement & Vendor Management',
  'Make-or-buy decisions, RFP development, contract negotiation, vendor governance, and AI-assisted procurement evaluation — covering the full vendor lifecycle from sourcing to SLA enforcement.',
  80,
  ARRAY['Procurement Strategy & Make-or-Buy Analysis','RFP & RFQ Development: What Vendors Actually Need','Contract Types, Negotiation & Risk Allocation','Vendor Performance Management & Governance','AI for Procurement: Evaluation, Analysis & Contract Intelligence'],
  ARRAY['When to build vs. buy vs. partner: total cost of ownership, core competency, and strategic fit analysis. Produces a Make-or-Buy Analysis.','Writing RFPs that attract the right vendors and set the foundation for a successful engagement. Produces an RFP Template.','Fixed price, T&M, cost-reimbursable: matching contract type to risk profile. Negotiation tactics and red-flag clauses. Produces a Contract Risk Assessment.','SLAs, KPIs, governance meetings, and the escalation path when vendors underperform. Produces a Vendor Governance Framework.','Using AI to analyze RFP responses, score vendor proposals, review contract terms, and monitor SLA compliance. Produces an AI Procurement Prompt Set.']);

SELECT pg_temp.seed_pm_module(10, 'Quality Management',
  'Planning, assuring, and controlling quality across the project lifecycle: quality management plans, process audits, control charts, Lean improvement, and AI-driven defect prediction.',
  80,
  ARRAY['Quality Planning & Quality Management Plan','Quality Assurance: Process Audits & Standards','Quality Control: Inspection, Testing & Metrics','Process Improvement: Lean PM & Continuous Improvement','AI for Quality: Defect Prediction & Root Cause Analysis'],
  ARRAY['Cost of quality, quality standards selection, and building a Quality Management Plan that stakeholders trust. Produces a Quality Management Plan.','Process audits, compliance checks, and quality gates: how to build quality into the process rather than inspect it in. Produces a QA Checklist.','Control charts, Pareto analysis, inspection plans, and defect tracking. Produces a Quality Control Dashboard.','Lean waste elimination, value stream mapping, and PDCA applied to project delivery. Produces a Process Improvement Plan.','Using AI to predict defect-prone areas, perform root cause analysis, and automate quality reporting. Produces an AI Quality Intelligence Report.']);

SELECT pg_temp.seed_pm_module(11, 'Agile Project Management',
  'Agile for PMs: the PM role in Scrum, Kanban flow management, scaled Agile frameworks, hybrid delivery, and AI tools that supercharge sprint intelligence and velocity prediction.',
  85,
  ARRAY['Scrum for Project Managers','Kanban & Flow-Based Delivery for PMs','Scaled Agile (SAFe & LeSS) for PMs','Hybrid Agile-Waterfall Delivery','AI in Agile: Sprint Intelligence & Velocity Prediction'],
  ARRAY['The PM role in Scrum: product owner relationship, sprint facilitation, impediment removal, and reporting upward. Produces a PM Scrum Playbook.','Kanban board design, WIP limits, cycle time analysis, and flow optimization for project teams. Produces a Kanban Board Setup Guide.','Program Increment planning, ART coordination, and the PM role in enterprise Agile programs. Produces a SAFe PM Navigation Guide.','When and how to combine Agile sprints with waterfall milestones, stage gates, and governance requirements. Produces a Hybrid Delivery Framework.','AI tools for sprint planning, velocity prediction, backlog prioritization, and Agile retrospective analysis. Produces an AI Agile Toolkit.']);

SELECT pg_temp.seed_pm_module(12, 'Change Management & Organizational Transformation',
  'Leading the human side of projects: Kotter and ADKAR frameworks, resistance analysis, communication campaigns, adoption measurement, and AI-assisted change impact planning.',
  85,
  ARRAY['Change Management Frameworks: Kotter & ADKAR','Resistance Analysis & Stakeholder Buy-In','Change Communication Strategy & Campaign Design','Measuring Change Adoption & Sustaining Momentum','AI-Assisted Change Impact Assessment & Planning'],
  ARRAY['Kotter 8 steps and ADKAR applied to project change: when to use each and how to integrate them with your project plan. Produces a Change Management Plan.','Why people resist, how to diagnose the root cause, and the engagement strategies that overcome each resistance pattern. Produces a Resistance Analysis.','Communication campaigns, messages by audience segment, change champions, and feedback loops. Produces a Change Communication Plan.','Adoption metrics, reinforcement mechanisms, and the 90-day post-go-live plan. Produces a Sustainability Plan.','Using AI to assess change impact, generate communication drafts, and identify at-risk stakeholder groups. Produces an AI Change Impact Report.']);

SELECT pg_temp.seed_pm_module(13, 'Portfolio & Program Management',
  'Rising above single projects: portfolio scoring and prioritization, program governance and benefits management, resource portfolio optimization, strategic alignment via OKRs, and AI-powered investment analytics.',
  85,
  ARRAY['Portfolio Management: Selection, Prioritization & Balance','Program Management: Governance, Benefits & Interdependencies','Resource Portfolio Optimization','Strategic Alignment: OKRs, Strategy Maps & Benefits Realization','AI for Portfolio Analytics & Investment Decisions'],
  ARRAY['Portfolio scoring models, strategic alignment assessment, and the governance process for portfolio decisions. Produces a Portfolio Scoring Framework.','Program governance structure, benefits map, interdependency register, and program-level risk management. Produces a Program Governance Charter.','Resource pooling, capacity planning, and resolving cross-project resource conflicts at the portfolio level. Produces a Resource Capacity Model.','Connecting project outcomes to organizational OKRs and strategy maps: benefits mapping and realization tracking. Produces a Benefits Realization Plan.','Using AI to analyze portfolio data, surface investment insights, and model resource scenarios. Produces an AI Portfolio Intelligence Report.']);

SELECT pg_temp.seed_pm_module(14, 'Digital & Technology Project Leadership',
  'Leading the toughest project type: technology transformation, cloud migration, software delivery with DevOps, data and AI implementation, and compliance-driven projects in regulated environments.',
  85,
  ARRAY['Leading Technology Transformation Projects','Cloud Migration & Infrastructure Project Management','Software Delivery & DevOps PM','Data & AI Implementation Project Leadership','Cybersecurity & Compliance Project Management'],
  ARRAY['The unique challenges of technology projects: changing requirements, vendor dependencies, integration complexity, and technical debt. Produces a Tech PM Risk Framework.','Cloud migration methodology (6 Rs), infrastructure sequencing, go-live planning, and hypercare. Produces a Cloud Migration PM Playbook.','Release trains, CI/CD pipelines, DevOps culture, and how a PM adds value in a software delivery team. Produces a Software Delivery PM Guide.','Data migration projects, AI model deployment, MLOps coordination, and the PM role in data governance. Produces a Data/AI PM Playbook.','Compliance-driven projects (GDPR, SOC2, HIPAA): requirements, controls, audit evidence, and testing. Produces a Compliance PM Checklist.']);

SELECT pg_temp.seed_pm_module(15, 'Data-Driven PM & Analytics',
  'Turning project data into decisions: PM dashboard design, flow and velocity metrics, predictive trend analysis, structured decision intelligence, and AI-powered real-time project monitoring.',
  85,
  ARRAY['PM Dashboard Design & KPI Selection','Burndown, Velocity, Throughput & Flow Metrics','Predictive Analytics & Trend Analysis for PMs','Decision Intelligence: Data-Driven PM Decisions','AI-Powered PM Analytics & Real-Time Project Intelligence'],
  ARRAY['Designing PM dashboards that drive decisions: which KPIs matter, what visualizations communicate, and how to avoid vanity metrics. Produces a PM Dashboard Template.','Leading indicators vs. lagging indicators: burndown, velocity, cycle time, throughput, and cumulative flow. Produces a Metrics Selection Guide.','Trend analysis, regression to the mean, and leading vs. lagging indicators: how to forecast before the schedule slips. Produces a Trend Analysis Framework.','Decision trees, expected value, and structured decision-making under uncertainty. Produces a Decision Intelligence Playbook.','AI tools for real-time project monitoring: anomaly detection, cost prediction, and risk signals from project data. Produces an AI PM Analytics Setup Guide.']);

SELECT pg_temp.seed_pm_module(16, 'Executive Communication & Strategic Leadership',
  'The leap from PM to strategic leader: C-suite communication, political intelligence, influencing without authority, crisis and recovery management, and building PM executive presence.',
  85,
  ARRAY['C-Suite Communication & Board Reporting','Political Intelligence & Organizational Navigation','Influencing Without Authority','Crisis Communication & Project Recovery','Building Your PM Executive Presence & Thought Leadership'],
  ARRAY['What C-suite executives want in a project update: the one-page status brief, decision requests, and the 3-minute verbal update. Produces an Executive Communication Framework.','Organizational politics is reality. Mapping influence networks, building allies, and navigating competing agendas. Produces a Political Navigation Map.','Persuasion science, coalition building, and getting cross-functional commitment without line authority. Produces an Influence Playbook.','Project in crisis: triage, communication, recovery planning, and rebuilding stakeholder confidence. Produces a Project Recovery Framework.','Thought leadership, LinkedIn strategy, conference speaking, and building the PM brand that opens doors. Produces a PM Personal Brand Plan.']);

SELECT pg_temp.seed_pm_module(17, 'Ethics, Governance & AI Responsibility',
  'The PM''s governance and ethics obligations: project governance frameworks, ethical AI in delivery, regulatory compliance, ESG integration, and AI governance policies for project teams.',
  80,
  ARRAY['Project Governance Frameworks & Accountability Structures','Ethical AI in Project Delivery','Regulatory Compliance & Risk in Projects','Sustainability & ESG Integration in Project Management','AI Governance for Project Managers'],
  ARRAY['Governance models (PMO, steering committee, sponsor), decision rights, and accountability structures that keep projects on track. Produces a Project Governance Framework.','Bias in AI-assisted decisions, transparency in AI-generated plans, and the PM responsibility when AI makes a recommendation. Produces an Ethical AI PM Checklist.','Managing compliance requirements (GDPR, SOC2, FDA, HIPAA) as project constraints: requirements, controls, and evidence. Produces a Compliance Risk Register.','ESG criteria in project selection, carbon-aware scheduling, and sustainability reporting for projects. Produces a Project Sustainability Assessment.','AI governance policies for project teams: acceptable use, output validation, data privacy, and escalation. Produces an AI Governance Policy Template.']);

SELECT pg_temp.seed_pm_module(18, 'PM Career Acceleration & PMP Certification',
  'Turning PM mastery into career outcomes: PMP certification roadmap, portfolio building, LinkedIn optimization, salary negotiation, and future-proofing in the AI era.',
  80,
  ARRAY['PMP, CAPM & PRINCE2 Certification Roadmap','Building a PM Portfolio That Wins Interviews','PM Personal Brand & LinkedIn Optimization','Salary Negotiation & PM Career Path Decisions','The AI-Era PM — Future-Proofing Your Career'],
  ARRAY['PMP experience requirements (36 months), exam structure (180 questions), application process, and study strategy. Produces a PMP Certification Action Plan.','What to include in a PM portfolio: charters, schedules, risk registers, EVM reports, case studies with quantified outcomes. Produces a Portfolio Framework.','LinkedIn headline, experience accomplishments, skills, and thought leadership strategy for PM visibility. Produces a LinkedIn Optimization Checklist.','PM salary benchmarks by level, region, and certification. Negotiation scripts, offer evaluation, and career path decisions. Produces a Negotiation Playbook.','AI tools redefining PM: Copilot for scheduling, Claude for risk analysis, Jira AI for planning. The 12-month acceleration plan. Produces a Future-Ready PM Plan.']);

DROP FUNCTION pg_temp.seed_pm_module(int, text, text, int, text[], text[]);

-- =============================================================================
-- VERIFICATION — Expected: 18 chapters, 5 lessons each (90 total), 18 quizzes
-- =============================================================================
SELECT
  c.order_index                                                        AS module,
  c.title                                                              AS chapter_title,
  COUNT(DISTINCT v.id)                                                 AS lessons,
  COUNT(DISTINCT q.id) FILTER (WHERE q.quiz_type = 'chapter_end')     AS quiz_shells
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.videos v ON v.chapter_id = c.id
LEFT JOIN public.quizzes q ON q.chapter_id = c.id
WHERE co.title = 'AI Project Manager & Delivery Leader'
  AND co.curriculum_version = 'pm-v1'
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
