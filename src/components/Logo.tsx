import { SVGProps } from "react";

// =============================================================================
// Logo — the official Aladiah Academy identity. Silver spire "A" + torch of
// knowledge (gold flame, crimson heart) + the hidden gold "9" at the apex,
// rising over a subtle world globe. Replaces the legacy shield + star.
// Rendered inline so the header logo is crisp, themeable, and request-free;
// the same artwork lives in /public/brand/*.svg for <img>/favicon/social use.
//   variant="full" → horizontal lockup (mark + wordmark) for headers
//   variant="mark" → the square mark only
// Palette: navy #0B1124 · gold #F6D27A→#C8902E · crimson #D8425C→#8E1B2E
//          (silver spire is structural metal).
// =============================================================================

type LogoVariant = "full" | "mark";

interface LogoProps extends SVGProps<SVGSVGElement> {
  variant?: LogoVariant;
}

const Defs = () => (
  <defs>
    <linearGradient id="alS" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0" stopColor="#F4F8FF" /><stop offset="1" stopColor="#9FB2CE" />
    </linearGradient>
    <linearGradient id="alSr" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0" stopColor="#C8D4E6" /><stop offset="1" stopColor="#6E82A6" />
    </linearGradient>
    <linearGradient id="alG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F6D27A" /><stop offset="1" stopColor="#C8902E" />
    </linearGradient>
    <linearGradient id="alFlame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FBE6A6" /><stop offset="1" stopColor="#D89A33" />
    </linearGradient>
    <linearGradient id="alCrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#D8425C" /><stop offset="1" stopColor="#8E1B2E" />
    </linearGradient>
    <clipPath id="alGlobe"><rect x="18" y="100" width="84" height="40" /></clipPath>
  </defs>
);

const Mark = () => (
  <>
    <g clipPath="url(#alGlobe)">
      <circle cx="60" cy="134" r="40" fill="#0C1730" stroke="#33518A" strokeWidth="1" />
      <g fill="#C9A24B" opacity="0.4">
        <circle cx="46" cy="107" r="1.2" /><circle cx="54" cy="105" r="1.2" /><circle cx="62" cy="106" r="1.2" />
        <circle cx="70" cy="105" r="1.2" /><circle cx="50" cy="111" r="1.2" /><circle cx="66" cy="111" r="1.2" />
        <circle cx="58" cy="112" r="1.2" />
      </g>
    </g>
    <path d="M20 100 Q60 113 100 100" stroke="url(#alG)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <polygon points="26,99 56,30 63,32 45,99" fill="url(#alS)" />
    <polygon points="94,99 64,30 57,32 75,99" fill="url(#alSr)" />
    <polygon points="58,74 62,74 61,96 59,96" fill="url(#alG)" />
    <path d="M60 46 C63.5 54 65 60 64 66 C63 71 61 75 60 76 C59 75 57 71 56 66 C55 60 56.5 54 60 46 Z" fill="url(#alFlame)" />
    <path d="M60 54 C62 59 63 63 62 67 C61.3 70 60.6 72 60 73 C59.4 72 58.7 70 58 67 C57 63 58 59 60 54 Z" fill="url(#alCrim)" />
    <path d="M58.5 30 C61.5 28.5 64.5 25.5 64.5 20 A5.5 5.5 0 1 0 58.8 14.8" fill="none" stroke="url(#alG)" strokeWidth="3.2" strokeLinecap="round" />
  </>
);

export default function Logo({ variant = "full", ...props }: LogoProps) {
  if (variant === "mark") {
    return (
      <svg viewBox="0 0 120 140" role="img" aria-label="Aladiah Academy" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Aladiah Academy</title>
        <Defs />
        <Mark />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 420 140" role="img" aria-label="Aladiah Academy" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Aladiah Academy</title>
      <Defs />
      <Mark />
      <text x="146" y="66" fontFamily="Georgia, 'Times New Roman', serif" fontSize="42" fontWeight="600" letterSpacing="6" fill="url(#alS)">ALADIAH</text>
      <text x="149" y="92" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15.5" letterSpacing="13" fill="url(#alG)">ACADEMY</text>
      <text x="149" y="114" fontFamily="Inter, Arial, sans-serif" fontSize="9" fontWeight="600" letterSpacing="2.5" fill="#8596AD">INTELLIGENCE. PURPOSE. IMPACT.</text>
    </svg>
  );
}
