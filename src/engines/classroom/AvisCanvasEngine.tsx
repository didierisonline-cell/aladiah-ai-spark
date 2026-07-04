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
      background: '#040A14',
      overflow: 'hidden',
      flex: 1, minHeight: 0,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.04)',
    }}>
      {/* Board header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 12px',
        background: 'rgba(4,9,18,.9)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#C8D8EC' }}>{content.title}</span>
          <span style={{
            fontSize: 8, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase',
            background: 'rgba(74,144,245,.1)', border: '1px solid rgba(74,144,245,.22)',
            borderRadius: 99, padding: '1px 7px', color: 'rgba(74,144,245,.8)',
          }}>
            Live Board
          </span>
        </div>
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <button onClick={onPrev} disabled={isFirst} style={navBtnStyle(isFirst)}>‹</button>
          <span style={{ fontSize: 9, color: '#3A4E6A', minWidth: 32, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
            {step + 1} / {content.totalSteps}
          </span>
          <button onClick={onNext} disabled={isLast} style={navBtnStyle(isLast)}>›</button>
          <button onClick={onReset} style={{ ...navBtnStyle(false), marginLeft: 3, fontSize: 12 }}>↺</button>
        </div>
      </div>

      {/* Diagram slot — program-agnostic */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
        {content.renderDiagram(step)}
      </div>

      {/* Step indicator */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 4, padding: '6px',
        borderTop: '1px solid rgba(255,255,255,.04)',
        background: 'rgba(4,9,18,.9)', flexShrink: 0,
      }}>
        {Array.from({ length: content.totalSteps }).map((_, i) => (
          <div key={i} style={{
            height: 3, borderRadius: 99,
            width: i === step ? 18 : 4,
            background: i === step ? '#4A90F5' : i < step ? 'rgba(34,201,138,.3)' : 'rgba(255,255,255,.08)',
            transition: 'all .35s',
          }} />
        ))}
      </div>
    </div>
  );
}

function navBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 22, height: 22, borderRadius: 4,
    border: '1px solid rgba(255,255,255,.08)',
    background: 'rgba(255,255,255,.04)',
    color: disabled ? '#1E2D47' : '#5A7090',
    fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all .15s',
  };
}
