import { SVGProps } from "react";

// =============================================================================
// Logo — the official Aladiah Academy identity (silver spire "A" + gold spear +
// gold spiral peak + dotted globe). Replaces the legacy navy/gold/crimson shield.
// Rendered inline so the header logo is crisp, themeable, and request-free; the
// same artwork lives in /public/brand/*.svg for <img>/favicon/social use.
//   variant="full" → horizontal lockup (mark + wordmark) for headers
//   variant="mark" → the square mark only
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
    <radialGradient id="alGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#3E7BD6" stopOpacity="0.85" />
      <stop offset="1" stopColor="#3E7BD6" stopOpacity="0" />
    </radialGradient>
    <clipPath id="alGlobe"><rect x="18" y="100" width="84" height="40" /></clipPath>
  </defs>
);

const Mark = () => (
  <>
    <ellipse cx="60" cy="104" rx="44" ry="18" fill="url(#alGlow)" />
    <g clipPath="url(#alGlobe)">
      <circle cx="60" cy="132" r="38" fill="#0C1730" stroke="#2C56A0" strokeWidth="1.2" />
      <g fill="#4E8AE0">
        <circle cx="44" cy="106" r="1.3" /><circle cx="50" cy="104" r="1.3" /><circle cx="56" cy="106" r="1.3" />
        <circle cx="63" cy="104" r="1.3" /><circle cx="70" cy="106" r="1.3" /><circle cx="76" cy="105" r="1.3" />
        <circle cx="40" cy="110" r="1.3" /><circle cx="47" cy="111" r="1.3" /><circle cx="54" cy="110" r="1.3" />
        <circle cx="66" cy="111" r="1.3" /><circle cx="73" cy="110" r="1.3" /><circle cx="80" cy="111" r="1.3" />
        <circle cx="58" cy="113" r="1.3" /><circle cx="51" cy="115" r="1.3" /><circle cx="69" cy="115" r="1.3" />
      </g>
    </g>
    <path d="M16 100 Q60 116 104 100" stroke="url(#alG)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <polygon points="26,99 56,30 63,32 45,99" fill="url(#alS)" />
    <polygon points="94,99 64,30 57,32 75,99" fill="url(#alSr)" />
    <polygon points="60,40 73,62 60,53 47,62" fill="url(#alG)" />
    <rect x="57.6" y="50" width="4.8" height="49" fill="url(#alG)" />
    <path d="M60 32 C57 18 73 11 70 25 C68 33 58 31 61 23" fill="none" stroke="url(#alG)" strokeWidth="3.6" strokeLinecap="round" />
  </>
);

export default function Logo({ variant = "full", ...props }: LogoProps) {
  if (variant === "mark") {
    return (
      <svg viewBox="0 0 120 138" role="img" aria-label="Aladiah Academy" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Aladiah Academy</title>
        <Defs />
        <Mark />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 420 138" role="img" aria-label="Aladiah Academy" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Aladiah Academy</title>
      <Defs />
      <Mark />
      <text x="146" y="66" fontFamily="Georgia, 'Times New Roman', serif" fontSize="42" fontWeight="600" letterSpacing="6" fill="url(#alS)">ALADIAH</text>
      <text x="149" y="92" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15.5" letterSpacing="13" fill="url(#alG)">ACADEMY</text>
      <text x="149" y="114" fontFamily="Inter, Arial, sans-serif" fontSize="9" fontWeight="600" letterSpacing="2.5" fill="#8596AD">INTELLIGENCE. PURPOSE. IMPACT.</text>
    </svg>
  );
}
