-- =============================================================================
-- Seed lesson content (description + EN transcript) for Scrum v2 Modules 13–18
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================

DO $$
DECLARE
  v_course_id UUID := 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';
  v_ch UUID;
BEGIN

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 13 — Stakeholder Engagement & Communication
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 12;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 13 chapter not found'; END IF;

  UPDATE videos SET
    description = 'Stakeholder mapping identifies who has interest in or influence over the product, and determines how to engage each stakeholder appropriately. A clear stakeholder map prevents surprises at Sprint Reviews and keeps product direction aligned with organizational reality.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Stakeholder mapping',
      'description', 'Stakeholder mapping identifies who has interest in or influence over the product and determines how to engage each stakeholder appropriately.',
      'transcript', 'STAKEHOLDER MAPPING

WHY STAKEHOLDER MAPPING MATTERS
Scrum is not done in isolation. Every product exists within an organizational context — with people who fund it, use it, depend on it, or have authority over it. Stakeholder mapping creates a systematic understanding of that context, so the team is not surprised by unexpected demands, vetoes, or missing input.

THE POWER/INTEREST GRID
The most common stakeholder mapping tool places stakeholders on two axes:
- Power (high/low): do they have authority over the product or team?
- Interest (high/low): how much do they care about the product''s outcomes?

This creates four quadrants:
1. High power, high interest: manage closely — key stakeholders for Sprint Review, regular updates, involve in backlog decisions
2. High power, low interest: keep satisfied — they can block but are not engaged; keep them informed at the right level
3. Low power, high interest: keep informed — they care deeply and can be allies or vocal critics; give them visibility
4. Low power, low interest: monitor — minimal engagement; don''t let them consume the team''s time

THE PRODUCT OWNER''S ROLE IN STAKEHOLDER MANAGEMENT
The PO is the primary stakeholder relationship manager. The Scrum Master supports the PO by: facilitating stakeholder engagement conversations, helping the PO prioritize stakeholder relationships, and identifying organizational stakeholders whose absence is creating backlog gaps.

DYNAMIC STAKEHOLDER MAPS
Stakeholder maps are not static. New stakeholders emerge as the product grows. Some stakeholders change quadrants as the product becomes more significant to their work. Review the stakeholder map quarterly or when significant organizational changes occur.

AI FOR STAKEHOLDER MAPPING
AI can analyze email patterns, meeting invitations, and feedback sources to identify stakeholders who are influential but not currently engaged — surfacing blind spots in the stakeholder map that the PO and Scrum Master might have missed.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%stakeholder mapping%' OR order_index = 0);

  UPDATE videos SET
    description = 'Executive communication requires a different language than team communication. Executives care about outcomes, risk, and strategic alignment — not sprint velocity or technical implementation details. The Scrum Master helps translate between these two worlds.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Executive communication',
      'description', 'Executives care about outcomes, risk, and strategic alignment — not sprint velocity. The Scrum Master translates between team and executive language.',
      'transcript', 'EXECUTIVE COMMUNICATION

THE EXECUTIVE MINDSET
Executives operate at a different altitude than development teams. They are focused on: business outcomes (revenue, cost, risk, market position), strategic alignment (does this work serve the company''s direction?), and confidence (is this team capable of delivering?).

When a Scrum Master or PO reports velocity numbers, sprint completion rates, or technical debt to an executive, the executive hears noise, not signal. Translate into their language.

THE EXECUTIVE COMMUNICATION FRAMEWORK

Business outcomes first:
Not: "We completed 38 story points this Sprint."
Instead: "This Sprint we delivered the feature that enables customers to self-serve returns — based on our analysis, this should reduce support calls in this category."

Risk transparency:
Not: "We didn''t finish everything we planned."
Instead: "We identified mid-Sprint that the integration with the payment provider is more complex than estimated. We have a plan, but the full feature will not be ready until the next Sprint. We wanted to surface this now rather than at the end."

Confident uncertainty:
Not: "We don''t know when it will be done."
Instead: "Based on our current pace and what remains, our best forecast is [range]. We''ll know more after the next Sprint."

WHAT EXECUTIVES NEED FROM SCRUM
Executives who don''t understand Scrum often try to control by demanding: fixed-scope commitments, daily status reports, or certainty about long-range delivery dates. The Scrum Master''s job is to offer them something better than false certainty: empirical transparency.

"We can''t promise a fixed scope on a fixed date — but we can show you real progress every Sprint, tell you immediately when something changes, and give you an up-to-date probabilistic forecast at any time."

BUILDING EXECUTIVE CONFIDENCE
Executives trust teams that: deliver consistently, surface problems early (not hide them), explain their reasoning clearly, and demonstrate that their process generates results. The Sprint Review, done well, is the most powerful executive confidence-building tool in Scrum.

AI FOR EXECUTIVE COMMUNICATION
AI can transform Sprint Review outcomes and velocity data into executive-ready business narratives, generate risk briefings from impediment logs, and draft stakeholder update emails that speak in business outcome language.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%executive communication%' OR order_index = 1);

  UPDATE videos SET
    description = 'Expectation management is the practice of ensuring stakeholders have accurate, current understanding of what the team is delivering and when. The Scrum Master and PO create this through transparency, not through promising certainty they don''t have.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Expectation management',
      'description', 'Expectation management ensures stakeholders have accurate, current understanding of delivery. Transparency — not false certainty — is the foundation.',
      'transcript', 'EXPECTATION MANAGEMENT

THE CORE PRINCIPLE
Expectation management in Scrum is not about telling people what they want to hear. It is about ensuring their expectations reflect reality — even when reality is uncertain or disappointing. Managed expectations, even when the news is bad, build trust. False expectations destroy it.

THE EXPECTATION GAP
An expectation gap occurs when what a stakeholder expects and what the team can actually deliver are misaligned. Gap sources:
- A commitment made in a planning meeting before the team understood the full scope
- A stakeholder who interpreted "we''ll try to get this in" as "this is committed"
- An organization that regularly adds scope without updating the timeline
- A team afraid to surface scope or timeline changes early

HOW SCRUM CLOSES THE EXPECTATION GAP

Frequent, transparent delivery: Sprint Reviews give stakeholders real product every two weeks. This replaces month-long speculation with facts.

Clear Sprint Goals: when stakeholders know the Sprint Goal, they understand exactly what the team is focused on — and what they are not.

Explicit release decisions: in Scrum, the decision to release is separate from the decision to build. The PO communicates when releases are planned, based on current product state.

Backlog visibility: an ordered, visible Product Backlog lets stakeholders see what is coming, in what order, and what is not in scope — preventing "I thought we were doing X" surprises.

MANAGING THE "WHEN WILL IT BE DONE?" QUESTION
The most common expectation management challenge: "When will feature X be ready?"

Antipattern: "I don''t know, we can''t forecast in Scrum."
Better: "Based on our current pace and where this is in the backlog, our best forecast is [date range]. This could change if priorities shift or we learn something new — I''ll let you know as soon as we know more."

Scrum does not eliminate forecasting — it makes forecasts honest and living rather than false and fixed.

AI FOR EXPECTATION MANAGEMENT
AI can generate probabilistic delivery forecasts from velocity data, create stakeholder-ready timeline visualizations, and draft proactive expectation update communications when Sprint data shows risk of missing a planned date.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%expectation management%' OR order_index = 2);

  UPDATE videos SET
    description = 'The Scrum events are the primary mechanisms for structured stakeholder feedback. Understanding which event serves which stakeholder need — and ensuring the right stakeholders participate — maximizes the value of every Sprint.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The right events for feedback',
      'description', 'Each Scrum event serves a specific feedback purpose. Ensuring the right stakeholders participate in the right events maximizes every Sprint''s value.',
      'transcript', 'THE RIGHT EVENTS FOR FEEDBACK

