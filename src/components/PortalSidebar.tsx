import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

const DS = {
  card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD', fd:'#4A5E7A',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)',
  orange:'#F0622A', gold:'#F5B81A',
};

export default function PortalSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const initials = (user?.email?.slice(0,1) || 'A').toUpperCase() +
                   (user?.email?.split('@')[0]?.slice(1,2) || '').toUpperCase();

  const LINKS = [
    { icon:'📊', label: t('portal.sidebar.overview'),       path:'/portal' },
    { icon:'📚', label: t('portal.sidebar.my_courses'),     path:'/portal/courses', badge:'28' },
    { icon:'⭐', label: t('portal.sidebar.talent_score'),   path:'/portal/talent-score' },
    { icon:'🏅', label: t('portal.sidebar.certifications'), path:'/portal' },
    { icon:'💼', label: t('portal.sidebar.career_tools'),   path:'/portal/career' },
    { icon:'🗂️', label: t('portal.sidebar.my_portfolio'),   path:'/portal/portfolio' },
    { icon:'🧪', label: t('portal.sidebar.labs'),           path:'/portal' },
    { icon:'📖', label: t('portal.sidebar.resources'),      path:'/portal' },
    { icon:'👥', label: t('portal.sidebar.community'),      path:'/community' },
    { icon:'⚙️', label: t('portal.sidebar.settings'),       path:'/portal/settings' },
  ];

  const isActive = (path: string, label: string) => {
    if (path === '/portal' && label === t('portal.sidebar.overview')) return pathname === '/portal';
    return pathname === path;
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    display:'flex', alignItems:'center', gap:'.75rem',
    padding:'.65rem 1.5rem', fontSize:13,
    fontWeight: active ? 700 : 500,
    color: active ? DS.blue : DS.fm,
    background: active ? DS.bd : 'transparent',
    borderLeft: active ? `3px solid ${DS.blue}` : '3px solid transparent',
    textDecoration:'none', cursor:'pointer', transition:'all .2s',
  });

  return (
    <aside style={{ background:DS.card, borderRight:`1px solid ${DS.border}`, padding:'1.75rem 0', position:'sticky', top:70, height:'calc(100vh - 70px)', overflowY:'auto' }}>
      {/* User block */}
      <div style={{ padding:'1.25rem 1.5rem 1.5rem', borderBottom:`1px solid ${DS.border}` }}>
        <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#4A90F5,#7AB5FF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'#fff', marginBottom:'.65rem' }}>{initials}</div>
        <div style={{ fontSize:14, fontWeight:700, color:DS.fg }}>{user?.email?.split('@')[0] || 'Student'}</div>
        <div style={{ fontSize:11, color:DS.fm, marginTop:2 }}>{t('portal.sidebar.plan')}: <span style={{ color:DS.gold, fontWeight:600 }}>All-Access Pass™</span></div>
      </div>

      {/* Nav links */}
      <div style={{ padding:'.75rem 0' }}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:'uppercase' as const, color:DS.fd, padding:'.5rem 1.5rem .25rem' }}>
          {t('portal.sidebar.dashboard')}
        </div>
        {LINKS.map(link => {
          const active = isActive(link.path, link.label);
          return (
            <a key={link.label} onClick={e => { e.preventDefault(); navigate(link.path); }}
              style={linkStyle(active)}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background='rgba(74,144,245,.06)'; (e.currentTarget as HTMLElement).style.color=DS.fg; }}}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color=DS.fm; }}}>
              <span style={{ width:18, textAlign:'center' as const, flexShrink:0 }}>{link.icon}</span>
              {link.label}
              {link.badge && <span style={{ marginLeft:'auto', fontSize:10, background:DS.orange, color:'#fff', borderRadius:999, padding:'1px 7px', fontWeight:700 }}>{link.badge}</span>}
            </a>
          );
        })}

        <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:'uppercase' as const, color:DS.fd, padding:'.75rem 1.5rem .25rem', marginTop:4 }}>
          {t('portal.sidebar.account')}
        </div>
        <a onClick={() => navigate('/portal/settings')} style={linkStyle(pathname === '/portal/settings')}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(74,144,245,.06)'; (e.currentTarget as HTMLElement).style.color=DS.fg; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color=DS.fm; }}>
          <span style={{ width:18, textAlign:'center' as const }}>⚙️</span> {t('portal.sidebar.settings')}
        </a>
        <a href="https://www.aladiahmanagement.com" target="_blank" rel="noopener noreferrer"
          style={{ ...linkStyle(false), textDecoration:'none' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(74,144,245,.06)'; (e.currentTarget as HTMLElement).style.color=DS.fg; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color=DS.fm; }}>
          <span style={{ width:18, textAlign:'center' as const }}>🏢</span> Aladiah Management
        </a>
      </div>
    </aside>
  );
}
