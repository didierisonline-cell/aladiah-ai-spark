/**
 * ProfessorDidierLiveClassroom — Production Architecture
 *
 * Route: /professor-live-test (test) → /professor-live (production, future)
 *
 * MOCK CONTEXT: Static lesson data for the test route.
 * When integrated with ChapterView, replace MOCK_* constants with props/context.
 * All mock data is isolated in the MOCK DATA section below — nothing leaks out.
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Engines
import { ProfessorPresenceEngine, AvisCanvasEngine } from '@/engines/classroom';
import { useLessonOrchestrator } from '@/engines/classroom/useLessonOrchestrator';
import { useStudentContext } from '@/engines/classroom/useStudentContext';
import { useInteractionEngine, DEFAULT_VOICE_COMMANDS } from '@/engines/classroom/useInteractionEngine';
import { useProfessorDidierVoice, VoiceSessionContext } from '@/hooks/useProfessorDidierVoice';

// Components
import ClassFlowPanel from '@/components/professor-live/ClassFlowPanel';
import VoiceControlPanel from '@/components/professor-live/VoiceControlPanel';
import StudentPromptPanel from '@/components/professor-live/StudentPromptPanel';

// Scrum content (program-specific — swap for other programs)
import { SCRUM_BOARD_CONTENT } from '@/content/scrum/ScrumBoardContent';

// ── MOCK DATA (test route only) ──────────────────────────────────────────────
const MOCK_PROGRAM = { id: 'ai-scrum-master', title: 'AI-Powered Scrum Master Certification', shortTitle: 'AI Scrum Master' };
const MOCK_MODULE  = { index: 0, title: '1. Foundations of Scrum' };
const MOCK_LESSONS = [
  { index: 0, title: 'What is Scrum?',       description: 'A framework for developing, delivering, and sustaining complex products. Scrum uses iterative, incremental practices to optimize predictability and control risk.' },
  { index: 1, title: 'Scrum Values',          description: 'The five Scrum values: Commitment, Courage, Focus, Openness, and Respect.' },
  { index: 2, title: 'Scrum Roles',           description: 'Product Owner, Scrum Master, and Developers — the three accountabilities in Scrum.' },
  { index: 3, title: 'Scrum Events',          description: 'Sprint, Sprint Planning, Daily Scrum, Sprint Review, and Sprint Retrospective.' },
  { index: 4, title: 'Scrum Artifacts',       description: 'Product Backlog, Sprint Backlog, and Increment — with their commitments.' },
];
const MOCK_STUDENT = { name: 'Founder Preview', progress: 10, language: 'English', languageCode: 'en' };
const MOCK_PROMPTS = [
  'Explain Sprint Planning in detail',
  'Give me a real-world example',
  'Quiz me on Scrum Roles',
  "What's the difference between Scrum and Agile?",
  'Show me a diagram',
];
// ────────────────────────────────────────────────────────────────────────────

function formatHMS(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

export default function ProfessorDidierLiveClassroom() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ── Engines ───────────────────────────────────────────────────────────────
  const { ctx: student, setLanguage } = useStudentContext(MOCK_STUDENT);

  const { state: lesson, dispatch } = useLessonOrchestrator({
    totalModules: 1,
    lessonsPerModule: [MOCK_LESSONS.length],
    totalBoardSteps: SCRUM_BOARD_CONTENT.totalSteps,
  });

  const voice = useProfessorDidierVoice();

  const { handleVoiceCommand, handleStudentPrompt } = useInteractionEngine({
    onEvent: dispatch,
    onQuickCommand: cmd => toast({ title: `Say: "${cmd}"`, description: 'Speak this to Professor Didier.' }),
  });

  // ── Local state ────────────────────────────────────────────────────────────
  const [isMuted, setIsMuted] = useState(false);
  const [notes, setNotes] = useState('');

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentLesson = MOCK_LESSONS[lesson.currentLessonIndex];
  const latestCaption = voice.captions[voice.captions.length - 1] ?? '';

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleConnect = useCallback(async () => {
    const ctx: VoiceSessionContext = {
      lessonTitle: currentLesson.title,
      lessonDescription: currentLesson.description,
      moduleTitle: MOCK_MODULE.title,
      programTitle: MOCK_PROGRAM.title,
      progress: student.progress,
      language: student.language,
      studentName: student.name,
      boardTopic: SCRUM_BOARD_CONTENT.title,
      boardStep: lesson.boardStep,
    };
    try {
      await voice.connect(ctx);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        toast({ title: '🎤 Microphone required', description: 'Allow microphone access and try again.', variant: 'destructive' });
      } else {
        toast({ title: 'Connection failed', description: err.message, variant: 'destructive' });
      }
    }
  }, [voice, currentLesson, student, lesson.boardStep, toast]);

  const handleDisconnect = useCallback(async () => {
    await voice.disconnect();
    toast({ title: 'Session ended', description: 'Your notes have been saved.' });
  }, [voice, toast]);

  const handleEndSession = useCallback(async () => {
    if (voice.isConnected) await voice.disconnect();
    navigate(-1);
  }, [voice, navigate]);

  const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Japanese'];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw',
      background: '#060D1C',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      overflow: 'hidden', color: '#EDF2F7',
    }}>

      {/* ── TOP BAR ───────────────────────────────────────────────── */}
      <div style={{
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 18px', gap: 14,
        background: '#07101E',
        borderBottom: '1px solid #1A2840',
        zIndex: 10,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #4A90F5, #9B59B6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: '#fff',
          }}>A</div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#4A90F5', letterSpacing: '.1em' }}>ALADIAH</div>
            <div style={{ fontSize: 7, color: '#2A3D5A', letterSpacing: '.12em', fontWeight: 700 }}>ACADEMY</div>
          </div>
        </div>

        <div style={{ width: 1, height: 22, background: '#1A2840' }} />

        {/* Title + LIVE dot (always visible) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 13, fontWeight: 800, letterSpacing: '.03em',
            background: 'linear-gradient(90deg, #4A90F5, #9B59B6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            PROFESSOR DIDIER™ LIVE
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: voice.isConnected ? '#22C98A' : '#4A5E7A',
              boxShadow: voice.isConnected ? '0 0 6px #22C98A' : 'none',
              animation: voice.isConnected ? 'topLive 1.5s infinite' : 'none',
            }} />
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '.07em',
              color: voice.isConnected ? '#22C98A' : '#4A5E7A',
            }}>
              {voice.isConnected ? 'LIVE' : 'READY'}
            </span>
          </div>
        </div>

        {/* Program label */}
        <div style={{
          padding: '3px 12px',
          background: '#0D1A2E', border: '1px solid #1A2840', borderRadius: 99,
          fontSize: 10.5, color: '#8596AD', fontWeight: 500,
        }}>
          {MOCK_PROGRAM.title}
        </div>

        <div style={{ flex: 1 }} />

        {/* Language selector (only when not connected) */}
        {!voice.isConnected && (
          <select
            value={student.language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              background: '#0D1A2E', border: '1px solid #1A2840', borderRadius: 7,
              color: '#8596AD', fontSize: 10.5, padding: '4px 10px', outline: 'none', cursor: 'pointer',
            }}
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        )}

        {/* Professor Mode dropdown */}
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px',
            background: '#0D1A2E', border: '1px solid rgba(74,144,245,.28)', borderRadius: 8,
            fontSize: 10.5, color: '#4A90F5', fontWeight: 600, cursor: 'pointer',
          }}>
            <span>👨‍🏫</span>
            <span>Professor Mode</span>
            <span style={{ fontSize: 8, color: '#4A5E7A' }}>▼</span>
          </div>
        </div>

        {/* Settings */}
        <button style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#0D1A2E', border: '1px solid #1A2840',
          color: '#4A5E7A', fontSize: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          ⚙
        </button>
      </div>

      {/* ── CONTENT ROW ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left sidebar */}
        <ClassFlowPanel
          status={voice.status}
          isConnected={voice.isConnected}
          isSpeaking={voice.isSpeaking}
          currentLessonIndex={lesson.currentLessonIndex}
          lessons={MOCK_LESSONS}
          program={MOCK_PROGRAM.shortTitle}
          module={MOCK_MODULE.title}
          lesson={currentLesson.title}
          progress={student.progress}
          onEndSession={handleEndSession}
          onQuickCommand={handleVoiceCommand}
        />

        {/* Main content — left column: professor | right column: board + prompts + notes */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>

          {/* LEFT COLUMN: Professor Presence (fills, cinematic) */}
          <div style={{
            flex: '0 0 55%', display: 'flex', flexDirection: 'column',
            borderRight: '1px solid #1A2840', overflow: 'hidden', minHeight: 0,
          }}>
            <ProfessorPresenceEngine
              status={voice.status}
              isConnected={voice.isConnected}
              isSpeaking={voice.isSpeaking}
              caption={latestCaption}
            />
          </div>

          {/* RIGHT COLUMN: Board (top) + Prompts + Notes (bottom) */}
          <div style={{
            flex: '0 0 45%', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', minHeight: 0,
            background: '#07101E',
          }}>
            {/* Teaching Board */}
            <div style={{ flex: '0 0 58%', padding: '10px 10px 6px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <AvisCanvasEngine
                content={SCRUM_BOARD_CONTENT}
                step={lesson.boardStep}
                onNext={() => dispatch({ type: 'BOARD_NEXT' })}
                onPrev={() => dispatch({ type: 'BOARD_PREV' })}
                onReset={() => dispatch({ type: 'BOARD_RESET' })}
              />
            </div>

            {/* Prompts + Notes */}
            <div style={{
              flex: '0 0 42%', borderTop: '1px solid #1A2840',
              overflow: 'hidden', minHeight: 0,
            }}>
              <StudentPromptPanel
                prompts={MOCK_PROMPTS}
                onSelectPrompt={p => {
                  toast({ title: `Say: "${p}"`, description: 'Speak this to Professor Didier.' });
                  handleStudentPrompt(p);
                }}
                notes={notes}
                onNotesChange={setNotes}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── VOICE DOCK (full width) ────────────────────────────────── */}
      <VoiceControlPanel
        status={voice.status}
        isConnected={voice.isConnected}
        isSpeaking={voice.isSpeaking}
        isMuted={isMuted}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onToggleMute={() => setIsMuted(m => !m)}
        onOpenWhiteboard={() => dispatch({ type: 'BOARD_NEXT' })}
        onNeedHelp={() => toast({ title: 'Need Help?', description: 'Speak to Professor Didier — press the mic and ask your question.' })}
      />

      {/* ── STATUS BAR ────────────────────────────────────────────── */}
      <div style={{
        height: 32, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 18px', gap: 18,
        background: '#04090F',
        borderTop: '1px solid #111D30',
        fontSize: 10, color: '#2A3D5A', fontWeight: 600,
        letterSpacing: '.04em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: voice.isConnected ? '#22C98A' : '#2A3D5A',
          }} />
          <span style={{ color: voice.isConnected ? '#22C98A' : '#2A3D5A', fontWeight: 800 }}>
            LIVE SESSION
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>⏱</span>
          <span style={{ fontFamily: 'monospace', color: '#4A5E7A' }}>
            {formatHMS(voice.elapsedMs)}
          </span>
        </div>

        <div style={{ width: 3, height: 14, borderRadius: 99, background: '#1A2840' }} />

        <span style={{ color: '#4A5E7A' }}>AI Professor</span>
        <span style={{ color: voice.isConnected ? '#22C98A' : '#2A3D5A' }}>
          {voice.isConnected ? 'Online' : 'Ready'}
        </span>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, color: '#4A5E7A' }}>
          <span>?</span>
          <span>Need Help</span>
        </div>
      </div>

      <style>{`
        @keyframes topLive { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}
