import type { CSSProperties } from "react";

// =============================================================================
// Logo — the canonical Aladiah Academy web identity. Renders the official SVG
// assets from the brand vault (public/brand/official/) — the single source of
// truth. No more inline/approximate artwork.
//   variant="full" → horizontal lockup (mark + ALADIAH ACADEMY) for chrome
//   variant="mark" → the icon mark only (A-spire + hidden-9 + global arc)
// The full poster (official-logo.png / official-logo.svg) is brand/hero art,
// used where a large vertical lockup is wanted — see BRAND_STANDARD.md.
// =============================================================================

type LogoVariant = "full" | "mark";

interface LogoProps {
  variant?: LogoVariant;
  style?: CSSProperties;
  className?: string;
}

const SRC: Record<LogoVariant, string> = {
  full: "/brand/official/official-header-logo.svg",
  mark: "/brand/official/official-mark.svg",
};

export default function Logo({ variant = "full", style, className }: LogoProps) {
  return <img src={SRC[variant]} alt="Aladiah Academy" style={style} className={className} />;
}
