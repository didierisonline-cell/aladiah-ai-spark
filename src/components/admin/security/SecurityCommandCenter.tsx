import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ShieldAlert, KeyRound, Lock, Rocket } from 'lucide-react';
import { getSecurityPosture, type Status } from '@/services/security/securityPosture';

const dot = (s: Status | 'PASS' | 'FAIL') => {
  const ok = s === 'pass' || s === 'PASS';
  const warn = s === 'warn';
  return ok ? '#22c55e' : warn ? '#f59e0b' : '#ef4444';
};
const emoji = (s: Status) => (s === 'pass' ? '🟢' : s === 'warn' ? '🟡' : '🔴');
const scoreColor = (n: number) => (n >= 90 ? '#22c55e' : n >= 75 ? '#f59e0b' : '#ef4444');

const SecurityCommandCenter = () => {
  const p = useMemo(() => getSecurityPosture(), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" /> Security Command Center
          </h1>
          <p className="text-sm text-muted-foreground">Aladiah Cybersecurity Authority · internal CISO · founder-only</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${p.gate.verdict === 'GO' ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}>
          Security gate: {p.gate.verdict}
        </div>
      </div>

      {/* Overall + sub-scores */}
      <Card>
        <CardContent className="p-5 grid grid-cols-2 md:grid-cols-7 gap-4 items-center">
          <div className="col-span-2 md:col-span-1 text-center">
            <div className="text-4xl font-black" style={{ color: scoreColor(p.overall) }}>{p.overall}</div>
            <div className="text-[11px] text-muted-foreground">Overall Security Score</div>
          </div>
          {p.sections.map((s) => (
            <div key={s.key} className="text-center">
              <div className="text-xl font-bold" style={{ color: scoreColor(s.score) }}>{s.score}%</div>
              <div className="text-[10px] text-muted-foreground">{s.title}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {p.criticalsOpen > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <ShieldAlert className="w-4 h-4" /> {p.criticalsOpen} critical item(s) open — rotate exposed keys to clear the gate.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Secrets Monitor */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><KeyRound className="w-4 h-4" /> Secrets Monitor</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {p.providers.map((pr) => (
              <div key={pr.name} className="flex items-center justify-between text-sm py-1.5 border-b border-border/40 last:border-0">
                <span className="font-medium text-foreground">{pr.name}</span>
                <span className="flex items-center gap-2 text-muted-foreground text-[12px]">
                  {pr.note}
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: dot(pr.status) }} />
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Lock className="w-4 h-4" /> Access Control</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {p.access.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border/40 last:border-0">
                <span className="min-w-0">
                  <span className="font-medium text-foreground block truncate">{a.label}</span>
                  <span className="text-[11px] text-muted-foreground">{a.basis}</span>
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${a.result === 'PASS' ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}>{a.result}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed checks per section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {p.sections.map((s) => (
          <Card key={s.key}>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center justify-between">
              <span>{s.title}</span><span style={{ color: scoreColor(s.score) }}>{s.score}%</span>
            </CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {s.checks.map((c) => (
                <div key={c.id} className="flex items-start gap-2 text-[12.5px]">
                  <span className="mt-0.5">{emoji(c.status)}</span>
                  <span><span className="text-foreground font-medium">{c.label}</span><span className="text-muted-foreground"> — {c.detail}</span></span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deployment Gate */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Rocket className="w-4 h-4" /> Deployment Gate</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Security Agent', ok: p.gate.security, sub: p.gate.security ? 'Signed off' : 'Blocked — open criticals' },
            { label: 'QA Agent', ok: p.gate.qa, sub: p.gate.qa ? 'Signed off' : 'Pending QA review' },
            { label: 'CEO approval', ok: p.gate.ceo, sub: p.gate.ceo ? 'Approved' : 'Awaiting sign-offs' },
          ].map((g) => (
            <div key={g.label} className="rounded-xl border border-border/60 p-4">
              <div className="text-2xl mb-1">{g.ok ? '✅' : '⛔'}</div>
              <div className="text-sm font-bold text-foreground">{g.label}</div>
              <div className="text-[11px] text-muted-foreground">{g.sub}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground text-center">
        Last scan {new Date(p.lastScan).toLocaleString()} · model: <code>src/services/security/securityPosture.ts</code> (flip <code>KEYS_ROTATED</code> after rotation).
      </p>
    </div>
  );
};

export default SecurityCommandCenter;
