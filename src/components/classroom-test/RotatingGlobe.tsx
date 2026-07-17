import { globeMap } from "./media/globeMap";

/**
 * RotatingGlobe — a classy rotating Earth for the classroom stage. The glowing
 * equirectangular continents texture scrolls horizontally inside a shaded sphere,
 * giving a real "Earth spinning" look. Self-contained (base64 texture, pure CSS);
 * the atmosphere glow intensifies while the professor is speaking. Two side-by-side
 * copies of the map translate -50% for a seamless loop.
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
        <div className="ctg-earth">
          <div className="ctg-strip">
            <img src={globeMap} alt="" />
            <img src={globeMap} alt="" />
          </div>
        </div>
        <div className="ctg-shade" />
        <div className="ctg-terminator" />
      </div>
      <div className="ctg-ring" />
      <style>{`
        .ctg-wrap{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;
          background:radial-gradient(circle at 50% 40%,#0a1830 0%,#070a12 72%)}
        .ctg-stars{position:absolute;inset:0;opacity:.5;
          background-image:radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,.5),transparent),
            radial-gradient(1px 1px at 70% 60%,rgba(255,255,255,.4),transparent),
            radial-gradient(1px 1px at 42% 80%,rgba(255,255,255,.35),transparent),
            radial-gradient(1px 1px at 85% 25%,rgba(255,255,255,.4),transparent)}
        .ctg-glow{position:absolute;width:82%;aspect-ratio:1;border-radius:50%;
          background:radial-gradient(circle,rgba(56,140,255,.4),rgba(56,140,255,0) 66%);filter:blur(16px)}
        .ctg-globe{position:relative;width:min(66%,300px);aspect-ratio:1;border-radius:50%;overflow:hidden;
          background:#04122e;transition:box-shadow .5s ease;
          box-shadow:inset -14px -16px 44px rgba(0,0,0,.65),inset 10px 10px 34px rgba(120,180,255,.12),0 0 72px rgba(56,140,255,.3)}
        .ctg-live{box-shadow:inset -14px -16px 44px rgba(0,0,0,.6),inset 10px 10px 34px rgba(140,195,255,.22),0 0 104px rgba(74,144,245,.62)}
        .ctg-earth{position:absolute;inset:0;border-radius:50%;overflow:hidden}
        .ctg-strip{position:absolute;top:0;bottom:0;left:0;display:flex;height:100%;width:max-content;
          animation:ctgEarth 46s linear infinite;will-change:transform}
        .ctg-strip img{height:100%;width:auto;display:block;user-select:none;pointer-events:none}
        /* spherical depth: top-left specular + bottom-right terminator shadow */
        .ctg-shade{position:absolute;inset:0;border-radius:50%;
          background:radial-gradient(circle at 33% 27%,rgba(255,255,255,.16),rgba(255,255,255,0) 42%),
            radial-gradient(circle at 72% 78%,rgba(0,0,0,.6),transparent 58%)}
        .ctg-terminator{position:absolute;inset:0;border-radius:50%;
          box-shadow:inset 0 0 34px rgba(4,18,46,.75)}
        .ctg-ring{position:absolute;width:min(70%,320px);aspect-ratio:1;border-radius:50%;
          border:1px solid rgba(120,180,255,.28);box-shadow:0 0 26px rgba(56,140,255,.2) inset}
        @keyframes ctgEarth{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.ctg-strip{animation:none}}
      `}</style>
    </div>
  );
}
