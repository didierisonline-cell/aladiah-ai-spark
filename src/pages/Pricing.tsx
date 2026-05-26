import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

const INCLUDES = ['All 4 Schools','30+ AI Programs','Prof. Didier AI','Talent Score™','Aladiah Certified™','Placement Network','Enterprise Simulation','20+ Languages'];

const FAQ = [
  { q:'Can I cancel anytime?', a:'Yes. Month-to-month subscribers can cancel at any time with no penalty. Upfront plans (3-month and annual) are non-refundable after the first 7 days, but you retain access for the full paid period.' },
  { q:'What happens after the 3-month intro pricing?', a:'After your first 3 months at $59.99/month, your subscription automatically continues at the standard $99.99/month rate. You\'ll receive an email reminder 7 days before the rate changes.' },
  { q:'Is everything really included?', a:'Yes. All 4 Schools, all 30+ programs, Prof. Didier AI (unlimited sessions), Talent Score™, all Aladiah Certified™ levels, Enterprise Simulation, Career Tools, Portfolio builder, Resources library, and the Placement Network. One price.' },
  { q:'Do you offer scholarships?', a:'Yes. Aladiah Management enterprise contracts fund a scholarship pool for Global South students. Government and NGO bulk licensing also available.' },
  { q:'What languages is the platform available in?', a:'Currently 21 languages: English, Spanish, French, German, Chinese, Arabic, Japanese, Portuguese, Hindi, Korean, Italian, Russian, Dutch, Polish, Turkish, Kiswahili, Yorùbá, Hausa, Igbo, Vietnamese, and Thai — with more coming.' },
  { q:'Is there a student or group discount?', a:'Enterprise licensing (5+ seats) is available through Aladiah Management at custom pricing. Contact us for government, NGO, university, and corporate group rates.' },
];

