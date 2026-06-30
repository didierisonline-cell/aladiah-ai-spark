-- =============================================================================
-- PM Lesson Content — Modules 10–18 (45 lessons)
-- Course: AI Project Manager & Delivery Leader (pm-v1)
-- Apply AFTER: 20260630000000_seed_pm_structure.sql
-- =============================================================================

DO $$
DECLARE
  v_pm_id UUID;
  v_ch    UUID;
BEGIN
  SELECT id INTO v_pm_id FROM public.courses
    WHERE title = 'AI Project Manager & Delivery Leader'
      AND curriculum_version = 'pm-v1';
  IF v_pm_id IS NULL THEN RAISE EXCEPTION 'PM course not found'; END IF;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 10 — Quality Management  (OFFSET 9, order_index = 10)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 9;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M10 chapter not found'; END IF;

  -- Lesson 1: Quality Planning & Quality Management Plan
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Quality Planning & Quality Management Plan',
      'description', 'Cost of quality, quality standards selection, and building a Quality Management Plan that stakeholders trust. Produces a Quality Management Plan.',
      'transcript', 'QUALITY PLANNING & QUALITY MANAGEMENT PLAN

Quality does not happen by accident on projects. It happens because someone planned for it explicitly, defined what it means in concrete terms, and built the mechanisms to deliver it. That person is you, the project manager.

THE COST OF QUALITY FRAMEWORK

Every quality decision is a financial decision. The Cost of Quality (COQ) framework makes this visible. COQ = Cost of Conformance + Cost of Non-Conformance.

Cost of Conformance is what you spend to prevent defects and appraise quality: training, process documentation, peer reviews, test automation, inspections. These are investments.

Cost of Non-Conformance is what you pay when quality fails: rework, warranty claims, customer compensation, reputational damage, legal liability. These are losses.

A useful rule of thumb from research by Capers Jones: defects fixed in production cost 10–100× more than defects caught in requirements or design. Your quality plan should front-load prevention spending precisely because it saves far more downstream.

Target COQ allocation for most software projects: 70–80% on prevention and appraisal, 20–30% on failure costs. If your project is spending 60% on rework, quality planning has failed.

SELECTING QUALITY STANDARDS

Your Quality Management Plan must specify which standards apply. Common choices:

ISO 9001 defines quality management system requirements — useful when your customer or regulator requires certification. It emphasizes documented processes, customer focus, continual improvement, and leadership commitment.

The PMBOK quality framework organizes quality around three processes: plan quality management, perform quality assurance, and control quality. These map directly to your planning, execution, and monitoring phases.

Six Sigma DMAIC (Define, Measure, Analyze, Improve, Control) is appropriate when you are managing a process with measurable outputs and a defect reduction objective. On a software project, DMAIC might be applied to the defect injection and removal process.

Choose the standard that fits your project context and customer requirements. Do not impose ISO 9001 rigor on a three-week internal tool build.

BUILDING THE QUALITY MANAGEMENT PLAN

Your Quality Management Plan has six core sections.

Quality objectives: specific, measurable targets. For a software project: defect density <2 defects per 1,000 lines of code; test coverage >80%; zero P1 defects at release; customer satisfaction score ≥4.2/5.0.

Roles and responsibilities: who is responsible for quality? Assign a Quality Lead, define the PM''s oversight role, specify developer responsibilities (unit test coverage), and QA team scope.

Quality tools: list the specific tools you will use. Control charts for process stability monitoring. Pareto analysis for defect root cause prioritization. Peer code review as a prevention tool. Automated regression test suite as an appraisal tool.

QA processes: how will you build quality into the process? Sprint Definition of Done requirements, mandatory code review gates, security scanning in CI/CD pipeline, architectural review checkpoints at design phase.

QC processes: how will you inspect quality outputs? Test planning, test execution, defect tracking, defect triage cadence, user acceptance testing protocol.

Quality metrics and reporting: how often will quality metrics be reported, to whom, and in what format? Weekly defect density trend to development team. Monthly quality dashboard to steering committee.

PRACTICAL ADVICE

The most common Quality Management Plan failure is that it gets written once and never used. Build it with the team, not for the team. Walk the team through the quality objectives and get genuine commitment. Review it at each phase gate and update it when context changes.

DELIVERABLE: Quality Management Plan
Produce a Quality Management Plan for your current project using the six-section structure above. Define at least three measurable quality objectives with current baseline values and targets. Identify the quality tools you will use and assign a Quality Lead.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Quality Assurance: Process Audits & Standards
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Quality Assurance: Process Audits & Standards',
      'description', 'Process audits, compliance checks, and quality gates: how to build quality into the process rather than inspect it in. Produces a QA Checklist.',
      'transcript', 'QUALITY ASSURANCE: PROCESS AUDITS & STANDARDS

There is a critical distinction that separates mature project teams from reactive ones: Quality Assurance is about the process. Quality Control is about the product. This lesson is about QA — building quality into how work gets done rather than inspecting it in at the end.

QA VS QC: THE FUNDAMENTAL DISTINCTION

Quality Assurance (QA) is prevention-oriented. It asks: "Are we following the right processes to produce quality outputs?" QA activities include process audits, standards compliance checks, quality gates, and training.

Quality Control (QC) is detection-oriented. It asks: "Does this specific output meet quality requirements?" QC activities include inspection, testing, defect measurement, and statistical sampling.

Deming''s insight — "you cannot inspect quality into a product" — is the founding principle of QA. If your development process has no code review requirement, no Definition of Done, and no automated testing, no amount of QC inspection at the end will make the software reliable. You must fix the process.

PROCESS AUDIT METHODOLOGY

A process audit evaluates whether the project team is following the defined processes and whether those processes are effective. You conduct process audits on a defined schedule — monthly is typical for most projects.

The audit process has four steps.

First, define the audit scope: which processes are you auditing? Change management process, defect tracking process, code review process, documentation standards.

Second, gather evidence: review process documentation, interview team members, observe process execution, examine artifacts produced by the process (code review records, test reports, change logs).

Third, identify findings: categorize each finding as conformance (process followed correctly), non-conformance (process not followed), or opportunity for improvement (process followed but could be better).

Fourth, produce the audit report: findings by category, root cause for non-conformances, recommended corrective actions, timeline for remediation, follow-up audit date.

QUALITY GATES

Quality gates are formal checkpoints where a project must demonstrate it has met defined quality criteria before proceeding. They are binary: the project either passes or does not.

Common quality gate criteria for software projects:
- Phase gate into build: requirements sign-off, architecture review complete, security design review passed
- Sprint Definition of Done: code review approved, unit test coverage ≥80%, no P1 open bugs, static analysis scan passed, documentation updated
- Release gate: regression test suite passed, performance benchmarks met, penetration test cleared, user acceptance testing signed off

The sprint DoD quality gate example is worth examining in detail. If every sprint requires code review sign-off, unit test coverage ≥80%, zero P1 bugs, and security scan passed before a story can be called Done, you have built a quality gate directly into the development cadence. Teams that operate without a DoD ship technical debt and undiscovered defects continuously.

COMPLIANCE CHECKS

Compliance checks verify that project deliverables meet regulatory, contractual, or organizational standards. These are non-negotiable quality requirements.

For a healthcare IT project, compliance checks verify HIPAA technical safeguards are implemented. For a financial services project, checks verify SOX controls are in place. For any project under ISO 9001, checks verify documented process conformance.

Integrate compliance checks into your quality gate criteria so they are not a last-minute scramble before delivery.

DELIVERABLE: QA Checklist
Build a QA Checklist for your project covering: (1) process audit schedule and scope; (2) sprint Definition of Done criteria; (3) phase gate quality criteria; (4) compliance check requirements. The checklist should be specific enough that any team member could execute it independently.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Quality Control: Inspection, Testing & Metrics
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Quality Control: Inspection, Testing & Metrics',
      'description', 'Control charts, Pareto analysis, inspection plans, and defect tracking. Produces a Quality Control Dashboard.',
      'transcript', 'QUALITY CONTROL: INSPECTION, TESTING & METRICS

Quality Control is where you measure the actual quality of project outputs. You inspect, test, measure, and decide whether deliverables meet requirements. Done well, QC catches defects before they reach the customer and gives you the data to improve your processes.

THE 7 BASIC QUALITY TOOLS

The seven basic quality tools, codified by Kaoru Ishikawa, remain the backbone of QC practice:

Control Chart: tracks a process metric over time with statistically calculated Upper Control Limit (UCL = mean + 3σ) and Lower Control Limit (LCL = mean − 3σ). Points outside control limits signal a special cause — something has changed. For project work, you might control chart daily defect injection rate or build failure rate.

Pareto Chart: a bar chart ranking defect categories by frequency, with a cumulative percentage line. The 80/20 rule typically holds: 20% of defect types account for 80% of defects. A Pareto analysis showing that 3 defect types account for 78% of all reported bugs tells you exactly where to focus your prevention and process improvement effort.

Fishbone Diagram (Ishikawa/Cause-and-Effect): used for root cause analysis. The "head" of the fish is the problem; the "bones" are the major cause categories (for software: People, Process, Tools, Environment, Requirements, Design). Teams brainstorm causes in each category to find root causes.

Histogram: frequency distribution of a quality metric. A histogram of defect fix time shows whether fix times are normally distributed, skewed, or bimodal — each pattern has different management implications.

Scatter Diagram: plots two variables to reveal correlation. Example: plot code complexity (cyclomatic complexity) on the x-axis vs. defect count on the y-axis. If correlation exists, high-complexity modules should get extra QC attention.

Run Chart: plots a metric over time without control limits. Simpler than a control chart but useful for spotting trends. Three consecutive data points moving in the same direction warrants investigation.

Check Sheet: structured form for collecting defect data in real time. Define defect categories in advance; mark each occurrence as it is observed. Simple, fast, and produces data for Pareto analysis.

CONTROL CHART INTERPRETATION

A process is in statistical control when all data points fall within UCL and LCL and show no non-random patterns. Key signals to investigate:

- Any point outside UCL or LCL: special cause, investigate immediately
- Seven consecutive points on one side of the center line: process shift
- Six consecutive points trending in one direction: systematic drift
- Any obviously non-random pattern: the process is being driven by something

INSPECTION AND SAMPLING

For large-volume inspection (e.g., 10,000 units of a manufactured component), 100% inspection is impractical. Acceptance sampling uses a statistical plan to inspect a random sample and infer population quality.

The Acceptable Quality Level (AQL) defines the maximum defect rate you will accept in a lot. Common AQL values range from 0.65% (critical components) to 4.0% (minor defects). AQL tables (ISO 2859) specify sample size and acceptance/rejection criteria.

DEFECT TRACKING METRICS

Track four metrics to characterize your defect management process:

Defect Density: defects per 1,000 lines of code or per function point. Industry benchmark for well-managed software: <2 defects/KLOC post-release.
Defect Escape Rate: percentage of defects that reach the customer vs. total defects found. Target <5%.
Defect Removal Efficiency (DRE): defects removed before release ÷ total defects × 100%. Target >95%.
Mean Time to Repair (MTTR): average time from defect discovery to defect closure. Tracks QC throughput.

DELIVERABLE: Quality Control Dashboard
Build a Quality Control Dashboard for your project. Include: control chart for your primary quality metric; Pareto chart of defect types from the last sprint or phase; defect density, escape rate, and DRE metrics; trend for each metric over the last four reporting periods. Add a three-sentence interpretation of what the data tells you about quality trajectory.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Process Improvement: Lean PM & Continuous Improvement
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Process Improvement: Lean PM & Continuous Improvement',
      'description', 'Lean waste elimination, value stream mapping, and PDCA applied to project delivery. Produces a Process Improvement Plan.',
      'transcript', 'PROCESS IMPROVEMENT: LEAN PM & CONTINUOUS IMPROVEMENT

Lean thinking originated in Toyota''s manufacturing system and has since transformed software delivery, healthcare, and professional services. At its core, Lean offers a disciplined method for identifying and eliminating waste — any activity that consumes resources without adding value for the customer. As a PM, Lean gives you a framework to continuously improve how your team delivers.

THE 8 LEAN WASTES (TIMWOODS)

The eight categories of Lean waste, using the TIMWOODS mnemonic:

Transport: unnecessary movement of information, documents, or work items between people or systems. Example: a change request that requires email → Jira → SharePoint → email again before anyone acts on it.

Inventory: work-in-progress piled up waiting to be processed. Example: 40 stories in the backlog that have been refined but not prioritized, occupying cognitive overhead and becoming stale.

Motion: unnecessary movement by people to get information or tools they need. Example: developers context-switching between five different tools to complete one task.

Waiting: idle time when work cannot proceed because of a dependency, approval, or resource constraint. Example: a deployment waiting three days for an infrastructure change request to be approved.

Overproduction: producing more than the customer needs, sooner than it is needed. Example: building a reporting module with 15 chart types when the customer uses 3.

Over-processing: applying more effort, precision, or complexity than the customer values. Example: a 50-slide project status report delivered to a stakeholder who wants a one-page summary.

Defects: errors that require rework. The most expensive waste because defects compound — each defect found late costs dramatically more to fix than one caught early.

Skills (unused talent): failing to leverage the full capability of your team. Example: a senior engineer spending two hours per day in status meetings instead of solving hard technical problems.

VALUE STREAM MAPPING

Value Stream Mapping (VSM) is the Lean tool for making waste visible. It maps the entire flow of work from customer request to customer value delivery — showing both value-added time and non-value-added (waste) time at each step.

The VSM process has four steps.

First, map the current state: document every step in the process, who performs it, how long it takes (cycle time), and how long work waits between steps (wait time). Include the value-added time for each step (the actual work) vs. total elapsed time.

Second, calculate total lead time vs. value-added time. Lead time is the total elapsed time from request to delivery. Value-added time is the sum of actual work time only.

Consider this change request process example: Request submitted (1 hour) → waiting for PM review (2 days) → PM review (30 minutes) → waiting for approval (5 days) → approval (15 minutes) → waiting for implementation slot (3 days) → implementation (4 hours). Total lead time: 12 days. Value-added time: approximately 6 hours. Efficiency: 6%. The other 94% is waste — primarily waiting.

Third, design the future state: eliminate or reduce each identified waste. Can approvals be automated for low-risk changes? Can implementation slots be allocated in advance? Can PM review and approval happen in the same meeting?

Fourth, build the improvement plan: specific actions, owners, timelines, and target metrics.

THE PDCA CYCLE

Plan-Do-Check-Act (PDCA), developed by Deming, is the engine for continuous improvement. Plan: identify the problem and design a solution. Do: implement the solution on a small scale. Check: measure the results against the plan. Act: if successful, standardize; if not, adjust and repeat.

Apply PDCA to any process improvement identified through your value stream mapping. Each retrospective generates improvement items — run them through PDCA cycles.

DELIVERABLE: Process Improvement Plan
Map the value stream for one key project process (change requests, defect triage, deployment, or meeting cadence). Calculate current lead time, value-added time, and efficiency percentage. Identify the top three waste categories. Design the future state process. Write a PDCA improvement plan for the highest-priority waste with owner, timeline, and success metric.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: AI for Quality: Defect Prediction & Root Cause Analysis
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI for Quality: Defect Prediction & Root Cause Analysis',
      'description', 'Using AI to predict defect-prone areas, perform root cause analysis, and automate quality reporting. Produces an AI Quality Intelligence Report.',
      'transcript', 'AI FOR QUALITY: DEFECT PREDICTION & ROOT CAUSE ANALYSIS

AI is transforming quality management from reactive to predictive. Instead of discovering defects after they are written, AI models can identify the modules most likely to contain defects before QC testing even begins. This lesson covers how to deploy AI for quality intelligence on your projects.

AI DEFECT PREDICTION

Defect prediction models use machine learning trained on historical project data to predict where defects are most likely to occur in the current codebase. The key input features:

Code complexity metrics: cyclomatic complexity (number of independent paths through a function), lines of code, depth of inheritance, coupling between objects. Research consistently shows that high-complexity code contains disproportionately more defects.

Code churn: how frequently has this module been changed? Modules that are changed frequently have higher defect density — frequent change is a proxy for ongoing turbulence and incomplete design.

Historical defect density: past defect concentration in a module predicts future defect concentration.

Developer experience: code written by developers new to a module or a technology has statistically higher defect rates.

A practical example: an ML model trained on 18 months of defect history identifies three modules with predicted defect probability >70% based on their cyclomatic complexity scores (all >25) and high recent code churn. The QC plan allocates 40% of test execution effort to those three modules, which together comprise only 12% of the codebase. Result: 63% of defects found in the targeted modules — the model''s prediction was validated.

Tools for defect prediction: SonarQube provides code quality and complexity metrics; its AI features surface hotspot predictions. Microsoft''s CodeBERT-based models can be integrated into CI/CD pipelines for automated risk scoring.

AI FOR ROOT CAUSE ANALYSIS

Traditional root cause analysis requires time-consuming manual review of defect records, meeting transcripts, and logs. AI accelerates this through two techniques.

NLP clustering of defect descriptions: large language models can cluster defect reports by semantic similarity, identifying patterns that manual review misses. A QC team with 300 open defects might spend three hours manually categorizing them; an NLP pipeline can cluster them in minutes. The clusters then drive Pareto-style prioritization.

Log analysis and anomaly detection: AI models trained on normal system behavior can detect anomalies in application logs that correlate with defect conditions — identifying root causes faster than manual log triage.

AUTOMATED QUALITY REPORTING

AI can generate quality status reports from structured data (defect counts, test results, code metrics) automatically. This reduces PM time on report preparation and ensures consistent, timely reporting.

Set up an automated quality pipeline: collect data from your defect tracker (Jira), code analysis tool (SonarQube), and test management system (Xray, Zephyr) → aggregate in a data warehouse → generate AI narrative summary + visual dashboard → distribute on schedule.

Claude and GPT-4 can generate plain-English quality narratives from structured data: "This week''s defect injection rate of 2.4/KLOC is 20% above the project baseline of 2.0/KLOC. The primary driver is 14 defects in the authentication module, consistent with the high cyclomatic complexity flagged in last month''s code analysis. Recommended action: targeted code review session for authentication module."

AI-ASSISTED FMEA

Failure Mode and Effects Analysis (FMEA) systematically identifies potential failure modes, their effects, and their causes. AI can accelerate FMEA by suggesting failure modes based on similar projects in its training data and scoring Risk Priority Numbers (RPN = Severity × Occurrence × Detection) automatically.

DELIVERABLE: AI Quality Intelligence Report
Configure SonarQube or a similar tool on your project codebase and export the top 10 complexity hotspots. Use a LLM to cluster your last 20 defect descriptions by theme. Generate an automated quality narrative summarizing defect trends, hotspot risk, and recommended QC focus areas. Document your AI quality workflow so it can be repeated each sprint.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 11 — Agile Project Management  (OFFSET 10, order_index = 11)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 10;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M11 chapter not found'; END IF;

  -- Lesson 1: Scrum for Project Managers
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scrum for Project Managers',
      'description', 'The PM role in Scrum: product owner relationship, sprint facilitation, impediment removal, and reporting upward. Produces a PM Scrum Playbook.',
      'transcript', 'SCRUM FOR PROJECT MANAGERS

Scrum does not eliminate the need for project management — it changes what project management looks like. If your organization has adopted Scrum, your role shifts from command-and-control task assignment to organizational interface, impediment clearing, and upward reporting. This lesson defines that role precisely.

THE PM-PO-SM TRIANGLE

In a Scrum team you will encounter three formal roles. The Product Owner (PO) owns the product backlog — priorities, requirements, acceptance criteria, and the "what." The Scrum Master (SM) owns the process — ceremonies, team health, Scrum practices, and the "how." The Development Team owns the technical execution.

Where does the PM fit? The PM is not the Scrum Master and should not be — those are distinct roles. The PM''s value in a Scrum context is the organizational layer above the team: securing budget, managing stakeholder expectations, removing cross-organizational impediments that the Scrum Master cannot resolve, and translating sprint-level progress into business-level reporting.

Think of it as the PM-PO-SM triangle: PO handles business priorities; SM handles team process; PM handles organizational context and external dependencies.

THE SPRINT CADENCE AND PM TOUCHPOINTS

A standard 2-week sprint has four ceremonies. Sprint Planning (Day 1): team selects stories from backlog and commits to a sprint goal. PM may attend to provide context on priorities or constraints. Daily Standup (daily, 15 minutes): team coordinates on blockers. PM typically does not attend but reviews impediment log daily. Sprint Review (last day of sprint): team demonstrates completed work to stakeholders. PM attends and facilitates stakeholder engagement. Retrospective (last day of sprint): team reflects on process. PM attends to hear team health signals.

IMPEDIMENT MANAGEMENT

The impediment log is one of the PM''s most important Scrum tools. Any blocker that the Scrum Master cannot clear within 24 hours escalates to the PM.

Typical PM-level impediments: cross-team dependency that requires negotiation with another PM; vendor delay that requires contract escalation; infrastructure access that requires IT management approval; resource conflict that requires portfolio-level resolution.

Track each impediment with: description, date raised, owner, target resolution date, current status. Review the impediment log daily and provide status updates to the Scrum Master.

UPWARD REPORTING IN SCRUM

Scrum produces a rich set of metrics that you translate for stakeholders who do not speak "story points."

