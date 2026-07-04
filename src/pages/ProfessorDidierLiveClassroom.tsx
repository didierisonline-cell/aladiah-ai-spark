/**
 * ProfessorDidierLiveClassroom — test route only (/professor-live-test)
 *
 * MOCK DATA WARNING: Context below is static mock data for QA purposes.
 * Replace with real course/chapter/lesson props once the founder approves
 * this page for integration with the production ChapterView flow.
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfessorDidierVoice, VoiceSessionContext } from '@/hooks/useProfessorDidierVoice';
import ClassFlowPanel from '@/components/professor-live/ClassFlowPanel';
import TeachingBoard from '@/components/professor-live/TeachingBoard';
import VoiceControlPanel from '@/components/professor-live/VoiceControlPanel';
import StudentPromptPanel from '@/components/professor-live/StudentPromptPanel';
import { useToast } from '@/hooks/use-toast';

// ── MOCK CONTEXT (test route only — never leaks to production) ───────────────
const MOCK_CONTEXT = {
  studentName: 'Founder Preview',
  program: 'AI-Powered Scrum Master',
  module: '1. Foundations of Scrum',
  lesson: '1.1 What is Scrum?',
  progress: 10,
  language: 'English',
};

const MOCK_LESSONS = [
  { index: 0, title: 'What is Scrum?' },
  { index: 1, title: 'Scrum Values' },
  { index: 2, title: 'Scrum Roles' },
  { index: 3, title: 'Scrum Events' },
  { index: 4, title: 'Scrum Artifacts' },
];

const SCRUM_BOARD = {
  id: 'scrum-foundations',
  title: 'What is Scrum?',
  subtitle: 'A framework for developing, delivering, and sustaining complex products.',
  steps: 5, // 0=title, 1=backlog, 2=planning, 3=sprint+daily, 4=review+retro+increment
};

const SUGGESTED_PROMPTS = [
  'Explain Sprint Planning in detail',
  'Give me a real-world example',
  'Quiz me on Scrum Roles',
  "What's the difference between Scrum and Agile?",
  'Show me a diagram',
];
// ────────────────────────────────────────────────────────────────────────────

function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function ProfessorPresenceArea({
  isConnected, isSpeaking, status, caption
}: {
  isConnected: boolean; isSpeaking: boolean; status: string; caption: string;
}) {
  const pulseStyle = isConnected && !isSpeaking ? 'listeningPulse' : '';

  return (
    <div style={{
      width: 320, flexShrink: 0,
      background: 'linear-gradient(180deg, #0A0F1E 0%, #0B111E 60%, #080E1A 100%)',
      borderRight: '1px solid #1E2D47',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '24px 20px',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 280, height: 280, borderRadius: '50%',
        background: isConnected
          ? isSpeaking
            ? 'radial-gradient(circle, rgba(74,144,245,.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(34,201,138,.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(74,144,245,.06) 0%, transparent 70%)',
        transition: 'background 0.8s ease',
        pointerEvents: 'none',
      }} />

      {/* LIVE badge */}
      {isConnected && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.4)',
          borderRadius: 99, padding: '3px 10px',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: '#EF4444',
            animation: 'dotPulse 1.2s infinite',
          }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#EF4444', letterSpacing: '.08em' }}>LIVE</span>
        </div>
      )}

      {/* Professor avatar — cinematic large */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        {/* Outer ring — animated when speaking */}
        <div style={{
          position: 'absolute', inset: -12,
          borderRadius: '50%',
          border: `2px solid ${isSpeaking ? 'rgba(74,144,245,.5)' : isConnected ? 'rgba(34,201,138,.3)' : 'rgba(74,144,245,.15)'}`,
          animation: isConnected ? 'ringRotate 8s linear infinite' : 'none',
          transition: 'border-color 0.5s',
        }} />
        <div style={{
          position: 'absolute', inset: -6,
          borderRadius: '50%',
          border: `1px solid ${isSpeaking ? 'rgba(74,144,245,.3)' : 'rgba(74,144,245,.1)'}`,
          animation: isConnected ? 'ringRotate 5s linear infinite reverse' : 'none',
        }} />

        {/* Avatar */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #9B59B6 50%, #4A90F5 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, fontWeight: 900, color: '#fff',
          boxShadow: isSpeaking
            ? '0 0 40px rgba(74,144,245,.5), 0 0 80px rgba(74,144,245,.2)'
            : isConnected
            ? '0 0 24px rgba(34,201,138,.3)'
            : '0 8px 32px rgba(0,0,0,.5)',
          transition: 'box-shadow 0.5s ease',
          position: 'relative', zIndex: 1,
        }}>
          D
        </div>
      </div>

      {/* Professor name */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#EDF2F7', marginBottom: 2 }}>
          Professor Didier™
        </div>
        <div style={{ fontSize: 11, color: '#4A90F5', fontWeight: 600, letterSpacing: '.06em' }}>
          Founder & Lead Professor · Aladiah Academy
        </div>
      </div>

      {/* Status pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: isSpeaking
          ? 'rgba(74,144,245,.12)' : isConnected
          ? 'rgba(34,201,138,.1)' : 'rgba(139,150,173,.08)',
        border: `1px solid ${isSpeaking ? 'rgba(74,144,245,.3)' : isConnected ? 'rgba(34,201,138,.25)' : '#1E2D47'}`,
        borderRadius: 99, padding: '5px 14px', marginBottom: 20,
        transition: 'all 0.4s',
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: isSpeaking ? '#4A90F5' : isConnected ? '#22C98A' : '#8596AD',
          animation: isConnected ? 'dotPulse 2s infinite' : 'none',
        }} />
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: isSpeaking ? '#4A90F5' : isConnected ? '#22C98A' : '#8596AD',
        }}>
          {isSpeaking ? 'Speaking…' : isConnected ? 'Listening for you' : status === 'connecting' ? 'Connecting…' : 'Ready to teach'}
        </span>
      </div>

      {/* Caption area */}
      <div style={{
        width: '100%',
        background: 'rgba(8,14,26,.8)',
        border: '1px solid #1E2D47',
        borderRadius: 10, padding: '10px 14px',
        minHeight: 64,
        backdropFilter: 'blur(4px)',
      }}>
        {caption ? (
          <p style={{ fontSize: 12, color: '#EDF2F7', lineHeight: 1.55, textAlign: 'center' }}>
            {caption}
          </p>
        ) : (
          <p style={{ fontSize: 11, color: '#4A5E7A', lineHeight: 1.5, textAlign: 'center' }}>
            {isConnected ? 'Professor Didier is preparing to speak…' : 'Start the class to begin your live lesson'}
          </p>
        )}
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .6; transform: scale(.85); }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function ProfessorDidierLiveClassroom() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const voice = useProfessorDidierVoice();

  const [boardStep, setBoardStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [notes, setNotes] = useState('');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showSettings, setShowSettings] = useState(false);

  const sessionContext: VoiceSessionContext = {
    lessonTitle: MOCK_LESSONS[currentLessonIndex].title,
    lessonDescription: 'A framework for developing, delivering, and sustaining complex products. Scrum uses iterative, incremental practices to optimize predictability and control risk.',
    moduleTitle: MOCK_CONTEXT.module,
    programTitle: MOCK_CONTEXT.program,
    progress: MOCK_CONTEXT.progress,
    language: selectedLanguage,
    studentName: MOCK_CONTEXT.studentName,
    boardTopic: SCRUM_BOARD.title,
    boardStep,
  };

  const handleConnect = useCallback(async () => {
    try {
      await voice.connect(sessionContext);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        toast({ title: '🎤 Microphone required', description: 'Please allow microphone access and try again.', variant: 'destructive' });
      } else {
        toast({ title: 'Connection failed', description: err.message || 'Could not start class', variant: 'destructive' });
      }
    }
  }, [voice, sessionContext, toast]);

  const handleDisconnect = useCallback(async () => {
    await voice.disconnect();
    toast({ title: 'Session ended', description: 'Your class has been saved.' });
  }, [voice, toast]);

  const handleEndSession = useCallback(async () => {
    if (voice.isConnected) await voice.disconnect();
    navigate(-1);
  }, [voice, navigate]);

  const handleQuickCommand = useCallback((cmd: string) => {
    toast({ title: `Voice command: "${cmd}"`, description: 'Say this to Professor Didier during the class.' });
  }, [toast]);

  const handleSelectPrompt = useCallback((prompt: string) => {
    toast({ title: `Say: "${prompt}"`, description: 'Speak this to Professor Didier.' });
  }, [toast]);

  const latestCaption = voice.captions[voice.captions.length - 1] ?? '';

  const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Japanese'];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw',
      background: '#0B111E',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      overflow: 'hidden',
      color: '#EDF2F7',
    }}>

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div style={{
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 16,
        background: '#080E1A',
        borderBottom: '1px solid #1E2D47',
        zIndex: 10,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #4A90F5, #9B59B6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: '#fff',
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#4A90F5', letterSpacing: '.08em', lineHeight: 1 }}>ALADIAH</div>
            <div style={{ fontSize: 8, color: '#4A5E7A', letterSpacing: '.1em', fontWeight: 600 }}>ACADEMY</div>
          </div>
        </div>

        <div style={{ width: 1, height: 24, background: '#1E2D47' }} />

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#4A90F5' }}>PROFESSOR DIDIER™ LIVE</span>
          {voice.isConnected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C98A', animation: 'dotPulse2 1.5s infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#22C98A', letterSpacing: '.06em' }}>LIVE</span>
            </div>
          )}
        </div>

        {/* Program label */}
        <div style={{
          marginLeft: 8, padding: '3px 12px',
          background: '#111D30', border: '1px solid #1E2D47', borderRadius: 99,
          fontSize: 11, color: '#8596AD', fontWeight: 600,
        }}>
          {MOCK_CONTEXT.program}
        </div>

        <div style={{ flex: 1 }} />

        {/* Language selector */}
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
          disabled={voice.isConnected}
          style={{
            background: '#111D30', border: '1px solid #1E2D47', borderRadius: 8,
            color: '#8596AD', fontSize: 11, padding: '4px 10px',
            cursor: voice.isConnected ? 'not-allowed' : 'pointer',
            outline: 'none',
          }}
        >
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Professor mode label */}
        <div style={{
          padding: '4px 12px',
          background: '#111D30', border: '1px solid rgba(74,144,245,.3)', borderRadius: 8,
          fontSize: 11, color: '#4A90F5', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>👨‍🏫</span> Professor Mode
        </div>

        {/* Timer */}
        {voice.isConnected && (
          <div style={{ fontSize: 13, fontWeight: 700, color: '#F5B81A', letterSpacing: '.06em', minWidth: 48 }}>
            {formatTime(voice.elapsedMs)}
          </div>
        )}

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#111D30', border: '1px solid #1E2D47',
            color: '#8596AD', fontSize: 15, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ⚙️
        </button>
      </div>

      {/* ── CONTENT ROW ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left sidebar */}
        <ClassFlowPanel
          status={voice.status}
          isConnected={voice.isConnected}
          currentLessonIndex={currentLessonIndex}
          lessons={MOCK_LESSONS}
          program={MOCK_CONTEXT.program}
          module={MOCK_CONTEXT.module}
          lesson={MOCK_LESSONS[currentLessonIndex].title}
          progress={MOCK_CONTEXT.progress}
          onEndSession={handleEndSession}
          onQuickCommand={handleQuickCommand}
        />

        {/* Main classroom */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Professor + Board */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 16, gap: 16 }}>
            {/* Professor presence */}
            <ProfessorPresenceArea
              isConnected={voice.isConnected}
              isSpeaking={voice.isSpeaking}
              status={voice.status}
              caption={latestCaption}
            />

            {/* Teaching board */}
            <TeachingBoard
              lesson={SCRUM_BOARD}
              step={boardStep}
              onNextStep={() => setBoardStep(s => Math.min(s + 1, SCRUM_BOARD.steps - 1))}
              onPrevStep={() => setBoardStep(s => Math.max(s - 1, 0))}
              onReset={() => setBoardStep(0)}
            />
          </div>

          {/* Voice controls */}
          <VoiceControlPanel
            status={voice.status}
            isConnected={voice.isConnected}
            isSpeaking={voice.isSpeaking}
            isMuted={isMuted}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onToggleMute={() => setIsMuted(m => !m)}
            onShowDiagram={() => setBoardStep(s => Math.min(s + 1, SCRUM_BOARD.steps - 1))}
            onNeedHelp={() => toast({ title: 'Help', description: 'Press the microphone and speak to Professor Didier. Use quick voice commands on the left.' })}
          />
        </div>

        {/* Right panel */}
        <StudentPromptPanel
          prompts={SUGGESTED_PROMPTS}
          onSelectPrompt={handleSelectPrompt}
          notes={notes}
          onNotesChange={setNotes}
        />
      </div>

      {/* ── BOTTOM STATUS BAR ────────────────────────────────────── */}
      <div style={{
        height: 36, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 20,
        background: '#080E1A',
        borderTop: '1px solid #1E2D47',
        fontSize: 10, color: '#4A5E7A', fontWeight: 600,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: voice.isConnected ? '#22C98A' : '#4A5E7A' }} />
          {voice.isConnected ? 'Live Session' : 'Session Ready'}
        </div>
        {voice.isConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>⏱</span>
            <span>{formatTime(voice.elapsedMs)}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ color: '#4A90F5' }}>▪</span>
          AI Professor Online
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>❓</span>
          <span>Need Help?</span>
        </div>

        {/* TEST MODE banner */}
        <div style={{
          padding: '2px 10px', borderRadius: 99,
          background: 'rgba(245,184,26,.12)', border: '1px solid rgba(245,184,26,.3)',
          color: '#F5B81A', fontSize: 9, fontWeight: 800, letterSpacing: '.08em',
        }}>
          TEST ROUTE — /professor-live-test
        </div>
      </div>

      <style>{`
        @keyframes dotPulse2 {
          0%, 100% { opacity: 1; } 50% { opacity: .4; }
        }
      `}</style>
    </div>
  );
}
