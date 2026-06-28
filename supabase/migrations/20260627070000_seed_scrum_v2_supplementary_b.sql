-- =============================================================================
-- Seed SUPPLEMENTARY lesson content (order_index 4-8) for Scrum v2
-- Covers chapter OFFSETs 9-17 (Modules 10-18)
--
-- These lessons are the deep-dive / supplementary lessons
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
-- MODULE 10 — Empiricism, Transparency & Scrum Values (OFFSET 9)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 9;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 10 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Scrum Guide — Theory & Values
  UPDATE videos SET
    description = 'The Scrum Guide grounds Scrum in empirical process theory — three pillars (transparency, inspection, adaptation) and five values (commitment, focus, openness, respect, courage). This lesson extracts the key text and explains how the values and pillars are interdependent: values enable empiricism, and empiricism only works when values are lived.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scrum Guide — Theory & Values',
      'description', 'The Scrum Guide grounds Scrum in three empirical pillars (transparency, inspection, adaptation) and five values. This lesson extracts the key text and explains why values enable empiricism.',
      'transcript', 'SCRUM GUIDE — THEORY AND VALUES

THE EMPIRICAL FOUNDATION
"Scrum is founded on empiricism and lean thinking. Empiricism asserts that knowledge comes from experience and making decisions based on what is observed. Lean thinking reduces waste and focuses on the essentials."

"Three pillars uphold every implementation of empirical process control: transparency, inspection, and adaptation."

THE THREE PILLARS

TRANSPARENCY
"The emergent process and work must be visible to those performing the work as well as those receiving the work. With Scrum, important decisions are based on the perceived state of its three formal artifacts."

Transparency is not optional. It is the prerequisite for inspection. You cannot inspect what you cannot see.

INSPECTION
"The Scrum artifacts and the progress toward agreed goals must be inspected frequently and diligently to detect potentially undesirable variances or problems. To help with inspection, Scrum provides cadence in the form of its five events."

The five Scrum events are inspection points. Sprint Planning inspects the backlog. Daily Scrum inspects Sprint progress. Sprint Review inspects the Increment. Retrospective inspects team effectiveness.

ADAPTATION
"If any aspects of a process deviate outside acceptable limits or if the resulting product is unacceptable, the process being applied or the materials being produced must be adjusted. The adjustment must be made as soon as possible to minimize further deviation."

THE FIVE VALUES
"Successful use of Scrum depends on people becoming more proficient in living five values: Commitment, Focus, Openness, Respect, and Courage."

- Commitment: team members commit to achieving the Sprint Goal and supporting each other
- Focus: the team focuses on the Sprint Goal and the work needed to achieve it
- Openness: the team and stakeholders are open about the work and the challenges
- Respect: team members respect each other as capable, independent people
- Courage: the team has the courage to raise hard problems, disagree, and do the right thing

HOW VALUES ENABLE EMPIRICISM
Without courage, transparency fails — teams hide bad news. Without openness, inspection is incomplete — problems are disguised. Without respect, adaptation fails — suggestions for change are taken as criticism. The values are not decoration; they are the operational conditions for empiricism to function.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 5: Information radiators
  UPDATE videos SET
    description = 'Information radiators are visible, real-time data displays that make the team''s work, progress, and problems visible to everyone — team members and stakeholders alike. This lesson covers the most important radiators in Scrum, the principles that make a radiator effective, and the digital versus physical trade-offs.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Information radiators',
      'description', 'Information radiators are visible, real-time data displays — Sprint Board, burndown, impediment log — that make work visible. This lesson covers what makes a radiator effective and digital vs. physical trade-offs.',
      'transcript', 'INFORMATION RADIATORS

WHAT IS AN INFORMATION RADIATOR?
An information radiator is a large, visible display of data about the team''s work that anyone — team member or stakeholder — can see without asking anyone. The term comes from Alistair Cockburn: the information radiates to anyone who walks by.

THE KEY CHARACTERISTIC
Radiators are pull information, not push information. You do not need to request a status update — you can see it. This reduces the need for status meetings, progress reports, and management check-ins.

THE CORE SCRUM INFORMATION RADIATORS

Sprint Board (Task Board)
Shows all Sprint Backlog items in their current state: To Do, In Progress, Review, Done. Updated daily during or after the Daily Scrum. The single most important radiator for Sprint execution transparency.

Sprint Burndown Chart
Shows remaining work (story points or tasks) against remaining Sprint days. A healthy burndown slopes steadily downward. Flat lines indicate blocked work; steep drops indicate stories completing. Allows early identification of Sprint Goal risk.

Impediment Log
A visible, updated list of current impediments: who owns them, when they were raised, target resolution date. Makes blockers visible to the whole team and to anyone who might help resolve them.

Velocity Chart
Shows completed story points per Sprint over the last 6-10 Sprints. Used for capacity planning and Sprint Planning calibration. A declining velocity trend is a team health signal.

WHAT MAKES A GOOD RADIATOR
- Large enough to be read from a distance (physical) or at a glance (digital)
- Updated in real time or at least daily — stale data is worse than no data
- Minimal — displays the essential signal, not every data point
- Located where the team actually works (not buried in a project management tool)

DIGITAL VS. PHYSICAL
Physical boards are faster to update and create a shared spatial reference. Digital boards are accessible to distributed teams and integrate with CI/CD and tracking tools. Hybrid teams often benefit from a digital board that mirrors a physical one.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- order_index = 6: Psychological safety
  UPDATE videos SET
    description = 'Psychological safety — the belief that you can take interpersonal risks without punishment — is the single strongest predictor of team effectiveness (Google''s Project Aristotle). This lesson covers Amy Edmondson''s definition, the four stages of psychological safety, how it directly affects Scrum outcomes, and the specific Scrum Master behaviors that build versus destroy it.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Psychological safety',
      'description', 'Psychological safety is the belief that you can take risks without punishment — and the strongest predictor of team effectiveness. This lesson covers the four stages, Scrum outcomes it enables, and SM behaviors that build vs. destroy it.',
      'transcript', 'PSYCHOLOGICAL SAFETY

AMY EDMONDSON''S DEFINITION
"A belief that one will not be punished or humiliated for speaking up with ideas, questions, concerns, or mistakes." — Amy Edmondson, Harvard Business School.

Google''s Project Aristotle (2016) studied 180 teams to identify what made the highest-performing ones. Of all the factors studied — team composition, seniority, co-location, communication patterns — psychological safety was the single strongest predictor of team effectiveness.

THE FOUR STAGES (TIMOTHY CLARK)
Stage 1: Inclusion Safety — I feel safe being part of this team
Stage 2: Learner Safety — I feel safe asking questions, making mistakes, and learning
Stage 3: Contributor Safety — I feel safe contributing my ideas and expertise
Stage 4: Challenger Safety — I feel safe challenging the status quo, disagreeing, and proposing change

Teams cannot skip stages. A team that jumps to "challenge everything" without inclusion and learner safety creates conflict, not innovation.

HOW PSYCHOLOGICAL SAFETY AFFECTS SCRUM OUTCOMES

Retrospectives without psychological safety: surface-level observations, no one names the real problems, no behavior change between Sprints.
Retrospectives with psychological safety: honest data, root cause analysis, the real problems get named and addressed.

Daily Scrum without psychological safety: developers hide blockers, say "everything is fine," and solve problems alone.
Daily Scrum with psychological safety: developers surface impediments immediately, ask for help, and swarm on problems together.

SCRUM MASTER BEHAVIORS THAT BUILD PSYCHOLOGICAL SAFETY
- Model vulnerability: be the first to admit you don''t know, or that you made a mistake
- React to bad news with curiosity, not blame: "What happened? What did we learn?" not "How did this happen?"
- Protect quiet voices: "We haven''t heard from everyone. What do you think?"
- Depersonalize feedback: make it about the work, not the person

SCRUM MASTER BEHAVIORS THAT DESTROY PSYCHOLOGICAL SAFETY
- Publicly criticizing a developer''s contribution in the Sprint Review
- Reporting individual developer performance to management
- Allowing one voice to dominate every retrospective
- Minimizing concerns raised in the Daily Scrum ("that''s not really a blocker")'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 7: Empiricism deep dive
  UPDATE videos SET
    description = 'Empiricism is the philosophical foundation of Scrum — decisions are made based on observation and experience, not speculation or prediction. This lesson goes deeper than the three pillars to explain why complex work requires empiricism, how empiricism differs from defined processes, and where empiricism breaks down in practice.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Empiricism deep dive',
      'description', 'Empiricism is Scrum''s philosophical foundation: transparency enables inspection; inspection enables adaptation. This lesson explains why complex work requires it, how it differs from defined processes, and where it breaks down.',
      'transcript', 'EMPIRICISM DEEP DIVE

THE PHILOSOPHICAL FOUNDATION
Empiricism holds that knowledge comes from experience and observation — not from prior planning or theoretical models. In product development, this means: we cannot know the full solution upfront; we must build, observe, and adapt.

The opposite of empiricism is a defined process: "Follow these steps exactly and the correct output will emerge." Defined processes work in predictable, repeatable, low-complexity environments (manufacturing, accounting). They fail in complex, creative, uncertain environments (product development, research, organizational change).