Velocity: the team completed 34 story points last sprint. Average over 6 sprints: 32 points. This is meaningful to the team and to you, but not to the CFO. Translation: "The team is delivering at a consistent pace that keeps us on track for the Q3 release date."

Release forecast: 8 sprints remaining × 32 points average velocity = 256 points of remaining capacity. Remaining backlog: 290 story points. Recommendation: descope 34 points of lower-priority features to protect the Q3 date with confidence.

Sprint burndown: shows daily progress within the sprint. Useful for weekly stakeholder updates — a healthy burndown trending toward zero signals the sprint is on track.

RAG status: synthesize velocity, impediments, and sprint goal achievement into a single RAG status with a two-sentence explanation for the weekly executive report.

DELIVERABLE: PM Scrum Playbook
Write a PM Scrum Playbook for your project covering: your role definition vs. PO and SM; impediment log template and escalation protocol; sprint ceremony attendance and PM contribution; upward reporting template translating sprint metrics into executive language; release forecast calculation method.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Kanban & Flow-Based Delivery for PMs
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Kanban & Flow-Based Delivery for PMs',
      'description', 'Kanban board design, WIP limits, cycle time analysis, and flow optimization for project teams. Produces a Kanban Board Setup Guide.',
      'transcript', 'KANBAN & FLOW-BASED DELIVERY FOR PMs

Kanban is not just a board on a wall. It is a complete delivery management system built on one insight: limiting the amount of work in progress increases the rate at which work gets done. Understanding Kanban''s mechanics gives you a powerful tool for teams working on continuous-flow delivery rather than fixed-sprint cadences.

THE SIX CORE KANBAN PRACTICES

David Anderson''s Kanban method defines six core practices.

Visualize work: make all work visible on the board. Every work item — from "In Progress" to "Blocked" to "In Review" — is visible to the entire team. Hidden work is unmanaged work.

Limit Work in Progress (WIP): set explicit limits on how many items can be in each column simultaneously. WIP limits force the team to finish work before starting new work. "Stop starting, start finishing."

Manage flow: optimize the flow of work through the system. Track how smoothly items progress from commitment to delivery.

Make policies explicit: document the rules for how work moves between columns. What does "In Review" mean? Who can pull from the backlog? What is the Definition of Done for this board? Explicit policies eliminate ambiguous handoffs.

Implement feedback loops: regular cadences to review flow metrics, service delivery, and process health. Daily standups, weekly flow reviews, monthly retrospectives.

Improve collaboratively: use data — cycle time, throughput, CFD — to drive process improvements. Changes are made based on evidence, not opinion.

WIP LIMITS AND LITTLE''S LAW

Little''s Law is the mathematical foundation of Kanban: Throughput = WIP ÷ Cycle Time. Rearranging: Cycle Time = WIP ÷ Throughput. This means that if you hold throughput constant and reduce WIP, cycle time decreases proportionally.

Practical implication: a team with 12 items in progress and a throughput of 6 items/week has an average cycle time of 2 weeks. If they reduce WIP to 6 items (by limiting simultaneous work), cycle time drops to 1 week — without the team working any faster.

Setting WIP limits: a common starting rule is WIP limit = number of team members × 1.5 for the "In Progress" column. Adjust based on observed flow. If the column frequently hits its limit and people are idle, the limit is too low. If the column rarely approaches the limit, it is too high.

CYCLE TIME AND SLA PERCENTILES

Cycle time is the time from when a work item is actively started to when it is delivered. Measure it for every item over a rolling 30-day window.

Use percentile-based commitments rather than average cycle time. If your 85th percentile cycle time is 11 days, you can commit to stakeholders: "85% of requests will be delivered within 11 days." This is far more reliable than promising the average, because the average is pulled upward by occasional outliers.

The 50th percentile (median) tells you typical performance. The 85th or 95th percentile tells you what you can promise with high confidence.

CUMULATIVE FLOW DIAGRAMS

The Cumulative Flow Diagram (CFD) is Kanban''s most powerful analytical tool. It stacks the number of items in each workflow state over time. A healthy CFD shows bands of roughly equal and consistent width — steady flow.

Warning signals: an expanding band in one column signals a bottleneck — work is accumulating there faster than it is leaving. Example: the "In Review" band widening over 2 weeks tells you code review is a bottleneck. Intervention: add code review capacity, set a code review SLA of 24 hours, or reduce WIP limit upstream.

DELIVERABLE: Kanban Board Setup Guide
Design a Kanban board for your team. Define: columns and their explicit entry/exit policies; WIP limit for each column with rationale; how cycle time will be measured and reported; 85th percentile cycle time SLA commitment; CFD review cadence and what signals will trigger a flow intervention.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Scaled Agile (SAFe & LeSS) for PMs
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scaled Agile (SAFe & LeSS) for PMs',
      'description', 'Program Increment planning, ART coordination, and the PM role in enterprise Agile programs. Produces a SAFe PM Navigation Guide.',
      'transcript', 'SCALED AGILE (SAFe & LeSS) FOR PMs

When Agile scales beyond a single team, the coordination challenges multiply rapidly. Two teams must align on shared APIs. Three teams must coordinate on a shared platform. Five teams must plan a synchronized release. SAFe (Scaled Agile Framework) and LeSS (Large-Scale Scrum) are the two most widely adopted frameworks for managing this complexity. As a PM in an enterprise Agile program, you need to navigate either framework fluently.

SAFe STRUCTURE

SAFe organizes work across four levels.

Team Level: individual Scrum or Kanban teams running 2-week iterations. Each team has a Product Owner and Scrum Master. This is where code is written and tested.

Program Level: the Agile Release Train (ART) — a group of 50–125 people organized around a shared mission, delivering a continuous flow of value in Program Increments (PIs). The ART has a Release Train Engineer (RTE) as its chief Scrum Master, Business Owners, and System Architects.

Large Solution Level: for programs requiring multiple ARTs to coordinate. A Solution Train Engineer (STE) manages cross-ART coordination.

Portfolio Level: strategy and investment funding. Epics are defined and funded here. This is where business strategy translates into program work.

PI PLANNING

Program Increment (PI) Planning is the cornerstone of SAFe — a 2-day, face-to-face (or virtual) event where all teams on an ART plan the next 8–12 weeks together. It is the most important event you will participate in as a PM in a SAFe program.

Day 1: Business context presentation by Business Owners and executives. Product Management presents the program vision and top features for the PI. Teams break out to review their backlogs and draft PI objectives.

Day 2: Teams present draft PI objectives. Dependencies are identified and mapped on the Program Board — a physical or virtual board showing features, team assignments, dependencies (as red arrows between teams), and milestones. Risks are identified and classified using ROAM: Resolved (addressed), Owned (assigned to an owner), Accepted (acknowledged risk with no mitigation), Mitigated (risk reduced).

The output of PI Planning: PI objectives for each team (committed and stretch), a Program Board showing dependencies and milestones, and a ROAM log for program risks.

YOUR ROLE IN SAFe AS PM

In SAFe, the PM title is often held at the program level — responsible for defining program-level features in collaboration with Product Management. Your work: translate business requirements into features with clear acceptance criteria; prioritize the Program Backlog with Product Management; participate in PI Planning as a Business Owner or Product Management representative; track feature delivery during the PI; and communicate program progress to executive stakeholders.

If your organization uses a traditional PM title alongside SAFe, your primary interfaces are the RTE (operational coordination), the Product Manager (feature prioritization), and the ART''s Business Owners (strategic alignment).

LeSS AS AN ALTERNATIVE

LeSS takes a simpler approach: one Product Backlog, one Product Owner, and multiple Scrum teams pulling from it. No separate program layer. LeSS works best for 2–8 teams working on a single product. Above that scale, LeSS Huge adds an Area Product Owner layer.

Key LeSS coordination mechanisms: multi-team Sprint Planning (teams coordinate which team takes which backlog items), Overall Retrospective (all teams together), and Communities of Practice (cross-team learning).

DELIVERABLE: SAFe PM Navigation Guide
Map your organization''s Agile scaling structure (SAFe, LeSS, or other). Define your PM role within that structure. Document the PI Planning process, Program Board structure, and ROAM risk classification method. Identify the top 3 cross-team dependencies currently on your program and their management approach.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Hybrid Agile-Waterfall Delivery
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Hybrid Agile-Waterfall Delivery',
      'description', 'When and how to combine Agile sprints with waterfall milestones, stage gates, and governance requirements. Produces a Hybrid Delivery Framework.',
      'transcript', 'HYBRID AGILE-WATERFALL DELIVERY

The real world rarely fits neatly into either Agile or waterfall. Government contracts require fixed-price delivery and regulatory stage gates. Hardware products have physical manufacturing constraints that cannot be sprinted around. Enterprise ERP implementations have vendor-prescribed phase sequences. Hybrid delivery — combining Agile''s iterative development with waterfall''s milestone structure — is the practical reality for many project managers.

WHEN HYBRID IS THE RIGHT ANSWER

Hybrid is appropriate when you have conflicting constraints. You need Agile responsiveness in requirements (because they will evolve) but waterfall predictability in governance (because your steering committee approves budgets quarterly). You need Agile speed in software development but waterfall sequencing in hardware procurement (which has a 12-week lead time). You need Agile team autonomy but waterfall contractual milestones with a fixed-price client.

The warning: hybrid done poorly is worse than either pure approach. If the Agile team is constantly interrupted for waterfall reporting, and waterfall governance is constantly surprised by Agile scope changes, you have the worst of both. Hybrid done well requires deliberate design of the boundary between the two modes.

STAGE GATE INTEGRATION

The most common hybrid pattern: waterfall phase gates for governance and budget, Agile sprints for internal delivery.

Structure: Phase 0 Initiation (project charter, budget approval) → Agile development sprints → Phase Gate 1 Review (design complete, budget reconfirmed) → Agile build sprints → Phase Gate 2 Review (integration testing complete, go/no-go for UAT) → Agile UAT sprints → Phase Gate 3 (go-live approval) → waterfall-style deployment and hypercare.

Each phase gate requires a governance artifact package: updated business case, risk register, schedule forecast, budget status, quality sign-off. These are produced by you, the PM, from Agile team data — you translate sprint velocity and burndown into earned value and schedule variance for the governance board.

MANAGING TWO CADENCES

The central PM challenge in hybrid delivery is managing two cadences simultaneously: the 2-week sprint cadence (daily, focused on team delivery) and the quarterly governance cadence (monthly/quarterly, focused on business outcomes).

Practical techniques:

Sprint review as governance feeder: structure the sprint review so its outputs (demo, burndown, risks updated) directly feed the governance status report. Do not maintain two separate status tracking systems.

Milestone mapping: map sprint end dates to governance milestones. Sprint 6 end = Phase Gate 1. This makes sprint completion a governance event, aligning incentives.

Two-layer risk register: team-level risks are managed in the sprint retrospective; project-level risks are managed in the governance risk register. Elevate risks from sprint to project register when they exceed sprint-level impact.

GOVERNANCE ARTIFACT MAPPING

Your governance artifacts must coexist with Agile artifacts.

Project Initiation Document (PID) → maps to project charter + initial product backlog.
RAG status report → maps to sprint review summary + impediment log.
Change control log → maps to backlog refinement decisions + sprint scope changes.
Budget forecast → maps to earned value analysis on completed sprint story points.

DELIVERABLE: Hybrid Delivery Framework
Design a Hybrid Delivery Framework for your project. Define: the waterfall governance cadence (phase gates, decision points, required artifacts); the Agile development cadence (sprint length, ceremonies, metrics); how sprint metrics translate to governance artifacts; the change control process bridging both modes; and team communication protocols for each cadence.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: AI in Agile: Sprint Intelligence & Velocity Prediction
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI in Agile: Sprint Intelligence & Velocity Prediction',
      'description', 'AI tools for sprint planning, velocity prediction, backlog prioritization, and Agile retrospective analysis. Produces an AI Agile Toolkit.',
      'transcript', 'AI IN AGILE: SPRINT INTELLIGENCE & VELOCITY PREDICTION

AI is moving into Agile tooling rapidly. Sprint planning that used to require hours of manual estimation is being augmented by AI velocity prediction. Backlog prioritization that required complex spreadsheets is being automated with AI-powered scoring. Retrospective analysis that required skilled facilitation is being supported by sentiment analysis. This lesson shows you how to use these capabilities to make your Agile projects smarter.

AI VELOCITY PREDICTION

Velocity — story points completed per sprint — is the heartbeat of Scrum forecasting. But raw velocity is noisy: team composition changes, sprint goals vary in complexity, holidays reduce capacity, technical debt slows output.

AI velocity prediction models use regression analysis on historical sprint data to forecast future velocity, accounting for known variables:

Input features: trailing 6-sprint rolling average velocity, planned capacity for next sprint (FTE-days available), sprint goal complexity (estimated by the team), technical debt ratio (percentage of sprint capacity allocated to debt reduction), holiday/leave schedule.

Output: predicted velocity range (not a point estimate). Example: model predicts 28–34 story points for Sprint 12, with a mean of 31. The 80% confidence interval is 26–36. This is more useful than a single number — it gives you a range for release planning conversations.

R² value matters: if your model has R² = 0.85, 85% of velocity variation is explained by your input features. If R² = 0.40, the model adds limited value over a simple moving average. Evaluate your model''s predictive power before relying on it.

AI BACKLOG PRIORITIZATION

Manual backlog prioritization is time-consuming and often driven by whoever has the strongest opinion in the room. AI can automate Weighted Shortest Job First (WSJF) scoring.

WSJF = Cost of Delay ÷ Job Duration. Cost of Delay = User/Business Value + Time Criticality + Risk Reduction/Opportunity Enablement.

AI can estimate Cost of Delay components by analyzing user story text, stakeholder feedback, support ticket volume, and business metric correlations. The PM and PO review AI-generated WSJF scores, override where judgment is needed, and publish the prioritized backlog — cutting prioritization meeting time by 50–70%.

AI RETROSPECTIVE ANALYSIS

Retrospectives generate valuable qualitative data that typically stays in a Miro board or Confluence page and is never analyzed systematically. AI changes this.

NLP sentiment analysis on retrospective notes surfaces recurring themes across sprints. If 8 consecutive sprint retrospectives mention "unclear requirements from the product owner" as an impediment, that is a systemic issue — but you might not notice it reviewing one retrospective at a time.

AI tools for retrospective analysis: EasyRetro and Parabol have AI features that cluster themes. Alternatively, export retrospective notes to a CSV and use Claude to identify patterns across multiple sprints.

AI SPRINT RISK FLAGS

Before sprint planning, AI can scan the selected stories for risk signals:

- Stories with no acceptance criteria (high risk of scope disagreement)
- Stories estimated at >8 story points (should be split)
- Stories with >3 unresolved dependencies
- Stories touching high-complexity modules (flagged by SonarQube complexity scores)

These flags allow the team to address risks before committing to the sprint, not during it.

SPECIFIC TOOLS

Jira Advanced Roadmaps uses AI to generate release forecasts from team velocity data. Linear and Shortcut have AI features for story suggestion and backlog organization. GitHub Copilot for pull request descriptions and code review reduces developer time on sprint administrative tasks, improving effective sprint capacity.

DELIVERABLE: AI Agile Toolkit
Document your AI Agile Toolkit: (1) velocity prediction model — inputs, calculation method, confidence interval approach; (2) WSJF scoring template with AI-assisted Cost of Delay estimation; (3) retrospective analysis workflow — how you will systematically analyze patterns across sprints; (4) sprint risk flag checklist with AI integration. Test each tool on your current or most recent project data.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 12 — Change Management & Organizational Transformation  (OFFSET 11, order_index = 12)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 11;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M12 chapter not found'; END IF;

  -- Lesson 1: Change Management Frameworks: Kotter & ADKAR
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Change Management Frameworks: Kotter & ADKAR',
      'description', 'Kotter 8 steps and ADKAR applied to project change: when to use each and how to integrate them with your project plan. Produces a Change Management Plan.',
      'transcript', 'CHANGE MANAGEMENT FRAMEWORKS: KOTTER & ADKAR

Most project failures are not technical failures — they are adoption failures. The system works. The process is sound. But people do not change how they work, so the project''s benefits never materialize. Change management is the discipline that closes the gap between project delivery and business outcome. Two frameworks dominate practice: Kotter''s 8-step model and Prosci''s ADKAR model.

KOTTER''S 8-STEP MODEL

John Kotter developed his model from studying 100+ organizational transformations. It is organization-level and top-down — it describes what leadership must do to create conditions for change.

Step 1 — Create urgency: people must feel that change is necessary now. "We lost three major accounts to competitors with better digital tools" is urgency. "Leadership has decided to upgrade our CRM" is not. Urgency must be real and communicated with evidence.

Step 2 — Form a guiding coalition: assemble a group of influential people with formal authority, subject-matter expertise, and credibility with frontline staff. This coalition drives the change. A change without a coalition of advocates is a mandate, and mandates generate compliance, not commitment.

Step 3 — Create a vision for change: a clear, compelling description of what the future state looks like. Concise enough to be stated in 5 minutes. Specific enough to guide decisions.

Step 4 — Communicate the vision: communicate the vision at every opportunity. Use every channel. Have leaders model the new behaviors. Address objections directly. The rule of thumb: communicate 10× more than you think is necessary.

Steps 5–8 — Remove obstacles, generate short-term wins, build on change, anchor in culture: remove structural and process blockers to adoption. Create visible wins within 6 months to maintain momentum. Keep pushing until the change is embedded in culture — process, hiring criteria, performance metrics.

THE ADKAR MODEL

ADKAR, developed by Jeff Hiatt at Prosci, operates at the individual level. It identifies five sequential building blocks every person must have to change successfully:

Awareness: "I understand why this change is happening."
Desire: "I want to support this change."
Knowledge: "I know how to change."
Ability: "I can demonstrate the new behavior."
Reinforcement: "The new behavior is being sustained."

ADKAR is a diagnostic tool. If someone is not adopting the change, identify which ADKAR element is the barrier and intervene specifically. If they lack Awareness, communication is the solution. If they have Awareness and Desire but lack Knowledge, training is the solution. Applying training to an Awareness problem wastes resources and frustrates the audience.

INTEGRATING KOTTER AND ADKAR

Use them together: Kotter for the organizational roadmap, ADKAR for tracking individual transition.

Example: an ERP implementation uses Kotter''s steps to structure the organizational change program (urgency creation, coalition, vision communication). Every 3 weeks, ADKAR surveys are deployed to measure individual readiness by department. Finance team scores: Awareness 4.2, Desire 3.8, Knowledge 2.1, Ability 1.8, Reinforcement N/A. The barrier point is Knowledge — training intervention is prioritized for Finance before go-live.

YOUR CHANGE MANAGEMENT PLAN

A Change Management Plan has five sections: stakeholder impact assessment (who is affected and how), readiness assessment (ADKAR survey cadence and current scores), communication plan (message by audience by phase), training plan (curriculum by role, delivery method, timeline), and resistance management plan (resistance patterns identified, engagement strategies by stakeholder group).

DELIVERABLE: Change Management Plan
Write a Change Management Plan for your current project. Include: ADKAR assessment for your two highest-impact stakeholder groups; communication plan with messages mapped to Kotter phases; training plan by role; and your resistance management approach for the most resistant stakeholder group.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Resistance Analysis & Stakeholder Buy-In
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Resistance Analysis & Stakeholder Buy-In',
      'description', 'Why people resist, how to diagnose the root cause, and the engagement strategies that overcome each resistance pattern. Produces a Resistance Analysis.',
      'transcript', 'RESISTANCE ANALYSIS & STAKEHOLDER BUY-IN

Resistance to change is not irrational. Every person resisting your project has a reason — a perceived threat, an unmet concern, a prior bad experience with organizational change. Your job is not to dismiss resistance or steamroll it. Your job is to diagnose it and respond with the right intervention.

WHY PEOPLE RESIST

Research on change resistance identifies four root cause categories that map directly to ADKAR:

Lack of Awareness: "I don''t know why this is happening." The person has not been given a credible explanation for why the change is necessary. Information asymmetry creates anxiety, and anxiety produces resistance.

Lack of Desire: "I don''t want this to happen." The person understands the change but perceives it as threatening their status, workload, relationships, or job security. This is the hardest barrier to address because it is motivational, not informational.

Lack of Knowledge: "I don''t know how to do what''s being asked of me." The person is willing to change but lacks the skills or understanding to do so. Training and coaching address this.

Lack of Ability: "I know what I''m supposed to do but I can''t execute it reliably." Knowledge exists but the new behavior is not yet fluent. Practice, performance support tools, and patience address this.

FORCE FIELD ANALYSIS

Kurt Lewin''s Force Field Analysis maps the driving forces pushing for change against the restraining forces pushing against it. Draw a line down the middle of a page. On the left, list forces driving the change (regulatory requirement, competitive pressure, efficiency opportunity, executive sponsorship). On the right, list forces restraining change (habit, fear of job loss, skill gaps, poor timing, lack of trust in management).

Strategies: strengthen driving forces (build the business case, increase executive visibility) or reduce restraining forces (provide training, address fears directly, improve change communication). Lewin found that reducing restraining forces is typically more effective than adding more driving forces.

RESISTANCE ARCHETYPES

Four common resistance archetypes with tailored engagement strategies:

