import { useEffect, useState } from "react";
import { Menu, X, Clock, HelpCircle } from "lucide-react";
import { professorAvatar } from "@/components/classroom-test/media/professorAssets";

import "@/components/classroom-test/classroom-test.css";
import ClassroomHeader from "@/components/classroom-test/ClassroomHeader";
import ProfessorLiveSidebar from "@/components/classroom-test/ProfessorLiveSidebar";
import ClassFlowPanel from "@/components/classroom-test/ClassFlowPanel";
import SessionContextPanel from "@/components/classroom-test/SessionContextPanel";
import QuickVoiceCommandsPanel from "@/components/classroom-test/QuickVoiceCommandsPanel";
import ProfessorStage from "@/components/classroom-test/ProfessorStage";
import ProfessorTranscriptPanel from "@/components/classroom-test/ProfessorTranscriptPanel";
import SuggestedPromptsPanel from "@/components/classroom-test/SuggestedPromptsPanel";
import StudentNotesPanel from "@/components/classroom-test/StudentNotesPanel";
import VoiceControlBar from "@/components/classroom-test/VoiceControlBar";
import { SESSION } from "@/components/classroom-test/classroomData";

function SignalBars() {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden="true">
      {[6, 9, 12, 15].map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm bg-emerald-400/80"
          style={{ height: h }}
        />
      ))}
    </span>
  );
}

/** The four left-rail sections, reused in the desktop rail and the mobile drawer. */
function RailContent({ speaking }: { speaking: boolean }) {
  return (
    <>
      <ProfessorLiveSidebar speaking={speaking} />
      <div className="mx-4 my-2 h-px bg-white/[0.06]" />
      <ClassFlowPanel />
      <div className="mx-4 my-2 h-px bg-white/[0.06]" />
      <SessionContextPanel />
      <div className="mx-4 my-2 h-px bg-white/[0.06]" />
      <QuickVoiceCommandsPanel />
      <div className="h-4" />
    </>
  );
}

/**
 * ClassroomTest (ClassroomTestPage) — /classroom-test
 * WO-UX-CLASSROOM-001 — Founder-review PROTOTYPE of the premium "Professor Didier™
 * Live" AI classroom. 100% static/test data and local state. No Supabase / Stripe /
 * ElevenLabs / auth / course-progress wiring. Safe, isolated, additive route.
 */
export default function ClassroomTest() {
  const [speaking, setSpeaking] = useState(true); // professor speaking vs idle/listening
  const [muted, setMuted] = useState(true); // professor audio (unlocked on first user gesture)
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Central mic: the first tap (while still muted) unlocks audio so the professor's
  // lips sync with his voice; later taps toggle professor speaking <-> listening.
  const handleMicTap = () => {
    if (speaking && muted) {
      setMuted(false);
      return;
    }
    setSpeaking((v) => !v);
  };
  const centerLabel = speaking ? (muted ? "Tap to hear" : "Speaking…") : "Tap to Speak";

  // Live session timer — visual only, starts at the mock's 00:07:32 and ticks up.
  const [elapsed, setElapsed] = useState(7 * 60 + 32);
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const timer = `${hh}:${mm}:${ss}`;

  return (
    <div className="ct-root flex min-h-[100dvh] flex-col text-white lg:h-[100dvh] lg:overflow-hidden">
      <ClassroomHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Desktop left rail */}
        <aside className="ct-scroll hidden w-[264px] shrink-0 overflow-y-auto border-r border-white/[0.06] bg-[#070a12]/40 lg:block">
          <RailContent speaking={speaking} />
        </aside>

        {/* Main column */}
        <main className="flex min-h-0 flex-1 flex-col">
          {/* Mobile professor header + class-flow toggle */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5 lg:hidden">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 opacity-70 blur-[3px]" />
              <img src={professorAvatar} alt="Professor Didier" className="relative h-9 w-9 rounded-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{SESSION.professorName}</div>
              <div className="text-[11px] text-violet-300/90">{speaking ? "Speaking…" : "Listening…"}</div>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80"
            >
              <Menu className="h-4 w-4" /> Class Flow
            </button>
          </div>

          {/* Stage */}
          <div className="min-h-[280px] p-3 sm:min-h-[340px] lg:min-h-0 lg:flex-[1.55] lg:pb-1.5">
            <ProfessorStage speaking={speaking} muted={muted} />
          </div>

          {/* Lower panels */}
          <div className="grid grid-cols-1 gap-3 px-3 pb-1.5 md:grid-cols-2 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.32fr_1fr_0.98fr]">
            <div className="min-h-[180px] md:col-span-2 lg:col-span-1 lg:min-h-0">
              <ProfessorTranscriptPanel speaking={speaking} />
            </div>
            <div className="min-h-[220px] lg:min-h-0">
              <SuggestedPromptsPanel />
            </div>
            <div className="min-h-[220px] lg:min-h-0">
              <StudentNotesPanel />
            </div>
          </div>

          {/* Voice control bar */}
          <VoiceControlBar
            micActive={speaking}
            centerLabel={centerLabel}
            onToggleMic={handleMicTap}
            muted={muted}
            onToggleMute={() => setMuted((v) => !v)}
          />
        </main>
      </div>

      {/* Bottom status strip */}
      <div className="flex shrink-0 items-center gap-4 border-t border-white/[0.06] bg-[#05070e] px-4 py-2 text-[11.5px] sm:px-6">
        <div className="flex items-center gap-1.5">
          <span className="ct-live-dot h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-semibold tracking-wide text-emerald-300">LIVE SESSION</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/60">
          <Clock className="h-3.5 w-3.5" />
          <span className="tabular-nums">{timer}</span>
        </div>
        <SignalBars />

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-white/50 sm:inline">{SESSION.professorTitle}</span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-0.5 font-medium text-violet-200">
            Online
          </span>
          <button className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-white/70">
            <HelpCircle className="h-3.5 w-3.5" /> Need Help?
          </button>
        </div>
      </div>

      {/* Mobile class-flow drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="ct-scroll absolute inset-y-0 left-0 w-[290px] overflow-y-auto border-r border-white/10 bg-[#070a12] shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="ct-didier-live font-display text-sm font-bold">PROFESSOR DIDIER™ LIVE</span>
              <button onClick={() => setDrawerOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <RailContent speaking={speaking} />
          </div>
        </div>
      )}
    </div>
  );
}
