import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentRun, ExecutionLog, LogLevel, RunStatus } from '@/types/aos';

const RUN_STYLES: Record<RunStatus, string> = {
  running: 'bg-blue-100 text-blue-700 border-blue-200',
  success: 'bg-green-100 text-green-700 border-green-200',
  error: 'bg-red-100 text-red-700 border-red-200',
  retrying: 'bg-amber-100 text-amber-700 border-amber-200',
  timeout: 'bg-orange-100 text-orange-700 border-orange-200',
};

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: 'text-slate-400',
  info: 'text-slate-600',
  warn: 'text-amber-600',
  error: 'text-red-600',
};

const time = (s: string) => new Date(s).toLocaleTimeString();

const ExecutionLogFeed = ({ runs, logs }: { runs: AgentRun[]; logs: ExecutionLog[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Runs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[420px] overflow-y-auto">
          {runs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No runs recorded yet.</p>
          ) : (
            runs.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 bg-muted/20"
              >
                <div>
                  <p className="text-xs font-medium text-foreground">{r.agent_slug}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {time(r.started_at)} · {r.trigger_source}
                    {r.duration_ms != null && ` · ${r.duration_ms}ms`}
                    {r.attempt > 1 && ` · attempt ${r.attempt}`}
                  </p>
                </div>
                <Badge className={`text-[10px] border ${RUN_STYLES[r.status]}`}>{r.status}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Execution Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 max-h-[420px] overflow-y-auto font-mono text-[11px]">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground font-sans">No actions logged yet.</p>
          ) : (
            logs.map((l) => (
              <div key={l.id} className="flex gap-2 border-b border-border/40 py-1">
                <span className="text-muted-foreground shrink-0">{time(l.created_at)}</span>
                <span className={`shrink-0 uppercase ${LEVEL_COLOR[l.level]}`}>{l.level}</span>
                <span className="text-foreground/70 shrink-0">{l.agent_slug}</span>
                <span className="text-foreground">
                  {l.action}
                  {l.message ? ` — ${l.message}` : ''}
                  {l.error ? ` :: ${l.error}` : ''}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutionLogFeed;
