-- =============================================================================
-- PM Lesson Content — Modules 1–9
-- Course: AI Project Manager & Delivery Leader (pm-v1)
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

-- ─── MODULE 1 ───────────────────────────────────────────────────────────────
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 0;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M1 chapter not found'; END IF;

  UPDATE public.videos SET
    description = 'Explore how AI is reshaping the PM role — from manual tracking to intelligent delivery — and learn to build your AI PM Operating Charter.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The PM Role in the AI Era',
      'description', 'Explore how AI is reshaping the PM role — from manual tracking to intelligent delivery — and learn to build your AI PM Operating Charter.',
      'transcript', 'The project management profession is undergoing its most significant transformation since the introduction of Agile. AI is not a future threat or a distant possibility — it is already embedded in the tools you use every day, from Jira''s sprint forecasting to Microsoft Project''s risk flagging. Your job is not to fear this shift. Your job is to lead it.

Start by understanding what AI actually does in a project context. At its core, AI in project management falls into three categories: automation, augmentation, and prediction. Automation handles repetitive tasks — generating status reports, updating task completion percentages, sending deadline reminders. Augmentation enhances your judgment — AI surfaces patterns in your schedule data, flags scope creep signals in meeting transcripts, and suggests resource reallocation based on velocity trends. Prediction goes further — Monte Carlo simulations powered by machine learning can forecast project completion dates with confidence intervals, giving you something no Gantt chart ever could: probabilistic certainty.

The PM role is shifting from data gatherer to decision architect. In the pre-AI era, you spent roughly 40% of your time collecting status updates, reformatting spreadsheets, and writing reports nobody read. AI collapses that to under 10%. The time you recover goes into stakeholder alignment, risk mitigation, and strategic decision-making — the work that actually moves projects forward.

To operate effectively in this environment, you need an AI PM Operating Charter. This is not a technology document. It is a decision document. It defines which AI tools your team will use, for which tasks, with what level of human review, and where AI output requires verification before acting on it. For example, you might charter that AI-generated risk lists are used as brainstorming inputs only and must be reviewed by the PM and at least one subject matter expert before entering the risk register. That one rule prevents the most common failure mode: treating AI output as ground truth.

Your charter should cover five areas. First, tool inventory — list every AI tool in your environment and its primary use case. Second, task classification — categorize tasks as AI-automatable, AI-augmented, or human-only. Third, review thresholds — define when AI output goes straight to action versus when it requires human verification. Fourth, data governance — specify what project data can be fed into AI tools, particularly when working with confidential client information. Fifth, team onboarding — define how you will bring team members up to speed on approved tools and workflows.

A concrete example: a construction PM managing a $12M commercial fitout uses Procore''s AI to flag schedule conflicts 14 days in advance. The charter specifies that any conflict flagged with over 70% confidence triggers a mandatory review meeting within 48 hours. Conflicts below that threshold are logged but not escalated. This threshold-based approach prevents alert fatigue while ensuring the PM acts on high-signal warnings.

The PMs who will thrive in the next decade are not the ones who learn to use every AI tool available. They are the ones who build systems — charters, thresholds, governance structures — that make AI output trustworthy and actionable. Start building yours now.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET
    description = 'Compare Waterfall, Agile, Scrum, Kanban, SAFe, and hybrid frameworks and learn a structured method to select the right one for your project context.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Delivery Frameworks: Waterfall, Agile & Hybrid',
      'description', 'Compare Waterfall, Agile, Scrum, Kanban, SAFe, and hybrid frameworks and learn a structured method to select the right one for your project context.',
      'transcript', 'One of the most consequential decisions you make at the start of any project is choosing your delivery framework. Get it right and your team operates in a rhythm that feels natural. Get it wrong and you spend the entire project fighting the methodology instead of delivering value.

Let''s build a mental model. Think of delivery frameworks on two axes: how well-defined are the requirements, and how frequently does value need to be delivered? Waterfall lives in the top-left quadrant — requirements are well-defined upfront and delivery happens once, at the end. Agile frameworks cluster in the bottom-right — requirements emerge over time and value is delivered incrementally every one to four weeks.

Waterfall is sequential. You complete requirements before design, design before build, build before test, test before deploy. The strength is predictability: stakeholders know exactly what will be delivered and when. The weakness is rigidity: if requirements change mid-project — and they always do — you face expensive rework. Waterfall works best for construction, manufacturing, regulatory compliance projects, and any context where the end state is legally or contractually fixed.

Scrum is the most widely adopted Agile framework. It organizes work into Sprints — fixed time-boxes of one to four weeks. Each Sprint produces a potentially shippable increment. The Scrum team consists of a Product Owner who owns the backlog, a Scrum Master who facilitates the process, and the Development Team who build the product. Daily standups, Sprint Reviews, and Retrospectives create a tight feedback loop. Scrum works best for software products where requirements are evolving and rapid feedback from users drives decisions.

Kanban is a flow-based system. Work items move through columns — typically To Do, In Progress, Done — and the core constraint is Work in Progress (WIP) limits. By capping how many items can be in progress simultaneously, Kanban exposes bottlenecks and forces the system to finish work before starting new work. Kanban is ideal for operational teams, support functions, and maintenance projects where work arrives continuously and priorities shift daily.

SAFe — the Scaled Agile Framework — addresses what happens when you need Agile across dozens of teams simultaneously. SAFe introduces Program Increments (PIs) — typically 8–12 week planning cycles that align multiple teams to shared objectives. If you''re managing an enterprise transformation with 15 Scrum teams, SAFe gives you the coordination layer you need. The cost is complexity — SAFe requires significant organizational commitment and a trained Release Train Engineer (RTE).

Hybrid frameworks blend sequential and iterative approaches. A common pattern: use Waterfall for project initiation and architecture decisions, then switch to Agile for feature development, then return to a structured deployment and hypercare phase. This works well for ERP implementations, infrastructure projects with regulatory sign-off requirements, and large-scale digital transformations.

Your Framework Selection Guide should evaluate four factors: requirement stability (high = Waterfall tendency), delivery frequency expectation (high = Agile tendency), team Agile maturity (low = start with Scrum basics), and organizational governance requirements (high = Waterfall or Hybrid). Score each factor on a 1–5 scale and let the scores guide your initial recommendation. Then test it against your stakeholders: a risk-averse CFO funding a fixed-price contract will resist pure Agile regardless of your score.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET
    description = 'Walk through the five-phase project lifecycle — initiating, planning, executing, monitoring, and closing — and learn how AI accelerates each phase.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Project Lifecycle & Phase Management',
      'description', 'Walk through the five-phase project lifecycle — initiating, planning, executing, monitoring, and closing — and learn how AI accelerates each phase.',
      'transcript', 'Every project, regardless of size or industry, moves through five phases: initiating, planning, executing, monitoring and controlling, and closing. The PMBOK framework codified these phases decades ago, and they remain the backbone of professional project management. What has changed is the velocity at which AI allows you to move through each phase — and the quality of output you can achieve with smaller teams.

Initiating is where the project is authorized. The key outputs are the Project Charter and the Stakeholder Register. This phase answers the question: should we do this? You are building the business case, identifying the sponsor, defining high-level scope, and getting formal authorization to proceed. A common mistake is rushing initiation — teams eager to start building skip the hard conversations about goals and constraints. Every week saved in initiation costs three weeks in execution when misalignment surfaces.

Planning is the most intellectually intensive phase. You are building the scope baseline, schedule baseline, cost baseline, and risk register. Together these form the Project Management Plan. The planning phase answers: how will we do this? AI dramatically accelerates planning — tools like ChatGPT can draft a WBS from a one-paragraph project brief in under two minutes. That draft is a starting point, not a finished product, but it compresses the time from blank page to structured conversation from hours to minutes.

Executing is where the work happens. The PM''s role shifts from planner to facilitator and obstacle remover. You are running status meetings, managing the team, coordinating vendors, and keeping stakeholders informed. The Iron Triangle — scope, time, cost — is under pressure every day. Your job is to surface trade-offs early so decision-makers can act before options close.

Monitoring and controlling runs in parallel with execution. You are measuring performance against the baseline using Earned Value metrics — Schedule Variance (SV), Cost Variance (CV), Schedule Performance Index (SPI), and Cost Performance Index (CPI). A CPI below 1.0 means you are spending more than planned for the work completed. An SPI below 1.0 means you are behind schedule. These metrics give you an objective, quantified picture of project health — critical for credible executive reporting.

Closing is the discipline most PMs underinvest in. You are getting formal acceptance of deliverables, releasing resources, closing contracts, capturing lessons learned, and archiving project records. Lessons learned are particularly valuable for AI-augmented organizations: structured post-project data feeds into the AI tools that forecast future project timelines and budgets. The better your historical data, the more accurate your AI predictions.

Your Phase Checklist should list the key decisions, artifacts, and approvals required to exit each phase. Use it as a gate. A project that exits initiation without a signed charter has not finished initiation — it has skipped it. Phase gates are not bureaucracy; they are the checkpoints that prevent the majority of project failures, which stem from unclear goals and misaligned expectations that could have been resolved in the first two weeks.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET
    description = 'Unpack PMBOK 7th edition''s 12 principles and eight performance domains, and understand the shift from process compliance to outcome delivery.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'PMBOK 7th Edition & Performance Domains',
      'description', 'Unpack PMBOK 7th edition''s 12 principles and eight performance domains, and understand the shift from process compliance to outcome delivery.',
      'transcript', 'The Project Management Body of Knowledge — PMBOK — is the most widely referenced standard in the profession. The 7th edition, released in 2021, represents the most significant structural change in PMBOK''s history. If you learned project management from the 6th edition or earlier, you need to understand what changed and why.

Previous editions organized project management around process groups and knowledge areas — 49 processes mapped into a matrix of five process groups and ten knowledge areas. The 7th edition replaces this process-centric view with a principles-and-performance-domains model. This is not a cosmetic change. It reflects a fundamental shift in how PMI views the PM''s job: not as a process executor, but as an outcome architect.

The 12 Principles of Project Management in PMBOK 7 are: be a diligent, respectful, and caring steward; create a collaborative project team environment; effectively engage with stakeholders; focus on value; recognize, evaluate, and respond to system interactions; demonstrate leadership behaviors; tailor based on context; build quality into processes and deliverables; navigate complexity; optimize risk responses; embrace adaptability and resiliency; and enable change to achieve the envisioned future state. These principles are deliberately framework-agnostic — they apply equally to a Waterfall, Agile, or hybrid delivery model.

The eight Performance Domains replace the ten Knowledge Areas as the organizing structure for project management activity. The domains are: Stakeholder, Team, Development Approach and Life Cycle, Planning, Project Work, Delivery, Measurement, and Uncertainty. Each domain represents an area of focus that, when managed well, produces outcomes that enable project success. Notice what is different: the domains describe what you are focused on, not the steps you must follow.

The Measurement domain deserves particular attention. PMBOK 7 moves away from prescribing specific metrics like CPI and SPI and instead asks: what outcomes are you trying to achieve, and what measures would tell you whether you are achieving them? This requires PMs to think more critically about measurement — to design metrics that reflect actual value delivered, not just activity completed.

For your PMP exam or professional practice, the PMBOK 7th edition is supplemented by the Practice Standard for Scheduling, the Practice Standard for Risk Management, and the Agile Practice Guide. These supplements provide the tactical depth that the high-level principles framework intentionally omits.

Your PMBOK Domain Map should link each of the eight domains to the specific deliverables, decisions, and metrics your project uses to address that domain. For the Uncertainty domain, you might map your risk register, risk responses, and Monte Carlo simulation outputs. For the Delivery domain, you would map your acceptance criteria, quality checklists, and sprint review outputs. This mapping exercise forces you to verify that every domain is being actively managed — not just the ones that feel urgent this week.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET
    description = 'Survey the essential AI tools every PM needs in their daily toolkit — from ChatGPT and Copilot to Jira AI, Notion AI, and specialized PM platforms.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI Tools Every PM Must Master Today',
      'description', 'Survey the essential AI tools every PM needs in their daily toolkit — from ChatGPT and Copilot to Jira AI, Notion AI, and specialized PM platforms.',
      'transcript', 'The AI tool landscape for project managers is evolving faster than any vendor comparison can keep pace with. Rather than giving you a list that will be outdated in six months, this lesson teaches you a framework for evaluating and adopting AI tools — and then applies that framework to the highest-value tools available today.

Evaluate any AI PM tool across four dimensions: task coverage (which PM tasks does it address), output quality (how much editing does the output require before it is usable), integration (does it connect with your existing stack), and data privacy (what happens to the project data you feed it). Score each dimension 1–5 and weight them according to your context. A solo consultant might weight output quality highest; an enterprise PM at a regulated firm will weight data privacy first.

ChatGPT and Claude are your general-purpose AI assistants. Their highest-value PM use cases are: drafting communications (status reports, escalation emails, stakeholder briefings), structuring documents (risk registers, project charters, lessons learned), and thinking through complex decisions (risk response options, trade-off analysis, stakeholder engagement strategies). The key skill is prompt engineering — knowing how to give the AI enough context to generate useful output. A prompt that includes project type, phase, audience, and desired format produces dramatically better results than a vague instruction.

