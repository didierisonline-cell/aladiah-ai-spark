-- =============================================================================
-- BA Quiz Questions — Module 15 ONLY (Capstone: Discovery-to-Transformation)
-- Course: AI Business Analyst & Product Discovery Specialist (ba-v1)
-- 15 questions for order_index = 15
-- Note: ba:foundations replaced with valid taxonomy slugs (ba:solution-eval,
--       ba:product-discovery) per COMPETENCY_TAXONOMY.md
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================

DO $$
DECLARE
  cid UUID;
  ch  UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Business Analyst & Product Discovery Specialist';
  IF cid IS NULL THEN RAISE EXCEPTION 'BA course not found'; END IF;

  SELECT id INTO ch FROM public.chapters WHERE course_id = cid AND order_index = 15;
  IF ch IS NULL THEN RAISE EXCEPTION 'Chapter at order_index 15 not found'; END IF;

  -- Create quiz shell if it doesn't exist
  SELECT id INTO qz FROM public.quizzes WHERE chapter_id = ch AND quiz_type = 'chapter_end';
  IF qz IS NULL THEN
    INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score)
    VALUES (ch, 'chapter_end', 80)
    RETURNING id INTO qz;
    RAISE NOTICE 'Created quiz shell for M15';
  ELSE
    RAISE NOTICE 'Quiz shell already exists for M15: %', qz;
  END IF;

  -- Guard: abort if questions already exist
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 15 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'In the Discovery phase of a transformation engagement, what is the BA''s primary deliverable?', 'You have been given access to 30 stakeholder interviews, 5 years of process data, and the current operating model documentation.',
   '["A prioritized backlog of features","A diagnosis: a clear articulation of the root-cause business problem, the current-state pain points, and the strategic opportunity — supported by evidence from multiple sources","A prototype of the proposed solution","A vendor selection recommendation"]'::jsonb,
   1, 'Discovery is about establishing shared understanding of the problem. The BA synthesizes multiple evidence sources into a clear, evidence-based diagnosis. Without this, any solution is built on assumption. Discovery prevents the most expensive mistake: solving the wrong problem.', 1, 'ba:product-discovery', '{}'::jsonb),

  (qz, 'When moving from Discovery to Architecture & Strategy, what question does the BA help answer?', 'You have completed discovery and confirmed the problem. Stakeholders now ask "so what do we do about it?"',
   '["Which vendor has the best case studies","What is the minimum viable architecture that addresses the root-cause problem while remaining within feasibility constraints — people, technology, process, and regulatory","What features should the UI have","Which team should own the project"]'::jsonb,
   1, 'Architecture & Strategy translates the diagnosis into a direction. The BA helps frame the solution architecture: what must change (process, technology, org structure), what is technically and organizationally feasible, and what the future-state operating model looks like.', 2, 'ba:business-architecture', '{}'::jsonb),

  (qz, 'During the Requirements, Governance & Risk phase of a capstone engagement, what must the BA produce before any solution is built?', 'The development team is ready to start building. The project sponsor says requirements can be gathered iteratively during development.',
   '["Just enough requirements to start the first sprint, with the rest to follow","A complete set of functional and non-functional requirements, a regulatory requirements traceability matrix, and a documented risk register — signed off by all stakeholders before major development investment begins","Only high-level requirements for the executive audience","A detailed Gantt chart showing requirement delivery dates"]'::jsonb,
   1, 'For a transformation engagement, requirements and risk must be baselined before significant investment. Agile does not mean no requirements — it means requirements are well-understood, prioritized, and traceable. Discovering major compliance gaps mid-build is among the most expensive BA failures.', 3, 'ba:requirements', '{}'::jsonb),

  (qz, 'When building an investment case for a transformation initiative, what financial information is most critical to present?', 'The board must decide whether to allocate $3.5M to a 24-month digital transformation program.',
   '["The number of features that will be delivered","NPV, ROI, payback period, total cost of ownership, and sensitivity analysis showing how ROI changes under different adoption and benefit scenarios","The project timeline in months","The technology vendor''s market share"]'::jsonb,
   1, 'The board makes capital allocation decisions. They need the financial story: NPV (time-adjusted value), ROI (return on investment), payback period (when they break even), TCO (full cost), and sensitivity analysis (what if key assumptions are wrong). Anything less is an incomplete investment argument.', 4, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'A board presentation on a transformation recommendation is most effective when structured how?', 'You have 20 minutes to present a 24-month, $3.5M transformation recommendation to a skeptical board.',
   '["Start with 50 pages of detailed analysis","Start with detailed technical specifications","Use the Pyramid Principle: lead with the recommendation and financial summary, follow with supporting evidence, and close with the ask and next steps — all in under 10 slides","Present all options without a recommendation to avoid bias"]'::jsonb,
   2, 'Boards make decisions in minutes. The Pyramid Principle (conclusion first, then evidence) respects their time and cognitive load. Leading with the recommendation signals confidence and makes it easy for the board to probe the reasoning — not guess at your conclusion.', 5, 'ba:stakeholders', '{}'::jsonb),

  (qz, 'A stakeholder challenges your transformation recommendation by saying "the data could support the opposite conclusion." How should the BA respond?', 'During your board presentation, the CFO says the same data could justify maintaining the status quo.',
   '["Agree and withdraw the recommendation","Defend your recommendation by explaining the analytical logic: what assumptions were made, which scenarios were tested (including do-nothing), and why the recommended path has a superior expected outcome under the most probable scenarios","Defer to the CFO''s interpretation","Escalate the disagreement to the CEO"]'::jsonb,
   1, 'Professional disagreement is healthy. The BA defends the recommendation with analytical transparency — not authority. Explaining assumptions, tested scenarios, and expected outcome differences gives the board the framework to evaluate competing interpretations. Withdrawing under pressure substitutes confidence for accuracy.', 6, 'ba:product-thinking', '{}'::jsonb),

  (qz, 'At the capstone level, how does a BA''s role differ from earlier in the curriculum?', 'A junior BA on your team asks why the capstone project requires presenting to an executive committee rather than just writing requirements.',
   '["It does not differ — BA work is the same at all levels","At the capstone level, the BA operates as a transformation advisor: synthesizing discovery, strategy, requirements, and financial analysis into a coherent investment argument and leading the executive decision — not just documenting what stakeholders say","At the capstone level, BAs only review junior BAs'' work","The capstone is only about certification, not real BA skills"]'::jsonb,
   1, 'Senior BA work is strategic, not just operational. The capstone BA synthesizes all analytical disciplines — discovery, architecture, requirements, risk, financials — into a unified narrative that shapes organizational decisions. The skill jump is from documenting to advising.', 7, 'ba:product-discovery', '{}'::jsonb),

  (qz, 'You discover during capstone analysis that the originally proposed solution does not address the root-cause problem. What is the professionally correct action?', 'Two months into a project, your analysis reveals the real problem is organizational structure, not the technology platform the team has been tasked to replace.',
   '["Continue with the original scope to meet contractual obligations","Document the finding privately and avoid raising it with stakeholders to prevent conflict","Present the finding transparently to stakeholders: the root cause has been identified, the proposed solution will not solve it, and here is a revised recommendation — even if this resets the project","Modify your analysis to match the original scope"]'::jsonb,
   2, 'The BA''s obligation is to the business outcome, not the original solution assumption. Surfacing a misdiagnosis early — even if it disrupts the plan — prevents a much larger investment in the wrong solution. Professional integrity and courage are as important as analytical skill at the capstone level.', 8, 'ba:product-discovery', '{}'::jsonb),

  (qz, 'A transformation program has five workstreams. How should a capstone BA ensure requirements coherence across all workstreams?', 'Each workstream team is writing requirements independently, and the integration team is finding conflicts between them.',
   '["Let each workstream handle its own requirements in isolation","Establish a requirements architecture: a shared domain model, agreed data dictionary, cross-workstream traceability matrix, and integration requirements review process — with the BA serving as the integration authority","Assign one developer to reconcile requirements at the end","Use only verbal communication between workstreams"]'::jsonb,
   1, 'At scale, requirements coherence requires architecture, not just coordination. The BA must design the requirements system: shared vocabulary, integration points, and a process for detecting and resolving conflicts before they reach development. This is the senior BA''s most distinctive contribution in a large program.', 9, 'ba:requirements', '{}'::jsonb),

  (qz, 'When presenting the Board Recommendation & Defense, what distinguishes a world-class BA presentation from an adequate one?', 'Two BAs are presenting competing recommendations to the same board. One wins approval; the other is deferred.',
   '["The winning BA had more slides and more data","The winning BA had more seniority","The winning BA anticipated and pre-emptively addressed the board''s most likely objections — demonstrating that risks were examined, alternatives were evaluated, and the recommendation holds under scrutiny","The winning BA''s project had a smaller budget"]'::jsonb,
   2, 'World-class BA presentations are adversarially prepared. They anticipate the board''s questions — risk objections, alternative challenges, assumption challenges — and address them in the presentation itself. This signals analytical rigor and builds board confidence that the BA has stress-tested their own recommendation.', 10, 'ba:stakeholders', '{}'::jsonb),

  (qz, 'What is the difference between an output, an outcome, and an impact in a transformation context?', 'The steering committee debates whether the new digital platform "succeeded."',
   '["They are synonyms in project management","Output = what was built (the platform); outcome = what changed in behavior or performance (adoption rate, process time); impact = long-term business value created (revenue, cost reduction, customer satisfaction) — success is measured at the outcome and impact level, not the output level","Outputs and outcomes are the same; impact is a financial metric only","Impact is measured during the project; outcomes after"]'::jsonb,
   1, 'Transformation success is not measured by delivery of outputs. The platform is an output. Whether it changed behavior is the outcome. Whether that behavior change created business value is the impact. BAs who measure only outputs miss the point of transformation.', 11, 'ba:product-thinking', '{}'::jsonb),

  (qz, 'In a capstone engagement, how should a BA handle a stakeholder who is technically correct but politically motivated in their objection?', 'A division head opposes your recommendation. Their technical objection is valid, but the real reason is they would lose budget authority under the proposed model.',
   '["Dismiss the objection because the motivation is political","Address the technical objection on its merits in the formal forum while understanding the political driver — then engage the stakeholder privately to understand their underlying concern and find a way to accommodate legitimate interests without compromising the recommendation","Escalate the political conflict to the CEO","Withdraw the recommendation to avoid organizational conflict"]'::jsonb,
   1, 'Skilled BAs separate the technical from the political. They address the stated objection transparently and rigorously. They engage the unstated concern through relationship, not confrontation. Ignoring either dimension — the technical validity or the political reality — produces worse outcomes.', 12, 'ba:stakeholders', '{}'::jsonb),

  (qz, 'A board approves the transformation program. What is the BA''s most critical handover deliverable to the implementation team?', 'The program has been approved and the project team is being assembled.',
   '["The PowerPoint presentation shown to the board","A complete requirements package: business case, requirement specifications, regulatory traceability matrix, architecture overview, risk register, success KPIs with measurement plan, and a stakeholder map — documented well enough that a team not present in discovery can implement with fidelity","A verbal briefing at project kick-off","The discovery interview transcripts only"]'::jsonb,
   1, 'The BA''s intellectual capital — the why, the what, and the how-to-measure-success — must be captured in a handover package. Verbal briefings evaporate. Undocumented decisions get reversed. The handover package is what ensures the board-approved vision is actually implemented.', 13, 'ba:requirements', '{}'::jsonb),

  (qz, 'What is the most important lesson a BA learns from the Discovery-to-Transformation capstone experience?', 'After completing the capstone, a student reflects on what was hardest about the full engagement.',
   '["That data analysis is the hardest skill to master","That writing requirements is the most time-consuming activity","That BA work is fundamentally about creating clarity for decision-makers at every stage — from problem diagnosis through investment case to implementation hand-off — and that analytical rigor without communication skill or stakeholder influence produces no organizational change","That the board presentation is the only thing that matters"]'::jsonb,
   2, 'The capstone synthesizes all BA disciplines into a single truth: analysis that does not move decisions is academic. The world-class BA combines analytical rigor (data, requirements, risk) with communication craft (stakeholder influence, executive storytelling, board-level confidence) to create organizational change.', 14, 'ba:solution-eval', '{}'::jsonb),

  (qz, 'How does a BA know a transformation engagement has truly succeeded?', 'Twelve months after the program closed, the sponsor asks whether it "worked."',
   '["When the final report was accepted by the steering committee","When the system went live on time and on budget","When the KPIs defined in the original business case have been achieved — adoption targets met, efficiency gains realized, revenue or cost impact validated against baseline — and the organization has embedded the new capability into its operating model","When all stakeholders said they were happy at go-live"]'::jsonb,
   2, 'Transformation success is measured against the original business case metrics, 6–12 months post-implementation. On-time delivery and stakeholder satisfaction are necessary but insufficient. Value realization — the actual improvement in KPIs — is the only objective measure of whether the transformation achieved its purpose.', 15, 'ba:solution-eval', '{}'::jsonb);

END $$;

-- Verification
SELECT c.order_index AS module, c.title AS module_title,
       count(qq.id) AS total_questions,
       count(qq.id) FILTER (WHERE qq.status = 'approved') AS approved
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.quizzes qz ON qz.chapter_id = c.id AND qz.quiz_type = 'chapter_end'
LEFT JOIN public.quiz_questions qq ON qq.quiz_id = qz.id
WHERE co.title = 'AI Business Analyst & Product Discovery Specialist'
  AND c.order_index = 15
GROUP BY c.order_index, c.title;
