import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import SeoAgentDashboard from '@/components/admin/seo/SeoAgentDashboard';
import FounderShell from '@/components/founder/FounderShell';

/**
 * /admin/seo-agent
 * Control surface for the Aladiah SEO Strategy Agent.
 */
const SeoAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  return (
    <FounderShell>
        <SeoAgentDashboard />
      </FounderShell>
  );
};

export default SeoAgent;
