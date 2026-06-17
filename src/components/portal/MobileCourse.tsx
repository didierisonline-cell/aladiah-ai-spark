import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/mobile/MobileShell';
import { useLanguage } from '@/contexts/LanguageContext';

const C = { fg: '#EDF2F7', fm: '#8596AD', fd: '#3A4A66', blue: '#4A90F5', green: '#22C98A', gold: '#F5B81A', card: 'rgba(8,20,52,.7)', border: 'rgba(255,255,255,.08)' };
const MOD_ICONS = ['⚙️', '📊', '🛡️', '🚀', '🧠', '💼', '⚖️', '🎨', '📱', '🔧', '📈', '🌐', '🔁', '🏗️', '✨'];

interface Props {
  course: any;
  chapters: any[];
  lessonCounts: Record<string, number>;
  completed: Set<string>;
}

export default function MobileCourse({ course, chapters, lessonCounts, completed }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const total = chapters.length;
  const doneCount = chapters.filter(c => completed.has(c.id)).length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const isUnlocked = (i: number) => i === 0 || completed.has(chapters[i - 1]?.id);
  const currentIdx = chapters.findIndex((c, i) => isUnlocked(i) && !completed.has(c.id));
  const current = currentIdx >= 0 ? chapters[currentIdx] : null;

  const courseTitle = course?.title
    ? (course.title.length > 22 ? course.title.slice(0, 22) + '…' : course.title)
    : t('mobile.course.default_title');

  return (
    <MobileShell title={courseTitle} back="/portal/courses" score={pct}>
      <div style={{ padding: '18px 16px 8px', maxWidth: 620, margin: '0 auto' }}>
        {/* Program progress */}
        <div style={{ background: 'linear-gradient(150deg,rgba(37,99,235,.26),rgba(124,58,237,.2))', border: '1px solid rgba(99,102,241,.3)', borderRadius: 20, padding: 18, marginBottom: 18 }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{course?.title}</div>
          <div style={{ fontSize: 12, color: '#c7d2fe', marginTop: 6 }}>{doneCount}{t('mobile.course.progress')}{total}{t('mobile.course.modules_done')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 2px' }}>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,.12)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.max(3, pct)}%`, background: 'linear-gradient(90deg,#22C98A,#4A90F5)', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff' }}>{pct}%</span>
          </div>
          {current && (
            <button onClick={() => navigate(`/course/${course.id}/chapter/${current.id}`)} className="app-tap tap-target" style={{ marginTop: 14, width: '100%', height: 52, border: 'none', borderRadius: 14, background: 'linear-gradient(90deg,#2563eb,#4A90F5)', color: '#fff', fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(37,99,235,.45)' }}>
              {doneCount > 0 ? t('mobile.course.continue_btn') : t('mobile.course.start_btn')}
            </button>
          )}
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: C.fm, margin: '0 4px 10px' }}>{t('mobile.course.modules_label')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {chapters.map((ch, i) => {
            const done = completed.has(ch.id);
            const unlocked = isUnlocked(i);
            const isCurrent = current?.id === ch.id;
            const color = done ? C.green : isCurrent ? C.blue : C.fd;
            return (
              <button key={ch.id} disabled={!unlocked} onClick={() => unlocked && navigate(`/course/${course.id}/chapter/${ch.id}`)}
                className="app-tap" style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', background: isCurrent ? 'rgba(74,144,245,.1)' : C.card, border: `1px solid ${isCurrent ? 'rgba(74,144,245,.4)' : C.border}`, borderRadius: 16, padding: 14, cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.55, fontFamily: 'inherit', width: '100%' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `${color}1f`, border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {done ? '✓' : unlocked ? MOD_ICONS[i % MOD_ICONS.length] : '🔒'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.fm, letterSpacing: '.06em' }}>{t('mobile.course.module_label')}{i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: unlocked ? C.fg : C.fm, lineHeight: 1.3 }}>{ch.title}</div>
                  <div style={{ fontSize: 11, marginTop: 3, fontWeight: 700, color }}>
                    {done ? t('mobile.course.completed') : isCurrent ? t('mobile.course.continue') : unlocked ? `${lessonCounts[ch.id] || 0}${t('mobile.course.lessons')}` : t('mobile.course.locked')}
                  </div>
                </div>
                <span style={{ color: C.fm, fontSize: 18, flexShrink: 0 }}>{unlocked ? '›' : ''}</span>
              </button>
            );
          })}
        </div>

        {chapters.length === 0 && (
          <div style={{ textAlign: 'center', padding: 36, color: C.fm }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>📚</div>
            <div style={{ fontSize: 13.5 }}>{t('mobile.course.empty')}</div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
