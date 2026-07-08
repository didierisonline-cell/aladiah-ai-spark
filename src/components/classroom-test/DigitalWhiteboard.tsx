import { CT, panelStyle, TEST_SESSION } from './theme';

const TOOLS = [
  { icon: '✏️', label: 'Pen' },
  { icon: '🖍️', label: 'Highlight' },
  { icon: '🧽', label: 'Erase' },
  { icon: '↩️', label: 'Undo' },
  { icon: '🔍', label: 'Zoom' },
  { icon: '⛶', label: 'Fullscreen' },
  { icon: '⬇️', label: 'Save' },
];

/** SVG Scrum flow: Backlog → Planning → Sprint (with Daily Scrum loop above) → Review → Retro. */
function ScrumDiagram() {
  const box = (x: number, y: number, w: number, label: string[], accent: string, key: string) => (
    <g key={key}>
      <rect x={x} y={y} width={w} height={54} rx={10} fill="rgba(74,144,245,.08)" stroke={accent} strokeWidth={1.4} />
      {label.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y + (label.length === 1 ? 32 : 24 + i * 16)}
          textAnchor="middle"
          fill="#EDF2F7"
          fontSize={12.5}
          fontWeight={700}
          fontFamily="'Plus Jakarta Sans',system-ui,sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  );

  const arrow = (x1: number, x2: number, y: number, key: string) => (
    <g key={key} stroke={CT.gold} strokeWidth={1.8} fill="none">
      <line x1={x1} y1={y} x2={x2 - 8} y2={y} />
      <path d={`M ${x2 - 8} ${y - 5} L ${x2} ${y} L ${x2 - 8} ${y + 5}`} fill={CT.gold} stroke="none" />
    </g>
  );

  return (
    <svg viewBox="0 0 880 250" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Scrum framework diagram">
      {/* Daily Scrum bubble above the sprint */}
      <g>
        <ellipse cx="440" cy="52" rx="78" ry="26" fill="rgba(139,92,246,.12)" stroke={CT.purple} strokeWidth={1.4} />
        <text x="440" y="57" textAnchor="middle" fill="#EDF2F7" fontSize={12.5} fontWeight={700} fontFamily="'Plus Jakarta Sans',system-ui,sans-serif">Daily Scrum</text>
        {/* loop arrows connecting Daily Scrum to the Sprint below */}
        <path d="M 400 76 C 392 96, 392 106, 402 122" fill="none" stroke={CT.purple} strokeWidth={1.6} strokeDasharray="4 4" />
        <path d="M 402 122 L 396 112 M 402 122 L 411 116" stroke={CT.purple} strokeWidth={1.6} fill="none" />
        <path d="M 480 122 C 490 106, 490 96, 482 76" fill="none" stroke={CT.purple} strokeWidth={1.6} strokeDasharray="4 4" />
        <path d="M 482 76 L 488 86 M 482 76 L 473 82" stroke={CT.purple} strokeWidth={1.6} fill="none" />
      </g>

      {/* Flow row */}
      {box(10, 128, 150, ['Product', 'Backlog'], CT.blue, 'b1')}
      {arrow(160, 196, 155, 'a1')}
      {box(196, 128, 150, ['Sprint', 'Planning'], CT.blue, 'b2')}
      {arrow(346, 372, 155, 'a2')}
      {/* Sprint — emphasized */}
      <g>
        <rect x="372" y="122" width="136" height="66" rx={12} fill="rgba(245,184,26,.10)" stroke={CT.gold} strokeWidth={2} />
        <text x="440" y="150" textAnchor="middle" fill="#F5B81A" fontSize={14} fontWeight={800} fontFamily="'Plus Jakarta Sans',system-ui,sans-serif">Sprint</text>
        <text x="440" y="170" textAnchor="middle" fill="#8596AD" fontSize={11} fontWeight={600} fontFamily="'Plus Jakarta Sans',system-ui,sans-serif">1–4 Weeks</text>
      </g>
      {arrow(508, 534, 155, 'a3')}
      {box(534, 128, 150, ['Sprint', 'Review'], CT.blue, 'b4')}
      {arrow(684, 710, 155, 'a4')}
      {box(710, 128, 160, ['Sprint', 'Retrospective'], CT.blue, 'b5')}

      {/* Return loop to backlog */}
      <path
        d="M 790 188 C 790 232, 90 232, 85 188"
        fill="none" stroke={CT.fd} strokeWidth={1.4} strokeDasharray="5 5"
      />
      <path d="M 85 188 L 79 199 M 85 188 L 93 197" stroke={CT.fd} strokeWidth={1.4} fill="none" />
      <text x="440" y="238" textAnchor="middle" fill="#4A5E7A" fontSize={10.5} fontWeight={600} fontFamily="'Plus Jakarta Sans',system-ui,sans-serif">
        Increment feeds back into the Product Backlog — continuous improvement
      </text>
    </svg>
  );
}

/** Center column: the digital whiteboard — title, definition, Scrum diagram, toolbar. */
export default function DigitalWhiteboard() {
  return (
    <section style={{ ...panelStyle, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Board toolbar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 14px', borderBottom: `1px solid ${CT.border}`,
          background: 'rgba(9,14,26,.6)',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: CT.fd, marginRight: 8 }}>
          Digital Whiteboard
        </span>
        <div style={{ flex: 1 }} />
        {TOOLS.map((tl) => (
          <button
            key={tl.label}
            type="button"
            title={tl.label}
            className="ct-tool"
            style={{
              width: 30, height: 30, borderRadius: 8, fontSize: 13,
              background: CT.panelAlt, border: `1px solid ${CT.border}`,
              color: CT.fm, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
            }}
          >
            <span aria-hidden>{tl.icon}</span>
          </button>
        ))}
      </div>

      {/* Board surface */}
      <div
        style={{
          padding: '22px 26px 18px',
          background: `
            radial-gradient(circle at 1px 1px, rgba(133,150,173,.10) 1px, transparent 0),
            linear-gradient(180deg, #0C1424 0%, #0A111F 100%)
          `,
          backgroundSize: '22px 22px, 100% 100%',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: CT.gold, marginBottom: 4 }}>
          {TEST_SESSION.module}
        </div>
        <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 800, color: CT.fg, margin: '0 0 8px' }}>
          {TEST_SESSION.lesson}
        </h2>
        <p style={{ fontSize: 13.5, color: CT.fm, lineHeight: 1.65, maxWidth: 640, margin: '0 0 20px' }}>
          <strong style={{ color: CT.fg }}>Definition:</strong> Scrum is a framework for developing, delivering,
          and sustaining complex products.
        </p>
        <ScrumDiagram />
      </div>
    </section>
  );
}
