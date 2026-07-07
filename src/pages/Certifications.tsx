import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

export default function Certifications() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const LEVELS = [
    { code:'L100', name:'Aladiah Associate',   abbr:'AAC',  weeks:'4–6',   reqKey:'cert.req_l100', color:DS.green },
    { code:'L200', name:'Aladiah Practitioner', abbr:'APC',  weeks:'8–10',  reqKey:'cert.req_l200', color:DS.blue },
    { code:'L300', name:'Aladiah Professional', abbr:'APFC', weeks:'12–16', reqKey:'cert.req_l300', color:DS.blue },
    { code:'L400', name:'Aladiah Specialist',   abbr:'ASC',  weeks:'16–20', reqKey:'cert.req_l400', color:DS.gold },
    { code:'L500', name:'Aladiah Expert',       abbr:'AEC',  weeks:'20–26', reqKey:'cert.req_l500', color:DS.gold },
    { code:'L600', name:'Aladiah Master',       abbr:'AMC',  weeks:'28–36', reqKey:'cert.req_l600', color:DS.orange },
    { code:'L700', name:'Aladiah Fellow',       abbr:'AFC',  weeks:'40–52', reqKey:'cert.req_l700', color:DS.orange },
  ];

  const HOW = [
    { icon:'📝', titleKey:'cert.how0_title', descKey:'cert.how0_desc' },
    { icon:'🏗️', titleKey:'cert.how1_title', descKey:'cert.how1_desc' },
    { icon:'🎤', titleKey:'cert.how2_title', descKey:'cert.how2_desc' },
    { icon:'🤝', titleKey:'cert.how3_title', descKey:'cert.how3_desc' },
    { icon:'🏢', titleKey:'cert.how4_title', descKey:'cert.how4_desc' },
    { icon:'📂', titleKey:'cert.how5_title', descKey:'cert.how5_desc' },
  ];

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <section style={{ padding: '5rem 0 3rem', background: 'linear-gradient(160deg,#0a1628 0%,#0d1f3c 60%,#0a1220 100%)', borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '.28rem .75rem', borderRadius: 999, background: DS.gd, border: `1px solid ${DS.gb}`, color: DS.gold, marginBottom: '1rem' }}>{t('cert.badge')}</div>
            <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.5px', marginBottom: '1rem' }}>
              {t('cert.h1a')}<br /><span style={{ color: DS.gold }}>{t('cert.h1b')}</span>
            </h1>
            <p style={{ fontSize: '1rem', color: DS.fm, maxWidth: 560, lineHeight: 1.72 }}>{t('cert.sub')}</p>
          </div>
        </section>

        {/* Levels */}
        <section style={{ padding: '5rem 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ marginBottom: '2.75rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>{t('cert.levels_label')}</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800 }}>{t('cert.levels_h2a')}<span style={{ color: DS.blue }}>{t('cert.levels_assoc')}</span>{t('cert.levels_of')}<span style={{ color: DS.gold }}>{t('cert.levels_fellow')}</span></h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '.6rem' }}>
              {LEVELS.map((lv, i) => (
                <div key={lv.code} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto', gap: '1.5rem', alignItems: 'center', background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.25rem 1.5rem' }}>
                  <div style={{ textAlign: 'center' as const }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: lv.color, letterSpacing: 1 }}>{lv.code}</div>
                    <div style={{ fontSize: 10, color: DS.fm, marginTop: 2 }}>{lv.abbr}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: DS.fg }}>{lv.name}</div>
                    <div style={{ fontSize: 11, color: DS.fm, marginTop: 2 }}>{t('cert.level_of_7a')}{i+1}{t('cert.level_of_7b')}{lv.weeks}{t('cert.weeks')}</div>
                  </div>
                  <div style={{ fontSize: 12, color: DS.fm }}>{t(lv.reqKey)}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#8b9aae', background: 'rgba(139,154,174,.12)', border: '1px solid rgba(139,154,174,.25)', borderRadius: 999, padding: '3px 12px', whiteSpace: 'nowrap' as const }}>Coming Soon</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: '5rem 0', background: 'rgba(24,36,58,.22)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ marginBottom: '2.75rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>{t('cert.how_label')}</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800 }}>{t('cert.how_h2a')}<br /><span style={{ color: DS.blue }}>{t('cert.how_h2b')}</span></h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {HOW.map(h => (
                <div key={h.titleKey} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.75rem' }}>
                  <div style={{ fontSize: 22, marginBottom: '.75rem' }}>{h.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: DS.fg, marginBottom: '.35rem' }}>{t(h.titleKey)}</h4>
                  <p style={{ fontSize: 12, color: DS.fm, lineHeight: 1.6 }}>{t(h.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{ background: DS.card, borderTop: `1px solid ${DS.border}`, padding: '4.5rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.4rem)', fontWeight: 800, marginBottom: '.75rem' }}>{t('cert.cta_h2a')}<br /><span style={{ color: DS.gold }}>{t('cert.badge')}</span> {t('cert.cta_h2b')}</h2>
            <p style={{ fontSize: 14, color: DS.fm, maxWidth: 440, margin: '0 auto 2rem', lineHeight: 1.7 }}>{t('cert.cta_sub')}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '.75rem' }}>
              <button onClick={() => navigate('/pricing')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.gold, color: '#0B111E', border: 'none', cursor: 'pointer' }}>{t('cert.enroll_btn')}</button>
              <button onClick={() => navigate('/portal')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>{t('cert.view_btn')}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
