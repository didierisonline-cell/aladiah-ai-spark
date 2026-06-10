import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import WorkforceNav from '@/components/admin/WorkforceNav';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';

/** /admin/analytics — Analytics & Executive Intelligence Authority. */
const AnalyticsAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate('/auth'); }, [loading, user, navigate]);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <WorkforceNav />
        <AnalyticsDashboard />
      </main>
    </div>
  );
};

export default AnalyticsAgent;
