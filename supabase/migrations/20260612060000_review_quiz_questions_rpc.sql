-- =============================================================================
-- review_quiz_questions — atomic, founder-gated workflow transition RPC.
-- Performs a bulk Draft → In Review → Approved → Archived transition and stamps
-- ALL workflow metadata in one statement (reviewed_by/at on every action,
-- approved_by/at on approve, cleared on reject) and bumps `version` on reject
-- (a rejected item goes back for a new revision cycle). SECURITY DEFINER so the
-- founder check is enforced server-side (defense in depth beyond RLS).
-- Additive, NON-DESTRUCTIVE. Requires the workflow columns (20260612040000) and
-- public.aos_is_admin(). Apply BY HAND in the Supabase SQL editor.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.review_quiz_questions(
  p_ids uuid[], p_action text, p_reviewer text
) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE n integer;
BEGIN
  IF NOT public.aos_is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF p_action NOT IN ('approve','review','reject','archive') THEN
    RAISE EXCEPTION 'invalid action: %', p_action;
  END IF;
  IF p_ids IS NULL OR array_length(p_ids, 1) IS NULL THEN
    RETURN 0;
  END IF;

  UPDATE public.quiz_questions q SET
    status = CASE p_action
      WHEN 'approve' THEN 'approved'
      WHEN 'review'  THEN 'in_review'
      WHEN 'reject'  THEN 'draft'
      WHEN 'archive' THEN 'archived'
    END,
    reviewed_by = p_reviewer,
    reviewed_at = now(),
    approved_by = CASE WHEN p_action = 'approve' THEN p_reviewer
                       WHEN p_action = 'reject'  THEN NULL
                       ELSE q.approved_by END,
    approved_at = CASE WHEN p_action = 'approve' THEN now()
                       WHEN p_action = 'reject'  THEN NULL
                       ELSE q.approved_at END,
    version = CASE WHEN p_action = 'reject' THEN q.version + 1 ELSE q.version END
  WHERE q.id = ANY(p_ids);

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;

GRANT EXECUTE ON FUNCTION public.review_quiz_questions(uuid[], text, text) TO authenticated;

-- VERIFICATION:
-- SELECT public.review_quiz_questions(ARRAY['<qid>']::uuid[], 'approve', 'didier@aladiahacademy.com');
-- SELECT status, reviewed_by, reviewed_at, approved_by, approved_at, version
-- FROM public.quiz_questions WHERE id = '<qid>';
