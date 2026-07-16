import { useState } from 'react';
import { CT, panelStyle, labelStyle, SUGGESTED_PROMPTS } from './theme';

/** Right rail: tappable prompts the student can ask (visual only in test mode). */
export default function SuggestedPromptsPanel() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section style={{ ...panelStyle, padding: 16 }}>
      <div style={{ ...labelStyle, marginBottom: 12 }}>Ask Professor Didier™</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {SUGGESTED_PROMPTS.map((p, i) => {
          const active = selected === i;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setSelected(active ? null : i)}
              className="ct-chip"
              style={{
                textAlign: 'left', fontSize: 12, fontWeight: 600,
                color: active ? CT.fg : CT.fm,
                background: active ? 'rgba(139,92,246,.12)' : CT.panelAlt,
                border: `1px solid ${active ? 'rgba(139,92,246,.4)' : CT.border}`,
                boxShadow: active ? `0 0 16px ${CT.glowPurple}` : 'none',
                borderRadius: 10, padding: '9px 12px', cursor: 'pointer',
                transition: 'all .15s', lineHeight: 1.4,
              }}
            >
              <span style={{ color: CT.purple, marginRight: 6 }} aria-hidden>💬</span>
              {p}
            </button>
          );
        })}
      </div>
    </section>
  );
}