Microsoft Copilot is embedded in the Microsoft 365 suite. For PMs who live in Teams, SharePoint, and Outlook, Copilot''s highest-value features are meeting transcription and action item extraction (never miss a follow-up again), email summarization (get to the key ask in 10 seconds), and document generation from meeting notes. The integration with Excel enables natural language queries against your project data — ask "which tasks are overdue by more than five days" and Copilot surfaces the answer from your schedule.

Jira and Azure DevOps have both launched AI features. Jira''s AI can auto-suggest story point estimates based on historical velocity, flag tickets that lack acceptance criteria, and generate sprint summaries. Azure DevOps Copilot can help write pipeline definitions and suggest work item refinements. These features are most valuable to PMs managing software delivery teams who want AI embedded directly in their workflow tool.

Notion AI is particularly useful for knowledge management — generating meeting notes templates, summarizing long documents, and building internal wikis with AI-assisted content generation. If your team uses Notion as its central workspace, Notion AI reduces the documentation burden significantly.

Specialized tools worth monitoring: Motion and Reclaim for AI-powered calendar and task scheduling; Otter.ai and Fireflies for meeting transcription; and Runway for project scenario analysis. Your AI Tool Inventory should capture tool name, primary use case, data privacy classification, integration status, and owner for each tool your team adopts. Review it quarterly — the tool that wins in Q1 may be superseded by Q3.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ─── MODULE 2 ───────────────────────────────────────────────────────────────
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 1;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M2 chapter not found'; END IF;

  UPDATE public.videos SET
    description = 'Learn to construct a business case that survives executive scrutiny, covering problem statement, options analysis, financial modeling, and risk summary.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Business Case Development & Feasibility',
      'description', 'Learn to construct a business case that survives executive scrutiny, covering problem statement, options analysis, financial modeling, and risk summary.',
      'transcript', 'A business case is the document that answers the single question every executive asks before approving a project: why should we invest in this, and why now? Weak business cases get deferred, descoped, or defunded. Strong ones get approved, funded, and staffed. The difference is almost never the quality of the idea — it is the quality of the argument.

A business case has five components. First, the problem statement. This is not a description of the solution you want to build. It is a precise articulation of the business pain that exists today, quantified wherever possible. "Our customer onboarding process takes 14 days and costs $340 per customer, compared to an industry benchmark of 5 days and $120 per customer. This gap costs us approximately $2.8M per year in operational expense and contributes to a 22% abandonment rate during onboarding." That is a problem statement that earns a meeting.

Second, options analysis. You must present at least three options: do nothing, a minimum viable option, and a full solution. Evaluating only one option is advocacy, not analysis. Executives see through advocacy. For each option, show the cost, the benefit, the implementation complexity, and the risk profile. A simple table with five rows and four columns communicates this more effectively than three pages of prose.

Third, the financial case. This is where most PMs undersell. You need NPV (Net Present Value), ROI (Return on Investment), and Payback Period. NPV discounts future cash flows to today''s value using your organization''s hurdle rate — typically 8–15%. A project with a positive NPV at your hurdle rate creates value. ROI is simpler: (Net Benefit / Total Cost) × 100. A 3-year ROI of 180% is compelling. Payback Period answers how many months until you recover the investment — anything under 18 months for a discretionary project is attractive.

Fourth, the risk summary. Not a full risk register — a three-to-five sentence executive summary of the top risks and mitigations. If the financial case assumes a 20% efficiency gain, the risk is that you achieve only 12%. The mitigation is a phased rollout with gate reviews at 90 days. This shows you have thought critically about the assumptions driving your numbers.

Fifth, the recommendation. State clearly which option you recommend and why. Do not make executives guess. End with a specific ask: approval to proceed to planning, authorization to issue an RFP, or budget release for Phase 1.

The Business Case Template you produce from this lesson is a reusable structure. Every field maps to a question an executive will ask. Fill it with project-specific numbers and your approval rate will climb.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET
    description = 'Master the five essential elements of a project charter — purpose, scope, authority, milestones, and success metrics — and learn how to get it approved.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Project Charter: Structure, Authority & Approval',
      'description', 'Master the five essential elements of a project charter — purpose, scope, authority, milestones, and success metrics — and learn how to get it approved.',
      'transcript', 'The project charter is the founding document of your project. It authorizes the project to exist, grants the PM authority to assign resources and make decisions, and establishes the high-level parameters within which the project will operate. Without a signed charter, you have a conversation — not a project.

The five elements every charter must contain are purpose, scope, authority, milestones, and success metrics.

Purpose is one to three sentences that explain why this project exists in business terms. Not technical terms. Not feature terms. Business terms. "This project will replace our legacy billing system to reduce invoice processing time from 12 days to 2 days, enabling the finance team to close the books 7 days faster each month and improve cash flow visibility by $4.5M on average." A strong purpose statement connects the project directly to a measurable business outcome. If your purpose statement could describe any project at any company, it is too generic.

Scope defines what is in and what is out. Be explicit about exclusions — they prevent scope creep more effectively than any change control process. "In scope: migration of billing module for North America customers. Out of scope: APAC billing migration, integration with the CRM system, and historical data migration beyond 24 months." Explicit exclusions force the conversations that need to happen before the project starts, not six months in.

Authority defines what the PM is empowered to decide independently versus what requires sponsor approval. This is the element most charters omit and most projects regret. "The PM is authorized to approve scope changes up to 5% of baseline budget without sponsor approval. Changes exceeding this threshold require written sponsor authorization within 48 hours of PM request." Without this, every decision creates a bottleneck at the sponsor level.

Milestones are the four to six major checkpoints that mark the transition between project phases or the delivery of key outputs. They are date-bounded and outcome-defined: "Phase 1 Complete: all legacy data mapped and validated — Target: March 15." Milestones in the charter become the scaffolding for your detailed schedule in planning.

Success metrics are the quantified outcomes that define what "done" looks like. They answer the question: how will we know the project succeeded 90 days after go-live? "Invoice processing time ≤ 2 days for 95% of transactions. Finance close cycle reduced by 7 calendar days. Zero billing errors in first 30 days post-launch."

Approval is not just a signature — it is a conversation. Walk your sponsor through each element before you send it for sign-off. Surface disagreements in that conversation, not after work has begun.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET
    description = 'Identify who matters on your project, what they want, and how to engage them using the power/interest matrix, influence mapping, and a structured Stakeholder Register.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Stakeholder Identification & Initial Mapping',
      'description', 'Identify who matters on your project, what they want, and how to engage them using the power/interest matrix, influence mapping, and a structured Stakeholder Register.',
      'transcript', 'Stakeholder management is the competency that separates PMs who deliver projects from PMs who deliver projects that stick. You can hit every milestone on the schedule and still fail if the people who need to use, fund, or approve your deliverable are not aligned, informed, and engaged throughout.

Start with identification. Cast the net wide. The most dangerous stakeholders are the ones you did not know existed until they raised an objection in the steering committee. Use four lenses to ensure complete coverage: organizational (who owns the business process being changed?), technical (who owns the systems being integrated or replaced?), financial (who controls or is affected by the budget?), and external (vendors, regulators, customers, partners). For a mid-size ERP implementation, a thorough identification exercise typically surfaces 40–80 distinct stakeholders across these four lenses.

The power/interest matrix is your primary categorization tool. Plot each stakeholder on a 2×2 grid: power (their ability to influence project success or failure) on the vertical axis, interest (their level of engagement with the project) on the horizontal axis. This creates four quadrants: High Power / High Interest — manage closely. These are your core sponsors, executive decision-makers, and lead users. High Power / Low Interest — keep satisfied. These stakeholders can block the project but are not engaged in its details; your job is to give them the information they need to remain supportive without overwhelming them. Low Power / High Interest — keep informed. These are often your frontline users and subject matter experts — their buy-in matters enormously for adoption. Low Power / Low Interest — monitor. Minimum engagement; spot-check quarterly.

The influence mapping goes one level deeper. For each High Power stakeholder, document their primary concern (what they care most about), their preferred communication style (data-driven vs. narrative, formal vs. informal), and their relationship to other High Power stakeholders. If two executives have a tense relationship and both sit on your steering committee, that dynamic will surface in your governance meetings. Knowing it exists lets you manage seating, agenda sequencing, and pre-meeting alignment.

Your Stakeholder Register captures this analysis in a structured format: stakeholder name, role, organization, power rating (1–5), interest rating (1–5), primary concern, preferred communication channel, frequency of engagement, and current engagement level (Unaware / Resistant / Neutral / Supportive / Leading). The current engagement level column is what makes the register a living management tool rather than a one-time snapshot. Review it monthly and update it after every significant stakeholder interaction.

The most common stakeholder management failure is treating the register as an administrative artifact. It is a strategic instrument. Use it to answer the question: which stakeholders have moved from Neutral to Resistant this month, and what is our response?'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET
    description = 'Learn to design and facilitate a project kick-off meeting that creates genuine alignment, surfaces risks early, and builds team momentum from day one.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Project Kick-Off: Preparation & Facilitation',
      'description', 'Learn to design and facilitate a project kick-off meeting that creates genuine alignment, surfaces risks early, and builds team momentum from day one.',
      'transcript', 'The kick-off meeting is the most underutilized alignment tool in project management. Most kick-offs are PowerPoint presentations masquerading as working sessions. The team leaves knowing what the PM said but not necessarily agreeing with it or committed to it. A well-designed kick-off meeting does the opposite: it creates shared understanding, surfaces disagreements early, and generates genuine commitment from every participant.

Preparation is 80% of the work. Three days before the kick-off, confirm attendance from all key stakeholders. If a critical decision-maker cannot attend, reschedule or hold a separate briefing — missing key stakeholders at kick-off creates an accountability gap that is difficult to close later. Send pre-read materials 48 hours in advance: the project charter, the high-level scope, and a list of questions participants should come prepared to answer. Pre-reads prevent the first 20 minutes of every kick-off from being consumed by "let me explain what the project is about."

Design the agenda as a series of outcomes, not topics. Instead of "scope discussion," write "agree on the top 3 scope boundary questions and assign owners for resolution." Instead of "risk review," write "identify the top 5 project risks and assign initial owners." This outcome-framing keeps the meeting forward-moving and ensures you can evaluate at the end whether the meeting succeeded.

A high-performance kick-off agenda runs 90–120 minutes and covers seven outcomes: project purpose alignment (10 minutes), scope walkthrough and boundary confirmation (20 minutes), roles and responsibilities agreement including RACI for key decisions (15 minutes), milestone and governance review (15 minutes), risk and assumption brainstorm (20 minutes), communication and reporting norms (10 minutes), and next steps and immediate actions (10 minutes).

The risk and assumption brainstorm deserves particular focus. Use a structured prompt: "What assumptions are we making that, if proven wrong, would derail this project?" This question surfaces the hidden assumptions that kill projects — the belief that a vendor will deliver on time, that the data quality is good enough, that the users will adopt the new system. Write every assumption on a virtual whiteboard. Review them as a group. Assign owners to validate each critical assumption within two weeks.

Facilitation is a skill. Manage dominant voices by directing questions to quieter participants: "Sara, you''ve been quiet — what''s your view on the integration timeline?" Use the parking lot for important questions that fall outside the agenda scope. Close the meeting with a read-back of every action item, owner, and due date. Send meeting notes within 24 hours.

Your Kick-Off Agenda & Playbook from this lesson is reusable across project types. Adapt the time allocations for project size, but keep the seven outcomes constant.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET
    description = 'Build a library of AI prompts that generate business cases, project charters, feasibility analyses, and stakeholder maps in hours instead of days.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI-Assisted Initiation: Prompting for Charters & Analysis',
      'description', 'Build a library of AI prompts that generate business cases, project charters, feasibility analyses, and stakeholder maps in hours instead of days.',
      'transcript', 'Project initiation involves a significant volume of structured document creation — business cases, charters, feasibility analyses, risk summaries, stakeholder maps. AI compresses the time required for this work dramatically, but only if you know how to prompt effectively. A vague prompt produces a generic output. A structured prompt produces a draft that is 70–80% complete and requires editing rather than creation from scratch.

The anatomy of an effective PM initiation prompt has four components: role (tell the AI what expertise to bring), context (describe the project, organization, and situation), task (specify exactly what to produce), and format (define the structure of the output). The more specific you are on each component, the better the output.

Example: Business Case Draft Prompt. "You are a senior project manager with 15 years of experience in enterprise digital transformation. I am initiating a project to replace our legacy CRM system at a professional services firm with 800 employees. The current system is 12 years old, has no mobile access, and costs $340,000 per year to maintain. Sales cycle data is not integrated with finance, causing manual reconciliation that takes 3 FTEs 2 days per month. Draft a business case with these sections: Executive Summary (2 paragraphs), Problem Statement (with quantified impact), Options Analysis (do nothing, minimal upgrade, full replacement), Financial Case (NPV, ROI, payback period using a 3-year horizon and 10% discount rate), Risk Summary (top 3 risks and mitigations), and Recommendation. Use professional business language suitable for a CFO audience."

