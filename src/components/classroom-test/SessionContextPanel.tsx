import { SESSION, SESSION_CONTEXT } from "./classroomData";

/**
 * SessionContextPanel — program / module / lesson / progress summary in the rail.
 */
export default function SessionContextPanel() {
  return (
    <div className="px-4 pt-4">
      <div className="ct-label mb-2.5 px-1">Session Context</div>
      <div className="space-y-2">
        {SESSION_CONTEXT.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-[12px]">
            <span className="text-white/45">{row.label}</span>
            <span className="truncate text-right font-medium text-white/90">{row.value}</span>
          </div>
        ))}

        {/* Progress */}
        <div className="flex items-center justify-between gap-3 pt-0.5 text-[12px]">
          <span className="text-white/45">Progress</span>
          <div className="flex flex-1 items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                style={{ width: `${SESSION.progress}%` }}
              />
            </div>
            <span className="font-semibold text-white/90">{SESSION.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
