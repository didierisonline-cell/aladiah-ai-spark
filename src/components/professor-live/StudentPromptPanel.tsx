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
      width: 260, flexShrink: 0,
      background: '#080E1A',
      borderLeft: '1px solid #1E2D47',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* You Can Say */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1E2D47', flex: '0 0 auto' }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A5E7A', marginBottom: 12 }}>
          You Can Say
        </div>
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onSelectPrompt(p)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '9px 12px',
              background: hovered === i ? 'rgba(74,144,245,.08)' : '#111D30',
              border: `1px solid ${hovered === i ? 'rgba(74,144,245,.3)' : '#1E2D47'}`,
              borderRadius: 8, marginBottom: 6,
              color: hovered === i ? '#EDF2F7' : '#8596AD',
              fontSize: 11, textAlign: 'left', cursor: 'pointer',
              transition: 'all .18s', lineHeight: 1.35,
            }}
          >
            <span style={{ flex: 1 }}>{p}</span>
            <span style={{ color: '#4A5E7A', marginLeft: 6, fontSize: 12 }}>›</span>
          </button>
        ))}
      </div>

      {/* Student Notes */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4A5E7A', marginBottom: 10 }}>
          Student Notes
        </div>
        <textarea
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder="Add your notes here..."
          style={{
            flex: 1, width: '100%',
            background: '#111D30', border: '1px solid #1E2D47',
            borderRadius: 8, padding: '10px 12px',
            color: '#EDF2F7', fontSize: 11, lineHeight: 1.55,
            resize: 'none', outline: 'none',
            fontFamily: 'system-ui, sans-serif',
            transition: 'border-color .18s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,144,245,.4)')}
          onBlur={e => (e.currentTarget.style.borderColor = '#1E2D47')}
        />
        <div style={{
          marginTop: 10, padding: '8px 10px',
          background: 'rgba(74,144,245,.06)',
          border: '1px solid rgba(74,144,245,.15)',
          borderRadius: 8,
        }}>
          <span style={{ fontSize: 10, color: '#4A5E7A', lineHeight: 1.4 }}>
            Professor Didier will remember what you discuss in this session.
          </span>
        </div>

        {/* Rich text hint row */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {['B','I','U','—','•'].map(f => (
            <button key={f} style={{
              width: 26, height: 26, borderRadius: 5,
              background: '#111D30', border: '1px solid #1E2D47',
              color: '#4A5E7A', fontSize: 11, fontWeight: 700,
              cursor: 'pointer',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
