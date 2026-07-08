import { CT, panelStyle, labelStyle, QUICK_COMMANDS } from './theme';

/** Left rail: one-tap voice command chips (visual only in test mode). */
export default function QuickVoiceCommandsPanel() {
  return (
    <section style={{ ...panelStyle, padding: 16 }}>
      <div style={{ ...labelStyle, marginBottom: 12 }}>Quick Voice Commands</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {QUICK_COMMANDS.map((c) => (
          <button
            key={c.label}
            type="button"
            className="ct-chip"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, fontWeight: 600, color: CT.fm,
              background: CT.panelAlt, border: `1px solid ${CT.border}`,
              borderRadius: 999, padding: '6px 12px', cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            <span aria-hidden>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 10, color: CT.fd, marginTop: 10, lineHeight: 1.5 }}>
        Say any command out loud — Professor Didier™ responds instantly.
      </p>
    </section>
  );
}
