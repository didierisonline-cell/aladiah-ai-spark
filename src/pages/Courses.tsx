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
import PortalLangWidget from '@/components/portal/PortalLangWidget';
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
  'fd26e0dd-3e07-4595-99f4-f304026dcd27', // Agile, Scrum & SAFe 6.0 Mastery
  'dddddddd-eeee-ffff-1111-222222222222', // AI Mastery for Scrum Masters & Project Managers
  'eeeeeeee-ffff-1111-2222-333333333333', // Project Management Professional Certification
  'ffffffff-1111-2222-3333-444444444444', // Cybersecurity Professional Certification
  '11111111-2222-3333-4444-555555555555', // Solution Architect Professional
  '22222222-3333-4444-5555-666666666666', // Data Analytics Professional
  '33333333-4444-5555-6666-777777777777', // DevOps & Cloud Engineering
  '44444444-5555-6666-7777-888888888888', // Business Analysis Professional
  '22222222-3333-4444-5555-666666666666', // Data Analytics Professional
  '33333333-4444-5555-6666-777777777777', // DevOps & Cloud Engineering
  '44444444-5555-6666-7777-888888888888', // Business Analysis Professional
];

// Courses to hide entirely
const HIDDEN_IDS = [
  'b2c3d4e5-f6a7-8901-bcde-fa2345678901', // Rogers-Shaw IT Merger
];

