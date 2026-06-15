import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import PortalSidebar from '@/components/PortalSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import MobileLearn from '@/components/portal/MobileLearn';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
  green:'#22C98A',
};

const SCHOOL_COLORS: Record<string, string> = {
  'AI Engineering': '#4A90F5',
  'AI Business': '#F0622A',
  'Governance & Risk': '#22C98A',
  'Human-AI Experience': '#9B59B6',
};

const COURSE_ICONS: Record<string, string> = {
  'AI Cloud Engineer': '☁️',
  'AI Agent Engineer': '🤖',
  'AI Data Engineer': '🗄️',
  'AI DevOps Engineer': '⚙️',
  'AI Security Engineer': '🛡️',
  'AI MLOps Engineer': '🔁',
  'AI Platform Engineer': '🏗️',
  'AI Governance Professional': '⚖️',
  'AI Product Manager': '📱',
  'AI Business Analyst': '📊',
  'AI Solutions Consultant': '💼',
  'AI Sales Engineer': '🎯',
  'AI Transformation Manager': '🔄',
  'AI Enterprise Architect': '🏛️',
  'AI Program Manager': '📋',
  'AI Business Operations': '📈',
  'Responsible AI Specialist': '🌱',
  'AI Compliance Officer': '📜',
  'AI Risk Manager': '⚠️',
  'AI Auditor': '🔍',
  'AI Policy Designer': '🗝️',
  'AI Ethics Specialist': '🧭',
  'AI UX Designer': '🎨',
  'Conversation Designer': '💬',
  'Human-AI Interaction Specialist': '🤝',
  'AI Workflow Designer': '🔀',
  'AI Experience Architect': '✨',
};

export default function PortalCourses() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isPhone } = useBreakpoint();

  useEffect(() => {
    if (!user) return;
    supabase
      .from('courses')
      .select('id, title, description, translations')
      .eq('is_published', true)
      .order('title')
      .then(({ data }) => {
        if (data) setCourses(data);
        setLoading(false);
      });
  }, [user]);

  if (isPhone) return <MobileLearn courses={courses} loading={loading} />;

  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <div className="portal-shell" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', paddingTop: 70 }}>
        <PortalSidebar />
        <main style={{ padding: '2rem', background: DS.bg }}>
          <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Academy</h1>
              <div style={{ fontSize: 13, color: DS.fm, marginTop: '.2rem' }}>Select a course to start learning.</div>
            </div>
            <button onClick={() => navigate('/portal/my-career-path')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #4A90F5, #7AB5FF)', border: 'none', borderRadius: '.75rem', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(74,144,245,.35)', whiteSpace: 'nowrap' }}>🎯 My Career Path</button>
          </div>

          {loading ? (
            <div style={{ color: DS.fm, fontSize: 14 }}>Loading courses...</div>
          ) : courses.length === 0 ? (
            <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: '.75rem' }}>📚</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '.5rem' }}>No Courses Yet</div>
              <div style={{ fontSize: 13, color: DS.fm }}>Check back soon — courses are being added.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {courses.map((c) => {
                const icon = COURSE_ICONS[c.title] || '📖';
                return (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/portal/course/${c.id}`)}
                    style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.875rem', padding: '1.5rem', cursor: 'pointer', transition: 'all .18s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = DS.bb; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.25)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = DS.border; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: 32, marginBottom: '.75rem' }}>{icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '.4rem', lineHeight: 1.3 }}>{c.translations?.[language]?.title || c.title}</div>
                    <div style={{ fontSize: 12, color: DS.fm, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                      {c.description}
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: DS.green, fontWeight: 600 }}>All-Access Pass™</span>
                      <span style={{ fontSize: 12, color: DS.fm }}>Start →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
