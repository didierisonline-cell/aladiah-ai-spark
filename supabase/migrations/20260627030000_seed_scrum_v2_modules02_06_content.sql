-- =============================================================================
-- Seed lesson content (description + EN transcript) for Scrum v2 Modules 2–6
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================

DO $$
DECLARE
  v_course_id UUID := 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';
  v_ch UUID;
BEGIN

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 2 — The Scrum Master Role & Servant Leadership
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 1;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 2 chapter not found'; END IF;

  -- Lesson 1
  UPDATE videos SET
    description = 'The Scrum Master is accountable for the Scrum Team''s effectiveness. This is not a management role — it is a servant-leadership role focused on helping the team understand and enact Scrum theory and practice. The Scrum Master serves the Scrum Team, the Product Owner, and the broader organization in distinct ways.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The Scrum Master accountability',
      'description', 'The Scrum Master is accountable for the Scrum Team''s effectiveness. This is a servant-leadership role focused on helping the team understand and enact Scrum theory and practice.',
      'transcript', 'THE SCRUM MASTER ACCOUNTABILITY

The Scrum Guide defines the Scrum Master as accountable for the Scrum Team''s effectiveness. Every word matters here.

WHAT "ACCOUNTABLE" MEANS
Accountable does not mean "in charge of everyone." It means the Scrum Master owns the outcome of Scrum working well. If Scrum is broken, the Scrum Master owns fixing it.

THREE SERVICE AREAS

Serving the Scrum Team:
- Coaching team members in self-management and cross-functionality
- Helping the team focus on creating high-value Increments that meet the Definition of Done
- Causing the removal of impediments to the team''s progress
- Ensuring all Scrum events take place and are positive, productive, and kept within the timebox

Serving the Product Owner:
- Helping find techniques for effective Product Goal definition and Product Backlog management
- Helping the Scrum Team understand the need for clear and concise Product Backlog items
- Facilitating stakeholder collaboration as requested or needed

Serving the Organization:
- Leading, training, and coaching the organization in its Scrum adoption
- Planning and advising Scrum implementations
- Helping employees and stakeholders understand and enact an empirical approach
- Removing barriers between stakeholders and Scrum Teams

WHAT THE SCRUM MASTER IS NOT
- Not a project manager tracking tasks and deadlines
- Not a team lead assigning work to individuals
- Not a secretary scheduling meetings
- Not a status reporter to management

AI FOR THE SCRUM MASTER ROLE
AI tools help you track impediment patterns, identify when events drift from their purpose, and surface team health signals early. Use AI to amplify your service — not to replace your presence.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%scrum master accountability%' OR order_index = 0);

  -- Lesson 2
  UPDATE videos SET
    description = 'Servant leadership is the defining mindset of a Scrum Master. Rather than directing and controlling, a servant leader puts the needs of the team first — removing obstacles, creating conditions for success, and coaching rather than commanding.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Servant leadership',
      'description', 'Servant leadership is the defining mindset of a Scrum Master — putting the needs of the team first, removing obstacles, and coaching rather than commanding.',
      'transcript', 'SERVANT LEADERSHIP

Robert Greenleaf coined "servant leader" in 1970: the servant leader is servant first. The Scrum Master is the clearest expression of this model in modern product delivery.

THE CORE SHIFT
Traditional leadership asks: "How do I get people to do what I need?"
Servant leadership asks: "What does this team need to be excellent?"

FIVE SERVANT-LEADERSHIP BEHAVIORS FOR SCRUM MASTERS

1. Listening first
Before offering a solution, listen deeply. Ask: "What is the team telling me through their behavior?" Use 1:1s, retros, and daily check-ins as listening channels — not reporting channels.

2. Coaching over advising
When a developer asks "What should I do?", a servant leader answers with a question: "What options have you considered?" This builds capability, not dependency.

3. Removing impediments — not working around them
Servant leaders escalate and resolve systemic issues rather than asking the team to adapt to broken systems. If the build pipeline takes 2 hours, fix the pipeline.

4. Creating safety
Psychological safety — the belief that one can speak up without punishment — is the foundation of high performance. The Scrum Master protects the team''s right to fail safely and learn fast.

5. Protecting the team''s focus
Interruptions, scope changes mid-Sprint, and ad-hoc requests destroy flow. Servant leaders shield the team from these while maintaining transparency with stakeholders.

WHAT SERVANT LEADERSHIP IS NOT
- It is not being a doormat. Servant leaders hold the team accountable to Scrum.
- It is not doing the team''s work. Servant leaders build capability.
- It is not endless consensus. Servant leaders facilitate decisions when teams get stuck.

AI APPLICATION
Use AI to analyze team sentiment from retro notes, flag linguistic patterns suggesting low psychological safety, and generate coaching question sets for recurring team challenges.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%servant leadership%' OR order_index = 1);

  -- Lesson 3
  UPDATE videos SET
    description = 'The Scrum Master and the Project Manager are fundamentally different roles. Understanding this distinction is essential for interviews, organizational conversations, and daily practice. The Scrum Master is not a renamed PM — the two roles have different authority, mindset, and accountability.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scrum Master vs. Project Manager',
      'description', 'The Scrum Master and Project Manager are fundamentally different roles with different authority, mindset, and accountability.',
      'transcript', 'SCRUM MASTER VS. PROJECT MANAGER

This comparison comes up in every hiring conversation and in every organization adopting Scrum. Get it right.

SIDE-BY-SIDE COMPARISON

Project Manager:
- Owns the project plan and schedule
- Assigns tasks to individuals
- Reports status to management
- Manages budget, scope, timeline (triple constraint)
- Authority over the team
- Success = delivered on time and on budget

Scrum Master:
- Owns Scrum''s effectiveness
- Facilitates the team''s self-organization
- Makes impediments visible, not hides them
- No ownership of budget or external deadlines
- Serves the team — no direct authority
- Success = team delivers increasing value each Sprint