SCRUM AS A FEEDBACK SYSTEM
Every Scrum event is a feedback opportunity. The framework is structured to create multiple feedback loops at different cadences and levels of abstraction. The Scrum Master''s job is to ensure each event serves its feedback purpose — not just to make events happen.

FEEDBACK BY EVENT

Sprint Planning (input to the team):
Stakeholder input at this stage is indirect — through the ordered Product Backlog. The PO brings the stakeholder voice into Sprint Planning through the Product Goal and backlog ordering. Stakeholders do not attend Sprint Planning.

Daily Scrum (team-internal feedback):
This is not a stakeholder event. The team gives itself feedback daily on its progress toward the Sprint Goal. No external stakeholders attend.

Sprint Review (product feedback from stakeholders):
This is the primary stakeholder feedback event. Done well, Sprint Review generates: feedback on the Increment, updated understanding of priorities, stakeholder input on the Product Backlog, and market/business context that should affect future direction.

Sprint Retrospective (process feedback within the team):
This is team-internal. Stakeholders do not attend. The team inspects its own process and relationships.

MAKING THE SPRINT REVIEW WORK AS A FEEDBACK EVENT
The most common Sprint Review failure: a demo where developers show features to a passive audience that nods politely. This produces no useful feedback.

A Sprint Review designed for feedback:
- Shares the Sprint Goal and asks: "Did we achieve what we set out to?"
- Demonstrates working software and invites specific, not general, reactions
- Asks direct questions: "What would make this more valuable?" "What are we missing?" "What should we prioritize next?"
- Closes with a collaborative backlog discussion: given what we just learned, what should change?

CREATING STAKEHOLDER FEEDBACK CHANNELS BEYOND EVENTS
Sprint Reviews are every two weeks (or monthly). Between events, the PO maintains stakeholder relationships through: informal check-ins, shared product metrics, and proactive communication when significant decisions are made.

AI FOR FEEDBACK SYNTHESIS
AI can synthesize stakeholder feedback from Sprint Reviews — clustering themes, identifying patterns across multiple Sprints, and generating Product Backlog suggestions based on the feedback themes. This turns a conversation into actionable data within minutes.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%right events%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 14 — Organizational Change & Removing Impediments
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 13;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 14 chapter not found'; END IF;

  UPDATE videos SET
    description = 'Organizational change is complex and non-linear. Understanding models like Kotter''s 8 Steps, ADKAR, and the Satir Change Model gives the Scrum Master a vocabulary and framework for navigating the human dimensions of Scrum adoption.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Change models',
      'description', 'Change models like Kotter''s 8 Steps, ADKAR, and Satir give the Scrum Master a framework for navigating the human dimensions of organizational change.',
      'transcript', 'CHANGE MODELS FOR SCRUM MASTERS

WHY CHANGE MODELS MATTER
Introducing Scrum into an organization is a change management challenge. Teams resist, managers object, and processes built over years do not simply yield to a new framework. Understanding how change works — psychologically and organizationally — equips the Scrum Master to navigate resistance rather than be defeated by it.

KOTTER''S 8-STEP CHANGE MODEL
John Kotter''s model describes change as a sequence:
1. Create urgency — help people see why change is necessary
2. Build a guiding coalition — find the early adopters and champions
3. Form a strategic vision — make the desired state vivid and compelling
4. Enlist a volunteer army — broaden the coalition
5. Enable action by removing barriers — this is pure Scrum Master work
6. Generate short-term wins — Sprint Reviews are natural short-term wins
7. Sustain acceleration — maintain momentum as novelty fades
8. Institute change — embed Scrum in culture, not just process

Kotter''s insight most relevant to Scrum Masters: steps 1–4 are about creating readiness. If you skip to step 5 (removing barriers) without urgency and coalition, you are removing barriers nobody cares about.

ADKAR MODEL
Prosci''s ADKAR describes what individuals need for change to stick:
- Awareness: why is change needed?
- Desire: what is in it for me?
- Knowledge: how do I change?
- Ability: can I actually do it?
- Reinforcement: what keeps the change in place?

Scrum adoptions often fail because organizations jump to Knowledge (training) without creating Awareness and Desire. The result: people know Scrum theory but do not use it, because they never understood why.

SATIR CHANGE MODEL
Virginia Satir''s model captures the emotional curve of change:
Old Status Quo → Foreign Element (Scrum introduction) → Chaos → Transforming Idea → Practice & Integration → New Status Quo

The chaos phase is critical. This is the Storming period — when things get harder before they get better. Scrum Masters who abandon the approach during Chaos are one step away from the transformation that would have followed.

AI FOR CHANGE MODELING
AI can analyze adoption signals (event attendance, velocity trends, retrospective sentiment) to identify where an organization is in the change curve, and recommend interventions matched to the current phase.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%change model%' OR order_index = 0);

  UPDATE videos SET
    description = 'Systemic impediments exist beyond the team''s boundary — in organizational processes, policies, culture, and structure. These are the Scrum Master''s most challenging and most impactful targets. Removing them unlocks team potential that no within-team improvement can achieve.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Systemic impediments',
      'description', 'Systemic impediments exist in organizational processes, policies, and culture. Removing them unlocks potential no within-team improvement can achieve.',
      'transcript', 'SYSTEMIC IMPEDIMENTS

WHAT MAKES AN IMPEDIMENT SYSTEMIC
A team-level impediment is something the team can resolve: a developer needs a new tool, a process needs to be streamlined, two team members need to have a conversation. A systemic impediment requires organizational action: a policy must change, a department must collaborate differently, leadership must make a structural decision.

COMMON SYSTEMIC IMPEDIMENTS

Approval gatekeeping: every architectural decision requires sign-off from a central committee with a two-week meeting cadence. This creates a two-week latency on every decision the team makes. The Scrum Master''s response: document the impediment, calculate the cost (days waiting per Sprint), and propose an alternative governance model.

Shared resources: a key expert (security, legal, DBA) is shared across multiple teams. When the team needs them, they are unavailable. The Scrum Master surfaces this as a structural impediment — not a team problem.

Organizational debt: legacy processes built for waterfall delivery that conflict with empirical working. Examples: quarterly planning that freezes priorities for three months, budget cycles that require scope commitment before the team knows enough to commit accurately, HR performance review systems that rate individuals rather than teams.

Cultural resistance: managers who believe Scrum is "just for teams" and continue making technical decisions, assigning tasks, or creating shadow backlogs. The Scrum Master addresses this through education, coaching, and transparent escalation of the pattern.

THE SCRUM MASTER''S ESCALATION APPROACH
Systemic impediments require the Scrum Master to operate at the organizational level. This means:
1. Document the impediment clearly: what it is, what it costs (in time, quality, or morale)
2. Identify the right organizational owner — who has authority to make this change?
3. Propose a specific, feasible solution — not just naming the problem
4. Use data: quantified cost of the impediment is more persuasive than description
5. Escalate transparently: make it visible in Sprint Reviews and organizational reporting

AI FOR SYSTEMIC IMPEDIMENT ANALYSIS
AI can aggregate impediment logs across Sprints, identify clusters and patterns, calculate the accumulated cost of recurring impediments, and generate executive briefings that make the systemic case for organizational change.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%systemic impediment%' OR order_index = 1);

  UPDATE videos SET
    description = 'The Scrum Master leads organizational change without formal authority over the people they need to influence. Influence without authority requires credibility, relationship capital, and strategic framing — not positional power.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Influence without authority',
      'description', 'The Scrum Master leads change without formal authority — through credibility, relationship capital, and strategic framing rather than positional power.',
      'transcript', 'INFLUENCE WITHOUT AUTHORITY

