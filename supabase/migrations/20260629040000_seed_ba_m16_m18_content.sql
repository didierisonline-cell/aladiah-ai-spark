-- =============================================================================
-- Seed BA lesson content — Modules 16, 17, 18
-- AI Business Analyst & Product Discovery Specialist (ba-v1)
-- Apply AFTER 20260629030000_seed_ba_m16_m18_structure.sql
-- =============================================================================

DO $$
DECLARE
  v_ba_id UUID;
  v_ch    UUID;
BEGIN

  SELECT id INTO v_ba_id FROM public.courses
  WHERE title = 'AI Business Analyst & Product Discovery Specialist'
    AND curriculum_version = 'ba-v1';

  IF v_ba_id IS NULL THEN
    RAISE EXCEPTION 'BA course not found';
  END IF;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 16 — Agile BA & Product Ownership (order_index 16)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id AND order_index = 16;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M16 chapter not found'; END IF;

  -- Lesson 1: Agile Fundamentals for Business Analysts
  UPDATE public.videos SET
    description = 'Agile does not eliminate the need for business analysis — it changes when, how, and with whom analysis happens. BAs who understand this shift thrive in Agile teams. Those who try to apply waterfall analysis to Agile projects become bottlenecks. This lesson establishes the Agile BA operating model.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Agile Fundamentals for Business Analysts',
      'description', 'How Agile changes the BA role — from requirements document author to continuous collaborator. The four Agile values, twelve principles, and their implications for BA practice.',
      'transcript', 'AGILE FUNDAMENTALS FOR BUSINESS ANALYSTS

THE SHIFT FROM WATERFALL TO AGILE BA

In a waterfall project, a BA gathers all requirements upfront, produces a Business Requirements Document, gets sign-off, and hands it to the development team. The BA''s value is front-loaded. Once the BRD is approved, the BA''s role shrinks.

In Agile, requirements emerge continuously. There is no phase where all requirements are gathered and frozen. The BA who tries to produce a complete BRD before the first sprint has misunderstood Agile — and will slow the team down waiting for approvals that add no value.

THE FOUR AGILE VALUES — A BA READING

The Agile Manifesto states four values. Read them through the BA lens:

1. Individuals and interactions over processes and tools.
For BAs: Your relationships with developers, testers, and product owners matter more than your documentation templates. A conversation that clarifies a requirement in 5 minutes is worth more than a 20-page spec.

2. Working software over comprehensive documentation.
For BAs: Specification is not the deliverable — working software that solves a real problem is. Document enough to enable understanding, not enough to feel comprehensive.

3. Customer collaboration over contract negotiation.
For BAs: Stakeholders are partners in an ongoing conversation, not clients who sign off on fixed requirements. Build relationships that allow requirements to evolve.

4. Responding to change over following a plan.
For BAs: Requirements will change. The BA who resists change because it invalidates their documentation has confused the map for the territory.

THE AGILE BA OPERATING MODEL

In an Agile team, the BA operates across three timeframes simultaneously:

SPRINT -1 (Refinement): Working with the product owner to elaborate upcoming stories — acceptance criteria, edge cases, dependencies, data requirements. Making sure stories meet the Definition of Ready before they enter a sprint.

CURRENT SPRINT: Answering developer questions as they build. Collaborating with testers to validate acceptance criteria. Attending daily stand-up to stay connected to emerging issues.

SPRINT +1 (Discovery): Conducting lightweight discovery for future work — user interviews, data analysis, process mapping. Feeding insights back to the product owner.

The BA who only works on current sprint items is reactive. The BA who works across all three timeframes is a force multiplier.

THE BA DELIVERABLES IN AGILE

Agile does not mean no deliverables. It means right-sized deliverables:
- User stories instead of BRDs
- Acceptance criteria instead of test cases
- Lightweight process maps instead of BPMN diagrams
- Conversation-ready wireframes instead of pixel-perfect specs
- Decision logs instead of change request forms

DELIVERABLE: Agile BA Operating Charter
Document your team agreements: how you will participate in ceremonies, how you will handle requirement changes, how you will communicate with stakeholders, and what your Definition of Ready looks like for user stories.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: User Story Mastery
  UPDATE public.videos SET
    description = 'The user story is the fundamental unit of Agile requirements. Writing a good user story is harder than it looks — most teams write feature descriptions disguised as user stories and wonder why their sprints produce working software that nobody wanted.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'User Story Mastery — Writing Stories That Ship',
      'description', 'The Three Cs, INVEST criteria, acceptance criteria patterns, story splitting techniques, and the most common user story anti-patterns.',
      'transcript', 'USER STORY MASTERY

THE USER STORY FORMAT

"As a [user type], I want [capability], so that [business value]."

Every part matters:
- As a [user type]: Who specifically? Not "user" — Customer Service Rep, First-Time Buyer, Finance Manager. If you can''t name the user type specifically, you don''t understand the requirement well enough.
- I want [capability]: One clear capability. Not "I want a reporting module" — that''s an epic, not a story.
- So that [value]: The business reason. If you cannot complete this clause, the story may not be worth building.

THE THREE Cs: CARD, CONVERSATION, CONFIRMATION

Card: The user story is a placeholder for a conversation, not a complete specification. The text on the card is a reminder of what the conversation is about.

Conversation: The real requirement lives in the conversation between BA, developer, and stakeholder. The story triggers the conversation when it enters the sprint.

Confirmation: Acceptance criteria are the written output of the conversation. They define when the story is done.

THE INVEST CRITERIA

