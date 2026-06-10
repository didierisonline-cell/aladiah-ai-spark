import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Brain,
  CheckSquare,
  CircleDollarSign,
  Cpu,
  FileText,
  Heart,
  LayoutGrid,
  ListChecks,
  MessageSquare,
  Megaphone,
  Play,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentMessage, AgentMemory, AgentRecord, AgentStatus, AgentTask } from '@/services/aos';
import {
  WorkforceReport,
  WorkforceSnapshot,
  getRecentMemory,
  getRecentReports,
  getWorkforceSnapshot,
} from '@/services/aos/workforce';
import { MarketingContent } from '@/types/marketing';
import { listPendingApproval } from '@/services/agents/marketingContentAgent';
import AgentCard from './AgentCard';
import MemoryFeed from './MemoryFeed';
import ReportsFeed from './ReportsFeed';
import AgentRegistryTable from '@/components/admin/aos/AgentRegistryTable';
import TaskBoard from '@/components/admin/aos/TaskBoard';
import MessageFeed from '@/components/admin/aos/MessageFeed';
import ApprovalQueue from '@/components/admin/marketing/ApprovalQueue';

const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);

const EMPTY: WorkforceSnapshot = {
  agents: [],
  globals: {
    activeAgents: 0, totalAgents: 0, tasksCompletedToday: 0, contentGenerated: 0,
    leadsGenerated: 0, revenueImpact: 0, healthScore: 100,
  },
};

const AIWorkforceDashboard = () => {
  const { toast } = useToast();
  const [snapshot, setSnapshot] = useState<WorkforceSnapshot>(EMPTY);
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [pending, setPending] = useState<MarketingContent[]>([]);
  const [memories, setMemories] = useState<AgentMemory[]>([]);
  const [reports, setReports] = useState<WorkforceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningSlug, setRunningSlug] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [snap, ag, tk, msg, pend, mem, rep] = await Promise.all([
        getWorkforceSnapshot(),
        aos.registry.listAgents(),
        aos.tasks.listTasks(),
        aos.comms.listMessages(80),
        listPendingApproval(),
        getRecentMemory(80),
        getRecentReports(20),
      ]);
      setSnapshot(snap);
      setAgents(ag);
      setTasks(tk);
      setMessages(msg);
      setPending(pend);
      setMemories(mem);
      setReports(rep);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleRun = useCallback(
    async (slug: string) => {
      setRunningSlug(slug);
      try {
        const o = await aos.orchestrator.runAgent(slug, 'manual');
        toast({
          title: o.ok ? `${slug} ran` : `${slug} failed`,
          description: o.ok ? `Done in ${o.durationMs}ms.` : o.error ?? 'Unknown error',
          variant: o.ok ? 'default' : 'destructive',
        });
      } finally {
        setRunningSlug(null);
        refresh();
      }
    },
    [toast, refresh],
  );

  const handleRunAll = useCallback(async () => {
    setRunningSlug('__all__');
    try {
      const active = agents.filter((a) => a.status === 'active');
      for (const a of active) await aos.orchestrator.runAgent(a.slug, 'manual');
      toast({ title: 'Workforce run complete', description: `Ran ${active.length} active agent(s).` });
    } finally {
      setRunningSlug(null);
      refresh();
    }
  }, [agents, toast, refresh]);

  const handleToggle = useCallback(
    async (slug: string, next: AgentStatus) => {
      await aos.registry.setAgentStatus(slug, next);
      refresh();
    },
    [refresh],
  );

  const g = snapshot.globals;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-primary" />
            AI Workforce Control Center
          </h1>
          <p className="text-sm text-muted-foreground">
            The master control surface for the entire Aladiah AI Workforce
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleRunAll} disabled={runningSlug !== null}>
            <Play className={`w-4 h-4 mr-2 ${runningSlug === '__all__' ? 'animate-pulse' : ''}`} />
            {runningSlug === '__all__' ? 'Running…' : 'Run All Agents'}
          </Button>
        </div>
      </div>

      {/* Global metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Metric icon={Users} label="Active Agents" value={`${g.activeAgents}/${g.totalAgents}`} accent="text-green-600" />
        <Metric icon={CheckSquare} label="Tasks Done Today" value={g.tasksCompletedToday} accent="text-blue-600" />
        <Metric icon={Sparkles} label="Content Generated" value={g.contentGenerated} accent="text-purple-600" />
        <Metric icon={Activity} label="Leads Generated" value={g.leadsGenerated} accent="text-indigo-600" />
        <Metric icon={CircleDollarSign} label="Revenue Impact (MRR)" value={money(g.revenueImpact)} accent="text-emerald-600" />
        <Metric icon={Heart} label="Health Score" value={g.healthScore} accent={g.healthScore >= 70 ? 'text-green-600' : 'text-amber-600'} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="overview"><LayoutGrid className="w-3.5 h-3.5 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="agents"><Cpu className="w-3.5 h-3.5 mr-1" />Agents</TabsTrigger>
          <TabsTrigger value="tasks"><ListChecks className="w-3.5 h-3.5 mr-1" />Tasks</TabsTrigger>
          <TabsTrigger value="approvals">
            <CheckSquare className="w-3.5 h-3.5 mr-1" />Approvals
            {pending.length > 0 && (
              <span className="ml-1 text-[10px] bg-amber-500 text-white rounded-full px-1.5">{pending.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="memory"><Brain className="w-3.5 h-3.5 mr-1" />Memory</TabsTrigger>
          <TabsTrigger value="comms"><MessageSquare className="w-3.5 h-3.5 mr-1" />Communications</TabsTrigger>
          <TabsTrigger value="reports"><FileText className="w-3.5 h-3.5 mr-1" />Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {snapshot.agents.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">
              No agents registered yet. Apply the AOS migrations and refresh.
            </CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {snapshot.agents.map((a) => (
                <AgentCard key={a.slug} agent={a} running={runningSlug === a.slug} onRun={handleRun} />
              ))}
              <Card className="border-dashed">
                <CardContent className="p-5 flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Megaphone className="w-6 h-6 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Future Agents</p>
                  <p className="text-[11px]">Social Media · YouTube · Placement · Curriculum — plug into the AOS here.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="agents">
          <AgentRegistryTable agents={agents} runningSlug={runningSlug} onRun={handleRun} onToggleStatus={handleToggle} />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskBoard tasks={tasks} />
        </TabsContent>

        <TabsContent value="approvals">
          <ApprovalQueue items={pending} onChange={refresh} />
        </TabsContent>

        <TabsContent value="memory">
          <MemoryFeed memories={memories} />
        </TabsContent>

        <TabsContent value="comms">
          <MessageFeed messages={messages} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsFeed reports={reports} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Metric = ({
  icon: Icon, label, value, accent = 'text-primary',
}: { icon: React.ElementType; label: string; value: string | number; accent?: string }) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
        <Icon className={`w-4 h-4 ${accent}`} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold truncate">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

export default AIWorkforceDashboard;
