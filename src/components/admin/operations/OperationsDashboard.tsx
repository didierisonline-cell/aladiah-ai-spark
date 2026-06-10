import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity, AlertTriangle, BookOpen, ClipboardList, Cpu, CreditCard, FlaskConical, Play, RefreshCw, Server, ShieldCheck, Siren,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import { OPERATIONS_AGENT_SLUG, OpsFinding, OpsReport, OpsStats, OpsStatus, Severity } from '@/types/operations';
import { OPS_ENGINES } from '@/services/agents/operations/engines';
import { getAuditSurface, getLatestReport, getStats, listFindings, listStatus, setFindingStatus } from '@/services/agents/operationsAgent';

const AUDIT_SURFACE = getAuditSurface();

const STATUS_COLOR: Record<string, string> = {
  operational: 'bg-green-100 text-green-700 border-green-200',
  degraded: 'bg-amber-100 text-amber-700 border-amber-200',
  down: 'bg-red-100 text-red-700 border-red-200',
  unknown: 'bg-slate-100 text-slate-500 border-slate-200',
};
const SEV_COLOR: Record<Severity, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

const StatusList = ({ items }: { items: OpsStatus[] }) => (
  <Card><CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
    {items.length === 0 ? <p className="text-sm text-muted-foreground">No components.</p> : items.map((s) => (
      <div key={s.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 bg-muted/20">
        <div><p className="text-sm font-medium text-foreground">{s.component}</p><p className="text-[10px] text-muted-foreground">{s.detail}{s.latency_ms != null ? ` · ${s.latency_ms}ms` : ''}</p></div>
        <Badge className={`text-[9px] border ${STATUS_COLOR[s.status]}`}>{s.status}</Badge>
      </div>
    ))}
  </CardContent></Card>
);

const FindingsList = ({ items, onSet }: { items: OpsFinding[]; onSet: (id: string, s: 'acknowledged' | 'resolved' | 'dismissed') => void }) => (
  <Card><CardContent className="p-4 space-y-2 max-h-[560px] overflow-y-auto">
    {items.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No findings.</p> : items.map((f) => (
      <div key={f.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
        <div className="flex items-start justify-between gap-2">
          <div><p className="text-xs font-medium text-foreground">{f.title}</p><p className="text-[10px] text-muted-foreground">{f.engine} · {f.area}{f.owner ? ` · owner: ${f.owner}` : ''} · {f.status}</p></div>
          <Badge className={`text-[9px] border shrink-0 ${SEV_COLOR[f.severity]}`}>{f.severity}</Badge>
        </div>
        {f.detail && <p className="text-[11px] text-muted-foreground mt-1">{f.detail}</p>}
        {f.recommendation && <p className="text-[11px] text-primary mt-0.5">→ {f.recommendation}</p>}
        {f.status === 'open' && (
          <div className="flex gap-1 mt-2">
            <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => onSet(f.id, 'acknowledged')}>Acknowledge</Button>
            <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => onSet(f.id, 'resolved')}>Resolve</Button>
            <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] text-red-600" onClick={() => onSet(f.id, 'dismissed')}>Dismiss</Button>
          </div>
        )}
      </div>
    ))}
  </CardContent></Card>
);

const OperationsDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<OpsStats | null>(null);
  const [status, setStatus] = useState<OpsStatus[]>([]);
  const [findings, setFindings] = useState<OpsFinding[]>([]);
  const [report, setReport] = useState<OpsReport | null>(null);
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [st, sl, fl, rp, h] = await Promise.all([getStats(), listStatus(), listFindings(), getLatestReport(), aos.health.getAgentHealth(OPERATIONS_AGENT_SLUG)]);
      setStats(st); setStatus(sl); setFindings(fl); setReport(rp); setHealth(h);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const run = useCallback(async () => {
    setRunning(true);
    try {
      const o = await aos.orchestrator.runAgent(OPERATIONS_AGENT_SLUG, 'manual');
      const out = o.output as any;
      toast({ title: 'Audit complete', description: `Platform ${out?.platformStatus ?? '—'} · ${out?.findings ?? 0} new finding(s) · ${out?.critical ?? 0} critical.`, variant: out?.platformStatus === 'down' ? 'destructive' : 'default' });
    } finally { setRunning(false); refresh(); }
  }, [toast, refresh]);

  const onSet = async (id: string, s: 'acknowledged' | 'resolved' | 'dismissed') => { await setFindingStatus(id, s); refresh(); };
  const byCat = (c: string) => status.filter((s) => s.category === c);
  const byEngine = (e: string) => findings.filter((f) => f.engine === e);
  const ps = stats?.platformStatus ?? 'unknown';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Server className="w-6 h-6 text-primary" /> Operations &amp; Platform Authority</h1>
          <p className="text-sm text-muted-foreground">Guardian of reliability, student experience &amp; revenue · read-only · reports findings only</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
          <Button onClick={run} disabled={running}><Play className={`w-4 h-4 mr-2 ${running ? 'animate-pulse' : ''}`} /> {running ? 'Auditing…' : 'Run Audit'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Tile icon={Activity} label="Platform Status" value={ps} accent={ps === 'operational' ? 'text-green-600' : ps === 'down' ? 'text-red-600' : 'text-amber-600'} />
        <Tile icon={Server} label="Components OK" value={`${stats?.operational ?? 0}/${stats?.components ?? 0}`} />
        <Tile icon={Siren} label="Open Findings" value={stats?.openFindings ?? 0} accent={(stats?.openFindings ?? 0) > 0 ? 'text-amber-600' : 'text-green-600'} />
        <Tile icon={AlertTriangle} label="Critical" value={stats?.critical ?? 0} accent={(stats?.critical ?? 0) > 0 ? 'text-red-600' : 'text-green-600'} />
        <Tile icon={AlertTriangle} label="High" value={stats?.high ?? 0} accent={(stats?.high ?? 0) > 0 ? 'text-orange-600' : 'text-green-600'} />
        <Tile icon={CreditCard} label="Payment Risks" value={Number((report?.sections as any)?.payment_risks ?? 0)} accent="text-indigo-600" />
      </div>

      <Tabs defaultValue="platform" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="platform"><Activity className="w-3.5 h-3.5 mr-1" />Platform</TabsTrigger>
          <TabsTrigger value="infra"><Server className="w-3.5 h-3.5 mr-1" />Infrastructure</TabsTrigger>
          <TabsTrigger value="courses"><BookOpen className="w-3.5 h-3.5 mr-1" />Courses</TabsTrigger>
          <TabsTrigger value="sims"><FlaskConical className="w-3.5 h-3.5 mr-1" />Simulations</TabsTrigger>
          <TabsTrigger value="ai"><Cpu className="w-3.5 h-3.5 mr-1" />AI Services</TabsTrigger>
          <TabsTrigger value="pay"><CreditCard className="w-3.5 h-3.5 mr-1" />Payments</TabsTrigger>
          <TabsTrigger value="alerts"><Siren className="w-3.5 h-3.5 mr-1" />Alerts</TabsTrigger>
          <TabsTrigger value="framework"><ClipboardList className="w-3.5 h-3.5 mr-1" />Audit Framework</TabsTrigger>
          <TabsTrigger value="audit"><ShieldCheck className="w-3.5 h-3.5 mr-1" />Audit Center</TabsTrigger>
          <TabsTrigger value="health"><Activity className="w-3.5 h-3.5 mr-1" />Health</TabsTrigger>
        </TabsList>

        <TabsContent value="platform"><StatusList items={byCat('platform')} /></TabsContent>
        <TabsContent value="infra"><StatusList items={byCat('infrastructure')} /></TabsContent>
        <TabsContent value="courses"><FindingsList items={byEngine('course_integrity')} onSet={onSet} /></TabsContent>
        <TabsContent value="sims"><FindingsList items={byEngine('simulation_integrity')} onSet={onSet} /></TabsContent>
        <TabsContent value="ai"><StatusList items={byCat('ai_service')} /></TabsContent>
        <TabsContent value="pay">
          <div className="space-y-4"><StatusList items={byCat('payment')} /><FindingsList items={byEngine('payment')} onSet={onSet} /></div>
        </TabsContent>
        <TabsContent value="alerts"><FindingsList items={findings} onSet={onSet} /></TabsContent>
        <TabsContent value="framework" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Platform Audit Framework — pre-launch checklist</CardTitle>
              <p className="text-xs text-muted-foreground">The complete surface to audit. Findings record Issue · Severity · Screenshot · Fix · Owner · Status.</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AUDIT_SURFACE.map((s) => (
                <div key={s.category} className="rounded-lg border border-border/60 p-3 bg-muted/20">
                  <div className="flex items-center justify-between"><p className="text-sm font-medium text-foreground">{s.category}</p><Badge variant="secondary" className="text-[9px]">{s.owner}</Badge></div>
                  <div className="flex flex-wrap gap-1 mt-1">{s.items.map((it) => <Badge key={it} variant="outline" className="text-[9px]">{it}</Badge>)}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <FindingsList items={findings} onSet={onSet} />
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Daily Operations Report</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{report?.summary ?? 'Run an audit to generate the operations report.'}</p>
              <div>
                <p className="text-xs font-semibold mb-1">Audit engines</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {OPS_ENGINES.map((e, i) => <div key={e.id} className="rounded-lg border border-border/60 p-2 bg-muted/20"><p className="text-xs font-medium">{i + 1}. {e.name}</p><p className="text-[10px] text-muted-foreground">{e.purpose}</p></div>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="health">
          {health ? <Card><CardContent className="p-5 text-sm"><p className="font-medium">{health.name}</p><p className="text-muted-foreground capitalize">Health: {health.health} · perf {health.performanceScore} · success {health.uptimePct}% · errors {health.errorCount}</p></CardContent></Card> : <p className="text-sm text-muted-foreground">Run the agent once to populate health.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Tile = ({ icon: Icon, label, value, accent = 'text-primary' }: { icon: React.ElementType; label: string; value: number | string; accent?: string }) => (
  <Card><CardContent className="p-4 flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><Icon className={`w-4 h-4 ${accent}`} /></div>
    <div className="min-w-0"><p className="text-lg font-bold capitalize truncate">{typeof value === 'number' ? value.toLocaleString() : value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>
  </CardContent></Card>
);

export default OperationsDashboard;
