-- ============================================================
-- AI Mastery for Scrum Masters & Project Managers
-- Modules 1–3 content seed  (description + EN transcript)
-- Apply by hand in Supabase SQL Editor
-- ============================================================
DO $$
DECLARE
  v_course_id uuid;
  v_ch        uuid;
BEGIN
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE title = 'AI Mastery for Scrum Masters & Project Managers';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course not found: AI Mastery for Scrum Masters & Project Managers';
  END IF;

  -- ══════════════════════════════════════════════════════════════
  -- MODULE 1 — AI Foundations for Project Managers & Scrum Masters
  -- ══════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 0;

  -- 1.1 The AI Revolution in Project Management
  UPDATE public.videos SET
    description = 'The landscape of project management is undergoing its most significant transformation since the introduction of Agile. AI is already reshaping how PMs plan, communicate, and deliver value. This lesson examines the forces driving AI adoption across the profession, the productivity gains early adopters are realising, and what this means for your career over the next three to five years.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '1.1 The AI Revolution in Project Management',
      'description', 'The landscape of project management is undergoing its most significant transformation since the introduction of Agile. AI is already reshaping how PMs plan, communicate, and deliver value. This lesson examines the forces driving AI adoption across the profession, the productivity gains early adopters are realising, and what this means for your career over the next three to five years.',
      'transcript', $t$THE AI REVOLUTION IN PROJECT MANAGEMENT

Something fundamental has shifted. In 2022 the average project manager used one digital tool per function — a scheduling tool, a task board, a document editor. By 2025, AI-augmented PMs are operating across every dimension of their role with co-pilots that write, analyse, forecast, and communicate. The productivity differential between an AI-fluent PM and a non-augmented PM is already large enough to change hiring decisions.

This is not hype. It is a technology inflection point, and project management is one of the disciplines most positioned to benefit.

WHY PROJECT MANAGEMENT AND AI ARE A NATURAL FIT

Project management is fundamentally an information-processing and communication discipline. PMs gather information from stakeholders, synthesise it into plans, communicate plans to teams, track reality against those plans, and communicate variances back upward. Every one of those activities can be dramatically augmented by AI.

The data confirms it:
- McKinsey Global Institute estimates knowledge workers using AI assistants complete tasks 25–40% faster with measurably higher quality outputs
- GitHub's research on Copilot found developers completed tasks 55% faster — PM work of specifying, reviewing, and accepting that development accelerates proportionally
- PMs using AI for meeting summaries and action tracking consistently report saving five to eight hours per week on administrative overhead alone

That is not a marginal efficiency gain. That is a structural change in how much one PM can manage.

THE THREE WAVES OF AI IN PROJECT MANAGEMENT

Wave 1 — Automation (2020–2023): Simple task automation, template generation, and basic scheduling assistants. Most PMs experienced this as "nice to have" tools that reduced clerical burden without fundamentally changing the job.

Wave 2 — Augmentation (2023–2025): LLM-powered assistants that draft status reports, synthesise meeting notes, suggest risk mitigations, generate user stories from rough requirements, and answer questions against project knowledge bases. This is where most forward-looking PMs are operating today.

Wave 3 — Agentic PM (2025+): AI agents that autonomously monitor project health, escalate risks before humans notice them, coordinate across multiple tools, and surface decision-ready intelligence. This wave is beginning now. This course prepares you to lead it.

WHAT IS AT STAKE FOR YOUR CAREER

The PMs who will thrive in the next decade are not necessarily the ones who know the most about AI technology. They are the ones who best understand how to direct AI as a strategic resource — knowing when to trust it, when to verify it, how to prompt it effectively, and how to build team cultures that use it responsibly.

What changes:
- Time allocation shifts from information gathering and formatting toward interpretation and decision-making
- The volume of projects a single PM can shepherd increases significantly
- Stakeholder expectations for reporting quality and speed rise
- Technical fluency in AI tooling becomes a baseline professional expectation

What stays the same:
- Relationships and trust remain the foundation of PM effectiveness
- Judgement about risk, scope, and priority is irreducibly human
- Accountability for outcomes belongs to the PM, not the tool
- Ethical leadership and team culture cannot be automated

THINK LIKE AN AI-FIRST PM

An AI-first PM does not reach for AI only when stuck — they design their entire workflow with AI as the default starting point. Before writing a status report, AI drafts it from meeting notes. Before running a retrospective, AI pre-analyses sprint data. Before estimating a new feature, AI compares it to historical estimates on similar work.

This lesson establishes the mindset. The rest of this course builds the skills. By the end of Module 6 you will have rebuilt your PM operating model from the ground up with AI at its core.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 0;

  -- 1.2 How AI Actually Works: A PM's Guide to LLMs, Agents, and Automation
  UPDATE public.videos SET
    description = 'Most PMs using AI tools have little understanding of how they actually work — and that gap leads to poor prompting, misplaced trust, and missed opportunities. This lesson demystifies large language models, agents, retrieval-augmented generation, and workflow automation, explained specifically for the non-technical project manager who needs to leverage these tools strategically.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '1.2 How AI Actually Works: A PM''s Guide to LLMs, Agents, and Automation',
      'description', 'Most PMs using AI tools have little understanding of how they actually work — and that gap leads to poor prompting, misplaced trust, and missed opportunities. This lesson demystifies large language models, agents, retrieval-augmented generation, and workflow automation, explained specifically for the non-technical project manager.',
      'transcript', $t$HOW AI ACTUALLY WORKS: A PM'S GUIDE TO LLMS, AGENTS, AND AUTOMATION

You do not need to understand how a combustion engine works to drive a car — but knowing that engine temperature matters, that fuel quality affects performance, and that warning lights require attention makes you a far safer and more effective driver. The same principle applies to AI.

WHAT A LARGE LANGUAGE MODEL IS

A large language model (LLM) is a statistical pattern-matching system trained on enormous quantities of text. When you send it a prompt, it predicts the most statistically likely sequence of words that would follow that prompt, given everything it learned during training. It does not "think" in the human sense. It does not reason from first principles. It pattern-matches at extraordinary scale and speed.

This has two important practical implications for PMs:

1. LLMs are extraordinarily good at tasks where the right answer looks like something they have seen before — writing, summarising, reformatting, explaining, drafting
2. LLMs can confidently produce plausible-sounding content that is factually wrong (called "hallucination"), particularly for specific facts, numbers, dates, and domain-specific technical details

Knowing this makes you a better prompt engineer and a more rigorous verifier.

TOKENS, CONTEXT WINDOWS, AND WHY THEY MATTER

LLMs do not read text the way you do. They break input into "tokens" — roughly, word fragments averaging about 0.75 words each. Every model has a context window: the maximum number of tokens it can consider at once. This has two practical consequences:

- Very long documents may need to be chunked if they exceed the context window
- Information early in a very long conversation may receive less weight than recent context

For PMs this means: be intentional about what you include in a prompt. The more focused and relevant your input, the better the output.

RETRIEVAL-AUGMENTED GENERATION (RAG)

RAG is what happens when an AI system searches a document store before answering your question, then uses what it finds to ground its response. Think of it as giving the LLM access to your project's knowledge base in real time.

This is the architecture behind tools like:
- Notion AI querying your team's documentation
- A custom GPT that can answer questions about your specific project
- Enterprise AI systems that can search your company's historical project data

For PMs, RAG dramatically expands the useful surface area of AI — instead of only drawing on general training data, the AI can draw on your specific project artefacts.

AI AGENTS: THE NEXT LEVEL

An AI agent is an LLM that has been given tools and the ability to act: to search the web, run code, read and write files, call APIs, and make sequences of decisions to complete a goal. Instead of giving you a response, an agent takes actions.

Early PM applications of agents include:
- Automatically pulling sprint data from Jira, analysing it, and drafting the weekly status email
- Monitoring a risk register and sending alerts when thresholds are exceeded
- Researching a technology decision by querying documentation and summarising findings

Agents are not yet reliable enough to operate unsupervised on high-stakes PM tasks. The right mental model now is "supervised agent" — you set the task, the agent does the work, and you review before it goes out.

WORKFLOW AUTOMATION VS AI

It is important to distinguish AI from traditional workflow automation:

- Automation (Zapier, Make, n8n): Rules-based. "When X happens, do Y." Deterministic, reliable, but limited to pre-defined scenarios.
- AI augmentation: Pattern-based. Handles ambiguous, variable inputs. Can draft, summarise, classify, and decide — but with inherent variability in output quality.

The most powerful PM workflows combine both: automation handles the reliable triggers and routing, AI handles the content generation and analysis.

THE PM'S OPERATING FRAMEWORK FOR AI

Before using any AI tool for a PM task, ask three questions:
1. Is this task primarily pattern-matching (writing, formatting, summarising)? AI excels here.
2. Does the output require verified factual accuracy (budget numbers, dates, commitments)? Always verify independently.
3. Is this output going to a senior stakeholder or a critical decision point? Apply human judgement before sending.

This framework will serve you throughout this course and your career.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- 1.3 Evaluating AI Tools: A Decision Framework for PMs
  UPDATE public.videos SET
    description = 'With hundreds of AI tools competing for PMs'' attention, choosing the right ones is itself a strategic skill. This lesson gives you a structured evaluation framework covering capability fit, integration depth, data privacy, total cost, and change management burden — so you can make investment decisions your organisation will stand behind.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '1.3 Evaluating AI Tools: A Decision Framework for PMs',
      'description', 'With hundreds of AI tools competing for PMs'' attention, choosing the right ones is itself a strategic skill. This lesson gives you a structured evaluation framework covering capability fit, integration depth, data privacy, total cost, and change management burden.',
      'transcript', $t$EVALUATING AI TOOLS: A DECISION FRAMEWORK FOR PMs

The AI tooling landscape is growing faster than any PM can track. New tools launch weekly, existing tools add AI features constantly, and every vendor now claims to be "AI-powered." Without a structured approach to evaluation, PMs end up either adopting too much (tool sprawl, wasted spend, confused teams) or too little (missed productivity, competitive disadvantage).

This lesson gives you the evaluation framework you need.

THE FIVE DIMENSIONS OF AI TOOL EVALUATION

Dimension 1 — Capability Fit
Does the tool actually solve a problem you have? Evaluate against your specific workflow gaps:
- What tasks consume disproportionate time relative to their value?
- Where does quality suffer because of time pressure?
- Where does information loss occur between meetings, tools, or handoffs?

Score tools on how directly they address your highest-impact gaps.

Dimension 2 — Integration Depth
A tool that lives in isolation creates yet another silo. Evaluate:
- Does it connect to your existing PM tools (Jira, Linear, Asana, Confluence)?
- Does it have an API for custom integration?
- Does it work where your team already works (Slack, Teams, email)?

Integration depth often matters more than feature richness. A 70%-capable tool that is deeply embedded in your workflow delivers more value than a 95%-capable tool nobody opens.

Dimension 3 — Data Privacy and Security
This is non-negotiable for enterprise adoption. Evaluate:
- Where does your data go? Is it used to train the vendor's models?
- Is the tool SOC 2 Type II certified?
- Can it be deployed on-premise or in a private cloud?
- What data residency guarantees exist for your jurisdiction?

For regulated industries (healthcare, finance, government), these questions are required before any pilot.

Dimension 4 — Total Cost of Ownership
The license fee is rarely the full cost. Evaluate:
- Per-seat vs. usage-based pricing — which scales better for your team?
- Integration and setup costs (engineering time, configuration)
- Ongoing maintenance and prompt-tuning overhead
- Training and change management investment
- Cost of the tool not working as expected (error correction overhead)

Dimension 5 — Change Management Burden
The best AI tool fails if the team does not adopt it. Evaluate:
- How different is the workflow from what the team does today?
- Is there an in-app learning curve or is it zero-friction?
- Does it require the team to remember to use it, or does it insert itself into existing flows automatically?

Tools that automate themselves into existing workflows (e.g., a meeting assistant that joins automatically) have far higher adoption rates than tools requiring deliberate manual use.

