// =============================================================================
// HeroStoryReel — the hero's inline story film. Per Founder direction:
// the film plays entirely on a loop with exactly TWO subtitles, synced to the
// film's own timeline (first half / second half of each loop):
//   1. "She dreamed of something more."
//   2. "Talent exists everywhere. Opportunity should too."
// No placeholder scenes, no map, no mission card, no seal/logo, no progress
// bars. NOTE: src/assets/story-scene1.mp4 is Scene 1 only (restaurant). When
// the full journey film (phone → study → job → apartment) is supplied, drop it
// in and re-time SUBTITLE_SWITCH below.
//
// Accessibility: labelled for screen readers; hover pause/play holds the frame.
// =============================================================================
import { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import storyFilm from '@/assets/story-scene1.mp4';

const OPENING_LINE = 'She dreamed of something more.';
const CLOSING_LINE = 'Talent exists everywhere. Opportunity should too.';
// Fraction of the film's duration at which the subtitle switches.
const SUBTITLE_SWITCH = 0.5;

export default function HeroStoryReel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [secondHalf, setSecondHalf] = useState(false);

  // Subtitles are driven by the film's own clock, so they stay in sync with
  // every loop and pause with the film automatically.
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setSecondHalf(v.currentTime / v.duration >= SUBTITLE_SWITCH);
  };

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
        onTimeUpdate={onTimeUpdate}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* subtitles — synced to the film's timeline */}
      <div key={secondHalf ? 1 : 0} className="hero-subtitle-fade" style={{ position: 'absolute', left: 0, right: 0, bottom: 26, padding: '0 28px', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: 17, fontWeight: 600, textShadow: '0 2px 12px rgba(0,0,0,.8)', margin: 0 }}>
          {secondHalf ? CLOSING_LINE : OPENING_LINE}
        </p>
      </div>

      {/* bottom gradient for subtitle legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent 40%)', pointerEvents: 'none' }} />

      {/* hover pause/play — lets a viewer hold a frame */}
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
        .hero-subtitle-fade { animation: heroSubFade .5s ease; }
        @keyframes heroSubFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .hero-subtitle-fade { animation: none; } }
      `}</style>
    </div>
  );
}
