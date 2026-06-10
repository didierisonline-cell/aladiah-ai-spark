import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity, BarChart3, BookOpen, Briefcase, DollarSign, LineChart, Megaphone, Play, RefreshCw, ShieldCheck, Sparkles, Users,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import { ANALYTICS_AGENT_SLUG, AnalyticsReport, Metric } from '@/types/analytics';
import { INTELLIGENCE_ENGINES } from '@/services/agents/analytics/engines';
import { getLatestReport, listReports } from '@/services/agents/analyticsAgent';

const MetricsGrid = ({ metrics }: { metrics?: Metric[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    {(metrics ?? []).map((mt, i) => (
      <div key={i} className="rounded-lg border border-border/60 p-3 bg-muted/20">
        <p className="text-lg font-bold text-foreground">{mt.value}</p>
        <p className="text-xs text-muted-foreground">{mt.label}</p>
        {mt.note && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{mt.note}</p>}
      </div>
    ))}
  </div>
);

const Section = ({ title, metrics, note }: { title: string; metrics?: Metric[]; note?: string }) => (
  <Card>
    <CardHeader className="pb-3"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
    <CardContent className="space-y-2">
      <MetricsGrid metrics={metrics} />
      {note && <p className="text-[11px] text-muted-foreground">{note}</p>}
    </CardContent>
  </Card>
);

const List = ({ title, items }: { title: string; items?: string[] }) => (
  <Card>
    <CardHeader className="pb-3"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
    <CardContent>
      {(!items || items.length === 0) ? <p className="text-sm text-muted-foreground">None.</p> : (
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/90">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
      )}
    </CardContent>
  </Card>
);

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [r, rs, h] = await Promise.all([getLatestReport(), listReports(20), aos.health.getAgentHealth(ANALYTICS_AGENT_SLUG)]);
      setReport(r); setReports(rs); setHealth(h);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const run = useCallback(async () => {
    setRunning(true);
    try {
      const o = await aos.orchestrator.runAgent(ANALYTICS_AGENT_SLUG, 'manual');
      toast({ title: o.ok ? 'Executive brief generated' : 'Run failed', description: o.ok ? `CTIS ${(o.output as any)?.ctis ?? '—'}.` : o.error ?? 'Unknown', variant: o.ok ? 'default' : 'destructive' });
    } finally { setRunning(false); refresh(); }
  }, [toast, refresh]);

  const s = (report?.sections ?? {}) as any;
  const f = (report?.forecasts ?? {}) as any;
  const ctisColor = (report?.ctis ?? 0) >= 70 ? 'text-green-600' : (report?.ctis ?? 0) >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" /> Analytics &amp; Executive Intelligence</h1>
          <p className="text-sm text-muted-foreground">Source of truth · master KPI: Career Transformation Impact Score (CTIS) · read-only</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
          <Button onClick={run} disabled={running}><Play className={`w-4 h-4 mr-2 ${running ? 'animate-pulse' : ''}`} /> {running ? 'Analyzing…' : 'Generate Brief'}</Button>
        </div>
      </div>

      {/* CTIS hero */}
      <Card className="border-primary/30">
        <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Career Transformation Impact Score (master KPI)</p>
            <p className={`text-5xl font-bold ${ctisColor}`}>{report?.ctis ?? '—'}</p>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">{report?.summary ?? 'Generate a brief to compute the CTIS and the executive intelligence sections.'}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="executive" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="executive"><Sparkles className="w-3.5 h-3.5 mr-1" />Executive</TabsTrigger>
          <TabsTrigger value="revenue"><DollarSign className="w-3.5 h-3.5 mr-1" />Revenue</TabsTrigger>
          <TabsTrigger value="students"><Users className="w-3.5 h-3.5 mr-1" />Students</TabsTrigger>
          <TabsTrigger value="employability"><Briefcase className="w-3.5 h-3.5 mr-1" />Employability</TabsTrigger>
          <TabsTrigger value="curriculum"><BookOpen className="w-3.5 h-3.5 mr-1" />Curriculum</TabsTrigger>
          <TabsTrigger value="marketing"><Megaphone className="w-3.5 h-3.5 mr-1" />Marketing</TabsTrigger>
          <TabsTrigger value="forecasting"><LineChart className="w-3.5 h-3.5 mr-1" />Forecasting</TabsTrigger>
          <TabsTrigger value="reports"><Activity className="w-3.5 h-3.5 mr-1" />Reports</TabsTrigger>
          <TabsTrigger value="health"><ShieldCheck className="w-3.5 h-3.5 mr-1" />Health</TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <List title="Risks" items={report?.risks} />
            <List title="Recommendations" items={report?.recommendations} />
            <List title="Priority Actions" items={report?.priority_actions} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Section title="Revenue" metrics={s.revenue?.metrics} note={s.revenue?.note} />
            <Section title="Students" metrics={s.students?.metrics} note={s.students?.note} />
          </div>
        </TabsContent>
        <TabsContent value="revenue"><Section title="Revenue Intelligence" metrics={s.revenue?.metrics} note={s.revenue?.note} /></TabsContent>
        <TabsContent value="students"><Section title="Student Intelligence" metrics={s.students?.metrics} note={s.students?.note} /></TabsContent>
        <TabsContent value="employability"><Section title="Employability Intelligence" metrics={s.employability?.metrics} note={s.employability?.note} /></TabsContent>
        <TabsContent value="curriculum"><Section title="Curriculum Intelligence" metrics={s.curriculum?.metrics} note={s.curriculum?.note} /></TabsContent>
        <TabsContent value="marketing"><Section title="Marketing Intelligence" metrics={s.marketing?.metrics} note={s.marketing?.note} /></TabsContent>
        <TabsContent value="forecasting">
          <Section title="Forecasts" metrics={[
            { label: 'Revenue (30d, est.)', value: `$${(f.revenue_30d ?? 0).toLocaleString()}` },
            { label: 'Revenue (90d, est.)', value: `$${(f.revenue_90d ?? 0).toLocaleString()}` },
            { label: 'Revenue (12m, est.)', value: `$${(f.revenue_12m ?? 0).toLocaleString()}` },
            { label: 'Enrollment growth', value: `${f.enrollment_growth_pct ?? 0}%` },
            { label: 'Avg completion probability', value: `${f.avg_completion_probability ?? 0}%` },
            { label: 'Avg dropout probability', value: `${f.avg_dropout_probability ?? 0}%` },
          ]} note="Heuristic forecasts; sharpen with real billing + cohort history (Phase 2)." />
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">CEO Briefs</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {reports.length === 0 ? <p className="text-sm text-muted-foreground">No reports yet.</p> : reports.map((r) => (
                <div key={r.id} className="rounded-lg border border-border/60 p-3 bg-muted/20">
                  <div className="flex items-center justify-between"><span className="text-xs font-medium">{r.report_date}</span><Badge variant="outline" className="text-[10px]">CTIS {r.ctis}</Badge></div>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{r.summary}</p>
                </div>
              ))}
              <div className="pt-2">
                <p className="text-xs font-semibold mb-1">Intelligence engines</p>
                <div className="flex flex-wrap gap-1">{INTELLIGENCE_ENGINES.map((e) => <Badge key={e.id} variant="secondary" className="text-[10px]">{e.name}</Badge>)}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="health">
          {health ? (
            <Card><CardContent className="p-5 text-sm">
              <p className="font-medium">{health.name}</p>
              <p className="text-muted-foreground capitalize">Health: {health.health} · perf {health.performanceScore} · success {health.uptimePct}% · errors {health.errorCount}</p>
            </CardContent></Card>
          ) : <p className="text-sm text-muted-foreground">Run the agent once to populate health.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
