-- =============================================================================
-- Seed BA lesson content (description + EN transcript) — Modules 4–6
--
--   M4: Elicitation Techniques & Collaboration   (order_index 4, OFFSET 3)
--   M5: Facilitation & Workshop Leadership        (order_index 5, OFFSET 4)
--   M6: Requirements Engineering                  (order_index 6, OFFSET 5)
--
-- Apply: paste into Supabase SQL Editor → Run
-- Verify: SELECT c.order_index, COUNT(*) FILTER (WHERE translations->'en'->>'transcript' IS NOT NULL) AS filled
--         FROM videos v JOIN chapters c ON c.id=v.chapter_id
--         JOIN courses co ON co.id=c.course_id WHERE co.curriculum_version='ba-v1'
--         AND c.order_index IN (4,5,6) GROUP BY c.order_index ORDER BY c.order_index;
-- Expected: modules 4,5,6 → filled=5 each
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
-- MODULE 4 — Elicitation Techniques & Collaboration  (OFFSET 3, order_index = 4)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 3;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M4 chapter not found'; END IF;

  -- Lesson 1: The Elicitation Toolkit
  UPDATE public.videos SET
    description = 'Elicitation is the most underestimated BA skill. Most analysts default to interviews and workshops — but the real toolkit includes 12 distinct techniques, each suited to different stakeholder types, problem types, and information gaps. This lesson maps the full toolkit and teaches you to choose the right technique for each situation before you start.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The Elicitation Toolkit',
      'description', 'The full elicitation toolkit has 12 techniques. Most analysts use 2. This lesson maps all 12 and teaches you to select the right one for each situation, stakeholder, and information gap.',
      'transcript', 'THE ELICITATION TOOLKIT

WHY TECHNIQUE SELECTION MATTERS

Most BAs use interviews and workshops for everything. This works for simple, accessible stakeholder groups. It fails when:
- Stakeholders cannot articulate their needs (they just "know it when they see it")
- The real process is different from the documented process
- Stakeholders are geographically distributed and time-constrained
- The domain is highly technical and experts are scarce

Choosing the wrong elicitation technique wastes everyone''s time and produces shallow requirements.

THE 12 ELICITATION TECHNIQUES

1. INTERVIEWS (structured / semi-structured / unstructured)
Best for: senior stakeholders, one-to-one, complex topics, political sensitivity
Avoid when: you need consensus, group dynamics matter, or the stakeholder group is large

2. WORKSHOPS (facilitated group sessions)
Best for: cross-functional alignment, prioritisation, resolving conflicting requirements
Avoid when: power dynamics would suppress honest input, or group size exceeds 12

3. OBSERVATION / CONTEXTUAL INQUIRY
Best for: understanding real work processes (not the idealised version), discovering undocumented exceptions
Avoid when: the work is cognitively invisible (e.g. expert judgment calls) or privacy-sensitive

4. DOCUMENT ANALYSIS
Best for: understanding current systems, existing processes, regulatory requirements
Avoid when: documents are outdated or aspirational (they describe what should happen, not what does)

5. SURVEYS / QUESTIONNAIRES
Best for: large stakeholder groups, quantifying preferences, baseline measurement
Avoid when: questions are complex, nuanced responses are needed, or response rate is unpredictable

6. PROTOTYPING
Best for: stakeholders who cannot describe requirements abstractly but can react to a concrete example
Avoid when: stakeholders confuse the prototype for the final product

7. BRAINSTORMING
Best for: generating options and creative solutions
Avoid when: a dominant stakeholder will shut down dissenting voices

8. INTERFACE ANALYSIS
Best for: identifying data flows between systems, integration requirements
Avoid when: system documentation is inaccurate (verify assumptions)

9. REQUIREMENTS WORKSHOPS (structured)
Best for: cross-functional teams building a shared backlog
Avoid when: scope is too broad for one session

10. FOCUS GROUPS
Best for: understanding user attitudes, preferences, and emotional responses
Avoid when: you need precise technical requirements

11. REVERSE ENGINEERING
Best for: understanding legacy systems with no documentation
Avoid when: the current system behaviour is incorrect (you would be specifying bugs)

12. MIND MAPPING
Best for: exploring the scope of a problem, organising elicited information
Avoid when: used as a substitute for structured requirements

CHOOSING YOUR TECHNIQUE

Ask three questions:
1. What type of information do I need? (facts, opinions, process, constraints, priorities)
2. Who can give it to me? (executives, SMEs, end users, system owners)
3. What constraints exist? (time, access, group size, sensitivity)

Match your answers to the technique grid.

DELIVERABLE: Elicitation Plan
For your next engagement, complete a one-page Elicitation Plan: for each information gap, identify the technique, the target stakeholders, the session format, and what you will do with the outputs.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Discovery & JTBD Interviewing
  UPDATE public.videos SET
    description = 'Jobs-to-be-Done (JTBD) is the most powerful interviewing framework for discovering what stakeholders actually need — as opposed to what they say they want. This lesson teaches the JTBD switch interview technique: how to ask questions that surface the real job, the emotional context, and the criteria stakeholders use to evaluate whether a solution is working.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Discovery & JTBD Interviewing',
      'description', 'Jobs-to-be-Done interviews surface what stakeholders actually need, not just what they say they want. This lesson teaches the JTBD switch interview to find the real job, emotional context, and evaluation criteria.',
      'transcript', 'DISCOVERY & JTBD INTERVIEWING

THE JOBS-TO-BE-DONE FRAMEWORK

Customers (and stakeholders) do not want a product feature. They want to make progress in their life. They "hire" a product or process to do a job for them.

The JTBD framework (Christensen, Moesta) asks: "What job is the stakeholder hiring this solution to do?"

Classic example: People do not buy a drill. They hire a drill to make a hole. They do not want the hole — they want a picture on the wall. They do not want the picture — they want to feel at home.

When you understand the real job, you stop specifying the drill and start specifying the feeling of being at home.

THE SWITCH INTERVIEW

The JTBD switch interview is designed to surface the moment a stakeholder decided they needed a change — and what drove that decision.

THE FOUR PHASES OF THE SWITCH INTERVIEW

Phase 1 — THE FIRST THOUGHT
"Tell me about the moment you first started thinking about changing [the current process/system/approach]."
Goal: identify the triggering event. What changed in their world that made the status quo unacceptable?

Phase 2 — THE PASSIVE LOOKING PHASE
"What did you do before you started actively looking for a solution?"
Goal: understand how long they tolerated the problem. What was the cost of inaction?

