import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Cpu,
  Heart,
  ListChecks,
  MessageSquare,
  Play,
  RefreshCw,
  ScrollText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AgentHealth,
  AgentMessage,
  AgentRecord,
  AgentRun,
  AgentStatus,
  AgentTask,
  ExecutionLog,
  aos,
} from '@/services/aos';
import AgentHealthPanel from './AgentHealthPanel';
import AgentRegistryTable from './AgentRegistryTable';
import TaskBoard from './TaskBoard';
import ExecutionLogFeed from './ExecutionLogFeed';
import MessageFeed from './MessageFeed';

interface FleetData {
  agents: AgentRecord[];
  health: AgentHealth[];
  tasks: AgentTask[];
  runs: AgentRun[];
  logs: ExecutionLog[];
  messages: AgentMessage[];
}

const EMPTY: FleetData = { agents: [], health: [], tasks: [], runs: [], logs: [], messages: [] };

const AgentOSDashboard = () => {
  const { toast } = useToast();
  const [data, setData] = useState<FleetData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [runningSlug, setRunningSlug] = useState<string | null>(null);
  const [ticking, setTicking] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [agents, health, tasks, runs, logs, messages] = await Promise.all([
        aos.registry.listAgents(),
        aos.health.getFleetHealth(),
        aos.tasks.listTasks(),
        aos.logs.listRuns(undefined, 40),
        aos.logs.listLogs({ limit: 120 }),
        aos.comms.listMessages(60),
      ]);
      setData({ agents, health, tasks, runs, logs, messages });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleRun = useCallback(
    async (slug: string) => {
      setRunningSlug(slug);
      try {
        const outcome = await aos.orchestrator.runAgent(slug, 'manual');
        toast({
          title: outcome.ok ? `${slug} ran successfully` : `${slug} run failed`,
          description: outcome.ok
            ? `Completed in ${outcome.durationMs}ms (${outcome.attempts} attempt(s)).`
            : outcome.error ?? 'Unknown error',
          variant: outcome.ok ? 'default' : 'destructive',
        });
      } finally {
        setRunningSlug(null);
        refresh();
      }
    },
    [toast, refresh],
  );

  const handleTick = useCallback(async () => {
    setTicking(true);
    try {
      const outcomes = await aos.orchestrator.tick();
      toast({
        title: 'Orchestrator tick complete',
        description:
          outcomes.length === 0
            ? 'No agents were due to run.'
            : `Ran ${outcomes.length} due agent(s): ${outcomes.map((o) => o.agentSlug).join(', ')}.`,
      });
    } finally {
      setTicking(false);
      refresh();
    }
  }, [toast, refresh]);

  const handleToggle = useCallback(
    async (slug: string, next: AgentStatus) => {
      await aos.registry.setAgentStatus(slug, next);
      refresh();
    },
    [refresh],
  );

  const activeCount = data.agents.filter((a) => a.status === 'active').length;
  const openTasks = data.tasks.filter(
    (t) => !['completed', 'cancelled'].includes(t.status),
  ).length;
  const downAgents = data.health.filter((h) => h.health === 'down').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-6 h-6 text-primary" />
            Agent Operating System
          </h1>
          <p className="text-sm text-muted-foreground">
            The permanent control plane for the Aladiah AI Workforce
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleTick} disabled={ticking}>
            <Play className={`w-4 h-4 mr-2 ${ticking ? 'animate-pulse' : ''}`} />
            {ticking ? 'Running…' : 'Run Orchestrator Tick'}
          </Button>
        </div>
      </div>

      {/* Fleet summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile icon={Cpu} label="Agents" value={data.agents.length} />
        <SummaryTile icon={Activity} label="Active" value={activeCount} accent="text-green-600" />
        <SummaryTile icon={ListChecks} label="Open Tasks" value={openTasks} accent="text-blue-600" />
        <SummaryTile
          icon={Heart}
          label="Down"
          value={downAgents}
          accent={downAgents > 0 ? 'text-red-600' : 'text-green-600'}
        />
      </div>

      <Tabs defaultValue="registry" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="registry"><Cpu className="w-3.5 h-3.5 mr-1" />Registry</TabsTrigger>
          <TabsTrigger value="health"><Heart className="w-3.5 h-3.5 mr-1" />Health</TabsTrigger>
          <TabsTrigger value="tasks"><ListChecks className="w-3.5 h-3.5 mr-1" />Tasks</TabsTrigger>
          <TabsTrigger value="logs"><ScrollText className="w-3.5 h-3.5 mr-1" />Logs</TabsTrigger>
          <TabsTrigger value="comms"><MessageSquare className="w-3.5 h-3.5 mr-1" />Comms</TabsTrigger>
        </TabsList>

        <TabsContent value="registry">
          <AgentRegistryTable
            agents={data.agents}
            runningSlug={runningSlug}
            onRun={handleRun}
            onToggleStatus={handleToggle}
          />
        </TabsContent>
        <TabsContent value="health">
          <AgentHealthPanel health={data.health} />
        </TabsContent>
        <TabsContent value="tasks">
          <TaskBoard tasks={data.tasks} />
        </TabsContent>
        <TabsContent value="logs">
          <ExecutionLogFeed runs={data.runs} logs={data.logs} />
        </TabsContent>
        <TabsContent value="comms">
          <MessageFeed messages={data.messages} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SummaryTile = ({
  icon: Icon,
  label,
  value,
  accent = 'text-primary',
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent?: string;
}) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
        <Icon className={`w-4 h-4 ${accent}`} />
      </div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

export default AgentOSDashboard;
