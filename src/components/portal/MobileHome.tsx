import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/mobile/MobileShell';

interface Props {
  name: string;
  score: number;                                   // Talent Score / progress 0-100
  course: { id: string; title: string; pct: number; module?: string; lesson?: string } | null;
}

const C = {
  fg: '#EDF2F7', fm: '#8596AD', fd: '#3A4A66',
  blue: '#4A90F5', purple: '#A78BFA', green: '#22C98A', gold: '#F5B81A', orange: '#F0622A',
  card: 'rgba(8,20,52,.7)', border: 'rgba(255,255,255,.08)',
};

// Career transformation journey (the spine of Aladiah).
const JOURNEY = [
  { icon: '📚', label: 'Learning' },
  { icon: '🎮', label: 'Simulation' },
  { icon: '🏅', label: 'Certification' },
  { icon: '🗂️', label: 'Portfolio' },
  { icon: '🎤', label: 'Interview' },
  { icon: '💼', label: 'Employment' },
];

export default function MobileHome({ name, score, course }: Props) {
  const navigate = useNavigate();
  const [mission, setMission] = useState([
    { id: 'lesson', label: 'Complete a lesson', done: false },
    { id: 'quiz', label: 'Pass a quiz', done: false },
    { id: 'sim', label: 'Finish a simulation', done: false },
  ]);

  const pct = course?.pct ?? 0;
  const activeStage = pct >= 100 ? 2 : 0; // Learning until course complete
  const continueTo = () => navigate(course ? `/portal/course/${course.id}` : '/portal/courses');

  return (
    <MobileShell score={score}>
      <div style={{ padding: '18px 16px 8px', maxWidth: 620, margin: '0 auto' }}>

        {/* Welcome */}
        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-.5px' }}>
          Welcome, {name} <span style={{ fontSize: 20 }}>👋</span>
        </div>
        <div style={{ fontSize: 12.5, color: C.fm, marginTop: 2, marginBottom: 16 }}>Let’s move your career forward today.</div>

        {/* ── Section 1 · Continue Learning ─────────────────────── */}
        <div style={{ background: 'linear-gradient(150deg,rgba(37,99,235,.28),rgba(124,58,237,.22))', border: '1px solid rgba(99,102,241,.3)', borderRadius: 20, padding: 18, marginBottom: 16, boxShadow: '0 10px 36px rgba(37,99,235,.16)' }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: 8 }}>Continue Learning</div>
          {course ? (
            <>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>{course.title}</div>
              <div style={{ fontSize: 12, color: '#c7d2fe', marginTop: 4 }}>
                {course.module || 'Module 1'} · {course.lesson || 'Next lesson'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 4px' }}>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,.12)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.max(4, pct)}%`, background: 'linear-gradient(90deg,#22C98A,#4A90F5)', borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff' }}>{pct}%</span>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Pick your program and start learning.</div>
          )}
          <button onClick={continueTo} className="app-tap tap-target" style={{ marginTop: 14, width: '100%', height: 52, border: 'none', borderRadius: 14, background: 'linear-gradient(90deg,#2563eb,#4A90F5)', color: '#fff', fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(37,99,235,.45)' }}>
            {course ? 'Continue →' : 'Start learning →'}
          </button>
        </div>

        {/* ── Section 2 · Today's Mission ───────────────────────── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Today’s Mission</div>
            <span style={{ fontSize: 11, fontWeight: 800, color: C.gold, background: 'rgba(245,184,26,.13)', border: '1px solid rgba(245,184,26,.3)', borderRadius: 99, padding: '4px 10px' }}>Reward +50 ⭐</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mission.map(m => (
              <button key={m.id} onClick={() => setMission(prev => prev.map(x => x.id === m.id ? { ...x, done: !x.done } : x))}
                className="app-tap" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px', borderRadius: 12, background: m.done ? 'rgba(34,201,138,.1)' : 'rgba(255,255,255,.03)', border: `1px solid ${m.done ? 'rgba(34,201,138,.35)' : 'rgba(255,255,255,.06)'}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', background: m.done ? C.green : 'transparent', border: m.done ? 'none' : '2px solid rgba(255,255,255,.2)' }}>{m.done ? '✓' : ''}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: m.done ? C.fm : C.fg, textDecoration: m.done ? 'line-through' : 'none' }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Section 3 · Career Progress ───────────────────────── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Career Progress</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {JOURNEY.map((s, i) => {
              const state = i < activeStage ? 'done' : i === activeStage ? 'active' : 'todo';
              const color = state === 'done' ? C.green : state === 'active' ? C.blue : C.fd;
              return (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: `${color}1f`, border: `1.5px solid ${color}`, boxShadow: state === 'active' ? `0 0 14px ${color}66` : 'none' }}>{s.icon}</div>
                    {i < JOURNEY.length - 1 && <div style={{ width: 2, height: 18, background: i < activeStage ? C.green : 'rgba(255,255,255,.1)' }} />}
                  </div>
                  <div style={{ paddingBottom: i < JOURNEY.length - 1 ? 18 : 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: state === 'todo' ? 500 : 800, color: state === 'todo' ? C.fm : C.fg }}>{s.label}</div>
                    {state === 'active' && <div style={{ fontSize: 10.5, color: C.blue, fontWeight: 700 }}>You are here</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </MobileShell>
  );
}
