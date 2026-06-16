import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import StudentSuccessDashboard from '@/components/admin/success/StudentSuccessDashboard';

/**
 * /admin/student-success
 * Control surface for the Aladiah Student Success & Employability Authority.
 */
const StudentSuccessAgent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  return (
    <FounderShell>
        <StudentSuccessDashboard />
      </FounderShell>
  );
};

export default StudentSuccessAgent;
