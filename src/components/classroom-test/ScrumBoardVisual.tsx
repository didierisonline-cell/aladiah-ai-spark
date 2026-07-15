/**
 * ScrumBoardVisual — a premium, blueprint-style Scrum framework diagram rendered
 * directly on the dark classroom board (glowing strokes, no white card). Used as the
 * default board visual for AI Scrum Master lessons when the lesson has no bespoke
 * diagram yet, so the board is always a real teaching surface, not just text.
 *
 * Pure SVG, self-contained, scales to the board width.
 */
export default function ScrumBoardVisual() {
  const box = (x: number, y: number, w: number, label: string, sub: string, color: string) => (
    <g>
      <rect x={x} y={y} width={w} height={62} rx={12} fill={`${color}1f`} stroke={`${color}`} strokeOpacity={0.7} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + 27} textAnchor="middle" fill="#e8f0ff" fontSize={15} fontWeight={700}>{label}</text>
      <text x={x + w / 2} y={y + 46} textAnchor="middle" fill="#9fb4d6" fontSize={11}>{sub}</text>
    </g>
  );
  const arrow = (x1: number, x2: number, y: number) => (
    <g stroke="#5aa0ff" strokeWidth={2} fill="#5aa0ff">
      <line x1={x1} y1={y} x2={x2 - 8} y2={y} strokeLinecap="round" />
      <path d={`M ${x2 - 9} ${y - 5} L ${x2} ${y} L ${x2 - 9} ${y + 5} Z`} />
    </g>
  );
  return (
    <div className="mx-auto mt-3 w-full max-w-[860px]">
      <svg viewBox="0 0 860 430" className="h-auto w-full" role="img" aria-label="The Scrum framework: sprint cycle, events, roles, artifacts and pillars">
        <defs>
          <filter id="sbGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="sbSprint" cx="50%" cy="42%">
            <stop offset="0%" stopColor="#1b3f7a" />
            <stop offset="100%" stopColor="#0b1f43" />
          </radialGradient>
        </defs>

        {/* Flow line label */}
        <text x="430" y="26" textAnchor="middle" fill="#67e8f9" fontSize="13" letterSpacing="2" fontWeight="700">THE SCRUM FRAMEWORK</text>

        {/* Product Backlog -> Sprint Planning */}
        {box(20, 150, 130, "Product", "Backlog", "#38bdf8")}
        {arrow(150, 190, 181)}
        {box(190, 150, 130, "Sprint", "Planning", "#a78bfa")}
        {arrow(320, 360, 181)}

        {/* Sprint loop (center) */}
        <g filter="url(#sbGlow)">
          <circle cx="430" cy="181" r="66" fill="url(#sbSprint)" stroke="#4a90f5" strokeWidth="2" />
        </g>
        <text x="430" y="168" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800">SPRINT</text>
        <text x="430" y="188" textAnchor="middle" fill="#cfe0ff" fontSize="11">1–4 weeks</text>
        <text x="430" y="210" textAnchor="middle" fill="#34d399" fontSize="10.5" fontWeight="700">↻ Daily Scrum</text>
        {/* circular arrow around sprint */}
        <path d="M 430 100 A 81 81 0 1 1 349 181" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" opacity="0.8" />
        <path d="M 356 172 L 349 181 L 358 189" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />

        {arrow(500, 540, 181)}
        {/* Review -> Retro -> Increment */}
        {box(540, 150, 130, "Sprint", "Review", "#f59e0b")}
        {arrow(670, 705, 181)}
        {box(705, 150, 135, "Sprint", "Retrospective", "#f472b6")}

        {/* Increment output below the loop */}
        {arrow(430, 430, 262)}
        <g transform="translate(0,4)">
          <rect x="360" y="286" width="140" height="54" rx="12" fill="#22c98a24" stroke="#22c98a" strokeOpacity="0.75" strokeWidth="1.5" />
          <text x="430" y="309" textAnchor="middle" fill="#e8f0ff" fontSize="14" fontWeight="700">Increment</text>
          <text x="430" y="327" textAnchor="middle" fill="#9fb4d6" fontSize="10.5">potentially shippable</text>
        </g>

        {/* Three pillars */}
        <text x="430" y="376" textAnchor="middle" fill="#7c8db0" fontSize="11" letterSpacing="1.5" fontWeight="700">EMPIRICISM — THREE PILLARS</text>
        {["Transparency", "Inspection", "Adaptation"].map((p, i) => (
          <g key={p}>
            <rect x={210 + i * 160} y={392} width={140} height={30} rx={15} fill="#0e1c38" stroke="#3b6fb5" strokeOpacity={0.6} strokeWidth={1.2} />
            <text x={280 + i * 160} y={411} textAnchor="middle" fill="#bcd2f5" fontSize={12} fontWeight={600}>{p}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
