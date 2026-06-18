-- ============================================================================
-- Flagship Scrum DB population: 72 lessons (videos) + 18 module quizzes.
-- REAL content from aiScrumMasterFull.ts (lesson title+summary). Run AFTER
-- 20260619000000_flagship_scrum_18_modules.sql (which creates the 18 chapters).
-- Translation-ready: videos.translations '{}' → fill via populate-translations.mjs.
-- NOTE: quiz_questions are NOT created here — see report (1,080 questions are not
-- authored in the flagship source; use the question-bank generator).
-- ============================================================================
DO $$
DECLARE cid uuid; ch RECORD; vid uuid;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE is_flagship ORDER BY created_at LIMIT 1;
  IF cid IS NULL THEN RAISE EXCEPTION 'Flagship course not found — run the 18-module migration first'; END IF;
  FOR ch IN SELECT id, order_index FROM public.chapters WHERE course_id=cid LOOP
    IF ch.order_index = 1 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'What Scrum is (and is not)', 'The framework, its purpose, and when to use it.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Empiricism: transparency, inspection, adaptation', 'How empirical process control replaces up-front prediction.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'The Scrum values', 'Commitment, focus, openness, respect, courage in practice.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Your AI co-pilot', 'Setting up an AI mentor for explanations, practice, and feedback.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 2 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'The Scrum Master accountability', 'True leadership that serves the team and organization.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Servant leadership', 'Coaching, facilitating, and removing impediments — not assigning tasks.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Scrum Master vs. Project Manager', 'Boundaries, mindset, and common confusions.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Building self-management', 'Helping teams own their decisions.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 3 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Product Owner accountability', 'Value, the Product Goal, and backlog ownership.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Developers', 'Creating a usable Increment each Sprint.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Scrum Master', 'Effectiveness of Scrum across the team and org.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Boundaries & overlaps', 'Avoiding role confusion and anti-patterns.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 4 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'The Sprint', 'Fixed length, consistency, and the container for all work.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Sprint Planning topics', 'Why, what, and how.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'The Sprint Goal', 'A single objective that creates focus.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Capacity & forecasting', 'Selecting a realistic forecast.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 5 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Purpose of the Daily Scrum', 'Inspect progress and adapt the plan — for the Developers.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Anti-patterns', 'Status meetings, manager check-ins, and how to coach past them.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Impediment management', 'Identifying, prioritizing, and removing blockers.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Flow during the Sprint', 'Visualizing and protecting flow.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 6 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Sprint Review', 'Inspect the Increment and adapt the backlog with stakeholders.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Retrospective', 'Inspect people, relationships, process, and tools.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Improvement experiments', 'Turning insights into measurable change.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Facilitation techniques', 'Formats that keep events energizing.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 7 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Product Backlog & Product Goal', 'The single source of work and the long-term objective.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Sprint Backlog & Sprint Goal', 'The plan and objective for the Sprint.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Increment & Definition of Done', 'A usable, valuable result that meets quality.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Transparency', 'Making artifacts trustworthy.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 8 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Definition of Done', 'A shared understanding of complete.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Quality as non-negotiable', 'Why DoD protects the product and team.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'DoD and CI/CD', 'Embedding quality in the pipeline.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Scope vs. DoD', 'Holding the line under pressure.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 9 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Refinement as a continuous activity', 'Keeping the backlog ready.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Story splitting & acceptance criteria', 'Small, valuable, testable items.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Ordering by value & risk', 'Maximizing outcomes.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Supporting the PO', 'Coaching without taking ownership.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 10 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Empiricism in depth', 'Inspect-and-adapt as a discipline.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Transparency radiators', 'Information radiators and honest signals.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Values under pressure', 'Courage and openness when it’s hard.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Trust & safety', 'The foundation of empiricism.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 11 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Facilitation fundamentals', 'Neutrality, structure, participation.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Designing sessions', 'Purpose, outcomes, formats.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Difficult dynamics', 'Dominators, silence, conflict.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Facilitation toolkit', 'Techniques for every event.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 12 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Coaching stance', 'Powerful questions over answers.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Team development', 'Forming to performing.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Conflict resolution', 'Healthy conflict as fuel.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Emotional intelligence', 'Self- and social awareness.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 13 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Stakeholder mapping', 'Who matters and how to engage.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Executive communication', 'Speaking the language of leaders.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Expectation management', 'Honesty over false certainty.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'The right events for feedback', 'Channeling engagement productively.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 14 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Change models', 'How organizations change.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Systemic impediments', 'Beyond the team boundary.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Influence without authority', 'Leading change as a Scrum Master.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Agile transformation basics', 'Patterns and pitfalls.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 15 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Flow metrics', 'Throughput, cycle time, WIP, aging.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Forecasting', 'Probabilistic forecasting over commitments.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Velocity done right', 'A team tool, not a target.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Avoiding metric misuse', 'Goodhart’s law in practice.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 16 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Scaling principles', 'Descaling first; scaling patterns second.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Cross-team coordination', 'Aligning many teams on one product.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Dependency management', 'Reducing and managing dependencies.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Enterprise agility', 'SAFe, LeSS, and pragmatic scaling.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 17 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'AI across the Scrum Master role', 'Where AI helps — and where it doesn’t.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'AI-augmented facilitation & analysis', 'Standups, retros, refinement, metrics.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'AI Scrum automations', 'Workflows and prompts that save time.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Responsible AI', 'Bias, privacy, and human judgment.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
    IF ch.order_index = 18 THEN
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'The capstone', 'A 3-Sprint leadership turnaround case study.', 1, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Assembling your portfolio', 'Curating evidence employers trust.', 2, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'The Aladiah Profile', 'Competency, simulation, and interview scores.', 3, '{}'::jsonb);
      INSERT INTO public.videos(chapter_id, title, description, order_index, translations) VALUES (ch.id, 'Interview & placement readiness', 'From ready to hired.', 4, '{}'::jsonb);
      INSERT INTO public.quizzes(chapter_id, quiz_type, passing_score) VALUES (ch.id, 'chapter_end', 85);
    END IF;
  END LOOP;
END $$;

-- VERIFY:
-- SELECT count(*) FROM videos v JOIN chapters c ON c.id=v.chapter_id WHERE c.course_id=(SELECT id FROM courses WHERE is_flagship);  -- expect 72
-- SELECT count(*) FROM quizzes q JOIN chapters c ON c.id=q.chapter_id WHERE c.course_id=(SELECT id FROM courses WHERE is_flagship); -- expect 18
