import { useEffect, useState } from 'react';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Globe } from 'lucide-react';

/**
 * /founder/localization — Global Content Localization Factory dashboard.
 * Founder-only (via <FounderRoute>). Reads the Phase-2/3 pipeline views:
 * v_factory_dashboard (coverage % + quality), v_missing_translations (backlog),
 * translation_jobs (queue). Renders a calm "run the migration" empty state until
 * the localization-factory migration has been applied in Supabase.
 */
type Row = { lang: string; name: string; tier: string; deploy_blocking: boolean;
  source_assets: number; published: number; in_progress: number; avg_quality: number | null; coverage_pct: number | null };

export default function LocalizationFactory() {
  const [rows, setRows] = useState<Row[]>([]);
  const [backlog, setBacklog] = useState<number | null>(null);
  const [jobs, setJobs] = useState<Record<string, number>>({});
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const dash = await (supabase as any).from('v_factory_dashboard').select('*');
      if (dash.error) { setReady(false); return; }
      setReady(true);
      setRows(dash.data || []);
      const miss = await (supabase as any).from('v_missing_translations').select('*', { count: 'exact', head: true });
      setBacklog(miss.count ?? null);
      const jq = await (supabase as any).from('translation_jobs').select('status');
      if (jq.data) { const m: Record<string, number> = {}; jq.data.forEach((r: any) => m[r.status] = (m[r.status] || 0) + 1); setJobs(m); }
    })();
  }, []);

  const bar = (pct: number | null) => (
    <div style={{ height: 6, background: 'rgba(255,255,255,.08)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct ?? 0}%`, background: (pct ?? 0) >= 100 ? '#22C98A' : (pct ?? 0) >= 50 ? '#F5B81A' : '#F0622A' }} />
    </div>
  );

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Globe className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Content Localization Factory</h1>
          <p className="text-sm text-muted-foreground">Coverage, backlog, and quality across every launch & expansion language.</p>
        </div>
      </div>

      {ready === false && (
        <div className="rounded-xl border border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
          Pipeline tables not found. Apply <code>supabase/migrations/20260618000000_content_localization_pipeline.sql</code> and
          <code> 20260618010000_localization_factory.sql</code> in Supabase to activate this dashboard.
        </div>
      )}

      {ready && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Stat label="Languages in pipeline" value={String(rows.length)} />
            <Stat label="Missing-translation backlog" value={backlog == null ? '—' : String(backlog)} />
            <Stat label="Jobs queued" value={String(jobs['queued'] || 0)} />
            <Stat label="Jobs needing review" value={String(jobs['needs_review'] || 0)} />
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr><th className="text-left px-3 py-2">Language</th><th className="px-3 py-2">Tier</th>
                  <th className="px-3 py-2">Coverage</th><th className="px-3 py-2">Published</th>
                  <th className="px-3 py-2">In progress</th><th className="px-3 py-2">Avg quality</th></tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.lang} className="border-t border-border">
                    <td className="px-3 py-2 font-medium text-foreground">{r.name} <span className="text-muted-foreground">({r.lang})</span>{r.deploy_blocking && <span className="ml-2 text-[10px] text-amber-500">DEPLOY-GATE</span>}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{r.tier}</td>
                    <td className="px-3 py-2" style={{ minWidth: 140 }}>{bar(r.coverage_pct)}<span className="text-xs text-muted-foreground">{r.coverage_pct ?? 0}%</span></td>
                    <td className="px-3 py-2 text-center">{r.published}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{r.in_progress}</td>
                    <td className="px-3 py-2 text-center">{r.avg_quality ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </FounderShell>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-card/60 p-4">
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground mt-1">{label}</div>
  </div>
);
