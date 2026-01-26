import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, BookOpen, ChevronRight, LogOut, Play, CheckCircle, Lock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  order_index: number;
  course_id: string;
}

interface Video {
  id: string;
  title: string;
  chapter_id: string;
  order_index: number;
}

interface UserProgress {
  quiz_id: string | null;
  video_id: string | null;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      // Load courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true);
      
      if (coursesError) throw coursesError;

      // If no courses, seed them
      if (!coursesData || coursesData.length === 0) {
        await seedCourse();
        return;
      }

      setCourses(coursesData);

      // Load chapters
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select('*')
        .order('order_index');
      
      setChapters(chaptersData || []);

      // Load videos
      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .order('order_index');
      
      setVideos(videosData || []);

      // Load user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('quiz_id, video_id');
      
      setProgress(progressData || []);
    } catch (error: any) {
      toast({
        title: 'Error loading courses',
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
        title: 'Course ready!',
        description: 'The Scrum Master course has been set up.',
      });
      
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error setting up course',
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
    const completedVideos = chapterVideos.filter(v => 
      progress.some(p => p.video_id === v.id || p.quiz_id)
    );
    return chapterVideos.length > 0 
      ? Math.round((completedVideos.length / chapterVideos.length) * 100) 
      : 0;
  };

  if (loading || seeding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">
            {seeding ? 'Setting up your course...' : 'Loading courses...'}
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
              Logout
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
            My Courses
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey and earn your certification
          </p>
        </motion.div>

        {courses.map((course, courseIndex) => (
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
                    <CardTitle className="text-2xl font-display">{course.title}</CardTitle>
                    <CardDescription className="mt-2">{course.description}</CardDescription>
                  </div>
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {chapters
                    .filter(ch => ch.course_id === course.id)
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((chapter, idx) => {
                      const chapterProgress = getChapterProgress(chapter.id);
                      const isLocked = idx > 0 && getChapterProgress(
                        chapters.filter(c => c.course_id === course.id)[idx - 1]?.id
                      ) < 100;

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
                                <h3 className="font-semibold">{chapter.title}</h3>
                                <p className="text-sm text-muted-foreground">{chapter.description}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <Progress value={chapterProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {chapterProgress}% complete
                          </p>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default Courses;
