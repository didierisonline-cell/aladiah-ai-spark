import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, ArrowLeft, Play, CheckCircle, Lock, 
  ChevronRight, Trophy, AlertCircle
} from 'lucide-react';
import Quiz from '@/components/course/Quiz';
import VideoPlayer from '@/components/course/VideoPlayer';

interface Course {
  id: string;
  title: string;
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
  description: string;
  chapter_id: string;
  order_index: number;
  video_url: string | null;
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

const ChapterView = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  useEffect(() => {
    loadChapterData();
  }, [chapterId]);

  const loadChapterData = async () => {
    try {
      // Check auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Load course
      const { data: courseData } = await supabase
        .from('courses')
        .select('id, title')
        .eq('id', courseId)
        .single();
      
      setCourse(courseData);

      // Load chapter
      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .single();
      
      if (chapterError) throw chapterError;
      setChapter(chapterData);

      // Load videos
      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('order_index');
      
      setVideos(videosData || []);

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
        setCurrentVideo(videosData[0]);
      }
    } catch (error: any) {
      toast({
        title: 'Error loading chapter',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isVideoAccessible = (video: Video) => {
    if (video.order_index === 0) return true;
    
    const prevVideo = videos.find(v => v.order_index === video.order_index - 1);
    if (!prevVideo) return true;

    const prevQuiz = quizzes.find(q => q.video_id === prevVideo.id);
    return prevQuiz ? passedQuizzes.includes(prevQuiz.id) : true;
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
        title: '🎉 Chapter Complete!',
        description: 'Congratulations! You can now proceed to the next chapter.',
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
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
                  title={currentVideo.title}
                  description={currentVideo.description || ''}
                  orderIndex={currentVideo.order_index}
                  onComplete={handleVideoComplete}
                  isCompleted={isVideoPassed(currentVideo)}
                  courseTitle={course?.title}
                  chapterTitle={chapter?.title}
                />
              ) : (
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Select a video to begin</p>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Video List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{chapter?.title}</CardTitle>
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
                          <p className="font-medium text-sm truncate">{video.title}</p>
                          <p className="text-xs text-muted-foreground">5 questions</p>
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
                        <p className="font-semibold">Chapter Final Quiz</p>
                        <p className="text-xs text-muted-foreground">
                          40 questions • 100% required
                        </p>
                      </div>
                    </div>
                    {!allMiniQuizzesPassed() && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <AlertCircle className="w-4 h-4" />
                        Complete all video quizzes first
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
