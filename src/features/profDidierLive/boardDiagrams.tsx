// Built-in, deterministic whiteboard diagrams for the Professor Didier LIVE class.
// No API key, no network: every lesson gets a real diagram on the board instantly.
// Core Scrum concepts are matched by keyword to a curated diagram + talking points;
// anything unmatched falls back to a clean "key ideas" board parsed from the lesson
// text. The AI (generate-visuals) path, when enabled, layers richer SVGs on top.
import type { OverlayLesson } from "./ProfessorLiveOverlay";

export type DiagramSpec =
  | { kind: "flow"; caption?: string; nodes: string[]; loop?: boolean }
  | { kind: "cards"; caption?: string; cards: { label: string; sub?: string }[] }
  | { kind: "pairs"; caption?: string; arrow?: string; pairs: { a: string; b: string }[] }
  | { kind: "cycle"; caption?: string; nodes: string[] }
  | { kind: "points"; caption?: string; points: string[] };

export interface BoardModel {
  headline: string;
  definition?: string;
  keyPoints: string[];
  diagram: DiagramSpec;
  concept: string;
}

interface Concept {
  id: string;
  test: RegExp;
  definition: string;
  diagram: DiagramSpec;
  points: string[];
}

// Order matters: more specific concepts first so "sprint planning" resolves to the
// events diagram, while a lesson literally titled "The Sprint" resolves to the cycle.
const CONCEPTS: Concept[] = [
  {
    id: "framework",
    test: /(what is scrum|scrum framework|intro(duction)? to scrum|scrum overview|scrum basics|scrum in a nutshell|agile framework|scrum 101|getting started with scrum|foundations of scrum)/,
    definition:
      "Scrum is a lightweight framework that helps teams deliver value in short, fixed cycles called Sprints, using empirical (inspect-and-adapt) process control.",
    diagram: {
      kind: "flow",
      caption: "The Scrum flow — one Sprint",
      nodes: ["Product Backlog", "Sprint Planning", "Sprint Backlog", "Daily Scrum ↻", "Increment", "Sprint Review", "Retrospective"],
      loop: true,
    },
    points: [
      "Work happens in Sprints — short, fixed cycles of 2–4 weeks.",
      "Three accountabilities: Product Owner, Scrum Master, Developers.",
      "Five events create rhythm and regular inspection points.",
      "Three artifacts make the work and progress transparent.",
    ],
  },
  {
    id: "roles",
    test: /(role|accountabilit|scrum team|product owner|scrum master|develop(er|ment team)|who does what|team structure|responsibilit)/,
    definition:
      "The Scrum Team has three accountabilities and no sub-teams or hierarchy — one team, focused on one Product Goal.",
    diagram: {
      kind: "cards",
      caption: "The three accountabilities",
      cards: [
        { label: "Product Owner", sub: "Maximizes value · owns the Product Backlog" },
        { label: "Scrum Master", sub: "Coaches the team · removes impediments" },
        { label: "Developers", sub: "Build the Increment · own the how" },
      ],
    },
    points: [
      "Product Owner orders the Backlog to maximize value.",
      "Scrum Master serves the team and ensures Scrum is understood.",
      "Developers create a usable Increment every Sprint.",
      "One team, one Product Goal — no hierarchy.",
    ],
  },
  {
    id: "events",
    test: /(event|ceremon|sprint planning|daily scrum|stand[- ]?up|sprint review|retrospective|inspect and adapt)/,
    definition:
      "Scrum has five events. The Sprint is a container for the other four — each a formal opportunity to inspect and adapt.",
    diagram: {
      kind: "flow",
      caption: "Events within a Sprint",
      nodes: ["Sprint Planning", "Daily Scrum ↻", "Development Work", "Sprint Review", "Retrospective"],
    },
    points: [
      "Sprint: the container event (2–4 weeks).",
      "Sprint Planning: agree the Sprint Goal and the plan.",
      "Daily Scrum: a 15-minute daily re-plan by the Developers.",
      "Sprint Review: inspect the Increment with stakeholders.",
      "Retrospective: improve how the team works together.",
    ],
  },
  {
    id: "artifacts",
    test: /(artifact|product backlog|sprint backlog|increment|definition of done|\bdod\b|product goal|sprint goal|commitment)/,
    definition:
      "Scrum has three artifacts, each with a commitment that gives it focus and makes progress transparent.",
    diagram: {
      kind: "pairs",
      caption: "Each artifact → its commitment",
      arrow: "→",
      pairs: [
        { a: "Product Backlog", b: "Product Goal" },
        { a: "Sprint Backlog", b: "Sprint Goal" },
        { a: "Increment", b: "Definition of Done" },
      ],
    },
    points: [
      "Product Backlog is committed to the Product Goal.",
      "Sprint Backlog is committed to the Sprint Goal.",
      "Increment is committed to the Definition of Done.",
      "Commitments make progress toward value transparent.",
    ],
  },
  {
    id: "values",
    test: /(scrum value|five value|values of scrum|courage|\brespect\b|openness|\bfocus\b(?!.*sprint))/,
    definition: "Five values make the Scrum pillars come alive. When the team embodies them, trust grows.",
    diagram: {
      kind: "cards",
      caption: "The five Scrum Values",
      cards: [
        { label: "Commitment" },
        { label: "Focus" },
        { label: "Openness" },
        { label: "Respect" },
        { label: "Courage" },
      ],
    },
    points: [
      "Commitment — to the team and the goal.",
      "Focus — on the work of the Sprint.",
      "Openness — about the work and its challenges.",
      "Respect — for each other's skills and independence.",
      "Courage — to do the right thing and tackle hard problems.",
    ],
  },
  {
    id: "pillars",
    test: /(pillar|empiric|transparency|inspection|adaptation)/,
    definition: "Empiricism rests on three pillars — decisions are made from what is actually observed.",
    diagram: {
      kind: "cards",
      caption: "The three empirical pillars",
      cards: [
        { label: "Transparency", sub: "Make the work visible" },
        { label: "Inspection", sub: "Check progress often" },
        { label: "Adaptation", sub: "Adjust as soon as you learn" },
      ],
    },
    points: [
      "Transparency: a shared standard so everyone sees the same reality.",
      "Inspection: frequent checks of progress toward the goal.",
      "Adaptation: adjust the moment you learn something new.",
      "Together they enable empirical process control.",
    ],
  },
  {
    id: "sprint",
    test: /(the sprint\b|sprint cycle|sprint length|time[- ]?box|timeboxing)/,
    definition:
      "The Sprint is a fixed-length cycle (2–4 weeks) — a container for all work and events that produces at least one usable Increment.",
    diagram: {
      kind: "cycle",
      caption: "The Sprint cycle (repeats)",
      nodes: ["Plan", "Build", "Daily Scrum", "Review", "Retrospect"],
    },
    points: [
      "Fixed length — no changes that endanger the Sprint Goal.",
      "A new Sprint begins immediately after the last one ends.",
      "Delivers at least one usable Increment.",
      "Scope can be renegotiated as more is learned.",
    ],
  },
];