Phase 3 — THE ACTIVE LOOKING PHASE
"Walk me through how you started looking for a solution. What did you consider?"
Goal: understand what alternatives they evaluated and why they rejected them.

Phase 4 — THE DECISION
"What was the deciding factor? What made you choose [this solution / approach / request]?"
Goal: understand the evaluation criteria. These become your acceptance criteria.

PROBING FOR THE EMOTIONAL JOB

Behind every functional job is an emotional job (how they want to feel) and a social job (how they want to be perceived).

"How did it feel when [current problem occurs]?" → emotional job
"How did others react when this problem happened?" → social job

Understanding all three jobs (functional, emotional, social) produces requirements that deliver value people can feel — not just features they can check off.

STRUCTURING YOUR INTERVIEW GUIDE

A good interview guide has:
- 5–8 core questions (not a script — a map)
- Probes for each question (follow-up questions if the answer is shallow)
- An explicit time allocation per phase
- A closing question: "Is there anything I should have asked that I didn''t?"

DELIVERABLE: Interview Guide
Write a JTBD-structured interview guide for your current engagement. Include: 6 core questions, 2 probes per question, time allocation, and the output you expect from each phase.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Contextual Inquiry & Observation
  UPDATE public.videos SET
    description = 'People describe idealised versions of their work when interviewed. Observation reveals what they actually do. Contextual inquiry — structured observation in the real work environment — uncovers undocumented processes, workarounds, exceptions, and pain points that stakeholders take for granted and therefore never mention. This lesson teaches you to do it without disrupting the work.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Contextual Inquiry & Observation',
      'description', 'Interviews reveal what people think they do. Observation reveals what they actually do. This lesson teaches contextual inquiry: structured observation that uncovers the workarounds, exceptions, and pain points stakeholders never mention.',
      'transcript', 'CONTEXTUAL INQUIRY & OBSERVATION

THE ESPOUSED THEORY PROBLEM

Every organisation has two process models:
1. The espoused theory: the documented, official process that stakeholders describe in interviews
2. The theory in use: what people actually do when the documented process does not work

If you only elicit through interviews, you get the espoused theory — a sanitised, idealised version of the work. You build a system to match it. The system does not match real work. It fails.

Contextual inquiry gives you the theory in use.

WHAT CONTEXTUAL INQUIRY REVEALS

In a typical observation session, you will discover:
- Shadow processes: informal steps stakeholders invented to work around system limitations
- Exception handling: what happens when the standard case does not apply (often the most business-critical path)
- Data quality issues: fields that are never filled correctly, codes that have been repurposed
- Integration gaps: data that is manually rekeyed between systems because no integration exists
- Cognitive work: judgment calls the expert makes instantly and cannot articulate in an interview
- Physical artefacts: sticky notes, spreadsheets, notebooks that are the real system of record

None of this will appear in a requirements interview.

HOW TO CONDUCT CONTEXTUAL INQUIRY

THE MASTER/APPRENTICE MODEL
Position yourself as the apprentice learning from the expert. You are not evaluating their work — you are trying to understand it well enough to support it.

"My job is to understand your work well enough to help improve it. Can you show me how you do [task] as you normally would, and talk me through what you''re thinking as you go?"

THE FOUR PRINCIPLES (Beyer & Holtzblatt)

1. CONTEXT: observe in the real work environment, not a conference room
2. PARTNERSHIP: work collaboratively — ask questions as the work happens
3. INTERPRETATION: share your interpretations as you form them — check them against reality
4. FOCUS: keep sessions focused on the work relevant to your analysis

WHAT TO DOCUMENT

During the session:
- Sequence of steps (including deviations from the documented process)
- Tools used (systems, spreadsheets, physical artefacts)
- Decision points (where does the worker have to judge, not just follow rules?)
- Frustrations expressed verbally or through behaviour (sighs, pauses, workarounds)
- Frequency indicators ("I do this about 20 times a day")

After the session:
- Consolidate into an Observation Findings document
- Highlight gaps between espoused and actual process
- Flag exceptions that must be handled by the new system

DELIVERABLE: Observation Findings
Conduct one contextual inquiry session (or simulate from memory of a process you know well). Produce an Observation Findings document: observed process steps, deviations from the documented process, exceptions identified, and three key insights for requirements.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Root-Cause & Signal Detection
  UPDATE public.videos SET
    description = 'The stated problem is rarely the real problem. A BA who solves the stated problem without investigating root cause often delivers a solution that addresses a symptom and leaves the disease untouched. This lesson teaches the root-cause toolkit — the 5 Whys, fishbone diagrams, and weak-signal detection — so you solve the right problem before writing a single requirement.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Root-Cause & Signal Detection',
      'description', 'The stated problem is rarely the real problem. This lesson teaches the root-cause toolkit — 5 Whys, fishbone diagrams, and weak-signal detection — so you solve the right problem before writing a single requirement.',
      'transcript', 'ROOT-CAUSE & SIGNAL DETECTION

THE SYMPTOM TRAP

A business unit manager says: "We need better reports."

The naive BA writes requirements for better reports.

What the problem actually is: the manager cannot make decisions fast enough because the data arrives 3 days late and is missing key fields. Better reports do not solve a 3-day data latency problem.

You solved the stated problem. You did not solve the real problem.

ROOT-CAUSE ANALYSIS: THE TOOLKIT

THE 5 WHYS

Ask "why" repeatedly until you reach the systemic cause, not just the immediate cause.

Example:
Problem: Customer complaints about late orders are increasing.
Why 1: Orders are being dispatched late.
Why 2: The picking team is not completing picks on time.
Why 3: The warehouse management system frequently shows incorrect stock levels.
Why 4: The stock sync from the ERP to the WMS runs every 24 hours.
Why 5: No real-time integration was built between the ERP and WMS when the WMS was implemented.

Root cause: missing real-time ERP-WMS integration.
Stated problem: customer complaints about late orders.
Wrong solution: better customer communication (treats the symptom, not the cause).

Stop when you reach a systemic cause — a structural, technical, or process issue that if fixed would eliminate the problem. If the next "why" points outside the project scope, you have found a systemic cause.

THE FISHBONE (ISHIKAWA) DIAGRAM

A fishbone diagram organises potential root causes into six categories:
- People: skill gaps, training, staffing
- Process: inadequate procedures, missing controls, unclear ownership
- Technology: system limitations, integration gaps, data quality
- Data: inaccurate, incomplete, untimely information
- Environment: organisational culture, incentive misalignment, governance
- Materials: vendor quality, physical constraints