A well-formed user story is:
Independent — can be developed and deployed without dependency on another story
Negotiable — the details are TBD until the conversation happens; the card is not a contract
Valuable — delivers value on its own; not a technical task disguised as a story
Estimable — the team can estimate it; if they can''t, it needs more breakdown or elaboration
Small — fits in a single sprint; if not, split it
Testable — acceptance criteria exist; if you cannot write an acceptance criterion, the story is not ready

WRITING ACCEPTANCE CRITERIA

Pattern 1 — Given/When/Then (BDD style):
"Given [precondition], When [action], Then [expected result]."

Example: "Given a customer has items in their cart and a valid discount code, When they apply the code at checkout, Then the discount is applied to the subtotal and the updated total is displayed."

Pattern 2 — Checklist style:
- The user can filter results by date range
- Results update without page reload
- Filter state persists across sessions

STORY SPLITTING TECHNIQUES

Large stories (epics) must be split before they enter a sprint. Common splitting patterns:

By workflow step: "Place an order" → "Add item to cart" + "Enter payment details" + "Confirm order"
By data type: "Manage products" → "Manage physical products" + "Manage digital products"
By user type: "Search for results" → "Guest search" + "Authenticated search with history"
By happy path / exception: Build the happy path first, then the error handling

ANTI-PATTERNS TO AVOID

Technical stories disguised as user stories: "As a developer, I want to refactor the database schema so that queries run faster." This is a technical task. Don''t force it into user story format.

Solution-first stories: "As a user, I want a dropdown menu." Why a dropdown? What decision are they making? Start with the need.

Stories too large to estimate: If the team can''t estimate it in planning, it''s not ready. Return to refinement.

DELIVERABLE: User Story Library
Write 10 user stories for your capstone project using the format and INVEST criteria above. Include acceptance criteria in Given/When/Then format for each.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Backlog Refinement & Sprint Ceremonies
  UPDATE public.videos SET
    description = 'The BA''s role in Agile ceremonies is active, not passive. Most BAs attend ceremonies without understanding how to add value in each one. This lesson makes you the most effective person in the room at refinement, planning, review, and retrospective.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Backlog Refinement & Sprint Ceremonies for BAs',
      'description', 'Facilitation techniques for refinement sessions, BA contributions to sprint planning, sprint review, and retrospective. The Definition of Ready and Definition of Done from a BA perspective.',
      'transcript', 'BACKLOG REFINEMENT & SPRINT CEREMONIES FOR BAs

BACKLOG REFINEMENT — THE BA''S HOME CEREMONY

Refinement is where the BA adds the most value in Agile. The purpose: make upcoming stories ready for sprint planning.

BA responsibilities in refinement:
- Present stories with enough context for the team to understand and estimate
- Facilitate the conversation about acceptance criteria
- Surface dependencies, risks, and open questions
- Split stories that are too large
- Ensure stories meet the Definition of Ready before closing the discussion

The Definition of Ready (DoR) is the BA''s quality gate. A story is ready when:
- The user type, capability, and value are clear
- Acceptance criteria are written and agreed
- Dependencies are identified
- The team can estimate it (relative to other stories)
- UI mockups or data samples are available if needed

If a story doesn''t meet DoR, it does not go to sprint planning. The BA''s job is to ensure the backlog above the waterline is always DoR-ready.

SPRINT PLANNING — BA SUPPORT ROLE

The BA does not run sprint planning — that is the Scrum Master''s role. But the BA is essential:
- Answering questions about stories as the team commits to them
- Clarifying acceptance criteria as the team breaks stories into tasks
- Flagging stories that seem underestimated based on hidden complexity

SPRINT REVIEW — VALIDATION, NOT DEMONSTRATION

The sprint review is where the team demonstrates working software to stakeholders. Many teams treat it as a demo. The BA knows it is a validation event.

BA responsibilities in sprint review:
- Validate that what was built meets the original acceptance criteria
- Facilitate stakeholder feedback — not "do you like it?" but "does this solve the problem we discussed?"
- Capture new requirements that surface from stakeholder reactions
- Document acceptance or rejection of stories

The sprint review is the best requirements elicitation session in Agile. Stakeholders react to working software in ways they never react to written requirements.

SPRINT RETROSPECTIVE — THE BA''s VOICE

The retrospective asks: how did we work, and how can we improve? The BA''s perspective is often the most valuable because BAs work across the team boundary.

BA observations to bring to retrospectives:
- Requirements clarity issues: "We spent 3 hours in mid-sprint clarification on the reporting story. Could we add a data sample requirement to our DoR?"
- Stakeholder availability: "The payment gateway integration story was blocked for 2 days waiting for a decision. Can we establish a decision turnaround SLA?"
- Scope creep patterns: "Three stories grew in scope during the sprint. Should we add a scope change protocol?"

DAILY STAND-UP — STAY CONNECTED, NOT PRESENT

The BA does not need to attend every daily stand-up. But staying connected prevents mid-sprint surprises. Options:
- Attend 2x per week
- Read the stand-up updates async (if the team uses a digital format)
- Be available for clarification questions during the sprint

DELIVERABLE: Sprint Ceremony Guide
Document your team''s ceremony cadence, your BA role in each ceremony, and your Definition of Ready checklist.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Product Ownership & Release Planning
  UPDATE public.videos SET
    description = 'In many organizations, the BA and Product Owner roles overlap, merge, or are confused. This lesson clarifies the relationship and teaches the BA how to support — or operate as — a Product Owner.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Product Ownership & Release Planning',
      'description', 'Product Owner responsibilities, backlog prioritization frameworks (MoSCoW, WSJF, Kano), release planning, roadmap communication, and the BA/PO relationship.',
      'transcript', 'PRODUCT OWNERSHIP & RELEASE PLANNING

THE PRODUCT OWNER ROLE

The Product Owner is accountable for the product backlog. They decide what gets built, in what order, and what is good enough to ship. They are the single voice of the customer inside the Scrum team.

