import { color, fontSize, fontWeight, radius, space } from '../tokens';

type BadgeColor = 'blue' | 'orange' | 'green' | 'gold' | 'purple' | 'teal' | 'danger' | 'muted';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  dot?: boolean;
  style?: React.CSSProperties;
}

const colorMap: Record<BadgeColor, { bg: string; border: string; text: string }> = {
  blue:   { bg: color.blueDim,    border: color.blueBorder,             text: color.blue   },
  orange: { bg: color.orangeDim,  border: color.orangeBorder,           text: color.orange },
  green:  { bg: color.greenDim,   border: 'rgba(34,201,138,.25)',       text: color.green  },
  gold:   { bg: color.goldDim,    border: color.goldBorder,             text: color.gold   },
  purple: { bg: color.purpleDim,  border: 'rgba(155,89,182,.3)',        text: color.purple },
  teal:   { bg: color.tealDim,    border: 'rgba(0,180,216,.3)',         text: color.teal   },
  danger: { bg: color.dangerDim,  border: 'rgba(239,68,68,.3)',         text: color.danger },
  muted:  { bg: 'rgba(255,255,255,.05)', border: color.border,          text: color.fm     },
};

export default function Badge({ children, color: c = 'blue', size = 'md', dot = false, style }: BadgeProps) {
  const { bg, border, text } = colorMap[c];
  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: space[1],
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: radius.full,
        color: text,
        fontSize: isSmall ? fontSize.xs : fontSize['2xs'],
        fontWeight: fontWeight.heavy,
        letterSpacing: '.06em',
        padding: isSmall ? `${space[0]}px ${space[2]}px` : `3px ${space[2]}px`,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        ...style,
      }}
    >
      {dot && (
        <span style={{ width: 5, height: 5, borderRadius: radius.full, background: text, flexShrink: 0 }} />
      )}
      {children}
    </span>
  );
}
