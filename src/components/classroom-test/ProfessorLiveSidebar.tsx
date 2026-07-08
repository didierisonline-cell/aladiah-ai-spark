import professorImg from '@/assets/professor-didier.png';
import { CT, panelStyle } from './theme';
import Waveform from './Waveform';
import ClassFlowPanel from './ClassFlowPanel';
import SessionContextPanel from './SessionContextPanel';
import QuickVoiceCommandsPanel from './QuickVoiceCommandsPanel';

/** Left column: professor identity card + class flow + session context + quick commands. */
export default function ProfessorLiveSidebar() {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
      {/* Professor avatar card */}
      <section style={{ ...panelStyle, padding: 18, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 50% 0%, ${CT.glowPurple}, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            width: 92, height: 92, borderRadius: '50%', margin: '0 auto 10px',
            padding: 3,
            background: `linear-gradient(135deg, ${CT.blue}, ${CT.purple})`,
            boxShadow: `0 0 28px ${CT.glowBlue}, 0 0 48px ${CT.glowPurple}`,
            position: 'relative',
          }}
        >
          <img
            src={professorImg}
            alt="Professor Didier™"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: CT.panel }}
          />
          <span
            className="ct-pulse-dot"
            style={{
              position: 'absolute', bottom: 4, right: 4,
              width: 14, height: 14, borderRadius: '50%',
              background: CT.green, border: `2.5px solid ${CT.panel}`,
            }}
            title="Online"
          />
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: CT.fg }}>
          Professor Didier<span style={{ fontSize: 9, verticalAlign: 'super' }}>™</span>
        </div>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: CT.fm, marginTop: 2 }}>AI Scrum Master Professor</div>

        {/* Speaking indicator */}
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12,
            fontSize: 11, fontWeight: 700, color: CT.green,
            background: 'rgba(34,201,138,.10)', border: '1px solid rgba(34,201,138,.3)',
            borderRadius: 999, padding: '6px 14px',
          }}
        >
          <Waveform bars={5} height={14} />
          Speaking…
        </div>
      </section>

      <ClassFlowPanel />
      <SessionContextPanel />
      <QuickVoiceCommandsPanel />
    </aside>
  );
}
