import Header from '@/components/Header';
import WorkforceNav from '@/components/admin/WorkforceNav';
import SecurityCommandCenter from '@/components/admin/security/SecurityCommandCenter';

/**
 * /admin/security — Cybersecurity Authority (founder-only via FounderRoute).
 * Security score, secrets monitor, access-control tests, deployment gate.
 */
const Security = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-8">
      <WorkforceNav />
      <SecurityCommandCenter />
    </main>
  </div>
);

export default Security;
