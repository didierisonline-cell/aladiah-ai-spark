import professorAvatar from '@/assets/professor-didier.png';
import { VoiceStatus } from '@/engines/classroom/types';

interface Lesson { index: number; title: string; }

interface ClassFlowPanelProps {
  status: VoiceStatus;
  isConnected: boolean;
  isSpeaking: boolean;
  currentLessonIndex: number;
  lessons: Lesson[];
  program: string;
  module: string;
  lesson: string;
  progress: number;
  onEndSession: () => void;
  onQuickCommand: (cmd: string) => void;
}

const STATUS_MAP: Record<VoiceStatus, { label: string; color: string }> = {
  idle:         { label: 'Online',      color: '#22C98A' },
  connecting:   { label: 'Connecting…', color: '#F5B81A' },
  speaking:     { label: 'Speaking',    color: '#4A90F5' },
  listening:    { label: 'Listening',   color: '#22C98A' },
  disconnecting:{ label: 'Ending…',     color: '#8596AD' },
};

function SidebarWaveform({ active, speaking }: { active: boolean; speaking: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 14, marginTop: 3 }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const h = active ? (speaking ? 3 + Math.abs(Math.sin(i * 0.7)) * 9 : 2 + Math.abs(Math.sin(i)) * 5) : 2;
        return (
          <div key={i} style={{
            width: 2, borderRadius: 99,
            height: h,
            background: speaking ? '#4A90F5' : '#22C98A',
            animation: active ? `sw${i % 4} ${0.5 + (i % 4) * 0.12}s ease-in-out infinite alternate` : 'none',
            opacity: active ? 1 : 0.3,
            transition: 'background 0.4s',
          }} />
        );
      })}
      <style>{`
        @keyframes sw0{from{height:2px}to{height:10px}}
        @keyframes sw1{from{height:3px}to{height:7px}}
        @keyframes sw2{from{height:2px}to{height:12px}}
        @keyframes sw3{from{height:3px}to{height:6px}}
      `}</style>
    </div>
  );
}

const QUICK_COMMANDS = [
  'Repeat that',
  'Explain another way',
  'Show me an example',
  'Quiz me on this',
  'What should I focus on?',
];

export default function ClassFlowPanel({
  status, isConnected, isSpeaking, currentLessonIndex, lessons,
  program, module, lesson, progress, onEndSession, onQuickCommand,
}: ClassFlowPanelProps) {
  const { label, color } = STATUS_MAP[status];

  return (
    <div style={{
      width: 162, flexShrink: 0,
      background: '#07101E',
      borderRight: '1px solid #1A2840',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontSize: 11,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>

      {/* Professor avatar + status */}
      <div style={{ padding: '16px 12px 12px', borderBottom: '1px solid #1A2840', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          {/* Photo avatar */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
            border: `2px solid ${isConnected ? color + '80' : '#1E2D47'}`,
            boxShadow: isConnected ? `0 0 10px ${color}40` : 'none',
            transition: 'all 0.5s',
            background: 'linear-gradient(135deg, #1E3A8A, #9B59B6)',
          }}>
            <img src={professorAvatar} alt="Professor Didier"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#EDF2F7', lineHeight: 1.2, marginBottom: 1 }}>
              Professor Didier™
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: color,
                boxShadow: `0 0 5px ${color}`,
                animation: isConnected ? 'spulse 2s infinite' : 'none',
              }} />
              <span style={{ fontSize: 10, color, fontWeight: 600 }}>{label}</span>
            </div>
            <SidebarWaveform active={isConnected} speaking={isSpeaking} />
          </div>
        </div>

        <button
          onClick={onEndSession}
          style={{
            width: '100%', padding: '6px 0', borderRadius: 7,
            background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.28)',
            color: '#EF4444', fontSize: 10, fontWeight: 700, cursor: 'pointer',
            letterSpacing: '.04em', transition: 'background .18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,.1)')}
        >
          End Session
        </button>
      </div>

      {/* Class Flow */}
      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid #1A2840', flexShrink: 0 }}>
        <div style={sectionLabel}>Class Flow</div>
        {lessons.map(l => {
          const isCur = l.index === currentLessonIndex;
          const isDone = l.index < currentLessonIndex;
          return (
            <div key={l.index} style={{
              display: 'flex', alignItems: 'flex-start', gap: 7,
              padding: '5px 7px', borderRadius: 6, marginBottom: 2,
              background: isCur ? 'rgba(74,144,245,.1)' : 'transparent',
              border: `1px solid ${isCur ? 'rgba(74,144,245,.22)' : 'transparent'}`,
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isCur ? '#4A90F5' : isDone ? '#22C98A' : '#1E2D47',
                fontSize: 8, fontWeight: 800, color: '#fff',
              }}>
                {isDone ? '✓' : l.index + 1}
              </div>
              <span style={{
                fontSize: 10.5, fontWeight: isCur ? 700 : 400,
                color: isCur ? '#EDF2F7' : isDone ? '#4A5E7A' : '#5A6E88',
                lineHeight: 1.35,
              }}>
                {l.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Session Context */}
      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid #1A2840', flexShrink: 0 }}>
        <div style={sectionLabel}>Session Context</div>
        {[['Program', program], ['Module', module], ['Lesson', lesson]].map(([k, v]) => (
          <div key={k} style={{ marginBottom: 7 }}>
            <div style={{ fontSize: 9, color: '#4A5E7A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 1 }}>{k}</div>
            <div style={{ fontSize: 10, color: '#8596AD', lineHeight: 1.35 }}>{v}</div>
          </div>
        ))}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 9, color: '#4A5E7A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Progress</span>
            <span style={{ fontSize: 9, color: '#4A90F5', fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ height: 3, background: '#1E2D47', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #4A90F5, #9B59B6)', borderRadius: 99 }} />
          </div>
        </div>
      </div>

      {/* Quick Voice Commands */}
      <div style={{ padding: '10px 12px 12px', overflow: 'auto', flex: 1 }}>
        <div style={sectionLabel}>Quick Voice Commands</div>
        {QUICK_COMMANDS.map(cmd => (
          <button
            key={cmd}
            onClick={() => onQuickCommand(cmd)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, width: '100%',
              padding: '5px 0', background: 'none', border: 'none', borderBottom: '1px solid #111D30',
              color: '#5A6E88', fontSize: 10, cursor: 'pointer', textAlign: 'left',
              transition: 'color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#EDF2F7')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5A6E88')}
          >
            <span style={{ color: '#2A3D5A', fontSize: 10 }}>›</span>
            {cmd}
          </button>
        ))}
      </div>

      <style>{`@keyframes spulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: 9, fontWeight: 800, letterSpacing: '.12em',
  textTransform: 'uppercase', color: '#2A3D5A', marginBottom: 8,
};