THE CYNEFIN FRAMEWORK CONTEXT
Dave Snowden''s Cynefin framework identifies domains of work:
- Simple/Clear domain: best practices apply, defined processes work
- Complicated domain: good practices and expertise apply; analysis leads to answers
- Complex domain: emergent practices; cause and effect only visible in retrospect; requires empiricism
- Chaotic domain: act first, then sense and respond

Product development lives in the complex domain. Scrum is a framework for complex domain work.

TRANSPARENCY: THE PREREQUISITE
Transparency means making the work, the process, and the results visible. Without transparency, inspection is based on incomplete information and adaptation is uninformed.
Transparency requires courage: surfacing that the Sprint is at risk, that the backlog is a mess, or that a team member is struggling is uncomfortable. Teams with low psychological safety produce opaque transparency.

INSPECTION: THE ENGINE
Inspection means frequently reviewing the artifacts and progress for problems. The five Scrum events ARE the inspection cadence. They are not optional ceremonies — they are the moments when the empirical engine fires.
Inspection without transparency is blind. Inspection without adaptation is useless.

ADAPTATION: THE OUTPUT
Adaptation means changing the process, the plan, or the product based on what inspection revealed. If inspection reveals problems but adaptation does not follow, the empirical loop is broken. The team is going through the motions without learning.

WHERE EMPIRICISM BREAKS DOWN IN PRACTICE
- Teams that run events but do not make decisions in them (inspection without adaptation)
- Teams that hide problems from stakeholders (opacity defeating transparency)
- Organizations that punish teams for revealing Sprint Goal risk (destroying the courage that enables transparency)'
    ))
  WHERE chapter_id = v_ch AND order_index = 7;

  -- order_index = 8: Building transparency
  UPDATE videos SET
    description = 'Transparency is the first pillar of Scrum — and the hardest to maintain under pressure. This lesson covers how to build and sustain transparency using concrete Scrum tools (Sprint Board, velocity charts, impediment logs, Definition of Done), why transparency requires courage, and how the Scrum Master creates the conditions for honest visibility.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Building transparency',
      'description', 'Transparency is Scrum''s first pillar and the hardest to maintain under pressure. This lesson covers the tools that enable it, why it requires courage, and how the SM creates conditions for honest visibility.',
      'transcript', 'BUILDING TRANSPARENCY

TRANSPARENCY AS THE FOUNDATION
"Without transparency, inspection leads to unknown and undesirable variances. Inspection without transparency is meaningless." The Scrum Guide makes clear: transparency is not one of three equal pillars. It is the foundation. You cannot inspect what you cannot see. You cannot adapt based on hidden information.

THE TRANSPARENCY TOOLS IN SCRUM

Sprint Board
The Sprint Board makes the current state of all Sprint work visible at a glance. Every item''s status (To Do, In Progress, Review, Done) is public. Blockers are visible. Progress toward the Sprint Goal is visible. The Board is the team''s single source of truth about Sprint status.

Velocity and Trend Data
Velocity over the last 6-10 Sprints makes the team''s delivery capacity visible. Declining velocity is a transparency signal that something is wrong — team health, technical debt, or scope creep. Hiding velocity data from stakeholders is a transparency failure.

Impediment Log
A public impediment log makes blockers visible — who owns them, how long they have been open, and whether they are being resolved. Hidden impediments cannot be removed by stakeholders who could help.

Definition of Done
The DoD makes quality expectations transparent. Without a public DoD, "Done" means different things to different people, and the Increment''s quality cannot be objectively inspected.

WHY TRANSPARENCY REQUIRES COURAGE
Transparency is emotionally hard. Surfacing that the Sprint Goal is at risk, that the team is struggling, or that a planned release cannot be met as promised — these feel like failures. Teams without psychological safety suppress these signals to avoid consequences.

The Scrum Master''s role is to create conditions where surfacing bad news is rewarded, not punished. This requires modeling transparency personally and responding to transparency with curiosity and problem-solving, not blame.

THE TRANSPARENCY PARADOX
Teams that hide problems appear to perform well — until the problems compound into a crisis. Teams that surface problems early appear to have more problems — but they are actually resolving them faster. Transparent teams are faster in the long run, not slower.'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 11 — Facilitation Mastery (OFFSET 10)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 10;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 11 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Facilitation techniques
  UPDATE videos SET
    description = 'The Scrum Master is a professional facilitator — someone who designs and leads group processes to achieve a specific outcome. This lesson covers the five core facilitation techniques every Scrum Master needs: dot voting, 1-2-4-All, Silent Brainstorming, Round Robin, and Fist-to-Five, with guidance on when to use each.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Facilitation techniques',
      'description', 'Five core facilitation techniques — dot voting, 1-2-4-All, Silent Brainstorming, Round Robin, Fist-to-Five — with guidance on when to use each based on the desired outcome.',
      'transcript', 'FACILITATION TECHNIQUES

THE FACILITATOR''S ROLE
A facilitator is neutral about content but responsible for the process. As a Scrum Master facilitating Scrum events, you do not contribute ideas to the Sprint Goal, the retrospective, or the backlog — you design the process by which the team reaches those outcomes together.

TECHNIQUE 1: DOT VOTING
Use when: you have a list of options and need the group to converge on priorities
How: give each participant a fixed number of dots (typically 5). Everyone places dots silently on their preferred options (can stack dots on one item). Tally and discuss.
Why it works: prevents loudest voice from dominating the selection; makes preferences visible simultaneously

TECHNIQUE 2: 1-2-4-ALL
Use when: you want maximum participation on a complex question
How: 1 minute alone, 2 minutes in pairs, 4 minutes in groups of four, then share with all
Why it works: builds on individual thinking before group influence; ensures introverts contribute as much as extroverts

TECHNIQUE 3: SILENT BRAINSTORMING
Use when: generating ideas where social pressure may inhibit creativity (retrospectives, Sprint Planning)
How: everyone writes ideas silently on sticky notes for 5-10 minutes before any sharing begins
Why it works: prevents anchoring (the first idea spoken sets the frame for all subsequent ideas); equalizes contribution

TECHNIQUE 4: ROUND ROBIN
Use when: you need every voice heard in sequence; when one or two people dominate
How: go around the room (or video call) in order, each person contributes one idea or comment. Anyone can pass.
Why it works: creates a structural expectation of contribution; surfaces quiet voices

TECHNIQUE 5: FIST-TO-FIVE
Use when: you need to gauge consensus or commitment on a decision
How: on the count of three, everyone shows fingers: 5 = full support, 4 = support with minor concerns, 3 = neutral, 2 = concerns but won''t block, 1 = major concerns, 0/fist = block
Why it works: makes individual levels of commitment visible simultaneously; surfaces concerns before a decision is finalized'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 5: Liberating Structures
  UPDATE videos SET
    description = 'Liberating Structures are 33 simple microstructures that replace or enhance conventional meetings and workshops. Developed by Henri Lipmanowicz and Keith McCandless, they are designed to include and unleash everyone in the room. This lesson introduces the concept, covers three essential structures, and explains how they differ from traditional facilitation formats.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Liberating Structures',
      'description', 'Liberating Structures are 33 microstructures for inclusive participation. This lesson introduces 1-2-4-All, TRIZ, and What/So What/Now What, and explains how they differ from conventional meeting formats.',
      'transcript', 'LIBERATING STRUCTURES

WHAT ARE LIBERATING STRUCTURES?
Liberating Structures are 33 simple, practical methods for facilitating group conversation and problem-solving. They were developed by Henri Lipmanowicz and Keith McCandless to address a fundamental problem: conventional meeting structures (presentation, managed discussion, open discussion, status report) exclude most participants and suppress innovation.

The name is precise: they liberate contribution by making conventional hierarchies temporarily irrelevant.

1-2-4-ALL (THE GATEWAY STRUCTURE)
The first Liberating Structure most facilitators learn. Already covered in the techniques lesson — but worth knowing it is part of this library.
Best Scrum use: retrospective data gathering; Sprint Review feedback collection

TRIZ: MAKE ROOM FOR THE NEW BY DISSOLVING THE OLD
TRIZ asks a counterintuitive question: "What would we need to do to absolutely guarantee that our worst outcome becomes reality?"
1. What are the worst possible outcomes for our Sprint / product / team?
2. What are we currently doing that contributes to those outcomes?
3. What are we going to stop doing?
Best Scrum use: retrospectives where the team is stuck in recurring anti-patterns

WHAT / SO WHAT / NOW WHAT
A three-stage reflection structure for turning experience into learning:
- WHAT: what happened? (observable facts, data, events)
- SO WHAT: what does it mean? (patterns, trends, implications)
- NOW WHAT: what should we do? (actions, experiments, commitments)
Best Scrum use: Sprint Review debrief; retrospective after a difficult Sprint; post-incident review

HOW LIBERATING STRUCTURES DIFFER FROM CONVENTIONAL FACILITATION
Conventional facilitation: the facilitator manages a discussion, calling on people and synthesizing.
Liberating Structures: the structure itself distributes participation. The facilitator''s job is to select, introduce, and sequence structures — not to manage who speaks.

