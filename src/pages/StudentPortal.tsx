import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { overviewT } from '@/contexts/overviewStrings';
import { composeProfFirstMessage, composeProfRecommendation, type ProfMode } from '@/lib/profDidierMessage';
import { getLocalizedField } from '@/lib/i18nData';
import { useProgress } from '@/hooks/useProgress';
import { talentScoreFromProgress } from '@/hooks/useTalentScore';
import { careerHoursLeft } from '@/lib/progressModel';
import { useLearningProfile } from '@/hooks/useLearningProfile';
import { competencyBarsFromProfile } from '@/lib/competencyBars';
import { useIdentity } from '@/hooks/useIdentity';
import { activeHref } from '@/lib/nav';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { isFounderEmail } from '@/lib/roles';
import { useFounderMode } from '@/hooks/useFounderMode';
import MobileHome from '@/components/portal/MobileHome';
import PortalSidebar from '@/components/PortalSidebar';
import Header from '@/components/Header';
import { useSubscription } from '@/hooks/useSubscription';
import { CreedAcknowledgmentGate, shouldShowCreedGate, getLocalDateString } from '@/components/CreedAcknowledgmentGate';
import CourseSelectionGate from '@/components/CourseSelectionGate';
import { StreakDetailModal, PointsDetailModal, LabsDetailModal } from '@/components/portal/StatDetailModals';
import globeBg from '@/assets/global-network-bg.png';
import profCardBg from '@/assets/professor-didier-card.png';

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const LOCALE_MAP: Record<string, string> = {
  en: 'en-US', es: 'es-ES', zh: 'zh-CN', ar: 'ar-SA', fr: 'fr-FR', de: 'de-DE', ja: 'ja-JP',
  pt: 'pt-BR', hi: 'hi-IN', ko: 'ko-KR', it: 'it-IT', ru: 'ru-RU', nl: 'nl-NL', pl: 'pl-PL',
  tr: 'tr-TR', sw: 'sw-KE', yo: 'yo-NG', ha: 'ha-NG', ig: 'ig-NG', vi: 'vi-VN', th: 'th-TH',
};
function getDateStr(lang?: string) {
  const locale = (lang && LOCALE_MAP[lang]) || 'en-US';
  try {
    return new Date().toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}

// Career-momentum feed: previously hardcoded fabricated hires/salaries (e.g.
// "Sarah K. hired … $120,000"). Cleared to avoid showing fabricated social proof
// in production; populate from real verified graduate outcomes when available.
const MOMENTUM: { name: string; action: string; role?: string; company?: string; salary?: string; program?: string; cert?: string; time: string }[] = [];
// ── Sim History helpers ──────────────────────────────────────────────────────
const SIM_TYPE_ICONS: Record<string, string> = {
  incident:'🚨', architecture:'🏗️', negotiation:'🤝', audit:'🔍',
  crisis:'⚡', design:'✏️', review:'🔎', investigation:'🔬',
  pitch:'🎤', triage:'📋', roleplay:'🎭', analysis:'📊',
  ethics:'⚖️', coaching:'👥',
};
const VERDICT_COLORS: Record<string, string> = {
  'Elite Performance': '#F5B81A',
  'Expert Performance': '#22C98A',
  'Solid Performance': '#4A90F5',
  'Good Start': '#A78BFA',
  'Needs Practice': '#8596AD',
};
function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function scoreRingColor(score: number): string {
  if (score >= 85) return '#F5B81A';
  if (score >= 70) return '#22C98A';
  if (score >= 50) return '#4A90F5';
  return '#8596AD';
}

const TOOLS = [
  { icon: '🎤', lbl: 'ai_interview', sub: 'practice_now', path: '/portal/career' },
  { icon: '📄', lbl: 'resume_builder', sub: 'optimize_cv', path: '/portal/career' },
  { icon: '💼', lbl: 'job_matches', sub: 'new_jobs', path: '/portal/my-career-path' },
  { icon: '📊', lbl: 'portfolio_analyzer', sub: 'get_feedback', path: '/portal/portfolio' },
  { icon: '💰', lbl: 'salary_insights', sub: 'know_worth', path: '/portal/my-career-path' },
];
const SCHOOL_ICONS: Record<string, string> = {
  'AI Engineering': '⚙️',
  'AI Business': '💼',
  'Governance & Risk': '⚖️',
  'Human-AI Experience': '🎨',
};
const COURSE_SCHOOL: Record<string, string> = {
  // ── School of AI Engineering (8) ──────────────────────────────────────────
  'AI Cloud Engineer': 'AI Engineering',
  'AI Agent Engineer': 'AI Engineering',
  'AI Data Engineer': 'AI Engineering',
  'AI DevOps Engineer': 'AI Engineering',
  'AI Security Engineer': 'AI Engineering',
  'AI MLOps Engineer': 'AI Engineering',
  'AI Platform Engineer': 'AI Engineering',
  'AI Solutions Architect': 'AI Engineering',
  // ── School of AI Business Transformation (8) ──────────────────────────────
  'AI Solutions Consultant': 'AI Business',
  'AI Product Manager': 'AI Business',
  'AI Program Manager': 'AI Business',
  'AI Transformation Manager': 'AI Business',
  'AI Business Analyst': 'AI Business',
  'AI Sales Engineer': 'AI Business',
  'AI Enterprise Architect': 'AI Business',
  'AI Business Operations': 'AI Business',
  // ── School of Governance & Risk (7) ───────────────────────────────────────
  'AI Governance Professional': 'Governance & Risk',
  'Responsible AI Specialist': 'Governance & Risk',
  'AI Compliance Officer': 'Governance & Risk',
  'AI Risk Manager': 'Governance & Risk',
  'AI Auditor': 'Governance & Risk',
  'AI Ethics Specialist': 'Governance & Risk',
  'AI Policy Designer': 'Governance & Risk',
  // ── School of Human-AI Experience (5) ─────────────────────────────────────
  'AI UX Designer': 'Human-AI Experience',
  'Conversation Designer': 'Human-AI Experience',
  'Human-AI Interaction Specialist': 'Human-AI Experience',
  'Human-AI Interaction Specialist Certification': 'Human-AI Experience',
  'AI Workflow Designer': 'Human-AI Experience',
  'AI Experience Architect': 'Human-AI Experience',
};

// Certifications — shown separately, NOT in school tabs
const CERT_TITLES = [
  'Data Analytics Professional Certification',
  'Solution Architect Professional Certification',
  'DevOps & Cloud Engineering Professional',
  'DevOps & Cloud Engineering Professional Certification',
  'AI Mastery for Scrum Masters & Project Managers',
  'AI-Powered Scrum Master Professional Certification',
  'Project Management Professional Certification',
  'Business Analysis Professional Certification',
  'Cybersecurity Professional Certification',
];
const EXCLUDED = ['Rogers-Shaw', 'IT Merger', 'Network Integration'];

function sbFetch<T>(query: Promise<{ data: T | null; error: any }>, fallback: T, ms = 5000): Promise<T> {
  return Promise.race([
    query.then(r => r.data ?? fallback),
    new Promise<T>(res => setTimeout(() => res(fallback), ms)),
  ]);
}

const LANGS = ['EN', 'ES', 'FR', 'DE', 'ZH', 'AR', 'JA'];

export default function StudentPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  // Canonical headline progress — the ONE definition used by every metric on
  // this page (stat card, Talent Score, Career Path hours, skill bars, mobile).
  const { pct: overallProgress } = useProgress(user?.id);
  // Real, quiz-derived competency strengths (cross-program learning profile).
  // 0% per competency until there is quiz evidence — never a synthetic value.
  const { profile: learningProfile } = useLearningProfile(user?.id);
  const competencyBars = competencyBarsFromProfile(learningProfile);
  const { isPhone, isDesktop } = useBreakpoint();
  // Founder God Mode: unrestricted only when the founder has the toggle ON.
  // When OFF, the founder sees the real student experience (gates apply).
  const { godMode } = useFounderMode();
  // ?preview=student forces the genuine student experience: founder gate-bypass
  // is disabled so the real student gates (creed, course selection) apply.
  const [searchParams] = useSearchParams();
  const previewAsStudent = searchParams.get('preview') === 'student';
  const founder = isFounderEmail(user?.email) && godMode && !previewAsStudent;
  const { tier } = useSubscription();

  const [needsCreed, setNeedsCreed] = useState(shouldShowCreedGate());
  const [needsCourseSelection, setNeedsCourseSelection] = useState(false);
  const [creedLoaded, setCreedLoaded] = useState(true);
  const [courseSelectionLoaded, setCourseSelectionLoaded] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [labs, setLabs] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [certCount, setCertCount] = useState(0);
  const [activeSchool, setActiveSchool] = useState('AI Engineering');
  const [streakModal, setStreakModal] = useState(false);
  const [pointsModal, setPointsModal] = useState(false);
  const [labsModal, setLabsModal] = useState(false);
  const [profChat, setProfChat] = useState(false);
  const [profGreeting, setProfGreeting] = useState<string>('');
  const [profLoading, setProfLoading] = useState(false);
  const [simHistory, setSimHistory] = useState<any[]>([]);
  const [profileRow, setProfileRow] = useState<any | null>(null); // extended profiles row (recap-state cols); consumers (mute/DB day-gate) land in a follow-up
  const [recap, setRecap] = useState<any | null>(null);           // get-student-recap response (Option-A contract); text-only this step
  // Talent Score — single source of truth (derived from canonical progress).
  // Same formula the Talent Score page uses, so the two screens always agree.
  const talentScore = talentScoreFromProgress(overallProgress);
  // "Hours to employable" derived from the SAME canonical progress (single 600h source).
  const hoursLeft = careerHoursLeft(overallProgress);

  const T = (key: string) => overviewT(language || 'en', key);

  // Course-selection gate trigger: a starter who has not yet chosen their free program
  // must pick one before using the portal. Keyed on profiles.tier === 'starter' (the
  // string the gate + ChapterView use), NOT useSubscription's t1/t2/t3. courseSelectionLoaded
  // holds rendering until this resolves so the dashboard never flashes before the gate.
  useEffect(() => {
    // While auth is still resolving (user null), keep the flash guard BLOCKING — do not mark
    // loaded yet, so the portal can't render before the profiles fetch. (Previously this branch
    // set courseSelectionLoaded(true), letting the dashboard render on cold loads and stranding
    // starters past the gate.) courseSelectionLoaded is resolved only after the fetch below.
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('tier, free_course_id, onboarding_completed, last_login_at, last_prof_didier_briefing_at, prof_didier_voice_muted, free_course_completed')
        .eq('user_id', user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        // Don't swallow — surface it. Still resolve loaded so the portal isn't stuck blank.
        console.error('Course-selection trigger: profiles fetch failed:', error);
      } else {
        // Store the extended row so the recap-state columns are available client-side
        // (mute short-circuit + DB day-gate writer are follow-ups). Reuses this single
        // profiles read — no second/parallel fetch.
        setProfileRow(profile);
        if (!founder && profile?.tier === 'starter' && !profile?.free_course_id) {
          setNeedsCourseSelection(true);
        }
      }
      setCourseSelectionLoaded(true);
    })();
    return () => { cancelled = true; };
    // Key on user?.id (stable) rather than the user object, so identity churn across renders
    // doesn't re-run the effect and cancel the in-flight fetch before it sets the gate.
  }, [user?.id]);

  // Prof. Didier recap (Step 2, TEXT-ONLY): fetch the Option-A briefing via the JWT-scoped
  // edge function (auto-attaches the session token) and render it in the mentor card. On
  // error, the card falls back to its static text — never blank. No voice here.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-student-recap', { body: {} });
        if (cancelled) return;
        if (error) {
          console.error('get-student-recap failed:', error);
          setRecap(null); // fall back to the static card text
          return;
        }
        setRecap(data ?? null);
        // Login/briefing-state WRITER (client-side, text-only). The recap above was computed
        // server-side from the PREVIOUS last_login_at, so it is now safe to advance the
        // timestamps. Gate to ONCE PER CALENDAR DAY via the existing prof_briefing_shown_<uid>
        // key (now an actual guard) so recap re-fetches never erase the "since last login" gap.
        // Order matters: this runs AFTER setRecap. Non-blocking + fail-open — never blocks render.
        try {
          const today = getLocalDateString();
          const key = `prof_briefing_shown_${user.id}`;
          if (localStorage.getItem(key) !== today) {
            const nowIso = new Date().toISOString();
            supabase.from('profiles')
              .update({ last_login_at: nowIso, last_prof_didier_briefing_at: nowIso })
              .eq('user_id', user.id)
              .then(({ error }) => { if (error) console.error('briefing-state write failed:', error); });
            localStorage.setItem(key, today);
          }
        } catch (e) { console.error('briefing-state gate error:', e); }
      } catch (e) {
        if (!cancelled) { console.error('get-student-recap exception:', e); setRecap(null); }
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  // Simulation attempt history (most recent 5)
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from('simulation_attempts')
      .select('sim_id,sim_title,sim_type,score,xp_earned,verdict,completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(5)
      .then(({ data }) => { if (!cancelled && data) setSimHistory(data); });
    return () => { cancelled = true; };
  }, [user?.id]);

  // Load all student data
  useEffect(() => {
    if (!user) return;
    async function load() {
      const [pointsData, labsData, coursesData, certsData] = await Promise.all([
        sbFetch(supabase.from('student_points').select('points').eq('user_id', user!.id), []),
        sbFetch(supabase.from('student_labs').select('*').eq('user_id', user!.id), []),
        sbFetch(supabase.from('courses').select('id,title,translations').eq('is_published', true), []),
        sbFetch(supabase.from('user_progress').select('id').eq('user_id', user!.id).not('completed_at', 'is', null), []),
      ]);
      setTotalPoints((pointsData as any[]).reduce((s: number, p: any) => s + (p.points || 0), 0));
      setLabs(labsData as any[]);
      setCertCount(Math.floor((certsData as any[]).length / 5));

      const filtered = (coursesData as any[]).filter((c: any) => !EXCLUDED.some(e => c.title?.includes(e)));
      if (!filtered.length) return;

      // Single bulk fetch instead of N+1 queries per course
      const courseIds = filtered.map((c: any) => c.id);
      const [allChaps, allProg] = await Promise.all([
        sbFetch(supabase.from('chapters').select('id,course_id').in('course_id', courseIds), []),
        sbFetch(supabase.from('user_progress').select('video_id,chapter_id').eq('user_id', user!.id).not('completed_at', 'is', null), []),
      ]);
      const chapIds = new Set((allChaps as any[]).map((c: any) => c.id));
      const allVids = chapIds.size > 0
        ? await sbFetch(supabase.from('videos').select('id,chapter_id').in('chapter_id', Array.from(chapIds)), [])
        : [];
      const doneVidIds = new Set((allProg as any[]).map((p: any) => p.video_id));

      // Build lookup maps
      const chapToCourse: Record<string, string> = {};
      (allChaps as any[]).forEach((ch: any) => { chapToCourse[ch.id] = ch.course_id; });
      const courseVidCount: Record<string, number> = {};
      const courseDoneCount: Record<string, number> = {};
      (allVids as any[]).forEach((v: any) => {
        const cid = chapToCourse[v.chapter_id];
        if (!cid) return;
        courseVidCount[cid] = (courseVidCount[cid] || 0) + 1;
        if (doneVidIds.has(v.id)) courseDoneCount[cid] = (courseDoneCount[cid] || 0) + 1;
      });

      const progData = filtered.map((course: any) => {
        const total = courseVidCount[course.id] || 0;
        const doneCount = courseDoneCount[course.id] || 0;
        const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
        const titleLower = course.title?.toLowerCase() || '';
        const isCert = CERT_TITLES.some(ct => titleLower.includes(ct.toLowerCase()) || ct.toLowerCase().includes(titleLower));
        let school: string | null = COURSE_SCHOOL[course.title] || null;
        if (!school && !isCert) {
          const key = Object.keys(COURSE_SCHOOL).find(k =>
            titleLower.includes(k.toLowerCase()) || k.toLowerCase().includes(titleLower)
          );
          school = key ? COURSE_SCHOOL[key] : null;
        }
        // Catalog-aware localized title (DB translations → static program catalog →
        // English/base). Re-runs on language switch via the effect dependency below.
        return { id: course.id, title: getLocalizedField(course, language, 'title', 'course'), total, done: doneCount, pct, school, isCert };
      });

      // Include ALL courses (even unseeded ones) so school counts are correct
      console.log('[Portal] Course school assignments:', progData.map(p => ({ title: p.title, school: p.school, isCert: p.isCert, total: p.total })));
      setCourses(progData.sort((a: any, b: any) => b.pct - a.pct || b.done - a.done));

      // Streak
      const quizDates = await sbFetch(
        supabase.from('user_progress').select('completed_at').eq('user_id', user!.id).not('completed_at', 'is', null).order('completed_at', { ascending: false }), []
      );
      let s = 0; const today = new Date(); today.setHours(0, 0, 0, 0); const seen = new Set<string>();
      for (const q of (quizDates as any[])) {
        const d = new Date(q.completed_at); d.setHours(0, 0, 0, 0);
        const key = d.toISOString().slice(0, 10);
        if (!seen.has(key)) {
          seen.add(key);
          const exp = new Date(today); exp.setDate(today.getDate() - s);
          if (d.getTime() === exp.getTime()) s++; else break;
        }
      }
      setStreak(s);
    }
    load();
    // `language` is a dependency so course titles re-localize on a language switch
    // (the Next Action "Continue: …" card and program cards stay in sync).
  }, [user?.id, language]);

  // Generate personalized AI greeting from Prof. Didier
  const generateProfGreeting = async () => {
    if (profLoading) return;
    setProfLoading(true);
    setProfGreeting('');
    setProfChat(true);

    try {
      // Build student context snapshot
      const started = courses.filter(c => c.pct > 0 && !c.isCert);
      const completed = courses.filter(c => c.pct === 100 && !c.isCert);
      const notStarted = courses.filter(c => c.pct === 0 && !c.isCert);
      const inProgress = courses.filter(c => c.pct > 0 && c.pct < 100 && !c.isCert);
      const topInProgress = inProgress.sort((a, b) => b.pct - a.pct).slice(0, 3);
      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

      const studentContext = `
Student name: ${userName}
Time of day: ${timeOfDay}
Overall progress across all courses: ${overallProgress}%
Day streak: ${streak} consecutive days
Total points earned: ${totalPoints}
Certifications earned: ${certCount}

Courses in progress (${inProgress.length}):
${topInProgress.map(c => `- ${c.title}: ${c.pct}% complete (${c.done}/${c.total} lessons done)`).join('\n') || 'None yet'}

Completed courses (${completed.length}): ${completed.map(c => c.title).join(', ') || 'None yet'}
Not started yet (${notStarted.length} courses available)

Platform: Aladiah Academy — AI-focused professional certifications
Language preference: ${lang}
      `.trim();

      const systemPrompt = `You are Professor Didier, the AI mentor of Aladiah Academy — an elite AI-focused professional certification platform. Your tagline is "Solo Excelencia" (Only Excellence).

Your personality: warm, direct, motivating, highly knowledgeable about AI careers. You speak like a world-class mentor who genuinely cares about each student's success. You are NOT generic — you give real, specific, actionable feedback based on the student's actual data.

You respond in the student's language (${lang === 'es' ? 'Spanish' : lang === 'fr' ? 'French' : lang === 'de' ? 'German' : lang === 'zh' ? 'Chinese' : lang === 'ar' ? 'Arabic' : lang === 'ja' ? 'Japanese' : 'English'}).

Your greeting must:
1. Open with a warm, personalized greeting using their name and time of day (2-3 sentences max)
2. Give a sharp, honest analysis of where they stand — reference their ACTUAL numbers (streak, progress %, specific courses)
3. Make 2-3 SPECIFIC recommendations: which course to focus on next, which chapters to revisit if behind, what to do today
4. Close with one powerful motivating line tied to their specific AI career path

Keep it under 200 words. Be specific, not generic. Sound human, not robotic. No bullet points — flowing conversational text.`;

      const response = await fetch(
        'https://vgujnkxylipfwmkpwzvb.supabase.co/functions/v1/ai-proxy',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWpua3h5bGlwZndta3B3enZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzYyMTUsImV4cCI6MjA4OTcxMjIxNX0.wpP8ZK0dtEegUu3r1f--sIkNHN1GnHTzvIstVAi1k20',
          },
          body: JSON.stringify({
            system: systemPrompt,
            messages: [{ role: 'user', content: `Generate my personalized greeting based on this data:\n\n${studentContext}` }],
            max_tokens: 400,
          })
        }
      );

      const data = await response.json();
      const text = data?.content?.[0]?.text || '';
      if (text) {
        setProfGreeting(text);
      } else {
        setProfGreeting(`Good ${timeOfDay}, ${userName}! I've analyzed your progress across Aladiah Academy. You're at ${overallProgress}% overall with a ${streak}-day streak — that consistency is exactly what separates students who make it to the top. Let's keep pushing forward. Your AI career starts here.`);
      }
    } catch {
      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      setProfGreeting(`Good ${timeOfDay}, ${userName}! I've reviewed your progress across Aladiah Academy. You're at ${overallProgress}% overall with a ${streak}-day streak. Keep that momentum going — consistency is everything in this field. Let's get to work.`);
    } finally {
      setProfLoading(false);
    }
  };

  // Identity = the authenticated user's OWN profile (profiles.full_name → auth
  // metadata → email prefix only if no name). Greetings show the first name only.
  const { firstName } = useIdentity();
  const userName = firstName;
  const displayName = firstName;

  // Step 3 (text-only): mode-aware mentor-card copy. The Prof. Didier card ALWAYS
  // greets with the CURRENT student's first name (useIdentity) — never a stale/old
  // recap value, and never a prior/test name.
  const recapName = firstName;
  const modeGreeting =
    recap?.mode === 'onboarding' ? T('prof_greet_onboarding') :
    recap?.mode === 'daily_briefing' ? T('prof_greet_daily') :
    recap?.mode === 'upgrade_coach' ? T('prof_greet_upgrade') :
    T('prof_greeting');
  const modeRecLabel =
    recap?.mode === 'onboarding' ? T('prof_rec_onboarding') :
    recap?.mode === 'daily_briefing' ? T('prof_rec_daily') :
    recap?.mode === 'upgrade_coach' ? T('prof_rec_upgrade') :
    null;
  const topCourse = courses.find(c => c.pct > 0 && c.pct < 100) || courses[0];
  // "Your Next Action" source of truth = the student's SELECTED program
  // (profiles.free_course_id, already loaded into profileRow — no extra fetch).
  // The home, Learn tab, and program detail must all reflect the SAME program the
  // student chose, so the selection wins over any progress-based default. When a
  // program is selected we never fall back to courses[0] (that was the bug: a fresh
  // free student with no progress saw an arbitrary default instead of their pick).
  // recap.current_course (also derived from free_course_id) and topCourse remain
  // fallbacks ONLY when no program has been selected (e.g. All-Access students).
  const recapCourse = recap?.current_course;
  const recapCourseProg = recapCourse?.id ? courses.find((c: any) => c.id === recapCourse.id) : null;
  const selectedProgramId = profileRow?.free_course_id || null;
  const selectedProgram = selectedProgramId ? courses.find((c: any) => c.id === selectedProgramId) : null;
  const nextActionCourse = selectedProgramId
    ? (selectedProgram
        ? { id: selectedProgram.id, title: selectedProgram.title, prog: selectedProgram }
        : { id: selectedProgramId, title: recapCourse?.id === selectedProgramId ? (recapCourse.title || '') : '', prog: null })
    : (recapCourse?.id
        ? { id: recapCourse.id, title: recapCourse.title || recapCourseProg?.title || '', prog: recapCourseProg }
        : (topCourse ? { id: topCourse.id, title: topCourse.title, prog: topCourse } : null));
  const nextActionHasProgress = !!(nextActionCourse?.prog && (nextActionCourse.prog.total ?? 0) > 0);
  // Prof. Didier card copy is composed CLIENT-SIDE in the SELECTED UI language
  // (not the server recap, which was bound to the stored profiles.preferred_language
  // and only covered en/es/fr — the root cause of the stale-Spanish card). It reads
  // only the recap's raw data buckets (mode, lessons since last login) plus the
  // already-localized selected-program title, so it re-renders instantly on a
  // language switch across all 8 launch languages with no refetch.
  const profMode: ProfMode =
    recap?.mode === 'onboarding' || recap?.mode === 'upgrade_coach' ? recap.mode : 'daily_briefing';
  const profCourseTitle = nextActionCourse?.title || recapCourse?.title || '';
  const profFirstMessage = recap
    ? composeProfFirstMessage(profMode, language || 'en', {
        name: firstName,
        course: profCourseTitle,
        lessons: recap?.since_last_login?.lessons_completed ?? 0,
      })
    : T('prof_analyzed');
  const profRecommendation = recap
    ? composeProfRecommendation(profMode, language || 'en', profCourseTitle)
    : '';
  // NOTE: headline progress is the canonical `overallProgress` (lesson completion
  // from useProgress), NOT a separate per-course average. `courses[].pct` remains
  // only for the per-course breakdown cards below.
  const ALL_SCHOOLS = ['AI Engineering', 'AI Business', 'Governance & Risk', 'Human-AI Experience'];
  const schoolCourses = courses.filter(c => c.school === activeSchool);
  const certCourses = courses.filter(c => c.isCert);

  if (!creedLoaded || !courseSelectionLoaded) return <div style={{ background: '#020817', minHeight: '100vh' }} />;
  if (needsCreed && !founder) return (
    <CreedAcknowledgmentGate onAcknowledge={() => setNeedsCreed(false)} />
  );
  if (needsCourseSelection && !founder) return (
    <CourseSelectionGate userId={user.id} onCourseSelected={() => setNeedsCourseSelection(false)} />
  );

  // ── Phone only (< 768px): the redesigned mobile shell. Tablet & desktop below are untouched. ──
  // Tablet/iPad (<1024) gets the responsive MobileHome too, matching the rest of
  // the portal (which hides the fixed sidebar <=1024). Desktop keeps the 3-col.
  if (!isDesktop) {
    return (
      <MobileHome
        name={displayName}
        score={overallProgress}
        course={nextActionCourse ? { id: nextActionCourse.id, title: nextActionCourse.title, pct: nextActionCourse.prog?.pct ?? 0 } : null}
      />
    );
  }

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', fontFamily: "'Inter',system-ui,sans-serif", color: '#e2e8f8', background: '#020817', display: 'flex', flexDirection: 'column' }}>

      {/* ── GLOBE BACKGROUND ── full screen, z-index 0 */}
      <img src={globeBg} alt="" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', objectPosition: 'center', zIndex: 0, pointerEvents: 'none' }} />
      {/* Gradient overlay */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to right,rgba(2,8,23,.97) 0%,rgba(2,8,23,.9) 14%,rgba(2,8,23,.58) 36%,rgba(2,8,23,.1) 62%,rgba(2,8,23,0) 100%)' }} />

      {/* ── TOP NAV ── the one shared Header (fixed, 70px). Spacer below reserves
          its space in the flex column, mirroring PortalShell's paddingTop:70. */}
      <Header />
      <div style={{ height: 70, flexShrink: 0 }} />

      {/* ── SECOND BAR ── */}
      <div style={{ position: 'relative', zIndex: 10, height: 44, flexShrink: 0, background: 'rgba(2,8,23,.82)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', padding: '0 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(180,130,20,.14)', border: '1px solid rgba(180,130,20,.3)', borderRadius: 10, padding: '6px 16px' }}>
          <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>{T('talent_score_label')}</span>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#f59e0b' }}>{talentScore}</span>
          <span style={{ fontSize: 10.5, color: '#34d399', fontWeight: 700 }}>{T('rising')}</span>
        </div>
        <button onClick={() => navigate('/portal/courses')} style={{ marginLeft: 'auto', background: 'linear-gradient(90deg,#4f8ef7,#6366f1)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, padding: '9px 20px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 20px rgba(79,142,247,.4)' }}>
          {T('continue_learning')}
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ position: 'relative', zIndex: 5, display: 'grid', gridTemplateColumns: '260px 1fr 310px', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        <PortalSidebar />

        {/* ── MAIN ── */}
        <main style={{ overflow: 'hidden', background: 'transparent', position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column' }}>
          {/* Hero */}
          <div style={{ padding: '24px 24px 16px', flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 5 }}>{getDateStr(language)}</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', lineHeight: 1.18 }}>{T('welcome')}, {displayName}! 👋</h1>
            <p style={{ fontSize: 12.5, color: '#64748b', margin: '0 0 16px', fontStyle: 'italic', maxWidth: 440, lineHeight: 1.65 }}>{T('subtitle')}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { icon: '🔥', val: streak, lbl: T('day_streak') },
                { icon: '⚡', val: labs.filter((l: any) => l.completed).length, lbl: T('labs_completed') },
                { icon: '🏆', val: 'Top 12%', lbl: T('top_learners') },
                { icon: '🌐', val: 98, lbl: T('countries_community') },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(2,8,23,.65)', border: '1px solid rgba(255,255,255,.11)', borderRadius: 9, padding: '6px 12px', fontSize: 12, backdropFilter: 'blur(10px)' }}>
                  <span>{p.icon}</span><b style={{ fontWeight: 700 }}>{p.val}</b><span style={{ color: '#94a3b8' }}>{p.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>

            {/* Your Next Action */}
            <div style={{ background: 'linear-gradient(155deg,rgba(8,20,52,.85),rgba(5,13,38,.9))', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '18px 20px', marginBottom: 14, backdropFilter: 'blur(28px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 800 }}>{T('your_next_action')}</span>
                <span style={{ fontSize: 11, color: '#475569' }}>{T('fastest_path')}</span>
              </div>
              {nextActionCourse ? (
                <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 56px 115px', gap: 14, alignItems: 'center', padding: '16px 18px', background: 'linear-gradient(90deg,rgba(49,68,150,.38),rgba(10,20,60,.55))', border: '1px solid rgba(99,102,241,.18)', borderRadius: 13 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'radial-gradient(#7c3aed,#1d2472)', boxShadow: '0 0 22px rgba(124,58,237,.55)', fontSize: 22 }}>☁️</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{T('continue')}: {nextActionCourse.title}</div>
                    {nextActionHasProgress && (
                      <>
                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 9 }}>{nextActionCourse.prog.done}/{nextActionCourse.prog.total} {T('lessons')}</div>
                        <div style={{ height: 5, background: 'rgba(255,255,255,.08)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${nextActionCourse.prog.pct}%`, background: 'linear-gradient(90deg,#6366f1,#818cf8)', borderRadius: 99 }} />
                        </div>
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#818cf8', textAlign: 'center' }}>{nextActionHasProgress ? `${nextActionCourse.prog.pct}%` : ''}</div>
                  <button onClick={() => navigate(`/portal/course/${nextActionCourse.id}`)} style={{ background: 'linear-gradient(90deg,#4f8ef7,#6366f1)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, padding: 12, cursor: 'pointer', fontFamily: 'inherit', width: '100%', boxShadow: '0 0 20px rgba(79,142,247,.4)' }}>
                    {T('continue')} →
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{t('portal.no_courses')}</span>
                  <button onClick={() => navigate('/portal/courses')} style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#4f8ef7,#6366f1)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {t('portal.browse_courses')}
                  </button>
                </div>
              )}
            </div>

            {/* 3 Action Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 13, marginBottom: 14 }}>
              {/* AI Mentor */}
              <div style={{ background: 'rgba(45,15,80,.8)', border: '1px solid rgba(124,58,237,.32)', borderRadius: 15, padding: 18, position: 'relative', overflow: 'hidden', backdropFilter: 'blur(22px)' }}>
                <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 60, height: 60 }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(139,92,246,.55)', boxShadow: '0 0 16px rgba(139,92,246,.4)' }} />
                  <div style={{ position: 'absolute', inset: 7, borderRadius: '50%', border: '1px solid rgba(139,92,246,.28)' }} />
                  <svg width="44" height="44" viewBox="0 0 44 44" style={{ position: 'relative', zIndex: 1, display: 'block', margin: '8px auto 0' }}>
                    <circle cx="22" cy="22" r="19" fill="rgba(109,54,231,.62)" stroke="rgba(196,181,253,.42)" strokeWidth="1" />
                    <rect x="11" y="11" width="22" height="18" rx="5.5" fill="rgba(139,92,246,.9)" />
                    <circle cx="17.5" cy="19" r="3.5" fill="#ddd6fe" /><circle cx="26.5" cy="19" r="3.5" fill="#ddd6fe" />
                    <circle cx="17.5" cy="19" r="1.8" fill="#6d28d9" /><circle cx="26.5" cy="19" r="1.8" fill="#6d28d9" />
                    <circle cx="18.3" cy="18.2" r=".8" fill="#fff" /><circle cx="27.3" cy="18.2" r=".8" fill="#fff" />
                    <line x1="22" y1="11" x2="22" y2="6" stroke="rgba(196,181,253,.7)" strokeWidth="1.8" />
                    <circle cx="22" cy="5.2" r="2.2" fill="rgba(196,181,253,.85)" />
                    <rect x="14" y="25" width="16" height="2.5" rx="1.2" fill="rgba(196,181,253,.5)" />
                    <rect x="7" y="16" width="4" height="7" rx="2" fill="rgba(124,58,237,.6)" />
                    <rect x="33" y="16" width="4" height="7" rx="2" fill="rgba(124,58,237,.6)" />
                  </svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, maxWidth: '58%' }}>{T('ai_mentor')}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6, marginBottom: 13, maxWidth: '58%' }}>{T('ai_mentor_sub')}</div>
                <button onClick={generateProfGreeting} style={{ border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', background: 'linear-gradient(90deg,#7c3aed,#6d28d9)', color: '#fff', boxShadow: '0 0 14px rgba(124,58,237,.4)' }}>
                  {T('chat_now')}
                </button>
              </div>

              {/* Daily Challenge */}
              <div style={{ background: 'rgba(5,38,22,.8)', border: '1px solid rgba(22,163,74,.22)', borderRadius: 15, padding: 18, position: 'relative', overflow: 'hidden', backdropFilter: 'blur(22px)' }}>
                <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 38, opacity: .55 }}>🎯</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{T('daily_challenge')}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6, marginBottom: 13 }}>{T('daily_challenge_sub')}</div>
                <button onClick={() => navigate('/portal/simulations')} style={{ border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', background: 'linear-gradient(90deg,#16a34a,#15803d)', color: '#fff' }}>
                  {T('start_challenge')}
                </button>
              </div>

              {/* Live Session */}
              <div style={{ background: 'rgba(45,5,5,.8)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 15, padding: 18, backdropFilter: 'blur(22px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{T('live_session')}</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: '#dc2626', borderRadius: 99, padding: '3px 8px', fontSize: 8.5, fontWeight: 800, boxShadow: '0 0 10px rgba(220,38,38,.55)' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />{t('portal.live')}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>{T('live_session_sub')}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <div style={{ display: 'flex' }}>
                    {['#6366f1', '#7c3aed', '#10b981'].map((c, i) => (
                      <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: '2px solid rgba(2,8,23,.9)', marginLeft: i > 0 ? -6 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>
                        {['S', 'D', 'A'][i]}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate('/community')} style={{ border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', background: 'linear-gradient(90deg,#dc2626,#b91c1c)', color: '#fff' }}>
                    {T('join_now')}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', background: 'linear-gradient(155deg,rgba(8,20,52,.85),rgba(5,13,38,.9))', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, overflow: 'hidden', backdropFilter: 'blur(28px)', marginBottom: 14 }}>
              {[
                { val: `${overallProgress}%`, lbl: T('overall_progress'), sub: T('keep_going'), color: '#6366f1', onClick: () => navigate('/portal/my-career-path') },
                { val: streak, lbl: `${T('day_streak')} 🔥`, sub: T('amazing'), color: '#f97316', onClick: () => setStreakModal(true) },
                { val: totalPoints.toLocaleString(), lbl: T('points_earned'), sub: T('this_week'), color: '#f59e0b', onClick: () => setPointsModal(true) },
                { val: labs.filter((l: any) => l.completed).length, lbl: T('labs_completed'), sub: T('labs_week'), color: '#34d399', onClick: () => setLabsModal(true) },
                { val: certCount, lbl: T('certifications'), sub: T('in_progress'), color: '#a855f7', onClick: () => navigate('/portal/certifications') },
              ].map((s, i) => (
                <div key={i} onClick={s.onClick} style={{ padding: '20px 10px', textAlign: 'center', borderRight: i < 4 ? '1px solid rgba(255,255,255,.06)' : 'none', cursor: 'pointer' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, marginBottom: 5, color: s.color, letterSpacing: '-.5px' }}>{s.val}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{s.lbl}</div>
                  <div style={{ fontSize: 9.5, color: '#475569' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Programs */}
            <div style={{ background: 'linear-gradient(155deg,rgba(8,20,52,.85),rgba(5,13,38,.9))', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, overflow: 'hidden', backdropFilter: 'blur(28px)', marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 10px' }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{T('ai_workforce')}</span>
                  <span style={{ fontSize: 11, color: '#475569', marginLeft: 7 }}>— {courses.filter(c => !c.isCert).length || 28} {T('programs_schools')}</span>
                </div>
                <button onClick={() => navigate('/portal/courses')} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{T('view_all')}</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '155px 1fr' }}>
                <div style={{ background: 'rgba(4,10,32,.5)', padding: '6px 0', borderRight: '1px solid rgba(255,255,255,.06)' }}>
                  {ALL_SCHOOLS.map(sch => {
                    const cnt = courses.filter(c => c.school === sch).length;
                    return (
                      <div key={sch} onClick={() => setActiveSchool(sch)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 13px', cursor: 'pointer', fontSize: 12.5, color: activeSchool === sch ? '#a5b4fc' : '#64748b', background: activeSchool === sch ? 'rgba(99,102,241,.16)' : 'transparent', fontWeight: activeSchool === sch ? 700 : 500, transition: 'all .15s' }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, background: activeSchool === sch ? 'rgba(99,102,241,.2)' : 'rgba(255,255,255,.05)', flexShrink: 0 }}>
                          {SCHOOL_ICONS[sch] || '📚'}
                        </div>
                        <span style={{ flex: 1 }}>{sch}</span>
                        {cnt > 0 && <span style={{ fontSize: 9, background: 'rgba(99,102,241,.25)', color: '#a5b4fc', borderRadius: 99, padding: '1px 6px', fontWeight: 700 }}>{cnt}</span>}
                      </div>
                    )
                  })}

                </div>
                <div style={{ padding: '8px 16px 12px', overflowY: 'auto', maxHeight: 320 }}>
                  {schoolCourses.length === 0 && (
                    <div style={{ padding: '24px 12px', textAlign: 'center', color: '#334155', fontSize: 12 }}>
                      {t('portal.loading_courses')}
                    </div>
                  )}
                  {schoolCourses.map((cp, idx) => (
                    <div key={cp.id} onClick={() => navigate(`/portal/course/${cp.id}`)} style={{ display: 'grid', gridTemplateColumns: '34px 1fr 125px 85px', gap: 12, alignItems: 'center', padding: '10px 6px', borderRadius: 9, borderBottom: '1px solid rgba(255,255,255,.05)', cursor: 'pointer', transition: 'all .15s' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {cp.title}
                          {cp.pct === 0 && idx < 2 && <span style={{ marginLeft: 5, fontSize: 8, background: '#16a34a', color: '#fff', borderRadius: 99, padding: '1px 5px', fontWeight: 800 }}>{T('new')}</span>}
                        </div>
                        <div style={{ fontSize: 10, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cp.done}/{cp.total} {T('lessons')}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5 }}>
                          <span style={{ fontWeight: 800, color: cp.pct > 0 ? '#818cf8' : '#334155' }}>{cp.pct}%</span>
                          <span style={{ color: '#334155' }}>{cp.done}/{cp.total}</span>
                        </div>
                        <div style={{ height: 3, background: 'rgba(255,255,255,.07)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${cp.pct}%`, background: cp.pct > 50 ? 'linear-gradient(90deg,#6366f1,#34d399)' : 'linear-gradient(90deg,#7c3aed,#6366f1)', borderRadius: 99 }} />
                        </div>
                      </div>
                      <button style={{ padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid rgba(255,255,255,.1)', background: 'rgba(8,18,50,.8)', color: cp.pct > 0 ? '#e2e8f8' : '#475569', whiteSpace: 'nowrap' }}>
                        {cp.pct > 0 ? `${T('continue')} →` : T('start')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools Dock */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', background: 'linear-gradient(155deg,rgba(8,20,52,.88),rgba(5,13,38,.92))', border: '1px solid rgba(99,102,241,.12)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.07)' }}>
              {TOOLS.map((tool, i) => (
                <button key={i} onClick={() => navigate(tool.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 8px', borderRight: i < 4 ? '1px solid rgba(255,255,255,.06)' : undefined, cursor: 'pointer', textAlign: 'center', background: 'none', border: 'none', fontFamily: 'inherit', transition: 'all .2s' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: [
                      'rgba(99,102,241,.2)', 'rgba(52,211,153,.18)', 'rgba(245,158,11,.18)', 'rgba(96,165,250,.18)', 'rgba(251,146,60,.18)'
                    ][i]
                  }}>
                    {tool.icon}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f8' }}>{T(tool.lbl)}</div>
                  <div style={{ fontSize: 9.5, color: '#475569' }}>{tool.count ? `${tool.count} ${T(tool.sub)}` : T(tool.sub)}</div>
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* ── RIGHT PANEL ── scrollable, all 4 boxes independent */}
        <aside style={{ background: 'rgba(2,6,18,.72)', backdropFilter: 'blur(22px)', borderLeft: 'none', overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 13, position: 'relative', zIndex: 5 }}>

          {/* 1. PROF CARD */}
          <div style={{ position: 'relative', width: '100%', height: 260, overflow: 'hidden', borderRadius: 18, border: '1px solid rgba(59,130,246,.3)', background: '#020817', boxShadow: '0 0 45px rgba(37,99,235,.22)', flexShrink: 0 }}>
            <img src={profCardBg} alt="" style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: 'auto', minWidth: '62%', objectFit: 'cover', objectPosition: 'top right', zIndex: 0, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to right,rgba(2,8,23,.98) 0%,rgba(2,8,23,.94) 22%,rgba(2,8,23,.7) 44%,rgba(2,8,23,.2) 65%,transparent 82%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '48%', zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to top,rgba(2,8,23,.88) 0%,transparent 100%)' }} />
            {/* Header */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 11, padding: '16px 16px 0' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0, background: 'rgba(15,35,80,.85)', border: '1.5px solid rgba(59,130,246,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#60a5fa', boxShadow: '0 0 14px rgba(59,130,246,.35)' }}>
                AI
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 1 }}>{t('portal.prof_name')}</div>
                <div style={{ fontSize: 11, color: '#7a9cbf' }}>{t('portal.prof_title')}</div>
              </div>
            </div>
            {/* Message box */}
            <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, zIndex: 10, background: 'rgba(6,16,42,.92)', border: '1px solid rgba(59,130,246,.22)', borderRadius: 12, padding: '12px 13px', backdropFilter: 'blur(16px)', boxShadow: '0 8px 28px rgba(0,0,0,.5)' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                {modeGreeting}, {recapName}! <span style={{ color: '#f59e0b' }}>🌟</span>
              </div>
              {/* Step 2: data-driven recap (first_message) with static fallback — never blank */}
              <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.55, marginBottom: profRecommendation ? 5 : 10 }}>
                {profFirstMessage}
              </p>
              {profRecommendation && (
                <p style={{ fontSize: 11, color: '#67e8f9', fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>
                  {modeRecLabel ? `${modeRecLabel}: ` : '→ '}{profRecommendation}
                </p>
              )}
              <button onClick={generateProfGreeting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', minHeight: 38, padding: '8px 12px', background: 'linear-gradient(90deg,#1d4ed8,#2563eb)', border: 'none', borderRadius: 9, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 20px rgba(37,99,235,.38)' }}>
                <span style={{ textAlign: 'left', lineHeight: 1.2 }}>🎙️ {T('talk_prof')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                  {[5, 9, 13, 9, 6, 4].map((h, i) => (
                    <span key={i} style={{ display: 'inline-block', width: 3, height: h, borderRadius: 99, background: '#67e8f9', opacity: .85 }} />
                  ))}
                </div>
              </button>
            </div>
          </div>

          {/* 2. TALENT SCORE */}
          <div style={{ background: 'linear-gradient(155deg,rgba(8,20,52,.88),rgba(5,13,38,.92))', border: '1px solid rgba(255,255,255,.08)', borderRadius: 15, padding: 14, boxShadow: '0 4px 20px rgba(0,0,0,.4)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{T('talent_score_label')}</span>
              <div><span style={{ fontSize: 9.5, color: '#34d399', fontWeight: 700 }}>↑ {T('rising_star')}</span><span style={{ fontSize: 8.5, color: '#334155', marginLeft: 3 }}>+38 {t('portal.this_week')}</span></div>
            </div>
            <div style={{ marginBottom: 9 }}><span style={{ fontSize: 30, fontWeight: 800, color: '#fb923c', letterSpacing: '-.5px' }}>{talentScore}</span><span style={{ fontSize: 13, color: '#334155', marginLeft: 3 }}>/ 1000</span></div>
            <svg width="100%" height="54" viewBox="0 0 256 54" preserveAspectRatio="none" style={{ display: 'block', marginBottom: 4 }}>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity=".6" /><stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" /></linearGradient></defs>
              <path d="M0 50 L36 45 L73 40 L110 47 L146 30 L183 17 L219 8 L256 2 L256 54 L0 54Z" fill="url(#sg)" />
              <path d="M0 50 L36 45 L73 40 L110 47 L146 30 L183 17 L219 8 L256 2" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {[0, 36, 73, 110, 146, 183, 219, 256].map((x, i) => <circle key={i} cx={x} cy={[50, 45, 40, 47, 30, 17, 8, 2][i]} r="3" fill="#60a5fa" />)}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
              {['May 21', 'May 22', 'May 23', 'May 24', 'May 25', 'May 26', 'May 27'].map(d => <span key={d} style={{ fontSize: 8, color: '#1e293b' }}>{d}</span>)}
            </div>
            <button onClick={() => navigate('/portal/talent-score')} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', padding: 0, display: 'block', marginBottom: 11, fontFamily: 'inherit' }}>
              {T('view_breakdown')}
            </button>
            <div style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 9, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.06)' }}>{T('top_skills')}</div>
            {competencyBars.map((sk, i) => (
              <div key={sk.label} style={{ marginBottom: i < competencyBars.length - 1 ? 8 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10.5 }}>
                  <span style={{ color: '#64748b' }}>{sk.label}</span>
                  <span style={{ fontWeight: 700, color: sk.color }}>{sk.score}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,.07)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sk.score}%`, background: sk.color, borderRadius: 99, opacity: .9 }} />
                </div>
              </div>
            ))}
          </div>

          {/* 3. CAREER MOMENTUM */}
          <div style={{ background: 'linear-gradient(155deg,rgba(8,20,52,.88),rgba(5,13,38,.92))', border: '1px solid rgba(255,255,255,.08)', borderRadius: 15, padding: 14, boxShadow: '0 4px 20px rgba(0,0,0,.4)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{T('career_momentum')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#ef4444', fontWeight: 700 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444' }} />
                {T('live_feed')}
              </div>
            </div>
            {MOMENTUM.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: i < 2 ? 9 : 0, paddingBottom: i < 2 ? 9 : 0, borderBottom: i < 2 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(99,102,241,.4)' }}>
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="16" fill="#0c1a3d" />
                    <ellipse cx="16" cy="29" rx="11" ry="9" fill={['#1d4ed8', '#4338ca', '#065f46'][i]} />
                    <circle cx="16" cy="12" r="7" fill={['#c68642', '#e8b89a', '#7B3F00'][i]} />
                    <ellipse cx="16" cy="7" rx="7.5" ry="5" fill={['#1c0e05', '#4a2810', '#0a0500'][i]} />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, lineHeight: 1.5, color: '#64748b' }}>
                    <strong style={{ color: '#e2e8f8' }}>{item.name}</strong>
                    {' '}{item.action === 'got_hired' && <>{T('got_hired')} <span style={{ color: '#6366f1' }}>{item.role} {T('at')} {item.company}</span></>}
                    {item.action === 'completed' && <>{T('completed')} <span style={{ color: '#6366f1' }}>{item.program}</span></>}
                    {item.action === 'earned' && <>{T('earned')} <span style={{ color: '#f59e0b', fontWeight: 700 }}>{item.cert}</span></>}
                  </div>
                  {(item as any).salary && <div style={{ fontSize: 11, fontWeight: 800, color: '#34d399', marginTop: 2 }}>{(item as any).salary}{T('year')}</div>}
                  <div style={{ fontSize: 9, color: '#1e293b', marginTop: 2 }}>{item.time} {T('ago')}</div>
                </div>
              </div>
            ))}
            {MOMENTUM.length === 0 && (
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{t('portal.momentum_empty')}</div>
            )}
          </div>

          {/* 4. SIM HISTORY */}
          <div style={{ background: 'linear-gradient(155deg,rgba(8,20,52,.88),rgba(5,13,38,.92))', border: '1px solid rgba(255,255,255,.08)', borderRadius: 15, padding: 14, boxShadow: '0 4px 20px rgba(0,0,0,.4)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>⚡ Sim History</span>
              <button
                onClick={() => navigate('/portal/simulations')}
                style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 10, fontWeight: 700, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
              >
                View All →
              </button>
            </div>
            {simHistory.length === 0 ? (
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>
                Complete your first simulation to see your results here.
              </div>
            ) : (
              simHistory.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'center',
                  marginBottom: i < simHistory.length - 1 ? 8 : 0,
                  paddingBottom: i < simHistory.length - 1 ? 8 : 0,
                  borderBottom: i < simHistory.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
                }}>
                  {/* Type icon */}
                  <div style={{
                    width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                    background: 'rgba(74,144,245,.12)', border: '1px solid rgba(74,144,245,.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                  }}>
                    {SIM_TYPE_ICONS[a.sim_type] || '🎯'}
                  </div>
                  {/* Title + time */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.sim_title}
                    </div>
                    <div style={{ fontSize: 9, color: '#475569', marginTop: 1 }}>
                      {formatTimeAgo(a.completed_at)}
                      {a.verdict && (
                        <span style={{ marginLeft: 5, color: VERDICT_COLORS[a.verdict] || '#8596AD', fontWeight: 600 }}>
                          {a.verdict}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Score + XP */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: scoreRingColor(a.score) }}>
                      {a.score}
                    </div>
                    <div style={{ fontSize: 8, color: '#34d399', fontWeight: 600 }}>
                      +{a.xp_earned} XP
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 5. FUTURE READY */}
          <div style={{ background: 'linear-gradient(135deg,rgba(37,99,235,.28),rgba(124,58,237,.34))', border: '1px solid rgba(99,102,241,.32)', borderRadius: 15, padding: 14, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'radial-gradient(#22d3ee,#4338ca)', display: 'grid', placeItems: 'center', fontSize: 21, flexShrink: 0, boxShadow: '0 0 14px rgba(34,211,238,.3)' }}>🚀</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 3 }}>{T('future_ready')}</div>
              <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.5 }}>{T('future_sub')}</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modals */}
      <StreakDetailModal open={streakModal} onClose={() => setStreakModal(false)} streak={streak} />
      <PointsDetailModal open={pointsModal} onClose={() => setPointsModal(false)} points={totalPoints} />
      <LabsDetailModal open={labsModal} onClose={() => setLabsModal(false)} labs={labs} />

      {/* Prof Chat overlay — AI-powered personalized greeting */}
      {profChat && (
        <div onClick={() => { if (!profLoading) setProfChat(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(160deg,#0d1829,#080f1e)', border: '1px solid rgba(59,130,246,.35)', borderRadius: 22, padding: '1.75rem', maxWidth: 500, width: '92%', boxShadow: '0 40px 80px rgba(0,0,0,.7)', position: 'relative', overflow: 'hidden' }}>
            {/* Glow accent */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,.18),transparent 70%)', pointerEvents: 'none' }} />
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(15,35,80,.9)', border: '2px solid rgba(59,130,246,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: '#60a5fa', flexShrink: 0, boxShadow: '0 0 20px rgba(59,130,246,.3)' }}>AI</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: 15 }}>{t('portal.prof_name')}</div>
                <div style={{ fontSize: 11, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  {profLoading ? t('portal.prof_analyzing') : t('portal.prof_mentor')}
                </div>
              </div>
              <button onClick={() => { if (!profLoading) setProfChat(false) }} style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#64748b', fontSize: 18, cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
            </div>
            {/* Message area */}
            <div style={{ background: 'rgba(6,16,42,.7)', border: '1px solid rgba(59,130,246,.18)', borderRadius: 14, padding: '16px 18px', marginBottom: 16, minHeight: 120, position: 'relative' }}>
              {profLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '20px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {[4, 8, 14, 10, 16, 12, 8, 14, 10, 6].map((h, i) => (
                      <div key={i} style={{ width: 4, borderRadius: 99, background: 'linear-gradient(to top,#2563eb,#67e8f9)', height: h, animation: 'wave 1s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600, textAlign: 'center', lineHeight: 1.6 }}>
                    {t('portal.prof_reviewing')}<br />
                    <span style={{ color: '#475569', fontWeight: 400, fontSize: 11 }}>{t('portal.prof_personalizing')}</span>
                  </div>
                </div>
              ) : profGreeting ? (
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>{profGreeting}</p>
              ) : (
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, margin: 0, fontStyle: 'italic', textAlign: 'center', paddingTop: 8 }}>
                  {t('portal.prof_ready')}
                </p>
              )}
            </div>
            {/* Stats row */}
            {!profLoading && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[
                  { val: `${overallProgress}%`, lbl: t('portal.stat_overall'), color: '#6366f1' },
                  { val: `${streak}🔥`, lbl: t('portal.stat_streak'), color: '#f97316' },
                  { val: totalPoints.toLocaleString(), lbl: t('portal.stat_points'), color: '#f59e0b' },
                  { val: `${courses.filter(c => c.pct > 0 && !c.isCert).length}`, lbl: t('portal.stat_active'), color: '#34d399' },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: '#475569', marginTop: 1 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            )}
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {profGreeting && !profLoading && (
                <button onClick={generateProfGreeting} style={{ flex: 1, padding: '11px 0', background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.4)', borderRadius: 11, color: '#60a5fa', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>
                  {t('portal.refresh')}
                </button>
              )}
              {!profGreeting && !profLoading && (
                <button onClick={generateProfGreeting} style={{ flex: 2, padding: '12px 0', background: 'linear-gradient(90deg,#2563eb,#6366f1)', border: 'none', borderRadius: 11, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, boxShadow: '0 0 20px rgba(37,99,235,.4)' }}>
                  {t('portal.get_analysis')}
                </button>
              )}
              <button onClick={() => { setProfChat(false); navigate('/portal/courses'); }} style={{ flex: 2, padding: '12px 0', background: profGreeting ? 'linear-gradient(90deg,#2563eb,#6366f1)' : 'rgba(255,255,255,.06)', border: profGreeting ? 'none' : '1px solid rgba(255,255,255,.1)', borderRadius: 11, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>
                {t('portal.go_courses')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        *{box-sizing:border-box}
        *::-webkit-scrollbar{width:4px;height:4px}
        *::-webkit-scrollbar-track{background:transparent}
        *::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:99px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes wave{0%,100%{transform:scaleY(1);opacity:.8}50%{transform:scaleY(2.2);opacity:1}}
      `}</style>
    </div>
  );
}
