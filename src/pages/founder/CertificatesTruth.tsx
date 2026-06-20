// =============================================================================
// /founder/certificates — Certificates Truth. "How many credentials have we
// actually issued?" Reads the admin-only, PII-free founder_certificate_stats
// RPC (counts + per-course totals; no names, emails, or codes). Honestly says
// "not installed" until the migration is applied.
// =============================================================================
import { useEffect, useState } from 'react';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, AlertTriangle } from 'lucide-react';

interface Stats {
  total_issued?: number;
  total_revoked?: number;
  by_course?: { course_id: string; credential_name: string; n: number }[];
}

export default function CertificatesTruth() {
  const [s, setS] = useState<{ loading: boolean; installed: boolean; err: string | null; data: Stats | null }>(
    { loading: true, installed: false, err: null, data: null });

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.rpc('founder_certificate_stats' as any);
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
  const byCourse = d?.by_course || [];
  const top = byCourse.length ? Math.max(...byCourse.map((r) => r.n), 1) : 1;

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Award className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certificates Truth</h1>
          <p className="text-sm text-muted-foreground">How many credentials have we actually issued? Counts only — no PII.</p>
        </div>
      </div>

      {s.loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !s.installed ? (
        <Card>
          <CardContent className="py-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Certificate service not installed</div>
              <p className="text-sm text-muted-foreground mt-1">
                Apply <code>supabase/migrations/20260620000000_certificates_issuance.sql</code> by hand in Supabase, then reload.
                Until then this is honestly <strong>not measured</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Stat label="Issued" value={d?.total_issued ?? 0} />
            <Stat label="Revoked" value={d?.total_revoked ?? 0} />
            <Stat label="Programs" value={byCourse.length} />
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Issued by program</CardTitle></CardHeader>
            <CardContent>
              {byCourse.length === 0 ? (
                <p className="text-sm text-muted-foreground">No certificates issued yet.</p>
              ) : byCourse.map((r) => (
                <div key={r.course_id} className="py-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{r.credential_name}</span>
                    <span className="font-semibold">{r.n}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-0.5">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((r.n / top) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </FounderShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
