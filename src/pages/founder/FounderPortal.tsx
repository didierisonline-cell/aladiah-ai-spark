import Header from '@/components/Header';
import FounderNav from '@/components/founder/FounderNav';
import WorkforceLaunchpad from '@/components/admin/workforce/WorkforceLaunchpad';
import { Crown } from 'lucide-react';

/**
 * /founder — the Founder Portal home.
 * Exposes every founder authority (CEO, Curriculum, QA, Admissions, Success,
 * Placement, Analytics, Operations, Approval Queue) via the launchpad.
 * Founder-only; students are redirected to /portal by <FounderRoute>.
 */
const FounderPortal = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-8">
      <FounderNav />
      <div className="mb-6 flex items-center gap-3">
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
      <WorkforceLaunchpad />
    </main>
  </div>
);

export default FounderPortal;
