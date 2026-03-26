import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, languageNames } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState as useStateAuth } from 'react';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-xl border-b border-border/30 overflow-hidden">
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
            <img src={aladiahLogo} alt="Aladiah Academy" className="h-20 lg:h-24 w-auto object-contain" />
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
  const [user, setUser] = useStateAuth<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (user) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="hidden sm:flex items-center gap-2">
        <Button variant="hero" size="sm" onClick={() => navigate('/portal')}>{t('nav.portal')}</Button>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          {t('nav.logout')}
        </button>
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
  const [user, setUser] = useStateAuth<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    onClose();
    await supabase.auth.signOut();
    navigate('/');
  };

  if (user) {
    return (
      <div className="mt-4 space-y-2">
        <Button variant="hero" size="lg" className="w-full" onClick={() => { onClose(); navigate('/portal'); }}>
          {t('nav.portal')}
        </Button>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '10px',
            borderRadius: '10px', fontSize: '13px', fontWeight: 600,
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
          }}
        >
          {t('nav.logout')}
        </button>
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
