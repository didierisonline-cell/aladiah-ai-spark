-- =============================================================================
-- Quiz question bank — additive, NON-DESTRUCTIVE.
-- Adds competency/topic to quiz_questions (you require them), a quiz_id index,
-- and a SECURITY DEFINER random-serve function that returns N questions WITHOUT
-- the answer key (the answer is graded server-side by submit-quiz).
-- Nothing is dropped or deleted. Apply BY HAND in the Supabase SQL editor.
-- =============================================================================

ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS competency text;
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS topic text;
-- optional difficulty bucketing (safe, nullable)
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS difficulty text;

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON public.quiz_questions(quiz_id);

-- Random serve: N questions for a quiz, WITHOUT correct_answer_index.
-- Used by the exam UI to serve 20 random questions per attempt.
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
  ORDER BY random()
  LIMIT GREATEST(1, LEAST(p_count, 200));
$$;

GRANT EXECUTE ON FUNCTION public.get_exam_questions(uuid, int) TO authenticated, anon;

-- VERIFICATION:
-- SELECT * FROM public.get_exam_questions('<chapter_end_quiz_id>', 20);  -- 20 random, no answers
