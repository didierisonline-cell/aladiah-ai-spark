import professorImg from '@/assets/professor-didier.png';
import { CT, panelStyle, TEST_SESSION } from './theme';
import Waveform from './Waveform';

/** Center column hero: cinematic professor stage with glow, LIVE chip and waveform. */
export default function ProfessorStage() {
  return (
    <section
      style={{
        ...panelStyle,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 300,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse 70% 90% at 50% 100%, ${CT.glowBlue}, transparent 70%),
          radial-gradient(ellipse 50% 60% at 75% 15%, ${CT.glowPurple}, transparent 70%),
          linear-gradient(180deg, #0A1120 0%, #0B1426 55%, #0D1830 100%)
        `,
      }}
    >
      {/* Atmospheric light beams */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(115deg, transparent 42%, rgba(74,144,245,.05) 50%, transparent 58%)',
        }}
      />

      {/* LIVE chip */}
      <span
        style={{
          position: 'absolute', top: 14, left: 14, zIndex: 3,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 10, fontWeight: 800, letterSpacing: '.1em', color: '#fff',
          background: 'rgba(239,68,68,.85)', borderRadius: 8, padding: '4px 10px',
          boxShadow: '0 2px 12px rgba(239,68,68,.45)',
        }}
      >
        <span className="ct-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
        LIVE
      </span>

      {/* Lesson chip */}
      <span
        style={{
          position: 'absolute', top: 14, right: 14, zIndex: 3,
          fontSize: 10.5, fontWeight: 700, color: CT.fm,
          background: 'rgba(13,21,38,.75)', border: `1px solid ${CT.border}`,
          borderRadius: 8, padding: '4px 10px', backdropFilter: 'blur(8px)',
        }}
      >
        {TEST_SESSION.lesson}
      </span>

      {/* Warm studio backdrop — extends the portrait's amber background seamlessly */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 62% 130% at 50% 42%, #D89C43 0%, #C8892F 55%, #7A5320 78%, transparent 96%)',
        }}
      />

      {/* Professor — fully visible portrait on the matching backdrop */}
      <img
        src={professorImg}
        alt="Professor Didier™ teaching live"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain', objectPosition: 'center bottom',
        }}
      />

      {/* Cinematic blend: vignette + color grade over the feed */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: `
            linear-gradient(180deg, rgba(7,11,20,.6) 0%, transparent 26%, transparent 60%, rgba(7,11,20,.8) 100%),
            radial-gradient(ellipse 95% 120% at 50% 42%, transparent 42%, rgba(7,11,20,.9) 92%),
            linear-gradient(115deg, rgba(74,144,245,.12), transparent 45%, rgba(139,92,246,.12))
          `,
        }}
      />

      {/* Name plate + waveform */}
      <div
        style={{
          position: 'absolute', bottom: 12, left: 14, zIndex: 3,
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(9,14,26,.8)', border: `1px solid ${CT.border}`,
          borderRadius: 12, padding: '8px 14px', backdropFilter: 'blur(10px)',
        }}
      >
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: CT.fg }}>
            Professor Didier<span style={{ fontSize: 8, verticalAlign: 'super' }}>™</span>
          </div>
          <div style={{ fontSize: 9.5, fontWeight: 600, color: CT.green, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Waveform bars={4} height={10} /> Speaking
          </div>
        </div>
      </div>
    </section>
  );
}
