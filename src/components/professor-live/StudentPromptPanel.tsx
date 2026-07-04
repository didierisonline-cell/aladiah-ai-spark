import { useState } from 'react';

interface StudentPromptPanelProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  notes: string;
  onNotesChange: (v: string) => void;
}

export default function StudentPromptPanel({
  prompts, onSelectPrompt, notes, onNotesChange,
}: StudentPromptPanelProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', minHeight: 0, height: '100%',
      background: '#07101E',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* YOU CAN SAY */}
      <div style={{
        padding: '10px 14px 8px',
        borderBottom: '1px solid rgba(255,255,255,.05)',
        flexShrink: 0,
      }}>
        <div style={sectionLabel}>You Can Say</div>
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onSelectPrompt(p)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '6px 10px',
              background: hovered === i ? 'rgba(74,144,245,.07)' : 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,.04)',
              color: hovered === i ? '#C8D8EC' : '#5A7090',
              fontSize: 10.5, textAlign: 'left', cursor: 'pointer',
              transition: 'all .16s', lineHeight: 1.4,
            }}
          >
            <span style={{ flex: 1 }}>{p}</span>
            <span style={{
              color: hovered === i ? 'rgba(74,144,245,.7)' : '#1E2D47',
              fontSize: 13, marginLeft: 8, transition: 'color .16s',
            }}>›</span>
          </button>
        ))}
      </div>

      {/* STUDENT NOTES */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '10px 14px 10px',
        minHeight: 0,
      }}>
        <div style={sectionLabel}>Student Notes</div>
        <textarea
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder={"Add your notes here...\nProfessor Didier will remember what you discuss."}
          style={{
            flex: 1, width: '100%',
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.07)',
            borderRadius: 6, padding: '8px 10px',
            color: '#C8D8EC', fontSize: 10.5, lineHeight: 1.6,
            resize: 'none', outline: 'none',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            transition: 'border-color .18s',
            minHeight: 0,
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,144,245,.3)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)')}
        />
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {['B', 'I', 'U', '—', '•'].map(f => (
            <button key={f} style={{
              width: 24, height: 24, borderRadius: 4,
              background: 'rgba(255,255,255,.03)',
              border: '1px solid rgba(255,255,255,.07)',
              color: '#3A4E6A', fontSize: 10, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: 9, fontWeight: 800, letterSpacing: '.12em',
  textTransform: 'uppercase', color: '#1E2D47', marginBottom: 8,
};
