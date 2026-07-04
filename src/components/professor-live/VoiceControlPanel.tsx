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
        padding: '8px 16px',
        background: 'none', border: 'none',
        color: disabled ? '#2A3D5A' : danger ? '#EF4444' : '#8596AD',
        fontSize: 10, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'color .18s',
        letterSpacing: '.04em',
        opacity: disabled ? 0.4 : 1,
        minWidth: 72,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = danger ? '#FF6B6B' : '#EDF2F7'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.color = danger ? '#EF4444' : '#8596AD'; }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: disabled ? '#111D30' : danger ? 'rgba(239,68,68,.12)' : 'rgba(255,255,255,.05)',
        border: `1px solid ${disabled ? '#1E2D47' : danger ? 'rgba(239,68,68,.3)' : 'rgba(255,255,255,.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, transition: 'all .18s',
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button
        onClick={isConnected ? onDisconnect : onConnect}
        disabled={busy}
        style={{
          width: 68, height: 68, borderRadius: '50%',
          background: isConnected
            ? 'rgba(239,68,68,.14)'
            : isConnecting
            ? 'rgba(245,184,26,.12)'
            : 'linear-gradient(135deg, #4A90F5 0%, #7B4FE5 100%)',
          border: `2px solid ${isConnected ? 'rgba(239,68,68,.45)' : isConnecting ? 'rgba(245,184,26,.45)' : 'rgba(74,144,245,.55)'}`,
          boxShadow: isConnected
            ? '0 0 20px rgba(239,68,68,.2), 0 0 0 8px rgba(239,68,68,.05)'
            : isConnecting
            ? '0 0 16px rgba(245,184,26,.2)'
            : '0 0 28px rgba(74,144,245,.45), 0 0 0 12px rgba(74,144,245,.08)',
          cursor: busy ? 'not-allowed' : 'pointer',
          fontSize: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .35s',
          animation: !isConnected && !busy ? 'micGlow 3s ease-in-out infinite' : 'none',
        }}
      >
        {isConnecting ? '⌛' : isEnding ? '⏏️' : isConnected ? '📵' : '🎤'}
      </button>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
        color: isConnected ? '#EF4444' : isConnecting ? '#F5B81A' : '#8596AD',
      }}>
        {isConnecting ? 'Connecting…' : isEnding ? 'Ending…' : isConnected ? 'Tap to End' : 'Tap to Speak'}
      </span>
      <style>{`
        @keyframes micGlow {
          0%,100%{box-shadow:0 0 28px rgba(74,144,245,.45),0 0 0 12px rgba(74,144,245,.08)}
          50%{box-shadow:0 0 40px rgba(74,144,245,.65),0 0 0 18px rgba(74,144,245,.12)}
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
      height: 92, flexShrink: 0,
      background: '#060D1C',
      borderTop: '1px solid #1A2840',
      display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
      padding: '0 24px',
    }}>
      {/* Mute */}
      <DockButton
        icon={isMuted ? '🔇' : '🔈'}
        label={isMuted ? 'Unmute' : 'Mute'}
        onClick={onToggleMute}
        disabled={!isConnected}
      />

      {/* Share Screen (placeholder) */}
      <DockButton
        icon="🖥️"
        label="Share Screen"
        disabled
      />

      {/* Main mic button — center */}
      <MainMicButton
        status={status}
        isConnected={isConnected}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />

      {/* Open Whiteboard */}
      <DockButton
        icon="📐"
        label="Open Whiteboard"
        onClick={onOpenWhiteboard}
      />

      {/* Need Help */}
      <DockButton
        icon="❓"
        label="Need Help?"
        onClick={onNeedHelp}
      />
    </div>
  );
}
