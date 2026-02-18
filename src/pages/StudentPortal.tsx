import { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useLearningProfile } from '@/hooks/useLearningProfile';
import Header from '@/components/Header';
import YouTubeRecommendations from '@/components/portal/YouTubeRecommendations';
import CareerTools from '@/components/portal/CareerTools';
import LabMode from '@/components/portal/LabMode';
import {
  ProgressDetailModal, StreakDetailModal, PointsDetailModal, LabsDetailModal
} from '@/components/portal/StatDetailModals';
import {
  Bot, Send, BookOpen, Trophy, Flame, Target, GraduationCap,
  FlaskConical, Star, Gift, Youtube, Briefcase, Users, MessageCircle,
  TrendingUp, Award, Lightbulb, Sparkles, Clock, ArrowRight, CheckCircle,
  FileText, ExternalLink
} from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

// Course display order for the Scrum course
const COURSE_ORDER = [
  'Professional Scrum Master Certification',
  'Agile Development and Scrum',
  'Jira Scrum Project: Hands-on Training',
  'Jira SCRUM Project: Hands-On Training',
  'Projects & Simulations',
  'Agile, Scrum & SAFe 6.0 Mastery',
  'Agile, Scrum & Safe 6.0 Mastery',
  'Managing AI Projects',
  'Managing Ai Projects',
];

const EXCLUDED_COURSES = ['Rogers-Shaw', 'IT Merger', 'Network Integration'];

