import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import QAAgentDashboard from '@/components/admin/qa/QAAgentDashboard';

/**
 * /admin/qa-agent
 * Control surface for the Aladiah World-Class QA Agent (quality & employability authority).
 */
const QAAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  return (
    <FounderShell>
        <QAAgentDashboard />
      </FounderShell>
  );
};

export default QAAgent;