Use the fishbone when there are multiple contributing causes and you need to identify which is primary.

WEAK SIGNAL DETECTION

Root cause analysis works when the problem has already manifested. Weak signal detection identifies problems before they become crises.

Signals to watch:
- Process workarounds that are becoming normalised ("we always do it this way")
- Increasing exception rates that no one is tracking
- Recurring manual corrections to automated system outputs
- Stakeholders describing themselves as "managing" a problem rather than solving it
- Escalation patterns: the same issue being escalated repeatedly without resolution

When you detect a weak signal, document it, quantify it where possible, and surface it explicitly in your analysis.

DELIVERABLE: Root-Cause Brief
For any problem you are analysing, apply the 5 Whys. Document: stated problem, 5 why chain, root cause identified, evidence for root cause, and recommendation for what the analysis should focus on.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Eliciting from Difficult & Executive Stakeholders
  UPDATE public.videos SET
    description = 'The stakeholders who hold the most valuable information are often the hardest to elicit from: executives who have 15 minutes for you, hostile SMEs who feel threatened by the analysis, and subject matter experts who know so much they cannot explain it simply. This lesson teaches the techniques that work when standard elicitation approaches fail.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Eliciting from Difficult & Executive Stakeholders',
      'description', 'The most valuable information lives with the hardest stakeholders to elicit from. This lesson covers techniques for time-constrained executives, hostile SMEs, and experts who cannot explain what they know.',
      'transcript', 'ELICITING FROM DIFFICULT & EXECUTIVE STAKEHOLDERS

THE HARDEST ELICITATION CHALLENGES

1. THE TIME-CONSTRAINED EXECUTIVE
Problem: 15 minutes, no pre-reading done, frequently interrupted.
Wrong approach: open-ended questions that require extended reflection.
Right approach: the pre-framed decision question.

Before the meeting, identify the single most important question you need this executive to answer. Frame it as a concrete choice: "Given what I''ve found, I believe we should do X rather than Y. Do you agree, or do you see a reason to go a different direction?"

This respects their time, gives them a decision to make (not a lecture to sit through), and surfaces their real position quickly.

2. THE HOSTILE SME
Problem: the SME feels threatened by the analysis (fear of being replaced, automated, or criticised) and withholds information or obstructs the process.
Wrong approach: pushing harder.
Right approach: repositioning the analysis as something that protects and elevates them.

"I want to document your knowledge so it can be captured and protected in the new system. Your expertise is the most valuable thing we''re trying to preserve. Without your input, we''ll get it wrong."

This reframe changes the dynamic. The SME goes from resisting to contributing.

3. THE EXPERT WHO CANNOT ARTICULATE
Problem: the expert knows the domain so deeply that they cannot explain it at the level a BA needs. They skip steps because they are obvious (to them). They use jargon without realising it.
Wrong approach: asking them to "explain it simply."
Right approach: think-aloud protocol.

"Rather than explaining it to me, could you do the task while I watch and say out loud what you''re thinking as you go? I''ll ask questions when I don''t understand something."

The think-aloud protocol externalises implicit knowledge. It produces far richer data than any interview.

4. THE DOMINANT STAKEHOLDER WHO SPEAKS FOR EVERYONE
Problem: one stakeholder dominates the workshop, suppressing minority views.
Wrong approach: challenging them directly in the room.
Right approach: anonymous pre-work + structured turn-taking.

Before the workshop, collect input anonymously (survey, sticky notes). In the workshop, present the aggregated themes without attribution. Then use a structured turn-taking approach: "I''d like to hear from each person in turn before we open the floor."

This surfaces minority views without confrontation.

5. THE STAKEHOLDER WITH NO IDEA WHAT THEY WANT
Problem: the stakeholder knows they have a problem but cannot articulate the solution.
Wrong approach: open-ended requirements questions.
Right approach: prototyping + reaction elicitation.

Show them something — a rough wireframe, a process sketch, a data model — and ask them to react: "What is right about this? What is wrong? What is missing?"

People are far better at evaluating concrete examples than generating abstract requirements.

DELIVERABLE: Elicitation Evidence Pack
Document the most difficult elicitation challenge you have faced (or anticipate facing) in your current engagement. Identify the type, the technique you will apply, and the output you expect to produce.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 5 — Facilitation & Workshop Leadership  (OFFSET 4, order_index = 5)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 4;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M5 chapter not found'; END IF;

  -- Lesson 1: Facilitation Foundations & Safety
  UPDATE public.videos SET
    description = 'Facilitation is the art of guiding a group to a shared outcome without imposing your own. The most critical facilitator skill is not process — it is creating the psychological safety that allows honest, high-quality input. This lesson teaches the foundations: neutrality, safety, participation equity, and the five moves every great facilitator makes.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Facilitation Foundations & Safety',
      'description', 'Facilitation is guiding a group to a shared outcome without imposing your own view. This lesson teaches the foundations: neutrality, psychological safety, participation equity, and the five moves every great facilitator makes.',
      'transcript', 'FACILITATION FOUNDATIONS & SAFETY

THE FACILITATOR''S ROLE

A facilitator is not a presenter, teacher, or decision-maker. A facilitator:
- Designs and manages the process (not the content)
- Ensures all voices are heard (not just the loudest)
- Keeps the group focused on the objective (not the tangents)
- Surfaces and resolves process breakdowns (not content disagreements)
- Creates the conditions for the group to reach its own conclusions

The facilitator''s neutrality is their most valuable asset. The moment you advocate for a specific outcome, you lose it.

PSYCHOLOGICAL SAFETY

Amy Edmondson''s research shows that psychological safety — the belief that one can speak up without punishment — is the single most important predictor of team performance.

In a workshop context, psychological safety means:
- Participants believe there are no "wrong" answers to exploratory questions
- Minority views can be expressed without career risk
- Challenge to authority is acceptable (within norms)
- Mistakes are learning opportunities, not evidence of incompetence

CREATING SAFETY: THE OPENING RITUAL

The opening of a workshop sets the psychological contract for everything that follows.

A strong opening includes:
1. A clear statement of purpose: "Today we are here to map the current state of the onboarding process — not to evaluate anyone''s past decisions."
2. Working agreements: co-created norms for the session ("one voice at a time," "challenge ideas not people," "phones down")
3. A low-stakes warm-up activity: something that gets everyone talking before the stakes are high

PARTICIPATION EQUITY

In unstructured discussions, 20% of participants produce 80% of the content. This is not because the other 80% have nothing to say — it is because the speaking opportunity is captured by the confident, senior, or extroverted.

