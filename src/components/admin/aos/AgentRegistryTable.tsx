import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pause, Play, RefreshCw } from 'lucide-react';
import { AgentRecord, AgentStatus } from '@/types/aos';

const STATUS_STYLES: Record<AgentStatus, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  paused: 'bg-amber-100 text-amber-700 border-amber-200',
  disabled: 'bg-slate-100 text-slate-600 border-slate-200',
  error: 'bg-red-100 text-red-700 border-red-200',
};

const fmt = (s: string | null) => (s ? new Date(s).toLocaleString() : '—');

interface Props {
  agents: AgentRecord[];
  runningSlug: string | null;
  onRun: (slug: string) => void;
  onToggleStatus: (slug: string, next: AgentStatus) => void;
}

const AgentRegistryTable = ({ agents, runningSlug, onRun, onToggleStatus }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Agent Registry</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b">
              <th className="py-2 pr-3">Agent</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Priority</th>
              <th className="py-2 pr-3">Cadence</th>
              <th className="py-2 pr-3">Last run</th>
              <th className="py-2 pr-3">Next run</th>
              <th className="py-2 pr-3">Perms</th>
              <th className="py-2 pr-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-muted-foreground">
                  No agents registered.
                </td>
              </tr>
            ) : (
              agents.map((a) => {
                const isActive = a.status === 'active';
                return (
                  <tr key={a.slug} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-2 pr-3">
                      <p className="font-medium text-foreground">{a.name}</p>
                      <p className="text-[11px] text-muted-foreground">{a.role || a.slug}</p>
                    </td>
                    <td className="py-2 pr-3">
                      <Badge className={`text-[10px] border ${STATUS_STYLES[a.status]}`}>
                        {a.status}
                      </Badge>
                    </td>
                    <td className="py-2 pr-3">{a.priority}</td>
                    <td className="py-2 pr-3 capitalize">{a.cadence}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{fmt(a.last_run_at)}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{fmt(a.next_run_at)}</td>
                    <td className="py-2 pr-3">
                      <div className="flex flex-wrap gap-1">
                        {(['read', 'write', 'publish', 'admin'] as const)
                          .filter((c) => a.permissions?.[c])
                          .map((c) => (
                            <Badge key={c} variant="secondary" className="text-[9px] px-1">
                              {c}
                            </Badge>
                          ))}
                        {a.permissions?.human_approval_required && (
                          <Badge variant="outline" className="text-[9px] px-1">
                            approval
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2"
                          disabled={runningSlug === a.slug || a.status === 'disabled'}
                          onClick={() => onRun(a.slug)}
                        >
                          <RefreshCw
                            className={`w-3 h-3 ${runningSlug === a.slug ? 'animate-spin' : ''}`}
                          />
                          <span className="ml-1">Run</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2"
                          onClick={() => onToggleStatus(a.slug, isActive ? 'paused' : 'active')}
                        >
                          {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default AgentRegistryTable;
