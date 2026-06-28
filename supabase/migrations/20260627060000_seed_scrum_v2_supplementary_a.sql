-- =============================================================================
-- Seed SUPPLEMENTARY lesson content (order_index 4-8) for Scrum v2
-- Covers chapter OFFSETs 1-8 (Modules 2-9)
--
-- These lessons are the deep-dive / Scrum Guide reference lessons
-- that were missing transcripts after the core lessons (order_index 0-3)
-- were seeded in the earlier migrations.
--
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================

DO $$
DECLARE
  v_course_id UUID := 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';
  v_ch UUID;
BEGIN

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 2 — The Scrum Master Role & Servant Leadership (OFFSET 1)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 1;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 2 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Scrum Guide — The Scrum Master
  UPDATE videos SET
    description = 'The Scrum Guide defines the Scrum Master accountability precisely. This lesson extracts and explains the key text: what the Scrum Master is accountable for, how the SM serves the team, the PO, and the organization, and why the language of "accountability" rather than "role" matters for how you show up.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scrum Guide — The Scrum Master',
      'description', 'The Scrum Guide defines the Scrum Master accountability precisely. Extract and study the key text on what the SM is accountable for and how the SM serves each of the three stakeholder groups.',
      'transcript', 'SCRUM GUIDE — THE SCRUM MASTER

KEY TEXT FROM THE SCRUM GUIDE (2020)
"The Scrum Master is accountable for establishing Scrum as defined in the Scrum Guide. They do this by helping everyone understand Scrum theory and practice, both within the Scrum Team and the organization."

"The Scrum Master is accountable for the Scrum Team''s effectiveness. They do this by enabling the Scrum Team to improve its practices, within the Scrum framework."

WHY THIS TEXT MATTERS
Notice the word "accountable" — not "responsible for" or "in charge of." Accountability means ownership of the outcome. The SM owns Scrum working well. If Scrum is broken, the SM owns fixing it — through coaching, facilitation, and impediment removal, not through authority.

SERVING THE SCRUM TEAM
- Coaching team members in self-management and cross-functionality
- Helping the team focus on creating high-value Increments that meet the Definition of Done
- Causing the removal of impediments to the team''s progress
- Ensuring all Scrum events take place, are positive, productive, and within the timebox

SERVING THE PRODUCT OWNER
- Helping find techniques for effective Product Goal definition and Product Backlog management
- Helping the team understand the need for clear, concise Product Backlog items
- Helping establish empirical product planning in complex environments
- Facilitating stakeholder collaboration as requested or needed

SERVING THE ORGANIZATION
- Leading, training, and coaching the organization in its Scrum adoption
- Planning and advising Scrum implementations
- Helping employees and stakeholders understand and enact an empirical approach
- Removing barriers between stakeholders and Scrum Teams

WHAT TO FOCUS ON WHEN READING THIS
Ask yourself: "Am I serving or managing?" Every SM action should fit into one of these three service areas. If you find yourself assigning tasks, managing timelines, or reporting status up the chain — you have drifted from the Scrum Guide definition.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 6: Coaching vs. mentoring
  UPDATE videos SET
    description = 'Coaching and mentoring are two distinct stances a Scrum Master uses — and knowing when to use each is critical. Coaching draws out the coachee''s own thinking through powerful questions. Mentoring shares the mentor''s experience and tells the mentee what to do. Most Scrum Masters over-mentor and under-coach.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Coaching vs. mentoring',
      'description', 'Coaching and mentoring are two distinct stances — coaching asks questions and the coachee discovers answers; mentoring shares experience and the mentor tells. Knowing when to use each stance is a core Scrum Master skill.',
      'transcript', 'COACHING VS. MENTORING

THE FUNDAMENTAL DISTINCTION
- Coaching: the coach asks questions; the coachee discovers the answer from within
- Mentoring: the mentor shares experience; the mentee receives guidance from outside

In coaching, the wisdom lives in the coachee. The coach''s job is to surface it.
In mentoring, the wisdom lives in the mentor. The mentor''s job is to transfer it.

WHEN TO COACH
Use coaching when:
- The person has the capability to solve the problem but hasn''t seen it yet
- You want to build long-term self-sufficiency, not dependency on you
- The team is capable but stuck in a pattern (retrospective coaching, event facilitation)
- You are working with experienced practitioners who need clarity, not instruction

WHEN TO MENTOR
Use mentoring when:
- The person is genuinely new to Scrum and needs foundational knowledge
- There is a specific skill gap (e.g., how to run planning poker) that experience can fill
- Time pressure requires a direct answer (explaining how a Sprint Review works to a first-timer)
- The coachee explicitly asks for your experience or opinion

KEY COACHING QUESTIONS FOR SCRUM MASTERS
- "What do you think is causing this?"
- "What have you already tried?"
- "What would need to be true for this to work?"
- "What is the team telling you through this behavior?"
- "What would you do if you weren''t worried about getting it wrong?"
- "What is the smallest experiment you could run this Sprint?"

THE OVER-MENTORING TRAP
Most Scrum Masters default to mentoring — it feels helpful to share answers. But over-mentoring creates dependency, slows team growth, and signals that you don''t trust the team''s intelligence. Ask first. Tell only when asking has failed or is genuinely inappropriate.

PRACTICAL RULE
Default to coaching. Shift to mentoring only when the person needs knowledge they cannot discover independently. Shift back to coaching once the knowledge is transferred.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 8: A day in the life of a Scrum Master
  UPDATE videos SET
    description = 'A Scrum Master''s day is not filled with meetings chaired — it is filled with observations, conversations, and interventions. This lesson walks through a typical day: what to check in the morning, how to run the Daily Scrum, mid-day coaching and impediment work, and afternoon stakeholder communication. It also clarifies what a Scrum Master does NOT do.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'A day in the life of a Scrum Master',
      'description', 'A Scrum Master''s day is structured around observation, facilitation, coaching, and impediment removal — not task management or status reporting. This lesson walks through a realistic daily rhythm.',
      'transcript', 'A DAY IN THE LIFE OF A SCRUM MASTER

MORNING: SITUATIONAL AWARENESS (15-30 MIN)
Before the team arrives or logs in:
- Review the Sprint Board: which items moved yesterday? Which items are aging without movement?
- Check item age: any story that has been in progress for more than 2 days without movement is a signal — is something blocked?
- Review the impediment log: are any open impediments about to breach their resolution SLA?
- Check team health signals: any missed check-ins, unusual Slack silence, or repeated absences?

DAILY SCRUM FACILITATION (15 MIN MAX)
Your role is not to run the Daily Scrum — it is to ensure it happens and stays within its purpose:
- Developers inspect progress toward the Sprint Goal
- Developers adapt the Sprint Backlog as needed
- The SM watches for impediments surfaced during the stand-up
- After the event: immediately follow up on any impediment mentioned

MID-DAY: COACHING AND IMPEDIMENT REMOVAL
- 1:1 conversations: quick check-ins with developers and the PO — not status checks, but "how are you feeling about this Sprint?"
- Impediment escalation: if an impediment requires organizational intervention, work it during business hours when stakeholders are available
- Prepare for upcoming events: if Sprint Review or Retro is this week, design the facilitation approach
- Coach the PO: help with backlog refinement structure, stakeholder communication, or acceptance criteria clarity

AFTERNOON: STAKEHOLDER AND ORGANIZATIONAL WORK
- Communicate with stakeholders who need visibility on Sprint progress
- Review metrics: velocity trends, burndown, cycle time — not to report, but to understand what to coach
- Update the team dashboard / information radiator with current data