WHERE TO LEARN MORE
Liberatingstructures.com contains all 33 structures with descriptions, timing, and examples. Start with 1-2-4-All, TRIZ, and What/So What/Now What before expanding.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- order_index = 6: Group dynamics
  UPDATE videos SET
    description = 'Every team moves through predictable stages of development — forming, storming, norming, and performing (Tuckman). The Scrum Master''s role changes at each stage. This lesson covers how to recognize each stage, how to respond as a Scrum Master, what regression looks like, and why productive conflict is a sign of healthy storming, not dysfunction.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Group dynamics',
      'description', 'Tuckman''s forming/storming/norming/performing model with SM responses at each stage, signs of regression, and why productive conflict in storming is a healthy sign.',
      'transcript', 'GROUP DYNAMICS

TUCKMAN''S STAGES OF TEAM DEVELOPMENT

FORMING
Characteristics: politeness, uncertainty, high dependence on the leader/SM
Team behavior: members are on their best behavior; they avoid conflict; they look to the SM for direction
SM role at this stage: provide structure and clarity. Establish team norms explicitly. Run structured events carefully (every event should feel purposeful and professional). Do not rush to independence — the team is not ready yet.

STORMING
Characteristics: conflict, power struggles, frustration with process or teammates
Team behavior: disagreements surface; members push back on decisions; some may challenge the SM''s approach
SM role at this stage: do NOT suppress conflict — it is productive. Your role is to make conflict safe: "This disagreement is a sign that people care about doing good work. Let''s work through it." Facilitate the conflict; don''t resolve it for them. Teams that skip storming never reach performing.

NORMING
Characteristics: shared norms emerge; collaboration improves; trust begins
Team behavior: the team self-organizes more effectively; conflict is addressed directly but not destructively; retrospectives produce real improvements
SM role at this stage: step back from facilitation. Let the team lead more events. Shift your focus from process to outcomes. Start coaching toward team autonomy.

PERFORMING
Characteristics: high trust, high output, self-managing, resilient
Team behavior: the team solves problems without SM intervention; they coach each other; retrospectives are deep and productive
SM role at this stage: serve as a strategic partner rather than a process keeper. Focus on organizational impediments and the team''s long-term growth.

REGRESSION
Teams regress when: a new member joins (back to forming), a major failure occurs (back to storming), the SM or PO changes (back to forming). Regression is normal and expected — not a failure.

PRODUCTIVE VS. DESTRUCTIVE CONFLICT
Productive conflict: different ideas compete on merit; people disagree about approach, not about each other''s value
Destructive conflict: personal attacks, blame, passive aggression, exclusion
SM interventions: name destructive conflict immediately ("We''re moving from the idea to the person; let''s step back"). Let productive conflict run its course.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 8: Designing workshops
  UPDATE videos SET
    description = 'A well-designed workshop does not happen by accident. It starts with clarity about purpose and desired outcomes, then builds backward to the agenda. This lesson covers the full design process — from purpose to agenda structure to energy management — and addresses the specific differences between virtual and in-person facilitation.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Designing workshops',
      'description', 'Workshop design starts with purpose and outcomes, then builds backward to the agenda. This lesson covers the full design process, energy management, and virtual vs. in-person facilitation differences.',
      'transcript', 'DESIGNING WORKSHOPS

THE BACKWARDS DESIGN PRINCIPLE
Most workshops fail because they start with agenda items: "We have 2 hours; what should we discuss?" Effective workshops start with outcomes: "What must be true when this workshop ends?" The agenda is built backwards from that answer.

STEP 1: DEFINE THE PURPOSE
Why are we gathering? What problem are we solving or decision are we making?
Examples: "Align the team on the Sprint Goal before planning," "Generate improvement experiments for the next Sprint," "Co-create the Definition of Done with a new team"

STEP 2: DEFINE THE DESIRED OUTCOMES
What specific deliverables or decisions will exist at the end?
Examples: "A Sprint Goal that every team member can recite," "Three improvement hypotheses with owners and success criteria," "A DoD with at least 8 criteria that the team has signed off on"

STEP 3: DESIGN THE AGENDA
Work backwards from your outcomes. What activities will produce each outcome? In what sequence?
Sequence principles:
- Open with an activity that gets everyone participating (not a presentation)
- Move from divergent (generate many ideas) to convergent (select and commit)
- Close with clarity about what was decided and what happens next

TIMING AND ENERGY MANAGEMENT
- The first 20 minutes are highest-energy — use them for your most important activity
- Energy drops after 60-90 minutes; build in a break or a shift in activity type
- End 5-10 minutes early for closing and action commitment — do not let closing be rushed

PRE-WORK AND POST-SYNTHESIS
- Pre-work: send participants reading or reflection questions before the workshop so the time together is spent on decisions, not information transfer
- Post-synthesis: within 24 hours, share a summary of decisions made, actions committed, and owners named

VIRTUAL VS. IN-PERSON FACILITATION
- Virtual: shorter sessions (90 min max), more structured activities (less open discussion), more explicit participation cues ("I see Anna has her hand up"), digital collaboration tools (Miro, MURAL, Mentimeter)
- In-person: more physical movement possible; larger activities (physical wall-sized boards); social energy builds naturally between activities'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 12 — Coaching & Team Dynamics (OFFSET 11)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 11;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 12 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Coaching Agile Teams
  UPDATE videos SET
    description = 'Team coaching is different from individual coaching. As a Scrum Master coaching an Agile team, you are working with the team as a system — not just with individual members. This lesson covers the distinction between team and individual coaching, the team maturity model, and how to use the team''s own data as coaching material.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Coaching Agile Teams',
      'description', 'Team coaching works with the team as a system, not as individuals. This lesson covers team vs. individual coaching, the team maturity model, and using the team''s own data as coaching material.',
      'transcript', 'COACHING AGILE TEAMS

TEAM COACHING VS. INDIVIDUAL COACHING
Individual coaching: one coach, one coachee. The focus is on the individual''s thinking, behavior, and growth.
Team coaching: one coach, one team system. The focus is on the team''s collective patterns, norms, interactions, and effectiveness.

Teams are not the sum of their individuals. A team with high individual capability but poor collaboration produces worse outcomes than a team with average individual capability and excellent collaboration. When coaching a team, you are coaching the interactions between people, not just the people.

THE TEAM MATURITY MODEL
Scrum Masters work with teams at different maturity levels. The SM''s coaching stance should match the team''s maturity:

Low maturity (new to Scrum, forming stage):
- High structure, more directive facilitation
- Explicit about Scrum rules and purposes
- More mentoring than coaching

Medium maturity (norming, beginning to self-organize):
- Support without taking over
- Coaching questions to deepen self-reflection
- Facilitate the retrospective; let them design the Daily Scrum themselves

High maturity (performing, self-managing):
- Primarily a strategic partner
- Work on organizational impediments
- Challenge the team''s thinking on the next level of growth

COACHING THE SYSTEM, NOT THE INDIVIDUALS
When the Daily Scrum consistently runs long, do not coach each developer individually. Coach the team system: "As a team, we seem to use the Daily Scrum for problem-solving. What do we want to do differently?"

USING THE TEAM''S OWN DATA
The most powerful coaching material is the team''s own performance data. Bring velocity trends, burndown charts, impediment resolution times, and retrospective action completion rates into coaching conversations. The data is neutral — it belongs to the team, not to you. "What does this velocity trend tell us about how we are working?"'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 8: Team dynamics
  UPDATE videos SET
    description = 'Patrick Lencioni''s Five Dysfunctions of a Team model describes the cascading ways teams fail: absence of trust, fear of conflict, lack of commitment, avoidance of accountability, and inattention to results. This lesson maps each dysfunction to Scrum-specific symptoms and shows how the Scrum Master uses retrospectives and coaching to address each layer.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Team dynamics',
      'description', 'Lencioni''s Five Dysfunctions — trust, conflict, commitment, accountability, results — mapped to Scrum symptoms, with SM interventions for each dysfunction layer.',
      'transcript', 'TEAM DYNAMICS

LENCIONI''S FIVE DYSFUNCTIONS MODEL
Patrick Lencioni''s "The Five Dysfunctions of a Team" describes a pyramid of team failures. Each dysfunction enables the next:

DYSFUNCTION 1: ABSENCE OF TRUST (BASE)
Definition: team members are unwilling to be vulnerable with each other
Scrum symptom: no one raises blockers in the Daily Scrum; retrospectives produce only safe, surface-level feedback; developers do not ask for help
SM intervention: model vulnerability personally. Share your own uncertainties. Run retrospective formats that normalize honest expression (anonymous input, 1:1 pre-conversations). Build psychological safety before expecting transparency.

DYSFUNCTION 2: FEAR OF CONFLICT
Definition: teams that lack trust are unable to engage in unfiltered, passionate debate
Scrum symptom: Sprint Planning produces a polite consensus that no one believes in; the same retrospective topics recur because the root cause is never named; the PO''s decisions are never challenged
SM intervention: make conflict legitimate — "This disagreement means we haven''t aligned yet. Let''s work through it." Separate idea conflict from personal conflict explicitly.

