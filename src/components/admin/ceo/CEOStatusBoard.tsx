import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity, BarChart3, BadgeDollarSign, Brain, Briefcase, GraduationCap,
  Heart, RefreshCw, Server, ShieldCheck, Sparkles, Users,
} from 'lucide-react';
import { aos } from '@/services/aos';
import { getCEOStatus, type CEOStatus, type Metric } from '@/services/ceo/ceoStatus';

const money = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);
const fmt = (m: Metric) => {
  if (m.value === null || m.value === undefined) return '—';
  if (m.money) return money(Number(m.value));
  if (m.pct) return `${m.value}%`;
  return typeof m.value === 'number' ? m.value.toLocaleString() : m.value;
};
const SECTION_ICON: Record<string, React.ElementType> = {
  revenue: BadgeDollarSign, admissions: GraduationCap, students: Users,
  learning: Brain, placement: Briefcase, operations: Server,
};
const healthColor = (h: string) => (h === 'healthy' ? '#22c55e' : h === 'degraded' ? '#f59e0b' : h === 'down' ? '#ef4444' : '#64748b');

const CEOStatusBoard = () => {
  const [data, setData] = useState<CEOStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { await aos.ensure(); setData(await getCEOStatus()); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const d = data;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> CEO Command Center
          </h2>
          <p className="text-sm text-muted-foreground">
            {d ? `As of ${new Date(d.generatedAt).toLocaleString()}` : 'Compiling executive status…'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Ask CEO
        </Button>
      </div>

      {/* Executive headline */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Tile icon={Heart} label="Company Health" value={d ? d.companyHealth : '—'} accent="#22c55e" />
        <Tile icon={Sparkles} label="CTIS (master KPI)" value={d ? d.ctis : '—'} accent="#a855f7" />
        <Tile icon={GraduationCap} label="Curriculum Readiness" value={d ? `${d.curriculumReadiness}%` : '—'} accent={d && d.curriculumReadiness >= 90 ? '#22c55e' : '#f59e0b'} />
        <Tile icon={ShieldCheck} label="Security" value={d ? `${d.security.score} · ${d.security.gate}` : '—'} accent={d && d.security.gate === 'GO' ? '#22c55e' : '#ef4444'} />
        <Tile icon={Activity} label="Pending Approvals" value={d ? d.pendingApprovals : '—'} accent="#f59e0b" />
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {d?.sections.map((s) => {
          const Icon = SECTION_ICON[s.key] || BarChart3;
          return (
            <Card key={s.key}>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Icon className="w-4 h-4 text-primary" />{s.title}</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {s.metrics.map((m) => (
                  <div key={m.label} className="rounded-lg bg-muted/30 px-3 py-2">
                    <div className="text-base font-bold text-foreground truncate">{fmt(m)}</div>
                    <div className="text-[10.5px] text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* Security detail card */}
        {d && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" />Security</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted/30 px-3 py-2"><div className="text-base font-bold" style={{ color: d.security.score >= 90 ? '#22c55e' : '#f59e0b' }}>{d.security.score}</div><div className="text-[10.5px] text-muted-foreground">Security Score</div></div>
              <div className="rounded-lg bg-muted/30 px-3 py-2"><div className="text-base font-bold" style={{ color: d.security.criticals ? '#ef4444' : '#22c55e' }}>{d.security.criticals}</div><div className="text-[10.5px] text-muted-foreground">Critical Findings</div></div>
              <div className="rounded-lg bg-muted/30 px-3 py-2 col-span-2"><div className="text-[12px] font-semibold text-foreground">{new Date(d.security.lastScan).toLocaleString()}</div><div className="text-[10.5px] text-muted-foreground">Last Scan · gate {d.security.gate}</div></div>
            </CardContent>
          </Card>
        )}

        {/* AI Workforce card */}
        {d && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Server className="w-4 h-4 text-primary" />AI Workforce</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {d.workforce.length === 0 ? (
                <p className="text-[12px] text-muted-foreground">Apply the AOS migrations to see live agent status.</p>
              ) : d.workforce.map((a) => (
                <div key={a.slug} className="flex items-center justify-between text-[12.5px]">
                  <span className="text-foreground truncate">{a.name}</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground capitalize">{a.status}<span className="w-2 h-2 rounded-full" style={{ background: healthColor(a.health) }} /></span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {d && d.security.gate === 'NO-GO' && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <ShieldCheck className="w-4 h-4" /> Deployment gate is NO-GO — Security must pass before any production release.
        </div>
      )}
    </div>
  );
};

const Tile = ({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: string }) => (
  <Card><CardContent className="p-3.5 flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}1a` }}><Icon className="w-4 h-4" style={{ color: accent }} /></div>
    <div className="min-w-0"><div className="text-base font-bold text-foreground truncate">{typeof value === 'number' ? value.toLocaleString() : value}</div><div className="text-[10.5px] text-muted-foreground">{label}</div></div>
  </CardContent></Card>
);

export default CEOStatusBoard;