THE PM AI TOOL AUDIT

Before evaluating new tools, audit what you already have. Most PMs already have access to significant AI capabilities they are not using:
- Microsoft 365 Copilot (if your org has M365 E3/E5)
- Jira's AI features (smart suggestions, sprint health)
- Confluence AI (page summaries, auto-linking)
- GitHub Copilot (essential for engineering-adjacent PMs)
- Google Workspace AI (Duet)

Start by maximising the tools you already own before adding new vendors.

THE PILOT-THEN-SCALE PLAYBOOK

1. Identify one high-frequency, low-risk task (meeting summaries is the classic starting point)
2. Run a two-week pilot with three to five volunteers
3. Measure: time saved, quality rating, adoption rate
4. Document the prompt templates that produced the best results
5. Expand to the full team with those templates as the starting point
6. Repeat with the next use case

This approach builds organisational AI muscle while managing risk. Every new use case benefits from the capability and confidence built in the previous one.

TOOLS TO EVALUATE IN THIS COURSE

Throughout this course you will develop hands-on experience with:
- ChatGPT and Claude for general PM writing and analysis
- GitHub Copilot for engineering collaboration
- Otter.ai and Fireflies for meeting intelligence
- Notion AI for documentation
- Jira AI and Linear AI for backlog management
- Datadog for AI-assisted monitoring

By the end of Module 6, you will have the hands-on experience needed to evaluate any future tool against this framework with confidence.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- 1.4 Building an AI-First Mindset on Your Team
  UPDATE public.videos SET
    description = 'The biggest barrier to AI adoption in most teams is not technology — it is culture. This lesson gives PMs and Scrum Masters the change management playbook for introducing AI to a team: addressing fear and scepticism, building psychological safety around experimentation, designing low-stakes onramps, and turning early adopters into internal champions.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '1.4 Building an AI-First Mindset on Your Team',
      'description', 'The biggest barrier to AI adoption in most teams is not technology — it is culture. This lesson gives you the change management playbook for introducing AI to a team: addressing fear, building psychological safety around experimentation, and turning early adopters into champions.',
      'transcript', $t$BUILDING AN AI-FIRST MINDSET ON YOUR TEAM

Technology adoption curves have a consistent pattern: early adopters lead, the early majority follows once social proof accumulates, the late majority waits until it is unavoidable, and laggards resist until they have no choice. AI is following this exact curve across every team and organisation right now.

Your job as a PM or Scrum Master is not to wait for the curve to run its course. Your job is to accelerate it — safely, thoughtfully, and in a way that brings the whole team forward together.

THE REAL BARRIER: PSYCHOLOGICAL, NOT TECHNICAL

In most teams the reason AI adoption stalls is not that the tools are hard to use. It is:
- Fear of job displacement ("If AI can do my job, what happens to me?")
- Fear of looking incompetent ("What if I use AI and my colleagues think I'm not capable?")
- Fear of making mistakes ("What if the AI gives me wrong information and I act on it?")
- Inertia ("I already know how to do my job the old way — why change?")

Each of these fears is rational. Each of them deserves a direct, honest response.

ADDRESSING FEAR OF DISPLACEMENT

Be direct rather than dismissive. The honest answer is: AI will automate some tasks that PMs currently do, and this will require PMs to evolve their skill sets. The PMs who learn to direct AI will be more valuable, not less. The ones who do not adapt will face genuine career risk.

This is not a threat — it is the same dynamic that happened when project management software replaced paper Gantt charts, when spreadsheets replaced ledger books, and when video calls replaced travel. Every wave of automation changes the job without eliminating the human role. The human role shifts upward: toward judgment, relationships, creativity, and ethical oversight.

Frame AI as career acceleration, not career threat.

BUILDING PSYCHOLOGICAL SAFETY AROUND AI EXPERIMENTATION

Teams need explicit permission to experiment — including permission to produce bad outputs and share them without embarrassment. Establish these norms explicitly:
- "It is fine to use AI to draft things — just review before sending"
- "If AI gives you something wrong or weird, share it with the team so we all learn"
- "There are no dumb prompts — experimentation is how we get better"

The Scrum Master role is perfectly positioned to model this. Run a retrospective where AI-generated summaries are openly discussed and edited. Show the team what good AI output looks like and what to watch for.

THE AI ONRAMP: START WITH THE LOWEST-STAKES TASK

The fastest path to team-wide adoption is a single, low-stakes use case that delivers obvious value with zero downside risk. Meeting summaries is the canonical example:
- Everyone finds manual note-taking tedious
- The stakes of a slightly imperfect summary are very low
- The time saving is immediately obvious (five to fifteen minutes per meeting)
- It introduces the team to reviewing and editing AI output, which builds discernment

Once the team has used AI for meeting summaries for two to three sprints and has seen it save time without causing problems, the psychological barrier to using it for higher-stakes tasks drops significantly.

IDENTIFYING AND EMPOWERING EARLY ADOPTERS

In every team there are one or two people who were already experimenting with AI before you formally introduced it. Find them. Empower them. Make them visible.

Ask them to share one AI use case per sprint review. Give them time to document their best prompt templates. Let them run a team lunch-and-learn. Early adopters do not need training — they need permission and an audience.

THE ANTI-PATTERN: TOP-DOWN MANDATES

The fastest way to kill AI adoption is to mandate it before people understand why it helps them personally. "You must use AI for all status reports starting next Monday" creates resentment and resistance. "Let's try this together for two weeks and see what happens" creates buy-in.

Lead with curiosity and invitation, not compliance.

WHAT AN AI-FIRST TEAM CULTURE LOOKS LIKE

At maturity, an AI-first team culture has these characteristics:
- AI-generated first drafts are the norm, not the exception
- Team members share prompt libraries and improve them collaboratively
- AI outputs are reviewed with healthy scepticism, not blind trust
- New tools are evaluated openly, with team members as testers
- Learning about AI is treated as professional development, not a personal hobby

You are building this culture now. Each lesson in this course gives you another capability to model for your team.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- 1.5 AI Ethics, Security, and Governance for Project Leaders
  UPDATE public.videos SET
    description = 'With great capability comes serious responsibility. This lesson covers the ethical and governance dimensions every PM must understand before deploying AI at scale: data privacy obligations, bias and fairness risks, intellectual property considerations, vendor accountability, and how to build a team AI policy that protects your organisation and your people.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '1.5 AI Ethics, Security, and Governance for Project Leaders',
      'description', 'With great capability comes serious responsibility. This lesson covers data privacy obligations, bias and fairness risks, intellectual property considerations, and how to build a team AI policy that protects your organisation and your people.',
      'transcript', $t$AI ETHICS, SECURITY, AND GOVERNANCE FOR PROJECT LEADERS

Becoming an effective AI-augmented PM requires not just knowing how to use AI tools, but knowing when not to use them, what risks they introduce, and what your responsibilities are as the person accountable for outcomes. Ethical and governance fluency is not optional — it is a core professional competency in the AI era.

DATA PRIVACY: WHAT GOES IN, WHO OWNS IT

Every AI tool you use has a data handling policy. Many consumer-tier AI tools use your inputs to train their models. This creates serious risks when you paste:
- Customer names, contract details, or personally identifiable information
- Unreleased product roadmaps or strategic plans
- Employee performance information
- Proprietary technical specifications

Before using any AI tool with sensitive data, answer three questions:
1. Does this vendor use my inputs for model training? (Check the terms of service)
2. Is my organisation's data agreement with this vendor appropriate for this content?
3. What is the data residency of this tool — where does my data go physically?

For enterprise use: always use the enterprise tier of AI tools (ChatGPT Enterprise, Claude for Enterprise, Microsoft Copilot for M365) which provide explicit data isolation and do not use your inputs for training.

BIAS AND FAIRNESS RISKS IN PM CONTEXTS

AI systems reflect the biases present in their training data. For PMs, the most significant bias risks arise in:

Talent and resourcing decisions: If you ask AI to rank candidates or recommend team members for opportunities, you risk encoding historical biases into those recommendations. AI should inform, not decide, in these contexts.

Risk assessment: AI risk models trained on historical project data may underestimate risk for projects led by demographics underrepresented in the training set.

Communication tone calibration: AI tone adjustments ("make this more direct") can encode cultural communication biases.

The mitigation is not avoiding AI for these tasks — it is maintaining human judgment as the final decision-maker and periodically auditing AI recommendations for systematic bias.

INTELLECTUAL PROPERTY CONSIDERATIONS

When AI generates a document, code snippet, or plan for your project, who owns it? The answer varies by jurisdiction, AI vendor, and your organisation's agreements. Key points for PMs:

- Most enterprise AI agreements grant the customer ownership of outputs
- Consumer-tier AI tools typically retain the right to use your outputs for training
- Code generated by AI coding assistants may incorporate training data from open-source repositories — understand your organisation's policy on AI-generated code in production

When in doubt, involve legal and compliance before embedding AI-generated content in deliverables that will be sold, patented, or publicly released.

AI GOVERNANCE: BUILDING YOUR TEAM POLICY

A team AI policy does not need to be lengthy. A single page covering these five elements is sufficient:

1. Approved tools: Which AI tools are sanctioned for use, and for what categories of task
2. Data classification rules: What categories of data may and may not be input to AI tools
3. Review requirements: Which outputs must be reviewed by a human before use (the answer should be "all of them" for anything going to stakeholders)
4. Attribution: When and how to disclose AI assistance in deliverables
5. Incident reporting: What to do if AI produces harmful, biased, or erroneous output

Publish this as a team norm in your project wiki. Update it quarterly as the tooling landscape evolves.

THE PM AS ETHICAL BACKSTOP

In the AI era, the PM is often the last human in the loop before AI output reaches stakeholders or gets embedded in decisions. This makes you the ethical backstop for your project.

Ask yourself before sending any AI-assisted communication: Would I be comfortable if the recipient knew this was AI-drafted? If not, either revise it until you are comfortable, or write it yourself.

The goal is not to hide AI use — it is to use AI in a way you would be proud to disclose. That standard will serve you well throughout your career.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- 1.6 The AI-Augmented PM/SM: Your New Role Definition
  UPDATE public.videos SET
    description = 'What does the project manager role actually look like when AI handles the administrative burden? This lesson redefines the PM and Scrum Master job description for the AI era — identifying which responsibilities expand, which shrink, which new capabilities become essential, and how to position yourself as an irreplaceable strategic leader rather than a process administrator.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '1.6 The AI-Augmented PM/SM: Your New Role Definition',
      'description', 'What does the project manager role actually look like when AI handles the administrative burden? This lesson redefines the PM and Scrum Master job description for the AI era — identifying which responsibilities expand, which shrink, and which new capabilities become essential.',
      'transcript', $t$THE AI-AUGMENTED PM/SM: YOUR NEW ROLE DEFINITION

The traditional project manager job description is built around coordination overhead: scheduling meetings, taking notes, writing status reports, updating trackers, distributing information, and chasing people for updates. This is not a criticism — in a world without AI tools, someone had to do all of that, and doing it well required genuine skill.

But AI can now do most of it faster and with comparable quality. Which means the PM role is not disappearing — it is being upgraded. The question is what you do with the hours AI frees up.

THE SHRINKING ADMINISTRATIVE CORE

Tasks that AI is absorbing from the traditional PM role:

- Meeting note-taking and action item extraction (Otter.ai, Fireflies, Teams Copilot)
- Status report drafting from data sources (ChatGPT, Claude)
- User story writing from rough requirements (ChatGPT, Copilot)
- Risk identification from project parameters (AI risk models)
- Schedule impact analysis from scope changes (AI planning tools)
- Template population and document formatting (AI document tools)

These tasks collectively consumed thirty to fifty percent of a traditional PM's week. As AI absorbs them, that time is freed for higher-value work.

THE EXPANDING STRATEGIC CORE

The PM capabilities that AI amplifies rather than replaces:

