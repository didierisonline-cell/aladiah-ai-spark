// =============================================================================
// BA Simulation 2 — Executive Steering Committee.
// The learner defends the Aurora Returns transformation recommendation to a
// five-person board (CEO/CFO/COO/Product/Risk), each with different incentives,
// objections, and success criteria. Reuses the Sim 1 engine (ba-simulation edge
// function actions + persistence + SimResult). Outcome: Executive Recommendation
// Defense Score. Artifact: Board Recommendation Deck. Graceful AI fallback.
// =============================================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gavel } from 'lucide-react';
import { baSim } from '@/components/simulation/ba/baSimClient';
import { saveEngagement, readinessScore } from '@/components/simulation/ba/baSimPersist';
import SimResult from '@/components/simulation/SimResult';

const RECOMMENDATION = 'Fix refund-timing variance and integrate the cross-channel returns flow — with fraud-controlled auto-refunds for low-risk returns and compliant, time-bounded data retention.';

interface Board { name: string; role: string; avatar: string; objection: string; success: string; dim: string; cues: string[] }
const BOARD: Board[] = [
  { name: 'Elena Voss', role: 'CEO', avatar: '👑', dim: 'clarity', cues: ['strateg', 'why now', 'outcome', 'board', 'decision', 'customer'],
    objection: 'Why is THIS the right strategic bet right now, over everything else we could fund?', success: 'A clear, strategic why-now.' },
  { name: 'Ray Okonkwo', role: 'CFO', avatar: '📈', dim: 'financial_framing', cues: ['roi', 'payback', 'cost', 'npv', 'return', 'savings', 'delay'],
    objection: 'Show me the numbers. What is the ROI, the payback, and the cost of delay?', success: 'Credible, evidenced financials.' },
  { name: 'Sofia Marchetti', role: 'COO', avatar: '⚙️', dim: 'feasibility', cues: ['phased', 'pilot', 'operations', 'adoption', 'store', 'disrupt', 'feasib'],
    objection: 'How do we deliver this without disrupting stores and operations?', success: 'A feasible, low-disruption rollout.' },
  { name: 'Devin Park', role: 'Head of Product', avatar: '🧭', dim: 'evidence_use', cues: ['evidence', 'customer', 'outcome', 'validated', 'discovery', 'data', 'signal'],
    objection: 'How do you KNOW this is the real problem and not just the loudest opinion?', success: 'Evidence over opinion.' },
  { name: 'Hannah Cole', role: 'Chief Risk Officer', avatar: '🛡️', dim: 'risk_treatment', cues: ['risk', 'control', 'complian', 'mitigat', 'audit', 'fraud', 'retention', 'privacy'],
    objection: 'What are the risks, and how are you treating fraud, audit, and data-retention exposure?', success: 'Risks named and treated.' },
];
const RUBRIC = [
  { key: 'clarity', label: 'Strategic clarity' },
  { key: 'evidence_use', label: 'Evidence use' },
  { key: 'financial_framing', label: 'Financial framing' },
  { key: 'feasibility', label: 'Feasibility' },
  { key: 'risk_treatment', label: 'Risk treatment' },
  { key: 'objection_handling', label: 'Objection handling' },
];
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const scoreRebuttal = (text: string, cues: string[]) => {
  if (!text.trim()) return 0;
  const t = text.toLowerCase();
  const hits = cues.filter(c => t.includes(c)).length;
  return clamp(38 + Math.min(40, text.trim().split(/\s+/).length * 2) * 0.5 + hits * 12);
};

