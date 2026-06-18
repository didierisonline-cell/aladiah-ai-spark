import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { runAgent } from '@/services/aos';
import { analyzePortfolioBalance, type PortfolioHealth, type RawAssetForAnalytics } from '@/services/agents/growth/engines';

const db = supabase as unknown as { from: (t: string) => any };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

function useCampaigns() {
  return useQuery({
    queryKey: ['cgo_campaigns'],
    queryFn: async () => {
      const { data } = await db.from('cgo_growth_campaigns').select('*').order('created_at', { ascending: false }).limit(10);
      return data ?? [];
    },
  });
}

function useAssets(status?: string) {
  return useQuery({
    queryKey: ['cgo_assets', status],
    queryFn: async () => {
      let q = db.from('cgo_growth_assets').select('*').order('created_at', { ascending: false }).limit(50);
      if (status) q = q.eq('status', status);
      const { data } = await q;
      return data ?? [];
    },
  });
}

function useHookBank() {
  return useQuery({
    queryKey: ['cgo_hook_bank'],
    queryFn: async () => {
      const { data } = await db.from('cgo_hook_bank').select('*').order('shareability', { ascending: false }).limit(25);
      return data ?? [];
    },
  });
}

function useDailyBrief() {
  return useQuery({
    queryKey: ['cgo_brief_latest'],
    queryFn: async () => {
      const { data } = await db.from('cgo_growth_briefs').select('*').order('date', { ascending: false }).limit(1).maybeSingle();
      return data ?? null;
    },
  });
}

function useAllAssetsForPortfolio() {
  return useQuery({
    queryKey: ['cgo_portfolio_all'],
    queryFn: async () => {
      const { data } = await db.from('cgo_growth_assets')
        .select('flywheel_stage, status, score')
        .limit(500);
      return (data ?? []) as RawAssetForAnalytics[];
    },
  });
}

// High-impact approval queue: pending assets with score ≥ 80 or in key funnel stages
function useHighImpactQueue() {
  return useQuery({
    queryKey: ['cgo_high_impact_queue'],
    queryFn: async () => {
      const { data } = await db.from('cgo_growth_assets')
        .select('*')
        .eq('status', 'pending_approval')
        .order('score', { ascending: false })
        .limit(20);
      return (data ?? []).filter((a: any) =>
        (a.score ?? 0) >= 80 ||
        ['employment', 'success_stories', 'authority'].includes(a.flywheel_stage)
      );
    },
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending_approval: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    scheduled: 'bg-blue-100 text-blue-800',
    published: 'bg-purple-100 text-purple-800',
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? 'bg-muted text-muted-foreground'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function BriefPanel() {
  const { data: brief, isLoading } = useDailyBrief();
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading brief…</p>;
  if (!brief) return <p className="text-sm text-muted-foreground">No brief yet — run the CGO agent to generate today's brief.</p>;

  const statusColor = brief.overall_status === 'green' ? 'text-green-600' : brief.overall_status === 'yellow' ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className={`text-lg font-bold uppercase ${statusColor}`}>{brief.overall_status}</span>
        <span className="text-sm text-muted-foreground">{brief.date} — {brief.launch_day_relative}</span>
        <span className="text-sm font-medium">{brief.created_count} assets created</span>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Today's Priorities</h4>
        <ul className="space-y-1">
          {(brief.top_priorities ?? []).map((p: string, i: number) => (
            <li key={i} className="text-sm flex gap-2"><span className="text-muted-foreground">{i + 1}.</span>{p}</li>
          ))}
        </ul>
      </div>
      {(brief.approval_queue ?? []).length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Needs Your Approval</h4>
          <ul className="space-y-1">
            {brief.approval_queue.map((a: string, i: number) => (
              <li key={i} className="text-sm text-yellow-700 bg-yellow-50 rounded px-2 py-1">{a}</li>
            ))}
          </ul>
        </div>
      )}
      {(brief.risks ?? []).length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Risks</h4>
          <ul className="space-y-1">
            {brief.risks.map((r: string, i: number) => (
              <li key={i} className="text-sm text-red-700 bg-red-50 rounded px-2 py-1">{r}</li>
            ))}
          </ul>
        </div>
      )}
      {brief.recommendation && (
        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Recommendation</h4>
          <p className="text-sm">{brief.recommendation}</p>
        </div>
      )}
    </div>
  );
}

