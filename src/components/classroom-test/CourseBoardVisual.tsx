/**
 * CourseBoardVisual — the course-aware default board diagram.
 *
 * Founder direction: every program gets a STRUCTURALLY UNIQUE board — its own
 * geometry drawn from its own discipline, never a shared template:
 *
 *   Scrum          → circular sprint cycle           (ScrumBoardVisual)
 *   Cybersecurity  → defense-in-depth rings + CIA triangle
 *   Project Mgmt   → Gantt delivery timeline + iron triangle
 *   Data Analyst   → star schema (fact + dimensions)
 *   Business Anal. → double diamond (discover→deliver)
 *
 * Same glowing blueprint language (colors, glow, dark board) — different shape
 * per program. Matched on the canonical DB course title; unknown programs get
 * no diagram (the key-concepts list carries the board).
 */
import ScrumBoardVisual from "./ScrumBoardVisual";

/* ── Cybersecurity: DEFENSE IN DEPTH — concentric rings + CIA triangle ────── */
function CyberBoardVisual() {
  const rings: { r: number; label: string; color: string }[] = [
    { r: 172, label: "Perimeter", color: "#38bdf8" },
    { r: 138, label: "Network", color: "#5aa0ff" },
    { r: 104, label: "Endpoint", color: "#a78bfa" },
    { r: 70, label: "Application", color: "#f472b6" },
  ];
  return (
    <div className="mx-auto mt-3 w-full max-w-[860px]">
      <svg viewBox="0 0 860 440" className="h-auto w-full" role="img" aria-label="Defense in depth: layered security rings protecting the data core, beside the CIA triad triangle">
        <defs>
          <filter id="cybGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="cybCore" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#7a1d34" />
            <stop offset="100%" stopColor="#3d0d1c" />
          </radialGradient>
        </defs>

        <text x="430" y="26" textAnchor="middle" fill="#67e8f9" fontSize="13" letterSpacing="2" fontWeight="700">DEFENSE IN DEPTH — LAYERED SECURITY</text>

        {/* Concentric defense rings */}
        {rings.map((ring) => (
          <g key={ring.label}>
            <circle cx="255" cy="235" r={ring.r} fill={`${ring.color}0d`} stroke={ring.color} strokeOpacity="0.55" strokeWidth="1.6" />
            <text x="255" y={235 - ring.r + 16} textAnchor="middle" fill={ring.color} fontSize="11.5" fontWeight="700">{ring.label}</text>
          </g>
        ))}
        {/* Data core */}
        <g filter="url(#cybGlow)">
          <circle cx="255" cy="235" r="38" fill="url(#cybCore)" stroke="#f87171" strokeWidth="2" />
        </g>
        <text x="255" y="231" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">DATA</text>
        <text x="255" y="247" textAnchor="middle" fill="#fecaca" fontSize="9.5">crown jewels</text>

        {/* Attack arrow — blocked at the layers */}
        <g stroke="#f87171" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <line x1="40" y1="78" x2="132" y2="145" strokeDasharray="6 5" />
          <path d="M 126 133 L 135 148 L 119 146" fill="#f87171" stroke="none" />
        </g>
        <text x="46" y="64" fill="#f87171" fontSize="11" fontWeight="700">⚠ THREAT</text>
        <g fill="#34d399" fontSize="13" fontWeight="800">
          <text x="142" y="160">✕</text>
          <text x="168" y="184">✕</text>
          <text x="194" y="208">✕</text>
        </g>
        <text x="118" y="127" fill="#34d399" fontSize="9.5" fontWeight="600">blocked · layer by layer</text>

        {/* CIA triangle */}
        <g filter="url(#cybGlow)">
          <path d="M 655 108 L 780 330 L 530 330 Z" fill="#0e1c38" stroke="#4a90f5" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <text x="655" y="238" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800">CIA</text>
        <text x="655" y="256" textAnchor="middle" fill="#9fb4d6" fontSize="9.5">security triad</text>
        {[
          { x: 655, y: 100, label: "Confidentiality", sub: "only the right eyes" },
          { x: 512, y: 352, label: "Integrity", sub: "never altered" },
          { x: 798, y: 352, label: "Availability", sub: "always accessible" },
        ].map((v) => (
          <g key={v.label}>
            <text x={v.x} y={v.y - 6} textAnchor="middle" fill="#e8f0ff" fontSize="13.5" fontWeight="700">{v.label}</text>
            <text x={v.x} y={v.y + 10} textAnchor="middle" fill="#9fb4d6" fontSize="10">{v.sub}</text>
          </g>
        ))}
        {[[655, 108], [780, 330], [530, 330]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="#4a90f5" filter="url(#cybGlow)" />
        ))}

        <text x="430" y="425" textAnchor="middle" fill="#7c8db0" fontSize="10.5" letterSpacing="1">EVERY LAYER AN ATTACKER MUST BEAT · EVERY PROMISE THE ENTERPRISE MUST KEEP</text>
      </svg>
    </div>
  );
}

