import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  computeCanonicalProgress, EMPTY_PROGRESS, type StudentProgress,
} from '@/lib/progressModel';

// =============================================================================
// useProgress — THE single canonical progress source for every surface.
// =============================================================================
// Fetches the published lesson/chapter universe + the student's user_progress,
// then defers to the pure `computeCanonicalProgress` (src/lib/progressModel.ts)
// for the actual math. The returned object is consumed identically by
// StudentPortal, Dashboard, PortalSidebar, ProgressBar, MobileHome/MobileLearn
// and (via useTalentScore) the Talent Score surfaces — so headline progress can
// never diverge between screens again.
//
// `progress` (number) is kept as a deprecated alias of `pct` so legacy consumers
// that destructured `{ progress }` keep working and now read the canonical value.
// =============================================================================

export type { StudentProgress } from '@/lib/progressModel';

export function useProgress(userId: string | undefined): StudentProgress {
  const [state, setState] = useState<StudentProgress>({ ...EMPTY_PROGRESS, loading: true });

  useEffect(() => {
    if (!userId) { setState({ ...EMPTY_PROGRESS, loading: false }); return; }
    let cancelled = false;

    (async () => {
      try {
        // Published-course universe → its chapters → its videos (lessons).
        const { data: courses } = await supabase
          .from('courses').select('id').eq('is_published', true);
        const courseIds = (courses || []).map((c) => c.id);
        if (courseIds.length === 0) { if (!cancelled) setState({ ...EMPTY_PROGRESS, loading: false }); return; }

        const { data: chapters } = await supabase
          .from('chapters').select('id').in('course_id', courseIds);
        const chapterIds = (chapters || []).map((c) => c.id);

        const [vidsRes, quizRes, progRes] = await Promise.all([
          chapterIds.length
            ? supabase.from('videos').select('id').in('chapter_id', chapterIds)
            : Promise.resolve({ data: [] as { id: string }[] }),
          supabase.from('quizzes').select('id').eq('quiz_type', 'chapter_end'),
          supabase.from('user_progress')
            .select('video_id, quiz_id, score, completed_at')
            .eq('user_id', userId),
        ]);

        const result = computeCanonicalProgress({
          lessonIds: (vidsRes.data || []).map((v: { id: string }) => v.id),
          chapterEndQuizIds: (quizRes.data || []).map((q: { id: string }) => q.id),
          progressRows: (progRes.data || []) as any[],
        });

        if (!cancelled) setState(result);
      } catch {
        if (!cancelled) setState({ ...EMPTY_PROGRESS, loading: false });
      }
    })();

    return () => { cancelled = true; };
  }, [userId]);

  return state;
}

/**
 * Returns a color in HSL based on progress percentage.
 * 0% = sky blue (195, 85%, 60%), 100% = deep navy (215, 70%, 22%)
 */
export const getProgressColor = (progress: number): string => {
  const h = 195 + (progress / 100) * (215 - 195); // 195 -> 215
  const s = 85 + (progress / 100) * (70 - 85);     // 85 -> 70
  const l = 60 + (progress / 100) * (22 - 60);     // 60 -> 22
  return `hsl(${h}, ${s}%, ${l}%)`;
};