The Skeptic: intellectually challenges the change. Presents evidence, asks hard questions. Engagement: involve them early in design decisions, give them data, treat their questions seriously. Skeptics who are won over become your strongest advocates.

The Overwhelmed: not resistant in principle but drowning in change volume. Has too many other priorities. Engagement: simplify their change journey, provide more support, negotiate transition timelines, acknowledge the burden explicitly.

The Protector: defending their team or process against perceived disruption. Motivated by loyalty, not self-interest. Engagement: include them in protecting the things that matter, acknowledge what will be preserved, give them a role in the transition.

THE ADKAR BARRIER DIAGNOSTIC

To diagnose resistance systematically, run an ADKAR survey. Five questions, one per ADKAR element, scored 1–5. The lowest-scoring element that falls below 3 is the barrier point.

Example: Finance team survey results across 22 respondents — Awareness 4.2, Desire 3.9, Knowledge 2.1, Ability 1.7, Reinforcement N/A. Barrier point: Knowledge (2.1 < 3.0). The entire Finance team knows about the change and wants it to succeed, but does not know how to operate in the new system. The intervention is training — not more town halls, not executive messaging. Targeted training.

Conduct ADKAR surveys every 3–4 weeks during a major change. Track barrier point movement over time as your leading indicator of adoption readiness.

COALITION BUILDING

Identify 3–5 influential early adopters in each stakeholder group — people who are respected by their peers, willing to learn early, and able to articulate the change in language their colleagues trust. These are your change champions. Engage them before launch, give them access to leadership and resources, and give them a named role. Champions do not eliminate resistance, but they make adoption conversations feel peer-to-peer rather than top-down.

DELIVERABLE: Resistance Analysis
Conduct an ADKAR survey (or qualitative proxy if survey access is limited) for your two highest-impact stakeholder groups. Identify barrier points for each group. Apply force field analysis to the overall change. Profile the two most resistant individuals using the resistance archetypes framework. Write a targeted engagement strategy for each.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Change Communication Strategy & Campaign Design
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Change Communication Strategy & Campaign Design',
      'description', 'Communication campaigns, messages by audience segment, change champions, and feedback loops. Produces a Change Communication Plan.',
      'transcript', 'CHANGE COMMUNICATION STRATEGY & CAMPAIGN DESIGN

Communication is the most underinvested activity in change management. Projects spend months building the solution and weeks communicating it. This ratio should be closer to equal. Poor communication is the single most common root cause of change adoption failure — not system quality, not training content, but insufficient, poorly targeted, or poorly timed communication.

THE COMMUNICATION CAMPAIGN STRUCTURE

A change communication campaign runs in four phases corresponding to the adoption journey:

Phase 1 — Awareness (8–12 weeks before go-live): the goal is that 100% of affected stakeholders know the change is coming, why it is happening, and when. Channels: executive email, all-hands meeting, team manager briefing. Message focus: business case for change, high-level timeline, where to get more information.

Phase 2 — Understanding (4–8 weeks before go-live): stakeholders understand what specifically is changing for them. Channels: role-specific information sessions, FAQ document, intranet page, manager talking points. Message focus: "Here is what changes for your team specifically."

Phase 3 — Acceptance (1–4 weeks before go-live): stakeholders are moving from passive knowledge to active readiness. Channels: hands-on training, change champion-led team sessions, Q&A sessions, peer testimonials from pilot users. Message focus: "Here is how you will succeed in the new way of working."

Phase 4 — Adoption (go-live and post-go-live): support for people doing the new work in real conditions. Channels: floor walkers and help desks on go-live day, daily tip emails for first 2 weeks, champion network for peer support, rapid feedback loop to address issues. Message focus: "You can do this, and help is available."

WIIFM: WHAT''S IN IT FOR ME

The most powerful principle in change communication: every message must answer the question "What''s In It For Me?" for the specific audience receiving it.

Audience segmentation example for a CRM implementation:
- Sales team: "You will spend 30 fewer minutes per day on manual reporting and have real-time visibility into your pipeline."
- Finance team: "You will have one system of record for revenue forecasting instead of three reconciled spreadsheets."
- IT operations: "You will reduce support tickets by eliminating the legacy system''s integration failures."
- Executives: "The business gains a single source of truth for customer data, enabling the account expansion strategy."

Same project, four different WIIFM messages. Generic messages ("We are implementing a new CRM to improve efficiency") generate attention in none of these audiences.

CHANNEL SELECTION

Match channel to purpose:
- Executive email: high authority, low engagement. Use for awareness announcements.
- Town hall/all-hands: high reach, moderate engagement, allows Q&A. Use for vision and major milestones.
- Manager cascade: high trust, personalized. Managers are the most credible messengers for their direct reports. Brief managers in advance with talking points and Q&A prep.
- Intranet/SharePoint: low reach, high persistence. Use for reference materials (FAQ, training links, go-live checklist).
- Change champions: highest peer trust, lowest scale. Use for local Q&A, success stories, real-time support.

FEEDBACK MECHANISMS

Communication is not one-way. Build feedback into the campaign:
- Pulse surveys: 3–5 questions every 2 weeks measuring awareness, readiness, and confidence. Track trends.
- Q&A sessions: open forums where concerns can surface. Document and answer all questions; publish responses.
- Champion feedback: champions report back what they hear on the ground. Themes feed into message adjustments.
- Sentiment tracking: monitor Slack/Teams channels for change-related discussion. Recurring concerns signal communication gaps.

DELIVERABLE: Change Communication Plan
Write a 4-phase Change Communication Plan for your project. For each phase: list audience segments, key WIIFM message per segment, channel, sender, timing, and success metric. Add feedback mechanisms for each phase. Design the change champion network: selection criteria, role description, and engagement model.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Measuring Change Adoption & Sustaining Momentum
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Measuring Change Adoption & Sustaining Momentum',
      'description', 'Adoption metrics, reinforcement mechanisms, and the 90-day post-go-live plan. Produces a Sustainability Plan.',
      'transcript', 'MEASURING CHANGE ADOPTION & SUSTAINING MOMENTUM

Most change management programs are structured to end at go-live. The budget is spent, the project team disperses, and the organization is left to consolidate the change on its own. This is precisely when adoption is most fragile and most critical. The 90 days post-go-live determine whether the change sticks or reverts. This lesson covers how to measure adoption, reinforce new behaviors, and hand off sustainment to the business.

THE ADOPTION METRICS PYRAMID

Adoption metrics have a hierarchy from leading indicators (early signals of behavior change) to lagging indicators (evidence of business outcome). Measure across all three levels.

Activity metrics (leading — Days 1–30): system login rate, training completion percentage, volume of transactions processed through the new system. These tell you whether people are using the new system at all. Target: 85% of users logged in at least once in Week 1; 95% trained before go-live.

Proficiency metrics (intermediate — Days 30–60): accuracy rate, task completion rate, time per transaction, number of support tickets per user. These tell you whether people are using the system correctly and with increasing fluency. Benchmarks should be set from the pilot group.

Outcome metrics (lagging — Days 60–90+): the business outcome the project was intended to deliver. For a CRM implementation: sales conversion rate improvement; for a process automation project: manual processing time reduction; for a compliance system: audit finding reduction. These are the metrics that prove ROI.

THE 90-DAY POST-GO-LIVE STRUCTURE

Days 1–30 (Hypercare): intensive support phase. Daily war room standup with project team and business representatives to triage issues in real time. Floor walkers or dedicated support channel. Accelerated incident SLAs (resolve within 4 hours vs. normal 24 hours). Daily champion check-ins. Dashboard showing login rates, support ticket volume, and error rates reviewed every morning.

Days 31–60 (Optimization): stabilization phase. Move from daily to weekly war room. Identify users below proficiency threshold — schedule targeted retraining. Surface process friction points and resolve with configuration changes or job aids. Begin measuring intermediate proficiency metrics.

Days 61–90 (Sustainment handoff): prepare business owners to sustain the change without project team support. Document the sustainment plan, reinforce metrics ownership, transition change champion network to business leadership, close the change management workstream formally.

REINFORCEMENT MECHANISMS

Reinforcement prevents regression. People revert to old behaviors when reinforcement is absent, especially under stress. Build these mechanisms:

Recognition: publicly acknowledge teams and individuals demonstrating the new behaviors. Use change champions to surface success stories. Manager shoutouts in team meetings.

Accountability: integrate new behavior metrics into team performance reviews. If managers are measured on their team''s system adoption rate, adoption becomes a management priority, not just an HR initiative.

Job description updates: update role descriptions to reflect new expected behaviors. This signals permanence — the change is not temporary.

Process lock: remove the old system or process after the transition window. When the old way is no longer available, there is no reversion option.

PROSCI''S REINFORCEMENT PRINCIPLE

Prosci research shows that reinforcement is the ADKAR element most frequently skipped and the most responsible for sustainability failure. Their guidance: identify what reinforcement means for each stakeholder group, assess whether reinforcement is occurring, and actively manage it through the sustainment period.

DELIVERABLE: Sustainability Plan
Write a 90-day post-go-live Sustainability Plan for your project. Include: adoption metrics for each of the three levels with targets and measurement method; Day 1–30 hypercare structure; Days 31–60 optimization plan; Days 61–90 sustainment handoff process; reinforcement mechanisms by stakeholder group; and criteria for formally closing the change management workstream.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: AI-Assisted Change Impact Assessment & Planning
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI-Assisted Change Impact Assessment & Planning',
      'description', 'Using AI to assess change impact, generate communication drafts, and identify at-risk stakeholder groups. Produces an AI Change Impact Report.',
      'transcript', 'AI-ASSISTED CHANGE IMPACT ASSESSMENT & PLANNING

Change impact assessment — understanding who is affected, how significantly, and in what ways — is one of the most time-consuming activities in change management. Traditional approaches require interviews, workshops, and manual analysis of role descriptions and process maps. AI compresses this from weeks to days, while surfacing patterns that human analysts miss.

AI FOR CHANGE IMPACT ASSESSMENT

The AI-assisted change impact workflow starts with structured inputs:

Step 1 — Inputs: current state process documentation, future state process documentation, organization chart with role descriptions, headcount by role, ADKAR survey results (if available), project timeline.

Step 2 — AI processing: upload to a large language model (Claude works well for this). Prompt: "Compare the current state and future state processes for each role listed. For each role, assess: (a) magnitude of change on a 1–10 scale; (b) specific process steps that change; (c) new skills required; (d) volume of transactions impacted; (e) risk if this role does not adopt." The AI generates a draft impact matrix in minutes.

Step 3 — Human review: change managers review the AI output, correct errors, add qualitative nuance, and validate with role representatives.

Step 4 — Prioritization: sort roles by impact score and readiness score. The roles with high impact AND low readiness are your highest-priority intervention targets.

AI STAKEHOLDER SEGMENTATION

Once you have impact scores and ADKAR survey results, AI can cluster stakeholders into intervention segments using pattern recognition across multiple variables simultaneously — impact level, readiness score, influence level, resistance risk, reporting structure. A human analyst working with a spreadsheet might segment stakeholders into 3–4 groups. AI can produce 6–8 nuanced segments with recommended interventions for each.

Example output: "Segment 3: Finance — AP Team. Impact: 7.8/10. ADKAR composite: 3.2/5. Influence: Moderate. Risk: High — these users process 340 transactions/day and have the lowest readiness score in the organization. Recommended interventions: additional hands-on training (4 hours vs. standard 2), dedicated support desk access for first 30 days, change champion assigned from within AP team."

AI COMMUNICATION DRAFTING

AI dramatically accelerates the creation of audience-specific change communications. Feed the AI: role description, WIIFM for that role, phase of change communication, desired tone and length, and any Q&A the audience is likely to have.

Output: a draft email, town hall script, or manager talking points tailored to that audience. A PM managing a 12-audience segmented communication campaign can generate first drafts for all 12 audiences in 2 hours rather than 2 days.

Human editing is essential: review for accuracy, adjust for organizational voice, remove any AI hallucinations about specific process details. AI drafts — humans approve.

AI SENTIMENT ANALYSIS

If your organization uses Slack, Microsoft Teams, or survey platforms, AI sentiment analysis can track change-related discussion in real time. Natural language processing models score sentiment in change-related channels: positive (excited, confident, supportive) vs. negative (anxious, confused, resistant). Declining sentiment scores in a specific team are an early warning signal — investigate before the feeling becomes an organized resistance pattern.

DELIVERABLE: AI Change Impact Report
Run an AI-assisted change impact assessment for your project. Input your current vs. future state process delta and role list into an AI tool. Generate an impact matrix with scores by role. Layer in ADKAR survey results to identify highest-risk segments. Generate AI-drafted communication for your two highest-impact audience segments. Document the AI workflow so it can be repeated for the next change initiative.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;
-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 13 — Portfolio & Program Management  (OFFSET 12, order_index = 13)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 12;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M13 chapter not found'; END IF;

  -- Lesson 1: Portfolio Management: Selection, Prioritization & Balance
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Portfolio Management: Selection, Prioritization & Balance',
      'description', 'Portfolio scoring models, strategic alignment assessment, and the governance process for portfolio decisions. Produces a Portfolio Scoring Framework.',
      'transcript', 'PORTFOLIO MANAGEMENT: SELECTION, PRIORITIZATION & BALANCE

Project portfolio management answers the most important resource question an organization faces: of all the things we could do, which should we invest in now? Without a disciplined portfolio process, organizations invest in the projects of whoever lobbied hardest or arrived at the budget table first. With one, investment decisions are transparent, defensible, and strategically aligned.

THE PORTFOLIO SCORING MODEL

A portfolio scoring model evaluates every proposed project on the same criteria, producing a comparable score that supports rational investment decisions.

The four standard scoring dimensions:

Strategic fit (scored 1-5): how directly does this project contribute to strategic priorities? Score 5 = directly enables a top-3 strategic objective. Score 3 = supports a secondary strategic priority. Score 1 = no clear strategic connection.

Financial return (scored 1-5): expected return measured by NPV, ROI, payback period, or revenue impact. Score 5 = NPV > $1M or ROI > 200%. Score 3 = NPV $100K-$500K or ROI 50-150%. Score 1 = break-even or cost-only project.

Risk (scored 1-5, inverted): lower risk scores higher. Score 5 = low risk (proven technology, experienced team, clear requirements). Score 3 = moderate risk. Score 1 = high risk (new technology, unclear requirements, external dependencies).

Resource availability (scored 1-5): do we have the people, budget, and capability to execute this now? Score 5 = fully resourced with no competing priorities. Score 3 = partially resourced, some conflicts. Score 1 = significant resource gaps.

Weighted scoring matrix example weights: strategic fit 40%, financial return 35%, risk 15%, resource fit 10%. A project scoring 4, 3, 4, 3 on these dimensions earns: (4x0.40) + (3x0.35) + (4x0.15) + (3x0.10) = 1.60 + 1.05 + 0.60 + 0.30 = 3.55 out of 5.00.

THE PORTFOLIO REVIEW PROCESS

Project intake: all proposed projects submit a standard intake form covering project description, sponsor, estimated cost, expected benefit, and strategic alignment rationale. No intake form, no scoring.

Scoring: the PMO scores each proposal against the weighted criteria. Projects above a threshold score (e.g., 7.0/10) are considered for funding. Projects below are declined or deferred with explanation.

Portfolio balance assessment: even after scoring, balance the portfolio. A portfolio of all high-complexity innovation projects is high-reward but high-risk. Balance includes: mix of short-term quick wins vs. long-term transformations; mix of risk levels; distribution across business units; mix of project types (operational improvement, growth, compliance, innovation).

Example: technology department evaluates 12 project proposals. After weighted scoring: 5 projects score above 7.2/10 — funded. 4 projects score 5.0-7.2 — deferred to next cycle. 3 projects score below 5.0 — declined with documented rationale.

BCG MATRIX ADAPTED FOR PROJECTS

Adapt the BCG portfolio matrix: Stars (high strategic value, high risk): fund with contingency. Cash Cows (high strategic value, low risk): prioritize. Question Marks (low strategic value, high risk): deprioritize or kill. Dogs (low strategic value, low risk): decline unless mandatory compliance.

DELIVERABLE: Portfolio Scoring Framework
Build a Portfolio Scoring Framework for your organization. Define: four scoring dimensions with rubrics and weights; the portfolio intake form template; the scoring and ranking process; the portfolio review board governance (participants, cadence, decision authority); and the balance criteria you will use to assess portfolio composition beyond raw scores.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Program Management: Governance, Benefits & Interdependencies
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Program Management: Governance, Benefits & Interdependencies',
      'description', 'Program governance structure, benefits map, interdependency register, and program-level risk management. Produces a Program Governance Charter.',
      'transcript', 'PROGRAM MANAGEMENT: GOVERNANCE, BENEFITS & INTERDEPENDENCIES

A program is not simply a large project or a collection of projects. A program is a group of related projects managed in a coordinated way to deliver benefits and control that would not be available from managing them individually. The distinction matters: a digital transformation program comprises multiple projects (CRM implementation, data warehouse build, customer portal development), and the benefit -- a 360-degree customer view -- only materializes when all three deliver together.

PROGRAM VS. PROJECT

Three defining characteristics distinguish a program from a portfolio of independent projects.

Benefits dependency: the program''s strategic benefit requires coordination across multiple component projects. Individual project deliverables alone do not generate the benefit.

Interdependency management: the projects within a program have dependencies on each other -- shared data, shared infrastructure, shared resources, sequenced delivery.

Shared governance: a program board with authority over all component projects makes coordinated decisions about scope, resources, timing, and risk across the program.

PROGRAM GOVERNANCE: THE MSP FRAMEWORK

The Managing Successful Programmes (MSP) framework defines program governance through four roles.

Sponsoring Group: senior executives who authorize the program and own the business case. They provide strategic direction and approve changes to the business case.

Senior Responsible Owner (SRO): accountable for the program''s success. The SRO is the single point of accountability for benefits realization.

Program Manager: responsible for day-to-day program delivery -- coordinating component projects, managing the program risk register, running the Program Board, and reporting to the SRO.

Business Change Manager (BCM): responsible for benefits realization within the business. Manages the transition from project delivery to business-as-usual, tracks benefits metrics post-go-live.

BENEFITS MAP

The benefits map traces the causal chain from project deliverables to strategic objectives:

Project outputs (what we build) > Outcomes (what changes in the business) > Benefits (measurable improvements in business performance) > Strategic objectives (organizational goals achieved).

Example: digital transformation program. Output: CRM system deployed. Outcome: sales team has unified customer history and pipeline visibility. Benefit: sales conversion rate increases from 18% to 24%. Strategic objective: grow SMB market share by 15%.

INTERDEPENDENCY REGISTER

The interdependency register tracks all dependencies between component projects. Each entry includes: dependency description, predecessor project and deliverable, successor project and dependent activity, dependency type (finish-to-start, start-to-start), planned dates, current status, and risk if dependency is delayed.

Example: customer self-service portal has a finish-to-start dependency on the data warehouse project. If data warehouse delivery slips 6 weeks, the portal launch slips 6 weeks -- and the customer service headcount reduction benefit cannot be realized.

PROGRAM-LEVEL RISK MANAGEMENT

Program risks include: risk that one project''s delay cascades to others (schedule interdependency risk), risk that benefits are interdependent and partial delivery yields no benefit (benefit realization risk), and risk that cross-project resource conflicts materialize simultaneously.

Maintain a program risk register that aggregates and analyzes risks across all component projects. Escalate project risks to the program register when their impact affects the program''s benefit delivery timeline.

DELIVERABLE: Program Governance Charter
Write a Program Governance Charter. Include: program vision and strategic objective; component projects and their relationship; benefits map with causal chain; program governance structure and roles (SRO, Program Manager, BCM); program board operating rhythm; interdependency register with top 5 dependencies; program-level risk register.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Resource Portfolio Optimization
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Resource Portfolio Optimization',
      'description', 'Resource pooling, capacity planning, and resolving cross-project resource conflicts at the portfolio level. Produces a Resource Capacity Model.',
      'transcript', 'RESOURCE PORTFOLIO OPTIMIZATION

The most common reason project portfolios underperform is not poor project selection -- it is resource overcommitment. Organizations approve more projects than their people can deliver. The result: everything runs late because everyone is context-switching across too many priorities. Resource portfolio optimization addresses this at the portfolio level, not the project level.

CAPACITY PLANNING FUNDAMENTALS

Resource capacity planning has two sides: supply and demand.

Supply is the total available working capacity of your resource pool. Calculate it as: number of FTEs x working days per period x productive time percentage. A team of 10 developers x 20 working days x 70% productive time = 140 person-days of productive capacity per month.

Demand is the total resource requirements across all active projects. Sum the planned resource requirements for each project in the portfolio for each time period.

Capacity utilization = demand / supply x 100%.

Target utilization: 70-80%. At 100% utilization, any disruption (illness, unplanned request, underestimation) causes immediate overload. The 20-30% buffer absorbs variability. Research by Gerald Weinberg shows that people assigned to 3 or more projects simultaneously lose 40%+ of productive capacity to context-switching overhead.

RESOURCE HISTOGRAM

The resource histogram visualizes supply vs. demand over time for each resource or resource pool. The x-axis is time (weeks or months). The y-axis is utilization percentage or person-days. Each project is a stacked bar showing its resource draw.