Notice what this prompt does: it gives the AI the financial parameters, the audience, the structure, and enough context to make the numbers realistic. The output will require verification of the specific numbers against your actual data, but the structure and argumentation will be solid.

Example: Project Charter Prompt. "Act as an experienced PM drafting a project charter for executive approval. Project: implement Salesforce Sales Cloud to replace our current CRM. Sponsor: Chief Revenue Officer. Timeline: 9 months. Budget: $1.2M. Team: 6 internal, 2 external consultants. Draft a charter covering: purpose (3 sentences, business-outcome focused), scope (inclusions and exclusions), PM authority thresholds, four major milestones with target dates starting from project kickoff in 30 days, and five measurable success metrics. Format as a structured document with headers."

Example: Stakeholder Map Prompt. "I am a PM initiating a cloud migration project at a 2,000-person manufacturing company, moving from on-premises ERP to SAP S/4HANA Cloud. Identify the likely stakeholder groups, classify each using a power/interest matrix, and suggest the primary concern and initial engagement approach for each group. Present as a table with columns: Stakeholder Group, Power (H/M/L), Interest (H/M/L), Primary Concern, Initial Engagement Approach."

Your AI Initiation Prompt Library from this lesson is your personal collection of these vetted prompts. Refine each prompt after every use — note what the AI got right, what required correction, and what context you could add to get better output next time.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ─── MODULE 3 ───────────────────────────────────────────────────────────────
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 2;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M3 chapter not found'; END IF;

  UPDATE public.videos SET
    description = 'Write scope statements that prevent disputes by clearly defining inclusions, exclusions, deliverables, and acceptance criteria for any project type.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scope Definition & Statement of Work',
      'description', 'Write scope statements that prevent disputes by clearly defining inclusions, exclusions, deliverables, and acceptance criteria for any project type.',
      'transcript', 'Scope disputes are the leading cause of project conflict, cost overruns, and relationship damage between PMs, sponsors, and clients. Almost every scope dispute traces back to a scope statement that was ambiguous, incomplete, or never written at all. Your scope statement is your first line of defense.

A scope statement answers five questions: What will be delivered? What is explicitly not included? What does "done" look like for each deliverable? Who accepts the deliverable and by what standard? And what are the boundaries of the project''s responsibility?

Deliverables are tangible outputs — documents, systems, trained users, infrastructure. List every major deliverable explicitly. For a website redesign project, deliverables might include: redesigned homepage and 12 interior pages, updated brand guidelines document, mobile-responsive CSS framework, migrated and validated content for 85 existing pages, and user acceptance testing completion sign-off. Notice the specificity: not "website redesign" but the exact components that constitute the redesign.

Exclusions are as important as inclusions. Explicitly excluded scope items prevent the "I thought that was included" conversation that derails projects and damages trust. For the same website redesign: "Out of scope: new content creation beyond provided copy, SEO optimization, integration with the CRM, e-commerce functionality, hosting migration, and post-launch support beyond 30-day hypercare." Every item on this list represents a conversation that happened — or should have happened — before the project started.

Acceptance criteria define what "acceptable" means for each deliverable. They must be measurable. "The website must load quickly" is not an acceptance criterion. "All pages must achieve a Google PageSpeed Insights score of ≥80 on mobile and ≥90 on desktop" is an acceptance criterion. "All forms must be tested and functional across Chrome, Firefox, Safari, and Edge on the three most recent versions." Measurable criteria eliminate subjective disputes at delivery.

The Statement of Work (SOW) is the contractual version of the scope statement, used with external vendors and clients. It adds legal specificity: payment terms, intellectual property ownership, liability limitations, and dispute resolution procedures. When you sign an SOW with a vendor, you are binding two organizations to a defined set of deliverables and conditions. Ambiguity in the SOW becomes expensive ambiguity in court.

Your Scope Statement from this lesson is a working document, not a contract. Review it at every phase gate and update it to reflect approved scope changes. The scope baseline — the approved, change-controlled version — is what you measure performance against. Any deviation from the scope baseline requires a formal change request, no matter how small it seems in the moment.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET
    description = 'Master the Work Breakdown Structure — how to decompose project work into manageable packages, apply the 100% rule, and build a WBS Dictionary.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Work Breakdown Structure (WBS) Mastery',
      'description', 'Master the Work Breakdown Structure — how to decompose project work into manageable packages, apply the 100% rule, and build a WBS Dictionary.',
      'transcript', 'The Work Breakdown Structure is the foundation of your project plan. Everything else — the schedule, the budget, the resource plan, the risk register — is built on top of it. Get the WBS right and you have a solid foundation. Get it wrong and your schedule estimates will be inaccurate, your resource plan will have gaps, and your team will discover missing work mid-execution.

The WBS is a hierarchical decomposition of the total scope of project work into work packages — the smallest unit of work that can be assigned, estimated, and tracked. It is a deliverable-oriented structure, not a task-oriented structure. This distinction matters. You are not building a to-do list. You are decomposing scope into components, and then decomposing those components into work packages that can be assigned to a single owner with a clear definition of done.

The 100% Rule is the most important principle in WBS construction: the WBS must capture 100% of the work defined in the project scope — nothing more, nothing less. Every deliverable in the scope statement must appear somewhere in the WBS. Every item in the WBS must trace back to the scope statement. If something is in the WBS but not the scope, it should not be there. If something is in the scope but not the WBS, it is missing work — which means missing time, missing budget, and a surprise for your team.

WBS structure typically uses a decimal numbering system. Level 1 is the project itself (1.0). Level 2 is major deliverable categories (1.1 Design, 1.2 Development, 1.3 Testing, 1.4 Deployment). Level 3 is sub-deliverables (1.2.1 Backend API Development, 1.2.2 Frontend UI Development, 1.2.3 Database Migration). Level 4 and below are work packages — specific, assignable units of work (1.2.1.1 Authentication API, 1.2.1.2 Payment Processing API). Work packages should be estimable in hours or days. If a work package is estimated at more than 80 hours, decompose it further.

The WBS Dictionary is the narrative companion to the WBS diagram. For each work package, the dictionary captures: description of work, acceptance criteria, assigned owner, estimated effort in hours, estimated cost, dependencies, and required resources. The dictionary is where the WBS becomes actionable. Without it, the WBS is a picture. With it, it is a management plan.

Common WBS mistakes: confusing tasks with deliverables (tasks belong in the schedule, not the WBS), decomposing to an inappropriate level of detail (too shallow means gaps; too deep means micromanagement), and failing to include project management work as a WBS element. Project management — status reporting, risk management, stakeholder engagement — consumes 10–15% of project effort on average. It must appear in the WBS or it will be invisible in your budget.

Build your WBS collaboratively with the team. The people doing the work know where the gaps are. A PM-drafted WBS that has not been reviewed by the technical leads is a WBS waiting to be surprised.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET
    description = 'Learn to gather and validate requirements using interviews, workshops, and prototypes — then trace every requirement from business need to deliverable using an RTM.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Requirements Elicitation & Traceability Matrix',
      'description', 'Learn to gather and validate requirements using interviews, workshops, and prototypes — then trace every requirement from business need to deliverable using an RTM.',
      'transcript', 'Requirements are the bridge between stakeholder needs and project deliverables. Weak requirements produce systems that work exactly as specified but not the way users actually need them to work. Strong requirements are complete, unambiguous, measurable, and traceable from business objective through to test case.

Requirements elicitation is not the same as requirements gathering. Gathering implies that requirements exist and simply need to be collected. Elicitation recognizes that most stakeholders do not know how to articulate what they need — you have to draw it out through structured techniques.

Interviews are your highest-bandwidth elicitation technique. Schedule 45-minute one-on-one sessions with each key stakeholder. Use open-ended questions to explore: "Walk me through your current workflow on a typical Monday morning." Follow the workflow question with problem probes: "Where does this break down? What takes longer than it should? What information do you not have that you wish you did?" Close with validation: "If the new system did X, Y, and Z, would that address what you''ve described?" Interviews surface requirements that no workshop will ever produce, because people speak more freely one-on-one.

Requirements workshops (also called JAD sessions — Joint Application Design) bring multiple stakeholders together to build shared requirements in real time. The facilitator''s job is to surface and resolve conflicts: what one department calls a priority, another calls unnecessary overhead. Resolving these conflicts in a workshop is far cheaper than resolving them in UAT. Use structured exercises: "Write down the three things the system must do to make your job easier" (sticky notes), then affinity map the results. This technique consistently produces richer requirements than open discussion.

Prototyping and wireframing are increasingly important elicitation tools. Stakeholders respond more accurately to visual representations than verbal descriptions. A wireframe of the new dashboard will surface 10 requirements that no interview would have revealed — because seeing the design makes concrete what was previously abstract.

The Requirements Traceability Matrix (RTM) links every requirement to its source, its implementation artifact, and its test case. A minimal RTM has these columns: Requirement ID, Requirement Description, Business Objective (which objective does this serve?), Source (who stated this requirement?), Priority (Must Have / Should Have / Nice to Have using MoSCoW), WBS Element (where in the WBS does this get built?), and Test Case ID (how will we verify this is complete?). The RTM answers two critical questions during execution: are we building everything we promised? And are we building anything we did not promise?

Requirement priority is where scope management begins. MoSCoW prioritization — Must Have, Should Have, Could Have, Won''t Have — forces explicit trade-off conversations before the schedule and budget are set. Must Have requirements define the minimum viable product. Everything else is negotiable when constraints tighten.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET
    description = 'Establish the scope baseline and learn to manage changes through a structured Change Control Board process, impact assessment, and change log discipline.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scope Baseline & Integrated Change Control',
      'description', 'Establish the scope baseline and learn to manage changes through a structured Change Control Board process, impact assessment, and change log discipline.',
      'transcript', 'Once you have your scope statement, WBS, and requirements documented and approved, you have your scope baseline. The scope baseline is not a wish list — it is the approved, change-controlled definition of what this project will deliver. Everything after this point is measured against the baseline. Changes to the baseline are not automatic — they require analysis, approval, and integration into the updated plan.

Integrated Change Control is the process that manages all changes to the project — scope, schedule, cost, and quality. The word "integrated" is critical: a scope change has implications for the schedule and cost. A cost reduction mandate has implications for scope and quality. Change control must analyze the entire system impact of every proposed change, not just the dimension where the change originated.

The Change Control Board (CCB) is the governance body that approves or rejects changes above the PM''s authority threshold. CCB composition varies by project: for an enterprise IT project, the CCB typically includes the IT Director, the Business Sponsor, the Finance Representative, and the PM. For a large construction project, it includes the Owner''s Representative, the Architect, the General Contractor PM, and sometimes the Structural Engineer for changes affecting structure.

Every change request follows the same process. First, submission: the requestor documents the proposed change, the business justification, and the desired outcome. Second, impact assessment: the PM and relevant leads analyze the impact on scope, schedule, cost, quality, risk, and stakeholder relationships. This analysis should be completed within five business days for most changes. Third, CCB decision: approve, reject, defer, or request more information. Fourth, implementation: approved changes are incorporated into the baseline and all affected plans. Fifth, communication: all stakeholders who need to know about the change are informed.

The change log is your accountability document. It records every change request — approved and rejected — with date submitted, description, requestor, impact assessment summary, CCB decision, decision date, and implementation status. The change log tells the story of how your project evolved from baseline to final delivery. At project close, it is one of your most valuable lessons learned artifacts: which changes came from which stakeholders, what they cost, and whether the outcomes justified the investment.

Scope creep is different from change control. Scope creep happens when work is added to the project without going through the formal change process — a developer adds a feature because a user asked nicely, a PM agrees verbally to include additional functionality without assessing the impact. Scope creep is insidious because each individual instance seems small. Cumulatively, it adds 20–30% to project cost and schedule on poorly controlled projects. The antidote is discipline: every change, regardless of size, goes through the process. "That sounds simple to add" is never a reason to skip change control.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET
    description = 'Use AI to identify scope gaps, generate requirements from project briefs, and audit WBS completeness with structured prompt sets for scope management.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI for Scope Documentation & Gap Analysis',
      'description', 'Use AI to identify scope gaps, generate requirements from project briefs, and audit WBS completeness with structured prompt sets for scope management.',
      'transcript', 'Scope management is one of the highest-leverage areas for AI assistance in project management. The documents are structured, the logic is testable, and the consequences of gaps are severe. AI cannot replace the stakeholder judgment required to define scope, but it can dramatically accelerate the documentation process and systematically surface gaps that human reviewers miss.

The most valuable AI scope application is gap analysis. After you draft your WBS or requirements list, give it to an AI model and ask it to audit for completeness against your scope statement. The prompt structure: "Here is the scope statement for my project: [paste scope statement]. Here is my current WBS: [paste WBS]. Identify: (1) items in the scope statement not reflected in the WBS, (2) items in the WBS with no clear traceability to the scope statement, (3) common work packages for this project type that appear to be missing from the WBS. Format as a structured gap analysis table."

