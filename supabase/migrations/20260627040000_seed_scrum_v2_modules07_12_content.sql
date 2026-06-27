-- =============================================================================
-- Seed lesson content (description + EN transcript) for Scrum v2 Modules 7–12
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================

DO $$
DECLARE
  v_course_id UUID := 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';
  v_ch UUID;
BEGIN

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 7 — Scrum Artifacts & Commitments
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 6;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 7 chapter not found'; END IF;

  UPDATE videos SET
    description = 'The Product Backlog is the single, ordered list of everything that is known to be needed in the product. Its commitment is the Product Goal — the long-term objective the team is working toward. Together they create transparency about the product''s future direction.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Product Backlog & Product Goal',
      'description', 'The Product Backlog is the single ordered list of everything needed in the product. Its commitment is the Product Goal — the team''s long-term objective.',
      'transcript', 'PRODUCT BACKLOG AND PRODUCT GOAL

WHAT IS THE PRODUCT BACKLOG?
The Product Backlog is the single, ordered source of work for the Scrum Team. It is:
- Owned by the Product Owner
- Continuously refined and reordered
- Never complete — it evolves as the product and environment change
- The only source from which Sprint Backlog items are drawn

Items higher on the Product Backlog are more refined, smaller, and ready for Sprint Planning. Items lower are larger, less defined, and will be refined as they move up.

THE PRODUCT GOAL
The Product Goal is the long-term objective the Scrum Team is working toward. It is the commitment for the Product Backlog. Every item in the backlog should contribute to achieving the Product Goal.

Characteristics of a strong Product Goal:
- Outcome-focused, not output-focused
- Achievable within a foreseeable horizon
- Guides backlog ordering decisions
- Understood by the whole team and key stakeholders

Example of a weak Product Goal: "Build the new customer portal"
Example of a strong Product Goal: "Enable customers to self-serve all tier-1 support requests without contacting an agent"

THE PRODUCT BACKLOG AS A STRATEGIC DOCUMENT
The Product Backlog is not just a task list. When properly maintained, it reflects the team''s strategic priorities, current understanding of user needs, and the path to the Product Goal. A healthy Product Backlog shows clearly: what is coming next and why.

PRODUCT BACKLOG ATTRIBUTES
Each Product Backlog item typically has: description, order, estimate, and value. The Scrum Guide does not prescribe a format — user stories are common but not required.

AI FOR THE PRODUCT BACKLOG
AI can help the PO: generate backlog item descriptions from customer feedback, identify duplicate or overlapping items, suggest ordering based on value/risk criteria, and draft Product Goal statements from strategic documents.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%product backlog%' OR order_index = 0);

  UPDATE videos SET
    description = 'The Sprint Backlog consists of the Sprint Goal, the selected Product Backlog items, and the plan for delivering the Increment. Its commitment is the Sprint Goal. The Sprint Backlog is a real-time picture of the Developers'' work and is updated throughout the Sprint.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Sprint Backlog & Sprint Goal',
      'description', 'The Sprint Backlog is the Sprint Goal plus selected items plus the delivery plan. It is a real-time picture updated by Developers throughout the Sprint.',
      'transcript', 'SPRINT BACKLOG AND SPRINT GOAL

THE SPRINT BACKLOG
The Sprint Backlog is created during Sprint Planning and updated by Developers throughout the Sprint. It contains:
1. The Sprint Goal (why)
2. The set of Product Backlog items selected for the Sprint (what)
3. An actionable plan for delivering the Increment (how)

The Sprint Backlog belongs to the Developers. Only Developers can change it during the Sprint. The Product Owner cannot add items to the Sprint Backlog without the Developers'' agreement.

THE SPRINT GOAL AS THE COMMITMENT
The Sprint Goal is the commitment for the Sprint Backlog. This means even if specific items change during the Sprint — because new information emerged or an item was more complex than expected — the Sprint Goal remains constant. The team adapts what they build but stays committed to the outcome.

UPDATING THE SPRINT BACKLOG
Developers update the Sprint Backlog continuously. Items can be decomposed into smaller tasks. New tasks are discovered and added. Remaining work is re-estimated. This is normal — the Sprint Backlog is a living plan, not a fixed contract.

WHAT THE SPRINT BACKLOG IS NOT
- Not a commitment to complete every item on the list
- Not a task assigned by the Scrum Master or manager
- Not frozen after Sprint Planning
- Not a record of all work done (only work planned toward the Sprint Goal)

SPRINT BACKLOG TRANSPARENCY
The Sprint Backlog should be visible to all stakeholders at all times. This transparency enables inspection: any stakeholder can see what the team is working on and whether the Sprint Goal is at risk.

AI FOR THE SPRINT BACKLOG
AI can analyze Sprint Backlog changes over time to identify patterns — for example, whether certain types of items consistently expand mid-Sprint, indicating estimation blind spots that the team should address in their next Retrospective.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%sprint backlog%' OR order_index = 1);

  UPDATE videos SET
    description = 'The Increment is the sum of all completed Product Backlog items in a Sprint, plus the value of all previous Sprints'' Increments. Its commitment is the Definition of Done. An Increment must be usable — regardless of whether the Product Owner decides to release it.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Increment & Definition of Done',
      'description', 'The Increment is the sum of all completed work that meets the Definition of Done. It must be usable every Sprint, regardless of release decision.',
      'transcript', 'INCREMENT AND DEFINITION OF DONE

THE INCREMENT
An Increment is the concrete stepping stone toward the Product Goal. Each Increment is additive to all prior Increments and thoroughly verified, ensuring all Increments work together.

Key characteristics:
- Must be usable: even if the PO decides not to release it, the Increment must be in a usable condition at the end of every Sprint
- Additive: each Sprint''s Increment builds on all previous Increments
- Verified: every item in the Increment meets the Definition of Done

MULTIPLE INCREMENTS PER SPRINT
A Scrum Team can create more than one Increment per Sprint. Each time a Product Backlog item meets the Definition of Done, a new Increment is born. These can be released individually — the Sprint Review is not required for release.

THE DEFINITION OF DONE AS THE COMMITMENT
The Definition of Done (DoD) is the commitment for the Increment. It is a formal description of the state that must be reached for the Increment to be usable. If a Product Backlog item does not meet the DoD, it is not part of the Increment and is returned to the Product Backlog.

WHAT "DONE" REALLY MEANS
"Done" is not "development complete" or "ready for testing." Done means the item meets all criteria in the Definition of Done — tested, integrated, documented to the agreed standard, and deployable (or deployed, depending on the DoD).

THE UNDONE WORK PROBLEM
Work completed but not meeting the DoD creates "undone work" — technical debt that accumulates Sprint over Sprint and eventually slows the team to a crawl. The Scrum Master''s job is to ensure the Definition of Done is real and enforced.

AI FOR INCREMENT QUALITY
AI tools can review code against the Definition of Done criteria, run automated quality checks, and flag items that are "developer done" but not "Definition of Done done" before they are marked complete in Jira.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%increment%' OR order_index = 2);

  UPDATE videos SET
    description = 'Transparency in Scrum means the process and work are visible to those responsible for the outcome. Without transparency, inspection is impossible. Without inspection, adaptation is impossible. Transparency is the foundation of the entire Scrum framework.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Transparency',
      'description', 'Transparency means the process and work are visible to those responsible for the outcome. Without it, inspection and adaptation are impossible.',
      'transcript', 'TRANSPARENCY IN SCRUM

