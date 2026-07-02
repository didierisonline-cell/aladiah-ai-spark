import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import LaunchTruthCard from '@/components/founder/LaunchTruthCard';
import ExecutiveCommandHeader from '@/components/founder/cockpit/ExecutiveCommandHeader';
import LaunchReadinessCockpit from '@/components/founder/cockpit/LaunchReadinessCockpit';
import AgentOperatingGrid from '@/components/founder/cockpit/AgentOperatingGrid';
import ApprovalQueuePanel from '@/components/founder/cockpit/ApprovalQueuePanel';
import WorkOrderBoard from '@/components/founder/cockpit/WorkOrderBoard';
import CompanyBrainPanel from '@/components/founder/cockpit/CompanyBrainPanel';
import EventFeed from '@/components/founder/cockpit/EventFeed';
import IntelligencePanel from '@/components/founder/cockpit/IntelligencePanel';
import BriefingsPanel from '@/components/founder/cockpit/BriefingsPanel';
import GovernancePanel from '@/components/founder/cockpit/GovernancePanel';
import { Button } from '@/components/ui/button';
import { Crown, LayoutGrid, Play, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos } from '@/services/aos';
import { getCockpitSnapshot, type CockpitSnapshot } from '@/services/aos/cockpit';

/**
 * /founder — the Founder Portal home: an executive cockpit, not a card wall.
 * Command header → launch readiness → agent operating grid → approvals +
 * work orders → company brain. Deep surfaces (CEO brief, workforce launchpad,
 * per-agent control centers) remain one click away and founder-only via
 * <FounderRoute>.
 */
const FounderPortal = () => {
  const { toast } = useToast();
  const [snap, setSnap] = useState<CockpitSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticking, setTicking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      setSnap(await getCockpitSnapshot());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /** One orchestrator tick: run every agent whose cadence is due. */
  const runDue = useCallback(async () => {
    setTicking(true);
    try {
      const outcomes = await aos.orchestrator.tick();
      const failed = outcomes.filter((o) => !o.ok);
      toast({
        title: outcomes.length === 0 ? 'No agents due' : `Ran ${outcomes.length} due agent(s)`,
        description: outcomes.length === 0
          ? 'Every active agent is inside its cadence window.'
          : failed.length ? `${failed.length} failed — see the Event Bus.` : 'All succeeded — trail is on the Event Bus.',
        variant: failed.length ? 'destructive' : 'default',
      });
    } finally {
      setTicking(false);
      load();
    }
  }, [toast, load]);

  return (
    <FounderShell wide>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Founder Command</h1>
            <p className="text-sm text-muted-foreground">
              {snap ? `As of ${new Date(snap.generatedAt).toLocaleString()} — read live, never fabricated.` : 'Compiling the executive picture…'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={runDue} disabled={ticking}>
            <Play className={`w-4 h-4 mr-2 ${ticking ? 'animate-pulse' : ''}`} />
            {ticking ? 'Running…' : 'Run due agents'}
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/ai-workforce">
              <LayoutGrid className="w-4 h-4 mr-2" /> All surfaces
            </Link>
          </Button>
          <Link
            to="/portal"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#2563eb,#4A90F5)', boxShadow: '0 4px 14px rgba(37,99,235,.35)' }}
          >
            🎓 Student Portal →
          </Link>
        </div>
      </div>

      {loading && !snap ? (
        <div className="py-24 text-center text-sm text-muted-foreground">Reading the live operating picture…</div>
      ) : snap ? (
        <div className="space-y-8">
          {/* 1. Executive Command Header */}
          <ExecutiveCommandHeader snap={snap} />

          {/* Launch Truth — founder-ratified proven/hypothesis/broken doctrine */}
          <LaunchTruthCard />

          {/* 2. Launch Readiness Cockpit */}
          <LaunchReadinessCockpit dimensions={snap.dimensions} />

          {/* 3. Agent Operating Grid */}
          <AgentOperatingGrid agents={snap.agents} />

          {/* 4 + 5. Approvals + Work Orders */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <ApprovalQueuePanel approvals={snap.approvals} />
            <WorkOrderBoard onChange={load} />
          </div>

          {/* 6 + 7. Continuous Intelligence + Executive Briefings */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <IntelligencePanel onChange={load} />
            <BriefingsPanel />
          </div>

          {/* 8 + 9. Governance + Company Brain */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <GovernancePanel />
            <CompanyBrainPanel />
          </div>

          {/* 10. Event Bus */}
          <EventFeed />
        </div>
      ) : null}
    </FounderShell>
  );
};

export default FounderPortal;
