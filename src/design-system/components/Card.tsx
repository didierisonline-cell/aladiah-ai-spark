import { type HTMLAttributes, useState } from 'react';
import { color, radius, shadow, space, transition } from '../tokens';

type CardVariant = 'elevated' | 'muted' | 'tinted' | 'flat';
type CardAccent = 'blue' | 'orange' | 'green' | 'gold' | 'purple' | 'teal' | 'danger';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  accent?: CardAccent;
  hoverable?: boolean;
  selected?: boolean;
  padding?: number | string;
}

const accentConfig: Record<CardAccent, { border: string; bg: string; glow: string }> = {
  blue:   { border: color.blueBorder,   bg: color.blueDim,   glow: '0 0 0 1px rgba(74,144,245,.2)' },
  orange: { border: color.orangeBorder, bg: color.orangeDim, glow: '0 0 0 1px rgba(240,98,42,.2)' },
  green:  { border: 'rgba(34,201,138,.28)', bg: color.greenDim, glow: '0 0 0 1px rgba(34,201,138,.15)' },
  gold:   { border: color.goldBorder,   bg: color.goldDim,   glow: '0 0 0 1px rgba(245,184,26,.2)' },
  purple: { border: 'rgba(155,89,182,.3)', bg: color.purpleDim, glow: '0 0 0 1px rgba(155,89,182,.2)' },
  teal:   { border: 'rgba(0,180,216,.3)',  bg: color.tealDim,  glow: '0 0 0 1px rgba(0,180,216,.15)' },
  danger: { border: 'rgba(239,68,68,.3)',  bg: color.dangerDim, glow: '0 0 0 1px rgba(239,68,68,.15)' },
};

export default function Card({
  variant = 'elevated',
  accent,
  hoverable = false,
  selected = false,
  padding,
  children,
  style,
  ...props
}: CardProps) {
  const [hovered, setHovered] = useState(false);

  const base: React.CSSProperties = {
    borderRadius: radius.xl,
    transition: transition.base,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  };

  const variantStyles: Record<CardVariant, React.CSSProperties> = {
    elevated: {
      background: color.card,
      border: `1px solid ${selected && accent ? accentConfig[accent].border : selected ? color.blueBorder : color.border}`,
      boxShadow: hovered ? shadow.lg : selected ? shadow.glowBlue : 'none',
      padding: padding ?? `${space[5]}px ${space[5]}px`,
    },
    muted: {
      background: 'rgba(255,255,255,.03)',
      border: `1px solid rgba(255,255,255,.06)`,
      boxShadow: 'none',
      padding: padding ?? `${space[3]}px ${space[4]}px`,
    },
    tinted: {
      background: accent ? accentConfig[accent].bg : color.blueDim,
      border: `1px solid ${accent ? accentConfig[accent].border : color.blueBorder}`,
      boxShadow: hovered && accent ? accentConfig[accent].glow : 'none',
      padding: padding ?? `${space[5]}px`,
    },
    flat: {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      padding: padding ?? 0,
    },
  };

  return (
    <div
      onMouseEnter={hoverable ? () => setHovered(true) : undefined}
      onMouseLeave={hoverable ? () => setHovered(false) : undefined}
      style={{
        ...base,
        ...variantStyles[variant],
        transform: hoverable && hovered ? 'translateY(-2px)' : 'none',
        cursor: hoverable ? 'pointer' : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
