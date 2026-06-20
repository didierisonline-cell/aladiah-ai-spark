import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard, AlertTriangle, MinusCircle, CheckCircle2 } from 'lucide-react';

// =============================================================================
// /founder/revenue — Revenue Truth (CEO Command Cell), COUNTS-FIRST.
// =============================================================================
// subscriptions is owner-only RLS, so aggregates come from an admin-only,
// PII-free RPC (founder_revenue_stats). Counts only — dollar revenue / MRR /
// churn / failed-payments / Stripe reconciliation are honestly NOT MEASURED
// because amount/currency and an event log aren't stored yet (future Revenue
// Data Model PR). No invented numbers; "not installed" until the RPC is applied.
// =============================================================================

interface Stats {
  total_subscriptions?: number;
  active?: number;
  by_status?: { status: string; n: number }[];
  by_tier_active?: { tier: string; n: number }[];
}

export default function RevenueTruth() {
  const [s, setS] = useState<{ loading: boolean; installed: boolean; err: string | null; data: Stats | null }>(
    { loading: true, installed: false, err: null, data: null });

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.rpc('founder_revenue_stats' as any);
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
  const notMeasured = [
    { label: 'Dollar revenue / MRR', why: 'subscriptions stores no amount/currency — needs the Revenue Data Model PR.' },
    { label: 'Churn trends over time', why: 'no append-only payment event log — status is overwritten, not historized.' },
    { label: 'Failed-payment count', why: 'not derivable unless a "past_due"/"unpaid" status is present and meaningful.' },
    { label: 'Stripe reconciliation', why: 'no DB↔Stripe cross-check — needs a server-side Stripe API read.' },
  ];

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Revenue Truth</h1>
          <p className="text-sm text-muted-foreground">CEO Command Cell — subscription counts, live via an admin-only aggregate RPC. Counts only; no invented dollars.</p>
        </div>
      </div>

      {s.loading && <div className="text-muted-foreground text-sm">Reading live subscription aggregates…</div>}

      {!s.loading && !s.installed && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Revenue RPC not installed</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p><code>subscriptions</code> is owner-only RLS, so the founder client can't read aggregates directly. This reads them through an admin-only, PII-free function.</p>
            <p>Apply <code>supabase/migrations/20260619070000_founder_revenue_stats.sql</code> by hand in Supabase, then reload. Until then this is honestly <strong>not measured</strong>.</p>
            {s.err && <p className="text-xs">Probe said: {s.err}</p>}
          </CardContent>
        </Card>
      )}

      {!s.loading && s.installed && d && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><CreditCard className="w-4 h-4" /> Subscriptions (live counts)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-6 flex-wrap">
                <div>
                  <div className="text-4xl font-bold text-foreground">{d.active ?? 0}</div>
                  <div className="text-xs text-muted-foreground">active subscriptions</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {d.total_subscriptions ?? 0} total subscription rows.
                  {(d.active ?? 0) === 0 && ' No active paying subscriptions yet — a real 0, expected pre-launch.'}
                  <div className="text-xs mt-1">Free users aren't in <code>subscriptions</code>, so a free-vs-paying split is <strong>not measurable</strong> from this table alone.</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">By status</div>
                  {(d.by_status || []).length === 0 ? <div className="text-xs text-muted-foreground">—</div> :
                    (d.by_status || []).map((r) => (
                      <div key={r.status} className="flex justify-between text-sm py-0.5 border-b border-border/40"><span className="text-foreground">{r.status}</span><span className="font-semibold">{r.n}</span></div>
                    ))}
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Active by tier</div>
                  {(d.by_tier_active || []).length === 0 ? <div className="text-xs text-muted-foreground">—</div> :
                    (d.by_tier_active || []).map((r) => (
                      <div key={r.tier} className="flex justify-between text-sm py-0.5 border-b border-border/40"><span className="text-foreground">{r.tier}</span><span className="font-semibold">{r.n}</span></div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MinusCircle className="w-4 h-4" /> Not measured (needs the Revenue Data Model PR)</CardTitle></CardHeader>
            <CardContent className="pt-0">
              {notMeasured.map((r) => (
                <div key={r.label} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                  <MinusCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1"><div className="text-sm font-medium text-foreground">{r.label}</div><div className="text-xs text-muted-foreground">{r.why}</div></div>
                  <div className="text-xs font-semibold text-muted-foreground">NOT MEASURED</div>
                </div>
              ))}
              <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Counts above are real. Dollar figures are intentionally absent — a future PR adds amount/currency + an event log + Stripe reconciliation.</div>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            Behavior: <Link to="/founder/journey" className="text-primary underline">Student Journey</Link> · Outcomes: <Link to="/founder/outcomes" className="text-primary underline">Employment</Link> · Readiness: <Link to="/founder/launch" className="text-primary underline">Launch</Link>.
          </div>
        </div>
      )}
    </FounderShell>
  );
}