WHY TRANSPARENCY IS FOUNDATIONAL
Scrum is built on empiricism. Empirical process control requires that the relevant aspects of the process be visible — transparent — to those making decisions. Without accurate information, every decision is based on assumption, not evidence.

WHAT MUST BE TRANSPARENT
In Scrum, the three artifacts (Product Backlog, Sprint Backlog, Increment) must be transparent enough to enable effective inspection. Transparency failures occur when:
- The Product Backlog does not reflect the team''s actual priorities
- The Sprint Backlog shows green when the Sprint is actually at risk
- The Increment is marked "Done" when it does not meet the Definition of Done
- Impediments are hidden rather than surfaced
- Velocity numbers are manipulated to appear more productive

THE SCRUM MASTER''S ROLE IN TRANSPARENCY
The Scrum Master is a champion of transparency — not just within the team, but with the organization. When management demands "green" status reports, the Scrum Master''s job is to ensure the actual status is visible, even when it is uncomfortable.

ARTIFACTS AS TRANSPARENCY TOOLS
Each artifact creates transparency about a specific aspect:
- Product Backlog: what is planned and in what order
- Sprint Backlog: what the team is working on right now and whether the Sprint Goal is at risk
- Increment: whether the team is producing usable, valuable work each Sprint

TRANSPARENCY REQUIRES COURAGE
Real transparency requires the courage to show bad news. Teams that hide problems to avoid management pressure create a false picture that leads to worse decisions. The Scrum Master builds psychological safety so honesty is possible.

AI FOR TRANSPARENCY
AI can detect transparency gaps — for example, flagging when Jira statuses have not been updated in multiple days, or when Sprint velocity claims don''t match Definition of Done records — giving the Scrum Master data to address hidden dysfunction.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%transparency%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 8 — Definition of Done & Quality
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 7;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 8 chapter not found'; END IF;

  UPDATE videos SET
    description = 'The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required. It is shared across the Scrum Team and, where relevant, enforced at the organizational level. Every team must have one.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Definition of Done',
      'description', 'The Definition of Done is a formal description of what "complete" means. Every Scrum Team must have one, and every Increment must meet it.',
      'transcript', 'DEFINITION OF DONE

THE DOD IS NOT OPTIONAL
The Scrum Guide is clear: if the Definition of Done is not a standard set by the organization, the Scrum Team must create a Definition of Done appropriate for the product. There is no "we do not have one yet" in Scrum.

WHAT A DEFINITION OF DONE INCLUDES
A DoD typically includes criteria across:
- Code quality: code reviewed, standards met, no known critical bugs introduced
- Testing: unit tests written and passing, integration tests passing, acceptance criteria verified
- Integration: feature integrated into the main branch, no regression introduced
- Documentation: internal documentation updated where required
- Deployment readiness: deployable to production (or deployed, if continuous delivery)
- Performance: meets performance benchmarks defined by the team

A WEAK VS. STRONG DEFINITION OF DONE

Weak DoD (common in teams new to Scrum):
- Code written
- Developer tested locally
- Merged to branch

Strong DoD:
- Code reviewed by at least one peer
- Unit test coverage above the team''s threshold
- All acceptance criteria verified by a non-author
- Integrated to main, CI pipeline passing
- Deployed to staging environment
- No P1/P2 bugs introduced
- Relevant documentation updated

THE DOD EVOLVES
The Definition of Done should strengthen over time. Each Retrospective is an opportunity to ask: "Is our DoD still appropriate? Are there quality criteria we should add?" A DoD that never changes suggests the team has stopped caring about quality improvement.

ORGANIZATIONAL VS. TEAM DOD
When multiple Scrum Teams work on the same product, they must adhere to the same Definition of Done. The organizational DoD is the minimum standard. Individual teams can make their DoD more stringent but never weaker.

AI FOR DEFINITION OF DONE
AI can review the team''s DoD against industry standards, suggest additional criteria based on the product type, and automate DoD checklist verification as part of the CI/CD pipeline.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%definition of done%' OR order_index = 0);

  UPDATE videos SET
    description = 'Quality is non-negotiable in Scrum. The Definition of Done exists to protect quality. When stakeholders pressure teams to "ship it now and fix it later," the Scrum Master''s job is to make the real cost of that decision visible.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Quality as non-negotiable',
      'description', 'Quality is non-negotiable. The DoD protects quality. When pressure to skip it arises, the Scrum Master makes the real cost visible.',
      'transcript', 'QUALITY AS NON-NEGOTIABLE

THE SCRUM GUIDE''S POSITION ON QUALITY
The Scrum Guide states that Developers instill quality by adhering to the Definition of Done. Quality is not a phase at the end of a Sprint — it is built in continuously. The Definition of Done is how the Scrum Team communicates their quality standard.

THE COST OF CUTTING QUALITY
When a team ships below their Definition of Done, they create technical debt. Technical debt is deferred work that accumulates interest: the longer it sits, the harder and more expensive it becomes to address. Teams that consistently ship below their DoD eventually find that most of their Sprint capacity goes to fixing past problems, not creating new value.

"SHIP IT NOW AND FIX IT LATER"
This is the most dangerous phrase in software delivery. It assumes:
1. There will be time later to fix it — rarely true, as new priorities always emerge
2. The cost of fixing it later will be comparable to fixing it now — always false, as the cost grows with time
3. The defect will be isolated — false, as defects that reach production affect users and erode trust

THE SCRUM MASTER''S RESPONSE TO QUALITY PRESSURE
When a stakeholder or manager says "can''t you just ship it without the tests this Sprint?", the Scrum Master''s response is to make the trade-off transparent: "We can ship it without meeting our Definition of Done. Here is what that means: [list specific risks]. The decision is yours to make as the Product Owner, but I want to ensure the risks are visible."

The Scrum Master does not make the quality decision — that belongs to the team and PO. The Scrum Master ensures the decision is made with full information.

PROTECTING THE DOD UNDER PRESSURE
The Scrum Master uses these tools to protect the DoD:
- Ensure the DoD is visible and agreed to by all stakeholders, not just the team
- Surface the cost of technical debt at Sprint Reviews
- Track undone work explicitly in the Product Backlog, not hidden

AI FOR QUALITY MONITORING
AI can analyze the relationship between DoD adherence and bug rates, velocity stability, and customer satisfaction over time — building a data-driven case for quality investment that speaks to business stakeholders in their language.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%quality as non%' OR order_index = 1);

  UPDATE videos SET
    description = 'CI/CD (Continuous Integration / Continuous Delivery) is the engineering practice that operationalizes the Definition of Done. When CI/CD is working well, the DoD is automated — every commit triggers a quality gate.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'DoD and CI/CD',
      'description', 'CI/CD operationalizes the Definition of Done — every commit triggers automated quality gates that verify the Increment meets agreed standards.',
      'transcript', 'DOD AND CI/CD

WHAT IS CI/CD?
Continuous Integration (CI): developers integrate their code into a shared branch frequently — ideally multiple times per day. An automated pipeline runs every time code is pushed: building the application, running tests, and flagging failures immediately.

Continuous Delivery (CD): the output of a successful CI pipeline is always in a deployable state. The team can release to production at any time, on demand.

