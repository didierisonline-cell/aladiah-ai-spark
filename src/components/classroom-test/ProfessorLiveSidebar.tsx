import { Volume2 } from "lucide-react";
import { professorAvatar } from "./media/professorAssets";
import { SESSION } from "./classroomData";
import Waveform from "./Waveform";

interface Props {
  speaking?: boolean;
}

/**
 * ProfessorLiveSidebar — the professor identity card at the top of the left rail:
 * glowing circular avatar, name, live "Speaking…" state + waveform, End Session.
 */
export default function ProfessorLiveSidebar({ speaking = true }: Props) {
  return (
    <div className="flex flex-col items-center px-4 pt-3.5 text-center">
      {/* Avatar with glowing gradient ring */}
      <div className="relative">
        <div
          className={`absolute -inset-1.5 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-blue-500 blur-[6px] ${
            speaking ? "opacity-80" : "opacity-40"
          } transition-opacity`}
        />
        <div className="relative rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-blue-500 p-[2.5px]">
          <img
            src={professorAvatar}
            alt="Professor Didier"
            className="h-[92px] w-[92px] rounded-full object-cover"
          />
        </div>
      </div>

      <div className="mt-3 font-display text-[15px] font-bold text-white">
        {SESSION.professorName}
      </div>
      <div className="mt-0.5 text-xs font-medium text-violet-300/90">
        {speaking ? "Speaking…" : "Listening…"}
      </div>

      {/* Speaking waveform */}
      <div className="mt-2 h-6 w-full max-w-[190px] px-2">
        <Waveform bars={42} active={speaking} />
      </div>

      {/* End session */}
      <button className="mt-3 flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/[0.06] px-4 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/15">
        <Volume2 className="h-3.5 w-3.5" />
        End Session
      </button>
    </div>
  );
}
