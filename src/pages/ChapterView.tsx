import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { getLocalizedField } from '@/lib/i18nData';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConversation } from '@elevenlabs/react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Lock, Play, BookOpen, MessageCircle, Trophy } from 'lucide-react';
import PortalLangWidget from '@/components/portal/PortalLangWidget';
import Quiz from '@/components/course/Quiz';
import StarterPaywall from '@/components/StarterPaywall';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { isFounderEmail } from '@/lib/roles';
import { DEPRECATED_COURSE_REDIRECTS } from '@/lib/courseRedirects';
import { founderModeOn } from '@/hooks/useFounderMode';
import MobileLessonPlayer from '@/components/portal/MobileLessonPlayer';
import AvisHeroVisual from '@/components/avis/AvisHeroVisual';
import { getAvisAsset } from '@/data/avisAssets';

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string;

interface Course { id: string; title: string; translations: any; curriculum_version?: string; }
interface Chapter { id: string; title: string; description: string; order_index: number; course_id: string; translations: any; }
interface Video { id: string; title: string; description: string; chapter_id: string; order_index: number; video_url: string; translations: any; }
interface Quiz { id: string; chapter_id: string; quiz_type: string; }
// Spec A: ordered, typed step list for a module. Lessons first, then the chapter_end
// quiz. New step kinds (simulation/project/etc.) can be appended later without rework.
type LessonStep = { type: 'lesson'; video: Video };
type QuizStep = { type: 'quiz'; quizId: string };
type Step = LessonStep | QuizStep;

function Bars({ active }: { active: boolean }) {
  const h = [0.5, 0.9, 0.65, 1.1, 0.75, 1.0, 0.6];








  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 20 }}>
      {h.map((v, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2,
          background: 'rgba(96,165,250,0.9)',
          height: active ? `${v * 17}px` : '3px',
          transition: 'height 0.12s ease',
          animation: active ? `pb 0.${5 + i}s ease-in-out infinite alternate` : 'none',
          animationDelay: `${i * 0.06}s`
        }} />
      ))}
      <style>{`@keyframes pb{from{transform:scaleY(.35)}to{transform:scaleY(1.15)}}`}</style>
    </div>
  );
}