WHY CI/CD IS A DEFINITION OF DONE ENABLER
A well-designed DoD includes criteria like: "All tests pass" and "No regression introduced." Without CI/CD, verifying these criteria is manual, slow, and error-prone. With CI/CD, they are verified automatically on every commit — making the DoD enforceable without human review of every item.

ELEMENTS OF A CI/CD QUALITY GATE ALIGNED WITH THE DOD
- Automated unit tests: pass/fail on every commit
- Code coverage threshold: e.g., minimum coverage before merge is allowed
- Static analysis: flagging code style violations, security vulnerabilities, known anti-patterns
- Integration tests: verifying that components work together
- Performance tests: catching regressions in response time or resource use
- Security scans: detecting known vulnerability patterns (OWASP Top 10)

THE SCRUM MASTER''S ROLE IN CI/CD
Scrum Masters are not expected to build CI/CD pipelines. Their role is to:
- Understand enough about CI/CD to recognize when its absence is an impediment
- Escalate broken pipelines as Sprint-blocking impediments
- Advocate for CI/CD investment as a quality and flow enabler
- Ensure the Definition of Done reflects the team''s actual automated checks

THE RELATIONSHIP BETWEEN CI/CD AND SPRINT CADENCE
Teams with strong CI/CD can confidently meet their Definition of Done every Sprint because quality verification is continuous, not a big-bang test at the end. This is the technical foundation of empirical delivery.

AI AND CI/CD
AI is being integrated into CI/CD pipelines for: automated code review, test generation from acceptance criteria, anomaly detection in build logs, and predictive failure analysis. The AI Scrum Master understands these tools and can coach teams on responsible integration.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%ci/cd%' OR title ILIKE '%dod and ci%' OR order_index = 2);

  UPDATE videos SET
    description = 'When stakeholders push to expand scope mid-Sprint or ship incomplete work, the Definition of Done and the Sprint Goal are the Scrum Master''s anchors. Holding the line protects the team, the product, and ultimately the organization.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scope vs. DoD',
      'description', 'When scope pressure or quality shortcuts arise, the Definition of Done and Sprint Goal are the Scrum Master''s anchors for protecting the team and product.',
      'transcript', 'SCOPE VS. DEFINITION OF DONE

THE TENSION
Two forces consistently threaten quality in Scrum teams:
1. Scope creep: adding work to a Sprint that the team didn''t plan for
2. DoD evasion: marking items Done without meeting quality criteria

Both are symptoms of the same underlying problem: short-term urgency overriding long-term health.

SCOPE CREEP DURING THE SPRINT
When new requests arrive mid-Sprint:
- From stakeholders directly to developers ("Can you just add this small thing?")
- From the Product Owner ("We need to fit this in before the demo")
- From management ("This is now the top priority")

The Scrum Master''s response: "Work not in the Sprint Backlog goes to the Product Backlog. The PO will order it. If it is urgent enough to displace existing Sprint work, that is a PO decision — made transparently, not quietly added."

The Scrum Guide allows Developers to negotiate Sprint Backlog content with the PO during the Sprint. But changes should not endanger the Sprint Goal.

DOD EVASION UNDER DEADLINE
"Let''s merge it now and create a tech debt ticket" is DoD evasion. The Scrum Master response: "If we merge without meeting our DoD, this item is not Done. It should not be counted as a completed Increment. Let''s be transparent about what we are actually delivering."

MAKING THE TRADE-OFF VISIBLE
Sometimes the business genuinely needs to ship something before it fully meets the DoD. In these cases, the Scrum Master''s role is not to prevent the decision but to ensure it is made deliberately:
- Document what DoD criteria were not met
- Create explicit backlog items for the remaining work
- Communicate the risk clearly to stakeholders
- Reflect on what drove the trade-off in the Retrospective

PROTECTING THE TEAM''S INTEGRITY
Developers who consistently ship below their DoD eventually stop believing in quality. The Scrum Master protects not just the product quality but the team''s professional pride and long-term motivation.

AI FOR SCOPE AND QUALITY TRACKING
AI can flag when new Jira tickets are added to an active Sprint without going through the Product Backlog, and when items are marked Done faster than their historical completion rate suggests — both signals of scope games or quality shortcuts.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%scope vs%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 9 — Product Backlog Management & Refinement
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 8;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 9 chapter not found'; END IF;

  UPDATE videos SET
    description = 'Refinement is the ongoing activity of adding detail, estimates, and order to Product Backlog items. It is not a single event — it is a continuous practice that keeps the backlog healthy and Sprint Planning efficient.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Refinement as a continuous activity',
      'description', 'Refinement is the ongoing practice of adding detail, estimates, and order to backlog items. It keeps the backlog healthy and Sprint Planning efficient.',
      'transcript', 'REFINEMENT AS A CONTINUOUS ACTIVITY

THE SCRUM GUIDE ON REFINEMENT
The Scrum Guide says Product Backlog refinement is the act of breaking down and further defining Product Backlog items into smaller more precise items. It is an ongoing activity, not a scheduled meeting. Developers and the Product Owner collaborate during refinement.

WHY CONTINUOUS REFINEMENT MATTERS
Sprint Planning is intended to be efficient — the team should not be discovering requirements and sizing work for the first time during Sprint Planning. If Sprint Planning consistently runs long and teams leave confused, it is a refinement problem.

HOW MUCH TIME ON REFINEMENT?
The Scrum Guide suggests no more than 10% of the Developers'' capacity on refinement. For a two-week Sprint, that is roughly one hour per developer per week. Most teams schedule 1–2 refinement sessions per Sprint, plus ongoing async refinement as questions arise.

WHAT HAPPENS IN REFINEMENT

1. Clarifying requirements: the PO explains the intended outcome; developers ask clarifying questions; acceptance criteria are written

2. Decomposition: large backlog items ("epics") are broken into smaller items that can be completed within a Sprint

3. Estimation: developers estimate the relative size of items — understanding, not commitment

4. Ordering input: developers surface technical dependencies that should influence the PO''s ordering decision

WHO ATTENDS REFINEMENT
At minimum: the Product Owner and Developers. The Scrum Master facilitates but does not own the content. Subject matter experts or key stakeholders may be invited for specific items.

BACKLOG HEALTH INDICATORS
A healthy Product Backlog:
- Has 1–2 Sprints'' worth of ready items at the top (refined, estimated, ordered)
- Has a visible Product Goal that links to item ordering
- Has larger, rougher items further down (these will be refined when they move up)
- Does not have hundreds of items with equal priority and no order rationale

AI FOR REFINEMENT
AI can pre-analyze backlog items and generate clarifying questions, draft acceptance criteria from user story descriptions, identify duplicate or overlapping items, and flag items that have been in the backlog unrefined for too many Sprints.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%refinement as%' OR order_index = 0);

  UPDATE videos SET
    description = 'Story splitting and acceptance criteria are the two most important refinement skills. Large backlog items must be split into pieces small enough to complete within a Sprint. Acceptance criteria define precisely what "done" means for each item.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Story splitting & acceptance criteria',
      'description', 'Story splitting and acceptance criteria are core refinement skills — splitting large items into Sprint-sized pieces and defining precise done conditions.',
      'transcript', 'STORY SPLITTING AND ACCEPTANCE CRITERIA