When the stacked bar exceeds supply (the 100% line), you have an overcommitment. The histogram makes this visible months in advance -- time enough to act.

Example: a portfolio of 8 projects draws on a pool of 3 Java developers. The August resource histogram shows demand peaking at 340% of capacity -- 3.4 FTE-months of work planned for 1 FTE-month of capacity. Without intervention, all three Java-dependent projects miss their August milestones.

CONFLICT RESOLUTION APPROACHES

When the histogram reveals overcommitment, three resolution strategies are available.

Priority-based: the highest-scoring project in the portfolio gets resources first. The lowest-scoring project waits. This requires that project scoring be current and trusted.

Negotiation-based: PM-to-PM negotiation. Project A and Project B PMs agree that Project A gets the Java developer in August (critical path) and Project B gets priority access in September. Document the agreement and update the resource plan.

Escalation to Portfolio Review Board: when PMs cannot agree, or when the resource conflict affects multiple high-priority projects, escalate to the PRB. Come prepared with: resource demand for each project, strategic priority scores, cost of delay for each project if resources are not available, and your recommended resolution.

RESOURCE POOLING BENEFITS

Resource pools -- shared pools of specialized skills available to all projects -- reduce portfolio resource fragility. Instead of each project claiming exclusive ownership of a Java developer, Java developers are managed as a pool. Benefits: reduced idle time (when Project A does not need the developer, Project B can use them), ability to absorb unexpected demand, skill development through diverse project exposure.

DELIVERABLE: Resource Capacity Model
Build a Resource Capacity Model for your project portfolio. Include: resource supply calculation by skill category; demand forecast by project by month for the next 6 months; resource histogram showing utilization by period; identification of overcommitment periods; and resolution recommendations for each conflict.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Strategic Alignment: OKRs, Strategy Maps & Benefits Realization
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Strategic Alignment: OKRs, Strategy Maps & Benefits Realization',
      'description', 'Connecting project outcomes to organizational OKRs and strategy maps: benefits mapping and realization tracking. Produces a Benefits Realization Plan.',
      'transcript', 'STRATEGIC ALIGNMENT: OKRs, STRATEGY MAPS & BENEFITS REALIZATION

Every project should exist because it advances the organization''s strategy. Yet research consistently shows that more than half of projects cannot clearly articulate which strategic objective they support. Projects that cannot answer "why does this matter strategically?" are vulnerable to cancellation, deprioritization, and scope reduction. This lesson teaches you to make the strategic connection explicit, traceable, and measurable.

OKRs: OBJECTIVES AND KEY RESULTS

OKRs, popularized by Google from Andy Grove''s Intel management system, structure strategic goals into two components.

Objective: a qualitative, inspirational statement of what you want to achieve. "Become the market leader in small business financial software." Objectives are ambitious and directional.

Key Results: three to five measurable outcomes that define what success looks like within the next quarter or year. "Increase net promoter score from 34 to 55." "Reduce time-to-first-value for new customers from 45 days to 14 days." "Grow SMB market share from 12% to 18%."

Your project deliverables should trace to key results. If you are building a customer onboarding automation tool, the key result it enables is "Reduce time-to-first-value from 45 to 14 days." If no key result maps to your project, ask: should this project exist?

STRATEGY MAPS

Kaplan and Norton''s Strategy Map shows the causal logic of how the organization creates value across four perspectives:

Financial perspective: shareholder value, revenue growth, cost reduction.
Customer perspective: customer satisfaction, market share, brand loyalty.
Internal Process perspective: innovation processes, operational excellence, customer management processes.
Learning and Growth perspective: skilled employees, effective technology, supportive culture.

Your project typically lives in the Internal Process or Learning and Growth perspective. A CRM implementation improves customer management processes (Internal Process) which improves customer satisfaction (Customer) which drives revenue growth (Financial).

BENEFITS REALIZATION PLAN

Benefits realization planning bridges project delivery and business outcome. The plan has six components.

Benefit name and description: "Reduction in customer acquisition cost through improved sales process efficiency."

Benefit owner: the business manager accountable for realizing this benefit. Not the PM -- the PM delivers the enabling capability, but the business owns the benefit.

Baseline value: current state measurement. "Current customer acquisition cost: $284 per customer."

Target value: post-project target. "Target customer acquisition cost: $190 per customer."

Measurement method: how and when will the benefit be measured? "Calculated monthly from CRM pipeline data and marketing spend. Measured 90, 180, and 365 days post-go-live."

Realization date: when do you expect to see the benefit? Benefits often lag project completion -- a CRM benefit may not fully materialize for 6-12 months as the sales team builds fluency.

TRANSITION PLAN

When the project closes, benefit ownership transfers to the business. The transition plan documents: who owns each benefit post-project, what data will be collected, who reviews it and when, and what escalation path exists if benefits are not materializing.

DELIVERABLE: Benefits Realization Plan
Write a Benefits Realization Plan for your current project. Map your project''s deliverables to the organizational OKR they support. Place the project on a strategy map. Define three measurable benefits with baseline, target, owner, measurement method, and realization timeline. Document the benefit transition plan for project close-out.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: AI for Portfolio Analytics & Investment Decisions
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI for Portfolio Analytics & Investment Decisions',
      'description', 'Using AI to analyze portfolio data, surface investment insights, and model resource scenarios. Produces an AI Portfolio Intelligence Report.',
      'transcript', 'AI FOR PORTFOLIO ANALYTICS & INVESTMENT DECISIONS

Portfolio management decisions -- which projects to fund, accelerate, pause, or cancel -- are some of the most consequential decisions an organization makes. AI is transforming portfolio analytics by processing far more data than human analysts can handle, surfacing non-obvious patterns, and modeling scenarios in minutes that would take days manually.

AI PORTFOLIO ANALYTICS USE CASES

Investment scenario modeling: AI can model the portfolio value impact of different investment decisions -- cancel Project A and reinvest in Project B; delay Project C by one quarter; add one FTE to Project D. Each scenario produces a projected portfolio value, resource utilization profile, and risk-adjusted return estimate. Manual scenario modeling takes hours per scenario; AI produces dozens of scenarios in minutes.

Resource bottleneck prediction: AI trained on historical project data can predict resource bottlenecks 6-8 weeks in advance by analyzing current resource demand trajectories, historical overrun patterns, and known schedule constraints. A PM who knows in July that October will have a Java developer bottleneck has time to act.

Portfolio health scoring: AI aggregates signals across all projects -- schedule variance trends, cost performance index history, risk register age and closure rate -- into a single portfolio health score per project. Projects declining in health score trigger proactive PM attention before crisis.

Risk correlation analysis: AI identifies correlations between projects that human analysis misses. Two projects that share a critical vendor, or that both depend on the same legacy system integration, have correlated risk. AI surfaces these clusters so the PMO can manage correlated risk explicitly.

MONTE CARLO SIMULATION FOR PORTFOLIO ROI

Monte Carlo simulation models the probability distribution of portfolio outcomes by running thousands of iterations with randomly sampled values for key variables (project duration, cost, benefit realization rate). The output is a probability distribution: "There is a 70% probability of return between $3.1M and $5.8M, with a 10% chance of return below $2.0M." This is more useful than a point estimate.

AI-GENERATED WHAT-IF SCENARIOS

Example: the PMO asks "What happens to portfolio delivery if we cancel Project Gamma and reallocate its 2.3 FTE months of senior architect time?" AI model analyzes: Project Gamma contribution to portfolio score (low: 3.1/5), resource reallocation impact to Projects Alpha and Beta (both accelerate by average 6 weeks), net portfolio value change (+$340K from accelerated delivery benefits minus regulatory report delay cost). Total: cancel Project Gamma improves portfolio value by an estimated $290K. This analysis would traditionally require 3 days from the PMO team. AI produces it in 20 minutes.

NATURAL LANGUAGE PORTFOLIO QUERYING

Tools like Planview AI, Clarity PPM, and Power BI natural language Q&A allow PMO staff to query portfolio data conversationally: "Which projects are at risk of missing their Q4 milestone?" "Which resource pools are overcommitted in September?" "Show me all projects with CPI below 0.85 for the last 3 months." This democratizes portfolio analytics -- business stakeholders who cannot read a Gantt chart can self-serve portfolio questions.

DELIVERABLE: AI Portfolio Intelligence Report
Set up an AI portfolio analytics workflow for your portfolio. Define: data sources (project tracking system, resource management system, financial system); key metrics to be monitored with alert thresholds; AI-generated weekly portfolio health summary template; scenario model for your top investment decision of the next 90 days; and natural language queries you will use for monthly portfolio reviews. Produce a sample AI Portfolio Intelligence Report.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 14 — Digital & Technology Project Leadership  (OFFSET 13, order_index = 14)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 13;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M14 chapter not found'; END IF;

  -- Lesson 1: Leading Technology Transformation Projects
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Leading Technology Transformation Projects',
      'description', 'The unique challenges of technology projects: changing requirements, vendor dependencies, integration complexity, and technical debt. Produces a Tech PM Risk Framework.',
      'transcript', 'LEADING TECHNOLOGY TRANSFORMATION PROJECTS

Technology projects fail at higher rates than non-technology projects. The Standish Group CHAOS Report has tracked this for decades: large IT projects exceed budget by 45% on average and deliver only 56% of originally planned features. Understanding why tech projects fail -- and building a risk framework that addresses root causes -- is essential for any PM leading digital transformation.

WHY TECHNOLOGY PROJECTS FAIL

Changing requirements: technology projects often take 12-24 months. The business environment changes. User needs evolve. A requirements baseline agreed in January may be partially obsolete by September. PMs who manage technology projects with waterfall rigidity -- treating January''s requirements as fixed -- deliver systems that are already outdated at go-live.

Vendor dependencies: most technology projects depend on vendors for software, cloud services, implementation support, or custom development. Vendor delays, contractual disputes, and financial instability directly impact project delivery. A PM who does not actively manage vendor relationships and contractual performance is exposed.

Integration complexity: modern IT landscapes are complex. A new CRM must integrate with the ERP, the marketing automation platform, the customer support system, and the data warehouse. Each integration is a dependency and a potential failure point. Integration complexity grows non-linearly: 5 integrations does not mean 5 times the risk of 1 integration.

Technical debt: accumulated shortcuts, undocumented workarounds, and deferred design decisions that make the system increasingly costly to change. Teams carrying high technical debt see a 20-40% velocity tax -- work that should take 1 sprint takes 1.5 sprints because the codebase is fragile.

THE PM AS TRANSLATION LAYER

In technology projects, the PM''s distinctive value is translating between two languages: technical and business. Developers speak in APIs, latency, database schemas, and deployment pipelines. Executives speak in ROI, time-to-market, customer impact, and strategic objectives. You do not need to write code. You do need to understand enough about the technical landscape to know when a technical risk is real and to translate it into business impact language for stakeholders.

TECH PM RISK FRAMEWORK

Four risk categories specific to technology projects:

Technical risk: integration failure (probability high if more than 5 integrations without proven patterns), performance degradation (if load testing not planned), security vulnerability (if security review not scheduled), technical debt impact on velocity.

Vendor risk: vendor delivery delay (track milestone compliance monthly), vendor financial instability (review vendor financial health at contract and annually), contractual scope ambiguity (resolve before contract signing).

Requirement risk: requirements volatility (measure as percentage of requirements changed per sprint; alert threshold above 15%), stakeholder misalignment on priorities.

Architecture risk: proof-of-concept for high-risk integrations needed (spike sprints before full implementation), architecture review checkpoint at end of design phase.

THE SPIKE SPRINT

For any high-risk integration or new technology, schedule a spike sprint -- a time-boxed investigation sprint whose sole purpose is to prove or disprove technical feasibility. A 1-week spike that proves an integration approach works saves months of rework discovered during build.

Example: a SaaS integration project -- PM facilitates architecture risk workshop identifying 3 high-risk API integrations. Each gets a 1-week spike before full implementation begins. Two spikes succeed. One reveals a fundamental data model incompatibility -- requirements are adjusted in sprint 3, not sprint 15.

DELIVERABLE: Tech PM Risk Framework
Build a Tech PM Risk Framework for your project. For each of the four risk categories (technical, vendor, requirement, architecture): list the specific risks, assess likelihood and impact, define the mitigation action and owner, and set the monitoring cadence. Identify which risks require a spike sprint before full implementation.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Cloud Migration & Infrastructure Project Management
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Cloud Migration & Infrastructure Project Management',
      'description', 'Cloud migration methodology (6 Rs), infrastructure sequencing, go-live planning, and hypercare. Produces a Cloud Migration PM Playbook.',
      'transcript', 'CLOUD MIGRATION & INFRASTRUCTURE PROJECT MANAGEMENT

Cloud migration is one of the most common technology project types PMs encounter today -- and one of the most complex. It involves technical migration work, application re-architecture decisions, data migration risk, operational change, and cost model transformation simultaneously. A structured methodology is not optional.

THE 6 RS OF CLOUD MIGRATION

Gartner and AWS have both articulated migration strategy frameworks that converge on six options:

Rehost (Lift and Shift): move the application as-is to cloud infrastructure with no code changes. Fastest and lowest technical risk. Suitable for stable applications where the goal is infrastructure cost reduction. Does not capture cloud-native benefits.

Replatform (Lift, Tinker, and Shift): make targeted optimizations without changing core architecture. Example: move from self-managed database server to managed RDS -- same database engine, no application code changes, but operational overhead reduced.

Repurchase (Drop and Shop): abandon the current application and purchase a SaaS replacement. Example: replace on-premises CRM with Salesforce. High organizational change, low technical complexity. The PM role shifts to SaaS implementation and change management.

Refactor/Re-architect: redesign and rebuild the application to use cloud-native features (containers, serverless, microservices). Highest value over time, highest effort and risk. Appropriate for core strategic applications where cloud-native capabilities create competitive advantage.

Retire: decommission the application. It is redundant, no longer needed, or will be replaced by another system.

Retain: keep the application on-premises, at least for now. Applications with regulatory requirements, mainframe systems with no migration path, or applications scheduled for sunset within 12 months.

MIGRATION WAVE PLANNING

Migrate in waves, not all at once. Wave planning principles:

Wave 1 (Proof of Concept): 6-10 low-risk, low-complexity applications. Rehost only. No external integrations. Goal: build migration factory competency, validate infrastructure, and prove the process before migrating critical systems.

Waves 2-3: moderate-complexity applications. May include some replatform candidates. Integration testing begins.

Final waves: mission-critical, high-complexity, or tightly integrated applications. By this stage, the team has run the migration process 30+ times.

Example: 47-application estate planned across 5 waves over 18 months. Wave 1: 8 Rehost applications, zero external integrations. Wave 5: 6 mission-critical systems with 12 integrations.

CUTOVER PLANNING

The cutover -- the moment the workload moves from old to new -- is the highest-risk event in a migration.

Cutover options: hard cutover (old system goes down, new system comes up; highest risk, simplest execution); parallel run (old and new systems run simultaneously; highest complexity, lowest risk); phased cutover by user group or geography (balances risk and complexity).

Cutover checklist must include: pre-cutover smoke test on new environment, data synchronization validation, rollback decision criteria and rollback procedure tested, communication plan for stakeholders during the window, go/no-go meeting 48 hours before cutover.

HYPERCARE PERIOD

The 30 days post-cutover require enhanced support: 24/7 on-call engineering coverage for first week, daily war room with migration team and operations, accelerated incident SLA (P1 resolved in 2 hours vs. normal 4 hours), dedicated hypercare helpdesk for end users.

DELIVERABLE: Cloud Migration PM Playbook
Write a Cloud Migration PM Playbook for an application estate of your choosing. Include: 6R classification for each application category; wave plan with sequencing rationale; cutover decision criteria (hard cutover vs. parallel run vs. phased); cutover checklist; rollback procedure; hypercare structure; and TCO model comparing cloud vs. on-premises cost over 3 years.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Software Delivery & DevOps PM
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Software Delivery & DevOps PM',
      'description', 'Release trains, CI/CD pipelines, DevOps culture, and how a PM adds value in a software delivery team. Produces a Software Delivery PM Guide.',
      'transcript', 'SOFTWARE DELIVERY & DEVOPS PM

DevOps has fundamentally changed how software is built and delivered. Instead of long development cycles ending in high-risk deployments, DevOps teams deploy small changes frequently -- sometimes dozens of times per day. As a PM in a DevOps environment, your value comes from understanding the pipeline, clearing organizational blockers, and tracking the right metrics.

THE DORA METRICS

The DevOps Research and Assessment (DORA) team at Google identified four metrics that predict organizational performance in software delivery. These are the metrics you should track as a PM in a DevOps environment.

Deployment Frequency: how often does the team deploy to production? Elite performers deploy multiple times per day. High performers deploy 1-7 times per week. Medium performers deploy 1-4 times per month.

Lead Time for Changes: time from code committed to running in production. Elite: less than 1 hour. High: 1 day to 1 week. Tracks the efficiency of your delivery pipeline.

Mean Time to Restore (MTTR): when a service incident occurs, how long to restore service? Elite: less than 1 hour. High: less than 1 day. Tracks operational resilience.

Change Failure Rate: percentage of deployments causing a production failure requiring rollback or hotfix. Elite: 0-15%. High: 16-30%.

Use DORA metrics in place of traditional schedule and cost metrics in a DevOps context. Example: current state -- deployment frequency 2/week, lead time 8 days, MTTR 4 hours, change failure rate 12%. 6-month target: deployment frequency 5/week, lead time less than 3 days.

CI/CD PIPELINE STAGES

Continuous Integration / Continuous Delivery (CI/CD) is the technical backbone of DevOps delivery:

Commit > Build (code compiled, dependencies resolved) > Unit Tests (fast automated tests, less than 5 minutes) > Static Analysis (SonarQube, security scanning) > Integration Tests (test interactions between services, 10-20 minutes) > Staging Deployment > Acceptance Tests (automated and manual) > Production Deployment.

A PM who sees "lead time 8 days" should ask: where in the pipeline is the time spent? If the staging environment has a 3-day queue, that is a PM-solvable problem (provision additional staging capacity). If integration tests take 6 hours, that is a development team problem.

RELEASE TRAINS

A release train is a fixed-cadence release schedule: software deploys on a fixed schedule regardless of feature completeness. If the release train runs every 2 weeks, whatever is ready and tested ships on that date. Features that miss the train wait for the next one.

Release trains provide predictability for stakeholders and reduce the pressure to rush features through the pipeline to catch a release -- a leading cause of quality shortcuts.

PM VALUE IN DEVOPS

What does a PM do in a DevOps team? You are:

Clearing organizational blockers: build environment needs a security exception; staging needs more compute budget; a vendor API is throttled. These require organizational navigation, not code changes.

Managing product owner priorities: ensure the team is always working on the highest-value work. Facilitate backlog refinement with the PO.

Stakeholder communication: translate deployment frequency and lead time into business language. "We deployed 9 times this sprint and the change failure rate was 8%, meaning features are reaching users faster with higher reliability."

Cross-team dependency management: when two DevOps teams must coordinate a shared API change, the PM is the coordinator.

DELIVERABLE: Software Delivery PM Guide
Write a Software Delivery PM Guide for your team. Define: current DORA metrics and 6-month targets; CI/CD pipeline stages and current lead time breakdown by stage; bottleneck analysis and improvement hypothesis; release train cadence; PM role definition in your DevOps team; and the 3 most common organizational blockers you clear.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Data & AI Implementation Project Leadership
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Data & AI Implementation Project Leadership',
      'description', 'Data migration projects, AI model deployment, MLOps coordination, and the PM role in data governance. Produces a Data/AI PM Playbook.',
      'transcript', 'DATA & AI IMPLEMENTATION PROJECT LEADERSHIP

Data and AI projects have a different risk profile from traditional software projects. The deliverable is not a feature -- it is a data asset or a model. Quality cannot be assessed by looking at the interface; it must be assessed by examining data completeness, accuracy, and model performance metrics. As a PM leading data or AI projects, you need fluency in this domain.

DATA MIGRATION PROJECT PHASES

A data migration project moves data from source systems to target systems. The phases:

Phase 1 -- Discovery and Data Audit: catalog all source systems, data objects, volume, and quality. Run data profiling (count of records, null rates by field, duplicate detection, format conformance). This phase typically reveals that data quality is far worse than anyone believed.

Phase 2 -- Mapping and Transformation Rules: document the source-to-target field mapping. Define transformation logic for each field. Have business owners validate mapping rules -- data semantics belong to the business, not IT.

Phase 3 -- Data Cleansing: remediate quality issues found in the audit. Deduplication, standardization of address formats, completion of mandatory fields. This is often the longest phase and the most underestimated.

Phase 4 -- ETL Execution (Extract, Transform, Load): run the migration in the test environment first. Validate using reconciliation counts (source record count equals target record count), sample validation (manually check 50 records), and business rule validation.

Phase 5 -- Cutover Migration: final data migration immediately before go-live. The critical risk: data entered in the source system after the last test migration and before cutover. Define the cutover strategy (freeze period, delta migration, or dual entry during transition).

DATA QUALITY DIMENSIONS

The six data quality dimensions from the DAMA Body of Knowledge: Completeness (are all required fields populated?), Accuracy (do data values match the real-world entity?), Consistency (does the same entity look the same in all systems?), Timeliness (is data current?), Uniqueness (are there duplicate records?), Validity (do values conform to defined formats?).

