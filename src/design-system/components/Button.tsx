import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { color, fontSize, fontWeight, radius, shadow, transition, space } from '../tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'premium';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #4A90F5, #7AB5FF)',
    border: 'none',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(74,144,245,.35)',
  },
  secondary: {
    background: color.blueDim,
    border: `1px solid ${color.blueBorder}`,
    color: color.blue,
    boxShadow: 'none',
  },
  ghost: {
    background: 'rgba(255,255,255,.05)',
    border: `1px solid ${color.border}`,
    color: color.fm,
    boxShadow: 'none',
  },
  danger: {
    background: color.dangerDim,
    border: `1px solid rgba(239,68,68,.3)`,
    color: color.danger,
    boxShadow: 'none',
  },
  success: {
    background: color.greenDim,
    border: `1px solid rgba(34,201,138,.25)`,
    color: color.green,
    boxShadow: 'none',
  },
  premium: {
    background: 'linear-gradient(135deg, #7c3aed, #4A90F5)',
    border: 'none',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(124,58,237,.4)',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: `${space[1]}px ${space[3]}px`, fontSize: fontSize.sm, borderRadius: radius.md },
  md: { padding: `${space[2]}px ${space[4]}px`, fontSize: fontSize.base, borderRadius: radius.xl },
  lg: { padding: `${space[3]}px ${space[6]}px`, fontSize: fontSize.lg, borderRadius: radius['2xl'] },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, loading = false, children, style, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        {...props}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space[2],
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: fontWeight.bold,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: transition.base,
          whiteSpace: 'nowrap',
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled ? 0.5 : 1,
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
      >
        {loading ? '⏳' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