WHY SPLITTING MATTERS
Items too large to complete within a Sprint create risk: the team cannot deliver a usable Increment of that item in the Sprint. The solution is splitting — decomposing a large item into multiple smaller items, each of which delivers value independently.

STORY SPLITTING PATTERNS

By workflow step: "As a user, I can complete the entire checkout process" → split into: "view cart," "enter shipping info," "select payment method," "confirm order," "receive confirmation email"

By data variation: "Support all payment types" → split into: "credit card," "PayPal," "bank transfer" as separate items

By user role: "Admin and regular users can view reports" → split into separate items per role

By happy/unhappy path: build the happy path first; add error handling, edge cases, and validation in subsequent items

By interface and backend: some teams split between UI and API work, though this can create incomplete Increments — use carefully

THE ACCEPTANCE CRITERIA FORMULA
Acceptance criteria define exactly what the product must do for the item to be considered Done. A common format: Given [context], When [action], Then [expected outcome].

Example:
Given I am a logged-in user on the checkout page,
When I click "Complete Purchase" with all fields valid,
Then I see an order confirmation with my order number and receive a confirmation email within 2 minutes.

CHARACTERISTICS OF GOOD ACCEPTANCE CRITERIA
- Specific and testable: someone other than the author can verify them
- Written before development starts: they shape implementation decisions
- Agreed by PO and Developers: shared understanding, not the PO''s private definition
- Complete: they cover the main scenarios, not just the happy path

ACCEPTANCE CRITERIA VS. DEFINITION OF DONE
Acceptance criteria are specific to one backlog item. The Definition of Done applies to every item. An item is Done only when: it meets its acceptance criteria AND it meets the Definition of Done.

AI FOR STORY SPLITTING AND ACCEPTANCE CRITERIA
AI can take a large user story and generate splitting options, draft acceptance criteria in Given/When/Then format, and flag acceptance criteria that are too vague to be testable.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%story splitting%' OR order_index = 1);

  UPDATE videos SET
    description = 'Ordering the Product Backlog is the Product Owner''s most consequential decision. The Scrum Guide says the PO orders by value, but value is multidimensional — it includes user value, business value, learning value, and risk reduction.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Ordering by value & risk',
      'description', 'The PO orders the Product Backlog by value — which is multidimensional: user value, business value, learning value, and risk reduction.',
      'transcript', 'ORDERING BY VALUE AND RISK

THE PRODUCT OWNER''S ORDERING AUTHORITY
The Scrum Guide gives the Product Owner sole authority to order the Product Backlog. No one else can override this order — not management, not developers, not the Scrum Master. The team works on items in the order the PO sets.

WHY "VALUE" IS MULTIDIMENSIONAL
Value is not simply revenue. A backlog item''s value includes:

User value: how much does this improve the experience for the user?
Business value: how does this contribute to revenue, cost reduction, or strategic objectives?
Learning value: will this item teach us something we need to know to make better decisions in the future? (Important for early Sprints when uncertainty is high)
Risk reduction: does this item address a technical, security, or compliance risk that could block future work?
Dependencies: must this item be done before others can begin?

THE COST OF DELAY
One of the most powerful ordering frameworks is Cost of Delay (CoD): what is the cost of NOT doing this item right now? High CoD items are done first, even if their direct value seems lower — because waiting costs more.

RISK-DRIVEN ORDERING
High-risk items should generally be done early, not late. The logic: if a risky item will fail, it is better to discover that in Sprint 1 than Sprint 10, when the team has built everything around an assumption that turns out to be false.

THE SCRUM MASTER''S ROLE IN ORDERING
The Scrum Master does not order the backlog. They facilitate conversations that help the PO make better ordering decisions — surfacing technical risk, highlighting dependencies, and ensuring the team has input on items with significant technical complexity.

AI FOR ORDERING
AI can analyze customer feedback, support tickets, and usage data to surface value signals, model the Cost of Delay for top backlog items, and generate ordering recommendations that the PO then applies their judgment to.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%ordering by value%' OR order_index = 2);

  UPDATE videos SET
    description = 'The Scrum Master supports the Product Owner''s effectiveness — helping them manage the backlog, engage developers in refinement, and connect with stakeholders — without taking over the PO''s accountability.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Supporting the PO',
      'description', 'The Scrum Master supports the PO''s effectiveness — facilitating refinement, coaching on backlog management, and connecting stakeholders — without taking over PO accountability.',
      'transcript', 'SUPPORTING THE PRODUCT OWNER

THE SCRUM MASTER''S ROLE TOWARD THE PO
The Scrum Guide specifies that the Scrum Master serves the Product Owner by: helping find techniques for effective Product Goal definition and Product Backlog management, helping the team understand the need for clear and concise backlog items, and facilitating stakeholder collaboration as requested.

WHAT SUPPORTING LOOKS LIKE IN PRACTICE

Facilitating refinement: The Scrum Master facilitates refinement sessions so the PO can focus on content rather than process. The SM ensures all voices are heard, the session stays on time, and action items are captured.

Coaching on backlog management: New POs often struggle with prioritization, decomposition, and writing clear acceptance criteria. The Scrum Master coaches these skills — modeling good techniques without doing the PO''s work.

Connecting the PO to stakeholders: The Scrum Master helps the PO identify which stakeholders should be involved in Sprint Reviews, which stakeholder perspectives are missing from the backlog, and how to manage stakeholder expectations about delivery.

Protecting the PO from scope overload: When every stakeholder believes their requests are top priority, the Scrum Master helps the PO create a transparent, defensible ordering process — so the PO can say no with data.

THE BOUNDARY: NEVER TAKE THE PO''S ROLE
The Scrum Master must never: order the backlog on behalf of the PO, write acceptance criteria without the PO''s input, or make product decisions when the PO is unavailable. If the PO is consistently unavailable, the Scrum Master escalates this as an organizational impediment — they do not fill the accountability gap.

WHY A STRONG PO MATTERS
A weak or unavailable Product Owner is one of the most common sources of Scrum dysfunction. Without clear ordering and Product Goal, the team either picks work arbitrarily or waits for direction — both destroy value delivery.

AI FOR PO SUPPORT
The AI-enabled Scrum Master uses AI to generate draft backlog item descriptions for the PO to review, analyze feedback themes that should inform prioritization, and build stakeholder communication templates the PO can customize.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%supporting the po%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 10 — Empiricism, Transparency & Scrum Values
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 9;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 10 chapter not found'; END IF;

  UPDATE videos SET
    description = 'Empiricism in depth means understanding not just what the three pillars are, but how they interact and why they are necessary for complex work. Transparency enables inspection. Inspection enables adaptation. Remove any one pillar and the system collapses.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Empiricism in depth',
      'description', 'Empiricism: transparency enables inspection, inspection enables adaptation. All three pillars are interdependent — remove one and the system collapses.',
      'transcript', 'EMPIRICISM IN DEPTH

THE THREE PILLARS AND THEIR DEPENDENCY
Transparency → Inspection → Adaptation. These are not three independent principles. They are a chain:
- Without transparency, inspection is inspecting fiction
- Without inspection, adaptation is arbitrary change
- Without adaptation, transparency and inspection produce knowledge but no improvement

