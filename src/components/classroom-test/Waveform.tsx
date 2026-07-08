import { CT } from './theme';

/** CSS-animated speaking waveform — no audio, test prototype only. */
export default function Waveform({ bars = 5, height = 18, color = CT.green }: { bars?: number; height?: number; color?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, height }} aria-hidden>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="ct-wave-bar"
          style={{
            width: 3,
            borderRadius: 2,
            background: color,
            animationDelay: `${i * 0.12}s`,
            height: '30%',
          }}
        />
      ))}
    </span>
  );
}
