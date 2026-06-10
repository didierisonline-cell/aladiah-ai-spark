import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  CheckCircle2,
  Clock,
  ListChecks,
  Play,
  ScrollText,
} from 'lucide-react';
import { AgentSnapshot } from '@/services/aos/workforce';

const HEALTH: Record<AgentSnapshot['health'], { color: string; dot: string; label: string }> = {
  healthy: { color: 'text-green-600', dot: 'bg-green-500', label: 'Healthy' },
  degraded: { color: 'text-amber-600', dot: 'bg-amber-500', label: 'Degraded' },
  down: { color: 'text-red-600', dot: 'bg-red-500', label: 'Down' },
  idle: { color: 'text-slate-500', dot: 'bg-slate-400', label: 'Idle' },
};

const fmt = (s: string | null) => (s ? new Date(s).toLocaleString() : '—');

interface Props {
  agent: AgentSnapshot;
  running: boolean;
  onRun: (slug: string) => void;
}

const AgentCard = ({ agent, running, onRun }: Props) => {
  const h = HEALTH[agent.health];
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{agent.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{agent.role || agent.slug}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-medium ${h.color}`}>
            <span className={`w-2 h-2 rounded-full ${h.dot}`} />
            {h.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] capitalize">{agent.status}</Badge>
          <Badge variant="outline" className="text-[10px] capitalize">{agent.cadence}</Badge>
          <div className="ml-auto text-right">
            <p className="text-lg font-bold leading-none">{agent.performanceScore}</p>
            <p className="text-[9px] text-muted-foreground">health score</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <Metric icon={CheckCircle2} value={agent.tasksCompleted} label="Done" />
          <Metric icon={ListChecks} value={agent.tasksPending} label="Pending" />
          <Metric icon={Brain} value={agent.memoryRecords} label="Memory" />
          <Metric icon={ScrollText} value={agent.executionLogs} label="Logs" />
        </div>

        <div className="text-[11px] text-muted-foreground space-y-0.5">
          <p className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last run: {fmt(agent.lastRunAt)}</p>
          <p className="flex items-center gap-1"><Clock className="w-3 h-3" /> Next run: {fmt(agent.nextRunAt)}</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="w-full"
          disabled={running || agent.status === 'disabled'}
          onClick={() => onRun(agent.slug)}
        >
          <Play className={`w-3.5 h-3.5 mr-1 ${running ? 'animate-pulse' : ''}`} />
          {running ? 'Running…' : 'Run now'}
        </Button>
      </CardContent>
    </Card>
  );
};

const Metric = ({ icon: Icon, value, label }: { icon: React.ElementType; value: number; label: string }) => (
  <div className="rounded-lg bg-muted/30 py-1.5">
    <Icon className="w-3 h-3 mx-auto text-muted-foreground mb-0.5" />
    <p className="text-sm font-bold leading-none">{value}</p>
    <p className="text-[9px] text-muted-foreground">{label}</p>
  </div>
);

export default AgentCard;