WHY COMPLEX WORK REQUIRES EMPIRICISM
In simple, well-understood work (like manufacturing), a detailed plan can be followed precisely. In complex work (product development), the solution is unknown at the start. Requirements evolve. Technology surprises. Markets shift. Empiricism is the only approach that handles this reality honestly.

Predict-then-execute (waterfall) assumes: we can know enough upfront to plan the entire solution. This assumption fails in complex domains.

Inspect-and-adapt (Scrum) assumes: we will learn as we go. Our plan is our best current knowledge and will change as we learn more. This assumption is always true in complex work.

THE CYNEFIN FRAMEWORK AND EMPIRICISM
The Cynefin framework (Dave Snowden) classifies problems into: Simple, Complicated, Complex, and Chaotic. Scrum is designed for the Complex domain — where cause and effect can only be understood in retrospect, and the right approach is to probe, sense, and respond. Empiricism is the mechanism for sensing and responding.

EMPIRICISM IN PRACTICE: FIVE SPRINT QUESTIONS
A Scrum Master who deeply understands empiricism asks these at the end of every Sprint:
1. Is our transparency improving? Are artifacts more accurate than last Sprint?
2. Are we inspecting the right things? Are our events surfacing what matters?
3. Are we actually adapting? Did our Retrospective action items change behavior?
4. Are our adaptation decisions based on evidence, or on assumption?
5. What are we still not seeing that we should be?

AI FOR EMPIRICAL PROCESS
AI amplifies empiricism by processing data the team cannot manually review: analyzing patterns across dozens of Sprints, detecting signal in customer feedback, and identifying leading indicators of Sprint risk before humans can see them.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%empiricism in depth%' OR order_index = 0);

  UPDATE videos SET
    description = 'Transparency radiators make the team''s work, progress, and impediments visible to everyone without asking. Physical or digital — information radiators push information to stakeholders rather than requiring them to pull it.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Transparency radiators',
      'description', 'Transparency radiators push information to stakeholders without requiring them to ask — making work, progress, and impediments continuously visible.',
      'transcript', 'TRANSPARENCY RADIATORS

THE CONCEPT
An information radiator (coined by Alistair Cockburn) is a display placed in a location where people can see it as they work. It shows project information so clearly that a passerby can understand it in seconds. Scrum transparency radiators make the team''s current state visible at all times.

EXAMPLES OF TRANSPARENCY RADIATORS

Sprint Goal display: the Sprint Goal posted prominently in the team space (physical or digital). Every decision during the Sprint is tested against this single statement.

Sprint Backlog board: columns showing items moving from "To Do" → "In Progress" → "Done." Updated daily by Developers. Anyone can see current state without asking.

Sprint burndown chart: remaining work plotted over Sprint days. A healthy chart trends toward zero. A flat or rising chart signals a problem — visible before the Sprint ends.

Impediment log: a visible list of current impediments, who owns them, and their status. Makes the team''s blockers impossible to ignore.

Team health indicators: a periodic check-in (often in the Retrospective) that captures morale, collaboration quality, and confidence in the Sprint Goal. When health drops, it is visible — not hidden.

DIGITAL TRANSPARENCY RADIATORS
Most remote and hybrid teams use digital boards (Jira, Azure DevOps, Linear). The Scrum Master ensures these are kept current. A Jira board with tickets stuck "In Progress" for a week is transparency theater — it looks like transparency but shows stale data.

THE SOCIAL LAYER OF TRANSPARENCY
Radiators are necessary but not sufficient. Some problems are not visible in artifacts:
- A developer struggling silently with a technical problem
- A team member conflict affecting collaboration
- An unspoken concern about a Sprint commitment

The Scrum Master creates space for these social transparency signals through 1:1s, team check-ins, and Retrospective formats that surface what the board does not show.

AI TRANSPARENCY TOOLS
AI dashboards can aggregate data from Jira, GitHub, and communication tools to generate real-time team health indicators, flag anomalies in Sprint data, and present executive-ready summaries that maintain transparency at the organizational level.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%transparency radiator%' OR order_index = 1);

  UPDATE videos SET
    description = 'The five Scrum values — commitment, focus, openness, respect, and courage — are not posters on a wall. They are behavioral standards that make the Scrum framework function. Under pressure, these values are tested. The Scrum Master models them.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Values under pressure',
      'description', 'The five Scrum values are tested under pressure. The Scrum Master models commitment, focus, openness, respect, and courage — especially when it is difficult.',
      'transcript', 'SCRUM VALUES UNDER PRESSURE

THE FIVE SCRUM VALUES
The Scrum Guide lists five values: Commitment, Focus, Openness, Respect, and Courage. These values are the behavioral foundation of Scrum. When the Scrum Team embodies them, Scrum''s pillars of transparency, inspection, and adaptation come to life.

COMMITMENT
Commitment is not "we promise to finish all items." It is commitment to the Sprint Goal, to quality, to each other, and to the team''s working agreements. Under pressure: when management demands more work than the team has capacity for, commitment to the Sprint Goal means holding the line.

FOCUS
During the Sprint, the team focuses on the Sprint Goal — not every idea, request, or distraction. Under pressure: when stakeholders arrive with "urgent" requests mid-Sprint, focus means directing them to the Product Backlog and protecting the Sprint Goal.

OPENNESS
Team members and stakeholders are open about all the work and challenges. Under pressure: when a developer is struggling with a complex problem, openness means asking for help rather than hiding it until the last day. The Scrum Master creates safety for openness.

RESPECT
Team members respect each other as capable, independent people. Under pressure: when a Sprint does not go well, respect means a retrospective that addresses systems and process — not blame. "The system failed" not "you failed."

COURAGE
Scrum Team members have the courage to do the right thing and work on tough problems. Under pressure: this is the most tested value. Courage means telling a stakeholder "no" when the request will endanger quality. Courage means admitting in the Sprint Review that the Increment is not what was expected.

THE SCRUM MASTER AS VALUES MODEL
The most powerful thing a Scrum Master does for values is model them personally. When the Scrum Master shows openness about their own mistakes, courage in surfacing uncomfortable truths, and respect for every team member — the team learns through observation what these values mean in practice.

AI FOR VALUES WORK
AI can analyze communication patterns (retro notes, standup transcripts, Slack data with permission) to surface moments where values are being lived or violated — giving the Scrum Master concrete, evidence-based coaching material.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%values under pressure%' OR order_index = 2);

  UPDATE videos SET
    description = 'Trust and psychological safety are the social foundation of empiricism. Without them, transparency is impossible — people hide bad news. Without transparency, inspection is based on false data, and adaptation leads to wrong decisions.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Trust & safety',
      'description', 'Trust and psychological safety are the social foundation of empiricism. Without them, transparency collapses and Scrum cannot function.',
      'transcript', 'TRUST AND PSYCHOLOGICAL SAFETY

THE RESEARCH BASIS
Amy Edmondson''s research at Google (Project Aristotle) and her decades of academic work establish psychological safety as the strongest predictor of team performance. The finding: high-performing teams are distinguished not by who is on them, but by whether members feel safe to take interpersonal risks — to speak up, ask questions, admit mistakes, and challenge ideas.

WHAT PSYCHOLOGICAL SAFETY IS
Psychological safety is the shared belief that the team is safe for interpersonal risk-taking. It is not: being nice, avoiding conflict, or protecting people from difficult feedback. It is the opposite: creating conditions where honest, sometimes difficult, conversations can happen without fear of punishment or humiliation.

