// =============================================================================
// Discovery Engagement — interactive BA Simulation 1 (Increment 3: AI engine).
// The reference architecture for all Aladiah simulations. The learner interviews
// 6 stakeholders (scripted questions + free-text questions answered by DYNAMIC AI
// personas via the ba-simulation edge function), captures source-linked evidence,
// separates signal from noise, and recommends. On completion it produces a
// 7-dimension rubric score, an auto-generated Executive Discovery Report
// (Portfolio Artifact #1), and a STAR interview story — every output built to
// pass the hiring-manager test. All AI calls degrade gracefully: if the edge
// function isn't deployed, deterministic fallbacks keep the sim fully playable.
// Persistence + Founder Review Mode are the next increment (need the live DB).
// =============================================================================
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageSquare, ClipboardList, Sparkles, CheckCircle2, RotateCcw, Send, FileText, Briefcase } from 'lucide-react';
import {
  BA_SCENARIO, BA_PERSONAS, BA_INTERVIEWS, BA_RECOMMENDATIONS, BA_KEY_SIGNALS,
  BA_PERSONA_PROFILES, BA_RUBRIC_DIMENSIONS, type InterviewExchange,
} from '@/components/simulation/ba/BASimulationTypes';
import { baSim, type AiFinding } from '@/components/simulation/ba/baSimClient';
import { saveEngagement, readinessScore } from '@/components/simulation/ba/baSimPersist';

type Phase = 'interview' | 'recommend' | 'result';
interface Finding { text: string; source: string; reliability: string; keySignal?: boolean }
interface AiTurn { q: string; a: string; finding?: AiFinding | null }

