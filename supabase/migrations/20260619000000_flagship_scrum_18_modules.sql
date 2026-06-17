-- ============================================================================
-- Replace Scrum Master program → AI Scrum Master Professional Certification v1.0
-- 18-module flagship structure. REVIEW → apply by hand in Supabase (canon).
-- EN content only; run scripts/populate-translations.mjs afterward to fill
-- ES/FR/PT/DE/AR/ZH/HI into chapters.translations (and courses.translations).
-- Verify the course id first:  SELECT id,title FROM courses WHERE title ILIKE '%Scrum Master%';
-- ============================================================================
DO $$
DECLARE cid uuid;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title ILIKE '%Scrum Master%' ORDER BY created_at LIMIT 1;
  IF cid IS NULL THEN RAISE EXCEPTION 'Scrum Master course not found'; END IF;

  UPDATE public.courses
     SET title='AI Scrum Master Professional Certification v1.0',
         description='An 18-module, AI-augmented professional certification: 54 simulations, 18 labs, 18 portfolio deliverables, 36 assessments, and a 1,080-question bank. Aligned to Scrum.org PSM I/II readiness.',
         is_flagship=true, flagship_version='v1.0', curriculum_version='v1.0'
   WHERE id=cid;

  -- Replace old module structure (4 chapters) with the 18 flagship modules.
  DELETE FROM public.chapters WHERE course_id=cid;
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 1, 'Agile & Scrum Foundations (AI-Augmented)', 'Explain Scrum as a lightweight empirical framework. Contrast Scrum with predictive/waterfall delivery.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 2, 'The Scrum Master Role & Servant Leadership', 'Define the Scrum Master accountability. Differentiate the Scrum Master from a project manager.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 3, 'Scrum Team Accountabilities', 'Describe the three accountabilities. Clarify PO, SM, and Developer boundaries.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 4, 'The Sprint & Sprint Planning', 'Explain the Sprint as the heartbeat of Scrum. Facilitate effective Sprint Planning.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 5, 'Daily Scrum & Sprint Execution', 'Run an effective 15-minute Daily Scrum. Keep execution focused on the Sprint Goal.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 6, 'Sprint Review & Retrospective', 'Facilitate a value-focused Sprint Review. Run an effective Retrospective.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 7, 'Scrum Artifacts & Commitments', 'Explain Product Backlog, Sprint Backlog, Increment. Connect each artifact to its commitment.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 8, 'Definition of Done & Quality', 'Create a strong Definition of Done. Protect quality under pressure.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 9, 'Product Backlog Management & Refinement', 'Facilitate effective backlog refinement. Split and order work by value.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 10, 'Empiricism, Transparency & Scrum Values', 'Deepen empirical process control. Build radical transparency.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 11, 'Facilitation Mastery', 'Master facilitation across all events. Design engaging sessions.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 12, 'Coaching & Team Dynamics', 'Coach individuals and teams. Build high-performing dynamics.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 13, 'Stakeholder Engagement & Communication', 'Engage stakeholders effectively. Communicate with executives.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 14, 'Organizational Change & Removing Impediments', 'Drive organizational change. Remove systemic impediments.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 15, 'Agile Metrics, Flow & Forecasting', 'Use flow metrics responsibly. Forecast delivery empirically.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 16, 'Scaling Scrum & Enterprise Agility', 'Coordinate multiple teams. Apply scaling patterns responsibly.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 17, 'AI for the Scrum Master', 'Master AI workflows across the role. Augment facilitation, analysis, and delivery with AI.', '{}'::jsonb);
  INSERT INTO public.chapters(course_id, order_index, title, description, translations)
    VALUES (cid, 18, 'Capstone: Career Transformation & Placement', 'Integrate all competencies in a capstone. Assemble the Aladiah Profile + portfolio.', '{}'::jsonb);
END $$;

-- VERIFY: SELECT order_index, title FROM chapters WHERE course_id=(SELECT id FROM courses WHERE is_flagship) ORDER BY order_index;  -- expect 18 rows