WHY SCRUM NEEDS PSYCHOLOGICAL SAFETY
Every Scrum mechanism depends on honest communication:
- Daily Scrum: requires developers to surface impediments early
- Sprint Review: requires honest assessment of what was and was not accomplished
- Retrospective: requires candid discussion of what is not working
- Product Backlog refinement: requires developers to push back on unclear requirements

Without psychological safety, these events become theater. Developers say "everything is fine" in standups and hide problems until they explode.

BEHAVIORS THAT DESTROY PSYCHOLOGICAL SAFETY
- Public blame when a Sprint fails
- Dismissing ideas with "we tried that before"
- Punishing honesty: "I told you so" responses to problems developers surfaced early
- Management presence in Retrospectives that are supposed to be team-only spaces
- Inconsistent responses to mistakes: one person is praised for "learning," another is blamed

BUILDING SAFETY: SCRUM MASTER PRACTICES
- Model vulnerability first: share your own mistakes and learning in team settings
- Respond to bad news with curiosity, not judgment: "Tell me more" not "How did this happen?"
- Protect Retrospectives: keep management out unless the team explicitly invites them
- Celebrate the surfacing of problems: "Thank you for raising this early"
- Call out blame when it happens: "I want to make sure we''re focused on the process, not the person"

AI FOR PSYCHOLOGICAL SAFETY
AI can analyze retrospective notes for linguistic patterns indicating low safety (vague language, lack of personal disclosure, all positives and no negatives) and generate coaching prompts for Scrum Masters to address specific safety gaps.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%trust%safety%' OR title ILIKE '%trust & safety%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 11 — Facilitation Mastery
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 10;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 11 chapter not found'; END IF;

  UPDATE videos SET
    description = 'Facilitation fundamentals are the foundation of a Scrum Master''s event management. Neutrality, clear structure, and ensuring all voices participate are the three non-negotiable elements of effective facilitation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Facilitation fundamentals',
      'description', 'Facilitation fundamentals — neutrality, structure, and participation — are the foundation of effective Scrum event management.',
      'transcript', 'FACILITATION FUNDAMENTALS

THE FACILITATOR''S CORE COMMITMENT
A facilitator commits to three things: neutrality, structure, and full participation. Remove any one of these and facilitation degrades into a meeting someone is running.

NEUTRALITY
The facilitator does not advocate for a particular outcome. This is the hardest part for Scrum Masters, because they often have opinions. When facilitating, those opinions stay silent. The facilitator''s job is to create conditions for the group to reach the best outcome — not to reach the outcome the facilitator prefers.

Neutrality does not mean passivity. The facilitator actively manages: time, participation balance, topic focus, and group energy. Neutrality means not pushing an agenda.

STRUCTURE
Every effective facilitation has: a clear purpose, a sequence of activities that serve that purpose, and timeboxes for each activity. Without structure, conversations meander and groups leave without clear outcomes.

The structure for a Retrospective might be:
1. Set the stage (5 min) — check-in, establish safety
2. Gather data (15 min) — silent brainstorm on what happened
3. Generate insights (15 min) — cluster and discuss themes
4. Decide what to do (15 min) — select one or two improvements
5. Close (5 min) — commit to actions, capture notes

FULL PARTICIPATION
The loudest voices do not represent the group. Facilitation techniques like round-robins, silent brainstorming, and dot voting ensure quieter participants contribute equally. The facilitator watches for dominance patterns and gently redirects: "We''ve heard from a few voices — let''s make sure we hear from everyone."

FACILITATION VS. MANAGEMENT
Facilitation is temporary. The facilitator''s goal is to make themselves unnecessary. As the team matures, Scrum Masters gradually step back from facilitating events — the team owns them. A Scrum Master who is always needed to facilitate every event has not built a self-managing team.

AI FOR FACILITATION PREP
AI can generate facilitation scripts for any Scrum event, suggest techniques for specific group dynamics, and analyze post-session feedback to identify where facilitation broke down.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%facilitation fundamental%' OR order_index = 0);

  UPDATE videos SET
    description = 'Designing sessions means planning with purpose. Every Scrum event should be designed before it begins: what is the purpose, what outcomes do we need, what format will get us there, and how will we measure success?',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Designing sessions',
      'description', 'Designing sessions means planning with purpose — clear outcomes, appropriate formats, and measurable success criteria for every Scrum event.',
      'transcript', 'DESIGNING SESSIONS

THE DESIGN MINDSET
Most bad meetings fail before they begin — because no one designed them. Session design means intentionally answering: Why are we meeting? What specific outcomes do we need? What will we do to achieve those outcomes? How will we know we succeeded?

THE SESSION DESIGN CANVAS
Before facilitating any Scrum event, answer these questions:

Purpose: What is this event designed to accomplish? (Not "have a Sprint Review" — "inspect the Increment and adapt the Product Backlog based on stakeholder feedback")

Participants: Who needs to be in the room? Are any key voices missing? Are there voices that should NOT be present for psychological safety?

Outcomes: What specific decisions, commitments, or artifacts should result from this session?

Format: What facilitation techniques will best serve these outcomes? (Silent brainstorm, discussion, dot voting, gallery walk, etc.)

Energy arc: Where will participant energy be highest? Schedule demanding cognitive work early; reflection and synthesis after.

Materials: What do participants need to bring? What needs to be prepared in advance?

Time design: How many minutes for each segment? Where are the transitions?

DESIGNING A SPRINT RETROSPECTIVE

Poor design: "We''ll do Start/Stop/Continue for an hour."
Strong design:
- 5 min: Check-in (one word that describes your Sprint experience)
- 10 min: Silent brainstorm on sticky notes (Start/Stop/Continue)
- 10 min: Cluster similar notes together as a group
- 15 min: Discuss the two largest clusters — what is the story here?
- 10 min: Dot vote on the most impactful improvement to commit to
- 5 min: Action item — who owns what by when? Add to Sprint Backlog.
- 5 min: Close — appreciation round

ADAPTING IN THE ROOM
Session design is a plan, not a contract. If the group goes somewhere unexpectedly valuable, the skilled facilitator flexes the design to follow the energy — while keeping the purpose and outcomes in view.

AI FOR SESSION DESIGN
AI can generate session designs for any Scrum event in seconds, tailored to team size, maturity level, current sprint challenges, and the specific outcomes needed.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%designing session%' OR order_index = 1);

  UPDATE videos SET
    description = 'Difficult dynamics — dominant voices, silence, conflict, and disengagement — are inevitable in any team. The skilled Scrum Master has specific techniques for each pattern, turning dysfunction into productive group work.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Difficult dynamics',
      'description', 'Dominant voices, silence, conflict, and disengagement are inevitable. The skilled Scrum Master has specific techniques to handle each pattern productively.',
      'transcript', 'HANDLING DIFFICULT DYNAMICS

THE DOMINATOR
Symptom: one or two voices fill every conversation, others disengage or wait.
Impact: the group''s output reflects the dominator''s thinking, not the collective intelligence.
Techniques:
- Silent brainstorming before discussion: everyone writes ideas before anyone speaks, neutralizing the head start dominators get
- Round-robin: explicitly go around the room so every voice is heard
- Direct redirect: "Thank you — I want to make sure we hear from [person]. [Name], what''s your take?"
- Parking lot: when a dominator goes on too long, "That''s a rich topic — let me capture that and we''ll come back if we have time"