WHAT A SCRUM MASTER DOES NOT DO
- Does not assign tasks to developers
- Does not manage developer performance or conduct reviews
- Does not set the Sprint Goal (the team and PO do that together in Sprint Planning)
- Does not decide what goes into the Sprint Backlog
- Does not report Sprint status to management (that is the PO''s job, via the Sprint Review)
- Does not attend every meeting in the organization'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 3 — Scrum Team Accountabilities (OFFSET 2)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 2;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 3 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Scrum Guide — The Scrum Team
  UPDATE videos SET
    description = 'The Scrum Guide defines the Scrum Team as consisting of one Scrum Master, one Product Owner, and Developers. This lesson extracts the key text and explains the architectural choices behind it: why there is no team lead, why the team is self-managing, and why cross-functionality is a structural requirement, not a preference.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scrum Guide — The Scrum Team',
      'description', 'The Scrum Guide defines the Scrum Team as one SM, one PO, and Developers — self-managing and cross-functional. This lesson extracts the key text and explains the architectural choices behind it.',
      'transcript', 'SCRUM GUIDE — THE SCRUM TEAM

KEY TEXT FROM THE SCRUM GUIDE (2020)
"The fundamental unit of Scrum is a small team of people, a Scrum Team. The Scrum Team consists of one Scrum Master, one Product Owner, and Developers. Within a Scrum Team, there are no sub-teams or hierarchies. It is a cohesive unit of professionals focused on one objective at a time, the Product Goal."

"Scrum Teams are cross-functional, meaning the members have all the skills necessary to create value each Sprint. They are also self-managing, meaning they internally decide who does what, when, and how."

WHY "SELF-MANAGING" MATTERS
Self-managing means no external authority tells the team how to do their work. The PO says what to build (the what). The team decides how to build it (the how) and who builds which piece (the who). Any manager who assigns tasks to individual developers is violating this principle.

WHY "CROSS-FUNCTIONAL" MATTERS
Cross-functional means the team has everything it needs to create a Done Increment without depending on people outside the team. If a UX designer is always needed from another team, the team is not cross-functional for that work — and external dependencies will become Sprint blockers.

TEAM SIZE
The Scrum Guide recommends 10 or fewer people. Small enough to communicate easily, large enough to accomplish meaningful work each Sprint. If your team is growing beyond 10, consider splitting into multiple Scrum Teams working toward the same Product Goal.

NO SUB-TEAMS OR HIERARCHIES
There is no "tech lead" in Scrum, no "QA team within the Scrum Team." The entire team is collectively accountable for the Increment. Specialization exists — but not as sub-hierarchy.

WHAT TO FOCUS ON WHEN STUDYING THIS
Ask: "Is our team truly self-managing and cross-functional?" If the answer is no, what structural changes are needed? This is the foundation all other Scrum accountabilities rest on.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 5: Accountabilities vs. roles
  UPDATE videos SET
    description = 'The Scrum Guide deliberately uses the word "accountability" rather than "role." A role is a title. An accountability is a responsibility you own — the outcome you are answerable for. Understanding this distinction changes how you think about who does what in Scrum, and why dual accountability (one person as both PO and SM) is structurally problematic.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Accountabilities vs. roles',
      'description', 'Scrum uses "accountability" not "role" — a deliberate linguistic choice that carries real structural implications. A role is a title; an accountability is an outcome you own.',
      'transcript', 'ACCOUNTABILITIES VS. ROLES

THE LINGUISTIC CHOICE IN THE SCRUM GUIDE
The 2020 Scrum Guide replaced the word "roles" with "accountabilities." This was not cosmetic. It was a deliberate signal about how to think about Scrum Team structure.

WHAT IS A ROLE?
A role is a title, a label, an organizational category. "QA Engineer," "Project Manager," "Team Lead" are roles. Roles define what you are called.

WHAT IS AN ACCOUNTABILITY?
An accountability is an outcome you own — something you are answerable for, whether or not it has been completed or done well. Accountabilities define what you are responsible for producing.

THE THREE ACCOUNTABILITIES IN SCRUM
- Scrum Master: accountable for the Scrum Team''s effectiveness
- Product Owner: accountable for maximizing the value of the product
- Developers: accountable for creating a usable, potentially releasable Increment each Sprint

ONE PERSON, MULTIPLE ACCOUNTABILITIES?
A single person can hold multiple accountabilities. A developer can also serve as Scrum Master. However, the Scrum Guide warns against certain combinations.

WHY PO + SM DUAL ACCOUNTABILITY IS PROBLEMATIC
The Product Owner maximizes value — which creates pressure to add scope, cut corners on process, and push the team to deliver more. The Scrum Master protects the team and the process — which sometimes means saying no to the PO. These accountabilities are in productive tension. If one person holds both, that tension collapses, and process quality degrades under delivery pressure.

THE PRACTICAL TEST
Ask: "If this accountability is not fulfilled, who is answerable?" If the answer is "nobody" — the accountability is unowned. Unowned accountabilities in Scrum teams are the root cause of most process failures.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- order_index = 6: Cross-functional teams
  UPDATE videos SET
    description = 'Cross-functional means the team has all the skills necessary to create a Done Increment each Sprint without depending on people outside the team. This lesson explains what cross-functionality requires structurally, what it does not mean (everyone knows everything), and how to build it through T-shaped skills and deliberate cross-training.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Cross-functional teams',
      'description', 'Cross-functional means all skills to create a Done Increment live within the team — no external dependencies per Sprint. This lesson explains what it requires, what it does not mean, and how to build it.',
      'transcript', 'CROSS-FUNCTIONAL TEAMS

THE SCRUM GUIDE DEFINITION
"Scrum Teams are cross-functional, meaning the members have all the skills necessary to create value each Sprint."

This is a structural requirement, not a preference. If your team cannot deliver a Done Increment without involving people outside the team, it is not cross-functional for that work.

WHAT CROSS-FUNCTIONAL DOES NOT MEAN
Common misconception: cross-functional means everyone knows everything. That is not true.
- Developers do not all need to be full-stack engineers
- QA specialists, UX designers, and data analysts can still be specialists
- Cross-functional means the team collectively covers all the skills needed — not that each individual does

WHAT CROSS-FUNCTIONAL DOES MEAN
- No Sprint should end with "we couldn''t finish because we needed someone outside our team"
- If your team always waits for the DBA team, the UX team, or the security team — those are missing skills that belong on the team
- Integration, testing, deployment, documentation — all of this should be possible within the team

T-SHAPED SKILLS: THE PRACTICAL MODEL
T-shaped skills are the most realistic model for cross-functional teams:
- The vertical bar: deep expertise in one area (backend development, UX design, data modeling)
- The horizontal bar: working knowledge across adjacent areas (enough frontend to unblock a colleague, enough QA to test your own work)

HOW TO BUILD CROSS-FUNCTIONALITY
- Pair programming and mob programming spread knowledge organically
- Cross-training: rotate responsibilities on a planned basis
- Retrospective check: add "did we need anyone outside our team?" as a recurring retrospective question
- Hiring: when adding to the team, identify the skill gap first, then hire toward it

THE SCRUM MASTER''S ROLE
Identify the cross-functional gaps. Surface them transparently. Work with the PO and organization to close them — through hiring, training, or temporary embedding. Never accept "we always need the external team" as a permanent condition.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 7: The three accountabilities
  UPDATE videos SET
    description = 'The three Scrum accountabilities — Scrum Master, Product Owner, and Developers — each own a distinct outcome. This lesson explains the boundaries and interactions between them, how they create a system of checks and balances, and what happens when accountabilities overlap or collapse into each other.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The three accountabilities',
      'description', 'The three Scrum accountabilities own distinct outcomes: SM owns effectiveness, PO owns value, Developers own the Increment. This lesson maps the boundaries, interactions, and checks and balances between them.',
      'transcript', 'THE THREE ACCOUNTABILITIES

OVERVIEW
Scrum has three accountabilities, each with a clear ownership area:
1. Scrum Master: accountable for the Scrum Team''s effectiveness
2. Product Owner: accountable for maximizing the value of the product
3. Developers: accountable for creating a usable, potentially releasable Increment every Sprint

These three accountabilities create a system of mutual accountability and productive tension.

SCRUM MASTER: THE EFFECTIVENESS ACCOUNTABILITY
The SM owns Scrum working well. If the Daily Scrum is a status meeting, the SM has not fulfilled this accountability. If impediments linger for weeks, the SM has not fulfilled this accountability. The SM''s measure of success is: "Does the team get better at delivering value over time?"