DYSFUNCTION 3: LACK OF COMMITMENT
Definition: without conflict, teams make ambiguous decisions that people don''t buy into
Scrum symptom: Sprint Goal is vague; team members pursue personal interpretations of the goal; no one feels personally accountable for Sprint success
SM intervention: end every Sprint Planning with a clear, specific Sprint Goal written on the board that every team member can recite. Lack of clarity in commitment is often a lack of clarity in the goal.

DYSFUNCTION 4: AVOIDANCE OF ACCOUNTABILITY
Definition: without commitment, people avoid calling out peers who underperform
Scrum symptom: the same developer misses the Daily Scrum repeatedly with no team response; low-quality work is accepted silently; the Definition of Done is not enforced
SM intervention: make accountability a team norm, not a management function. "We said we would do X. What happened?" in the retrospective is a team accountability conversation, not a performance review.

DYSFUNCTION 5: INATTENTION TO RESULTS (TOP)
Definition: when accountability is absent, individual ego or team ego replaces focus on collective results
Scrum symptom: the team optimizes for looking good in the Sprint Review rather than actually delivering value; velocity is manipulated rather than improved
SM intervention: make collective results the team''s primary identity. Celebrate Sprint Goal achievement together. Diagnose Sprint Goal failure together. The retrospective is the primary tool.'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 13 — Stakeholder Engagement (OFFSET 12)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 12;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 13 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Stakeholder engagement
  UPDATE videos SET
    description = 'Effective stakeholder engagement is proactive, not reactive. This lesson covers the stakeholder map refresh, how to distinguish active from passive engagement, the pull versus push communication model, and how to use the Sprint Review as the primary mechanism for making stakeholders feel heard and aligned.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Stakeholder engagement',
      'description', 'Proactive stakeholder engagement: refreshing the stakeholder map, active vs. passive engagement, pull vs. push communication, and the Sprint Review as the primary alignment mechanism.',
      'transcript', 'STAKEHOLDER ENGAGEMENT

THE STAKEHOLDER MAP REFRESH
Stakeholders are not a fixed list. New stakeholders emerge as the product grows and as organizational contexts shift. The stakeholder map should be refreshed quarterly or when significant organizational changes occur.

Questions to trigger a refresh:
- Who has recently started depending on this product''s output?
- Who has organizational authority that could block or accelerate progress?
- Who has been absent from Sprint Reviews who should be present?
- Who has been advocating for the product informally in ways the PO may not know about?

ACTIVE VS. PASSIVE ENGAGEMENT
Active engagement: stakeholders participate in Sprint Reviews, contribute feedback, and make decisions that affect the backlog.
Passive engagement: stakeholders receive information (sprint newsletters, dashboards) but do not participate in two-way conversations.

Most stakeholders should be actively engaged at a level matching their power and interest. The most common mistake: treating high-power, high-interest stakeholders as passive recipients of status updates.

PULL VS. PUSH COMMUNICATION
Push communication: the team sends information to stakeholders (emails, status reports, dashboards)
Pull communication: information is available and stakeholders access it when they need it (Sprint Board visible to stakeholders, sprint newsletter they can subscribe to)

Pull communication scales better and respects stakeholder time. Push communication can overwhelm and create noise. Effective SM stakeholder engagement uses pull as the default and push for critical updates only.

THE SPRINT REVIEW AS THE PRIMARY ENGAGEMENT MECHANISM
The Sprint Review is not a demonstration — it is an inspection and adaptation event. When run well, it makes stakeholders active participants in product direction:
- They inspect the actual Increment (not slides about the Increment)
- They provide feedback on what they see
- Their feedback directly influences the backlog ordering
Stakeholders who attend well-run Sprint Reviews consistently report feeling more aligned and less need for status updates. The Sprint Review IS the engagement mechanism — invest in making it excellent.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 6: Managing expectations
  UPDATE videos SET
    description = 'Expectation gaps — the distance between what stakeholders expect and what the team will deliver — are the source of most stakeholder relationship problems. This lesson covers how to continuously close the expectation gap, why over-communication is prevention rather than overhead, and when to escalate an expectation gap to leadership.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Managing expectations',
      'description', 'Expectation gaps between stakeholders and the team cause most relationship problems. This lesson covers continuous gap closure, over-communication as prevention, and when to escalate.',
      'transcript', 'MANAGING EXPECTATIONS

THE EXPECTATION GAP
An expectation gap is the distance between what a stakeholder believes will happen and what the team will actually deliver. Expectation gaps do not close themselves. Left unaddressed, they widen over time and produce stakeholder frustration at the worst possible moment — a Sprint Review, a release, or a board presentation.

THE CONTINUOUS CLOSURE MODEL
Expectation management is not a one-time conversation at the start of a project. It is a continuous process:
- At Sprint Planning: what will be done this Sprint? (set the expectation)
- At the Daily Scrum: is the Sprint on track? (maintain or update the expectation)
- Mid-Sprint check-in: if Sprint Goal is at risk, surface it early, not at the Sprint Review
- At Sprint Review: what was actually done? (close the cycle)

WHY OVER-COMMUNICATION IS PREVENTION
The impulse to wait until you have good news before communicating creates expectation gaps. Stakeholders fill communication vacuums with their own assumptions — and those assumptions are usually more optimistic than reality.

Over-communication means:
- Sharing Sprint Goal risk as soon as it is identified, not at the Sprint Review
- Proactively explaining trade-offs before stakeholders ask
- Providing context for backlog ordering decisions before stakeholders question them

WHEN TO ESCALATE
Some expectation gaps cannot be closed at the team level:
- A stakeholder''s expectation is based on a commitment made by senior leadership, not by the team
- The gap involves delivery timeline, budget, or scope decisions that require executive authority
- A key stakeholder continues to hold unrealistic expectations despite repeated transparent communication

The SM''s escalation path: document the gap clearly, bring it to the PO first, then escalate to leadership with the PO''s alignment. The escalation is not about blame — it is about gap-closing at the right level of authority.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 8: Talking to executives
  UPDATE videos SET
    description = 'Executives need different information than team members — outcomes not outputs, risk in business terms, and confidence signals rather than task lists. This lesson covers how to build an executive dashboard, how to communicate in language that resonates with senior leadership, and how the Sprint Review functions as the primary executive confidence-building tool.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Talking to executives',
      'description', 'Executives need outcomes not outputs, risk in business language, and consistent delivery signals. This lesson covers the executive dashboard, translating Scrum language, and the Sprint Review as the primary confidence tool.',
      'transcript', 'TALKING TO EXECUTIVES

THE EXECUTIVE TRANSLATION PROBLEM
Executives do not care about story points, velocity, Sprint burndowns, or backlog size. They care about: Is the product delivering business value? What risks should I know about? Can I trust this team to deliver?

Every communication with executives must translate Scrum language into business language.

OUTCOMES, NOT OUTPUTS
Wrong: "We completed 47 story points this Sprint across 12 user stories."
Right: "This Sprint we delivered the user onboarding flow. We can now acquire and activate new users without manual support. We''re targeting a 40% reduction in support tickets from new users over the next month."

Executives fund outcomes. Show them the outcome.

RISK IN BUSINESS LANGUAGE
Wrong: "We have 3 impediments open."
Right: "Our integration with the payment provider is blocked pending their API documentation. This puts the checkout feature at risk for next Sprint. We''re working to resolve it, and if we can''t by Wednesday, we''ll need a decision on an alternative provider."

Executives need to know: what is at risk, what is the business impact, and what decision do you need from them?

THE EXECUTIVE DASHBOARD
If executives need ongoing visibility, build a simple one-page dashboard showing:
- Sprint Goal (current) and status (on track / at risk)
- Key metrics: user adoption, error rates, performance (outcomes, not tasks)
- Top 1-2 risks with business impact and mitigation status
- Next Sprint Goal (so they can see what''s coming)

THE SPRINT REVIEW AS THE PRIMARY EXECUTIVE CONFIDENCE TOOL
The best way to build executive confidence is consistent, transparent delivery — demonstrated in Sprint Reviews. When executives see working software delivered every Sprint, with honest discussion of what was learned and what is next, their confidence in the team grows organically.

Invite executives to Sprint Reviews. Make the Review accessible (no jargon). Show the working product. Be honest about trade-offs. Consistent delivery is the most powerful executive communication strategy available.'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 14 — Organizational Change (OFFSET 13)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 13;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 14 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Change management primer
  UPDATE videos SET
    description = 'Scrum adoption is a change management challenge, not just a process change. People resist change for real reasons — loss of status, fear of the unknown, disruption of habits — and addressing that resistance requires empathy, not force. This lesson introduces the core concepts of change management as applied to Scrum adoption.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Change management primer',
      'description', 'Scrum adoption is a change management challenge. People resist change for real reasons — loss of status, fear, habit — and the SM addresses resistance with empathy and evidence, not mandate.',
      'transcript', 'CHANGE MANAGEMENT PRIMER