Strategic alignment: AI can tell you if a deliverable is done. It cannot tell you if it is the right deliverable. PMs who deeply understand organisational strategy and can continuously align project scope to it become more valuable, not less.

Stakeholder relationship management: AI can draft the communication. It cannot build the trust, read the room, navigate the politics, or know which executives need to hear what in which order. The human relationship is irreplaceable.

Decision quality: AI can surface options and model scenarios. The PM must own the decision and be accountable for outcomes. The PM who can translate AI analysis into clear, courageous recommendations becomes the most valuable person in the room.

Ethical oversight: AI operates within parameters. The PM must ask whether those parameters are right. Whether the project is causing harm. Whether the process is fair. These are human responsibilities.

Team culture and psychological safety: AI cannot build the team environment where people surface risks early, own failures honestly, and help each other grow. This remains entirely human work.

NEW COMPETENCIES FOR THE AI ERA

Beyond the traditional PM skill set, AI-era PMs need:

Prompt engineering: The ability to craft precise, structured prompts that produce reliable, high-quality AI outputs. This is as important as knowing how to write a clear requirements document.

AI output evaluation: The ability to rapidly assess whether AI output is accurate, appropriate, and safe to use. This requires domain knowledge, critical thinking, and healthy scepticism.

AI workflow design: The ability to design PM processes that incorporate AI at each step — not just as a bolt-on, but as an integral part of how work gets done.

Data literacy: As AI surfaces more project analytics, PMs who can interpret and act on data have a significant advantage over those who cannot.

YOUR REVISED JOB DESCRIPTION

An AI-augmented PM or Scrum Master in 2025 and beyond:

- Directs AI to handle information gathering, formatting, and first-draft generation
- Focuses human attention on relationship building, strategic decision-making, and team health
- Designs and maintains team AI workflows as a core operational responsibility
- Serves as the ethical reviewer and quality controller for all AI outputs
- Continuously develops personal and team AI capability as a professional discipline
- Communicates AI-assisted work transparently to stakeholders and leadership

This is not a smaller or less important role. It is a more powerful one. The administrative PM was constrained by the volume of information work that had to be done manually. The AI-augmented PM is freed to lead.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- 1.7 Hands-On: Setting Up Your AI Workspace
  UPDATE public.videos SET
    description = 'Theory becomes capability only through practice. This lesson walks you through setting up a complete AI workspace for PM and Scrum work: configuring ChatGPT and Claude with project-specific context, installing the right browser extensions and integrations, building your first prompt library, and establishing the daily AI habits that will compound into career-defining productivity gains.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '1.7 Hands-On: Setting Up Your AI Workspace',
      'description', 'Theory becomes capability only through practice. This lesson walks you through setting up a complete AI workspace: configuring ChatGPT and Claude with project context, installing key integrations, building your first prompt library, and establishing daily AI habits that compound over time.',
      'transcript', $t$HANDS-ON: SETTING UP YOUR AI WORKSPACE

Reading about AI tools and using AI tools are two different things. This lesson is about the latter. By the end, you will have a functional AI workspace configured for PM and Scrum work, your first prompt templates saved and ready to use, and a daily routine built around AI augmentation.

TOOL STACK: WHAT YOU NEED

Core AI assistants (pick one or both):
- ChatGPT (openai.com): GPT-4o with excellent reasoning, wide plugin ecosystem, and strong document understanding. The most widely used.
- Claude (claude.ai): Anthropic's model. Exceptional for long-form writing, nuanced analysis, and working with long documents. Often produces better prose.

Meeting intelligence (pick one):
- Otter.ai: Excellent for Zoom and Google Meet. Real-time transcription, AI summary, action item extraction.
- Fireflies.ai: Strong Slack and CRM integrations. Good for sales-adjacent projects.
- Microsoft Teams Copilot: Best if your organisation is already on M365.

Documentation and knowledge management:
- Notion AI: Best if you already use Notion for team wikis and docs
- Confluence AI: If your org runs on Atlassian

Backlog and planning:
- Jira AI: Smart issue creation, sprint health insights
- Linear AI: Excellent for product engineering teams

CONFIGURING CHATGPT FOR YOUR PROJECT

Use the Custom Instructions feature (Settings → Personalise → Custom Instructions) to give ChatGPT persistent context about you and your work:

What to include in "What would you like ChatGPT to know about you?":
- Your role: "I am a Scrum Master / Senior PM at [type of company, industry]"
- Your context: "Our team uses Jira for backlog, Confluence for docs, Slack for comms"
- Your output preferences: "Always use British English. Format status reports as bullet points with a RAG status."
- Your domain: "Our product is a SaaS B2B platform in the fintech space"

What to include in "How would you like ChatGPT to respond?":
- "Be direct and concise — I am a busy PM, not a student"
- "When I give you rough notes, produce polished output ready to send"
- "Always flag if you are uncertain about a factual claim"

BUILDING YOUR FIRST PROMPT LIBRARY

A prompt library is a collection of tested, reusable prompts for your most frequent PM tasks. Start with these five:

Prompt 1 — Meeting summary:
"Here are the raw notes from our [meeting type] on [date]. Extract: 1) Key decisions made, 2) Action items with owner and due date, 3) Open questions requiring follow-up, 4) Any risks or blockers raised. Format as a structured memo."

Prompt 2 — Status report:
"Here is this week's project data: [sprint velocity, completed items, blockers, upcoming milestones]. Draft a concise executive status update. Include a RAG status (Red/Amber/Green) with one-sentence justification. Keep it under 200 words."

Prompt 3 — User story:
"Write a user story for the following requirement: [description]. Follow INVEST principles. Include a clear acceptance criteria checklist with 3–5 testable criteria."

Prompt 4 — Risk identification:
"I am running a project to [project description]. Based on this context, identify the top 5 risks I should be tracking. For each, provide: risk description, likelihood (H/M/L), impact (H/M/L), and one suggested mitigation."

Prompt 5 — Retrospective summary:
"Here are the sticky notes from our sprint retrospective: [raw list]. Synthesise these into: What went well (top 3 themes), What to improve (top 3 themes), Action items for next sprint (specific, owner-assigned)."

Save these in a shared team document. Refine them each sprint based on what produces the best outputs.

SETTING UP YOUR MEETING INTELLIGENCE TOOL

For Otter.ai:
1. Connect your Google or Microsoft calendar
2. Enable "Auto-join meetings" for automatic recording
3. Set your vocabulary list to include project-specific terms, product names, and team member names
4. Configure the summary email to go to your team inbox after each meeting

