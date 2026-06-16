import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import AdmissionsAgentDashboard from '@/components/admin/admissions/AdmissionsAgentDashboard';

/**
 * /admin/admissions-agent
 * Control surface for the Aladiah Admissions Authority Agent.
 */
const AdmissionsAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  return (
    <FounderShell>
        <AdmissionsAgentDashboard />
      </FounderShell>
  );
};

export default AdmissionsAgent;
