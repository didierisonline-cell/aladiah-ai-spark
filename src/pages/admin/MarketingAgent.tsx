import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MarketingAgentDashboard from '@/components/admin/marketing/MarketingAgentDashboard';
import FounderShell from '@/components/founder/FounderShell';

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
    <FounderShell>
        <MarketingAgentDashboard />
      </FounderShell>
  );
};

export default MarketingAgent;
