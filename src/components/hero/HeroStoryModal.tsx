// =============================================================================
// HeroStoryModal — the full-screen "story experience" opened by the hero's
// "Watch Success Stories" CTA. It reuses HeroStoryReel (the same chained,
// looping student journey) at a larger size, so there is a single source of
// truth for the story content. Essential on mobile, where the inline hero card
// is hidden — this modal is the only way to view the story there.
//
// Accessibility: role=dialog/aria-modal, Escape + backdrop close, scroll lock,
// initial focus on the close control, and focus restored to the trigger on close.
// =============================================================================
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import HeroStoryReel from './HeroStoryReel';

export default function HeroStoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const f = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(f);
      document.removeEventListener('keydown', onKey);
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Aladiah Academy — From potential to opportunity."
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(3,7,15,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 960 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: '#F5B81A', fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>From potential to opportunity.</span>
          <button ref={closeRef} onClick={onClose} aria-label="Close video"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 999, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)', color: '#fff', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
        <HeroStoryReel />
      </div>
    </div>
  );
}
