import { color, fontSize, fontWeight, space } from '../tokens';

interface SectionTitleProps {
  children: React.ReactNode;
  count?: number;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function SectionTitle({ children, count, action, style }: SectionTitleProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: space[4],
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
        <span
          style={{
            fontSize: fontSize.md,
            fontWeight: fontWeight.bold,
            color: color.fg,
          }}
        >
          {children}
        </span>
        {count !== undefined && (
          <span
            style={{
              fontSize: fontSize.xs,
              fontWeight: fontWeight.heavy,
              color: color.fm,
              background: 'rgba(255,255,255,.06)',
              border: `1px solid ${color.border}`,
              borderRadius: 99,
              padding: `1px ${space[2]}px`,
            }}
          >
            {count}
          </span>
        )}
      </div>
      {action && (
        <div style={{ fontSize: fontSize.sm, color: color.blue, fontWeight: fontWeight.semibold }}>
          {action}
        </div>
      )}
    </div>
  );
}
