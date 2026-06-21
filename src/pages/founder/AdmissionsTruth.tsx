import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inbox, Users, Gift, ListChecks, AlertTriangle, MinusCircle, CheckCircle2 } from 'lucide-react';

// =============================================================================
// /founder/admissions — Admissions Truth (CEO Command Cell), COUNTS-FIRST.
// =============================================================================
// course_waitlist / referral_* hold PII and aren't founder-readable in aggregate,
// so counts come from an admin-only, PII-free RPC (founder_admissions_stats).
// Counts only — applications / leads / interviews / decisions / full funnel are
// honestly NOT MEASURED (no tables yet). No invented numbers; "not installed"
// until the RPC is applied.
// =============================================================================

interface Stats {
  total_signups?: number;
  completed_intro?: number;
  program_selected?: number;
  waitlist?: number;
  referral_codes?: number;
  referrals_total?: number;
  referrals_by_status?: { status: string; n: number }[];
}

export default function AdmissionsTruth() {
  const [s, setS] = useState<{ loading: boolean; installed: boolean; err: string | null; data: Stats | null }>(
    { loading: true, installed: false, err: null, data: null });

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.rpc('founder_admissions_stats' as any);
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
  const selRate = d && (d.total_signups ?? 0) > 0 ? Math.round(((d.program_selected ?? 0) / (d.total_signups as number)) * 100) : null;
  const metrics = d ? [
    { label: 'Total signups', icon: Users, v: d.total_signups ?? 0 },
    { label: 'Completed intro', icon: ListChecks, v: d.completed_intro ?? 0 },
    { label: 'Program selected', icon: ListChecks, v: d.program_selected ?? 0 },
    { label: 'Waitlist entries', icon: Inbox, v: d.waitlist ?? 0 },
    { label: 'Referral codes generated', icon: Gift, v: d.referral_codes ?? 0 },
    { label: 'Referral records', icon: Gift, v: d.referrals_total ?? 0 },
  ] : [];

  const notMeasured = [
    'Applications (no applications table)',
    'Leads / prospects (no leads table)',
    'Admissions interviews (no interview-workflow table)',
    'Admissions decisions (not modeled)',
    'Full lead → enrolled funnel (only the referral slice exists)',
    'Recruiter outreach / employer pipeline (not modeled)',
  ];

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Inbox className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admissions Truth</h1>
          <p className="text-sm text-muted-foreground">CEO Command Cell — signup / waitlist / referral counts, live via an admin-only aggregate RPC. Counts only.</p>
        </div>
      </div>

      {s.loading && <div className="text-muted-foreground text-sm">Reading live admissions aggregates…</div>}

      {!s.loading && !s.installed && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Admissions RPC not installed</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Waitlist / referral tables hold PII and aren't founder-readable in aggregate, so this reads them through an admin-only, PII-free function.</p>
            <p>Apply <code>supabase/migrations/20260619080000_founder_admissions_stats.sql</code> by hand in Supabase, then reload. Until then this is honestly <strong>not measured</strong>.</p>
            {s.err && <p className="text-xs">Probe said: {s.err}</p>}
          </CardContent>
        </Card>
      )}

      {!s.loading && s.installed && d && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Top of funnel (live counts)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {metrics.map((m) => (
                  <div key={m.label} className="rounded-lg border border-border/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><m.icon className="w-3.5 h-3.5" /> {m.label}</div>
                    <div className="text-2xl font-bold text-foreground">{m.v}</div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-4">
                Program-selection rate: <strong className="text-foreground">{selRate === null ? '—' : `${selRate}%`}</strong>
                <span className="text-xs"> (program_selected ÷ total_signups){selRate === null ? ' — not derivable with 0 signups' : ''}.</span>
              </div>
              {(d.referrals_by_status || []).length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Referrals by status</div>
                  {(d.referrals_by_status || []).map((r) => (
                    <div key={r.status} className="flex justify-between text-sm py-0.5 border-b border-border/40"><span className="text-foreground">{r.status}</span><span className="font-semibold">{r.n}</span></div>
                  ))}
                </div>
              )}
              {(d.total_signups ?? 0) === 0 && <div className="text-xs text-muted-foreground mt-3">No signups yet — real zeros, expected pre-launch.</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MinusCircle className="w-4 h-4" /> Not measured (needs the Admissions Data Model PR)</CardTitle></CardHeader>
            <CardContent className="pt-0">
              {notMeasured.map((r) => (
                <div key={r} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <span className="text-sm text-foreground">{r}</span>
                  <span className="text-xs font-semibold text-muted-foreground">NOT MEASURED</span>
                </div>
              ))}
              <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Counts above are real. A formal admissions pipeline (applications, leads, interviews, decisions) isn't modeled yet.</div>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            Revenue: <Link to="/founder/revenue" className="text-primary underline">Revenue Truth</Link> · Behavior: <Link to="/founder/journey" className="text-primary underline">Student Journey</Link> · Readiness: <Link to="/founder/launch" className="text-primary underline">Launch</Link>.
          </div>
        </div>
      )}
    </FounderShell>
  );
}
