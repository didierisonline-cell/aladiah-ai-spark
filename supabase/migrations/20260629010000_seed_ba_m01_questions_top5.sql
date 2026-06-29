-- ═══════════════════════════════════════════════════════════════
-- Seed: BA Module 01 — 5 additional questions
-- Course: AI Business Analyst & Product Discovery Specialist
-- M01 currently has 10 questions; target is 15.
-- Uses direct INSERT (fill_ba_exam is idempotent and would skip).
--
-- PASTE-READY — apply in Supabase SQL Editor
-- Verify after:
--   SELECT COUNT(*) FROM public.quiz_questions qq
--   JOIN public.quizzes qz ON qq.quiz_id = qz.id
--   JOIN public.chapters ch ON qz.chapter_id = ch.id
--   JOIN public.courses co ON ch.course_id = co.id
--   WHERE co.title = 'AI Business Analyst & Product Discovery Specialist'
--   AND ch.order_index = 1 AND qz.quiz_type = 'chapter_end';
-- Expected: 15
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_course_id uuid;
  v_chapter_id uuid;
  v_quiz_id uuid;
  v_max_order int;
BEGIN
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE title = 'AI Business Analyst & Product Discovery Specialist'
    AND curriculum_version = 'ba-v1';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'BA course not found';
  END IF;

  SELECT id INTO v_chapter_id
  FROM public.chapters
  WHERE course_id = v_course_id AND order_index = 1;

  SELECT id INTO v_quiz_id
  FROM public.quizzes
  WHERE chapter_id = v_chapter_id AND quiz_type = 'chapter_end';

  IF v_quiz_id IS NULL THEN
    RAISE EXCEPTION 'M01 chapter_end quiz not found';
  END IF;

  SELECT COALESCE(MAX(order_index), 0) INTO v_max_order
  FROM public.quiz_questions
  WHERE quiz_id = v_quiz_id;

  -- Q11
  INSERT INTO public.quiz_questions
    (quiz_id, question_text, options, correct_answer_index, explanation, order_index, competency, translations)
  VALUES (v_quiz_id,
    'What is digital transformation and how does a BA contribute to it?',
    '["A technology upgrade project only","A rebranding exercise","Only an IT department responsibility","A fundamental reimagining of how an organization uses technology, data, and processes to deliver value — BAs bridge business strategy and technical execution"]',
    3,
    'Digital transformation is not just installing new software. BAs ensure transformation initiatives address real business problems, define measurable outcomes, and manage stakeholder change — preventing technology-led failures.',
    v_max_order + 1, 'ba:requirements', '{}'::jsonb);

  -- Q12
  INSERT INTO public.quiz_questions
    (quiz_id, question_text, options, correct_answer_index, explanation, order_index, competency, translations)
  VALUES (v_quiz_id,
    'What is the AI Analyst''s Mindset?',
    '["Replacing all manual analysis with AI","Using AI as a co-pilot: leveraging AI for speed and pattern recognition while applying human judgment for context, ethics, and stakeholder relationships","Avoiding AI tools to preserve BA skills","Automating the entire BA process"]',
    1,
    'The AI Analyst''s Mindset treats AI as an accelerator, not a replacement. AI handles: first-draft documents, pattern detection in data, repetitive analysis. Humans handle: judgment, politics, context, and validation.',
    v_max_order + 2, 'ba:ai-analysis', '{}'::jsonb);

  -- Q13
  INSERT INTO public.quiz_questions
    (quiz_id, question_text, options, correct_answer_index, explanation, order_index, competency, translations)
  VALUES (v_quiz_id,
    'How does AI change the speed expectations for BA deliverables?',
    '["AI has no impact on BA speed","AI slows down BA work due to validation overhead","Stakeholders and organizations now expect faster delivery — BAs who use AI can produce first drafts, gap analyses, and documentation in hours instead of days","AI eliminates the need for BA documentation"]',
    2,
    'AI compresses the time to first draft. A BRD that took 3 days now takes 3 hours with AI assistance. This raises stakeholder expectations and gives AI-fluent BAs a significant competitive advantage.',
    v_max_order + 3, 'ba:ai-analysis', '{}'::jsonb);

  -- Q14
  INSERT INTO public.quiz_questions
    (quiz_id, question_text, options, correct_answer_index, explanation, order_index, competency, translations)
  VALUES (v_quiz_id,
    'What are emerging BA specializations in the AI era?',
    '["Traditional BA skills are sufficient for all contexts","Only technical BAs have a future","BA is being fully automated","AI Product BA, Data BA, AI Governance Analyst, and Prompt Engineer for requirements — new specializations combining BA skills with AI domain expertise"]',
    3,
    'AI creates new BA niches: AI Product BAs define AI feature requirements. Data BAs bridge analytics and business. AI Governance Analysts assess AI risk. Each combines core BA skills with AI domain knowledge.',
    v_max_order + 4, 'ba:ai-analysis', '{}'::jsonb);

  -- Q15
  INSERT INTO public.quiz_questions
    (quiz_id, question_text, options, correct_answer_index, explanation, order_index, competency, translations)
  VALUES (v_quiz_id,
    'What is the single biggest risk of AI-generated requirements documents?',
    '["They are too long","They use wrong templates","They are hard to edit","Plausible completeness — AI produces professional-looking documents that appear thorough but may miss organization-specific constraints, political realities, and unstated stakeholder needs"]',
    3,
    'AI outputs look complete. The danger is accepting them without validation. A requirements document that sounds correct but misses a regulatory constraint or stakeholder concern creates expensive rework when discovered late.',
    v_max_order + 5, 'ba:ai-analysis', '{}'::jsonb);

  RAISE NOTICE 'SUCCESS: Added 5 M01 questions. New total: %', v_max_order + 5;
END $$;
