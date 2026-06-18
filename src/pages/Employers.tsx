import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

export default function Employers() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const BENEFITS = [
    { icon:'📊', titleKey:'employers.b0_title', descKey:'employers.b0_desc' },
    { icon:'✅', titleKey:'employers.b1_title', descKey:'employers.b1_desc' },
    { icon:'🎯', titleKey:'employers.b2_title', descKey:'employers.b2_desc' },
    { icon:'🤖', titleKey:'employers.b3_title', descKey:'employers.b3_desc' },
    { icon:'🌍', titleKey:'employers.b4_title', descKey:'employers.b4_desc' },
    { icon:'⚡', titleKey:'employers.b5_title', descKey:'employers.b5_desc' },
  ];

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ paddingTop: 70 }}>
        <section style={{ padding: '5rem 0 3rem', background: 'linear-gradient(160deg,#0a1628 0%,#0d1f3c 60%,#0a1220 100%)', borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'inline-flex', fontSize: 11, fontWeight: 600, padding: '.28rem .75rem', borderRadius: 999, background: DS.od, border: `1px solid ${DS.ob}`, color: DS.orange, marginBottom: '1rem' }}>{t('employers.badge')}</div>
            <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.5px', marginBottom: '1rem' }}>
              {t('employers.h1a')}<br /><span style={{ color: DS.orange }}>{t('employers.h1b')}</span>
            </h1>
            <p style={{ fontSize: '1rem', color: DS.fm, maxWidth: 560, lineHeight: 1.72, marginBottom: '2rem' }}>{t('employers.sub')}</p>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <a href="mailto:partners@aladiahacademy.com" style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.orange, color: '#fff', border: 'none', cursor: 'pointer', textDecoration: 'none' }}>{t('employers.partner_btn')}</a>
              <button onClick={() => navigate('/talent-network')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>{t('employers.browse_btn')}</button>
            </div>
          </div>
        </section>

        <section style={{ padding: '5rem 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ marginBottom: '2.75rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>{t('employers.why_label')}</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800 }}>{t('employers.why_h2a')}<span style={{ color: DS.orange }}>{t('employers.why_h2_hl')}</span>{t('employers.why_h2b')}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {BENEFITS.map(b => (
                <div key={b.titleKey} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.75rem' }}>
                  <div style={{ fontSize: 24, marginBottom: '.75rem' }}>{b.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: DS.fg, marginBottom: '.5rem' }}>{t(b.titleKey)}</h4>
                  <p style={{ fontSize: 12, color: DS.fm, lineHeight: 1.6 }}>{t(b.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ background: DS.card, borderTop: `1px solid ${DS.border}`, padding: '4.5rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 2rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.4rem)', fontWeight: 800, marginBottom: '.75rem' }}>{t('employers.cta_h2a')}<br /><span style={{ color: DS.orange }}>{t('employers.cta_h2b')}</span></h2>
            <p style={{ fontSize: 14, color: DS.fm, marginBottom: '2rem', lineHeight: 1.7 }}>{t('employers.cta_sub')}</p>
            <a href="mailto:partners@aladiahacademy.com" style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.orange, color: '#fff', textDecoration: 'none' }}>{t('employers.cta_btn')}</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
