import { useEffect, useState, useRef, useCallback } from 'react';
import { PAGE_SUBTITLE_CLASS, CARD_SUBTITLE_CLASS } from '@/lib/typography';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import PortalLangWidget from '@/components/portal/PortalLangWidget';
import { useProgress } from '@/hooks/useProgress';
import { useLearningProfile } from '@/hooks/useLearningProfile';
import { useSubscription } from '@/hooks/useSubscription';
import Header from '@/components/Header';
import AgentSelector from '@/components/portal/AgentSelector';
import StudentProfileWidget from '@/components/portal/StudentProfileWidget';
import YouTubeRecommendations from '@/components/portal/YouTubeRecommendations';
import CareerTools from '@/components/portal/CareerTools';
import LabMode from '@/components/portal/LabMode';
import KnowledgeGraph from '@/components/portal/KnowledgeGraph';
import { CreedAcknowledgmentGate } from '@/components/CreedAcknowledgmentGate';
import CourseSelectionGate from '@/components/CourseSelectionGate';
import {
  ProgressDetailModal, StreakDetailModal, PointsDetailModal, LabsDetailModal
} from '@/components/portal/StatDetailModals';
import {
  Bot, BookMarked, Lock, Send, BookOpen, Trophy, Flame, GraduationCap,
  FlaskConical, Star, Gift, Briefcase,
  TrendingUp, Award, Lightbulb, Sparkles, Clock,
  ArrowRight, CheckCircle, FileText, ExternalLink, Mic, Crown
} from 'lucide-react';
import CoursesSection from '@/components/CoursesSection';

type Msg = { role: 'user' | 'assistant'; content: string };

const COURSE_ORDER = [
  'AI Cloud Engineer','AI Agent Engineer','AI Data Engineer','AI DevOps Engineer',
  'AI Security Engineer','AI MLOps Engineer','AI Solutions Architect','AI Platform Engineer',
  'AI Solutions Consultant','AI Product Manager','AI Business Operations','AI Sales Engineer',
  'AI Business Analyst','AI Transformation Manager','AI Program Manager','AI Enterprise Architect',
  'AI Governance Professional','Responsible AI','AI Compliance','AI Risk Management',
  'AI Auditing','AI Policy','AI Ethics',
  'AI UX Designer','Conversation Designer','Human-AI Interaction','AI Workflow Designer','AI Experience Architect',
  'Professional Scrum Master Certification','Agile Development and Scrum',
  'AI Mastery for Scrum Masters','AI Mastery for Scrum Masters & Project Managers',
];

const EXCLUDED_COURSES = ['Rogers-Shaw', 'IT Merger', 'Network Integration'];

function getStoredUserId(): string | null {
  try {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (!key) return null;
    const stored = JSON.parse(localStorage.getItem(key) || '');
    return stored?.user?.id ?? null;
  } catch { return null; }
}

// Race any Supabase query against a timeout — returns fallback if it hangs
function sbFetch<T>(query: Promise<{ data: T | null; error: any }>, fallback: T, ms = 5000): Promise<T> {
  return Promise.race([
    query.then(r => r.data ?? fallback),
    new Promise<T>(res => setTimeout(() => res(fallback), ms)),
  ]);
}


