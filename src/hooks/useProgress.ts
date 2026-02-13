import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProgress = (userId: string | undefined) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const calculate = async () => {
      try {
        // Get all quizzes across all published courses
        const { data: quizzes } = await supabase
          .from('quizzes')
          .select('id, chapter_id, quiz_type');

        if (!quizzes || quizzes.length === 0) {
          setProgress(0);
          setLoading(false);
          return;
        }

        // Get user's passed quizzes
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('quiz_id')
          .eq('user_id', userId)
          .not('quiz_id', 'is', null);

        const passedIds = (progressData || []).map(p => p.quiz_id);
        const totalQuizzes = quizzes.length;
        const passedCount = quizzes.filter(q => passedIds.includes(q.id)).length;

        setProgress(totalQuizzes > 0 ? Math.round((passedCount / totalQuizzes) * 100) : 0);
      } catch {
        setProgress(0);
      } finally {
        setLoading(false);
      }
    };

    calculate();
  }, [userId]);

  return { progress, loading };
};

/**
 * Returns a color in HSL based on progress percentage.
 * 0% = sky blue (195, 85%, 60%), 100% = deep navy (215, 70%, 22%)
 */
export const getProgressColor = (progress: number): string => {
  // Interpolate from sky blue to deep navy
  const h = 195 + (progress / 100) * (215 - 195); // 195 -> 215
  const s = 85 + (progress / 100) * (70 - 85);     // 85 -> 70
  const l = 60 + (progress / 100) * (22 - 60);     // 60 -> 22
  return `hsl(${h}, ${s}%, ${l}%)`;
};