export default function ChapterView() {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { isPhone } = useBreakpoint();

  const [course, setCourse] = useState<Course | null>(null);
  const [showStudyGuide, setShowStudyGuide] = useState(false);
  const [lessonVisuals, setLessonVisuals] = useState<string[]>([]);
  const [visualsLoading, setVisualsLoading] = useState(false);
  const [visualsKey, setVisualsKey] = useState('');
  const getStudyGuidePdf = (t: string): string | null => {
    const m: Record<string, string> = { 'AI Cloud Engineer': 'ai-cloud-engineer-study-guide.pdf', 'AI Agent Engineer': 'ai-agent-engineer-study-guide.pdf', 'AI Data Engineer': 'ai-data-engineer-study-guide.pdf', 'AI DevOps Engineer': 'ai-devops-engineer-study-guide.pdf', 'AI Security Engineer': 'ai-security-engineer-study-guide.pdf', 'AI MLOps Engineer': 'ai-mlops-engineer-study-guide.pdf', 'AI Solutions Architect': 'ai-solutions-architect-study-guide.pdf', 'AI Platform Engineer': 'ai-platform-engineer-study-guide.pdf', 'AI Solutions Consultant': 'ai-solutions-consultant-study-guide.pdf', 'AI Product Manager': 'ai-product-manager-study-guide.pdf', 'AI Business Operations': 'ai-business-operations-study-guide.pdf', 'AI Sales Engineer': 'ai-sales-engineer-study-guide.pdf', 'AI Business Analyst': 'ai-business-analyst-study-guide.pdf', 'AI Transformation Manager': 'ai-transformation-mgr-study-guide.pdf', 'AI Program Manager': 'ai-program-manager-study-guide.pdf', 'AI Enterprise Architect': 'ai-enterprise-architect-study-guide.pdf', 'AI Governance Professional': 'ai-governance-pro-study-guide.pdf', 'Responsible AI Specialist': 'responsible-ai-study-guide.pdf', 'AI Compliance Officer': 'ai-compliance-officer-study-guide.pdf', 'AI Risk Manager': 'ai-risk-manager-study-guide.pdf', 'AI Auditor': 'ai-auditor-study-guide.pdf', 'AI Policy Designer': 'ai-policy-designer-study-guide.pdf', 'AI Ethics Specialist': 'ai-ethics-specialist-study-guide.pdf', 'AI UX Designer': 'ai-ux-designer-study-guide.pdf', 'Conversation Designer': 'conversation-designer-study-guide.pdf', 'Human-AI Interaction Specialist': 'human-ai-interaction-study-guide.pdf', 'AI Workflow Designer': 'ai-workflow-designer-study-guide.pdf', 'AI Experience Architect': 'ai-experience-architect-study-guide.pdf' };
    const f = m[t]; return f ? 'https://vgujnkxylipfwmkpwzvb.supabase.co/storage/v1/object/public/study-guides/' + f : null;
  };
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Video | null>(null);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [paywallReason, setPaywallReason] = useState<'wrong_course' | 'module_locked' | null>(null);
  const [checkoutError, setCheckoutError] = useState(false);
  const [isStarter, setIsStarter] = useState(false);
  const [freeCourseName, setFreeCourseName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);

  // Prof. Didier conversation state
  const [convStatus, setConvStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<{ role: 'user' | 'agent'; message: string }[]>([]);
  const [recapComplete, setRecapComplete] = useState(false); // UI-only: agent finished the oral recap (sentinel). Never navigates.
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const isLive = convStatus === 'connected';
  const isStartingRef = useRef(false);

  const conversation = useConversation({
    onConnect: () => {
      setConvStatus('connected');
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
      // Keep-alive: send silent ping every 8 seconds to prevent timeout
      keepAliveRef.current = setInterval(() => {
        try { conversation.sendUserAudio && conversation.sendUserAudio(new Float32Array(480)); } catch { }
      }, 8000);
    },
    onDisconnect: () => {
      setConvStatus('idle');
      isStartingRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    },
    onMessage: ({ message, source }: { message: string; source: string }) => {
      // Strip ElevenLabs persona XML tags e.g. <LaSean Pickens (EN/ES)>...</LaSean Pickens (EN/ES)>
      let cleaned = message.replace(/<[^>]+>/g, '').trim();
      // Recap-complete sentinel: the prompt has the agent emit 'aladiah-module-complete-confirmed'
      // after the 5th recap question. STRIP it so the student never sees the raw tag (the warm
      // closing sentence in the same message still shows).
      const SENTINEL = 'aladiah-module-complete-confirmed';
      const sawSentinel = source === 'ai' && cleaned.toLowerCase().includes(SENTINEL);
      if (sawSentinel) cleaned = cleaned.replace(new RegExp(SENTINEL, 'ig'), '').trim();
      if (cleaned) setTranscript(p => [...p, { role: source === 'ai' ? 'agent' : 'user', message: cleaned }]);
      // Spec A boundary: the voice agent TEACHES ONLY. It must NOT navigate, unlock the next
      // module, or trigger module completion (that stays the chapter_end quiz pass). The sentinel
      // only (a) flags recap-complete for a UI cue and (b) ends the mic session gracefully —
      // it NEVER calls navigate().
      if (sawSentinel) {
        setRecapComplete(true);
        // End AFTER the spoken closing finishes (~3.5s) so we don't clip the goodbye.
        setTimeout(() => conversation.endSession().catch(() => { }), 3500);
      }
      // Existing fallback: also end on an explicit spoken goodbye.
      if (source === 'ai' && cleaned.toLowerCase().includes('goodbye')) {
        setTimeout(() => conversation.endSession().catch(() => { }), 1500);
      }
    },
    onError: () => setConvStatus('error'),
  });

  useEffect(() => { setIsSpeaking(conversation.isSpeaking); }, [conversation.isSpeaking]);
  useEffect(() => { transcriptRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }); }, [transcript]);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const startSession = useCallback(async () => {
    if (!currentLesson) return;
    if (isStartingRef.current || convStatus !== 'idle') return;
    isStartingRef.current = true;
    setTranscript([]);
    setRecapComplete(false);
    setDuration(0);
    try {
      // Request mic BEFORE setting connecting state to avoid Safari blank screen
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Unlock Safari WebAudio context BEFORE connecting ElevenLabs
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          await ctx.resume();
        }
      } catch { }
      setConvStatus('connecting');
      const lessonTranscript = getTranscript(currentLesson);
      const lessonTitle = getTitle(currentLesson);
      const chapterTitle = chapter?.title || '';
      const langLabel: Record<string, string> = {
        en: 'English', fr: 'French', es: 'Spanish', de: 'German',
        zh: 'Mandarin Chinese', ar: 'Arabic', ja: 'Japanese',
        pt: 'Portuguese', hi: 'Hindi', ko: 'Korean', it: 'Italian',
        ru: 'Russian', nl: 'Dutch', pl: 'Polish', tr: 'Turkish',
        sw: 'Swahili', yo: 'Yoruba', ha: 'Hausa', ig: 'Igbo',
        vi: 'Vietnamese', th: 'Thai'
      };
      const lang = langLabel[language] || 'English';
      // Trim transcript to first 800 chars to stay within ElevenLabs override limits
      const transcriptSnippet = lessonTranscript ? lessonTranscript.slice(0, 800) : '';
      const systemPrompt = `CRITICAL LANGUAGE INSTRUCTION: You MUST speak ONLY in ${lang} unless the student explicitly asks you to switch languages. If the student says 'speak in Chinese', 'switch to Igbo', 'habla español', or requests ANY language change — immediately switch to that language and continue teaching in it for the rest of the session. You are a multilingual professor fluent in all languages including Igbo, Yoruba, Hausa, Swahili, Hindi, Portuguese, and all world languages.

You are Prof. Didier at Aladiah Academy. Solo Excelencia — only excellence.
Lesson: "${lessonTitle}" | Module: "${chapterTitle}".
Lesson outline: ${transcriptSnippet}
Teach using Socratic method: ask questions, guide discovery, section by section.
If student asks questions, answer fully then resume. Say "continue" to proceed.
After teaching all sections, conduct an ORAL RECAP ASSESSMENT: ask exactly 5 recap questions one by one, waiting for the student's answer to each before asking the next, giving brief feedback. Do not skip ahead. While asking these questions, never say "module complete", "ready for the next level", "congratulations", or "Solo Excelencia" — keep all closing language for the very end.
Only after the student has answered the 5th question and you have given final feedback, say one warm closing sentence to the student in ${lang}, then end your message with this exact tag on its own, in English, verbatim: aladiah-module-complete-confirmed
Say that tag exactly once, only at this point, and never earlier. If the student has not answered all 5 questions, do not say the tag under any circumstances.
Start: greet warmly IN ${lang}, ask what student knows about "${lessonTitle}".`;
      const langCodeMap: Record<string, string> = {
        en: 'en', fr: 'fr', es: 'es', de: 'de',
        zh: 'zh', ar: 'ar', ja: 'ja', pt: 'pt',
        hi: 'hi', ko: 'ko', it: 'it', ru: 'ru',
        nl: 'nl', pl: 'pl', tr: 'tr', sw: 'sw',
        yo: 'yo', ha: 'ha', ig: 'ig', vi: 'vi', th: 'th'
      };
      const langCode = langCodeMap[language] || 'en';

      // Prof. Didier IS the lesson body — if the ElevenLabs agent can't start, the
      // whole class reads as "empty". Fail loud, and prefer a signed URL (works with
      // PRIVATE agents) with a fallback to the public agentId — mirrors LiveClassroom.
      if (!AGENT_ID) {
        console.error('[lesson] VITE_ELEVENLABS_AGENT_ID is not set — Prof. Didier cannot start.');
        setConvStatus('error');
        isStartingRef.current = false;
        return;
      }
      let signedUrl: string | null = null;
      try {
        const tokenRes = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`,
          { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` } }
        );
        const tokenData = await tokenRes.json();
        if (tokenData.signed_url) signedUrl = tokenData.signed_url;
      } catch (e) {
        console.warn('[lesson] signed URL unavailable, falling back to agentId:', e);
      }
      // Voice output: the agent whitelists override voices — without a tts.voiceId the
      // text streams but the audio can come back silent (LiveClassroom sends this; the
      // lesson player did not, which is why Prof. Didier "answered" with no sound).
      const DIDIER_VOICES: Record<string, string> = {
        en: 'bQxW1c7YCr6VQgQhw8KX', es: 'bQxW1c7YCr6VQgQhw8KX',
        fr: 'IBGoh6rlxdauchOCULhL', de: 'WPbK7Qv9rbyhvUDiwJ0A',
        zh: 'pU9NaAwkoR3v0Mrg3uKz', ar: 'Ojb0nFbyzZn95u0i5a5p', ja: 'Mv8AjrYZCBkdsmDHNwcB',
      };
      const sessionOpts: any = {
        overrides: {
          agent: { prompt: { prompt: systemPrompt }, language: langCode },
          tts: { voiceId: DIDIER_VOICES[language] || 'bQxW1c7YCr6VQgQhw8KX', stability: 0.71, similarityBoost: 0.55 },
        },
      };
      if (signedUrl) sessionOpts.signedUrl = signedUrl; else sessionOpts.agentId = AGENT_ID;
      await conversation.startSession(sessionOpts);
    } catch (e) {
      console.error('[lesson] Prof. Didier startSession failed:', e);
      setConvStatus('error');
      isStartingRef.current = false;
    }
  }, [conversation, currentLesson, chapter, language]);

  const endSession = useCallback(async () => {
    await conversation.endSession();
    if (timerRef.current) clearInterval(timerRef.current);
  }, [conversation]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => { loadData(); }, [chapterId]);



  const loadVisuals = async (lesson: any, courseTitle: string) => {
    // Language-aware cache key: EN and ES/FR/etc. diagrams are cached separately so a
    // Spanish student never sees the English-generated SVG. (lesson_visuals.lesson_id
    // is an untyped text key — safe to namespace.)
    const key = lesson?.id ? `${lesson.id}::${language}` : '';
    if (!key || key === visualsKey) return;
    setVisualsKey(key);
    setVisualsLoading(true);
    setLessonVisuals([]);
    try {
      const { data: cached } = await supabase.from('lesson_visuals').select('svgs').eq('lesson_id', key).maybeSingle();
      if (cached?.svgs && Array.isArray(cached.svgs) && cached.svgs.length > 0) {
        setLessonVisuals(cached.svgs as string[]);
        setVisualsLoading(false);
        return;
      }
    } catch { }
    try {
      // Generate from the LOCALIZED lesson (title/description in the selected language)
      // and tell the generator which language to label the diagram in.
      const res = await supabase.functions.invoke('generate-visuals', {
        body: { lessonTitle: getTitle(lesson), lessonDescription: getDescription(lesson), courseTitle, language }
      });
      console.log('[visuals] response:', JSON.stringify({ invokeError: res.error?.message, funcError: res.data?.error, svgsCount: res.data?.svgs?.length ?? 0 }));
      if (res.error) console.error('[visuals] invoke error:', res.error);
      if (res.data?.error) console.error('[visuals] function returned error:', res.data.error);
      if (res.data?.svgs?.length > 0) {
        setLessonVisuals(res.data.svgs);
        supabase.from('lesson_visuals').upsert({ lesson_id: key, svgs: res.data.svgs }).then(() => { });
      }
    } catch (e) { console.error('[visuals] exception:', e); }
    setVisualsLoading(false);
  };

  useEffect(() => {
    if (currentLesson && course) loadVisuals(currentLesson, course.title);
  }, [currentLesson?.id, course?.id, language]);

  // Auto-reset Prof. Didier when student clicks a different lesson
  const activeLessonIdRef = useRef<string>('');
  useEffect(() => {
    if (!currentLesson) return;
    const newId = String((currentLesson as any).id || (currentLesson as any).video_id || '');
    if (!newId) return;
    if (activeLessonIdRef.current && activeLessonIdRef.current !== newId) {
      // Lesson changed — end any active session silently
      conversation.endSession().catch(() => { });
      if (timerRef.current) clearInterval(timerRef.current);
      setConvStatus('idle');
      setTranscript([]);
      setRecapComplete(false);
      setDuration(0);
    }
    activeLessonIdRef.current = newId;
  }, [currentLesson, conversation]);



  const loadData = async () => {
    if (!chapterId || !courseId) return;
    setLoading(true);
    try {
      // Integrity guard (runs BEFORE any lesson/quiz/progress load): never render
      // an unpublished / deprecated course's chapter via a direct or bookmarked
      // URL. Known old course ids resolve to the published flagship; any other
      // unpublished course sends a student back to the catalogue. Founders may
      // still inspect historical rows.
      const mapped = DEPRECATED_COURSE_REDIRECTS[courseId];
      if (mapped && mapped !== courseId) {
        navigate(`/portal/course/${mapped}`, { replace: true });
        return;
      }
      const { data: { user: guardUser } } = await supabase.auth.getUser();
      if (!(guardUser && isFounderEmail(guardUser.email))) {
        const { data: pub } = await supabase.from('courses').select('is_published').eq('id', courseId).maybeSingle();
        if (pub && pub.is_published === false) {
          navigate(DEPRECATED_COURSE_REDIRECTS[courseId] ? `/portal/course/${DEPRECATED_COURSE_REDIRECTS[courseId]}` : '/portal/courses', { replace: true });
          return;
        }
      }
      // Fetch each query individually with retry to avoid abort errors
      const fetchWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
        for (let i = 0; i < retries; i++) {
          try {
            const result = await fn();
            if (!result.error) return result;
            if (i < retries - 1) await new Promise(r => setTimeout(r, 500 * (i + 1)));
          } catch (e) {
            if (i < retries - 1) await new Promise(r => setTimeout(r, 500 * (i + 1)));
            else throw e;
          }
        }
        return { data: null, error: new Error('Max retries reached') };
      };

      const [{ data: courseData }, { data: chapterData }, { data: allChaptersData }, { data: videosData }, { data: quizzesData }, { data: progressData }] = await Promise.all([
        fetchWithRetry(() => supabase.from('courses').select('id, title, translations, curriculum_version').eq('id', courseId).single()),
        fetchWithRetry(() => supabase.from('chapters').select('id, title, description, order_index, course_id, translations').eq('id', chapterId).single()),
        fetchWithRetry(() => supabase.from('chapters').select('id, title, order_index, translations').eq('course_id', courseId).order('order_index')),
        fetchWithRetry(() => supabase.from('videos').select('id, title, description, chapter_id, order_index, video_url, translations').eq('chapter_id', chapterId).order('order_index')),
        fetchWithRetry(() => supabase.from('quizzes').select('*').eq('chapter_id', chapterId)),
        fetchWithRetry(() => supabase.from('user_progress').select('quiz_id').not('quiz_id', 'is', null)),
      ]);
      // Check free tier access
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Founder God Mode bypass — full access to any course/module regardless of tier
        if (isFounderEmail(user.email) && founderModeOn()) {
          setIsStarter(false);
          // skip all tier checks
        } else {
          const { data: profile } = await supabase.from('profiles').select('tier, free_course_id').eq('user_id', user.id).maybeSingle();
          if (profile?.tier === 'starter') {
            setIsStarter(true);
            const freeCourseId = profile.free_course_id;
            if (!freeCourseId) {
              // Fail-closed: a starter who hasn't chosen their free program must pick one.
              // Redirect to /portal, where the course-selection gate now fires. (Previously
              // a NULL free_course_id fell through and opened every program's Module 1.)
              navigate('/portal');
              return;
            }
            if (courseId !== freeCourseId) {
              const { data: fc } = await supabase.from('courses').select('title').eq('id', freeCourseId).maybeSingle();
              setFreeCourseName(fc?.title || '');
              setPaywallReason('wrong_course');
              setLoading(false);
              return;
            }
            if (chapterData && chapterData.order_index > 0) {
              setPaywallReason('module_locked');
              setLoading(false);
              return;
            }
          }
        } // end non-admin block
      }
      setCourse(courseData);
      setChapter(chapterData);
      setAllChapters((allChaptersData || []) as Chapter[]);
      setVideos((videosData || []) as Video[]);
      setQuizzes(quizzesData || []);
      setPassedQuizzes((progressData || []).map((p: any) => p.quiz_id));
      if (videosData && videosData.length > 0) setCurrentLesson(videosData[0] as Video);
    } catch (e: any) {
      toast({ title: t('lesson.err_load'), description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getTranscript = (v: Video | null): string => {
    if (!v) return '';
    const trans = v.translations as any;
    if (!trans) return '';
    const langMap: Record<string, string> = { en: 'en', fr: 'fr', es: 'es', de: 'de', zh: 'zh', ar: 'ar', ja: 'ja' };
    const key = langMap[language] || 'en';
    return trans[key]?.transcript || trans['en']?.transcript || '';
  };

  const getTitle = (item: any) => {
    if (!item) return '';
    const tFunc = item.translations?.[language];
    return tFunc?.title || item.title || '';
  };

  // Translated lesson body: prefer translations[lang].description, fall back to
  // the English description. Mirrors getTranscript's fallback chain so the lesson
  // reading renders in the selected language once the translations JSONB is populated.
  const getDescription = (item: any) => {
    if (!item) return '';
    const tr = item.translations?.[language];
    return tr?.description || item.translations?.['en']?.description || item.description || '';
  };

  const progress = videos.length > 0
    ? Math.round((passedQuizzes.filter(id => quizzes.some(q => q.id === id)).length / videos.length) * 100)
    : 0;

  const mainPoints: string[] = [];

  // ── Spec A: app-owned ordered step list for this module ──────────────────────
  // Lesson steps come from videos (ordered by order_index); the single chapter_end
  // quiz is appended as the final step. mini_video quizzes are ignored for launch;
  // the chapter_end is matched once (any duplicate quiz rows de-dupe to the first).
  const steps = useMemo<Step[]>(() => {
    const lessonSteps: Step[] = [...videos]
      .sort((a, b) => a.order_index - b.order_index)
      .map(v => ({ type: 'lesson', video: v }));
    const chapterEndQuiz = quizzes.find(q => q.quiz_type === 'chapter_end');
    return chapterEndQuiz ? [...lessonSteps, { type: 'quiz', quizId: chapterEndQuiz.id }] : lessonSteps;
  }, [videos, quizzes]);

  const currentStepIndex = useMemo(() => {
    if (activeQuizId) return steps.findIndex(s => s.type === 'quiz' && s.quizId === activeQuizId);
    if (currentLesson) return steps.findIndex(s => s.type === 'lesson' && s.video.id === currentLesson.id);
    return -1;
  }, [steps, currentLesson, activeQuizId]);

  const nextStep = currentStepIndex >= 0 ? steps[currentStepIndex + 1] : undefined;
  const continueIsToQuiz = nextStep?.type === 'quiz';

  // Always-enabled Continue: advance to the next lesson in the module, or open the
  // chapter_end quiz after the last lesson. Independent of the voice agent.
  const handleContinue = () => {
    if (!nextStep) return;
    if (nextStep.type === 'lesson') setCurrentLesson(nextStep.video);
    else setActiveQuizId(nextStep.quizId);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f1e,#0d1b3e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#60a5fa' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #1e40af', borderTop: '3px solid #60a5fa', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: 14, color: '#475569' }}>{t('chapter.loading')}</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1b3e 50%,#0a0f1e 100%)', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Starter Paywall Overlay */}
      {paywallReason && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backdropFilter: 'blur(8px)', background: 'rgba(10,15,30,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg,#0d1b3e,#0a0f1e)', border: '2px solid rgba(245,158,11,0.5)', borderRadius: '24px', padding: '40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '52px', marginBottom: '12px' }}>🎓</div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{t('paywall.completed_title')}</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: 1.6 }}>
              Solo Excelencia. {t('paywall.completed_l1')}<br />{t('paywall.completed_l2')}
            </p>
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <p style={{ fontSize: '34px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>$99.99<span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{t('paywall.per_month')}</span></p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{t('paywall.features')}</p>
            </div>
            <button
              onClick={async () => {
                const { data: { user: u } } = await supabase.auth.getUser();
                if (!u) return;
                setCheckoutError(false);
                localStorage.setItem(`starter-course-done-${u.id}`, 'true');
                await supabase.from('profiles').update({ free_course_completed: true }).eq('user_id', u.id);
                try {
                  const res = await fetch('/api/create-checkout', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TW7U21wgazWak4Atj7TblB3',
                      email: u.email, tier: 't2', userId: u.id,
                      successUrl: `${window.location.origin}/portal?payment=success`,
                      cancelUrl: `${window.location.origin}/portal`
                    })
                  });
                  const d = await res.json().catch(() => ({}));
                  // Only proceed to Stripe on a real Checkout URL. Never silently route to
                  // /portal on failure — that masked checkout errors as a "success" landing.
                  if (res.ok && d.url) { window.location.href = d.url; return; }
                  console.error('create-checkout failed:', d?.error || res.status);
                  setCheckoutError(true);
                } catch (e) {
                  console.error('create-checkout error:', e);
                  setCheckoutError(true);
                }
              }}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', color: '#000', fontSize: '16px', fontWeight: 800, cursor: 'pointer', marginBottom: '12px' }}
            >
              {t('paywall.unlock_cta')}
            </button>
            {checkoutError && (
              <p style={{ fontSize: '12px', color: '#fca5a5', marginBottom: '10px' }}>
                Checkout is temporarily unavailable. Please try again in a moment.
              </p>
            )}
            <button onClick={() => navigate('/portal')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '12px', cursor: 'pointer' }}>
              {t('paywall.go_back')}
            </button>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '12px' }}>🔒 {t('paywall.secure')}</p>
          </div>
        </div>
      )}

      {/* Phone (< 768px): immersive single-column lesson player. */}
      {isPhone && currentLesson && (
        <MobileLessonPlayer
          course={course} chapter={chapter} currentLesson={currentLesson} videos={videos} quizzes={quizzes}
          progress={progress} continueIsToQuiz={continueIsToQuiz}
          isLive={isLive} isSpeaking={isSpeaking} convStatus={convStatus} transcript={transcript} duration={duration}
          fmt={fmt} getTitle={getTitle} getDescription={getDescription} getTranscript={getTranscript}
          onSelectLesson={setCurrentLesson} onOpenQuiz={(id) => setActiveQuizId(id)} onContinue={handleContinue}
          onStart={startSession} onEnd={endSession} onBack={() => navigate(`/portal/course/${courseId}`)}
        />
      )}

      {/* Desktop / tablet (>= 768px): unchanged two-column layout. */}
      {!isPhone && (<>
      {/* Top Nav */}
      <div style={{ borderBottom: '1px solid rgba(96,165,250,0.12)', background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(12px)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate('/courses')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={16} />{t('chapter.back')}
        </button>

        {allChapters.length > 1 && (() => {
          const idx = allChapters.findIndex(c => c.id === chapter?.id);
          const prev = idx > 0 ? allChapters[idx - 1] : null;
          const next = idx < allChapters.length - 1 ? allChapters[idx + 1] : null;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <button onClick={() => prev && navigate(`/course/${courseId}/chapter/${prev.id}`)} disabled={!prev} title={prev ? getTitle(prev) : ''}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(96,165,250,0.2)', background: prev ? 'rgba(30,64,175,0.15)' : 'rgba(15,23,42,0.3)', cursor: prev ? 'pointer' : 'not-allowed', color: prev ? '#60a5fa' : '#334155' }}>
                <ChevronLeft size={18} />
              </button>
              <div style={{ textAlign: 'center', minWidth: 140, maxWidth: 240 }}>
                <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{idx + 1} / {allChapters.length}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getTitle(chapter)}</div>
              </div>
              <button onClick={() => { if (!next) return; if (isStarter) { setPaywallReason('module_locked'); return; } navigate(`/course/${courseId}/chapter/${next.id}`); }} disabled={!next} title={next ? getTitle(next) : ''}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(96,165,250,0.2)', background: next ? 'rgba(30,64,175,0.15)' : 'rgba(15,23,42,0.3)', cursor: next ? 'pointer' : 'not-allowed', color: next ? '#60a5fa' : '#334155' }}>
                <ChevronRight size={18} />
              </button>
            </div>
          );
        })()}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PortalLangWidget />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: progress === 100 ? '#22c55e' : '#3b82f6' }} />
            <span style={{ fontSize: 12, color: '#64748b' }}>{progress}% complete</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 0, height: 'calc(100vh - 56px)' }}>

        {/* LEFT — Lesson Content + Prof. Didier */}
        <div style={{ overflowY: 'auto', padding: '32px 40px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: '#475569' }}>{getTitle(course)}</span>
            <span style={{ fontSize: 12, color: '#334155' }}>›</span>
            <span style={{ fontSize: 12, color: '#60a5fa' }}>{getTitle(chapter)}</span>
          </div>

          {/* Lesson Title */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} key={currentLesson?.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <BookOpen size={18} color="#3b82f6" />
              <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('chapter.lesson')} {(currentLesson?.order_index ?? 0) + 1}</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', margin: '0 0 24px', lineHeight: 1.3 }}>
              {getTitle(currentLesson)}
            </h1>

            {/* Key Points */}
            {mainPoints.length > 0 && (
              <div style={{ background: 'rgba(30,64,175,0.08)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 16, padding: '24px 28px', marginBottom: 32 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={14} /> {t('lesson.key_points')}
                </h3>
                <ol style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {mainPoints.map((pt: string, i: number) => (
                    <li key={i} style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.6 }}>{pt}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Description (translated body) */}
            {getDescription(currentLesson) && (
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>{getDescription(currentLesson)}</p>
            )}

            {/* AVIS™ Hero Visual — shown before transcript when an asset is mapped */}
            {(() => {
              if (!course?.curriculum_version || !chapter) return null;
              const avisAsset = getAvisAsset(
                course.curriculum_version,
                chapter.order_index,
                currentLesson?.order_index
              );
              if (!avisAsset) return null;
              return (
                <AvisHeroVisual
                  asset={avisAsset}
                  lessonTitle={getTitle(currentLesson)}
                  moduleTitle={getLocalizedField(chapter, language, 'title')}
                />
              );
            })()}

            {/* ── CHAPTER CONTENT — textbook layout ── */}
            {getTranscript(currentLesson) && (() => {
              const raw = getTranscript(currentLesson);
              const lines = raw.split('\n');

              type BlockKind =
                | { kind: 'section'; text: string }
                | { kind: 'paragraph'; text: string }
                | { kind: 'bullets'; items: string[] }
                | { kind: 'numbered'; items: string[] }
                | { kind: 'callout'; variant: 'ai' | 'example' | 'principle'; lines: string[] };
              const blocks: BlockKind[] = [];
              let li = 0;
              while (li < lines.length) {
                const line = lines[li].trim();
                if (!line) { li++; continue; }
                const isAllCaps = line.length > 3 && line === line.toUpperCase() && /[A-Z]/.test(line);
                const isAICallout = isAllCaps && /^AI (IN|FOR|APPLICATION|AMPLIFIED|TOOLS|AUGMENT|SCRUM MASTER)/.test(line);
                const isPrincipleCallout = /^(PRINCIPLE:|KEY CONCEPT|THE EMPIRICAL SCRUM MASTER)/.test(line);
                const isExampleCallout = /^(EXAMPLE|WHY SCRUM FAILS|THE FAILURE OF|TRUST:|HOW VALUES)/.test(line);
                if (isAICallout || isPrincipleCallout || isExampleCallout) {
                  const body: string[] = [line]; li++;
                  while (li < lines.length && lines[li].trim() && !(lines[li].trim() === lines[li].trim().toUpperCase() && lines[li].trim().length > 3 && /[A-Z]/.test(lines[li].trim()) && !lines[li].trim().startsWith('-'))) {
                    body.push(lines[li].trim()); li++;
                  }
                  blocks.push({ kind: 'callout', variant: isAICallout ? 'ai' : isPrincipleCallout ? 'principle' : 'example', lines: body });
                } else if (line.startsWith('- ')) {
                  const items: string[] = [line.slice(2)]; li++;
                  while (li < lines.length && lines[li].trim().startsWith('- ')) { items.push(lines[li].trim().slice(2)); li++; }
                  blocks.push({ kind: 'bullets', items });
                } else if (/^\d+\.\s/.test(line)) {
                  const items: string[] = [line.replace(/^\d+\.\s/, '')]; li++;
                  while (li < lines.length && /^\d+\.\s/.test(lines[li].trim())) { items.push(lines[li].trim().replace(/^\d+\.\s/, '')); li++; }
                  blocks.push({ kind: 'numbered', items });
                } else if (isAllCaps && line.length < 90) {
                  blocks.push({ kind: 'section', text: line }); li++;
                } else {
                  blocks.push({ kind: 'paragraph', text: line }); li++;
                }
              }

              const calloutStyle = {
                ai: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.28)', label: '#f59e0b', icon: '🤖' },
                principle: { bg: 'rgba(59,130,246,0.07)', border: 'rgba(59,130,246,0.28)', label: '#60a5fa', icon: '💡' },
                example: { bg: 'rgba(34,197,138,0.06)', border: 'rgba(34,197,138,0.28)', label: '#22c98a', icon: '📌' },
              };

              return (
                <div style={{ marginBottom: 32 }}>
                  {language !== 'en' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 14px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8 }}>
                      <span style={{ fontSize: 18 }}>🌐</span>
                      <span style={{ fontSize: 12, color: '#60a5fa' }}>{t('chapter.transcript_notice')}</span>
                    </div>
                  )}
                  {blocks.map((block, idx) => {
                    if (block.kind === 'section') return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: idx === 0 ? '0 0 20px' : '40px 0 16px' }}>
                        <div style={{ width: 4, height: 30, background: 'linear-gradient(180deg,#3b82f6,#8b5cf6)', borderRadius: 2, flexShrink: 0 }} />
                        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#e2e8f0', margin: 0, letterSpacing: '0.01em' }}>{block.text}</h2>
                      </div>
                    );
                    if (block.kind === 'paragraph') return (
                      <p key={idx} style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.85, margin: '0 0 16px', paddingLeft: 16 }}>{block.text}</p>
                    );
                    if (block.kind === 'bullets') return (
                      <ul key={idx} style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 16 }}>
                        {block.items.map((item, j) => (
                          <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 9 }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                    if (block.kind === 'numbered') return (
                      <ol key={idx} style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 16 }}>
                        {block.items.map((item, j) => (
                          <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 15, color: '#94a3b8', lineHeight: 1.75 }}>
                            <span style={{ minWidth: 28, height: 28, borderRadius: '50%', background: 'rgba(59,130,246,0.14)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{j + 1}</span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    );
                    if (block.kind === 'callout') {
                      const cs = calloutStyle[block.variant];
                      return (
                        <div key={idx} style={{ background: cs.bg, border: `1px solid ${cs.border}`, borderRadius: 14, padding: '18px 20px', margin: '4px 0 24px', display: 'flex', gap: 14 }}>
                          <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{cs.icon}</span>
                          <div style={{ flex: 1 }}>
                            {block.lines[0] && <div style={{ fontSize: 11, fontWeight: 800, color: cs.label, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 10 }}>{block.lines[0]}</div>}
                            {block.lines.slice(1).map((ln, j) =>
                              ln.startsWith('- ')
                                ? <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 7, fontSize: 14, color: '#94a3b8', lineHeight: 1.65 }}><span style={{ color: cs.label, flexShrink: 0 }}>•</span>{ln.slice(2)}</div>
                                : <p key={j} style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 8px' }}>{ln}</p>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                  <p style={{ fontSize: 11, color: '#334155', textAlign: 'right', marginTop: 8 }}>
                    {t('chapter.read_along')}
                  </p>
                </div>
              );
            })()}
          </motion.div>

          {/* Visual Diagrams — only renders when loading or when SVGs are ready */}
          {(visualsLoading || lessonVisuals.length > 0) && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 3, height: 18, borderRadius: 2, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>{t('chapter.visual_breakdown')}</span>
              </div>
              {visualsLoading && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: 14, padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ width: 18, height: 18, border: '2px solid #1e40af', borderTop: '2px solid #60a5fa', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: 13, color: '#475569' }}>{t('chapter.generating_visuals')}</span>
                </div>
              )}
              {lessonVisuals.map((svg, i) => (
                <div key={i} style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
                  <div style={{ background: '#f8fafc', padding: '6px 14px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>{t('chapter.diagram')} {i + 1}</span>
                  </div>
                  <div style={{ background: '#fff', padding: '12px', display: 'flex', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: svg }} />
                </div>
              ))}
            </div>
          )}

          {/* ── Prof. Didier Embedded Panel ── */}
          <div style={{ background: 'linear-gradient(160deg,#0f172a,#0d1b3e)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 20, overflow: 'hidden', marginBottom: 32 }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid rgba(96,165,250,0.1)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: '#fff', flexShrink: 0, position: 'relative' }}>
                D
                {isLive && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid #0f172a' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Prof. Didier</div>
                <div style={{ fontSize: 12, color: '#475569' }}>{t('chapter.instructor_subtitle')}</div>
              </div>
              {isLive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bars active={isSpeaking} />
                  <span style={{ fontSize: 13, color: '#60a5fa', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fmt(duration)}</span>
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(96,165,250,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: isLive ? '#22c55e' : convStatus === 'connecting' ? '#f59e0b' : '#334155', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {isLive ? (isSpeaking ? '🎙 ' + t('chapter.speaking') : '👂 ' + t('chapter.listening')) :
                  convStatus === 'connecting' ? t('chapter.connecting') :
                    convStatus === 'error' ? t('chapter.connection_failed') :
                      t('chapter.ready') + ' ' + getTitle(currentLesson)}
              </span>
            </div>

            {/* Transcript */}
            {transcript.length > 0 && (
              <div ref={transcriptRef} style={{ maxHeight: 280, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {transcript.map((e, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: e.role === 'agent' ? 'flex-start' : 'flex-end' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: e.role === 'agent' ? '#60a5fa' : '#64748b', marginBottom: 4 }}>
                      {e.role === 'agent' ? 'Prof. Didier' : t('chapter.you')}
                    </span>
                    <div style={{ background: e.role === 'agent' ? 'rgba(30,64,175,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${e.role === 'agent' ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '10px 14px', maxWidth: '85%' }}>
                      <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 }}>{e.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Start/End Button */}
            <div style={{ padding: '16px 24px' }}>
              {!isLive && convStatus !== 'connecting' ? (
                <button onClick={startSession} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <MessageCircle size={16} /> {t('chapter.start')}
                </button>
              ) : convStatus === 'connecting' ? (
                <button disabled style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: 'rgba(96,165,250,0.1)', color: '#60a5fa', fontSize: 15, fontWeight: 600, cursor: 'not-allowed' }}>
                  {t('chapter.connecting')}
                </button>
              ) : (
                <button onClick={endSession} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  {t('chapter.end_session')}
                </button>
              )}
            </div>


          </div>

          {/* Course Study Guide — sits between the AI mentor and the Continue button */}
          {course && videos.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <button onClick={() => setShowStudyGuide(v => !v)} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: `1px solid ${showStudyGuide ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.3)'}`, background: showStudyGuide ? 'rgba(212,175,55,0.14)' : 'rgba(212,175,55,0.06)', color: '#d4af37', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                📖 {showStudyGuide ? t('chapter.close_study_guide') : t('chapter.course_study_guide')}
              </button>
              {showStudyGuide && (
                <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#d4af37' }}>📚 {getLocalizedField(course, language, 'title')} — {t('chapter.study_guide')}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{t('chapter.read_only')}</span>
                  </div>
                  <div style={{ height: 520, overflowY: 'auto', background: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', padding: '40px 52px', color: '#1e293b' }}>
                    <div style={{ borderBottom: '3px solid #f59e0b', marginBottom: 36, paddingBottom: 24 }}>
                      <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' as const, fontFamily: 'system-ui, sans-serif', display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <span>ALADIAH ACADEMY</span>
                        <span style={{ textAlign: 'right', maxWidth: '50%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getLocalizedField(course, language, 'title').toUpperCase()}</span>
                      </div>
                      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0a0f1e', margin: '0 0 10px', lineHeight: 1.25, fontFamily: 'Georgia, serif' }}>
                        {getTitle(chapter)}
                      </h1>
                      <p style={{ fontSize: 13, color: '#64748b', margin: 0, fontFamily: 'system-ui, sans-serif', letterSpacing: '0.02em' }}>
                        Module Study Guide &nbsp;·&nbsp; {videos.length} Lesson{videos.length !== 1 ? 's' : ''} &nbsp;·&nbsp; Solo Excelencia™
                      </p>
                    </div>
                    {videos.map((video, idx) => {
                      const lessonTranscript = getTranscript(video);
                      const lessonDesc = getDescription(video);
                      const lessonTitle = getTitle(video);
                      return (
                        <div key={video.id} style={{ marginBottom: 52, paddingBottom: 52, borderBottom: idx < videos.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          <div style={{ marginBottom: 18 }}>
                            <span style={{ fontSize: 10, letterSpacing: '0.18em', color: '#f59e0b', textTransform: 'uppercase' as const, fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}>
                              LESSON {idx + 1}
                            </span>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0a0f1e', margin: '4px 0 12px', lineHeight: 1.3, fontFamily: 'Georgia, serif' }}>
                              {lessonTitle}
                            </h2>
                            {lessonDesc && (
                              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, margin: '0 0 0', fontStyle: 'italic', borderLeft: '3px solid #f59e0b', paddingLeft: 14, fontFamily: 'Georgia, serif' }}>
                                {lessonDesc}
                              </p>
                            )}
                          </div>
                          {lessonTranscript ? (
                            <div style={{ fontSize: 14, lineHeight: 1.85, color: '#1e293b', fontFamily: 'Georgia, serif' }}>
                              {lessonTranscript.split('\n').map((line, i) => {
                                const trimmed = line.trim();
                                if (!trimmed) return <div key={i} style={{ height: 10 }} />;
                                if (trimmed.length >= 4 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed) && !/\d{4}/.test(trimmed)) {
                                  return (
                                    <h3 key={i} style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: '#0a0f1e', textTransform: 'uppercase' as const, margin: '28px 0 10px', fontFamily: 'system-ui, sans-serif', borderBottom: '1px solid #f1f5f9', paddingBottom: 5 }}>
                                      {trimmed}
                                    </h3>
                                  );
                                }
                                if (/^[-•–]\s/.test(trimmed)) {
                                  return (
                                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, paddingLeft: 4 }}>
                                      <span style={{ color: '#f59e0b', flexShrink: 0, lineHeight: 1.85, fontWeight: 700 }}>•</span>
                                      <span>{trimmed.replace(/^[-•–]\s*/, '')}</span>
                                    </div>
                                  );
                                }
                                if (/^\d+[.)]\s/.test(trimmed)) {
                                  return (
                                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, paddingLeft: 4 }}>
                                      <span style={{ color: '#f59e0b', flexShrink: 0, lineHeight: 1.85, fontWeight: 700, minWidth: 20 }}>{trimmed.match(/^\d+/)?.[0]}.</span>
                                      <span>{trimmed.replace(/^\d+[.)]\s*/, '')}</span>
                                    </div>
                                  );
                                }
                                if (line.startsWith('  ') || line.startsWith('\t')) {
                                  return (
                                    <div key={i} style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: '2px 8px', margin: '3px 0', color: '#334155', whiteSpace: 'pre-wrap' as const }}>
                                      {trimmed}
                                    </div>
                                  );
                                }
                                return <p key={i} style={{ margin: '0 0 10px' }}>{trimmed}</p>;
                              })}
                            </div>
                          ) : (
                            <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', fontFamily: 'system-ui, sans-serif' }}>
                              Content for this lesson is being prepared.
                            </p>
                          )}
                        </div>
                      );
                    })}
                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '3px solid #f59e0b', textAlign: 'center' }}>
                      <p style={{ fontSize: 11, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                        Aladiah Academy &nbsp;·&nbsp; Solo Excelencia™
                      </p>
                    </div>
                  </div>
                  <div style={{ padding: '6px 14px', borderTop: '1px solid rgba(212,175,55,0.1)', textAlign: 'center' }}>
                    <span style={{ fontSize: 11, color: '#475569' }}>Aladiah Academy · Solo Excelencia™</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Spec A: app-owned lesson progression — independent of the voice agent.
              Lesson → Continue → next lesson; after the last lesson → chapter_end quiz. */}
          {currentLesson && (
            <div style={{ marginBottom: 32 }}>
              {recapComplete && (
                <div style={{ textAlign: 'center', marginBottom: 10, fontSize: 13, fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <CheckCircle size={15} /> {t('chapter.recap_complete')}
                </div>
              )}
              <button onClick={handleContinue} style={{ width: '100%', padding: '16px 0', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0a0f1e', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {continueIsToQuiz ? t('chapter.continue_quiz') : t('chapter.continue_lesson')}
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — Lesson List Sidebar */}
        <div style={{ borderLeft: '1px solid rgba(96,165,250,0.1)', background: 'rgba(10,15,30,0.6)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Module Header */}
          <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(96,165,250,0.08)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{getTitle(chapter)}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(96,165,250,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#1d4ed8,#3b82f6)', width: `${progress}%`, transition: 'width 0.4s ease', borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 11, color: '#475569', whiteSpace: 'nowrap' }}>{progress}%</span>
            </div>
          </div>

          {/* Lesson List */}
          <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            {videos.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#334155' }}>
                <BookOpen size={24} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p style={{ fontSize: 13, margin: 0 }}>{t('chapter.no_lessons')}</p>
              </div>
            ) : videos.map((video, idx) => {
              const isCurrent = currentLesson?.id === video.id;
              const isPassed = passedQuizzes.some(id => quizzes.find(q => q.id === id && q.chapter_id === chapterId));
              return (
                <button
                  key={video.id}
                  onClick={() => setCurrentLesson(video)}
                  style={{ width: '100%', textAlign: 'left', background: isCurrent ? 'rgba(30,64,175,0.2)' : 'transparent', border: `1px solid ${isCurrent ? 'rgba(96,165,250,0.3)' : 'transparent'}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={e => { if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: isCurrent ? 'linear-gradient(135deg,#1d4ed8,#3b82f6)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isPassed ? <CheckCircle size={13} color="#22c55e" /> : isCurrent ? <Play size={12} color="#fff" fill="#fff" /> : <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{idx + 1}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: isCurrent ? 600 : 400, color: isCurrent ? '#f1f5f9' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {getTitle(video)}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#334155' }}>{t('chapter.lesson')} {idx + 1}</p>
                  </div>
                  {isCurrent && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />}
                </button>
              );
            })}

            {/* Final Quiz Entry */}
            {quizzes.length > 0 && (
              <button
                onClick={() => setActiveQuizId(quizzes[0].id)}
                style={{ marginTop: 8, padding: '12px 14px', background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, width: '100%', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Trophy size={13} color="#f59e0b" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>{t('chapter.quiz.title')}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#92400e' }}>{t('chapter.quiz.ready')}</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
      </>)}
      {/* Quiz Modal */}
      {activeQuizId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto', padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>{t('chapter.quiz.title')}</h2>
              <button onClick={() => setActiveQuizId(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 24, lineHeight: 1 }}>×</button>
            </div>
            <Quiz quizId={activeQuizId} quizType="chapter_end" onComplete={async (passed) => {
              setActiveQuizId(null);
              if (!passed) return;
              // Check tier and decide what happens after passing
              const { data: { user: u } } = await supabase.auth.getUser();
              if (!u) return;
              const { data: profile } = await supabase.from('profiles').select('tier').eq('user_id', u.id).maybeSingle();
              const isStarter = profile?.tier === 'starter';
              if (isStarter) {
                // Free tier — Module 1 completes HERE (passing the chapter_end quiz),
                // not via the voice agent. Migrated from the old voice-completion block:
                // completion flag, profiles.free_course_completed, and completion email.
                localStorage.setItem(`starter-course-done-${u.id}`, 'true');
                supabase.from('profiles').update({ free_course_completed: true }).eq('user_id', u.id).then(() => { });
                supabase.from('profiles').select('preferred_language, full_name').eq('user_id', u.id).maybeSingle().then(({ data: prof }) => {
                  fetch('https://vgujnkxylipfwmkpwzvb.supabase.co/functions/v1/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'free_course_completed',
                      student: { name: prof?.full_name || 'Student', email: u.email, course: course?.title, language: prof?.preferred_language || 'en' },
                    }),
                  }).catch(() => { });
                });
                setPaywallReason('module_locked');
              } else {
                // Paid tier — advance to next module
                const currentIdx = allChapters.findIndex(c => c.id === chapterId);
                const nextChapter = allChapters[currentIdx + 1];
                if (nextChapter) {
                  navigate(`/course/${courseId}/chapter/${nextChapter.id}`);
                } else {
                  navigate(`/portal`);
                }
              }
            }} onBack={() => setActiveQuizId(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