This audit technique catches the work that gets forgotten: project management activities, testing phases, training, cutover activities, hypercare periods, and documentation. These are the items that are always in scope but frequently missing from the WBS because they feel administrative rather than technical.

For requirements generation from a brief, the prompt structure is: "You are a business analyst working on a [project type] project for [industry]. Based on this project brief: [paste brief], generate a comprehensive requirements list covering functional requirements, non-functional requirements (performance, security, usability, reliability), integration requirements, and data migration requirements. For each requirement, classify as Must Have, Should Have, or Could Have using MoSCoW. Identify any ambiguous areas where additional stakeholder input is required."

AI-generated requirements lists serve as checklists for your elicitation interviews. They surface categories of requirements you might not have thought to ask about — security and compliance requirements are frequently missed by PMs without a technical background, for example. AI-generated lists ensure those conversations happen.

For SOW review and risk identification: "Review this Statement of Work and identify: (1) ambiguous terms that could lead to scope disputes, (2) missing acceptance criteria, (3) undefined assumptions, (4) clauses that expose the PM or organization to unusual risk. Provide specific text recommendations for each identified issue."

Your AI Scope Audit Prompt Set is a library of these tested prompts, organized by use case. Each prompt includes the template, the expected output format, and notes on what human review is required before using the AI output in a project document. AI output on scope questions always requires expert validation — the AI does not know your specific organizational context, political constraints, or technical environment. Use it as a rigorous first-pass reviewer, not a final authority.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ─── MODULE 4: Schedule Management & Critical Path ──────────────────────────
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 3;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M4 chapter not found'; END IF;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Schedule Planning & Network Diagrams',
    'description', 'Master activity definition, sequencing, and dependency mapping using PDM and AON to construct network diagrams that form the foundation of your schedule.',
    'transcript', 'Every project schedule starts with a network diagram, and every network diagram starts with a question: what must happen before this can start? Your ability to answer that question systematically — for every activity in the project — is the difference between a schedule that holds and one that collapses at the first dependency conflict.

Activity definition is step one. Break your WBS work packages into discrete activities — the smallest unit of work that can be assigned, estimated, and tracked. A rule of thumb: an activity should not span more than one reporting period. If your reporting cycle is weekly, no single activity should take more than a week. Activities longer than that hide progress problems.

Sequencing uses four dependency types in the Precedence Diagramming Method (PDM). Finish-to-Start (FS): Activity B cannot start until A finishes. This is the default and covers 80% of dependencies. Start-to-Start (SS): B cannot start until A starts — used in parallel work where one activity enables another. Finish-to-Finish (FF): B cannot finish until A finishes — used in documentation that must complete after its reference work. Start-to-Finish (SF): rare, almost exclusively in just-in-time manufacturing.

Leads and lags refine your relationships. A lag adds delay between activities — you paint a room, then wait 24 hours (lag) before applying the second coat. A lead creates overlap — you can start testing (B) 3 days before development (A) finishes if the first batch of features is ready early. Be precise with leads and lags. Vague overlaps create the schedule padding that makes project estimates meaningless.

Network diagrams in Activity-on-Node (AON) format show each activity as a box, with arrows representing dependencies. Build yours left to right. The start node connects to all activities with no predecessors. The end node receives all activities with no successors. The path through the network from start to end that has the longest total duration is your critical path.

Your deliverable is a complete Network Diagram for your project, with all activities sequenced, all dependency types annotated, and all leads and lags specified. Before you move to duration estimating, walk the network with your team and ask: "Is there any reason B cannot start exactly when A finishes?" That conversation surfaces constraints, resource conflicts, and external dependencies that the diagram itself cannot capture.'
  )) WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Critical Path Method (CPM) & Float Analysis',
    'description', 'Find the critical path, calculate total and free float, and identify schedule risk hot spots that require proactive management.',
    'transcript', 'The critical path is the longest sequence of dependent activities in your network. Any delay on the critical path delays the project end date by exactly that amount. This is not a theory — it is a mathematical certainty. Your most important job as a scheduler is to know your critical path at all times and to actively manage the activities on it.

Calculate the critical path using forward and backward passes. In the forward pass, work left to right: the Early Start (ES) of the first activity is zero. The Early Finish (EF) = ES + Duration. The ES of each successor = EF of its predecessor. At a merge point (multiple predecessors), take the latest EF. The project EF at the end node is your calculated project duration.

In the backward pass, work right to left: the Late Finish (LF) of the last activity equals the project EF. The Late Start (LS) = LF − Duration. The LF of each predecessor = earliest LS of its successors. At burst points (multiple successors), take the earliest LS.

Total Float (TF) = LS − ES = LF − EF. Activities with TF = 0 are on the critical path. They have zero scheduling flexibility. Free Float (FF) = ES of next activity − EF of current activity. Free float tells you how much an activity can slip before it delays its immediate successor (not the whole project).

A practical example: you have four paths through your network. Path A = 15 days (critical). Path B = 13 days (TF = 2). Path C = 12 days (TF = 3). Path D = 11 days (TF = 4). The critical path is A. But if Path B slips 2 days, you now have two critical paths — double the risk. Monitor near-critical paths (TF ≤ 3 days) as carefully as the critical path itself.

Your Critical Path Analysis deliverable identifies: the critical path sequence and total duration, the total float for every non-critical activity, the three activities on the critical path with the highest duration uncertainty (your top schedule risks), and the near-critical paths requiring monitoring. Review this analysis with your team before baselining the schedule.'
  )) WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Resource-Loaded Schedules & Gantt Charts',
    'description', 'Assign resources to activities, identify over-allocation, and balance workload to create a realistic, executable schedule baseline.',
    'transcript', 'A schedule without resource loading is a wish list. The critical path tells you the minimum time the project could take if resources were unlimited. Resource loading tells you how long it will actually take given the people, equipment, and budget you have. These two numbers are rarely the same, and the gap between them is where most schedule problems are born.

Resource loading starts with resource assignment: for each activity, identify who or what is required, in what quantity, and for how long. Assign resources at the activity level, not the work package level. "The development team works on Feature X for 3 weeks" is not a resource-loaded schedule. "Alice (senior developer, 100%) and Bob (junior developer, 50%) work on Feature X from days 15-35" is.

Once resources are assigned, analyze the resource histogram — a bar chart showing daily resource demand over time for each resource type. Over-allocation occurs when a resource is assigned to more work than their available capacity in a given period. An 8-hour-per-day developer assigned to three parallel activities requiring 4 hours each is over-allocated by 4 hours per day. This creates two risks: the schedule assumes she works 12-hour days (unrealistic) or the activities take longer than estimated (the more likely outcome).

Resolve over-allocation using resource leveling or resource smoothing. Leveling delays activities (using float) to spread demand within capacity. Smoothing shifts resource assignments within float limits to flatten peaks. Leveling may extend the project duration; smoothing does not but may not fully resolve conflicts.

A resource-loaded Gantt chart shows activities as bars on a timeline, with resource assignments annotated. Dependencies appear as arrows connecting activity bars. The critical path is typically highlighted in red. This is the visualization your team works from every day — it shows who is doing what and when, and it makes conflicts visible before they become crises.

Your Resource-Loaded Schedule deliverable is the Gantt chart with full resource assignments, over-allocation flagged and resolved, and a resource histogram showing demand vs. capacity for each key resource type. This document, once reviewed and approved by your team, becomes the schedule baseline — the reference point against which you will measure actual progress for the life of the project.'
  )) WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Schedule Compression: Crashing & Fast-Tracking',
    'description', 'Apply crashing and fast-tracking techniques to compress the schedule when time is the primary constraint, with clear analysis of cost and risk trade-offs.',
    'transcript', 'At some point in almost every project, the schedule is under pressure. A milestone slips, a dependency arrives late, or the sponsor moves the go-live date forward. When this happens, you have two tools: crashing and fast-tracking. Understanding when to use each — and the trade-offs of each — is a core PM competency.

Crashing adds resources to critical path activities to reduce their duration. The key principle: you can only crash activities on the critical path. Adding resources to non-critical activities does not shorten the project. Crashing always increases cost, often disproportionately. The crash cost per day is the additional cost of adding resources divided by the days saved. Always crash the cheapest activity first — that is, the activity with the lowest crash cost per day.

Example: your project is 5 days behind. You have three critical path activities you can crash. Activity A: costs $2,000 to save 3 days ($667/day). Activity B: costs $1,500 to save 2 days ($750/day). Activity C: costs $4,000 to save 4 days ($1,000/day). Crash A first (cheapest), then B if needed. Do not crash the full project to recover all 5 days without first checking whether crashing A creates a new critical path that requires addressing B or C.

Fast-tracking overlaps activities that were planned sequentially. Instead of completing design before starting construction, you begin construction on the first phase while design continues on later phases. Fast-tracking does not add cost — but it adds significant risk. Rework risk is the primary concern: if the design of later phases requires changes to what was already built, you pay twice. Fast-tracking is appropriate when: (1) the downstream activity can proceed using assumptions about the upstream deliverable, and (2) those assumptions have a high probability of being correct.

Your Schedule Compression Analysis documents each option: the activity, the compression method, the days saved, the cost impact (for crashing), the rework risk (for fast-tracking), and the net recommendation. Present this analysis before committing to any compression — stakeholders who push for earlier dates need to understand what they are paying for, in cost or risk, to achieve them.'
  )) WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'AI-Powered Scheduling & Predictive Timeline Analysis',
    'description', 'Use AI tools to optimize schedules, predict delays before they occur, and run what-if scenario analysis to defend your timeline to stakeholders.',
    'transcript', 'AI is transforming schedule management from a backward-looking reporting exercise into a forward-looking early warning system. The PM who waits for the schedule to slip before taking action is being managed by the schedule. The PM who uses predictive analytics to detect slip signals 2-3 weeks before they materialize is managing the schedule.

Modern AI scheduling tools operate in three modes. Detection: analyzing your current project data (burn rate, velocity, task completion rates, resource utilization) to identify patterns that historically precede schedule overruns. Prediction: forecasting completion dates with confidence intervals based on current trajectory. Recommendation: suggesting specific interventions — resequencing, resource reallocation, scope adjustment — and modeling their impact before you implement them.

Jira''s AI features, for example, track sprint velocity trends and flag when a team''s throughput is declining before it causes a missed sprint. Microsoft Project''s AI analyzes task completion rates and resource utilization to predict whether each milestone will be met. Smartsheet''s Control Center uses AI to aggregate schedule data across multiple projects and surface portfolio-level risks.

The most powerful scheduling AI application is what-if scenario analysis. Present the AI with your current schedule, your resource constraints, and a change (a key resource taking two weeks off, a vendor delivering three weeks late, a scope addition requiring 40 additional hours). The AI models the impact across all downstream activities in seconds — work that would take a human PM hours in even a well-structured spreadsheet.

To use AI effectively for scheduling, your data must be clean. AI cannot predict what it cannot see. If your task completion status is not updated weekly, your resource assignments are not accurate, or your schedule does not reflect actual scope, AI analysis will produce confident-sounding nonsense. Data discipline is the prerequisite for AI intelligence.

Your AI Schedule Intelligence Report documents: the AI tools in use, the specific signals the tools monitor, the thresholds that trigger PM review, the results of one what-if scenario relevant to your project, and the actions taken based on AI recommendations. This report demonstrates to stakeholders that your schedule management is proactive, data-driven, and verifiable.'
  )) WHERE chapter_id = v_ch AND order_index = 5;

-- ─── MODULE 5: Risk Management ───────────────────────────────────────────────
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 4;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M5 chapter not found'; END IF;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Risk Identification Techniques & Risk Register',
    'description', 'Apply brainstorming, SWOT, assumption analysis, and expert judgment systematically to build a comprehensive risk register that captures what others miss.',
    'transcript', 'Risk identification is not a meeting. It is a discipline. Most project failures are not caused by risks that were unforeseeable — they are caused by risks that were foreseeable but were not identified, recorded, or acted on. Your job as a PM is to build a culture and a process where risks surface early, before they become issues.

Start with brainstorming. Bring together your project team, key stakeholders, and subject matter experts. Set a rule: no evaluation during brainstorming. Every risk gets written down, no matter how unlikely. Evaluation comes later. Use prompt questions to break groupthink: What assumptions are we making that might be wrong? What are we planning to do for the first time? Where do we depend on things we cannot control? What went wrong on similar projects?

Supplement brainstorming with structured techniques. Assumption analysis: list every assumption in your project plan (vendor delivers on schedule, system can handle 10,000 concurrent users, regulatory approval takes 6 weeks). For each assumption, ask: what happens if this is wrong? High-impact assumptions that might be wrong are risks. SWOT analysis applied to the project reveals threats (risks) alongside weaknesses and opportunities. Checklists from past project lessons learned ensure you capture the risks your organization has already experienced.