export default function Pricing() {
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = React.useState<number|null>(null);

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <section style={{ padding: '5rem 0 3rem', background: 'linear-gradient(160deg,#0a1628 0%,#0d1f3c 60%,#0a1220 100%)', borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'inline-flex', fontSize: 11, fontWeight: 600, padding: '.28rem .75rem', borderRadius: 999, background: DS.gd, border: `1px solid ${DS.gb}`, color: DS.gold, marginBottom: '1rem' }}>💳 Simple Pricing</div>
            <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.5px', marginBottom: '1rem' }}>One Program.<br /><span style={{ color: DS.gold }}>Three Ways to Pay.</span></h1>
            <p style={{ fontSize: '1rem', color: DS.fm, maxWidth: 560, lineHeight: 1.72 }}>Full access to all 4 schools, 30+ programs, Prof. Didier AI, Talent Score™, Aladiah Certified™, and the global placement network. No tiers. No hidden fees.</p>
          </div>
        </section>

        <section style={{ padding: '4rem 0' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 2rem' }}>
            {/* All Access Pass badge */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-block', background: DS.gd, border: `1px solid ${DS.gb}`, borderRadius: 999, padding: '.3rem 1.2rem', marginBottom: '.85rem' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.gold }}>Aladiah All-Access Pass™</span>
              </div>
              <div style={{ fontSize: '5rem', fontWeight: 800, color: DS.fg, lineHeight: 1 }}>$99<span style={{ fontSize: '2.1rem', color: DS.fm, fontWeight: 400 }}>.99<span style={{ fontSize: '1.15rem' }}>/mo</span></span></div>
              <div style={{ fontSize: 13, color: DS.fm, marginTop: '.3rem' }}>standard monthly rate · cancel anytime</div>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '.9rem', marginTop: '1.15rem' }}>
                {INCLUDES.map(i => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: 12, color: DS.fm }}>
                    <span style={{ color: DS.green }}>✓</span>{i}
                  </span>
                ))}
              </div>
            </div>

            {/* 3 Plans */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: `1px solid ${DS.border}`, borderRadius: '.75rem', overflow: 'hidden', marginBottom: '1.25rem' }}>
              {/* Monthly */}
              <div style={{ background: DS.card, padding: '2.1rem 1.75rem', borderRight: `1px solid ${DS.border}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: DS.fm, marginBottom: '.6rem' }}>Month-to-Month</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: DS.fg, lineHeight: 1, marginBottom: '.2rem' }}>$99<span style={{ fontSize: '1rem', color: DS.fm, fontWeight: 400 }}>.99</span></div>
                <div style={{ fontSize: 11, color: DS.fm, marginBottom: '.4rem' }}>per month · billed monthly</div>
                <div style={{ fontSize: 12, color: DS.fm, marginBottom: '1.1rem' }}>Maximum flexibility. Start today, cancel anytime.</div>
                <div style={{ background: 'rgba(255,255,255,.03)', border: `1px solid rgba(30,45,71,.6)`, borderRadius: '.45rem', padding: '.7rem', marginBottom: '1.1rem', fontSize: 12, color: DS.fm }}>No commitment. No penalty. Full access from day one.</div>
                <button onClick={() => navigate('/auth')} style={{ width: '100%', padding: '.68rem', fontSize: 13, fontWeight: 700, borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>Start Monthly →</button>
              </div>
              {/* 3-Month Best Start */}
              <div style={{ background: '#121F38', borderTop: `2px solid ${DS.gold}`, padding: '2.1rem 1.75rem', borderRight: `1px solid ${DS.border}`, position: 'relative' as const }}>
                <div style={{ position: 'absolute' as const, top: 0, right: '1.4rem', background: DS.gold, color: '#0B111E', fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' as const, padding: '3px 10px', borderRadius: '0 0 6px 6px' }}>Best Start</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: DS.gold, marginBottom: '.6rem' }}>3-Month Upfront</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: DS.gold, lineHeight: 1, marginBottom: '.1rem' }}>$59<span style={{ fontSize: '1rem', color: DS.fm, fontWeight: 400 }}>.99</span></div>
                <div style={{ fontSize: 11, color: DS.fm, marginBottom: '.4rem' }}>per month · first 3 months only</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', marginBottom: '1.1rem' }}>
                  <span style={{ fontSize: 12, color: DS.fm, textDecoration: 'line-through' }}>$299.97</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: DS.fg }}>$179.97 total</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: DS.grd, color: DS.green, border: '1px solid rgba(34,201,138,.28)' }}>Save $120</span>
                </div>
                <div style={{ background: 'rgba(245,184,26,.06)', border: `1px solid ${DS.gb}`, borderRadius: '.45rem', padding: '.7rem', marginBottom: '1.1rem', fontSize: 12, color: DS.fm }}>Pay 3 months upfront at <strong style={{ color: DS.gold }}>$59.99/month</strong>. After month 3, continues at $99.99/month.</div>
                <button onClick={() => navigate('/auth')} style={{ width: '100%', padding: '.68rem', fontSize: 13, fontWeight: 700, borderRadius: '.75rem', background: DS.gold, color: '#0B111E', border: 'none', cursor: 'pointer' }}>Start for $179.97 →</button>
                <div style={{ fontSize: 10, textAlign: 'center' as const, color: DS.fm, marginTop: '.55rem' }}>Cancel anytime · No contracts</div>
              </div>
              {/* Annual */}
              <div style={{ background: DS.card, padding: '2.1rem 1.75rem' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: DS.fm, marginBottom: '.6rem' }}>Annual Upfront</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: DS.fg, lineHeight: 1, marginBottom: '.1rem' }}>$79<span style={{ fontSize: '1rem', color: DS.fm, fontWeight: 400 }}>.99</span></div>
                <div style={{ fontSize: 11, color: DS.fm, marginBottom: '.4rem' }}>per month · billed $959.90/year</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', marginBottom: '1.1rem' }}>
                  <span style={{ fontSize: 12, color: DS.fm, textDecoration: 'line-through' }}>$1,199.88</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: DS.fg }}>$959.90 total</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: DS.bd, color: DS.blue, border: `1px solid ${DS.bb}` }}>20% off</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,.03)', border: `1px solid rgba(30,45,71,.6)`, borderRadius: '.45rem', padding: '.7rem', marginBottom: '1.1rem', fontSize: 12, color: DS.fm }}>Pay full year upfront. Save <strong style={{ color: DS.fg }}>$239.98</strong>. Best for committed learners on the certification path.</div>
                <button onClick={() => navigate('/auth')} style={{ width: '100%', padding: '.68rem', fontSize: 13, fontWeight: 700, borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>Save 20% Annually →</button>
              </div>
            </div>

            {/* Free & Enterprise notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', gap: '.7rem', background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1rem' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>👋</span>
                <p style={{ fontSize: 12, color: DS.fm, lineHeight: 1.6 }}>Not ready? <strong style={{ color: DS.fg }}>Start free</strong> — access Course 1 Module 1 in full with Prof. Didier AI. No credit card required. <a onClick={() => navigate('/auth')} style={{ color: DS.blue, fontWeight: 600, cursor: 'pointer' }}>Try free →</a></p>
              </div>
              <div style={{ display: 'flex', gap: '.7rem', background: 'rgba(74,144,245,.03)', border: `1px solid ${DS.bb}`, borderRadius: '.75rem', padding: '1rem' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>🏢</span>
                <p style={{ fontSize: 12, color: DS.fm, lineHeight: 1.6 }}><strong style={{ color: DS.fg }}>Enterprise contracts</strong> handled via Aladiah Management. <a href="https://www.aladiahmanagement.com" target="_blank" style={{ color: DS.orange, fontWeight: 600 }}>Talk to our team →</a></p>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ marginBottom: '.65rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>Common Questions</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800, marginBottom: '1.5rem' }}>Pricing <span style={{ color: DS.blue }}>FAQ</span></h2>
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

// Need React for useState
import React from 'react';