const StudentPortal = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { progress: overallProgress } = useProgress(user?.id);
  const { profile: learningProfile, recordQuestion, getDueReviews } = useLearningProfile(user?.id);

  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessages, setChatMessages] = useState<Msg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [labs, setLabs] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [courseProgresses, setCourseProgresses] = useState<any[]>([]);
  const [labSearch, setLabSearch] = useState('');
  const [labModeActive, setLabModeActive] = useState(false);
  const [labTopic, setLabTopic] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Stat detail modals
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [labsModalOpen, setLabsModalOpen] = useState(false);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  useEffect(() => {
    if (user) loadPortalData();
  }, [user, authLoading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadPortalData = async () => {
    if (!user) return;
    const [pointsRes, labsRes, suggestionsRes, coursesRes, chaptersRes, videosRes, quizzesRes, progressRes] = await Promise.all([
      supabase.from('student_points').select('points').eq('user_id', user.id),
      supabase.from('student_labs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('ai_suggestions').select('*').eq('user_id', user.id).eq('dismissed', false).order('created_at', { ascending: false }).limit(10),
      supabase.from('courses').select('id, title, translations').eq('is_published', true),
      supabase.from('chapters').select('id, title, course_id, order_index, translations').order('order_index'),
      supabase.from('videos').select('id, chapter_id, order_index').order('order_index'),
      supabase.from('quizzes').select('id, video_id, chapter_id, quiz_type'),
      supabase.from('user_progress').select('quiz_id, completed_at').not('quiz_id', 'is', null),
    ]);

    setTotalPoints((pointsRes.data || []).reduce((s, p) => s + p.points, 0));
    setLabs(labsRes.data || []);
    setSuggestions(suggestionsRes.data || []);

    // Calculate streak
    const dates = (progressRes.data || [])
      .map(p => new Date(p.completed_at).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let s = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (dates[i] === expected.toDateString()) s++;
      else break;
    }
    setStreak(s);

    // Course progress - filter out excluded courses, sort by order
    const passedQuizIds = (progressRes.data || []).map(p => p.quiz_id as string);
    const filteredCourses = (coursesRes.data || []).filter(course =>
      !EXCLUDED_COURSES.some(ex => course.title.includes(ex))
    );

    const progresses = filteredCourses.map(course => {
      const courseChapters = (chaptersRes.data || []).filter(ch => ch.course_id === course.id);
      const courseVideos = (videosRes.data || []).filter(v => courseChapters.some(ch => ch.id === v.chapter_id));
      const miniQuizzes = (quizzesRes.data || []).filter(q => courseVideos.some(v => v.id === q.video_id) && q.quiz_type === 'mini_video');
      const completed = miniQuizzes.filter(q => passedQuizIds.includes(q.id)).length;
      return {
        courseId: course.id,
        title: course.title,
        total: courseVideos.length,
        completed,
        pct: courseVideos.length > 0 ? Math.round((completed / courseVideos.length) * 100) : 0,
        nextChapterId: courseChapters.find(ch => {
          const chVids = courseVideos.filter(v => v.chapter_id === ch.id);
          const chQuizzes = miniQuizzes.filter(q => chVids.some(v => v.id === q.video_id));
          return !chQuizzes.every(q => passedQuizIds.includes(q.id));
        })?.id || courseChapters[0]?.id,
        chapters: courseChapters,
      };
    });

    // Sort by defined order
    progresses.sort((a, b) => {
      const aIdx = COURSE_ORDER.findIndex(name => a.title.toLowerCase().includes(name.toLowerCase()));
      const bIdx = COURSE_ORDER.findIndex(name => b.title.toLowerCase().includes(name.toLowerCase()));
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });

    setCourseProgresses(progresses);
  };

  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || isStreaming) return;
    const userMsg: Msg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsStreaming(true);
    recordQuestion();

    let assistantSoFar = '';
    const allMessages = [...chatMessages, userMsg];

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          studentContext: {
            courseProgress: overallProgress,
            points: totalPoints,
            streak,
            weakAreas: learningProfile?.weakAreas || [],
            strongAreas: learningProfile?.strongAreas || [],
            learningStyle: learningProfile?.learningStyle || 'balanced',
            preferredDifficulty: learningProfile?.preferredDifficulty || 'beginner',
            engagementScore: learningProfile?.engagementScore || 50,
            consecutiveFailures: learningProfile?.consecutiveFailures || 0,
            dueReviews: getDueReviews(),
            quizAccuracyTrend: learningProfile?.quizAccuracyTrend?.slice(-5) || [],
            videoRewatchCount: learningProfile?.videoRewatchCount || 0,
            labCompletionRate: learningProfile?.labCompletionRate || 0,
            totalQuestionsAsked: learningProfile?.totalQuestionsAsked || 0,
          },
          mode: 'chat',
        }),
      });

      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setChatMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { role: 'assistant', content: '¡Ay! Something went wrong. Please try again, mi gente! 🙏' }]);
    } finally {
      setIsStreaming(false);
    }
  }, [chatInput, isStreaming, chatMessages, user, overallProgress, totalPoints, streak, learningProfile, getDueReviews, recordQuestion]);

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><GraduationCap className="w-12 h-12 text-primary animate-pulse" /></div>;
  }

  const stats = [
    { icon: TrendingUp, label: 'Progress', value: `${overallProgress}%`, color: 'text-primary', onClick: () => setProgressModalOpen(true) },
    { icon: Flame, label: 'Streak', value: `${streak} days`, color: 'text-secondary', onClick: () => setStreakModalOpen(true) },
    { icon: Star, label: 'Points', value: totalPoints.toLocaleString(), color: 'text-accent', onClick: () => setPointsModalOpen(true) },
    { icon: FlaskConical, label: 'Labs Done', value: labs.filter(l => l.completed).length.toString(), color: 'text-primary', onClick: () => setLabsModalOpen(true) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  {firstName}'s AI Learning Portal
                </h1>
                <p className="text-muted-foreground text-sm">Powered by your personal AI assistant</p>
              </div>
            </div>
            {/* Guide Buttons */}
            <div className="flex gap-2">
              <a
                href="https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Scrum Guide</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
              <a
                href="https://davidfrico.com/safe-6.0-intro.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">SAFe 6.0</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Clickable Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card
                className="p-3 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                onClick={s.onClick}
              >
                <div className="flex items-center gap-2">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                  <div>
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview" className="text-xs"><BookOpen className="w-3 h-3 mr-1" />Overview</TabsTrigger>
            <TabsTrigger value="assistant" className="text-xs"><Bot className="w-3 h-3 mr-1" />Assistant</TabsTrigger>
            <TabsTrigger value="labs" className="text-xs"><FlaskConical className="w-3 h-3 mr-1" />Labs</TabsTrigger>
            <TabsTrigger value="career" className="text-xs"><Briefcase className="w-3 h-3 mr-1" />Career</TabsTrigger>
            <TabsTrigger value="rewards" className="text-xs"><Gift className="w-3 h-3 mr-1" />Rewards</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Course Progress - sorted and clickable */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courseProgresses.map((cp, idx) => (
                  <button
                    key={cp.courseId}
                    className="w-full text-left space-y-2 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-muted/50 cursor-pointer transition-all group"
                    onClick={() => cp.nextChapterId
                      ? navigate(`/course/${cp.courseId}/chapter/${cp.nextChapterId}`)
                      : navigate('/courses')
                    }
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] shrink-0">{idx + 1}</Badge>
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{cp.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {cp.pct === 100 ? 'Completed' : cp.pct > 0 ? 'Continue' : 'Start'}
                        </span>
                        {cp.pct === 100 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    </div>
                    <Progress value={cp.pct} className="h-2" />
                    <p className="text-[10px] text-muted-foreground">{cp.pct}% complete · {cp.completed}/{cp.total} lessons</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="w-5 h-5 text-accent" /> AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestions.slice(0, 5).map(s => (
                    <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="outline" className="text-[10px] mt-0.5">{s.suggestion_type}</Badge>
                      <p className="text-sm flex-1">{typeof s.content === 'object' ? JSON.stringify(s.content) : s.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Community', path: '/community', icon: Users },
                { label: 'Sprint Sim', path: '/simulation', icon: Target },
                { label: 'Referrals', path: '/referral', icon: Award },
                { label: 'Store', path: '/store', icon: Gift },
              ].map((a, i) => (
                <Card key={i} className="p-3 cursor-pointer hover:shadow-md transition-shadow text-center" onClick={() => navigate(a.path)}>
                  <a.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs font-medium">{a.label}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="assistant">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" /> Your Personal AI Assistant
                </CardTitle>
                <p className="text-xs text-muted-foreground">Ask me anything about Scrum, your career, or your studies!</p>
              </CardHeader>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-12 space-y-4">
                      <Bot className="w-16 h-16 mx-auto text-primary/30" />
                      <div>
                        <p className="font-medium text-muted-foreground">¡Hola! I'm your AI learning assistant</p>
                        <p className="text-sm text-muted-foreground mt-1">Try asking me:</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto">
                        {[
                          'Explain the Scrum framework',
                          'Help me build my resume',
                          'What topics should I focus on?',
                          'Suggest YouTube videos for Sprint Planning',
                        ].map(q => (
                          <Button key={q} variant="outline" size="sm" className="text-xs h-auto py-2 whitespace-normal" onClick={() => { setChatInput(q); }}>
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted rounded-bl-md'
                      }`}>
                        {m.role === 'assistant' ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm [&>h1]:font-bold [&>h2]:font-semibold [&>h3]:font-medium">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isStreaming && chatMessages[chatMessages.length - 1]?.role !== 'assistant' && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
                        <div className="flex gap-1"><div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" /><div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} /><div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} /></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <form onSubmit={e => { e.preventDefault(); sendChat(); }} className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask your AI assistant anything..."
                    disabled={isStreaming}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isStreaming || !chatInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </TabsContent>

          {/* Labs Tab */}
          <TabsContent value="labs" className="space-y-4">
            <AnimatePresence mode="wait">
              {labModeActive ? (
                <LabMode
                  key="lab-mode"
                  topic={labTopic}
                  studentContext={{
                    courseProgress: overallProgress,
                    points: totalPoints,
                    streak,
                    weakAreas: [],
                  }}
                  onExit={() => { setLabModeActive(false); setLabTopic(''); setLabSearch(''); }}
                />
              ) : (
                <motion.div key="lab-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  {/* Search + Lab Button */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FlaskConical className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg">Enter Lab Mode</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Type any topic you want to master — AI will break it down, quiz you, and suggest improvements.
                    </p>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        if (labSearch.trim()) {
                          setLabTopic(labSearch.trim());
                          setLabModeActive(true);
                        }
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={labSearch}
                        onChange={e => setLabSearch(e.target.value)}
                        placeholder="e.g. Sprint Planning, Product Backlog, Daily Scrum..."
                        className="flex-1"
                      />
                      <Button type="submit" className="gap-2">
                        <FlaskConical className="w-4 h-4" />
                        Lab
                      </Button>
                    </form>
                    {/* Quick topic pills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Scrum Events', 'Product Owner Role', 'Sprint Retrospective', 'Agile vs Waterfall', 'User Stories'].map(t => (
                        <Button
                          key={t}
                          variant="outline"
                          size="sm"
                          className="text-xs h-auto py-1.5"
                          onClick={() => { setLabTopic(t); setLabModeActive(true); }}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </Card>

                  {/* Previous Labs - clickable to re-enter */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Previous Labs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {labs.length === 0 ? (
                        <div className="text-center py-8 space-y-3">
                          <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">No labs yet! Enter a topic above to start your first lab.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {labs.map(lab => {
                            const topic = typeof lab.lab_content === 'object' && lab.lab_content.topic
                              ? lab.lab_content.topic
                              : 'Lab Session';
                            return (
                              <div
                                key={lab.id}
                                className="p-4 rounded-lg border hover:shadow-sm hover:bg-muted/50 cursor-pointer transition-all"
                                onClick={() => {
                                  setLabTopic(topic);
                                  setLabModeActive(true);
                                }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant={lab.completed ? 'default' : 'outline'}>
                                    {lab.completed ? <><CheckCircle className="w-3 h-3 mr-1" /> Complete</> : lab.difficulty_level}
                                  </Badge>
                                  {lab.score > 0 && <span className="text-sm font-medium">{lab.score}%</span>}
                                </div>
                                <p className="text-sm font-medium">{topic}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(lab.created_at).toLocaleDateString()} • Click to re-enter
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-4">
            <CareerTools
              overallProgress={overallProgress}
              onSwitchToAssistant={(prompt) => { setActiveTab('assistant'); setChatInput(prompt); }}
            />

            <YouTubeRecommendations
              weakAreas={(learningProfile?.weakAreas || []).map((w: any) => typeof w === 'string' ? w : w.topic || String(w))}
              recentQuestions={chatMessages.filter(m => m.role === 'user').map(m => m.content).slice(-5)}
              currentTopic="Scrum Master"
              onSwitchToAssistant={(prompt) => { setActiveTab('assistant'); setChatInput(prompt); }}
            />
          </TabsContent>

          {/* Rewards Tab - Updated points */}
          <TabsContent value="rewards" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2"><Star className="w-5 h-5 text-accent" /> Your Points</h3>
                  <p className="text-sm text-muted-foreground">Earn points by engaging with the platform</p>
                </div>
                <div className="text-right cursor-pointer" onClick={() => setPointsModalOpen(true)}>
                  <p className="text-3xl font-display font-bold text-accent">{totalPoints}</p>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {[
                  { action: 'Comment on Blog', points: '+5', icon: MessageCircle },
                  { action: 'Complete a Lab', points: '+5', icon: FlaskConical },
                  { action: 'Pass a Quiz', points: '+5', icon: Trophy },
                  { action: 'Daily Login', points: '+1', icon: Flame },
                  { action: 'Refer a Student', points: '+200', icon: Users },
                  { action: 'Collaborate with Students', points: '+2', icon: Award },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg border text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setPointsModalOpen(true)}>
                    <item.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-medium">{item.action}</p>
                    <p className="text-sm font-bold text-accent">{item.points}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-semibold mb-3">Redeem Points</h4>
              <div className="space-y-2">
                {[
                  { title: 'Store Discount (10%)', cost: 500, icon: Gift },
                  { title: '1-on-1 Career Session', cost: 1000, icon: Briefcase },
                  { title: 'Exclusive Merchandise', cost: 750, icon: Award },
                  { title: 'Certificate Frame', cost: 300, icon: GraduationCap },
                ].map((reward, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <reward.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{reward.title}</span>
                    </div>
                    <Button size="sm" variant={totalPoints >= reward.cost ? 'default' : 'outline'} disabled={totalPoints < reward.cost}>
                      {reward.cost} pts
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Stat Detail Modals */}
      {user && (
        <>
          <ProgressDetailModal
            open={progressModalOpen}
            onOpenChange={setProgressModalOpen}
            userId={user.id}
            courseProgresses={courseProgresses}
            overallProgress={overallProgress}
          />
          <StreakDetailModal
            open={streakModalOpen}
            onOpenChange={setStreakModalOpen}
            userId={user.id}
            streak={streak}
          />
          <PointsDetailModal
            open={pointsModalOpen}
            onOpenChange={setPointsModalOpen}
            userId={user.id}
            totalPoints={totalPoints}
          />
          <LabsDetailModal
            open={labsModalOpen}
            onOpenChange={setLabsModalOpen}
            labs={labs}
            onReenterLab={(topic) => {
              setLabTopic(topic);
              setLabModeActive(true);
              setActiveTab('labs');
            }}
          />
        </>
      )}
    </div>
  );
};

export default StudentPortal;
