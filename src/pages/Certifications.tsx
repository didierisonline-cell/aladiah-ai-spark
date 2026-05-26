import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

const LEVELS = [
  { code:'L100', name:'Aladiah Associate', abbr:'AAC', weeks:'4–6', req:'Foundations exam + mini-project', color:DS.green },
  { code:'L200', name:'Aladiah Practitioner', abbr:'APC', weeks:'8–10', req:'Exam + 2 case studies + peer review', color:DS.blue },
  { code:'L300', name:'Aladiah Professional', abbr:'APFC', weeks:'12–16', req:'Exam + live project + oral defense', color:DS.blue },
  { code:'L400', name:'Aladiah Specialist', abbr:'ASC', weeks:'16–20', req:'Enterprise simulation + portfolio submission', color:DS.gold },
  { code:'L500', name:'Aladiah Expert', abbr:'AEC', weeks:'20–26', req:'Multi-panel review + real-client project', color:DS.gold },
  { code:'L600', name:'Aladiah Master', abbr:'AMC', weeks:'28–36', req:'Research paper + 360° evaluation', color:DS.orange },
  { code:'L700', name:'Aladiah Fellow', abbr:'AFC', weeks:'40–52', req:'Original contribution + committee review', color:DS.orange },
];

const HOW = [
  { icon:'📝', title:'Written Exams', desc:'Closed-book, timed exams covering theory, application, and edge cases across the full curriculum.' },
  { icon:'🏗️', title:'Live Projects', desc:'Real deliverables built in simulated enterprise environments with stakeholder reviews and feedback cycles.' },
  { icon:'🎤', title:'Oral Defenses', desc:'Panel-format sessions at L300+ where you defend your approach, decisions, and domain knowledge.' },
  { icon:'🤝', title:'Peer Review', desc:'Cross-cohort evaluations that build critical thinking and expose you to diverse implementation styles.' },
  { icon:'🏢', title:'Enterprise Simulation', desc:'Multi-week scenarios mirroring real corporate AI deployments with full team structure.' },
  { icon:'📂', title:'Portfolio Submission', desc:'Curated evidence of applied work reviewed by industry practitioners at L400+.' },
];

export default function Certifications() {
  const navigate = useNavigate();
  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <section style={{ padding: '5rem 0 3rem', background: 'linear-gradient(160deg,#0a1628 0%,#0d1f3c 60%,#0a1220 100%)', borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 600, padding: '.28rem .75rem', borderRadius: 999, background: DS.gd, border: `1px solid ${DS.gb}`, color: DS.gold, marginBottom: '1rem' }}>🏅 Aladiah Certified™</div>
            <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.5px', marginBottom: '1rem' }}>Seven Levels of<br /><span style={{ color: DS.gold }}>Verified Mastery.</span></h1>
            <p style={{ fontSize: '1rem', color: DS.fm, maxWidth: 560, lineHeight: 1.72 }}>Not a participation certificate. Multi-modal evaluation at every level: written exams, live projects, oral defenses, enterprise simulations, and peer reviews. A credential employers actually trust.</p>
          </div>
        </section>

        {/* Levels */}
        <section style={{ padding: '5rem 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ marginBottom: '2.75rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>The 7 Levels</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800 }}>From <span style={{ color: DS.blue }}>Associate</span> to <span style={{ color: DS.gold }}>Fellow</span></h2>
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
                    <div style={{ fontSize: 11, color: DS.fm, marginTop: 2 }}>Level {i+1} of 7 · {lv.weeks} weeks</div>
                  </div>
                  <div style={{ fontSize: 12, color: DS.fm }}>{lv.req}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: lv.color, background: lv.color + '20', border: `1px solid ${lv.color}40`, borderRadius: 999, padding: '3px 12px', whiteSpace: 'nowrap' as const }}>Active</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: '5rem 0', background: 'rgba(24,36,58,.22)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ marginBottom: '2.75rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>Evaluation Methodology</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800 }}>How Certification<br /><span style={{ color: DS.blue }}>Actually Works</span></h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
              {HOW.map(h => (
                <div key={h.title} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.75rem' }}>
                  <div style={{ fontSize: 22, marginBottom: '.75rem' }}>{h.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: DS.fg, marginBottom: '.35rem' }}>{h.title}</h4>
                  <p style={{ fontSize: 12, color: DS.fm, lineHeight: 1.6 }}>{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{ background: DS.card, borderTop: `1px solid ${DS.border}`, padding: '4.5rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.4rem)', fontWeight: 800, marginBottom: '.75rem' }}>Ready to Earn Your<br /><span style={{ color: DS.gold }}>Aladiah Certified™</span> Credential?</h2>
            <p style={{ fontSize: 14, color: DS.fm, maxWidth: 440, margin: '0 auto 2rem', lineHeight: 1.7 }}>Start at Associate level and progress through to Fellow. All certification paths are included in your $99.99/month subscription.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '.75rem' }}>
              <button onClick={() => navigate('/pricing')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.gold, color: '#0B111E', border: 'none', cursor: 'pointer' }}>Enroll Now →</button>
              <button onClick={() => navigate('/portal')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>View My Certifications</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