Techniques for participation equity:
- Round-robins: structured turn-taking where every voice is heard in sequence
- Silent brainstorming: individuals write ideas before sharing (prevents anchoring on the first idea)
- Anonymous contributions: sticky notes, digital boards, surveys
- Breakout groups: smaller groups where quieter participants engage more freely

THE FIVE FACILITATOR MOVES

1. ANCHOR: link the current activity to the session objective ("We''re doing this because...")
2. PROBE: draw out more depth ("Say more about that. What would make that worse?")
3. REFLECT: play back what you heard without interpreting ("I''m hearing that the biggest concern is X. Did I get that right?")
4. REDIRECT: bring the group back to focus ("That''s important — let''s capture it on the parking lot and come back to it.")
5. SYNTHESISE: pull threads together ("What I''m seeing across all of these inputs is three themes...")

DELIVERABLE: Facilitation Playbook
Write a one-page Facilitation Playbook for your next workshop. Include: session objective, working agreements, participation equity technique, three core facilitator moves you will use, and how you will close the session.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Discovery Workshops & Story Mapping
  UPDATE public.videos SET
    description = 'Story mapping is one of the most powerful collaborative tools in the BA toolkit: it simultaneously surfaces the user journey, organises requirements by value, and creates a shared visual language between business and development. This lesson teaches you to run a story mapping session from preparation through to a prioritised backlog that the team can actually build from.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Discovery Workshops & Story Mapping',
      'description', 'Story mapping surfaces the user journey, organises requirements by value, and creates a shared visual language between business and development. This lesson covers running a story mapping session from preparation to a prioritised backlog.',
      'transcript', 'DISCOVERY WORKSHOPS & STORY MAPPING

WHAT STORY MAPPING SOLVES

The traditional requirements list has a fundamental flaw: it loses context. A list of 200 user stories tells you what to build but not why it matters in the user''s experience, or what happens if you only build half.

User story mapping (Jeff Patton) organises requirements in two dimensions:
- Horizontal axis: the user journey (time sequence of activities)
- Vertical axis: priority (what is the minimum viable version?)

This creates a visual map that:
- Shows the end-to-end user experience at a glance
- Makes trade-off conversations concrete and visual
- Identifies MVP scope before any coding begins
- Creates shared understanding between business and development

THE STORY MAP STRUCTURE

Row 1 — ACTIVITIES: the high-level phases of the user journey ("Discover," "Sign up," "Set up," "Use," "Get support")
Row 2 — USER TASKS: the specific tasks within each activity ("Search for a course," "Compare options," "Create account," "Enter payment details")
Row 3+ — STORIES: the detailed user stories that deliver each task, arranged by priority (most important at the top, nice-to-have at the bottom)

A horizontal line across the map marks the MVP boundary: everything above the line is in the first release.

RUNNING THE STORY MAPPING SESSION

PREPARATION (before the session):
- Identify the user persona(s) the map will follow
- Pre-populate a skeleton journey (activities and some tasks) as a starting point
- Prepare blank sticky notes and markers (physical) or a digital board (Miro/Mural)

PHASE 1 — MAP THE JOURNEY (30–45 min)
"Walk me through what the user does from the moment they first encounter this product to the moment their goal is achieved."
Build the activity row collaboratively. Add user tasks beneath each activity.

PHASE 2 — ADD THE STORIES (30–45 min)
For each user task, ask: "What specifically does the user need to be able to do?"
Add stories beneath the tasks. Do not write them in full — capture the idea (you can write them up later).

PHASE 3 — IDENTIFY THE MVP (20–30 min)
"If we could only ship the minimum that delivers real value, which tasks are essential?"
Draw a line. Everything above is Release 1. Everything below is later.

PHASE 4 — IDENTIFY RISKS AND UNKNOWNS (15 min)
"What assumptions are baked into this map? What do we not know that could break it?"
Add assumption cards in a different colour.

DELIVERABLE: Story Map
Run (or simulate) a story mapping session for one user journey relevant to your engagement. Produce a digital or photo-documented story map with activities, tasks, stories, and a marked MVP boundary.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: Event Storming for Process Discovery
  UPDATE public.videos SET
    description = 'Event storming is a rapid collaborative modelling technique that can map a complex business domain in hours instead of weeks. It replaces the months-long requirements gathering approach with a structured workshop that surfaces domain events, commands, aggregates, and bounded contexts — producing a shared model that both business and technical stakeholders can act on.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Event Storming for Process Discovery',
      'description', 'Event storming maps a complex business domain in hours, not weeks. This lesson covers the workshop format that surfaces domain events, commands, and bounded contexts — producing a model both business and technical stakeholders can act on.',
      'transcript', 'EVENT STORMING FOR PROCESS DISCOVERY

WHAT IS EVENT STORMING?

Event Storming (Alberto Brandolini) is a collaborative workshop technique for rapidly exploring complex business domains. It uses a wall of sticky notes to map everything that happens in a business process — from the business event level down to the technical system events.

It is faster than traditional process modelling because:
- It engages business experts directly (no BA translating)
- It surfaces the "unhappy paths" (exceptions and failures) that documents never capture
- It produces a shared model that both business and technical stakeholders recognise

THE COLOUR CODING SYSTEM

Orange sticky: DOMAIN EVENT — something that happened ("Order placed," "Payment failed," "Customer notified")
Blue sticky: COMMAND — the action that triggered the event ("Place order," "Process payment," "Send notification")
Yellow sticky: ACTOR / PERSON — who triggered the command ("Customer," "System," "Finance team")
Pink sticky: EXTERNAL SYSTEM — systems outside the bounded context
Purple sticky: POLICY / RULE — a business rule that triggers a command when an event occurs
Green sticky: READ MODEL / VIEW — information the actor needs to make a decision

THE THREE EVENT STORMING FORMATS

1. BIG PICTURE EVENT STORM (3–4 hours)
Purpose: map the entire business domain at high level
Output: a shared understanding of where the business events flow and where the pain points are
Participants: mixed group of business stakeholders and technical architects

2. PROCESS LEVEL EVENT STORM (2–3 hours)
Purpose: go deeper on one business process
Output: a detailed model of commands, events, actors, policies, and systems
Participants: domain experts + technical team for the target area

3. DESIGN LEVEL EVENT STORM (2–3 hours)
Purpose: design the technical model (aggregates, bounded contexts)
Output: a domain model ready for development
Participants: technical team primarily

FOR THE BA: USING BIG PICTURE FORMAT