PRODUCT OWNER: THE VALUE ACCOUNTABILITY
The PO owns the Product Backlog and the ordering of its items. The PO''s single measure of success is: "Is the product delivering maximum value to users and the organization?" The PO makes trade-off decisions — what to build next, what to cut, what to refine. No one else makes these decisions.

DEVELOPERS: THE INCREMENT ACCOUNTABILITY
Developers own the Increment. Not just the code — the done-ness of the Increment. If the Increment does not meet the Definition of Done, the Developers have not fulfilled their accountability. The team decides who does what internally; the accountability is collective.

HOW THE ACCOUNTABILITIES INTERACT
- The PO orders the backlog; the Developers select what they can do in the Sprint
- The SM helps the PO communicate clearly; the SM helps Developers stay unblocked
- The Developers create the Increment; the PO inspects it at the Sprint Review

THE PRODUCTIVE TENSIONS
- PO wants more scope; Developers protect their capacity to build quality
- SM protects the process; PO wants to flex the process for delivery speed
- Developers want technical excellence; PO balances technical quality against delivery urgency
These tensions are features, not bugs. They prevent any one perspective from dominating.'
    ))
  WHERE chapter_id = v_ch AND order_index = 7;

  -- order_index = 8: PO vs SM
  UPDATE videos SET
    description = 'The Product Owner and Scrum Master are distinct accountabilities with distinct purposes — and they are frequently confused, combined, or blurred in practice. This lesson defines what each owns, where they collaborate, why one person cannot effectively hold both accountabilities, and how the SM supports the PO without taking over PO responsibilities.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'PO vs SM',
      'description', 'PO owns value and the Product Backlog; SM owns effectiveness and the Scrum process. They collaborate closely but must not be the same person. This lesson maps the boundary and the collaboration zone.',
      'transcript', 'PO VS SM

WHAT THE PRODUCT OWNER OWNS
- The Product Backlog: ordered, refined, and communicated
- The Product Goal: the long-term target that gives Sprint Goals coherence
- Value decisions: what to build, what to cut, what to defer
- Stakeholder relationships: ensuring stakeholder needs are captured in the backlog
- Sprint Review outcomes: deciding whether the Increment is acceptable

WHAT THE SCRUM MASTER OWNS
- Scrum process effectiveness: are the events meaningful, timed, and purposeful?
- Impediment removal: anything blocking the team''s ability to deliver
- Team health: are team dynamics, collaboration, and trust enabling or limiting delivery?
- Scrum adoption: is the organization supporting or undermining the team''s ability to work empirically?
- PO coaching: helping the PO understand backlog management, stakeholder engagement, and Product Goal clarity

WHERE THEY COLLABORATE
- Sprint Planning: SM facilitates; PO communicates the Product Goal and backlog priorities
- Sprint Review: SM facilitates; PO leads the stakeholder conversation about the Increment
- Product Backlog Refinement: SM helps facilitate; PO makes content decisions
- Impediments that require PO decisions: SM surfaces, PO resolves

WHY ONE PERSON CANNOT HOLD BOTH
The PO is accountable for maximizing value — which creates constant pressure to add scope, accelerate delivery, and flex the process.
The SM is accountable for the team''s effectiveness — which sometimes requires pushing back on the PO, protecting the team''s capacity, and enforcing process discipline.

These accountabilities are in productive tension. One person cannot effectively hold both because they cannot simultaneously push for more scope AND protect the team from overload.

COMMON CONFUSION TO AVOID
- The SM does not manage the PO — the SM coaches the PO
- The SM does not control the backlog — the PO does
- The PO does not run Scrum events — the SM facilitates them
- Neither role reports to the other — they are peers'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 4 — The Sprint & Sprint Planning (OFFSET 3)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 3;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 4 chapter not found for course %', v_course_id; END IF;

  -- order_index = 7: Sprint Planning facilitation
  UPDATE videos SET
    description = 'Sprint Planning facilitation requires managing three specific challenges: ensuring the team commits to the why (Sprint Goal) before the what (backlog items), preventing over-commitment driven by optimism, and achieving realistic task decomposition. This lesson provides practical facilitation approaches for each challenge, including timebox management for a four-hour Sprint Planning session.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Sprint Planning facilitation',
      'description', 'Sprint Planning facilitation addresses three challenges: why before what, preventing over-commitment, and realistic task decomposition. This lesson covers practical facilitation techniques and timebox management.',
      'transcript', 'SPRINT PLANNING FACILITATION

THE THREE FACILITATION CHALLENGES

CHALLENGE 1: WHY BEFORE WHAT
The most common Sprint Planning failure: the team dives into backlog items before establishing the Sprint Goal. The result is a Sprint with no coherent purpose — just a list of disconnected tasks.

Facilitation fix:
- Open Sprint Planning with the question: "What is the one thing that would make this Sprint a success?"
- Do not allow any backlog item selection until the draft Sprint Goal is written on the board
- Check every candidate item against the Sprint Goal: "Does this item serve the Sprint Goal?"
- Items that don''t serve the Sprint Goal belong in the next Sprint — not this one

CHALLENGE 2: PREVENTING OVER-COMMITMENT
Teams consistently underestimate complexity and overestimate capacity. The result: Sprint failure that erodes team morale and stakeholder trust.

Facilitation fix:
- Reference the last 3 Sprints'' velocity: "We have averaged X story points. What makes this Sprint different?"
- Remind the team of planned absences, holidays, and cross-team commitments before selecting items
- Use the "red light" technique: as the Sprint Backlog fills, ask "If we only finished what''s on the board right now, would we meet the Sprint Goal?" If yes, stop adding items
- Build in slack: 80% capacity is healthier than 100% — the 20% absorbs the unexpected

CHALLENGE 3: REALISTIC TASK DECOMPOSITION
Stories that are not broken into tasks cannot be tracked during the Sprint. Tasks should be no larger than one day of work.

Facilitation fix:
- For each story selected, ask: "What are the specific tasks to complete this?" List them explicitly
- Flag any task estimated at more than 8 hours — it needs to be broken down further
- Use silent task decomposition: each developer writes tasks for their own stories, then shares with the group for review

TIMEBOX MANAGEMENT
Sprint Planning is timeboxed at 2 hours per Sprint week (4 hours for a 2-week Sprint):
- First half: Sprint Goal + backlog selection (PO-led, SM-facilitated)
- Second half: task decomposition and How questions (Developers-led, SM-facilitated)
- Keep a visible timer. When time is up, the Sprint starts with whatever has been planned.'
    ))
  WHERE chapter_id = v_ch AND order_index = 7;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 5 — Daily Scrum & Sprint Execution (OFFSET 4)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 4;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 5 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Scrum Guide — Daily Scrum
  UPDATE videos SET
    description = 'The Scrum Guide defines the Daily Scrum precisely: 15 minutes, for Developers only, to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as needed. This lesson extracts the key text, explains what "same time and place" means in practice, and clarifies the Scrum Master''s role — ensuring it happens and keeping the timebox, not facilitating it.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scrum Guide — Daily Scrum',
      'description', 'The Scrum Guide defines the Daily Scrum as a 15-minute event for Developers — to inspect Sprint Goal progress and adapt the Sprint Backlog. The SM ensures it happens; Developers own it.',
      'transcript', 'SCRUM GUIDE — THE DAILY SCRUM

KEY TEXT FROM THE SCRUM GUIDE (2020)
"The purpose of the Daily Scrum is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary, adjusting the upcoming planned work."

"The Daily Scrum is a 15-minute event for the Developers of the Scrum Team. To reduce complexity, it is held at the same time and place every working day of the Sprint."

"If the Product Owner or Scrum Master are actively working on items in the Sprint Backlog, they participate as Developers."

WHY "DEVELOPERS ONLY" MATTERS
The Daily Scrum is not a status meeting for managers, stakeholders, or even the Scrum Master. It is the Developers'' event for coordinating their own work. When non-Developers attend as observers, it changes the dynamic — Developers begin performing status rather than coordinating work.

THE SCRUM GUIDE ON METHOD
"The Developers can select whatever structure and techniques they want, as long as their Daily Scrum focuses on progress toward the Sprint Goal and produces an actionable plan for the next day of work."

