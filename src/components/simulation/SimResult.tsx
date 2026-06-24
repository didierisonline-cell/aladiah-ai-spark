// =============================================================================
// SimResult — shared result screen for Aladiah simulations (engine reuse).
// Renders the grade, Simulation Readiness Score, the N-dimension rubric, the
// generated portfolio artifact (any shape), and the STAR interview story. Used by
// Sim 2 (Steering Committee) and Sim 3 (Conflicting Requirements) on top of the
// Sim 1 engine — proof the engine generalizes across simulation types.
// =============================================================================
import { Sparkles, FileText, Briefcase, RotateCcw } from 'lucide-react';

const gradeFor = (s: number) => (s >= 90 ? 'A' : s >= 80 ? 'B' : s >= 70 ? 'C' : s >= 60 ? 'D' : 'F');

function renderValue(v: any): React.ReactNode {
  if (Array.isArray(v)) return <ul className="list-disc ml-5 text-foreground/85">{v.map((x, i) => <li key={i}>{typeof x === 'string' ? x : JSON.stringify(x)}</li>)}</ul>;
  if (v && typeof v === 'object') return <span className="text-foreground/85">{Object.entries(v).map(([k, val]) => `${k}: ${val}`).join(' · ')}</span>;
  return <span className="text-foreground/85">{String(v)}</span>;
}

export default function SimResult(props: {
  rubric: { key: string; label: string }[];
  dims: Record<string, number>;
  total: number;
  readiness: number;
  feedback: string;
  busy: boolean;
  saved: boolean;
  artifactLabel: string;
  artifact: Record<string, any> | null;
  story: { situation: string; task: string; action: string; result: string; lessons: string } | null;
  onRestart: () => void;
  onExit: () => void;
}) {
  const { rubric, dims, total, readiness, feedback, busy, saved, artifactLabel, artifact, story } = props;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-1">Simulation complete</div>
        <div className="text-5xl font-display font-bold">{gradeFor(total)}</div>
        <div className="text-sm text-muted-foreground">Score {total}/100 {total >= 80 ? '· Pass' : '· Below pass (80)'}{busy ? ' · refining with AI…' : ''}</div>
        <div className="mt-2 inline-flex items-center gap-2 text-xs rounded-full border border-border/40 px-3 py-1">
          <span className="text-muted-foreground">Simulation Readiness (v1)</span>
          <span className="font-bold text-secondary">{readiness}/100</span>
        </div>
        {!busy && <div className="text-[11px] text-muted-foreground mt-1">{saved ? '✓ Engagement saved to your record' : 'Not saved (sign in + apply migration to persist)'}</div>}
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
        <div className="text-xs font-bold uppercase tracking-wide text-foreground/70 mb-3">Rubric</div>
        <div className="space-y-1.5">
          {rubric.map(d => (
            <div key={d.key} className="flex items-center gap-3">
              <div className="w-56 text-xs">{d.label}</div>
              <div className="flex-1 h-2 rounded-full bg-background/60 overflow-hidden"><div className="h-full bg-secondary/70" style={{ width: `${dims[d.key] ?? 0}%` }} /></div>
              <div className="w-8 text-right text-xs text-muted-foreground">{dims[d.key] ?? 0}</div>
            </div>
          ))}
        </div>
        {feedback && <p className="text-sm text-foreground/80 mt-3"><Sparkles className="w-3.5 h-3.5 text-secondary inline mr-1" />{feedback}</p>}
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">{artifactLabel}</span>
          <span className="ml-auto text-[10px] rounded-full border border-secondary/40 text-secondary px-2 py-0.5">Hiring-manager ready ✓</span>
        </div>
        {artifact ? (
          <div className="space-y-1.5 text-sm">
            {Object.entries(artifact).map(([k, v]) => (
              <div key={k}><span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}: </span>{renderValue(v)}</div>
            ))}
          </div>
        ) : <p className="text-xs text-muted-foreground">Generating…</p>}
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">Interview Story (STAR)</span>
          <span className="ml-auto text-[10px] rounded-full border border-secondary/40 text-secondary px-2 py-0.5">Tell this in an interview ✓</span>
        </div>
        {story ? (
          <div className="space-y-1.5 text-sm">
            {(['situation', 'task', 'action', 'result', 'lessons'] as const).map(k => (
              <p key={k}><span className="text-secondary capitalize font-semibold">{k}: </span><span className="text-foreground/85">{story[k]}</span></p>
            ))}
          </div>
        ) : <p className="text-xs text-muted-foreground">Generating…</p>}
      </div>

      <div className="flex gap-3">
        <button onClick={props.onRestart} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 text-sm"><RotateCcw className="w-4 h-4" /> Run again</button>
        <button onClick={props.onExit} className="px-4 py-2 rounded-lg bg-secondary text-background text-sm font-semibold">Finish</button>
      </div>
    </div>
  );
}