Example: CRM migration audit of 847,000 customer records -- 23% have email format violations, 11% are duplicates, 4% are missing required postal code. Data cleansing sprint reduces error rates to less than 1% across all dimensions before cutover.

AI MODEL DEPLOYMENT AND MLOps

The MLOps lifecycle: model development > staging > A/B test > full production deployment > monitoring > retraining. An AI model is a living asset that degrades over time as the real world changes and diverges from the training data distribution.

As PM in an MLOps context: coordinate the transition from data science to MLOps engineering, manage the A/B test decision (when has the model proven sufficient performance?), track model performance dashboards as a quality metric, and manage the retraining cadence as a recurring project activity.

PM ROLE IN DATA GOVERNANCE

Data governance intersects your project at three points: data ownership (who is the authoritative owner of each data domain -- they must approve mapping rules), data quality standards (acceptable quality thresholds for each field), and privacy impact assessment (does this project process personal data? If so, GDPR, CCPA, or HIPAA requirements apply and must be embedded in project scope).

DELIVERABLE: Data/AI PM Playbook
Write a Data/AI PM Playbook. Include: data migration phase plan with quality gate criteria for each phase; data quality dimension assessment for your key data domains; data cleansing plan with owner and target quality thresholds; if AI project: MLOps lifecycle description, A/B test criteria, model monitoring approach; data governance RACI for data ownership decisions.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Cybersecurity & Compliance Project Management
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Cybersecurity & Compliance Project Management',
      'description', 'Compliance-driven projects (GDPR, SOC2, HIPAA): requirements, controls, audit evidence, and testing. Produces a Compliance PM Checklist.',
      'transcript', 'CYBERSECURITY & COMPLIANCE PROJECT MANAGEMENT

Compliance-driven projects have non-negotiable scope. You cannot descope a GDPR requirement because the timeline is tight. You cannot defer a SOC2 control because the developer is unavailable. Compliance requirements are constraints, not preferences. PMs who treat them otherwise expose their organization to regulatory fines, audit failures, and reputational damage.

COMPLIANCE FRAMEWORK STRUCTURE

Every compliance framework follows the same logical structure: requirement > control > evidence > testing.

Requirement: the regulatory mandate. GDPR Article 33 requires notification to the supervisory authority within 72 hours of discovering a personal data breach.

Control: the organizational mechanism that ensures compliance. "The incident response playbook defines a 4-hour detection-to-notification SLA for personal data breaches, with automatic escalation to the DPO."

Evidence: the documented proof that the control exists and is working. Incident response policy document, DPO escalation log, breach notification records.

Testing: the verification that the control works as designed. Annual tabletop exercise simulating a data breach; incident response drill with timer.

Your job as PM: ensure that for every compliance requirement in scope, there is a control, the control has a defined evidence artifact, and the testing cadence is scheduled in the project plan.

KEY COMPLIANCE FRAMEWORKS

GDPR: applies to any project processing personal data of EU residents. Key PM requirements: Privacy by Design (privacy must be built in, not bolted on), data minimization, Data Protection Impact Assessment (DPIA) required for high-risk processing, breach notification within 72 hours.

SOC2: five Trust Service Criteria -- Security (mandatory), Availability, Processing Integrity, Confidentiality, Privacy. SOC2 Type I is a point-in-time assessment; SOC2 Type II covers a period (typically 6-12 months of operational control evidence). PMs leading SOC2 readiness must plan for the observation period -- controls must be operating continuously.

HIPAA: three safeguard categories. Administrative safeguards: policies, training, access management. Physical safeguards: physical access controls, workstation security. Technical safeguards: encryption (AES-256 at rest, TLS 1.2+ in transit), access controls, audit logs, automatic logoff.

COMPLIANCE PROJECT STRUCTURE

Gap Assessment (Weeks 1-4): compare current state controls against each requirement. Document gaps.
Remediation Roadmap (Weeks 4-6): prioritize gaps by audit risk, build corrective actions into project plan.
Control Implementation (Weeks 6-18): build missing controls.
Evidence Collection (Ongoing from Week 6): implement evidence collection processes -- the control must generate evidence automatically, not require someone to manually assemble it before the audit.
Audit Readiness (Month 5-6): mock audit; review evidence packages.
Audit Window: auditors review controls and evidence.

EVIDENCE MANAGEMENT ROLE

As PM, you own the evidence management system. Set up a compliance evidence repository (SharePoint, Vanta, Drata, or similar). For each control: document the control owner, the evidence artifact, the collection method, the retention period, and the last tested date.

Example: SOC2 Type II readiness project -- 94 controls across 5 Trust Service Criteria. PM tracks compliance percentage weekly: Month 1: 34%, Month 3: 67%, Month 5: 91%. Month 6: audit window opens with evidence packages for all 94 controls.

DELIVERABLE: Compliance PM Checklist
Build a Compliance PM Checklist for your project. For the relevant framework (GDPR, SOC2, HIPAA, or other): list each requirement in scope, define the control, specify the evidence artifact, assign the control owner, set the testing cadence, and track current implementation status. Identify the 5 highest-risk controls where evidence is missing or testing is overdue and define the remediation plan for each.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 15 — Data-Driven PM & Analytics  (OFFSET 14, order_index = 15)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 14;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M15 chapter not found'; END IF;

  -- Lesson 1: PM Dashboard Design & KPI Selection
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'PM Dashboard Design & KPI Selection',
      'description', 'Designing PM dashboards that drive decisions: which KPIs matter, what visualizations communicate, and how to avoid vanity metrics. Produces a PM Dashboard Template.',
      'transcript', 'PM DASHBOARD DESIGN & KPI SELECTION

A project dashboard has one job: enable faster, better decisions. If your dashboard is looked at, acknowledged, and filed away without anyone making a decision, it has failed -- regardless of how good it looks. This lesson teaches you to design dashboards that drive action.

VANITY METRICS VS. ACTIONABLE METRICS

Vanity metrics make you feel good about the project without enabling a decision. Total tasks completed. Number of meetings held. Pages of documentation written. These metrics go up over the life of any project regardless of whether the project is heading toward success or disaster.

Actionable metrics answer the question "what should we do differently?" When schedule variance is -15% (2 weeks behind), the decision is: recover by adding resources, descope, or negotiate deadline extension. When cost performance index is 0.83, the decision is: investigate root cause and correct before variance grows. Each metric should map to a specific management action.

THE 5-KPI RULE

Executive dashboards should have no more than 5 KPIs per audience view. More than 5 KPIs, and the audience does not know where to look. Five KPI categories for PM dashboards:

Schedule health: Schedule Performance Index (SPI = Earned Value divided by Planned Value). SPI greater than 1.0 is ahead of schedule, less than 1.0 is behind. Show as trend over 4 periods.

Cost health: Cost Performance Index (CPI = Earned Value divided by Actual Cost). CPI less than 1.0 means overspent for work completed. Supplemented by Estimate at Completion.

Scope health: number of approved scope changes in the current period; percentage of requirements added vs. baseline. Rising scope addition without proportional schedule or budget adjustment is a warning signal.

Quality health: defect density trend; number of open critical defects; sprint Definition of Done compliance rate.

Risk health: number of risks increasing in score; percentage of high-probability/high-impact risks with active mitigation.

DASHBOARD DESIGN PRINCIPLES

RAG status (Red-Amber-Green) for each KPI provides instant exception identification. Define precise RAG thresholds: SPI at or above 0.95 = Green; SPI 0.85-0.95 = Amber; SPI below 0.85 = Red.

Trend arrows show direction of change (improving, stable, declining). A metric in Amber that is trending green is different from an Amber metric trending red -- both require different PM responses.

Visualization selection: Gantt for timeline and milestone status. Burndown for sprint progress. Waterfall chart for cost variance by category. Heat map for risk register status.

DESIGN PROCESS

For each KPI you consider including: ask "What specific decision does this KPI enable?" If the answer is vague, reconsider. If the answer is specific ("If cost variance exceeds 10%, I will trigger a budget review with the sponsor"), include it.

Example: project dashboard shows 3 green, 1 amber, 1 red KPIs. Red is budget variance at +18% of baseline with a 3-month trend of accelerating variance. Estimate at Completion has grown from $2.0M to $2.36M. PM presents three recovery options to the steering committee: descope the reporting module ($150K saving), reduce contractor headcount ($180K saving), or accept the overrun and request supplemental budget.

DELIVERABLE: PM Dashboard Template
Design a PM Dashboard Template for your project. Define 5 KPIs -- one per health category. For each: name, metric formula, data source, RAG thresholds, visualization type, and decision map (what action is triggered by each RAG status). Mock up the dashboard layout. Define the update cadence and distribution list.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Burndown, Velocity, Throughput & Flow Metrics
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Burndown, Velocity, Throughput & Flow Metrics',
      'description', 'Leading indicators vs. lagging indicators: burndown, velocity, cycle time, throughput, and cumulative flow. Produces a Metrics Selection Guide.',
      'transcript', 'BURNDOWN, VELOCITY, THROUGHPUT & FLOW METRICS

Project metrics can be divided into leading indicators -- metrics that predict future performance -- and lagging indicators -- metrics that report past performance. Most traditional project metrics (cost variance, schedule variance, earned value) are lagging: they tell you what happened. Leading indicators tell you what is about to happen. A PM who tracks only lagging indicators is always managing in the rear-view mirror.

SPRINT BURNDOWN

The sprint burndown chart plots planned remaining work against actual remaining work each day of the sprint.

Reading a burndown: the ideal line descends linearly from total sprint commitment to zero on the last day. Actual work remaining should track close to the ideal line.

Warning signals: flat burndown (actual line is horizontal) -- work is not being completed; blockers may exist. Upward burndown -- scope has been added mid-sprint without removing equivalent scope. Steep burndown at the end of sprint -- team is rushing, which typically means quality shortcuts.

The burndown is a leading indicator within the sprint: a flat burndown on Day 5 of a 10-day sprint predicts a partial sprint completion -- act now, not on Day 10.

RELEASE BURNUP

The release burnup chart tracks completed work against total scope over the release timeline. Unlike a burndown, a burnup makes scope changes visible: the total scope line moves up when scope is added, rather than hiding scope creep.

If the gap between "work done" and "total scope" is not closing fast enough to meet the release date, the burnup makes this visible weeks in advance.

VELOCITY

Velocity is story points completed per sprint. Use a 3-sprint rolling average to smooth noise. A team with sprint velocities of 28, 34, 32, 30, 36, 31 has a rolling average of approximately 32 points. Forecasting with 32 rather than last sprint''s 36 produces a more reliable release plan.

Velocity is a lagging indicator. Leading indicators of future velocity changes: team composition changes (additions or departures shift velocity within 2 sprints), technical debt levels (rising debt reduces velocity), sprint goal clarity (unclear goals reduce velocity).

THROUGHPUT

Throughput is the number of work items completed per time period -- useful for Kanban teams that do not estimate in story points. Track weekly throughput as a rolling 4-week average. Advantage over velocity: throughput does not require estimation.

CYCLE TIME

Cycle time measures the time from when a work item is actively started to when it is done. Use percentile reporting, not averages. If the 85th percentile cycle time for user stories is 11 days, you can commit to stakeholders: "85% of stories will be done within 11 working days of being started."

Cycle time is a leading indicator of throughput: rising cycle time predicts falling throughput before the throughput metric shows it.

CUMULATIVE FLOW DIAGRAM

The Cumulative Flow Diagram (CFD) stacks the count of items in each workflow state (Backlog, In Progress, In Review, Done) over time as area bands.

Steady, parallel bands = healthy flow. When the "In Review" band expands over 2 weeks, work is accumulating in review faster than it is exiting. The bottleneck is the review step. Intervention: add code review capacity or set a review SLA.

DELIVERABLE: Metrics Selection Guide
Build a Metrics Selection Guide for your project. For each metric (sprint burndown, release burnup, velocity, throughput, cycle time, CFD): specify whether it is leading or lagging, what it predicts or reports, the calculation method, data source, update frequency, and what management action each signal state triggers. Recommend the right set for your delivery model (Scrum vs. Kanban vs. hybrid).'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Predictive Analytics & Trend Analysis for PMs
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Predictive Analytics & Trend Analysis for PMs',
      'description', 'Trend analysis, regression to the mean, and leading vs. lagging indicators: how to forecast before the schedule slips. Produces a Trend Analysis Framework.',
      'transcript', 'PREDICTIVE ANALYTICS & TREND ANALYSIS FOR PMs

The difference between a reactive PM and a proactive PM is the ability to see problems coming before they arrive. Trend analysis is the discipline that enables this. Instead of responding to a schedule slip after it happens, you identify the trend toward a slip 4-6 weeks in advance and intervene while there is still time to act.

THE S-CURVE FOR PROJECT PROGRESS

Every healthy project follows an S-curve for cumulative progress: slow start (ramp-up, mobilization, dependency resolution) > accelerating middle phase (full team productive, velocity high) > tapering near completion (integration testing, refinement, punch list work).

Plot your actual cumulative progress against the planned S-curve each week. Early deviations are leading indicators of delivery risk:

Starting too slowly (actual curve below planned in early weeks): mobilization delays, dependency issues, scope ambiguity. A project that starts 15% behind rarely catches up without structural intervention.

Flattening in the middle (actual curve flattens when it should still be rising): team capacity issue, technical blockers, scope creep consuming capacity. Most dangerous pattern because it is often invisible until milestones are missed.

Plateau too early (S-curve completes at 85% and stops): scope disputes, incomplete acceptance criteria, defect backlogs preventing completion.

EVM-BASED FORECASTING

Earned Value Management provides rigorous project forecasting:

Cost Performance Index (CPI) = Earned Value (EV) divided by Actual Cost (AC). CPI = 0.87 means for every $1 spent, $0.87 of planned work is completed -- 13% cost inefficiency.

Schedule Performance Index (SPI) = EV divided by Planned Value (PV). SPI = 0.92 means 92% of planned work has been completed in terms of value delivered.

Estimate at Completion (EAC) = Budget at Completion (BAC) divided by CPI. If BAC = $2.3M and CPI = 0.87, EAC = $2.64M. Projected overrun: $340K.

Example: cost trend analysis shows CPI declining month by month -- Month 1: 1.05, Month 2: 0.98, Month 3: 0.93, Month 4: 0.87. A 4-month declining CPI trend is systemic, not noise. EAC recalculated at Month 4: $2.64M vs. $2.3M baseline. PM escalates to sponsor with two recovery options before Month 5.

TREND ANALYSIS TECHNIQUES

Moving average: smooth weekly or sprint metric noise by calculating a 3- or 4-period moving average. One bad sprint is noise; three bad sprints is a trend.

Linear regression: if you have 8+ data points on a project metric, fit a linear trend line. The slope tells you the direction and rate of change. A CPI trending from 1.0 to 0.87 over 4 months has a slope of -0.0325 per month -- projecting to 0.74 at Month 8 without intervention.

Control charts for trend detection: seven consecutive data points trending in one direction (Rule 6 in Western Electric Rules) signals a non-random trend in a process metric.

REGRESSION TO THE MEAN

One important cognitive bias to guard against: regression to the mean. After an exceptionally bad sprint (velocity = 18 vs. baseline 32), the next sprint will often be better simply by chance -- not because you intervened effectively. Require three consecutive data points above the baseline before concluding an intervention worked.

DELIVERABLE: Trend Analysis Framework
Build a Trend Analysis Framework for your project. Define: the 3 metrics you will track with trend analysis; your S-curve baseline and current actual progress comparison; EAC calculation from your latest EVM data; moving average calculation for your primary performance metric; and the threshold that will trigger a formal escalation (e.g., CPI below 0.85 for 2 consecutive months, or SPI declining 3 consecutive sprints).'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Decision Intelligence: Data-Driven PM Decisions
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Decision Intelligence: Data-Driven PM Decisions',
      'description', 'Decision trees, expected value, and structured decision-making under uncertainty. Produces a Decision Intelligence Playbook.',
      'transcript', 'DECISION INTELLIGENCE: DATA-DRIVEN PM DECISIONS

Project managers make dozens of decisions every week. Most are made intuitively, based on experience and pattern recognition. Some decisions are complex enough, consequential enough, or contested enough that intuition alone is insufficient -- you need a structured analytical framework. Decision intelligence is the discipline of applying data and structured reasoning to make better decisions under uncertainty.

DECISION TREES AND EXPECTED MONETARY VALUE

A decision tree maps a decision through its possible outcomes, assigning probabilities and monetary values to each branch. The math produces an Expected Monetary Value (EMV) that allows you to compare options objectively.

Notation: decision nodes are squares (you choose). Chance nodes are circles (nature chooses, with probabilities). Terminal nodes show the monetary outcome.

EMV formula: EMV = sum of (probability x value) for each branch at a chance node.

Vendor selection example: you must choose between two vendors for a critical integration.

Vendor A: 70% probability of on-time delivery (+$200K value, avoided delay cost) and 30% probability of delivery delay (-$150K value, delay cost). EMV(A) = (0.70 x $200K) + (0.30 x -$150K) = $140K - $45K = $95K.

Vendor B: 90% probability of on-time delivery (+$150K value) and 10% probability of delay (-$200K value). EMV(B) = (0.90 x $150K) + (0.10 x -$200K) = $135K - $20K = $115K.

Decision: Vendor B, despite lower upside, has higher EMV ($115K vs. $95K) due to lower delay probability. The decision tree makes a counterintuitive choice analytically defensible.

MULTI-CRITERIA DECISION ANALYSIS (MCDA)

Not all decisions reduce to monetary values. MCDA steps: define criteria (5-8 maximum), weight each criterion (sum to 100%), score each option on each criterion (1-5 scale), calculate weighted score, select highest-scoring option.

For the vendor example, adding criteria for "vendor relationship quality" and "cultural fit" alongside financial EMV provides a more complete decision basis.

THE RAPID DECISION FRAMEWORK

For organizational decisions involving multiple stakeholders, use the RAPID framework to clarify decision rights:

Recommend: who develops the recommendation and supporting analysis? (PM)
Agree: who must agree before the recommendation is finalized? (Technical lead, Finance)
Perform: who will execute the decision once made? (PM and project team)
Input: who has relevant information that should inform the decision? (Users, vendor, Legal)
Decide: who makes the final call? (Project Sponsor)

Unclear decision rights cause delay. "Who owns this decision?" is one of the most common project blockers. RAPID answers it in advance.

THE PRE-MORTEM TECHNIQUE

Before finalizing a high-stakes decision, run a pre-mortem. Instructions: "Imagine it is 12 months from now. The decision we made today failed catastrophically. Write down what went wrong." The pre-mortem surfaces risks that optimism bias suppresses. Failure is assumed -- the task is to explain it, not predict it. This reframes the task and unlocks more candid risk identification.

REVERSIBILITY CLASSIFICATION

Jeff Bezos''s two-door framework simplifies decisions:

One-way door decisions: irreversible or very difficult to reverse (vendor contract signature, technology platform choice, team restructuring). These deserve rigorous analysis -- slow down, apply MCDA, use pre-mortem.

Two-way door decisions: easily reversible (sprint prioritization, short-term resource allocation, communication approach). Speed matters more than rigor here -- make a reasonable decision quickly, observe results, adjust.

Most PM decisions are two-way doors treated as one-way doors. Slowing down for a two-way door wastes time. Speeding through a one-way door creates expensive regret.

DELIVERABLE: Decision Intelligence Playbook
Build a Decision Intelligence Playbook for your project. Identify the three most consequential upcoming decisions. For each: classify as one-way or two-way door; apply the appropriate framework (decision tree, MCDA, or intuition-with-review); apply RAPID to clarify decision rights; run a pre-mortem. Document the decision, the analysis, and the rationale for the choice made.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: AI-Powered PM Analytics & Real-Time Project Intelligence
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI-Powered PM Analytics & Real-Time Project Intelligence',
      'description', 'AI tools for real-time project monitoring: anomaly detection, cost prediction, and risk signals from project data. Produces an AI PM Analytics Setup Guide.',
      'transcript', 'AI-POWERED PM ANALYTICS & REAL-TIME PROJECT INTELLIGENCE

Traditional project analytics are backward-looking: you gather data at the end of the week, analyze it over the weekend, and report status on Monday. By the time you are acting on the information, conditions have changed. AI-powered PM analytics change this to a near-real-time feedback loop -- anomalies are detected as they emerge, forecasts are updated continuously, and risk signals surface automatically.

AI ANOMALY DETECTION

ML anomaly detection models learn the normal pattern of project metrics and flag deviations in real time.

Example: your team has maintained an average daily story point completion rate of 1.6 points over 6 sprints. On Day 4 of Sprint 7, the daily rate drops to 0.4 -- a 75% reduction. An anomaly detection model flags this within hours. You investigate: two senior engineers were pulled to address a production incident on another project. You escalate the cross-project resourcing conflict immediately, 5 days before it would have appeared in the Friday velocity report.

The value is time: catching a velocity drop on Day 4 vs. Day 10 of a 10-day sprint gives you 6 extra days to intervene. In a sprint context, that is the difference between recovery and failure.

AI NATURAL LANGUAGE STATUS REPORTING