THE AUTHORITY DIFFERENCE
Project managers typically have formal authority: they can assign work, escalate performance issues, and control resources. Scrum Masters have influence, not authority. They lead through coaching, facilitation, and modeling Scrum values — not through org-chart power.

THE PLANNING DIFFERENCE
Project managers own the plan. Scrum Masters facilitate planning but the team owns its Sprint plan. The Scrum Master never tells a Developer what to work on or how long something will take.

COMMON CONFUSION IN ORGANIZATIONS
Many companies rename their Project Managers "Scrum Masters" without changing the behaviors expected. This is called "Scrumfall" — Scrum vocabulary on a waterfall structure. Warning signs:
- Scrum Master is asked to provide Gantt charts
- Scrum Master attends management status meetings to report team velocity
- Scrum Master assigns tasks in Jira
- Team asks Scrum Master for permission before making decisions

HOW AI HELPS HERE
AI can audit your Jira workflow to flag when a Scrum Master is being used as a task-assigner, and generate talking points for organizational conversations about role clarity.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%vs. project manager%' OR title ILIKE '%vs project manager%' OR order_index = 2);

  -- Lesson 4
  UPDATE videos SET
    description = 'Self-management is one of the most powerful — and misunderstood — aspects of Scrum. A self-managing team decides internally who does what, when, and how. The Scrum Master''s job is to create the conditions for self-management, then step back.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Building self-management',
      'description', 'Self-management means the team decides internally who does what, when, and how. The Scrum Master creates conditions for self-management, then steps back.',
      'transcript', 'BUILDING SELF-MANAGEMENT

The Scrum Guide says Scrum Teams are self-managing: they choose how best to accomplish their work. This is not optional — it is a core Scrum principle.

WHAT SELF-MANAGEMENT MEANS
Self-managing does not mean no rules. It means the team governs itself within the Scrum framework. The team:
- Selects its own Sprint Backlog items during Sprint Planning
- Decides how to implement each item
- Manages its own daily coordination via the Daily Scrum
- Owns its Definition of Done
- Identifies and addresses its own impediments first

WHAT BLOCKS SELF-MANAGEMENT

External forces that break self-management:
- Managers assigning tasks directly to developers
- Scrum Master making decisions the team should make
- Product Owner dictating implementation approach
- HR or leadership changing team composition frequently
- Developers being pulled to multiple teams simultaneously

BUILDING IT STEP BY STEP

Step 1 — Clarify decision rights: which decisions does the team own? (Sprint content, implementation, team norms). Which go to the PO? (ordering, Product Goal). Which go to the org? (hiring, technology standards).

Step 2 — Resist the urge to answer: when developers ask "what should we do?", redirect with "what do you think?" Practice this until the team stops asking and starts deciding.

Step 3 — Protect decisions after they''re made: if management overrules the team''s Sprint plan, make the violation visible. Do not silently accept it.

Step 4 — Celebrate self-managed outcomes: when the team makes a great decision without you, name it in the retro. Build the identity.

AI APPLICATION
AI can help you identify self-management anti-patterns in standup notes — for example, detecting when developers consistently defer to one person, signaling hidden hierarchy.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%self-management%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 3 — Scrum Team Accountabilities
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 2;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 3 chapter not found'; END IF;

  -- Lesson 1
  UPDATE videos SET
    description = 'The Product Owner is accountable for maximizing the value of the product resulting from the work of the Scrum Team. The PO is not a business analyst, not a requirements writer, and not a proxy for a committee. They own the Product Backlog and the Product Goal.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Product Owner accountability',
      'description', 'The Product Owner is accountable for maximizing the value of the product. They own the Product Backlog and the Product Goal.',
      'transcript', 'PRODUCT OWNER ACCOUNTABILITY

The Product Owner is one of three accountabilities in Scrum. Their primary accountability: maximize the value of the product resulting from the work of the Scrum Team.

WHAT THE PRODUCT OWNER OWNS
- The Product Goal: the long-term objective the team is working toward
- The Product Backlog: the single ordered list of everything needed in the product
- Backlog ordering decisions: what gets built next and why
- Backlog item clarity: ensuring items are understood well enough to be worked on
- Stakeholder communication about product direction

THE PRODUCT OWNER MUST BE ONE PERSON
The Scrum Guide is explicit: the PO is one person, not a committee. Committees cannot make fast, clear ordering decisions. When organizations try "PO by committee," the result is conflicting priorities, delayed decisions, and an unordered backlog.

WHAT MAKES A GREAT PRODUCT OWNER
- Domain expertise to make value decisions quickly
- Availability to the team — present, not distant
- Authority to say no to stakeholders when needed
- Focus: ideally 100% dedicated to one product
- Clear communication of the Product Goal and the "why" behind ordering

COMMON PRODUCT OWNER ANTI-PATTERNS
- Proxy PO: a BA or junior person relaying requests from someone with real authority — the team gets no real decisions
- Absent PO: not available for Sprint Planning, Refinement, or Review
- Backlog-as-feature-list: hundreds of items with no ordering rationale and no Product Goal
- Changing priorities every Sprint without empirical reason

AI FOR THE PRODUCT OWNER ROLE
AI helps POs draft user story acceptance criteria, analyze customer feedback at scale, generate prioritization frameworks, and build release narratives from Sprint data.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%product owner accountability%' OR order_index = 0);

  -- Lesson 2
  UPDATE videos SET
    description = 'Developers are the people in the Scrum Team committed to creating a usable Increment each Sprint. The title "Developer" does not mean only software engineers — it means anyone who does the work of creating the product, regardless of discipline.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Developers',
      'description', 'Developers are committed to creating a usable Increment each Sprint. This includes anyone who does the work — designers, testers, engineers, analysts.',
      'transcript', 'DEVELOPERS IN SCRUM

In Scrum, "Developers" means anyone who creates the Increment — not just software engineers. Designers, testers, data scientists, technical writers, and domain experts are all Developers if they contribute to the Increment.

