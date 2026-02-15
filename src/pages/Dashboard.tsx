import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProgress, getProgressColor } from '@/hooks/useProgress';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  GraduationCap, BookOpen, Trophy, Flame, ArrowRight,
  Clock, Target, TrendingUp, Play, LogOut, CheckCircle
} from 'lucide-react';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';
import Header from '@/components/Header';
import {
  courseUITranslations,
  getTranslatedContent,
  type SupportedLanguage
} from '@/utils/courseTranslations';

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  totalVideos: number;
  completedVideos: number;
  nextChapterId: string | null;
  nextChapterTitle: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { progress: overallProgress } = useProgress(user?.id);

  const [courseProgresses, setCourseProgresses] = useState<CourseProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const [quizzesCompleted, setQuizzesCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  const supportedLanguages: SupportedLanguage[] = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja'];
  const currentLang = supportedLanguages.includes(language as SupportedLanguage)
    ? (language as SupportedLanguage)
    : 'en';
  const t = courseUITranslations[currentLang];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    if (user) loadDashboard();
  }, [user, authLoading]);

  const loadDashboard = async () => {
    try {
      // Load courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, translations')
        .eq('is_published', true);

      // Load chapters
      const { data: chapters } = await supabase
        .from('chapters')
        .select('id, title, course_id, order_index, translations')
        .order('order_index');

      // Load videos
      const { data: videos } = await supabase
        .from('videos')
        .select('id, chapter_id, order_index')
        .order('order_index');

      // Load quizzes
      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('id, video_id, chapter_id, quiz_type');

      // Load user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('quiz_id, completed_at')
        .not('quiz_id', 'is', null);

      const passedQuizIds = (progressData || []).map(p => p.quiz_id as string);
      setQuizzesCompleted(passedQuizIds.length);

      // Calculate streak from completion dates
      const dates = (progressData || [])
        .map(p => new Date(p.completed_at).toDateString())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streakCount = 0;
      const today = new Date();
      for (let i = 0; i < dates.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i);
        if (dates[i] === expected.toDateString()) {
          streakCount++;
        } else break;
      }
      setStreak(streakCount);

      // Build per-course progress
      const progresses: CourseProgress[] = (courses || []).map(course => {
        const content = getTranslatedContent(course.translations as any, currentLang, course.title, '');
        const courseChapters = (chapters || []).filter(ch => ch.course_id === course.id);
        const courseVideos = (videos || []).filter(v =>
          courseChapters.some(ch => ch.id === v.chapter_id)
        );
        const miniQuizzes = (quizzes || []).filter(q =>
          courseVideos.some(v => v.id === q.video_id) && q.quiz_type === 'mini_video'
        );
        const completedMiniQuizzes = miniQuizzes.filter(q => passedQuizIds.includes(q.id));

        // Find next incomplete chapter
        let nextChapter: any = null;
        for (const ch of courseChapters) {
          const chVideos = courseVideos.filter(v => v.chapter_id === ch.id);
          const chQuizzes = miniQuizzes.filter(q => chVideos.some(v => v.id === q.video_id));
          const allPassed = chQuizzes.every(q => passedQuizIds.includes(q.id));
          if (!allPassed) {
            nextChapter = ch;
            break;
          }
        }

        return {
          courseId: course.id,
          courseTitle: content.title,
          totalVideos: courseVideos.length,
          completedVideos: completedMiniQuizzes.length,
          nextChapterId: nextChapter?.id || courseChapters[0]?.id || null,
          nextChapterTitle: nextChapter
            ? getTranslatedContent(nextChapter.translations as any, currentLang, nextChapter.title, '').title
            : 'All complete!',
        };
      });

      setCourseProgresses(progresses);
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GraduationCap className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  const progressColor = getProgressColor(overallProgress);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-1">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground">Here's your learning snapshot.</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, label: 'Overall Progress', value: `${overallProgress}%`, color: progressColor },
            { icon: Flame, label: 'Day Streak', value: `${streak}`, color: streak > 0 ? 'hsl(15, 85%, 60%)' : undefined },
            { icon: Trophy, label: 'Quizzes Passed', value: `${quizzesCompleted}`, color: 'hsl(42, 95%, 55%)' },
            { icon: Target, label: 'Courses', value: `${courseProgresses.length}`, color: undefined },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <stat.icon className="w-5 h-5" style={stat.color ? { color: stat.color } : undefined} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold" style={stat.color ? { color: stat.color } : undefined}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Course Progress Cards */}
        <h2 className="text-xl font-display font-bold mb-4">Your Courses</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {courseProgresses.map((cp, i) => {
            const pct = cp.totalVideos > 0 ? Math.round((cp.completedVideos / cp.totalVideos) * 100) : 0;
            return (
              <motion.div key={cp.courseId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <Card className="overflow-hidden hover:shadow-medium transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {cp.courseTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Progress value={pct} className="h-2 flex-1" />
                      <span className="text-sm font-semibold text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {pct === 100 ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            Complete!
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            Next: {cp.nextChapterTitle}
                          </>
                        )}
                      </div>
                      {cp.nextChapterId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => navigate(`/course/${cp.courseId}/chapter/${cp.nextChapterId}`)}
                        >
                          Continue <ArrowRight className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-display font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'All Courses', path: '/courses', icon: BookOpen },
            { label: 'Community', path: '/community', icon: Target },
            { label: 'Sprint Simulation', path: '/simulation', icon: Flame },
            { label: 'Feedback', path: '/feedback', icon: Trophy },
          ].map((action, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }}>
              <Card
                className="p-4 cursor-pointer hover:shadow-soft hover:border-primary/30 transition-all text-center"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">{action.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
