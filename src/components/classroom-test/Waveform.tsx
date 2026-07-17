import { useMemo } from "react";

interface WaveformProps {
  bars?: number;
  className?: string;
  /** when false, bars freeze in the idle (quiet) position */
  active?: boolean;
}

/**
 * Animated voice equalizer used in the sidebar "Speaking…" state and the
 * transcript card. Pure CSS animation — UI only, no audio processing.
 */
export function Waveform({ bars = 40, className = "", active = true }: WaveformProps) {
  // Deterministic pseudo-random heights + delays so the wave looks organic
  // but stable across renders.
  const config = useMemo(
    () =>
      Array.from({ length: bars }).map((_, i) => {
        const seed = Math.sin(i * 12.9898) * 43758.5453;
        const rand = seed - Math.floor(seed);
        return {
          delay: `${(rand * 1.1).toFixed(2)}s`,
          duration: `${(0.8 + rand * 0.7).toFixed(2)}s`,
          minScale: 0.25 + rand * 0.35,
        };
      }),
    [bars],
  );

  return (
    <div className={`ct-wave ${active ? "" : "is-idle"} ${className}`} aria-hidden="true">
      {config.map((c, i) => (
        <span
          key={i}
          className="ct-wave-bar"
          style={{
            height: "100%",
            animationDelay: c.delay,
            animationDuration: c.duration,
          }}
        />
      ))}
    </div>
  );
}

export default Waveform;
