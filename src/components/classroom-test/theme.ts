// WO-UX-CLASSROOM-001 — shared tokens for the /classroom-test prototype ONLY.
// Test route, static data, no production wiring. Do not import outside classroom-test.

export const CT = {
  bg: '#070B14',
  panel: '#0D1526',
  panelAlt: '#111D30',
  border: '#1B2A45',
  borderGlow: 'rgba(74,144,245,.35)',
  fg: '#EDF2F7',
  fm: '#8596AD',
  fd: '#4A5E7A',
  blue: '#4A90F5',
  purple: '#8B5CF6',
  gold: '#F5B81A',
  green: '#22C98A',
  red: '#EF4444',
  glowBlue: 'rgba(74,144,245,.18)',
  glowPurple: 'rgba(139,92,246,.16)',
};

export const panelStyle: React.CSSProperties = {
  background: `linear-gradient(180deg, ${CT.panelAlt} 0%, ${CT.panel} 100%)`,
  border: `1px solid ${CT.border}`,
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.03)',
};

export const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: CT.fd,
};

// ── Static test content (WO-UX-CLASSROOM-001) ───────────────────────────────
export const TEST_SESSION = {
  program: 'AI-Powered Scrum Master',
  module: 'Foundations of Scrum',
  lesson: 'What is Scrum?',
  progress: 10,
  professorMode: 'Teaching Mode',
};

export const CLASS_FLOW = [
  'What is Scrum?',
  'Scrum Values',
  'Scrum Roles',
  'Scrum Events',
  'Scrum Artifacts',
];

export const TRANSCRIPT_LINES = [
  "So here's the heart of Scrum.",
  'We work in short cycles called Sprints.',
  'The goal is to deliver value faster, adapt quickly, and improve continuously.',
  'Let me draw this for you.',
];

export const SUGGESTED_PROMPTS = [
  'Explain Sprint Planning in detail',
  'Give me a real-world example',
  'Quiz me on Scrum Roles',
  "What's the difference between Scrum and Agile?",
  'Show me a diagram',
];

export const QUICK_COMMANDS = [
  { icon: '🔁', label: 'Repeat that' },
  { icon: '🐢', label: 'Slow down' },
  { icon: '💡', label: 'Show example' },
  { icon: '⏭️', label: 'Next topic' },
  { icon: '✏️', label: 'Draw it' },
];
