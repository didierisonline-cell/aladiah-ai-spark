import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Radio, RefreshCw } from 'lucide-react';
import { listEvents, type AOSEvent, type AOSEventType } from '@/services/aos/events';

// Risk-based accents: green = success/approval, red = failure/rejection,
// amber = awaiting a decision, slate = informational.
const TYPE_ACCENT: Record<AOSEventType, string> = {
  'agent.run.completed': '#22c55e',
  'agent.run.failed': '#ef4444',
  'work_order.opened': '#64748b',
  'work_order.gate.passed': '#22c55e',
  'work_order.gate.failed': '#ef4444',
  'work_order.submitted': '#f59e0b',
  'work_order.approved': '#22c55e',
  'work_order.rejected': '#ef4444',
  'work_order.completed': '#22c55e',
  'brain.decision.recorded': '#64748b',
  'readiness.snapshot': '#64748b',
  'intelligence.cycle.completed': '#64748b',
  'intelligence.recommendation': '#f59e0b',
  'briefing.generated': '#64748b',
  'impact.measured': '#22c55e',
};

const timeAgo = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

/**
 * Event Bus feed — the OS's flight recorder. Every run, gate outcome, founder
 * decision, brain record, and readiness snapshot lands here in order.
 */
const EventFeed = ({ limit = 40 }: { limit?: number }) => {
  const [events, setEvents] = useState<AOSEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setEvents(await listEvents(limit));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" /> Event Bus
          </span>
          <Button variant="ghost" size="sm" onClick={refresh} disabled={loading} aria-label="Refresh events">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <p className="text-[12px] text-muted-foreground">
          Every run, gate outcome, and decision — the OS's audit stream.
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {events.length === 0 ? (
          <p className="text-[12px] text-muted-foreground text-center py-6">
            {loading ? 'Loading events…' : 'No events yet. Run an agent or open a work order and its trail appears here.'}
          </p>
        ) : (
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {events.map((e) => (
              <div key={e.id} className="flex items-start gap-2.5 rounded-lg bg-muted/30 px-3 py-2">
                <span
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: TYPE_ACCENT[e.type] ?? '#64748b' }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">{e.type}</Badge>
                    <span className="text-[10px] text-muted-foreground">{e.source} · {timeAgo(e.createdAt)}</span>
                  </div>
                  <p className="text-[12px] text-foreground mt-0.5">{e.subject}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventFeed;
