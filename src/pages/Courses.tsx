import { useEffect, useState } from 'react';
import { PAGE_SUBTITLE_CLASS, SECTION_SUBTITLE_CLASS } from '@/lib/typography';
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
import BackToPortal from '@/components/portal/BackToPortal';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';
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

const INTERACTIVE_SIMULATION_IDS = [
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Live Scrum Project → /simulation
];

// Courses that should appear after simulations (in this order)
const AFTER_SIMULATION_IDS = [
  'cccccccc-dddd-eeee-ffff-111111111111', // Agile, Scrum & SAFe 6.0 Mastery
  'dddddddd-eeee-ffff-1111-222222222222', // AI Mastery for Scrum Masters & Project Managers
  'eeeeeeee-ffff-1111-2222-333333333333', // Project Management Professional Certification
  'ffffffff-1111-2222-3333-444444444444', // Cybersecurity Professional Certification
  '11111111-2222-3333-4444-555555555555', // Solution Architect Professional
  '22222222-3333-4444-5555-666666666666', // Data Analytics Professional
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
    // DEV MODE: bypass auth, allow anonymous access
    setUser(session?.user ?? { email: 'dev@preview.local' });
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

      // Seed AI course if it's missing
      const aiCourseId = 'dddddddd-eeee-ffff-1111-222222222222';
      const pmCourseId = 'eeeeeeee-ffff-1111-2222-333333333333';
      if (!coursesData.some(c => c.id === aiCourseId)) {
        try {
          if (!coursesData.some(c => c.id === pmCourseId)) {
            fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-pm-professional-course`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' }
            }).then(() => window.location.reload());
          }
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-ai-pm-course`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
          });
          loadData();
          return;
        } catch (e) { console.error('AI course seed failed:', e); }
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
      // Seed both courses in parallel
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      };
      const [scrumRes, aiRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-scrum-course`, { method: 'POST', headers }),
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-ai-pm-course`, { method: 'POST', headers }),
      ]);

      const result = await scrumRes.json();
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

  const isChapterAccessible = (_chapter: Chapter, _courseChapters: Chapter[]) => {
    return true; // DEV MODE: all chapters unlocked
  };

  const isCourseCompleted = (courseId: string) => {
    const courseChapters = chapters.filter(ch => ch.course_id === courseId);
    const chapterEndQuizzes = quizzes.filter(q => 
      courseChapters.some(ch => ch.id === q.chapter_id) && q.quiz_type === 'chapter_end'
    );
    if (chapterEndQuizzes.length === 0) return false;
    return chapterEndQuizzes.every(q => passedQuizzes.includes(q.id));
  };

  const isCourseUnlocked = (_courseId: string) => {
    return true; // DEV MODE: all courses unlocked
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
        {!locked && INTERACTIVE_SIMULATION_IDS.includes(course.id) && (
          <CardContent className="p-6">
            <Button variant="coral" className="w-full" onClick={() => navigate('/simulation')}>
              🏃‍♂️ Enter Live Sprint Simulation
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        )}
        {!locked && !INTERACTIVE_SIMULATION_IDS.includes(course.id) && (
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
                      onClick={() => !isLocked && (INTERACTIVE_SIMULATION_IDS.includes(course.id) ? navigate('/simulation') : navigate(`/course/${course.id}/chapter/${chapter.id}`))}
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
            <img src={aladiahLogo} alt="Aladiah Academy" className="h-28 w-auto object-contain mix-blend-multiply" />
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/portal')}
              className="flex items-center gap-2 font-semibold text-[#1a3a5c] hover:text-[#1a3a5c] hover:bg-slate-100"
            >
              ← Back to Portal
            </Button>
          </div>
        </div>
      </header>

      <ProgressBar />

      <main className="container mx-auto px-4 py-8 mt-8">
        <BackToPortal />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {t.myCourses}
          </h1>
          <p className={PAGE_SUBTITLE_CLASS}>{t.subtitle}</p>
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
          <p className={SECTION_SUBTITLE_CLASS}>
            {t.certificationSubtitle || "Master globally recognized Agile and Scrum certifications"}
          </p>
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
              <p className={SECTION_SUBTITLE_CLASS}>{t.projectsSubtitle}</p>
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
