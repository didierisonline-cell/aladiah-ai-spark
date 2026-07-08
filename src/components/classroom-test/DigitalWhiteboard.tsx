import {
  MousePointer2,
  Pencil,
  Shapes,
  Type,
  Square,
  Circle,
  Minus,
  Plus,
  Maximize2,
  Undo2,
  Trash2,
  RotateCw,
  MoveRight,
} from "lucide-react";
import { WHITEBOARD } from "./classroomData";

const TOOLS = [
  { icon: MousePointer2, active: false },
  { icon: Pencil, active: true },
  { icon: Shapes, active: false },
  { icon: Type, active: false },
  { icon: Square, active: false },
  { icon: RotateCw, active: false },
  { icon: Circle, active: false },
];

const SWATCHES = ["#ffffff", "#3b82f6", "#fbbf24", "#f472b6", "#c084fc"];

/** Split "Two\nLines" labels into stacked spans. */
function Label({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("\n").map((l, i) => (
        <span key={i} className="block leading-tight">
          {l}
        </span>
      ))}
    </span>
  );
}

function Arrow() {
  return <MoveRight className="mx-1 h-6 w-8 shrink-0 self-center text-white/35" strokeWidth={1.5} />;
}

/**
 * DigitalWhiteboard — the large dark board: marker-style title + definition and a
 * left-to-right Scrum flow diagram (Product Backlog → … → Sprint Retrospective).
 * Pure HTML/CSS/SVG. Drawing toolbar and zoom controls are UI-only.
 */
export default function DigitalWhiteboard() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b14] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_60px_-30px_rgba(0,0,0,0.9)]">
      {/* Left tool rail */}
      <div className="flex w-11 shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] bg-black/30 py-3">
        {TOOLS.map((t, i) => (
          <button
            key={i}
            className={`grid h-7 w-7 place-items-center rounded-md transition ${
              t.active
                ? "bg-violet-500/20 text-violet-200"
                : "text-white/45 hover:bg-white/[0.06] hover:text-white/80"
            }`}
          >
            <t.icon className="h-4 w-4" />
          </button>
        ))}
        <div className="my-1 h-px w-5 bg-white/10" />
        <button className="grid h-7 w-7 place-items-center rounded-md text-white/45 transition hover:bg-white/[0.06] hover:text-white/80">
          <Undo2 className="h-4 w-4" />
        </button>
        <button className="grid h-7 w-7 place-items-center rounded-md text-white/45 transition hover:bg-white/[0.06] hover:text-red-300">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Board content */}
      <div className="ct-scroll relative flex min-w-0 flex-1 flex-col overflow-auto px-5 py-4 sm:px-7">
        {/* Title + definition (marker style) */}
        <div className="text-center">
          <h2 className="ct-font-marker text-3xl font-bold text-sky-300 sm:text-4xl">
            {WHITEBOARD.title}
          </h2>
          <p className="ct-font-marker mx-auto mt-1 max-w-[520px] text-lg leading-snug text-white/85 sm:text-xl">
            Scrum is a{" "}
            <span className="underline decoration-sky-400/70 decoration-2 underline-offset-4">
              framework
            </span>{" "}
            for developing, delivering, and sustaining complex products.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="mt-4 flex min-w-max flex-1 items-center justify-center gap-1 pb-2">
          {/* Product Backlog */}
          <div className="flex w-24 flex-col items-center gap-2">
            <Label text={WHITEBOARD.steps[0].label} className="ct-font-marker text-center text-base text-white/85" />
            <div className="flex w-14 flex-col gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 rounded-[3px] border border-sky-400/50 bg-sky-500/70 shadow-[0_2px_6px_-2px_rgba(59,130,246,0.7)]"
                />
              ))}
            </div>
          </div>

          <Arrow />

          {/* Sprint Planning */}
          <div className="flex w-20 flex-col items-center">
            <Label text={WHITEBOARD.steps[1].label} className="ct-font-marker text-center text-base text-white/85" />
          </div>

          <Arrow />

          {/* Sprint cycle + Daily Scrum */}
          <div className="flex flex-col items-center">
            <div className="mb-1 flex items-center gap-1.5 text-white/80">
              <RotateCw className="h-4 w-4 text-sky-300" />
              <Label text={WHITEBOARD.dailyScrum} className="ct-font-marker text-center text-sm leading-none" />
            </div>
            <div className="relative grid h-28 w-28 place-items-center">
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(125,211,252,0.55)" strokeWidth="2" />
                <path
                  d="M60 10 A50 50 0 1 1 18 84"
                  fill="none"
                  stroke="rgba(125,211,252,0.85)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  markerEnd="url(#ct-arrowhead)"
                />
                <defs>
                  <marker id="ct-arrowhead" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                    <path d="M0 0 L7 3.5 L0 7 Z" fill="rgba(125,211,252,0.9)" />
                  </marker>
                </defs>
              </svg>
              <Label
                text={WHITEBOARD.steps[2].label}
                className="ct-font-marker relative text-center text-sm text-white/90"
              />
            </div>
          </div>

          <Arrow />

          {/* Sprint Review */}
          <div className="flex w-24 flex-col items-center gap-2">
            <Label text={WHITEBOARD.steps[3].label} className="ct-font-marker text-center text-base text-white/85" />
            <div className="grid grid-cols-2 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-5 w-5 rounded-[3px] border border-amber-300/50 bg-amber-400/80 shadow-[0_2px_6px_-2px_rgba(251,191,36,0.7)]"
                />
              ))}
            </div>
          </div>

          <Arrow />

          {/* Sprint Retrospective */}
          <div className="flex w-24 flex-col items-center gap-2">
            <Label text={WHITEBOARD.steps[4].label} className="ct-font-marker text-center text-base text-white/85" />
            <div className="grid grid-cols-2 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-5 w-5 rounded-[3px] border border-pink-300/50 bg-pink-400/80 shadow-[0_2px_6px_-2px_rgba(244,114,182,0.7)]"
                />
              ))}
            </div>
          </div>

          <span className="self-center px-1 text-2xl tracking-widest text-white/40">…</span>
        </div>
      </div>

      {/* Bottom zoom / palette control bar */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          {SWATCHES.map((c, i) => (
            <button
              key={c}
              className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20 transition hover:scale-110"
              style={{
                backgroundColor: c === "#ffffff" ? "transparent" : c,
                borderColor: c === "#ffffff" ? "rgba(255,255,255,0.7)" : undefined,
                border: c === "#ffffff" ? "1.5px solid rgba(255,255,255,0.7)" : undefined,
                boxShadow: i === 1 ? "0 0 0 2px rgba(59,130,246,0.6)" : undefined,
              }}
            />
          ))}
        </div>
        <div className="h-4 w-px bg-white/15" />
        <div className="flex items-center gap-2 text-white/70">
          <button className="grid h-5 w-5 place-items-center rounded transition hover:bg-white/10">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-medium tabular-nums">100%</span>
          <button className="grid h-5 w-5 place-items-center rounded transition hover:bg-white/10">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="h-4 w-px bg-white/15" />
        <button className="grid h-5 w-5 place-items-center rounded text-white/70 transition hover:bg-white/10">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
