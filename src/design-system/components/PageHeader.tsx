import { color, fontSize, fontWeight, space } from '../tokens';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  label?: string;       // small uppercase label above the title (e.g. "AVIS™")
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function PageHeader({ title, subtitle, label, action, style }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: space[4],
        flexWrap: 'wrap',
        marginBottom: space[7],
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        ...style,
      }}
    >
      <div>
        {label && (
          <div
            style={{
              fontSize: fontSize.xs,
              fontWeight: fontWeight.heavy,
              color: color.fm,
              textTransform: 'uppercase',
              letterSpacing: '.12em',
              marginBottom: space[1],
            }}
          >
            {label}
          </div>
        )}
        <h1
          style={{
            fontSize: fontSize['3xl'],
            fontWeight: fontWeight.black,
            color: color.fg,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <div
            style={{
              fontSize: fontSize.base,
              color: color.fm,
              marginTop: space[1],
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {action && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: space[2] }}>
          {action}
        </div>
      )}
    </div>
  );
}
