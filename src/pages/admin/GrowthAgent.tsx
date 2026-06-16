import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import CGODashboard from '@/components/admin/growth/CGODashboard';
import WorkforceNav from '@/components/admin/WorkforceNav';

/**
 * /admin/growth-agent
 * Control surface for the Chief Growth Officer Agent.
 */
const GrowthAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <WorkforceNav />
        <CGODashboard />
      </main>
    </div>
  );
};

export default GrowthAgent;
