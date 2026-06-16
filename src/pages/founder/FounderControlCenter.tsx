import FounderShell from '@/components/founder/FounderShell';
import AIWorkforceDashboard from '@/components/admin/workforce/AIWorkforceDashboard';

/**
 * /founder/control-center — the deep control surface (registry, tasks, memory,
 * communications, reports, approvals). Founder-only via <FounderRoute>.
 */
const FounderControlCenter = () => (
  <FounderShell>
    <AIWorkforceDashboard />
  </FounderShell>
);

export default FounderControlCenter;