For Fireflies:
1. Invite the Fireflies bot to your calendar
2. Connect to your Slack workspace for automatic posting of summaries
3. Set up a dedicated Slack channel (#meeting-notes or #project-updates) for auto-posting

YOUR DAILY AI ROUTINE

Morning (10 minutes):
- Review overnight AI-generated summaries and action item reminders
- Use AI to draft your daily standup update from your task list
- Check AI-generated sprint health indicators if your tool provides them

During meetings (ongoing):
- Let your meeting intelligence tool run in the background
- Trust the transcription; focus on listening and contributing rather than note-taking

After meetings (5 minutes):
- Review the AI-generated summary immediately while the meeting is fresh
- Correct any names or technical terms the AI got wrong
- Distribute the corrected summary to attendees

End of week (20 minutes):
- Ask AI to draft your weekly status update from the meeting summaries and Jira data
- Review, personalise, and send
- Add any new effective prompts to your shared prompt library

This routine takes approximately 35 minutes of intentional AI use per day. Over a five-day week, it will save three to eight hours of administrative work — and will improve the quality and consistency of your communication outputs.

You now have your workspace. Let's start using it.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- ══════════════════════════════════════════════════════════════
  -- MODULE 2 — AI for Sprint Planning & Backlog Management
  -- ══════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 1;

  -- 2.1 AI-Powered User Story Writing with ChatGPT and Copilot
  UPDATE public.videos SET
    description = 'User story writing is one of the most time-consuming and inconsistency-prone parts of backlog management. This lesson shows you exactly how to use ChatGPT and GitHub Copilot to produce INVEST-compliant user stories with rigorous acceptance criteria in minutes — along with the review discipline to catch what AI gets wrong.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '2.1 AI-Powered User Story Writing with ChatGPT and Copilot',
      'description', 'User story writing is one of the most time-consuming and inconsistency-prone parts of backlog management. This lesson shows you how to use ChatGPT and GitHub Copilot to produce INVEST-compliant stories with rigorous acceptance criteria in minutes.',
      'transcript', $t$AI-POWERED USER STORY WRITING WITH CHATGPT AND COPILOT

User story quality is one of the highest-leverage variables in Agile delivery. Well-written stories enable accurate estimation, clear development, and testable acceptance. Poorly-written stories cause scope creep, rework, failed sprints, and stakeholder disappointment. Yet most teams write user stories under time pressure, without a consistent process, producing quality that varies dramatically from author to author.

AI changes this equation entirely.

THE INVEST CRITERIA: YOUR QUALITY BENCHMARK

Before using AI to write stories, you must understand what makes a good user story. The INVEST framework provides the benchmark:

- Independent: The story can be developed and delivered without depending on other incomplete stories
- Negotiable: Details are open to discussion; the story is not a rigid contract
- Valuable: It delivers clear value to the user or business
- Estimable: The team can meaningfully size it
- Small: It can be completed within one sprint
- Testable: Clear, verifiable acceptance criteria exist

AI is excellent at checking stories against these criteria — but only if you ask it to.

THE BASIC USER STORY PROMPT

Start with this template:

"I need a user story for the following feature: [one to three sentence description of what the feature should do and for whom]. Write it in the standard format: 'As a [user type], I want [capability], so that [benefit].' Then write five acceptance criteria in Given/When/Then format. Check the story against INVEST criteria and flag any concerns."

Example input: "Feature: A dashboard widget that shows the current sprint's burndown chart, updating in real time. For development team members and the Scrum Master."

What you get back — and what to verify:
- The story title and narrative: check that the user type is accurate and the benefit is real
- Acceptance criteria: check that each is binary (pass/fail), testable, and not too implementation-specific
- INVEST concerns: take these seriously — AI is good at spotting stories that are too large or not independently deliverable

FROM ROUGH REQUIREMENTS TO STORY MAP

AI excels at taking a rough requirements document and generating an entire story map from it. The prompt:

"Here is a feature requirements brief: [paste the document]. Break this into a set of user stories following INVEST principles. Group them by epic. For each story, write a title, user narrative, and three acceptance criteria. Flag any requirements that are too vague to write a testable story for."

This turns a one-hour manual decomposition session into a ten-minute review-and-refinement session. The PM's job shifts from writing to editing — a much faster and more consistent process.

USING GITHUB COPILOT FOR TECHNICAL STORIES

GitHub Copilot has a chat feature that works exceptionally well for technical and engineering user stories, because it can reason about code architecture:

"Here is our current API endpoint structure: [paste]. Write a user story for adding a new endpoint that allows [described functionality]. Include acceptance criteria that reference the specific API contract (request/response format, error codes, performance SLA)."

For PMs who work closely with engineering teams, this produces stories that are immediately credible to developers — they do not need to translate from business language to technical language because the AI has already done it.

ACCEPTANCE CRITERIA ANTI-PATTERNS TO WATCH FOR

AI can produce acceptance criteria that look good but fail in practice. Watch for these:

Anti-pattern 1 — Implementation criteria disguised as acceptance criteria:
"Given the system uses Redis caching, when the user loads the page..." This locks in implementation decisions that should be left to the development team.

Anti-pattern 2 — Unmeasurable criteria:
"The page should load quickly." Quickly compared to what? Revise to: "The page should load within 2 seconds on a standard broadband connection as measured by WebPageTest."

Anti-pattern 3 — Criteria that test the system rather than the user experience:
"Given the database query returns a result, when the user..." Users do not experience database queries — they experience the interface.

When AI produces these patterns, ask it to revise: "The third acceptance criterion is testing implementation rather than user experience. Rewrite it to describe what the user observes."

THE REVIEW WORKFLOW

AI-generated stories should always go through this review before entering the backlog:

1. PM review: Check for accuracy against the original requirement and business value alignment
2. Tech lead review: Check for technical feasibility and appropriate scope
3. QA review: Check that acceptance criteria are testable and unambiguous
4. Story brief refinement session: Quick team conversation to negotiate details

AI speeds up steps 1 and 2 dramatically. It does not replace the conversation in step 4.

BUILDING A STORY TEMPLATE LIBRARY

As you generate user stories with AI, save the prompts that produce the best outputs for recurring story types:

- Authentication and authorisation stories
- Dashboard and reporting stories
- Integration and API stories
- Notification and communication stories
- Settings and configuration stories

Within two or three sprints, you will have a prompt library that produces consistently high-quality stories for your product domain — stories that reflect your specific users, technical constraints, and quality standards.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 0;

  -- 2.2 Backlog Prioritization with AI: MoSCoW, WSJF, and Beyond
  UPDATE public.videos SET
    description = 'Backlog prioritisation is where business strategy meets development capacity — and it is one of the most cognitively demanding tasks a PM faces. This lesson shows you how to use AI to apply prioritisation frameworks like MoSCoW, WSJF, and RICE at scale, surface hidden dependencies, and facilitate data-driven prioritisation conversations with stakeholders.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '2.2 Backlog Prioritization with AI: MoSCoW, WSJF, and Beyond',
      'description', 'Backlog prioritisation is where business strategy meets development capacity. This lesson shows you how to use AI to apply MoSCoW, WSJF, and RICE at scale, surface hidden dependencies, and facilitate data-driven prioritisation conversations with stakeholders.',
      'transcript', $t$BACKLOG PRIORITIZATION WITH AI: MOSCOW, WSJF, AND BEYOND

Every backlog grows faster than it can be worked. Features are requested by stakeholders, bugs are raised by users, technical debt is flagged by engineers, and regulatory requirements arrive from compliance. Without a systematic prioritisation process, the backlog becomes a political document — the loudest voice wins, and strategy loses.

AI does not eliminate the need for prioritisation judgment. It does three valuable things: it applies frameworks consistently at scale, it surfaces information that improves the quality of human judgments, and it dramatically reduces the time needed to prepare a prioritised backlog for review.

THE THREE FRAMEWORKS AND WHEN TO USE EACH

MoSCoW — Best for: Release planning, MVP scoping, communicating priorities to non-technical stakeholders.
- Must have: Non-negotiable for the release to succeed
- Should have: High value, significant pain if absent, but workarounds exist
- Could have: Nice to have, can defer without meaningful impact
- Won't have: Explicitly out of scope for this release

WSJF (Weighted Shortest Job First) — Best for: Quantitative ranking in SAFe or scaled Agile contexts where cost of delay is measurable.
- WSJF = Cost of Delay ÷ Job Size
- Cost of Delay = User/Business Value + Time Criticality + Risk Reduction/Opportunity Enablement
- Forces explicit thinking about what it costs to delay each item

RICE — Best for: Product teams with enough data to score each dimension.
- Reach × Impact × Confidence ÷ Effort
- Produces a ranked list that is easy to defend to stakeholders
- Highly sensitive to how Reach and Impact are estimated — AI can stress-test your estimates

USING AI TO APPLY MOSCOW AT SCALE

Prompt:
"Here is our backlog of [N] items for the upcoming release: [paste list]. Our release goals are: [one to three sentences]. Apply MoSCoW prioritisation to each item. For items you classify as Must Have, provide a one-sentence justification. For items you classify as Won't Have, suggest which future release they might be appropriate for."

What AI does well: Consistent application of the framework, identifying obvious Must Haves and Won't Haves, drafting justifications.
What to verify: Edge cases — items that could be either Must Have or Should Have often require human judgment about stakeholder relationships and strategic context that AI does not have.

USING AI TO CALCULATE WSJF SCORES

AI cannot know your cost of delay inputs without you providing them — but once you do, it can calculate and rank at speed.

Prompt:
"Here is our backlog with WSJF input scores for each item: [paste table with columns: Item, User Value, Time Criticality, Risk Reduction, Job Size]. Calculate the WSJF score for each item, rank them highest to lowest, and highlight any items where the ranking might seem counterintuitive so I can review the inputs."

The "highlight counterintuitive rankings" instruction is important — it prompts AI to flag items where a quick-win low-value item might score higher than a high-value long-effort item, letting you decide whether to override the formula.

SURFACING HIDDEN DEPENDENCIES

One of the highest-value applications of AI in backlog management is dependency detection — identifying which stories cannot be started until others are complete, which engineers cannot work in parallel, and which dependencies create critical path risks.

Prompt:
"Here are our next sprint's candidate stories: [list]. Identify any dependencies between these stories. For each dependency, specify: which story blocks which, what the dependency is, and whether the dependent story can be started in parallel with any independent work."

Teams that do this consistently have fewer sprint failures caused by dependencies that were not visible during planning.

FACILITATING AI-ASSISTED PRIORITISATION SESSIONS

One of the most powerful use cases is using AI to prepare for prioritisation meetings rather than conducting the prioritisation in the meeting. The pattern:

1. Before the meeting: Ask AI to produce a draft prioritised backlog with justifications
2. In the meeting: Use the AI draft as the starting point for discussion, not a blank canvas
3. After the meeting: Ask AI to update the prioritisation based on the decisions made

This shifts the meeting from "let's figure out the priorities" to "let's validate and refine this draft" — a much faster and more focused conversation.

THE PRIORITISATION ANTI-PATTERNS AI CAN HELP SPOT

- HiPPO prioritisation (Highest Paid Person's Opinion): Ask AI to identify items that appear to have no clear user value justification
- Recency bias: Ask AI to identify items that have been in the backlog for over 90 days but have never been prioritised — these need to be either scheduled or explicitly removed
- Scope creep camouflage: Ask AI to identify items that appear to expand the scope of an existing feature without a corresponding value justification

These prompts surface conversations that need to happen — they do not make the decisions for you.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- 2.3 AI-Assisted Effort Estimation and Story Pointing
  UPDATE public.videos SET
    description = 'Effort estimation is one of the most consistently inaccurate activities in software delivery — and one of the most impactful when done well. This lesson shows you how to use AI to improve estimation quality through historical comparison, assumption surfacing, and uncertainty quantification, making your sprint commitments more reliable and your stakeholder communications more honest.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '2.3 AI-Assisted Effort Estimation and Story Pointing',
      'description', 'Effort estimation is consistently inaccurate in software delivery — but impactful when done well. This lesson shows you how AI improves estimation quality through historical comparison, assumption surfacing, and uncertainty quantification, making sprint commitments more reliable.',
      'transcript', $t$AI-ASSISTED EFFORT ESTIMATION AND STORY POINTING

Software effort estimation is notoriously inaccurate. Studies consistently find that development work is underestimated by 30–200%, with the Standish Group's CHAOS Report showing that only 29% of software projects deliver on time and on budget. This is not primarily a failure of developer competence — it is a failure of estimation methodology.

AI cannot make estimation perfect. But it can systematically address the most common failure modes: anchoring bias, missing assumptions, scope ambiguity, and failure to learn from historical data.

WHY ESTIMATION FAILS (AND HOW AI ADDRESSES EACH CAUSE)

Cause 1 — Anchoring bias: The first estimate stated in the room exerts disproportionate influence on the group's final estimate. AI addresses this by generating an independent reference estimate before discussion.

Cause 2 — Missing assumptions: Teams estimate the work they understand and fail to account for the unknowns they have not yet identified. AI explicitly surfaces assumptions and flags unknowns.

Cause 3 — Scope ambiguity: Vague stories produce vague estimates because team members imagine different things. AI improves story quality before estimation, reducing this variance.

Cause 4 — Failure to learn from history: Teams routinely underestimate the same categories of work sprint after sprint because they do not systematically compare new estimates to historical actuals. AI can process historical data and identify these patterns.

USING AI FOR PRE-ESTIMATION STORY REVIEW

Before a refinement or planning session, run each candidate story through this prompt:

"Review this user story for estimation readiness: [paste story]. Identify: 1) Any acceptance criteria that are ambiguous or untestable, 2) Any technical questions that are unresolved, 3) Any dependencies on other teams or systems that could affect the estimate, 4) Similar work this team may have done previously that could serve as an analogy."

Stories that fail this review should be moved back to refinement rather than estimated. Teams that do this consistently reduce estimation variance dramatically because they only estimate stories that are well-defined.

USING AI TO GENERATE REFERENCE ESTIMATES

Before your planning poker session, ask AI to provide a size comparison:

"Based on this user story [paste story], compare it to these completed stories from our backlog: [paste five to ten historical stories with their story points and brief descriptions]. What size range does this new story fall into? What assumptions are you making? What would change your estimate?"

Present this AI-generated reference to the team after they have voted privately, not before. The goal is to give the team an independent anchor to compare against their own estimates — not to tell them what to think.

THE ASSUMPTION SURFACING TECHNIQUE

For complex or uncertain stories, this prompt is invaluable:

"Here is a user story we need to estimate: [paste story]. List all the assumptions that must be true for this story to be completable as written. For each assumption, classify it as: Confirmed (we know this is true), Likely (we believe but have not verified), or Unknown (this needs to be investigated before we can estimate reliably)."

Stories with multiple Unknown assumptions should carry a range estimate rather than a point estimate, and the unknowns should be converted into explicit spike stories.

T-SHIRT SIZING WITH AI FOR ROADMAP-LEVEL PLANNING

At the roadmap level, you need rough relative sizing (S/M/L/XL) rather than precise story points. AI can do this at scale:

"Here are twenty features from our twelve-month roadmap: [paste list]. Size each one as XS/S/M/L/XL based on typical patterns for B2B SaaS product development. State your assumptions. Flag any where there is high uncertainty that would make sizing unreliable."

This gives you a first-pass roadmap capacity view in minutes rather than a multi-hour estimation workshop. The workshop then focuses on the high-uncertainty items only.

MEASURING AND IMPROVING ESTIMATION ACCURACY

Velocity tracking is only useful if you compare estimated points to actual completion and look for systematic biases. Ask AI to do this analysis periodically:

"Here are our last eight sprints of data: [paste table with story, estimated points, actual points, category]. Identify: 1) Which story categories we consistently over or underestimate, 2) Whether our estimation accuracy is improving or declining over time, 3) Any stories that were significantly different from their estimate and what might explain the variance."

Use this analysis in retrospectives. Systematic overestimation in specific categories (integrations, database migrations, mobile-specific work) indicates a calibration problem that can be corrected with a team conversation.

WHAT AI CANNOT DO IN ESTIMATION

Be honest with your team: AI cannot account for the knowledge that only your team possesses — specific technical debt in your codebase, unusual constraints in your architecture, individual skill levels, and the interpersonal dynamics that affect how quickly the team moves on different kinds of work. The team's estimate, informed by AI analysis, will always be more accurate than AI's estimate alone.

The goal is AI as preparation and calibration tool, not AI as the estimator.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- 2.4 Jira AI and Linear AI: Hands-On Backlog Automation
  UPDATE public.videos SET
    description = 'Jira and Linear — the two dominant backlog management tools — have both embedded significant AI capabilities that most teams are not using. This lesson walks through the most impactful AI features in each platform: smart issue creation, duplicate detection, sprint health insights, and automated triage — giving you a practical playbook for immediate implementation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '2.4 Jira AI and Linear AI: Hands-On Backlog Automation',
      'description', 'Jira and Linear have both embedded significant AI capabilities that most teams are not using. This lesson walks through the most impactful features in each: smart issue creation, duplicate detection, sprint health insights, and automated triage.',
      'transcript', $t$JIRA AI AND LINEAR AI: HANDS-ON BACKLOG AUTOMATION

Backlog management tools have historically been very good at storing and displaying work — and not much more. With AI embedded in both Jira and Linear, that is changing. The most forward-looking teams are now using these AI capabilities to save several hours per sprint of backlog management overhead.

JIRA AI: KEY CAPABILITIES AND HOW TO USE THEM

Jira's AI capabilities (under the Atlassian Intelligence umbrella) are available on Jira Premium and above. The most valuable for PMs:

1 — Smart Issue Creation
From a meeting summary, requirements doc, or rough notes, Jira AI can create structured issues. The workflow:
- Paste your notes or requirements into the "Create with AI" prompt
- Jira generates a list of suggested issues with titles, descriptions, and labels
- Review, edit, and bulk-create in one action

This replaces thirty to sixty minutes of manual issue creation after a requirements meeting with a five-minute review.

2 — Duplicate Detection
Jira AI detects when a newly created issue is semantically similar to an existing one. Pay attention to these warnings — they surface technical debt items being re-raised under different names, bugs that were already known but not actioned, and feature requests from different stakeholders that are actually the same need.

3 — Sprint Health Summary
Ask Atlassian Intelligence: "Summarise the current state of Sprint [N]. What are the main risks to completing the sprint commitment?" The AI analyses velocity, days remaining, blocked items, and unassigned work to produce a health assessment.
Use this each Monday and Wednesday to stay ahead of sprint risks.

4 — Issue Summarisation
For epics and large stories with extensive comment threads, Jira AI can summarise the entire discussion into a two to three paragraph brief. Invaluable for onboarding a new team member or stakeholder to a long-running issue.

5 — JQL Query Generation
Ask Jira AI in plain English: "Show me all bugs created in the last sprint that are still unresolved and assigned to the backend team." It generates the JQL. This dramatically lowers the barrier to extracting custom reports from your project data.

LINEAR AI: KEY CAPABILITIES AND HOW TO USE THEM

Linear has built AI features directly into the core product — they are available on all paid tiers and are generally considered more seamlessly integrated than Jira's AI.

1 — AI Issue Enhancement
When you create an issue, Linear AI automatically suggests improvements to the title, expands a brief description into a structured one, and suggests labels and assignees based on similar historical issues. The friction to creating a high-quality issue drops to near zero.

2 — Triage Mode with AI
In triage mode, Linear AI pre-scores incoming issues by urgency and impact based on their content and similarity to past issues. The PM's job is to validate and override rather than to do the initial assessment from scratch.

3 — Cycle (Sprint) Summaries
At the end of each cycle, Linear can generate a structured summary of what was completed, what was rolled over, and what patterns are visible in the data. This feeds directly into your sprint review presentation.

4 — Context-Aware Search
Linear's AI search understands semantic meaning, not just keyword matching. Ask "find all issues related to the payment checkout experience" and it will surface relevant issues even if they do not contain those exact words.

5 — Workspace Insights
Linear provides AI-generated insights about team throughput patterns, bottlenecks, and cycle time trends. Review these monthly to identify structural issues in your delivery process.

CHOOSING BETWEEN JIRA AND LINEAR FOR AI-AUGMENTED TEAMS

If your organisation already uses Jira: invest in Atlassian Intelligence and establish the workflows above. The cost-benefit of switching is rarely justified by AI feature differences alone.

If you are starting fresh or your team is primarily product engineering: Linear's AI integrations are faster, more intuitive, and require less configuration. For teams of fewer than 150 people, Linear often outperforms Jira on PM overhead metrics.

If you manage both engineering and non-engineering workstreams: Jira's breadth wins. The AI features, while slightly less polished, cover a wider range of work types.

THE BACKLOG HYGIENE AUTOMATION ROUTINE

Both tools support AI-assisted backlog grooming. Build this into your weekly routine:

- Monday: Ask AI to list all items that have been in the backlog more than 90 days without being scheduled. Decide: schedule, close, or move to parking lot.
- Wednesday: Run sprint health check. Identify at-risk items and take action.
- Friday: Use AI to generate the week's summary of completed work. Feed this to your stakeholder update.

Total time: approximately 20 minutes per week. Output quality: consistently higher than manual alternatives.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- 2.5 AI for Sprint Planning Meetings: From Prep to Commitment
  UPDATE public.videos SET
    description = 'Sprint planning meetings are often the longest and least efficient ceremony in the Scrum calendar. This lesson shows you how AI can transform sprint planning from a gruelling negotiation into a focused, data-driven commitment session — through AI-prepared backlog briefs, capacity-based forecasting, goal drafting, and post-planning documentation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '2.5 AI for Sprint Planning Meetings: From Prep to Commitment',
      'description', 'Sprint planning meetings are often the longest and least efficient Scrum ceremony. This lesson shows how AI transforms them from gruelling negotiations into focused, data-driven commitment sessions — through AI-prepared briefs, capacity forecasting, goal drafting, and post-planning documentation.',
      'transcript', $t$AI FOR SPRINT PLANNING MEETINGS: FROM PREP TO COMMITMENT

Sprint planning is the ceremony where the team commits to what they will deliver in the next sprint. When done well, it is energising — the team has clarity, confidence, and a shared understanding of the goal. When done poorly, it is exhausting — a multi-hour negotiation over unclear stories, contested estimates, and unrealistic capacity assumptions.

AI does not make planning decisions for your team. But it transforms the inputs to planning so dramatically that the meeting itself becomes faster, more focused, and more likely to result in a commitment the team can actually keep.

PRE-PLANNING PREPARATION: THE 30-MINUTE AI ROUTINE

The day before sprint planning, spend 30 minutes with AI to prepare the following:

1 — Capacity Summary
"Our sprint runs from [date] to [date]. Here are the team members and their availability: [list with any planned leave or part-time commitments]. Last sprint's velocity was [N] points. Based on capacity, what is a realistic sprint commitment range?"

AI accounts for the PTO and partial availability that PMs often mentally round up. The result is a capacity number you can defend to the team with data.

2 — Story Readiness Check
"Here are the candidate stories for our next sprint: [list with brief descriptions]. For each, flag whether it appears ready for planning based on: does it have acceptance criteria, is it estimated, are there obvious unresolved dependencies?"

Stories that fail this check come off the candidate list before planning starts, not during it.

3 — Sprint Goal Draft
"Here are the top priorities for our next sprint: [list]. The business context is [one paragraph about current priorities and pressures]. Draft three alternative sprint goal statements we could choose from. Each should be outcome-focused (what value we create), not output-focused (what features we build)."

Coming into planning with three candidate goals gives the Product Owner and team a starting point for the goal conversation rather than a blank canvas.

4 — Meeting Agenda and Timing
"Our sprint planning meeting is 90 minutes for a two-week sprint. Here are the stories we plan to discuss: [list with estimated points]. Create a meeting agenda with time allocations that will keep us on track."

RUNNING THE PLANNING MEETING WITH AI SUPPORT

During planning, keep your AI assistant window open (but out of the team's direct view). Use it to:

Quickly compare a contested story to historical analogues: "The team is debating whether this story is a 3 or a 5. Here is the story [paste]. Here are two historical 3-point stories and two historical 5-point stories [paste]. Which does this more closely resemble?"

Generate instant alternatives when a story is not ready: "This story just got pulled from the sprint because [reason]. Here are three candidate stories that were just outside the commitment. Which would make the most sense as a replacement based on sprint goal alignment?"

Draft the definition of done for a complex story on the fly: "The team just committed to this story: [paste]. Draft a definition of done checklist that the whole team would agree with."

POST-PLANNING DOCUMENTATION

Within 15 minutes of the planning meeting ending, use AI to generate the sprint artefacts:

Sprint brief:
"Here is what we committed to in sprint planning: [list of stories with points]. Our sprint goal is [paste]. Draft a sprint brief document that includes: the goal, the committed stories, team capacity, key risks, and dependencies."

Stakeholder summary:
"Here is what our team committed to deliver in Sprint [N]: [committed stories list]. Write a two-paragraph stakeholder summary that explains what business value this sprint delivers and what stakeholders can expect to see in the sprint review."

Calendar invites and reminders:
Use your automation tool (Zapier, Make, or n8n) to automatically create calendar invites for all sprint ceremonies the moment the sprint starts. This sounds trivial but eliminating the recurring scheduling overhead saves thirty minutes per sprint.

THE SPRINT COMMITMENT CONTRACT

The output of a well-run AI-assisted planning session is a sprint commitment that has four qualities:

1. Clear: Every team member understands exactly what is being built and why
2. Realistic: Based on actual capacity and historical velocity, not optimistic guessing
3. Goal-oriented: Connected to a sprint goal that frames individual stories in business context
4. Documented: Captured in a brief that stakeholders can reference without asking the team

When all four are present, sprint execution is faster and stakeholder relationships are smoother. This is the planning standard to build toward.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- 2.6 Refinement Sessions Supercharged by AI
  UPDATE public.videos SET
    description = 'Refinement is the engine that makes sprint planning possible — and it is chronically underpowered in most teams. This lesson shows you how AI can transform refinement from a catch-up session into a strategic capability: pre-generating story breakdowns, surfacing technical questions before the meeting, detecting dependencies, and producing refinement-ready stories that the team can estimate and commit with confidence.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '2.6 Refinement Sessions Supercharged by AI',
      'description', 'Refinement is the engine that makes sprint planning possible — and it is chronically underpowered in most teams. This lesson shows how AI transforms refinement into a strategic capability: pre-generating story breakdowns, surfacing technical questions, detecting dependencies, and producing stories teams can estimate with confidence.',
      'transcript', $t$REFINEMENT SESSIONS SUPERCHARGED BY AI

Backlog refinement is the discipline that separates teams who consistently deliver from teams who repeatedly stumble. A well-refined backlog means sprint planning is a confirmation exercise, not a discovery exercise. A poorly-refined backlog means sprint planning is an improvisation, sprint execution is chaotic, and retrospectives are full of "we didn't understand the story well enough" as a root cause.

AI can close the refinement gap significantly — if you use it systematically before the session, not just during it.

THE PRE-REFINEMENT AI WORKFLOW

Forty-eight hours before each refinement session, work through this sequence:

Step 1 — Epic decomposition
Take any epics approaching the top of the backlog and ask AI to decompose them:
"Here is an epic: [paste epic title and description]. Break this into a set of user stories that are each deliverable within one sprint. For each story, write: title, user narrative, and five acceptance criteria. Identify any stories that have a hard sequence dependency."

This generates the raw material for refinement, not the final stories. The team's job in the session is to validate, challenge, and improve — not to start from scratch.

Step 2 — Technical question surfacing
"Here are the candidate stories for our next refinement session: [paste list]. For each story, identify the top two or three technical questions that the development team would likely need answered before they can estimate it confidently."

Distribute this question list to the development team before the session. The team arrives having thought about the answers — or knowing they need to research before they can answer. Both outcomes are better than discovering the question mid-session.

Step 3 — Dependency mapping
"Here are the twelve stories we plan to refine this week: [paste list]. Identify any dependencies between them: which stories cannot start until another is complete, which stories share data models or API contracts, which stories might be in conflict for the same team member."

Dependency maps shape the refinement conversation. Stories with dependencies need joint refinement, not sequential siloed estimation.

Step 4 — Edge case identification
"For this user story: [paste story], identify five edge cases or error scenarios that the acceptance criteria do not currently address. For each, draft an additional acceptance criterion that would cover it."

Edge cases are the most common source of rework in Agile delivery. AI is excellent at systematically generating them — it has seen the patterns of what goes wrong across millions of examples.

RUNNING THE AI-ASSISTED REFINEMENT SESSION

Structure: Aim for 60–90 minutes maximum. Shorter is better. Longer is a symptom of insufficiently pre-refined stories.

Opening (5 minutes): Share the pre-generated questions with the team. Ask: "Before we start, are there any questions on this list we can already answer, or any stories we should pull from the session because they are clearly not ready?"

Story by story (5–10 minutes each):
- Start with the AI-generated story as the baseline
- The team's job is to challenge: "Is the user type right? Are these acceptance criteria testable? Have we covered the edge cases?"
- Document changes in real time (use a live doc or your AI assistant to capture edits)

The Definition of Ready check (1 minute per story): Before closing a story as refined, check:
- Does it have a clear, outcome-focused title?
- Is the user narrative accurate?
- Are all acceptance criteria binary and testable?
- Have dependencies been identified?
- Is it small enough to complete in one sprint?
- Are there any blocking questions? If yes, assign them to specific people with a deadline.

Closing (5 minutes): Ask AI to generate a summary of the session: "Here are the refinement decisions we made today: [paste notes]. Draft a refinement summary that documents: stories ready for planning, stories that need more work and why, open questions with assigned owners."

THE ROLLING REFINEMENT APPROACH

The best teams do not treat refinement as a weekly ceremony — they treat it as a continuous discipline. The rule: the backlog should always contain enough refined stories to fill two to three sprints. When it drops below this threshold, refinement sessions become urgent rather than strategic.

Use AI to monitor this: "Our current refined backlog contains [list the refined stories with estimated points]. At our average velocity of [N] points per sprint, how many sprints of refined work do we have? What is our refinement runway?"

When the runway drops below two sprints, escalate refinement time until it is restored.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- 2.7 Lab: Build an AI Backlog Management Pipeline
  UPDATE public.videos SET
    description = 'This hands-on lab walks you through building a complete AI-powered backlog management pipeline from scratch — from raw stakeholder input through to refined, estimated, prioritised stories ready for sprint planning. You will connect AI tools to your existing backlog system and establish the automated workflows that will save your team three to five hours per sprint from this point forward.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '2.7 Lab: Build an AI Backlog Management Pipeline',
      'description', 'This hands-on lab walks you through building a complete AI-powered backlog management pipeline — from raw stakeholder input through to refined, estimated, prioritised stories ready for sprint planning — and establishing automated workflows that save three to five hours per sprint.',
      'transcript', $t$LAB: BUILD AN AI BACKLOG MANAGEMENT PIPELINE

This is a hands-on lab. By the end, you will have a live AI backlog management pipeline connected to your actual tools. The exercises build on each other — complete them in sequence.

WHAT YOU WILL BUILD

A five-stage pipeline:
1. Intake → AI triage and story creation
2. Stories → AI refinement pre-processing
3. Backlog → AI prioritisation scoring
4. Refinement → AI-assisted session with pre-generated questions
5. Planning → AI capacity and goal drafting

TIME TO COMPLETE

Approximately two hours for initial setup. Fifteen to thirty minutes per sprint for ongoing operation.

STAGE 1: INTAKE PIPELINE

Exercise 1 — Set up a stakeholder intake form.
Use Google Forms, Typeform, or your intranet tool. Capture: Feature request title, Business problem being solved, User type affected, Success metric, Urgency (Low / Medium / High / Critical).

Exercise 2 — Connect intake to AI triage.
When a new form response arrives, use Zapier or Make to:
a) Send the response to ChatGPT with this prompt: "Assess this feature request: [response]. 1) Write a draft user story in standard format, 2) Classify urgency as Must Have / Should Have / Could Have / Won't Have for the current quarter, 3) Identify one question that needs answering before this can be estimated."
b) Post the AI-generated assessment to a dedicated Slack channel (#backlog-intake)
c) Create a draft Jira or Linear issue with the AI-generated content

This turns a stakeholder form submission into a draft backlog item without any PM manual effort.

STAGE 2: REFINEMENT PRE-PROCESSING

Exercise 3 — Set up a weekly pre-refinement report.
Schedule a weekly automation (Monday mornings) that:
a) Pulls all "In Refinement" issues from your backlog tool
b) Sends them to AI with this prompt: "For each of these stories, identify: the top technical question that needs answering, any edge cases not covered by the current acceptance criteria, and any dependencies on other items in this list."
c) Posts the resulting pre-refinement brief to your Slack project channel

