-- =============================================================================
-- Assessment workflow metadata — additive, NON-DESTRUCTIVE.
-- Adds an authoring/review/approval lifecycle to quiz_questions so a question
-- bank can move draft -> reviewed -> approved before it is served live.
-- Every column is ADD COLUMN IF NOT EXISTS with a safe default; nothing is
-- dropped, renamed, or deleted, and existing rows/courses are untouched.
-- Apply BY HAND in the Supabase SQL editor.
-- =============================================================================

-- Lifecycle state. Existing rows default to 'approved' so live courses keep
-- serving exactly as before (no behavioural change); newly generated questions
-- should be inserted as 'draft' and promoted after human review.
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

-- Reviewer / approver provenance (free-text email or user id; nullable).
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS reviewed_by text;
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS approved_by text;
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS approved_at timestamptz;

-- Monotonic version for edit tracking; existing rows start at 1.
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS version int NOT NULL DEFAULT 1;

-- Constrain status to the known lifecycle values (additive; guarded so re-runs
-- don't error). draft -> in_review -> approved, plus an archived terminal state
-- that keeps a question out of the live pool without deleting it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'quiz_questions_status_chk'
  ) THEN
    ALTER TABLE public.quiz_questions
      ADD CONSTRAINT quiz_questions_status_chk
      CHECK (status IN ('draft', 'in_review', 'approved', 'archived'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_quiz_questions_status ON public.quiz_questions(quiz_id, status);

-- get_exam_questions now serves only APPROVED questions, so draft/in_review/
-- archived items never reach a student. Existing rows defaulted to 'approved'
-- above, so currently-live quizzes are unaffected. Signature unchanged.
CREATE OR REPLACE FUNCTION public.get_exam_questions(p_quiz_id uuid, p_count int DEFAULT 20)
RETURNS TABLE (
  id uuid, question_text text, scenario_context text, options jsonb,
  order_index int, competency text, topic text, difficulty text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT qq.id, qq.question_text, qq.scenario_context, qq.options::jsonb,
         qq.order_index, qq.competency, qq.topic, qq.difficulty
  FROM public.quiz_questions qq
  WHERE qq.quiz_id = p_quiz_id
    AND qq.status = 'approved'
  ORDER BY random()
  LIMIT GREATEST(1, LEAST(p_count, 200));
$$;

GRANT EXECUTE ON FUNCTION public.get_exam_questions(uuid, int) TO authenticated, anon;

-- VERIFICATION:
-- SELECT status, count(*) FROM public.quiz_questions GROUP BY status;     -- distribution
-- SELECT * FROM public.get_exam_questions('<chapter_end_quiz_id>', 20);   -- approved-only, no answers
