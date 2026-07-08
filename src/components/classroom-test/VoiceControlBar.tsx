import { Mic, MicOff, ScreenShare, Pencil, HelpCircle } from "lucide-react";

interface Props {
  micActive: boolean;
  centerLabel: string;
  onToggleMic: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

function SideControl({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Mic;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5">
      <span
        className={`grid h-11 w-11 place-items-center rounded-full border transition ${
          active
            ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
            : "border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
        }`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="text-[11px] font-medium text-white/55">{label}</span>
    </button>
  );
}

/**
 * VoiceControlBar — bottom control cluster. Central microphone is the hero action
 * (UI-only: toggles a visual "listening" state, no real getUserMedia). Flanked by
 * Mute / Share Screen and Open Whiteboard / Need Help.
 */
export default function VoiceControlBar({
  micActive,
  centerLabel,
  onToggleMic,
  muted,
  onToggleMute,
}: Props) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-6 border-t border-white/[0.06] bg-[#070a12]/70 px-4 py-3 backdrop-blur-md sm:gap-10">
      {/* Left cluster */}
      <div className="flex items-center gap-6 sm:gap-8">
        <SideControl icon={muted ? MicOff : Mic} label="Mute" active={muted} onClick={onToggleMute} />
        <SideControl icon={ScreenShare} label="Share Screen" />
      </div>

      {/* Central mic */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onToggleMic}
          className={`${
            micActive ? "ct-mic-glow" : ""
          } grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 text-white shadow-[0_0_30px_-4px_rgba(99,102,241,0.9)] ring-4 ring-[#0a0e1a] transition active:scale-95`}
          aria-pressed={micActive}
          aria-label="Tap to speak"
        >
          <Mic className="h-6 w-6" />
        </button>
        <span className="text-[11px] font-medium text-white/60">{centerLabel}</span>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-6 sm:gap-8">
        <SideControl icon={Pencil} label="Open Whiteboard" />
        <SideControl icon={HelpCircle} label="Need Help?" />
      </div>
    </div>
  );
}
