import { ChevronRight } from "lucide-react";
import { CLASS_FLOW } from "./classroomData";

/**
 * ClassFlowPanel — the ordered lesson list in the left rail. The active lesson
 * is highlighted with a filled dot, subtle violet background and a chevron.
 */
export default function ClassFlowPanel() {
  return (
    <div className="px-4 pt-1">
      <div className="ct-label mb-2 px-1">Class Flow</div>
      <ul className="space-y-0.5">
        {CLASS_FLOW.map((item) => (
          <li key={item.id}>
            <button
              className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13px] transition ${
                item.active
                  ? "border border-violet-400/25 bg-violet-500/10 font-semibold text-white shadow-[0_0_20px_-8px_rgba(139,92,246,0.6)]"
                  : "border border-transparent text-white/60 hover:bg-white/[0.04] hover:text-white/80"
              }`}
            >
              <span
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                  item.active
                    ? "border-violet-300 bg-violet-400"
                    : "border-white/25 bg-transparent"
                }`}
              >
                {item.active && <span className="h-1.5 w-1.5 rounded-full bg-[#0a0e1a]" />}
              </span>
              <span className="flex-1 truncate">
                {item.index}. {item.title}
              </span>
              {item.active && <ChevronRight className="h-4 w-4 shrink-0 text-violet-300" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