WHAT DEVELOPERS ARE ACCOUNTABLE FOR
- Creating a plan for the Sprint: the Sprint Backlog
- Instilling quality by adhering to the Definition of Done
- Adapting their plan each day toward the Sprint Goal
- Holding each other accountable as professionals

NO TITLES, NO SUB-TEAMS
The Scrum Guide says there are no sub-teams or hierarchies within Developers. In practice, this means:
- No "senior dev" who assigns work to "junior devs"
- No separate "QA team" that tests after developers finish
- No "architect" who designs and then hands off to "coders"

This does not mean skills are equal — individuals bring different expertise. It means the team organizes work collectively, not by hierarchy.

CROSS-FUNCTIONALITY IS REQUIRED
A Scrum Team must have all skills necessary to create value each Sprint. If the team cannot deliver a complete, tested, integrated Increment without help from outside the team, there is a cross-functionality gap to address.

THE SELF-MANAGING DEVELOPER
Developers pull work from the Sprint Backlog — work is not assigned to them. They coordinate directly with each other during the Sprint, using the Daily Scrum to inspect and adapt their Sprint plan.

DEVELOPER ACCOUNTABILITY VS. SCRUM MASTER ACCOUNTABILITY
When developers fall behind their Sprint forecast, the Scrum Master does not take over or create a recovery plan. The developers adapt their plan, remove impediments, and update the Sprint Backlog themselves.

AI FOR DEVELOPERS
AI tools help developers: generate test cases from acceptance criteria, review code for DoD compliance, summarize technical debt, and estimate story complexity — all without removing the human judgment that makes the Increment excellent.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%developers%' OR order_index = 1);

  -- Lesson 3
  UPDATE videos SET
    description = 'As a Scrum Master, your accountability is the effectiveness of Scrum itself. Unlike the PO who focuses on value and Developers who focus on the Increment, the Scrum Master focuses on the health of the process, the team, and Scrum''s adoption across the organization.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scrum Master',
      'description', 'The Scrum Master is accountable for Scrum''s effectiveness — coaching the team, facilitating events, and driving adoption across the organization.',
      'transcript', 'THE SCRUM MASTER WITHIN THE TEAM

Within the three-accountability model, the Scrum Master''s focus is unique: they are accountable for the process, not the product or the Increment.

THREE LAYERS OF SCRUM MASTER SERVICE

Layer 1 — Team Health
The Scrum Master watches for and addresses: low psychological safety, conflict that isn''t being surfaced, patterns of under-delivery, and skill gaps that affect cross-functionality. These are systemic issues, not performance issues.

Layer 2 — Event Effectiveness
Every Scrum event has a purpose and a timebox. The Scrum Master is responsible for ensuring events happen, that they serve their purpose, and that they don''t run over time. A Sprint Planning that turns into a requirements meeting is a failure of facilitation.

Layer 3 — Organizational Scrum Adoption
The Scrum Master works beyond the team — educating stakeholders about Scrum, addressing organizational impediments, and coaching other teams or leaders who interact with the Scrum Team.

THE SCRUM MASTER''S RELATIONSHIP WITH THE TEAM
The Scrum Master is part of the Scrum Team but has no authority over the developers. They coach, facilitate, and serve — they do not manage. The relationship is more like a trusted advisor than a boss.

MEASURING SCRUM MASTER EFFECTIVENESS
How do you know a Scrum Master is effective?
- Teams solve their own problems with decreasing Scrum Master involvement
- Events are timeboxed and purposeful, not dreaded
- Impediments get resolved rather than accumulating
- Stakeholders understand and respect the Scrum framework
- Team velocity is stable or improving and the Definition of Done strengthens over time

AI AMPLIFICATION
The AI-augmented Scrum Master uses AI to: analyze retro sentiment trends, detect impediment patterns, generate coaching frameworks, and surface Sprint health metrics before the end of a Sprint when there is still time to adapt.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%scrum master%' OR order_index = 2);

  -- Lesson 4
  UPDATE videos SET
    description = 'The three Scrum accountabilities create natural boundaries — and natural tensions. Understanding where each accountability ends and another begins is critical to avoiding the most common Scrum dysfunctions: the PO who micromanages implementation, the Scrum Master who becomes a PM, and the developers who refuse to engage with stakeholders.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Boundaries & overlaps',
      'description', 'The three Scrum accountabilities have natural boundaries and tensions. Understanding them prevents the most common Scrum dysfunctions.',
      'transcript', 'BOUNDARIES AND OVERLAPS IN SCRUM ACCOUNTABILITIES

The Scrum Guide assigns clear accountabilities, but in practice the lines blur. Knowing where each role begins and ends is critical professional knowledge.

THE CLEAN BOUNDARY MAP

Product Owner owns:
- WHAT gets built and in WHAT ORDER
- The Product Goal and Product Backlog
- Stakeholder relationships around product direction

Developers own:
- HOW the work gets done
- Technical implementation decisions
- The Sprint Backlog and daily plan

Scrum Master owns:
- WHETHER Scrum is being practiced effectively
- Impediment removal process
- Event facilitation and timeboxing

THE MOST COMMON BOUNDARY VIOLATIONS

PO crossing into Developer territory:
"I need this feature built using this specific API endpoint and this database schema."
Correct response: "The what is yours. The how is the team''s."

Developer crossing into PO territory:
"We''ve decided to work on the authentication module next because it''s more interesting."
Correct response: Sprint Backlog content comes from the ordered Product Backlog — ordering is the PO''s accountability.

Scrum Master crossing into PM territory:
"I''ve updated Jira with who''s doing what task this week."
Correct response: Task assignment belongs to the self-managing team.

OVERLAPPING AREAS (HEALTHY COLLABORATION)
Some areas require all three accountabilities to collaborate:
- Definition of Done: team creates it, Developers and Scrum Master enforce it, PO ensures it reflects user expectations
- Sprint Goal: PO proposes it, team negotiates it, Scrum Master protects it during the Sprint
- Refinement: PO orders and clarifies, Developers size and identify technical risk, Scrum Master facilitates