THE SCRUM MASTER''S PARADOX
The Scrum Master is accountable for organizational effectiveness of Scrum. But the Scrum Master has no authority over the organization. They cannot mandate that management change behavior, that a department change its process, or that a policy be rewritten. They must achieve these outcomes through influence.

THIS IS NOT A WEAKNESS — IT IS THE DESIGN
Servant leadership is influence-based leadership. A Scrum Master who relies on authority to drive change is not practicing servant leadership. The ability to create change without authority is the highest-value form of organizational influence.

THE FOUNDATIONS OF INFLUENCE WITHOUT AUTHORITY

Credibility: people are influenced by those they respect and trust. Build credibility through: consistent delivery on commitments, deep Scrum knowledge, demonstrated results, and professional integrity.

Relationship capital: invest in relationships before you need them. The Scrum Master who has built genuine relationships with managers, executives, and stakeholders can call on those relationships when resistance to change emerges.

Coalition building: identify allies who share the Scrum Master''s vision for how the organization could work better. Two voices are more persuasive than one; five voices begin to look like momentum.

Strategic framing: resistance to change often comes from misunderstanding or misaligned interest. Reframe change in terms the resistant party cares about: "This change will reduce the last-minute escalations you deal with" is more persuasive than "This change will help the team be more agile."

Data and evidence: influence is strongest when backed by evidence. Use Sprint data, impediment logs, and industry research to make the case for organizational change. "Our data shows that this approval process costs the team an average of three days per Sprint" is more persuasive than "the approval process is slow."

THE LONG GAME
Organizational change through influence is slow. The Scrum Master who expects immediate results will be disappointed and may push too hard, destroying relationship capital. The mindset: plant seeds, water them, and trust that empirical evidence and relationship investment compound over time.

AI FOR INFLUENCE STRATEGY
AI can generate influence strategy documents: analyzing the stakeholder map, identifying the most likely allies, framing change proposals in the language of each key stakeholder, and drafting communications that address specific resistance patterns.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%influence without authority%' OR order_index = 2);

  UPDATE videos SET
    description = 'Agile transformation is the process of moving an organization from a predictive, plan-driven approach to an empirical, adaptive one. Most transformations fail not from lack of knowledge about Agile, but from underestimating the cultural and structural change required.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Agile transformation basics',
      'description', 'Agile transformation moves organizations from predictive to empirical delivery. Most fail not from lack of Agile knowledge, but from underestimating cultural and structural change.',
      'transcript', 'AGILE TRANSFORMATION BASICS

WHAT AGILE TRANSFORMATION IS
Agile transformation is not installing Scrum. It is changing how an organization thinks about work, planning, risk, and leadership. Scrum is often the catalyst, but the transformation is cultural and structural — not just methodological.

WHY MOST TRANSFORMATIONS FAIL
Research consistently shows that most large-scale Agile transformations fail to achieve their goals. Common failure patterns:

Scrum vocabulary, waterfall thinking: teams use Scrum terminology but continue to plan in quarters, commit to fixed scope, and report status as green regardless of reality.

Transformation without executive sponsorship: Scrum is installed at the team level without changing management practices. Teams become agile; managers stay waterfall. Conflict is inevitable.

Process over principles: organizations focus on implementing Scrum ceremonies rather than understanding the empirical principles behind them. Events happen, but the benefits of empiricism don''t materialize.

Big-bang rollout: all teams "go Agile" simultaneously, creating chaos and overwhelming change management capacity. Better: start with one or two teams, build evidence, learn, and expand.

Ignoring the human dimension: change is hard for people. Technical training is necessary but insufficient. Emotional resistance, loss of status (for project managers), and fear of failure all require attention.

WHAT SUCCESSFUL TRANSFORMATIONS LOOK LIKE
- Start with a clear problem statement: why Agile, and what outcome are we seeking?
- Executive sponsorship with real behavioral change at the leadership level
- Pilot teams with strong Scrum Masters who can demonstrate results
- Visible short-term wins that build organizational confidence
- Regular retrospectives at the transformation level (not just team level)
- Patience: meaningful cultural change takes years, not quarters

THE SCRUM MASTER''S ROLE IN TRANSFORMATION
Scrum Masters are the foot soldiers and sometimes the generals of Agile transformation. Their role includes: modeling Scrum principles, coaching resistant managers, surfacing organizational impediments, and connecting team-level results to organizational strategy.

AI FOR TRANSFORMATION TRACKING
AI can analyze transformation health across teams — aggregating Sprint data, retrospective sentiment, and impediment patterns to create organization-wide visibility into which teams are thriving, which are struggling, and what systemic patterns are blocking transformation success.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%agile transformation%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 15 — Agile Metrics, Flow & Forecasting
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 14;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 15 chapter not found'; END IF;

  UPDATE videos SET
    description = 'Flow metrics — throughput, cycle time, work in progress, and item age — give teams objective data about how work moves through their system. They surface bottlenecks and improvement opportunities that subjective observations miss.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Flow metrics',
      'description', 'Flow metrics — throughput, cycle time, WIP, and item age — give objective data about how work moves through the team''s system, surfacing bottlenecks and improvement opportunities.',
      'transcript', 'FLOW METRICS

WHAT ARE FLOW METRICS?
Flow metrics measure how work moves through a team''s process — from start to completion. They are objective, system-focused measures that reveal capacity, bottlenecks, and variation.

THE FOUR KEY FLOW METRICS

Throughput: the number of items completed per unit of time (e.g., items per Sprint or per week). Throughput measures output rate. It is the basis for forecasting: "If we complete an average of 8 items per Sprint, and we have 32 items remaining, we forecast approximately 4 Sprints to completion."

Cycle Time: the elapsed time from when work starts on an item to when it is completed. Short, consistent cycle times indicate a healthy flow system. High variation in cycle time signals unpredictability and hidden complexity.

Work In Progress (WIP): the number of items currently in progress simultaneously. Little''s Law: Cycle Time = WIP / Throughput. Reducing WIP directly reduces cycle time. Teams that limit WIP finish individual items faster, even though they start fewer at once.

Item Age: how long each in-progress item has been in progress. Aged items are a warning signal — they indicate items are stuck, blocked, or more complex than expected. The Scrum Master reviews item age daily to flag items needing attention.

FLOW METRICS VS. VELOCITY
Velocity (story points per Sprint) is the most common Scrum metric, but it has limitations: story point inflation, team-specific relativity, and no information about how work flows. Flow metrics are more objective and more revealing of system health.

FLOW METRICS AND THE DAILY SCRUM
The Daily Scrum is the best time to review flow metrics. The question: "Is work flowing, or are there aged items that need attention?" is more valuable than "what did you do yesterday?"

AI FOR FLOW METRICS
AI excels at flow metric analysis: automatically calculating throughput and cycle time from Jira data, building cycle time scatterplots, identifying bottleneck stages, and generating weekly flow health reports for the Scrum Master.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%flow metrics%' OR order_index = 0);

  UPDATE videos SET
    description = 'Probabilistic forecasting uses historical throughput data to produce a range of likely completion dates rather than a single false-certainty date. This is more honest and more useful than traditional project deadline commitments.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Forecasting',
      'description', 'Probabilistic forecasting uses historical throughput data to produce a range of likely outcomes — more honest and useful than false-certainty deadline commitments.',
      'transcript', 'PROBABILISTIC FORECASTING

