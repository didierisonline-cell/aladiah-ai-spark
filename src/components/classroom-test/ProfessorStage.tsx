import ProfessorMedia from "./ProfessorMedia";
import DigitalWhiteboard from "./DigitalWhiteboard";

interface Props {
  speaking: boolean;
  muted: boolean;
  /** live TTS output level 0..1 → drives audio-reactive mouth pacing */
  getLevel?: () => number;
}

/**
 * ProfessorStage — the top "live room": animated Professor Didier on the left
 * (idle/speaking video via ProfessorMedia), with the digital whiteboard to his
 * right. On tablet/mobile the figure collapses and the whiteboard takes the full
 * width.
 */
export default function ProfessorStage({ speaking, muted, getLevel }: Props) {
  return (
    <div className="relative flex h-full min-h-0 w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#070a12]">
      {/* Animated professor figure zone */}
      <div className="relative hidden w-[38%] max-w-[420px] shrink-0 overflow-hidden lg:block xl:w-[34%]">
        <ProfessorMedia speaking={speaking} muted={muted} getLevel={getLevel} />
        {/* blend the figure into the board area */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#070a12]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070a12] to-transparent" />
        {/* Live speaking indicator */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-md">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              speaking ? "ct-live-dot bg-emerald-400" : "bg-white/40"
            }`}
          />
          <span className="text-[10px] font-semibold tracking-wide text-white/80">
            {speaking ? "ON AIR" : "LISTENING"}
          </span>
        </div>
      </div>

      {/* Whiteboard zone */}
      <div className="relative min-w-0 flex-1 p-2.5 sm:p-3 lg:-ml-8 lg:pl-0">
        <DigitalWhiteboard />
      </div>
    </div>
  );
}