Step 1 — GENERATE EVENTS (20 min, silent)
Each participant writes business events on orange stickies. No discussion. No filtering.
Prompt: "What happens in the [claims processing / order fulfilment / customer onboarding] process?"

Step 2 — TIMELINE (30 min)
As a group, arrange events in roughly chronological order on the wall. Duplicates are fine — keep them, they indicate emphasis.

Step 3 — FIND THE HOTSPOTS (20 min)
Mark with red stickies: events that are painful, slow, frequently wrong, or causes of downstream problems.

Step 4 — COMMANDS & ACTORS (30 min)
For each event, add: what command triggered it, and who issued the command.

Step 5 — POLICIES (20 min)
Add pink stickies for business rules: "When [event] happens, [command] is triggered."

Step 6 — BOUNDED CONTEXTS (20 min)
Draw lines around clusters of events that belong to the same business subdomain.

DELIVERABLE: Event-Storm Artifact
Run a 60-minute mini Event Storm for one process in your engagement scope. Produce a documented artifact: photographed or digital wall, list of hotspots identified, and three key insights for requirements.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Prioritization & Conflict Workshops
  UPDATE public.videos SET
    description = 'Prioritisation is the most politically charged thing a BA facilitates. Everyone''s requirements are the most important. This lesson teaches the facilitation techniques that make prioritisation transparent, defensible, and stakeholder-owned: MoSCoW, weighted scoring, value vs. effort mapping, and the conflict workshop format for when stakeholders cannot agree.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Prioritization & Conflict Workshops',
      'description', 'Prioritisation is the most politically charged thing a BA facilitates. This lesson covers MoSCoW, weighted scoring, value vs. effort mapping, and the conflict workshop format for when stakeholders cannot agree.',
      'transcript', 'PRIORITIZATION & CONFLICT WORKSHOPS

WHY PRIORITISATION IS HARD

Every stakeholder believes their requirements are the most important. They are not wrong — from their perspective, they are. The problem is that resources are finite and every item cannot be priority 1.

The BA who can facilitate a genuine prioritisation conversation — one that stakeholders accept as fair — is worth far more than the BA who produces a requirements list without one.

THE FOUR PRIORITISATION TECHNIQUES

1. MOSCOW (Must/Should/Could/Won''t)
Simple, fast, and widely understood.
- MUST: non-negotiable. The product will fail without it.
- SHOULD: important but not critical. It will be missed if absent.
- COULD: desirable but can be deferred.
- WON''T: explicitly out of scope for this release.

Best for: small to medium backlogs, tight timeframes.
Risk: stakeholders classify everything as MUST. Enforce a limit: maximum 60% of scope can be MUST.

2. WEIGHTED SCORING
Assign scores to each requirement based on multiple criteria:
- Business value (1–5)
- Implementation complexity (1–5, inverted — lower complexity = higher score)
- Risk reduction (1–5)
- Strategic alignment (1–5)

Multiply and rank. The highest-scoring requirements are prioritised first.
Best for: complex backlogs where multiple stakeholders have competing priorities.
Risk: the weighting itself becomes political. Agree on weights before scoring.

3. VALUE VS. EFFORT MATRIX
Plot requirements on a 2×2 grid:
- High value / Low effort → QUICK WINS (do first)
- High value / High effort → STRATEGIC BETS (plan and schedule)
- Low value / Low effort → FILL-INS (if bandwidth exists)
- Low value / High effort → MONEY PITS (deprioritise or cut)

Best for: visual communication with executives, MVP scope decisions.

4. COST OF DELAY
For each requirement, estimate: what is the cost (revenue lost, risk not mitigated, efficiency foregone) of delaying this item by one month?
The item with the highest cost of delay is always prioritised first.
Best for: product roadmap decisions, investment prioritisation.

RUNNING A CONFLICT WORKSHOP

When stakeholders cannot agree on prioritisation, the conflict is usually one of three things:
a) Different value frameworks (one stakeholder is maximising revenue; another is minimising risk)
b) Different information (stakeholders are working from different data or assumptions)
c) Different authority levels (one stakeholder does not feel empowered to deprioritise their own requirements)

Resolution:
a) Make the value framework explicit. "Are we optimising for revenue, risk, or customer satisfaction — or all three? What is the priority order?"
b) Agree on the data. "Let''s agree on a shared fact base before we score."
c) Escalate authority. "This decision needs the sponsor to confirm which business objective takes precedence."

DELIVERABLE: Workshop Outcomes Log
Run a prioritisation exercise for any requirement set you have. Document: technique used, criteria agreed, scoring results, and any conflicts that arose with how they were resolved.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Executive Decision Forums & Multi-Team Facilitation
  UPDATE public.videos SET
    description = 'The most complex facilitation challenge is the executive decision forum: multiple senior stakeholders with competing priorities, political undercurrents, and a high-stakes decision to make in 90 minutes. This lesson teaches the preparation, agenda design, and in-room facilitation tactics that make executive forums produce decisions — not deferrals.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Executive Decision Forums & Multi-Team Facilitation',
      'description', 'The executive decision forum is the hardest facilitation challenge: multiple senior stakeholders, competing priorities, and a high-stakes decision in 90 minutes. This lesson covers preparation, agenda design, and tactics that produce decisions, not deferrals.',
      'transcript', 'EXECUTIVE DECISION FORUMS & MULTI-TEAM FACILITATION

THE EXECUTIVE DECISION FORUM

An executive decision forum is a structured session designed to produce one or more concrete decisions from a group of senior stakeholders who would not otherwise reach agreement in an unstructured discussion.

It is NOT a status update, a presentation, or a consensus-building session. It is a decision machine. Every element of the design serves that purpose.

PRE-FORUM PREPARATION (the work that determines the outcome)

1. IDENTIFY THE DECISIONS
Work with the meeting chair to identify the exact decisions that must be made. Be specific: not "discuss the transformation roadmap" but "decide between Strategy A and Strategy B for the Phase 1 scope."

2. PRE-BRIEF EVERY KEY STAKEHOLDER
Meet individually with every high-power stakeholder before the forum. Understand their position. Surface objections early. Give them the opportunity to shape the recommendation before the room.
Rule: no power stakeholder should be surprised in the forum.

3. DESIGN THE DECISION BRIEF
For each decision, produce a one-page brief (SCQ structure):
- Situation: current state
- Complication: why a decision is needed now
- Question: the specific decision
- Recommendation: your position (clearly stated)
- Supporting evidence: 3–5 bullets
- Trade-offs: what you are giving up with this recommendation
- Next steps: what happens if they decide yes

