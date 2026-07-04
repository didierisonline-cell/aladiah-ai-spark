import professorImg from '@/assets/professor-didier.png';
import classroomBg from '@/assets/classroom-bg.jpg';
import { VoiceStatus } from './types';

interface ProfessorPresenceEngineProps {
  status: VoiceStatus;
  isConnected: boolean;
  isSpeaking: boolean;
  professorName?: string;
  caption?: string;
}

function AudioWaveform({ active, speaking }: { active: boolean; speaking: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 20 }}>
      {Array.from({ length: 22 }).map((_, i) => {
        const h = active
          ? (speaking ? 4 + Math.abs(Math.sin(i * 0.65)) * 16 : 2 + Math.abs(Math.sin(i * 0.8)) * 7)
          : 2;
        return (
          <div key={i} style={{
            width: 2.5, borderRadius: 99,
            background: speaking ? '#4A90F5' : '#22C98A',
            height: h,
            animation: active ? `ppeWave${i % 5} ${0.55 + (i % 5) * 0.13}s ease-in-out infinite alternate` : 'none',
            opacity: active ? (0.35 + Math.abs(Math.sin(i * 0.5)) * 0.65) : 0.2,
            transition: 'background 0.4s, opacity 0.4s',
          }} />
        );
      })}
    </div>
  );
}

