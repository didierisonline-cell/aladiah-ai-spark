import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  TrendingUp, Flame, Star, FlaskConical, CheckCircle, Clock,
  BookOpen, Target, AlertTriangle, Trophy, Calendar
} from 'lucide-react';

interface ProgressDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  courseProgresses: any[];
  overallProgress: number;
}

export const ProgressDetailModal = ({ open, onOpenChange, userId, courseProgresses, overallProgress }: ProgressDetailProps) => {
  const { t } = useLanguage();
  const [quizHistory, setQuizHistory] = useState<any[]>([]);

  useEffect(() => {
    if (open && userId) {
      supabase
        .from('user_progress')
        .select('id, quiz_id, score, passed, completed_at')
        .eq('user_id', userId)
        .not('quiz_id', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(20)
        .then(({ data }) => setQuizHistory(data || []));
    }
  }, [open, userId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> {t('modal.progress_title')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-4xl font-bold text-primary">{overallProgress}%</p>
              <p className="text-sm text-muted-foreground">{t('modal.overall_completion')}</p>
            </div>

            <h4 className="font-semibold text-sm">{t('modal.chapter_progress')}</h4>
            {courseProgresses.map(cp => (
              <div key={cp.courseId} className="space-y-1.5 p-3 rounded-lg border">
                <div className="flex justify-between text-sm">
                  <span className="font-medium truncate max-w-[200px]">{cp.title}</span>
                  <span className="text-muted-foreground">{cp.pct}%</span>
                </div>
                <Progress value={cp.pct} className="h-2" />
                <p className="text-xs text-muted-foreground">{t('modal.lessons_completed').replace('{c}', String(cp.completed)).replace('{t}', String(cp.total))}</p>
              </div>
            ))}

            <h4 className="font-semibold text-sm mt-4">{t('modal.recent_quiz')}</h4>
            {quizHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t('modal.no_quiz')}</p>
            ) : (
              quizHistory.map(q => (
                <div key={q.id} className="flex items-center justify-between p-2 rounded border text-sm">
                  <div className="flex items-center gap-2">
                    {q.passed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                    <span>{q.passed ? t('modal.passed') : t('modal.not_passed')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={q.passed ? 'default' : 'outline'}>{q.score}%</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(q.completed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}

            {overallProgress < 50 && (
              <Card className="p-3 border-yellow-500/30 bg-yellow-500/5">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('modal.improvement')}</p>
                    <p className="text-xs text-muted-foreground">{t('modal.improvement_desc')}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

interface StreakDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  streak: number;
}

export const StreakDetailModal = ({ open, onOpenChange, userId, streak }: StreakDetailProps) => {
  const { t } = useLanguage();
  const [registeredDate, setRegisteredDate] = useState<string | null>(null);
  const [daysSinceRegistration, setDaysSinceRegistration] = useState(0);
  const [activityDays, setActivityDays] = useState(0);

  useEffect(() => {
    if (open && userId) {
      supabase
        .from('profiles')
        .select('created_at')
        .eq('user_id', userId)
        .single()
        .then(({ data }) => {
          if (data) {
            setRegisteredDate(data.created_at);
            const days = Math.floor((Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24));
            setDaysSinceRegistration(days);
          }
        });

      supabase
        .from('user_progress')
        .select('completed_at')
        .eq('user_id', userId)
        .then(({ data }) => {
          const uniqueDays = new Set((data || []).map(p => new Date(p.completed_at).toDateString()));
          setActivityDays(uniqueDays.size);
        });
    }
  }, [open, userId]);

  const consistency = daysSinceRegistration > 0 ? Math.round((activityDays / daysSinceRegistration) * 100) : 0;
  const status = consistency >= 70 ? t('modal.status_advanced') : consistency >= 40 ? t('modal.status_ontrack') : t('modal.status_attention');
  const statusColor = consistency >= 70 ? 'text-green-500' : consistency >= 40 ? 'text-primary' : 'text-yellow-500';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-secondary" /> {t('modal.activity_streak')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-secondary">{streak}</p>
              <p className="text-xs text-muted-foreground">{t('modal.current_streak')}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{daysSinceRegistration}</p>
              <p className="text-xs text-muted-foreground">{t('modal.days_since_reg')}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('modal.study_consistency')}</span>
              <span className={`text-sm font-bold ${statusColor}`}>{status}</span>
            </div>
            <Progress value={consistency} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">{t('modal.active_days').replace('{a}', String(activityDays)).replace('{d}', String(daysSinceRegistration))}</p>
          </div>

          {registeredDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{t('modal.registered')} {new Date(registeredDate).toLocaleDateString()}</span>
            </div>
          )}

          <Card className="p-3 bg-muted/50">
            <p className="text-sm">
              {consistency >= 70
                ? t('modal.streak_msg_high')
                : consistency >= 40
                ? t('modal.streak_msg_mid')
                : t('modal.streak_msg_low')}
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PointsDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  totalPoints: number;
}

export const PointsDetailModal = ({ open, onOpenChange, userId, totalPoints }: PointsDetailProps) => {
  const { t } = useLanguage();
  const [pointsBreakdown, setPointsBreakdown] = useState<any[]>([]);

  useEffect(() => {
    if (open && userId) {
      supabase
        .from('student_points')
        .select('points, reason, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
        .then(({ data }) => setPointsBreakdown(data || []));
    }
  }, [open, userId]);

  const grouped = pointsBreakdown.reduce((acc, p) => {
    acc[p.reason] = (acc[p.reason] || 0) + p.points;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" /> {t('modal.points_breakdown')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-4xl font-bold text-accent">{totalPoints}</p>
              <p className="text-xs text-muted-foreground">{t('modal.total_points')}</p>
            </div>

            {Object.keys(grouped).length > 0 && (
              <>
                <h4 className="font-semibold text-sm">{t('modal.points_by_cat')}</h4>
                {Object.entries(grouped).map(([reason, pts]) => (
                  <div key={reason} className="flex items-center justify-between p-2 rounded border text-sm">
                    <span className="capitalize">{reason.replace(/_/g, ' ')}</span>
                    <Badge variant="default">+{pts as number}</Badge>
                  </div>
                ))}
              </>
            )}

            <h4 className="font-semibold text-sm">{t('modal.recent_activity')}</h4>
            {pointsBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t('modal.no_points')}</p>
            ) : (
              pointsBreakdown.slice(0, 20).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border text-sm">
                  <div>
                    <span className="capitalize">{p.reason.replace(/_/g, ' ')}</span>
                    <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="font-bold text-accent">+{p.points}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

interface LabsDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labs: any[];
  onReenterLab: (topic: string) => void;
}

export const LabsDetailModal = ({ open, onOpenChange, labs, onReenterLab }: LabsDetailProps) => {
  const { t } = useLanguage();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" /> {t('modal.labs_history')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-3">
            {labs.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">{t('modal.no_labs')}</p>
              </div>
            ) : (
              labs.map(lab => {
                const topic = typeof lab.lab_content === 'object' && lab.lab_content.topic
                  ? lab.lab_content.topic
                  : t('modal.lab_session');
                return (
                  <div
                    key={lab.id}
                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => { onReenterLab(topic); onOpenChange(false); }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant={lab.completed ? 'default' : 'outline'}>
                        {lab.completed ? t('modal.complete') : lab.difficulty_level}
                      </Badge>
                      {lab.score > 0 && <span className="text-sm font-bold">{lab.score}%</span>}
                    </div>
                    <p className="text-sm font-medium">{topic}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(lab.created_at).toLocaleDateString()} • {t('modal.click_reenter')}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
