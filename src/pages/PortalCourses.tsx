import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
  gold:'#F5B81A', green:'#22C98A',
};

const SIDEBAR_LINKS = [
  { icon:'📊', label:'Overview', href:'/portal' },
  { icon:'📚', label:'My Courses', href:'/portal/courses', badge:'3' },
  { icon:'⭐', label:'Talent Score™', href:'/portal/talent-score' },
  { icon:'🏅', label:'Certifications', href:'/portal' },
  { icon:'💼', label:'Career Tools', href:'/portal/career' },
  { icon:'🗂️', label:'My Portfolio', href:'/portal/portfolio' },
  { icon:'⚙️', label:'Settings', href:'/portal/settings' },
];

export default function PortalCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = user?.email?.slice(0,2).toUpperCase() || 'AA';
  const pathname = '/portal/courses';
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('courses').select('id, title, description').order('sort_order').then(({ data }) => {
      if (data) setCourses(data);
    });
  }, [user]);

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', paddingTop: 70 }}>
        <aside style={{ background: DS.card, borderRight: `1px solid ${DS.border}`, padding: '1.75rem 0', position: 'sticky' as const, top: 70, height: 'calc(100vh - 70px)', overflowY: 'auto' as const }}>
          <div style={{ padding: '1.25rem 1.5rem 1.5rem', borderBottom: `1px solid ${DS.border}` }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#4A90F5,#7AB5FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: '.65rem' }}>{initials}</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{user?.email?.split('@')[0] || 'Student'}</div>
            <div style={{ fontSize: 11, color: DS.fm, marginTop: 2 }}>Plan: <span style={{ color: DS.gold, fontWeight: 600 }}>All-Access Pass™</span></div>
          </div>
          <div style={{ padding: '.75rem 0' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#4A5E7A', padding: '.5rem 1.5rem .25rem' }}>Dashboard</div>
            {SIDEBAR_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={e => { e.preventDefault(); navigate(link.href); }}
                style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.65rem 1.5rem', fontSize: 13, fontWeight: pathname === link.href ? 700 : 500, color: pathname === link.href ? DS.blue : DS.fm, background: pathname === link.href ? DS.bd : 'transparent', borderLeft: pathname === link.href ? `3px solid ${DS.blue}` : '3px solid transparent', textDecoration: 'none', transition: 'all .2s' }}>
                <span style={{ width: 18, textAlign: 'center' as const }}>{link.icon}</span>
                {link.label}
                {link.badge && <span style={{ marginLeft: 'auto', fontSize: 10, background: DS.orange, color: '#fff', borderRadius: 999, padding: '1px 7px', fontWeight: 700 }}>{link.badge}</span>}
              </a>
            ))}
          </div>
        </aside>
        <main style={{ padding: '2rem', background: DS.bg }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Courses</h1>
            <div style={{ fontSize: 13, color: DS.fm, marginTop: '.2rem' }}>Your enrolled programs and progress.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '.6rem' }}>
            {courses.length > 0 ? courses.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', transition: 'all .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = DS.bb; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = DS.border; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: DS.od, border: `2px solid ${DS.ob}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: DS.orange, flexShrink: 0 }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: DS.fm, marginTop: 2 }}>0% complete</div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '0%', background: `linear-gradient(90deg,${DS.orange},#F5895E)`, borderRadius: 2 }}/>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate('/courses')} style={{ fontSize: 12, fontWeight: 700, padding: '.48rem 1rem', borderRadius: '.5rem', background: 'transparent', color: DS.fg, border: `1px solid ${DS.border}`, cursor: 'pointer', marginLeft: '1rem', whiteSpace: 'nowrap' as const }}>Continue →</button>
              </div>
            )) : (
              <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '3rem', textAlign: 'center' as const }}>
                <div style={{ fontSize: 32, marginBottom: '.75rem' }}>📚</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '.5rem' }}>No Courses Yet</div>
                <div style={{ fontSize: 13, color: DS.fm, marginBottom: '1.25rem' }}>Your enrolled courses will appear here.</div>
                <button onClick={() => navigate('/courses')} style={{ fontSize: 13, fontWeight: 700, padding: '.68rem 1.5rem', borderRadius: '.75rem', background: DS.blue, color: '#fff', border: 'none', cursor: 'pointer' }}>Browse Courses →</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
