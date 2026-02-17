import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Lightbulb, FlaskConical, BookOpen, ArrowRight, X,
  Brain, Pause, Sparkles, AlertCircle
} from 'lucide-react';

interface SmartSidebarProps {
  isPlaying: boolean;
  progress: number;
  questionsAsked: number;
  timeOnLesson: number;
  lessonTitle: string;
  chapterTitle?: string;
  learningProfile?: {
    weakAreas: { topic: string; score: number }[];
    strongAreas: { topic: string; score: number }[];
    engagementScore: number;
    consecutiveFailures: number;
    videoRewatchCount: number;
    learningStyle: string;
    preferredDifficulty: string;
    dueReviews: { topic: string; nextReviewAt: string }[];
  };
  onPauseForLab?: () => void;
  onNavigateToLab?: () => void;
  onDismiss?: () => void;
}

interface AISuggestion {
  shouldSuggest: boolean;
  suggestion: string;
  type: 'pause_for_lab' | 'encouragement' | 'challenge' | 'review_topic';
  topic: string;
}

const SmartSidebar = ({
  isPlaying,
  progress,
  questionsAsked,
  timeOnLesson,
  lessonTitle,
  chapterTitle,
  learningProfile,
  onPauseForLab,
  onNavigateToLab,
  onDismiss,
}: SmartSidebarProps) => {
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [lastCheckProgress, setLastCheckProgress] = useState(0);

  // Check at progress milestones (every 25%)
  const checkForSuggestion = useCallback(async () => {
    if (dismissed || !isPlaying) return;

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Analyze my engagement for: ${lessonTitle}` }],
          studentContext: {
            questionsAsked,
            timeOnLesson: Math.round(timeOnLesson / 60),
            completionRate: progress,
            currentTopic: chapterTitle || lessonTitle,
            recentScores: learningProfile?.weakAreas?.map(w => w.score) || [],
            weakAreas: learningProfile?.weakAreas || [],
            strongAreas: learningProfile?.strongAreas || [],
            consecutiveFailures: learningProfile?.consecutiveFailures || 0,
            engagementScore: learningProfile?.engagementScore || 50,
            videoRewatchCount: learningProfile?.videoRewatchCount || 0,
            learningStyle: learningProfile?.learningStyle || 'balanced',
            preferredDifficulty: learningProfile?.preferredDifficulty || 'beginner',
            dueReviews: learningProfile?.dueReviews || [],
          },
          mode: 'lesson_monitor',
        }),
      });

      if (!resp.ok) return;

      // Read the streamed response fully
      const reader = resp.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') continue;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) full += content;
          } catch {}
        }
      }

      // Try parsing the full response as JSON
      try {
        const jsonMatch = full.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]) as AISuggestion;
          if (result.shouldSuggest) {
            setSuggestion(result);
          }
        }
      } catch {}
    } catch (e) {
      console.error('Smart sidebar check error:', e);
    }
  }, [dismissed, isPlaying, lessonTitle, chapterTitle, questionsAsked, timeOnLesson, progress, learningProfile]);

  // Check at 25%, 50%, 75% progress milestones
  useEffect(() => {
    const milestones = [25, 50, 75];
    const currentMilestone = milestones.find(m => progress >= m && lastCheckProgress < m);
    if (currentMilestone) {
      setLastCheckProgress(currentMilestone);
      checkForSuggestion();
    }
  }, [progress, lastCheckProgress, checkForSuggestion]);

  // Also check if student has been on lesson too long (>10 min without progress)
  useEffect(() => {
    if (timeOnLesson > 600 && progress < 30 && !suggestion && !dismissed) {
      setSuggestion({
        shouldSuggest: true,
        suggestion: "It looks like you might need a bit more background on this topic. Would you like to review the lab materials first?",
        type: 'pause_for_lab',
        topic: chapterTitle || lessonTitle,
      });
    }
  }, [timeOnLesson, progress, suggestion, dismissed, chapterTitle, lessonTitle]);

  const handleDismiss = () => {
    setSuggestion(null);
    setDismissed(true);
    onDismiss?.();
  };

  const handleAction = () => {
    if (suggestion?.type === 'pause_for_lab') {
      onPauseForLab?.();
    } else if (suggestion?.type === 'review_topic') {
      onNavigateToLab?.();
    }
    setSuggestion(null);
  };

  const getIcon = () => {
    switch (suggestion?.type) {
      case 'pause_for_lab': return <FlaskConical className="w-5 h-5 text-primary" />;
      case 'encouragement': return <Sparkles className="w-5 h-5 text-accent" />;
      case 'challenge': return <Brain className="w-5 h-5 text-secondary" />;
      case 'review_topic': return <BookOpen className="w-5 h-5 text-primary" />;
      default: return <Lightbulb className="w-5 h-5 text-accent" />;
    }
  };

  const getActionLabel = () => {
    switch (suggestion?.type) {
      case 'pause_for_lab': return 'Open Lab';
      case 'review_topic': return 'Review Topic';
      case 'challenge': return 'Try Challenge';
      default: return 'Got it!';
    }
  };

  return (
    <AnimatePresence>
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          className="fixed bottom-24 right-4 z-50 max-w-xs"
        >
          <Card className="p-4 shadow-lg border-primary/20 bg-background/95 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-primary flex items-center gap-1">
                    <Brain className="w-3 h-3" /> AI Assistant
                  </p>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm text-foreground mb-3">{suggestion.suggestion}</p>
                {suggestion.topic && (
                  <p className="text-xs text-muted-foreground mb-2">
                    📚 Topic: {suggestion.topic}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs gap-1" onClick={handleAction}>
                    {getActionLabel()} <ArrowRight className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={handleDismiss}>
                    Later
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartSidebar;