THE BA/PO RELATIONSHIP

In many organizations:
- BA and PO are the same person (small teams, startups)
- BA supports the PO (large teams, complex domains)
- BA feeds requirements into the PO''s backlog (enterprise contexts)

Regardless of structure, the BA adds value by ensuring the PO has:
- Well-elaborated stories ready for refinement
- Clear acceptance criteria
- Data and user research to support prioritization decisions
- Stakeholder analysis and buy-in for roadmap decisions

BACKLOG PRIORITIZATION FRAMEWORKS

MoSCoW: Must Have / Should Have / Could Have / Won''t Have
Use for: Release scope decisions. Fast. Subjective. Prone to everything becoming "Must Have."

WSJF (Weighted Shortest Job First): Cost of Delay / Job Size
Use for: SAFe contexts. Prioritizes items that deliver the most value earliest, accounting for effort.
WSJF = (Business Value + Time Criticality + Risk Reduction) / Job Size

Kano Model: Basic needs / Performance needs / Excitement features
Use for: Feature strategy. Identifies what will delight customers vs. what is merely expected.

RELEASE PLANNING

A release plan answers: what will we ship, when, and what value will it deliver?

Release planning session structure:
1. Define the release goal — what business outcome does this release achieve?
2. Select stories from the backlog that contribute to the goal
3. Estimate team velocity (stories per sprint)
4. Calculate number of sprints required
5. Identify dependencies and risks
6. Communicate the plan to stakeholders as a roadmap, not a commitment

ROADMAP COMMUNICATION

Roadmaps are not project plans. They are strategic communication tools.

The Now-Next-Later roadmap:
- Now: What the team is building this sprint/quarter (high confidence, specific)
- Next: What comes after (medium confidence, directional)
- Later: What is planned beyond that (low confidence, subject to change)

Communicate roadmaps with confidence levels. Stakeholders who treat a "Later" item as a commitment create unnecessary conflict.

DELIVERABLE: Release Roadmap
Build a Now-Next-Later roadmap for your capstone project with prioritized stories, velocity assumptions, and stakeholder communication plan.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Scaling Agile
  UPDATE public.videos SET
    description = 'Most BAs work in single Agile teams. Senior BAs operate across multiple teams, programs, and the enterprise. This lesson prepares you for scaled Agile contexts — SAFe, LeSS, and enterprise Agile transformation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scaling Agile: SAFe BA, LeSS & Enterprise Agile',
      'description', 'The BA role in SAFe (Agile Release Train, PI Planning), LeSS (Large-Scale Scrum), and enterprise Agile transformation. Produces a Scaled Agile BA Playbook.',
      'transcript', 'SCALING AGILE: SAFe, LeSS & ENTERPRISE AGILE

WHY SCALING MATTERS FOR BAs

Most BA education focuses on single-team Agile. But large organizations run programs involving 5, 10, or 50 teams simultaneously. The BA who only knows single-team Agile has a ceiling in enterprise environments.

SAFE — SCALED AGILE FRAMEWORK

SAFe organizes large programs into Agile Release Trains (ARTs) — groups of 50-125 people delivering a product increment every 10 weeks (a Program Increment, or PI).

The BA in SAFe operates at multiple levels:

Team Level: Standard Agile BA — user stories, acceptance criteria, refinement.

Program Level (ART BA): Features instead of stories. Feature acceptance criteria. Cross-team dependency mapping. Attending the ART sync (equivalent of a team stand-up for the whole ART).

PI Planning: The centerpiece of SAFe. A 2-day event where all teams plan the next 10 weeks together. BA responsibilities:
- Preparing features with acceptance criteria before PI Planning
- Facilitating cross-team dependency conversations
- Capturing risks and impediments
- Helping teams break features into team-level stories

LESS — LARGE-SCALE SCRUM

LeSS applies Scrum principles to 2-8 teams working on one product. Unlike SAFe, LeSS minimizes additional roles and processes.

In LeSS, the BA''s role is more fluid:
- Work directly with the single Product Owner who owns the entire product backlog
- Support feature elaboration across multiple teams
- Facilitate cross-team coordination without a formal program layer

ENTERPRISE AGILE BA

At enterprise scale, the BA''s role shifts from execution to enablement:
- Define the standards for how requirements are written across teams
- Maintain the capability model that links team work to business strategy
- Facilitate cross-program dependency management
- Coach team-level BAs on standards and practices

DELIVERABLE: Scaled Agile BA Playbook
Document how your BA role would operate in a SAFe context: what you produce at team vs. program level, how you participate in PI Planning, and how you manage cross-team dependencies.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 17 — Enterprise Architecture & Digital Transformation (order_index 17)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id AND order_index = 17;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M17 chapter not found'; END IF;

  -- Lesson 1: Enterprise Architecture Fundamentals
  UPDATE public.videos SET
    description = 'Enterprise Architecture is the discipline that connects business strategy to technology execution. BAs who understand EA operate at a different altitude than those who only work at project level. This lesson establishes the EA foundations every senior BA needs.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Enterprise Architecture Fundamentals for BAs',
      'description', 'EA domains, architecture layers, the BA''s role in enterprise planning, and how project-level BA work connects to enterprise architecture.',
      'transcript', 'ENTERPRISE ARCHITECTURE FUNDAMENTALS FOR BAs

WHAT IS ENTERPRISE ARCHITECTURE?

Enterprise Architecture is the practice of organizing an organization''s people, processes, information, and technology to execute its strategy. EA answers the question: how does this organization work, and how should it change?

The four EA domains (TOGAF):

Business Architecture: How the business operates — capabilities, processes, organizational structure, value streams. This is closest to traditional BA work.

