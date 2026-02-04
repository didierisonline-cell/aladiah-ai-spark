import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, BookOpen, ChevronRight, LogOut, Play, CheckCircle, Lock } from 'lucide-react';
import { 
  courseUITranslations, 
  getTranslatedContent,
  type SupportedLanguage 
} from '@/utils/courseTranslations';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
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
  chapter_id: string;
  order_index: number;
}

interface Quiz {
  id: string;
  video_id: string | null;
  chapter_id: string;
  quiz_type: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  // Get translations with fallback to English
  const supportedLanguages: SupportedLanguage[] = ['en', 'es', 'zh', 'ar', 'fr', 'de', 'ja'];
  const currentLang = supportedLanguages.includes(language as SupportedLanguage) 
    ? (language as SupportedLanguage) 
    : 'en';
  const t = courseUITranslations[currentLang];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);
    loadData();
  };

  const loadData = async () => {
    try {
      // Load courses with translations
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, description, image_url, translations, is_published')
        .eq('is_published', true);
      
      if (coursesError) throw coursesError;

      // If no courses, seed them
      if (!coursesData || coursesData.length === 0) {
        await seedCourse();
        return;
      }

      setCourses(coursesData as Course[]);

      // Load chapters with translations
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select('id, title, description, order_index, course_id, translations')
        .order('order_index');
      
      setChapters((chaptersData || []) as Chapter[]);

      // Load videos
      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .order('order_index');
      
      setVideos(videosData || []);

      // Load quizzes
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*');
      
      setQuizzes(quizzesData || []);

      // Load passed quizzes from user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('quiz_id')
        .not('quiz_id', 'is', null);
      
      setPassedQuizzes((progressData || []).map(p => p.quiz_id as string));
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

  const seedCourse = async () => {
    setSeeding(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-scrum-course`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      toast({
        title: t.courseReady,
        description: t.courseReadyDesc,
      });
      
      loadData();
    } catch (error: any) {
      toast({
        title: t.errorSetup,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getChapterProgress = (chapterId: string) => {
    const chapterVideos = videos.filter(v => v.chapter_id === chapterId);
    const chapterQuizzes = quizzes.filter(q => 
      chapterVideos.some(v => v.id === q.video_id) && q.quiz_type === 'mini_video'
    );
    const completedQuizzes = chapterQuizzes.filter(q => passedQuizzes.includes(q.id));
    return chapterQuizzes.length > 0 
      ? Math.round((completedQuizzes.length / chapterQuizzes.length) * 100) 
      : 0;
  };

  // Check if a chapter is accessible (first chapter always, others require previous chapter 100%)
  const isChapterAccessible = (chapter: Chapter, courseChapters: Chapter[]) => {
    if (chapter.order_index === 0) return true;
    
    const prevChapter = courseChapters.find(c => c.order_index === chapter.order_index - 1);
    if (!prevChapter) return false;
    
    // Check if previous chapter has a chapter_end quiz that was passed
    const prevChapterEndQuiz = quizzes.find(
      q => q.chapter_id === prevChapter.id && q.quiz_type === 'chapter_end'
    );
    
    if (!prevChapterEndQuiz) return false;
    return passedQuizzes.includes(prevChapterEndQuiz.id);
  };

  // Get translated content for course
  const getCourseContent = (course: Course) => {
    return getTranslatedContent(
      course.translations,
      currentLang,
      course.title,
      course.description || ''
    );
  };

  // Get translated content for chapter
  const getChapterContent = (chapter: Chapter) => {
    return getTranslatedContent(
      chapter.translations,
      currentLang,
      chapter.title,
      chapter.description || ''
    );
  };

  if (loading || seeding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">
            {seeding ? t.settingUp : t.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="font-display font-bold text-xl">Aladiah Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {t.myCourses}
          </h1>
          <p className="text-muted-foreground">
            {t.subtitle}
          </p>
        </motion.div>

        {courses.map((course, courseIndex) => {
          const courseContent = getCourseContent(course);
          
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: courseIndex * 0.1 }}
            >
              <Card className="mb-6 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-display">{courseContent.title}</CardTitle>
                      <CardDescription className="mt-2">{courseContent.description}</CardDescription>
                    </div>
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {(() => {
                      const courseChapters = chapters
                        .filter(ch => ch.course_id === course.id)
                        .sort((a, b) => a.order_index - b.order_index);
                      
                      return courseChapters.map((chapter) => {
                        const chapterProgress = getChapterProgress(chapter.id);
                        const isLocked = !isChapterAccessible(chapter, courseChapters);
                        const chapterContent = getChapterContent(chapter);

                        return (
                          <div
                            key={chapter.id}
                            className={`border rounded-lg p-4 transition-all ${
                              isLocked 
                                ? 'opacity-50 bg-muted/30' 
                                : 'hover:border-primary/50 hover:shadow-md cursor-pointer'
                            }`}
                            onClick={() => !isLocked && navigate(`/course/${course.id}/chapter/${chapter.id}`)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                {chapterProgress === 100 ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : isLocked ? (
                                  <Lock className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                  <Play className="w-5 h-5 text-primary" />
                                )}
                                <div>
                                  <h3 className="font-semibold">{chapterContent.title}</h3>
                                  <p className="text-sm text-muted-foreground">{chapterContent.description}</p>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <Progress value={chapterProgress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {chapterProgress}% {t.complete}
                            </p>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </main>
    </div>
  );
};

export default Courses;