export default function BASimSteering() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'brief' | 'defend' | 'result'>('brief');
  const [rebuttals, setRebuttals] = useState<Record<string, string>>({});
  const [gen, setGen] = useState<any>(null);

  const answered = BOARD.filter(b => (rebuttals[b.name] || '').trim()).length;

  function submit() {
    setPhase('result');
    const perBoard = BOARD.map(b => ({ b, s: scoreRebuttal(rebuttals[b.name] || '', b.cues) }));
    const dimOf = (k: string) => perBoard.find(x => x.b.dim === k)?.s ?? 0;
    const objection_handling = clamp(perBoard.reduce((a, x) => a + x.s, 0) / perBoard.length);
    const baseDims: Record<string, number> = {
      clarity: dimOf('clarity'), evidence_use: dimOf('evidence_use'), financial_framing: dimOf('financial_framing'),
      feasibility: dimOf('feasibility'), risk_treatment: dimOf('risk_treatment'), objection_handling,
    };
    const total = clamp(Object.values(baseDims).reduce((a, b) => a + b, 0) / 6);
    const context = `Board defense. Recommendation: "${RECOMMENDATION}".\n` +
      BOARD.map(b => `${b.role} (${b.name}) objected: "${b.objection}". The analyst replied: "${rebuttals[b.name] || '(no answer)'}".`).join('\n');
    const messages = BOARD.flatMap(b => [
      { role: 'persona', speaker: `${b.name} (${b.role})`, content: b.objection },
      { role: 'user', speaker: 'BA', content: rebuttals[b.name] || '' },
    ]);
    setGen({ busy: true, dims: baseDims, total, readiness: 0, feedback: '', artifact: null, story: null, saved: false });
    (async () => {
      const [ev, art, st] = await Promise.all([
        baSim.evaluate({ simName: 'Executive Steering Committee', rubric: RUBRIC, context }),
        baSim.artifact({ artifactType: 'Board Recommendation Deck', context, shape: '{"recommendation":string,"why_now":string,"evidence":[string],"financials":string,"risks":[string],"ask":string}' }),
        baSim.story({ company: 'Aurora Retail Group', title: 'Executive Steering Committee', findings: [], recommendation: RECOMMENDATION }),
      ]);
      const dims = ev?.dimensions || baseDims;
      const tot = ev?.total ?? total;
      const artifact = art || fallbackDeck();
      const story = st || fallbackStory();
      const readiness = readinessScore({ total: tot, reportComplete: !!artifact?.recommendation, storyComplete: !!story?.result, competencyProxy: clamp((dims.evidence_use + dims.risk_treatment) / 2) });
      setGen({ busy: false, dims, total: tot, readiness, feedback: ev?.feedback || 'Defense scored on how well each objection was answered with evidence, numbers, feasibility, and risk treatment.', artifact, story, saved: false });
      const id = await saveEngagement({ scenarioId: 'aurora-steering', total: tot, grade: tot >= 90 ? 'A' : tot >= 80 ? 'B' : tot >= 70 ? 'C' : tot >= 60 ? 'D' : 'F', readiness, recommendation: RECOMMENDATION, report: artifact, story, dims, messages, findings: [] });
      setGen((g: any) => g ? { ...g, saved: !!id } : g);
    })();
  }

  return (
    <div className="min-h-screen bg-[#0B111E] text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-5">
        <button onClick={() => navigate('/portal/simulations')} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Simulations
        </button>
        <div className="flex items-center gap-2">
          <Gavel className="w-5 h-5 text-secondary" />
          <h1 className="text-2xl font-display font-bold">Sim 2 — Executive Steering Committee</h1>
        </div>

        {phase === 'brief' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/40 bg-card/60 p-5">
              <p className="text-sm text-foreground/90">You discovered the real returns problem. Now defend your recommendation to the board. Five executives — each with different incentives and objections — will challenge you. Answer each with evidence, numbers, feasibility, and risk treatment.</p>
              <p className="text-sm text-foreground/70 mt-2"><span className="text-secondary font-semibold">Your recommendation:</span> {RECOMMENDATION}</p>
            </div>
            <button onClick={() => setPhase('defend')} className="px-5 py-2.5 rounded-xl bg-secondary text-background text-sm font-semibold">Enter the boardroom →</button>
          </div>
        )}

        {phase === 'defend' && (
          <div className="space-y-3">
            {BOARD.map(b => (
              <div key={b.name} className="rounded-2xl border border-border/40 bg-card/60 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{b.avatar}</span>
                  <div><div className="text-sm font-semibold">{b.name} · {b.role}</div><div className="text-[11px] text-muted-foreground">Wants: {b.success}</div></div>
                </div>
                <p className="text-sm text-foreground/85 mb-2">❝ {b.objection}</p>
                <textarea value={rebuttals[b.name] || ''} onChange={e => setRebuttals(r => ({ ...r, [b.name]: e.target.value }))}
                  placeholder="Your response…" rows={2}
                  className="w-full text-sm bg-background/60 border border-border/40 rounded-lg px-3 py-2 outline-none focus:border-secondary/60" />
              </div>
            ))}
            <button onClick={submit} disabled={answered < BOARD.length}
              className="px-5 py-2.5 rounded-xl bg-secondary text-background text-sm font-semibold disabled:opacity-40">
              Submit defense {answered < BOARD.length ? `(${answered}/${BOARD.length} answered)` : ''}
            </button>
          </div>
        )}

        {phase === 'result' && gen && (
          <SimResult rubric={RUBRIC} dims={gen.dims} total={gen.total} readiness={gen.readiness} feedback={gen.feedback}
            busy={gen.busy} saved={gen.saved} artifactLabel="Board Recommendation Deck" artifact={gen.artifact} story={gen.story}
            onRestart={() => { setPhase('defend'); setRebuttals({}); setGen(null); }} onExit={() => navigate('/portal/simulations')} />
        )}
      </div>
    </div>
  );
}

function fallbackDeck() {
  return {
    recommendation: RECOMMENDATION,
    why_now: 'Returns cost is up 30% and customer complaints centre on refund-timing variance — the cost compounds every month we wait.',
    evidence: ['Refund-timing variance is the top complaint', '~48% of returns are cross-channel with no system integration', 'Finance requires a full audit trail; Legal caps data retention'],
    financials: 'Targeted fix vs a blanket rebuild; payback within ~2 quarters on reduced re-keying and support load.',
    risks: ['Fraud (mitigated by confidence-scored auto-refunds)', 'Audit trail (preserved)', 'Data retention (time-bounded, compliant)'],
    ask: 'Approve a phased pilot starting with the cross-channel flow.',
  };
}
function fallbackStory() {
  return {
    situation: 'I had to defend a returns-transformation recommendation to a skeptical executive board.',
    task: 'Win funding by answering each executive’s objection on their terms.',
    action: 'I addressed the CFO with ROI and cost-of-delay, the Risk Officer with fraud/audit/retention controls, the COO with a phased low-disruption rollout, and Product with the behavioural evidence.',
    result: 'I converted objections into a funded, governed plan.',
    lessons: 'Executives fund recommendations framed in their own currency — money, risk, feasibility, and evidence.',
  };
}
