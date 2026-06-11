import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/mobile/MobileShell';

const C = { fg: '#EDF2F7', fm: '#8596AD', blue: '#4A90F5', purple: '#A78BFA', card: 'rgba(8,20,52,.7)', border: 'rgba(255,255,255,.08)' };

// Modes that route to a working tool today; "soon" = full conversational mentor (next phase).
const MODES = [
  { icon: '🎤', label: 'Practice Interview', sub: 'Mock interviews with feedback', to: '/interview' },
  { icon: '📄', label: 'Resume Review', sub: 'Optimize your CV', to: '/portal/career' },
  { icon: '🧭', label: 'Career Coaching', sub: 'Plan your path to placement', to: '/portal/my-career-path' },
  { icon: '🎮', label: 'Simulation Coaching', sub: 'Get better at scenarios', to: '/portal/simulations' },
  { icon: '💬', label: 'Chat', sub: 'Ask Prof. Didier anything', soon: true },
  { icon: '🗣️', label: 'Voice', sub: 'Talk it through', soon: true },
  { icon: '🎥', label: 'Video', sub: 'Face-to-face coaching', soon: true },
  { icon: '🧠', label: 'Student Psychology', sub: 'Motivation & mindset', soon: true },
];

export default function MentorHub() {
  const navigate = useNavigate();
  return (
    <MobileShell title="AI Mentor">
      <div style={{ padding: '18px 16px 8px', maxWidth: 620, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(150deg,rgba(37,99,235,.26),rgba(124,58,237,.22))', border: '1px solid rgba(99,102,241,.3)', borderRadius: 20, padding: 18, marginBottom: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0, background: 'rgba(15,35,80,.85)', border: '2px solid rgba(59,130,246,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#60a5fa' }}>AI</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Prof. Didier</div>
            <div style={{ fontSize: 12, color: '#c7d2fe', marginTop: 2 }}>Your AI mentor — one tap away, every step of the way.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {MODES.map(m => (
            <button key={m.label} disabled={m.soon} onClick={() => m.to && navigate(m.to)}
              className="app-tap" style={{ textAlign: 'left', background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, cursor: m.soon ? 'default' : 'pointer', opacity: m.soon ? 0.6 : 1, fontFamily: 'inherit', position: 'relative' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: C.fg }}>{m.label}</div>
              <div style={{ fontSize: 11, color: C.fm, marginTop: 2, lineHeight: 1.4 }}>{m.sub}</div>
              {m.soon && <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, fontWeight: 800, color: C.purple, background: 'rgba(167,139,250,.15)', border: '1px solid rgba(167,139,250,.3)', borderRadius: 99, padding: '2px 7px' }}>SOON</span>}
            </button>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