THE PROBLEM WITH TRADITIONAL ESTIMATES
Traditional project management uses point estimates: "This will be done by March 15th." This creates false certainty. The estimate is presented as a commitment when it is actually a guess — often an optimistic one.

When estimates are wrong (which is frequent), teams are blamed for "missing" a date that was never achievable. This creates a perverse incentive: pad estimates to avoid missing them, which creates its own problem (Parkinson''s Law: work expands to fill the time allotted).

THE PROBABILISTIC APPROACH
Probabilistic forecasting uses historical throughput data to answer: "Given our past performance, what is the probability of completing X items by date Y?" The answer is a range, not a point:
- "There is an 85% probability we will complete this by Sprint 8"
- "There is a 50% probability we will complete this by Sprint 6"

This is more honest (it acknowledges uncertainty) and more useful (stakeholders can make decisions based on probability, not false certainty).

HOW TO BUILD A PROBABILISTIC FORECAST
Step 1: Collect throughput data for the last 10–20 Sprints (items completed per Sprint)
Step 2: Run a Monte Carlo simulation: randomly sample from historical throughput data to simulate many possible futures
Step 3: Generate a probability distribution: what percentage of simulated futures complete by each date?
Step 4: Present ranges: "50th percentile: Sprint 6. 85th percentile: Sprint 8. 95th percentile: Sprint 10."

USING FORECASTS WITH STAKEHOLDERS
Most stakeholders want a single date. The Scrum Master''s job is to explain why a range is more useful: "A single date gives you false certainty. A range gives you real information you can plan around. If you need high confidence, plan for the 85th percentile date."

AI FOR FORECASTING
AI tools can run Monte Carlo simulations automatically from Jira data, generate probability distributions instantly, and create stakeholder-ready forecast visualizations — dramatically reducing the time to produce honest, data-driven forecasts.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%forecasting%' OR order_index = 1);

  UPDATE videos SET
    description = 'Velocity is a useful team planning tool when used correctly. It becomes dangerous when used as a management target, a productivity measure, or a comparison between teams. The Scrum Master understands this distinction and protects it.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Velocity done right',
      'description', 'Velocity is a team planning tool, not a productivity target. Using it as a management measure or cross-team comparison causes predictable harm.',
      'transcript', 'VELOCITY DONE RIGHT

WHAT VELOCITY IS
Velocity is the sum of story point estimates for all Product Backlog items completed in a Sprint. It is a team-internal historical average used to forecast future Sprints. That is all it is.

WHAT VELOCITY IS NOT
- Not a productivity measure (two teams with different story point scales cannot be compared)
- Not a target (telling a team to "increase velocity to 50 points" incentivizes story point inflation, not more value delivery)
- Not a commitment (the team forecasts based on velocity; they do not commit to a specific velocity)
- Not comparable across teams (each team calibrates story points relative to their own work)

THE VELOCITY TRAP
When management sets velocity targets or uses velocity to compare teams, predictable game-playing emerges:
- Teams inflate estimates to show higher velocity without doing more work
- Teams split stories artificially to complete more items
- Teams lower their Definition of Done to complete more items faster
- Teams mark items Done before they truly meet the DoD

All of these destroy the signal that velocity was supposed to provide.

HOW TO USE VELOCITY CORRECTLY
Use velocity as: a Sprint Planning input. Look at the average of the last 3–5 Sprints. Use this as a guide for how much to select in Sprint Planning — not as a floor to hit or a ceiling to stay under.

Use velocity for: rough forecasting. "We average 30 points per Sprint and have 120 points remaining — rough forecast is 4 Sprints." Combine with probabilistic analysis for a range.

Do not use velocity for: performance reviews, team comparisons, or executive reporting.

TEACHING VELOCITY CORRECTLY
The Scrum Master regularly educates new stakeholders and managers on velocity. This is ongoing work, not a one-time training. New managers arrive with project management instincts that reach for velocity as a productivity metric. The Scrum Master redirects to outcome-based measures.

AI FOR VELOCITY ANALYSIS
AI can detect velocity gaming patterns: flagging unusual estimate inflation, items marked Done rapidly without meeting historical cycle time, or systematic difference between planned and completed velocity — giving the Scrum Master data to address gaming before it becomes cultural.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%velocity done right%' OR order_index = 2);

  UPDATE videos SET
    description = 'Metric misuse is the gap between a metric''s intended purpose and how it is actually used. Goodhart''s Law: when a measure becomes a target, it ceases to be a good measure. The Scrum Master recognizes metric misuse and coaches the organization toward better measurement.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Avoiding metric misuse',
      'description', 'Goodhart''s Law: when a measure becomes a target, it ceases to be a good measure. The Scrum Master recognizes and addresses metric misuse.',
      'transcript', 'AVOIDING METRIC MISUSE

GOODHART''S LAW
"When a measure becomes a target, it ceases to be a good measure." This principle, coined by economist Charles Goodhart, describes exactly what happens when organizations misuse Agile metrics.

Examples:
- Velocity as a target → story point inflation, not more value
- Bug count as a quality measure → developers stop writing tests that would find bugs
- Sprint completion rate as a KPI → teams sandback commitments to guarantee 100%
- Number of story points per developer → destroys teamwork and creates heroism

THE MEASUREMENT PARADOX
Organizations measure things because they want to improve them. But measuring the wrong things — or measuring the right things in the wrong way — creates perverse incentives that produce the opposite of improvement.

METRICS TO WATCH FOR MISUSE

Velocity (misused as productivity target): see previous lesson.

Sprint completion rate (% of committed items Done): when this becomes a KPI, teams learn to commit less to guarantee 100%. Sandbagging is the rational response to an irrational measure.

Bug count (misused as quality indicator): a team with no automated tests will have fewer reported bugs — because they have no tool to find them. Low bug count can mean high quality or low visibility. Know which you have.

Number of features shipped: incentivizes shipping features regardless of value. A team that ships 10 features nobody uses is less effective than a team that ships 2 features that solve real problems.

BETTER METRICS
Replace output metrics with outcome metrics:
- Instead of "features shipped" → "adoption rate of shipped features"
- Instead of "velocity" → "throughput of value-delivering items"
- Instead of "bugs found" → "bugs found in production vs. before production" (shift-left quality)
- Instead of "sprint completion" → "sprint goal achievement" (was the outcome met?)

THE SCRUM MASTER''S ROLE IN METRICS
The Scrum Master helps the organization choose metrics that reveal truth rather than create gaming. When metrics are being gamed, the Scrum Master surfaces the pattern — with data — and proposes alternatives.

AI FOR METRIC HEALTH
AI can detect Goodhart effects in team data: flagging patterns like estimate inflation correlated with velocity targets, completion rate gaming, or systematic DoD evasion — giving the Scrum Master evidence to address metric misuse with leadership.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%metric misuse%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 16 — Scaling Scrum & Enterprise Agility
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 15;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 16 chapter not found'; END IF;

  UPDATE videos SET
    description = 'The first principle of scaling is: descale before you scale. Most organizations that believe they need multiple Scrum teams actually need to simplify their work, reduce dependencies, and strengthen single-team delivery first.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scaling principles',
      'description', 'The first scaling principle: descale before you scale. Simplify work and reduce dependencies before adding more teams.',
      'transcript', 'SCALING PRINCIPLES

THE PARADOX OF SCALING
Organizations reach for scaling frameworks (SAFe, LeSS, Nexus) when they believe one Scrum team cannot deliver fast enough. But scaling is expensive: it adds coordination overhead, increases dependencies, and requires significant organizational change. The result is often slower delivery, not faster.

