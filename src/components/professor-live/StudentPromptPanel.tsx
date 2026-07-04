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
      overflow: 'hidden', minHeight: 0,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* YOU CAN SAY */}
      <div style={{
        padding: '10px 12px 8px',
        borderBottom: '1px solid #1A2840',
        background: '#07101E',
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
              width: '100%', padding: '7px 10px',
              background: hovered === i ? 'rgba(74,144,245,.08)' : '#0D1A2E',
              border: `1px solid ${hovered === i ? 'rgba(74,144,245,.28)' : '#1A2840'}`,
              borderRadius: 7, marginBottom: 5,
              color: hovered === i ? '#EDF2F7' : '#8596AD',
              fontSize: 10.5, textAlign: 'left', cursor: 'pointer',
              transition: 'all .18s', lineHeight: 1.35,
            }}
          >
            <span style={{ flex: 1 }}>{p}</span>
            <span style={{ color: '#2A3D5A', fontSize: 12, marginLeft: 6 }}>›</span>
          </button>
        ))}
      </div>

      {/* STUDENT NOTES */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '10px 12px 10px',
        background: '#07101E',
        minHeight: 0,
      }}>
        <div style={sectionLabel}>Student Notes</div>
        <textarea
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder={"Add your notes here...\nProfessor Didier will remember what you discuss."}
          style={{
            flex: 1, width: '100%',
            background: '#0D1A2E', border: '1px solid #1A2840',
            borderRadius: 7, padding: '8px 10px',
            color: '#EDF2F7', fontSize: 10.5, lineHeight: 1.55,
            resize: 'none', outline: 'none',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            transition: 'border-color .18s',
            minHeight: 0,
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,144,245,.35)')}
          onBlur={e => (e.currentTarget.style.borderColor = '#1A2840')}
        />
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {['B', 'I', 'U', '—', '•'].map(f => (
            <button key={f} style={{
              width: 24, height: 24, borderRadius: 5,
              background: '#0D1A2E', border: '1px solid #1A2840',
              color: '#4A5E7A', fontSize: 10, fontWeight: 700, cursor: 'pointer',
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
  textTransform: 'uppercase', color: '#2A3D5A', marginBottom: 8,
};
