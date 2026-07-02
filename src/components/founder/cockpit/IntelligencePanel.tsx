import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Binoculars, Play, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  CycleResult,
  listObservers,
  runIntelligenceSweep,
} from '@/services/aos/intelligence';
import { WorkOrder, listWorkOrders } from '@/services/aos/workOrders';
import { recordImpactMeasurement, type ImpactOutcome } from '@/services/aos/briefings';

const SEV_COLOR: Record<string, string> = { critical: '#ef4444', attention: '#f59e0b', info: '#64748b' };

/**
 * Continuous Intelligence — every department observing live telemetry.
 * Observe → Analyze → Validate → Score → Recommend (into governance) →
 * Measure impact → Learn. Observers read internal data only; external
 * research is an unconnected integration point, declared as such.
 */
const IntelligencePanel = ({ onChange }: { onChange?: () => void }) => {
  const { toast } = useToast();
  const [results, setResults] = useState<CycleResult[]>([]);
  const [running, setRunning] = useState(false);
  const [unmeasured, setUnmeasured] = useState<WorkOrder[]>([]);
  const [impactNote, setImpactNote] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const departments = [...new Set(listObservers().map((o) => o.department))];

  const loadUnmeasured = useCallback(async () => {
    const orders = await listWorkOrders(200);
    setUnmeasured(
      orders.filter(
        (o) => o.status === 'completed' && !o.evidence.some((e) => e.note.startsWith('IMPACT (')),
      ).slice(0, 5),
    );
  }, []);

  useEffect(() => { loadUnmeasured(); }, [loadUnmeasured]);

  const sweep = useCallback(async () => {
    setRunning(true);
    try {
      const res = await runIntelligenceSweep();
      setResults(res);
      const findings = res.reduce((n, r) => n + r.findings.length, 0);
      const recs = res.reduce((n, r) => n + r.recommendationsOpened, 0);
      toast({
        title: `Intelligence sweep: ${findings} finding(s)`,
        description: `${res.length} department(s) observed · ${recs} recommendation(s) opened into governance.`,
      });
    } finally {
      setRunning(false);
      loadUnmeasured();
      onChange?.();
    }
  }, [toast, loadUnmeasured, onChange]);

  const measure = useCallback(async (wo: WorkOrder, outcome: ImpactOutcome) => {
    const note = impactNote[wo.id]?.trim();
    if (!note) {
      toast({ title: 'Evidence required', description: 'State what was measured before recording impact.', variant: 'destructive' });
      return;
    }
    setBusy(wo.id);
    try {
      await recordImpactMeasurement(wo, { outcome, measured: note });
      toast({ title: `Impact recorded (${outcome})`, description: wo.title });
      setImpactNote((n) => ({ ...n, [wo.id]: '' }));
    } finally {
      setBusy(null);
      loadUnmeasured();
      onChange?.();
    }
  }, [impactNote, toast, loadUnmeasured, onChange]);

  const allFindings = results.flatMap((r) => r.findings);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Binoculars className="w-4 h-4 text-primary" /> Continuous Intelligence
          </span>
          <Button size="sm" onClick={sweep} disabled={running}>
            <Play className={`w-3.5 h-3.5 mr-1.5 ${running ? 'animate-pulse' : ''}`} />
            {running ? 'Observing…' : 'Run sweep'}
          </Button>
        </CardTitle>
        <p className="text-[12px] text-muted-foreground">
          {departments.length} departments · {listObservers().length} live observers. Qualified findings open recommendations into the governance pipeline — nothing bypasses the gates.
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Findings from the latest sweep */}
        {allFindings.length === 0 ? (
          <p className="text-[12px] text-muted-foreground text-center py-4">
            {running ? 'Observing live telemetry…' : 'Run a sweep to observe every department. Findings appear with evidence and confidence.'}
          </p>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {allFindings.map((f, i) => (
              <div key={i} className="rounded-lg bg-muted/30 px-3 py-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SEV_COLOR[f.severity] }} aria-hidden />
                  <span className="text-[12px] font-medium text-foreground">{f.title}</span>
                  <Badge variant="outline" className="text-[9px] ml-auto shrink-0">
                    {Math.round(f.confidence.value * 100)}% conf
                  </Badge>
                  <Badge variant="secondary" className="text-[9px] shrink-0">{f.department}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{f.detail}</p>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                  Basis: {f.confidence.basis}{f.recommendation ? ' · recommendation opened/queued' : ''}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Impact measurement — the learn loop */}
        {unmeasured.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Completed work awaiting impact measurement
            </p>
            {unmeasured.map((wo) => (
              <div key={wo.id} className="rounded-lg border border-border/60 p-2.5 space-y-1.5">
                <p className="text-[12px] font-medium text-foreground truncate">{wo.title}</p>
                <div className="flex gap-2">
                  <Input
                    value={impactNote[wo.id] ?? ''}
                    onChange={(e) => setImpactNote((n) => ({ ...n, [wo.id]: e.target.value }))}
                    placeholder="What was measured, against which success metric?"
                    aria-label="Impact measurement"
                    className="flex-1 h-8 text-[12px]"
                  />
                  <Button size="sm" variant="outline" onClick={() => measure(wo, 'positive')} disabled={busy === wo.id}>▲</Button>
                  <Button size="sm" variant="outline" onClick={() => measure(wo, 'neutral')} disabled={busy === wo.id}>＝</Button>
                  <Button size="sm" variant="outline" onClick={() => measure(wo, 'negative')} disabled={busy === wo.id}>▼</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligencePanel;