4. CIRCULATE IN ADVANCE
Send materials 24 hours before. If executives have not read them, the forum will be spent presenting — not deciding.

AGENDA DESIGN

A 90-minute executive decision forum agenda:
- 0:00 — 0:05: Context setting (facilitator frames the purpose and the decisions)
- 0:05 — 0:25: Decision 1 (5 min Q&A, 5 min deliberation, 5 min decision)
- 0:25 — 0:45: Decision 2
- 0:45 — 0:65: Decision 3
- 0:65 — 0:80: Dependencies and risks arising from the decisions
- 0:80 — 0:90: Next steps, owners, dates, and confirmation

MULTI-TEAM FACILITATION

When multiple teams are involved (a programme board, a cross-functional transformation forum), add:
- A pre-session alignment meeting with team leads to surface cross-team conflicts before the forum
- A structured conflict resolution protocol for when teams have competing requirements
- A clearly defined decision authority matrix: who can decide what without escalation

THE PARKING LOT PROTOCOL

In any executive session, topics will arise that are important but not on the agenda. If you allow them to derail the session, you will run out of time and produce no decisions.

The parking lot: a visible list of items to be addressed after the session or in a follow-up. When a topic surfaces that is not on the agenda: "That''s an important point. I''m going to add it to the parking lot so we capture it — let''s make sure it''s addressed in a follow-up. For now, I''d like to stay focused on [the agenda item]."

DELIVERABLE: Decision Forum Pack
Design a 90-minute executive decision forum for one pending decision in your engagement. Include: pre-brief list, agenda, one-page decision brief (SCQ), and a parking lot template.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 6 — Requirements Engineering  (OFFSET 5, order_index = 6)
-- ══════════════════════════════════════════════════════════════════════════════

  SELECT id INTO v_ch FROM public.chapters
  WHERE course_id = v_ba_id ORDER BY order_index LIMIT 1 OFFSET 5;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M6 chapter not found'; END IF;

  -- Lesson 1: Requirements Types & Quality
  UPDATE public.videos SET
    description = 'Not all requirements are the same. Business requirements, stakeholder requirements, solution requirements, and transition requirements each serve a different purpose and need to be managed differently. And bad requirements — ambiguous, incomplete, untestable, or unverifiable — are one of the leading causes of project failure. This lesson maps the taxonomy and teaches the quality criteria every requirement must meet.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Requirements Types & Quality',
      'description', 'Business, stakeholder, solution, and transition requirements each serve different purposes. This lesson maps the taxonomy and teaches the quality criteria every requirement must meet to be useful.',
      'transcript', 'REQUIREMENTS TYPES & QUALITY

THE REQUIREMENTS HIERARCHY

Requirements exist at four levels of abstraction, each serving a different audience:

LEVEL 1 — BUSINESS REQUIREMENTS
What: The business outcomes and objectives the solution must achieve.
Who reads them: Executives, sponsors, programme managers.
Example: "Reduce customer onboarding time from 5 days to 1 day to support a 40% increase in new customer acquisition."
Note: Business requirements describe WHY — they do not describe the solution.

LEVEL 2 — STAKEHOLDER REQUIREMENTS
What: What stakeholders need from the solution to achieve the business requirements.
Who reads them: Business stakeholders, department heads, process owners.
Example: "As a new customer, I need to complete my identity verification in under 10 minutes from my mobile device."
Note: Stakeholder requirements describe the experience — not the technology.

LEVEL 3 — SOLUTION REQUIREMENTS
What: The specific capabilities the solution must have.
Subdivided into:
- Functional requirements: what the system must do ("The system shall allow users to upload identity documents in JPEG or PDF format.")
- Non-functional requirements: how the system must perform ("The identity verification API shall respond within 3 seconds for 99% of requests.")
Who reads them: Development teams, architects, testers.

LEVEL 4 — TRANSITION REQUIREMENTS
What: What is needed to move from the current state to the future state.
Example: "All existing customers must have their legacy accounts migrated to the new system within 60 days of go-live."
Who reads them: Operations, change management, training teams.

THE REQUIREMENTS QUALITY CRITERIA (SMART+C)

SPECIFIC: unambiguous, with no room for interpretation
Bad: "The system should be fast."
Good: "The system shall load the dashboard in under 2 seconds for 95% of users."

MEASURABLE: testable — there is a clear pass/fail condition
Bad: "The system should be user-friendly."
Good: "80% of users shall complete the onboarding flow without assistance in a usability test."

ACHIEVABLE: technically and commercially feasible
Bad: "The AI shall predict customer behaviour with 100% accuracy."
Good: "The AI shall predict customer churn with ≥ 85% precision on the validation dataset."

RELEVANT: traces to a business requirement (no orphaned requirements)

TESTABLE: can be verified through testing, inspection, or demonstration

CONSISTENT: does not conflict with another requirement

COMPLETE: includes all necessary information (no missing fields, edge cases, or conditions)

THE REQUIREMENTS QUALITY CHECKLIST

Before finalising any requirement:
☐ Is it specific enough that two developers would implement it the same way?
☐ Is there a clear test that would pass or fail?
☐ Does it trace to a business requirement or stakeholder requirement?
☐ Does it conflict with any other requirement?
☐ Are all edge cases and exceptions identified?

DELIVERABLE: Requirements Quality Checklist
Take 5 requirements from any project you are working on. Apply the SMART+C criteria to each. Identify which criteria they fail and rewrite them to pass.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

  -- Lesson 2: Analysis & Specification
  UPDATE public.videos SET
    description = 'Collecting requirements is not the same as analysing them. Analysis means interrogating the requirements for completeness, consistency, feasibility, and clarity — and resolving the conflicts and gaps before handing off to development. This lesson teaches the specification process: from raw elicited information to a structured, reviewed, and approved requirements specification.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Analysis & Specification',
      'description', 'Collecting requirements is not the same as analysing them. This lesson covers the specification process: from raw elicited information to a structured, reviewed, and approved requirements specification.',
      'transcript', 'ANALYSIS & SPECIFICATION

THE GAP BETWEEN ELICITATION AND SPECIFICATION

Elicitation gives you raw material: stakeholder statements, workshop outputs, observation findings, and survey data. This raw material is not requirements — it is input to requirements.

Analysis transforms raw input into verified, structured requirements by:
1. Resolving ambiguities and conflicts
2. Filling gaps (what was not said that needs to be said)
3. Identifying implicit assumptions (things stakeholders take for granted)
4. Structuring requirements into appropriate categories
5. Verifying that requirements trace to business objectives

