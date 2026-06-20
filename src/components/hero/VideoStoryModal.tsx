// =============================================================================
// VideoStoryModal — the "Real stories. Real transformations." hero film.
// A data-driven storyboard (DR → Cameroon → France → Ghana → transformation →
// global map → mission → seal finale). Scenes with real footage play it; scenes
// awaiting footage show an honest captioned placeholder. The official SEAL
// appears ONLY in the final scene. Designed so final video files swap in by
// dropping clips into the `beats` media srcs.
//
// Accessibility: role=dialog/aria-modal, Escape + backdrop close, initial focus
// on the close control and focus restored on close, progress + play/pause.
// =============================================================================
import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Play, Pause } from 'lucide-react';
import scene1 from '@/assets/story-scene1.mp4';

type Beat =
  | { kind: 'video'; src: string; captions: string[]; ms: number }
  | { kind: 'placeholder'; location: string; captions: string[]; ms: number }
  | { kind: 'map'; captions: string[]; ms: number }
  | { kind: 'mission'; lines: string[]; ms: number }
  | { kind: 'seal'; ms: number };

// Real footage is wired where it exists; the rest are captioned placeholders
// until production clips are supplied (drop a clip in and switch kind→'video').
const beats: Beat[] = [
  { kind: 'video', src: scene1, captions: ['She dreamed of something more.'], ms: 6000 },
  { kind: 'placeholder', location: 'Mokolo Market · Yaoundé, Cameroon', captions: ['He worked hard every day.', 'But he wanted a different future.'], ms: 6000 },
  { kind: 'placeholder', location: 'France', captions: ['His job paid the bills.', 'His passion was technology.'], ms: 6000 },
  { kind: 'placeholder', location: 'Ghana', captions: ['He fixed devices.', 'He wanted to build the future.'], ms: 6000 },
  { kind: 'placeholder', location: 'After Aladiah', captions: ['Leading teams. Working globally.', 'Building with AI — with confidence and dignity.'], ms: 6000 },
  { kind: 'map', captions: ['Talent exists everywhere. Opportunity should too.'], ms: 6000 },
  { kind: 'mission', lines: ['The Future of Work Starts Here', 'Master AI. Transform Your Career. Build the Future.'], ms: 5500 },
  { kind: 'seal', ms: 5000 },
];

const CITIES: { label: string; x: number; y: number }[] = [
  { label: 'Santo Domingo', x: 26, y: 46 },
  { label: 'Miami', x: 22, y: 36 },
  { label: 'London', x: 49, y: 26 },
  { label: 'Paris', x: 52, y: 30 },
  { label: 'Accra', x: 50, y: 56 },
  { label: 'Yaoundé', x: 56, y: 60 },
];

export default function VideoStoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  // open/close lifecycle: reset, lock scroll, focus, restore focus
  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement;
    setIdx(0); setPaused(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const f = setTimeout(() => closeRef.current?.focus(), 50);
    return () => { document.body.style.overflow = prevOverflow; clearTimeout(f); prevFocus.current?.focus?.(); };
  }, [open]);

  // advance timer
  useEffect(() => {
    if (!open || paused) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % beats.length), beats[idx].ms);
    return () => clearTimeout(t);
  }, [open, paused, idx]);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p); }
  }, [onClose]);

  if (!open) return null;
  const beat = beats[idx];

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Aladiah Academy — Real stories. Real transformations."
      onKeyDown={onKey}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(3,7,15,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 960 }}>
        {/* top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: '#F5B81A', fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Real stories. Real transformations.</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'}
              style={ctrl}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
            <button ref={closeRef} onClick={onClose} aria-label="Close video"
              style={ctrl}><X size={16} /></button>
          </div>
        </div>

        {/* stage */}
        <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 18, overflow: 'hidden', background: '#0B111E', border: '1px solid #1E2D47', boxShadow: '0 30px 90px -20px rgba(0,0,0,.8)' }}>
          {beat.kind === 'video' && (
            <video key={idx} src={beat.src} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          )}

          {beat.kind === 'placeholder' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(120% 100% at 50% 0%, #15233f, #0B111E)' }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#8596AD', marginBottom: 8 }}>{beat.location}</div>
              <div style={{ fontSize: 10, color: '#5b6b86', border: '1px solid #243352', borderRadius: 999, padding: '3px 10px' }}>Footage coming soon</div>
            </div>
          )}

          {beat.kind === 'map' && <StoryMap />}

          {beat.kind === 'mission' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, background: 'radial-gradient(120% 100% at 50% 0%, #101d36, #070D18)' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#EDF2F7', marginBottom: 14, lineHeight: 1.2 }}>{beat.lines[0]}</div>
              <div style={{ fontSize: 16, color: '#F5B81A', fontWeight: 600 }}>{beat.lines[1]}</div>
            </div>
          )}

          {beat.kind === 'seal' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0B111E' }}>
              <div style={{ position: 'absolute', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,184,26,.22), transparent 70%)' }} />
              <img src="/brand/official/official-seal.svg" alt="Aladiah Academy seal" style={{ width: 150, height: 150, filter: 'drop-shadow(0 0 30px rgba(245,184,26,.6))' }} />
              <div style={{ marginTop: 18, color: '#fff', fontWeight: 800, fontSize: 20 }}>Aladiah Academy</div>
              <div style={{ marginTop: 6, color: '#F5B81A', fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Intelligence • Purpose • Impact</div>
            </div>
          )}

          {/* captions */}
          {'captions' in beat && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, padding: '0 28px', textAlign: 'center' }}>
              {beat.captions.map((c, i) => (
                <p key={i} style={{ color: '#fff', fontSize: 18, fontWeight: 600, textShadow: '0 2px 12px rgba(0,0,0,.8)', margin: '4px 0' }}>{c}</p>
              ))}
            </div>
          )}

          {/* gradient + progress */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent 40%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 20, right: 20, display: 'flex', gap: 6 }}>
            {beats.map((_, i) => (
              <div key={i} style={{ height: 3, flex: 1, borderRadius: 99, background: i < idx ? 'rgba(255,255,255,.7)' : i === idx ? '#F5B81A' : 'rgba(255,255,255,.2)' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ctrl: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34,
  borderRadius: 999, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)',
  color: '#fff', cursor: 'pointer',
};

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
