import { Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useIsAdmin } from '@/hooks/useIsAdmin';

/**
 * Route guard for the AI Workforce / admin surfaces.
 * Layers on top of <ProtectedRoute> (auth) an additional admin/founder gate:
 * a signed-in non-admin is bounced to the student portal, never shown the
 * workforce. Data is independently protected by Supabase RLS (aos_is_admin);
 * this guard is for navigation/UX.
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireSubscription={false}>
      <AdminGate>{children}</AdminGate>
    </ProtectedRoute>
  );
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useIsAdmin();
  const location = useLocation();

  // Still resolving the role — render nothing (no premature redirect).
  if (loading) return null;
  if (!isAdmin) {
    return <Navigate to="/portal" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