/* ── Project Management: DELIVERY TIMELINE — Gantt + iron triangle ────────── */
function PMBoardVisual() {
  const bars: { x: number; w: number; y: number; label: string; color: string }[] = [
    { x: 90, w: 120, y: 92, label: "Initiate", color: "#38bdf8" },
    { x: 170, w: 190, y: 142, label: "Plan", color: "#a78bfa" },
    { x: 320, w: 300, y: 192, label: "Execute", color: "#4a90f5" },
    { x: 610, w: 150, y: 292, label: "Close", color: "#f472b6" },
  ];
  return (
    <div className="mx-auto mt-3 w-full max-w-[860px]">
      <svg viewBox="0 0 860 440" className="h-auto w-full" role="img" aria-label="Project delivery timeline: phase bars from initiation to close with milestones, and the scope-time-cost iron triangle">
        <defs>
          <filter id="pmGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="pmHatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.5" />
          </pattern>
        </defs>

        <text x="430" y="26" textAnchor="middle" fill="#67e8f9" fontSize="13" letterSpacing="2" fontWeight="700">THE DELIVERY TIMELINE</text>

        {/* Time axis */}
        <line x1="70" y1="345" x2="790" y2="345" stroke="#3b6fb5" strokeWidth="1.5" />
        {[70, 214, 358, 502, 646, 790].map((x, i) => (
          <g key={x}>
            <line x1={x} y1="341" x2={x} y2="349" stroke="#3b6fb5" strokeWidth="1.5" />
            <text x={x} y="366" textAnchor="middle" fill="#7c8db0" fontSize="10">{i === 0 ? "Kickoff" : i === 5 ? "Delivery" : `M${i}`}</text>
          </g>
        ))}

        {/* Phase bars */}
        {bars.map((b) => (
          <g key={b.label} filter="url(#pmGlow)">
            <rect x={b.x} y={b.y} width={b.w} height="34" rx="10" fill={`${b.color}26`} stroke={b.color} strokeOpacity="0.8" strokeWidth="1.5" />
            <text x={b.x + 14} y={b.y + 22} fill="#e8f0ff" fontSize="13.5" fontWeight="700">{b.label}</text>
          </g>
        ))}
        {/* Monitor & Control — hatched band spanning Execute */}
        <rect x="320" y="242" width="300" height="26" rx="9" fill="url(#pmHatch)" stroke="#f59e0b" strokeOpacity="0.7" strokeWidth="1.3" />
        <text x="470" y="259" textAnchor="middle" fill="#ffe9c2" fontSize="12" fontWeight="700">Monitor &amp; Control — continuous</text>

        {/* Milestones */}
        {[
          { x: 210, y: 92, label: "Charter ✓" },
          { x: 360, y: 142, label: "Baseline ✓" },
          { x: 620, y: 192, label: "Go-Live ✓" },
        ].map((m) => (
          <g key={m.label}>
            <path d={`M ${m.x} ${m.y + 5} l 11 12 l -11 12 l -11 -12 Z`} fill="#f5b81a" filter="url(#pmGlow)" />
            <text x={m.x + 18} y={m.y + 22} fill="#f5d68a" fontSize="10.5" fontWeight="700">{m.label}</text>
          </g>
        ))}

        {/* Iron triangle (right) */}
        <text x="748" y="68" textAnchor="middle" fill="#7c8db0" fontSize="11" letterSpacing="1.5" fontWeight="700">IRON TRIANGLE</text>
        <path d="M 748 104 L 816 205 L 680 205 Z" fill="#0e1c38" stroke="#4a90f5" strokeWidth="1.8" strokeLinejoin="round" filter="url(#pmGlow)" />
        <text x="748" y="174" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="800">Quality</text>
        <text x="748" y="96" textAnchor="middle" fill="#e8f0ff" fontSize="11.5" fontWeight="700">Scope</text>
        <text x="668" y="222" textAnchor="middle" fill="#e8f0ff" fontSize="11.5" fontWeight="700">Time</text>
        <text x="828" y="222" textAnchor="middle" fill="#e8f0ff" fontSize="11.5" fontWeight="700">Cost</text>

        <text x="430" y="415" textAnchor="middle" fill="#7c8db0" fontSize="10.5" letterSpacing="1">PLAN THE WORK · WORK THE PLAN · PROTECT THE BALANCE</text>
      </svg>
    </div>
  );
}

