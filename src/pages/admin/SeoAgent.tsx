import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import SeoAgentDashboard from '@/components/admin/seo/SeoAgentDashboard';
import WorkforceNav from '@/components/admin/WorkforceNav';

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <WorkforceNav />
        <SeoAgentDashboard />
      </main>
    </div>
  );
};

export default SeoAgent;
