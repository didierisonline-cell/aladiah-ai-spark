import Header from '@/components/Header';
import WorkforceNav from '@/components/admin/WorkforceNav';
import ApprovalsHub from '@/components/admin/workforce/ApprovalsHub';

/**
 * /admin/approvals
 * The unified Founder Approval Queue — aggregates pending items from every
 * agent (Product, Marketing, Admissions, Student Success, Placement).
 */
const Approvals = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-8">
      <WorkforceNav />
      <ApprovalsHub />
    </main>
  </div>
);

export default Approvals;