PMs spend 2-5 hours per week writing status reports. AI can generate a first draft in 2 minutes from structured project data.

Workflow: connect project data sources (Jira for task status, financial system for actuals, risk register) to a reporting template. Feed structured data to an AI with a prompt: "Generate a weekly project status report narrative from this data. Highlight the most important positive development, the most significant risk, and the decision required from the steering committee." The AI produces a narrative. You review, edit for accuracy and organizational tone, and distribute. Total PM time: 15 minutes vs. 90 minutes.

AI COST FORECASTING

AI cost forecasting uses regression on project actuals combined with remaining scope estimates to produce an Estimate at Completion range with confidence intervals.

Example output: "Based on current CPI of 0.87 and 4-month declining trend, projected EAC is $2.64M (70% confidence interval: $2.45M-$2.85M)." The confidence interval is more useful than a point estimate -- it tells the sponsor the range of outcomes to plan for.

RISK SIGNAL DETECTION

AI can extract risk signals from unstructured project data:

Meeting transcript analysis: NLP models processing sprint review and team meeting transcripts identify repeated concerns, unresolved questions, and sentiment shifts. If "blocked by vendor" appears in meeting notes for 3 consecutive sprints, the AI flags a persistent vendor dependency risk -- even if the risk register has not been updated.

Email and chat sentiment analysis: declining sentiment in project team communications (Teams, Slack) correlates with team health issues that surface in performance 2-3 sprints later. Early detection enables PM intervention.

Integration architecture for AI PM analytics: data ingestion (Jira, Confluence, financial system, meeting transcripts) > ML models (anomaly detection, sentiment analysis, cost forecasting) > PM dashboard with AI narrative > weekly distribution.

SPECIFIC TOOLS

Microsoft Copilot for Project integrates AI into the MS Project interface -- generates schedule drafts, risk summaries, and resource optimization suggestions. Asana AI Intelligence generates project health insights automatically. Monday.com AI provides workload analysis and risk flagging. For custom analytics: Azure ML combined with Power BI provides a full AI analytics stack.

DELIVERABLE: AI PM Analytics Setup Guide
Design an AI PM analytics setup for your project. Define: data sources and integration points; anomaly detection metrics and alert thresholds; AI status report template and generation workflow; cost forecasting model inputs and confidence interval approach; risk signal sources (meeting transcripts, communications, risk register age); and specific AI tools you will implement in the next 30 days. Document the full workflow from data source to PM action.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;
-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 16 — Executive Communication & Strategic Leadership  (OFFSET 15, order_index = 16)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 15;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M16 chapter not found'; END IF;

  -- Lesson 1: C-Suite Communication & Board Reporting
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'C-Suite Communication & Board Reporting',
      'description', 'What C-suite executives want in a project update: the one-page status brief, decision requests, and the 3-minute verbal update. Produces an Executive Communication Framework.',
      'transcript', 'C-SUITE COMMUNICATION & BOARD REPORTING

Most project status reports are written for the person who wrote them, not for the executives who receive them. They are full of operational detail, technical context, and defensive explanation. They bury the information executives actually need: is this on track? What is the risk? What decision do you need from me? This lesson teaches you to communicate with C-suite precision.

THE BLUF PRINCIPLE

BLUF -- Bottom Line Up Front -- is the military communication standard adopted by top-tier management consultancies and executive teams. State your conclusion first. Then provide supporting detail for those who want it. Never make an executive read three paragraphs before discovering that the project is in trouble.

Contrast these two opening sentences:
"We have been working through a number of challenges this quarter related to the integration timeline and vendor delivery, and while we have made good progress on the CRM configuration..."
versus
"Project Orion is Amber. We are on schedule but 12% over budget. I need a decision on descoping the reporting module to protect the Q3 launch date."

The second version respects the executive''s time and gets to the point. Executives have 8 other projects on their agenda. Make the first 10 seconds count.

THE ONE-PAGE STATUS BRIEF

The one-page status brief is the standard executive project report. It has six sections:

Project name, sponsor, and date: identification and accountability in one line.

RAG status with trend: a single traffic light (Red/Amber/Green) and a directional arrow (improving, stable, declining). The RAG status should reflect your honest assessment, not the one you wish were true. An Amber status trending red is more honest and more useful than a Green status that will be Red next week.

Three bullets on progress: the three most significant achievements since the last report. Not a list of everything that happened -- the three things that matter most to the business.

Three bullets on issues and risks: the three most significant issues or risks requiring executive awareness. Each should have a current status and a recommended action or decision.

Decision required: a single, specific decision the executive needs to make. "Approve the 3-week timeline extension to accommodate the additional data migration scope." If no decision is needed this period, state "No decision required -- for information only."

Next milestone: the next key milestone with its date and current forecast. "Integration testing complete: Target 15 July; Forecast: 15 July (on track)."

THE 3-MINUTE VERBAL UPDATE

When you have 5 minutes in a steering committee or executive meeting, structure your verbal update:

30 seconds -- context: one sentence on what the project is and where you are in its lifecycle. Assume the executive has 7 other projects on their mind and may not remember.

60 seconds -- status: RAG status, the one most important development since last meeting, and whether you are on track for the next milestone.

60 seconds -- risk/issue: the one issue or risk that requires executive awareness. State the risk, its potential impact, and what you are doing about it.

30 seconds -- decision: state the specific decision needed, the options you have analyzed, and your recommendation. Be direct: "I recommend we extend the deadline by 3 weeks. The alternative is descoping the analytics module, which I do not recommend because it is the primary reason Finance sponsored this project."

The 3-minute structure disciplines you to be selective. If you cannot state the most important risk in 60 seconds, you have not synthesized your thinking sufficiently.

THE NO-SURPRISES RULE

Executives hate surprises. A problem surfaced at a steering committee that the PM knew about 2 weeks earlier is a trust-destroying failure. The no-surprises rule: if a status change is significant enough to change the RAG status, communicate it to the sponsor within 24 hours -- not at the next scheduled report. A brief email ("I wanted to flag this before our scheduled meeting") demonstrates PM maturity and builds executive trust.

DELIVERABLE: Executive Communication Framework
Write an Executive Communication Framework for your project. Include: one-page status brief template with your project''s current data filled in; 3-minute verbal update script for your next steering committee; RAG status thresholds defined for your project''s schedule, cost, and risk dimensions; no-surprises communication protocol (what triggers an out-of-cycle update and how it is communicated).'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Political Intelligence & Organizational Navigation
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Political Intelligence & Organizational Navigation',
      'description', 'Organizational politics is reality. Mapping influence networks, building allies, and navigating competing agendas. Produces a Political Navigation Map.',
      'transcript', 'POLITICAL INTELLIGENCE & ORGANIZATIONAL NAVIGATION

Organizational politics is not something that happens in bad organizations. It happens in every organization with more than one person and one priority. The project manager who refuses to engage with organizational politics -- who insists that the best plan should win on its merits -- will be perpetually surprised by decisions that seem irrational. Political intelligence is the ability to read and navigate the real power dynamics in your organization to achieve outcomes that serve your project and your stakeholders.

WHAT POLITICAL INTELLIGENCE IS NOT

Political intelligence is not manipulation. It is not deceiving stakeholders, hiding bad news, playing people against each other, or advancing your interests at others'' expense. Those behaviors destroy trust and, ultimately, careers.

Political intelligence is reading: understanding who has real power (formal and informal), what each person''s success metrics and career incentives are, where interests align and where they conflict, and how decisions actually get made.

Political intelligence is navigation: building relationships before you need them, framing proposals in terms of others'' interests, finding the coalition that enables your project to succeed.

POWER MAPPING

Start by mapping formal authority: who has budget approval? Who can mandate cross-functional cooperation? Who sits above your sponsor in the organizational hierarchy? Formal authority matters, but it is incomplete.

Then map informal influence: who do decision-makers listen to before making major calls? Who is the trusted technical voice in the room? Who has accumulated credibility through past successes? Informal influencers often have more impact on decisions than their title suggests.

The 2x2 power-interest matrix: plot each key stakeholder on two axes -- power (high/low) and interest in your project (high/low). High power, high interest: manage closely. High power, low interest: keep satisfied. Low power, high interest: keep informed. Low power, low interest: monitor.

INFLUENCE NETWORK MAPPING

Beyond the 2x2, map the influence network: who influences whom? If VP of Operations listens to the Head of Finance before making technology decisions, then winning over the Head of Finance is a prerequisite for winning over the VP of Operations.

Draw the network as arrows between people: an arrow from A to B means "A influences B''s decisions on this type of issue." Identify the most central nodes -- the people who influence many others. These are your highest-leverage relationship investments.

COMPETING AGENDAS

Every significant organizational decision intersects with multiple personal agendas: budget competition, territory protection, career advancement, legacy projects, personal relationships. Recognizing these agendas does not make you cynical -- it makes you realistic.

The navigation strategy: find the shared interest that sits above the competing agendas. If VP A and VP B both have KPIs tied to customer satisfaction, frame your project in terms of customer satisfaction outcomes. The shared KPI creates a basis for alignment that the competing budget agendas cannot undermine.

BUILDING AIR COVER

Your executive sponsor is your most important political asset. Cultivate the relationship actively: brief your sponsor before steering committee meetings, surface issues to them before they reach others, give them early warning of political tensions. A well-briefed, engaged sponsor can shield your project from political attacks and resource raids that would derail a less well-positioned PM.

DELIVERABLE: Political Navigation Map
Draw a Political Navigation Map for your project. Include: power-interest matrix for your 8 most important stakeholders; influence network diagram with arrows; competing agendas analysis for your two most challenging stakeholder conflicts; shared interest identification that can bridge each conflict; your sponsor engagement strategy; and your planned relationship investment for the next 30 days.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Influencing Without Authority
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Influencing Without Authority',
      'description', 'Persuasion science, coalition building, and getting cross-functional commitment without line authority. Produces an Influence Playbook.',
      'transcript', 'INFLUENCING WITHOUT AUTHORITY

Project management is fundamentally about getting work done through people you do not manage. The network engineer, the data analyst, the vendor account manager, the finance business partner -- none of them report to you. Yet your project''s success depends on their discretionary effort. The ability to influence without authority is the most essential PM skill that is never listed in a job description.

CIALDINI''S SIX PRINCIPLES OF INFLUENCE

Robert Cialdini''s research, published in Influence: The Psychology of Persuasion, identified six principles through which humans are reliably influenced. Used ethically -- transparently, in the service of genuine shared benefit -- these principles are the foundation of effective professional influence.

Reciprocity: people feel obligated to return favors. If you invest time helping someone else''s project, they feel a genuine pull to help yours. Build a practice of giving before asking: share information, make introductions, offer your expertise to others'' problems. Then, when you need something, the relationship has credit.

Commitment and Consistency: once people have publicly committed to a position or action, they feel internal pressure to remain consistent. The implication: get small agreements early. If a stakeholder agrees in a one-on-one that your project''s goal is valuable, they will feel pressure to support it in group settings. Get them on record.

Social Proof: people look to what others are doing when uncertain. "The operations team has already committed to this approach" is more influential than "I think this is a good approach." Build early adopter momentum so that skeptics see their peers moving before they decide.

Authority: people defer to credible experts. Establish your technical credibility (know your domain), cite recognized experts and frameworks, and bring in external validation when internal credibility is insufficient.

Liking: people say yes more easily to people they like and trust. Similarity, genuine interest in the other person, and warmth all increase liking. This is not manipulation -- it is a reminder that relationships are the substrate of organizational effectiveness.

Scarcity: people value things more when they perceive limited availability. A decision window that is closing, a resource that is available now but may not be in Q3, an early-mover advantage -- these create appropriate urgency when they are real.

INFLUENCE VS. MANIPULATION

The line between influence and manipulation is transparency and respect for the other person''s autonomy. You are influencing when you present accurate information, make a genuine case for your position, and respect the other person''s right to disagree. You are manipulating when you use deception, exploit cognitive biases against someone''s interests, or create artificial pressure based on false information.

Manipulation destroys trust when discovered -- and in organizations, it is usually discovered. Influence builds relationships that compound over a career.

THE YES LADDER

Start with small asks before large ones. If the first thing you ask of a cross-functional colleague is to dedicate 20% of their team''s capacity to your project for 6 months, the ask feels enormous. If you first ask for 2 hours of their time for a workshop, then their input on a decision, then a brief presentation to their team, each "yes" makes the next ask feel smaller.

COALITION BUILDING

Build your coalition before you need it. Identify 3-5 people who will benefit from your project''s success. Engage them individually first, in conversations that focus on their interests and their concerns. When you have built individual alignment, bring the coalition together. Peer advocacy is far more powerful than PM advocacy.

DELIVERABLE: Influence Playbook
Write an Influence Playbook for your project. Identify your 3 most important influence challenges (the person or group whose commitment you most need and do not have). For each: analyze which Cialdini principles are most relevant; identify the shared interest or benefit; design the engagement approach; plan the ask sequence using the yes ladder. Document your reciprocity investments for the next 30 days.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Crisis Communication & Project Recovery
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Crisis Communication & Project Recovery',
      'description', 'Project in crisis: triage, communication, recovery planning, and rebuilding stakeholder confidence. Produces a Project Recovery Framework.',
      'transcript', 'CRISIS COMMUNICATION & PROJECT RECOVERY

Every experienced PM has been here: the project is in trouble. A critical integration has failed 6 weeks before launch. The budget is 25% over baseline with no reserve remaining. A key vendor has declared insolvency. The question is not whether you will face a project crisis -- it is whether you know what to do when you do.

RECOGNIZING THE CRISIS THRESHOLD

Not every problem is a crisis. A crisis is a situation where the project''s fundamental delivery commitment is at risk: the deadline, the budget ceiling, or the quality standard that makes the deliverable acceptable. Three signal thresholds:

Schedule variance exceeding 20%: a 2.5-month project is 3 weeks late. This is not a routine status update -- this requires a recovery plan.

Cost variance exceeding 15% of baseline: budget overrun that cannot be absorbed by management reserve. This triggers executive notification and recovery options analysis.

Stakeholder trust score declining sharply: when key stakeholders are losing confidence in the project''s ability to deliver, the crisis is relational even before it is financial or schedule-based. Trust crises can be harder to recover from than schedule crises.

TRIAGE: THE STOP FRAMEWORK

When a crisis breaks, the first imperative is to stop making it worse. The STOP framework:

Stop: halt any actions that might compound the problem. If an integration is failing, pause the dependent work stream until root cause is understood.

Take stock: gather facts. What exactly happened? When? What is the current state? What is the impact on schedule, cost, and scope? Do not communicate before you have facts.

Options analysis: identify 2-3 realistic recovery options. For each: what is the cost (time, budget, scope)? What is the probability of success? What is the risk if it fails?

Proceed with plan: select the recovery option with the best risk-adjusted outcome, brief your sponsor, and communicate to stakeholders.

CRISIS COMMUNICATION PRINCIPLES

Communicate quickly: silence in a crisis is interpreted as incompetence or deception. Within 24 hours of recognizing the crisis, brief your sponsor. Do not wait until you have all the answers -- brief with what you know and what you do not yet know.

Own the narrative: the worst outcome is stakeholders learning about the crisis from someone other than you. You control the story only if you tell it first, honestly, and proactively.

Focus on solution, not blame: one sentence on what happened, one sentence on current impact, three sentences on what you are doing about it. Do not spend meeting time explaining how it happened -- spend it on recovery.

Update frequently during crisis: daily or twice-weekly updates during the active crisis phase. When you stop communicating, stakeholders assume things are getting worse.

RECOVERY PLAN STRUCTURE

A project recovery plan has five components:

Root cause analysis: what fundamentally caused this situation? The Fishbone diagram and 5 Whys are useful here. Without root cause clarity, recovery actions treat symptoms, not causes.

Corrective actions: specific actions, owners, and completion dates. Each corrective action directly addresses a root cause.

Revised baseline: updated schedule, budget, and scope reflecting the recovery scenario. Be realistic -- an aggressive recovery plan that fails a second time is more damaging than a conservative plan that delivers.

Stage gates for recovery: explicit milestones that confirm the recovery is on track. Missing a recovery stage gate is an escalation trigger.

Revised risk register: the crisis has changed your risk profile. Update the risk register to reflect what you now know.

REBUILDING STAKEHOLDER CONFIDENCE

Trust rebuilds through demonstrated competence on small commitments. Set short-horizon recovery milestones (2-3 weeks) and hit them. Each milestone hit is evidence that the recovery is real. Announce each hit proactively. Over 6-8 weeks of consistent delivery on recovery milestones, stakeholder confidence rebuilds.

DELIVERABLE: Project Recovery Framework
Write a Project Recovery Framework for a crisis scenario on your current or past project. Include: crisis threshold definitions; STOP triage protocol; root cause analysis using 5 Whys; three recovery options with trade-off analysis; revised project baseline; recovery stage gates; and stakeholder communication plan for the crisis and recovery phases.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Building Your PM Executive Presence & Thought Leadership
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Building Your PM Executive Presence & Thought Leadership',
      'description', 'Thought leadership, LinkedIn strategy, conference speaking, and building the PM brand that opens doors. Produces a PM Personal Brand Plan.',
      'transcript', 'BUILDING YOUR PM EXECUTIVE PRESENCE & THOUGHT LEADERSHIP

Executive presence is often described as an intangible quality -- something you either have or you do not. This is wrong. Executive presence is a set of learnable behaviors: how you prepare, how you communicate, how you carry yourself in high-stakes situations, and how you build your reputation over time. This lesson makes it concrete.

THE FOUR COMPONENTS OF EXECUTIVE PRESENCE

Communication clarity: can you explain a complex situation in 60 seconds? Can you answer a difficult question directly without hedging? Clarity signals confidence and competence. Practice the "elevator answer" for your project: if you stepped into an elevator with your CEO, you should be able to answer "How is the project going?" with a crisp, informative answer before the doors open.

Confident body language: eye contact, upright posture, deliberate pace of speech. These are signals that others read unconsciously. Nervousness is contagious -- if you look uncertain, your audience becomes uncertain. The physiological technique: before a high-stakes meeting, hold an expansive posture for 2 minutes (power pose) and take 5 slow, deep breaths. Both measurably reduce cortisol and increase calm.

Preparedness: the most reliable source of executive presence is knowing your material cold. A PM who knows every risk, every number, and every stakeholder position walks into a steering committee differently from one who is reading from slides. Prepare for the 5 hardest questions you might be asked and rehearse the answers.

Gravitas -- the ability to command a room: gravitas comes from a track record of delivering. You cannot fake it. Build it by delivering on commitments, being honest about problems before they blow up, and demonstrating sound judgment over time.

PM THOUGHT LEADERSHIP

Thought leadership is the professional reputation you build beyond your current employer. It is the reason a recruiter contacts you rather than the other candidate, and the reason a conference accepts your speaking proposal.

Choose a niche: the most effective thought leadership is specific. "AI-augmented project delivery" is better than "project management." "Scaling Agile in regulated industries" is better than "Agile." Your niche should sit at the intersection of what you know deeply, what you care about genuinely, and what the market needs.

Build content assets: write case studies from your project experience (sanitized as needed). Develop a framework or checklist. Write a perspective piece on where the PM profession is heading. These become your thought leadership portfolio.

LINKEDIN STRATEGY FOR PMs

LinkedIn is the primary professional platform for PM visibility. The algorithm rewards consistency and engagement.

Headline formula: Role | Value Proposition | Differentiator. Example: "Senior PM | Delivering AI Transformation Projects | PMP + SAFe 5 | $40M+ portfolio." Your headline determines whether you appear in recruiter searches.

About section: 3-4 sentences. Who you are, what you specialize in, what you typically achieve (with metric), and a call to action. Write in first person.

Experience accomplishments: use CAR format (Challenge, Action, Result with metric) for each role. "Led CRM implementation across 4 countries serving 22,000 users, delivering 3 weeks ahead of schedule and $180K under budget. Sales conversion rate improved 28% within 90 days of go-live."

Content cadence: 2-3 posts per week. PM lessons learned posts generate the highest engagement. Frameworks with visuals perform well. Case studies (sanitized) establish credibility.

CONFERENCE SPEAKING PATH

Speaking at conferences establishes authority that no LinkedIn post can replicate. The path: local PMI chapter event (low risk, good practice, local network) > regional PMI conference > national PMI or Agile conference > keynote.

Your first speaking proposal should be based on a case study: a specific project, a specific problem, a specific approach, and a specific result. Concrete beats conceptual at every stage of the speaking path.

DELIVERABLE: PM Personal Brand Plan
Write a PM Personal Brand Plan. Include: your thought leadership niche and positioning statement; LinkedIn optimization checklist (headline, about section, 3 experience accomplishments); 8-week content calendar with post topics and formats; one conference speaking proposal outline; and your 12-month brand-building milestones.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 17 — Ethics, Governance & AI Responsibility  (OFFSET 16, order_index = 17)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 16;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M17 chapter not found'; END IF;

  -- Lesson 1: Project Governance Frameworks & Accountability Structures
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Project Governance Frameworks & Accountability Structures',
      'description', 'Governance models (PMO, steering committee, sponsor), decision rights, and accountability structures that keep projects on track. Produces a Project Governance Framework.',
      'transcript', 'PROJECT GOVERNANCE FRAMEWORKS & ACCOUNTABILITY STRUCTURES