THE SILENT GROUP
Symptom: low participation, short answers, people deferring to others.
Impact: the facilitation produces shallow outputs; real concerns are hidden.
Root causes: low psychological safety, unclear expectations, or participants who prefer written expression over verbal.
Techniques:
- Anonymous input: use sticky notes or digital tools where inputs are not immediately attributed
- Smaller groups: break into pairs or triads — people speak more freely in smaller groups
- Permission-giving: "There are no wrong answers. The purpose of this activity is to surface our honest experience."
- Direct questions to specific people — done warmly: "I''d love to hear your perspective on this, [name]."

INTERPERSONAL CONFLICT
Symptom: tension between two or more participants that affects the group''s ability to work.
Techniques in-session:
- Name it neutrally: "I can sense there''s some tension here. Let''s make sure we''re focused on the process, not each other."
- Move to interests: "What is each of you most concerned about?" Conflict often dissolves when interests are stated rather than positions.
- Defer if needed: "This conversation is important and deserves more space than we have right now. Let''s schedule time for it separately."
Post-session: the Scrum Master follows up individually with each party.

DISENGAGEMENT
Symptom: participants are physically present but mentally absent (phones out, short answers, arriving late).
Root causes: the event is not seen as valuable, the format is not engaging, or there is an unspoken issue.
Techniques:
- Change the format: if discussion is producing disengagement, switch to movement, visual work, or individual writing
- Name it: "I notice energy is low. What would make this time more valuable for us?"
- Investigate: after the session, ask disengaged participants directly what would make it worth their time

AI FOR DIFFICULT DYNAMICS
AI can analyze patterns in retro notes and standup transcripts to identify recurring dynamics — for example, consistently fewer notes from certain team members, or patterns of agreement with no pushback — giving the Scrum Master advance warning.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%difficult dynamic%' OR order_index = 2);

  UPDATE videos SET
    description = 'The facilitation toolkit is a set of specific techniques the Scrum Master uses across Scrum events. A skilled facilitator matches the technique to the group''s need — not defaulting to the same format every time.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Facilitation toolkit',
      'description', 'The facilitation toolkit matches techniques to the group''s specific need — not defaulting to the same format every time.',
      'transcript', 'THE FACILITATION TOOLKIT

A rich facilitation toolkit lets the Scrum Master choose the right tool for the specific group, goal, and moment.

CORE TECHNIQUES

1-2-4-All (Liberating Structures):
- 1 minute: each person thinks individually
- 2 minutes: pairs discuss
- 4 minutes: pairs join into groups of 4
- All: groups share highlights with the full room
Best for: generating diverse ideas before group convergence. Especially effective in refinement and Retrospectives.

TRIZ (Liberating Structures):
Ask: "What would we have to do to guarantee the worst possible outcome for this Sprint?" Teams then identify what they are already doing that resembles those behaviors and agree to stop.
Best for: Retrospectives where teams are stuck in comfortable but ineffective patterns.

What, So What, Now What:
- What: what do we observe? (facts only)
- So What: what does it mean?
- Now What: what should we do?
Best for: Sprint Review reflection, post-incident analysis, and Retrospectives.

Lean Coffee:
Participants generate topics on sticky notes, dot-vote on which to discuss, and work through the ranked list with a timebox per topic.
Best for: unstructured retrospectives, team topic sessions, and knowledge-sharing meetings.

Fist to Five:
Ask for a decision. Participants hold up 0–5 fingers: 0 = I will block this, 5 = fully committed. Instant visible consent check.
Best for: Sprint Planning decisions, working agreement proposals, and Retrospective action items.

Team Temperature Check:
A quick opening activity: rate your current energy or confidence on a 1–5 scale, displayed simultaneously. Calibrates the facilitator and surfaces low-energy or concerned participants.
Best for: event openings, especially when Sprint context is tense.

SELECTING THE RIGHT TECHNIQUE
Ask: What is the group''s current state? (High energy vs. low, trusting vs. guarded, lots of ideas vs. stuck). Then select a technique that addresses that state while moving toward the session''s purpose.

AI FOR FACILITATION TOOLKIT SELECTION
AI can recommend facilitation techniques based on session purpose, team size, maturity, and current challenges — acting as a facilitation design partner for the Scrum Master.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%facilitation toolkit%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 12 — Coaching & Team Dynamics
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 11;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 12 chapter not found'; END IF;

  UPDATE videos SET
    description = 'The coaching stance is the Scrum Master''s most powerful posture. Instead of providing answers, the coach asks questions that help the coachee reach their own insights. This builds capability and ownership rather than dependency.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Coaching stance',
      'description', 'The coaching stance uses powerful questions to help coachees reach their own insights — building capability and ownership rather than dependency.',
      'transcript', 'THE COACHING STANCE

WHAT A COACHING STANCE IS
In a coaching stance, the Scrum Master''s role shifts from expert (providing answers) to coach (asking questions). The assumption is that the coachee — whether an individual developer, the PO, or the whole team — has the knowledge and capability to solve their own problems. The coach''s job is to help them access it.

THE COACHING MINDSET
The coach is: curious, not judgmental. Patient, not urgent. Believes in the coachee''s capability. Resists the urge to give the answer, even when they know it.

The expert is: directive, solution-focused, efficient in the short term. Creates dependency.

THE COACHING SPECTRUM
Scrum Masters use a spectrum of stances:
- Teaching: sharing knowledge the coachee genuinely doesn''t have
- Mentoring: sharing relevant personal experience
- Coaching: facilitating the coachee''s own thinking
- Facilitating: creating process so a group can solve together

Most Scrum Masters default to teaching when coaching would serve the team better long-term.

POWERFUL COACHING QUESTIONS
- "What have you already tried?"
- "What is the outcome you''re looking for?"
- "What is getting in the way?"
- "What options do you have?"
- "What would you do if you had no constraints?"
- "What support do you need to move forward?"
- "What does success look like for you?"
- "What are you learning from this?"

THE TRAP: COACHING WITH AN AGENDA
Coaching with a hidden agenda — asking questions to lead someone to your answer — is not coaching. It is manipulation. Genuine coaching follows the coachee''s thinking, not the coach''s preferred destination.

WHEN NOT TO COACH
Coaching is not always the right stance. If a team member genuinely lacks knowledge about Scrum theory, teach them. If there is an urgent safety or legal issue, be directive. The skilled Scrum Master knows which stance serves the moment.

AI FOR COACHING
AI role-play tools allow Scrum Masters to practice coaching conversations before real sessions. AI can simulate a resistant developer, an overloaded PO, or a team in conflict — giving the Scrum Master a safe space to develop their coaching muscle.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%coaching stance%' OR order_index = 0);

  UPDATE videos SET
    description = 'Team development follows predictable stages. Bruce Tuckman''s model — Forming, Storming, Norming, Performing — gives the Scrum Master a map for understanding where a team is and what kind of support they need at each stage.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Team development',
      'description', 'Team development follows predictable stages — Forming, Storming, Norming, Performing. The Scrum Master adapts their support to the team''s current stage.',
      'transcript', 'TEAM DEVELOPMENT