The three questions (what did I do yesterday, what will I do today, any impediments) are ONE technique — not a Scrum rule. Teams may use alternative formats like walking the board.

SAME TIME AND PLACE
"Same time and place" reduces friction and cognitive overhead. Developers should not spend mental energy figuring out when the Daily Scrum is. It should be as automatic as a team heartbeat.

THE SCRUM MASTER''S ROLE
- Ensures the Daily Scrum happens every working day
- Protects the timebox: 15 minutes, no more
- Coaches Developers if the event drifts into problem-solving, status reporting, or running long
- Does not facilitate the Daily Scrum (unless the SM is also a Developer on the Sprint Backlog)

WHAT TO FOCUS ON WHEN READING THIS
The Daily Scrum''s purpose is coordination and adaptation — not reporting. If your Daily Scrum feels like a status meeting, it has drifted from its purpose.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 6: Flow basics
  UPDATE videos SET
    description = 'Flow is the movement of work through a system. Understanding flow concepts — WIP, cycle time, throughput, and Little''s Law — gives Scrum Masters a language and a set of metrics for diagnosing Sprint execution problems. This lesson covers the core concepts and introduces the Cumulative Flow Diagram as the primary flow visualization tool.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Flow basics',
      'description', 'Flow concepts — WIP, cycle time, throughput, and Little''s Law — give Scrum Masters a diagnostic language for Sprint execution. This lesson introduces the core concepts and the Cumulative Flow Diagram.',
      'transcript', 'FLOW BASICS

WHAT IS FLOW?
Flow is the smooth, predictable movement of work through a system. In Scrum, flow is how work moves from "In Progress" through "Review" to "Done." When flow is healthy, work completes predictably. When flow is disrupted, work piles up, cycle times grow, and teams miss Sprint Goals.

CORE FLOW CONCEPTS

WIP (Work in Progress)
WIP is the number of items currently being worked on — started but not finished. High WIP is the single biggest flow killer. When developers have 5 items in progress simultaneously, none of them finish quickly. Lower WIP = faster completion = better flow.

Cycle Time
Cycle time is the time from when work starts to when it is done. If a story spends 3 days in progress and 1 day in review, its cycle time is 4 days. Reducing cycle time requires reducing WIP, reducing handoffs, and removing blockers early.

Throughput
Throughput is the number of items completed per Sprint (or per week). It is a more stable metric than velocity because it does not depend on estimation accuracy — only on completion count.

LITTLE''S LAW
Little''s Law: Avg Cycle Time = Avg WIP / Avg Throughput
This mathematical relationship shows: if you want shorter cycle times, either increase throughput (speed) or decrease WIP (fewer items in flight at once). Decreasing WIP is almost always the easier lever.

FLOW KILLERS
- Context switching: working on 3 items simultaneously means none get focused attention
- Waiting: items blocked by dependencies, reviews, or approvals inflate cycle time without adding value
- Large batches: big stories take longer and provide no value until they are fully done — break them smaller

CUMULATIVE FLOW DIAGRAM (CFD)
The CFD shows how items accumulate and flow through each state (To Do, In Progress, Review, Done) over time. A healthy CFD shows bands of roughly consistent width. Widening bands indicate accumulation — a flow problem requiring intervention.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 7: Daily Scrum done right
  UPDATE videos SET
    description = 'The Daily Scrum fails in predictable ways — it becomes a status report to the Scrum Master, it runs long, developers talk to each other instead of coordinating work, or key people are absent. This lesson covers the most effective Daily Scrum format (walking the board), the most common anti-patterns, and how to fix each one.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Daily Scrum done right',
      'description', 'The Daily Scrum done right: facing the board not the SM, walking the board format, and eliminating the anti-patterns that turn it into a status meeting.',
      'transcript', 'DAILY SCRUM DONE RIGHT

THE CORE PRINCIPLE: FACE THE BOARD, NOT THE SCRUM MASTER
When developers face the Scrum Master during the Daily Scrum, they are reporting. When they face the Sprint Board, they are coordinating. The physical (or virtual) orientation of the team is a signal about the event''s purpose.

THE WALK-THE-BOARD FORMAT
Instead of each person answering three questions in sequence, walk the Sprint Board from right to left — starting with items closest to Done:
1. Review items in "Done" — confirm they are truly Done to the DoD
2. Review items in "Review/QA" — who needs to act to move these to Done today?
3. Review items "In Progress" — what is the status? Any blockers?
4. Review items "To Do" — what will be started today to keep pace with the Sprint Goal?

This format focuses the team on completing work (right to left) rather than starting new work (left to right). It naturally surfaces blockers at the items closest to value delivery.

ANTI-PATTERNS AND FIXES

Anti-pattern 1: Status report to the SM
Symptom: developers speak to the Scrum Master, not to each other
Fix: SM steps back from the circle physically. Let silence happen when no one knows who to speak to — the team will self-organize

Anti-pattern 2: Too long (running 30+ minutes)
Symptom: problem-solving happens in the Daily Scrum; detailed technical discussions begin
Fix: call it explicitly — "Let''s take that offline. Who needs to be in that conversation?" Then close the Daily Scrum and let the sidebar happen with the right people

Anti-pattern 3: Absent developers
Symptom: one or two developers regularly skip or are late
Fix: address in a 1:1 first. "What makes it hard to be there?" Remove the barrier. If it continues, raise it in the retrospective as a team norm issue

Anti-pattern 4: No adaptation
Symptom: the Daily Scrum ends but the Sprint Backlog is unchanged — no items moved, no blockers escalated
Fix: end every Daily Scrum with "What needs to change on the board right now?" Make updates happen in the event, not after it'
    ))
  WHERE chapter_id = v_ch AND order_index = 7;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 6 — Sprint Review & Retrospective (OFFSET 5)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 5;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 6 chapter not found for course %', v_course_id; END IF;

  -- order_index = 5: Retro formats
  UPDATE videos SET
    description = 'No single retrospective format works for every team in every Sprint. This lesson covers five core formats — Start/Stop/Continue, 4Ls, Mad/Sad/Glad, Sailboat, and Timeline — with guidance on when to use each and how to match the format to the team''s current situation and energy.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Retro formats',
      'description', 'Five core retrospective formats — Start/Stop/Continue, 4Ls, Mad/Sad/Glad, Sailboat, Timeline — with guidance on when to use each based on team situation and energy.',
      'transcript', 'RETRO FORMATS

WHY FORMAT SELECTION MATTERS
Using the same retrospective format every Sprint creates ritual fatigue — the team goes through the motions without genuine reflection. Varying formats keeps the retrospective generative and surfaces different categories of insight.

FORMAT 1: START / STOP / CONTINUE
Best for: new teams, first retrospectives, teams that want direct and actionable output
How it works: three columns — what should we Start doing that we are not doing? What should we Stop doing that is hurting us? What should we Continue doing that is working?
When to use: when the team needs clarity on concrete behavioral changes

FORMAT 2: 4Ls (LIKED, LEARNED, LACKED, LONGED FOR)
Best for: teams with a learning focus, after a significant delivery or milestone
How it works: four quadrants — what did we Like? What did we Learn? What did we Lack? What did we Long for?
When to use: after a significant Sprint — major release, difficult Sprint, or team achievement

FORMAT 3: MAD / SAD / GLAD
Best for: teams with emotional undercurrents that need surfacing; high-stress Sprints
How it works: three columns — what made you Mad? What made you Sad? What made you Glad?
When to use: when team morale is a concern; this format gives emotional data a legitimate place in the retrospective

FORMAT 4: SAILBOAT
Best for: teams that are not making forward progress; strategic retrospectives
How it works: draw a sailboat — Wind (what propels us), Anchors (what slows us down), Rocks/Icebergs (upcoming risks), Sun/Island (the destination/goal)
When to use: when the team needs to think systemically, not just tactically

