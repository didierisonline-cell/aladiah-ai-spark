import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const DS = {
  bg:'#0B111E', card:'#111D30', muted:'#18243A', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', gold:'#F5B81A', green:'#22C98A',
};

const SIDEBAR_LINKS = [
  { icon:'📊', label:'Overview', href:'/portal' },
  { icon:'📚', label:'My Courses', href:'/portal/courses', badge:'3' },
  { icon:'⭐', label:'Talent Score™', href:'/portal/talent-score' },
  { icon:'🏅', label:'Certifications', href:'/portal' },
  { icon:'💼', label:'Career Tools', href:'/portal/career' },
  { icon:'🗂️', label:'My Portfolio', href:'/portal/portfolio' },
  { icon:'⚙️', label:'Settings', href:'/portal/settings' },
];

export default function PortalSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = user?.email?.slice(0,2).toUpperCase() || 'AA';
  const pathname = '/portal/settings';

  const handleLogout = () => {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (key) localStorage.removeItem(key);
    navigate('/');
    supabase.auth.signOut().catch(() => {});
  };

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', paddingTop: 70 }}>
        <aside style={{ background: DS.card, borderRight: `1px solid ${DS.border}`, padding: '1.75rem 0', position: 'sticky' as const, top: 70, height: 'calc(100vh - 70px)', overflowY: 'auto' as const }}>
          <div style={{ padding: '1.25rem 1.5rem 1.5rem', borderBottom: `1px solid ${DS.border}` }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#4A90F5,#7AB5FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: '.65rem' }}>{initials}</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{user?.email?.split('@')[0] || 'Student'}</div>
            <div style={{ fontSize: 11, color: DS.fm, marginTop: 2 }}>Plan: <span style={{ color: DS.gold, fontWeight: 600 }}>All-Access Pass™</span></div>
          </div>
          <div style={{ padding: '.75rem 0' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#4A5E7A', padding: '.5rem 1.5rem .25rem' }}>Dashboard</div>
            {SIDEBAR_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={e => { e.preventDefault(); navigate(link.href); }}
                style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.65rem 1.5rem', fontSize: 13, fontWeight: pathname === link.href ? 700 : 500, color: pathname === link.href ? DS.blue : DS.fm, background: pathname === link.href ? DS.bd : 'transparent', borderLeft: pathname === link.href ? `3px solid ${DS.blue}` : '3px solid transparent', textDecoration: 'none', transition: 'all .2s' }}>
                <span style={{ width: 18, textAlign: 'center' as const }}>{link.icon}</span>
                {link.label}
                {link.badge && <span style={{ marginLeft: 'auto', fontSize: 10, background: DS.orange, color: '#fff', borderRadius: 999, padding: '1px 7px', fontWeight: 700 }}>{link.badge}</span>}
              </a>
            ))}
          </div>
        </aside>
        <main style={{ padding: '2rem', background: DS.bg }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Account Settings</h1>
          </div>
          <div style={{ maxWidth: 600 }}>
            {/* Profile */}
            <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '1rem' }}>👤 Profile</div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: .5, textTransform: 'uppercase' as const, color: DS.fm, marginBottom: '.38rem' }}>Email</label>
                <div style={{ background: DS.muted, border: `1px solid ${DS.border}`, borderRadius: '.5rem', padding: '.62rem .9rem', fontSize: 13, color: DS.fm }}>{user?.email || '—'}</div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: .5, textTransform: 'uppercase' as const, color: DS.fm, marginBottom: '.38rem' }}>Display Name</label>
                <input style={{ width: '100%', background: DS.muted, border: `1px solid ${DS.border}`, borderRadius: '.5rem', padding: '.62rem .9rem', color: DS.fg, fontFamily: 'inherit', fontSize: 13, outline: 'none' }} placeholder="Your name" defaultValue={user?.email?.split('@')[0] || ''} />
              </div>
            </div>
            {/* Subscription */}
            <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '1rem' }}>💳 Subscription</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,.03)', border: `1px solid ${DS.border}`, borderRadius: '.5rem' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>All-Access Pass™</div>
                  <div style={{ fontSize: 11, color: DS.fm, marginTop: 2 }}>$99.99/month · Active</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(34,201,138,.12)', color: DS.green, border: '1px solid rgba(34,201,138,.28)' }}>Active</span>
              </div>
              <div style={{ marginTop: '.75rem' }}>
                <a href="https://billing.stripe.com/p/login/test" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: DS.blue, textDecoration: 'none' }}>Manage Billing →</a>
              </div>
            </div>
            {/* Danger Zone */}
            <div style={{ background: DS.card, border: '1px solid rgba(240,98,42,.25)', borderRadius: '.75rem', padding: '1.5rem' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: DS.orange, marginBottom: '.75rem' }}>⚠️ Account Actions</div>
              <button onClick={handleLogout} style={{ fontSize: 13, fontWeight: 700, padding: '.65rem 1.25rem', borderRadius: '.75rem', background: 'transparent', color: DS.orange, border: '1px solid rgba(240,98,42,.3)', cursor: 'pointer' }}>Sign Out</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
