import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  BriefingPeriod,
  BriefingStatus,
  generateExecutiveReport,
  getBriefingStatus,
  listBriefings,
} from '@/services/aos/briefings';
import type { BrainEntry } from '@/services/aos/brain';

const when = (iso: string | null) => {
  if (!iso) return 'never';
  try { return new Date(iso).toLocaleString(); } catch { return ''; }
};

/**
 * Executive Briefings — daily / weekly / monthly / quarterly, compiled from
 * live OS state and stored in the Company Brain. Staleness is shown honestly;
 * generation is on-demand until server-side scheduling exists.
 */
const BriefingsPanel = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<BriefingStatus[]>([]);
  const [latest, setLatest] = useState<BrainEntry | null>(null);
  const [busy, setBusy] = useState<BriefingPeriod | null>(null);

  const refresh = useCallback(async () => {
    setStatus(await getBriefingStatus());
    const reports = await listBriefings(undefined, 1);
    setLatest(reports[0] ?? null);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const generate = useCallback(async (period: BriefingPeriod) => {
    setBusy(period);
    try {
      const entry = await generateExecutiveReport(period);
      toast({
        title: entry ? 'Briefing generated' : 'Could not generate briefing',
        description: entry ? 'Stored in the Company Brain.' : 'Check admin access / AOS migrations.',
        variant: entry ? 'default' : 'destructive',
      });
      if (entry) setLatest(entry);
    } finally {
      setBusy(null);
      refresh();
    }
  }, [toast, refresh]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Executive Briefings
        </CardTitle>
        <p className="text-[12px] text-muted-foreground">
          Compiled from live OS state, stored in the Company Brain. On-demand until server-side scheduling ships.
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="space-y-1.5">
          {status.map((s) => (
            <div key={s.period} className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-foreground">{s.label}</p>
                <p className="text-[10.5px] text-muted-foreground">Last: {when(s.lastGeneratedAt)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className="text-[9px]"
                  style={{ color: s.stale ? '#f59e0b' : '#22c55e', borderColor: s.stale ? '#f59e0b55' : '#22c55e55' }}
                >
                  {s.stale ? 'due' : 'current'}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => generate(s.period)} disabled={busy !== null}>
                  <Sparkles className={`w-3.5 h-3.5 mr-1 ${busy === s.period ? 'animate-pulse' : ''}`} />
                  {busy === s.period ? 'Compiling…' : 'Generate'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {latest && (
          <div className="rounded-lg border border-border/60 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Latest report · {when(latest.createdAt)}
            </p>
            <pre className="text-[11px] text-foreground whitespace-pre-wrap font-body max-h-56 overflow-y-auto">
              {latest.content}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BriefingsPanel;