AI PATTERN DETECTION
AI tools can analyze communication patterns in Jira comments, Slack, and retro notes to flag when boundaries are regularly crossed — giving the Scrum Master early signals of dysfunction before it becomes cultural.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%boundaries%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 4 — The Sprint & Sprint Planning
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 3;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 4 chapter not found'; END IF;

  -- Lesson 1
  UPDATE videos SET
    description = 'The Sprint is the heartbeat of Scrum — a fixed-length event of one month or less during which the Scrum Team creates a valuable, useful Increment. Sprints are consecutive and consistent. No Sprint can be cancelled except by the Product Owner.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The Sprint',
      'description', 'The Sprint is a fixed-length event of one month or less during which the team creates a valuable, useful Increment. Sprints are consecutive and consistent.',
      'transcript', 'THE SPRINT

The Sprint is the container for all Scrum work. Every other Scrum event occurs within a Sprint.

KEY SPRINT CHARACTERISTICS
- Fixed length: one month or less. Most teams use 1–2 weeks.
- Consecutive: a new Sprint begins immediately after the previous one ends. There is no "time between Sprints."
- No goal changes: during a Sprint, the Sprint Goal does not change. Work may be clarified and re-negotiated between the PO and Developers, but only if it doesn''t endanger the Sprint Goal.
- Quality is non-negotiable: the Definition of Done does not change during a Sprint to enable faster delivery.
- Only the PO can cancel a Sprint: this is rare and only done when the Sprint Goal has become obsolete.

WHY FIXED LENGTH MATTERS
Consistent Sprint length creates rhythm. Teams develop forecasting accuracy, stakeholders know when to expect demos, and retrospectives happen regularly. Variable-length Sprints destroy all of these benefits.

THE SPRINT AS A RISK-REDUCTION MECHANISM
Each Sprint is a mini-experiment. At the end of every Sprint, the team has a working Increment and stakeholder feedback. If the direction is wrong, the maximum waste is one Sprint''s worth of work — not months or years of a wrong project.

SHORTER SPRINTS = FASTER FEEDBACK
A one-week Sprint means feedback every week. A one-month Sprint means feedback every month. For most modern product work, shorter Sprints are better.

WHAT CANNOT HAPPEN DURING A SPRINT
- Developers cannot be reassigned to other teams mid-Sprint
- The Sprint length cannot change mid-Sprint
- Work not in the Sprint Backlog cannot be quietly added without the Developers'' awareness
- The Definition of Done cannot be weakened to allow shipping incomplete work

AI SPRINT INTELLIGENCE
AI tools can analyze Sprint burndown patterns to predict end-of-Sprint outcomes by day 3 or 4, giving the team time to adapt before the Sprint ends.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%the sprint%' OR order_index = 0);

  -- Lesson 2
  UPDATE videos SET
    description = 'Sprint Planning initiates the Sprint by laying out the work to be performed. The Scrum Team collaborates to answer three topics: why is this Sprint valuable, what can be done this Sprint, and how will the chosen work get done.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Sprint Planning topics',
      'description', 'Sprint Planning answers three topics: why is this Sprint valuable, what can be done, and how will the chosen work get done.',
      'transcript', 'SPRINT PLANNING: THE THREE TOPICS

Sprint Planning is timeboxed to a maximum of 8 hours for a one-month Sprint, proportionally shorter for shorter Sprints.

TOPIC 1: WHY IS THIS SPRINT VALUABLE?
The Product Owner proposes how the product can increase its value and utility in the current Sprint. The whole Scrum Team then collaborates to define a Sprint Goal that communicates why the Sprint is valuable to stakeholders.

This topic comes FIRST. Without a clear Sprint Goal, the team is just picking a list of tasks. With a clear Sprint Goal, every decision during the Sprint has a north star.

TOPIC 2: WHAT CAN BE DONE THIS SPRINT?
Developers select items from the Product Backlog to include in the Sprint. Only Developers forecast what they can complete — the Scrum Master never overrides this, and the PO never demands a specific number of items.

Key inputs:
- The Product Backlog (ordered by the PO)
- The team''s past performance (velocity, historical data)
- The current team capacity (who is present, any planned absences)
- The Definition of Done

TOPIC 3: HOW WILL THE CHOSEN WORK GET DONE?
Developers plan the work needed to create an Increment that meets the Definition of Done. The Sprint Backlog emerges from this planning — it is the Sprint Goal + the selected items + the plan for delivering the Increment.

This plan is often decomposed into tasks of one day or less, but the Scrum Guide does not prescribe a specific format. Some teams use story maps, others use a simple task list in Jira.

SPRINT PLANNING ANTI-PATTERNS
- Planning the entire Sprint in exhaustive detail on day 1 (over-planning)
- Skipping planning entirely and "just getting started"
- PO dictating exactly which items must be in the Sprint
- Sprint Planning that consumes the entire timebox discussing requirements (refinement disguised as planning)

AI FOR SPRINT PLANNING
AI can analyze previous Sprint data to suggest realistic capacity forecasts, generate Sprint Goal options based on the top backlog items, and flag technical risk in the selected items.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%planning topics%' OR order_index = 1);

  -- Lesson 3
  UPDATE videos SET
    description = 'The Sprint Goal is the single objective for the Sprint. It creates coherence and focus — giving the Developers flexibility in exactly how they achieve it, while providing guidance on why they are building what they are building.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The Sprint Goal',
      'description', 'The Sprint Goal is the single objective for the Sprint — creating focus and giving the team flexibility in how they achieve it.',
      'transcript', 'THE SPRINT GOAL

The Sprint Goal is one of three commitments in Scrum (alongside the Product Goal and the Definition of Done). It is the commitment for the Sprint Backlog.

