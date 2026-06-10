import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import AgentOSDashboard from '@/components/admin/aos/AgentOSDashboard';

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AgentOSDashboard />
      </main>
    </div>
  );
};

export default AgentOS;
