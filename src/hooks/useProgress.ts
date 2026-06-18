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
        // Get all chapter_end quizzes (one per chapter = lesson completion)
        const { data: quizzes } = await supabase
          .from('quizzes')
          .select('id, chapter_id, quiz_type')
          .eq('quiz_type', 'chapter_end');

        if (!quizzes || quizzes.length === 0) {
          setProgress(0);
          setLoading(false);
          return;
        }

        // Get user's passed quizzes with scores
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('quiz_id, score')
          .eq('user_id', userId)
          .not('quiz_id', 'is', null);

        const passedIds = (progressData || []).map(p => p.quiz_id);
        const passedQuizzes = quizzes.filter(q => passedIds.includes(q.id));
        const totalQuizzes = quizzes.length;
        const passedCount = passedQuizzes.length;

        // Average score of passed CHAPTER-END quizzes only (lesson quality).
        // CRITICAL: this must be scoped to the same population as completionPct
        // (chapter_end quizzes), NOT every quiz the student ever scored. A new
        // student who scores on a non-completion quiz (e.g. the free Module-1
        // quiz) has 0 chapter completions; if avgScore drew from all quizzes,
        // `overall` became (0 + score)/2 ≈ 50% with zero completions — the
        // zero-state regression. Sharing the population guarantees:
        //   0 chapter completions ⇒ scores=[] ⇒ overall = completionPct = 0.
        const passedQuizIds = new Set(passedQuizzes.map(q => q.id));
        const scores = (progressData || [])
          .filter(p => passedQuizIds.has(p.quiz_id) && p.score != null)
          .map(p => p.score as number);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

        // Overall = 50% completion weight + 50% score weight
        const completionPct = totalQuizzes > 0 ? Math.round((passedCount / totalQuizzes) * 100) : 0;
        const overall = scores.length > 0
          ? Math.round((completionPct + avgScore) / 2)
          : completionPct;

        setProgress(overall);
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
