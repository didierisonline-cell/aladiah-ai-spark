import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
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
    <FounderShell>
        <ProductAgentDashboard />
      </FounderShell>
  );
};

export default ProductAgent;