This gives your team the analysis before the session, not during it.

STAGE 3: PRIORITISATION SCORING

Exercise 4 — Build a monthly prioritisation scorecard.
Create a spreadsheet with columns: Story/Epic title, Estimated effort (T-shirt size), Business value (1-5), Time sensitivity (1-5), Risk reduction (1-5).

Each month, populate this with your top backlog candidates. Then ask AI:
"Here is our prioritisation scorecard: [paste spreadsheet]. Calculate a composite priority score for each item (Business Value × 2 + Time Sensitivity + Risk Reduction) ÷ Effort Multiplier (XS=1, S=2, M=3, L=5, XL=8). Rank highest to lowest. Flag any items in the top 10 that have been in the backlog for more than 90 days."

The output drives your next sprint planning conversation.

STAGE 4: SPRINT PLANNING AUTOMATION

Exercise 5 — Automate the sprint setup workflow.
When a new sprint is started in your backlog tool, trigger an automation that:
a) Pulls the sprint commitment (all issues in the sprint)
b) Generates a sprint brief using your template
c) Creates the sprint review meeting invite with AI-drafted agenda
d) Posts the sprint goal to your team Slack channel

This is five minutes of setup that runs itself for every sprint.

STAGE 5: RETROSPECTIVE INPUT COLLECTION

