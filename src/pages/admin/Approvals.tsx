import FounderShell from '@/components/founder/FounderShell';
import ApprovalsHub from '@/components/admin/workforce/ApprovalsHub';

/**
 * /admin/approvals
 * The unified Founder Approval Queue — aggregates pending items from every
 * agent (Product, Marketing, Admissions, Student Success, Placement).
 */
const Approvals = () => (
  <FounderShell>
      <ApprovalsHub />
    </FounderShell>
);

export default Approvals;
