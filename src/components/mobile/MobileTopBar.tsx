import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

interface Props {
  /** Optional page title; when omitted the logo is shown. */
  title?: string;
  /** Talent Score / progress chip value (0-100). */
  score?: number;
  /** Back button target; when set, a back chevron replaces the logo. */
  back?: string;
}

/** Compact, safe-area-aware top bar for the student mobile shell. */
export default function MobileTopBar({ title, score, back }: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <header
      className="app-tap safe-top"
      style={{
        position: 'sticky', top: 0, zIndex: 80,
        background: 'rgba(2,8,23,.86)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
      }}
    >
      <div style={{ height: 'var(--mobile-topbar-h)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
        {back ? (
          <button onClick={() => navigate(back)} className="tap-target app-tap" style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label={t('common.back')}>‹</button>
        ) : (
          <div onClick={() => navigate('/portal')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Logo variant="full" style={{ height: 30, width: 'auto' }} />
          </div>
        )}

        {title && <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>{title}</div>}

        {typeof score === 'number' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,184,26,.14)', border: '1px solid rgba(245,184,26,.32)', borderRadius: 99, padding: '5px 11px' }}>
            <span style={{ fontSize: 12 }}>⭐</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: '#F5B81A' }}>{score}</span>
          </div>
        )}
      </div>
    </header>
  );
}
