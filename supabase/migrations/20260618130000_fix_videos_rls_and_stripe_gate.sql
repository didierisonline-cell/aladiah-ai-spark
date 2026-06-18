-- =============================================================================
-- FIX: videos table open SELECT policies + subscription gate alignment
--
-- Problems found:
--  1. Two overlapping SELECT policies on videos both use USING (true):
--       "Anyone can view videos"  (qual: true)
--       "Public read videos"      (qual: true)
--     → anon and any authenticated user can SELECT all video rows directly.
--
--  2. ChapterView.tsx reads profiles.tier to gate paid content, but
--     the webhook's customer.subscription.deleted and invoice.payment_failed
--     handlers only updated subscriptions.status — never profiles.tier.
--     → cancelled/past_due students kept full paid access until manual fix.
--     (The webhook fix is applied in the edge function; this migration
--      documents the RLS side of the same gate.)
--
-- Fix strategy:
--  1. Drop both world-readable SELECT policies on videos.
--  2. Add a single SECURITY-aware SELECT policy that mirrors ChapterView logic:
--       - Admins see everything (aos_is_admin()).
--       - Paid users (profiles.tier != 'starter') see all videos in
--         published courses.
--       - Starter users see ONLY videos whose chapter is order_index=0
--         inside their assigned free_course_id.
--  3. This makes server-side and client-side gating agree, so a cancelled
--     student who has profiles.tier downgraded to 'starter' (by the webhook)
--     will be blocked at both layers simultaneously.
--
-- Apply BY HAND in the Supabase SQL editor.
-- Run verification queries at the bottom before proceeding.
-- =============================================================================

-- 1. Drop both open SELECT policies
DROP POLICY IF EXISTS "Anyone can view videos" ON public.videos;
DROP POLICY IF EXISTS "Public read videos" ON public.videos;

-- 2. Paid users (tier != 'starter') can see all videos in published courses
CREATE POLICY "Paid users can view videos in published courses"
  ON public.videos
  FOR SELECT
  TO authenticated
  USING (
    public.aos_is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.chapters c ON c.id = videos.chapter_id
      JOIN public.courses co ON co.id = c.course_id
      WHERE p.user_id = auth.uid()
        AND p.tier != 'starter'
        AND co.is_published = true
    )
  );

-- 3. Starter (free) users can see only the intro chapter of their free course
CREATE POLICY "Starter users can view intro chapter videos"
  ON public.videos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.chapters c ON c.id = videos.chapter_id
      WHERE p.user_id = auth.uid()
        AND p.tier = 'starter'
        AND c.course_id = p.free_course_id
        AND c.order_index = 0
    )
  );

-- =============================================================================
-- VERIFICATION — run these after applying:
--
-- 1. No more open policies on videos:
--    SELECT policyname, cmd, qual FROM pg_policies
--    WHERE schemaname='public' AND tablename='videos';
--    → expect: no rows with qual = 'true' for SELECT
--
-- 2. Anon cannot SELECT videos:
--    SET ROLE anon;
--    SELECT count(*) FROM public.videos;
--    → expect: 0 rows or permission denied
--    RESET ROLE;
--
-- 3. Confirm new policies are present:
--    SELECT policyname FROM pg_policies
--    WHERE schemaname='public' AND tablename='videos' AND cmd='SELECT';
--    → expect:
--       "Paid users can view videos in published courses"
--       "Starter users can view intro chapter videos"
-- =============================================================================
