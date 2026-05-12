import { forwardRef, useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Linkedin, Instagram, Facebook, Twitter, ArrowUpRight, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';

const Footer = forwardRef<HTMLElement>((_, ref) => {
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

  const location = useLocation();

  const handleHashLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const hash = href.replace('#', '');
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: hash } });
    } else {
      const el = document.querySelector('#' + hash);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer ref={ref} className="relative overflow-hidden" style={{background:"#ffffff",borderTop:"1px solid rgba(0,0,0,0.1)",color:"#0a1628"}}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="py-16 lg:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img src={aladiahLogo} alt="Aladiah Academy" className="h-[12.5rem] w-auto object-contain mix-blend-screen" />
              </div>
              <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
                {t('footer.description')}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {t('footer.company')}
              </p>
              {/* Social */}
                            <div className="flex items-center gap-3 flex-wrap">
                <a key="li" href="https://linkedin.com/company/aladiahacademy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110"><Linkedin className="w-4 h-4 text-gray-700" /></a>
                <a key="ig" href="https://instagram.com/aladiahacademy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110"><Instagram className="w-4 h-4 text-gray-700" /></a>
                <a key="fb" href="https://facebook.com/aladiahacademy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110"><Facebook className="w-4 h-4 text-gray-700" /></a>
                <a key="tw" href="https://x.com/aladiahacademy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110"><Twitter className="w-4 h-4 text-gray-700" /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-bold text-primary mb-6 text-sm uppercase tracking-wider">{t('footer.quickLinks')}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if ((link as any).isRoute) {
                          e.preventDefault();
                          navigate(link.href);
                        } else if (link.href.startsWith('#')) {
                          handleHashLink(e, link.href);
                        }
                      }}
                      className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1 group"
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
              <h4 className="font-display font-bold text-primary mb-6 text-sm uppercase tracking-wider">{t('footer.contact')}</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm">{t('footer.location')}</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm">info@aladiahacademy.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-sm">+1 (809) 555-0123</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Aladiah Academy. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => navigate('/portal')}
                className="text-gray-500 hover:text-primary text-xs transition-colors"
              >
                My Portal
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1 text-gray-500 hover:text-secondary text-xs transition-colors"
              >
                <Shield className="w-3 h-3" />
                Admin
              </button>
            )}
            <p className="text-gray-400 text-xs">
              Powered by AI Innovation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