Data Architecture: What data exists, how it flows, who owns it, and how it is governed. Increasingly critical as organizations build AI systems.

Application Architecture: What software systems exist, what they do, and how they integrate. The BA''s "as-is" map for system replacement projects.

Technology Architecture: The infrastructure — cloud platforms, networks, security. Less relevant for most BAs unless they work in technical domains.

WHERE BAs FIT IN EA

Most BA work happens at the Business Architecture layer. But senior BAs need to read all four layers to understand how project requirements ripple through the enterprise.

Example: A BA is asked to define requirements for a new customer portal. Without EA context, they define portal requirements in isolation. With EA context, they understand: the portal must integrate with three existing systems (Application Architecture), needs access to customer data governed under GDPR (Data Architecture), and must run on the cloud platform the organization standardized on (Technology Architecture).

THE ARCHITECTURE REPOSITORY

Most large organizations maintain an architecture repository — a catalog of current-state capabilities, systems, integrations, and data flows. The BA who learns to navigate this repository dramatically accelerates project analysis work.

Ask your enterprise architect: "Can you show me the capabilities and systems relevant to this project?" This single conversation can replace weeks of as-is analysis.

DELIVERABLE: EA Orientation Map
Map the four EA domains for your current or most recent project. Identify where you had full understanding, partial understanding, and blind spots.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Business Capability Mapping
  UPDATE public.videos SET
    description = 'Business capability mapping is the most powerful tool in the enterprise BA''s toolkit. It lets you have a conversation with the CEO that a process-focused BA cannot have — because it connects what the business does to what it needs to change.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Business Capability Mapping & Gap Analysis',
      'description', 'Building and reading capability maps, heat maps, gap analysis, capability investment strategies, and how capability maps drive transformation priorities.',
      'transcript', 'BUSINESS CAPABILITY MAPPING & GAP ANALYSIS

WHAT IS A BUSINESS CAPABILITY?

A business capability is what an organization does, expressed as a noun phrase, independent of how it does it.

Examples:
- Customer Acquisition (not "run Google ads" or "cold call")
- Order Fulfillment (not "use SAP" or "pick and pack")
- Risk Assessment (not "use Excel models" or "run the Basel II process")

Capabilities are stable over time even as processes and technology change. "Customer Acquisition" existed before the internet and will exist after AI replaces sales teams. This stability makes capability maps enduring strategic tools.

BUILDING A CAPABILITY MAP

Level 1 capabilities: the 8-12 top-level things the organization does.
Example for a retail bank: Customer Acquisition / Account Management / Lending / Payments / Investment Management / Compliance & Risk / Finance & Reporting / Technology & Infrastructure

Level 2 capabilities: decompose each Level 1 into 4-8 sub-capabilities.
Example — Lending: Loan Origination / Credit Assessment / Loan Servicing / Collections / Regulatory Reporting

Level 3 capabilities: operational detail (usually only needed for specific transformation analysis).

CAPABILITY HEAT MAPS

A heat map overlays performance data onto the capability map:
- Red: Capability is performing poorly or is a strategic gap
- Yellow: Capability is adequate but has known issues
- Green: Capability is performing well

Heat maps answer: "Where should we invest?" They make transformation priorities visible to executives who don''t read process maps.

Data sources for heat mapping:
- Customer satisfaction data mapped to touchpoint capabilities
- Operational cost data per capability
- Defect / incident data per capability
- Competitive benchmarking

CAPABILITY GAP ANALYSIS

Gap analysis compares current-state capability performance to the target performance required by the strategy.

Process:
1. Identify the strategic objective (e.g., "Reduce loan origination time from 5 days to 1 day")
2. Map the objective to the capability (Loan Origination)
3. Assess current-state performance (5 days, manual, 12% error rate)
4. Define target-state performance (1 day, automated, <1% error rate)
5. Identify the gap and its root causes
6. Define the initiatives required to close the gap

DELIVERABLE: Business Capability Heat Map
Build a Level 1-2 capability map for your capstone organization and apply a heat map based on available performance data. Identify the top 3 capability gaps and their business impact.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Digital Transformation Roadmaps
  UPDATE public.videos SET
    description = 'Digital transformation projects have a 70% failure rate. BAs who understand why transformation fails — and how to build a roadmap that accounts for those failure modes — are the rarest and most valuable professionals in any large organization.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Digital Transformation Roadmaps & Business Cases',
      'description', 'Transformation roadmap structure, sequencing logic, dependency management, business case development, and the most common failure modes in digital transformation.',
      'transcript', 'DIGITAL TRANSFORMATION ROADMAPS & BUSINESS CASES

WHY TRANSFORMATION FAILS

McKinsey research: 70% of digital transformations fail to meet their objectives. The most common causes:
1. Lack of clear vision — teams execute without knowing what success looks like
2. Underestimating change management — technology changes, people don''t
3. Poor sequencing — teams try to transform everything simultaneously
4. No measurement — nobody tracks whether the transformation is delivering value
5. Insufficient sponsorship — executive attention moves to the next initiative

The BA who understands these failure modes builds roadmaps that account for them.

THE TRANSFORMATION ROADMAP STRUCTURE

A transformation roadmap answers: what will we change, in what order, delivering what value, and over what timeframe?

Components:
- Vision: the future-state description (what does "transformed" look like in 3 years?)
- Current state assessment: capability gaps, technology debt, organizational readiness
- Initiatives: the projects and programs that close the gaps
- Sequencing: the order of initiatives, based on dependencies, value, and risk
- Milestones: measurable checkpoints that demonstrate progress
- Value realization: how each initiative delivers measurable business value

SEQUENCING LOGIC

Transformation initiatives cannot all run simultaneously. Sequencing decisions are among the highest-value BA contributions:

