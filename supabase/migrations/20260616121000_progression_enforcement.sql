-- =============================================================================
-- Server-side progression enforcement — STAGE 1 (additive, safe to apply alone).
-- Apply BY HAND in the Supabase SQL editor.
--
-- PROBLEM: the only SELECT policy on public.videos is "course is published", which
-- lets any caller read EVERY video row of a published course — including video_url —
-- regardless of progression. public.can_access_video()/user_passed_quiz() already
-- encode the unlock rules (sequential lessons + prior-quiz pass + chapter order) but
-- NO policy calls them, so today progression is enforced only in the frontend.
--
-- WHY STAGED: ChapterView lists ALL videos of a chapter (incl. video_url) to render
-- the lesson list. Slapping can_access_video() onto the videos SELECT policy would
-- hide locked rows and break that list. The safe pattern separates LIST metadata
-- (safe to show, no URL) from the protected PAYLOAD (video_url, must be gated):
--
--   • public.video_list           — url-free listing view (titles/order only)
--   • public.get_video_playback() — returns video_url ONLY if the caller may access
--                                    the video (can_access_video) or is a founder.
--
-- STAGE 1 (this file) is purely ADDITIVE — it changes no existing policy, so the app
-- keeps working after apply. STAGE 2 (separate migration, below) locks the base
-- videos table once the client uses the view + RPC.
-- Requires public.can_access_video(), public.aos_is_admin().
-- =============================================================================

-- 1) URL-free listing view (safe for lesson lists; exposes no playable URL).
CREATE OR REPLACE VIEW public.video_list AS
  SELECT v.id, v.chapter_id, v.title, v.description, v.order_index,
         v.duration_seconds, v.translations
  FROM public.videos v
  JOIN public.chapters c ON c.id = v.chapter_id
  JOIN public.courses  co ON co.id = c.course_id
  WHERE co.is_published = true;

GRANT SELECT ON public.video_list TO anon, authenticated;

-- 2) Gated playback resolver — the ONLY way to obtain video_url.
--    Returns the row (with URL) only when the caller is allowed to access it.
CREATE OR REPLACE FUNCTION public.get_video_playback(p_video_id uuid)
RETURNS TABLE (id uuid, chapter_id uuid, title text, video_url text, order_index int)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Founder/admin bypass for previewing any lesson.
  IF public.aos_is_admin() THEN
    RETURN QUERY
      SELECT v.id, v.chapter_id, v.title, v.video_url, v.order_index
      FROM public.videos v WHERE v.id = p_video_id;
    RETURN;
  END IF;

  -- Students: only if progression rules grant access to THIS video.
  IF public.can_access_video(auth.uid(), p_video_id) THEN
    RETURN QUERY
      SELECT v.id, v.chapter_id, v.title, v.video_url, v.order_index
      FROM public.videos v WHERE v.id = p_video_id;
    RETURN;
  END IF;

  -- Otherwise return nothing (locked).
  RETURN;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_video_playback(uuid) TO anon, authenticated;

-- =============================================================================
-- STAGE 2 — APPLY ONLY AFTER the client is migrated (see hardening doc):
--   • lesson lists read public.video_list (no URL)
--   • the player fetches the URL via public.get_video_playback(video_id)
-- Then lock the base table so video_url can never be fetched directly:
--
--   DROP POLICY IF EXISTS "Users can view accessible videos" ON public.videos;
--   CREATE POLICY "Admins can view videos" ON public.videos
--     FOR SELECT USING (public.aos_is_admin());
--   -- (students no longer SELECT videos directly; they use the view + RPC)
--
-- Do NOT apply Stage 2 until the client no longer reads public.videos directly,
-- and verify on a branch/staging DB first.
-- =============================================================================

-- VERIFICATION (Stage 1):
--   -- a locked, non-first video returns 0 rows for a student who hasn't unlocked it:
--   SELECT * FROM public.get_video_playback('<locked-video-uuid>');   -- expect 0 rows
--   -- the first lesson (order 0 / chapter 0) returns the row:
--   SELECT * FROM public.get_video_playback('<first-video-uuid>');    -- expect 1 row
--   -- listing works without exposing a URL:
--   SELECT id, title FROM public.video_list LIMIT 5;                  -- no video_url column
