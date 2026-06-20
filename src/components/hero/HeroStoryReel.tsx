// =============================================================================
// HeroStoryReel — the hero's inline, auto-playing story film. It chains the
// student journey (Dominican Republic → Cameroon → France → Ghana → after
// Aladiah → global map → mission) and loops forever, with no click and no
// modal: it just plays. Real footage plays where it exists; scenes still
// awaiting footage show an honest captioned placeholder ("Footage coming
// soon"). To light a placeholder up, drop a clip into its beat and switch
// kind → 'video'. The official seal is reserved for the centered hero emblem
// and certificates — it is intentionally not used here.
//
// Accessibility: decorative reel labelled for screen readers; honours
// prefers-reduced-motion by pausing auto-advance. A hover pause/play control
// lets viewers hold a frame.
// =============================================================================
import { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import scene1 from '@/assets/story-scene1.mp4';

type Beat =
  | { kind: 'video'; src: string; captions: string[]; ms: number }
  | { kind: 'placeholder'; location: string; captions: string[]; ms: number }
  | { kind: 'map'; captions: string[]; ms: number }
  | { kind: 'mission'; lines: string[]; ms: number };

// Real footage is wired where it exists; the rest are captioned placeholders
// until production clips are supplied (drop a clip in and switch kind→'video').
const beats: Beat[] = [
  { kind: 'video', src: scene1, captions: ['She dreamed of something more.'], ms: 6000 },
  { kind: 'placeholder', location: 'Mokolo Market · Yaoundé, Cameroon', captions: ['He worked hard every day.', 'But he wanted a different future.'], ms: 6000 },
  { kind: 'placeholder', location: 'France', captions: ['His job paid the bills.', 'His passion was technology.'], ms: 6000 },
  { kind: 'placeholder', location: 'Ghana', captions: ['He fixed devices.', 'He wanted to build the future.'], ms: 6000 },
  { kind: 'placeholder', location: 'After Aladiah', captions: ['Leading teams. Working globally.', 'Building with AI — with confidence and dignity.'], ms: 6000 },
  { kind: 'map', captions: ['Talent exists everywhere. Opportunity should too.'], ms: 6000 },
  { kind: 'mission', lines: ['The Future of Work Starts Here', 'Master AI. Transform Your Career.'], ms: 5500 },
];

const CITIES: { label: string; x: number; y: number }[] = [
  { label: 'Santo Domingo', x: 26, y: 46 },
  { label: 'Miami', x: 22, y: 36 },
  { label: 'London', x: 49, y: 26 },
  { label: 'Paris', x: 52, y: 30 },
  { label: 'Accra', x: 50, y: 56 },
  { label: 'Yaoundé', x: 56, y: 60 },
];

export default function HeroStoryReel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);

  // Auto-advance through the chain and loop. Honour reduced-motion by holding.
  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % beats.length), beats[idx].ms);
    return () => clearTimeout(t);
  }, [paused, idx]);

  const beat = beats[idx];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="img"
      aria-label="Aladiah student stories — from potential to opportunity"
      className="relative block w-full rounded-3xl overflow-hidden border border-border/40 aspect-video bg-[#0B111E]"
      style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,.7), 0 0 60px rgba(74,144,245,.12)' }}
    >
      {beat.kind === 'video' && (
        <video key={idx} src={beat.src} autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover" />
      )}

      {beat.kind === 'placeholder' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(120% 100% at 50% 0%, #15233f, #0B111E)' }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#8596AD', marginBottom: 8 }}>{beat.location}</div>
          <div style={{ fontSize: 10, color: '#5b6b86', border: '1px solid #243352', borderRadius: 999, padding: '3px 10px' }}>Original footage coming soon.</div>
        </div>
      )}

      {beat.kind === 'map' && <StoryMap />}

      {beat.kind === 'mission' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, background: 'radial-gradient(120% 100% at 50% 0%, #101d36, #070D18)' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#EDF2F7', marginBottom: 12, lineHeight: 1.2 }}>{beat.lines[0]}</div>
          <div style={{ fontSize: 15, color: '#F5B81A', fontWeight: 600 }}>{beat.lines[1]}</div>
        </div>
      )}

      {/* captions */}
      {'captions' in beat && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 52, padding: '0 28px', textAlign: 'center' }}>
          {beat.captions.map((c, i) => (
            <p key={i} style={{ color: '#fff', fontSize: 17, fontWeight: 600, textShadow: '0 2px 12px rgba(0,0,0,.8)', margin: '4px 0' }}>{c}</p>
          ))}
        </div>
      )}

      {/* gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent 40%)', pointerEvents: 'none' }} />

      {/* progress segments */}
      <div style={{ position: 'absolute', bottom: 14, left: 20, right: 20, display: 'flex', gap: 6 }}>
        {beats.map((_, i) => (
          <div key={i} style={{ height: 3, flex: 1, borderRadius: 99, background: i < idx ? 'rgba(255,255,255,.7)' : i === idx ? '#F5B81A' : 'rgba(255,255,255,.2)' }} />
        ))}
      </div>

      {/* hover pause/play — lets a viewer hold a frame */}
      {hover && (
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play story' : 'Pause story'}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

function StoryMap() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 100% at 50% 0%, #0f1c34, #070D18)' }}>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {CITIES.map((a, i) =>
          CITIES.slice(i + 1).map((b, j) => (
            <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#4A90F5" strokeOpacity="0.25" strokeWidth="0.2" />
          ))
        )}
        {CITIES.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="0.7" fill="#F5B81A" />
            <circle cx={c.x} cy={c.y} r="1.6" fill="none" stroke="#F5B81A" strokeOpacity="0.4" strokeWidth="0.2" />
          </g>
        ))}
      </svg>
      {CITIES.map((c, i) => (
        <span key={i} style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, 10px)', fontSize: 9, color: '#c7d2fe', whiteSpace: 'nowrap' }}>{c.label}</span>
      ))}
    </div>
  );
}
