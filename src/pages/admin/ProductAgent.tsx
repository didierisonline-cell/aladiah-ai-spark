import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import WorkforceNav from '@/components/admin/WorkforceNav';
import ProductAgentDashboard from '@/components/admin/product/ProductAgentDashboard';

/**
 * /admin/product-agent
 * Control surface for the Aladiah Product Builder Agent.
 */
const ProductAgent = () => {
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
        <ProductAgentDashboard />
      </main>
    </div>
  );
};

export default ProductAgent;
