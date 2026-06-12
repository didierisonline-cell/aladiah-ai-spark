import { useFounderMode } from '@/hooks/useFounderMode';

/**
 * Always-visible founder indicator. Renders only for the founder.
 * God Mode ON  → "🛡 Founder Mode Active" (you are NOT seeing the student experience).
 * God Mode OFF → "👤 Viewing as Student" (real student experience; one tap to re-arm).
 * Fixed, safe-area aware, sits clear of the mobile bottom nav.
 */
export default function FounderModeBadge() {
  const { isFounder, godMode, toggle } = useFounderMode();
  if (!isFounder) return null;

  const on = godMode;
  return (
    <button
      onClick={toggle}
      className="app-tap"
      aria-label={on ? 'Founder Mode active — tap to view as student' : 'Viewing as student — tap to re-enable Founder Mode'}
      style={{
        position: 'fixed',
        left: 12,
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 78px)',
        zIndex: 95,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 13px', borderRadius: 999, cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 12, fontWeight: 800, letterSpacing: 0.2,
        color: on ? '#0a0f1e' : '#cbd5e1',
        background: on ? 'linear-gradient(135deg,#F5B81A,#F0A21A)' : 'rgba(15,23,42,.92)',
        border: on ? '1px solid rgba(245,184,26,.6)' : '1px solid rgba(148,163,184,.3)',
        boxShadow: on ? '0 0 18px rgba(245,184,26,.5)' : '0 4px 14px rgba(0,0,0,.4)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <span style={{ fontSize: 14 }}>{on ? '🛡' : '👤'}</span>
      {on ? 'Founder Mode Active' : 'Viewing as Student'}
    </button>
  );
}
