import { Mic, Info } from "lucide-react";
import { QUICK_VOICE_COMMANDS } from "./classroomData";

/**
 * QuickVoiceCommandsPanel — bottom of the left rail. Tappable example phrases plus
 * a "Listening for you…" affordance with a small mic. UI-only in the test build.
 */
export default function QuickVoiceCommandsPanel() {
  return (
    <div className="px-4 pt-4">
      <div className="ct-label mb-2 px-1">Quick Voice Commands</div>
      <ul className="space-y-0.5">
        {QUICK_VOICE_COMMANDS.map((cmd) => (
          <li key={cmd}>
            <button className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left text-[12.5px] text-white/60 transition hover:bg-white/[0.04] hover:text-white/85">
              <Info className="h-3.5 w-3.5 shrink-0 text-white/35" />
              <span className="truncate">{cmd}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-2 px-1">
        <span className="text-xs font-medium text-violet-300/90">Listening for you…</span>
        <button className="ct-mic-glow grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.9)]">
          <Mic className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