Dependency sequencing: Initiative B requires Initiative A''s output. A must come first.
Value sequencing: Quick wins early build organizational confidence and political support for harder changes.
Risk sequencing: High-risk initiatives later, once organizational change capability is proven.
Platform sequencing: Foundation capabilities (data, integration, identity) before differentiation capabilities.

BUSINESS CASE DEVELOPMENT

Every transformation initiative needs a business case. BA business case components:
- Problem statement: what is the cost of the current state?
- Proposed solution: what change are we making?
- Benefits: quantified, time-phased, attributed to specific capabilities
- Costs: implementation, licensing, change management, training
- Risks: what could go wrong, and how likely / costly?
- Recommendation: go / no-go / alternative options

Benefits quantification is the hardest part. Push to make benefits specific: "Reducing loan origination from 5 days to 1 day will allow us to increase monthly loan volumes by 40% without additional headcount, generating $8M additional annual revenue."

DELIVERABLE: Transformation Roadmap
Build a 12-month transformation roadmap for your capstone project: vision, 3-5 initiatives with sequencing rationale, key milestones, and a one-page business case for the highest-priority initiative.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Technology Portfolio Assessment
  UPDATE public.videos SET
    description = 'Every large organization carries technology debt — systems that cost more to maintain than they deliver in value. The BA who can assess a technology portfolio and recommend rationalization becomes an invaluable strategic partner to the CTO and CFO.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Technology Portfolio Assessment & Rationalization',
      'description', 'Portfolio analysis frameworks (TIME model), application rationalization, total cost of ownership, make/buy/partner decisions, and how BAs support technology strategy.',
      'transcript', 'TECHNOLOGY PORTFOLIO ASSESSMENT & RATIONALIZATION

THE TECHNOLOGY PORTFOLIO PROBLEM

Large organizations typically run 200-2000 distinct applications. Many of these:
- Overlap in capability (multiple CRM systems across divisions)
- Are underused (licensed for 500, used by 50)
- Are technically obsolete (running on unsupported infrastructure)
- Cost more to maintain than the value they deliver

Technology rationalization is the process of systematically reducing portfolio complexity and cost while improving strategic alignment.

THE TIME MODEL

The TIME (Tolerate / Invest / Migrate / Eliminate) model categorizes each application:

TOLERATE: The application has low strategic value and low technical quality, but the cost of change exceeds the cost of continuing. Accept it for now; plan for eventual replacement.

INVEST: High strategic value and good technical quality. These are the systems to build on — extend capabilities, deepen integration.

MIGRATE: Low strategic value or poor technical quality, but migration is feasible and cost-justified. Plan the migration project.

ELIMINATE: No strategic value. Decommission. Recover the license and infrastructure costs.

TOTAL COST OF OWNERSHIP

The visible cost of a system (license fee) is rarely the total cost. True TCO includes:
- License / subscription fees
- Infrastructure (servers, cloud costs)
- Support and maintenance (internal FTE or vendor contract)
- Integration maintenance (keeping integrations working as systems evolve)
- Security and compliance costs
- Business productivity loss (slow, clunky systems reduce employee output)

A BA who can build a TCO model for an application portfolio creates the business case for rationalization programs that save millions.

MAKE / BUY / PARTNER DECISIONS

When a new capability is needed, the BA helps evaluate:
MAKE: Build custom software. Maximum fit, maximum cost, maximum risk.
BUY: Purchase a packaged solution (SaaS, ERP module). Faster, less risk, but requires process adaptation.
PARTNER: Use a third party to deliver the capability. Fastest, but creates dependency.

BA decision framework: strategic differentiation × fit of available solutions × organizational capability to build.

DELIVERABLE: Technology Portfolio Assessment
Apply the TIME model to 5-10 applications in your current or most recent organization. Build a simple TCO comparison and recommend rationalization priorities.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Leading Transformation at Enterprise Scale
  UPDATE public.videos SET
    description = 'The BA who can lead enterprise-scale transformation is the BA who becomes a VP of Business Transformation, Chief Business Architect, or Managing Director at a consulting firm. This lesson prepares you for that altitude.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Leading Transformation at Enterprise Scale',
      'description', 'Enterprise change management, resistance patterns, coalition building, sponsor alignment, measuring transformation progress, and the BA''s evolution into transformation leadership.',
      'transcript', 'LEADING TRANSFORMATION AT ENTERPRISE SCALE

WHY ENTERPRISE TRANSFORMATION IS DIFFERENT

Project-level change affects one team or process. Enterprise transformation affects the organization''s identity — how people think about their work, their relationships, and their future. Resistance at enterprise scale is not obstacle management. It is culture navigation.

THE ENTERPRISE CHANGE MANAGEMENT MODEL

Kotter''s 8-Step Model remains the most practical framework for enterprise transformation:

1. Create urgency: Build the case for why the organization must change now. Without urgency, transformation competes with day-to-day operations — and loses.

2. Build a guiding coalition: Identify the 8-12 people whose support makes transformation possible. Not just the most senior — include informal influencers, frontline champions, and skeptics who can be converted.

3. Form a strategic vision: Define what success looks like in specific, measurable terms. Vague visions ("become more digital") create confusion, not alignment.

4. Enlist a volunteer army: Transformation is not imposed from the top. It is adopted by people who understand why it matters and choose to champion it.

5. Enable action by removing barriers: Identify and remove the structural obstacles — approval processes, siloed budgets, incompatible incentives — that prevent people from changing.

6. Generate short-term wins: Plan for and celebrate early victories. Short-term wins build credibility and sustain momentum.

7. Sustain acceleration: After early wins, transformations stall. Maintain pressure, expand the coalition, and keep connecting daily work to the transformation vision.