The correct sequence:
1. First: Is one Scrum Team delivering well? If not, fix that first.
2. Second: Can you reduce the scope of the product to fit one team?
3. Third: Can you modularize the architecture to allow independent teams?
4. Last resort: if you genuinely need multiple teams on one product, choose a scaling approach.

DESCALING STRATEGIES
Before adding teams, consider:
- Reducing the feature backlog: does every requested feature need to be built? Product simplicity reduces team size needed.
- Modular architecture: a monolithic codebase requires all developers to coordinate constantly. A modular or service-based architecture allows teams to work independently.
- Smaller product scope: multiple focused products (each with one Scrum Team) often deliver more total value than one large product with many teams.

WHEN SCALING IS APPROPRIATE
Scaling is warranted when:
- The product genuinely requires more people than can fit in one Scrum Team
- The architecture supports team independence with minimal dependencies
- Single-team Scrum is working well and the team cannot deliver fast enough for legitimate business reasons
- Organizational readiness for the coordination overhead is present

THE SCALING TAX
Every additional team adds coordination overhead. Two teams do not produce twice the output of one team — the coordination cost reduces per-team throughput. Three teams produces less than triple. Scaling is worth it only when the aggregate output increase exceeds the coordination tax.

AI FOR SCALING DECISIONS
AI can model the coordination cost of different scaling configurations, analyze dependency patterns to identify where team splits would create the least friction, and benchmark scaling outcomes against single-team alternatives.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%scaling principle%' OR order_index = 0);

  UPDATE videos SET
    description = 'Cross-team coordination in Scrum requires explicit mechanisms — because teams working independently on the same product will produce conflicts, duplication, and integration failures without structured coordination practices.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Cross-team coordination',
      'description', 'Cross-team coordination requires explicit mechanisms — Scrum of Scrums, shared backlogs, integration Sprints — to prevent conflicts and integration failures.',
      'transcript', 'CROSS-TEAM COORDINATION

THE COORDINATION CHALLENGE
When multiple Scrum Teams work on the same product, they face challenges that a single team does not: shared codebase conflicts, competing priorities, duplicated work, integration failures, and decision-making bottlenecks. None of these are solved by Scrum alone — explicit coordination mechanisms are needed.

SCRUM OF SCRUMS (SOS)
The most common cross-team coordination mechanism. Representatives from each Scrum Team meet regularly (often daily or twice weekly) to inspect cross-team integration and adapt plans.

SOS agenda:
- What has each team done since last time that affects other teams?
- What will each team do before next time that other teams should know about?
- What integration risks or dependencies need cross-team attention?

SOS is not a management reporting event — it is a team coordination event. Scrum Masters often represent their teams.

SHARED PRODUCT BACKLOG
In most scaled Scrum configurations, a single Product Backlog ordered by a single Product Owner (or small PO team) drives all teams. This prevents teams from pulling in different directions. The challenge: one PO managing a backlog for multiple teams requires significant capacity and skill.

INTEGRATION SPRINTS AND ARCHITECTURE ALIGNMENT
In some configurations, teams synchronize integration at Sprint boundaries. At the end of each Sprint, integrated code from all teams is tested together. Any integration failures are resolved immediately, preventing accumulation.

An Architecture Owner or guild of technical leads ensures teams make compatible technical decisions. This is a coordination mechanism, not a command structure.

NEXUS: SCRUM FOR MULTIPLE TEAMS
Nexus (from Scrum.org) is a scaling framework built on Scrum. It adds: a Nexus Integration Team (NIT) that coordinates integration, a Nexus Sprint Backlog for cross-team work, and a Nexus Daily Scrum for dependency identification. It maintains the core Scrum framework while adding minimum-viable coordination.

AI FOR CROSS-TEAM COORDINATION
AI can analyze cross-team dependency patterns in Jira, identify integration risk points, and generate cross-team coordination briefings — reducing the meeting overhead of coordination by surfacing the most important signals automatically.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%cross-team coordination%' OR order_index = 1);

  UPDATE videos SET
    description = 'Dependencies between teams are the single biggest threat to scaled Scrum delivery. Every cross-team dependency introduces delay, coordination cost, and integration risk. The goal is not to manage dependencies but to eliminate them wherever possible.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Dependency management',
      'description', 'Dependencies are the biggest threat to scaled delivery. The goal is to eliminate them — not just manage them — through architecture and team design.',
      'transcript', 'DEPENDENCY MANAGEMENT

DEPENDENCIES ARE COSTS
In scaled Scrum, a dependency between Team A and Team B means: Team A cannot complete their work without something from Team B. Every such dependency introduces:
- Scheduling risk: Team B may not complete their work when Team A needs it
- Communication overhead: Teams must coordinate to manage the dependency
- Integration failure risk: when dependencies are delivered at different times, integration fails
- Queue buildup: one team waits for another

THE DEPENDENCY REDUCTION IMPERATIVE
The answer to dependencies is not better dependency management tools. It is reducing dependencies at the source: through team design and architecture.

CONWAY''S LAW
"Organizations which design systems are constrained to produce designs which are copies of the communication structures of those organizations." In reverse: if you want a modular architecture, create modular teams. Teams that own a full vertical slice of the product — from UI to database — can deliver independently without cross-team dependencies.

DEPENDENCY TYPES AND RESPONSES

Technical dependencies (shared libraries, shared databases, APIs):
Response: Invest in clear interface contracts. Teams agree on API signatures and data formats; each team implements their side independently. A shared database accessed by multiple teams is the highest-risk dependency — refactor toward team-owned data stores where possible.

Knowledge dependencies (only one person knows X):
Response: Cross-training, documentation, pair programming across teams. Knowledge concentration is a bus-factor risk as well as a dependency risk.

Feature dependencies (Feature B requires Feature A from another team):
Response: Reorder the Product Backlogs to sequence Feature A before Feature B, or restructure the features to reduce the dependency.

VISUALIZING DEPENDENCIES
Dependency boards (physical or digital) make cross-team dependencies visible: what each team needs from others, when they need it, and current status. Invisible dependencies are guaranteed surprises.

AI FOR DEPENDENCY MANAGEMENT
AI can analyze Jira tickets and code commits to automatically detect cross-team technical dependencies, generate dependency maps, and alert teams when dependencies are at risk of not being delivered on time.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%dependency management%' OR order_index = 2);

  UPDATE videos SET
    description = 'Enterprise agility extends Scrum principles beyond individual teams to the organizational level. SAFe, LeSS, and other frameworks provide structure for this — each with different trade-offs in complexity, prescriptiveness, and organizational fit.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Enterprise agility',
      'description', 'Enterprise agility extends Scrum to the organizational level. SAFe, LeSS, and Nexus provide scaling structure — each with different trade-offs.',
      'transcript', 'ENTERPRISE AGILITY: SAFe, LeSS, AND PRAGMATIC SCALING

WHAT ENTERPRISE AGILITY IS
Enterprise agility is the application of Agile principles not just to software development teams, but to portfolio management, budgeting, governance, and organizational strategy. It requires changing how the entire organization — not just delivery teams — makes decisions and responds to change.

SCALING FRAMEWORKS OVERVIEW

SAFE (Scaled Agile Framework):
The most widely adopted enterprise Agile framework. SAFe defines three levels: Team (Scrum), Program (Agile Release Train), and Portfolio. It prescribes: Program Increment (PI) Planning (a quarterly big-room planning event), Agile Release Trains (groups of 50–125 people), and connecting Agile delivery to business strategy through a Portfolio Kanban.