Exercise 6 — AI-powered retro input.
24 hours before each retrospective, send an automated Slack message to the team:
"Our sprint retrospective is tomorrow. Before the meeting, reply to this message with: one thing that went well, one thing to improve, and one specific action you think the team should take."

Aggregate the responses and ask AI: "Here are the retrospective inputs from our team of [N]: [paste all responses]. Synthesise these into: top three themes from 'went well', top three themes from 'improve', and the five most frequently mentioned action ideas."

The facilitator walks into the retro with a pre-synthesised view. The session focuses on choosing actions, not generating them.

CONNECTING EVERYTHING

Draw your completed pipeline as a simple flow diagram:
Intake Form → AI Triage → Draft Issue → AI Refinement Brief → Refined Story → AI Prioritisation → Sprint Backlog → AI Sprint Brief → Sprint Execution → AI Retro Summary → Next Sprint

Congratulations. You now have an AI-augmented backlog management system. Post your pipeline diagram to the course community channel and share one thing you automated that surprised you with how much time it saves.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- ══════════════════════════════════════════════════════════════
  -- MODULE 3 — AI for Communication & Documentation
  -- ══════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 2;

  -- 3.1 Automated Meeting Summaries with Otter.ai and Fireflies
  UPDATE public.videos SET
    description = 'Meeting overhead — attending, taking notes, writing up, distributing — consumes an estimated 30–40% of a PM''s week. This lesson gives you a complete implementation guide for AI meeting intelligence tools: setup, configuration, accuracy optimisation, integration with your backlog and documentation systems, and the review discipline that keeps quality high.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '3.1 Automated Meeting Summaries with Otter.ai and Fireflies',
      'description', 'Meeting overhead consumes an estimated 30–40% of a PM''s week. This lesson gives you a complete implementation guide for AI meeting intelligence tools: setup, accuracy optimisation, integration with backlog and documentation systems, and the review discipline that keeps quality high.',
      'transcript', $t$AUTOMATED MEETING SUMMARIES WITH OTTER.AI AND FIREFLIES

A 60-minute project meeting, for a PM who attends, takes notes, writes up the summary, reviews action items, and distributes the output, typically consumes 90–120 minutes of total time. Multiply that by the eight to twelve meetings a typical PM runs or attends per week, and you have 12–24 hours of meeting-related overhead — the single largest category of PM administrative time.

AI meeting intelligence tools cut this to approximately 20–30 minutes total per week across all meetings. The five-to-eight hours saved is not just productivity gain — it is strategic reallocation from administrative work to leadership work.

TOOL OVERVIEW: OTTER.AI VS FIREFLIES

Otter.ai strengths:
- Best-in-class real-time transcription quality
- Native integration with Zoom, Google Meet, and Microsoft Teams
- AI Summary (OtterPilot) that auto-identifies action items and decisions
- Conversation intelligence features showing speaking time distribution
- Solid mobile app for in-person meetings

Fireflies.ai strengths:
- Stronger CRM integrations (Salesforce, HubSpot) — excellent for sales-adjacent PMs
- Better Slack auto-posting workflows
- Conversation analytics including sentiment tracking
- API access for custom integrations

For pure PM use, Otter.ai is the default recommendation. For PMs in client-facing or sales-adjacent roles, Fireflies often has the edge.

OTTER.AI SETUP: STEP BY STEP

Step 1 — Account and calendar connection
- Sign up at otter.ai (the Business plan is recommended for PM use — it adds admin controls and extended storage)
- Connect your Google or Microsoft calendar
- Enable "Auto-join meetings" in settings — this is the most important configuration step; it means Otter joins every meeting automatically without you having to remember

Step 2 — Vocabulary optimisation
Go to Settings → Custom Vocabulary. Add:
- Your product name and all feature names
- All team member names (first and last)
- Technical terms your team uses regularly
- Client or stakeholder names
- Project names and codenames

This dramatically improves transcription accuracy for domain-specific language.

Step 3 — Speaker training
In Otter, you can train it to recognise your voice and the voices of regular meeting participants. This makes the speaker attribution in transcripts significantly more accurate.

Step 4 — Output configuration
Set your default summary to include: Key decisions, Action items (with owner and due date), Key topics discussed. Enable automatic email distribution to meeting participants.

