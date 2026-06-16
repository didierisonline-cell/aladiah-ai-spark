import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import PlacementAgentDashboard from '@/components/admin/placement/PlacementAgentDashboard';

/**
 * /admin/placement-agent
 * Control surface for the Aladiah Placement & Employer Relations Authority.
 */
const PlacementAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  return (
    <FounderShell>
        <PlacementAgentDashboard />
      </FounderShell>
  );
};

export default PlacementAgent;
