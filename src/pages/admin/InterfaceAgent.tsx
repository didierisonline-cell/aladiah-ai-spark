import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import InterfaceExperienceDashboard from '@/components/admin/interface/InterfaceExperienceDashboard';

/** /admin/interface-agent — Interface & Experience Architect (Agent #14). */
const InterfaceAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate('/auth'); }, [loading, user, navigate]);
  return (
    <FounderShell>
      <InterfaceExperienceDashboard />
    </FounderShell>
  );
};

export default InterfaceAgent;
