import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, languageNames } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';
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

  const navItems = [
    { key: 'nav.home', href: '/#home' },
    { key: 'nav.programs', href: '/#programs' },
    { key: 'nav.about', href: '/#about' },
    { key: 'nav.contact', href: '/#contact' },
    { key: 'nav.community', href: '/community', isRoute: true },
    { key: 'nav.store', href: '/store', isRoute: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <motion.a
            href="/#home"
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                const el = document.querySelector('#home');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <img src={aladiahLogo} alt="Aladiah Academy" className="h-14 sm:h-20 lg:h-24 w-auto object-contain" />
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  if ((item as any).isRoute) {
                    e.preventDefault();
                    navigate(item.href);
                  } else if (item.href.includes('#') && window.location.pathname === '/') {
                    e.preventDefault();
                    const hash = item.href.split('#')[1];
                    const el = document.querySelector('#' + hash);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2 rounded-lg text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-200 font-medium text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {t(item.key)}
              </motion.a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Profile Button */}
            {onProfileClick && (
              <motion.button
                onClick={onProfileClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
              >
                <span style={{ fontSize: '16px' }}>👤</span>
              </motion.button>
            )}

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase text-xs font-semibold">{language}</span>
                  <ChevronDown className="w-3 h-3" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px] backdrop-blur-xl">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={language === lang ? 'bg-primary/10 text-primary font-semibold' : ''}
                  >
                    <span className="uppercase mr-2 text-xs font-mono opacity-50">{lang}</span>
                    <span>{languageNames[lang]}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA Button — swaps to Log Out when authenticated */}
            <AuthNavButton navigate={navigate} />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border/30"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="py-3 px-4 text-foreground hover:bg-muted/50 rounded-xl transition-colors font-medium"
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    if ((item as any).isRoute) {
                      e.preventDefault();
                      navigate(item.href);
                    } else if (item.href.includes('#') && window.location.pathname === '/') {
                      e.preventDefault();
                      const hash = item.href.split('#')[1];
                      const el = document.querySelector('#' + hash);
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {t(item.key)}
                </a>
              ))}
              <MobileAuthButton navigate={navigate} onClose={() => setIsMenuOpen(false)} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

function AuthNavButton({ navigate }: { navigate: (path: string) => void }) {
  const [user, setUser] = useState<any>(getStoredUser());
  const { t } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null)).catch(() => {});
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => {
    // Clear session from localStorage immediately so UI updates instantly
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (key) localStorage.removeItem(key);
    setUser(null);
    navigate('/');
    // Sign out from Supabase in the background
    supabase.auth.signOut().catch(() => {});
  };

  const isPortalRoute = pathname.startsWith('/portal') || pathname.startsWith('/resume-studio') || pathname.startsWith('/interview') || pathname.startsWith('/admin') || pathname.startsWith('/course') || pathname.startsWith('/chapter');
  const isCourseRoute = pathname.startsWith('/course') || pathname.startsWith('/chapter');

  if (user) {
    if (isCourseRoute) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="hidden sm:flex items-center gap-2">
          <Button variant="hero" size="sm" onClick={() => navigate('/portal')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Back to Portal
          </Button>
        </motion.div>
      );
    }
    if (isPortalRoute) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="hidden sm:flex items-center gap-2">
          <Button variant="hero" size="sm" onClick={handleLogout}>
            {t('nav.donefortheday')}
          </Button>
        </motion.div>
      );
    }
    // On public/marketing pages, logged-in users see "Get Busy" → takes them to their portal
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="hidden sm:block">
        <Button variant="hero" size="sm" onClick={() => navigate('/portal')}>{t('nav.getbusy')}</Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="hidden sm:block">
      <Button variant="hero" size="sm" onClick={() => navigate('/auth')}>{t('nav.getbusy')}</Button>
    </motion.div>
  );
}

function MobileAuthButton({ navigate, onClose }: { navigate: (path: string) => void; onClose: () => void }) {
  const [user, setUser] = useState<any>(getStoredUser());
  const { t } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null)).catch(() => {});
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (key) localStorage.removeItem(key);
    setUser(null);
    onClose();
    navigate('/');
    supabase.auth.signOut().catch(() => {});
  };

  const isPortalRoute = pathname.startsWith('/portal') || pathname.startsWith('/resume-studio') || pathname.startsWith('/interview') || pathname.startsWith('/admin') || pathname.startsWith('/course') || pathname.startsWith('/chapter');

  if (user) {
    return (
      <div className="mt-4 space-y-2">
        {isPortalRoute ? (
          <Button variant="hero" size="lg" className="w-full" onClick={handleLogout}>
            {t('nav.donefortheday')}
          </Button>
        ) : (
          <Button variant="hero" size="lg" className="w-full" onClick={() => { onClose(); navigate('/portal'); }}>
            {t('nav.getbusy')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Button variant="hero" size="lg" className="mt-4" onClick={() => { onClose(); navigate('/auth'); }}>
      {t('nav.getbusy')}
    </Button>
  );
}

export default Header;