8. Institute change: Anchor new behaviors in systems, processes, and culture. When leaders are promoted based on new behaviors, the change is becoming permanent.

SPONSOR ALIGNMENT AT ENTERPRISE SCALE

An active, visible executive sponsor is the single biggest predictor of transformation success. The BA''s role: make it easy for the sponsor to sponsor.

Sponsor enablement toolkit:
- Weekly 1-page status (outcomes, risks, decisions needed)
- Pre-briefing before steering committee meetings
- Escalation pathway for barriers the sponsor can remove
- Suggested communication talking points for town halls

MEASURING TRANSFORMATION PROGRESS

Output metrics: milestones hit, stories delivered, systems deployed. Necessary but insufficient.

Outcome metrics: business value delivered. Revenue generated, cost reduced, customer satisfaction improved, time saved. This is what executives care about.

Adoption metrics: are people using the new capabilities? Technology deployed ≠ capability adopted. Track active users, process compliance, training completion.

DELIVERABLE: Enterprise Change Playbook
Document your transformation change management approach: coalition, urgency case, 90-day win plan, sponsor engagement model, and outcome measurement framework.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 18 — BA Career Acceleration & Portfolio (order_index 18)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id AND order_index = 18;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M18 chapter not found'; END IF;

  -- Lesson 1: Certification Roadmap
  UPDATE public.videos SET
    description = 'CBAP and PMI-PBA are the two most recognized BA certifications globally. The right certification at the right time accelerates your career and increases your earning potential by 15-25%. This lesson gives you a complete certification roadmap.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'CBAP & PMI-PBA Certification Roadmap',
      'description', 'CBAP vs PMI-PBA comparison, experience requirements, application process, study strategy, exam format, and 12-month certification plan.',
      'transcript', 'CBAP & PMI-PBA CERTIFICATION ROADMAP

THE TWO CERTIFICATIONS

CBAP (Certified Business Analysis Professional) — IIBA
- The gold standard for dedicated BAs
- Requires 7,500 hours of BA experience in the last 10 years
- 900 hours minimum in 4 of 6 BABOK Knowledge Areas
- 35 hours of professional development
- 2 references (at least 1 from a senior BA)
- 3.5 hour exam (120 questions)
- Cost: $325 USD (IIBA member) / $450 (non-member)

PMI-PBA (Professional in Business Analysis) — PMI
- Best for BAs working in project-structured organizations
- Requires 4,500 hours (with degree) or 7,500 hours (without)
- 35 hours BA education
- 3 references
- 4 hour exam (200 questions)
- Cost: $405 USD (PMI member) / $555 (non-member)

WHICH CERTIFICATION TO PURSUE?

CBAP if: You are a dedicated BA, your organization uses IIBA frameworks, you work in non-project contexts (ongoing operations, product teams).

PMI-PBA if: You work in project management environments, you hold or plan to pursue PMP, your organization uses PMI methodologies.

Both if: You want maximum market credibility. PMP + PMI-PBA is the strongest credential combination for senior BA/PM hybrid roles.

CBAP STUDY STRATEGY

Step 1: Read BABOK v3 cover to cover (not memorization — understanding).
Step 2: Map your experience to BABOK Knowledge Areas to confirm you meet the 900-hour minimums.
Step 3: Complete the IIBA application (requires documenting hours with supervisor sign-off).
Step 4: Practice questions — minimum 500 scenario-based questions. Focus on application, not recall.
Step 5: Study group — discussing scenarios with peers accelerates understanding.
Step 6: Book the exam when you are consistently scoring 75%+ on practice exams.

CBAP EXAM FORMAT

120 questions, 3.5 hours. Scenario-based — 4 plausible answers, one best answer in the context given. The "right" answer is always the BABOK-aligned best answer for the specific scenario. Memorizing definitions will not pass this exam.

PMI-PBA STUDY STRATEGY

Aligned with PMI''s Examination Content Outline. Focus areas: needs assessment, planning, analysis, traceability, solution evaluation. Study alongside the Business Analysis for Practitioners: A Practice Guide (PMI publication).

12-MONTH CERTIFICATION PLAN

Months 1-3: Experience documentation + BABOK study
Months 4-6: Practice questions (200 minimum) + study group
Month 7: Application submission
Months 8-9: Intensive exam prep (500+ practice questions)
Month 10: Exam
Months 11-12: Exam result + recertification planning

DELIVERABLE: Certification Action Plan
Document which certification you will pursue first, your experience hour count by Knowledge Area, your 12-month study plan, and your exam date target.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: BA Portfolio
  UPDATE public.videos SET
    description = 'Most BAs compete for jobs with a resume that lists tools and responsibilities. The BA who competes with a portfolio of actual work products — anonymized, contextualized, and quantified — wins on every shortlist they appear on.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Building a BA Portfolio That Wins Interviews',
      'description', 'Portfolio structure, artifact selection and anonymization, case study writing, quantifying BA impact, and where to publish and share your portfolio.',
      'transcript', 'BUILDING A BA PORTFOLIO THAT WINS INTERVIEWS

WHY A PORTFOLIO WINS

Hiring managers reading BA resumes see: "Gathered requirements, facilitated workshops, wrote user stories, managed stakeholders." Every BA says this. None of it differentiates.

A portfolio shows: Here is a requirements document I produced. Here are the user stories I wrote. Here is the workshop I designed and facilitated. Here are the outcomes that resulted.

One concrete artifact is worth 10 resume bullet points.

WHAT TO INCLUDE IN YOUR BA PORTFOLIO

Requirements artifacts:
- Business Requirements Document (BRD) excerpt — 2-3 pages showing structure and quality
- User stories with acceptance criteria — 5-10 stories showing INVEST quality
- Use case — one complete use case with main flow and alternatives
- Process map — BPMN or swimlane showing before/after a process improvement