/* ── Data Analyst: THE STAR SCHEMA — fact table + dimensions ──────────────── */
function DataBoardVisual() {
  const table = (
    x: number, y: number, w: number, title: string, rows: [string, string][], color: string, key: string,
  ) => (
    <g key={key} filter="url(#daGlow)">
      <rect x={x} y={y} width={w} height={26 + rows.length * 22} rx="10" fill="#0e1c38" stroke={color} strokeOpacity="0.8" strokeWidth="1.5" />
      <rect x={x} y={y} width={w} height="26" rx="10" fill={`${color}30`} />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" fill="#e8f0ff" fontSize="12.5" fontWeight="800">{title}</text>
      {rows.map(([badge, field], i) => (
        <g key={field}>
          {badge && (
            <>
              <rect x={x + 8} y={y + 32 + i * 22} width="24" height="14" rx="4" fill={badge === "PK" ? "#f5b81a2e" : "#38bdf82e"} stroke={badge === "PK" ? "#f5b81a" : "#38bdf8"} strokeOpacity="0.7" strokeWidth="1" />
              <text x={x + 20} y={y + 43 + i * 22} textAnchor="middle" fill={badge === "PK" ? "#f5d68a" : "#9fd6ff"} fontSize="8.5" fontWeight="800">{badge}</text>
            </>
          )}
          <text x={x + (badge ? 40 : 12)} y={y + 44 + i * 22} fill="#bcd2f5" fontSize="11">{field}</text>
        </g>
      ))}
    </g>
  );
  const link = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <g key={key} stroke="#5aa0ff" strokeWidth="1.6" strokeOpacity="0.75">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x2} y1={y2} x2={x2 + (x1 < x2 ? -10 : 10)} y2={y2 - 6} />
      <line x1={x2} y1={y2} x2={x2 + (x1 < x2 ? -10 : 10)} y2={y2 + 6} />
    </g>
  );
  return (
    <div className="mx-auto mt-3 w-full max-w-[860px]">
      <svg viewBox="0 0 860 440" className="h-auto w-full" role="img" aria-label="The star schema: a central fact table joined to date, product, customer and region dimension tables">
        <defs>
          <filter id="daGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <text x="430" y="26" textAnchor="middle" fill="#67e8f9" fontSize="13" letterSpacing="2" fontWeight="700">THE STAR SCHEMA — FACTS &amp; DIMENSIONS</text>

        {/* Relationship links (under the tables) */}
        {link(235, 122, 355, 190, "l1")}
        {link(625, 122, 505, 190, "l2")}
        {link(235, 330, 355, 268, "l3")}
        {link(625, 330, 505, 268, "l4")}
        {[[268, 140], [566, 140], [268, 316], [566, 316]].map((pos, i) => (
          <text key={i} x={pos[0]} y={pos[1]} fill="#7c8db0" fontSize="10" fontWeight="700">1 ⟶ N</text>
        ))}

        {/* Center fact table */}
        {table(355, 152, 150, "FACT · Sales", [["PK", "sale_id"], ["FK", "date_key"], ["FK", "product_key"], ["FK", "customer_key"], ["", "revenue · qty"]], "#f5b81a", "fact")}

        {/* Dimensions */}
        {table(85, 62, 150, "DIM · Date", [["PK", "date_key"], ["", "day · month · year"]], "#38bdf8", "d1")}
        {table(625, 62, 150, "DIM · Product", [["PK", "product_key"], ["", "name · category"]], "#a78bfa", "d2")}
        {table(85, 300, 150, "DIM · Customer", [["PK", "customer_key"], ["", "name · segment"]], "#34d399", "d3")}
        {table(625, 300, 150, "DIM · Region", [["PK", "region_key"], ["", "country · city"]], "#f472b6", "d4")}

        <text x="430" y="425" textAnchor="middle" fill="#7c8db0" fontSize="10.5" letterSpacing="1">ONE FACT · MANY DIMENSIONS · EVERY QUESTION A JOIN AWAY</text>
      </svg>
    </div>
  );
}

