import { useNavigate } from 'react-router-dom';
import PortalShell from '@/components/portal/PortalShell';
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
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isPhone } = useBreakpoint();

  useEffect(() => {
    if (!user) return;
    // Load published programs AND the student's selected program (free_course_id) so
    // the Learn tab continues with the SAME program chosen at signup, not courses[0].
    supabase
      .from('courses')
      .select('id, title, description, translations')
      .eq('is_published', true)
      .order('title')
      .then(({ data }) => {
        if (data) setCourses(data);
        setLoading(false);
      });
    supabase
      .from('profiles')
      .select('free_course_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setSelectedId(data?.free_course_id ?? null));
  }, [user]);

  // Selected program first, so both the phone "continue" card and the desktop grid
  // lead with the program the student actually chose.
  const orderedCourses = selectedId
    ? [...courses].sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0))
    : courses;

  if (isPhone) return <MobileLearn courses={orderedCourses} loading={loading} selectedId={selectedId} />;

  return (
    <PortalShell background={DS.bg}>
        <main style={{ padding: '2rem', background: DS.bg }}>
          <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('courses.title')}</h1>
              <div style={{ fontSize: 13, color: DS.fm, marginTop: '.2rem' }}>{t('courses.subtitle')}</div>
            </div>
            <button onClick={() => navigate('/portal/my-career-path')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #4A90F5, #7AB5FF)', border: 'none', borderRadius: '.75rem', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(74,144,245,.35)', whiteSpace: 'nowrap' }}>{t('courses.my_career_path')}</button>
          </div>

          {loading ? (
            <div style={{ color: DS.fm, fontSize: 14 }}>{t('courses.loading')}</div>
          ) : courses.length === 0 ? (
            <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: '.75rem' }}>📚</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '.5rem' }}>{t('courses.no_programs')}</div>
              <div style={{ fontSize: 13, color: DS.fm }}>{t('courses.no_programs_sub')}</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {orderedCourses.map((c) => {
                const icon = COURSE_ICONS[c.title] || '📖';
                const isSelected = c.id === selectedId;
                return (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/portal/course/${c.id}`)}
                    style={{ background: DS.card, border: `1px solid ${isSelected ? DS.blue : DS.border}`, borderRadius: '.875rem', padding: '1.5rem', cursor: 'pointer', transition: 'all .18s', boxShadow: isSelected ? '0 0 0 1px rgba(74,144,245,.35)' : 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = DS.bb; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.25)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isSelected ? DS.blue : DS.border; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = isSelected ? '0 0 0 1px rgba(74,144,245,.35)' : 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                      <div style={{ fontSize: 32 }}>{icon}</div>
                      {isSelected && <span style={{ fontSize: 10, fontWeight: 800, color: DS.blue, background: 'rgba(74,144,245,.12)', border: `1px solid ${DS.bb}`, borderRadius: 99, padding: '3px 10px', letterSpacing: '.04em' }}>{t('courses.your_program')}</span>}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '.4rem', lineHeight: 1.3 }}>{c.translations?.[language]?.title || c.title}</div>
                    <div style={{ fontSize: 12, color: DS.fm, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                      {c.description}
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: DS.green, fontWeight: 600 }}>{t('courses.access_pass')}</span>
                      <span style={{ fontSize: 12, color: isSelected ? DS.blue : DS.fm, fontWeight: isSelected ? 700 : 400 }}>{isSelected ? t('courses.continue') : t('courses.start')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
    </PortalShell>
  );
}