Document every identified risk in the Risk Register with: a unique ID, a clear risk statement in "cause → risk event → impact" format ("Due to [cause], [risk event] may occur, which would result in [impact]"), the category (technical, schedule, cost, stakeholder, external), the risk owner, and the date identified. The "cause → event → impact" format is critical because it forces specificity. "Schedule risk" is not a risk statement. "Due to our dependency on the regulatory authority for approval, approval may be delayed beyond week 8, which would delay the project go-live by a minimum of 4 weeks and increase costs by $40,000" is a risk statement.

Your Risk Register is a living document updated throughout the project lifecycle. New risks are added as they are identified. Existing risks are reviewed and updated at each project status meeting. Risks that materialize become issues and move to the Issue Log. Risks that do not occur are closed with a note on why they did not materialize — this institutional knowledge improves future risk identification on similar projects.'
  )) WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Qualitative Risk Analysis & Prioritization',
    'description', 'Score risks using the probability-impact matrix and prioritize the critical few from the trivial many to focus your risk management energy where it matters.',
    'transcript', 'After identifying risks, your next challenge is prioritization. A project with 50 risks cannot actively manage all 50 simultaneously. Qualitative risk analysis gives you a systematic, defensible method to rank risks and focus your attention on the ones that genuinely threaten the project.

The probability-impact matrix is the standard tool. For each identified risk, estimate: the probability of occurrence (typically Low/Medium/High or on a 0.1-0.3-0.5-0.7-0.9 scale) and the impact on the project if it occurs (Low/Medium/High or on a 0.05-0.1-0.2-0.4-0.8 scale, covering scope, schedule, cost, and quality impacts). The risk score = Probability × Impact. High scores indicate priority risks requiring active response strategies. Low scores may be accepted and simply monitored.

Define your scales before you start scoring — this is where most teams go wrong. "High probability" means different things to different people. In one organization it might mean "more than 70% chance." In another it might mean "almost certain." Define your thresholds at the start of the risk planning process and document them in your Risk Management Plan. Consistent definitions produce comparable scores.

The probability-impact matrix also reveals your risk appetite as an organization. Some organizations treat a 30% chance of a $100,000 impact ($30,000 expected value) the same as a 3% chance of a $1,000,000 impact ($30,000 expected value). Others weight catastrophic low-probability events much higher because the organization cannot absorb a $1M loss even if it is unlikely. Your matrix thresholds should reflect this.

Risk categories help you analyze concentration. If 15 of your 20 high-priority risks are in the "vendor dependency" category, that is a structural issue — you are over-dependent on external parties and need a mitigation strategy that addresses the category, not just individual risks. Category analysis produces better risk responses than addressing risks in isolation.

Your Risk Heat Map is a visual output of the matrix: risks plotted in the probability-impact grid, color-coded by priority (red = high, yellow = medium, green = low). Present this to your sponsor and steering committee. The heat map makes risk concentration visible at a glance and creates shared understanding of where the project''s danger zones are.'
  )) WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Quantitative Risk Analysis & Monte Carlo Simulation',
    'description', 'Apply EMV, decision trees, and Monte Carlo simulation to quantify risk exposure in dollars and days and defend your contingency reserves with data.',
    'transcript', 'Qualitative analysis tells you which risks to prioritize. Quantitative analysis tells you what they are worth — in dollars and in schedule days. This distinction matters when you are defending your contingency reserve to a finance committee or explaining to a sponsor why the project might take 15 weeks instead of 12.

Expected Monetary Value (EMV) is the foundation of quantitative risk analysis. EMV = Probability × Impact (in dollars). A 40% chance of a $50,000 cost overrun has an EMV of $20,000. A 20% chance of a $100,000 cost overrun also has an EMV of $20,000. But a 5% chance of a $400,000 regulatory penalty has an EMV of $20,000 while representing a very different kind of risk. EMV is a starting point for comparison, not a substitute for judgment.

Decision trees use EMV to evaluate choices between alternatives. Draw the decision node (square), decision branches, chance nodes (circles), probability branches from each chance node, and the outcomes at each path end. Work right to left: multiply probabilities × outcomes at each path, sum them at each chance node, then compare totals at the decision node. The branch with the highest EMV is the quantitatively superior choice — though strategic factors may override the math.

Monte Carlo simulation is the most powerful quantitative risk tool available to PMs. Instead of single-point estimates for activity durations and costs, you enter ranges (optimistic, most likely, pessimistic — matching the PERT three-point format). The simulation runs thousands of project scenarios, varying durations within those ranges, and produces a probability distribution of project completion dates and costs. The output answers questions single-point schedules cannot: "What is the probability we finish by August 1st?" Answer: 42%. "What date are we 80% confident we can meet?" Answer: September 15th.

Tools like Oracle Risk Analyzer, Primavera Risk Analysis, and even spreadsheet-based Monte Carlo add-ins make this analysis accessible. The Quantitative Risk Report documents your methodology, the key inputs (three-point estimates for critical path activities, cost ranges for major cost elements), the simulation outputs (S-curve showing probability of completion by date), and the contingency reserve recommendation: typically the difference between the 50th percentile outcome (your budget baseline) and the 80th percentile outcome (your budget with contingency).'
  )) WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Risk Response Strategies & Contingency Planning',
    'description', 'Select and implement the right response strategy for each risk — avoid, mitigate, transfer, or accept — and build contingency plans that actually work under pressure.',
    'transcript', 'Risk identification and analysis are preparation. Risk response is where you take action. A risk register full of beautifully analyzed risks that has no response strategies is a documentation exercise, not risk management. For every high-priority risk, you need a planned response before the risk occurs.

The four threat response strategies are: Avoid (eliminate the risk entirely by changing the plan), Mitigate (reduce probability or impact), Transfer (shift the risk to another party), and Accept (acknowledge the risk and deal with it if it occurs). Choose based on cost-benefit: the cost of the response should not exceed the expected value of the risk.

Avoid is the strongest response but not always feasible. If you are at risk of a key vendor defaulting, you could avoid by using a different vendor or building the capability in-house. If vendor selection is already locked in, avoidance is no longer an option. Avoid by changing scope, schedule, approach, or supplier — not by hoping the risk goes away.

Mitigate reduces probability or impact. Probability reduction: adding a second reviewer to a process reduces the probability of a defect making it through. Impact reduction: building a rollback plan for a system cutover reduces the impact if the cutover fails. Most mitigation strategies reduce impact rather than probability, because impact is often more controllable than probability.

Transfer shifts financial exposure to another party. Insurance transfers risk to the insurer. Fixed-price contracts transfer cost risk to the vendor. Service-level agreements with financial penalties transfer delivery risk to the supplier. Transfer does not eliminate the risk — it reallocates who bears the financial consequences if it occurs.

Accept means doing nothing proactively. Active acceptance: acknowledging the risk and setting aside a contingency reserve to fund the response if it occurs. Passive acceptance: logging the risk and dealing with it reactively. Reserve active acceptance for low-priority risks. Never passively accept a high-priority risk.

Contingency plans are pre-planned responses for accepted risks. The best contingency plan is specific: "If the primary data migration fails validation by November 1st, we will revert to the backup migration approach (documented in Appendix B), deploy the contingency resources (2 additional database engineers on standby), and invoke the extended go-live window already negotiated with the operations team." Vague contingency plans ("we will assess the situation") are not plans — they are statements of intention to panic.'
  )) WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'AI for Predictive Risk Detection & Early Warning Systems',
    'description', 'Use AI to mine historical data, detect early warning signals in project metrics, and build an automated risk monitoring dashboard that surfaces threats before they escalate.',
    'transcript', 'Traditional risk management is reactive. You identify risks upfront, update the register periodically, and respond when risks materialize into issues. AI makes risk management predictive: detecting the early signals of risk escalation in your project data before any human reviewer would notice them.

AI risk detection works by pattern matching. Machine learning models trained on historical project data learn the leading indicators of schedule slippage, cost overrun, and stakeholder disengagement. When your current project data matches those patterns, the AI flags it — days or weeks before the risk would be visible in your schedule or budget reports.

Common leading indicators that AI monitors: task completion rate trends (declining completion rates predict future schedule slippage 2-3 weeks before it shows up in earned value), meeting attendance patterns (stakeholders who stop attending status meetings are disengaging — a leading indicator of escalation or requirement changes), action item aging (open action items older than 14 days predict downstream delays), team communication sentiment analysis (increasingly negative or terse communication in project channels predicts team morale issues before they affect productivity), and risk register dormancy (risks that have not been reviewed in 30+ days are often risks that have quietly escalated).

To build an AI Risk Monitoring Dashboard, you need three things: data connections (your project management tool, communication platform, and financial system must feed the AI in real time or near-real time), defined thresholds (what signal levels trigger PM review versus automatic escalation), and a review cadence (AI flags should be reviewed by a human PM at least weekly — AI identifies patterns, humans make decisions).

Practical implementation for most PMs today: use Jira Insights or similar tools for project metric monitoring, Microsoft Copilot for trend analysis in your project documents, and custom Power BI dashboards pulling from your PM tools for executive-level risk visibility. Full ML-powered risk prediction requires data science resources — but basic predictive monitoring using these tools is accessible to any team.

Your AI Risk Monitoring Dashboard documents: the data sources feeding the system, the six key metrics being monitored with their threshold values, the alert routing (who is notified of what), and the historical accuracy of risk flags over the past three reporting periods. The last element is critical — AI risk tools must be calibrated and their accuracy tracked, or you will either ignore genuine warnings or drown in false positives.'
  )) WHERE chapter_id = v_ch AND order_index = 5;

-- ─── MODULE 6: Financial Management & Earned Value ───────────────────────────
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 5;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M6 chapter not found'; END IF;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Cost Estimation Techniques & Accuracy Ranges',
    'description', 'Apply analogous, parametric, bottom-up, and three-point PERT estimating with the right accuracy range for each project phase.',
    'transcript', 'Cost estimation is not a single activity performed once at project start. It is an iterative process that becomes progressively more accurate as the project scope is better defined. Understanding which technique to use at each phase — and what accuracy range to communicate to stakeholders — is essential for managing expectations and building credibility.

Analogous estimating uses actual costs from similar past projects as the basis for your current estimate. If your organization built a similar system for $2.4M last year, analogous estimating suggests this project will cost approximately $2.4M ± 30%. It is fast, requires minimal project detail, and is appropriate in the initiation phase when scope is still being defined. Accuracy range: −25% to +75%. The wide range reflects the limited project definition at this stage.

Parametric estimating uses statistical relationships between project characteristics and cost. A software development team that costs $50,000 per month developing at 100 story points per month will cost $500 per story point. If the backlog contains 800 story points, the parametric estimate is $400,000 for development labor. Accuracy improves significantly with more calibration data. Accuracy range: −10% to +25%.

Bottom-up estimating decomposes the project to the work package level, estimates each work package independently, and aggregates. It is the most accurate technique, requires the most time and information, and is only feasible when the scope is sufficiently defined. Accuracy range: −5% to +10%.

Three-point estimating (PERT) accounts for estimation uncertainty by combining three scenarios. Optimistic (O): the best-case cost if everything goes right. Most Likely (M): the most realistic cost given normal conditions. Pessimistic (P): the worst-case cost if significant problems occur. The PERT estimate = (O + 4M + P) / 6. The standard deviation = (P − O) / 6. For a work package: O=$80K, M=$100K, P=$160K. PERT estimate = (80 + 400 + 160) / 6 = $107K. This is more conservative than the most likely estimate because it mathematically weights the pessimistic scenario.

Your Cost Estimate document presents the estimate by WBS level, the technique used for each element, the confidence level, and the accuracy range. It explicitly states the assumptions underlying the estimate. Estimates without documented assumptions are not estimates — they are guesses that stakeholders will treat as commitments.'
  )) WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Budget Development & Cost Baseline',
    'description', 'Aggregate cost estimates into a project budget, establish the cost baseline, and set management and contingency reserves correctly.',
    'transcript', 'A project budget is not just an aggregation of cost estimates. It is a financial commitment structure with multiple layers, each serving a different purpose. Understanding the difference between the cost baseline, contingency reserves, and management reserves — and who has authority over each — is fundamental to sound project financial management.

Start with the activity cost estimates from your Work Package level. Aggregate them to the WBS level. Sum across WBS to get the project cost estimate. This bottom-up total represents the cost of doing all the work with no allowance for uncertainty.

Contingency reserve is added to the cost estimate to cover the known unknowns — the risks in your Risk Register that have a probability < 100% of occurring. The standard approach: sum the EMV of all risks you have accepted (probability × impact), and add that to your estimate. If your risk register identifies $180,000 of accepted-risk EMV, your contingency reserve is $180,000. The contingency reserve is included in the project cost baseline and is controlled by the PM. You draw on it by following the risk response plan — not by reallocating budget from other line items.

Management reserve covers unknown unknowns — risks that are unforeseeable at project start. It is typically 5-15% of the total project budget, held by the project sponsor or management, and requires sponsor approval to access. The PM does not control the management reserve.

