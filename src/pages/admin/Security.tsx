import FounderShell from '@/components/founder/FounderShell';
import SecurityCommandCenter from '@/components/admin/security/SecurityCommandCenter';

/**
 * /admin/security — Cybersecurity Authority (founder-only via FounderRoute).
 * Security score, secrets monitor, access-control tests, deployment gate.
 */
const Security = () => (
  <FounderShell>
      <SecurityCommandCenter />
    </FounderShell>
);

export default Security;