const gradeFor = (s: number) => (s >= 90 ? 'A' : s >= 80 ? 'B' : s >= 70 ? 'C' : s >= 60 ? 'D' : 'F');
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export default function DiscoveryEngagement({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('interview');
  const [selected, setSelected] = useState<string>(BA_PERSONAS[0].name);
  const [asked, setAsked] = useState<Record<string, string[]>>({});
  const [captured, setCaptured] = useState<Finding[]>([]);
  const [chosenRec, setChosenRec] = useState<string | null>(null);
  // dynamic AI interview
  const [aiTurns, setAiTurns] = useState<Record<string, AiTurn[]>>({});
  const [draft, setDraft] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  // result generation
  const [gen, setGen] = useState<{ busy: boolean; dims: Record<string, number>; total: number; readiness: number; feedback: string; report: any; story: any; saved: boolean } | null>(null);

  const ask = (persona: string, ex: InterviewExchange) =>
    setAsked(a => ({ ...a, [persona]: [...(a[persona] || []), ex.id] }));
  const capture = (f: Finding) =>
    setCaptured(c => (c.some(x => x.text === f.text) ? c : [...c, f]));

  const personasInterviewed = useMemo(() => {
    const names = new Set([...Object.keys(asked).filter(p => (asked[p] || []).length), ...Object.keys(aiTurns).filter(p => (aiTurns[p] || []).length)]);
    return names.size;
  }, [asked, aiTurns]);
  const keySignals = captured.filter(c => c.keySignal).length;

  async function sendQuestion() {
    const q = draft.trim();
    if (!q) return;
    setDraft('');
    setAiBusy(true);
    const persona = BA_PERSONAS.find(p => p.name === selected)!;
    const history = (aiTurns[selected] || []).flatMap(t => [
      { role: 'user', content: t.q }, { role: 'assistant', content: t.a },
    ]);
    const res = await baSim.interview({
      persona: { ...persona, ...(BA_PERSONA_PROFILES[selected] || {}) },
      question: q, history, company: BA_SCENARIO.company,
    });
    const turn: AiTurn = res
      ? { q, a: res.reply, finding: res.finding }
      : { q, a: `(${selected} is available for scripted questions above — the live AI interviewer isn't connected in this environment.)`, finding: null };
    setAiTurns(t => ({ ...t, [selected]: [...(t[selected] || []), turn] }));
    setAiBusy(false);
  }

  // Generate rubric + report + story on entering the result phase.
  useEffect(() => {
    if (phase !== 'result' || gen) return;
    const rec = BA_RECOMMENDATIONS.find(r => r.id === chosenRec);
    // deterministic 7-dimension baseline (AI refines if available)
    const coverage = clamp((personasInterviewed / BA_PERSONAS.length) * 100);
    const evidence = clamp(captured.length * 14 + keySignals * 14);
    const recQ = rec?.quality === 'aligned' ? 100 : rec?.quality === 'partial' ? 55 : 20;
    const signal = clamp((keySignals / BA_KEY_SIGNALS) * 100 - (rec?.quality === 'trap' ? 25 : 0));
    const baseDims: Record<string, number> = {
      discovery_quality: clamp((coverage + evidence) / 2),
      evidence_quality: evidence,
      stakeholder_coverage: coverage,
      signal_vs_noise: signal,
      recommendation_quality: recQ,
      business_impact: rec?.quality === 'aligned' ? 90 : rec?.quality === 'partial' ? 50 : 25,
      executive_communication: 72,
    };
    const findings = captured;
    const recText = rec?.text || '';
    setGen({ busy: true, dims: baseDims, total: avg(baseDims), readiness: 0, feedback: rec?.rationale || '', report: null, story: null, saved: false });

    // interview transcript (scripted + dynamic AI) for persistence
    const messages: { role: string; speaker: string; content: string }[] = [];
    Object.entries(asked).forEach(([p, ids]) => (ids || []).forEach(id => {
      const ex = (BA_INTERVIEWS[p] || []).find(e => e.id === id);
      if (ex) { messages.push({ role: 'user', speaker: p, content: ex.question }); messages.push({ role: 'persona', speaker: p, content: ex.answer }); }
    }));
    Object.entries(aiTurns).forEach(([p, turns]) => (turns || []).forEach(t => {
      messages.push({ role: 'user', speaker: p, content: t.q }); messages.push({ role: 'persona', speaker: p, content: t.a });
    }));

    (async () => {
      const [ev, rep, st] = await Promise.all([
        baSim.evaluate({ company: BA_SCENARIO.company, title: BA_SCENARIO.title, coverage: personasInterviewed, findings, recommendation: recText }),
        baSim.report({ company: BA_SCENARIO.company, title: BA_SCENARIO.title, findings, recommendation: recText }),
        baSim.story({ company: BA_SCENARIO.company, title: BA_SCENARIO.title, findings, recommendation: recText }),
      ]);
      const dims = ev?.dimensions || baseDims;
      const total = ev?.total ?? avg(baseDims);
      const report = rep || fallbackReport(findings, recText, keySignals);
      const story = st || fallbackStory(recText, findings);
      const readiness = readinessScore({
        total,
        reportComplete: !!(report?.problem && (report?.evidence?.length)),
        storyComplete: !!(story?.situation && story?.result),
        competencyProxy: clamp((coverage + signal) / 2),
      });
      setGen({ busy: false, dims, total, readiness, feedback: ev?.feedback || rec?.rationale || '', report, story, saved: false });
      const savedId = await saveEngagement({ total, grade: gradeFor(total), readiness, recommendation: recText, report, story, dims, messages, findings });
      setGen(g => (g ? { ...g, saved: !!savedId } : g));
    })();
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

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

        <div className="flex items-center gap-2 text-xs">
          {(['interview', 'recommend', 'result'] as Phase[]).map((p, i) => (
            <div key={p} className={`flex items-center gap-2 ${phase === p ? 'text-secondary' : 'text-muted-foreground'}`}>
              <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] ${phase === p ? 'bg-secondary text-background' : 'bg-background/60 border border-border/40'}`}>{i + 1}</span>
              <span>{p === 'recommend' ? 'Recommendation' : p === 'result' ? 'Result' : 'Interviews'}</span>
              {i < 2 && <span className="w-6 h-px bg-border/40" />}
            </div>
          ))}
        </div>

        {phase === 'interview' && (
          <div className="grid md:grid-cols-[200px_1fr] gap-5">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wide text-foreground/70 mb-1">Stakeholders</div>
              {BA_PERSONAS.map(p => {
                const done = (asked[p.name] || []).length + (aiTurns[p.name] || []).length;
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
                              <button onClick={() => capture(ex.finding as Finding)} disabled={captured.some(c => c.text === ex.finding!.text)}
                                className="mt-1 text-[11px] inline-flex items-center gap-1 rounded-md border border-secondary/40 text-secondary px-2 py-0.5 disabled:opacity-50">
                                {captured.some(c => c.text === ex.finding!.text) ? '✓ Captured' : '＋ Capture to Evidence Board'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* dynamic AI turns */}
                  {(aiTurns[selected] || []).map((t, i) => (
                    <div key={`ai-${i}`}>
                      <div className="text-sm rounded-lg px-3 py-2 bg-primary/10 text-foreground">❝ {t.q}</div>
                      <div className="mt-1.5 ml-3 pl-3 border-l-2 border-border/40">
                        <p className="text-sm text-foreground/85">{t.a}</p>
                        {t.finding && (
                          <button onClick={() => capture(t.finding as Finding)} disabled={captured.some(c => c.text === t.finding!.text)}
                            className="mt-1 text-[11px] inline-flex items-center gap-1 rounded-md border border-secondary/40 text-secondary px-2 py-0.5 disabled:opacity-50">
                            {captured.some(c => c.text === t.finding!.text) ? '✓ Captured' : '＋ Capture to Evidence Board'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* free-text question to the dynamic AI persona */}
                <div className="mt-3 flex items-center gap-2">
                  <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendQuestion()}
                    placeholder={`Ask ${persona.name} your own question…`}
                    className="flex-1 text-sm bg-background/60 border border-border/40 rounded-lg px-3 py-2 outline-none focus:border-secondary/60" />
                  <button onClick={sendQuestion} disabled={aiBusy || !draft.trim()}
                    className="px-3 py-2 rounded-lg bg-secondary text-background disabled:opacity-40">
                    {aiBusy ? '…' : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Open, behavioural questions earn better answers. Leading questions get guarded ones.</p>
              </div>

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

        {phase === 'result' && gen && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-1">Engagement complete</div>
              <div className="text-5xl font-display font-bold">{gradeFor(gen.total)}</div>
              <div className="text-sm text-muted-foreground">Score {gen.total}/100 {gen.total >= 80 ? '· Pass' : '· Below pass (80)'}{gen.busy ? ' · refining with AI…' : ''}</div>
              <div className="mt-2 inline-flex items-center gap-2 text-xs rounded-full border border-border/40 px-3 py-1">
                <span className="text-muted-foreground">Simulation Readiness (v1)</span>
                <span className="font-bold text-secondary">{gen.readiness}/100</span>
              </div>
              {!gen.busy && (
                <div className="text-[11px] text-muted-foreground mt-1">{gen.saved ? '✓ Engagement saved to your record' : 'Not saved (sign in + apply migration to persist)'}</div>
              )}
            </div>

            {/* 7-dimension rubric */}
            <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-foreground/70 mb-3">7-Dimension Rubric</div>
              <div className="space-y-1.5">
                {BA_RUBRIC_DIMENSIONS.map(d => (
                  <div key={d.key} className="flex items-center gap-3">
                    <div className="w-48 text-xs">{d.label}</div>
                    <div className="flex-1 h-2 rounded-full bg-background/60 overflow-hidden">
                      <div className="h-full bg-secondary/70" style={{ width: `${gen.dims[d.key] ?? 0}%` }} />
                    </div>
                    <div className="w-8 text-right text-xs text-muted-foreground">{gen.dims[d.key] ?? 0}</div>
                  </div>
                ))}
              </div>
              {gen.feedback && <p className="text-sm text-foreground/80 mt-3"><Sparkles className="w-3.5 h-3.5 text-secondary inline mr-1" />{gen.feedback}</p>}
            </div>

            {/* Executive Discovery Report (Portfolio Artifact #1) */}
            <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">Executive Discovery Report · Portfolio Artifact #1</span>
                <span className="ml-auto text-[10px] rounded-full border border-secondary/40 text-secondary px-2 py-0.5">Hiring-manager ready ✓</span>
              </div>
              {gen.report ? (
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Problem: </span>{gen.report.problem}</p>
                  <div><span className="text-muted-foreground">Opportunities:</span><ul className="list-disc ml-5 text-foreground/85">{(gen.report.opportunities || []).map((o: string, i: number) => <li key={i}>{o}</li>)}</ul></div>
                  <div><span className="text-muted-foreground">Evidence:</span><ul className="list-disc ml-5 text-foreground/85">{(gen.report.evidence || []).map((o: string, i: number) => <li key={i}>{o}</li>)}</ul></div>
                  <p><span className="text-muted-foreground">Recommendation: </span>{gen.report.recommendation}</p>
                  <div><span className="text-muted-foreground">Risks:</span><ul className="list-disc ml-5 text-foreground/85">{(gen.report.risks || []).map((o: string, i: number) => <li key={i}>{o}</li>)}</ul></div>
                  <p className="text-xs text-muted-foreground">Confidence: {gen.report.confidence}</p>
                </div>
              ) : <p className="text-xs text-muted-foreground">Generating…</p>}
            </div>

            {/* STAR interview story */}
            <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">Interview Story (STAR)</span>
                <span className="ml-auto text-[10px] rounded-full border border-secondary/40 text-secondary px-2 py-0.5">Tell this in an interview ✓</span>
              </div>
              {gen.story ? (
                <div className="space-y-1.5 text-sm">
                  {(['situation', 'task', 'action', 'result', 'lessons'] as const).map(k => (
                    <p key={k}><span className="text-secondary capitalize font-semibold">{k}: </span><span className="text-foreground/85">{gen.story[k]}</span></p>
                  ))}
                </div>
              ) : <p className="text-xs text-muted-foreground">Generating…</p>}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setPhase('interview'); setAsked({}); setCaptured([]); setChosenRec(null); setAiTurns({}); setGen(null); }}
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

function avg(d: Record<string, number>) {
  const v = Object.values(d);
  return Math.round(v.reduce((a, b) => a + b, 0) / v.length);
}
function fallbackReport(findings: Finding[], rec: string, keySignals: number) {
  return {
    problem: 'Returns cost is up ~30% YoY. The evidence points to refund-timing variance and cross-channel (online→in-store) friction as the real drivers — not warehouse speed.',
    opportunities: ['Reduce refund-timing variance', 'Integrate the cross-channel returns flow', 'Auto-approve low-risk returns with fraud controls'],
    evidence: findings.map(f => `${f.text} — ${f.source}`),
    recommendation: rec,
    risks: ['Finance fraud/audit requirements', 'Legal data-retention constraint', 'Store adoption (history of failed projects)'],
    confidence: keySignals >= 3 ? 'high' : keySignals >= 2 ? 'medium' : 'low',
  };
}
function fallbackStory(rec: string, findings: Finding[]) {
  return {
    situation: 'A retailer’s returns costs were up 30% and leadership wanted a quick fix.',
    task: 'As the BA, I had to find the real problem before anyone committed to building.',
    action: `I interviewed six stakeholders, separated signal from noise, and captured ${findings.length} source-linked findings instead of accepting the loudest request.`,
    result: `I recommended: "${rec}" — grounded in evidence, not opinion.`,
    lessons: 'The first solution offered is rarely the right one; behavioural evidence beats stated preference.',
  };
}
