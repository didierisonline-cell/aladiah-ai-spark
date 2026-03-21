import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROFESSORS, Professor } from '@/data/professors';

interface Props {
  selectedId: string;
  onSelect: (professorId: string) => void;
}

export default function ProfessorSelector({ selectedId, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const selected = PROFESSORS.find(p => p.id === selectedId) || PROFESSORS[0];

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
        🌍 Choose Your Professor
      </p>

      {/* Professor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '12px' }}>
        {PROFESSORS.map(prof => {
          const isActive = prof.id === selectedId;
          const isHovered = hovered === prof.id;
          return (
            <motion.button
              key={prof.id}
              onClick={() => onSelect(prof.id)}
              onMouseEnter={() => setHovered(prof.id)}
              onMouseLeave={() => setHovered(null)}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '14px 10px', borderRadius: '14px', cursor: 'pointer',
                border: isActive ? `1.5px solid \${prof.accentColor}` : '1.5px solid rgba(255,255,255,0.08)',
                background: isActive ? prof.bgColor : isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease', outline: 'none', position: 'relative',
                boxShadow: isActive ? `0 0 20px \${prof.accentColor}33` : 'none',
              }}
            >
              {/* Flag Badge */}
              <div style={{ position: 'absolute', top: 8, right: 8, fontSize: '14px' }}>{prof.flag}</div>

              {/* Avatar Circle */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: `linear-gradient(135deg, \${prof.accentColor}44, \${prof.accentColor}22)`,
                border: `2px solid \${isActive ? prof.accentColor : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', marginBottom: '8px', flexShrink: 0,
                overflow: 'hidden',
              }}>
                {prof.emoji || '🎓'}
              </div>

              {/* Name */}
              <p style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : 'rgba(255,255,255,0.6)', margin: 0, textAlign: 'center', lineHeight: 1.3 }}>
                {prof.name}
              </p>

              {/* Origin */}
              <p style={{ fontSize: '9px', color: isActive ? prof.accentColor : 'rgba(255,255,255,0.3)', margin: '2px 0 0', textAlign: 'center' }}>
                {prof.country}
              </p>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ width: '6px', height: '6px', borderRadius: '50%', background: prof.accentColor, marginTop: '6px' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Professor Preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          style={{
            padding: '14px 16px', borderRadius: '12px',
            background: selected.bgColor,
            border: `1px solid \${selected.borderColor}`,
            display: 'flex', alignItems: 'flex-start', gap: '12px',
          }}
        >
          {/* Avatar */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, \${selected.accentColor}, \${selected.accentColor}88)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', border: `2px solid \${selected.accentColor}`,
          }}>
            {selected.emoji || '🎓'}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>{selected.fullName}</p>
              <span style={{ fontSize: '14px' }}>{selected.flag}</span>
            </div>
            <p style={{ fontSize: '11px', color: selected.accentColor, margin: '0 0 4px', fontWeight: 500 }}>
              {selected.origin} · {selected.language}
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' }}>
              {selected.specialty}
            </p>
            {/* Catchphrase */}
            <div style={{
              padding: '8px 10px', borderRadius: '8px',
              background: 'rgba(0,0,0,0.2)', borderLeft: `3px solid \${selected.accentColor}`,
            }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                "{selected.catchphrase}"
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
