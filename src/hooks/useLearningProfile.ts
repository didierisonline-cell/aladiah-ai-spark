import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WeakArea {
  topic: string;
  score: number;
  lastTested: string;
  attempts: number;
}

interface StrongArea {
  topic: string;
  score: number;
  masteredAt: string;
}

interface ReviewItem {
  topic: string;
  nextReviewAt: string;
  interval: number; // days
  easeFactor: number;
  repetitions: number;
}

interface StruggleEvent {
  chapterId?: string;
  videoId?: string;
  quizId?: string;
  type: 'failed_quiz' | 'video_rewatch' | 'long_pause' | 'low_engagement';
  timestamp: string;
  details?: string;
}

export interface LearningProfile {
  id?: string;
  userId: string;
  courseId?: string;
  weakAreas: WeakArea[];
  strongAreas: StrongArea[];
  learningStyle: string;
  preferredDifficulty: string;
  avgTimePerLesson: number;
  totalQuestionsAsked: number;
  struggleEvents: StruggleEvent[];
  consecutiveFailures: number;
  lastStruggleTopic: string | null;
  needsIntervention: boolean;
  reviewQueue: ReviewItem[];
  lastReviewAt: string | null;
  engagementScore: number;
  quizAccuracyTrend: { date: string; score: number; quizId: string }[];
  videoRewatchCount: number;
  labCompletionRate: number;
}

const DEFAULT_PROFILE: Omit<LearningProfile, 'userId'> = {
  weakAreas: [],
  strongAreas: [],
  learningStyle: 'balanced',
  preferredDifficulty: 'beginner',
  avgTimePerLesson: 0,
  totalQuestionsAsked: 0,
  struggleEvents: [],
  consecutiveFailures: 0,
  lastStruggleTopic: null,
  needsIntervention: false,
  reviewQueue: [],
  lastReviewAt: null,
  engagementScore: 50,
  quizAccuracyTrend: [],
  videoRewatchCount: 0,
  labCompletionRate: 0,
};

