import { useLocation, useNavigate } from 'react-router-dom';

// The 5 primary student destinations (replaces the left sidebar on mobile).
const TABS = [
  { key: 'home', icon: '🏠', label: 'Home', path: '/portal', match: (p: string) => p === '/portal' },
  { key: 'learn', icon: '📚', label: 'Learn', path: '/portal/courses', match: (p: string) => p.startsWith('/portal/courses') || p.startsWith('/portal/course') || p.startsWith('/portal/flagship') || p.startsWith('/chapter') },
  { key: 'sims', icon: '🎮', label: 'Simulations', path: '/portal/simulations', match: (p: string) => p.startsWith('/portal/simulations') },
  { key: 'mentor', icon: '🤖', label: 'Mentor', path: '/portal/mentor', match: (p: string) => p.startsWith('/portal/mentor') },
  { key: 'profile', icon: '👤', label: 'Profile', path: '/portal/profile', match: (p: string) => p.startsWith('/portal/profile') || p.startsWith('/portal/talent-score') || p.startsWith('/portal/portfolio') || p.startsWith('/portal/certifications') || p.startsWith('/portal/settings') },
];

/** Fixed bottom navigation for the student mobile shell. Safe-area aware. */
export default function BottomTabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="app-tap safe-bottom"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 90,
        height: 'calc(var(--tabbar-h) + var(--safe-bottom))',
        background: 'rgba(6,12,28,.92)', backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,.08)',
        display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', alignItems: 'stretch',
      }}
    >
      {TABS.map(t => {
        const active = t.match(pathname);
        return (
          <button
            key={t.key}
            onClick={() => navigate(t.path)}
            className="tap-target app-tap"
            aria-label={t.label}
            aria-current={active ? 'page' : undefined}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
              color: active ? '#fff' : '#5a6a8a', paddingTop: 8,
              transition: 'color .15s',
            }}
          >
            <span style={{ fontSize: 21, lineHeight: 1, filter: active ? 'none' : 'grayscale(.4) opacity(.85)', transform: active ? 'translateY(-1px) scale(1.06)' : 'none', transition: 'transform .15s' }}>{t.icon}</span>
            <span style={{ fontSize: 10.5, fontWeight: active ? 800 : 600, letterSpacing: .2 }}>{t.label}</span>
            {active && <span style={{ position: 'absolute', top: 6, width: 26, height: 3, borderRadius: 3, background: 'linear-gradient(90deg,#3b82f6,#7c3aed)' }} />}
          </button>
        );
      })}
    </nav>
  );
}
