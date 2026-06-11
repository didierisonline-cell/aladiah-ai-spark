import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Factory } from 'lucide-react';
import { aos } from '@/services/aos';
import { getAcademyReadiness, type AcademyReadiness } from '@/services/curriculum/readiness';
import { getProductionStatus, buildProductionQueue, type ProductionStatus, type QueueItem } from '@/services/curriculum/production';

const STATUS_KEYS = ['draft', 'in_review', 'approved', 'published', 'archived'] as const;
const STATUS_LABEL: Record<string, string> = { draft: 'Draft', in_review: 'Review', approved: 'Approved', published: 'Published', archived: 'Archived' };
const heat = (pct: number) => {
  const r = pct >= 90 ? 34 : pct >= 70 ? 59 : pct >= 40 ? 245 : 239;
  const g = pct >= 90 ? 197 : pct >= 70 ? 130 : pct >= 40 ? 158 : 68;
  const b = pct >= 90 ? 94 : pct >= 70 ? 246 : pct >= 40 ? 11 : 68;
  return `rgba(${r},${g},${b},${0.18 + (pct / 100) * 0.5})`;
};

const AcademyProduction = () => {
  const [readiness, setReadiness] = useState<AcademyReadiness | null>(null);
  const [prod, setProd] = useState<ProductionStatus | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [r, p] = await Promise.all([getAcademyReadiness(), getProductionStatus()]);
      setReadiness(r); setProd(p); setQueue(buildProductionQueue(r));
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const dimKeys = readiness?.programs[0]?.dims.map((d) => d.key) ?? [];
  const dimLabels = readiness?.programs[0]?.dims.map((d) => d.label) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Factory className="w-5 h-5 text-primary" /> Academy Production</h2>
          <p className="text-sm text-muted-foreground">Lifecycle status · completion heatmap · production queue · founder-only · live Supabase</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
      </div>

      {/* 1. Production Dashboard — status counts per program */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Curriculum Production Dashboard</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {!prod || prod.programs.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">No published programs / no content yet.</p> : (
            <table className="w-full text-[12.5px]">
              <thead><tr className="text-left text-muted-foreground border-b border-border/60">
                <th className="py-2 pr-3">Program</th>{STATUS_KEYS.map((s) => <th key={s} className="py-2 pr-3">{STATUS_LABEL[s]}</th>)}<th className="py-2">Total</th>
              </tr></thead>
              <tbody>
                {prod.programs.map((p) => (
                  <tr key={p.id} className="border-b border-border/40">
                    <td className="py-2 pr-3 font-semibold text-foreground">{p.title}</td>
                    {STATUS_KEYS.map((s) => <td key={s} className="py-2 pr-3">{p.counts[s]}</td>)}
                    <td className="py-2 font-bold">{p.total}</td>
                  </tr>
                ))}
                <tr className="font-bold text-foreground">
                  <td className="py-2 pr-3">Academy</td>
                  {STATUS_KEYS.map((s) => <td key={s} className="py-2 pr-3">{prod.academy[s]}</td>)}
                  <td className="py-2">{prod.total}</td>
                </tr>
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* 2. Program Completion Heatmap */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Program Completion Heatmap</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {!readiness || readiness.programs.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">No programs.</p> : (
            <table className="w-full text-[11px]">
              <thead><tr className="text-muted-foreground">
                <th className="text-left py-2 pr-3">Program</th>
                {dimLabels.map((l) => <th key={l} className="py-2 px-1 text-center whitespace-nowrap">{l}</th>)}
                <th className="py-2 px-1 text-center">Overall</th>
              </tr></thead>
              <tbody>
                {readiness.programs.map((p) => (
                  <tr key={p.id}>
                    <td className="py-1.5 pr-3 font-medium text-foreground whitespace-nowrap">{p.title}</td>
                    {p.dims.map((d) => (
                      <td key={d.key} className="py-1 px-1 text-center font-semibold" style={{ background: heat(d.pct), color: '#e2e8f8' }}>{d.pct}</td>
                    ))}
                    <td className="py-1 px-1 text-center font-bold" style={{ background: heat(p.readiness), color: '#fff' }}>{p.readiness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* 3. Academy Production Queue */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Academy Production Queue</CardTitle>
          <p className="text-[11px] text-muted-foreground">Ranked by revenue potential → market demand → completion → time-to-launch. <em>Revenue/demand are configured business estimates; completion is live.</em></p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {queue.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">No programs.</p> : (
            <table className="w-full text-[12.5px]">
              <thead><tr className="text-left text-muted-foreground border-b border-border/60">
                <th className="py-2 pr-3">#</th><th className="py-2 pr-3">Program</th><th className="py-2 pr-3">Priority</th>
                <th className="py-2 pr-3">Revenue</th><th className="py-2 pr-3">Demand</th><th className="py-2 pr-3">Completion</th>
                <th className="py-2 pr-3">Missing</th><th className="py-2">~Weeks</th>
              </tr></thead>
              <tbody>
                {queue.map((q, i) => (
                  <tr key={q.id} className="border-b border-border/40">
                    <td className="py-2 pr-3 text-muted-foreground">{i + 1}</td>
                    <td className="py-2 pr-3 font-semibold text-foreground">{q.title}</td>
                    <td className="py-2 pr-3 font-bold text-primary">{q.priority}</td>
                    <td className="py-2 pr-3">{q.revenue}</td><td className="py-2 pr-3">{q.demand}</td>
                    <td className="py-2 pr-3 font-bold" style={{ color: q.completion >= 90 ? '#22c55e' : '#f59e0b' }}>{q.completion}%</td>
                    <td className="py-2 pr-3 text-amber-500/90">{q.missing}</td><td className="py-2">{q.weeksToLaunch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyProduction;