THE ANALYSIS PROCESS

STEP 1 — ORGANISE
Group raw inputs by theme, process area, or requirement type. Identify duplicate or similar statements that can be consolidated.

STEP 2 — CLASSIFY
Assign each item to a requirement type (business, stakeholder, functional, non-functional, transition). This determines what level of detail and formality is needed.

STEP 3 — VALIDATE
For each requirement candidate, ask:
- Is this the right requirement? (Does it trace to a business objective?)
- Is this a requirement or a solution? (Requirements state WHAT; solutions state HOW)
- Is this within scope?
- Is this feasible?

STEP 4 — RESOLVE CONFLICTS
When two requirements conflict, you cannot simply pick one. The conflict must be escalated to the appropriate stakeholder who owns both domains and has the authority to adjudicate.

STEP 5 — FILL GAPS
Apply the "what happens when...?" test to every process flow. Edge cases and exceptions are almost always missing from elicited requirements.

THE REQUIREMENTS SPECIFICATION DOCUMENT

A well-structured specification contains:
1. Introduction and purpose
2. Business context and objectives
3. Scope (what is in, what is explicitly out)
4. Stakeholder requirements
5. Functional requirements (numbered, with acceptance criteria)
6. Non-functional requirements (performance, security, availability, etc.)
7. Transition requirements
8. Assumptions and dependencies
9. Out of scope
10. Appendices (data dictionaries, interface specifications, reference documents)

AI IN THE SPECIFICATION PROCESS

Use AI to:
- Generate first-draft acceptance criteria from user story descriptions
- Check requirements for SMART+C compliance
- Identify potential conflicts between requirement sets
- Produce a data dictionary from a set of field-level requirements

Always review AI output: AI will miss domain-specific context, implicit business rules, and political constraints.

DELIVERABLE: Requirements Specification
Produce a requirements specification (or a specification section) for a scope of work in your current engagement. Include at minimum: 5 functional requirements with acceptance criteria, 3 non-functional requirements, and 2 transition requirements.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

  -- Lesson 3: User Stories & Acceptance Criteria
  UPDATE public.videos SET
    description = 'User stories are the most widely used and most widely misunderstood requirements format in Agile. A well-written user story is not a sentence in a template — it is a placeholder for a conversation, with acceptance criteria that make the conversation unnecessary at implementation time. This lesson teaches you to write stories and criteria that developers can build from and testers can verify without chasing the BA.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'User Stories & Acceptance Criteria',
      'description', 'A well-written user story is a placeholder for a conversation, with acceptance criteria that make further clarification unnecessary at implementation time. This lesson teaches stories and criteria that developers can build from without chasing the BA.',
      'transcript', 'USER STORIES & ACCEPTANCE CRITERIA

THE USER STORY FORMAT

A user story is written as:
"As a [persona], I want to [action], so that [outcome/benefit]."

The three parts serve different purposes:
- As a [persona]: who is the user? Be specific. "As a customer" is weaker than "As a first-time customer completing their first purchase."
- I want to [action]: what does the user want to be able to do? State the action, not the feature.
- So that [outcome]: why does the user want to do this? This is the most important part — and the one most often skipped.

THE INVEST CRITERIA

A well-formed user story satisfies INVEST:

INDEPENDENT: can be developed and delivered separately from other stories
NEGOTIABLE: the details can be discussed and adjusted — the story is not a contract
VALUABLE: it delivers value to the user (not just an internal technical step)
ESTIMABLE: the team can estimate it with enough certainty to plan
SMALL: fits within a single Sprint
TESTABLE: there are clear acceptance criteria that define done

The most common INVEST failure: stories that are not independent (they depend on another story being done first) or not small (they are really epics containing 10 stories).

ACCEPTANCE CRITERIA

Acceptance criteria define when a story is done — precisely enough that a tester can verify it without asking the BA.

THREE FORMATS:

1. GIVEN/WHEN/THEN (Gherkin)
Given [precondition], when [action], then [expected result].
"Given a customer with a valid account, when they request a password reset, then they receive a reset email within 2 minutes."

2. RULE-BASED
A list of business rules the implementation must satisfy.
"The discount must be: 10% for orders over $100, 15% for orders over $200, 20% for orders over $500."

3. CHECKLIST
A list of conditions that must all be true for the story to be accepted.
"☐ Customer can upload JPEG, PNG, and PDF files. ☐ File size limit is 5MB with an error message for oversized files. ☐ Upload confirmation displays filename and timestamp."

AI-SPECIFIC ACCEPTANCE CRITERIA

For AI features, acceptance criteria must include:
- Accuracy thresholds: "The model shall classify with ≥ 90% precision on the test set."
- Fairness constraints: "The false positive rate shall not differ by more than 5% across demographic groups."
- Fallback behaviour: "When model confidence is below 0.7, the system shall route to manual review."
- Explainability: "For each AI decision above $1,000 in impact, the system shall produce a plain-language explanation."

SPLITTING STORIES

When a story is too large for one Sprint, split it by:
- Workflow step: one story per step in the process
- Data variation: different stories for different data types or categories
- User type: different stories for different personas
- Happy path / unhappy path: one story for the main flow, one for each exception
- Acceptance criteria: if a story has 8 acceptance criteria, consider whether it should be two stories

DELIVERABLE: Backlog + Acceptance Criteria
Write 5 user stories for your current engagement. Apply INVEST to each. Write acceptance criteria (Gherkin format) for each story. Identify at least one story that needs an AI-specific acceptance criterion.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

  -- Lesson 4: Traceability & Lifecycle Management
  UPDATE public.videos SET
    description = 'Traceability is the ability to follow a requirement from its origin (a business objective) through to its implementation (a test case) and verify that it was delivered. Without traceability, scope creep is invisible, impact analysis is guesswork, and compliance audits are nightmares. This lesson teaches traceability as a living management tool, not a bureaucratic artefact.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Traceability & Lifecycle Management',
      'description', 'Traceability follows a requirement from its business objective through to a test case. Without it, scope creep is invisible and impact analysis is guesswork. This lesson teaches traceability as a living management tool.',
      'transcript', 'TRACEABILITY & LIFECYCLE MANAGEMENT

WHY TRACEABILITY MATTERS

Two real project scenarios:

Scenario 1: The change request
A stakeholder requests a change to requirement #47. Without traceability, you have no idea how many other requirements depend on #47, what test cases cover it, or what design decisions were made to satisfy it. You implement the change and break three other requirements you did not know were connected.

