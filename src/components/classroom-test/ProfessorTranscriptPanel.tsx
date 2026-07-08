import { TRANSCRIPT } from "./classroomData";
import Waveform from "./Waveform";

interface Props {
  speaking?: boolean;
}

/**
 * ProfessorTranscriptPanel — live explanation card. Speaker label in violet, the
 * spoken lines, and an animated waveform footer.
 */
export default function ProfessorTranscriptPanel({ speaking = true }: Props) {
  return (
    <div className="ct-card flex min-h-0 flex-col p-5">
      <div className="ct-scroll min-h-0 flex-1 overflow-auto">
        <p className="text-[15px] leading-relaxed text-white/90">
          <span className="font-semibold text-violet-300">{TRANSCRIPT.speaker}</span>{" "}
          {TRANSCRIPT.lines[0]}
        </p>
        <div className="mt-1 space-y-0.5 text-[15px] leading-relaxed text-white/80">
          {TRANSCRIPT.lines.slice(1).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Waveform footer */}
      <div className="mt-3 h-9 w-full">
        <Waveform bars={72} active={speaking} />
      </div>
    </div>
  );
}
