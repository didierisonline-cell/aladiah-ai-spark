// =============================================================================
// Founder Review Mode — replay and compare BA simulation engagements.
// Reads ba_simulation* (admins can read all rows via RLS). Shows a cohort
// summary (counts, averages, weakest competency across students) and a per-
// engagement replay: decision/evidence timeline, 7-dimension scoring breakdown,
// recommendation, generated Discovery Report, and STAR story. Gracefully shows
// an empty state when the migration isn't applied or no engagements exist yet.
// =============================================================================
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Users, BarChart3, MessageSquare, ClipboardList } from 'lucide-react';

interface SimRow { id: string; user_id: string; scenario_id: string | null; score: number | null; grade: string | null; readiness_score: number | null; recommendation: string | null; created_at: string; report: any; story: any }

// Human labels for each simulation scenario (extend as sims are added).
const SCENARIO_LABEL: Record<string, string> = {
  'aurora-returns': 'Sim 1 · Discovery Engagement',
  'aurora-steering': 'Sim 2 · Executive Steering Committee',
  'aurora-conflict': 'Sim 3 · Conflicting Requirements Crisis',
};
const scenarioLabel = (id: string | null) => SCENARIO_LABEL[id || ''] || (id || 'Unknown scenario');
interface Msg { role: string; speaker: string | null; content: string; created_at: string }
interface Score { dimension: string; score: number }
interface Finding { text: string; source: string | null; created_at: string }

const sb = supabase as any;

