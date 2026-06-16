import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';

/** /admin/analytics — Analytics & Executive Intelligence Authority. */
const AnalyticsAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate('/auth'); }, [loading, user, navigate]);
  return (
    <FounderShell>
        <AnalyticsDashboard />
      </FounderShell>
  );
};

export default AnalyticsAgent;