export const useLearningProfile = (userId: string | undefined, courseId?: string) => {
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) { setLoading(false); return; }

    let query = supabase
      .from('student_learning_profiles')
      .select('*')
      .eq('user_id', userId);

    if (courseId) query = query.eq('course_id', courseId);
    else query = query.is('course_id', null);

    const { data } = await query.maybeSingle();

    if (data) {
      setProfile({
        id: data.id,
        userId: data.user_id,
        courseId: data.course_id ?? undefined,
        weakAreas: (data.weak_areas as unknown as WeakArea[]) || [],
        strongAreas: (data.strong_areas as unknown as StrongArea[]) || [],
        learningStyle: data.learning_style,
        preferredDifficulty: data.preferred_difficulty,
        avgTimePerLesson: data.avg_time_per_lesson,
        totalQuestionsAsked: data.total_questions_asked,
        struggleEvents: (data.struggle_events as unknown as StruggleEvent[]) || [],
        consecutiveFailures: data.consecutive_failures,
        lastStruggleTopic: data.last_struggle_topic,
        needsIntervention: data.needs_intervention,
        reviewQueue: (data.review_queue as unknown as ReviewItem[]) || [],
        lastReviewAt: data.last_review_at,
        engagementScore: Number(data.engagement_score),
        quizAccuracyTrend: (data.quiz_accuracy_trend as any[]) || [],
        videoRewatchCount: data.video_rewatch_count,
        labCompletionRate: Number(data.lab_completion_rate),
      });
    } else {
      // Create a default profile
      const newProfile = {
        user_id: userId,
        course_id: courseId || null,
      };
      const { data: created } = await supabase
        .from('student_learning_profiles')
        .insert(newProfile)
        .select()
        .single();

      if (created) {
        setProfile({ ...DEFAULT_PROFILE, userId, courseId, id: created.id });
      }
    }
    setLoading(false);
  }, [userId, courseId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // Record a struggle event
  const recordStruggle = useCallback(async (event: Omit<StruggleEvent, 'timestamp'>) => {
    if (!profile?.id || !userId) return;
    const newEvent: StruggleEvent = { ...event, timestamp: new Date().toISOString() };
    const updatedEvents = [...profile.struggleEvents.slice(-49), newEvent]; // keep last 50
    const consecutiveFailures = event.type === 'failed_quiz'
      ? profile.consecutiveFailures + 1 : 0;
    const needsIntervention = consecutiveFailures >= 2 || profile.engagementScore < 30;

    await supabase.from('student_learning_profiles').update({
      struggle_events: updatedEvents as any,
      consecutive_failures: consecutiveFailures,
      last_struggle_topic: event.details || profile.lastStruggleTopic,
      needs_intervention: needsIntervention,
    }).eq('id', profile.id);

    setProfile(p => p ? {
      ...p,
      struggleEvents: updatedEvents,
      consecutiveFailures,
      lastStruggleTopic: event.details || p.lastStruggleTopic,
      needsIntervention,
    } : p);
  }, [profile, userId]);

  // Record quiz result & update spaced repetition
  const recordQuizResult = useCallback(async (quizId: string, score: number, topic: string) => {
    if (!profile?.id || !userId) return;

    const trend = [...profile.quizAccuracyTrend.slice(-29), { date: new Date().toISOString(), score, quizId }];
    const isWeak = score < 70;
    const isStrong = score >= 90;

    // Update weak/strong areas
    let weakAreas = [...profile.weakAreas];
    let strongAreas = [...profile.strongAreas];

    if (isWeak) {
      const existing = weakAreas.find(w => w.topic === topic);
      if (existing) {
        existing.score = score;
        existing.lastTested = new Date().toISOString();
        existing.attempts += 1;
      } else {
        weakAreas.push({ topic, score, lastTested: new Date().toISOString(), attempts: 1 });
      }
      strongAreas = strongAreas.filter(s => s.topic !== topic);
    } else if (isStrong) {
      weakAreas = weakAreas.filter(w => w.topic !== topic);
      if (!strongAreas.find(s => s.topic === topic)) {
        strongAreas.push({ topic, score, masteredAt: new Date().toISOString() });
      }
    }

    // Spaced repetition: schedule review for weak topics
    let reviewQueue = [...profile.reviewQueue];
    if (isWeak) {
      const existing = reviewQueue.find(r => r.topic === topic);
      if (existing) {
        // SM-2 algorithm simplified: decrease interval on failure
        existing.interval = Math.max(1, Math.round(existing.interval * 0.5));
        existing.easeFactor = Math.max(1.3, existing.easeFactor - 0.2);
        existing.nextReviewAt = new Date(Date.now() + existing.interval * 86400000).toISOString();
      } else {
        reviewQueue.push({
          topic,
          nextReviewAt: new Date(Date.now() + 86400000).toISOString(), // tomorrow
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
        });
      }
    } else if (isStrong) {
      const existing = reviewQueue.find(r => r.topic === topic);
      if (existing) {
        existing.repetitions += 1;
        existing.interval = Math.round(existing.interval * existing.easeFactor);
        existing.easeFactor = Math.min(3.0, existing.easeFactor + 0.1);
        existing.nextReviewAt = new Date(Date.now() + existing.interval * 86400000).toISOString();
      }
    }

    // Difficulty adjustment
    const recentScores = trend.slice(-5).map(t => t.score);
    const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    let difficulty = profile.preferredDifficulty;
    if (avgRecent >= 85) difficulty = 'advanced';
    else if (avgRecent >= 60) difficulty = 'intermediate';
    else difficulty = 'beginner';

    await supabase.from('student_learning_profiles').update({
      quiz_accuracy_trend: trend as any,
      weak_areas: weakAreas as any,
      strong_areas: strongAreas as any,
      review_queue: reviewQueue as any,
      preferred_difficulty: difficulty,
      consecutive_failures: isWeak ? profile.consecutiveFailures + 1 : 0,
    }).eq('id', profile.id);

    setProfile(p => p ? {
      ...p,
      quizAccuracyTrend: trend,
      weakAreas,
      strongAreas,
      reviewQueue,
      preferredDifficulty: difficulty,
      consecutiveFailures: isWeak ? p.consecutiveFailures + 1 : 0,
    } : p);
  }, [profile, userId]);

  // Record video rewatch
  const recordRewatch = useCallback(async (videoId: string) => {
    if (!profile?.id) return;
    const count = profile.videoRewatchCount + 1;
    await supabase.from('student_learning_profiles').update({ video_rewatch_count: count }).eq('id', profile.id);
    setProfile(p => p ? { ...p, videoRewatchCount: count } : p);
  }, [profile]);

  // Update engagement score
  const updateEngagement = useCallback(async (delta: number) => {
    if (!profile?.id) return;
    const newScore = Math.max(0, Math.min(100, profile.engagementScore + delta));
    await supabase.from('student_learning_profiles').update({ engagement_score: newScore }).eq('id', profile.id);
    setProfile(p => p ? { ...p, engagementScore: newScore } : p);
  }, [profile]);

  // Increment question count
  const recordQuestion = useCallback(async () => {
    if (!profile?.id) return;
    const count = profile.totalQuestionsAsked + 1;
    await supabase.from('student_learning_profiles').update({ total_questions_asked: count }).eq('id', profile.id);
    setProfile(p => p ? { ...p, totalQuestionsAsked: count } : p);
  }, [profile]);

  // Get topics due for review
  const getDueReviews = useCallback((): ReviewItem[] => {
    if (!profile) return [];
    const now = new Date().toISOString();
    return profile.reviewQueue.filter(r => r.nextReviewAt <= now);
  }, [profile]);

  return {
    profile,
    loading,
    recordStruggle,
    recordQuizResult,
    recordRewatch,
    updateEngagement,
    recordQuestion,
    getDueReviews,
    refreshProfile: fetchProfile,
  };
};
