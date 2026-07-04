import { VoiceStatus } from '@/engines/classroom/types';

interface VoiceControlPanelProps {
  status: VoiceStatus;
  isConnected: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleMute: () => void;
  onOpenWhiteboard: () => void;
  onNeedHelp: () => void;
}

function DockButton({
  icon, label, onClick, disabled = false, danger = false,
}: { icon: string; label: string; onClick?: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        padding: '8px 18px',
        background: 'none', border: 'none',
        color: disabled ? '#1E2D47' : danger ? '#EF4444' : '#5A7090',
        fontSize: 10, fontWeight: 600, letterSpacing: '.04em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'color .2s',
        opacity: disabled ? 0.35 : 1,
        minWidth: 76,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = danger ? '#FF6B6B' : '#C8D8EC'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.color = danger ? '#EF4444' : '#5A7090'; }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: '50%',
        background: disabled ? 'rgba(255,255,255,.03)' : danger ? 'rgba(239,68,68,.1)' : 'rgba(255,255,255,.04)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,.06)' : danger ? 'rgba(239,68,68,.28)' : 'rgba(255,255,255,.09)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 19, transition: 'all .2s',
      }}>
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

function MainMicButton({
  status, isConnected, onConnect, onDisconnect,
}: {
  status: VoiceStatus; isConnected: boolean;
  onConnect: () => void; onDisconnect: () => void;
}) {
  const isConnecting = status === 'connecting';
  const isEnding = status === 'disconnecting';
  const busy = isConnecting || isEnding;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <button
        onClick={isConnected ? onDisconnect : onConnect}
        disabled={busy}
        style={{
          width: 74, height: 74, borderRadius: '50%',
          background: isConnected
            ? 'rgba(239,68,68,.16)'
            : isConnecting
            ? 'rgba(245,184,26,.14)'
            : 'linear-gradient(145deg, #4A90F5 0%, #6A52E8 55%, #9B59B6 100%)',
          border: `2px solid ${isConnected ? 'rgba(239,68,68,.5)' : isConnecting ? 'rgba(245,184,26,.5)' : 'rgba(74,144,245,.62)'}`,
          boxShadow: isConnected
            ? '0 0 22px rgba(239,68,68,.28), 0 0 0 8px rgba(239,68,68,.07)'
            : isConnecting
            ? '0 0 18px rgba(245,184,26,.25)'
            : '0 0 35px rgba(74,144,245,.55), 0 0 0 12px rgba(74,144,245,.10), 0 0 0 26px rgba(74,144,245,.04)',
          cursor: busy ? 'not-allowed' : 'pointer',
          fontSize: 27,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .4s',
          animation: !isConnected && !busy ? 'micGlowPulse 3s ease-in-out infinite' : 'none',
        }}
      >
        {isConnecting ? '⌛' : isEnding ? '⏏️' : isConnected ? '📵' : '🎤'}
      </button>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase',
        color: isConnected ? '#EF4444' : isConnecting ? '#F5B81A' : '#5A7090',
      }}>
        {isConnecting ? 'Connecting…' : isEnding ? 'Ending…' : isConnected ? 'Tap to End' : 'Tap to Speak'}
      </span>
      <style>{`
        @keyframes micGlowPulse {
          0%,100% {
            box-shadow: 0 0 35px rgba(74,144,245,.55), 0 0 0 12px rgba(74,144,245,.10), 0 0 0 26px rgba(74,144,245,.04);
          }
          50% {
            box-shadow: 0 0 55px rgba(74,144,245,.80), 0 0 0 18px rgba(74,144,245,.16), 0 0 0 38px rgba(74,144,245,.07);
          }
        }
      `}</style>
    </div>
  );
}

export default function VoiceControlPanel({
  status, isConnected, isSpeaking, isMuted,
  onConnect, onDisconnect, onToggleMute, onOpenWhiteboard, onNeedHelp,
}: VoiceControlPanelProps) {
  return (
    <div style={{
      height: 96, flexShrink: 0,
      background: 'linear-gradient(180deg, #050B19 0%, #060D1C 100%)',
      borderTop: '1px solid rgba(74,144,245,.14)',
      boxShadow: '0 -6px 30px rgba(0,0,0,.55), inset 0 1px 0 rgba(74,144,245,.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
      padding: '0 20px',
    }}>
      <DockButton icon={isMuted ? '🔇' : '🔈'} label={isMuted ? 'Unmute' : 'Mute'} onClick={onToggleMute} disabled={!isConnected} />
      <DockButton icon="🖥️" label="Share Screen" disabled />
      <MainMicButton status={status} isConnected={isConnected} onConnect={onConnect} onDisconnect={onDisconnect} />
      <DockButton icon="📐" label="Open Whiteboard" onClick={onOpenWhiteboard} />
      <DockButton icon="❓" label="Need Help?" onClick={onNeedHelp} />
    </div>
  );
}
