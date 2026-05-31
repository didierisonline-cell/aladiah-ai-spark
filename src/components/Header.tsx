import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage, languageNames } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';

function getStoredUser(): any | null {
  try {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (!key) return null;
    const stored = JSON.parse(localStorage.getItem(key) || '');
    return stored?.user ?? null;
  } catch {
    return null;
  }
}

type Language = 'en' | 'es' | 'zh' | 'ar' | 'fr' | 'de' | 'ja';

interface HeaderProps {
  onProfileClick?: () => void;
}

const Header = ({ onProfileClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isPortal = pathname.startsWith('/portal') || pathname.startsWith('/resume-studio') || pathname.startsWith('/interview') || pathname.startsWith('/admin') || pathname.startsWith('/course') || pathname.startsWith('/chapter');

  const publicNavItems = [
    { labelKey: 'nav.home', href: '/' },
    { labelKey: 'nav.schools', href: '/schools' },
    { labelKey: 'nav.certifications', href: '/certifications' },
    { labelKey: 'nav.talent_network', href: '/talent-network' },
    { labelKey: 'nav.pricing', href: '/pricing' },
    { labelKey: 'nav.portal', href: '/portal' },
  ];

  const portalNavItems = [
    { labelKey: 'nav.portal', href: '/portal' },
    { labelKey: 'nav.courses', href: '/portal/courses' },
    { label: 'Simulations', href: '/portal/simulations' },
    { labelKey: 'nav.talent_score', href: '/portal/talent-score' },
    { labelKey: 'nav.career', href: '/portal/career' },
    { labelKey: 'nav.community', href: '/community' },
    { labelKey: 'nav.resources', href: '/portal/resources' },
  ];

  const navItems = isPortal ? portalNavItems : publicNavItems;

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 70,
      background: 'rgba(11,17,30,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(30,45,71,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem',
    }}>
      {/* Logo */}
      <a href="/" onClick={e => { e.preventDefault(); navigate('/'); }} style={{ display: 'flex', alignItems: 'center' }}>
        <Logo variant="full" style={{ height: 44, width: 'auto' }} />
      </a>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', gap: '1.5rem', listStyle: 'none' }} className="hide-mobile">
        {navItems.map(item => (
          <a
            key={item.href}
            href={item.href}
            onClick={e => { e.preventDefault(); navigate(item.href); }}
            style={{
              fontSize: 13, fontWeight: 500,
              color: pathname === item.href ? '#EDF2F7' : '#8596AD',
              transition: 'color .2s', padding: '2px 0',
              borderBottom: pathname === item.href ? '2px solid #4A90F5' : '2px solid transparent',
              textDecoration: 'none',
            }}
          >
            {(item as any).label || t(item.labelKey)}
          </a>
        ))}
      </nav>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {!isPortal && (
          <a
            href="https://www.aladiahmanagement.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11, fontWeight: 700, color: '#F0622A',
              border: '1px solid rgba(240,98,42,.28)',
              padding: '3px 10px', borderRadius: 999, transition: 'all .2s',
              textDecoration: 'none',
            }}
          >
            Enterprise ↗
          </a>
        )}

        {/* Language picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button style={{
              fontSize: 11, fontWeight: 700, color: '#8596AD',
              background: '#111D30', border: '1px solid #1E2D47',
              padding: '4px 8px', borderRadius: '0.4rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {language.toUpperCase()} <ChevronDown size={10} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ minWidth: 160 }}>
            {(Object.keys(languageNames) as Language[]).map(lang => (
              <DropdownMenuItem
                key={lang}
                onClick={() => setLanguage(lang)}
                className={language === lang ? 'bg-primary/10 text-primary font-semibold' : ''}
              >
                <span style={{ textTransform: 'uppercase', marginRight: 8, fontSize: 11, opacity: .5 }}>{lang}</span>
                <span>{languageNames[lang]}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <AuthNavButton navigate={navigate} isPortal={isPortal} />

        {/* Mobile toggle */}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8596AD', padding: 4 }}
          className="show-mobile"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute', top: 70, left: 0, right: 0,
          background: '#111D30', borderBottom: '1px solid #1E2D47',
          padding: '1rem 2rem', zIndex: 99,
        }}>
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={e => { e.preventDefault(); navigate(item.href); setIsMenuOpen(false); }}
              style={{
                display: 'block', padding: '0.65rem 0',
                fontSize: 14, fontWeight: 500, color: '#8596AD',
                borderBottom: '1px solid rgba(30,45,71,.3)', textDecoration: 'none',
              }}
            >
              {(item as any).label || t(item.labelKey)}
            </a>
          ))}
          <MobileAuthButtons navigate={navigate} isPortal={isPortal} onClose={() => setIsMenuOpen(false)} />
        </div>
      )}

      <style>{`
        @media(max-width:900px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}}
        @media(min-width:901px){.show-mobile{display:none!important}}
      `}</style>
    </header>
  );
};