WHY SCRUM ADOPTION IS A CHANGE MANAGEMENT CHALLENGE
Installing Scrum is easy. Running a 2-day training, creating a Sprint Board, and declaring "we are now Agile" takes a week. Achieving genuine Scrum adoption — where the team''s thinking and behavior actually changes — takes months or years. The difference is change management.

WHY PEOPLE RESIST CHANGE
Resistance to change is not irrationality — it is self-protection. Common sources of resistance to Scrum adoption:

Loss of status: a Project Manager who becomes a "team member" may feel they have lost authority and identity. Their resistance is not about Scrum — it is about their professional identity.

Fear of the unknown: "What will my career look like without my current title?" Uncertainty about what Scrum means for them personally creates anxiety that expresses itself as skepticism.

Habit disruption: established processes — however inefficient — are comfortable. Breaking habits requires activation energy that many people would rather not spend.

Competing commitments: people may be supportive of Scrum in theory but committed to behaviors (meeting culture, document-heavy approval processes) that conflict with it in practice.

ADDRESSING RESISTANCE WITH EMPATHY
The least effective approach: mandate the change, dismiss resistance as "they don''t get it," penalize non-compliance.
The most effective approach:
1. Understand the resistance — "What are you concerned about?" Listen without defending
2. Acknowledge the loss — "Losing the PM title feels like losing recognition. That''s real."
3. Show the evidence — small wins, team improvements, career growth stories
4. Give people time — change happens at the pace of trust

THE SM''S ROLE IN ORGANIZATIONAL CHANGE
The SM is an organizational change agent — at the team level and beyond. At the team level: coaching, facilitation, and modeling the new behaviors. At the organizational level: identifying structural impediments to Scrum and working with leadership to remove them.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 7: SAFe transformation overview
  UPDATE videos SET
    description = 'The Scaled Agile Framework (SAFe) is the most widely adopted framework for scaling Agile across large organizations. This lesson covers what SAFe is, its three levels (Team, Program, Portfolio), how PI Planning works, when organizations choose SAFe, and the most common pitfalls in SAFe adoption.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'SAFe transformation overview',
      'description', 'SAFe is the most widely adopted scaling framework. This lesson covers three levels, PI Planning, when organizations choose it, and the most common pitfalls in SAFe adoption.',
      'transcript', 'SAFE TRANSFORMATION OVERVIEW

WHAT IS SAFE?
The Scaled Agile Framework (SAFe) is a body of knowledge with structured guidance for enterprise-scale Agile adoption. It was developed by Dean Leffingwell and has become the most widely used scaling framework in large organizations worldwide.

SAFe operates at three primary levels:

TEAM LEVEL
Individual Scrum teams (or Kanban teams) operate as they normally would. SAFe calls these Agile Release Trains (ARTs) ''team trains'' at this level. Teams follow standard Scrum practices with Sprint-level iterations.

PROGRAM LEVEL (AGILE RELEASE TRAIN - ART)
Multiple Scrum teams are grouped into an Agile Release Train (ART) — typically 50-125 people — working together toward a common Program Increment (PI) goal. The ART is the primary value delivery mechanism in SAFe.

PORTFOLIO LEVEL
Strategic themes, epics, and portfolio management govern which ARTs work on what. Portfolio Kanban manages the flow of large strategic initiatives.

PI PLANNING
Program Increment (PI) Planning is SAFe''s signature event: a 2-day planning session where all teams in an ART come together to plan the next 8-12 weeks of work, align on dependencies, and commit to PI Objectives.
- All teams plan simultaneously, identifying cross-team dependencies in real time
- The result: a synchronized plan across all teams for the next Program Increment
- PI Planning is often the biggest change management challenge in SAFe adoption: getting executives to release everyone for 2 full days

WHEN ORGANIZATIONS CHOOSE SAFE
- Multiple Scrum teams need to coordinate on shared dependencies
- The organization wants a structured framework with clear roles (Release Train Engineer, Product Management) and certifications
- Executive buy-in exists for a structured transformation program

COMMON PITFALLS IN SAFE ADOPTION
- Waterfall at scale: teams adopt Scrum practices but PI Planning becomes a waterfall commitment cycle
- Too much ceremony too fast: organizations implement all SAFe levels before achieving basic Scrum competency at the team level
- Ignoring technical practices: SAFe without DevOps, CI/CD, and clean architecture creates a ceremony-heavy but slow delivery engine'
    ))
  WHERE chapter_id = v_ch AND order_index = 7;

  -- order_index = 8: Leading change
  UPDATE videos SET
    description = 'The Scrum Master is a change leader — at the team level and increasingly at the organizational level. This lesson applies Kotter''s 8-Step Change Model to Scrum adoption, distinguishes the change leader from the change manager, and explores the SM''s role in building the coalition and creating short-term wins that sustain organizational Scrum adoption.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Leading change',
      'description', 'The SM is a change leader. This lesson applies Kotter''s 8 steps to Scrum adoption, distinguishes leading from managing change, and covers building coalitions and creating short-term wins.',
      'transcript', 'LEADING CHANGE

THE CHANGE LEADER VS. THE CHANGE MANAGER
Change manager: implements a change process — communicates the plan, tracks milestones, manages compliance
Change leader: creates the conditions for change — builds vision, mobilizes coalition, removes obstacles, sustains momentum

Scrum Masters are change leaders, not change managers. You are not implementing a Scrum process on behalf of someone else''s decision. You are building the team''s and organization''s belief in empiricism and Agile principles.

KOTTER''S 8-STEP CHANGE MODEL APPLIED TO SCRUM ADOPTION

Step 1: Create a sense of urgency
Make the cost of NOT changing visible. "Our current process delivers every 6 months. Competitors are shipping weekly. What is the cost of staying the same?"

Step 2: Build a guiding coalition
Find the 2-3 leaders (formal or informal) who believe in the change and recruit them as advocates. Change driven by a coalition is more sustainable than change driven by a single champion.

Step 3: Form a strategic vision and initiatives
"In 12 months, we will deliver working software every 2 weeks, with customer feedback shaping every Sprint." Clear, specific, inspiring.

Step 4: Enlist a volunteer army
Find the early adopters — the developers and POs who are energized by Agile. Their enthusiasm is infectious. Let them lead the first Scrum teams.

Step 5: Enable action by removing barriers
The SM''s primary organizational role: identify and remove the structural impediments to Scrum adoption. Approval processes, resource allocation models, and org chart hierarchies that prevent self-managing teams.

Step 6: Generate short-term wins
Find something Scrum can improve in the first 2 Sprints. Make it visible. Celebrate it. "In the first Sprint, we fixed a bug that had been in the backlog for 4 months." Short-term wins build credibility.

Step 7: Sustain acceleration
Do not declare victory too early. Change resistance resurfaces when pressure returns. Keep the retrospective focused on improvement; keep surfacing wins.

Step 8: Institute change
The change sticks when "we do Scrum" becomes "this is how we work" — embedded in onboarding, hiring, and team culture. The SM''s long-term goal is making themselves unnecessary at the team level by institutionalizing the practices.'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 15 — Agile Metrics (OFFSET 14)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 14;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 15 chapter not found for course %', v_course_id; END IF;

  -- order_index = 6: Velocity misuse
  UPDATE videos SET
    description = 'Velocity is one of the most misused metrics in Scrum. This lesson covers the four most damaging anti-patterns — velocity as a performance target, inter-team comparisons, velocity in executive reporting, and story point inflation under pressure — and offers better alternatives for each misuse pattern.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Velocity misuse',
      'description', 'Four velocity anti-patterns — performance target, inter-team comparison, executive reporting, story point inflation — and better alternatives for each misuse pattern.',
      'transcript', 'VELOCITY MISUSE

WHAT VELOCITY IS FOR
Velocity is a planning tool: it tells the team approximately how many story points they can complete in a Sprint, based on historical data. It is used for Sprint Planning capacity estimation and for rough long-term forecasting. That is all it is for.

ANTI-PATTERN 1: VELOCITY AS A PERFORMANCE TARGET
Misuse: "Your velocity must be 40 points per Sprint or higher."
Problem: when velocity becomes a target, teams stop estimating honestly and start estimating to hit the target. Story points inflate. Velocity goes up. Delivery does not.
Better alternative: measure Sprint Goal achievement rate (percentage of Sprints where the Sprint Goal was met) — this cannot be gamed as easily

ANTI-PATTERN 2: VELOCITY COMPARISONS BETWEEN TEAMS
Misuse: "Team A has velocity 60; Team B has velocity 35. Team B needs to improve."
Problem: story points are relative to each team''s own calibration. Team A''s 60 points may represent less actual work than Team B''s 35 points. Comparing velocities across teams is like comparing two rulers of different lengths.
Better alternative: measure cycle time and throughput per team; compare teams on outcomes delivered, not points

ANTI-PATTERN 3: VELOCITY IN EXECUTIVE REPORTING
Misuse: "We''ll report our velocity to the steering committee every month."
Problem: executives attach meaning to velocity numbers that does not exist. A velocity drop (often due to paying down technical debt — a good thing) becomes a crisis. Velocity becomes a political number.
Better alternative: report on Sprint Goals met, features delivered, and business outcomes (user adoption, error rates, time to market)

