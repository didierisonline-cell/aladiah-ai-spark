import { useNavigate, useParams } from 'react-router-dom';
import { getLocalizedField } from '@/lib/i18nData';
import PortalShell from '@/components/portal/PortalShell';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import MobileCourse from '@/components/portal/MobileCourse';
import { useLanguage } from '@/contexts/LanguageContext';
import { DEPRECATED_COURSE_REDIRECTS } from '@/lib/courseRedirects';
import { roleForEmail } from '@/lib/roles';
import { isPreviewOnlyCourse } from '@/config/coursePolicy';

const DS = {
  bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD',
  blue:'#4A90F5', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A', od:'rgba(240,98,42,.14)', ob:'rgba(240,98,42,.28)',
  green:'#22C98A', gold:'#F5B81A',
};

const MOD_ICONS = ['⚙️','📊','🛡️','🚀','🧠','💼','⚖️','🎨','📱','🔧','📈','🌐','🔁','🏗️','✨'];

export default function PortalCourseDetail() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const { t, language } = useLanguage();
  const { isPhone } = useBreakpoint();
  const isFounder = roleForEmail(user?.email) === 'founder';
  // P1-B: preview-only courses (e.g. Business Analyst) show as Preview and cannot be entered.
  const previewOnly = isPreviewOnlyCourse(courseId) && !isFounder;

  useEffect(() => {
    if (!user || !courseId) return;
    setUnavailable(false);
    // Stale-link safety: a known deprecated course id resolves straight to its
    // published replacement (the flagship) — no need to load the old row.
    const mapped = DEPRECATED_COURSE_REDIRECTS[courseId];
    if (mapped && mapped !== courseId) {
      navigate(`/portal/course/${mapped}`, { replace: true });
      return;
    }
    Promise.all([
      supabase.from('courses').select('id, title, description, translations, is_published').eq('id', courseId).single(),
      supabase.from('chapters').select('id, title, description, order_index, translations').eq('course_id', courseId).order('order_index'),
    ]).then(([courseRes, chaptersRes]) => {
      // Guard: students must not open an unpublished course. Redirect to the
      // mapped replacement if known, else show a "course moved" state. Founders
      // may still view historical rows (with a banner) for inspection.
      if (courseRes.data && courseRes.data.is_published === false && !isFounder) {
        const repl = DEPRECATED_COURSE_REDIRECTS[courseId];
        if (repl) { navigate(`/portal/course/${repl}`, { replace: true }); return; }
        setUnavailable(true); setLoading(false); return;
      }
      if (courseRes.data) setCourse(courseRes.data);
      const chaps = chaptersRes.data || [];
      setChapters(chaps);

      // Get video counts per chapter
      if (chaps.length > 0) {
        const chapterIds = chaps.map((c: any) => c.id);
        supabase
          .from('videos')
          .select('chapter_id')
          .in('chapter_id', chapterIds)
          .then(({ data }) => {
            const counts: Record<string, number> = {};
            (data || []).forEach((v: any) => {
              counts[v.chapter_id] = (counts[v.chapter_id] || 0) + 1;
            });
            setLessonCounts(counts);
          });

        // Completed modules = chapters whose chapter_end quiz the student has passed.
        Promise.all([
          supabase.from('quizzes').select('id, chapter_id, quiz_type').in('chapter_id', chapterIds).eq('quiz_type', 'chapter_end'),
          supabase.from('user_progress').select('quiz_id').eq('user_id', user.id).not('quiz_id', 'is', null),
        ]).then(([qz, pr]) => {
          const passed = new Set((pr.data || []).map((p: any) => p.quiz_id));
          const done = new Set<string>();
          (qz.data || []).forEach((q: any) => { if (passed.has(q.id)) done.add(q.chapter_id); });
          setCompleted(done);
        });
      }
      setLoading(false);
    });
  }, [user, courseId]);

  if (loading) return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {t('course.loading')}
    </div>
  );

  // Unpublished / retired course opened by a student (stale link with no mapped
  // replacement) — do not render old content; point them back to the catalog.
  if (unavailable) return (
    <PortalShell background={DS.bg}>
      <main style={{ padding: '4rem 2.5rem', background: DS.bg, textAlign: 'center', color: DS.fg }}>
        <div style={{ fontSize: 32, marginBottom: '.75rem' }}>📦</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '.5rem' }}>This course has moved</h1>
        <p style={{ fontSize: 14, color: DS.fm, maxWidth: 460, margin: '0 auto 1.5rem' }}>
          This course is no longer available here. Browse the current catalogue for the up-to-date program.
        </p>
        <button onClick={() => navigate('/portal/courses')}
          style={{ background: DS.blue, border: 'none', borderRadius: '.6rem', color: '#fff', fontSize: 13, fontWeight: 700, padding: '10px 22px', cursor: 'pointer' }}>
          Go to courses
        </button>
      </main>
    </PortalShell>
  );

  if (isPhone) return <MobileCourse course={course} chapters={chapters} lessonCounts={lessonCounts} completed={completed} />;

  return (
    <PortalShell background={DS.bg}>
        <main style={{ padding: '2rem 2.5rem', background: DS.bg }}>

          {/* Back */}
          <button
            onClick={() => navigate('/portal/courses')}
            style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: 13, color: DS.fm, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
          >
            {t('course.back')}
          </button>

          {/* Founder-only notice: viewing a historical/unpublished course row. */}
          {course && course.is_published === false && isFounder && (
            <div style={{ marginBottom: '1.25rem', padding: '.7rem 1rem', borderRadius: '.6rem', background: DS.od, border: `1px solid ${DS.ob}`, color: DS.gold, fontSize: 12.5, fontWeight: 600 }}>
              ⚠️ Founder view: this course is <strong>unpublished</strong> (historical row, not student-facing). Students are redirected to the published flagship.
            </div>
          )}

          {/* P1-B: Business Analyst preview lock (code-side; DB is_published unchanged). */}
          {previewOnly && (
            <div style={{ marginBottom: '1.25rem', padding: '.85rem 1.1rem', borderRadius: '.6rem', background: DS.od, border: `1px solid ${DS.ob}`, color: DS.gold, fontSize: 13, fontWeight: 700 }}>
              🔒 This program is in Preview — full lessons unlock soon.
            </div>
          )}

          {/* Course Hero */}
          {course && (
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.5rem' }}>{getLocalizedField(course, language, 'title')}</h1>
              <p style={{ fontSize: 14, color: DS.fm, lineHeight: 1.7, maxWidth: 680 }}>{getLocalizedField(course, language, 'description')}</p>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '.75rem' }}>
                <div style={{ fontSize: 13, color: DS.fm }}>
                  <span style={{ color: DS.orange, fontWeight: 700 }}>{chapters.length}</span> {t('course.modules')}
                </div>
                <div style={{ fontSize: 13, color: DS.fm }}>
                  <span style={{ color: DS.green, fontWeight: 700 }}>
                    {Object.values(lessonCounts).reduce((a, b) => a + b, 0)}
                  </span> {t('course.lessons')}
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: DS.border, marginBottom: '1.5rem' }} />

          {/* Modules */}
          <div style={{ fontSize: 11, fontWeight: 700, color: DS.fm, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.875rem' }}>
            {t('course.module_header')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {chapters.map((ch, i) => {
              const lessonCount = lessonCounts[ch.id] || 0;
              return (
                <div
                  key={ch.id}
                  onClick={() => { if (previewOnly) return; navigate(`/course/${courseId}/chapter/${ch.id}`); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1.25rem 1.5rem',
                    background: DS.card, border: `1px solid ${DS.border}`,
                    borderRadius: '.875rem', cursor: previewOnly ? 'default' : 'pointer', transition: 'all .18s',
                    opacity: previewOnly ? 0.6 : 1,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = DS.bb;
                    (e.currentTarget as HTMLElement).style.background = '#152035';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = DS.border;
                    (e.currentTarget as HTMLElement).style.background = DS.card;
                  }}
                >
                  {/* Number badge */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '.5rem',
                    background: DS.od, border: `1px solid ${DS.ob}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {MOD_ICONS[i % MOD_ICONS.length]}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{getLocalizedField(ch, language, 'title', 'chapter')}</div>
                    {ch.description && (
                      <div style={{
                        fontSize: 12, color: DS.fm,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                        maxWidth: 520,
                      }}>
                        {getLocalizedField(ch, language, 'description', 'chapter')}
                      </div>
                    )}
                    {lessonCount > 0 && (
                      <div style={{ fontSize: 11, color: DS.green, marginTop: 4, fontWeight: 600 }}>
                        {lessonCount} {t('course.lessons')}
                      </div>
                    )}
                  </div>

                  {/* Arrow (lock when preview-only) */}
                  <div style={{ color: DS.fm, fontSize: 18, flexShrink: 0 }}>{previewOnly ? '🔒' : '→'}</div>
                </div>
              );
            })}
          </div>

          {chapters.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: DS.fm }}>
              <div style={{ fontSize: 32, marginBottom: '.75rem' }}>📚</div>
              <div style={{ fontSize: 14 }}>{t('course.modules_preparing')}</div>
            </div>
          )}
        </main>
    </PortalShell>
  );
}