SAFe trade-offs:
+ Comprehensive: addresses all organizational levels
+ Widely recognized: large talent market, many resources
- Complex: requires significant organizational change to implement correctly
- Risk of Scrumfall if adopted as a process overlay without cultural change

LESS (Large-Scale Scrum):
Built by Craig Larman and Bas Vodde, LeSS extends Scrum to multiple teams with minimal additional structure. It keeps one Product Backlog, one Product Owner, and one overall Product. Multiple Scrum Teams coordinate through a common Sprint and a joint Sprint Review.

LeSS trade-offs:
+ Lightweight: minimum viable additional structure
+ Preserves Scrum''s empirical spirit
- Requires strong Scrum mastery at all levels before scaling
- Less adoption in large enterprises

NEXUS (Scrum.org):
Created by Ken Schwaber (co-creator of Scrum), Nexus scales Scrum to 3–9 teams. It adds minimal structure: a Nexus Integration Team, a Nexus Sprint Backlog, and an integrated Increment standard.

Nexus trade-offs:
+ Built by the creators of Scrum, highest fidelity to Scrum principles
+ Lightweight additional structure
- Limited to roughly 9 teams; beyond that, LeSS or SAFe is needed

CHOOSING PRAGMATICALLY
The choice of scaling framework should be driven by: organizational size, existing structure, maturity of team-level Scrum, and specific coordination challenges. There is no universally correct answer. A pragmatic Scrum Master asks: "What is the minimum additional structure needed to coordinate our teams effectively?" — and starts there.

AI FOR ENTERPRISE AGILITY
AI tools are increasingly embedded in enterprise Agile platforms: portfolio health dashboards, PI objective tracking, cross-team dependency visualization, and organization-wide flow metric analysis. The AI Scrum Master is conversant in these tools and can use them to generate organizational-level insights.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%enterprise agility%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 17 — AI for the Scrum Master
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 16;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 17 chapter not found'; END IF;

  UPDATE videos SET
    description = 'AI creates value across the entire Scrum Master role — from event facilitation and team coaching to impediment analysis and organizational reporting. But it also has clear limits: it does not replace judgment, presence, or human relationships.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI across the Scrum Master role',
      'description', 'AI creates value across the Scrum Master role — facilitation, coaching, impediment analysis, reporting — but does not replace judgment, presence, or human relationships.',
      'transcript', 'AI ACROSS THE SCRUM MASTER ROLE

THE AI SCRUM MASTER''S ADVANTAGE
An AI-augmented Scrum Master can: process Sprint data in seconds instead of hours, surface patterns across dozens of Sprints that a human would miss, generate facilitation scripts and coaching frameworks on demand, and free themselves from routine information work to focus on the highest-value human work: relationships, coaching, and organizational change.

WHERE AI HELPS

Facilitation preparation:
AI generates event designs, facilitation scripts, timing plans, and technique suggestions for any Scrum event, tailored to team size, maturity, and specific challenges.

Sprint analysis:
AI analyzes Sprint data from Jira, GitHub, or any tool to produce: burndown analysis, velocity trends, cycle time distributions, impediment patterns, and flow health summaries — in minutes rather than hours.

Team health monitoring:
AI can analyze retrospective notes, standup summaries, and communication patterns to identify early signals of psychological safety issues, engagement decline, or emerging conflict.

Stakeholder communication:
AI drafts executive summaries of Sprint outcomes, stakeholder update emails, and risk briefings — all starting from Sprint data and the Scrum Master''s input.

Coaching preparation:
AI role-plays difficult conversations — a resistant developer, an overloaded PO, a skeptical executive — so the Scrum Master can practice before the real conversation.

WHERE AI DOES NOT HELP

Human relationships: AI cannot build trust, read a room, or respond to the unspoken. The high-EQ, present, listening Scrum Master cannot be replaced.

Judgment under uncertainty: AI surfaces patterns and probabilities; the Scrum Master makes the call. When an organizational intervention requires reading complex human dynamics, data alone is insufficient.

Psychological safety: Safety is created through consistent behavior over time — through how a person responds when things go wrong. This is entirely human.

THE RESPONSIBLE AI PRINCIPLE
An AI-augmented Scrum Master uses AI as a tool, not a crutch. They can explain every AI-generated output, verify it against their own knowledge, and would be effective without the AI if it were unavailable.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%ai across the scrum master%' OR order_index = 0);

  UPDATE videos SET
    description = 'AI-augmented facilitation uses AI to prepare better events, synthesize outputs faster, and identify patterns that manual review would miss. AI-augmented analysis transforms raw Sprint data into actionable insight in minutes.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI-augmented facilitation & analysis',
      'description', 'AI prepares better events, synthesizes outputs faster, and transforms raw Sprint data into actionable insight — augmenting the Scrum Master without replacing them.',
      'transcript', 'AI-AUGMENTED FACILITATION AND ANALYSIS

AI-AUGMENTED FACILITATION

Pre-event preparation:
Before a Sprint Retrospective, prompt AI with: team size, Sprint duration, key events of the Sprint, previous Retro action items, and any specific dynamics to address. AI generates: a complete facilitation plan with timing, technique selection rationale, and facilitation scripts for each segment.

During-event support:
AI tools can receive live input (if the team is using a digital collaboration platform) and cluster sticky notes in real-time, surface themes, and generate synthesis as the event unfolds — dramatically reducing the synthesis step from 20+ minutes to 2–3 minutes.

Post-event synthesis:
After the event, AI synthesizes outputs: turning a page of sticky notes into: key themes, top improvement opportunity, action items with owners, and a summary for the team''s improvement log.

AI-AUGMENTED SPRINT ANALYSIS

Burndown analysis:
AI analyzes the Sprint burndown and identifies: whether the team is on track, where significant scope changes or blockers occurred, and what the pattern suggests about the next Sprint''s forecast.

Velocity pattern analysis:
AI spots patterns human review often misses: is velocity declining slowly? Is there a seasonal pattern? Does velocity drop when a specific team member is absent? These signals lead to specific coaching interventions.

Impediment pattern analysis:
Across multiple Sprints, AI clusters impediment logs to identify: the most common impediment type, impediments that recur Sprint after Sprint (systemic issues), and impediments that correlate with velocity drops.

Cycle time analysis:
AI identifies where items spend the most time in the workflow — which stage is the bottleneck — and generates flow improvement recommendations.

PRACTICAL AI WORKFLOW
The AI-enabled Scrum Master builds a repeatable workflow:
1. Export Sprint data from Jira at Sprint end
2. Feed to AI analysis prompt
3. Review AI summary and add context AI cannot know (team dynamics, organizational factors)
4. Use the combined analysis to prepare the Retrospective and Sprint Planning

AI does the data processing. The Scrum Master does the interpretation and action.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%ai-augmented facilitation%' OR order_index = 1);

  UPDATE videos SET
    description = 'AI Scrum automations are workflows that use AI to handle routine information tasks — standup summarization, impediment logging, stakeholder updates, and backlog hygiene — freeing the Scrum Master for higher-value human work.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI Scrum automations',
      'description', 'AI Scrum automations handle routine information tasks — standup summarization, impediment logging, stakeholder updates — freeing the Scrum Master for high-value human work.',
      'transcript', 'AI SCRUM AUTOMATIONS

WHAT IS A SCRUM AUTOMATION?
A Scrum automation is a workflow that uses AI or process automation to handle a task that the Scrum Master previously did manually. The goal is not to automate Scrum itself — Scrum''s value comes from human collaboration — but to automate the information work surrounding Scrum.

HIGH-VALUE SCRUM AUTOMATIONS

