import { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Aladiah Academy — Creed Acknowledgment Gate
 *
 * Shows ONCE per calendar day, on first login of that day.
 * Student must:
 *   1. Scroll through the full creed (button enables only after scroll-to-bottom)
 *   2. Check the acknowledgment checkbox
 *   3. Click the "I acknowledge" button
 *
 * Uses localStorage with a date key — no DB writes, no PII stored.
 * Key: `aladiah_creed_ack_date` → value: `YYYY-MM-DD` (local timezone)
 *
 * "Next day" is detected intelligently by comparing the student's LOCAL
 * calendar date, so it triggers at their midnight (handles DST, travel,
 * timezone changes).
 *
 * Usage in StudentPortal:
 *   import { CreedAcknowledgmentGate, shouldShowCreedGate } from '@/components/CreedAcknowledgmentGate';
 *
 *   const [gateOpen, setGateOpen] = useState(shouldShowCreedGate());
 *   if (gateOpen) return <CreedAcknowledgmentGate studentName={user.name} onAcknowledge={() => setGateOpen(false)} />;
 *   return <ActualPortalContent />;
 */

const CREED_STANZAS: string[][] = [
  [
    'I am a student of Aladiah Academy.',
    'I am a learner and a member of a global community.',
    "I pursue knowledge and live the academy's values.",
  ],
  [
    'I will always place growth first.',
    'I will never accept mediocrity.',
    'I will never quit.',
    'I will never leave a fellow student behind.',
  ],
  [
    'I am disciplined, mentally sharp and emotionally resilient,',
    'trained and proficient in the craft I have chosen to master.',
    'I invest daily in my mind, my skills, and my character.',
    'I am a professional in the making and an expert in the becoming.',
    'I stand ready to lead, to serve, and to create real impact',
    'in my career, my family, and my community.',
    'I am a guardian of knowledge and a builder of a better future.',
    'I am a student of Aladiah Academy.',
  ],
];

const STORAGE_KEY = 'aladiah_creed_ack_date';

/** Returns today's LOCAL date as YYYY-MM-DD (uses student's timezone). */
export const getLocalDateString = (): string => {
  return new Date().toLocaleDateString('en-CA'); // en-CA always gives ISO YYYY-MM-DD
};

/**
 * Pure check — does the student need to see the creed right now?
 * Call this in StudentPortal before mounting the gate.
 */
export const shouldShowCreedGate = (): boolean => {
  try {
    const lastAck = localStorage.getItem(STORAGE_KEY);
    return lastAck !== getLocalDateString();
  } catch {
    // localStorage blocked (private mode / cookies disabled) — show gate to be safe
    return true;
  }
};

interface CreedAcknowledgmentGateProps {
  studentName?: string;
  onAcknowledge: () => void;
}

export const CreedAcknowledgmentGate = ({
  studentName,
  onAcknowledge,
}: CreedAcknowledgmentGateProps) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Detect scroll-to-bottom to unlock the checkbox
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    // 16px tolerance so we don't require pixel-perfect scroll
    if (scrollTop + clientHeight >= scrollHeight - 16) {
      setHasScrolledToEnd(true);
    }
  };

  // Edge case: if creed fits without scrolling, unlock immediately after mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight + 16) {
      setHasScrolledToEnd(true);
    }
  }, []);

  const handleAcknowledge = () => {
    if (!hasScrolledToEnd || !isChecked || isSubmitting) return;
    setIsSubmitting(true);
    try {
      localStorage.setItem(STORAGE_KEY, getLocalDateString());
    } catch {
      // Silently continue — student experience is more important than persistence
    }
    // Tiny delay for the button animation, then unmount
    setTimeout(() => onAcknowledge(), 400);
  };

  const canAcknowledge = hasScrolledToEnd && isChecked && !isSubmitting;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 sm:p-8"
      style={{
        background: 'rgba(10, 18, 36, 0.92)',
        backdropFilter: 'blur(8px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="creed-title"
    >
      <div
        className="relative w-full max-w-3xl my-auto"
        style={{
          background: 'linear-gradient(180deg, #f8f4ea 0%, #ede4cc 100%)',
          border: '2px solid #1a2a4a',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(212, 175, 55, 0.3)',
          borderRadius: '2px',
        }}
      >
        {/* Gold inner frame */}
        <div
          className="absolute inset-2 pointer-events-none"
          style={{ border: '1px solid #d4af37', borderRadius: '1px' }}
        />

        {/* Corner flourishes */}
        <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#d4af37]" />

        <div className="relative px-6 sm:px-12 py-8 sm:py-10">
          {/* Seal watermark (decorative, in background) */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: 0.08 }}
            aria-hidden="true"
          >
            <img
              src="/aladiah-academy-seal.svg"
              alt=""
              className="w-[500px] h-[500px] max-w-none"
            />
          </div>

          {/* Header */}
          <div className="relative text-center">
            <p
              className="text-[10px] sm:text-xs tracking-[0.3em] text-[#1a2a4a]/70 mb-3 font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {today.toUpperCase()}
            </p>
            <h1
              id="creed-title"
              className="text-2xl sm:text-3xl tracking-wider text-[#1a2a4a] font-normal"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}
            >
              ALADIAH ACADEMY
            </h1>
            <h2
              className="text-lg sm:text-xl tracking-wider text-[#1a2a4a] mt-1 font-normal"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}
            >
              STUDENT CREED
            </h2>

            <div className="flex items-center justify-center gap-2 my-4">
              <div className="h-px w-16 sm:w-24 bg-[#d4af37]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              <div className="h-px w-16 sm:w-24 bg-[#d4af37]" />
            </div>

            {studentName && (
              <p
                className="text-sm sm:text-base text-[#1a2a4a] italic mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Welcome back, {studentName ? studentName.charAt(0).toUpperCase() + studentName.slice(1) : ''}.
              </p>
            )}
            <p
              className="text-xs sm:text-sm text-[#1a2a4a]/80 mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Before entering the portal, take a moment to renew your commitment.
            </p>
          </div>

          {/* Scrollable creed body */}
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="relative max-h-[45vh] sm:max-h-[380px] overflow-y-auto px-4 sm:px-8 py-6 my-2"
              style={{
                fontFamily: 'Georgia, serif',
                color: '#1a2a4a',
                // Subtle inset shadow to hint scrollability
                boxShadow: 'inset 0 8px 12px -8px rgba(26, 42, 74, 0.15), inset 0 -8px 12px -8px rgba(26, 42, 74, 0.15)',
              }}
            >
              {CREED_STANZAS.map((stanza, stanzaIdx) => (
                <div key={stanzaIdx} className={stanzaIdx > 0 ? 'mt-5' : ''}>
                  {stanza.map((line, lineIdx) => (
                    <p
                      key={lineIdx}
                      className="text-[15px] sm:text-[16px] leading-relaxed font-medium"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}

              {/* Tagline pinned to end */}
              <div className="mt-8 pt-4 border-t border-[#d4af37]/40 text-center">
                <p
                  className="italic text-lg tracking-[0.25em] text-[#1a2a4a]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Solo Excelencia
                </p>
                <p
                  className="text-[10px] sm:text-xs tracking-[0.2em] text-[#1a2a4a]/80 mt-2 font-medium"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  KNOWLEDGE · DISCIPLINE · COMMUNITY · IMPACT
                </p>
              </div>
            </div>

            {/* "Scroll to continue" hint — fades out when scrolled to end */}
            {!hasScrolledToEnd && (
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none flex items-end justify-center pb-3"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(248, 244, 234, 0) 0%, rgba(237, 228, 204, 0.95) 80%)',
                  height: '80px',
                }}
              >
                <div className="flex items-center gap-2 text-[#1a2a4a]/70 text-xs font-medium animate-bounce">
                  <ChevronDown className="w-4 h-4" />
                  <span style={{ fontFamily: 'Georgia, serif' }}>
                    Scroll to read the full creed
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Acknowledgment controls */}
          <div className="relative mt-6 pt-4 border-t border-[#1a2a4a]/15">
            <label
              className={`flex items-start gap-3 cursor-pointer transition-opacity ${
                hasScrolledToEnd ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={!hasScrolledToEnd}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="sr-only peer"
                  aria-label="I have read and acknowledge the Aladiah Academy Student Creed"
                />
                <div
                  className="w-5 h-5 border-2 border-[#1a2a4a] bg-[#f8f4ea] transition-colors peer-checked:bg-[#1a2a4a] flex items-center justify-center"
                  style={{ borderRadius: '2px' }}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 text-[#d4af37]" strokeWidth={3} />}
                </div>
              </div>
              <span
                className="text-sm sm:text-[15px] text-[#1a2a4a] leading-snug"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                I have read the Aladiah Academy Student Creed and commit to living these values today.
              </span>
            </label>

            <button
              type="button"
              onClick={handleAcknowledge}
              disabled={!canAcknowledge}
              className={`mt-5 w-full py-3 sm:py-3.5 text-sm sm:text-base tracking-[0.15em] transition-all ${
                canAcknowledge
                  ? 'bg-[#1a2a4a] text-[#d4af37] hover:bg-[#0f1d3a] cursor-pointer'
                  : 'bg-[#1a2a4a]/30 text-[#f8f4ea]/60 cursor-not-allowed'
              }`}
              style={{
                fontFamily: 'Georgia, serif',
                fontWeight: 500,
                border: canAcknowledge ? '1px solid #d4af37' : '1px solid transparent',
                borderRadius: '2px',
              }}
            >
              {isSubmitting ? 'ENTERING PORTAL…' : 'I ACKNOWLEDGE — ENTER PORTAL'}
            </button>

            {!hasScrolledToEnd && (
              <p
                className="text-[11px] text-center text-[#1a2a4a]/60 mt-3 italic"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Please read the full creed to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreedAcknowledgmentGate;
