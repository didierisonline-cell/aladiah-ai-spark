import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FounderShell from '@/components/founder/FounderShell';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footprints, Users, BookOpen, CheckCircle2, AlertTriangle, MinusCircle } from 'lucide-react';

// =============================================================================
// /founder/journey — Student Journey Truth (CEO Command Cell)
// =============================================================================
// Measures BEHAVIOR, not content. Aggregate funnel for the flagship, read via an
// admin-only SECURITY DEFINER RPC (founder_journey_stats) — because user_progress
// / quiz_attempts are owner-only RLS (the #25 lockdown). The RPC returns counts
// only (no PII). If the RPC is not installed yet, the page says so — it never
// guesses. 0 students is shown as 0 (a real measurement), not hidden.
// =============================================================================

interface Stats {
  flagship_id: string | null;
  flagship_title?: string | null;
  engaged_students?: number;
  students_any_lesson?: number;
  students_any_quiz_pass?: number;
  quiz_attempts?: number;
  quiz_attempts_passed?: number;
  per_module?: { module: number; passed_students: number }[];
}

export default function StudentJourney() {
  const [state, setState] = useState<{ loading: boolean; installed: boolean; err: string | null; data: Stats | null }>(
    { loading: true, installed: false, err: null, data: null });

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.rpc('founder_journey_stats' as any);
        if (error) {
          // 404 / undefined function => migration not applied yet (honest state).
          const notInstalled = /function|does not exist|not find|schema cache/i.test(error.message || '');
          setState({ loading: false, installed: !notInstalled, err: error.message, data: null });
          return;
        }
        setState({ loading: false, installed: true, err: null, data: (data as any) || null });
      } catch (e: any) {
        setState({ loading: false, installed: false, err: e?.message || 'rpc failed', data: null });
      }
    })();
  }, []);

  const d = state.data;
  const funnel = d ? [
    { label: 'Engaged students (any progress on flagship)', icon: Users, n: d.engaged_students ?? 0 },
    { label: 'Completed ≥1 lesson', icon: BookOpen, n: d.students_any_lesson ?? 0 },
    { label: 'Passed ≥1 module quiz', icon: CheckCircle2, n: d.students_any_quiz_pass ?? 0 },
  ] : [];
  const top = funnel.length ? Math.max(funnel[0].n, 1) : 1;

  return (
    <FounderShell wide>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Footprints className="w-5 h-5 text-primary" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Journey Truth</h1>
          <p className="text-sm text-muted-foreground">CEO Command Cell — behavior, measured live via an admin-only aggregate RPC. No PII, no guesses.</p>
        </div>
      </div>

      {state.loading && <div className="text-muted-foreground text-sm">Reading live aggregates…</div>}

      {!state.loading && !state.installed && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Analytics RPC not installed</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Student progress (<code>user_progress</code> / <code>quiz_attempts</code>) is <strong>owner-only</strong> RLS by design (#25 lockdown), so the founder client can't read aggregates directly. This dashboard reads them through an admin-only, PII-free function.</p>
            <p>Apply <code>supabase/migrations/20260619060000_founder_journey_stats.sql</code> by hand in Supabase, then reload. Until then this is honestly <strong>not measured</strong> — not zero, not guessed.</p>
            {state.err && <p className="text-xs">Probe said: {state.err}</p>}
          </CardContent>
        </Card>
      )}

      {!state.loading && state.installed && d && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Flagship funnel — {d.flagship_title || 'flagship'}</CardTitle></CardHeader>
            <CardContent className="pt-0">
              {funnel.map((f, i) => (
                <div key={i} className="py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-foreground"><f.icon className="w-4 h-4 text-muted-foreground" /> {f.label}</span>
                    <span className="font-semibold">{f.n}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((f.n / top) * 100)}%` }} />
                  </div>
                </div>
              ))}
              <div className="text-xs text-muted-foreground mt-3">
                Quiz attempts: <strong>{d.quiz_attempts ?? 0}</strong> ({d.quiz_attempts_passed ?? 0} passed).
                {(d.engaged_students ?? 0) === 0 && ' No students engaged yet — this is a real 0, expected pre-launch.'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Per-module completion (passed chapter quiz)</CardTitle></CardHeader>
            <CardContent className="pt-0">
              {(d.per_module || []).length === 0 ? <div className="text-sm text-muted-foreground">No modules found.</div> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {(d.per_module || []).map((m) => (
                    <div key={m.module} className="rounded-lg border border-border/50 p-2 text-center">
                      <div className="text-xs text-muted-foreground">Module {m.module + 1}</div>
                      <div className="text-lg font-bold text-foreground">{m.passed_students}</div>
                      <div className="text-[10px] text-muted-foreground">passed</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><MinusCircle className="w-3.5 h-3.5" /> Drop-off = the step-down between bars. Only the 7 modules with questions can be "passed" today.</div>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            Company readiness: <Link to="/founder/launch" className="text-primary underline">Launch Readiness</Link> · Content: <Link to="/founder/truth" className="text-primary underline">Truth</Link> · Language: <Link to="/founder/translation" className="text-primary underline">Translation Truth</Link>.
          </div>
        </div>
      )}
    </FounderShell>
  );
}
