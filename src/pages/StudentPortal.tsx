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
            <TabsTrigger value="resources" className="text-xs"><BookMarked className="w-3 h-3 mr-1" />Resources</TabsTrigger>
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
          <TabsContent value="resources" className="space-y-4">
            <div style={{ position: 'relative' }}>
              {tier === 'starter' && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 10, backdropFilter: 'blur(6px)', background: 'rgba(10,15,30,0.5)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <Lock className="w-8 h-8 text-primary" />
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Unlock Full Access</p>
                  <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', maxWidth: 280 }}>Upgrade to access all resources, guides and official documentation</p>
                  <button onClick={handleStarterUpgrade} style={{ background: '#f59e0b', color: '#000', fontWeight: 800, padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}>Upgrade — $59.99/month</button>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, padding: 4 }}>
                {[
                  { track: "📘 Scrum Master", color: "#3b82f6", resources: [
                    { label: "Scrum Guide 2020", url: "https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf", type: "PDF" },
                    { label: "CSM Exam Study Guide", url: "https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster", type: "Guide" },
                    { label: "SAFe 6.0 Framework", url: "https://scaledagile.com/what-is-safe/", type: "Framework" },
                    { label: "Scrum.org PSM I Practice", url: "https://www.scrum.org/open-assessments/scrum-open", type: "Practice Exam" },
                    { label: "Agile Manifesto", url: "https://agilemanifesto.org/", type: "Reference" },
                  ], glossary: [
                    { term: "Scrum", def: "A lightweight framework for developing and sustaining complex products using iterative, incremental practices." },
                    { term: "Sprint", def: "A time-boxed iteration of 1-4 weeks during which a potentially releasable product increment is created." },
                    { term: "Product Owner", def: "The Scrum Team member accountable for maximizing product value and managing the Product Backlog." },
                    { term: "Scrum Master", def: "Servant-leader responsible for ensuring Scrum is understood and enacted; removes impediments." },
                    { term: "Development Team", def: "Cross-functional professionals who deliver a potentially releasable increment each Sprint." },
                    { term: "Product Backlog", def: "An ordered list of everything that might be needed in the product, maintained by the Product Owner." },
                    { term: "Sprint Backlog", def: "The set of Product Backlog items selected for the Sprint plus a plan for delivering the increment." },
                    { term: "Increment", def: "The sum of all Product Backlog items completed during a Sprint and all previous Sprints." },
                    { term: "Definition of Done", def: "A shared understanding of what it means for work to be complete and releasable." },
                    { term: "Sprint Planning", def: "Ceremony where the team selects backlog items and creates a plan for the upcoming Sprint." },
                    { term: "Daily Scrum", def: "A 15-minute daily event for the Development Team to synchronize and plan the next 24 hours." },
                    { term: "Sprint Review", def: "End-of-Sprint ceremony to inspect the increment and adapt the Product Backlog." },
                    { term: "Sprint Retrospective", def: "Ceremony for the Scrum Team to inspect itself and create a plan for improvement." },
                    { term: "Velocity", def: "The amount of work a team completes in a Sprint, measured in story points or hours." },
                    { term: "Story Points", def: "A relative unit of measure for estimating the effort required to implement a backlog item." },
                    { term: "User Story", def: "An informal, natural-language description of a feature from the perspective of the end user." },
                    { term: "Acceptance Criteria", def: "Conditions that a user story must satisfy to be accepted by the Product Owner." },
                    { term: "Impediment", def: "Any obstacle that prevents the team from achieving their Sprint Goal." },
                    { term: "Backlog Refinement", def: "The ongoing process of reviewing, estimating, and ordering Product Backlog items." },
                    { term: "Sprint Goal", def: "A short objective that gives the Development Team guidance and focus during the Sprint." },
                    { term: "Burndown Chart", def: "A graphical representation of work left to do versus time remaining in the Sprint." },
                    { term: "Empiricism", def: "Scrum is founded on empiricism: knowledge comes from experience and decisions based on what is known." },
                    { term: "SAFe", def: "Scaled Agile Framework: a set of patterns for implementing Agile at enterprise scale." },
                    { term: "Kanban", def: "A visual workflow management method used alongside or instead of Scrum." },
                    { term: "WIP Limit", def: "Work-In-Progress limit: a constraint on the number of tasks in a given workflow stage." },
                  ]},
                  { track: "📊 Project Management", color: "#8b5cf6", resources: [
                    { label: "PMBOK Guide", url: "https://www.pmi.org/pmbok-guide-standards/foundational/pmbok", type: "Standard" },
                    { label: "PMP Exam Content Outline", url: "https://www.pmi.org/certifications/project-management-pmp/earn-the-pmp/pmp-exam-preparation", type: "Guide" },
                    { label: "Agile Practice Guide", url: "https://www.pmi.org/pmbok-guide-standards/agile", type: "Guide" },
                    { label: "PMI Free Practice Exam", url: "https://www.pmi.org/certifications/project-management-pmp/earn-the-pmp/pmp-exam-preparation", type: "Practice Exam" },
                    { label: "Rita Mulcahy PMP Prep", url: "https://rmcproject.com/", type: "Reference" },
                  ], glossary: [
                    { term: "Project", def: "A temporary endeavor undertaken to create a unique product, service, or result." },
                    { term: "Project Charter", def: "A document that formally authorizes a project and grants the PM authority to apply resources." },
                    { term: "Scope", def: "The work that needs to be accomplished to deliver a product, service, or result with specified features." },
                    { term: "WBS", def: "Work Breakdown Structure: a hierarchical decomposition of the total scope of work." },
                    { term: "Critical Path", def: "The longest sequence of dependent tasks that determines the shortest project duration." },
                    { term: "Milestone", def: "A significant point or event in a project, program, or portfolio." },
                    { term: "Risk Register", def: "A document that records identified risks, their analysis, and planned responses." },
                    { term: "Stakeholder", def: "An individual or group that may affect or be affected by the project." },
                    { term: "RACI Matrix", def: "A chart mapping tasks to roles: Responsible, Accountable, Consulted, Informed." },
                    { term: "Earned Value", def: "The value of work actually performed, expressed in terms of the approved budget." },
                    { term: "SPI", def: "Schedule Performance Index: ratio of earned value to planned value; above 1 means ahead of schedule." },
                    { term: "CPI", def: "Cost Performance Index: ratio of earned value to actual cost; above 1 means under budget." },
                    { term: "Change Control", def: "A formal process for managing changes to project scope, schedule, or cost." },
                    { term: "Baseline", def: "An approved plan for a project used for comparison to actual performance." },
                    { term: "Lessons Learned", def: "Knowledge gained during a project showing how events were addressed." },
                    { term: "Gantt Chart", def: "A bar chart that illustrates a project schedule with tasks and durations over time." },
                    { term: "Float / Slack", def: "The amount of time a task can be delayed without delaying the project end date." },
                    { term: "Procurement", def: "The process of obtaining goods and services from outside the performing organization." },
                    { term: "SOW", def: "Statement of Work: a narrative description of products or services to be delivered." },
                    { term: "PMO", def: "Project Management Office: a department that standardizes project-related governance." },
                    { term: "Agile", def: "An iterative approach emphasizing flexibility, collaboration, and customer feedback." },
                    { term: "Waterfall", def: "A linear sequential approach where each phase must complete before the next begins." },
                    { term: "Issue Log", def: "A project document used to record and monitor elements under discussion or in dispute." },
                    { term: "Resource Leveling", def: "A technique to optimize resource allocation by adjusting start and finish dates." },
                    { term: "Quality Assurance", def: "The process of auditing quality requirements to ensure standards are met." },
                  ]},
                  { track: "🤖 AI Mastery", color: "#f59e0b", resources: [
                    { label: "Google AI Essentials", url: "https://grow.google/certificates/ai-essentials/", type: "Course" },
                    { label: "Microsoft AI Fundamentals", url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/", type: "Cert" },
                    { label: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", type: "Guide" },
                    { label: "DeepLearning.AI Short Courses", url: "https://www.deeplearning.ai/short-courses/", type: "Course" },
                    { label: "Hugging Face Learn", url: "https://huggingface.co/learn", type: "Reference" },
                  ], glossary: [
                    { term: "Artificial Intelligence", def: "The simulation of human intelligence processes by computer systems." },
                    { term: "Machine Learning", def: "A subset of AI where systems learn from data to improve without being explicitly programmed." },
                    { term: "Deep Learning", def: "A subset of ML using neural networks with many layers to model complex patterns." },
                    { term: "LLM", def: "Large Language Model: an AI model trained on vast text data to understand and generate language." },
                    { term: "Prompt Engineering", def: "The practice of designing inputs to guide AI models toward desired outputs." },
                    { term: "Fine-tuning", def: "Additional training of a pre-trained model on a specific dataset to specialize its capabilities." },
                    { term: "RAG", def: "Retrieval-Augmented Generation: combining a retrieval system with an LLM to ground responses in real data." },
                    { term: "Hallucination", def: "When an AI generates plausible-sounding but factually incorrect information." },
                    { term: "Token", def: "The basic unit of text that LLMs process; also a unit of API usage." },
                    { term: "Embedding", def: "A numerical vector representation of text that captures semantic meaning." },
                    { term: "Neural Network", def: "A computational model inspired by the human brain, consisting of layers of interconnected nodes." },
                    { term: "NLP", def: "Natural Language Processing: AI techniques for understanding and generating human language." },
                    { term: "Computer Vision", def: "AI field focused on enabling machines to interpret and understand visual information." },
                    { term: "Generative AI", def: "AI systems that can create new content such as text, images, and audio." },
                    { term: "API", def: "Application Programming Interface: a way for software to communicate with AI services." },
                    { term: "Zero-shot", def: "Prompting an AI to perform a task without providing examples in the prompt." },
                    { term: "Few-shot", def: "Providing a few examples in the prompt to guide the AI toward desired behavior." },
                    { term: "Temperature", def: "A parameter controlling randomness in AI output; higher means more creative." },
                    { term: "Transformer", def: "The neural network architecture underlying most modern LLMs, using attention mechanisms." },
                    { term: "AI Ethics", def: "The study of moral issues arising from AI development, including bias, fairness, and accountability." },
                    { term: "Automation", def: "Using AI and software to perform tasks with minimal human intervention." },
                    { term: "Agent", def: "An AI system that can perceive its environment and take autonomous actions to achieve goals." },
                    { term: "Vector Database", def: "A database optimized for storing and searching high-dimensional embedding vectors." },
                    { term: "Context Window", def: "The maximum amount of text an LLM can process in a single interaction." },
                    { term: "Inference", def: "The process of running a trained AI model to generate predictions or outputs." },
                  ]},
                  { track: "🔐 Cybersecurity", color: "#ef4444", resources: [
                    { label: "CompTIA Security+ Guide", url: "https://www.comptia.org/certifications/security", type: "Cert" },
                    { label: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework", type: "Framework" },
                    { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", type: "Guide" },
                    { label: "Cybrary Free Courses", url: "https://www.cybrary.it/", type: "Course" },
                    { label: "TryHackMe Learning Paths", url: "https://tryhackme.com/paths", type: "Practice" },
                  ], glossary: [
                    { term: "CIA Triad", def: "Confidentiality, Integrity, Availability: the three core principles of information security." },
                    { term: "Firewall", def: "A network security system that monitors and controls traffic based on security rules." },
                    { term: "Encryption", def: "The process of converting data into a coded format to prevent unauthorized access." },
                    { term: "Phishing", def: "A social engineering attack using deceptive messages to steal sensitive information." },
                    { term: "Malware", def: "Malicious software designed to disrupt, damage, or gain unauthorized access to systems." },
                    { term: "Ransomware", def: "Malware that encrypts victim data and demands payment for the decryption key." },
                    { term: "Vulnerability", def: "A weakness in a system that can be exploited by a threat actor." },
                    { term: "Penetration Testing", def: "Authorized simulated attack on a system to evaluate its security posture." },
                    { term: "Zero-Day", def: "A vulnerability unknown to the vendor for which no patch exists." },
                    { term: "MFA", def: "Multi-Factor Authentication: requiring two or more verification methods to access a system." },
                    { term: "SOC", def: "Security Operations Center: a team monitoring and responding to security incidents." },
                    { term: "SIEM", def: "Security Information and Event Management: tools that aggregate and analyze security data." },
                    { term: "VPN", def: "Virtual Private Network: encrypts internet traffic and masks the user IP address." },
                    { term: "IDS/IPS", def: "Intrusion Detection/Prevention System: monitors network traffic for suspicious activity." },
                    { term: "Social Engineering", def: "Manipulating people into divulging confidential information or performing actions." },
                    { term: "PKI", def: "Public Key Infrastructure: a framework for managing digital certificates and encryption keys." },
                    { term: "DDoS", def: "Distributed Denial of Service: overwhelming a system with traffic to make it unavailable." },
                    { term: "Threat Actor", def: "An individual or group that poses a threat to cybersecurity." },
                    { term: "Risk Assessment", def: "The process of identifying, analyzing, and evaluating security risks." },
                    { term: "Patch Management", def: "The process of distributing and applying updates to software to fix vulnerabilities." },
                    { term: "HTTPS", def: "HyperText Transfer Protocol Secure: encrypted communication between browser and server." },
                    { term: "Digital Forensics", def: "The process of collecting and analyzing digital evidence for investigations." },
                    { term: "Incident Response", def: "The organized approach to addressing and managing a security breach." },
                    { term: "Least Privilege", def: "Security principle granting users only the minimum access needed for their role." },
                    { term: "Authentication", def: "The process of verifying the identity of a user or system." },
                  ]},
                  { track: "📈 Data Analytics", color: "#10b981", resources: [
                    { label: "Google Data Analytics", url: "https://grow.google/certificates/data-analytics/", type: "Course" },
                    { label: "SQL Tutorial — W3Schools", url: "https://www.w3schools.com/sql/", type: "Tutorial" },
                    { label: "Tableau Public", url: "https://public.tableau.com/app/discover", type: "Tool" },
                    { label: "Kaggle Learn", url: "https://www.kaggle.com/learn", type: "Course" },
                    { label: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", type: "Tutorial" },
                  ], glossary: [
                    { term: "Data Analytics", def: "The process of examining datasets to draw conclusions and support decision-making." },
                    { term: "SQL", def: "Structured Query Language: used to communicate with and manipulate relational databases." },
                    { term: "ETL", def: "Extract, Transform, Load: the process of moving data from source systems to a data warehouse." },
                    { term: "KPI", def: "Key Performance Indicator: a measurable value showing how effectively objectives are achieved." },
                    { term: "Dashboard", def: "A visual display of key metrics and data points for at-a-glance monitoring." },
                    { term: "Data Visualization", def: "The graphical representation of data to communicate insights clearly." },
                    { term: "Regression", def: "A statistical method for modeling relationships between variables to make predictions." },
                    { term: "Correlation", def: "A statistical measure of how strongly two variables are related." },
                    { term: "Outlier", def: "A data point significantly different from others in a dataset." },
                    { term: "Data Cleaning", def: "The process of detecting and correcting inaccurate or incomplete records in a dataset." },
                    { term: "Data Warehouse", def: "A central repository of integrated data used for reporting and analysis." },
                    { term: "Big Data", def: "Extremely large datasets that require specialized tools to process and analyze." },
                    { term: "Pivot Table", def: "A data summarization tool used to reorganize and aggregate data in a spreadsheet." },
                    { term: "A/B Testing", def: "Comparing two versions of something to determine which performs better statistically." },
                    { term: "Mean / Median / Mode", def: "Measures of central tendency: average, middle value, and most frequent value." },
                    { term: "Standard Deviation", def: "A measure of how spread out values are from the mean in a dataset." },
                    { term: "Python", def: "A popular programming language widely used for data analysis and machine learning." },
                    { term: "Pandas", def: "A Python library providing data structures and data analysis tools." },
                    { term: "Tableau", def: "A leading data visualization tool for creating interactive dashboards." },
                    { term: "Power BI", def: "Microsoft business analytics tool for interactive data visualization." },
                    { term: "Data Lake", def: "A storage repository holding large amounts of raw data in its native format." },
                    { term: "Cohort Analysis", def: "Analyzing behavior of a group of users who share a common characteristic over time." },
                    { term: "Funnel Analysis", def: "Tracking users through a series of steps to identify where drop-offs occur." },
                    { term: "Normalization", def: "Organizing database data to reduce redundancy and improve data integrity." },
                    { term: "Predictive Analytics", def: "Using historical data and statistical algorithms to forecast future outcomes." },
                  ]},
                  { track: "☁️ DevOps & Cloud", color: "#06b6d4", resources: [
                    { label: "AWS Cloud Practitioner", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/", type: "Cert" },
                    { label: "Docker Documentation", url: "https://docs.docker.com/get-started/", type: "Docs" },
                    { label: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", type: "Tutorial" },
                    { label: "Linux Foundation Free Courses", url: "https://training.linuxfoundation.org/resources/?_sft_content_type=free-course", type: "Course" },
                    { label: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", type: "Docs" },
                  ], glossary: [
                    { term: "DevOps", def: "A set of practices combining software development and IT operations to shorten delivery cycles." },
                    { term: "CI/CD", def: "Continuous Integration/Continuous Delivery: automating code integration, testing, and deployment." },
                    { term: "Container", def: "A lightweight, portable package containing an application and its dependencies." },
                    { term: "Docker", def: "A platform for developing, shipping, and running applications in containers." },
                    { term: "Kubernetes", def: "An open-source system for automating deployment, scaling, and management of containers." },
                    { term: "IaC", def: "Infrastructure as Code: managing and provisioning infrastructure through machine-readable config files." },
                    { term: "Cloud Computing", def: "Delivery of computing services over the internet on a pay-as-you-go basis." },
                    { term: "AWS", def: "Amazon Web Services: the world largest and most comprehensive cloud platform." },
                    { term: "Microservices", def: "An architectural style structuring an application as a collection of small, independent services." },
                    { term: "Pipeline", def: "An automated sequence of steps for building, testing, and deploying software." },
                    { term: "Git", def: "A distributed version control system for tracking changes in source code." },
                    { term: "Load Balancer", def: "Distributes incoming network traffic across multiple servers to ensure availability." },
                    { term: "Auto Scaling", def: "Automatically adjusting compute resources based on demand." },
                    { term: "Terraform", def: "An IaC tool for building, changing, and versioning infrastructure safely and efficiently." },
                    { term: "Monitoring", def: "Continuously observing system metrics to detect issues and ensure performance." },
                    { term: "SRE", def: "Site Reliability Engineering: applying software engineering practices to operations problems." },
                    { term: "Serverless", def: "A cloud execution model where the provider manages server infrastructure automatically." },
                    { term: "VPC", def: "Virtual Private Cloud: an isolated network section within a cloud provider infrastructure." },
                    { term: "Helm", def: "A package manager for Kubernetes that simplifies application deployment." },
                    { term: "Ansible", def: "An open-source automation tool for configuration management and application deployment." },
                    { term: "SLA", def: "Service Level Agreement: a commitment between a provider and client on service standards." },
                    { term: "Rollback", def: "Reverting a deployment to a previous stable version after a failed release." },
                    { term: "Blue/Green Deployment", def: "Running two identical production environments to enable zero-downtime releases." },
                    { term: "Observability", def: "The ability to understand a system internal state from its external outputs." },
                    { term: "Registry", def: "A storage and distribution system for Docker container images such as Docker Hub or ECR." },
                  ]},
                  { track: "🏗️ Solution Architect", color: "#f97316", resources: [
                    { label: "AWS Solutions Architect", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/", type: "Cert" },
                    { label: "TOGAF Framework", url: "https://www.opengroup.org/togaf", type: "Framework" },
                    { label: "Azure Architecture Center", url: "https://learn.microsoft.com/en-us/azure/architecture/", type: "Guide" },
                    { label: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/", type: "Framework" },
                    { label: "Google Cloud Architecture Center", url: "https://cloud.google.com/architecture", type: "Guide" },
                  ], glossary: [
                    { term: "Solution Architecture", def: "The process of designing a technical solution to address specific business requirements." },
                    { term: "TOGAF", def: "The Open Group Architecture Framework: a methodology for enterprise architecture." },
                    { term: "Enterprise Architecture", def: "A blueprint defining the structure and operation of an organization IT environment." },
                    { term: "High Availability", def: "System design ensuring a high level of operational performance with minimal downtime." },
                    { term: "Scalability", def: "The ability of a system to handle increased load by adding resources." },
                    { term: "Fault Tolerance", def: "A system ability to continue operating correctly when components fail." },
                    { term: "DR", def: "Disaster Recovery: strategies to restore IT systems after a catastrophic event." },
                    { term: "RPO", def: "Recovery Point Objective: maximum acceptable data loss measured in time." },
                    { term: "RTO", def: "Recovery Time Objective: maximum acceptable downtime after a disaster." },
                    { term: "API Gateway", def: "A server that acts as the entry point for clients to access backend services." },
                    { term: "CDN", def: "Content Delivery Network: distributes content globally to reduce latency." },
                    { term: "Caching", def: "Storing frequently accessed data temporarily to improve performance." },
                    { term: "Database Sharding", def: "Partitioning a database into smaller, faster, more manageable pieces." },
                    { term: "Event-Driven Architecture", def: "A design pattern where components communicate through events." },
                    { term: "SOA", def: "Service-Oriented Architecture: designing software as a collection of interoperable services." },
                    { term: "Latency", def: "The time delay between a request and the corresponding response." },
                    { term: "Throughput", def: "The amount of data processed by a system in a given time period." },
                    { term: "Multi-tenancy", def: "A single instance of software serving multiple customers." },
                    { term: "Message Queue", def: "A communication method allowing applications to exchange messages asynchronously." },
                    { term: "WAF", def: "Web Application Firewall: protects web applications by filtering malicious HTTP traffic." },
                    { term: "Stateless", def: "An architecture where each request contains all information needed to process it." },
                    { term: "Design Patterns", def: "Reusable solutions to commonly occurring problems in software design." },
                    { term: "CAP Theorem", def: "States a distributed system can provide only two of: Consistency, Availability, Partition tolerance." },
                    { term: "SaaS/PaaS/IaaS", def: "Cloud service models: Software, Platform, and Infrastructure as a Service." },
                    { term: "Zero Trust", def: "A security model requiring strict identity verification for every person and device." },
                  ]},
                  { track: "📋 Business Analysis", color: "#a855f7", resources: [
                    { label: "BABOK Guide", url: "https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/", type: "Standard" },
                    { label: "PMI-PBA Certification", url: "https://www.pmi.org/certifications/business-analysis-pba", type: "Cert" },
                    { label: "Requirements Engineering", url: "https://www.iiba.org/professional-development/iiba-certifications/cbap/", type: "Guide" },
                    { label: "Lucidchart Free", url: "https://www.lucidchart.com/", type: "Tool" },
                    { label: "Business Analysis Body of Knowledge", url: "https://www.iiba.org/standards-and-resources/babok/", type: "Reference" },
                  ], glossary: [
                    { term: "Business Analysis", def: "The practice of enabling change in an organization by defining needs and recommending solutions." },
                    { term: "Requirements", def: "Documented needs that a solution must fulfill to meet stakeholder objectives." },
                    { term: "Stakeholder", def: "Anyone with an interest in or affected by the project or solution." },
                    { term: "Use Case", def: "A description of how a user interacts with a system to achieve a goal." },
                    { term: "User Story", def: "A short description of a feature from the end-user perspective used in Agile." },
                    { term: "Gap Analysis", def: "Comparing current state to desired future state to identify what needs to change." },
                    { term: "BRD", def: "Business Requirements Document: a formal document describing business solutions for a project." },
                    { term: "FRD", def: "Functional Requirements Document: describes what a system must do." },
                    { term: "Process Mapping", def: "Creating a visual representation of a business process to analyze and improve it." },
                    { term: "SWOT Analysis", def: "Assessing Strengths, Weaknesses, Opportunities, and Threats of a business situation." },
                    { term: "As-Is / To-Be", def: "Current state vs. desired future state analysis." },
                    { term: "Elicitation", def: "The practice of drawing out requirements from stakeholders through interviews and workshops." },
                    { term: "Feasibility Study", def: "An assessment of the practicality and viability of a proposed project or solution." },
                    { term: "BPMN", def: "Business Process Model and Notation: a standard graphical notation for business processes." },
                    { term: "Data Flow Diagram", def: "A visual representation showing how data moves through a system." },
                    { term: "Traceability Matrix", def: "A document linking requirements to test cases to ensure all requirements are tested." },
                    { term: "MoSCoW", def: "Prioritization technique: Must have, Should have, Could have, Won't have." },
                    { term: "Prototype", def: "An early model of a solution used to test concepts and gather feedback." },
                    { term: "UAT", def: "User Acceptance Testing: final testing performed by end users before system go-live." },
                    { term: "ROI", def: "Return on Investment: a measure of the profitability of an investment." },
                    { term: "Business Case", def: "A justification for undertaking a project in terms of benefits, costs, and risks." },
                    { term: "Wireframe", def: "A low-fidelity visual guide representing the skeletal framework of a website or app." },
                    { term: "Entity Relationship Diagram", def: "A visual representation of data entities and their relationships in a database." },
                    { term: "Change Management", def: "The structured approach to transitioning individuals and organizations to a desired future state." },
                    { term: "Root Cause Analysis", def: "A method for identifying the underlying cause of a problem rather than its symptoms." },
                  ]},
                ].map((track) => {
                  const [showGlossary, setShowGlossary] = React.useState(false);
                  return (
                  <div key={track.track} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 4, height: 20, background: track.color, borderRadius: 2 }} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#e2e8f0" }}>{track.track}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {track.resources.map((res) => (
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
                        {track.glossary.map((item) => (
                          <div key={item.term} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8, borderLeft: "3px solid " + track.color + "60" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: track.color, marginBottom: 2 }}>{item.term}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{item.def}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {track.resources.map((res) => (
                        <a key={res.label} href={res.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        >
                          <span style={{ fontSize: 13, color: '#cbd5e1' }}>{res.label}</span>
                          <span style={{ fontSize: 10, color: track.color, fontWeight: 600, background: track.color + '20', padding: '2px 8px', borderRadius: 4 }}>{res.type}</span>
                        </a>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowGlossary(!showGlossary)}
                      style={{ marginTop: 12, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: showGlossary ? track.color + '20' : 'rgba(255,255,255,0.03)', border: '1px solid ' + track.color + '40', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 700, color: track.color, letterSpacing: '0.05em' }}>📖 GLOSSARY</span>
                      <span style={{ fontSize: 11, color: track.color }}>{showGlossary ? '▲ Hide' : '▼ Show ' + track.glossary.length + ' terms'}</span>
                    </button>
                    {showGlossary && (
                      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
                        {track.glossary.map((item) => (
                          <div key={item.term} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, borderLeft: '3px solid ' + track.color + '60' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: track.color, marginBottom: 2 }}>{item.term}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{item.def}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 10, color: '#64748b', marginTop: 8, textAlign: 'center' }}>© Scrum.org, Scaled Agile, PMI, AWS, Google, Microsoft. Educational use only.</p>
            </div>
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