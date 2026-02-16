import { Mail, MapPin, Phone, Linkedin, ArrowUpRight, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';

const Footer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const links = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.programs', href: '#programs' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.contact', href: '#contact' },
    { key: 'nav.store', href: '/store', isRoute: true },
    { key: 'nav.feedback', href: '/feedback', isRoute: true },
    { key: 'nav.referral', href: '/referral', isRoute: true },
    { key: 'Admin', href: '/admin', isRoute: true, raw: true },
  ];

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="py-16 lg:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img src={aladiahLogo} alt="Aladiah Academy" className="h-[12.5rem] w-auto object-contain mix-blend-screen" />
              </div>
              <p className="text-white/60 max-w-md mb-6 leading-relaxed">
                {t('footer.description')}
              </p>
              <p className="text-sm text-white/40 mb-6">
                {t('footer.company')}
              </p>
              {/* Social */}
              <div className="flex items-center gap-3">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-4 h-4 text-white/70" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-wider">{t('footer.quickLinks')}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if ((link as any).isRoute) {
                          e.preventDefault();
                          navigate(link.href);
                        }
                      }}
                      className="text-white/60 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {(link as any).raw ? link.key : t(link.key)}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-wider">{t('footer.contact')}</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/60">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm">{t('footer.location')}</span>
                </li>
                <li className="flex items-center gap-3 text-white/60">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm">info@aladiahacademy.com</span>
                </li>
                <li className="flex items-center gap-3 text-white/60">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm">+1 (809) 555-0123</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Aladiah Academy. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => navigate('/portal')}
                className="text-white/40 hover:text-white text-xs transition-colors"
              >
                My Portal
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1 text-white/40 hover:text-secondary text-xs transition-colors"
              >
                <Shield className="w-3 h-3" />
                Admin
              </button>
            )}
            <p className="text-white/30 text-xs">
              Powered by AI Innovation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