The cost baseline = cost estimates + contingency reserve. It is the authorized budget for the project, time-phased across the schedule. The S-curve plot of cumulative planned budget over time is your planned value baseline — the reference against which earned value is measured.

Your Cost Baseline document includes: the budget by WBS element and by time period, the contingency reserve with risk register traceability (each reserve dollar tied to a specific risk), the management reserve amount and governance process, and the total project budget (baseline + management reserve). Present this with the risk register when seeking budget approval so stakeholders understand what the contingency is covering and why it is appropriate.'
  )) WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Earned Value Management: CPI, SPI & Variance Analysis',
    'description', 'Master the EVM metrics — EV, PV, AC, CPI, SPI, CV, SV — to produce credible performance reports that tell stakeholders exactly where the project stands.',
    'transcript', 'Earned Value Management (EVM) is the most powerful project performance measurement system available. It integrates scope, schedule, and cost into a single set of metrics that tell you not just where you are, but whether you are trending toward success or failure. Once you master EVM, you will never present a simple percentage-complete report again.

Three foundational values anchor everything. Planned Value (PV): the budgeted cost of work scheduled to be completed by today. Earned Value (EV): the budgeted cost of work actually completed by today. Actual Cost (AC): the actual money spent on work completed by today.

Variances: Cost Variance (CV) = EV − AC. Positive CV means under budget. Negative CV means over budget. Schedule Variance (SV) = EV − PV. Positive SV means ahead of schedule. Negative SV means behind schedule. Note: SV is measured in dollars, not days — a limitation of EVM that you address by maintaining a separate schedule analysis.

Performance indices: Cost Performance Index (CPI) = EV / AC. CPI = 1.0 means you are getting exactly $1 of value for every $1 spent. CPI = 0.85 means you are getting $0.85 of value per $1 spent — you are 15% over budget in efficiency terms. Schedule Performance Index (SPI) = EV / PV. SPI = 0.90 means you are completing 90% of the planned work per time period.

A practical example: on day 30 of a 90-day project, you planned to complete 30% of the work (PV = $300,000 of a $1,000,000 budget). You have actually completed 25% of the work (EV = $250,000). You have spent $310,000 (AC = $310,000). CV = $250K − $310K = −$60,000 (over budget). SV = $250K − $300K = −$50,000 (behind schedule). CPI = 250/310 = 0.81. SPI = 250/300 = 0.83. This project is both over budget and behind schedule, and the indices tell you it is trending toward significant overruns.

Your EVM Dashboard presents PV, EV, and AC on a cumulative S-curve with a performance table showing CV, SV, CPI, and SPI for the current period. Update it weekly. A CPI that drifts below 0.90 and stays there is a significant warning signal — historical research shows that CPI rarely improves by more than 0.10 after the first 20% of a project is complete.'
  )) WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Financial Forecasting: EAC, ETC & Variance at Completion',
    'description', 'Calculate EAC, ETC, and VAC to forecast final project cost with confidence intervals and give stakeholders honest projections they can act on.',
    'transcript', 'Status reporting tells stakeholders where the project stands today. Forecasting tells them where it will end up. Stakeholders who must make resource, budget, and scope decisions need accurate forecasts. The EVM forecasting formulas give you a defensible, data-driven answer to the question every sponsor asks: "How much is this going to cost at the end?"

Estimate at Completion (EAC) is the projected total cost to complete the project based on current performance. Three formulas reflect three assumptions:

EAC = AC + ETC: use when you believe current performance is not representative of future performance (a specific problem has been resolved). Requires a bottom-up re-estimate of remaining work.

EAC = BAC / CPI: use when you believe current efficiency will continue through project completion. This is the most commonly validated formula. BAC = Budget at Completion (your original total budget). If BAC = $1,000,000 and CPI = 0.81, EAC = $1,234,568. You are projected to overspend by $234,568.

EAC = AC + (BAC − EV) / CPI: a variation that accounts for both sunk costs and projected efficiency for remaining work. More conservative than BAC/CPI for projects early in execution.

Estimate to Complete (ETC) = EAC − AC. This is how much more money you need to spend to finish the project. Budget the ETC, not the EAC — the AC is already spent.

Variance at Completion (VAC) = BAC − EAC. Negative VAC means the project will finish over budget. In the example above, VAC = $1,000,000 − $1,234,568 = −$234,568.

To Complete Performance Index (TCPI) = (BAC − EV) / (BAC − AC). TCPI tells you the CPI you must achieve on all remaining work to finish within the original budget. TCPI = ($1,000,000 − $250,000) / ($1,000,000 − $310,000) = $750,000 / $690,000 = 1.09. You need to perform at 9% better efficiency than your original plan for the rest of the project to recover to budget. Compare TCPI to current CPI: if TCPI > 1.10 and CPI < 1.0, recovery is unrealistic without scope reduction or budget increase.

Your Financial Forecast Report presents all five values (EAC, ETC, VAC, TCPI, and current CPI) with a plain-language interpretation for your sponsor. Never present the numbers alone — always include the "what this means" statement.'
  )) WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'AI-Powered Financial Monitoring & Reporting',
    'description', 'Use AI to detect cost anomalies, automate EVM calculations, and generate executive-ready financial summaries that keep sponsors informed without manual reporting overhead.',
    'transcript', 'Manual financial reporting consumes enormous PM time and is consistently error-prone. The PM who spends four hours every Friday pulling cost data from three systems, calculating EVM metrics in a spreadsheet, and formatting an executive summary is not doing project management — they are doing data entry. AI eliminates most of this work and makes financial monitoring continuous rather than weekly.

AI financial monitoring operates at three levels. Anomaly detection: AI compares actual spending patterns against the plan and flags deviations before they appear in formal reports. A contractor who was billing $8,000 per month for six months suddenly bills $15,000 in month seven — the AI flags this as an anomaly for PM review before the invoice is approved. This catches billing errors, scope creep, and unauthorized work before they become budget problems.

Automated EVM calculation: connect your time tracking system, procurement system, and project management tool to an AI-powered dashboard. The EVM metrics update automatically as time is logged and invoices are processed. You see today''s CPI and SPI, not last Friday''s. This real-time visibility means you catch negative trends 5-10 days earlier than in a weekly reporting cycle.

Executive summary generation: AI drafts the financial narrative for your status report. Feed it the current EVM data and ask it to produce a paragraph explaining performance and what it means for project completion. The prompt: "CPI = 0.87, SPI = 0.94, EAC = $1.15M vs. BAC = $1.0M. Write a 3-sentence financial summary for an executive audience that explains current performance, the projected overrun, and the primary cause (from the following context: [describe the cause])." Review and adjust the AI draft, but stop writing financial summaries from scratch.

The AI Finance Prompt Set is your collection of tested prompts for the financial monitoring use cases most relevant to your project: cost anomaly investigation, EVM calculation automation, forecast narrative generation, contingency reserve drawdown justification, and month-end financial close communications. Test each prompt against your last three months of project data before using it in live reporting.'
  )) WHERE chapter_id = v_ch AND order_index = 5;

-- ─── MODULE 7: Stakeholder & Communication Management ────────────────────────
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 6;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M7 chapter not found'; END IF;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Stakeholder Analysis: Power, Interest & Influence Mapping',
    'description', 'Map stakeholders using the power/interest grid, influence/impact matrix, and salience model to build an engagement strategy that prevents late surprises.',
    'transcript', 'Every project fails or succeeds through people, not plans. The schedule you build is irrelevant if the sponsor who controls the budget disengages in month three. The requirements you document are worthless if the key business user who must adopt the system refuses to change. Stakeholder management starts with analysis: who are the people who matter to this project, why do they matter, and how will you engage them?

The power/interest grid plots stakeholders on two axes. Power (vertical): their authority to impact the project — approve budgets, change scope, block decisions. Interest (horizontal): their level of engagement with project outcomes. Four quadrants produce four strategies:

High power, high interest: Manage closely. These are your primary stakeholders — sponsor, key business owners, regulatory authorities with sign-off power. Engage frequently, communicate proactively, involve in key decisions.

High power, low interest: Keep satisfied. These are executives who are not directly involved but can derail the project if dissatisfied. Send concise executive briefings, not detailed status reports. Their time is limited — respect it.

Low power, high interest: Keep informed. These are end users, team members from affected departments, subject matter experts. They care deeply about outcomes but cannot directly authorize or block. Keep them informed through town halls, newsletters, and working sessions.

Low power, low interest: Monitor. Minimal proactive engagement. Update when required by process.

Supplement the power/interest grid with influence analysis. Some stakeholders appear in the "low power" quadrant but have significant informal influence — the respected department head whose team must adopt your system, the technical architect whose opinion the CTO defers to. Map influence networks, not just org charts.

The salience model adds a third dimension: urgency. Stakeholders with high power AND high urgency demand immediate attention regardless of interest level. A regulator who suddenly issues a compliance deadline has low day-to-day interest but becomes immediately salient.

Your Stakeholder Engagement Plan documents every identified stakeholder, their power/interest position, their key concerns, your engagement strategy, the communication channels you will use, and the frequency of engagement. Review and update it at each project phase transition — stakeholder positions change as the project progresses.'
  )) WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Communication Planning for Complex Projects',
    'description', 'Design a communication matrix that ensures the right people get the right information at the right time through the right channel — and actually engage with it.',
    'transcript', 'Communication planning answers a deceptively simple question: who needs to know what, when, in what format, through which channel, and from whom? Most PMs answer this question ad hoc, which means some stakeholders are overwhelmed with information they cannot use, while others are surprised by developments they needed to know about weeks earlier. A communication plan solves this systematically.

The communication matrix is the core artifact. For each communication type (weekly status report, milestone completion notice, risk escalation, steering committee presentation), document: the audience, the purpose, the content, the format, the frequency, the channel, and the owner. Be specific about format — "executive summary" and "detailed status report" serve different audiences and should never be the same document with the same level of detail.

Channel selection matters enormously. Email is searchable and creates a record but has high volume and low engagement. Formal meetings engage stakeholders but consume time and must have clear agendas. Instant messaging (Teams, Slack) enables fast back-and-forth but creates informal communication that is hard to archive. Dashboard portals give stakeholders on-demand access to current project data but require them to proactively check. Match channel to purpose and audience preference.

Escalation paths must be explicit in your communication plan. When a risk becomes an issue that exceeds the PM''s authority to resolve, who is notified, in what timeframe, through what channel? "I will email the sponsor" is not an escalation path. "Issues with cost impact > $50,000 or schedule impact > 5 days are escalated to the Project Sponsor within 24 hours via phone call followed by a written summary within 48 hours" is an escalation path.

Communication feedback loops close the loop. How will you know if your communications are effective? Sponsor engagement in review meetings, response rates to action item requests, and stakeholder satisfaction scores at phase gates are all indicators of communication effectiveness. The plan that generates a lot of output but no engagement is not a communication plan — it is a reporting burden.

Your Communication Plan includes the matrix, escalation paths, a stakeholder-specific communication preferences section (how does each key stakeholder prefer to be updated?), and a communication feedback mechanism. Review it at the start of each phase and after any significant stakeholder change.'
  )) WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Executive & Board-Level Reporting',
    'description', 'Build executive project reports that communicate RAG status, decisions needed, and forward risk in two minutes of reading time — without dumbing down the substance.',
    'transcript', 'Executives do not read project status reports — they scan them. Your job is to make the most important information impossible to miss in 90 seconds of scanning. If the key message requires a careful reading of paragraph three on page two, you have failed as a communicator, regardless of the quality of the underlying analysis.

The one-page project status brief follows a consistent structure. Header: project name, reporting period, overall RAG status (Red/Amber/Green), and PM name. Section 1 — Summary (two sentences maximum): where is the project right now and what is the overall trajectory? Section 2 — RAG by dimension: schedule (RAG + one-line explanation), cost (RAG + current CPI or cost variance), scope (RAG + any scope changes), quality (RAG + any quality issues). Section 3 — Key accomplishments this period (3 bullets maximum). Section 4 — Decisions needed (specific, dated, with the cost of delay if the decision slips). Section 5 — Top 3 risks and mitigations (one line each). Section 6 — Next period priorities (3 bullets).

The decisions-needed section is the most important. Executives attend project reviews primarily to make decisions and remove blockers. If you have no decisions for them, you have wasted their time. If you bury the decisions in narrative paragraphs, you will leave the meeting without a decision. Make decisions explicit: "Decision required by [date]: Approve additional $40,000 budget for the data migration contingency. Without this decision by [date], we cannot proceed with the database upgrade on schedule. Cost of delay: [impact]."

RAG status requires discipline. Amber means "this area has a known issue being actively managed." It is not a permanent status or a politeness to avoid turning something Red. Red means "this area is impacting the project and requires executive intervention." Projects that stay Amber for three consecutive reporting periods without either resolving to Green or escalating to Red have a status reporting problem, not a project problem.

