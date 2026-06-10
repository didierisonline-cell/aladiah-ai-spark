import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  BookOpen,
  CheckSquare,
  Cpu,
  FlaskConical,
  Library,
  Moon,
  Play,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aos, AgentHealth } from '@/services/aos';
import {
  ProductArtifact,
  ProductGap,
  ProductRecommendation,
  ProductStats,
} from '@/types/product';
import {
  detectGaps,
  getStats,
  listArtifacts,
  listGaps,
  listPendingApproval,
  listRecommendations,
} from '@/services/agents/productBuilderAgent';
import ProductApprovalQueue from './ProductApprovalQueue';
import ArtifactLibrary from './ArtifactLibrary';
import CoverageGapsPanel from './CoverageGapsPanel';
import QualityStandardCard from './QualityStandardCard';
import EnginesPanel from './EnginesPanel';
import OutcomesPanel from './OutcomesPanel';
import AgentHealthPanel from '@/components/admin/aos/AgentHealthPanel';

const PRODUCT_SLUG = 'product-builder';

const EMPTY_STATS: ProductStats = {
  totalArtifacts: 0, pendingApproval: 0, approved: 0, openGaps: 0,
  criticalGaps: 0, recommendations: 0, byType: [], byEngine: [], coverage: [], outcomes: [],
};

const ProductAgentDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<ProductStats>(EMPTY_STATS);
  const [pending, setPending] = useState<ProductArtifact[]>([]);
  const [artifacts, setArtifacts] = useState<ProductArtifact[]>([]);
  const [gaps, setGaps] = useState<ProductGap[]>([]);
  const [recs, setRecs] = useState<ProductRecommendation[]>([]);
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aos.ensure();
      const [st, pa, ar, gp, rc, h] = await Promise.all([
        getStats('scrum'),
        listPendingApproval(),
        listArtifacts({ limit: 300 }),
        listGaps(),
        listRecommendations(),
        aos.health.getAgentHealth(PRODUCT_SLUG),
      ]);
      setStats(st); setPending(pa); setArtifacts(ar); setGaps(gp); setRecs(rc); setHealth(h);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const runOvernight = useCallback(async () => {
    setRunning('overnight');
    try {
      const o = await aos.orchestrator.runAgent(PRODUCT_SLUG, 'manual');
      const out = o.output as any;
      toast({
        title: o.ok ? 'Overnight improvement complete' : 'Run failed',
        description: o.ok
          ? `Generated ${out?.generated ?? 0}, ${out?.passedToApproval ?? 0} queued for approval, ${out?.heldAsDraft ?? 0} held as draft. Nothing published.`
          : o.error ?? 'Unknown error',
        variant: o.ok ? 'default' : 'destructive',
      });
    } finally {
      setRunning(null);
      refresh();
    }
  }, [toast, refresh]);

  const runDetect = useCallback(async () => {
    setRunning('detect');
    try {
      await detectGaps('scrum');
      toast({ title: 'Gap analysis complete' });
    } finally {
      setRunning(null);
      refresh();
    }
  }, [toast, refresh]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Product Builder Agent
          </h1>
          <p className="text-sm text-muted-foreground">
            Career Transformation Factory · 10 engines · optimizes for outcomes, not completion · overnight-capable · never publishes directly
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="outline" disabled={running !== null} onClick={runDetect}>
            <ScanSearch className="w-4 h-4 mr-2" /> Detect Gaps
          </Button>
          <Button disabled={running !== null} onClick={runOvernight}>
            <Moon className={`w-4 h-4 mr-2 ${running === 'overnight' ? 'animate-pulse' : ''}`} />
            {running === 'overnight' ? 'Running…' : 'Run Overnight Improvement'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Tile icon={Library} label="Artifacts" value={stats.totalArtifacts} />
        <Tile icon={CheckSquare} label="Awaiting Approval" value={stats.pendingApproval} accent="text-amber-600" />
        <Tile icon={ShieldCheck} label="Approved" value={stats.approved} accent="text-green-600" />
        <Tile icon={AlertTriangle} label="Open Gaps" value={stats.openGaps} accent={stats.openGaps > 0 ? 'text-orange-600' : 'text-green-600'} />
        <Tile icon={AlertTriangle} label="Critical Gaps" value={stats.criticalGaps} accent={stats.criticalGaps > 0 ? 'text-red-600' : 'text-green-600'} />
        <Tile icon={FlaskConical} label="Recommendations" value={stats.recommendations} accent="text-indigo-600" />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="overview"><BookOpen className="w-3.5 h-3.5 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="approvals">
            <CheckSquare className="w-3.5 h-3.5 mr-1" />Approval Queue
            {stats.pendingApproval > 0 && (
              <span className="ml-1 text-[10px] bg-amber-500 text-white rounded-full px-1.5">{stats.pendingApproval}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="artifacts"><Library className="w-3.5 h-3.5 mr-1" />Artifacts</TabsTrigger>
          <TabsTrigger value="engines"><Cpu className="w-3.5 h-3.5 mr-1" />Engines</TabsTrigger>
          <TabsTrigger value="outcomes"><TrendingUp className="w-3.5 h-3.5 mr-1" />Outcomes</TabsTrigger>
          <TabsTrigger value="gaps"><AlertTriangle className="w-3.5 h-3.5 mr-1" />Gaps & Recs</TabsTrigger>
          <TabsTrigger value="standard"><ShieldCheck className="w-3.5 h-3.5 mr-1" />Standard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OutcomesPanel outcomes={stats.outcomes} />
          <CoverageGapsPanel coverage={stats.coverage} gaps={gaps} recommendations={recs} />
          <AgentHealthPanel health={health ? [health] : []} />
        </TabsContent>
        <TabsContent value="engines">
          <EnginesPanel byEngine={stats.byEngine} />
        </TabsContent>
        <TabsContent value="outcomes">
          <OutcomesPanel outcomes={stats.outcomes} />
        </TabsContent>
        <TabsContent value="approvals">
          <ProductApprovalQueue items={pending} onChange={refresh} />
        </TabsContent>
        <TabsContent value="artifacts">
          <ArtifactLibrary artifacts={artifacts} />
        </TabsContent>
        <TabsContent value="gaps">
          <CoverageGapsPanel coverage={stats.coverage} gaps={gaps} recommendations={recs} />
        </TabsContent>
        <TabsContent value="standard">
          <QualityStandardCard />
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

export default ProductAgentDashboard;