Step 5 — Downstream integration
Connect Otter to your Slack workspace to auto-post summaries to a designated channel (#meeting-notes or #project-updates). Consider also connecting to Notion or Confluence via Zapier to auto-save summaries to your project documentation.

FIREFLIES SETUP: STEP BY STEP

Step 1 — Invite the Fireflies bot
Add the Fireflies bot (fred@fireflies.ai) to your calendar. It will auto-join all scheduled meetings.

Step 2 — Workspace and channel setup
In the Fireflies dashboard, set up a Slack integration and designate the channel where summaries should be posted.

Step 3 — Automation rules
Configure rules for automatic upload: e.g., all meetings with more than two participants generate a summary, all meetings shorter than five minutes do not.

Step 4 — AI filter configuration
Fireflies allows you to filter summaries by topic — set up filters for "risk", "decision", "action", and "blocker" to surface these from every meeting without reading the full summary.

OPTIMISING AI SUMMARY QUALITY

Raw AI summaries are good first drafts, not finished outputs. The review discipline:

Immediately after the meeting (2–3 minutes):
- Scan the action items for accuracy: did AI attribute the right owner to each action?
- Check decisions: are all major decisions captured accurately?
- Add any context the AI could not have known (e.g., "the decision to defer was because of a stakeholder conversation outside this meeting")

Before distribution (2–3 minutes):
- Edit any awkward phrasing or misattributed quotes
- Confirm all named action items are correct before the named person receives them — inaccurate action attribution damages trust quickly
- Add the meeting date and sprint number for searchability

Distribution timing: Send within 30 minutes of the meeting. Within 30 minutes, the summary is still useful context for the day's work. By the next morning, urgency has faded and action items have already been forgotten.

BUILDING A MEETING INTELLIGENCE ARCHIVE

After two to three months of consistent use, your meeting intelligence tool accumulates a searchable archive of every project conversation. This becomes invaluable for:

- Onboarding new team members: "Search for conversations about [feature] to understand the history"
- Dispute resolution: "Let's check what was actually decided in the planning meeting"
- Retrospective input: "Pull all action items from the last sprint's meetings and check which were completed"
- Stakeholder accountability: "The client agreed to this approach — here is the transcript reference"

This institutional memory is one of the highest long-term returns on AI meeting tool investment.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 0;

  -- 3.2 Stakeholder Reports and Status Updates with AI
  UPDATE public.videos SET
    description = 'Status reporting is both essential and time-consuming — and it is one of the PM tasks where AI delivers the fastest and most dramatic quality improvement. This lesson gives you a complete system for AI-assisted stakeholder reporting: the data inputs to collect, the prompts that produce executive-quality output, the RAG status framework, and the review discipline that keeps your credibility intact.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '3.2 Stakeholder Reports and Status Updates with AI',
      'description', 'Status reporting is both essential and time-consuming — and where AI delivers the fastest quality improvement. This lesson gives you a complete system: the data inputs to collect, the prompts that produce executive-quality output, the RAG framework, and the review discipline that protects your credibility.',
      'transcript', $t$STAKEHOLDER REPORTS AND STATUS UPDATES WITH AI

Status reports are one of the most important PM outputs — and one of the most frequently done badly. Too long and no one reads them. Too short and they do not answer the questions stakeholders actually have. Inconsistent in format and stakeholders lose confidence. Delayed and they create anxiety. Optimistic and they destroy trust when reality surfaces.

AI changes the economics of high-quality status reporting. What previously took 45–90 minutes of weekly writing overhead can now take 10–15 minutes of review and editing. More importantly, it removes the cognitive burden of staring at a blank page and translating raw project data into executive communication.

THE RAG STATUS FRAMEWORK

Every status report should lead with a RAG (Red/Amber/Green) status. This is not optional — it is the most important piece of information in the report, and burying it makes stakeholders anxious.

Green: On track. No intervention required.
Amber: At risk. Specific risks are identified and being managed. Stakeholder awareness is needed.
Red: Off track. Intervention required. Here is what intervention looks like and who needs to decide.

The critical discipline: Do not use Amber when you mean Red. Early and honest status reporting is a career-building move, not a career risk. Stakeholders who are surprised by a Red they should have seen as Amber months earlier lose trust in the PM. Stakeholders who see Amber early, see a mitigation plan, and then see Green when the risk is resolved gain confidence in the PM.

ASSEMBLING YOUR STATUS REPORT DATA INPUTS

Before writing a single word of the report (or prompting AI), gather:
1. Sprint/project health data: completed velocity, remaining scope, schedule variance
2. This week's key decisions: what was decided and by whom
3. This week's completions: specifically, what value was delivered
4. Current blockers and risks: what is in the way and what is being done about it
5. Next week's plan: what the team commits to delivering next week
6. RAG status and justification: your honest assessment

THE EXECUTIVE STATUS PROMPT

"Here is this week's project data: [paste data from above]. Draft a concise executive status update. Format: 1) RAG status and one-sentence justification, 2) Key achievements this week (bullet points, maximum 3), 3) Risks and blockers (bullet points with mitigation for each), 4) Next week's plan (bullet points, maximum 3), 5) What I need from you (specific asks if any). Tone: direct, confident, honest. Maximum 200 words."

What AI does well in this task: Structure, consistent tone, and translating numerical data into plain language. What to review: Accuracy of the RAG justification (AI may not have the full organisational context to calibrate this), specificity of commitments (AI sometimes makes them too vague), and anything that requires stakeholder-specific framing.

TAILORING REPORTS FOR DIFFERENT AUDIENCES

The same project data needs different framing for different audiences.

Sponsor / executive stakeholder:
- Lead with strategic impact: what value is being created?
- Minimise technical detail
- Focus on decisions they need to make
- One page or less

Project team and functional managers:
- More detail on specific deliverables and timelines
- Technical context appropriate
- Clear on task ownership and dependencies
- Action items explicitly named

External clients or partners:
- Milestone-focused: what has been delivered, what is coming next
- Formal tone and polished language
- No internal concerns or risks without a proposed resolution
- Contractual commitments explicitly acknowledged

Use AI to produce multiple versions from the same data: "Using this project data and executive summary, produce a version tailored for the external client. Tone should be confident and professional. Do not reference internal team issues — only deliverables and milestone status."

ESTABLISHING A STAKEHOLDER REPORTING CADENCE

Inconsistency in reporting frequency damages stakeholder confidence as much as inconsistency in content. Build an automated reporting cadence:

Weekly: AI-drafted status update (review and send every Friday)
Sprint end: AI-drafted sprint summary (review and send within 24 hours of sprint review)
Monthly: AI-drafted executive summary with trend analysis
Milestone: AI-drafted milestone summary at each major completion

Use calendar blocks and automation triggers to protect this cadence. When stakeholders receive consistent, high-quality updates at predictable intervals, they stop asking ad hoc questions — because they already know the answer is coming.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- 3.3 Sprint Review and Demo Preparation with AI
  UPDATE public.videos SET
    description = 'The sprint review is your team''s most visible moment — a chance to demonstrate value, build stakeholder confidence, and gather feedback that shapes the next sprint. This lesson shows you how to use AI to prepare a sprint review that is compelling, focused, and stakeholder-appropriate: from demo script generation to slide creation to facilitating feedback capture.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '3.3 Sprint Review and Demo Preparation with AI',
      'description', 'The sprint review is your team''s most visible moment. This lesson shows how to use AI to prepare a compelling, stakeholder-appropriate review: demo script generation, slide creation, and AI-facilitated feedback capture that shapes the next sprint.',
      'transcript', $t$SPRINT REVIEW AND DEMO PREPARATION WITH AI

The sprint review is the moment where the development team's work becomes visible to the people who matter most. Done well, it builds stakeholder confidence, generates actionable feedback, and demonstrates the team's capability and progress. Done poorly, it wastes the room's time, invites micromanagement, and leaves stakeholders more anxious than before they attended.

Most sprint review problems are preparation problems. The demo was not practiced. The story behind the work was not told clearly. The questions were not anticipated. AI does not change the quality of what was built — but it changes the quality of how it is presented dramatically.

THE SPRINT REVIEW STRUCTURE

A well-structured sprint review for a two-week sprint runs 60–90 minutes:

Part 1 — Sprint context (10 minutes): What was the sprint goal? What did we commit to? What happened? This is the story frame.

Part 2 — Product demo (30–45 minutes): Live demonstration of completed work. Each item shown against its acceptance criteria. Stakeholder questions welcomed.

Part 3 — Metrics and health (10 minutes): Velocity, cumulative flow, burn-up. Trend context.

Part 4 — Feedback and next sprint preview (15 minutes): What do stakeholders need that is not in the backlog? What did they see that changes priorities? Quick preview of next sprint's planned focus.

AI-ASSISTED DEMO SCRIPT GENERATION

The most impactful single use of AI in sprint review prep is generating a demo script that tells a story, not just a feature list.

Prompt:
"Here are the stories we completed this sprint: [paste list with titles and descriptions]. Our stakeholders are [describe the audience: e.g., 'the VP of Operations and her team who care about reducing manual processing time']. Write a sprint review demo script that: 1) Opens with the sprint goal and reminds the audience why this sprint mattered, 2) Demos each completed feature with a business narrative (not a technical walkthrough), 3) For each feature, explicitly names the acceptance criteria it meets, 4) Closes with what the team is proud of and what is coming next. Approximate script length: 8–10 minutes of speaking."

What makes this valuable: The AI consistently produces scripts that frame features as outcomes rather than outputs. "We built a new dashboard filter" becomes "Ops managers can now find the invoices they need in under 30 seconds instead of manually scrolling through 200 rows." The same feature, dramatically better framing.

SLIDE DECK GENERATION

For stakeholders who prefer a slide presentation alongside the demo:

"Based on the sprint review script above, create a slide outline with: one title slide, one sprint goal and context slide, one slide per major demo area (grouped by theme, not by story), one metrics slide, and one 'what's next' slide. For each slide, provide: slide title, three to five bullet points, and the key visual or screenshot that should appear on the slide."

You then build the deck from this outline — AI has done the structural thinking, you focus on visual presentation.

ANTICIPATING STAKEHOLDER QUESTIONS

Stakeholder questions are rarely fully answered in the demo — they are formed by things the demo reminds stakeholders of. AI can help you prepare:

"Based on the work we are demonstrating in this sprint review, and knowing that our stakeholders are [describe their concerns and context], generate the top eight questions a stakeholder might ask during the review. For each question, provide a suggested answer."

Distribute this Q&A to demo presenters before the review. There is nothing more confidence-inspiring to a stakeholder than seeing a presenter answer their question without hesitation.

FEEDBACK CAPTURE DURING THE REVIEW

During the review, use your AI meeting intelligence tool (Otter.ai or Fireflies) to capture the feedback conversation in full. After the review:

"Here is the transcript of our sprint review feedback conversation: [paste transcript]. Extract: 1) Feature requests or enhancements mentioned by stakeholders, 2) Concerns or problems stakeholders raised, 3) Questions that were not fully answered and need follow-up, 4) Anything stakeholders said they loved (for the team to hear), 5) Any implied priority signals ('I really wish we could...' or 'The most important thing for us is...'). Format as a list of backlog candidates with source attribution."

This turns the conversation into actionable backlog input within fifteen minutes of the review ending.

THE POST-REVIEW COMMUNICATION

Within 24 hours, send a sprint review summary to all attendees and key stakeholders who could not attend:

"Using the sprint review script, the demo transcript, and the feedback capture above, write a sprint review summary for distribution. Include: what was demonstrated, key feedback received, what is coming next. Tone: celebratory but professional. Maximum 300 words."

This closes the loop with stakeholders, demonstrates PM thoroughness, and creates a paper trail of what was shown and what feedback was received.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- 3.4 AI-Driven Retrospectives: Deeper Insights, Better Actions
  UPDATE public.videos SET
    description = 'Retrospectives are the most powerful continuous improvement mechanism in Agile — and the most frequently done badly. This lesson shows you how to use AI to run retrospectives that produce genuine insight and lasting change: from pre-retro data analysis to facilitation support to action item tracking that actually follows through sprint after sprint.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '3.4 AI-Driven Retrospectives: Deeper Insights, Better Actions',
      'description', 'Retrospectives are the most powerful continuous improvement mechanism in Agile — and the most frequently done badly. This lesson shows how AI produces genuine insight and lasting change: from pre-retro data analysis to facilitation support to action item tracking that follows through.',
      'transcript', $t$AI-DRIVEN RETROSPECTIVES: DEEPER INSIGHTS, BETTER ACTIONS

The retrospective is Agile's most powerful mechanism for continuous improvement. When done well, it surfaces systemic issues, builds team trust, and produces specific actions that make the next sprint measurably better. When done poorly — which is most of the time — it produces a list of vague complaints and aspirations that nobody tracks, that repeat unchanged in the next retrospective, and that erode the team's belief that retrospectives are worth attending.

The retrospective quality problem is primarily a data problem and a facilitation problem. AI addresses both.

PRE-RETRO DATA ANALYSIS

Before the retrospective, gather objective data that gives the team concrete ground to discuss rather than just relying on memory and emotion.

Data to collect:
- Sprint velocity vs commitment: Did we meet the goal? By how much?
- Story completion distribution: Were most stories done in the first week, or was everything rushed in the last two days?
- Bug/defect rate: How many bugs were raised in QA or by stakeholders?
- Meeting time: How many hours were spent in unplanned or extended meetings?
- Blocker duration: How long did blockers sit before being resolved?
- Action items from last retro: How many were completed?

Ask AI to analyse:
"Here is our sprint data from Sprint [N]: [paste all data above]. Analyse this data and identify: 1) What the data tells us about how the sprint actually went (vs how it felt), 2) Any patterns that suggest systemic issues rather than one-time events, 3) Three to four specific questions this data raises that would be worth discussing in retrospective."

This gives the Scrum Master or facilitator data-backed opening observations that ground the conversation in fact.

THE FOUR RETROSPECTIVE FAILURE MODES AI CAN HELP PREVENT

Failure mode 1 — Only the most vocal people contribute: Use anonymous digital tools (Miro, FunRetro, Parabol) for initial input collection. All voices appear equal on a digital board. AI can then synthesise the inputs before the group discusses them.

Failure mode 2 — The same complaints recur every sprint without resolution: AI-generated trend analysis solves this. "Here are the action items from our last six retrospectives: [paste list]. Which themes are recurring? For recurring themes where actions were not completed, what does the pattern suggest about why these are not being resolved?"

Failure mode 3 — Actions are too vague to execute: "Here are the improvement ideas from our retrospective: [paste sticky notes]. For each idea, rewrite it as a SMART action item: Specific, Measurable, Achievable, Relevant, Time-bound. Assign to a named owner and give a due date within the next sprint."

Failure mode 4 — Actions disappear between retrospectives: Use automation. At the start of each sprint, trigger an automatic Slack message listing the previous retrospective's action items with their owners and due dates. At the retrospective, begin by reviewing completion.

RETROSPECTIVE FORMATS AND HOW AI SUPPORTS EACH

Start / Stop / Continue:
AI synthesises: "Here are all team inputs for Start/Stop/Continue: [paste]. Identify the top three themes in each category based on frequency and emphasis."

The 4Ls (Liked / Learned / Lacked / Longed For):
AI synthesises and cross-references: "In 'Lacked' and 'Longed For', are there themes that suggest training gaps? Process gaps? Tool gaps? Relationship issues?"

Sailboat retrospective (Wind / Anchors / Rocks / Destination):
AI generates: "Based on our sprint data, what are likely Anchor themes (things slowing us down) that we should explore in the retrospective?"

Five Whys for root cause:
"This is the problem we identified in retrospective: [describe]. Walk me through a five-whys analysis to identify the root cause. After each 'why', pause and ask if there are multiple possible answers."

THE ACTION TRACKING DISCIPLINE

Retrospective actions have a half-life. Research suggests that without active tracking, 80% of retrospective actions are forgotten within one sprint. The system:

1. At the retrospective: AI generates SMART action items from the discussion
2. In sprint planning: Actions from the retro are added as explicit sprint stories or tasks
3. On the Kanban board: A dedicated "Retro Actions" swim lane keeps them visible
4. At the next retro: Always begin by reviewing the previous retro's actions: completed, not completed, or no longer relevant
5. Monthly: AI generates a retrospective action completion rate report to track team improvement discipline over time

When teams see their own action completion rate going up, it creates a reinforcing loop: retrospectives feel more effective, which increases engagement, which produces better actions, which get completed.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- 3.5 Notion AI and Gamma for PM Documentation
  UPDATE public.videos SET
    description = 'Project documentation is the institutional memory of your team — but it is chronically neglected because creating it is slow and maintaining it is tedious. This lesson shows you how Notion AI and Gamma transform documentation from a chore into an asset: auto-generating project wikis, meeting notes, decision logs, and presentation-ready content that stakeholders actually read.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '3.5 Notion AI and Gamma for PM Documentation',
      'description', 'Project documentation is the institutional memory of your team — but chronically neglected because creating it is slow and maintaining it is tedious. This lesson shows how Notion AI and Gamma transform documentation into an asset: auto-generating project wikis, decision logs, and presentations that stakeholders actually read.',
      'transcript', $t$NOTION AI AND GAMMA FOR PM DOCUMENTATION

Documentation is the institutional memory of a project. When it is complete and current, onboarding is fast, decisions are traceable, knowledge does not leave when people leave, and stakeholders can self-serve rather than interrupting the team. When it is incomplete or out of date — which is the default state in most organisations — it creates the opposite of all these benefits.

The reason documentation is usually incomplete is not that PMs are lazy or do not value it. It is that creating good documentation is slow, and updating it continuously is tedious. AI changes the economics of this equation.

NOTION AI: WHAT IT DOES WELL FOR PMS

Notion AI is embedded directly in the Notion workspace, available from any page or block. The most useful PM applications:

1 — Meeting Notes Auto-Generation
Paste the raw transcript from your meeting intelligence tool and ask Notion AI: "Convert these meeting notes into a structured Notion page with sections for: Context, Decisions Made, Action Items, Open Questions, and Next Steps."

You get a polished, consistently formatted meeting notes page in under 60 seconds.

2 — Project Wiki Population
When starting a new project, create a blank wiki page and prompt: "Based on this project brief [paste brief], create a project wiki structure with the following pages: Project Overview, Team and Roles, Timeline and Milestones, Decision Log, Risk Register, Meeting Notes Index, Stakeholder Map. Draft the first content for the Project Overview page."

This gives you a complete wiki structure in minutes. The team can then contribute to individual sections rather than starting from nothing.

3 — Document Summarisation
For long specification documents, vendor proposals, or research reports: highlight the document in Notion and ask AI to "Summarise this document in three paragraphs, then create a bulleted list of the five most important points for a project manager."

4 — Decision Log Maintenance
Create a Decision Log page with a table. Each time a significant decision is made, paste the meeting notes excerpt and ask: "Extract the decision made, the rationale, the alternatives considered, and who made the decision. Format for our Decision Log table."

Over time this creates an invaluable searchable record of why the project is the way it is.

5 — Risk Register Updates
At the end of each sprint, review your risk register with AI: "Here is our current risk register: [paste]. Based on this sprint's events [paste summary], which risks should be updated? Are there any new risks to add? Have any risks been resolved?"

GAMMA: AI-POWERED PRESENTATIONS

Gamma (gamma.app) is an AI-native presentation and document tool that generates complete, visually polished presentations from text prompts. For PMs, the two most valuable use cases:

1 — Sprint Review Presentations
"Create a presentation for our sprint review. Context: [sprint goal, team, sprint number]. Include: sprint goal slide, key completions with one slide per major feature area, metrics slide (velocity [N], stories completed [N]), feedback and next steps slide. Professional visual style, clean layout."

Gamma produces a complete deck in approximately 60 seconds. It may not match your brand exactly, but the structure and content are immediately useful as a starting point.

2 — Project Kickoff Presentations
"Create a project kickoff presentation for a new project: [project name and one-paragraph description]. Include: project background, goals and success metrics, team introduction, timeline and milestones, risks, and how we will work together. Target audience: cross-functional stakeholders with mixed technical backgrounds."

For PMs who run projects across multiple organisations or client teams, Gamma eliminates the 2–3 hours of slide assembly that would otherwise precede every kickoff.

BUILDING A DOCUMENTATION CULTURE WITH AI

The biggest leverage is not individual documents — it is building a team culture where documentation is automatic rather than an afterthought.

Establish these norms explicitly:
- Every meeting generates a Notion AI summary within 24 hours (owner: PM or Scrum Master)
- Every significant decision is logged in the Decision Log (owner: person who made or facilitated the decision)
- Every sprint ends with an AI-generated sprint summary in the project wiki (owner: PM)
- The risk register is reviewed and updated every sprint (owner: PM)

When these norms are established and enforced by AI-assisted workflows, documentation goes from chronic debt to continuous asset. The investment in setup pays back within two to three sprints.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- 3.6 Lab: Automate Your Entire Communication Workflow
  UPDATE public.videos SET
    description = 'This lab integrates everything from Module 3 into a single, end-to-end automated communication workflow — from meeting capture through to stakeholder distribution and documentation. You will use Zapier or Make to connect your meeting intelligence, AI assistant, Slack, and project management tools into a pipeline that runs with minimal manual intervention.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', '3.6 Lab: Automate Your Entire Communication Workflow',
      'description', 'This lab integrates everything from Module 3 into a single end-to-end automated communication workflow — from meeting capture through to stakeholder distribution and documentation — using Zapier or Make to connect all your tools into a pipeline that runs itself.',
      'transcript', $t$LAB: AUTOMATE YOUR ENTIRE COMMUNICATION WORKFLOW

This lab builds the communication backbone of your AI-augmented PM workflow. When complete, you will have an automated system that captures every meeting, generates structured summaries, distributes them to the right audiences, updates your project wiki, and creates the stakeholder update draft — all without manual intervention.

TOOLS YOU NEED

- Meeting intelligence: Otter.ai or Fireflies (configured from Lesson 3.1)
- AI assistant: ChatGPT or Claude (with API access for automation)
- Automation platform: Zapier (recommended for no-code) or Make (recommended for more complex flows)
- Communication: Slack
- Documentation: Notion
- Backlog: Jira or Linear

ARCHITECTURE OVERVIEW

The workflow has four parallel streams triggered by a completed meeting:

Stream A — Team communication: Meeting summary → Slack channel post
Stream B — Stakeholder communication: Meeting summary → AI status update draft → PM email draft
Stream C — Documentation: Meeting summary → Notion page creation → Wiki update
Stream D — Backlog: Action items from meeting → Jira/Linear draft issues

BUILDING STREAM A: TEAM SLACK NOTIFICATION

Step 1: In Zapier, create a new Zap triggered by "New Recording Completed" in Otter.ai (or Fireflies equivalent).

Step 2: Add an action to post to Slack. Channel: #project-updates (or equivalent). Message format:
"📋 *Meeting Summary: [meeting title] — [date]*\n\n*Key Decisions:* [AI summary decisions]\n\n*Action Items:* [AI summary actions]\n\n📎 Full transcript: [link to Otter/Fireflies]"

Step 3: Test with a live meeting. Review the output for accuracy and adjust the message format.

BUILDING STREAM B: STAKEHOLDER DRAFT

Step 1: Trigger on the same Otter.ai event.

Step 2: Add a ChatGPT action (available natively in Zapier). Prompt: "Here is a meeting summary: [Otter.ai summary]. Draft a concise stakeholder update suitable for email. Identify any RAG status implications. Format: subject line, two paragraph body, bullet list of action items requiring stakeholder awareness. Maximum 150 words."

Step 3: Create a draft email in Gmail (or Outlook) addressed to your stakeholder distribution list, with the AI-generated content as the draft body.

The PM reviews and sends this draft — they do not write it.

BUILDING STREAM C: NOTION DOCUMENTATION

Step 1: Trigger on the same Otter.ai event.

Step 2: Use Zapier's Notion integration. Create a new page in your sprint's meeting notes database. Title: [meeting title] — [date].

Step 3: Add a ChatGPT action to convert the Otter summary into a structured Notion page format with sections for Context, Decisions, Actions, Open Questions.

Step 4: Populate the new Notion page with the structured content.

BUILDING STREAM D: BACKLOG ACTION CREATION

Step 1: Add a filter step: only continue if the meeting summary contains action items (use Zapier's "Filter" step with keyword matching on "action" or "will" or "to-do").

Step 2: Add a ChatGPT action. Prompt: "Extract all action items from this meeting summary: [paste summary]. For each action item, return: title (task description), assignee (person named), due date (if mentioned, otherwise suggest 'before next sprint'). Return as a JSON array."

Step 3: Use Zapier's Jira or Linear integration to create draft issues from each action item in the JSON array.

TESTING YOUR COMPLETE WORKFLOW

Run a test by completing a real meeting with Otter.ai active. Within five minutes of the meeting ending, you should see:
- A Slack message in your project channel with the summary
- A draft email in your inbox ready to review
- A new Notion page in your meeting notes database
- Draft Jira/Linear issues for each action item

If all four streams fire, congratulations — your communication workflow is now automated.

WEEK-ONE RESULTS TO EXPECT

Most PMs who complete this lab report:
- 3–5 hours saved in the first week
- Significantly faster stakeholder communication (same-day vs next-day)
- Better action item completion rates (because they are visible in the backlog immediately)
- Team appreciation for the consistent, timely meeting summaries

Fine-tune for the next two weeks based on what the team finds most useful. By week three, this workflow should feel invisible — it just runs, and the communication quality is consistently high.

Congratulations on completing Module 3. You now have the communication infrastructure of a high-performing AI-augmented PM.
$t$
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- ── VERIFY ──────────────────────────────────────────────────────────────
-- Run this after applying. Expect filled=7 for M1, filled=7 for M2, filled=6 for M3.
SELECT c.order_index AS module, c.title,
  COUNT(v.id) AS lessons,
  COUNT(v.id) FILTER (WHERE v.translations->'en'->>'transcript' IS NOT NULL
    AND v.translations->'en'->>'transcript' <> '') AS filled
FROM public.chapters c
JOIN public.videos v ON v.chapter_id = c.id
WHERE c.course_id = (
  SELECT id FROM public.courses WHERE title = 'AI Mastery for Scrum Masters & Project Managers'
)
AND c.order_index IN (0, 1, 2)
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
