import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import FounderNav from '@/components/founder/FounderNav';
import CurriculumReadinessDashboard from '@/components/founder/CurriculumReadinessDashboard';
import { GaugeCircle } from 'lucide-react';

/**
 * /founder/readiness — Curriculum Readiness Dashboard (program-level).
 * The primary Founder operating screen for curriculum production: executive
 * roll-up + By School / By Program / By Module views with launch-gate logic.
 * Founder-only via <FounderRoute>.
 */
const FounderReadiness = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-[88rem] mx-auto px-4 py-8">
      <FounderNav />
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <GaugeCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Curriculum Readiness</h1>
            <p className="text-sm text-muted-foreground">Program-level production readiness across every school.</p>
          </div>
        </div>
        <Link to="/founder/curriculum" className="text-sm text-muted-foreground hover:text-foreground">Question Review →</Link>
      </div>
      <CurriculumReadinessDashboard />
    </main>
  </div>
);

export default FounderReadiness;
