import { useNavigate } from 'react-router-dom';
import PortalShell from '@/components/portal/PortalShell';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

export default function PortalPortfolio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const TIPS = [
    { icon:'📝', titleKey:'portfolio.tip0_title', descKey:'portfolio.tip0_desc' },
    { icon:'🏢', titleKey:'portfolio.tip1_title', descKey:'portfolio.tip1_desc' },
    { icon:'🏅', titleKey:'portfolio.tip2_title', descKey:'portfolio.tip2_desc' },
  ];

  return (
    <PortalShell background={DS.bg}>
        <main style={{ padding: '2rem', background: DS.bg }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('portfolio.title')}</h1>
            <div style={{ fontSize: 13, color: DS.fm, marginTop: '.2rem' }}>{t('portfolio.sub')}</div>
          </div>
          {/* Empty state */}
          <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '4rem 2rem', textAlign: 'center' as const }}>
            <div style={{ fontSize: 48, marginBottom: '1rem' }}>🗂️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '.5rem' }}>{t('portfolio.empty_h')}</h3>
            <p style={{ fontSize: 13, color: DS.fm, maxWidth: 400, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>{t('portfolio.empty_sub')}</p>
            <button onClick={() => navigate('/portal/courses')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.blue, color: '#fff', border: 'none', cursor: 'pointer' }}>{t('portfolio.empty_btn')}</button>
          </div>
          {/* Portfolio tips */}
          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {TIPS.map(tip => (
              <div key={tip.titleKey} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.25rem' }}>
                <div style={{ fontSize: 22, marginBottom: '.5rem' }}>{tip.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: '.25rem' }}>{t(tip.titleKey)}</div>
                <div style={{ fontSize: 12, color: DS.fm, lineHeight: 1.5 }}>{t(tip.descKey)}</div>
              </div>
            ))}
          </div>
        </main>
    </PortalShell>
  );
}
