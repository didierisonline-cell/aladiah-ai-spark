import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  CheckSquare,
  FileText,
  Library,
  Megaphone,
  PenTool,
  Play,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import {
  ContentCalendar,
  MarketingCampaign,
  MarketingContent,
  MarketingStats,
  MARKETING_AGENT_SLUG,
} from '@/types/marketing';
import {
  getStats,
  listCampaigns,
  listCalendars,
  listContent,
  listPendingApproval,
} from '@/services/agents/marketingContentAgent';
import ContentGeneratorPanel from './ContentGeneratorPanel';
import ApprovalQueue from './ApprovalQueue';
import ContentLibrary from './ContentLibrary';
import CampaignsPanel from './CampaignsPanel';
import ContentCalendarView from './ContentCalendarView';
import MarketingInsights from './MarketingInsights';

interface Data {
  stats: MarketingStats;
  pending: MarketingContent[];
  content: MarketingContent[];
  campaigns: MarketingCampaign[];
  calendars: ContentCalendar[];
  health: AgentHealth | null;
}

const EMPTY_STATS: MarketingStats = {
  totalGenerated: 0,
  queued: 0,
  pendingApproval: 0,
  approved: 0,
  published: 0,
  campaigns: 0,
  topThemes: [],
  byPlatform: [],
};

const MarketingAgentDashboard = () => {
  const { toast } = useToast();
  const [data, setData] = useState<Data>({
    stats: EMPTY_STATS,
    pending: [],
    content: [],
    campaigns: [],
    calendars: [],
    health: null,
  });
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [stats, pending, content, campaigns, calendars, health] = await Promise.all([
        getStats(),
        listPendingApproval(),
        listContent({ limit: 300 }),
        listCampaigns(),
        listCalendars(),
        aos.health.getAgentHealth(MARKETING_AGENT_SLUG),
      ]);
      setData({ stats, pending, content, campaigns, calendars, health });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Run the agent through the AOS orchestrator (processes its queued tasks).
  const handleRunAgent = useCallback(async () => {
    setRunning(true);
    try {
      const outcome = await aos.orchestrator.runAgent(MARKETING_AGENT_SLUG, 'manual');
      toast({
        title: outcome.ok ? 'Marketing agent ran' : 'Run failed',
        description: outcome.ok
          ? `Processed queued tasks in ${outcome.durationMs}ms.`
          : outcome.error ?? 'Unknown error',
        variant: outcome.ok ? 'default' : 'destructive',
      });
    } finally {
      setRunning(false);
      refresh();
    }
  }, [toast, refresh]);

  const s = data.stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" />
            Marketing Content Agent
          </h1>
          <p className="text-sm text-muted-foreground">
            Your AI marketing department · everything routes through the approval queue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleRunAgent} disabled={running}>
            <Play className={`w-4 h-4 mr-2 ${running ? 'animate-pulse' : ''}`} />
            {running ? 'Running…' : 'Run Agent (process tasks)'}
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Tile icon={Sparkles} label="Generated" value={s.totalGenerated} />
        <Tile icon={FileText} label="Queued" value={s.queued} accent="text-blue-600" />
        <Tile icon={CheckSquare} label="Pending Approval" value={s.pendingApproval} accent="text-amber-600" />
        <Tile icon={CheckSquare} label="Approved" value={s.approved} accent="text-green-600" />
        <Tile icon={Megaphone} label="Campaigns" value={s.campaigns} accent="text-purple-600" />
        <Tile
          icon={PenTool}
          label="Top theme"
          value={s.topThemes[0]?.theme ?? '—'}
          accent="text-indigo-600"
          small
        />
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="generate"><Sparkles className="w-3.5 h-3.5 mr-1" />Generate</TabsTrigger>
          <TabsTrigger value="approvals">
            <CheckSquare className="w-3.5 h-3.5 mr-1" />Approvals
            {s.pendingApproval > 0 && (
              <span className="ml-1 text-[10px] bg-amber-500 text-white rounded-full px-1.5">
                {s.pendingApproval}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="library"><Library className="w-3.5 h-3.5 mr-1" />Library</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarDays className="w-3.5 h-3.5 mr-1" />Calendar</TabsTrigger>
          <TabsTrigger value="insights"><Megaphone className="w-3.5 h-3.5 mr-1" />Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ContentGeneratorPanel onGenerated={refresh} />
            <ApprovalQueue items={data.pending} onChange={refresh} />
          </div>
        </TabsContent>
        <TabsContent value="approvals">
          <ApprovalQueue items={data.pending} onChange={refresh} />
        </TabsContent>
        <TabsContent value="library">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ContentLibrary content={data.content} />
            </div>
            <CampaignsPanel campaigns={data.campaigns} />
          </div>
        </TabsContent>
        <TabsContent value="calendar">
          <ContentCalendarView calendars={data.calendars} />
        </TabsContent>
        <TabsContent value="insights">
          <MarketingInsights stats={data.stats} health={data.health} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Tile = ({
  icon: Icon,
  label,
  value,
  accent = 'text-primary',
  small = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: string;
  small?: boolean;
}) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
        <Icon className={`w-4 h-4 ${accent}`} />
      </div>
      <div className="min-w-0">
        <p className={`font-bold ${small ? 'text-sm truncate' : 'text-xl'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

export default MarketingAgentDashboard;
