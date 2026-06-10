import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, GraduationCap, Play, RefreshCw, Rocket, Target, TriangleAlert, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import { SUCCESS_AGENT_SLUG, SuccessIntervention, SuccessStats, SuccessStudent } from '@/types/success';
import {
  approveIntervention,
  dismissIntervention,
  getStats,
  listInterventions,
  listStudents,
} from '@/services/agents/studentSuccessAgent';
import StudentsTable from './StudentsTable';
import StudentDetail from './StudentDetail';
import SuccessAreasPanel from './SuccessAreasPanel';
import AgentHealthPanel from '@/components/admin/aos/AgentHealthPanel';

const EMPTY: SuccessStats = { students: 0, avgCTS: 0, thriving: 0, atRisk: 0, placementReady: 0, pendingInterventions: 0, ctsDistribution: [] };

const StudentSuccessDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<SuccessStats>(EMPTY);
  const [students, setStudents] = useState<SuccessStudent[]>([]);
  const [interventions, setInterventions] = useState<SuccessIntervention[]>([]);
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [st, ss, iv, h] = await Promise.all([getStats(), listStudents(), listInterventions(), aos.health.getAgentHealth(SUCCESS_AGENT_SLUG)]);
      setStats(st); setStudents(ss); setInterventions(iv); setHealth(h);
      if (!selectedId && ss.length) setSelectedId(ss[0].id);
    } finally { setLoading(false); }
  }, [selectedId]);

  useEffect(() => { refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = useMemo(() => students.find((s) => s.id === selectedId) ?? null, [students, selectedId]);
  const selIv = useMemo(() => interventions.filter((i) => i.student_id === selectedId), [interventions, selectedId]);

  const run = useCallback(async () => {
    setRunning(true);
    try {
      const o = await aos.orchestrator.runAgent(SUCCESS_AGENT_SLUG, 'manual');
      const out = o.output as any;
      toast({ title: o.ok ? 'Cohort processed' : 'Run failed', description: o.ok ? `Scored ${out?.processed ?? 0} · avg CTS ${out?.avgCTS ?? 0} · ${out?.atRisk ?? 0} at-risk.` : o.error ?? 'Unknown', variant: o.ok ? 'default' : 'destructive' });
    } finally { setRunning(false); refresh(); }
  }, [toast, refresh]);

  const act = async (fn: () => Promise<boolean>) => { await fn(); refresh(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><GraduationCap className="w-6 h-6 text-primary" /> Student Success &amp; Employability Authority</h1>
          <p className="text-sm text-muted-foreground">Transforms students into employable professionals · primary KPI: Career Transformation Score</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
          <Button onClick={run} disabled={running}><Play className={`w-4 h-4 mr-2 ${running ? 'animate-pulse' : ''}`} /> {running ? 'Running…' : 'Process Cohort'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Tile icon={Users} label="Students" value={stats.students} />
        <Tile icon={Target} label="Avg CTS (primary)" value={stats.avgCTS} accent={stats.avgCTS >= 70 ? 'text-green-600' : 'text-amber-600'} />
        <Tile icon={Award} label="Thriving" value={stats.thriving} accent="text-green-600" />
        <Tile icon={TriangleAlert} label="At Risk" value={stats.atRisk} accent={stats.atRisk > 0 ? 'text-red-600' : 'text-green-600'} />
        <Tile icon={Rocket} label="Placement Ready" value={stats.placementReady} accent="text-emerald-600" />
        <Tile icon={Award} label="Pending Interventions" value={stats.pendingInterventions} accent={stats.pendingInterventions > 0 ? 'text-amber-600' : 'text-green-600'} />
      </div>

      <Tabs defaultValue="cohort" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="cohort"><Users className="w-3.5 h-3.5 mr-1" />Cohort</TabsTrigger>
          <TabsTrigger value="areas"><Target className="w-3.5 h-3.5 mr-1" />Areas</TabsTrigger>
          <TabsTrigger value="health"><Award className="w-3.5 h-3.5 mr-1" />Health</TabsTrigger>
        </TabsList>
        <TabsContent value="cohort">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <StudentsTable students={students} selectedId={selectedId} onSelect={setSelectedId} />
            <StudentDetail student={selected} interventions={selIv} onApprove={(id) => act(() => approveIntervention(id))} onDismiss={(id) => act(() => dismissIntervention(id))} />
          </div>
        </TabsContent>
        <TabsContent value="areas"><SuccessAreasPanel /></TabsContent>
        <TabsContent value="health"><AgentHealthPanel health={health ? [health] : []} /></TabsContent>
      </Tabs>
    </div>
  );
};

const Tile = ({ icon: Icon, label, value, accent = 'text-primary' }: { icon: React.ElementType; label: string; value: number; accent?: string }) => (
  <Card><CardContent className="p-4 flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><Icon className={`w-4 h-4 ${accent}`} /></div>
    <div className="min-w-0"><p className="text-xl font-bold">{value.toLocaleString()}</p><p className="text-xs text-muted-foreground">{label}</p></div>
  </CardContent></Card>
);

export default StudentSuccessDashboard;
