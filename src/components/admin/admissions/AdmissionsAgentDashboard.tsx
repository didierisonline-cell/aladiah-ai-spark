import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, CheckCircle2, Cpu, GraduationCap, Play, RefreshCw, UserPlus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import {
  ADMISSIONS_AGENT_SLUG,
  AdmissionsFollowup,
  AdmissionsRecommendation,
  AdmissionsStats,
  BudgetBand,
  Prospect,
  Timeline,
} from '@/types/admissions';
import {
  approveFollowup,
  approveRecommendation,
  dismissRecommendation,
  getStats,
  intake,
  listFollowups,
  listProspects,
  listRecommendations,
} from '@/services/agents/admissionsAgent';
import ProspectsTable from './ProspectsTable';
import ProspectDetail from './ProspectDetail';
import AdmissionsEnginesPanel from './AdmissionsEnginesPanel';
import AgentHealthPanel from '@/components/admin/aos/AgentHealthPanel';

const EMPTY: AdmissionsStats = {
  total: 0, qualified: 0, nurturing: 0, enrolled: 0, disqualified: 0,
  avgFit: 0, avgCompletionProbability: 0, pendingRecommendations: 0, draftedFollowups: 0, byProgram: [],
};

const AdmissionsAgentDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdmissionsStats>(EMPTY);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [recs, setRecs] = useState<AdmissionsRecommendation[]>([]);
  const [followups, setFollowups] = useState<AdmissionsFollowup[]>([]);
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  // intake form
  const [form, setForm] = useState({ name: '', targetRole: 'Scrum Master', background: 'non_tech', budgetBand: 'mid' as BudgetBand, timeline: 'now' as Timeline, commitmentHours: 8, motivation: 4 });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [st, ps, rc, fu, h] = await Promise.all([
        getStats(), listProspects(), listRecommendations(), listFollowups(),
        aos.health.getAgentHealth(ADMISSIONS_AGENT_SLUG),
      ]);
      setStats(st); setProspects(ps); setRecs(rc); setFollowups(fu); setHealth(h);
      if (!selectedId && ps.length) setSelectedId(ps[0].id);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => { refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = useMemo(() => prospects.find((p) => p.id === selectedId) ?? null, [prospects, selectedId]);
  const selRecs = useMemo(() => recs.filter((r) => r.prospect_id === selectedId), [recs, selectedId]);
  const selFollowups = useMemo(() => followups.filter((f) => f.prospect_id === selectedId), [followups, selectedId]);

  const runQueue = useCallback(async () => {
    setRunning(true);
    try {
      const o = await aos.orchestrator.runAgent(ADMISSIONS_AGENT_SLUG, 'manual');
      const out = o.output as any;
      toast({ title: o.ok ? 'Admissions cycle complete' : 'Run failed', description: o.ok ? `Processed ${out?.processed ?? 0} · ${out?.qualified ?? 0} qualified.` : o.error ?? 'Unknown', variant: o.ok ? 'default' : 'destructive' });
    } finally { setRunning(false); refresh(); }
  }, [toast, refresh]);

  const addProspect = useCallback(async () => {
    if (!form.name.trim()) { toast({ title: 'Enter a name', variant: 'destructive' }); return; }
    setRunning(true);
    try {
      const p = await intake({ ...form, source: 'manual' });
      toast({ title: p ? `${form.name} scored` : 'Intake failed', description: p ? `Status: ${p.status}` : 'Check admin access', variant: p ? 'default' : 'destructive' });
      setForm({ ...form, name: '' });
      if (p) setSelectedId(p.id);
    } finally { setRunning(false); refresh(); }
  }, [form, toast, refresh]);

  const act = async (fn: () => Promise<boolean>) => { await fn(); refresh(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><GraduationCap className="w-6 h-6 text-primary" /> Admissions Authority Agent</h1>
          <p className="text-sm text-muted-foreground">Converts qualified prospects into successful students · optimizes quality, not volume</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
          <Button onClick={runQueue} disabled={running}><Play className={`w-4 h-4 mr-2 ${running ? 'animate-pulse' : ''}`} /> {running ? 'Running…' : 'Process Queue'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Tile icon={Users} label="Prospects" value={stats.total} />
        <Tile icon={CheckCircle2} label="Qualified" value={stats.qualified} accent="text-green-600" />
        <Tile icon={Users} label="Nurturing" value={stats.nurturing} accent="text-amber-600" />
        <Tile icon={GraduationCap} label="Enrolled" value={stats.enrolled} accent="text-emerald-600" />
        <Tile icon={Award} label="Avg Completion" value={stats.avgCompletionProbability} accent="text-indigo-600" />
        <Tile icon={CheckCircle2} label="Pending Approvals" value={stats.pendingRecommendations} accent={stats.pendingRecommendations > 0 ? 'text-amber-600' : 'text-green-600'} />
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="pipeline"><Users className="w-3.5 h-3.5 mr-1" />Pipeline</TabsTrigger>
          <TabsTrigger value="intake"><UserPlus className="w-3.5 h-3.5 mr-1" />Intake</TabsTrigger>
          <TabsTrigger value="engines"><Cpu className="w-3.5 h-3.5 mr-1" />Engines</TabsTrigger>
          <TabsTrigger value="health"><Award className="w-3.5 h-3.5 mr-1" />Health</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProspectsTable prospects={prospects} selectedId={selectedId} onSelect={setSelectedId} />
            <ProspectDetail
              prospect={selected}
              recommendations={selRecs}
              followups={selFollowups}
              onApproveRec={(id) => act(() => approveRecommendation(id))}
              onDismissRec={(id) => act(() => dismissRecommendation(id))}
              onApproveFollowup={(id) => act(() => approveFollowup(id))}
            />
          </div>
        </TabsContent>

        <TabsContent value="intake">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Prospect Intake</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></Field>
              <Field label="Target role">
                <Pick value={form.targetRole} onChange={(v) => setForm({ ...form, targetRole: v })} options={['Scrum Master', 'Agile Coach', 'Project Manager', 'Product Owner']} />
              </Field>
              <Field label="Background">
                <Pick value={form.background} onChange={(v) => setForm({ ...form, background: v })} options={['non_tech', 'developer', 'manager', 'student']} />
              </Field>
              <Field label="Budget">
                <Pick value={form.budgetBand} onChange={(v) => setForm({ ...form, budgetBand: v as BudgetBand })} options={['low', 'mid', 'high', 'unknown']} />
              </Field>
              <Field label="Timeline">
                <Pick value={form.timeline} onChange={(v) => setForm({ ...form, timeline: v as Timeline })} options={['now', '3m', '6m', 'exploring']} />
              </Field>
              <Field label="Commitment (hrs/wk)"><Input type="number" value={form.commitmentHours} onChange={(e) => setForm({ ...form, commitmentHours: Number(e.target.value) })} /></Field>
              <Field label="Motivation (1-5)"><Input type="number" min={1} max={5} value={form.motivation} onChange={(e) => setForm({ ...form, motivation: Number(e.target.value) })} /></Field>
              <div className="flex items-end">
                <Button onClick={addProspect} disabled={running}><UserPlus className="w-4 h-4 mr-2" /> Add &amp; Score</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engines"><AdmissionsEnginesPanel /></TabsContent>
        <TabsContent value="health"><AgentHealthPanel health={health ? [health] : []} /></TabsContent>
      </Tabs>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1"><Label className="text-xs">{label}</Label>{children}</div>
);
const Pick = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger><SelectValue /></SelectTrigger>
    <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
  </Select>
);
const Tile = ({ icon: Icon, label, value, accent = 'text-primary' }: { icon: React.ElementType; label: string; value: number; accent?: string }) => (
  <Card><CardContent className="p-4 flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><Icon className={`w-4 h-4 ${accent}`} /></div>
    <div className="min-w-0"><p className="text-xl font-bold">{value.toLocaleString()}</p><p className="text-xs text-muted-foreground">{label}</p></div>
  </CardContent></Card>
);

export default AdmissionsAgentDashboard;