FORMAT 5: TIMELINE
Best for: end-of-release retrospectives; teams recovering from a difficult period
How it works: team members place sticky notes on a timeline of the Sprint, marking positive and negative events as they happened
When to use: when you need a shared narrative of what actually happened — especially useful after a Sprint with many unexpected events'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- order_index = 6: Improvement kata
  UPDATE videos SET
    description = 'The Improvement Kata is Toyota''s four-step problem-solving and improvement cycle: understand the direction, grasp the current condition, set the next target condition, and experiment toward the target. Applied as a retrospective framework, it replaces the common but ineffective "10 action items" with one focused improvement cycle that the team actually completes.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Improvement kata',
      'description', 'Toyota''s Improvement Kata applied as a retrospective framework: four steps that replace scattered action items with one focused improvement cycle the team actually completes.',
      'transcript', 'IMPROVEMENT KATA

WHAT IS THE IMPROVEMENT KATA?
The Improvement Kata is a four-step pattern from Toyota''s production system, adapted by Mike Rother in "Toyota Kata." It is a structured approach to improvement under uncertainty — particularly useful when the path to the goal is not yet known.

THE FOUR STEPS

Step 1: Understand the Direction (Challenge)
What is the long-term goal or improvement direction? This gives the team a persistent challenge to work toward, beyond any single Sprint. Example: "Zero defects reaching production."

Step 2: Grasp the Current Condition
What is actually happening right now? Use data, not opinion. How many defects reached production last Sprint? What is our current cycle time? Where does work get stuck? The current condition must be measured, not guessed.

Step 3: Establish the Next Target Condition
What specific measurable condition do you want to reach by the next retrospective? The target condition should be achievable in one Sprint and be a clear step toward the long-term direction. Example: "Reduce production defects from 8 to 3 this Sprint."

Step 4: Experiment Toward the Target
What is the smallest experiment that will tell you whether your hypothesis about closing the gap is correct? Run it. Review results at the next retrospective. Adjust.

WHY IT BEATS THE "10 ACTION ITEMS" PROBLEM
The classic retrospective failure: 10 action items are generated, 8 are forgotten, 2 are half-done, and next Sprint the team generates 10 more. The Improvement Kata fixes this by:
- Limiting focus to ONE improvement cycle at a time
- Requiring a measurable target condition (not just "do better at X")
- Treating the improvement as an experiment (hypothesis + test)
- Building in a review at the next retrospective

APPLYING IT IN RETROSPECTIVES
At the end of your retrospective: "What is our ONE improvement cycle for this Sprint?" Define the target condition and the experiment. Assign it to one owner. Review at the next retrospective before anything else.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 8: Retro facilitation
  UPDATE videos SET
    description = 'Effective retrospective facilitation follows a five-phase structure: Set the Stage, Gather Data, Generate Insights, Decide What to Do, Close. Each phase has a specific purpose and facilitation technique. This lesson walks through each phase with concrete methods and shows how to end with a single, specific, owned action item rather than a list of good intentions.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Retro facilitation',
      'description', 'Five-phase retrospective facilitation: Set the Stage / Gather Data / Generate Insights / Decide / Close. Each phase has a distinct purpose and technique, ending with one specific owned action item.',
      'transcript', 'RETRO FACILITATION

THE FIVE-PHASE STRUCTURE
From Esther Derby and Diana Larsen''s "Agile Retrospectives" — the definitive framework:

PHASE 1: SET THE STAGE (5 MIN)
Purpose: create the conditions for honest conversation
Technique: opening check-in — one word or one image that describes how you''re arriving at this retrospective
Why it matters: the first words spoken in a retrospective set the emotional tone for everything that follows. A structured opening normalizes authentic expression and signals that this is a safe space.

PHASE 2: GATHER DATA (10-15 MIN)
Purpose: build a shared picture of what happened — facts, events, metrics, feelings
Technique: Silent sticky-note generation, then clustering. Each person writes privately (no group influence), then shares. Group similar themes.
Why it matters: without shared data, insights are based on whoever speaks loudest. Silent data gathering equalizes contribution.

PHASE 3: GENERATE INSIGHTS (10-15 MIN)
Purpose: analyze patterns — why did things go the way they did?
Technique: 5 Whys — take the top cluster and ask "Why?" five times. The fifth answer is usually the systemic cause.
Why it matters: retrospectives that skip this phase produce action items that address symptoms, not root causes. The same problems recur.

PHASE 4: DECIDE WHAT TO DO (5-10 MIN)
Purpose: commit to one specific, measurable, owned improvement
Technique: dot voting on proposed actions, then explicit commitment — "Who owns this? What does done look like? When will we review it?"
The critical rule: ONE action item, not ten. Ten items mean zero accountability. One item with an owner and a definition of done is a commitment.

PHASE 5: CLOSE (5 MIN)
Purpose: end the retrospective intentionally; harvest learning about the retrospective itself
Technique: retro-of-the-retro — one word that describes this retrospective. What should we do differently next time?
Why it matters: the retrospective itself should improve over time. Closing creates a feedback loop on the process.'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 7 — Scrum Artifacts & Commitments (OFFSET 6)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 6;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 7 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Scrum Guide — Artifacts & Commitments
  UPDATE videos SET
    description = 'The 2020 Scrum Guide introduced the concept of commitments — each of the three artifacts (Product Backlog, Sprint Backlog, Increment) has a corresponding commitment (Product Goal, Sprint Goal, Definition of Done). This lesson extracts the key text and explains why the commitment structure is foundational for empiricism.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scrum Guide — Artifacts & Commitments',
      'description', 'The 2020 Scrum Guide pairs each artifact with a commitment: Product Backlog / Product Goal, Sprint Backlog / Sprint Goal, Increment / Definition of Done. This lesson extracts the key text and explains why this structure matters.',
      'transcript', 'SCRUM GUIDE — ARTIFACTS AND COMMITMENTS

THE 2020 STRUCTURAL CHANGE
The 2020 Scrum Guide introduced a critical structural addition: every artifact has a commitment.
- Product Backlog → Product Goal
- Sprint Backlog → Sprint Goal
- Increment → Definition of Done

This was not cosmetic. The commitment structure answers a fundamental question: "How do we know if we are making progress and doing quality work?" Without commitments, artifacts are just lists and collections of code. With commitments, they become accountability structures.

KEY TEXT ON ARTIFACTS
"Scrum''s artifacts represent work or value. They are designed to maximize transparency of key information. Thus, everyone inspecting them has the same basis for adaptation."

PRODUCT BACKLOG
"The Product Backlog is an emergent, ordered list of what is needed to improve the product. It is the single source of work undertaken by the Scrum Team."
Commitment: the Product Goal — "The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against."

SPRINT BACKLOG
"The Sprint Backlog is composed of the Sprint Goal (why), the set of Product Backlog items selected for the Sprint (what), as well as an actionable plan for delivering the Increment (how)."
Commitment: the Sprint Goal — "The Sprint Goal is the single objective for the Sprint."

INCREMENT
"An Increment is a concrete stepping stone toward the Product Goal. Each Increment is additive to all prior Increments and thoroughly verified, ensuring that all Increments work together."
Commitment: the Definition of Done — "The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required for the product."

WHY COMMITMENTS MATTER FOR EMPIRICISM
Empiricism requires something to inspect against. Commitments provide that something. Without a Product Goal, inspection at the Sprint Review is subjective. Without a Sprint Goal, the Daily Scrum has no reference point for "making progress." Without a Definition of Done, the Increment''s quality cannot be objectively verified.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 5: Product Goal patterns
  UPDATE videos SET
    description = 'The Product Goal is the long-term objective that gives the Product Backlog coherence and gives Sprint Goals their strategic direction. This lesson covers three types of Product Goals — outcome goals, capability goals, and strategic goals — and shows strong versus weak examples of each, along with the rule that only one Product Goal exists at a time.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Product Goal patterns',
      'description', 'Three types of Product Goals — outcome, capability, and strategic — with strong vs. weak examples, and the single-goal-at-a-time rule that keeps the backlog coherent.',
      'transcript', 'PRODUCT GOAL PATTERNS

WHAT THE SCRUM GUIDE SAYS
"The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against. The Product Goal is in the Product Backlog. The rest of the Product Backlog emerges to define ''what'' will fulfill the Product Goal."

