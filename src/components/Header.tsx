import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.programs', href: '#programs' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.contact', href: '#contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-ocean flex items-center justify-center shadow-soft">
              <span className="text-primary-foreground font-display font-bold text-lg">A</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-foreground">Aladiah</span>
              <span className="font-display font-medium text-lg text-secondary ml-1">Academy</span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.key}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {t(item.key)}
              </motion.a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{language}</span>
            </motion.button>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hidden sm:block"
            >
              <Button variant="hero" size="sm">
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
            className="lg:hidden bg-card border-t border-border/50"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </a>
              ))}
              <Button variant="hero" size="lg" className="mt-4">
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