WHAT MAKES A GOOD SPRINT GOAL
A great Sprint Goal:
- Is outcome-focused, not output-focused ("Enable customers to complete checkout without calling support" not "Build the checkout flow")
- Can be achieved even if not every Sprint Backlog item is completed
- Gives Developers flexibility in implementation
- Is created collaboratively during Sprint Planning
- Is specific enough to guide decisions but broad enough to allow adaptation

EXAMPLES OF POOR SPRINT GOALS
- "Complete all items in the Sprint Backlog" — this is just a task list, not a goal
- "Fix bugs and technical debt" — vague, not outcome-oriented
- "Sprint 14" — not a goal at all

EXAMPLES OF STRONG SPRINT GOALS
- "Give sales reps a dashboard they can show clients in demos"
- "Reduce checkout abandonment by making payment options visible before the final step"
- "Enable the QA team to run automated regression tests without manual setup"

THE SPRINT GOAL AS A COMPASS
During the Sprint, when unexpected work or decisions arise, the Sprint Goal is the compass. Developers ask: "Does this serve the Sprint Goal?" If yes, do it. If no, add it to the Product Backlog for the PO to consider ordering.

PROTECTING THE SPRINT GOAL
If circumstances change and the Sprint Goal becomes obsolete, the Product Owner can cancel the Sprint. This is the only condition under which a Sprint ends before its timebox.

AI SPRINT GOAL GENERATION
AI can generate Sprint Goal candidates from the top ordered Product Backlog items. The team then selects and refines the goal collaboratively. AI generates options — the team commits.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%sprint goal%' OR order_index = 2);

  -- Lesson 4
  UPDATE videos SET
    description = 'Capacity planning and forecasting help the team select a realistic Sprint Backlog. Forecasting is not promising — it is the team''s best empirical estimate based on past performance, current capacity, and known risk.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Capacity & forecasting',
      'description', 'Capacity planning and forecasting help teams select a realistic Sprint Backlog. Forecasting is empirical — based on past performance and current capacity.',
      'transcript', 'CAPACITY AND FORECASTING

The team''s forecast for what it can complete in a Sprint is based on evidence, not optimism.

CAPACITY VS. VELOCITY
Capacity: the available working time for the Sprint. Calculated by: (team members × Sprint days) minus planned absences, holidays, and non-development time.

Velocity: the average amount of work completed per Sprint over the last 3–5 Sprints, measured in story points or similar units. Velocity is a historical average, not a target.

HOW TO FORECAST A SPRINT
Step 1: Calculate available capacity (hours or days per developer)
Step 2: Look at recent velocity — what has the team consistently completed?
Step 3: Account for any differences this Sprint (new member, key person absent, tech spike needed)
Step 4: Select Sprint Backlog items that fit within this adjusted estimate
Step 5: As a team, gut-check: does this feel achievable?

FORECASTING IS NOT A COMMITMENT
This is one of the most important concepts for Scrum Masters to teach: the team forecasts, not commits. A forecast is the team''s best estimate given what it knows today. If new information emerges mid-Sprint, the forecast adjusts.

COMMON FORECASTING MISTAKES
- Using velocity as a mandatory minimum ("we did 40 points last Sprint, so we must do 40 this Sprint")
- Adding buffer items "in case we finish early" that become zombie work
- Ignoring team member absences when calculating capacity
- Counting hours in a day as 8 productive hours (knowledge work is closer to 4–6 focused hours)

PROTECTING TEAMS FROM OVER-COMMITMENT
When stakeholders or managers pressure teams to take more work than their forecast supports, the Scrum Master makes the risk visible: "The team''s forecast is based on our historical data. Adding more raises the risk of not achieving the Sprint Goal."

AI FORECASTING
AI tools can analyze multi-Sprint velocity data, flag unusually optimistic Sprints, and generate probability-based completion forecasts — showing stakeholders a range rather than a false single-point promise.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%capacity%' OR title ILIKE '%forecasting%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 5 — Daily Scrum & Sprint Execution
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 4;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 5 chapter not found'; END IF;

  -- Lesson 1
  UPDATE videos SET
    description = 'The Daily Scrum is a 15-minute event for the Developers to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary. It is not a status meeting for the Scrum Master or manager. It is the Developers'' daily planning tool.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Purpose of the Daily Scrum',
      'description', 'The Daily Scrum is a 15-minute event for Developers to inspect progress toward the Sprint Goal and adapt the Sprint Backlog. It is not a status meeting.',
      'transcript', 'THE PURPOSE OF THE DAILY SCRUM

The Daily Scrum is one of the five Scrum events. It is timeboxed to 15 minutes. It occurs at the same time and place every working day of the Sprint.

WHO THE DAILY SCRUM IS FOR
The Daily Scrum is for the Developers. Not for the Scrum Master. Not for the Product Owner. Not for management. The Developers use it to:
- Inspect progress toward the Sprint Goal
- Adapt the Sprint Backlog to reflect what they plan to do next
- Identify anything impeding their progress

THE THREE CLASSIC QUESTIONS (OPTIONAL FORMAT)
The Scrum Guide does not prescribe a format. The classic three questions are a common starting point, not a requirement:
1. What did I do yesterday that helped the team reach the Sprint Goal?
2. What will I do today to help the team reach the Sprint Goal?
3. Do I see any impediments that prevent me or the team from meeting the Sprint Goal?

BETTER FORMATS
Many high-performing teams move beyond the three questions to:
- Walk the board: review the Sprint Backlog item by item, focusing on what is at risk
- Focus on the Sprint Goal: "Are we on track? What might prevent us from reaching the goal?"
- Forecast the end: "Given what we know today, will we achieve the Sprint Goal by end of Sprint?"

DAILY SCRUM VS. DAILY STANDUP
Many companies have a "daily standup" that looks like a Daily Scrum but functions as a status meeting — developers reporting to a manager or Scrum Master. This is a dysfunction. If people are reporting to someone rather than collaborating with each other, it is a status meeting.

