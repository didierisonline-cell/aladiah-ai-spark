import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  GraduationCap, ArrowLeft, Play, CheckCircle, Lock, 
  ChevronRight, Trophy, AlertCircle
} from 'lucide-react';
import Quiz from '@/components/course/Quiz';
import InteractiveLessonEngine from '@/components/course/InteractiveLessonEngine';
import VideoPlayer from '@/components/course/VideoPlayer';
import { 
  courseUITranslations, 
  getTranslatedContent,
  type SupportedLanguage 
} from '@/utils/courseTranslations';

interface Course {
  id: string;
  title: string;
  translations: Record<string, { title?: string; description?: string }> | null;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  order_index: number;
  course_id: string;
  translations: Record<string, { title?: string; description?: string }> | null;
}

interface Video {
  id: string;
  title: string;
  description: string;
  chapter_id: string;
  order_index: number;
  video_url: string | null;
  translations: Record<string, { title?: string; description?: string }> | null;
}

interface QuizData {
  id: string;
  video_id: string | null;
  chapter_id: string;
  quiz_type: string;
  passing_score: number;
}

interface PassedQuiz {
  quiz_id: string;
}

const SIMULATION_COURSE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

const ChapterView = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  // Redirect simulation course chapters to the interactive simulation page
  useEffect(() => {
    if (courseId === SIMULATION_COURSE_ID) {
      navigate('/simulation', { replace: true });
    }
  }, [courseId, navigate]);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChapterQuiz, setShowChapterQuiz] = useState(false);
  const [showEngine, setShowEngine] = useState(false);

  // Get translations with fallback to English
  const supportedLanguages: SupportedLanguage[] = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja'];
  const currentLang = supportedLanguages.includes(language as SupportedLanguage) 
    ? (language as SupportedLanguage) 
    : 'en';
  const t = courseUITranslations[currentLang];

  useEffect(() => {
    loadChapterData();
  }, [chapterId]);

  const loadChapterData = async () => {
    try {
      // DEV MODE: skip auth check

      // Load course with translations
      const { data: courseData } = await supabase
        .from('courses')
        .select('id, title, translations')
        .eq('id', courseId)
        .single();
      
      setCourse(courseData as Course);

      // Load chapter with translations
      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('id, title, description, order_index, course_id, translations')
        .eq('id', chapterId)
        .single();
      
      if (chapterError) throw chapterError;
      setChapter(chapterData as Chapter);

      // Load videos with translations
      const { data: videosData } = await supabase
        .from('videos')
        .select('id, title, description, chapter_id, order_index, video_url, translations')
        .eq('chapter_id', chapterId)
        .order('order_index');
      
      setVideos((videosData || []) as Video[]);

      // Load quizzes
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('chapter_id', chapterId);
      
      setQuizzes(quizzesData || []);

      // Load passed quizzes
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('quiz_id')
        .not('quiz_id', 'is', null);
      
      setPassedQuizzes((progressData || []).map((p: PassedQuiz) => p.quiz_id));

      // Set first accessible video
      if (videosData && videosData.length > 0) {
        setCurrentVideo(videosData[0] as Video);
      }
    } catch (error: any) {
      toast({
        title: t.errorLoading,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get translated content helpers
  const getVideoContent = (video: Video) => {
    return getTranslatedContent(
      video.translations,
      currentLang,
      video.title,
      video.description || ''
    );
  };

  const getChapterContent = () => {
    if (!chapter) return { title: '', description: '' };
    return getTranslatedContent(
      chapter.translations,
      currentLang,
      chapter.title,
      chapter.description || ''
    );
  };

  const getCourseContent = () => {
    if (!course) return { title: '', description: '' };
    return getTranslatedContent(
      course.translations,
      currentLang,
      course.title,
      ''
    );
  };

  const isVideoAccessible = (_video: Video) => {
    return true; // DEV MODE: all videos unlocked
  };

  const isVideoPassed = (video: Video) => {
    const quiz = quizzes.find(q => q.video_id === video.id);
    return quiz ? passedQuizzes.includes(quiz.id) : false;
  };

  const allMiniQuizzesPassed = () => {
    const miniQuizzes = quizzes.filter(q => q.quiz_type === 'mini_video');
    return miniQuizzes.every(q => passedQuizzes.includes(q.id));
  };

  const handleVideoComplete = () => {
    if (!currentVideo) return;
    
    const quiz = quizzes.find(q => q.video_id === currentVideo.id);
    if (quiz) {
      setCurrentQuiz(quiz);
      setShowQuiz(true);
    } else {
      // No quiz exists - show message to user
      toast({
        title: t.quizNotAvailable,
        description: t.quizPreparing,
        variant: 'default',
      });
    }
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed && currentQuiz) {
      setPassedQuizzes([...passedQuizzes, currentQuiz.id]);
      
      // Move to next video if available
      const nextVideo = videos.find(v => v.order_index === (currentVideo?.order_index || 0) + 1);
      if (nextVideo) {
        setTimeout(() => {
          setCurrentVideo(nextVideo);
          setShowQuiz(false);
          setCurrentQuiz(null);
        }, 2000);
      } else {
        setShowQuiz(false);
        setCurrentQuiz(null);
      }
    }
  };

  const handleChapterQuizComplete = (passed: boolean) => {
    if (passed) {
      toast({
        title: t.chapterComplete,
        description: t.congratsNextChapter,
      });
      setTimeout(() => navigate('/courses'), 2000);
    }
  };

  const startChapterQuiz = () => {
    const chapterQuiz = quizzes.find(q => q.quiz_type === 'chapter_end');
    if (chapterQuiz) {
      setCurrentQuiz(chapterQuiz);
      setShowChapterQuiz(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GraduationCap className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (showQuiz || showChapterQuiz) {
    return (
      <Quiz 
        quizId={currentQuiz?.id || ''} 
        quizType={showChapterQuiz ? 'chapter_end' : 'mini_video'}
        onComplete={showChapterQuiz ? handleChapterQuizComplete : handleQuizComplete}
        onBack={() => {
          setShowQuiz(false);
          setShowChapterQuiz(false);
          setCurrentQuiz(null);
        }}
      />
    );
  }

  const progress = videos.length > 0 
    ? Math.round((videos.filter(v => isVideoPassed(v)).length / videos.length) * 100)
    : 0;

  const chapterContent = getChapterContent();
  const courseContent = getCourseContent();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t.backToCourses}
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-display font-bold">Aladiah Academy</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {currentVideo ? (
                <VideoPlayer
                  videoId={currentVideo.id}
                  title={getVideoContent(currentVideo).title}
                  description={getVideoContent(currentVideo).description}
                  orderIndex={currentVideo.order_index}
                  onComplete={handleVideoComplete}
                  isCompleted={isVideoPassed(currentVideo)}
                  courseTitle={courseContent.title}
                  chapterTitle={chapterContent.title}
                />
              ) : (
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">{t.selectVideo}</p>
                  </div>
                </Card>
              )}

              {/* Interactive Lesson Engine Toggle */}
              <div className="mt-4">
                <button
                  onClick={() => setShowEngine(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                  style={{ background: showEngine ? 'linear-gradient(135deg,#1e3a8a,#2563eb)' : 'rgba(30,58,138,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>🎓</span>
                    <span>{showEngine ? 'Hide' : 'Start'} Interactive Lesson with Professor Didier</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>{showEngine ? '▲' : '▼'}</span>
                </button>

                {showEngine && (
                  <div className="mt-2 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.2)', minHeight: 600 }}>
                    <InteractiveLessonEngine
                      courseTitle={courseContent.title}
                      moduleTitle={chapterContent.title}
                      lessonTitle={getVideoContent(currentVideo || videos[0]).title}
                      lessonIndex={currentVideo ? currentVideo.order_index - 1 : 0}
                      totalLessons={videos.length}
                      onComplete={(score) => {
                        if (score && score >= 70) {
                          handleVideoComplete();
                        }
                      }}
                      onBack={() => setShowEngine(false)}
                      onGoHome={() => window.location.href = '/portal'}
                      onNextLesson={() => {
                        const next = videos.find(v => v.order_index === (currentVideo?.order_index || 0) + 1);
                        if (next) { setCurrentVideo(next); setShowEngine(false); setTimeout(() => setShowEngine(true), 100); }
                        else setShowEngine(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Video List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{chapterContent.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={progress} className="h-2 flex-1" />
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {videos.map((video) => {
                  const accessible = isVideoAccessible(video);
                  const passed = isVideoPassed(video);
                  const isCurrent = currentVideo?.id === video.id;
                  const videoContent = getVideoContent(video);

                  return (
                    <div
                      key={video.id}
                      onClick={() => accessible && setCurrentVideo(video)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isCurrent 
                          ? 'border-primary bg-primary/5' 
                          : accessible 
                            ? 'hover:border-primary/50' 
                            : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {passed ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : accessible ? (
                          <Play className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{videoContent.title}</p>
                          <p className="text-xs text-muted-foreground">5 {t.questions}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>
                  );
                })}

                {/* Chapter End Quiz */}
                <div className="pt-4 border-t mt-4">
                  <div
                    onClick={() => allMiniQuizzesPassed() && startChapterQuiz()}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      allMiniQuizzesPassed()
                        ? 'border-secondary bg-secondary/10 cursor-pointer hover:bg-secondary/20'
                        : 'border-dashed opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {passedQuizzes.includes(quizzes.find(q => q.quiz_type === 'chapter_end')?.id || '') ? (
                        <Trophy className="w-6 h-6 text-yellow-500" />
                      ) : allMiniQuizzesPassed() ? (
                        <Trophy className="w-6 h-6 text-secondary" />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-semibold">{t.chapterFinalQuiz}</p>
                        <p className="text-xs text-muted-foreground">
                          40 {t.questions} • 100% {t.required}
                        </p>
                      </div>
                    </div>
                    {!allMiniQuizzesPassed() && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <AlertCircle className="w-4 h-4" />
                        {t.completeAllVideos}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChapterView;