ONE PRODUCT GOAL AT A TIME
The Scrum Team pursues one Product Goal at a time. When it is achieved or abandoned, the next Product Goal is set. Multiple simultaneous Product Goals split focus and undermine Sprint Goal coherence.

THREE PRODUCT GOAL PATTERNS

PATTERN 1: OUTCOME GOAL
Focuses on a measurable change in user behavior or business metric
Strong example: "Users can complete their profile setup in under 2 minutes with zero support requests"
Weak example: "Improve the onboarding experience"
Why it matters: outcome goals create a clear test for success — you either achieved the outcome or you did not

PATTERN 2: CAPABILITY GOAL
Focuses on delivering a new capability that did not previously exist
Strong example: "The platform supports real-time collaboration between multiple users on the same document"
Weak example: "Add collaboration features"
Why it matters: capability goals define the boundary of what needs to exist, enabling clear Sprint Goal decomposition

PATTERN 3: STRATEGIC GOAL
Focuses on a market position, competitive advantage, or organizational objective
Strong example: "Achieve feature parity with Competitor X in the enterprise segment by Q4"
Weak example: "Be competitive in the enterprise market"
Why it matters: strategic goals align the backlog with organizational direction — but they require translation into outcome or capability sub-goals to drive Sprint-level work

EVALUATING A PRODUCT GOAL
A strong Product Goal passes three tests:
1. Specific: you can describe what the product looks like when the goal is achieved
2. Testable: you can measure or observe whether the goal has been reached
3. Motivating: the team understands why it matters to users or the organization'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- order_index = 6: Backlog structure
  UPDATE videos SET
    description = 'The Product Backlog is ordered, not prioritized — a deliberate word choice in the Scrum Guide. This lesson covers how a well-structured backlog is organized (ready at the top, thin in the middle, ideas at the bottom), what backlog hygiene means in practice, and why the backlog is a conversation tool rather than a requirements document.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Backlog structure',
      'description', 'An ordered Product Backlog has ready items at the top, rough items in the middle, and ideas at the bottom. This lesson covers ordering vs. prioritizing, backlog hygiene, and the backlog as a conversation tool.',
      'transcript', 'BACKLOG STRUCTURE

ORDERED, NOT PRIORITIZED
The Scrum Guide says the Product Backlog is "ordered" — not "prioritized." This is deliberate. Priority suggests importance ranking. Ordering suggests a sequence of work that accounts for value, risk, dependencies, and learning needs simultaneously. Two items can both be high priority but only one can be first.

THE THREE-LAYER STRUCTURE

TOP LAYER: READY ITEMS
- Stories refined to the point of being actionable in the next Sprint
- Small enough to complete in one Sprint
- Clear acceptance criteria, understood by the whole team
- Estimated (if the team uses estimation)
- This layer should contain at least one Sprint''s worth of items at all times

MIDDLE LAYER: ROUGH ITEMS
- Stories with a clear intent but not yet broken into actionable form
- Some understanding of the value and effort involved
- Will be refined in upcoming refinement sessions before they reach the top layer
- May be epics that need decomposition

BOTTOM LAYER: IDEAS AND FUTURE THINKING
- Raw ideas, hypotheses, stakeholder requests not yet analyzed
- May not survive to the top — many ideas get dropped when better options emerge
- The backlog does not need to have all future work specified here — just captured

BACKLOG HYGIENE
- Items that have been in the backlog for more than 3 months without moving up should be reviewed: is this still relevant?
- Duplicate items should be merged
- Items whose context has changed should be updated or removed
- The backlog should not grow indefinitely — a backlog with 300 items is not managed; it is hoarded

THE BACKLOG AS CONVERSATION, NOT REQUIREMENTS DOC
The Product Backlog is not a specification document. It is a shared understanding tool. The conversations during refinement are more valuable than the text written on the cards. Stories are reminders of conversations, not complete specifications.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 7: The three artifacts
  UPDATE videos SET
    description = 'The three Scrum artifacts — Product Backlog, Sprint Backlog, and Increment — form a closed feedback loop that drives empirical product development. This lesson maps how they interact: Product Backlog items flow into the Sprint Backlog during Sprint Planning, drive execution that produces the Increment, which is inspected at the Sprint Review, which informs the updated Product Backlog.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The three artifacts',
      'description', 'The three artifacts form a closed feedback loop: Product Backlog feeds Sprint Planning → Sprint Backlog drives execution → Increment surfaces at Sprint Review → updated Product Backlog. This lesson maps the full loop.',
      'transcript', 'THE THREE ARTIFACTS

THE CLOSED FEEDBACK LOOP
The three Scrum artifacts are not independent tools — they form a continuous feedback loop:

STEP 1: PRODUCT BACKLOG → SPRINT PLANNING
The Product Owner brings an ordered Product Backlog to Sprint Planning. The top items — refined, understood, and ready — are candidates for the Sprint. The team selects items they can complete while achieving the Sprint Goal.

STEP 2: SPRINT BACKLOG → SPRINT EXECUTION
The Sprint Backlog contains the Sprint Goal, the selected Product Backlog items, and the team''s plan (tasks) for delivering them. It is the Developers'' working document for the Sprint. It changes every day as work is completed and new information emerges.

STEP 3: SPRINT EXECUTION → INCREMENT
As Developers complete Sprint Backlog items that meet the Definition of Done, they add to the Increment. The Increment is not a dump of all work done — it is the cumulative, additive, Done body of work. Every Increment builds on all previous Increments.

STEP 4: INCREMENT → SPRINT REVIEW
At the Sprint Review, the Scrum Team and stakeholders inspect the Increment. Stakeholders provide feedback on what they see. This feedback is the empirical input that drives the next cycle.

STEP 5: SPRINT REVIEW → UPDATED PRODUCT BACKLOG
Based on Sprint Review feedback, the Product Owner updates the Product Backlog. Items may be added, removed, reordered, or refined. The updated backlog becomes the input for the next Sprint Planning.

THE EMPIRICAL ENGINE
This five-step loop is the empirical engine of Scrum. Each Sprint is one complete cycle of the engine. The artifacts are what make the loop visible and inspectable. Remove any artifact and the loop breaks:
- No Product Backlog = no ordered work to plan from
- No Sprint Backlog = no shared plan for the Sprint
- No Increment = nothing to inspect at the Sprint Review'
    ))
  WHERE chapter_id = v_ch AND order_index = 7;

  -- order_index = 8: Commitments explained
  UPDATE videos SET
    description = 'The three Scrum commitments — Product Goal, Sprint Goal, and Definition of Done — nest together to provide direction at every level of the work. This lesson explains each commitment, how they relate to each other, and how they collectively prevent the most common Scrum failure: teams delivering activity without delivering value.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Commitments explained',
      'description', 'The three commitments — Product Goal, Sprint Goal, and DoD — nest together: long-term direction, Sprint coherence, and quality standard. This lesson explains each and how they prevent activity without value.',
      'transcript', 'COMMITMENTS EXPLAINED

WHY COMMITMENTS EXIST
Without commitments, Scrum teams can be busy and going nowhere. They complete stories, run events, and produce Increments — but no coherent value emerges. The commitments are what give the work direction, coherence, and quality.

PRODUCT GOAL: LONG-TERM DIRECTION
The Product Goal is the commitment to the Product Backlog. It answers: "What are we building toward, and why?"
- Gives Sprint Goals a strategic context
- Allows the team to make trade-off decisions with a shared reference
- Prevents the backlog from becoming an incoherent list of features
- One Product Goal at a time — when achieved or abandoned, a new one is set
Example: "Enable freelancers to manage their entire client workflow from proposal to invoice in one platform"

SPRINT GOAL: SPRINT COHERENCE AND ANCHOR
The Sprint Goal is the commitment to the Sprint Backlog. It answers: "What is the single most important thing this Sprint must achieve?"
- Gives the Sprint Backlog coherence — selected items should serve the Sprint Goal
- Serves as the anchor when things go wrong mid-Sprint: "Does changing X serve the Sprint Goal?"
- Allows the team to adapt without losing direction — they can swap backlog items as long as the Sprint Goal remains achievable
- One Sprint Goal per Sprint, set during Sprint Planning
Example: "Users can complete the client onboarding flow end-to-end"

