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