THE SCRUM MASTER''S ROLE IN THE DAILY SCRUM
The Scrum Master does not run the Daily Scrum. They ensure it happens, stays within 15 minutes, and that its purpose is understood. Developers facilitate it themselves.

AI IN THE DAILY SCRUM
AI tools can summarize standup notes, identify recurring impediment patterns, and flag when teams consistently mention the same blockers — giving the Scrum Master data to act on.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%purpose of the daily%' OR order_index = 0);

  -- Lesson 2
  UPDATE videos SET
    description = 'Daily Scrum anti-patterns are common and costly. When the Daily Scrum becomes a status meeting, a manager check-in, or a problem-solving session, teams lose its core value: fast, peer-to-peer coordination toward the Sprint Goal.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Anti-patterns',
      'description', 'Daily Scrum anti-patterns include status meetings, manager check-ins, and problem-solving sessions that derail the 15-minute purpose.',
      'transcript', 'DAILY SCRUM ANTI-PATTERNS

The Daily Scrum is one of the most commonly corrupted Scrum events. Knowing the anti-patterns allows you to coach teams back to effectiveness.

THE STATUS MEETING ANTI-PATTERN
Symptom: Developers report to the Scrum Master, manager, or PO. Each person waits their turn to speak. No dialogue between developers.

Root cause: The event is being used as a management accountability tool rather than a team coordination tool.

Fix: Redirect the audience. The Scrum Master should be an observer, not a recipient. Developers should talk to each other — physically turn toward teammates, not toward the person holding the "authority."

THE PROBLEM-SOLVING ANTI-PATTERN
Symptom: A developer mentions an impediment, and the team spends 20 minutes solving it in the Daily Scrum.

Root cause: Conflating identification with resolution.

Fix: The Daily Scrum is for surfacing impediments, not resolving them. Use a "parking lot" — note the impediment, assign one person to follow up after the standup, and keep the Daily Scrum to 15 minutes.

THE ABSENT SCRUM MASTER ANTI-PATTERN
Symptom: Developers don''t run the Daily Scrum when the Scrum Master is away.

Root cause: The team depends on the Scrum Master to run the event rather than owning it themselves.

Fix: Deliberately step back. Let the team own the Daily Scrum. If it falls apart without you, that is valuable information about the team''s self-management maturity.

THE "YESTERDAY I DID TASKS" ANTI-PATTERN
Symptom: Developers list tasks completed rather than discussing progress toward the Sprint Goal.

Root cause: Treating the Daily Scrum as a timesheet rather than an inspection event.

Fix: Start the Daily Scrum by displaying the Sprint Goal. Ask: "What do we know today about our progress toward this goal?"

AI COACHING
AI can analyze standup transcripts for linguistic patterns that indicate status reporting (e.g., first-person task lists, lack of questions, no mention of the Sprint Goal) and generate coaching suggestions for the Scrum Master.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%anti-pattern%' OR order_index = 1);

  -- Lesson 3
  UPDATE videos SET
    description = 'Impediment management is one of the Scrum Master''s most visible and impactful responsibilities. An impediment is anything that slows or blocks the team''s progress. The Scrum Master''s job is not to solve every impediment — it is to ensure every impediment gets resolved.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Impediment management',
      'description', 'Impediment management is a core Scrum Master responsibility. Impediments must be identified, prioritized, and resolved — not accumulated.',
      'transcript', 'IMPEDIMENT MANAGEMENT

An impediment is anything that slows or stops the team from making progress toward the Sprint Goal. Impediment management is a continuous Scrum Master responsibility — not just a Sprint Retrospective topic.

TYPES OF IMPEDIMENTS

Team-level impediments (Developers can usually resolve these):
- Missing technical knowledge or skills
- Unclear requirements or acceptance criteria
- Interpersonal conflicts within the team
- Poor development environment or tooling

Organizational impediments (require Scrum Master or leadership escalation):
- Bureaucratic approval processes that delay decisions
- Dependencies on teams outside Scrum
- Policies that conflict with empirical delivery (e.g., fixed-scope contracts)
- Resource constraints (team too small, key skill missing)
- Cultural resistance to Scrum principles

THE IMPEDIMENT RESOLUTION PROCESS

Step 1 — Surface it: create psychological safety for the team to name impediments early. Impediments hidden in retros are impediments that festered for weeks.

Step 2 — Classify it: is this a team-level impediment or organizational? Team-level impediments should be resolved by the team. Escalate organizational impediments.

Step 3 — Assign ownership: every impediment needs one person accountable for tracking its resolution. The Scrum Master owns the escalation path, not the solution.

Step 4 — Track it: maintain a visible impediment log. Untracked impediments disappear and resurface Sprint after Sprint.

Step 5 — Verify resolution: close the loop. Confirm the impediment is actually resolved, not just "in progress" forever.

THE SCRUM MASTER''S ESCALATION TOOLKIT
- Direct conversation with the blocking party
- Escalation to a manager or organizational leader
- Bringing the impediment to Sprint Review as a transparency artifact
- Proposing policy or process changes to prevent recurrence

AI FOR IMPEDIMENT MANAGEMENT
AI can cluster impediment logs by category, detect patterns across multiple Sprints, and generate escalation briefs — helping the Scrum Master present systemic issues to leadership with data.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%impediment%' OR order_index = 2);

  -- Lesson 4
  UPDATE videos SET
    description = 'Flow during the Sprint means work moves continuously from "to do" to "done" without batching, bottlenecks, or wait states. The Scrum Master protects flow by keeping the team focused on the Sprint Goal and preventing interruptions.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Flow during the Sprint',
      'description', 'Flow means work moves continuously toward done without batching or bottlenecks. The Scrum Master protects flow and keeps the team focused on the Sprint Goal.',
      'transcript', 'FLOW DURING THE SPRINT

Flow is the state where work moves continuously from start to done without unnecessary waiting, interruption, or batching. Protecting flow is a core Scrum Master skill.

