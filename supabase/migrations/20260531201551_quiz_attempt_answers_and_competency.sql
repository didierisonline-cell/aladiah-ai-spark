-- =============================================================================
-- Part 3 / Phase 1 — Data capture for the Prof. Didier intelligence layer
-- =============================================================================
-- Adds the RAW per-question grain that analytics needs, plus the competency tag
-- home that quiz_questions currently lacks. SCHEMA ONLY — no write-path wiring,
-- no data backfill, no enum changes (the 'final_exam' tier + chapter_id NOT NULL
-- resolution belong to the Final Exam feature build, not here).
--
-- Written ADDITIVELY / IDEMPOTENTLY (IF NOT EXISTS, ADD COLUMN IF NOT EXISTS,
-- DROP POLICY IF EXISTS before CREATE) because migration files are known to have
-- drifted from the live DB (e.g. user_progress.score/passed exist live but not in
-- the original migration). Safe to run against the live schema and to re-run.
--
-- Scope:
--   1) child table public.quiz_attempt_answers (one row per question per attempt)
--   2) public.quiz_questions += competency TEXT, topic TEXT
--   3) indexes + owner-scoped RLS (via parent quiz_attempts)
--   4) verification SELECTs at the bottom (run after; they do not mutate)
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1) Per-question results child table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempt_answers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id     UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  -- keep the answer row for analytics even if the source question is later deleted
  question_id    UUID REFERENCES public.quiz_questions(id) ON DELETE SET NULL,
  selected_index INTEGER,                       -- nullable: allows an unanswered/skipped question
  correct_index  INTEGER NOT NULL,
  is_correct     BOOLEAN NOT NULL DEFAULT false,
  -- competency SNAPSHOT copied from quiz_questions at submit time, so historical
  -- rollups survive later edits to the question's tag or random-subset draws.
  competency     TEXT,
  created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Backfill-safe column adds (no-ops on a fresh CREATE above; guard against an
-- earlier partial/hand-applied version of this table on the live DB).
ALTER TABLE public.quiz_attempt_answers ADD COLUMN IF NOT EXISTS attempt_id     UUID;
ALTER TABLE public.quiz_attempt_answers ADD COLUMN IF NOT EXISTS question_id    UUID;
ALTER TABLE public.quiz_attempt_answers ADD COLUMN IF NOT EXISTS selected_index INTEGER;
ALTER TABLE public.quiz_attempt_answers ADD COLUMN IF NOT EXISTS correct_index  INTEGER;
ALTER TABLE public.quiz_attempt_answers ADD COLUMN IF NOT EXISTS is_correct     BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.quiz_attempt_answers ADD COLUMN IF NOT EXISTS competency     TEXT;
ALTER TABLE public.quiz_attempt_answers ADD COLUMN IF NOT EXISTS created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();


-- -----------------------------------------------------------------------------
-- 2) Indexes — support the core analytics access patterns
--    * by attempt (fetch all answers for one attempt)
--    * by (competency, is_correct) (roll up wrong answers per competency)
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_answers_attempt_id
  ON public.quiz_attempt_answers (attempt_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempt_answers_competency_is_correct
  ON public.quiz_attempt_answers (competency, is_correct);


-- -----------------------------------------------------------------------------
-- 3) Row Level Security — owner-scoped via the parent quiz_attempts row.
--    quiz_attempt_answers has no user_id of its own; ownership is derived from
--    the attempt. Mirrors quiz_attempts (SELECT / INSERT / UPDATE; no DELETE).
--    Cross-user aggregation for the intelligence layer runs server-side with the
--    service role, which bypasses RLS (same pattern as admin-analytics).
-- -----------------------------------------------------------------------------
ALTER TABLE public.quiz_attempt_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own attempt answers" ON public.quiz_attempt_answers;
CREATE POLICY "Users can view own attempt answers" ON public.quiz_attempt_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.id = quiz_attempt_answers.attempt_id
        AND qa.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create own attempt answers" ON public.quiz_attempt_answers;
CREATE POLICY "Users can create own attempt answers" ON public.quiz_attempt_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.id = quiz_attempt_answers.attempt_id
        AND qa.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own attempt answers" ON public.quiz_attempt_answers;
CREATE POLICY "Users can update own attempt answers" ON public.quiz_attempt_answers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.id = quiz_attempt_answers.attempt_id
        AND qa.user_id = auth.uid()
    )
  );


-- -----------------------------------------------------------------------------
-- 4) Competency tag home on the questions themselves (source of truth).
--    TEXT (not an enum) so it scales across courses with different competency
--    sets (e.g. Scrum's three areas vs. AI Mastery). Nullable; backfilled later.
-- -----------------------------------------------------------------------------
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS competency TEXT;
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS topic      TEXT;


-- =============================================================================
-- VERIFICATION (run AFTER applying; read-only, mutates nothing)
-- =============================================================================

-- (a) New child table exists with the expected columns + types.
--     EXPECT 8 rows: attempt_id(uuid), competency(text), correct_index(integer),
--     created_at(timestamptz), id(uuid), is_correct(boolean),
--     question_id(uuid), selected_index(integer).
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'quiz_attempt_answers'
-- ORDER BY column_name;

-- (b) New columns exist on quiz_questions.
--     EXPECT 2 rows: competency (text), topic (text).
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'quiz_questions'
--   AND column_name IN ('competency', 'topic')
-- ORDER BY column_name;

-- (c) RLS is enabled and the three owner-scoped policies are present.
--     EXPECT relrowsecurity = true.
-- SELECT relname, relrowsecurity
-- FROM pg_class
-- WHERE oid = 'public.quiz_attempt_answers'::regclass;
--
--     EXPECT 3 rows: the SELECT / INSERT / UPDATE policies below.
-- SELECT policyname, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public' AND tablename = 'quiz_attempt_answers'
-- ORDER BY policyname;

-- (d) Indexes are present.
--     EXPECT idx_quiz_attempt_answers_attempt_id
--        and idx_quiz_attempt_answers_competency_is_correct.
-- SELECT indexname
-- FROM pg_indexes
-- WHERE schemaname = 'public' AND tablename = 'quiz_attempt_answers'
-- ORDER BY indexname;
-- =============================================================================
