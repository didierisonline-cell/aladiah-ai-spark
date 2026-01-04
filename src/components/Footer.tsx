import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const links = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.programs', href: '#programs' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.contact', href: '#contact' },
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-ocean flex items-center justify-center">
                <span className="font-display font-bold text-lg text-white">A</span>
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white">Aladiah</span>
                <span className="font-display font-medium text-lg text-secondary ml-1">Academy</span>
              </div>
            </div>
            <p className="text-white/70 max-w-md mb-4">
              {t('footer.description')}
            </p>
            <p className="text-sm text-white/50">
              {t('footer.company')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>{t('footer.location')}</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Mail className="w-4 h-4 text-secondary" />
                <span>info@aladiahacademy.com</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+1 (809) 555-0123</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Aladiah Academy. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
