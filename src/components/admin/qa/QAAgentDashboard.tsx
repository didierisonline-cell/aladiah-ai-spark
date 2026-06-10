import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Award,
  CheckCircle2,
  Gauge,
  Inbox,
  Play,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import { MarketIntelligence, QAReview, QAStats, QA_AGENT_SLUG } from '@/types/qa';
import { getStats, listMarketIntelligence, listReviews } from '@/services/agents/qaAgent';
import ReviewsFeed from './ReviewsFeed';
import QAFrameworkPanel from './QAFrameworkPanel';
import MarketIntelligencePanel from './MarketIntelligencePanel';
import AgentHealthPanel from '@/components/admin/aos/AgentHealthPanel';

const EMPTY: QAStats = { reviewed: 0, passed: 0, conditional: 0, failed: 0, awaitingReview: 0, avgScore: 0, byVerdict: [] };

const QAAgentDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<QAStats>(EMPTY);
  const [reviews, setReviews] = useState<QAReview[]>([]);
  const [market, setMarket] = useState<MarketIntelligence[]>([]);
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [st, rv, mk, h] = await Promise.all([
        getStats(),
        listReviews(200),
        listMarketIntelligence(),
        aos.health.getAgentHealth(QA_AGENT_SLUG),
      ]);
      setStats(st); setReviews(rv); setMarket(mk); setHealth(h);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const runReview = useCallback(async () => {
    setRunning(true);
    try {
      const o = await aos.orchestrator.runAgent(QA_AGENT_SLUG, 'manual');
      const out = o.output as any;
      toast({
        title: o.ok ? 'QA review complete' : 'QA run failed',
        description: o.ok
          ? `Reviewed ${out?.reviewed ?? 0} · ${out?.passed ?? 0} cleared to Founder Approval Queue · ${out?.rejected ?? 0} rejected.`
          : o.error ?? 'Unknown error',
        variant: o.ok ? 'default' : 'destructive',
      });
    } finally {
      setRunning(false);
      refresh();
    }
  }, [toast, refresh]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            World-Class QA Agent
          </h1>
          <p className="text-sm text-muted-foreground">
            Academic Quality &amp; Employability Authority · final gate before founder review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={runReview} disabled={running}>
            <Play className={`w-4 h-4 mr-2 ${running ? 'animate-pulse' : ''}`} />
            {running ? 'Reviewing…' : 'Run QA Review'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Tile icon={Inbox} label="Awaiting Review" value={stats.awaitingReview} accent={stats.awaitingReview > 0 ? 'text-amber-600' : 'text-green-600'} />
        <Tile icon={Gauge} label="Reviewed" value={stats.reviewed} />
        <Tile icon={CheckCircle2} label="Passed" value={stats.passed} accent="text-green-600" />
        <Tile icon={ShieldCheck} label="Conditional" value={stats.conditional} accent="text-amber-600" />
        <Tile icon={XCircle} label="Rejected" value={stats.failed} accent="text-red-600" />
        <Tile icon={Award} label="Avg Score" value={stats.avgScore} accent={stats.avgScore >= 80 ? 'text-green-600' : 'text-amber-600'} />
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="reviews"><Gauge className="w-3.5 h-3.5 mr-1" />Reviews</TabsTrigger>
          <TabsTrigger value="framework"><ShieldCheck className="w-3.5 h-3.5 mr-1" />Framework</TabsTrigger>
          <TabsTrigger value="market"><TrendingUp className="w-3.5 h-3.5 mr-1" />Market</TabsTrigger>
          <TabsTrigger value="health"><Award className="w-3.5 h-3.5 mr-1" />Health</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews"><ReviewsFeed reviews={reviews} /></TabsContent>
        <TabsContent value="framework"><QAFrameworkPanel /></TabsContent>
        <TabsContent value="market"><MarketIntelligencePanel market={market} /></TabsContent>
        <TabsContent value="health"><AgentHealthPanel health={health ? [health] : []} /></TabsContent>
      </Tabs>
    </div>
  );
};

const Tile = ({ icon: Icon, label, value, accent = 'text-primary' }: { icon: React.ElementType; label: string; value: number; accent?: string }) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
        <Icon className={`w-4 h-4 ${accent}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

export default QAAgentDashboard;
