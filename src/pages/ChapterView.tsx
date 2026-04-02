import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConversation } from '@elevenlabs/react';
import { ArrowLeft, CheckCircle, Lock, Play, BookOpen, MessageCircle, Trophy } from 'lucide-react';

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string;

interface Course { id: string; title: string; translations: any; }
interface Chapter { id: string; title: string; description: string; order_index: number; course_id: string; translations: any; }
interface Video { id: string; title: string; description: string; chapter_id: string; order_index: number; video_url: string; translations: any; lesson_script: any; }
interface Quiz { id: string; chapter_id: string; quiz_type: string; }

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
  const { language } = useLanguage();

  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Video | null>(null);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Prof. Didier conversation state
  const [convStatus, setConvStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<{ role: 'user' | 'agent'; message: string }[]>([]);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const isLive = convStatus === 'connected';

  const conversation = useConversation({
    onConnect: () => {
      setConvStatus('connected');
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    },
    onDisconnect: () => {
      setConvStatus('idle');
      if (timerRef.current) clearInterval(timerRef.current);
    },
    onMessage: ({ message, source }: { message: string; source: string }) => {
      setTranscript(p => [...p, { role: source === 'ai' ? 'agent' : 'user', message }]);
    },
    onError: () => setConvStatus('error'),
  });

  useEffect(() => { setIsSpeaking(conversation.isSpeaking); }, [conversation.isSpeaking]);
  useEffect(() => { transcriptRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }); }, [transcript]);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const startSession = useCallback(async () => {
    if (!currentLesson) return;
    setConvStatus('connecting');
    setTranscript([]);
    setDuration(0);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId: AGENT_ID });
    } catch {
      setConvStatus('error');
    }
  }, [conversation, currentLesson, chapter, language]);

  const endSession = useCallback(async () => {
    await conversation.endSession();
    if (timerRef.current) clearInterval(timerRef.current);
  }, [conversation]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => { loadData(); }, [chapterId]);

  const loadData = async () => {
    if (!chapterId || !courseId) return;
    setLoading(true);
    try {
      const [{ data: courseData }, { data: chapterData }, { data: videosData }, { data: quizzesData }, { data: progressData }] = await Promise.all([
        supabase.from('courses').select('id, title, translations').eq('id', courseId).single(),
        supabase.from('chapters').select('id, title, description, order_index, course_id, translations').eq('id', chapterId).single(),
        supabase.from('videos').select('id, title, description, chapter_id, order_index, video_url, translations, lesson_script').eq('chapter_id', chapterId).order('order_index'),
        supabase.from('quizzes').select('*').eq('chapter_id', chapterId),
        supabase.from('user_progress').select('quiz_id').not('quiz_id', 'is', null),
      ]);
      setCourse(courseData);
      setChapter(chapterData);
      setVideos((videosData || []) as Video[]);
      setQuizzes(quizzesData || []);
      setPassedQuizzes((progressData || []).map((p: any) => p.quiz_id));
      if (videosData && videosData.length > 0) setCurrentLesson(videosData[0] as Video);
    } catch (e: any) {
      toast({ title: 'Error loading lesson', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (item: any) => {
    if (!item) return '';
    const t = item.translations?.[language];
    return t?.title || item.title || '';
  };

  const progress = videos.length > 0
    ? Math.round((passedQuizzes.filter(id => quizzes.some(q => q.id === id)).length / videos.length) * 100)
    : 0;

  const mainPoints: string[] = currentLesson?.lesson_script?.mainPoints || [];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f1e,#0d1b3e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#60a5fa' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #1e40af', borderTop: '3px solid #60a5fa', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: 14, color: '#475569' }}>Loading lesson...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f1e 0%,#0d1b3e 50%,#0a0f1e 100%)', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Top Nav */}
      <div style={{ borderBottom: '1px solid rgba(96,165,250,0.12)', background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(12px)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate('/courses')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Courses
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: progress === 100 ? '#22c55e' : '#3b82f6' }} />
          <span style={{ fontSize: 12, color: '#64748b' }}>{progress}% complete</span>
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
              <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Lesson {(currentLesson?.order_index ?? 0) + 1}</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', margin: '0 0 24px', lineHeight: 1.3 }}>
              {getTitle(currentLesson)}
            </h1>

            {/* Key Points */}
            {mainPoints.length > 0 && (
              <div style={{ background: 'rgba(30,64,175,0.08)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 16, padding: '24px 28px', marginBottom: 32 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={14} /> Key Learning Points
                </h3>
                <ol style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {mainPoints.map((pt: string, i: number) => (
                    <li key={i} style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.6 }}>{pt}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Description */}
            {currentLesson?.description && (
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 32 }}>{currentLesson.description}</p>
            )}
          </motion.div>

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
                <div style={{ fontSize: 12, color: '#475569' }}>Your AI Instructor — Aladiah Academy</div>
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
                {isLive ? (isSpeaking ? '🎙 Prof. Didier is speaking...' : '👂 Listening to you...') :
                  convStatus === 'connecting' ? 'Connecting to Prof. Didier...' :
                  convStatus === 'error' ? 'Connection failed — try again' :
                  `Ready to teach: ${getTitle(currentLesson)}`}
              </span>
            </div>

            {/* Transcript */}
            {transcript.length > 0 && (
              <div ref={transcriptRef} style={{ maxHeight: 280, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {transcript.map((e, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: e.role === 'agent' ? 'flex-start' : 'flex-end' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: e.role === 'agent' ? '#60a5fa' : '#64748b', marginBottom: 4 }}>
                      {e.role === 'agent' ? 'Prof. Didier' : 'You'}
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
                  <MessageCircle size={16} /> Start Lesson with Prof. Didier
                </button>
              ) : convStatus === 'connecting' ? (
                <button disabled style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: 'rgba(96,165,250,0.1)', color: '#60a5fa', fontSize: 15, fontWeight: 600, cursor: 'not-allowed' }}>
                  Connecting...
                </button>
              ) : (
                <button onClick={endSession} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  End Session
                </button>
              )}
            </div>
          </div>
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
                <p style={{ fontSize: 13, margin: 0 }}>No lessons yet</p>
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
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#334155' }}>Lesson {idx + 1}</p>
                  </div>
                  {isCurrent && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />}
                </button>
              );
            })}

            {/* Final Quiz Entry */}
            {quizzes.length > 0 && (
              <div style={{ marginTop: 8, padding: '12px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Trophy size={13} color="#f59e0b" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>Chapter Quiz</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#78350f' }}>Complete all lessons first</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