DEFINITION OF DONE: SHARED QUALITY STANDARD
The DoD is the commitment to the Increment. It answers: "What does Done actually mean?"
- Ensures that every Increment meets the minimum quality standard for release
- Prevents technical debt accumulation from "done enough" thinking
- Makes quality non-negotiable — if it doesn''t meet the DoD, it is not Done
- The DoD becomes stricter over time as the team''s capability grows

HOW THEY NEST
Product Goal (months to quarters) → Sprint Goal (weeks) → Definition of Done (every item)
Each level gives the next level its context. Sprint Goals serve the Product Goal. Items completing to the DoD serve the Sprint Goal. This nesting is what makes Scrum coherent at every level.'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 8 — Definition of Done & Quality (OFFSET 7)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 7;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 8 chapter not found for course %', v_course_id; END IF;

  -- order_index = 5: Quality gates
  UPDATE videos SET
    description = 'Quality gates are checkpoints in the development process where work cannot proceed unless specific criteria are met. In Scrum, quality gates are team commitments embedded in the Definition of Done and the workflow. This lesson covers the four core quality gates, why they are non-negotiable, and the compounding cost of bypassing them.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Quality gates',
      'description', 'Quality gates are checkpoints where work cannot proceed until criteria are met: code review, CI/automated testing, Definition of Ready, acceptance criteria. Each is a team commitment with a real cost when bypassed.',
      'transcript', 'QUALITY GATES

WHAT IS A QUALITY GATE?
A quality gate is a checkpoint at which work must meet defined criteria before it can proceed to the next stage. Quality gates are not optional inspections — they are stop points. Work that does not pass the gate does not move forward.

THE FOUR CORE QUALITY GATES IN SCRUM

GATE 1: DEFINITION OF READY (ENTRY GATE)
Before a story enters the Sprint, it must pass the Definition of Ready:
- The story is small enough to complete in one Sprint
- Acceptance criteria are written and understood by the team
- Dependencies are identified and resolved or mitigated
- The story has been estimated (if the team estimates)
Purpose: prevents half-understood stories from entering Sprints and becoming Sprint-blockers

GATE 2: CODE REVIEW GATE
Before code is merged, it must pass peer review:
- Logic correct and testable
- No known security vulnerabilities introduced
- Follows team coding standards
- Reviewer understands what the code does
Purpose: catches defects and knowledge-sharing gaps before they enter the codebase

GATE 3: CI / AUTOMATED TEST GATE
Before code is merged or deployed, all automated tests must pass:
- Unit tests pass
- Integration tests pass
- Regression suite passes
Purpose: prevents known regressions from entering the main branch; provides a safety net for rapid delivery

GATE 4: ACCEPTANCE CRITERIA GATE (EXIT GATE)
Before a story is marked Done, all acceptance criteria must be met — verified, not assumed.
Purpose: ensures the story delivers what was promised to the user

QUALITY GATES AS TEAM COMMITMENTS
Quality gates only work when the team treats them as non-negotiable. "We''ll clean it up later" is how technical debt accumulates. Every bypass of a quality gate is borrowing from the future with high interest rates.

THE COST OF BYPASSING GATES
- Bypassing at code review: catch defects in the next Sprint (cost: 5x)
- Bypassing at testing: catch defects in UAT (cost: 10x)
- Bypassing at acceptance criteria: catch defects in production (cost: 100x)'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- order_index = 7: Writing a strong DoD
  UPDATE videos SET
    description = 'A Definition of Done is only valuable if it is testable, team-owned, and applied without exception. This lesson explains what belongs in a DoD, what does not, how to write each criterion so it passes the binary yes/no test, and how the DoD should evolve as the team''s capability grows.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Writing a strong DoD',
      'description', 'A strong DoD has testable (binary yes/no) criteria, is team-owned, and becomes stricter over time. This lesson covers what belongs in it, what does not, and how to write each criterion effectively.',
      'transcript', 'WRITING A STRONG DEFINITION OF DONE

THE BINARY TEST
Every criterion in the Definition of Done must pass a binary test: is it done or is it not? If a criterion requires judgment to evaluate — "code is clean," "performance is acceptable" — it is not a good DoD criterion. Rewrite it until it is binary.

Example transformation:
- Weak: "code is well-tested"
- Strong: "unit test coverage for new code is at least 80%; all tests pass in CI"

WHAT BELONGS IN THE DOD

Code quality:
- All new code has been peer-reviewed by at least one other developer
- No known linting errors or static analysis warnings
- Code follows the team''s naming and structure conventions

Testing:
- Unit tests written for all new logic
- Automated test suite passes (unit + integration)
- No regression introduced in existing test suite

Integration:
- Feature is integrated with the main branch
- All integration tests pass
- No conflicts with other features released this Sprint

Documentation:
- API documentation updated (if applicable)
- User-facing help text updated (if applicable)
- Release notes entry created

Performance and security (when applicable):
- Performance benchmarks within agreed thresholds
- No new known security vulnerabilities introduced (security scan passed)

WHAT DOES NOT BELONG IN THE DOD

- Acceptance criteria: these are story-specific, not universal quality standards
- Release approval: the decision to release is the PO''s; it is not a quality criterion
- Business sign-off: the Sprint Review is the inspection event; sign-off is not a DoD criterion

THE DOD EVOLVES
The DoD should become stricter as the team''s capability grows. What starts as "all unit tests pass" may evolve to "unit test coverage at least 80% and mutation testing score at least 70%." Retrospectives are the right place to propose DoD improvements.'
    ))
  WHERE chapter_id = v_ch AND order_index = 7;

  -- order_index = 8: Quality under pressure
  UPDATE videos SET
    description = 'When delivery pressure builds, teams face a choice: cut scope or cut quality. Scrum''s answer is unambiguous — scope is flexible, Done standards are not. This lesson explains the cost of deferred quality, the distinction between scope flex and quality flex, and the Scrum Master''s role in facilitating scope negotiation with the Product Owner when the Sprint is at risk.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Quality under pressure',
      'description', 'When pressure builds: cut scope, never cut Done standards. This lesson explains deferred quality costs, scope vs. quality flex, and the SM''s role in facilitating scope negotiation with the PO.',
      'transcript', 'QUALITY UNDER PRESSURE

THE FUNDAMENTAL PRINCIPLE
When the Sprint is at risk — when the team realizes they cannot finish everything — there are two levers:
1. Scope flex: remove or defer stories from this Sprint (always valid)
2. Quality flex: ship something that does not meet the Definition of Done (never valid)

Scrum''s position is unambiguous: cut scope. Never cut Done.

WHY QUALITY FLEX IS A FALSE SHORTCUT

The cost of defects compounds at each stage:
- Defect caught during development: cost = 1x (fix it now)
- Defect caught in code review: cost = 3-5x (requires rework + review again)
- Defect caught in QA/testing: cost = 10x (requires rework + retesting + coordination)
- Defect caught in production: cost = 100x (incident response, customer impact, emergency fix, trust damage)

When teams bypass the DoD "just this once," they borrow from the future at 100x interest.

SCOPE FLEX IN PRACTICE
When the Sprint is at risk, the Scrum Master facilitates a conversation between the team and the PO:
- "We have committed to stories A, B, C, D, and E. We can complete A, B, and C to full Done by Friday. D and E are at risk. Which matters more to the Sprint Goal — D or E?"
- The PO makes the scope decision. The team makes the quality decision (they do not drop below the DoD).
- Result: two stories defer to the next Sprint; the Sprint Goal is still achieved with three stories done to the DoD.

