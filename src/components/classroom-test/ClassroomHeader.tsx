import { useState } from "react";
import { ChevronDown, Presentation, AudioLines, Settings } from "lucide-react";
import { SESSION } from "./classroomData";

const PROFESSOR_MODES = ["Professor Mode", "Study Buddy", "Exam Coach", "Socratic Mode"];

/**
 * ClassroomHeader — top bar: Aladiah wordmark, Professor Didier™ Live status,
 * course-title selector, Professor Mode dropdown, and right-side controls.
 * All controls are UI-only for the test build.
 */
export default function ClassroomHeader() {
  const [mode, setMode] = useState(PROFESSOR_MODES[0]);
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.06] bg-[#070a12]/80 px-4 backdrop-blur-md sm:px-6">
      {/* Brand + live status */}
      <div className="flex items-center gap-4">
        <div className="leading-none">
          <div className="font-display text-lg font-extrabold tracking-tight text-white sm:text-xl">
            ALADIAH
          </div>
          <div className="text-[9px] font-semibold tracking-[0.42em] text-white/45">
            ACADEMY
          </div>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <span className="ct-didier-live font-display text-sm font-bold tracking-wide">
            PROFESSOR&nbsp;DIDIER™&nbsp;LIVE
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5">
            <span className="ct-live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-bold tracking-wider text-emerald-300">LIVE</span>
          </span>
        </div>
      </div>

      {/* Course selector */}
      <div className="ml-auto hidden min-w-0 flex-1 justify-center lg:flex">
        <button className="group flex w-full max-w-[420px] items-center justify-center gap-2 truncate rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/15 hover:bg-white/[0.06]">
          <span className="truncate">{SESSION.programFull}</span>
        </button>
      </div>

      {/* Professor Mode dropdown */}
      <div className="relative ml-auto lg:ml-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-white/90 transition hover:border-violet-400/30 hover:bg-white/[0.06]"
        >
          <Presentation className="h-4 w-4 text-violet-300" />
          <span className="hidden sm:inline">{mode}</span>
          <ChevronDown className={`h-4 w-4 text-white/50 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#0c1120] p-1 shadow-2xl">
              {PROFESSOR_MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition ${
                    m === mode ? "bg-violet-500/15 text-violet-200" : "text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        <button className="grid h-9 w-9 place-items-center rounded-full border border-violet-400/40 bg-violet-500/10 text-violet-200 shadow-[0_0_18px_-4px_rgba(139,92,246,0.7)] transition hover:bg-violet-500/20">
          <AudioLines className="h-4 w-4" />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08]">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
