import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

const FEATURES = [
  { icon:'⭐', title:'Talent Score™', desc:'A quantified, multi-dimensional score built from your learning progress, project quality, certifications, and enterprise simulations.' },
  { icon:'🗂️', title:'Verified Portfolio', desc:'Every project, simulation, and deliverable is verified and timestamped. Employers see exactly what you built and when.' },
  { icon:'🏢', title:'Employer Matching', desc:'AI-powered matching connects your profile with companies hiring for your exact skills, level, and location preferences.' },
  { icon:'🌐', title:'Global Network', desc:'150+ partner companies across North America, Europe, Africa, and Latin America. Remote-first roles prioritized.' },
  { icon:'📊', title:'Market Intelligence', desc:'Real-time salary data, hiring trends, and skill demand signals help you calibrate your learning path.' },
  { icon:'🤝', title:'Alumni Network', desc:'Connect with Aladiah graduates at top companies. Mentorship, referrals, and community support.' },
];

const STATS = [
  { val:'150+', lbl:'Employer Partners' },
  { val:'94%', lbl:'Placement Rate (L300+)' },
  { val:'$127K', lbl:'Avg. First-Year Salary' },
  { val:'62', lbl:'Countries Represented' },
];

export default function TalentNetwork() {
  const navigate = useNavigate();
  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <section style={{ padding: '5rem 0 3rem', background: 'linear-gradient(160deg,#0a1628 0%,#0d1f3c 60%,#0a1220 100%)', borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'inline-flex', fontSize: 11, fontWeight: 600, padding: '.28rem .75rem', borderRadius: 999, background: DS.grd, border: '1px solid rgba(34,201,138,.28)', color: DS.green, marginBottom: '1rem' }}>🌐 Global Placement Network</div>
            <h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.5px', marginBottom: '1rem' }}>Your Score Opens<br /><span style={{ color: DS.green }}>Every Door.</span></h1>
            <p style={{ fontSize: '1rem', color: DS.fm, maxWidth: 560, lineHeight: 1.72, marginBottom: '2rem' }}>The Aladiah Talent Network is the infrastructure connecting our graduates with the world's leading enterprises. Verified credentials. Quantified performance. Global reach.</p>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button onClick={() => navigate('/pricing')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.green, color: '#0B111E', border: 'none', cursor: 'pointer' }}>Join the Network →</button>
              <button onClick={() => navigate('/employers')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>For Employers ↗</button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: '3rem 0', borderBottom: `1px solid ${DS.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {STATS.map(s => (
              <div key={s.val} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: DS.green, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: DS.fm }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '5rem 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ marginBottom: '2.75rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, color: DS.blue, marginBottom: '.65rem' }}>How It Works</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800 }}>Your <span style={{ color: DS.green }}>Complete Career</span> Infrastructure</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {FEATURES.map(f => (
                <div key={f.title} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.75rem' }}>
                  <div style={{ fontSize: 24, marginBottom: '.75rem' }}>{f.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: DS.fg, marginBottom: '.5rem' }}>{f.title}</h4>
                  <p style={{ fontSize: 12, color: DS.fm, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Employers CTA */}
        <div style={{ background: DS.card, borderTop: `1px solid ${DS.border}`, padding: '4.5rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.4rem)', fontWeight: 800, marginBottom: '.75rem' }}>Hiring AI Talent?<br /><span style={{ color: DS.green }}>We Have the Pipeline.</span></h2>
            <p style={{ fontSize: 14, color: DS.fm, maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7 }}>Access verified Aladiah graduates ranked by Talent Score™. Filter by school, certification level, skills, and location.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '.75rem' }}>
              <button onClick={() => navigate('/employers')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.green, color: '#0B111E', border: 'none', cursor: 'pointer' }}>Employer Portal →</button>
              <button onClick={() => navigate('/pricing')} style={{ fontSize: 14, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer' }}>Enroll as Student</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
