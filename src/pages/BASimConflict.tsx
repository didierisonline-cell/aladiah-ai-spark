// =============================================================================
// BA Simulation 3 — Conflicting Requirements Crisis.
// Four stakeholders pull in incompatible directions (speed/cost/quality/risk).
// The learner must (1) identify the real conflicts, (2) negotiate explicit
// trade-offs, and (3) produce a decision record. Reuses the Sim 1 engine
// (ba-simulation edge function actions + persistence + SimResult). Outcome:
// Requirements Resolution Score. Artifact: Conflict Resolution Package.
// Graceful AI fallback — fully playable without the function deployed.
// =============================================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GitMerge } from 'lucide-react';
import { baSim } from '@/components/simulation/ba/baSimClient';
import { saveEngagement, readinessScore } from '@/components/simulation/ba/baSimPersist';
import SimResult from '@/components/simulation/SimResult';

const SCENARIO =
  'Aurora is shipping the new cross-channel returns flow. Four teams want it built four different ways, and the launch date is fixed. You must resolve the conflict into one governed decision.';

// The four stakeholders, each optimising a different objective. `pulls` is what
// they demand; `concedes` is the trade they can live with if asked well.
interface Stakeholder { name: string; role: string; avatar: string; objective: string; demand: string; concedes: string; dim: string; cues: string[] }
const STAKEHOLDERS: Stakeholder[] = [
  { name: 'Devin Park', role: 'Product', avatar: '🧭', objective: 'speed', dim: 'tradeoff_quality',
    demand: 'Ship the full auto-refund experience by launch — speed wins us the season.',
    concedes: 'Will accept a phased launch if the core cross-channel flow ships on time.',
    cues: ['phase', 'mvp', 'scope', 'sequence', 'launch', 'core first', 'later'] },
  { name: 'Sofia Marchetti', role: 'Operations', avatar: '⚙️', objective: 'cost', dim: 'feasibility',
    demand: 'Keep operational cost flat — no new headcount, no manual review queue.',
    concedes: 'Will fund a small review queue if it is time-bounded and auto-refunds are confidence-scored.',
    cues: ['cost', 'automat', 'queue', 'headcount', 'confidence', 'threshold', 'manual'] },
  { name: 'Hannah Cole', role: 'Compliance', avatar: '🛡️', objective: 'risk', dim: 'risk_treatment',
    demand: 'No auto-refund without fraud controls and a bounded data-retention policy.',
    concedes: 'Will approve auto-refunds below a risk threshold with a full audit trail and time-bounded retention.',
    cues: ['fraud', 'control', 'audit', 'retention', 'threshold', 'risk', 'complian', 'privacy'] },
  { name: 'Tunde Familusi', role: 'Engineering', avatar: '🛠️', objective: 'quality',
    dim: 'conflict_identification',
    demand: 'Do not ship on top of the brittle legacy integration — we need to rebuild it properly.',
    concedes: 'Will ship on a thin, well-tested integration layer now and harden it in a fast-follow.',
    cues: ['integration', 'test', 'tech debt', 'fast-follow', 'thin', 'layer', 'harden', 'quality'] },
];

// Requirements Resolution rubric (6 dimensions).
const RUBRIC = [
  { key: 'conflict_identification', label: 'Conflict identification' },
  { key: 'tradeoff_quality', label: 'Trade-off quality' },
  { key: 'feasibility', label: 'Feasibility' },
  { key: 'risk_treatment', label: 'Risk treatment' },
  { key: 'stakeholder_balance', label: 'Stakeholder balance' },
  { key: 'decision_clarity', label: 'Decision clarity' },
];

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const scoreText = (text: string, cues: string[]) => {
  if (!text.trim()) return 0;
  const t = text.toLowerCase();
  const hits = cues.filter(c => t.includes(c)).length;
  return clamp(36 + Math.min(40, text.trim().split(/\s+/).length * 2) * 0.5 + hits * 12);
};

