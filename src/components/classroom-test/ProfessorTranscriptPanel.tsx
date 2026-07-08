import { CT, panelStyle, labelStyle, TRANSCRIPT_LINES } from './theme';

/** Right rail: live transcript of what Professor Didier™ is saying. */
export default function ProfessorTranscriptPanel() {
  return (
    <section style={{ ...panelStyle, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={labelStyle}>Live Transcript</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9.5, fontWeight: 800, color: CT.green }}>
          <span className="ct-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: CT.green }} />
          CAPTURING
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TRANSCRIPT_LINES.map((line, i) => {
          const latest = i === TRANSCRIPT_LINES.length - 1;
          return (
            <div
              key={i}
              style={{
                fontSize: 12.5, lineHeight: 1.55,
                color: latest ? CT.fg : CT.fm,
                background: latest ? 'rgba(74,144,245,.08)' : 'transparent',
                border: `1px solid ${latest ? CT.borderGlow : 'transparent'}`,
                borderRadius: 10,
                padding: latest ? '8px 11px' : '2px 11px',
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 800, color: CT.gold, marginRight: 6 }}>Prof. Didier:</span>
              {line}
              {latest && <span className="ct-cursor" style={{ color: CT.blue, fontWeight: 800 }}>▍</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
