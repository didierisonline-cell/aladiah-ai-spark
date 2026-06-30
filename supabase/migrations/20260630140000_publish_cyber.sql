-- =============================================================
-- Aladiah Academy — Publish AI Cybersecurity course
-- Sets is_published = true, launch_status = 'live'
-- Run AFTER all content and quiz migrations have been applied
-- =============================================================

DO $body$
DECLARE
  v_cid UUID;
  v_chapter_count INT;
  v_lesson_count  INT;
  v_quiz_count    INT;
  v_question_count INT;
BEGIN
  SELECT id INTO v_cid FROM public.courses
    WHERE title = 'AI Cybersecurity, Governance & Enterprise Compliance'
      AND curriculum_version = 'cyber-v1';
  IF v_cid IS NULL THEN
    RAISE EXCEPTION 'Cyber course not found — run structure migration first';
  END IF;

  -- Verify structure before publishing
  SELECT COUNT(*) INTO v_chapter_count FROM public.chapters WHERE course_id = v_cid;
  SELECT COUNT(*) INTO v_lesson_count  FROM public.videos   WHERE chapter_id IN (SELECT id FROM public.chapters WHERE course_id = v_cid);
  SELECT COUNT(*) INTO v_quiz_count    FROM public.quizzes  WHERE chapter_id IN (SELECT id FROM public.chapters WHERE course_id = v_cid);
  SELECT COUNT(*) INTO v_question_count FROM public.quiz_questions
    WHERE quiz_id IN (
      SELECT q.id FROM public.quizzes q
      JOIN public.chapters ch ON ch.id = q.chapter_id
      WHERE ch.course_id = v_cid
    );

  IF v_chapter_count < 18 THEN
    RAISE EXCEPTION 'Expected 18 chapters, found %. Aborting publish.', v_chapter_count;
  END IF;
  IF v_lesson_count < 90 THEN
    RAISE EXCEPTION 'Expected 90 lessons, found %. Aborting publish.', v_lesson_count;
  END IF;
  IF v_quiz_count < 18 THEN
    RAISE EXCEPTION 'Expected 18 quizzes, found %. Aborting publish.', v_quiz_count;
  END IF;
  IF v_question_count < 270 THEN
    RAISE EXCEPTION 'Expected 270 quiz questions, found %. Aborting publish.', v_question_count;
  END IF;

  UPDATE public.courses
  SET
    is_published  = true,
    launch_status = 'live',
    updated_at    = NOW()
  WHERE id = v_cid;

  RAISE NOTICE 'Published cyber-v1: % chapters, % lessons, % quizzes, % questions.',
    v_chapter_count, v_lesson_count, v_quiz_count, v_question_count;
END $body$;

-- Verify publish:
-- SELECT id, title, is_published, launch_status, curriculum_version, updated_at
-- FROM public.courses
-- WHERE curriculum_version = 'cyber-v1';