Analysis artifacts:
- Stakeholder analysis (power/interest grid + engagement plan)
- Gap analysis — current state vs future state with business impact
- Business case — problem, solution options, recommendation, ROI

Discovery artifacts:
- Interview guide + key findings
- User journey map
- Workshop design + outcomes

CASE STUDY STRUCTURE

Each portfolio item should be contextualized with a case study:
- Context: industry, organization type (anonymized), project scope
- Your role: what you were responsible for
- Challenge: what made this hard
- Approach: what you did and why
- Artifact: the actual work product
- Outcome: what resulted (quantified where possible)

QUANTIFYING BA IMPACT

BAs often do not track outcomes. Start now. BA impact examples:
- "Requirements rework reduced by 40% after implementing Three Amigos sessions"
- "Stakeholder alignment achieved 3 weeks early, enabling earlier go-live"
- "Identified $2M in duplicate technology costs through portfolio analysis"
- "User story quality improvement reduced sprint mid-course corrections from 8/sprint to 2/sprint"

PORTFOLIO PLATFORMS

Best options for BA portfolios:
- Personal website (Notion, Squarespace, GitHub Pages) — most professional
- LinkedIn Featured section — visible to recruiters
- PDF portfolio — for email / application attachments

ANONYMIZATION RULES
- Replace company names with industry descriptors: "a global retail bank" not "HSBC"
- Replace individual names with roles: "the CFO" not "James Richardson"
- Replace specific financial figures with ranges if confidential
- Get written permission for artifacts from current employers before publishing

DELIVERABLE: Portfolio Framework
Create a portfolio template with 3-5 artifact slots. Select your best existing artifacts, write a case study for each, and publish in at least one format (Notion, PDF, or LinkedIn).'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: LinkedIn & Personal Brand
  UPDATE public.videos SET
    description = 'LinkedIn is the primary recruitment channel for BA roles globally. 87% of recruiters use LinkedIn to find candidates. The BA whose LinkedIn profile is optimized gets found. The BA whose profile is a resume copy-paste does not.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'LinkedIn Optimization & Personal Brand for BAs',
      'description', 'LinkedIn headline formula, summary structure, experience bullet optimization, skills and endorsements strategy, and thought leadership for BA career growth.',
      'transcript', 'LINKEDIN OPTIMIZATION & PERSONAL BRAND FOR BAs

THE LINKEDIN HEADLINE

The headline is the most-read element of your profile. Most BAs write their job title: "Business Analyst at ACME Corp."

A recruiter searching LinkedIn for a BA does not search "Business Analyst at ACME Corp." They search "Business Analyst" + skill keywords. Your headline must contain those keywords.

Headline formula: [Role] | [Specialization] | [Top skills or certifications]

Examples:
"Business Analyst | Agile BA & Product Discovery | CBAP | FinTech & InsurTech"
"Senior BA | Requirements Engineering & Process Transformation | Healthcare & Life Sciences"
"AI Business Analyst | AI Requirements & Decision Intelligence | Digital Transformation"

The ABOUT section

The About section is your pitch. Structure:
Paragraph 1: What you do and for whom (your niche and value proposition)
Paragraph 2: What makes you different (your approach, philosophy, unique experiences)
Paragraph 3: What you are looking for (types of organizations, projects, or challenges you want to work on)
End with: Contact information and call to action ("Open to BA roles in FinTech — message me")

EXPERIENCE OPTIMIZATION

Replace: "Gathered requirements for a new customer portal."
With: "Led requirements definition for a £2M customer portal project: facilitated 12 stakeholder workshops across 4 business units, produced 85-page BRD, and maintained requirements traceability through UAT. Project delivered on time with 95% stakeholder satisfaction score."

Formula: [Action verb] + [what you did] + [who you did it with / for] + [measurable outcome]

SKILLS AND ENDORSEMENTS

LinkedIn''s algorithm surfaces profiles with relevant skills. Add:
- Business Analysis, Requirements Engineering, Stakeholder Management
- BPMN, Process Mapping, Use Cases, User Stories
- Agile, Scrum, SAFe, Product Ownership
- Your domain (FinTech, Healthcare, Digital Transformation)
- Tools you use (JIRA, Confluence, Visio, Miro)

Ask former colleagues to endorse your top 5 skills. Reciprocate.

THOUGHT LEADERSHIP

BAs who post on LinkedIn get found. Content that works:
- "5 things I learned from a difficult stakeholder"
- "How I used AI to cut requirements review time by 60%"
- "The most expensive requirements mistake I ever made"
- "What the Three Amigos ceremony actually means in practice"

Post 1-2x per week. Engage with others'' posts. Build a network of 500+ relevant connections.

DELIVERABLE: LinkedIn Optimization Checklist
Audit your LinkedIn profile against 20 criteria: headline, photo, banner, About, experience bullets, skills, featured section, certifications, recommendations, and posting cadence.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Salary Negotiation & Career Paths
  UPDATE public.videos SET
    description = 'BAs leave significant money on the table by accepting first offers, undervaluing their specializations, and not understanding the market. This lesson gives you the data, scripts, and decision frameworks to maximize your BA compensation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Salary Negotiation & Career Paths',
      'description', 'BA salary benchmarks by role and seniority, negotiation scripts, offer evaluation framework, and career path decisions (in-house vs consulting vs freelance).',
      'transcript', 'SALARY NEGOTIATION & CAREER PATHS

BA SALARY BENCHMARKS (2024-2025)

These are global benchmarks in USD. Adjust for your market (London, Sydney, Singapore command 20-40% premium; Eastern Europe, India 40-60% below).

