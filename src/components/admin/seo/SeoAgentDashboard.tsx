import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileSearch,
  Hash,
  KeyRound,
  Lightbulb,
  Network,
  Play,
  RefreshCw,
  Search,
  Swords,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import {
  SeoAudit,
  SeoCluster,
  SeoCompetitor,
  SeoKeyword,
  SeoRecommendation,
  SeoStats,
  SEO_AGENT_SLUG,
} from '@/types/seo';
import {
  delegateRecommendation,
  getStats,
  listAudits,
  listClusters,
  listCompetitors,
  listKeywords,
  listMarketingRequests,
  listRecommendations,
  requestContentForKeyword,
  runSiteAudit,
  trackCompetitors,
} from '@/services/agents/seoStrategyAgent';
import KeywordTable from './KeywordTable';
import ClusterPanel from './ClusterPanel';
import CompetitorPanel from './CompetitorPanel';
import AuditPanel from './AuditPanel';
import RecommendationsPanel from './RecommendationsPanel';
import AgentHealthPanel from '@/components/admin/aos/AgentHealthPanel';

interface Data {
  stats: SeoStats;
  keywords: SeoKeyword[];
  clusters: SeoCluster[];
  competitors: SeoCompetitor[];
  audits: SeoAudit[];
  recommendations: SeoRecommendation[];
  requests: any[];
  health: AgentHealth | null;
}

const EMPTY_STATS: SeoStats = {
  totalKeywords: 0, opportunities: 0, targeted: 0, clusters: 0,
  competitors: 0, openAudits: 0, recommendations: 0, marketingRequests: 0, topCategories: [],
};

const SeoAgentDashboard = () => {
  const { toast } = useToast();
  const [data, setData] = useState<Data>({
    stats: EMPTY_STATS, keywords: [], clusters: [], competitors: [], audits: [], recommendations: [], requests: [], health: null,
  });
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [requestingKeyword, setRequestingKeyword] = useState<string | null>(null);
  const [delegatingId, setDelegatingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [stats, keywords, clusters, competitors, audits, recommendations, requests, health] = await Promise.all([
        getStats(),
        listKeywords({ limit: 300 }),
        listClusters(),
        listCompetitors(),
        listAudits(),
        listRecommendations(),
        listMarketingRequests(),
        aos.health.getAgentHealth(SEO_AGENT_SLUG),
      ]);
      setData({ stats, keywords, clusters, competitors, audits, recommendations, requests, health });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const runAction = useCallback(
    async (key: string, fn: () => Promise<unknown>, label: string) => {
      setRunning(key);
      try {
        await fn();
        toast({ title: label });
      } catch (e) {
        toast({ title: 'Action failed', description: e instanceof Error ? e.message : 'Unknown', variant: 'destructive' });
      } finally {
        setRunning(null);
        refresh();
      }
    },
    [toast, refresh],
  );

  const runFullCycle = () =>
    runAction(
      'cycle',
      async () => {
        const o = await aos.orchestrator.runAgent(SEO_AGENT_SLUG, 'manual');
        if (!o.ok) throw new Error(o.error);
      },
      'SEO strategy cycle complete',
    );

  const handleRequest = useCallback(
    async (keyword: string) => {
      setRequestingKeyword(keyword);
      try {
        const { taskIds } = await requestContentForKeyword(keyword);
        toast({ title: 'Content requested', description: `${taskIds.length} tasks delegated to the Marketing Agent.` });
      } catch (e) {
        toast({ title: 'Delegation failed', description: e instanceof Error ? e.message : 'Unknown', variant: 'destructive' });
      } finally {
        setRequestingKeyword(null);
        refresh();
      }
    },
    [toast, refresh],
  );

  const handleDelegate = useCallback(
    async (rec: SeoRecommendation) => {
      setDelegatingId(rec.id);
      try {
        await delegateRecommendation(rec);
        toast({ title: 'Recommendation delegated to Marketing Agent' });
      } finally {
        setDelegatingId(null);
        refresh();
      }
    },
    [toast, refresh],
  );

  const s = data.stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" />
            SEO Strategy Agent
          </h1>
          <p className="text-sm text-muted-foreground">
            Owns organic discovery · delegates content to the Marketing Agent
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" disabled={running !== null} onClick={() => runAction('audit', () => runSiteAudit(), 'Site audit complete')}>
            <FileSearch className="w-4 h-4 mr-2" /> Run Audit
          </Button>
          <Button variant="outline" disabled={running !== null} onClick={() => runAction('comp', () => trackCompetitors(), 'Competitors refreshed')}>
            <Swords className="w-4 h-4 mr-2" /> Track Competitors
          </Button>
          <Button disabled={running !== null} onClick={runFullCycle}>
            <Play className={`w-4 h-4 mr-2 ${running === 'cycle' ? 'animate-pulse' : ''}`} />
            {running === 'cycle' ? 'Running…' : 'Run Strategy Cycle'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Tile icon={KeyRound} label="Keywords" value={s.totalKeywords} />
        <Tile icon={Hash} label="Opportunities" value={s.opportunities} accent="text-blue-600" />
        <Tile icon={Network} label="Clusters" value={s.clusters} accent="text-indigo-600" />
        <Tile icon={Swords} label="Competitors" value={s.competitors} accent="text-purple-600" />
        <Tile icon={FileSearch} label="Open Audits" value={s.openAudits} accent={s.openAudits > 0 ? 'text-amber-600' : 'text-green-600'} />
        <Tile icon={Lightbulb} label="Marketing Reqs" value={s.marketingRequests} accent="text-green-600" />
      </div>

      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="keywords"><KeyRound className="w-3.5 h-3.5 mr-1" />Keywords</TabsTrigger>
          <TabsTrigger value="clusters"><Network className="w-3.5 h-3.5 mr-1" />Clusters</TabsTrigger>
          <TabsTrigger value="competitors"><Swords className="w-3.5 h-3.5 mr-1" />Competitors</TabsTrigger>
          <TabsTrigger value="audits"><FileSearch className="w-3.5 h-3.5 mr-1" />Audits</TabsTrigger>
          <TabsTrigger value="recs"><Lightbulb className="w-3.5 h-3.5 mr-1" />Recs</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords">
          <KeywordTable keywords={data.keywords} requestingKeyword={requestingKeyword} onRequest={handleRequest} />
        </TabsContent>
        <TabsContent value="clusters">
          <ClusterPanel clusters={data.clusters} />
        </TabsContent>
        <TabsContent value="competitors">
          <CompetitorPanel competitors={data.competitors} />
        </TabsContent>
        <TabsContent value="audits">
          <AuditPanel audits={data.audits} />
        </TabsContent>
        <TabsContent value="recs">
          <div className="space-y-4">
            <RecommendationsPanel
              recommendations={data.recommendations}
              requests={data.requests}
              delegatingId={delegatingId}
              onDelegate={handleDelegate}
            />
            <AgentHealthPanel health={data.health ? [data.health] : []} />
          </div>
        </TabsContent>
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

export default SeoAgentDashboard;
