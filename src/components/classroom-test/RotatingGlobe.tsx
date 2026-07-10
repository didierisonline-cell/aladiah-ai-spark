/**
 * RotatingGlobe — a classy, self-contained rotating globe for the classroom stage.
 * Replaces the professor figure beside the board. Pure CSS (no media / no network),
 * so it never bloats the bundle or fails to load. The atmosphere glow intensifies
 * subtly while the professor is speaking, keeping the "live" feel.
 */
interface Props {
  speaking?: boolean;
}

export default function RotatingGlobe({ speaking = false }: Props) {
  return (
    <div className="ctg-wrap" aria-hidden="true">
      <div className="ctg-stars" />
      <div className="ctg-glow" />
      <div className={`ctg-globe${speaking ? " ctg-live" : ""}`}>
        <div className="ctg-merid" />
        <div className="ctg-parallels" />
        <div className="ctg-shade" />
        <div className="ctg-highlight" />
      </div>
      <div className="ctg-ring" />
      <style>{`
        .ctg-wrap{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;
          background:radial-gradient(circle at 50% 40%,#0a1830 0%,#070a12 70%)}
        .ctg-stars{position:absolute;inset:0;opacity:.5;
          background-image:radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,.5),transparent),
            radial-gradient(1px 1px at 70% 60%,rgba(255,255,255,.4),transparent),
            radial-gradient(1px 1px at 40% 80%,rgba(255,255,255,.35),transparent),
            radial-gradient(1px 1px at 85% 25%,rgba(255,255,255,.4),transparent),
            radial-gradient(1px 1px at 55% 15%,rgba(255,255,255,.3),transparent)}
        .ctg-glow{position:absolute;width:82%;aspect-ratio:1;border-radius:50%;
          background:radial-gradient(circle,rgba(56,140,255,.38),rgba(56,140,255,0) 66%);filter:blur(16px)}
        .ctg-globe{position:relative;width:min(66%,300px);aspect-ratio:1;border-radius:50%;overflow:hidden;
          background:radial-gradient(circle at 34% 30%,#3a82e6 0%,#1450a0 44%,#0b2c63 72%,#061635 100%);
          box-shadow:inset -16px -18px 44px rgba(0,0,0,.6),inset 12px 12px 34px rgba(120,180,255,.18),0 0 70px rgba(56,140,255,.28);
          transition:box-shadow .5s ease}
        .ctg-live{box-shadow:inset -16px -18px 44px rgba(0,0,0,.55),inset 12px 12px 34px rgba(140,195,255,.3),0 0 100px rgba(74,144,245,.6)}
        .ctg-merid{position:absolute;inset:0;border-radius:50%;opacity:.55;
          background:repeating-linear-gradient(90deg,transparent 0 26px,rgba(150,200,255,.6) 26px 27px);
          -webkit-mask:radial-gradient(circle,#000 69%,transparent 71%);mask:radial-gradient(circle,#000 69%,transparent 71%);
          animation:ctgSpin 8s linear infinite}
        .ctg-parallels{position:absolute;inset:0;border-radius:50%;opacity:.3;
          background:repeating-linear-gradient(0deg,transparent 0 30px,rgba(150,200,255,.5) 30px 31px);
          -webkit-mask:radial-gradient(circle,#000 69%,transparent 71%);mask:radial-gradient(circle,#000 69%,transparent 71%)}
        .ctg-shade{position:absolute;inset:0;border-radius:50%;
          background:radial-gradient(circle at 70% 76%,rgba(0,0,0,.55),transparent 56%)}
        .ctg-highlight{position:absolute;inset:0;border-radius:50%;
          background:radial-gradient(circle at 30% 23%,rgba(255,255,255,.42),transparent 32%)}
        .ctg-ring{position:absolute;width:min(70%,320px);aspect-ratio:1;border-radius:50%;
          border:1px solid rgba(120,180,255,.25);box-shadow:0 0 24px rgba(56,140,255,.18) inset}
        @keyframes ctgSpin{to{background-position:-27px 0}}
        @media (prefers-reduced-motion: reduce){.ctg-merid{animation:none}}
      `}</style>
    </div>
  );
}