Junior BA (0-3 years): $55,000 - $80,000
Mid-level BA (3-6 years): $80,000 - $110,000
Senior BA (6-10 years): $110,000 - $150,000
Lead/Principal BA (10+ years): $140,000 - $200,000
BA Director / Head of BA Practice: $180,000 - $280,000

SPECIALIZATION PREMIUMS

Certain specializations command significant salary premiums:
AI/ML BA: +15-25% above standard BA rates
FinTech BA: +10-20%
Healthcare BA (with regulatory expertise): +15-25%
Enterprise Architect / BA hybrid: +20-35%
CBAP certified: +8-15%
Consulting BA (Big 4, Tier 1): +20-40% (with trade-offs in work-life balance)

THE NEGOTIATION SEQUENCE

1. Never give a number first. When asked salary expectations, respond: "I''m open to a competitive offer. Can you share the budgeted range for this role?"

2. If forced to give a number, give the top of your range. You can come down; you cannot go up.

3. When you receive an offer: "Thank you — I''m excited about this role. Can I have 48 hours to review the full package?"

4. Counter with a specific ask: "Based on my research and the value I bring, I was expecting $X. Is there flexibility to meet there?" (Not "I was hoping for more.")

5. If they can''t move on base salary: negotiate total compensation — signing bonus, performance bonus, additional PTO, remote work days, training budget, accelerated review.

CAREER PATH DECISIONS

In-house BA (employed by a single organization):
Pros: Organizational depth, stable income, career progression within one domain, benefits
Cons: Limited to one industry, career trajectory depends on organization''s BA maturity, ceiling is typically Head of BA or enterprise architect

Consulting BA (employed by a consulting firm):
Pros: Exposure to multiple industries, accelerated skill development, premium compensation, brand value of the firm
Cons: Travel, billable hour pressure, client dependency, "always on" culture

Freelance BA (independent contractor):
Pros: Maximum flexibility, often highest day rates, project variety, ownership of your career
Cons: No job security, must market yourself continuously, no benefits, feast/famine cycle

The hybrid path: Build 8-10 years of in-house and consulting experience, then freelance. The network, credentials, and reputation you build make freelance sustainable.

DELIVERABLE: Negotiation Playbook
Research the market rate for your target BA role in your target location. Write your negotiation script for the next offer you receive. Define your walk-away point and your ideal number.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Future-Proofing Your BA Career
  UPDATE public.videos SET
    description = 'The BA role is changing faster than at any point in its history. AI is automating the parts of BA work that were most time-consuming and least differentiating. The BAs who thrive in the next decade are already adapting. This lesson prepares you to be one of them.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The AI-Era BA — Future-Proofing Your Career',
      'description', 'AI tools every BA must master, emerging BA specializations, the skills AI cannot replace, and a 12-month career acceleration plan.',
      'transcript', 'THE AI-ERA BA — FUTURE-PROOFING YOUR CAREER

WHAT AI IS DOING TO BA WORK

AI is automating the low-value parts of BA work faster than most BAs realize:

Already automating: First-draft user stories from product briefs, requirements gap analysis, meeting transcription and requirements extraction, process documentation from screen recordings, test case generation from acceptance criteria.

Automating next 3-5 years: Requirements traceability mapping, stakeholder analysis from communication patterns, as-is process discovery from system logs, impact analysis for requirement changes.

NOT automating (human judgment required): Political judgment in stakeholder conflicts, organizational context that shapes requirements, ethical assessment of AI system requirements, creative problem-solving for novel business problems, relationship building with resistant stakeholders, validating AI outputs against organizational reality.

The BAs who are threatened by AI are those whose value was primarily in producing documents. The BAs who thrive are those whose value is judgment, relationships, and strategic thinking — with AI as their accelerator.

THE AI TOOLKIT FOR BAs

Tools every BA must be proficient with by 2026:

Requirements generation: ChatGPT, Claude, Gemini — for first-draft user stories, BRDs, acceptance criteria
Meeting intelligence: Otter.ai, Fireflies, Grain — for elicitation session transcription and requirements extraction
Process mapping: Lucidchart AI, Miro AI — for generating process diagrams from text descriptions
Prototyping: Figma AI, v0.dev — for generating wireframes from requirements descriptions
Diagram generation: Mermaid + LLMs — for generating BPMN and UML from text

Mastery means: knowing what prompt to write, how to validate the output, and when the AI is wrong.

EMERGING BA SPECIALIZATIONS

AI Product BA: Defines requirements for AI/ML features — training data requirements, accuracy thresholds, fairness criteria, explainability needs. Highest demand, highest compensation.

Data BA: Bridges business and data teams — data requirements, data quality standards, analytics requirements, AI readiness assessment.

AI Governance Analyst: Assesses AI systems for compliance, bias, explainability, and ethical risk. Critical in regulated industries.

Platform BA: Defines requirements for developer platforms, APIs, and internal tooling. Close to product management.

12-MONTH CAREER ACCELERATION PLAN

Month 1-2: AI tool proficiency — become expert in 3 AI tools relevant to your BA work
Month 3-4: Specialization — choose your specialization and start building expertise
Month 5-6: Portfolio — document 3 case studies from your specialization
Month 7-8: Certification — complete CBAP or PMI-PBA application
Month 9-10: Visibility — publish 8 LinkedIn posts, attend 2 BA community events
Month 11-12: Target role — apply for 3 roles that represent a step up in your target specialization

DELIVERABLE: Future-Ready BA Plan
Document your AI tool proficiency roadmap, your chosen specialization, your 12-month career goals, and the 3 specific roles you are targeting.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  RAISE NOTICE 'SUCCESS: M16-M18 content seeded for BA course %', v_ba_id;
END $$;
