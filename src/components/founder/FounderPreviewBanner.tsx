import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { isFounderEmail, FOUNDER_HOME } from '@/lib/roles';

/**
 * Shown only when a founder is viewing /portal WITHOUT the ?preview=student
 * escape hatch. Makes it explicit they're looking at the student portal (not a
 * founder surface) and offers one tap back to /founder, plus a link into the
 * genuine student experience (?preview=student) where founder gate-bypass is
 * disabled. Hidden for students and during student-preview.
 */
export default function FounderPreviewBanner() {
  const { user } = useAuth();
  const [params] = useSearchParams();

  if (!isFounderEmail(user?.email)) return null;
  if (params.get('preview') === 'student') return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 10px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: 'calc(100vw - 24px)',
        padding: '7px 13px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color: '#0a0f1e',
        background: 'linear-gradient(135deg,#F5B81A,#F0A21A)',
        border: '1px solid rgba(245,184,26,.6)',
        boxShadow: '0 4px 16px rgba(0,0,0,.35)',
        backdropFilter: 'blur(10px)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>👑 Founder previewing student portal</span>
      <Link to="/portal?preview=student" style={{ textDecoration: 'underline', fontWeight: 800 }}>
        Test as student
      </Link>
      <Link to={FOUNDER_HOME} style={{ textDecoration: 'underline', fontWeight: 800 }}>
        Exit
      </Link>
    </div>
  );
}
