import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AgentOSDashboard from '@/components/admin/aos/AgentOSDashboard';
import FounderShell from '@/components/founder/FounderShell';

/**
 * /admin/agent-os
 * Control plane for the Aladiah Agent Operating System (AOS).
 */
const AgentOS = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  return (
    <FounderShell>
        <AgentOSDashboard />
      </FounderShell>
  );
};

export default AgentOS;
