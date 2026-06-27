-- =============================================================================
-- Seed quiz questions for 11 missing Scrum v2 modules
-- Targets order_index: 2, 4, 5, 6, 7, 8, 10, 13, 14, 15, 16
-- 5 questions per module = 55 questions total
-- Existing questions (100) cover order_index: 0, 1, 3, 9, 11, 12, 17
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================

DO $$
DECLARE
  cid UUID := 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';
  qz  UUID;
  n   INT;
BEGIN

  -- ── Module 3 (order_index 2): Scrum Team Accountabilities ──────────────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 2 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 2'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 3 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'In Scrum, the term ''Developers'' refers to which of the following?', 'An interviewer asks you to define who the Developers are on a Scrum Team.',
   '["Only software engineers with a developer job title","Everyone on the Scrum Team who creates value each Sprint, regardless of title or specialty","The senior technical lead who makes architecture decisions","Contractors hired for specific technical tasks"]'::jsonb,
   1, 'Developers in Scrum includes all value-creating team members — UX designers, testers, analysts, engineers — not just those with ''developer'' in their title.', 1, 'scrum:roles', '{}'::jsonb),

  (qz, 'A Product Owner becomes unavailable for two weeks mid-Sprint. Who makes backlog prioritization decisions in their absence?', 'Your PO announces they will be traveling without internet access starting tomorrow.',
   '["The Scrum Master, who steps in to fill the PO role temporarily","The senior developer, who knows the product best","The PO must delegate explicit authority before leaving — no one can substitute without it","Stakeholders, who understand the business requirements"]'::jsonb,
   2, 'The PO is solely accountable for the Product Backlog. If unavailable, they must explicitly delegate authority — another person cannot assume this responsibility without that delegation.', 2, 'scrum:roles', '{}'::jsonb),

  (qz, 'The Scrum Guide states the Scrum Team is ''cross-functional.'' What does this mean in practice?', 'A stakeholder asks why the Scrum Team cannot rely on a shared database specialist from another department each Sprint.',
   '["Every team member must be skilled in both technical and business domains","The team collectively has all skills needed to deliver a complete Increment without requiring external specialists every Sprint","The team works in complete isolation from the rest of the organization","Team members must rotate across all tasks each Sprint"]'::jsonb,
   1, 'Cross-functional means the team collectively holds all delivery skills — not that every member does everything, and not that external expertise is never helpful, but that the team is not structurally dependent on outsiders for standard delivery.', 3, 'scrum:roles', '{}'::jsonb),

  (qz, 'Who is primarily responsible for setting and enforcing the Scrum Team''s working norms, such as Daily Scrum attendance expectations?', 'A developer has missed the Daily Scrum three times. No one on the team has addressed it.',
   '["The Scrum Master, who creates team rules as part of the facilitation role","The Product Owner, who is accountable for team performance","The Scrum Team collectively, as a self-managing group","Management, through organizational HR policy"]'::jsonb,
   2, 'Self-managing teams create and enforce their own norms. The Scrum Master enables this process but does not impose rules from outside — the team is accountable to itself.', 4, 'scrum:roles', '{}'::jsonb),

  (qz, 'The Product Owner wants to attend every Daily Scrum and begin directing developers on task priorities. What should happen?', 'Your PO joins the Daily Scrum and starts telling developers to prioritize specific tasks over their current work.',
   '["The PO is welcome and should be given time to provide direction during the event","The PO may observe, but the Daily Scrum belongs to the Developers — the SM should protect its purpose if it becomes a direction-giving session","The PO should never attend the Daily Scrum under any circumstances","The Scrum Master should cancel the Daily Scrum if the PO attends regularly"]'::jsonb,
   1, 'The Daily Scrum is a Developers'' event for inspecting their own progress. The PO may observe but should not direct. The SM protects the event''s purpose and the Developers'' autonomy.', 5, 'scrum:roles', '{}'::jsonb);

  -- ── Module 5 (order_index 4): Sprint Execution ─────────────────────────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 4 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 4'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 5 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'During a Sprint, a developer discovers a story is significantly larger than estimated. What should they do?', 'On Day 4 of a 10-day Sprint, you realize the API integration story will take 6 more days, not 2.',
   '["Work overtime silently to avoid slowing the Sprint","Inform the Scrum Master and wait for instructions","Raise it at the Daily Scrum and collaborate with the team to adapt the Sprint Backlog","Inform the Product Owner and request a Sprint extension"]'::jsonb,
   2, 'The Sprint Backlog belongs to the Developers — they adapt it as they learn. Raising it at the Daily Scrum allows the team to swarm, re-plan, or negotiate scope with the PO to protect the Sprint Goal.', 1, 'scrum:events', '{}'::jsonb),

  (qz, 'Who has authority to modify the Sprint Backlog during a Sprint?', 'A stakeholder emails the PO saying a new report is urgently needed and should be added to the current Sprint.',
   '["The Product Owner, who can add urgent stories at any time","The Scrum Master, who approves scope changes","The Developers, who adapt the Sprint Backlog as they learn","Stakeholders, who can request updates based on business priorities"]'::jsonb,
   2, 'The Sprint Backlog is owned by the Developers. While scope changes are negotiated with the PO, the Developers decide what enters their Sprint Backlog — not the PO or stakeholders unilaterally.', 2, 'scrum:events', '{}'::jsonb),

  (qz, 'A critical production bug is discovered mid-Sprint that is not on the Sprint Backlog. What is the correct response?', 'Your monitoring system alerts you to a payment processing failure affecting 20% of users on Day 3 of a 10-day Sprint.',
   '["Ignore it — the team committed to the Sprint Backlog and cannot change course","Automatically cancel the Sprint and restart with the bug at the top","The Developers and Product Owner assess impact together; if critical, the bug can be added to the Sprint Backlog","The Scrum Master decides whether the bug is critical enough to interrupt the Sprint"]'::jsonb,
   2, 'The Sprint Backlog can be adapted without cancelling the Sprint as long as the Sprint Goal remains achievable. Developers and the PO assess impact together and adjust the plan accordingly.', 3, 'scrum:events', '{}'::jsonb),

  (qz, 'Two developers are both blocked on the same external API dependency. What is the Agile response?', 'Two team members are waiting on a vendor API that was promised for Day 1 of the Sprint but has not been delivered.',
   '["Each developer waits individually and works on unrelated tasks","The Scrum Master escalates to the vendor and the team waits for resolution","The team swarms on the dependency or finds an alternative path to maintain momentum","The blocked stories are returned to the Product Backlog"]'::jsonb,
   2, 'Swarming — collectively focusing team capacity on a shared blocker — is the Agile response. Teams don''t passively wait for individual blockers to resolve; they address impediments collaboratively.', 4, 'scrum:events', '{}'::jsonb),

  (qz, 'What is the Scrum Master''s primary responsibility during Sprint execution?', 'A VP approaches a developer directly during the Sprint and begins assigning ad-hoc tasks unrelated to the Sprint Goal.',
   '["Track individual task completion and report to management","Attend all technical discussions to ensure process compliance","Remove impediments, coach the team, and protect the Sprint from external disruptions","Update the Product Backlog based on emerging stakeholder priorities"]'::jsonb,
   2, 'During the Sprint, the SM removes impediments, provides coaching, and protects the team from external disruptions that could derail the Sprint Goal — without managing or directing the technical work.', 5, 'scrum:events', '{}'::jsonb);

  -- ── Module 6 (order_index 5): Sprint Review & Retrospective ────────────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 5 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 5'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 6 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'What is the Sprint Review primarily designed to accomplish?', 'A stakeholder asks why the Sprint Review matters beyond being a routine demo.',
   '["Evaluate individual developer performance during the Sprint","Inspect the Increment and adapt the Product Backlog based on stakeholder feedback","Deliver formal acceptance sign-off for completed work","Review team velocity and begin planning the next Sprint"]'::jsonb,
   1, 'The Sprint Review is an inspection and adaptation event — stakeholders inspect the Increment and the PO adapts the Product Backlog. It is not a demo, approval ceremony, or performance review.', 1, 'scrum:events', '{}'::jsonb),

  (qz, 'The Sprint Retrospective is timeboxed to 3 hours for a one-month Sprint. What principle does this timebox enforce?', 'Your team argues the retrospective needs more time to cover all the issues from the last Sprint.',
   '["That retrospectives are a lower-priority event","That the team must focus on the highest-impact improvements rather than trying to address everything","That all problems must be resolved within the meeting itself","That only critical issues deserve retrospective discussion"]'::jsonb,
   1, 'The timebox enforces focus. The most effective retrospectives produce a small number of specific, committed improvements — not comprehensive problem inventories. One real change beats ten ignored suggestions.', 2, 'scrum:events', '{}'::jsonb),

  (qz, 'Stakeholders attend the Sprint Review and raise critical feedback. Who decides what to do with it?', 'Three stakeholders give conflicting feedback on the Increment. Each wants different changes to the Product Backlog.',
   '["The Scrum Master, who translates feedback into prioritized action items","The stakeholders themselves, as the end users of the product","The Product Owner, who integrates feedback into the Product Backlog based on value","The Developers, who assess what is technically feasible"]'::jsonb,
   2, 'The PO owns the Product Backlog and decides how to incorporate stakeholder feedback. They may consult Developers on feasibility, but the prioritization decision is theirs alone.', 3, 'scrum:events', '{}'::jsonb),

  (qz, 'A Scrum Master notices the same retrospective improvement action fails Sprint after Sprint. What is the MOST likely root cause?', 'For the past four Sprints, the team''s retro action (''write better user stories before Sprint Planning'') has not been implemented.',
   '["The team needs more time in retrospectives to identify better actions","The actions lack clear owners, deadlines, or follow-through mechanisms","The Sprint is too short to implement retrospective improvements","Retrospectives should focus on technical improvements only"]'::jsonb,
   1, 'Recurring failures of retrospective actions almost always stem from missing ownership or accountability structures. Without a specific person responsible for a specific action by a specific date, improvement commitments evaporate.', 4, 'scrum:events', '{}'::jsonb),

  (qz, 'What is the MOST important output of a well-run Sprint Retrospective?', 'Your team just completed a productive 90-minute retrospective. What should you have walking out the door?',
   '["A comprehensive list of every problem the team currently faces","A public summary to share with stakeholders and management","One or two specific, owned improvement experiments with clear success criteria","A velocity trend analysis identifying the cause of this Sprint''s underperformance"]'::jsonb,
   2, 'Effective retrospectives produce a small number of specific, committed improvements — owned by named people with success criteria. Comprehensive problem lists without ownership produce no change.', 5, 'scrum:events', '{}'::jsonb);

  -- ── Module 7 (order_index 6): Scrum Artifacts & Commitments ────────────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 6 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 6'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 7 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'What is the relationship between the Product Backlog and the Product Goal?', 'An interviewer asks you to explain how the Product Goal relates to the team''s ongoing work.',
   '["The Product Goal is one of many items listed in the Product Backlog","The Product Goal is the commitment for the Product Backlog — it gives the backlog its purpose and long-term direction","The Product Backlog is ordered by a Product Goal priority score","The Product Goal defines the maximum size of the Product Backlog"]'::jsonb,
   1, 'The Product Goal is the Product Backlog''s commitment — the long-term objective the Scrum Team works toward. The Product Backlog is the evolving plan for achieving that goal.', 1, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'The Sprint Goal is created at which point in the Sprint lifecycle?', 'A new developer asks when the team commits to the Sprint Goal.',
   '["During backlog refinement, before Sprint Planning begins","At the very start of Sprint Planning, before any stories are selected","During Sprint Planning — after the Developers have a working plan that makes the goal achievable","At the very end of Sprint Planning, as a final formality"]'::jsonb,
   2, 'The Sprint Goal is created during Sprint Planning — it emerges from the conversation between the PO (what is most valuable) and the Developers (what is feasible). The stories selected should support it.', 2, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'Which of the following BEST describes the Increment?', 'A stakeholder asks whether every Sprint must produce a release to production.',
   '["All work items completed during the current Sprint only","The sum of all Product Backlog items completed so far, meeting the Definition of Done, that is inspectable and potentially releasable","A formal release to production that must happen every Sprint end","Stories the team planned to complete but has not yet started"]'::jsonb,
   1, 'The Increment is cumulative — it includes all prior Increments plus the current Sprint''s completed work, all meeting the DoD. It must be in a usable state at Sprint end, but does not need to be released.', 3, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'A Product Backlog item lacks sufficient clarity for a developer to begin work. Who bears primary responsibility for clarifying it?', 'A developer says they cannot start a story because the acceptance criteria are missing.',
   '["The Scrum Master, who translates business needs into technical specifications","The developer independently researches what is needed","The Product Owner and Developers collaborate to add detail before the item is selected for a Sprint","An external business analyst who owns the requirements process"]'::jsonb,
   2, 'The PO owns the Product Backlog and is responsible for item clarity. They collaborate with Developers during refinement to ensure items are sufficiently detailed before selection — not during the Sprint.', 4, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'The Definition of Done serves as the commitment for which Scrum artifact?', 'A team member asks what the DoD is ''for'' — why does it need to be tied to an artifact?',
   '["The Product Backlog","The Sprint Backlog","The Increment","The Product Goal"]'::jsonb,
   2, 'The DoD is the commitment for the Increment. It defines the quality standard every Increment must meet, creating shared expectations between the team and its stakeholders.', 5, 'scrum:artifacts', '{}'::jsonb);

  -- ── Module 8 (order_index 7): Definition of Done & Quality ─────────────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 7 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 7'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 8 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'A Product Backlog item does not meet the Definition of Done at Sprint end. What happens to it?', 'During the Sprint Review, a story is found to be missing unit tests, which are part of the DoD.',
   '["It is marked ''partial'' and counts toward velocity at a reduced rate","It is returned to the Product Backlog and cannot be included in the Increment","The Sprint is extended to allow the team to complete it","It is accepted as ''done enough'' if the Product Owner approves an exception"]'::jsonb,
   1, 'Items not meeting the DoD are not part of the Increment. They return to the Product Backlog for possible selection in a future Sprint. The PO cannot waive the DoD — it is a quality floor, not a negotiation.', 1, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'Who is responsible for creating the Definition of Done?', 'A new Scrum Team asks who writes the DoD during their first Sprint.',
   '["The Scrum Master, as the process authority for the team","The Product Owner, who sets quality expectations on behalf of stakeholders","The Developers — or the broader organization if an org-wide DoD exists","An external QA team that sets industry quality standards"]'::jsonb,
   2, 'The Developers create and own the DoD. If the organization has a broader quality standard, the team''s DoD must meet or exceed it — they can add criteria, but cannot drop below the organizational minimum.', 2, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'Stories are consistently ''marked done'' but the product still has significant bugs. What is the MOST likely root cause?', 'Three Sprints in a row, stakeholders report bugs in features the team marked complete.',
   '["The Sprint is too short to catch all bugs","The Definition of Done lacks sufficient quality criteria — such as testing standards and code review requirements","Developers are deliberately skipping the DoD to appear more productive","The Product Owner is accepting stories without verifying DoD compliance"]'::jsonb,
   1, 'Persistent quality issues in ''done'' work almost always indicate the DoD lacks adequate criteria. A strong DoD includes automated tests, peer code review, performance benchmarks, and acceptance testing — not just ''feature is built.''', 3, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'How does the Definition of Done create transparency for stakeholders?', 'A stakeholder asks why the team needs to share their DoD — ''isn''t quality just something teams handle internally?''',
   '["It tells stakeholders exactly which features will be in the next release","It makes the quality standard explicit and shared — so ''done'' means the same thing to the team and its stakeholders","It defines which stories are in scope for the current Sprint","It gives the Scrum Master a checklist to verify work before accepting it"]'::jsonb,
   1, 'The DoD creates transparency by making quality expectations explicit. Without a shared DoD, ''done'' means different things to different people — creating expectation gaps that surface as surprises in Sprint Reviews.', 4, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'An organization has a minimum quality standard applying to all Scrum Teams. When a team creates its own DoD, it must:', 'The organization mandates that all code ships with 80% unit test coverage. Your team''s DoD currently specifies 70%.',
   '["Replace the organizational standard with team-specific criteria","Meet or exceed the organizational quality standard","Get Scrum Master approval before publishing the DoD","Wait for Product Owner sign-off before enforcing any DoD criteria"]'::jsonb,
   1, 'A team''s DoD must incorporate any organizational quality standards. Teams may add more criteria (e.g., raise test coverage to 90%) but cannot lower the organizational minimum. Quality floors compound — they don''t override each other.', 5, 'scrum:artifacts', '{}'::jsonb);

  -- ── Module 9 (order_index 8): Product Backlog Management & Refinement ───────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 8 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 8'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 9 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'Product Backlog Refinement is described as an ongoing activity. What is its primary purpose?', 'Your team is struggling with Sprint Planning because stories aren''t detailed enough to estimate.',
   '["To finalize the Sprint Backlog before Sprint Planning begins","To add detail, estimates, and order to Product Backlog items so they are ready for upcoming Sprints","To review stakeholder feedback after each Sprint Review","To document acceptance criteria that the QA team will validate later"]'::jsonb,
   1, 'Refinement prepares backlog items for future Sprints — adding enough detail, splitting large items, and ordering by value so Sprint Planning can be efficient and confident.', 1, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'The Product Owner has sole authority over Product Backlog ordering. Which factor is MOST important when ordering items?', 'Developers ask the PO why a technically simpler story is ranked above a complex one that seems more important.',
   '["Technical risk, so the most complex items are addressed first to de-risk the project","Developer capacity, so the most efficiently delivered items are selected first","Value delivery — maximizing the benefit realized by stakeholders and users relative to cost and risk","Dependencies only, so items without blockers are always prioritized"]'::jsonb,
   2, 'The PO orders the Product Backlog to maximize value. Value considers business benefit, user impact, cost, risk, and dependencies — but the primary lens is what delivers the most value to stakeholders and users.', 2, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'A Product Backlog item is considered ''Ready'' for Sprint Planning when it:', 'The team is debating whether a story is sufficiently prepared to include in tomorrow''s Sprint Planning.',
   '["Has been formally approved and signed off by the Product Owner","Is small enough, sufficiently detailed, and understood well enough for Developers to confidently select and plan it","Has passed all Definition of Done criteria established by the team","Has been estimated by both Developers and the Product Owner together"]'::jsonb,
   1, 'A ''Ready'' item can be confidently selected in Sprint Planning — it is small enough for one Sprint, has enough detail to plan and implement, and is understood by the whole team. The INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable) is a useful guide.', 3, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'How much time should a Scrum Team spend on Product Backlog Refinement per Sprint?', 'A stakeholder asks why the team spends time ''not building things'' during the Sprint.',
   '["As much time as required — there is no recommended limit","No more than 10% of the team''s Sprint capacity is a commonly cited guideline","Exactly one full day per Sprint, scheduled at the Sprint midpoint","As little as possible — refinement is overhead that takes away from delivery capacity"]'::jsonb,
   1, 'No more than 10% of Sprint capacity is the widely accepted guideline. Refinement is not overhead — it is an investment in Sprint Planning quality and delivery predictability. Insufficient refinement produces chaotic Sprint Planning.', 4, 'scrum:artifacts', '{}'::jsonb),

  (qz, 'During refinement, a developer says ''I don''t understand what we''re supposed to build here.'' Who should respond?', 'The team is reviewing a story titled ''Improve user experience'' with no acceptance criteria.',
   '["The Scrum Master, who clarifies requirements for the team","The Product Owner, who is responsible for backlog item clarity","An external business analyst who owns the requirements documentation","No one — it is the developer''s responsibility to research unclear items independently"]'::jsonb,
   1, 'The PO is accountable for Product Backlog item clarity. A story the team doesn''t understand is not refinement-ready. The PO and Developers collaborate to add the detail needed before the item can be selected for a Sprint.', 5, 'scrum:artifacts', '{}'::jsonb);

  -- ── Module 11 (order_index 10): Facilitation Mastery ──────────────────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 10 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 10'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 11 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'During Sprint Planning, one developer''s ideas consistently dominate and others stop contributing. What is the MOST effective intervention?', 'Sprint Planning always ends with the senior developer''s technical approach winning by default — others stop offering alternatives.',
   '["Privately ask the dominant developer to hold back in future sessions","Use a structural technique like Silent Brainstorming or Round Robin to equalize participation before group discussion","Assign a strict time limit per speaker","Move Sprint Planning to an asynchronous format to prevent domination"]'::jsonb,
   1, 'Structural techniques change the process, not just the person. Silent Brainstorming or Round Robin ensures all voices contribute before group influence (including senior voices) shapes the conversation.', 1, 'scrum:team-dynamics', '{}'::jsonb),

  (qz, 'In facilitation, ''divergent thinking'' is followed by ''convergent thinking.'' What do these phases involve?', 'You are designing a Sprint Retrospective and want to ensure ideas are generated before they are evaluated.',
   '["Divergent: individual analysis; Convergent: group synthesis","Divergent: generating many options without evaluation; Convergent: narrowing to a decision or commitment","Divergent: group discussion; Convergent: solo reflection","Divergent: problem framing; Convergent: documenting the solution"]'::jsonb,
   1, 'Effective facilitation moves from divergent (generate many ideas, suspend judgment) to convergent (select, prioritize, commit). Running both simultaneously — evaluating ideas as they are generated — kills creative thinking.', 2, 'scrum:team-dynamics', '{}'::jsonb),

  (qz, 'At the end of Sprint Planning, a Scrum Master uses Fist-to-Five. Three developers show three fingers; two show five fingers. What should happen next?', 'The team has been working for 3 hours on Sprint Planning. The majority seems supportive but three members show limited confidence.',
   '["Accept the result — a majority shows support, which is enough to proceed","Average the scores and report the result to the Product Owner","Explore the concerns of the three-finger voters before the team commits to the Sprint Goal","Ask the three-finger voters to align with the majority so the team can move forward"]'::jsonb,
   2, 'Three fingers signals real concerns — not full support. The SM should surface and address those concerns before the team commits. Suppressing minority concerns leads to a Sprint Goal no one believes in.', 3, 'scrum:team-dynamics', '{}'::jsonb),

  (qz, 'What is a facilitator''s role with respect to the CONTENT of a Scrum event?', 'Team members keep asking you ''what do you think we should do?'' during a retrospective you are facilitating.',
   '["The facilitator contributes their expertise to ensure the best outcome","The facilitator is neutral about content and responsible only for the process — not for what the team decides","The facilitator approves decisions to ensure alignment with Scrum principles","The facilitator summarizes and evaluates all content contributions at the end"]'::jsonb,
   1, 'A facilitator is content-neutral. Their job is to design and manage the process so the team reaches its own conclusions. When the SM contributes content, they compromise their facilitation role and reduce team ownership.', 4, 'scrum:team-dynamics', '{}'::jsonb),

  (qz, 'Liberating Structures were designed to address which fundamental flaw in conventional meeting formats?', 'Your Retrospectives always feel like the same two people talking while others check their phones.',
   '["Meetings take too long when groups are larger than 10 people","Most conventional formats (presentation, managed discussion, open discussion) systematically exclude most participants and suppress innovation","Virtual meetings are less effective than in-person for creative work","Agenda-driven meetings create too much structure for creative problem-solving"]'::jsonb,
   1, 'Lipmanowicz and McCandless designed Liberating Structures to solve inclusion — not just efficiency. Conventional formats default to a few voices. Liberating Structures make the structure itself distribute participation equally.', 5, 'scrum:team-dynamics', '{}'::jsonb);

  -- ── Module 14 (order_index 13): Organizational Change & Impediments ─────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 13 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 13'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 14 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'A team''s Sprint is blocked because deployment approvals take 5 business days. The Scrum Master cannot resolve this at the team level. What is the MOST appropriate next step?', 'Your team cannot deploy without a security review that takes 5 days — longer than a Sprint. Velocity has dropped 40%.',
   '["Accept the constraint and design Sprints around the approval timeline","Bypass the approval process to maintain velocity","Escalate the impediment to organizational leadership with a clear business impact statement","Ask the Product Owner to deprioritize deployment-related stories"]'::jsonb,
   2, 'Systemic impediments beyond team-level authority must be escalated — with clear documentation of business impact, cost of inaction, and a proposed resolution. The SM''s escalation role is to make organizational impediments visible to people with the authority to resolve them.', 1, 'scrum:stakeholders', '{}'::jsonb),

  (qz, 'People who resist Scrum adoption are primarily:', 'A senior developer dismisses Scrum as ''just overhead for people who can''t manage themselves.''',
   '["Irrational and change-averse by nature","Protecting legitimate interests — professional identity, career clarity, and established working patterns","Unaware of Scrum''s benefits and need better training","Following instructions from managers who privately oppose Agile"]'::jsonb,
   1, 'Resistance is rational self-protection. The developer''s dismissal likely conceals real concerns about their role, their autonomy, or the disruption of what has worked for them. Dismissing resistance as irrationality is the most common — and most counterproductive — response.', 2, 'scrum:stakeholders', '{}'::jsonb),

  (qz, 'Kotter''s first step in change management is ''Create a sense of urgency.'' For Scrum adoption, the MOST effective approach is:', 'An executive asks you to justify a Scrum transformation initiative and get buy-in from resistant managers.',
   '["Mandate adoption from the top and set compliance deadlines","Make the cost of NOT changing visible and compelling — what is being lost by staying the same?","Identify early adopters who are already enthusiastic and start with them","Build a steering committee to govern the transformation program"]'::jsonb,
   1, 'Urgency is created by making the cost of inaction visible — market share lost, competitors shipping faster, talent leaving. Mandates create compliance without urgency; urgency creates genuine commitment.', 3, 'scrum:stakeholders', '{}'::jsonb),

  (qz, 'A Project Manager loses their title when Scrum is adopted. Their resistance is most likely rooted in:', 'A longtime PM is outspoken against Scrum at every leadership meeting, citing ''team chaos'' and ''lack of accountability.''',
   '["Genuine disagreement with Scrum''s theoretical principles","Loss of professional identity, status, and the formal authority that came with their former role","Concern that developers cannot self-manage without direct oversight","Fear that their technical skills are insufficient for a Scrum environment"]'::jsonb,
   1, 'The most common resistance to role change is loss of professional identity — the title, authority, and recognition that made someone feel valued. Acknowledging this loss explicitly is the starting point for productive change conversations.', 4, 'scrum:stakeholders', '{}'::jsonb),

  (qz, 'The Scrum Master''s role as an ''organizational change agent'' means they:', 'Your organization has adopted Scrum at the team level, but HR processes, budget cycles, and approval hierarchies still make Scrum ineffective.',
   '["Manage the change implementation plan on behalf of senior leadership","Identify systemic impediments to Scrum effectiveness and work with leadership to remove them","Train all employees on Scrum across the entire organization","Track adoption metrics and report compliance to the steering committee"]'::jsonb,
   1, 'The SM''s organizational role is to identify and remove the structural impediments — processes, norms, org-chart hierarchies — that prevent the team from practicing Scrum effectively. This requires influence without authority and persistence beyond the team level.', 5, 'scrum:stakeholders', '{}'::jsonb);

  -- ── Module 15 (order_index 14): Agile Metrics, Flow & Forecasting ──────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 14 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 14'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 15 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'Team velocity has declined for 3 consecutive Sprints. Before taking any action, the MOST important question is:', 'Management is concerned about the velocity drop and asks you to ''fix'' the team''s performance.',
   '["Which developer''s individual output has decreased?","What changed in how the team works, estimates, or what they worked on during this period?","Should we extend the Sprint length to increase total capacity?","Which backlog items should be removed to reduce scope?"]'::jsonb,
   1, 'Velocity changes always have a cause. Common causes include technical debt being paid down (good), team changes, estimation drift, or unplanned work. Diagnosing the cause before acting prevents the wrong intervention.', 1, 'scrum:delivery-metrics', '{}'::jsonb),

  (qz, 'A manager compares Team A''s velocity (60 points) with Team B''s velocity (35 points) and concludes Team B needs to improve. Why is this comparison invalid?', 'Both teams work on the same product but have never calibrated their story point estimates with each other.',
   '["Velocity should only be compared over time within a team, not between teams at a single point","Story points are calibrated relative to each team''s own reference stories — they cannot be compared across teams","Team B may have lower velocity because they work on harder problems","Velocity comparisons are only valid when both teams use exactly the same tools"]'::jsonb,
   1, 'Story points are internally calibrated. Team A''s ''60 points'' may represent less actual work than Team B''s ''35 points'' — or vice versa. Comparing velocities across teams is like comparing distances measured in different-sized feet.', 2, 'scrum:delivery-metrics', '{}'::jsonb),

  (qz, 'Which metric BEST measures delivery reliability — whether the team consistently delivers on its commitments?', 'A Product Owner asks which metric tells them whether they can trust the team''s Sprint commitments.',
   '["Story points per Sprint (velocity)","Retrospective action item completion rate","Sprint Goal achievement rate","Average burndown slope across recent Sprints"]'::jsonb,
   2, 'Sprint Goal achievement rate measures whether the team consistently delivers on its primary Sprint commitment. It is harder to game than velocity and more meaningful to stakeholders than points or burndown slopes.', 3, 'scrum:delivery-metrics', '{}'::jsonb),

  (qz, 'The PO wants a forecast of when 50 remaining stories will be delivered. The team averages 15 points/Sprint and stories average 3 points each. What is the MOST honest response?', 'The PO needs to communicate delivery timing to a key customer and asks for a date.',
   '["''Exactly 10 Sprints from now'' based on current velocity","''Approximately 10 Sprints, but velocity varies — this is a probabilistic estimate and actual delivery may range from 8 to 13 Sprints''","''A forecast is impossible without knowing exactly which stories will be delivered''","''10-15 Sprints, with a buffer for likely scope additions''"]'::jsonb,
   1, 'Forecasts are probabilistic, not exact. Providing an exact number creates a false expectation. An honest forecast states the estimate AND its uncertainty range, explaining that velocity fluctuates and scope evolves.', 4, 'scrum:delivery-metrics', '{}'::jsonb),

  (qz, 'Cycle time measures which of the following?', 'Your engineering director asks you to explain the difference between cycle time and velocity.',
   '["The number of story points a team completes per Sprint","The elapsed time from when active work on an item begins to when it is done","The total elapsed time from when an item enters the backlog to when it ships to production","The percentage of Sprint capacity spent on planned versus unplanned work"]'::jsonb,
   1, 'Cycle time is a flow metric — the elapsed time from ''work started'' to ''done.'' It is distinct from lead time (backlog-to-done) and velocity (points per Sprint). Shorter cycle times indicate faster, more predictable delivery of individual items.', 5, 'scrum:delivery-metrics', '{}'::jsonb);

  -- ── Module 16 (order_index 15): Scaling Scrum & Enterprise Agility ──────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 15 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 15'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 16 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'An organization plans to scale from 1 to 5 Scrum Teams on the same product. The MOST critical prerequisite is:', 'Leadership wants to triple delivery speed by tripling team count. The single team is still struggling with basic Scrum.',
   '["Hiring 4 additional Scrum Masters as quickly as possible","Ensuring the single team''s Scrum practice is solid AND the architecture supports independent team delivery","Implementing SAFe first to provide governance structure before scaling","Getting executive budget approval for the scaling initiative"]'::jsonb,
   1, 'Scaling dysfunction produces 5x the dysfunction. Before scaling, the single-team Scrum practice must be solid and the architecture must support independent delivery — otherwise scaling amplifies existing problems rather than solving them.', 1, 'scrum:stakeholders', '{}'::jsonb),

  (qz, 'In SAFe, what is the primary purpose of PI Planning?', 'A Release Train Engineer asks you to explain PI Planning to a new team joining the ART.',
   '["To plan individual Sprint backlogs for the next 8-12 weeks in detail","To synchronize all teams in the ART on dependencies, commitments, and risks for the next Program Increment","To review the previous Program Increment''s performance and identify improvements","To establish velocity targets for each team for the planning cycle"]'::jsonb,
   1, 'PI Planning is SAFe''s primary coordination mechanism. All teams plan together simultaneously, identifying cross-team dependencies in real time and making synchronized commitments to PI Objectives.', 2, 'scrum:stakeholders', '{}'::jsonb),

  (qz, 'LeSS and SAFe scale Scrum but differ fundamentally in philosophy. Which statement BEST captures that difference?', 'A leadership team asks you to recommend a scaling approach and explain the trade-offs.',
   '["LeSS requires more events; SAFe has more flexibility in structure","LeSS scales by minimizing added structure; SAFe scales by adding defined roles, events, and governance layers","LeSS is designed for large enterprises; SAFe works better for small organizations","LeSS requires PI Planning; SAFe uses a Scrum of Scrums"]'::jsonb,
   1, 'LeSS applies Scrum principles directly at scale with minimal additions — one PO, one backlog, common Sprint. SAFe adds extensive structure: Release Train Engineers, PI Planning, Program Backlogs, and portfolio governance. Neither is universally better.', 3, 'scrum:stakeholders', '{}'::jsonb),

  (qz, 'A Scrum of Scrums is used for which primary purpose in a scaled environment?', 'You are asked to facilitate the first Scrum of Scrums for a 4-team product group.',
   '["Replacing individual Sprint Reviews with a single shared review for all teams","Coordinating cross-team dependencies and escalating impediments that cannot be resolved at the team level","Providing executive reporting on all teams'' velocity and burndown data","Training new Scrum Masters across the organization"]'::jsonb,
   1, 'Scrum of Scrums is a coordination technique — representatives from each team synchronize on cross-team dependencies, blockers, and integration risks. It is not a reporting mechanism or training forum.', 4, 'scrum:stakeholders', '{}'::jsonb),

  (qz, 'Why does organizing teams by technical layer (frontend team, backend team, DB team) create problems in scaled Scrum?', 'Your organization has a frontend team, backend team, and database team all working on the same product.',
   '["It makes Sprint Planning too complex for large groups to run effectively","Every feature requires coordination across all three layers — teams cannot deliver end-to-end user value independently","Horizontal teams develop conflicting technical standards over time","Executive reporting becomes impossible across horizontal team boundaries"]'::jsonb,
   1, 'Horizontal (technical-layer) teams create a dependency on every feature — nothing ships without all three coordinating. Vertical (capability-based) teams can deliver end-to-end user value independently, dramatically reducing the coordination tax.', 5, 'scrum:stakeholders', '{}'::jsonb);

  -- ── Module 17 (order_index 16): AI for the Scrum Master ────────────────────
  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 16 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz not found at order_index 16'; END IF;
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 17 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES
  (qz, 'A Scrum Master uses AI to generate a retrospective design based on the team''s Sprint data. Who should review and adapt it before use?', 'You prompt Claude with your team''s burndown data and last 3 retro outputs, and receive a detailed 90-minute retro plan.',
   '["The Product Owner, to ensure the retro focuses on value delivery","The Scrum Master, who is accountable for facilitation quality and must apply team context the AI doesn''t have","The Developers, who should co-design every retrospective themselves","An AI ethics reviewer, to check the output for potential bias"]'::jsonb,
   1, 'The SM is accountable for retrospective quality. AI-generated designs are strong starting points but lack the SM''s knowledge of team dynamics, recent interpersonal events, and psychological safety levels. Human judgment is the final filter.', 1, 'scrum:team-dynamics', '{}'::jsonb),

  (qz, 'Which task is MOST appropriate to automate with AI for a Scrum Master?', 'You are looking to reduce the time you spend on administrative work so you can focus more on coaching.',
   '["Coaching a developer through a recurring interpersonal conflict with a peer","Generating a Sprint Review executive summary from meeting notes and Jira Sprint data","Deciding which stories to defer when the Sprint Goal is at risk mid-Sprint","Facilitating the Sprint Retrospective in real time"]'::jsonb,
   1, 'AI excels at information transfer and generation tasks — taking structured data and producing formatted outputs. Coaching, trade-off decisions, and facilitation require human judgment, context, and relationship intelligence that AI cannot replicate.', 2, 'scrum:team-dynamics', '{}'::jsonb),

  (qz, 'An AI Sprint risk tool flags that ''Story X has been in progress for 4 days without board movement.'' What should the Scrum Master do FIRST?', 'The AI tool in your Jira sends you an alert about a story that hasn''t moved in 4 days.',
   '["Immediately escalate the finding to the Product Owner as a confirmed blocker","Investigate the context before acting — AI flags are data points, not conclusions","Override the AI finding — it lacks understanding of team dynamics","Share the alert with the entire team at the next Daily Scrum as a formal impediment"]'::jsonb,
   1, 'AI risk signals are inputs to the SM''s judgment, not decisions themselves. The correct first response is to investigate: Is the developer actually blocked? Is this a known complex task? Is the board just not being updated? Context determines the response.', 3, 'scrum:team-dynamics', '{}'::jsonb),

  (qz, 'A team starts using AI coding assistants. What is the MOST important action for the Scrum Master?', 'Half the team adopts GitHub Copilot and story completion times drop significantly for some task types.',
   '["Monitor all AI-generated code daily to ensure quality","Update the Definition of Done to address code review requirements for AI-generated code","Reduce story point estimates across the board since AI makes development faster","Restrict AI tool use until the full team receives formal training from management"]'::jsonb,
   1, 'AI-generated code needs the same quality standards as human-written code. The DoD must be updated to explicitly require code review for AI-generated code — ensuring it meets the team''s quality bar before it enters the Increment.', 4, 'scrum:team-dynamics', '{}'::jsonb),

  (qz, 'The most important principle when building AI automation workflows for the Scrum Master role is:', 'You are designing a system to automate parts of your SM work using Zapier and Claude.',
   '["Automate as much as possible to maximize time for coaching and strategic work","Automate information transfer and report generation; keep human judgment at trade-off decisions, coaching, and conflict resolution","Use AI to reduce the need for Scrum events — AI can replace the Retrospective for pattern analysis","Only automate tasks you personally find tedious or repetitive"]'::jsonb,
   1, 'The correct boundary: AI automates information tasks (status reports, summaries, templates, analysis). Human judgment handles coaching conversations, trade-off decisions, and conflict resolution — contexts where relationship intelligence and organizational context are irreplaceable.', 5, 'scrum:team-dynamics', '{}'::jsonb);

  RAISE NOTICE 'Successfully inserted 55 quiz questions across 11 modules.';

END $$;

-- =============================================================================
-- VERIFY: questions per module
-- =============================================================================
SELECT
  c.order_index AS module,
  c.title,
  COUNT(qq.id) AS questions
FROM public.quiz_questions qq
JOIN public.quizzes q ON q.id = qq.quiz_id
JOIN public.chapters c ON c.id = q.chapter_id
WHERE c.course_id = 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14'
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
