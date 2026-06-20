// =============================================================================
// HeroBackground — the premium "globally connected" backdrop for the homepage
// hero: deep navy gradient, particle/starfield, animated global network lines,
// a hidden glowing "9" behind the headline, and the faint official torch mark.
// Pure decoration (aria-hidden). All motion respects prefers-reduced-motion.
//
// NOTE: this is a CSS/SVG approximation of the approved hero art. If an exported
// background image is supplied (public/brand/…), it can be layered behind this.
// The university SEAL is intentionally NOT used here — only the torch mark.
// =============================================================================
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* base gradient */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 70% 8%, #0E1A33 0%, #0A1322 45%, #070D18 100%)' }} />

      {/* hidden glowing 9 behind the headline area */}
      <svg className="absolute top-[8%] left-[34%] w-[44vw] max-w-[640px] hero-anim-slow" viewBox="0 0 200 280" fill="none" style={{ opacity: 0.16 }}>
        <defs>
          <linearGradient id="nine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F5B81A" />
            <stop offset="1" stopColor="#C98A12" />
          </linearGradient>
        </defs>
        <text x="50%" y="74%" textAnchor="middle" fontSize="280" fontFamily="Georgia, serif" fontWeight="700"
          fill="url(#nine)" style={{ filter: 'drop-shadow(0 0 40px rgba(245,184,26,.55))' }}>9</text>
      </svg>

      {/* starfield (static) */}
      <div className="absolute inset-0" style={{
        backgroundImage: [
          'radial-gradient(1.5px 1.5px at 12% 22%, rgba(74,144,245,.55), transparent)',
          'radial-gradient(1.5px 1.5px at 28% 64%, rgba(245,184,26,.45), transparent)',
          'radial-gradient(1px 1px at 47% 33%, rgba(200,220,255,.5), transparent)',
          'radial-gradient(1.5px 1.5px at 63% 18%, rgba(74,144,245,.5), transparent)',
          'radial-gradient(1px 1px at 78% 52%, rgba(245,184,26,.4), transparent)',
          'radial-gradient(1.5px 1.5px at 88% 30%, rgba(200,220,255,.5), transparent)',
          'radial-gradient(1px 1px at 38% 82%, rgba(74,144,245,.4), transparent)',
          'radial-gradient(1px 1px at 70% 78%, rgba(200,220,255,.45), transparent)',
          'radial-gradient(1px 1px at 18% 48%, rgba(245,184,26,.35), transparent)',
          'radial-gradient(1px 1px at 55% 88%, rgba(74,144,245,.4), transparent)',
        ].join(','),
        backgroundRepeat: 'no-repeat',
      }} />

      {/* twinkling particle overlay (animated) */}
      <div className="absolute inset-0 hero-anim-twinkle" style={{
        backgroundImage: [
          'radial-gradient(1.5px 1.5px at 33% 28%, rgba(255,255,255,.7), transparent)',
          'radial-gradient(1.5px 1.5px at 72% 40%, rgba(245,184,26,.7), transparent)',
          'radial-gradient(1px 1px at 50% 60%, rgba(74,144,245,.7), transparent)',
          'radial-gradient(1.5px 1.5px at 85% 70%, rgba(255,255,255,.6), transparent)',
        ].join(','),
        backgroundRepeat: 'no-repeat',
      }} />

      {/* animated global network lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="netline" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4A90F5" stopOpacity="0.55" />
            <stop offset="1" stopColor="#F5B81A" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <polyline className="hero-anim-dash" points="120,150 320,260 520,180 760,300 980,220 1180,320" fill="none" stroke="url(#netline)" strokeWidth="1" strokeDasharray="6 10" />
        <polyline className="hero-anim-dash" points="80,520 320,430 560,560 820,470 1080,580 1320,500" fill="none" stroke="url(#netline)" strokeWidth="1" strokeDasharray="6 10" />
        <polyline className="hero-anim-dash" points="200,700 460,640 720,720 980,650 1240,740" fill="none" stroke="url(#netline)" strokeWidth="1" strokeDasharray="6 10" />
      </svg>

      {/* faint official torch mark (the 9 emblem) — top right */}
      <img src="/brand/official/official-mark.svg" alt="" className="absolute top-[10%] right-[7%] w-[26vw] max-w-[400px] opacity-[0.08]"
        style={{ filter: 'drop-shadow(0 0 60px rgba(245,184,26,.4)) drop-shadow(0 0 36px rgba(74,144,245,.3))' }} />

      {/* glow blobs */}
      <div className="absolute top-24 right-24 w-[420px] h-[420px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(74,144,245,.14), transparent 70%)' }} />
      <div className="absolute bottom-8 left-10 w-[460px] h-[460px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,184,26,.08), transparent 70%)' }} />

      <style>{`
        @keyframes heroTwinkle { 0%,100%{opacity:.35} 50%{opacity:.9} }
        @keyframes heroDash { to { stroke-dashoffset: -160; } }
        @keyframes heroFloatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .hero-anim-twinkle { animation: heroTwinkle 4.5s ease-in-out infinite; }
        .hero-anim-dash { animation: heroDash 9s linear infinite; }
        .hero-anim-slow { animation: heroFloatSlow 10s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-anim-twinkle, .hero-anim-dash, .hero-anim-slow { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
