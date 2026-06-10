import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertTriangle, CheckCircle2, MinusCircle, XCircle } from 'lucide-react';
import { AgentHealth } from '@/types/aos';

const HEALTH_META: Record<
  AgentHealth['health'],
  { icon: React.ElementType; color: string; label: string }
> = {
  healthy: { icon: CheckCircle2, color: 'text-green-600', label: 'Healthy' },
  degraded: { icon: AlertTriangle, color: 'text-amber-600', label: 'Degraded' },
  down: { icon: XCircle, color: 'text-red-600', label: 'Down' },
  idle: { icon: MinusCircle, color: 'text-slate-500', label: 'Idle' },
};

const AgentHealthPanel = ({ health }: { health: AgentHealth[] }) => {
  if (health.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No agents registered yet.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {health.map((h) => {
        const meta = HEALTH_META[h.health];
        const Icon = meta.icon;
        return (
          <Card key={h.slug}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.slug}</p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${meta.color}`}>
                  <Icon className="w-4 h-4" />
                  {meta.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/30 py-2">
                  <p className="text-lg font-bold">{h.performanceScore}</p>
                  <p className="text-[10px] text-muted-foreground">Perf score</p>
                </div>
                <div className="rounded-lg bg-muted/30 py-2">
                  <p className="text-lg font-bold">{h.uptimePct}%</p>
                  <p className="text-[10px] text-muted-foreground">Success rate</p>
                </div>
                <div className="rounded-lg bg-muted/30 py-2">
                  <p className="text-lg font-bold">{h.errorCount}</p>
                  <p className="text-[10px] text-muted-foreground">Errors</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Last success:{' '}
                {h.lastSuccessAt
                  ? new Date(h.lastSuccessAt).toLocaleString()
                  : 'never'}
                {h.consecutiveFailures > 0 && (
                  <span className="text-red-500 ml-1">
                    · {h.consecutiveFailures} consecutive failure(s)
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AgentHealthPanel;