Project governance is the system that ensures projects are accountable, decisions are made by the right people, and resources are used as intended. Without explicit governance, projects become political -- whoever has the most authority in the room wins the argument, regardless of whether they have the information to make the right call. Good governance replaces politics with process.

THE PURPOSE OF PROJECT GOVERNANCE

Four governance functions:

Accountability: someone is answerable for the project''s outcomes. Governance makes this explicit. The project sponsor is accountable to the business for ROI. The PM is accountable to the sponsor for delivery.

Decision rights: clear definition of who can decide what. Can the PM approve a $50K contract without sponsor review? Can a scope change be approved in a team meeting? Unclear decision rights cause delays and disputes.

Transparency: governance structures create forums where project status, risks, and issues are visible to those with oversight responsibility. Steering committees that are informed and engaged catch problems early.

Escalation paths: when a problem exceeds the PM''s authority to resolve, governance defines the escalation path. PM > Steering Committee > Sponsoring Group. Each level has defined authority and response time.

GOVERNANCE LAYERS

Project governance typically operates across three layers:

Project level: the PM and project team. Manages day-to-day delivery. Makes decisions within defined parameters (schedule float, minor scope clarifications, team assignments).

Program/steering committee level: the project steering committee, chaired by the sponsor or a senior executive. Reviews project status monthly, approves significant changes, resolves escalated issues. Membership: project sponsor, business representatives, key stakeholder leads.

Portfolio/organizational level: the Portfolio Review Board or equivalent. Reviews cross-project resource conflicts, strategic priority changes, and major scope or budget changes across the portfolio.

PMO TYPES

The Project Management Office (PMO) plays a support and governance role. Three models:

Supportive PMO: provides templates, tools, training, and guidance to project managers. Low governance authority. Appropriate when the organization is mature enough to manage projects without central oversight.

Controlling PMO: sets project management standards, requires compliance, audits project health, and provides expert guidance. Medium governance authority. Most common model in mid-large organizations.

Directive PMO: directly manages projects, assigns PMs, and controls project resources. High governance authority. Used in organizations with centralized project execution.

DECISION RIGHTS MATRIX

The most operationally important governance artifact is the Decision Rights Matrix -- a table mapping decision types to approval authority levels.

Example matrix:
Budget change less than $25K: PM can approve without escalation.
Budget change $25K-$100K: PM recommends; Sponsor approves.
Budget change greater than $100K: Sponsor recommends; Steering Committee approves.
Scope change less than 3 story points or 3 person-days: PM and Product Owner can approve.
Scope change 3-10 story points or 3-10 person-days: PM recommends; Steering Committee approves.
Scope change greater than 10 story points or major deliverable: Steering Committee recommends; Sponsor approves.
Vendor contract above $500K: Steering Committee recommends; CFO or equivalent approves.

When decision rights are clear, scope creep and budget drift are controlled structurally -- not by willpower.

GOVERNANCE CADENCE

Steering committee: monthly for most projects. Agenda: project status (RAG and trend), key risks, issues requiring decision, upcoming milestones, decisions from last meeting.

Sponsor 1:1: bi-weekly. More candid than the formal steering committee. Surface concerns and strategic context.

PMO health review: monthly. PMO reviews project metrics across the portfolio, flags concerns, and coordinates cross-project issues.

DELIVERABLE: Project Governance Framework
Write a Project Governance Framework for your project. Include: governance structure diagram (PM, steering committee, sponsor, PMO); RACI for key project decisions; Decision Rights Matrix; steering committee charter (members, cadence, agenda template, decision authority); escalation path and response time SLAs; and PMO engagement model.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Ethical AI in Project Delivery
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Ethical AI in Project Delivery',
      'description', 'Bias in AI-assisted decisions, transparency in AI-generated plans, and the PM responsibility when AI makes a recommendation. Produces an Ethical AI PM Checklist.',
      'transcript', 'ETHICAL AI IN PROJECT DELIVERY

AI tools are now embedded in the PM toolkit. They generate risk assessments, recommend resource allocations, predict schedule outcomes, and draft stakeholder communications. Each of these capabilities is genuinely useful -- and each carries ethical risks that PMs must manage. This lesson covers what those risks are and how to manage them responsibly.

AI BIAS IN PROJECT CONTEXTS

Machine learning models learn patterns from historical data. If the historical data contains biases, the model will encode and amplify them. For PMs, the relevant bias risks:

Training data bias in risk prediction: an AI model trained on historical project data from a specific industry, team size, or technology stack will make less reliable predictions for projects that differ from its training distribution. If your AI risk tool was trained on waterfall projects and you are managing an Agile program, its risk predictions may be systematically miscalibrated.

Algorithmic bias in resource allocation: AI resource allocation tools trained on historical team data may encode patterns from that history -- including any biases in how work was historically distributed. A tool that consistently recommends certain team members for high-visibility assignments may be perpetuating historical patterns rather than optimizing for project outcomes.

Automation bias: the most pervasive AI risk for PMs. Automation bias is the tendency to over-rely on AI output without adequate human review. When an AI system recommends a course of action, humans disproportionately accept it -- even when they would have identified the flaw if presented with the same information without the AI label. The antidote: before acting on any AI recommendation, ask "What would I conclude from this data if the AI had not been there to tell me?"

TRANSPARENCY REQUIREMENTS

You should be able to explain why any significant decision was made -- including decisions informed by AI. If an AI tool recommends deprioritizing a project and you cannot articulate the reasoning behind the recommendation, you cannot evaluate whether it is sound. You cannot defend it to a steering committee. And you cannot identify when it is wrong.

Practical rule: for any AI recommendation that affects scope, resources, schedule, or risk assessment, require the tool to surface the key factors driving the recommendation. If the tool cannot explain its reasoning, treat the recommendation with additional skepticism and require additional human validation before acting.

THE PM ACCOUNTABILITY PRINCIPLE

AI is a tool. The PM is accountable for the decision.

"The AI recommended it" is not an acceptable explanation for a bad project decision -- any more than "the spreadsheet calculated it" excuses a bad budget forecast. The PM must evaluate AI recommendations with the same critical judgment applied to any other input.

This accountability principle has a practical implication: build human review checkpoints into your AI-augmented workflows. For every high-stakes AI-assisted decision (risk classification, resource allocation, EAC forecast), require review by the PM and at least one other qualified person before the recommendation is acted upon.

HUMAN-IN-THE-LOOP DESIGN

For decisions with significant consequences, design your workflows to require human judgment, not just human rubber-stamping. The difference: a rubber stamp workflow presents the AI output and asks "approve or reject?" A genuine human-in-the-loop workflow requires the human to independently analyze the inputs, form a preliminary judgment, and then compare that judgment to the AI output.

AUDIT TRAIL

Document AI use in project decision-making. For significant decisions: note what AI tool was used, what the AI recommended, what the human reviewer concluded, and what was ultimately decided and why. This audit trail supports accountability, enables retrospective learning, and protects the PM when decisions are later questioned.

DELIVERABLE: Ethical AI PM Checklist
Build an Ethical AI PM Checklist for your project. For each AI tool you use: identify the potential bias risks specific to your project context; define the validation requirement before acting on AI output; specify who must review AI recommendations for high-stakes decisions; document the audit trail requirement; and define the conditions under which the AI recommendation should be overridden. Produce a one-page Ethical AI Use Policy for your project team.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Regulatory Compliance & Risk in Projects
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Regulatory Compliance & Risk in Projects',
      'description', 'Managing compliance requirements (GDPR, SOC2, FDA, HIPAA) as project constraints: requirements, controls, and evidence. Produces a Compliance Risk Register.',
      'transcript', 'REGULATORY COMPLIANCE & RISK IN PROJECTS

Regulatory compliance requirements are not optional features. They are constraints -- as fixed as a physical law of the project environment. A project that delivers all its features but fails a GDPR audit, a SOC2 review, or an FDA inspection has not delivered. Managing compliance as an integrated project constraint, not an afterthought, is a core PM competency in regulated industries.

COMPLIANCE RISK CATEGORIES

PMs encounter five major regulatory domains:

Data Privacy (GDPR, CCPA, PIPL): applies to any project that processes personal data of individuals in the European Union (GDPR), California (CCPA), or China (PIPL). Key project implications: Privacy by Design requirements mean privacy controls must be built into the architecture from the start, not retrofitted. Data minimization limits what data can be collected. Data Protection Impact Assessment (DPIA) is mandatory before processing high-risk data.

Security Frameworks (SOC2, ISO 27001): SOC2 applies to technology service providers. ISO 27001 is a globally recognized information security management standard. Both require documented policies, implemented controls, and ongoing evidence of operation. SOC2 Type II and ISO 27001 surveillance audits cover operational periods -- controls must work continuously, not just be installed.

Healthcare (HIPAA): applies to projects that create, receive, maintain, or transmit Protected Health Information (PHI). Technical safeguards: encryption (AES-256 at rest, TLS 1.2+ in transit), unique user identification, automatic logoff, audit controls.

Pharmaceutical (FDA 21 CFR Part 11): applies to electronic records and signatures in pharmaceutical, biotechnology, and medical device projects. Requirements include: audit trails, access controls, system validation, and electronic signature integrity.

Financial (SOX, PCI-DSS): SOX Section 404 requires internal controls over financial reporting. PCI-DSS applies to projects that handle payment card data: 12 control requirements covering network security, cardholder data protection, vulnerability management, and access control.

THE COMPLIANCE RISK REGISTER

A Compliance Risk Register tracks each regulatory requirement as a managed risk with its control, evidence, and testing status.

Structure for each entry:
Regulation and article: GDPR Article 33
Requirement: notification to supervisory authority within 72 hours of discovering a personal data breach
Control: incident response playbook defining 4-hour detection-to-DPO SLA; DPO responsible for supervisory authority notification within 72 hours of CISO declaration
Control owner: Chief Information Security Officer
Evidence artifact: incident response playbook (v2.1), DPO notification template, breach incident log
Testing method: quarterly tabletop exercise with timer; review of breach incident log
Last tested: Q1 2026
Status: Amber -- last tabletop exercise was 9 months ago, overdue by 1 quarter
Remediation: schedule Q2 tabletop exercise by [date]

INTEGRATING COMPLIANCE INTO PROJECT SCOPE

Compliance requirements must be in your WBS and schedule -- not on a separate compliance track that runs in parallel with no connection to project milestones.

At project initiation: run a regulatory requirement scan. Which regulations apply? What are the specific requirements? Build these into the scope baseline.

At sprint planning: compliance control implementation tasks are sprint backlog items. Evidence collection mechanisms are acceptance criteria on compliance-related stories.

At phase gates: compliance status is a gate criterion. A project cannot proceed from design to build without DPIA completed if required. A project cannot enter UAT without security scanning passed.

WORKING WITH LEGAL AND COMPLIANCE STAKEHOLDERS

Legal and Compliance are often perceived as blockers. Reframe the relationship: they are risk management partners. Engage them at project initiation, not at go-live when surprises are expensive.

Share your project scope and timeline. Ask: "What regulatory requirements apply? What evidence will auditors look for? What is the highest-risk control for our specific situation?" This conversation, held early, prevents late-stage compliance scrambles.

DELIVERABLE: Compliance Risk Register
Build a Compliance Risk Register for your project. Identify all applicable regulatory frameworks. For each regulation, list the top 5 most project-relevant requirements. For each requirement: define the control, control owner, evidence artifact, testing method, testing frequency, and current status. Identify the two highest-risk compliance items and define the remediation plan.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Sustainability & ESG Integration in Project Management
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Sustainability & ESG Integration in Project Management',
      'description', 'ESG criteria in project selection, carbon-aware scheduling, and sustainability reporting for projects. Produces a Project Sustainability Assessment.',
      'transcript', 'SUSTAINABILITY & ESG INTEGRATION IN PROJECT MANAGEMENT

Environmental, Social, and Governance (ESG) considerations are moving from corporate PR to board-level governance requirements. Institutional investors use ESG scores to make capital allocation decisions. Regulators in the EU (CSRD) and SEC (climate disclosure rules) are mandating sustainability reporting. Your projects are a unit of ESG exposure and ESG value creation. PMs who understand ESG are better positioned to serve their organizations and advance their careers.

THE THREE ESG DIMENSIONS

Environmental: the project''s impact on the natural environment. Carbon footprint (GHG Protocol Scope 1: direct emissions; Scope 2: purchased energy; Scope 3: value chain), energy consumption (data center power usage effectiveness, office energy), waste generation, water usage, and biodiversity impact for physical infrastructure projects.

Social: the project''s impact on people inside and outside the organization. Labor practices (supplier working conditions, fair pay, health and safety), community impact (local employment, disruption, noise), diversity and inclusion in project team composition, and data privacy impacts on individuals.

Governance: the project''s adherence to ethical standards and transparent accountability. Anti-corruption controls, conflict of interest management, data ethics, transparent reporting, and whistleblower protections in vendor contracts.

ESG CRITERIA IN PROJECT SELECTION

Add an ESG dimension to your portfolio scoring model. A 10-15% weight on ESG score alongside strategic fit, financial return, risk, and resource availability ensures ESG is a factor in investment decisions, not an afterthought.

ESG scoring rubric for projects:
Score 5 -- High positive ESG contribution: project reduces carbon emissions, improves working conditions, or enhances data privacy.
Score 3 -- Neutral ESG impact: project has no significant ESG implications.
Score 1 -- Negative ESG impact: project increases carbon footprint, creates social risk, or weakens governance controls.

CARBON FOOTPRINT CALCULATION FOR PROJECTS

Calculate your project''s carbon footprint using the GHG Protocol Corporate Standard:

Scope 1 -- Direct emissions: project team vehicle travel, on-site generator use. Calculated as fuel volume x emission factor (kg CO2e per liter).

Scope 2 -- Purchased energy: office space energy consumption during the project, data center compute allocated to the project. Calculated as kWh x grid emission factor (varies by geography and energy mix).

Scope 3 -- Value chain: air travel for team members and stakeholders (tonnes CO2e from flight distance x seat emission factor), supplier manufacturing emissions, hardware manufacturing and disposal.

Example: a data center migration project calculates that migrating 47 applications from on-premises servers (coal-powered grid) to a cloud provider powered by 100% renewable energy reduces the project''s associated Scope 2 emissions by 340 tonnes CO2e per year. This is a significant ESG co-benefit that strengthens the business case.

CARBON-AWARE SCHEDULING

For compute-intensive project activities (large-scale data processing, AI model training, rendering), schedule these tasks during periods when the electricity grid has high renewable energy availability. Tools like WattTime and Electricity Maps provide real-time and forecast grid carbon intensity by region. Scheduling a 72-hour model training run during a weekend with high wind generation versus a peak weekday can reduce its carbon footprint by 30-60%.

SUSTAINABILITY REPORTING FRAMEWORKS

GRI Standards (Global Reporting Initiative): the most widely used sustainability reporting framework. Project-level GRI reporting focuses on material ESG topics for your industry.

SASB (Sustainability Accounting Standards Board): industry-specific ESG metrics. Useful for mapping your project''s ESG impacts to the metrics your industry''s investors track.

TCFD (Task Force on Climate-related Financial Disclosures): focused on climate risk and opportunity. Requires organizations to describe the physical and transition risks that climate change poses to their business -- your projects may be part of the response to those risks.

DELIVERABLE: Project Sustainability Assessment
Write a Project Sustainability Assessment for your current project. Include: ESG impact assessment (Environmental: carbon footprint calculation; Social: labor and community impacts; Governance: ethics and transparency controls); ESG scoring for your portfolio scoring model; carbon reduction opportunities in project execution; sustainability reporting metrics; and ESG commitments for your key vendor contracts.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: AI Governance for Project Managers
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI Governance for Project Managers',
      'description', 'AI governance policies for project teams: acceptable use, output validation, data privacy, and escalation. Produces an AI Governance Policy Template.',
      'transcript', 'AI GOVERNANCE FOR PROJECT MANAGERS

AI tools are proliferating faster than governance frameworks. Team members are using ChatGPT to draft project communications, entering risk scenarios into public AI tools, and relying on AI-generated analysis for decisions -- often without any organizational policy governing these activities. As a PM, you are responsible for how your team uses AI. This lesson gives you the governance framework to manage AI use responsibly.

WHY AI GOVERNANCE MATTERS FOR PROJECT TEAMS

Three categories of AI risk that affect project teams:

Data privacy risk: team members entering personal data, confidential project information, or client data into public AI tools. Public AI tools may use inputs for model training, creating data privacy and confidentiality breaches. One team member pasting a client''s financial projections into ChatGPT to "summarize the key points" could create a significant data breach incident.

Output quality risk: AI tools can generate confident-sounding, plausible-looking incorrect information. A risk assessment generated by an AI that has hallucinated a key regulatory requirement, or a schedule estimate generated by an AI that has misunderstood a dependency, can cause serious project harm if acted upon without validation.

IP and copyright risk: the ownership of AI-generated project artifacts (risk registers, project charters, stakeholder analyses) is legally uncertain in many jurisdictions. Policies should address who owns AI-generated work products and whether they can be delivered to clients as original work.

THE AI GOVERNANCE POLICY COMPONENTS

Acceptable Use Policy: define what AI tools are approved for use by the project team. Distinguish between public tools (ChatGPT, Claude.ai used without enterprise controls), enterprise tools (Microsoft 365 Copilot with organizational data governance), and prohibited tools (unapproved tools handling sensitive data). Specify approved use cases: AI can be used for drafting communications, generating first-draft frameworks, summarizing public information. AI must not be used for final risk assessments without human review, or for processing personal data of project stakeholders.

Data Classification Rules: classify project data into tiers and specify which AI tools can process each tier. Tier 1 -- Public information: any approved tool. Tier 2 -- Internal project information: enterprise AI tools with organizational data controls only. Tier 3 -- Confidential (client data, financial forecasts, personal data): no AI tools without explicit DPO/Legal approval and contracted data processing agreements.

Output Validation Requirements: all AI-generated outputs must be reviewed by a qualified human before action is taken. For high-stakes outputs (risk assessments, budget forecasts, vendor evaluations, stakeholder analyses), require review by the PM and at least one subject matter expert. The reviewer must assess: is the AI output factually accurate? Does it reflect project-specific context the AI may have missed? Are there plausible errors or hallucinations?

AI Incident Reporting: define what constitutes an AI incident (AI output acted upon that turns out to be incorrect and causes project impact; data privacy breach via AI tool; AI-generated content delivered to client without appropriate disclosure). Incidents are reported to the PM and, where data privacy is involved, to the DPO.

Escalation Path: when a team member is uncertain whether a planned AI use is within policy -- escalate to PM. When PM is uncertain -- escalate to Legal/Compliance or the organizational AI governance function.

POLICY TEMPLATE STRUCTURE

Purpose: why this policy exists and what it protects.
Scope: who and what is covered (all project team members using AI tools in the context of this project).
Approved Tools List: current as of [date]; reviewed quarterly.
Prohibited Uses: with specific examples.
Data Classification Rules: by data tier.
Output Validation Requirements: by decision type (routine/high-stakes).
AI Incident Reporting: what to report, how, and to whom.
Enforcement: consequences of policy violations.
Review Cadence: quarterly review and update.

DELIVERABLE: AI Governance Policy Template
Write an AI Governance Policy for your project team using the template structure above. Include: approved and prohibited AI tools list; data classification rules for your project''s specific data types; output validation requirements for your top 5 AI use cases; incident reporting procedure; and escalation path. Distribute to all project team members and collect acknowledgment.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 18 — PM Career Acceleration & PMP Certification  (OFFSET 17, order_index = 18)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 17;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M18 chapter not found'; END IF;

  -- Lesson 1: PMP, CAPM & PRINCE2 Certification Roadmap
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'PMP, CAPM & PRINCE2 Certification Roadmap',
      'description', 'PMP experience requirements (36 months), exam structure (180 questions), application process, and study strategy. Produces a PMP Certification Action Plan.',
      'transcript', 'PMP, CAPM & PRINCE2 CERTIFICATION ROADMAP

The PMP (Project Management Professional) credential from PMI is the globally recognized standard for PM competence. Surveys consistently show a 20-25% salary premium for PMP holders vs. non-certified PMs at equivalent experience levels. This lesson gives you the exact roadmap to achieve it.

PMP ELIGIBILITY REQUIREMENTS

There are two educational pathways to PMP eligibility:

Four-year degree pathway: 4-year bachelor''s degree (or global equivalent) + 36 months of project management experience (leading projects) + 35 hours of PM education.

High school diploma pathway: secondary school diploma + 60 months of project management experience + 35 hours of PM education.

The 35 hours of PM education can be completed through PMI-approved training providers, online courses (this course contributes toward that requirement), university courses, or PMI chapter events.

The "experience leading projects" requirement means you were responsible for project decisions -- not just participating as a team member. Each experience entry in your PMP application must describe a project you led, the project objective, your role, and the outcomes.

THE PMP EXAM

180 questions total, 230 minutes (3 hours 50 minutes) to complete. Two 10-minute breaks built in.

Question format: multiple choice, multiple response, matching, drag-and-drop, and hotspot. Approximately 50% predictive/waterfall domain, 50% Agile/hybrid domain.

