import { ProfessorStatus } from '@/hooks/useProfessorDidierVoice';

interface Lesson {
  index: number;
  title: string;
}

interface ClassFlowPanelProps {
  status: ProfessorStatus;
  isConnected: boolean;
  currentLessonIndex: number;
  lessons: Lesson[];
  program: string;
  module: string;
  lesson: string;
  progress: number;
  onEndSession: () => void;
  onQuickCommand: (cmd: string) => void;
}

const STATUS_CONFIG: Record<ProfessorStatus, { label: string; color: string; dot: string }> = {
  idle:         { label: 'Online',       color: '#22C98A', dot: '#22C98A' },
  connecting:   { label: 'Connecting…',  color: '#F5B81A', dot: '#F5B81A' },
  speaking:     { label: 'Speaking',     color: '#4A90F5', dot: '#4A90F5' },
  listening:    { label: 'Listening',    color: '#22C98A', dot: '#22C98A' },
  disconnecting:{ label: 'Ending…',      color: '#8596AD', dot: '#8596AD' },
};

const QUICK_COMMANDS = [
  'Repeat that',
  'Explain another way',
  'Show me an example',
  'Quiz me on this',
  'What should I focus on?',
];

export default function ClassFlowPanel({
  status, isConnected, currentLessonIndex, lessons,
  program, module, lesson, progress, onEndSession, onQuickCommand,
}: ClassFlowPanelProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div style={{
      width: 240, flexShrink: 0,
      background: '#080E1A',
      borderRight: '1px solid #1E2D47',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Professor avatar + status */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1E2D47' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #4A90F5 0%, #9B59B6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 900, color: '#fff',
            boxShadow: isConnected ? `0 0 0 3px ${cfg.dot}40` : '0 0 0 3px #1E2D47',
            transition: 'box-shadow 0.3s',
          }}>
            D
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#EDF2F7', lineHeight: 1.2 }}>
              Professor Didier™
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: cfg.dot,
                boxShadow: `0 0 6px ${cfg.dot}`,
                animation: isConnected ? 'pulse 2s infinite' : 'none',
              }} />
              <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onEndSession}
          style={{
            width: '100%', padding: '7px 0',
            background: 'rgba(239,68,68,.12)',
            border: '1px solid rgba(239,68,68,.3)',
            borderRadius: 8,
            color: '#EF4444', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '.04em',
            transition: 'all .18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,.22)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,.12)')}
        >
          End Session
        </button>
      </div>

      {/* Class flow */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E2D47', flex: 1, overflow: 'auto' }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A5E7A', marginBottom: 10 }}>
          Class Flow
        </div>
        {lessons.map((l) => {
          const isCurrent = l.index === currentLessonIndex;
          const isDone = l.index < currentLessonIndex;
          return (
            <div key={l.index} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 10px', borderRadius: 8, marginBottom: 3,
              background: isCurrent ? 'rgba(74,144,245,.12)' : 'transparent',
              border: isCurrent ? '1px solid rgba(74,144,245,.25)' : '1px solid transparent',
              transition: 'all .18s',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isCurrent ? '#4A90F5' : isDone ? '#22C98A' : '#1E2D47',
                fontSize: 9, fontWeight: 800, color: '#fff',
              }}>
                {isDone ? '✓' : l.index + 1}
              </div>
              <span style={{
                fontSize: 11, fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? '#EDF2F7' : isDone ? '#8596AD' : '#6B7F99',
                lineHeight: 1.3,
              }}>
                {l.title}
              </span>
              {isCurrent && (
                <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#4A90F5' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Session context */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E2D47' }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A5E7A', marginBottom: 10 }}>
          Session Context
        </div>
        {[
          { label: 'Program', value: program },
          { label: 'Module', value: module },
          { label: 'Lesson', value: lesson },
        ].map(({ label, value }) => (
          <div key={label} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, color: '#4A5E7A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>
              {label}
            </div>
            <div style={{ fontSize: 11, color: '#8596AD', lineHeight: 1.3 }}>{value}</div>
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 9, color: '#4A5E7A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Progress</span>
            <span style={{ fontSize: 9, color: '#4A90F5', fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: '#1E2D47', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #4A90F5, #9B59B6)', borderRadius: 99, transition: 'width .3s' }} />
          </div>
        </div>
      </div>

      {/* Quick voice commands */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A5E7A', marginBottom: 10 }}>
          Quick Voice Commands
        </div>
        {QUICK_COMMANDS.map(cmd => (
          <button
            key={cmd}
            onClick={() => onQuickCommand(cmd)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '6px 0', background: 'none', border: 'none',
              color: '#8596AD', fontSize: 11, cursor: 'pointer', textAlign: 'left',
              transition: 'color .15s',
              borderBottom: '1px solid #111D30',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#EDF2F7')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8596AD')}
          >
            <span style={{ color: '#4A5E7A', fontSize: 10 }}>›</span>
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
