import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import MarketingAgentDashboard from '@/components/admin/marketing/MarketingAgentDashboard';
import WorkforceNav from '@/components/admin/WorkforceNav';

/**
 * /admin/marketing-agent
 * Control surface for the Aladiah Marketing Content Agent.
 */
const MarketingAgent = () => {
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
        <MarketingAgentDashboard />
      </main>
    </div>
  );
};

export default MarketingAgent;
