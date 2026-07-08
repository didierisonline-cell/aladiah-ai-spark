import { useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

const TOOLBAR = [Bold, Italic, Underline, List, ListOrdered];

/**
 * StudentNotesPanel — editable notes area. Local React state only in the test
 * build (nothing is persisted to Supabase or anywhere else).
 */
export default function StudentNotesPanel() {
  const [notes, setNotes] = useState("");

  return (
    <div className="ct-card flex min-h-0 flex-col p-4">
      <div className="ct-label mb-2.5 px-1">Student Notes</div>

      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-dashed border-white/[0.14] bg-black/20 p-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={"Add your notes here…\nProfessor Didier will remember what we discuss."}
          className="ct-scroll min-h-0 flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-white/85 outline-none placeholder:text-white/35"
        />
      </div>

      {/* Formatting toolbar (visual only) */}
      <div className="mt-2.5 flex items-center gap-1 px-1">
        {TOOLBAR.map((Icon, i) => (
          <button
            key={i}
            className="grid h-7 w-7 place-items-center rounded-md text-white/45 transition hover:bg-white/[0.06] hover:text-white/85"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