function AssetTable({ status }: { status?: string }) {
  const { data: assets = [], isLoading, refetch } = useAssets(status);

  const approve = async (id: string) => {
    await db.from('cgo_growth_assets').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', id);
    refetch();
  };
  const reject = async (id: string) => {
    await db.from('cgo_growth_assets').update({ status: 'rejected' }).eq('id', id);
    refetch();
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading assets…</p>;
  if (!assets.length) return <p className="text-sm text-muted-foreground">No assets found.</p>;

  return (
    <div className="space-y-3">
      {assets.map((a: any) => (
        <div key={a.id} className="border rounded-lg p-4 space-y-2">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="space-y-0.5">
              <p className="font-medium text-sm">{a.title}</p>
              <div className="flex flex-wrap gap-1.5 items-center">
                <StatusBadge status={a.status} />
                <StatusBadge status={a.risk_tier} />
                <span className="text-xs text-muted-foreground">{a.channel} · {a.flywheel_stage} · score {a.score}</span>
              </div>
            </div>
            {a.status === 'pending_approval' && (
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="default" onClick={() => approve(a.id)}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => reject(a.id)}>Reject</Button>
              </div>
            )}
          </div>
          {a.hook && <p className="text-xs text-muted-foreground italic">"{a.hook}"</p>}
          {/* V4 Content Intelligence — 17 gates */}
          {(a.kane_score != null || a.metadata?.excellence) && (
            <div className="space-y-1.5 mt-1">
              {/* Flywheel journey position */}
              {a.metadata?.flywheel_journey_goal && (
                <p className="text-xs text-muted-foreground italic">
                  Stage {a.metadata.flywheel_stage_number}: {a.metadata.flywheel_journey_goal}
                  {a.metadata.flywheel_next_stage && ` → next: ${String(a.metadata.flywheel_next_stage).replace(/_/g, ' ')}`}
                </p>
              )}
              {/* Mandatory 6-pillar check */}
              {a.metadata?.mandatory_check && (
                <div className="flex flex-wrap gap-1 text-xs">
                  <span className="text-muted-foreground font-semibold mr-1">Required:</span>
                  {[
                    { label: 'Attention',   pass: a.metadata.mandatory_check.attention },
                    { label: 'Trust',       pass: a.metadata.mandatory_check.trust },
                    { label: 'Transform',   pass: a.metadata.mandatory_check.transformation },
                    { label: 'Proof',       pass: a.metadata.mandatory_check.proof },
                    { label: 'Employment',  pass: a.metadata.mandatory_check.employment },
                    { label: 'Flywheel',    pass: a.metadata.mandatory_check.flywheel_assigned },
                  ].map(({ label, pass }) => (
                    <span key={label} className={`px-1.5 py-0.5 rounded font-mono ${pass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {pass ? '✓' : '✗'} {label}
                    </span>
                  ))}
                </div>
              )}
              {/* All 17 gate scores in two rows */}
              <div className="flex flex-wrap gap-1 text-xs">
                {[
                  { label: 'Kane',          val: a.kane_score },
                  { label: 'Hormozi',       val: a.hormozi_score },
                  { label: 'Trust',         val: a.trust_score },
                  { label: 'Transform',     val: a.transformation_score },
                  { label: 'Employment',    val: a.employment_score },
                  { label: 'Proof',         val: a.metadata?.proof_score },
                  { label: 'Authority',     val: a.metadata?.authority_score },
                  { label: 'Credibility',   val: a.metadata?.credibility_score },
                  { label: 'Action',        val: a.metadata?.actionability_score },
                  { label: 'Retention',     val: a.metadata?.retention_score },
                  { label: 'Conversion',    val: a.metadata?.conversion_score },
                  { label: 'Employer Dmnd', val: a.metadata?.employer_demand_score },
                  { label: 'Africa/DR',     val: a.metadata?.africa_opportunity_score },
                  { label: 'Golden Rule',   val: a.metadata?.golden_rule_score },
                  { label: 'Tanner',        val: a.metadata?.tanner_score },
                  { label: 'Emotion',       val: a.metadata?.emotional_trigger_score },
                ].filter(({ val }) => val != null).map(({ label, val }) => (
                  <span key={label} className={`px-1.5 py-0.5 rounded font-mono ${
                    (val ?? 0) >= 70 ? 'bg-green-50 text-green-700' :
                    (val ?? 0) >= 50 ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {label} {val}
                  </span>
                ))}
              </div>
            </div>
          )}
          {a.cta && <p className="text-xs font-medium text-primary">{a.cta}</p>}
        </div>
      ))}
    </div>
  );
}

function HookBankPanel() {
  const { data: hooks = [], isLoading } = useHookBank();
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading hook bank…</p>;
  if (!hooks.length) return <p className="text-sm text-muted-foreground">Hook bank empty — run the CGO agent to generate 100 hooks.</p>;

  return (
    <div className="space-y-2">
      {hooks.map((h: any) => (
        <div key={h.id} className="border rounded p-3 space-y-1">
          <p className="text-sm font-medium">"{h.hook}"</p>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="capitalize">{h.bucket?.replace(/_/g, ' ')}</span>
            <span>·</span>
            <span>{h.channel}</span>
            <span>·</span>
            <span>shareability {h.shareability}/10</span>
            <span>·</span>
            <span>trust {h.trust}/10</span>
            {h.scale_signal !== null && (
              <Badge variant={h.scale_signal ? 'default' : 'destructive'} className="text-xs">
                {h.scale_signal ? 'SCALE' : 'KILL'}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CampaignsPanel() {
  const { data: campaigns = [], isLoading } = useCampaigns();
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading campaigns…</p>;
  if (!campaigns.length) return <p className="text-sm text-muted-foreground">No campaigns yet — run the CGO agent to build the June 19 launch campaign.</p>;

  return (
    <div className="space-y-3">
      {campaigns.map((c: any) => (
        <div key={c.id} className="border rounded-lg p-4 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm">{c.name}</p>
            <StatusBadge status={c.status} />
          </div>
          {c.objective && <p className="text-xs text-muted-foreground">{c.objective}</p>}
          {c.launch_date && <p className="text-xs">Launch date: {c.launch_date}</p>}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Portfolio Health Panel
// ---------------------------------------------------------------------------

const HEALTH_COLOR: Record<string, string> = {
  Excellent: 'text-green-600',
  Good:      'text-green-500',
  Fair:      'text-yellow-600',
  'At Risk': 'text-orange-600',
  Critical:  'text-red-600',
};

const URGENCY_COLOR: Record<string, string> = {
  critical: 'bg-red-50 border-red-200 text-red-800',
  high:     'bg-orange-50 border-orange-200 text-orange-800',
  medium:   'bg-yellow-50 border-yellow-200 text-yellow-800',
};

function StageBar({ sh }: { sh: ReturnType<typeof analyzePortfolioBalance>['stages'][number] }) {
  const barColor =
    sh.status === 'empty' ? 'bg-red-200' :
    sh.status === 'under' ? 'bg-yellow-400' :
    sh.status === 'over'  ? 'bg-blue-400' :
                            'bg-green-400';
  const idealLeft = `${sh.ideal_pct}%`;

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium w-32 shrink-0">{sh.label}</span>
        <div className="flex-1 mx-2 relative h-4 bg-muted rounded overflow-hidden">
          <div className={`h-full ${barColor} transition-all`} style={{ width: `${Math.min(sh.pct, 100)}%` }} />
          {/* Ideal marker */}
          <div className="absolute top-0 h-full w-0.5 bg-gray-500 opacity-40" style={{ left: idealLeft }} />
        </div>
        <span className={`w-20 text-right tabular-nums ${
          sh.status === 'empty' ? 'text-red-600 font-bold' :
          sh.status === 'under' ? 'text-yellow-700' :
          sh.status === 'over'  ? 'text-blue-700' :
          'text-green-700'
        }`}>
          {sh.count} ({sh.pct}%)
        </span>
        <span className="w-14 text-right text-muted-foreground tabular-nums text-xs">
          {sh.avg_score > 0 ? `avg ${sh.avg_score}` : '—'}
        </span>
      </div>
    </div>
  );
}

function PortfolioHealthPanel() {
  const { data: allAssets = [], isLoading, refetch } = useAllAssetsForPortfolio();
  const { data: hiq = [], isLoading: hiqLoading, refetch: hiqRefetch } = useHighImpactQueue();
  const hiRefetch = () => { refetch(); hiqRefetch(); };

  if (isLoading) return <p className="text-sm text-muted-foreground">Analyzing portfolio…</p>;
  if (!allAssets.length) return <p className="text-sm text-muted-foreground">No assets yet — run the CGO agent to generate your first content portfolio.</p>;

  const health: PortfolioHealth = analyzePortfolioBalance(allAssets);

  const approve = async (id: string) => {
    await (db as any).from('cgo_growth_assets').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', id);
    hiRefetch();
  };
  const reject = async (id: string) => {
    await (db as any).from('cgo_growth_assets').update({ status: 'rejected' }).eq('id', id);
    hiRefetch();
  };

  return (
    <div className="space-y-6">

      {/* Header scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border rounded-lg p-3 text-center">
          <p className={`text-2xl font-bold ${HEALTH_COLOR[health.health_label]}`}>{health.health_score}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Portfolio Health Score</p>
          <p className={`text-xs font-semibold mt-0.5 ${HEALTH_COLOR[health.health_label]}`}>{health.health_label}</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{health.approved_assets}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Approved Assets</p>
          <p className="text-xs text-muted-foreground">{health.total_assets} total</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{health.avg_content_score > 0 ? health.avg_content_score : '—'}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Avg Content Score</p>
          <p className="text-xs text-muted-foreground">approved content</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <p className={`text-2xl font-bold ${health.missing.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {7 - health.missing.length}/7
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Funnel Stages Covered</p>
          {health.missing.length > 0 && (
            <p className="text-xs text-red-600">{health.missing.length} empty</p>
          )}
        </div>
      </div>

      {/* Conversion risk */}
      <div className={`rounded-lg border px-4 py-3 text-sm ${
        health.funnel_conversion_risk.startsWith('Critical') ? 'bg-red-50 border-red-200 text-red-800' :
        health.funnel_conversion_risk.startsWith('High')    ? 'bg-orange-50 border-orange-200 text-orange-800' :
        health.funnel_conversion_risk.startsWith('Medium')  ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
        'bg-green-50 border-green-200 text-green-800'
      }`}>
        <strong>Funnel Conversion Risk:</strong> {health.funnel_conversion_risk}
      </div>

      {/* Stage distribution */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Flywheel Stage Distribution <span className="text-xs font-normal text-muted-foreground">(gray marker = target)</span></h4>
        <div className="space-y-2">
          {health.stages.map(sh => <StageBar key={sh.stage} sh={sh} />)}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-400 mr-1" />Healthy</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-yellow-400 mr-1" />Under</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-400 mr-1" />Over</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-200 mr-1" />Empty</span>
        </div>
      </div>

      {/* Recommended next content */}
      {health.recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Recommended Next Content Pieces</h4>
          <div className="space-y-2">
            {health.recommendations.map((r, i) => (
              <div key={i} className={`rounded-lg border p-3 space-y-1 ${URGENCY_COLOR[r.urgency]}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase">{r.urgency}</span>
                  <span className="text-xs font-semibold">{r.stage.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-xs">{r.reason}</p>
                <p className="text-xs font-medium">Formats: {r.suggested_formats.join(' · ')}</p>
                <p className="text-xs text-muted-foreground">Hook bucket: {r.suggested_hook_bucket.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High-impact approval queue */}
      <div>
        <h4 className="text-sm font-semibold mb-2">
          High-Impact Approval Queue
          <span className="ml-2 text-xs font-normal text-muted-foreground">score ≥ 80 or Employment / Success Stories / Authority</span>
        </h4>
        {hiqLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !hiq.length ? (
          <p className="text-sm text-muted-foreground">No high-impact items pending approval.</p>
        ) : (
          <div className="space-y-3">
            {hiq.map((a: any) => (
              <div key={a.id} className="border rounded-lg p-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">{a.title}</p>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <StatusBadge status={a.flywheel_stage} />
                      <StatusBadge status={a.channel} />
                      <span className="text-xs font-mono text-muted-foreground">score {a.score ?? '—'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="default" onClick={() => approve(a.id)}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => reject(a.id)}>Reject</Button>
                  </div>
                </div>
                {a.hook && <p className="text-xs text-muted-foreground italic">"{a.hook}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Main dashboard
// ---------------------------------------------------------------------------

const CGODashboard = () => {
  const [running, setRunning] = useState(false);
  const { data: pending = [] } = useAssets('pending_approval');

  const runAgent = async () => {
    setRunning(true);
    try {
      await runAgent('chief-growth-officer');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Chief Growth Officer</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI growth operating system — {pending.length} asset{pending.length !== 1 ? 's' : ''} awaiting your approval
          </p>
        </div>
        <Button onClick={runAgent} disabled={running}>
          {running ? 'Running…' : 'Run CGO Agent'}
        </Button>
      </div>

      {/* Approval alert */}
      {pending.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          <strong>{pending.length} assets</strong> are pending your approval. Nothing publishes automatically — review below.
        </div>
      )}

      <Tabs defaultValue="portfolio">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="portfolio">Portfolio Health</TabsTrigger>
          <TabsTrigger value="brief">Daily Brief</TabsTrigger>
          <TabsTrigger value="pending">All Pending {pending.length > 0 && `(${pending.length})`}</TabsTrigger>
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="hooks">Hook Bank</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Portfolio Health</CardTitle>
              <p className="text-xs text-muted-foreground">
                View → Lead → Student → Graduate → Employed → Success Story → Ambassador
              </p>
            </CardHeader>
            <CardContent><PortfolioHealthPanel /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brief">
          <Card>
            <CardHeader><CardTitle className="text-base">Today's Growth Brief</CardTitle></CardHeader>
            <CardContent><BriefPanel /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader><CardTitle className="text-base">All Pending Approval</CardTitle></CardHeader>
            <CardContent><AssetTable status="pending_approval" /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader><CardTitle className="text-base">All Assets</CardTitle></CardHeader>
            <CardContent><AssetTable /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hooks">
          <Card>
            <CardHeader><CardTitle className="text-base">Hook Bank (top 25 by shareability)</CardTitle></CardHeader>
            <CardContent><HookBankPanel /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader><CardTitle className="text-base">Campaigns</CardTitle></CardHeader>
            <CardContent><CampaignsPanel /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CGODashboard;
