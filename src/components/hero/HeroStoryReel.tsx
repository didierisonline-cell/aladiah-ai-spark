// =============================================================================
// HeroStoryReel — the hero's inline story film. Per Founder direction this is
// the FULL story clip only: it plays end-to-end with its caption and loops.
// No placeholder scenes, no map, no mission card, no seal/logo finale, no
// progress segments — just the film.
//
// Accessibility: labelled for screen readers; a hover pause/play control lets
// viewers hold a frame.
// =============================================================================
import { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import storyFilm from '@/assets/story-scene1.mp4';

const CAPTION = 'She dreamed of something more.';

export default function HeroStoryReel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);

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

      {/* caption */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 28, padding: '0 28px', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: 17, fontWeight: 600, textShadow: '0 2px 12px rgba(0,0,0,.8)', margin: 0 }}>{CAPTION}</p>
      </div>

      {/* bottom gradient for caption legibility */}
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
    </div>
  );
}
