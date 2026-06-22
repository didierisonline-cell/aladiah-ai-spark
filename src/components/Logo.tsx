import { SVGProps } from "react";

type LogoVariant = "full" | "mark";

interface LogoProps extends SVGProps<SVGSVGElement> {
  variant?: LogoVariant;
}

// Official brand colours — ratified 2026-06-21 per BRAND_CANON.md
const NAVY  = "#0E1F44";
const GOLD  = "#C9A24B";
const CREAM = "#F2E6C9";

// Silver gradients inline — derived from /brand/official/aladiah-primary-mark.svg
const SilverMid  = "#D2E2EE";
const SilverEdge = "#4E6480";

const OfficialMark = () => (
  <>
    {/* Background */}
    <circle cx="100" cy="100" r="98" fill={NAVY} />
    <circle cx="100" cy="100" r="96" fill="#0C1B40" opacity="0.5" />

    {/* Torch head */}
    <path
      d="M73 90 L73 60 Q73 33 100 31 Q127 33 127 60 L127 90 Z"
      fill={SilverMid}
    />
    <line x1="86"  y1="33" x2="82"  y2="88" stroke={SilverEdge} strokeWidth="1.2" opacity="0.22" />
    <line x1="114" y1="33" x2="118" y2="88" stroke={SilverEdge} strokeWidth="1.2" opacity="0.22" />
    <rect x="73" y="73" width="54" height="2.5" rx="1" fill={NAVY} opacity="0.18" />
    <rect x="73" y="81" width="54" height="2"   rx="1" fill={NAVY} opacity="0.14" />

    {/* Gold collar */}
    <rect x="82" y="88" width="36" height="7" rx="3.5" fill={GOLD} />

    {/* Shaft */}
    <rect x="91" y="95" width="18" height="50" rx="2" fill={SilverMid} />
    <rect x="88" y="116" width="24" height="2.5" rx="1" fill={GOLD} opacity="0.55" />

    {/* Lower collar + base flare */}
    <rect x="87" y="143" width="26" height="4" rx="2" fill={GOLD} />
    <path d="M81 151 L87 143 L113 143 L119 151 Q100 157 81 151 Z" fill={SilverMid} />

    {/* Hidden 9 — circle (bowl) */}
    <circle cx="100" cy="61" r="21" fill="none" stroke={GOLD} strokeWidth="3.8" />

    {/* Hidden 9 — tail (right edge, down to collar) */}
    <path d="M121 61 L121 88" fill="none" stroke={GOLD} strokeWidth="3.8" strokeLinecap="round" />

    {/* Flame tip */}
    <path d="M93 33 Q100 18 107 33" fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />

    {/* Global arc — primary */}
    <path d="M44 155 Q100 132 156 155" fill="none" stroke={GOLD} strokeWidth="3.8" strokeLinecap="round" />

    {/* Global arc — echo */}
    <path d="M54 162 Q100 142 146 162" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" opacity="0.38" />

    {/* Star accents */}
    <circle cx="56"  cy="130" r="1.4" fill={GOLD} opacity="0.45" />
    <circle cx="144" cy="130" r="1.4" fill={GOLD} opacity="0.45" />
  </>
);

const OfficialFullLockup = () => (
  <>
    {/* Background */}
    <rect width="300" height="200" fill={NAVY} />

    {/* Mark scaled to fit left side */}
    <g transform="translate(150, 80) scale(0.55)">
      <OfficialMark />
    </g>

    {/* Wordmark */}
    <text
      x="150" y="152"
      fontFamily="'Trajan Pro','Times New Roman',Georgia,serif"
      fontSize="18"
      fontWeight="700"
      fill={GOLD}
      textAnchor="middle"
      letterSpacing="5"
    >
      ALADIAH ACADEMY
    </text>

    {/* Divider */}
    <line x1="70" y1="160" x2="230" y2="160" stroke={GOLD} strokeWidth="0.5" opacity="0.5" />

    {/* Tagline */}
    <text
      x="150" y="178"
      fontFamily="'Trajan Pro','Times New Roman',Georgia,serif"
      fontSize="8"
      fill={CREAM}
      textAnchor="middle"
      letterSpacing="2"
      opacity="0.85"
    >
      Intelligence. Purpose. Impact.
    </text>
  </>
);

export default function Logo({ variant = "full", ...props }: LogoProps) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label="Aladiah Academy"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <title>Aladiah Academy</title>
        <OfficialMark />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 300 200"
      role="img"
      aria-label="Aladiah Academy"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Aladiah Academy</title>
      <OfficialFullLockup />
    </svg>
  );
}
