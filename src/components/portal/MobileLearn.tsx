import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useLanguage } from '@/contexts/LanguageContext';
import MobileShell from '@/components/mobile/MobileShell';

const C = { fg: '#EDF2F7', fm: '#8596AD', blue: '#4A90F5', green: '#22C98A', card: 'rgba(8,20,52,.7)', border: 'rgba(255,255,255,.08)' };

const ICONS: Record<string, string> = {
  'AI Cloud Engineer': '☁️', 'AI Agent Engineer': '🤖', 'AI Data Engineer': '🗄️', 'AI DevOps Engineer': '⚙️',
  'AI Security Engineer': '🛡️', 'AI Product Manager': '📱', 'AI Business Analyst': '📊', 'AI Governance Professional': '⚖️',
  'AI UX Designer': '🎨',
};

/** Learn tab root (phone). Program list + continue where you left off. */
export default function MobileLearn({ courses, loading }: { courses: any[]; loading: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { progress } = useProgress(user?.id);
  const top = courses[0];
  const titleOf = (c: any) => c?.translations?.[language]?.title || c?.title || 'Program';

  return (
    <MobileShell title="Learn" score={progress}>
      <div style={{ padding: '18px 16px 8px', maxWidth: 620, margin: '0 auto' }}>
        {loading ? (
          <div style={{ color: C.fm, fontSize: 14, padding: 20 }}>Loading your programs…</div>
        ) : courses.length === 0 ? (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>📚</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>No programs yet</div>
            <div style={{ fontSize: 12.5, color: C.fm, marginTop: 4 }}>Programs are being added — check back soon.</div>
          </div>
        ) : (
          <>
            {/* Continue where you left off */}
            {top && (
              <div style={{ background: 'linear-gradient(150deg,rgba(37,99,235,.28),rgba(124,58,237,.22))', border: '1px solid rgba(99,102,241,.3)', borderRadius: 20, padding: 18, marginBottom: 18 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: 8 }}>Continue where you left off</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>{titleOf(top)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 2px' }}>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,.12)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(4, progress)}%`, background: 'linear-gradient(90deg,#22C98A,#4A90F5)', borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff' }}>{progress}%</span>
                </div>
                <button onClick={() => navigate(`/portal/course/${top.id}`)} className="app-tap tap-target" style={{ marginTop: 14, width: '100%', height: 52, border: 'none', borderRadius: 14, background: 'linear-gradient(90deg,#2563eb,#4A90F5)', color: '#fff', fontSize: 16, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(37,99,235,.45)' }}>Continue →</button>
              </div>
            )}

            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: '4px 4px 10px' }}>Your programs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {courses.map(c => (
                <button key={c.id} onClick={() => navigate(`/portal/course/${c.id}`)} className="app-tap" style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: 'rgba(74,144,245,.12)', border: '1px solid rgba(74,144,245,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{ICONS[c.title] || '📘'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: C.fg, lineHeight: 1.3 }}>{titleOf(c)}</div>
                    <div style={{ fontSize: 12, color: C.fm, marginTop: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{c.description}</div>
                  </div>
                  <span style={{ color: C.fm, fontSize: 20, flexShrink: 0 }}>›</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </MobileShell>
  );
}
