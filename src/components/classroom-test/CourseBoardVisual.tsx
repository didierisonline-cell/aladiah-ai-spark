/**
 * CourseBoardVisual — the course-aware default board diagram.
 *
 * Every program gets its own signature blueprint-style diagram (same glowing
 * visual language as ScrumBoardVisual) so the board always teaches THIS
 * course, never another program's framework. Matched by course title
 * keywords; unknown programs render no diagram (the key-concepts list that
 * follows carries the board).
 */
import ScrumBoardVisual from "./ScrumBoardVisual";

type Stage = { label: string; sub: string; color: string };

interface FlowSpec {
  heading: string;
  stages: [Stage, Stage, Stage, Stage]; // two before the loop, two after
  center: { label: string; sub: string; loop: string };
  output: { label: string; sub: string };
  pillarsHeading: string;
  pillars: [string, string, string];
  aria: string;
}

/** Shared blueprint flow renderer — mirrors ScrumBoardVisual's layout. */
function FlowDiagram({ spec, uid }: { spec: FlowSpec; uid: string }) {
  const box = (x: number, y: number, w: number, label: string, sub: string, color: string) => (
    <g>
      <rect x={x} y={y} width={w} height={62} rx={12} fill={`${color}1f`} stroke={color} strokeOpacity={0.7} strokeWidth={1.5} />
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
  const [s1, s2, s3, s4] = spec.stages;
  return (
    <div className="mx-auto mt-3 w-full max-w-[860px]">
      <svg viewBox="0 0 860 430" className="h-auto w-full" role="img" aria-label={spec.aria}>
        <defs>
          <filter id={`${uid}Glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id={`${uid}Core`} cx="50%" cy="42%">
            <stop offset="0%" stopColor="#1b3f7a" />
            <stop offset="100%" stopColor="#0b1f43" />
          </radialGradient>
        </defs>

        <text x="430" y="26" textAnchor="middle" fill="#67e8f9" fontSize="13" letterSpacing="2" fontWeight="700">{spec.heading}</text>

        {box(20, 150, 130, s1.label, s1.sub, s1.color)}
        {arrow(150, 190, 181)}
        {box(190, 150, 130, s2.label, s2.sub, s2.color)}
        {arrow(320, 360, 181)}

        {/* Center loop */}
        <g filter={`url(#${uid}Glow)`}>
          <circle cx="430" cy="181" r="66" fill={`url(#${uid}Core)`} stroke="#4a90f5" strokeWidth="2" />
        </g>
        <text x="430" y="168" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="800">{spec.center.label}</text>
        <text x="430" y="188" textAnchor="middle" fill="#cfe0ff" fontSize="11">{spec.center.sub}</text>
        <text x="430" y="210" textAnchor="middle" fill="#34d399" fontSize="10.5" fontWeight="700">↻ {spec.center.loop}</text>
        <path d="M 430 100 A 81 81 0 1 1 349 181" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" opacity="0.8" />
        <path d="M 356 172 L 349 181 L 358 189" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />

        {arrow(500, 540, 181)}
        {box(540, 150, 130, s3.label, s3.sub, s3.color)}
        {arrow(670, 705, 181)}
        {box(705, 150, 135, s4.label, s4.sub, s4.color)}

        {/* Output below the loop */}
        {arrow(430, 430, 262)}
        <g transform="translate(0,4)">
          <rect x="345" y="286" width="170" height="54" rx="12" fill="#22c98a24" stroke="#22c98a" strokeOpacity="0.75" strokeWidth="1.5" />
          <text x="430" y="309" textAnchor="middle" fill="#e8f0ff" fontSize="14" fontWeight="700">{spec.output.label}</text>
          <text x="430" y="327" textAnchor="middle" fill="#9fb4d6" fontSize="10.5">{spec.output.sub}</text>
        </g>

        {/* Pillars */}
        <text x="430" y="376" textAnchor="middle" fill="#7c8db0" fontSize="11" letterSpacing="1.5" fontWeight="700">{spec.pillarsHeading}</text>
        {spec.pillars.map((p, i) => (
          <g key={p}>
            <rect x={190 + i * 170} y={392} width={150} height={30} rx={15} fill="#0e1c38" stroke="#3b6fb5" strokeOpacity={0.6} strokeWidth={1.2} />
            <text x={265 + i * 170} y={411} textAnchor="middle" fill="#bcd2f5" fontSize={12} fontWeight={600}>{p}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const CYBER: FlowSpec = {
  heading: "ENTERPRISE DEFENSE LIFECYCLE",
  stages: [
    { label: "Identify", sub: "assets & risks", color: "#38bdf8" },
    { label: "Protect", sub: "controls & IAM", color: "#a78bfa" },
    { label: "Respond", sub: "contain & act", color: "#f59e0b" },
    { label: "Recover", sub: "restore & learn", color: "#f472b6" },
  ],
  center: { label: "DETECT", sub: "monitor 24/7", loop: "Threat Intel" },
  output: { label: "Digital Trust", sub: "resilient enterprise" },
  pillarsHeading: "CIA TRIAD — THREE PILLARS",
  pillars: ["Confidentiality", "Integrity", "Availability"],
  aria: "Enterprise defense lifecycle: identify, protect, detect, respond, recover — built on the CIA triad",
};

const PM: FlowSpec = {
  heading: "PROJECT DELIVERY LIFECYCLE",
  stages: [
    { label: "Initiate", sub: "charter & goals", color: "#38bdf8" },
    { label: "Plan", sub: "scope & schedule", color: "#a78bfa" },
    { label: "Monitor", sub: "track & adapt", color: "#f59e0b" },
    { label: "Close", sub: "deliver & review", color: "#f472b6" },
  ],
  center: { label: "EXECUTE", sub: "lead the work", loop: "Control Cycle" },
  output: { label: "Value Delivered", sub: "on scope, time, budget" },
  pillarsHeading: "TRIPLE CONSTRAINT — THREE PILLARS",
  pillars: ["Scope", "Time", "Cost"],
  aria: "Project delivery lifecycle: initiate, plan, execute, monitor, close — balancing scope, time and cost",
};

const DATA: FlowSpec = {
  heading: "DATA-TO-DECISION PIPELINE",
  stages: [
    { label: "Collect", sub: "source the data", color: "#38bdf8" },
    { label: "Clean", sub: "prepare & validate", color: "#a78bfa" },
    { label: "Visualize", sub: "tell the story", color: "#f59e0b" },
    { label: "Decide", sub: "drive action", color: "#f472b6" },
  ],
  center: { label: "ANALYZE", sub: "model & test", loop: "Iterate" },
  output: { label: "Insight", sub: "evidence for decisions" },
  pillarsHeading: "DATA QUALITY — THREE PILLARS",
  pillars: ["Accuracy", "Relevance", "Timeliness"],
  aria: "Data-to-decision pipeline: collect, clean, analyze, visualize, decide — built on data quality",
};

const BA: FlowSpec = {
  heading: "BUSINESS ANALYSIS CYCLE",
  stages: [
    { label: "Elicit", sub: "discover needs", color: "#38bdf8" },
    { label: "Analyze", sub: "define the gap", color: "#a78bfa" },
    { label: "Validate", sub: "confirm with users", color: "#f59e0b" },
    { label: "Deliver", sub: "enable change", color: "#f472b6" },
  ],
  center: { label: "MODEL", sub: "requirements", loop: "Refine" },
  output: { label: "Business Value", sub: "the right solution" },
  pillarsHeading: "BA CORE — THREE PILLARS",
  pillars: ["Stakeholders", "Requirements", "Value"],
  aria: "Business analysis cycle: elicit, analyze, model, validate, deliver — centred on stakeholders, requirements and value",
};

/** Pick the program's signature diagram from the course title. */
export default function CourseBoardVisual({ courseTitle }: { courseTitle?: string | null }) {
  const t = (courseTitle || "").toLowerCase();
  if (t.includes("scrum") || t.includes("agile")) return <ScrumBoardVisual />;
  if (t.includes("cyber") || t.includes("security") || t.includes("digital trust")) return <FlowDiagram spec={CYBER} uid="cb" />;
  if (t.includes("project manager") || t.includes("delivery leader") || t.includes("project management")) return <FlowDiagram spec={PM} uid="pb" />;
  if (t.includes("data analyst") || t.includes("analytics") || t.includes("decision intelligence")) return <FlowDiagram spec={DATA} uid="db" />;
  if (t.includes("business analyst") || t.includes("business transformation") || t.includes("product discovery")) return <FlowDiagram spec={BA} uid="bb" />;
  // Unknown program — no wrong diagram; the key-concepts list carries the board.
  return null;
}