WHAT DISRUPTS FLOW

External interruptions:
- Stakeholders requesting ad-hoc work directly from developers
- Management pulling developers into meetings not related to the Sprint
- "Urgent" requests that bypass the Product Backlog

Internal batching:
- All developers working on separate items and doing a "big integration" at the end of the Sprint
- QA testing only starting in the last two days of the Sprint
- Documentation written after development is "done"

Context switching:
- Developers assigned to multiple Sprints or multiple teams simultaneously
- Developers splitting their time between development and Scrum Master duties

VISUALIZING FLOW
A well-maintained Sprint Backlog (in Jira, a physical board, or any tool) visualizes flow. The Scrum Master uses the board to:
- Identify items that have been "in progress" too long (flow blockers)
- See when the team is front-loading (all work in progress at once)
- Spot work that is not moving toward Done

THE SPRINT BURNDOWN
A Sprint burndown chart shows remaining work over time. A healthy burndown trends steadily toward zero. Warning signs:
- Flat line for multiple days (work is blocked or not being tracked)
- Work increasing mid-Sprint (scope is being added)
- Steep drop at the end (work was "done" without meeting DoD)

PROTECTING FOCUS
When external requests arrive mid-Sprint, the Scrum Master''s response is clear: "Please add this to the Product Backlog. The PO will order it for consideration in the next Sprint." If it is truly an emergency, the PO decides whether to replace existing Sprint Backlog items — the team does not quietly add work.

AI FLOW MONITORING
AI can analyze Jira ticket age data to flag items that have been in-progress too long, identify bottleneck stages, and generate flow health summaries for the Scrum Master''s daily review.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%flow during%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 6 — Sprint Review & Retrospective
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 5;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 6 chapter not found'; END IF;

  -- Lesson 1
  UPDATE videos SET
    description = 'The Sprint Review is a working session where the Scrum Team and stakeholders inspect the Increment and adapt the Product Backlog based on what was learned. It is not a demo, not a sign-off meeting, and not a performance review.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Sprint Review',
      'description', 'The Sprint Review is a working session where the team and stakeholders inspect the Increment and adapt the Product Backlog based on what was learned.',
      'transcript', 'THE SPRINT REVIEW

The Sprint Review is the fourth Scrum event. It is timeboxed to a maximum of 4 hours for a one-month Sprint.

PURPOSE
The Sprint Review''s purpose is inspection and adaptation of the product. The Scrum Team and key stakeholders review what was accomplished in the Sprint and what has changed in their environment. Based on this information, they collaborate on what to do next.

WHAT SHOULD HAPPEN IN THE SPRINT REVIEW
- The Product Owner explains what Product Backlog items have been "Done" and what has not
- The Developers discuss what went well, what problems they ran into, and how those problems were solved
- The Developers demonstrate the work that is Done and answer questions about the Increment
- The Product Owner discusses the Product Backlog as it stands
- The entire group collaborates on what to do next — the Sprint Review provides input to subsequent Sprint Planning

WHAT THE SPRINT REVIEW IS NOT
- Not a "sign off" meeting where stakeholders approve the Increment
- Not a demo where developers show features to an audience that doesn''t engage
- Not a status update to management
- Not a place to discuss what the team did wrong (that is the Retrospective)

THE PRODUCT BACKLOG REVIEW
The most undervalued part of the Sprint Review is the collaborative Product Backlog discussion. Based on:
- What was demonstrated and the feedback received
- Changes in the market, competitive landscape, or business priorities
- What is "Done" and what remains

The Product Owner may reorder, add, remove, or refine backlog items. This is the Scrum Guide''s vision of continuous planning — not a big upfront plan, but continuous adaptation.

STAKEHOLDER ENGAGEMENT
The Sprint Review only works if the right stakeholders attend. The Scrum Master may need to coach the PO on stakeholder invitation and ensure the Review is structured to invite genuine feedback, not passive observation.

AI FOR SPRINT REVIEW
AI can synthesize stakeholder feedback from the Sprint Review into themes, generate Product Backlog update suggestions based on patterns in the feedback, and create executive summaries of Increment value delivered.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%sprint review%' OR order_index = 0);

  -- Lesson 2
  UPDATE videos SET
    description = 'The Sprint Retrospective is the Scrum Team''s opportunity to inspect itself and create a plan for improvements. It is the most powerful continuous improvement tool in Scrum — and the most often skipped or superficially executed.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Retrospective',
      'description', 'The Sprint Retrospective is where the team inspects itself and plans improvements to process, relationships, and tools. It is Scrum''s core continuous improvement engine.',
      'transcript', 'THE SPRINT RETROSPECTIVE

The Sprint Retrospective is the fifth and final Scrum event. It is timeboxed to a maximum of 3 hours for a one-month Sprint.

PURPOSE
The Retrospective''s purpose is to improve the team''s process, relationships, and tools. It inspects: how the last Sprint went with regards to individuals, interactions, processes, tools, and the Definition of Done.

THE RETROSPECTIVE''S THREE OUTPUTS
1. Identification of what went well — to be preserved and amplified
2. Identification of what could be improved — to be addressed
3. Concrete improvement plan: the most impactful improvements are added to the next Sprint Backlog (they become real work, not aspirational statements)

THE MOST IMPORTANT THING: PSYCHOLOGICAL SAFETY
A retrospective without psychological safety produces surface-level outputs. If team members fear consequences for speaking honestly, the Retrospective becomes theater. The Scrum Master''s primary job in the Retro is to create safety for honest conversation.

COMMON RETROSPECTIVE FORMATS
- Start/Stop/Continue: what should we start doing, stop doing, and continue doing?
- 4Ls: what did we Like, Learn, Lack, and Long for?
- Mad/Sad/Glad: emotional check-in that surfaces team morale
- Timeline retro: map the Sprint day-by-day and annotate high and low points
- Lean Coffee: participant-generated agenda, democratically prioritized