function tidy(text: string): string {
  return (text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function sentences(text: string): string[] {
  return tidy(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 24 && s.length <= 220);
}

function shorten(s: string, n = 7): string {
  const words = s.replace(/[.!?]+$/, "").split(" ");
  return words.length <= n ? words.join(" ") : words.slice(0, n).join(" ") + "…";
}

// Turn any lesson into a structured board model with a real diagram.
export function deriveBoard(lesson: OverlayLesson | undefined): BoardModel {
  if (!lesson) {
    return { headline: "Class", keyPoints: [], diagram: { kind: "flow", nodes: ["Concept", "Example", "Practice", "Mastery"] }, concept: "generic" };
  }
  const headline = lesson.board?.headline || lesson.title;
  const defText = lesson.board?.definition || lesson.focus || "";
  const hay = `${lesson.title} ${lesson.focus} ${lesson.board?.definition || ""}`.toLowerCase();
  const concept = CONCEPTS.find((c) => c.test.test(hay));

  if (concept) {
    return {
      headline,
      definition: concept.definition,
      keyPoints: concept.points,
      diagram: concept.diagram,
      concept: concept.id,
    };
  }

  // Generic lesson → parse the real text into a clean "key ideas" board.
  const parsed = sentences(defText);
  const points = (parsed.length ? parsed : lesson.board?.points || []).slice(0, 5);
  const definition = parsed[0] || tidy(defText).slice(0, 200) || undefined;

  const diagram: DiagramSpec =
    points.length >= 2
      ? { kind: "points", caption: "Key ideas in this lesson", points: points.map((p) => shorten(p, 9)) }
      : { kind: "flow", caption: `Learning path — ${shorten(headline, 6)}`, nodes: ["Concept", "Example", "Practice", "Mastery"] };

  return { headline, definition, keyPoints: points, diagram, concept: "generic" };
}

// Renders a BoardModel's diagram as styled HTML (scoped under .pd-live-root).
export function BoardDiagram({ spec }: { spec: DiagramSpec }) {
  if (spec.kind === "flow") {
    return (
      <div className="pd-diagram pd-diag-flow">
        {spec.caption && <div className="pd-diag-caption">{spec.caption}</div>}
        <div className="pd-diag-flow-row">
          {spec.nodes.map((n, i) => (
            <div className="pd-diag-flow-item" key={`${n}-${i}`}>
              <span className="pd-diag-node">{n}</span>
              {i < spec.nodes.length - 1 && <span className="pd-diag-arrow" aria-hidden="true">→</span>}
            </div>
          ))}
        </div>
        {spec.loop && <div className="pd-diag-loop">↻ repeat each Sprint</div>}
      </div>
    );
  }

  if (spec.kind === "cards") {
    return (
      <div className="pd-diagram pd-diag-cards">
        {spec.caption && <div className="pd-diag-caption">{spec.caption}</div>}
        <div className="pd-diag-cards-row">
          {spec.cards.map((c) => (
            <div className="pd-diag-card" key={c.label}>
              <span className="pd-diag-card-label">{c.label}</span>
              {c.sub && <span className="pd-diag-card-sub">{c.sub}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (spec.kind === "pairs") {
    return (
      <div className="pd-diagram pd-diag-pairs">
        {spec.caption && <div className="pd-diag-caption">{spec.caption}</div>}
        <div className="pd-diag-pairs-list">
          {spec.pairs.map((p) => (
            <div className="pd-diag-pair" key={p.a}>
              <span className="pd-diag-node">{p.a}</span>
              <span className="pd-diag-arrow" aria-hidden="true">{spec.arrow || "→"}</span>
              <span className="pd-diag-node alt">{p.b}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (spec.kind === "cycle") {
    return (
      <div className="pd-diagram pd-diag-cycle">
        {spec.caption && <div className="pd-diag-caption">{spec.caption}</div>}
        <div className="pd-diag-cycle-row">
          {spec.nodes.map((n, i) => (
            <div className="pd-diag-flow-item" key={`${n}-${i}`}>
              <span className="pd-diag-chip">{n}</span>
              <span className="pd-diag-arrow" aria-hidden="true">{i < spec.nodes.length - 1 ? "→" : "↻"}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // points
  return (
    <div className="pd-diagram pd-diag-points">
      {spec.caption && <div className="pd-diag-caption">{spec.caption}</div>}
      <ul className="pd-diag-points-list">
        {spec.points.map((p, i) => (
          <li key={`${p}-${i}`}><span className="pd-diag-bullet">{i + 1}</span>{p}</li>
        ))}
      </ul>
    </div>
  );
}
