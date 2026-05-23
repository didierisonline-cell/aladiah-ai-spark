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
  Bot, Send, BookOpen, Trophy, Flame, GraduationCap,
  FlaskConical, Star, Gift, Briefcase,
  TrendingUp, Award, Lightbulb, Sparkles, Clock,
  ArrowRight, CheckCircle, FileText, ExternalLink, Mic, Crown
} from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

const COURSE_ORDER = [
  'Professional Scrum Master Certification',
  'Agile Development and Scrum',
  'Jira Scrum Project: Hands-on Training',
  'Jira SCRUM Project: Hands-On Training',
  'Projects & Simulations',
  'Agile, Scrum & SAFe 6.0 Mastery',
  'Agile, Scrum & Safe 6.0 Mastery',
  'AI Mastery for Scrum Masters',
  'AI Mastery for Scrum Masters & Project Managers',
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
    const filteredCourses = (coursesRes.data || []).filter(course =>
      !EXCLUDED_COURSES.some(ex => course.title.includes(ex))
    );

    const progresses = filteredCourses.map(course => {
      const courseChapters = (chaptersRes.data || []).filter(ch => ch.course_id === course.id);
      const courseVideos = (videosRes.data || []).filter(v => courseChapters.some(ch => ch.id === v.chapter_id));
      const chapterQuizzes = (quizzesRes.data || []).filter(
        q => courseChapters.some(ch => ch.id === q.chapter_id) && q.quiz_type === 'chapter_end'
      );
      const completedQuizzes = chapterQuizzes.filter(q => passedQuizIds.includes(q.id)).length;
      const totalItems = courseChapters.length;
      const completedItems = completedQuizzes;

      return {
        courseId: course.id,
        title: course.title,
        total: totalItems,
        completed: completedItems,
        pct: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
        nextChapterId: courseChapters.find(ch => {
          const chQuiz = chapterQuizzes.find(q => q.chapter_id === ch.id);
          return !chQuiz || !passedQuizIds.includes(chQuiz.id);
        })?.id || courseChapters[0]?.id,
        chapters: courseChapters,
      };
    });

    progresses.sort((a, b) => {
      const aIdx = COURSE_ORDER.findIndex(name => a.title.toLowerCase().includes(name.toLowerCase()));
      const bIdx = COURSE_ORDER.findIndex(name => b.title.toLowerCase().includes(name.toLowerCase()));
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
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
            body: JSON.stringify({ priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TaEYg1wgazWak4AZXjnihAw', email: user.email, tier: 't2', userId: user.id,
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
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
                      method: 'POST',
                      headers: {'Content-Type':'application/json'},
                      body: JSON.stringify({ priceId: plan.priceId, userId: user.id, email: user.email }),
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
        onCourseSelected={() => setNeedsCourseSelection(false)}
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
      body: JSON.stringify({ priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TaEYg1wgazWak4AZXjnihAw',
        email: user.email, tier: 't2', userId: user.id,
        successUrl: `${window.location.origin}/portal?payment=success`, cancelUrl: `${window.location.origin}/portal` }) });
    const d = await res.json(); if (d.url) window.location.href = d.url;
  };

  return (
    <div className="portal-root min-h-screen" style={{ position: 'relative' }}>
      {/* Starter Paywall Blur Overlay */}
      {starterCourseDone && (
        <div
          onClick={handleStarterUpgrade}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, cursor: 'pointer', backdropFilter: 'blur(6px)', background: 'rgba(10,15,30,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div style={{ background: 'linear-gradient(135deg, #0d1b3e, #0a0f1e)', border: '2px solid rgba(245,158,11,0.5)', borderRadius: '24px', padding: '36px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>You Completed Module 1!</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: 1.6 }}>
              Solo Excelencia. You proved you belong here.<br/>
              Unlock all 8 courses and continue your journey.
            </p>
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <p style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>$59.99<span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/month</span></p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>All 8 courses · Cancel anytime · Certificates</p>
            </div>
            <button style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#000', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}>
              Unlock Full Access — $59.99/month →
            </button>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '12px' }}>🔒 Secure payment via Stripe</p>
          </div>
        </div>
      )}
      <Header onProfileClick={() => setShowProfile(true)} />

      {showFounderWelcome && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-background border shadow-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {t("portal.welcome.title").replace("{name}", firstName)}
                </h2>

                <p className="text-muted-foreground mb-4">
                  {t('portal.welcome.sub')}
                </p>

                <div className="space-y-3 text-sm leading-6">
                  <p>{t('portal.welcome.p1')}</p>
                  <p>{t('portal.welcome.p2')}</p>
                  <p>{t('portal.welcome.p3')}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button onClick={handleCloseFounderWelcome}>
                    {t('portal.welcome.enter')}
                  </Button>

                  <Button variant="outline" onClick={() => navigate('/community')}>
                    {t('portal.welcome.community')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfile && <StudentProfileWidget user={user} onClose={() => setShowProfile(false)} />}
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
               <h1 className="text-2xl md:text-3xl font-display font-bold">
  {t('portal.title').replace('{name}', firstName)}
</h1>

                {/* LinkedIn Badge */}
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'6px'}}>
                  {linkedInUrl ? (
                    <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                      <a href={linkedInUrl.startsWith('http') ? linkedInUrl : 'https://'+linkedInUrl}
                        target="_blank" rel="noopener noreferrer"
                        onContextMenu={(e)=>{e.preventDefault();setShowLinkedInInput(true);}}
                        onMouseDown={(e)=>{
                          if(e.button===0){
                            const timer=setTimeout(()=>setShowLinkedInInput(true),600);
                            e.currentTarget.addEventListener('mouseup',()=>clearTimeout(timer),{once:true});
                          }
                        }}
                        title="Click to open • Hold to edit"
                        style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(10,102,194,0.15)',border:'1px solid rgba(10,102,194,0.4)',borderRadius:'20px',padding:'4px 12px',textDecoration:'none',fontSize:'12px',color:'#60a5fa',fontWeight:600,cursor:'pointer'}}>
                        <span>💼</span> {t('portal.linkedin.badge')}
                      </a>
                    </div>
                  ) : (
                    <button onClick={()=>setShowLinkedInInput(true)}
                      style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(10,102,194,0.1)',border:'1px dashed rgba(10,102,194,0.4)',borderRadius:'20px',padding:'4px 12px',fontSize:'12px',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}>
                      <span>💼</span> {t('portal.linkedin.add')}
                    </button>
                  )}
                </div>
                {showLinkedInInput && (
                  <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div style={{background:'#0d1f3c',border:'1px solid rgba(59,130,246,0.3)',borderRadius:'16px',padding:'28px',width:'100%',maxWidth:'400px'}}>
                      <h3 style={{color:'#fff',fontWeight:700,fontSize:'16px',marginBottom:'8px'}}>💼 {t('portal.linkedin.title')}</h3>
                      <p style={{color:'rgba(255,255,255,0.5)',fontSize:'12px',marginBottom:'16px'}}>{t('portal.linkedin.desc')}</p>
                      <input type="url" placeholder="https://linkedin.com/in/yourname"
                        defaultValue={linkedInUrl} id="linkedin-input"
                        style={{width:'100%',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:'10px',padding:'10px 14px',color:'#fff',fontSize:'13px',outline:'none',boxSizing:'border-box',marginBottom:'16px'}} />
                      <div style={{display:'flex',gap:'10px'}}>
                        <button onClick={()=>{const v=(document.getElementById('linkedin-input') as HTMLInputElement)?.value;if(v)saveLinkedIn(v);}}
                          style={{flex:1,background:'linear-gradient(135deg,#0a66c2,#1e40af)',color:'#fff',border:'none',borderRadius:'10px',padding:'10px',fontSize:'13px',fontWeight:700,cursor:'pointer'}}>
                          {t('portal.linkedin.save')}
                        </button>
                        <button onClick={()=>setShowLinkedInInput(false)}
                          style={{background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.6)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'10px',padding:'10px 16px',fontSize:'13px',cursor:'pointer'}}>
                          {t('portal.linkedin.cancel')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}


              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: t('portal.scrum_guide'), url: 'https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf' },
                { label: t('portal.safe_guide'), url: 'https://davidfrico.com/safe-6.0-intro.pdf' },
                { label: 'PMBOK® Guide', url: 'https://www.pmi.org/pmbok-guide-standards/foundational/pmbok' },
              ].map((res) => (
                tier === 'starter' ? (
                  <Button
                    key={res.label}
                    variant="outline"
                    className="gap-2 opacity-40 cursor-not-allowed"
                    onClick={handleStarterUpgrade}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">{res.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                ) : (
                  <a key={res.label} href={res.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">{res.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                )
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              &copy; Scrum.org, Scaled Agile, PMI. Educational use only.
            </p>
          </div>
        </motion.div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {t('portal.action_center')}
            </CardTitle>
            <p className={CARD_SUBTITLE_CLASS}>{t('portal.action_center.sub')}</p>
          </CardHeader>

          <CardContent className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="rounded-xl border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-muted/40 transition"
              >
                <div>
                  <p className="font-medium">{reminder.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.message}
                  </p>
                </div>

                <Button
                  onClick={reminder.action}
                  variant={reminder.type === 'assignment' ? 'default' : reminder.type === 'payment' ? 'secondary' : 'outline'}
                  className="shrink-0"
                >
                  {reminder.actionLabel}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex w-full overflow-x-auto scrollbar-hide">
            <TabsTrigger value="overview" className="text-xs"><BookOpen className="w-3 h-3 mr-1" />{t('portal.tab.overview')}</TabsTrigger>
            <TabsTrigger value="assistant" className="text-xs"><Bot className="w-3 h-3 mr-1" />{t('portal.tab.assistant')}</TabsTrigger>
            <TabsTrigger value="labs" className="text-xs"><FlaskConical className="w-3 h-3 mr-1" />{t('portal.tab.labs')}</TabsTrigger>
            <TabsTrigger value="career" className="text-xs"><Briefcase className="w-3 h-3 mr-1" />{t('portal.tab.career')}</TabsTrigger>
            <TabsTrigger value="rewards" className="text-xs"><Gift className="w-3 h-3 mr-1" />{t('portal.tab.rewards')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="cursor-pointer group" onClick={() => navigate('/courses')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                  <GraduationCap className="w-5 h-5 text-primary" /> {t('portal.course.progress')}
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4" onClick={e => e.stopPropagation()}>
                {courseProgresses.length === 0 ? (
                  <button
                    className="w-full text-left p-4 rounded-lg border border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all flex items-center justify-between"
                    onClick={() => navigate('/courses')}
                  >
                    <div>
                      <p className="text-sm font-medium">Browse Your Courses</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Click to view and start your courses</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </button>
                ) : (
                  courseProgresses.map((cp, idx) => (
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
                            {cp.pct === 100 ? t('portal.course.completed') : cp.pct > 0 ? t('portal.course.continue') : t('portal.course.start')}
                          </span>
                          {cp.pct === 100 ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                      </div>
                      <Progress value={cp.pct} className="h-2" />
                      <p className="text-[10px] text-muted-foreground">{t('portal.course.pct').replace('{pct}', String(cp.pct)).replace('{done}', String(cp.completed)).replace('{total}', String(cp.total))}</p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            {suggestions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent" /> {t('portal.ai.suggestions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestions.slice(0, 5).map(s => (
                    <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="outline" className="text-[10px] mt-0.5">{s.suggestion_type}</Badge>
                      <p className="text-sm flex-1">
                        {typeof s.content === 'object' ? JSON.stringify(s.content) : s.content}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}


            <KnowledgeGraph
              weakAreas={learningProfile ? (learningProfile.weakAreas?.map((w: any) => typeof w === 'string' ? w : w.topic) || []) : []}
              strongAreas={learningProfile ? (learningProfile.strongAreas?.map((s: any) => typeof s === 'string' ? s : s.topic) || []) : []}
              onTopicSelect={() => {
                setActiveTab('labs');
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: t('portal.nav.community'), path: '/community', icon: Award },
                { label: t('portal.nav.sprint_sim'), path: '/simulation', icon: GraduationCap },
                { label: t('portal.nav.interview'), path: '/interview', icon: Mic },
                { label: t('portal.nav.referrals'), path: '/referral', icon: Trophy },
                { label: t('portal.nav.store'), path: '/store', icon: Gift },
              ].map((a, i) => (
                <Card key={i} className="p-3 cursor-pointer hover:shadow-md transition-shadow text-center" onClick={() => navigate(a.path)}>
                  <a.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs font-medium">{a.label}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assistant">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3 border-b">
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-12 space-y-4">
                      <Bot className="w-16 h-16 mx-auto text-primary/30" />
                      <div>
                        <p className="font-medium text-muted-foreground">{t('portal.chat.empty')}</p>
                        <p className="text-sm text-muted-foreground mt-1">{t('portal.chat.try')}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto">
                        {[
                          'Explain the Scrum framework',
                          'Help me build my resume',
                          'What topics should I focus on?',
                          'Suggest YouTube videos for Sprint Planning',
                        ].map(q => (
                          <Button key={q} variant="outline" size="sm" className="text-xs h-auto py-2 whitespace-normal" onClick={() => setChatInput(q)}>
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
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
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
                    placeholder={t('portal.chat.placeholder')}
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
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FlaskConical className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg">{t('portal.labs.title')}</h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {t('portal.labs.desc')}
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
                        placeholder={t('portal.labs.placeholder')}
                        className="flex-1"
                      />
                      <Button type="submit" className="gap-2">
                        <FlaskConical className="w-4 h-4" />
                        {t('portal.labs.btn')}
                      </Button>
                    </form>

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

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" /> {t('portal.labs.previous')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {labs.length === 0 ? (
                        <div className="text-center py-8 space-y-3">
                          <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">{t('portal.labs.empty')}</p>
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
                                    {lab.completed ? <><CheckCircle className="w-3 h-3 mr-1" /> {t('portal.labs.complete')}</> : lab.difficulty_level}
                                  </Badge>
                                  {lab.score > 0 && <span className="text-sm font-medium">{lab.score}%</span>}
                                </div>
                                <p className="text-sm font-medium">{topic}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(lab.created_at).toLocaleDateString()} • {t('portal.labs.reenter')}
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

          <TabsContent value="career" className="space-y-4">
            <CareerTools
              overallProgress={overallProgress}
              onSwitchToAssistant={(prompt) => { setActiveTab('assistant'); setChatInput(prompt); }}
            />

            <YouTubeRecommendations
              weakAreas={(learningProfile?.weakAreas || []).map((w: any) => typeof w === 'string' ? w : w.topic || String(w))}
              recentQuestions={chatMessages.filter(m => m.role === 'user').map(m => m.content).slice(-5)}
              currentTopic={courseProgresses.length > 0 ? courseProgresses.sort((a,b) => b.pct - a.pct)[0]?.title || "Scrum Master" : "Scrum Master"}
              onSwitchToAssistant={(prompt) => { setActiveTab('assistant'); setChatInput(prompt); }}
            />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" /> {t('portal.rewards.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t('portal.rewards.sub')}</p>
                </div>

                <div className="text-right cursor-pointer" onClick={() => setPointsModalOpen(true)}>
                  <p className="text-3xl font-display font-bold text-accent">{totalPoints}</p>
                  <p className="text-xs text-muted-foreground">{t('portal.rewards.total')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {[
                  { action: t('portal.rewards.comment'), points: '+5', icon: Bot },
                  { action: t('portal.rewards.lab'), points: '+5', icon: FlaskConical },
                  { action: t('portal.rewards.quiz'), points: '+5', icon: Trophy },
                  { action: t('portal.rewards.login'), points: '+1', icon: Flame },
                  { action: t('portal.rewards.refer'), points: '+200', icon: Award },
                  { action: t('portal.rewards.collab'), points: '+2', icon: BookOpen },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg border text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setPointsModalOpen(true)}>
                    <item.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-medium">{item.action}</p>
                    <p className="text-sm font-bold text-accent">{item.points}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-semibold mb-3">{t('portal.rewards.redeem')}</h4>
              <div className="space-y-2">
                {[
                  { title: t('portal.rewards.discount'), cost: 500, icon: Gift },
                  { title: t('portal.rewards.session'), cost: 1000, icon: Briefcase },
                  { title: t('portal.rewards.merch'), cost: 750, icon: Award },
                  { title: t('portal.rewards.frame'), cost: 300, icon: GraduationCap },
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

        {/* Elite Mentorship — Weekly 1-on-1 Booking Calendar */}
        {tier === 't3' && (
          <Card className="mt-6 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  Weekly 1-on-1 with Professor Didier
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">ELITE</span>
                </h3>
                <p className="text-sm text-muted-foreground">Book your weekly mentorship session (1 hour)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border p-4 space-y-3">
                <p className="text-sm font-medium">Next Available Slots</p>
                {['Monday 10:00 AM EST', 'Wednesday 2:00 PM EST', 'Friday 11:00 AM EST'].map((slot, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center justify-between p-3 rounded-lg border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left"
                    onClick={() => {
                      toast({ title: 'Session Booked!', description: `Your 1-on-1 with Professor Didier is confirmed for ${slot}.` });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{slot}</span>
                    </div>
                    <span className="text-xs text-emerald-500 font-medium">Book</span>
                  </button>
                ))}
              </div>
              <div className="rounded-xl border p-4 space-y-3">
                <p className="text-sm font-medium">Your Mentorship</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• 1 session per week (60 minutes)</p>
                  <p>• Personalized career strategy</p>
                  <p>• Direct feedback on your work</p>
                  <p>• Job search accountability</p>
                  <p>• Certification prep guidance</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Sessions reset every Monday. Unused sessions don't roll over.</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>

      <ProgressDetailModal
        open={progressModalOpen}
        onOpenChange={setProgressModalOpen}
        userId={user?.id || ''}
        courseProgresses={courseProgresses}
        overallProgress={overallProgress}
      />
      <StreakDetailModal
        open={streakModalOpen}
        onOpenChange={setStreakModalOpen}
        userId={user?.id || ''}
        streak={streak}
      />
      <PointsDetailModal
        open={pointsModalOpen}
        onOpenChange={setPointsModalOpen}
        userId={user?.id || ''}
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
    </div>
  );
};

export default StudentPortal;