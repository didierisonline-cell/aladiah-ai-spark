import { useRef } from 'react';
import { ProfessorStatus } from '@/hooks/useProfessorDidierVoice';

interface VoiceControlPanelProps {
  status: ProfessorStatus;
  isConnected: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleMute: () => void;
  onShowDiagram: () => void;
  onNeedHelp: () => void;
}

function Waveform({ active, speaking }: { active: boolean; speaking: boolean }) {
  const bars = 24;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 36 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const base = 4;
        const maxH = speaking ? 32 : active ? 16 : 5;
        const sin = Math.sin((i / bars) * Math.PI);
        const h = active ? base + sin * (maxH - base) : base;
        return (
          <div
            key={i}
            style={{
              width: 3, borderRadius: 99,
              height: h,
              background: speaking
                ? `rgba(74,144,245,${0.4 + sin * 0.6})`
                : active
                ? `rgba(34,201,138,${0.3 + sin * 0.5})`
                : '#1E2D47',
              transition: active ? 'height 0.3s ease' : 'height 0.6s ease, background 0.3s',
              animation: active ? `wave-${i % 4} ${0.8 + (i % 4) * 0.15}s ease-in-out infinite alternate` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

export default function VoiceControlPanel({
  status, isConnected, isSpeaking, isMuted,
  onConnect, onDisconnect, onToggleMute, onShowDiagram, onNeedHelp,
}: VoiceControlPanelProps) {
  const isIdle = status === 'idle';
  const isConnecting = status === 'connecting';

  return (
    <div style={{
      background: '#080E1A',
      borderTop: '1px solid #1E2D47',
      padding: '12px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      {/* Waveform */}
      <div style={{ flex: 1 }}>
        <Waveform active={isConnected} speaking={isSpeaking} />
      </div>

      {/* Mute button */}
      <button
        onClick={onToggleMute}
        disabled={!isConnected}
        title={isMuted ? 'Unmute' : 'Mute'}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: isMuted ? 'rgba(239,68,68,.15)' : '#111D30',
          border: `1px solid ${isMuted ? 'rgba(239,68,68,.35)' : '#1E2D47'}`,
          color: isMuted ? '#EF4444' : '#8596AD',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isConnected ? 'pointer' : 'not-allowed',
          opacity: isConnected ? 1 : 0.4,
          fontSize: 16, transition: 'all .18s',
        }}
      >
        {isMuted ? '🔇' : '🎙️'}
      </button>

      {/* Main mic / connect button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <button
          onClick={isConnected ? onDisconnect : onConnect}
          disabled={isConnecting || status === 'disconnecting'}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: isConnected
              ? 'rgba(239,68,68,.15)'
              : isConnecting
              ? 'rgba(245,184,26,.15)'
              : 'linear-gradient(135deg, #4A90F5, #9B59B6)',
            border: `2px solid ${isConnected ? 'rgba(239,68,68,.4)' : isConnecting ? 'rgba(245,184,26,.4)' : 'rgba(74,144,245,.5)'}`,
            boxShadow: isConnected
              ? '0 0 0 8px rgba(239,68,68,.08)'
              : isConnecting
              ? '0 0 0 8px rgba(245,184,26,.08)'
              : '0 0 24px rgba(74,144,245,.35)',
            color: '#fff', fontSize: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: isConnecting || status === 'disconnecting' ? 'not-allowed' : 'pointer',
            transition: 'all .3s',
            animation: isConnected && !isSpeaking ? 'pulseRing 2s infinite' : 'none',
          }}
        >
          {isConnecting ? '⏳' : isConnected ? '📵' : '🎤'}
        </button>
        <span style={{ fontSize: 10, color: '#8596AD', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>
          {isConnecting ? 'Connecting…' : isConnected ? 'Tap to End' : 'Tap to Speak'}
        </span>
      </div>

      {/* Show diagram */}
      <button
        onClick={onShowDiagram}
        title="Show Diagram"
        style={{
          padding: '10px 14px', borderRadius: 10,
          background: '#111D30', border: '1px solid #1E2D47',
          color: '#8596AD', fontSize: 11, fontWeight: 600,
          cursor: 'pointer', transition: 'all .18s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(74,144,245,.4)';
          e.currentTarget.style.color = '#EDF2F7';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#1E2D47';
          e.currentTarget.style.color = '#8596AD';
        }}
      >
        <span style={{ fontSize: 16 }}>📋</span>
        <span>Open Board</span>
      </button>

      {/* Need help */}
      <button
        onClick={onNeedHelp}
        title="Need Help?"
        style={{
          padding: '10px 14px', borderRadius: 10,
          background: '#111D30', border: '1px solid #1E2D47',
          color: '#8596AD', fontSize: 11, fontWeight: 600,
          cursor: 'pointer', transition: 'all .18s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(74,144,245,.4)';
          e.currentTarget.style.color = '#EDF2F7';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#1E2D47';
          e.currentTarget.style.color = '#8596AD';
        }}
      >
        <span style={{ fontSize: 16 }}>❓</span>
        <span>Need Help</span>
      </button>

      <style>{`
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0px rgba(34,201,138,.3); }
          50% { box-shadow: 0 0 0 12px rgba(34,201,138,.0); }
        }
        @keyframes wave-0 { from { height: 4px; } to { height: 28px; } }
        @keyframes wave-1 { from { height: 6px; } to { height: 20px; } }
        @keyframes wave-2 { from { height: 8px; } to { height: 32px; } }
        @keyframes wave-3 { from { height: 4px; } to { height: 16px; } }
      `}</style>
    </div>
  );
}
