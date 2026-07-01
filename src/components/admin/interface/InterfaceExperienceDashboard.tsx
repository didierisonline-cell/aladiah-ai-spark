import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle, CheckCircle2, HelpCircle, Layout, MonitorSmartphone, Play, RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos } from '@/services/aos';
import {
  INTERFACE_AGENT_SLUG,
  getUXPosture,
  type UXPosture,
} from '@/services/agents/interfaceExperienceAgent';
import { listWorkOrders, type WorkOrder } from '@/services/aos/workOrders';

const statusColor = (s: 'pass' | 'warn' | 'fail') =>
  s === 'pass' ? '#22c55e' : s === 'warn' ? '#f59e0b' : '#ef4444';
const scoreColor = (n: number) => (n >= 80 ? '#22c55e' : n >= 50 ? '#f59e0b' : '#ef4444');

/** /admin/interface-agent — Interface & Experience Architect control center. */
const InterfaceExperienceDashboard = () => {
  const { toast } = useToast();
  const [posture, setPosture] = useState<UXPosture | null>(null);
  const [uxOrders, setUxOrders] = useState<WorkOrder[]>([]);
  const [running, setRunning] = useState(false);

  const load = useCallback(async () => {
    setPosture(getUXPosture());
    try {
      await aos.ensure();
      const orders = await listWorkOrders(200);
      setUxOrders(orders.filter((o) => o.gates.ux === 'pending' || o.gates.ux === 'in_review'));
    } catch {
      /* defensive — posture still renders */
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const runNow = useCallback(async () => {
    setRunning(true);
    try {
      const o = await aos.orchestrator.runAgent(INTERFACE_AGENT_SLUG, 'manual');
      toast({
        title: o.ok ? 'UX audit complete' : 'UX audit failed',
        description: o.ok ? `Finished in ${o.durationMs}ms.` : o.error ?? 'Unknown error',
        variant: o.ok ? 'default' : 'destructive',
      });
    } finally {
      setRunning(false);
      load();
    }
  }, [toast, load]);

  const p = posture;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Layout className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Interface & Experience Architect</h1>
            <p className="text-sm text-muted-foreground">
              UX, navigation, accessibility & premium visual consistency — read-only authority. Agent #14.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button size="sm" onClick={runNow} disabled={running}>
            <Play className={`w-4 h-4 mr-2 ${running ? 'animate-pulse' : ''}`} />
            {running ? 'Running…' : 'Run UX Audit'}
          </Button>
        </div>
      </div>

      {p && (
        <>
          {/* Headline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-4">
              <div className="text-3xl font-bold" style={{ color: scoreColor(p.overall) }}>{p.overall}</div>
              <div className="text-[11px] text-muted-foreground">UX Posture Score</div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <div className="text-3xl font-bold text-foreground">
                {p.sections.reduce((n, s) => n + s.checks.filter((c) => c.status !== 'pass').length, 0)}
              </div>
              <div className="text-[11px] text-muted-foreground">Open Design Items</div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <div className={`text-3xl font-bold ${uxOrders.length > 0 ? 'text-amber-500' : 'text-foreground'}`}>{uxOrders.length}</div>
              <div className="text-[11px] text-muted-foreground">UX-Gate Reviews Waiting</div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <div className="text-3xl font-bold text-muted-foreground">{p.unmeasured.length}</div>
              <div className="text-[11px] text-muted-foreground">Areas Not Yet Measured</div>
            </CardContent></Card>
          </div>

          {/* Posture sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {p.sections.map((s) => (
              <Card key={s.key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MonitorSmartphone className="w-4 h-4 text-primary" /> {s.title}
                    </span>
                    <span className="text-base font-bold" style={{ color: scoreColor(s.score) }}>{s.score}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {s.checks.map((c) => (
                    <div key={c.id} className="flex items-start gap-2 text-[12px]">
                      {c.status === 'pass'
                        ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: statusColor(c.status) }} />
                        : <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: statusColor(c.status) }} />}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{c.label}</p>
                        <p className="text-[11px] text-muted-foreground">{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* UX-gate queue */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Work orders awaiting UX review</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {uxOrders.length === 0 ? (
                <p className="text-[12px] text-muted-foreground py-4">
                  No work orders are waiting on the UX gate. Gate outcomes are recorded from the Founder cockpit.
                </p>
              ) : uxOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-border/50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{o.title}</p>
                    <p className="text-[11px] text-muted-foreground">Owner: {o.ownerAgent ?? '—'} · {o.type}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize shrink-0">{o.gates.ux.replace('_', ' ')}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Honestly unmeasured */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Not yet measured
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {p.unmeasured.map((u) => (
                <div key={u.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0 text-[12px]">
                  <span className="font-medium text-foreground shrink-0">{u.label}</span>
                  <span className="text-muted-foreground">{u.how}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InterfaceExperienceDashboard;