export default function BASimConflict() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'brief' | 'resolve' | 'result'>('brief');
  // Per-stakeholder negotiated resolution, plus a final decision record.
  const [resolutions, setResolutions] = useState<Record<string, string>>({});
  const [decision, setDecision] = useState('');
  const [gen, setGen] = useState<any>(null);

  const answered = STAKEHOLDERS.filter(s => (resolutions[s.name] || '').trim()).length;
  const ready = answered === STAKEHOLDERS.length && decision.trim().length > 0;

  function submit() {
    setPhase('result');
    const perStake = STAKEHOLDERS.map(s => ({ s, v: scoreText(resolutions[s.name] || '', s.cues) }));
    const dimOf = (k: string) => perStake.find(x => x.s.dim === k)?.v ?? 0;
    // Stakeholder balance rewards treating all four fairly (low variance, all answered).
    const vals = perStake.map(x => x.v);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const spread = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length);
    const stakeholder_balance = clamp(mean - spread * 0.6);
    const decision_clarity = scoreText(decision, ['decide', 'because', 'trade', 'we will', 'accept', 'reject', 'owner', 'date', 'risk']);
    const baseDims: Record<string, number> = {
      conflict_identification: dimOf('conflict_identification'),
      tradeoff_quality: dimOf('tradeoff_quality'),
      feasibility: dimOf('feasibility'),
      risk_treatment: dimOf('risk_treatment'),
      stakeholder_balance,
      decision_clarity,
    };
    const total = clamp(Object.values(baseDims).reduce((a, b) => a + b, 0) / 6);
    const recommendation = decision.trim();
    const context = `Conflicting requirements crisis at Aurora Retail Group. ${SCENARIO}\n` +
      STAKEHOLDERS.map(s => `${s.role} (${s.name}) optimises ${s.objective}. Demand: "${s.demand}". The analyst's resolution: "${resolutions[s.name] || '(none)'}".`).join('\n') +
      `\nFinal decision record: "${recommendation || '(none)'}".`;
    const messages = STAKEHOLDERS.flatMap(s => [
      { role: 'persona', speaker: `${s.name} (${s.role})`, content: s.demand },
      { role: 'user', speaker: 'BA', content: resolutions[s.name] || '' },
    ]).concat([{ role: 'user', speaker: 'BA', content: `Decision record: ${recommendation}` }]);

    setGen({ busy: true, dims: baseDims, total, readiness: 0, feedback: '', artifact: null, story: null, saved: false });
    (async () => {
      const [ev, art, st] = await Promise.all([
        baSim.evaluate({ simName: 'Conflicting Requirements Crisis', rubric: RUBRIC, context }),
        baSim.artifact({
          artifactType: 'Conflict Resolution Package',
          context,
          shape: '{"conflicts":[string],"tradeoffs":[string],"decision":string,"rationale":string,"who_gives_what":[string],"risks_controlled":[string],"owner_and_date":string}',
        }),
        baSim.story({ company: 'Aurora Retail Group', title: 'Conflicting Requirements Crisis', findings: [], recommendation }),
      ]);
      const dims = ev?.dimensions || baseDims;
      const tot = ev?.total ?? total;
      const artifact = art || fallbackPackage(recommendation);
      const story = st || fallbackStory();
      const readiness = readinessScore({
        total: tot,
        reportComplete: !!artifact?.decision,
        storyComplete: !!story?.result,
        competencyProxy: clamp((dims.conflict_identification + dims.tradeoff_quality) / 2),
      });
      setGen({
        busy: false, dims, total: tot, readiness,
        feedback: ev?.feedback || 'Scored on whether you surfaced the real conflicts, negotiated explicit trade-offs each side could accept, treated risk, and landed one clear, owned decision.',
        artifact, story, saved: false,
      });
      const id = await saveEngagement({
        scenarioId: 'aurora-conflict', total: tot,
        grade: tot >= 90 ? 'A' : tot >= 80 ? 'B' : tot >= 70 ? 'C' : tot >= 60 ? 'D' : 'F',
        readiness, recommendation, report: artifact, story, dims, messages, findings: [],
      });
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
          <GitMerge className="w-5 h-5 text-secondary" />
          <h1 className="text-2xl font-display font-bold">Sim 3 — Conflicting Requirements Crisis</h1>
        </div>

        {phase === 'brief' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/40 bg-card/60 p-5">
              <p className="text-sm text-foreground/90">{SCENARIO}</p>
              <p className="text-sm text-foreground/70 mt-2">Four teams each optimise a different objective — <span className="text-secondary font-semibold">speed, cost, risk, and quality</span>. They cannot all win. Your job is not to please everyone; it is to negotiate explicit trade-offs and land <span className="text-secondary font-semibold">one governed decision</span> the room can live with.</p>
            </div>
            <button onClick={() => setPhase('resolve')} className="px-5 py-2.5 rounded-xl bg-secondary text-background text-sm font-semibold">Open the war room →</button>
          </div>
        )}

        {phase === 'resolve' && (
          <div className="space-y-3">
            {STAKEHOLDERS.map(s => (
              <div key={s.name} className="rounded-2xl border border-border/40 bg-card/60 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{s.avatar}</span>
                  <div>
                    <div className="text-sm font-semibold">{s.name} · {s.role} <span className="text-[10px] uppercase tracking-wide text-secondary ml-1">optimises {s.objective}</span></div>
                    <div className="text-[11px] text-muted-foreground">Can concede: {s.concedes}</div>
                  </div>
                </div>
                <p className="text-sm text-foreground/85 mb-2">❝ {s.demand}</p>
                <textarea value={resolutions[s.name] || ''} onChange={e => setResolutions(r => ({ ...r, [s.name]: e.target.value }))}
                  placeholder="What trade-off do you ask this person to accept, and what do they get in return?" rows={2}
                  className="w-full text-sm bg-background/60 border border-border/40 rounded-lg px-3 py-2 outline-none focus:border-secondary/60" />
              </div>
            ))}
            <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-secondary mb-2">Decision record</div>
              <textarea value={decision} onChange={e => setDecision(e.target.value)}
                placeholder="State the single decision: what we will do, what we are trading off and why, who owns it, and by when." rows={3}
                className="w-full text-sm bg-background/60 border border-border/40 rounded-lg px-3 py-2 outline-none focus:border-secondary/60" />
            </div>
            <button onClick={submit} disabled={!ready}
              className="px-5 py-2.5 rounded-xl bg-secondary text-background text-sm font-semibold disabled:opacity-40">
              Resolve the conflict {!ready ? `(${answered}/${STAKEHOLDERS.length} negotiated${decision.trim() ? '' : ' · decision needed'})` : ''}
            </button>
          </div>
        )}

        {phase === 'result' && gen && (
          <SimResult rubric={RUBRIC} dims={gen.dims} total={gen.total} readiness={gen.readiness} feedback={gen.feedback}
            busy={gen.busy} saved={gen.saved} artifactLabel="Conflict Resolution Package" artifact={gen.artifact} story={gen.story}
            onRestart={() => { setPhase('resolve'); setResolutions({}); setDecision(''); setGen(null); }} onExit={() => navigate('/portal/simulations')} />
        )}
      </div>
    </div>
  );
}