// Explicit ordering for certification courses
const CERTIFICATION_ORDER = [
  'fd26e0dd-3e07-4595-99f4-f304026dcd27', // Scrum Master Profession
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
  const [isStarter, setIsStarter] = useState(false);
  const [starterFreeCourseId, setStarterFreeCourseId] = useState<string | null>(null);
  const [starterCourseDone, setStarterCourseDone] = useState(false);
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

  const SB_URL = 'https://vgujnkxylipfwmkpwzvb.supabase.co/rest/v1';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWpua3h5bGlwZndta3B3enZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzYyMTUsImV4cCI6MjA4OTcxMjIxNX0.wpP8ZK0dtEegUu3r1f--sIkNHN1GnHTzvIstVAi1k20';

  // Direct REST fetch — bypasses SDK token-refresh hang, uses AbortController for real cancellation
  const restFetch = async (path: string, userJwt?: string, ms = 15000): Promise<any[] | null> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(`${SB_URL}${path}`, {
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${userJwt || SB_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  const checkAuth = async () => {
    try {
      const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
      const stored = key ? JSON.parse(localStorage.getItem(key) || '') : null;
      const u = stored?.user ?? null;
      const jwt = stored?.access_token ?? null;
      setUser(u);
      if (u?.id) {
        const profileData = await restFetch(`/profiles?user_id=eq.${u.id}&select=tier,free_course_id&limit=1`, jwt);
        const profile = profileData?.[0];
        if (profile?.tier === 'starter') {
          setIsStarter(true);
          setStarterFreeCourseId(profile?.free_course_id || null);
          const localDone = localStorage.getItem(`starter-course-done-${u.id}`);
          if (localDone === 'true' || profile?.free_course_completed) setStarterCourseDone(true);
        }
      }
    } catch {}
    loadData();
  };

  // Get a valid JWT — refresh if expired
  const getValidJwt = async (): Promise<string> => {
    try {
      const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
      const stored = key ? JSON.parse(localStorage.getItem(key) || '') : null;
      if (!stored) return SB_KEY;

      // Check if access token is still valid (JWT exp claim)
      const [, payload] = (stored.access_token || '').split('.');
      if (payload) {
        const { exp } = JSON.parse(atob(payload));
        if (exp * 1000 > Date.now() + 5000) return stored.access_token; // still valid
      }

      // Token expired — refresh using refresh_token
      if (stored.refresh_token) {
        const c = new AbortController();
        setTimeout(() => c.abort(), 8000);
        const res = await fetch(`https://vgujnkxylipfwmkpwzvb.supabase.co/auth/v1/token?grant_type=refresh_token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY },
          body: JSON.stringify({ refresh_token: stored.refresh_token }),
          signal: c.signal,
        });
        if (res.ok) {
          const session = await res.json();
          if (key && session.access_token) {
            localStorage.setItem(key, JSON.stringify({ ...stored, ...session }));
          }
          return session.access_token || SB_KEY;
        }
      }
    } catch {}
    return SB_KEY;
  };

  const loadData = async () => {
    try {
      const jwt = await getValidJwt();

      const [coursesData, chaptersData, videosData, quizzesData, progressData, prereqData] = await Promise.all([
        restFetch('/courses?is_published=eq.true&select=id,title,description,image_url,translations,is_published', jwt),
        restFetch('/chapters?select=id,title,description,order_index,course_id,translations&order=order_index', jwt),
        restFetch('/videos?order=order_index', jwt),
        restFetch('/quizzes?select=id,video_id,chapter_id,quiz_type', jwt),
        restFetch('/user_progress?quiz_id=not.is.null&select=quiz_id', jwt),
        restFetch('/course_prerequisites?select=course_id,prerequisite_group,prerequisite_course_id', jwt),
      ]);

      // Only seed if courses returned an actual empty array (not null = error/timeout)
      if (coursesData !== null && coursesData.length === 0) {
        await seedCourse();
        return;
      }

      setCourses((coursesData || []) as Course[]);
      setChapters((chaptersData || []) as Chapter[]);
      setVideos((videosData || []) as any[]);
      setQuizzes((quizzesData || []) as any[]);
      setPassedQuizzes(((progressData || []) as any[]).map((p: any) => p.quiz_id as string));
      setPrerequisites((prereqData || []) as Prerequisite[]);
    } catch (error: any) {
      toast({ title: t.errorLoading, description: error.message, variant: 'destructive' });
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

  const isChapterAccessible = (chapter: Chapter, _courseChapters: Chapter[]) => {
    if (!isStarter) return true;
    if (starterCourseDone) return false; // all locked after completion
    if (chapter.course_id !== starterFreeCourseId) return false;
    return chapter.order_index === 0;
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
    if (!isStarter) return true; // paid users: all unlocked
    if (starterCourseDone) return false; // course done: everything locked
    if (!starterFreeCourseId) return false;
    return courseId === starterFreeCourseId;
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

    const starterLocked = isStarter && locked;

    // Starter locked: show compact locked card only
    if (starterLocked) {
      return (
        <div
          key={course.id}
          className="mb-3 rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:border-amber-500/40 transition-all"
          style={{ background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={async () => {
            const { supabase: sb } = await import('@/integrations/supabase/client');
            const { data: { user: u } } = await sb.auth.getUser();
            if (!u) return;
            const res = await fetch('/api/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TW7U21wgazWak4Atj7TbIB3',
                email: u.email, tier: 't2', userId: u.id,
                successUrl: `${window.location.origin}/portal?payment=success`, cancelUrl: `${window.location.origin}/courses` }) });
            const d = await res.json(); if (d.url) window.location.href = d.url;
          }}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '18px' }}>🔒</span>
              <span className="font-semibold text-white/50 text-sm">{courseContent.title}</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#000', borderRadius: '8px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' }}>
              Upgrade $99.99/mo →
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative mb-6">
      <Card className={`overflow-hidden ${locked ? 'opacity-60' : ''}`}>
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
                      onClick={async () => {
                        if (isLocked) {
                          if (isStarter) {
                            const { data: { user: u } } = await (await import('@/integrations/supabase/client')).supabase.auth.getUser();
                            if (!u) return;
                            const res = await fetch('/api/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TMsDL0Ctflq2xPfzJsrXzy1',
                                email: u.email, tier: 't2', userId: u.id,
                                successUrl: `${window.location.origin}/portal?payment=success`,
                                cancelUrl: `${window.location.origin}/courses` }) });
                            const d = await res.json(); if (d.url) window.location.href = d.url;
                          }
                          return;
                        }
                        INTERACTIVE_SIMULATION_IDS.includes(course.id) ? navigate('/simulation') : (chapter?.id ? navigate(`/course/${course.id}/chapter/${chapter.id}`) : navigate('/courses'));
                      }}
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
    </div>
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
            <PortalLangWidget />
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

        {!loading && certificationCourses.length === 0 ? null : (
          certificationCourses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              {renderCourseCard(course, 'book')}
            </motion.div>
          ))
        )}

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