Your Executive Dashboard Template is a reusable one-page format you adapt for each executive audience. Test it: give it to someone who has not been involved in the project and ask them to identify the top risk and the most urgent decision within 90 seconds. If they cannot, redesign it.'
  )) WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Conflict Resolution & Difficult Conversations',
    'description', 'Apply principled negotiation, de-escalation techniques, and structured frameworks to navigate the difficult conversations every PM must learn to have.',
    'transcript', 'Project management is a conflict-generating profession. You are asking people to change how they work, meet deadlines they think are impossible, share resources they consider their own, and accept decisions they disagree with. Conflict is not a sign of a bad project or a bad PM. It is a normal feature of the environment. What distinguishes effective PMs is not the absence of conflict — it is their ability to navigate it productively.

Principled negotiation (Fisher and Ury''s Getting to Yes) is the foundational framework. Four principles: (1) Separate the people from the problem. The developer who is pushing back on your schedule is not your adversary — you are both trying to deliver a good project. Address behaviors and facts, not personalities. (2) Focus on interests, not positions. A stakeholder''s position is "I want a 12-week extension." Their interest is "I am afraid the team will burn out and the quality will suffer." Positions are fixed; interests can often be addressed in ways that do not require conceding the position. (3) Generate options for mutual gain before evaluating. Do not negotiate in binary choices. (4) Insist on objective criteria. If there is a disagreement about timeline, use data — comparable projects, industry benchmarks, team velocity — rather than power.

The SBI (Situation-Behavior-Impact) framework structures difficult feedback conversations. Situation: "In yesterday''s steering committee meeting..." Behavior: "When you contradicted the timeline I had presented without discussing it with me first..." Impact: "...the sponsor now has conflicting information and has asked me to explain the discrepancy, which puts both our credibility at risk." SBI avoids character attacks ("you are undermining me") and focuses on observable behaviors and their concrete consequences.

Escalation is a tool, not a failure. If a conflict has been raised, the parties have genuinely tried to resolve it, and it remains unresolved with project impact, escalation to the sponsor or steering committee is appropriate and necessary. Frame the escalation as a decision request, not a complaint: "I need a decision on [issue] by [date] because [impact]. I have discussed this with [stakeholder] and we have not been able to reach agreement. The options are [A] and [B]. I recommend [A] for the following reasons."

Your Conflict Resolution Playbook documents the conflict types you most commonly encounter on this project, the de-escalation approach for each, and the escalation threshold.'
  )) WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'AI for Communication: Status Reports, Updates & Summaries',
    'description', 'Use AI to draft status reports, meeting summaries, stakeholder briefings, and risk communications in minutes — with the quality controls that make AI output trustworthy.',
    'transcript', 'Communication is one of the highest-volume, most time-consuming activities in project management. A PM managing a complex project may spend 8-12 hours per week writing status reports, meeting summaries, action item follow-ups, and stakeholder briefings. AI can reduce this to 2-3 hours without reducing quality — and in many cases while improving it.

The most valuable AI communication application is status report drafting. The pattern: feed the AI your EVM metrics, your milestone status, your risk register updates, and your action item log. Prompt: "Draft a one-page project status report for an executive audience. The project is [context]. This period: [accomplishments]. EVM: CPI=[value], SPI=[value], EAC=[value] vs BAC=[value]. Top risks: [list]. Decisions needed: [list]. Format as per [your template]." The AI draft will be 80-90% usable. Your review adds the contextual judgment and stakeholder-specific framing that AI cannot supply.

Meeting summary generation: immediately after a meeting, paste the meeting transcript or notes into an AI tool and prompt: "Extract from this meeting: (1) decisions made (with decision-maker and date), (2) action items (with owner and due date), (3) risks or issues raised, (4) open questions requiring follow-up. Format as a structured meeting summary." Distribute the AI-generated summary within 2 hours of the meeting while it is still fresh.

Stakeholder-specific communication: "Rewrite this technical status update for a CFO audience. Remove technical jargon. Emphasize financial performance, risk exposure, and business impact. Keep it under 200 words." The same update reaches different audiences in their own language without you writing each version from scratch.

Quality controls are non-negotiable. Always review AI-generated communications before sending. AI does not know what you have promised to specific stakeholders, what political sensitivities exist, or what context preceded this communication. The AI provides the draft structure and language; you provide the judgment. Never send an AI-generated status report to an executive that you have not read completely.

Your AI Communication Prompt Library is a tested set of prompts for your five most common communication tasks, with sample inputs and expected output quality notes. This library makes AI-assisted communication a reliable, repeatable process rather than an ad hoc experiment.'
  )) WHERE chapter_id = v_ch AND order_index = 5;

-- ─── MODULE 8: Team Leadership & High Performance ────────────────────────────
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 7;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M8 chapter not found'; END IF;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Building High-Performance Project Teams',
    'description', 'Apply Tuckman''s model, competency mapping, and psychological safety principles to form teams that perform from day one and sustain excellence through delivery.',
    'transcript', 'High-performance project teams do not happen by accident. They are built deliberately through selection, structure, and culture — and the PM is the architect of all three. Understanding the stages a team moves through and the interventions that accelerate each stage is a core leadership competency.

Tuckman''s stages of team development give you a roadmap: Forming (team members are polite, cautious, and orientation-seeking — they are figuring out the rules and their place in the team), Storming (conflict emerges as team members assert their working styles, question leadership, and negotiate roles and processes — this is normal and necessary), Norming (the team establishes working agreements, trust builds, and collaboration improves), Performing (the team operates with high autonomy, high trust, and high output — the PM''s role shifts from directing to supporting and removing impediments), and Adjourning (the team completes the project and disassembles — closure rituals and recognition matter here).

Your job as a PM is not to prevent storming — you cannot and should not. Your job is to facilitate healthy storming (where conflict is about work, not personalities) and accelerate the transition to norming. Interventions: establish a team charter in week one (covering working norms, decision-making processes, and communication agreements), create early shared wins that build collective confidence, and address unproductive conflict directly and early.

Competency mapping: before forming the team, map the competency requirements against the skills available. Gaps are project risks. A software delivery team that lacks a security architect is not a complete team. Address skill gaps through hiring, training, or bringing in specialist contractors before the gap creates a delivery problem.

Psychological safety — the belief that one can speak up, question, or admit mistakes without punishment — is the strongest predictor of team performance (Google''s Project Aristotle, 2016). Create it by modeling it: admit when you do not know something, invite challenges to your own thinking, and respond to bad news with curiosity rather than blame.

Your Team Formation Plan documents: the competency requirements, the team members and their mapped competencies, the identified gaps and mitigation, the working agreements established in the team charter, and the psychological safety indicators you will monitor (e.g., meeting participation rates, willingness to raise risks early).'
  )) WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Motivation, Delegation & Accountability Frameworks',
    'description', 'Apply Herzberg''s two-factor theory and RACI-based delegation to build a team where people are intrinsically motivated and accountability is unambiguous.',
    'transcript', 'Motivation is the PM''s most underrated capability. A technically competent team with low motivation underperforms a moderately skilled team with high motivation. Understanding what drives motivation — and what destroys it — allows you to create an environment where people give their best consistently.

Herzberg''s two-factor theory distinguishes hygiene factors from motivators. Hygiene factors (salary, working conditions, company policies, supervision quality) do not motivate when present — they only demotivate when absent. If your team''s working environment is poor, fixing it stops the demotivation but does not create motivation. Motivators (achievement, recognition, the work itself, responsibility, growth) actively create motivation when present. The implication: do not assume that competitive salaries and a good working environment produce motivated teams. They produce teams that are not actively demotivated. Actual motivation comes from meaningful work, clear achievement markers, genuine recognition, and growth opportunities.

Practical applications: connect each team member''s work to the project''s outcome and the organization''s mission. Not "you are building the data migration module" but "you are enabling 50,000 patients to get faster diagnoses because your data migration will power the new clinical decision support system." Make the meaning visible. Celebrate achievements visibly. Give team members responsibility for decisions within their competency area — autonomy is a motivator, micromanagement is a demotivator.

Delegation starts with clarity. RACI (Responsible, Accountable, Consulted, Informed) maps which roles perform work (Responsible), which role owns the outcome (Accountable — only one per deliverable), which roles must be consulted before a decision (Consulted), and which roles are updated after a decision (Informed). RACI breakdowns — where accountability is shared between two people, or where no one is clearly responsible — are the most common structural cause of project delays.

Your Delegation & Accountability Framework documents the RACI for every major deliverable, the delegation authorities you have granted to team members (what decisions they can make independently), and the accountability contracts you have established (clear agreement on what each team member is committed to delivering, by when).'
  )) WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Performance Management & Constructive Feedback',
    'description', 'Give feedback that actually improves performance, address underperformance before it becomes a crisis, and conduct team reviews that build capability rather than create anxiety.',
    'transcript', 'Feedback is the most powerful performance management tool available to a PM, and it is consistently underused. Most PMs avoid difficult performance conversations until the situation has deteriorated to the point where it cannot be ignored. By then, the relationship is damaged, the team''s trust in the PM''s willingness to address issues is eroded, and the underperformer has often been allowed to affect everyone around them. Feedback works best when given early, specifically, and regularly.

The SBI framework (Situation-Behavior-Impact) makes feedback specific and actionable. Situation: the concrete context where the behavior occurred. Behavior: the specific, observable behavior — not an interpretation or character judgment. Impact: the concrete effect of that behavior on the project or team. "You''re not communicating well" is not feedback — it triggers defensiveness and provides no guidance for change. "In Monday''s client meeting (Situation), when you answered the client''s question about the deadline without checking with me first (Behavior), it committed us to a timeline I knew was not feasible, which put me in the position of having to contradict you in front of the client (Impact)" is feedback.

For positive reinforcement, the same structure applies. Be specific and timely. "Great work this week" is acknowledgment, not feedback. "Your analysis of the database migration risks in Thursday''s risk review (Situation) — specifically the way you quantified the rollback time and linked it to the cutover window (Behavior) — gave the steering committee the information they needed to approve the contingency budget (Impact)" is feedback that reinforces the specific behavior you want repeated.

Addressing underperformance: use the following sequence. First, check whether the underperformance is a capability gap (they cannot do it) or a motivation gap (they will not do it). These require different responses. For capability gaps: training, coaching, pairing with a stronger colleague. For motivation gaps: direct conversation about expectations, consequences, and support. Document performance conversations. If the situation does not improve after clear feedback and support, escalate to HR or the resource''s functional manager — this is not a failure of the PM, it is the appropriate use of the organization''s performance management system.

Your Performance Management Playbook covers the feedback cadence (not just annual reviews — weekly brief check-ins, monthly one-on-ones), the SBI template, the underperformance escalation process, and the team review format you will use at project phase gates.'
  )) WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Remote & Distributed Team Leadership',
    'description', 'Lead remote and distributed teams effectively through asynchronous communication protocols, time zone management, and the rituals that build trust across distance.',
    'transcript', 'Remote project teams are now the norm rather than the exception. The PM who defaults to the assumption that presence equals productivity — scheduling daily video calls, expecting instant responses to messages, and measuring input rather than output — will exhaust their team and drive away their best people. Effective remote leadership requires deliberately rebuilding for distance the connection, clarity, and accountability that co-location provided for free.

Asynchronous communication is the foundation of remote team effectiveness. The majority of communication should not require real-time participation. Status updates, decisions documentation, risk escalations, and project context should be written, searchable, and accessible on each team member''s schedule. This is not slower — it is actually faster for many communication types because it eliminates scheduling overhead and enables deep work by not fragmenting the workday with real-time interruptions.

Reserve synchronous meetings for the interactions that genuinely require real-time exchange: complex problem-solving, relationship building, conflict resolution, and creative collaboration. A daily stand-up call that could have been a written async update wastes 30 minutes of every team member''s time every day — 2.5 hours per week per person.

Time zone management requires a working agreement established at project kick-off. Define the core overlap hours — the window when all team members are available for synchronous collaboration — and protect those hours for meetings that need them. Meetings outside the core overlap window should require explicit justification. Rotate meeting times periodically so the inconvenient time (early morning, late evening) is shared equitably rather than systematically falling on one region.

Distributed team rituals replace the informal connection of co-location. Virtual coffee rotations (random pairings for non-work conversations), team retrospectives that specifically address remote working challenges, celebration rituals for milestones (virtual team events, public recognition in shared channels), and explicit check-ins on team member wellbeing are not soft extras — they are the infrastructure of distributed team cohesion.

Your Remote Team Operating Guide documents: the asynchronous communication norms (what goes in which channel, expected response times), the synchronous meeting calendar and time zone rotation policy, the core overlap hours, the distributed team rituals calendar, and the team wellbeing check-in process.'
  )) WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'AI-Augmented Team Productivity & Collaboration',
    'description', 'Deploy AI tools that reduce meeting overhead, automate task tracking, and give your team more time for the high-value work that actually delivers the project.',
    'transcript', 'AI is transforming team productivity not by replacing human judgment but by eliminating the administrative overhead that consumes time without producing value. The average knowledge worker spends 2-3 hours per day on administrative tasks: writing meeting summaries, updating task status, formatting reports, searching for information. AI tools can reclaim most of this time and redirect it to delivery work.

