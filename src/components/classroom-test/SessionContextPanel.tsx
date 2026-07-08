import { CT, panelStyle, labelStyle, TEST_SESSION } from './theme';

/** Left rail: what is being taught right now (program → module → lesson). */
export default function SessionContextPanel() {
  const rows = [
    { k: 'Program', v: TEST_SESSION.program },
    { k: 'Module', v: TEST_SESSION.module },
    { k: 'Lesson', v: TEST_SESSION.lesson },
  ];
  return (
    <section style={{ ...panelStyle, padding: 16 }}>
      <div style={{ ...labelStyle, marginBottom: 12 }}>Session Context</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((r) => (
          <div key={r.k}>
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: CT.fd, marginBottom: 2 }}>{r.k}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: CT.fg, lineHeight: 1.35 }}>{r.v}</div>
          </div>
        ))}
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: CT.fd, marginBottom: 5 }}>Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 5, borderRadius: 999, background: CT.panelAlt, border: `1px solid ${CT.border}`, overflow: 'hidden' }}>
              <div style={{ width: `${TEST_SESSION.progress}%`, height: '100%', background: `linear-gradient(90deg, ${CT.blue}, ${CT.purple})` }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: CT.blue, fontVariantNumeric: 'tabular-nums' }}>{TEST_SESSION.progress}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
