import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ChevronDown, ChevronRight, GraduationCap, AlertTriangle } from 'lucide-react';
import { aos } from '@/services/aos';
import { getAcademyReadiness, type AcademyReadiness, type ProgramReadiness } from '@/services/curriculum/readiness';

const tierColor = (t: string) => t === 'Elite' ? '#a855f7' : t === 'World Class' ? '#22c55e' : t === 'Good' ? '#3b82f6' : t === 'Watch' ? '#f59e0b' : '#ef4444';
const barColor = (n: number) => (n >= 90 ? '#22c55e' : n >= 80 ? '#3b82f6' : n >= 60 ? '#f59e0b' : '#ef4444');

const ProgramRow = ({ p }: { p: ProgramReadiness }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30">
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{p.title}</div>
          <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${p.readiness}%`, background: barColor(p.readiness) }} />
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-base font-bold" style={{ color: barColor(p.readiness) }}>{p.readiness}%</div>
          <Badge variant="outline" className="text-[9px]" style={{ color: tierColor(p.tier), borderColor: tierColor(p.tier) }}>{p.tier}</Badge>
        </div>
      </button>
      {open && (
        <div className="border-t border-border/60 p-3 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {p.dims.map((d) => (
              <div key={d.key} className="rounded-lg bg-muted/30 px-2.5 py-2">
                <div className="text-[13px] font-bold text-foreground">{d.have}<span className="text-muted-foreground font-normal">/{d.target}</span></div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  {d.label}{!d.dbTracked && <span title="Not tracked in DB content yet" className="opacity-60">·code</span>}
                </div>
              </div>
            ))}
          </div>
          {p.moduleGaps.length > 0 ? (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Missing content by module</div>
              <div className="space-y-1">
                {p.moduleGaps.map((g) => (
                  <div key={g.module} className="text-[12px]">
                    <span className="font-medium text-foreground">Module {g.module}: {g.title}</span>
                    <span className="text-amber-500"> — missing {g.missing.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-[12px] text-green-500">All modules have lessons + quiz{p.source === 'flagship' ? ' · full reference curriculum' : ''}.</div>
          )}
          {p.source === 'db' && (
            <p className="text-[11px] text-muted-foreground">Simulations / Labs / Portfolios / Interview / AI-Mentor are not yet in the DB content model for this program — they read 0 until authored into the platform.</p>
          )}
        </div>
      )}
    </div>
  );
};

const AcademyReadinessPanel = () => {
  const [data, setData] = useState<AcademyReadiness | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { await aos.ensure(); setData(await getAcademyReadiness()); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const d = data;
  return (
    <div className="space-y-5 mb-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> Academy Launch Readiness</h2>
          <p className="text-sm text-muted-foreground">{d ? `As of ${new Date(d.generatedAt).toLocaleString()} · measured vs Program Standard v1.0` : 'Inventorying every program…'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Re-scan</Button>
      </div>

      {/* Roll-up */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Academy Readiness" value={d ? `${d.academyReadiness}%` : '—'} accent={d ? barColor(d.academyReadiness) : '#64748b'} />
        <Stat label="Programs" value={d ? d.totalPrograms : '—'} accent="#3b82f6" />
        <Stat label="Launch-Ready (≥90%)" value={d ? d.launchReady : '—'} accent="#22c55e" />
        <Stat label="Gaps (total missing)" value={d ? d.missing.reduce((a, m) => a + m.count, 0) : '—'} accent="#f59e0b" />
      </div>

      {d && <LaunchMatrix programs={d.programs} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Heat map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Program Heat Map</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {!d ? <p className="text-sm text-muted-foreground py-6 text-center">Loading…</p>
              : d.programs.map((p) => <ProgramRow key={p.id} p={p} />)}
          </CardContent>
        </Card>

        {/* Missing across academy */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Missing Across Academy</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {d?.missing.map((m) => (
              <div key={m.key} className="flex items-center justify-between text-sm py-1.5 border-b border-border/40 last:border-0">
                <span className="text-foreground">{m.label}</span>
                <span className="font-bold" style={{ color: m.count > 0 ? '#f59e0b' : '#22c55e' }}>{m.count.toLocaleString()}</span>
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground pt-1">Total components still to author across all programs to reach world-class (18/162/18/54/18/18/18/18 per program).</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: string | number; accent: string }) => (
  <Card><CardContent className="p-3.5">
    <div className="text-2xl font-black" style={{ color: accent }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
    <div className="text-[10.5px] text-muted-foreground">{label}</div>
  </CardContent></Card>
);

// Strict Launch Matrix — LIVE Supabase programs only (no code/flagship assumptions).
const missingOf = (p: ProgramReadiness) =>
  p.dims.filter((x) => x.have < x.target).map((x) => `${x.label} ${x.have}/${x.target}`).join(' · ') || 'none';

const LaunchMatrix = ({ programs }: { programs: ProgramReadiness[] }) => {
  const live = programs.filter((p) => p.source === 'db').sort((a, b) => b.readiness - a.readiness);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Launch Matrix — live Supabase only</CardTitle>
        <p className="text-[11px] text-muted-foreground">Ranked most → least complete. Launch only programs ≥ 90%. No code/flagship assumptions.</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {live.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No published programs found in Supabase.</p>
        ) : (
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border/60">
                <th className="py-2 pr-3">#</th><th className="py-2 pr-3">Program</th>
                <th className="py-2 pr-3">Readiness %</th><th className="py-2 pr-3">Launch Ready</th>
                <th className="py-2">Missing Components</th>
              </tr>
            </thead>
            <tbody>
              {live.map((p, i) => (
                <tr key={p.id} className="border-b border-border/40 align-top">
                  <td className="py-2 pr-3 text-muted-foreground">{i + 1}</td>
                  <td className="py-2 pr-3 font-semibold text-foreground">{p.title}</td>
                  <td className="py-2 pr-3 font-bold" style={{ color: barColor(p.readiness) }}>{p.readiness}%</td>
                  <td className="py-2 pr-3">
                    <span className={`font-bold ${p.readiness >= 90 ? 'text-green-500' : 'text-red-500'}`}>{p.readiness >= 90 ? 'Y' : 'N'}</span>
                  </td>
                  <td className="py-2 text-amber-500/90">{missingOf(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default AcademyReadinessPanel;
