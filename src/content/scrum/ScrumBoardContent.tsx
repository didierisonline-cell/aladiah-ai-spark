import { CanvasContent } from '@/engines/classroom/types';

// Scrum-specific board content.
// The diagram renders inside AvisCanvasEngine — the engine is program-agnostic.
// All Scrum-specific content lives here.

function ScrumDiagram({ step }: { step: number }) {
  const show = (min: number): React.CSSProperties => ({
    opacity: step >= min ? 1 : 0,
    transition: 'opacity 0.7s ease',
  });

  return (
    <svg viewBox="0 0 680 330" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="680" height="330" fill="#060D1C" />
      {/* Grid */}
      {[55,110,165,220,275].map(y => (
        <line key={y} x1="0" y1={y} x2="680" y2={y} stroke="#1E2D47" strokeWidth="0.4" />
      ))}
      {[136,272,408,544].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="330" stroke="#1E2D47" strokeWidth="0.4" />
      ))}

      {/* ── STEP 0: Title ── */}
      <g style={show(0)}>
        <text x="340" y="35" textAnchor="middle" fontSize="20" fontWeight="800"
          fill="#4A90F5" fontFamily="system-ui,sans-serif">What is Scrum?</text>
        <text x="340" y="56" textAnchor="middle" fontSize="10.5" fill="#8596AD"
          fontFamily="system-ui,sans-serif">
          A framework for developing, delivering, and sustaining complex products
        </text>
        <line x1="80" y1="64" x2="600" y2="64" stroke="#1E2D47" strokeWidth="1" />
      </g>

      {/* ── STEP 1: Product Backlog ── */}
      <g style={show(1)}>
        <rect x="16" y="110" width="108" height="118" rx="8" fill="#0D1A2E" stroke="#1A3356" strokeWidth="1.5" />
        <text x="70" y="132" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#4A90F5"
          fontFamily="system-ui,sans-serif" letterSpacing="0.07em">PRODUCT</text>
        <text x="70" y="144" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#4A90F5"
          fontFamily="system-ui,sans-serif" letterSpacing="0.07em">BACKLOG</text>
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x="24" y={158 + i * 16} width="92" height="11" rx="3"
              fill="#0B111E" stroke="#1E2D47" strokeWidth="0.7" />
            <rect x="26" y={160 + i * 16}
              width={[58, 42, 72, 28][i]} height="7" rx="2" fill="#4A90F530" />
          </g>
        ))}
      </g>

      {/* ── STEP 2: Sprint Planning ── */}
      <g style={show(2)}>
        <defs>
          <marker id="ab" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#4A90F5" />
          </marker>
        </defs>
        <line x1="124" y1="169" x2="172" y2="169" stroke="#4A90F5" strokeWidth="1.5"
          markerEnd="url(#ab)" />
        <rect x="175" y="144" width="95" height="54" rx="8" fill="#0D1A2E" stroke="#1A3356" strokeWidth="1.5" />
        <text x="222" y="167" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#4A90F5"
          fontFamily="system-ui,sans-serif" letterSpacing="0.05em">SPRINT</text>
        <text x="222" y="179" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#4A90F5"
          fontFamily="system-ui,sans-serif" letterSpacing="0.05em">PLANNING</text>
        <text x="222" y="192" textAnchor="middle" fontSize="8" fill="#8596AD"
          fontFamily="system-ui,sans-serif">Select items</text>
      </g>

      {/* ── STEP 3: Sprint Loop + Daily Scrum ── */}
      <g style={show(3)}>
        <line x1="270" y1="171" x2="310" y2="171" stroke="#4A90F5" strokeWidth="1.5"
          markerEnd="url(#ab)" />
        {/* Sprint oval */}
        <ellipse cx="374" cy="171" rx="60" ry="40" fill="#0C1E35" stroke="#4A90F5" strokeWidth="2" />
        <text x="374" y="165" textAnchor="middle" fontSize="11" fontWeight="700" fill="#EDF2F7"
          fontFamily="system-ui,sans-serif">Sprint</text>
        <text x="374" y="179" textAnchor="middle" fontSize="9" fill="#4A90F5"
          fontFamily="system-ui,sans-serif">1–4 Weeks</text>
        {/* Self-loop */}
        <path d="M338,138 Q308,106 344,136" stroke="#4A90F5" strokeWidth="1.1"
          fill="none" strokeDasharray="3,2" />
        <polygon points="344,136 336,134 340,142" fill="#4A90F5" />
        {/* Daily Scrum */}
        <rect x="326" y="80" width="96" height="36" rx="7" fill="#0E1D33" stroke="#1A3356" strokeWidth="1.5" />
        <text x="374" y="96" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#22C98A"
          fontFamily="system-ui,sans-serif" letterSpacing="0.05em">DAILY SCRUM</text>
        <text x="374" y="109" textAnchor="middle" fontSize="8" fill="#8596AD"
          fontFamily="system-ui,sans-serif">24-hour cycle</text>
        <line x1="374" y1="131" x2="374" y2="116" stroke="#22C98A" strokeWidth="1.1" strokeDasharray="3,2" />
        <circle cx="374" cy="116" r="2.5" fill="#22C98A" />
      </g>

      {/* ── STEP 4: Review + Retro + Increment ── */}
      <g style={show(4)}>
        <line x1="434" y1="171" x2="472" y2="171" stroke="#4A90F5" strokeWidth="1.5"
          markerEnd="url(#ab)" />
        {/* Sprint Review */}
        <rect x="476" y="143" width="90" height="36" rx="7" fill="#0D1A2E" stroke="#1A3356" strokeWidth="1.5" />
        <text x="521" y="159" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#4A90F5"
          fontFamily="system-ui,sans-serif" letterSpacing="0.04em">SPRINT</text>
        <text x="521" y="171" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#4A90F5"
          fontFamily="system-ui,sans-serif" letterSpacing="0.04em">REVIEW</text>
        {/* Sprint Retrospective */}
        <rect x="476" y="192" width="90" height="36" rx="7" fill="#0D1A2E" stroke="#1A3356" strokeWidth="1.5" />
        <text x="521" y="207" textAnchor="middle" fontSize="8" fontWeight="700" fill="#9B59B6"
          fontFamily="system-ui,sans-serif" letterSpacing="0.03em">SPRINT RETRO-</text>
        <text x="521" y="220" textAnchor="middle" fontSize="8" fontWeight="700" fill="#9B59B6"
          fontFamily="system-ui,sans-serif" letterSpacing="0.03em">SPECTIVE</text>
        <line x1="521" y1="179" x2="521" y2="192" stroke="#4A5E7A" strokeWidth="1" />
        {/* Increment */}
        <text x="600" y="164" textAnchor="middle" fontSize="8" fontWeight="700" fill="#22C98A"
          fontFamily="system-ui,sans-serif" letterSpacing="0.05em">INCREMENT</text>
        {[[0,'#22C98A'],[12,'#4A90F5'],[24,'#F5B81A'],[0,'#9B59B6'],[12,'#F0622A']].map(([i, c], idx) => (
          <rect key={idx}
            x={582 + (idx % 3) * 13} y={170 + Math.floor(idx / 3) * 13}
            width="11" height="11" rx="2" fill={String(c)} opacity="0.85" />
        ))}
        {/* Feedback loop */}
        <path d="M 521 228 Q 521 275 374 282 Q 222 290 176 220 Q 140 168 126 171"
          stroke="#2A3D5A" strokeWidth="1.1" fill="none" strokeDasharray="4,3" />
        <polygon points="126,171 118,165 118,177" fill="#2A3D5A" />
        <text x="340" y="291" textAnchor="middle" fontSize="8" fill="#4A5E7A"
          fontFamily="system-ui,sans-serif">Next Sprint cycle</text>
      </g>
    </svg>
  );
}

export const SCRUM_BOARD_CONTENT: CanvasContent = {
  programId: 'ai-scrum-master',
  lessonId: 'scrum-foundations-1-1',
  title: 'What is Scrum?',
  subtitle: 'A framework for developing, delivering, and sustaining complex products.',
  totalSteps: 5,
  steps: [
    { index: 0, label: 'Title' },
    { index: 1, label: 'Backlog' },
    { index: 2, label: 'Planning' },
    { index: 3, label: 'Sprint' },
    { index: 4, label: 'Review' },
  ],
  renderDiagram: (step: number) => <ScrumDiagram step={step} />,
};
