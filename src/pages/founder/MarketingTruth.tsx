import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, FileText, MessageSquare, Activity, AlertTriangle, MinusCircle, CheckCircle2 } from 'lucide-react';

// =============================================================================
// /founder/marketing — Marketing Truth (CEO Command Cell), COUNTS-FIRST.
// =============================================================================
// DB-backed CONTENT + ENGAGEMENT only, via an admin-only PII-free RPC. The actual
// marketing engine — traffic, acquisition source, UTM, campaigns, SEO, social,
// ad spend, attribution — is NOT captured in the DB (no web-analytics integration),
// so it is honestly NOT MEASURED. That gap is the headline, not a number to fake.
// =============================================================================

interface Stats {
  blogs_total?: number;
  blogs_published?: number;
  community_posts?: number;
  blog_engagement_total?: number;
  blog_engagement_by_type?: { type: string; n: number }[];
  inapp_events_total?: number;
  inapp_events_by_type?: { type: string; n: number }[];
}

export default function MarketingTruth() {
  const [s, setS] = useState<{ loading: boolean; installed: boolean; err: string | null; data: Stats | null }>(
    { loading: true, installed: false, err: null, data: null });

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.rpc('founder_marketing_stats' as any);
        if (error) {
          const notInstalled = /function|does not exist|not find|schema cache/i.test(error.message || '');
          setS({ loading: false, installed: !notInstalled, err: error.message, data: null });
          return;
        }
        setS({ loading: false, installed: true, err: null, data: (data as any) || null });
      } catch (e: any) {
        setS({ loading: false, installed: false, err: e?.message || 'rpc failed', data: null });
      }
    })();
  }, []);

  const d = s.data;
  const cards = d ? [
    { label: 'Blogs published', icon: FileText, v: `${d.blogs_published ?? 0}/${d.blogs_total ?? 0}` },
    { label: 'Community posts', icon: MessageSquare, v: d.community_posts ?? 0 },
    { label: 'Blog engagement events', icon: Activity, v: d.blog_engagement_total ?? 0 },
    { label: 'In-app events', icon: Activity, v: d.inapp_events_total ?? 0 },
  ] : [];

  const notMeasured = [
    'Web traffic / sessions / page views', 'Acquisition source', 'UTM attribution', 'Campaigns',
    'SEO rankings / impressions', 'Social reach', 'Ad spend', 'CAC', 'ROAS',
    'Channel attribution', 'Traffic → signup conversion',
  ];

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Megaphone className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing Truth</h1>
          <p className="text-sm text-muted-foreground">CEO Command Cell — DB-backed content/engagement counts. Acquisition/traffic is not captured anywhere yet.</p>
        </div>
      </div>

      {s.loading && <div className="text-muted-foreground text-sm">Reading live content/engagement aggregates…</div>}

      {!s.loading && !s.installed && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Marketing RPC not installed</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Engagement tables are owner/admin-scoped, so this reads aggregates through an admin-only, PII-free function.</p>
            <p>Apply <code>supabase/migrations/20260619090000_founder_marketing_stats.sql</code> by hand in Supabase, then reload. Until then this is honestly <strong>not measured</strong>.</p>
            {s.err && <p className="text-xs">Probe said: {s.err}</p>}
          </CardContent>
        </Card>
      )}

      {!s.loading && s.installed && d && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Content &amp; engagement (live counts)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cards.map((c) => (
                  <div key={c.label} className="rounded-lg border border-border/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><c.icon className="w-3.5 h-3.5" /> {c.label}</div>
                    <div className="text-2xl font-bold text-foreground">{c.v}</div>
                  </div>
                ))}
              </div>
              {(d.blog_engagement_by_type || []).length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Blog engagement by type</div>
                  {(d.blog_engagement_by_type || []).map((r) => (
                    <div key={r.type} className="flex justify-between text-sm py-0.5 border-b border-border/40"><span className="text-foreground">{r.type}</span><span className="font-semibold">{r.n}</span></div>
                  ))}
                </div>
              )}
              {(d.inapp_events_total ?? 0) === 0 && <div className="text-xs text-muted-foreground mt-3">No content engagement yet — real zeros, expected pre-launch.</div>}
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MinusCircle className="w-4 h-4" /> Acquisition / growth — NOT MEASURED (no analytics integration)</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="grid sm:grid-cols-2 gap-x-6">
                {notMeasured.map((r) => (
                  <div key={r} className="flex items-center justify-between py-1.5 border-b border-border/40"><span className="text-sm text-foreground">{r}</span><span className="text-xs font-semibold text-muted-foreground">NOT MEASURED</span></div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> No web-analytics or source attribution exists — you can't yet tell where users come from. This is Aladiah's biggest growth blind spot (separate Analytics &amp; Attribution PR).</div>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            Admissions: <Link to="/founder/admissions" className="text-primary underline">Admissions Truth</Link> · Revenue: <Link to="/founder/revenue" className="text-primary underline">Revenue Truth</Link> · Readiness: <Link to="/founder/launch" className="text-primary underline">Launch</Link>.
          </div>
        </div>
      )}
    </FounderShell>
  );
}
