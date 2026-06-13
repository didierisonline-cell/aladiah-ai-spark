-- =============================================================================
-- Founder review access for quiz_questions — additive, NON-DESTRUCTIVE.
-- The Question Review Queue (Founder Portal) runs client-side under the founder
-- session, so the founder needs to SELECT drafts and UPDATE their workflow
-- status directly. The existing "No direct access to quiz questions" deny-SELECT
-- policy is LEFT IN PLACE — RLS is permissive (OR across policies), so students
-- still match only USING(false) and remain fully blocked from direct reads
-- (they receive questions via get_exam_questions + submit-quiz only).
-- Requires public.aos_is_admin() (20260610110000_aos_is_admin_helper.sql).
-- Apply BY HAND in the Supabase SQL editor.
-- =============================================================================

-- Founders/admins can read every question (drafts included) for the review queue.
DROP POLICY IF EXISTS "admin read quiz questions" ON public.quiz_questions;
CREATE POLICY "admin read quiz questions" ON public.quiz_questions
  FOR SELECT USING (public.aos_is_admin());

-- Founders/admins can update the review workflow (status, reviewer/approver,
-- timestamps, version). Students have no UPDATE policy, so they cannot write.
DROP POLICY IF EXISTS "admin update quiz questions" ON public.quiz_questions;
CREATE POLICY "admin update quiz questions" ON public.quiz_questions
  FOR UPDATE USING (public.aos_is_admin()) WITH CHECK (public.aos_is_admin());

-- VERIFICATION:
-- SELECT policyname, cmd FROM pg_policies
-- WHERE schemaname='public' AND tablename='quiz_questions' ORDER BY cmd;
-- Expect: SELECT (deny-false + admin read), UPDATE (admin update).
