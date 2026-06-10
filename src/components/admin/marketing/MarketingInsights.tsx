import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Hash, Heart, PieChart } from 'lucide-react';
import { AgentHealth } from '@/types/aos';
import { MarketingStats } from '@/types/marketing';

interface Props {
  stats: MarketingStats;
  health: AgentHealth | null;
}

const HEALTH_COLOR: Record<string, string> = {
  healthy: 'text-green-600',
  degraded: 'text-amber-600',
  down: 'text-red-600',
  idle: 'text-slate-500',
};

const MarketingInsights = ({ stats, health }: Props) => {
  const maxTheme = Math.max(1, ...stats.topThemes.map((t) => t.count));
  const maxPlatform = Math.max(1, ...stats.byPlatform.map((p) => p.count));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Hash className="w-4 h-4 text-primary" />
            Top Themes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.topThemes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No themes yet.</p>
          ) : (
            stats.topThemes.map((t) => (
              <div key={t.theme}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-foreground">{t.theme}</span>
                  <span className="text-muted-foreground">{t.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${(t.count / maxTheme) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PieChart className="w-4 h-4 text-primary" />
            By Platform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.byPlatform.length === 0 ? (
            <p className="text-sm text-muted-foreground">No content yet.</p>
          ) : (
            stats.byPlatform.map((p) => (
              <div key={p.platform}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-foreground capitalize">{p.platform}</span>
                  <span className="text-muted-foreground">{p.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-indigo-500"
                    style={{ width: `${(p.count / maxPlatform) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Agent Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!health ? (
            <p className="text-sm text-muted-foreground">Agent not registered yet — run it once.</p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{health.name}</span>
                <span className={`text-xs font-semibold capitalize ${HEALTH_COLOR[health.health]}`}>
                  {health.health}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/30 py-2">
                  <p className="text-lg font-bold">{health.performanceScore}</p>
                  <p className="text-[10px] text-muted-foreground">Perf</p>
                </div>
                <div className="rounded-lg bg-muted/30 py-2">
                  <p className="text-lg font-bold">{health.uptimePct}%</p>
                  <p className="text-[10px] text-muted-foreground">Success</p>
                </div>
                <div className="rounded-lg bg-muted/30 py-2">
                  <p className="text-lg font-bold">{health.errorCount}</p>
                  <p className="text-[10px] text-muted-foreground">Errors</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Last success:{' '}
                {health.lastSuccessAt ? new Date(health.lastSuccessAt).toLocaleString() : 'never'}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingInsights;
