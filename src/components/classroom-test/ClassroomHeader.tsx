import { CT, TEST_SESSION } from './theme';

/** Top bar: Aladiah brand · Professor Didier™ Live status · course selector · mode · timer. */
export default function ClassroomHeader({ elapsed }: { elapsed: string }) {
  const selectStyle: React.CSSProperties = {
    background: CT.panelAlt,
    border: `1px solid ${CT.border}`,
    borderRadius: 10,
    color: CT.fg,
    fontSize: 12,
    fontWeight: 600,
    padding: '8px 12px',
    outline: 'none',
    cursor: 'pointer',
  };
  return (
    <header
      style={{
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        padding: '14px 22px',
        background: 'rgba(9,14,26,.85)',
        borderBottom: `1px solid ${CT.border}`,
        backdropFilter: 'blur(14px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '.02em', color: CT.fg }}>ALADIAH</span>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.28em', color: CT.gold }}>ACADEMY</span>
      </div>

      <div style={{ width: 1, height: 26, background: CT.border }} className="ct-hide-mobile" />

      {/* Live status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: CT.fg }}>
          Professor Didier<span style={{ fontSize: 9, verticalAlign: 'super' }}>™</span> Live
        </span>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 10, fontWeight: 800, letterSpacing: '.1em',
            color: CT.green, background: 'rgba(34,201,138,.12)',
            border: '1px solid rgba(34,201,138,.35)', borderRadius: 999, padding: '3px 10px',
          }}
        >
          <span className="ct-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: CT.green }} />
          LIVE
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Course selector */}
      <select style={selectStyle} defaultValue={TEST_SESSION.program} aria-label="Course">
        <option>{TEST_SESSION.program}</option>
        <option disabled>AI Enterprise Project Manager (coming soon)</option>
        <option disabled>AI Data Analyst (coming soon)</option>
      </select>

      {/* Professor mode */}
      <select style={selectStyle} defaultValue={TEST_SESSION.professorMode} aria-label="Professor Mode">
        <option>Teaching Mode</option>
        <option>Socratic Mode</option>
        <option>Exam Prep Mode</option>
        <option>Story Mode</option>
      </select>

      {/* Session timer */}
      <span
        style={{
          fontSize: 12, fontWeight: 700, color: CT.fm, fontVariantNumeric: 'tabular-nums',
          background: CT.panelAlt, border: `1px solid ${CT.border}`, borderRadius: 10, padding: '8px 12px',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{ color: CT.blue }}>⏱</span> {elapsed}
      </span>
    </header>
  );
}
