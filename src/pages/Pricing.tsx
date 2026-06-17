import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

export default function Pricing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = React.useState<number|null>(null);

  const INCLUDES = [
    t('pricing.inc0'), t('pricing.inc1'), t('pricing.inc2'), t('pricing.inc3'),
    t('pricing.inc4'), t('pricing.inc5'), t('pricing.inc6'), t('pricing.inc7'),
  ];

  const FAQ = [
    { q: t('pricing.faq_q0'), a: t('pricing.faq_a0') },
    { q: t('pricing.faq_q1'), a: t('pricing.faq_a1') },
    { q: t('pricing.faq_q2'), a: t('pricing.faq_a2') },
    { q: t('pricing.faq_q3'), a: t('pricing.faq_a3') },
    { q: t('pricing.faq_q4'), a: t('pricing.faq_a4') },
  ];

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <section style={{ padding: '5rem 0 3rem', background: 'linear-gradient(160deg,#0a1628 0%,#0d1f3c 60%,#0a1220 100%)', borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'inline-flex', fontSize: 11, fontWeight: 600, padding: '.28rem .75rem', borderRadius: 999, background: DS.gd, border: `1px solid ${DS.gb}`, color: DS.gold, marginBottom: '1rem' }}>{t('pricing.badge')}</div>
            <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.5px', marginBottom: '1rem' }}>
              {t('pricing.h1_line1')}<br />{t('pricing.h1_line2')}<br /><span style={{ color: DS.gold }}>{t('pricing.h1_line3')}</span>
            </h1>
            <p style={{ fontSize: '1rem', color: DS.fm, maxWidth: 560, lineHeight: 1.72 }}>{t('pricing.sub')}</p>
          </div>
        </section>

        <section style={{ padding: '4rem 0' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 2rem' }}>
            {/* All Access Pass badge */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-block', background: DS.gd, border: `1px solid ${DS.gb}`, borderRadius: 999, padding: '.3rem 1.2rem', marginBottom: '.85rem' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.gold }}>{t('pricing.pass_badge')}</span>
              </div>
              <div style={{ fontSize: '5rem', fontWeight: 800, color: DS.fg, lineHeight: 1 }}>$99<span style={{ fontSize: '2.1rem', color: DS.fm, fontWeight: 400 }}>.99<span style={{ fontSize: '1.15rem' }}>/mo</span></span></div>
              <div style={{ fontSize: 13, color: DS.fm, marginTop: '.3rem' }}>{t('pricing.rate')}</div>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '.9rem', marginTop: '1.15rem' }}>
                {INCLUDES.map(i => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: 12, color: DS.fm }}>
                    <span style={{ color: DS.green }}>✓</span>{i}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary CTA */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <button onClick={() => navigate('/auth')} style={{ padding: '.85rem 2.2rem', fontSize: 14, fontWeight: 700, borderRadius: '.75rem', background: DS.gold, color: '#0B111E', border: 'none', cursor: 'pointer' }}>{t('pricing.cta_btn')}</button>
            </div>

            {/* Free & Enterprise notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', gap: '.7rem', background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1rem' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>👋</span>
                <p style={{ fontSize: 12, color: DS.fm, lineHeight: 1.6 }}>
                  {t('pricing.free_pre')}<strong style={{ color: DS.fg }}>{t('pricing.free_strong')}</strong>{t('pricing.free_body')}<a onClick={() => navigate('/auth')} style={{ color: DS.blue, fontWeight: 600, cursor: 'pointer' }}>{t('pricing.free_link')}</a>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '.7rem', background: 'rgba(74,144,245,.03)', border: `1px solid ${DS.bb}`, borderRadius: '.75rem', padding: '1rem' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>🏢</span>
                <p style={{ fontSize: 12, color: DS.fm, lineHeight: 1.6 }}>
                  <strong style={{ color: DS.fg }}>{t('pricing.ent_strong')}</strong>{t('pricing.ent_body')}<a href="https://www.aladiahmanagement.com" target="_blank" style={{ color: DS.orange, fontWeight: 600 }}>{t('pricing.ent_link')}</a>
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ marginBottom: '.65rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>{t('pricing.faq_label')}</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800, marginBottom: '1.5rem' }}>{t('pricing.faq_h2')}<span style={{ color: DS.blue }}>{t('pricing.faq_h2b')}</span></h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '.75rem' }}>
              {FAQ.map((f, i) => (
                <div key={i} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.25rem', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DS.fg, marginBottom: openFaq === i ? '.35rem' : 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {f.q}
                    <span style={{ color: DS.fm, fontSize: 16 }}>{openFaq === i ? '−' : '+'}</span>
                  </div>
                  {openFaq === i && <div style={{ fontSize: 13, color: DS.fm, lineHeight: 1.6 }}>{f.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
