import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import PortalSidebar from '@/components/PortalSidebar';
import { useAuth } from '@/hooks/useAuth';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};


export default function PortalPortfolio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = user?.email?.slice(0,2).toUpperCase() || 'AA';
  const pathname = '/portal/portfolio';

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div className="portal-shell" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', paddingTop: 70 }}>
        <PortalSidebar />
        <main style={{ padding: '2rem', background: DS.bg }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Portfolio</h1>
            <div style={{ fontSize: 13, color: DS.fm, marginTop: '.2rem' }}>Every project, simulation, and deliverable — verified and ready to share with employers.</div>
          </div>
          {/* Empty state */}
          <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '4rem 2rem', textAlign: 'center' as const }}>
            <div style={{ fontSize: 48, marginBottom: '1rem' }}>🗂️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '.5rem' }}>Your Portfolio is Empty</h3>
            <p style={{ fontSize: 13, color: DS.fm, maxWidth: 400, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>Complete lessons, submit projects, and pass simulations to automatically build your verified portfolio. Employers can view your verified work history.</p>
            <button onClick={() => navigate('/portal/courses')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.blue, color: '#fff', border: 'none', cursor: 'pointer' }}>Start Building →</button>
          </div>
          {/* Portfolio tips */}
          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { icon:'📝', title:'Complete Projects', desc:'Submit real deliverables at the end of each module to add verified work samples.' },
              { icon:'🏢', title:'Enterprise Simulations', desc:'Complete enterprise simulation scenarios to demonstrate real-world problem solving.' },
              { icon:'🏅', title:'Earn Certifications', desc:'Certified achievements are automatically pinned as portfolio highlights.' },
            ].map(tip => (
              <div key={tip.title} style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.25rem' }}>
                <div style={{ fontSize: 22, marginBottom: '.5rem' }}>{tip.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: '.25rem' }}>{tip.title}</div>
                <div style={{ fontSize: 12, color: DS.fm, lineHeight: 1.5 }}>{tip.desc}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