Passing score: PMI does not publish an exact passing score. The exam uses psychometric calibration (IRT -- Item Response Theory). Industry consensus based on candidate reports suggests roughly 61% correct, but this varies by question difficulty. Target 75%+ on practice exams to build a sufficient margin.

Content domains: People (leadership, team building, stakeholder management), Process (technical PM knowledge, scope/schedule/cost/quality/risk management), Business Environment (strategic alignment, benefits management, compliance).

The Examination Content Outline (ECO), available free from PMI.org, is your syllabus. The Agile Practice Guide (free to PMI members after applying) is the second key resource for the Agile domain.

APPLICATION PROCESS

Submit your application at PMI.org. Required information: contact details, education credentials, PM experience (project entries covering total months), and attestation that your experience is accurate.

Audit risk: approximately 20% of applications are randomly selected for audit. If audited, PMI requests documentation of your education and employer confirmation of your PM experience. Keep records: degree certificate, training certificates, and contact information for managers who can confirm your project experience.

After approval: you have 1 year to pass the exam and 3 attempts within that year.

STUDY STRATEGY

A 12-week study plan:

Weeks 1-4: ECO review. Read the ECO in full. Map each domain and task to the corresponding PMBOK Guide 7th edition chapter and Agile Practice Guide chapter. Build a knowledge gap assessment.

Weeks 5-8: deep dive on weak areas. Predictive domain: EVM formulas (PV, EV, AC, SV, CV, SPI, CPI, EAC, ETC, TCPI), critical path method, risk quantification (EMV, Monte Carlo), and procurement. Agile domain: Scrum ceremonies, Kanban metrics, SAFe overview, servant leadership.

Weeks 9-11: practice exams. Use Prepcast (Joseph Phillips) or PMI''s official practice tests. Target: 75%+ on full-length simulated exams. Review every wrong answer with explanation. Weak areas: return to source material.

Week 12: final review. No new material. Review flashcards, formulas, and your most common error types. Take one final simulated exam. Confidence, not cramming.

CAPM AND PRINCE2

CAPM (Certified Associate in Project Management): PMI''s entry-level credential. Requires 23 months of non-overlapping experience OR 1,500 hours of experience OR 23 hours of PM education. 150 questions, 3 hours. Appropriate if you lack the 36 months required for PMP.

PRINCE2 Foundation + Practitioner: UK government-originated framework. Process-based: 7 principles (business justification, learn from experience, defined roles, manage by stages, manage by exception, focus on products, tailor to environment), 7 themes, and 7 processes. Widely used in UK, Europe, and Australia. Foundation exam: 75 questions, 1 hour. Practitioner: scenario-based, open book.

DELIVERABLE: PMP Certification Action Plan
Write a PMP Certification Action Plan. Calculate your eligibility: verify you meet the experience and education requirements. Document your project experience entries for the application. Build your 12-week study plan with weekly milestones. Identify your 35-hour education sources. Set your target exam date. Define your practice exam score target and the threshold that triggers remediation.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Building a PM Portfolio That Wins Interviews
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Building a PM Portfolio That Wins Interviews',
      'description', 'What to include in a PM portfolio: charters, schedules, risk registers, EVM reports, case studies with quantified outcomes. Produces a Portfolio Framework.',
      'transcript', 'BUILDING A PM PORTFOLIO THAT WINS INTERVIEWS

Most PMs compete for roles using a resume that lists responsibilities. The PM who competes with a portfolio that demonstrates competence wins. A portfolio shows evidence -- the actual artifacts and outcomes of real project work. It answers the hiring manager''s real question: "Can this person do the job we''re hiring them for?"

WHY A PM PORTFOLIO MATTERS

Interview questions ask you to describe your experience. A portfolio lets you show it. Instead of saying "I managed a $3M program that delivered on time," you hand the interviewer a one-page case study with the project charter, the risk register decision that prevented a $400K overrun, and the EVM trend chart showing CPI recovery from 0.82 to 0.97 over 6 weeks.

Showing beats telling. Always.

PORTFOLIO ARTIFACTS BY CAREER STAGE

Entry-level PM portfolio: you may not have significant professional project experience. Use course capstone projects (this program''s deliverables are portfolio artifacts), volunteer project management work (non-profit events, community projects, open source contribution), internship project work, and academic projects with quantified outcomes.

Mid-career PM portfolio: sanitized professional artifacts are your core. Project charter (demonstrates scope definition and stakeholder alignment skills), project schedule (a well-structured WBS and schedule shows PM technical competence), risk register (demonstrates risk thinking, especially if you can show a risk that materialized and how you managed it), EVM trend report (demonstrates financial management fluency), retrospective action log (shows continuous improvement orientation).

Senior PM portfolio: program governance charter, portfolio scoring framework, change management plan with adoption metrics, EVM S-curve showing mid-project recovery, benefits realization report with actual vs. target outcomes.

ARTIFACT SELECTION CRITERIA

Not every project artifact belongs in a portfolio. Select artifacts that:

Show problem-solving, not just execution: a risk register is more valuable if accompanied by a brief note on the most significant risk you managed and the decision you made. A project charter is more valuable if it shows how you aligned competing stakeholder interests.

Include quantified outcomes: "Delivered 3 weeks early, $47K under budget" is evidence. "Managed a large project" is not.

Demonstrate breadth across PMBOK knowledge areas: your portfolio should show competence in scope, schedule, cost, quality, risk, and stakeholder management -- not just one or two areas.

SANITIZATION RULES

Never include confidential client information, personal data, financial data tied to real organizations, or proprietary technical designs in a publicly shared portfolio.

Sanitization approach: replace company name with industry descriptor ("a $500M global manufacturing firm"). Replace client names with roles ("the Head of Finance"). Keep all numerical data accurate -- the numbers demonstrate your outcomes, not the company name. Remove any data that could identify individuals.

CASE STUDY FORMAT

The most powerful portfolio artifact is a well-written case study. Format: Situation (1-2 sentences on the project context and challenge), Approach (2-3 sentences on how you managed the key challenge), Result (1-2 sentences with quantified outcome).

Example: "Inherited a stalled ERP implementation 4 months behind schedule and $280K over budget [Situation]. Conducted a root cause analysis, identified three scope items that could be phased to a later release without compromising core functionality, and renegotiated the vendor delivery schedule [Approach]. Delivered the core system on time; phase 2 scope was delivered 6 weeks later. Final budget variance reduced from +23% to +8% [Result]."

PORTFOLIO PRESENTATION FORMATS

PDF portfolio: 6-10 pages. Cover page, brief PM bio, 3-4 artifact sections each with a 100-word context paragraph and the artifact. Clean, professional formatting.

Notion portfolio page: hyperlinked structure with expandable sections. Allows more depth for interested readers without overwhelming initial view.

GitHub repository: appropriate for technical PM roles where showing actual project management templates, automation scripts, and structured data assets adds value.

DELIVERABLE: Portfolio Framework
Build your PM Portfolio Framework. Select 4-5 artifacts from your current or past project work. Sanitize each artifact per the sanitization rules. Write a 100-word case study for your most significant project outcome. Assemble in PDF or Notion format. Identify 2 gaps in your portfolio (PMBOK knowledge areas not currently represented) and plan how to fill them within 90 days.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: PM Personal Brand & LinkedIn Optimization
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'PM Personal Brand & LinkedIn Optimization',
      'description', 'LinkedIn headline, experience accomplishments, skills, and thought leadership strategy for PM visibility. Produces a LinkedIn Optimization Checklist.',
      'transcript', 'PM PERSONAL BRAND & LINKEDIN OPTIMIZATION

LinkedIn is the primary talent marketplace for project managers. Recruiters use it to find candidates. Hiring managers use it to vet candidates before interview. Peers use it to decide who to follow and engage with. Your LinkedIn profile is always-on, always visible, and always making an impression. This lesson tells you exactly how to optimize it.

THE LINKEDIN ALGORITHM FUNDAMENTALS

LinkedIn''s feed algorithm rewards engagement (likes, comments, shares) and rewards consistency (regular posting). Its search algorithm rewards keyword relevance in your headline, about section, and experience entries.

Two goals that require different optimization approaches: search visibility (getting found by recruiters and hiring managers) and feed presence (building a following and professional reputation). Both matter for a PM building their career.

HEADLINE OPTIMIZATION

Your LinkedIn headline is the most important field on your profile. It determines whether you appear in recruiter keyword searches and whether someone who lands on your profile spends 5 seconds or 30 seconds reading it.

The headline formula: Role | Value Proposition | Differentiator.

Generic headline: "Project Manager at Acme Corp" -- appears in searches for "project manager" but says nothing differentiating.

Optimized headline: "Senior PM | AI & Digital Transformation | Delivered $4.2M in Projects On-Time | PMP" -- appears in searches for "AI PM," "digital transformation PM," "PMP project manager." Communicates value immediately.

Include: your level (Senior/Principal/Director), your niche or industry, your most impressive quantified achievement, and your most relevant certification. Keep it under 200 characters.

ABOUT SECTION

Write in first person. Four elements:

Who you are: your PM identity and specialization. "I am a Senior Project Manager specializing in AI implementation and digital transformation programs for financial services organizations."

What you specialize in: your key capability areas in 1-2 sentences. "I lead complex, multi-stakeholder programs from initiation through benefits realization, with particular expertise in Agile-at-scale delivery and organizational change management."

What you achieve: 1-2 sentences with your signature accomplishment or typical outcome. "My projects consistently deliver within 5% of baseline budget and scope; the ERP program I led in 2025 generated $2.1M in documented annual savings within 12 months of go-live."

Call to action: what you want people to do. "If you are hiring for senior PM roles in AI or digital transformation, or are looking for a speaker on AI-augmented project delivery, I''d love to connect."

EXPERIENCE SECTION ACCOMPLISHMENTS

For each role, write 3-5 accomplishment bullets using CAR format: Challenge, Action, Result with metric.

Generic bullet: "Managed project stakeholders and ensured timely delivery."

Optimized bullet: "Led cross-functional stakeholder alignment across 6 business units for a $3M CRM replacement, reducing stakeholder escalations from 4 per month to 0 in final 3 months. Delivered 2 weeks ahead of schedule."

Every bullet should answer: "So what?" If the bullet does not include a metric or a specific outcome, it is a task description, not an accomplishment.

SKILLS SECTION AND ENDORSEMENTS

LinkedIn shows your top 3 skills prominently. Choose them to match the keywords most common in your target job postings: "Project Management," "Agile Project Management," "Risk Management," "Stakeholder Management," "PMP." Get endorsements from colleagues and managers -- 20+ endorsements on a skill signals credibility.

CONTENT STRATEGY

Posting 2-3 times per week builds visibility and reputation. PM content that consistently performs: lessons learned posts ("I almost missed a $200K risk because of this mistake..."), framework posts with visual (a one-image summary of EVM formulas), and case study posts (sanitized story of a project challenge and how you solved it).

Creator Mode: activate Creator Mode to show your follower count, add a featured section at the top of your profile, and surface your content more prominently. Add a Featured section with your best post, a portfolio case study, or a certification.

DELIVERABLE: LinkedIn Optimization Checklist
Complete a LinkedIn Optimization Checklist for your profile. Actions: rewrite headline using the Role/Value/Differentiator formula; rewrite About section with all four elements; update each experience role to include at least 2 CAR accomplishment bullets with metrics; set top 3 skills to keyword-match target job postings; activate Creator Mode; post your first thought leadership piece. Track profile views before and after optimization and report the percentage change at 30 days.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Salary Negotiation & PM Career Path Decisions
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Salary Negotiation & PM Career Path Decisions',
      'description', 'PM salary benchmarks by level, region, and certification. Negotiation scripts, offer evaluation, and career path decisions. Produces a Negotiation Playbook.',
      'transcript', 'SALARY NEGOTIATION & PM CAREER PATH DECISIONS

Most PMs underestimate their market value and leave money on the table in compensation negotiations. This lesson gives you the data, the framework, and the scripts to negotiate effectively -- and the career path decision framework to know which direction to grow.

PM SALARY BENCHMARKS

US salary benchmarks (2025 approximate ranges, base salary):

Associate PM / Junior PM: $65,000-$85,000. Typically 0-3 years of PM experience. Lower end for non-tech industries; upper end for tech companies.

Project Manager: $85,000-$115,000. 3-7 years of PM experience. PMP holders typically at or above midpoint. Technology sector: 20-30% premium above these ranges.

Senior Project Manager: $115,000-$150,000. 7-12 years, PMP or equivalent, managing programs of $1M+.

Principal PM / Program Director: $150,000-$200,000+. 12+ years, program management experience, P&L exposure.

VP of PMO / Head of Delivery: $180,000-$260,000+. Senior leadership, portfolio management, organizational change.

Geographic premium: San Francisco Bay Area and New York City add 30-40% to these ranges. Seattle and Boston add 15-25%. Austin and Denver add 5-10%.

Certification premium: PMP adds approximately $15,000-$20,000 to median salary vs. non-certified PMs at equivalent experience, per PMI''s annual Earning Power salary survey.

TOTAL COMPENSATION EVALUATION FRAMEWORK

Never evaluate an offer on base salary alone. Calculate total compensation value:

Base salary + annual bonus (cash) + equity value (RSUs vested annually / number of years) + 401K match (employer percentage x your expected contribution) + health benefits value (employer portion of premium, typically $5,000-$15,000 annual value) + professional development budget + additional PTO value.

Example: Offer A: $118K base, 10% bonus, $40K RSU over 4 years, standard benefits. Total Year 1 compensation: $118K + $11.8K + $10K RSU + ~$8K benefits = approximately $148K total.

Offer B: $112K base, 15% bonus, $80K RSU over 4 years, 4 weeks PTO vs. 3 weeks, $5K professional development budget. Total Year 1: $112K + $16.8K + $20K RSU + ~$8K benefits + $2K additional PTO value + $5K PD = approximately $164K total.

Offer B has a lower base but higher total comp. A PM focused only on base would choose wrong.

NEGOTIATION FRAMEWORK

The BATNA principle (Best Alternative to Negotiated Agreement): your negotiating power depends on your alternative. If you have a competing offer at $118K, you have strong negotiating leverage. If this is the only offer you have, your leverage is weaker -- but you still have more leverage than most people use.

Anchoring: the first number stated anchors the negotiation. Anchor higher than your target. If you want $119K, anchor at $125K. Justify the anchor with data: "Based on market research and my PMP certification and 7 years of experience, I''m looking for $125K."

Negotiation script example: "I''m very excited about this opportunity and I''d like to make this work. The offer is at $112K. Based on my research of the market range for this role at this level -- which is $110,000-$130,000 -- and taking into account my PMP, 7 years of experience, and the $2.1M in annual savings I generated in my current role, I was hoping we could get to $125K. Is there flexibility?"

Settling: companies typically meet you partway. If they come to $119K, consider whether other levers (signing bonus, extra PTO, accelerated equity vesting, professional development budget) can bridge the remaining gap.

CAREER PATH DECISION FRAMEWORK

Two primary PM career paths:

Individual contributor track: PM > Senior PM > Principal PM > Distinguished PM. Deepening expertise in delivery, increasingly complex programs, thought leadership. Appropriate if you love the craft of project delivery and want to become the best PM in the room.

Management track: PM > Senior PM > PM Lead > Director of PMO > VP of Delivery. Building and leading PM teams, portfolio governance, organizational PM capability. Appropriate if you enjoy developing others, organizational design, and executive influence.

Neither path is superior. The best choice is the one that aligns with where you consistently feel energized. If you dread one-on-ones with direct reports and love being in the project weeds, the IC track is yours. If you get more energy from coaching junior PMs than from managing a risk register, the management track is calling.

DELIVERABLE: Negotiation Playbook
Write a Negotiation Playbook for your next career move. Include: your current market value assessment (base salary range, total comp estimate) based on benchmarks for your level, region, and certifications; your BATNA; your target compensation and anchor number; negotiation script for your specific situation; and total compensation evaluation template to compare multiple offers.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: The AI-Era PM — Future-Proofing Your Career
  UPDATE public.videos SET
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The AI-Era PM — Future-Proofing Your Career',
      'description', 'AI tools redefining PM: Copilot for scheduling, Claude for risk analysis, Jira AI for planning. The 12-month acceleration plan. Produces a Future-Ready PM Plan.',
      'transcript', 'THE AI-ERA PM: FUTURE-PROOFING YOUR CAREER

AI is changing the PM role faster than any previous technology shift. In the next 3-5 years, a significant portion of the administrative work that defines many PM roles today -- status reporting, schedule updates, risk register maintenance, meeting notes, stakeholder communication drafts -- will be handled by AI tools. The PMs who thrive will be those who have moved their value upstream: to judgment, leadership, stakeholder relationships, and strategic thinking. This final lesson is your 12-month action plan.

HOW AI IS CHANGING THE PM ROLE

The PM role historically had two dimensions: management (tracking, reporting, coordinating, documenting) and leadership (judgment, decision-making, stakeholder influence, strategic thinking). Management tasks were approximately 60-70% of the job by time. Leadership tasks were 30-40%.

AI is automating the management dimension rapidly. AI can already: generate draft project status reports from structured data (in 2 minutes), create initial risk registers from project descriptions (in 5 minutes), summarize and action-item meeting transcripts (in real time), maintain Gantt chart updates from team inputs (automatically), and flag schedule variances and cost anomalies without PM intervention.

This does not eliminate PM roles -- it transforms them. The PM who spent 10 hours per week on status reporting and schedule maintenance now has 10 hours per week for stakeholder relationship development, strategic analysis, and proactive risk management. The PM who does not adapt will be displaced by a smaller number of AI-augmented PMs who can manage larger programs more effectively.

AI TOOLS BY PM ACTIVITY

Scheduling and planning: Microsoft Copilot for Project generates draft schedules from scope descriptions, identifies critical path automatically, and suggests resource leveling options. Smartsheet AI generates project timeline templates from natural language descriptions.

Risk analysis: Claude (Anthropic) is particularly effective for scenario-based risk analysis -- you describe the project context and ask for comprehensive risk identification across technical, organizational, and external dimensions. The output requires human validation and project-specific calibration, but it is a powerful starting point.

Documentation and reporting: Notion AI and Confluence AI generate first drafts of project charters, lessons learned reports, and stakeholder analysis documents. Microsoft Copilot generates slide content for steering committee presentations from structured status data.

Meeting intelligence: Microsoft Teams Copilot, Otter.ai, and Fireflies.ai transcribe, summarize, and extract action items from project meetings in real time. A 60-minute stakeholder workshop produces a structured summary and action log within minutes of ending.

Resource management: Planview AI predicts resource bottlenecks 6-8 weeks in advance. Monday.com AI generates workload balance recommendations.

SKILLS THAT AI CANNOT REPLACE

Political intelligence: reading the real power dynamics in your organization, building trust, navigating competing agendas. AI can inform this work; it cannot do it.

Trust building: stakeholders trust people, not AI systems. The PM who has built a 3-year track record of delivery and candor is irreplaceable. The PM who relies entirely on AI to communicate and engage has no relationship capital.

Judgment in ambiguity: when the requirements are unclear, the stakeholders disagree, and the technology is unproven, someone must make a call. That is the PM. AI can model scenarios; it cannot take responsibility for the decision.

Ethical leadership: the PM who ensures AI is used responsibly, that risks are communicated honestly, and that team members are treated fairly provides a value that AI tools do not.

THE 12-MONTH AI PM ACCELERATION PLAN

Months 1-2 -- Audit your workflow: identify the 5 highest time-cost PM activities in your current role. These are your automation candidates.

Months 3-4 -- Implement AI for administrative tasks: deploy AI tools for status reporting, meeting summarization, and schedule maintenance. Target: recover 5 hours per week.

Months 5-6 -- Build AI-augmented risk and stakeholder analysis: integrate Claude or Copilot into your risk management and stakeholder analysis workflow. Validate outputs rigorously.

Months 7-9 -- Develop AI thought leadership in your organization: become the PM who teaches others how to use AI responsibly. Run a workshop. Write an internal guide. Become the AI-forward PM in your organization.

Months 10-12 -- Position and promote: update your LinkedIn and portfolio to reflect your AI-augmented PM capabilities. Use the thought leadership content you have built. Apply for the next-level roles.

The future PM is not a software engineer who can manage projects. The future PM is an exceptional human leader who uses AI fluently -- keeping the judgment, the relationships, and the accountability that no AI will ever hold.

DELIVERABLE: Future-Ready PM Plan
Write your Future-Ready PM Plan. Include: AI workflow audit (your 5 highest time-cost activities and automation potential for each); 12-month AI tool adoption roadmap; skills investment plan (which human skills will you develop that AI cannot replicate?); thought leadership plan for AI-era PM within your organization; and 12-month career milestone targets. This plan is your graduation commitment from this program -- execute it.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- =============================================================================
-- VERIFY (run immediately after applying)
-- Expected: modules 10-18 each show filled=5
-- =============================================================================
SELECT c.order_index, c.title,
       COUNT(*) FILTER (WHERE v.translations->'en'->>'transcript' IS NOT NULL) AS filled
FROM public.videos v
JOIN public.chapters c ON c.id = v.chapter_id
JOIN public.courses co ON co.id = c.course_id
WHERE co.title = 'AI Project Manager & Delivery Leader'
  AND co.curriculum_version = 'pm-v1'
  AND c.order_index BETWEEN 10 AND 18
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