Scenario 2: The compliance audit
A regulator asks: "Show me how the system satisfies regulation clause 12.4.3(b)." Without traceability, you are searching through 200 requirements, 500 test cases, and a year''s worth of meeting notes.

Traceability makes both scenarios manageable.

THE REQUIREMENTS TRACEABILITY MATRIX (RTM)

The RTM is a table that links:
Business Requirement → Stakeholder Requirement → Functional Requirement → Test Case

Each row shows: where a requirement came from, what it became, and how it was tested.

A minimal RTM:
| Req ID | Requirement text | Source | Linked to | Test ID | Status |
| FR-01 | The system shall... | Workshop 3, 14 Jun | BR-02 | TC-04 | Passed |

TRACEABILITY DIRECTIONS

Forward traceability: from business requirement to test case
Used for: coverage analysis ("Has this business requirement been fully implemented and tested?")

Backward traceability: from test case to business requirement
Used for: impact analysis ("If this requirement changes, what tests need to be rerun?")

THE REQUIREMENTS LIFECYCLE

A requirement does not simply move from "draft" to "approved." It has a lifecycle:

ELICITED → SPECIFIED → VALIDATED → BASELINED → IMPLEMENTED → VERIFIED → CLOSED

Key transitions:
- BASELINED: the requirement has been formally approved and is under change control. Changes after baselining require a change request.
- IMPLEMENTED: development is complete, but it has not yet been verified against the original requirement.
- VERIFIED: testing has confirmed the implementation meets the acceptance criteria.

MANAGING CHANGE

No requirements baseline survives first contact with delivery. Changes will come. The BA''s job is to manage them — not prevent them.

For every change request, document:
- What is changing and why
- Impact on: other requirements, schedule, cost, risk
- Who approved the change and when
- What was re-baselined

TOOLS FOR TRACEABILITY

Simple: Excel or Google Sheets (RTM as a spreadsheet)
Intermediate: Jira with requirement hierarchy (Epic → Story → Test) and labels
Advanced: Dedicated tools (Confluence, Azure DevOps, DOORS, Polarion)

DELIVERABLE: Requirements Traceability Matrix
Build a minimal RTM for your current engagement. Include: 5 business requirements, their linked functional requirements, and their test cases. Identify any functional requirements that do not trace to a business requirement (orphaned requirements).'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- Lesson 5: Conflicting Requirements & Resolution
  UPDATE public.videos SET
    description = 'Requirements conflicts are inevitable. Two stakeholders want incompatible things. A regulatory requirement contradicts a usability goal. A performance requirement is infeasible given the budget. This lesson teaches the conflict resolution framework: how to identify the type of conflict, select the resolution strategy, and close the conflict with a documented decision — not an unresolved ambiguity buried in the backlog.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Conflicting Requirements & Resolution',
      'description', 'Requirements conflicts are inevitable. This lesson teaches the framework for identifying conflict types, selecting resolution strategies, and closing conflicts with documented decisions — not unresolved ambiguities buried in the backlog.',
      'transcript', 'CONFLICTING REQUIREMENTS & RESOLUTION

WHY CONFLICTS MUST BE RESOLVED BEFORE DEVELOPMENT

An unresolved requirements conflict that reaches development becomes:
- A team that has to make an architectural decision it is not equipped to make
- A feature that satisfies neither stakeholder because the developer guessed
- A project that is delayed when the conflict resurfaces at user acceptance testing

The BA''s job is to resolve requirements conflicts before development starts — not to pass them forward.

THE FOUR TYPES OF REQUIREMENTS CONFLICT

1. PRIORITY CONFLICT
Two stakeholders want different things prioritised in the same release.
Resolution: value-based prioritisation (cost of delay, business impact) escalated to the decision authority.

2. SCOPE CONFLICT
One stakeholder believes something is in scope; another believes it is out.
Resolution: trace both positions back to the business requirements. Scope decisions are made at the highest level where both business requirements originate. Escalate to the programme sponsor if needed.

3. CONTRADICTION CONFLICT
Two requirements cannot both be true:
"The system must be accessible offline" and "The system must sync data in real time."
Resolution: surface both constraints explicitly. Bring both stakeholders together with the technical architect. Either find a technical solution (offline-first with background sync), or make a documented trade-off decision.

4. FEASIBILITY CONFLICT
A requirement is technically or commercially infeasible:
"The system must respond in under 50 milliseconds globally."
Resolution: replace with a negotiated threshold based on technical assessment. Document the original requirement, the reason it was changed, and the agreed replacement.

THE CONFLICT RESOLUTION FRAMEWORK

Step 1: DOCUMENT the conflict precisely
"Requirement FR-42 states X. Requirement FR-67 states Y. These cannot both be satisfied simultaneously."

Step 2: IDENTIFY the type
Priority / Scope / Contradiction / Feasibility

Step 3: IDENTIFY the resolution authority
Who has the authority to make this trade-off decision? (Business domain owner, programme sponsor, technical architect?)

Step 4: PRESENT the options with consequences
Never go to the resolution authority with just the problem. Go with 2–3 options and the consequence of each.

Step 5: DOCUMENT the decision
"On [date], [stakeholder] decided to [option], accepting [consequence]. This decision supersedes FR-42."

Step 6: UPDATE the requirements baseline

THE BA''S ROLE IN CONFLICT RESOLUTION

The BA is the neutral party. Your job is to:
- Surface the conflict clearly (not take a side)
- Present options fairly (including the option neither stakeholder initially proposed)
- Ensure the decision is documented (so it cannot be disputed later)
- Update the RTM to reflect the resolution

DELIVERABLE: Requirements Package draft
Compile your requirements from this module (quality checklist, specification, user stories, RTM) into a cohesive Requirements Package. Identify any open conflicts and document your planned resolution approach.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

END $$;

-- =============================================================================
-- VERIFY (run immediately after applying)
-- Expected: modules 4, 5, 6 each show filled=5
-- =============================================================================
SELECT
  c.order_index AS module,
  c.title       AS chapter,
  COUNT(*) FILTER (
    WHERE v.translations->'en'->>'transcript' IS NOT NULL
      AND v.translations->'en'->>'transcript' <> ''
  )             AS filled
FROM public.videos v
JOIN public.chapters c ON c.id = v.chapter_id
JOIN public.courses  co ON co.id = c.course_id
WHERE co.curriculum_version = 'ba-v1'
  AND c.order_index IN (4, 5, 6)
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
