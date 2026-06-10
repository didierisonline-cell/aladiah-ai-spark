import { Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRole } from '@/hooks/useRole';
import { FOUNDER_HOME, STUDENT_HOME } from '@/lib/roles';

/**
 * Route guard for all founder surfaces.
 * Layers a founder-only gate on top of <ProtectedRoute> (auth):
 *   - not signed in        → /auth (ProtectedRoute)
 *   - signed in, student   → redirect to /portal (never a 404)
 *   - signed in, founder   → render
 * Supabase RLS independently protects the data; this guard governs navigation.
 */
export default function FounderRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireSubscription={false}>
      <FounderGate>{children}</FounderGate>
    </ProtectedRoute>
  );
}

function FounderGate({ children }: { children: React.ReactNode }) {
  const { isFounder, loading } = useRole();
  const location = useLocation();
  if (loading) return null; // resolving role — no premature redirect
  if (!isFounder) {
    return <Navigate to={STUDENT_HOME} state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

/**
 * Wrap the student home so founders are routed to their own portal.
 * Students render through untouched.
 */
export function FounderRedirect({ children }: { children: React.ReactNode }) {
  const { isFounder, loading } = useRole();
  if (!loading && isFounder) return <Navigate to={FOUNDER_HOME} replace />;
  return <>{children}</>;
}