Meeting assistance: AI meeting tools (Otter.ai, Fireflies, Microsoft Teams Premium, Zoom AI Companion) automatically transcribe meetings, extract action items, identify decisions, and generate summaries. Set this up for every recurring project meeting. The meeting summary goes out within 15 minutes of the meeting ending with zero PM effort. Action items are automatically assigned and tracked. The PM''s post-meeting time goes from 45 minutes to 5 minutes of review and editing.

Task automation: AI-powered project management tools (Jira, Monday.com, Asana, Notion) can automatically update task status based on commits, pull requests, and deployments. A developer merges a PR tagged to a task — the task automatically moves from "In Progress" to "In Review." A deployment completes — tasks marked as done. This eliminates the status update meeting that exists solely to manually update the project tool.

Workload balancing: AI scheduling tools analyze team capacity, current assignments, task duration estimates, and upcoming deadlines to flag over-allocation before it causes burnout or missed deadlines. The PM sees a warning: "If the current sprint plan is executed as scheduled, three team members will exceed 100% capacity by day 8." This allows rebalancing before the team starts working unsustainable hours.

Sentiment analysis tools monitor communication patterns in team channels to detect early signs of disengagement, frustration, or interpersonal conflict. These tools must be implemented with full team transparency and appropriate privacy protections — surveillance without consent destroys the trust it is meant to protect.

Your AI Team Toolkit documents: the specific tools deployed, their integration points, the team''s working agreement on AI use (what is automated, what requires human review), the privacy and data governance protocols, and the productivity metrics you are using to measure the impact of AI on team output.'
  )) WHERE chapter_id = v_ch AND order_index = 5;

-- ─── MODULE 9: Procurement & Vendor Management ───────────────────────────────
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_pm_id ORDER BY order_index LIMIT 1 OFFSET 8;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M9 chapter not found'; END IF;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Procurement Strategy & Make-or-Buy Analysis',
    'description', 'Apply total cost of ownership analysis, core competency assessment, and strategic fit criteria to make defensible make-or-buy decisions.',
    'transcript', 'Every project contains decisions about which work to build internally and which to source externally. These decisions have major cost, schedule, quality, and strategic implications. The PM who makes them based on intuition ("we always use contractors for development") or political convenience ("the CTO wants to use his preferred vendor") will make expensive mistakes. The make-or-buy analysis provides a structured, defensible framework for these decisions.

Total Cost of Ownership (TCO) is the starting point. For a build option, TCO includes: internal labor (hours × fully-loaded rate, not just salary), management overhead, opportunity cost of internal resources diverted from other work, ongoing maintenance and support costs, and any technical debt the internal build will create. For a buy option: license or subscription fees, implementation costs, integration costs (often underestimated by 40-60%), training and change management, ongoing support contract, and vendor lock-in cost (the cost of switching vendors in the future if needed).

Core competency analysis: is this capability something your organization should own? Core competencies are the capabilities that differentiate your organization from competitors and that you want to develop and retain. Non-core capabilities are candidates for outsourcing. A financial services firm that builds proprietary trading algorithms should build that capability internally. The same firm should buy its HR system because HR software is not a competitive differentiator.

Strategic fit: does building this internally serve a strategic purpose beyond the immediate project? If your organization plans to offer this capability as a service to others in the future, building it creates strategic options. If it is a one-time need with no broader application, buying is typically more economical.

Risk allocation: building internally concentrates risk with your organization. Buying transfers some risk to the vendor through contract terms, but creates new risks: vendor performance, vendor viability, data security. The risk profile of each option should be part of the analysis.

Your Make-or-Buy Analysis document presents each significant procurement decision with TCO calculations for both options, core competency assessment, strategic fit rating, risk comparison, and a recommendation with rationale. This document should be reviewed and approved by the sponsor before procurement begins.'
  )) WHERE chapter_id = v_ch AND order_index = 1;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'RFP & RFQ Development: What Vendors Actually Need',
    'description', 'Write RFPs that attract capable vendors, set the foundation for a successful engagement, and give you the information you need to make an objective evaluation.',
    'transcript', 'A poor RFP attracts poor vendor proposals. The vendors who invest time in responding to RFPs are making a business decision: they evaluate the quality of the document and the clarity of requirements to assess whether responding is worth their time. Vague requirements, unclear evaluation criteria, and unrealistic timelines signal a client who does not know what they want and will be difficult to work with. Good vendors deprioritize poor RFPs.

The RFP has five core sections. Section 1 — Background and Context: who your organization is, what the project is, what problem you are trying to solve, and what success looks like. This is not a formality — it helps vendors understand whether they are a genuine fit before investing in a response. Section 2 — Scope of Work: what you need the vendor to do, in sufficient detail that a qualified vendor can estimate the effort and price it accurately. Ambiguous scope produces ambiguous pricing and scope disputes after contract award.

Section 3 — Requirements: functional requirements (what the solution must do), non-functional requirements (performance, security, scalability, availability), integration requirements (what systems must it connect to), and constraints (budget range, timeline, technology standards, compliance requirements). Stating a budget range in the RFP dramatically improves the quality of responses — vendors cannot propose appropriate solutions without understanding financial parameters.

Section 4 — Evaluation Criteria: how you will evaluate and score proposals. Be explicit and weighted. Example: Technical approach (30%), Vendor experience and references (25%), Total cost of ownership over 3 years (25%), Implementation timeline and risk (15%), Cultural fit and communication quality (5%). Publishing evaluation criteria tells vendors what to emphasize in their proposals and makes your evaluation process defensible.

Section 5 — Response Requirements: the format, length, required sections, and submission deadline. Standardize the response format so you can compare proposals objectively. If one vendor writes 50 pages in a different structure than your RFP, you cannot compare it fairly against a 20-page proposal that followed your format precisely.

Your RFP Template is a reusable structure you adapt for each significant procurement. The most valuable template element is the requirements section — invest the most time there. Clear requirements are the single biggest driver of successful vendor engagements.'
  )) WHERE chapter_id = v_ch AND order_index = 2;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Contract Types, Negotiation & Risk Allocation',
    'description', 'Select the right contract type for each risk profile, negotiate red-flag clauses, and build contracts that protect the project without destroying the vendor relationship.',
    'transcript', 'Every contract is a risk allocation instrument. The question it answers is: if something goes wrong, who bears the cost? The PM who understands contract types and their risk implications can select the appropriate contract structure, negotiate the terms that protect the project, and avoid the clauses that create liability without protection.

Three primary contract types: Fixed Price (FP), Time and Materials (T&M), and Cost-Reimbursable (CR). Fixed Price: the vendor delivers a defined scope for a defined price. Risk to the PM: scope must be clearly defined upfront — scope ambiguity under FP contracts leads to disputes and change orders. Risk to the vendor: if the work takes longer than estimated, they absorb the overrun. Best for: well-defined scope with stable requirements. Variations: Fixed Price Incentive Fee (FPIF — vendor earns bonus for underrunning), Fixed Price with Economic Price Adjustment (for long-term contracts with inflation exposure).

Time and Materials: the vendor is paid for actual hours worked at agreed rates, plus material costs. Risk to the PM: no cost ceiling unless negotiated — open-ended T&M contracts have resulted in projects running three times their initial estimates. Always negotiate a Not-to-Exceed (NTE) cap on T&M contracts. Best for: work where scope cannot be fully defined upfront, or where requirements are expected to evolve significantly.

Cost-Reimbursable: the client pays the vendor''s actual costs plus an agreed fee. Risk to the PM: maximum cost exposure, requires audit rights to verify costs. Best for: research and development, long-term infrastructure partnerships where exact requirements cannot be predetermined.

Red-flag clauses to negotiate: unlimited liability (cap at contract value or 2× the annual contract value), automatic renewal clauses (often bury significant price increases), unilateral amendment rights (vendor can change terms without consent), and IP ownership ambiguity (ensure client-funded deliverables are client-owned).

Your Contract Risk Assessment scores each material contract on three dimensions: scope clarity risk, cost exposure risk, and relationship risk. It documents the key protective clauses you negotiated and the residual risks you have accepted.'
  )) WHERE chapter_id = v_ch AND order_index = 3;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'Vendor Performance Management & Governance',
    'description', 'Design SLAs, KPIs, governance meetings, and escalation paths that keep vendors accountable and give you the data to act before performance problems become delivery crises.',
    'transcript', 'Signing a contract is not the end of procurement — it is the beginning of vendor relationship management. The PM who files the contract and assumes the vendor will deliver without systematic monitoring will be surprised when performance problems emerge, and surprised again when the contract offers less protection than expected because the governance process was not followed.

Service Level Agreements (SLAs) are the performance standards the vendor has contractually committed to. SLAs should be: specific (not "respond in a timely manner" but "respond to Priority 1 incidents within 2 hours"), measurable (define how compliance is measured and reported), achievable (aggressive but realistic — unachievable SLAs are ignored), and consequential (what happens when SLAs are missed — financial penalties, remediation plans, termination triggers).

KPI dashboards for vendor performance track both SLA compliance (are they meeting contractual commitments?) and quality indicators beyond the SLA (delivery accuracy, rework rates, communication responsiveness). Review vendor KPIs monthly at a minimum — monthly is the maximum acceptable interval for any vendor with material project impact.

Governance meeting structure: establish a regular governance cadence before work begins. Operational reviews (weekly or bi-weekly): workstream leads review progress, blockers, and action items. Program reviews (monthly): PM-to-PM review of overall performance, financial status, emerging risks, and relationship health. Executive steering (quarterly or as needed): senior leader escalations, contract modifications, strategic direction changes.

The escalation path must be explicit and agreed before it is needed. Define: what performance shortfall triggers an informal management discussion versus a formal notice of underperformance versus a notice of breach versus termination. Having this documented in advance prevents the emotionally charged negotiation about "how serious is this?" in the middle of a performance crisis.

Your Vendor Governance Framework documents: the SLA register with measurement methodology and penalty structure, the KPI dashboard with reporting cadence, the governance meeting calendar and agenda templates, and the escalation matrix. Share this framework with the vendor at contract kick-off — a vendor who understands the governance expectations in advance performs better than one who discovers them when they first underperform.'
  )) WHERE chapter_id = v_ch AND order_index = 4;

  UPDATE public.videos SET translations = jsonb_build_object('en', jsonb_build_object(
    'title', 'AI for Procurement: Evaluation, Analysis & Contract Intelligence',
    'description', 'Use AI to analyze RFP responses, score vendor proposals, review contract terms, and monitor SLA compliance at scale.',
    'transcript', 'Procurement processes generate enormous volumes of text: vendor proposals, contract terms, SLA reports, correspondence, and performance records. AI is exceptionally well-suited to processing large volumes of structured and unstructured text — which makes procurement one of the highest-value AI applications in project management.

RFP response analysis: when you receive 6-8 vendor proposals, each 40-60 pages, AI can process all of them simultaneously against your evaluation criteria. Prompt structure: "I am evaluating vendor proposals for [project description]. My evaluation criteria are: [list criteria with weights]. Here is Vendor A''s proposal: [paste]. For each criterion, score Vendor A on a 1-5 scale and provide specific evidence from the proposal supporting the score. Identify any criteria where the proposal is non-responsive or ambiguous." Run this for each vendor. You get a consistent, criteria-based first-pass evaluation in hours instead of days, and you have documented evidence for every score.

Contract review: legal contract review AI (Ironclad, Luminance, Harvey) identifies non-standard clauses, missing standard protections, and unusual risk allocations. For general procurement PMs without legal backgrounds, AI contract review provides a structured risk checklist: "Review this contract and identify: (1) clauses that deviate from standard market practice, (2) liability caps and whether they are appropriate for contract value, (3) IP ownership terms, (4) SLA definitions and their measurement methodology, (5) termination triggers and cure periods. Flag each identified issue with the contract clause reference and recommended protective language."

SLA monitoring automation: connect vendor reporting systems to an AI monitoring layer that aggregates performance data, calculates SLA compliance scores, and flags breaches automatically. The PM receives a weekly SLA compliance summary with breaches highlighted, trend analysis, and auto-drafted performance notices ready for review and sending.

Your AI Procurement Prompt Set is a library of tested prompts for each procurement use case: proposal evaluation, contract review, SLA monitoring, and vendor communication drafting. Document the human review step required for each — AI procurement analysis always requires PM validation before being used in vendor communications or scoring decisions.'
  )) WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- VERIFY
SELECT c.order_index, c.title,
       COUNT(*) FILTER (WHERE v.translations->'en'->>'transcript' IS NOT NULL) AS filled
FROM public.videos v
JOIN public.chapters c ON c.id = v.chapter_id
JOIN public.courses co ON co.id = c.course_id
WHERE co.title = 'AI Project Manager & Delivery Leader'
  AND c.order_index BETWEEN 1 AND 9
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
-- Expected: filled = 5 for all 9 modules