function AuthNavButton({ navigate, isPortal }: { navigate: (p: string) => void; isPortal: boolean }) {
  const [user, setUser] = useState<any>(getStoredUser());
  const { pathname } = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null)).catch(() => {});
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    // Sign out of Supabase first, then clear local token, then hard-redirect.
    try { await supabase.auth.signOut(); } catch { /* ignore network errors */ }
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (key) localStorage.removeItem(key);
    setUser(null);
    // Hard redirect (full reload) guarantees all in-memory auth state is wiped
    // so the student lands cleanly on the login page, fully logged out.
    window.location.href = '/auth';
  };

  const btnStyle = (bg: string, color: string, border?: string) => ({
    fontSize: 12, fontWeight: 700, color,
    background: bg, border: border || 'none',
    padding: '6px 14px', borderRadius: '0.5rem',
    cursor: 'pointer', transition: 'all .2s', textDecoration: 'none',
    display: 'inline-block',
  });

  if (user) {
    if (pathname.startsWith('/course') || pathname.startsWith('/chapter')) {
      return (
        <a href="/portal" onClick={e => { e.preventDefault(); navigate('/portal'); }}
          style={btnStyle('#4A90F5', '#fff')}>← Portal</a>
      );
    }
    if (isPortal) {
      return (
        <button onClick={handleLogout} style={btnStyle('transparent', '#F0622A', '1px solid rgba(240,98,42,.4)')}>
          Done for the Day
        </button>
      );
    }
    return (
      <a href="/portal" onClick={e => { e.preventDefault(); navigate('/portal'); }}
        style={btnStyle('#4A90F5', '#fff')}>My Portal →</a>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <a href="/auth" onClick={e => { e.preventDefault(); navigate('/auth'); }}
        style={btnStyle('transparent', '#8596AD', '1px solid #1E2D47')}>Sign In</a>
      <a href="/pricing" onClick={e => { e.preventDefault(); navigate('/pricing'); }}
        style={btnStyle('#4A90F5', '#fff')}>Enroll →</a>
    </div>
  );
}

function MobileAuthButtons({ navigate, isPortal, onClose }: { navigate: (p: string) => void; isPortal: boolean; onClose: () => void }) {
  const [user, setUser] = useState<any>(getStoredUser());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null)).catch(() => {});
    return () => subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      <div style={{ marginTop: '1rem' }}>
        <a href="/portal" onClick={e => { e.preventDefault(); navigate('/portal'); onClose(); }}
          style={{ display: 'block', padding: '0.65rem', textAlign: 'center', background: '#4A90F5', color: '#fff', borderRadius: '0.5rem', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          My Portal →
        </a>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
      <a href="/auth" onClick={e => { e.preventDefault(); navigate('/auth'); onClose(); }}
        style={{ flex: 1, display: 'block', padding: '0.65rem', textAlign: 'center', background: 'transparent', border: '1px solid #1E2D47', color: '#8596AD', borderRadius: '0.5rem', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
        Sign In
      </a>
      <a href="/pricing" onClick={e => { e.preventDefault(); navigate('/pricing'); onClose(); }}
        style={{ flex: 1, display: 'block', padding: '0.65rem', textAlign: 'center', background: '#4A90F5', color: '#fff', borderRadius: '0.5rem', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
        Enroll →
      </a>
    </div>
  );
}

export default Header;