const ResourceTrackCard = ({ track }: { track: any }) => {
  const [showGlossary, setShowGlossary] = useState(false);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 4, height: 20, background: track.color, borderRadius: 2 }} />
        <span style={{ fontWeight: 700, fontSize: 14, color: "#e2e8f0" }}>{track.track}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {track.resources.map((res: any) => (
          <a key={res.label} href={res.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          >
            <span style={{ fontSize: 13, color: "#cbd5e1" }}>{res.label}</span>
            <span style={{ fontSize: 10, color: track.color, fontWeight: 600, background: track.color + "20", padding: "2px 8px", borderRadius: 4 }}>{res.type}</span>
          </a>
        ))}
      </div>
      <button
        onClick={() => setShowGlossary(!showGlossary)}
        style={{ marginTop: 12, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: showGlossary ? track.color + "20" : "rgba(255,255,255,0.03)", border: "1px solid " + track.color + "40", borderRadius: 8, cursor: "pointer", transition: "all 0.2s" }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: track.color, letterSpacing: "0.05em" }}>📖 GLOSSARY</span>
        <span style={{ fontSize: 11, color: track.color }}>{showGlossary ? "▲ Hide" : "▼ Show " + track.glossary.length + " terms"}</span>
      </button>
      {showGlossary && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
          {track.glossary.map((item: any) => (
            <div key={item.term} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8, borderLeft: "3px solid " + track.color + "60" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: track.color, marginBottom: 2 }}>{item.term}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{item.def}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StudentPortal = () => {
  const { user, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();
  const { tier, tierName, hasFeature } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [subStatus, setSubStatus] = useState<'loading'|'active'|'none'>('active');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const checkSub = async () => {
      try {
        const { data: profile } = await supabase.from('profiles').select('tier').eq('user_id', user.id).maybeSingle();
        if (profile?.tier === 'starter') { setSubStatus('active'); return; }
        const { data } = await supabase.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle();
        setSubStatus(data?.status === 'active' ? 'active' : 'active'); // default to active — portal handles tier gating
      } catch {
        setSubStatus('active'); // on error, let them in
      }
    };
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setSubStatus('active');
      window.history.replaceState({}, '', '/portal');
    } else {
      checkSub();
    }
  }, [user]);

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

  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [showFounderWelcome, setShowFounderWelcome] = useState(false);

  // Initialize gates synchronously from localStorage — no Supabase dependency
  const _uid = getStoredUserId();
  const _today = new Date().toDateString();
  const [creedGateOpen, setCreedGateOpen] = useState(
    !_uid || localStorage.getItem(`creed-seen-date-${_uid}`) !== _today
  );
  const [needsCourseSelection, setNeedsCourseSelection] = useState(false);
  const [languageChecked, setLanguageChecked] = useState(false);
  const [starterCourseDone, setStarterCourseDone] = useState(false);
  const [starterFreeCourseId, setStarterFreeCourseId] = useState<string | null>(null);
  const [courseSelectionChecked, setCourseSelectionChecked] = useState(false);
  const [activeAgent, setActiveAgent] = useState('professor');
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [labsModalOpen, setLabsModalOpen] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [showLinkedInInput, setShowLinkedInInput] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Check if free user needs course selection
  useEffect(() => {
    if (!user || creedGateOpen || courseSelectionChecked) return;

    setLanguageChecked(true);

    const checkCourseSelection = async () => {
      const data = await sbFetch(
        supabase.from('profiles').select('tier, free_course_id').eq('user_id', user.id).maybeSingle(),
        null, 4000
      );
      if (data?.tier === 'starter' && !data?.free_course_id) {
        setNeedsCourseSelection(true);
      }
      if (data?.tier === 'starter' && data?.free_course_id) {
        setStarterFreeCourseId(data.free_course_id);
        const localDone = localStorage.getItem(`starter-course-done-${user.id}`);
        if (localDone === 'true' || (data as any)?.free_course_completed) setStarterCourseDone(true);
      }
      setCourseSelectionChecked(true);
    };
    checkCourseSelection();
  }, [user, creedGateOpen, courseSelectionChecked]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';
  
  // Load saved LinkedIn URL
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem('linkedin-url-' + user.id);
      if (saved) setLinkedInUrl(saved);
    }
  }, [user]);

  const saveLinkedIn = (url: string) => {
    setLinkedInUrl(url);
    if (user) localStorage.setItem('linkedin-url-' + user.id, url);
    setShowLinkedInInput(false);
  };
  const handleCloseFounderWelcome = () => {
    if (!user) return;
    const welcomeKey = `founder-welcome-seen-${user.id}`;
    localStorage.setItem(welcomeKey, 'true');
    setShowFounderWelcome(false);
  };

  useEffect(() => {
    if (user) {
      loadPortalData();
      // Sync creed gate with user ID now that it's resolved (localStorage uid may differ if user changed)
      const creedKey = `creed-seen-date-${user.id}`;
      const lastSeen = localStorage.getItem(creedKey);
      const today = new Date().toDateString();
      if (lastSeen === today) setCreedGateOpen(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;

    const welcomeKey = `founder-welcome-seen-${user.id}`;
    const alreadySeen = localStorage.getItem(welcomeKey);

    if (!alreadySeen) {
      setShowFounderWelcome(true);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadPortalData = async () => {
    if (!user) return;
    try {
    const [pointsData, labsData, suggestionsData, coursesData, chaptersData, videosData, quizzesData, progressData] = await Promise.all([
      sbFetch(supabase.from('student_points').select('points').eq('user_id', user.id), []),
      sbFetch(supabase.from('student_labs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }), []),
      sbFetch(supabase.from('ai_suggestions').select('*').eq('user_id', user.id).eq('dismissed', false).order('created_at', { ascending: false }).limit(10), []),
      sbFetch(supabase.from('courses').select('id, title, translations').eq('is_published', true), []),
      sbFetch(supabase.from('chapters').select('id, title, course_id, order_index, translations').order('order_index'), []),
      sbFetch(supabase.from('videos').select('id, chapter_id, order_index').order('order_index'), []),
      sbFetch(supabase.from('quizzes').select('id, video_id, chapter_id, quiz_type'), []),
      sbFetch(supabase.from('user_progress').select('quiz_id, completed_at').not('quiz_id', 'is', null), []),
    ]);
    // Normalise names to match rest of function
    const pointsRes = { data: pointsData };
    const labsRes = { data: labsData };
    const suggestionsRes = { data: suggestionsData };
    const coursesRes = { data: coursesData };
    const chaptersRes = { data: chaptersData };
    const videosRes = { data: videosData };
    const quizzesRes = { data: quizzesData };
    const progressRes = { data: progressData };

    setTotalPoints((pointsRes.data || []).reduce((s, p) => s + p.points, 0));
    setLabs(labsRes.data || []);
    setSuggestions(suggestionsRes.data || []);

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

    const passedQuizIds = (progressRes.data || []).map(p => p.quiz_id as string);

    // Build real progress from Supabase for any matching courses
    const dbProgresses: Record<string, any> = {};
    const filteredCourses = (coursesRes.data || []).filter(course =>
      !EXCLUDED_COURSES.some(ex => course.title.includes(ex))
    );
    filteredCourses.forEach(course => {
      const courseChapters = (chaptersRes.data || []).filter(ch => ch.course_id === course.id);
      const chapterQuizzes = (quizzesRes.data || []).filter(
        q => courseChapters.some(ch => ch.id === q.chapter_id) && q.quiz_type === 'chapter_end'
      );
      const completedQuizzes = chapterQuizzes.filter(q => passedQuizIds.includes(q.id)).length;
      const totalItems = courseChapters.length;
      dbProgresses[course.title.toLowerCase()] = {
        courseId: course.id,
        total: totalItems,
        completed: completedQuizzes,
        pct: totalItems > 0 ? Math.round((completedQuizzes / totalItems) * 100) : 0,
        nextChapterId: courseChapters.find(ch => {
          const chQuiz = chapterQuizzes.find(q => q.chapter_id === ch.id);
          return !chQuiz || !passedQuizIds.includes(chQuiz.id);
        })?.id || courseChapters[0]?.id,
      };
    });

    // NEW 28-program curriculum — always show these, overlay real progress where it exists
    const NEW_PROGRAMS = [
      // Engineering (8)
      { title:'AI Cloud Engineer', school:'⚙️ AI Engineering', weeks:32, icon:'☁️' },
      { title:'AI Agent Engineer', school:'⚙️ AI Engineering', weeks:30, icon:'🤖' },
      { title:'AI Data Engineer', school:'⚙️ AI Engineering', weeks:28, icon:'📊' },
      { title:'AI DevOps Engineer', school:'⚙️ AI Engineering', weeks:28, icon:'🔧' },
      { title:'AI Security Engineer', school:'⚙️ AI Engineering', weeks:26, icon:'🛡️' },
      { title:'AI MLOps Engineer', school:'⚙️ AI Engineering', weeks:28, icon:'🧬' },
      { title:'AI Solutions Architect', school:'⚙️ AI Engineering', weeks:32, icon:'🏗️' },
      { title:'AI Platform Engineer', school:'⚙️ AI Engineering', weeks:26, icon:'⚙️' },
      // Business (8)
      { title:'AI Solutions Consultant', school:'💼 AI Business', weeks:30, icon:'🧠' },
      { title:'AI Product Manager', school:'💼 AI Business', weeks:28, icon:'📱' },
      { title:'AI Business Operations', school:'💼 AI Business', weeks:24, icon:'⚡' },
      { title:'AI Sales Engineer', school:'💼 AI Business', weeks:24, icon:'💰' },
      { title:'AI Business Analyst', school:'💼 AI Business', weeks:26, icon:'📋' },
      { title:'AI Transformation Manager', school:'💼 AI Business', weeks:28, icon:'🔄' },
      { title:'AI Program Manager', school:'💼 AI Business', weeks:28, icon:'🗓️' },
      { title:'AI Enterprise Architect', school:'💼 AI Business', weeks:32, icon:'🏛️' },
      // Governance (7)
      { title:'AI Governance Professional', school:'⚖️ Governance & Risk', weeks:26, icon:'⚖️' },
      { title:'Responsible AI Specialist', school:'⚖️ Governance & Risk', weeks:24, icon:'🛡️' },
      { title:'AI Compliance Officer', school:'⚖️ Governance & Risk', weeks:24, icon:'📜' },
      { title:'AI Risk Manager', school:'⚖️ Governance & Risk', weeks:24, icon:'⚠️' },
      { title:'AI Auditor', school:'⚖️ Governance & Risk', weeks:22, icon:'🔍' },
      { title:'AI Policy Designer', school:'⚖️ Governance & Risk', weeks:22, icon:'📝' },
      { title:'AI Ethics Specialist', school:'⚖️ Governance & Risk', weeks:20, icon:'🤝' },
      // Human-AI (5)
      { title:'AI UX Designer', school:'🎨 Human-AI Experience', weeks:26, icon:'🎨' },
      { title:'Conversation Designer', school:'🎨 Human-AI Experience', weeks:24, icon:'💬' },
      { title:'Human-AI Interaction Specialist', school:'🎨 Human-AI Experience', weeks:24, icon:'🔬' },
      { title:'AI Workflow Designer', school:'🎨 Human-AI Experience', weeks:22, icon:'🔄' },
      { title:'AI Experience Architect', school:'🎨 Human-AI Experience', weeks:28, icon:'🏛️' },
    ];

    const progresses = NEW_PROGRAMS.map((prog, i) => {
      // Try to match real Supabase data by title
      const dbKey = Object.keys(dbProgresses).find(k =>
        k.includes(prog.title.toLowerCase()) || prog.title.toLowerCase().includes(k)
      );
      const db = dbKey ? dbProgresses[dbKey] : null;
      return {
        courseId: db?.courseId || `prog_${i + 1}`,
        title: prog.title,
        school: prog.school,
        icon: prog.icon,
        total: db?.total || prog.weeks,
        completed: db?.completed || 0,
        pct: db?.pct || 0,
        nextChapterId: db?.nextChapterId || null,
        isNew: !db,
      };
    });

    setCourseProgresses(progresses);
    } catch (err: any) {
      console.error('Portal load failed:', err);
    }
  };

  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || isStreaming) return;
    const userMsg: Msg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsStreaming(true);
    recordQuestion();
    const allMessages = [...chatMessages, userMsg];
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          agentKey: activeAgent,
          professorId: 'didier',
          language,
          history: chatMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error('Brain error');
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { role: 'assistant', content: t('portal.chat.error') }]);
    } finally {
      setIsStreaming(false);
    }
  }, [chatInput, isStreaming, chatMessages, language, recordQuestion]);

  // Only show spinner if we have NO stored user at all — never block a known user
  if (authLoading && !getStoredUserId()) {
    return (
      <div className="portal-root min-h-screen flex items-center justify-center">
        <GraduationCap className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  // Dynamic reminders based on student data
  const reminders = (() => {
    const items: { id: number; title: string; message: string; actionLabel: string; action: () => void; type: string }[] = [];
    let nextId = 1;

    // 1. Pending assignment — if student has courses but no quiz completion in last 24h
    const lastQuizDate = courseProgresses.length > 0 && streak === 0 ? true :
      courseProgresses.some(cp => cp.completed > 0 && cp.pct < 100);
    if (lastQuizDate && courseProgresses.length > 0) {
      const nextCourse = courseProgresses.find(cp => cp.pct < 100 && cp.pct > 0);
      if (nextCourse) {
        items.push({
          id: nextId++,
          title: t('portal.reminder.assignment.title'),
          message: t('portal.reminder.assignment.msg'),
          actionLabel: t('portal.reminder.assignment.btn'),
          action: () => nextCourse.nextChapterId
            ? navigate(`/course/${nextCourse.courseId}/chapter/${nextCourse.nextChapterId}`)
            : navigate('/courses'),
          type: 'assignment',
        });
      }
    }

    // 2. Start a new course — if any course is at 0%
    const unstartedCourse = courseProgresses.find(cp => cp.pct === 0);
    if (unstartedCourse) {
      items.push({
        id: nextId++,
        title: t('portal.course.start') + ': ' + unstartedCourse.title,
        message: t('portal.reminder.assignment.msg'),
        actionLabel: t('portal.course.start'),
        action: () => unstartedCourse.nextChapterId
          ? navigate(`/course/${unstartedCourse.courseId}/chapter/${unstartedCourse.nextChapterId}`)
          : navigate('/courses'),
        type: 'assignment',
      });
    }

    // 3. Manage subscription — always visible
    items.push({
      id: nextId++,
      title: t('portal.subscription.title'),
      message: t('portal.subscription.msg'),
      actionLabel: t('portal.subscription.btn'),
      action: async () => {
        if (!user) return;
        const { data: prof } = await supabase.from('profiles').select('tier').eq('user_id', user.id).maybeSingle();
        if (prof?.tier === 'starter') {
          const res = await fetch('/api/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TMWZP0Ctflq2xPfNXr5r24d', email: user.email, tier: 't2', userId: user.id,
              successUrl: `${window.location.origin}/portal?payment=success`, cancelUrl: `${window.location.origin}/portal` }) });
          const d = await res.json(); if (d.url) window.location.href = d.url;
        } else { window.open('https://billing.stripe.com/p/login/test_eVq9AL0OuaMWazPgo41VK00', '_blank'); }
      },
      type: 'payment',
    });

    // 4. Community — always encourage participation
    items.push({
      id: nextId++,
      title: t('portal.reminder.community.title'),
      message: t('portal.reminder.community.msg'),
      actionLabel: t('portal.reminder.community.btn'),
      action: () => navigate('/community'),
      type: 'community',
    });

    return items;
  })();

  const stats = [
    { icon: TrendingUp, label: t('portal.stat.progress'), value: `${overallProgress}%`, color: 'text-primary', onClick: () => setProgressModalOpen(true) },
    { icon: Flame, label: t('portal.stat.streak'), value: t('portal.stat.streak.days').replace('{n}', String(streak)), color: 'text-secondary', onClick: () => setStreakModalOpen(true) },
    { icon: Star, label: t('portal.stat.points'), value: totalPoints.toLocaleString(), color: 'text-accent', onClick: () => setPointsModalOpen(true) },
    { icon: FlaskConical, label: t('portal.stat.labs'), value: labs.filter(l => l.completed).length.toString(), color: 'text-primary', onClick: () => setLabsModalOpen(true) },
  ];

  // Payment gate — block portal if no active subscription
  if (subStatus === 'loading' && user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:'#0a0f1e'}}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Verifying your access...</p>
        </div>
      </div>
    );
  }

  if (subStatus === 'none') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{background:'linear-gradient(135deg,#0a0f1e,#0d1b3e)'}}>
        <div className="w-full max-w-lg text-center">
          <div className="mb-6 text-6xl">🎓</div>
          <h1 className="text-3xl font-bold text-white mb-3">Complete Your Enrollment</h1>
          <p className="text-white/60 mb-8 leading-relaxed">
            You need an active subscription to access the Aladiah Academy portal. Choose your plan to get started.
          </p>
          <div className="grid gap-4 mb-8">
            {[
              { name: 'Foundation Builder', price: 99, priceId: import.meta.env.VITE_STRIPE_PRICE_FOUNDATION, color: '#3b82f6', features: ['Full Scrum + PM curriculum', 'AI-powered lessons', 'Community access'] },
              { name: 'Career Accelerator', price: 299, priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR, color: '#C4A44A', popular: true, features: ['Everything in Foundation', 'AI Interview Coach', 'AI Resume Builder', 'Career Advisor'] },
              { name: 'Elite Mentorship', price: 499, priceId: import.meta.env.VITE_STRIPE_PRICE_ELITE, color: '#a855f7', features: ['Everything in Accelerator', 'Weekly 1-on-1 with Didier', 'VIP community status'] },
            ].map(plan => (
              <div key={plan.name} className="rounded-2xl p-5 text-left relative" style={{background:`${plan.color}15`, border:`1px solid ${plan.color}40`}}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{background:plan.color,color:'#0a0f1e'}}>MOST POPULAR</span>}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-bold">{plan.name}</span>
                  <span className="font-bold text-xl" style={{color:plan.color}}>${plan.price}/mo</span>
                </div>
                <div className="space-y-1 mb-4">
                  {plan.features.map((f,i) => <p key={i} className="text-xs" style={{color:'rgba(255,255,255,0.6)'}}>✓ {f}</p>)}
                </div>
                <button
                  onClick={async () => {
                    if (!user) return;
                    const res = await fetch('/api/create-checkout', {
                      method: 'POST',
                      headers: {'Content-Type':'application/json'},
                      body: JSON.stringify({ priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TMWZP0Ctflq2xPfNXr5r24d', userId: user.id, email: user.email, tier: 't2', successUrl: `${window.location.origin}/portal?payment=success`, cancelUrl: `${window.location.origin}/pricing` }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-sm transition-all"
                  style={{background:plan.color, color: plan.color === '#C4A44A' ? '#0a0f1e' : '#fff'}}
                >
                  Get Started — ${plan.price}/mo
                </button>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs">🔒 Secure payment via Stripe · Cancel anytime · 7-day money back guarantee</p>
        </div>
      </div>
    );
  }


  // Course selection gate — fires for new free users after creed
  if (!creedGateOpen && needsCourseSelection && user) {
    return (
      <CourseSelectionGate
        userId={user.id}
        onCourseSelected={() => { setNeedsCourseSelection(false); window.location.href = '/courses'; }}
      />
    );
  }

  // Creed acknowledgment gate — fires before portal access
  if (creedGateOpen) {
    return (
      <CreedAcknowledgmentGate
        studentName={firstName}
        onAcknowledge={() => {
          if (user) localStorage.setItem(`creed-seen-date-${user.id}`, new Date().toDateString());
          setCreedGateOpen(false);
        }}
      />
    );
  }

  // Starter paywall upgrade handler
  const handleStarterUpgrade = async () => {
    if (!user) return;
    const res = await fetch('/api/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TMWZP0Ctflq2xPfNXr5r24d',
        email: user.email, tier: 't2', userId: user.id,
        successUrl: `${window.location.origin}/portal?payment=success`, cancelUrl: `${window.location.origin}/portal` }) });
    const d = await res.json(); if (d.url) window.location.href = d.url;
  };

  // ─── Design tokens ────────────────────────────────────────────────────────
  const DS = {
    bg:'#0B111E', card:'#111D30', muted:'#18243A', border:'#1E2D47',
    fg:'#EDF2F7', fm:'#8596AD', fd:'#4A5E7A',
    blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
    orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
    gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
    green:'#22C98A', grd:'rgba(34,201,138,.12)',
    r:'.75rem',
  } as const;

  const SIDEBAR_LINKS = [
    { icon:'📊', label:'Overview',        path:'/portal',              key:'overview' },
    { icon:'📚', label:'My Courses',      path:'/portal/courses',      key:'courses',    badge: '28' },
    { icon:'⭐', label:'Talent Score™',   path:'/portal/talent-score', key:'talent-score' },
    { icon:'🏅', label:'Certifications',  path:'/portal',              key:'certifications' },
    { icon:'💼', label:'Career Tools',    path:'/portal/career',       key:'career' },
    { icon:'🗂️', label:'My Portfolio',    path:'/portal/portfolio',    key:'portfolio' },
    { icon:'🧪', label:'Labs',            path:'/portal',              key:'labs' },
    { icon:'📖', label:'Resources',       path:'/portal',              key:'resources' },
    { icon:'👥', label:'Community',       path:'/community',           key:'community' },
    { icon:'⚙️', label:'Settings',        path:'/portal/settings',     key:'settings' },
  ];

  const initials = (firstName?.slice(0,1) || user?.email?.slice(0,1) || 'A').toUpperCase() +
                   (user?.email?.split('@')[0]?.slice(1,2) || '').toUpperCase();

  const today = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}).toUpperCase();

  // Action center items (reminders already built above)
  const actionItems = reminders.map(r => ({
    title: r.title, sub: r.message,
    label: r.actionLabel, action: r.action,
    type: r.type,
  }));

  const btnColor = (type: string) => {
    if (type === 'assignment') return DS.blue;
    if (type === 'payment') return DS.gold;
    return 'transparent';
  };
  const btnTextColor = (type: string) => {
    if (type === 'payment') return '#0B111E';
    return '#fff';
  };

  const sidebarLink = (active: boolean): React.CSSProperties => ({
    display:'flex', alignItems:'center', gap:'.75rem',
    padding:'.65rem 1.5rem', fontSize:13,
    fontWeight: active ? 700 : 500,
    color: active ? DS.blue : DS.fm,
    background: active ? DS.bd : 'transparent',
    borderLeft: active ? `3px solid ${DS.blue}` : '3px solid transparent',
    textDecoration:'none', transition:'all .2s', cursor:'pointer',
  });

  return (
    <div style={{ background: DS.bg, minHeight:'100vh', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg, position:'relative' }}>

      {/* ─── Starter paywall overlay ─────────────────────────────────────── */}
      {starterCourseDone && (
        <div onClick={handleStarterUpgrade} style={{ position:'fixed', inset:0, zIndex:9999, cursor:'pointer', backdropFilter:'blur(6px)', background:'rgba(10,15,30,.75)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'linear-gradient(135deg,#0d1b3e,#0a0f1e)', border:'2px solid rgba(245,184,26,.5)', borderRadius:24, padding:36, maxWidth:480, width:'100%', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🎓</div>
            <h2 style={{ fontSize:24, fontWeight:800, color:'#fff', marginBottom:8 }}>You Completed Module 1!</h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,.6)', marginBottom:24, lineHeight:1.6 }}>Solo Excelencia. You proved you belong here.<br/>Unlock all courses and continue your journey.</p>
            <div style={{ background:'rgba(245,184,26,.1)', border:'1px solid rgba(245,184,26,.3)', borderRadius:14, padding:20, marginBottom:20 }}>
              <p style={{ fontSize:32, fontWeight:800, color:'#fff', margin:'0 0 4px 0' }}>$59.99<span style={{ fontSize:13, color:'rgba(255,255,255,.4)', fontWeight:400 }}>/month</span></p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,.4)', margin:0 }}>All courses · Cancel anytime · Certificates</p>
            </div>
            <button style={{ width:'100%', padding:16, borderRadius:12, background:'linear-gradient(135deg,#f59e0b,#d97706)', border:'none', color:'#000', fontSize:16, fontWeight:800, cursor:'pointer' }}>Unlock Full Access — $59.99/month →</button>
          </div>
        </div>
      )}

      {/* ─── Modals (keep existing) ──────────────────────────────────────── */}
      {showFounderWelcome && (
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ width:'100%', maxWidth:600, background:DS.card, border:`1px solid ${DS.border}`, borderRadius:16, padding:32 }}>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>{t("portal.welcome.title").replace("{name}", firstName)}</h2>
            <p style={{ fontSize:14, color:DS.fm, marginBottom:16 }}>{t('portal.welcome.sub')}</p>
            <div style={{ fontSize:14, color:DS.fm, lineHeight:1.7 }}>
              <p style={{ marginBottom:8 }}>{t('portal.welcome.p1')}</p>
              <p style={{ marginBottom:8 }}>{t('portal.welcome.p2')}</p>
              <p style={{ marginBottom:16 }}>{t('portal.welcome.p3')}</p>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={handleCloseFounderWelcome} style={{ padding:'10px 20px', background:DS.blue, color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer' }}>{t('portal.welcome.enter')}</button>
              <button onClick={() => navigate('/community')} style={{ padding:'10px 20px', background:'transparent', color:DS.fg, border:`1px solid ${DS.border}`, borderRadius:8, fontWeight:600, cursor:'pointer' }}>{t('portal.welcome.community')}</button>
            </div>
          </div>
        </div>
      )}

      {showProfile && <StudentProfileWidget user={user} onClose={() => setShowProfile(false)} />}

      {/* LinkedIn modal */}
      {showLinkedInInput && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#0d1f3c', border:'1px solid rgba(59,130,246,.3)', borderRadius:16, padding:28, width:'100%', maxWidth:400 }}>
            <h3 style={{ color:'#fff', fontWeight:700, fontSize:16, marginBottom:8 }}>💼 {t('portal.linkedin.title')}</h3>
            <p style={{ color:'rgba(255,255,255,.5)', fontSize:12, marginBottom:16 }}>{t('portal.linkedin.desc')}</p>
            <input type="url" placeholder="https://linkedin.com/in/yourname" defaultValue={linkedInUrl} id="linkedin-input"
              style={{ width:'100%', background:'rgba(255,255,255,.07)', border:'1px solid rgba(59,130,246,.3)', borderRadius:10, padding:'10px 14px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:16 }} />
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => { const v = (document.getElementById('linkedin-input') as HTMLInputElement)?.value; if (v) saveLinkedIn(v); }}
                style={{ flex:1, background:'linear-gradient(135deg,#0a66c2,#1e40af)', color:'#fff', border:'none', borderRadius:10, padding:10, fontSize:13, fontWeight:700, cursor:'pointer' }}>{t('portal.linkedin.save')}</button>
              <button onClick={() => setShowLinkedInInput(false)}
                style={{ background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.6)', border:'1px solid rgba(255,255,255,.15)', borderRadius:10, padding:'10px 16px', fontSize:13, cursor:'pointer' }}>{t('portal.linkedin.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <Header onProfileClick={() => setShowProfile(true)} />

      {/* ─── Portal layout: sidebar + main ───────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'100vh', paddingTop:70 }}>

        {/* ── Sidebar ── */}
        <aside style={{ background:DS.card, borderRight:`1px solid ${DS.border}`, padding:'1.75rem 0', position:'sticky', top:70, height:'calc(100vh - 70px)', overflowY:'auto' }}>
          {/* User block */}
          <div style={{ padding:'1.25rem 1.5rem 1.5rem', borderBottom:`1px solid ${DS.border}` }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#4A90F5,#7AB5FF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'#fff', marginBottom:'.65rem' }}>{initials}</div>
            <div style={{ fontSize:14, fontWeight:700 }}>{firstName || user?.email?.split('@')[0] || 'Student'}</div>
            <div style={{ fontSize:11, color:DS.fm, marginTop:2 }}>Plan: <span style={{ color:DS.gold, fontWeight:600 }}>All-Access Pass™</span></div>
          </div>

          {/* Nav links */}
          <div style={{ padding:'.75rem 0' }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:DS.fd, padding:'.5rem 1.5rem .25rem' }}>Dashboard</div>
            {SIDEBAR_LINKS.map(link => {
              const active = link.key === activeTab;
              return (
                <a key={link.key}
                  onClick={e => {
                    e.preventDefault();
                    if (link.path !== '/portal') {
                      navigate(link.path);
                    } else {
                      setActiveTab(link.key);
                    }
                  }}
                  style={sidebarLink(active)}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(74,144,245,.06)'; (e.currentTarget as HTMLElement).style.color = DS.fg; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = DS.fm; } }}
                >
                  <span style={{ width:18, textAlign:'center', flexShrink:0 }}>{link.icon}</span>
                  {link.label}
                  {link.badge && <span style={{ marginLeft:'auto', fontSize:10, background:DS.orange, color:'#fff', borderRadius:999, padding:'1px 7px', fontWeight:700 }}>{link.badge}</span>}
                </a>
              );
            })}

            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:DS.fd, padding:'.75rem 1.5rem .25rem', marginTop:4 }}>Account</div>
            <a onClick={() => navigate('/portal/settings')} style={sidebarLink(false)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,144,245,.06)'; (e.currentTarget as HTMLElement).style.color = DS.fg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = DS.fm; }}>
              <span style={{ width:18, textAlign:'center' }}>⚙️</span> Settings
            </a>
            <a href="https://www.aladiahmanagement.com" target="_blank" rel="noopener noreferrer"
              style={{ ...sidebarLink(false), textDecoration:'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,144,245,.06)'; (e.currentTarget as HTMLElement).style.color = DS.fg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = DS.fm; }}>
              <span style={{ width:18, textAlign:'center' }}>🏢</span> Aladiah Management
            </a>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ padding:'2rem', background:DS.bg, overflowY:'auto' }}>

          {/* ── Overview tab ── */}
          {activeTab === 'overview' && (
            <>
              {/* Page header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:DS.fm, marginBottom:'.25rem' }}>{today}</div>
                  <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:DS.fg }}>{firstName || user?.email?.split('@')[0] || 'Student'}'s Success Portal</h1>
                  <div style={{ fontSize:13, color:DS.fm, marginTop:'.2rem' }}>
                    Welcome back. Your next milestone:{' '}
                    <span style={{ color:DS.blue, fontWeight:600 }}>
                      {courseProgresses.find(cp => cp.pct < 100)
                        ? `Complete ${courseProgresses.find(cp => cp.pct < 100)?.title?.split(' ').slice(0,4).join(' ')}`
                        : 'All courses complete! 🎉'}
                    </span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'.65rem' }}>
                  <button onClick={() => navigate('/portal/talent-score')} style={{ fontSize:12, fontWeight:700, padding:'.48rem 1rem', borderRadius:'.5rem', background:DS.gd, color:DS.gold, border:`1px solid ${DS.gb}`, cursor:'pointer' }}>
                    ⭐ My Score: {totalPoints}
                  </button>
                  <button onClick={() => {
                    const next = courseProgresses.find(cp => cp.pct < 100);
                    if (next?.nextChapterId) navigate(`/course/${next.courseId}/chapter/${next.nextChapterId}`);
                    else navigate('/courses');
                  }} style={{ fontSize:12, fontWeight:700, padding:'.48rem 1rem', borderRadius:'.5rem', background:DS.blue, color:'#fff', border:'none', cursor:'pointer' }}>
                    Continue Learning →
                  </button>
                </div>
              </div>

              {/* Action Center */}
              <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1.5rem', marginBottom:'1.5rem', borderLeft:`3px solid ${DS.blue}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'1rem' }}>
                  <span style={{ color:DS.blue }}>⚡</span>
                  <span style={{ fontSize:14, fontWeight:700 }}>Action Center</span>
                  <span style={{ fontSize:12, color:DS.fm }}>— Stay on top of your assignments and important actions.</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
                  {actionItems.map((item, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.85rem 1rem', background: item.type === 'assignment' ? 'rgba(74,144,245,.06)' : item.type === 'payment' ? DS.gd : 'rgba(34,201,138,.04)', border:`1px solid ${item.type === 'assignment' ? DS.bb : item.type === 'payment' ? DS.gb : 'rgba(30,45,71,.6)'}`, borderRadius:'calc(.75rem - 2px)', flexWrap:'wrap', gap:'.5rem' }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700 }}>{item.title}</div>
                        <div style={{ fontSize:12, color:DS.fm }}>{item.sub}</div>
                      </div>
                      <button onClick={item.action} style={{ fontSize:12, fontWeight:700, padding:'.48rem 1rem', borderRadius:'.5rem', background: btnColor(item.type), color: item.type === 'payment' ? '#0B111E' : item.type === 'community' ? DS.fg : '#fff', border: item.type === 'community' ? `1px solid ${DS.border}` : 'none', cursor:'pointer', whiteSpace:'nowrap' }}>
                        {item.label} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.75rem' }}>
                {[
                  { val: `${overallProgress}%`, lbl:'Overall Progress', color:DS.blue, onClick: () => setProgressModalOpen(true) },
                  { val: String(streak), lbl:'Day Streak 🔥', color:DS.orange, onClick: () => setStreakModalOpen(true) },
                  { val: totalPoints.toLocaleString(), lbl:'Points Earned', color:DS.gold, onClick: () => setPointsModalOpen(true) },
                  { val: String(labs.filter(l => l.completed).length), lbl:'Labs Completed', color:DS.green, onClick: () => setLabsModalOpen(true) },
                ].map((s, i) => (
                  <div key={i} onClick={s.onClick} style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1.1rem 1.25rem', textAlign:'center', cursor:'pointer', transition:'all .2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = DS.bb}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = DS.border}>
                    <div style={{ fontSize:'1.75rem', fontWeight:800, color:s.color, lineHeight:1, marginBottom:3 }}>{s.val}</div>
                    <div style={{ fontSize:11, color:DS.fm }}>{s.lbl}</div>
                  </div>
                ))}
              </div>

              {/* Course Progress */}
              <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1.5rem', marginBottom:'1.5rem' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                    <span style={{ color:DS.blue }}>🎓</span>
                    <span style={{ fontSize:14, fontWeight:700 }}>AI Workforce Programs</span>
                    <span style={{ fontSize:11, color:DS.fm }}>— 28 programs across 4 schools</span>
                  </div>
                  <a onClick={() => navigate('/portal/courses')} style={{ fontSize:12, fontWeight:700, color:DS.blue, cursor:'pointer' }}>View All →</a>
                </div>

                {/* Group by school */}
                {['⚙️ AI Engineering','💼 AI Business','⚖️ Governance & Risk','🎨 Human-AI Experience'].map(school => {
                  const schoolColors: Record<string,{color:string,colorD:string,colorB:string}> = {
                    '⚙️ AI Engineering': {color:DS.blue,colorD:DS.bd,colorB:DS.bb},
                    '💼 AI Business': {color:DS.orange,colorD:DS.od,colorB:DS.ob},
                    '⚖️ Governance & Risk': {color:DS.gold,colorD:DS.gd,colorB:DS.gb},
                    '🎨 Human-AI Experience': {color:DS.green,colorD:DS.grd,colorB:'rgba(34,201,138,.28)'},
                  };
                  const sc = schoolColors[school];
                  const schoolProgs = courseProgresses.filter((cp:any) => cp.school === school);
                  if (schoolProgs.length === 0) return null;
                  return (
                    <div key={school} style={{ marginBottom:'1rem' }}>
                      {/* School header */}
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.5rem .75rem', background: sc.colorD, border:`1px solid ${sc.colorB}`, borderRadius:'.5rem .5rem 0 0', marginBottom:0 }}>
                        <span style={{ fontSize:11, fontWeight:800, textTransform:'uppercase' as const, letterSpacing:'.5px', color:sc.color }}>{school}</span>
                        <span style={{ fontSize:10, fontWeight:700, color:sc.color }}>{schoolProgs.length} programs</span>
                      </div>
                      {/* Programs */}
                      <div style={{ border:`1px solid ${sc.colorB}`, borderTop:'none', borderRadius:'0 0 .5rem .5rem', overflow:'hidden' }}>
                        {schoolProgs.map((cp:any, i:number) => (
                          <div key={cp.courseId} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.85rem 1rem', borderBottom: i < schoolProgs.length-1 ? `1px solid rgba(255,255,255,.04)` : 'none', cursor:'pointer', transition:'background .15s' }}
                            onClick={() => cp.nextChapterId ? navigate(`/course/${cp.courseId}/chapter/${cp.nextChapterId}`) : navigate('/courses')}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.03)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                            <div style={{ display:'flex', alignItems:'center', gap:'.75rem', flex:1, minWidth:0 }}>
                              <div style={{ width:26, height:26, borderRadius:'50%', background: sc.colorD, border:`2px solid ${sc.colorB}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:sc.color, flexShrink:0 }}>
                                {i + 1 + (['⚙️ AI Engineering','💼 AI Business','⚖️ Governance & Risk','🎨 Human-AI Experience'].indexOf(school) * 8)}
                              </div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:13, fontWeight:700, color:DS.fg, display:'flex', alignItems:'center', gap:'.4rem' }}>
                                  {cp.title}
                                  {cp.isNew && <span style={{ fontSize:9, fontWeight:800, padding:'1px 6px', borderRadius:999, background:sc.colorD, color:sc.color, border:`1px solid ${sc.colorB}`, letterSpacing:.5 }}>NEW</span>}
                                </div>
                                <div style={{ fontSize:10, color:DS.fm, marginTop:2 }}>{cp.pct}% complete · {cp.completed}/{cp.total} lessons · L100–L700</div>
                                <div style={{ height:3, background:'rgba(255,255,255,.06)', borderRadius:2, marginTop:4, overflow:'hidden' }}>
                                  <div style={{ height:'100%', width:`${cp.pct}%`, background:`linear-gradient(90deg,${sc.color},${sc.color}99)`, borderRadius:2 }}/>
                                </div>
                              </div>
                            </div>
                            <button onClick={e => { e.stopPropagation(); cp.nextChapterId ? navigate(`/course/${cp.courseId}/chapter/${cp.nextChapterId}`) : navigate('/courses'); }}
                              style={{ fontSize:11, fontWeight:700, padding:'.38rem .85rem', borderRadius:'.5rem', background:'transparent', color:DS.fg, border:`1px solid ${DS.border}`, cursor:'pointer', marginLeft:'.75rem', flexShrink:0 }}>
                              {cp.pct > 0 ? 'Continue →' : 'Start →'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Knowledge graph + Talent Score side by side */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'1.5rem' }}>
                {/* Knowledge Graph */}
                <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1.5rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'1.1rem' }}>
                    <span style={{ color:DS.blue }}>🕸️</span>
                    <span style={{ fontSize:14, fontWeight:700 }}>Knowledge Graph</span>
                  </div>
                  <KnowledgeGraph
                    weakAreas={learningProfile ? (learningProfile.weakAreas?.map((w: any) => typeof w === 'string' ? w : w.topic) || []) : []}
                    strongAreas={learningProfile ? (learningProfile.strongAreas?.map((s: any) => typeof s === 'string' ? s : s.topic) || []) : []}
                    onTopicSelect={() => setActiveTab('labs')}
                  />
                </div>

                {/* Talent Score mini */}
                <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1.5rem', textAlign:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'1.1rem', justifyContent:'center' }}>
                    <span style={{ color:DS.gold }}>⭐</span>
                    <span style={{ fontSize:14, fontWeight:700 }}>Talent Score™</span>
                  </div>
                  {/* Ring */}
                  <div style={{ position:'relative', width:120, height:120, margin:'0 auto 1rem' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform:'rotate(-90deg)' }}>
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10"/>
                      <circle cx="60" cy="60" r="52" fill="none" stroke={DS.gold} strokeWidth="10" strokeDasharray={`${(totalPoints/1000)*2*Math.PI*52} ${2*Math.PI*52}`} strokeLinecap="round"/>
                    </svg>
                    <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
                      <div style={{ fontSize:'1.6rem', fontWeight:800, color:DS.gold, lineHeight:1 }}>{totalPoints}</div>
                      <div style={{ fontSize:9, color:DS.fm, letterSpacing:.5 }}>/ 1000</div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/portal/talent-score')} style={{ fontSize:12, fontWeight:700, padding:'.48rem 1rem', borderRadius:'.5rem', background:DS.gd, color:DS.gold, border:`1px solid ${DS.gb}`, cursor:'pointer' }}>
                    View Full Breakdown →
                  </button>
                </div>
              </div>

              {/* Quick nav cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'1rem', marginBottom:'2rem' }}>
                {[
                  { icon:'👥', label:'Community', path:'/community' },
                  { icon:'⚔️', label:'Sprint Sim', path:'/simulation' },
                  { icon:'🎤', label:'Interview', path:'/interview' },
                  { icon:'🎁', label:'Referrals', path:'/referral' },
                  { icon:'🛍️', label:'Store', path:'/store' },
                ].map((a, i) => (
                  <div key={i} onClick={() => navigate(a.path)} style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1rem', textAlign:'center', cursor:'pointer', transition:'all .2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = DS.bb; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = DS.border; (e.currentTarget as HTMLElement).style.transform = ''; }}>
                    <div style={{ fontSize:22, marginBottom:4 }}>{a.icon}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:DS.fm }}>{a.label}</div>
                  </div>
                ))}
              </div>

              {/* Foundation Library + Enterprise Simulations — recommendation section */}
              <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1.25rem 1.5rem', marginBottom:'1rem', borderLeft:`3px solid ${DS.gold}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.35rem' }}>
                  <span style={{ fontSize:16 }}>💡</span>
                  <span style={{ fontSize:14, fontWeight:700, color:DS.fg }}>New to AI? Start with the Foundation Library</span>
                </div>
                <p style={{ fontSize:12, color:DS.fm, lineHeight:1.65, marginBottom:'1rem' }}>
                  If you're new to IT, Agile, or AI tools — start here. These 8 foundational programs are the bedrock of the Aladiah curriculum.
                  Each earns an <strong style={{ color:DS.gold }}>Aladiah Associate™</strong> credential and counts toward your Talent Score™.
                  Many feed directly into the 28 AI Workforce Programs above.
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'.75rem' }}>
                  {[
                    { icon:'👥', title:'Scrum Master Certification', weeks:'8 weeks', color:DS.blue },
                    { icon:'🎯', title:'Project Management Professional', weeks:'12 weeks', color:DS.blue },
                    { icon:'🤖', title:'AI Tools for Managers', weeks:'6 weeks', color:DS.orange },
                    { icon:'🛡️', title:'Cybersecurity Professional', weeks:'10 weeks', color:DS.orange },
                    { icon:'🏗️', title:'Solution Architect', weeks:'12 weeks', color:DS.blue },
                    { icon:'📊', title:'Data Analytics Professional', weeks:'8 weeks', color:DS.orange },
                    { icon:'☁️', title:'DevOps & Cloud Engineering', weeks:'10 weeks', color:DS.blue },
                    { icon:'📋', title:'Business Analysis Professional', weeks:'8 weeks', color:DS.orange },
                  ].map((c, i) => (
                    <div key={i} onClick={() => navigate('/courses')} style={{ background:DS.muted, border:`1px solid ${DS.border}`, borderRadius:'.65rem', padding:'1rem', cursor:'pointer', transition:'all .2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.color + '60'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = DS.border; (e.currentTarget as HTMLElement).style.transform = ''; }}>
                      <div style={{ width:36, height:36, borderRadius:'.5rem', background: c.color + '22', border:`1px solid ${c.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:'.6rem' }}>{c.icon}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:DS.fg, marginBottom:'.25rem', lineHeight:1.3 }}>{c.title}</div>
                      <div style={{ fontSize:10, color:DS.fm, marginBottom:'.6rem' }}>⏱ {c.weeks} · Online</div>
                      <button onClick={e => { e.stopPropagation(); navigate('/courses'); }}
                        style={{ width:'100%', padding:'.4rem', borderRadius:'.4rem', fontSize:11, fontWeight:700, color:'#fff', background:c.color, border:'none', cursor:'pointer' }}>
                        Start Course →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full AI programs section */}
              <CoursesSection progressData={courseProgresses.reduce((acc: Record<string,any>, cp: any) => {
                if (cp.courseId) acc[`prog_${cp.courseId}`] = { progress: cp.pct || 0, completedLessons: cp.completed || 0, totalLessons: cp.total || 0 };
                return acc;
              }, {})} />
            </>
          )}

          {/* ── Labs tab ── */}
          {activeTab === 'labs' && (
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:'1.75rem' }}>Labs</h1>
              <AnimatePresence mode="wait">
                {labModeActive ? (
                  <LabMode key="lab-mode" topic={labTopic}
                    studentContext={{ courseProgress: overallProgress, points: totalPoints, streak, weakAreas: [] }}
                    onExit={() => { setLabModeActive(false); setLabTopic(''); setLabSearch(''); }} />
                ) : (
                  <motion.div key="lab-list" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1.5rem', marginBottom:'1.5rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.75rem' }}>
                        <span>🧪</span>
                        <span style={{ fontSize:14, fontWeight:700 }}>{t('portal.labs.title')}</span>
                      </div>
                      <p style={{ fontSize:13, color:DS.fm, marginBottom:'1rem' }}>{t('portal.labs.desc')}</p>
                      <form onSubmit={e => { e.preventDefault(); if (labSearch.trim()) { setLabTopic(labSearch.trim()); setLabModeActive(true); } }} style={{ display:'flex', gap:'.5rem' }}>
                        <input value={labSearch} onChange={e => setLabSearch(e.target.value)} placeholder={t('portal.labs.placeholder')}
                          style={{ flex:1, background:DS.muted, border:`1px solid ${DS.border}`, borderRadius:'.5rem', padding:'.62rem .9rem', color:DS.fg, fontFamily:'inherit', fontSize:13, outline:'none' }}/>
                        <button type="submit" style={{ padding:'.62rem 1.25rem', background:DS.blue, color:'#fff', border:'none', borderRadius:'.5rem', fontWeight:700, fontSize:13, cursor:'pointer' }}>🧪 {t('portal.labs.btn')}</button>
                      </form>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginTop:'.75rem' }}>
                        {['Scrum Events','Product Owner Role','Sprint Retrospective','Agile vs Waterfall','User Stories'].map(topic => (
                          <button key={topic} onClick={() => { setLabTopic(topic); setLabModeActive(true); }}
                            style={{ fontSize:12, padding:'.38rem .75rem', borderRadius:'.5rem', background:'transparent', color:DS.fg, border:`1px solid ${DS.border}`, cursor:'pointer' }}>{topic}</button>
                        ))}
                      </div>
                    </div>
                    {labs.length > 0 && (
                      <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1.5rem' }}>
                        <div style={{ fontSize:14, fontWeight:700, marginBottom:'1rem' }}>Previous Labs</div>
                        <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                          {labs.map(lab => {
                            const topic = typeof lab.lab_content === 'object' && lab.lab_content?.topic ? lab.lab_content.topic : 'Lab Session';
                            return (
                              <div key={lab.id} onClick={() => { setLabTopic(topic); setLabModeActive(true); }}
                                style={{ padding:'1rem', background:'rgba(255,255,255,.02)', border:`1px solid ${DS.border}`, borderRadius:'.5rem', cursor:'pointer' }}>
                                <div style={{ fontSize:13, fontWeight:600 }}>{topic}</div>
                                <div style={{ fontSize:11, color:DS.fm, marginTop:2 }}>{new Date(lab.created_at).toLocaleDateString()} · Click to re-enter</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Career tab ── */}
          {activeTab === 'career' && (
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:'1.75rem' }}>Career Tools</h1>
              <CareerTools overallProgress={overallProgress} onSwitchToAssistant={(prompt) => { setActiveTab('assistant'); setChatInput(prompt); }} />
              <div style={{ marginTop:'1.5rem' }}>
                <YouTubeRecommendations
                  weakAreas={(learningProfile?.weakAreas || []).map((w: any) => typeof w === 'string' ? w : w.topic || String(w))}
                  recentQuestions={chatMessages.filter(m => m.role === 'user').map(m => m.content).slice(-5)}
                  currentTopic={courseProgresses.length > 0 ? courseProgresses.sort((a,b) => b.pct - a.pct)[0]?.title || 'Scrum Master' : 'Scrum Master'}
                  onSwitchToAssistant={(prompt) => { setActiveTab('assistant'); setChatInput(prompt); }}
                />
              </div>
            </div>
          )}

          {/* ── Assistant tab ── */}
          {activeTab === 'assistant' && (
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:'1.75rem' }}>Prof. Didier AI</h1>
              <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, display:'flex', flexDirection:'column', height:600 }}>
                <div style={{ flex:1, overflowY:'auto', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
                  {chatMessages.length === 0 && (
                    <div style={{ textAlign:'center', padding:'3rem 1rem', color:DS.fm }}>
                      <div style={{ fontSize:48, marginBottom:'1rem' }}>🤖</div>
                      <div style={{ fontSize:15, fontWeight:600, marginBottom:'.5rem' }}>{t('portal.chat.empty')}</div>
                      <div style={{ fontSize:13, marginBottom:'1.5rem' }}>{t('portal.chat.try')}</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', justifyContent:'center', maxWidth:400, margin:'0 auto' }}>
                        {['Explain the Scrum framework','Help me build my resume','What topics should I focus on?','Suggest YouTube videos for Sprint Planning'].map(q => (
                          <button key={q} onClick={() => setChatInput(q)}
                            style={{ fontSize:12, padding:'.5rem .85rem', borderRadius:'.5rem', background:'transparent', color:DS.fm, border:`1px solid ${DS.border}`, cursor:'pointer' }}>{q}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth:'80%', borderRadius:14, padding:'10px 14px', fontSize:13, background: m.role === 'user' ? DS.blue : DS.muted, color: DS.fg, borderBottomRightRadius: m.role === 'user' ? 4 : 14, borderBottomLeftRadius: m.role === 'user' ? 14 : 4 }}>
                        {m.role === 'assistant' ? <div className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{m.content}</ReactMarkdown></div> : <p style={{ whiteSpace:'pre-wrap', margin:0 }}>{m.content}</p>}
                      </div>
                    </div>
                  ))}
                  {isStreaming && (
                    <div style={{ display:'flex', gap:4 }}>
                      {[0,.1,.2].map((d,i) => <div key={i} style={{ width:8, height:8, background:`${DS.blue}66`, borderRadius:'50%', animation:'bounce 1s infinite', animationDelay:`${d}s` }}/>)}
                    </div>
                  )}
                  <div ref={chatEndRef}/>
                </div>
                <div style={{ padding:'1rem', borderTop:`1px solid ${DS.border}` }}>
                  <AgentSelector activeAgent={activeAgent} onSelect={setActiveAgent} />
                  <form onSubmit={e => { e.preventDefault(); sendChat(); }} style={{ display:'flex', gap:'.5rem', marginTop:'.75rem' }}>
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={t('portal.chat.placeholder')} disabled={isStreaming}
                      style={{ flex:1, background:DS.muted, border:`1px solid ${DS.border}`, borderRadius:'.5rem', padding:'.62rem .9rem', color:DS.fg, fontFamily:'inherit', fontSize:13, outline:'none' }}/>
                    <button type="submit" disabled={isStreaming || !chatInput.trim()}
                      style={{ padding:'.62rem 1rem', background: isStreaming || !chatInput.trim() ? DS.muted : DS.blue, color: isStreaming || !chatInput.trim() ? DS.fm : '#fff', border:'none', borderRadius:'.5rem', fontWeight:700, cursor: isStreaming || !chatInput.trim() ? 'not-allowed' : 'pointer' }}>Send</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ── Resources tab ── */}
          {activeTab === 'resources' && (
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:'1.75rem' }}>Resources Library</h1>
              <div style={{ position:'relative' }}>
                {tier === 'starter' && (
                  <div style={{ position:'absolute', inset:0, zIndex:10, backdropFilter:'blur(6px)', background:'rgba(10,15,30,.5)', borderRadius:12, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
                    <span style={{ fontSize:32 }}>🔒</span>
                    <p style={{ color:'#fff', fontWeight:700, fontSize:16 }}>Unlock Full Access</p>
                    <p style={{ color:DS.fm, fontSize:13, textAlign:'center', maxWidth:280 }}>Upgrade to access all resources, guides and official documentation</p>
                    <button onClick={handleStarterUpgrade} style={{ background:DS.gold, color:'#000', fontWeight:800, padding:'10px 24px', borderRadius:8, border:'none', cursor:'pointer', fontSize:14 }}>Upgrade — $59.99/month</button>
                  </div>
                )}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                  {[
                    { track:'📘 Scrum Master', color:'#3b82f6', resources:[
                        {label:'Scrum Guide 2020',url:'https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf',type:'PDF'},
                        {label:'Scrum.org PSM I Practice',url:'https://www.scrum.org/open-assessments/scrum-open',type:'Practice Exam'},
                        {label:'SAFe 6.0 Framework',url:'https://scaledagile.com/what-is-safe/',type:'Framework'},
                        {label:'Agile Manifesto',url:'https://agilemanifesto.org/',type:'Reference'},
                      ], glossary:[]},
                    { track:'📊 Project Management', color:'#8b5cf6', resources:[
                        {label:'PMBOK Guide',url:'https://www.pmi.org/pmbok-guide-standards/foundational/pmbok',type:'Standard'},
                        {label:'PMP Exam Content Outline',url:'https://www.pmi.org/certifications/project-management-pmp',type:'Guide'},
                        {label:'Agile Practice Guide',url:'https://www.pmi.org/pmbok-guide-standards/agile',type:'Guide'},
                      ], glossary:[]},
                    { track:'🤖 AI Mastery', color:'#f59e0b', resources:[
                        {label:'Google AI Essentials',url:'https://grow.google/certificates/ai-essentials/',type:'Course'},
                        {label:'Prompt Engineering Guide',url:'https://www.promptingguide.ai/',type:'Guide'},
                        {label:'DeepLearning.AI Short Courses',url:'https://www.deeplearning.ai/short-courses/',type:'Course'},
                      ], glossary:[]},
                    { track:'🔐 Cybersecurity', color:'#ef4444', resources:[
                        {label:'CompTIA Security+ Guide',url:'https://www.comptia.org/certifications/security',type:'Cert'},
                        {label:'NIST Cybersecurity Framework',url:'https://www.nist.gov/cyberframework',type:'Framework'},
                        {label:'OWASP Top 10',url:'https://owasp.org/www-project-top-ten/',type:'Guide'},
                      ], glossary:[]},
                    { track:'📈 Data Analytics', color:'#10b981', resources:[
                        {label:'Google Data Analytics',url:'https://grow.google/certificates/data-analytics/',type:'Course'},
                        {label:'SQL Tutorial',url:'https://www.w3schools.com/sql/',type:'Tutorial'},
                        {label:'Kaggle Learn',url:'https://www.kaggle.com/learn',type:'Course'},
                      ], glossary:[]},
                    { track:'☁️ DevOps & Cloud', color:'#06b6d4', resources:[
                        {label:'AWS Cloud Practitioner',url:'https://aws.amazon.com/certification/certified-cloud-practitioner/',type:'Cert'},
                        {label:'Docker Documentation',url:'https://docs.docker.com/get-started/',type:'Docs'},
                        {label:'Kubernetes Basics',url:'https://kubernetes.io/docs/tutorials/kubernetes-basics/',type:'Tutorial'},
                      ], glossary:[]},
                    { track:'🏗️ Solution Architect', color:'#f97316', resources:[
                        {label:'AWS Solutions Architect',url:'https://aws.amazon.com/certification/certified-solutions-architect-associate/',type:'Cert'},
                        {label:'AWS Well-Architected Framework',url:'https://aws.amazon.com/architecture/well-architected/',type:'Framework'},
                        {label:'TOGAF Framework',url:'https://www.opengroup.org/togaf',type:'Framework'},
                      ], glossary:[]},
                    { track:'📋 Business Analysis', color:'#a855f7', resources:[
                        {label:'BABOK Guide',url:'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/',type:'Standard'},
                        {label:'PMI-PBA Certification',url:'https://www.pmi.org/certifications/business-analysis-pba',type:'Cert'},
                        {label:'Lucidchart Free',url:'https://www.lucidchart.com/',type:'Tool'},
                      ], glossary:[]},
                  ].map(track => <ResourceTrackCard key={track.track} track={track} />)}
                </div>
              </div>
            </div>
          )}

          {/* ── Rewards tab ── */}
          {activeTab === 'rewards' && (
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:'1.75rem' }}>Rewards</h1>
              <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'1.5rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
                  <div>
                    <h3 style={{ fontSize:18, fontWeight:700 }}>⭐ {t('portal.rewards.title')}</h3>
                    <p style={{ fontSize:13, color:DS.fm }}>{t('portal.rewards.sub')}</p>
                  </div>
                  <div style={{ textAlign:'right', cursor:'pointer' }} onClick={() => setPointsModalOpen(true)}>
                    <p style={{ fontSize:'2rem', fontWeight:800, color:DS.gold }}>{totalPoints}</p>
                    <p style={{ fontSize:11, color:DS.fm }}>total points</p>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
                  {[
                    {action:t('portal.rewards.comment'),pts:'+5',icon:'💬'},
                    {action:t('portal.rewards.lab'),pts:'+5',icon:'🧪'},
                    {action:t('portal.rewards.quiz'),pts:'+5',icon:'🏆'},
                    {action:t('portal.rewards.login'),pts:'+1',icon:'🔥'},
                    {action:t('portal.rewards.refer'),pts:'+200',icon:'🎁'},
                    {action:t('portal.rewards.collab'),pts:'+2',icon:'📖'},
                  ].map((item, i) => (
                    <div key={i} onClick={() => setPointsModalOpen(true)} style={{ padding:'1rem', background:DS.muted, border:`1px solid ${DS.border}`, borderRadius:'.5rem', textAlign:'center', cursor:'pointer' }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{item.icon}</div>
                      <p style={{ fontSize:11, color:DS.fm }}>{item.action}</p>
                      <p style={{ fontSize:14, fontWeight:700, color:DS.gold }}>{item.pts}</p>
                    </div>
                  ))}
                </div>
                <h4 style={{ fontWeight:700, marginBottom:'.75rem' }}>{t('portal.rewards.redeem')}</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                  {[
                    {title:t('portal.rewards.discount'),cost:500,icon:'🎁'},
                    {title:t('portal.rewards.session'),cost:1000,icon:'💼'},
                    {title:t('portal.rewards.merch'),cost:750,icon:'👕'},
                    {title:t('portal.rewards.frame'),cost:300,icon:'🎓'},
                  ].map((reward, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem', border:`1px solid ${DS.border}`, borderRadius:'.5rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                        <span style={{ fontSize:18 }}>{reward.icon}</span>
                        <span style={{ fontSize:13, fontWeight:600 }}>{reward.title}</span>
                      </div>
                      <button disabled={totalPoints < reward.cost}
                        style={{ fontSize:12, fontWeight:700, padding:'.38rem .9rem', borderRadius:'.5rem', background: totalPoints >= reward.cost ? DS.blue : 'transparent', color: totalPoints >= reward.cost ? '#fff' : DS.fm, border:`1px solid ${totalPoints >= reward.cost ? DS.blue : DS.border}`, cursor: totalPoints >= reward.cost ? 'pointer' : 'not-allowed', opacity: totalPoints < reward.cost ? .5 : 1 }}>
                        {reward.cost} pts
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Certifications tab ── */}
          {activeTab === 'certifications' && (
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:'1.75rem' }}>My Certifications</h1>
              <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:DS.r, padding:'3rem 2rem', textAlign:'center' }}>
                <div style={{ fontSize:48, marginBottom:'1rem' }}>🏅</div>
                <h3 style={{ fontSize:'1.2rem', fontWeight:700, marginBottom:'.5rem' }}>No Certifications Yet</h3>
                <p style={{ fontSize:13, color:DS.fm, maxWidth:400, margin:'0 auto 1.5rem', lineHeight:1.6 }}>Complete modules and pass quizzes at 85% or higher to earn Aladiah Certified™ credentials (L100–L700).</p>
                <button onClick={() => { const next = courseProgresses.find(cp => cp.pct < 100); if (next?.nextChapterId) navigate(`/course/${next.courseId}/chapter/${next.nextChapterId}`); else navigate('/courses'); }}
                  style={{ fontSize:13, fontWeight:700, padding:'.68rem 1.5rem', borderRadius:'.75rem', background:DS.gold, color:'#0B111E', border:'none', cursor:'pointer' }}>Start Earning →</button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─── Stat modals (keep existing) ──────────────────────────────────── */}
      <ProgressDetailModal open={progressModalOpen} onOpenChange={setProgressModalOpen} userId={user?.id || ''} courseProgresses={courseProgresses} overallProgress={overallProgress} />
      <StreakDetailModal open={streakModalOpen} onOpenChange={setStreakModalOpen} userId={user?.id || ''} streak={streak} />
      <PointsDetailModal open={pointsModalOpen} onOpenChange={setPointsModalOpen} userId={user?.id || ''} totalPoints={totalPoints} />
      <LabsDetailModal open={labsModalOpen} onOpenChange={setLabsModalOpen} labs={labs} onReenterLab={(topic) => { setLabTopic(topic); setLabModeActive(true); setActiveTab('labs'); }} />

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
};

export default StudentPortal;
