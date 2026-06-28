-- =============================================================================
-- AI Mastery for Scrum Masters & Project Managers — Quiz Setup & Questions
-- Creates chapter_end quiz shells for all 6 modules, then seeds questions.
-- 6 questions per module = 36 questions total
-- Competency slugs from COMPETENCY_TAXONOMY.md:
--   pm:ai-delivery, pm:planning, pm:risk, pm:stakeholders,
--   pm:delivery-methods, pm:leadership
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================

DO $$
DECLARE
  cid UUID;
  chs UUID[];
  ch  UUID;
  qz  UUID;
  n   INT;
BEGIN
  SELECT id INTO cid FROM public.courses
  WHERE title = 'AI Mastery for Scrum Masters & Project Managers';
  IF cid IS NULL THEN RAISE EXCEPTION 'AI Mastery course not found'; END IF;

  -- Collect all chapter IDs in order
  SELECT array_agg(id ORDER BY order_index) INTO chs
  FROM public.chapters WHERE course_id = cid;
  IF array_length(chs, 1) < 6 THEN
    RAISE EXCEPTION 'Expected 6 chapters, found %', array_length(chs, 1);
  END IF;

  -- ── Create chapter_end quiz shells for all 6 chapters (idempotent) ──────────
  FOR i IN 1..6 LOOP
    ch := chs[i];
    SELECT id INTO qz FROM public.quizzes
    WHERE chapter_id = ch AND quiz_type = 'chapter_end';
    IF qz IS NULL THEN
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score)
      VALUES (ch, 'chapter_end', 80)
      RETURNING id INTO qz;
      RAISE NOTICE 'Created quiz shell for chapter % (index %)', ch, i;
    ELSE
      RAISE NOTICE 'Quiz shell already exists for chapter % (index %)', ch, i;
    END IF;
  END LOOP;

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 1 — The AI Revolution in Project Management
  -- Competency: pm:ai-delivery
  -- ═══════════════════════════════════════════════════════════════════════════
  ch := chs[1];
  SELECT q.id INTO qz FROM public.quizzes q WHERE q.chapter_id = ch AND q.quiz_type = 'chapter_end';
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 1 already has % question(s)', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is the most accurate description of AI''s role in modern project management?', 'A skeptical PM says AI is just "fancy automation" and asks why it matters for Scrum Masters.',
   '["AI replaces the need for human PMs","AI fully automates all project decisions","AI augments PM decision-making by processing large amounts of project data and surfacing patterns, risks, and recommendations that humans would take hours to identify — the PM remains the decision authority","AI is only useful for large enterprise projects"]'::jsonb,
   2, 'AI is an augmentation tool, not a replacement. It processes signals (velocity trends, dependency risk, communication patterns) faster than any human can — but judgment, stakeholder relationships, and leadership remain distinctly human. The PM who uses AI well outperforms the one who ignores it.', 1, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'A Scrum Master wants to use AI to improve Sprint planning. What is the most valuable application?', 'Your team has 18 months of historical Sprint velocity data across 12 teams.',
   '["Use AI to write the Sprint Goal","Use AI to analyze historical velocity, identify patterns (e.g. holiday slowdowns, integration sprint dips), and generate capacity-aware forecasts that improve Sprint planning accuracy","Use AI to assign tasks to developers","Use AI to replace the Sprint Planning meeting"]'::jsonb,
   1, 'Historical data analysis is where AI adds immediate, high-value PM benefit. Velocity patterns, seasonal variations, and dependency impacts can be surfaced automatically — enabling far more accurate capacity planning than manual averaging.', 2, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'What is the key risk when PMs rely on AI-generated status reports without independent verification?', 'Your AI tool generates a "green" project status based on automated data feeds, but two senior engineers privately tell you there are serious architecture concerns.',
   '["AI status reports are always accurate","AI status reports save time with no downside","AI can only process quantitative signals — qualitative risks (team morale, technical debt, political tensions) that are not captured in data systems will be invisible to AI and may be absent from its status output","AI overestimates project risk"]'::jsonb,
   2, 'AI status reports reflect data that exists in systems. Critical risks often live in informal conversations, team sentiment, and tacit knowledge that never enters a tracking tool. PMs must use AI reports as one input — never as the sole source of project truth.', 3, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'How has AI changed the PM''s core skill requirement?', 'A senior PM is debating whether to invest in AI tool training or traditional PM certification.',
   '["AI has made PM skills less important overall","AI has shifted PM work from data collection and status reporting (now automated) toward higher-value activities: pattern interpretation, stakeholder leadership, risk judgment, and strategic decision support","AI now handles all stakeholder communication","AI has made scheduling and planning unnecessary"]'::jsonb,
   1, 'AI automates the data collection and basic reporting that consumed 30–50% of PM time. This is not a threat — it is a gift. PMs who embrace AI get time back for the work that creates the most value: judgment, relationships, and leadership. The skill shift is from data gatherer to decision advisor.', 4, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'A PM team is evaluating three AI tools for project management. What is the most important evaluation criterion?', 'Vendor A has the most features; Vendor B has the best AI model; Vendor C integrates with your existing tools.',
   '["The vendor with the highest AI model accuracy scores","Integration with existing data sources and workflows — an AI tool is only as useful as the quality and completeness of the data it can access","The tool with the most features","The tool with the lowest price"]'::jsonb,
   1, 'AI quality is determined by data quality. The most sophisticated AI model produces poor recommendations if it cannot access your actual project data. Integration first, model sophistication second — always.', 5, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'What does "AI-augmented delivery" mean in the context of a Scrum team?', 'A newly hired Scrum Master asks how AI fits into the Scrum framework.',
   '["Replacing human Sprint ceremonies with AI-run sessions","Using AI tools to handle all backlog management autonomously","Embedding AI assistance into the delivery workflow to accelerate tasks: AI drafts acceptance criteria, surfaces dependency risks, identifies impediment patterns, and generates retrospective insights — while the Scrum Master leads the team and makes judgment calls","AI creates the Sprint Backlog automatically from the Product Roadmap"]'::jsonb,
   2, 'AI-augmented delivery means AI handles the cognitive labor of pattern detection, drafting, and data synthesis — freeing the Scrum Master to focus on facilitation, coaching, and human-centered leadership. AI is the co-pilot; the Scrum Master is the pilot.', 6, 'pm:ai-delivery', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 2 — AI Tools and Workflows for PMs and Scrum Masters
  -- Competency: pm:ai-delivery
  -- ═══════════════════════════════════════════════════════════════════════════
  ch := chs[2];
  SELECT q.id INTO qz FROM public.quizzes q WHERE q.chapter_id = ch AND q.quiz_type = 'chapter_end';
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 2 already has % question(s)', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'A Scrum Master wants to use an LLM to help draft User Stories. What is the correct workflow?', 'You are experimenting with AI for backlog refinement and want to know best practice.',
   '["Generate stories with AI and immediately add them to the backlog","Generate stories with AI, then critically review each one for accuracy, completeness, and alignment with the Product Goal before presenting to the team","Let the Product Owner review AI-generated stories without BA or SM review","Use AI to generate stories only for technical tickets, not business stories"]'::jsonb,
   1, 'AI-generated User Stories are a starting point, not a finished product. The SM or BA must review for hallucinated acceptance criteria, missing edge cases, and alignment with Product Goal before any story enters the backlog — the team depends on story quality to plan and execute.', 1, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'What is prompt chaining, and why is it valuable for complex PM tasks?', 'You are using an AI tool to synthesize a 40-page project status report into a 1-page executive summary.',
   '["Running multiple AI tools simultaneously","A technique where the output of one AI prompt becomes the input of the next, enabling complex multi-step tasks (e.g. extract → classify → summarize → recommend) that no single prompt can accomplish reliably","A security technique for encrypting AI outputs","A method for reducing AI hallucination by repeating the same prompt"]'::jsonb,
   1, 'Complex PM tasks require structured reasoning chains. Prompt chaining breaks the task into steps: first extract key facts, then classify risk signals, then summarize findings, then generate recommendations. Each step''s output is validated before passing to the next — producing more reliable and structured results than a single, complex prompt.', 2, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'A PM uses an AI tool to detect dependency risks across 8 active projects. The tool flags a risk the PM had not noticed. What is the correct response?', 'The AI tool identifies a scheduling conflict between two projects that share a key technical architect starting in Week 6.',
   '["Trust the AI flag completely and immediately escalate to leadership","Dismiss the flag — the PM knows the projects better than the AI","Investigate the flag by verifying the underlying data, confirming the conflict is real, assessing impact, and then deciding on the appropriate response","Ask the AI tool to resolve the conflict automatically"]'::jsonb,
   2, 'AI flags are hypotheses, not verdicts. The PM''s job is to investigate: is the data accurate, is the conflict real, what is the business impact? This is PM judgment applied to an AI signal — the combination of AI detection and human investigation that produces the best outcome.', 3, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'Which AI tool category is most useful for generating meeting summaries and action items from Scrum ceremonies?', 'Your organization holds 40+ Sprint ceremonies per week across 8 teams and ceremony notes are inconsistently captured.',
   '["Computer vision tools","Conversational AI / LLM-based transcription and summarization tools that convert meeting recordings or transcripts into structured summaries, decisions, and action items","Predictive analytics platforms","No-code automation tools"]'::jsonb,
   1, 'LLM-based transcription and summarization tools solve one of the most painful PM workflow problems: inconsistent ceremony documentation. They transform raw meeting audio/text into structured, searchable notes — reducing the Scrum Master''s administrative burden while improving team accountability.', 4, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'What is the "AI workflow stack" for a PM, and how should it be built?', 'A new PM Director asks how to systematically integrate AI into team workflows without creating tool chaos.',
   '["Buy every AI tool available and let teams choose what they use","Build a curated, integrated stack: data layer (project management, communication, version control) → AI processing layer (analysis, generation, synthesis) → PM decision layer — with clear protocols for what AI handles and what requires human judgment","Use only one AI tool to keep things simple","Outsource AI tool decisions to IT"]'::jsonb,
   1, 'An ad-hoc AI toolset creates fragmentation and data silos. A curated workflow stack ensures AI tools have access to the right data, produce outputs that feed into PM decisions, and have clear human override protocols. Strategy before tools.', 5, 'pm:ai-delivery', '{}'::jsonb),

  (qz, 'A PM wants to use AI to identify early warning signals of a project at risk. What data sources should the AI tool be connected to?', 'Your organization is piloting an AI early-warning system for project risk detection.',
   '["Only the project schedule (Gantt chart)","Velocity history, bug/defect rates, team communication sentiment analysis, dependency tracking, resource utilization, and budget burn rate — multi-signal analysis produces far more reliable risk detection than any single indicator","Only financial data","Only stakeholder feedback surveys"]'::jsonb,
   1, 'Risk is a multi-dimensional signal. Velocity decline, increasing defect rates, team communication drop-off, and budget overruns often co-occur before a project visibly fails. AI that synthesizes multiple data streams detects risk weeks earlier than a PM reviewing only the schedule.', 6, 'pm:ai-delivery', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 3 — AI for Agile Delivery and Scrum
  -- Competency: pm:delivery-methods
  -- ═══════════════════════════════════════════════════════════════════════════
  ch := chs[3];
  SELECT q.id INTO qz FROM public.quizzes q WHERE q.chapter_id = ch AND q.quiz_type = 'chapter_end';
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 3 already has % question(s)', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'How can AI improve the quality of Sprint Retrospectives?', 'Your team retrospectives always produce the same 3 actions, none of which get implemented.',
   '["AI should facilitate the retrospective","Use AI to analyze past retrospective data, velocity trends, and impediment logs to identify recurring patterns and surface improvement areas the team might overlook — AI provides data; the team provides solutions","AI should replace retrospectives with automated analysis","AI should score each team member''s performance"]'::jsonb,
   1, 'AI can detect patterns in retrospective data that teams self-select away from ("we always say communication is the problem"). By surfacing data-backed patterns — impediment recurrence, action item completion rates, velocity correlations — AI helps teams have more honest, productive retrospectives.', 1, 'pm:delivery-methods', '{}'::jsonb),

  (qz, 'A Scrum Master uses AI to analyze 6 months of Daily Scrum notes. The analysis reveals a recurring impediment type that was never formally escalated. What should the SM do?', 'AI analysis shows that 40% of Daily Scrum blockers involved waiting for external API access that was never in the impediment log.',
   '["Dismiss the finding — if it were serious, the team would have escalated it","Use the AI finding to open a formal impediment discussion with the team and organization: surface the systemic cause, estimate its cost in velocity terms, and propose an organizational solution","Ask the AI to resolve the impediment","Share the finding only with the development team"]'::jsonb,
   1, 'Systemic impediments hide in informal language. AI pattern recognition on Daily Scrum notes surfaces what human attention misses over time. The SM''s job is to translate this signal into organizational action — quantifying the impact and advocating for the systemic fix.', 2, 'pm:delivery-methods', '{}'::jsonb),

  (qz, 'What is the correct use of AI in backlog refinement for a Scrum team?', 'The Product Owner is spending 6 hours per week manually splitting and sizing backlog items.',
   '["AI should replace the Product Owner","AI should auto-prioritize the backlog based on business value estimates","Use AI to draft acceptance criteria, identify missing edge cases, suggest story splits, and flag items that are too large or ambiguous — the PO and team then review and decide","Use AI to assign story points automatically"]'::jsonb,
   2, 'AI accelerates refinement by handling cognitive labor: generating acceptance criteria drafts, suggesting story splits at natural seams, and flagging ambiguity signals. The PO retains authority over prioritization and business value judgments — AI is the co-author, not the author.', 3, 'pm:delivery-methods', '{}'::jsonb),

  (qz, 'A PM is scaling Agile across 6 teams using SAFe. How does AI help at the portfolio level?', 'The RTE needs to detect cross-team dependency risks before the PI Planning event.',
   '["AI is only useful at the individual team level","Use AI to analyze cross-team dependency networks, detect schedule conflicts, model capacity constraints, and surface portfolio-level risk patterns across all teams before PI Planning — enabling proactive resolution rather than reactive fire-fighting","AI should replace PI Planning","AI should manage cross-team dependency resolution automatically"]'::jsonb,
   1, 'At scale, the dependency and risk surface grows combinatorially. AI can analyze the full dependency graph across 6 teams simultaneously, detecting conflicts and capacity issues that no human can hold in their head. AI makes scaled Agile governance tractable.', 4, 'pm:delivery-methods', '{}'::jsonb),

  (qz, 'What does AI add to the Sprint Review that was not possible before?', 'Your Sprint Review is a 30-minute demo that rarely surfaces actionable stakeholder feedback.',
   '["AI can replace stakeholder attendance","AI can replace the demo","AI can synthesize stakeholder feedback from multiple channels (meeting notes, Slack, email, survey responses) in real time, identify themes, and flag misalignment between stakeholder expectations and Sprint outcomes — turning a passive demo into a data-driven feedback loop","AI can auto-update the product roadmap after the Sprint Review"]'::jsonb,
   2, 'Sprint Reviews generate valuable feedback that traditionally gets lost in meeting notes. AI synthesis turns scattered stakeholder signals into structured themes, expectation gaps, and trend analysis — making Sprint Reviews more actionable and giving the PO better data for backlog decisions.', 5, 'pm:delivery-methods', '{}'::jsonb),

  (qz, 'A Scrum Master is concerned that AI tools may undermine team self-management. What is the most appropriate safeguard?', 'Some team members are starting to ask "what does the AI say?" instead of making team decisions themselves.',
   '["Remove all AI tools from the team","Let team members use AI without any guidance","Establish team norms for AI use: AI provides data and recommendations, but the team makes decisions — no AI output enters team processes without team review and consent, and the SM coaches the team to use AI as an input, not an authority","Only the Scrum Master should use AI tools"]'::jsonb,
   2, 'Self-management is a Scrum core value. AI must be positioned as a decision-support tool, not a decision-maker. Teams that defer to AI lose the accountability, ownership, and learning that make Scrum work. The SM''s coaching role extends to how the team relates to AI tools.', 6, 'pm:delivery-methods', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 4 — AI for Stakeholder Communication and Engagement
  -- Competency: pm:stakeholders
  -- ═══════════════════════════════════════════════════════════════════════════
  ch := chs[4];
  SELECT q.id INTO qz FROM public.quizzes q WHERE q.chapter_id = ch AND q.quiz_type = 'chapter_end';
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 4 already has % question(s)', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'A PM uses AI to generate a stakeholder status update. What must they do before sending it?', 'The AI tool drafted a project update email that reads professionally and covers all the key points.',
   '["Send it immediately — the AI draft is accurate","Change the font and send","Review the content for accuracy, tone appropriateness for the specific relationship, any missing context the AI lacked, and verify that all facts are correct — then personalize as needed before sending","Ask a colleague to send it without the PM''s review"]'::jsonb,
   2, 'AI-drafted communications are a starting point. The PM owns the relationship, knows the stakeholder''s communication preferences, and has context the AI does not. Sending AI content without review risks factual errors, tone mismatches, and missing nuance that damages stakeholder trust.', 1, 'pm:stakeholders', '{}'::jsonb),

  (qz, 'How can AI help a PM manage 15 stakeholders with different communication needs?', 'Your program has stakeholders ranging from C-suite executives to front-line users, each requiring different levels of detail and frequency.',
   '["Send the same update to all stakeholders","Use AI to segment stakeholders, track their communication history and preferences, draft personalized updates at the appropriate level of detail, and flag stakeholders who have not been engaged recently","Ask each stakeholder to contact you when they need information","Reduce the stakeholder list to 5 people"]'::jsonb,
   1, 'At scale, personalized stakeholder communication is impossible without AI assistance. AI can maintain stakeholder profiles, draft level-appropriate updates (executive summary vs. detailed operational report), and flag communication gaps — turning a manual, exhausting process into a systematic one.', 2, 'pm:stakeholders', '{}'::jsonb),

  (qz, 'A PM uses AI to detect sentiment in stakeholder email threads. The AI flags a critical stakeholder as "disengaged and concerned." What is the right response?', 'The AI analysis shows that a key sponsor''s email responses have shortened significantly and contain more questions than usual over the past 2 weeks.',
   '["Wait for the stakeholder to raise a concern formally","Dismiss the signal — email length is not meaningful","Proactively schedule a direct conversation with the stakeholder — use the AI signal as an early warning to re-engage before disengagement becomes a formal issue or escalation","Ask the AI to send an automated re-engagement email to the stakeholder"]'::jsonb,
   2, 'Sentiment signals are early warnings, not diagnoses. The correct response is human action: a genuine conversation that addresses the stakeholder''s underlying concern. AI detects the signal; the PM builds the relationship. Automated AI responses to stakeholder concerns are almost always the wrong answer.', 3, 'pm:stakeholders', '{}'::jsonb),

  (qz, 'What is the most valuable use of AI for executive project reporting?', 'You spend 4 hours every Friday compiling the executive status report from 6 different data sources.',
   '["Having AI write the entire report without PM review","Using AI to aggregate and synthesize data from multiple sources, generate a draft narrative with key metrics and risks highlighted, and then having the PM review, validate, and add qualitative context before distributing","Having AI present the report directly to executives","Using AI to decide which projects are reported as red/amber/green"]'::jsonb,
   1, 'AI dramatically reduces the time to synthesize multi-source data and draft a coherent narrative. The PM adds irreplaceable value: validating accuracy, adding qualitative context (team morale, political risks, relationship dynamics), and exercising judgment on what to escalate. 4 hours becomes 45 minutes without losing quality.', 4, 'pm:stakeholders', '{}'::jsonb),

  (qz, 'A PM''s AI meeting assistant transcribes a tense stakeholder negotiation and generates a summary. A stakeholder requests a copy of the transcript. What should the PM consider?', 'The full transcript includes unfiltered, candid comments from multiple parties.',
   '["Share the full transcript — transparency is always best","Never share any AI-generated content","Consider privacy expectations: were attendees aware the conversation was being transcribed? Would sharing the full transcript damage relationships or trust? Share meeting notes and agreed action items instead of a raw transcript, and always inform participants upfront when meetings are recorded","Share only the AI summary, not the transcript"]'::jsonb,
   2, 'AI transcription creates new privacy and trust considerations. Participants must know when meetings are recorded. Raw transcripts capture unguarded comments that people did not intend as formal records. PM judgment — not AI default behavior — determines what is shared and how.', 5, 'pm:stakeholders', '{}'::jsonb),

  (qz, 'How does AI change the PM''s approach to stakeholder influence mapping?', 'You have 25 stakeholders across 4 organizational divisions for a major transformation program.',
   '["AI replaces the need for influence mapping","AI automates relationship management so PMs no longer need to do stakeholder analysis","AI can analyze communication patterns, meeting attendance, decision history, and org-chart relationships to generate a data-informed influence map — the PM then validates and acts on it, combining AI pattern detection with their own relationship knowledge","AI maps stakeholders based on job title alone"]'::jsonb,
   2, 'Traditional influence mapping relies entirely on the PM''s perception. AI adds a behavioral data layer: who actually influences decisions (not just who should), who is the informal bridge between factions, who has become disengaged. AI-enhanced influence mapping is more accurate and continuously updated.', 6, 'pm:stakeholders', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 5 — AI for Risk Management and Reporting
  -- Competency: pm:risk
  -- ═══════════════════════════════════════════════════════════════════════════
  ch := chs[5];
  SELECT q.id INTO qz FROM public.quizzes q WHERE q.chapter_id = ch AND q.quiz_type = 'chapter_end';
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 5 already has % question(s)', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'How does AI improve risk identification compared to traditional risk workshops?', 'Your risk workshop generates the same 10 risks every project. The team''s risk register has not evolved in 2 years.',
   '["AI generates more colorful risk registers","AI replaces risk workshops entirely","AI analyzes historical project data, industry loss databases, and external signals to surface risk patterns that human workshops miss — especially systemic, low-probability/high-impact risks that teams self-censor from registers","AI predicts the exact probability of each risk materializing"]'::jsonb,
   2, 'Human risk workshops are biased by recent experience, team dynamics (people avoid raising politically sensitive risks), and cognitive anchoring on familiar risks. AI pattern recognition surfaces tail risks, systemic risks, and historically recurrent risks that workshops consistently miss.', 1, 'pm:risk', '{}'::jsonb),

  (qz, 'A PM uses an AI tool that predicts a 73% probability that the current Sprint will miss its velocity target by more than 20%. What should the PM do with this prediction?', 'The prediction is based on current story point completion rate, team capacity, and historical velocity patterns.',
   '["Accept the prediction as fact and cancel the Sprint","Ignore it — predictions are never accurate","Treat the prediction as a risk signal: investigate the factors driving it (are there blockers? capacity gaps?), discuss it with the team in the next Daily Scrum or an ad-hoc check-in, and decide whether to adjust scope or address the blockers","Share the prediction with stakeholders without first validating it with the team"]'::jsonb,
   2, 'AI predictions are probabilistic signals, not certainties. The PM''s job is to investigate and respond: understand why the model predicts a miss, validate with the team, and take appropriate action. Sharing raw AI predictions with stakeholders without team context creates unnecessary alarm.', 2, 'pm:risk', '{}'::jsonb),

  (qz, 'What is Monte Carlo simulation, and why is it more valuable than single-point project estimates?', 'Your steering committee asks for the project completion date, and you have given them a single date that you have missed three times.',
   '["A casino-style probability game","A risk quantification technique that runs thousands of scenarios with varying assumptions (task duration, resource availability, risk events) to produce a probability distribution of outcomes — e.g. ''70% chance of completing by June 30, 95% chance by July 31''","A project tracking tool","A financial reporting methodology"]'::jsonb,
   1, 'Single-point estimates create false precision and erode trust when missed. Monte Carlo replaces "we will finish June 30" with "we have a 70% chance of finishing by June 30." This gives executives a realistic risk picture and enables better contingency planning. AI tools have made Monte Carlo accessible to PMs without statistical expertise.', 3, 'pm:risk', '{}'::jsonb),

  (qz, 'An AI risk monitoring system sends an alert that a third-party vendor''s delivery is likely to be delayed based on email response patterns and milestone slip history. The PM has not yet received any formal notification from the vendor. What action is appropriate?', 'The vendor is responsible for a component that is on the critical path.',
   '["Wait for the vendor''s official delay notification before taking any action","Immediately escalate to the steering committee as a confirmed delay","Proactively contact the vendor to check status — use the AI signal to trigger early inquiry before the delay becomes confirmed and on-critical-path impact is locked in","Replace the vendor based on the AI alert alone"]'::jsonb,
   2, 'AI early warnings create lead time. The correct response is proactive inquiry — not escalation (the risk is unconfirmed) and not inaction (time is being wasted). A 2-week early warning call can prevent a 2-week schedule slip by enabling contingency planning before the risk materializes.', 4, 'pm:risk', '{}'::jsonb),

  (qz, 'How should a PM use AI to improve the quality of their risk register over the course of a project?', 'Most risk registers are set up at project start and never meaningfully updated.',
   '["Add risks manually at the end of each phase","Use AI to continuously scan project signals — velocity, communication, budget, external news — and suggest new risks, update probability/impact assessments based on emerging evidence, and flag risks that have become more likely as the project progresses","Let AI fully manage the risk register without PM review","Only update the risk register when a risk materializes"]'::jsonb,
   1, 'A static risk register is not risk management — it is paperwork. AI enables a living risk register: continuously updated based on project signals, with probability shifts driven by evidence rather than gut feel. The PM reviews and validates AI suggestions; the register stays current and credible.', 5, 'pm:risk', '{}'::jsonb),

  (qz, 'What is the PM''s responsibility when AI-generated risk analysis conflicts with a senior stakeholder''s intuition?', 'The AI model predicts a 65% chance of budget overrun. The CFO says "I''ve seen this kind of project before — it will be fine."',
   '["Always defer to the senior stakeholder — they have more experience","Always trust the AI model — it is data-driven","Present both perspectives clearly: document the AI-based quantitative analysis with its assumptions, acknowledge the stakeholder''s experience-based judgment, and propose a monitoring plan that will rapidly clarify which view is correct","Escalate the conflict to the CEO"]'::jsonb,
   2, 'Neither AI data nor stakeholder intuition is automatically correct. AI models have assumptions that may not capture unique project context. Experienced stakeholders may have genuine pattern recognition — or may be subject to optimism bias. The PM''s job is to hold both views transparently, establish monitoring that will reveal the answer early, and adjust as evidence arrives.', 6, 'pm:risk', '{}'::jsonb);

  -- ═══════════════════════════════════════════════════════════════════════════
  -- MODULE 6 — Building Your AI-Powered PM Operating Model
  -- Competency: pm:leadership
  -- ═══════════════════════════════════════════════════════════════════════════
  ch := chs[6];
  SELECT q.id INTO qz FROM public.quizzes q WHERE q.chapter_id = ch AND q.quiz_type = 'chapter_end';
  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 6 already has % question(s)', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  (qz, 'What is a "PM Operating Model" and why does AI change it?', 'A CPO asks all Scrum Masters and PMs to redesign their operating model to incorporate AI.',
   '["An operating model is the project schedule; AI does not change it","A PM operating model is the set of workflows, tools, decisions, and communication rhythms that define how a PM delivers value — AI changes it by automating data collection, accelerating synthesis, and enabling real-time risk monitoring, freeing the PM to focus on leadership and judgment","An operating model is the organizational chart","AI only changes the technology, not the PM operating model"]'::jsonb,
   1, 'The PM operating model is the system of how work gets done. AI fundamentally rewires it: hours spent on status collection become minutes, risk review cycles compress from weekly to daily, and the PM''s focus shifts from information management to decision quality. Redesigning the operating model is not optional — it is necessary to realize AI''s value.', 1, 'pm:leadership', '{}'::jsonb),

  (qz, 'A PM wants to measure the ROI of their AI tool adoption. What metrics best demonstrate value?', 'The CTO asks all team leads to quantify the benefit of AI tool investments made last year.',
   '["Number of AI features used per week","Time saved on status reporting, earlier risk detection rates (risk caught X weeks before impact), increase in stakeholder satisfaction scores, and improvement in on-time delivery rate — before vs. after AI adoption","The cost of AI tool licenses","Number of AI prompts submitted per day"]'::jsonb,
   1, 'AI ROI is measured in outcomes: time recovered, decisions improved, risks caught earlier, and delivery performance. License cost and feature usage are inputs, not outcomes. PMs who can demonstrate outcome-level AI ROI earn organizational credibility and budget for continued investment.', 2, 'pm:leadership', '{}'::jsonb),

  (qz, 'How should a PM lead team adoption of new AI tools?', 'Half the team is enthusiastic about AI; the other half is skeptical or resistant.',
   '["Mandate all tools immediately and monitor compliance","Do not implement any tools until the full team agrees","Start with a targeted pilot using willing team members on a specific workflow pain point — measure the impact, share the results with the full team, and build adoption through demonstrated value rather than mandate","Ask the skeptical team members to leave"]'::jsonb,
   2, 'Adoption is behavioral change. Mandates create compliance, not capability. Pilots create evidence: when skeptical team members see a colleague save 3 hours per week or catch a risk 2 weeks earlier, the case for adoption is concrete and peer-validated. Evidence converts skeptics faster than authority.', 3, 'pm:leadership', '{}'::jsonb),

  (qz, 'A Scrum Master develops a personal AI workflow that saves 5 hours per week. What should they do with this knowledge?', 'The workflow uses prompt templates for retrospective analysis and Sprint report generation.',
   '["Keep it private to maintain a personal competitive advantage","Share it selectively with trusted colleagues only","Document the workflow and prompt templates, share them with other Scrum Masters, and propose standardizing them as team/org-level best practices — multiplying individual productivity gains into organizational capability","Ask leadership permission before sharing"]'::jsonb,
   2, 'Individual AI productivity gains multiply when socialized across teams. A workflow that saves 5 hours for one SM saves 50 hours if adopted by 10 SMs. PMs and SMs who build AI-first operating models and share them create organizational competitive advantage. Hoarding AI workflows wastes their leverage.', 4, 'pm:leadership', '{}'::jsonb),

  (qz, 'What ethical responsibility does a PM have when using AI to manage team performance data?', 'Your AI tool has access to individual developer velocity, code commit frequency, and code review response times.',
   '["Use all available data to maximize individual performance monitoring","AI-enabled performance monitoring is unethical and should be avoided entirely","Use AI to identify team-level patterns (not individual surveillance), be transparent with the team about what data is collected and how it is used, and focus AI analysis on removing systemic impediments rather than rating or ranking individuals","Share AI performance data with HR for performance reviews"]'::jsonb,
   2, 'AI performance data must be used ethically. Individual surveillance damages psychological safety — the foundation of high-performing Scrum teams. AI is most ethically and effectively used to identify systemic issues (team-level, process-level) that the SM and team can address together, not to rank or rate individuals.', 5, 'pm:leadership', '{}'::jsonb),

  (qz, 'What does "future-proofing your PM career" in the age of AI actually require?', 'A junior PM asks what skills will still matter in 5 years as AI handles more PM tasks.',
   '["Learning every AI tool on the market","Focusing exclusively on technical AI skills","Building the distinctly human skills that AI cannot replicate — stakeholder relationships, political judgment, organizational leadership, ethical decision-making, and team coaching — while maintaining enough AI fluency to direct and validate AI tools effectively","Leaving the PM field to work in AI development"]'::jsonb,
   2, 'AI cannot replicate human judgment under ambiguity, relationship trust, political navigation, or the coaching presence that builds high-performing teams. PMs who combine these irreplaceable human skills with AI fluency will be more valuable than PMs who do either alone. The threat is not AI — it is the PM who refuses to use AI competing against the PM who does.', 6, 'pm:leadership', '{}'::jsonb);

END $$;

-- =============================================================================
-- VERIFICATION QUERY — run after applying the block above
-- Expected: 6 rows, each with total_questions = 6
-- =============================================================================
SELECT c.order_index, c.title AS module_title,
       count(qq.id)  AS total_questions,
       count(qq.id) FILTER (WHERE qq.status = 'approved') AS approved,
       count(DISTINCT qq.competency) AS competencies
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.quizzes qz ON qz.chapter_id = c.id AND qz.quiz_type = 'chapter_end'
LEFT JOIN public.quiz_questions qq ON qq.quiz_id = qz.id
WHERE co.title = 'AI Mastery for Scrum Masters & Project Managers'
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