TUCKMAN''S STAGES OF TEAM DEVELOPMENT
Bruce Tuckman identified four stages that teams go through as they develop. Understanding these stages helps the Scrum Master know what kind of support the team needs — and what kind of interference will harm them.

FORMING
Characteristics: polite, cautious, unclear roles, high dependence on the Scrum Master
What the team needs: clear structure, psychological safety, role clarity
Scrum Master role: active — set up the framework, clarify accountabilities, facilitate working agreements
Sprint manifestation: Sprint Planning is slow, Daily Scrum is formal and brief, Retrospectives are surface-level

STORMING
Characteristics: conflict emerges, resistance to the framework, cliques may form, productivity dips
What the team needs: conflict resolution support, coaching, reaffirmation of shared purpose
Scrum Master role: coach conflict rather than suppress it. Storming is necessary for high performance. Teams that skip it stay stuck at mediocre.
Sprint manifestation: tense Retrospectives, Daily Scrum tension, disagreements in Sprint Planning

NORMING
Characteristics: conflict reduces, team develops shared norms, collaboration improves, self-management emerges
What the team needs: reinforcement of emerging positive patterns, continued coaching
Scrum Master role: gradually step back. Celebrate self-management moments. The team is beginning to own Scrum.
Sprint manifestation: Retrospectives generate real improvements, Daily Scrum runs without Scrum Master facilitation, Sprint velocity stabilizes

PERFORMING
Characteristics: high productivity, deep collaboration, self-managing, shared identity, Scrum Master rarely needed for process
What the team needs: challenge, new problems, autonomy
Scrum Master role: minimal interference in team operations. Focus shifts to organizational change and strategic coaching.
Sprint manifestation: consistently meet Sprint Goals, Definition of Done strengthens each Retrospective, team experiments with advanced practices

TEAMS REGRESS
New team members, organizational change, a difficult Sprint, or leadership pressure can push a team back to earlier stages. The Scrum Master recognizes regression signals and responds appropriately — not by assuming the team is "broken."

AI FOR TEAM DEVELOPMENT
AI can analyze Sprint patterns — velocity variance, retrospective sentiment trends, participation rates in events — to identify which development stage a team is in and recommend Scrum Master interventions.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%team development%' OR order_index = 1);

  UPDATE videos SET
    description = 'Conflict in teams is not inherently negative — healthy conflict is how teams surface different perspectives and make better decisions. The Scrum Master''s job is to help teams have productive conflict, not to eliminate it.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Conflict resolution',
      'description', 'Healthy conflict surfaces different perspectives and drives better decisions. The Scrum Master facilitates productive conflict — not its elimination.',
      'transcript', 'CONFLICT RESOLUTION

THE TWO TYPES OF CONFLICT
Productive conflict (task conflict): disagreement about ideas, approaches, and priorities. This generates better solutions when handled well. Teams that never disagree are not thinking critically.

Destructive conflict (relationship conflict): personal attacks, blame, or persistent interpersonal tension. This damages trust and psychological safety.

The Scrum Master''s goal is to channel task conflict productively and prevent or resolve relationship conflict.

WHY AVOIDING CONFLICT IS DANGEROUS
Teams that suppress conflict — because the Scrum Master or leader intervenes to smooth everything over — accumulate unresolved issues. These surface later as: passive resistance, disengagement, high turnover, or a sudden explosion.

The Scrum Master creates space for productive conflict to occur, not prevents it.

THE CONFLICT RESOLUTION LADDER

Step 1 — Self-resolution: when two team members are in conflict, the first step is direct, respectful conversation between them. The Scrum Master is not involved unless asked.

Step 2 — Scrum Master facilitation: if self-resolution fails or is attempted and escalated, the Scrum Master facilitates a conversation. The goals are: both parties feel heard, interests (not positions) are understood, a mutual path forward is identified.

Step 3 — Mediation: if Scrum Master facilitation fails, a neutral third-party mediator may be needed. This is rare and usually reserved for severe or persistent conflicts.

Step 4 — Escalation: persistent interpersonal conflict that affects team function may require HR or organizational leadership involvement. The Scrum Master escalates as an organizational impediment, not a personal failure.

COACHING THROUGH CONFLICT
When facilitating a conflict conversation:
- Ensure both parties feel heard before moving to solutions
- Separate facts from interpretations: "You said X" vs. "You meant Y"
- Focus on interests, not positions: "What do you need here?" not "What do you want the other person to do?"
- Seek understanding before agreement: they do not have to like each other, they have to be able to work together

AI FOR CONFLICT PATTERNS
AI can analyze team communication patterns to identify early warning signals of relationship conflict — such as decreased participation, negative linguistic sentiment, or exclusion of certain team members from key conversations.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%conflict resolution%' OR order_index = 2);

  UPDATE videos SET
    description = 'Emotional intelligence (EQ) is the Scrum Master''s most underrated skill. Self-awareness, self-regulation, empathy, and social skills determine how effectively a Scrum Master can coach, facilitate, and serve their team.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Emotional intelligence',
      'description', 'Emotional intelligence — self-awareness, self-regulation, empathy, and social skills — determines the Scrum Master''s effectiveness as coach and servant leader.',
      'transcript', 'EMOTIONAL INTELLIGENCE FOR THE SCRUM MASTER

WHAT EMOTIONAL INTELLIGENCE IS
Daniel Goleman''s model defines emotional intelligence as: Self-Awareness, Self-Regulation, Motivation, Empathy, and Social Skills. For Scrum Masters, these are professional capabilities, not personality traits.

SELF-AWARENESS
The ability to recognize your own emotions and how they affect your behavior. A Scrum Master who does not know they are frustrated will leak that frustration into facilitation, coaching, and team interactions — without realizing it.

Practice: keep a brief emotional journal. After significant interactions, note: what did I feel? How did I respond? What impact did my response have?

SELF-REGULATION
The ability to manage disruptive emotions and impulses. When a stakeholder demands more work than the team can handle, the effective Scrum Master does not respond with defensiveness or capitulation. They regulate their response and find a measured, clear position.

Practice: create a gap between stimulus and response. The simple act of pausing before responding gives self-regulation space to operate.

EMPATHY
The ability to understand the emotional experience of others. A Scrum Master with high empathy notices when a developer is struggling before they ask for help, senses when the team is anxious about a commitment, and understands why a Product Owner is under pressure.

Practice: in 1:1 conversations, prioritize understanding over advising. Ask: "What is this like for you?" before "Here is what I think you should do."

SOCIAL SKILLS
The ability to manage relationships and build networks. For Scrum Masters, this means: building trust with developers, maintaining credibility with the PO, and influencing organizational stakeholders who do not report to them.

EMOTIONAL INTELLIGENCE AND SERVANT LEADERSHIP
High EQ is what makes servant leadership real rather than theoretical. Without self-awareness, a Scrum Master cannot know when they are being directive. Without empathy, they cannot understand what the team needs. Without social skills, they cannot influence the organization.

AI AND EMOTIONAL INTELLIGENCE
AI cannot replace human emotional intelligence, but it can support its development: providing coaching practice scenarios, analyzing communication patterns for emotional tone, and surfacing moments where high-EQ responses would be most impactful.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%emotional intelligence%' OR order_index = 3);

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
  AND c.order_index BETWEEN 6 AND 11
ORDER BY c.order_index, v.order_index;
