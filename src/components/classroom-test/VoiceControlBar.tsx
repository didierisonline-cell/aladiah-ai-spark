import { useState } from 'react';
import { CT } from './theme';

/**
 * Bottom control bar: mute / share / whiteboard / help around a central glowing
 * microphone. Test mode — buttons toggle local state only; no real microphone
 * permission is ever requested.
 */
export default function VoiceControlBar({ elapsed }: { elapsed: string }) {
  const [muted, setMuted] = useState(false);
  const [micActive, setMicActive] = useState(true);

  const sideBtn = (label: string, icon: string, onClick?: () => void, active?: boolean): React.ReactNode => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      title={label}
      className="ct-tool"
      style={{
        width: 46, height: 46, borderRadius: 14, fontSize: 18,
        background: active ? 'rgba(74,144,245,.14)' : CT.panelAlt,
        border: `1px solid ${active ? CT.borderGlow : CT.border}`,
        color: CT.fg, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s',
      }}
    >
      <span aria-hidden>{icon}</span>
    </button>
  );

  return (
    <footer
      style={{
        position: 'sticky', bottom: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        padding: '12px 22px 14px',
        background: 'rgba(7,11,20,.9)',
        borderTop: `1px solid ${CT.border}`,
        backdropFilter: 'blur(16px)',
        flexWrap: 'wrap',
      }}
    >
      {/* Left controls */}
      <div style={{ display: 'flex', gap: 10 }}>
        {sideBtn(muted ? 'Unmute' : 'Mute', muted ? '🔇' : '🔊', () => setMuted(!muted), !muted)}
        {sideBtn('Share', '📤')}
      </div>

      {/* Central glowing microphone */}
      <div style={{ position: 'relative', margin: '0 10px' }}>
        {micActive && <span className="ct-mic-ring" aria-hidden />}
        {micActive && <span className="ct-mic-ring ct-mic-ring-2" aria-hidden />}
        <button
          type="button"
          onClick={() => setMicActive(!micActive)}
          title={micActive ? 'Pause listening (test mode)' : 'Resume listening (test mode)'}
          style={{
            position: 'relative', zIndex: 1,
            width: 68, height: 68, borderRadius: '50%',
            background: micActive
              ? `linear-gradient(135deg, ${CT.blue}, ${CT.purple})`
              : CT.panelAlt,
            border: micActive ? 'none' : `1px solid ${CT.border}`,
            boxShadow: micActive
              ? `0 0 30px ${CT.glowBlue}, 0 0 55px ${CT.glowPurple}, 0 8px 24px rgba(0,0,0,.45)`
              : '0 4px 14px rgba(0,0,0,.4)',
            color: '#fff', fontSize: 26, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .2s',
          }}
        >
          <span aria-hidden>🎙️</span>
        </button>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', gap: 10 }}>
        {sideBtn('Whiteboard', '🧑‍🏫')}
        {sideBtn('Help', '❓')}
      </div>

      <div style={{ width: 1, height: 34, background: CT.border }} className="ct-hide-mobile" />

      {/* Status cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 700, color: CT.green,
            background: 'rgba(34,201,138,.1)', border: '1px solid rgba(34,201,138,.3)',
            borderRadius: 999, padding: '5px 12px',
          }}
        >
          <span className="ct-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: CT.green }} />
          Online
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: CT.fm, fontVariantNumeric: 'tabular-nums' }}>{elapsed}</span>
      </div>
    </footer>
  );
}
