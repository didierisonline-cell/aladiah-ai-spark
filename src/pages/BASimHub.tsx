// =============================================================================
// BA Flagship Simulation Hub — the entry point for the validated engine.
// Sims 1–3 share one engine (ba-simulation edge function + persistence +
// SimResult): a learner discovers the real problem (Sim 1), defends the
// recommendation to a board (Sim 2), then resolves conflicting requirements
// into a governed decision (Sim 3). This page makes the series discoverable
// and is the surface the founder tests against. Sims 4–10 are not built yet.
// =============================================================================
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Gavel, GitMerge, ArrowRight } from 'lucide-react';

interface SimEntry {
  n: number; route: string; title: string; icon: any;
  premise: string; outcome: string; artifact: string;
}
const SIMS: SimEntry[] = [
  {
    n: 1, route: '/simulation/ba-discovery', title: 'Discovery Engagement', icon: Search,
    premise: 'Interview six stakeholders, separate signal from noise, and find the real returns problem at Aurora Retail.',
    outcome: 'Discovery Quality Score', artifact: 'Executive Discovery Report',
  },
  {
    n: 2, route: '/simulation/ba-steering', title: 'Executive Steering Committee', icon: Gavel,
    premise: 'Defend your recommendation to a five-person board — CEO, CFO, COO, Product, and Risk — each with their own objections.',
    outcome: 'Executive Recommendation Defense Score', artifact: 'Board Recommendation Deck',
  },
  {
    n: 3, route: '/simulation/ba-conflict', title: 'Conflicting Requirements Crisis', icon: GitMerge,
    premise: 'Four teams pull toward speed, cost, quality, and risk against a fixed date. Negotiate trade-offs into one governed decision.',
    outcome: 'Requirements Resolution Score', artifact: 'Conflict Resolution Package',
  },
];

export default function BASimHub() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0B111E] text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <button onClick={() => navigate('/portal/simulations')} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Simulations
        </button>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">AI Business Analyst · Flagship Simulations</div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">The Aurora Retail Series</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            One company, one problem, three pressure tests of the same competency. Discover the real problem, defend the
            recommendation to the board, then resolve the conflict it triggers. Each simulation produces a portfolio artifact
            and an interview-ready story you can put in front of a hiring manager.
          </p>
        </div>

        <div className="space-y-3">
          {SIMS.map(s => (
            <button key={s.n} onClick={() => navigate(s.route)}
              className="w-full text-left rounded-2xl border border-border/40 bg-card/60 p-5 hover:border-secondary/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary shrink-0">
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-secondary mb-0.5">Sim {s.n}</div>
                  <div className="text-lg font-display font-bold">{s.title}</div>
                  <p className="text-sm text-foreground/80 mt-1">{s.premise}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-[11px] rounded-full border border-border/40 px-2.5 py-0.5 text-muted-foreground">Outcome: <span className="text-foreground/80">{s.outcome}</span></span>
                    <span className="text-[11px] rounded-full border border-secondary/40 px-2.5 py-0.5 text-secondary">Artifact: {s.artifact}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          More simulations in this program are in development. These three validate that the simulation engine generalizes
          across discovery, executive defense, and conflict-resolution scenarios.
        </p>
      </div>
    </div>
  );
}
