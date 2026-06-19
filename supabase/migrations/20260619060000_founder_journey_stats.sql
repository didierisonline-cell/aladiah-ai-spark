-- ============================================================================
-- Founder student-journey analytics — admin-only AGGREGATE RPC (no PII).
-- Apply by hand in Supabase (Claude Code does not auto-apply).
--
-- WHY THIS EXISTS: user_progress / quiz_attempts are owner-only RLS (the #25
-- lockdown) — correct and secure, but it means the founder's browser client
-- cannot read aggregate funnel data. This SECURITY DEFINER function returns ONLY
-- aggregate counts (never individual rows / PII) and is guarded to admins via
-- public.aos_is_admin(). The Student Journey Truth dashboard calls it; until this
-- is applied the dashboard honestly shows "analytics RPC not installed".
-- ============================================================================
CREATE OR REPLACE FUNCTION public.founder_journey_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE cid uuid; result jsonb;
BEGIN
  IF NOT public.aos_is_admin() THEN
    RAISE EXCEPTION 'founder_journey_stats: admin only';
  END IF;

  SELECT id INTO cid FROM public.courses WHERE is_flagship ORDER BY created_at LIMIT 1;
  IF cid IS NULL THEN RETURN jsonb_build_object('flagship_id', NULL); END IF;

  SELECT jsonb_build_object(
    'flagship_id', cid,
    'flagship_title', (SELECT title FROM public.courses WHERE id = cid),
    -- distinct students with ANY progress row on the flagship (engagement proxy;
    -- there is no separate enrollments table)
    'engaged_students', (SELECT count(DISTINCT user_id) FROM public.user_progress WHERE course_id = cid),
    -- distinct students who completed at least one lesson (video) on the flagship
    'students_any_lesson', (
      SELECT count(DISTINCT up.user_id) FROM public.user_progress up
      JOIN public.videos v ON v.id = up.video_id
      JOIN public.chapters c ON c.id = v.chapter_id WHERE c.course_id = cid),
    -- distinct students who passed at least one chapter_end quiz on the flagship
    'students_any_quiz_pass', (
      SELECT count(DISTINCT up.user_id) FROM public.user_progress up
      JOIN public.quizzes q ON q.id = up.quiz_id
      JOIN public.chapters c ON c.id = q.chapter_id
      WHERE c.course_id = cid AND up.passed IS TRUE),
    -- total quiz attempts recorded on the flagship
    'quiz_attempts', (
      SELECT count(*) FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      JOIN public.chapters c ON c.id = q.chapter_id WHERE c.course_id = cid),
    'quiz_attempts_passed', (
      SELECT count(*) FROM public.quiz_attempts qa
      JOIN public.quizzes q ON q.id = qa.quiz_id
      JOIN public.chapters c ON c.id = q.chapter_id WHERE c.course_id = cid AND qa.passed IS TRUE),
    -- per-module funnel: distinct students who passed each module's chapter_end quiz
    'per_module', (
      SELECT COALESCE(jsonb_agg(m ORDER BY (m->>'module')::int), '[]'::jsonb) FROM (
        SELECT jsonb_build_object(
          'module', c.order_index,
          'passed_students', (
            SELECT count(DISTINCT up.user_id) FROM public.user_progress up
            WHERE up.chapter_id = c.id AND up.passed IS TRUE)
        ) AS m
        FROM public.chapters c WHERE c.course_id = cid
      ) s)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.founder_journey_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_journey_stats() TO authenticated;

-- VERIFICATION (run as the founder, signed in):
--   SELECT public.founder_journey_stats();   -- expect a jsonb object; admin-only
--   -- as a non-admin it must RAISE 'admin only'.