ANTI-PATTERN 4: STORY POINT INFLATION UNDER VELOCITY PRESSURE
Misuse: the team starts estimating stories as 8 points that would have been 5 points because they want to show higher velocity
Problem: inflated estimates make velocity meaningless as a planning tool. The team loses the ability to forecast accurately.
Better alternative: if the team feels pressure to show high velocity, address the organizational behavior that''s creating that pressure — not the symptom'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 16 — Scaling Scrum (OFFSET 15)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 15;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 16 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Scaling Scrum
  UPDATE videos SET
    description = 'Scaling Scrum means coordinating multiple Scrum teams working toward the same product. But scaling introduces a coordination tax — more teams means more dependencies, more communication overhead, and more risk of misalignment. This lesson covers when to scale, the architectural prerequisites, and the coordination patterns that minimize the tax.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Scaling Scrum',
      'description', 'Scaling Scrum requires the right conditions — single team truly at capacity, architecture that supports team independence — and careful coordination design to minimize the coordination tax.',
      'transcript', 'SCALING SCRUM

THE SCALING QUESTION
Organizations often scale Scrum too early. The question is not "How do we coordinate 5 teams?" but "Do we actually need 5 teams?" Scaling is warranted when:
1. A single team is genuinely at capacity — they have been delivering consistently at maximum velocity, and more work cannot be absorbed
2. The architecture supports team independence — each team can deliver end-to-end value without constant coordination with other teams
3. The product scope is large enough that multiple parallel streams of value delivery are possible

ARCHITECTURE FIRST
The biggest mistake in scaling: create 5 teams before changing the architecture. If the codebase is a monolith that requires coordination for every change, 5 teams will produce 5x the coordination overhead and likely deliver slower than 1 good team.

Before scaling, invest in:
- Modular architecture: clear boundaries between components that different teams own
- Independent deployability: each team can deploy their component without coordinating with other teams
- API contracts: well-defined interfaces between team-owned components

THE COORDINATION TAX
Every additional team adds coordination costs:
- More dependencies between teams = more Sprint Planning complexity
- More integration points = more risk of integration failures at Sprint end
- More teams = more handoffs and communication channels
- Brooks''s Law: adding people to a late software project makes it later — the same principle applies to teams

Minimizing the tax:
- Design team boundaries around business capabilities, not technical layers (avoid "frontend team" + "backend team" + "database team")
- Use Scrum of Scrums or similar coordination events to synchronize cross-team dependencies
- Invest heavily in automation to make integration cheap and fast'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 5: SAFe essentials
  UPDATE videos SET
    description = 'For Scrum Masters working in or transitioning to SAFe environments, this lesson covers the essential mechanics: PI Planning in detail, how the Agile Release Train operates, the relationship between the Sprint-level backlog and the program backlog, and the System Demo. It also maps the Scrum Master''s role onto the SAFe context.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'SAFe essentials',
      'description', 'SAFe mechanics for Scrum Masters: PI Planning, ART structure, program backlog, System Demo, and how the SM''s role maps onto a SAFe Agile Release Train.',
      'transcript', 'SAFE ESSENTIALS

PI PLANNING: THE CORE EVENT
Program Increment (PI) Planning is the heartbeat of SAFe. Every 8-12 weeks, all teams in an Agile Release Train (ART) — typically 50-125 people — come together for 2 days to plan the next PI.

Day 1: context setting — business context from business owners, product vision from Product Management, current state of the architecture from the System Architect. Then teams break out to draft their Sprint plans for the PI.

Day 2: teams present their plans. Cross-team dependencies are identified and negotiated. Risks are identified and addressed (ROAM: Resolved, Owned, Accepted, Mitigated). The ART votes on confidence in the plan (Fist-to-Five).

Output: PI Objectives for each team, a cross-team dependency board, a risk register, and a synchronized plan for all teams for the next 8-12 weeks.

THE AGILE RELEASE TRAIN (ART)
The ART is the primary organizational building block in SAFe. It is a long-lived, self-organizing team of Agile teams that plans, commits, and executes together. Key ART roles:
- Release Train Engineer (RTE): the ART''s Scrum Master — facilitates PI Planning, manages impediments at the ART level, coaches team-of-teams dynamics
- Product Management: owns the Program Backlog and the product vision across all teams
- System Architect: ensures architectural integrity across teams

PROGRAM BACKLOG
The Program Backlog contains Features — capabilities that take multiple Sprints and multiple teams to deliver. Each Feature is broken into Stories by individual teams and placed in their Team Backlogs. The SM needs to understand how Team Backlog items trace up to Program Backlog Features.

SYSTEM DEMO
At the end of each Sprint in SAFe, teams participate in a System Demo — a synchronized demonstration of all teams'' integrated work from the Sprint. This is the ART-level equivalent of the Scrum Sprint Review.

THE SM''S ROLE IN A SAFE ART
At the team level: identical to standard Scrum. At the ART level: participate in Scrum of Scrums, coordinate cross-team dependencies, attend PI Planning as the team''s facilitation lead, and escalate team-level impediments to the RTE when they require ART-level resolution.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- order_index = 6: LeSS principles
  UPDATE videos SET
    description = 'Large-Scale Scrum (LeSS) is a scaling framework that takes a radically different approach from SAFe: instead of adding organizational structure, LeSS applies Scrum principles directly at scale with minimal additional roles and rules. This lesson covers LeSS basics, LeSS vs. LeSS Huge, why LeSS requires strong foundational Scrum, and how it compares to SAFe.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'LeSS principles',
      'description', 'LeSS scales Scrum with minimal structure: one PO, one Product Backlog, multiple teams, common Sprint. This lesson covers LeSS vs. LeSS Huge, why it requires strong foundational Scrum, and comparison with SAFe.',
      'transcript', 'LESS PRINCIPLES

WHAT IS LESS?
Large-Scale Scrum (LeSS) was developed by Craig Larman and Bas Vodde. Its philosophy: Scrum at scale does not require a new framework — it requires applying Scrum''s core principles more rigorously across more teams.

LeSS deliberately minimizes added structure. Where SAFe adds roles, events, and artifacts, LeSS resists adding them.

LESS BASICS (2-8 TEAMS)
Structure:
- One Product Owner
- One Product Backlog
- Multiple self-managing Scrum Teams
- Common Sprint (all teams run on the same Sprint cadence)
- One Sprint Review (all teams demonstrate to the same stakeholders)
- Multiple Sprint Retrospectives (each team holds their own)
- One overall Sprint Retrospective to address cross-team issues

How work is distributed: teams self-select work from the single Product Backlog in Sprint Planning. Teams coordinate directly with each other rather than through a coordination layer.

LESS HUGE (8+ TEAMS)
For very large products, LeSS Huge introduces one structural addition: Area Product Owners, each responsible for a customer-centric area of the product. Each Area PO has their own Area Backlog, which feeds from the overall Product Backlog.

WHY LESS REQUIRES STRONG FOUNDATIONAL SCRUM
LeSS works only when individual teams have genuine Scrum competency. A team that cannot self-manage, prioritize, and deliver independently will not magically do so in a LeSS context. LeSS removes scaffolding — if the building is not structurally sound, removing scaffolding causes collapse. LeSS is not a starting framework; it is a framework for teams that have outgrown basic Scrum.

LESS VS. SAFE
LeSS: fewer rules, fewer roles, higher autonomy, better for organizations with strong technical practices and mature Scrum teams
SAFe: more structure, more roles, more prescription, better for large enterprises with diverse team maturity and executive need for structured governance

Both require genuine Scrum at the team level. Neither will rescue teams that are not practicing Scrum well.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 17 — AI for Scrum Master (OFFSET 16)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 16;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 17 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: AI-enabled delivery
  UPDATE videos SET
    description = 'AI tools are accelerating every phase of the Scrum delivery pipeline — from code generation and automated testing to CI/CD intelligence and Sprint analytics. This lesson covers the most impactful AI tools for Scrum delivery, how the Scrum Master can leverage them, and why human judgment remains essential for trade-offs that AI cannot make.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI-enabled delivery',
      'description', 'AI accelerates Scrum delivery: code generation, automated testing, CI/CD intelligence, Sprint analytics. The SM''s role in an AI-enabled pipeline — and where human judgment remains essential.',
      'transcript', 'AI-ENABLED DELIVERY

HOW AI IS CHANGING THE SCRUM DELIVERY PIPELINE

CODE GENERATION
AI coding assistants (GitHub Copilot, Cursor, Claude Code) accelerate developer output by generating boilerplate, suggesting implementations, and completing repetitive patterns. Impact on Scrum:
- Story point estimates may need recalibration as AI makes some work dramatically faster
- The Definition of Done needs to address AI-generated code quality (is it reviewed? is it tested?)
- New impediment category: AI tool availability, API limits, and team training on effective prompting

AUTOMATED TESTING
AI-assisted test generation creates unit tests, integration tests, and regression suites from code changes. Tools like GitHub Actions with AI analysis can detect test quality degradation. This directly supports the CI quality gate in the Definition of Done.

