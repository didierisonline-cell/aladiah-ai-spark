import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import OperationsDashboard from '@/components/admin/operations/OperationsDashboard';

/** /admin/operations — Operations & Platform Authority. */
const OperationsAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate('/auth'); }, [loading, user, navigate]);
  return (
    <FounderShell>
        <OperationsDashboard />
      </FounderShell>
  );
};

export default OperationsAgent;
