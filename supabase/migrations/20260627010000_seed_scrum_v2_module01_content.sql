-- =============================================================================
-- Seed lesson content (description + EN transcript) for Scrum v2 Module 1
-- "Agile & Scrum Foundations (AI-Augmented)" — 9 lessons
--
-- How this works:
--   videos.description   → shown inline as lesson body text to the student
--   videos.translations  → JSONB; translations.en.transcript is fed to Prof.
--                          Didier as the lesson outline for his teaching prompt
--
-- Apply: paste into Supabase SQL Editor → Run
-- Verify: SELECT title, LEFT(description,60), translations->'en'->>'transcript' IS NOT NULL
--         FROM videos WHERE chapter_id IN (
--           SELECT id FROM chapters WHERE course_id = 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14'
--           AND order_index = 0
--         );
-- =============================================================================

DO $$
DECLARE
  v_course_id UUID := 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';
  v_chapter_id UUID;
BEGIN
  -- Resolve Module 1 chapter id (order_index = 0 is the first module)
  SELECT id INTO v_chapter_id
  FROM chapters
  WHERE course_id = v_course_id
  ORDER BY order_index
  LIMIT 1;

  IF v_chapter_id IS NULL THEN
    RAISE EXCEPTION 'Module 1 chapter not found for course %', v_course_id;
  END IF;

  -- ── Lesson 1: What Scrum is (and is not) ─────────────────────────────────
  UPDATE videos SET
    description = 'Scrum is a lightweight framework that helps teams deliver valuable products incrementally. It is NOT a methodology, process, or technique — it is a container within which you can employ various processes and techniques. Scrum is built on empiricism: transparency, inspection, and adaptation. It is used for complex problems where the solution is not known upfront. What Scrum is NOT: it is not a project management tool, not a set of engineering practices, not only for software (it works for any complex work), and not a rigid process that tells teams exactly what to do.',
    translations = jsonb_build_object(
      'en', jsonb_build_object(
        'title', 'What Scrum is (and is not)',
        'description', 'Scrum is a lightweight framework that helps teams deliver valuable products incrementally. It is NOT a methodology, process, or technique — it is a container within which you can employ various processes and techniques. Scrum is built on empiricism: transparency, inspection, and adaptation. It is used for complex problems where the solution is not known upfront. What Scrum is NOT: it is not a project management tool, not a set of engineering practices, not only for software (it works for any complex work), and not a rigid process that tells teams exactly what to do.',
        'transcript', 'WHAT SCRUM IS

Scrum is defined in the Scrum Guide as: "A lightweight framework that helps people, teams, and organizations generate value through adaptive solutions for complex problems."

Key characteristics of Scrum:
- Framework, not a methodology: Scrum provides structure (roles, events, artifacts) but leaves room for teams to decide how to do the work
- Empirical: decisions are based on what is known, not speculation
- Incremental: value is delivered in small, working increments called Sprints
- Self-managing: Scrum Teams decide internally who does what, when, and how
- Cross-functional: the team has all skills necessary to create value each Sprint

WHAT SCRUM IS NOT

Scrum is often misunderstood. It is NOT:
- A silver bullet that fixes all team problems
- A project management methodology (Scrum has no project manager role)
- Only for software development (Scrum is domain-agnostic)
- Prescriptive about engineering practices (those are separate)
- A way to make estimates more accurate by going faster
- Complete without technical practices like TDD, CI/CD, refactoring

THE SCRUM GUIDE DEFINITION

The Scrum Guide (2020) intentionally uses the word "framework" — not process, not methodology. This is deliberate: Scrum is the minimum viable set of rules to organize complex work. Everything else is a technique you choose to apply within it.

AI AUGMENTATION IN SCRUM

As an AI Scrum Master, you will use AI tools to: analyze Sprint velocity patterns, identify impediments before they become blockers, generate retrospective insights from team data, and automate routine Scrum ceremonies reporting. AI does not replace judgment — it amplifies it.'
      )
    )
  WHERE chapter_id = v_chapter_id
    AND (title ILIKE '%what scrum is%' OR order_index = 0);

  -- ── Lesson 2: Empiricism: transparency, inspection, adaptation ────────────
  UPDATE videos SET
    description = 'The three pillars of Scrum are transparency, inspection, and adaptation — collectively called empiricism. Transparency means the process and work must be visible to those responsible for the outcome. Inspection means Scrum artifacts and progress toward goals must be inspected frequently to detect variances. Adaptation means if any aspect of a process deviates outside acceptable limits, the process must be adjusted as soon as possible.',
    translations = jsonb_build_object(
      'en', jsonb_build_object(
        'title', 'Empiricism: transparency, inspection, adaptation',
        'description', 'The three pillars of Scrum are transparency, inspection, and adaptation — collectively called empiricism. Transparency means the process and work must be visible to those responsible for the outcome. Inspection means Scrum artifacts and progress toward goals must be inspected frequently to detect variances. Adaptation means if any aspect of a process deviates outside acceptable limits, the process must be adjusted as soon as possible.',
        'transcript', 'EMPIRICISM: THE FOUNDATION OF SCRUM

Scrum is founded on empirical process control theory, or empiricism. Empiricism asserts that knowledge comes from experience and making decisions based on what is known. Three pillars uphold empiricism:

PILLAR 1: TRANSPARENCY
Transparency requires that significant aspects of the process must be visible to those responsible for the outcome. This includes:
- A shared language: everyone must share a common understanding of what is being done
- The Definition of Done: must be shared and understood
- The Product Backlog: visible to all stakeholders
- The Sprint Backlog: visible to all Scrum Team members
Without transparency, inspection leads to wrong conclusions and adaptation is ineffective.

PILLAR 2: INSPECTION
Scrum users must frequently inspect Scrum artifacts and progress toward a Sprint Goal to detect undesirable variances. Inspection events in Scrum:
- Daily Scrum: inspect Sprint progress daily
- Sprint Review: inspect the Increment and adapt the Product Backlog
- Sprint Retrospective: inspect team processes and practices
- Sprint Planning: inspect the Product Backlog to select work

PILLAR 3: ADAPTATION
If an inspector determines that one or more aspects of a process deviate outside acceptable limits, and that the resulting product will be unacceptable, the process or the material being processed must be adjusted. An adjustment must be made as soon as possible to minimize further deviation.

AI APPLICATION: EMPIRICISM AMPLIFIED
AI tools amplify empiricism by: making patterns in data transparent that humans would miss, increasing inspection frequency through automated monitoring, and enabling faster adaptation through predictive analytics. Example: AI can detect Sprint Goal risk 3 days before the Sprint ends, giving the team time to adapt.'
      )
    )
  WHERE chapter_id = v_chapter_id
    AND (title ILIKE '%empiricism%' OR order_index = 1);

  -- ── Lesson 3: The Scrum Values ───────────────────────────────────────────
  UPDATE videos SET
    description = 'The five Scrum values are Commitment, Focus, Openness, Respect, and Courage. When these values are embodied by the Scrum Team, the three pillars of empiricism come to life and build trust. Commitment: the Scrum Team commits to achieving its goals. Focus: everyone focuses on the Sprint work and the goals. Openness: the Scrum Team and stakeholders are open about work and challenges. Respect: team members respect each other as capable, independent people. Courage: team members have the courage to do the right thing and work on tough problems.',
    translations = jsonb_build_object(
      'en', jsonb_build_object(
        'title', 'The Scrum Values',
        'description', 'The five Scrum values are Commitment, Focus, Openness, Respect, and Courage. When these values are embodied by the Scrum Team, the three pillars of empiricism come to life and build trust. Commitment: the Scrum Team commits to achieving its goals. Focus: everyone focuses on the Sprint work and the goals. Openness: the Scrum Team and stakeholders are open about work and challenges. Respect: team members respect each other as capable, independent people. Courage: team members have the courage to do the right thing and work on tough problems.',
        'transcript', 'THE FIVE SCRUM VALUES

The Scrum Guide 2020 defines five values that give direction to the Scrum Team with regard to their work, actions, and behavior. Successful use of Scrum depends on people becoming more proficient in living these values.

VALUE 1: COMMITMENT
The Scrum Team commits to achieving its goals and to supporting each other. Commitment is not about promising to finish a fixed scope — it is about commitment to the Sprint Goal, to quality, and to continuous improvement. The team commits to the definition of done.

VALUE 2: FOCUS
Everyone focuses on the work of the Sprint and the goals of the Scrum Team. The Daily Scrum exists to inspect progress toward the Sprint Goal, eliminating distractions. The Scrum Master protects the team's focus by removing impediments.

VALUE 3: OPENNESS
The Scrum Team and its stakeholders are open about the work and the challenges. This means being transparent in Sprint Reviews, raising impediments immediately in Daily Scrums, and being honest in Retrospectives — even when the truth is uncomfortable.

VALUE 4: RESPECT
Scrum Team members respect each other to be capable, independent people, and are respected as such by the people with whom they work. This means no micromanagement, trusting developers to determine how they do their work, and respecting the Product Owner''s authority over the Product Backlog.

VALUE 5: COURAGE
Scrum Team members have courage to do the right thing and work on tough problems. This includes: saying "no" when capacity is exceeded, raising impediments immediately, challenging ineffective processes, and giving honest feedback in Retrospectives.

HOW VALUES ENABLE EMPIRICISM
Without these values, the three pillars collapse: without courage, teams hide problems (no transparency); without openness, inspection is superficial; without commitment, adaptation is ignored. Values are not soft — they are the operating system that makes Scrum work.'
      )
    )
  WHERE chapter_id = v_chapter_id
    AND (title ILIKE '%scrum values%' OR order_index = 2);

  -- ── Lesson 4: Your AI co-pilot ───────────────────────────────────────────
  UPDATE videos SET
    description = 'As an AI-augmented Scrum Master, you have access to AI tools that amplify your effectiveness across all Scrum events and roles. Your AI co-pilot can help you: analyze team velocity trends, surface hidden impediments, generate retrospective insights, draft Sprint Goal statements, assess Product Backlog health, and predict delivery timelines. The key principle: AI handles the data analysis and pattern recognition so you can focus on the human side — coaching, facilitating, and servant leadership.',
    translations = jsonb_build_object(
      'en', jsonb_build_object(
        'title', 'Your AI co-pilot',
        'description', 'As an AI-augmented Scrum Master, you have access to AI tools that amplify your effectiveness across all Scrum events and roles. Your AI co-pilot can help you: analyze team velocity trends, surface hidden impediments, generate retrospective insights, draft Sprint Goal statements, assess Product Backlog health, and predict delivery timelines. The key principle: AI handles the data analysis and pattern recognition so you can focus on the human side — coaching, facilitating, and servant leadership.',
        'transcript', 'YOUR AI CO-PILOT: AMPLIFYING SCRUM MASTERY

The modern AI Scrum Master uses AI tools not to replace judgment — but to amplify it. This lesson maps your AI toolkit to each Scrum role and event.

AI IN SPRINT PLANNING
- AI analyzes historical velocity to right-size Sprint commitments
- AI surfaces dependencies between Product Backlog Items that humans miss
- AI generates initial Sprint Goal drafts based on product strategy
- Your role: validate, facilitate team discussion, finalize decisions

AI IN DAILY SCRUM
- AI monitors commit-to-done ratios in real time
- AI flags items at risk of not meeting the Sprint Goal before the Daily Scrum
- AI summarizes blockers across team channels (Slack, Jira, email)
- Your role: facilitate the 15-minute event, probe risks, remove impediments fast

AI IN SPRINT REVIEW
- AI generates velocity charts, burndown analysis, and stakeholder summaries
- AI identifies patterns in what was completed vs. forecasted over multiple Sprints
- AI drafts the "what we learned" section of the Sprint Review
- Your role: facilitate the collaborative conversation, capture product direction

AI IN RETROSPECTIVE
- AI analyzes team sentiment from retrospective data over time
- AI clusters feedback into themes and surfaces recurring impediments
- AI generates action item recommendations based on similar team patterns
- Your role: create psychological safety, facilitate, prioritize actions together

AI FOR BACKLOG HEALTH
- AI scores Product Backlog Items for readiness (INVEST criteria)
- AI identifies stale items, duplicates, and items blocking Sprint readiness
- AI estimates relative sizing based on historical similar items
- Your role: work with the Product Owner to refine and prioritize

PRINCIPLE: HUMAN JUDGMENT + AI PRECISION
AI is your data layer. You are the leadership layer. The best AI Scrum Masters use AI to answer "what is happening?" so they can focus entirely on "what should we do about it?"'
      )
    )
  WHERE chapter_id = v_chapter_id
    AND (title ILIKE '%ai co-pilot%' OR title ILIKE '%copilot%' OR order_index = 3);

  -- ── Lesson 5: Scrum Guide 2020 — Purpose & Definition ───────────────────
  UPDATE videos SET
    description = 'The Scrum Guide 2020 is the official definition of Scrum, authored by Ken Schwaber and Jeff Sutherland — the creators of Scrum. The 2020 revision simplified and clarified Scrum significantly: it removed the Development Team as a separate entity, renamed the team to "Developers," introduced Product Goal as a new commitment, and eliminated prescriptive elements to make Scrum more broadly applicable. The Scrum Guide is intentionally sparse — it defines the minimum necessary to implement Scrum.',
    translations = jsonb_build_object(
      'en', jsonb_build_object(
        'title', 'Scrum Guide 2020 — Purpose & Definition',
        'description', 'The Scrum Guide 2020 is the official definition of Scrum, authored by Ken Schwaber and Jeff Sutherland — the creators of Scrum. The 2020 revision simplified and clarified Scrum significantly: it removed the Development Team as a separate entity, renamed the team to "Developers," introduced Product Goal as a new commitment, and eliminated prescriptive elements to make Scrum more broadly applicable. The Scrum Guide is intentionally sparse — it defines the minimum necessary to implement Scrum.',
        'transcript', 'THE SCRUM GUIDE 2020: PURPOSE AND KEY CHANGES

WHAT IS THE SCRUM GUIDE?
The Scrum Guide is the official rulebook of Scrum. It defines Scrum: its accountabilities, events, artifacts, and the rules that bind them together. The guide is maintained by Ken Schwaber and Jeff Sutherland, who co-created Scrum in the early 1990s. The current version was released November 2020.

PURPOSE OF THE SCRUM GUIDE
The Scrum Guide provides the minimum viable definition of Scrum. It is intentionally sparse — only 13 pages. This is deliberate: Scrum is a framework, not a prescription. The guide defines the rules; teams decide how to implement them within their context.

KEY CHANGES IN THE 2020 REVISION

1. LESS PRESCRIPTIVE
The 2020 Guide removed prescriptive language about Daily Scrum questions ("What did I do yesterday?"). Now the Daily Scrum simply requires inspecting progress toward the Sprint Goal. Teams choose their format.

2. THE SCRUM TEAM
The 2020 Guide eliminated the "Development Team" as a sub-team. There is now one Scrum Team with three accountabilities: Scrum Master, Product Owner, and Developers (anyone who creates the Increment).

3. PRODUCT GOAL (NEW)
The 2020 Guide introduced "Product Goal" as a formal commitment of the Product Backlog. The Product Goal describes the future state of the product. The Product Backlog defines the work needed to achieve it.

4. SPRINT GOAL, DEFINITION OF DONE, PRODUCT GOAL
These three are now formally defined as "commitments" tied to the three artifacts. This gives each artifact a measurable target.

5. SELF-MANAGING (NOT SELF-ORGANIZING)
The 2020 Guide changed "self-organizing" to "self-managing." Teams now choose internally who does what, when, and how — not just how to organize. This reflects greater team autonomy.

SCRUM IS IMMUTABLE
The Scrum Guide states that Scrum''s rules are immutable. While it is possible to implement only parts of Scrum, the result is not Scrum. Scrum exists only in its entirety.'
      )
    )
  WHERE chapter_id = v_chapter_id
    AND (title ILIKE '%scrum guide%' OR title ILIKE '%2020%' OR order_index = 4);

  -- ── Lesson 6: Scrum Theory & Values sections ─────────────────────────────
  UPDATE videos SET
    description = 'This lesson goes deep into the theory sections of the Scrum Guide: the empirical process control theory that underpins Scrum, the three pillars in practice, and how the five Scrum values interact with the pillars. You will learn why trust is the output when values and pillars are lived — not a prerequisite. And you will learn why Scrum fails when teams apply the mechanics without internalizing the values.',
    translations = jsonb_build_object(
      'en', jsonb_build_object(
        'title', 'Scrum Theory & Values sections',
        'description', 'This lesson goes deep into the theory sections of the Scrum Guide: the empirical process control theory that underpins Scrum, the three pillars in practice, and how the five Scrum values interact with the pillars. You will learn why trust is the output when values and pillars are lived — not a prerequisite. And you will learn why Scrum fails when teams apply the mechanics without internalizing the values.',
        'transcript', 'SCRUM THEORY AND VALUES: DEEP DIVE

FROM THE SCRUM GUIDE: SCRUM THEORY

"Scrum is founded on empiricism and lean thinking. Empiricism asserts that knowledge comes from experience and making decisions based on what is observed. Lean thinking reduces waste and focuses on the essentials."

The combination of empiricism and lean thinking is deliberate: empiricism gives you the feedback loop, lean thinking ensures you only build what is essential.

THE EMPIRICAL LOOP IN PRACTICE

Every Sprint is an empirical loop:
1. PLAN based on what you know (Sprint Planning)
2. BUILD the highest-value items (Sprint execution)
3. INSPECT what was built (Sprint Review)
4. ADAPT based on findings (Retrospective + next Sprint Planning)
5. REPEAT

The loop shortens the feedback cycle from months (Waterfall) to weeks (Scrum) to days (continuous deployment with AI).

HOW VALUES ENABLE THE THREE PILLARS

TRANSPARENCY requires: Openness (willingness to show the real state) + Courage (willingness to show bad news)
INSPECTION requires: Focus (paying attention to what matters) + Commitment (to actually inspect, not skip)
ADAPTATION requires: Courage (to change direction) + Respect (trusting the team to change how they work)

TRUST: THE OUTPUT, NOT THE INPUT

The Scrum Guide states that "the Scrum Team members and stakeholders are open about the work and the challenges... these values give direction to the Scrum Team with regard to their work, actions, and behavior. The decisions that are made, the steps taken, and the way Scrum is used should reinforce these values, not diminish or undermine them."

Trust is not a precondition for Scrum. Trust is BUILT by consistently living the values over multiple Sprints. This is why Scrum feels uncomfortable in the first few Sprints — trust is being earned.

WHY SCRUM FAILS WITHOUT VALUES

Scrum without values becomes:
- Standups without transparency = status theater
- Retrospectives without courage = complaint sessions with no action
- Sprint Reviews without openness = demo theater
- Commitments without commitment = estimates that are never kept

The mechanics of Scrum (events, artifacts, accountabilities) are empty containers. The values are what fill them with meaning.'
      )
    )
  WHERE chapter_id = v_chapter_id
    AND (title ILIKE '%theory%' OR title ILIKE '%values section%' OR order_index = 5);

  -- ── Lesson 7: Agile Manifesto + 12 principles ────────────────────────────
  UPDATE videos SET
    description = 'The Agile Manifesto (2001) is the foundational document of the Agile movement. It declares four values and 12 principles. Scrum is one of many Agile frameworks built on these values and principles. Understanding the Manifesto helps you understand WHY Scrum is designed the way it is — and helps you make better decisions in situations the Scrum Guide does not prescribe.',
    translations = jsonb_build_object(
      'en', jsonb_build_object(
        'title', 'Agile Manifesto + 12 principles',
        'description', 'The Agile Manifesto (2001) is the foundational document of the Agile movement. It declares four values and 12 principles. Scrum is one of many Agile frameworks built on these values and principles. Understanding the Manifesto helps you understand WHY Scrum is designed the way it is — and helps you make better decisions in situations the Scrum Guide does not prescribe.',
        'transcript', 'THE AGILE MANIFESTO AND 12 PRINCIPLES

BACKGROUND
In February 2001, 17 software practitioners gathered at Snowbird, Utah, and created the Manifesto for Agile Software Development. Ken Schwaber and Jeff Sutherland — the co-creators of Scrum — were among the signatories.

THE FOUR AGILE VALUES

We value:
1. Individuals and interactions OVER processes and tools
2. Working software OVER comprehensive documentation
3. Customer collaboration OVER contract negotiation
4. Responding to change OVER following a plan

"That is, while there is value in the items on the right, we value the items on the left more."

HOW THE VALUES MAP TO SCRUM
Value 1 → Self-managing teams, cross-functional Scrum Teams, no "resource" language
Value 2 → Definition of Done, "done" Increment every Sprint
Value 3 → Product Owner as customer representative, Sprint Reviews with stakeholders
Value 4 → Empirical adaptation every Sprint, no fixed long-term plans

THE 12 AGILE PRINCIPLES (summarized)

1. Satisfy the customer through early and continuous delivery of valuable software
2. Welcome changing requirements, even late in development
3. Deliver working software frequently (weeks, not months)
4. Business people and developers must work together daily
5. Build projects around motivated individuals; trust them to get the job done
6. Face-to-face conversation is the most efficient communication method
7. Working software is the primary measure of progress
8. Agile processes promote sustainable development
9. Continuous attention to technical excellence enhances agility
10. Simplicity — maximizing the amount of work not done — is essential
11. Best architectures, requirements, and designs emerge from self-organizing teams
12. Regularly reflect and adjust behavior to become more effective

SCRUM AND THE MANIFESTO
Scrum embodies all 12 principles. The Sprint is the delivery cadence (Principle 3). The Sprint Review is customer collaboration (Principle 4). The Retrospective is Principle 12. The self-managing Scrum Team is Principles 5 and 11. Understanding the principles lets you resolve ambiguity in Scrum implementation without violating its intent.'
      )
    )
  WHERE chapter_id = v_chapter_id
    AND (title ILIKE '%manifesto%' OR title ILIKE '%12 principles%' OR order_index = 6);

  -- ── Lesson 8: Scrum in 10 minutes ────────────────────────────────────────
  UPDATE videos SET
    description = 'A rapid end-to-end walkthrough of how Scrum works in practice: from a Product Backlog of user needs, through Sprint Planning, into a 2-week Sprint with Daily Scrums, to a Sprint Review with stakeholders, and ending with a Retrospective. This lesson is designed to give you the mental model of a full Scrum cycle before you study each component in depth.',
    translations = jsonb_build_object(
      'en', jsonb_build_object(
        'title', 'Scrum in 10 minutes',
        'description', 'A rapid end-to-end walkthrough of how Scrum works in practice: from a Product Backlog of user needs, through Sprint Planning, into a 2-week Sprint with Daily Scrums, to a Sprint Review with stakeholders, and ending with a Retrospective. This lesson is designed to give you the mental model of a full Scrum cycle before you study each component in depth.',
        'transcript', 'SCRUM IN 10 MINUTES: THE COMPLETE CYCLE

THE SCRUM TEAM (30 seconds)
A Scrum Team has 10 or fewer members with three accountabilities:
- Product Owner: owns the WHAT (Product Backlog, product direction)
- Scrum Master: owns the HOW (process, coaching, impediment removal)
- Developers: own the BUILD (design, code, test, deliver the Increment)

THE PRODUCT BACKLOG (1 minute)
The Product Backlog is an ordered list of everything needed to improve the product. It is the single source of work for the Scrum Team. The Product Owner owns it. Items at the top are refined (small, clear, estimated). Items at the bottom are large and vague — they will be refined as they move up.

SPRINT PLANNING (2 minutes)
The team selects Product Backlog Items that can be completed in one Sprint (1-4 weeks, fixed length). They define the Sprint Goal — the single objective for the Sprint. Developers create the Sprint Backlog (the plan for how to achieve the Sprint Goal).

THE SPRINT (3 minutes)
During the Sprint:
- No changes are made that endanger the Sprint Goal
- Quality does not decrease
- The Product Backlog is refined as needed
- Scope may be clarified with the Product Owner

DAILY SCRUM (1 minute)
Every day, the Developers meet for 15 minutes to inspect progress toward the Sprint Goal and adapt the Sprint Backlog. Format is up to the team. The Scrum Master does not run this meeting — Developers own it.

SPRINT REVIEW (1.5 minutes)
At the end of the Sprint, the Scrum Team and stakeholders inspect the Increment (what was done) and the Product Backlog. The output is a revised Product Backlog reflecting what to do next. This is a working session, not a demo.

SPRINT RETROSPECTIVE (1.5 minutes)
The Scrum Team inspects how they worked — processes, tools, interactions — and identifies the most helpful changes. The top improvement becomes an actionable item in the next Sprint Backlog.

BACK TO SPRINT PLANNING
The cycle repeats. Every Sprint produces a potentially releasable Increment. Over time, the product evolves through empirical feedback. The Definition of Done ensures every Increment meets a consistent quality standard.

Total Scrum cycle: Sprint Planning → Daily Scrums → Sprint Review → Retrospective → repeat.'
      )
    )
  WHERE chapter_id = v_chapter_id
    AND (title ILIKE '%scrum in 10%' OR title ILIKE '%10 minutes%' OR order_index = 7);

  -- ── Lesson 9: Empiricism explained ───────────────────────────────────────
  UPDATE videos SET
    description = 'A deeper exploration of empiricism in the context of software and product development. Why did Scrum''s creators choose empiricism over defined processes? What is the Cynefin framework and how does it explain when Scrum is the right tool? This lesson connects the theory to real-world situations where empiricism beats prediction, and explores how AI amplifies each pillar of empirical process control.',
    translations = jsonb_build_object(
      'en', jsonb_build_object(
        'title', 'Empiricism explained',
        'description', 'A deeper exploration of empiricism in the context of software and product development. Why did Scrum''s creators choose empiricism over defined processes? What is the Cynefin framework and how does it explain when Scrum is the right tool? This lesson connects the theory to real-world situations where empiricism beats prediction, and explores how AI amplifies each pillar of empirical process control.',
        'transcript', 'EMPIRICISM EXPLAINED: WHY IT MATTERS

FROM THEORY TO PRACTICE

Empiricism in product development means: instead of trying to predict and plan everything upfront (which fails for complex problems), you build a little, learn a lot, and adapt continuously. This is the fundamental difference between Waterfall and Scrum.

THE CYNEFIN FRAMEWORK: WHEN TO USE EMPIRICISM

Dave Snowden''s Cynefin framework categorizes problems into five domains:

1. OBVIOUS/CLEAR: Known cause and effect. Best practice. (Example: payroll processing) → Use a defined process, not Scrum

2. COMPLICATED: Expert knowledge needed, but solutions exist. (Example: bridge engineering) → Use good practice, analysis, experts

3. COMPLEX: Cause and effect only understood in retrospect. No clear right answer. (Example: new product development, AI system design) → USE SCRUM. Probe, sense, respond. This is empiricism.

4. CHAOTIC: No cause and effect visible. Act to establish order. (Example: production outage) → Crisis management first, then Scrum

5. DISORDER: You don''t know which domain you''re in. → Gather more information

WHY SCRUM IS DESIGNED FOR COMPLEXITY
Most product development lives in the "Complex" domain. You don''t know what customers will want when they see it. You don''t know what the architecture should look like until you build it. You can''t predict what the market will do. In complex domains, empiricism is not just better — it is the only approach that works.

THE FAILURE OF PREDICTIVE PLANNING IN COMPLEXITY
The Standish CHAOS Report consistently shows that large, upfront-planned projects fail 60-80% of the time. Why? Because they operate in a Complex domain using Obvious-domain thinking (best practice, defined process). By the time the plan is finished, the context has changed.

HOW AI AMPLIFIES EMPIRICISM

TRANSPARENCY AMPLIFIED: AI makes invisible data visible — team health metrics, code quality trends, customer behavior patterns — creating radical transparency that humans cannot achieve manually.

INSPECTION AMPLIFIED: AI inspects continuously (not just at ceremony times) — flagging anomalies in real time rather than waiting for the Sprint Review.

ADAPTATION AMPLIFIED: AI recommends adaptations based on pattern matching across thousands of similar teams and situations — dramatically shortening the adaptation loop.

THE EMPIRICAL SCRUM MASTER
Your job as an AI-augmented Scrum Master is to institutionalize empiricism as a team practice: make everything visible, create the discipline to inspect it honestly, and build the courage to adapt quickly based on what you find.'
      )
    )
  WHERE chapter_id = v_chapter_id
    AND (title ILIKE '%empiricism explained%' OR order_index = 8);

  RAISE NOTICE 'Module 1 content seeded for chapter %', v_chapter_id;
END $$;

-- Verification query: run this after to confirm content was applied
SELECT
  v.order_index,
  v.title,
  LEFT(v.description, 60) AS description_preview,
  (v.translations->'en'->>'transcript') IS NOT NULL AS has_transcript,
  length(v.translations->'en'->>'transcript') AS transcript_chars
FROM videos v
JOIN chapters c ON c.id = v.chapter_id
WHERE c.course_id = 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14'
  AND c.order_index = 0
ORDER BY v.order_index;
