import { useState } from 'react';

export interface BoardLesson {
  id: string;
  title: string;
  subtitle: string;
  steps: number;
}

interface TeachingBoardProps {
  lesson: BoardLesson;
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
}

// Scrum board SVG diagram — elements revealed by step
function ScrumDiagram({ step }: { step: number }) {
  const show = (minStep: number) => ({
    opacity: step >= minStep ? 1 : 0,
    transition: 'opacity 0.6s ease',
  });

  return (
    <svg viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Background */}
      <rect width="680" height="340" fill="#0B1726" rx="0" />

      {/* Grid lines — subtle */}
      {[60,120,180,240,300].map(y => (
        <line key={y} x1="0" y1={y} x2="680" y2={y} stroke="#1E2D47" strokeWidth="0.5" />
      ))}
      {[136,272,408,544].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="340" stroke="#1E2D47" strokeWidth="0.5" />
      ))}

      {/* Title — step 0 */}
      <g style={show(0)}>
        <text x="340" y="38" textAnchor="middle" fontSize="22" fontWeight="800" fill="#4A90F5" fontFamily="system-ui,sans-serif">
          What is Scrum?
        </text>
        <text x="340" y="60" textAnchor="middle" fontSize="11" fill="#8596AD" fontFamily="system-ui,sans-serif">
          A framework for developing, delivering, and sustaining complex products
        </text>
        <line x1="120" y1="68" x2="560" y2="68" stroke="#1E2D47" strokeWidth="1" />
      </g>

      {/* Product Backlog — step 1 */}
      <g style={show(1)}>
        <rect x="20" y="120" width="110" height="120" rx="8" fill="#142035" stroke="#1E3A5F" strokeWidth="1.5" />
        <text x="75" y="145" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4A90F5" fontFamily="system-ui,sans-serif" letterSpacing="0.08em">PRODUCT</text>
        <text x="75" y="158" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4A90F5" fontFamily="system-ui,sans-serif" letterSpacing="0.08em">BACKLOG</text>
        {/* Backlog items */}
        {['User Story 1','User Story 2','User Story 3','User Story 4'].map((s, i) => (
          <g key={s}>
            <rect x="28" y={170 + i * 16} width="94" height="12" rx="3" fill="#0B111E" stroke="#1E2D47" strokeWidth="0.8" />
            <rect x="30" y={172 + i * 16} width={i === 0 ? 60 : i === 1 ? 45 : i === 2 ? 75 : 30} height="8" rx="2" fill="#4A90F530" />
          </g>
        ))}
      </g>

      {/* Arrow: Backlog → Sprint Planning — step 2 */}
      <g style={show(2)}>
        <defs>
          <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#4A90F5" />
          </marker>
        </defs>
        <line x1="132" y1="180" x2="178" y2="180" stroke="#4A90F5" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />

        {/* Sprint Planning box */}
        <rect x="182" y="150" width="96" height="60" rx="8" fill="#142035" stroke="#1E3A5F" strokeWidth="1.5" />
        <text x="230" y="175" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4A90F5" fontFamily="system-ui,sans-serif" letterSpacing="0.06em">SPRINT</text>
        <text x="230" y="188" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4A90F5" fontFamily="system-ui,sans-serif" letterSpacing="0.06em">PLANNING</text>
        <text x="230" y="203" textAnchor="middle" fontSize="8.5" fill="#8596AD" fontFamily="system-ui,sans-serif">Select items</text>
      </g>

      {/* Sprint circle + Daily Scrum — step 3 */}
      <g style={show(3)}>
        {/* Arrow planning → sprint */}
        <line x1="278" y1="180" x2="316" y2="180" stroke="#4A90F5" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />

        {/* Sprint oval */}
        <ellipse cx="380" cy="180" rx="62" ry="42" fill="#0D1F38" stroke="#4A90F5" strokeWidth="2" />
        <text x="380" y="173" textAnchor="middle" fontSize="11" fontWeight="700" fill="#EDF2F7" fontFamily="system-ui,sans-serif">Sprint</text>
        <text x="380" y="187" textAnchor="middle" fontSize="9.5" fill="#4A90F5" fontFamily="system-ui,sans-serif">1–4 Weeks</text>
        {/* Sprint self-loop arrow */}
        <path d="M 342 145 Q 310 110 348 140" stroke="#4A90F5" strokeWidth="1.2" fill="none" strokeDasharray="3,2" />
        <polygon points="348,140 340,138 344,146" fill="#4A90F5" />

        {/* Daily Scrum — above sprint */}
        <rect x="330" y="82" width="100" height="38" rx="7" fill="#0F1E35" stroke="#1E3A5F" strokeWidth="1.5" />
        <text x="380" y="99" textAnchor="middle" fontSize="9" fontWeight="700" fill="#22C98A" fontFamily="system-ui,sans-serif" letterSpacing="0.06em">DAILY SCRUM</text>
        <text x="380" y="112" textAnchor="middle" fontSize="8" fill="#8596AD" fontFamily="system-ui,sans-serif">24-hour cycle</text>
        {/* Connector: sprint ↔ daily scrum */}
        <line x1="380" y1="138" x2="380" y2="120" stroke="#22C98A" strokeWidth="1.2" strokeDasharray="3,2" />
        <circle cx="380" cy="120" r="2.5" fill="#22C98A" />
      </g>

      {/* Sprint Review + Retro + Increment — step 4 */}
      <g style={show(4)}>
        {/* Arrow sprint → review */}
        <line x1="442" y1="180" x2="480" y2="180" stroke="#4A90F5" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />

        {/* Sprint Review */}
        <rect x="484" y="148" width="94" height="38" rx="7" fill="#142035" stroke="#1E3A5F" strokeWidth="1.5" />
        <text x="531" y="165" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4A90F5" fontFamily="system-ui,sans-serif" letterSpacing="0.05em">SPRINT</text>
        <text x="531" y="178" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4A90F5" fontFamily="system-ui,sans-serif" letterSpacing="0.05em">REVIEW</text>

        {/* Sprint Retrospective */}
        <rect x="484" y="200" width="94" height="38" rx="7" fill="#142035" stroke="#1E3A5F" strokeWidth="1.5" />
        <text x="531" y="216" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#9B59B6" fontFamily="system-ui,sans-serif" letterSpacing="0.04em">SPRINT RETRO-</text>
        <text x="531" y="229" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#9B59B6" fontFamily="system-ui,sans-serif" letterSpacing="0.04em">SPECTIVE</text>

        {/* Connector review ↔ retro */}
        <line x1="531" y1="186" x2="531" y2="200" stroke="#4A5E7A" strokeWidth="1" />

        {/* Increment */}
        <text x="598" y="173" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#22C98A" fontFamily="system-ui,sans-serif">INCREMENT</text>
        {/* Increment squares */}
        {[[0,'#22C98A'],[12,'#4A90F5'],[24,'#F5B81A']].map(([off, color]) => (
          <rect key={String(color)} x={590 + (Number(off) % 24)} y={178 + Math.floor(Number(off)/24)*12}
            width="10" height="10" rx="2" fill={String(color)} opacity="0.85" />
        ))}
        <rect x="590" y="178" width="10" height="10" rx="2" fill="#22C98A" opacity="0.85" />
        <rect x="602" y="178" width="10" height="10" rx="2" fill="#4A90F5" opacity="0.85" />
        <rect x="614" y="178" width="10" height="10" rx="2" fill="#F5B81A" opacity="0.85" />
        <rect x="626" y="178" width="10" height="10" rx="2" fill="#F0622A" opacity="0.85" />
        <rect x="602" y="190" width="10" height="10" rx="2" fill="#9B59B6" opacity="0.85" />
        <rect x="614" y="190" width="10" height="10" rx="2" fill="#22C98A" opacity="0.65" />

        {/* Arrow review → increment */}
        <line x1="578" y1="167" x2="588" y2="183" stroke="#22C98A" strokeWidth="1.2" markerEnd="url(#arrowBlue)" />

        {/* Feedback loop back to backlog */}
        <path d="M 531 238 Q 531 280 380 290 Q 230 300 180 220 Q 140 170 130 180"
          stroke="#4A5E7A" strokeWidth="1.2" fill="none" strokeDasharray="4,3" />
        <polygon points="130,180 122,174 122,186" fill="#4A5E7A" />
        <text x="340" y="300" textAnchor="middle" fontSize="8.5" fill="#4A5E7A" fontFamily="system-ui,sans-serif">Next Sprint cycle</text>
      </g>

      {/* Step counter */}
      <text x="660" y="330" textAnchor="end" fontSize="9" fill="#4A5E7A" fontFamily="system-ui,sans-serif">
        Step {step + 1}/5
      </text>
    </svg>
  );
}

