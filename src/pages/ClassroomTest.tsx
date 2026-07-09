import { useEffect, useState } from "react";
import { Menu, X, Clock, HelpCircle, AlertTriangle, Play } from "lucide-react";
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
import { useClassroomVoice } from "@/components/classroom-test/useClassroomVoice";

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
 * WO-UX-CLASSROOM — Founder-review preview of the premium "Professor Didier™
 * Live" AI classroom.
 *
 * VOICE (WO-UX-CLASSROOM voice-test): the central mic and the "Test Voice" button
 * now start a REAL Professor Didier™ ElevenLabs session via useClassroomVoice
 * (signed URL from the deployed elevenlabs-conversation-token edge function, with a
 * public-agent fallback). The professor's speaking animation is driven by the live
 * `isSpeaking` signal, and any connection failure is shown as a visible banner.
 * Still test-only: no Supabase schema, no Stripe, no production release wiring.
 */
export default function ClassroomTest() {
  const voice = useClassroomVoice();
  const [muted, setMuted] = useState(true); // professor video track is silent; real audio is ElevenLabs
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isConnecting = voice.status === "connecting";
  const isLive = voice.status === "connected";
  // The professor's "speaking" animation follows the live agent audio.
  const speaking = isLive && voice.isSpeaking;

  // Central mic / Tap to Speak: start a live session, or end it if already live.
  const handleMicTap = () => {
    if (isLive || isConnecting) voice.stop();
    else voice.start();
  };

  const centerLabel =
    voice.status === "connecting"
      ? "Connecting…"
      : voice.status === "error"
        ? "Tap to retry"
        : isLive
          ? voice.isSpeaking
            ? "Professor speaking…"
            : "Listening — tap to end"
          : "Tap to Speak";

  // Bottom-strip status pill: Ready → Connecting → Listening / Speaking → Error.
  const statusMeta = isLive
    ? { dot: "ct-live-dot bg-emerald-400", text: voice.isSpeaking ? "PROFESSOR SPEAKING" : "LISTENING", cls: "text-emerald-300" }
    : isConnecting
      ? { dot: "bg-amber-400 animate-pulse", text: "CONNECTING…", cls: "text-amber-300" }
      : voice.status === "error"
        ? { dot: "bg-red-500", text: "VOICE ERROR", cls: "text-red-300" }
        : { dot: "bg-white/40", text: "READY", cls: "text-white/60" };

  // Live session timer — runs only while a session is connected.
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!isLive) {
      setElapsed(0);
      return;
    }
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isLive]);
  const hh = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const timer = `${hh}:${mm}:${ss}`;

  return (
    <div className="ct-root flex min-h-[100dvh] flex-col text-white lg:h-[100dvh] lg:overflow-hidden">
      <ClassroomHeader />

      {/* Visible voice error — so the preview explains WHY voice didn't start. */}
      {voice.error && (
        <div className="mx-3 mt-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 sm:mx-6">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="flex-1 leading-snug">{voice.error}</span>
          <button onClick={voice.clearError} aria-label="Dismiss" className="text-red-200/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
              <div className="text-[11px] text-violet-300/90">
                {isLive ? (voice.isSpeaking ? "Speaking…" : "Listening…") : isConnecting ? "Connecting…" : "Ready"}
              </div>
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
            <ProfessorStage speaking={speaking} muted={muted} getLevel={voice.getOutputVolume} />
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
            micActive={isLive || isConnecting}
            centerLabel={centerLabel}
            onToggleMic={handleMicTap}
            muted={muted}
            onToggleMute={() =>
              setMuted((v) => {
                const next = !v;
                voice.setMuted(next); // mute the ElevenLabs voice, not the (silent) clip
                return next;
              })
            }
          />
        </main>
      </div>

      {/* Bottom status strip */}
      <div className="flex shrink-0 items-center gap-4 border-t border-white/[0.06] bg-[#05070e] px-4 py-2 text-[11.5px] sm:px-6">
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
          <span className={`font-semibold tracking-wide ${statusMeta.cls}`}>{statusMeta.text}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/60">
          <Clock className="h-3.5 w-3.5" />
          <span className="tabular-nums">{timer}</span>
        </div>
        <SignalBars />

        <div className="ml-auto flex items-center gap-3">
          {/* Temporary QA control — explicit one-tap start of the live voice session. */}
          <button
            onClick={() => voice.start()}
            disabled={isConnecting || isLive}
            title="QA only: start the live Professor Didier voice session"
            className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 font-medium text-emerald-200 disabled:opacity-40"
          >
            <Play className="h-3.5 w-3.5" /> Test Voice
          </button>
          <span className="hidden text-white/50 sm:inline">{SESSION.professorTitle}</span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-0.5 font-medium text-violet-200">
            {isLive ? "Online" : isConnecting ? "Connecting" : "Ready"}
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
