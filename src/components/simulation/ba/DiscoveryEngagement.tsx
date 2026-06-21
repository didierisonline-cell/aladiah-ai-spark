// =============================================================================
// Discovery Engagement — the interactive BA Simulation 1 (Increment 2).
// Playable, client-side: the learner interviews 6 AI stakeholders, captures
// source-linked findings to an Evidence Board, separates signal from noise, and
// makes an evidence-scored recommendation — producing a draft Executive Discovery
// Report (Portfolio Artifact #1). Scoring is deterministic here; the AI-driven
// dynamic personas + DB persistence land in a later increment (ba-simulation
// edge function + ba_simulation tables). Architecture: docs/curriculum/
// business-analyst-v1/simulations/01_DISCOVERY_ENGAGEMENT_BLUEPRINT.md.
// =============================================================================
import { useMemo, useState } from 'react';
import { ArrowLeft, MessageSquare, ClipboardList, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import {
  BA_SCENARIO, BA_PERSONAS, BA_INTERVIEWS, BA_RECOMMENDATIONS, BA_KEY_SIGNALS,
  type InterviewExchange,
} from '@/components/simulation/ba/BASimulationTypes';

type Phase = 'interview' | 'recommend' | 'result';
interface Finding { text: string; source: string; reliability: string; keySignal?: boolean }

const gradeFor = (s: number) => (s >= 90 ? 'A' : s >= 80 ? 'B' : s >= 70 ? 'C' : s >= 60 ? 'D' : 'F');

export default function DiscoveryEngagement({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('interview');
  const [selected, setSelected] = useState<string>(BA_PERSONAS[0].name);
  const [asked, setAsked] = useState<Record<string, string[]>>({});
  const [captured, setCaptured] = useState<Finding[]>([]);
  const [chosenRec, setChosenRec] = useState<string | null>(null);

  const ask = (persona: string, ex: InterviewExchange) => {
    setAsked(a => ({ ...a, [persona]: [...(a[persona] || []), ex.id] }));
  };
  const capture = (f: Finding) => {
    if (!captured.some(c => c.text === f.text)) setCaptured(c => [...c, f]);
  };

  const personasInterviewed = Object.keys(asked).filter(p => (asked[p] || []).length > 0).length;
  const keySignals = captured.filter(c => c.keySignal).length;

  const score = useMemo(() => {
    const elicitation = Math.round((personasInterviewed / BA_PERSONAS.length) * 100);
    const synthesis = Math.round((keySignals / BA_KEY_SIGNALS) * 100);
    const rec = BA_RECOMMENDATIONS.find(r => r.id === chosenRec);
    const recommendation = rec ? (rec.quality === 'aligned' ? 100 : rec.quality === 'partial' ? 55 : 20) : 0;
    const total = Math.round(elicitation * 0.3 + synthesis * 0.4 + recommendation * 0.3);
    return { elicitation, synthesis, recommendation, total, rec };
  }, [personasInterviewed, keySignals, chosenRec]);

  const persona = BA_PERSONAS.find(p => p.name === selected)!;
  const exchanges = BA_INTERVIEWS[selected] || [];
  const askedHere = asked[selected] || [];

  return (
    <div className="min-h-screen bg-[#0B111E] text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={onExit} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Brief
          </button>
          <div className="text-xs uppercase tracking-[0.25em] text-secondary">{BA_SCENARIO.company} · Discovery Engagement</div>
        </div>

        {/* progress */}
        <div className="flex items-center gap-2 text-xs">
          {(['interview', 'recommend', 'result'] as Phase[]).map((p, i) => (
            <div key={p} className={`flex items-center gap-2 ${phase === p ? 'text-secondary' : 'text-muted-foreground'}`}>
              <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] ${phase === p ? 'bg-secondary text-background' : 'bg-background/60 border border-border/40'}`}>{i + 1}</span>
              <span className="capitalize">{p === 'recommend' ? 'Recommendation' : p === 'result' ? 'Result' : 'Interviews'}</span>
              {i < 2 && <span className="w-6 h-px bg-border/40" />}
            </div>
          ))}
        </div>

        {phase === 'interview' && (
          <div className="grid md:grid-cols-[200px_1fr] gap-5">
            {/* persona list */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wide text-foreground/70 mb-1">Stakeholders</div>
              {BA_PERSONAS.map(p => {
                const done = (asked[p.name] || []).length;
                return (
                  <button key={p.name} onClick={() => setSelected(p.name)}
                    className={`w-full text-left rounded-xl border p-2.5 flex items-center gap-2 ${selected === p.name ? 'border-secondary bg-secondary/10' : 'border-border/30 bg-background/40'}`}>
                    <span className="text-xl">{p.avatar}</span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold truncate">{p.name}</span>
                      <span className="block text-[10px] text-muted-foreground truncate">{p.role}</span>
                    </span>
                    {done > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-secondary ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* interview room */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{persona.avatar}</span>
                  <div>
                    <div className="font-semibold text-sm">{persona.name}</div>
                    <div className="text-xs text-muted-foreground">{persona.role} · “{persona.statedGoal}”</div>
                  </div>
                  <MessageSquare className="w-4 h-4 text-secondary ml-auto" />
                </div>
                <div className="space-y-3">
                  {exchanges.map(ex => {
                    const isAsked = askedHere.includes(ex.id);
                    return (
                      <div key={ex.id}>
                        <button onClick={() => ask(selected, ex)} disabled={isAsked}
                          className={`text-left text-sm rounded-lg px-3 py-2 w-full ${isAsked ? 'text-muted-foreground bg-background/30' : 'text-foreground bg-secondary/10 hover:bg-secondary/20'}`}>
                          ❝ {ex.question}
                        </button>
                        {isAsked && (
                          <div className="mt-1.5 ml-3 pl-3 border-l-2 border-border/40">
                            <p className="text-sm text-foreground/85">{ex.answer}</p>
                            {ex.finding && (
                              <button onClick={() => capture(ex.finding as Finding)}
                                disabled={captured.some(c => c.text === ex.finding!.text)}
                                className="mt-1 text-[11px] inline-flex items-center gap-1 rounded-md border border-secondary/40 text-secondary px-2 py-0.5 disabled:opacity-50">
                                {captured.some(c => c.text === ex.finding!.text) ? '✓ Captured' : '＋ Capture to Evidence Board'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* evidence board */}
              <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">Evidence Board ({captured.length})</span>
                </div>
                {captured.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Capture findings from your interviews. Watch for the real signal beneath the loudest opinions.</p>
                ) : (
                  <div className="space-y-1.5">
                    {captured.map((c, i) => (
                      <div key={i} className="text-xs flex items-start gap-2">
                        {c.keySignal ? <span title="key signal" className="text-secondary">★</span> : <span className="text-muted-foreground">•</span>}
                        <span><span className="text-foreground/90">{c.text}</span> <span className="text-muted-foreground">— {c.source} [{c.reliability}]</span></span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setPhase('recommend')} disabled={captured.length < 2}
                  className="mt-3 px-4 py-2 rounded-lg bg-secondary text-background text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                  Proceed to Recommendation →
                </button>
                {captured.length < 2 && <span className="ml-2 text-[11px] text-muted-foreground">capture at least 2 findings</span>}
              </div>
            </div>
          </div>
        )}

        {phase === 'recommend' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
              <div className="text-sm font-semibold mb-1">Your recommendation to Diane (VP Ops)</div>
              <p className="text-xs text-muted-foreground mb-3">Based on the evidence you gathered — not the loudest request. There is no single answer key; you’re scored on evidence-based reasoning.</p>
              <div className="space-y-2">
                {BA_RECOMMENDATIONS.map(r => (
                  <label key={r.id} className={`block rounded-xl border p-3 cursor-pointer ${chosenRec === r.id ? 'border-secondary bg-secondary/10' : 'border-border/30 bg-background/40'}`}>
                    <input type="radio" name="rec" className="mr-2 align-middle" checked={chosenRec === r.id} onChange={() => setChosenRec(r.id)} />
                    <span className="text-sm">{r.text}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setPhase('interview')} className="text-sm text-muted-foreground hover:text-foreground">← back to interviews</button>
              <button onClick={() => setPhase('result')} disabled={!chosenRec}
                className="px-5 py-2.5 rounded-xl bg-secondary text-background text-sm font-semibold disabled:opacity-40">
                Submit Discovery Report
              </button>
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-1">Engagement complete</div>
              <div className="text-5xl font-display font-bold">{gradeFor(score.total)}</div>
              <div className="text-sm text-muted-foreground">Score {score.total}/100 {score.total >= 80 ? '· Pass' : '· Below pass (80)'}</div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[['Elicitation', score.elicitation, `${personasInterviewed}/${BA_PERSONAS.length} stakeholders interviewed`],
                ['Evidence & synthesis', score.synthesis, `${keySignals}/${BA_KEY_SIGNALS} key signals found`],
                ['Recommendation', score.recommendation, score.rec?.quality === 'aligned' ? 'evidence-aligned' : score.rec?.quality === 'partial' ? 'partial' : 'not supported by evidence']].map(([label, val, sub]) => (
                <div key={label as string} className="rounded-xl border border-border/40 bg-card/60 p-3">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-2xl font-bold text-secondary">{val as number}</div>
                  <div className="text-[11px] text-muted-foreground">{sub}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
              <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-secondary" /><span className="text-xs font-bold uppercase tracking-wide text-foreground/70">Coach feedback</span></div>
              <p className="text-sm text-foreground/85">{score.rec?.rationale}</p>
              {keySignals < BA_KEY_SIGNALS && <p className="text-sm text-foreground/70 mt-2">You missed {BA_KEY_SIGNALS - keySignals} key signal(s). The real problem lives in the refund-timing variance, the ~48% cross-channel returns, and the data-retention constraint — interview widely and capture the evidence beneath the loudest opinions.</p>}
            </div>

            <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-foreground/70 mb-2">Draft Executive Discovery Report (Portfolio Artifact #1)</div>
              <p className="text-xs text-muted-foreground mb-2">Recommendation: <span className="text-foreground/90">{score.rec?.text}</span></p>
              <div className="text-xs text-muted-foreground">Evidence ({captured.length}):</div>
              <ul className="text-xs text-foreground/80 list-disc ml-5">
                {captured.map((c, i) => <li key={i}>{c.text} <span className="text-muted-foreground">— {c.source}</span></li>)}
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setPhase('interview'); setAsked({}); setCaptured([]); setChosenRec(null); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 text-sm">
                <RotateCcw className="w-4 h-4" /> Run again
              </button>
              <button onClick={onExit} className="px-4 py-2 rounded-lg bg-secondary text-background text-sm font-semibold">Finish</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
