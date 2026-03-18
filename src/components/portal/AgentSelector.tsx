import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AgentKey = 'professor' | 'career' | 'interview' | 'resume' | 'scrum';

const AGENTS = [
  { key: 'professor' as AgentKey, name: 'Prof. Didier', title: 'Founder & Lead Mentor', specialty: 'Agile · Scrum · PM Strategy', initials: 'PD', color: '#085041', bg: '#E1F5EE', border: '#1D9E75' },
  { key: 'career' as AgentKey, name: 'Bettyna', title: 'Career Strategist', specialty: 'Job Search · Salary · LinkedIn', initials: 'CA', color: '#3C3489', bg: '#EEEDFE', border: '#534AB7' },
  { key: 'interview' as AgentKey, name: 'Charly', title: 'Interview Specialist', specialty: 'Mock Interviews · Behavioral', initials: 'IC', color: '#712B13', bg: '#FAECE7', border: '#D85A30' },
  { key: 'resume' as AgentKey, name: 'Juan Carlos', title: 'Resume Specialist', specialty: 'ATS · Impact Bullets', initials: 'RB', color: '#633806', bg: '#FAEEDA', border: '#BA7517' },
  { key: 'scrum' as AgentKey, name: 'Maria', title: 'Scrum Master Coach', specialty: 'Ceremonies · Backlog · SAFe', initials: 'SE', color: '#0C447C', bg: '#E6F1FB', border: '#185FA5' },
];

interface Props {
  activeAgent: AgentKey;
  onSelect: (agent: AgentKey) => void;
}

export default function AgentSelector({ activeAgent, onSelect }: Props) {
  const [hovered, setHovered] = useState<AgentKey | null>(null);
  const active = AGENTS.find(a => a.key === activeAgent)!;

  return (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{ fontSize: '11px', fontWeight: 500, color: 'hsl(var(--muted-foreground))', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
        Choose your professor
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {AGENTS.map(agent => {
          const isActive = agent.key === activeAgent;
          return (
            <motion.button
              key={agent.key}
              onClick={() => onSelect(agent.key)}
              onMouseEnter={() => setHovered(agent.key)}
              onMouseLeave={() => setHovered(null)}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '7px 12px', borderRadius: '999px',
                border: `1.5px solid ${isActive ? agent.border : 'hsl(var(--border))'}`,
                background: isActive ? agent.bg : 'transparent',
                cursor: 'pointer', transition: 'all 0.15s ease', outline: 'none',
              }}
            >
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: isActive ? agent.border : 'hsl(var(--muted))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '8px', fontWeight: 700,
                color: isActive ? '#fff' : 'hsl(var(--muted-foreground))',
                flexShrink: 0,
              }}>
                {agent.initials}
              </div>
              <span style={{
                fontSize: '12px', fontWeight: isActive ? 600 : 400,
                color: isActive ? agent.color : 'hsl(var(--muted-foreground))',
                whiteSpace: 'nowrap',
              }}>
                {agent.name}
              </span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAgent}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          style={{
            marginTop: '10px', padding: '10px 14px', borderRadius: '8px',
            background: active.bg, border: `0.5px solid ${active.border}`,
            display: 'flex', alignItems: 'center', gap: '10px',
          }}
        >
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: active.border, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {active.initials}
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: active.color, margin: 0 }}>
              {active.name} — {active.title}
            </p>
            <p style={{ fontSize: '11px', color: active.color, opacity: 0.7, margin: 0 }}>
              {active.specialty}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