export default function TeachingBoard({ lesson, step, onNextStep, onPrevStep, onReset }: TeachingBoardProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{
      flex: 1,
      background: '#0B1726',
      border: '1px solid #1E2D47',
      borderRadius: 12,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Board header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid #1E2D47',
        background: '#080E1A',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#EDF2F7' }}>{lesson.title}</span>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase',
            background: 'rgba(74,144,245,.15)', border: '1px solid rgba(74,144,245,.3)',
            borderRadius: 99, padding: '1px 7px', color: '#4A90F5',
          }}>
            Live Board
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { label: '‹', key: 'prev', action: onPrevStep, disabled: step === 0 },
            { label: '›', key: 'next', action: onNextStep, disabled: step >= lesson.steps - 1 },
            { label: '↺', key: 'reset', action: onReset, disabled: false },
          ].map(btn => (
            <button
              key={btn.key}
              onClick={btn.action}
              disabled={btn.disabled}
              onMouseEnter={() => setHovered(btn.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: 28, height: 28, borderRadius: 6, border: '1px solid #1E2D47',
                background: hovered === btn.key && !btn.disabled ? '#1E2D47' : '#111D30',
                color: btn.disabled ? '#4A5E7A' : '#8596AD',
                fontSize: 14, cursor: btn.disabled ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Diagram area */}
      <div style={{ flex: 1, padding: 0, display: 'flex', alignItems: 'stretch' }}>
        <ScrumDiagram step={step} />
      </div>

      {/* Step dots */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 6,
        padding: '8px 0',
        borderTop: '1px solid #1E2D47',
        background: '#080E1A',
      }}>
        {Array.from({ length: lesson.steps }).map((_, i) => (
          <div key={i} style={{
            width: i === step ? 18 : 7, height: 7, borderRadius: 99,
            background: i === step ? '#4A90F5' : i < step ? '#22C98A' : '#1E2D47',
            transition: 'all .3s',
          }} />
        ))}
      </div>
    </div>
  );
}