CI/CD INTELLIGENCE
AI can analyze CI/CD pipeline failures and suggest root causes, predict build failures before they occur, and optimize pipeline performance. For the Scrum Master: fewer impediments related to broken builds; faster cycle times.

SPRINT ANALYTICS
AI tools can analyze Sprint Board data and suggest risk signals: "Story X has been in progress for 4 days without movement — this looks like a blocker." AI Sprint analysis tools (some integrated into Jira) can flag Sprint Goal risk earlier than manual observation.

WHERE HUMAN JUDGMENT REMAINS ESSENTIAL
AI cannot make trade-off decisions: which stories to defer when capacity is at risk, how to handle a stakeholder conflict, whether to accept technical debt for a critical deadline, or how to have a difficult coaching conversation with a developer. These require human judgment, context, and relationship intelligence that AI does not have.

THE SM''S ROLE IN AN AI-ENABLED TEAM
- Ensure the team has access to and training in relevant AI tools
- Update the Definition of Done to address AI-generated code quality requirements
- Use AI Sprint analytics as an early warning system for impediments
- Maintain human judgment at all trade-off decision points'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 6: Prompting for facilitation
  UPDATE videos SET
    description = 'AI can dramatically accelerate facilitation preparation — retrospective design, Daily Scrum analysis, Sprint report generation, workshop agenda creation. But AI output is only as good as the prompt that generates it. This lesson covers the core prompt structure for facilitation use cases, with worked examples for the most common Scrum Master prompting scenarios.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Prompting for facilitation',
      'description', 'AI accelerates facilitation prep — retro design, Sprint reports, workshop agendas — but only with effective prompts. This lesson covers prompt structure (context + goal + constraints + format) with worked examples.',
      'transcript', 'PROMPTING FOR FACILITATION

THE CORE PROMPT STRUCTURE
Every effective AI prompt for facilitation has four components:

CONTEXT: who is the team? what is the situation?
"I am a Scrum Master for a 6-person software development team in their 8th Sprint. The team has been struggling with stories not completing by Sprint end for the last 3 Sprints."

GOAL: what do you want the AI to produce?
"I want to design a 60-minute retrospective that helps the team identify the root cause of incomplete stories and commit to one behavioral change."

CONSTRAINTS: what limits or requirements must the output respect?
"The team has low psychological safety — avoid formats that require public vulnerability. The retrospective must work in a virtual setting using Miro."

FORMAT: how should the output be structured?
"Give me a step-by-step agenda with timing, facilitation instructions for each phase, and the specific questions to ask."

WORKED EXAMPLE 1: RETROSPECTIVE DESIGN
Full prompt: "I am a Scrum Master for a 7-person team in their 12th Sprint. We have achieved the Sprint Goal only twice in the last 5 Sprints. The team tends to over-commit in Sprint Planning and underdeliver. Design a 75-minute retrospective using the Improvement Kata framework. Include a 5-minute opening check-in, a data-gathering phase using our Sprint burndown, an insights phase using 5 Whys, and a commitment phase resulting in one improvement experiment. Format as a step-by-step facilitation guide."

WORKED EXAMPLE 2: SPRINT REPORT GENERATION
Full prompt: "I am writing a Sprint Review summary for executive stakeholders. This Sprint we completed 34 of 40 planned story points. The Sprint Goal was ''Enable users to complete checkout without errors.'' We achieved the Sprint Goal. The 6 incomplete points were non-critical backlog improvements. Write a 3-paragraph executive summary using outcome language (not story points), highlight the Sprint Goal achievement, and note the 6 deferred items without making them sound alarming."

WORKED EXAMPLE 3: DAILY SCRUM ANALYSIS
Full prompt: "Here is a transcript of our last 5 Daily Scrums. Identify any recurring patterns — items that appear repeatedly as ''in progress,'' blockers that are mentioned more than once, and any signs that the Daily Scrum is being used for problem-solving rather than coordination. Format as a bullet-point analysis with 3-5 coaching recommendations for the Scrum Master."'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

  -- order_index = 7: AI for Scrum Masters
  UPDATE videos SET
    description = 'This lesson maps the specific AI tools available to Scrum Masters today: AI assistants for retrospective design and facilitation planning, Jira AI for Sprint analytics, GitHub Copilot for team code quality visibility, and how to build a personal AI toolkit that amplifies your effectiveness as a Scrum Master.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'AI for Scrum Masters',
      'description', 'The AI SM toolkit: ChatGPT and Claude for retrospective design, Jira AI for Sprint analytics, GitHub Copilot for code quality visibility. Building your personal AI workflow as a Scrum Master.',
      'transcript', 'AI FOR SCRUM MASTERS

THE AI SM TOOLKIT
The Scrum Master''s role involves facilitation, coaching, data analysis, communication, and organizational change work. AI tools can accelerate each of these dimensions.

CHATGPT AND CLAUDE: FACILITATION AND COACHING SUPPORT
Use cases:
- Retrospective design: "Design a 60-minute retrospective for a team struggling with sprint goal alignment"
- Facilitation debriefs: share your notes from a retrospective and ask for pattern analysis and coaching recommendations
- Coaching question generation: "What coaching questions would help a developer who consistently underestimates story complexity?"
- Communication drafting: write stakeholder updates, impediment escalation notes, and Sprint Review summaries
- Learning: "Explain the difference between LeSS and SAFe for a Scrum Master choosing a scaling approach"

JIRA AI AND PROJECT MANAGEMENT AI TOOLS
Modern Jira includes AI features that analyze Sprint data:
- Sprint velocity predictions based on historical data
- Anomaly detection (stories stuck in progress, declining velocity trends)
- Automatic backlog health scoring
- Sprint risk flagging based on current burndown trajectory

How to use it as a SM: review AI Sprint analysis before each Daily Scrum. Let the AI surface early warnings so you can address impediments proactively rather than reactively.

GITHUB COPILOT AND CODE QUALITY VISIBILITY
While Copilot is primarily a developer tool, the SM benefits from understanding it:
- AI-generated code may pass syntax checks but fail semantic quality checks — ensure your DoD includes code review for AI-generated code
- Copilot can reduce cycle time for certain story types — understand which story types benefit most, so Sprint Planning estimates remain accurate
- Use GitHub''s AI-powered code review suggestions as a coaching conversation starter in retrospectives: "Are we reviewing AI-generated code differently than human-written code?"

BUILDING YOUR PERSONAL AI WORKFLOW
Step 1: identify the 3-4 SM tasks that consume most of your preparation time (retrospective design, Sprint reports, impediment tracking)
Step 2: create prompt templates for each task
Step 3: build a prompt library in a shared document or tool (Notion, Obsidian, Google Docs)
Step 4: iterate — refine your prompts based on the quality of outputs you receive
Step 5: share effective prompts with your team and other SMs in your organization'
    ))
  WHERE chapter_id = v_ch AND order_index = 7;

  -- order_index = 8: Building AI workflows
  UPDATE videos SET
    description = 'Connecting AI tools into workflows — Slack to AI to Jira, retrospective notes to AI analysis to action items — can dramatically reduce the administrative overhead of the Scrum Master role. This lesson covers no-code automation tools, the critical principle of what to automate versus what to keep human, and how to build and maintain AI workflows safely.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Building AI workflows',
      'description', 'AI workflow automation: connecting tools (Slack → AI → Jira), no-code tools (Zapier, Make), what to automate vs. keep human, and how to test and maintain AI workflows.',
      'transcript', 'BUILDING AI WORKFLOWS

WHAT IS AN AI WORKFLOW?
An AI workflow connects multiple tools through AI so that a trigger in one tool automatically produces an output in another — with AI processing in the middle. For a Scrum Master, this means automating the repetitive information-transfer tasks that currently consume manual effort.

EXAMPLE WORKFLOW: SLACK → AI → JIRA
Trigger: a developer posts "Blocker: waiting for API documentation from the external team" in the team''s Slack channel
AI processing: the workflow detects the "Blocker" keyword, extracts the impediment description, assigns a priority based on keywords
Output: a Jira impediment ticket is automatically created with the description, assigned to the SM, and linked to the relevant Sprint

The SM no longer needs to manually transfer Slack blockers to Jira. The workflow does it in seconds.

NO-CODE AUTOMATION TOOLS
ZAPIER: the most widely used no-code automation tool. Connects 5,000+ apps. Create workflows (called "Zaps") by selecting trigger apps and action apps. Scrum Master use cases: connect Slack to Jira for impediment logging, connect Jira to Google Sheets for velocity tracking, connect Sprint Review notes to a stakeholder email list.

MAKE (FORMERLY INTEGROMAT): more complex than Zapier but more powerful for multi-step workflows. Better for workflows with conditional logic. Scrum Master use cases: build a Sprint summary workflow that pulls Jira Sprint data, formats it with AI, and generates a Slack post and email report simultaneously.

WHAT TO AUTOMATE
- Information transfer (Slack → Jira, meeting notes → action item tracker)
- Status report generation from existing data
- Reminder notifications for Scrum events
- Metric collection and dashboard updates

