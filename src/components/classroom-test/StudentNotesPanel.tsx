import { useState } from 'react';
import { CT, panelStyle, labelStyle } from './theme';

/** Right rail: student scratchpad. Local state only — nothing is persisted (test mode). */
export default function StudentNotesPanel() {
  const [notes, setNotes] = useState('');
  return (
    <section style={{ ...panelStyle, padding: 16, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={labelStyle}>My Notes</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: CT.fd }}>{notes.length} chars</span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Capture key ideas while Professor Didier™ teaches…"
        rows={5}
        style={{
          width: '100%', resize: 'vertical', minHeight: 96,
          fontSize: 12.5, lineHeight: 1.6, color: CT.fg,
          background: 'rgba(9,14,26,.6)', border: `1px solid ${CT.border}`,
          borderRadius: 10, padding: '10px 12px', outline: 'none',
          fontFamily: 'inherit',
        }}
      />
      <div style={{ fontSize: 9.5, color: CT.fd, marginTop: 8 }}>
        ✓ Test mode — notes live in this tab only and are not saved.
      </div>
    </section>
  );
}
