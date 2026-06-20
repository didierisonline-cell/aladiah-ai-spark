-- ============================================================================
-- Certificates — Phase 2: auto-issuance on course completion.
-- Apply by hand in Supabase (Claude Code does not auto-apply). Depends on
-- 20260620000000_certificates_issuance.sql (issue_certificate()).
--
-- When a student passes a chapter_end quiz, attempt to issue the course
-- certificate. issue_certificate() already enforces the completion gate (every
-- chapter_end quiz passed) and the competency snapshot, so this trigger simply
-- "tries" on every passing chapter_end quiz and succeeds only on the last one.
--
-- BEST-EFFORT: the attempt runs in an exception-safe block so a not-yet-eligible
-- result (or any error) can NEVER block the user_progress write or course
-- progress. This is the certificate eligibility integration only — it reads
-- progress and writes to certificates; it does not modify user_progress data.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.auto_issue_certificate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course        uuid;
  v_is_chapter_end boolean;
BEGIN
  -- only react to a passing quiz progress row
  IF NEW.passed IS NOT TRUE OR NEW.quiz_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- is this a chapter_end quiz, and which course is it in?
  SELECT (q.quiz_type = 'chapter_end'), c.course_id
    INTO v_is_chapter_end, v_course
    FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
   WHERE q.id = NEW.quiz_id;

  IF v_is_chapter_end IS TRUE AND v_course IS NOT NULL THEN
    BEGIN
      -- issue for THIS student (p_target_user = NEW.user_id = caller). Succeeds
      -- only once the whole course is complete; otherwise raises (swallowed).
      PERFORM public.issue_certificate(v_course, NEW.user_id);
    EXCEPTION WHEN OTHERS THEN
      NULL; -- not yet eligible / already issued / any error: never block progress
    END;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_issue_certificate ON public.user_progress;
CREATE TRIGGER trg_auto_issue_certificate
  AFTER INSERT OR UPDATE OF passed ON public.user_progress
  FOR EACH ROW
  WHEN (NEW.passed IS TRUE)
  EXECUTE FUNCTION public.auto_issue_certificate();


-- ============================================================================
-- VERIFICATION (run AFTER applying; read-only)
-- ============================================================================
-- (a) Trigger present on user_progress:
--   SELECT tgname FROM pg_trigger
--   WHERE tgrelid = 'public.user_progress'::regclass AND NOT tgisinternal;
--   -- expect trg_auto_issue_certificate
--
-- (b) End-to-end: as a student who has passed ALL but the last chapter_end quiz,
--     pass the final one, then:
--   SELECT count(*) FROM public.certificates WHERE user_id = '<student>';  -- +1
--
-- NOTE on backfill: students who already completed a course BEFORE this trigger
-- existed are not retroactively issued (no passing write fires). Issue them once,
-- explicitly, as an admin:
--   SELECT public.issue_certificate('<course_uuid>', '<user_uuid>');
--
-- ROLLBACK:
--   DROP TRIGGER IF EXISTS trg_auto_issue_certificate ON public.user_progress;
--   DROP FUNCTION IF EXISTS public.auto_issue_certificate();
-- ============================================================================
