import { ChevronRight } from "lucide-react";
import { SUGGESTED_PROMPTS } from "./classroomData";

/**
 * SuggestedPromptsPanel — the "You Can Say" card of tappable example prompts.
 */
export default function SuggestedPromptsPanel() {
  return (
    <div className="ct-card flex min-h-0 flex-col p-4">
      <div className="ct-label mb-2.5 px-1">You Can Say</div>
      <ul className="ct-scroll min-h-0 flex-1 space-y-1.5 overflow-auto pr-1">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <li key={prompt}>
            <button className="group flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left text-[13.5px] text-white/85 transition hover:border-violet-400/30 hover:bg-violet-500/[0.08]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 shadow-[0_0_8px_1px_rgba(139,92,246,0.8)]" />
              <span className="flex-1 leading-snug">{prompt}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:text-violet-300" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
