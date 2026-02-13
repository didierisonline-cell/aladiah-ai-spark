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

type Language = 'en' | 'es' | 'zh' | 'ar' | 'fr' | 'de' | 'ja';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.programs', href: '#programs' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.contact', href: '#contact' },
    { key: 'nav.community', href: '/community', isRoute: true },
    { key: 'nav.feedback', href: '/feedback', isRoute: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-muted backdrop-blur-xl border-b border-border/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={aladiahLogo} alt="Aladiah Academy" className="h-20 lg:h-24 w-auto object-contain py-1 mix-blend-multiply" />
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
                  }
                }}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 font-medium text-sm"
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

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hidden sm:block"
            >
              <Button variant="hero" size="sm" onClick={() => navigate('/enroll?course=scrum')}>
                {t('nav.enroll')}
              </Button>
            </motion.div>

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
                    }
                  }}
                >
                  {t(item.key)}
                </a>
              ))}
              <Button variant="hero" size="lg" className="mt-4" onClick={() => { setIsMenuOpen(false); navigate('/enroll?course=scrum'); }}>
                {t('nav.enroll')}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
