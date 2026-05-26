import { forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import aladiahLogo from '@/assets/aladiah-header-logo-new.png';

const LANGUAGES = [
  '🇺🇸 EN','🇪🇸 ES','🇫🇷 FR','🇩🇪 DE','🇨🇳 ZH','🇸🇦 AR','🇯🇵 JA',
  '🇧🇷 PT','🇮🇳 HI','🇰🇷 KO','🇮🇹 IT','🇷🇺 RU','🇳🇬 YO','🇳🇬 HA',
  '🇳🇬 IG','🇰🇪 SW','🇻🇳 VI','🇹🇭 TH','🇳🇱 NL','🇵🇱 PL','🇹🇷 TR',
];

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPortal = location.pathname.startsWith('/portal') || location.pathname.startsWith('/course') || location.pathname.startsWith('/chapter');
  if (isPortal) return null;

  const lnk = (label: string, href: string) => (
    <a key={label} href={href}
      onClick={e => { if (href.startsWith('/')) { e.preventDefault(); navigate(href); } }}
      style={{ display: 'block', fontSize: 12, color: '#8596AD', marginBottom: '0.35rem', textDecoration: 'none', transition: 'color .2s' }}
      onMouseEnter={e => (e.currentTarget.style.color = '#4A90F5')}
      onMouseLeave={e => (e.currentTarget.style.color = '#8596AD')}
    >{label}</a>
  );

  return (
    <footer ref={ref} style={{ background: '#0B111E', borderTop: '1px solid #1E2D47', padding: '3rem 0 1.75rem', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2.5rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <img src={aladiahLogo} alt="Aladiah Academy" style={{ height: 40, width: 'auto', objectFit: 'contain', marginBottom: '0.4rem' }} />
            <div style={{ fontSize: 11, color: '#8596AD', fontStyle: 'italic', marginBottom: '0.75rem' }}>"Solo Excelencia" — Where AI Leaders Are Built</div>
            <p style={{ fontSize: 11, color: '#8596AD', lineHeight: 1.6, maxWidth: 250 }}>AI Workforce Infrastructure. 4 Schools. 30+ Programs. 20+ Languages. Global Placement Network.</p>
            <div style={{ marginTop: '0.85rem' }}>
              <a href="https://www.aladiahmanagement.com" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, fontWeight: 700, color: '#F0622A', border: '1px solid rgba(240,98,42,.28)', padding: '4px 12px', borderRadius: '0.4rem', textDecoration: 'none' }}>
                aladiahmanagement.com ↗
              </a>
            </div>
          </div>
          {/* Schools */}
          <div>
            <h5 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8596AD', marginBottom: '0.65rem' }}>Schools</h5>
            {lnk('AI Engineering', '/schools')}
            {lnk('AI Business', '/schools')}
            {lnk('Governance & Risk', '/schools')}
            {lnk('Human-AI Experience', '/schools')}
          </div>
          {/* Platform */}
          <div>
            <h5 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8596AD', marginBottom: '0.65rem' }}>Platform</h5>
            {lnk('Certifications', '/certifications')}
            {lnk('Talent Network', '/talent-network')}
            {lnk('Pricing', '/pricing')}
            {lnk('Employer Portal', '/employers')}
            {lnk('Student Portal', '/portal')}
          </div>
          {/* Company */}
          <div>
            <h5 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8596AD', marginBottom: '0.65rem' }}>Company</h5>
            {lnk('About', '/')}
            {lnk('Referral Program', '/referral')}
            {lnk('Community', '/community')}
            <a href="https://www.aladiahmanagement.com" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', fontSize: 12, color: '#8596AD', marginBottom: '0.35rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#4A90F5')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8596AD')}
            >Aladiah Management</a>
            {lnk('Feedback', '/feedback')}
          </div>
        </div>
        {/* Bottom row */}
        <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #1E2D47', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: 11, color: '#8596AD' }}>© 2026 Aladiah Academy · Aladiah Management SRL · Santo Domingo, Dominican Republic</div>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {LANGUAGES.map(lang => (
              <button key={lang} style={{
                fontSize: 10, fontWeight: 700, color: '#8596AD',
                background: '#111D30', border: '1px solid #1E2D47',
                padding: '3px 7px', borderRadius: '0.3rem', cursor: 'pointer', transition: 'all .2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#4A90F5'; (e.currentTarget as HTMLElement).style.borderColor = '#4A90F5'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8596AD'; (e.currentTarget as HTMLElement).style.borderColor = '#1E2D47'; }}
              >{lang}</button>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){footer .ft-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