function fallbackPackage(decision: string) {
  return {
    conflicts: [
      'Product wants full scope at launch; Engineering says the legacy integration is too brittle to build on.',
      'Operations wants flat cost (no manual review); Compliance requires fraud controls and audit before any auto-refund.',
    ],
    tradeoffs: [
      'Phase the launch: core cross-channel flow ships on the fixed date; full auto-refund experience follows.',
      'Auto-refund only below a risk threshold, on a thin tested integration layer, with a small time-bounded review queue.',
    ],
    decision: decision || 'Ship the core cross-channel returns flow on date on a thin, tested integration layer; enable confidence-scored auto-refunds below a risk threshold with audit trail and time-bounded retention; harden the integration in a fast-follow.',
    rationale: 'It hits the fixed date (speed), avoids new standing headcount (cost), keeps auto-refunds inside fraud/retention controls (risk), and refuses to build on brittle code (quality).',
    who_gives_what: [
      'Product concedes full-scope-at-launch, gets the core flow on date.',
      'Operations funds a small time-bounded review queue, gets confidence-scored automation.',
      'Compliance approves bounded auto-refunds, gets thresholds, audit trail, and retention limits.',
      'Engineering ships on a thin layer now, gets a committed fast-follow to harden the integration.',
    ],
    risks_controlled: ['Fraud (risk-threshold + confidence scoring)', 'Audit (full trail preserved)', 'Data retention (time-bounded)', 'Tech debt (fast-follow committed)'],
    owner_and_date: 'BA owns the decision record; Product owns the phased launch; review at the fast-follow checkpoint.',
  };
}
function fallbackStory() {
  return {
    situation: 'Four Aurora teams demanded four incompatible versions of the returns launch against a fixed date.',
    task: 'Resolve the conflict into one decision the room could live with — without quietly picking a winner.',
    action: 'I named the real conflicts, then negotiated an explicit trade with each side: a phased launch, a thin tested integration layer, confidence-scored auto-refunds below a risk threshold, and a time-bounded review queue — each team conceding one thing and gaining another.',
    result: 'I landed a governed, owned decision record that hit the date inside fraud and retention controls.',
    lessons: 'Conflicting requirements are not resolved by compromise averages — they are resolved by making each trade-off explicit and owned.',
  };
}
