-- =============================================================================
-- AI Enterprise Cybersecurity — Module 19 Structure
-- Module 19 (Masterclass): The Future of AI Cybersecurity, Governance & Digital Trust
-- Adds 1 chapter + 5 lesson slots + 1 quiz
-- Apply BEFORE content and quiz migrations
-- =============================================================================

DO $$
DECLARE
  v_cid UUID;
  v_ch  UUID;
  v_qid UUID;
BEGIN
  SELECT id INTO v_cid FROM public.courses
    WHERE curriculum_version = 'cyber-v1';
  IF v_cid IS NULL THEN RAISE EXCEPTION 'cyber-v1 course not found'; END IF;

  -- ── Insert Module 19 chapter ──────────────────────────────────────────────
  INSERT INTO public.chapters (course_id, title, order_index)
  VALUES (
    v_cid,
    'The Future of AI Cybersecurity, Governance & Digital Trust (2030–2050)',
    19
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_ch;

  -- If already exists (idempotent re-run), fetch it
  IF v_ch IS NULL THEN
    SELECT id INTO v_ch FROM public.chapters
      WHERE course_id = v_cid AND order_index = 19;
  END IF;

  IF v_ch IS NULL THEN RAISE EXCEPTION 'M19 chapter insert/fetch failed'; END IF;

  -- ── Insert 5 lesson slots (idempotent) ───────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch AND order_index = 1) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations)
    VALUES (v_ch, 'Autonomous AI SOCs — The Self-Defending Enterprise', '', 1, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch AND order_index = 2) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations)
    VALUES (v_ch, 'Quantum-Resistant Cryptography & Post-Quantum Security', '', 2, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch AND order_index = 3) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations)
    VALUES (v_ch, 'Agentic Security Systems & AI Red vs. Blue Teams', '', 3, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch AND order_index = 4) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations)
    VALUES (v_ch, 'Digital Identity, Decentralized Trust & Human–AI Collaboration', '', 4, '{}'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE chapter_id = v_ch AND order_index = 5) THEN
    INSERT INTO public.videos (chapter_id, title, description, order_index, translations)
    VALUES (v_ch, 'Cybersecurity Careers 2030–2050 — The 25-Year Roadmap', '', 5, '{}'::jsonb);
  END IF;

  -- ── Insert quiz (idempotent) ──────────────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE chapter_id = v_ch AND quiz_type = 'chapter_end') THEN
    INSERT INTO public.quizzes (chapter_id, quiz_type, passing_score)
    VALUES (v_ch, 'chapter_end', 70);
  END IF;

  SELECT id INTO v_qid FROM public.quizzes WHERE chapter_id = v_ch LIMIT 1;

  IF v_qid IS NULL THEN
    SELECT id INTO v_qid FROM public.quizzes WHERE chapter_id = v_ch LIMIT 1;
  END IF;

  IF v_qid IS NULL THEN RAISE EXCEPTION 'M19 quiz insert/fetch failed'; END IF;

  RAISE NOTICE 'M19 structure created — chapter %, quiz %', v_ch, v_qid;
END $$;

-- VERIFY:
-- SELECT ch.order_index, ch.title,
--        COUNT(DISTINCT v.id) AS lessons,
--        COUNT(DISTINCT q.id) AS quizzes
-- FROM public.chapters ch
-- JOIN public.courses co ON co.id = ch.course_id
-- LEFT JOIN public.videos v ON v.chapter_id = ch.id
-- LEFT JOIN public.quizzes q ON q.chapter_id = ch.id
-- WHERE co.curriculum_version = 'cyber-v1' AND ch.order_index = 19
-- GROUP BY ch.order_index, ch.title;
-- Expected: 1 row — order_index=19, lessons=5, quizzes=1
