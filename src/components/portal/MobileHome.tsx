import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/mobile/MobileShell';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  name: string;
  score: number;
  course: { id: string; title: string; pct: number; module?: string; lesson?: string } | null;
}

const C = {
  fg: '#EDF2F7', fm: '#8596AD', fd: '#3A4A66',
  blue: '#4A90F5', purple: '#A78BFA', green: '#22C98A', gold: '#F5B81A', orange: '#F0622A',
  card: 'rgba(8,20,52,.7)', border: 'rgba(255,255,255,.08)',
};

const JOURNEY_ICONS = ['📚', '🎮', '🏅', '🗂️', '🎤', '💼'];
const JOURNEY_KEYS = ['mobile.home.stage0','mobile.home.stage1','mobile.home.stage2','mobile.home.stage3','mobile.home.stage4','mobile.home.stage5'];

const MISSION_IDS = ['lesson', 'quiz', 'sim'];
const MISSION_KEYS = ['mobile.home.mission0', 'mobile.home.mission1', 'mobile.home.mission2'];

export default function MobileHome({ name, score, course }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [checked, setChecked] = useState([false, false, false]);

  const pct = course?.pct ?? 0;
  const activeStage = pct >= 100 ? 2 : 0;
  const continueTo = () => navigate(course ? `/portal/course/${course.id}` : '/portal/courses');

  return (
    <MobileShell score={score}>
      <div style={{ padding: '18px 16px 8px', maxWidth: 620, margin: '0 auto' }}>

        {/* Welcome */}
        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-.5px' }}>
          {t('mobile.home.welcome')}{name} <span style={{ fontSize: 20 }}>👋</span>
        </div>
        <div style={{ fontSize: 12.5, color: C.fm, marginTop: 2, marginBottom: 16 }}>{t('mobile.home.tagline')}</div>

        {/* ── Section 1 · Continue Learning ─────────────────────── */}
        <div style={{ background: 'linear-gradient(150deg,rgba(37,99,235,.28),rgba(124,58,237,.22))', border: '1px solid rgba(99,102,241,.3)', borderRadius: 20, padding: 18, marginBottom: 16, boxShadow: '0 10px 36px rgba(37,99,235,.16)' }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: 8 }}>{t('mobile.home.continue_label')}</div>
          {course ? (
            <>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>{course.title}</div>
              <div style={{ fontSize: 12, color: '#c7d2fe', marginTop: 4 }}>
                {course.module || t('mobile.home.default_module')} · {course.lesson || t('mobile.home.default_lesson')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 4px' }}>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,.12)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.max(4, pct)}%`, background: 'linear-gradient(90deg,#22C98A,#4A90F5)', borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff' }}>{pct}%</span>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t('mobile.home.pick_program')}</div>
          )}
          <button onClick={continueTo} className="app-tap tap-target" style={{ marginTop: 14, width: '100%', height: 52, border: 'none', borderRadius: 14, background: 'linear-gradient(90deg,#2563eb,#4A90F5)', color: '#fff', fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(37,99,235,.45)' }}>
            {course ? t('mobile.home.continue_btn') : t('mobile.home.start_btn')}
          </button>
        </div>

        {/* ── Section 2 · Today's Mission ───────────────────────── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{t('mobile.home.mission_title')}</div>
            <span style={{ fontSize: 11, fontWeight: 800, color: C.gold, background: 'rgba(245,184,26,.13)', border: '1px solid rgba(245,184,26,.3)', borderRadius: 99, padding: '4px 10px' }}>{t('mobile.home.mission_reward')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MISSION_IDS.map((id, i) => (
              <button key={id} onClick={() => setChecked(prev => prev.map((v, j) => j === i ? !v : v))}
                className="app-tap" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px', borderRadius: 12, background: checked[i] ? 'rgba(34,201,138,.1)' : 'rgba(255,255,255,.03)', border: `1px solid ${checked[i] ? 'rgba(34,201,138,.35)' : 'rgba(255,255,255,.06)'}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', background: checked[i] ? C.green : 'transparent', border: checked[i] ? 'none' : '2px solid rgba(255,255,255,.2)' }}>{checked[i] ? '✓' : ''}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: checked[i] ? C.fm : C.fg, textDecoration: checked[i] ? 'line-through' : 'none' }}>{t(MISSION_KEYS[i])}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Section 3 · Career Progress ───────────────────────── */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 14 }}>{t('mobile.home.career_title')}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {JOURNEY_KEYS.map((key, i) => {
              const state = i < activeStage ? 'done' : i === activeStage ? 'active' : 'todo';
              const color = state === 'done' ? C.green : state === 'active' ? C.blue : C.fd;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: `${color}1f`, border: `1.5px solid ${color}`, boxShadow: state === 'active' ? `0 0 14px ${color}66` : 'none' }}>{JOURNEY_ICONS[i]}</div>
                    {i < JOURNEY_KEYS.length - 1 && <div style={{ width: 2, height: 18, background: i < activeStage ? C.green : 'rgba(255,255,255,.1)' }} />}
                  </div>
                  <div style={{ paddingBottom: i < JOURNEY_KEYS.length - 1 ? 18 : 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: state === 'todo' ? 500 : 800, color: state === 'todo' ? C.fm : C.fg }}>{t(key)}</div>
                    {state === 'active' && <div style={{ fontSize: 10.5, color: C.blue, fontWeight: 700 }}>{t('mobile.home.you_are_here')}</div>}
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
