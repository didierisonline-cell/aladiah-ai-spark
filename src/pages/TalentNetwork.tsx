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

export default function TalentNetwork() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const FEATURES = [
    { icon:'⭐', titleKey:'talent.feat0_title', descKey:'talent.feat0_desc' },
    { icon:'🗂️', titleKey:'talent.feat1_title', descKey:'talent.feat1_desc' },
    { icon:'🏢', titleKey:'talent.feat2_title', descKey:'talent.feat2_desc' },
    { icon:'🌐', titleKey:'talent.feat3_title', descKey:'mvp.talent.feat3_desc' },
    { icon:'📊', titleKey:'talent.feat4_title', descKey:'talent.feat4_desc' },
    { icon:'🤝', titleKey:'talent.feat5_title', descKey:'talent.feat5_desc' },
  ];

  // WO-P0-001: fabricated network stats (150+ partners, 94% placement, $127K,
  // 62 countries) removed — no placement statistics exist yet. Do not restore
  // without verified data per LAUNCH_DECISION_PRINCIPLE.md.

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <section style={{ padding: '5rem 0 3rem', background: 'linear-gradient(160deg,#0a1628 0%,#0d1f3c 60%,#0a1220 100%)', borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'inline-flex', fontSize: 11, fontWeight: 600, padding: '.28rem .75rem', borderRadius: 999, background: DS.grd, border: '1px solid rgba(34,201,138,.28)', color: DS.green, marginBottom: '1rem' }}>{t('mvp.talent.badge')}</div>
            <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.5px', marginBottom: '1rem' }}>
              {t('talent.h1a')}<br /><span style={{ color: DS.green }}>{t('talent.h1b')}</span>
            </h1>
            <p style={{ fontSize: '1rem', color: DS.fm, maxWidth: 560, lineHeight: 1.72, marginBottom: '2rem' }}>{t('mvp.talent.sub')}</p>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button onClick={() => navigate('/pricing')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.green, color: '#0B111E', border: 'none', cursor: 'pointer' }}>{t('talent.join_btn')}</button>
              <button onClick={() => navigate('/employers')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>{t('talent.emp_btn')}</button>
            </div>
          </div>
        </section>

        {/* In-development notice (replaces unverified network stats) */}
        <section style={{ padding: '2rem 0', borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ fontSize: 13, color: DS.fm, background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1rem 1.25rem', lineHeight: 1.7, textAlign: 'center' as const }}>
              {t('mvp.talent.stat_note')}
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '5rem 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ marginBottom: '2.75rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>{t('talent.how_label')}</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800 }}>{t('talent.how_h2a')}<span style={{ color: DS.green }}>{t('talent.how_h2_hl')}</span>{t('talent.how_h2b')}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {FEATURES.map(f => (
                <div key={f.titleKey} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.75rem' }}>
                  <div style={{ fontSize: 24, marginBottom: '.75rem' }}>{f.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: DS.fg, marginBottom: '.5rem' }}>{t(f.titleKey)}</h4>
                  <p style={{ fontSize: 12, color: DS.fm, lineHeight: 1.6 }}>{t(f.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Employers CTA */}
        <div style={{ background: DS.card, borderTop: `1px solid ${DS.border}`, padding: '4.5rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.4rem)', fontWeight: 800, marginBottom: '.75rem' }}>{t('talent.hire_h2a')}<br /><span style={{ color: DS.green }}>{t('talent.hire_h2b')}</span></h2>
            <p style={{ fontSize: 14, color: DS.fm, maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7 }}>{t('talent.hire_sub')}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '.75rem' }}>
              <button onClick={() => navigate('/employers')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.green, color: '#0B111E', border: 'none', cursor: 'pointer' }}>{t('talent.portal_btn')}</button>
              <button onClick={() => navigate('/pricing')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>{t('talent.enroll_btn')}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
