import Header from '@/components/Header';
import FounderNav from '@/components/founder/FounderNav';
import AIWorkforceDashboard from '@/components/admin/workforce/AIWorkforceDashboard';

/**
 * /founder/control-center — the deep control surface (registry, tasks, memory,
 * communications, reports, approvals). Founder-only via <FounderRoute>.
 */
const FounderControlCenter = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-8">
      <FounderNav />
      <AIWorkforceDashboard />
    </main>
  </div>
);

export default FounderControlCenter;