WHAT TO KEEP HUMAN
- Coaching conversations
- Retrospective facilitation (AI can help design it, but humans run it)
- Trade-off decisions
- Conflict resolution
- Any decision that requires understanding of team context, relationship dynamics, or organizational politics

TESTING AND MAINTAINING AI WORKFLOWS
- Test every workflow before activating it: run it manually and verify the output
- Monitor outputs weekly for the first month: AI can misinterpret edge cases
- Document each workflow: purpose, trigger, AI instruction, output, owner
- Review quarterly: team tools and processes change; workflows need updating'
    ))
  WHERE chapter_id = v_ch AND order_index = 8;

-- ══════════════════════════════════════════════════════════════════════════════
-- MODULE 18 — Capstone (OFFSET 17)
-- ══════════════════════════════════════════════════════════════════════════════
  SELECT id INTO v_ch FROM chapters WHERE course_id = v_course_id ORDER BY order_index LIMIT 1 OFFSET 17;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'Module 18 chapter not found for course %', v_course_id; END IF;

  -- order_index = 4: Portfolio best practices
  UPDATE videos SET
    description = 'A Scrum Master portfolio that stands out is specific, contextual, evidence-based, and demonstrates thinking — not just activity. This lesson covers what makes a portfolio entry compelling (specificity, context, evidence of reasoning, measurable results), how to build your GitHub portfolio, and how to curate artifacts from your learning and projects.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Portfolio best practices',
      'description', 'A standout SM portfolio shows specificity, context, reasoning, and measurable results — not just activity. This lesson covers what to include, how to structure entries, and using GitHub as your portfolio home.',
      'transcript', 'PORTFOLIO BEST PRACTICES

WHAT MAKES A PORTFOLIO ENTRY COMPELLING
Most Scrum Master portfolios are weak because they describe activities rather than outcomes. "I facilitated Sprint Planning and retrospectives for a 6-person team" is an activity. What was the context? What was the challenge? What did you actually do? What changed?

THE FOUR DIMENSIONS OF A STRONG PORTFOLIO ENTRY

SPECIFICITY
Vague: "Improved team velocity"
Specific: "The team was averaging 18 story points per Sprint with 60% Sprint Goal achievement. Over 3 Sprints, I facilitated root-cause analysis of the over-commitment pattern, introduced WIP limits of 2 per developer, and coached the team on breaking stories smaller. Velocity stabilized at 22 points with 90% Sprint Goal achievement."

CONTEXT
What was the situation before you acted? What was at stake? What made this challenging?
Example: "The team was under significant delivery pressure from a senior stakeholder who attended every Daily Scrum. Psychological safety was low — developers were not raising impediments because they feared the stakeholder''s reaction."

EVIDENCE OF THINKING
Show your reasoning, not just your actions. What did you consider? What did you try that didn''t work? Why did you choose this approach over others?
Example: "I considered addressing the stakeholder directly in private, but decided that the more sustainable intervention was to build the team''s confidence to self-manage the presence of observers. I introduced..."

MEASURABLE RESULTS
What changed? How do you know? Use numbers where possible.
Example: "Sprint Goal achievement increased from 50% to 85% over 6 Sprints. Team self-reported psychological safety (anonymous survey) increased from 5.1 to 7.8 out of 10."

GITHUB AS YOUR PORTFOLIO HOME
- Create a pinned repository for your SM portfolio with a structured README
- Include: artifacts (facilitation designs, retrospective outputs, sprint board screenshots)
- Write case studies using the four-dimension format above
- Demonstrate AI tool usage: share prompt libraries, workflow documentation, AI-augmented Sprint reports'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

  -- order_index = 5: Interview frameworks
  UPDATE videos SET
    description = 'Scrum Master interviews test both Scrum knowledge and behavioral competencies. This lesson covers the STAR method in depth for behavioral questions, the most common SM interview questions with strong answer frameworks, and how to research a company''s Agile maturity before an interview. Practice until your STAR stories are fluent, not recalled under pressure.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Interview frameworks',
      'description', 'STAR method for SM behavioral interviews, common SM interview questions with strong answer frameworks, and how to research a company''s Agile maturity. Practice = fluency.',
      'transcript', 'INTERVIEW FRAMEWORKS

THE STAR METHOD IN DEPTH
STAR stands for Situation, Task, Action, Result. It is the standard framework for behavioral interview questions ("Tell me about a time when...").

SITUATION: set the scene with enough context for the interviewer to understand the challenge
- Team size, Sprint number, organizational context
- What was happening before you acted?

TASK: what was your specific responsibility in this situation?
- Be clear about what was yours to own — not the team''s actions or the PO''s decisions
- "As Scrum Master, my responsibility was to..."

ACTION: what specifically did YOU do?
- Be precise and detailed — this is the most important part
- Do not use "we" — interviewers want to know what you did
- Sequence your actions: "First, I... Then, I... Finally, I..."

RESULT: what was the measurable outcome?
- Use numbers: "reduced cycle time by 30%," "Sprint Goal achievement went from 60% to 90%"
- If the result was partial or mixed, be honest — interviewers respect candor more than perfection

COMMON SM INTERVIEW QUESTIONS AND STRONG FRAMEWORKS

"What is the difference between a Scrum Master and a Project Manager?"
Strong framework: accountability vs. authority. The SM is accountable for team effectiveness through service and coaching. The PM is accountable for delivery through planning and control. The SM has no authority over the team; the PM traditionally does. Then give a specific behavioral example.

"How do you handle a team that resists Scrum?"
Strong framework: curiosity before prescription. Start by understanding the resistance (what specifically are they resisting and why?). Address the root concern, not the surface behavior. Pilot a change rather than mandating it. Celebrate early wins. Give a specific example.

"What do you do when an impediment is not being resolved?"
Strong framework: escalation ladder with transparency. First, clarify ownership. Then escalate with a clear deadline and business impact statement. Make it visible on the impediment log. If still unresolved, escalate to leadership with explicit risk language.

RESEARCHING COMPANY AGILE MATURITY
Before any SM interview: review the company''s job description for Agile vocabulary (do they say "Agile" generically or Scrum specifically?), LinkedIn profiles of current Scrum Masters, Glassdoor reviews mentioning Scrum or Agile. This helps you calibrate your answers: a mature Agile organization wants coaching stories; an early-stage Agile organization wants change management stories.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  -- order_index = 6: Career transformation
  UPDATE videos SET
    description = 'Becoming a Scrum Master is not just a job change — it is a mindset shift from your previous career to servant leadership. This lesson covers the transferable skills you already have, how to reframe them in Scrum language, the role of the Aladiah profile as career evidence, and what a strong first 90 days as a Scrum Master looks like.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Career transformation',
      'description', 'Career transformation to Scrum Master: transferable skills, reframing in Scrum language, the Aladiah profile as evidence, and your first 90 days plan.',
      'transcript', 'CAREER TRANSFORMATION

THE MINDSET SHIFT
Career transformation is not just learning new vocabulary. It is a shift in how you think about your professional identity and your relationship to the people you work with.

From: "I am responsible for getting this done."
To: "I am responsible for creating the conditions for the team to get this done."

From: "My value is in knowing the answers."
To: "My value is in asking the questions that help others find the answers."

From: "Authority comes from my title or seniority."
To: "Influence comes from trust, service, and expertise."

This shift is harder than learning Scrum. Many people can pass the PSM exam without making it.

TRANSFERABLE SKILLS FROM YOUR PREVIOUS CAREER

Project Management → Facilitation and Planning
You already know how to plan, coordinate, and communicate. In Scrum, these skills are applied through facilitation (not direction) and Sprint Planning (not project plans). Your project experience helps you understand complexity and risk — valuable inputs to coaching conversations.

Teaching, Training, Consulting → Coaching
You already know how to transfer knowledge and explain complex ideas. In Scrum, this becomes coaching capability — the ability to guide others toward understanding rather than telling them what to do.

People Management or Team Leadership → Servant Leadership
You already understand team dynamics, motivation, and interpersonal conflict. In Scrum, you apply these skills without positional authority — which is harder but more transferable to any context.

THE ALADIAH PROFILE AS EVIDENCE
Your Aladiah profile documents your competency journey: quiz scores, simulation performance, facilitation exercises, and capstone project. When an employer asks "Why should I hire someone without direct SM experience?" your Aladiah profile is your evidence — not a certificate, but a demonstrated competency record.

YOUR FIRST 90 DAYS AS A SCRUM MASTER

Days 1-30: Diagnose before prescribing
Listen more than you speak. Understand the team''s current state, their history, their frustrations, and what has been tried before. Build trust before changing anything.

Days 31-60: Build relationships and create early wins
Make the Daily Scrum run better. Make one retrospective produce a real action item. Remove one real impediment. Create visible wins that demonstrate your value.

Days 61-90: Establish yourself as a servant leader
By now, the team knows what you stand for. Begin coaching conversations that go deeper. Identify the first organizational impediment to address. Build your stakeholder relationships. Define what your first 6-month goal looks like.'
    ))
  WHERE chapter_id = v_ch AND order_index = 6;

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
