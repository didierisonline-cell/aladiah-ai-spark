import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PortalSidebarProps {
  hoursLeft?: number;
  coursesCount?: number;
}

export default function PortalSidebar({ hoursLeft = 412, coursesCount }: PortalSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const namePart = user?.email?.split('@')[0] || 'Student';
  const displayName = namePart;
  const initials = (
    (namePart.slice(0, 1) || 'A') + (namePart.slice(1, 2) || '')
  ).toUpperCase();

  const LINKS: { icon: string; lbl: string; path: string; exact?: boolean; badge?: number }[] = [
    { icon: '🏠', lbl: 'Overview', path: '/portal', exact: true },
    { icon: '📚', lbl: 'My Academy', path: '/portal/courses', badge: coursesCount || undefined },
    { icon: '🎯', lbl: 'My Career Path', path: '/portal/my-career-path' },
    { icon: '🌐', lbl: 'Simulations', path: '/portal/simulations' },
    { icon: '⭐', lbl: 'Talent Score™', path: '/portal/talent-score' },
    { icon: '🏅', lbl: 'Certifications', path: '/portal/courses' },
    { icon: '💼', lbl: 'Career Tools', path: '/portal/career' },
    { icon: '🗂️', lbl: 'My Portfolio', path: '/portal/portfolio' },
    { icon: '🧪', lbl: 'Labs', path: '/portal' },
    { icon: '🤖', lbl: 'AI Mentor', path: '/portal' },
    { icon: '👥', lbl: 'Community', path: '/community' },
    { icon: '🏆', lbl: 'Leaderboard', path: '/portal/talent-score' },
    { icon: '📅', lbl: 'Events', path: '/community' },
  ];

  return (
    <aside style={{ background: 'rgba(2,6,18,.72)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: 'none', position: 'relative', zIndex: 5 }}>
      {/* User block */}
      <div style={{ padding: '20px 14px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
        <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 12 }}>
          <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#7c3aed,#a855f7)', boxShadow: '0 0 18px rgba(59,130,246,.75),0 0 35px rgba(124,58,237,.5)' }} />
          <div style={{ position: 'absolute', inset: 3, borderRadius: '50%', background: 'linear-gradient(160deg,#1a2550,#0d1535,#080d28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 800, color: '#fff' }}>
            {initials}
          </div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 7 }}>{displayName}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(10,20,55,.75)', border: '1px solid rgba(255,255,255,.11)', color: '#c7d2fe', padding: '5px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500, marginBottom: 5 }}>
          Pro Member <span style={{ color: '#818cf8' }}>◆</span>
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 13 }}>Plan: <b style={{ color: '#e2e8f8' }}>All-Access Pass™</b></div>
        <div style={{ background: 'rgba(5,15,40,.65)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 7 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#f97316', textShadow: '0 0 18px rgba(249,115,22,.5)' }}>{hoursLeft}</span>
            <span style={{ fontSize: 11.5, color: '#94a3b8' }}>Hours to Employable</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,.08)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(hoursLeft / 600) * 100}%`, background: 'linear-gradient(90deg,#f97316,#fb923c)', borderRadius: 99, boxShadow: '0 0 10px rgba(249,115,22,.5)' }} />
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {LINKS.map(link => {
          const isOn = link.exact ? location.pathname === '/portal' : location.pathname === link.path;
          return (
            <button key={link.lbl} onClick={() => navigate(link.path)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 15px', color: isOn ? '#fff' : '#64748b', fontSize: 13, fontWeight: isOn ? 700 : 500, cursor: 'pointer', border: 'none', background: isOn ? 'linear-gradient(90deg,rgba(59,130,246,.22),rgba(99,102,241,.05))' : 'none', borderLeft: `3px solid ${isOn ? '#3b82f6' : 'transparent'}`, width: '100%', textAlign: 'left', fontFamily: 'inherit', transition: 'all .15s' }}>
              <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{link.icon}</span>
              {link.lbl}
              {link.badge && <span style={{ marginLeft: 'auto', background: '#f97316', color: '#fff', borderRadius: 99, fontSize: 10, padding: '2px 7px', fontWeight: 800 }}>{link.badge}</span>}
            </button>
          );
        })}
        <div style={{ padding: '12px 15px 4px', fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#2a3a55' }}>Account</div>
        <button onClick={() => navigate('/portal/settings')} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 15px', color: '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}>
          <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>⚙️</span>Settings
        </button>
        <a href="https://www.aladiahmanagement.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 15px', color: '#64748b', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
          <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>🏢</span>Aladiah Management
        </a>
        <button onClick={() => navigate('/portal')} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 15px', color: '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}>
          <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>❓</span>Help &amp; Support
        </button>
      </div>

      {/* Refer & Earn */}
      <div style={{ margin: '12px 10px 14px', padding: 13, background: 'linear-gradient(135deg,rgba(37,99,235,.28),rgba(124,58,237,.32))', border: '1px solid rgba(99,102,241,.28)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', marginBottom: 3 }}>🎁 Refer & Earn</div>
          <div style={{ fontSize: 10.5, color: '#93c5fd', lineHeight: 1.4 }}>Invite friends and earn premium rewards</div>
        </div>
        <span style={{ fontSize: 24 }}>🎁</span>
      </div>
    </aside>
  );
}