THE FAILURE MODE: RETROS WITHOUT ACTION
The most common Retrospective failure is producing a list of improvements and then doing nothing with them. Each Retro should start by reviewing the previous Retro''s action items: "What did we commit to last time? Did we do it?"

AI FOR RETROSPECTIVES
AI can cluster sticky note content into themes, identify patterns across multiple Retrospectives, and generate improvement experiment suggestions based on the team''s specific challenges — dramatically speeding up the synthesis stage of the Retro.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%retrospective%' OR order_index = 1);

  -- Lesson 3
  UPDATE videos SET
    description = 'Improvement experiments turn Retrospective insights into measurable change. Instead of vague commitments like "we will communicate better," an improvement experiment defines a specific hypothesis, a change to try, and a way to measure whether it worked.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Improvement experiments',
      'description', 'Improvement experiments turn Retrospective insights into measurable change — specific hypotheses, targeted changes, and clear measurements.',
      'transcript', 'IMPROVEMENT EXPERIMENTS

The gap between a good Retrospective and a great team is execution. Improvement experiments close that gap by applying empiricism to the team''s own process.

THE EXPERIMENT MINDSET
Scrum is built on empiricism. Apply the same mindset to team improvement: instead of "we need to improve communication," run an experiment: "We hypothesize that holding a 10-minute end-of-day sync will reduce questions that block the Daily Scrum. We will try this for one Sprint and measure: did Daily Scrum questions decrease?"

THE EXPERIMENT TEMPLATE
- Hypothesis: We believe that [change] will [outcome]
- Action: For [time period], we will [specific behavior change]
- Measurement: We will know it worked if [observable indicator]
- Review: At the next Retrospective, we assess the result

SIZING EXPERIMENTS CORRECTLY
Experiments should be small enough to complete in one Sprint. "Improve our testing process" is not an experiment. "Add a peer review step before marking any item Done" is an experiment — specific, time-boxed, measurable.

FROM INSIGHT TO BACKLOG ITEM
The Scrum Guide recommends adding at least one improvement to the Sprint Backlog. This makes improvement work real and visible. It competes for Sprint capacity like any other work — which forces prioritization and signals that improvement is a first-class activity, not an afterthought.

TRACKING EXPERIMENTS OVER TIME
Maintain an experiment log across Retrospectives. This shows: what has been tried, what worked, what didn''t, and what patterns emerge. Teams with healthy experiment histories have a visible improvement culture.

WHEN EXPERIMENTS FAIL
Not every experiment works. Failure is information. A failed experiment that generates learning is more valuable than no experiment at all. The Scrum Master celebrates failed experiments that were well-formed: "We tried it. We measured. We learned something."

AI FOR IMPROVEMENT EXPERIMENTS
AI can generate experiment suggestions from Retrospective themes, analyze multi-Sprint experiment logs to identify patterns, and suggest which historical experiments from similar teams have the best track record for your specific challenge type.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%improvement experiment%' OR order_index = 2);

  -- Lesson 4
  UPDATE videos SET
    description = 'Facilitation techniques are the Scrum Master''s toolkit for making Scrum events effective, inclusive, and energizing. Good facilitation is not about controlling the conversation — it is about creating conditions where the best thinking emerges.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Facilitation techniques',
      'description', 'Facilitation techniques help the Scrum Master make events effective, inclusive, and energizing — creating conditions for the best thinking to emerge.',
      'transcript', 'FACILITATION TECHNIQUES

Facilitation is the art of making a group''s conversation more effective without controlling its outcome. It is the Scrum Master''s most-used skill.

THE FACILITATOR''S NEUTRALITY
A facilitator is not a participant. When facilitating, the Scrum Master does not push their own solutions, does not take sides in debates, and does not declare winners. Their job is to ensure the process is fair, focused, and productive — not to control the output.

CORE FACILITATION TECHNIQUES

Timeboxing:
Every Scrum event is timeboxed for a reason. Visible timers (physical or digital) help teams self-manage their conversation. When a topic consumes more than its share of time, the facilitator gently surfaces it: "We have 5 minutes left for this topic. Do we have enough to move forward, or should we park this for a separate conversation?"

Round-robins:
In groups with dominant voices, a round-robin ensures every person speaks. Use for: initial Retrospective inputs, Sprint Planning topic 1 (why is this Sprint valuable), and any decision where quiet voices may hold critical information.

Dot voting:
After generating a list of options or themes, give participants a fixed number of "votes" (dots, thumbs-ups, stars) to allocate across options. The group quickly converges on priorities without lengthy debate.

Silent brainstorming:
Have participants write ideas individually before sharing. This prevents anchoring — where the first person to speak shapes everyone else''s thinking. Especially powerful for Retrospectives.

The "parking lot":
When a valuable but off-topic discussion emerges, capture it in a visible "parking lot" rather than ignoring it or letting it hijack the agenda. Return to parking lot items at the end of the session or schedule a separate time.

Liberating Structures:
A library of facilitation techniques designed for complex group dynamics. Particularly useful structures for Scrum events: 1-2-4-All (for Retrospective brainstorming), TRIZ (for identifying what to stop), and What, So What, Now What (for Sprint Review reflection).

AI FOR FACILITATION
AI can generate facilitation scripts for each Scrum event, suggest formats based on team size and maturity, and analyze post-session feedback to help the Scrum Master improve their facilitation quality over time.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%facilitation technique%' OR order_index = 3);

END $$;

-- =============================================================================
-- VERIFY
-- =============================================================================
SELECT
  c.order_index AS module,
  v.order_index AS lesson,
  v.title,
  LEFT(v.description, 60) AS desc_preview,
  (v.translations->'en'->>'transcript') IS NOT NULL AS has_transcript
FROM videos v
JOIN chapters c ON c.id = v.chapter_id
WHERE c.course_id = 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14'
  AND c.order_index BETWEEN 1 AND 5
ORDER BY c.order_index, v.order_index;