THE SCRUM MASTER''S ROLE
- Surface the trade-off early: do not wait until the last day of the Sprint to raise scope risk
- Facilitate the scope conversation without taking sides — present the data, let PO decide
- Hold the line on Done: if a developer says "it''s basically done, we just need to skip testing," that is quality flex. The SM must name it and redirect.
- Make the cost of quality debt visible: use data from past Sprints where skipped DoD items became the next Sprint''s bugs'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 9 — Product Backlog Management & Refinement (OFFSET 8)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 8;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 9 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Backlog refinement patterns
  UPDATE videos SET
    description = 'Product Backlog Refinement is the ongoing activity of adding detail, order, and size to Product Backlog items. This lesson covers three effective refinement patterns — the weekly session, just-in-time refinement, and the three-amigos technique — along with the anti-patterns that turn refinement into over-specification or a PO monologue.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Backlog refinement patterns',
      'description', 'Three refinement patterns — weekly session, just-in-time, and three-amigos — with their trade-offs, plus the anti-patterns of over-refinement and treating refinement as specification.',
      'transcript', 'BACKLOG REFINEMENT PATTERNS

WHAT THE SCRUM GUIDE SAYS
"Product Backlog refinement is the act of breaking down and further defining Product Backlog items into smaller more precise items. This is an ongoing activity to add detail, order, and size to items."

Refinement is not a single event with a fixed timebox. It is an ongoing activity. However, most teams benefit from a structured refinement session within the Sprint to make it concrete and consistent.

PATTERN 1: WEEKLY REFINEMENT SESSION
Structure: 1 hour per week (approximately 10% of Sprint capacity)
Participants: PO + all Developers + SM (as facilitator)
Focus: the 2-Sprint look-ahead — refining items the team will likely need in the next Sprint

Best for: teams that need predictability and struggle to maintain a ready backlog
Trade-off: weekly cadence can become routine; ensure the session stays generative, not mechanical

PATTERN 2: JUST-IN-TIME REFINEMENT
Structure: small refinement conversations as needed, triggered by Sprint Planning readiness gaps
Participants: whoever needs to be involved for the specific item
Focus: the specific items at risk of entering the next Sprint unrefined

Best for: mature teams with strong backlog discipline and high trust between PO and Developers
Trade-off: requires discipline to avoid Sprint Planning surprises; needs clear readiness criteria

PATTERN 3: THREE-AMIGOS
Structure: a focused conversation on a specific story between three perspectives before it enters the backlog
Participants: Product Owner (what), Developer (how), QA/tester (what could go wrong)
Focus: alignment on requirements, approach, and test scenarios before full refinement

Best for: complex or risky stories where misalignment is costly to discover in Sprint Planning
Trade-off: more time-intensive per story; best used selectively, not for every item

ANTI-PATTERNS
- Over-refinement: specifying items 3+ Sprints ahead in detail. Waste — requirements change before the item is reached
- Refinement as specification: treating refinement sessions as requirements documentation. Refinement builds shared understanding, not documents'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 6: Value-based ordering
  UPDATE videos SET
    description = 'The Product Owner orders the backlog based on value — but "value" is more complex than it appears. This lesson introduces the WSJF (Weighted Shortest Job First) framework, the concept of cost of delay, and value decomposition. It also addresses the most common anti-pattern in backlog ordering: the loudest stakeholder wins.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Value-based ordering',
      'description', 'Value-based ordering uses WSJF (cost of delay / job duration), cost of delay analysis, and value decomposition to order the backlog objectively — replacing the "loudest stakeholder wins" anti-pattern.',
      'transcript', 'VALUE-BASED ORDERING

THE PO''S ORDERING ACCOUNTABILITY
The Scrum Guide gives the Product Owner one clear accountability: "The Product Owner is accountable for maximizing the value of the product resulting from the work of the Scrum Team." Ordering the backlog is how the PO exercises this accountability daily.

THE ORDERING FACTORS
Value is not one-dimensional. The PO must consider multiple factors simultaneously:
- User value: how much does this improve the experience or solve a user problem?
- Business value: what is the revenue, retention, or cost-reduction impact?
- Risk reduction: does this reduce technical, compliance, or market risk?
- Time criticality: does this lose value rapidly if delayed?
- Dependencies: must this be done before something else can start?

WEIGHTED SHORTEST JOB FIRST (WSJF)
WSJF is a prioritization model from SAFe: WSJF = Cost of Delay / Job Duration
- Cost of Delay = (user value + business value + risk reduction + time criticality)
- Job Duration = relative effort to complete
High cost of delay + short duration = do first. Low cost of delay + long duration = do later.

COST OF DELAY
Cost of delay asks: "What do we lose for every Sprint we delay this?"
- A regulatory compliance feature may cost millions per week of delay
- A nice-to-have UI improvement may cost virtually nothing
Items with high cost of delay should be ordered earlier regardless of their absolute value score.

VALUE DECOMPOSITION
Break large stories into smaller pieces and ask which piece delivers the most value alone. Often 80% of the value is in 20% of the work — that 20% should be first.

THE LOUDEST STAKEHOLDER ANTI-PATTERN
The most common ordering failure: the item that gets done next is the one the most senior or most vocal stakeholder requested last. This is political ordering, not value ordering. The PO''s job is to make ordering decisions based on value evidence, not organizational pressure. The SM can help by making the ordering criteria explicit and transparent.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 7: Refinement facilitation
  UPDATE videos SET
    description = 'Refinement facilitation focuses the session on building shared understanding — not writing requirements. This lesson covers the facilitation goal, the silence-before-discussion technique, how to write acceptance criteria in Given/When/Then format, and the planning poker technique for estimation. The key anti-pattern to avoid: the PO monologue.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Refinement facilitation',
      'description', 'Refinement facilitation builds shared understanding — not requirements. Key techniques: silence before discussion, Given/When/Then acceptance criteria, planning poker. Key anti-pattern to avoid: PO monologue.',
      'transcript', 'REFINEMENT FACILITATION

THE FACILITATION GOAL: SHARED UNDERSTANDING
The purpose of refinement is not to write the perfect story. It is for the whole team to reach shared understanding of what needs to be built, why it matters, and what Done looks like. Stories written after this conversation are reminders of that understanding — not substitutes for it.

SILENCE BEFORE DISCUSSION
The most powerful facilitation technique in refinement: before any discussion begins, give everyone 2 minutes of silent reading and thinking time.
Why: if discussion begins immediately, the first person to speak frames the entire conversation. Silence equalizes contribution by giving everyone time to form their own view before being influenced by others.
How: PO presents the story, then says "Take 2 minutes to read this and write your questions." Then open discussion.

ACCEPTANCE CRITERIA: GIVEN/WHEN/THEN
Acceptance criteria written in Given/When/Then (Gherkin) format create clarity and testability:
- GIVEN: the initial context or state
- WHEN: the action taken by the user
- THEN: the expected outcome

Example:
GIVEN a registered user who has not completed their profile
WHEN they log in for the first time
THEN they are redirected to the profile completion screen before accessing the dashboard

This format forces precision: you cannot write a vague THEN clause without noticing it immediately.

PLANNING POKER
Planning poker is a consensus-based estimation technique:
1. Each team member holds cards with values (1, 2, 3, 5, 8, 13, etc.)
2. PO reads the story. Brief discussion.
3. Everyone simultaneously reveals their estimate
4. Discuss outliers (highest and lowest) — what did they see that others missed?
5. Re-estimate until rough consensus

Value: the discussion triggered by estimate outliers is where the real shared understanding is built.

THE PO MONOLOGUE ANTI-PATTERN
Symptom: the PO speaks for 20 minutes explaining the story; Developers nod; no questions asked
What it signals: Developers do not feel safe to challenge or ask, OR they are disengaged
Fix: SM explicitly invites questions — "Before we estimate, what is unclear or risky about this story?" Then wait. Let silence work.'
    ))
  WHERE chapter_id = v_ch AND order_index = 7;

END $$;

-- =============================================================================
-- VERIFY ALL 18 MODULES
-- =============================================================================
SELECT
  c.order_index AS module,
  COUNT(v.id) AS lessons,
  SUM(CASE WHEN (v.translations->'en'->>'transcript') IS NOT NULL THEN 1 ELSE 0 END) AS with_transcript
FROM videos v
JOIN chapters c ON c.id = v.chapter_id
WHERE c.course_id = 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14'
GROUP BY c.order_index
ORDER BY c.order_index;
