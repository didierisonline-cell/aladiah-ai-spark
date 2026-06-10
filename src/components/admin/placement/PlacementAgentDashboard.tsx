import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Building2, CheckCircle2, Clock, DollarSign, Play, RefreshCw, Rocket, Smile, TrendingUp, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import {
  Candidate, DemandSignal, Employer, PLACEMENT_AGENT_SLUG, PlacementAction, PlacementJob, PlacementMatch, PlacementStats,
} from '@/types/placement';
import {
  approveAction, dismissAction, getStats, listActions, listCandidates, listDemand, listEmployers, listJobs, listMatches,
} from '@/services/agents/placementAgent';
import PlacementBoard from './PlacementBoard';
import EmployersPanel from './EmployersPanel';
import TalentPanel from './TalentPanel';
import DemandActionsPanel from './DemandActionsPanel';
import PlacementAreasPanel from './PlacementAreasPanel';
import AgentHealthPanel from '@/components/admin/aos/AgentHealthPanel';

const EMPTY: PlacementStats = {
  candidates: 0, placed: 0, placementRate: 0, avgSalary: 0, timeToPlacementDays: 0,
  employerSatisfaction: 0, promotionRate: 0, retentionRate: 0, employers: 0, openJobs: 0, pendingActions: 0, pipeline: [],
};

const PlacementAgentDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<PlacementStats>(EMPTY);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<PlacementJob[]>([]);
  const [matches, setMatches] = useState<PlacementMatch[]>([]);
  const [actions, setActions] = useState<PlacementAction[]>([]);
  const [demand, setDemand] = useState<DemandSignal[]>([]);
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [st, em, ca, jb, ma, ac, de, h] = await Promise.all([
        getStats(), listEmployers(), listCandidates(), listJobs(), listMatches(), listActions(), listDemand(),
        aos.health.getAgentHealth(PLACEMENT_AGENT_SLUG),
      ]);
      setStats(st); setEmployers(em); setCandidates(ca); setJobs(jb); setMatches(ma); setActions(ac); setDemand(de); setHealth(h);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const run = useCallback(async () => {
    setRunning(true);
    try {
      const o = await aos.orchestrator.runAgent(PLACEMENT_AGENT_SLUG, 'manual');
      const out = o.output as any;
      toast({ title: o.ok ? 'Placement pipeline run' : 'Run failed', description: o.ok ? `Ingested ${out?.ingested ?? 0} · ${out?.matched ?? 0} matched · placement rate ${out?.placementRate ?? 0}%. Demand fed back.` : o.error ?? 'Unknown', variant: o.ok ? 'default' : 'destructive' });
    } finally { setRunning(false); refresh(); }
  }, [toast, refresh]);

  const act = async (fn: () => Promise<boolean>) => { await fn(); refresh(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Briefcase className="w-6 h-6 text-primary" /> Placement &amp; Employer Relations Authority</h1>
          <p className="text-sm text-muted-foreground">The bridge: Aladiah Academy ↔ Aladiah Management · primary KPI: Student Placement Rate</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
          <Button onClick={run} disabled={running}><Play className={`w-4 h-4 mr-2 ${running ? 'animate-pulse' : ''}`} /> {running ? 'Running…' : 'Run Pipeline'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Tile icon={Rocket} label="Placement Rate (primary)" value={`${stats.placementRate}%`} accent={stats.placementRate >= 50 ? 'text-green-600' : 'text-amber-600'} />
        <Tile icon={DollarSign} label="Avg Salary" value={stats.avgSalary ? `$${Math.round(stats.avgSalary / 1000)}k` : '—'} accent="text-emerald-600" />
        <Tile icon={Clock} label="Time to Placement" value={stats.timeToPlacementDays ? `${stats.timeToPlacementDays}d` : '—'} accent="text-indigo-600" />
        <Tile icon={Smile} label="Employer Satisfaction" value={stats.employerSatisfaction ? `${stats.employerSatisfaction}` : '—'} accent="text-blue-600" />
        <Tile icon={Users} label="Candidates" value={stats.candidates} />
        <Tile icon={CheckCircle2} label="Pending Approvals" value={stats.pendingActions} accent={stats.pendingActions > 0 ? 'text-amber-600' : 'text-green-600'} />
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="pipeline"><Briefcase className="w-3.5 h-3.5 mr-1" />Pipeline</TabsTrigger>
          <TabsTrigger value="employers"><Building2 className="w-3.5 h-3.5 mr-1" />Employers</TabsTrigger>
          <TabsTrigger value="talent"><Users className="w-3.5 h-3.5 mr-1" />Talent</TabsTrigger>
          <TabsTrigger value="demand"><TrendingUp className="w-3.5 h-3.5 mr-1" />Demand &amp; Approvals</TabsTrigger>
          <TabsTrigger value="areas"><Briefcase className="w-3.5 h-3.5 mr-1" />Areas</TabsTrigger>
          <TabsTrigger value="health"><Smile className="w-3.5 h-3.5 mr-1" />Health</TabsTrigger>
        </TabsList>
        <TabsContent value="pipeline"><PlacementBoard matches={matches} candidates={candidates} /></TabsContent>
        <TabsContent value="employers"><EmployersPanel employers={employers} jobs={jobs} /></TabsContent>
        <TabsContent value="talent"><TalentPanel candidates={candidates} /></TabsContent>
        <TabsContent value="demand"><DemandActionsPanel demand={demand} actions={actions} onApprove={(id) => act(() => approveAction(id))} onDismiss={(id) => act(() => dismissAction(id))} /></TabsContent>
        <TabsContent value="areas"><PlacementAreasPanel /></TabsContent>
        <TabsContent value="health"><AgentHealthPanel health={health ? [health] : []} /></TabsContent>
      </Tabs>
    </div>
  );
};

const Tile = ({ icon: Icon, label, value, accent = 'text-primary' }: { icon: React.ElementType; label: string; value: number | string; accent?: string }) => (
  <Card><CardContent className="p-4 flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><Icon className={`w-4 h-4 ${accent}`} /></div>
    <div className="min-w-0"><p className="text-lg font-bold truncate">{typeof value === 'number' ? value.toLocaleString() : value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>
  </CardContent></Card>
);

export default PlacementAgentDashboard;
