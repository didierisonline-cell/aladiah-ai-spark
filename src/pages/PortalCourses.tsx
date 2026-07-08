import { useNavigate } from 'react-router-dom';
import { getLocalizedField } from '@/lib/i18nData';
import PortalShell from '@/components/portal/PortalShell';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import MobileLearn from '@/components/portal/MobileLearn';
import { getProgramStatus, type ProgramStatus } from '@/config/mvpCatalog';

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
  // Fully built programs — pinned to top
  'AI Scrum Master Professional Certification v2': '🏆',
  'AI Project Manager & Delivery Leader': '📋',
  'AI Enterprise Cybersecurity, Governance & Digital Trust': '🔐',
  'AI Data Analyst & Decision Intelligence Professional': '📉',
  'AI Business Analyst & Product Discovery Specialist': '📊',
  // All other programs
  'AI Cloud Engineer': '☁️',
  'AI Agent Engineer': '🤖',
  'AI Data Engineer': '🗄️',
  'AI DevOps Engineer': '⚙️',
  'AI Security Engineer': '🛡️',
  'AI MLOps Engineer': '🔁',
  'AI Platform Engineer': '🏗️',
  'AI Governance Professional': '⚖️',
  'AI Product Manager': '📱',
  'AI Solutions Consultant': '💼',
  'AI Sales Engineer': '🎯',
  'AI Transformation Manager': '🔄',
  'AI Enterprise Architect': '🏛️',
  'AI Program Manager': '📊',
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

// Fully built programs — appear first in this exact order
const PINNED_VERSIONS = ['v3.0', 'pm-v1', 'cyber-v1', 'da-v1', 'ba-v1'];

function pinnedRank(cv: string | null): number {
  if (!cv) return PINNED_VERSIONS.length;
  const i = PINNED_VERSIONS.indexOf(cv);
  return i === -1 ? PINNED_VERSIONS.length : i;
}

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
      .select('id, title, description, translations, curriculum_version')
      .eq('is_published', true)
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

  // Pinned production programs appear first (in build order), then everything else
  // alphabetically. The student's selected program keeps its highlight badge but
  // stays in its natural position unless it's already pinned.
  const orderedCourses = [...courses].sort((a, b) => {
    const ra = pinnedRank(a.curriculum_version);
    const rb = pinnedRank(b.curriculum_version);
    if (ra !== rb) return ra - rb;
    return (a.title as string).localeCompare(b.title as string);
  });

  // MVP gating (WO-P0-001): only Active programs are enterable. Preview and
  // Coming Soon programs stay visible (nothing is unpublished) but do not open.
  if (isPhone) return <MobileLearn courses={orderedCourses.filter((c) => getProgramStatus(c) === 'active')} loading={loading} selectedId={selectedId} />;

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
                const status: ProgramStatus = getProgramStatus(c);
                const enterable = status === 'active';
                const isSelected = enterable && c.id === selectedId;
                const statusChip = status === 'active'
                  ? { label: 'Active', color: DS.green, bg: 'rgba(34,201,138,.12)', bd: 'rgba(34,201,138,.28)' }
                  : status === 'preview'
                    ? { label: 'Preview', color: '#F5B81A', bg: 'rgba(245,184,26,.12)', bd: 'rgba(245,184,26,.28)' }
                    : { label: 'Coming Soon', color: DS.fm, bg: 'rgba(133,150,173,.12)', bd: 'rgba(133,150,173,.25)' };
                return (
                  <div
                    key={c.id}
                    onClick={enterable ? () => navigate(`/portal/course/${c.id}`) : undefined}
                    style={{ background: DS.card, border: `1px solid ${isSelected ? DS.blue : DS.border}`, borderRadius: '.875rem', padding: '1.5rem', cursor: enterable ? 'pointer' : 'default', transition: 'all .18s', boxShadow: isSelected ? '0 0 0 1px rgba(74,144,245,.35)' : 'none', opacity: enterable ? 1 : 0.6 }}
                    onMouseEnter={enterable ? e => { (e.currentTarget as HTMLElement).style.borderColor = DS.bb; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.25)'; } : undefined}
                    onMouseLeave={enterable ? e => { (e.currentTarget as HTMLElement).style.borderColor = isSelected ? DS.blue : DS.border; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = isSelected ? '0 0 0 1px rgba(74,144,245,.35)' : 'none'; } : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                      <div style={{ fontSize: 32 }}>{icon}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: statusChip.color, background: statusChip.bg, border: `1px solid ${statusChip.bd}`, borderRadius: 99, padding: '3px 10px', letterSpacing: '.04em' }}>{statusChip.label}</span>
                        {isSelected && <span style={{ fontSize: 10, fontWeight: 800, color: DS.blue, background: 'rgba(74,144,245,.12)', border: `1px solid ${DS.bb}`, borderRadius: 99, padding: '3px 10px', letterSpacing: '.04em' }}>{t('courses.your_program')}</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '.4rem', lineHeight: 1.3 }}>{getLocalizedField(c, language, 'title')}</div>
                    <div style={{ fontSize: 12, color: DS.fm, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                      {getLocalizedField(c, language, 'description')}
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: enterable ? DS.green : DS.fm, fontWeight: 600 }}>{enterable ? t('courses.access_pass') : statusChip.label}</span>
                      <span style={{ fontSize: 12, color: isSelected ? DS.blue : DS.fm, fontWeight: isSelected ? 700 : 400 }}>{enterable ? (isSelected ? t('courses.continue') : t('courses.start')) : '🔒'}</span>
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