Standup summarization:
Developers post standup updates in Slack or a dedicated tool. An AI workflow reads the updates, identifies impediment signals, generates a Sprint Goal progress summary, and flags items the Scrum Master should pay attention to. The Scrum Master reviews the summary rather than reading 8 individual updates.

Impediment logging:
When a developer mentions a blocker in Slack, the AI workflow automatically creates an impediment log entry, tags it by type, assigns it to the Scrum Master, and adds it to the Sprint Backlog for tracking. Impediments are never dropped because they were mentioned in chat and not logged.

Stakeholder update generation:
At the end of each Sprint, the AI workflow pulls Sprint data from Jira, generates a draft stakeholder update (what was accomplished, what is planned next, any risks), and routes it to the Scrum Master for review and send. A two-hour manual writing task becomes a 10-minute review.

Backlog hygiene:
AI scans the Product Backlog and flags: items that have not been touched in multiple Sprints, items without acceptance criteria, items too large for a single Sprint, and duplicate items. The Scrum Master uses these flags to focus refinement conversations.

Definition of Done verification:
AI checks merged pull requests against DoD criteria (automated test requirements, code review, deployment checks) and flags items that are marked Done without meeting all criteria.

BUILDING YOUR AUTOMATION TOOLKIT
Start with one automation that addresses your biggest time sink. Run it manually first (AI-assisted but human-triggered), then automate the trigger once the process is stable. Build your toolkit Sprint by Sprint.

AUTOMATION DOES NOT REPLACE PRESENCE
The risk of automation: the Scrum Master becomes an information manager rather than a team servant. Automation should free time for: 1:1 coaching conversations, attending events to observe team dynamics, and organizational work. Not for more information processing.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%ai scrum automation%' OR order_index = 2);

  UPDATE videos SET
    description = 'Responsible AI use means understanding the limitations, risks, and ethical dimensions of AI tools — especially when AI outputs influence team decisions, coaching interventions, or stakeholder communications.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Responsible AI',
      'description', 'Responsible AI means understanding AI limitations, risks, and ethics — especially when AI outputs influence team decisions, coaching, or stakeholder communications.',
      'transcript', 'RESPONSIBLE AI FOR THE SCRUM MASTER

WHY RESPONSIBLE AI MATTERS
AI tools are powerful, but they are not neutral. AI systems reflect the biases in their training data, can produce confident-sounding but incorrect outputs, and can create privacy risks when processing team data. The responsible AI Scrum Master understands these risks and works within them.

KEY RISKS

Bias in AI outputs:
AI models trained on historical data may encode historical biases. If you use AI to analyze team performance, it may reflect biases about who is "productive" based on patterns in training data. Always interrogate AI outputs: who is centered, who is marginalized, and what assumptions are embedded?

Hallucination:
AI language models sometimes generate plausible-sounding but factually incorrect information. A Scrum Master who sends an AI-generated stakeholder update without reviewing it may send incorrect data. Rule: always review AI-generated content before using it. The AI drafts; the human publishes.

Privacy and data security:
Standup notes, retrospective outputs, and team communication data are sensitive. Before feeding team data to an AI tool, understand: where is the data stored? Who can access it? Does it comply with your organization''s data privacy policies (and regulations like GDPR or CCPA)? Use anonymization where possible.

Over-reliance and deskilling:
If a Scrum Master uses AI to generate all their facilitation plans, coaching questions, and analyses, they may lose the ability to function without AI. The responsible AI user ensures they can still do the work manually — AI is an amplifier, not a crutch.

THE HUMAN OVERRIDE PRINCIPLE
Every AI output in a Scrum context requires human judgment before action. The Scrum Master reads the AI analysis, applies their knowledge of the specific team and context, and decides what — if anything — to act on. AI does not make decisions. People make decisions.

TEAM TRANSPARENCY ABOUT AI USE
Be transparent with the team about how AI is being used. If AI is analyzing their retrospective notes, they should know. Transparency about AI use is an extension of the Scrum value of openness.

BUILDING YOUR RESPONSIBLE AI FRAMEWORK
Before deploying any AI automation:
1. What data is being processed? Is it sensitive?
2. Where is the data going? Is it leaving the organization?
3. What decisions or communications will this AI output influence?
4. Who reviews the output before it is acted on?
5. What is the failure mode if the AI output is wrong?'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%responsible ai%' OR order_index = 3);

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 18 — Capstone: Career Transformation & Placement
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 17;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 18 chapter not found'; END IF;

  UPDATE videos SET
    description = 'The capstone is a 3-Sprint leadership turnaround case study. You are placed as the Scrum Master of a team in crisis — you must diagnose the dysfunction, create a recovery plan, and lead the team back to effective Scrum delivery.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The capstone',
      'description', 'The capstone is a 3-Sprint leadership turnaround case study — diagnose a team in crisis, create a recovery plan, and lead them back to effective Scrum delivery.',
      'transcript', 'THE CAPSTONE

THE CAPSTONE SCENARIO
You are joining a Scrum Team as their new Scrum Master. The team has been "doing Scrum" for six months but is not meeting their Sprint Goals, retros are going through the motions, and stakeholders have lost confidence. You have three Sprints to turn it around.

SPRINT 1: DIAGNOSIS
Your first Sprint as Scrum Master is for listening, observing, and diagnosing. Do not immediately prescribe solutions — you do not yet understand the system.

Diagnosis activities:
- Attend all Scrum events as an observer (not facilitator). What is happening? What is not happening?
- Conduct 1:1 interviews with every team member: what is working, what is not, what do they wish was different?
- Interview the Product Owner: what is their experience with the team? With the backlog?
- Review the last 6 Sprints of data: velocity trend, Sprint Goal achievement rate, impediment log
- Assess the Definition of Done: is it real and enforced?

Common dysfunctions to diagnose:
- Absence of psychological safety (people say "fine" but avoid difficult topics)
- Scrum Master functioning as a PM (assigning tasks, reporting to management)
- Product Owner absent or unclear about priorities
- Systemic impediments that have never been escalated
- Definition of Done that is ignored under pressure

SPRINT 2: EARLY WINS
Based on your diagnosis, you select the highest-leverage interventions for Sprint 2. The goal: create visible, meaningful change that builds confidence. Avoid: trying to fix everything at once (you will overwhelm the team and yourself).

Example early wins:
- Run a truly effective retrospective — one that produces a concrete improvement the team sees enacted
- Remove one persistent systemic impediment that has annoyed the team for months
- Create a clear, visible Sprint Goal that gives the Sprint meaning
- Establish one working agreement the whole team commits to

SPRINT 3: INSTITUTIONALIZATION
Sprint 3 is about making the improvements stick and demonstrating what sustainable high performance looks like.

Deliverables:
- Team Working Agreement documented and owned by the team
- Updated Definition of Done that reflects actual quality standards
- Impediment log with resolution tracking
- Stakeholder confidence restored through a strong Sprint Review
- Retrospective that shows the team''s continuous improvement capability

THE CAPSTONE ASSESSMENT
The capstone is assessed on: quality of diagnosis, specificity and rationale of interventions, quality of each deliverable, and the demonstrated integration of all 18 modules'' competencies.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%capstone%' OR order_index = 0);

  UPDATE videos SET
    description = 'Your portfolio is the evidence employers trust over your resume. It shows what you have actually done — documented, artifact-rich proof of your competencies as an AI Scrum Master across all 18 modules.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Assembling your portfolio',
      'description', 'Your portfolio is evidence employers trust over resumes — documented, artifact-rich proof of competency across all 18 modules.',
      'transcript', 'ASSEMBLING YOUR PORTFOLIO

