// =============================================================================
// HeroStoryReel — the hero's inline story film. Per Founder direction:
// the film is the ONLY visual (no placeholder scenes, no map, no mission card,
// no seal/logo finale, no progress bars) and it always plays end-to-end on a
// loop. The FULL story is told through the subtitle track below the film —
// the same lines the story always had — rotating at a readable pace while
// the film loops.
//
// Accessibility: labelled for screen readers; a hover pause/play control holds
// both the film and the subtitle track.
// =============================================================================
import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import storyFilm from '@/assets/story-scene1.mp4';

// The original story subtitles, in order. Each group holds one beat of the story.
const SUBTITLES: string[][] = [
  ['She dreamed of something more.'],
  ['He worked hard every day.', 'But he wanted a different future.'],
  ['His job paid the bills.', 'His passion was technology.'],
  ['He fixed devices.', 'He wanted to build the future.'],
  ['Leading teams. Working globally.', 'Building with AI — with confidence and dignity.'],
  ['Talent exists everywhere. Opportunity should too.'],
];

const SUBTITLE_MS = 5000; // readable pace; full story cycles every ~30s

export default function HeroStoryReel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);

  // Rotate the subtitle track while playing. Holding the frame holds the text.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SUBTITLES.length), SUBTITLE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPaused(false); }
    else { v.pause(); setPaused(true); }
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="img"
      aria-label="Aladiah student story — from potential to opportunity"
      className="relative block w-full rounded-3xl overflow-hidden border border-border/40 aspect-video bg-[#0B111E]"
      style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,.7), 0 0 60px rgba(74,144,245,.12)' }}
    >
      <video
        ref={videoRef}
        src={storyFilm}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* story subtitles — the full original sequence, rotating while the film loops */}
      <div key={idx} className="hero-subtitle-fade" style={{ position: 'absolute', left: 0, right: 0, bottom: 24, padding: '0 28px', textAlign: 'center' }}>
        {SUBTITLES[idx].map((line, i) => (
          <p key={i} style={{ color: '#fff', fontSize: 17, fontWeight: 600, textShadow: '0 2px 12px rgba(0,0,0,.8)', margin: '4px 0' }}>{line}</p>
        ))}
      </div>

      {/* bottom gradient for subtitle legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent 40%)', pointerEvents: 'none' }} />

      {/* hover pause/play — lets a viewer hold a frame (and the current line) */}
      {hover && (
        <button
          onClick={togglePlay}
          aria-label={paused ? 'Play story' : 'Pause story'}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      )}

      <style>{`
        .hero-subtitle-fade { animation: heroSubFade .6s ease; }
        @keyframes heroSubFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .hero-subtitle-fade { animation: none; } }
      `}</style>
    </div>
  );
}
