import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/mobile/MobileShell';
import PortalShell from '@/components/portal/PortalShell';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useLanguage } from '@/contexts/LanguageContext';

const C = { fg: '#EDF2F7', fm: '#8596AD', blue: '#4A90F5', purple: '#A78BFA', card: 'rgba(8,20,52,.7)', border: 'rgba(255,255,255,.08)' };

// Modes that route to a working tool today; "soon" = full conversational mentor (next phase).
// Labels/subs come from t() at render time so the mentor surface is fully localized.
const MODES = [
  { icon: '🎤', labelKey: 'mentor.m_interview', subKey: 'mentor.m_interview_sub', to: '/interview' },
  { icon: '📄', labelKey: 'mentor.m_resume', subKey: 'mentor.m_resume_sub', to: '/portal/career' },
  { icon: '🧭', labelKey: 'mentor.m_career', subKey: 'mentor.m_career_sub', to: '/portal/my-career-path' },
  { icon: '🎮', labelKey: 'mentor.m_sim', subKey: 'mentor.m_sim_sub', to: '/portal/simulations' },
  { icon: '💬', labelKey: 'mentor.m_chat', subKey: 'mentor.m_chat_sub', soon: true },
  { icon: '🗣️', labelKey: 'mentor.m_voice', subKey: 'mentor.m_voice_sub', to: '/portal/prof-didier-live' },
  { icon: '🎥', labelKey: 'mentor.m_video', subKey: 'mentor.m_video_sub', soon: true },
  { icon: '🧠', labelKey: 'mentor.m_psych', subKey: 'mentor.m_psych_sub', soon: true },
];

export default function MentorHub() {
  const navigate = useNavigate();
  const { isPhone } = useBreakpoint();
  const { t } = useLanguage();

  const body = (
      <div style={{ padding: '18px 16px 8px', maxWidth: 620, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(150deg,rgba(37,99,235,.26),rgba(124,58,237,.22))', border: '1px solid rgba(99,102,241,.3)', borderRadius: 20, padding: 18, marginBottom: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0, background: 'rgba(15,35,80,.85)', border: '2px solid rgba(59,130,246,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#60a5fa' }}>AI</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Prof. Didier</div>
            <div style={{ fontSize: 12, color: '#c7d2fe', marginTop: 2 }}>{t('mentor.hero_sub')}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {MODES.map(m => (
            <button key={m.labelKey} disabled={m.soon} onClick={() => m.to && navigate(m.to)}
              className="app-tap" style={{ textAlign: 'left', background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, cursor: m.soon ? 'default' : 'pointer', opacity: m.soon ? 0.6 : 1, fontFamily: 'inherit', position: 'relative' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: C.fg }}>{t(m.labelKey)}</div>
              <div style={{ fontSize: 11, color: C.fm, marginTop: 2, lineHeight: 1.4 }}>{t(m.subKey)}</div>
              {m.soon && <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, fontWeight: 800, color: C.purple, background: 'rgba(167,139,250,.15)', border: '1px solid rgba(167,139,250,.3)', borderRadius: 99, padding: '2px 7px' }}>{t('mentor.soon')}</span>}
            </button>
          ))}
        </div>
      </div>
  );

  // Phone keeps the native mobile shell; desktop/tablet folds into the one
  // PortalShell (Header + sidebar) so the mentor surface matches every other page.
  if (isPhone) return <MobileShell title={t('mentor.title')}>{body}</MobileShell>;
  return <PortalShell>{body}</PortalShell>;
}