WHY A PORTFOLIO MATTERS MORE THAN A RESUME
A resume tells employers what you claim to have done. A portfolio shows them. In a market where certifications are increasingly commoditized, the portfolio is the differentiator — it provides evidence that you can actually do the work, not just pass an exam.

THE ALADIAH PORTFOLIO STRUCTURE
Your portfolio is organized across all 18 modules, each contributing a deliverable:
- Module 1: Team Charter + Working Agreement
- Module 2: Scrum Master Role Canvas
- Module 3: Accountabilities Map
- Module 4: Sprint Dashboard (Sprint Plan)
- Module 5: Impediment Log + Flow Board
- Module 6: Retrospective + Action Items
- Module 7: Product + Sprint Backlog
- Module 8: Definition of Done + Quality Gates
- Module 9: Refined Backlog + Story Map
- Module 10: Team Working Agreement
- Module 11: Facilitation Playbook
- Module 12: Team Coaching Plan
- Module 13: Stakeholder Communication Plan
- Module 14: RAID Log + Agile Transformation Plan
- Module 15: Agile Metrics Dashboard + Executive Status Report
- Module 16: Scaling Roadmap + Jira Configuration
- Module 17: AI Scrum Automation Workflow
- Module 18: Capstone Case Study + Aladiah Profile

WHAT MAKES A STRONG PORTFOLIO ARTIFACT
- Specificity: "Here is the working agreement I created with team X" is stronger than a generic template
- Context: brief description of the situation, challenge, and outcome
- Evidence of thinking: show your reasoning, not just the output
- Results: where possible, connect the artifact to a measurable outcome

GITHUB AS YOUR PORTFOLIO HOME
Your portfolio lives at github.com/{yourname}/aladiah-ai-scrum-master-portfolio. Each module has a folder. Employers, hiring managers, and certification verifiers can review your work directly.

AI FOR PORTFOLIO DEVELOPMENT
AI helps you: refine artifact narratives, generate presentation-ready summaries, identify gaps in your portfolio, and draft the context and outcome descriptions that make each artifact meaningful to a reader who doesn''t know your history.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%assembling your portfolio%' OR order_index = 1);

  UPDATE videos SET
    description = 'The Aladiah Profile is your verified record of competency — combining certification scores, simulation outcomes, portfolio evidence, and coaching history into a single profile that employers can trust and verify.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'The Aladiah Profile',
      'description', 'The Aladiah Profile is your verified competency record — combining certification scores, simulation outcomes, portfolio evidence, and coaching history into a trusted employer-facing profile.',
      'transcript', 'THE ALADIAH PROFILE

WHAT THE ALADIAH PROFILE IS
The Aladiah Profile is your verified, multi-dimensional competency record. It is built automatically as you complete the program — collecting evidence across four dimensions:

1. Assessment scores: certification quiz results across all 18 modules, showing competency by domain
2. Simulation outcomes: your performance in behavioral simulations — how you respond under realistic pressure, not just what you know
3. Portfolio evidence: links to your 18 module deliverables on GitHub — showing what you can produce, not just what you claim
4. Coaching history: documented interactions with Prof. Didier, showing your ability to engage with and learn from coaching feedback

WHY FOUR DIMENSIONS?
A single exam score tells employers one thing: you passed a multiple-choice test. Four dimensions give a richer picture:
- Do you know the theory? (Assessment scores)
- Do you perform well under pressure? (Simulation outcomes)
- Can you produce professional deliverables? (Portfolio evidence)
- Do you engage and grow from feedback? (Coaching history)

THE VERIFICATION LAYER
Unlike self-reported LinkedIn certifications, the Aladiah Profile is verified by the platform. Employers can confirm: when you completed each module, what scores you achieved, and which portfolio artifacts are genuine. This solves the "certification credibility" problem that plagues the Agile certification market.

HOW EMPLOYERS USE THE ALADIAH PROFILE
Employers see a competency breakdown by Scrum domain: framework, events, artifacts, empiricism, roles, team dynamics, stakeholders, delivery metrics. This lets them assess fit for their specific needs in minutes, not through a generic interview.

BUILDING YOUR PROFILE NARRATIVE
Beyond the data, the Aladiah Profile includes your story: how your background connects to your Scrum Master career, what motivated your transformation, and what impact you are ready to create. AI helps you draft this narrative, but the story is yours.

YOUR PROFILE IS A LIVING DOCUMENT
The Aladiah Profile does not end with the certification. As you apply skills in real work, add evidence. As you grow into senior Scrum Master or Agile Coach roles, your profile grows with you.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%aladiah profile%' OR order_index = 2);

  UPDATE videos SET
    description = 'Interview and placement readiness means being able to articulate your competencies, tell compelling STAR stories, demonstrate Scrum mastery in behavioral scenarios, and present yourself as a career-transformation candidate — not just a certification holder.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Interview & placement readiness',
      'description', 'Interview readiness means articulating competencies, telling compelling STAR stories, demonstrating mastery in behavioral scenarios, and presenting as a transformation candidate — not just a cert holder.',
      'transcript', 'INTERVIEW AND PLACEMENT READINESS

THE HIRING LANDSCAPE FOR SCRUM MASTERS
The Scrum Master market is crowded with PSM I and CSM certified candidates who passed a test. To stand out, you need to demonstrate: applied competency, not just theory; behavioral evidence, not just vocabulary; and a clear story about why you are making this transition and what impact you will create.

THE STAR METHOD FOR SCRUM MASTER INTERVIEWS
Most Scrum Master interviews use behavioral questions: "Tell me about a time when..." The STAR method structures your answer:
- Situation: the context. What was the team/org situation?
- Task: what was your responsibility or the challenge?
- Action: what specifically did you do? (This is the most important part — be specific)
- Result: what was the outcome? Quantify where possible.

COMMON SCRUM MASTER INTERVIEW QUESTIONS

"How do you handle a team member who resists Scrum?"
Hint: demonstrate coaching stance, not enforcement. Show curiosity about the resistance before trying to change it.

"What is the difference between a Scrum Master and a Project Manager?"
Hint: this is a values and understanding question. Do not just list features — explain the mindset difference.

"How have you handled an impediment you couldn''t remove?"
Hint: show your escalation process, transparency to the team, and persistence.

"Tell me about a retrospective that created real change."
Hint: specific, concrete. What was the dysfunction? What technique did you use? What changed?

"How do you work with a difficult Product Owner?"
Hint: servant leadership toward the PO. Coaching, facilitation, never taking over their accountability.

THE PLACEMENT STRATEGY
Getting hired as a Scrum Master is itself a Scrum-like process: empirical, iterative, and value-focused.

Sprint 1: network targeting — identify companies and hiring managers, build your LinkedIn presence, connect with Scrum practitioners
Sprint 2: application and outreach — apply with a tailored portfolio highlight, reach out directly to Scrum Masters and Agile coaches
Sprint 3: interview preparation — practice STAR stories, mock interviews with AI, study each company''s Agile maturity

AI FOR INTERVIEW PREP
Prof. Didier and AI role-play tools can simulate full Scrum Master interviews: behavioral questions, scenario-based challenges, and salary negotiation. Practice until your STAR stories are fluent and your Scrum knowledge is immediate — not recalled under pressure.

YOUR FIRST 90 DAYS
Once hired, your first 90 days are Module 18''s capstone in real life: diagnose before prescribing, build relationships before making changes, create early wins that build credibility, and establish yourself as a servant leader who makes the team better — not a process enforcer who makes the team compliant.'
    ))
  WHERE chapter_id = v_ch AND (title ILIKE '%interview%placement%' OR title ILIKE '%interview & placement%' OR order_index = 3);

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
