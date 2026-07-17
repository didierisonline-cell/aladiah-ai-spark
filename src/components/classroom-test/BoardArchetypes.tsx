/**
 * BoardArchetypes — the classroom's library of structurally distinct diagram
 * geometries. Each archetype is a different SHAPE (venn, tree, pyramid, matrix,
 * scale, shield, funnel, network, steps, swimlane, radar, cycle, chart, flow).
 * moduleBoards.tsx composes these with module-specific content so that no two
 * modules anywhere in the academy render the same diagram (Founder rule).
 *
 * All pure SVG, 860×440, shared glowing blueprint language.
 */
import { ReactNode } from "react";

export type Item = { label: string; sub?: string; color?: string };

export const PALETTE = ["#38bdf8", "#a78bfa", "#f59e0b", "#f472b6", "#34d399", "#5aa0ff"];
const col = (i: number, c?: string) => c || PALETTE[i % PALETTE.length];

let uidCounter = 0;

/** Shared board frame: heading + caption + glow defs. */
export function Board({ title, caption, children, aria }: { title: string; caption?: string; children: ReactNode; aria: string }) {
  const uid = `bd${uidCounter++ % 1000}`;
  return (
    <div className="mx-auto mt-3 w-full max-w-[860px]">
      <svg viewBox="0 0 860 440" className="h-auto w-full" role="img" aria-label={aria}>
        <defs>
          <filter id={`${uid}g`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <text x="430" y="26" textAnchor="middle" fill="#67e8f9" fontSize="13" letterSpacing="2" fontWeight="700">{title.toUpperCase()}</text>
        <g data-glow={`${uid}g`}>{children}</g>
        {caption && (
          <text x="430" y="428" textAnchor="middle" fill="#7c8db0" fontSize="10.5" letterSpacing="1">{caption.toUpperCase()}</text>
        )}
      </svg>
    </div>
  );
}

const boxText = (x: number, y: number, label: string, sub?: string, size = 13.5) => (
  <>
    <text x={x} y={sub ? y - 4 : y + 4} textAnchor="middle" fill="#e8f0ff" fontSize={size} fontWeight={700}>{label}</text>
    {sub && <text x={x} y={y + 13} textAnchor="middle" fill="#9fb4d6" fontSize={10}>{sub}</text>}
  </>
);

/* 1 ── VENN — overlapping circles (2 or 3) */
export function VennBoard({ title, caption, circles, center, aria }: { title: string; caption?: string; circles: Item[]; center?: string; aria: string }) {
  const three = circles.length >= 3;
  const pos = three
    ? [[340, 180], [520, 180], [430, 288]]
    : [[330, 235], [530, 235]];
  return (
    <Board title={title} caption={caption} aria={aria}>
      {circles.slice(0, 3).map((c, i) => (
        <circle key={i} cx={pos[i][0]} cy={pos[i][1]} r={three ? 104 : 138} fill={`${col(i, c.color)}1a`} stroke={col(i, c.color)} strokeOpacity="0.75" strokeWidth="1.8" />
      ))}
      {circles.slice(0, 3).map((c, i) => {
        const [cx, cy] = pos[i];
        const lx = three ? (i === 2 ? cx : i === 0 ? cx - 56 : cx + 56) : (i === 0 ? cx - 70 : cx + 70);
        const ly = three ? (i === 2 ? cy + 62 : cy - 66) : cy - 90;
        return <g key={c.label}>{boxText(lx, ly, c.label, c.sub, 13)}</g>;
      })}
      {center && (
        <>
          <circle cx="430" cy={three ? 230 : 235} r="34" fill="#0e1c38" stroke="#f5b81a" strokeWidth="1.6" strokeOpacity="0.9" />
          <text x="430" y={three ? 234 : 239} textAnchor="middle" fill="#f5d68a" fontSize="10.5" fontWeight="800">{center}</text>
        </>
      )}
    </Board>
  );
}

/* 2 ── TREE — root branching into children */
export function TreeBoard({ title, caption, root, children, aria }: { title: string; caption?: string; root: Item; children: Item[]; aria: string }) {
  const n = children.length;
  const w = 168, gap = (860 - n * w) / (n + 1);
  return (
    <Board title={title} caption={caption} aria={aria}>
      <rect x="345" y="60" width="170" height="56" rx="12" fill="#f5b81a1f" stroke="#f5b81a" strokeOpacity="0.8" strokeWidth="1.6" />
      {boxText(430, 88, root.label, root.sub)}
      {children.map((c, i) => {
        const x = gap + i * (w + gap);
        return (
          <g key={c.label}>
            <path d={`M 430 116 C 430 150, ${x + w / 2} 150, ${x + w / 2} 185`} fill="none" stroke="#5aa0ff" strokeWidth="1.6" strokeOpacity="0.7" />
            <rect x={x} y="185" width={w} height="60" rx="12" fill={`${col(i, c.color)}1f`} stroke={col(i, c.color)} strokeOpacity="0.8" strokeWidth="1.5" />
            {boxText(x + w / 2, 215, c.label, c.sub, 12.5)}
          </g>
        );
      })}
      <text x="430" y="330" textAnchor="middle" fill="#7c8db0" fontSize="11">{`${n} branches · one accountability structure`}</text>
    </Board>
  );
}

/* 3 ── PYRAMID — stacked layers, bottom = foundation */
export function PyramidBoard({ title, caption, levels, aria }: { title: string; caption?: string; levels: Item[]; aria: string }) {
  const n = levels.length, baseW = 560, topW = 150, h = Math.min(64, 250 / n);
  return (
    <Board title={title} caption={caption} aria={aria}>
      {levels.map((lv, i) => {
        const wTop = topW + ((baseW - topW) * (n - 1 - i)) / Math.max(1, n - 1);
        const wBot = topW + ((baseW - topW) * (n - i)) / Math.max(1, n - 1);
        const y = 350 - (i + 1) * h;
        return (
          <g key={lv.label}>
            <path d={`M ${430 - wBot / 2} ${y + h} L ${430 - wTop / 2} ${y} L ${430 + wTop / 2} ${y} L ${430 + wBot / 2} ${y + h} Z`}
              fill={`${col(i, lv.color)}22`} stroke={col(i, lv.color)} strokeOpacity="0.8" strokeWidth="1.5" />
            {boxText(430, y + h / 2 + (lv.sub ? 2 : 0), lv.label, lv.sub, 12.5)}
          </g>
        );
      })}
      <text x="430" y="378" textAnchor="middle" fill="#7c8db0" fontSize="10.5">built from the foundation up</text>
    </Board>
  );
}

/* 4 ── MATRIX — 2×2 quadrants on labelled axes */
export function MatrixBoard({ title, caption, axisX, axisY, quadrants, aria }: { title: string; caption?: string; axisX: string; axisY: string; quadrants: Item[]; aria: string }) {
  const cx = 430, cy = 215, half = 150;
  const qpos = [[cx - half / 2 - 15, cy - half / 2], [cx + half / 2 + 15, cy - half / 2], [cx - half / 2 - 15, cy + half / 2], [cx + half / 2 + 15, cy + half / 2]];
  return (
    <Board title={title} caption={caption} aria={aria}>
      <rect x={cx - half - 30} y={cy - half} width={half + 30} height={half} fill="#38bdf80f" stroke="#38bdf8" strokeOpacity="0.5" />
      <rect x={cx} y={cy - half} width={half + 30} height={half} fill="#34d3990f" stroke="#34d399" strokeOpacity="0.5" />
      <rect x={cx - half - 30} y={cy} width={half + 30} height={half} fill="#7c8db00f" stroke="#7c8db0" strokeOpacity="0.5" />
      <rect x={cx} y={cy} width={half + 30} height={half} fill="#f59e0b0f" stroke="#f59e0b" strokeOpacity="0.5" />
      {quadrants.slice(0, 4).map((q, i) => (
        <g key={q.label}>{boxText(qpos[i][0], qpos[i][1], q.label, q.sub, 12.5)}</g>
      ))}
      <g stroke="#5aa0ff" strokeWidth="1.8">
        <line x1={cx - half - 60} y1={cy + half + 14} x2={cx + half + 60} y2={cy + half + 14} />
        <path d={`M ${cx + half + 60} ${cy + half + 9} L ${cx + half + 72} ${cy + half + 14} L ${cx + half + 60} ${cy + half + 19} Z`} fill="#5aa0ff" stroke="none" />
        <line x1={cx - half - 60} y1={cy + half + 14} x2={cx - half - 60} y2={cy - half - 20} />
        <path d={`M ${cx - half - 65} ${cy - half - 20} L ${cx - half - 60} ${cy - half - 32} L ${cx - half - 55} ${cy - half - 20} Z`} fill="#5aa0ff" stroke="none" />
      </g>
      <text x={cx + half + 40} y={cy + half + 38} textAnchor="middle" fill="#9fb4d6" fontSize="11" fontWeight="600">{axisX} →</text>
      <text x={cx - half - 78} y={cy - half - 6} textAnchor="middle" fill="#9fb4d6" fontSize="11" fontWeight="600" transform={`rotate(-90 ${cx - half - 78} ${cy})`}>{axisY} →</text>
    </Board>
  );
}

/* 5 ── SCALE — a balance weighing two sides */
export function ScaleBoard({ title, caption, left, right, pivot, aria }: { title: string; caption?: string; left: Item; right: Item; pivot?: string; aria: string }) {
  return (
    <Board title={title} caption={caption} aria={aria}>
      <line x1="430" y1="120" x2="430" y2="330" stroke="#5aa0ff" strokeWidth="3" strokeLinecap="round" />
      <path d="M 350 330 L 510 330 L 495 352 L 365 352 Z" fill="#0e1c38" stroke="#3b6fb5" strokeWidth="1.5" />
      <line x1="240" y1="145" x2="620" y2="115" stroke="#f5b81a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="430" cy="130" r="9" fill="#f5b81a" />
      {/* pans */}
      <g stroke="#38bdf8" strokeWidth="1.5">
        <line x1="240" y1="145" x2="205" y2="215" /><line x1="240" y1="145" x2="275" y2="215" />
        <path d="M 185 215 A 55 30 0 0 0 295 215 Z" fill="#38bdf81f" />
      </g>
      <g stroke="#f472b6" strokeWidth="1.5">
        <line x1="620" y1="115" x2="585" y2="185" /><line x1="620" y1="115" x2="655" y2="185" />
        <path d="M 565 185 A 55 30 0 0 0 675 185 Z" fill="#f472b61f" />
      </g>
      {boxText(240, 285, left.label, left.sub, 13)}
      {boxText(620, 255, right.label, right.sub, 13)}
      {pivot && <text x="430" y="105" textAnchor="middle" fill="#f5d68a" fontSize="11.5" fontWeight="700">{pivot}</text>}
    </Board>
  );
}

/* 6 ── SHIELD — a shield with stacked bands */
export function ShieldBoard({ title, caption, segments, core, aria }: { title: string; caption?: string; segments: Item[]; core?: string; aria: string }) {
  const n = segments.length;
  return (
    <Board title={title} caption={caption} aria={aria}>
      <path d="M 430 56 L 590 96 L 590 236 Q 590 330 430 384 Q 270 330 270 236 L 270 96 Z"
        fill="#0e1c38" stroke="#4a90f5" strokeWidth="2" strokeLinejoin="round" />
      {segments.map((s, i) => {
        const y = 96 + (i * 250) / n;
        return (
          <g key={s.label}>
            {i > 0 && <line x1="286" y1={y} x2="574" y2={y} stroke="#3b6fb5" strokeWidth="1.2" strokeOpacity="0.7" />}
            {boxText(430, y + 125 / n + 4, s.label, s.sub, Math.min(13, 10 + 8 / n * 2))}
            <circle cx="302" cy={y + 125 / n} r="4" fill={col(i, s.color)} />
          </g>
        );
      })}
      {core && <text x="430" y="410" textAnchor="middle" fill="#f5d68a" fontSize="11" fontWeight="700">{core}</text>}
    </Board>
  );
}

/* 7 ── FUNNEL — narrowing stages */
export function FunnelBoard({ title, caption, stages, aria }: { title: string; caption?: string; stages: Item[]; aria: string }) {
  const n = stages.length, h = Math.min(70, 300 / n);
  return (
    <Board title={title} caption={caption} aria={aria}>
      {stages.map((s, i) => {
        const wTop = 600 - i * (440 / n);
        const wBot = 600 - (i + 1) * (440 / n);
        const y = 62 + i * (h + 8);
        return (
          <g key={s.label}>
            <path d={`M ${430 - wTop / 2} ${y} L ${430 + wTop / 2} ${y} L ${430 + wBot / 2} ${y + h} L ${430 - wBot / 2} ${y + h} Z`}
              fill={`${col(i, s.color)}22`} stroke={col(i, s.color)} strokeOpacity="0.8" strokeWidth="1.5" />
            {boxText(430, y + h / 2 + 2, s.label, s.sub, 12.5)}
          </g>
        );
      })}
      <path d={`M 425 ${62 + n * (h + 8) + 2} L 430 ${62 + n * (h + 8) + 14} L 435 ${62 + n * (h + 8) + 2}`} fill="none" stroke="#f5b81a" strokeWidth="2" strokeLinecap="round" />
    </Board>
  );
}

/* 8 ── NETWORK — hub with connected nodes */
export function NetworkBoard({ title, caption, hub, nodes, aria }: { title: string; caption?: string; hub: Item; nodes: Item[]; aria: string }) {
  const n = nodes.length;
  return (
    <Board title={title} caption={caption} aria={aria}>
      {nodes.map((node, i) => {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 430 + Math.cos(ang) * 240, y = 225 + Math.sin(ang) * 140;
        return (
          <g key={node.label}>
            <line x1="430" y1="225" x2={x} y2={y} stroke="#5aa0ff" strokeWidth="1.3" strokeOpacity="0.55" strokeDasharray="3 4" />
            <circle cx={x} cy={y} r="34" fill={`${col(i, node.color)}1f`} stroke={col(i, node.color)} strokeOpacity="0.85" strokeWidth="1.6" />
            {boxText(x, y + 2, node.label, undefined, 11)}
            {node.sub && <text x={x} y={y + Math.sign(y - 225 || 1) * 52} textAnchor="middle" fill="#9fb4d6" fontSize="9.5">{node.sub}</text>}
          </g>
        );
      })}
      <circle cx="430" cy="225" r="52" fill="#0e1c38" stroke="#f5b81a" strokeWidth="2" />
      {boxText(430, 227, hub.label, hub.sub, 13)}
    </Board>
  );
}

/* 9 ── STEPS — ascending staircase */
export function StepsBoard({ title, caption, steps, flag, aria }: { title: string; caption?: string; steps: Item[]; flag?: string; aria: string }) {
  const n = steps.length, sw = 700 / n, sh = 250 / n;
  return (
    <Board title={title} caption={caption} aria={aria}>
      {steps.map((s, i) => {
        const x = 80 + i * sw, y = 340 - (i + 1) * sh;
        return (
          <g key={s.label}>
            <rect x={x} y={y} width={sw - 8} height={340 - y} rx="8" fill={`${col(i, s.color)}22`} stroke={col(i, s.color)} strokeOpacity="0.8" strokeWidth="1.5" />
            {boxText(x + sw / 2 - 4, y + 22, s.label, undefined, 12)}
            {s.sub && <text x={x + sw / 2 - 4} y={y + 40} textAnchor="middle" fill="#9fb4d6" fontSize="9.5">{s.sub}</text>}
          </g>
        );
      })}
      {flag && (
        <g>
          <line x1={80 + n * sw + 4} y1={340 - n * sh - 46} x2={80 + n * sw + 4} y2={340 - n * sh} stroke="#f5b81a" strokeWidth="2.5" />
          <path d={`M ${80 + n * sw + 4} ${340 - n * sh - 46} l 46 10 l -46 10 Z`} fill="#f5b81a" />
          <text x={80 + n * sw + 2} y={340 - n * sh - 54} textAnchor="middle" fill="#f5d68a" fontSize="10.5" fontWeight="700">{flag}</text>
        </g>
      )}
    </Board>
  );
}

/* 10 ── SWIMLANE — horizontal lanes */
export function SwimlaneBoard({ title, caption, lanes, aria }: { title: string; caption?: string; lanes: Item[]; aria: string }) {
  const n = lanes.length, h = Math.min(78, 310 / n);
  return (
    <Board title={title} caption={caption} aria={aria}>
      {lanes.map((lane, i) => {
        const y = 56 + i * (h + 10);
        return (
          <g key={lane.label}>
            <rect x="80" y={y} width="700" height={h} rx="10" fill={`${col(i, lane.color)}14`} stroke={col(i, lane.color)} strokeOpacity="0.65" strokeWidth="1.4" />
            <rect x="80" y={y} width="160" height={h} rx="10" fill={`${col(i, lane.color)}26`} />
            <text x="160" y={y + h / 2 + 4} textAnchor="middle" fill="#e8f0ff" fontSize="12.5" fontWeight="700">{lane.label}</text>
            {lane.sub && <text x="510" y={y + h / 2 + 4} textAnchor="middle" fill="#bcd2f5" fontSize="11.5">{lane.sub}</text>}
            {i < n - 1 && <path d={`M 430 ${y + h} L 430 ${y + h + 10}`} stroke="#f5b81a" strokeWidth="2" markerEnd="none" />}
          </g>
        );
      })}
    </Board>
  );
}

/* 11 ── RADAR — spider chart of dimensions */
export function RadarBoard({ title, caption, axes, values, aria }: { title: string; caption?: string; axes: Item[]; values?: number[]; aria: string }) {
  const n = axes.length, cx = 430, cy = 225, R = 145;
  const pt = (i: number, r: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const poly = (r: number) => axes.map((_, i) => pt(i, r).join(",")).join(" ");
  const vals = values || axes.map((_, i) => 0.55 + 0.35 * Math.abs(Math.sin(i * 2.4 + 1)));
  return (
    <Board title={title} caption={caption} aria={aria}>
      {[0.33, 0.66, 1].map((f) => (
        <polygon key={f} points={poly(R * f)} fill="none" stroke="#3b6fb5" strokeOpacity="0.45" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#3b6fb5" strokeOpacity="0.45" strokeWidth="1" />;
      })}
      <polygon points={axes.map((_, i) => pt(i, R * vals[i]).join(",")).join(" ")} fill="#4a90f52e" stroke="#4a90f5" strokeWidth="2" strokeLinejoin="round" />
      {axes.map((a, i) => {
        const [x, y] = pt(i, R * vals[i]);
        return <circle key={i} cx={x} cy={y} r="4" fill={col(i, a.color)} />;
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, R + 34);
        return <g key={a.label}>{boxText(x, y, a.label, a.sub, 11.5)}</g>;
      })}
    </Board>
  );
}

/* 12 ── CYCLE — nodes orbiting a center */
export function CycleBoard({ title, caption, nodes, center, aria }: { title: string; caption?: string; nodes: Item[]; center: Item; aria: string }) {
  const n = nodes.length, cx = 430, cy = 228, R = 140;
  return (
    <Board title={title} caption={caption} aria={aria}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#34d399" strokeWidth="1.8" strokeDasharray="5 7" strokeOpacity="0.7" />
      <path d={`M ${cx + R - 6} ${cy - 14} L ${cx + R} ${cy} L ${cx + R + 8} ${cy - 12}`} fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
      {nodes.map((node, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        return (
          <g key={node.label}>
            <rect x={x - 66} y={y - 24} width="132" height="48" rx="11" fill={`${col(i, node.color)}22`} stroke={col(i, node.color)} strokeOpacity="0.85" strokeWidth="1.5" />
            {boxText(x, y + (node.sub ? 0 : 0), node.label, node.sub, 12)}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="50" fill="#0e1c38" stroke="#f5b81a" strokeWidth="2" />
      {boxText(cx, cy + 2, center.label, center.sub, 12.5)}
    </Board>
  );
}

/* 13 ── CHART — axes + a data story (bell / timeseries / scatter / scurve / burndown) */
export function ChartBoard({ title, caption, kind, xLabel, yLabel, note, aria }: { title: string; caption?: string; kind: "bell" | "timeseries" | "scatter" | "scurve" | "burndown"; xLabel: string; yLabel: string; note?: string; aria: string }) {
  const x0 = 140, y0 = 350, w = 580, h = 250;
  const px = (f: number) => x0 + f * w, py = (f: number) => y0 - f * h;
  let content: ReactNode = null;
  if (kind === "bell") {
    const pts = Array.from({ length: 49 }, (_, i) => {
      const f = i / 48, g = Math.exp(-Math.pow((f - 0.5) / 0.16, 2) / 2);
      return `${px(f)},${py(g * 0.9)}`;
    }).join(" ");
    content = (<>
      <polyline points={pts} fill="none" stroke="#4a90f5" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={px(0.5)} y1={py(0)} x2={px(0.5)} y2={py(0.9)} stroke="#f5b81a" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x={px(0.5)} y={py(0.95)} textAnchor="middle" fill="#f5d68a" fontSize="11" fontWeight="700">mean · median</text>
      <text x={px(0.24)} y={py(0.28)} textAnchor="middle" fill="#9fb4d6" fontSize="10">−1σ</text>
      <text x={px(0.76)} y={py(0.28)} textAnchor="middle" fill="#9fb4d6" fontSize="10">+1σ</text>
    </>);
  } else if (kind === "timeseries") {
    const pts = Array.from({ length: 49 }, (_, i) => {
      const f = i / 48, v = 0.25 + f * 0.45 + 0.12 * Math.sin(f * Math.PI * 6);
      return `${px(f)},${py(v)}`;
    }).join(" ");
    content = (<>
      <polyline points={pts} fill="none" stroke="#4a90f5" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={px(0)} y1={py(0.25)} x2={px(1)} y2={py(0.7)} stroke="#34d399" strokeWidth="1.8" strokeDasharray="6 5" />
      <text x={px(0.86)} y={py(0.78)} fill="#34d399" fontSize="10.5" fontWeight="700">trend ↗</text>
      <text x={px(0.32)} y={py(0.1)} fill="#9fb4d6" fontSize="10">seasonality</text>
    </>);
  } else if (kind === "scatter") {
    const dots = Array.from({ length: 26 }, (_, i) => {
      const f = (i * 37 % 26) / 26, noise = ((i * 53) % 17) / 17 - 0.5;
      return [px(0.06 + f * 0.88), py(0.12 + f * 0.68 + noise * 0.22)];
    });
    content = (<>
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill="#38bdf8" fillOpacity="0.8" />)}
      <line x1={px(0.05)} y1={py(0.14)} x2={px(0.95)} y2={py(0.82)} stroke="#f5b81a" strokeWidth="2" />
      <text x={px(0.72)} y={py(0.9)} fill="#f5d68a" fontSize="10.5" fontWeight="700">regression line</text>
    </>);
  } else if (kind === "scurve") {
    const pts = Array.from({ length: 49 }, (_, i) => {
      const f = i / 48, v = 1 / (1 + Math.exp(-(f - 0.5) * 9));
      return `${px(f)},${py(v * 0.85 + 0.03)}`;
    }).join(" ");
    content = (<>
      <polyline points={pts} fill="none" stroke="#4a90f5" strokeWidth="2.5" strokeLinejoin="round" />
      {["Initiate", "Accelerate", "Mature"].map((s, i) => (
        <text key={s} x={px(0.18 + i * 0.32)} y={py(0.95)} textAnchor="middle" fill="#9fb4d6" fontSize="10.5">{s}</text>
      ))}
    </>);
  } else {
    const ideal = `${px(0)},${py(0.85)} ${px(1)},${py(0.02)}`;
    const real = Array.from({ length: 25 }, (_, i) => {
      const f = i / 24, v = 0.85 * (1 - f) + 0.1 * Math.max(0, Math.sin(f * 9)) * (1 - f);
      return `${px(f)},${py(v)}`;
    }).join(" ");
    content = (<>
      <polyline points={ideal} fill="none" stroke="#7c8db0" strokeWidth="1.6" strokeDasharray="6 5" />
      <polyline points={real} fill="none" stroke="#4a90f5" strokeWidth="2.5" strokeLinejoin="round" />
      <text x={px(0.5)} y={py(0.62)} fill="#7c8db0" fontSize="10.5">ideal</text>
      <text x={px(0.44)} y={py(0.28)} fill="#9fd6ff" fontSize="10.5" fontWeight="700">actual</text>
    </>);
  }
  return (
    <Board title={title} caption={caption} aria={aria}>
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke="#3b6fb5" strokeWidth="1.6" />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - h} stroke="#3b6fb5" strokeWidth="1.6" />
      {content}
      <text x={x0 + w / 2} y={y0 + 28} textAnchor="middle" fill="#9fb4d6" fontSize="11" fontWeight="600">{xLabel} →</text>
      <text x={x0 - 24} y={y0 - h / 2} textAnchor="middle" fill="#9fb4d6" fontSize="11" fontWeight="600" transform={`rotate(-90 ${x0 - 24} ${y0 - h / 2})`}>{yLabel} →</text>
      {note && <text x={x0 + w / 2} y={y0 - h - 10} textAnchor="middle" fill="#f5d68a" fontSize="10.5" fontWeight="700">{note}</text>}
    </Board>
  );
}

/* 14 ── FLOW — plain linear pipeline (no center loop — distinct from signatures) */
export function FlowBoard({ title, caption, steps, result, aria }: { title: string; caption?: string; steps: Item[]; result?: Item; aria: string }) {
  const n = steps.length, w = Math.min(150, (720 - (n - 1) * 36) / n), y = 175;
  const total = n * w + (n - 1) * 36, startX = 430 - total / 2;
  return (
    <Board title={title} caption={caption} aria={aria}>
      {steps.map((s, i) => {
        const x = startX + i * (w + 36);
        return (
          <g key={s.label}>
            <rect x={x} y={y} width={w} height="62" rx="12" fill={`${col(i, s.color)}1f`} stroke={col(i, s.color)} strokeOpacity="0.8" strokeWidth="1.5" />
            {boxText(x + w / 2, y + 31, s.label, s.sub, 12.5)}
            {i < n - 1 && (
              <g stroke="#5aa0ff" strokeWidth="2" fill="#5aa0ff">
                <line x1={x + w} y1={y + 31} x2={x + w + 28} y2={y + 31} strokeLinecap="round" />
                <path d={`M ${x + w + 27} ${y + 26} L ${x + w + 36} ${y + 31} L ${x + w + 27} ${y + 36} Z`} />
              </g>
            )}
          </g>
        );
      })}
      {result && (
        <g>
          <path d={`M 430 ${y + 62} L 430 ${y + 96}`} stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
          <path d={`M 425 ${y + 92} L 430 ${y + 102} L 435 ${y + 92}`} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
          <rect x="345" y={y + 106} width="170" height="54" rx="12" fill="#22c98a24" stroke="#22c98a" strokeOpacity="0.8" strokeWidth="1.5" />
          {boxText(430, y + 133, result.label, result.sub, 12.5)}
        </g>
      )}
    </Board>
  );
}
