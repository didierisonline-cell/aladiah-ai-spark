import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import WorkforceLaunchpad from '@/components/admin/workforce/WorkforceLaunchpad';
import AIWorkforceDashboard from '@/components/admin/workforce/AIWorkforceDashboard';

/**
 * /admin/ai-workforce
 * The unified master control center for the entire Aladiah AI Workforce.
 */
const AIWorkforce = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  return (
    <FounderShell>
        <WorkforceLaunchpad />
        <div id="control-center" className="mt-10 scroll-mt-24">
          <AIWorkforceDashboard />
        </div>
      </FounderShell>
  );
};

export default AIWorkforce;
