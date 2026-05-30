import { SVGProps } from "react";

type LogoVariant = "full" | "mark";

interface LogoProps extends SVGProps<SVGSVGElement> {
  variant?: LogoVariant;
}

const NAVY = "#0E1F44";
const GOLD = "#C9A24B";
const CRIMSON = "#A41E34";
const CREAM = "#F2E6C9";

const Shield = () => (
  <>
    <path d="M24,22 L72,22 L72,58 Q72,73 48,84 Q24,73 24,58 Z" fill={NAVY} stroke={GOLD} strokeWidth={2.5} />
    <path d="M27,40 L48,30 L69,40 L69,46 L48,36 L27,46 Z" fill={CRIMSON} />
    <path d="M48,45 L50.59,52.44 L58.46,52.6 L52.18,57.36 L54.47,64.9 L48,60.4 L41.53,64.9 L43.82,57.36 L37.54,52.6 L45.41,52.44 Z" fill={CREAM} />
  </>
);

export default function Logo({ variant = "full", ...props }: LogoProps) {
  if (variant === "mark") {
    return (
      <svg viewBox="10 14 76 76" role="img" aria-label="Aladiah Academy" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Aladiah Academy</title>
        <Shield />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 96" role="img" aria-label="Aladiah Academy" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Aladiah Academy</title>
      <Shield />
      <text x={96} y={53} fontFamily="Georgia, 'Times New Roman', serif" fontSize={34} fontWeight={600} letterSpacing={4} fill={CREAM}>ALADIAH</text>
      <text x={98} y={73} fontFamily="Georgia, 'Times New Roman', serif" fontSize={13} letterSpacing={9} fill={GOLD}>ACADEMY</text>
    </svg>
  );
}
