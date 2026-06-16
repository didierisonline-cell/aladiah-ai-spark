import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import MobileShell from '@/components/mobile/MobileShell';
import PortalShell from '@/components/portal/PortalShell';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useIdentity } from '@/hooks/useIdentity';

const C = { fg: '#EDF2F7', fm: '#8596AD', card: 'rgba(8,20,52,.7)', border: 'rgba(255,255,255,.08)' };

const GROUPS: { title: string; items: { icon: string; label: string; to?: string; href?: string }[] }[] = [
  {
    title: 'Career', items: [
      { icon: '⭐', label: 'Talent Score', to: '/portal/talent-score' },
      { icon: '🗂️', label: 'Portfolio', to: '/portal/portfolio' },
      { icon: '🏅', label: 'Certifications', to: '/portal/certifications' },
      { icon: '🧭', label: 'My Career Path', to: '/portal/my-career-path' },
    ],
  },
  {
    title: 'Community & resources', items: [
      { icon: '👥', label: 'Community', to: '/community' },
      { icon: '📦', label: 'Resources', to: '/portal/resources' },
      { icon: '🏢', label: 'Aladiah Management', href: 'https://www.aladiahmanagement.com' },
    ],
  },
  {
    title: 'Account', items: [
      { icon: '⚙️', label: 'Settings', to: '/portal/settings' },
    ],
  },
];

export default function ProfileHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPhone } = useBreakpoint();
  const { displayName: name, initials } = useIdentity();

  const logout = async () => {
    try { await supabase.auth.signOut(); } catch { /* ignore */ }
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (key) localStorage.removeItem(key);
    window.location.href = '/auth';
  };

  const body = (
      <div style={{ padding: '18px 16px 8px', maxWidth: 620, margin: '0 auto' }}>
        {/* Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'linear-gradient(160deg,#1a2550,#080d28)', border: '2px solid rgba(99,102,241,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff' }}>{initials}</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>{name}</div>
            <div style={{ fontSize: 12, color: C.fm }}>{user?.email}</div>
          </div>
        </div>

        {GROUPS.map(g => (
          <div key={g.title} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: C.fm, margin: '0 4px 8px' }}>{g.title}</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
              {g.items.map((it, i) => {
                const inner = (
                  <>
                    <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{it.icon}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.fg }}>{it.label}</span>
                    <span style={{ color: C.fm, fontSize: 18 }}>›</span>
                  </>
                );
                const style: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', width: '100%', background: 'none', border: 'none', borderTop: i > 0 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', textDecoration: 'none' };
                return it.href ? (
                  <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" className="app-tap tap-target" style={style}>{inner}</a>
                ) : (
                  <button key={it.label} onClick={() => navigate(it.to!)} className="app-tap tap-target" style={style}>{inner}</button>
                );
              })}
            </div>
          </div>
        ))}

        <button onClick={logout} className="app-tap tap-target" style={{ width: '100%', height: 48, marginTop: 6, borderRadius: 14, background: 'transparent', border: '1px solid rgba(240,98,42,.4)', color: '#F0622A', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
          Log out
        </button>
      </div>
  );

  // Phone keeps the native mobile shell; desktop/tablet folds into the one
  // PortalShell (Header + sidebar) so the profile surface matches every other page.
  if (isPhone) return <MobileShell title="Profile">{body}</MobileShell>;
  return <PortalShell>{body}</PortalShell>;
}
