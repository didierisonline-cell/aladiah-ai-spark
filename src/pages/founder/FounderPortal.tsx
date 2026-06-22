import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import CEOStatusBoard from '@/components/admin/ceo/CEOStatusBoard';
import LaunchTruthCard from '@/components/founder/LaunchTruthCard';
import WorkforceLaunchpad from '@/components/admin/workforce/WorkforceLaunchpad';
import { Crown } from 'lucide-react';

/**
 * /founder — the Founder Portal home.
 * Exposes every founder authority (CEO, Curriculum, QA, Admissions, Success,
 * Placement, Analytics, Operations, Approval Queue) via the launchpad.
 * Founder-only; students are redirected to /portal by <FounderRoute>.
 */
const FounderPortal = () => (
  <FounderShell>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Founder Portal</h1>
            <p className="text-sm text-muted-foreground">
              Command the entire Aladiah AI Workforce. Founder access only.
            </p>
          </div>
        </div>
        <Link to="/portal" className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#4A90F5)', boxShadow: '0 4px 14px rgba(37,99,235,.35)' }}>
          🎓 Enter Student Portal →
        </Link>
      </div>
      <LaunchTruthCard />
      <CEOStatusBoard />
      <div className="mt-10">
        <WorkforceLaunchpad />
      </div>
  </FounderShell>
);

export default FounderPortal;
