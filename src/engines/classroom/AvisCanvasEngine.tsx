import { CanvasContent } from './types';

interface AvisCanvasEngineProps {
  content: CanvasContent;
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

export default function AvisCanvasEngine({ content, step, onNext, onPrev, onReset }: AvisCanvasEngineProps) {
  const isFirst = step === 0;
  const isLast = step >= content.totalSteps - 1;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: '#070E1C',
      border: '1px solid #1E2D47',
      borderRadius: 10,
      overflow: 'hidden',
      flex: 1,
      minHeight: 0,
    }}>
      {/* Board header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px',
        background: '#080E1A',
        borderBottom: '1px solid #1E2D47',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#EDF2F7' }}>{content.title}</span>
          <span style={{
            fontSize: 8, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase',
            background: 'rgba(74,144,245,.14)', border: '1px solid rgba(74,144,245,.28)',
            borderRadius: 99, padding: '1px 7px', color: '#4A90F5',
          }}>
            Live Board
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button
            onClick={onPrev} disabled={isFirst}
            style={navBtnStyle(isFirst)}
          >‹</button>
          <span style={{ fontSize: 9, color: '#4A5E7A', minWidth: 32, textAlign: 'center' }}>
            {step + 1}/{content.totalSteps}
          </span>
          <button
            onClick={onNext} disabled={isLast}
            style={navBtnStyle(isLast)}
          >›</button>
          <button
            onClick={onReset}
            style={{ ...navBtnStyle(false), marginLeft: 2, fontSize: 12 }}
          >↺</button>
        </div>
      </div>

      {/* Diagram — program-agnostic slot */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
        {content.renderDiagram(step)}
      </div>

      {/* Step dots */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 5, padding: '6px',
        borderTop: '1px solid #1E2D47', background: '#080E1A', flexShrink: 0,
      }}>
        {Array.from({ length: content.totalSteps }).map((_, i) => (
          <div key={i} style={{
            height: 5, borderRadius: 99,
            width: i === step ? 16 : 5,
            background: i === step ? '#4A90F5' : i < step ? '#22C98A30' : '#1E2D47',
            transition: 'all .3s',
          }} />
        ))}
      </div>
    </div>
  );
}

function navBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 24, height: 24, borderRadius: 5,
    border: '1px solid #1E2D47',
    background: '#111D30',
    color: disabled ? '#2A3D5A' : '#8596AD',
    fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all .15s',
  };
}
