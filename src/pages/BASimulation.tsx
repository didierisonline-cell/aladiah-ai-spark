// =============================================================================
// BA Simulation 1 — "Aurora Retail: The Returns Problem".
// Increment 1: the discovery briefing — renders the scenario, stakeholders,
// 8-phase roadmap, seeded inputs, scoring rubric, and compliance constraint.
// The interactive discovery engine (AI personas, evidence board, scoring,
// portfolio output) lands in subsequent increments against the ba-simulation
// edge function + ba_simulation tables. Mirrors ScrumSimulation.tsx.
// =============================================================================
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Inbox, FileText, Scale, BarChart3, Users, Map, ShieldCheck, Sparkles } from 'lucide-react';
import {
  BA_SCENARIO, BA_PERSONAS, BA_PHASES, BA_SCORING, BA_INBOX, BA_NOTES,
  BA_REQUIREMENTS, BA_EVIDENCE, BA_COMPLIANCE_CONSTRAINT, BA_PASS_SCORE, BA_DISTINCTION_SCORE,
} from '@/components/simulation/ba/BASimulationTypes';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-border/40 bg-card/60 p-5 ${className}`}>{children}</div>
);

const SectionTitle = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon className="w-4 h-4 text-secondary" />
    <h2 className="text-sm font-bold uppercase tracking-wide text-foreground/80">{children}</h2>
  </div>
);

export default function BASimulation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B111E] text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <button onClick={() => navigate('/portal/simulations')} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Simulations
        </button>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">BA Simulation 1 · {BA_SCENARIO.company}</div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">{BA_SCENARIO.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Your role: <span className="text-foreground font-semibold">{BA_SCENARIO.role}</span> · Sponsor: {BA_SCENARIO.sponsor}</p>
        </div>

        {/* Brief */}
        <Card>
          <SectionTitle icon={FileText}>Sponsor brief</SectionTitle>
          <p className="text-[15px] leading-relaxed text-foreground/90">{BA_SCENARIO.brief}</p>
        </Card>

        {/* Stakeholders */}
        <Card>
          <SectionTitle icon={Users}>Stakeholders</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {BA_PERSONAS.map(p => (
              <div key={p.name} className="flex gap-3 rounded-xl border border-border/30 bg-background/40 p-3">
                <div className="text-2xl leading-none">{p.avatar}</div>
                <div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground mb-1">{p.role}</div>
                  <div className="text-xs text-foreground/80">“{p.statedGoal}”</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Each stakeholder has their own goals — and some have agendas they won’t volunteer. Ask well.</p>
        </Card>

        {/* Inputs grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <SectionTitle icon={Inbox}>Inbox</SectionTitle>
            <div className="space-y-2">
              {BA_INBOX.map(m => (
                <div key={m.id} className="rounded-lg border border-border/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{m.from}</span>
                    <span className="text-[10px] uppercase text-muted-foreground">{m.priority}</span>
                  </div>
                  <div className="text-xs text-foreground/70 font-medium">{m.subject}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.body}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle icon={FileText}>Notes &amp; floating requirements</SectionTitle>
            <div className="space-y-2 mb-3">
              {BA_NOTES.map(n => (
                <div key={n.id} className="text-xs">
                  <span className="text-foreground/80">{n.text}</span>
                  <span className="text-muted-foreground"> — {n.source} </span>
                  <span className={n.reliability === 'contradictory' ? 'text-destructive' : 'text-muted-foreground'}>[{n.reliability}]</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {BA_REQUIREMENTS.map(r => (
                <div key={r.id} className="text-xs">
                  <span className="text-foreground/90">• {r.text}</span>
                  <span className="text-muted-foreground"> ({r.raisedBy}) — ⚠ {r.tension}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Evidence + compliance */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <SectionTitle icon={BarChart3}>Evidence pack</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {BA_EVIDENCE.map(e => (
                <div key={e.id} className="rounded-lg border border-border/30 p-3">
                  <div className="text-lg font-bold text-secondary">{e.value}</div>
                  <div className="text-xs font-medium">{e.label}</div>
                  <div className="text-[11px] text-muted-foreground">{e.note}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle icon={Scale}>Compliance constraint</SectionTitle>
            <p className="text-[13px] leading-relaxed text-foreground/85">{BA_COMPLIANCE_CONSTRAINT}</p>
          </Card>
        </div>

        {/* Phases */}
        <Card>
          <SectionTitle icon={Map}>Your discovery path (8 phases)</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-2">
            {BA_PHASES.map((ph, i) => (
              <div key={ph.id} className="flex gap-3 rounded-lg border border-border/30 p-3">
                <div className="text-secondary font-bold text-sm">{i + 1}</div>
                <div>
                  <div className="text-sm font-semibold">{ph.name}</div>
                  <div className="text-xs text-muted-foreground">{ph.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Scoring */}
        <Card>
          <SectionTitle icon={ShieldCheck}>How you’re scored</SectionTitle>
          <div className="space-y-1.5">
            {BA_SCORING.map(s => (
              <div key={s.key} className="flex items-center gap-3">
                <div className="w-48 text-xs">{s.label}</div>
                <div className="flex-1 h-2 rounded-full bg-background/60 overflow-hidden">
                  <div className="h-full bg-secondary/70" style={{ width: `${s.weight}%` }} />
                </div>
                <div className="w-8 text-right text-xs text-muted-foreground">{s.weight}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Pass ≥ {BA_PASS_SCORE} · Distinction ≥ {BA_DISTINCTION_SCORE}. There is no single answer key — you’re scored on evidence-based reasoning. Completing the engagement produces your <span className="text-foreground/80">Executive Discovery Report</span> (Portfolio Artifact #1).</p>
        </Card>

        {/* CTA — interactive engine is the next increment */}
        <div className="flex items-center justify-between rounded-2xl border border-secondary/30 bg-secondary/5 p-5">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Sparkles className="w-4 h-4 text-secondary" />
            Interactive discovery (AI stakeholder interviews, evidence board, live scoring) is being wired next.
          </div>
          <button disabled className="px-5 py-2.5 rounded-xl bg-secondary/30 text-foreground/60 text-sm font-semibold cursor-not-allowed">
            Begin Discovery — soon
          </button>
        </div>
      </div>
    </div>
  );
}
