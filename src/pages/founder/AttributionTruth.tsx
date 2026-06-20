import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route as RouteIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';

// =============================================================================
// /founder/attribution — Attribution Truth (CEO Command Cell).
// =============================================================================
// "Where did every student come from?" — first-party signup attribution, read
// via an admin-only PII-free RPC (founder_attribution_stats). Counts only. Until
// the migration is applied it honestly says "not installed". New signups are
// attributed from this point forward; historical users will read 'unknown'.
// =============================================================================

interface Stats {
  total_attributed?: number;
  referrals?: number;
  unknown?: number;
  by_source?: { source: string; n: number }[];
  by_medium?: { medium: string; n: number }[];
  by_campaign?: { campaign: string; n: number }[];
}

export default function AttributionTruth() {
  const [s, setS] = useState<{ loading: boolean; installed: boolean; err: string | null; data: Stats | null }>(
    { loading: true, installed: false, err: null, data: null });

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.rpc('founder_attribution_stats' as any);
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
  const Bars = ({ rows, label }: { rows: { k: string; n: number }[]; label: string }) => {
    const top = rows.length ? Math.max(...rows.map((r) => r.n), 1) : 1;
    return (
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-2">{label}</div>
        {rows.length === 0 ? <div className="text-xs text-muted-foreground">—</div> : rows.map((r) => (
          <div key={r.k} className="py-1">
            <div className="flex justify-between text-sm"><span className="text-foreground">{r.k}</span><span className="font-semibold">{r.n}</span></div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-0.5"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((r.n / top) * 100)}%` }} /></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><RouteIcon className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attribution Truth</h1>
          <p className="text-sm text-muted-foreground">Where did every student come from? First-party signup attribution — counts only, no PII.</p>
        </div>
      </div>

      {s.loading && <div className="text-muted-foreground text-sm">Reading live attribution aggregates…</div>}

      {!s.loading && !s.installed && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Attribution not installed</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Apply <code>supabase/migrations/20260619100000_signup_attribution.sql</code> by hand in Supabase, then reload. It creates the <code>signup_attribution</code> table, extends the signup trigger, and adds the admin RPC.</p>
            <p>Capture is live in the app from this deploy — new signups arriving with <code>?utm_source=…</code> (or via a referral link) will be recorded going forward.</p>
            {s.err && <p className="text-xs">Probe said: {s.err}</p>}
          </CardContent>
        </Card>
      )}

      {!s.loading && s.installed && d && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Signups attributed (live counts)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-6 flex-wrap mb-4">
                <div><div className="text-4xl font-bold text-foreground">{d.total_attributed ?? 0}</div><div className="text-xs text-muted-foreground">signups with attribution</div></div>
                <div className="text-sm text-muted-foreground">
                  Referral-sourced: <strong className="text-foreground">{d.referrals ?? 0}</strong> · Direct/unknown: <strong className="text-foreground">{d.unknown ?? 0}</strong>.
                  {(d.total_attributed ?? 0) === 0 && ' No attributed signups yet — real 0, and historical users predate capture.'}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Bars label="By source" rows={(d.by_source || []).map((r) => ({ k: r.source, n: r.n }))} />
                <Bars label="By medium" rows={(d.by_medium || []).map((r) => ({ k: r.medium, n: r.n }))} />
                <Bars label="By campaign" rows={(d.by_campaign || []).map((r) => ({ k: r.campaign, n: r.n }))} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Phase 1 scope</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              First-party only (no GA/cookies). Measures the <strong>source of signups</strong> from this deploy forward.
              Still NOT MEASURED: anonymous traffic that never signs up, SEO impressions, social reach, ad spend/CAC/ROAS —
              those need a later analytics-integration phase.
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            Marketing: <Link to="/founder/marketing" className="text-primary underline">Marketing Truth</Link> · Admissions: <Link to="/founder/admissions" className="text-primary underline">Admissions Truth</Link> · Revenue: <Link to="/founder/revenue" className="text-primary underline">Revenue Truth</Link>.
          </div>
        </div>
      )}
    </FounderShell>
  );
}
