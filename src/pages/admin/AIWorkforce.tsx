import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import WorkforceNav from '@/components/admin/WorkforceNav';
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <WorkforceNav />
        <WorkforceLaunchpad />
        <div id="control-center" className="mt-10 scroll-mt-24">
          <AIWorkforceDashboard />
        </div>
      </main>
    </div>
  );
};

export default AIWorkforce;