export default function ProfessorPresenceEngine({
  status, isConnected, isSpeaking,
  professorName = 'Professor Didier™',
  caption = '',
}: ProfessorPresenceEngineProps) {
  const statusLabel = isSpeaking ? 'Speaking…'
    : isConnected ? 'Listening…'
    : status === 'connecting' ? 'Connecting…'
    : 'Ready to begin';

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      background: '#03070F',
    }}>
      {/* ── PROFESSOR CINEMATIC AREA ───────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>

        {/* Layer 1 — Classroom background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${classroomBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'brightness(0.15) saturate(0.4)',
        }} />

        {/* Layer 2 — Edge vignette (cinematic depth) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 95% at 50% 40%, transparent 25%, rgba(3,7,16,.72) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Layer 3 — Overhead studio light */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 30% at 50% -8%, rgba(200,220,255,.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Layer 4 — Floor ambient glow (voice-reactive) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isSpeaking
            ? 'radial-gradient(ellipse 95% 52% at 50% 118%, rgba(74,144,245,.70) 0%, rgba(74,144,245,.28) 40%, transparent 68%)'
            : isConnected
            ? 'radial-gradient(ellipse 95% 52% at 50% 118%, rgba(34,201,138,.50) 0%, rgba(34,201,138,.18) 40%, transparent 68%)'
            : 'radial-gradient(ellipse 85% 45% at 50% 118%, rgba(74,144,245,.22) 0%, rgba(74,144,245,.07) 40%, transparent 65%)',
          transition: 'background 1.4s ease',
          pointerEvents: 'none',
        }} />

        {/* Layer 5 — Top/bottom darkening (frame the professor) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(3,7,16,.60) 0%, transparent 22%, transparent 55%, rgba(3,7,16,.92) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Professor — cinematic hero, ready for animated avatar */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 2, pointerEvents: 'none',
        }}>
          <img
            src={professorImg}
            alt="Professor Didier™"
            style={{
              height: '98%',
              width: 'auto',
              objectFit: 'contain',
              objectPosition: 'center bottom',
              filter: isConnected
                ? 'drop-shadow(0 0 55px rgba(74,144,245,.5)) drop-shadow(0 14px 45px rgba(0,0,0,.85))'
                : 'drop-shadow(0 14px 45px rgba(0,0,0,.75)) brightness(0.93)',
              transition: 'filter 1.1s ease',
            }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* LIVE / READY badge — always present, top-left */}
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 4,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(3,7,16,.82)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${isConnected ? 'rgba(239,68,68,.45)' : 'rgba(74,90,122,.3)'}`,
          borderRadius: 99, padding: '4px 12px',
          transition: 'border-color .5s',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isConnected ? '#EF4444' : '#4A5E7A',
            boxShadow: isConnected ? '0 0 8px #EF4444' : 'none',
            animation: isConnected ? 'ppeLive 1.2s infinite' : 'none',
          }} />
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.10em', color: isConnected ? '#EF4444' : '#4A5E7A' }}>
            {isConnected ? 'LIVE' : 'READY'}
          </span>
        </div>

        {/* Aladiah watermark — top-right */}
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 4,
          width: 34, height: 34,
          background: 'linear-gradient(135deg, #4A90F5, #9B59B6)',
          borderRadius: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, fontWeight: 900, color: '#fff',
          opacity: 0.62,
          boxShadow: '0 4px 16px rgba(0,0,0,.55)',
        }}>A</div>

        {/* Professor name + status — cinematic lower overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
          padding: '36px 20px 20px',
          background: 'linear-gradient(to top, rgba(3,7,16,1) 0%, rgba(3,7,16,.88) 50%, transparent 100%)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#EDF2F7', marginBottom: 2, letterSpacing: '.01em' }}>
            {professorName}
          </div>
          <div style={{ fontSize: 9.5, color: '#4A90F5', fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 9 }}>
            Founder & Lead Professor · Aladiah Academy
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(3,7,16,.72)',
              border: `1px solid ${isSpeaking ? 'rgba(74,144,245,.55)' : isConnected ? 'rgba(34,201,138,.45)' : 'rgba(255,255,255,.1)'}`,
              borderRadius: 99, padding: '4px 12px',
              boxShadow: isSpeaking ? '0 0 14px rgba(74,144,245,.25)' : isConnected ? '0 0 10px rgba(34,201,138,.15)' : 'none',
              transition: 'all .45s',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: isSpeaking ? '#4A90F5' : isConnected ? '#22C98A' : '#4A5E7A',
                animation: isConnected ? 'ppePulse 2s infinite' : 'none',
              }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: isSpeaking ? '#4A90F5' : isConnected ? '#22C98A' : '#4A5E7A' }}>
                {statusLabel}
              </span>
            </div>
            <AudioWaveform active={isConnected} speaking={isSpeaking} />
          </div>
        </div>
      </div>

      {/* ── TRANSCRIPT — glow separator, not a hard panel ─────────── */}
      {/* Glowing divider */}
      <div style={{
        height: 1, flexShrink: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(74,144,245,.45) 25%, rgba(155,89,182,.35) 75%, transparent 100%)',
      }} />

      {/* Transcript content */}
      <div style={{
        flexShrink: 0,
        background: 'linear-gradient(180deg, rgba(4,8,18,.98) 0%, rgba(5,10,20,.96) 100%)',
        padding: '14px 20px 18px',
        minHeight: 90,
      }}>
        {caption ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: '#4A90F5', letterSpacing: '.08em' }}>
                PROFESSOR DIDIER
              </span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(74,144,245,.2), transparent)' }} />
              <div style={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} style={{
                    width: 2, borderRadius: 99,
                    height: 2 + Math.abs(Math.sin(i * 0.72)) * 9,
                    background: `rgba(74,144,245,${0.2 + Math.abs(Math.sin(i * 0.72)) * 0.65})`,
                    animation: isSpeaking ? `ppeTw${i % 4} ${0.48 + (i % 4) * 0.11}s ease-in-out infinite alternate` : 'none',
                  }} />
                ))}
              </div>
            </div>
            <p style={{
              fontSize: 12.5, color: '#C8D8EC', lineHeight: 1.65, margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {caption}
            </p>
          </>
        ) : (
          <>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#1E2D47', letterSpacing: '.08em', display: 'block', marginBottom: 7 }}>
              PROFESSOR DIDIER
            </span>
            <p style={{ fontSize: 11, color: '#2A3D5A', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
              {isConnected
                ? 'Professor Didier is preparing to speak…'
                : 'Start the session — Professor Didier will greet you and begin teaching.'}
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes ppeLive  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.72)} }
        @keyframes ppePulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes ppeWave0 { from{height:2px} to{height:18px} }
        @keyframes ppeWave1 { from{height:3px} to{height:11px} }
        @keyframes ppeWave2 { from{height:2px} to{height:20px} }
        @keyframes ppeWave3 { from{height:4px} to{height:13px} }
        @keyframes ppeWave4 { from{height:2px} to{height:9px} }
        @keyframes ppeTw0   { from{height:3px} to{height:13px} }
        @keyframes ppeTw1   { from{height:2px} to{height:8px} }
        @keyframes ppeTw2   { from{height:3px} to{height:15px} }
        @keyframes ppeTw3   { from{height:2px} to{height:7px} }
      `}</style>
    </div>
  );
}