export default function SimulationReview() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<SimRow[] | null>(null);
  const [allScores, setAllScores] = useState<Score[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ msgs: Msg[]; findings: Finding[]; scores: Score[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [scenarioFilter, setScenarioFilter] = useState<string>('all');

  useEffect(() => {
    (async () => {
      const { data, error } = await sb.from('ba_simulations')
        .select('id,user_id,scenario_id,score,grade,readiness_score,recommendation,created_at,report,story')
        .order('created_at', { ascending: false }).limit(200);
      if (error) { setErr('No simulation data yet — apply migration 20260620120000 and have students complete an engagement.'); setRows([]); return; }
      setRows(data || []);
      const { data: sc } = await sb.from('ba_simulation_scores').select('dimension,score').limit(2000);
      setAllScores(sc || []);
    })();
  }, []);

  // Scenarios present in the data, for the filter chips.
  const scenarios = useMemo(() => {
    const set = new Set<string>();
    (rows || []).forEach(r => set.add(r.scenario_id || 'unknown'));
    return Array.from(set);
  }, [rows]);

  const visible = useMemo(
    () => (rows || []).filter(r => scenarioFilter === 'all' || (r.scenario_id || 'unknown') === scenarioFilter),
    [rows, scenarioFilter],
  );

  const cohort = useMemo(() => {
    if (!visible.length) return null;
    const avg = (xs: number[]) => xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0;
    const byDim: Record<string, number[]> = {};
    allScores.forEach(s => { (byDim[s.dimension] ||= []).push(s.score); });
    const dimAvgs = Object.entries(byDim).map(([d, xs]) => ({ d, avg: avg(xs) })).sort((a, b) => a.avg - b.avg);
    return {
      count: visible.length,
      avgScore: avg(visible.map(r => r.score || 0)),
      avgReadiness: avg(visible.map(r => r.readiness_score || 0)),
      weakest: dimAvgs.slice(0, 3),
      dimAvgs,
    };
  }, [visible, allScores]);

  async function open(id: string) {
    setSel(id); setDetail(null);
    const [{ data: msgs }, { data: findings }, { data: scores }] = await Promise.all([
      sb.from('ba_simulation_messages').select('role,speaker,content,created_at').eq('simulation_id', id).order('created_at'),
      sb.from('ba_simulation_findings').select('text,source,created_at').eq('simulation_id', id).order('created_at'),
      sb.from('ba_simulation_scores').select('dimension,score').eq('simulation_id', id),
    ]);
    setDetail({ msgs: msgs || [], findings: findings || [], scores: scores || [] });
  }

  const selRow = rows?.find(r => r.id === sel);

  return (
    <div className="min-h-screen bg-[#0B111E] text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-5">
        <button onClick={() => navigate('/founder')} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Founder
        </button>
        <h1 className="text-2xl font-display font-bold">Simulation Review</h1>

        {/* scenario filter */}
        {scenarios.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {['all', ...scenarios].map(s => (
              <button key={s} onClick={() => { setScenarioFilter(s); setSel(null); setDetail(null); }}
                className={`text-xs rounded-full border px-3 py-1 ${scenarioFilter === s ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border/40 text-muted-foreground'}`}>
                {s === 'all' ? 'All simulations' : scenarioLabel(s)}
              </button>
            ))}
          </div>
        )}

        {/* cohort summary */}
        {cohort && (
          <div className="grid sm:grid-cols-4 gap-3">
            {[['Engagements', cohort.count], ['Avg score', cohort.avgScore], ['Avg readiness', cohort.avgReadiness], ['Weakest competency', cohort.weakest[0]?.d || '—']].map(([l, v]) => (
              <div key={l as string} className="rounded-xl border border-border/40 bg-card/60 p-3">
                <div className="text-xs text-muted-foreground">{l}</div>
                <div className="text-xl font-bold text-secondary">{v as any}</div>
              </div>
            ))}
          </div>
        )}

        {err && <div className="rounded-xl border border-border/40 bg-card/60 p-4 text-sm text-muted-foreground">{err}</div>}
        {rows && !rows.length && !err && <div className="rounded-xl border border-border/40 bg-card/60 p-4 text-sm text-muted-foreground">No engagements recorded yet.</div>}

        <div className="grid md:grid-cols-[260px_1fr] gap-5">
          {/* list */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wide text-foreground/70 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Engagements</div>
            {visible.map(r => (
              <button key={r.id} onClick={() => open(r.id)} className={`w-full text-left rounded-xl border p-2.5 ${sel === r.id ? 'border-secondary bg-secondary/10' : 'border-border/30 bg-background/40'}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">{r.user_id.slice(0, 8)}…</span>
                  <span className="font-bold text-secondary">{r.grade} · {r.score}</span>
                </div>
                <div className="text-[10px] text-secondary/80">{scenarioLabel(r.scenario_id)}</div>
                <div className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()} · readiness {r.readiness_score ?? '—'}</div>
              </button>
            ))}
          </div>

          {/* detail / replay */}
          <div className="space-y-4">
            {!selRow && <div className="rounded-2xl border border-border/40 bg-card/60 p-6 text-sm text-muted-foreground">Select an engagement to replay the decision timeline, evidence, and scoring.</div>}
            {selRow && detail && (
              <>
                <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
                  <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-secondary" /><span className="text-xs font-bold uppercase tracking-wide text-foreground/70">Scoring breakdown</span><span className="ml-auto text-[10px] text-secondary">{scenarioLabel(selRow.scenario_id)}</span></div>
                  <div className="space-y-1.5">
                    {detail.scores.map(s => (
                      <div key={s.dimension} className="flex items-center gap-3">
                        <div className="w-48 text-xs">{s.dimension}</div>
                        <div className="flex-1 h-2 rounded-full bg-background/60 overflow-hidden"><div className="h-full bg-secondary/70" style={{ width: `${s.score}%` }} /></div>
                        <div className="w-8 text-right text-xs text-muted-foreground">{s.score}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Weakest here: {[...detail.scores].sort((a, b) => a.score - b.score).slice(0, 2).map(s => s.dimension).join(', ') || '—'}</p>
                  <p className="text-sm mt-2"><span className="text-muted-foreground">Recommendation: </span>{selRow.recommendation}</p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
                  <div className="flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4 text-secondary" /><span className="text-xs font-bold uppercase tracking-wide text-foreground/70">Decision / interview timeline</span></div>
                  <div className="space-y-1 max-h-72 overflow-auto">
                    {detail.msgs.map((m, i) => (
                      <div key={i} className="text-xs"><span className={m.role === 'user' ? 'text-primary' : 'text-secondary'}>{m.role === 'user' ? 'BA' : m.speaker}: </span><span className="text-foreground/80">{m.content}</span></div>
                    ))}
                    {!detail.msgs.length && <div className="text-xs text-muted-foreground">No interview turns recorded.</div>}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
                  <div className="flex items-center gap-2 mb-2"><ClipboardList className="w-4 h-4 text-secondary" /><span className="text-xs font-bold uppercase tracking-wide text-foreground/70">Evidence captured ({detail.findings.length})</span></div>
                  <ul className="text-xs list-disc ml-5 text-foreground/80">{detail.findings.map((f, i) => <li key={i}>{f.text} <span className="text-muted-foreground">— {f.source}</span></li>)}</ul>
                </div>

                {selRow.report && (
                  <div className="rounded-2xl border border-border/40 bg-card/60 p-4 text-sm">
                    <div className="text-xs font-bold uppercase tracking-wide text-foreground/70 mb-2">Generated Discovery Report</div>
                    <p><span className="text-muted-foreground">Problem: </span>{selRow.report.problem}</p>
                    <p><span className="text-muted-foreground">Recommendation: </span>{selRow.report.recommendation}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
