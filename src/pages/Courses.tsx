import { useEffect, useState } from 'react';
import ProgressBar from '@/components/ProgressBar';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, BookOpen, ChevronRight, LogOut, Play, CheckCircle, Lock, ShieldCheck, FlaskConical } from 'lucide-react';
import aladiahLogo from '@/assets/aladiah-header-logo.png';
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

interface Prerequisite {
  course_id: string;
  prerequisite_group: number;
  prerequisite_course_id: string;
}

const SIMULATION_IDS = [
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Live Scrum Project
];

// Courses that should appear after simulations (in this order)
const AFTER_SIMULATION_IDS = [
  'cccccccc-dddd-eeee-ffff-111111111111', // Agile, Scrum & SAFe 6.0 Mastery
  'dddddddd-eeee-ffff-1111-222222222222', // Managing AI Projects
];

// Courses to hide entirely
const HIDDEN_IDS = [
  'b2c3d4e5-f6a7-8901-bcde-fa2345678901', // Rogers-Shaw IT Merger
];

// Explicit ordering for certification courses
const CERTIFICATION_ORDER = [
  '00f26156-db7e-446e-b6b5-28e9e1150309', // Professional Scrum Master Certification
  'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', // Agile Development and Scrum
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', // Jira SCRUM Project
];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

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
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, description, image_url, translations, is_published')
        .eq('is_published', true);
      
      if (coursesError) throw coursesError;

      if (!coursesData || coursesData.length === 0) {
        await seedCourse();
        return;
      }

      setCourses(coursesData as Course[]);

      const { data: chaptersData } = await supabase
        .from('chapters')
        .select('id, title, description, order_index, course_id, translations')
        .order('order_index');
      
      setChapters((chaptersData || []) as Chapter[]);

      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .order('order_index');
      
      setVideos(videosData || []);

      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*');
      
      setQuizzes(quizzesData || []);

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('quiz_id')
        .not('quiz_id', 'is', null);
      
      setPassedQuizzes((progressData || []).map(p => p.quiz_id as string));

      const { data: prereqData } = await supabase
        .from('course_prerequisites')
        .select('course_id, prerequisite_group, prerequisite_course_id');
      
      setPrerequisites((prereqData || []) as Prerequisite[]);
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

  const isChapterAccessible = (chapter: Chapter, courseChapters: Chapter[]) => {
    if (chapter.order_index === 0) return true;
    const prevChapter = courseChapters.find(c => c.order_index === chapter.order_index - 1);
    if (!prevChapter) return false;
    const prevChapterEndQuiz = quizzes.find(
      q => q.chapter_id === prevChapter.id && q.quiz_type === 'chapter_end'
    );
    if (!prevChapterEndQuiz) return false;
    return passedQuizzes.includes(prevChapterEndQuiz.id);
  };

  const isCourseCompleted = (courseId: string) => {
    const courseChapters = chapters.filter(ch => ch.course_id === courseId);
    const chapterEndQuizzes = quizzes.filter(q => 
      courseChapters.some(ch => ch.id === q.chapter_id) && q.quiz_type === 'chapter_end'
    );
    if (chapterEndQuizzes.length === 0) return false;
    return chapterEndQuizzes.every(q => passedQuizzes.includes(q.id));
  };

  const isCourseUnlocked = (courseId: string) => {
    const coursePrereqs = prerequisites.filter(p => p.course_id === courseId);
    if (coursePrereqs.length === 0) return true;
    const groups = [...new Set(coursePrereqs.map(p => p.prerequisite_group))];
    return groups.some(group => {
      const groupPrereqs = coursePrereqs.filter(p => p.prerequisite_group === group);
      return groupPrereqs.every(p => isCourseCompleted(p.prerequisite_course_id));
    });
  };

  const getPrerequisiteNames = (courseId: string) => {
    const coursePrereqs = prerequisites.filter(p => p.course_id === courseId);
    if (coursePrereqs.length === 0) return [];
    const groups = [...new Set(coursePrereqs.map(p => p.prerequisite_group))];
    return groups.map(group => {
      const groupPrereqs = coursePrereqs.filter(p => p.prerequisite_group === group);
      return groupPrereqs.map(p => {
        const course = courses.find(c => c.id === p.prerequisite_course_id);
        if (!course) return '';
        const content = getCourseContent(course);
        return content.title;
      }).filter(Boolean);
    });
  };

  const getCourseContent = (course: Course) => {
    return getTranslatedContent(
      course.translations,
      currentLang,
      course.title,
      course.description || ''
    );
  };

  const getChapterContent = (chapter: Chapter) => {
    return getTranslatedContent(
      chapter.translations,
      currentLang,
      chapter.title,
      chapter.description || ''
    );
  };

  // Reusable course card renderer
  const renderCourseCard = (course: Course, icon: 'book' | 'flask' = 'book') => {
    const courseContent = getCourseContent(course);
    const locked = !isCourseUnlocked(course.id);
    const prereqGroups = getPrerequisiteNames(course.id);
    const IconComponent = icon === 'flask' ? FlaskConical : BookOpen;

    return (
      <Card className={`mb-6 overflow-hidden ${locked ? 'opacity-70' : ''}`}>
        <CardHeader className={`bg-gradient-to-r ${locked ? 'from-muted/50 to-muted/30' : icon === 'flask' ? 'from-accent/20 to-primary/10' : 'from-primary/10 to-secondary/10'}`}>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-display flex items-center gap-2">
                {locked && <Lock className="w-5 h-5 text-muted-foreground" />}
                {courseContent.title}
              </CardTitle>
              <CardDescription className="mt-2">{courseContent.description}</CardDescription>
              {locked && prereqGroups.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    {t.prerequisitesRequired}:
                  </p>
                  {prereqGroups.map((group, i) => (
                    <p key={i} className="text-xs text-muted-foreground pl-5">
                      {i > 0 && <span className="font-semibold">OR </span>}
                      {group.join(' + ')}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <IconComponent className={`w-8 h-8 ${locked ? 'text-muted-foreground' : 'text-primary'}`} />
          </div>
        </CardHeader>
        {!locked && (
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
        )}
      </Card>
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

  // Certification courses (not simulations, not after-sim, not hidden)
  const certificationCourses = courses
    .filter(c => !SIMULATION_IDS.includes(c.id) && !AFTER_SIMULATION_IDS.includes(c.id) && !HIDDEN_IDS.includes(c.id))
    .sort((a, b) => {
      const aIdx = CERTIFICATION_ORDER.indexOf(a.id);
      const bIdx = CERTIFICATION_ORDER.indexOf(b.id);
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });
  // Courses after simulations (in defined order)
  const afterSimCourses = courses
    .filter(c => AFTER_SIMULATION_IDS.includes(c.id))
    .sort((a, b) => AFTER_SIMULATION_IDS.indexOf(a.id) - AFTER_SIMULATION_IDS.indexOf(b.id));
  // Simulations (excluding hidden)
  const simulationCourses = courses.filter(c => SIMULATION_IDS.includes(c.id) && !HIDDEN_IDS.includes(c.id));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={aladiahLogo} alt="Aladiah Academy" className="h-20 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/community"><Button variant="ghost" size="sm">Community</Button></Link>
            <Link to="/feedback"><Button variant="ghost" size="sm">Feedback</Button></Link>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t.logout}
            </Button>
          </div>
        </div>
      </header>

      <ProgressBar />

      <main className="container mx-auto px-4 py-8 mt-8">
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

        {/* 1. Professional Certification Courses - FIRST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Professional Certification Courses
            </h2>
          </div>
        </motion.div>

        {certificationCourses.map((course, i) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            {renderCourseCard(course, 'book')}
          </motion.div>
        ))}

        {/* 2. Projects & Simulations */}
        {simulationCourses.length > 0 && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mt-12">
              <div className="flex items-center gap-3 mb-2">
                <FlaskConical className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-display font-bold text-foreground">{t.projectsAndSimulations}</h2>
              </div>
              <p className="text-muted-foreground">{t.projectsSubtitle}</p>
            </motion.div>

            {simulationCourses.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                {renderCourseCard(course, 'flask')}
              </motion.div>
            ))}
          </>
        )}

        {/* 3. Jira and other courses - LAST */}
        {afterSimCourses.map((course, i) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            {renderCourseCard(course, 'book')}
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default Courses;
