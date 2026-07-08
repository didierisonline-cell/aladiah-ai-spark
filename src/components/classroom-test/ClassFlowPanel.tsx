import { CT, panelStyle, labelStyle, CLASS_FLOW, TEST_SESSION } from './theme';

/** Left rail: ordered lesson flow with the live lesson highlighted + progress. */
export default function ClassFlowPanel() {
  return (
    <section style={{ ...panelStyle, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={labelStyle}>Class Flow</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: CT.fm }}>{TEST_SESSION.module}</span>
      </div>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {CLASS_FLOW.map((title, i) => {
          const active = i === 0;
          return (
            <li
              key={title}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 11px', borderRadius: 10,
                background: active ? 'rgba(74,144,245,.10)' : 'transparent',
                border: `1px solid ${active ? CT.borderGlow : 'transparent'}`,
                boxShadow: active ? `0 0 18px ${CT.glowBlue}` : 'none',
              }}
            >
              <span
                style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800,
                  background: active ? CT.blue : CT.panelAlt,
                  color: active ? '#fff' : CT.fd,
                  border: active ? 'none' : `1px solid ${CT.border}`,
                }}
              >
                {active ? '▶' : i + 1}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? CT.fg : CT.fm, flex: 1 }}>
                {title}
              </span>
              {active && (
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.06em', color: CT.green }}>NOW</span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Progress */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: CT.fd }}>Module progress</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: CT.blue }}>{TEST_SESSION.progress}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: CT.panelAlt, border: `1px solid ${CT.border}`, overflow: 'hidden' }}>
          <div
            style={{
              width: `${TEST_SESSION.progress}%`, height: '100%',
              background: `linear-gradient(90deg, ${CT.blue}, ${CT.purple})`,
              boxShadow: `0 0 10px ${CT.borderGlow}`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