/* ── Business Analyst: THE DOUBLE DIAMOND — discover → deliver ────────────── */
function BABoardVisual() {
  const fan = (fromX: number, toX: number, y: number, spread: number, converge: boolean, color: string, key: string) => (
    <g key={key} stroke={color} strokeWidth="1.3" strokeOpacity="0.5">
      {[-spread, -spread / 2, 0, spread / 2, spread].map((dy, i) => (
        converge
          ? <line key={i} x1={fromX} y1={y + dy} x2={toX} y2={y} />
          : <line key={i} x1={fromX} y1={y} x2={toX} y2={y + dy} />
      ))}
    </g>
  );
  return (
    <div className="mx-auto mt-3 w-full max-w-[860px]">
      <svg viewBox="0 0 860 440" className="h-auto w-full" role="img" aria-label="The double diamond: diverge to discover, converge to define the problem, diverge to develop, converge to deliver the solution">
        <defs>
          <filter id="baGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <text x="430" y="26" textAnchor="middle" fill="#67e8f9" fontSize="13" letterSpacing="2" fontWeight="700">THE DOUBLE DIAMOND — FROM CHALLENGE TO VALUE</text>

        {/* Diamonds */}
        <path d="M 120 210 L 280 95 L 440 210 L 280 325 Z" fill="#38bdf812" stroke="#38bdf8" strokeOpacity="0.75" strokeWidth="1.8" strokeLinejoin="round" filter="url(#baGlow)" />
        <path d="M 440 210 L 600 95 L 760 210 L 600 325 Z" fill="#a78bfa12" stroke="#a78bfa" strokeOpacity="0.75" strokeWidth="1.8" strokeLinejoin="round" filter="url(#baGlow)" />

        {/* Divergence / convergence fans */}
        {fan(128, 276, 210, 92, false, "#38bdf8", "f1")}
        {fan(284, 432, 210, 92, true, "#38bdf8", "f2")}
        {fan(448, 596, 210, 92, false, "#a78bfa", "f3")}
        {fan(604, 752, 210, 92, true, "#a78bfa", "f4")}

        {/* Phase labels */}
        {[
          { x: 205, label: "DISCOVER", sub: "explore widely", color: "#9fd6ff" },
          { x: 362, label: "DEFINE", sub: "focus the problem", color: "#9fd6ff" },
          { x: 522, label: "DEVELOP", sub: "create options", color: "#cdbcf9" },
          { x: 682, label: "DELIVER", sub: "ship the value", color: "#cdbcf9" },
        ].map((p) => (
          <g key={p.label}>
            <text x={p.x} y="70" textAnchor="middle" fill={p.color} fontSize="12.5" fontWeight="800" letterSpacing="1">{p.label}</text>
            <text x={p.x} y="86" textAnchor="middle" fill="#7c8db0" fontSize="9.5">{p.sub}</text>
          </g>
        ))}

        {/* Waypoints */}
        {[
          { x: 120, label: "Challenge", sub: "business need" },
          { x: 440, label: "Problem", sub: "defined & agreed" },
          { x: 760, label: "Solution", sub: "delivering value" },
        ].map((w) => (
          <g key={w.label}>
            <circle cx={w.x} cy="210" r="7" fill="#f5b81a" filter="url(#baGlow)" />
            <text x={w.x} y="352" textAnchor="middle" fill="#e8f0ff" fontSize="12.5" fontWeight="700">{w.label}</text>
            <text x={w.x} y="368" textAnchor="middle" fill="#9fb4d6" fontSize="10">{w.sub}</text>
          </g>
        ))}

        <text x="430" y="425" textAnchor="middle" fill="#7c8db0" fontSize="10.5" letterSpacing="1">DIVERGE TO EXPLORE · CONVERGE TO DECIDE · TWICE</text>
      </svg>
    </div>
  );
}

/** Pick the program's signature diagram from the canonical course title. */
export default function CourseBoardVisual({ courseTitle }: { courseTitle?: string | null }) {
  const t = (courseTitle || "").toLowerCase();
  if (t.includes("scrum") || t.includes("agile")) return <ScrumBoardVisual />;
  if (t.includes("cyber") || t.includes("security") || t.includes("digital trust")) return <CyberBoardVisual />;
  if (t.includes("project manager") || t.includes("delivery leader") || t.includes("project management")) return <PMBoardVisual />;
  if (t.includes("data analyst") || t.includes("analytics") || t.includes("decision intelligence")) return <DataBoardVisual />;
  if (t.includes("business analyst") || t.includes("business transformation") || t.includes("product discovery")) return <BABoardVisual />;
  // Unknown program — no wrong diagram; the key-concepts list carries the board.
  return null;
}
